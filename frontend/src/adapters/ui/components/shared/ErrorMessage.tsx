/**
 * Error Message Component - Modern Dark Theme
 */
import React from 'react';
import { BiErrorCircle } from 'react-icons/bi';
import { HiRefresh } from 'react-icons/hi';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-accent-red/20 to-accent-red/5 border border-accent-red/30 p-6 backdrop-blur-sm animate-scale-in">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="p-3 bg-accent-red/20 rounded-xl">
            <BiErrorCircle className="w-6 h-6 text-accent-red" />
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-accent-red mb-2">Error Occurred</h3>
          <p className="text-sm text-gray-300 leading-relaxed">{message}</p>
          
          {onRetry && (
            <button 
              onClick={onRetry} 
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-accent-red/20 hover:bg-accent-red/30 
                       text-accent-red rounded-xl font-medium text-sm transition-all duration-300
                       border border-accent-red/30 hover:border-accent-red/50
                       hover:scale-105 active:scale-95"
            >
              <HiRefresh className="w-4 h-4" />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

