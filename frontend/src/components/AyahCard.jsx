import React, { useEffect, useRef, useState } from 'react';
import useStore from '../store/useStore.js';

export default function AyahCard({ ayah }) {
  const markMemorized = useStore(s => s.markMemorized);
  const memorizedSet = useStore(s => new Set(s.progress?.memorizedAyahs?.map(m => `${m.surah}-${m.ayah}`)));
  const isMemorized = memorizedSet.has(`${ayah.surah}-${ayah.ayah}`);
  const [playing, setPlaying] = useState(false);
  const [loop, setLoop] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio(ayah.audioUrl);
    audioRef.current.loop = loop;
    return () => { audioRef.current && audioRef.current.pause(); };
  }, [ayah.audioUrl, loop]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play(); setPlaying(true); }
  };

  const toggleLoop = () => {
    setLoop(l => !l);
    if (audioRef.current) audioRef.current.loop = !loop;
  };

  const handleMemorized = async () => {
    await markMemorized(ayah.surah, ayah.ayah);
  };

  return (
    <div className={`bg-white p-4 rounded shadow ${isMemorized ? 'border-green-500 border' : ''}`}>      
      <div className="flex justify-between mb-2 text-sm text-gray-600">
        <span>Surah {ayah.surah} ({ayah.surahName})</span>
        <span>Ayah {ayah.ayah}</span>
      </div>
      <p className="text-2xl leading-relaxed mb-4 font-arabic">{ayah.text}</p>
      <div className="flex items-center space-x-2 mb-4">
        <button onClick={togglePlay} className="px-3 py-1 rounded bg-indigo-600 text-white text-sm">{playing ? 'Pause' : 'Play'}</button>
        <button onClick={toggleLoop} className="px-3 py-1 rounded bg-gray-200 text-sm">Loop: {loop ? 'On' : 'Off'}</button>
        <button disabled className="px-3 py-1 rounded bg-gray-300 text-sm" title="Phase 2">AI (Soon)</button>
      </div>
      <button onClick={handleMemorized} disabled={isMemorized} className={`px-4 py-2 rounded text-white ${isMemorized ? 'bg-green-600' : 'bg-emerald-600'}`}>{isMemorized ? 'Memorized' : 'Mark Memorized'}</button>
    </div>
  );
}
