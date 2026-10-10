// Attributes, archetype profiles, OVR formula and age-based progression.
window.HL = window.HL || {};

HL.ATTRS = [
  // key, label, group
  ['close', 'Close Shot', 'Scoring'],
  ['mid', 'Mid-Range', 'Scoring'],
  ['three', 'Three-Point', 'Scoring'],
  ['ft', 'Free Throw', 'Scoring'],
  ['layup', 'Layup', 'Finishing'],
  ['dunk', 'Dunk', 'Finishing'],
  ['post', 'Post Control', 'Finishing'],
  ['handle', 'Ball Handle', 'Playmaking'],
  ['pass', 'Passing', 'Playmaking'],
  ['iq', 'Basketball IQ', 'Playmaking'],
  ['perD', 'Perimeter D', 'Defense'],
  ['intD', 'Interior D', 'Defense'],
  ['steal', 'Steal', 'Defense'],
  ['block', 'Block', 'Defense'],
  ['oreb', 'Off. Rebound', 'Rebounding'],
  ['dreb', 'Def. Rebound', 'Rebounding'],
  ['speed', 'Speed', 'Athleticism'],
  ['vert', 'Vertical', 'Athleticism'],
  ['str', 'Strength', 'Athleticism'],
  ['stam', 'Stamina', 'Athleticism'],
  ['dur', 'Durability', 'Athleticism'],
].map(([key, label, group]) => ({ key, label, group }));

HL.ATTR_KEYS = HL.ATTRS.map(a => a.key);

// Relative strengths per archetype (added to a base around the target OVR).
HL.ARCHETYPES = {
  scorer:      { label: 'Shot Creator',      p: { mid: 12, three: 8, ft: 8, layup: 8, handle: 8, close: 6, iq: 4, perD: -6, intD: -10, block: -10, oreb: -10, dreb: -6, pass: 0 } },
  sniper:      { label: 'Sharpshooter',      p: { three: 16, mid: 8, ft: 12, iq: 4, dunk: -12, post: -10, intD: -10, block: -12, oreb: -12, str: -6, layup: -2 } },
  slasher:     { label: 'Slasher',           p: { layup: 14, dunk: 12, speed: 10, vert: 10, handle: 4, close: 6, three: -8, mid: -4, post: -6, block: -6 } },
  playmaker:   { label: 'Floor General',     p: { pass: 16, handle: 14, iq: 10, three: 4, ft: 6, speed: 4, dunk: -10, post: -10, intD: -12, block: -14, oreb: -12, dreb: -8, str: -8 } },
  '3d':        { label: '3&D Wing',          p: { three: 10, perD: 12, steal: 6, ft: 2, handle: -6, pass: -6, post: -8, mid: -2 } },
  twoway:      { label: 'Two-Way Wing',      p: { perD: 10, steal: 6, layup: 6, mid: 4, three: 2, speed: 4, iq: 4, post: -6, block: -2 } },
  defguard:    { label: 'Lockdown Guard',    p: { perD: 16, steal: 12, speed: 6, iq: 4, handle: 2, three: -2, mid: -4, post: -10, block: -6, dunk: -6 } },
  pointfwd:    { label: 'Point Forward',     p: { pass: 12, handle: 6, iq: 10, layup: 6, dreb: 4, str: 4, three: -2, perD: 2 } },
  rimbig:      { label: 'Rim Runner',        p: { dunk: 14, close: 10, oreb: 14, dreb: 10, block: 8, vert: 8, intD: 6, three: -20, mid: -10, handle: -14, pass: -8, ft: -10 } },
  stretchbig:  { label: 'Stretch Big',       p: { three: 10, mid: 8, ft: 6, dreb: 8, close: 4, handle: -10, speed: -6, steal: -6, perD: -6, dunk: -4 } },
  postbig:     { label: 'Post Scorer',       p: { post: 16, close: 12, str: 10, oreb: 8, dreb: 8, mid: 2, three: -12, speed: -10, handle: -12, perD: -10, steal: -8 } },
  defbig:      { label: 'Rim Protector',     p: { block: 16, intD: 16, dreb: 12, oreb: 8, str: 6, three: -16, mid: -8, handle: -16, pass: -8, ft: -8, layup: -4 } },
  unicorn:     { label: 'Unicorn',           p: { block: 12, intD: 10, three: 6, dreb: 8, mid: 4, vert: 4, handle: -4, post: -2, str: -4 } },
  pointcenter: { label: 'Point Center',      p: { pass: 16, iq: 14, post: 10, close: 10, dreb: 10, str: 6, mid: 4, speed: -14, vert: -10, steal: -4, perD: -10, dunk: -6, block: -9, intD: -5 } },
};

