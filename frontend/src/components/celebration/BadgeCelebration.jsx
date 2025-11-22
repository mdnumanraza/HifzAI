import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Star } from 'lucide-react';
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.5, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0.5, rotate: 10 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="relative max-w-lg w-full"
        >
          <Card className={`relative overflow-hidden bg-gradient-to-br ${badge.color}`}>
            {/* Close button */}
            <button
              onClick={closeBadgeCelebration}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
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
                  <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
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
                <Award className="w-24 h-24 mx-auto mb-4" />
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
                className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm mb-4 text-6xl"
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

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  variant="outline"
                  onClick={closeBadgeCelebration}
                  className="bg-white text-navy-primary hover:bg-white/90 border-none shadow-lg"
                >
                  Continue Journey
                </Button>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
