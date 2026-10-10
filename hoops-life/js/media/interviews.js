// Authored in-save statements, visible source context and actual-game follow-ups.
window.HL=window.HL||{};
HL.Interviews=(function(){
 const fail=reason=>({ok:false,reason}),copy=x=>JSON.parse(JSON.stringify(x));
 const tones={humble:'I still have a lot to learn. I will keep working for this team.',confident:'I want the biggest moments. But this team comes first.',deflect:'Tonight was about the team. I am keeping the next step private.'};
 const state=L=>L.interviews||(L.interviews={seq:0,statements:[],threads:[]});
 const threads=L=>L.interviews?.threads||[];
 function owned(L,p){return p&&!p.retired&&p.teamId===L.userTeamId&&(!L.career||p.id===L.career.pid);}
 function memory(L,p,text,delta){HL.World?.onInterview(L,p,text,delta);if(L.career&&p.id===L.career.pid){if(delta.reputation)L.career.reputation=HL.clamp(L.career.reputation+delta.reputation,0,100);L.career.timeline.push({season:L.season,day:L.day,kind:'interview_context',text,public:true});L.career.timeline=L.career.timeline.slice(-1200);}}
 function news(L,p,headline,body,key,threadId){const t=L.teams[p.teamId??L.userTeamId];return HL.News.push(L,{type:'interview',key,threadId,importance:2,headline,body,playerIds:[p.id],teamIds:[t.id],reactions:[HL.News.react(L,'beat',key,{player:p.name,team:t.name},['The full words of {player} deserve a reading alongside the results. One excerpt is not the whole story.'],t,{eraBuiltins:['The remarks of {player} should be considered in their complete context.']}),HL.News.react(L,'hater',key,{player:p.name},['Full answer or short clip, I still want to see him back it up on the court.'],t,{eraBuiltins:['The complete remarks are available, but this observer awaits a stronger showing on the court.']})].filter(Boolean)});}
 function record(L,pid,tone,fullQuote,facts={}){
  const p=L.players[pid];if(HL.LiveGame?.active(L)||!owned(L,p)||!tones[tone]||typeof fullQuote!=='string'||!fullQuote.trim()||fullQuote.length>2000)return fail('Record a valid public statement by your current player.');
  const d=state(L),source={id:++d.seq,pid,teamId:p.teamId,season:L.season,day:L.day,tone,fullQuote,facts:copy(facts),fictional:true};d.statements.push(source);d.statements=d.statements.slice(-200);
  news(L,p,`${p.name}: the full interview`,fullQuote,'interview.statement',null);
  const sentences=fullQuote.split(/[.!?]/).map(s=>s.trim()).filter(Boolean);
  if(sentences.length>1&&(source.id===1||source.id%3===0)&&!d.threads.some(t=>t.source.pid===pid&&['open','watching'].includes(t.status))){
   const excerpt=sentences[0],format=L.season<2010?'print':'clip';
   const t={id:source.id,source:copy(source),excerpt,format,status:'open',response:null,games:0,appearances:0,pts:0,min:0,wins:0,seen:[]};d.threads.push(t);d.threads=d.threads.slice(-200);
   news(L,p,`${p.name}: an excerpt changes the framing`,`${format==='clip'?'A short quote clip':'A selected interview excerpt'} circulates: “${excerpt}”. Its framing ${tone==='humble'?'calls him unready':tone==='confident'?'calls him selfish':'suggests he wants out'} while omitting the rest of the answer. The full in-save statement is available to compare.`,'interview.excerpt',t.id);
   memory(L,p,'A selective interview excerpt drew attention; the full source is retained.',{fans:-2,reputation:-2});
  }
  return {ok:true,source};
 }
 function hold(L,pid,tone){if(L.career)return fail('Career interviews come from your actual postgame scene.');if(!tones[tone])return fail('Choose an interview tone.');if(!owned(L,L.players[pid])||!L.teams[L.userTeamId])return fail('Choose your current player.');return record(L,pid,tone,tones[tone],{teamRecord:`${L.teams[L.userTeamId].w}–${L.teams[L.userTeamId].l}`});}
 function respond(L,id,choice){
  const t=threads(L).find(t=>t.id===id),p=t&&L.players[t.source.pid];if(HL.LiveGame?.active(L)||!t||!owned(L,p)||p.teamId!==t.source.teamId||t.status!=='open'||!['context','wait','confront'].includes(choice))return fail('This interview is not awaiting a response from your player.');
  t.response=choice;t.status='watching';const text=choice==='context'?`You publish the full answer: “${t.source.fullQuote}”`:choice==='confront'?'You challenge the framing publicly. Some appreciate the pushback; others see another argument.':'You let the first three team games after this statement provide a playing sample. The original words remain available.';
  news(L,p,`${p.name} responds to the excerpt`,text,'interview.response',t.id);memory(L,p,text,choice==='context'?{fans:1,trust:1,reputation:2}:choice==='confront'?{trust:-1,reputation:-1}:{});return {ok:true,response:text};
 }
 function cancel(L,pid){for(const t of threads(L))if(t.source.pid===pid&&['open','watching'].includes(t.status)){t.status='cancelled';t.cancellation='The player left this team or retired; no performance verdict is assigned.';}}
 function afterGame(L,g,res){
  for(const t of threads(L)){
   if(!['open','watching'].includes(t.status))continue;const p=L.players[t.source.pid];if(!p||p.retired||p.teamId!==t.source.teamId){t.status='cancelled';t.cancellation='The player left this team or retired; no performance verdict is assigned.';continue;}
   const side=[res.home,res.away].find(x=>x.teamId===t.source.teamId);if(!side)continue;const key=`${L.season}:${g.gid}`;if(t.seen.includes(key))continue;t.seen.push(key);t.games++;
   const b=side.box[p.id]||{},other=side===res.home?res.away:res.home;t.wins+=side.score>other.score?1:0;if((b.min||0)>0){t.appearances++;t.pts+=b.pts||0;t.min+=b.min;}
   if(t.games<3)continue;t.status='resolved';const avg=t.appearances?t.pts/t.appearances:0,strong=t.appearances&&avg>=(p.ovr>=80?15:8);
   const body=t.appearances?`Across three actual team games (${t.wins}–${3-t.wins}), ${p.name} appeared ${t.appearances} times and averaged ${avg.toFixed(1)} points and ${(t.min/t.appearances).toFixed(1)} minutes per appearance. The source quote remains “${t.source.fullQuote}”. Results add context; they do not validate the misleading edit.`:`Across three actual team games, ${p.name} made no appearances. There is no playing sample to judge; the excerpt alone proves no decline or lack of commitment. The full source remains “${t.source.fullQuote}”.`;
   news(L,p,`${p.name}: the games add context`,body,'interview.verdict',t.id);memory(L,p,body,{fans:strong?2:0,reputation:strong?2:0});
  }
 }
 return {record,hold,respond,afterGame,threads,tones,cancel};
})();
