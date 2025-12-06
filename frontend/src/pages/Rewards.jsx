import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Coins, Award, Star, Zap, Crown, Shield, Flame } from 'lucide-react';
import useStore from '../store/useStore.js';
import Card from '../components/ui/Card.jsx';
import { surahBadges, milestoneBadges } from '../data/badges.js';

const badgeIcons = {
  'Surah Champion': Trophy,
  'Consistency Badge': Flame,
  'Dedicated Badge': Crown,
  'Century Streak': Star,
  'default': Award
};

const badgeColors = {
  'Surah Champion': 'from-gold-primary to-gold-dark',
  'Consistency Badge': 'from-orange-500 to-red-500',
  'Dedicated Badge': 'from-purple-500 to-pink-500',
  'Century Streak': 'from-blue-500 to-cyan-500',
  'default': 'from-emerald-primary to-emerald-light'
};

export default function Rewards() {
  const { rewards, user, fetchRewards, fetchProfileStats } = useStore();

  useEffect(() => {
    fetchRewards();
    fetchProfileStats();
  }, []);

  const BadgeIcon = (badge) => badgeIcons[badge] || badgeIcons.default;
  const badgeGradient = (badge) => badgeColors[badge] || badgeColors.default;

  // Compute earned badges from user + rewards, separating surah and other badges
  const { surahCompletionBadges, otherBadges } = useMemo(() => {
    const badgeSet = new Set([...(rewards?.badges || []), ...(user?.badges || [])]);
    const surahCompletion = [];
    const others = [];

    badgeSet.forEach((id) => {
      if (typeof id === 'string' && id.startsWith('surah_')) {
        const num = parseInt(id.replace('surah_', ''));
        const sb = surahBadges.find(b => b.surah === num);
        if (sb) surahCompletion.push(sb);
      } else {
        others.push(id);
      }
    });

    // Sort surah badges by surah number
    surahCompletion.sort((a, b) => a.surah - b.surah);
    return { surahCompletionBadges: surahCompletion, otherBadges: others };
  }, [rewards, user]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-block mb-4"
        >
          <Trophy className="w-16 h-16 text-gold-primary" />
        </motion.div>
        <h1 className="text-4xl font-bold text-white mb-2">Rewards & Achievements</h1>
        <p className="text-pearl text-lg">Track your progress and earn rewards</p>
      </motion.div>

      {/* Points & Coins */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-emerald-primary/10 to-emerald-light/10 border-emerald-primary/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Total Points</p>
                <motion.p
                  className="text-5xl font-bold text-emerald-primary"
                  key={rewards.points}
                  initial={{ scale: 1.5, color: '#D4AF37' }}
                  animate={{ scale: 1, color: '#0f5132' }}
                  transition={{ duration: 0.5 }}
                >
                  {rewards.points.toLocaleString()}
                </motion.p>
              </div>
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="w-20 h-20 text-emerald-primary opacity-20" />
              </motion.div>
            </div>

            <div className="mt-4 pt-4 border-t border-emerald-primary/20">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Star className="w-4 h-4 text-gold-primary" />
                <span>+10 pts per ayah memorized</span>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-gold-primary/10 to-gold-light/10 border-gold-primary/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 mb-1">Total Coins</p>
                <motion.p
                  className="text-5xl font-bold text-gold-primary"
                  key={rewards.coins}
                  initial={{ scale: 1.5, color: '#0f5132' }}
                  animate={{ scale: 1, color: '#D4AF37' }}
                  transition={{ duration: 0.5 }}
                >
                  {rewards.coins.toLocaleString()}
                </motion.p>
              </div>
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 360]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Coins className="w-20 h-20 text-gold-primary opacity-20" />
              </motion.div>
            </div>

            <div className="mt-4 pt-4 border-t border-gold-primary/20">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Coins className="w-4 h-4 text-gold-primary" />
                <span>+1 coin per ayah memorized</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Reward Actions Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <Card>
          <h3 className="text-xl font-bold text-navy-primary mb-4">How to Earn Rewards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-emerald-primary font-bold text-sm">+10</span>
              </div>
              <div>
                <p className="font-semibold text-navy-primary">Memorize 1 Ayah</p>
                <p className="text-sm text-gray-600">+10 points, +1 coin</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gold-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-gold-primary font-bold text-sm">+50</span>
              </div>
              <div>
                <p className="font-semibold text-navy-primary">Complete Daily Goal</p>
                <p className="text-sm text-gray-600">+50 points, +5 coins</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-500 font-bold text-sm">+200</span>
              </div>
              <div>
                <p className="font-semibold text-navy-primary">Finish 1 Surah</p>
                <p className="text-sm text-gray-600">+200 points, +20 coins + Badge</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-orange-500 font-bold text-sm">+100</span>
              </div>
              <div>
                <p className="font-semibold text-navy-primary">7-Day Streak</p>
                <p className="text-sm text-gray-600">+100 points, +10 coins + Badge</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Badges Gallery */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-white mb-6">Your Badges ({(rewards.badges?.length || 0) + ((user?.badges?.length || 0) - (rewards.badges ? rewards.badges.filter(b => user?.badges?.includes(b)).length : 0))})</h2>

        {surahCompletionBadges.length === 0 && otherBadges.length === 0 ? (
          <Card className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No badges earned yet</p>
            <p className="text-gray-500 mt-2">Keep memorizing to earn your first badge!</p>
          </Card>
        ) : (
          <div className="space-y-10">
            {/* Surah Completion Badges */}
            {surahCompletionBadges.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Surah Completion</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {surahCompletionBadges.map((sb, index) => (
                    <motion.div
                      key={sb.id}
                      initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                      transition={{ delay: index * 0.08, duration: 0.5, type: 'spring' }}
                      whileHover={{ scale: 1.05, rotateY: 10 }}
                    >
                      <Card className={`text-center relative overflow-hidden bg-gradient-to-br ${sb.color} bg-opacity-10`}>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        />
                        <div className="relative z-10">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${sb.color} flex items-center justify-center shadow-gold-glow`}
                          >
                            <span className="text-2xl">{sb.icon}</span>
                          </motion.div>
                          <h3 className="text-lg font-bold text-white mb-1">{sb.name}</h3>
                          <p className="text-xs text-white/80">Surah #{sb.surah} • Completed</p>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Other Badges: Streak, Milestones, Global */}
            {otherBadges.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Milestones & Streaks</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {otherBadges.map((badge, index) => {
                    // Try milestone metadata
                    const milestone = milestoneBadges.find(m => m.id === badge);
                    const Icon = BadgeIcon(badge);
                    const gradient = milestone ? milestone.color : badgeGradient(badge);
                    const title = milestone ? milestone.name : badge;
                    const description = milestone ? milestone.description : 'Earned';

                    return (
                      <motion.div
                        key={badge}
                        initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ delay: index * 0.08, duration: 0.5, type: 'spring' }}
                        whileHover={{ scale: 1.05, rotateY: 10 }}
                      >
                        <Card className={`text-center relative overflow-hidden bg-gradient-to-br ${gradient} bg-opacity-10`}>
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20"
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                          />
                          <div className="relative z-10">
                            <motion.div
                              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-gold-glow`}
                            >
                              {milestone ? (
                                <span className="text-2xl">{milestone.icon}</span>
                              ) : (
                                <Icon className="w-10 h-10 text-white" />
                              )}
                            </motion.div>
                            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                            <p className="text-sm text-white/80">{description}</p>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
