// Authored in-save statements, visible source context and actual-game follow-ups.
window.HL=window.HL||{};
HL.Interviews=(function(){
 const fail=reason=>({ok:false,reason}),copy=x=>JSON.parse(JSON.stringify(x));
 const tones={humble:'I still have a lot to learn. I will keep working for this team.',confident:'I want the biggest moments. But this team comes first.',deflect:'Tonight was about the team. I am keeping the next step private.'};
 const state=L=>L.interviews||(L.interviews={seq:0,statements:[],threads:[]});
 const threads=L=>L.interviews?.threads||[];
 function owned(L,p){return p&&!p.retired&&p.teamId===L.userTeamId&&(!L.career||p.id===L.career.pid);}
 function memory(L,p,text,delta){HL.World?.onInterview(L,p,text,delta);if(L.career&&p.id===L.career.pid){if(delta.reputation)L.career.reputation=HL.clamp(L.career.reputation+delta.reputation,0,100);L.career.timeline.push({season:L.season,day:L.day,kind:'interview_context',text,public:true});L.career.timeline=L.career.timeline.slice(-1200);}}
 function news(L,p,headline,body,key,threadId){const t=L.teams[p.teamId??L.userTeamId],modern=L.season>=2010,lines=key==='interview.excerpt'?[`There is a longer answer behind that quote. Read it before deciding what ${p.name} meant.`,`What was the question? The excerpt leaves part of ${p.name}'s answer out.`]:key==='interview.response'?[`The original answer is available now. Compare it with what was shared.`,`People can read both versions and make up their own minds.`]:key==='interview.verdict'?[`The game figures add context. They don't change the words in the original interview.`]:modern?[`That's ${p.name}'s answer. We'll see how things develop with the ${t.name}.`,`He answered the question. Not every remark needs another controversy.`]:[`The complete remarks of ${p.name} are available for readers to consider.`];return HL.News.push(L,{type:'interview',key,threadId,importance:2,headline,body,playerIds:[p.id],teamIds:[t.id],reactions:[{voice:{kind:'beat',outlet:modern?'Team beat reporter':'Basketball correspondent'},format:modern?'social':'print',text:HL.PublicVoices?.pick(L,`interview-news:${p.id}:${key}`,lines)||lines[0],likes:0,reposts:0}]});}
 function record(L,pid,tone,fullQuote,facts={}){
  const p=L.players[pid];if(HL.LiveGame?.active(L)||!owned(L,p)||(!tones[tone]&&tone!=='custom')||typeof fullQuote!=='string'||!fullQuote.trim()||fullQuote.length>2000)return fail('Record a valid public statement by your current player.');
  const d=state(L),source={id:++d.seq,pid,name:p.name,number:HL.jerseyNumber?.(p)??p.number,teamId:p.teamId,team:copy(L.teams[p.teamId]),season:L.season,day:L.day,tone,fullQuote,facts:copy(facts),fictional:true};d.statements.push(source);d.statements=d.statements.slice(-200);
  news(L,p,`${p.name}: the full interview`,fullQuote,'interview.statement',null);
  const sentences=fullQuote.split(/[.!?]/).map(s=>s.trim()).filter(Boolean);
  if(sentences.length>1&&(source.id===1||source.id%3===0)&&!d.threads.some(t=>t.source.pid===pid&&['open','watching'].includes(t.status))){
   const excerpt=sentences[0],format=L.season<2010?'print':'clip';
   const t={id:source.id,source:copy(source),excerpt,format,status:'open',response:null,games:0,appearances:0,pts:0,min:0,wins:0,seen:[]};d.threads.push(t);d.threads=d.threads.slice(-200);
   const framing=tone==='custom'?'It omits the rest of the answer; compare the full words before assigning a motive.':`Its framing ${tone==='humble'?'calls him unready':tone==='confident'?'calls him selfish':'suggests he wants out'} while omitting the rest of the answer.`;
   news(L,p,`${p.name}: an excerpt circulates`,`${format==='clip'?'A short quote clip':'A selected interview excerpt'} circulates: “${excerpt}”. ${framing} The full in-save statement is available to compare.`,'interview.excerpt',t.id);
   memory(L,p,'A selective interview excerpt drew attention; the full source is retained.',tone==='custom'?{}:{fans:-2,reputation:-2});
  }
  return {ok:true,source};
 }
 function hold(L,pid,tone,words){if(L.career)return fail('Career interviews come from your actual postgame scene.');if(!tones[tone]&&tone!=='custom')return fail('Choose an interview tone.');if(HL.LiveGame?.active(L)||!owned(L,L.players[pid])||!L.teams[L.userTeamId])return fail('Choose your current player.');if(words!=null&&(typeof words!=='string'||words.length>2000))return fail('Use at most 2,000 characters.');if(tone==='custom'&&!words?.trim())return fail('Write your actual answer.');const p=L.players[pid],recent=HL.PublicVoices?.recent(L,p),answer=words?.trim()?words:(tone==='confident'?(HL.PublicVoices?.pick(L,`franchise-confidence:${p.id}`,['I want those big moments. I am ready to take more responsibility.','I believe in what I can bring to this group. We have to show it on the floor.'])||'I believe in this group. We have to show it on the floor.'):HL.PublicVoices?.presser(L,p,tone,{min:recent?.min||0,pts:recent?.pts||0})||tones[tone]);return record(L,pid,tone,answer,{teamRecord:`${L.teams[L.userTeamId].w}–${L.teams[L.userTeamId].l}`,...(recent?{gid:recent.gid,pts:recent.pts,min:recent.min}:{})});}
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
