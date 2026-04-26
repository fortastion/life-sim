import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../../store/gameStore';
import EventCard from '../EventCard';
import { getMoodEmoji, getAgeEmoji, getLifeStage, formatMoney } from '../../engine/gameEngine';

export default function LifeTab({ setAnimation }) {
  const { character, openAgeActions, pendingChoices, lastEventScene, clearLastScene } = useGameStore();
  const [showFullHistory, setShowFullHistory] = useState(false);

  // Fire pixel-art animation whenever lastEventScene changes
  // (must be before any early return to satisfy Rules of Hooks)
  useEffect(() => {
    if (lastEventScene && setAnimation) {
      setAnimation(lastEventScene);
      clearLastScene();
    }
  }, [lastEventScene]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!character) return null;

  const moodEmoji  = getMoodEmoji(character.stats.happiness);
  const avatar     = getAgeEmoji(character.age, character.gender);
  const lifeStage  = getLifeStage(character.age);
  const recentHistory = showFullHistory
    ? [...character.history].reverse()
    : [...character.history].reverse().slice(0, 12);

  const getStatusBadge = () => {
    if (character.health?.inPrison)         return { icon: '⛓️', label: 'In Prison',                   color: 'text-orange-400 bg-orange-900/30' };
    if (character.isRetired)                return { icon: '🏖️', label: 'Retired',                     color: 'text-yellow-400 bg-yellow-900/30' };
    if (character.career?.employed)         return { icon: '💼', label: character.career.title,         color: 'text-green-400 bg-green-900/30' };
    if (character.education?.inUniversity)  return { icon: '🎓', label: 'In University',                color: 'text-blue-400 bg-blue-900/30' };
    if (character.education?.inSchool)      return { icon: '📚', label: character.education.schoolName, color: 'text-purple-400 bg-purple-900/30' };
    if (character.age < 6)                  return { icon: '👶', label: 'Baby',                         color: 'text-pink-400 bg-pink-900/30' };
    return { icon: '🏠', label: 'Unemployed', color: 'text-slate-400 bg-slate-700/30' };
  };

  const status = getStatusBadge();

  // Quick stats for overview
  const statItems = [
    { label: 'Happy',  val: character.stats.happiness, color: '#a855f7' },
    { label: 'Health', val: character.stats.health,    color: '#22c55e' },
    { label: 'Smarts', val: character.stats.smarts,    color: '#3b82f6' },
    { label: 'Looks',  val: character.stats.looks,     color: '#f59e0b' },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Character card ─────────────────────────────────────────────── */}
      <div className="px-4 pt-3 pb-2 flex-shrink-0">
        <div className="bg-bg-card rounded-2xl p-3 border border-bg-border">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl avatar-ring flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #252840, #1a1e30)' }}
            >
              {avatar}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-bold text-white text-base truncate">{character.fullName}</h2>
                <span className="text-lg">{moodEmoji}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="text-slate-400 text-xs">{character.countryFlag} {character.country}</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400 text-xs">{lifeStage}</span>
              </div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>
                  {status.icon} {status.label}
                </span>
              </div>
            </div>

            {/* Age */}
            <div className="text-right flex-shrink-0">
              <div className="text-3xl font-black text-white">{character.age}</div>
              <div className="text-xs text-slate-500">years old</div>
            </div>
          </div>

          {/* Stat mini bars */}
          <div className="mt-3 grid grid-cols-4 gap-2">
            {statItems.map(({ label, val, color }) => (
              <div key={label}>
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-[9px] text-slate-500">{label}</span>
                  <span className="text-[9px] font-bold text-slate-300">{Math.round(val)}</span>
                </div>
                <div className="h-1.5 bg-bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.round(val)}%`, background: color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Finance row */}
          <div className="mt-3 pt-3 border-t border-bg-border flex justify-around">
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-0.5">Cash</div>
              <div className={`text-sm font-bold ${character.finances.cash >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatMoney(character.finances.cash, character.currency)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-0.5">Salary/yr</div>
              <div className="text-sm font-bold text-blue-400">
                {character.career?.employed || character.isRetired
                  ? formatMoney(Math.floor((character.career?.salary || 0) * character.salaryMult), character.currency)
                  : '—'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-500 mb-0.5">Net Worth</div>
              <div className={`text-sm font-bold ${character.finances.netWorth >= 0 ? 'text-purple-400' : 'text-red-400'}`}>
                {formatMoney(character.finances.netWorth, character.currency)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Age Up button ───────────────────────────────────────────────── */}
      <div className="px-4 mb-3 flex-shrink-0">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={openAgeActions}
          disabled={pendingChoices.length > 0}
          className="ageup-btn w-full py-4 rounded-2xl text-white font-bold text-lg disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {pendingChoices.length > 0
            ? `⚠️ Resolve ${pendingChoices.length} Choice${pendingChoices.length > 1 ? 's' : ''} First`
            : `🎯 Plan Year ${character.age + 1}`}
        </motion.button>
      </div>

      {/* ── History ─────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-slate-400">Life Events</h3>
          <button
            onClick={() => setShowFullHistory(v => !v)}
            className="text-xs text-purple-400 tap-effect"
          >
            {showFullHistory ? 'Show Less' : `View All (${character.history.length})`}
          </button>
        </div>

        {recentHistory.length === 0 && (
          <div className="text-center text-slate-500 py-8">
            No events yet. Age up to start your life!
          </div>
        )}

        {recentHistory.map((event, i) => (
          <EventCard key={event.id || i} event={event} index={i} />
        ))}
      </div>
    </div>
  );
}
