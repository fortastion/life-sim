import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useGameStore from './store/gameStore';
import MainMenu from './pages/MainMenu';
import CharacterCreate from './pages/CharacterCreate';
import Game from './pages/Game';

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 gap-4 text-center">
          <span className="text-5xl">⚠️</span>
          <h2 className="text-white font-bold text-lg">Something went wrong</h2>
          <p className="text-slate-400 text-sm">{this.state.error?.message}</p>
          <button onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
            className="ageup-btn px-6 py-3 rounded-xl text-white font-bold">
            Restart Game
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const { phase } = useGameStore();
  return (
    <div className="phone-frame">
      <ErrorBoundary>
        <AnimatePresence mode="wait">
          {phase === 'menu' && (
            <motion.div key="menu" className="h-full overflow-y-auto"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <MainMenu />
            </motion.div>
          )}
          {phase === 'create' && (
            <motion.div key="create" className="h-full overflow-y-auto"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}>
              <CharacterCreate />
            </motion.div>
          )}
          {(phase === 'playing' || phase === 'dead') && (
            <motion.div key="game" className="h-full flex flex-col overflow-hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Game />
            </motion.div>
          )}
        </AnimatePresence>
      </ErrorBoundary>
    </div>
  );
}
