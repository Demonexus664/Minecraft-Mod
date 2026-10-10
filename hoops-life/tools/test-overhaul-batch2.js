// Arena Edition / Overhaul Batch 2: real game integration checks.
// Run from hoops-life: node --test tools/test-overhaul-batch2.js
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {load,ctx}=require('./load');

const HL=load([
  'js/core/rng.js','data/names.js','data/injuries.js',
  'js/league/teams.js','js/league/ratings.js','js/league/player.js',
  'js/league/gamesim.js','js/league/draft.js','js/league/history.js',
  'js/league/season.js','js/league/draftroom.js','js/league/frontoffice.js',
  'data/history/index.js','data/history/seasons/2025.js','js/league/legend-dna.js'
]);
HL.UI={esc:String,app:()=>null};HL.FX={sfx:{pop(){},draft(){},rival(){}}};
const modePath=path.join(__dirname,'../js/modes/skilldraft.js');
const challengePath=path.join(__dirname,'../js/modes/challenge820.js');
const skill=fs.readFileSync(modePath,'utf8'),challenge=fs.readFileSync(challengePath,'utf8');
const skillReturn='return { open: () => { st = null; cache = null; render(); }';
const challengeReturn='return { open: () => { st = null; render(); }';
assert.ok(skill.includes(skillReturn)&&challenge.includes(challengeReturn));
vm.runInContext(skill.replace(skillReturn,
 'return { __overhaul2:{leagueFor,simSeason,simSeasonInteractive,customizeRole,finishAgenda,rememberRival,rivalryView,ROLES},open:()=>{st=null;cache=null;render();}'),
 ctx,{filename:'skilldraft.js'});
vm.runInContext(challenge.replace(challengeReturn,
 'return { __overhaul2:{gauntletSchedule,newRun,state:()=>st},open:()=>{st=null;render();}'),
 ctx,{filename:'challenge820.js'});
const career=HL.SkillDraft.__overhaul2;
const challengeApi=HL.Challenge.__overhaul2;

test('Legend Gauntlet creates four actual games versus four unmodified elite rosters',()=>{
 const teams=Array.from({length:12},(_,i)=>({id:i,name:'Franchise '+i,
   customPlayers:Array.from({length:8},(_,j)=>({id:i*10+j,ovr:65+i}))}));
 const schedule=Array.from({length:82},(_,i)=>teams[i%teams.length]);
 const before=teams.map(t=>t.customPlayers[0].ovr);
 const bosses=challengeApi.gauntletSchedule(teams,schedule);
 assert.deepEqual(Array.from(bosses,b=>b.g),[21,41,62,82]);
 assert.deepEqual(Array.from(bosses,b=>b.id),[11,10,9,8]);
 assert.ok(bosses.every(b=>schedule[b.g-1].id===b.id));
 assert.deepEqual(Array.from(teams,t=>t.customPlayers[0].ovr),before);
 challengeApi.newRun({mode:'classic',decades:[2010],playSeason:2025,gauntlet:true});
 assert.equal(challengeApi.state().gauntlet,true);
});

test('the actual 2026 game simulator changes offensive identity and produces a real rival',async()=>{
 HL.RNG.setSeed(219);
 const L=await career.leagueFor(2026);
 assert.equal(L.season,2026);
 const donor=HL.League.teamPlayers(L.teams[0].id).sort((a,b)=>b.ovr-a.ovr)[0];
 const player=()=>{const p=HL.createPlayer({name:'Draft Lab Athlete',pos:'PG',age:24,height:75,
   ovr:88,arch:'scorer',real:false,season:2026});p.id=999999;p.teamId=L.teams[0].id;
   p.attrs={...donor.attrs};p.ovr=HL.computeOvr(p.attrs,p.pos);return p;};
 const original=player(),scorer=player(),stopper=player();
 HL.RNG.setSeed(678);
 const balanced=career.simSeason(L,L.teams[0],original,0,'balanced');
 HL.RNG.setSeed(678);
 const attack=career.simSeason(L,L.teams[0],scorer,0,'scorer');
 HL.RNG.setSeed(678);
 const defense=career.simSeason(L,L.teams[0],stopper,0,'stopper');
 assert.ok(scorer.tend.usage>original.tend.usage);
 assert.ok(stopper.tend.usage<original.tend.usage);
 assert.deepEqual({...scorer.attrs},{...original.attrs},'no free rating inflation');
 assert.ok(Math.abs(attack.ppg-balanced.ppg)>0.01||Math.abs(attack.apg-balanced.apg)>0.01,
   'play styles must change real on-court output');
 assert.ok(Math.abs(defense.ppg-attack.ppg)>0.01||Math.abs(defense.apg-attack.apg)>0.01);
 assert.ok(attack.rival?.name,'the strongest MVP contender is identified');
 assert.ok(Number.isFinite(attack.rival.myScore)&&Number.isFinite(attack.rival.theirScore));
 const c={rivalries:{}};
 career.rememberRival(c,{yr:2026,rival:attack.rival});
 career.rememberRival(c,{yr:2027,rival:{...attack.rival,win:!attack.rival.win}});
 assert.equal(Object.values(c.rivalries)[0].met,2);
 assert.equal(Object.values(c.rivalries)[0].wins+Object.values(c.rivalries)[0].losses,2);
 assert.match(career.rivalryView(c),/RIVALRY LEDGER/);
});

