import React from 'react';
import { motion } from 'framer-motion';

export default function Logo({ size = 'default', className = '' }) {
  const sizes = {
    small: { width: 150, height: 55, aiSize: 24, arabicSize: 32, aiX: 10, arabicX: 55 },
    default: { width: 220, height: 80, aiSize: 36, arabicSize: 48, aiX: 15, arabicX: 75 },
    large: { width: 380, height: 140, aiSize: 58, arabicSize: 76, aiX: 20, arabicX: 120 }
  };

  const { width, height, aiSize, arabicSize, aiX, arabicX } = sizes[size];

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* GOLD GRADIENT DEFINITIONS */}
      <defs>
        {/* Main Gold Gradient */}
        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F9D976"/>
          <stop offset="50%" stopColor="#D4AF37"/>
          <stop offset="100%" stopColor="#B8941E"/>
        </linearGradient>

        {/* Shimmer Effect */}
        <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0"/>
          <stop offset="50%" stopColor="#FFF" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0"/>
          <animate attributeName="x1" values="-100%;200%" dur="3s" repeatCount="indefinite"/>
          <animate attributeName="x2" values="0%;300%" dur="3s" repeatCount="indefinite"/>
        </linearGradient>

        {/* Glow Filter */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        {/* Text Shadow */}
        <filter id="textShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.3"/>
        </filter>
      </defs>

      {/* Background Glow Circle */}
      <circle 
        cx={width * 0.5} 
        cy={height * 0.5} 
        r={height * 0.35} 
        fill="url(#goldGrad)" 
        opacity="0.1"
        filter="url(#glow)"
      />

      {/* ENGLISH AI */}
      <text 
        x={aiX} 
        y={height * 0.68}
        fill="white"
        fontFamily="Poppins, -apple-system, sans-serif"
        fontSize={aiSize}
        fontWeight="800"
        letterSpacing="0.05em"
        filter="url(#textShadow)"
      >
        AI
      </text>

      {/* ARABIC HIFZ - حِفْظ */}
      <text 
        x={arabicX} 
        y={height * 0.68}
        fill="url(#goldGrad)"
        fontFamily="Amiri, 'Scheherazade New', serif"
        fontSize={arabicSize}
        fontWeight="700"
        filter="url(#textShadow)"
      >
        حِفْظ
      </text>

      {/* Shimmer Overlay on Arabic */}
      <text 
        x={arabicX} 
        y={height * 0.68}
        fill="url(#shimmer)"
        fontFamily="Amiri, 'Scheherazade New', serif"
        fontSize={arabicSize}
        fontWeight="700"
        opacity="0.4"
      >
        حِفْظ
      </text>

      {/* AI Accent Dot */}
      <circle 
        cx={aiX - (size === 'small' ? 4 : size === 'default' ? 6 : 8)} 
        cy={height * 0.35} 
        r={size === 'small' ? 3 : size === 'default' ? 4 : 6} 
        fill="url(#goldGrad)"
      >
        <animate 
          attributeName="opacity" 
          values="0.5;1;0.5" 
          dur="2s" 
          repeatCount="indefinite"
        />
      </circle>

      {/* Subtle Underline */}
      <line 
        x1={aiX} 
        y1={height * 0.78} 
        x2={arabicX + arabicSize * 1.8} 
        y2={height * 0.78} 
        stroke="url(#goldGrad)" 
        strokeWidth={size === 'small' ? 1 : size === 'default' ? 1.5 : 2}
        opacity="0.3"
      />
    </svg>
  );
}

export function AnimatedLogo({ size = 'default', className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Logo size={size} className={className} />
    </motion.div>
  );
}
