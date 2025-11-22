import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import useStore from '../../store/useStore.js';

export default function Toast() {
  const toastMessage = useStore(s => s.toastMessage);
  const toastType = useStore(s => s.toastType);
  const clearToast = useStore(s => s.clearToast);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => clearToast(), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, clearToast]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    error: <XCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />
  };

  const backgrounds = {
    success: 'bg-emerald-500/10 border-emerald-400/30',
    error: 'bg-red-500/10 border-red-400/30',
    info: 'bg-blue-500/10 border-blue-400/30'
  };

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          className="fixed top-20 left-1/2 z-50 w-full max-w-md px-4"
        >
          <div className={`${backgrounds[toastType]} backdrop-blur-lg rounded-xl border shadow-2xl p-4 flex items-center space-x-3`}>
            {icons[toastType]}
            <p className="flex-1 text-white font-medium">{toastMessage}</p>
            <button
              onClick={clearToast}
              className="text-pearl hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
