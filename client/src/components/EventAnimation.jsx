import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Pixel-art style emoji scenes for major events
const SCENES = {
  // Career
  fired:        { frames: ['🏢💼', '😤📦', '🚶💨'],       bg: '#1a0a0a', accent: '#ef4444', title: 'FIRED!' },
  promoted:     { frames: ['📊📈', '🏆✨', '🎉💰'],       bg: '#0a1a0a', accent: '#22c55e', title: 'PROMOTED!' },
  hired:        { frames: ['👔📋', '🤝💼', '✅🎊'],       bg: '#0a0a1a', accent: '#3b82f6', title: 'NEW JOB!' },
  // Romance
  proposal:     { frames: ['💍🌹', '😍💖', '💒🎊'],       bg: '#1a0a1a', accent: '#ec4899', title: 'ENGAGED!' },
  wedding:      { frames: ['👰🤵', '💒✨', '🎂💕'],       bg: '#1a0a1a', accent: '#f59e0b', title: 'MARRIED!' },
  heartbreak:   { frames: ['💔😭', '🚪💨', '😢🌧️'],      bg: '#1a0808', accent: '#ef4444', title: 'HEARTBREAK' },
  // Family
  baby:         { frames: ['🏥👩', '👶✨', '🍼💖'],       bg: '#0a0f1a', accent: '#60a5fa', title: 'NEW BABY!' },
  // Crime
  arrested:     { frames: ['🚨👮', '⛓️😰', '🔒🏛️'],     bg: '#1a0f00', accent: '#f97316', title: 'ARRESTED!' },
  escaped:      { frames: ['🔓💨', '🏃✨', '🌅😅'],       bg: '#0a1000', accent: '#22c55e', title: 'ESCAPED!' },
  // Education
  graduated:    { frames: ['🎓📜', '🎊✨', '🏆👨‍🎓'],    bg: '#0a0a1a', accent: '#a855f7', title: 'GRADUATED!' },
  // Finance
  lottery:      { frames: ['🎰💫', '💰💵', '🎉🤑'],       bg: '#0f1a00', accent: '#f59e0b', title: 'JACKPOT!' },
  bankrupt:     { frames: ['📉😱', '💸🏦', '📦😢'],       bg: '#1a0808', accent: '#ef4444', title: 'BANKRUPT!' },
  // Death
  died:         { frames: ['💀🌑', '✝️🥀', '🌌⭐'],       bg: '#0a0a0a', accent: '#6b7280', title: 'GAME OVER' },
  // Health
  sick:         { frames: ['🤒🌡️', '🏥💊', '😷😰'],      bg: '#1a0010', accent: '#ec4899', title: 'HOSPITALIZED' },
  // General good/bad
  good:         { frames: ['⭐✨', '🎊🎉', '😄💫'],       bg: '#0a1a0a', accent: '#22c55e', title: 'GREAT NEWS!' },
  bad:          { frames: ['😱💔', '😢🌧️', '😞💭'],       bg: '#1a0808', accent: '#ef4444', title: 'BAD NEWS' },
};

export default function EventAnimation({ sceneKey, onDone }) {
  const scene = SCENES[sceneKey] || SCENES.good;
  const [frameIdx, setFrameIdx] = useState(0);

  useEffect(() => {
    if (frameIdx < scene.frames.length - 1) {
      const t = setTimeout(() => setFrameIdx(i => i + 1), 500);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => onDone?.(), 600);
      return () => clearTimeout(t);
    }
  }, [frameIdx]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: `${scene.bg}ee`, backdropFilter: 'blur(4px)' }}
      onClick={() => onDone?.()}
    >
      {/* Pixel-art frame box */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative rounded-2xl p-8 flex flex-col items-center gap-4 border-2"
        style={{ background: '#0d0f1a', borderColor: scene.accent, boxShadow: `0 0 40px ${scene.accent}44` }}
      >
        {/* Scanline effect */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
          style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)' }} />

        {/* Title */}
        <div className="text-xs font-black tracking-widest" style={{ color: scene.accent, fontFamily: 'monospace' }}>
          ◄ {scene.title} ►
        </div>

        {/* Emoji scene */}
        <AnimatePresence mode="wait">
          <motion.div
            key={frameIdx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="text-6xl text-center leading-tight"
            style={{ imageRendering: 'pixelated' }}
          >
            {scene.frames[frameIdx]}
          </motion.div>
        </AnimatePresence>

        {/* Frame counter dots */}
        <div className="flex gap-2">
          {scene.frames.map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full transition-all duration-300"
              style={{ background: i <= frameIdx ? scene.accent : '#374151' }} />
          ))}
        </div>

        <p className="text-slate-500 text-xs" style={{ fontFamily: 'monospace' }}>tap to skip</p>
      </motion.div>
    </motion.div>
  );
}
