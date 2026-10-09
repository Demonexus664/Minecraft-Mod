// Sim a real season with its real rosters and compare with what actually happened.
// Usage: node tools/test-history.js <seasonStartYear> [seed]
const { load, ctx } = require('./load');
const fs = require('fs');
const key = process.argv[2] || '2025';
const HL = load(['js/core/rng.js', 'data/names.js', 'data/injuries.js', 'data/nbaids.js', 'js/league/teams.js', 'js/league/ratings.js', 'js/league/player.js', 'js/league/gamesim.js', 'js/league/draft.js', 'js/league/history.js', 'js/media/engine.js', 'js/media/news.js', 'js/league/season.js', 'data/history/index.js', `data/history/seasons/${key}.js`]);
const L = HL.League.createFromSeason({ seasonKey: key, seed: +(process.argv[3] || 5) });
const t0 = Date.now();
while (L.phase === 'regular') HL.League.simDay();
const corr = (xs, ys) => { const n = xs.length, mx = xs.reduce((a, b) => a + b) / n, my = ys.reduce((a, b) => a + b) / n; let sxy = 0, sxx = 0, syy = 0; for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; syy += (ys[i] - my) ** 2; } return sxy / Math.sqrt(sxx * syy); };
// League averages
let pts = 0, fga = 0, fgm = 0, tpm = 0, tpa = 0, fta = 0, ftm = 0, tov = 0, orb = 0, drb = 0, games = 0;
for (const p of Object.values(L.players)) { const s = p.stats[key]; if (!s) continue; pts += s.pts; fga += s.fga; fgm += s.fgm; tpm += s.tpm; tpa += s.tpa; fta += s.fta; ftm += s.ftm; tov += s.tov; orb += s.orb; drb += s.drb; }
games = L.schedule.length * 2;
const poss = (fga - orb + tov + 0.44 * fta) / games;
const P = L.profile || {};
console.log(`${key}-${(+key + 1) % 100} simmed in ${Date.now() - t0}ms, ${L.teams.length} teams, ${L.games} games`);
console.log(`pace ${poss.toFixed(1)} (real ${P.pace}) | ORtg ${(100 * pts / games / poss).toFixed(1)} (real ${P.ortg}) | eFG ${((fgm + 0.5 * tpm) / fga).toFixed(3)} (real ${P.efg}) | TOV% ${(100 * tov / (fga + 0.44 * fta + tov)).toFixed(1)} (real ${P.tov}) | ORB% ${(100 * orb / (orb + drb)).toFixed(1)} (real ${P.orb}) | FT/FGA ${(ftm / fga).toFixed(3)} (real ${P.ftr}) | 3PAr ${(tpa / fga).toFixed(3)} (real ${P.tpar})`);
// Teams
const tw = L.teams.map(t => t.w / (t.w + t.l)), rw = L.teams.map(t => t.real.w / (t.real.w + t.real.l));
console.log(`team win% correlation with real: ${corr(tw, rw).toFixed(2)}`);
console.log('sim vs real:', L.teams.slice().sort((a, b) => b.w - a.w).slice(0, 8).map(t => `${t.abbr} ${t.w}-${t.l} (${t.real.w}-${t.real.l})`).join(', '));
// Players
const rows = HL.History.seasonRows(key);
const byHid = new Map(rows.map(r => [r.pid, r]));
const pairs = [];
for (const p of Object.values(L.players)) {
  const s = p.stats[key], r = byHid.get(p.hid);
  if (!s || !r || s.gp < 40 || r.g < 40) continue;
  pairs.push({ p, r, ppg: s.pts / s.gp, rpg: (s.orb + s.drb) / s.gp, apg: s.ast / s.gp, mpg: s.min / s.gp });
}
const cmp = (k, rk) => `${k}: r=${corr(pairs.map(x => x[k]), pairs.map(x => x.r[rk])).toFixed(2)} MAE=${(pairs.reduce((a, x) => a + Math.abs(x[k] - x.r[rk]), 0) / pairs.length).toFixed(2)}`;
console.log(`players compared: ${pairs.length} | ${cmp('ppg', 'pts')} | ${cmp('rpg', 'trb')} | ${cmp('apg', 'ast')} | ${cmp('mpg', 'mpg')}`);
const top = pairs.slice().sort((a, b) => b.ppg - a.ppg).slice(0, 10);
console.log('top scorers (sim / real):', top.map(x => `${x.p.name} ${x.ppg.toFixed(1)}/${x.r.pts}`).join(', '));
