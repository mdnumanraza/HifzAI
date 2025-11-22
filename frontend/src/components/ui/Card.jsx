import React from 'react';
import { motion } from 'framer-motion';

export default function Card({ children, className = '', ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white/80 backdrop-blur-md rounded-xl p-6 md:p-8 shadow-card border border-gold-primary/30 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
