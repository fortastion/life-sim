import { v4 as uuidv4 } from 'uuid';
import { randomName } from '../data/names';
import { getEventsForAge } from '../data/events';
import { getCountry } from '../data/countries';
import { CAREER_TRACKS } from '../data/careers';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const clamp = (val, min = 0, max = 100) => Math.max(min, Math.min(max, val));
const rand  = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const chance = (pct) => Math.random() * 100 < pct;

// ─── Create Character ─────────────────────────────────────────────────────────
export function createCharacter({ firstName, lastName, gender, country, customStats }) {
  const countryData = getCountry(country);
  const base = {
    happiness: rand(55, 80),
    health:    rand(60, 90),
    smarts:    rand(30, 70),
    looks:     rand(30, 70),
  };
  if (customStats) {
    Object.assign(base, customStats);
    Object.keys(base).forEach(k => { base[k] = clamp(base[k]); });
  }

  return {
    id:           uuidv4(),
    firstName,
    lastName,
    fullName:     `${firstName} ${lastName}`,
    gender,
    country,
    countryFlag:  countryData.flag,
    currency:     countryData.currency,
    salaryMult:   countryData.salaryMult,
    age:          0,
    birthYear:    2026,
    alive:        true,
    deathCause:   null,
    deathAge:     null,

    stats: { ...base },

    finances: {
      cash:        0,
      bankBalance: 0,
      debt:        0,
      salary:      0,
      netWorth:    0,
    },

    // Assets owned by the player
    assets: [],

    education: {
      inSchool:      false,       // babies aren't in school
      schoolName:    null,
      gpa:           parseFloat((rand(20, 40) / 10).toFixed(1)),
      inUniversity:  false,
      university:    null,
      degree:        null,
      postGrad:      false,
      postGradDegree: null,
    },

    career: {
      employed:     false,
      trackId:      null,
      title:        null,
      company:      null,
      salary:       0,
      yearsAtJob:   0,
      level:        0,
      performance:  rand(50, 80),
    },

    relationships: {
      partner:    null,
      married:    false,
      engaged:    false,
      exPartners: [],
      children:   [],
      friends:    [],
      enemies:    [],
    },

    family: {
      motherName:    randomName('female').full,
      fatherName:    randomName('male').full,
      motherAlive:   true,
      fatherAlive:   true,
      parentsMarried: chance(65),
      siblings:      generateSiblings(),
    },

    health: {
      conditions:       [],
      addictions:       [],
      inPrison:         false,
      prisonYearsLeft:  0,
    },

    hasPet:    false,
    isRetired: false,

    history: [
      {
        id:      uuidv4(),
        age:     0,
        type:    'milestone',
        icon:    '🎉',
        message: `${firstName} ${lastName} was born in ${country}!`,
      }
    ],

    activitiesUsedThisTurn: [],
    pendingChoices:         [],
  };
}

function generateSiblings() {
  const count = rand(0, 3);
  const siblings = [];
  for (let i = 0; i < count; i++) {
    const gender = chance(50) ? 'male' : 'female';
    siblings.push({ ...randomName(gender), gender, age: rand(1, 15), alive: true });
  }
  return siblings;
}

