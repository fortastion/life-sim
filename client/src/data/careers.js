export const CAREER_TRACKS = [
  {
    id: 'tech', name: 'Technology', icon: '💻', minSmarts: 60, degreeRequired: true, startAge: 22,
    description: 'Build the future — high pay, high stress, free snacks.',
    burnoutRisk: 0.55,
    levels: [
      { title: 'Junior Developer',   salary: 75000,  yearsNeeded: 0,  perks: ['Remote options', 'Health insurance'] },
      { title: 'Software Engineer',  salary: 110000, yearsNeeded: 2,  perks: ['Stock options', '401k match'] },
      { title: 'Senior Engineer',    salary: 155000, yearsNeeded: 5,  perks: ['Equity', 'Flexible hours'] },
      { title: 'Staff Engineer',     salary: 200000, yearsNeeded: 8,  perks: ['Signing bonus', 'Company car'] },
      { title: 'Principal Engineer', salary: 260000, yearsNeeded: 12, perks: ['Executive benefits', 'RSUs'] },
      { title: 'CTO',                salary: 450000, yearsNeeded: 18, perks: ['C-suite perks', 'Profit sharing'] },
    ],
  },
  {
    id: 'medicine', name: 'Medicine', icon: '🏥', minSmarts: 75, degreeRequired: true, postGradRequired: true, startAge: 26,
    description: 'Save lives, sacrifice your 20s, make bank.',
    burnoutRisk: 0.85,
    levels: [
      { title: 'Medical Resident',   salary: 60000,  yearsNeeded: 0,  perks: ['Loan forgiveness programs'] },
      { title: 'General Physician',  salary: 135000, yearsNeeded: 3,  perks: ['Health insurance', 'Malpractice coverage'] },
      { title: 'Specialist',         salary: 220000, yearsNeeded: 7,  perks: ['Private practice option', 'Conference travel'] },
      { title: 'Senior Consultant',  salary: 310000, yearsNeeded: 12, perks: ['Partnership stake', 'Research grants'] },
      { title: 'Chief of Medicine',  salary: 500000, yearsNeeded: 20, perks: ['Hospital equity', 'Named wing (eventually)'] },
    ],
  },
  {
    id: 'law', name: 'Law', icon: '⚖️', minSmarts: 65, degreeRequired: true, startAge: 24,
    description: 'Argue for a living — billable hours never sleep.',
    burnoutRisk: 0.75,
    levels: [
      { title: 'Paralegal',         salary: 48000,  yearsNeeded: 0,  perks: ['Tuition assistance'] },
      { title: 'Associate Attorney', salary: 95000, yearsNeeded: 2,  perks: ['Bar dues paid', 'Health insurance'] },
      { title: 'Attorney',          salary: 145000, yearsNeeded: 5,  perks: ['Case bonuses', 'CLE paid'] },
      { title: 'Senior Partner',    salary: 280000, yearsNeeded: 10, perks: ['Partnership income', 'Executive suite'] },
      { title: 'Managing Partner',  salary: 600000, yearsNeeded: 18, perks: ['Firm equity', 'Unlimited PTO'] },
    ],
  },
  {
    id: 'business', name: 'Business', icon: '📊', minSmarts: 45, degreeRequired: false, startAge: 18,
    description: 'Climb the corporate ladder one handshake at a time.',
    burnoutRisk: 0.45,
    levels: [
      { title: 'Sales Associate',  salary: 35000,  yearsNeeded: 0,  perks: ['Commission', 'Employee discount'] },
      { title: 'Account Manager',  salary: 58000,  yearsNeeded: 2,  perks: ['Health insurance', 'Car allowance'] },
      { title: 'Manager',          salary: 85000,  yearsNeeded: 5,  perks: ['Bonus structure', '401k'] },
      { title: 'Director',         salary: 140000, yearsNeeded: 9,  perks: ['Stock options', 'Executive dining'] },
      { title: 'VP',               salary: 220000, yearsNeeded: 14, perks: ['RSUs', 'Company car'] },
      { title: 'CEO',              salary: 550000, yearsNeeded: 20, perks: ['Profit sharing', 'Private jet access'] },
    ],
  },
  {
    id: 'entertainment', name: 'Entertainment', icon: '🎬', minSmarts: 30, minLooks: 50, degreeRequired: false, startAge: 16,
    description: 'Fame, rejection, and everything in between.',
    burnoutRisk: 0.60,
    levels: [
      { title: 'Background Actor',   salary: 20000,  yearsNeeded: 0,  perks: ['Screen time', 'Craft services'] },
      { title: 'Supporting Actor',   salary: 45000,  yearsNeeded: 2,  perks: ['Agent representation'] },
      { title: 'TV Actor',           salary: 100000, yearsNeeded: 5,  perks: ['SAG benefits', 'Publicity'] },
      { title: 'Movie Star',         salary: 600000, yearsNeeded: 10, perks: ['Award nominations', 'Endorsements'] },
      { title: 'Hollywood Legend',   salary: 6000000,yearsNeeded: 20, perks: ['Honorary degrees', 'Legacy deals'] },
    ],
  },
  {
    id: 'music', name: 'Music', icon: '🎵', minSmarts: 25, degreeRequired: false, startAge: 16,
    description: 'Chase the dream — the odds are bad but the life is real.',
    burnoutRisk: 0.50,
    levels: [
      { title: 'Street Performer',  salary: 12000,   yearsNeeded: 0,  perks: ['Freedom', 'Busking tips'] },
      { title: 'Local Band',        salary: 28000,   yearsNeeded: 2,  perks: ['Local fame', 'Bar gigs'] },
      { title: 'Signed Artist',     salary: 80000,   yearsNeeded: 5,  perks: ['Label backing', 'Studio access'] },
      { title: 'Popular Artist',    salary: 300000,  yearsNeeded: 9,  perks: ['Tour income', 'Merch deals'] },
      { title: 'Superstar',         salary: 2500000, yearsNeeded: 15, perks: ['Arena tours', 'Grammy chances'] },
    ],
  },
  {
    id: 'sports', name: 'Professional Sports', icon: '🏆', minSmarts: 30, minHealth: 70, degreeRequired: false, startAge: 16,
    description: 'Peak at 28, retire at 35, figure out the rest.',
    burnoutRisk: 0.40,
    levels: [
      { title: 'Amateur Athlete',  salary: 18000,   yearsNeeded: 0,  perks: ['Coaching', 'Equipment'] },
      { title: 'Minor League',     salary: 40000,   yearsNeeded: 2,  perks: ['Team insurance', 'Travel'] },
      { title: 'Professional',     salary: 140000,  yearsNeeded: 4,  perks: ['Endorsement eligibility', 'Agent'] },
      { title: 'Star Player',      salary: 900000,  yearsNeeded: 7,  perks: ['Sponsorships', 'Luxury travel'] },
      { title: 'MVP',              salary: 6000000, yearsNeeded: 12, perks: ['Lifetime deals', 'Hall of fame track'] },
    ],
  },
  {
    id: 'military', name: 'Military', icon: '🎖️', minSmarts: 40, minHealth: 60, degreeRequired: false, startAge: 18,
    description: 'Serve, sacrifice, and earn respect no resume can buy.',
    burnoutRisk: 0.55,
    levels: [
      { title: 'Private',    salary: 30000,  yearsNeeded: 0,  perks: ['Housing allowance', 'Healthcare'] },
      { title: 'Corporal',   salary: 38000,  yearsNeeded: 2,  perks: ['Education benefits', 'Housing'] },
      { title: 'Sergeant',   salary: 52000,  yearsNeeded: 6,  perks: ['Leadership bonus', 'Retirement track'] },
      { title: 'Lieutenant', salary: 75000,  yearsNeeded: 10, perks: ['Officer benefits', 'Base access'] },
      { title: 'Colonel',    salary: 120000, yearsNeeded: 16, perks: ['Security clearance', 'Pension'] },
      { title: 'General',    salary: 220000, yearsNeeded: 25, perks: ['Government vehicle', 'Full pension'] },
    ],
  },
  {
    id: 'education', name: 'Teaching', icon: '📐', minSmarts: 50, degreeRequired: true, startAge: 22,
    description: 'Shape the next generation for criminally low pay.',
    burnoutRisk: 0.30,
    levels: [
      { title: 'Substitute Teacher', salary: 30000,  yearsNeeded: 0,  perks: ['Flexible schedule'] },
      { title: 'Teacher',            salary: 52000,  yearsNeeded: 1,  perks: ['Summers off', 'Pension track'] },
      { title: 'Department Head',    salary: 72000,  yearsNeeded: 7,  perks: ['Curriculum control', 'Stipend'] },
      { title: 'Principal',          salary: 100000, yearsNeeded: 12, perks: ['Admin benefits', 'District car'] },
      { title: 'Superintendent',     salary: 175000, yearsNeeded: 20, perks: ['Full pension', 'District perks'] },
    ],
  },
  {
    id: 'food', name: 'Culinary Arts', icon: '👨‍🍳', minSmarts: 25, degreeRequired: false, startAge: 16,
    description: 'Controlled chaos, sharp knives, and 14-hour days.',
    burnoutRisk: 0.65,
    levels: [
      { title: 'Kitchen Helper',    salary: 24000,  yearsNeeded: 0,  perks: ['Free meals', 'Tips'] },
      { title: 'Line Cook',         salary: 33000,  yearsNeeded: 2,  perks: ['Skill development'] },
      { title: 'Sous Chef',         salary: 52000,  yearsNeeded: 5,  perks: ['Menu input', 'Staff meals'] },
      { title: 'Head Chef',         salary: 88000,  yearsNeeded: 9,  perks: ['Kitchen autonomy', 'PR opportunities'] },
      { title: 'Executive Chef',    salary: 145000, yearsNeeded: 15, perks: ['Multiple locations', 'TV potential'] },
      { title: 'Restaurant Owner',  salary: 280000, yearsNeeded: 22, perks: ['Equity', 'Legacy brand'] },
    ],
  },
  {
    id: 'crime', name: 'Crime', icon: '🦹', minSmarts: 20, degreeRequired: false, startAge: 16,
    description: 'High risk, high reward — one bad day ends everything.',
    burnoutRisk: 0.30,
    risk: true,
    levels: [
      { title: 'Pickpocket',  salary: 16000,  yearsNeeded: 0,  perks: ['No boss', 'Cash in hand'] },
      { title: 'Burglar',     salary: 35000,  yearsNeeded: 2,  perks: ['Flexible hours'] },
      { title: 'Gang Member', salary: 60000,  yearsNeeded: 4,  perks: ['Protection', 'Connections'] },
      { title: 'Crime Boss',  salary: 180000, yearsNeeded: 8,  perks: ['Loyalty', 'Territory'] },
      { title: 'Drug Lord',   salary: 700000, yearsNeeded: 15, perks: ['Empire', 'Everyone fears you'] },
    ],
  },
  {
    id: 'trades', name: 'Skilled Trades', icon: '🔧', minSmarts: 30, degreeRequired: false, startAge: 18,
    description: 'Recession-proof, always in demand, and you work with your hands.',
    burnoutRisk: 0.35,
    levels: [
      { title: 'Apprentice',        salary: 35000,  yearsNeeded: 0,  perks: ['Paid training', 'Tools provided'] },
      { title: 'Journeyman',        salary: 58000,  yearsNeeded: 3,  perks: ['Union benefits', 'Health insurance'] },
      { title: 'Licensed Tradesman',salary: 80000,  yearsNeeded: 6,  perks: ['Own schedule', 'Van + tools'] },
      { title: 'Master Tradesman',  salary: 115000, yearsNeeded: 10, perks: ['Premium clients', 'Subcontractors'] },
      { title: 'Contractor Owner',  salary: 220000, yearsNeeded: 16, perks: ['Business equity', 'Crew management'] },
    ],
  },
  {
    id: 'realestate', name: 'Real Estate', icon: '🏠', minSmarts: 40, degreeRequired: false, startAge: 20,
    description: 'Commission-based hustle — feast or famine, but the ceiling is high.',
    burnoutRisk: 0.45,
    levels: [
      { title: 'Real Estate Assistant', salary: 28000,  yearsNeeded: 0,  perks: ['Mentorship', 'License sponsorship'] },
      { title: 'Agent',                 salary: 55000,  yearsNeeded: 1,  perks: ['Commission splits', 'Flexible hours'] },
      { title: 'Senior Agent',          salary: 100000, yearsNeeded: 4,  perks: ['Referral network', 'Luxury listings'] },
      { title: 'Broker',                salary: 180000, yearsNeeded: 8,  perks: ['Agent team income', 'Office'] },
      { title: 'Real Estate Developer', salary: 500000, yearsNeeded: 15, perks: ['Project equity', 'Land ownership'] },
    ],
  },
  {
    id: 'nursing', name: 'Nursing & Healthcare', icon: '🩺', minSmarts: 55, degreeRequired: true, startAge: 22,
    description: 'The backbone of healthcare — underappreciated and overworked.',
    burnoutRisk: 0.70,
    levels: [
      { title: 'CNA',              salary: 36000,  yearsNeeded: 0,  perks: ['Certification support', 'Scrubs allowance'] },
      { title: 'LPN',              salary: 52000,  yearsNeeded: 2,  perks: ['Healthcare benefits', 'Shift differentials'] },
      { title: 'Registered Nurse', salary: 78000,  yearsNeeded: 4,  perks: ['Travel nurse option', 'Overtime pay'] },
      { title: 'Nurse Practitioner',salary: 125000,yearsNeeded: 9,  perks: ['Prescribing rights', 'Private practice'] },
      { title: 'Chief Nursing Officer',salary: 200000, yearsNeeded: 18, perks: ['Admin role', 'Hospital equity'] },
    ],
  },
  {
    id: 'finance', name: 'Finance & Banking', icon: '💰', minSmarts: 60, degreeRequired: true, startAge: 22,
    description: 'Move money, make money — the oldest game in town.',
    burnoutRisk: 0.70,
    levels: [
      { title: 'Bank Teller',       salary: 38000,  yearsNeeded: 0,  perks: ['Banking perks', 'Insurance'] },
      { title: 'Financial Analyst', salary: 72000,  yearsNeeded: 2,  perks: ['Series 7 sponsorship', '401k'] },
      { title: 'Associate',         salary: 110000, yearsNeeded: 5,  perks: ['Bonus eligible', 'Bloomberg access'] },
      { title: 'VP Finance',        salary: 180000, yearsNeeded: 9,  perks: ['Deal bonuses', 'Car service'] },
      { title: 'Managing Director', salary: 350000, yearsNeeded: 14, perks: ['Carry', 'Equity stakes'] },
      { title: 'CFO',               salary: 700000, yearsNeeded: 22, perks: ['Stock grants', 'C-suite package'] },
    ],
  },
  {
    id: 'journalism', name: 'Journalism & Media', icon: '📰', minSmarts: 55, degreeRequired: false, startAge: 18,
    description: 'Tell the stories that matter — pay is rough but the work is real.',
    burnoutRisk: 0.55,
    levels: [
      { title: 'Freelance Writer',   salary: 22000,  yearsNeeded: 0,  perks: ['Flexibility', 'Bylines'] },
      { title: 'Staff Reporter',     salary: 42000,  yearsNeeded: 2,  perks: ['Press credentials', 'Insurance'] },
      { title: 'Senior Journalist',  salary: 68000,  yearsNeeded: 5,  perks: ['Column rights', 'Press trips'] },
      { title: 'Editor',             salary: 95000,  yearsNeeded: 9,  perks: ['Editorial control', 'Staff'] },
      { title: 'Editor-in-Chief',    salary: 180000, yearsNeeded: 16, perks: ['Publication equity', 'Speaking fees'] },
    ],
  },
  {
    id: 'politics', name: 'Government & Politics', icon: '🏛️', minSmarts: 65, degreeRequired: true, startAge: 25,
    description: 'Serve the public or serve yourself — only you know which.',
    burnoutRisk: 0.60,
    levels: [
      { title: 'Campaign Staffer',  salary: 32000,  yearsNeeded: 0,  perks: ['Political connections', 'Insider access'] },
      { title: 'City Councilmember',salary: 55000,  yearsNeeded: 3,  perks: ['Constituent power', 'Public pension'] },
      { title: 'State Representative',salary: 85000,yearsNeeded: 7,  perks: ['Lobbyist access', 'Staff'] },
      { title: 'Mayor / Senator',   salary: 175000, yearsNeeded: 12, perks: ['Motorcade', 'Security detail'] },
      { title: 'Governor',          salary: 180000, yearsNeeded: 18, perks: ['Mansion', 'State resources'] },
      { title: 'President',         salary: 400000, yearsNeeded: 30, perks: ['Air Force One', 'History books'] },
    ],
  },
  {
    id: 'freelance', name: 'Freelancer', icon: '🧑‍💻', minSmarts: 35, degreeRequired: false, startAge: 18,
    description: 'Be your own boss — freedom is the perk, instability is the cost.',
    burnoutRisk: 0.30,
    levels: [
      { title: 'Side Hustler',     salary: 15000,  yearsNeeded: 0,  perks: ['Work anywhere', 'Own schedule'] },
      { title: 'Freelancer',       salary: 45000,  yearsNeeded: 1,  perks: ['Client variety', 'Rate control'] },
      { title: 'Consultant',       salary: 90000,  yearsNeeded: 4,  perks: ['Retainer clients', 'Premium rates'] },
      { title: 'Senior Consultant',salary: 160000, yearsNeeded: 8,  perks: ['Speaking gigs', 'Course income'] },
      { title: 'Agency Owner',     salary: 350000, yearsNeeded: 14, perks: ['Team leverage', 'Passive income'] },
    ],
  },
];

export const getCareerById = (id) => CAREER_TRACKS.find(c => c.id === id);

export const getAvailableCareers = (char) => {
  const totalFollowers = (char.socialMedia?.accounts || []).reduce((s, a) => s + (a.followers || 0), 0);
  return CAREER_TRACKS.filter(c => {
    if (c.minSmarts  && char.stats.smarts  < c.minSmarts)  return false;
    if (c.minLooks   && char.stats.looks   < c.minLooks)   return false;
    if (c.minHealth  && char.stats.health  < c.minHealth)  return false;
    if (c.startAge   && char.age           < c.startAge)   return false;
    if (c.degreeRequired && !char.education?.degree)       return false;
    if (c.postGradRequired && !char.education?.postGrad)   return false;
    if (c.id === 'influencer' && totalFollowers < 100000)  return false;
    return true;
  });
};
