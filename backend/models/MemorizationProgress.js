import mongoose from 'mongoose';

const memorizationProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  surah: { type: Number, required: true },
  ayah: { type: Number, required: true },
  memorized: { type: Boolean, default: false }
}, { timestamps: true });

memorizationProgressSchema.index({ userId: 1, surah: 1, ayah: 1 }, { unique: true });

export default mongoose.model('MemorizationProgress', memorizationProgressSchema);
