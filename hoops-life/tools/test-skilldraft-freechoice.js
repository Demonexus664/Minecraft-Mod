// Isolated mode flow tests; run from hoops-life with:
// node --test tools/test-skilldraft-freechoice.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../js/modes/skilldraft.js'), 'utf8');
const originalReturn = 'return { open: () => { st = null; cache = null; render(); }';
assert.ok(source.includes(originalReturn), 'Skill Draft module return must be present');
// Test-only access to private state; production bundle is never modified.
const instrumented = source.replace(originalReturn,
  'return { __test: { newRun, spin, spinFree, freeRosterCandidates, chooseFreePlayer, finishPick, state: () => st }, open: () => { st = null; cache = null; render(); }');

function fixture(year, pid, clubGames, overall, scores) {
  return {
    pid, stints: [['GSW', clubGames]], g: 70, mpg: 30, seasonStart: year,
    pos: pid === 'alpha' ? 'PG' : 'SG', ovr: overall, pts: 20, trb: 4, ast: 7, scores
  };
}

function harness() {
  const alpha10 = fixture(2010, 'alpha', 60, 89, { three: 81, inside: 97 });
  const alpha11 = fixture(2011, 'alpha', 65, 92, { three: 99, inside: 86 });
  const beta11 = fixture(2011, 'beta', 59, 85, { three: 91, inside: 65 });
  const cameo11 = fixture(2011, 'cameo', 1, 68, { three: 39, inside: 43 });
  const seasons = { 2010: [alpha10], 2011: [alpha11, beta11, cameo11] };
  const app = {
    innerHTML: '',
    querySelector: q => q === '[data-home]' ? {} : null,
    querySelectorAll: () => []
  };
  const HL = {
    LATEST_SEASON: 2025, fmtHeight: n => String(n),
    RNG: { pick: arr => arr.includes(2010) ? 2010 : arr[0], int: () => 2010 },
    TEAMS: [{ abbr: 'GSW', city: 'Golden State', name: 'Warriors' }],
    HISTORY: {
      seasons: ['2010', '2011'],
      players: {
        alpha: ['Alpha Player', '1', null, 75, 180],
        beta: ['Beta Player', '2', null, 77, 190],
        cameo: ['Cameo Player', '3', null, 81, 205]
      }
    },
    HISTORY_SEASONS: { 2010: {}, 2011: {} },
    History: { seasonRows: key => seasons[key] },
    Challenge: {
      LINEAGE: { GSW: 'GSW' },
      loadDecade: async () => {},
      franchisesIn: () => ['GSW'],
      dealSkillHand: () => [{ row: alpha11, season: 2011, club: 'GSW' }],
      skillValue: (candidate, cat) => candidate.row.scores[cat[0]] ?? 70
    },
    historicalSeasonOvr: row => row.ovr,
    UI: {
      esc: value => String(value), app: () => app, applyTeamTheme() {}, setEra() {},
      logo: () => 'LOGO', teamAccent: () => ({ c: '#777' }), rating: n => String(n),
      toast() {}, seg: () => ''
    },
    DNA: { STARS: {}, analyze: () => ({ mutations: [], pairs: [], trios: [], signatures: [], active: [] }),
      board: () => '', preview: () => null },
    Legends: { wildcard: async () => null },
    Cards: { card: options => '<div class="gcard" ' + (options.attrs || '') + '>' + options.name + '</div>' },
    FX: {
      soundToggle: () => '', bindSound() {}, tilt() {}, reels: async () => {}, flipIn: async () => {},
      tierOf: () => ({ key: 'gold', colors: ['#aaa'] }),
      tierIndex: () => 2, sfx: { pop() {} }, burst() {}
    }
  };
  const ctx = { HL, window: { HL }, document: { querySelector: () => null, querySelectorAll: () => [] },
    console, setTimeout, clearTimeout };
  vm.runInNewContext(instrumented, ctx, { filename: 'skilldraft.js' });
  return { t: HL.SkillDraft.__test, api: HL.SkillDraft, app };
}

test('free choice spins two reels and lists every recorded franchise player, not five top specialists', async () => {
  const { t, app } = harness();
  t.newRun('classic', 2010, 'free');
  await t.spinFree();
  assert.equal(t.state().phase, 'hand');
  assert.equal(t.state().decade, 2010);
  assert.equal(t.state().team, 'GSW');
  assert.deepEqual([...t.state().hand.map(p => p.row.pid)].sort(), ['alpha', 'beta', 'cameo']);
  assert.ok(t.state().hand.find(p => p.row.pid === 'cameo'), 'one-game roster member is included');
  assert.equal((app.innerHTML.match(/reel-label/g) || []).length, 2);
  assert.match(app.innerHTML, /data-roster-query/);
  assert.match(app.innerHTML, /data-roster-sort/);
});

test('chosen player can contribute any unfilled skill from the correct peak team season', async () => {
  const { t } = harness();
  t.newRun('classic', 2010, 'free');
  await t.spinFree();
  const index = t.state().hand.findIndex(p => p.row.pid === 'alpha');
  t.chooseFreePlayer(index);
  assert.equal(t.state().phase, 'choose-skill');
  assert.equal(Object.keys(t.state().skillChoices).length, 23);
  assert.equal(t.state().skillChoices.three.season, 2011);
  assert.equal(t.state().skillChoices.inside.season, 2010);
  t.finishPick(t.state().skillChoices.three, 'three');
  assert.equal(t.state().phase, 'spin');
  assert.equal(t.state().picks.three.season, 2011);
  assert.equal(t.state().selected, null);
});

test('original skill draft stays the default, and duplicate categories are refused', async () => {
  const { t } = harness();
  t.newRun('classic', 2010);
  assert.equal(t.state().draftStyle, 'original');
  t.newRun('hoopiq', 2010, 'free');
  await t.spinFree();
  t.chooseFreePlayer(0);
  const chosen = t.state().skillChoices.three;
  t.finishPick(chosen, 'three');
  const old = t.state().picks.three;
  t.finishPick(chosen, 'three');
  assert.equal(t.state().picks.three, old);
  assert.equal(Object.keys(t.state().picks).length, 1);
});

test('original draft still spins three reels and deals only the selected skill', async () => {
  const { t, app } = harness();
  t.newRun('classic', 2010);
  await t.spin('all');
  assert.equal(t.state().draftStyle, 'original');
  assert.equal(t.state().phase, 'hand');
  assert.ok(t.state().cat, 'random skill remains on Original ruleset');
  assert.equal(t.state().hand.length, 1);
  assert.equal((app.innerHTML.match(/reel-label/g) || []).length, 3);
  assert.match(app.innerHTML, /data-hand/);
});
