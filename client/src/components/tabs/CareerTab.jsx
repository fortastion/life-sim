import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../../store/gameStore';
import { CAREER_TRACKS, getAvailableCareers } from '../../data/careers';
import { formatMoney } from '../../engine/gameEngine';

export default function CareerTab() {
  const { character, applyForJob, addNotification } = useGameStore();
  const [showJobBoard, setShowJobBoard] = useState(false);
  if (!character) return null;

  const { career, education, finances, stats } = character;
  const availableCareers = character.age >= 16 ? getAvailableCareers(character) : [];

  const currentTrack = career.trackId ? CAREER_TRACKS.find(t => t.id === career.trackId) : null;
  const currentLevel = currentTrack ? currentTrack.levels[career.level] : null;
  const nextLevel = currentTrack ? currentTrack.levels[career.level + 1] : null;

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 pt-3 pb-20">
      <h2 className="font-bold text-white text-base mb-3">Career & Education</h2>

      {/* Education card */}
      <div className="bg-bg-card rounded-2xl p-4 border border-bg-border mb-4">
        <h3 className="text-sm font-semibold text-slate-400 mb-3">🎓 Education</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-300">Status</span>
            <span className="text-sm font-semibold text-white">
              {education.inUniversity ? `📚 ${education.university}` :
               education.degree ? `🎓 Graduate` :
               education.inSchool ? `🏫 ${education.schoolName}` : '—'}
            </span>
          </div>
          {(education.inSchool || education.inUniversity) && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-300">GPA</span>
              <span className={`text-sm font-bold ${education.gpa >= 3.5 ? 'text-green-400' : education.gpa >= 2.5 ? 'text-yellow-400' : 'text-red-400'}`}>
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

      {/* Career card */}
      <div className="bg-bg-card rounded-2xl p-4 border border-bg-border mb-4">
        <h3 className="text-sm font-semibold text-slate-400 mb-3">💼 Career</h3>
        {career.employed || character.isRetired ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{currentTrack?.icon || '💼'}</span>
              <div>
                <div className="font-bold text-white">{career.title}</div>
                <div className="text-xs text-slate-400">{career.company}</div>
              </div>
            </div>
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
              <span className="text-sm text-slate-300">Performance</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-2 bg-bg-border rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{
                    width: `${career.performance}%`,
                    background: career.performance > 70 ? '#22c55e' : career.performance > 40 ? '#f59e0b' : '#ef4444'
                  }} />
                </div>
                <span className="text-xs text-slate-400">{career.performance}%</span>
              </div>
            </div>
            {nextLevel && (
              <div className="mt-3 pt-3 border-t border-bg-border">
                <p className="text-xs text-slate-500">Next: <span className="text-purple-300">{nextLevel.title}</span></p>
                <p className="text-xs text-slate-500">{formatMoney(nextLevel.salary * character.salaryMult, character.currency)}/yr</p>
              </div>
            )}
            {currentTrack && !character.isRetired && (
              <div className="mt-2 flex gap-2">
                {/* Level progress */}
                <div className="text-xs text-slate-500">
                  Level {career.level + 1} / {currentTrack.levels.length}
                </div>
                <div className="flex-1 flex gap-1">
                  {currentTrack.levels.map((_, i) => (
                    <div key={i} className={`flex-1 h-1.5 rounded-full ${i <= career.level ? 'bg-purple-500' : 'bg-bg-border'}`} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-slate-400 text-sm mb-3">
              {character.age < 16 ? 'You\'re too young to work. Focus on school!' : 'You\'re currently unemployed.'}
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

      {/* Requirements info */}
      {!career.employed && character.age >= 16 && (
        <div className="bg-bg-card rounded-xl p-3 border border-bg-border mb-4">
          <h4 className="text-xs text-slate-500 mb-2 font-semibold">YOUR STATS</h4>
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
              <span>✅</span><span>You have a college degree</span>
            </div>
          )}
        </div>
      )}

      {/* Job Board Modal */}
      {showJobBoard && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center p-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-sm bg-bg-card rounded-2xl border border-bg-border max-h-[80vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-bg-border">
              <h3 className="font-bold text-white">Job Board</h3>
              <button onClick={() => setShowJobBoard(false)} className="text-slate-400 text-xl">✕</button>
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
                  className="flex items-center gap-3 p-3 rounded-xl bg-bg-secondary border border-bg-border text-left tap-effect hover:border-purple-500/50 hover:bg-purple-900/10 transition-all"
                >
                  <span className="text-3xl">{track.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-white text-sm">{track.name}</div>
                    <div className="text-xs text-slate-400">Starting: {track.levels[0].title}</div>
                    <div className="text-xs text-green-400">{formatMoney(track.levels[0].salary * character.salaryMult, character.currency)}/yr</div>
                  </div>
                  {track.risk && <span className="text-xs text-orange-400 bg-orange-900/30 px-2 py-0.5 rounded-full">Risky</span>}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
