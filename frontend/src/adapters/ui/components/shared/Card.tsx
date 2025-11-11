/**
 * Card Component - Modern Dark Theme
 */
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '', actions, icon }) => {
  return (
    <div className={`card ${className}`}>
      {(title || actions) && (
        <div className="flex justify-between items-center mb-6">
          {title && (
            <div className="flex items-center gap-3">
              {icon && (
                <div className="p-2 bg-primary-500/10 rounded-lg text-primary-400">
                  {icon}
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-100">{title}</h3>
            </div>
          )}
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

