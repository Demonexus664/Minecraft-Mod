// Arena Edition / Overhaul Batch 1 focused regressions.
// Run from hoops-life: node --test tools/test-overhaul-batch1.js
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {load,ctx}=require('./load');

const HL=load(['js/core/rng.js','data/history/index.js','data/history/career-traits.js',
  'js/league/ratings.js','js/league/player.js','js/league/legend-dna.js']);
HL.UI={esc:s=>String(s??''),app:()=>({}),setEra:()=>{},applyTeamTheme:()=>{}};
HL.FX={sfx:{pop(){},clutch(){},rival(){}},reduced:()=>true};
const fullSkill=fs.readFileSync(path.join(__dirname,'../js/modes/skilldraft.js'),'utf8');
const full82=fs.readFileSync(path.join(__dirname,'../js/modes/challenge820.js'),'utf8');
const skillReturn='return { open: () => { st = null; cache = null; render(); }';
const challengeReturn='return { open: () => { st = null; render(); }';
assert.ok(fullSkill.includes(skillReturn));
assert.ok(full82.includes(challengeReturn));
vm.runInContext(full82.replace(challengeReturn,
  'return { __overhaul:{newRun,missionStatus,COACHES,CHALLENGES,gauntletSchedule,state:()=>st}, open: () => { st = null; render(); }'),
  ctx,{filename:'challenge820.js'});
vm.runInContext(fullSkill.replace(skillReturn,
  'return { __overhaul:{TRAINING,trainSummer,trainingView,milestoneView,ratingsAt,ROLES,AGENDAS,customizeRole,finishAgenda,rolePanel}, open: () => { st = null; cache = null; render(); }'),
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

test('Legend Gauntlet schedules four honest high-strength NBA opponents',()=>{
  const h=HL.Challenge.__overhaul;
  const teams=Array.from({length:10},(_,i)=>({id:i,name:'Team '+i,
    customPlayers:Array.from({length:7},()=>({ovr:70+i}))}));
  const schedule=Array.from({length:82},(_,i)=>teams[i%10]);
  const before=teams.map(t=>t.customPlayers[0].ovr);
  const bosses=h.gauntletSchedule(teams,schedule);
  assert.equal(bosses.length,4);
  assert.equal(bosses[0].g,21);
  assert.equal(bosses[3].g,82);
  assert.deepEqual(bosses.map(b=>b.id),[9,8,7,6]);
  assert.ok(bosses.every(b=>schedule[b.g-1].id===b.id));
  assert.deepEqual(teams.map(t=>t.customPlayers[0].ovr),before,'opponents remain unboosted');
  h.newRun({mode:'classic',decades:[2010],playSeason:2025,gauntlet:true});
  assert.equal(h.state().gauntlet,true);
  h.newRun({mode:'classic',decades:[2010],playSeason:2025,gauntlet:true,daily:true});
  assert.equal(h.state().gauntlet,false,'daily challenges remain comparable');
});

test('Season Gameplan Studio changes actual usage and tendencies without changing ratings',()=>{
  const h=HL.SkillDraft.__overhaul;
  assert.equal(Object.keys(h.ROLES).length,5);
  const getPlayer=()=>({pos:'SG',height:76,weight:200,age:25,ovr:87,
    attrs:Object.fromEntries(HL.ATTR_KEYS.map(k=>[k,80])),tend:{}});
  const base=getPlayer(),scorer=getPlayer(),creator=getPlayer(),def=getPlayer();
  h.customizeRole(base,'balanced');
  const scoring=h.customizeRole(scorer,'scorer');
  const passing=h.customizeRole(creator,'facilitator');
  h.customizeRole(def,'stopper');
  assert.ok(scorer.tend.usage>base.tend.usage);
  assert.ok(creator.tend.passFirst>base.tend.passFirst);
  assert.ok(def.tend.contest>base.tend.contest);
  assert.ok(scorer.tend.passFirst<base.tend.passFirst);
  assert.equal(scoring.focus,'star');
  assert.equal(passing.focus,'motion');
  assert.deepEqual(scorer.attrs,base.attrs,'identical physical and technical ratings');
});

test('Season contracts pay modest training rewards only when real thresholds are met',()=>{
  const h=HL.SkillDraft.__overhaul,c=career();
  c.agenda='points';c.agendaVictories=0;c.agendaHistory=[];c.trainingReward=0;
  const missed=h.finishAgenda(c,{g:78,ppg:29.5},82);
  assert.equal(missed.complete,false);
  assert.equal(c.trainingReward,0);
  const won=h.finishAgenda(c,{g:80,ppg:30.1},82);
  assert.equal(won.complete,true);
  assert.equal(c.agendaVictories,1);
  assert.ok(c.trainingReward>0);
  c.trainingFocus='shooting';
  h.trainSummer(c);
  assert.equal(c.trainingReward,0,'bonus is spent once');
  assert.ok(c.training.shooting<3,'reward stays limited');
  assert.match(h.rolePanel(c),/data-role="scorer"/);
  assert.match(h.rolePanel(c),/data-agenda/);
});
