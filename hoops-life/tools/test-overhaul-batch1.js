// Arena Edition / Overhaul Batch 1 focused regressions.
// Run from hoops-life: node --test tools/test-overhaul-batch1.js
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {load,ctx}=require('./load');

const HL=load(['js/core/rng.js','data/history/index.js','data/history/career-traits.js',
  'js/league/ratings.js','js/league/legend-dna.js']);
HL.UI={esc:s=>String(s??''),app:()=>({}),setEra:()=>{},applyTeamTheme:()=>{}};
HL.FX={sfx:{pop(){},clutch(){},rival(){}},reduced:()=>true};
const fullSkill=fs.readFileSync(path.join(__dirname,'../js/modes/skilldraft.js'),'utf8');
const full82=fs.readFileSync(path.join(__dirname,'../js/modes/challenge820.js'),'utf8');
const skillReturn='return { open: () => { st = null; cache = null; render(); }';
const challengeReturn='return { open: () => { st = null; render(); }';
assert.ok(fullSkill.includes(skillReturn));
assert.ok(full82.includes(challengeReturn));
vm.runInContext(full82.replace(challengeReturn,
  'return { __overhaul:{newRun,missionStatus,COACHES,CHALLENGES,state:()=>st}, open: () => { st = null; render(); }'),
  ctx,{filename:'challenge820.js'});
vm.runInContext(fullSkill.replace(skillReturn,
  'return { __overhaul:{TRAINING,trainSummer,trainingView,milestoneView,ratingsAt}, open: () => { st = null; cache = null; render(); }'),
  ctx,{filename:'skilldraft.js'});

function career(){
  const attrs=Object.fromEntries(HL.ATTR_KEYS.map(k=>[k,78]));
  return {prime:{attrs,longevity:81,primeLength:78,height:78},me:{pos:'SG',height:78,traits:{workEthic:82}},
    age:26,yr:2017,seasons:[],trainingFocus:'balanced',training:{},trainingHistory:[],
    awards:[],rings:0,totals:{pts:0},legacy:null};
}

test('82-0 offers four meaningful side missions with measurable outcomes',()=>{
  const h=HL.Challenge.__overhaul;
  assert.equal(Object.keys(h.CHALLENGES).length,4);
  assert.equal(h.missionStatus({l:0},'perfect').completed,true);
  assert.equal(h.missionStatus({l:1},'perfect').completed,false);
  const defense={w:66,l:16,games:82,season:2025,pa:99,closeGames:9,closeWins:7,pf:120};
  assert.equal(h.missionStatus(defense,'lock').completed,true);
  assert.equal(h.missionStatus({...defense,pa:114},'lock').completed,false);
  assert.equal(h.missionStatus(defense,'clutch').completed,true);
  assert.equal(h.missionStatus({...defense,closeWins:2},'clutch').completed,false);
});

test('scouting and momentum coaching alter actual pace or defense fields without changing ratings',()=>{
  const h=HL.Challenge.__overhaul;
  const base={pace:50,defense:'man',focus:'balanced',crash:50};
  const shooter={ovr:91,attrs:{three:94}};
  const big={ovr:92,attrs:{post:95,dunk:93}};
  const scout=h.COACHES.scout.adjust(base,[shooter,shooter,shooter]);
  assert.equal(scout.defense,'switch');
  assert.equal(h.COACHES.scout.adjust(base,[big,big]).defense,'drop');
  const momentum=h.COACHES.momentum.adjust(base,[],{lastLoss:true,streak:0});
  assert.ok(momentum.pace>base.pace);
  assert.equal(momentum.focus,'star');
  assert.equal(base.pace,50,'baseline strategy not mutated');
});

test('82-0 options store chosen missions, coaching identity and optional broadcast breaks',()=>{
  const h=HL.Challenge.__overhaul;
  h.newRun({mode:'classic',decades:[1990],playSeason:1997,mission:'fireworks',coach:'scout',timeouts:false});
  const state=h.state();
  assert.equal(state.mission,'fireworks');
  assert.equal(state.coach,'scout');
  assert.equal(state.timeouts,false);
  assert.equal(state.coachLog.length,0);
  assert.match(full82,/data-film-plan/);
  assert.match(full82,/data-mission/);
  assert.match(full82,/data-timeouts/);
});

test('Skill Draft training affects specific attrs and has diminishing returns',()=>{
  const h=HL.SkillDraft.__overhaul;
  const c=career(),baseline=career();
  c.trainingFocus='shooting';
  const gains=[];
  for(let i=0;i<12;i++){const before=c.training.shooting||0;h.trainSummer(c);gains.push(c.training.shooting-before);}
  assert.ok(gains[0]>gains[11],'training becomes harder as you master the skill');
  assert.equal(c.trainingHistory.length,12);
  const improved=h.ratingsAt(c,29),ordinary=h.ratingsAt(baseline,29);
  assert.ok(improved.three>ordinary.three,'trained shooting earns real attribute gains');
  assert.equal(improved.intD,ordinary.intD,'not an indiscriminate OVR boost');
  assert.ok(HL.ATTR_KEYS.every(k=>improved[k]>=25&&improved[k]<=99));
});

test('Skill Draft training lab shows six choices and legacy goals reflect real career stats',()=>{
  const h=HL.SkillDraft.__overhaul;
  assert.equal(Object.keys(h.TRAINING).length,6);
  const c=career();c.trainingFocus='defense';
  const html=h.trainingView(c);
  assert.match(html,/data-training="defense"/);
  assert.match(html,/SELECTED/);
  c.totals.pts=30001;
  c.awards=[{award:'MVP'},{award:'Scoring title'}];
  c.rings=3;c.seasons=Array.from({length:16},(_,i)=>({minors:false,ppg:i===12?32:20}));
  c.legacy={rank:2};
  const legacy=h.milestoneView(c);
  assert.match(legacy,/30K Club/);
  assert.match(legacy,/Ring Collector/);
  assert.match(legacy,/COMPLETE/);
  assert.match(legacy,/GOAT Case/);
});

test('Arena Edition registers a visual layer, motion accessibility and material feedback',()=>{
  const style=fs.readFileSync(path.join(__dirname,'../css/overhaul.css'),'utf8');
  const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
  assert.match(html,/css\/overhaul\.css/);
  assert.match(style,/prefers-reduced-motion:reduce/);
  assert.match(style,/\.gcard\.up:hover/);
  assert.match(style,/\.coach-break/);
  assert.match(style,/\.legacy-quest-grid/);
  assert.match(style,/\.training-grid/);
  const fx=fs.readFileSync(path.join(__dirname,'../js/core/fx.js'),'utf8');
  assert.match(fx,/achievement:/);
  assert.match(fx,/clutch:/);
  assert.match(fx,/rival:/);
});
