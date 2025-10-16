'use client';

import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false,
  type = 'button', // ✅ Default to 'button', can be overridden to 'submit'
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-4';
  
  const variants = {
    primary: 'bg-[#001C73] hover:bg-[#0026A3] text-white focus:ring-[#001C73]/30',
    secondary: 'bg-white border border-[#001C73] text-[#001C73] hover:bg-[#001C73] hover:text-white focus:ring-[#001C73]/30',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-300'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${
    disabled || loading ? 'opacity-50 cursor-not-allowed' : ''
  }`;

  return (
    <motion.button
      type={type} // ✅ Pass the type through
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default Button;