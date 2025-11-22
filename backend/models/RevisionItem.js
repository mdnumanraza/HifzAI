import mongoose from 'mongoose';

const revisionItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  surah: { type: Number, required: true },
  ayah: { type: Number, required: true },
  addedAt: { type: Date, default: Date.now },
  lastReviewedAt: { type: Date, default: null },
  reviewCount: { type: Number, default: 0 }
}, { timestamps: true });

// Index for faster queries
revisionItemSchema.index({ userId: 1, surah: 1, ayah: 1 });

export default mongoose.model('RevisionItem', revisionItemSchema);
