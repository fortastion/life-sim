import React from 'react';

const STATS = [
  { key: 'happiness', icon: '😊', label: 'Happiness', color: '#f59e0b' },
  { key: 'health',    icon: '❤️', label: 'Health',    color: '#ef4444' },
  { key: 'smarts',   icon: '🧠', label: 'Smarts',    color: '#3b82f6' },
  { key: 'looks',    icon: '✨', label: 'Looks',     color: '#a855f7' },
];

function getBarColor(value, baseColor) {
  if (value < 20) return '#ef4444';
  if (value < 40) return '#f97316';
  if (value < 60) return '#f59e0b';
  return baseColor;
}

export default function StatBars({ stats }) {
  if (!stats) return null;
  return (
    <div className="px-4 py-3 grid grid-cols-2 gap-x-4 gap-y-2">
      {STATS.map(({ key, icon, label, color }) => {
        const val = Math.round(stats[key] ?? 0);
        const displayColor = getBarColor(val, color);
        return (
          <div key={key}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <span>{icon}</span>{label}
              </span>
              <span className="text-xs font-bold" style={{ color: displayColor }}>{val}</span>
            </div>
            <div className="h-2 bg-bg-border rounded-full overflow-hidden">
              <div
                className="stat-fill h-full rounded-full"
                style={{ width: `${val}%`, background: displayColor }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
