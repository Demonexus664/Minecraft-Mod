const test=require('node:test'),assert=require('node:assert/strict');const {load}=require('./load');
const HL=load(['js/core/rng.js','data/names.js','data/injuries.js','data/nbaids.js','data/history/index.js','js/league/teams.js','js/league/ratings.js','js/league/player.js','js/league/history.js','js/league/legend-dna.js','js/league/gamesim.js','data/history/seasons/2015.js']);
function player(pid,id){const r=HL.History.seasonRows('2015').find(x=>x.pid===pid);return {...HL.History.makePlayer(r,2015,1),id,historicalPid:pid};}
function ctx(p,others=[],def=null,type='three'){const d=def||HL.createPlayer({ovr:80,pos:'SF',height:78});return {shooter:p,defender:d,lineup:[p,...others],dline:[d],type,coverage:'drop'};}
test('Curry and Bird have different shot behavior at identical three-point accuracy',()=>{
 const c=player('curryst01',1),b=HL.createPlayer({ovr:90,pos:'SF',height:81});b.historicalPid='birdla01';c.attrs.three=b.attrs.three=99;
 c.dna={mechanics:HL.DNA.PROFILES.curryst01};b.dna={mechanics:HL.DNA.PROFILES.birdla01};
 const cc=HL.DNA.basketballContext({...ctx(c),assisted:true}),bc=HL.DNA.basketballContext({...ctx(b),assisted:true});
 assert.ok(cc.threeWeight>bc.threeWeight);assert.ok(cc.actions.includes('relocation'));assert.ok(bc.actions.includes('highRelease'));
});
test('perimeter gravity opens a teammate at the rim, while a benched partner cannot supply chemistry',()=>{
 const c=player('curryst01',1),k=player('thompkl01',2),other=player('jamesle01',3);
 HL.DNA.applyTeam([c,k],[{pid:c.historicalPid,cat:'PG'},{pid:k.historicalPid,cat:'SG'}]);
 assert.ok(HL.DNA.mechanicsFor(c,[c,k]).screenMove>0);assert.equal(HL.DNA.mechanicsFor(c,[c]).screenMove||0,0);
 const withGravity=HL.DNA.basketballContext(ctx(other,[c,k],null,'rim')),without=HL.DNA.basketballContext(ctx(other,[],null,'rim'));
 assert.ok(withGravity.make>without.make);assert.ok(withGravity.actions.includes('gravitySpace'));
});
test('short power and tall post power affect different actions and doubles require passing reads',()=>{
 const small=HL.createPlayer({ovr:90,pos:'PG',height:74}),tall=HL.createPlayer({ovr:90,pos:'C',height:85}),d=HL.createPlayer({ovr:80,pos:'C',height:84});
 small.dna={mechanics:{contactBalance:1.6}};tall.dna={mechanics:{deepSeal:1.6,postDouble:1.4,postRead:1.2}};tall.attrs.post=95;tall.tend.post=80;
 const s=HL.DNA.basketballContext(ctx(small,[],d,'rim')),t=HL.DNA.basketballContext(ctx(tall,[],d,'rim'));
 assert.ok(s.actions.includes('contactBalance'));assert.ok(t.actions.includes('deepSeal'));assert.ok(t.kickChance>0);assert.equal(s.kickChance,0);
});
test('a low-reach low-explosion build cannot execute a 99 dunk ceiling',()=>{
 const a={dunk:99,vert:25,burst:25,str:99,screen:99,iq:80};
 const small=HL.DNA.reconcileAttributes(a,74),tall=HL.DNA.reconcileAttributes(a,88);
 assert.ok(small.attrs.dunk<75);assert.ok(tall.attrs.dunk>small.attrs.dunk);assert.equal(a.dunk,99);
 assert.ok(small.constraints.some(x=>x.key==='dunk'));
});
test('defensive rotations and position actually alter contests and rebound advantage',()=>{
 const s=player('curryst01',1),d=HL.createPlayer({ovr:90,pos:'C',height:86});d.dna={mechanics:{rimIntimidation:1.6,rotations:1.4,boxPosition:1.4}};
 const result=HL.DNA.basketballContext(ctx(s,[],d,'rim'));assert.ok(result.make<0);assert.ok(result.block>0);assert.ok(result.rebOff<0);
});
test('actual simulated games expose DNA action counters and consistent score accounting',()=>{
 const rows=HL.History.seasonRows('2015'),make=(club,id)=>({id,abbr:club,strategy:HL.DEFAULT_STRATEGY(),players:rows.filter(r=>r.stints.some(x=>x[0]===club)).slice(0,12).map(r=>({...HL.History.makePlayer(r,2015,id),historicalPid:r.pid}))});
 const a=make('GSW',1),b=make('CLE',2);HL.DNA.applyTeam(a.players,a.players.map(p=>({pid:p.historicalPid,cat:p.pos,season:2015,row:rows.find(r=>r.pid===p.historicalPid)})));HL.RNG.setSeed(437);
 const g=HL.simGame(a,b,HL.DEFAULT_RULES());assert.ok(g.events.dna.home.relocation>0);
 for(const side of [g.home,g.away]){assert.equal(Object.values(side.box).reduce((n,l)=>n+l.pts,0),side.score);assert.equal(side.quarters.reduce((n,x)=>n+x,0),side.score);}
});
