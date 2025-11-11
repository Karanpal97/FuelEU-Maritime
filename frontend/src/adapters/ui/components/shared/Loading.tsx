/**
 * Loading Component - Modern Dark Theme
 */
import React from 'react';

interface LoadingProps {
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      {/* Animated spinner with gradient */}
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-dark-border"></div>
        <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-transparent border-t-primary-500 border-r-accent-cyan animate-spin"></div>
        <div className="absolute top-2 left-2 w-12 h-12 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-cyan/20 animate-pulse-slow"></div>
      </div>
      
      {/* Message */}
      <p className="mt-6 text-gray-400 font-medium animate-pulse">{message}</p>
      
      {/* Decorative dots */}
      <div className="flex gap-2 mt-3">
        <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-accent-cyan animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-accent-purple animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

