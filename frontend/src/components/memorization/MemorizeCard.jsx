import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCw, CheckCircle, Sparkles } from 'lucide-react';
import useStore from '../../store/useStore.js';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';
import AudioSpeedControl from '../audio/AudioSpeedControl.jsx';

export default function MemorizeCard({ ayah, index, selectedFont = 'Scheherazade New' }) {
  const markAyahCompletedOptimistic = useStore(s => s.markAyahCompletedOptimistic);
  const audioSpeed = useStore(s => s.audioSpeed);
  const setAudioSpeed = useStore(s => s.setAudioSpeed);
  const memorizedSet = useStore(s => new Set(s.progress?.memorizedAyahs?.map(m => `${m.surah}-${m.ayah}`)));
  const isMemorized = memorizedSet.has(`${ayah.surah}-${ayah.ayah}`);
  const [playing, setPlaying] = useState(false);
  const [loop, setLoop] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    audioRef.current = new Audio(ayah.audioUrl);
    audioRef.current.loop = loop;
    audioRef.current.playbackRate = audioSpeed; // Apply speed on init
    audioRef.current.addEventListener('ended', () => setPlaying(false));
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [ayah.audioUrl, loop, audioSpeed]);

  useEffect(() => {
    // Apply speed when it changes
    if (audioRef.current) {
      audioRef.current.playbackRate = audioSpeed;
    }
  }, [audioSpeed]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.playbackRate = audioSpeed; // Ensure speed is applied
      audioRef.current.play();
      setPlaying(true);
    }
  };

  const toggleLoop = () => {
    setLoop(l => !l);
    if (audioRef.current) audioRef.current.loop = !loop;
  };

  const handleSpeedChange = (newSpeed) => {
    setAudioSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const handleMemorized = async () => {
    if (audioRef.current) audioRef.current.pause();
    setPlaying(false);
    setIsExiting(true);
    
    // Wait for fade-out animation
    setTimeout(() => {
      markAyahCompletedOptimistic(ayah.surah, ayah.ayah);
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ 
        opacity: isExiting ? 0 : 1, 
        y: isExiting ? -30 : 0,
        scale: isExiting ? 0.95 : 1
      }}
      transition={{ delay: isExiting ? 0 : index * 0.1, duration: isExiting ? 0.3 : 0.4 }}
    >
      <Card className={`relative overflow-hidden ${isMemorized ? 'border-emerald-primary border-2' : ''}`}>
        {/* Decorative Corner */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-gold-primary/20 to-transparent rounded-bl-full" />
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-primary/10 flex items-center justify-center">
              <span className="text-emerald-primary font-bold">{index + 1}</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Surah {ayah.surah}</p>
              <p className="font-semibold text-navy-primary">{ayah.surahName || `Surah ${ayah.surah}`}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Ayah</p>
            <p className="text-2xl font-bold text-gold-primary">{ayah.ayah}</p>
          </div>
        </div>

        {/* Arabic Text - UPGRADED WITH QURANIC FONT */}
        <motion.div 
          className="relative bg-gradient-to-br from-pearl via-white to-pearl rounded-2xl p-8 mb-6 border-2 border-gold-primary/30 shadow-lg"
          whileHover={{ scale: 1.01, boxShadow: '0 0 30px rgba(212, 175, 55, 0.4)' }}
          transition={{ duration: 0.3 }}
        >
          {/* Islamic Geometric Border Pattern */}
          <div className="absolute inset-0 rounded-2xl border-4 border-double border-gold-primary/20 pointer-events-none" />
          
          {/* Golden Corner Decorations */}
          <div className="absolute top-2 left-2 w-8 h-8">
            <svg viewBox="0 0 40 40" className="w-full h-full text-gold-primary opacity-40">
              <path d="M0 0 L40 0 L0 40 Z" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute top-2 right-2 w-8 h-8 transform rotate-90">
            <svg viewBox="0 0 40 40" className="w-full h-full text-gold-primary opacity-40">
              <path d="M0 0 L40 0 L0 40 Z" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute bottom-2 left-2 w-8 h-8 transform -rotate-90">
            <svg viewBox="0 0 40 40" className="w-full h-full text-gold-primary opacity-40">
              <path d="M0 0 L40 0 L0 40 Z" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute bottom-2 right-2 w-8 h-8 transform rotate-180">
            <svg viewBox="0 0 40 40" className="w-full h-full text-gold-primary opacity-40">
              <path d="M0 0 L40 0 L0 40 Z" fill="currentColor" />
            </svg>
          </div>

          {/* Gold accent underline */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-gold-primary to-transparent rounded-full" />

          <p 
            className="text-4xl md:text-5xl text-right text-navy-primary relative z-10 px-4"
            style={{ 
              lineHeight: '5rem',
              fontFamily: selectedFont
            }}
          >
            {ayah.text}
          </p>
        </motion.div>

        {/* Audio Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="primary"
              onClick={togglePlay}
              className="flex items-center space-x-2 px-6"
            >
              {playing ? <Pause size={18} /> : <Play size={18} />}
              <span>{playing ? 'Pause' : 'Play Audio'}</span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              onClick={toggleLoop}
              className={`flex items-center space-x-2 px-6 transition-all ${loop ? 'bg-gold-primary/10 border-gold-primary' : ''}`}
            >
              <RotateCw size={18} className={loop ? 'text-gold-primary' : ''} />
              <span>Loop: {loop ? 'On' : 'Off'}</span>
            </Button>
          </motion.div>
        </div>

        {/* Audio Speed Control */}
        <div className="flex justify-center mb-6">
          <AudioSpeedControl 
            speed={audioSpeed} 
            onSpeedChange={handleSpeedChange}
            isMobile={isMobile}
          />
        </div>

        {/* Mark Memorized Button - UPGRADED */}
        <motion.div
          whileHover={{ scale: isMemorized ? 1 : 1.02 }}
          whileTap={{ scale: isMemorized ? 1 : 0.98 }}
        >
          <Button
            variant={isMemorized ? 'primary' : 'gold'}
            onClick={handleMemorized}
            disabled={isMemorized}
            className="w-full flex items-center justify-center space-x-2 text-lg py-4 shadow-lg hover:shadow-gold-glow transition-all duration-300"
          >
            <CheckCircle size={22} />
            <span className="font-semibold">{isMemorized ? 'Memorized ✓' : 'Mark as Memorized'}</span>
          </Button>
        </motion.div>

        {isMemorized && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="absolute top-4 left-4"
          >
            <div className="bg-gradient-to-br from-emerald-primary to-emerald-light text-white rounded-full p-3 shadow-xl">
              <CheckCircle size={28} />
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
