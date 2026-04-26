import React, { useState } from 'react';
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
import AssetsTab from '../components/tabs/AssetsTab';
import EventAnimation from '../components/EventAnimation';

const TAB_COMPONENTS = {
  life:          LifeTab,
  activities:    ActivitiesTab,
  relationships: RelationshipsTab,
  career:        CareerTab,
  assets:        AssetsTab,
  multiplayer:   MultiplayerTab,
};

function DeathScreen() {
  const { character, setPhase, clearSave } = useGameStore();
  if (!character) return null;
  const age = character.deathAge || character.age;

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 gap-4 text-center overflow-y-auto py-8">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }} className="text-7xl">💀</motion.div>
      <div>
        <h2 className="text-2xl font-black text-white mb-1">{character.fullName}</h2>
        <p className="text-slate-400">{character.birthYear} — {character.birthYear + age}</p>
        <p className="text-slate-300 mt-2 text-sm">
          Died at <span className="font-bold text-white">{age} years old</span>
          <br/>from <span className="text-red-300">{character.deathCause}</span>
        </p>
      </div>
      <div className="bg-bg-card rounded-2xl p-4 border border-bg-border w-full">
        <StatBars stats={character.stats} />
        <div className="mt-3 pt-3 border-t border-bg-border grid grid-cols-3 gap-2 text-center">
          {[
            { label: 'Children', val: character.relationships?.children?.length || 0, icon: '👶' },
            { label: 'Friends', val: character.relationships?.friends?.length || 0, icon: '👥' },
            { label: 'Events', val: character.history?.length || 0, icon: '📖' },
          ].map(({ label, val, icon }) => (
            <div key={label}>
              <div className="text-xl">{icon}</div>
              <div className="text-lg font-bold text-white">{val}</div>
              <div className="text-xs text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <button onClick={() => { clearSave(); setPhase('create'); }} className="ageup-btn w-full py-4 rounded-2xl text-white font-bold text-lg">
          🔄 New Life
        </button>
        <button onClick={() => { clearSave(); setPhase('menu'); }} className="w-full py-3 rounded-xl bg-bg-card border border-bg-border text-slate-300 font-semibold">
          🏠 Main Menu
        </button>
      </div>
    </div>
  );
}

export default function Game() {
  const { character, phase, activeTab, pendingChoices } = useGameStore();
  const [animation, setAnimation] = useState(null);

  if (!character) return null;
  if (phase === 'dead') return <DeathScreen />;

  const TabComponent = TAB_COMPONENTS[activeTab] || LifeTab;

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      {/* Stat bars - always visible */}
      <div className="flex-shrink-0 border-b border-bg-border bg-bg-secondary">
        <StatBars stats={character.stats} />
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.12 }}
            className="h-full overflow-y-auto"
          >
            <TabComponent setAnimation={setAnimation} />
          </motion.div>
        </AnimatePresence>

        {/* Choice modal */}
        <AnimatePresence>
          {pendingChoices.length > 0 && <ChoiceModal />}
        </AnimatePresence>

        {/* Pixel art animation overlay */}
        <AnimatePresence>
          {animation && (
            <EventAnimation
              key={animation}
              sceneKey={animation}
              onDone={() => setAnimation(null)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Bottom nav */}
      <div className="flex-shrink-0">
        <BottomNav />
      </div>

      {/* Toast notifications */}
      <NotificationToast />
    </div>
  );
}
