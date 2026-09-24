"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import Button from '../ui/Button';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.username, formData.password);
      if (result.success) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div
        className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-blue-300/40 rounded-full blur-3xl animate-pulse"
        animate={{
          x: [0, 50, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-[#001C73]/20 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(#001C73 1px, transparent 1px), linear-gradient(to right, #001C73 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm relative z-10"
      >
        <div className="bg-white/95 backdrop-blur-xl border-2 border-gray-200 rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="text-center mb-6 flex flex-col items-center">
            <div className="relative w-36 h-12 mb-2">
              <Image
                src="/logos/blue.png"
                alt="RBS Logo"
                fill
                sizes="144px"
                className="object-contain object-center"
                priority
                loading="eager"
              />
            </div>
            <h1 className="text-lg font-bold text-gray-900 tracking-wide uppercase">
              Admin Portal
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">Please sign in to secure your session</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-2.5 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-medium rounded"
              >
                {error}
              </motion.div>
            )}

            <div className="relative">
              <div className="absolute bottom-2 left-1 text-gray-400">
                <User size={16} />
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full pl-8 pr-3 py-1.5 bg-transparent border-b border-gray-300 focus:border-[#001C73] focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-400 text-sm"
                placeholder="Username"
                disabled={loading}
                autoComplete="username"
              />
            </div>

            <div className="relative">
              <div className="absolute bottom-2 left-1 text-gray-400">
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-8 pr-10 py-1.5 bg-transparent border-b border-gray-300 focus:border-[#001C73] focus:outline-none transition-all duration-300 text-gray-900 placeholder-gray-400 text-sm"
                placeholder="Password"
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-1 bottom-2 text-gray-400 hover:text-[#001C73] focus:outline-none transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-gray-300 text-[#001C73] focus:ring-[#001C73] accent-[#001C73]"
                />
                <span className="text-gray-500 font-medium">Remember me</span>
              </label>
            </div>

            <Button
              type="submit"
              loading={loading}
              className="w-full bg-[#001C73] hover:bg-[#001255] text-white py-2.5 rounded-lg font-bold tracking-wide transition-all shadow-md hover:shadow-lg mt-2 text-sm"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'SIGN IN'}
            </Button>
          </form>

          <p className="text-center text-[10px] text-gray-400 font-semibold mt-6 tracking-widest uppercase">
            SECURE CONNECTION REQUIRED
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;