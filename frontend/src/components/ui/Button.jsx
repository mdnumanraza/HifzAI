import React from 'react';
import { motion } from 'framer-motion';

export default function Button({ 
  children, 
  variant = 'primary', 
  className = '', 
  disabled = false,
  ...props 
}) {
  const variants = {
    primary: 'bg-emerald-primary hover:bg-emerald-light text-white',
    gold: 'bg-gold-primary hover:bg-gold-dark text-navy-primary',
    outline: 'bg-transparent border-2 border-gold-primary text-gold-primary hover:bg-gold-primary hover:text-navy-primary'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      disabled={disabled}
      className={`
        px-6 py-3 rounded-full font-semibold transition-all duration-300
        ${variants[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-gold-glow'}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.button>
  );
}
