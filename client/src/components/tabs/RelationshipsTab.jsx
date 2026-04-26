import React from 'react';
import { motion } from 'framer-motion';
import useGameStore from '../../store/gameStore';

function PersonCard({ person, role, icon, alive = true, extra }) {
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
          <span className="font-semibold text-white text-sm truncate">
            {person?.full || person?.fullName || `${person?.first || ''} ${person?.last || ''}`.trim() || 'Unknown'}
          </span>
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

export default function RelationshipsTab() {
  const { character } = useGameStore();
  if (!character) return null;

  const { relationships, family } = character;

  const partnerStatus = () => {
    if (!relationships.partner) return null;
    if (relationships.married) return 'Married';
    if (relationships.engaged) return 'Engaged';
    return 'Dating';
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 pt-3 pb-20">
      <h2 className="font-bold text-white text-base mb-4">Relationships</h2>

      {/* Partner */}
      <Section title="Romantic" icon="💕" empty={!relationships.partner}>
        {relationships.partner && (
          <PersonCard
            person={relationships.partner}
            role={partnerStatus()}
            icon={relationships.married ? '💍' : '❤️'}
            extra={relationships.partner.love ? `Love ${relationships.partner.love}` : undefined}
          />
        )}
        {relationships.exPartners.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-slate-500 mb-1">Exes ({relationships.exPartners.length})</p>
            {relationships.exPartners.map((ex, i) => (
              <PersonCard key={i} person={ex} role={ex.deceased ? 'Deceased' : 'Ex-Partner'} icon="💔" alive={!ex.deceased} />
            ))}
          </div>
        )}
      </Section>

      {/* Family */}
      <Section title="Family" icon="👨‍👩‍👧‍👦">
        <PersonCard
          person={{ full: family.motherName }}
          role="Mother"
          icon="👩"
          alive={family.motherAlive}
          extra={family.motherAlive ? 'Alive' : 'Deceased'}
        />
        <PersonCard
          person={{ full: family.fatherName }}
          role="Father"
          icon="👨"
          alive={family.fatherAlive}
          extra={family.fatherAlive ? 'Alive' : 'Deceased'}
        />
        {family.siblings.map((sib, i) => (
          <PersonCard
            key={i}
            person={sib}
            role="Sibling"
            icon={sib.gender === 'female' ? '👧' : '👦'}
            alive={sib.alive}
            extra={`Age ${sib.age}`}
          />
        ))}
      </Section>

      {/* Children */}
      {relationships.children.length > 0 && (
        <Section title={`Children (${relationships.children.length})`} icon="🍼">
          {relationships.children.map((child, i) => (
            <PersonCard
              key={i}
              person={child}
              role="Child"
              icon={child.gender === 'female' ? '👧' : '👦'}
              extra={`Age ${child.age}`}
            />
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

      {/* Friends */}
      <Section title={`Friends (${relationships.friends.length})`} icon="🤝" empty={relationships.friends.length === 0}>
        {relationships.friends.slice(0, 8).map((friend, i) => (
          <PersonCard
            key={i}
            person={friend}
            role="Friend"
            icon={friend.gender === 'female' ? '👩' : '👨'}
            extra={friend.closeness > 70 ? 'Best Friend' : friend.closeness > 40 ? 'Close' : 'Acquaintance'}
          />
        ))}
        {relationships.friends.length > 8 && (
          <p className="text-xs text-slate-500 mt-1">...and {relationships.friends.length - 8} more</p>
        )}
      </Section>

      {/* Health & Conditions */}
      {(character.health.conditions.length > 0 || character.health.addictions.length > 0) && (
        <Section title="Health Issues" icon="🏥">
          {character.health.conditions.map((c, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-red-950/20 border border-red-800/30 mb-1.5">
              <span>🩺</span><span className="text-sm text-red-300">{c}</span>
            </div>
          ))}
          {character.health.addictions.map((a, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-orange-950/20 border border-orange-800/30 mb-1.5">
              <span>⚠️</span><span className="text-sm text-orange-300">Addiction: {a}</span>
            </div>
          ))}
          {character.health.inPrison && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-yellow-950/20 border border-yellow-800/30 mb-1.5">
              <span>⛓️</span><span className="text-sm text-yellow-300">In Prison · {character.health.prisonYearsLeft} year(s) left</span>
            </div>
          )}
        </Section>
      )}
    </div>
  );
}
