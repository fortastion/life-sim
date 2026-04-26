// Event types: good, bad, neutral, choice, milestone, crime, health, friend
// Effects keys: happiness, health, smarts, looks, money, debt
// requires: { stat: minValue } — stat gate (smarts, health, looks, happiness)
// consequenceOf: 'eventId' — triggered by prior choice
// stage: hint for life-stage weighting (infant|child|teen|youngAdult|adult|midlife|senior)

// ─── Personalization helper ────────────────────────────────────────────────────
export function personalizeEvent(event, character) {
  if (!event || !event.message) return event;
  let msg = event.message;
  let choices = event.choices;

  const partner   = character.relationships?.partner?.firstName || character.relationships?.partner?.name || 'your partner';
  const spouse    = character.relationships?.married ? (character.relationships?.partner?.firstName || 'your spouse') : 'your partner';
  const job       = character.career?.jobTitle || 'your job';
  const employer  = character.career?.employer || 'your company';
  const kids      = character.relationships?.children || [];
  const kid1      = kids[0]?.firstName || kids[0]?.name || 'your child';
  const friend1   = character.relationships?.friends?.[0]?.firstName || character.relationships?.friends?.[0]?.name || 'your friend';
  const sibling1  = character.family?.siblings?.[0]?.firstName || character.family?.siblings?.[0]?.name || 'your sibling';
  const car       = character.assets?.find(a => a.category === 'vehicle')?.name || 'your car';
  const house     = character.assets?.find(a => a.category === 'property')?.name || 'your home';

  msg = msg
    .replace(/\[partner\]/g, partner)
    .replace(/\[spouse\]/g, spouse)
    .replace(/\[job\]/g, job)
    .replace(/\[employer\]/g, employer)
    .replace(/\[kid\]/g, kid1)
    .replace(/\[friend\]/g, friend1)
    .replace(/\[sibling\]/g, sibling1)
    .replace(/\[car\]/g, car)
    .replace(/\[house\]/g, house);

  let personalizedChoices = choices;
  if (choices) {
    personalizedChoices = choices.map(c => ({
      ...c,
      text: (c.text || '').replace(/\[partner\]/g, partner).replace(/\[spouse\]/g, spouse).replace(/\[job\]/g, job).replace(/\[employer\]/g, employer).replace(/\[kid\]/g, kid1).replace(/\[friend\]/g, friend1),
      result: (c.result || '').replace(/\[partner\]/g, partner).replace(/\[spouse\]/g, spouse).replace(/\[job\]/g, job).replace(/\[employer\]/g, employer).replace(/\[kid\]/g, kid1).replace(/\[friend\]/g, friend1),
    }));
  }

  return { ...event, message: msg, choices: personalizedChoices };
}

