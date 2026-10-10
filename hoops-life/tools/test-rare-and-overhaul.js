const test=require('node:test');
const assert=require('node:assert/strict');
const {load}=require('./load');
const fs=require('fs');
const base=['js/core/rng.js','data/names.js','data/injuries.js','data/nbaids.js','data/history/index.js','js/league/teams.js','js/league/ratings.js','js/league/player.js','js/league/gamesim.js','js/league/draft.js','js/league/history.js','js/league/era-depth.js','js/league/rare-encounters.js'];
const seasonKeys=[1990,1991,1999,2000,2005,2007,2015,2016,2017,2020];
const HL=load([...base,...seasonKeys.map(y=>`data/history/seasons/${y}.js`)]);
function row(name,year){return HL.History.seasonRows(String(year)).find(r=>HL.HISTORY.players[r.pid][0]===name);}
test('historical cards never share mutable ratings with created roster players',()=>{
 const r=row('Stephen Curry',2015),a=HL.historicalAttributes(r),before={...a},p=HL.History.makePlayer(r,2015,0);
 p.attrs.three=25; p.attrs.releaseSpeed=25;
 assert.deepEqual({...HL.historicalAttributes(r)},before);
 assert.equal(HL.historicalSeasonOvr(r),99);
});
test('the same historical peak is valued consistently in drafting and season rosters',()=>{
 for(const [name,year] of [['Stephen Curry',2015],['Stephen Curry',2020],["Shaquille O'Neal",2000]]){
  const r=row(name,year),p=HL.History.makePlayer(r,year,0);
  assert.equal(p.ovr,HL.historicalSeasonOvr(r));
 }
});
test('elite historical seasons retain specific weaknesses and the 99 cap',()=>{
 const shaq=HL.historicalAttributes(row("Shaquille O'Neal",2000));
 const curry=HL.historicalAttributes(row('Stephen Curry',2020));
 assert.ok(shaq.boxout>=90 && shaq.three<50);
 assert.equal(HL.historicalSeasonOvr(row('Stephen Curry',2015)),99);
 assert.equal(HL.historicalSeasonOvr(row('Stephen Curry',2020)),99);
 assert.ok(curry.three>=95 && curry.str<85);
});
test('all four fictional crossover teams contain five eligible independent players',async()=>{
 const original=HL.historicalAttributes(row('Stephen Curry',2015)).three;
 for(const spec of HL.Legends.ENCOUNTERS){
  const t=await HL.Legends.opponent(spec);
  assert.ok(t,`${spec.name} missing`);
  assert.ok(t.players.length>=5,`${spec.name} only ${t.players.length} players`);
  assert.equal(new Set(t.players.map(p=>p.id)).size,t.players.length,`${spec.name} duplicate player IDs`);
  assert.ok(t.players.every(p=>p.ovr>=25&&p.ovr<=99));
 }
 assert.equal(HL.historicalAttributes(row('Stephen Curry',2015)).three,original,'rare opponent corrupted historical cards');
});
test('rare opponent simulation can play a regulation game',async()=>{
 const opponent=await HL.Legends.opponent(HL.Legends.ENCOUNTERS[0]);
 const base=HL.History.seasonRows('2015').filter(r=>r.stints[0][0]==='CLE').slice(0,10);
 const home={id:12345,abbr:'YOU',strategy:HL.DEFAULT_STRATEGY(),players:base.map(r=>HL.History.makePlayer(r,2015,12345))};
 if(home.players.length<5)for(const r of HL.History.seasonRows('2015').slice(0,5))home.players.push(HL.History.makePlayer(r,2015,12345));
 const result=HL.simGame(home,opponent,HL.DEFAULT_RULES());
 assert.ok(result.home.score>40&&result.away.score>40);
});
test('elite tool ratings have a visibly nonlinear bounded simulation bonus',()=>{
  const z=HL.eliteImpact;
  assert.equal(z(85),0);
  assert.ok(z(99)-z(95)>z(95)-z(90));
  assert.ok(z(99)>=1 && z(99)<=1.001);
});
test('a 99 prime duration stays fully elite through age 50 without raising cap',()=>{
 const {load}=require('./load');
 HL.UI={esc:s=>String(s)}; HL.FX={};
 load(['js/modes/challenge820.js','js/modes/skilldraft.js']);
 const c={prime:{attrs:Object.fromEntries(HL.ATTR_KEYS.map(k=>[k,99])),longevity:99,primeLength:99},me:{traits:{workEthic:75}}};
 const w=HL.SkillDraft.primeWindow(c);
 assert.ok(w.end>=50,JSON.stringify(w));
 const a=HL.SkillDraft.ratingsAt(c,50);
 assert.ok(HL.ATTR_KEYS.every(k=>a[k]===99),JSON.stringify(a));
 assert.equal(HL.SkillDraft.careerLimit(c),Infinity);
});

test('100 OVR is reserved for legendary historical peak at an eligible position',()=>{
 HL.UI={esc:x=>String(x)}; HL.FX={};load(['js/modes/challenge820.js']);
 const jordan=row('Michael Jordan',1990),lebron=row('LeBron James',2017),curry=row('Stephen Curry',2015);
 const card=r=>({row:r,season:2017});
 assert.equal(HL.Challenge.effRating(card(jordan),'SG'),100);
 assert.equal(HL.Challenge.effRating(card(lebron),'C'),100);
 assert.equal(HL.Challenge.effRating(card(lebron),'PG'),100);
 assert.equal(HL.Challenge.effRating(card(curry),'PG'),100);
 assert.ok(HL.Challenge.penalty(card(lebron),'C')===0);
 // A 99 base grade on its own is not a guaranteed 100 in position.
 const actual=HL.History.seasonRows('2015').find(r=>HL.historicalSeasonOvr(r)===99 && !HL.legendaryPeak(r));
 if(actual)assert.equal(HL.Challenge.effRating(card(actual),actual.pos==='G'?'PG':actual.pos==='F'?'SF':actual.pos),99);
 assert.ok(HL.Challenge.effRating(card(jordan),'C')<100);
});
test('a 100 shooting specialty transfers without inflating weak attributes',()=>{
 const curry=HL.historicalAttributes(row('Stephen Curry',2015));
 const shaq=HL.historicalAttributes(row("Shaquille O'Neal",2000));
 assert.equal(curry.three,100);
 assert.ok(curry.str<85);
 assert.ok(shaq.three<50);
 assert.ok(HL.eliteImpact(100)>HL.eliteImpact(99));
});