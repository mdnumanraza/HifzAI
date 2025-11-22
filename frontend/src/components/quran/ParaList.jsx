import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookMarked } from 'lucide-react';
import Card from '../ui/Card.jsx';

const paraData = [
  { number: 1, startSurah: 'Al-Fatihah', endSurah: 'Al-Baqarah' },
  { number: 2, startSurah: 'Al-Baqarah', endSurah: 'Al-Baqarah' },
  { number: 3, startSurah: 'Al-Baqarah', endSurah: 'Aal-E-Imran' },
  { number: 4, startSurah: 'Aal-E-Imran', endSurah: 'An-Nisa' },
  { number: 5, startSurah: 'An-Nisa', endSurah: 'An-Nisa' },
  { number: 6, startSurah: 'An-Nisa', endSurah: 'Al-Maidah' },
  { number: 7, startSurah: 'Al-Maidah', endSurah: 'Al-Anam' },
  { number: 8, startSurah: 'Al-Anam', endSurah: 'Al-Araf' },
  { number: 9, startSurah: 'Al-Araf', endSurah: 'Al-Anfal' },
  { number: 10, startSurah: 'Al-Anfal', endSurah: 'At-Tawbah' },
  { number: 11, startSurah: 'At-Tawbah', endSurah: 'Hud' },
  { number: 12, startSurah: 'Hud', endSurah: 'Yusuf' },
  { number: 13, startSurah: 'Yusuf', endSurah: 'Ibrahim' },
  { number: 14, startSurah: 'Al-Hijr', endSurah: 'An-Nahl' },
  { number: 15, startSurah: 'An-Nahl', endSurah: 'Al-Isra' },
  { number: 16, startSurah: 'Al-Isra', endSurah: 'Al-Kahf' },
  { number: 17, startSurah: 'Al-Kahf', endSurah: 'Maryam' },
  { number: 18, startSurah: 'Al-Muminun', endSurah: 'Al-Furqan' },
  { number: 19, startSurah: 'Al-Furqan', endSurah: 'An-Naml' },
  { number: 20, startSurah: 'An-Naml', endSurah: 'Al-Ankabut' },
  { number: 21, startSurah: 'Al-Ankabut', endSurah: 'Al-Ahzab' },
  { number: 22, startSurah: 'Al-Ahzab', endSurah: 'Yasin' },
  { number: 23, startSurah: 'Yasin', endSurah: 'Az-Zumar' },
  { number: 24, startSurah: 'Az-Zumar', endSurah: 'Fussilat' },
  { number: 25, startSurah: 'Fussilat', endSurah: 'Al-Jathiyah' },
  { number: 26, startSurah: 'Al-Ahqaf', endSurah: 'Adh-Dhariyat' },
  { number: 27, startSurah: 'Adh-Dhariyat', endSurah: 'Al-Hadid' },
  { number: 28, startSurah: 'Al-Mujadila', endSurah: 'At-Tahrim' },
  { number: 29, startSurah: 'Al-Mulk', endSurah: 'Al-Mursalat' },
  { number: 30, startSurah: 'An-Naba', endSurah: 'An-Nas' },
];

export default function ParaList() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-primary/20 rounded-full mb-4">
          <BookMarked className="w-8 h-8 text-gold-primary" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Paras (Juz) of the Qur'an</h1>
        <p className="text-pearl text-lg">30 Paras • Complete Division</p>
      </motion.div>

      {/* Para Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.05
            }
          }
        }}
      >
        {paraData.map((para) => (
          <motion.div
            key={para.number}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            onClick={() => navigate(`/quran/para/${para.number}`)}
          >
            <Card className="cursor-pointer hover:shadow-gold-glow transition-all duration-300 relative overflow-hidden group">
              {/* Decorative Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-primary/5 to-transparent pointer-events-none" />
              
              <div className="relative flex items-center space-x-6">
                {/* Para Number Badge */}
                <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-primary to-emerald-light flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <div className="text-center">
                    <div className="text-xs text-white/80 font-medium">Juz</div>
                    <div className="text-2xl text-white font-bold">{para.number}</div>
                  </div>
                </div>

                {/* Para Info */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-navy-primary mb-2 group-hover:text-emerald-primary transition-colors">
                    Para {para.number}
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium text-emerald-primary mr-2">From:</span>
                      <span>{para.startSurah}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium text-gold-primary mr-2">To:</span>
                      <span>{para.endSurah}</span>
                    </div>
                  </div>
                </div>

                {/* Arrow Icon */}
                <div className="text-gold-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
