import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Edit2, Save, X, Star, Trophy, Award } from 'lucide-react';
import useStore from '../store/useStore.js';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import { profileIcons, getProfileIcon } from '../data/profileIcons.js';
import { surahBadges, milestoneBadges } from '../data/badges.js';

export default function Profile() {
  const user = useStore(s => s.user);
  const updateProfile = useStore(s => s.updateProfile);
  const progress = useStore(s => s.progress);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [selectedIcon, setSelectedIcon] = useState(user?.profilePicture || 'kaaba');
  const [showIconPicker, setShowIconPicker] = useState(false);

  const completedSurahs = user?.completedSurahs || [];
  const totalAyahsMemorized = user?.totalAyahsMemorized || 0;
  const hasCompletedQuran = user?.hasCompletedQuran || false;
  const userBadges = user?.badges || [];

  const handleSave = async () => {
    await updateProfile({
      name: editName,
      bio: editBio,
      profilePicture: selectedIcon
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(user?.name || '');
    setEditBio(user?.bio || '');
    setSelectedIcon(user?.profilePicture || 'kaaba');
    setIsEditing(false);
  };

  // Get earned badges
  const earnedSurahBadges = surahBadges.filter(b => completedSurahs.includes(b.surah));
  const earnedMilestoneBadges = milestoneBadges.filter(b => userBadges.includes(b.id));

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="bg-gradient-to-br from-emerald-primary to-emerald-light text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className={`w-32 h-32 rounded-full flex items-center justify-center text-6xl relative ${
                hasCompletedQuran 
                  ? 'bg-gradient-to-br from-gold-primary to-amber-500 ring-4 ring-gold-primary/50 shadow-gold-glow' 
                  : 'bg-white/20 backdrop-blur-sm'
              }`}>
                {getProfileIcon(user?.profilePicture || 'kaaba')}
                
                {/* Surah count badge */}
                {completedSurahs.length > 0 && (
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center text-sm font-bold shadow-lg border-2 border-white">
                    {completedSurahs.length}
                  </div>
                )}

                {/* Khatm star */}
                {hasCompletedQuran && (
                  <div className="absolute -top-3 -left-3 w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                    <Star className="w-5 h-5 text-white fill-white" />
                  </div>
                )}
              </div>

              {isEditing && (
                <button
                  onClick={() => setShowIconPicker(!showIconPicker)}
                  className="absolute bottom-0 right-0 bg-gold-primary text-white rounded-full p-2 shadow-lg hover:bg-gold-dark transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-gold-primary"
                    placeholder="Your name"
                  />
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-gold-primary resize-none"
                    placeholder="Tell us about your Hifz journey..."
                    rows="3"
                  />
                  <div className="flex space-x-2">
                    <Button variant="gold" onClick={handleSave} className="flex items-center space-x-2">
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="flex items-center space-x-2 bg-white/20 text-white border-white/30">
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-4xl font-bold mb-2">{user?.name}</h1>
                  <p className="text-white/80 mb-2 flex items-center justify-center md:justify-start space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{user?.email}</span>
                  </p>
                  {user?.bio && (
                    <p className="text-white/90 mt-3 italic">{user.bio}</p>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="mt-4 flex items-center space-x-2 bg-white/20 text-white border-white/30 hover:bg-white/30"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </Button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold">{completedSurahs.length}</p>
                <p className="text-sm text-white/80">Surahs</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{totalAyahsMemorized}</p>
                <p className="text-sm text-white/80">Ayahs</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{userBadges.length}</p>
                <p className="text-sm text-white/80">Badges</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Icon Picker Modal */}
      {showIconPicker && isEditing && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowIconPicker(false)}
        >
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-navy-primary mb-4">Choose Profile Icon</h3>
            <div className="grid grid-cols-6 gap-4">
              {profileIcons.map((icon) => (
                <button
                  key={icon.id}
                  onClick={() => {
                    setSelectedIcon(icon.id);
                    setShowIconPicker(false);
                  }}
                  className={`p-4 rounded-lg text-4xl transition-all hover:scale-110 ${
                    selectedIcon === icon.id
                      ? 'bg-gold-primary/20 ring-2 ring-gold-primary shadow-gold-glow'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {icon.emoji}
                </button>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Milestone Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center space-x-3">
          <Trophy className="w-8 h-8 text-gold-primary" />
          <span>Milestone Achievements</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {milestoneBadges.filter((badge) => userBadges.includes(badge.id)).length === 0 ? (
            <div className="col-span-full text-center py-8 text-lg text-gray-400">
              No milestone achievements yet. Start memorizing to unlock your first milestone!
            </div>
          ) : (
            milestoneBadges
              .filter((badge) => userBadges.includes(badge.id))
              .map((badge) => {
                const isEarned = true; // All filtered badges are earned
                return (
                  <motion.div
                    key={badge.id}
                    whileHover={{ scale: 1.05 }}
                  >
                    <Card className={`bg-gradient-to-br ${badge.color} border-2 border-white/50 text-white relative overflow-hidden`}>
                      {/* White background layer for emoji visibility */}
                      <div className="absolute inset-0 bg-white opacity-85 -z-10"></div>
                      <div className="text-center relative z-10">
                        <div className="text-6xl mb-3 relative">
                          <span className="relative">{badge.icon}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-white drop-shadow-lg">{badge.name}</h3>
                        <p className="text-sm mb-2 text-white/90 drop-shadow">{badge.description}</p>
                        <div className="mt-3 flex items-center justify-center space-x-2 text-sm font-semibold text-white drop-shadow-md">
                          <Award className="w-4 h-4" />
                          <span>Earned!</span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })
          )}
        </div>
      </motion.div>

      {/* Surah Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-white mb-6 flex items-center space-x-3">
          <Award className="w-8 h-8 text-gold-primary" />
          <span>Surah Completion Badges</span>
        </h2>
        <Card>
          <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-3">
            {surahBadges.map((badge) => {
              const isEarned = completedSurahs.includes(badge.surah);
              return (
                <div
                  key={badge.id}
                  className={`relative group ${isEarned ? '' : 'opacity-30'}`}
                  title={`${badge.name}${isEarned ? ' ✓' : ''}`}
                >
                  <div className={`w-full aspect-square rounded-lg flex flex-col items-center justify-center transition-all relative ${
                    isEarned 
                      ? `bg-gradient-to-br ${badge.color} shadow-lg hover:scale-110 border-2 border-white/50` 
                      : 'bg-gray-200'
                  }`}>
                    {/* White solid background for emoji visibility */}
                    <div className={`absolute inset-0 bg-white rounded-lg -z-10 ${isEarned ? 'opacity-85' : ''}`}></div>
                    <span className="text-2xl relative z-10">{badge.icon}</span>
                    <span className={`text-xs font-bold mt-1 relative z-10 ${
                      isEarned ? 'text-white drop-shadow-md' : 'text-gray-600'
                    }`}>{badge.surah}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
