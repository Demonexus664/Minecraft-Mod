// Skill Draft press room: one earned, choice-driven media story per NBA offseason.
// No random fantasy follower currency and no direct rating boosts. Bold promises
// settle only against actual season statistics and can affect contract perception.
window.HL=window.HL||{};
HL.SkillPress=(function(){
  const clamp=(x,lo,hi)=>Math.max(lo,Math.min(hi,x));
  const esc=x=>HL.UI?.esc?HL.UI.esc(x):String(x??'').replace(/[&<>"']/g,ch=>(
    {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const last=c=>(c.seasons||[]).filter(s=>!s.minors).at(-1);
  const year=c=>c.yr;
  function values(c){
    const v=c.press||{};
    return {image:clamp(v.image??50,0,100),trust:clamp(v.trust??50,0,100),heat:clamp(v.heat??12,0,100),
      lastYear:v.lastYear??null,pledge:v.pledge||null,history:v.history||[]};
  }
  function beat(c){
    const s=last(c);
    if(!s)return null;
    if(s.injury?.games>=20)return {id:'health',title:'THE COMEBACK QUESTION',
      prompt:'The clips say your body cannot hold up anymore. Reporters want to know if you can still deliver.',
      context:'Missed '+s.injury.games+' NBA games after '+s.injury.name+'.'};
    if(s.champion)return {id:'rings',title:'THE TITLE DEFENSE',
      prompt:'You just won it all. Everybody wants to know how you handle the attention next season.',
      context:'NBA champion · '+s.w+'-'+s.l+' regular season.'};
    if(s.rival&&!s.rival.win)return {id:'rival',title:'THE RIVALRY IS REAL',
      prompt:(year(c)>=2010?'ClipFeed edits are replaying':'The sports pages keep replaying')+' the other star beating you in the MVP race. Are you answering?',
      context:s.rival.name+' took the previous round · '+s.rival.myScore+' vs '+s.rival.theirScore+' impact.'};
    if((s.ppg||0)>=30)return {id:'scorer',title:'IS IT ONLY POINTS?',
      prompt:(year(c)>=2010?'The highlight edits':'The sports reporters')+' love the buckets, but skeptical commentators say scoring is all you can do.',
      context:s.ppg.toFixed(1)+' PPG · '+s.apg.toFixed(1)+' APG · '+s.w+'-'+s.l+'.'};
    if((c.age||19)>=34)return {id:'washed',title:'THE WASHED ALLEGATIONS',
      prompt:(year(c)>=2010?'Veteran commentators are comparing your old clips':'Sports columnists are comparing earlier performances')+' with this season. They say the decline has started.',
      context:'Age '+c.age+' · most recent season '+s.ovr+' OVR.'};
    if(!s.made)return {id:'missed',title:'PLAYOFF RECEIPTS',
      prompt:(year(c)>=2010?'Fan edits are pointing':'Newspaper columns are pointing')+' at the missed postseason. What do you say when reporters turn your way?',
      context:'Your club finished '+s.w+'-'+s.l+' and missed the playoffs.'};
    return {id:'future',title:'ALL EYES ON NEXT SEASON',
      prompt:'The city has expectations and the analysts are arguing about your ceiling.',
      context:s.ppg.toFixed(1)+' PPG · '+s.w+'-'+s.l+' · '+(s.awards||[]).length+' season honors.'};
  }
  function choices(c){
    const b=beat(c);if(!b)return [];
    const rival=last(c)?.rival?.name;
    return [
      {id:'quiet',title:'Let the film speak',quote:'I know what the clips say. I will answer between the lines.',
       detail:'Cool the media cycle. Slightly improve locker-room trust. No performance pledge.',
       sentiment:0,trust:3,heat:-7},
      {id:'team',title:'Back the locker room',quote:'Those guys deserve credit. We win and lose together.',
       detail:'Win team trust and some fan support. Keep your next-season objective flexible.',
       sentiment:2,trust:6,heat:-3},
      ...(rival?[{id:'rival',title:'Call out '+rival,quote:rival+' had his season. Now we see who really leads this league.',
        detail:'High-risk rivalry challenge. Beat his real voting-impact result next year or face a backlash.',
        sentiment:0,trust:-2,heat:15,pledge:'rival'}]:[]),
      {id:'bold',title:'Guarantee a statement year',
       quote:(last(c)?.ppg||0)>=24?'Put it in the headline: thirty a night.':(year(c)>=2010?'Save this clip. We are making the playoffs.':'Print it in the paper. We are making the playoffs.'),
       detail:(last(c)?.ppg||0)>=24?'Publicly promise 30 PPG. Miss and the internet keeps receipts.':
         'Publicly promise a playoff berth. Miss and the internet keeps receipts.',
       sentiment:1,trust:-2,heat:12,pledge:(last(c)?.ppg||0)>=24?'30ppg':'playoffs'}
    ];
  }
  function respond(c,id){
    const b=beat(c);if(!b)return {ok:false,reason:'Play an NBA season before taking a press question.'};
    const v=values(c);
    if(v.lastYear===year(c))return {ok:false,reason:'You already gave this season’s statement.'};
    const option=choices(c).find(x=>x.id===id);
    if(!option)return {ok:false,reason:'Choose one of the visible answers.'};
    const update={
      image:clamp(v.image+option.sentiment,0,100),
      trust:clamp(v.trust+option.trust,0,100),
      heat:clamp(v.heat+option.heat,0,100),
      pledge:option.pledge?{kind:option.pledge,year:year(c),status:'pending',
        rivalId:last(c)?.rival?.pid??null}:null,
      lastYear:year(c),history:v.history.slice(-23)
    };
    const rec={year:year(c),kind:b.id,response:id,quote:option.quote,
      headline:option.pledge?'THE CLIP IS SAVED · '+option.title.toUpperCase():
        'THE PRESS HEARD YOU · '+option.title.toUpperCase(),outcome:'pending'};
    update.history.push(rec);c.press=update;
    return {ok:true,record:rec,pledge:update.pledge};
  }
  function resolve(c,s){
    const v=values(c),p=v.pledge;
    if(!p||p.status!=='pending'||p.year!==s.yr)return null;
    let won=false,measure='';
    if(p.kind==='30ppg'){won=s.g>=s.games*.5&&s.ppg>=30;measure=s.ppg.toFixed(1)+' PPG';}
    if(p.kind==='playoffs'){won=!!s.made;measure=s.made?'Made playoffs':'Missed playoffs';}
    if(p.kind==='rival'){won=!!s.rival?.win;measure=s.rival?
      (s.rival.win?'Outperformed '+s.rival.name:'Finished behind '+s.rival.name):
      'Rival not in the field';}
    // The response settles against basketball, and reputation only changes
    // how much interest the next contract receives. Never modify attributes.
    const change=won?9:-11;
    c.press={...v,image:clamp(v.image+change,0,100),
      heat:clamp(v.heat+(won?-8:11),0,100),pledge:{...p,status:won?'won':'lost',
      measure,settled:s.yr},history:v.history.map(h=>h.year===p.year&&h.outcome==='pending'?
        {...h,outcome:won?'won':'lost',receipt:measure}:h)};
    s.pressResult={kind:p.kind,won,measure,impact:change};
    return s.pressResult;
  }
  function market(c){
    const v=values(c);
    // Even heavily favorable coverage cannot replace basketball ability.
    return clamp(1+(v.image-50)*.0013+(v.trust-50)*.0005,.92,1.09);
  }
  function panel(c){
    const b=beat(c);if(!b||c.done)return '';
    const v=values(c),rec=v.history.findLast(x=>x.year===c.yr),oldReceipt=v.history.findLast(x=>x.outcome==='won'||x.outcome==='lost');
    const buttons=choices(c).map(x=>'<button class="press-choice" data-press="'+x.id+'">'+
      '<div class="press-choice-kicker">'+(x.pledge?'HIGH STAKES · PUBLIC PROMISE':'MEDIA RESPONSE')+'</div>'+
      '<strong>'+esc(x.title)+'</strong><p>'+esc(x.quote)+'</p><small>'+esc(x.detail)+'</small></button>').join('');
    const meters=[['Fan approval',v.image],['Locker-room trust',v.trust],['Narrative heat',v.heat]]
      .map(([label,n])=>'<div class="press-meter"><span>'+label+'</span><div><i style="width:'+n+'%"></i></div><b>'+n+'</b></div>').join('');
    const modern=c.yr>=2010;
    return '<section class="block press-center '+(modern?'press-modern':'press-classic')+'"><header><h3>THE PRESS ROOM · '+(modern?'CLIPFEED':'SPORTS DESK')+'</h3>'+
      '<span class="ml-auto t3 sm">'+c.yr+' OFFSEASON</span></header><div class="body stack">'+
      '<div class="press-stage"><div class="press-phone"><div class="press-screen">'+
      '<div class="press-live"><i></i> '+(modern?'CLIPFEED · TONIGHT':'COURTSIDE SPORTS · FRONT PAGE')+'</div>'+
      '<div class="press-story-mark">'+(modern?'THE DISCOURSE':'THE HEADLINE')+'</div><div class="press-big">'+esc(b.title)+'</div>'+
      '<p>'+esc(b.context)+'</p><div class="press-caption">'+(modern?'SWIPE FOR THE FULL CONTEXT':'CONTINUED IN THE SPORTING PRESS')+'</div>'+
      '</div></div><div class="press-content"><div class="caps">TODAY AT THE PODIUM</div>'+
      '<h2>'+esc(b.title)+'</h2><p>'+esc(b.prompt)+'</p>'+
      '<div class="press-meters">'+meters+'</div>'+
      '<div class="press-deals">Future contract-market perception: '+Math.round(market(c)*100)+'% of a normal offer, capped within ±9%. Ratings and possessions stay unchanged.</div></div></div>'+
      (rec?'<div class="press-receipt"><b>YOUR STATEMENT IS ON RECORD</b><p>'+esc(rec.quote)+'</p>'+
        '<small>'+(rec.outcome==='pending'?'Results will determine whether the promise holds.':
          'Outcome: '+esc(rec.outcome)+' · '+esc(rec.receipt||''))+'</small></div>':
        '<div class="caps">SELECT YOUR RESPONSE · ONE STATEMENT PER YEAR</div>'+
        '<div class="press-choices">'+buttons+'</div>')+
      '</div></section>';
  }
  return {beat,choices,respond,resolve,market,panel,values};
})();
