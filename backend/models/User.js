import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dailyGoal: { type: Number, default: 5 },
  currentSurah: { type: Number, default: 1 },
  currentAyah: { type: Number, default: 1 },
  // Profile
  profilePicture: { type: String, default: 'kaaba' }, // icon name or uploaded URL
  bio: { type: String, default: '' },
  // Streak System
  currentStreak: { type: Number, default: 0 },
  highestStreak: { type: Number, default: 0 },
  lastCompletedDate: { type: Date, default: null },
  // Reward System
  points: { type: Number, default: 0 },
  coins: { type: Number, default: 0 },
  badges: { type: [String], default: [] },
  // Achievement tracking
  completedSurahs: { type: [Number], default: [] }, // Array of completed surah numbers
  totalAyahsMemorized: { type: Number, default: 0 },
  hasCompletedQuran: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
