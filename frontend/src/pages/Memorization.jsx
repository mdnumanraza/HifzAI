import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Loader, Type, Plus, Calendar } from 'lucide-react';
import useStore from '../store/useStore.js';
import MemorizeCard from '../components/memorization/MemorizeCard.jsx';
import Card from '../components/ui/Card.jsx';
import MilestoneModal from '../components/ui/MilestoneModal.jsx';
import Confetti from '../components/ui/Confetti.jsx';

export default function Memorization() {
  const dailyAyahs = useStore(s => s.dailyAyahs);
  const fetchDailyAyahs = useStore(s => s.fetchDailyAyahs);
  const loading = useStore(s => s.loadingDaily);
  const user = useStore(s => s.user);
  const fetchingMore = useStore(s => s.fetchingMore);
  const prefetchMoreAyahs = useStore(s => s.prefetchMoreAyahs);
  const fetchNextBatch = useStore(s => s.fetchNextBatch);
  const showMilestone = useStore(s => s.showMilestone);
  const milestoneData = useStore(s => s.milestoneData);
  const showConfetti = useStore(s => s.showConfetti);
  const closeMilestone = useStore(s => s.closeMilestone);
  const hideConfetti = useStore(s => s.hideConfetti);
  const [selectedFont, setSelectedFont] = useState('Scheherazade New');

  const quranFonts = [
    { name: 'Scheherazade New', label: 'Scheherazade New', class: 'font-quran' },
    { name: 'Amiri', label: 'Amiri', class: 'font-amiri' },
    { name: 'Amiri Quran', label: 'Amiri Quran', class: 'font-["Amiri_Quran"]' },
    { name: 'Noto Naskh Arabic', label: 'Noto Naskh Arabic', class: 'font-["Noto_Naskh_Arabic"]' },
    { name: 'Traditional Arabic', label: 'Traditional Arabic', class: 'font-["Traditional_Arabic"]' },
    { name: 'Lateef', label: 'Lateef', class: 'font-["Lateef"]' },
    { name: 'Uthmanic', label: 'Uthmanic', class: 'font-["KFGQPC_Uthmanic_Script_HAFS"]' },
    { name: 'Nafees', label: 'Nafees Nastaleeq', class: 'font-["Nafees_Nastaleeq"]' }
  ];

  useEffect(() => { fetchDailyAyahs(); }, [fetchDailyAyahs]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with Font Selector */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center mb-12"
      >
        {/* Font Selector Dropdown - Top Right */}
        <div className="absolute top-0 right-0">
          <div className="flex items-center space-x-2">
            <Type className="w-4 h-4 text-gold-primary" />
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              className="bg-white/90 text-navy-primary text-sm rounded-lg px-3 py-2 border border-gold-primary/30 focus:outline-none focus:ring-2 focus:ring-gold-primary shadow-md"
            >
              {quranFonts.map((font) => (
                <option key={font.name} value={font.name}>
                  {font.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-primary/20 rounded-full mb-4">
          <BookOpen className="w-8 h-8 text-gold-primary" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Today's Memorization</h1>
        <p className="text-pearl text-lg">
          {user?.dailyGoal} ayahs to memorize today
        </p>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <Loader className="w-12 h-12 text-gold-primary animate-spin mb-4" />
          <p className="text-pearl">Loading your ayahs...</p>
        </motion.div>
      )}

      {/* Ayah Cards */}
      {!loading && dailyAyahs.length > 0 && (
        <div className="space-y-8">
          {dailyAyahs.map((ayah, index) => (
            <MemorizeCard key={`${ayah.surah}-${ayah.ayah}`} ayah={ayah} index={index} selectedFont={selectedFont} />
          ))}
          
          {/* Fetch More Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row gap-4 pt-6"
          >
            <button
              onClick={() => prefetchMoreAyahs(10)}
              disabled={fetchingMore}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gold-primary/10 hover:bg-gold-primary/20 disabled:bg-gold-primary/5 text-gold-primary rounded-xl border border-gold-primary/30 transition-colors disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold">
                {fetchingMore ? 'Loading...' : 'Fetch More Ayahs Today'}
              </span>
            </button>
            
            <button
              onClick={() => fetchNextBatch(user?.dailyGoal || 5)}
              disabled={fetchingMore}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-emerald-500/10 hover:bg-emerald-500/20 disabled:bg-emerald-500/5 text-emerald-400 rounded-xl border border-emerald-400/30 transition-colors disabled:cursor-not-allowed"
            >
              <Calendar className="w-5 h-5" />
              <span className="font-semibold">
                {fetchingMore ? 'Loading...' : "Fetch Next Day's Batch"}
              </span>
            </button>
          </motion.div>
        </div>
      )}

      {/* Empty State */}
      {!loading && dailyAyahs.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <BookOpen className="w-16 h-16 text-gold-primary/50 mx-auto mb-4" />
          <p className="text-pearl text-lg">No ayahs to display. Please check your settings.</p>
        </motion.div>
      )}

      {/* Milestone Modal & Confetti */}
      <MilestoneModal 
        show={showMilestone} 
        milestone={milestoneData} 
        onClose={closeMilestone}
        onGetNextBatch={() => fetchNextBatch(user?.dailyGoal || 5)}
        onContinueReading={() => prefetchMoreAyahs(10)}
      />
      <Confetti show={showConfetti} onComplete={hideConfetti} />
    </div>
  );
}

