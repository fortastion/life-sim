import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../store/gameStore';

export default function MainMenu() {
  const { setPhase, loadGame, hasSave, clearSave } = useGameStore();

  const hasSaveGame = hasSave();

  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-6 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-40 right-10 w-56 h-56 bg-pink-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      {/* Logo */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 relative z-10">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 12 }}
          className="text-8xl mb-2"
        >
          🌍
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-black gradient-text tracking-tight"
        >
          LifeSim
        </motion.h1>
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-slate-400 text-base font-medium"
        >
          Live every moment. Every choice matters.
        </motion.p>

        {/* Stat icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4 mt-2 text-2xl"
        >
          {['❤️','🧠','✨','💰','👥'].map((e, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
            >
              {e}
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* Buttons */}
      <motion.div
        className="w-full flex flex-col gap-3 relative z-10"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <button
          onClick={() => setPhase('create')}
          className="ageup-btn tap-effect w-full py-4 rounded-2xl text-white font-bold text-lg"
        >
          🎮 New Life
        </button>

        {hasSaveGame && (
          <button
            onClick={() => { loadGame(); }}
            className="w-full py-4 rounded-2xl font-bold text-lg tap-effect"
            style={{ background: 'linear-gradient(135deg, #1e2130, #252840)', border: '1px solid #3b82f6', color: '#60a5fa' }}
          >
            📂 Continue
          </button>
        )}

        {hasSaveGame && (
          <button
            onClick={() => { if (confirm('Delete your save? This is permanent.')) clearSave(); }}
            className="text-slate-500 text-sm py-2 tap-effect"
          >
            🗑️ Delete Save
          </button>
        )}

        <p className="text-center text-slate-600 text-xs mt-2">
          Multiplayer available in-game · Share a room code with your friend
        </p>
      </motion.div>
    </div>
  );
}
