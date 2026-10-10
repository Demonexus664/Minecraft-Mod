// Film IQ: explain observed box-score factors, without claiming certainty.
// Results are fully derived from simulated possessions and strategy settings.
window.HL=window.HL||{};
HL.FilmIQ=(function(){
 const sum=side=>{
  const s={pts:side.score||0,fgm:0,fga:0,tpm:0,tpa:0,ftm:0,fta:0,orb:0,drb:0,tov:0,ast:0,stl:0,blk:0};
  for(const b of Object.values(side.box||{})){
   if(!b.gp)continue;
   for(const k of Object.keys(s))if(k!=='pts')s[k]+=Number(b[k])||0;
  }
  return s;
 };
 const percent=(a,b)=>b>0?Math.round(a/b*1000)/10:0;
 const signed=n=>(n>0?'+':'')+n;
 const esc=x=>HL.UI?.esc?HL.UI.esc(x):String(x??'').replace(/[&<>"']/g,c=>(
  {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function analyze(mySide,oppSide,plan={}){
   const my=sum(mySide),them=sum(oppSide);
   const measures={
    margin:my.pts-them.pts,
    fg:percent(my.fgm,my.fga),oppFg:percent(them.fgm,them.fga),
    three:percent(my.tpm,my.tpa),oppThree:percent(them.tpm,them.tpa),
    threes:my.tpm,allowedThrees:them.tpm,
    turnovers:my.tov,oppTurnovers:them.tov,
    rebounds:my.orb+my.drb,oppRebounds:them.orb+them.drb,
    assists:my.ast,oppAssists:them.ast
   };
   const flags=[];
   const add=(key,heading,detail,adjustment,weight)=>flags.push({key,heading,detail,adjustment,weight});
   if(my.tov-them.tov>=5)add('turnovers','Ball security',
     my.tov+' turnovers against '+them.tov+' forced. Extra giveaways took possessions off the board.',
     'Use a calmer offensive approach or a higher-IQ lead handler.',my.tov-them.tov);
   if(them.tpa>=18&&them.tpm>=9&&percent(them.tpm,them.tpa)>=41)
     add('perimeter','Perimeter containment',
       'Opponent hit '+them.tpm+'/'+them.tpa+' threes ('+measures.oppThree+'%). Perimeter help and closeouts deserve a look.',
       'Consider more switching and fewer unattended shooters.',(measures.oppThree-35)*.8);
   if(measures.oppRebounds-measures.rebounds>=7)
     add('glass','Possession battle',
       'Outrebounded '+measures.rebounds+' to '+measures.oppRebounds+
       '. The opponent had more chances to finish possessions.',
       'Test a stronger glass-crashing scheme or another true rebounder.',measures.oppRebounds-measures.rebounds);
   if(my.fga>=50&&measures.fg<=41)
     add('shotquality','Poor conversion',
       'Your team shot '+measures.fg+'% from the field on '+my.fga+' attempts.',
       'Review your shot profile and whether the defense is forcing bad looks.',41-measures.fg+6);
   if(my.ast<=them.ast-9)
     add('ballmovement','Creation gap',
       'Assist margin was '+my.ast+' to '+them.ast+'. Opponent creation produced more assisted baskets.',
       'Experiment with movement or playmaking specialists.',them.ast-my.ast);
   if(them.pts-my.pts>=12&&!flags.length)
     add('quality','Overall execution',
       'The opponent won by '+(them.pts-my.pts)+' despite no single extreme statistical mismatch.',
       'Review opponent strengths and reconsider matchup roles.',5);
   if(my.pts>them.pts&&my.pts-them.pts<=4)
     add('clutch','Narrow finish',
       'You escaped by '+(my.pts-them.pts)+' point'+(my.pts-them.pts===1?'':'s')+'.',
       'Look at defensive execution in close finishes before trusting this margin.',3);
   if(!flags.length)
     add('balanced','Balanced performance',
       'No extreme box-score weakness stood out. Single-game variance and matchups still matter.',
       'Compare several games before changing the whole scheme.',1);
   flags.sort((a,b)=>b.weight-a.weight);
   return {my,them,measures,flags:flags.slice(0,3),
     scheme:{pace:plan.pace??null,focus:plan.focus??null,defense:plan.defense??null,crash:plan.crash??null}};
 }
 function seasonFilm(games,schemes={}){
  const scored=games.filter(g=>g.film);
  const failures=scored.filter(g=>!g.win).sort((a,b)=>(a.for-a.against)-(b.for-b.against)).slice(0,5);
  const narrow=scored.filter(g=>g.win&&g.for-g.against<=4).slice(0,2);
  const featured=[...failures,...narrow].slice(0,6);
  const diagnostics={};
  for(const g of scored)for(const flag of g.film.flags){
   if(flag.key==='balanced'||flag.key==='clutch')continue;
   const v=diagnostics[flag.key]||{heading:flag.heading,adjustment:flag.adjustment,n:0};
   v.n++;diagnostics[flag.key]=v;
  }
  const findings=Object.values(diagnostics).sort((a,b)=>b.n-a.n).slice(0,4);
  const records=Object.entries(schemes).map(([name,v])=>({
   name,games:v.games,wins:v.wins,losses:v.games-v.wins,avgDiff:v.games?(v.pf-v.pa)/v.games:0
  })).sort((a,b)=>b.games-a.games);
  return {featured,findings,records};
 }
 function render(games,schemes={}){
  const data=seasonFilm(games,schemes);
  if(!games?.length)return '';
  const findings=data.findings.map(d=>'<div class="film-finding">'+
    '<b>'+esc(d.heading)+'</b><span>Observed in '+d.n+' game'+(d.n===1?'':'s')+'</span>'+
    '<p>'+esc(d.adjustment)+'</p></div>').join('');
  const coaches=data.records.map(p=>'<div class="film-coaching">'+
    '<div><b>'+esc(p.name)+'</b><small>'+p.games+' games with this defensive, offensive and pace combination</small></div>'+
    '<strong>'+p.wins+'-'+p.losses+'</strong>'+
    '<span class="'+(p.avgDiff>=0?'win':'loss')+'">'+signed(p.avgDiff.toFixed(1))+' net PPG</span></div>').join('');
  const gamesView=data.featured.map(g=>{
    const m=g.film.measures;
    return '<article class="film-breakdown '+(g.win?'win':'lost')+'">'+
      '<div class="caps">GAME '+g.g+' · '+esc(g.opp)+'</div>'+
      '<div class="film-score"><b>'+g.for+'</b><span>–</span><b>'+g.against+'</b></div>'+
      '<div class="film-compare"><span>FG '+m.fg+'% / '+m.oppFg+'%</span>'+
      '<span>3PM '+m.threes+' / '+m.allowedThrees+'</span>'+
      '<span>TOV '+m.turnovers+' / '+m.oppTurnovers+'</span>'+
      '<span>REB '+m.rebounds+' / '+m.oppRebounds+'</span></div>'+
      '<b class="film-key">FILM NOTE: '+esc(g.film.flags[0]?.heading||'No clear issue')+'</b>'+
      '<p>'+esc(g.film.flags[0]?.detail||'No clear issue.')+'</p>'+
      '</article>';
  }).join('');
  return '<section class="block film-iq"><header><h3>FILM IQ · THE GAME WITHIN THE GAME</h3>'+
    '<span class="ml-auto t3 sm">Box-score evidence + coaching choices</span></header>'+
    '<div class="body stack"><p class="t2 sm">What the possessions revealed. These are statistical patterns and coaching ideas, not guaranteed causes or boosts.</p>'+
    (findings?'<div class="caps">MOST FREQUENT CONCERNS</div><div class="film-findings">'+findings+'</div>':'')+
    '<div class="caps">GAME FILM · TOUGH LOSSES & CLOSE ESCAPES</div><div class="film-analysis-grid">'+
    (gamesView||'<p class="t3">The season did not have any losses or close escapes to dissect.</p>')+'</div>'+
    '<details><summary>COACHING SCHEME RESULTS · '+data.records.length+' DISTINCT COMBINATIONS</summary>'+
    '<div class="stack">'+(coaches||'<p class="t3">No coaching data recorded.</p>')+'</div></details>'+
    '</div></section>';
 }
 return {sum,analyze,seasonFilm,render};
})();
