import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Target, Flame, TrendingUp, Play, Trophy, Award, RefreshCw } from 'lucide-react';
import useStore from '../store/useStore.js';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Confetti from '../components/ui/Confetti.jsx';
import MilestoneModal from '../components/ui/MilestoneModal.jsx';
import { surahBadges } from '../data/badges.js';

export default function Dashboard() {
  const user = useStore(s => s.user);
  const progress = useStore(s => s.progress);
  const streak = useStore(s => s.streak);
  const rewards = useStore(s => s.rewards);
  const revisionStats = useStore(s => s.revisionStats);
  const showMilestone = useStore(s => s.showMilestone);
  const milestoneData = useStore(s => s.milestoneData);
  const showConfetti = useStore(s => s.showConfetti);
  const closeMilestone = useStore(s => s.closeMilestone);
  const hideConfetti = useStore(s => s.hideConfetti);
  const fetchProgress = useStore(s => s.fetchProgress);
  const fetchPhase2Data = useStore(s => s.fetchPhase2Data);
  const navigate = useNavigate();

  useEffect(() => { 
    fetchProgress(); 
    fetchPhase2Data();
  }, [fetchProgress, fetchPhase2Data]);

  if (!user) return null;

  const stats = [
    {
      icon: Target,
      label: 'Daily Goal',
      value: `${user.dailyGoal} ayahs/day`,
      color: 'text-emerald-primary',
      gradient: 'from-emerald-primary/10 to-emerald-light/10'
    },
    {
      icon: BookOpen,
      label: 'Total Memorized',
      value: progress?.totalMemorized || 0,
      color: 'text-gold-primary',
      gradient: 'from-gold-primary/10 to-gold-light/10'
    },
    {
      icon: TrendingUp,
      label: 'Current Position',
      value: `${progress?.currentSurah}:${progress?.currentAyah}`,
      color: 'text-navy-primary',
      gradient: 'from-navy-light/10 to-navy-primary/10'
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${streak.current || 0} ${(streak.current || 0) === 1 ? 'day' : 'days'}`,
      color: 'text-orange-500',
      gradient: 'from-orange-500/10 to-red-500/10',
      glow: (streak.current || 0) > 7
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          السلام عليكم, <span className="text-gold-primary">{user.name}</span>
        </h1>
        <p className="text-pearl text-lg">May your memorization journey be blessed</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <Card className={`text-center hover:scale-105 transition-transform bg-gradient-to-br ${stat.gradient || ''} ${stat.glow ? 'shadow-gold-glow' : ''}`}>
              <motion.div
                animate={stat.glow ? { 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <stat.icon className={`w-12 h-12 mx-auto mb-3 ${stat.color}`} />
              </motion.div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-navy-primary">{stat.value}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Call to Action */}
      <Card className="text-center py-12">
        <BookOpen className="w-16 h-16 text-gold-primary mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-navy-primary mb-4">Ready to Memorize?</h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Start today's memorization session and continue your journey through the Qur'an
        </p>
        <Button
          variant="gold"
          onClick={() => navigate('/memorize')}
          className="text-lg px-8 py-4"
        >
          <Play className="inline mr-2" size={20} />
          Start Today's Memorization
        </Button>
      </Card>

      {/* Progress Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-xl font-semibold text-navy-primary mb-4 flex items-center">
            <TrendingUp className="mr-2 text-gold-primary" />
            Progress Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Current Surah</span>
              <span className="font-semibold text-navy-primary">{progress?.currentSurah}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Current Ayah</span>
              <span className="font-semibold text-navy-primary">{progress?.currentAyah}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Memorized</span>
              <span className="font-semibold text-emerald-primary">{progress?.totalMemorized || 0}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-xl font-semibold text-navy-primary mb-4 flex items-center">
            <BookOpen className="mr-2 text-gold-primary" />
            Recent Memorized Ayahs
          </h3>
          <div className="max-h-48 overflow-auto space-y-2">
            {progress?.memorizedAyahs?.length > 0 ? (
              progress.memorizedAyahs.slice(-10).reverse().map((a, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-lg bg-pearl hover:bg-gold-primary/10 transition-colors"
                >
                  <span className="text-sm text-navy-primary">Surah {a.surah}, Ayah {a.ayah}</span>
                  <span className="text-xs text-emerald-primary">✓</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No ayahs memorized yet. Start your journey!</p>
            )}
          </div>
        </Card>
      </div>

      {/* Phase 2: Rewards & Revision Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rewards Card */}
        <Card 
          className="bg-gradient-to-br from-gold-primary/5 to-emerald-primary/5 hover:shadow-gold-glow transition-all cursor-pointer"
          onClick={() => navigate('/rewards')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-navy-primary flex items-center">
              <Trophy className="mr-2 text-gold-primary" />
              Rewards
            </h3>
            <Award className="w-6 h-6 text-gold-primary" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 rounded-lg bg-white/50">
              <p className="text-2xl font-bold text-emerald-primary">{rewards.points.toLocaleString()}</p>
              <p className="text-xs text-gray-600">Points</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/50">
              <p className="text-2xl font-bold text-gold-primary">{rewards.coins.toLocaleString()}</p>
              <p className="text-xs text-gray-600">Coins</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{rewards.badges.length} Badge{rewards.badges.length !== 1 ? 's' : ''} Earned</span>
            <span className="text-gold-primary font-semibold">View All →</span>
          </div>
        </Card>

        {/* Revision Card */}
        <Card 
          className="bg-gradient-to-br from-purple-500/5 to-blue-500/5 hover:shadow-lg transition-all cursor-pointer"
          onClick={() => navigate('/revision')}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-navy-primary flex items-center">
              <RefreshCw className="mr-2 text-purple-500" />
              Revision Center
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 rounded-lg bg-white/50">
              <p className="text-2xl font-bold text-purple-500">{revisionStats.totalRevisions}</p>
              <p className="text-xs text-gray-600">Total</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-white/50">
              <p className="text-2xl font-bold text-orange-500">{revisionStats.pendingReview}</p>
              <p className="text-xs text-gray-600">Pending</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{revisionStats.reviewedToday} Reviewed Today</span>
            <span className="text-purple-500 font-semibold">Start Revision →</span>
          </div>
        </Card>
      </div>

      {/* Surah Badges Grid */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-navy-primary flex items-center">
            <Award className="mr-2 text-gold-primary" />
            Surah Badges
          </h3>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-emerald-primary">{user?.completedSurahs?.length || 0}</span>
            <span> / 114 Completed</span>
          </div>
        </div>
        
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
          {surahBadges.map((badge) => {
            const isCompleted = user?.completedSurahs?.includes(badge.surah);
            return (
              <motion.div
                key={badge.id}
                whileHover={{ scale: isCompleted ? 1.1 : 1.05 }}
                className="relative group"
              >
                <div 
                  className={`w-full aspect-square rounded-xl flex flex-col items-center justify-center text-center p-2 transition-all ${
                    isCompleted 
                      ? `bg-gradient-to-br ${badge.color} shadow-lg border-2 border-white/50` 
                      : 'bg-white/30 opacity-40 border border-gray-300'
                  }`}
                >
                  <div 
                    className={`text-2xl mb-1 relative ${isCompleted ? '' : 'grayscale opacity-50'}`}
                  >
                    {/* Icon with white background for visibility */}
                    <div className={`absolute inset-0 bg-white rounded-lg -z-10 ${isCompleted ? 'opacity-90' : 'opacity-50'}`}></div>
                    <span className="relative z-10">{badge.icon}</span>
                  </div>
                  <div className={`text-xs font-bold ${isCompleted ? 'text-white drop-shadow-md' : 'text-gray-500'}`}>
                    {badge.surah}
                  </div>
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-navy-primary text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-xl">
                  <div className="font-semibold">{badge.name}</div>
                  <div className="text-emerald-300">Surah {badge.surah}</div>
                  {!isCompleted && <div className="text-gray-300 mt-1">Not completed yet</div>}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Milestone Modal & Confetti */}
      <MilestoneModal 
        show={showMilestone} 
        milestone={milestoneData} 
        onClose={closeMilestone}
        onGetNextBatch={() => navigate('/memorization')}
        onContinueReading={() => navigate('/memorization')}
      />
      <Confetti show={showConfetti} onComplete={hideConfetti} />
    </div>
  );
}

