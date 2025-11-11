/**
 * Error Message Component - Enhanced with Better Error Messages
 */
import React from 'react';
import { BiErrorCircle } from 'react-icons/bi';
import { HiRefresh, HiInformationCircle } from 'react-icons/hi';
import { extractErrorMessage, getErrorSuggestion } from '@/utils/errorHandler';

interface ErrorMessageProps {
  message?: string;
  error?: unknown;
  onRetry?: () => void;
  showSuggestions?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  error, 
  onRetry,
  showSuggestions = true 
}) => {
  // Extract detailed error information
  const errorInfo = error ? extractErrorMessage(error) : { message: message || 'An error occurred', type: 'unknown' as const };
  const suggestions = showSuggestions ? getErrorSuggestion(errorInfo) : [];

  // Determine icon color based on error type
  const iconColor = errorInfo.type === 'network' 
    ? 'text-yellow-500' 
    : errorInfo.type === 'server'
    ? 'text-red-500'
    : 'text-orange-500';

  const bgColor = errorInfo.type === 'network'
    ? 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30'
    : errorInfo.type === 'server'
    ? 'from-accent-red/20 to-accent-red/5 border-accent-red/30'
    : 'from-orange-500/20 to-orange-500/5 border-orange-500/30';

  return (
    <div className={`rounded-2xl bg-gradient-to-br ${bgColor} border p-6 backdrop-blur-sm animate-scale-in`}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className={`p-3 ${errorInfo.type === 'network' ? 'bg-yellow-500/20' : errorInfo.type === 'server' ? 'bg-accent-red/20' : 'bg-orange-500/20'} rounded-xl`}>
            <BiErrorCircle className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${iconColor} mb-2`}>
            {errorInfo.message}
          </h3>
          
          {errorInfo.details && (
            <p className="text-sm text-gray-300 leading-relaxed mb-3">
              {errorInfo.details}
            </p>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-4 p-4 bg-dark-surface/50 rounded-xl border border-dark-border">
              <div className="flex items-start gap-2 mb-2">
                <HiInformationCircle className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <h4 className="text-sm font-semibold text-primary-400">Possible Solutions:</h4>
              </div>
              <ul className="space-y-2 ml-7">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-primary-400 mt-1">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Retry Button */}
          {onRetry && (
            <button 
              onClick={onRetry} 
              className={`mt-4 inline-flex items-center gap-2 px-4 py-2 
                       ${errorInfo.type === 'network' 
                         ? 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 border-yellow-500/30 hover:border-yellow-500/50'
                         : 'bg-accent-red/20 hover:bg-accent-red/30 text-accent-red border-accent-red/30 hover:border-accent-red/50'
                       }
                       rounded-xl font-medium text-sm transition-all duration-300 border
                       hover:scale-105 active:scale-95`}
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

