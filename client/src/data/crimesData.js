export const CRIMES = [
  // ── Petty ──────────────────────────────────────────────────────────────────
  { id: 'pickpocket',   name: 'Pickpocketing',    icon: '👜', cat: 'petty',        minAge: 10, risk: 'low',    baseSuccess: 65, payout: [50, 300],      jail: [0,1],   karma: -5,  desc: 'Lift wallets and phones from distracted strangers' },
  { id: 'shoplift',     name: 'Shoplifting',       icon: '🛒', cat: 'petty',        minAge: 10, risk: 'low',    baseSuccess: 60, payout: [30, 250],      jail: [0,1],   karma: -5,  desc: 'Pocket items from a retail store without paying' },
  { id: 'vandalism',    name: 'Vandalism',          icon: '🎨', cat: 'petty',        minAge: 10, risk: 'low',    baseSuccess: 72, payout: [0, 0],         jail: [0,1],   karma: -8,  desc: 'Tag walls and destroy property. Express yourself.' },
  { id: 'trespassing',  name: 'Trespassing',        icon: '🚧', cat: 'petty',        minAge: 10, risk: 'low',    baseSuccess: 75, payout: [0, 0],         jail: [0,0],   karma: -3,  desc: 'Sneak into a restricted area or abandoned building' },

  // ── Property ───────────────────────────────────────────────────────────────
  { id: 'burglary',     name: 'Burglary',           icon: '🏠', cat: 'property',     minAge: 16, risk: 'medium', baseSuccess: 50, payout: [500, 8000],    jail: [2,7],   karma: -20, desc: 'Break into a home and steal valuables while no one is home' },
  { id: 'car_theft',    name: 'Grand Theft Auto',   icon: '🚗', cat: 'property',     minAge: 16, risk: 'medium', baseSuccess: 45, payout: [2000, 15000],  jail: [3,8],   karma: -22, desc: 'Steal a car. Could sell for serious cash.' },
  { id: 'arson',        name: 'Arson',              icon: '🔥', cat: 'property',     minAge: 16, risk: 'high',   baseSuccess: 40, payout: [0, 12000],     jail: [5,20],  karma: -35, desc: 'Set fire to a building. Destructive and extremely dangerous.' },

  // ── Violent ────────────────────────────────────────────────────────────────
  { id: 'mugging',      name: 'Mugging',            icon: '💰', cat: 'violent',      minAge: 14, risk: 'medium', baseSuccess: 55, payout: [100, 900],     jail: [1,4],   karma: -20, reqHealth: 50, desc: 'Physically threaten and rob someone on the street' },
  { id: 'assault',      name: 'Assault',            icon: '👊', cat: 'violent',      minAge: 14, risk: 'medium', baseSuccess: 55, payout: [0, 0],         jail: [1,5],   karma: -30, reqHealth: 55, desc: 'Attack someone. May settle old scores.' },
  { id: 'kidnapping',   name: 'Kidnapping',         icon: '🚨', cat: 'violent',      minAge: 18, risk: 'extreme',baseSuccess: 25, payout: [20000,500000], jail: [15,40], karma: -60, reqHealth: 65, desc: 'Abduct someone for ransom. Huge risk, massive reward.' },
  { id: 'murder',       name: 'Murder',             icon: '🔪', cat: 'violent',      minAge: 16, risk: 'extreme',baseSuccess: 35, payout: [0, 0],         jail: [25,99], karma: -100,reqHealth: 60, desc: 'Take someone\'s life. The ultimate crime.' },

  // ── Drugs ──────────────────────────────────────────────────────────────────
  { id: 'drug_deal',    name: 'Drug Dealing',       icon: '💊', cat: 'drugs',        minAge: 16, risk: 'medium', baseSuccess: 60, payout: [500, 4000],    jail: [2,10],  karma: -15, desc: 'Sell controlled substances on the street or online' },
  { id: 'drug_traffic', name: 'Drug Trafficking',   icon: '🧪', cat: 'drugs',        minAge: 20, risk: 'high',   baseSuccess: 40, payout: [20000,150000], jail: [10,30], karma: -40, desc: 'Move large quantities across state or national borders' },

  // ── White Collar ───────────────────────────────────────────────────────────
  { id: 'fraud',        name: 'Insurance Fraud',    icon: '📋', cat: 'white_collar', minAge: 18, risk: 'medium', baseSuccess: 55, payout: [5000,50000],   jail: [2,8],   karma: -20, reqSmarts: 50, desc: 'File false insurance claims for big payouts' },
  { id: 'cybercrime',   name: 'Cybercrime',         icon: '💻', cat: 'white_collar', minAge: 16, risk: 'medium', baseSuccess: 50, payout: [2000,60000],   jail: [3,10],  karma: -20, reqSmarts: 65, desc: 'Hack accounts, run phishing scams, or deploy ransomware' },
  { id: 'embezzlement', name: 'Embezzlement',       icon: '💼', cat: 'white_collar', minAge: 22, risk: 'medium', baseSuccess: 45, payout: [10000,200000], jail: [4,15],  karma: -30, reqSmarts: 55, reqEmployed: true, desc: 'Skim money from your employer over time' },
  { id: 'tax_evasion',  name: 'Tax Evasion',        icon: '🏦', cat: 'white_collar', minAge: 22, risk: 'low',    baseSuccess: 55, payout: [5000,80000],   jail: [1,6],   karma: -15, reqSmarts: 60, desc: 'Conceal income to avoid paying the government' },
  { id: 'counterfit',   name: 'Counterfeiting',     icon: '💵', cat: 'white_collar', minAge: 18, risk: 'medium', baseSuccess: 48, payout: [5000,50000],   jail: [3,12],  karma: -25, reqSmarts: 55, desc: 'Print fake currency and pass it as real' },
  { id: 'identity_thft',name: 'Identity Theft',     icon: '🎭', cat: 'white_collar', minAge: 18, risk: 'medium', baseSuccess: 52, payout: [3000,40000],   jail: [2,8],   karma: -25, reqSmarts: 58, desc: 'Steal someone\'s identity and drain their accounts' },
];

