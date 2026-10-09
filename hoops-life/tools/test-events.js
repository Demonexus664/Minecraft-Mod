// Event log + record book checks: triggers, near misses, record books by start year, persistence,
// and a full season with stories. Usage: node tools/test-events.js
const { load, ctx } = require('./load');
const fs = require('fs');
const path = require('path');
const packs = fs.readdirSync(path.join(__dirname, '../packs')).filter(f => /^media-pack-\d+\.js$/.test(f)).map(f => 'packs/' + f);
const HL = load(['js/core/rng.js', 'data/names.js', 'data/injuries.js', 'data/nbaids.js', 'js/league/teams.js', 'js/league/ratings.js', 'js/league/player.js', 'js/league/gamesim.js', 'js/league/draft.js', 'js/league/history.js', 'js/league/events.js', 'js/media/engine.js', 'js/media/news.js', 'js/media/eventnews.js', 'js/league/season.js', 'data/history/index.js', 'data/history/seasons/2025.js', 'data/history/seasons/1961.js', 'data/history/seasons/1985.js', ...packs]);
let fail = 0;
const ok = (cond, msg) => { console.log(`${cond ? 'PASS' : 'FAIL'}  ${msg}`); if (!cond) fail++; };

// ---------- unit checks on synthetic games ----------
function league(key) { return HL.League.createFromSeason({ seasonKey: key, seed: 4 }); }
let L = league('2025');
const [t0, t1] = [L.teams[0], L.teams[1]];
const p0 = HL.League.teamPlayers(t0.id)[0], p1 = HL.League.teamPlayers(t1.id)[0];
const line = (o) => Object.assign(HL.blankStatLine(), { gp: 1, min: 34, pts: 12, fgm: 5, fga: 11, orb: 1, drb: 4, ast: 3, stl: 1, blk: 0, tov: 2 }, o);
function game({ home = {}, away = {}, hs = 110, as = 100, events = {}, ot = 0 } = {}) {
  return {
    home: { teamId: t0.id, score: hs, box: { [p0.id]: line(home) } },
    away: { teamId: t1.id, score: as, box: { [p1.id]: line(away) } },
    ot, injuries: [],
    events: Object.assign({ four: [], goAhead: null, periods: 4 + ot, qfg: { home: [9, 9, 9, 9], away: [9, 9, 9, 9] }, trail: { home: 0, away: 0 }, charges: {} }, events),
  };
}
const keys = (res, playoffs = false) => HL.Events.fromGame(L, { gid: 'T' + Math.random() }, res, playoffs).map(e => e.key);
ok(keys(game({ home: { pts: 20, orb: 2, drb: 4, ast: 5, stl: 5, blk: 5 } })).includes('record.five_by_five'), '5x5 triggers at 5/6/5/5/5');
ok(!keys(game({ home: { pts: 20, orb: 2, drb: 4, ast: 5, stl: 5, blk: 4 } })).includes('record.five_by_five'), '5x5 near miss (4 blocks) does not trigger');
ok(keys(game({ home: { pts: 22, orb: 3, drb: 8, ast: 10, stl: 10, blk: 2 } })).includes('record.quadruple_double'), 'quadruple-double triggers');
ok(!keys(game({ home: { pts: 22, orb: 3, drb: 8, ast: 10, stl: 9, blk: 2 } })).includes('record.quadruple_double'), 'quadruple-double near miss does not trigger');
ok(keys(game({ home: { fgm: 10, fga: 10, pts: 22 } })).includes('record.perfect_high_volume'), 'perfect 10-for-10 triggers');
ok(!keys(game({ home: { fgm: 9, fga: 9, pts: 20 } })).includes('record.perfect_high_volume'), 'perfect 9-for-9 does not');
ok(keys(game({ home: { ast: 20, tov: 0 } })).includes('record.assist_turnover_clean'), '20 assists, 0 turnovers triggers');
ok(!keys(game({ home: { ast: 20, tov: 1 } })).includes('record.assist_turnover_clean'), '20 assists, 1 turnover does not');
ok(keys(game({ home: { tov: 0 } })).includes('record.team_zero_turnovers'), 'team with zero turnovers triggers');
const book = HL.Events.recordBook(L);
ok(book.league.pts.v === 100 && book.league.pts.name === 'Wilt Chamberlain', '2025 save: points record is Wilt 100');
ok(book.league.tpm.v === 14 && book.league.ast.v === 30, '2025 save: Klay 14 threes, Skiles 30 assists');
ok(keys(game({ home: { pts: 100 } })).includes('record.single_game_tie'), '100 points ties the record');
ok(!keys(game({ home: { pts: 99 } })).some(k => k.startsWith('record.single')), '99 points is not a record');
ok(keys(game({ home: { pts: 101 } })).includes('record.single_game') && HL.Events.recordBook(L).league.pts.v === 101, '101 points breaks it and updates the book');
ok(keys(game({ home: { pts: 101 } }), true).every(k => !k.startsWith('record.single')), 'playoff games do not count for regular-season records');
ok(keys(game({ hs: 101, as: 100, events: { goAhead: { side: 'home', pid: p0.id, label: 'three', value: 3, period: 4, clock: 0.4, before: -2, after: 1 } } })).includes('game.buzzer_beater'), 'go-ahead three at 0.4s in the 4th is a buzzer-beater');
ok(keys(game({ hs: 101, as: 100, events: { goAhead: { side: 'home', pid: p0.id, label: 'layup', value: 2, period: 4, clock: 3.2, before: -1, after: 1 } } })).includes('game.game_winner'), 'go-ahead at 3.2s is a game-winner');
ok(!keys(game({ hs: 101, as: 100, events: { goAhead: { side: 'home', pid: p0.id, label: 'layup', value: 2, period: 4, clock: 7, before: -1, after: 1 } } })).some(k => k.startsWith('game.')), 'go-ahead at 7s is neither');
ok(!keys(game({ hs: 101, as: 100, events: { goAhead: { side: 'home', pid: p0.id, label: 'layup', value: 2, period: 3, clock: 0.5, before: -1, after: 1 } } })).some(k => k.startsWith('game.')), 'go-ahead at the end of the 3rd is not a game-winner');
ok(keys(game({ events: { trail: { home: 20, away: 0 } } })).includes('game.comeback'), '20-point comeback triggers');
ok(!keys(game({ events: { trail: { home: 19, away: 0 } } })).includes('game.comeback'), '19-point comeback does not');
ok(!keys(game({ events: { trail: { home: 0, away: 25 } } })).includes('game.comeback'), 'the loser trailing by 25 is not a comeback');
ok(keys(game({ events: { four: [{ pid: p0.id, side: 'home', period: 2, total: 4 }] } })).includes('court.four_point_play'), 'four-point play logged');
ok(keys(game({ events: { charges: { [p1.id]: 3 } } })).includes('court.charge_triple'), 'three charges logged');
ok(!keys(game({ events: { charges: { [p1.id]: 2 } } })).includes('court.charge_triple'), 'two charges not logged');
ok(keys(game({ events: { qfg: { home: [9, 9, 9, 9], away: [9, 0, 9, 9] } } })).includes('court.no_field_goals_quarter'), 'quarter without an opponent field goal');

