const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { load } = require('./load');
const files = ['js/core/rng.js', 'data/names.js', 'data/injuries.js', 'data/nbaids.js', 'js/league/teams.js', 'js/league/ratings.js', 'js/league/player.js', 'js/league/gamesim.js', 'js/league/draft.js', 'js/league/history.js', 'js/media/engine.js', 'js/media/news.js', 'js/league/season.js', 'js/league/frontoffice.js', 'data/history/index.js', 'data/history/seasons/2025.js'];
if (fs.existsSync(__dirname + '/../js/league/world.js')) files.push('js/league/world.js');
const HL = load(files);
function fixture() {
  const L = HL.League.createFromSeason({ seasonKey: '2025', userAbbr: 'LAL', seed: 3, settings: { history: 'random', role: 'gm', salaryCap: 1000 } });
  const p = HL.FrontOffice.roster(L, L.userTeamId)[0];
  return { L, p };
}
function game(L, p, gid, minutes, pts = 12, won = true) {
  const opponent = L.teams.find(t => t.id !== p.teamId).id;
  const stat = { ...HL.blankStatLine(), min: minutes, pts, gp: 1 };
  const res = { home: { teamId: p.teamId, score: won ? 100 : 90, box: { [p.id]: stat } }, away: { teamId: opponent, score: won ? 90 : 100, box: {} } };
  HL.World.afterGame(L, { gid }, res); return res;
}

test('player meeting changes separate relationships and morale, saves a memory and prevents daily spam', () => {
  const { L, p } = fixture(), before = HL.World.relationship(L, p.id);
  assert.equal(L.world, undefined, 'inspection is read-only');
  const morale = p.morale;
  assert.equal(HL.World.meet(L, p.id, 'support').ok, true);
  const after = HL.World.relationship(L, p.id);
  assert.ok(after.like > before.like); assert.ok(after.trust > before.trust); assert.ok(p.morale > morale);
  assert.ok(after.memories[0].text.includes('support'));
  assert.equal(HL.World.meet(L, p.id, 'support').ok, false);
  const reloaded = JSON.parse(JSON.stringify(L)); HL.League.set(reloaded);
  assert.equal(HL.World.relationship(reloaded, p.id).trust, after.trust);
});

test('private conversations stay private; insulting a player creates a contextual public response', () => {
  const { L, p } = fixture(), stories = L.news.length;
  HL.World.meet(L, p.id, 'support'); assert.equal(L.news.length, stories);
  L.day++;
  HL.World.meet(L, p.id, 'dismiss');
  assert.ok(L.news.at(-1).body.includes(p.name));
  assert.ok(L.news.at(-1).reactions.some(r => r.voice.kind === 'player'));
});

test('minutes promises are judged from three real team games, including a DNP, not calendar days', () => {
  const { L, p } = fixture();
  HL.World.meet(L, p.id, 'promiseMinutes'); const trust = HL.World.relationship(L, p.id).trust;
  L.day += 20; assert.equal(HL.World.relationship(L, p.id).trust, trust);
  for (let i = 0; i < 3; i++) game(L, p, i, i === 2 ? 0 : 10);
  assert.ok(HL.World.relationship(L, p.id).trust < trust);
  assert.ok(L.news.at(-1).headline.includes('promise'));
  assert.equal(L.world.watches.filter(w => w.kind === 'minutesPromise' && w.resolved).length, 1);
  const count = L.news.length; game(L, p, 2, 40); assert.equal(L.news.length, count, 'same game is idempotent');
});

test('keeping a playing-time promise builds trust and an earned follow-up story', () => {
  const { L, p } = fixture(); HL.World.meet(L, p.id, 'promiseMinutes');
  const before = HL.World.relationship(L, p.id).trust;
  for (let i = 0; i < 3; i++) game(L, p, i, 30);
  assert.ok(HL.World.relationship(L, p.id).trust > before);
  assert.ok(L.news.at(-1).headline.includes('keeps'));
});

