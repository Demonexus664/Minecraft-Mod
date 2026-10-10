// Regression tests for the advanced-stat scale and honest shot-frequency semantics.
const test=require('node:test');
const assert=require('node:assert/strict');
const {load}=require('./load');
const HL=load(['js/core/rng.js','js/league/ratings.js','js/league/player.js',
  'js/league/history.js','data/history/index.js','js/league/era-depth.js',
  ...[1967,1975,1995,2015,2017,2019,2020,2024].map(y=>`data/history/seasons/${y}.js`)]);
function row(name,year) {return HL.History.seasonRows(String(year)).find(r=>HL.HISTORY.players[r.pid][0]===name);}
function attrs(name,year){return HL.historicalAttributes(row(name,year));}
test('shot choice quality and shot frequencies are independent dimensions',()=>{
  const lebron=row('LeBron James',2017),a=HL.historicalAttributes(lebron),t=HL.historicalTendencies(lebron);
  assert.ok(a.shotSelection>=88,`LeBron decisions: ${a.shotSelection}`);
  assert.ok(t.three<55,`LeBron three-point attempts preference is ${t.three}`);
  assert.notEqual(a.shotSelection,t.three);
  assert.ok(a.shotSelection>a.three, 'Elite IQ / choices do not require elite 3PT shooting');
});
test('modern elite guard release scores are not penalized just for being short',()=>{
  const curry=attrs('Stephen Curry',2015),ja=attrs('Ja Morant',2020);
  assert.ok(curry.releaseHeight>=62 && curry.releaseSpeed>=90,JSON.stringify(curry));
  assert.ok(ja.releaseHeight>=60 && ja.burst>=92 && ja.accel>=90,JSON.stringify(ja));
});
test('weak skills remain weak rather than applying an artificial 70 minimum',()=>{
  const curry=attrs('Stephen Curry',2015),ja=attrs('Ja Morant',2020),giannis=attrs('Giannis Antetokounmpo',2019);
  assert.ok(curry.screen<75,'Curry is not an elite screener by default');
  assert.ok(ja.screen<65,'Ja remains a weak screen setter');
  assert.ok(giannis.releaseSpeed<90,'Giannis is not suddenly an elite release-speed shooter');
});
test('every historical player produces finite 25-100 scouting traits, with a rare 100 tier',()=>{
  let count=0;
  for(const yr of [1967,1975,1995,2015,2017,2019,2020,2024])for(const r of HL.History.seasonRows(''+yr)){
    const a=HL.historicalAttributes(r);
    for(const key of HL.ATTR_KEYS)assert.ok(Number.isFinite(a[key])&&a[key]>=25&&a[key]<=100,`${yr}: ${r.pid}: ${key}=${a[key]}`);
    count++;
  }
  assert.ok(count>2000);
});
test('estimated release heights are balanced across strong modern players',()=>{
  let rows=HL.History.seasonRows('2024').filter(r=>r.ovr>=85&&r.g>=30);
  const release=rows.map(r=>HL.historicalAttributes(r).releaseHeight);
  assert.ok(release.filter(x=>x<60).length <release.length/3,`2024 star release heights: ${release}`);
});

test('Skill Draft Shot Decisions card uses decision quality rather than shot-frequency averages',()=>{
  HL.UI={esc:x=>String(x)};
  load(['js/modes/challenge820.js']);
  const lebron=row('LeBron James',2017);
  const candidate={row:lebron,season:2017,club:'CLE'};
  const rating=HL.Challenge.skillValue(candidate,['tendShot','Shot decisions & preferences',['three','mid','drive','post','catchShoot','transition','attackMismatch']]);
  assert.equal(rating,HL.historicalAttributes(lebron).shotSelection);
  assert.ok(rating>=88);
  const style=HL.historicalTendencies(lebron);
  assert.ok(style.three<55,'low attempt percentage must not be mislabeled poor shot selection');
});
