// Public and private media actions. Sources and consequences belong to the saved timeline.
window.HL=window.HL||{};
HL.PlayerPosts=(function(){
 const fail=reason=>({ok:false,reason}),copy=x=>JSON.parse(JSON.stringify(x));
 const catalog={custom:['Your own statement','Voice'],team:['Talk about your team','Voice'],work:['Talk about your work','Voice'],celebrate:['Celebrate a real win','Voice'],praise:['Give someone credit','People'],callout:['Call someone out','People'],apology:['Apologize','People'],recruit:['Recruit publicly','People'],message:['Send a private message','People'],trade:['Ask to leave your club','Power'],role:['Demand a larger role','Power'],coach:['Question the coaching','Power'],rules:['Challenge league rules','Power'],challenge:['Talk about the next opponent','Promises'],guarantee:['Promise a points total','Promises'],winpromise:['Guarantee the team win','Promises'],clip:['Publish a selective excerpt / leak','Sources'],fabricate:['Attribute a fabricated quote','Sources'],context:['Publish the full context','Sources']};
 const topics=Object.fromEntries(Object.entries(catalog).map(([k,v])=>[k,v[0]]));
 const needsTarget=['praise','callout','apology','recruit','message','fabricate'];
 const channels={post:'Personal post',press:'Press conference',podcast:'Podcast appearance',interview:'Interview',radio:'Radio appearance',newspaper:'Newspaper statement',private:'Private message'};
 function data(L){const d=L.playerPosts||(L.playerPosts={seq:0,entries:[],last:{},seen:[],replyDay:null,npcDays:{}});d.budgets||={};d.repaired||=[];return d;}
 const entries=L=>L.playerPosts?.entries||[],at=L=>HL.dateOfDay(L.season,L.day).getTime();
 const active=(L,p)=>p&&!p.retired&&p.teamId!=null&&L.teams[p.teamId];
 const rebounds=b=>(b.orb||0)+(b.drb||0);
 const owned=(L,p)=>active(L,p)&&p.teamId===L.userTeamId&&(!L.career||(!L.career.retired&&p.id===L.career.pid));
 function validTarget(L,e){const target=L.schedule.find(g=>g.gid===e.targetGid),p=L.players[e.pid],clubs=target&&[target.home,target.away];return e.season===L.season&&active(L,p)&&p.teamId===e.teamId&&clubs&&clubs.includes(e.teamId)&&clubs.includes(e.targetOpp);}
 const available=L=>L.career?[L.players[L.career.pid]].filter(p=>owned(L,p)):Object.values(L.players).filter(p=>owned(L,p));
 function visible(L){return entries(L).filter(e=>e.visibility!=='private'||(!L.career&&(e.teamId===L.userTeamId||e.target?.teamId===L.userTeamId))||(L.career&&(e.pid===L.career.pid||e.target?.id===L.career.pid)));}
 function facts(p,res){const side=[res.home,res.away].find(s=>s.teamId===p.teamId);if(!side)return null;const other=side===res.home?res.away:res.home,b=side.box[p.id]||{};return {teamId:p.teamId,oppId:other.teamId,score:`${side.score}–${other.score}`,won:side.score>other.score,min:b.min||0,pts:b.pts||0,reb:rebounds(b),ast:b.ast||0};}
 function memory(L,p,text,delta,tid){HL.World?.onPublicPost(L,p,text,delta,tid);if(L.career&&p.id===L.career.pid){L.career.reputation=HL.clamp(L.career.reputation+(delta.reputation||0),0,100);L.career.timeline.push({season:L.season,day:L.day,kind:'player_post',text,public:delta.private!==true});L.career.timeline=L.career.timeline.slice(-1200);}}
 function bounded(L,key,delta){const d=data(L),stamp=`${L.season}:${L.day}:${key}`,used=d.budgets[stamp]||{},out={};for(const [k,v]of Object.entries(delta)){if(typeof v!=='number'){out[k]=v;continue;}const allowed=Math.max(0,3-(used[k]||0));out[k]=Math.sign(v)*Math.min(Math.abs(v),allowed);used[k]=(used[k]||0)+Math.abs(out[k]);}d.budgets[stamp]=used;const keys=Object.keys(d.budgets);for(const k of keys.slice(0,-1000))delete d.budgets[k];return out;}
 function coverage(L,p,e,headline,body){if(e.visibility==='private')return;const item={type:'player_post',key:'player.post.'+e.topic,postId:e.id,gid:e.outcome?.gid??e.facts?.gid,importance:['custom','work','team','praise'].includes(e.topic)?1:2,headline,body,playerIds:[p.id,...(e.target?[e.target.id]:[])],teamIds:[e.teamId],reactions:e.comments.slice(-4).map(c=>({voice:{kind:c.role||'fan',outlet:c.speaker},format:e.format==='social'?'social':'print',text:c.text,likes:0,reposts:0}))},existing=L.news.find(n=>n.id===e.newsId);if(existing){Object.assign(existing,item,{day:L.day,season:L.season});return existing;}const news=HL.News.push(L,item);e.newsId=news.id;return news;}
 function source(L,key,p){const [kind,id]=String(key||'').split(':'),e=kind==='post'?entries(L).find(e=>e.id===+id):kind==='interview'?L.interviews?.statements.find(e=>e.id===+id):null;if(!e||e.authenticity==='unverified'||e.authenticity==='fabricated')return null;if(e.visibility==='private'&&e.pid!==p.id&&e.target?.id!==p.id)return null;if(e.source)return copy(e.source);return {key:`${kind}:${e.id}`,pid:e.pid,name:e.name||L.players[e.pid]?.name,teamId:e.teamId,season:e.season,day:e.day,fullQuote:e.caption??e.fullQuote,visibility:e.visibility||'public',target:e.target?copy(e.target):null};}
 function sources(L,pid){const p=L.players[pid];if(!owned(L,p))return [];return [...entries(L).map(e=>`post:${e.id}`),...(L.interviews?.statements||[]).map(e=>`interview:${e.id}`)].map(key=>{const s=source(L,key,p);return s&&{...s,selectionKey:key};}).filter(Boolean).slice(-100);}
 function write(L,p,topic,caption,f={},extra={}){
  const d=data(L),team=L.teams[p.teamId],modern=L.season>=2010,prior=HL.PublicVoices?.previous(L,p.id,extra.target?.id),e={id:++d.seq,pid:p.id,name:p.name,number:HL.jerseyNumber?.(p)??p.number??0,teamId:p.teamId,team:copy(team),season:L.season,day:L.day,at:at(L),topic,caption,facts:copy(f),format:modern?'social':'print',channel:modern?'post':'newspaper',visibility:'public',likes:modern?Math.round(Math.max(100,(p.ovr-50)*120+(L.career?.pid===p.id?L.career.fame*50:0))):null,status:'published',reply:null,replies:[],fictional:true,...extra};
  e.comments=HL.PublicVoices?HL.PublicVoices.comments(L,p,e,prior):[];d.entries.push(e);const watching=d.entries.filter(e=>e.status==='watching'),recent=d.entries.slice(-400);d.entries=[...d.entries.filter(e=>watching.includes(e)&&!recent.includes(e)),...recent];d.last[p.id]=e.at;
  coverage(L,p,e,HL.PublicVoices?.headline(L,p,e)||`${p.name}: “${caption.slice(0,90)}”`,caption);return e;
 }
 function post(L,pid,topic,options={}){
  const p=L.players[pid];if(HL.LiveGame?.active(L)||!owned(L,p)||!topics[topic])return fail('Choose your active speaker and an available action.');
  if(!options||typeof options!=='object'||Array.isArray(options))return fail('Choose valid statement details.');
  const text=options.text;if(text!=null&&(typeof text!=='string'||text.length>2000))return fail('Use at most 2,000 characters for your words.');
  let target=options.targetId==null||options.targetId===''?null:L.players[+options.targetId];if((options.targetId!=null&&options.targetId!==''&&!target)||needsTarget.includes(topic)&&(!target||target.id===p.id))return fail('Choose another person in your saved league.');
  let channel=options.channel||'post';if(!channels[channel])return fail('Choose an available outlet.');if(topic==='message')channel='private';else if(channel==='private')return fail('Use Private message for a private conversation.');if(L.season<2010)channel=channel==='podcast'?'radio':channel==='post'?'newspaper':channel;
  let f={},extra={channel,visibility:topic==='message'?'private':'public'},src=null,caption=text?.trim()?text:null;
  if(target)extra.target={id:target.id,name:target.name,teamId:target.teamId};
  if(['clip','context'].includes(topic)){
   src=source(L,options.sourceId,p);if(!src)return fail('Choose an accessible, recorded original statement.');
   if(topic==='clip'&&(typeof options.excerpt!=='string'||!options.excerpt.trim()||options.excerpt.length>1000||!src.fullQuote.includes(options.excerpt)))return fail('The excerpt must be exact, continuous words from the original source.');
   extra.source=src;if(topic==='clip'){extra.excerpt=options.excerpt;extra.authenticity='selective';}else extra.authenticity='full-context';
  }
  if(topic==='fabricate'){if(!caption)return fail('Write the words you are falsely attributing.');extra.authenticity='unverified';extra.attributedTo=copy(extra.target);}
  if(['challenge','guarantee','winpromise'].includes(topic)){
   const next=L.phase==='regular'&&L.schedule.find(g=>!g.res&&g.home!==g.away&&g.day>=L.day&&(g.home===p.teamId||g.away===p.teamId));if(!next)return fail('There is no upcoming regular-season fixture to attach this promise to.');
   const opp=L.teams[next.home===p.teamId?next.away:next.home];f.oppId=opp.id;extra={...extra,status:'watching',targetGid:next.gid,targetOpp:opp.id};
   if(topic==='guarantee'){const points=Number(options.points);if(!Number.isInteger(points)||points<0||points>150)return fail('Choose a whole points target from 0 to 150.');extra.points=points;}
  }
  if(topic==='celebrate'){
   const recent=Object.entries(L.boxScores).reverse().find(([,r])=>r.day<=L.day&&L.day-r.day<=7&&(r.home.teamId===p.teamId||r.away.teamId===p.teamId));if(!recent)return fail('There is no recent actual team result to celebrate.');f=facts(p,recent[1]);if(!f.won)return fail('The latest team result was a loss; write your own reflection instead.');f.gid=recent[0];
   caption||=f.min>0?`Good win against the ${L.teams[f.oppId].name}. Everybody did their part.`:`Team win ${f.score}. I did not play; credit goes to the teammates who earned it.`;
  }
  // All rejection checks precede remembered phrasing, budgets, news or save mutations.
  if(!caption)caption=topic==='guarantee'?`I'm going for ${extra.points} against the ${L.teams[extra.targetOpp].name}. Hold me to it.`:topic==='winpromise'?`We're beating the ${L.teams[extra.targetOpp].name}. That's my call.`:topic==='context'?src.fullQuote:topic==='clip'?`Read this part of ${src.name}'s answer.`:HL.PublicVoices?.defaults(L,p,topic,target,f)||`I want to talk about the ${L.teams[p.teamId].name}.`;
  const e=write(L,p,topic,caption,f,extra);let fans=['callout','trade','coach','fabricate'].includes(topic)?-1:topic==='message'?0:1,reputation=topic==='fabricate'?-2:topic==='message'?0:1;
  if(topic==='context'){const key=src.key;if(data(L).repaired.includes(key)){fans=0;reputation=0;}else{data(L).repaired.push(key);data(L).repaired=data(L).repaired.slice(-400);}}
  memory(L,p,`${topics[topic]}: “${caption}”`,{...bounded(L,`speaker:${p.id}`,{fans,reputation}),private:e.visibility==='private'},e.teamId);
  if(target){const trust=['callout','fabricate'].includes(topic)?-3:['praise','apology','message'].includes(topic)?1:0,delta=bounded(L,`person:${target.id}`,{trust});HL.World?.onPublicPost(L,target,`${p.name} ${e.visibility==='private'?'privately':'publicly'}: “${caption}”`,{...delta,private:e.visibility==='private'},target.teamId??e.teamId);}
  if(src?.visibility==='private'&&src.target?.id!==p.id){const other=L.players[src.target?.id];if(other)HL.World?.onPublicPost(L,other,`${p.name} exposed the private message: “${src.fullQuote}”`,bounded(L,`person:${other.id}`,{trust:-3}),other.teamId??e.teamId);}
  if(L.career){if(topic==='trade')L.career.mediaTradeRequest={season:L.season,day:L.day,targetId:target?.id??null,text:caption};if(['trade','role','coach'].includes(topic)){const d=bounded(L,`coach:${p.id}`,{trust:-2});L.career.people.coach.trust=HL.clamp(L.career.people.coach.trust+d.trust,0,100);}}
  return {ok:true,post:e};
 }
 function reply(L,id,choice,customText){
  const e=entries(L).find(e=>e.id===id),speaker=e&&L.players[e.pid],user=L.career&&L.players[L.career.pid];
  if(HL.LiveGame?.active(L)||!e||!active(L,speaker)||!visible(L).includes(e)||!L.teams[L.userTeamId]||!['support','congratulate','challenge','custom'].includes(choice)||(L.career&&!owned(L,user)))return fail('Choose an accessible conversation and an available response.');
  if(choice==='congratulate'&&(!e.facts.won||!(e.facts.min>0)))return fail('Congratulations need an actual winning appearance.');
  if(choice==='custom'&&(typeof customText!=='string'||!customText.trim()||customText.length>2000))return fail('Write your reply, up to 2,000 characters.');
  const text=choice==='custom'?customText:choice==='support'?'I hear you. Happy to talk about it.':choice==='congratulate'?`Good win${e.facts.pts?`; ${e.facts.pts} points helped`:''}. Respect.`:'What do you mean by that? I want to hear the whole answer.';
  const respondent=user?.id===speaker.id?((e.target?.id!==user.id?L.players[e.target?.id]:null)||{id:`audience:${e.teamId}`,name:L.season<2010?'Sports correspondent':'Local reporter',traits:{}}):speaker;
  const answer=HL.PublicVoices?.answer(L,respondent,e,choice,text)||{text:'Let’s talk about what you mean.',context:e.topic},author=L.career?user.name:`${L.teams[L.userTeamId].name} front office`;
  const r={choice,author,text,season:L.season,day:L.day,response:answer.text,responseAuthor:respondent.name};e.replies||=[];if(e.reply&&!e.replies.length)e.replies.push(e.reply);e.replies.push(r);e.replies=e.replies.slice(-30);e.reply=r;
  e.comments.push({speaker:respondent.name,text:answer.text,pid:L.players[respondent.id]?respondent.id:null,context:answer.context,role:L.players[respondent.id]?'person':'reporter',delivery:e.visibility==='private'?'private':'reply'});e.comments=e.comments.slice(-32);
  memory(L,L.players[respondent.id]||speaker,`${author}: “${text}” ${respondent.name}: “${answer.text}”`,{...bounded(L,`person:${respondent.id}`,{trust:choice==='challenge'?-2:1}),private:e.visibility==='private'},e.teamId);
  coverage(L,speaker,e,`${author} replies to ${respondent.name}`,`${text} ${respondent.name}: “${answer.text}”`);return {ok:true,response:answer.text};
 }
 function cancel(L,pid){for(const e of entries(L))if(e.pid===pid&&e.status==='watching'){e.status='cancelled';e.cancellation='The player left the team or retired before this matchup; the promise is closed.';}}
 function reconcile(L){for(const e of entries(L))if(e.status==='watching'&&!validTarget(L,e)){e.status='cancelled';e.cancellation='The recorded matchup is no longer scheduled for this player and these opponents; no performance verdict is assigned.';}}
 function afterGame(L,g,res){
  const d=data(L),key=`${L.season}:${g.gid}`;if(d.seen.includes(key))return;reconcile(L);d.seen.push(key);d.seen=d.seen.slice(-1500);
  for(const e of entries(L)){
   if(e.authenticity==='unverified'&&[g.home,g.away].includes(e.teamId)){
    e.authenticity='fabricated';e.correction=`No recorded interview or message supports the words attributed to ${e.target.name}. The attribution was fabricated by ${e.name}; it is not a sourced quotation.`;const p=L.players[e.pid];e.comments.push({speaker:'Source correction',role:'reporter',text:e.correction,context:'fabrication chosen explicitly; no original source'});coverage(L,p,e,`Correction: the quotation attributed to ${e.target.name}`,e.correction);memory(L,p,e.correction,bounded(L,`speaker:${p.id}`,{fans:-3,reputation:-3}),e.teamId);
   }
   if(e.status!=='watching'||e.targetGid!==g.gid)continue;const p=L.players[e.pid],f=facts(p,res);if(!f||f.oppId!==e.targetOpp)continue;
   const met=e.topic==='winpromise'?f.won:f.min<=0?null:e.topic==='guarantee'?f.pts>=e.points:f.won;
   const verdict=e.topic==='winpromise'?`${e.name} called a team win. The team ${f.won?'won':'lost'} ${f.score}. ${f.min>0?`He played ${f.min.toFixed(1)} minutes.`:'He did not play; this was a team prediction.'}`:f.min<=0?`${e.name} did not play; no personal performance verdict is assigned.`:e.topic==='guarantee'?`${e.name} promised ${e.points} points and scored ${f.pts} in ${f.min.toFixed(1)} minutes. The team ${f.won?'won':'lost'} ${f.score}.`:`${e.name} spoke about this matchup and finished with ${f.pts} points in ${f.min.toFixed(1)} minutes; his team ${f.won?'won':'lost'} ${f.score}.`;
   e.status='resolved';e.outcome={...f,gid:g.gid,met,verdict};e.comments.push({speaker:L.season>=2010?'Postgame follow-up':'Match correspondent',role:'reporter',text:verdict,context:'recorded pledge and actual fixture only'});coverage(L,p,e,`${e.name}'s words meet the ${L.teams[f.oppId].name} result`,`Original statement: “${e.caption}”. ${verdict}`);memory(L,p,verdict,bounded(L,`speaker:${p.id}`,{fans:met===null?0:met?2:-1,reputation:met===null?0:met?1:-1}),e.teamId);
  }
  const stamp=`${L.season}:${g.day}`;if((d.npcDays[stamp]||0)>=3)return;
  const candidates=[res.home,res.away].flatMap(s=>Object.entries(s.box).map(([pid,b])=>({p:L.players[pid],b,s}))).filter(x=>active(L,x.p)&&x.p.id!==L.career?.pid&&x.b.min>0&&(x.b.pts>=30||(x.b.pts>=10&&rebounds(x.b)>=10&&x.b.ast>=10))&&at(L)-(d.last[x.p.id]??-Infinity)>=7*86400000).sort((a,b)=>b.b.pts-a.b.pts||a.p.id-b.p.id);
  const best=candidates[0];if(!best)return;const p=best.p,f=facts(p,res);f.gid=g.gid;write(L,p,'performance',HL.PublicVoices?.performance(L,p,f)||`${f.won?'Good win.':'Not enough tonight.'} Credit to the team.`,f);d.npcDays[stamp]=(d.npcDays[stamp]||0)+1;const old=Object.keys(d.npcDays);for(const k of old.slice(0,-400))delete d.npcDays[k];
 }
 return {topics,catalog,channels,available,entries,visible,sources,post,reply,afterGame,cancel};
})();
