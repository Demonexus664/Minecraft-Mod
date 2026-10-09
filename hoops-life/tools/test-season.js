const { load } = require('./load');
const HL = load(['js/core/rng.js', 'data/names.js', 'data/injuries.js', 'data/nbaids.js', 'js/league/teams.js', 'js/league/ratings.js', 'js/league/player.js', 'data/rosters2025.js', 'js/league/gamesim.js', 'js/league/draft.js', 'js/media/engine.js', 'js/media/news.js', 'js/league/season.js']);
const seasons = +process.argv[2] || 1;
const t0 = Date.now();
const L = HL.League.create({ seed: 777 });
const missing = Object.values(L.players).filter(p => !p.nbaId).map(p => p.name);
console.log('players', Object.keys(L.players).length, 'missing nbaId:', missing.length, missing.slice(0, 20).join(', '));
for (let s = 0; s < seasons; s++) {
  let guard = 0;
  while (L.phase !== 'offseason' && guard++ < 400) HL.League.simDay();
  const st = HL.League.standings();
  const name = id => L.teams[id].abbr;
  const pn = id => id != null ? L.players[id].name : '-';
  const h = L.history[L.history.length - 1];
  console.log(`\n=== ${L.season} (${Date.now() - t0}ms) champion ${name(h.champion)} over ${name(h.runnerUp)} ${h.finalsScore}`);
  console.log('best:', st.slice(0, 5).map(t => `${t.abbr} ${t.w}-${t.l}`).join(', '), '| worst:', st.slice(-3).map(t => `${t.abbr} ${t.w}-${t.l}`).join(', '));
  const a = L.awards[L.season];
  console.log(`MVP ${pn(a.mvp)} | DPOY ${pn(a.dpoy)} | ROY ${pn(a.roy)} | 6MOY ${pn(a.smoy)} | FMVP ${pn(a.fmvp)}`);
  const leaders = Object.values(L.players).map(p => ({ p, s: HL.League.perGame(p, L.season) })).filter(x => x.s && x.s.gp >= 50).sort((x, y) => y.s.pts - x.s.pts).slice(0, 5);
  console.log('scoring:', leaders.map(x => `${x.p.name} ${x.s.pts.toFixed(1)}`).join(', '));
  HL.League.advanceToNextSeason();
  const rs = L.teams.map(t => HL.League.teamPlayers(t.id).length);
  console.log('rosters min/max', Math.min(...rs), Math.max(...rs), 'json size KB', (JSON.stringify(L).length / 1024).toFixed(0));
}
console.log('\nnews items:', L.news.length);
for (const n of L.news.slice(-25)) console.log(`[${n.type}] ${n.headline}` + (n.reactions ? '\n    ' + n.reactions.map(r => `${r.voice.handle}: ${r.text}`).join('\n    ') : ''));
