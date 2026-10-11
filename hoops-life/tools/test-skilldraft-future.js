// Regression for Skill Draft careers continuing beyond the final archived season.
// Run: node --test tools/test-skilldraft-future.js
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {load,ctx} = require('./load');
const HL = load([
  'js/core/rng.js','data/names.js','data/injuries.js',
  'js/league/teams.js','js/league/ratings.js','js/league/player.js',
  'js/league/gamesim.js','js/league/draft.js','js/league/history.js',
  'js/league/season.js','js/league/draftroom.js','js/league/frontoffice.js',
  'data/history/index.js','data/history/seasons/2025.js',
  'js/league/legend-dna.js',
]);
HL.UI={esc:String};HL.FX={};HL.News=null;
const src=fs.readFileSync(path.join(__dirname,'../js/modes/skilldraft.js'),'utf8');
const anchor='return { open: () => { st = null; cache = null; render(); }';
assert.ok(src.includes(anchor),'Skill Draft must keep the ordinary API');
vm.runInContext(src.replace(anchor,
  'return { __futureTest:{leagueFor,simSeason,generatedAwardField,ratingsAt,careerLimit,primeWindow,extraordinaryLongevity,offseason, reset:()=>{cache=null;futureWorld=null;}}, open: () => { st = null; cache = null; render(); }'),
  ctx,{filename:'js/modes/skilldraft.js'});
const t=HL.SkillDraft.__futureTest;
function build(ovr=80,longevity=80,primeLength=80) {
  const a=Object.fromEntries(HL.ATTR_KEYS.map(k=>[k,ovr]));
  return {prime:{attrs:a,longevity,primeLength,height:78},me:{pos:'SF',height:78,traits:{workEthic:80},attrs:a,ovr},seasons:[],age:19,yr:2025,awards:[],rings:0};
}

test('generated seasons draft rookies, develop peers and change team standings',async()=>{
  t.reset();HL.RNG.setSeed(17);
  const start=await t.leagueFor(2025);
  const startCount=Object.keys(start.players).length;
  const records=[],rookies=[],improvements=[],awardFields=[];
  for(let y=2026;y<=2030;y++){
    const L=await t.leagueFor(y);
    assert.equal(L.season,y,'do not replay the final archived year');
    assert.equal(L.settings.history,'generated');
    const drafted=Object.values(L.players).filter(p=>p.draft?.year===y);
    assert.ok(drafted.length>=30,'new rookie draft every year '+y);
    assert.ok(drafted.some(p=>p.teamId!=null),'rookies must sign onto NBA teams');
    assert.ok(L._careerDevelopment?.some(p=>p.change>0),'existing player growth each offseason');
    assert.ok(L.teams.every(team=>team.real.w+team.real.l===L.games));
    records.push(L.teams[0].real.w);
    rookies.push(drafted.length);
    improvements.push(L._careerDevelopment.filter(p=>p.change>0).length);
    if(y<=2027){
      const rivals=t.generatedAwardField(L);
      assert.equal(L._careerAwardYear,y,'rivals must be measured in the new season');
      awardFields.push(rivals);
    }
  }
  assert.notStrictEqual(awardFields[0],awardFields[1],'award rivals must recalculate after rollover');
  assert.ok(awardFields[0].length>100&&awardFields[1].length>100);
  const latest=await t.leagueFor(2030);
  assert.ok(Object.keys(latest.players).length>startCount,'persistent league adds prospects');
  assert.ok(new Set(records).size>=3,'team strength must vary with seasons');
  assert.ok(Object.values(latest.players).some(p=>p.retired),'veterans must leave the league');
  assert.ok(rookies.every(n=>n>=30));
  assert.ok(improvements.every(n=>n>0));
});

test('future awards use new active player statistics, not 2025 award winners',async()=>{
  const L=await t.leagueFor(2030);
  const field=t.generatedAwardField(L);
  assert.ok(field.length>120,'new roster supplies a competitive award field');
  assert.ok(field.every(p=>p.name&&Number.isFinite(p.row.pts)));
  assert.ok(field.some(p=>p.player?.draft?.year>=2026),'generated prospects compete for honors');
  const donor=HL.League.teamPlayers(L.teams[0].id).sort((a,b)=>b.ovr-a.ovr)[0];
  const me=HL.createPlayer({name:'Career Regression',pos:'PG',age:24,height:75,ovr:90,arch:'scorer',real:false,season:L.season});
  me.id=999999;me.attrs={...donor.attrs};me.ovr=HL.computeOvr(me.attrs,me.pos);
  const season=t.simSeason(L,L.teams[0],me,0);
  assert.equal(season.leagueSource,'Generated');
  assert.ok(season.rivalCount>120);
  assert.ok(Number.isFinite(season.ppg));
  for(const award of season.awards)if(award.over)assert.ok(typeof award.over==='string');
});

test('even an all-99 longevity combination cannot have a half-century NBA prime',async()=>{
  const ordinary=build(80,80,80),extraordinary=build(99,99,99);
  assert.ok(t.careerLimit(ordinary)>=10&&t.careerLimit(ordinary)<=21);
  assert.equal(t.extraordinaryLongevity(extraordinary),true);
  assert.ok(t.primeWindow(extraordinary).seasons<=14);
  assert.ok(t.careerLimit(extraordinary)<=25);
  const a=t.ratingsAt(extraordinary,30),b=t.ratingsAt(extraordinary,43);
  assert.ok(b.speed<a.speed&&b.vert<a.vert,'aging removes physical dominance');
  extraordinary.age=44;
  extraordinary.seasons=Array.from({length:t.careerLimit(extraordinary)},()=>({g:82,ovr:90,minors:false}));
  await t.offseason(extraordinary);
  assert.equal(extraordinary.done,true,'career closes automatically at the longevity boundary');
  assert.ok(extraordinary.legacy,'finished career receives a verdict');
});