// ---------- record books for historical starts ----------
L = league('1961');
let b = HL.Events.recordBook(L).league;
ok(b.pts.v === 71 && b.pts.name === 'Elgin Baylor', '1961-62 save: points record is Baylor 71 (Wilt has not scored 100 yet)');
ok(b.reb.v === 55 && !b.tpm, '1961-62 save: Wilt 55 rebounds; no three-point record');
L = league('1985');
b = HL.Events.recordBook(L).league;
ok(b.ast.v === 29 && b.ast.name === 'Kevin Porter', '1985-86 save: assists record is Kevin Porter 29');
ok(b.tpm === null, '1985-86 save: three-point record unknown, so none is announced');

// ---------- full season, stories, persistence ----------
L = league('2025');
L.userTeamId = 5;
const t = Date.now();
while (L.phase !== 'offseason') HL.League.simDay();
const byKey = {};
for (const e of L.events) byKey[e.key] = (byKey[e.key] || 0) + 1;
console.log(`\nfull season + playoffs in ${((Date.now() - t) / 1000).toFixed(1)}s:`, JSON.stringify(byKey));
const stories = L.news.filter(n => n.type === 'event');
ok(stories.length > 0, `${stories.length} event stories published`);
ok(stories.every(n => !/\{~?\w+\}/.test(n.headline) && n.reactions.every(r => !/\{~?\w+\}/.test(r.text))), 'no unfilled placeholders in event stories');
const seen = new Set();
for (const n of stories) if (!seen.has(n.key)) { seen.add(n.key); console.log(`  ${n.key}: ${n.headline}${n.reactions[0] ? `  |  ${n.reactions[0].voice.outlet}: ${n.reactions[0].text}` : ''}`); }
const copy = JSON.parse(JSON.stringify(L));
ok(copy.events.length === L.events.length && copy.records.league.pts.v === L.records.league.pts.v && copy.eventSeq === L.eventSeq, 'events and record book survive save/load');
const ev0 = copy.events.find(e => e.players.length);
ok(ev0 && ev0.snap.players[ev0.players[0]].name, 'events keep a snapshot of who was involved');
console.log(fail ? `\n${fail} FAILED` : '\nall passed');
process.exit(fail ? 1 : 0);
