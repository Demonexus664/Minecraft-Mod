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
  // Estimated basketball traits, not official measured tracking values.
  ['accel', 'Acceleration', 'Athleticism'],
  ['lateral', 'Lateral Quickness', 'Defense'],
  ['releaseSpeed', 'Release Speed (est.)', 'Shooting Mechanics'],
  ['releaseHeight', 'Release Height (est.)', 'Shooting Mechanics'],
  ['shotArc', 'Shot Arc & Touch (est.)', 'Shooting Mechanics'],
  ['contested', 'Contested Shot', 'Scoring'],
  ['screen', 'Screen Setting', 'Finishing'],
  ['hustle', 'Hustle', 'Athleticism'],
  ['burst', 'Explosiveness', 'Athleticism'],
  ['agility', 'Change of Direction', 'Athleticism'],
  ['contactFinish', 'Contact Finishing', 'Finishing'],
  ['floater', 'Floater & Touch', 'Finishing'],
  ['fade', 'Post & Turnaround Fade', 'Scoring'],
  ['footwork', 'Footwork', 'Finishing'],
  ['shotCreation', 'Shot Creation', 'Scoring'],
  ['vision', 'Passing Vision', 'Playmaking'],
  ['passingAccuracy', 'Pass Accuracy', 'Playmaking'],
  ['helpD', 'Help Defense', 'Defense'],
  ['contestD', 'Shot Contest', 'Defense'],
  ['boxout', 'Box Out', 'Rebounding'],
  ['transition', 'Transition Threat', 'Athleticism'],
  ['clutchShot', 'Late-game Shotmaking', 'Scoring'],
  ['shotSelection', 'Shot Decision-Making (est.)', 'Scoring'],
].map(([key, label, group]) => ({ key, label, group }));

HL.ATTR_KEYS = HL.ATTRS.map(a => a.key);
HL.CORE_ATTR_KEYS = HL.ATTR_KEYS.filter(k => !['accel','lateral','releaseSpeed','releaseHeight','shotArc','contested','screen','hustle','burst','agility','contactFinish','floater','fade','footwork','shotCreation','vision','passingAccuracy','helpD','contestD','boxout','transition','clutchShot','shotSelection'].includes(k));
HL.ADV_ATTR_KEYS = HL.ATTR_KEYS.filter(k => !HL.CORE_ATTR_KEYS.includes(k));

