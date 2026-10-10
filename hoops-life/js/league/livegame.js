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
 function apply(game,s,c){
  if(c.kind==='action')return game.command(s.userTeamId,c.action,c.values);
  return c.kind==='player'?game.playerControl(s.pid,c.values):game.control(s.userTeamId,c.values);
 }
 function replay(s,target){
  const game=HL.createGame(s.home,s.away,s.rules,{pbp:true,season:s.season}),commands=new Map();
  for(const c of s.commands){if(!commands.has(c.at))commands.set(c.at,[]);commands.get(c.at).push(c);}
  let steps=0,next;
  while(steps<target){
   for(const c of commands.get(steps)||[])apply(game,s,c);
   next=game.step();
   if(next.done)return {snapshot:game.snapshot(),result:next.value,steps,seed:HL.RNG.getSeed(),game};
   steps++;
  }
  for(const c of commands.get(steps)||[])apply(game,s,c);
  return {snapshot:game.snapshot(),steps,seed:HL.RNG.getSeed(),game};
 }
 function isolated(s,target){const outer=HL.RNG.getSeed();try{HL.RNG.setSeed(s.seed);return replay(s,target);}finally{HL.RNG.setSeed(outer);}}
 function view(L){const s=L.liveGame;if(!s)return null;if(s.committed)return {...s.result,finished:true,period:4+s.result.ot,clock:'0:00',seconds:0,lineups:s.finalLineups||{},out:s.finalOut||[],tactics:s.finalTactics||{},roster:s.finalRoster||{}};return isolated(s,s.steps).snapshot;}
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
 function act(L,kind,values={}){
  if(!active(L))return fail('This game is not awaiting decisions.');
  const s=L.liveGame;
  if(!values||typeof values!=='object'||Array.isArray(values))return fail('Choose a valid game decision.');
  if(s.role==='player'&&(kind!=='play'||values.pid!==s.pid))return fail('You can call a play involving yourself; the coach controls lineups, matchups, timeouts and team talks.');
  const outer=HL.RNG.getSeed();
  let r;
  try{HL.RNG.setSeed(s.seed);const current=replay(s,s.steps);r=current.game.command(s.userTeamId,kind,values);}finally{HL.RNG.setSeed(outer);}
  if(!r.ok)return r;
  s.commands.push({at:s.steps,kind:'action',action:kind,values:copy(values)});
  return {ok:true,response:kind==='play'?'Your call is queued for the next possession your team has.':kind==='lineup'?'This five is on the floor; fatigue, injuries and foul-outs still matter.':kind==='timeout'?'Both teams recover during the stoppage. Your timeout inventory has decreased.':kind==='huddle'?'Your exact words are recorded. The players will respond to the tone and their personalities.':'Your decision is applied.'};
 }
 function step(L,count=1){
  if(!active(L))return fail('There is no active game to continue.');if(!Number.isInteger(count)||count<1||count>100)return fail('Advance 1–100 possessions at a time.');
  return advance(L,L.liveGame.steps+count);
 }
 function advance(L,target){const s=L.liveGame,r=isolated(s,target);s.steps=r.steps;if(r.result){s.result=r.result;s.finalLineups=r.snapshot.lineups;s.finalOut=r.snapshot.out;s.finalTactics=r.snapshot.tactics;s.finalRoster=r.snapshot.roster;s.finalSeed=r.seed;s.committed=true;HL.RNG.setSeed(r.seed);HL.League.simDay();
   if(s.commands.length&&HL.News)cover(L,s);
  }return {ok:true,finished:s.committed,snapshot:r.snapshot};}
 function cover(L,s){
  const t=L.teams.find(t=>t.id===s.userTeamId),p=s.pid!=null?L.players[s.pid]:null;
  const side=[s.result.home,s.result.away].find(x=>x.teamId===t.id),other=side===s.result.home?s.result.away:s.result.home,won=side.score>other.score,opponent=L.teams.find(t=>t.id===other.teamId);
  const events=s.result.events.tactical||[],plays=events.filter(e=>e.kind==='play'&&e.resolved&&!e.cancelled),cancelled=events.filter(e=>e.kind==='play'&&e.cancelled),timeouts=events.filter(e=>e.kind==='timeout'),lineups=events.filter(e=>e.kind==='lineup'),talk=events.filter(e=>e.kind==='huddle').at(-1),match=events.filter(e=>e.kind==='matchup'&&e.active).at(-1);
  const actor=p||L.players[plays.at(-1)?.pid]||L.players[lineups.at(-1)?.pids?.[0]]||Object.keys(side.box).map(id=>L.players[id]).filter(Boolean).sort((a,b)=>(side.box[b.id].pts||0)-(side.box[a.id].pts||0))[0];
  const b=side.box[actor?.id]||{},facts=[];
  if(plays.length)facts.push(`${plays.map(e=>`${e.name}'s ${e.label.toLowerCase()} (${e.points||0} points on that possession${e.offensiveRebound?', with the offense retaining the ball':''})`).join('; ')}.`);
  if(cancelled.length)facts.push(`${cancelled.length} play call${cancelled.length===1?' was':'s were'} waved off or replaced.`);
  if(lineups.length)facts.push(`The coach chose ${lineups.length} lineup${lineups.length===1?'':'s'}, most recently ${lineups.at(-1).names.join(', ')}.`);
  if(timeouts.length)facts.push(`${timeouts.length} timeout${timeouts.length===1?' was':'s were'} used; each stoppage gave both teams a short recovery.`);
  if(match){const d=L.players[match.pid],o=L.players[match.targetId],ob=other.box[o.id]||{};facts.push(`${d.name} took ${o.name} with ${match.pressure} coverage. ${o.name} finished with ${ob.pts||0} points on ${ob.fgm||0}-for-${ob.fga||0} shooting; the assignment was active only while both played.`);}
  if(talk)facts.push(`The team heard: “${talk.text}” (${talk.intent}).`);
  if(actor)facts.push(`${actor.name}: ${b.pts||0} points, ${(b.orb||0)+(b.drb||0)} rebounds, ${b.ast||0} assists in ${(b.min||0).toFixed(1)} minutes${(b.min||0)===0?' (did not play)':''}.`);
  const choices=s.commands.filter(c=>c.kind!=='action').at(-1);
  if(!facts.length&&choices)facts.push(`The ${s.role==='player'?'personal approach':'team plan'} changed: ${Object.entries(choices.values).map(([k,v])=>`${k} ${v}`).join(', ')}.`);
  const quote=HL.PublicVoices?.live?HL.PublicVoices.live(L,actor,{box:b,opponent:opponent.name,teamId:t.id,won,plays,talk,margin:side.score-other.score,benchContributed:Object.values(side.box).some(x=>!x.gs&&(x.min>0)&&((x.pts||0)+(x.ast||0)+(x.orb||0)+(x.drb||0)>0))}):(b.min||0)===0?'I stayed ready. I wanted a chance to help out there.':won?'We kept trusting each other. Good team win.':'We did not execute well enough. We need to watch it back.';
  const era=HL.mediaEra?HL.mediaEra(L):HL.eraForSeason(s.season),reactions=[{voice:{outlet:actor?`${actor.name}, postgame`:`${t.city} bench`,kind:'player'},format:era==='modern'?'social':'print',likes:0,reposts:0,text:quote}];
  if(lineups.length){
    const bench=(s.finalRoster?.[t.id]||[]).filter(x=>x.targetMinutes>=24&&(side.box[x.pid]?.min||0)<x.targetMinutes*.4&&!x.out).sort((a,b)=>b.targetMinutes-a.targetMinutes)[0];
    if(bench){const benched=L.players[bench.pid],minutes=side.box[bench.pid]?.min||0;
      const words=[`I played ${minutes.toFixed(1)} minutes. I want to understand the plan for me.`,`I will stay ready, but I need a conversation about this role.`,`I am glad to support the guys. I also want a chance to contribute.`];
      const text=HL.PublicVoices?.pick?HL.PublicVoices.pick(L,`live:bench:${benched.id}`,words):words[0];
      reactions.push({voice:{outlet:`${benched.name}, postgame`,kind:'player',pid:benched.id},format:era==='modern'?'social':'print',likes:0,reposts:0,text});
    }
  }
  reactions.push({voice:{outlet:`${t.city} beat`,kind:'beat'},format:era==='modern'?'social':'print',likes:0,reposts:0,text:match?`The ${match.pressure} assignment on ${L.players[match.targetId].name} is worth reviewing on film. His whole-game total does not isolate the effect of that matchup.`:plays.length?`${plays.length} called possession${plays.length===1?'':'s'} produced ${plays.reduce((n,e)=>n+(e.points||0),0)} points. That is a small sample, not proof that one play decided the game.`:`The rotation tells the story: ${actor?.name||t.name} played ${(b.min||0).toFixed(1)} minutes as the ${t.name} ${won?'won':'lost'}.`});
  const story=HL.News.push(L,{type:'game',key:'live.game',importance:2,gid:s.gid,headline:plays.length?`${t.name} ${won?'win':'lose'} after putting ${plays.at(-1).label.toLowerCase()} to the test`:`${t.name} ${won?'beat':'fall to'} ${opponent.name}: decisions meet the final score`,body:`${t.name} ${side.score}, ${opponent.name} ${other.score}. ${facts.join(' ')}`,playerIds:actor?[actor.id]:[],teamIds:[t.id,opponent.id],reactions});
  story.season=s.season;story.day=s.day;story.phase='regular';
  if(HL.World?.onLiveGame)HL.World.onLiveGame(L,s,{actorId:actor?.id,quote,won,plays,lineups,talk,side});
 }
 function finish(L){if(L.liveGame?.committed)return {ok:true,finished:true};if(!active(L))return fail('There is no active game to finish.');return advance(L,2000);}
 return {start,view,decide,act,step,finish,active};
})();
