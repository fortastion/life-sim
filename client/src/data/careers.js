export const CAREER_TRACKS = [
  {
    id: 'tech',
    name: 'Technology',
    icon: '💻',
    minSmarts: 60,
    degreeRequired: true,
    levels: [
      { title: 'Junior Developer', salary: 65000, yearsNeeded: 0 },
      { title: 'Software Engineer', salary: 95000, yearsNeeded: 2 },
      { title: 'Senior Engineer', salary: 140000, yearsNeeded: 5 },
      { title: 'Staff Engineer', salary: 180000, yearsNeeded: 8 },
      { title: 'Principal Engineer', salary: 230000, yearsNeeded: 12 },
      { title: 'CTO', salary: 400000, yearsNeeded: 18 }
    ]
  },
  {
    id: 'medicine',
    name: 'Medicine',
    icon: '🏥',
    minSmarts: 75,
    degreeRequired: true,
    postGradRequired: true,
    levels: [
      { title: 'Medical Resident', salary: 55000, yearsNeeded: 0 },
      { title: 'General Physician', salary: 120000, yearsNeeded: 3 },
      { title: 'Specialist', salary: 200000, yearsNeeded: 7 },
      { title: 'Senior Consultant', salary: 280000, yearsNeeded: 12 },
      { title: 'Chief of Medicine', salary: 450000, yearsNeeded: 20 }
    ]
  },
  {
    id: 'law',
    name: 'Law',
    icon: '⚖️',
    minSmarts: 65,
    degreeRequired: true,
    levels: [
      { title: 'Paralegal', salary: 45000, yearsNeeded: 0 },
      { title: 'Associate Attorney', salary: 85000, yearsNeeded: 2 },
      { title: 'Attorney', salary: 130000, yearsNeeded: 5 },
      { title: 'Senior Partner', salary: 250000, yearsNeeded: 10 },
      { title: 'Managing Partner', salary: 500000, yearsNeeded: 18 }
    ]
  },
  {
    id: 'business',
    name: 'Business',
    icon: '📊',
    minSmarts: 45,
    degreeRequired: false,
    levels: [
      { title: 'Sales Associate', salary: 32000, yearsNeeded: 0 },
      { title: 'Account Manager', salary: 55000, yearsNeeded: 2 },
      { title: 'Manager', salary: 80000, yearsNeeded: 5 },
      { title: 'Director', salary: 130000, yearsNeeded: 9 },
      { title: 'VP', salary: 200000, yearsNeeded: 14 },
      { title: 'CEO', salary: 500000, yearsNeeded: 20 }
    ]
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: '🎬',
    minSmarts: 30,
    degreeRequired: false,
    minLooks: 50,
    levels: [
      { title: 'Background Actor', salary: 18000, yearsNeeded: 0 },
      { title: 'Supporting Actor', salary: 40000, yearsNeeded: 2 },
      { title: 'TV Actor', salary: 90000, yearsNeeded: 5 },
      { title: 'Movie Star', salary: 500000, yearsNeeded: 10 },
      { title: 'Hollywood Legend', salary: 5000000, yearsNeeded: 20 }
    ]
  },
  {
    id: 'music',
    name: 'Music',
    icon: '🎵',
    minSmarts: 25,
    degreeRequired: false,
    levels: [
      { title: 'Street Performer', salary: 10000, yearsNeeded: 0 },
      { title: 'Local Band', salary: 25000, yearsNeeded: 2 },
      { title: 'Signed Artist', salary: 70000, yearsNeeded: 5 },
      { title: 'Popular Artist', salary: 250000, yearsNeeded: 9 },
      { title: 'Superstar', salary: 2000000, yearsNeeded: 15 }
    ]
  },
  {
    id: 'sports',
    name: 'Professional Sports',
    icon: '🏆',
    minSmarts: 30,
    degreeRequired: false,
    minHealth: 70,
    levels: [
      { title: 'Amateur Athlete', salary: 15000, yearsNeeded: 0 },
      { title: 'Minor League', salary: 35000, yearsNeeded: 2 },
      { title: 'Professional', salary: 120000, yearsNeeded: 4 },
      { title: 'Star Player', salary: 800000, yearsNeeded: 7 },
      { title: 'MVP', salary: 5000000, yearsNeeded: 12 }
    ]
  },
  {
    id: 'military',
    name: 'Military',
    icon: '🎖️',
    minSmarts: 40,
    degreeRequired: false,
    minHealth: 60,
    levels: [
      { title: 'Private', salary: 28000, yearsNeeded: 0 },
      { title: 'Corporal', salary: 35000, yearsNeeded: 2 },
      { title: 'Sergeant', salary: 48000, yearsNeeded: 6 },
      { title: 'Lieutenant', salary: 70000, yearsNeeded: 10 },
      { title: 'Colonel', salary: 110000, yearsNeeded: 16 },
      { title: 'General', salary: 200000, yearsNeeded: 25 }
    ]
  },
  {
    id: 'education',
    name: 'Teaching',
    icon: '📐',
    minSmarts: 50,
    degreeRequired: true,
    levels: [
      { title: 'Substitute Teacher', salary: 28000, yearsNeeded: 0 },
      { title: 'Teacher', salary: 48000, yearsNeeded: 1 },
      { title: 'Department Head', salary: 68000, yearsNeeded: 7 },
      { title: 'Principal', salary: 95000, yearsNeeded: 12 },
      { title: 'Superintendent', salary: 160000, yearsNeeded: 20 }
    ]
  },
  {
    id: 'food',
    name: 'Culinary Arts',
    icon: '👨‍🍳',
    minSmarts: 25,
    degreeRequired: false,
    levels: [
      { title: 'Kitchen Helper', salary: 22000, yearsNeeded: 0 },
      { title: 'Line Cook', salary: 30000, yearsNeeded: 2 },
      { title: 'Sous Chef', salary: 48000, yearsNeeded: 5 },
      { title: 'Head Chef', salary: 80000, yearsNeeded: 9 },
      { title: 'Executive Chef', salary: 130000, yearsNeeded: 15 },
      { title: 'Restaurant Owner', salary: 250000, yearsNeeded: 22 }
    ]
  },
  {
    id: 'crime',
    name: 'Crime',
    icon: '🦹',
    minSmarts: 20,
    degreeRequired: false,
    levels: [
      { title: 'Pickpocket', salary: 15000, yearsNeeded: 0 },
      { title: 'Burglar', salary: 30000, yearsNeeded: 2 },
      { title: 'Gang Member', salary: 55000, yearsNeeded: 4 },
      { title: 'Crime Boss', salary: 150000, yearsNeeded: 8 },
      { title: 'Drug Lord', salary: 600000, yearsNeeded: 15 }
    ],
    risk: true
  }
];

export const getCareerById = (id) => CAREER_TRACKS.find(c => c.id === id);
export const getAvailableCareers = (char) => {
  return CAREER_TRACKS.filter(c => {
    if (c.minSmarts && char.stats.smarts < c.minSmarts) return false;
    if (c.minLooks && char.stats.looks < c.minLooks) return false;
    if (c.minHealth && char.stats.health < c.minHealth) return false;
    if (c.degreeRequired && !char.education.degree) return false;
    if (c.postGradRequired && !char.education.postGrad) return false;
    return true;
  });
};
