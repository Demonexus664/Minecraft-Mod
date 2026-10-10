// Earned Player Career state and decisions, resolved against the shared real league.
window.HL = window.HL || {};
HL.Career = (function () {
  const fail=reason=>({ok:false,reason}),clamp=v=>HL.clamp(Math.round(v),0,100);
  const me=L=>L.players[L.career.pid];
  const defaults={name:'Your Player',hometown:'Chicago',nationality:'USA',age:19,pos:'SG',arch:'scorer',secondary:'twoway',height:78,weight:205,wingspan:81,hand:'right',number:7,personality:'driven',route:'college',season:2025,seed:11};
  const PERSONALITIES={driven:{workEthic:85,ego:55,loyalty:60},quiet:{workEthic:70,ego:25,loyalty:75},showman:{workEthic:60,ego:85,loyalty:40}};
  function validate(input) {
    const c={...defaults,...input};
    for(const k of ['name','hometown','nationality'])if(typeof c[k]!=='string'||!c[k].trim()||c[k].length>60)return fail('Give your player a name, hometown and nationality of at most 60 characters.');
    for(const[k,lo,hi]of[['age',19,22],['height',72,90],['weight',160,340],['wingspan',c.height,c.height+10],['number',0,99],['season',1946,2025],['seed',0,4294967295]])if(!Number.isInteger(c[k])||c[k]<lo||c[k]>hi)return fail(`Choose a valid ${k} (${lo}–${hi}).`);
    if(!HL.POSITIONS.includes(c.pos)||!HL.ARCHETYPES[c.arch]||!HL.ARCHETYPES[c.secondary]||!PERSONALITIES[c.personality]||!['left','right'].includes(c.hand)||!['college','international'].includes(c.route))return fail('Choose a supported position, archetype, personality, hand and route.');
    return {ok:true,config:c};
  }
  function preview(input={}) {
    const v=validate(input);if(!v.ok)return v;const c=v.config,seed=HL.RNG.getSeed();
    try{
      HL.RNG.setSeed(c.seed);
      const attrs=HL.buildAttributes(66+(c.age-19),c.pos,c.height,`${c.arch}+${c.secondary}`);
      attrs.str=HL.clamp(attrs.str+Math.round((c.weight-205)/14),25,90);
      attrs.speed=HL.clamp(attrs.speed-Math.round(Math.max(0,c.weight-205)/18),25,90);
      attrs.block=HL.clamp(attrs.block+Math.round((c.wingspan-c.height-3)*1.1),25,90);
      attrs.perD=HL.clamp(attrs.perD+Math.round((c.wingspan-c.height-3)*.4),25,90);
      return {ok:true,player:{...c,attrs,ovr:HL.computeOvr(attrs,c.pos)}};
    }finally{HL.RNG.setSeed(seed);}
  }
  function log(L,kind,text,publicEvent=false) {
    const entry={season:L.season,day:L.day,kind,text,public:publicEvent};
    L.career.timeline.push(entry);L.career.timeline=L.career.timeline.slice(-1200);return entry;
  }
  function quote(L,headline,body,spoken,key='career.life') {
    const p=me(L),t=L.teams.find(t=>t.id===(p.teamId??L.userTeamId));
    if(!HL.News||!t)return;
    return HL.News.push(L,{type:'career',key,importance:2,headline,body,playerIds:[p.id],teamIds:[t.id],
      reactions:[{voice:{outlet:`${p.name}, player`,kind:'player'},format:'print',likes:0,reposts:0,text:spoken},
        HL.News.react(L,'beat',key,{player:p.name,team:t.name},['{player} gives the {team} another story to manage. Results will decide what comes next.'],t,{eraBuiltins:['The words and actions of {player} are being followed closely by observers of the {team}.']})].filter(Boolean)});
  }
  function role(L) {
    const c=L.career,p=me(L);if(p.teamId==null||c.retired)return;
    const peers=Object.values(L.players).filter(q=>!q.retired&&q.teamId===p.teamId&&q.id!==p.id);
    const rank=peers.filter(q=>q.ovr>p.ovr).length;
    const mins=[34,32,30,28,25,22,18,15,12,9,7,5][Math.min(rank,11)];
    p.realMpg=HL.clamp(mins+Math.floor((c.people.coach.trust-50)/15),3,38);p.minutesLock=true;
    c.role=p.realMpg>=28?'Starter':p.realMpg>=14?'Rotation':'Development';
  }
  function create(input) {
    const v=preview(input);if(!v.ok)return v;const config=v.player;
    if(!HL.HISTORY_SEASONS[String(config.season)])return fail('Load the selected season before starting this career.');
    const L=HL.League.createFromSeason({seasonKey:String(config.season),seed:config.seed,settings:{history:'real',role:'player',difficulty:'pro'}});
    const p=HL.createPlayer({name:config.name.trim(),pos:config.pos,age:config.age,height:config.height,ovr:config.ovr,arch:`${config.arch}+${config.secondary}`,real:false,season:config.season});
    p.attrs={...config.attrs};p.ovr=config.ovr;p.weight=config.weight;p.wingspan=config.wingspan;p.hand=config.hand;p.number=config.number;p.yearsPro=0;p.userRosterMove=true;
    Object.assign(p.traits,PERSONALITIES[config.personality]);
    p.caps=Object.fromEntries(HL.ATTR_KEYS.map(k=>[k,Math.min(94,p.attrs[k]+(k==='dur'?0:22))]));p.potential=HL.computeOvr(p.caps,p.pos);p.tend=HL.defaultTendencies(p);
    const teams=L.teams.slice().sort((a,b)=>a.real.w/Math.max(1,a.real.w+a.real.l)-b.real.w/Math.max(1,b.real.w+b.real.l));
    const pick=HL.clamp(Math.round(42-(p.ovr-60)*2),1,teams.length*2),t=teams[(pick-1)%teams.length];
    p.teamId=t.id;p.draft={year:L.season,pick,round:pick<=teams.length?1:2,teamId:t.id};
    p.contract={amount:Math.round(Math.max(1.2,12-(pick-1)*.3)*HL.salaryScale(L.season)*1000)/1000,start:L.season,exp:L.season+(pick<=teams.length?3:1)};
    // The prospect earns a roster spot; the coach releases an end-of-bench player if needed.
    const roster=HL.League.teamPlayers(t.id).sort((a,b)=>a.ovr-b.ovr);
    if(roster.length>=15){const cut=roster[0];cut.teamId=null;L.deadCap=[...(L.deadCap||[]),{teamId:t.id,pid:cut.id,name:cut.name,amount:cut.contract.amount,start:L.season,exp:cut.contract.exp}];}
    L.players[p.id]=p;L.userTeamId=t.id;L.mode='career';
    L.career={version:1,pid:p.id,identity:{...config,attrs:undefined},energy:85,happiness:70,fame:10,reputation:50,cash:25000,earnings:0,taxes:0,possessions:[],people:{coach:{like:50,respect:50,trust:50},agent:{like:50,respect:50,trust:50},family:{like:70,respect:50,trust:50}},week:null,decisions:3,progress:{},timeline:[],watches:[],gameLog:[],seasons:[],seen:[],pendingPress:null,retired:false,role:'Development'};
    L.nextPid=HL.nextPlayerId();role(L);
    log(L,'draft',`${p.name} enters the ${L.season} league at pick ${pick} with the ${t.city} ${t.name}. ${config.route==='college'?'College':'International'} route, ${config.pos}, age ${p.age}.`,true);
    quote(L,`${t.name} welcome rookie ${p.name}`,`Pick ${pick} brings ${p.name} to ${t.city}. The coach offers an earned ${p.realMpg}-minute role, with competition still ahead.`,'I want to earn my place, one day at a time.','career.arrival');
    return {ok:true,league:L};
  }
  function refresh(L) {
    const c=L.career,key=`${L.season}:${Math.floor(L.day/7)}`;
    if(c.week!==key){c.week=key;c.decisions=3;}
  }
  function gain(L,key,credit) {
    const c=L.career,p=me(L);c.progress[key]=(c.progress[key]||0)+credit;
    if(c.progress[key]>=1&&p.attrs[key]<p.caps[key]){p.attrs[key]=Math.min(p.caps[key],p.attrs[key]+Math.floor(c.progress[key]));c.progress[key]%=1;p.ovr=HL.computeOvr(p.attrs,p.pos);log(L,'development',`${HL.ATTRS.find(a=>a.key===key).label} improves to ${p.attrs[key]} through practice and game use.`);}
  }
  function setTendencies(L,values) {
    const p=L.career&&me(L);
    if(!p||!values||typeof values!=='object'||Array.isArray(values))return fail('Choose your player’s playing style.');
    const allowed=['usage','three','mid','drive','post','passFirst','gamble','crash','effort','foulAggr','drawFoul'];
    if(Object.entries(values).some(([k,v])=>!allowed.includes(k)||!Number.isFinite(v)||v<0||v>100))return fail('Playing-style values must be numbers between 0 and 100.');
    Object.assign(p.tend,values);return {ok:true};
  }
  const ACTIONS={
    train:{label:'Skill session',group:'basketball',desc:'Build a skill gradually. Costs 15 energy and one weekly decision.'},
    film:{label:'Study film',group:'basketball',desc:'Build basketball IQ and coach trust. Costs one decision.'},
    recover:{label:'Recovery day',group:'basketball',desc:'Restore energy and happiness. Costs one decision.'},
    role:{label:'Discuss your role',group:'basketball',desc:'Ask for minutes. The coach judges trust and roster competition.'},
    trade:{label:'Request a trade',group:'basketball',desc:'Ask your agent to approach the front office. A request is not a forced move.'},
    teammate:{label:'Support a teammate',group:'people',desc:'Choose a real teammate. He remembers your support.'},
    family:{label:'Time with family',group:'life',desc:'Improve a private relationship and happiness. Costs one decision.'},
    charity:{label:'Make a donation',group:'life',desc:'Spend your own money. Local fans and the media respond.'},
    party:{label:'Night out',group:'life',desc:'Enjoy yourself, lose energy, and face attention around your next game.'},
    car:{label:'Buy a car',group:'life',desc:'A personal purchase with a real cash cost.'},
    endorsement:{label:'Discuss an endorsement',group:'media',desc:'Your agent checks your fame and reputation before an offer.'},
  };
  function act(L,key,params={}) {
    const c=L.career,p=c&&me(L);if(!c||!p||(!ACTIONS[key]&&key!=='presser'))return fail('Choose an available career action.');
    const week=`${L.season}:${Math.floor(L.day/7)}`,remaining=c.week===week?c.decisions:3;
    if(key!=='presser'&&remaining<=0)return fail('You have used your three decisions this week. Advance the calendar to make time.');
    if(['train','film','role','trade','teammate','presser'].includes(key)&&c.retired)return fail('Return to the league before making basketball decisions.');
    if(key==='train'&&(!HL.ATTR_KEYS.includes(params.focus)||params.focus==='dur'||c.energy<15||p.injury))return fail('Choose a trainable skill and recover before training while injured or exhausted.');
    if(key==='charity'&&(!Number.isFinite(params.amount)||params.amount<1||params.amount>c.cash))return fail('Choose a donation you can afford.');
    if(key==='car'&&(!Number.isFinite(params.price)||params.price<1000||params.price>c.cash))return fail('Choose a car price of at least $1,000 within your cash balance.');
    const mate=key==='teammate'&&L.players[params.pid];
    if(key==='teammate'&&(!mate||mate.id===p.id||mate.retired||mate.teamId!==p.teamId))return fail('Choose an active teammate.');
    const tones={humble:'I still have a lot to learn. I will keep working.',confident:'I will score at least 20 in our next game. Hold me to it.',deflect:'Tonight was about the team. I am keeping the next step private.'};
    if(key==='presser'&&(!c.pendingPress||!tones[params.tone]))return fail('Answer an available postgame interview.');
    refresh(L);if(key!=='presser')c.decisions--;
    let response,publicEvent=false;
    if(key==='train'){c.energy-=15;gain(L,params.focus,.35);response=`You put in a focused ${HL.ATTRS.find(a=>a.key===params.focus).label} session. Progress is earned over repeated practice.`;}
    if(key==='film'){gain(L,'iq',.35);c.people.coach.trust=clamp(c.people.coach.trust+2);response='Your preparation gets noticed. The coach trusts your attention to detail.';}
    if(key==='recover'){c.energy=clamp(c.energy+25);c.happiness=clamp(c.happiness+3);response='You make room for recovery. Energy improves; injuries still need their real recovery time.';}
    if(key==='role'){role(L);response=c.people.coach.trust<45?'Coach: “Earn the trust before asking for more minutes.”':`Coach: “Your current place in this roster supports ${p.realMpg} minutes. Keep showing me why you deserve them.”`;}
    if(key==='trade'){c.people.coach.trust=clamp(c.people.coach.trust-4);response=p.contract.exp>L.season?'Agent: “You are under contract. The club has declined a move for now; we can revisit your options when the deal expires.”':'Agent: “We can compare your offers this offseason. A request does not guarantee a destination.”';}
    if(key==='teammate'){
      L.world=L.world||{players:{},teams:{},watches:[],timeline:[]};const r=L.world.players[mate.id]||(L.world.players[mate.id]={like:50,respect:50,trust:50,memories:[],lastMeeting:null});
      r.like=clamp(r.like+4);r.trust=clamp(r.trust+3);r.memories.push({season:L.season,day:L.day,kind:'career_support',text:`${p.name} offered support as a teammate.`});r.memories=r.memories.slice(-24);mate.morale=clamp((mate.morale??70)+3);response=`${mate.name}: “I appreciate you checking in. Let us keep building this together.”`;
    }
    if(key==='family'){c.happiness=clamp(c.happiness+8);c.people.family.like=clamp(c.people.family.like+5);c.people.family.trust=clamp(c.people.family.trust+4);response='You spend time with family. They appreciate making room for them beyond basketball.';}
    if(key==='charity'){c.cash-=params.amount;c.reputation=clamp(c.reputation+3);response=`You donate $${params.amount} to a community program.`;publicEvent=true;quote(L,`${p.name} supports the community`,`${p.name} donates $${params.amount} to a community program.`,'I have an opportunity to give something back.','life.charity');}
    if(key==='party'){c.energy=clamp(c.energy-30);c.happiness=clamp(c.happiness+10);c.watches.push({kind:'party',season:L.season,resolved:false});response='A night out lifts your mood, but the attention will follow you into the next game.';publicEvent=true;quote(L,`${p.name} draws attention after a night out`,`${p.name} was seen enjoying a night out. His next actual performance will decide the follow-up, rather than the clip alone.`,'I need to be ready when the game comes.','life.party.viral');}
    if(key==='car'){c.cash-=params.price;c.possessions.push({kind:'car',price:params.price,year:L.season});c.happiness=clamp(c.happiness+4);response=`You buy a car for $${params.price}. Cash changes immediately; this first ownership model does not yet charge maintenance or depreciation.`;}
    if(key==='endorsement'){
      if(c.fame<20||c.reputation<45)response='Agent: “Brands want a stronger track record first. Earn visibility and protect your reputation.”';
      else if(c.endorsementSeason===L.season)response='Agent: “We already agreed this season’s endorsement. Deliver on it before adding another.”';
      else{const fee=Math.round(5000*HL.salaryScale(L.season)*(c.fame/10));c.cash+=fee;c.earnings+=fee;c.endorsementSeason=L.season;response=`Your agent secures a fictional local endorsement for $${fee}.`;publicEvent=true;quote(L,`${p.name} earns an endorsement`,`${p.name} agrees to a local endorsement for $${fee}. The offer reflects his current fame and reputation.`,'I want to represent the partnership well.','life.shoe_deal');}
    }
    if(key==='presser'){
      const scene=c.pendingPress;c.pendingPress=null;response=tones[params.tone];publicEvent=true;
      if(params.tone==='confident')c.watches.push({kind:'prediction',target:20,season:L.season,resolved:false});else if(params.tone==='humble')c.reputation=clamp(c.reputation+2);
      quote(L,`${p.name} addresses the next step`,`${p.name} after ${scene.pts} points in ${scene.min.toFixed(1)} minutes: “${response}”`,response,'career.presser');
    }
    log(L,key,response,publicEvent);role(L);return {ok:true,response};
  }
  function beforeDay(L) {
    if(!L.career)return;const c=L.career,p=me(L),stamp=`${L.season}:${L.day}`;
    if(c.lastDay===stamp)return;c.lastDay=stamp;refresh(L);c.energy=clamp(c.energy+6);
    p.careerFitness=HL.clamp(.94+c.energy*.0006-(c.watches.some(w=>w.kind==='party'&&!w.resolved)?.025:0),.9,1);role(L);
  }
  function afterGame(L,g,res) {
    const c=L.career;if(!c||c.retired)return;const p=me(L),side=[res.home,res.away].find(s=>s.teamId===p.teamId);if(!side)return;
    const key=`${L.season}:${g.gid}`;if(c.seen.includes(key))return;c.seen.push(key);c.seen=c.seen.slice(-600);
    const b=side.box[p.id]||{},min=b.min||0,pts=b.pts||0,opp=side===res.home?res.away:res.home;
    const income=g.playoff?0:Math.round(p.contract.amount*1e6/Math.max(1,L.games)),tax=Math.round(income*.35);c.cash+=income-tax;c.earnings+=income;c.taxes+=tax;
    c.energy=clamp(c.energy-Math.round(min*.4));
    c.gameLog.push({season:L.season,gid:g.gid,day:L.day,min,pts,reb:(b.orb||0)+(b.drb||0),ast:b.ast||0,tov:b.tov||0,won:side.score>opp.score,score:`${side.score}–${opp.score}`,opponent:opp.teamId,playoff:!!g.playoff});c.gameLog=c.gameLog.slice(-300);
    if(min>0){c.fame=clamp(c.fame+(pts>=20?2:pts>=10?1:0));c.people.coach.trust=clamp(c.people.coach.trust+((b.tov||0)>5?-2:1));gain(L,(b.tpa||0)>0?'three':'layup',.06);gain(L,'iq',.03);c.pendingPress={gid:g.gid,pts,min};}
    for(const w of c.watches){
      if(w.resolved)continue;w.resolved=true;
      if(w.kind==='prediction'){
        const success=pts>=w.target;c.reputation=clamp(c.reputation+(success?5:-7));
        quote(L,`${p.name}: prediction ${success?'delivered':'comes up short'}`,`${p.name} predicted ${w.target} points in his next game and recorded ${pts} points in ${min.toFixed(1)} minutes. ${min===0?'He did not play; the prediction was not delivered.':''}`,success?'I said it, then did the work.':'I spoke too soon. The result is what counts.','career.prediction');log(L,'prediction',`${w.target}-point prediction: ${pts} actual points. ${success?'Delivered.':'Not delivered.'}`,true);
      }else if(w.kind==='party'){
        const strong=pts>=15&&min>0;c.reputation=clamp(c.reputation+(strong?2:-3));
        quote(L,`${p.name}: the game follows the night out`,`${p.name} records ${pts} points in ${min.toFixed(1)} minutes after the night-out story. ${min===0?'He did not appear, so there is no performance to blame on the evening.':'The coverage uses the actual box score; it does not prove that the evening caused the result.'}`,strong?'I came ready to work.':'Preparation still has to come first.','life.party.hangover_game');log(L,'party_result',`After the night out: ${pts} points, ${min.toFixed(1)} minutes.`,true);
      }
    }
    role(L);
  }
  function offseason(L) {
    const c=L.career,p=me(L);if(c.seasons.some(s=>s.season===L.season))return;
    const tid=p.stats[String(L.season)]?.teamId??p.teamId??L.userTeamId,t=L.teams[tid];
    c.seasons.push({season:L.season,teamId:tid,team:`${t.city} ${t.name}`,record:`${t.w}-${t.l}`,ovr:p.ovr,stats:{...(p.stats[String(L.season)]||HL.blankStatLine())},playoffStats:{...(p.stats[L.season+'p']||HL.blankStatLine())},awards:p.careerAwards.filter(a=>a.season===L.season),series:(L.playoffs?.rounds||[]).flat().filter(s=>s.hi===tid||s.lo===tid).map(s=>({round:s.conf,opponent:s.hi===tid?s.lo:s.hi,wins:s.wins.slice(),won:s.winner===tid}))});
    log(L,'season',`${L.season} season report: ${t.name} ${t.w}-${t.l}; ${(p.stats[String(L.season)]?.pts||0)} total points.`,true);
  }
  function offers(L) {
    const c=L.career,p=c&&me(L);if(!p||c.retired||p.age>45)return [];
    if(p.teamId!=null&&!(L.phase==='offseason'&&p.contract.exp<=L.season))return [];
    const year=L.phase==='offseason'?L.season+1:L.season;
    return L.teams.slice().sort((a,b)=>a.id-b.id).filter(t=>Object.values(L.players).filter(q=>!q.retired&&q.teamId===t.id&&q.id!==p.id).length<15||t.id===p.teamId).slice(0,8).map(t=>({teamId:t.id,amount:Math.round(Math.max(1.2,HL.estimateSalary(p.ovr,p.age))*HL.salaryScale(year)*1000)/1000,years:2,year,role:Object.values(L.players).filter(q=>q.teamId===t.id&&q.ovr>p.ovr).length<5?'Starter competition':'Rotation competition'}));
  }
  function sign(L,teamId) {
    const offer=offers(L).find(o=>o.teamId===teamId);if(!offer)return fail('That contract is not available. Honor your current deal or choose a valid offer.');
    const c=L.career,p=me(L),old=p.teamId,t=L.teams[teamId];
    p.teamId=teamId;p.retired=null;p.contract={amount:offer.amount,start:offer.year,exp:offer.year+offer.years-1};L.userTeamId=teamId;c.people.coach={like:50,respect:50,trust:50};
    log(L,'contract',`${p.name} ${old===teamId?'re-signs with':'joins'} the ${t.city} ${t.name} on a ${offer.years}-year, $${offer.amount.toFixed(3)}M annual deal.`,true);
    quote(L,`${p.name} agrees to terms with ${t.name}`,`${offer.years} years at $${offer.amount.toFixed(3)}M per season; ${offer.role.toLowerCase()}.`,'I want the opportunity to earn my role.','career.contract');role(L);return {ok:true};
  }
  function retire(L) {
    const c=L.career,p=c&&me(L);if(!c||c.retired)return fail('This player has already retired.');
    c.retired=true;p.retired=L.season;p.teamId=null;c.pendingPress=null;c.watches.forEach(w=>{if(!w.resolved){w.resolved=true;w.cancelled='Retirement';}});
    log(L,'retirement',`${p.name} retired from the league. His life and career record remain in this save.`,true);quote(L,`${p.name} steps away from basketball`,'The player ends his current playing contract and keeps his life story open.','I need a new chapter.','retire');return {ok:true};
  }
  function unretire(L) {
    const c=L.career,p=c&&me(L);if(!c?.retired||p.age>45)return fail('A return is not available at this stage.');
    c.retired=false;p.retired=null;p.teamId=null;log(L,'return',`${p.name} seeks a return. He needs an actual contract offer before playing.`,true);return {ok:true};
  }
  function advance(L) {
    if(L.phase!=='offseason')return fail('Finish the season first.');
    if(HL.League.usesRealHistory()&&!HL.HISTORY_SEASONS[String(L.season+1)])return fail('Load next season before advancing.');
    const c=L.career,p=me(L);if(!c.retired&&p.teamId!=null&&p.contract.exp<=L.season)return fail('Choose a contract offer before the next season.');
    offseason(L);if(L.draftRoom&&L.draftRoom.stage!=='complete'){if(!L.draftRoom.lottery)HL.DraftRoom.lottery(L);HL.DraftRoom.simulate(L,false);}
    HL.League.advanceToNextSeason();p.age++;p.yearsPro++;
    if(p.age>=31)for(const k of ['speed','vert','stam'])p.attrs[k]=Math.max(25,p.attrs[k]-(p.age>=36?2:1));
    p.ovr=HL.computeOvr(p.attrs,p.pos);c.pendingPress=null;role(L);log(L,'season_start',`A new season begins at age ${p.age}. Training and game use continue to determine growth.`);return {ok:true};
  }
  return {defaults,ACTIONS,preview,create,act,setTendencies,beforeDay,afterGame,offseason,offers,sign,retire,unretire,advance};
})();
