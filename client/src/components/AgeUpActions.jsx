import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../store/gameStore';

// ─── Dream Worlds (ages 0-3) ──────────────────────────────────────────────────
const DREAM_WORLDS = [
  { name: '🌌 The Star Ocean',       desc: 'You float weightless among swirling galaxies and singing stars.',   choices: ['Ride the shooting star', 'Swim into the nebula'],           emoji: ['⭐','🌠','💫','🌙'] },
  { name: '🍄 The Mushroom Kingdom', desc: 'Giant glowing mushrooms tower above you. Everything smells sweet.', choices: ['Climb the biggest mushroom', 'Follow the glowing spores'],    emoji: ['🍄','🌿','✨','🦋'] },
  { name: '🐉 Dragon Mountain',      desc: 'A friendly dragon with rainbow scales invites you to fly.',          choices: ['Fly above the clouds', 'Explore the dragon\'s treasure cave'], emoji: ['🐉','🔥','💎','🏔️'] },
  { name: '🌊 The Deep Blue',        desc: 'You breathe underwater. Glowing fish weave patterns around you.',   choices: ['Follow the glowing whale', 'Dive into the abyss'],             emoji: ['🐋','🐠','🌊','💙'] },
  { name: '🦋 The Butterfly Garden', desc: 'Millions of butterflies carry tiny lanterns through pink skies.',   choices: ['Let the butterflies carry you', 'Find the garden\'s heart'],    emoji: ['🦋','🌸','🌺','💛'] },
  { name: '🏔️ Cloud Castle',         desc: 'A castle made entirely of clouds floats in an orange sky.',         choices: ['Enter the cloud throne room', 'Jump off the edge (soft!)'],    emoji: ['☁️','🏰','🌅','🌈'] },
  { name: '🎠 The Endless Carnival', desc: 'The carnival never closes and all the rides are free.',              choices: ['Ride the infinite ferris wheel', 'Enter the mirror maze'],      emoji: ['🎠','🎡','🎪','🎶'] },
  { name: '🌙 Moon Meadows',         desc: 'Soft blue grass stretches forever. Moon rabbits invite you to play.',choices: ['Race the moon rabbits', 'Gaze into the Earth below'],          emoji: ['🌙','🐰','💙','⭐'] },
  { name: '🦊 The Talking Forest',   desc: 'Every tree has a face and every animal has a story.',                choices: ['Listen to the oldest tree', 'Follow the silver fox'],           emoji: ['🦊','🌲','🍃','🔮'] },
  { name: '🍭 Candy Dimension',      desc: 'The clouds are cotton candy. The rivers flow with chocolate.',       choices: ['Slide down the candy mountain', 'Swim the chocolate river'],    emoji: ['🍭','🍫','🌈','🍬'] },
];

// ─── Childhood Actions (ages 4-11) ───────────────────────────────────────────
const CHILD_ACTIONS = [
  { id: 'play_outside',   name: 'Play Outside',     icon: '🌳', desc: 'Run, jump, explore',     effects: { health: 5, happiness: 6 } },
  { id: 'read_book_kid',  name: 'Read a Book',      icon: '📚', desc: 'Get lost in a story',    effects: { smarts: 5, happiness: 3 } },
  { id: 'make_friends',   name: 'Make Friends',     icon: '🤝', desc: 'Find your people',       effects: { happiness: 8 } },
  { id: 'draw_create',    name: 'Draw & Create',    icon: '🎨', desc: 'Express yourself',       effects: { smarts: 3, happiness: 5 } },
  { id: 'watch_tv',       name: 'Watch TV',         icon: '📺', desc: 'Veg out a little',       effects: { happiness: 4, smarts: -2 } },
  { id: 'chores',         name: 'Help with Chores', icon: '🧹', desc: 'Be responsible',         effects: { smarts: 2, happiness: -2 } },
  { id: 'practice_sport', name: 'Practice a Sport', icon: '⚽', desc: 'Train hard, play harder', effects: { health: 6 } },
  { id: 'video_games_kid',name: 'Play Video Games', icon: '🎮', desc: 'Just one more level',    effects: { happiness: 6, health: -2 } },
];

