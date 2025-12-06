import mongoose from 'mongoose';

const recitationAnalysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  surah: {
    type: Number,
    required: true,
    min: 1,
    max: 114
  },
  ayah: {
    type: Number,
    required: true,
    min: 1
  },
  userRecitedText: {
    type: String,
    required: true
  },
  expectedText: {
    type: String,
    required: true
  },
  accuracy: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  wordDiff: [{
    word: String,
    status: {
      type: String,
      enum: ['correct', 'partial', 'incorrect', 'missing', 'extra']
    },
    issue: String,
    position: Number
  }],
  feedback: {
    summary: String,
    mistakes: [String],
    improvements: [String],
    tajweedTips: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
recitationAnalysisSchema.index({ userId: 1, createdAt: -1 });
recitationAnalysisSchema.index({ userId: 1, surah: 1, ayah: 1 });

export default mongoose.model('RecitationAnalysis', recitationAnalysisSchema);