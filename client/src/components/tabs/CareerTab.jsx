import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../../store/gameStore';
import { CAREER_TRACKS, getAvailableCareers } from '../../data/careers';
import { formatMoney, BUSINESS_TYPES } from '../../engine/gameEngine';

export default function CareerTab() {
  const {
    character,
    applyForJob, workHard, slackOff, askForRaise, quitJob,
    interactWithCoworker, startBusiness, sellBusiness,
  } = useGameStore();
  const [showJobBoard, setShowJobBoard]   = useState(false);
  const [showBizBoard, setShowBizBoard]   = useState(false);
  const [lastAction, setLastAction]       = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [confirmQuit, setConfirmQuit]     = useState(false);
  if (!character) return null;

  const { career, education, finances, stats } = character;
  const availableCareers = character.age >= 16 ? getAvailableCareers(character) : [];
  const currentTrack  = career.trackId ? CAREER_TRACKS.find(t => t.id === career.trackId) : null;
  const nextLevel     = currentTrack ? currentTrack.levels[career.level + 1] : null;

  const doAction = async (label, fn) => {
    setActionLoading(label);
    const result = fn();
    setLastAction(result?.message || null);
    setTimeout(() => { setActionLoading(null); setLastAction(null); }, 2500);
  };

  const doCwAction = (idx, action) => {
    const result = interactWithCoworker(idx, action);
    setLastAction(result?.message || null);
    setTimeout(() => setLastAction(null), 2500);
  };

  const perfColor = career.performance > 70 ? '#22c55e' : career.performance > 40 ? '#f59e0b' : '#ef4444';
  const perfLabel = career.performance > 70 ? 'Excellent' : career.performance > 50 ? 'Average' : career.performance > 30 ? 'Poor' : 'Terrible';

  const CW_ACTIONS = [
    { id: 'befriend', label: 'Befriend', icon: '🤝' },
    { id: 'gossip',   label: 'Gossip',   icon: '💬' },
    { id: 'flirt',    label: 'Flirt',    icon: '😏' },
    { id: 'insult',   label: 'Insult',   icon: '😤' },
    { id: 'report',   label: 'Report',   icon: '📋' },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 pt-3 pb-20">
      <h2 className="font-bold text-white text-base mb-3">Career & Education</h2>

      {/* ── Education ──────────────────────────────────────────────────── */}
      <div className="bg-bg-card rounded-2xl p-4 border border-bg-border mb-4">
        <h3 className="text-sm font-semibold text-slate-400 mb-3">🎓 Education</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-300">Status</span>
            <span className="text-sm font-semibold text-white">
              {education.inUniversity
                ? `📚 ${education.university}`
                : education.degree
                  ? `🎓 Graduate`
                  : education.inSchool
                    ? `🏫 ${education.schoolName}`
                    : character.age < 6
                      ? '👶 Too young for school'
                      : '—'}
            </span>
          </div>
          {(education.inSchool || education.inUniversity) && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">GPA</span>
              <span className={`text-sm font-bold ${
                education.gpa >= 3.5 ? 'text-green-400' :
                education.gpa >= 2.5 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {education.gpa?.toFixed(1) || '—'} / 4.0
              </span>
            </div>
          )}
          {education.degree && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">Degree</span>
              <span className="text-sm font-semibold text-purple-300">{education.degree}</span>
            </div>
          )}
          {education.postGradDegree && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">Post-Grad</span>
              <span className="text-sm font-semibold text-blue-300">{education.postGradDegree}</span>
            </div>
          )}
          {finances.debt > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">Student Debt</span>
              <span className="text-sm font-bold text-red-400">
                {formatMoney(finances.debt, character.currency)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Business Owner ────────────────────────────────────────────── */}
      {career.isBusinessOwner && career.business && (
        <div className="bg-bg-card rounded-2xl p-4 border border-bg-border mb-4">
          <h3 className="text-sm font-semibold text-slate-400 mb-3">🏢 Your Business</h3>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{career.business.icon}</span>
            <div>
              <div className="font-bold text-white">{career.business.name}</div>
              <div className="text-xs text-slate-400">Founded {career.business.founded}</div>
            </div>
          </div>
          <div className="space-y-1.5 text-sm mb-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Value</span>
              <span className="font-bold text-purple-300">{formatMoney(career.business.value, character.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Profit</span>
              <span className={`font-bold ${(career.business.totalProfit || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatMoney(career.business.totalProfit || 0, character.currency)}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              const result = sellBusiness();
              setLastAction(result?.message || null);
              setTimeout(() => setLastAction(null), 2500);
            }}
            className="w-full py-2.5 rounded-xl bg-red-900/30 border border-red-800/40 text-red-300 font-semibold text-sm tap-effect"
          >
            💰 Sell Business ({formatMoney(career.business.value, character.currency)})
          </button>
        </div>
      )}

      {/* ── Career ─────────────────────────────────────────────────────── */}
      <div className="bg-bg-card rounded-2xl p-4 border border-bg-border mb-4">
        <h3 className="text-sm font-semibold text-slate-400 mb-3">💼 Career</h3>

        {career.employed || character.isRetired ? (
          <div>
            {/* Job header */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{currentTrack?.icon || '💼'}</span>
              <div>
                <div className="font-bold text-white">{career.title}</div>
                <div className="text-xs text-slate-400">{career.company}</div>
              </div>
            </div>

            {/* Job stats */}
            <div className="space-y-2 mb-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Salary/Year</span>
                <span className="text-sm font-bold text-green-400">
                  {formatMoney(Math.floor(career.salary * character.salaryMult), character.currency)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Years at Job</span>
                <span className="text-sm font-semibold text-white">{career.yearsAtJob}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Boss Relation</span>
                <span className={`text-sm font-semibold ${career.bossRelationship > 60 ? 'text-green-400' : career.bossRelationship > 35 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {career.bossRelationship > 70 ? 'Loves you' : career.bossRelationship > 50 ? 'Neutral' : career.bossRelationship > 30 ? 'Tense' : 'Hates you'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Performance</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-bg-border rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${career.performance}%`, background: perfColor }} />
                  </div>
                  <span className="text-xs font-medium" style={{ color: perfColor }}>{perfLabel}</span>
                </div>
              </div>
            </div>

            {/* Level track */}
            {currentTrack && !character.isRetired && (
              <div className="mb-3">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Level {career.level + 1} of {currentTrack.levels.length}</span>
                  {nextLevel && <span>Next: {nextLevel.title}</span>}
                </div>
                <div className="flex gap-1">
                  {currentTrack.levels.map((_, i) => (
                    <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${
                      i <= career.level ? 'bg-purple-500' : 'bg-bg-border'}`} />
                  ))}
                </div>
                {nextLevel && (
                  <div className="text-xs text-slate-500 mt-1">
                    → {formatMoney(nextLevel.salary * character.salaryMult, character.currency)}/yr
                  </div>
                )}
              </div>
            )}

            {/* Last action feedback */}
            {lastAction && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mb-3 p-2 rounded-lg bg-purple-900/30 border border-purple-700/30 text-xs text-purple-200"
              >
                {lastAction}
              </motion.div>
            )}

            {/* Action buttons */}
            {!character.isRetired && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                <button
                  onClick={() => doAction('workHard', workHard)}
                  disabled={!!actionLoading}
                  className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl bg-green-900/30 border border-green-800/40 text-green-300 tap-effect hover:bg-green-900/50 transition-all disabled:opacity-50"
                >
                  <span className="text-xl">💪</span>
                  <span className="text-[10px] font-semibold text-center leading-tight">Work Hard</span>
                </button>
                <button
                  onClick={() => doAction('askRaise', askForRaise)}
                  disabled={!!actionLoading}
                  className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl bg-yellow-900/30 border border-yellow-800/40 text-yellow-300 tap-effect hover:bg-yellow-900/50 transition-all disabled:opacity-50"
                >
                  <span className="text-xl">💰</span>
                  <span className="text-[10px] font-semibold text-center leading-tight">Ask Raise</span>
                </button>
                <button
                  onClick={() => doAction('slackOff', slackOff)}
                  disabled={!!actionLoading}
                  className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl bg-orange-900/30 border border-orange-800/40 text-orange-300 tap-effect hover:bg-orange-900/50 transition-all disabled:opacity-50"
                >
                  <span className="text-xl">😴</span>
                  <span className="text-[10px] font-semibold text-center leading-tight">Slack Off</span>
                </button>
              </div>
            )}

            {/* Quit button */}
            {!character.isRetired && (
              <button
                onClick={() => setConfirmQuit(true)}
                className="w-full py-2.5 rounded-xl bg-red-900/20 border border-red-800/30 text-red-400 font-semibold text-xs tap-effect"
              >
                🚪 Quit Job
              </button>
            )}
          </div>
        ) : (
          <div>
            <p className="text-slate-400 text-sm mb-3">
              {character.age < 16
                ? "You're too young to work. Focus on school! 📚"
                : 'Currently unemployed.'}
            </p>
            {character.age >= 16 && (
              <button
                onClick={() => setShowJobBoard(true)}
                className="w-full py-3 rounded-xl bg-purple-700/30 border border-purple-600/40 text-purple-300 font-semibold text-sm tap-effect hover:bg-purple-700/50 transition-all"
              >
                📋 Browse Job Board
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Start Business ─────────────────────────────────────────────── */}
      {character.age >= 18 && !career.isBusinessOwner && (
        <div className="bg-bg-card rounded-2xl p-4 border border-bg-border mb-4">
          <h3 className="text-sm font-semibold text-slate-400 mb-2">🏢 Start a Business</h3>
          <p className="text-xs text-slate-500 mb-3">Be your own boss. High risk, high reward.</p>
          <button
            onClick={() => setShowBizBoard(true)}
            className="w-full py-3 rounded-xl bg-blue-700/30 border border-blue-600/40 text-blue-300 font-semibold text-sm tap-effect"
          >
            🚀 Browse Business Types
          </button>
        </div>
      )}

      {/* ── Coworkers ─────────────────────────────────────────────────── */}
      {career.employed && career.coworkers && career.coworkers.length > 0 && (
        <div className="bg-bg-card rounded-2xl p-4 border border-bg-border mb-4">
          <h3 className="text-sm font-semibold text-slate-400 mb-3">👥 Coworkers</h3>
          {lastAction && (
            <div className="mb-3 p-2 rounded-lg bg-purple-900/30 border border-purple-700/30 text-xs text-purple-200">
              {lastAction}
            </div>
          )}
          {career.coworkers.map((cw, i) => {
            const relLabel = cw.relationship > 70 ? 'Friends' : cw.relationship > 40 ? 'Collegial' : 'Tense';
            const relColor = cw.relationship > 70 ? 'text-green-400' : cw.relationship > 40 ? 'text-yellow-400' : 'text-red-400';
            return (
              <div key={i} className="mb-3 p-3 rounded-xl bg-bg-secondary border border-bg-border">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-bg-border flex items-center justify-center text-sm">
                    {cw.gender === 'female' ? '👩' : '👨'}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">{cw.full}</div>
                    <div className="text-[10px] text-slate-500">{cw.role}</div>
                  </div>
                  <span className={`text-[10px] font-semibold ${relColor}`}>{relLabel}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {CW_ACTIONS.map(({ id, label, icon }) => (
                    <button key={id} onClick={() => doCwAction(i, id)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-bg-border text-[10px] font-semibold text-slate-300 tap-effect hover:bg-purple-900/30 hover:text-purple-200 transition-all">
                      <span>{icon}</span><span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Stats overview ─────────────────────────────────────────────── */}
      {!career.employed && character.age >= 16 && (
        <div className="bg-bg-card rounded-xl p-3 border border-bg-border mb-4">
          <h4 className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wider">Your Qualifications</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(stats).map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-xs text-slate-400 capitalize">{k}</span>
                <span className="text-xs font-bold text-white">{Math.round(v)}</span>
              </div>
            ))}
          </div>
          {education.degree && (
            <div className="mt-2 flex items-center gap-1 text-green-400 text-xs">
              <span>✅</span><span>College degree</span>
            </div>
          )}
        </div>
      )}

      {/* ── Job Board Modal ─────────────────────────────────────────────── */}
      {showJobBoard && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center p-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-sm bg-bg-card rounded-2xl border border-bg-border max-h-[80vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-bg-border flex-shrink-0">
              <h3 className="font-bold text-white">Job Board</h3>
              <button onClick={() => setShowJobBoard(false)} className="text-slate-400 text-xl tap-effect">✕</button>
            </div>
            <div className="overflow-y-auto p-3 flex flex-col gap-2">
              {availableCareers.length === 0 && (
                <p className="text-slate-500 text-sm text-center py-4">
                  No jobs match your qualifications yet. Study more or gain experience!
                </p>
              )}
              {availableCareers.map(track => (
                <button
                  key={track.id}
                  onClick={() => { applyForJob(track); setShowJobBoard(false); }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-bg-secondary border border-bg-border text-left tap-effect hover:border-purple-500/50 transition-all"
                >
                  <span className="text-3xl flex-shrink-0">{track.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-sm">{track.name}</div>
                    <div className="text-xs text-slate-400">Starting: {track.levels[0].title}</div>
                    <div className="text-xs text-green-400">
                      {formatMoney(track.levels[0].salary * character.salaryMult, character.currency)}/yr
                    </div>
                  </div>
                  {track.risk && (
                    <span className="text-xs text-orange-400 bg-orange-900/30 px-2 py-0.5 rounded-full flex-shrink-0">Risky</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* ── Business Board Modal ─────────────────────────────────────────── */}
      {showBizBoard && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center p-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-sm bg-bg-card rounded-2xl border border-bg-border max-h-[80vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-bg-border flex-shrink-0">
              <h3 className="font-bold text-white">🚀 Start a Business</h3>
              <button onClick={() => setShowBizBoard(false)} className="text-slate-400 text-xl tap-effect">✕</button>
            </div>
            <div className="overflow-y-auto p-3 flex flex-col gap-2">
              {BUSINESS_TYPES.map(biz => {
                const canAfford = finances.cash >= biz.cost;
                return (
                  <button
                    key={biz.id}
                    onClick={() => {
                      const result = startBusiness(biz.id);
                      if (result?.message) setLastAction(result.message);
                      setTimeout(() => setLastAction(null), 2500);
                      setShowBizBoard(false);
                    }}
                    disabled={!canAfford}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left tap-effect transition-all ${
                      canAfford
                        ? 'bg-bg-secondary border-bg-border hover:border-blue-500/50'
                        : 'bg-bg-secondary border-bg-border opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <span className="text-3xl flex-shrink-0">{biz.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white text-sm">{biz.name}</div>
                      <div className="text-xs text-slate-400">
                        Revenue: {formatMoney(biz.revenuePerYear[0], character.currency)} – {formatMoney(biz.revenuePerYear[1], character.currency)}/yr
                      </div>
                    </div>
                    <div className={`text-sm font-bold ${canAfford ? 'text-yellow-400' : 'text-red-400'}`}>
                      {formatMoney(biz.cost, character.currency)}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}

      {/* ── Quit confirm modal ────────────────────────────────────────────── */}
      {confirmQuit && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm bg-bg-card rounded-2xl border border-bg-border p-5"
          >
            <div className="text-center mb-4">
              <span className="text-4xl">🚪</span>
              <h3 className="font-bold text-white mt-2">Quit {career.company}?</h3>
              <p className="text-sm text-slate-400 mt-1">You'll lose your job but gain freedom.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setConfirmQuit(false)}
                className="flex-1 py-3 rounded-xl bg-bg-border text-slate-300 font-semibold tap-effect">Cancel</button>
              <button onClick={() => { quitJob(); setConfirmQuit(false); }}
                className="flex-1 py-3 rounded-xl bg-red-700/60 border border-red-600/40 text-white font-semibold tap-effect">Quit</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Reference to CW_ACTIONS for hoisting
const CW_ACTIONS = [
  { id: 'befriend', label: 'Befriend', icon: '🤝' },
  { id: 'gossip',   label: 'Gossip',   icon: '💬' },
  { id: 'flirt',    label: 'Flirt',    icon: '😏' },
  { id: 'insult',   label: 'Insult',   icon: '😤' },
  { id: 'report',   label: 'Report',   icon: '📋' },
];
