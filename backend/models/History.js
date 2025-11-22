import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  surah: { type: Number, required: true },
  ayah: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  action: { type: String, enum: ['memorized', 'reviewed'], required: true }
}, { timestamps: true });

// Index for faster queries by user and date
historySchema.index({ userId: 1, date: -1 });

export default mongoose.model('History', historySchema);
