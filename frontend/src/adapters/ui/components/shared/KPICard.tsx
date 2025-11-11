/**
 * KPI Card Component - Modern Dark Theme
 */
import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'green' | 'red' | 'blue' | 'gray' | 'purple' | 'cyan';
  icon?: React.ReactNode;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  trend,
  color = 'blue',
  icon,
}) => {
  const colorClasses = {
    green: 'from-accent-green/20 to-accent-green/5 border-accent-green/30',
    red: 'from-accent-red/20 to-accent-red/5 border-accent-red/30',
    blue: 'from-primary-500/20 to-primary-500/5 border-primary-500/30',
    purple: 'from-accent-purple/20 to-accent-purple/5 border-accent-purple/30',
    cyan: 'from-accent-cyan/20 to-accent-cyan/5 border-accent-cyan/30',
    gray: 'from-gray-500/20 to-gray-500/5 border-gray-500/30',
  };

  const textColorClasses = {
    green: 'text-accent-green',
    red: 'text-accent-red',
    blue: 'text-primary-400',
    purple: 'text-accent-purple',
    cyan: 'text-accent-cyan',
    gray: 'text-gray-400',
  };

  const iconColorClasses = {
    green: 'bg-accent-green/20 text-accent-green',
    red: 'bg-accent-red/20 text-accent-red',
    blue: 'bg-primary-500/20 text-primary-400',
    purple: 'bg-accent-purple/20 text-accent-purple',
    cyan: 'bg-accent-cyan/20 text-accent-cyan',
    gray: 'bg-gray-500/20 text-gray-400',
  };

  const trendIcons = {
    up: <FiTrendingUp className="w-5 h-5" />,
    down: <FiTrendingDown className="w-5 h-5" />,
    neutral: <FiMinus className="w-5 h-5" />,
  };

  return (
    <div className={`
      relative overflow-hidden rounded-2xl border backdrop-blur-sm p-6
      bg-gradient-to-br ${colorClasses[color]}
      hover:scale-105 transition-all duration-300 group
      animate-scale-in
    `}>
      {/* Background pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-white/5 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
      
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-400 uppercase tracking-wide">{title}</span>
          {icon && (
            <div className={`p-2 rounded-lg ${iconColorClasses[color]} group-hover:scale-110 transition-transform duration-300`}>
              {icon}
            </div>
          )}
        </div>
        
        <div className="flex items-baseline gap-3">
          <span className={`text-3xl font-bold ${textColorClasses[color]}`}>
            {value}
          </span>
          {trend && (
            <span className={`flex items-center ${textColorClasses[color]} opacity-70`}>
              {trendIcons[trend]}
            </span>
          )}
        </div>
        
        {subtitle && (
          <div className="mt-2 text-xs text-gray-500 font-medium">{subtitle}</div>
        )}
      </div>
    </div>
  );
};