// The historical box-score database contains the core 21 skills. No release-time or
// jump-height tracking exists for many old seasons. These additional values are scouting
// estimates derived independently from relevant traits and player dimensions.
// Keep them separate from accuracy and mark them as modeled in every detail screen.
HL.completeAttributes = function (a, height = 78, weight = 210) {
  const h=Number.isFinite(height)?height:78, w=Number.isFinite(weight)?weight:210;
  const val = (key, fallback=65) => Number.isFinite(a[key]) ? a[key] : fallback;
  const clip = x => Math.round(HL.clamp(x,25,99));
  const result={...a};
  const derived={
    accel: clip(val('speed')*.69+val('handle')*.19+val('vert')*.12),
    lateral: clip(val('perD')*.44+val('speed')*.34+val('steal')*.22),
    releaseSpeed: clip(val('three')*.33+val('mid')*.25+val('handle')*.22+val('iq')*.20),
    // A release score describes elevation relative to frame and skill, not raw height alone.
    // The matchup system already handles the player's absolute physical reach.
    releaseHeight: clip(50+(h-70)*1.35+(val('vert')-65)*.18+
      (Math.max(val('mid'),val('three'))-65)*.25+(val('iq')-65)*.04),
    shotArc: clip(val('ft')*.36+val('mid')*.30+val('three')*.20+val('iq')*.14),
    contested: clip(val('mid')*.28+val('close')*.18+val('handle')*.20+val('iq')*.20+val('str')*.14),
    screen: clip(val('str')*.58+val('iq')*.22+val('post')*.2+(w-215)*.05),
    hustle: clip(val('stam')*.38+val('dur')*.16+val('oreb')*.18+val('perD')*.14+val('iq')*.14),
    burst: clip(Math.max(val('vert')*.62+val('speed')*.38, val('dunk')*.42+val('vert')*.35+val('speed')*.23)),
    agility: clip(val('speed')*.39+val('handle')*.31+val('perD')*.20+val('vert')*.10),
    contactFinish: clip(val('layup')*.26+val('dunk')*.25+val('str')*.33+val('close')*.16),
    floater: clip(val('layup')*.40+val('mid')*.24+val('iq')*.21+val('ft')*.15),
    fade: clip(val('post')*.24+val('mid')*.48+val('close')*.08+val('iq')*.20 + Math.max(0,Math.min(val('mid'),val('post'))-80)*.32),
    footwork: clip(val('post')*.34+val('handle')*.27+val('iq')*.24+val('layup')*.15),
    shotCreation: clip(val('handle')*.39+val('mid')*.32+val('iq')*.15+val('layup')*.14),
    vision: clip(val('pass')*.65+val('iq')*.35),
    passingAccuracy: clip(val('pass')*.64+val('handle')*.15+val('iq')*.21),
    helpD: clip(val('intD')*.30+val('perD')*.25+val('block')*.22+val('iq')*.23),
    contestD: clip(val('perD')*.30+val('intD')*.30+val('block')*.22+val('vert')*.18),
    boxout: clip(val('dreb')*.49+val('oreb')*.16+val('str')*.27+val('iq')*.08 + Math.max(0,(val('dreb')-88)*.23)),
    transition: clip(val('speed')*.30+val('vert')*.20+val('layup')*.25+val('handle')*.25),
    clutchShot: clip(val('mid')*.26+val('three')*.18+val('close')*.16+val('iq')*.29+val('ft')*.11 + Math.max(0,val('iq')-88)*.28),
    // Decision-making is a skill. Shot-diet percentages are NOT ratings of shot quality.
    shotSelection: clip(val('iq')*.42 + val('shotCreation',
      val('handle')*.42+val('mid')*.32+val('iq')*.13+val('layup')*.13)*.22 +
      val('layup')*.13+val('pass')*.10+
      Math.max(val('mid'),val('three'),val('close'))*.13)
  };
  for(const k of HL.ADV_ATTR_KEYS) if(!Number.isFinite(result[k]))result[k]=derived[k];
  return result;
};
// Use the exact same historical attribute projection for Skill Draft, 82-0,
// exhibition games and Franchise. Never invent packed data fields.
const historicalAttributeCache = new WeakMap();
HL.historicalAttributes = function(row) {
  if (historicalAttributeCache.has(row)) return historicalAttributeCache.get(row);
  const bio=HL.HISTORY.players[row.pid]||[];
  const base=HL.History.unpack(row.attrs,HL.HISTORY.attrs);
  const result=HL.completeAttributes(base,bio[3],bio[4]);
  // Historical rebound production is independent evidence of rebounding talent.
  // Per-36 avoids treating a high-minute era as inherently more skilled; height
  // prevents guard rebounding volume from turning into a fictional elite box-out.
  if (row.g >= 20 && Number.isFinite(row.trb) && Number.isFinite(row.mpg) && row.mpg > 12) {
    const per36 = row.trb * 36 / row.mpg;
    const size = (bio[3] || 78) >= 80 ? 1 : 0.55;
    const adjustment = HL.clamp((per36 - 8.2)*3.0,-5,14) * size * HL.clamp(row.g/50,0,1);
    result.oreb = Math.round(HL.clamp(base.oreb + adjustment*.84,25,99));
    result.dreb = Math.round(HL.clamp(base.dreb + adjustment,25,99));
    // Derive the dependent attributes AFTER the measured-production correction.
    result.boxout = HL.completeAttributes({ ...base, oreb:result.oreb, dreb:result.dreb },bio[3],bio[4]).boxout;
  }
  // Genuine high-usage midrange specialists have demonstrated the repetition and
  // footwork that the generic average could not identify; this is still a proxy.
  if (row.g >= 30 && row.pts >= 24 && result.mid >= 82) {
    result.fade = Math.round(HL.clamp(result.fade + Math.min(9,(result.mid-80)*.48) + (result.post>=75?2:0),25,99));
    result.clutchShot = Math.round(HL.clamp(result.clutchShot + Math.min(7,(row.pts-22)*.32),25,99));
  }
  // FG% is an imperfect cross-era proxy (especially for bigs); use only a
  // small, bounded contextual correction. IQ and shot creation drive the skill.
  if (Number.isFinite(row.fgp) && row.g>=15) {
    const reliability=HL.clamp(row.g/45,0,1);
    const baseline=(bio[3]||78)>=82 ? .51 : .455;
    result.shotSelection=Math.round(HL.clamp(result.shotSelection+
      HL.clamp((row.fgp-baseline)*43,-6,6)*reliability,25,99));
  }
  // Carefully scoped 100-tier scouting grades. They are not derived by raising
  // every rating to a requested OVR. Each case requires a documented combination
  // of a historic specialty and strong season production; every weakness stays.
  const name=String(bio[0]||'');
  if (name === 'Stephen Curry' && row.g >= 50 && row.pts >= 24 &&
      row.tpp >= .40 && result.three >= 97) result.three=100;
  if (name === 'Michael Jordan' && row.g >= 50 && row.pts >= 26 &&
      result.mid >= 85 && result.fade >= 90 && row.bpm >= 7.5)
    result.fade=100;
  if (name === "Shaquille O'Neal" && row.g >= 50 && row.pts >= 25 &&
      row.fgp >= .55 && result.dunk >= 93) result.dunk=100;
  historicalAttributeCache.set(row,result);
  return result;
};


