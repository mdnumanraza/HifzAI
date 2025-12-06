import React from 'react';
import { motion } from 'framer-motion';

const AccuracyScore = ({ accuracy, size = 'large', showDetails = true }) => {
  const scorePercentage = Math.round(accuracy * 100);
  const circumference = 2 * Math.PI * 40;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (scorePercentage / 100) * circumference;
  
  const getScoreColor = () => {
    if (scorePercentage >= 90) return '#10B981'; // Green
    if (scorePercentage >= 75) return '#F59E0B'; // Yellow
    if (scorePercentage >= 50) return '#F97316'; // Orange
    return '#EF4444'; // Red
  };

  const getScoreGrade = () => {
    if (scorePercentage >= 95) return 'Excellent';
    if (scorePercentage >= 85) return 'Very Good';
    if (scorePercentage >= 70) return 'Good';
    if (scorePercentage >= 50) return 'Fair';
    return 'Needs Practice';
  };

  const dimensions = size === 'large' ? { 
    svg: 100, 
    text: 'text-xl', 
    grade: 'text-sm',
    container: 'w-32 h-32'
  } : {
    svg: 60,
    text: 'text-sm',
    grade: 'text-xs',
    container: 'w-20 h-20'
  };

  return (
    <div className={`flex flex-col items-center ${size === 'large' ? 'space-y-2' : 'space-y-1'}`}>
      <div className={`relative ${dimensions.container} flex items-center justify-center`}>
        {/* Background circle */}
        <svg
          width={dimensions.svg}
          height={dimensions.svg}
          viewBox="0 0 100 100"
          className="transform -rotate-90"
        >
          {/* Background track */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#E5E7EB"
            strokeWidth="8"
            fill="transparent"
          />
          
          {/* Progress circle with gradient */}
          <defs>
            <linearGradient id={`scoreGradient-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F9D976" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
          </defs>
          
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            stroke={`url(#scoreGradient-${size})`}
            strokeWidth="8"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{
              duration: 1.5,
              ease: "easeOut",
              delay: 0.5
            }}
          />
        </svg>
        
        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, duration: 0.5, type: "spring" }}
            className={`font-bold text-gray-800 ${dimensions.text}`}
          >
            {scorePercentage}%
          </motion.div>
        </div>
      </div>
      
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="text-center"
        >
          <div className={`font-semibold ${dimensions.grade}`} style={{ color: getScoreColor() }}>
            {getScoreGrade()}
          </div>
          {size === 'large' && (
            <div className="text-xs text-gray-500 mt-1">
              Accuracy Score
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AccuracyScore;