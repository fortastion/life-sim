// ── Medical Conditions ────────────────────────────────────────────────────────
export const MEDICAL_CONDITIONS = [
  { id: 'common_cold',      name: 'Common Cold',         icon: '🤧', severity: 'mild',     healthImpact: -5,  treatments: [{ id: 'rest',        name: 'Rest & Fluids',        cost: 0,      successRate: 90, restore: 5  }, { id: 'otc',   name: 'OTC Meds',      cost: 50,    successRate: 97, restore: 8  }] },
  { id: 'flu',              name: 'Influenza',            icon: '🤒', severity: 'mild',     healthImpact: -10, treatments: [{ id: 'antivirals', name: 'Antiviral Medication',  cost: 200,    successRate: 92, restore: 10 }, { id: 'rest2', name: 'Bed Rest',       cost: 0,     successRate: 75, restore: 7  }] },
  { id: 'broken_bone',      name: 'Broken Bone',          icon: '🦴', severity: 'moderate', healthImpact: -18, treatments: [{ id: 'cast',       name: 'Cast & Recovery',       cost: 3000,   successRate: 96, restore: 18 }, { id: 'surg1', name: 'Surgical Repair',cost: 18000, successRate: 99, restore: 20 }] },
  { id: 'appendicitis',     name: 'Appendicitis',         icon: '🏥', severity: 'serious',  healthImpact: -25, treatments: [{ id: 'appendix',   name: 'Emergency Surgery',     cost: 28000,  successRate: 97, restore: 23 }] },
  { id: 'heart_disease',    name: 'Heart Disease',        icon: '❤️‍🩹', severity: 'serious', healthImpact: -30, treatments: [{ id: 'hd_meds',  name: 'Heart Medication',      cost: 1800,   successRate: 80, restore: 15 }, { id: 'bypass','name': 'Bypass Surgery',cost: 80000, successRate: 88, restore: 25 }] },
  { id: 'diabetes',         name: 'Type 2 Diabetes',      icon: '💉', severity: 'serious',  healthImpact: -20, treatments: [{ id: 'insulin',   name: 'Insulin Therapy',       cost: 150,    successRate: 85, restore: 12 }, { id: 'diet_d','name': 'Diet & Exercise',cost: 0,    successRate: 60, restore: 8  }] },
  { id: 'cancer',           name: 'Cancer',               icon: '🎗️', severity: 'critical', healthImpact: -40, treatments: [{ id: 'chemo',     name: 'Chemotherapy',          cost: 60000,  successRate: 65, restore: 30 }, { id: 'surgery_c','name': 'Surgical Removal',cost: 45000, successRate: 72, restore: 35 }, { id: 'radiation','name': 'Radiation Therapy',cost: 40000, successRate: 60, restore: 28 }] },
  { id: 'hiv',              name: 'HIV',                  icon: '🦠', severity: 'serious',  healthImpact: -25, treatments: [{ id: 'art',       name: 'Antiretroviral Therapy',cost: 2000,   successRate: 92, restore: 15, managed: true }] },
  { id: 'kidney_disease',   name: 'Kidney Disease',       icon: '🫘', severity: 'serious',  healthImpact: -28, treatments: [{ id: 'dialysis',  name: 'Dialysis',              cost: 4000,   successRate: 80, restore: 12 }, { id: 'transplant','name': 'Kidney Transplant',cost: 150000, successRate: 85, restore: 28 }] },
  { id: 'depression',       name: 'Clinical Depression',  icon: '🌧️', severity: 'moderate', healthImpact: -10, treatments: [{ id: 'therapy_d','name': 'CBT Therapy',          cost: 2400,   successRate: 75, restore: 8  }, { id: 'antidep','name': 'Antidepressants',  cost: 960,   successRate: 78, restore: 10 }] },
  { id: 'anxiety',          name: 'Anxiety Disorder',     icon: '😰', severity: 'moderate', healthImpact: -8,  treatments: [{ id: 'therapy_a','name': 'Psychotherapy',        cost: 1800,   successRate: 78, restore: 7  }, { id: 'anxio',  name: 'Anxiolytics',        cost: 840,   successRate: 80, restore: 8  }] },
  { id: 'bipolar',          name: 'Bipolar Disorder',     icon: '🔄', severity: 'serious',  healthImpact: -20, treatments: [{ id: 'mood_stab','name': 'Mood Stabilizers',    cost: 1200,   successRate: 72, restore: 12 }, { id: 'therapy_b','name': 'Group Therapy',   cost: 960,   successRate: 65, restore: 10 }] },
  { id: 'back_pain',        name: 'Chronic Back Pain',    icon: '🦴', severity: 'moderate', healthImpact: -12, treatments: [{ id: 'physio',   name: 'Physical Therapy',      cost: 3000,   successRate: 70, restore: 10 }, { id: 'back_surg','name': 'Spinal Surgery',  cost: 40000, successRate: 80, restore: 14 }] },
  { id: 'obesity',          name: 'Obesity',              icon: '⚖️', severity: 'moderate', healthImpact: -15, treatments: [{ id: 'diet_o',   name: 'Diet & Exercise Plan',  cost: 500,    successRate: 55, restore: 10 }, { id: 'bariatric','name': 'Bariatric Surgery',cost: 25000, successRate: 85, restore: 18 }] },
  { id: 'lung_disease',     name: 'Lung Disease',         icon: '🫁', severity: 'serious',  healthImpact: -25, treatments: [{ id: 'lung_meds','name': 'Bronchodilators',     cost: 2400,   successRate: 72, restore: 12 }, { id: 'lung_surg','name': 'Lung Surgery',   cost: 55000, successRate: 75, restore: 22 }] },
  { id: 'stroke',           name: 'Stroke Recovery',      icon: '🧠', severity: 'critical', healthImpact: -35, treatments: [{ id: 'rehab_s', name: 'Stroke Rehabilitation',  cost: 20000,  successRate: 65, restore: 20 }, { id: 'meds_s', name: 'Blood Thinners',     cost: 1800,  successRate: 60, restore: 12 }] },
];

