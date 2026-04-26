import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../store/gameStore';

const ACTIONS = [
  { id: 'study',    name: 'Study Hard',           icon: '📚', desc: 'Hit the books',           effects: { smarts: 6, happiness: -2 },               consequenceKey: 'study_hard' },
  { id: 'gym',      name: 'Hit the Gym',           icon: '💪', desc: 'Work on your fitness',    effects: { health: 6, looks: 2, happiness: 2 },       consequenceKey: 'gym_streak' },
  { id: 'socialize',name: 'Socialize',             icon: '🎉', desc: 'Build relationships',     effects: { happiness: 8, smarts: -1 },                consequenceKey: 'socialize' },
  { id: 'overtime', name: 'Work Overtime',         icon: '💼', desc: 'Grind for that money',    effects: { money: 3000, happiness: -5, health: -3 },  consequenceKey: 'work_overtime' },
  { id: 'rest',     name: 'Rest & Relax',          icon: '😴', desc: 'Recharge your body',      effects: { health: 5, happiness: 6 } },
  { id: 'hustle',   name: 'Side Hustle',           icon: '🚀', desc: 'Make extra cash',         effects: { money: 2000, smarts: 2, happiness: -2 } },
  { id: 'meditate', name: 'Meditate',              icon: '🧘', desc: 'Find your inner peace',   effects: { happiness: 7, smarts: 2, health: 2 } },
  { id: 'volunteer',name: 'Volunteer',             icon: '🤝', desc: 'Help the community',      effects: { happiness: 8, smarts: 2 } },
  { id: 'read',     name: 'Read Books',            icon: '📖', desc: 'Expand your mind',        effects: { smarts: 5, happiness: 3 } },
  { id: 'goout',    name: 'Go Out',                icon: '🌃', desc: 'Live a little',           effects: { happiness: 10, health: -2, money: -500 } },
  { id: 'save',     name: 'Save Money',            icon: '💰', desc: 'Tighten the budget',      effects: { money: 1500, happiness: -3 } },
  { id: 'family',   name: 'Invest in Family',      icon: '👨‍👩‍👧', desc: 'Strengthen bonds',       effects: { happiness: 7 } },
];

function statColor(val) {
  if (val > 0) return 'text-green-400';
  if (val < 0) return 'text-red-400';
  return 'text-slate-400';
}

function fmtEffect(key, val) {
  const labels = { happiness: '😊', health: '❤️', smarts: '🧠', looks: '✨', money: '💵' };
  const prefix = val > 0 ? '+' : '';
  const display = key === 'money' ? `${prefix}$${Math.abs(val).toLocaleString()}` : `${prefix}${val}`;
  return `${labels[key] || key} ${display}`;
}

export default function AgeUpActions() {
  const { character, confirmAgeActions } = useGameStore();
  const [selected, setSelected] = useState([]);

  if (!character) return null;

  const MAX = 3;

  function toggle(action) {
    setSelected(prev => {
      const already = prev.find(a => a.id === action.id);
      if (already) return prev.filter(a => a.id !== action.id);
      if (prev.length >= MAX) return prev;
      return [...prev, action];
    });
  }

  function confirm() {
    if (selected.length < MAX) return;
    confirmAgeActions(selected);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col h-full overflow-hidden bg-bg-primary"
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2 border-b border-bg-border flex-shrink-0">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-white font-bold text-base">Year {character.age + 1} Plan</h2>
          <span className={`text-sm font-bold ${selected.length === MAX ? 'text-green-400' : 'text-purple-400'}`}>
            {selected.length}/{MAX} chosen
          </span>
        </div>
        <p className="text-xs text-slate-400">Pick {MAX} things to focus on this year</p>

        {/* Selection slots */}
        <div className="flex gap-2 mt-3">
          {Array.from({ length: MAX }).map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-10 rounded-xl border flex items-center justify-center text-xl transition-all ${
                selected[i]
                  ? 'border-purple-500/60 bg-purple-700/20'
                  : 'border-bg-border border-dashed'
              }`}
            >
              {selected[i] ? selected[i].icon : <span className="text-slate-600 text-sm">?</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Action grid */}
      <div className="flex-1 overflow-y-auto px-4 py-3 grid grid-cols-2 gap-2 content-start">
        {ACTIONS.map(action => {
          const isSelected = selected.some(a => a.id === action.id);
          const isFull = selected.length >= MAX && !isSelected;
          return (
            <motion.button
              key={action.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggle(action)}
              disabled={isFull}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-purple-500/70 bg-purple-700/30 text-white'
                  : isFull
                  ? 'border-bg-border bg-bg-card opacity-40 cursor-not-allowed'
                  : 'border-bg-border bg-bg-card text-slate-300 tap-effect'
              }`}
            >
              <div className="text-2xl mb-1">{action.icon}</div>
              <div className="text-xs font-bold text-white leading-tight mb-1">{action.name}</div>
              <div className="text-[10px] text-slate-400 mb-2">{action.desc}</div>
              <div className="flex flex-wrap gap-1">
                {Object.entries(action.effects).map(([k, v]) => (
                  <span key={k} className={`text-[9px] font-semibold ${statColor(v)}`}>
                    {fmtEffect(k, v)}
                  </span>
                ))}
              </div>
              {isSelected && (
                <div className="mt-1 text-[9px] text-purple-300 font-bold">✓ Selected</div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Confirm button */}
      <div className="px-4 pb-6 pt-2 flex-shrink-0">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={confirm}
          disabled={selected.length < MAX}
          className={`w-full py-4 rounded-2xl font-bold text-base transition-all ${
            selected.length === MAX
              ? 'ageup-btn text-white shadow-lg'
              : 'bg-bg-card border border-bg-border text-slate-600 cursor-not-allowed'
          }`}
        >
          {selected.length === MAX
            ? `🎂 Age to ${character.age + 1}`
            : `Choose ${MAX - selected.length} more action${MAX - selected.length !== 1 ? 's' : ''}`}
        </motion.button>
      </div>
    </motion.div>
  );
}
