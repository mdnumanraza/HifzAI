import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, TrendingUp, Calendar, ArrowLeft, Play, CheckCircle, X } from 'lucide-react';
import useStore from '../store/useStore.js';
import useQuranStore from '../store/useQuranStore.js';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import AyahCard from '../components/quran/AyahCard.jsx';

export default function Revision() {
  const { 
    revisionList, 
    revisionStats, 
    fetchRevisionList, 
    fetchRevisionStats,
    markAsReviewed,
    removeRevision,
    sendBack
  } = useStore();
  
  const [selectedAyah, setSelectedAyah] = useState(null);
  const [loadingAyah, setLoadingAyah] = useState(false);

  useEffect(() => {
    fetchRevisionList();
    fetchRevisionStats();
  }, []);

  const handleRevise = async (item) => {
    setLoadingAyah(true);
    try {
      // Fetch ayah data from API
      const response = await fetch(`https://api.alquran.cloud/v1/ayah/${item.surah}:${item.ayah}/ar.alafasy`);
      const data = await response.json();
      
      setSelectedAyah({
        numberInSurah: data.data.numberInSurah,
        text: data.data.text,
        audio: data.data.audio,
        surah: item.surah,
        ayah: item.ayah
      });
    } catch (error) {
      console.error('Error fetching ayah:', error);
    }
    setLoadingAyah(false);
  };

  const handleMarkReviewed = async () => {
    if (selectedAyah) {
      await markAsReviewed(selectedAyah.surah, selectedAyah.ayah);
      setSelectedAyah(null);
    }
  };

  const handleSendBack = async (item) => {
    if (confirm('Send this ayah back to memorization?')) {
      await sendBack(item.surah, item.ayah);
    }
  };

  const handleRemove = async (item) => {
    if (confirm('Remove this ayah from revision list?')) {
      await removeRevision(item.surah, item.ayah);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Revision Center</h1>
        <p className="text-pearl text-lg">Review and strengthen your memorization</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="text-center">
            <BookOpen className="w-12 h-12 text-emerald-primary mx-auto mb-3" />
            <p className="text-3xl font-bold text-navy-primary mb-1">{revisionStats.totalRevisions}</p>
            <p className="text-gray-600">Total Revisions</p>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="text-center">
            <CheckCircle className="w-12 h-12 text-gold-primary mx-auto mb-3" />
            <p className="text-3xl font-bold text-navy-primary mb-1">{revisionStats.reviewedToday}</p>
            <p className="text-gray-600">Reviewed Today</p>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="text-center">
            <TrendingUp className="w-12 h-12 text-orange-500 mx-auto mb-3" />
            <p className="text-3xl font-bold text-navy-primary mb-1">{revisionStats.pendingReview}</p>
            <p className="text-gray-600">Pending Review</p>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="text-center">
            <Calendar className="w-12 h-12 text-purple-500 mx-auto mb-3" />
            <p className="text-sm font-semibold text-navy-primary mb-1">Last Reviewed</p>
            <p className="text-gray-600 text-sm">
              {revisionStats.lastReviewed 
                ? new Date(revisionStats.lastReviewed).toLocaleDateString() 
                : 'Never'}
            </p>
          </Card>
        </motion.div>
      </div>

      {/* Revision List */}
      {selectedAyah ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <button
            onClick={() => setSelectedAyah(null)}
            className="flex items-center space-x-2 text-pearl hover:text-gold-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to List</span>
          </button>

          <AyahCard ayah={selectedAyah} showBismillah={false} />

          <div className="mt-6 flex justify-center space-x-5">
            <Button variant="gold" onClick={handleMarkReviewed} className="px-10 flex flex-row items-center justify-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>Mark as Reviewed</span> 
            </Button>
          </div>
        </motion.div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Your Revision List</h2>
          
          {revisionList.length === 0 ? (
            <Card className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">No ayahs in revision yet</p>
              <p className="text-gray-500 mt-2">Memorize ayahs to add them here</p>
            </Card>
          ) : (
            // Group ayahs by date
            (() => {
              const groupedByDate = revisionList.reduce((acc, item) => {
                const dateKey = new Date(item.addedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });
                if (!acc[dateKey]) {
                  acc[dateKey] = [];
                }
                acc[dateKey].push(item);
                return acc;
              }, {});

              const sortedDates = Object.keys(groupedByDate).sort((a, b) => 
                new Date(groupedByDate[b][0].addedAt) - new Date(groupedByDate[a][0].addedAt)
              );

              return (
                <div className="space-y-8">
                  {sortedDates.map((date, dateIndex) => (
                    <motion.div
                      key={date}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: dateIndex * 0.1 }}
                    >
                      {/* Date Header */}
                      <div className="flex items-center mb-4">
                        <Calendar className="w-5 h-5 text-gold-primary mr-2" />
                        <h3 className="text-xl font-bold text-white">{date}</h3>
                        <span className="ml-3 text-sm text-gray-400">
                          ({groupedByDate[date].length} ayah{groupedByDate[date].length > 1 ? 's' : ''})
                        </span>
                      </div>

                      {/* Ayahs for this date */}
                      <Card className="overflow-hidden">
                        <div className="divide-y divide-gray-100">
                          {groupedByDate[date].map((item, index) => (
                            <div
                              key={`${item.surah}-${item.ayah}`}
                              className="p-4 hover:bg-gray-50 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                {/* Left: Surah and Ayah Info */}
                                <div className="flex items-center space-x-4 flex-1">
                                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-lg w-16 h-16 flex flex-col items-center justify-center shadow-md">
                                    <span className="text-xs opacity-80">Surah</span>
                                    <span className="text-xl font-bold">{item.surah}</span>
                                  </div>
                                  
                                  <div className="flex-1">
                                    <div className="flex items-baseline space-x-2">
                                      <span className="text-2xl font-bold text-gold-primary">Ayah {item.ayah}</span>
                                      {item.reviewCount > 0 && (
                                        <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                          ✓ Reviewed {item.reviewCount}x
                                        </span>
                                      )}
                                    </div>
                                    {item.lastReviewedAt && (
                                      <p className="text-sm text-gray-500 mt-1">
                                        Last reviewed: {new Date(item.lastReviewedAt).toLocaleDateString()}
                                      </p>
                                    )}
                                  </div>
                                </div>

                                {/* Right: Action Buttons */}
                                <div className="flex items-center space-x-2 ml-6">
                                  <Button
                                    variant="primary"
                                    onClick={() => handleRevise(item)}
                                    className="px-8 flex flex-row items-center justify-center"
                                    disabled={loadingAyah}
                                  >
                                    <Play className="w-4 h-4 mr-2" />
                                    Revise
                                  </Button>

                                  <Button
                                    variant="outline"
                                    onClick={() => handleSendBack(item)}
                                    className="px-4"
                                  >
                                    <ArrowLeft className="w-4 h-4" />
                                  </Button>

                                  <Button
                                    variant="outline"
                                    onClick={() => handleRemove(item)}
                                    className="px-4 text-red-600 hover:bg-red-50 border-red-200"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              );
            })()
          )}
        </div>
      )}
    </div>
  );
}
