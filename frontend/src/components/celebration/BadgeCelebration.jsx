import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Star, Sparkles, Crown, Flame, Zap } from 'lucide-react';
import useStore from '../../store/useStore.js';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';
import { surahBadges, milestoneBadges } from '../../data/badges.js';

export default function BadgeCelebration() {
  const showBadgeCelebration = useStore(s => s.showBadgeCelebration);
  const newBadgeData = useStore(s => s.newBadgeData);
  const closeBadgeCelebration = useStore(s => s.closeBadgeCelebration);
  const hideConfetti = useStore(s => s.hideConfetti);

  useEffect(() => {
    if (showBadgeCelebration) {
      // Auto-hide confetti after 5 seconds
      const timer = setTimeout(() => {
        hideConfetti();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showBadgeCelebration, hideConfetti]);

  if (!showBadgeCelebration || !newBadgeData) return null;

  // Find badge details
  const allBadges = [...surahBadges, ...milestoneBadges];
  const badge = allBadges.find(b => b.id === newBadgeData.badgeId);

  if (!badge) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Ambient animated background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(1200px 600px at 10% 20%, rgba(255,255,255,0.08), transparent 60%), radial-gradient(1000px 500px at 90% 80%, rgba(255,255,255,0.06), transparent 60%), linear-gradient(135deg, rgba(20,24,35,0.85) 0%, rgba(24,28,40,0.75) 100%)',
          }}
      >
        </motion.div>
        <motion.div
          initial={{ scale: 0.5, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0.5, rotate: 10 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="relative max-w-lg w-full"
        >
          <div
            className="relative overflow-hidden rounded-2xl shadow-2xl backdrop-blur-xl border border-white/10"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(240,240,255,0.12) 100%)',
            }}
          >
            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-2xl p-[2px]" style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.35), rgba(255,215,0,0.25))'
            }} />
            <div className="relative rounded-2xl">
            {/* Close button */}
            <button
              onClick={closeBadgeCelebration}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/15 hover:bg-white/25 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Decorative stars */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    scale: [0, 1, 0],
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 400 - 200
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  className="absolute top-1/2 left-1/2"
                >
                  <Star className="w-4 h-4 text-gold-primary fill-gold-primary" />
                </motion.div>
              ))}
            </div>

            {/* Content */}
            <div className="relative z-10 text-center text-white py-12 px-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mb-6"
              >
                <div className="mx-auto w-28 h-28 rounded-full bg-gradient-to-br from-gold-primary to-amber-300 flex items-center justify-center shadow-lg">
                  <Award className="w-16 h-16 text-emerald-900" />
                </div>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold mb-3"
              >
                🎉 New Badge Earned! 🎉
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center justify-center w-36 h-36 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-4 text-6xl shadow-inner"
              >
                {badge.icon}
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-3xl font-bold mb-2"
              >
                {badge.name}
              </motion.h3>

              {/* Surah-specific info */}
              {badge.surah && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-600 to-sky-500 text-white text-sm shadow"
                >
                  <Crown className="w-4 h-4" /> Surah #{badge.surah}
                </motion.div>
              )}

              {badge.description && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-lg opacity-90 mb-8"
                >
                  {badge.description}
                </motion.p>
              )}

              {/* Themed gradient stripe based on badge.color */}
              <div className={`mx-auto mb-8 h-1 w-48 rounded-full bg-gradient-to-r ${badge.color}`} />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  variant="outline"
                  onClick={closeBadgeCelebration}
                  className="bg-gradient-to-r from-gold-primary to-amber-300 text-emerald-950 hover:from-amber-300 hover:to-gold-primary border-0 shadow-lg"
                >
                  Continue Journey
                </Button>
              </motion.div>
            </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
