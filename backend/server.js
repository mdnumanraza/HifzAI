import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import memorizationRoutes from './routes/memorization.js';
import streakRoutes from './routes/streak.js';
import rewardsRoutes from './routes/rewards.js';
import revisionRoutes from './routes/revision.js';
import historyRoutes from './routes/history.js';
import profileRoutes from './routes/profile.js';
import { connectDB } from './config/db.js';

dotenv.config();

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/memorization', memorizationRoutes);
app.use('/streak', streakRoutes);
app.use('/rewards', rewardsRoutes);
app.use('/revision', revisionRoutes);
app.use('/history', historyRoutes);
app.use('/profile', profileRoutes);

// Placeholder cron (Phase 2 logic TBD)
cron.schedule('0 0 * * *', () => {
  console.log('Daily cron placeholder - Phase 2 feature');
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
});
