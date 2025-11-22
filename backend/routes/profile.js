import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import User from '../models/User.js';
import MemorizationProgress from '../models/MemorizationProgress.js';

const router = express.Router();

// Get user profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user profile
router.put('/update', authMiddleware, async (req, res) => {
  try {
    const { name, bio, profilePicture } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (profilePicture) updateData.profilePicture = profilePicture;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select('-password');

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
});

// Award badge
router.post('/award-badge', authMiddleware, async (req, res) => {
  try {
    const { badgeId } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (!user.badges.includes(badgeId)) {
      user.badges.push(badgeId);
      await user.save();
    }

    res.json({ badges: user.badges });
  } catch (error) {
    res.status(500).json({ message: 'Failed to award badge', error: error.message });
  }
});

// Check and award surah completion
router.post('/complete-surah', authMiddleware, async (req, res) => {
  try {
    const { surahNumber } = req.body;
    
    const user = await User.findById(req.user._id);
    
    // Check if surah is already completed
    if (!user.completedSurahs.includes(surahNumber)) {
      user.completedSurahs.push(surahNumber);
      
      // Award surah badge
      const surahBadgeId = `surah_${surahNumber}`;
      if (!user.badges.includes(surahBadgeId)) {
        user.badges.push(surahBadgeId);
      }
      
      // Check if all 114 surahs are completed
      if (user.completedSurahs.length === 114) {
        user.hasCompletedQuran = true;
        // Award Khatm badge
        if (!user.badges.includes('khatm')) {
          user.badges.push('khatm');
        }
      }
      
      await user.save();
      
      res.json({ 
        completedSurahs: user.completedSurahs,
        badges: user.badges,
        hasCompletedQuran: user.hasCompletedQuran,
        newBadge: surahBadgeId
      });
    } else {
      res.json({ 
        message: 'Surah already completed',
        completedSurahs: user.completedSurahs 
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get profile stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const memorizedCount = await MemorizationProgress.countDocuments({
      userId: req.user._id,
      memorized: true
    });

    res.json({
      completedSurahs: user.completedSurahs,
      totalAyahsMemorized: memorizedCount,
      badges: user.badges,
      hasCompletedQuran: user.hasCompletedQuran
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
