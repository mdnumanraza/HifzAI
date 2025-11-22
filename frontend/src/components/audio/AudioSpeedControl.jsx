import React from 'react';
import { motion } from 'framer-motion';
import { Gauge } from 'lucide-react';

export default function AudioSpeedControl({ speed, onSpeedChange, isMobile = false }) {
  const speeds = [0.5, 0.6, 0.8, 1.0, 1.2, 1.5];

  if (isMobile) {
    // Mobile: Dropdown
    return (
      <div className="flex items-center space-x-2">
        <Gauge className="w-4 h-4 text-gold-primary" />
        <select
          value={speed}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          className="bg-white/90 backdrop-blur-sm text-navy-primary text-sm rounded-lg px-2 py-1 border border-gold-primary/30 focus:outline-none focus:ring-2 focus:ring-gold-primary shadow-sm"
        >
          {speeds.map((s) => (
            <option key={s} value={s}>
              {s}x
            </option>
          ))}
        </select>
      </div>
    );
  }

  // Desktop: Segmented Control
  return (
    <div className="flex items-center space-x-3">
      <Gauge className="w-4 h-4 text-gold-primary" />
      <div className="inline-flex bg-white/40 backdrop-blur-sm rounded-full p-1 border border-gold-primary/20 shadow-sm">
        {speeds.map((s) => (
          <motion.button
            key={s}
            onClick={() => onSpeedChange(s)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              speed === s
                ? 'bg-gradient-to-r from-gold-primary to-gold-dark text-white shadow-gold-glow'
                : 'text-navy-primary hover:bg-white/60'
            }`}
          >
            {s}x
          </motion.button>
        ))}
      </div>
    </div>
  );
}
