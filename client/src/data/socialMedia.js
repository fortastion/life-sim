export const PLATFORMS = [
  { id: 'youtube',   name: 'YouTube',   icon: '▶️',  color: 'red',    niches: ['Gaming','Vlogs','Education','Comedy','Tech Reviews','Cooking','Fitness'],        baseViralChance: 0.03, adRatePerK: 2.5 },
  { id: 'tiktok',    name: 'TikTok',    icon: '🎵',  color: 'pink',   niches: ['Dance','Comedy','Trends','Cooking','Pets','DIY','Fashion'],                      baseViralChance: 0.06, adRatePerK: 0.8 },
  { id: 'instagram', name: 'Instagram', icon: '📸',  color: 'purple', niches: ['Lifestyle','Fashion','Fitness','Travel','Food','Art','Modeling'],                 baseViralChance: 0.04, adRatePerK: 1.5 },
  { id: 'twitch',    name: 'Twitch',    icon: '🎮',  color: 'violet', niches: ['Gaming','Just Chatting','Music','Art','Sports'],                                  baseViralChance: 0.02, adRatePerK: 3.5 },
  { id: 'x',         name: 'X',         icon: '✖️',  color: 'slate',  niches: ['News','Comedy','Politics','Tech','Finance','Sports'],                             baseViralChance: 0.05, adRatePerK: 0.5 },
];

export const POST_TYPES = [
  { id: 'quick',    name: 'Quick Post',    icon: '⚡', effort: 1, qualityMult: 0.6, followersPerK: 0.5,  desc: 'Low effort, low reward' },
  { id: 'standard', name: 'Standard',      icon: '📝', effort: 2, qualityMult: 1.0, followersPerK: 1.0,  desc: 'Balanced effort' },
  { id: 'quality',  name: 'Quality Post',  icon: '✨', effort: 3, qualityMult: 1.6, followersPerK: 2.0,  desc: 'High effort, high reward' },
  { id: 'collab',   name: 'Collab',        icon: '🤝', effort: 4, qualityMult: 2.2, followersPerK: 4.0,  desc: 'With another creator' },
];

export const FOLLOWER_TIERS = [
  { name: 'Nobody',     min: 0,        max: 999,       icon: '🌱', colorClass: 'text-slate-400',  bgClass: 'bg-slate-800/40' },
  { name: 'Micro',      min: 1000,     max: 9999,      icon: '🌿', colorClass: 'text-green-400',  bgClass: 'bg-green-900/30' },
  { name: 'Growing',    min: 10000,    max: 99999,     icon: '🌳', colorClass: 'text-emerald-400',bgClass: 'bg-emerald-900/30' },
  { name: 'Influencer', min: 100000,   max: 999999,    icon: '⭐', colorClass: 'text-yellow-400', bgClass: 'bg-yellow-900/30' },
  { name: 'Mega',       min: 1000000,  max: 9999999,   icon: '🌟', colorClass: 'text-orange-400', bgClass: 'bg-orange-900/30' },
  { name: 'Superstar',  min: 10000000, max: Infinity,  icon: '👑', colorClass: 'text-purple-400', bgClass: 'bg-purple-900/30' },
];

export function getTier(followers) {
  return FOLLOWER_TIERS.find(t => followers >= t.min && followers <= t.max) || FOLLOWER_TIERS[0];
}

export function formatFollowers(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
}
