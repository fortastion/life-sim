import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../store/gameStore';
import StatBars from '../components/StatBars';
import BottomNav from '../components/BottomNav';
import NotificationToast from '../components/NotificationToast';
import ChoiceModal from '../components/modals/ChoiceModal';
import LifeTab from '../components/tabs/LifeTab';
import ActivitiesTab from '../components/tabs/ActivitiesTab';
import RelationshipsTab from '../components/tabs/RelationshipsTab';
import CareerTab from '../components/tabs/CareerTab';
import MultiplayerTab from '../components/tabs/MultiplayerTab';

const TAB_COMPONENTS = {
  life:          <LifeTab />,
  activities:    <ActivitiesTab />,
  relationships: <RelationshipsTab />,
  career:        <CareerTab />,
  multiplayer:   <MultiplayerTab />,
};

function DeathScreen() {
  const { character, setPhase, clearSave } = useGameStore();
  if (!character) return null;

  const age = character.deathAge || character.age;
  const cause = character.deathCause || 'natural causes';

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 gap-5 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 10 }}
        className="text-7xl"
      >
        💀
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <h2 className="text-2xl font-black text-white mb-2">{character.fullName}</h2>
        <p className="text-slate-400 text-base">
          {character.birthYear} — {character.birthYear + age}
        </p>
        <p className="text-slate-300 mt-3 text-sm">
          Lived to <span className="font-bold text-white">{age} years old</span>
          <br />Died from <span className="text-red-300">{cause}</span>
        </p>
      </motion.div>

      {/* Stats summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-bg-card rounded-2xl p-4 border border-bg-border w-full max-w-sm"
      >
        <h3 className="text-sm text-slate-400 font-semibold mb-3">FINAL STATS</h3>
        <StatBars stats={character.stats} />
        <div className="mt-3 pt-3 border-t border-bg-border flex justify-around">
          <div className="text-center">
            <div className="text-lg font-bold text-purple-300">{character.relationships.children.length}</div>
            <div className="text-xs text-slate-500">Children</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-300">{character.relationships.friends.length}</div>
            <div className="text-xs text-slate-500">Friends</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-300">{character.history.length}</div>
            <div className="text-xs text-slate-500">Events</div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col gap-3 w-full max-w-sm"
      >
        <button
          onClick={() => { clearSave(); setPhase('create'); }}
          className="ageup-btn w-full py-4 rounded-2xl text-white font-bold text-lg"
        >
          🔄 Start New Life
        </button>
        <button
          onClick={() => { clearSave(); setPhase('menu'); }}
          className="w-full py-3 rounded-xl bg-bg-card border border-bg-border text-slate-300 font-semibold"
        >
          🏠 Main Menu
        </button>
      </motion.div>
    </div>
  );
}

export default function Game() {
  const { character, phase, activeTab, pendingChoices } = useGameStore();

  if (!character) return null;
  if (phase === 'dead') return <DeathScreen />;

  return (
    <div className="flex flex-col h-full relative">
      {/* Stat bars (always visible at top) */}
      <div className="flex-shrink-0 pt-1 border-b border-bg-border">
        <StatBars stats={character.stats} />
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="h-full"
          >
            {TAB_COMPONENTS[activeTab]}
          </motion.div>
        </AnimatePresence>

        {/* Choice modal overlays the current tab */}
        {pendingChoices.length > 0 && <ChoiceModal />}
      </div>

      {/* Bottom nav */}
      <div className="flex-shrink-0">
        <BottomNav />
      </div>

      {/* Notification toasts */}
      <NotificationToast />
    </div>
  );
}
