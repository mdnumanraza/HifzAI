import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import RecitationAnalysis from '../models/RecitationAnalysis.js';
import { compareRecitation } from '../utils/compareRecitation.js';
import { generateFeedback } from '../utils/generateFeedback.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for audio file uploads
const upload = multer({
  dest: path.join(__dirname, '../uploads/audio'),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept audio files
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'), false);
    }
  }
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

import { getAyahText } from '../utils/quran.js';

/**
 * Fetch expected ayah text from Al-Quran Cloud API
 */
async function fetchExpectedAyah(surah, ayah) {
  try {
    const ayahData = await getAyahText(surah, ayah);
    const data = { 
      status: 'OK', 
      data: { 
        text: ayahData.text, 
        surah: { name: ayahData.surahName },
        numberInSurah: ayahData.ayah 
      } 
    };
    
    if (data.status === 'OK') {
      return {
        text: data.data.text,
        surahName: data.data.surah.name,
        ayahNumber: data.data.numberInSurah
      };
    } else {
      throw new Error('Failed to fetch ayah from Al-Quran Cloud API');
    }
  } catch (error) {
    console.error('Error fetching expected ayah:', error);
    throw error;
  }
}

/**
 * Transcribe audio using Google Gemini API
 */
async function transcribeAudio(audioFilePath) {
  try {
    // Read the audio file
    const audioData = fs.readFileSync(audioFilePath);
    
    // Convert to base64
    const audioBase64 = audioData.toString('base64');
    
    // Get file extension to determine mime type
    const ext = path.extname(audioFilePath).toLowerCase();
    let mimeType = 'audio/wav';
    
    if (ext === '.mp3') mimeType = 'audio/mpeg';
    else if (ext === '.webm') mimeType = 'audio/webm';
    else if (ext === '.ogg') mimeType = 'audio/ogg';
    
    const prompt = `Please transcribe this Arabic Quranic recitation audio to text. Return only the Arabic text without any additional comments or explanations.`;
    
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: mimeType,
              data: audioBase64
            }
          }
        ]
      }],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.3,
      },
    });
    
    const transcription = result.response.text().trim();
    
    // Clean up any non-Arabic text that might have been added
    const arabicText = transcription.replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s]/g, '').trim();
    
    return arabicText;
  } catch (error) {
    console.error('Error transcribing audio with Gemini:', error);
    throw error;
  }
}

/**
 * Clean up uploaded file
 */
function cleanupFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Error cleaning up file:', error);
  }
}

/**
 * POST /ai/analyze-recitation
 * Analyze user's recitation audio and provide feedback
 */
