import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signToken } from '../utils/jwt.js';

const router = Router();

// Register
router.post('/register', async (req, res) => {
	try {
		const { name, email, password, dailyGoal } = req.body;
		if (!name || !email || !password) {
			return res.status(400).json({ message: 'Missing required fields' });
		}
		const existing = await User.findOne({ email });
		if (existing) {
			return res.status(409).json({ message: 'Email already registered' });
		}
		const hash = await bcrypt.hash(password, 10);
		const user = await User.create({ name, email, password: hash, dailyGoal });
		const token = signToken(user);
		res.json({
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				dailyGoal: user.dailyGoal,
				currentSurah: user.currentSurah,
				currentAyah: user.currentAyah,
				completedSurahs: user.completedSurahs || [],
				totalAyahsMemorized: user.totalAyahsMemorized || 0,
				hasCompletedQuran: user.hasCompletedQuran || false,
				profilePicture: user.profilePicture || 'kaaba',
				bio: user.bio || '',
				badges: user.badges || []
			}
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
});

// Login
router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });
		const user = await User.findOne({ email });
		if (!user) return res.status(401).json({ message: 'Invalid credentials' });
		const match = await bcrypt.compare(password, user.password);
		if (!match) return res.status(401).json({ message: 'Invalid credentials' });
		const token = signToken(user);
		res.json({
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				dailyGoal: user.dailyGoal,
				currentSurah: user.currentSurah,
				currentAyah: user.currentAyah,
				completedSurahs: user.completedSurahs || [],
				totalAyahsMemorized: user.totalAyahsMemorized || 0,
				hasCompletedQuran: user.hasCompletedQuran || false,
				profilePicture: user.profilePicture || 'kaaba',
				bio: user.bio || '',
				badges: user.badges || []
			}
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
});

export default router;