export const EVENTS = [
  // ── BABY / TODDLER (0-4) ──────────────────────────────────────────────────
  { id: 'first_words',        stage: 'infant', minAge: 1,  maxAge: 2,  type: 'milestone', icon: '👶', message: 'You said your first words! Your parents were thrilled.', effects: { happiness: 5 } },
  { id: 'first_steps',        stage: 'infant', minAge: 1,  maxAge: 2,  type: 'milestone', icon: '🚶', message: 'You took your first steps today!', effects: { health: 2, happiness: 3 } },
  { id: 'tantrum',            stage: 'infant', minAge: 2,  maxAge: 4,  type: 'bad',       icon: '😤', message: 'You threw a massive tantrum in the supermarket. Everyone stared.', effects: { happiness: -2 } },
  { id: 'imaginary_friend',   stage: 'infant', minAge: 3,  maxAge: 5,  type: 'good',      icon: '🌈', message: 'You created an imaginary friend named Zooble. Very creative.', effects: { happiness: 5, smarts: 2 } },
  { id: 'fell_down_stairs',   stage: 'infant', minAge: 1,  maxAge: 4,  type: 'bad',       icon: '🤕', message: 'You fell down the stairs. You were okay but it hurt a lot.', effects: { health: -5, happiness: -3 } },
  { id: 'parents_fight_baby', stage: 'infant', minAge: 1,  maxAge: 5,  type: 'bad',       icon: '😢', message: 'Your parents had a big fight. You cried yourself to sleep.', effects: { happiness: -5 } },
  { id: 'new_sibling',        stage: 'infant', minAge: 1,  maxAge: 5,  type: 'neutral',   icon: '👶', message: 'Your mom had a new baby. You are now a big sibling!', effects: { happiness: -2 }, special: 'add_sibling' },
  { id: 'got_toy',            stage: 'infant', minAge: 2,  maxAge: 5,  type: 'good',      icon: '🧸', message: 'You got the toy you wanted for Christmas. Life is great.', effects: { happiness: 8 } },

  // ── CHILD (5-12) ─────────────────────────────────────────────────────────
  { id: 'science_fair_win',   stage: 'child', minAge: 8,  maxAge: 12, type: 'good',    icon: '🏆', message: 'You won first place at the school science fair!', effects: { smarts: 5, happiness: 8 } },
  { id: 'bullied',            stage: 'child', minAge: 6,  maxAge: 13, type: 'choice',  icon: '😠', message: 'An older kid at school has been bullying you.',
    choices: [
      { text: 'Fight Back (-5 health, +happiness)', effects: { happiness: 3, health: -5 }, result: 'You fought back. You got a bruise but they left you alone.' },
      { text: 'Tell a Teacher (+happiness)',         effects: { happiness: 2 },             result: 'The teacher intervened. The bully got detention.' },
      { text: 'Ignore It (-8 happiness)',            effects: { happiness: -8 },            result: 'You tried to ignore it, but it really got to you.' },
    ]
  },
  { id: 'made_best_friend',   stage: 'child', minAge: 5,  maxAge: 12, type: 'good',    icon: '🤝', message: 'You made a best friend at school. They are awesome.', effects: { happiness: 10 }, special: 'add_friend' },
  { id: 'got_first_pet',      stage: 'child', minAge: 5,  maxAge: 12, type: 'good',    icon: '🐶', message: 'Your parents got you a pet! You are overjoyed.', effects: { happiness: 12 } },
  { id: 'pet_died',           stage: 'child', minAge: 6,  maxAge: 15, type: 'bad',     icon: '😭', message: 'Your beloved pet passed away. You are devastated.', effects: { happiness: -15 }, condition: 'hasPet' },
  { id: 'cheating_caught',    stage: 'child', minAge: 8,  maxAge: 14, type: 'bad',     icon: '📝', message: 'You got caught cheating on a test. You got detention.', effects: { smarts: -3, happiness: -5 } },
  { id: 'honor_roll',         stage: 'child', minAge: 8,  maxAge: 18, type: 'good',    icon: '📜', message: 'You made the honor roll! Your parents are proud.', effects: { smarts: 3, happiness: 5 } },
  { id: 'broke_neighbors_window', stage: 'child', minAge: 7, maxAge: 13, type: 'choice', icon: '⚾', message: "You accidentally broke your neighbor's window with a baseball.",
    choices: [
      { text: 'Confess (-$200, +happiness)',   effects: { happiness: 3, money: -200 },  result: 'You were honest. They appreciated it but you paid for the damage.' },
      { text: "Pretend it wasn't you (-smarts)",effects: { happiness: -5, smarts: -1 }, result: 'They suspected you anyway. Guilt hit hard.' },
      { text: 'Blame [friend] (-10 happiness)', effects: { happiness: -10 },             result: '[friend] found out you blamed them. They never forgave you.' },
    ]
  },
  { id: 'skip_school',        stage: 'child', minAge: 10, maxAge: 17, type: 'choice',  icon: '🏫', message: 'Your friends want to skip school and hang out.',
    choices: [
      { text: 'Skip It! (+happiness, -3 smarts)', effects: { happiness: 8, smarts: -3 }, result: 'You had a blast but missed an important test.' },
      { text: 'Go to School (+3 smarts)',          effects: { smarts: 3, happiness: -2 }, result: 'Responsible choice. Your friends called you boring though.' },
    ]
  },
  { id: 'parents_divorce',    stage: 'child', minAge: 5,  maxAge: 16, type: 'bad',     icon: '💔', message: 'Your parents announced they are getting divorced.', effects: { happiness: -20 }, condition: 'parentsMarried' },
  { id: 'moved_schools',      stage: 'child', minAge: 7,  maxAge: 14, type: 'bad',     icon: '🏫', message: 'Your family moved and you started at a completely new school.', effects: { happiness: -8 } },
  { id: 'won_sports',         stage: 'child', minAge: 8,  maxAge: 16, type: 'good',    icon: '⚽', message: 'Your team won the championships! You were the MVP.', effects: { happiness: 10, health: 3 } },
  { id: 'found_money',        minAge: 6,      maxAge: 99, type: 'good',                icon: '💰', message: 'You found $50 on the sidewalk. Nice!', effects: { happiness: 5, money: 50 } },
  { id: 'reading_habit',      stage: 'child', minAge: 7,  maxAge: 12, type: 'good',    icon: '📖', message: 'You discovered you love reading. You devoured 20 books this year.', effects: { smarts: 8, happiness: 4 } },
  { id: 'summer_camp',        stage: 'child', minAge: 8,  maxAge: 14, type: 'good',    icon: '🏕️', message: 'You went to summer camp and had the time of your life.', effects: { happiness: 10, health: 3 }, special: 'add_friend' },

  // ── TEEN (13-17) ─────────────────────────────────────────────────────────
  { id: 'first_relationship', stage: 'teen', minAge: 13, maxAge: 17, type: 'milestone', icon: '💕', message: 'You got your first boyfriend/girlfriend!', effects: { happiness: 15 }, special: 'add_partner' },
  { id: 'first_heartbreak',   stage: 'teen', minAge: 14, maxAge: 18, type: 'bad',       icon: '💔', message: 'Your first love broke up with you out of nowhere. It hurts so much.', effects: { happiness: -18 }, condition: 'hasPartner', special: 'remove_partner' },
  { id: 'prom_night',         stage: 'teen', minAge: 16, maxAge: 18, type: 'good',      icon: '🕺', message: 'Prom night was absolutely magical!', effects: { happiness: 12 } },
  { id: 'first_job',          stage: 'teen', minAge: 15, maxAge: 18, type: 'milestone', icon: '💼', message: "You got your first part-time job! Minimum wage, but it's yours.", effects: { happiness: 8, money: 2000 } },
  { id: 'drug_offer',         stage: 'teen', minAge: 14, maxAge: 19, type: 'choice',    icon: '💊', message: 'A friend offered you drugs at a party.',
    choices: [
      { text: 'Try Them (+happiness, -8 health)', effects: { happiness: 5, health: -8 }, result: "You tried them. It felt weird. You're hoping it was just once.", special: 'addiction_risk' },
      { text: 'Decline (-2 happiness)',            effects: { happiness: -2 },             result: "You said no. Some people laughed, but you're glad you did." },
    ]
  },
  { id: 'got_license',        stage: 'teen', minAge: 16, maxAge: 18, type: 'milestone', icon: '🚗', message: 'You passed your driving test on the first try!', effects: { happiness: 10 } },
  { id: 'failed_license',     stage: 'teen', minAge: 16, maxAge: 18, type: 'bad',       icon: '🚗', message: 'You failed your driving test. Again.', effects: { happiness: -5 } },
  { id: 'snuck_out',          stage: 'teen', minAge: 14, maxAge: 17, type: 'choice',    icon: '🌙', message: 'Your parents caught you sneaking back in at 3am.',
    choices: [
      { text: 'Come Clean (-5 happiness)', effects: { happiness: -5 }, result: 'They grounded you for a month but appreciated the honesty.' },
      { text: 'Make Up a Story (+happiness, -smarts)', effects: { happiness: 2, smarts: -2 }, result: 'They half-believed you. Awkward dinner for weeks.' },
      { text: 'Run Back Out (-10 happiness)', effects: { happiness: -10 }, result: 'You ran. They called the police. You came home in shame.' },
    ]
  },
  { id: 'college_acceptance', stage: 'teen', minAge: 17, maxAge: 18, type: 'milestone', icon: '🎓', message: 'You got your college acceptance letter!', effects: { happiness: 15, smarts: 3 }, condition: 'highSmarts', requires: { smarts: 65 } },
  { id: 'college_rejection',  stage: 'teen', minAge: 17, maxAge: 18, type: 'bad',       icon: '📩', message: 'You got rejected from your dream college.', effects: { happiness: -12 } },
  { id: 'fender_bender',      minAge: 16,    maxAge: 22, type: 'bad',                   icon: '💥', message: 'You got into a fender bender. Your parents are not happy.', effects: { happiness: -8, money: -800 } },
  { id: 'viral_video',        minAge: 14,    maxAge: 25, type: 'good',                  icon: '📱', message: 'One of your videos went viral! You have 100k followers overnight.', effects: { happiness: 15, looks: 3 } },
  { id: 'suspended',          stage: 'teen', minAge: 13, maxAge: 17, type: 'bad',       icon: '📛', message: 'You got suspended from school for a week.', effects: { happiness: -8, smarts: -3 } },
  { id: 'teen_pregnancy_scare', stage: 'teen', minAge: 15, maxAge: 19, type: 'bad',     icon: '😰', message: 'You had a pregnancy scare. Fortunately it was a false alarm.', effects: { happiness: -10, health: -2 }, condition: 'hasPartner' },

  // ── YOUNG ADULT (18-25) ──────────────────────────────────────────────────
  { id: 'moved_out',          stage: 'youngAdult', minAge: 18, maxAge: 22, type: 'milestone', icon: '🏠', message: "You moved out of your parents' house into your own place!", effects: { happiness: 15 }, special: 'move_out' },
  { id: 'college_graduate',   stage: 'youngAdult', minAge: 21, maxAge: 26, type: 'milestone', icon: '🎓', message: 'You graduated from college! Time to take on the world.', effects: { happiness: 20, smarts: 5 }, condition: 'inUniversity', special: 'graduate' },
  { id: 'student_loan_crisis',stage: 'youngAdult', minAge: 22, maxAge: 30, type: 'bad',       icon: '💸', message: 'Your student loan payments started. $1,200/month. Ouch.', effects: { happiness: -8 }, condition: 'hasStudentDebt' },
  { id: 'wild_vacation',      stage: 'youngAdult', minAge: 18, maxAge: 26, type: 'good',      icon: '🏖️', message: 'You went on a wild spring break trip with friends. Unforgettable.', effects: { happiness: 15, health: -3 } },
  { id: 'first_real_job',     stage: 'youngAdult', minAge: 21, maxAge: 26, type: 'milestone', icon: '👔', message: 'You landed your first real career-level job!', effects: { happiness: 18 }, condition: 'unemployed' },
  { id: 'met_someone_special',stage: 'youngAdult', minAge: 18, maxAge: 28, type: 'good',      icon: '💘', message: 'You met someone special at a party. Sparks are flying!', effects: { happiness: 12 }, condition: 'noPartner', special: 'add_partner' },
  { id: 'fwb_situation',      stage: 'youngAdult', minAge: 18, maxAge: 26, type: 'neutral',   icon: '😏', message: 'You found yourself in a "friends with benefits" situation. Complicated.', effects: { happiness: 5 } },
  { id: 'roommate_nightmare', stage: 'youngAdult', minAge: 18, maxAge: 25, type: 'bad',       icon: '😤', message: 'Your roommate is an absolute nightmare. They never clean.', effects: { happiness: -8 } },
  { id: 'viral_app',          stage: 'youngAdult', minAge: 18, maxAge: 30, type: 'good',      icon: '📱', message: 'The app you built in a weekend went viral! Investors are calling.', effects: { happiness: 15, money: 50000 }, requires: { smarts: 75 } },
  { id: 'identity_crisis',    stage: 'youngAdult', minAge: 18, maxAge: 26, type: 'bad',       icon: '🌀', message: 'You had a quarter-life crisis. What are you even doing?', effects: { happiness: -10 } },
  { id: 'gambling_win',       minAge: 18, maxAge: 99, type: 'good', icon: '🎰', message: 'You hit it big at the casino!', effects: { happiness: 12, money: 5000 } },
  { id: 'gambling_loss',      minAge: 18, maxAge: 99, type: 'bad',  icon: '🎰', message: 'You lost a lot of money gambling. You need help.', effects: { happiness: -10, money: -3000 } },

  // ── ADULT (26-45) ────────────────────────────────────────────────────────
  { id: 'proposal',           stage: 'adult', minAge: 24, maxAge: 40, type: 'milestone', icon: '💍', message: 'You proposed! They said YES!', effects: { happiness: 25 }, condition: 'hasPartner', special: 'engage' },
  { id: 'got_proposed_to',    stage: 'adult', minAge: 22, maxAge: 40, type: 'milestone', icon: '💍', message: 'Your partner got down on one knee. Your heart is pounding!', effects: { happiness: 25 }, condition: 'hasPartner', special: 'engage' },
  { id: 'wedding',            stage: 'adult', minAge: 24, maxAge: 45, type: 'milestone', icon: '👰', message: 'Today was the happiest day of your life. You got married!', effects: { happiness: 30, money: -15000 }, condition: 'engaged', special: 'marry' },
  { id: 'first_child',        stage: 'adult', minAge: 24, maxAge: 42, type: 'milestone', icon: '🍼', message: 'You welcomed your first child into the world. Life will never be the same.', effects: { happiness: 25, health: -5 }, condition: 'married', special: 'add_child' },
  { id: 'second_child',       stage: 'adult', minAge: 26, maxAge: 44, type: 'good',      icon: '🍼', message: 'Baby number two arrived! Your home is gloriously chaotic.', effects: { happiness: 15, money: -5000 }, condition: 'hasChildren', special: 'add_child' },
  { id: 'miscarriage',        stage: 'adult', minAge: 24, maxAge: 42, type: 'bad',       icon: '😔', message: 'You suffered a miscarriage. The grief is overwhelming.', effects: { happiness: -25, health: -8 }, condition: 'married' },
  { id: 'promotion',          stage: 'adult', minAge: 25, maxAge: 60, type: 'good',      icon: '📈', message: 'You got promoted at [employer]! New title, bigger paycheck.', effects: { happiness: 15 }, condition: 'employed', special: 'promote' },
  { id: 'fired',              stage: 'adult', minAge: 22, maxAge: 60, type: 'bad',       icon: '📦', message: 'You got fired from [employer]. Walked out with a box of your stuff.', effects: { happiness: -20 }, condition: 'employed', special: 'fire' },
  { id: 'bought_house',       stage: 'adult', minAge: 26, maxAge: 50, type: 'milestone', icon: '🏡', message: "You bought your first home! 30-year mortgage. You're officially a homeowner.", effects: { happiness: 18, money: -30000 } },
  { id: 'divorce',            stage: 'adult', minAge: 26, maxAge: 60, type: 'bad',       icon: '💔', message: 'Your marriage fell apart. You and [spouse] are getting divorced.', effects: { happiness: -25, money: -20000 }, condition: 'married', special: 'divorce' },
  { id: 'affair_discovered',  stage: 'adult', minAge: 26, maxAge: 55, type: 'bad',       icon: '😱', message: '[spouse] discovered your affair. Everything is falling apart.', effects: { happiness: -30 }, condition: 'married' },
  { id: 'coworker_rivalry',   stage: 'adult', minAge: 22, maxAge: 55, type: 'bad',       icon: '😤', message: 'A coworker at [employer] is actively trying to sabotage your work.', effects: { happiness: -8 }, condition: 'employed' },
  { id: 'lawsuit',            minAge: 24, maxAge: 60, type: 'bad',  icon: '⚖️', message: 'Someone sued you. Legal bills are mounting fast.', effects: { happiness: -15, money: -25000 } },
  { id: 'inheritance',        minAge: 20, maxAge: 60, type: 'good', icon: '🏛️', message: 'A distant relative left you a substantial inheritance.', effects: { happiness: 10, money: 50000 } },
  { id: 'car_totaled',        minAge: 18, maxAge: 70, type: 'bad',  icon: '🚗', message: '[car] got totaled. At least you\'re okay.', effects: { happiness: -10, money: -8000, health: -5 } },
  { id: 'startup_success',    stage: 'adult', minAge: 22, maxAge: 45, type: 'good', icon: '🚀', message: 'Your startup got acquired for a life-changing amount!', effects: { happiness: 30, money: 500000 }, requires: { smarts: 80 } },
  { id: 'bankruptcy',         stage: 'adult', minAge: 26, maxAge: 60, type: 'bad',  icon: '📉', message: 'Your business failed and you had to declare bankruptcy.', effects: { happiness: -30, money: -50000 } },
  { id: 'published_book',     minAge: 22, maxAge: 70, type: 'good', icon: '📚', message: 'You got a book published! It\'s selling really well.', effects: { happiness: 15, smarts: 5, money: 20000 }, requires: { smarts: 70 } },

  // ── MIDDLE AGE (46-65) ────────────────────────────────────────────────────
  { id: 'midlife_crisis',  stage: 'midlife', minAge: 40, maxAge: 55, type: 'choice', icon: '🏎️', message: "You're having a full-on mid-life crisis.",
    choices: [
      { text: 'Buy a Sports Car (-$60k, +happiness)', effects: { happiness: 10, money: -60000 }, result: 'Vroom vroom! You feel 25 again.' },
      { text: 'Get a Dramatic Haircut (+looks)',       effects: { happiness: 5, looks: 3 },       result: 'Bold new look. People are... surprised.' },
      { text: 'Quit Your Job (-$30k, +happiness)',     effects: { happiness: 5, money: -30000 },  result: 'You rage-quit and took three months off to find yourself.' },
      { text: 'Embrace It Gracefully (+smarts)',       effects: { happiness: 8, smarts: 3 },      result: 'You accepted this phase of life. You feel wise and at peace.' },
    ]
  },
  { id: 'empty_nest',          stage: 'midlife', minAge: 44, maxAge: 62, type: 'neutral',   icon: '🏠', message: 'Your last child moved out for college. [house] feels very quiet.', effects: { happiness: -5 }, condition: 'hasChildren' },
  { id: 'grandchild_born',     stage: 'midlife', minAge: 44, maxAge: 75, type: 'milestone', icon: '👴', message: 'You became a grandparent today! Time flies.', effects: { happiness: 20 }, condition: 'hasChildren', special: 'add_grandchild' },
  { id: 'best_friend_died',    minAge: 35, maxAge: 80, type: 'bad',     icon: '😢', message: '[friend] passed away unexpectedly. The world feels emptier.', effects: { happiness: -22 } },
  { id: 'heart_attack_scare',  stage: 'midlife', minAge: 40, maxAge: 70, type: 'bad', icon: '❤️‍🩹', message: 'You had a heart attack scare. Tests came back okay, but it was terrifying.', effects: { health: -10, happiness: -8 } },
  { id: 'diabetes_diagnosis',  stage: 'midlife', minAge: 35, maxAge: 75, type: 'bad', icon: '💉', message: 'You were diagnosed with Type 2 diabetes.', effects: { health: -15, happiness: -10 }, special: 'add_condition' },
  { id: 'cancer_scare',        minAge: 35, maxAge: 80, type: 'bad',     icon: '🏥', message: 'A cancer scare sent you spiraling. Tests came back benign, thankfully.', effects: { health: -5, happiness: -15 } },
  { id: 'laid_off',            stage: 'midlife', minAge: 40, maxAge: 62, type: 'bad', icon: '📦', message: 'The company downsized. After years at [employer], you were laid off.', effects: { happiness: -22 }, condition: 'employed', special: 'fire' },
  { id: 'partner_sick',        minAge: 35, maxAge: 75, type: 'bad',     icon: '🏥', message: '[spouse] got seriously ill. You\'re both scared.', effects: { happiness: -18, money: -10000 }, condition: 'married' },
  { id: 'renewed_vows',        minAge: 40, maxAge: 70, type: 'good',    icon: '💍', message: 'You and [spouse] renewed your vows on your anniversary.', effects: { happiness: 15 }, condition: 'married' },

  // ── SENIOR (66-80) ───────────────────────────────────────────────────────
  { id: 'retired',             stage: 'senior', minAge: 62, maxAge: 72, type: 'milestone', icon: '🏖️', message: 'You finally retired from [employer]! Time to actually enjoy life.', effects: { happiness: 20 }, condition: 'employed', special: 'retire' },
  { id: 'senior_dementia',     stage: 'senior', minAge: 70, maxAge: 90, type: 'bad', icon: '🧠', message: "You've been having more and more memory lapses.", effects: { health: -10, happiness: -12, smarts: -10 }, special: 'add_condition' },
  { id: 'hip_replacement',     stage: 'senior', minAge: 65, maxAge: 85, type: 'bad', icon: '🦴', message: 'You had a hip replacement surgery. Recovery was brutal.', effects: { health: -5, money: -20000 } },
  { id: 'travel_bucket_list',  stage: 'senior', minAge: 62, maxAge: 80, type: 'good', icon: '✈️', message: 'You finally took that dream trip around the world!', effects: { happiness: 18, money: -15000 } },
  { id: 'partner_dies',        stage: 'senior', minAge: 60, maxAge: 90, type: 'bad', icon: '💔', message: '[spouse] of many years passed away. The grief is indescribable.', effects: { happiness: -35, health: -10 }, condition: 'married', special: 'partner_dies' },
  { id: 'reconcile_family',    minAge: 50, maxAge: 80, type: 'good',    icon: '🤗', message: 'After years of estrangement, you reconciled with [sibling].', effects: { happiness: 15 } },
  { id: 'wrote_memoir',        stage: 'senior', minAge: 60, maxAge: 85, type: 'good', icon: '✍️', message: 'You wrote your memoir and self-published it. Your family loves it.', effects: { happiness: 12, smarts: 3 } },
  { id: 'stroke',              stage: 'senior', minAge: 60, maxAge: 90, type: 'bad', icon: '🧠', message: 'You suffered a minor stroke. You recovered but things feel different now.', effects: { health: -20, happiness: -15, smarts: -5 }, special: 'add_condition' },

  // ── UNIVERSAL ────────────────────────────────────────────────────────────
  { id: 'car_accident',         minAge: 16, maxAge: 90, type: 'bad',  icon: '🚗', message: 'You were involved in a car accident. You\'re okay but shaken.', effects: { health: -12, happiness: -8, money: -3000 } },
  { id: 'robbed',               minAge: 14, maxAge: 90, type: 'bad',  icon: '🔫', message: 'You got mugged on the street. They took your wallet.', effects: { happiness: -12, money: -500 } },
  { id: 'lottery_ticket',       minAge: 18, maxAge: 90, type: 'good', icon: '🎫', message: 'You won $2,000 on a scratch ticket!', effects: { happiness: 8, money: 2000 } },
  { id: 'natural_disaster',     minAge: 1,  maxAge: 99, type: 'bad',  icon: '🌪️', message: 'A natural disaster hit your area. You lost property but survived.', effects: { happiness: -15, money: -10000 } },
  { id: 'unexpected_medical',   minAge: 18, maxAge: 90, type: 'bad',  icon: '🏥', message: 'An unexpected health issue put you in the hospital for a week.', effects: { health: -12, happiness: -8, money: -5000 } },
  { id: 'random_act_kindness',  minAge: 10, maxAge: 90, type: 'good', icon: '🌟', message: 'A stranger did something incredibly kind for you today.', effects: { happiness: 8 } },
  { id: 'financial_windfall',   minAge: 18, maxAge: 80, type: 'good', icon: '💵', message: 'An unexpected bonus dropped into your account!', effects: { happiness: 10, money: 10000 } },
  { id: 'depression_episode',   minAge: 13, maxAge: 90, type: 'bad',  icon: '🌧️', message: 'You went through a serious depressive episode this year.', effects: { happiness: -20, health: -5 } },
  { id: 'therapy_breakthrough', minAge: 13, maxAge: 90, type: 'good', icon: '🧠', message: 'A breakthrough in therapy changed how you see yourself.', effects: { happiness: 15, smarts: 3 } },
  { id: 'old_friend_reconnect', minAge: 18, maxAge: 90, type: 'good', icon: '📱', message: '[friend] reached out after years. Like no time had passed.', effects: { happiness: 10 } },
  { id: 'identity_theft',       minAge: 18, maxAge: 90, type: 'bad',  icon: '💳', message: 'Your identity got stolen. Months of headaches resolving it.', effects: { happiness: -12, money: -5000 } },
  { id: 'news_featured',        minAge: 18, maxAge: 90, type: 'good', icon: '📰', message: 'You were featured in a local news story for something positive!', effects: { happiness: 10, looks: 2 } },

  // ── 15 NEW CHOICE EVENTS ─────────────────────────────────────────────────
  { id: 'career_dilemma_offer', stage: 'adult', minAge: 25, maxAge: 50, type: 'choice', icon: '💼', message: 'A rival company offers you a job — more money but you\'d have to betray [employer].',
    choices: [
      { text: 'Take the offer (+$25k/yr, burn bridges)', effects: { happiness: 8, money: 25000 }, result: 'You jumped ship. Your old boss is furious but the pay is incredible.' },
      { text: 'Stay loyal (no change)',                  effects: { happiness: 3 },               result: 'You declined. Your boss found out and gave you a small raise as thanks.' },
      { text: 'Negotiate with [employer] (+$10k/yr)',   effects: { happiness: 5, money: 10000 }, result: 'You used the offer as leverage. [employer] matched part of it.' },
    ]
  },
  { id: 'financial_gamble', stage: 'adult', minAge: 22, maxAge: 55, type: 'choice', icon: '📈', message: 'A friend tips you off about a stock that\'s about to explode. It could be insider trading.',
    choices: [
      { text: 'Go all in (-$5k risk, +$30k potential)', effects: { happiness: 15, money: 30000 }, result: 'It paid off massively. You\'re not asking where the tip came from.' },
      { text: 'Invest a little (-$1k risk)',             effects: { happiness: 5, money: 8000 },  result: 'You played it safe. Modest gains, no regrets.' },
      { text: 'Report it to authorities (+smarts)',       effects: { happiness: 2, smarts: 5 },    result: 'You did the right thing. Your friend never spoke to you again.' },
      { text: 'Pass on it (no risk)',                    effects: { happiness: -2 },              result: 'You watched the stock 10x without you. Pain.' },
    ]
  },
  { id: 'moral_choice_homeless', minAge: 18, maxAge: 90, type: 'choice', icon: '🏠', message: 'You find a wallet with $800 cash and an ID inside.',
    choices: [
      { text: 'Return it (-$800, +karma)',  effects: { happiness: 12, smarts: 2 }, result: 'You returned it. The owner cried and gave you a reward.' },
      { text: 'Keep the cash (-$0 risk)',   effects: { happiness: -5, money: 800 }, result: 'You kept it. You still think about that person sometimes.' },
      { text: 'Donate it to charity',       effects: { happiness: 8 }, result: 'You donated everything. Felt incredible.' },
    ]
  },
  { id: 'family_conflict_money', stage: 'adult', minAge: 25, maxAge: 55, type: 'choice', icon: '👨‍👩‍👧', message: '[sibling] asks to borrow a large amount of money. They\'ve flaked before.',
    choices: [
      { text: 'Lend it (-$5k, risk of loss)', effects: { happiness: -3, money: -5000 }, result: '[sibling] promised to pay it back. You\'ll believe it when you see it.' },
      { text: 'Refuse (protect yourself)',     effects: { happiness: -8 },              result: '[sibling] is furious. Family dinners are now very awkward.' },
      { text: 'Give it as a gift (no strings)', effects: { happiness: 5, money: -3000 }, result: 'You gave it freely. [sibling] was overwhelmed with gratitude.' },
    ]
  },
  { id: 'relationship_spark', stage: 'adult', minAge: 25, maxAge: 45, type: 'choice', icon: '💘', condition: 'married', message: 'You\'ve been feeling disconnected from [spouse]. The spark seems to be fading.',
    choices: [
      { text: 'Plan a surprise trip (+happiness, -$3k)', effects: { happiness: 15, money: -3000 }, result: 'You whisked [spouse] away. The spark came roaring back.' },
      { text: 'Start couples therapy (-$2k/yr)',          effects: { happiness: 8, money: -2000 },  result: 'Therapy was awkward at first, but it helped a lot.' },
      { text: 'Ignore it and hope for the best',         effects: { happiness: -10 },              result: 'You avoided it. Things got worse before they got better.' },
    ]
  },
  { id: 'side_hustle_choice', stage: 'youngAdult', minAge: 20, maxAge: 40, type: 'choice', icon: '💡', message: 'You have a business idea but it requires time and money to start.',
    choices: [
      { text: 'Go for it (-$5k, high risk/reward)',  effects: { happiness: 5, money: -5000, smarts: 3 }, result: 'You launched it. It\'s rough going but you feel alive.' },
      { text: 'Research more first (+smarts)',        effects: { smarts: 5, happiness: 3 },               result: 'You spent the year planning. You feel more ready now.' },
      { text: 'Stick to your day job (safe)',         effects: { happiness: -3 },                         result: 'You played it safe. Sometimes you wonder what if.' },
    ]
  },
  { id: 'substance_pressure_adult', stage: 'adult', minAge: 25, maxAge: 50, type: 'choice', icon: '🍸', message: 'Work stress is unbearable. Your colleague keeps offering "something to take the edge off."',
    choices: [
      { text: 'Accept (short-term relief, long-term risk)', effects: { happiness: 8, health: -10 }, result: 'It helped short-term. You need to be careful this doesn\'t become a habit.', special: 'addiction_risk' },
      { text: 'Hit the gym instead (+health)',              effects: { health: 8, happiness: 5 },   result: 'You channeled the stress into exercise. Great choice.' },
      { text: 'Take a mental health day',                   effects: { happiness: 10 },              result: 'You called in sick and rested. Much needed.' },
    ]
  },
  { id: 'workplace_ethics', stage: 'adult', minAge: 22, maxAge: 60, type: 'choice', icon: '⚖️', condition: 'employed', message: 'You discover your boss at [employer] is committing fraud. You have proof.',
    choices: [
      { text: 'Report to authorities (+smarts, risk of retaliation)', effects: { smarts: 8, happiness: -5 }, result: 'You reported it. The company was investigated. It was messy but right.' },
      { text: 'Confront your boss privately',                          effects: { happiness: -8, money: 10000 }, result: 'Your boss paid you to stay quiet. You feel dirty about it.' },
      { text: 'Look the other way',                                    effects: { happiness: -12, smarts: -3 }, result: 'You stayed silent. The guilt is eating you alive.' },
    ]
  },
  { id: 'friendship_betrayal', minAge: 18, maxAge: 70, type: 'choice', icon: '🗡️', message: 'You discover [friend] has been talking behind your back to mutual friends.',
    choices: [
      { text: 'Confront them directly',         effects: { happiness: 5 },              result: 'It was tense. They apologized. The friendship survived, barely.' },
      { text: 'Cut them off completely',         effects: { happiness: -5 },             result: 'You ghosted them. Clean but lonely.' },
      { text: 'Talk it out calmly (+smarts)',    effects: { happiness: 8, smarts: 3 },   result: 'You had an honest conversation. You both grew from it.' },
      { text: 'Get petty revenge',               effects: { happiness: 3, smarts: -5 }, result: 'It felt good for about 20 minutes. Then just empty.' },
    ]
  },
  { id: 'health_sacrifice', stage: 'adult', minAge: 25, maxAge: 55, type: 'choice', icon: '⏰', condition: 'employed', message: '[employer] wants you to work 80-hour weeks for a big project. Your health is already suffering.',
    choices: [
      { text: 'Do it (+$15k bonus, -15 health)',  effects: { money: 15000, health: -15, happiness: -5 }, result: 'You delivered the project. The bonus was great but you burned out hard.' },
      { text: 'Set boundaries (keep [job])',       effects: { happiness: 8, health: 5 },                  result: 'You held firm. Your boss respected it eventually.' },
      { text: 'Quit on the spot',                 effects: { happiness: 12, money: -20000 },             result: 'You walked out. Terrifying and exhilarating in equal measure.', special: 'fire' },
    ]
  },
  { id: 'inheritance_dispute', stage: 'adult', minAge: 30, maxAge: 65, type: 'choice', icon: '🏛️', message: 'A relative died and left you money — but [sibling] is contesting the will.',
    choices: [
      { text: 'Fight it in court (-$10k, risky)',    effects: { happiness: -8, money: 30000 }, result: 'You won. You got the inheritance but lost the relationship.' },
      { text: 'Split it fairly with [sibling]',      effects: { happiness: 8, money: 15000 },  result: 'You divided it. [sibling] was grateful. Family first.' },
      { text: 'Give it all to [sibling]',            effects: { happiness: 12 },               result: 'You gave it up. The look on [sibling]\'s face was worth it.' },
    ]
  },
  { id: 'midlife_opportunity', stage: 'midlife', minAge: 38, maxAge: 55, type: 'choice', icon: '🌍', message: 'You get a once-in-a-lifetime job offer — dream role, dream pay — but it\'s across the world.',
    choices: [
      { text: 'Take it — move everything (huge life change)', effects: { happiness: 10, money: 30000, smarts: 5 }, result: 'You moved your whole life. It was terrifying and wonderful.' },
      { text: 'Negotiate remote work',                        effects: { happiness: 8, money: 15000 },              result: 'They agreed. You kept your life and got a great role.' },
      { text: 'Decline — roots matter more',                  effects: { happiness: 5 },                            result: 'You stayed. Sometimes you wonder, but your life is here.' },
    ]
  },
  { id: 'parenting_crossroads', stage: 'adult', minAge: 28, maxAge: 50, type: 'choice', icon: '👶', condition: 'hasChildren', message: '[kid] is struggling in school and the teacher recommends transferring them to a special program.',
    choices: [
      { text: 'Transfer them (expensive but worth it)', effects: { happiness: 8, money: -8000 }, result: '[kid] thrived in the new program. Best decision you ever made.' },
      { text: 'Hire a tutor (-$3k)',                    effects: { happiness: 5, money: -3000 }, result: 'The tutoring helped. [kid] is improving slowly.' },
      { text: 'Work with them yourself',                effects: { happiness: 3 },               result: 'You spent evenings at the kitchen table. Tough but bonding.' },
    ]
  },
  { id: 'social_media_moment', minAge: 16, maxAge: 45, type: 'choice', icon: '📱', message: 'You witnessed something scandalous involving a local celebrity. You have a video.',
    choices: [
      { text: 'Post it online (+fame, legal risk)',     effects: { happiness: 10, looks: 5, money: 2000 }, result: 'It went viral. You got your 15 minutes of fame and a cease-and-desist.' },
      { text: 'Delete it and mind your business',      effects: { happiness: 3 },                          result: 'You stayed out of it. Boring but wise.' },
      { text: 'Sell it to a tabloid (+$5k)',            effects: { money: 5000, happiness: -5 },            result: 'The check cleared. You felt a bit gross about it.' },
    ]
  },
  { id: 'elderly_parent_care', stage: 'midlife', minAge: 40, maxAge: 65, type: 'choice', icon: '👴', message: 'Your aging parent can no longer live alone. Something has to change.',
    choices: [
      { text: 'Move them in with you (free, stressful)',      effects: { happiness: -5 },               result: 'They moved in. It\'s a lot, but you\'re glad they\'re close.' },
      { text: 'Find a care facility (-$20k/yr)',              effects: { happiness: -8, money: -20000 }, result: 'You found a good facility. They\'re taken care of, but it hurts.' },
      { text: 'Split care with [sibling]',                   effects: { happiness: 3, money: -10000 }, result: '[sibling] agreed to share the load. Teamwork made it bearable.' },
    ]
  },

  // ── STAT-GATED OPPORTUNITIES ──────────────────────────────────────────────
  { id: 'modeling_offer',      stage: 'youngAdult', minAge: 16, maxAge: 28, type: 'choice', icon: '💃', requires: { looks: 80 }, message: 'A modeling agency spotted you and wants to sign you.',
    choices: [
      { text: 'Sign with the agency (+looks, +$20k)',    effects: { looks: 5, money: 20000, happiness: 12 }, result: 'You signed. Shoots, travel, and more money than you expected.' },
      { text: 'Decline — not your thing',                effects: { happiness: 3 },                          result: 'You passed. Plenty of other paths.' },
    ]
  },
  { id: 'pro_athlete_scout',   stage: 'teen', minAge: 14, maxAge: 22, type: 'choice', icon: '🏅', requires: { health: 85 }, message: 'A scout from a professional sports league has been watching you play.',
    choices: [
      { text: 'Pursue it seriously (+health, +$50k)',    effects: { health: 5, money: 50000, happiness: 20 }, result: 'You committed fully. The training is brutal but you were built for this.' },
      { text: 'Keep it as a hobby',                     effects: { happiness: 5 },                            result: 'You declined. No regrets — you play for love of the game.' },
    ]
  },
  { id: 'scholarship_offer',   stage: 'teen', minAge: 17, maxAge: 18, type: 'milestone', icon: '🎓', requires: { smarts: 80 }, message: 'You\'ve been offered a full academic scholarship! No student debt!', effects: { happiness: 25, smarts: 5 } },
  { id: 'beauty_pageant',      stage: 'youngAdult', minAge: 16, maxAge: 30, type: 'choice', icon: '👑', requires: { looks: 75 }, message: 'You\'ve been invited to compete in a regional beauty pageant.',
    choices: [
      { text: 'Enter and compete (+looks, +$5k chance)',  effects: { looks: 3, money: 5000, happiness: 10 }, result: 'You placed in the top 3. The experience was unforgettable.' },
      { text: 'Pass on it',                              effects: { happiness: 2 }, result: 'Not your scene, and that\'s okay.' },
    ]
  },
  { id: 'mensa_invite',        minAge: 18, maxAge: 60, type: 'milestone', icon: '🧠', requires: { smarts: 90 }, message: 'You scored high enough to join Mensa. Your IQ is officially in the top 2%.', effects: { smarts: 8, happiness: 10 } },
  { id: 'fitness_sponsorship', stage: 'youngAdult', minAge: 18, maxAge: 35, type: 'good', icon: '💪', requires: { health: 88 }, message: 'A fitness brand reached out about a sponsorship deal.', effects: { money: 15000, happiness: 12, health: 3 } },

  // ── CONSEQUENCE EVENTS ────────────────────────────────────────────────────
  { id: 'bad_grades_consequence', consequenceOf: 'skip_school', minAge: 11, maxAge: 18, type: 'bad', icon: '📉',
    message: 'Your grades have slipped badly because of all the classes you\'ve been skipping.', effects: { smarts: -8, happiness: -5 } },
  { id: 'addiction_followup', consequenceOf: 'drug_offer', minAge: 15, maxAge: 35, type: 'choice', icon: '💊',
    message: 'That experiment with drugs last year turned into a habit. It\'s starting to affect your life.',
    choices: [
      { text: 'Seek rehab (-$5k, save yourself)',   effects: { health: 10, happiness: 5, money: -5000 }, result: 'You checked yourself in. Hardest and best thing you ever did.' },
      { text: 'Try to quit alone',                  effects: { health: 5, happiness: -5 },               result: 'You\'re white-knuckling it. It\'s brutal but you\'re trying.' },
      { text: 'Keep going (avoid the truth)',        effects: { health: -15, happiness: -10 },            result: 'You looked away. The hole gets deeper.' },
    ]
  },
  { id: 'marriage_strain',    consequenceOf: 'neglect_partner', minAge: 25, maxAge: 65, type: 'choice', condition: 'married', icon: '💔',
    message: '[spouse] sits you down. "I feel like we\'re strangers. I need things to change."',
    choices: [
      { text: 'Take it seriously — commit to change', effects: { happiness: 10 }, result: 'You listened. Really listened. [spouse] felt it. Things improved.' },
      { text: 'Get defensive',                        effects: { happiness: -15 }, result: 'The argument lasted three days. The distance grew.' },
      { text: 'Suggest couples therapy',              effects: { happiness: 8, money: -2000 }, result: 'Therapy was uncomfortable but it worked.' },
    ]
  },
  { id: 'financial_spiral',   consequenceOf: 'gambling_loss', minAge: 18, maxAge: 80, type: 'bad', icon: '📉',
    message: 'Last year\'s gambling losses spiraled. You\'re now in serious debt and receiving calls from collectors.', effects: { happiness: -20, money: -8000 } },
  { id: 'gym_gains_noticed',  consequenceOf: 'gym_streak', minAge: 16, maxAge: 60, type: 'good', icon: '💪',
    message: 'All that time in the gym is paying off visibly. People have been commenting on how good you look.', effects: { looks: 8, health: 5, happiness: 10 } },
  { id: 'study_payoff',       consequenceOf: 'study_hard', minAge: 12, maxAge: 25, type: 'good', icon: '📚',
    message: 'Your consistent studying paid off. You aced your exams and your future looks brighter.', effects: { smarts: 10, happiness: 12 } },
  { id: 'overwork_burnout',   consequenceOf: 'work_overtime', minAge: 22, maxAge: 60, type: 'bad', icon: '🔥',
    message: 'Years of overworking have caught up with you. You\'re completely burned out and your doctor is worried.', effects: { health: -15, happiness: -18 } },
  { id: 'social_payoff',      consequenceOf: 'socialize', minAge: 14, maxAge: 70, type: 'good', icon: '🤝',
    message: 'All the time you\'ve invested in relationships paid off. You have a deep, reliable support network.', effects: { happiness: 15 }, special: 'add_friend' },
];

