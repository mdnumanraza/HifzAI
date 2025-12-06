import { Router } from 'express';
import axios from 'axios';
import { authMiddleware } from '../middleware/auth.js';
import MemorizationProgress from '../models/MemorizationProgress.js';
import RevisionItem from '../models/RevisionItem.js';
import History from '../models/History.js';
import User from '../models/User.js';
import { getSurahMeta, getAyahWithAudio } from '../utils/quran.js';

const router = Router();

// Get daily ayahs based on user's dailyGoal & current position
router.get('/daily', authMiddleware, async (req, res) => {
	try {
		const user = req.user;
		const dailyAyahs = [];
		let surah = user.currentSurah;
		let ayah = user.currentAyah;
		for (let i = 0; i < user.dailyGoal; i++) {
			const surahMeta = await getSurahMeta(surah);
			if (ayah > surahMeta.ayahs) {
				surah += 1;
				ayah = 1;
			}
			const ayahData = await getAyahWithAudio(surah, ayah);
			dailyAyahs.push(ayahData);
			ayah += 1;
		}
		res.json({ dailyAyahs });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Failed to fetch daily ayahs' });
	}
});

// Mark ayah memorized and advance user currentAyah/currentSurah
router.post('/mark', authMiddleware, async (req, res) => {
	try {
		const { surah, ayah } = req.body;
		if (!surah || !ayah) return res.status(400).json({ message: 'Missing surah or ayah' });
		
		// Mark as memorized
		await MemorizationProgress.findOneAndUpdate(
			{ userId: req.user._id, surah, ayah },
			{ memorized: true },
			{ upsert: true, new: true }
		);

		// Add to revision list
		const existingRevision = await RevisionItem.findOne({
			userId: req.user._id,
			surah,
			ayah
		});
		if (!existingRevision) {
			await RevisionItem.create({
				userId: req.user._id,
				surah,
				ayah
			});
		}

		// Add to history
		await History.create({
			userId: req.user._id,
			surah,
			ayah,
			action: 'memorized'
		});

		// Update streak
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const lastCompleted = req.user.lastCompletedDate ? new Date(req.user.lastCompletedDate) : null;
		
		let streakUpdated = false;
		let milestone = null;
		let newBadge = null;

		if (lastCompleted) {
			lastCompleted.setHours(0, 0, 0, 0);
			const daysDiff = Math.floor((today - lastCompleted) / (1000 * 60 * 60 * 24));

			if (daysDiff === 1) {
				// Consecutive day - increment streak
				req.user.currentStreak += 1;
				if (req.user.currentStreak > req.user.highestStreak) {
					req.user.highestStreak = req.user.currentStreak;
				}
				streakUpdated = true;
			} else if (daysDiff > 1) {
				// Missed days - reset streak
				req.user.currentStreak = 1;
				streakUpdated = true;
			}
		} else {
			// First time completing
			req.user.currentStreak = 1;
			req.user.highestStreak = 1;
			streakUpdated = true;
		}

		if (streakUpdated) {
			req.user.lastCompletedDate = new Date();
			
			// Check for streak milestone badges
			const milestones = {
				7: 'Consistency Badge',
				30: 'Dedicated Badge',
				100: 'Century Streak'
			};

			if (milestones[req.user.currentStreak]) {
				milestone = req.user.currentStreak;
				newBadge = milestones[req.user.currentStreak];
				if (!req.user.badges.includes(newBadge)) {
					req.user.badges.push(newBadge);
				}
			}
		}

		// Update rewards (memorize_ayah)
		req.user.points += 10;
		req.user.coins += 1;

		// Check if daily goal completed
		const todayMemorized = await History.countDocuments({
			userId: req.user._id,
			action: 'memorized',
			date: { $gte: today }
		});

		let goalCompleted = false;
		if (todayMemorized >= req.user.dailyGoal) {
			req.user.points += 50;
			req.user.coins += 5;
			goalCompleted = true;
		}

		// Advance user position
		const meta = await getSurahMeta(req.user.currentSurah);
		let surahCompleted = null;
		
		if (req.user.currentAyah >= meta.ayahs) {
			// Finished a surah! Award bonus
			req.user.points += 200;
			req.user.coins += 20;
			
			// Mark surah as completed
			if (!req.user.completedSurahs.includes(req.user.currentSurah)) {
				req.user.completedSurahs.push(req.user.currentSurah);
				surahCompleted = req.user.currentSurah;
				
				// Award surah badge
				const surahBadgeId = `surah_${req.user.currentSurah}`;
				if (!req.user.badges.includes(surahBadgeId)) {
					req.user.badges.push(surahBadgeId);
					newBadge = { id: surahBadgeId, type: 'surah', surahNumber: req.user.currentSurah };
				}
			}
			
			if (!req.user.badges.includes('Surah Champion')) {
				req.user.badges.push('Surah Champion');
			}
			
			// Check if all 114 surahs completed
			if (req.user.completedSurahs.length === 114 && !req.user.hasCompletedQuran) {
				req.user.hasCompletedQuran = true;
				if (!req.user.badges.includes('khatm')) {
					req.user.badges.push('khatm');
					newBadge = { id: 'khatm', type: 'khatm' };
				}
			}
			
			req.user.currentSurah += 1;
			req.user.currentAyah = 1;
		} else {
			req.user.currentAyah += 1;
		}

		// Update total ayahs memorized count
		const totalMemorized = await MemorizationProgress.countDocuments({
			userId: req.user._id,
			memorized: true
		});
		req.user.totalAyahsMemorized = totalMemorized;

		// Check milestone badges
		const milestoneBadges = [
			{ count: 30, id: 'ayah_30' },
			{ count: 50, id: 'ayah_50' },
			{ count: 100, id: 'ayah_100' },
			{ count: 200, id: 'ayah_200' },
			{ count: 500, id: 'ayah_500' }
		];

		for (const mb of milestoneBadges) {
			if (totalMemorized >= mb.count && !req.user.badges.includes(mb.id)) {
				req.user.badges.push(mb.id);
				if (!newBadge) {
					newBadge = { id: mb.id, type: 'milestone' };
				}
			}
		}

		await req.user.save();

		res.json({
			message: 'Marked memorized',
			currentSurah: req.user.currentSurah,
			currentAyah: req.user.currentAyah,
			rewards: {
				points: req.user.points,
				coins: req.user.coins,
				badges: req.user.badges
			},
			streak: {
				current: req.user.currentStreak,
				highest: req.user.highestStreak,
				milestone,
				newBadge
			},
			goalCompleted,
			surahCompleted,
			newBadge,
			totalAyahsMemorized: req.user.totalAyahsMemorized,
			completedSurahs: req.user.completedSurahs,
			hasCompletedQuran: req.user.hasCompletedQuran
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Failed to mark memorized' });
	}
});

// Get user progress summary
router.get('/progress', authMiddleware, async (req, res) => {
	try {
		const userId = req.user._id;
		const memorizedDocs = await MemorizationProgress.find({ userId, memorized: true }).select('surah ayah');
		res.json({
			totalMemorized: memorizedDocs.length,
			currentSurah: req.user.currentSurah,
			currentAyah: req.user.currentAyah,
			memorizedAyahs: memorizedDocs.map(d => ({ surah: d.surah, ayah: d.ayah })),
			completedSurahs: req.user.completedSurahs || [],
			totalAyahsMemorized: req.user.totalAyahsMemorized || 0,
			hasCompletedQuran: req.user.hasCompletedQuran || false
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Failed to fetch progress' });
	}
});

// Get next batch of ayahs for prefetching/on-demand loading
router.get('/next-batch', authMiddleware, async (req, res) => {
	try {
		const user = req.user;
		const count = parseInt(req.query.count) || 10;
		const ayahs = [];
		
		let surah = user.currentSurah;
		let ayah = user.currentAyah;
		
		// Start from where daily goal would end
		for (let i = 0; i < user.dailyGoal; i++) {
			try {
				const surahMeta = await getSurahMeta(surah);
				if (ayah > surahMeta.ayahs) {
					surah += 1;
					ayah = 1;
				}
				ayah += 1;
			} catch (err) {
				console.error(`Failed to fetch surah meta for ${surah}`, err);
				// Continue with next iteration on error
				continue;
			}
		}
		
		// Now fetch the next batch with better error handling
		for (let i = 0; i < count && surah <= 114; i++) {
			try {
				const surahMeta = await getSurahMeta(surah);
				if (ayah > surahMeta.ayahs) {
					surah += 1;
					ayah = 1;
					// Check if we've reached the end of Quran
					if (surah > 114) break;
					// Get meta for new surah
					continue;
				}
				
				const ayahData = await getAyahWithAudio(surah, ayah);
				ayahs.push(ayahData);
				ayah += 1;
			} catch (err) {
				console.error(`Failed to fetch ayah ${surah}:${ayah}`, err);
				// Skip this ayah and continue
				ayah += 1;
			}
		}
		
		res.json({ ayahs });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Failed to fetch next batch' });
	}
});

// Get single ayah with audio for frontend
router.get('/ayah/:surah/:ayah', async (req, res) => {
	try {
		const { surah, ayah } = req.params;
		const ayahData = await getAyahWithAudio(parseInt(surah), parseInt(ayah));
		res.json(ayahData);
	} catch (err) {
		console.error('Error fetching ayah:', err);
		res.status(500).json({ message: 'Failed to fetch ayah data' });
	}
});

export default router;