// ── Plastic Surgeries ─────────────────────────────────────────────────────────
export const PLASTIC_SURGERIES = [
  { id: 'nose_job',        name: 'Rhinoplasty',          icon: '👃', cost: 8000,   looksBoost: 8,  complicationChance: 5,  minAge: 18, description: 'Reshape your nose for a more balanced face' },
  { id: 'lip_filler',      name: 'Lip Fillers',          icon: '💋', cost: 1500,   looksBoost: 4,  complicationChance: 2,  minAge: 18, description: 'Fuller, more defined lips' },
  { id: 'botox',           name: 'Botox',                icon: '💉', cost: 600,    looksBoost: 3,  complicationChance: 1,  minAge: 30, description: 'Smooth out wrinkles and fine lines' },
  { id: 'breast_aug',      name: 'Breast Augmentation', icon: '👙', cost: 12000,  looksBoost: 6,  complicationChance: 7,  minAge: 18, genderReq: 'female', description: 'Enhance chest size and shape' },
  { id: 'liposuction',     name: 'Liposuction',          icon: '⚖️', cost: 10000,  looksBoost: 7,  complicationChance: 8,  minAge: 18, description: 'Remove stubborn fat deposits' },
  { id: 'facelift',        name: 'Facelift',             icon: '🧖', cost: 15000,  looksBoost: 10, complicationChance: 10, minAge: 40, description: 'Tighten sagging skin for a more youthful look' },
  { id: 'hair_transplant', name: 'Hair Transplant',      icon: '💈', cost: 7000,   looksBoost: 5,  complicationChance: 3,  minAge: 25, description: 'Restore a full head of hair' },
  { id: 'teeth_whitening', name: 'Teeth Whitening',      icon: '😁', cost: 800,    looksBoost: 2,  complicationChance: 0,  minAge: 16, description: 'Dazzling smile guaranteed' },
  { id: 'chin_implant',    name: 'Chin Implant',         icon: '🫦', cost: 6000,   looksBoost: 5,  complicationChance: 4,  minAge: 18, description: 'Define your jawline and chin' },
  { id: 'tummy_tuck',      name: 'Tummy Tuck',           icon: '🩺', cost: 9000,   looksBoost: 6,  complicationChance: 7,  minAge: 18, description: 'Flat, toned stomach' },
  { id: 'eye_surgery',     name: 'Laser Eye Surgery',    icon: '👁️', cost: 4000,   looksBoost: 1,  complicationChance: 2,  minAge: 18, description: 'Perfect vision, no more glasses', special: 'remove_glasses' },
  { id: 'veneers',         name: 'Dental Veneers',       icon: '🦷', cost: 5000,   looksBoost: 4,  complicationChance: 1,  minAge: 18, description: 'Porcelain smile veneers' },
];

