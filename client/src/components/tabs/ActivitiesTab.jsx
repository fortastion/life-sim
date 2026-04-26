import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../../store/gameStore';
import { ACTIVITIES } from '../../data/activities';

const CATEGORIES = ['All', 'health', 'education', 'social', 'finance', 'crime', 'lifestyle', 'wellness', 'hobby', 'looks', 'risk'];

export default function ActivitiesTab() {
  const { character, doActivity } = useGameStore();
  const [filter, setFilter] = useState('All');
  const [lastResult, setLastResult] = useState(null);
  if (!character) return null;

  const used = character.activitiesUsedThisTurn || [];
  const available = ACTIVITIES.filter(a => {
    if (a.minAge && character.age < a.minAge) return false;
    if (filter !== 'All' && a.category !== filter) return false;
    return true;
  });

  function handleActivity(activity) {
    const result = doActivity(activity);
    setLastResult({ id: activity.id, ...result });
    setTimeout(() => setLastResult(null), 2500);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 pt-3 pb-2">
        <h2 className="font-bold text-white text-base mb-1">Activities</h2>
        <p className="text-xs text-slate-500">Do things this year to shape your life. Each activity can be done once per year.</p>
      </div>

      {/* Category filter */}
      <div className="px-4 mb-3 overflow-x-auto flex gap-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        {CATEGORIES.filter(c => c === 'All' || available.some(a => a.category === c)).map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold tap-effect transition-all capitalize ${
              filter === cat ? 'bg-purple-600 text-white' : 'bg-bg-card text-slate-400 border border-bg-border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Result toast */}
      {lastResult && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`mx-4 mb-2 p-2.5 rounded-xl text-sm font-medium ${
            lastResult.result === 'success' ? 'bg-green-900/50 text-green-300' :
            lastResult.result === 'no_money' ? 'bg-red-900/50 text-red-300' :
            'bg-yellow-900/50 text-yellow-300'
          }`}
        >
          {lastResult.result === 'success' ? '✅' : '⚠️'} {lastResult.message}
        </motion.div>
      )}

      {/* Activities grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="grid grid-cols-2 gap-2">
          {available.map((activity, i) => {
            const isUsed = used.includes(activity.id);
            const canAfford = !activity.cost || character.finances.cash >= activity.cost;

            return (
              <motion.button
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => !isUsed && handleActivity(activity)}
                disabled={isUsed}
                className={`relative flex flex-col p-3 rounded-xl border text-left transition-all tap-effect ${
                  isUsed
                    ? 'border-bg-border bg-bg-card opacity-40 cursor-not-allowed'
                    : !canAfford
                    ? 'border-red-800/50 bg-red-950/20 cursor-pointer'
                    : 'border-bg-border bg-bg-card hover:border-purple-500/50 hover:bg-purple-900/10 cursor-pointer'
                }`}
              >
                {isUsed && (
                  <div className="absolute top-2 right-2 text-xs text-green-400">✓ Done</div>
                )}
                <span className="text-2xl mb-2">{activity.icon}</span>
                <div className="text-sm font-semibold text-white leading-tight mb-1">{activity.name}</div>
                <div className="text-xs text-slate-500 leading-tight">{activity.description}</div>
                {activity.cost > 0 && (
                  <div className={`text-xs mt-1.5 font-medium ${canAfford ? 'text-yellow-400' : 'text-red-400'}`}>
                    💰 ${activity.cost.toLocaleString()}
                  </div>
                )}
                {/* Effect hints */}
                {activity.effects && Object.keys(activity.effects).length > 0 && (
                  <div className="flex gap-1 flex-wrap mt-1.5">
                    {Object.entries(activity.effects).slice(0, 2).map(([k, v]) => {
                      const isArr = Array.isArray(v);
                      const avg = isArr ? Math.round((v[0] + v[1]) / 2) : v;
                      return (
                        <span key={k} className={`text-xs px-1 rounded ${avg > 0 ? 'text-green-400 bg-green-900/30' : 'text-red-400 bg-red-900/30'}`}>
                          {avg > 0 ? '+' : ''}{avg} {k}
                        </span>
                      );
                    })}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
