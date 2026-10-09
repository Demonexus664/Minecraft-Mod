// Content-pack audit: plays a real season (regular season, playoffs, offseason) with every pack loaded,
// records each media situation the game actually emits and the facts it provides, then reports
// how many pack lines can render for it, lines that need facts the game never supplies, and
// unknown {~fragment} pools. Usage: node tools/check-packs.js [season]
const { load, ctx } = require('./load');
const fs = require('fs');
const path = require('path');
const key = process.argv[2] || '2025';
const packs = fs.readdirSync(path.join(__dirname, '../packs')).filter(f => /^media-pack-\d+\.js$/.test(f)).sort((a, b) => parseInt(a.match(/\d+/)) - parseInt(b.match(/\d+/))).map(f => 'packs/' + f);
const HL = load(['js/core/rng.js', 'data/names.js', 'data/injuries.js', 'data/nbaids.js', 'js/league/teams.js', 'js/league/ratings.js', 'js/league/player.js', 'js/league/gamesim.js', 'js/league/draft.js', 'js/league/history.js', 'js/media/engine.js', 'js/media/news.js', 'js/media/rules.js', 'js/league/season.js', 'data/history/index.js', `data/history/seasons/${key}.js`, `data/history/seasons/${+key + 1}.js`].filter(f => fs.existsSync(path.join(__dirname, '..', f))).concat(packs));
const M = HL.Media;
M.mergePacks();

// Every line in every pack, by situation.
const LINES = {};
for (const pk of ctx.HL_PACKS || []) for (const [k, arr] of Object.entries(pk.lines || {})) (LINES[k] = LINES[k] || []).push(...arr);
const pools = new Set(Object.keys(M.P));
const badPools = {};
for (const [k, arr] of Object.entries(LINES)) for (const t of arr) for (const m of t.matchAll(/\{~(\w+)\}/g)) if (!pools.has(m[1])) (badPools[m[1]] = badPools[m[1]] || new Set()).add(k);

// Record what the game emits.
const seen = {};
const orig = M.line;
M.line = function (L, situation, c, builtins) {
  const s = seen[situation] = seen[situation] || { calls: 0, keys: new Set(), eras: new Set(), rendered: 0 };
  s.calls++; s.eras.add(c.era || 'modern');
  for (const k in c) if (c[k] != null) s.keys.add(k);
  const out = orig.call(this, L, situation, c, builtins);
  if (out) s.rendered++;
  if (out && /\{~?\w+\}/.test(out)) console.log('UNFILLED', situation, '->', out);
  return out;
};
const L = HL.League.createFromSeason({ seasonKey: key, seed: 11 });
L.userTeamId = 1;
const t0 = Date.now();
let guard = 0;
while (L.phase !== 'offseason' && guard++ < 2000) HL.League.simDay();
try { HL.League.advanceToNextSeason(); } catch (e) { console.log('advance:', e.message); }
console.log(`season ${key} played in ${((Date.now() - t0) / 1000).toFixed(1)}s, phase ${L.phase}`);

console.log('\nSituation                         calls  pack lines  fillable  missing facts');
for (const [sit, s] of Object.entries(seen).sort()) {
  const arr = LINES[sit] || [];
  const need = t => [...t.matchAll(/\{(\w+)\}/g)].map(m => m[1]);
  const fill = arr.filter(t => need(t).every(k => s.keys.has(k)));
  const missing = new Set(); arr.forEach(t => need(t).forEach(k => { if (!s.keys.has(k)) missing.add(k); }));
  console.log(`${sit.padEnd(34)}${String(s.calls).padStart(5)}  ${String(arr.length).padStart(10)}  ${String(fill.length).padStart(8)}  ${[...missing].join(', ')}`);
}
const unused = Object.keys(LINES).filter(k => !seen[k.split('@')[0]]);
console.log(`\n${Object.keys(LINES).length} pack situations, ${Object.values(LINES).reduce((a, b) => a + b.length, 0)} lines; ${unused.length} situations not emitted by this run (proposed features, other phases, or other modes).`);
if (Object.keys(badPools).length) console.log('Unknown fragment pools:', Object.entries(badPools).map(([p, ks]) => `${p} (${[...ks].slice(0, 3).join(', ')})`).join('; '));
if (process.argv.includes('--unused')) console.log(unused.join('\n'));