// ── Gym Workouts ──────────────────────────────────────────────────────────────
export const GYM_WORKOUTS = [
  { id: 'cardio',      name: 'Cardio',        icon: '🏃', cost: 0,   effects: { health: [5,12], looks: [2,5], happiness: [-2,4] },  description: 'Run, bike, or row — burn calories' },
  { id: 'weights',     name: 'Weight Training',icon: '🏋️', cost: 0,   effects: { health: [3,8], looks: [5,12], happiness: [-1,4] }, description: 'Build muscle and strength' },
  { id: 'yoga',        name: 'Yoga',          icon: '🧘', cost: 20,  effects: { health: [3,7], happiness: [6,14], looks: [1,3] },   description: 'Flexibility, mindfulness, peace' },
  { id: 'swimming',    name: 'Swimming',       icon: '🏊', cost: 15,  effects: { health: [7,14], looks: [3,6], happiness: [2,6] },  description: 'Full-body workout, easy on joints' },
  { id: 'martial_arts',name: 'Martial Arts',  icon: '🥊', cost: 50,  effects: { health: [5,10], looks: [3,7], happiness: [3,8], smarts: [1,3] }, description: 'Discipline, confidence, self-defense' },
  { id: 'dance',       name: 'Dance Class',   icon: '💃', cost: 30,  effects: { health: [4,8], happiness: [8,15], looks: [3,6] },  description: 'Move your body, meet people' },
  { id: 'pilates',     name: 'Pilates',       icon: '🩱', cost: 25,  effects: { health: [4,9], looks: [2,5], happiness: [4,9] },   description: 'Core strength and posture' },
  { id: 'cycling',     name: 'Cycling',       icon: '🚴', cost: 0,   effects: { health: [6,11], looks: [2,4], happiness: [3,7] },  description: 'Outdoor cycling for cardio' },
];

// ── Therapy Types ─────────────────────────────────────────────────────────────
export const THERAPY_TYPES = [
  { id: 'cbt',          name: 'Cognitive Behavioral Therapy', icon: '🧠', costPerYear: 1800, mhGain: [10,18], happinessGain: [6,12], description: 'Rewire negative thought patterns — most evidence-based' },
  { id: 'psychotherapy',name: 'Psychotherapy',                icon: '💬', costPerYear: 1440, mhGain: [7,14],  happinessGain: [5,10], description: 'Explore root causes of your pain' },
  { id: 'group',        name: 'Group Therapy',                icon: '👥', costPerYear: 720,  mhGain: [5,11],  happinessGain: [4,9],  description: 'Heal alongside others with shared struggles' },
  { id: 'mindfulness',  name: 'Mindfulness Program',          icon: '🕯️', costPerYear: 960,  mhGain: [6,12],  happinessGain: [7,14], description: 'Presence, awareness, and stress reduction' },
  { id: 'psychiatrist', name: 'Psychiatry + Medication',      icon: '💊', costPerYear: 2400, mhGain: [12,22], happinessGain: [8,16], description: 'Clinical assessment + prescription treatment' },
];

// ── Medications ───────────────────────────────────────────────────────────────
export const MEDICATIONS = [
  { id: 'antidepressants', name: 'Antidepressants',      icon: '💊', costPerYear: 960,   treatsConditions: ['Clinical Depression', 'Anxiety Disorder'], mhGain: 12, happinessGain: 10 },
  { id: 'anxiolytics',     name: 'Anti-Anxiety Meds',    icon: '💊', costPerYear: 840,   treatsConditions: ['Anxiety Disorder'],                         mhGain: 10, happinessGain: 12 },
  { id: 'mood_stabilizers',name: 'Mood Stabilizers',     icon: '💊', costPerYear: 1200,  treatsConditions: ['Bipolar Disorder'],                         mhGain: 14, happinessGain: 6  },
  { id: 'insulin',         name: 'Insulin Therapy',      icon: '💉', costPerYear: 1800,  treatsConditions: ['Type 2 Diabetes'],                          healthGain: 10 },
  { id: 'heart_meds',      name: 'Cardiac Medication',   icon: '❤️', costPerYear: 2160,  treatsConditions: ['Heart Disease', 'High Blood Pressure'],     healthGain: 12 },
  { id: 'hiv_meds',        name: 'Antiretroviral Meds',  icon: '🦠', costPerYear: 24000, treatsConditions: ['HIV'],                                      healthGain: 15 },
];

