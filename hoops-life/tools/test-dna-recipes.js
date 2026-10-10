const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs');const {load,ctx}=require('./load');
const HL=load(['js/core/rng.js','data/history/index.js','data/history/career-traits.js','js/league/ratings.js','js/league/player.js','js/league/history.js','js/league/era-depth.js','js/league/legend-dna.js',...fs.readdirSync(__dirname+'/../data/history/seasons').map(f=>'data/history/seasons/'+f)]);ctx.HL.UI={esc:String};ctx.HL.FX={};load(['js/modes/challenge820.js','js/modes/skilldraft.js']);
const archive=fs.readdirSync(__dirname+'/../data/history/seasons').filter(f=>/^\d+\.js$/.test(f)).flatMap(f=>{const season=+f.replace('.js','');return HL.History.seasonRows(String(season)).map(row=>({pid:row.pid,row,season,attrs:HL.historicalAttributes(row)}));});
test('every authored recipe has an achievable combination of real archived tools and frames',()=>{
 for(const r of HL.DNA.RECIPES){
  const es=r.mode?r.p.map(pid=>archive.find(e=>e.pid===pid&&(!r.years||(e.season>=r.years[0]&&e.season<=r.years[1]))&&Object.entries(r.roleTools?.[pid]||{}).every(([k,v])=>e.attrs[k]>=v))):r.needs.map(n=>{const e=archive.find(e=>(!n.pid||n.pid===e.pid)&&Object.entries(n.min||{}).every(([k,v])=>e.attrs[k]>=v));return e&&{...e,cat:n.cat};});
  assert.ok(es.every(Boolean),`${r.id}: no real archived ingredient reaches its authored threshold`);
  if(!r.mode){const body=archive.find(e=>HL.HISTORY.players[e.pid][3]>=r.frame[0]&&HL.HISTORY.players[e.pid][3]<=r.frame[1]);es.push({...body,cat:'body'});
   if((r.tools?.block||r.needs.some(n=>n.min?.block))&&!es.some(e=>e.cat==='vert'))es.push({...archive.find(e=>e.attrs.vert>=90&&e.attrs.burst>=90),cat:'vert'});
  }
  const d=HL.DNA.analyze(es,{mode:r.mode||'skill'});
  assert.ok(d.mutations.some(m=>m.id===`mutation:${r.id}`||m.family===r.family&&m.type==='evolved'),`${r.id}: ingredients exist but form does not qualify`);
 }
});
test('extraordinary longevity can actually be assembled from existing cards',()=>{
 const motor=archive.find(e=>e.attrs.dur>=94&&e.attrs.stam>=96),long=Object.keys(HL.HISTORY.players).find(pid=>HL.careerTraitFor(pid).longevity>=98),prime=Object.keys(HL.HISTORY.players).find(pid=>HL.careerTraitFor(pid).primeLength>=98);
 assert.ok(motor&&long&&prime);const c={prime:{attrs:{...motor.attrs,iq:99,three:99},longevity:HL.careerTraitFor(long).longevity,primeLength:HL.careerTraitFor(prime).primeLength},me:{traits:{}}};assert.equal(HL.SkillDraft.extraordinaryLongevity(c),true);
});
test('legend-heavy random teams and strong mixed-skill builds keep mutations exceptional',()=>{
 HL.RNG.setSeed(716);const elite=Object.keys(HL.DNA.PROFILES).map(pid=>archive.filter(e=>e.pid===pid).sort((a,b)=>HL.historicalSeasonOvr(b.row)-HL.historicalSeasonOvr(a.row))[0]).filter(Boolean);
 let teams=0,skills=0,chemistry=0;
 for(let i=0;i<400;i++){
  const es=HL.RNG.shuffle(elite).slice(0,8).map((e,j)=>({...e,cat:['PG','SG','SF','PF','C','B1','B2','B3'][j]})),team=HL.DNA.analyze(es,{mode:'team'});
  teams+=!!team.mutations.length;chemistry+=!!team.pairs.length;
  const mix=Object.keys(HL.DNA.CATEGORY_ATTRS).map(cat=>({...HL.RNG.pick(elite),cat}));mix.push({...HL.RNG.pick(elite),cat:'body'});
  skills+=!!HL.DNA.analyze(mix).mutations.length;
 }
 console.log(`DNA frequency: ${teams}/400 legend-heavy teams, ${skills}/400 mixed elite skill builds mutate; ${chemistry}/400 teams have chemistry`);
 assert.ok(teams<60,`${teams}/400 legend-heavy teams mutate`);assert.ok(skills<40,`${skills}/400 mixed elite skill builds mutate`);assert.ok(chemistry>teams*3);
});
