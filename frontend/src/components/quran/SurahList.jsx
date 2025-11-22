import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Loader } from 'lucide-react';
import useQuranStore from '../../store/useQuranStore.js';
import Card from '../ui/Card.jsx';
import { surahBadges } from '../../data/badges.js';

export default function SurahList() {
  const { surahs, loading, fetchSurahs } = useQuranStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (surahs.length === 0) {
      fetchSurahs();
    }
  }, [surahs.length, fetchSurahs]);

  if (loading && surahs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader className="w-12 h-12 text-gold-primary animate-spin mb-4" />
        <p className="text-pearl">Loading Surahs...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-primary/20 rounded-full mb-4">
          <BookOpen className="w-8 h-8 text-gold-primary" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Surahs of the Qur'an</h1>
        <p className="text-pearl text-lg">114 Surahs • Complete Mushaf</p>
      </motion.div>

      {/* Surah Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.03
            }
          }
        }}
      >
        {surahs.map((surah, index) => {
          // Get the corresponding badge for this surah
          const surahBadge = surahBadges.find(badge => badge.surah === surah.number);
          
          return (
          <motion.div
            key={surah.number}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
            onClick={() => navigate(`/quran/surah/${surah.number}`)}
          >
            <Card className="cursor-pointer hover:shadow-gold-glow transition-all duration-300 relative overflow-hidden group">
              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-gold-primary/20 to-transparent rounded-bl-full" />
              
              {/* Surah Icon */}
              {surahBadge && (
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-md">
                  <span className="text-2xl">{surahBadge.icon}</span>
                </div>
              )}
              
              {/* Surah Number Badge */}
              <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-gradient-to-br from-emerald-primary to-emerald-light flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">{surah.number}</span>
              </div>

              <div className="pt-16 pb-4">
                {/* Arabic Name */}
                <h2 className="text-3xl font-arabic text-right text-navy-primary mb-2 group-hover:text-emerald-primary transition-colors">
                  {surah.name}
                </h2>

                {/* English Name & Translation */}
                <div className="space-y-1">
                  <p className="text-xl font-semibold text-emerald-primary">
                    {surah.englishName}
                  </p>
                  <p className="text-sm text-gray-600 italic">
                    {surah.englishNameTranslation}
                  </p>
                </div>

                {/* Revelation Type & Ayah Count */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gold-primary/20">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {surah.revelationType}
                  </span>
                  <span className="text-sm font-semibold text-gold-primary">
                    {surah.numberOfAyahs} Ayahs
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
