const test=require('node:test');const assert=require('node:assert/strict');const {load}=require('./load');
const HL=load(['js/core/rng.js','data/names.js','data/injuries.js','data/nbaids.js','data/history/index.js','data/history/career-traits.js','js/league/teams.js','js/league/ratings.js','js/league/player.js','js/league/legend-dna.js','js/league/gamesim.js','js/league/draft.js','js/league/history.js','js/league/era-depth.js','js/league/rare-encounters.js','js/league/career-story.js',...['1990','1991','1995','1999','2000','2012','2015','2016','2017','2020'].map(k=>`data/history/seasons/${k}.js`)]);
const mk=(pid,cat='mid')=>({pid,cat});
test('Different real players carry different usable signatures',()=>{
 const curry=HL.DNA.analyze([mk('curryst01','three')]);const bird=HL.DNA.analyze([mk('birdla01','three')]);
 assert.notEqual(curry.signatures[0].name,bird.signatures[0].name);
 assert.notDeepEqual(curry.signatures[0].bonus,bird.signatures[0].bonus);
 assert.equal(curry.signatures[0].title,undefined);
});
test('Known duo and trio chemistry is stronger and instantly active',()=>{
 const duo=HL.DNA.analyze([mk('curryst01','three'),mk('thompkl01','jumper')]);
 assert.equal(duo.pairs[0].name,'Splash Brothers');assert.ok(duo.active.some(e=>e.type==='historical-duo'));
 const trio=HL.DNA.analyze([mk('curryst01','three'),mk('thompkl01','jumper'),mk('greendr01','intD')]);
 assert.ok(trio.trios.some(e=>e.name==='The Bay Blueprint'));
 assert.ok(HL.DNA.bonusEffects(trio).three>0);
});
test('Fictional trios and duo categories have stable distinct identities and effects',()=>{
 const ps=[mk('curryst01','three'),mk('onealsh01','inside'),mk('jordami01','mid')];
 const a=HL.DNA.analyze(ps),b=HL.DNA.analyze(ps);
 assert.equal(a.trios[0].name,b.trios[0].name);
 assert.equal(a.pairs.length,3);assert.ok(a.mutations.some(m=>m.type==='evolved'));
 assert.equal(new Set(a.pairs.map(x=>x.id)).size,3);
 assert.notEqual(HL.DNA.preview(ps.slice(0,1),ps[1]).id,null);
});
test('Wade plus Cavs LeBron triggers actual mutation effects without mutating original data',()=>{
 const before=HL.historicalAttributes(HL.History.seasonRows('2017').find(r=>r.pid==='jamesle01'));
 const d=HL.DNA.analyze([mk('jamesle01','speed'),mk('wadedw01','inside')]);
 assert.ok(d.mutations.some(x=>x.year===2012&&x.target==='jamesle01'));
 const build={attrs:{accel:95,contactFinish:93},primeLength:80};HL.DNA.applyBuild(build,d);
 assert.ok(build.attrs.accel>=98);assert.ok(build.effects.transition>0);
 assert.equal(HL.historicalAttributes(HL.History.seasonRows('2017').find(r=>r.pid==='jamesle01')).accel,before.accel);
});
test('Chemistry modifies game ratings but respects max of 100 and original players',()=>{
 const ps=[{id:1,historicalPid:'curryst01',attrs:{three:99,releaseSpeed:98}}, {id:2,historicalPid:'thompkl01',attrs:{three:96,releaseSpeed:90}}];
 const dna=HL.DNA.applyTeam(ps,[{pid:'curryst01',cat:'PG'},{pid:'thompkl01',cat:'SG'}]);
 assert.equal(ps[0].attrs.three,100);assert.equal(ps[1].attrs.releaseSpeed,92);
 assert.ok(ps[0].dna.effects.three>0&&dna.pairs.length>0);
});
test('All legendary draft team rolls yield a real five-card hand, never six',async()=>{
 let enough=0;for(const spec of HL.Legends.DRAFT_TEAMS){const c=await HL.Legends.draftTeam(spec);if(c){enough++;assert.equal(c.length,5);assert.equal(new Set(c.map(x=>x.row.pid)).size,5);}}
 assert.ok(enough>=4,`Only ${enough} complete legendary teams`);
});
test('Career documentary derives its chapters and media evidence from results',()=>{
 const c={me:{name:'Custom Superstar'},rings:1,awards:[{award:'MVP'}],totals:{pts:1400,g:82},log:[],story:[],seasons:[{yr:2016,team:{name:'Thunder'},g:82,ppg:30,rpg:9,apg:5,w:70,l:12,made:true,champion:false,awards:['MVP']},{yr:2017,team:{name:'Thunder'},g:82,ppg:31,rpg:8,apg:6,w:66,l:16,made:true,champion:true,awards:['Finals MVP']}]};
 const f=HL.Story.documentary(c);assert.ok(f.chapters.some(x=>/championship|MVP/i.test(x.text)));assert.ok(f.debate[0].includes('1 championships'));
});
test('Career plot choices have bounded concrete consequences',()=>{
 const c={pendingStory:{type:'rival',title:'A Rivalry'},seasons:[{yr:2020}],prime:{attrs:{clutchShot:85},tendencies:{shotHunt:60}},story:[]};
 HL.Story.chooseDecision(c,'a');assert.equal(c.prime.attrs.clutchShot,87);assert.equal(c.prime.tendencies.shotHunt,65);assert.equal(c.story.length,1);
});