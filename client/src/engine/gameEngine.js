import { v4 as uuidv4 } from 'uuid';
import { randomName } from '../data/names';
import { getEventsForAge } from '../data/events';
import { getCountry } from '../data/countries';
import { CAREER_TRACKS } from '../data/careers';
import {
  MEDICAL_CONDITIONS, PLASTIC_SURGERIES, GYM_WORKOUTS,
  THERAPY_TYPES, MEDICATIONS, REHAB_PROGRAMS, DOCTOR_FINDINGS,
  HAIR_COLORS, TATTOO_PLACEMENTS, PIERCINGS,
} from '../data/healthData';
import { CRIMES, PRISON_ACTIVITIES, LAWYER_TIERS, DATING_LOCATIONS, DATE_ACTIVITIES } from '../data/crimesData';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const clamp = (val, min = 0, max = 100) => Math.max(min, Math.min(max, val));
const rand  = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const chance = (pct) => Math.random() * 100 < pct;
const pick = (arr) => arr[rand(0, arr.length - 1)];
const applyRange = (range) => Array.isArray(range) ? rand(range[0], range[1]) : range;

// ─── Stocks Available for Trading ─────────────────────────────────────────────
export const STOCKS = [
  { ticker: 'AAPL',  name: 'Apple Inc.',           icon: '🍎', basePrice: 180,  volatility: 0.15 },
  { ticker: 'GOOGL', name: 'Alphabet Inc.',        icon: '🔍', basePrice: 140,  volatility: 0.18 },
  { ticker: 'AMZN',  name: 'Amazon.com',           icon: '📦', basePrice: 175,  volatility: 0.20 },
  { ticker: 'TSLA',  name: 'Tesla',                icon: '🚗', basePrice: 250,  volatility: 0.45 },
  { ticker: 'NVDA',  name: 'NVIDIA',               icon: '💚', basePrice: 480,  volatility: 0.40 },
  { ticker: 'META',  name: 'Meta Platforms',       icon: '👥', basePrice: 380,  volatility: 0.30 },
  { ticker: 'NFLX',  name: 'Netflix',              icon: '📺', basePrice: 450,  volatility: 0.25 },
  { ticker: 'BTC',   name: 'Bitcoin',              icon: '₿',  basePrice: 60000,volatility: 0.65 },
  { ticker: 'ETH',   name: 'Ethereum',             icon: 'Ξ',  basePrice: 3500, volatility: 0.70 },
  { ticker: 'SP500', name: 'S&P 500 Index Fund',   icon: '📊', basePrice: 470,  volatility: 0.10 },
];

// ─── Pet Types ────────────────────────────────────────────────────────────────
export const PET_TYPES = [
  { id: 'dog',     name: 'Dog',     icon: '🐶', cost: 800,   maxAge: 14, careCost: 1200, happiness: 12 },
  { id: 'cat',     name: 'Cat',     icon: '🐱', cost: 400,   maxAge: 18, careCost: 800,  happiness: 10 },
  { id: 'bird',    name: 'Parrot',  icon: '🦜', cost: 1500,  maxAge: 50, careCost: 600,  happiness: 7 },
  { id: 'rabbit',  name: 'Rabbit',  icon: '🐰', cost: 200,   maxAge: 10, careCost: 500,  happiness: 6 },
  { id: 'hamster', name: 'Hamster', icon: '🐹', cost: 50,    maxAge: 3,  careCost: 200,  happiness: 4 },
  { id: 'fish',    name: 'Fish',    icon: '🐠', cost: 80,    maxAge: 7,  careCost: 300,  happiness: 3 },
  { id: 'snake',   name: 'Snake',   icon: '🐍', cost: 600,   maxAge: 25, careCost: 700,  happiness: 5 },
  { id: 'horse',   name: 'Horse',   icon: '🐴', cost: 8000,  maxAge: 30, careCost: 6000, happiness: 15 },
];

// ─── Vacation Destinations ────────────────────────────────────────────────────
export const VACATION_DESTINATIONS = [
  { id: 'staycation',    name: 'Staycation',         icon: '🏠', cost: 500,    happinessGain: [3,8],  smartsGain: [0,1], description: 'Stay home, relax, save money' },
  { id: 'beach',         name: 'Beach Resort',       icon: '🏖️', cost: 3000,   happinessGain: [10,18],smartsGain: [1,3], description: 'Sun, sand, and cocktails' },
  { id: 'europe',        name: 'European Tour',      icon: '🇪🇺', cost: 8000,   happinessGain: [15,25],smartsGain: [3,7], description: 'Paris, Rome, Barcelona — culture overload' },
  { id: 'asia',          name: 'Asian Adventure',    icon: '🏯', cost: 6000,   happinessGain: [12,22],smartsGain: [4,8], description: 'Tokyo, Seoul, Bangkok — mind-blowing' },
  { id: 'safari',        name: 'African Safari',     icon: '🦁', cost: 12000,  happinessGain: [18,28],smartsGain: [4,9], description: 'Once-in-a-lifetime wildlife trip' },
  { id: 'cruise',        name: 'Luxury Cruise',      icon: '🚢', cost: 5500,   happinessGain: [13,22],smartsGain: [2,4], description: 'All-inclusive ocean voyage' },
  { id: 'backpack',      name: 'Backpacking',        icon: '🎒', cost: 2500,   happinessGain: [10,20],smartsGain: [5,10], description: 'Budget travel, deep experiences' },
  { id: 'ski',           name: 'Ski Trip',           icon: '⛷️', cost: 4000,   happinessGain: [10,18],smartsGain: [1,3], description: 'Alpine slopes and chalets' },
  { id: 'world_tour',    name: 'Around the World',   icon: '🌍', cost: 50000,  happinessGain: [25,40],smartsGain: [10,18],description: 'The bucket list trip' },
];

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
    id: uuidv4(),
    firstName, lastName,
    fullName: `${firstName} ${lastName}`,
    gender, country,
    countryFlag: countryData.flag,
    currency:    countryData.currency,
    salaryMult:  countryData.salaryMult,
    age: 0,
    birthYear: 2026,
    alive: true,
    deathCause: null,
    deathAge: null,

    stats: { ...base },

    finances: {
      cash: 0, bankBalance: 0, debt: 0, salary: 0, netWorth: 0,
      loans: [], creditCardDebt: 0, creditCardLimit: 0,
      stocks: [], taxesDue: 0,
    },

    assets: [],

    education: {
      inSchool: false, schoolName: null,
      gpa: parseFloat((rand(20, 40) / 10).toFixed(1)),
      inUniversity: false, university: null,
      degree: null, postGrad: false, postGradDegree: null,
      studyEffort: 50, // 0-100 — affects GPA progression
    },

    career: {
      employed: false, trackId: null, title: null, company: null,
      salary: 0, yearsAtJob: 0, level: 0,
      performance: rand(50, 80),
      coworkers: [], bossRelationship: 50,
      isBusinessOwner: false, business: null,
    },

    relationships: {
      partner: null, married: false, engaged: false,
      exPartners: [], children: [], friends: [], enemies: [],
      datesThisYear: 0,
    },

    family: {
      motherName: randomName('female').full,
      fatherName: randomName('male').full,
      motherAlive: true, fatherAlive: true,
      parentsMarried: chance(65),
      siblings: generateSiblings(),
      motherRelationship: rand(55, 85),
      fatherRelationship: rand(55, 85),
    },

    health: {
      conditions: [],     // [{name, since, treatment, treatmentProgress}]
      addictions: [],
      inPrison: false,
      prisonYearsLeft: 0,
      prisonSentenceTotal: 0,
    },

    mentalHealth: {
      score: rand(55, 80),
      inTherapy: false,
      therapyType: null,
      therapyYears: 0,
      onMedication: false,
      medication: null,
    },

    appearance: {
      hairColor: pick(['natural_black','dark_brown','brown','blonde','red','auburn']),
      tattoos: [], piercings: [],
      weight: 'normal', // underweight | normal | overweight | obese
      glasses: false,
    },

    hobbies: {
      instrument: null, sport: null,
      artSkill: 0, writingSkill: 0,
      booksRead: 0, booksWritten: [],
      languages: [],
    },

    gym: {
      hasMembership: false, workoutsThisYear: 0, fitnessLevel: 50,
    },

    pets: [],

    fame: 0,
    karma: 50,
    socialMedia: { platform: null, followers: 0 },
    criminalRecord: [],

    family_extra: { motherRel: rand(55,85), fatherRel: rand(55,85) },

    hasPet: false,
    isRetired: false,

    history: [
      { id: uuidv4(), age: 0, type: 'milestone', icon: '🎉', message: `${firstName} ${lastName} was born in ${country}!` },
    ],

    activitiesUsedThisTurn: [],
    pendingChoices: [],
  };
}

function generateSiblings() {
  const count = rand(0, 3);
  const out = [];
  for (let i = 0; i < count; i++) {
    const g = chance(50) ? 'male' : 'female';
    out.push({ ...randomName(g), gender: g, age: rand(1, 15), alive: true, relationship: rand(40, 80) });
  }
  return out;
}