// ─── Age Up ───────────────────────────────────────────────────────────────────
export function processAgeUp(character) {
  try {
    const char = JSON.parse(JSON.stringify(character)); // deep clone
    char.age += 1;
    char.activitiesUsedThisTurn = [];

    // Natural stat drift
    applyNaturalAging(char);

    // Education auto-progression
    handleEducation(char);

    // Career salary
    if (char.career.employed) {
      const annualSalary = Math.floor(char.career.salary * (char.salaryMult || 1));
      char.finances.cash += annualSalary;
      char.finances.bankBalance += Math.floor(annualSalary * 0.2);
      char.career.yearsAtJob += 1;
      char.career.performance = clamp(char.career.performance + rand(-5, 8));
    }

    // Asset passive income
    if (char.assets && char.assets.length > 0) {
      const passiveAnnual = char.assets.reduce((sum, a) => sum + ((a.monthlyIncome || 0) * 12), 0);
      if (passiveAnnual > 0) {
        char.finances.cash += Math.floor(passiveAnnual * (char.salaryMult || 1));
      }
      // Fluctuate investment values
      char.assets = char.assets.map(a => {
        if (a.category !== 'investment') return a;
        const volatility = a.volatility || 0.1;
        const change = (Math.random() * 2 - 1) * volatility;  // -vol to +vol
        const newVal = Math.max(1, Math.round(a.currentValue * (1 + change)));
        return { ...a, currentValue: newVal };
      });
      // Property values appreciate slightly
      char.assets = char.assets.map(a => {
        if (a.category !== 'property') return a;
        const appreciation = 1 + (Math.random() * 0.06);  // 0-6% per year
        return { ...a, currentValue: Math.round(a.currentValue * appreciation) };
      });
    }

    // Living expenses (age 18+)
    if (char.age >= 18) {
      const expenses = Math.floor(15000 * (char.salaryMult || 1));
      char.finances.cash = Math.max(-5000, char.finances.cash - expenses);
    }

    // Debt interest
    if (char.finances.debt > 0) {
      char.finances.debt = Math.floor(char.finances.debt * 1.05);
    }

    // Prison time countdown
    if (char.health.inPrison) {
      char.health.prisonYearsLeft = Math.max(0, char.health.prisonYearsLeft - 1);
      if (char.health.prisonYearsLeft <= 0) {
        char.health.inPrison = false;
        addToHistory(char, { type: 'neutral', icon: '🔓', message: 'You were released from prison. Time to turn things around.' });
      }
    }

    // Parents aging
    ageParents(char);

    // Age up children
    if (char.relationships.children) {
      char.relationships.children = char.relationships.children.map(c => ({ ...c, age: c.age + 1 }));
    }
    // Age up siblings
    if (char.family.siblings) {
      char.family.siblings = char.family.siblings.map(s => ({ ...s, age: s.age + 1 }));
    }

    // Net worth
    const totalAssets = (char.assets || []).reduce((s, a) => s + (a.currentValue || 0), 0);
    char.finances.netWorth = char.finances.cash + char.finances.bankBalance + totalAssets - char.finances.debt;

    // Generate random events for this year
    let yearEvents = [];
    try {
      yearEvents = generateYearEvents(char);
    } catch (e) {
      console.warn('Event generation error:', e);
      yearEvents = [];
    }

    const autoEvents   = yearEvents.filter(e => !e.choices || e.choices.length === 0);
    const choiceEvents = yearEvents.filter(e => e.choices && e.choices.length > 0);

    // Apply auto events
    autoEvents.forEach(e => {
      try {
        applyEventEffects(char, e, null);
        addToHistory(char, e);
      } catch (err) {
        console.warn('Auto event apply error:', err);
      }
    });

    // Death check
    const deathResult = checkForDeath(char);
    if (deathResult) {
      char.alive     = false;
      char.deathCause = deathResult.cause;
      char.deathAge   = char.age;
      addToHistory(char, {
        type:    'bad',
        icon:    '💀',
        message: `You died at age ${char.age} from ${deathResult.cause}.`,
      });
      return { character: char, choiceEvents: [], died: true, deathCause: deathResult.cause };
    }

    return { character: char, choiceEvents, died: false };
  } catch (err) {
    console.error('processAgeUp error:', err);
    // Return a safe fallback: character just aged up, no events
    const safe = JSON.parse(JSON.stringify(character));
    safe.age += 1;
    safe.activitiesUsedThisTurn = [];
    return { character: safe, choiceEvents: [], died: false };
  }
}

// ─── Natural aging ────────────────────────────────────────────────────────────
function applyNaturalAging(char) {
  const age = char.age;

  // Happiness drifts toward 60
  char.stats.happiness += ((60 - char.stats.happiness) * 0.05) + rand(-3, 3);

  // Health
  if      (age < 18) char.stats.health += rand(-1, 2);
  else if (age < 35) char.stats.health += rand(-1, 1);
  else if (age < 50) char.stats.health += rand(-3, 0);
  else if (age < 65) char.stats.health += rand(-4, -1);
  else               char.stats.health += rand(-5, -2);

  // Looks peak at 25
  if      (age < 20) char.stats.looks += rand(0, 2);
  else if (age < 30) char.stats.looks += rand(-1, 1);
  else if (age < 50) char.stats.looks += rand(-2, 0);
  else               char.stats.looks += rand(-3, -1);

  // Smarts grow with education/experience
  if      (age < 25) char.stats.smarts += rand(0, 2);
  else if (age < 60) char.stats.smarts += rand(-1, 1);
  else               char.stats.smarts += rand(-2, 0);

  Object.keys(char.stats).forEach(k => {
    char.stats[k] = clamp(Math.round(char.stats[k]));
  });
}

