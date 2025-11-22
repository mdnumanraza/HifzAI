import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, BookOpen, CheckCircle, Play } from 'lucide-react';
import useStore from '../store/useStore.js';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';

export default function History() {
  const { history, historyStats, fetchHistory, fetchHistoryStats } = useStore();
  const [selectedDate, setSelectedDate] = useState(null);
  const [playingAudio, setPlayingAudio] = useState(null);

  useEffect(() => {
    fetchHistory();
    fetchHistoryStats();
  }, []);

  const playAyahAudio = async (surah, ayah) => {
    try {
      if (playingAudio) {
        playingAudio.pause();
      }

      const response = await fetch(`https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/ar.alafasy`);
      const data = await response.json();
      
      const audio = new Audio(data.data.audio);
      audio.play();
      setPlayingAudio(audio);

      audio.onended = () => setPlayingAudio(null);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const groupedDates = Object.keys(history).sort((a, b) => new Date(b) - new Date(a));

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">Memorization History</h1>
        <p className="text-pearl text-lg">Track your journey through the Qur'an</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="text-center bg-gradient-to-br from-emerald-primary/10 to-transparent">
            <CheckCircle className="w-12 h-12 text-emerald-primary mx-auto mb-3" />
            <p className="text-4xl font-bold text-navy-primary mb-1">{historyStats.totalMemorized}</p>
            <p className="text-gray-600">Total Memorized</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="text-center bg-gradient-to-br from-gold-primary/10 to-transparent">
            <BookOpen className="w-12 h-12 text-gold-primary mx-auto mb-3" />
            <p className="text-4xl font-bold text-navy-primary mb-1">{historyStats.totalReviewed}</p>
            <p className="text-gray-600">Total Reviewed</p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="text-center bg-gradient-to-br from-purple-500/10 to-transparent">
            <Clock className="w-12 h-12 text-purple-500 mx-auto mb-3" />
            <p className="text-4xl font-bold text-navy-primary mb-1">{historyStats.todayMemorized}</p>
            <p className="text-gray-600">Memorized Today</p>
          </Card>
        </motion.div>
      </div>

      {/* History Timeline */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Your Journey</h2>

        {groupedDates.length === 0 ? (
          <Card className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No history yet</p>
            <p className="text-gray-500 mt-2">Start memorizing to build your history</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {groupedDates.map((date, dateIndex) => {
              const entries = history[date];
              const isSelected = selectedDate === date;

              return (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: dateIndex * 0.05 }}
                >
                  <Card className="overflow-hidden">
                    {/* Date Header */}
                    <button
                      onClick={() => setSelectedDate(isSelected ? null : date)}
                      className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-primary to-emerald-light flex items-center justify-center text-white font-bold">
                          {new Date(date).getDate()}
                        </div>
                        <div className="text-left">
                          <p className="text-lg font-bold text-navy-primary">
                            {new Date(date).toLocaleDateString('en-US', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                          <p className="text-sm text-gray-600">
                            {entries.length} ayah{entries.length > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>

                      <motion.div
                        animate={{ rotate: isSelected ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </motion.div>
                    </button>

                    {/* Expanded Entries */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-200"
                        >
                          <div className="p-6 space-y-3">
                            {entries.map((entry, entryIndex) => (
                              <motion.div
                                key={`${entry.surah}-${entry.ayah}-${entryIndex}`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: entryIndex * 0.05 }}
                                className="flex items-center justify-between p-4 bg-gradient-to-r from-pearl to-white rounded-lg hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-center space-x-4">
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                    entry.action === 'memorized' 
                                      ? 'bg-emerald-primary/10 text-emerald-primary' 
                                      : 'bg-gold-primary/10 text-gold-primary'
                                  }`}>
                                    {entry.action === 'memorized' ? (
                                      <CheckCircle className="w-5 h-5" />
                                    ) : (
                                      <BookOpen className="w-5 h-5" />
                                    )}
                                  </div>

                                  <div>
                                    <p className="font-semibold text-navy-primary">
                                      Surah {entry.surah}, Ayah {entry.ayah}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {entry.action === 'memorized' ? 'Memorized' : 'Reviewed'} • {new Date(entry.time).toLocaleTimeString()}
                                    </p>
                                  </div>
                                </div>

                                <Button
                                  variant="outline"
                                  onClick={() => playAyahAudio(entry.surah, entry.ayah)}
                                  className="flex items-center space-x-2"
                                >
                                  <Play className="w-4 h-4" />
                                  <span>Play</span>
                                </Button>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
