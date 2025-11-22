import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Target, BookOpen, Save } from 'lucide-react';
import useStore from '../store/useStore.js';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';

export default function Settings() {
  const user = useStore(s => s.user);
  const updateSettings = useStore(s => s.updateSettings);
  const [dailyGoal, setDailyGoal] = useState(user?.dailyGoal || 5);
  const [currentSurah, setCurrentSurah] = useState(user?.currentSurah || 1);
  const [currentAyah, setCurrentAyah] = useState(user?.currentAyah || 1);
  const loading = useStore(s => s.loadingSettings);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateSettings({ dailyGoal, currentSurah, currentAyah });
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gold-primary/20 rounded-full mb-4">
          <SettingsIcon className="w-8 h-8 text-gold-primary" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
        <p className="text-pearl text-lg">Customize your memorization experience</p>
      </motion.div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Daily Goal Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4 pb-2 border-b-2 border-gold-primary/30">
              <Target className="text-gold-primary" size={24} />
              <h2 className="text-xl font-semibold text-navy-primary">Daily Goal</h2>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Number of ayahs to memorize per day
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white border-b-2 border-gray-300 focus:border-gold-primary outline-none transition-colors text-lg"
              />
              <p className="text-xs text-gray-500 mt-2">Recommended: 3-10 ayahs per day for steady progress</p>
            </div>
          </div>

          {/* Current Position Section */}
          <div>
            <div className="flex items-center space-x-3 mb-4 pb-2 border-b-2 border-gold-primary/30">
              <BookOpen className="text-gold-primary" size={24} />
              <h2 className="text-xl font-semibold text-navy-primary">Current Position</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Current Surah
                </label>
                <input
                  type="number"
                  min="1"
                  max="114"
                  value={currentSurah}
                  onChange={(e) => setCurrentSurah(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white border-b-2 border-gray-300 focus:border-gold-primary outline-none transition-colors text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Current Ayah
                </label>
                <input
                  type="number"
                  min="1"
                  value={currentAyah}
                  onChange={(e) => setCurrentAyah(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white border-b-2 border-gray-300 focus:border-gold-primary outline-none transition-colors text-lg"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Reset your position if you want to start from a different surah/ayah
            </p>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <Button
              type="submit"
              variant="gold"
              disabled={loading}
              className="w-full md:w-auto px-8 flex items-center justify-center space-x-2 text-lg"
            >
              {loading ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Save size={20} />
                  <span>Save Settings</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-6"
      >
        <Card className="bg-gradient-to-r from-emerald-primary/10 to-gold-primary/10">
          <h3 className="font-semibold text-navy-primary mb-2">💡 Pro Tips</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Start with 3-5 ayahs per day and gradually increase</li>
            <li>• Review previously memorized ayahs regularly</li>
            <li>• Best times to memorize: after Fajr or before sleeping</li>
            <li>• Listen to recitations repeatedly to improve pronunciation</li>
          </ul>
        </Card>
      </motion.div>
    </div>
  );
}