test('Season Gameplan contracts never award free victories',()=>{
 const c={agenda:'legacy',yr:2026,agendaHistory:[],agendaVictories:0,trainingReward:0};
 const missed=career.finishAgenda(c,{g:82,champion:false},82);
 assert.equal(missed.complete,false);
 assert.equal(c.trainingReward,0);
 const won=career.finishAgenda(c,{g:74,champion:true},82);
 assert.equal(won.complete,true);
 assert.equal(c.agendaVictories,1);
 assert.ok(c.trainingReward>0&&c.trainingReward<1);
});

test('presentation loads fully while preserving reduced-motion choices',()=>{
 const css=fs.readFileSync(path.join(__dirname,'../css/overhaul.css'),'utf8');
 const html=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
 assert.match(html,/overhaul\.css/);
 assert.match(css,/\.role-card\.active/);
 assert.match(css,/\.season-rivalry/);
 assert.match(css,/\.scout-panel/);
 assert.match(css,/prefers-reduced-motion:reduce/);
});

test('Skill Draft season simulations never permanently shrink teammates minutes',async()=>{
 HL.RNG.setSeed(322);
 const L=await career.leagueFor(2026);
 const team=L.teams[0],roster=HL.League.teamPlayers(team.id).slice();
 const snapshot=new Map(roster.map(p=>[p.id,p.realMpg]));
 const donor=roster.sort((a,b)=>b.ovr-a.ovr)[0];
 const me=HL.createPlayer({name:'Rotation Audit',pos:'PG',age:24,height:75,ovr:90,
   arch:'scorer',real:false,season:L.season});
 me.id=999999;me.teamId=team.id;me.attrs={...donor.attrs};
 me.ovr=HL.computeOvr(me.attrs,me.pos);
 career.simSeason(L,team,me,0,'scorer');
 for(const p of roster)assert.equal(p.realMpg,snapshot.get(p.id),
   p.name+' original realMpg restored after first year');
 career.simSeason(L,team,me,0,'balanced');
 for(const p of roster)assert.equal(p.realMpg,snapshot.get(p.id),
   p.name+' original realMpg restored after repeated season');
});

test('swapping roles or replaying a season cannot stack usage tendency boosts',()=>{
 const p=HL.createPlayer({name:'Role Audit',pos:'PG',age:22,height:75,ovr:82,
   arch:'twoway',real:false,season:2026});
 const base=HL.completeTendencies(p);
 career.customizeRole(p,'scorer');
 const first=p.tend.usage;
 career.customizeRole(p,'scorer');
 assert.equal(p.tend.usage,first,'role bonuses do not stack each time a mode is selected');
 career.customizeRole(p,'balanced');
 assert.equal(p.tend.usage,base.usage,'switching back to balanced restores the natural role');
});

test('interactive NBA campaign pauses at live third-quarter scores and applies real tactics',async()=>{
 HL.RNG.setSeed(1801);
 const L=await career.leagueFor(2026),club=L.teams[0];
 const donor=HL.League.teamPlayers(club.id).sort((a,b)=>b.ovr-a.ovr)[0];
 const me=HL.createPlayer({name:'Live Decision Test',pos:'PG',age:25,height:75,ovr:88,
  arch:'scorer',real:false,season:2026});
 me.id=999999;me.teamId=club.id;me.attrs={...donor.attrs};
 me.ovr=HL.computeOvr(me.attrs,me.pos);
 const original=HL.GameNights;
 const choices=[];
 HL.GameNights={
  PLANS:{
   takeover:{title:'Call your own number',pace:62,focus:'star',defense:'man',crash:52,usage:1.27,wear:2},
   lockdown:{title:'Win with stops',pace:31,focus:'balanced',defense:'switch',crash:73,usage:.95,wear:1}
  },
  apply(team,star,id,record){
   const plan=this.PLANS[id]||this.PLANS.takeover;
   Object.assign(team.strategy,{pace:plan.pace,focus:plan.focus,defense:plan.defense,
     crash:plan.crash,usageLock:{[star.id]:plan.usage}});
   if(record){record.title=plan.title;record.wear=plan.wear;}
   return plan;
  },
  prompt:async context=>{
   choices.push(context);
   return context.type==='game-night-adjustment'?'lockdown':'takeover';
  }
 };
 try{
  const result=await career.simSeasonInteractive(L,club,me,0,'scorer');
  const pre=choices.filter(x=>x.type==='game-night');
  const live=choices.filter(x=>x.type==='game-night-adjustment');
  assert.equal(pre.length,4,'four featured game-night setups');
  assert.equal(live.length,4,'live third-quarter decisions in all four featured games');
  assert.ok(live.every(x=>Number.isFinite(x.ours)&&Number.isFinite(x.theirs)));
  assert.ok(result.gameNights.every(x=>x.adjustment&&x.adjustment.title==='Win with stops'));
  assert.ok(result.gameNights.every(x=>x.points>0&&x.allowed>0));
  assert.ok(Number.isFinite(result.ppg));
  assert.equal(result.w+result.l,L.games);
 } finally {
  HL.GameNights=original;
 }
});
