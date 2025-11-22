import express from 'express';
import History from '../models/History.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// POST /history/add - Add history entry
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { surah, ayah, action } = req.body;
    
    if (!surah || !ayah || !action) {
      return res.status(400).json({ error: 'Surah, ayah, and action are required' });
    }

    if (!['memorized', 'reviewed'].includes(action)) {
      return res.status(400).json({ error: 'Action must be "memorized" or "reviewed"' });
    }

    const historyEntry = new History({
      userId: req.user._id,
      surah,
      ayah,
      action
    });

    await historyEntry.save();

    res.json({
      message: 'History entry added',
      entry: historyEntry
    });
  } catch (error) {
    console.error('Error adding history:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /history - Get user history (grouped by date)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { limit = 50, skip = 0 } = req.query;

    const entries = await History.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    // Group by date
    const grouped = {};
    entries.forEach(entry => {
      const dateKey = entry.date.toISOString().split('T')[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push({
        surah: entry.surah,
        ayah: entry.ayah,
        action: entry.action,
        time: entry.date
      });
    });

    res.json({
      history: grouped,
      total: entries.length
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /history/stats - Get history statistics
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const totalMemorized = await History.countDocuments({
      userId: req.user._id,
      action: 'memorized'
    });

    const totalReviewed = await History.countDocuments({
      userId: req.user._id,
      action: 'reviewed'
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayMemorized = await History.countDocuments({
      userId: req.user._id,
      action: 'memorized',
      date: { $gte: today }
    });

    res.json({
      totalMemorized,
      totalReviewed,
      todayMemorized
    });
  } catch (error) {
    console.error('Error fetching history stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
