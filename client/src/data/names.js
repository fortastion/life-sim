export const MALE_NAMES = [
  'Liam','Noah','Oliver','Elijah','James','William','Benjamin','Lucas','Henry','Alexander',
  'Mason','Ethan','Daniel','Matthew','Jackson','Sebastian','Jack','Owen','Samuel','Ryan',
  'Tyler','Jayden','Brandon','Dylan','Jordan','Marcus','Caleb','Nathan','Aaron','Isaiah',
  'Carlos','Miguel','Diego','Rafael','Andre','Malik','Darius','Zion','Kai','Axel'
];

export const FEMALE_NAMES = [
  'Olivia','Emma','Ava','Sophia','Isabella','Mia','Luna','Charlotte','Amelia','Harper',
  'Evelyn','Abigail','Emily','Ella','Elizabeth','Camila','Chloe','Victoria','Sofia','Riley',
  'Aria','Scarlett','Grace','Lily','Penelope','Layla','Aurora','Zoey','Hannah','Stella',
  'Maya','Nadia','Alicia','Jasmine','Aaliyah','Priya','Leila','Sasha','Yara','Zoe'
];

export const LAST_NAMES = [
  'Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Martinez','Wilson',
  'Anderson','Taylor','Thomas','Hernandez','Moore','Martin','Jackson','Thompson','White','Lopez',
  'Lee','Gonzalez','Harris','Clark','Lewis','Robinson','Walker','Perez','Hall','Young',
  'Allen','Sanchez','Wright','King','Scott','Torres','Nguyen','Hill','Flores','Green',
  'Adams','Nelson','Baker','Rivera','Campbell','Mitchell','Carter','Roberts','Patel','Evans'
];

export const randomName = (gender) => {
  const first = gender === 'male'
    ? MALE_NAMES[Math.floor(Math.random() * MALE_NAMES.length)]
    : FEMALE_NAMES[Math.floor(Math.random() * FEMALE_NAMES.length)];
  const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return { first, last, full: `${first} ${last}` };
};
