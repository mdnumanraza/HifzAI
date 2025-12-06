import { create } from 'zustand';
import useStore from './useStore';

// Repeat modes
export const REPEAT_MODES = {
  REPEAT_EACH_X: 'REPEAT_EACH_X',
  LOOP_ALL: 'LOOP_ALL',
};

const initialState = {
  enabled: false,
  repeatMode: REPEAT_MODES.REPEAT_EACH_X,
  repeatCountPerAyah: 10,
  currentIndex: 0,
  currentRepeat: 0,
  isPlaying: false,
};

const useTravelModeStore = create((set, get) => ({
  ...initialState,

  setEnabled: (value) => set({ enabled: value }),
  setRepeatMode: (mode) => set({ repeatMode: mode }),
  setRepeatCount: (n) => set({ repeatCountPerAyah: Math.max(1, Number(n) || 1) }),
  setPlaying: (value) => set({ isPlaying: !!value }),

  startTravelSession: () => {
    const todayAyahs = useStore.getState().dailyAyahs || [];
    if (!todayAyahs || todayAyahs.length === 0) {
      set({ enabled: false, isPlaying: false });
      console.warn("No ayahs in today's set. Please configure daily memorization first.");
      return false;
    }
    set({ enabled: true, currentIndex: 0, currentRepeat: 0, isPlaying: true });
    return true;
  },

  stopTravelSession: () => {
    set({ ...initialState });
  },

  nextAyah: () => {
    const { currentIndex } = get();
    const todayAyahs = useStore.getState().dailyAyahs || [];
    if (todayAyahs.length === 0) return;
    const nextIndex = currentIndex + 1 < todayAyahs.length ? currentIndex + 1 : currentIndex;
    set({ currentIndex: nextIndex, currentRepeat: 0, isPlaying: true });
  },

  prevAyah: () => {
    const { currentIndex } = get();
    const todayAyahs = useStore.getState().dailyAyahs || [];
    if (todayAyahs.length === 0) return;
    const prevIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : 0;
    set({ currentIndex: prevIndex, currentRepeat: 0, isPlaying: true });
  },

  onAyahEnded: () => {
    const state = get();
    const todayAyahs = useStore.getState().dailyAyahs || [];
    if (!state.enabled || todayAyahs.length === 0) {
      set({ isPlaying: false });
      return;
    }

    if (state.repeatMode === REPEAT_MODES.REPEAT_EACH_X) {
      if (state.currentRepeat + 1 < state.repeatCountPerAyah) {
        set({ currentRepeat: state.currentRepeat + 1, isPlaying: true });
      } else {
        if (state.currentIndex + 1 < todayAyahs.length) {
          set({ currentIndex: state.currentIndex + 1, currentRepeat: 0, isPlaying: true });
        } else {
          set({ isPlaying: false });
        }
      }
    } else if (state.repeatMode === REPEAT_MODES.LOOP_ALL) {
      const nextIndex = state.currentIndex + 1 < todayAyahs.length ? state.currentIndex + 1 : 0;
      set({ currentIndex: nextIndex, currentRepeat: 0, isPlaying: true });
    }
  },

}));

export default useTravelModeStore;