// How much each attribute matters to OVR per position.
HL.OVR_WEIGHTS = {
  PG: { close: 1, mid: 3, three: 4, ft: 1, layup: 3, dunk: 0.5, post: 0.2, handle: 4, pass: 4, iq: 3, perD: 3, intD: 0.5, steal: 2, block: 0.3, oreb: 0.3, dreb: 1, speed: 3, vert: 1, str: 0.5, stam: 1 },
  SG: { close: 1, mid: 3, three: 4, ft: 1, layup: 3, dunk: 1, post: 0.3, handle: 3, pass: 2, iq: 3, perD: 3, intD: 0.5, steal: 2, block: 0.5, oreb: 0.5, dreb: 1, speed: 3, vert: 1.5, str: 0.7, stam: 1 },
  SF: { close: 1.5, mid: 3, three: 3, ft: 1, layup: 3, dunk: 2, post: 1, handle: 2, pass: 2, iq: 3, perD: 3, intD: 1.5, steal: 1.5, block: 1, oreb: 1, dreb: 2, speed: 2, vert: 2, str: 1.5, stam: 1 },
  PF: { close: 3, mid: 2, three: 2, ft: 1, layup: 2.5, dunk: 2.5, post: 2, handle: 1, pass: 1.5, iq: 3, perD: 2, intD: 3, steal: 1, block: 2, oreb: 2, dreb: 3, speed: 1.5, vert: 2, str: 2.5, stam: 1 },
  C:  { close: 4, mid: 1.5, three: 1.5, ft: 0.8, layup: 2, dunk: 3, post: 2.5, handle: 0.5, pass: 1.5, iq: 3, perD: 1, intD: 4, steal: 0.5, block: 3.5, oreb: 3, dreb: 4, speed: 1, vert: 2, str: 3, stam: 1 },
};

// OVR = weighted average blended with top-attribute peaks, so specialists still rate well.
HL.computeOvr = function (a, pos) {
  const w = HL.OVR_WEIGHTS[pos] || HL.OVR_WEIGHTS.SF;
  let sum = 0, wsum = 0;
  for (const k in w) { sum += a[k] * w[k]; wsum += w[k]; }
  const avg = sum / wsum;
  const top = HL.ATTR_KEYS.filter(k => k !== 'dur' && k !== 'stam').map(k => a[k]).sort((x, y) => y - x).slice(0, 6);
  const topAvg = top.reduce((s, v) => s + v, 0) / top.length;
  // Strengths drive OVR (like 2K), so stars keep real weaknesses.
  const raw = avg * 0.45 + topAvg * 0.55;
  return Math.round(HL.clamp(40 + (raw - 52) * 1.5, 25, 99));
};

// Height shapes what a body can do: bigs rebound/block, smalls are quick and handle.
function heightMods(heightIn) {
  const d = heightIn - 79; // 6'7" is neutral
  return {
    oreb: d * 1.6, dreb: d * 1.6, block: d * 1.8, intD: d * 1.4, post: d * 1.0, close: d * 0.6, dunk: d * 0.8, str: d * 1.0,
    speed: -d * 1.5, handle: -d * 1.3, steal: -d * 0.8, perD: -d * 0.6, pass: -d * 0.3, three: -d * 0.3,
  };
}