// ─── Life Stage Definition ─────────────────────────────────────────────────────
const LIFE_STAGES = [
  { id: 'infant',     minAge: 0,  maxAge: 4  },
  { id: 'child',      minAge: 5,  maxAge: 12 },
  { id: 'teen',       minAge: 13, maxAge: 17 },
  { id: 'youngAdult', minAge: 18, maxAge: 29 },
  { id: 'adult',      minAge: 30, maxAge: 49 },
  { id: 'midlife',    minAge: 50, maxAge: 65 },
  { id: 'senior',     minAge: 66, maxAge: 120 },
];

function getStageId(age) {
  return LIFE_STAGES.find(s => age >= s.minAge && age <= s.maxAge)?.id || 'adult';
}

function stageDistance(eventStage, charStage) {
  if (!eventStage) return 1; // no stage tag = universal
  if (eventStage === charStage) return 0;
  const ids = LIFE_STAGES.map(s => s.id);
  const a = ids.indexOf(eventStage);
  const b = ids.indexOf(charStage);
  return Math.abs(a - b);
}

// ─── Main filter + personalize export ─────────────────────────────────────────
export const getEventsForAge = (age, character) => {
  const charStage = getStageId(age);

  const filtered = EVENTS.filter(e => {
    if (!e || e.consequenceOf) return false; // consequence events handled separately
    if (age < e.minAge || age > e.maxAge) return false;

    // Condition checks
    if (e.condition) {
      if (e.condition === 'hasPartner'    && !character.relationships?.partner) return false;
      if (e.condition === 'noPartner'     && character.relationships?.partner)  return false;
      if (e.condition === 'married'       && !character.relationships?.married) return false;
      if (e.condition === 'engaged'       && !character.relationships?.engaged) return false;
      if (e.condition === 'hasChildren'   && (!character.relationships?.children || character.relationships.children.length === 0)) return false;
      if (e.condition === 'employed'      && !character.career?.employed) return false;
      if (e.condition === 'unemployed'    && character.career?.employed)  return false;
      if (e.condition === 'inUniversity'  && !character.education?.inUniversity) return false;
      if (e.condition === 'hasStudentDebt'&& (!character.finances?.debt || character.finances.debt < 1000)) return false;
      if (e.condition === 'highSmarts'    && character.stats?.smarts < 65) return false;
      if (e.condition === 'parentsMarried'&& !character.family?.parentsMarried) return false;
      if (e.condition === 'hasPet'        && !character.hasPet) return false;
    }

    // Stat gate checks
    if (e.requires) {
      for (const [stat, val] of Object.entries(e.requires)) {
        if ((character.stats?.[stat] || 0) < val) return false;
      }
    }

    return true;
  });

  // Weight by life stage proximity
  const weighted = filtered.map(e => {
    const dist = stageDistance(e.stage, charStage);
    const weight = dist === 0 ? 3.0 : dist === 1 ? 1.5 : 0.3;
    return { event: e, weight };
  });

  // Personalize all events before returning
  return weighted.map(({ event, weight }) => ({
    ...personalizeEvent(event, character),
    _weight: weight,
  }));
};

