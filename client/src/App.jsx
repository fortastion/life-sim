import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useGameStore from './store/gameStore';
import MainMenu from './pages/MainMenu';
import CharacterCreate from './pages/CharacterCreate';
import Game from './pages/Game';

export default function App() {
  const { phase } = useGameStore();

  return (
    <div className="phone-frame">
      <AnimatePresence mode="wait">
        {phase === 'menu' && (
          <motion.div key="menu" className="h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MainMenu />
          </motion.div>
        )}
        {phase === 'create' && (
          <motion.div key="create" className="h-full" initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.25 }}>
            <CharacterCreate />
          </motion.div>
        )}
        {(phase === 'playing' || phase === 'dead') && (
          <motion.div key="game" className="h-full flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Game />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
