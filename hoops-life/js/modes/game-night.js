// Four light-touch, BitLife-style choices INSIDE a Skill Draft season.
// The user picks the approach before marquee game nights. Every choice changes
// actual sim strategy, possessions and recorded results, not an OVR multiplier.
window.HL=window.HL||{};
HL.GameNights=(function(){
 const esc=x=>HL.UI?.esc?HL.UI.esc(x):String(x??'').replace(/[&<>"']/g,c=>(
  {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const PLANS={
  trust:{title:'Trust the system',slogan:'No panic, execute the original plan',
   flavor:'Run balanced sets. Let your teammates find their spots.',
   payoff:'Steady pace, balanced shot selection',risk:'No tactical surprise',
   pace:50,focus:'balanced',defense:'man',crash:50,usage:1,wear:0},
  takeover:{title:'Call your own number',slogan:'The ball is in your hands',
   flavor:'Make yourself the first option and demand the last shot.',
   payoff:'More of your own touches',risk:'More isolation pressure and fatigue',
   pace:62,focus:'star',defense:'man',crash:52,usage:1.27,wear:2},
  run:{title:'Push the break',slogan:'Turn every rebound into a sprint',
   flavor:'Press, run hard, and attack before the defense gets set.',
   payoff:'Faster tempo and transition chances',risk:'More volatile possessions and workload',
   pace:91,focus:'inside',defense:'press',crash:66,usage:1.07,wear:3},
  share:{title:'Get everyone involved',slogan:'Move it until somebody is open',
   flavor:'Create through teammates and make the extra pass.',
   payoff:'Ball movement and assisted looks',risk:'Fewer self-created shots',
   pace:57,focus:'motion',defense:'switch',crash:58,usage:.86,wear:0},
  lockdown:{title:'Win with stops',slogan:'The scoreboard starts at our rim',
   flavor:'Switch coverages, slow down and rebound as a unit.',
   payoff:'Controlled tempo and defensive coverage',risk:'Slower scoring opportunities',
   pace:31,focus:'balanced',defense:'switch',crash:73,usage:.95,wear:1}
 };
 function apply(team,me,id,record=null){
  const p=PLANS[id]||PLANS.trust,strategy=team.strategy;
  Object.assign(strategy,{pace:p.pace,focus:p.focus,defense:p.defense,crash:p.crash});
  strategy.usageLock={...(strategy.usageLock||{}),[me.id]:p.usage};
  if(record){record.id=id;record.title=p.title;record.wear=p.wear;}
  return p;
 }
 function scenario(context){
  const {game,total,record,opp}=context,played=record.w+record.l;
  const percentage=played?record.w/played:.5;
  const elite=(opp?.players||[]).filter(p=>p.ovr>=88).length;
  if(game===1)return {title:'THE FIRST NIGHT',sub:'The debut sets the tone',
    story:'The cameras are following every warmup. A new face is walking onto an NBA court for the first time.'};
  if(game<=21&&percentage<.48)return {title:'THE LOCKER ROOM IS RESTLESS',sub:'Change the early narrative',
    story:'The standings are uncomfortable. The coach needs a decision before another tough stretch.'};
  if(game<=21)return {title:'THE LEAGUE HAS NOTICED',sub:'Protect the early momentum',
    story:'The record is building expectations. Opponents have begun scouting your favorite possessions.'};
  if(game<=41)return {title:'MIDSEASON ADJUSTMENT',sub:elite?'This opponent has multiple superstar threats':'The second half begins now',
    story:elite?'Their leading options are difficult to guard. Your staff has one chance to change the matchup plan.':
      'The race is tightening. Choose the identity that takes you toward the postseason.'};
  return {title:percentage>=.6?'CHAMPIONSHIP EXPECTATIONS':'THE PLAYOFF PUSH',
    sub:'Every late-season possession has consequences',
    story:percentage>=.6?'The city expects a deep run. The next tactical choice will reveal whether you are really ready.':
      'The margin for error is getting smaller. The approach you choose could determine the playoff picture.'};
 }
 function prompt(context){
  if(typeof document==='undefined'||!document.body)return Promise.resolve('trust');
  const {game,total,opp,team,record,player,year}=context,beat=scenario(context);
  const ref=document.createElement('div');
  ref.className='game-night-overlay';ref.setAttribute('role','dialog');
  ref.setAttribute('aria-modal','true');ref.setAttribute('aria-label','Basketball game-night decision');
  const prior=document.activeElement,oldScroll=document.body.style.overflow;
  const top=(opp?.players||[]).slice().sort((a,b)=>b.ovr-a.ovr).slice(0,3);
  ref.innerHTML='<div class="game-night-board">'+
   '<header><div class="game-night-eyebrow">CAREER DECISION · GAME '+game+' OF '+total+'</div>'+
   '<button data-night-skip class="btn small">AUTO-COACH FROM HERE</button></header>'+
   '<div class="game-night-spotlight"><div class="game-night-jersey">'+
   '<div class="game-night-number">'+esc(player?.number||'00')+'</div><div class="game-night-captain">'+
   esc(player?.name||'Your player')+'</div></div><div class="game-night-story">'+
   '<div class="caps">'+(year>=2010?'BROADCAST · LIVE PRE-GAME':'COURTSIDE REPORT · GAME NIGHT')+'</div>'+
   '<h2>'+esc(beat.title)+'</h2>'+
   '<p class="game-night-dek">'+esc(beat.sub)+'</p><p>'+esc(beat.story)+'</p>'+
   '<p>The '+esc(team?.name||'team')+' are '+record.w+'-'+record.l+
   '. Tonight: '+esc(opp?.city||'')+' '+esc(opp?.name||'the visitors')+'.</p>'+
   '<div class="game-night-opposition"><b>SCOUTING TAPE</b><span>'+
   (top.length?top.map(p=>esc(p.name)+' · '+p.ovr+' OVR').join(' / '):
    'The opponent is preparing its regular rotation.')+'</span></div>'+
   '</div></div><div class="caps">CHOOSE YOUR GAME PLAN · CHANGES THE NEXT 20 GAMES</div>'+
   '<div class="game-night-options">'+Object.entries(PLANS).map(([id,p])=>
    '<button class="game-night-choice" data-game-night="'+id+'"><span class="game-night-tag">'+
    esc(p.slogan)+'</span><strong>'+esc(p.title)+'</strong><p>'+esc(p.flavor)+
    '</p><div class="game-night-effect"><span>'+esc(p.payoff)+'</span><small>'+
    esc(p.risk)+'</small></div></button>').join('')+'</div>'+
   '<footer><span>Every outcome comes from the actual possession simulator.</span>'+
   '<button data-night-default class="btn small">Stay balanced</button></footer></div>';
  document.body.appendChild(ref);document.body.style.overflow='hidden';
  HL.FX?.sfx?.arena?.('clutch');
  return new Promise(resolve=>{
   let finished=false;
   const key=e=>{if(e.key==='Escape'){e.preventDefault();finish('trust');}};
   function finish(id){
    if(finished)return;finished=true;document.removeEventListener('keydown',key);
    document.body.style.overflow=oldScroll;ref.remove();
    if(prior?.isConnected&&prior.focus)prior.focus();
    resolve(id==='trust:automatic'?id:PLANS[id]?id:'trust');
   }
   document.addEventListener('keydown',key);
   ref.querySelectorAll('[data-game-night]').forEach(el=>el.onclick=()=>finish(el.dataset.gameNight));
   ref.querySelector('[data-night-default]').onclick=()=>finish('trust');
   ref.querySelector('[data-night-skip]').onclick=()=>finish('trust:automatic');
   ref.querySelector('[data-game-night]')?.focus();
  });
 }
 function recap(decisions){
  if(!decisions?.length)return '';
  return '<section class="block game-night-recap"><header><h3>GAME NIGHT DECISIONS</h3>'+
   '<span class="ml-auto t3 sm">Choices that changed actual team strategy</span></header>'+
   '<div class="body"><div class="game-night-recap-grid">'+decisions.map(d=>
    '<div class="game-night-recap-item '+(d.win?'won':'lost')+'">'+
    '<div class="caps">GAME '+d.game+' · '+esc(d.opponent)+'</div>'+
    '<strong>'+esc(d.title)+'</strong><p>'+esc(d.win?'WON':'LOST')+' '+d.points+'-'+d.allowed+
    ' · Team '+d.record+'</p><small>Chosen adjustments applied to real possessions, not player OVR.</small></div>').join('')+
   '</div></div></section>';
 }
 return {PLANS,apply,prompt,recap,scenario};
})();