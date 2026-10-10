// A restrained interactive career-game layer; uses the same real possession
// generator, commands, rosters, stats and NBA era rules as ordinary sim games.
window.HL=window.HL||{};
HL.SkillSpotlight=(function(){
 const esc=x=>HL.UI?.esc?HL.UI.esc(x):String(x??'');
 const clamp=(v,a=0,b=100)=>Math.max(a,Math.min(b,v));
 const CHOICES={
  takeover:{title:'Take Over',sub:'Demand the next touches, chase your own shot and accept extra offensive pressure.',
   focus:'star',pace:69,defense:'man',delta:{usage:17,shotHunt:21,passFirst:-12,iso:15},intent:'challenge',
   talk:'I can create. Get me space and let me attack the matchup.'},
  playmaker:{title:'Trust the Pass',sub:'Run ball screens and find teammates. More ball movement, fewer forced jumpers.',
   focus:'motion',pace:60,defense:'man',delta:{usage:3,passFirst:22,moveBall:18,shotHunt:-13},intent:'focus',
   talk:'Trust the next pass. Let us execute the right read.'},
  lockdown:{title:'Lock In',sub:'Take the hard defensive assignment, protect the paint or perimeter, and sacrifice some touches.',
   focus:'balanced',pace:49,defense:'switch',delta:{usage:-12,contest:18,effort:15,gamble:-7},intent:'accountability',
   talk:'I will take the toughest defensive job. Somebody help on the glass.'},
  control:{title:'Control the Tempo',sub:'Slow the game, value each possession and avoid needless risks. Less volume, more patience.',
   focus:'balanced',pace:44,defense:'man',delta:{usage:-4,passFirst:9,shotHunt:-8,riskyPass:-13},intent:'calm',
   talk:'No panic. We have enough time to get the right look.'}
 };
 function apply(game,teamId,meId,id,baseline){
  const c=CHOICES[id]||CHOICES.control;
  const strategy=game.control(teamId,{focus:c.focus,pace:c.pace,defense:c.defense});
  const tend={};
  for(const [k,delta]of Object.entries(c.delta))tend[k]=clamp((baseline[k]??50)+delta);
  const player=game.playerControl(meId,tend);
  const speech=game.command(teamId,'huddle',{intent:c.intent,text:c.talk});
  return {id,title:c.title,strategy,player,speech:speech.ok};
 }
 async function choose(snap,details){
  if(typeof document==='undefined')return 'control';
  return new Promise(resolve=>{
   const surface=document.createElement('div');surface.className='spotlight-overlay';
   surface.setAttribute('role','dialog');surface.setAttribute('aria-modal','true');
   const my=snap.home.teamId===details.teamId?snap.home:snap.away,
     rival=snap.home.teamId===details.teamId?snap.away:snap.home;
   surface.innerHTML='<section class="spotlight-stage">'+
    '<div class="spotlight-top"><span>SKILL DRAFT · LIVE HALFTIME</span><strong>GAME '+details.gameNo+
    ' · '+details.season+'</strong></div>'+
    '<div class="spotlight-moment"><div class="caps">THE LOCKER ROOM</div>'+
    '<h2>YOUR NEXT MOVE?</h2><div class="spotlight-score"><div><small>YOUR TEAM</small><b>'+my.score+
    '</b></div><strong>HALF</strong><div><small>'+esc(details.opponent)+'</small><b>'+rival.score+
    '</b></div></div><p>'+ (my.score<rival.score?'You are trailing by '+(rival.score-my.score)+
      '. The coach looks at you. How do you answer?':my.score>rival.score?
      'You lead by '+(my.score-rival.score)+'. Keeping control matters as much as building the lead.':
      'The score is tied. One adjustment may decide the second half.')+'</p></div>'+
    '<div class="spotlight-choices">'+Object.entries(CHOICES).map(([id,c])=>
      '<button data-spotlight-choice="'+id+'"><span>LIVE COACHING DECISION</span><strong>'+
      esc(c.title)+'</strong><p>'+esc(c.sub)+'</p><small>Changes possession strategy, tendencies and team huddle.</small></button>').join('')+
    '</div><p class="t3 sm">Results are not scripted. Your choice changes the second-half possession engine, and the same stats determine real awards and wins.</p></section>';
   document.body.appendChild(surface);surface.querySelectorAll('[data-spotlight-choice]').forEach(b=>
     b.onclick=()=>{surface.remove();resolve(b.dataset.spotlightChoice);});
   surface.querySelector('[data-spotlight-choice]')?.focus();
   HL.FX?.sfx?.clutch?.();
  });
 }
 async function play(spec){
  const game=HL.createGame(spec.home,spec.away,spec.rules,{season:spec.season});
  let step,half=null;
  // Simulate actual possessions until the third period begins.
  for(let i=0;i<15000;i++){
   step=game.step();
   if(step.done)break;
   const snapshot=game.snapshot();
   if(snapshot.period>=3){half=snapshot;break;}
  }
  let decision=null;
  if(half&&!step.done){
   const choice=await choose(half,spec);
   const player=(spec.home.players.concat(spec.away.players)).find(p=>p.id===spec.meId);
   decision=apply(game,spec.teamId,spec.meId,choice,{...(player?.tend||{})});
   decision.before={own:(half.home.teamId===spec.teamId?half.home:half.away).score,
     opponent:(half.home.teamId===spec.teamId?half.away:half.home).score};
  }
  for(let i=0;i<25000&&!step?.done;i++)step=game.step();
  if(!step?.done)throw Error('Live game exceeded the safe simulation step limit');
  const result=step.value;
  result._spotlight=decision?{...decision,game:spec.gameNo,opponent:spec.opponent,
   after:{own:(result.home.teamId===spec.teamId?result.home:result.away).score,
    opponent:(result.home.teamId===spec.teamId?result.away:result.home).score}}:null;
  return result;
 }
 return {CHOICES,apply,play,choose};
})();