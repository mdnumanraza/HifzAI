import { Router } from 'express';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';
const router = Router();

// Update user settings: dailyGoal, currentSurah, currentAyah
router.patch('/settings', authMiddleware, async (req, res) => {
	try {
		const { dailyGoal, currentSurah, currentAyah } = req.body;
		if (dailyGoal !== undefined) req.user.dailyGoal = dailyGoal;
		if (currentSurah !== undefined) req.user.currentSurah = currentSurah;
		if (currentAyah !== undefined) req.user.currentAyah = currentAyah;
		await req.user.save();
		res.json({
			user: {
				id: req.user._id,
				name: req.user.name,
				email: req.user.email,
				dailyGoal: req.user.dailyGoal,
				currentSurah: req.user.currentSurah,
				currentAyah: req.user.currentAyah
			}
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
});

export default router;