// ─── Age Up ───────────────────────────────────────────────────────────────────
export function processAgeUp(character) {
  try {
    const char = JSON.parse(JSON.stringify(character));
    char.age += 1;
    char.activitiesUsedThisTurn = [];
    char.relationships.datesThisYear = 0;
    if (char.gym) char.gym.workoutsThisYear = 0;

    applyNaturalAging(char);
    handleEducation(char);

    // Career salary
    if (char.career.employed) {
      const salary = Math.floor(char.career.salary * (char.salaryMult || 1));
      char.finances.cash += salary;
      char.finances.bankBalance += Math.floor(salary * 0.2);
      char.career.yearsAtJob += 1;
      char.career.performance = clamp(char.career.performance + rand(-5, 8));
    }

    // Business income
    if (char.career.isBusinessOwner && char.career.business) {
      const biz = char.career.business;
      const yearRevenue = applyRange(biz.revenuePerYear);
      const yearCost = Math.floor(yearRevenue * (0.5 + Math.random() * 0.3));
      const profit = yearRevenue - yearCost;
      char.finances.cash += Math.floor(profit * (char.salaryMult || 1));
      biz.totalProfit = (biz.totalProfit || 0) + profit;
      biz.value = Math.floor(biz.value * (1 + (Math.random() * 0.1 - 0.03)));
    }

    // Asset passive income & value drift
    if (char.assets && char.assets.length > 0) {
      const passive = char.assets.reduce((s, a) => s + ((a.monthlyIncome || 0) * 12), 0);
      if (passive > 0) char.finances.cash += Math.floor(passive * (char.salaryMult || 1));
      char.assets = char.assets.map(a => {
        if (a.category === 'investment') {
          const v = a.volatility || 0.1;
          const ch = (Math.random() * 2 - 1) * v;
          return { ...a, currentValue: Math.max(1, Math.round(a.currentValue * (1 + ch))) };
        }
        if (a.category === 'property') {
          return { ...a, currentValue: Math.round(a.currentValue * (1 + Math.random() * 0.06)) };
        }
        return a;
      });
    }

    // Stock price updates
    if (char.finances.stocks && char.finances.stocks.length > 0) {
      char.finances.stocks = char.finances.stocks.map(s => {
        const stockData = STOCKS.find(x => x.ticker === s.ticker);
        const v = stockData?.volatility || 0.2;
        const ch = (Math.random() * 2 - 1) * v;
        return { ...s, currentPrice: Math.max(1, Math.round(s.currentPrice * (1 + ch) * 100) / 100) };
      });
    }

    // Loans: monthly payment × 12
    if (char.finances.loans && char.finances.loans.length > 0) {
      char.finances.loans = char.finances.loans.map(loan => {
        const annualPayment = loan.monthlyPayment * 12;
        const interestPart = Math.floor(loan.remaining * loan.rate);
        const principalPart = Math.max(0, annualPayment - interestPart);
        const newRemaining = Math.max(0, loan.remaining - principalPart);
        if (char.finances.cash >= annualPayment) {
          char.finances.cash -= annualPayment;
          return { ...loan, remaining: newRemaining };
        } else {
          // Missed payment
          char.finances.debt += annualPayment + interestPart;
          char.karma = clamp((char.karma || 50) - 2);
          return { ...loan, remaining: newRemaining + interestPart };
        }
      }).filter(l => l.remaining > 0);
    }

    // Credit card interest (~22% APR)
    if (char.finances.creditCardDebt > 0) {
      char.finances.creditCardDebt = Math.floor(char.finances.creditCardDebt * 1.22);
    }

    // Therapy ongoing
    if (char.mentalHealth?.inTherapy) {
      const therapy = THERAPY_TYPES.find(t => t.id === char.mentalHealth.therapyType);
      if (therapy) {
        char.finances.cash -= therapy.costPerYear;
        char.mentalHealth.score = clamp(char.mentalHealth.score + applyRange(therapy.mhGain));
        char.stats.happiness = clamp(char.stats.happiness + applyRange(therapy.happinessGain));
        char.mentalHealth.therapyYears = (char.mentalHealth.therapyYears || 0) + 1;
      }
    }

    // Medication ongoing
    if (char.mentalHealth?.onMedication && char.mentalHealth.medication) {
      const med = MEDICATIONS.find(m => m.id === char.mentalHealth.medication);
      if (med) {
        char.finances.cash -= med.costPerYear;
        if (med.mhGain) char.mentalHealth.score = clamp(char.mentalHealth.score + Math.floor(med.mhGain / 2));
        if (med.happinessGain) char.stats.happiness = clamp(char.stats.happiness + Math.floor(med.happinessGain / 2));
        if (med.healthGain) char.stats.health = clamp(char.stats.health + Math.floor(med.healthGain / 2));
      }
    }

    // Gym membership cost
    if (char.gym?.hasMembership) {
      char.finances.cash -= 600;
    }

    // Pets aging
    if (char.pets && char.pets.length > 0) {
      char.pets = char.pets.map(p => ({ ...p, age: p.age + 1, happiness: clamp((p.happiness || 70) - 2) }));
      // Pet care costs
      const petCost = char.pets.reduce((s, p) => {
        const pt = PET_TYPES.find(x => x.id === p.type);
        return s + (pt?.careCost || 500);
      }, 0);
      char.finances.cash -= petCost;
      // Pet death check
      char.pets = char.pets.filter(p => {
        const pt = PET_TYPES.find(x => x.id === p.type);
        const maxAge = pt?.maxAge || 12;
        if (p.age > maxAge) {
          addToHistory(char, { type: 'bad', icon: pt.icon, message: `${p.name} the ${pt.name} passed away after a happy ${p.age}-year life. 🌈` });
          char.stats.happiness = clamp(char.stats.happiness - 15);
          return false;
        }
        return true;
      });
      char.hasPet = char.pets.length > 0;
    }

    // Living expenses (18+)
    if (char.age >= 18) {
      const expenses = Math.floor(15000 * (char.salaryMult || 1));
      char.finances.cash = Math.max(-10000, char.finances.cash - expenses);
    }

    // Taxes (simplified)
    if (char.age >= 18 && char.career.employed) {
      const taxRate = char.career.salary > 200000 ? 0.32 : char.career.salary > 80000 ? 0.24 : 0.15;
      const taxes = Math.floor(char.career.salary * char.salaryMult * taxRate);
      char.finances.cash = Math.max(-10000, char.finances.cash - taxes);
    }

    // Debt interest
    if (char.finances.debt > 0) char.finances.debt = Math.floor(char.finances.debt * 1.05);

    // Prison countdown
    if (char.health.inPrison) {
      char.health.prisonYearsLeft = Math.max(0, char.health.prisonYearsLeft - 1);
      if (char.health.prisonYearsLeft <= 0) {
        char.health.inPrison = false;
        addToHistory(char, { type: 'neutral', icon: '🔓', message: 'You were released from prison. Time to turn things around.' });
      }
    }

    // Mental health natural drift
    if (char.mentalHealth) {
      char.mentalHealth.score = clamp(char.mentalHealth.score + ((70 - char.mentalHealth.score) * 0.05) + rand(-3, 3));
    }

    // Conditions worsen
    if (char.health.conditions && char.health.conditions.length > 0) {
      char.health.conditions.forEach(cond => {
        const data = MEDICAL_CONDITIONS.find(c => c.name === cond.name || c.name === cond);
        if (data && !cond.treatment) {
          char.stats.health = clamp(char.stats.health + Math.floor(data.healthImpact / 4));
        }
      });
    }

    // Hobby skill decay slightly
    if (char.hobbies?.instrument) {
      char.hobbies.instrument.skill = clamp(char.hobbies.instrument.skill - 1);
    }

    // Aging family
    ageParents(char);
    if (char.relationships.children) {
      char.relationships.children = char.relationships.children.map(c => ({ ...c, age: c.age + 1 }));
    }
    if (char.family.siblings) {
      char.family.siblings = char.family.siblings.map(s => ({ ...s, age: s.age + 1 }));
    }

    // Net worth
    const totalAssets = (char.assets || []).reduce((s, a) => s + (a.currentValue || 0), 0);
    const totalStocks = (char.finances.stocks || []).reduce((s, x) => s + (x.shares * x.currentPrice), 0);
    const totalLoans = (char.finances.loans || []).reduce((s, l) => s + l.remaining, 0);
    char.finances.netWorth = char.finances.cash + char.finances.bankBalance + totalAssets + totalStocks
                             - char.finances.debt - char.finances.creditCardDebt - totalLoans;

    // Generate events
    let yearEvents = [];
    try { yearEvents = generateYearEvents(char); } catch (e) { console.warn('event gen err:', e); }
    const autoEvents = yearEvents.filter(e => !e.choices || e.choices.length === 0);
    const choiceEvents = yearEvents.filter(e => e.choices && e.choices.length > 0);

    autoEvents.forEach(e => {
      try { applyEventEffects(char, e, null); addToHistory(char, e); }
      catch (err) { console.warn(err); }
    });

    // Death check
    const deathResult = checkForDeath(char);
    if (deathResult) {
      char.alive = false;
      char.deathCause = deathResult.cause;
      char.deathAge = char.age;
      addToHistory(char, { type: 'bad', icon: '💀', message: `You died at age ${char.age} from ${deathResult.cause}.` });
      return { character: char, choiceEvents: [], died: true, deathCause: deathResult.cause };
    }

    return { character: char, choiceEvents, died: false };
  } catch (err) {
    console.error('processAgeUp err:', err);
    const safe = JSON.parse(JSON.stringify(character));
    safe.age += 1;
    safe.activitiesUsedThisTurn = [];
    return { character: safe, choiceEvents: [], died: false };
  }
}

// ─── Natural Aging ────────────────────────────────────────────────────────────
function applyNaturalAging(char) {
  const age = char.age;
  char.stats.happiness += ((60 - char.stats.happiness) * 0.05) + rand(-3, 3);

  if      (age < 18) char.stats.health += rand(-1, 2);
  else if (age < 35) char.stats.health += rand(-1, 1);
  else if (age < 50) char.stats.health += rand(-3, 0);
  else if (age < 65) char.stats.health += rand(-4, -1);
  else               char.stats.health += rand(-5, -2);

  if      (age < 20) char.stats.looks += rand(0, 2);
  else if (age < 30) char.stats.looks += rand(-1, 1);
  else if (age < 50) char.stats.looks += rand(-2, 0);
  else               char.stats.looks += rand(-3, -1);

  if      (age < 25) char.stats.smarts += rand(0, 2);
  else if (age < 60) char.stats.smarts += rand(-1, 1);
  else               char.stats.smarts += rand(-2, 0);

  Object.keys(char.stats).forEach(k => { char.stats[k] = clamp(Math.round(char.stats[k])); });
}

function handleEducation(char) {
  const a = char.age;
  if (a === 6) { char.education.inSchool = true; char.education.schoolName = 'Elementary School';
    addToHistory(char, { type: 'milestone', icon: '🏫', message: 'You started Elementary School!' }); }
  if (a === 11) { char.education.schoolName = 'Middle School';
    addToHistory(char, { type: 'neutral', icon: '🏫', message: 'You moved up to Middle School.' }); }
  if (a === 14) { char.education.schoolName = 'High School';
    addToHistory(char, { type: 'neutral', icon: '🏫', message: 'You started High School.' }); }
  if (a === 18) {
    char.education.inSchool = false;
    char.education.schoolName = null;
    if (char.stats.smarts >= 55) {
      char.education.inUniversity = true;
      char.education.university = pickUniversity(char.stats.smarts);
      char.finances.debt += 25000;
      addToHistory(char, { type: 'milestone', icon: '🎓', message: `You enrolled in ${char.education.university}!` });
    } else {
      addToHistory(char, { type: 'neutral', icon: '🏠', message: 'You graduated high school. Time to figure things out.' });
    }
  }
  if (a === 22 && char.education.inUniversity) {
    char.education.inUniversity = false;
    char.education.degree = pickDegree();
    char.stats.smarts = clamp(char.stats.smarts + rand(5, 12));
    addToHistory(char, { type: 'milestone', icon: '🎓', message: `You graduated with a degree in ${char.education.degree}!` });
  }

  if (char.education.inSchool || char.education.inUniversity) {
    const effort = (char.education.studyEffort || 50) / 100;
    const target = (char.stats.smarts / 25) * (0.7 + effort * 0.6);
    char.education.gpa = parseFloat(Math.max(0, Math.min(4.0,
      char.education.gpa + (target - char.education.gpa) * 0.2 + (Math.random() - 0.5) * 0.3
    )).toFixed(1));
  }
}

function pickUniversity(smarts) {
  if (smarts >= 90) return 'MIT';
  if (smarts >= 80) return 'Harvard University';
  if (smarts >= 70) return 'State University';
  return 'Community College';
}

function pickDegree() {
  return pick(['Computer Science','Business','Psychology','Engineering','Biology','Economics',
    'Political Science','Communications','Fine Arts','Mathematics','Law','Medicine','Philosophy']);
}

// ─── Event System ─────────────────────────────────────────────────────────────
function generateYearEvents(char) {
  const pool = getEventsForAge(char.age, char);
  if (!pool || pool.length === 0) return [];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  let count = 1;
  if (chance(40)) count = 2;
  if (chance(15)) count = 3;
  const selected = [];
  const used = new Set();
  for (const e of shuffled) {
    if (selected.length >= count) break;
    if (!e || !e.id) continue;
    if (used.has(e.id)) continue;
    if (char.history?.some(h => h.eventId === e.id)) {
      if (e.type === 'milestone') continue;
      if (chance(70)) continue;
    }
    selected.push({ ...e, id: uuidv4(), eventId: e.id });
    used.add(e.id);
  }
  return selected;
}

export function applyEventEffects(char, event, choiceIndex) {
  try {
    let effects = {};
    let specialToApply = event.special;
    if (event.choices && choiceIndex !== null && choiceIndex !== undefined) {
      const c = event.choices[choiceIndex];
      if (c) {
        effects = c.effects || {};
        event.resultMessage = c.result;
        if (c.special) specialToApply = c.special;
      }
    } else if (event.effects) {
      effects = {};
      Object.entries(event.effects).forEach(([k, v]) => { effects[k] = applyRange(v); });
    }
    if (effects.happiness !== undefined) char.stats.happiness = clamp(char.stats.happiness + effects.happiness);
    if (effects.health    !== undefined) char.stats.health    = clamp(char.stats.health    + effects.health);
    if (effects.smarts    !== undefined) char.stats.smarts    = clamp(char.stats.smarts    + effects.smarts);
    if (effects.looks     !== undefined) char.stats.looks     = clamp(char.stats.looks     + effects.looks);
    if (effects.money     !== undefined) char.finances.cash  += effects.money;
    if (effects.debt      !== undefined) char.finances.debt  += effects.debt;
    if (specialToApply) handleSpecialEffects(char, { ...event, special: specialToApply }, choiceIndex);
  } catch (err) { console.warn(err); }
}

