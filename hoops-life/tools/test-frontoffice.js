const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { load } = require('./load');
const files = ['js/core/rng.js', 'data/names.js', 'data/injuries.js', 'data/nbaids.js', 'js/league/teams.js', 'js/league/ratings.js', 'js/league/player.js', 'js/league/gamesim.js', 'js/league/draft.js', 'js/league/history.js', 'js/media/engine.js', 'js/media/news.js', 'js/league/season.js', 'data/history/index.js', 'data/history/seasons/2025.js', 'data/history/seasons/1990.js', 'data/history/seasons/1991.js'];
if (fs.existsSync(__dirname + '/../js/league/frontoffice.js')) files.push('js/league/frontoffice.js');
const HL = load(files);
const F = () => HL.FrontOffice;
const copy = v => JSON.parse(JSON.stringify(v));
function fixture() {
  const L = HL.League.createFromSeason({ seasonKey: '2025', seed: 4, settings: { history: 'random', role: 'gm', salaryCap: 100 } });
  L.userTeamId = 0; L.players = {}; L.news = [];
  for (const tid of [0, 1]) for (let i = 0; i < 8; i++) {
    const p = HL.createPlayer({ name: `Team ${tid} Player ${i}`, pos: HL.POSITIONS[i % 5], ovr: 75, age: 27, teamId: tid, season: 2025 });
    p.ovr = 75; p.potential = 80; p.contract = { amount: 6, exp: 2027 }; p.injury = null;
    L.players[p.id] = p;
  }
  const p = HL.createPlayer({ name: 'Free Agent', pos: 'PG', ovr: 73, age: 28, teamId: null, season: 2025 });
  p.contract = { amount: 4, exp: 2024 }; p.ovr = 73; L.players[p.id] = p;
  L.teams = L.teams.slice(0, 2); L.nextPid = HL.nextPlayerId();
  return L;
}
const roster = (L, tid) => Object.values(L.players).filter(p => p.teamId === tid && !p.retired);
const proposal = L => ({ teamId: 1, send: [roster(L, 0)[0].id], receive: [roster(L, 1)[0].id] });

test('trade preview is read-only and deterministic; fair trade transfers players including team zero', () => {
  const L = fixture(), deal = proposal(L), before = JSON.stringify(L), seed = HL.RNG.getSeed();
  const preview = F().tradePreview(L, deal);
  assert.equal(preview.ok, true); assert.equal(preview.accepted, true);
  assert.equal(JSON.stringify(L), before); assert.equal(HL.RNG.getSeed(), seed);
  assert.deepEqual(copy(F().tradePreview(L, deal)), copy(preview));
  L.teams[0].strategy = { ...HL.DEFAULT_STRATEGY(), starters: roster(L, 0).slice(0, 5).map(p => p.id), minutes: { [deal.send[0]]: 36 } };
  assert.equal(F().trade(L, deal).ok, true);
  assert.equal(L.players[deal.send[0]].teamId, 1); assert.equal(L.players[deal.receive[0]].teamId, 0);
  assert.equal(L.teams[0].strategy.starters, null); assert.equal(L.teams[0].strategy.minutes, null);
  assert.equal(L.transactions.length, 1); assert.equal(L.news.at(-1).type, 'transaction');
  assert.ok(L.news.at(-1).reactions.length >= 2);
  const after = JSON.stringify(L);
  assert.equal(F().trade(L, deal).ok, false); assert.equal(JSON.stringify(L), after);
});

test('AI refuses scraps for a prime superstar without a random accept reroll', () => {
  const L = fixture(), deal = proposal(L);
  L.players[deal.send[0]].ovr = 60; L.players[deal.receive[0]].ovr = 97;
  L.players[deal.receive[0]].potential = 99;
  for (let i = 0; i < 5; i++) assert.equal(F().trade(L, deal).ok, false);
  assert.equal(L.transactions.length, 0); assert.ok(F().tradePreview(L, deal).response.length);
});

test('an equal replacement at the same position is valued after the outgoing player leaves', () => {
  const L = fixture(), d = proposal(L);
  L.players[d.send[0]].pos = 'PG'; L.players[d.receive[0]].pos = 'PG';
  roster(L, 1).filter(p => p.id !== d.receive[0]).forEach(p => { p.pos = 'SF'; });
  assert.equal(F().tradePreview(L, d).accepted, true);
});

