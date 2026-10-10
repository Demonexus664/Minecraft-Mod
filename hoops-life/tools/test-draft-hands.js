const test=require('node:test'),assert=require('node:assert/strict'),{load}=require('./load');
const HL=load(['js/core/rng.js','js/league/history.js','data/history/index.js',...Array.from({length:6},(_,i)=>`data/history/seasons/${2020+i}.js`)]);HL.UI={esc:x=>String(x)};load(['js/modes/challenge820.js']);
test('2020s Portland hand contains Damian Lillard and the five highest-rated unique players',()=>{const pool=HL.Challenge.candidates('POR',2020),hand=HL.Challenge.dealHand('POR',2020);assert.equal(hand.length,5);assert.ok(hand.some(c=>HL.HISTORY.players[c.row.pid][0]==='Damian Lillard'));assert.deepEqual(hand.map(c=>c.row.pid).sort(),pool.slice(0,5).map(c=>c.row.pid).sort());});
test('already drafted players are excluded before choosing the next best five',()=>{const pool=HL.Challenge.candidates('POR',2020),taken=[pool[0].row.pid],hand=HL.Challenge.dealHand('POR',2020,taken);assert.ok(hand.every(c=>!taken.includes(c.row.pid)));assert.deepEqual(hand.map(c=>c.row.pid).sort(),pool.slice(1,6).map(c=>c.row.pid).sort());});

test('Skill Draft deals precisely the five strongest available skill seasons, ranked best-first',()=>{
 for(const category of [['three','Three-point',['three']], ['reb','Rebounding',['oreb','dreb']],['ath','Athleticism',['speed','vert','str']],['body','Body',[]]]) {
   const sorted=HL.Challenge.skillCandidates('POR',2020,category);
   const hand=HL.Challenge.dealSkillHand('POR',2020,category);
   assert.equal(hand.length,5);
   assert.deepEqual(hand.map(x=>x.row.pid),sorted.slice(0,5).map(x=>x.row.pid));
   for(let i=1;i<hand.length;i++) assert.ok(HL.Challenge.skillValue(hand[i-1],category)>=HL.Challenge.skillValue(hand[i],category));
   const reroll=HL.Challenge.dealSkillHand('POR',2020,category,[hand[0].row.pid]);
   assert.deepEqual(reroll.map(x=>x.row.pid),sorted.slice(1,6).map(x=>x.row.pid));
 }
});
test('Skill Draft is based on the rolled attribute instead of generic OVR',()=>{
 const cat=['three','Three-point',['three']];
 const pool=HL.Challenge.skillCandidates('POR',2020,cat);
 const top=HL.Challenge.candidates('POR',2020);
 assert.ok(pool.length>5&&top.length>5);
 assert.equal(pool[0].row.pid,HL.Challenge.dealSkillHand('POR',2020,cat)[0].row.pid);
 // Every candidate is internally scored using exactly its chosen season's rating.
 for(const p of pool.slice(0,20)){
  const attrs=HL.History.unpack(p.row.attrs,HL.HISTORY.attrs);
  assert.equal(HL.Challenge.skillValue(p,cat),attrs.three);
 }
});
