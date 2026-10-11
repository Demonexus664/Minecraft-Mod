// Run with: node --test tools/test-rules.js
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load } = require('./load');
const HL = load(['js/core/rng.js', 'data/names.js', 'data/injuries.js', 'data/nbaids.js', 'js/league/teams.js', 'js/league/ratings.js', 'js/league/player.js', 'js/league/gamesim.js', 'js/league/draft.js', 'js/league/history.js', 'js/league/events.js', 'js/media/engine.js', 'js/media/news.js', 'js/media/rules.js', 'js/league/season.js', 'data/history/index.js', 'data/history/seasons/2025.js']);
const league = () => HL.League.createFromSeason({ seasonKey: '2025', seed: 7, settings: { history: 'random' } });
const L = league();
const teams = L.teams.slice(0, 2).map(t => ({ ...t, players: HL.League.teamPlayers(t.id) }));
const clean = value => JSON.parse(JSON.stringify(value));
function batch(overrides, count = 80) {
  const games = [];
  for (let i = 1; i <= count; i++) {
    HL.RNG.setSeed(i * 997);
    games.push(HL.simGame(teams[0], teams[1], { ...HL.DEFAULT_RULES(), injuryMult: 0, ...overrides }, { pbp: true }));
  }
  return games;
}
const violations = (games, type) => games.flatMap(g => g.events.violations || []).filter(v => v.type === type);
const totals = (games, key) => games.reduce((n, g) => n + [g.home, g.away].reduce((s, side) => s + Object.values(side.box).reduce((v, b) => v + b[key], 0), 0), 0);

test('rule defaults follow the 2001 defense and 2018 rebound-clock changes', () => {
  assert.equal(HL.eraRules(2000).backcourtSeconds, 10);
  assert.equal(HL.eraRules(2000).illegalDefense, true);
  assert.equal(HL.eraRules(2000).defensiveThreeSeconds, false);
  assert.equal(HL.eraRules(2001).backcourtSeconds, 8);
  assert.equal(HL.eraRules(2001).illegalDefense, false);
  assert.equal(HL.eraRules(2001).defensiveThreeSeconds, true);
  assert.equal(HL.eraRules(2017).shotClockReset, 24);
  assert.equal(HL.eraRules(2018).shotClockReset, 14);
});

test('backcourt timing causes typed, dead-ball turnovers and can be disabled', () => {
  const on = batch({ backcourtSeconds: 8 });
  const ten = batch({ backcourtSeconds: 10 });
  const off = batch({ backcourtSeconds: 0 });
  const eightCalls = violations(on, 'backcourt');
  assert.ok(eightCalls.length > 0);
  assert.ok(eightCalls.length > violations(ten, 'backcourt').length);
  assert.equal(violations(off, 'backcourt').length, 0);
  assert.ok(eightCalls.every(v => v.turnover && v.seconds === 8));
  for (const game of on) for (const side of [game.home, game.away]) {
    const attributed = {};
    for (const v of game.events.violations.filter(v => v.teamId === side.teamId && v.turnover)) attributed[v.pid] = (attributed[v.pid] || 0) + 1;
    for (const [pid, count] of Object.entries(attributed)) assert.ok(side.box[pid].tov >= count, 'violations must charge the actual player turnovers');
  }
  assert.ok(on.some(g => g.pbp.some(p => /backcourt violation/i.test(p.txt))));
});

test('offensive three seconds records a turnover and stops when disabled', () => {
  const on = batch({ offensiveThreeSeconds: true });
  const off = batch({ offensiveThreeSeconds: false });
  assert.ok(violations(on, 'offensiveThreeSeconds').length > 0);
  assert.ok(violations(on, 'offensiveThreeSeconds').every(v => v.turnover));
  assert.equal(violations(off, 'offensiveThreeSeconds').length, 0);
});

test('defensive three seconds awards one technical free throw with retained possession', () => {
  const on = batch({ defensiveThreeSeconds: true });
  const off = batch({ defensiveThreeSeconds: false });
  const calls = violations(on, 'defensiveThreeSeconds');
  assert.ok(calls.length > 0);
  assert.ok(calls.every(v => v.freeThrows === 1 && v.retainedPossession && !v.personalFoul));
  for (const game of on) {
    for (const side of [game.home, game.away]) assert.equal(side.score, Object.values(side.box).reduce((n, b) => n + b.pts, 0));
    for (const v of game.events.violations.filter(v => v.type === 'defensiveThreeSeconds')) {
      const offense = v.teamId === game.home.teamId ? game.away : game.home;
      assert.ok(offense.box[v.shooterId].fta >= 1);
      assert.ok(offense.box[v.shooterId].ftm >= v.made);
    }
  }
  assert.equal(violations(off, 'defensiveThreeSeconds').length, 0);
  assert.equal(violations(batch({ defensiveThreeSeconds: true, noFouls: true }), 'defensiveThreeSeconds').length, 0);
});