// ─── Education ────────────────────────────────────────────────────────────────
function handleEducation(char) {
  const age = char.age;

  // Start elementary school at 6
  if (age === 6) {
    char.education.inSchool  = true;
    char.education.schoolName = 'Elementary School';
    addToHistory(char, { type: 'milestone', icon: '🏫', message: 'You started Elementary School!' });
  }
  if (age === 11) {
    char.education.schoolName = 'Middle School';
    addToHistory(char, { type: 'neutral', icon: '🏫', message: 'You moved up to Middle School.' });
  }
  if (age === 14) {
    char.education.schoolName = 'High School';
    addToHistory(char, { type: 'neutral', icon: '🏫', message: 'You started High School.' });
  }
  if (age === 18) {
    char.education.inSchool  = false;
    char.education.schoolName = null;
    // Auto-enroll in university if smart enough
    if (char.stats.smarts >= 55) {
      char.education.inUniversity = true;
      char.education.university   = pickUniversity(char.stats.smarts);
      char.finances.debt += 25000;
      addToHistory(char, {
        type:    'milestone',
        icon:    '🎓',
        message: `You enrolled in ${char.education.university}!`,
      });
    } else {
      addToHistory(char, { type: 'neutral', icon: '🏠', message: 'You graduated high school and are figuring out what to do next.' });
    }
  }
  if (age === 22 && char.education.inUniversity) {
    char.education.inUniversity = false;
    char.education.degree       = pickDegree();
    char.stats.smarts = clamp(char.stats.smarts + rand(5, 12));
    addToHistory(char, {
      type:    'milestone',
      icon:    '🎓',
      message: `You graduated from ${char.education.university} with a degree in ${char.education.degree}!`,
    });
  }

  // GPA drift
  if (char.education.inSchool || char.education.inUniversity) {
    const targetGpa = char.stats.smarts / 25;
    char.education.gpa = parseFloat(
      Math.max(0, Math.min(4.0,
        char.education.gpa + (targetGpa - char.education.gpa) * 0.2 + (Math.random() - 0.5) * 0.3
      )).toFixed(1)
    );
  }
}

function pickUniversity(smarts) {
  if (smarts >= 90) return 'MIT';
  if (smarts >= 80) return 'Harvard University';
  if (smarts >= 70) return 'State University';
  return 'Community College';
}

function pickDegree() {
  const degrees = ['Computer Science','Business Administration','Psychology','Engineering','Biology',
    'Economics','Political Science','Communications','Fine Arts','Mathematics','Law','Medicine'];
  return degrees[rand(0, degrees.length - 1)];
}

// ─── Event generation ─────────────────────────────────────────────────────────
function generateYearEvents(char) {
  const pool = getEventsForAge(char.age, char);
  if (!pool || pool.length === 0) return [];

  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  let count = 1;
  if (chance(40)) count = 2;
  if (chance(15)) count = 3;

  const selected  = [];
  const usedIds   = new Set();

  for (const event of shuffled) {
    if (selected.length >= count) break;
    if (!event || !event.id) continue;
    if (usedIds.has(event.id)) continue;
    if (char.history && char.history.some(h => h.eventId === event.id)) {
      if (event.type === 'milestone') continue;
      if (chance(70)) continue;
    }
    selected.push({ ...event, id: uuidv4(), eventId: event.id });
    usedIds.add(event.id);
  }

  return selected;
}

// ─── Apply event effects ──────────────────────────────────────────────────────
export function applyEventEffects(char, event, choiceIndex) {
  try {
    let effects = {};
    let specialToApply = event.special;

    if (event.choices && choiceIndex !== null && choiceIndex !== undefined) {
      const choice = event.choices[choiceIndex];
      if (choice) {
        effects            = choice.effects || {};
        event.resultMessage = choice.result;
        // Choice-level special overrides event-level special
        if (choice.special) specialToApply = choice.special;
      }
    } else if (event.effects) {
      effects = {};
      Object.entries(event.effects).forEach(([key, val]) => {
        if (Array.isArray(val)) effects[key] = rand(val[0], val[1]);
        else effects[key] = val;
      });
    }

    // Apply stat effects
    if (effects.happiness !== undefined) char.stats.happiness = clamp(char.stats.happiness + effects.happiness);
    if (effects.health    !== undefined) char.stats.health    = clamp(char.stats.health    + effects.health);
    if (effects.smarts    !== undefined) char.stats.smarts    = clamp(char.stats.smarts    + effects.smarts);
    if (effects.looks     !== undefined) char.stats.looks     = clamp(char.stats.looks     + effects.looks);

    // Apply financial effects
    if (effects.money !== undefined) char.finances.cash  += effects.money;
    if (effects.debt  !== undefined) char.finances.debt  += effects.debt;

    // Handle specials
    if (specialToApply) {
      handleSpecialEffects(char, { ...event, special: specialToApply }, choiceIndex);
    }
  } catch (err) {
    console.warn('applyEventEffects error:', err);
  }
}

