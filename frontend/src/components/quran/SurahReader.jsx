import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import useQuranStore from '../../store/useQuranStore.js';
import AyahCard from './AyahCard.jsx';
import Card from '../ui/Card.jsx';

export default function SurahReader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedSurah, loading, error, fetchSurah } = useQuranStore();

  useEffect(() => {
    if (id) {
      fetchSurah(id);
    }
  }, [id, fetchSurah]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader className="w-12 h-12 text-gold-primary animate-spin mx-auto mb-4" />
          <p className="text-pearl text-lg">Loading Surah...</p>
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
              onClick={() => navigate('/quran/surahs')}
              className="text-emerald-primary hover:text-emerald-light underline"
            >
              Back to Surahs
            </button>
          </div>
        </Card>
      </div>
    );
  }

  if (!selectedSurah) {
    return null;
  }

  const { data } = selectedSurah;
  const showBismillah = data.number !== 1 && data.number !== 9; // Show for all except Al-Fatihah and At-Tawbah

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button
          onClick={() => navigate('/quran/surahs')}
          className="flex items-center space-x-2 text-pearl hover:text-gold-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Surahs</span>
        </button>

        <Card className="bg-gradient-to-br from-emerald-primary to-emerald-light text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">{data.englishName}</h1>
                <p className="text-white/80 text-lg">{data.englishNameTranslation}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-5xl font-amiri mb-1">{data.name}</p>
              <div className="flex items-center space-x-4 text-sm text-white/80">
                <span>{data.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}</span>
                <span>•</span>
                <span>{data.numberOfAyahs} Ayahs</span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Bismillah (if applicable) */}
      {showBismillah && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-br from-gold-primary/10 to-emerald-primary/10">
            <div className="text-center py-6">
              <p className="text-4xl text-emerald-primary font-amiri">
                بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ
              </p>
              <p className="text-sm text-gray-600 mt-2">
                In the name of Allah, the Entirely Merciful, the Especially Merciful
              </p>
            </div>
          </Card>
        </motion.div>
      )}

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
        {data.ayahs.map((ayah) => (
          <AyahCard
            key={ayah.number}
            ayah={{
              numberInSurah: ayah.numberInSurah,
              text: ayah.text,
              audio: ayah.audio || null,
              translation: ayah.translation || null
            }}
            showBismillah={false} // Already shown separately
          />
        ))}
      </motion.div>
    </div>
  );
}
