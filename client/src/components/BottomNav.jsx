import React from 'react';
import useGameStore from '../store/gameStore';

const TABS = [
  { id: 'life',          icon: '🏠', label: 'Life' },
  { id: 'activities',    icon: '💪', label: 'Do' },
  { id: 'relationships', icon: '❤️', label: 'People' },
  { id: 'career',        icon: '💼', label: 'Career' },
  { id: 'multiplayer',   icon: '👥', label: 'Friend' },
];

export default function BottomNav() {
  const { activeTab, setActiveTab, friendConnected } = useGameStore();

  return (
    <nav className="flex border-t border-bg-border bg-bg-secondary" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 flex flex-col items-center py-2 gap-0.5 tap-effect transition-all relative ${
            activeTab === tab.id ? 'tab-active' : 'tab-inactive'
          }`}
        >
          <span className="text-xl">{tab.icon}</span>
          <span className="text-xs font-medium">{tab.label}</span>
          {tab.id === 'multiplayer' && friendConnected && (
            <span className="absolute top-1.5 right-4 w-2.5 h-2.5 rounded-full bg-green-400" />
          )}
          {activeTab === tab.id && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-purple-500" />
          )}
        </button>
      ))}
    </nav>
  );
}
