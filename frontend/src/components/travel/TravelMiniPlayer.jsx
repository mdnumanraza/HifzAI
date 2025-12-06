import React from 'react';
import { motion } from 'framer-motion';
import { Headphones, SkipBack, SkipForward, Play, Pause, StopCircle } from 'lucide-react';
import useTravelModeStore from '../../store/useTravelModeStore';
import useQuranStore from '../../store/useQuranStore';

const TravelMiniPlayer = () => {
  const enabled = useTravelModeStore((s) => s.enabled);
  const isPlaying = useTravelModeStore((s) => s.isPlaying);
  const setPlaying = useTravelModeStore((s) => s.setPlaying);
  const stopTravelSession = useTravelModeStore((s) => s.stopTravelSession);
  const currentIndex = useTravelModeStore((s) => s.currentIndex);
  const nextAyah = useTravelModeStore((s) => s.nextAyah);
  const prevAyah = useTravelModeStore((s) => s.prevAyah);

  const todayAyahs = useQuranStore((s) => s.todayAyahs || []);
  const current = todayAyahs[currentIndex];

  if (!enabled) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40">
      {/* Ambient ocean-like animated background (SVG waves) */}
      <div className="absolute inset-x-0 bottom-0 h-36 pointer-events-none">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
          <defs>
            <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(56,189,248,0.35)" />
              <stop offset="100%" stopColor="rgba(16,185,129,0.35)" />
            </linearGradient>
          </defs>
          <path
            d="M0,30 C150,90 350,0 600,30 C850,60 1050,20 1200,40 L1200,120 L0,120 Z"
            fill="url(#waveGrad)"
            className="animate-[wave1_12s_ease-in-out_infinite]"
            style={{ opacity: 0.25 }}
          />
          <path
            d="M0,50 C200,0 400,80 600,50 C800,20 1000,60 1200,30 L1200,120 L0,120 Z"
            fill="url(#waveGrad)"
            className="animate-[wave2_16s_ease-in-out_infinite]"
            style={{ opacity: 0.18 }}
          />
          <style>{`
            @keyframes wave1 { 0% { transform: translateX(0); } 50% { transform: translateX(-20px); } 100% { transform: translateX(0); } }
            @keyframes wave2 { 0% { transform: translateX(0); } 50% { transform: translateX(20px); } 100% { transform: translateX(0); } }
          `}</style>
        </svg>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-xl border border-white/10 relative"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(240,240,255,0.12) 100%)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 text-slate-700 flex items-center justify-center shadow-inner">
              <Headphones className="w-5 h-5" />
            </div>
            <span className="px-2 py-1 rounded-full bg-gradient-to-r from-emerald-600 to-sky-500 text-white text-xs shadow-md">Travel Mode ON</span>
            {current && (
              <div className="text-sm text-white">
                Surah {current.surahName} • Ayah {current.ayah}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={prevAyah} className="px-3 py-2 rounded-xl bg-white/10 text-slate-800 border border-white/20 hover:bg-white/15 flex items-center gap-1 shadow-sm">
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPlaying(!isPlaying)}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg ${
                isPlaying
                  ? 'bg-gradient-to-r from-emerald-500 to-sky-400 text-emerald-950'
                  : 'bg-white/10 text-white border border-white/20 hover:bg-white/15'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span className="text-sm font-semibold">{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button onClick={nextAyah} className="px-3 py-2 rounded-xl bg-white/10 text-slate-800 border border-white/20 hover:bg-white/15 flex items-center gap-1 shadow-sm">
              <SkipForward className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                // Immediately pause via store before resetting session
                setPlaying(false);
                stopTravelSession();
              }}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-rose-500/80 to-amber-400/80 text-white shadow-lg hover:from-rose-400 hover:to-amber-300 flex items-center gap-2"
            >
              <StopCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">Stop</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TravelMiniPlayer;