export const CRIME_CATEGORIES = {
  petty:        { label: 'Petty Crime',    icon: '🤏', color: 'text-yellow-400',  bg: 'bg-yellow-900/20',  border: 'border-yellow-800/30' },
  property:     { label: 'Property Crime', icon: '🏠', color: 'text-orange-400',  bg: 'bg-orange-900/20',  border: 'border-orange-800/30' },
  violent:      { label: 'Violent Crime',  icon: '🔫', color: 'text-red-400',     bg: 'bg-red-900/20',     border: 'border-red-800/30' },
  drugs:        { label: 'Drug Crime',     icon: '💊', color: 'text-purple-400',  bg: 'bg-purple-900/20',  border: 'border-purple-800/30' },
  white_collar: { label: 'White Collar',   icon: '💼', color: 'text-blue-400',    bg: 'bg-blue-900/20',    border: 'border-blue-800/30' },
};

export const CRIME_RISK_LABELS = {
  low:     { label: 'Low Risk',     color: 'text-green-400' },
  medium:  { label: 'Medium Risk',  color: 'text-yellow-400' },
  high:    { label: 'High Risk',    color: 'text-orange-400' },
  extreme: { label: 'Extreme Risk', color: 'text-red-400' },
};

export const PRISON_ACTIVITIES = [
  { id: 'workout',  name: 'Work Out',          icon: '💪', desc: 'Hit the prison gym. Get strong.',           effects: { health: [3,8], looks: [1,3] } },
  { id: 'study',    name: 'Study for GED',     icon: '📚', desc: 'Get your education behind bars.',            effects: { smarts: [3,7], happiness: [1,4] } },
  { id: 'meditate', name: 'Meditate',           icon: '🧘', desc: 'Find peace in a difficult place.',          effects: { happiness: [4,9] } },
  { id: 'behave',   name: 'Model Prisoner',     icon: '😇', desc: 'Good conduct. May reduce sentence.',        effects: { happiness: [-3,3] }, yearReduction: 0.5 },
  { id: 'gang',     name: 'Join Prison Gang',   icon: '🦹', desc: 'Protection, but dirty hands.',              effects: { health: [3,10], happiness: [-5,5] }, karmaHit: -10 },
  { id: 'fight',    name: 'Start a Fight',      icon: '👊', desc: 'Establish dominance. High risk.',           effects: { health: [-15,8], happiness: [-5,10] } },
  { id: 'escape',   name: 'Attempt Escape',     icon: '🏃', desc: 'Freedom or a much longer sentence.',        isEscape: true },
  { id: 'appeal',   name: 'File Legal Appeal',  icon: '⚖️', desc: 'Your lawyer will appeal the sentence.',     cost: 5000, isAppeal: true },
];

