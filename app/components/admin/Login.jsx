'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Building, Eye, EyeOff } from 'lucide-react';
import Button from '../ui/Button';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
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
    
    console.log('Login form submitted');
    
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.username, formData.password);
      
      console.log('Login result:', result);
      
      if (result.success) {
        console.log('Login successful, redirecting...');
        // Use Next.js router for client-side navigation
        router.push('/admin');
        router.refresh(); // Force refresh to update all components
      } else {
        console.log('Login failed:', result.message);
        setError(result.message);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001C73] to-[#0026A3] flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="flex justify-center mb-4"
          >
            <div className="p-3 bg-[#001C73] rounded-xl">
              <Building size={32} className="text-white" />
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            RBS
          </h1>
          <p className="text-gray-600">Admin Portal Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001C73] focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-600"
              placeholder="Enter your username"
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001C73] focus:border-transparent transition-all duration-300 text-gray-900 placeholder-gray-600 pr-12"
              placeholder="Enter your password"
              disabled={loading}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-[36px] text-gray-500 hover:text-gray-700 focus:outline-none mt-2"
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full"
            disabled={loading}
          >
            Sign In
          </Button>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-500 text-sm mt-6"
        >
          Secure admin access only
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;