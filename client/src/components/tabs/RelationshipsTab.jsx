import React, { useState } from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../../store/gameStore';
import { formatMoney } from '../../engine/gameEngine';
import { DATING_LOCATIONS, DATE_ACTIVITIES } from '../../data/crimesData';

function PersonCard({ person, role, icon, alive = true, extra }) {
  const name = person?.full || person?.fullName || `${person?.first || ''} ${person?.last || ''}`.trim() || 'Unknown';
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-3 p-3 rounded-xl bg-bg-card border border-bg-border mb-2 ${!alive ? 'opacity-50' : ''}`}
    >
      <div className="w-10 h-10 rounded-full bg-bg-border flex items-center justify-center text-xl flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white text-sm truncate">{name}</span>
          {!alive && <span className="text-xs text-slate-500">✝️</span>}
        </div>
        <div className="text-xs text-slate-500">{role}{extra ? ` · ${extra}` : ''}</div>
      </div>
    </motion.div>
  );
}

function Section({ title, icon, children, empty }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">{icon}</span>
        <h3 className="text-sm font-semibold text-slate-400">{title}</h3>
      </div>
      {children}
      {empty && <p className="text-xs text-slate-600 py-2">None yet.</p>}
    </div>
  );
}

function ActionChips({ actions, onAction }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {actions.map(({ id, label, icon }) => (
        <button key={id} onClick={() => onAction(id)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-bg-border text-xs font-semibold text-slate-300 tap-effect hover:bg-purple-900/30 hover:text-purple-200 transition-all">
          <span>{icon}</span><span>{label}</span>
        </button>
      ))}
    </div>
  );
}

export default function RelationshipsTab() {
  const {
    character,
    spendTimeWithPartner, proposeToPartner, breakUpWithPartner, hangOutWithFriend,
    getMarried, tryHaveKid, adoptChild, tryAffair,
    findPartner, goOnDate,
    interactWithParent, interactWithSibling, interactWithChild,
    addNotification,
  } = useGameStore();
  const [lastFeedback, setLastFeedback] = useState(null);
  const [showDatingModal, setShowDatingModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);
  const [activeParent, setActiveParent] = useState(null); // 'mother' | 'father'

  if (!character) return null;
  const { relationships, family } = character;

  const doAction = (fn, ...args) => {
    const result = fn(...args);
    if (result?.message) {
      setLastFeedback(result.message);
      setTimeout(() => setLastFeedback(null), 2500);
    }
    return result;
  };

  const partnerStatus = () => {
    if (!relationships.partner) return null;
    if (relationships.married)  return 'Married';
    if (relationships.engaged)  return 'Engaged';
    return 'Dating';
  };

  const loveBar = relationships.partner?.love || 0;
  const loveColor = loveBar >= 70 ? '#ec4899' : loveBar >= 40 ? '#f59e0b' : '#ef4444';

  const PARENT_ACTIONS = [
    { id: 'spend_time', label: 'Visit', icon: '🏠' },
    { id: 'compliment', label: 'Compliment', icon: '💬' },
    { id: 'gift', label: 'Gift ($100)', icon: '🎁' },
    { id: 'ask_money', label: 'Borrow $', icon: '💸' },
    { id: 'argue', label: 'Argue', icon: '😤' },
  ];

  const SIBLING_ACTIONS = [
    { id: 'bond', label: 'Bond', icon: '🤝' },
    { id: 'gift', label: 'Gift', icon: '🎁' },
    { id: 'prank', label: 'Prank', icon: '😈' },
    { id: 'fight', label: 'Fight', icon: '👊' },
  ];

  const CHILD_ACTIONS = [
    { id: 'play', label: 'Play', icon: '🎮' },
    { id: 'help_hw', label: 'Homework', icon: '📚' },
    { id: 'gift', label: 'Gift ($100)', icon: '🎁' },
    { id: 'spoil', label: 'Spoil ($500)', icon: '🛍️' },
    { id: 'discipline', label: 'Discipline', icon: '👆' },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 pt-3 pb-20">
      <h2 className="font-bold text-white text-base mb-4">Relationships</h2>

      {/* ── Feedback banner ─────────────────────────────────────────────── */}
      {lastFeedback && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 p-3 rounded-xl bg-purple-900/30 border border-purple-700/30 text-xs text-purple-200"
        >
          {lastFeedback}
        </motion.div>
      )}

      {/* ── Partner ─────────────────────────────────────────────────────── */}
      <Section title="Romantic" icon="💕" empty={!relationships.partner && relationships.exPartners.length === 0}>
        {relationships.partner ? (
          <div>
            {/* Partner card */}
            <div className="bg-bg-card rounded-2xl border border-bg-border p-4 mb-3">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-bg-border flex items-center justify-center text-2xl flex-shrink-0">
                  {relationships.married ? '💍' : relationships.engaged ? '💍' : '❤️'}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white">
                    {relationships.partner.full || relationships.partner.fullName || 'Partner'}
                  </div>
                  <div className="text-xs text-pink-400 font-medium">{partnerStatus()}</div>
                </div>
              </div>

              {/* Love meter */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-400">Love</span>
                  <span className="text-xs font-bold" style={{ color: loveColor }}>{Math.round(loveBar)}%</span>
                </div>
                <div className="h-2 bg-bg-border rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${loveBar}%`, background: loveColor }} />
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  onClick={() => doAction(spendTimeWithPartner)}
                  className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-pink-900/30 border border-pink-800/40 text-pink-300 tap-effect"
                >
                  <span className="text-lg">💞</span>
                  <span className="text-[10px] font-semibold">Spend Time</span>
                </button>
                <button
                  onClick={() => setShowDateModal(true)}
                  className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-purple-900/30 border border-purple-800/40 text-purple-300 tap-effect"
                >
                  <span className="text-lg">🌹</span>
                  <span className="text-[10px] font-semibold">Go On Date</span>
                </button>
                {!relationships.engaged && !relationships.married && character.age >= 18 && (
                  <button
                    onClick={() => doAction(proposeToPartner)}
                    className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-yellow-900/30 border border-yellow-800/40 text-yellow-300 tap-effect"
                  >
                    <span className="text-lg">💍</span>
                    <span className="text-[10px] font-semibold">Propose</span>
                  </button>
                )}
                {relationships.engaged && !relationships.married && (
                  <button
                    onClick={() => doAction(getMarried)}
                    className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-green-900/30 border border-green-800/40 text-green-300 tap-effect"
                  >
                    <span className="text-lg">💒</span>
                    <span className="text-[10px] font-semibold">Get Married</span>
                  </button>
                )}
                {relationships.married && character.age >= 18 && (
                  <>
                    <button
                      onClick={() => doAction(tryHaveKid)}
                      className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-blue-900/30 border border-blue-800/40 text-blue-300 tap-effect"
                    >
                      <span className="text-lg">🍼</span>
                      <span className="text-[10px] font-semibold">Try for Baby</span>
                    </button>
                    <button
                      onClick={() => doAction(tryAffair)}
                      className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-red-900/20 border border-red-800/30 text-red-400 tap-effect"
                    >
                      <span className="text-lg">🤫</span>
                      <span className="text-[10px] font-semibold">Have Affair</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => doAction(breakUpWithPartner)}
                  className="flex flex-col items-center gap-1 py-2.5 rounded-xl bg-red-900/30 border border-red-800/40 text-red-300 tap-effect"
                >
                  <span className="text-lg">💔</span>
                  <span className="text-[10px] font-semibold">Break Up</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="p-4 rounded-xl bg-bg-card border border-bg-border text-center mb-3">
              <div className="text-3xl mb-2">💔</div>
              <p className="text-sm text-slate-400">
                {character.age < 13
                  ? "You're a bit young for romance! Age up more."
                  : 'Single. Find someone special!'}
              </p>
            </div>
            {character.age >= 13 && (
              <button
                onClick={() => setShowDatingModal(true)}
                className="w-full py-3 rounded-xl bg-pink-900/30 border border-pink-700/40 text-pink-300 font-semibold text-sm tap-effect"
              >
                💘 Find a Partner
              </button>
            )}
            {character.age >= 21 && (
              <button
                onClick={() => doAction(adoptChild)}
                className="w-full mt-2 py-3 rounded-xl bg-blue-900/30 border border-blue-700/40 text-blue-300 font-semibold text-sm tap-effect"
              >
                🤱 Adopt a Child ($30,000)
              </button>
            )}
          </div>
        )}

        {/* Adopt child when married */}
        {character.age >= 21 && relationships.partner && (
          <button
            onClick={() => doAction(adoptChild)}
            className="w-full mt-2 py-3 rounded-xl bg-teal-900/30 border border-teal-700/40 text-teal-300 font-semibold text-sm tap-effect"
          >
            🤱 Adopt a Child ($30,000)
          </button>
        )}

        {/* Exes */}
        {relationships.exPartners.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-slate-500 mb-1">Past Relationships ({relationships.exPartners.length})</p>
            {relationships.exPartners.slice(-3).map((ex, i) => (
              <PersonCard
                key={i}
                person={ex}
                role={ex.deceased ? 'Deceased Partner' : 'Ex-Partner'}
                icon="💔"
                alive={!ex.deceased}
              />
            ))}
          </div>
        )}
      </Section>

      {/* ── Children ────────────────────────────────────────────────────── */}
      {relationships.children.length > 0 && (
        <Section title={`Children (${relationships.children.length})`} icon="🍼">
          {relationships.children.map((child, i) => (
            <div key={i}>
              <PersonCard
                person={child}
                role={`${child.adopted ? 'Adopted ' : ''}${child.gender === 'female' ? 'Daughter' : 'Son'}`}
                icon={child.gender === 'female' ? '👧' : '👦'}
                extra={`Age ${child.age} · ❤️ ${child.relationship}`}
              />
              <ActionChips
                actions={CHILD_ACTIONS}
                onAction={(action) => doAction(interactWithChild, i, action)}
              />
              <div className="mb-3" />
            </div>
          ))}
        </Section>
      )}

      {character.grandchildren > 0 && (
        <Section title={`Grandchildren (${character.grandchildren})`} icon="👴">
          <div className="p-3 rounded-xl bg-bg-card border border-bg-border text-sm text-slate-400">
            You have {character.grandchildren} grandchild{character.grandchildren > 1 ? 'ren' : ''}! 🎉
          </div>
        </Section>
      )}

      {/* ── Family ──────────────────────────────────────────────────────── */}
      <Section title="Family" icon="👨‍👩‍👧‍👦">
        {/* Mother */}
        <PersonCard
          person={{ full: family.motherName }}
          role="Mother"
          icon="👩"
          alive={family.motherAlive}
          extra={`${family.motherAlive ? 'Alive' : 'Deceased'} · ❤️ ${Math.round(family.motherRelationship || 60)}`}
        />
        {family.motherAlive && (
          <ActionChips
            actions={PARENT_ACTIONS}
            onAction={(action) => doAction(interactWithParent, 'mother', action)}
          />
        )}
        <div className="mb-3" />

        {/* Father */}
        <PersonCard
          person={{ full: family.fatherName }}
          role="Father"
          icon="👨"
          alive={family.fatherAlive}
          extra={`${family.fatherAlive ? 'Alive' : 'Deceased'} · ❤️ ${Math.round(family.fatherRelationship || 60)}`}
        />
        {family.fatherAlive && (
          <ActionChips
            actions={PARENT_ACTIONS}
            onAction={(action) => doAction(interactWithParent, 'father', action)}
          />
        )}
        <div className="mb-3" />

        {/* Siblings */}
        {(family.siblings || []).map((sib, i) => (
          <div key={i}>
            <PersonCard
              person={sib}
              role="Sibling"
              icon={sib.gender === 'female' ? '👧' : '👦'}
              alive={sib.alive}
              extra={`Age ${sib.age} · ❤️ ${sib.relationship}`}
            />
            {sib.alive && (
              <ActionChips
                actions={SIBLING_ACTIONS}
                onAction={(action) => doAction(interactWithSibling, i, action)}
              />
            )}
            <div className="mb-3" />
          </div>
        ))}
        {family.siblings?.length === 0 && (
          <p className="text-xs text-slate-600 py-1">No siblings.</p>
        )}
      </Section>

      {/* ── Friends ─────────────────────────────────────────────────────── */}
      <Section
        title={`Friends (${relationships.friends.length})`}
        icon="🤝"
        empty={relationships.friends.length === 0}
      >
        {relationships.friends.slice(0, 8).map((friend, i) => {
          const closenessLabel = friend.closeness > 70 ? 'Best Friend' : friend.closeness > 40 ? 'Close' : 'Acquaintance';
          return (
            <div key={i} className="flex items-center gap-2 mb-2">
              <div className="flex-1">
                <PersonCard
                  person={friend}
                  role={closenessLabel}
                  icon={friend.gender === 'female' ? '👩' : '👨'}
                  extra={`Closeness ${friend.closeness}`}
                />
              </div>
              <button
                onClick={() => doAction(hangOutWithFriend, i)}
                className="flex-shrink-0 -mt-2 text-xs px-2 py-1.5 rounded-lg bg-purple-900/30 border border-purple-700/30 text-purple-300 tap-effect"
              >
                🎉 Hang
              </button>
            </div>
          );
        })}
        {relationships.friends.length > 8 && (
          <p className="text-xs text-slate-500 mt-1">
            ...and {relationships.friends.length - 8} more friends
          </p>
        )}
      </Section>

      {/* ── Health & Conditions ─────────────────────────────────────────── */}
      {(character.health.conditions.length > 0 ||
        character.health.addictions.length > 0 ||
        character.health.inPrison) && (
        <Section title="Health Issues" icon="🏥">
          {character.health.conditions.map((c, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-red-950/20 border border-red-800/30 mb-1.5">
              <span>🩺</span><span className="text-sm text-red-300">{c.name || c}</span>
            </div>
          ))}
          {character.health.addictions.map((a, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-orange-950/20 border border-orange-800/30 mb-1.5">
              <span>⚠️</span><span className="text-sm text-orange-300">Addiction: {a}</span>
            </div>
          ))}
          {character.health.inPrison && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-yellow-950/20 border border-yellow-800/30 mb-1.5">
              <span>⛓️</span>
              <span className="text-sm text-yellow-300">
                In Prison · {character.health.prisonYearsLeft} year(s) left
              </span>
            </div>
          )}
        </Section>
      )}

      {/* ── Find Partner Modal ───────────────────────────────────────────── */}
      {showDatingModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center p-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-sm bg-bg-card rounded-2xl border border-bg-border max-h-[70vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-bg-border flex-shrink-0">
              <h3 className="font-bold text-white">💘 Where to Meet?</h3>
              <button onClick={() => setShowDatingModal(false)} className="text-slate-400 text-xl tap-effect">✕</button>
            </div>
            <div className="overflow-y-auto p-3 flex flex-col gap-2">
              {DATING_LOCATIONS.filter(l => character.age >= (l.minAge || 0)).map(loc => {
                const canAfford = !loc.cost || character.finances.cash >= loc.cost;
                return (
                  <button
                    key={loc.id}
                    onClick={() => {
                      doAction(findPartner, loc.id);
                      setShowDatingModal(false);
                    }}
                    disabled={!canAfford}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left tap-effect ${
                      canAfford
                        ? 'bg-bg-secondary border-bg-border hover:border-pink-500/50'
                        : 'bg-bg-secondary border-bg-border opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <span className="text-3xl flex-shrink-0">{loc.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-white text-sm">{loc.name}</div>
                      <div className="text-xs text-slate-400">{loc.desc}</div>
                      <div className="text-xs text-green-400">{loc.baseChance}% match rate</div>
                    </div>
                    {loc.cost > 0 && (
                      <div className={`text-sm font-bold ${canAfford ? 'text-yellow-400' : 'text-red-400'}`}>
                        {formatMoney(loc.cost, character.currency)}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}

      {/* ── Go on Date Modal ─────────────────────────────────────────────── */}
      {showDateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end justify-center p-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-sm bg-bg-card rounded-2xl border border-bg-border max-h-[70vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-bg-border flex-shrink-0">
              <h3 className="font-bold text-white">🌹 Plan a Date</h3>
              <button onClick={() => setShowDateModal(false)} className="text-slate-400 text-xl tap-effect">✕</button>
            </div>
            <div className="overflow-y-auto p-3 flex flex-col gap-2">
              {DATE_ACTIVITIES.map(date => {
                const canAfford = !date.cost || character.finances.cash >= date.cost;
                return (
                  <button
                    key={date.id}
                    onClick={() => {
                      doAction(goOnDate, date.id);
                      setShowDateModal(false);
                    }}
                    disabled={!canAfford}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left tap-effect ${
                      canAfford
                        ? 'bg-bg-secondary border-bg-border hover:border-pink-500/50'
                        : 'bg-bg-secondary border-bg-border opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <span className="text-3xl flex-shrink-0">{date.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-white text-sm">{date.name}</div>
                      <div className="text-xs text-slate-400">{date.desc}</div>
                      <div className="text-xs text-pink-400">Love +{date.loveGain[0]}–{date.loveGain[1]}</div>
                    </div>
                    {date.cost > 0 && (
                      <div className={`text-sm font-bold ${canAfford ? 'text-yellow-400' : 'text-red-400'}`}>
                        {formatMoney(date.cost, character.currency)}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
