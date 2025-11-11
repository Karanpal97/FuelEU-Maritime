/**
 * Main App Component - Modern Dark Bluish Theme
 */
import  { useState } from 'react';
import { FaShip, FaChartBar, FaPiggyBank, FaUsers, FaAnchor } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import { Tabs } from './adapters/ui/components/shared/Tabs';
import { RoutesTab } from './adapters/ui/components/tabs/RoutesTab';
import { CompareTab } from './adapters/ui/components/tabs/CompareTab';
import { BankingTab } from './adapters/ui/components/tabs/BankingTab';
import { PoolingTab } from './adapters/ui/components/tabs/PoolingTab';

const tabs = [
  { id: 'routes', label: 'Routes', icon: <FaShip className="w-5 h-5" /> },
  { id: 'compare', label: 'Compare', icon: <FaChartBar className="w-5 h-5" /> },
  { id: 'banking', label: 'Banking', icon: <FaPiggyBank className="w-5 h-5" /> },
  { id: 'pooling', label: 'Pooling', icon: <FaUsers className="w-5 h-5" /> },
];

function App() {
  const [activeTab, setActiveTab] = useState('routes');

  return (
    <div className="min-h-screen">
      {/* Animated Header */}
      <header className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-surface via-dark-card to-dark-surface"></div>
        
        {/* Animated mesh gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 via-accent-purple/10 to-accent-cyan/10 animate-gradient bg-[length:200%_200%]"></div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 animate-fade-in">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-glow">
                <FaAnchor className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold gradient-text flex items-center gap-2">
                  Fuel EU Compliance
                  <HiSparkles className="w-6 h-6 text-accent-yellow animate-pulse-slow" />
                </h1>
                <p className="mt-1 text-gray-400 text-sm">
                  Maritime GHG Intensity & Compliance Management System
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 animate-fade-in">
              <span className="px-4 py-2 bg-gradient-to-r from-primary-600/20 to-primary-500/20 
                           backdrop-blur-sm border border-primary-500/30 text-primary-300 
                           rounded-full font-semibold text-sm shadow-glow">
                EU 2023/1805
              </span>
              <div className="px-4 py-2 bg-accent-green/10 border border-accent-green/30 
                           text-accent-green rounded-full font-semibold text-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></span>
                Live
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Tabs Navigation - Glass morphism */}
        <div className="card animate-slide-up border-dark-border/50">
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Tab Content - Animated entrance */}
        <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {activeTab === 'routes' && <RoutesTab />}
          {activeTab === 'compare' && <CompareTab />}
          {activeTab === 'banking' && <BankingTab />}
          {activeTab === 'pooling' && <PoolingTab />}
        </div>
      </main>

      {/* Modern Footer */}
      <footer className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-t from-dark-surface to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-dark-border">
          <div className="text-center text-gray-400 text-sm space-y-2">
            <p className="flex items-center justify-center gap-2">
              Built with 
              <span className="gradient-text font-semibold">Hexagonal Architecture</span>
              | React + TypeScript + Tailwind CSS
            </p>
            <p className="text-gray-500">
              Reference: Fuel EU Maritime Regulation (EU) 2023/1805 - Articles 20 & 21
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