// ─── Special effects ──────────────────────────────────────────────────────────
function handleSpecialEffects(char, event, choiceIndex) {
  const special = event.special;
  if (!special) return;

  try {
    if (special === 'add_friend') {
      const g = chance(50) ? 'male' : 'female';
      char.relationships.friends.push({ ...randomName(g), gender: g, closeness: rand(30, 70), alive: true });
    }
    if (special === 'add_partner') {
      if (!char.relationships.partner) {
        const g = char.gender === 'male' ? (chance(90) ? 'female' : 'male') : (chance(90) ? 'male' : 'female');
        char.relationships.partner = {
          ...randomName(g), gender: g,
          love: rand(50, 80), attraction: rand(50, 80),
        };
      }
    }
    if (special === 'remove_partner') {
      if (char.relationships.partner) {
        char.relationships.exPartners.push(char.relationships.partner);
        char.relationships.partner = null;
        char.relationships.engaged = false;
        char.relationships.married = false;
      }
    }
    if (special === 'engage')  char.relationships.engaged = true;
    if (special === 'marry') {
      char.relationships.married = true;
      char.relationships.engaged = false;
    }
    if (special === 'divorce') {
      if (char.relationships.partner) char.relationships.exPartners.push(char.relationships.partner);
      char.relationships.partner = null;
      char.relationships.married = false;
      char.relationships.engaged = false;
    }
    if (special === 'add_child') {
      const g = chance(50) ? 'male' : 'female';
      char.relationships.children.push({ ...randomName(g), gender: g, age: 0, alive: true });
    }
    if (special === 'add_grandchild') {
      if (!char.grandchildren) char.grandchildren = 0;
      char.grandchildren += 1;
    }
    if (special === 'add_sibling') {
      const g = chance(50) ? 'male' : 'female';
      if (!char.family.siblings) char.family.siblings = [];
      char.family.siblings.push({ ...randomName(g), gender: g, age: 0, alive: true });
    }
    if (special === 'add_condition') {
      const conditions = ['High Blood Pressure','Diabetes','Arthritis','Back Pain',
        'Anxiety Disorder','Depression','Heart Disease'];
      const cond = conditions[rand(0, conditions.length - 1)];
      if (!char.health.conditions.includes(cond)) char.health.conditions.push(cond);
    }
    if (special === 'fire') {
      char.career.employed  = false;
      char.career.title     = null;
      char.career.company   = null;
      char.career.salary    = 0;
      char.career.yearsAtJob = 0;
      char.career.trackId   = null;
    }
    if (special === 'promote') {
      char.career.salary = Math.floor(char.career.salary * 1.25);
      char.career.level += 1;
    }
    if (special === 'retire') {
      char.isRetired    = true;
      char.career.employed = false;
      char.career.salary = Math.floor(char.career.salary * 0.4);
    }
    if (special === 'graduate') {
      char.education.inUniversity = false;
      char.education.degree = char.education.degree || 'General Studies';
    }
    if (special === 'partner_dies') {
      if (char.relationships.partner) {
        char.relationships.exPartners.push({ ...char.relationships.partner, deceased: true });
        char.relationships.partner = null;
        char.relationships.married = false;
      }
    }
    if (special === 'crime_petty') {
      if (chance(35)) {
        const years = rand(1, 3);
        char.health.inPrison      = true;
        char.health.prisonYearsLeft = years;
        char.career.employed      = false;
        addToHistory(char, { type: 'bad', icon: '⛓️', message: `You got caught and sentenced to ${years} year(s) in prison.` });
      } else {
        char.finances.cash += rand(200, 800);
        addToHistory(char, { type: 'crime', icon: '🎭', message: 'You got away with it. Quick cash but your conscience stings.' });
      }
    }
    if (special === 'addiction_risk') {
      if (chance(25) && !char.health.addictions.includes('Drugs')) {
        char.health.addictions.push('Drugs');
        addToHistory(char, { type: 'bad', icon: '💊', message: 'You developed a drug addiction. This is going to be hard to shake.' });
      }
    }
    if (special === 'move_out')  { char.finances.cash -= rand(2000, 5000); }
    if (special === 'invest') {
      const amount = Math.floor(char.finances.cash * 0.1);
      if (amount > 0) {
        if (chance(60)) {
          const gain = Math.floor(amount * (1 + rand(5, 40) / 100));
          char.finances.cash += gain;
          addToHistory(char, { type: 'good', icon: '📈', message: `Your investment paid off! +${formatMoney(gain)}.` });
        } else {
          char.finances.cash -= amount;
          addToHistory(char, { type: 'bad', icon: '📉', message: `Your investment went south. Lost ${formatMoney(amount)}.` });
        }
      }
    }
    if (special === 'meet_friend') {
      if (chance(60)) {
        const g = chance(50) ? 'male' : 'female';
        const nf = { ...randomName(g), gender: g, closeness: rand(20, 60), alive: true };
        char.relationships.friends.push(nf);
        addToHistory(char, { type: 'good', icon: '🤝', message: `You made a new friend: ${nf.full}!` });
      }
    }
    if (special === 'gambling') {
      const bet = Math.min(Math.max(200, char.finances.cash * 0.05), rand(200, 2000));
      if (chance(40)) {
        const win = Math.floor(bet * rand(2, 5));
        char.finances.cash += win;
        addToHistory(char, { type: 'good', icon: '🎰', message: `You won big at the casino! +${formatMoney(win)}` });
      } else {
        char.finances.cash -= Math.floor(bet);
        addToHistory(char, { type: 'bad', icon: '🎰', message: `You lost ${formatMoney(Math.floor(bet))} gambling.` });
      }
    }
  } catch (err) {
    console.warn('handleSpecialEffects error:', err, special);
  }
}

