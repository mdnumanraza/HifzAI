import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Confetti({ show, onComplete }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (show) {
      const newPieces = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -20,
        rotation: Math.random() * 360,
        color: ['#D4AF37', '#0f5132', '#F4E5A1', '#198754'][Math.floor(Math.random() * 4)],
        size: Math.random() * 10 + 5,
        delay: Math.random() * 0.3
      }));
      setPieces(newPieces);

      const timer = setTimeout(() => {
        setPieces([]);
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{ 
                x: piece.x, 
                y: piece.y, 
                opacity: 1, 
                rotate: piece.rotation 
              }}
              animate={{ 
                y: window.innerHeight + 100,
                x: piece.x + (Math.random() - 0.5) * 200,
                rotate: piece.rotation + 360,
                opacity: 0
              }}
              transition={{ 
                duration: 2 + Math.random(),
                delay: piece.delay,
                ease: 'easeIn'
              }}
              style={{
                position: 'absolute',
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                borderRadius: Math.random() > 0.5 ? '50%' : '0%'
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