// ─── Teen Actions (ages 12-17) ───────────────────────────────────────────────
const TEEN_ACTIONS = [
  { id: 'study_teen',     name: 'Study Hard',       icon: '📖', desc: 'GPA matters',            effects: { smarts: 7, happiness: -2 } },
  { id: 'hang_friends',   name: 'Hang with Friends', icon: '🎉', desc: 'Make memories',         effects: { happiness: 8 } },
  { id: 'play_sports',    name: 'Play Sports',      icon: '🏃', desc: 'Stay competitive',       effects: { health: 6, happiness: 3 } },
  { id: 'part_time_job',  name: 'Part-Time Job',    icon: '💼', desc: 'First taste of money',   effects: { money: 2000, happiness: -3 }, consequenceKey: 'work_overtime' },
  { id: 'join_club',      name: 'Join a Club',      icon: '🏆', desc: 'Build your resume',      effects: { smarts: 3, happiness: 4 } },
  { id: 'date_someone',   name: 'Date Someone',     icon: '💘', desc: 'Young love',             effects: { happiness: 9 } },
  { id: 'rebel',          name: 'Rebel a Little',   icon: '😈', desc: 'Break the rules',        effects: { happiness: 7, smarts: -3 } },
  { id: 'practice_music', name: 'Practice Music',   icon: '🎸', desc: 'Find your sound',        effects: { smarts: 4, happiness: 5 } },
  { id: 'workout_teen',   name: 'Work Out',         icon: '💪', desc: 'Glow up',                effects: { health: 5, looks: 4 } },
  { id: 'volunteer_teen', name: 'Volunteer',        icon: '🤝', desc: 'Give back',              effects: { smarts: 3, happiness: 6 } },
];

// ─── Adult Actions (ages 18+) ─────────────────────────────────────────────────
const ADULT_ACTIONS = [
  { id: 'study',    name: 'Study Hard',         icon: '📚', desc: 'Hit the books',          effects: { smarts: 6, happiness: -2 },               consequenceKey: 'study_hard' },
  { id: 'gym',      name: 'Hit the Gym',        icon: '💪', desc: 'Work on your fitness',   effects: { health: 6, looks: 2, happiness: 2 },       consequenceKey: 'gym_streak' },
  { id: 'socialize',name: 'Socialize',          icon: '🎉', desc: 'Build relationships',    effects: { happiness: 8, smarts: -1 },                consequenceKey: 'socialize' },
  { id: 'overtime', name: 'Work Overtime',      icon: '💼', desc: 'Grind for that money',   effects: { money: 3000, happiness: -5, health: -3 },  consequenceKey: 'work_overtime' },
  { id: 'rest',     name: 'Rest & Relax',       icon: '😴', desc: 'Recharge your body',     effects: { health: 5, happiness: 6 } },
  { id: 'hustle',   name: 'Side Hustle',        icon: '🚀', desc: 'Make extra cash',        effects: { money: 2000, smarts: 2, happiness: -2 } },
  { id: 'meditate', name: 'Meditate',           icon: '🧘', desc: 'Find your inner peace',  effects: { happiness: 7, smarts: 2, health: 2 } },
  { id: 'volunteer',name: 'Volunteer',          icon: '🤝', desc: 'Help the community',     effects: { happiness: 8, smarts: 2 } },
  { id: 'read',     name: 'Read Books',         icon: '📖', desc: 'Expand your mind',       effects: { smarts: 5, happiness: 3 } },
  { id: 'goout',    name: 'Go Out',             icon: '🌃', desc: 'Live a little',          effects: { happiness: 10, health: -2, money: -500 } },
  { id: 'save',     name: 'Save Money',         icon: '💰', desc: 'Tighten the budget',     effects: { money: 1500, happiness: -3 } },
  { id: 'family',   name: 'Invest in Family',   icon: '👨‍👩‍👧', desc: 'Strengthen bonds',      effects: { happiness: 7 } },
];

function statColor(v) { return v > 0 ? 'text-green-400' : v < 0 ? 'text-red-400' : 'text-slate-400'; }
function fmtEffect(k, v) {
  const icons = { happiness: '😊', health: '❤️', smarts: '🧠', looks: '✨', money: '💵' };
  const sign = v > 0 ? '+' : '';
  const val = k === 'money' ? `${sign}$${Math.abs(v).toLocaleString()}` : `${sign}${v}`;
  return `${icons[k] || k} ${val}`;
}