function ageParents(char) {
  const age = char.age;
  if (char.family.motherAlive && chance(age > 70 ? 8 : age > 60 ? 3 : 0.5)) {
    char.family.motherAlive = false;
    addToHistory(char, { type: 'bad', icon: '😢', message: 'Your mother passed away. You will miss her dearly.' });
    char.stats.happiness = clamp(char.stats.happiness - 20);
  }
  if (char.family.fatherAlive && chance(age > 70 ? 9 : age > 60 ? 4 : 0.8)) {
    char.family.fatherAlive = false;
    addToHistory(char, { type: 'bad', icon: '😢', message: 'Your father passed away. You will miss him greatly.' });
    char.stats.happiness = clamp(char.stats.happiness - 18);
  }
}

function checkForDeath(char) {
  const age    = char.age;
  const health = char.stats.health;

  let deathChance = 0;
  if      (age < 5)  deathChance = 0.2;
  else if (age < 20) deathChance = 0.3;
  else if (age < 40) deathChance = 0.4;
  else if (age < 50) deathChance = 0.8;
  else if (age < 60) deathChance = 1.5;
  else if (age < 70) deathChance = 3;
  else if (age < 80) deathChance = 6;
  else if (age < 90) deathChance = 12;
  else               deathChance = 25;

  if      (health < 10) deathChance *= 5;
  else if (health < 25) deathChance *= 3;
  else if (health < 40) deathChance *= 1.8;
  else if (health > 80) deathChance *= 0.5;

  deathChance += (char.health?.conditions?.length || 0) * 0.5;

  if (!chance(deathChance)) return null;

  const causes = [];
  if      (age < 5)  causes.push('a sudden illness', 'an accident at home');
  else if (age < 30) causes.push('an accident', 'a sudden illness', 'an overdose');
  else if (age < 50) causes.push('a heart attack', 'cancer', 'an accident');
  else if (age < 70) causes.push('heart disease', 'cancer', 'stroke', 'complications from diabetes');
  else               causes.push('old age', 'heart failure', 'pneumonia', 'stroke', 'natural causes');

  if (char.health?.conditions?.includes('Heart Disease'))       causes.push('heart failure');
  if ((char.health?.addictions?.length || 0) > 0)              causes.push('substance-related complications');
  if (char.health?.inPrison)                                    causes.push('violence in prison');

  return { cause: causes[rand(0, causes.length - 1)] };
}

function addToHistory(char, event) {
  if (!char.history) char.history = [];
  char.history.push({ id: uuidv4(), age: char.age, ...event });
}

// ─── Apply a player choice ─────────────────────────────────────────────────────
export function applyChoice(character, eventId, choiceIndex) {
  try {
    const char  = JSON.parse(JSON.stringify(character));
    const pending = char.pendingChoices || [];
    const event   = pending.find(e => e.id === eventId);
    if (!event) return char;

    applyEventEffects(char, event, choiceIndex);

    addToHistory(char, {
      type:          event.type,
      icon:          event.icon,
      message:       event.message,
      resultMessage: event.resultMessage,
      choiceMade:    event.choices?.[choiceIndex]?.text,
    });

    char.pendingChoices = pending.filter(e => e.id !== eventId);
    return char;
  } catch (err) {
    console.error('applyChoice error:', err);
    return character;
  }
}