// A historical season's OVR is an evaluation of its demonstrated impact, in
// addition to the independently computed basketball skills.  The box-score
// record's BPM measures era-relative impact; scoring at volume and elite 3PT
// gravity supply complementary evidence. No player's name or desired OVR is
// used here, and NO unrelated attributes are raised to hit an OVR number.
// Important: a small per-game sample cannot establish an all-time season.
const historicalOvrCache = new WeakMap();
HL.historicalSeasonImpact = function (row, attrs) {
  if (!row) return 0;
  const a=attrs || HL.historicalAttributes(row);
  const games=Number(row.g)||0, minutes=Number(row.mpg)||0;
  if (games < 15 || minutes < 15) return 0;
  const bpm=Number.isFinite(row.bpm)?row.bpm:0;
  const ppg=Number.isFinite(row.pts)?row.pts:0;
  const sample=HL.clamp((games-12)/43,0,1) * HL.clamp((minutes-15)/13,0,1);
  // Advanced impact statistics are not exact for all early seasons. Season
  // production is weighted more conservatively when BPM is unavailable.
  const measuredImpact=Math.max(0,bpm-4)*0.85;
  const scoringVolume=Math.max(0,ppg-24)*0.31;
  const shotDiet = typeof row.tend === 'string' && HL.HISTORY?.tends
    ? HL.History.unpack(row.tend,HL.HISTORY.tends) : {};
  const eliteShooting=HL.clamp((a.three-90)/9,0,1);
  const highVolume=HL.clamp(((shotDiet.three||0)-30)/40,0,1);
  const gravity=ppg>=20 ? eliteShooting*highVolume*2.8 : 0;
  return HL.clamp((measuredImpact+scoringVolume+gravity)*sample,0,11);
};
HL.historicalSeasonOvr = function (row) {
  if (historicalOvrCache.has(row)) return historicalOvrCache.get(row);
  const a=HL.historicalAttributes(row);
  const skillOvr=HL.computeOvr(a,row.pos);
  const ovr=Math.round(HL.clamp(skillOvr + HL.historicalSeasonImpact(row,a),25,99));
  historicalOvrCache.set(row,ovr);
  return ovr;
};

// The 100 overall is reserved for exceptional real historical peak seasons,
// not all players with a regular 99 OVR. Only a natural-position fit can unlock
// this extra OVR point. This function does not modify the underlying attributes.
HL.legendaryPeak = function(row) {
  if (!row || row.g < 50 || row.mpg < 28 || HL.historicalSeasonOvr(row) < 99) return false;
  const bio=HL.HISTORY?.players?.[row.pid] || [];
  const name=bio[0];
  // All-time production and impact threshold, with limited documented peak
  // seasons where BPM is less useful than the historical achievements.
  if (row.bpm >= 10 && row.pts >= 23) return true;
  if (name==='LeBron James' && row.bpm>=8.5 && row.pts>=25) return true;
  if (name==='Michael Jordan' && row.bpm>=8 && row.pts>=27) return true;
  if (name==='Stephen Curry' && row.bpm>=7.5 && row.pts>=28 && row.tpp>=.40) return true;
  if (name==="Shaquille O'Neal" && row.bpm>=8 && row.pts>=27 && row.fgp>=.55) return true;
  return false;
};

