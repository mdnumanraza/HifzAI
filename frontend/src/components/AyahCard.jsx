import React, { useEffect, useRef, useState } from 'react';
import { Mic } from 'lucide-react';
import useStore from '../store/useStore.js';
import { RecitationRecorder, RecitationFeedbackModal } from './recitation';

export default function AyahCard({ ayah }) {
  const markMemorized = useStore(s => s.markMemorized);
  const analyzeRecitation = useStore(s => s.analyzeRecitation);
  const recitationLoading = useStore(s => s.recitationAnalysis.loading);
  const recitationResult = useStore(s => s.recitationAnalysis.latestResult);
  const clearRecitationResult = useStore(s => s.clearRecitationResult);
  const memorizedSet = useStore(s => new Set(s.progress?.memorizedAyahs?.map(m => `${m.surah}-${m.ayah}`)));
  const isMemorized = memorizedSet.has(`${ayah.surah}-${ayah.ayah}`);
  const [playing, setPlaying] = useState(false);
  const [loop, setLoop] = useState(true);
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
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

  const handleReciteNow = () => {
    setShowRecordingModal(true);
  };

  const handleRecordingComplete = async (audioBlob) => {
    try {
      setShowRecordingModal(false);
      
      // Analyze the recording
      await analyzeRecitation(audioBlob, ayah.surah, ayah.ayah);
      
      // Show feedback modal
      setShowFeedbackModal(true);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed: ' + error.message);
    }
  };

  const handleAddToRevision = () => {
    // TODO: Integrate with revision system
    console.log('Adding to revision:', ayah.surah, ayah.ayah);
    setShowFeedbackModal(false);
    clearRecitationResult();
  };

  const handleMarkAsReviewed = () => {
    console.log('Marked as reviewed:', ayah.surah, ayah.ayah);
    setShowFeedbackModal(false);
    clearRecitationResult();
  };

  const closeFeedbackModal = () => {
    setShowFeedbackModal(false);
    clearRecitationResult();
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
        <button 
          onClick={handleReciteNow}
          disabled={recitationLoading}
          className="px-3 py-1 rounded bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm flex items-center space-x-1 hover:from-amber-600 hover:to-amber-700 transition-colors disabled:opacity-50"
        >
          <Mic className="w-3 h-3" />
          <span>{recitationLoading ? 'Processing...' : 'Recite Now'}</span>
        </button>
      </div>
      <button onClick={handleMemorized} disabled={isMemorized} className={`px-4 py-2 rounded text-white ${isMemorized ? 'bg-green-600' : 'bg-emerald-600'}`}>{isMemorized ? 'Memorized' : 'Mark Memorized'}</button>
      
      {/* Recording Modal */}
      <RecitationRecorder
        isOpen={showRecordingModal}
        onClose={() => setShowRecordingModal(false)}
        onRecordingComplete={handleRecordingComplete}
        surah={ayah.surah}
        ayah={ayah.ayah}
        expectedText={ayah.text}
        isLoading={recitationLoading}
      />
      
      {/* Feedback Modal */}
      <RecitationFeedbackModal
        isOpen={showFeedbackModal}
        onClose={closeFeedbackModal}
        analysisResult={recitationResult}
        onAddToRevision={handleAddToRevision}
        onMarkAsReviewed={handleMarkAsReviewed}
        surah={ayah.surah}
        ayah={ayah.ayah}
      />
    </div>
  );
}
