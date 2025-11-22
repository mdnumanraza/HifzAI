import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../ui/Card.jsx';
import AudioSpeedControl from '../audio/AudioSpeedControl.jsx';
import useStore from '../../store/useStore.js';

export default function AyahCard({ ayah, showBismillah = false }) {
  const audioSpeed = useStore(s => s.audioSpeed);
  const setAudioSpeed = useStore(s => s.setAudioSpeed);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Apply speed when it changes
    if (audioRef.current) {
      audioRef.current.playbackRate = audioSpeed;
    }
  }, [audioSpeed]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.playbackRate = audioSpeed; // Ensure speed is applied
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
    if (audioRef.current) {
      audioRef.current.loop = !isLooping;
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setAudioSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative group">
        {/* Decorative Corner */}
        <div className="absolute top-0 right-0 w-12 h-12">
          <svg viewBox="0 0 40 40" className="w-full h-full text-gold-primary opacity-20">
            <path d="M0 0 L40 0 L40 40 Z" fill="currentColor" />
          </svg>
        </div>

        <div className="space-y-6">
          {/* Bismillah (if first ayah of surah, except Surah 9) */}
          {showBismillah && (
            <div className="text-center pb-4 border-b border-emerald-primary/20">
              <p className="text-2xl text-emerald-primary font-amiri">
                بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ
              </p>
            </div>
          )}

          {/* Ayah Number Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-primary to-emerald-light flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">{ayah.numberInSurah}</span>
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Ayah {ayah.numberInSurah}</span>
              </div>
            </div>

            {/* Audio Controls */}
            {ayah.audio && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleLoop}
                  className={`p-2 rounded-lg transition-all ${
                    isLooping
                      ? 'bg-gold-primary text-white shadow-gold-glow'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={isLooping ? 'Disable Loop' : 'Enable Loop'}
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={handlePlayPause}
                  className="p-3 rounded-lg bg-gradient-to-r from-emerald-primary to-emerald-light text-white hover:shadow-gold-glow transition-all"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
              </div>
            )}
          </div>

          {/* Audio Speed Control */}
          {ayah.audio && (
            <div className="flex justify-end">
              <AudioSpeedControl 
                speed={audioSpeed} 
                onSpeedChange={handleSpeedChange}
                isMobile={isMobile}
              />
            </div>
          )}

          {/* Arabic Text */}
          <div className="bg-pearl/50 rounded-2xl p-6 border border-emerald-primary/10">
            <p className="text-3xl text-right font-amiri text-navy-primary" style={{ lineHeight: '3.2' }}>
              {ayah.text}
            </p>
          </div>

          {/* English Translation (if available) */}
          {ayah.translation && (
            <div className="pt-2">
              <p className="text-gray-700 leading-relaxed">
                {ayah.translation}
              </p>
            </div>
          )}

          {/* Hidden Audio Element */}
          {ayah.audio && (
            <audio
              ref={audioRef}
              src={ayah.audio}
              onEnded={handleEnded}
              loop={isLooping}
            />
          )}
        </div>

        {/* Decorative Separator */}
        <div className="mt-6 pt-6 border-t border-emerald-primary/10 flex justify-center">
          <div className="flex space-x-1">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-primary to-gold-primary opacity-40"
              />
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
