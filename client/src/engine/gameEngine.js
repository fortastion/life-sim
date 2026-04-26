import { v4 as uuidv4 } from 'uuid';
import { randomName } from '../data/names';
import { getEventsForAge } from '../data/events';
import { getCountry } from '../data/countries';
import { CAREER_TRACKS } from '../data/careers';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const clamp = (val, min = 0, max = 100) => Math.max(min, Math.min(max, val));
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const chance = (pct) => Math.random() * 100 < pct;

export function createCharacter({ firstName, lastName, gender, country, customStats }) {
  const countryData = getCountry(country);
  const base = {
    happiness: rand(55, 80),
    health: rand(60, 90),
    smarts: rand(30, 70),
    looks: rand(30, 70),
  };
  if (customStats) {
    Object.assign(base, customStats);
    Object.keys(base).forEach(k => { base[k] = clamp(base[k]); });
  }

  return {
    id: uuidv4(),
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    gender,
    country,
    countryFlag: countryData.flag,
    currency: countryData.currency,
    salaryMult: countryData.salaryMult,
    age: 0,
    birthYear: 2026,
    alive: true,
    deathCause: null,
    deathAge: null,

    stats: { ...base },

    finances: {
      cash: 0,
      bankBalance: 0,
      debt: 0,
      salary: 0,
      netWorth: 0,
    },

    education: {
      inSchool: true,
      schoolName: 'Elementary School',
      gpa: parseFloat((rand(20, 40) / 10).toFixed(1)),
      inUniversity: false,
      university: null,
      degree: null,
      postGrad: false,
      postGradDegree: null,
    },

    career: {
      employed: false,
      trackId: null,
      title: null,
      company: null,
      salary: 0,
      yearsAtJob: 0,
      level: 0,
      performance: rand(50, 80),
    },

    relationships: {
      partner: null,
      married: false,
      engaged: false,
      exPartners: [],
      children: [],
      friends: [],
      enemies: [],
    },

    family: {
      motherName: randomName('female').full,
      fatherName: randomName('male').full,
      motherAlive: true,
      fatherAlive: true,
      parentsMarried: chance(65),
      siblings: generateSiblings(),
    },

    health: {
      conditions: [],
      addictions: [],
      inPrison: false,
      prisonYearsLeft: 0,
    },

    hasPet: false,
    isRetired: false,

    history: [
      { id: uuidv4(), age: 0, type: 'milestone', icon: '🎉', message: `${firstName} ${lastName} was born in ${country}!` }
    ],

    activitiesUsedThisTurn: [],
    pendingChoices: [],
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
  const char = JSON.parse(JSON.stringify(character)); // deep clone
  char.age += 1;
  char.activitiesUsedThisTurn = [];

  // Natural stat drift
  applyNaturalAging(char);

  // Education auto-progression
  handleEducation(char);

  // Career salary
  if (char.career.employed) {
    const annualSalary = Math.floor(char.career.salary * char.salaryMult);
    char.finances.cash += annualSalary;
    char.finances.bankBalance += Math.floor(annualSalary * 0.2); // auto-save 20%
    char.career.yearsAtJob += 1;
    char.career.performance = clamp(char.career.performance + rand(-5, 8));
  }

  // Living expenses
  if (char.age >= 18) {
    const expenses = Math.floor(15000 * char.salaryMult);
    char.finances.cash = Math.max(-5000, char.finances.cash - expenses);
  }

  // Debt interest
  if (char.finances.debt > 0) {
    char.finances.debt = Math.floor(char.finances.debt * 1.05);
  }

  // Prison time
  if (char.health.inPrison) {
    char.health.prisonYearsLeft = Math.max(0, char.health.prisonYearsLeft - 1);
    if (char.health.prisonYearsLeft <= 0) {
      char.health.inPrison = false;
      addToHistory(char, { type: 'neutral', icon: '🔓', message: 'You were released from prison. Time to turn things around.' });
    }
  }

  // Parents aging
  ageParents(char);

  // Net worth calculation
  char.finances.netWorth = char.finances.cash + char.finances.bankBalance - char.finances.debt;

  // Generate random events for this year
  const yearEvents = generateYearEvents(char);

  // Separate choice events from auto events
  const autoEvents = yearEvents.filter(e => !e.choices);
  const choiceEvents = yearEvents.filter(e => e.choices && e.choices.length > 0);

  // Apply auto events immediately
  autoEvents.forEach(e => {
    applyEventEffects(char, e, null);
    addToHistory(char, e);
  });

  // Check for death
  const deathResult = checkForDeath(char);
  if (deathResult) {
    char.alive = false;
    char.deathCause = deathResult.cause;
    char.deathAge = char.age;
    addToHistory(char, { type: 'bad', icon: '💀', message: `You died at age ${char.age} from ${deathResult.cause}.` });
    return { character: char, choiceEvents: [], died: true, deathCause: deathResult.cause };
  }

  return { character: char, choiceEvents, died: false };
}

function applyNaturalAging(char) {
  const age = char.age;

  // Happiness baseline drift toward 60
  const happinessTarget = 60;
  char.stats.happiness += (happinessTarget - char.stats.happiness) * 0.05 + rand(-3, 3);

  // Health decline with age
  if (age < 18) char.stats.health += rand(-1, 2);
  else if (age < 35) char.stats.health += rand(-1, 1);
  else if (age < 50) char.stats.health += rand(-3, 0);
  else if (age < 65) char.stats.health += rand(-4, -1);
  else char.stats.health += rand(-5, -2);

  // Looks peak at 25, decline after
  if (age < 20) char.stats.looks += rand(0, 2);
  else if (age < 30) char.stats.looks += rand(-1, 1);
  else if (age < 50) char.stats.looks += rand(-2, 0);
  else char.stats.looks += rand(-3, -1);

  // Smarts grow with education/experience
  if (age < 25) char.stats.smarts += rand(0, 2);
  else if (age < 60) char.stats.smarts += rand(-1, 1);
  else char.stats.smarts += rand(-2, 0);

  // Clamp all stats
  Object.keys(char.stats).forEach(k => {
    char.stats[k] = clamp(char.stats[k]);
  });
}

function handleEducation(char) {
  const age = char.age;
  // School transitions
  if (age === 6) char.education.schoolName = 'Elementary School';
  if (age === 11) char.education.schoolName = 'Middle School';
  if (age === 14) char.education.schoolName = 'High School';
  if (age === 18) {
    char.education.inSchool = false;
    char.education.schoolName = null;
    // Auto-enroll in university if smart enough
    if (char.stats.smarts >= 55) {
      char.education.inUniversity = true;
      char.education.university = pickUniversity(char.stats.smarts);
      char.finances.debt += 25000;
      addToHistory(char, { type: 'milestone', icon: '🎓', message: `You enrolled in ${char.education.university}!` });
    }
  }
  if (age === 22 && char.education.inUniversity) {
    char.education.inUniversity = false;
    char.education.degree = pickDegree();
    char.stats.smarts = clamp(char.stats.smarts + rand(5, 12));
    addToHistory(char, { type: 'milestone', icon: '🎓', message: `You graduated from ${char.education.university} with a degree in ${char.education.degree}!` });
  }

  // GPA drifts based on smarts
  if (char.education.inSchool || char.education.inUniversity) {
    const targetGpa = char.stats.smarts / 25; // 100 smarts = 4.0 gpa
    char.education.gpa = clamp(
      parseFloat((char.education.gpa + (targetGpa - char.education.gpa) * 0.2 + (Math.random() - 0.5) * 0.3).toFixed(1)),
      0, 4.0
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
  const degrees = ['Computer Science', 'Business Administration', 'Psychology', 'Engineering', 'Biology', 'Economics', 'Political Science', 'Communications', 'Arts', 'Mathematics', 'Law', 'Medicine'];
  return degrees[Math.floor(Math.random() * degrees.length)];
}

function generateYearEvents(char) {
  const pool = getEventsForAge(char.age, char);
  if (pool.length === 0) return [];

  // Shuffle pool
  const shuffled = [...pool].sort(() => Math.random() - 0.5);

  // Number of events this year
  let count = 1;
  if (chance(40)) count = 2;
  if (chance(15)) count = 3;

  const selected = [];
  const usedIds = new Set();

  for (const event of shuffled) {
    if (selected.length >= count) break;
    if (usedIds.has(event.id)) continue;
    // Avoid repeating the same milestone twice
    if (char.history.some(h => h.eventId === event.id)) {
      if (event.type === 'milestone') continue;
      if (chance(70)) continue; // 70% skip if already seen
    }
    selected.push({ ...event, id: uuidv4(), eventId: event.id });
    usedIds.add(event.id);
  }

  return selected;
}

function applyEventEffects(char, event, choiceIndex) {
  let effects = {};
  if (event.choices && choiceIndex !== null && choiceIndex !== undefined) {
    effects = event.choices[choiceIndex]?.effects || {};
    // Update the event message to show the choice result
    event.resultMessage = event.choices[choiceIndex]?.result;
  } else if (event.effects) {
    // Resolve range effects
    effects = {};
    Object.entries(event.effects).forEach(([key, val]) => {
      if (Array.isArray(val)) effects[key] = rand(val[0], val[1]);
      else effects[key] = val;
    });
  }

  // Apply stat effects
  if (effects.happiness !== undefined) char.stats.happiness = clamp(char.stats.happiness + effects.happiness);
  if (effects.health !== undefined) char.stats.health = clamp(char.stats.health + effects.health);
  if (effects.smarts !== undefined) char.stats.smarts = clamp(char.stats.smarts + effects.smarts);
  if (effects.looks !== undefined) char.stats.looks = clamp(char.stats.looks + effects.looks);

  // Apply financial effects
  if (effects.money !== undefined) char.finances.cash += effects.money;
  if (effects.debt !== undefined) char.finances.debt += effects.debt;

  // Handle specials
  handleSpecialEffects(char, event, choiceIndex);
}

function handleSpecialEffects(char, event, choiceIndex) {
  const special = event.special;
  if (!special) return;

  if (special === 'add_friend') {
    const gender = chance(50) ? 'male' : 'female';
    char.relationships.friends.push({ ...randomName(gender), gender, closeness: rand(30, 70), alive: true });
  }
  if (special === 'add_partner') {
    if (!char.relationships.partner) {
      const gender = char.gender === 'male' ? (chance(90) ? 'female' : 'male') : (chance(90) ? 'male' : 'female');
      char.relationships.partner = { ...randomName(gender), gender, love: rand(50, 80), attraction: rand(50, 80) };
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
  if (special === 'engage') char.relationships.engaged = true;
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
    const gender = chance(50) ? 'male' : 'female';
    char.relationships.children.push({ ...randomName(gender), gender, age: 0, alive: true });
  }
  if (special === 'add_grandchild') {
    // Just track it
    if (!char.grandchildren) char.grandchildren = 0;
    char.grandchildren += 1;
  }
  if (special === 'add_sibling') {
    const gender = chance(50) ? 'male' : 'female';
    char.family.siblings.push({ ...randomName(gender), gender, age: 0, alive: true });
  }
  if (special === 'add_condition') {
    const conditions = ['High Blood Pressure', 'Diabetes', 'Arthritis', 'Back Pain', 'Anxiety Disorder', 'Depression', 'Heart Disease'];
    const cond = conditions[Math.floor(Math.random() * conditions.length)];
    if (!char.health.conditions.includes(cond)) char.health.conditions.push(cond);
  }
  if (special === 'fire') {
    char.career.employed = false;
    char.career.title = null;
    char.career.company = null;
    char.career.salary = 0;
    char.career.yearsAtJob = 0;
    char.career.trackId = null;
  }
  if (special === 'promote') {
    char.career.salary = Math.floor(char.career.salary * 1.25);
    char.career.level += 1;
  }
  if (special === 'retire') {
    char.isRetired = true;
    char.career.employed = false;
    char.career.salary = Math.floor(char.career.salary * 0.4); // pension
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
      char.health.inPrison = true;
      char.health.prisonYearsLeft = years;
      char.career.employed = false;
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
  if (special === 'move_out') {
    char.finances.cash -= rand(2000, 5000);
  }
  if (special === 'invest') {
    const investAmount = Math.floor(char.finances.cash * 0.1);
    if (chance(60)) {
      const gain = Math.floor(investAmount * (1 + rand(5, 40) / 100));
      char.finances.cash += gain;
      addToHistory(char, { type: 'good', icon: '📈', message: `Your investment paid off! You gained $${gain.toLocaleString()}.` });
    } else {
      char.finances.cash -= investAmount;
      addToHistory(char, { type: 'bad', icon: '📉', message: `Your investment went south. You lost $${investAmount.toLocaleString()}.` });
    }
  }
  if (special === 'meet_friend') {
    if (chance(60)) {
      const gender = chance(50) ? 'male' : 'female';
      char.relationships.friends.push({ ...randomName(gender), gender, closeness: rand(20, 60), alive: true });
      const newFriend = char.relationships.friends[char.relationships.friends.length - 1];
      addToHistory(char, { type: 'good', icon: '🤝', message: `You made a new friend: ${newFriend.full}!` });
    }
  }
  if (special === 'gambling') {
    const bet = Math.min(char.finances.cash, rand(200, 2000));
    if (chance(40)) {
      const win = bet * rand(2, 5);
      char.finances.cash += win;
      addToHistory(char, { type: 'good', icon: '🎰', message: `You won big at the casino! +$${win.toLocaleString()}` });
    } else {
      char.finances.cash -= bet;
      addToHistory(char, { type: 'bad', icon: '🎰', message: `You lost $${bet.toLocaleString()} gambling.` });
    }
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
  const age = char.age;
  const health = char.stats.health;

  // Base death chance by age
  let deathChance = 0;
  if (age < 20) deathChance = 0.3;
  else if (age < 40) deathChance = 0.4;
  else if (age < 50) deathChance = 0.8;
  else if (age < 60) deathChance = 1.5;
  else if (age < 70) deathChance = 3;
  else if (age < 80) deathChance = 6;
  else if (age < 90) deathChance = 12;
  else deathChance = 25;

  // Health modifier
  if (health < 10) deathChance *= 5;
  else if (health < 25) deathChance *= 3;
  else if (health < 40) deathChance *= 1.8;
  else if (health > 80) deathChance *= 0.5;

  // Conditions add risk
  deathChance += char.health.conditions.length * 0.5;

  if (!chance(deathChance)) return null;

  // Determine cause of death
  const causes = [];
  if (age < 30) causes.push('an accident', 'a sudden illness', 'an overdose');
  else if (age < 50) causes.push('a heart attack', 'cancer', 'an accident');
  else if (age < 70) causes.push('heart disease', 'cancer', 'stroke', 'complications from diabetes');
  else causes.push('old age', 'heart failure', 'pneumonia', 'stroke', 'natural causes');

  if (char.health.conditions.includes('Heart Disease')) causes.push('heart failure');
  if (char.health.addictions.length > 0) causes.push('substance-related complications');
  if (char.health.inPrison) causes.push('violence in prison');

  return { cause: causes[Math.floor(Math.random() * causes.length)] };
}

function addToHistory(char, event) {
  char.history.push({ id: uuidv4(), age: char.age, ...event });
}

// ─── Apply a choice to a pending event ────────────────────────────────────────
export function applyChoice(character, eventId, choiceIndex) {
  const char = JSON.parse(JSON.stringify(character));
  const event = char.pendingChoices?.find(e => e.id === eventId);
  if (!event) return char;

  // Apply the chosen effects
  applyEventEffects(char, event, choiceIndex);

  // Add to history with result message
  addToHistory(char, {
    type: event.type,
    icon: event.icon,
    message: event.message,
    resultMessage: event.resultMessage,
    choiceMade: event.choices[choiceIndex]?.text
  });

  // Remove from pending
  char.pendingChoices = char.pendingChoices.filter(e => e.id !== eventId);

  return char;
}

// ─── Apply activity ───────────────────────────────────────────────────────────
export function applyActivity(character, activity) {
  const char = JSON.parse(JSON.stringify(character));

  if (char.activitiesUsedThisTurn?.includes(activity.id)) {
    return { character: char, result: 'already_used', message: 'You already did that this year!' };
  }
  if (activity.minAge && char.age < activity.minAge) {
    return { character: char, result: 'too_young', message: 'You\'re too young for that.' };
  }
  if (activity.cost && char.finances.cash < activity.cost) {
    return { character: char, result: 'no_money', message: `You can't afford this (costs $${activity.cost.toLocaleString()}).` };
  }

  // Pay cost
  if (activity.cost) char.finances.cash -= activity.cost;

  // Apply stat effects
  if (activity.effects) {
    Object.entries(activity.effects).forEach(([key, range]) => {
      const val = Array.isArray(range) ? rand(range[0], range[1]) : range;
      if (['happiness', 'health', 'smarts', 'looks'].includes(key)) {
        char.stats[key] = clamp(char.stats[key] + val);
      }
    });
  }

  // Handle special activities
  if (activity.special) handleSpecialEffects(char, { special: activity.special }, null);

  if (!char.activitiesUsedThisTurn) char.activitiesUsedThisTurn = [];
  char.activitiesUsedThisTurn.push(activity.id);

  const statChangeSummary = activity.effects
    ? Object.entries(activity.effects).map(([k, v]) => {
        const val = Array.isArray(v) ? `${v[0] >= 0 ? '+' : ''}${Math.round((v[0] + v[1]) / 2)}` : (v >= 0 ? `+${v}` : v);
        return `${k} ${val}`;
      }).join(', ')
    : '';

  addToHistory(char, { type: 'neutral', icon: activity.icon, message: `You did "${activity.name}". ${statChangeSummary}` });

  return { character: char, result: 'success', message: `${activity.name} done!` };
}

// ─── Career actions ───────────────────────────────────────────────────────────
export function applyForJob(character, track) {
  const char = JSON.parse(JSON.stringify(character));
  const interviewScore = (char.stats.smarts * 0.4 + char.stats.looks * 0.2 + rand(0, 40));

  if (interviewScore < 45) {
    addToHistory(char, { type: 'bad', icon: '💼', message: `You interviewed for ${track.name} but didn't get the job.` });
    return { character: char, result: 'failed', message: 'You didn\'t get the job this time.' };
  }

  const company = generateCompanyName(track.id);
  char.career.employed = true;
  char.career.trackId = track.id;
  char.career.level = 0;
  char.career.title = track.levels[0].title;
  char.career.company = company;
  char.career.salary = track.levels[0].salary;
  char.career.yearsAtJob = 0;
  char.career.performance = rand(50, 75);
  char.stats.happiness = clamp(char.stats.happiness + 10);

  addToHistory(char, { type: 'milestone', icon: '💼', message: `You got hired as a ${track.levels[0].title} at ${company}!` });
  return { character: char, result: 'success', message: `Welcome to ${company}!` };
}

function generateCompanyName(trackId) {
  const companies = {
    tech: ['Google', 'Meta', 'TechCorp', 'ByteWave', 'NovaSoft', 'CloudPeak', 'DataForge'],
    medicine: ['City Medical Center', 'St. Grace Hospital', 'MedGroup', 'HealthPlus Clinic'],
    law: ['Hartwell & Associates', 'Morrison LLP', 'Chase Legal Group', 'Sterling Law'],
    business: ['Global Corp', 'Apex Holdings', 'Meridian Group', 'Pioneer Inc'],
    entertainment: ['Stellar Studios', 'Apex Films', 'Nexus Entertainment', 'Bright Pictures'],
    music: ['SoundWave Records', 'Echo Label', 'Vibe Music Group'],
    sports: ['City FC', 'Titan Athletics', 'Ironside Sports Club'],
    military: ['U.S. Army', 'U.S. Navy', 'Air Force'],
    education: ['Lincoln High School', 'Westside Academy', 'Pinewood University'],
    food: ['Le Maison', 'The Iron Chef', 'Saveur Restaurant Group'],
    crime: ['The Syndicate', 'Street Crew', 'Shadow Organization'],
  };
  const list = companies[trackId] || ['Unknown Co.'];
  return list[Math.floor(Math.random() * list.length)];
}

export function checkPromotion(character) {
  const char = JSON.parse(JSON.stringify(character));
  if (!char.career.employed || !char.career.trackId) return { character: char, promoted: false };

  const track = CAREER_TRACKS.find(t => t.id === char.career.trackId);
  if (!track) return { character: char, promoted: false };

  const nextLevel = char.career.level + 1;
  if (nextLevel >= track.levels.length) return { character: char, promoted: false, maxLevel: true };

  const nextTier = track.levels[nextLevel];
  const yearsNeeded = nextTier.yearsNeeded - (track.levels[char.career.level]?.yearsNeeded || 0);
  if (char.career.yearsAtJob < yearsNeeded) return { character: char, promoted: false };
  if (char.career.performance < 55) return { character: char, promoted: false };

  char.career.level = nextLevel;
  char.career.title = nextTier.title;
  char.career.salary = nextTier.salary;
  char.stats.happiness = clamp(char.stats.happiness + 12);

  addToHistory(char, { type: 'good', icon: '📈', message: `You were promoted to ${nextTier.title}! New salary: $${(nextTier.salary * char.salaryMult).toLocaleString()}/yr` });
  return { character: char, promoted: true };
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
  if (age < 4) return '👶';
  if (age < 12) return gender === 'female' ? '👧' : '👦';
  if (age < 18) return gender === 'female' ? '👩' : '👦';
  if (age < 35) return gender === 'female' ? '👩' : '👨';
  if (age < 60) return gender === 'female' ? '👩' : '👨';
  if (age < 75) return gender === 'female' ? '👵' : '👴';
  return gender === 'female' ? '👵' : '👴';
}

export function getLifeStage(age) {
  if (age < 5) return 'Baby';
  if (age < 13) return 'Child';
  if (age < 18) return 'Teen';
  if (age < 26) return 'Young Adult';
  if (age < 45) return 'Adult';
  if (age < 65) return 'Middle Age';
  if (age < 80) return 'Senior';
  return 'Elder';
}

export const formatMoney = (amount, currency = '$') => {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  if (abs >= 1000000) return `${sign}${currency}${(abs / 1000000).toFixed(1)}M`;
  if (abs >= 1000) return `${sign}${currency}${(abs / 1000).toFixed(1)}K`;
  return `${sign}${currency}${abs.toLocaleString()}`;
};
