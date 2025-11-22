import { create } from 'zustand';
import { register, login } from '../api/auth.js';
import { getDaily, markMemorized, getProgress, updateSettings } from '../api/memorization.js';
import { 
  getStreak, getRewards, getRevisionList, getRevisionStats, 
  getHistory, getHistoryStats, markReviewed, removeFromRevision, 
  sendBackToMemorization 
} from '../api/phase2.js';
import { updateProfile as updateProfileAPI, getProfileStats } from '../api/profile.js';

const TOKEN_KEY = 'hifzflow_token';
const USER_KEY = 'hifzflow_user';
const TOKEN_EXPIRY_KEY = 'hifzflow_token_expiry';
const EXPIRY_DAYS = 5;

// Helper functions for localStorage
const saveToStorage = (token, user) => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + EXPIRY_DAYS);
  
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryDate.toISOString());
};

const clearStorage = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
};

const loadFromStorage = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  const userStr = localStorage.getItem(USER_KEY);
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);

  if (!token || !userStr || !expiry) {
    clearStorage();
    return null;
  }

  // Check if token expired
  const expiryDate = new Date(expiry);
  const now = new Date();
  
  if (now > expiryDate) {
    clearStorage();
    return null;
  }

  try {
    const user = JSON.parse(userStr);
    return { token, user };
  } catch (e) {
    clearStorage();
    return null;
  }
};

