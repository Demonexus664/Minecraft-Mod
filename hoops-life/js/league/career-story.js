// Outcome-driven career documentary. Every chapter is anchored to game results.
// It is deterministic per event, not random interchangeable praise.
window.HL=window.HL||{};
HL.Story=(function(){
 const safe=n=>Number.isFinite(n)?n:0;
 const n1=n=>safe(n).toFixed(1);
 const hash=s=>{let h=2166136261;for(const c of String(s))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
 const choose=(options,id)=>options[hash(id)%options.length];
 function landmark(c,s){
  const awards=(s.awards||[]).map(a=>a.award||a);
  if(s.injury?.games>=20)return {type:'setback',weight:95+s.injury.games,year:s.yr,text:choose([
    `The season stopped abruptly: ${s.injury.games} games were lost to ${s.injury.name}. The question shifted from awards to whether his body would respond.`,
    `There was no parade in ${s.yr}. ${s.injury.name} stole ${s.injury.games} games and left the next chapter in doubt.`],c.me.name+s.yr+'injury')};
  if(s.champion&&awards.includes('Finals MVP'))return {type:'dynasty',weight:115,year:s.yr,text:choose([
    `The ${s.team.name} finished the job. In a ${s.w}-${s.l} season, ${c.me.name} added Finals MVP to a championship, making that playoff run impossible to dismiss.`,
    `${s.yr} belonged to the ${s.team.name}. A ring and Finals MVP transformed a great year into a franchise-defining memory.`],c.me.name+s.yr+'finals')};
  if(awards.includes('MVP'))return {type:'peak',weight:99+s.ppg/4,year:s.yr,text:choose([
    `Voters couldn't look elsewhere. ${n1(s.ppg)} points, ${n1(s.rpg)} boards and ${n1(s.apg)} assists per game carried an MVP season.`,
    `An MVP changed the argument. In ${s.yr}, the box score read ${n1(s.ppg)}/${n1(s.rpg)}/${n1(s.apg)} and the league took notice.`],c.me.name+s.yr+'mvp')};
  if(s.w>=65&&!s.champion&&s.made)return {type:'collapse',weight:97,year:s.yr,text:choose([
    `${s.w} regular-season wins created championship expectations. The playoff exit turned a contender into the league's loudest what-if.`,
    `They won ${s.w} games and still couldn't finish the story. That disappointment became part of the team's legacy.`],c.me.name+s.yr+'collapse')};
  if((s.ppg||0)>=34)return {type:'scoring',weight:88,year:s.yr,text:`Nobody could ignore ${n1(s.ppg)} points per game in ${s.yr}; defenses knew who was shooting, yet the scoring kept coming.`};
  if(awards.includes('DPOY'))return {type:'lockdown',weight:82,year:s.yr,text:`A Defensive Player of the Year season was built on ${n1(s.rpg)} rebounds and ${n1((s.line?.stl||0)/Math.max(1,s.g))} steals per game. The impact went beyond scoring.`};
  if(!s.champion&&s.made&&s.playoffRound==='Finals')return {type:'heartbreak',weight:96,year:s.yr,text:`A Finals trip ended just short. For one summer, everything revolved around the final series and the opportunity that vanished.`};
  return null;
 }
 function documentary(c){
  const seasons=c.seasons.filter(s=>!s.minors&&s.g>0),events=[];
  if(!seasons.length)return {title:'The Career That Never Was',chapters:['The NBA never handed out the opportunity this build was made for.']};
  const debut=seasons[0],last=seasons[seasons.length-1],peak=seasons.reduce((a,b)=>((b.ppg||0)>(a.ppg||0)?b:a));
  events.push({type:'opening',weight:110,year:debut.yr,text:choose([
    `The story opened with ${n1(debut.ppg)} points a night for the ${debut.team.name}. The league hadn't decided what kind of player it was looking at yet.`,
    `Opening night was only the beginning. The ${debut.team.name} got ${n1(debut.ppg)} points, ${n1(debut.rpg)} rebounds and ${n1(debut.apg)} assists per game from a new arrival.`],c.me.name+debut.yr)});
  for(const season of seasons){const e=landmark(c,season);if(e)events.push(e);}
  for(const log of c.log||[])if(/signed|traded|re-signed|drafted/i.test(log.text)){
    const text=log.text.replace(/Re-signed with/, 'Chose to continue with');
    events.push({type:'movement',weight:/traded/i.test(text)?93:75,year:log.yr,text:`The next chapter changed the map: ${text}. The move reset expectations and reshaped the title chase.`});
  }
  for(const x of c.story||[])events.push({type:'decision',year:x.year,weight:101,text:x.text});
  events.push({type:'turningpoint',year:peak.yr,weight:90,text:`At his offensive peak in ${peak.yr}, ${c.me.name} averaged ${n1(peak.ppg)} points. The numbers were real; whether that was the best version of him remained a debate.`});
  if(last.yr!==debut.yr)events.push({type:'ending',year:last.yr,weight:100,text:`The last recorded season came in ${last.yr}, with ${n1(last.ppg)} points per game and a different role than the one he entered the league to play.`});
  const grouped=[...events].sort((a,b)=>b.weight-a.weight);
  const chosen=grouped.slice(0,10).sort((a,b)=>a.year-b.year||b.weight-a.weight);
  const titles=chosen.some(e=>e.type==='collapse')?'The Dynasty That Had to Answer':chosen.some(e=>e.type==='dynasty')?'Built for the Brightest Lights':chosen.some(e=>e.type==='setback')?'The Long Road Back':chosen.some(e=>e.type==='lockdown')?'The Unseen Advantage':'The League Was Never the Same';
  const debate=[
    `The case for greatness: ${c.rings} championships and ${c.awards.filter(a=>a.award==='MVP').length} MVP awards, alongside ${Math.round(c.totals.pts).toLocaleString()} regular-season points.`,
    `The counterargument: ${n1(c.totals.pts/Math.max(1,c.totals.g))} points per game over ${c.totals.g} appearances, influenced by teammates, era and the luck of postseason matchups.`,
  ];
  return {title:titles,chapters:chosen,debate,storyEvents:events.length};
 }
 function prompt(c){
  const s=c.seasons.at(-1);if(!s||s.minors||c.seasons.length<3)return null;
  if(c.story?.length && s.yr-c.story.at(-1).year<3)return null;
  const awards=(s.awards||[]).map(a=>a.award||a);
  const options=[];
  if(s.injury?.games>=18)options.push({type:'comeback',title:'The Road Back',subtitle:`${s.injury.name} took ${s.injury.games} games. The next season will test how you respond.`,a:'Prioritize recovery',b:'Push for a dramatic return'});
  if(s.w>=62&&!s.champion&&s.made)options.push({type:'revenge',title:'Unfinished Business',subtitle:`A ${s.w}-win team fell short of the title. Media pressure is building.`,a:'Embrace the championship pressure',b:'Let the game do the talking'});
  if(awards.includes('MVP')&&c.awards.filter(a=>a.award==='MVP').length>=2)options.push({type:'rival',title:'The League Challenges You',subtitle:'A rival questions whether anyone else will get a chance at the throne.',a:'Answer the challenge publicly',b:'Keep the rivalry on the court'});
  if(s.champion)options.push({type:'dynasty',title:'The Dynasty Question',subtitle:'The league wonders whether another run is possible, and free agency approaches.',a:'Promise to defend the crown',b:'Keep every option open'});
  if(!options.length || (hash(c.me.name+s.yr)%100)>=65)return null;
  return options[hash(`${c.me.name}:${s.yr}:decision`)%options.length];
 }
 function chooseDecision(c,selection){
  const evt=c.pendingStory;if(!evt)return;
  const year=c.seasons.at(-1)?.yr||c.yr;
  c.story ||= [];
  const a=selection==='a';
  const outcome={
    comeback:a?'A careful recovery plan helped protect his remaining stamina.':'He pushed to come back quickly, building a tougher but riskier reputation.',
    revenge:a?'He welcomed the pressure to bring home a title.':'He ignored the headlines and returned to work.',
    rival:a?'A new rivalry took over the sports pages after his public response.':'He avoided the headlines, saving his answer for their next matchup.',
    dynasty:a?'He publicly committed to chasing another championship together.':'He kept free agency open, and the rumors intensified.',
  }[evt.type];
  // Modest concrete consequences. These decisions complement natural aging,
  // but don't replace the skill-draft progression with an upgrade minigame.
  if(evt.type==='comeback')c.prime.attrs.dur=Math.min(100,c.prime.attrs.dur+(a?2:0));
  if(evt.type==='rival'||evt.type==='revenge'){
    c.prime.tendencies.shotHunt=Math.max(15,Math.min(95,(c.prime.tendencies.shotHunt||50)+(a?5:-3)));
    c.prime.attrs.clutchShot=Math.min(100,(c.prime.attrs.clutchShot||65)+(a?2:1));
  }
  if(evt.type==='dynasty'&&a)c.franchiseLoyalty=(c.franchiseLoyalty||0)+1;
  c.story.push({year,text:`${evt.title}. ${outcome}`,kind:evt.type,choice:selection});
  c.pendingStory=null;
 }
 return {documentary,prompt,chooseDecision};
})();