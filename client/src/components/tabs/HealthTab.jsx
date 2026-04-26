import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../../store/gameStore';
import { formatMoney } from '../../engine/gameEngine';
import {
  MEDICAL_CONDITIONS, PLASTIC_SURGERIES, GYM_WORKOUTS,
  THERAPY_TYPES, MEDICATIONS, REHAB_PROGRAMS, HAIR_COLORS,
  TATTOO_PLACEMENTS, PIERCINGS,
} from '../../data/healthData';
import { PRISON_ACTIVITIES, LAWYER_TIERS } from '../../data/crimesData';

const SECTIONS = ['overview', 'gym', 'doctor', 'mental', 'surgery', 'looks', 'prison'];

function SectionBtn({ id, label, icon, active, onClick }) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all tap-effect ${
        active ? 'bg-purple-700/40 border-purple-500/60 text-purple-200' : 'bg-bg-card border-bg-border text-slate-400'
      }`}
    >
      <span className="text-base">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function ResultBanner({ msg, type }) {
  if (!msg) return null;
  const cls = type === 'good' ? 'bg-green-900/50 text-green-200 border-green-700/40'
            : type === 'bad' ? 'bg-red-900/50 text-red-200 border-red-700/40'
            : 'bg-blue-900/50 text-blue-200 border-blue-700/40';
  return (
    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
      className={`mb-3 p-2.5 rounded-xl border text-xs ${cls}`}>
      {msg}
    </motion.div>
  );
}

export default function HealthTab() {
  const {
    character,
    visitDoctor, visitDentist, visitOptometrist,
    startTherapy, stopTherapy, startMedication,
    goToGym, buyGymMembership,
    getPlasticSurgery, treatCondition,
    goToRehab, doPrisonActivity, hireLawyer,
    changeHairColor, getTattoo, getPiercing,
  } = useGameStore();

  const [section, setSection] = useState('overview');
  const [feedback, setFeedback] = useState(null);

  if (!character) return null;

  const { health, mentalHealth, appearance, gym, finances, stats } = character;

  function act(fn, ...args) {
    const result = fn(...args);
    if (result?.message) {
      const type = result.result === 'success' || result.result === 'matched' || result.result === 'win' || result.result === 'escaped'
        ? 'good'
        : ['caught', 'failed', 'relapsed', 'complication', 'no_money', 'failed_escape'].includes(result.result)
        ? 'bad' : 'neutral';
      setFeedback({ msg: result.message, type });
      setTimeout(() => setFeedback(null), 3000);
    }
    return result;
  }

  const sections = [
    { id: 'overview', label: 'Overview', icon: '❤️' },
    { id: 'doctor',   label: 'Doctor',   icon: '🏥' },
    { id: 'gym',      label: 'Gym',      icon: '💪' },
    { id: 'mental',   label: 'Mind',     icon: '🧠' },
    { id: 'surgery',  label: 'Surgery',  icon: '✂️' },
    { id: 'looks',    label: 'Looks',    icon: '💇' },
    ...(health.inPrison ? [{ id: 'prison', label: 'Prison', icon: '⛓️' }] : []),
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Section tabs */}
      <div className="px-4 pt-3 pb-2 flex-shrink-0">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {sections.map(s => (
            <SectionBtn key={s.id} id={s.id} label={s.label} icon={s.icon}
              active={section === s.id} onClick={setSection} />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-20">
        {feedback && <ResultBanner msg={feedback.msg} type={feedback.type} />}

        {/* ── OVERVIEW ─────────────────────────────────────────────────────── */}
        {section === 'overview' && (
          <div>
            {/* Stat card */}
            <div className="bg-bg-card rounded-2xl p-4 border border-bg-border mb-4">
              <h3 className="text-sm font-semibold text-slate-400 mb-3">Your Health</h3>
              {[
                { label: 'Physical Health', val: stats.health, color: '#22c55e' },
                { label: 'Happiness',       val: stats.happiness, color: '#a855f7' },
                { label: 'Mental Health',   val: mentalHealth?.score || 60, color: '#3b82f6' },
                { label: 'Fitness Level',   val: gym?.fitnessLevel || 50, color: '#f59e0b' },
              ].map(({ label, val, color }) => (
                <div key={label} className="mb-2">
                  <div className="flex justify-between mb-0.5">
                    <span className="text-xs text-slate-400">{label}</span>
                    <span className="text-xs font-bold text-white">{Math.round(val)}</span>
                  </div>
                  <div className="h-2 bg-bg-border rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${Math.round(val)}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Conditions */}
            {health.conditions.length > 0 && (
              <div className="bg-bg-card rounded-2xl p-4 border border-bg-border mb-4">
                <h3 className="text-sm font-semibold text-slate-400 mb-2">🩺 Conditions</h3>
                {health.conditions.map((c, i) => {
                  const cName = c.name || c;
                  const data = MEDICAL_CONDITIONS.find(x => x.name === cName);
                  return (
                    <div key={i} className="mb-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span>{data?.icon || '🩺'}</span>
                        <span className="text-sm font-semibold text-red-300">{cName}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ml-auto ${
                          data?.severity === 'critical' ? 'bg-red-900/50 text-red-300' :
                          data?.severity === 'serious' ? 'bg-orange-900/50 text-orange-300' :
                          'bg-yellow-900/50 text-yellow-300'
                        }`}>{data?.severity || 'moderate'}</span>
                      </div>
                      {data?.treatments && (
                        <div className="flex flex-wrap gap-1 pl-6">
                          {data.treatments.map(t => (
                            <button key={t.id}
                              onClick={() => act(treatCondition, cName, t.id)}
                              disabled={finances.cash < t.cost}
                              className={`text-[10px] px-2 py-1 rounded-lg border font-semibold tap-effect transition-all ${
                                finances.cash >= t.cost
                                  ? 'bg-green-900/30 border-green-700/40 text-green-300'
                                  : 'bg-bg-border border-bg-border text-slate-600 cursor-not-allowed'
                              }`}
                            >
                              {t.name} {formatMoney(t.cost, character.currency)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Addictions */}
            {health.addictions.length > 0 && (
              <div className="bg-bg-card rounded-2xl p-4 border border-red-900/40 mb-4">
                <h3 className="text-sm font-semibold text-red-400 mb-2">⚠️ Addictions</h3>
                {health.addictions.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 mb-1">
                    <span>💊</span>
                    <span className="text-sm text-orange-300">{a}</span>
                  </div>
                ))}
                <p className="text-xs text-slate-500 mt-2">Go to Rehab to get clean.</p>
              </div>
            )}

            {/* Rehab if addicted */}
            {health.addictions.length > 0 && (
              <div className="bg-bg-card rounded-2xl p-4 border border-bg-border mb-4">
                <h3 className="text-sm font-semibold text-slate-400 mb-2">🏨 Rehab Programs</h3>
                {REHAB_PROGRAMS.map(p => (
                  <button key={p.id}
                    onClick={() => act(goToRehab, p.id)}
                    disabled={finances.cash < p.cost}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border mb-2 text-left tap-effect ${
                      finances.cash >= p.cost
                        ? 'bg-blue-900/20 border-blue-800/40'
                        : 'bg-bg-secondary border-bg-border opacity-50'
                    }`}
                  >
                    <span className="text-2xl">{p.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-white">{p.name}</div>
                      <div className="text-xs text-slate-400">{p.description}</div>
                      <div className="text-xs text-green-400">Success: {p.successRate}%</div>
                    </div>
                    <div className="text-sm font-bold text-yellow-400">{formatMoney(p.cost, character.currency)}</div>
                  </button>
                ))}
              </div>
            )}

            {/* Appearance summary */}
            <div className="bg-bg-card rounded-2xl p-4 border border-bg-border mb-4">
              <h3 className="text-sm font-semibold text-slate-400 mb-2">💅 Appearance</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-slate-500">Hair: </span><span className="text-white capitalize">{(appearance?.hairColor || 'dark_brown').replace('_', ' ')}</span></div>
                <div><span className="text-slate-500">Glasses: </span><span className="text-white">{appearance?.glasses ? 'Yes 👓' : 'No'}</span></div>
                <div><span className="text-slate-500">Tattoos: </span><span className="text-white">{appearance?.tattoos?.length || 0}</span></div>
                <div><span className="text-slate-500">Piercings: </span><span className="text-white">{appearance?.piercings?.length || 0}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* ── DOCTOR ───────────────────────────────────────────────────────── */}
        {section === 'doctor' && (
          <div>
            <p className="text-xs text-slate-500 mb-3">Visit healthcare professionals to maintain your health.</p>
            {[
              { label: 'General Doctor', icon: '🏥', desc: 'Annual checkup. May find conditions.', cost: 200, fn: visitDoctor },
              { label: 'Dentist', icon: '🦷', desc: '+Health, +Looks, cavity-free smile.', cost: 250, fn: visitDentist },
              { label: 'Optometrist', icon: '👁️', desc: 'Eye exam. May need glasses after 35.', cost: 180, fn: visitOptometrist },
            ].map(({ label, icon, desc, cost, fn }) => (
              <button key={label}
                onClick={() => act(fn)}
                disabled={finances.cash < cost}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border mb-3 text-left tap-effect transition-all ${
                  finances.cash >= cost
                    ? 'bg-bg-card border-bg-border hover:border-green-600/50'
                    : 'bg-bg-secondary border-bg-border opacity-50 cursor-not-allowed'
                }`}
              >
                <span className="text-3xl">{icon}</span>
                <div className="flex-1">
                  <div className="font-semibold text-white">{label}</div>
                  <div className="text-xs text-slate-400">{desc}</div>
                </div>
                <div className="text-sm font-bold text-yellow-400">{formatMoney(cost, character.currency)}</div>
              </button>
            ))}
          </div>
        )}

        {/* ── GYM ──────────────────────────────────────────────────────────── */}
        {section === 'gym' && (
          <div>
            {/* Membership */}
            <div className="bg-bg-card rounded-2xl p-4 border border-bg-border mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-white">Gym Membership</div>
                  <div className="text-xs text-slate-400">$600/yr — unlocks free cardio & weights</div>
                  <div className="text-xs text-slate-500 mt-0.5">Fitness Level: {gym?.fitnessLevel || 50}/100 · Workouts: {gym?.workoutsThisYear || 0}</div>
                </div>
                {gym?.hasMembership ? (
                  <span className="text-xs text-green-400 font-bold">✓ Active</span>
                ) : (
                  <button
                    onClick={() => act(buyGymMembership)}
                    disabled={finances.cash < 600}
                    className={`text-xs px-3 py-2 rounded-xl font-semibold tap-effect ${
                      finances.cash >= 600
                        ? 'bg-purple-700/40 border border-purple-600/40 text-purple-200'
                        : 'bg-bg-border text-slate-600 cursor-not-allowed'
                    }`}
                  >Join</button>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-500 mb-3">Choose your workout:</p>
            <div className="grid grid-cols-2 gap-2">
              {GYM_WORKOUTS.map(w => {
                const canAfford = finances.cash >= (w.cost || 0);
                const needsMembership = w.cost === 0 && !gym?.hasMembership;
                return (
                  <button key={w.id}
                    onClick={() => act(goToGym, w.id)}
                    disabled={!canAfford || needsMembership}
                    className={`flex flex-col p-3 rounded-xl border text-left tap-effect transition-all ${
                      !canAfford || needsMembership
                        ? 'bg-bg-secondary border-bg-border opacity-40 cursor-not-allowed'
                        : 'bg-bg-card border-bg-border hover:border-purple-500/50'
                    }`}
                  >
                    <span className="text-2xl mb-1">{w.icon}</span>
                    <div className="text-sm font-semibold text-white leading-tight">{w.name}</div>
                    <div className="text-xs text-slate-500">{w.description}</div>
                    {w.cost > 0 && <div className="text-xs text-yellow-400 mt-1">{formatMoney(w.cost, character.currency)}</div>}
                    {needsMembership && <div className="text-[10px] text-orange-400 mt-1">Need membership</div>}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── MENTAL HEALTH ─────────────────────────────────────────────────── */}
        {section === 'mental' && (
          <div>
            <div className="bg-bg-card rounded-2xl p-4 border border-bg-border mb-4">
              <h3 className="text-sm font-semibold text-slate-400 mb-2">Mental Score</h3>
              <div className="flex items-center gap-3">
                <div className="text-4xl font-black text-white">{Math.round(mentalHealth?.score || 60)}</div>
                <div className="flex-1">
                  <div className="h-3 bg-bg-border rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${mentalHealth?.score || 60}%` }} />
                  </div>
                  {mentalHealth?.inTherapy && (
                    <div className="text-xs text-green-400 mt-1">
                      🛋️ In therapy: {THERAPY_TYPES.find(t => t.id === mentalHealth.therapyType)?.name || 'Therapy'}
                      ({mentalHealth.therapyYears} yrs)
                    </div>
                  )}
                  {mentalHealth?.onMedication && (
                    <div className="text-xs text-blue-400 mt-0.5">
                      💊 On: {MEDICATIONS.find(m => m.id === mentalHealth.medication)?.name || 'Medication'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Therapy */}
            <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Therapy</h4>
            {mentalHealth?.inTherapy ? (
              <button onClick={() => act(stopTherapy)}
                className="w-full py-3 rounded-xl bg-red-900/30 border border-red-800/40 text-red-300 font-semibold text-sm tap-effect mb-4">
                Stop Current Therapy
              </button>
            ) : (
              THERAPY_TYPES.map(t => (
                <button key={t.id} onClick={() => act(startTherapy, t.id)}
                  disabled={finances.cash < t.costPerYear}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border mb-2 text-left tap-effect ${
                    finances.cash >= t.costPerYear
                      ? 'bg-bg-card border-bg-border hover:border-blue-600/50'
                      : 'bg-bg-secondary border-bg-border opacity-50 cursor-not-allowed'
                  }`}
                >
                  <span className="text-2xl">{t.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-white text-sm">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.description}</div>
                  </div>
                  <div className="text-xs font-bold text-yellow-400">{formatMoney(t.costPerYear, character.currency)}/yr</div>
                </button>
              ))
            )}

            {/* Medication */}
            <h4 className="text-xs font-semibold text-slate-500 mb-2 mt-4 uppercase tracking-wider">Medication</h4>
            {MEDICATIONS.map(m => {
              const isActive = mentalHealth?.medication === m.id;
              return (
                <button key={m.id} onClick={() => act(startMedication, m.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border mb-2 text-left tap-effect ${
                    isActive ? 'bg-blue-900/30 border-blue-700/40' : 'bg-bg-card border-bg-border'
                  }`}
                >
                  <span className="text-xl">{m.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-white text-sm">{m.name}</div>
                    <div className="text-[10px] text-slate-500">{m.treatsConditions.join(', ')}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-yellow-400">{formatMoney(m.costPerYear, character.currency)}/yr</div>
                    {isActive && <div className="text-[10px] text-green-400">✓ Active</div>}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* ── PLASTIC SURGERY ───────────────────────────────────────────────── */}
        {section === 'surgery' && (
          <div>
            {character.age < 18 && (
              <div className="p-4 rounded-xl bg-yellow-900/20 border border-yellow-800/30 text-yellow-300 text-sm mb-4">
                Must be 18+ for most surgeries.
              </div>
            )}
            <div className="grid grid-cols-1 gap-2">
              {PLASTIC_SURGERIES.map(s => {
                const canAfford = finances.cash >= s.cost;
                const tooYoung = character.age < (s.minAge || 18);
                const wrongGender = s.genderReq && character.gender !== s.genderReq;
                const disabled = !canAfford || tooYoung || wrongGender;
                return (
                  <button key={s.id} onClick={() => act(getPlasticSurgery, s.id)}
                    disabled={disabled}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left tap-effect transition-all ${
                      disabled ? 'bg-bg-secondary border-bg-border opacity-40 cursor-not-allowed'
                               : 'bg-bg-card border-bg-border hover:border-purple-500/50'
                    }`}
                  >
                    <span className="text-2xl flex-shrink-0">{s.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white text-sm truncate">{s.name}</div>
                      <div className="text-xs text-slate-400">{s.description}</div>
                      <div className="text-xs text-green-400">+{s.looksBoost} Looks · {s.complicationChance}% complication</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold text-yellow-400">{formatMoney(s.cost, character.currency)}</div>
                      {tooYoung && <div className="text-[10px] text-orange-400">{s.minAge}+</div>}
                      {wrongGender && <div className="text-[10px] text-red-400">N/A</div>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── LOOKS (Hair, Tattoos, Piercings) ─────────────────────────────── */}
        {section === 'looks' && (
          <div>
            {/* Hair Colors */}
            <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">💇 Hair Color</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {HAIR_COLORS.map(h => {
                const active = appearance?.hairColor === h.id;
                const canAfford = finances.cash >= h.cost;
                return (
                  <button key={h.id} onClick={() => act(changeHairColor, h.id)}
                    disabled={!canAfford}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold tap-effect transition-all ${
                      active ? 'bg-purple-700/40 border-purple-500/60 text-purple-200'
                             : canAfford ? 'bg-bg-card border-bg-border text-slate-300'
                             : 'bg-bg-secondary border-bg-border text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <span>{h.icon}</span>
                    <span>{h.name}</span>
                    {h.cost > 0 && <span className="text-yellow-400">{formatMoney(h.cost, character.currency)}</span>}
                    {active && <span className="text-green-400">✓</span>}
                  </button>
                );
              })}
            </div>

            {/* Tattoos */}
            <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">🎨 Tattoos ({appearance?.tattoos?.length || 0})</h4>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {TATTOO_PLACEMENTS.map(t => {
                const canAfford = finances.cash >= t.cost;
                const tooYoung = character.age < 18;
                return (
                  <button key={t.id} onClick={() => act(getTattoo, t.id)}
                    disabled={!canAfford || tooYoung}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-left tap-effect ${
                      !canAfford || tooYoung
                        ? 'bg-bg-secondary border-bg-border opacity-40 cursor-not-allowed'
                        : 'bg-bg-card border-bg-border hover:border-purple-500/50'
                    }`}
                  >
                    <span>{t.icon}</span>
                    <div>
                      <div className="text-xs font-semibold text-white">{t.name}</div>
                      <div className="text-[10px] text-yellow-400">{formatMoney(t.cost, character.currency)}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Piercings */}
            <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">💎 Piercings ({appearance?.piercings?.length || 0})</h4>
            <div className="grid grid-cols-2 gap-2">
              {PIERCINGS.map(p => {
                const canAfford = finances.cash >= p.cost;
                return (
                  <button key={p.id} onClick={() => act(getPiercing, p.id)}
                    disabled={!canAfford}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-left tap-effect ${
                      !canAfford
                        ? 'bg-bg-secondary border-bg-border opacity-40 cursor-not-allowed'
                        : 'bg-bg-card border-bg-border hover:border-purple-500/50'
                    }`}
                  >
                    <span>{p.icon}</span>
                    <div>
                      <div className="text-xs font-semibold text-white">{p.name}</div>
                      <div className="text-[10px] text-yellow-400">{formatMoney(p.cost, character.currency)}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── PRISON ───────────────────────────────────────────────────────── */}
        {section === 'prison' && health.inPrison && (
          <div>
            <div className="bg-orange-900/20 border border-orange-700/40 rounded-2xl p-4 mb-4">
              <div className="text-center">
                <div className="text-4xl mb-1">⛓️</div>
                <div className="text-lg font-bold text-white">{health.prisonYearsLeft} Year{health.prisonYearsLeft !== 1 ? 's' : ''} Remaining</div>
                <div className="text-xs text-slate-400">Original sentence: {health.prisonSentenceTotal || 0} years</div>
              </div>
            </div>

            {/* Hire lawyer */}
            <h4 className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">⚖️ Legal Help</h4>
            {LAWYER_TIERS.map(t => (
              <button key={t.id} onClick={() => act(hireLawyer, t.id)}
                disabled={finances.cash < t.cost}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border mb-2 text-left tap-effect ${
                  finances.cash >= t.cost
                    ? 'bg-blue-900/20 border-blue-800/40 hover:border-blue-600/60'
                    : 'bg-bg-secondary border-bg-border opacity-50 cursor-not-allowed'
                }`}
              >
                <span className="text-2xl">{t.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold text-white text-sm">{t.name}</div>
                  <div className="text-xs text-slate-400">Reduce sentence by ~{Math.round(t.sentenceRedux * 100)}%</div>
                </div>
                <div className="text-sm font-bold text-yellow-400">{formatMoney(t.cost, character.currency)}</div>
              </button>
            ))}

            {/* Prison activities */}
            <h4 className="text-xs font-semibold text-slate-500 mb-2 mt-4 uppercase tracking-wider">Activities in Prison</h4>
            <div className="grid grid-cols-2 gap-2">
              {PRISON_ACTIVITIES.map(a => {
                const canAfford = !a.cost || finances.cash >= a.cost;
                return (
                  <button key={a.id} onClick={() => act(doPrisonActivity, a.id)}
                    disabled={!canAfford}
                    className={`flex flex-col p-3 rounded-xl border text-left tap-effect transition-all ${
                      !canAfford ? 'bg-bg-secondary border-bg-border opacity-40 cursor-not-allowed'
                                 : a.isEscape ? 'bg-red-900/30 border-red-700/40 hover:border-red-500/60'
                                 : 'bg-bg-card border-bg-border hover:border-orange-500/50'
                    }`}
                  >
                    <span className="text-2xl mb-1">{a.icon}</span>
                    <div className="text-xs font-semibold text-white leading-tight">{a.name}</div>
                    <div className="text-[10px] text-slate-500">{a.desc}</div>
                    {a.cost > 0 && <div className="text-[10px] text-yellow-400 mt-1">{formatMoney(a.cost, character.currency)}</div>}
                    {a.isEscape && <div className="text-[10px] text-red-400 font-bold">15% escape chance</div>}
                    {a.isAppeal && <div className="text-[10px] text-blue-400 font-bold">35% success</div>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
