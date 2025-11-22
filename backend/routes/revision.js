import express from 'express';
import RevisionItem from '../models/RevisionItem.js';
import MemorizationProgress from '../models/MemorizationProgress.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// POST /revision/add - Add ayah to revision list
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { surah, ayah } = req.body;
    
    if (!surah || !ayah) {
      return res.status(400).json({ error: 'Surah and ayah are required' });
    }

    // Check if already in revision
    const existing = await RevisionItem.findOne({
      userId: req.user._id,
      surah,
      ayah
    });

    if (existing) {
      return res.json({ message: 'Already in revision list', item: existing });
    }

    const revisionItem = new RevisionItem({
      userId: req.user._id,
      surah,
      ayah
    });

    await revisionItem.save();

    res.json({
      message: 'Added to revision list',
      item: revisionItem
    });
  } catch (error) {
    console.error('Error adding to revision:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /revision/list - Get all revision items for user
router.get('/list', authMiddleware, async (req, res) => {
  try {
    const items = await RevisionItem.find({ userId: req.user._id })
      .sort({ addedAt: -1 });

    res.json({ items });
  } catch (error) {
    console.error('Error fetching revision list:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /revision/remove - Remove ayah from revision list
router.post('/remove', authMiddleware, async (req, res) => {
  try {
    const { surah, ayah } = req.body;

    const result = await RevisionItem.findOneAndDelete({
      userId: req.user._id,
      surah,
      ayah
    });

    if (!result) {
      return res.status(404).json({ error: 'Item not found in revision list' });
    }

    res.json({ message: 'Removed from revision list' });
  } catch (error) {
    console.error('Error removing from revision:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /revision/mark-reviewed - Mark ayah as reviewed
router.post('/mark-reviewed', authMiddleware, async (req, res) => {
  try {
    const { surah, ayah } = req.body;

    const item = await RevisionItem.findOne({
      userId: req.user._id,
      surah,
      ayah
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found in revision list' });
    }

    item.lastReviewedAt = new Date();
    item.reviewCount += 1;
    await item.save();

    res.json({
      message: 'Marked as reviewed',
      item
    });
  } catch (error) {
    console.error('Error marking as reviewed:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /revision/send-back - Move ayah back to memorization
router.post('/send-back', authMiddleware, async (req, res) => {
  try {
    const { surah, ayah } = req.body;

    // Remove from revision
    await RevisionItem.findOneAndDelete({
      userId: req.user._id,
      surah,
      ayah
    });

    // Remove memorized status
    await MemorizationProgress.findOneAndUpdate(
      { userId: req.user._id, surah, ayah },
      { memorized: false }
    );

    res.json({ message: 'Moved back to memorization' });
  } catch (error) {
    console.error('Error sending back to memorization:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /revision/stats - Get revision statistics
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const items = await RevisionItem.find({ userId: req.user._id });
    
    const totalRevisions = items.length;
    const reviewedToday = items.filter(item => {
      if (!item.lastReviewedAt) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const reviewDate = new Date(item.lastReviewedAt);
      reviewDate.setHours(0, 0, 0, 0);
      return reviewDate.getTime() === today.getTime();
    }).length;
    
    const pendingReview = totalRevisions - reviewedToday;
    const lastReviewed = items
      .filter(item => item.lastReviewedAt)
      .sort((a, b) => new Date(b.lastReviewedAt) - new Date(a.lastReviewedAt))[0];

    res.json({
      totalRevisions,
      reviewedToday,
      pendingReview,
      lastReviewed: lastReviewed?.lastReviewedAt || null
    });
  } catch (error) {
    console.error('Error fetching revision stats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