router.post('/analyze-recitation', authMiddleware, upload.single('audioFile'), async (req, res) => {
  let audioFilePath = null;
  
  try {
    const { surah, ayah } = req.body;
    const userId = req.user.id;
    
    // Validate input
    if (!req.file) {
      return res.status(400).json({ error: 'Audio file is required' });
    }
    
    if (!surah || !ayah) {
      return res.status(400).json({ error: 'Surah and ayah numbers are required' });
    }
    
    const surahNum = parseInt(surah);
    const ayahNum = parseInt(ayah);
    
    if (surahNum < 1 || surahNum > 114) {
      return res.status(400).json({ error: 'Invalid surah number (1-114)' });
    }
    
    if (ayahNum < 1) {
      return res.status(400).json({ error: 'Invalid ayah number' });
    }
    
    audioFilePath = req.file.path;
    console.log(`Processing recitation analysis for user ${userId}, Surah ${surahNum}:${ayahNum}`);
    
    // Step 1: Fetch expected ayah text
    const expectedAyahData = await fetchExpectedAyah(surahNum, ayahNum);
    const expectedText = expectedAyahData.text;
    
    // Step 2: Transcribe audio using Whisper
    let userRecitedText;
    try {
      userRecitedText = await transcribeAudio(audioFilePath);
    } catch (error) {
      console.error('Transcription failed:', error);
      return res.status(500).json({ 
        error: 'Could not process audio. Please ensure clear audio quality and try again.' 
      });
    }
    
    // Check if transcription is empty
    if (!userRecitedText || userRecitedText.trim().length === 0) {
      return res.status(400).json({
        error: 'Recitation not detected. Please speak more clearly or check your microphone.'
      });
    }
    
    console.log('Expected text:', expectedText);
    console.log('User recited text:', userRecitedText);
    
    // Step 3: Compare recitation with expected text
    const comparisonResults = compareRecitation(expectedText, userRecitedText);
    
    // Step 4: Generate AI feedback
    let feedback;
    try {
      feedback = await generateFeedback(expectedText, userRecitedText, comparisonResults);
    } catch (error) {
      console.error('AI feedback generation failed:', error);
      // Use fallback feedback from comparison results
      feedback = {
        summary: comparisonResults.accuracy >= 0.8 
          ? 'Good recitation! Keep practicing to improve further.' 
          : 'Practice more to improve accuracy. Focus on clear pronunciation.',
        mistakes: [],
        improvements: ['Listen to correct recitation', 'Practice slowly'],
        tajweedTips: ['Focus on proper pronunciation', 'Learn basic Tajweed rules']
      };
    }
    
    // Step 5: Save analysis to database
    const analysisRecord = new RecitationAnalysis({
      userId,
      surah: surahNum,
      ayah: ayahNum,
      userRecitedText,
      expectedText,
      accuracy: comparisonResults.accuracy,
      wordDiff: comparisonResults.wordDiff,
      feedback,
      createdAt: new Date()
    });
    
    await analysisRecord.save();
    
    // Step 6: Check if ayah needs to be added to revision (accuracy < 0.85)
    let needsReview = false;
    if (comparisonResults.accuracy < 0.85) {
      needsReview = true;
      console.log(`Ayah ${surahNum}:${ayahNum} marked for review (accuracy: ${comparisonResults.accuracy})`);
    }
    
    // Clean up uploaded file
    cleanupFile(audioFilePath);
    
    // Step 7: Return analysis results
    const response = {
      userRecitedText,
      expectedText,
      accuracyScore: comparisonResults.accuracy,
      errorList: comparisonResults.wordDiff.filter(w => w.status !== 'correct'),
      aiFeedback: feedback,
      needsReview,
      timestamp: new Date().toISOString(),
      stats: comparisonResults.stats,
      missingWords: comparisonResults.missingWords,
      extraWords: comparisonResults.extraWords
    };
    
    console.log(`Analysis completed for user ${userId}, accuracy: ${comparisonResults.accuracy}`);
    
    res.json(response);
    
  } catch (error) {
    console.error('Error in recitation analysis:', error);
    
    // Clean up uploaded file in case of error
    if (audioFilePath) {
      cleanupFile(audioFilePath);
    }
    
    res.status(500).json({
      error: 'Internal server error during recitation analysis'
    });
  }
});

/**
 * GET /ai/recitation-history
 * Get user's recitation analysis history
 */
router.get('/recitation-history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, surah, ayah } = req.query;
    
    const filter = { userId };
    if (surah) filter.surah = parseInt(surah);
    if (ayah) filter.ayah = parseInt(ayah);
    
    const analyses = await RecitationAnalysis.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('surah ayah accuracy createdAt feedback.summary');
    
    const total = await RecitationAnalysis.countDocuments(filter);
    
    res.json({
      analyses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching recitation history:', error);
    res.status(500).json({ error: 'Failed to fetch recitation history' });
  }
});

/**
 * GET /ai/recitation-stats
 * Get user's overall recitation statistics
 */
router.get('/recitation-stats', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const stats = await RecitationAnalysis.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalRecitations: { $sum: 1 },
          averageAccuracy: { $avg: '$accuracy' },
          highestAccuracy: { $max: '$accuracy' },
          recentRecitations: { $sum: { $cond: [{ $gte: ['$createdAt', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)] }, 1, 0] } }
        }
      }
    ]);
    
    const result = stats[0] || {
      totalRecitations: 0,
      averageAccuracy: 0,
      highestAccuracy: 0,
      recentRecitations: 0
    };
    
    res.json(result);
    
  } catch (error) {
    console.error('Error fetching recitation stats:', error);
    res.status(500).json({ error: 'Failed to fetch recitation statistics' });
  }
});

export default router;