function handleSpecialEffects(char, event, choiceIndex) {
  const s = event.special;
  if (!s) return;
  try {
    if (s === 'add_friend') addRandomFriend(char);
    if (s === 'add_partner' && !char.relationships.partner) {
      const g = char.gender === 'male' ? (chance(90) ? 'female' : 'male') : (chance(90) ? 'male' : 'female');
      char.relationships.partner = { ...randomName(g), gender: g, love: rand(50, 80), attraction: rand(50, 80) };
    }
    if (s === 'remove_partner' && char.relationships.partner) {
      char.relationships.exPartners.push(char.relationships.partner);
      char.relationships.partner = null;
      char.relationships.engaged = false;
      char.relationships.married = false;
    }
    if (s === 'engage') char.relationships.engaged = true;
    if (s === 'marry')  { char.relationships.married = true; char.relationships.engaged = false; }
    if (s === 'divorce') {
      if (char.relationships.partner) char.relationships.exPartners.push(char.relationships.partner);
      char.relationships.partner = null; char.relationships.married = false; char.relationships.engaged = false;
    }
    if (s === 'add_child') {
      const g = chance(50) ? 'male' : 'female';
      char.relationships.children.push({ ...randomName(g), gender: g, age: 0, alive: true, relationship: 80 });
    }
    if (s === 'add_grandchild') { char.grandchildren = (char.grandchildren || 0) + 1; }
    if (s === 'add_sibling') {
      const g = chance(50) ? 'male' : 'female';
      if (!char.family.siblings) char.family.siblings = [];
      char.family.siblings.push({ ...randomName(g), gender: g, age: 0, alive: true, relationship: 70 });
    }
    if (s === 'add_condition') {
      const conds = ['High Blood Pressure','Type 2 Diabetes','Anxiety Disorder','Clinical Depression','Chronic Back Pain'];
      const cn = pick(conds);
      if (!char.health.conditions.find(c => (c.name || c) === cn)) {
        char.health.conditions.push({ name: cn, since: char.age, treatment: null });
      }
    }
    if (s === 'fire') {
      char.career.employed = false; char.career.title = null; char.career.company = null;
      char.career.salary = 0; char.career.yearsAtJob = 0; char.career.trackId = null;
      char.career.coworkers = [];
    }
    if (s === 'promote') {
      char.career.salary = Math.floor(char.career.salary * 1.25);
      char.career.level += 1;
    }
    if (s === 'retire') {
      char.isRetired = true; char.career.employed = false;
      char.career.salary = Math.floor(char.career.salary * 0.4);
    }
    if (s === 'graduate') {
      char.education.inUniversity = false;
      char.education.degree = char.education.degree || 'General Studies';
    }
    if (s === 'partner_dies' && char.relationships.partner) {
      char.relationships.exPartners.push({ ...char.relationships.partner, deceased: true });
      char.relationships.partner = null; char.relationships.married = false;
    }
    if (s === 'addiction_risk' && chance(25) && !char.health.addictions.includes('Drugs')) {
      char.health.addictions.push('Drugs');
      addToHistory(char, { type: 'bad', icon: '💊', message: 'You developed a drug addiction.' });
    }
    if (s === 'meet_friend' && chance(60)) addRandomFriend(char);
  } catch (err) { console.warn(err); }
}

function addRandomFriend(char) {
  const g = chance(50) ? 'male' : 'female';
  char.relationships.friends.push({ ...randomName(g), gender: g, closeness: rand(30, 70), alive: true });
}

function ageParents(char) {
  const a = char.age;
  if (char.family.motherAlive && chance(a > 70 ? 8 : a > 60 ? 3 : 0.5)) {
    char.family.motherAlive = false;
    addToHistory(char, { type: 'bad', icon: '😢', message: 'Your mother passed away. Heartbreaking loss.' });
    char.stats.happiness = clamp(char.stats.happiness - 20);
  }
  if (char.family.fatherAlive && chance(a > 70 ? 9 : a > 60 ? 4 : 0.8)) {
    char.family.fatherAlive = false;
    addToHistory(char, { type: 'bad', icon: '😢', message: 'Your father passed away. Heartbreaking loss.' });
    char.stats.happiness = clamp(char.stats.happiness - 18);
  }
}

function checkForDeath(char) {
  const a = char.age;
  const h = char.stats.health;
  let dc = 0;
  if      (a < 5)  dc = 0.2;
  else if (a < 20) dc = 0.3;
  else if (a < 40) dc = 0.4;
  else if (a < 50) dc = 0.8;
  else if (a < 60) dc = 1.5;
  else if (a < 70) dc = 3;
  else if (a < 80) dc = 6;
  else if (a < 90) dc = 12;
  else             dc = 25;
  if      (h < 10) dc *= 5;
  else if (h < 25) dc *= 3;
  else if (h < 40) dc *= 1.8;
  else if (h > 80) dc *= 0.5;
  dc += (char.health?.conditions?.length || 0) * 0.5;
  if (!chance(dc)) return null;
  const causes = [];
  if      (a < 5)  causes.push('a sudden illness','an accident at home');
  else if (a < 30) causes.push('an accident','a sudden illness','an overdose');
  else if (a < 50) causes.push('a heart attack','cancer','an accident');
  else if (a < 70) causes.push('heart disease','cancer','stroke','complications from diabetes');
  else             causes.push('old age','heart failure','pneumonia','natural causes');
  if (char.health?.addictions?.length > 0) causes.push('substance-related complications');
  if (char.health?.inPrison) causes.push('violence in prison');
  return { cause: pick(causes) };
}

function addToHistory(char, e) {
  if (!char.history) char.history = [];
  char.history.push({ id: uuidv4(), age: char.age, ...e });
}

// ─── Apply Choice ─────────────────────────────────────────────────────────────
export function applyChoice(character, eventId, choiceIndex) {
  try {
    const char = JSON.parse(JSON.stringify(character));
    const pending = char.pendingChoices || [];
    const event = pending.find(e => e.id === eventId);
    if (!event) return char;
    applyEventEffects(char, event, choiceIndex);
    addToHistory(char, {
      type: event.type, icon: event.icon, message: event.message,
      resultMessage: event.resultMessage,
      choiceMade: event.choices?.[choiceIndex]?.text,
    });
    char.pendingChoices = pending.filter(e => e.id !== eventId);
    return char;
  } catch (err) { console.error(err); return character; }
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
      return { character: char, result: 'no_money', message: `You can't afford this (${activity.cost.toLocaleString()}).` };
    }
    if (activity.cost) char.finances.cash -= activity.cost;
    if (activity.effects) {
      Object.entries(activity.effects).forEach(([k, range]) => {
        const v = applyRange(range);
        if (['happiness','health','smarts','looks'].includes(k)) {
          char.stats[k] = clamp(char.stats[k] + v);
        }
      });
    }
    if (activity.special) handleSpecialEffects(char, { special: activity.special }, null);
    if (!char.activitiesUsedThisTurn) char.activitiesUsedThisTurn = [];
    char.activitiesUsedThisTurn.push(activity.id);
    addToHistory(char, { type: 'neutral', icon: activity.icon, message: `You did "${activity.name}".` });
    return { character: char, result: 'success', message: `${activity.name} done!` };
  } catch (err) { return { character, result: 'error', message: 'Error.' }; }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HEALTH SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

export function visitDoctor(character) {
  try {
    const char = JSON.parse(JSON.stringify(character));
    const cost = 200;
    if (char.finances.cash < cost) return { character: char, result: 'no_money', message: "You can't afford a doctor visit." };
    char.finances.cash -= cost;
    let roll = Math.random() * 100, accum = 0, finding = DOCTOR_FINDINGS[0];
    for (const f of DOCTOR_FINDINGS) { accum += f.chance; if (roll <= accum) { finding = f; break; } }
    char.stats.health = clamp(char.stats.health + (finding.healthGain || 0));
    let msg = finding.message;
    if (finding.id === 'major' || finding.id === 'concerning') {
      const possibleConds = MEDICAL_CONDITIONS.filter(c => ['serious','critical'].includes(c.severity));
      const newCond = pick(possibleConds);
      if (newCond && !char.health.conditions.find(c => (c.name || c) === newCond.name)) {
        char.health.conditions.push({ name: newCond.name, since: char.age, treatment: null });
        msg += ` Diagnosed: ${newCond.name}.`;
      }
    }
    addToHistory(char, { type: finding.id === 'all_clear' ? 'good' : 'neutral', icon: '🏥', message: msg });
    return { character: char, result: 'success', message: msg };
  } catch (err) { return { character, result: 'error', message: 'Error visiting doctor.' }; }
}

export function visitDentist(character) {
  const char = JSON.parse(JSON.stringify(character));
  const cost = 250;
  if (char.finances.cash < cost) return { character: char, result: 'no_money', message: "You can't afford a dentist visit." };
  char.finances.cash -= cost;
  char.stats.health = clamp(char.stats.health + rand(2, 5));
  char.stats.looks = clamp(char.stats.looks + rand(1, 3));
  const msg = 'Your teeth are clean and cavity-free!';
  addToHistory(char, { type: 'good', icon: '🦷', message: msg });
  return { character: char, result: 'success', message: msg };
}

export function visitOptometrist(character) {
  const char = JSON.parse(JSON.stringify(character));
  const cost = 180;
  if (char.finances.cash < cost) return { character: char, result: 'no_money', message: "You can't afford eye care." };
  char.finances.cash -= cost;
  let msg = 'Your vision is perfect!';
  if (char.age > 35 && chance(40) && !char.appearance.glasses) {
    char.appearance.glasses = true;
    msg = 'You need glasses now. Welcome to adulthood.';
    char.stats.smarts = clamp(char.stats.smarts + 1);
  } else if (char.appearance.glasses) {
    msg = 'New prescription. Vision crystal clear.';
    char.stats.smarts = clamp(char.stats.smarts + 1);
  }
  addToHistory(char, { type: 'neutral', icon: '👁️', message: msg });
  return { character: char, result: 'success', message: msg };
}

export function startTherapy(character, therapyId) {
  const char = JSON.parse(JSON.stringify(character));
  const therapy = THERAPY_TYPES.find(t => t.id === therapyId);
  if (!therapy) return { character: char, result: 'invalid', message: 'Invalid therapy type.' };
  if (char.finances.cash < therapy.costPerYear) {
    return { character: char, result: 'no_money', message: `You can't afford this therapy ($${therapy.costPerYear}/yr).` };
  }
  char.mentalHealth.inTherapy = true;
  char.mentalHealth.therapyType = therapyId;
  char.mentalHealth.therapyYears = 0;
  const msg = `Started ${therapy.name}. You will be charged annually.`;
  addToHistory(char, { type: 'good', icon: '🛋️', message: msg });
  return { character: char, result: 'success', message: msg };
}

export function stopTherapy(character) {
  const char = JSON.parse(JSON.stringify(character));
  char.mentalHealth.inTherapy = false;
  char.mentalHealth.therapyType = null;
  return { character: char, result: 'success', message: 'You stopped therapy.' };
}

export function startMedication(character, medId) {
  const char = JSON.parse(JSON.stringify(character));
  const med = MEDICATIONS.find(m => m.id === medId);
  if (!med) return { character: char, result: 'invalid', message: 'Invalid medication.' };
  char.mentalHealth.onMedication = true;
  char.mentalHealth.medication = medId;
  const msg = `You started ${med.name}.`;
  addToHistory(char, { type: 'neutral', icon: '💊', message: msg });
  return { character: char, result: 'success', message: msg };
}

