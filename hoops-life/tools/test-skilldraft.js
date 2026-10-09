// Balance check for the Skill Draft Career: build players the way a person would (random spins,
// then a random / good / best pick from each list), sim their careers, and count the verdicts.
// Usage: node tools/test-skilldraft.js [runs] [style: random|good|best|worst] [seed]
const { load, ctx } = require('./load');
const fs = require('fs');
const path = require('path');
const runs = +(process.argv[2] || 20);
const style = process.argv[3] || 'good';
const seasons = fs.readdirSync(path.join(__dirname, '../data/history/seasons')).map(f => `data/history/seasons/${f}`);
const HL = load(['js/core/rng.js', 'data/names.js', 'data/injuries.js', 'data/nbaids.js', 'js/league/teams.js', 'js/league/ratings.js', 'js/league/player.js', 'js/league/gamesim.js', 'js/league/draft.js', 'js/league/history.js', 'js/media/engine.js', 'js/media/news.js', 'js/league/season.js', 'data/history/index.js', ...seasons]);
ctx.HL.UI = { esc: s => String(s) };
load(['js/modes/challenge820.js', 'js/modes/skilldraft.js']);
const R = HL.RNG;
R.setSeed(+(process.argv[4] || 7));
const decades = [1960, 1970, 1980, 1990, 2000, 2010, 2020];

function draftPicks() {
  const picks = {};
  for (const [id, , keys] of HL.SkillDraft.CATS) {
    const dec = R.pick(decades);
    const team = R.pick(HL.Challenge.franchisesIn(dec));
    const val = c => id === 'body' ? HL.HISTORY.players[c.row.pid][3] : keys.reduce((s, k) => s + HL.History.unpack(c.row.attrs, HL.HISTORY.attrs)[k], 0) / keys.length;
    const list = HL.Challenge.candidates(team, dec).sort((a, b) => val(b) - val(a));
    // "good": someone from the top three; "best": always the top value; "worst": the bottom; "random": anyone.
    const ix = style === 'worst' ? list.length - 1 : style === 'best' ? 0 : style === 'good' ? R.int(0, Math.min(2, list.length - 1)) : R.int(0, list.length - 1);
    picks[id] = list[ix];
  }
  return picks;
}

(async () => {
  const tiers = {};
  const t0 = Date.now();
  for (let i = 0; i < runs; i++) {
    const c = await HL.SkillDraft.simulate(draftPicks(), `Run ${i + 1}`, process.argv[5] ? +process.argv[5] : null);
    const [tier] = c.verdict;
    tiers[tier] = (tiers[tier] || 0) + 1;
    const peak = Math.max(...c.seasons.map(s => s.ovr), 0);
    const minors = c.seasons.filter(s => s.minors).length;
    const best = c.seasons.slice().sort((a, b) => b.ppg - a.ppg)[0];
    const n = name => c.awards.filter(a => a.award === name).length;
    console.log(`${String(i + 1).padStart(3)} ${c.debut} ${c.me.pos} ${HL.fmtHeight(c.me.height)} prime ${c.primeOvr} peak ${peak} | ${c.seasons.length} yrs (${minors} minors), pick ${c.pick || "undrafted"} | best ${best ? best.ppg.toFixed(1) : '-'} ppg | MVP ${n('MVP')} AS ${n('All-Star')} rings ${c.rings} | ${c.altered.length} changes | legacy ${c.legacy.score} #${c.legacy.rank} -> ${tier}`);
  }
  console.log(`\n${runs} careers (${style}) in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  console.log(Object.entries(tiers).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(' | '));
})();
