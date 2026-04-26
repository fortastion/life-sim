import React from 'react';
import { motion } from 'framer-motion';

const TYPE_STYLES = {
  good:      'card-good bg-green-950/30',
  bad:       'card-bad bg-red-950/30',
  neutral:   'card-neutral bg-blue-950/30',
  choice:    'card-choice bg-purple-950/30',
  milestone: 'card-milestone bg-yellow-950/30',
  crime:     'card-crime bg-orange-950/30',
  health:    'card-health bg-pink-950/30',
  friend:    'card-friend bg-cyan-950/30',
};

export default function EventCard({ event, index = 0 }) {
  if (!event) return null;
  const style = TYPE_STYLES[event.type] || TYPE_STYLES.neutral;

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-xl p-3 mb-2 ${style}`}
    >
      <div className="flex gap-3 items-start">
        <span className="text-2xl flex-shrink-0 mt-0.5">{event.icon || '📌'}</span>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <p className="text-sm text-slate-200 leading-snug">{event.message}</p>
            <span className="text-xs text-slate-500 flex-shrink-0 whitespace-nowrap">Age {event.age}</span>
          </div>
          {event.resultMessage && (
            <p className="text-xs text-slate-400 mt-1 italic">↳ {event.resultMessage}</p>
          )}
          {event.choiceMade && (
            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-purple-800/50 text-purple-300">
              You chose: {event.choiceMade}
            </span>
          )}
          {event.fromFriend && (
            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-cyan-900/50 text-cyan-300">
              👥 {event.friendName || 'Friend'}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