test('invalid trade inputs and coach or other-team authority leave state unchanged', () => {
  const L = fixture(), deal = proposal(L);
  for (const invalid of [{ ...deal, send: [...deal.send, ...deal.send] }, { ...deal, receive: [999999] }, { ...deal, teamId: 0 }, { ...deal, send: [] }, { ...deal, send: [deal.receive[0]] }, { ...deal, receive: [String(deal.receive[0])] }]) {
    const before = JSON.stringify(L); assert.equal(F().trade(L, invalid).ok, false); assert.equal(JSON.stringify(L), before);
  }
  L.settings.role = 'coach'; assert.equal(F().trade(L, deal).ok, false);
});

test('salary matching blocks a trade until incoming money fits room or matching allowance', () => {
  const L = fixture(), deal = proposal(L); L.settings.salaryCap = 1;
  L.players[deal.receive[0]].contract.amount = 20;
  assert.equal(F().tradePreview(L, deal).ok, false);
  L.settings.salaryCap = 100; assert.equal(F().tradePreview(L, deal).ok, true);
});

test('deadline and playoffs close trades; offseason reopens the desk', () => {
  const L = fixture(), deal = proposal(L);
  L.day = F().tradeDeadline(L) + 1; assert.equal(F().trade(L, deal).ok, false);
  L.phase = 'playoffs'; assert.equal(F().trade(L, deal).ok, false);
  L.phase = 'offseason'; assert.equal(F().tradePreview(L, deal).ok, true);
});

test('trades and waivers cannot leave fewer than five healthy bodies', () => {
  const L = fixture(), deal = proposal(L);
  roster(L, 1).slice(3).forEach(p => { p.injury = { games: 10 }; });
  assert.equal(F().trade(L, deal).ok, false);
  roster(L, 0).slice(5).forEach(p => { p.injury = { games: 10 }; });
  assert.equal(F().waive(L, roster(L, 0)[0].id).ok, false);
});

test('Trade Finder returns legal accepted proposals without changing RNG or league', () => {
  const L = fixture(), ids = proposal(L).send, before = JSON.stringify(L), seed = HL.RNG.getSeed();
  const offers = F().findTrades(L, ids);
  assert.ok(offers.length > 0);
  for (const d of offers) assert.equal(F().tradePreview(L, d).accepted, true);
  assert.equal(JSON.stringify(L), before); assert.equal(HL.RNG.getSeed(), seed);
});

test('negotiating a signing fails below the ask and succeeds once, changing the actual roster', () => {
  const L = fixture(), p = Object.values(L.players).find(p => p.teamId == null), q = F().quote(L, p.id);
  const before = JSON.stringify(L);
  assert.equal(F().sign(L, p.id, q.ask / 2, 2).ok, false); assert.equal(JSON.stringify(L), before);
  const result = F().sign(L, p.id, q.ask, 2);
  assert.equal(result.ok, true); assert.equal(p.teamId, 0); assert.equal(p.contract.exp, 2026);
  assert.equal(p.contract.amount, q.ask); assert.equal(L.transactions.at(-1).kind, 'signing');
  assert.equal(F().sign(L, p.id, q.ask, 2).ok, false);
});

test('invalid signing numbers, terms, role and retired assets never mutate state', () => {
  const L = fixture(), p = Object.values(L.players).find(p => p.teamId == null);
  for (const [amount, years] of [[NaN, 1], [Infinity, 1], [-1, 2], [0, 1], [10, 0], [10, 5], [10, 1.5], ['10', 1]]) {
    const before = JSON.stringify(L); assert.equal(F().sign(L, p.id, amount, years).ok, false); assert.equal(JSON.stringify(L), before);
  }
  L.settings.role = 'coach'; assert.equal(F().sign(L, p.id, 10, 2).ok, false);
  L.settings.role = 'gm'; p.retired = 2024; assert.equal(F().sign(L, p.id, 10, 2).ok, false);
});

test('over-cap teams can offer the minimum, not a larger unbudgeted salary; full rosters cannot sign', () => {
  const L = fixture(), p = Object.values(L.players).find(p => p.teamId == null);
  L.settings.salaryCap = 1;
  assert.equal(F().sign(L, p.id, 20, 2).ok, false);
  p.ovr = 50; assert.equal(F().sign(L, p.id, F().quote(L, p.id).minimum, 1).ok, true);
  const L2 = fixture(), fa = Object.values(L2.players).find(p => p.teamId == null);
  while (roster(L2, 0).length < 15) {
    const extra = HL.createPlayer({ teamId: 0, ovr: 50, season: 2025 }); L2.players[extra.id] = extra;
  }
  assert.equal(F().sign(L2, fa.id, 10, 1).ok, false);
});

