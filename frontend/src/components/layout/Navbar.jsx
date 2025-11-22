import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, BookOpen, Home, Settings, ChevronDown, Trophy, RefreshCw, Clock, User as UserIcon, Star } from 'lucide-react';
import useStore from '../../store/useStore.js';
import { getProfileIcon } from '../../data/profileIcons.js';
import Logo from '../ui/Logo.jsx';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [quranOpen, setQuranOpen] = useState(false);
  const [memorizationOpen, setMemorizationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const token = useStore(s => s.token);
  const user = useStore(s => s.user);
  const logout = useStore(s => s.logout);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Rewards', path: '/rewards', icon: Trophy },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const memorizationItems = [
    { name: 'Today\'s Ayahs', path: '/memorize', icon: BookOpen },
    { name: 'Revision', path: '/revision', icon: RefreshCw },
    { name: 'History', path: '/history', icon: Clock },
  ];

  const quranItems = [
    { name: 'Surahs', path: '/quran/surahs' },
    { name: 'Paras (Juz)', path: '/quran/paras' },
  ];

  const isActive = (path) => location.pathname === path;
  const isQuranActive = () => location.pathname.startsWith('/quran');
  const isMemorizationActive = () => ['/memorize', '/revision', '/history'].some(p => location.pathname === p);

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-emerald-primary/95 via-emerald-light/95 to-emerald-primary/95 backdrop-blur-xl border-b border-gold-primary/40 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center group">
            <Logo size="small" className="transform group-hover:scale-105 transition-transform duration-300" />
          </Link>

          {/* Desktop Navigation */}
          {token && (
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/dashboard"
                className={`relative flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  isActive('/dashboard') 
                    ? 'text-gold-primary bg-white/20 shadow-md' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                <Home size={18} />
                <span>Dashboard</span>
              </Link>

              {/* Memorization Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setMemorizationOpen(true)}
                onMouseLeave={() => setMemorizationOpen(false)}
              >
                <button
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    isMemorizationActive()
                      ? 'text-gold-primary bg-white/20 shadow-md'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <BookOpen size={18} />
                  <span>Memorization</span>
                  <ChevronDown size={16} className={`transition-transform ${memorizationOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {memorizationOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-2 left-0 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gold-primary/30 overflow-hidden"
                    >
                      {memorizationItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                            isActive(item.path)
                              ? 'bg-emerald-primary/10 text-emerald-primary'
                              : 'text-navy-primary hover:bg-gold-primary/10 hover:text-gold-primary'
                          }`}
                        >
                          <item.icon size={16} />
                          <span>{item.name}</span>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Quran Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setQuranOpen(true)}
                onMouseLeave={() => setQuranOpen(false)}
              >
                <button
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    isQuranActive()
                      ? 'text-gold-primary bg-white/20 shadow-md'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <BookOpen size={18} />
                  <span>Qur'an</span>
                  <ChevronDown size={16} className={`transition-transform ${quranOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {quranOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-2 left-0 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gold-primary/30 overflow-hidden"
                    >
                      {quranItems.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`block px-4 py-3 text-sm font-medium transition-colors ${
                            isActive(item.path)
                              ? 'bg-emerald-primary/10 text-emerald-primary'
                              : 'text-navy-primary hover:bg-gold-primary/10 hover:text-gold-primary'
                          }`}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Spacer to push rewards/settings/profile to the right */}
              <div className="flex-1"></div>

              {/* Rewards */}
              <Link
                to="/rewards"
                className={`relative flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  isActive('/rewards') 
                    ? 'text-gold-primary bg-white/20 shadow-md' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                <Trophy size={18} />
                <span>Rewards</span>
              </Link>

              {/* Settings */}
              <Link
                to="/settings"
                className={`relative flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  isActive('/settings') 
                    ? 'text-gold-primary bg-white/20 shadow-md' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                <Settings size={18} />
                <span>Settings</span>
              </Link>

              {/* Profile Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setProfileOpen(true)}
                onMouseLeave={() => setProfileOpen(false)}
              >
                <button
                  className="relative flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-white/10"
                >
                  {/* Profile Picture with Badge */}
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl ${
                      user?.hasCompletedQuran 
                        ? 'bg-gradient-to-br from-gold-primary to-amber-500 ring-2 ring-gold-primary/50' 
                        : 'bg-white/20 backdrop-blur-sm'
                    }`}>
                      {getProfileIcon(user?.profilePicture || 'kaaba')}
                    </div>
                    
                    {/* Surah count badge */}
                    {user?.completedSurahs && user.completedSurahs.length > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg border border-white">
                        {user.completedSurahs.length}
                      </div>
                    )}

                    {/* Khatm star */}
                    {user?.hasCompletedQuran && (
                      <div className="absolute -top-2 -left-2 w-5 h-5 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                        <Star className="w-3 h-3 text-white fill-white" />
                      </div>
                    )}
                  </div>
                </button>
                
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-2 right-0 w-64 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gold-primary/30 overflow-hidden"
                    >
                      <div className="p-4 border-b border-gray-200 bg-gradient-to-br from-emerald-primary/10 to-gold-primary/10">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-3xl ${
                            user?.hasCompletedQuran 
                              ? 'bg-gradient-to-br from-gold-primary to-amber-500' 
                              : 'bg-emerald-primary/20'
                          }`}>
                            {getProfileIcon(user?.profilePicture || 'kaaba')}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="font-bold text-navy-primary truncate">{user?.name}</p>
                            <p className="text-xs text-gray-600 truncate">{user?.email}</p>
                          </div>
                        </div>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-navy-primary hover:bg-gold-primary/10 hover:text-gold-primary transition-colors"
                      >
                        <UserIcon size={18} />
                        <span>View Profile</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-navy-primary hover:bg-gold-primary/10 hover:text-gold-primary transition-colors"
                      >
                        <Settings size={18} />
                        <span>Settings</span>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-500/80 hover:bg-red-500 transition-all shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          {token && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/20 transition-all"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && token && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gradient-to-b from-emerald-light/98 to-emerald-primary/98 backdrop-blur-xl border-t border-gold-primary/30"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all font-medium ${
                    isActive(item.path)
                      ? 'bg-white/20 text-gold-primary shadow-md'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </Link>
              ))}
              
              {/* Mobile Memorization Submenu */}
              <div className="space-y-1">
                <div className="px-4 py-2 text-white/70 text-xs font-semibold uppercase tracking-wider">
                  Memorization
                </div>
                {memorizationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-2 pl-8 pr-4 py-3 rounded-lg transition-all font-medium ${
                      isActive(item.path)
                        ? 'bg-white/20 text-gold-primary shadow-md'
                        : 'text-white/90 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <item.icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
              
              {/* Mobile Quran Submenu */}
              <div className="space-y-1">
                <div className="px-4 py-2 text-white/70 text-xs font-semibold uppercase tracking-wider">
                  Qur'an
                </div>
                {quranItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center pl-8 pr-4 py-3 rounded-lg transition-all font-medium ${
                      isActive(item.path)
                        ? 'bg-white/20 text-gold-primary shadow-md'
                        : 'text-white/90 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-lg text-white font-medium bg-red-500/80 hover:bg-red-500 transition-all mt-2"
              >
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
