import React from 'react';
import { motion } from 'framer-motion';
import { Award, Flame, Trophy } from 'lucide-react';
import Card from './Card.jsx';

export default function MilestoneModal({ show, milestone, onClose, onGetNextBatch, onContinueReading }) {
  if (!show) return null;

  const getMilestoneInfo = (milestone) => {
    // Handle daily goal completion
    if (milestone?.type === 'daily_goal_complete') {
      return {
        icon: Trophy,
        title: milestone.title,
        message: milestone.message,
        badge: null,
        color: 'text-emerald-primary',
        showNextOptions: milestone.showNextOptions
      };
    }

    // Handle streak milestones
    switch (milestone) {
      case 7:
        return {
          icon: Flame,
          title: '7 Day Streak! 🔥',
          message: 'You\'ve maintained consistency for a whole week!',
          badge: 'Consistency Badge',
          color: 'text-orange-500'
        };
      case 30:
        return {
          icon: Trophy,
          title: '30 Day Streak! 🏆',
          message: 'A full month of dedication!',
          badge: 'Dedicated Badge',
          color: 'text-gold-primary'
        };
      case 100:
        return {
          icon: Award,
          title: '100 Day Streak! 👑',
          message: 'You\'ve reached a legendary milestone!',
          badge: 'Century Streak',
          color: 'text-purple-500'
        };
      default:
        return {
          icon: Award,
          title: `${milestone} Day Streak!`,
          message: 'Keep up the amazing work!',
          badge: null,
          color: 'text-emerald-primary'
        };
    }
  };

  const info = getMilestoneInfo(milestone);
  const Icon = info.icon;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 10 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="max-w-md w-full"
      >
        <Card className="text-center relative overflow-hidden">
          {/* Animated background glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-gold-primary/20 via-emerald-primary/20 to-transparent"
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%'],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Icon with shine animation */}
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-gold-primary to-gold-dark flex items-center justify-center shadow-gold-glow`}>
                <Icon className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-navy-primary mb-3">
              {info.title}
            </h2>

            {/* Message */}
            <p className="text-lg text-gray-700 mb-6">
              {info.message}
            </p>

            {/* Badge earned */}
            {info.badge && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-gold-primary/10 to-emerald-primary/10 rounded-xl p-4 mb-6"
              >
                <p className="text-sm text-gray-600 mb-2">Badge Earned:</p>
                <div className="flex items-center justify-center space-x-2">
                  <Award className="w-5 h-5 text-gold-primary" />
                  <span className="text-lg font-semibold text-gold-primary">{info.badge}</span>
                </div>
              </motion.div>
            )}

            {/* Action buttons */}
            {info.showNextOptions ? (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    onGetNextBatch?.();
                    onClose();
                  }}
                  className="w-full bg-gradient-to-r from-emerald-primary to-emerald-light text-white py-3 rounded-xl font-semibold hover:shadow-gold-glow transition-all"
                >
                  Get Next Day's Batch
                </button>
                <button
                  onClick={() => {
                    onContinueReading?.();
                    onClose();
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Continue Reading More Ayahs
                </button>
                <button
                  onClick={onClose}
                  className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
                >
                  Done for Today
                </button>
              </div>
            ) : (
              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-emerald-primary to-emerald-light text-white py-3 rounded-xl font-semibold hover:shadow-gold-glow transition-all"
              >
                Continue
              </button>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
