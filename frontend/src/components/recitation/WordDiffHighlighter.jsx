import React from 'react';
import { motion } from 'framer-motion';

const WordDiffHighlighter = ({ wordDiff, expectedText, userText }) => {
  // Split expected text into words for highlighting
  const expectedWords = expectedText.split(/\s+/);
  
  const getWordStatus = (wordIndex) => {
    const diffItem = wordDiff.find(item => item.position === wordIndex);
    return diffItem || { status: 'correct', issue: null };
  };

  const getWordColor = (status) => {
    switch (status) {
      case 'correct':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'partial':
        return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'incorrect':
        return 'bg-red-100 border-red-300 text-red-800';
      case 'missing':
        return 'bg-gray-100 border-gray-300 text-gray-500 opacity-50';
      case 'extra':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-600';
    }
  };

  const getIssueDescription = (issue) => {
    const issueDescriptions = {
      'missing_elongation': 'Missing elongation (Madd)',
      'emphatic_letter_missing': 'Emphatic letter pronunciation',
      'ikhfa_idgham_issue': 'Ikhfa/Idgham rule issue',
      'pronunciation_issue': 'Pronunciation needs improvement',
      'wrong_word_recited': 'Incorrect word recited',
      'word_not_recited': 'Word was not recited'
    };
    
    return issueDescriptions[issue] || 'Pronunciation issue';
  };

  return (
    <div className="space-y-6">
      {/* Expected text with highlighting */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Expected Recitation:</h4>
        <div className="bg-gray-50 rounded-lg p-4 border">
          <div className="text-right text-lg font-arabic leading-relaxed" dir="rtl">
            {expectedWords.map((word, index) => {
              const wordStatus = getWordStatus(index);
              
              return (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className={`inline-block mx-1 my-1 px-2 py-1 rounded-md border transition-all duration-300 ${getWordColor(wordStatus.status)}`}
                  title={wordStatus.issue ? getIssueDescription(wordStatus.issue) : undefined}
                >
                  {word}
                  {wordStatus.issue && (
                    <span className="inline-block w-2 h-2 rounded-full bg-current opacity-50 ml-1" />
                  )}
                </motion.span>
              );
            })}
          </div>
        </div>
      </div>

      {/* User recitation */}
      {userText && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Your Recitation:</h4>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="text-right text-lg font-arabic leading-relaxed text-blue-800" dir="rtl">
              {userText}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="bg-white rounded-lg p-4 border">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Color Legend:</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-4 h-4 rounded bg-green-100 border border-green-300"></div>
            <span className="text-green-700 font-medium">Correct</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-4 h-4 rounded bg-yellow-100 border border-yellow-300"></div>
            <span className="text-yellow-700 font-medium">Partial</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="w-4 h-4 rounded bg-red-100 border border-red-300"></div>
            <span className="text-red-700 font-medium">Incorrect</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="w-4 h-4 rounded bg-gray-100 border border-gray-300 opacity-50"></div>
            <span className="text-gray-600 font-medium">Missing</span>
          </motion.div>
          
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="w-4 h-4 rounded bg-purple-100 border border-purple-300"></div>
            <span className="text-purple-700 font-medium">Extra</span>
          </motion.div>
        </div>
        
        <div className="mt-3 text-xs text-gray-500">
          <p className="flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-gray-400 mr-2"></span>
            Dot indicates specific pronunciation issue - hover for details
          </p>
        </div>
      </div>
    </div>
  );
};

export default WordDiffHighlighter;