test('offseason one-year deal starts next season and survives rollover', () => {
  const L = fixture(); L.phase = 'offseason';
  const p = Object.values(L.players).find(p => p.teamId == null), q = F().quote(L, p.id);
  assert.equal(F().sign(L, p.id, q.ask, 1).ok, true); assert.equal(p.contract.exp, 2026);
  HL.League.advanceToNextSeason();
  assert.equal(p.teamId, 0); assert.equal(p.contract.exp, 2026); assert.equal(p.contract.amount, q.ask);
});

test('an extension changes future commitments, not current salary; activation honors its years', () => {
  const L = fixture(), p = roster(L, 0)[0]; p.contract.exp = 2025;
  const q = F().quote(L, p.id, 'extension');
  assert.equal(F().extend(L, p.id, q.ask, 2).ok, true);
  assert.equal(p.contract.amount, 6); assert.equal(p.extension.start, 2026); assert.equal(p.extension.exp, 2027);
  assert.ok(F().finances(L, 0, 2026).payroll >= q.ask);
  L.phase = 'offseason'; HL.League.advanceToNextSeason();
  assert.equal(p.teamId, 0); assert.equal(p.contract.amount, q.ask); assert.equal(p.contract.exp, 2027);
  assert.equal(p.extension, null);
});

test('waiving guaranteed salary retains dead money, including negotiated future terms', () => {
  const L = fixture(), p = roster(L, 0)[0], before = F().finances(L, 0).payroll;
  p.extension = { amount: 10, start: 2028, exp: 2029 };
  assert.equal(F().waive(L, p.id).ok, true); assert.equal(p.teamId, null); assert.equal(p.extension, null);
  assert.equal(F().finances(L, 0).payroll, before); assert.equal(F().finances(L, 0).dead, 6);
  assert.equal(F().finances(L, 0, 2029).dead, 10);
  F().rollover(L, 2029, 2030); assert.equal(F().finances(L, 0, 2030).dead, 0);
});

test('JSON reload preserves decisions; negotiated players survive real-history roster transitions', () => {
  const L = HL.League.createFromSeason({ seasonKey: '1990', userAbbr: 'CHI', seed: 8, settings: { role: 'gm', history: 'real' } });
  const p = roster(L, L.userTeamId).find(p => p.name === 'Michael Jordan');
  p.contract.exp = 1990;
  const q = F().quote(L, p.id, 'extension'); assert.equal(F().extend(L, p.id, q.ask, 2).ok, true);
  const reloaded = copy(L); HL.League.set(reloaded); reloaded.phase = 'offseason';
  HL.League.advanceToNextSeason();
  const after = reloaded.players[p.id]; assert.equal(after.teamId, reloaded.userTeamId); assert.equal(after.contract.exp, 1992);
  assert.equal(reloaded.transactions[0].kind, 'extension');
});

test('historical finance policy has no pre-cap restriction and scales minimum salaries', () => {
  const L = fixture(); L.season = 1964; delete L.settings.salaryCap;
  assert.equal(F().finances(L, 0).cap, null);
  const p = Object.values(L.players).find(p => p.teamId == null);
  assert.ok(F().quote(L, p.id).minimum < 0.01);
});

test('temporary hardship signings cannot be traded or extended into deals that cleanup would erase', () => {
  const L = fixture(), deal = proposal(L), p = L.players[deal.send[0]];
  p.hardship = true; p.contract.exp = L.season;
  const before = JSON.stringify(L);
  assert.equal(F().quote(L, p.id, 'extension').ok, false);
  assert.equal(F().extend(L, p.id, 20, 3).ok, false);
  assert.equal(F().tradePreview(L, deal).ok, false);
  assert.equal(F().trade(L, deal).ok, false);
  assert.equal(JSON.stringify(L), before);
  p.hardship = false; L.players[deal.receive[0]].hardship = true;
  assert.equal(F().tradePreview(L, deal).ok, false, 'Receiving another team’s temporary player is also invalid');
});
