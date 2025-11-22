import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Memorization from './pages/Memorization.jsx';
import Settings from './pages/Settings.jsx';
import Profile from './pages/Profile.jsx';
import Revision from './pages/Revision.jsx';
import Rewards from './pages/Rewards.jsx';
import History from './pages/History.jsx';
import SurahList from './components/quran/SurahList.jsx';
import ParaList from './components/quran/ParaList.jsx';
import SurahReader from './components/quran/SurahReader.jsx';
import ParaReader from './components/quran/ParaReader.jsx';
import Navbar from './components/layout/Navbar.jsx';
import Confetti from './components/ui/Confetti.jsx';
import BadgeCelebration from './components/celebration/BadgeCelebration.jsx';
import Toast from './components/ui/Toast.jsx';
import useStore from './store/useStore.js';

const PrivateRoute = ({ children }) => {
  const token = useStore(s => s.token);
  return token ? children : <Navigate to="/login" replace />;
};

import { AnimatedLogo } from './components/ui/Logo.jsx';

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default function App() {
  const location = useLocation();
  const token = useStore(s => s.token);
  const isInitialized = useStore(s => s.isInitialized);
  const initAuth = useStore(s => s.initAuth);
  const showConfetti = useStore(s => s.showConfetti);

  // Initialize auth from localStorage on mount
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Show nothing until auth is initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-primary via-emerald-light to-navy-primary flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <AnimatedLogo size="large" />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex space-x-2"
          >
            <div className="w-2 h-2 bg-gold-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gold-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gold-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {token && <Navbar />}
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
            <Route path="/dashboard" element={<PrivateRoute><PageTransition><Dashboard /></PageTransition></PrivateRoute>} />
            <Route path="/memorize" element={<PrivateRoute><PageTransition><Memorization /></PageTransition></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><PageTransition><Profile /></PageTransition></PrivateRoute>} />
            <Route path="/revision" element={<PrivateRoute><PageTransition><Revision /></PageTransition></PrivateRoute>} />
            <Route path="/rewards" element={<PrivateRoute><PageTransition><Rewards /></PageTransition></PrivateRoute>} />
            <Route path="/history" element={<PrivateRoute><PageTransition><History /></PageTransition></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><PageTransition><Settings /></PageTransition></PrivateRoute>} />
            <Route path="/quran/surahs" element={<PrivateRoute><PageTransition><SurahList /></PageTransition></PrivateRoute>} />
            <Route path="/quran/paras" element={<PrivateRoute><PageTransition><ParaList /></PageTransition></PrivateRoute>} />
            <Route path="/quran/surah/:id" element={<PrivateRoute><PageTransition><SurahReader /></PageTransition></PrivateRoute>} />
            <Route path="/quran/para/:id" element={<PrivateRoute><PageTransition><ParaReader /></PageTransition></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
      
      {/* Global celebration components */}
      {showConfetti && <Confetti />}
      <BadgeCelebration />
      <Toast />
    </div>
  );
}