// ─── Activity ─────────────────────────────────────────────────────────────────
export function applyActivity(character, activity) {
  try {
    const char = JSON.parse(JSON.stringify(character));

    if (char.activitiesUsedThisTurn?.includes(activity.id)) {
      return { character: char, result: 'already_used', message: 'You already did that this year!' };
    }
    if (activity.minAge && char.age < activity.minAge) {
      return { character: char, result: 'too_young', message: "You're too young for that." };
    }
    if (activity.cost && char.finances.cash < activity.cost) {
      return { character: char, result: 'no_money', message: `You can't afford this (costs $${activity.cost.toLocaleString()}).` };
    }

    if (activity.cost) char.finances.cash -= activity.cost;

    if (activity.effects) {
      Object.entries(activity.effects).forEach(([key, range]) => {
        const val = Array.isArray(range) ? rand(range[0], range[1]) : range;
        if (['happiness','health','smarts','looks'].includes(key)) {
          char.stats[key] = clamp(char.stats[key] + val);
        }
      });
    }

    if (activity.special) handleSpecialEffects(char, { special: activity.special }, null);

    if (!char.activitiesUsedThisTurn) char.activitiesUsedThisTurn = [];
    char.activitiesUsedThisTurn.push(activity.id);

    const summary = activity.effects
      ? Object.entries(activity.effects).map(([k, v]) => {
          const avg = Array.isArray(v) ? Math.round((v[0] + v[1]) / 2) : v;
          return `${k} ${avg >= 0 ? '+' : ''}${avg}`;
        }).join(', ')
      : '';

    addToHistory(char, { type: 'neutral', icon: activity.icon, message: `You did "${activity.name}". ${summary}` });
    return { character: char, result: 'success', message: `${activity.name} done!` };
  } catch (err) {
    console.error('applyActivity error:', err);
    return { character, result: 'error', message: 'Something went wrong.' };
  }
}

// ─── Career: Apply for Job ────────────────────────────────────────────────────
export function applyForJob(character, track) {
  try {
    const char = JSON.parse(JSON.stringify(character));
    const score = (char.stats.smarts * 0.4 + char.stats.looks * 0.2 + rand(0, 40));

    if (score < 45) {
      addToHistory(char, { type: 'bad', icon: '💼', message: `You interviewed for ${track.name} but didn't get the job.` });
      return { character: char, result: 'failed', message: "You didn't get the job this time." };
    }

    const company = generateCompanyName(track.id);
    char.career = {
      ...char.career,
      employed:    true,
      trackId:     track.id,
      level:       0,
      title:       track.levels[0].title,
      company,
      salary:      track.levels[0].salary,
      yearsAtJob:  0,
      performance: rand(50, 75),
    };
    char.stats.happiness = clamp(char.stats.happiness + 10);
    addToHistory(char, { type: 'milestone', icon: '💼', message: `You got hired as a ${track.levels[0].title} at ${company}!` });
    return { character: char, result: 'success', message: `Welcome to ${company}!` };
  } catch (err) {
    return { character, result: 'error', message: 'Something went wrong.' };
  }
}

function generateCompanyName(trackId) {
  const companies = {
    tech:          ['Google','Meta','TechCorp','ByteWave','NovaSoft','CloudPeak','DataForge'],
    medicine:      ['City Medical Center','St. Grace Hospital','MedGroup','HealthPlus Clinic'],
    law:           ['Hartwell & Associates','Morrison LLP','Chase Legal Group','Sterling Law'],
    business:      ['Global Corp','Apex Holdings','Meridian Group','Pioneer Inc'],
    entertainment: ['Stellar Studios','Apex Films','Nexus Entertainment','Bright Pictures'],
    music:         ['SoundWave Records','Echo Label','Vibe Music Group'],
    sports:        ['City FC','Titan Athletics','Ironside Sports Club'],
    military:      ['U.S. Army','U.S. Navy','Air Force'],
    education:     ['Lincoln High School','Westside Academy','Pinewood University'],
    food:          ['Le Maison','The Iron Chef','Saveur Restaurant Group'],
    crime:         ['The Syndicate','Street Crew','Shadow Organization'],
  };
  const list = companies[trackId] || ['Unknown Co.'];
  return list[rand(0, list.length - 1)];
}

// ─── Career: Work Hard ────────────────────────────────────────────────────────
export function workHard(character) {
  try {
    const char = JSON.parse(JSON.stringify(character));
    if (!char.career.employed) return { character: char, result: 'not_employed', message: "You're not employed." };

    const perfGain = rand(8, 20);
    char.career.performance = clamp(char.career.performance + perfGain);
    char.stats.happiness    = clamp(char.stats.happiness - rand(3, 8));
    char.stats.health       = clamp(char.stats.health    - rand(1, 4));

    let msg = `You put in extra hours. Performance +${perfGain}.`;
    let result = 'worked_hard';

    // Chance of bonus
    if (chance(20)) {
      const bonus = Math.floor(char.career.salary * char.salaryMult * 0.1);
      char.finances.cash += bonus;
      msg += ` Your boss noticed and gave you a $${bonus.toLocaleString()} bonus!`;
      result = 'bonus';
    }

    addToHistory(char, { type: 'neutral', icon: '💪', message: msg });
    return { character: char, result, message: msg };
  } catch (err) {
    return { character, result: 'error', message: 'Something went wrong.' };
  }
}

