// Persistent intentions and deterministic replay of the shared possession simulator.
window.HL=window.HL||{};
HL.LiveGame=(function(){
 const copy=x=>JSON.parse(JSON.stringify(x)),fail=reason=>({ok:false,reason});
 const active=L=>!!L.liveGame&&!L.liveGame.committed;
 const personal=new Set(['usage','three','mid','drive','post','passFirst','gamble','crash','effort','foulAggr','drawFoul']);
 function start(L){
  if(active(L))return {ok:true};
  if((L.mode==='career'||L.settings.role==='player')&&!L.career)return fail('The Career identity is missing. Restore a valid Career save before entering a game.');
  if(L.mode&&!['franchise','career'].includes(L.mode))return fail('Live decisions belong to Franchise or Player Career.');
  if(L.phase!=='regular')return fail('Live decisions currently cover the regular season. Postseason integration is still in development.');
  if(L.career&&(L.career.retired||L.players[L.career.pid].teamId==null))return fail('A playing contract is required to enter a live game.');
  const target=L.schedule.find(g=>!g.res&&g.day>=L.day&&(g.home===L.userTeamId||g.away===L.userTeamId));if(!target)return fail('There is no remaining scheduled game for your team.');
  while(L.day<target.day&&L.phase==='regular')HL.League.simDay();
  const prepared=HL.League.prepareLiveFixture(target.gid);if(!prepared.ok)return prepared;
  L.liveGame={version:1,gid:target.gid,season:L.season,day:L.day,userTeamId:L.userTeamId,pid:L.career?.pid??null,role:L.career?'player':'coach',home:copy(prepared.home),away:copy(prepared.away),rules:copy(prepared.rules),seed:HL.RNG.getSeed(),steps:0,commands:[],committed:false};
  return {ok:true};
 }
 function replay(s,target){
  const game=HL.createGame(s.home,s.away,s.rules,{pbp:true}),commands=new Map();
  for(const c of s.commands){if(!commands.has(c.at))commands.set(c.at,[]);commands.get(c.at).push(c);}
  let steps=0,next;while(steps<target){for(const c of commands.get(steps)||[])c.kind==='player'?game.playerControl(s.pid,c.values):game.control(s.userTeamId,c.values);next=game.step();if(next.done)return {snapshot:game.snapshot(),result:next.value,steps,seed:HL.RNG.getSeed()};steps++;}
  // Commands at the current checkpoint take effect before the next possession.
  const snapshot=game.snapshot();return {snapshot,steps,seed:HL.RNG.getSeed()};
 }
 function isolated(s,target){const outer=HL.RNG.getSeed();try{HL.RNG.setSeed(s.seed);return replay(s,target);}finally{HL.RNG.setSeed(outer);}}
 function view(L){const s=L.liveGame;if(!s)return null;if(s.committed)return {...s.result,finished:true,period:4+s.result.ot,clock:'0:00',seconds:0,lineups:s.finalLineups||{},out:s.finalOut||[]};return isolated(s,s.steps).snapshot;}
 function decide(L,values){
  if(!active(L))return fail('This game is not awaiting decisions.');
  const s=L.liveGame;if(!values||typeof values!=='object'||Array.isArray(values)||!Object.keys(values).length)return fail('Choose a game approach.');
  for(const[key,v]of Object.entries(values)){
   if(s.role==='player'){if(!personal.has(key)||!Number.isInteger(v)||v<0||v>100)return fail('You can change only your own valid playing intentions.');}
   else if(['pace','crash'].includes(key)){if(!Number.isInteger(v)||v<0||v>100)return fail('Choose a value between 0 and 100.');}
   else if(key==='focus'){if(!['balanced','inside','perimeter','star','motion'].includes(v))return fail('Choose a supported offensive focus.');}
   else if(key==='defense'){if(!['man','switch','drop','zone','press'].includes(v))return fail('Choose a supported defensive coverage.');}
   else return fail('That control is outside your game role.');
  }
  s.commands.push({at:s.steps,kind:s.role==='player'?'player':'coach',values:copy(values)});return {ok:true};
 }
 function step(L,count=1){
  if(!active(L))return fail('There is no active game to continue.');if(!Number.isInteger(count)||count<1||count>100)return fail('Advance 1–100 possessions at a time.');
  return advance(L,L.liveGame.steps+count);
 }
 function advance(L,target){const s=L.liveGame,r=isolated(s,target);s.steps=r.steps;if(r.result){s.result=r.result;s.finalLineups=r.snapshot.lineups;s.finalOut=r.snapshot.out;s.finalSeed=r.seed;s.committed=true;HL.RNG.setSeed(r.seed);HL.League.simDay();
   if(s.commands.length&&HL.News){const p=s.pid!=null?L.players[s.pid]:null,t=L.teams[s.userTeamId],last=s.commands.at(-1),description=Object.entries(last.values).map(([k,v])=>`${({focus:'offensive focus',defense:'defensive coverage',three:'three-point preference',usage:'shot involvement',crash:'rebounding aggression'}[k]||k)}: ${v}`).join(', '),side=[s.result.home,s.result.away].find(x=>x.teamId===t.id),other=side===s.result.home?s.result.away:s.result.home;
    const story=HL.News.push(L,{type:'game',key:'live.game',importance:2,headline:`${p?p.name:t.name}: decisions meet the final score`,body:`${p?p.name:t.name} chose ${description}. The actual game ends ${side.score}–${other.score}. Choices influenced possessions; they did not guarantee the result.`,playerIds:p?[p.id]:[],teamIds:[t.id],reactions:[HL.News.react(L,'beat','live.game',{team:t.name},['The {team} put the plan to the test. The final score is now part of the record.'],t,{eraBuiltins:['The tactical choices of the {team} have now met their test on the court.']})].filter(Boolean)});
    story.season=s.season;story.day=s.day;story.phase='regular';
   }
  }return {ok:true,finished:s.committed,snapshot:r.snapshot};}
 function finish(L){if(L.liveGame?.committed)return {ok:true,finished:true};if(!active(L))return fail('There is no active game to finish.');return advance(L,2000);}
 return {start,view,decide,step,finish,active};
})();
