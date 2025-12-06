import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Square, Play, RotateCcw, Upload } from 'lucide-react';

const RecitationRecorder = ({ 
  isOpen, 
  onClose, 
  onRecordingComplete, 
  surah, 
  ayah, 
  expectedText,
  isLoading = false 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [waveformData, setWaveformData] = useState([]);
  
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const timerRef = useRef(null);

  // Initialize audio recording
  const initializeRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        } 
      });
      
      // Setup audio context for waveform visualization
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      // Setup MediaRecorder
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const chunks = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        // Clean up audio context
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
      };
      
      setMediaRecorder(recorder);
      
      return { recorder, dataArray, bufferLength };
    } catch (error) {
      console.error('Error accessing microphone:', error);
      throw new Error('Could not access microphone. Please check permissions.');
    }
  };

  // Start recording
  const startRecording = async () => {
    try {
      const { recorder, dataArray, bufferLength } = await initializeRecording();
      
      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setAudioBlob(null);
      setAudioUrl(null);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      // Start waveform visualization
      const drawWaveform = () => {
        if (!analyserRef.current || !canvasRef.current) return;
        
        analyserRef.current.getByteFrequencyData(dataArray);
        
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        
        const barWidth = width / bufferLength;
        let x = 0;
        
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#F9D976');
        gradient.addColorStop(1, '#D4AF37');
        
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * height * 0.8;
          
          ctx.fillStyle = gradient;
          ctx.fillRect(x, height - barHeight, barWidth - 2, barHeight);
          
          x += barWidth;
        }
        
        if (isRecording) {
          animationFrameRef.current = requestAnimationFrame(drawWaveform);
        }
      };
      
      drawWaveform();
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not start recording: ' + error.message);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  // Reset recording
  const resetRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setWaveformData([]);
    
    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  // Play recorded audio
  const playRecording = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  // Submit recording for analysis
  const submitRecording = () => {
    if (audioBlob) {
      onRecordingComplete(audioBlob);
    }
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Record Recitation
            </h3>
            <p className="text-sm text-gray-600">
              Surah {surah}, Ayah {ayah}
            </p>
          </div>

          {/* Expected text */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-right text-lg font-arabic text-gray-800 leading-relaxed">
              {expectedText}
            </p>
          </div>

          {/* Recording interface */}
          <div className="space-y-4">
            {/* Waveform visualization */}
            <div className="bg-gray-50 rounded-lg p-4 h-32 flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={280}
                height={80}
                className="w-full h-full"
                style={{ maxHeight: '80px' }}
              />
              {!isRecording && !audioBlob && (
                <div className="text-gray-400 text-sm">
                  Waveform will appear here during recording
                </div>
              )}
            </div>

            {/* Timer */}
            <div className="text-center">
              <div className="text-2xl font-mono text-gray-700">
                {formatTime(recordingTime)}
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center space-x-4">
              {!isRecording && !audioBlob && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={startRecording}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 shadow-lg disabled:opacity-50"
                >
                  <Mic className="w-5 h-5" />
                  <span>Start Recording</span>
                </motion.button>
              )}

              {isRecording && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={stopRecording}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 shadow-lg"
                >
                  <Square className="w-5 h-5" />
                  <span>Stop Recording</span>
                </motion.button>
              )}

              {audioBlob && !isRecording && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={playRecording}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Play</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetRecording}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={submitRecording}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 shadow-lg disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Analyze</span>
                      </>
                    )}
                  </motion.button>
                </>
              )}
            </div>

            {/* Instructions */}
            <div className="text-xs text-gray-500 text-center">
              {!audioBlob && !isRecording && 'Click "Start Recording" and recite the ayah clearly'}
              {isRecording && 'Recording... Speak clearly into your microphone'}
              {audioBlob && !isRecording && 'Recording complete! Play to review or analyze for feedback'}
            </div>
          </div>

          {/* Close button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 font-medium"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RecitationRecorder;