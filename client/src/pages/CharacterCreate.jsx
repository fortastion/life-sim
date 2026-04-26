import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../store/gameStore';
import { COUNTRIES } from '../data/countries';
import { randomName } from '../data/names';
import { getAgeEmoji } from '../engine/gameEngine';

const STAT_LABELS = {
  happiness: { label: 'Happiness', icon: '😊', color: '#f59e0b' },
  health: { label: 'Health', icon: '❤️', color: '#ef4444' },
  smarts: { label: 'Smarts', icon: '🧠', color: '#3b82f6' },
  looks: { label: 'Looks', icon: '✨', color: '#a855f7' },
};

const TOTAL_STAT_POINTS = 220;

export default function CharacterCreate() {
  const { startNewGame, setPhase } = useGameStore();

  const [gender, setGender] = useState('male');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('United States');
  const [stats, setStats] = useState({ happiness: 55, health: 55, smarts: 55, looks: 55 });
  const [step, setStep] = useState(0); // 0: identity, 1: stats

  const totalUsed = Object.values(stats).reduce((a, b) => a + b, 0);
  const remaining = TOTAL_STAT_POINTS - totalUsed;

  function randomize() {
    const names = randomName(gender);
    setFirstName(names.first);
    setLastName(names.last);
    setCountry(COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)].name);
  }

  function setStat(key, val) {
    const current = stats[key];
    const diff = val - current;
    if (diff > 0 && remaining < diff) return; // not enough points
    setStats(s => ({ ...s, [key]: Math.max(10, Math.min(90, val)) }));
  }

  function handleCreate() {
    if (!firstName.trim() || !lastName.trim()) return;
    startNewGame({ firstName: firstName.trim(), lastName: lastName.trim(), gender, country, customStats: stats });
  }

  const preview = getAgeEmoji(0, gender);
  const selectedCountry = COUNTRIES.find(c => c.name === country);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-bg-border">
        <button onClick={() => setPhase('menu')} className="text-slate-400 hover:text-white tap-effect">
          ← Back
        </button>
        <h2 className="font-bold text-lg">Create Your Character</h2>
      </div>

      {/* Preview */}
      <div className="flex flex-col items-center py-5 gap-2">
        <motion.div
          key={gender}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-7xl"
        >
          {preview}
        </motion.div>
        <div className="text-lg font-bold text-white">
          {firstName || 'First'} {lastName || 'Last'}
        </div>
        <div className="text-sm text-slate-400">
          {selectedCountry?.flag} {country} · Born 2026
        </div>
      </div>

      {/* Step tabs */}
      <div className="flex px-4 gap-2 mb-4">
        {['Identity', 'Stats'].map((label, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold tap-effect transition-all ${
              step === i ? 'bg-purple-600 text-white' : 'bg-bg-card text-slate-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="identity"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="flex flex-col gap-4"
            >
              {/* Gender */}
              <div>
                <label className="text-xs text-slate-400 mb-2 block">GENDER</label>
                <div className="flex gap-2">
                  {[{ val: 'male', icon: '👨', label: 'Male' }, { val: 'female', icon: '👩', label: 'Female' }, { val: 'non-binary', icon: '🧑', label: 'Non-Binary' }].map(g => (
                    <button
                      key={g.val}
                      onClick={() => setGender(g.val)}
                      className={`flex-1 py-3 rounded-xl text-sm font-semibold tap-effect transition-all flex flex-col items-center gap-1 ${
                        gender === g.val ? 'bg-purple-600 text-white' : 'bg-bg-card text-slate-300 border border-bg-border'
                      }`}
                    >
                      <span className="text-xl">{g.icon}</span>
                      <span>{g.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="text-xs text-slate-400 mb-2 block">FIRST NAME</label>
                <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Enter first name" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-2 block">LAST NAME</label>
                <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Enter last name" />
              </div>

              {/* Country */}
              <div>
                <label className="text-xs text-slate-400 mb-2 block">COUNTRY OF BIRTH</label>
                <select value={country} onChange={e => setCountry(e.target.value)}>
                  {COUNTRIES.map(c => (
                    <option key={c.name} value={c.name}>{c.flag} {c.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={randomize}
                className="w-full py-3 rounded-xl bg-bg-card border border-bg-border text-slate-300 font-semibold tap-effect"
              >
                🎲 Randomize
              </button>

              <button
                onClick={() => setStep(1)}
                disabled={!firstName.trim() || !lastName.trim()}
                className="ageup-btn w-full py-4 rounded-2xl text-white font-bold text-base disabled:opacity-40"
              >
                Next: Set Stats →
              </button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="stats"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="flex flex-col gap-5"
            >
              <div className="bg-bg-card rounded-xl p-3 flex justify-between items-center border border-bg-border">
                <span className="text-slate-400 text-sm">Points Remaining</span>
                <span className={`font-bold text-lg ${remaining < 0 ? 'text-red-400' : remaining === 0 ? 'text-green-400' : 'text-purple-400'}`}>
                  {remaining}
                </span>
              </div>

              {Object.entries(STAT_LABELS).map(([key, meta]) => (
                <div key={key}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold flex items-center gap-2">
                      <span>{meta.icon}</span> {meta.label}
                    </span>
                    <span className="font-bold text-white">{stats[key]}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setStat(key, stats[key] - 5)}
                      className="w-8 h-8 rounded-lg bg-bg-card text-white text-lg font-bold tap-effect border border-bg-border flex items-center justify-center"
                    >−</button>
                    <div className="flex-1 bg-bg-card rounded-full h-3 overflow-hidden">
                      <div
                        className="stat-fill h-full rounded-full"
                        style={{ width: `${stats[key]}%`, background: meta.color }}
                      />
                    </div>
                    <button
                      onClick={() => setStat(key, stats[key] + 5)}
                      disabled={remaining < 5}
                      className="w-8 h-8 rounded-lg bg-bg-card text-white text-lg font-bold tap-effect border border-bg-border disabled:opacity-30 flex items-center justify-center"
                    >+</button>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <button
                  onClick={handleCreate}
                  className="ageup-btn w-full py-4 rounded-2xl text-white font-bold text-lg"
                >
                  🚀 Start My Life!
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
