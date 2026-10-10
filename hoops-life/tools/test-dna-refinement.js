const test=require('node:test'),assert=require('node:assert/strict');
const {load}=require('./load');
const HL=load(['js/core/rng.js','data/names.js','data/injuries.js','data/nbaids.js','data/history/index.js','js/league/teams.js','js/league/ratings.js','js/league/player.js','js/league/history.js','js/league/legend-dna.js',...['1995','1999','2012','2015','2016','2020'].map(y=>`data/history/seasons/${y}.js`)]);
const entry=(pid,cat,season=2015)=>({pid,cat,season,row:HL.History.seasonRows(String(season)).find(r=>r.pid===pid)});
const force=[entry('onealsh01','strength',1999),entry('onealsh01','inside',1999),entry('irvinky01','handle'),entry('curryst01','body')];
test('ordinary partnerships and arbitrary famous trios do not automatically mutate',()=>{
 const d=HL.DNA.analyze([entry('curryst01','PG'),entry('thompkl01','SG'),entry('jordami01','SF',1995)],{mode:'team'});
 assert.equal(d.mutations.length,0);assert.ok(d.pairs.some(x=>x.name==='Splash Brothers'));
 assert.equal(HL.DNA.analyze([{pid:'jamesle01',cat:'ft'},{pid:'wadedw01',cat:'body'}]).mutations.length,0);
});
test('Shaq power creates contact balance for a short frame and deep seals for a tall frame',()=>{
 const short=HL.DNA.analyze(force,{build:{height:74,attrs:{str:99,contactFinish:97,handle:90,post:93}}});
 const tall=HL.DNA.analyze(force.map(e=>e.cat==='body'?entry('onealsh01','body',1999):e),{build:{height:85,attrs:{str:99,contactFinish:97,post:93,iq:92}}});
 assert.ok(short.mutations.some(m=>m.mechanics?.contactBalance));
 assert.ok(!short.mutations.some(m=>m.mechanics?.deepSeal));
 assert.ok(tall.mutations.some(m=>m.mechanics?.deepSeal));
 assert.ok(!tall.mutations.some(m=>m.mechanics?.contactBalance));
 assert.notEqual(short.mutations[0].name,tall.mutations[0].name);
});
test('missing card evidence and unrelated skill categories cannot grant private signatures',()=>{
 assert.equal(HL.DNA.analyze(force.map(({pid,cat})=>({pid,cat})),{build:{height:74,attrs:{str:99,contactFinish:97,handle:90}}}).mutations.length,0);
 const d=HL.DNA.analyze([entry('curryst01','ft')]);
 assert.ok(!d.signatures.some(s=>s.mechanics?.gravity||s.mechanics?.relocation));
});
test('historical Bay trio transforms only its verified peak seasons, and explains activation',()=>{
 const good=[entry('curryst01','PG'),entry('thompkl01','SG'),entry('greendr01','PF')];
 const d=HL.DNA.analyze(good,{mode:'team'}),m=d.mutations.find(x=>x.id==='mutation:bay-motion');
 assert.ok(m);assert.ok(m.ingredients.length===3);assert.ok(m.qualification&&m.activation&&m.description);
 assert.ok(m.mechanics.relocation);assert.equal(HL.DNA.analyze(good.map(e=>({...e,season:2020})),{mode:'team'}).mutations.length,0);
});
test('evolved shooting form replaces its precursor and duplicate inputs do not stack',()=>{
 const ps=[entry('curryst01','three'),entry('thompkl01','jumper'),entry('curryst01','handle'),entry('jamesle01','speed',2012),entry('jamesle01','iq',2012),entry('curryst01','body')];
 const build={height:75,attrs:{three:100,releaseSpeed:94,handle:97,speed:92,iq:97}};
 const d=HL.DNA.analyze(ps,{build}),again=HL.DNA.analyze([...ps,...ps],{build});
 assert.ok(d.mutations.some(m=>m.type==='evolved'));assert.ok(d.mutations.length<=2);
 assert.equal(new Set(d.mutations.map(m=>m.family)).size,d.mutations.length);
 assert.equal(JSON.stringify(d.active),JSON.stringify(again.active));
});
test('team effects are scoped to participants and applying DNA twice is idempotent',()=>{
 const e=[entry('curryst01','PG'),entry('thompkl01','SG')];
 const players=e.map((x,i)=>({...HL.History.makePlayer(x.row,x.season,1),id:i+1,historicalPid:x.pid}));
 const outsider={...HL.History.makePlayer(entry('jamesle01','SF',2012).row,2012,1),id:3,historicalPid:'jamesle01'};players.push(outsider);
 HL.DNA.applyTeam(players,e);const first=JSON.stringify(players.map(p=>p.attrs));
 assert.equal(outsider.dna.effects.three||0,0);assert.equal(outsider.dna.mechanics?.gravity||0,0);
 HL.DNA.applyTeam(players,e);assert.equal(JSON.stringify(players.map(p=>p.attrs)),first);
});
test('mutations remain rare across 400 genuinely sampled historical teams',()=>{
 HL.RNG.setSeed(447);const rows=HL.History.seasonRows('2015');let n=0;
 for(let i=0;i<400;i++){const ps=HL.RNG.shuffle(rows).slice(0,8).map((row,j)=>({row,pid:row.pid,season:2015,cat:['PG','SG','SF','PF','C','B1','B2','B3'][j]}));if(HL.DNA.analyze(ps,{mode:'team'}).mutations.length)n++;}
 assert.ok(n<20,`${n}/400 teams mutated`);
});