const useStore = create((set, get) => ({
  token: null,
  user: null,
  dailyAyahs: [],
  nextAyahBuffer: [], // Prefetched ayahs for instant loading
  progress: null,
  loading: false,
  error: null,
  loadingDaily: false,
  loadingSettings: false,
  isInitialized: false,
  fetchingMore: false, // For "Fetch More" button

  // Phase 2: Streak, Rewards, Revision, History
  streak: { current: 0, highest: 0, lastCompletedDate: null },
  rewards: { points: 0, coins: 0, badges: [] },
  revisionList: [],
  revisionStats: { totalRevisions: 0, reviewedToday: 0, pendingReview: 0, lastReviewed: null },
  history: {},
  historyStats: { totalMemorized: 0, totalReviewed: 0, todayMemorized: 0 },
  showMilestone: false,
  milestoneData: null,
  showConfetti: false,
  showBadgeCelebration: false,
  newBadgeData: null,

  // Audio Settings
  audioSpeed: 1.0,
  
  // Toast notifications
  toastMessage: null,
  toastType: null, // 'success' | 'error' | 'info'

  // Initialize auth from localStorage
  initAuth: () => {
    const stored = loadFromStorage();
    if (stored) {
      set({ token: stored.token, user: stored.user, isInitialized: true });
    } else {
      set({ isInitialized: true });
    }
  },

  setAuth: (token, user) => {
    saveToStorage(token, user);
    set({ token, user });
  },
  
  logout: () => {
    clearStorage();
    set({ token: null, user: null, dailyAyahs: [], progress: null });
  },

  signup: async (name, email, password, dailyGoal) => {
    try {
      set({ loading: true, error: null });
      const data = await register({ name, email, password, dailyGoal });
      get().setAuth(data.token, data.user);
      set({ loading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Signup failed', loading: false });
      return false;
    }
  },
  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const data = await login({ email, password });
      get().setAuth(data.token, data.user);
      set({ loading: false });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || 'Login failed', loading: false });
      return false;
    }
  },
  fetchDailyAyahs: async () => {
    try {
      set({ loadingDaily: true });
      const data = await getDaily();
      set({ dailyAyahs: data.dailyAyahs, loadingDaily: false });
      
      // Prefetch next ayahs in background
      get().prefetchMoreAyahs();
    } catch (err) {
      set({ loadingDaily: false });
    }
  },

  // Prefetch additional ayahs for instant loading
  prefetchMoreAyahs: async () => {
    try {
      const response = await fetch('/memorization/next-batch?count=15', {
        headers: {
          'Authorization': `Bearer ${get().token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        set({ nextAyahBuffer: data.ayahs || [] });
      }
    } catch (err) {
      console.error('Failed to prefetch ayahs:', err);
    }
  },

  // Fetch more ayahs on demand
  fetchNextBatch: async () => {
    try {
      set({ fetchingMore: true });
      const response = await fetch('/memorization/next-batch?count=10', {
        headers: {
          'Authorization': `Bearer ${get().token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const currentAyahs = get().dailyAyahs;
        set({ 
          dailyAyahs: [...currentAyahs, ...data.ayahs],
          fetchingMore: false 
        });
        
        get().showToast(`Added ${data.ayahs.length} more ayahs!`, 'success');
        
        // Refill buffer
        get().prefetchMoreAyahs();
      } else {
        set({ fetchingMore: false });
        get().showToast('Failed to fetch more ayahs', 'error');
      }
    } catch (err) {
      console.error('Failed to fetch next batch:', err);
      set({ fetchingMore: false });
      get().showToast('Failed to fetch more ayahs', 'error');
    }
  },

  // Optimistic UI for marking memorized
  markAyahCompletedOptimistic: async (surah, ayah) => {
    const state = get();
    const user = state.user;
    const dailyGoal = user?.dailyGoal || 5;
    
    // 1. Store original state for rollback
    const originalDailyAyahs = [...state.dailyAyahs];
    const originalRevisionList = [...state.revisionList];
    const originalNextBuffer = [...state.nextAyahBuffer];
    
    // 2. Find and remove the ayah from daily list
    const completedAyah = state.dailyAyahs.find(a => a.surah === surah && a.ayah === ayah);
    const updatedDailyAyahs = state.dailyAyahs.filter(a => !(a.surah === surah && a.ayah === ayah));
    
    // 3. Check if daily goal is completed
    const ayahsCompletedToday = originalDailyAyahs.length - updatedDailyAyahs.length;
    const isDailyGoalCompleted = updatedDailyAyahs.length === 0 && originalDailyAyahs.length >= dailyGoal;
    
    // 4. Determine next ayahs to show
    let newDailyAyahs = updatedDailyAyahs;
    let newBuffer = [...originalNextBuffer];
    
    if (!isDailyGoalCompleted && newBuffer.length > 0) {
      // Still have goal to complete - add from buffer
      const nextAyah = newBuffer.shift();
      newDailyAyahs = [...updatedDailyAyahs, nextAyah];
    }
    
    // 5. Optimistically add to revision list
    const newRevisionItem = {
      surah,
      ayah,
      addedAt: new Date().toISOString(),
      lastReviewedAt: null,
      reviewCount: 0
    };
    
    // 6. Update UI immediately
    set({
      dailyAyahs: newDailyAyahs,
      nextAyahBuffer: newBuffer,
      revisionList: [newRevisionItem, ...originalRevisionList]
    });
    
    // 7. Show daily goal completion celebration if applicable
    if (isDailyGoalCompleted) {
      setTimeout(() => {
        set({ 
          showMilestone: true, 
          milestoneData: {
            type: 'daily_goal_complete',
            title: 'Daily Goal Complete!',
            message: `Congratulations! You've completed your daily goal of ${dailyGoal} ayahs.`,
            icon: '🎉',
            showNextOptions: true
          },
          showConfetti: true 
        });
      }, 800);
    }
    
    // 8. Call backend in background
    try {
      const response = await markMemorized(surah, ayah);
      
      // Update rewards and achievements
      if (response.rewards) {
        set({ rewards: response.rewards });
      }
      
      if (response.streak) {
        set({ streak: response.streak });
        
        if (response.streak.milestone && !isDailyGoalCompleted) {
          set({ 
            showMilestone: true, 
            milestoneData: response.streak.milestone,
            showConfetti: true 
          });
        }
      }

      // Update user data with new achievements
      const currentUser = get().user;
      if (response.completedSurahs) {
        set({ 
          user: { 
            ...currentUser, 
            completedSurahs: response.completedSurahs,
            totalAyahsMemorized: response.totalAyahsMemorized,
            badges: response.rewards?.badges || currentUser.badges,
            hasCompletedQuran: response.hasCompletedQuran
          } 
        });
      }

      // Show badge celebration if new badge earned (and not already showing daily goal)
      if (response.newBadge && !isDailyGoalCompleted) {
        setTimeout(() => {
          set({ 
            showBadgeCelebration: true, 
            newBadgeData: { badgeId: response.newBadge.id },
            showConfetti: true 
          });
        }, 500);
      }
      
      // Update progress and revision stats in background
      get().fetchProgress();
      get().fetchRevisionStats();
      
      // Refill buffer if running low
      if (newBuffer.length < 5) {
        get().prefetchMoreAyahs();
      }
      
      // Show success toast
      get().showToast('Ayah marked as memorized!', 'success');
      
    } catch (err) {
      console.error('Failed to mark memorized, rolling back:', err);
      
      // Rollback on error
      set({
        dailyAyahs: originalDailyAyahs,
        nextAyahBuffer: originalNextBuffer,
        revisionList: originalRevisionList
      });
      
      // Show error toast
      get().showToast('Failed to mark as memorized. Please try again.', 'error');
    }
  },

  // Legacy method - kept for backward compatibility but not used in optimistic flow
  markMemorized: async (surah, ayah) => {
    try {
      const response = await markMemorized(surah, ayah);
      
      // Update local state with backend response
      if (response.rewards) {
        set({ rewards: response.rewards });
      }
      if (response.streak) {
        set({ streak: response.streak });
        
        // Show milestone celebration if applicable
        if (response.streak.milestone) {
          set({ 
            showMilestone: true, 
            milestoneData: response.streak.milestone,
            showConfetti: true 
          });
        }
      }

      // Update user data with new achievements
      const currentUser = get().user;
      if (response.completedSurahs) {
        set({ 
          user: { 
            ...currentUser, 
            completedSurahs: response.completedSurahs,
            totalAyahsMemorized: response.totalAyahsMemorized,
            badges: response.rewards?.badges || currentUser.badges,
            hasCompletedQuran: response.hasCompletedQuran
          } 
        });
      }

      // Show badge celebration if new badge earned
      if (response.newBadge) {
        setTimeout(() => {
          set({ 
            showBadgeCelebration: true, 
            newBadgeData: { badgeId: response.newBadge.id },
            showConfetti: true 
          });
        }, 500);
      }
      
      await get().fetchProgress();
      await get().fetchDailyAyahs();
      await get().fetchRevisionList();
      await get().fetchRevisionStats();
    } catch (err) {
      console.error('Error marking memorized:', err);
    }
  },
  fetchProgress: async () => {
    try {
      const data = await getProgress();
      set({ progress: data });
      
      // Sync completedSurahs and other achievement data to user object
      const currentUser = get().user;
      if (currentUser && data.completedSurahs) {
        set({ 
          user: { 
            ...currentUser, 
            completedSurahs: data.completedSurahs,
            totalAyahsMemorized: data.totalAyahsMemorized,
            hasCompletedQuran: data.hasCompletedQuran
          } 
        });
        
        // Update localStorage
        const token = get().token;
        if (token) {
          saveToStorage(token, { 
            ...currentUser, 
            completedSurahs: data.completedSurahs,
            totalAyahsMemorized: data.totalAyahsMemorized,
            hasCompletedQuran: data.hasCompletedQuran
          });
        }
      }
    } catch (err) {}
  },
  updateSettings: async (payload) => {
    try {
      set({ loadingSettings: true });
      const data = await updateSettings(payload);
      set({ user: { ...get().user, ...data.user }, loadingSettings: false });
      await get().fetchProgress();
    } catch (err) {
      set({ loadingSettings: false });
    }
  },

  // Phase 2 Actions
  fetchStreak: async () => {
    try {
      const data = await getStreak();
      set({ streak: data });
    } catch (err) {
      console.error('Error fetching streak:', err);
    }
  },

  fetchRewards: async () => {
    try {
      const data = await getRewards();
      set({ rewards: data });
    } catch (err) {
      console.error('Error fetching rewards:', err);
    }
  },

  fetchRevisionList: async () => {
    try {
      const data = await getRevisionList();
      set({ revisionList: data.items || [] });
    } catch (err) {
      console.error('Error fetching revision list:', err);
    }
  },

  fetchRevisionStats: async () => {
    try {
      const data = await getRevisionStats();
      set({ revisionStats: data });
    } catch (err) {
      console.error('Error fetching revision stats:', err);
    }
  },

  markAsReviewed: async (surah, ayah) => {
    try {
      await markReviewed(surah, ayah);
      await get().fetchRevisionList();
      await get().fetchRevisionStats();
      await get().fetchHistory();
    } catch (err) {
      console.error('Error marking as reviewed:', err);
    }
  },

  removeRevision: async (surah, ayah) => {
    try {
      await removeFromRevision(surah, ayah);
      await get().fetchRevisionList();
      await get().fetchRevisionStats();
    } catch (err) {
      console.error('Error removing from revision:', err);
    }
  },

  sendBack: async (surah, ayah) => {
    try {
      await sendBackToMemorization(surah, ayah);
      await get().fetchRevisionList();
      await get().fetchDailyAyahs();
    } catch (err) {
      console.error('Error sending back:', err);
    }
  },

  fetchHistory: async (limit, skip) => {
    try {
      const data = await getHistory(limit, skip);
      set({ history: data.history || {} });
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  },

  fetchHistoryStats: async () => {
    try {
      const data = await getHistoryStats();
      set({ historyStats: data });
    } catch (err) {
      console.error('Error fetching history stats:', err);
    }
  },

  closeMilestone: () => {
    set({ showMilestone: false, milestoneData: null });
  },

  hideConfetti: () => {
    set({ showConfetti: false });
  },

  closeBadgeCelebration: () => {
    set({ showBadgeCelebration: false, newBadgeData: null });
  },

  // Audio Settings
  setAudioSpeed: (speed) => {
    set({ audioSpeed: speed });
  },
  
  // Toast notifications
  showToast: (message, type = 'info') => {
    set({ toastMessage: message, toastType: type });
    setTimeout(() => set({ toastMessage: null, toastType: null }), 3000);
  },
  
  clearToast: () => {
    set({ toastMessage: null, toastType: null });
  },

  // Profile management
  updateProfile: async (profileData) => {
    try {
      const data = await updateProfileAPI(profileData);
      set({ user: data.user });
      // Update localStorage
      const token = get().token;
      saveToStorage(token, data.user);
      return true;
    } catch (err) {
      console.error('Failed to update profile:', err);
      return false;
    }
  },

  fetchProfileStats: async () => {
    try {
      const data = await getProfileStats();
      const currentUser = get().user;
      set({ 
        user: { 
          ...currentUser, 
          completedSurahs: data.completedSurahs,
          totalAyahsMemorized: data.totalAyahsMemorized,
          badges: data.badges,
          hasCompletedQuran: data.hasCompletedQuran
        } 
      });
    } catch (err) {
      console.error('Failed to fetch profile stats:', err);
    }
  },

  awardBadge: (badgeData) => {
    set({ 
      showBadgeCelebration: true, 
      newBadgeData: badgeData,
      showConfetti: true 
    });
  },

  // Fetch all Phase 2 data on initialization
  fetchPhase2Data: async () => {
    await Promise.all([
      get().fetchStreak(),
      get().fetchRewards(),
      get().fetchRevisionStats(),
      get().fetchHistoryStats(),
      get().fetchProfileStats()
    ]);
  }
}));

export default useStore;