// Nonlinear elite response. 99 is a difference-making skill, not a cosmetic +1.
// It is deliberately bounded; opposing elite defense can counter elite offense.
HL.eliteImpact = r => {
  const grade=HL.clamp(Number(r)||0,25,100);
  const gradual=Math.pow(Math.max(0,grade-88)/11,1.35);
  // The historic 100 tier should be noticeable, while still counterable.
  return gradual+(grade===100?.28:0);
};

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

// Each position gets a small supporting weight for specialist movement and
// shot creation. Core ratings retain most of the OVR influence.
for (const [pos,w] of Object.entries(HL.OVR_WEIGHTS)) {
  Object.assign(w, {
    accel: ['PG','SG'].includes(pos) ? 1.0 : .5,
    lateral: ['PG','SG','SF'].includes(pos) ? .8 : .5,
    releaseSpeed: ['PG','SG','SF'].includes(pos) ? .7 : .35,
    releaseHeight: ['PF','C'].includes(pos) ? .55 : .4,
    shotArc: .35, shotSelection: .65, contested: .7, screen: ['PF','C'].includes(pos) ? .7 : .25,
    hustle: .45, burst: .75, agility: .35, contactFinish: .4, floater: .2, fade: .2, footwork: .3, shotCreation: .5, vision: .35, passingAccuracy: .3, helpD: .4, contestD: .4, boxout: .25, transition: .35, clutchShot: .15
  });
}

// OVR = weighted average blended with top-attribute peaks, so specialists still rate well.
HL.computeOvr = function (a, pos) {
  const w = HL.OVR_WEIGHTS[pos] || HL.OVR_WEIGHTS.SF;
  let sum = 0, wsum = 0;
  for (const k in w) { sum += (Number.isFinite(a[k]) ? a[k] : 65) * w[k]; wsum += w[k]; }
  const avg = sum / wsum;
  const top = HL.CORE_ATTR_KEYS.filter(k => k !== 'dur' && k !== 'stam').map(k => Number.isFinite(a[k]) ? a[k] : 65).sort((x, y) => y - x).slice(0, 6);
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
  for (const k of HL.CORE_ATTR_KEYS) {
    raw[k] = 60 + (prof[k] || 0) * 1.25 * amp + (hm[k] || 0) + R.normal(0, opts.noise ?? 4.5);
  }
  raw.stam = 70 + R.normal(0, 6);
  raw.dur = opts.durability ?? (75 + R.normal(0, 9));

  let shift = targetOvr - 60;
  let attrs = {};
  // Iteratively shift until computed OVR matches target.
  for (let i = 0; i < 12; i++) {
    for (const k of HL.CORE_ATTR_KEYS) {
      const k2 = k === 'dur' ? 0 : k === 'stam' ? 0.4 : 1;
      attrs[k] = Math.round(HL.clamp(raw[k] + shift * k2, 25, 99));
    }
    const diff = targetOvr - HL.computeOvr(attrs, pos);
    if (diff === 0) break;
    shift += diff * 0.9;
  }
  return HL.completeAttributes(attrs, heightIn, Math.round(185 + (heightIn - 76) * 7));
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
  // A rare breakout is possible, but routine offseasons shouldn't randomly erase stars.
  // Physical decline can remain steeper than skill decline in applyProgression.
  const noise = R.normal(0, age >= 30 ? 0.8 : 1.5);
  return HL.clamp(base + noise, age >= 30 ? -3.2 : -2.5, age >= 30 ? 1.5 : 4.5);
};

HL.applyProgression = function (p, delta) {
  const physical = new Set(['speed', 'vert', 'accel', 'lateral', 'stam']);
  for (const k of HL.ATTR_KEYS) {
    if (k === 'dur') continue;
    let d = delta + HL.RNG.normal(0, 0.65);
    // Old players lose burst first; shooting touch, technique and court vision endure.
    if (delta < 0 && physical.has(k)) d *= 1.45;
    if (delta < 0 && ['three','mid','ft','iq','pass','post','handle','releaseSpeed','shotArc'].includes(k)) d *= 0.25;
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