test('illegal defense forces a zone game plan to man defense', () => {
  teams[1].strategy = { ...HL.DEFAULT_STRATEGY(), defense: 'zone' };
  HL.RNG.setSeed(41);
  const banned = HL.simGame(teams[0], teams[1], { ...HL.DEFAULT_RULES(), illegalDefense: true });
  assert.equal(banned.events.strategyAdjustments[0].teamId, teams[1].id);
  assert.equal(banned.events.strategyAdjustments[0].to, 'man');
  teams[1].strategy.defense = 'man';
  HL.RNG.setSeed(41);
  const man = HL.simGame(teams[0], teams[1], { ...HL.DEFAULT_RULES(), illegalDefense: true });
  assert.deepEqual(clean(banned.away), clean(man.away));
  teams[1].strategy.defense = 'zone';
  const allowed = HL.simGame(teams[0], teams[1], { ...HL.DEFAULT_RULES(), illegalDefense: false });
  assert.equal(allowed.events.strategyAdjustments.length, 0);
  teams[1].strategy = HL.DEFAULT_STRATEGY();
});

test('short rebound resets speed up second-chance possessions', () => {
  const short = batch({ shotClockReset: 5 });
  const full = batch({ shotClockReset: 24 });
  assert.ok(totals(short, 'fga') > totals(full, 'fga'));
  const resets = short.flatMap(g => g.events.clockResets || []);
  assert.ok(resets.length > 0);
  assert.ok(resets.every(r => r.seconds === 5 && r.duration <= 5));
});

test('a rebound at the horn cannot shorten the next period opening possession', () => {
  const game = batch({}, 40).find(g=>g.pbp.some(p=>p.q===2&&p.t==='0:00'&&p.txt.startsWith('Offensive rebound')));
  assert.ok(game,'seed sample contains an actual offensive rebound at the second-quarter horn');
  assert.ok(game.pbp.some(p => p.q === 2 && p.t === '0:00' && p.txt.startsWith('Offensive rebound')),
    'fixture includes a rebound at the second-quarter horn');
  for (let q = 1; q <= game.events.periods; q++) {
    const rebounds = game.pbp.filter(p => p.q === q && p.txt.startsWith('Offensive rebound')).length;
    const resets = game.events.clockResets.filter(r => r.period === q).length;
    assert.ok(resets <= rebounds, `period ${q} has a reset without a rebound in that period`);
  }
});

test('bonus threshold changes free throws; disabling the bonus and fouls works', () => {
  const quick = batch({ bonusFouls: 1 });
  const off = batch({ bonusFouls: 0 });
  assert.ok(totals(quick, 'fta') > totals(off, 'fta'));
  assert.equal(batch({ noFouls: true }).flatMap(g => g.events.bonusTrips || []).length, 0);
  assert.equal(off.flatMap(g => g.events.bonusTrips || []).length, 0);
  assert.ok(quick.flatMap(g => g.events.bonusTrips || []).length > 0);
});

test('older saves acquire era defaults while explicit rules and history survive JSON reload', () => {
  const old = league();
  delete old.rules.backcourtSeconds;
  delete old.rules.shotClockReset;
  old.rules.bonusFouls = 0;
  old.rules.shotClockReset = 9;
  HL.League.set(clean(old));
  assert.equal(HL.League.get().rules.backcourtSeconds, 8);
  assert.equal(HL.League.get().rules.shotClockReset, 9);
  assert.equal(HL.League.get().rules.bonusFouls, 0);
  const current = HL.League.get();
  current.phase = 'offseason';
  HL.League.advanceToNextSeason();
  assert.equal(current.rules.shotClockReset, 9);
  assert.equal(current.rules.bonusFouls, 0);
});

test('every new rule change publishes media, actual player and owner reactions with history', () => {
  const current = league();
  current.day = 10;
  for (const [key, value] of Object.entries({ backcourtSeconds: 10, offensiveThreeSeconds: false, defensiveThreeSeconds: false, illegalDefense: true, shotClockReset: 24, bonusFouls: 0 })) {
    const old = current.rules[key];
    current.rules[key] = value;
    const story = HL.RuleReactions.react(current, key, value, old);
    assert.ok(story, key);
    assert.ok(story.reactions.some(r => r.voice.kind === 'player'), key);
    assert.ok(story.reactions.some(r => r.voice.kind === 'owner'), key);
    assert.ok(story.reactions.some(r => r.voice.kind !== 'player' && r.voice.kind !== 'owner'), key);
    assert.ok(current.players[story.playerIds[0]], key);
    assert.ok(story.reactions.every(r => !/\{\w+\}/.test(r.text)), key);
  }
  assert.equal(clean(current).ruleHistory.length, 6);
  const count = current.ruleHistory.length;
  assert.equal(HL.RuleReactions.react(current, 'backcourtSeconds', 10, 10), null);
  assert.equal(current.ruleHistory.length, count);
});

test('an explicit defense choice survives when the historical default changes', () => {
  const current = league();
  current.season = 2000;
  current.rules = HL.eraRules(2000);
  current.ruleHistory = [{ season: 2000, day: 1, key: 'illegalDefense', from: false, to: true }];
  current.phase = 'offseason';
  HL.League.advanceToNextSeason();
  assert.equal(current.season, 2001);
  assert.equal(current.rules.illegalDefense, true);
  assert.equal(current.rules.defensiveThreeSeconds, true);
});

test('zero injury frequency is honored under full-contact defense', () => {
  assert.equal(batch({ injuryMult: 0, tackling: true }).flatMap(g => g.injuries).length, 0);
});