// ─── Dream World View ─────────────────────────────────────────────────────────
function DreamView({ age, onWakeUp }) {
  const dream = useMemo(() => DREAM_WORLDS[Math.floor(Math.random() * DREAM_WORLDS.length)], []);
  const [chosen, setChosen] = useState(null);
  const [waking, setWaking] = useState(false);

  function choose(idx) {
    if (chosen !== null) return;
    setChosen(idx);
    setTimeout(() => {
      setWaking(true);
      setTimeout(() => onWakeUp([]), 1200);
    }, 1500);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full items-center justify-between px-6 py-8"
      style={{ background: 'linear-gradient(160deg, #1a0533 0%, #0d1f4a 50%, #0a2a1a 100%)' }}
    >
      {/* Floating emoji particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {dream.emoji.map((e, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl opacity-30"
            initial={{ x: `${20 + i * 20}%`, y: '100%' }}
            animate={{ y: '-10%', opacity: [0.1, 0.4, 0.1] }}
            transition={{ duration: 6 + i * 1.5, repeat: Infinity, delay: i * 0.8, ease: 'easeInOut' }}
            style={{ left: `${10 + i * 22}%` }}
          >
            {e}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 text-center mt-8">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 12 }}
          className="text-5xl mb-4"
        >
          {dream.emoji[0]}
        </motion.div>
        <div className="text-xs text-indigo-300 uppercase tracking-widest mb-2 font-semibold">
          Age {age} · Dream
        </div>
        <h2 className="text-2xl font-black text-white mb-3">{dream.name}</h2>
        <p className="text-sm text-indigo-200 leading-relaxed max-w-xs">{dream.desc}</p>
      </div>

      <div className="relative z-10 w-full flex flex-col gap-3 mb-4">
        {dream.choices.map((c, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.97 }}
            onClick={() => choose(i)}
            disabled={chosen !== null}
            className={`w-full py-4 rounded-2xl font-semibold text-sm transition-all border ${
              chosen === i
                ? 'bg-indigo-600/80 border-indigo-400 text-white'
                : chosen !== null
                ? 'bg-white/5 border-white/10 text-white/30'
                : 'bg-white/10 border-white/20 text-white tap-effect hover:bg-white/20'
            }`}
          >
            {chosen === i ? '✨ ' : ''}{c}
          </motion.button>
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => { setWaking(true); setTimeout(() => onWakeUp([]), 800); }}
        className="relative z-10 w-full py-3 rounded-xl text-indigo-300 text-sm font-semibold border border-indigo-500/30 bg-indigo-900/20 tap-effect"
      >
        {waking ? '🌅 Waking up...' : '🌅 Wake Up →'}
      </motion.button>
    </motion.div>
  );
}

// ─── Generic Action Picker ────────────────────────────────────────────────────
function ActionPicker({ age, actions, max, title, subtitle, theme, onConfirm }) {
  const [selected, setSelected] = useState([]);

  function toggle(action) {
    setSelected(prev => {
      if (prev.find(a => a.id === action.id)) return prev.filter(a => a.id !== action.id);
      if (prev.length >= max) return prev;
      return [...prev, action];
    });
  }

  const themes = {
    child: {
      bg: 'bg-gradient-to-b from-yellow-950/40 to-bg-primary',
      accent: 'text-yellow-400',
      selectedCard: 'border-yellow-500/60 bg-yellow-900/30',
      btn: 'bg-gradient-to-r from-yellow-600 to-orange-600',
      slot: 'border-yellow-600/40',
    },
    teen: {
      bg: 'bg-gradient-to-b from-purple-950/60 to-bg-primary',
      accent: 'text-purple-400',
      selectedCard: 'border-purple-500/60 bg-purple-900/30',
      btn: 'bg-gradient-to-r from-purple-700 to-pink-700',
      slot: 'border-purple-600/40',
    },
    adult: {
      bg: 'bg-bg-primary',
      accent: 'text-blue-400',
      selectedCard: 'border-blue-500/60 bg-blue-900/20',
      btn: 'ageup-btn',
      slot: 'border-blue-600/40',
    },
  };
  const t = themes[theme] || themes.adult;

  return (
    <div className={`flex flex-col h-full overflow-hidden ${t.bg}`}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-bg-border flex-shrink-0">
        <div className="flex items-center justify-between mb-0.5">
          <h2 className={`font-black text-base text-white`}>{title}</h2>
          <span className={`text-sm font-bold ${t.accent}`}>{selected.length}/{max}</span>
        </div>
        <p className="text-xs text-slate-400">{subtitle}</p>
        {/* Slots */}
        <div className="flex gap-2 mt-3">
          {Array.from({ length: max }).map((_, i) => (
            <div key={i} className={`flex-1 h-10 rounded-xl border flex items-center justify-center text-xl transition-all ${selected[i] ? `${t.slot} bg-white/5` : 'border-bg-border border-dashed'}`}>
              {selected[i] ? selected[i].icon : <span className="text-slate-600 text-xs">?</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Action grid */}
      <div className="flex-1 overflow-y-auto px-4 py-3 grid grid-cols-2 gap-2 content-start">
        {actions.map(action => {
          const isSel = selected.some(a => a.id === action.id);
          const isFull = selected.length >= max && !isSel;
          return (
            <motion.button
              key={action.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggle(action)}
              disabled={isFull}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSel ? t.selectedCard + ' text-white'
                : isFull ? 'border-bg-border bg-bg-card opacity-30 cursor-not-allowed'
                : 'border-bg-border bg-bg-card text-slate-300 tap-effect'
              }`}
            >
              <div className="text-2xl mb-1">{action.icon}</div>
              <div className="text-xs font-bold text-white leading-tight mb-1">{action.name}</div>
              <div className="text-[10px] text-slate-400 mb-1">{action.desc}</div>
              <div className="flex flex-wrap gap-1">
                {Object.entries(action.effects).map(([k, v]) => (
                  <span key={k} className={`text-[9px] font-semibold ${statColor(v)}`}>{fmtEffect(k, v)}</span>
                ))}
              </div>
              {isSel && <div className="mt-1 text-[9px] font-bold text-green-400">✓ Selected</div>}
            </motion.button>
          );
        })}
      </div>

      {/* Confirm */}
      <div className="px-4 pb-6 pt-2 flex-shrink-0">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => selected.length === max && onConfirm(selected)}
          disabled={selected.length < max}
          className={`w-full py-4 rounded-2xl font-bold text-base text-white transition-all ${
            selected.length === max ? t.btn : 'bg-bg-card border border-bg-border text-slate-600 cursor-not-allowed'
          }`}
        >
          {selected.length === max
            ? `🎂 Age Up → ${age + 1}`
            : `Choose ${max - selected.length} more`}
        </motion.button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AgeUpActions() {
  const { character, confirmAgeActions } = useGameStore();
  if (!character) return null;

  const age = character.age;

  // Ages 0-3: Dream World
  if (age <= 3) {
    return <DreamView age={age} onWakeUp={confirmAgeActions} />;
  }

  // Ages 4-11: Childhood
  if (age <= 11) {
    return (
      <ActionPicker
        age={age}
        actions={CHILD_ACTIONS}
        max={2}
        title={`Childhood · Age ${age}`}
        subtitle="Pick 2 things to do this year"
        theme="child"
        onConfirm={confirmAgeActions}
      />
    );
  }

  // Ages 12-17: Teen
  if (age <= 17) {
    return (
      <ActionPicker
        age={age}
        actions={TEEN_ACTIONS}
        max={3}
        title={`Teen Life · Age ${age}`}
        subtitle="Choose 3 ways to spend your year"
        theme="teen"
        onConfirm={confirmAgeActions}
      />
    );
  }

  // Ages 18+: Adult
  return (
    <ActionPicker
      age={age}
      actions={ADULT_ACTIONS}
      max={3}
      title={`Year ${age} Plan`}
      subtitle="Pick 3 things to focus on this year"
      theme="adult"
      onConfirm={confirmAgeActions}
    />
  );
}
