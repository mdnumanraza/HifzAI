import express from 'express';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// POST /streak/update - Update streak when user completes an ayah
router.post('/update', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastCompleted = user.lastCompletedDate ? new Date(user.lastCompletedDate) : null;
    
    if (lastCompleted) {
      lastCompleted.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today - lastCompleted) / (1000 * 60 * 60 * 24));

      if (daysDiff === 0) {
        // Already completed today, no streak update needed
        return res.json({ 
          message: 'Already completed today',
          currentStreak: user.currentStreak,
          highestStreak: user.highestStreak
        });
      } else if (daysDiff === 1) {
        // Consecutive day - increment streak
        user.currentStreak += 1;
        if (user.currentStreak > user.highestStreak) {
          user.highestStreak = user.currentStreak;
        }
      } else {
        // Missed days - reset streak
        user.currentStreak = 1;
      }
    } else {
      // First time completing
      user.currentStreak = 1;
      user.highestStreak = 1;
    }

    user.lastCompletedDate = new Date();
    await user.save();

    // Check for streak milestone badges
    const milestones = {
      7: 'Consistency Badge',
      30: 'Dedicated Badge',
      100: 'Century Streak'
    };

    const newBadge = milestones[user.currentStreak];
    const milestone = newBadge ? user.currentStreak : null;

    res.json({
      message: 'Streak updated',
      currentStreak: user.currentStreak,
      highestStreak: user.highestStreak,
      milestone,
      newBadge
    });
  } catch (error) {
    console.error('Error updating streak:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /streak - Get current streak info
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('currentStreak highestStreak lastCompletedDate');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      currentStreak: user.currentStreak,
      highestStreak: user.highestStreak,
      lastCompletedDate: user.lastCompletedDate
    });
  } catch (error) {
    console.error('Error fetching streak:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
