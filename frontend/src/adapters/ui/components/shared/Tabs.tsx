/**
 * Tabs Component - Modern Dark Theme
 */
import React from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="relative">
      <div className="flex space-x-2 overflow-x-auto scrollbar-thin" role="tablist">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              role="tab"
              aria-selected={isActive}
              aria-current={isActive ? 'page' : undefined}
              className={`
                group relative flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-sm
                transition-all duration-300 whitespace-nowrap
                ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-glow scale-105'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-dark-hover'
                }
              `}
            >
              {/* Icon */}
              <span className={`
                transition-transform duration-300
                ${isActive ? 'scale-110' : 'group-hover:scale-110'}
              `}>
                {tab.icon}
              </span>
              
              {/* Label */}
              <span>{tab.label}</span>
              
              {/* Active indicator */}
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-accent-cyan rounded-full animate-pulse"></span>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-dark-border to-transparent"></div>
    </div>
  );
};

