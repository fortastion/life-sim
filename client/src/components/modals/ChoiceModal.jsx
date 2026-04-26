import React from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../../store/gameStore';

export default function ChoiceModal() {
  const { pendingChoices, makeChoice } = useGameStore();
  if (!pendingChoices || pendingChoices.length === 0) return null;

  const event = pendingChoices[0];
  if (!event || !event.choices) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex items-end justify-center p-3"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(3px)' }}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-sm rounded-2xl overflow-hidden"
        style={{ background: '#1a1e30', border: '1px solid #252840' }}
      >
        {/* Header */}
        <div className="p-4 flex gap-3 items-start" style={{ background: 'rgba(139,92,246,0.12)' }}>
          <span className="text-4xl flex-shrink-0">{event.icon || '❓'}</span>
          <div>
            <div className="text-xs text-purple-400 font-bold tracking-widest mb-1">YOUR CHOICE</div>
            <p className="text-white font-medium text-sm leading-snug">{event.message}</p>
          </div>
        </div>

        {/* Choices */}
        <div className="p-3 flex flex-col gap-2">
          {event.choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => makeChoice(event.id, i)}
              className="w-full text-left px-4 py-3 rounded-xl border transition-all tap-effect active:scale-95"
              style={{ background: '#252840', borderColor: '#3d4270' }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-white font-medium text-sm">{choice.text}</span>
                <span className="text-lg flex-shrink-0">
                  {['🅰️','🅱️','🅾️','🔷'][i] || '➡️'}
                </span>
              </div>
              {choice.effects && Object.keys(choice.effects).length > 0 && (
                <div className="flex gap-1 flex-wrap mt-1.5">
                  {Object.entries(choice.effects).map(([k, v]) => (
                    <span key={k} className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                      typeof v === 'number' && v > 0 ? 'bg-green-900/60 text-green-400' :
                      typeof v === 'number' && v < 0 ? 'bg-red-900/60 text-red-400' :
                      'bg-slate-700/60 text-slate-400'}`}>
                      {k} {typeof v === 'number' ? (v > 0 ? `+${v}` : v) : v}
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>

        {pendingChoices.length > 1 && (
          <p className="text-center text-slate-500 text-xs pb-3">
            +{pendingChoices.length - 1} more choice{pendingChoices.length > 2 ? 's' : ''} after this
          </p>
        )}
      </motion.div>
    </div>
  );
}
