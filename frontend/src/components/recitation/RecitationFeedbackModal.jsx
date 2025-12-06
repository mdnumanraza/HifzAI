import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, CheckCircle, RotateCcw, TrendingUp, MessageSquare } from 'lucide-react';
import AccuracyScore from './AccuracyScore';
import WordDiffHighlighter from './WordDiffHighlighter';

const RecitationFeedbackModal = ({ 
  isOpen, 
  onClose, 
  analysisResult,
  onAddToRevision,
  onMarkAsReviewed,
  surah,
  ayah
}) => {
  const [activeTab, setActiveTab] = useState('analysis');

  if (!isOpen || !analysisResult) return null;

  const {
    userRecitedText,
    expectedText,
    accuracyScore,
    errorList,
    aiFeedback,
    stats,
    missingWords,
    extraWords
  } = analysisResult;

  const tabs = [
    { id: 'analysis', label: 'Analysis', icon: TrendingUp },
    { id: 'feedback', label: 'AI Feedback', icon: MessageSquare },
    { id: 'details', label: 'Details', icon: BookOpen }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">Recitation Analysis</h2>
                <p className="text-amber-100">Surah {surah}, Ayah {ayah}</p>
              </div>
              <div className="flex items-center space-x-4">
                <AccuracyScore 
                  accuracy={accuracyScore} 
                  size="small" 
                  showDetails={false}
                />
                <button
                  onClick={onClose}
                  className="text-white hover:text-amber-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b">
            <div className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-amber-600 border-b-2 border-amber-600 bg-amber-50'
                        : 'text-gray-600 hover:text-amber-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 240px)' }}>
            <AnimatePresence mode="wait">
              {/* Analysis Tab */}
              {activeTab === 'analysis' && (
                <motion.div
                  key="analysis"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6 space-y-6"
                >
                  {/* Accuracy Overview */}
                  <div className="text-center">
                    <AccuracyScore accuracy={accuracyScore} size="large" />
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                        <div className="font-semibold text-green-800">{stats?.correctWords || 0}</div>
                        <div className="text-green-600">Correct Words</div>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                        <div className="font-semibold text-yellow-800">{stats?.partialWords || 0}</div>
                        <div className="text-yellow-600">Partial Matches</div>
                      </div>
                      <div className="bg-red-50 rounded-lg p-3 border border-red-200">
                        <div className="font-semibold text-red-800">{stats?.incorrectWords || 0}</div>
                        <div className="text-red-600">Incorrect</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="font-semibold text-gray-800">{stats?.totalWords || 0}</div>
                        <div className="text-gray-600">Total Words</div>
                      </div>
                    </div>
                  </div>

                  {/* Word Highlighting */}
                  <WordDiffHighlighter
                    wordDiff={errorList || []}
                    expectedText={expectedText}
                    userText={userRecitedText}
                  />
                </motion.div>
              )}

              {/* AI Feedback Tab */}
              {activeTab === 'feedback' && (
                <motion.div
                  key="feedback"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6 space-y-6"
                >
                  {/* Summary */}
                  {aiFeedback?.summary && (
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Overall Feedback
                      </h4>
                      <p className="text-blue-700 leading-relaxed">{aiFeedback.summary}</p>
                    </div>
                  )}

                  {/* Mistakes */}
                  {aiFeedback?.mistakes && aiFeedback.mistakes.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h4 className="font-semibold text-red-700 mb-3">Areas for Improvement</h4>
                      <div className="space-y-2">
                        {aiFeedback.mistakes.map((mistake, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            className="flex items-start space-x-3 bg-red-50 rounded-lg p-3 border border-red-200"
                          >
                            <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                            <p className="text-red-700 text-sm">{mistake}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Improvements */}
                  {aiFeedback?.improvements && aiFeedback.improvements.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h4 className="font-semibold text-blue-700 mb-3">Improvement Suggestions</h4>
                      <div className="space-y-2">
                        {aiFeedback.improvements.map((improvement, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                            className="flex items-start space-x-3 bg-blue-50 rounded-lg p-3 border border-blue-200"
                          >
                            <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                            <p className="text-blue-700 text-sm">{improvement}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Tajweed Tips */}
                  {aiFeedback?.tajweedTips && aiFeedback.tajweedTips.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <h4 className="font-semibold text-green-700 mb-3">Tajweed Tips</h4>
                      <div className="space-y-2">
                        {aiFeedback.tajweedTips.map((tip, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                            className="flex items-start space-x-3 bg-green-50 rounded-lg p-3 border border-green-200"
                          >
                            <BookOpen className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <p className="text-green-700 text-sm">{tip}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Details Tab */}
              {activeTab === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-6 space-y-6"
                >
                  {/* Missing Words */}
                  {missingWords && missingWords.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3">Missing Words</h4>
                      <div className="flex flex-wrap gap-2">
                        {missingWords.map((word, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 border border-gray-300 rounded-lg text-sm font-arabic text-gray-700"
                          >
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Extra Words */}
                  {extraWords && extraWords.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3">Extra Words</h4>
                      <div className="flex flex-wrap gap-2">
                        {extraWords.map((word, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-100 border border-purple-300 rounded-lg text-sm font-arabic text-purple-700"
                          >
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Detailed Error List */}
                  {errorList && errorList.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3">Detailed Analysis</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {errorList.map((error, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="font-arabic text-lg">{error.word}</span>
                              <div className="text-xs">
                                <div className={`font-semibold ${
                                  error.status === 'correct' ? 'text-green-600' :
                                  error.status === 'partial' ? 'text-yellow-600' :
                                  error.status === 'incorrect' ? 'text-red-600' :
                                  'text-gray-600'
                                }`}>
                                  {error.status.toUpperCase()}
                                </div>
                                {error.issue && (
                                  <div className="text-gray-500 mt-1">
                                    {error.issue.replace(/_/g, ' ')}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="border-t p-6">
            <div className="flex justify-center space-x-4">
              {accuracyScore < 0.85 && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onAddToRevision && onAddToRevision()}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 shadow-lg"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Add to Revision</span>
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onMarkAsReviewed && onMarkAsReviewed()}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 shadow-lg"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Mark as Reviewed</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg"
              >
                Close
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RecitationFeedbackModal;