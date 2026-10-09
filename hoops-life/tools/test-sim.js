const { load } = require('./load');
const HL = load(['js/core/rng.js', 'data/names.js', 'data/injuries.js', 'js/league/teams.js', 'js/league/ratings.js', 'js/league/player.js', 'data/rosters2025.js', 'js/league/gamesim.js']);
HL.RNG.setSeed(12345);
const teams = HL.TEAMS.map(t => ({ ...t, players: HL.ROSTERS_2025[t.abbr].trim().split('\n').map(l => HL.createPlayer({ ...HL.parseRosterLine(l), teamId: t.id })) }));
for (const t of teams) for (const p of t.players) p.injury = null;
const N = +process.argv[2] || 400;
const tot = { pts: 0, fga: 0, fgm: 0, tpa: 0, tpm: 0, fta: 0, ftm: 0, orb: 0, drb: 0, ast: 0, stl: 0, blk: 0, tov: 0, pf: 0, games: 0, inj: 0, ot: 0 };
const pstats = {};
const t0 = Date.now();
for (let i = 0; i < N; i++) {
  const h = teams[HL.RNG.int(0, 29)]; let a = teams[HL.RNG.int(0, 29)]; if (a === h) a = teams[(h.id + 1) % 30];
  const r = HL.simGame(h, a);
  tot.ot += r.ot ? 1 : 0; tot.inj += r.injuries.length;
  for (const side of [r.home, r.away]) {
    tot.games++;
    for (const id in side.box) { const l = side.box[id]; for (const k in tot) if (k in l) tot[k] += l[k];
      const ps = pstats[id] = pstats[id] || { g: 0, pts: 0, reb: 0, ast: 0, min: 0 }; ps.g++; ps.pts += l.pts; ps.reb += l.orb + l.drb; ps.ast += l.ast; ps.min += l.min; }
  }
}
const g = tot.games;
const poss = (tot.fga - tot.orb + tot.tov + 0.44 * tot.fta) / g;
console.log(`games ${N} in ${Date.now() - t0}ms`);
console.log(`PPG ${(tot.pts / g).toFixed(1)}  poss ${poss.toFixed(1)}  ORtg ${(100 * tot.pts / g / poss).toFixed(1)}`);
console.log(`FG% ${(tot.fgm / tot.fga * 100).toFixed(1)}  3P% ${(tot.tpm / tot.tpa * 100).toFixed(1)}  3PAr ${(tot.tpa / tot.fga * 100).toFixed(1)}  eFG ${((tot.fgm + 0.5 * tot.tpm) / tot.fga * 100).toFixed(1)}  FT% ${(tot.ftm / tot.fta * 100).toFixed(1)}  FTr ${(tot.fta / tot.fga).toFixed(3)}`);
console.log(`FGA ${(tot.fga / g).toFixed(1)} 3PA ${(tot.tpa / g).toFixed(1)} FTA ${(tot.fta / g).toFixed(1)} ORB ${(tot.orb / g).toFixed(1)} DRB ${(tot.drb / g).toFixed(1)} AST ${(tot.ast / g).toFixed(1)} STL ${(tot.stl / g).toFixed(1)} BLK ${(tot.blk / g).toFixed(1)} TOV ${(tot.tov / g).toFixed(1)} (per100 ${(100 * tot.tov / g / poss).toFixed(1)}) PF ${(tot.pf / g).toFixed(1)}`);
console.log(`ORB% ${(tot.orb / (tot.orb + tot.drb) * 100).toFixed(1)}  OT games ${(tot.ot / N * 100).toFixed(1)}%  injuries/team-game ${(tot.inj / g).toFixed(3)}`);
const all = teams.flatMap(t => t.players);
const top = Object.entries(pstats).map(([id, s]) => ({ p: all.find(x => x.id == id), ...s })).filter(x => x.g >= 8).sort((a, b) => b.pts / b.g - a.pts / a.g).slice(0, 15);
for (const x of top) console.log(`${x.p.name.padEnd(26)} ${x.p.ovr} ${(x.min / x.g).toFixed(1)}m ${(x.pts / x.g).toFixed(1)}p ${(x.reb / x.g).toFixed(1)}r ${(x.ast / x.g).toFixed(1)}a`);
// Distribution check vs real 2024-25 (min 15 games in sample, starters-ish)
const qual = Object.entries(pstats).map(([id, s]) => ({ p: all.find(x => x.id == id), g: s.g, ppg: s.pts / s.g, rpg: s.reb / s.g, apg: s.ast / s.g, mpg: s.min / s.g })).filter(x => x.g >= 15 && x.mpg >= 20);
const rank = (k, ns) => { const v = qual.map(x => x[k]).sort((a, b) => b - a); return ns.map(n => `#${n}:${(v[n - 1] || 0).toFixed(1)}`).join(' '); };
console.log('PPG ranks', rank('ppg', [1, 5, 10, 25, 50, 100]), '| real ~ #1:32.7 #5:28 #10:25.5 #25:21.5 #50:18 #100:13');
console.log('RPG ranks', rank('rpg', [1, 5, 10, 25, 50]), '| real ~ #1:13.9 #5:11.5 #10:10.2 #25:8 #50:6.5');
console.log('APG ranks', rank('apg', [1, 5, 10, 25, 50]), '| real ~ #1:11.6 #5:9 #10:7.5 #25:5.5 #50:4');
const guards = qual.filter(x => x.p.pos === 'PG' || x.p.pos === 'SG'); const bigs = qual.filter(x => x.p.pos === 'C');
console.log(`guard avg RPG ${(guards.reduce((s, x) => s + x.rpg, 0) / guards.length).toFixed(1)} (real ~4) | C avg RPG ${(bigs.reduce((s, x) => s + x.rpg, 0) / bigs.length).toFixed(1)} (real ~8.5)`);
