import React, { useState } from 'react';
import { REPEAT_MODES } from '../../store/useTravelModeStore';
import useTravelModeStore from '../../store/useTravelModeStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Repeat, Infinity as InfinityIcon, Sparkles, Waves } from 'lucide-react';

const TravelModeConfigModal = ({ onClose }) => {
  const setRepeatMode = useTravelModeStore((s) => s.setRepeatMode);
  const setRepeatCount = useTravelModeStore((s) => s.setRepeatCount);
  const startTravelSession = useTravelModeStore((s) => s.startTravelSession);

  const [mode, setMode] = useState(REPEAT_MODES.REPEAT_EACH_X);
  const [count, setCount] = useState(10);

  const onConfirm = () => {
    setRepeatMode(mode);
    setRepeatCount(count);
    const ok = startTravelSession();
    if (ok) onClose?.();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Animated ambient background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={onClose}
          style={{
            background:
              'radial-gradient(1200px 600px at 10% 20%, rgba(255,255,255,0.06), transparent 60%), radial-gradient(1000px 500px at 90% 80%, rgba(255,255,255,0.05), transparent 60%), linear-gradient(135deg, rgba(20,24,35,0.85) 0%, rgba(24,28,40,0.75) 100%)',
          }}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-md rounded-2xl p-6 shadow-2xl backdrop-blur-xl border border-white/10"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(240,240,255,0.14) 100%)',
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-gold-primary flex items-center justify-center shadow-inner">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Travel Mode</h2>
              <p className="text-sm text-white/80">Hands-free listening. No progress updates.</p>
            </div>
            <Sparkles className="ml-auto w-5 h-5 text-gold-primary/80" />
          </div>

          {/* Decorative gradient line */}
          <div className="mt-4 h-px w-full bg-gradient-to-r from-gold-primary/60 via-white/20 to-gold-primary/60" />

        <div className="mt-4 space-y-3">
          <label className="flex items-center gap-2 p-3 rounded-xl bg-white/6 border border-white/10 hover:bg-white/10 transition-colors">
            <input
              type="radio"
              name="playbackMode"
              checked={mode === REPEAT_MODES.REPEAT_EACH_X}
              onChange={() => setMode(REPEAT_MODES.REPEAT_EACH_X)}
            />
            <span className="text-sm text-white flex items-center gap-2">
              <Repeat className="w-4 h-4 text-gold-primary" /> Repeat each ayah {count} times, then move to next
            </span>
          </label>

          {mode === REPEAT_MODES.REPEAT_EACH_X && (
            <div className="px-3">
              <label className="text-sm text-white">Repeat each ayah</label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  min={1}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value) || 1)}
                  className="w-24 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60"
                />
                <span className="text-sm text-white/90">times</span>
              </div>
            </div>
          )}

          <label className="flex items-center gap-2 p-3 rounded-xl bg-white/6 border border-white/10 hover:bg-white/10 transition-colors">
            <input
              type="radio"
              name="playbackMode"
              checked={mode === REPEAT_MODES.LOOP_ALL}
              onChange={() => setMode(REPEAT_MODES.LOOP_ALL)}
            />
            <span className="text-sm text-white flex items-center gap-2">
              <InfinityIcon className="w-4 h-4 text-gold-primary" /> Play all ayahs and loop the whole set
            </span>
          </label>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/15">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-full bg-gradient-to-r from-gold-primary to-amber-300 text-emerald-950 font-semibold shadow-lg hover:from-amber-300 hover:to-gold-primary">Start</button>
        </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TravelModeConfigModal;
