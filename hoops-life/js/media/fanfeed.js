// Courtside feed: grounded, fictional fan/analyst reactions to actual simulated
// events in 82-0 and Skill Draft. No real social accounts or fabricated news.
window.HL=window.HL||{};
HL.FanFeed=(function(){
  const safe=x=>String(x??'');
  const one=(who,role,text,mood='neutral')=>({who,role,text:safe(text),mood});
  function season82(r){
    if(!r)return [];
    const posts=[];
    const w=r.w||0,l=r.l||0,g=r.games||82;
    const record=w+'-'+l,margin=(r.pf||0)-(r.pa||0);
    posts.push(one('The Baseline','STATS DESK',
      record+' on the year. '+(r.pf||0).toFixed(1)+' scored, '+(r.pa||0).toFixed(1)+
      ' allowed per game. That is a '+(margin>=0?'+':'')+margin.toFixed(1)+' net margin.'));
    if(!l)posts.push(one('Full Court Theory','FAN',
      'Every team in the league took a shot. Nobody won. '+record+' is going on the wall.', 'hype'));
    else{
      const first=r.firstLoss;
      posts.push(one('Receipt Department','SKEPTIC',
        'The undefeated talk stopped at game '+(first?.g||'?')+
        (first?.opp?.name?' against '+first.opp.name:'')+'. Now tell us what happened after that.', 'heat'));
      if(w/g>=.85)posts.push(one('Baseline Scout','ANALYST',
        'Not undefeated, still historically dominant. Every season has a weak night. This team had '+l+'.'));
    }
    const takeover=(r.gameLog||[]).filter(g=>g.hero)
      .sort((a,b)=>b.hero.pts-a.hero.pts)[0];
    if(takeover?.hero?.pts>=40)posts.push(one('Hoop Tape','HIGHLIGHT WATCH',
      takeover.hero.name+' just went for '+takeover.hero.pts+' against '+takeover.opp+
      '. This was not just a good roster. Somebody took over that game.', 'hype'));
    if((r.closeGames||0)>=3)posts.push(one('Last Two Minutes','CLUTCH DESK',
      (r.closeWins||0)+' wins in '+r.closeGames+' games decided by five or fewer. '+
      ((r.closeWins||0)>r.closeGames*.65?'They actually know how to close.':'Late-game execution is still a problem.'),
      (r.closeWins||0)>r.closeGames*.65?'hype':'heat'));
    const beaten=(r.bosses||[]).filter(b=>b.win);
    if(beaten.length)posts.push(one('Rival Watch','GAUNTLET REPORT',
      'They eliminated '+beaten.length+' of '+r.bosses.length+' boss matchups. '+
      beaten.map(b=>b.opp).slice(0,2).join(' and ')+' felt it.', 'hype'));
    const loss=(r.losses||[]).slice().sort((a,b)=>a.g-b.g)[0];
    if(loss&&l>=3)posts.push(one('Coaches Clipboard','TACTICAL RECAP',
      'No fantasy about invincibility here. '+l+' losses, and at least one answer the coaching staff still owes.', 'heat'));
    if(r.mission)posts.push(one('Challenge Office','SEASON OBJECTIVE',
      r.mission.title+' · '+(r.mission.completed?'objective cleared.':'objective failed.')+
      ' The simulation had the final vote.',r.mission.completed?'hype':'heat'));
    return posts.slice(0,7);
  }

  function skilldraft(s){
    if(!s||s.minors)return [];
    const posts=[];
    const ppg=(s.ppg||0).toFixed(1),apg=(s.apg||0).toFixed(1),rpg=(s.rpg||0).toFixed(1);
    posts.push(one('The Baseline','BOX SCORE DESK',
      (s.team?.name||'The team')+' finished '+s.w+'-'+s.l+'. Your player: '+ppg+
      ' PPG, '+rpg+' RPG, '+apg+' APG.'));
    if((s.counts?.g50||0)>0)posts.push(one('Hoop Tape','HIGHLIGHT WATCH',
      s.counts.g50+' fifty-point game'+(s.counts.g50>1?'s':'')+
      ' this season. Defenses are seeing this build in their sleep.', 'hype'));
    else if((s.counts?.td||0)>0)posts.push(one('Possession Nerd','ALL-AROUND FILM',
      s.counts.td+' triple-double'+(s.counts.td>1?'s':'')+
      '. Not every impact play shows up in the scoring column.', 'hype'));
    if(s.rival)posts.push(one('Rival Watch','MVP RACE',
      (s.rival.win?'Your player got the better of ':'The rival took this round: ')+
      s.rival.name+'. '+s.rival.myScore.toFixed(1)+' versus '+
      s.rival.theirScore.toFixed(1)+' in voting-impact value.',
      s.rival.win?'hype':'heat'));
    if(s.pressResult)posts.push(one('Press Room','PROMISE RECEIPTS',
      (s.pressResult.won==null?'The named rival was not eligible this year; there is no penalty.':s.pressResult.won?'The player backed up the quote.':'The clip came back around after the season.')+
      ' '+s.pressResult.measure+'. Approval '+(s.pressResult.impact>0?'+':'')+s.pressResult.impact+'.',
      s.pressResult.won?'hype':'heat'));
    if(s.agenda)posts.push(one('Contract Desk','SEASON CONTRACT',
      s.agenda.title+': '+(s.agenda.complete?'mission accomplished, extra summer development earned.':
        'missed the target, no bonus training session.'),s.agenda.complete?'hype':'neutral'));
    if(s.champion)posts.push(one('The Banner Room','PLAYOFF REACTION',
      'The title is real in this timeline. '+s.series.filter(x=>!x.bye).length+
      ' rounds and a banner to show for it.','hype'));
    else if(s.made&&s.series?.length)posts.push(one('Rings or Nothing','POSTSEASON TALK',
      'An exit in '+(s.series.filter(x=>!x.bye).slice(-1)[0]?.name||'the playoffs')+
      '. The regular season is not the last word.', 'heat'));
    if(s.awards?.some(a=>(a.award||a)==='MVP'))posts.push(one('Hardware Watch','AWARDS',
      'MVP hardware on the shelf. The league had to vote on what they saw.','hype'));
    if(s.injury?.games>=15)posts.push(one('Availability Report','HEALTH DESK',
      'Missed '+s.injury.games+' games with '+s.injury.name+
      '. Availability is part of a career, especially with this much responsibility.','heat'));
    return posts.slice(0,7);
  }

  function render(posts){
    if(!posts?.length)return '';
    const esc=HL.UI?.esc||((x)=>safe(x).replace(/[&<>"']/g,c=>({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    })[c]));
    return '<section class="block fanfeed"><header><h3>COURTSIDE · IN-GAME REACTIONS</h3>'+
      '<span class="ml-auto t3 sm">Your timeline is talking</span></header>'+
      '<div class="body stack"><p class="t3 sm">Fictional game-universe voices reacting to the actual simulated results.</p>'+
      '<div class="fanfeed-list">'+posts.map(p=>'<article class="fan-post '+esc(p.mood)+'">'+
      '<div class="fan-post-avatar">'+esc(p.who[0])+'</div><div class="fan-post-content">'+
      '<div class="row wrap"><b>'+esc(p.who)+'</b><span class="t3 sm">'+esc(p.role)+'</span></div>'+
      '<p>'+esc(p.text)+'</p></div></article>').join('')+'</div></div></section>';
  }
  return {season82,skilldraft,render};
})();
