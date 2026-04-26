import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../../store/gameStore';

export default function ChoiceModal() {
  const { pendingChoices, makeChoice } = useGameStore();

  if (!pendingChoices || pendingChoices.length === 0) return null;

  const event = pendingChoices[0];

  return (
    <AnimatePresence>
      <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-4">
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          className="w-full max-w-sm bg-bg-card rounded-2xl border border-bg-border overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-bg-border flex gap-3 items-start" style={{ background: 'rgba(139,92,246,0.1)' }}>
            <span className="text-4xl flex-shrink-0">{event.icon}</span>
            <div>
              <div className="text-xs text-purple-400 font-semibold uppercase tracking-widest mb-1">
                Decision Time
              </div>
              <p className="text-white font-medium leading-snug">{event.message}</p>
            </div>
          </div>

          {/* Choices */}
          <div className="p-3 flex flex-col gap-2">
            {event.choices?.map((choice, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => makeChoice(event.id, i)}
                className="w-full text-left px-4 py-3 rounded-xl border border-bg-border bg-bg-secondary hover:border-purple-500/50 hover:bg-purple-900/20 transition-all"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-white font-medium text-sm">{choice.text}</span>
                  <span className="text-lg flex-shrink-0">
                    {i === 0 ? '🅰️' : i === 1 ? '🅱️' : i === 2 ? '🅾️' : '🔷'}
                  </span>
                </div>
                {/* Show effect hints */}
                {choice.effects && (
                  <div className="flex gap-2 mt-1.5 flex-wrap">
                    {Object.entries(choice.effects).map(([key, val]) => (
                      <span
                        key={key}
                        className={`text-xs px-1.5 py-0.5 rounded-md font-medium ${
                          typeof val === 'number' && val > 0
                            ? 'bg-green-900/50 text-green-400'
                            : typeof val === 'number' && val < 0
                            ? 'bg-red-900/50 text-red-400'
                            : 'bg-slate-700/50 text-slate-400'
                        }`}
                      >
                        {key} {typeof val === 'number' ? (val > 0 ? `+${val}` : val) : val}
                      </span>
                    ))}
                  </div>
                )}
              </motion.button>
            ))}
          </div>

          {pendingChoices.length > 1 && (
            <div className="px-4 pb-3 text-xs text-slate-500 text-center">
              {pendingChoices.length - 1} more decision{pendingChoices.length > 2 ? 's' : ''} waiting…
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