test('a signing creates player/fan/owner reactions and a performance-based delayed verdict', () => {
  const { L } = fixture();
  const p = HL.createPlayer({ name: 'Reaction Rookie', teamId: null, ovr: 60, age: 22, season: 2025 }); L.players[p.id] = p;
  const cut = HL.FrontOffice.roster(L, L.userTeamId).at(-1); assert.equal(HL.FrontOffice.waive(L, cut.id).ok, true);
  const q = HL.FrontOffice.quote(L, p.id); assert.equal(HL.FrontOffice.sign(L, p.id, q.ask, 1).ok, true);
  const reaction = L.news.at(-1);
  assert.ok(reaction.reactions.some(r => r.voice.kind === 'owner'));
  assert.ok(reaction.reactions.some(r => r.voice.kind === 'player'));
  assert.ok(HL.World.teamMood(L, L.userTeamId).memories.length > 0);
  for (let i = 0; i < 3; i++) game(L, p, i, 25, 28, true);
  assert.ok(L.news.at(-1).headline.includes(p.name)); assert.ok(L.news.at(-1).body.includes('28.0'));
  const resolved = L.world.watches.find(w => w.pid === p.id && w.kind === 'newArrival');
  assert.equal(resolved.resolved, true);
});

test('trading away a leader leaves memories in the remaining locker room', () => {
  const { L, p } = fixture(), peers = HL.FrontOffice.roster(L, p.teamId).filter(x => x !== p);
  p.ovr = 97;
  const before = peers[0].morale;
  const other = L.teams.find(t => t.id !== p.teamId);
  const incoming = HL.FrontOffice.roster(L, other.id)[0]; incoming.ovr = 60;
  assert.equal(HL.FrontOffice.trade(L, { teamId: other.id, send: [p.id], receive: [incoming.id] }).ok, true);
  assert.ok(peers[0].morale < before);
  assert.ok(HL.World.relationship(L, peers[0].id).memories.some(m => m.text.includes(p.name)));
});

test('promises cancel on a trade or retirement without falsely reporting a betrayal', () => {
  const { L, p } = fixture(); HL.World.meet(L, p.id, 'promiseMinutes');
  const trust = HL.World.relationship(L, p.id).trust;
  p.teamId = null; game(L, { ...p, teamId: L.userTeamId }, 1, 0);
  assert.ok(L.world.watches[0].resolved); assert.equal(HL.World.relationship(L, p.id).trust, trust);
});

test('invalid people/actions are rejected without changing the save', () => {
  const { L, p } = fixture(), before = JSON.stringify(L);
  assert.equal(HL.World.meet(L, p.id, 'invented').ok, false);
  assert.equal(HL.World.meet(L, 999999, 'support').ok, false);
  assert.equal(JSON.stringify(L), before);
});

test('morale changes actual performance while default morale preserves the existing seeded simulation', () => {
  const { L } = fixture();
  const H = { ...L.teams[0], players: HL.FrontOffice.roster(L, 0) }, A = { ...L.teams[1], players: HL.FrontOffice.roster(L, 1) };
  const rules = { ...L.rules, injuryMult: 0 };
  for (const p of H.players) p.morale = 70;
  HL.RNG.setSeed(44); const base = HL.simGame(H, A, rules);
  for (const p of H.players) delete p.morale;
  HL.RNG.setSeed(44); const legacy = HL.simGame(H, A, rules);
  assert.deepEqual(JSON.parse(JSON.stringify(base)), JSON.parse(JSON.stringify(legacy)));
  let high = 0, low = 0;
  for (let seed = 1; seed <= 40; seed++) {
    H.players.forEach(p => { p.morale = 100; }); HL.RNG.setSeed(seed); high += HL.simGame(H, A, rules).home.score;
    H.players.forEach(p => { p.morale = 10; }); HL.RNG.setSeed(seed); low += HL.simGame(H, A, rules).home.score;
  }
  assert.ok(high > low, 'morale should influence the actual team results, not just a UI meter');
});

test('relationship history changes willingness to renew a contract', () => {
  const { L, p } = fixture(); p.contract.exp = L.season;
  const old = HL.FrontOffice.quote(L, p.id, 'extension').ask;
  HL.World.meet(L, p.id, 'dismiss');
  assert.ok(HL.FrontOffice.quote(L, p.id, 'extension').ask > old);
});
