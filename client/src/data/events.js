// Event types: good, bad, neutral, choice, milestone, crime, health, friend
// Effects keys: happiness, health, smarts, looks, money, debt

export const EVENTS = [
  // ── BABY / TODDLER (0-4) ──────────────────────────────────────────────────
  { id: 'first_words', minAge: 1, maxAge: 2, type: 'milestone', icon: '👶', message: 'You said your first words! Your parents were thrilled.', effects: { happiness: 5 } },
  { id: 'first_steps', minAge: 1, maxAge: 2, type: 'milestone', icon: '🚶', message: 'You took your first steps today!', effects: { health: 2, happiness: 3 } },
  { id: 'tantrum', minAge: 2, maxAge: 4, type: 'bad', icon: '😤', message: 'You threw a massive tantrum in the supermarket. Everyone stared.', effects: { happiness: -2 } },
  { id: 'imaginary_friend', minAge: 3, maxAge: 5, type: 'good', icon: '🌈', message: 'You created an imaginary friend named Zooble. Very creative.', effects: { happiness: 5, smarts: 2 } },
  { id: 'fell_down_stairs', minAge: 1, maxAge: 4, type: 'bad', icon: '🤕', message: 'You fell down the stairs. You were okay but it hurt a lot.', effects: { health: -5, happiness: -3 } },
  { id: 'parents_fight_baby', minAge: 1, maxAge: 5, type: 'bad', icon: '😢', message: 'Your parents had a big fight. You cried yourself to sleep.', effects: { happiness: -5 } },
  { id: 'new_sibling', minAge: 1, maxAge: 5, type: 'neutral', icon: '👶', message: 'Your mom had a new baby. You are now a big sibling!', effects: { happiness: -2 }, special: 'add_sibling' },
  { id: 'got_toy', minAge: 2, maxAge: 5, type: 'good', icon: '🧸', message: 'You got the toy you wanted for Christmas. Life is great.', effects: { happiness: 8 } },

  // ── CHILD (5-12) ─────────────────────────────────────────────────────────
  { id: 'science_fair_win', minAge: 8, maxAge: 12, type: 'good', icon: '🏆', message: 'You won first place at the school science fair!', effects: { smarts: 5, happiness: 8 } },
  { id: 'bullied', minAge: 6, maxAge: 13, type: 'choice', icon: '😠', message: 'An older kid at school has been bullying you.',
    choices: [
      { text: 'Fight Back', effects: { happiness: 3, health: -5 }, result: 'You fought back. You got a bruise but they left you alone.' },
      { text: 'Tell a Teacher', effects: { happiness: 2 }, result: 'The teacher intervened. The bully got detention.' },
      { text: 'Ignore It', effects: { happiness: -8 }, result: 'You tried to ignore it, but it really got to you.' }
    ]
  },
  { id: 'made_best_friend', minAge: 5, maxAge: 12, type: 'good', icon: '🤝', message: 'You made a best friend at school. They are awesome.', effects: { happiness: 10 }, special: 'add_friend' },
  { id: 'got_first_pet', minAge: 5, maxAge: 12, type: 'good', icon: '🐶', message: 'Your parents got you a pet! You are overjoyed.', effects: { happiness: 12 } },
  { id: 'pet_died', minAge: 6, maxAge: 15, type: 'bad', icon: '😭', message: 'Your beloved pet passed away. You are devastated.', effects: { happiness: -15 }, condition: 'hasPet' },
  { id: 'cheating_caught', minAge: 8, maxAge: 14, type: 'bad', icon: '📝', message: 'You got caught cheating on a test. You got detention.', effects: { smarts: -3, happiness: -5 } },
  { id: 'honor_roll', minAge: 8, maxAge: 18, type: 'good', icon: '📜', message: 'You made the honor roll! Your parents are proud.', effects: { smarts: 3, happiness: 5 } },
  { id: 'broke_neighbors_window', minAge: 7, maxAge: 13, type: 'choice', icon: '⚾', message: 'You accidentally broke your neighbor\'s window with a baseball.',
    choices: [
      { text: 'Confess to Neighbor', effects: { happiness: 3, money: -200 }, result: 'You were honest. They appreciated it but you paid for the damage.' },
      { text: 'Pretend It Wasn\'t You', effects: { happiness: -5, smarts: -1 }, result: 'You denied it. They suspected you anyway. Guilt hit hard.' },
      { text: 'Blame Your Friend', effects: { happiness: -10 }, result: 'Your friend found out you blamed them. They never forgave you.' }
    ]
  },
  { id: 'skip_school', minAge: 10, maxAge: 17, type: 'choice', icon: '🏫', message: 'Your friends want to skip school and hang out.',
    choices: [
      { text: 'Skip It!', effects: { happiness: 8, smarts: -3 }, result: 'You had a blast but missed an important test.' },
      { text: 'Go to School', effects: { smarts: 3, happiness: -2 }, result: 'Responsible choice. Your friends called you boring though.' }
    ]
  },
  { id: 'parents_divorce', minAge: 5, maxAge: 16, type: 'bad', icon: '💔', message: 'Your parents announced they are getting divorced.', effects: { happiness: -20 }, condition: 'parentsMarried' },
  { id: 'moved_schools', minAge: 7, maxAge: 14, type: 'bad', icon: '🏫', message: 'Your family moved and you started at a completely new school.', effects: { happiness: -8 } },
  { id: 'won_sports', minAge: 8, maxAge: 16, type: 'good', icon: '⚽', message: 'Your team won the championships! You were the MVP.', effects: { happiness: 10, health: 3 } },
  { id: 'found_money', minAge: 6, maxAge: 99, type: 'good', icon: '💰', message: 'You found $50 on the sidewalk. Nice!', effects: { happiness: 5, money: 50 } },
  { id: 'reading_habit', minAge: 7, maxAge: 12, type: 'good', icon: '📖', message: 'You discovered you love reading. You devoured 20 books this year.', effects: { smarts: 8, happiness: 4 } },
  { id: 'summer_camp', minAge: 8, maxAge: 14, type: 'good', icon: '🏕️', message: 'You went to summer camp and had the time of your life.', effects: { happiness: 10, health: 3 }, special: 'add_friend' },

  // ── TEEN (13-17) ─────────────────────────────────────────────────────────
  { id: 'first_relationship', minAge: 13, maxAge: 17, type: 'milestone', icon: '💕', message: 'You got your first boyfriend/girlfriend!', effects: { happiness: 15 }, special: 'add_partner' },
  { id: 'first_heartbreak', minAge: 14, maxAge: 18, type: 'bad', icon: '💔', message: 'Your first love broke up with you out of nowhere. It hurts so much.', effects: { happiness: -18 }, condition: 'hasPartner', special: 'remove_partner' },
  { id: 'prom_night', minAge: 16, maxAge: 18, type: 'good', icon: '🕺', message: 'Prom night was absolutely magical!', effects: { happiness: 12 } },
  { id: 'first_job', minAge: 15, maxAge: 18, type: 'milestone', icon: '💼', message: 'You got your first part-time job! Minimum wage, but it\'s yours.', effects: { happiness: 8, money: 2000 } },
  { id: 'drug_offer', minAge: 14, maxAge: 19, type: 'choice', icon: '💊', message: 'A friend offered you drugs at a party.',
    choices: [
      { text: 'Try Them', effects: { happiness: 5, health: -8 }, result: 'You tried them. It felt weird. You\'re hoping it was just once.', special: 'addiction_risk' },
      { text: 'Decline', effects: { happiness: -2 }, result: 'You said no. Some people laughed, but you\'re glad you did.' }
    ]
  },
  { id: 'got_license', minAge: 16, maxAge: 18, type: 'milestone', icon: '🚗', message: 'You passed your driving test on the first try!', effects: { happiness: 10 } },
  { id: 'failed_license', minAge: 16, maxAge: 18, type: 'bad', icon: '🚗', message: 'You failed your driving test. Again.', effects: { happiness: -5 } },
  { id: 'snuck_out', minAge: 14, maxAge: 17, type: 'choice', icon: '🌙', message: 'Your parents caught you sneaking back in at 3am.',
    choices: [
      { text: 'Come Clean', effects: { happiness: -5 }, result: 'They grounded you for a month but appreciated the honesty.' },
      { text: 'Make Up a Story', effects: { happiness: 2, smarts: -2 }, result: 'They half-believed you. Awkward dinner for weeks.' },
      { text: 'Run Back Out', effects: { happiness: -10 }, result: 'You ran. They called the police. You came home hours later in shame.' }
    ]
  },
  { id: 'college_acceptance', minAge: 17, maxAge: 18, type: 'milestone', icon: '🎓', message: 'You got your college acceptance letter!', effects: { happiness: 15, smarts: 3 }, condition: 'highSmarts' },
  { id: 'college_rejection', minAge: 17, maxAge: 18, type: 'bad', icon: '📩', message: 'You got rejected from your dream college.', effects: { happiness: -12 } },
  { id: 'fender_bender', minAge: 16, maxAge: 22, type: 'bad', icon: '💥', message: 'You got into a fender bender. Your parents are not happy.', effects: { happiness: -8, money: -800 } },
  { id: 'viral_video', minAge: 14, maxAge: 25, type: 'good', icon: '📱', message: 'One of your videos went viral! You have 100k followers overnight.', effects: { happiness: 15, looks: 3 } },
  { id: 'suspended', minAge: 13, maxAge: 17, type: 'bad', icon: '📛', message: 'You got suspended from school for a week.', effects: { happiness: -8, smarts: -3 } },
  { id: 'teen_pregnancy_scare', minAge: 15, maxAge: 19, type: 'bad', icon: '😰', message: 'You had a pregnancy scare. Fortunately it was a false alarm.', effects: { happiness: -10, health: -2 }, condition: 'hasPartner' },

  // ── YOUNG ADULT (18-25) ──────────────────────────────────────────────────
  { id: 'moved_out', minAge: 18, maxAge: 22, type: 'milestone', icon: '🏠', message: 'You moved out of your parents\' house into your own place!', effects: { happiness: 15 }, special: 'move_out' },
  { id: 'college_graduate', minAge: 21, maxAge: 26, type: 'milestone', icon: '🎓', message: 'You graduated from college! Time to take on the world.', effects: { happiness: 20, smarts: 5 }, condition: 'inUniversity', special: 'graduate' },
  { id: 'student_loan_crisis', minAge: 22, maxAge: 30, type: 'bad', icon: '💸', message: 'Your student loan payments started. $1,200/month. Ouch.', effects: { happiness: -8 }, condition: 'hasStudentDebt' },
  { id: 'wild_vacation', minAge: 18, maxAge: 26, type: 'good', icon: '🏖️', message: 'You went on a wild spring break trip with friends. Unforgettable.', effects: { happiness: 15, health: -3 } },
  { id: 'first_real_job', minAge: 21, maxAge: 26, type: 'milestone', icon: '👔', message: 'You landed your first real career-level job!', effects: { happiness: 18 }, condition: 'unemployed' },
  { id: 'met_someone_special', minAge: 18, maxAge: 28, type: 'good', icon: '💘', message: 'You met someone special at a party. Sparks are flying!', effects: { happiness: 12 }, condition: 'noPartner', special: 'add_partner' },
  { id: 'fwb_situation', minAge: 18, maxAge: 26, type: 'neutral', icon: '😏', message: 'You found yourself in a "friends with benefits" situation. Complicated.', effects: { happiness: 5 } },
  { id: 'roommate_nightmare', minAge: 18, maxAge: 25, type: 'bad', icon: '😤', message: 'Your roommate is an absolute nightmare. They never clean.', effects: { happiness: -8 } },
  { id: 'viral_app', minAge: 18, maxAge: 30, type: 'good', icon: '📱', message: 'The app you built in a weekend went viral! Investors are calling.', effects: { happiness: 15, money: 50000 }, condition: 'highSmarts' },
  { id: 'identity_crisis', minAge: 18, maxAge: 26, type: 'bad', icon: '🌀', message: 'You had a quarter-life crisis. What are you even doing?', effects: { happiness: -10 } },
  { id: 'gambling_win', minAge: 18, maxAge: 99, type: 'good', icon: '🎰', message: 'You hit it big at the casino!', effects: { happiness: 12, money: 5000 } },
  { id: 'gambling_loss', minAge: 18, maxAge: 99, type: 'bad', icon: '🎰', message: 'You lost a lot of money gambling. You need help.', effects: { happiness: -10, money: -3000 } },

  // ── ADULT (26-45) ────────────────────────────────────────────────────────
  { id: 'proposal', minAge: 24, maxAge: 40, type: 'milestone', icon: '💍', message: 'You proposed! They said YES!', effects: { happiness: 25 }, condition: 'hasPartner', special: 'engage' },
  { id: 'got_proposed_to', minAge: 22, maxAge: 40, type: 'milestone', icon: '💍', message: 'Your partner got down on one knee. Your heart is pounding!', effects: { happiness: 25 }, condition: 'hasPartner', special: 'engage' },
  { id: 'wedding', minAge: 24, maxAge: 45, type: 'milestone', icon: '👰', message: 'Today was the happiest day of your life. You got married!', effects: { happiness: 30, money: -15000 }, condition: 'engaged', special: 'marry' },
  { id: 'first_child', minAge: 24, maxAge: 42, type: 'milestone', icon: '🍼', message: 'You welcomed your first child into the world. Life will never be the same.', effects: { happiness: 25, health: -5 }, condition: 'married', special: 'add_child' },
  { id: 'second_child', minAge: 26, maxAge: 44, type: 'good', icon: '🍼', message: 'Baby number two arrived! Your home is gloriously chaotic.', effects: { happiness: 15, money: -5000 }, condition: 'hasChildren', special: 'add_child' },
  { id: 'miscarriage', minAge: 24, maxAge: 42, type: 'bad', icon: '😔', message: 'You suffered a miscarriage. The grief is overwhelming.', effects: { happiness: -25, health: -8 }, condition: 'married' },
  { id: 'promotion', minAge: 25, maxAge: 60, type: 'good', icon: '📈', message: 'You got promoted! New title, bigger paycheck, more responsibility.', effects: { happiness: 15 }, condition: 'employed', special: 'promote' },
  { id: 'fired', minAge: 22, maxAge: 60, type: 'bad', icon: '📦', message: 'You got fired. Walked out with a box of your stuff. Humiliating.', effects: { happiness: -20 }, condition: 'employed', special: 'fire' },
  { id: 'bought_house', minAge: 26, maxAge: 50, type: 'milestone', icon: '🏡', message: 'You bought your first home! 30-year mortgage. You\'re officially a homeowner.', effects: { happiness: 18, money: -30000 } },
  { id: 'divorce', minAge: 26, maxAge: 60, type: 'bad', icon: '💔', message: 'Your marriage fell apart. You are getting divorced.', effects: { happiness: -25, money: -20000 }, condition: 'married', special: 'divorce' },
  { id: 'affair_discovered', minAge: 26, maxAge: 55, type: 'bad', icon: '😱', message: 'Your partner discovered your affair. Everything is falling apart.', effects: { happiness: -30 }, condition: 'married' },
  { id: 'coworker_rivalry', minAge: 22, maxAge: 55, type: 'bad', icon: '😤', message: 'A coworker is actively trying to sabotage your work.', effects: { happiness: -8 }, condition: 'employed' },
  { id: 'lawsuit', minAge: 24, maxAge: 60, type: 'bad', icon: '⚖️', message: 'Someone sued you. Legal bills are mounting fast.', effects: { happiness: -15, money: -25000 } },
  { id: 'inheritance', minAge: 20, maxAge: 60, type: 'good', icon: '🏛️', message: 'A distant relative left you a substantial inheritance.', effects: { happiness: 10, money: 50000 } },
  { id: 'car_totaled', minAge: 18, maxAge: 70, type: 'bad', icon: '🚗', message: 'Your car got totaled. At least you\'re okay.', effects: { happiness: -10, money: -8000, health: -5 } },
  { id: 'startup_success', minAge: 22, maxAge: 45, type: 'good', icon: '🚀', message: 'Your startup got acquired for a life-changing amount!', effects: { happiness: 30, money: 500000 }, condition: 'highSmarts' },
  { id: 'bankruptcy', minAge: 26, maxAge: 60, type: 'bad', icon: '📉', message: 'Your business failed and you had to declare bankruptcy.', effects: { happiness: -30, money: -50000 } },
  { id: 'published_book', minAge: 22, maxAge: 70, type: 'good', icon: '📚', message: 'You got a book published! It\'s selling really well.', effects: { happiness: 15, smarts: 5, money: 20000 }, condition: 'highSmarts' },

  // ── MIDDLE AGE (46-65) ────────────────────────────────────────────────────
  { id: 'midlife_crisis', minAge: 40, maxAge: 55, type: 'choice', icon: '🏎️', message: 'You\'re having a full-on mid-life crisis.',
    choices: [
      { text: 'Buy a Sports Car', effects: { happiness: 10, money: -60000 }, result: 'Vroom vroom! You feel 25 again.' },
      { text: 'Get a Dramatic Haircut', effects: { happiness: 5, looks: 3 }, result: 'Bold new look. People are... surprised.' },
      { text: 'Quit Your Job', effects: { happiness: 5, money: -30000 }, result: 'You rage-quit and took three months off to "find yourself".' },
      { text: 'Embrace It Gracefully', effects: { happiness: 8, smarts: 3 }, result: 'You accepted this phase of life. You feel wise and at peace.' }
    ]
  },
  { id: 'empty_nest', minAge: 44, maxAge: 62, type: 'neutral', icon: '🏠', message: 'Your last child moved out for college. The house is quiet.', effects: { happiness: -5 }, condition: 'hasChildren' },
  { id: 'grandchild_born', minAge: 44, maxAge: 75, type: 'milestone', icon: '👴', message: 'You became a grandparent today! Time flies.', effects: { happiness: 20 }, condition: 'hasChildren', special: 'add_grandchild' },
  { id: 'best_friend_died', minAge: 35, maxAge: 80, type: 'bad', icon: '😢', message: 'Your best friend passed away unexpectedly. The world feels emptier.', effects: { happiness: -22 } },
  { id: 'heart_attack_scare', minAge: 40, maxAge: 70, type: 'bad', icon: '❤️‍🩹', message: 'You had a heart attack scare. Tests came back okay, but it was terrifying.', effects: { health: -10, happiness: -8 } },
  { id: 'diabetes_diagnosis', minAge: 35, maxAge: 75, type: 'bad', icon: '💉', message: 'You were diagnosed with Type 2 diabetes.', effects: { health: -15, happiness: -10 }, special: 'add_condition' },
  { id: 'cancer_scare', minAge: 35, maxAge: 80, type: 'bad', icon: '🏥', message: 'A cancer scare sent you spiraling. Tests came back benign, thankfully.', effects: { health: -5, happiness: -15 } },
  { id: 'laid_off', minAge: 40, maxAge: 62, type: 'bad', icon: '📦', message: 'The company downsized. After 15 years, you were laid off.', effects: { happiness: -22 }, condition: 'employed', special: 'fire' },
  { id: 'partner_sick', minAge: 35, maxAge: 75, type: 'bad', icon: '🏥', message: 'Your partner got seriously ill. You\'re both scared.', effects: { happiness: -18, money: -10000 }, condition: 'married' },
  { id: 'renewed_vows', minAge: 40, maxAge: 70, type: 'good', icon: '💍', message: 'You and your partner renewed your vows on your anniversary.', effects: { happiness: 15 }, condition: 'married' },

  // ── SENIOR (66-80) ───────────────────────────────────────────────────────
  { id: 'retired', minAge: 62, maxAge: 72, type: 'milestone', icon: '🏖️', message: 'You finally retired! Time to actually enjoy life.', effects: { happiness: 20 }, condition: 'employed', special: 'retire' },
  { id: 'senior_dementia', minAge: 70, maxAge: 90, type: 'bad', icon: '🧠', message: 'You\'ve been having more and more memory lapses.', effects: { health: -10, happiness: -12, smarts: -10 }, special: 'add_condition' },
  { id: 'hip_replacement', minAge: 65, maxAge: 85, type: 'bad', icon: '🦴', message: 'You had a hip replacement surgery. Recovery was brutal.', effects: { health: -5, money: -20000 } },
  { id: 'travel_bucket_list', minAge: 62, maxAge: 80, type: 'good', icon: '✈️', message: 'You finally took that dream trip around the world!', effects: { happiness: 18, money: -15000 } },
  { id: 'partner_dies', minAge: 60, maxAge: 90, type: 'bad', icon: '💔', message: 'Your spouse of many years passed away. The grief is indescribable.', effects: { happiness: -35, health: -10 }, condition: 'married', special: 'partner_dies' },
  { id: 'reconcile_family', minAge: 50, maxAge: 80, type: 'good', icon: '🤗', message: 'After years of estrangement, you reconciled with a family member.', effects: { happiness: 15 } },
  { id: 'wrote_memoir', minAge: 60, maxAge: 85, type: 'good', icon: '✍️', message: 'You wrote your memoir and self-published it. Your family loves it.', effects: { happiness: 12, smarts: 3 } },
  { id: 'stroke', minAge: 60, maxAge: 90, type: 'bad', icon: '🧠', message: 'You suffered a minor stroke. You recovered but things feel different now.', effects: { health: -20, happiness: -15, smarts: -5 }, special: 'add_condition' },

  // ── UNIVERSAL ────────────────────────────────────────────────────────────
  { id: 'car_accident', minAge: 16, maxAge: 90, type: 'bad', icon: '🚗', message: 'You were involved in a car accident. You\'re okay but shaken.', effects: { health: -12, happiness: -8, money: -3000 } },
  { id: 'robbed', minAge: 14, maxAge: 90, type: 'bad', icon: '🔫', message: 'You got mugged on the street. They took your wallet.', effects: { happiness: -12, money: -500 } },
  { id: 'lottery_ticket', minAge: 18, maxAge: 90, type: 'good', icon: '🎫', message: 'You won $2,000 on a scratch ticket!', effects: { happiness: 8, money: 2000 } },
  { id: 'natural_disaster', minAge: 1, maxAge: 99, type: 'bad', icon: '🌪️', message: 'A natural disaster hit your area. You lost property but survived.', effects: { happiness: -15, money: -10000 } },
  { id: 'unexpected_medical', minAge: 18, maxAge: 90, type: 'bad', icon: '🏥', message: 'An unexpected health issue put you in the hospital for a week.', effects: { health: -12, happiness: -8, money: -5000 } },
  { id: 'random_act_of_kindness', minAge: 10, maxAge: 90, type: 'good', icon: '🌟', message: 'A stranger did something incredibly kind for you today. Faith in humanity restored.', effects: { happiness: 8 } },
  { id: 'financial_windfall', minAge: 18, maxAge: 80, type: 'good', icon: '💵', message: 'An unexpected bonus dropped into your account!', effects: { happiness: 10, money: 10000 } },
  { id: 'depression_episode', minAge: 13, maxAge: 90, type: 'bad', icon: '🌧️', message: 'You went through a serious depressive episode this year.', effects: { happiness: -20, health: -5 } },
  { id: 'therapy_breakthrough', minAge: 13, maxAge: 90, type: 'good', icon: '🧠', message: 'A breakthrough in therapy changed how you see yourself.', effects: { happiness: 15, smarts: 3 } },
  { id: 'old_friend_reconnect', minAge: 18, maxAge: 90, type: 'good', icon: '📱', message: 'An old friend reached out after years. Like no time had passed.', effects: { happiness: 10 } },
  { id: 'identity_theft', minAge: 18, maxAge: 90, type: 'bad', icon: '💳', message: 'Your identity got stolen. Months of headaches resolving it.', effects: { happiness: -12, money: -5000 } },
  { id: 'news_featured', minAge: 18, maxAge: 90, type: 'good', icon: '📰', message: 'You were featured in a local news story for something positive!', effects: { happiness: 10, looks: 2 } },
];

export const getEventsForAge = (age, character) => {
  return EVENTS.filter(e => {
    if (age < e.minAge || age > e.maxAge) return false;
    if (e.condition) {
      if (e.condition === 'hasPartner' && !character.relationships.partner) return false;
      if (e.condition === 'noPartner' && character.relationships.partner) return false;
      if (e.condition === 'married' && !character.relationships.married) return false;
      if (e.condition === 'engaged' && !character.relationships.engaged) return false;
      if (e.condition === 'hasChildren' && (!character.relationships.children || character.relationships.children.length === 0)) return false;
      if (e.condition === 'employed' && !character.career.employed) return false;
      if (e.condition === 'unemployed' && character.career.employed) return false;
      if (e.condition === 'inUniversity' && !character.education.inUniversity) return false;
      if (e.condition === 'hasStudentDebt' && (!character.finances.debt || character.finances.debt < 1000)) return false;
      if (e.condition === 'highSmarts' && character.stats.smarts < 65) return false;
      if (e.condition === 'parentsMarried' && !character.family.parentsMarried) return false;
      if (e.condition === 'hasPet' && !character.hasPet) return false;
    }
    return true;
  });
};
