import React, { useEffect, useRef } from 'react';
import useTravelModeStore, { REPEAT_MODES } from '../../store/useTravelModeStore';
import useStore from '../../store/useStore';

const TravelAudioController = () => {
  const audioRef = useRef(null);

  const enabled = useTravelModeStore((s) => s.enabled);
  const isPlaying = useTravelModeStore((s) => s.isPlaying);
  const currentIndex = useTravelModeStore((s) => s.currentIndex);
  const currentRepeat = useTravelModeStore((s) => s.currentRepeat);
  const repeatMode = useTravelModeStore((s) => s.repeatMode);
  const onAyahEnded = useTravelModeStore((s) => s.onAyahEnded);
  const nextAyah = useTravelModeStore((s) => s.nextAyah);
  const prevAyah = useTravelModeStore((s) => s.prevAyah);

  const todayAyahs = useStore((s) => s.dailyAyahs || []);

  // Load audio when index/repeat changes or enabled
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    // If disabled, pause immediately and clear source to stop audio
    if (!enabled) {
      try {
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      } catch {}
      return;
    }
    if (!todayAyahs[currentIndex]) return;

    const src = todayAyahs[currentIndex]?.audioUrl;
    if (!src) return;

    audio.src = src;
    if (isPlaying) {
      audio.play().catch((err) => {
        console.warn('Unable to play this ayah, skipping to next.', err);
        nextAyah();
      });
    } else {
      audio.pause();
    }

    // Update Media Session metadata
    const ayah = todayAyahs[currentIndex];
    if ('mediaSession' in navigator && ayah) {
      try {
        navigator.mediaSession.metadata = new window.MediaMetadata({
          title: `Ayah ${ayah.ayah}`,
          artist: `Surah ${ayah.surahName}`,
          album: 'HifzAI Travel Mode',
        });

        navigator.mediaSession.setActionHandler('nexttrack', () => nextAyah());
        navigator.mediaSession.setActionHandler('previoustrack', () => prevAyah());
        navigator.mediaSession.setActionHandler('play', () => audio.play().catch(() => {}));
        navigator.mediaSession.setActionHandler('pause', () => audio.pause());
      } catch (e) {
        // Some browsers may throw
      }
    }
  }, [enabled, isPlaying, currentIndex, currentRepeat, repeatMode, todayAyahs]);

  // onended handler
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => {
      onAyahEnded();
    };
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [onAyahEnded]);

  // Render hidden audio element
  return <audio ref={audioRef} className="hidden" />;
};

export default TravelAudioController;