// Build a full attribute set whose OVR lands on the target.
HL.buildAttributes = function (targetOvr, pos, heightIn, arch, opts = {}) {
  const R = HL.RNG;
  // Archetypes can be combined ("scorer+playmaker"); profiles are blended.
  const parts = String(arch || 'twoway').split('+').map(a => (HL.ARCHETYPES[a] || HL.ARCHETYPES.twoway).p);
  const prof = {};
  for (const pp of parts) for (const k in pp) prof[k] = (prof[k] || 0) + pp[k] * (parts.length > 1 ? 0.7 : 1);
  // Stars have more extreme profiles: elite strengths, real weaknesses.
  const amp = 1 + Math.max(0, targetOvr - 72) * 0.045;
  const hm = heightMods(heightIn);
  const raw = {};
  for (const k of HL.ATTR_KEYS) {
    raw[k] = 60 + (prof[k] || 0) * 1.25 * amp + (hm[k] || 0) + R.normal(0, opts.noise ?? 4.5);
  }
  raw.stam = 70 + R.normal(0, 6);
  raw.dur = opts.durability ?? (75 + R.normal(0, 9));

  let shift = targetOvr - 60;
  let attrs = {};
  // Iteratively shift until computed OVR matches target.
  for (let i = 0; i < 12; i++) {
    for (const k of HL.ATTR_KEYS) {
      const k2 = k === 'dur' ? 0 : k === 'stam' ? 0.4 : 1;
      attrs[k] = Math.round(HL.clamp(raw[k] + shift * k2, 25, 99));
    }
    const diff = targetOvr - HL.computeOvr(attrs, pos);
    if (diff === 0) break;
    shift += diff * 0.9;
  }
  return attrs;
};

// Age curve: growth until ~26, plateau, decline after ~30.
HL.progressionDelta = function (age, potentialGap, workEthic, difficultyMult = 1) {
  const R = HL.RNG;
  let base;
  if (age <= 20) base = 4.5;
  else if (age <= 22) base = 3.2;
  else if (age <= 24) base = 2.0;
  else if (age <= 26) base = 0.9;
  else if (age <= 29) base = 0;
  else if (age <= 31) base = -0.8;
  else if (age <= 33) base = -1.7;
  else if (age <= 35) base = -2.6;
  else if (age <= 37) base = -3.4;
  else base = -4.2;
  if (base > 0) base *= HL.clamp(potentialGap / 10, 0.2, 1.6) * difficultyMult;
  // Work ethic helps young players grow and slows the decline of veterans.
  base += (workEthic - 50) / (base < 0 ? 60 : 40);
  // Variance: breakouts, busts and sudden drops.
  return HL.clamp(base + R.normal(0, age >= 30 ? 0.8 : 1.5), age >= 30 ? -3.2 : -2.5, age >= 30 ? 1.5 : 4.5);
};

HL.applyProgression = function (p, delta) {
  const physical = new Set(['speed', 'vert', 'stam']);
  for (const k of HL.ATTR_KEYS) {
    if (k === 'dur') continue;
    let d = delta + HL.RNG.normal(0, 0.65);
    // Athleticism fades faster with age; skills hold up.
    if (delta < 0 && physical.has(k)) d *= 1.45;
    if (delta < 0 && ['three','mid','ft','iq','pass','post','handle'].includes(k)) d *= 0.25;
    if (delta > 0 && k === 'iq') d += 0.5;
    const cap = (p.caps && p.caps[k]) || 99;
    p.attrs[k] = Math.round(HL.clamp(p.attrs[k] + d, 25, cap));
  }
  p.ovr = HL.computeOvr(p.attrs, p.pos);
};

HL.archetypeName = function (p) {
  // Name from top two attribute groups, MyCareer-style.
  const groups = {};
  for (const a of HL.ATTRS) {
    if (a.group === 'Athleticism') continue;
    (groups[a.group] = groups[a.group] || []).push(p.attrs[a.key]);
  }
  const avg = g => groups[g].reduce((s, v) => s + v, 0) / groups[g].length;
  const order = Object.keys(groups).sort((x, y) => avg(y) - avg(x));
  const adj = { Scoring: '3-Level', Finishing: 'Slashing', Playmaking: 'Playmaking', Defense: 'Lockdown', Rebounding: 'Glass-Cleaning' };
  const noun = { Scoring: 'Scorer', Finishing: 'Finisher', Playmaking: 'Shot Creator', Defense: 'Defender', Rebounding: 'Anchor' };
  return `${adj[order[1]]} ${noun[order[0]]}`;
};