// ─── Career: Slack Off ────────────────────────────────────────────────────────
export function slackOff(character) {
  try {
    const char = JSON.parse(JSON.stringify(character));
    if (!char.career.employed) return { character: char, result: 'not_employed', message: "You're not employed." };

    const perfLoss = rand(8, 18);
    char.career.performance = clamp(char.career.performance - perfLoss);
    char.stats.happiness    = clamp(char.stats.happiness + rand(3, 8));

    let msg = `You coasted this year. Performance -${perfLoss}.`;
    let result = 'slacked';

    // Risk of being fired if performance too low
    if (char.career.performance < 20 && chance(40)) {
      char.career.employed  = false;
      char.career.title     = null;
      char.career.company   = null;
      char.career.salary    = 0;
      char.career.trackId   = null;
      char.stats.happiness  = clamp(char.stats.happiness - 15);
      msg = "Your boss had enough. You got fired for poor performance.";
      result = 'fired';
    }

    addToHistory(char, { type: result === 'fired' ? 'bad' : 'neutral', icon: result === 'fired' ? '📦' : '😴', message: msg });
    return { character: char, result, message: msg };
  } catch (err) {
    return { character, result: 'error', message: 'Something went wrong.' };
  }
}

// ─── Career: Ask for Raise ────────────────────────────────────────────────────
export function askForRaise(character) {
  try {
    const char = JSON.parse(JSON.stringify(character));
    if (!char.career.employed) return { character: char, result: 'not_employed', message: "You're not employed." };

    const perfScore = char.career.performance;
    if (perfScore >= 75) {
      const raiseAmt  = Math.floor(char.career.salary * rand(5, 15) / 100);
      char.career.salary += raiseAmt;
      char.stats.happiness = clamp(char.stats.happiness + 10);
      const msg = `Your boss agreed! Salary raised by $${(raiseAmt * char.salaryMult).toLocaleString()}/yr.`;
      addToHistory(char, { type: 'good', icon: '💰', message: msg });
      return { character: char, result: 'success', message: msg };
    } else if (perfScore >= 50) {
      const msg = 'Your boss said "maybe next quarter." No raise this time.';
      char.stats.happiness = clamp(char.stats.happiness - 3);
      addToHistory(char, { type: 'neutral', icon: '🤷', message: msg });
      return { character: char, result: 'denied', message: msg };
    } else {
      const msg = 'Your boss laughed you out of their office. Maybe work harder first.';
      char.stats.happiness = clamp(char.stats.happiness - 8);
      addToHistory(char, { type: 'bad', icon: '😬', message: msg });
      return { character: char, result: 'denied_hard', message: msg };
    }
  } catch (err) {
    return { character, result: 'error', message: 'Something went wrong.' };
  }
}

// ─── Career: Check Promotion ──────────────────────────────────────────────────
export function checkPromotion(character) {
  try {
    const char = JSON.parse(JSON.stringify(character));
    if (!char.career.employed || !char.career.trackId) return { character: char, promoted: false };

    const track = CAREER_TRACKS.find(t => t.id === char.career.trackId);
    if (!track) return { character: char, promoted: false };

    const nextLevel = char.career.level + 1;
    if (nextLevel >= track.levels.length) return { character: char, promoted: false, maxLevel: true };

    const nextTier   = track.levels[nextLevel];
    const yearsNeeded = nextTier.yearsNeeded - (track.levels[char.career.level]?.yearsNeeded || 0);
    if (char.career.yearsAtJob < yearsNeeded) return { character: char, promoted: false };
    if (char.career.performance < 55) return { character: char, promoted: false };

    char.career.level  = nextLevel;
    char.career.title  = nextTier.title;
    char.career.salary = nextTier.salary;
    char.stats.happiness = clamp(char.stats.happiness + 12);

    addToHistory(char, {
      type:    'good',
      icon:    '📈',
      message: `You were promoted to ${nextTier.title}! New salary: ${formatMoney(nextTier.salary * char.salaryMult)}/yr`,
    });
    return { character: char, promoted: true };
  } catch (err) {
    return { character, promoted: false };
  }
}

// ─── Relationship actions ─────────────────────────────────────────────────────
export function spendTimeWithPartner(character) {
  try {
    const char = JSON.parse(JSON.stringify(character));
    if (!char.relationships.partner) {
      return { character: char, result: 'no_partner', message: "You don't have a partner." };
    }
    const gain = rand(5, 15);
    char.relationships.partner.love = Math.min(100, (char.relationships.partner.love || 50) + gain);
    char.stats.happiness = clamp(char.stats.happiness + rand(5, 12));
    const msg = `You spent quality time with ${char.relationships.partner.full || 'your partner'}. Love +${gain}.`;
    addToHistory(char, { type: 'good', icon: '💕', message: msg });
    return { character: char, result: 'success', message: msg };
  } catch (err) {
    return { character, result: 'error', message: 'Something went wrong.' };
  }
}

