import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookMarked, ArrowLeft, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import useQuranStore from '../../store/useQuranStore.js';
import AyahCard from './AyahCard.jsx';
import Card from '../ui/Card.jsx';

export default function ParaReader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedPara, loading, error, fetchPara } = useQuranStore();

  useEffect(() => {
    if (id) {
      fetchPara(id);
    }
  }, [id, fetchPara]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader className="w-12 h-12 text-gold-primary animate-spin mx-auto mb-4" />
          <p className="text-pearl text-lg">Loading Para...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-red-50 border-red-200">
          <div className="text-center py-8">
            <p className="text-red-600 text-lg font-medium mb-4">{error}</p>
            <button
              onClick={() => navigate('/quran/paras')}
              className="text-emerald-primary hover:text-emerald-light underline"
            >
              Back to Paras
            </button>
          </div>
        </Card>
      </div>
    );
  }

  if (!selectedPara) {
    return null;
  }

  const { data } = selectedPara;

  // Group ayahs by surah
  const groupedBySurah = {};
  data.ayahs.forEach((ayah) => {
    const surahNumber = ayah.surah.number;
    if (!groupedBySurah[surahNumber]) {
      groupedBySurah[surahNumber] = {
        surah: ayah.surah,
        ayahs: []
      };
    }
    groupedBySurah[surahNumber].ayahs.push(ayah);
  });

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button
          onClick={() => navigate('/quran/paras')}
          className="flex items-center space-x-2 text-pearl hover:text-gold-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Paras</span>
        </button>

        <Card className="bg-gradient-to-br from-gold-primary to-emerald-primary text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <BookMarked className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">Para {data.number}</h1>
                <p className="text-white/80 text-lg">Juz {data.number}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg text-white/80">
                {Object.keys(groupedBySurah).length} Surah{Object.keys(groupedBySurah).length > 1 ? 's' : ''}
              </p>
              <p className="text-sm text-white/80">
                {data.ayahs.length} Ayahs
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Ayahs Grouped by Surah */}
      <div className="space-y-8">
        {Object.entries(groupedBySurah).map(([surahNumber, { surah, ayahs }]) => (
          <motion.div
            key={surahNumber}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Surah Divider */}
            <div className="mb-6">
              <Card className="bg-gradient-to-r from-emerald-primary/10 to-gold-primary/10 hover:shadow-gold-glow transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-primary to-emerald-light flex items-center justify-center shadow-md">
                      <span className="text-white font-bold">{surah.number}</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-navy-primary">{surah.englishName}</h2>
                      <p className="text-sm text-gray-600">{surah.englishNameTranslation}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-amiri text-emerald-primary">{surah.name}</p>
                    <p className="text-xs text-gray-600">
                      {ayahs.length} Ayah{ayahs.length > 1 ? 's' : ''} in this Para
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Ayahs */}
            <motion.div
              className="space-y-6"
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
              {ayahs.map((ayah, index) => (
                <AyahCard
                  key={ayah.number}
                  ayah={{
                    numberInSurah: ayah.numberInSurah,
                    text: ayah.text,
                    audio: ayah.audio || null,
                    translation: ayah.translation || null
                  }}
                  showBismillah={index === 0 && ayah.numberInSurah === 1 && surah.number !== 1 && surah.number !== 9}
                />
              ))}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
