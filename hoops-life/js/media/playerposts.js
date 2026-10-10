// Public player voices: saved sources, real game evidence and remembered replies.
window.HL=window.HL||{};
HL.PlayerPosts=(function(){
 const fail=reason=>({ok:false,reason}),copy=x=>JSON.parse(JSON.stringify(x));
 const topics={team:'Team first',work:'Back to work',challenge:'Next opponent',celebrate:'Celebrate a real win'};
 const data=L=>L.playerPosts||(L.playerPosts={seq:0,entries:[],last:{},seen:[],replyDay:null,npcDays:{}});
 const entries=L=>L.playerPosts?.entries||[];
 const at=L=>HL.dateOfDay(L.season,L.day).getTime();
 const active=(L,p)=>p&&!p.retired&&p.teamId!=null&&L.teams[p.teamId];
 const rebounds=b=>(b.orb||0)+(b.drb||0);
 const owned=(L,p)=>active(L,p)&&p.teamId===L.userTeamId&&(!L.career||(!L.career.retired&&p.id===L.career.pid));
 function validTarget(L,e){const target=L.schedule.find(g=>g.gid===e.targetGid),p=L.players[e.pid],clubs=target&&[target.home,target.away];return e.season===L.season&&active(L,p)&&p.teamId===e.teamId&&clubs&&clubs.includes(e.teamId)&&clubs.includes(e.targetOpp);}
 function available(L){return L.career?[L.players[L.career.pid]].filter(p=>owned(L,p)):Object.values(L.players).filter(p=>owned(L,p));}
 function facts(p,res){const side=[res.home,res.away].find(s=>s.teamId===p.teamId);if(!side)return null;const other=side===res.home?res.away:res.home,b=side.box[p.id]||{};return {teamId:p.teamId,oppId:other.teamId,score:`${side.score}–${other.score}`,won:side.score>other.score,min:b.min||0,pts:b.pts||0,reb:rebounds(b),ast:b.ast||0};}
 function memory(L,p,text,delta,tid){HL.World?.onPublicPost(L,p,text,delta,tid);if(L.career&&p.id===L.career.pid){L.career.reputation=HL.clamp(L.career.reputation+(delta.reputation||0),0,100);L.career.timeline.push({season:L.season,day:L.day,kind:'player_post',text,public:true});L.career.timeline=L.career.timeline.slice(-1200);}}
 function coverage(L,p,post,headline,body){return HL.News.push(L,{type:'player_post',key:'player.post.'+post.topic,postId:post.id,gid:post.outcome?.gid??post.facts?.gid,importance:2,headline,body,playerIds:[p.id],teamIds:[post.teamId],reactions:post.comments.map((c,i)=>({voice:{kind:i?'hater':'homer',outlet:c.speaker},format:post.format==='social'?'social':'print',text:c.text,likes:0,reposts:0}))});}
 function write(L,p,topic,caption,f={},extra={}){
  const d=data(L),team=L.teams[p.teamId],modern=L.season>=2010,post={id:++d.seq,pid:p.id,name:p.name,number:HL.jerseyNumber?.(p)??p.number??0,teamId:p.teamId,team:copy(team),season:L.season,day:L.day,at:at(L),topic,caption,facts:copy(f),format:modern?'social':'print',likes:modern?Math.round(Math.max(100,(p.ovr-50)*120+(L.career?.pid===p.id?L.career.fame*50:0))):null,status:'published',reply:null,fictional:true,...extra};
  post.comments=[{speaker:modern?`${team.abbr} faithful`:`${team.city} supporters`,text:modern?'Keep showing up for the team. We are watching.':'Supporters welcome the player’s words and await the next contest.'},{speaker:modern?'Opposing fan':'A rival correspondent',text:f.min>0?`${f.pts} points${f.won?' in a win':' in a loss'}. The result and the words both matter.`:modern?'Words are easy. Let us see the next game.':'Public remarks will be measured against the next appearance.'}];
  d.entries.push(post);d.entries=d.entries.slice(-400);d.last[p.id]=post.at;
  coverage(L,p,post,`${p.name}: ${topics[topic]||'after the game'}`,caption);return post;
 }
 function post(L,pid,topic){
  const p=L.players[pid];if(HL.LiveGame?.active(L)||!owned(L,p)||!topics[topic])return fail('Choose your active player and an available public topic.');
  if(at(L)-(L.playerPosts?.last[pid]??-Infinity)<7*86400000)return fail('Let this statement breathe. This player can post again after seven calendar days.');
  const team=L.teams[p.teamId],modern=L.season>=2010;let caption,f={},extra={};
  if(topic==='team')caption=modern?`One team. Same goal. I want to earn my place with the ${team.name}.`:`My first concern is the success of the ${team.name}. I intend to earn my place.`;
  if(topic==='work')caption=modern?'Back to work. The next chance has to be earned.':'There is more work ahead before my next appearance.';
  if(topic==='challenge'){
   const next=L.phase==='regular'&&L.schedule.find(g=>!g.res&&g.home!==g.away&&g.day>=L.day&&(g.home===p.teamId||g.away===p.teamId));
   if(!next||entries(L).some(e=>e.pid===pid&&e.status==='watching'&&validTarget(L,e)))return fail('A new scheduled matchup is needed; finish any pending challenge first.');
   reconcile(L);
   const opp=L.teams[next.home===p.teamId?next.away:next.home];caption=modern?`${opp.city} ${opp.name} next. I am ready for that matchup.`:`I await our next contest against the ${opp.name} with confidence.`;extra={status:'watching',targetGid:next.gid,targetOpp:opp.id};
  }
  if(topic==='celebrate'){
   const recent=Object.entries(L.boxScores).reverse().find(([,r])=>r.day<=L.day&&L.day-r.day<=7&&(r.home.teamId===p.teamId||r.away.teamId===p.teamId));
   if(!recent)return fail('There is no recent actual team result to celebrate.');f=facts(p,recent[1]);if(!f.won)return fail('The latest team result was a loss. Choose another public topic.');f.gid=recent[0];
   caption=f.min>0?`${f.pts} points, ${f.reb} rebounds, ${f.ast} assists. Team win ${f.score} against the ${L.teams[f.oppId].name}. ${modern?'Keep building.':'The work continues.'}`:`Team win ${f.score}. I did not play; credit goes to the teammates who earned it.`;
  }
  const entry=write(L,p,topic,caption,f,extra);memory(L,p,caption,{fans:topic==='challenge'?-1:1,reputation:topic==='challenge'?-1:1},entry.teamId);return {ok:true,post:entry};
 }
 function reply(L,id,choice){
  const post=entries(L).find(e=>e.id===id),speaker=post&&L.players[post.pid],user=L.career&&L.players[L.career.pid];
  if(HL.LiveGame?.active(L)||!post||!active(L,speaker)||!L.teams[L.userTeamId]||!['support','congratulate','challenge'].includes(choice)||post.reply||(L.career&&(!owned(L,user)||post.pid===user.id))||L.playerPosts.replyDay===at(L))return fail('Choose another player’s available post; one reply is allowed per day.');
  if(choice==='congratulate'&&(!post.facts.won||!(post.facts.min>0)))return fail('Congratulations need an actual winning appearance.');
  const author=L.career?user.name:`${L.teams[L.userTeamId].name} front office`,text=choice==='support'?'Keep working. I respect the effort.':choice==='congratulate'?'Credit where it is due. Good game.':'I want to see the words backed up on the court.';
  post.reply={choice,author,text,season:L.season,day:L.day};L.playerPosts.replyDay=at(L);
  const response=choice==='challenge'?(speaker.traits?.ego>=70?'Do not turn my answer into another argument.':'Fair. We will see what the games say.'):'I appreciate that. We keep moving.';
  post.comments.push({speaker:speaker.name,text:response});memory(L,speaker,`${author} replied: “${text}” ${speaker.name}: “${response}”`,{trust:choice==='challenge'?-2:1},post.teamId);
  coverage(L,speaker,post,`${author} replies to ${speaker.name}`,`${text} ${speaker.name} responds: “${response}”`);return {ok:true,response};
 }
 function cancel(L,pid){for(const e of entries(L))if(e.pid===pid&&e.status==='watching'){e.status='cancelled';e.cancellation='The player left the team or retired before this matchup; the challenge is closed.';}}
 function reconcile(L){for(const e of entries(L))if(e.status==='watching'){
  if(!validTarget(L,e)){e.status='cancelled';e.cancellation='The recorded matchup is no longer scheduled for this player and these opponents; no performance verdict is assigned.';}
 }}
 function afterGame(L,g,res){
  const d=data(L),key=`${L.season}:${g.gid}`;if(d.seen.includes(key))return;reconcile(L);d.seen.push(key);d.seen=d.seen.slice(-1500);
  for(const e of entries(L))if(e.status==='watching'){
   const p=L.players[e.pid];if(!active(L,p)||p.teamId!==e.teamId||e.season!==L.season){e.status='cancelled';e.cancellation='The player or season changed before the matchup.';continue;}
   if(e.targetGid!==g.gid)continue;const f=facts(p,res);if(!f||f.oppId!==e.targetOpp)continue;e.status='resolved';e.outcome={...f,gid:g.gid};
   const body=f.min>0?`${p.name} followed his matchup statement with ${f.pts} points in ${f.min.toFixed(1)} minutes; his team ${f.won?'won':'lost'} ${f.score}.`:`${p.name} did not play. His team ${f.won?'won':'lost'} ${f.score}; there is no personal performance to judge.`;
   coverage(L,p,e,`${p.name}: the matchup supplies the answer`,body);memory(L,p,body,{fans:f.min>0&&f.won?2:0,reputation:f.min>0&&f.won?1:0},e.teamId);
  }
  const stamp=`${L.season}:${g.day}`;if((d.npcDays[stamp]||0)>=3)return;
  const candidates=[res.home,res.away].flatMap(s=>Object.entries(s.box).map(([pid,b])=>({p:L.players[pid],b,s}))).filter(x=>active(L,x.p)&&x.p.id!==L.career?.pid&&x.b.min>0&&(x.b.pts>=30||(x.b.pts>=10&&rebounds(x.b)>=10&&x.b.ast>=10))&&at(L)-(d.last[x.p.id]??-Infinity)>=7*86400000).sort((a,b)=>b.b.pts-a.b.pts||a.p.id-b.p.id);
  const best=candidates[0];if(!best)return;const p=best.p,f=facts(p,res);f.gid=g.gid;
  const endings=['Needed that one.','Love this team.','One for the city.','Same work tomorrow.','Kept fighting.','Respect to the other side. We earned that one.','Work speaks.','All heart.'];
  const voice=L.season<2010?'The result reflects the efforts of the whole team.':(p.traits?.ego>=75?'More to come.':endings[(p.id+String(g.gid).length)%endings.length]);
  const caption=f.won?`${voice} ${f.pts} points, ${f.reb} rebounds, ${f.ast} assists. Team win ${f.score}.`:`${f.pts} points were not enough. We lost ${f.score}. Credit to the ${L.teams[f.oppId].name}; ${p.traits?.workEthic>=70?'back to work.':'we have to respond.'}`;
  write(L,p,'performance',caption,f);d.npcDays[stamp]=(d.npcDays[stamp]||0)+1;const old=Object.keys(d.npcDays);for(const k of old.slice(0,-400))delete d.npcDays[k];
 }
 return {topics,available,entries,post,reply,afterGame,cancel};
})();