export const LAWYER_TIERS = [
  { id: 'public',   name: 'Public Defender',     icon: '📁', cost: 0,      sentenceRedux: 0.10, desc: 'Free but overwhelmed. Low success rate.' },
  { id: 'standard', name: 'Standard Attorney',   icon: '⚖️', cost: 5000,   sentenceRedux: 0.30, desc: 'Solid lawyer. Decent chance of reduction.' },
  { id: 'premium',  name: 'Top Criminal Lawyer', icon: '🏆', cost: 25000,  sentenceRedux: 0.55, desc: 'The best money can buy. Significant reduction.' },
  { id: 'celebrity',name: 'Celebrity Lawyer',    icon: '⭐', cost: 100000, sentenceRedux: 0.75, desc: 'Famous defense attorney. Nearly always wins.' },
];

// Dating locations for finding a partner
export const DATING_LOCATIONS = [
  { id: 'bar',        name: 'Bar / Club',      icon: '🍺', minAge: 21, cost: 50,  baseChance: 55, desc: 'Casual nightlife meet — chemistry over coffee isn\'t for everyone' },
  { id: 'gym',        name: 'Gym',             icon: '💪', minAge: 16, cost: 0,   baseChance: 35, desc: 'Sweat together, fall together. Fit partner likely.' },
  { id: 'dating_app', name: 'Dating App',      icon: '📱', minAge: 18, cost: 0,   baseChance: 45, desc: 'Swipe right for love. Results may vary.' },
  { id: 'church',     name: 'Church / Temple', icon: '⛪', minAge: 13, cost: 0,   baseChance: 30, desc: 'Shared values make strong foundations.' },
  { id: 'party',      name: 'Party',           icon: '🎉', minAge: 16, cost: 30,  baseChance: 50, desc: 'Anything can happen at a good party.' },
  { id: 'library',    name: 'Library',         icon: '📚', minAge: 13, cost: 0,   baseChance: 25, desc: 'Smart, quiet, and usually looking for connection.' },
  { id: 'work',       name: 'Work',            icon: '💼', minAge: 16, cost: 0,   baseChance: 30, desc: 'Office romance — risky but intense.', reqEmployed: true },
  { id: 'school',     name: 'School',          icon: '🏫', minAge: 13, cost: 0,   baseChance: 40, desc: 'Classmates can turn into soulmates.', reqInSchool: true },
  { id: 'speed_date', name: 'Speed Dating',    icon: '⏱️', minAge: 21, cost: 40,  baseChance: 60, desc: '3 minutes per person. Efficient.' },
];

export const DATE_ACTIVITIES = [
  { id: 'dinner',    name: 'Fancy Dinner',   icon: '🍽️', cost: 120, loveGain: [8,18],  happinessGain: [5,12], desc: 'Romantic dinner at a nice restaurant' },
  { id: 'movies',    name: 'Movie Night',    icon: '🎬', cost: 30,  loveGain: [3,8],   happinessGain: [3,8],  desc: 'Classic and comfortable' },
  { id: 'concert',   name: 'Live Concert',   icon: '🎵', cost: 100, loveGain: [7,15],  happinessGain: [8,16], desc: 'Shared music and energy' },
  { id: 'picnic',    name: 'Park Picnic',    icon: '🧺', cost: 20,  loveGain: [5,12],  happinessGain: [5,12], desc: 'Outdoors, simple, memorable' },
  { id: 'trip',      name: 'Weekend Trip',   icon: '✈️', cost: 500, loveGain: [15,28], happinessGain: [12,22],desc: 'A weekend away — love multiplier' },
  { id: 'home',      name: 'Cook at Home',   icon: '🍳', cost: 0,   loveGain: [4,10],  happinessGain: [4,10], desc: 'Cozy, intimate, free' },
  { id: 'sports',    name: 'Sports Game',    icon: '🏟️', cost: 80,  loveGain: [5,12],  happinessGain: [6,14], desc: 'Cheer together, bond over wins and losses' },
  { id: 'spa',       name: 'Spa Day',        icon: '🛁', cost: 200, loveGain: [10,20], happinessGain: [10,18],desc: 'Relaxing and indulgent together' },
];