export function goToGym(character, workoutId) {
  const char = JSON.parse(JSON.stringify(character));
  const workout = GYM_WORKOUTS.find(w => w.id === workoutId);
  if (!workout) return { character: char, result: 'invalid', message: 'Invalid workout.' };
  if (char.age < 13) return { character: char, result: 'too_young', message: 'You\'re too young for the gym.' };
  if (workout.cost && char.finances.cash < workout.cost) return { character: char, result: 'no_money', message: 'Not enough cash.' };
  if (workout.cost) char.finances.cash -= workout.cost;
  Object.entries(workout.effects).forEach(([k, v]) => {
    if (['happiness','health','smarts','looks'].includes(k)) char.stats[k] = clamp(char.stats[k] + applyRange(v));
  });
  if (!char.gym) char.gym = { hasMembership: false, workoutsThisYear: 0, fitnessLevel: 50 };
  char.gym.workoutsThisYear = (char.gym.workoutsThisYear || 0) + 1;
  char.gym.fitnessLevel = clamp((char.gym.fitnessLevel || 50) + 2);
  const msg = `You did a ${workout.name} session.`;
  addToHistory(char, { type: 'good', icon: workout.icon, message: msg });
  return { character: char, result: 'success', message: msg };
}

export function buyGymMembership(character) {
  const char = JSON.parse(JSON.stringify(character));
  if (char.gym?.hasMembership) return { character: char, result: 'already', message: 'You already have a membership!' };
  if (char.finances.cash < 600) return { character: char, result: 'no_money', message: "Can't afford gym membership ($600/yr)." };
  char.finances.cash -= 600;
  if (!char.gym) char.gym = { hasMembership: true, workoutsThisYear: 0, fitnessLevel: 50 };
  char.gym.hasMembership = true;
  return { character: char, result: 'success', message: 'Welcome to the gym! 💪' };
}

export function getPlasticSurgery(character, surgeryId) {
  const char = JSON.parse(JSON.stringify(character));
  const surg = PLASTIC_SURGERIES.find(s => s.id === surgeryId);
  if (!surg) return { character: char, result: 'invalid', message: 'Invalid surgery.' };
  if (char.age < (surg.minAge || 18)) return { character: char, result: 'too_young', message: `Must be ${surg.minAge}+ for this surgery.` };
  if (surg.genderReq && char.gender !== surg.genderReq) return { character: char, result: 'gender', message: 'Not for your body type.' };
  if (char.finances.cash < surg.cost) return { character: char, result: 'no_money', message: `Can't afford ($${surg.cost.toLocaleString()}).` };
  char.finances.cash -= surg.cost;
  if (chance(surg.complicationChance)) {
    char.stats.looks = clamp(char.stats.looks - rand(3, 8));
    char.stats.health = clamp(char.stats.health - rand(5, 12));
    const msg = `Your ${surg.name} had complications. Recovery is rough.`;
    addToHistory(char, { type: 'bad', icon: '🩹', message: msg });
    return { character: char, result: 'complication', message: msg };
  }
  char.stats.looks = clamp(char.stats.looks + surg.looksBoost);
  if (surg.special === 'remove_glasses') char.appearance.glasses = false;
  const msg = `Your ${surg.name} was successful! +${surg.looksBoost} Looks.`;
  addToHistory(char, { type: 'good', icon: surg.icon, message: msg });
  return { character: char, result: 'success', message: msg };
}

export function goToRehab(character, programId) {
  const char = JSON.parse(JSON.stringify(character));
  const program = REHAB_PROGRAMS.find(p => p.id === programId);
  if (!program) return { character: char, result: 'invalid', message: 'Invalid rehab program.' };
  if (!char.health.addictions || char.health.addictions.length === 0) {
    return { character: char, result: 'no_addiction', message: 'You don\'t have any addictions.' };
  }
  if (char.finances.cash < program.cost) return { character: char, result: 'no_money', message: `Can't afford rehab ($${program.cost.toLocaleString()}).` };
  char.finances.cash -= program.cost;
  if (chance(program.successRate)) {
    char.health.addictions = [];
    char.stats.happiness = clamp(char.stats.happiness + 15);
    char.stats.health = clamp(char.stats.health + 12);
    const msg = `${program.name} successful — you\'re clean! 🌟`;
    addToHistory(char, { type: 'milestone', icon: '🌟', message: msg });
    return { character: char, result: 'success', message: msg };
  } else {
    char.stats.happiness = clamp(char.stats.happiness - 10);
    const msg = 'Rehab didn\'t take. You relapsed within months.';
    addToHistory(char, { type: 'bad', icon: '💊', message: msg });
    return { character: char, result: 'relapsed', message: msg };
  }
}