export function proposeToPartner(character) {
  try {
    const char = JSON.parse(JSON.stringify(character));
    if (!char.relationships.partner) {
      return { character: char, result: 'no_partner', message: "You don't have a partner." };
    }
    if (char.relationships.engaged || char.relationships.married) {
      return { character: char, result: 'already_engaged', message: "You're already engaged or married!" };
    }

    const love = char.relationships.partner.love || 50;
    if (love >= 65) {
      char.relationships.engaged = true;
      char.stats.happiness = clamp(char.stats.happiness + 25);
      const name = char.relationships.partner.full || 'your partner';
      const msg = `You proposed to ${name} and they said YES! 💍`;
      addToHistory(char, { type: 'milestone', icon: '💍', message: msg });
      return { character: char, result: 'accepted', message: msg };
    } else {
      char.stats.happiness = clamp(char.stats.happiness - 15);
      const msg = "They said no. The timing wasn't right.";
      addToHistory(char, { type: 'bad', icon: '💔', message: msg });
      return { character: char, result: 'rejected', message: msg };
    }
  } catch (err) {
    return { character, result: 'error', message: 'Something went wrong.' };
  }
}

export function breakUpWithPartner(character) {
  try {
    const char = JSON.parse(JSON.stringify(character));
    if (!char.relationships.partner) {
      return { character: char, result: 'no_partner', message: "You don't have a partner." };
    }
    const name = char.relationships.partner.full || 'your partner';
    char.relationships.exPartners.push(char.relationships.partner);
    char.relationships.partner  = null;
    char.relationships.engaged  = false;
    char.relationships.married  = false;
    char.stats.happiness = clamp(char.stats.happiness - rand(10, 20));
    const msg = `You broke up with ${name}. It hurts, but it was your choice.`;
    addToHistory(char, { type: 'bad', icon: '💔', message: msg });
    return { character: char, result: 'success', message: msg };
  } catch (err) {
    return { character, result: 'error', message: 'Something went wrong.' };
  }
}

export function hangOutWithFriend(character, friendIndex) {
  try {
    const char = JSON.parse(JSON.stringify(character));
    const friend = char.relationships.friends[friendIndex];
    if (!friend) return { character: char, result: 'no_friend', message: "Friend not found." };

    const gain = rand(5, 15);
    friend.closeness = Math.min(100, (friend.closeness || 30) + gain);
    char.stats.happiness = clamp(char.stats.happiness + rand(5, 10));
    const msg = `You hung out with ${friend.full || 'your friend'}. Great times! Closeness +${gain}.`;
    addToHistory(char, { type: 'good', icon: '🎉', message: msg });
    return { character: char, result: 'success', message: msg };
  } catch (err) {
    return { character, result: 'error', message: 'Something went wrong.' };
  }
}

// ─── Utility ──────────────────────────────────────────────────────────────────
export function getMoodEmoji(happiness) {
  if (happiness >= 90) return '😄';
  if (happiness >= 70) return '😊';
  if (happiness >= 50) return '😐';
  if (happiness >= 30) return '😟';
  if (happiness >= 10) return '😢';
  return '😭';
}

export function getAgeEmoji(age, gender) {
  if (age < 4)  return '👶';
  if (age < 13) return gender === 'female' ? '👧' : '👦';
  if (age < 18) return gender === 'female' ? '👩' : '👦';
  if (age < 60) return gender === 'female' ? '👩' : '👨';
  if (age < 75) return gender === 'female' ? '👵' : '👴';
  return gender === 'female' ? '👵' : '👴';
}

export function getLifeStage(age) {
  if (age < 5)  return 'Baby';
  if (age < 13) return 'Child';
  if (age < 18) return 'Teen';
  if (age < 26) return 'Young Adult';
  if (age < 45) return 'Adult';
  if (age < 65) return 'Middle Age';
  if (age < 80) return 'Senior';
  return 'Elder';
}

export const formatMoney = (amount, currency = '$') => {
  const abs  = Math.abs(amount || 0);
  const sign = amount < 0 ? '-' : '';
  if (abs >= 1000000) return `${sign}${currency}${(abs / 1000000).toFixed(1)}M`;
  if (abs >= 1000)    return `${sign}${currency}${(abs / 1000).toFixed(1)}K`;
  return `${sign}${currency}${abs.toLocaleString()}`;
};
