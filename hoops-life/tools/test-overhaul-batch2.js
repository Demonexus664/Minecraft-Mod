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
 'return { __overhaul2:{leagueFor,simSeason,customizeRole,finishAgenda,rememberRival,rivalryView,ROLES},open:()=>{st=null;cache=null;render();}'),
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
