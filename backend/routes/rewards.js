import express from 'express';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// POST /rewards/update - Update points, coins, and badges based on action
router.post('/update', authMiddleware, async (req, res) => {
  try {
    const { action, metadata } = req.body; // action: 'memorize_ayah' | 'complete_goal' | 'finish_surah' | 'streak_milestone'
    
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    let points = 0;
    let coins = 0;
    let newBadges = [];

    // Reward calculation based on action
    switch (action) {
      case 'memorize_ayah':
        points = 10;
        coins = 1;
        break;
      
      case 'complete_goal':
        points = 50;
        coins = 5;
        break;
      
      case 'finish_surah':
        points = 200;
        coins = 20;
        newBadges.push('Surah Champion');
        break;
      
      case 'streak_milestone':
        if (metadata?.days === 7) {
          points = 100;
          coins = 10;
          if (!user.badges.includes('Consistency Badge')) {
            newBadges.push('Consistency Badge');
          }
        } else if (metadata?.days === 30) {
          points = 300;
          coins = 50;
          if (!user.badges.includes('Dedicated Badge')) {
            newBadges.push('Dedicated Badge');
          }
        } else if (metadata?.days === 100) {
          points = 1000;
          coins = 100;
          if (!user.badges.includes('Century Streak')) {
            newBadges.push('Century Streak');
          }
        }
        break;
      
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

    // Update user rewards
    user.points += points;
    user.coins += coins;
    
    // Add new badges (avoid duplicates)
    newBadges.forEach(badge => {
      if (!user.badges.includes(badge)) {
        user.badges.push(badge);
      }
    });

    await user.save();

    res.json({
      message: 'Rewards updated',
      rewards: {
        points: user.points,
        coins: user.coins,
        badges: user.badges
      },
      added: {
        points,
        coins,
        newBadges
      }
    });
  } catch (error) {
    console.error('Error updating rewards:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /rewards - Get user rewards
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('points coins badges');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      points: user.points,
      coins: user.coins,
      badges: user.badges
    });
  } catch (error) {
    console.error('Error fetching rewards:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