export function treatCondition(character, conditionName, treatmentId) {
  const char = JSON.parse(JSON.stringify(character));
  const condData = MEDICAL_CONDITIONS.find(c => c.name === conditionName);
  if (!condData) return { character: char, result: 'invalid', message: 'Unknown condition.' };
  const treat = condData.treatments.find(t => t.id === treatmentId);
  if (!treat) return { character: char, result: 'invalid', message: 'Unknown treatment.' };
  if (char.finances.cash < treat.cost) return { character: char, result: 'no_money', message: `Can't afford ($${treat.cost.toLocaleString()}).` };
  char.finances.cash -= treat.cost;
  if (chance(treat.successRate)) {
    char.stats.health = clamp(char.stats.health + treat.restore);
    if (!treat.managed) {
      char.health.conditions = char.health.conditions.filter(c => (c.name || c) !== conditionName);
    }
    const msg = `${treat.name} successful — ${conditionName} ${treat.managed ? 'is now managed' : 'cured'}!`;
    addToHistory(char, { type: 'good', icon: '💚', message: msg });
    return { character: char, result: 'success', message: msg };
  } else {
    char.stats.health = clamp(char.stats.health - 5);
    const msg = `${treat.name} didn\'t work as hoped.`;
    addToHistory(char, { type: 'bad', icon: '🩹', message: msg });
    return { character: char, result: 'failed', message: msg };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CRIME SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

export function commitCrime(character, crimeId) {
  const char = JSON.parse(JSON.stringify(character));
  const crime = CRIMES.find(c => c.id === crimeId);
  if (!crime) return { character: char, result: 'invalid', message: 'Invalid crime.' };
  if (char.age < crime.minAge) return { character: char, result: 'too_young', message: `Must be ${crime.minAge}+.` };
  if (crime.reqHealth && char.stats.health < crime.reqHealth) return { character: char, result: 'too_weak', message: 'Not strong enough.' };
  if (crime.reqSmarts && char.stats.smarts < crime.reqSmarts) return { character: char, result: 'too_dumb', message: 'Not smart enough.' };
  if (crime.reqEmployed && !char.career.employed) return { character: char, result: 'unemployed', message: 'Need a job for this.' };
  if (char.health.inPrison) return { character: char, result: 'in_prison', message: 'You are already in prison!' };

  // Modify success rate based on stats
  let successRate = crime.baseSuccess;
  successRate += (char.stats.smarts - 50) * 0.2;
  if (crime.cat === 'violent') successRate += (char.stats.health - 50) * 0.15;
  if (crime.cat === 'white_collar') successRate += (char.stats.smarts - 50) * 0.3;
  successRate = Math.max(5, Math.min(95, successRate));

  if (chance(successRate)) {
    const payout = applyRange(crime.payout);
    char.finances.cash += payout;
    char.karma = clamp((char.karma || 50) + crime.karma);
    char.criminalRecord.push({ crime: crime.name, year: char.birthYear + char.age, caught: false });
    const msg = payout > 0
      ? `${crime.name} succeeded! You got away with $${payout.toLocaleString()}.`
      : `${crime.name} succeeded. No one knows.`;
    addToHistory(char, { type: 'crime', icon: crime.icon, message: msg });
    return { character: char, result: 'success', payout, message: msg };
  } else {
    // Caught!
    const sentence = applyRange(crime.jail);
    char.health.inPrison = true;
    char.health.prisonYearsLeft = sentence;
    char.health.prisonSentenceTotal = sentence;
    char.career.employed = false;
    char.career.title = null;
    char.career.salary = 0;
    char.career.coworkers = [];
    char.karma = clamp((char.karma || 50) + crime.karma);
    char.criminalRecord.push({ crime: crime.name, year: char.birthYear + char.age, caught: true, sentence });
    char.stats.happiness = clamp(char.stats.happiness - 25);
    const msg = `You were caught! Sentenced to ${sentence} year${sentence === 1 ? '' : 's'} in prison.`;
    addToHistory(char, { type: 'bad', icon: '🚨', message: msg });
    return { character: char, result: 'caught', sentence, message: msg };
  }
}

export function doPrisonActivity(character, activityId) {
  const char = JSON.parse(JSON.stringify(character));
  if (!char.health.inPrison) return { character: char, result: 'not_in_prison', message: 'You are not in prison.' };
  const act = PRISON_ACTIVITIES.find(a => a.id === activityId);
  if (!act) return { character: char, result: 'invalid', message: 'Invalid activity.' };

  if (act.isEscape) {
    if (chance(15)) {
      char.health.inPrison = false;
      char.health.prisonYearsLeft = 0;
      char.stats.happiness = clamp(char.stats.happiness + 20);
      const msg = 'You escaped from prison! 🏃 Live as a fugitive — and watch your back.';
      addToHistory(char, { type: 'crime', icon: '🏃', message: msg });
      return { character: char, result: 'escaped', message: msg };
    } else {
      char.health.prisonYearsLeft += rand(2, 8);
      char.health.prisonSentenceTotal += rand(2, 8);
      char.stats.health = clamp(char.stats.health - rand(5, 15));
      const msg = 'Escape attempt failed. Sentence extended and you got beaten by guards.';
      addToHistory(char, { type: 'bad', icon: '⛓️', message: msg });
      return { character: char, result: 'failed_escape', message: msg };
    }
  }

  if (act.isAppeal) {
    if (char.finances.cash < act.cost) return { character: char, result: 'no_money', message: 'Can\'t afford the appeal.' };
    char.finances.cash -= act.cost;
    if (chance(35)) {
      const cut = Math.floor(char.health.prisonYearsLeft * 0.5);
      char.health.prisonYearsLeft -= cut;
      const msg = `Appeal granted! Sentence cut by ${cut} years.`;
      addToHistory(char, { type: 'good', icon: '⚖️', message: msg });
      return { character: char, result: 'success', message: msg };
    } else {
      const msg = 'Appeal denied. You serve the full sentence.';
      addToHistory(char, { type: 'bad', icon: '⚖️', message: msg });
      return { character: char, result: 'denied', message: msg };
    }
  }

  if (act.cost && char.finances.cash < act.cost) return { character: char, result: 'no_money', message: 'Not enough money.' };
  if (act.cost) char.finances.cash -= act.cost;
  if (act.effects) {
    Object.entries(act.effects).forEach(([k, v]) => {
      if (['happiness','health','smarts','looks'].includes(k)) char.stats[k] = clamp(char.stats[k] + applyRange(v));
    });
  }
  if (act.yearReduction && char.health.prisonYearsLeft > 1) {
    char.health.prisonYearsLeft = Math.max(1, char.health.prisonYearsLeft - act.yearReduction);
  }
  if (act.karmaHit) char.karma = clamp((char.karma || 50) + act.karmaHit);
  const msg = `In prison: ${act.name}.`;
  addToHistory(char, { type: 'neutral', icon: act.icon, message: msg });
  return { character: char, result: 'success', message: msg };
}

export function hireLawyer(character, tierId) {
  const char = JSON.parse(JSON.stringify(character));
  if (!char.health.inPrison) return { character: char, result: 'not_needed', message: 'You\'re not in prison.' };
  const tier = LAWYER_TIERS.find(t => t.id === tierId);
  if (!tier) return { character: char, result: 'invalid', message: 'Invalid lawyer.' };
  if (char.finances.cash < tier.cost) return { character: char, result: 'no_money', message: `Can't afford ${tier.name}.` };
  char.finances.cash -= tier.cost;
  const reduction = Math.floor(char.health.prisonYearsLeft * tier.sentenceRedux);
  char.health.prisonYearsLeft = Math.max(1, char.health.prisonYearsLeft - reduction);
  const msg = `${tier.name} reduced your sentence by ${reduction} years.`;
  addToHistory(char, { type: 'good', icon: tier.icon, message: msg });
  return { character: char, result: 'success', message: msg };
}

// ═══════════════════════════════════════════════════════════════════════════════
// DATING & RELATIONSHIPS
// ═══════════════════════════════════════════════════════════════════════════════

export function findPartner(character, locationId) {
  const char = JSON.parse(JSON.stringify(character));
  const loc = DATING_LOCATIONS.find(l => l.id === locationId);
  if (!loc) return { character: char, result: 'invalid', message: 'Invalid location.' };
  if (char.age < loc.minAge) return { character: char, result: 'too_young', message: `Must be ${loc.minAge}+.` };
  if (char.relationships.partner) return { character: char, result: 'has_partner', message: 'You\'re already in a relationship!' };
  if (loc.reqEmployed && !char.career.employed) return { character: char, result: 'unemployed', message: 'You need a job.' };
  if (loc.reqInSchool && !char.education.inSchool && !char.education.inUniversity) return { character: char, result: 'not_school', message: 'You need to be in school.' };
  if (loc.cost && char.finances.cash < loc.cost) return { character: char, result: 'no_money', message: 'Not enough cash.' };
  if (loc.cost) char.finances.cash -= loc.cost;

  let chanceToMatch = loc.baseChance;
  chanceToMatch += (char.stats.looks - 50) * 0.5;
  chanceToMatch += (char.stats.happiness - 50) * 0.2;
  chanceToMatch = Math.max(5, Math.min(95, chanceToMatch));

  if (chance(chanceToMatch)) {
    const g = char.gender === 'male' ? (chance(85) ? 'female' : 'male') : (chance(85) ? 'male' : 'female');
    const partner = {
      ...randomName(g), gender: g,
      love: rand(40, 70),
      attraction: rand(40, 80),
      smarts: rand(30, 90),
      looks: rand(30, 90),
      meetLocation: loc.name,
    };
    char.relationships.partner = partner;
    char.stats.happiness = clamp(char.stats.happiness + 12);
    const msg = `You met ${partner.full} at ${loc.name}! 💕`;
    addToHistory(char, { type: 'milestone', icon: '💕', message: msg });
    return { character: char, result: 'matched', message: msg, partner };
  } else {
    char.stats.happiness = clamp(char.stats.happiness - 3);
    const msg = `No luck at ${loc.name}. Maybe next time.`;
    addToHistory(char, { type: 'neutral', icon: '🤷', message: msg });
    return { character: char, result: 'no_match', message: msg };
  }
}

export function goOnDate(character, dateId) {
  const char = JSON.parse(JSON.stringify(character));
  const date = DATE_ACTIVITIES.find(d => d.id === dateId);
  if (!date) return { character: char, result: 'invalid', message: 'Invalid date.' };
  if (!char.relationships.partner) return { character: char, result: 'no_partner', message: 'You need a partner.' };
  if (date.cost && char.finances.cash < date.cost) return { character: char, result: 'no_money', message: 'Not enough money.' };
  if (date.cost) char.finances.cash -= date.cost;
  const loveBoost = applyRange(date.loveGain);
  const happinessBoost = applyRange(date.happinessGain);
  char.relationships.partner.love = Math.min(100, (char.relationships.partner.love || 50) + loveBoost);
  char.stats.happiness = clamp(char.stats.happiness + happinessBoost);
  char.relationships.datesThisYear = (char.relationships.datesThisYear || 0) + 1;
  const msg = `${date.name} with ${char.relationships.partner.full || 'your partner'}: love +${loveBoost}!`;
  addToHistory(char, { type: 'good', icon: date.icon, message: msg });
  return { character: char, result: 'success', message: msg };
}

export function tryAffair(character) {
  const char = JSON.parse(JSON.stringify(character));
  if (!char.relationships.married && !char.relationships.engaged) {
    return { character: char, result: 'not_married', message: "You're not in a serious relationship." };
  }
  // 30% chance of getting caught
  if (chance(30)) {
    if (char.relationships.partner) char.relationships.exPartners.push(char.relationships.partner);
    char.relationships.partner = null;
    char.relationships.married = false;
    char.relationships.engaged = false;
    char.stats.happiness = clamp(char.stats.happiness - 25);
    char.karma = clamp((char.karma || 50) - 15);
    const msg = 'Your affair was discovered. Your partner left you.';
    addToHistory(char, { type: 'bad', icon: '💔', message: msg });
    return { character: char, result: 'caught', message: msg };
  } else {
    char.stats.happiness = clamp(char.stats.happiness + rand(3, 10));
    char.karma = clamp((char.karma || 50) - 8);
    const msg = 'You had a discreet affair. No one knows... yet.';
    addToHistory(char, { type: 'neutral', icon: '🤫', message: msg });
    return { character: char, result: 'success', message: msg };
  }
}

export function spendTimeWithPartner(character) {
  const char = JSON.parse(JSON.stringify(character));
  if (!char.relationships.partner) return { character: char, result: 'no_partner', message: "No partner." };
  const gain = rand(5, 15);
  char.relationships.partner.love = Math.min(100, (char.relationships.partner.love || 50) + gain);
  char.stats.happiness = clamp(char.stats.happiness + rand(5, 12));
  const msg = `Quality time with ${char.relationships.partner.full}. Love +${gain}.`;
  addToHistory(char, { type: 'good', icon: '💕', message: msg });
  return { character: char, result: 'success', message: msg };
}

export function proposeToPartner(character) {
  const char = JSON.parse(JSON.stringify(character));
  if (!char.relationships.partner) return { character: char, result: 'no_partner', message: "No partner." };
  if (char.relationships.engaged || char.relationships.married) return { character: char, result: 'already', message: 'Already engaged or married!' };
  const love = char.relationships.partner.love || 50;
  if (love >= 65) {
    char.relationships.engaged = true;
    char.stats.happiness = clamp(char.stats.happiness + 25);
    char.finances.cash -= 5000; // ring
    const msg = `${char.relationships.partner.full} said YES! 💍`;
    addToHistory(char, { type: 'milestone', icon: '💍', message: msg });
    return { character: char, result: 'accepted', message: msg };
  } else {
    char.stats.happiness = clamp(char.stats.happiness - 15);
    const msg = "They said no. Painful.";
    addToHistory(char, { type: 'bad', icon: '💔', message: msg });
    return { character: char, result: 'rejected', message: msg };
  }
}

export function getMarried(character) {
  const char = JSON.parse(JSON.stringify(character));
  if (!char.relationships.engaged) return { character: char, result: 'not_engaged', message: "You're not engaged." };
  if (char.finances.cash < 15000) return { character: char, result: 'no_money', message: 'Wedding costs $15,000+.' };
  char.finances.cash -= 15000;
  char.relationships.married = true;
  char.relationships.engaged = false;
  char.stats.happiness = clamp(char.stats.happiness + 30);
  const msg = `You married ${char.relationships.partner.full}! 👰🤵`;
  addToHistory(char, { type: 'milestone', icon: '👰', message: msg });
  return { character: char, result: 'success', message: msg };
}

export function breakUpWithPartner(character) {
  const char = JSON.parse(JSON.stringify(character));
  if (!char.relationships.partner) return { character: char, result: 'no_partner', message: "No partner." };
  const name = char.relationships.partner.full;
  char.relationships.exPartners.push(char.relationships.partner);
  char.relationships.partner = null;
  char.relationships.engaged = false;
  char.relationships.married = false;
  char.stats.happiness = clamp(char.stats.happiness - rand(10, 20));
  const msg = `You broke up with ${name}.`;
  addToHistory(char, { type: 'bad', icon: '💔', message: msg });
  return { character: char, result: 'success', message: msg };
}

export function tryHaveKid(character) {
  const char = JSON.parse(JSON.stringify(character));
  if (!char.relationships.partner) return { character: char, result: 'no_partner', message: 'You need a partner.' };
  if (char.age < 18) return { character: char, result: 'too_young', message: 'Too young.' };
  if (char.age > 50 && char.gender === 'female') return { character: char, result: 'too_old', message: 'Too old to conceive naturally.' };
  if (chance(60)) {
    const g = chance(50) ? 'male' : 'female';
    const baby = { ...randomName(g), gender: g, age: 0, alive: true, relationship: 80 };
    char.relationships.children.push(baby);
    char.stats.happiness = clamp(char.stats.happiness + 25);
    char.finances.cash -= 5000;
    const msg = `You had a ${g === 'male' ? 'son' : 'daughter'} named ${baby.full}! 👶`;
    addToHistory(char, { type: 'milestone', icon: '🍼', message: msg });
    return { character: char, result: 'success', message: msg };
  } else {
    const msg = 'No luck this time. Try again.';
    return { character: char, result: 'no_baby', message: msg };
  }
}

export function adoptChild(character) {
  const char = JSON.parse(JSON.stringify(character));
  if (char.age < 21) return { character: char, result: 'too_young', message: 'Must be 21+.' };
  if (char.finances.cash < 30000) return { character: char, result: 'no_money', message: 'Adoption costs ~$30,000.' };
  char.finances.cash -= 30000;
  const g = chance(50) ? 'male' : 'female';
  const age = rand(0, 8);
  const child = { ...randomName(g), gender: g, age, alive: true, relationship: 70, adopted: true };
  char.relationships.children.push(child);
  char.stats.happiness = clamp(char.stats.happiness + 22);
  char.karma = clamp((char.karma || 50) + 10);
  const msg = `You adopted ${child.full}! 💕`;
  addToHistory(char, { type: 'milestone', icon: '🤱', message: msg });
  return { character: char, result: 'success', message: msg };
}

export function hangOutWithFriend(character, friendIndex) {
  const char = JSON.parse(JSON.stringify(character));
  const friend = char.relationships.friends[friendIndex];
  if (!friend) return { character: char, result: 'no_friend', message: 'Friend not found.' };
  const gain = rand(5, 15);
  friend.closeness = Math.min(100, (friend.closeness || 30) + gain);
  char.stats.happiness = clamp(char.stats.happiness + rand(5, 10));
  const msg = `Great time hanging with ${friend.full}!`;
  addToHistory(char, { type: 'good', icon: '🎉', message: msg });
  return { character: char, result: 'success', message: msg };
}

// ═══════════════════════════════════════════════════════════════════════════════
// FAMILY INTERACTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function interactWithParent(character, parent, action) {
  const char = JSON.parse(JSON.stringify(character));
  const parentKey = parent === 'mother' ? 'motherRelationship' : 'fatherRelationship';
  const parentAlive = parent === 'mother' ? char.family.motherAlive : char.family.fatherAlive;
  if (!parentAlive) return { character: char, result: 'deceased', message: 'They have passed away.' };
  const name = parent === 'mother' ? char.family.motherName : char.family.fatherName;
  let msg = '';
  let relChange = 0;

  switch (action) {
    case 'compliment':
      relChange = rand(5, 12);
      char.stats.happiness = clamp(char.stats.happiness + 3);
      msg = `You complimented ${name}. They appreciated it.`;
      break;
    case 'spend_time':
      relChange = rand(8, 15);
      char.stats.happiness = clamp(char.stats.happiness + 8);
      msg = `You spent the afternoon with ${name}.`;
      break;
    case 'argue':
      relChange = -rand(10, 20);
      char.stats.happiness = clamp(char.stats.happiness - 8);
      msg = `You had a big argument with ${name}.`;
      break;
    case 'insult':
      relChange = -rand(15, 25);
      char.stats.happiness = clamp(char.stats.happiness - 10);
      msg = `You insulted ${name}. Now they\'re hurt.`;
      break;
    case 'ask_money':
      const currentRel = char.family[parentKey] || 50;
      if (currentRel >= 60 && chance(70)) {
        const amount = rand(100, 1000);
        char.finances.cash += amount;
        relChange = -2;
        msg = `${name} gave you $${amount}.`;
      } else {
        relChange = -5;
        msg = `${name} refused to give you money.`;
      }
      break;
    case 'gift':
      if (char.finances.cash < 100) return { character: char, result: 'no_money', message: 'Not enough cash for a gift.' };
      char.finances.cash -= 100;
      relChange = rand(8, 18);
      msg = `You gave ${name} a thoughtful gift.`;
      break;
  }
  char.family[parentKey] = clamp((char.family[parentKey] || 50) + relChange);
  addToHistory(char, { type: relChange > 0 ? 'good' : 'neutral', icon: '👨‍👩‍👧', message: msg });
  return { character: char, result: 'success', message: msg };
}

export function interactWithSibling(character, siblingIndex, action) {
  const char = JSON.parse(JSON.stringify(character));
  const sib = char.family.siblings?.[siblingIndex];
  if (!sib) return { character: char, result: 'no_sibling', message: 'Sibling not found.' };
  if (!sib.alive) return { character: char, result: 'deceased', message: 'They have passed away.' };
  let relChange = 0, msg = '';
  switch (action) {
    case 'bond':       relChange = rand(8, 15); msg = `Bonded with ${sib.full}.`; break;
    case 'fight':      relChange = -rand(10, 20); char.stats.health = clamp(char.stats.health - rand(2, 6)); msg = `Fought with ${sib.full}.`; break;
    case 'gift':
      if (char.finances.cash < 50) return { character: char, result: 'no_money', message: 'Not enough money.' };
      char.finances.cash -= 50; relChange = rand(8, 15);
      msg = `Gave ${sib.full} a gift.`;
      break;
    case 'prank':      relChange = -rand(3, 10); msg = `Pranked ${sib.full}.`; break;
  }
  sib.relationship = clamp((sib.relationship || 50) + relChange);
  addToHistory(char, { type: relChange > 0 ? 'good' : 'neutral', icon: '👦', message: msg });
  return { character: char, result: 'success', message: msg };
}

export function interactWithChild(character, childIndex, action) {
  const char = JSON.parse(JSON.stringify(character));
  const c = char.relationships.children?.[childIndex];
  if (!c) return { character: char, result: 'no_child', message: 'Child not found.' };
  if (!c.alive) return { character: char, result: 'deceased', message: 'They have passed.' };
  let relChange = 0, msg = '';
  switch (action) {
    case 'play':       relChange = rand(5, 12); char.stats.happiness = clamp(char.stats.happiness + 5); msg = `Played with ${c.full}.`; break;
    case 'help_hw':    relChange = rand(6, 14); msg = `Helped ${c.full} with homework.`; break;
    case 'discipline': relChange = -rand(3, 10); msg = `Disciplined ${c.full}.`; break;
    case 'gift':
      if (char.finances.cash < 100) return { character: char, result: 'no_money', message: 'Not enough money.' };
      char.finances.cash -= 100; relChange = rand(10, 18);
      msg = `Gave ${c.full} a special gift.`;
      break;
    case 'spoil':
      if (char.finances.cash < 500) return { character: char, result: 'no_money', message: 'Not enough money.' };
      char.finances.cash -= 500; relChange = rand(8, 15);
      msg = `Spoiled ${c.full}. They love it.`;
      break;
  }
  c.relationship = clamp((c.relationship || 80) + relChange);
  addToHistory(char, { type: relChange > 0 ? 'good' : 'neutral', icon: '👶', message: msg });
  return { character: char, result: 'success', message: msg };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CAREER SYSTEM (extended)
// ═══════════════════════════════════════════════════════════════════════════════

export function applyForJob(character, track) {
  try {
    const char = JSON.parse(JSON.stringify(character));
    const score = (char.stats.smarts * 0.4 + char.stats.looks * 0.2 + rand(0, 40));
    if (score < 45) {
      addToHistory(char, { type: 'bad', icon: '💼', message: `You interviewed for ${track.name} but didn't get hired.` });
      return { character: char, result: 'failed', message: "Didn't get the job." };
    }
    const company = generateCompanyName(track.id);
    char.career = {
      ...char.career,
      employed: true, trackId: track.id, level: 0,
      title: track.levels[0].title, company,
      salary: track.levels[0].salary,
      yearsAtJob: 0, performance: rand(50, 75),
      coworkers: generateCoworkers(track.id),
      bossRelationship: rand(40, 70),
      isBusinessOwner: false,
    };
    char.stats.happiness = clamp(char.stats.happiness + 10);
    addToHistory(char, { type: 'milestone', icon: '💼', message: `Hired as ${track.levels[0].title} at ${company}!` });
    return { character: char, result: 'success', message: `Welcome to ${company}!` };
  } catch (err) { return { character, result: 'error', message: 'Error.' }; }
}

function generateCoworkers(trackId) {
  const count = rand(2, 4);
  const out = [];
  const roles = {
    tech: ['Senior Engineer','Designer','Product Manager','Junior Dev'],
    medicine: ['Senior Nurse','Doctor','Resident','Pharmacist'],
    business: ['Account Manager','Director','VP Sales','Analyst'],
    default: ['Coworker','Senior Coworker','Manager','Team Lead'],
  };
  const roleList = roles[trackId] || roles.default;
  for (let i = 0; i < count; i++) {
    const g = chance(50) ? 'male' : 'female';
    out.push({ ...randomName(g), gender: g, role: pick(roleList), relationship: rand(40, 70) });
  }
  return out;
}

function generateCompanyName(trackId) {
  const map = {
    tech:['Google','Meta','TechCorp','ByteWave','NovaSoft','DataForge'],
    medicine:['City Medical','St. Grace Hospital','MedGroup','HealthPlus'],
    law:['Hartwell & Associates','Morrison LLP','Sterling Law'],
    business:['Global Corp','Apex Holdings','Meridian Group','Pioneer Inc'],
    entertainment:['Stellar Studios','Apex Films','Nexus Entertainment'],
    music:['SoundWave Records','Echo Label','Vibe Music Group'],
    sports:['City FC','Titan Athletics','Ironside Sports Club'],
    military:['U.S. Army','U.S. Navy','Air Force'],
    education:['Lincoln High','Westside Academy','Pinewood University'],
    food:['Le Maison','The Iron Chef','Saveur Group'],
    crime:['The Syndicate','Street Crew','Shadow Organization'],
  };
  return pick(map[trackId] || ['Unknown Co.']);
}

export function workHard(character) {
  const char = JSON.parse(JSON.stringify(character));
  if (!char.career.employed) return { character: char, result: 'unemployed', message: "Not employed." };
  const gain = rand(8, 20);
  char.career.performance = clamp(char.career.performance + gain);
  char.career.bossRelationship = clamp(char.career.bossRelationship + rand(2, 6));
  char.stats.happiness = clamp(char.stats.happiness - rand(3, 8));
  char.stats.health = clamp(char.stats.health - rand(1, 4));
  let msg = `Put in extra hours. Performance +${gain}.`;
  let result = 'worked';
  if (chance(20)) {
    const bonus = Math.floor(char.career.salary * char.salaryMult * 0.1);
    char.finances.cash += bonus;
    msg += ` Boss noticed — $${bonus.toLocaleString()} bonus!`;
    result = 'bonus';
  }
  addToHistory(char, { type: 'neutral', icon: '💪', message: msg });
  return { character: char, result, message: msg };
}

export function slackOff(character) {
  const char = JSON.parse(JSON.stringify(character));
  if (!char.career.employed) return { character: char, result: 'unemployed', message: "Not employed." };
  const loss = rand(8, 18);
  char.career.performance = clamp(char.career.performance - loss);
  char.career.bossRelationship = clamp(char.career.bossRelationship - rand(2, 6));
  char.stats.happiness = clamp(char.stats.happiness + rand(3, 8));
  let msg = `Coasted. Performance -${loss}.`;
  let result = 'slacked';
  if (char.career.performance < 20 && chance(40)) {
    char.career.employed = false; char.career.title = null; char.career.salary = 0;
    char.career.trackId = null; char.career.coworkers = [];
    char.stats.happiness = clamp(char.stats.happiness - 15);
    msg = "Boss had enough. You're fired."; result = 'fired';
  }
  addToHistory(char, { type: result === 'fired' ? 'bad' : 'neutral', icon: result === 'fired' ? '📦' : '😴', message: msg });
  return { character: char, result, message: msg };
}

export function askForRaise(character) {
  const char = JSON.parse(JSON.stringify(character));
  if (!char.career.employed) return { character: char, result: 'unemployed', message: "Not employed." };
  if (char.career.performance >= 75 || char.career.bossRelationship >= 75) {
    const amt = Math.floor(char.career.salary * rand(5, 15) / 100);
    char.career.salary += amt;
    char.stats.happiness = clamp(char.stats.happiness + 10);
    const msg = `Raise approved! +$${(amt * char.salaryMult).toLocaleString()}/yr.`;
    addToHistory(char, { type: 'good', icon: '💰', message: msg });
    return { character: char, result: 'success', message: msg };
  } else {
    char.stats.happiness = clamp(char.stats.happiness - 5);
    return { character: char, result: 'denied', message: 'Boss said no.' };
  }
}

export function quitJob(character) {
  const char = JSON.parse(JSON.stringify(character));
  if (!char.career.employed) return { character: char, result: 'unemployed', message: "Not employed." };
  char.career.employed = false;
  char.career.title = null;
  char.career.company = null;
  char.career.salary = 0;
  char.career.trackId = null;
  char.career.coworkers = [];
  char.stats.happiness = clamp(char.stats.happiness + 8);
  const msg = 'You quit your job. Freedom feels good.';
  addToHistory(char, { type: 'neutral', icon: '🚪', message: msg });
  return { character: char, result: 'success', message: msg };
}

export function interactWithCoworker(character, coworkerIndex, action) {
  const char = JSON.parse(JSON.stringify(character));
  const cw = char.career.coworkers?.[coworkerIndex];
  if (!cw) return { character: char, result: 'no_coworker', message: 'No coworker found.' };
  let relChange = 0, msg = '';
  switch (action) {
    case 'befriend': relChange = rand(8, 15); msg = `Bonded with ${cw.full}.`; break;
    case 'gossip':   relChange = rand(3, 8); msg = `Gossiped with ${cw.full}.`; break;
    case 'flirt':    relChange = rand(5, 12); msg = `Flirted with ${cw.full}.`; break;
    case 'insult':   relChange = -rand(10, 20); msg = `Insulted ${cw.full}.`; break;
    case 'report':   relChange = -rand(15, 30); char.career.bossRelationship = clamp(char.career.bossRelationship + 5); msg = `Reported ${cw.full} to HR.`; break;
  }
  cw.relationship = clamp((cw.relationship || 50) + relChange);
  addToHistory(char, { type: relChange > 0 ? 'good' : 'neutral', icon: '👔', message: msg });
  return { character: char, result: 'success', message: msg };
}

export const BUSINESS_TYPES = [
  { id: 'restaurant',   name: 'Restaurant',         icon: '🍴', cost: 80000,   revenuePerYear: [40000, 200000] },
  { id: 'tech_startup', name: 'Tech Startup',       icon: '💻', cost: 50000,   revenuePerYear: [-50000, 500000] },
  { id: 'retail',       name: 'Retail Store',       icon: '🛍️', cost: 100000,  revenuePerYear: [60000, 250000] },
  { id: 'consulting',   name: 'Consulting Firm',    icon: '📊', cost: 30000,   revenuePerYear: [80000, 400000] },
  { id: 'gym',          name: 'Gym / Fitness',      icon: '💪', cost: 200000,  revenuePerYear: [120000, 350000] },
  { id: 'salon',        name: 'Salon / Spa',        icon: '💅', cost: 60000,   revenuePerYear: [50000, 180000] },
  { id: 'bar',          name: 'Bar / Club',         icon: '🍺', cost: 250000,  revenuePerYear: [100000, 500000] },
  { id: 'food_truck',   name: 'Food Truck',         icon: '🚚', cost: 25000,   revenuePerYear: [30000, 120000] },
  { id: 'ecommerce',    name: 'E-Commerce',         icon: '📦', cost: 15000,   revenuePerYear: [20000, 300000] },
];

export function startBusiness(character, businessId) {
  const char = JSON.parse(JSON.stringify(character));
  const biz = BUSINESS_TYPES.find(b => b.id === businessId);
  if (!biz) return { character: char, result: 'invalid', message: 'Invalid business type.' };
  if (char.age < 18) return { character: char, result: 'too_young', message: 'Must be 18+.' };
  if (char.finances.cash < biz.cost) return { character: char, result: 'no_money', message: `Need $${biz.cost.toLocaleString()}.` };
  char.finances.cash -= biz.cost;
  char.career.isBusinessOwner = true;
  char.career.business = {
    name: `${char.firstName}'s ${biz.name}`,
    type: biz.id,
    icon: biz.icon,
    value: biz.cost,
    revenuePerYear: biz.revenuePerYear,
    founded: char.birthYear + char.age,
    totalProfit: 0,
  };
  char.stats.happiness = clamp(char.stats.happiness + 15);
  const msg = `You founded ${char.career.business.name}!`;
  addToHistory(char, { type: 'milestone', icon: biz.icon, message: msg });
  return { character: char, result: 'success', message: msg };
}

export function sellBusiness(character) {
  const char = JSON.parse(JSON.stringify(character));
  if (!char.career.isBusinessOwner || !char.career.business) return { character: char, result: 'no_business', message: 'No business to sell.' };
  const value = char.career.business.value;
  char.finances.cash += value;
  const name = char.career.business.name;
  char.career.business = null;
  char.career.isBusinessOwner = false;
  const msg = `Sold ${name} for $${value.toLocaleString()}.`;
  addToHistory(char, { type: 'good', icon: '💰', message: msg });
  return { character: char, result: 'success', message: msg };
}

// ═══════════════════════════════════════════════════════════════════════════════
// FINANCIAL SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

export function takePersonalLoan(character, amount, years = 5) {
  const char = JSON.parse(JSON.stringify(character));
  if (amount < 1000 || amount > 200000) return { character: char, result: 'invalid_amount', message: 'Invalid amount.' };
  // Bank checks creditworthiness
  if (char.stats.smarts < 30 && char.career.salary === 0) {
    return { character: char, result: 'denied', message: 'Loan denied — insufficient credit.' };
  }
  const rate = char.career.salary > 80000 ? 0.06 : char.career.salary > 30000 ? 0.10 : 0.15;
  const monthlyPayment = Math.ceil((amount * (1 + rate * years)) / (years * 12));
  char.finances.cash += amount;
  char.finances.loans.push({
    id: uuidv4(), type: 'personal', amount, remaining: amount,
    rate, monthlyPayment, years,
  });
  const msg = `Loan of $${amount.toLocaleString()} approved. Monthly: $${monthlyPayment.toLocaleString()}.`;
  addToHistory(char, { type: 'neutral', icon: '🏦', message: msg });
  return { character: char, result: 'success', message: msg };
}

export function payOffLoan(character, loanId) {
  const char = JSON.parse(JSON.stringify(character));
  const loan = char.finances.loans.find(l => l.id === loanId);
  if (!loan) return { character: char, result: 'not_found', message: 'Loan not found.' };
  if (char.finances.cash < loan.remaining) return { character: char, result: 'no_money', message: `Need $${loan.remaining.toLocaleString()}.` };
  char.finances.cash -= loan.remaining;
  char.finances.loans = char.finances.loans.filter(l => l.id !== loanId);
  const msg = 'Loan paid off in full!';
  addToHistory(char, { type: 'good', icon: '✅', message: msg });
  return { character: char, result: 'success', message: msg };
}

export function applyForCreditCard(character) {
  const char = JSON.parse(JSON.stringify(character));
  if (char.finances.creditCardLimit > 0) return { character: char, result: 'already', message: 'You already have a credit card.' };
  if (char.age < 18) return { character: char, result: 'too_young', message: 'Must be 18+.' };
  const limit = char.career.salary > 80000 ? 25000 : char.career.salary > 30000 ? 10000 : 3000;
  char.finances.creditCardLimit = limit;
  const msg = `Credit card approved! Limit: $${limit.toLocaleString()}.`;
  addToHistory(char, { type: 'neutral', icon: '💳', message: msg });
  return { character: char, result: 'success', message: msg };
}

export function payCreditCard(character, amount) {
  const char = JSON.parse(JSON.stringify(character));
  amount = Math.min(amount, char.finances.creditCardDebt, char.finances.cash);
  char.finances.cash -= amount;
  char.finances.creditCardDebt -= amount;
  const msg = `Paid $${amount.toLocaleString()} on credit card.`;
  return { character: char, result: 'success', message: msg };
}

export function buyStock(character, ticker, shares) {
  const char = JSON.parse(JSON.stringify(character));
  const stock = STOCKS.find(s => s.ticker === ticker);
  if (!stock) return { character: char, result: 'invalid', message: 'Invalid stock.' };
  if (char.age < 18) return { character: char, result: 'too_young', message: 'Must be 18+.' };
  const total = stock.basePrice * shares;
  if (char.finances.cash < total) return { character: char, result: 'no_money', message: 'Not enough cash.' };
  char.finances.cash -= total;
  const existing = char.finances.stocks.find(s => s.ticker === ticker);
  if (existing) {
    const newShares = existing.shares + shares;
    existing.avgCost = ((existing.avgCost * existing.shares) + total) / newShares;
    existing.shares = newShares;
  } else {
    char.finances.stocks.push({
      ticker, name: stock.name, icon: stock.icon, shares,
      avgCost: stock.basePrice, currentPrice: stock.basePrice,
    });
  }
  const msg = `Bought ${shares} shares of ${ticker}.`;
  addToHistory(char, { type: 'neutral', icon: '📈', message: msg });
  return { character: char, result: 'success', message: msg };
}

export function sellStock(character, ticker, shares) {
  const char = JSON.parse(JSON.stringify(character));
  const stock = char.finances.stocks.find(s => s.ticker === ticker);
  if (!stock) return { character: char, result: 'no_stock', message: 'You don\'t own that stock.' };
  shares = Math.min(shares, stock.shares);
  const total = stock.currentPrice * shares;
  char.finances.cash += total;
  stock.shares -= shares;
  if (stock.shares <= 0) {
    char.finances.stocks = char.finances.stocks.filter(s => s.ticker !== ticker);
  }
  const profit = total - (stock.avgCost * shares);
  const msg = `Sold ${shares} ${ticker} for $${Math.floor(total).toLocaleString()} (${profit >= 0 ? '+' : ''}$${Math.floor(profit).toLocaleString()}).`;
  addToHistory(char, { type: profit > 0 ? 'good' : 'neutral', icon: '📊', message: msg });
  return { character: char, result: 'success', message: msg };
}

export const CASINO_GAMES = [
  { id: 'slots',     name: 'Slots',     icon: '🎰', minBet: 5,    maxBet: 500,    odds: 0.35, multiplier: [2, 100] },
  { id: 'blackjack', name: 'Blackjack', icon: '🃏', minBet: 25,   maxBet: 5000,   odds: 0.49, multiplier: [2, 2] },
  { id: 'roulette',  name: 'Roulette',  icon: '🎡', minBet: 10,   maxBet: 2000,   odds: 0.47, multiplier: [2, 35] },
  { id: 'poker',     name: 'Poker',     icon: '♠️', minBet: 100,  maxBet: 50000,  odds: 0.45, multiplier: [3, 50] },
  { id: 'baccarat',  name: 'Baccarat',  icon: '🎴', minBet: 50,   maxBet: 10000,  odds: 0.49, multiplier: [2, 2] },
];

export function gambleAtCasino(character, gameId, betAmount) {
  const char = JSON.parse(JSON.stringify(character));
  if (char.age < 21) return { character: char, result: 'too_young', message: 'Must be 21+.' };
  const game = CASINO_GAMES.find(g => g.id === gameId);
  if (!game) return { character: char, result: 'invalid', message: 'Invalid game.' };
  if (betAmount < game.minBet || betAmount > game.maxBet) return { character: char, result: 'invalid_bet', message: `Bet must be $${game.minBet}–$${game.maxBet}.` };
  if (char.finances.cash < betAmount) return { character: char, result: 'no_money', message: 'Not enough cash.' };
  char.finances.cash -= betAmount;
  if (chance(game.odds * 100)) {
    const mult = applyRange(game.multiplier);
    const winnings = betAmount * mult;
    char.finances.cash += winnings;
    char.stats.happiness = clamp(char.stats.happiness + 8);
    const msg = `${game.name}: WON $${winnings.toLocaleString()}! 🎉`;
    addToHistory(char, { type: 'good', icon: game.icon, message: msg });
    return { character: char, result: 'win', winnings, message: msg };
  } else {
    char.stats.happiness = clamp(char.stats.happiness - 5);
    const msg = `${game.name}: lost $${betAmount.toLocaleString()}. 😩`;
    addToHistory(char, { type: 'bad', icon: game.icon, message: msg });
    return { character: char, result: 'lose', message: msg };
  }
}

export function buyLotteryTicket(character) {
  const char = JSON.parse(JSON.stringify(character));
  if (char.age < 18) return { character: char, result: 'too_young', message: 'Must be 18+.' };
  if (char.finances.cash < 5) return { character: char, result: 'no_money', message: 'Need $5.' };
  char.finances.cash -= 5;
  if (chance(0.0001 * 100)) { // 0.0001%
    const jackpot = rand(5000000, 50000000);
    char.finances.cash += jackpot;
    char.stats.happiness = clamp(char.stats.happiness + 50);
    const msg = `🎰 JACKPOT! You won $${jackpot.toLocaleString()}!`;
    addToHistory(char, { type: 'milestone', icon: '🎰', message: msg });
    return { character: char, result: 'jackpot', winnings: jackpot, message: msg };
  } else if (chance(2)) {
    const small = rand(50, 5000);
    char.finances.cash += small;
    return { character: char, result: 'small_win', winnings: small, message: `Won $${small.toLocaleString()} on lotto!` };
  }
  return { character: char, result: 'lose', message: 'Better luck next time.' };
}

// ═══════════════════════════════════════════════════════════════════════════════
// APPEARANCE & HOBBIES
// ═══════════════════════════════════════════════════════════════════════════════

export function changeHairColor(character, colorId) {
  const char = JSON.parse(JSON.stringify(character));
  const color = HAIR_COLORS.find(h => h.id === colorId);
  if (!color) return { character: char, result: 'invalid', message: 'Invalid color.' };
  if (char.finances.cash < color.cost) return { character: char, result: 'no_money', message: 'Not enough cash.' };
  char.finances.cash -= color.cost;
  char.appearance.hairColor = colorId;
  char.stats.looks = clamp(char.stats.looks + rand(0, 4));
  char.stats.happiness = clamp(char.stats.happiness + 4);
  const msg = `New hair: ${color.name}.`;
  addToHistory(char, { type: 'neutral', icon: '💇', message: msg });
  return { character: char, result: 'success', message: msg };
}

export function getTattoo(character, placementId) {
  const char = JSON.parse(JSON.stringify(character));
  const place = TATTOO_PLACEMENTS.find(t => t.id === placementId);
  if (!place) return { character: char, result: 'invalid', message: 'Invalid placement.' };
  if (char.age < 18) return { character: char, result: 'too_young', message: 'Must be 18+.' };
  if (char.finances.cash < place.cost) return { character: char, result: 'no_money', message: 'Not enough cash.' };
  char.finances.cash -= place.cost;
  char.appearance.tattoos.push({ id: uuidv4(), placement: placementId, year: char.birthYear + char.age });
  char.stats.happiness = clamp(char.stats.happiness + 6);
  const msg = `Got a ${place.name} tattoo!`;
  addToHistory(char, { type: 'neutral', icon: '🎨', message: msg });
  return { character: char, result: 'success', message: msg };
}

export function getPiercing(character, typeId) {
  const char = JSON.parse(JSON.stringify(character));
  const p = PIERCINGS.find(x => x.id === typeId);
  if (!p) return { character: char, result: 'invalid', message: 'Invalid piercing.' };
  if (char.finances.cash < p.cost) return { character: char, result: 'no_money', message: 'Not enough cash.' };
  char.finances.cash -= p.cost;
  char.appearance.piercings.push({ id: uuidv4(), type: typeId, year: char.birthYear + char.age });
  char.stats.looks = clamp(char.stats.looks + rand(0, 3));
  char.stats.happiness = clamp(char.stats.happiness + 4);
  const msg = `Got a ${p.name} piercing!`;
  addToHistory(char, { type: 'neutral', icon: '💎', message: msg });
  return { character: char, result: 'success', message: msg };
}

export const INSTRUMENTS = ['Piano','Guitar','Violin','Drums','Saxophone','Bass','Flute','Cello'];
export const SPORTS = ['Basketball','Soccer','Tennis','Golf','Baseball','Volleyball','Hockey','Boxing'];
export const LANGUAGES = ['Spanish','French','Mandarin','Japanese','German','Italian','Russian','Arabic','Korean','Portuguese'];

export function learnInstrument(character, instrumentName) {
  const char = JSON.parse(JSON.stringify(character));
  if (!INSTRUMENTS.includes(instrumentName)) return { character: char, result: 'invalid', message: 'Invalid instrument.' };
  if (!char.hobbies) char.hobbies = { instrument: null, sport: null, artSkill: 0, writingSkill: 0, booksRead: 0, booksWritten: [], languages: [] };
  if (!char.hobbies.instrument) {
    char.hobbies.instrument = { name: instrumentName, skill: 5 };
    if (char.finances.cash >= 200) char.finances.cash -= 200;
    const msg = `Started learning ${instrumentName}!`;
    addToHistory(char, { type: 'good', icon: '🎵', message: msg });
    return { character: char, result: 'started', message: msg };
  } else if (char.hobbies.instrument.name === instrumentName) {
    char.hobbies.instrument.skill = clamp(char.hobbies.instrument.skill + rand(3, 8), 0, 100);
    char.stats.smarts = clamp(char.stats.smarts + 1);
    char.stats.happiness = clamp(char.stats.happiness + 4);
    const msg = `Practiced ${instrumentName}. Skill: ${char.hobbies.instrument.skill}/100.`;
    return { character: char, result: 'practiced', message: msg };
  } else {
    char.hobbies.instrument = { name: instrumentName, skill: 5 };
    return { character: char, result: 'switched', message: `Switched to ${instrumentName}.` };
  }
}

export function learnLanguage(character, lang) {
  const char = JSON.parse(JSON.stringify(character));
  if (!LANGUAGES.includes(lang)) return { character: char, result: 'invalid', message: 'Invalid language.' };
  if (!char.hobbies.languages) char.hobbies.languages = [];
  let entry = char.hobbies.languages.find(l => l.name === lang);
  if (!entry) {
    entry = { name: lang, proficiency: 10 };
    char.hobbies.languages.push(entry);
  } else {
    entry.proficiency = clamp(entry.proficiency + rand(8, 15), 0, 100);
  }
  char.stats.smarts = clamp(char.stats.smarts + 2);
  const msg = `Studied ${lang}. Proficiency: ${entry.proficiency}/100.`;
  addToHistory(char, { type: 'good', icon: '📚', message: msg });
  return { character: char, result: 'success', message: msg };
}

export function readBook(character) {
  const char = JSON.parse(JSON.stringify(character));
  if (!char.hobbies) char.hobbies = { booksRead: 0 };
  char.hobbies.booksRead = (char.hobbies.booksRead || 0) + 1;
  char.stats.smarts = clamp(char.stats.smarts + rand(2, 5));
  char.stats.happiness = clamp(char.stats.happiness + rand(2, 5));
  const msg = `Read a book. Total read: ${char.hobbies.booksRead}.`;
  addToHistory(char, { type: 'good', icon: '📖', message: msg });
  return { character: char, result: 'success', message: msg };
}

export function meditate(character) {
  const char = JSON.parse(JSON.stringify(character));
  char.stats.happiness = clamp(char.stats.happiness + rand(5, 12));
  if (char.mentalHealth) char.mentalHealth.score = clamp(char.mentalHealth.score + rand(2, 6));
  const msg = 'Meditated. Inner peace achieved.';
  addToHistory(char, { type: 'good', icon: '🧘', message: msg });
  return { character: char, result: 'success', message: msg };
}

export function takeVacation(character, destId) {
  const char = JSON.parse(JSON.stringify(character));
  const dest = VACATION_DESTINATIONS.find(d => d.id === destId);
  if (!dest) return { character: char, result: 'invalid', message: 'Invalid destination.' };
  if (char.finances.cash < dest.cost) return { character: char, result: 'no_money', message: `Need $${dest.cost.toLocaleString()}.` };
  char.finances.cash -= dest.cost;
  char.stats.happiness = clamp(char.stats.happiness + applyRange(dest.happinessGain));
  char.stats.smarts = clamp(char.stats.smarts + applyRange(dest.smartsGain));
  const msg = `Vacation: ${dest.name}!`;
  addToHistory(char, { type: 'good', icon: dest.icon, message: msg });
  return { character: char, result: 'success', message: msg };
}

export function volunteer(character) {
  const char = JSON.parse(JSON.stringify(character));
  char.stats.happiness = clamp(char.stats.happiness + rand(5, 12));
  char.karma = clamp((char.karma || 50) + 5);
  const msg = 'Volunteered. Made the world a little better.';
  addToHistory(char, { type: 'good', icon: '🤝', message: msg });
  return { character: char, result: 'success', message: msg };
}

// ═══════════════════════════════════════════════════════════════════════════════
// PETS
// ═══════════════════════════════════════════════════════════════════════════════

export function adoptPet(character, petTypeId, name) {
  const char = JSON.parse(JSON.stringify(character));
  const pt = PET_TYPES.find(p => p.id === petTypeId);
  if (!pt) return { character: char, result: 'invalid', message: 'Invalid pet.' };
  if (char.finances.cash < pt.cost) return { character: char, result: 'no_money', message: `Need $${pt.cost}.` };
  char.finances.cash -= pt.cost;
  if (!char.pets) char.pets = [];
  const pet = { id: uuidv4(), type: petTypeId, name: name || randomName(chance(50)?'male':'female').first, age: 1, happiness: 80, health: 90, icon: pt.icon };
  char.pets.push(pet);
  char.hasPet = true;
  char.stats.happiness = clamp(char.stats.happiness + pt.happiness);
  const msg = `You adopted ${pet.name} the ${pt.name}!`;
  addToHistory(char, { type: 'milestone', icon: pt.icon, message: msg });
  return { character: char, result: 'success', message: msg };
}

export function petAction(character, petId, action) {
  const char = JSON.parse(JSON.stringify(character));
  const pet = char.pets?.find(p => p.id === petId);
  if (!pet) return { character: char, result: 'no_pet', message: 'Pet not found.' };
  let msg = '';
  switch (action) {
    case 'play':  pet.happiness = Math.min(100, pet.happiness + rand(8, 15)); char.stats.happiness = clamp(char.stats.happiness + 5); msg = `Played with ${pet.name}!`; break;
    case 'walk':  pet.health = Math.min(100, pet.health + rand(5, 10)); char.stats.health = clamp(char.stats.health + 2); msg = `Walked with ${pet.name}.`; break;
    case 'feed':  pet.happiness = Math.min(100, pet.happiness + 5); char.finances.cash -= 30; msg = `Fed ${pet.name} a treat.`; break;
    case 'vet':   if (char.finances.cash < 200) return { character: char, result: 'no_money', message: 'Vet costs $200.' };
                  char.finances.cash -= 200; pet.health = Math.min(100, pet.health + rand(15, 25)); msg = `${pet.name} got a vet checkup.`; break;
    case 'train': pet.happiness = Math.min(100, pet.happiness + rand(5, 10)); char.stats.smarts = clamp(char.stats.smarts + 1); msg = `Trained ${pet.name}.`; break;
  }
  addToHistory(char, { type: 'good', icon: pet.icon, message: msg });
  return { character: char, result: 'success', message: msg };
}

// ═══════════════════════════════════════════════════════════════════════════════
// FAME / SOCIAL MEDIA
// ═══════════════════════════════════════════════════════════════════════════════

export function postSocialMedia(character) {
  const char = JSON.parse(JSON.stringify(character));
  if (!char.socialMedia) char.socialMedia = { platform: 'TikTok', followers: 0 };
  if (!char.socialMedia.platform) char.socialMedia.platform = pick(['TikTok','Instagram','YouTube','Twitter']);
  const looksFactor = char.stats.looks / 50;
  const baseGrowth = rand(5, 50);
  let growth = Math.floor(baseGrowth * looksFactor);
  if (chance(8)) {
    growth = rand(10000, 500000);
    char.fame = Math.min(100, (char.fame || 0) + 10);
    addToHistory(char, { type: 'good', icon: '🔥', message: `You went viral! +${growth.toLocaleString()} followers!` });
  } else {
    addToHistory(char, { type: 'neutral', icon: '📱', message: `Posted to ${char.socialMedia.platform}. +${growth} followers.` });
  }
  char.socialMedia.followers = (char.socialMedia.followers || 0) + growth;
  if (char.socialMedia.followers > 100000) char.fame = Math.min(100, (char.fame || 0) + 1);
  return { character: char, result: 'success', message: `+${growth.toLocaleString()} followers` };
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

export function getMoodEmoji(h) {
  if (h >= 90) return '😄'; if (h >= 70) return '😊';
  if (h >= 50) return '😐'; if (h >= 30) return '😟';
  if (h >= 10) return '😢'; return '😭';
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
  const abs = Math.abs(amount || 0);
  const sign = amount < 0 ? '-' : '';
  if (abs >= 1000000) return `${sign}${currency}${(abs / 1000000).toFixed(1)}M`;
  if (abs >= 1000)    return `${sign}${currency}${(abs / 1000).toFixed(1)}K`;
  return `${sign}${currency}${abs.toLocaleString()}`;
};

// Promote / check promotion (unchanged)
export function checkPromotion(character) {
  try {
    const char = JSON.parse(JSON.stringify(character));
    if (!char.career.employed || !char.career.trackId) return { character: char, promoted: false };
    const track = CAREER_TRACKS.find(t => t.id === char.career.trackId);
    if (!track) return { character: char, promoted: false };
    const next = char.career.level + 1;
    if (next >= track.levels.length) return { character: char, promoted: false, maxLevel: true };
    const nextTier = track.levels[next];
    const yearsNeeded = nextTier.yearsNeeded - (track.levels[char.career.level]?.yearsNeeded || 0);
    if (char.career.yearsAtJob < yearsNeeded) return { character: char, promoted: false };
    if (char.career.performance < 55) return { character: char, promoted: false };
    char.career.level = next;
    char.career.title = nextTier.title;
    char.career.salary = nextTier.salary;
    char.stats.happiness = clamp(char.stats.happiness + 12);
    addToHistory(char, { type: 'good', icon: '📈', message: `Promoted to ${nextTier.title}! New salary: ${formatMoney(nextTier.salary * char.salaryMult)}/yr` });
    return { character: char, promoted: true };
  } catch (err) { return { character, promoted: false }; }
}
