import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '', fullScreen = false }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        <div
          className={`${sizes[size]} border-4 border-[#001C73] border-t-transparent rounded-full animate-spin`}
        ></div>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center w-full min-h-[200px] ${className}`}>
      <div
        className={`${sizes[size]} border-4 border-[#001C73] border-t-transparent rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;