export const getConsequenceEvents = (age, character) => {
  const recentHistory = (character.history || []).slice(-10);
  const recentChoices = recentHistory.map(h => h.eventId || h.consequenceOf);
  const recentChoiceTexts = recentHistory.map(h => (h.choiceMade || '').toLowerCase());

  return EVENTS.filter(e => {
    if (!e.consequenceOf) return false;
    if (age < e.minAge || age > e.maxAge) return false;
    if (e.condition === 'married' && !character.relationships?.married) return false;

    // Check trigger conditions
    if (e.consequenceOf === 'skip_school'    && recentChoiceTexts.some(t => t.includes('skip it'))) return true;
    if (e.consequenceOf === 'drug_offer'     && recentChoiceTexts.some(t => t.includes('try them'))) return true;
    if (e.consequenceOf === 'neglect_partner'&& character.relationships?.partner?.love < 30) return true;
    if (e.consequenceOf === 'gambling_loss'  && recentChoices.includes('gambling_loss')) return true;
    if (e.consequenceOf === 'gym_streak'     && (character.gym?.workoutsThisYear || 0) >= 3) return true;
    if (e.consequenceOf === 'study_hard'     && (character.education?.studyEffort || 0) > 70) return true;
    if (e.consequenceOf === 'work_overtime'  && (character.career?.yearsAtJob || 0) >= 3 && character.career?.performance > 80) return true;
    if (e.consequenceOf === 'socialize'      && (character.relationships?.friends?.length || 0) >= 3) return true;
    return false;
  }).map(e => personalizeEvent(e, character));
};