// ── Rehab Programs ────────────────────────────────────────────────────────────
export const REHAB_PROGRAMS = [
  { id: 'outpatient', name: 'Outpatient Program',  icon: '🏥', cost: 8000,  duration: 1, successRate: 55, description: '30-day outpatient recovery program' },
  { id: 'inpatient',  name: 'Residential Rehab',   icon: '🏨', cost: 25000, duration: 1, successRate: 72, description: '60-day residential treatment center' },
  { id: 'luxury',     name: 'Luxury Rehab',         icon: '🌴', cost: 80000, duration: 1, successRate: 85, description: 'Celebrity-grade 90-day holistic rehab' },
];

// ── Doctor Visit Findings ─────────────────────────────────────────────────────
export const DOCTOR_FINDINGS = [
  { id: 'all_clear',    chance: 60, message: 'All clear! Your doctor says you\'re in good shape.', healthGain: 3 },
  { id: 'minor_issue',  chance: 20, message: 'Your doctor found a minor issue. Easy to treat.', healthGain: -2, addCondition: null },
  { id: 'concerning',   chance: 12, message: 'Some concerning results. Follow-up tests recommended.', healthGain: -5 },
  { id: 'major',        chance: 8,  message: 'Your doctor found something serious. Immediate treatment required.', healthGain: -10 },
];

// ── Hair Colors ───────────────────────────────────────────────────────────────
export const HAIR_COLORS = [
  { id: 'natural_black', name: 'Jet Black',      cost: 0,    icon: '🖤' },
  { id: 'dark_brown',    name: 'Dark Brown',      cost: 0,    icon: '🟫' },
  { id: 'brown',         name: 'Chestnut Brown',  cost: 0,    icon: '🟤' },
  { id: 'blonde',        name: 'Golden Blonde',   cost: 80,   icon: '🟡' },
  { id: 'platinum',      name: 'Platinum Blonde', cost: 120,  icon: '⬜' },
  { id: 'red',           name: 'Fiery Red',       cost: 100,  icon: '🔴' },
  { id: 'auburn',        name: 'Auburn',          cost: 90,   icon: '🟧' },
  { id: 'blue',          name: 'Electric Blue',   cost: 150,  icon: '🔵' },
  { id: 'green',         name: 'Forest Green',    cost: 150,  icon: '🟢' },
  { id: 'purple',        name: 'Violet Purple',   cost: 150,  icon: '🟣' },
  { id: 'pink',          name: 'Cotton Candy Pink',cost: 150, icon: '🩷' },
  { id: 'gray',          name: 'Silver Gray',     cost: 60,   icon: '🩶' },
  { id: 'rainbow',       name: 'Rainbow',         cost: 250,  icon: '🌈' },
];

// ── Tattoo Options ────────────────────────────────────────────────────────────
export const TATTOO_PLACEMENTS = [
  { id: 'wrist',     name: 'Wrist',      icon: '🤜', cost: 150  },
  { id: 'neck',      name: 'Neck',       icon: '🧣', cost: 200  },
  { id: 'arm',       name: 'Upper Arm',  icon: '💪', cost: 200  },
  { id: 'back',      name: 'Back',       icon: '⬛', cost: 500  },
  { id: 'chest',     name: 'Chest',      icon: '👕', cost: 400  },
  { id: 'leg',       name: 'Leg',        icon: '🦵', cost: 300  },
  { id: 'sleeve',    name: 'Full Sleeve',icon: '🎨', cost: 1500 },
  { id: 'face',      name: 'Face',       icon: '😮', cost: 800  },
];

// ── Piercing Options ──────────────────────────────────────────────────────────
export const PIERCINGS = [
  { id: 'ear_lobe',   name: 'Ear Lobe',    icon: '💎', cost: 50  },
  { id: 'ear_cartilage',name: 'Ear Cartilage',icon: '💫', cost: 80 },
  { id: 'nose',       name: 'Nose Ring',   icon: '💍', cost: 60  },
  { id: 'eyebrow',    name: 'Eyebrow',     icon: '🤨', cost: 70  },
  { id: 'lip',        name: 'Lip',         icon: '💋', cost: 65  },
  { id: 'belly',      name: 'Belly Button',icon: '⭕', cost: 75  },
  { id: 'tongue',     name: 'Tongue',      icon: '👅', cost: 70  },
];
