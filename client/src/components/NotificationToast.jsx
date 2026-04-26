import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useGameStore from '../store/gameStore';

const TYPE_STYLES = {
  good:    { bg: 'bg-green-900/90 border-green-700', icon: '✅' },
  bad:     { bg: 'bg-red-900/90 border-red-700', icon: '❌' },
  neutral: { bg: 'bg-slate-800/90 border-slate-600', icon: 'ℹ️' },
  warning: { bg: 'bg-yellow-900/90 border-yellow-700', icon: '⚠️' },
  friend:  { bg: 'bg-cyan-900/90 border-cyan-700', icon: '👥' },
};

export default function NotificationToast() {
  const { notifications } = useGameStore();

  return (
    <div className="absolute top-4 left-0 right-0 flex flex-col items-center gap-2 z-40 px-4 pointer-events-none">
      <AnimatePresence>
        {notifications.slice(-3).map(notif => {
          const style = TYPE_STYLES[notif.type] || TYPE_STYLES.neutral;
          return (
            <motion.div
              key={notif.id}
              initial={{ y: -20, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -10, opacity: 0, scale: 0.9 }}
              className={`${style.bg} border rounded-xl px-4 py-3 flex items-center gap-2 max-w-sm w-full shadow-xl backdrop-blur-sm`}
            >
              <span className="text-base flex-shrink-0">{style.icon}</span>
              <span className="text-sm text-white font-medium leading-tight">{notif.message}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
