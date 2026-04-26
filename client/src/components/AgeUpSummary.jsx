import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';

const STAT_ICONS = { happiness: '😊', health: '❤️', smarts: '🧠', looks: '✨' };
const STAT_LABELS = { happiness: 'Happiness', health: 'Health', smarts: 'Smarts', looks: 'Looks' };

const VIBES = {
  good:  { label: 'Life is good',     icon: '🌟', color: 'text-green-400',  bg: 'bg-green-900/20 border-green-700/30' },
  mixed: { label: 'Ups and downs',    icon: '🎢', color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-700/30' },
  bad:   { label: 'Rough year',       icon: '😤', color: 'text-red-400',    bg: 'bg-red-900/20 border-red-700/30' },
};

function fmt(n) {
  const abs = Math.abs(n);
  const sign = n >= 0 ? '+' : '-';
  if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(1)}k`;
  return `${sign}$${abs}`;
}

export default function AgeUpSummary() {
  const { lastAgeUpSummary, clearAgeUpSummary } = useGameStore();

  useEffect(() => {
    if (!lastAgeUpSummary) return;
    const timer = setTimeout(clearAgeUpSummary, 4000);
    return () => clearTimeout(timer);
  }, [lastAgeUpSummary, clearAgeUpSummary]);

  if (!lastAgeUpSummary) return null;

  const { age, statDiffs, cashDiff, events, vibe } = lastAgeUpSummary;
  const v = VIBES[vibe] || VIBES.mixed;
  const hasStats = Object.keys(statDiffs).length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      onClick={clearAgeUpSummary}
      className="fixed inset-0 z-40 flex items-end justify-center p-4 pb-24 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: 60 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 22, stiffness: 280 }}
        className="w-full max-w-sm bg-bg-card rounded-3xl border border-bg-border overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Age banner */}
        <div className="bg-gradient-to-r from-purple-900/60 to-indigo-900/60 px-5 py-4 flex items-center justify-between">
          <div>
            <div className="text-3xl font-black text-white">Age {age}</div>
            <div className={`text-sm font-semibold mt-0.5 ${v.color}`}>{v.icon} {v.label}</div>
          </div>
          {cashDiff !== 0 && (
            <div className={`text-xl font-bold ${cashDiff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {fmt(cashDiff)}
            </div>
          )}
        </div>

        <div className="px-5 py-4">
          {/* Stat changes */}
          {hasStats && (
            <div className="mb-4">
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">This Year</div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(statDiffs).map(([stat, diff]) => (
                  <div key={stat} className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${diff >= 0 ? 'bg-green-900/20 border-green-800/30' : 'bg-red-900/20 border-red-800/30'}`}>
                    <span className="text-base">{STAT_ICONS[stat]}</span>
                    <div>
                      <div className="text-[10px] text-slate-400">{STAT_LABELS[stat]}</div>
                      <div className={`text-sm font-bold ${diff >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {diff >= 0 ? '+' : ''}{diff}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key events */}
          {events.length > 0 && (
            <div className="mb-4">
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">What Happened</div>
              <div className="flex flex-col gap-2">
                {events.map((evt, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className="text-base flex-shrink-0 mt-0.5">{evt.icon || '📌'}</span>
                    <span className="text-slate-300 leading-snug line-clamp-2">{evt.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tap to dismiss */}
          <button
            onClick={clearAgeUpSummary}
            className="w-full py-2.5 rounded-xl bg-bg-secondary border border-bg-border text-slate-400 text-xs font-semibold tap-effect"
          >
            Tap to continue →
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
