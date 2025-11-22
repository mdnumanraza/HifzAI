import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Target, AlertCircle } from 'lucide-react';
import useStore from '../store/useStore.js';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import { AnimatedLogo } from '../components/ui/Logo.jsx';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dailyGoal, setDailyGoal] = useState(5);
  const navigate = useNavigate();
  const signup = useStore(s => s.signup);
  const loading = useStore(s => s.loading);
  const error = useStore(s => s.error);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await signup(name, email, password, dailyGoal);
    if (ok) navigate('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="relative overflow-hidden shadow-2xl">
          {/* Decorative Background */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-primary/5 via-transparent to-gold-primary/5 pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-emerald-primary via-gold-primary to-emerald-primary shadow-md" />
          
          {/* Logo/Title */}
          <div className="text-center mb-8 mt-6 relative">
            <div className="flex justify-center mb-4">
              <AnimatedLogo size="default" />
            </div>
            <p className="text-gray-600 font-medium">Begin your Qur'an memorization journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-semibold text-navy-primary mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-primary" size={20} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-pearl to-white rounded-xl border-2 border-gray-200 focus:border-emerald-primary focus:ring-2 focus:ring-emerald-primary/20 outline-none transition-all shadow-sm"
                  placeholder="Your name"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-navy-primary mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-primary" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-pearl to-white rounded-xl border-2 border-gray-200 focus:border-emerald-primary focus:ring-2 focus:ring-emerald-primary/20 outline-none transition-all shadow-sm"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-navy-primary mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-primary" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-pearl to-white rounded-xl border-2 border-gray-200 focus:border-emerald-primary focus:ring-2 focus:ring-emerald-primary/20 outline-none transition-all shadow-sm"
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>

            {/* Daily Goal Input */}
            <div>
              <label className="block text-sm font-semibold text-navy-primary mb-2">
                Daily Goal (ayahs per day)
              </label>
              <div className="relative">
                <Target className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-primary" size={20} />
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={dailyGoal}
                  onChange={(e) => setDailyGoal(Number(e.target.value))}
                  className="w-full pl-12 pr-4 py-3 bg-gradient-to-r from-pearl to-white rounded-xl border-2 border-gray-200 focus:border-emerald-primary focus:ring-2 focus:ring-emerald-primary/20 outline-none transition-all shadow-sm"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 font-medium">Recommended: 3-10 ayahs per day</p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg"
              >
                <AlertCircle size={18} />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 text-lg py-4 bg-gradient-to-r from-emerald-primary to-emerald-light hover:from-emerald-light hover:to-emerald-primary shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span>Creating account...</span>
              ) : (
                <>
                  <UserPlus size={20} />
                  <span>Create Account</span>
                </>
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-gold-primary hover:text-gold-dark font-semibold transition-colors">
                Login here
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

