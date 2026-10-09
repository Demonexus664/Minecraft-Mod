// Player creation (from real roster data or generated), tendencies and contracts.
window.HL = window.HL || {};

HL.POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C'];

HL.fmtHeight = (inches) => `${Math.floor(inches / 12)}'${inches % 12}"`;

let _pid = 1;
HL.nextPlayerId = () => _pid++;
HL.setNextPlayerId = (v) => { _pid = v; };

// Tendencies drive how a player plays in the sim. MyCareer players can edit their own.
HL.defaultTendencies = function (p) {
  const a = p.attrs;
  const offSkill = Math.max(a.layup, a.dunk, a.close, a.post) * 0.4 + Math.max(a.mid, a.three) * 0.35 + a.handle * 0.25;
  return {
    usage: HL.clamp(Math.round(32 + (offSkill - 60) * 1.25 + (p.ovr - 70) * 0.7), 5, 100),
    three: HL.clamp(Math.round(27 + (a.three - 55) * 1.6), 0, 100),
    mid: HL.clamp(Math.round(20 + (a.mid - 65) * 0.9), 0, 100),
    drive: HL.clamp(Math.round(25 + (a.layup + a.dunk + a.speed - 195) * 0.5), 0, 100),
    post: HL.clamp(Math.round(5 + (a.post - 60) * 1.0), 0, 100),
    passFirst: HL.clamp(Math.round(30 + (a.pass - 60) * 1.2), 0, 100),
    gamble: HL.clamp(Math.round(30 + (a.steal - 60) * 0.8), 0, 100),
    crash: HL.clamp(Math.round(25 + (a.oreb - 55) * 0.9), 0, 100),
    effort: 75,
    foulAggr: 50,
  };
};

HL.estimateSalary = function (ovr, age) {
  // $M, rough market curve.
  if (ovr >= 90) return 45 + (ovr - 90) * 1.5;
  if (ovr >= 85) return 32 + (ovr - 85) * 2.6;
  if (ovr >= 80) return 18 + (ovr - 80) * 2.8;
  if (ovr >= 75) return 8 + (ovr - 75) * 2;
  if (ovr >= 70) return age <= 23 ? 4 : 3 + (ovr - 70) * 1;
  return age <= 22 ? 2.5 : 2.1;
};

HL.createPlayer = function ({ name, pos, age, height, ovr, arch, salary, injGames, teamId, nbaId, potential, real = true, season }) {
  const R = HL.RNG;
  const heightIn = height;
  const weight = Math.round(185 + (heightIn - 76) * 7 + R.normal(0, 10));
  const wingspan = heightIn + Math.round(R.normal(3, 2));
  const attrs = HL.buildAttributes(ovr, pos, heightIn, arch);
  const p = {
    id: HL.nextPlayerId(),
    name, pos, age, height: heightIn, weight, wingspan, arch,
    born: (season || 2025) - age,
    real, nbaId: nbaId || null,
    attrs,
    ovr: HL.computeOvr(attrs, pos),
    traits: {
      workEthic: HL.clamp(Math.round(R.normal(60, 15)), 10, 99),
      ego: HL.clamp(Math.round(R.normal(50, 18) + (ovr - 75) * 0.8), 5, 99),
      clutch: HL.clamp(Math.round(R.normal(55, 15) + (ovr - 75) * 0.5), 10, 99),
      loyalty: HL.clamp(Math.round(R.normal(50, 18)), 5, 99),
      greed: HL.clamp(Math.round(R.normal(50, 18)), 5, 99),
      competitive: HL.clamp(Math.round(R.normal(60, 15)), 10, 99),
      leadership: HL.clamp(Math.round(R.normal(50, 18) + (age - 25) * 1.5), 5, 99),
      temperament: HL.clamp(Math.round(R.normal(55, 18)), 5, 99),
    },
    teamId: teamId ?? null,
    morale: 70,
    injury: injGames ? { name: 'Pre-season injury', games: injGames } : null,
    contract: null,
    stats: {},       // season -> totals
    careerAwards: [],
    draft: null,
  };
  p.potential = potential ?? Math.max(p.ovr, Math.round(p.ovr + Math.max(0, (24 - age)) * R.range(1.2, 3.2)));
  p.tend = HL.defaultTendencies(p);
  const sal = salary ?? HL.estimateSalary(p.ovr, age);
  p.contract = { amount: Math.round(sal * 10) / 10, exp: (season || 2025) + R.int(0, 3) };
  return p;
};

HL.parseRosterLine = function (line) {
  const [name, pos, age, height, ovr, arch, salary, inj] = line.split('|').map(s => s.trim());
  return {
    name, pos, age: +age, height: +height, ovr: +ovr, arch,
    salary: salary ? +salary : undefined,
    injGames: inj ? +inj : 0,
  };
};

HL.headshotUrl = (p) => p.nbaId ? `https://cdn.nba.com/headshots/nba/latest/1040x760/${p.nbaId}.png` : null;

HL.blankStatLine = () => ({ gp: 0, gs: 0, min: 0, pts: 0, fgm: 0, fga: 0, tpm: 0, tpa: 0, ftm: 0, fta: 0, orb: 0, drb: 0, ast: 0, stl: 0, blk: 0, tov: 0, pf: 0, pm: 0 });
