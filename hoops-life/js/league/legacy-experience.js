// Documentary-style scouting and historical evaluations. Every label is tied to
// the simulated box score, era baseline and/or actual roster attributes.
window.HL = window.HL || {};
HL.Legacy = (function () {
  const safe = (v, fallback=0) => Number.isFinite(v) ? v : fallback;
  const pct = (a,b) => b ? a/b : 0;
  const fixed = (n,dp=1) => safe(n).toFixed(dp);
  const count = (a,p) => a.filter(p).length;
  const lineStats = lines => Object.values(lines).reduce((t,l) => {
    for (const k of ['pts','fgm','fga','tpm','tpa','ftm','fta','ast','stl','blk','orb','drb','tov','min']) t[k] += safe(l[k]);
    return t;
  }, {pts:0,fgm:0,fga:0,tpm:0,tpa:0,ftm:0,fta:0,ast:0,stl:0,blk:0,orb:0,drb:0,tov:0,min:0});

  const gamePlans = {
    balanced: { title:'Positionless balance', caption:'Trust the matchup and let the best option emerge.', focus:'balanced', pace:50, defense:'man', crash:50 },
    pace: { title:'Seven-seconds mentality', caption:'Run the floor, attack before the defense settles.', focus:'motion', pace:90, defense:'press', crash:42 },
    arc: { title:'Three-point revolution', caption:'Stretch the floor and hunt efficient jumpers. Requires a three-point line.', focus:'perimeter', pace:64, defense:'switch', crash:35 },
    paint: { title:'Paint intimidation', caption:'Punish switches, control the glass, wear down the rim.', focus:'inside', pace:37, defense:'drop', crash:85 },
    clamp: { title:'Defensive pressure', caption:'Slow the game and try to suffocate every possession.', focus:'motion', pace:29, defense:'press', crash:65 },
    star: { title:'Superstar takeover', caption:'Give the ball to your most dangerous creator.', focus:'star', pace:53, defense:'man', crash:46 }
  };
  function teamReport(r, season, plan='balanced') {
    const g=Math.max(1,r.games), t=lineStats(r.lines), games=r.gameLog || [];
    const profile=HL.HISTORY?.profiles?.[season] || {};
    const threeLegal=season >= 1979;
    const threes=pct(t.tpa,t.fga), ts=pct(t.pts,2*(t.fga+.44*t.fta));
    const efg=pct(t.fgm+.5*t.tpm,t.fga), assist=pct(t.ast,t.fgm), margin=safe(r.pf)-safe(r.pa);
    const avgDunk=r.players?.length ? r.players.slice(0,5).reduce((a,p)=>a+safe(p.attrs.dunk,50),0)/5 : 0;
    const avgBurst=r.players?.length ? r.players.slice(0,5).reduce((a,p)=>a+safe(p.attrs.burst,50),0)/5 : 0;
    const closers=count(games,x=>Math.abs(x.for-x.against)<=5), closeWins=count(games,x=>x.win && Math.abs(x.for-x.against)<=5);
    const blowouts=count(games,x=>x.win && x.for-x.against>=20), heavyLosses=count(games,x=>!x.win && x.against-x.for>=15);
    const against=games.length ? [...games].sort((a,b)=>b.against-b.for-(a.against-a.for))[0] : null;
    const mostPoints=games.length ? [...games].sort((a,b)=>b.for-a.for)[0] : null;
    const biggestWin=games.length ? [...games].sort((a,b)=>(b.for-b.against)-(a.for-a.against))[0] : null;
    const labels=[];
    function award(name,why,qualifies) { if(qualifies) labels.push({name,why}); }
    award('Arc Architects',`${fixed(threes*100)}% of field-goal attempts came from deep; ${fixed(t.tpa/g)} attempts per game.`,threeLegal && t.tpa/g>=28 && (profile.tpar == null || threes>profile.tpar*1.15));
    award('Midnight Snipers',`${fixed(t.tpm/g)} made threes per night on ${(pct(t.tpm,t.tpa)*100).toFixed(1)}% shooting.`,threeLegal && t.tpm/g>=13 && pct(t.tpm,t.tpa)>=.36);
    award('Above-the-Rim Society',`Starting five average ${fixed(avgDunk,0)} dunk and ${fixed(avgBurst,0)} explosiveness grades (modeled scouting tools).`,avgDunk>=82 && avgBurst>=78);
    award('No-Fly Zone',`Opponents averaged ${fixed(r.pa)} points; ${fixed(t.blk/g)} blocks and ${fixed(t.stl/g)} steals per game.`,r.pa <= (safe(profile.ortg,113) * safe(profile.pace,100) / 100 - 6) && t.blk/g>=5);
    award('Ball-Movement Orchestra',`${fixed(assist*100)}% of made field goals were assisted; ${fixed(t.ast/g)} assists per game.`,assist>=.67 && t.ast/g>=24);
    award('Fortress of the Glass',`${fixed((t.orb+t.drb)/g)} rebounds per game with a bruising interior.`,(t.orb+t.drb)/g>=52 && t.orb/g>=12);
    award('Track Meet',`${fixed(r.pf)} points scored per game in a high-volume attack.`,r.pf>=safe(profile.ortg,113)*safe(profile.pace,100)/100+13 && r.pf>=110);
    award('Ice in the Veins',`${closeWins} victories in ${closers} games decided by five or fewer.`,closers>=7 && pct(closeWins,closers)>=.72);
    award('Relentless Juggernaut',`${blowouts} wins by 20+ and a ${fixed(margin)} scoring margin.`,blowouts>=15 && margin>=10);
    award('Historic Defensive Identity',`Opponents scored ${fixed(r.pa)} per game, ${fixed(margin)} net points per game.`,r.pa<safe(profile.ortg,113)*safe(profile.pace,100)/100-12 && margin>=8);
    if(!labels.length) labels.push({name:margin>=5?'Fundamentals First':margin>=0?'A Team of Contrasts':'An Identity Still Forming',why:`${fixed(margin)} average scoring margin, ${fixed(assist*100)}% assisted baskets and ${fixed(efg*100)}% effective field-goal shooting.`});
    const main=labels[0];
    const w=r.w, l=r.l;
    const summary = w === r.games ? `Perfection survived ${r.games} separate games, a rare combination of elite talent, tactics and luck.` : w>=70 ? `A regular-season powerhouse, but ${l} opponents found a way through.` : w>=55 ? `Built to contend. The ${l} losses revealed matchups worth studying.` : w>=42 ? `A competitive team with visible strengths and exploitable weaknesses.` : `The names looked formidable; the possessions exposed the fit.`;
    const narrative = [
      `${summary} Their defining identity: ${main.name.toLowerCase()}. ${main.why}`,
      `In ${season}-${String(season+1).slice(-2)}, the league baseline was ${profile.ts ? fixed(profile.ts*100)+'% TS' : 'not fully recorded'} and ${profile.pace ? fixed(profile.pace)+' possessions per 48 minutes' : 'a different historical pace environment'}. This team's ${fixed(ts*100)}% true shooting must be read in that context.`,
      `In games decided by five or fewer, the record was ${closeWins}-${closers-closeWins}. They also posted ${blowouts} wins by 20+; ${heavyLosses} defeats came by 15+.`,
      !threeLegal ? 'No three-point line existed in this NBA season. Long-range shooting only counted for two, changing which skills paid off.' : threeLegal && profile.tpar!=null ? `Their three-point attempt share was ${fixed(threes*100)}%, compared with the historical league mark of ${fixed(profile.tpar*100)}%.` : 'The three-point line was in use, with the scoring value of outside shooting reflected in the simulation.'
    ];
    return {primary:main,labels, summary,narrative,metrics:{threeRate:threes,ts,efg,assist,margin,closeWins,closers,blowouts,heavyLosses,ftRate:pct(t.fta,t.fga),turnovers:t.tov/g,steals:t.stl/g,blocks:t.blk/g,assists:t.ast/g,threes:t.tpm/g,attempts:t.tpa/g}, mostPoints,biggestWin, worst:against,plan:gamePlans[plan]||gamePlans.balanced};
  }

  // Recognition must be earned through long-run NBA production, not a single
  // imported 99 skill. Specialized titles never automatically confer GOAT status.
  function careerReport(c) {
    const seasons=c.seasons.filter(s=>!s.minors && s.g>=1);
    const T=c.totals||{}, n=seasons.length, g=Math.max(1,safe(T.g));
    const per=k=>safe(T[k])/g;
    const reb=per('reb'), pts=per('pts'), ast=per('ast'), steals=per('stl'), blocks=per('blk');
    const ts=pct(T.pts,2*(safe(T.fga)+.44*safe(T.fta)));
    const p3=pct(T.tpm,T.tpa);
    const m3=per('tpm');
    const max = fn => Math.max(0,...seasons.map(fn));
    const peakPts=max(s=>s.ppg||s.line?.pts/Math.max(s.g,1)||0);
    const peakAst=max(s=>s.apg||s.line?.ast/Math.max(s.g,1)||0);
    const peakDef=max(s=>(safe(s.line?.blk)+safe(s.line?.stl))/Math.max(1,s.g));
    const ring=safe(c.rings), mvp=count(c.awards||[],a=>a.award==='MVP'), dpoy=count(c.awards||[],a=>a.award==='DPOY');
    const titles=[];
    const add=(name,description,works,basis) => {if(works)titles.push({name,description,basis});};
    add('Generational Three-Point Shooter',`${fixed(m3)} made threes per game on ${fixed(p3*100)}% shooting across ${safe(T.tpm).toLocaleString()} career makes.`,n>=6&&T.tpm>=1800&&p3>=.385&&m3>=2.8,'career volume and efficiency');
    add('All-Time Mid-Range Artisan',`A specialist in creating difficult pull-ups and fadeaways through ${n} NBA seasons.`,n>=7&&c.prime.attrs.mid>=94&&c.prime.attrs.fade>=90&&per('fgm')>=7&&pts>=22,'scouting skill plus real scoring production (shot-zone attempts not tracked)');
    add('Historic Interior Defender',`${fixed(blocks)} blocks and ${fixed(steals)} steals per game; ${dpoy} DPOY awards.`,n>=7&&T.g>=400&&(blocks>=2.4||dpoy>=2)&&safe(c.prime.attrs.intD)>=86,'career defensive production');
    add('Perimeter Lockdown Legend',`${fixed(steals)} steals per game and ${dpoy} DPOY awards.`,n>=7&&T.g>=400&&(steals>=2.1||dpoy>=2)&&safe(c.prime.attrs.perD)>=86,'career defensive production');
    add('Rim-Pressure Icon',`${fixed(pts)} career points per game, with elite finishing traits.`,n>=7&&pts>=25&&safe(c.prime.attrs.dunk)>=92&&safe(c.prime.attrs.contactFinish)>=87,'career scoring and estimated finishing tools');
    add('Floor General',`${fixed(ast)} assists per game, ${Math.round(safe(T.ast)).toLocaleString()} career assists.`,n>=7&&T.ast>=5000&&ast>=8,'career passing production');
    add('Board Sovereign',`${fixed(reb)} rebounds per game, ${Math.round(safe(T.reb)).toLocaleString()} career rebounds.`,n>=7&&T.reb>=8000&&reb>=12,'career rebounding production');
    add('Scoring Machine',`${fixed(pts)} points per game; best season ${fixed(peakPts)} PPG.`,n>=7&&T.pts>=16000&&pts>=27&&peakPts>=30,'career scoring volume');
    add('Ironman',`${n} NBA seasons and ${Math.round(safe(T.g)).toLocaleString()} regular-season games.`,n>=17&&T.g>=1150,'career duration and availability');
    add('Playoff Tested',`${ring} championships and ${Math.round(safe(c.ptotals?.g))} playoff games.`,ring>=3&&safe(c.ptotals?.g)>=100,'playoff appearance and titles');
    add('The Peak',`Highest scoring year ${fixed(peakPts)} PPG; highest playmaking year ${fixed(peakAst)} APG.`,n>=4&&peakPts>=32&&peakAst>=7,'peak season production');
    if(!titles.length && n) add('Respected Pro',`${n} NBA seasons, ${Math.round(safe(T.pts)).toLocaleString()} career points.`,true,'NBA participation');
    const chapters=[];
    if(!n) chapters.push('He never got an NBA box score. The blueprint was interesting, but opportunity and readiness never met.');
    else {
      const debut=seasons[0], best=seasons.slice().sort((a,b)=>(b.ppg||0)-(a.ppg||0))[0];
      chapters.push(`The arrival: ${debut.yr}-${String(debut.yr+1).slice(-2)} opened with ${fixed(debut.ppg)} PPG and a ${debut.w}-${debut.l} team record. The early seasons set a standard that every later year had to answer.`);
      chapters.push(`The scoring peak came in ${best.yr}-${String(best.yr+1).slice(-2)}: ${fixed(best.ppg)} points, ${fixed(best.rpg)} rebounds, ${fixed(best.apg)} assists per game. The prime was measured in possessions converted, not a card rating.`);
      chapters.push(`${ring ? `He earned ${ring} championship${ring===1?'':'s'}.` : 'He never won a championship.'} ${mvp ? `Voters named him MVP ${mvp} time${mvp===1?'':'s'}.` : 'He did not win MVP.'} A great individual run and an all-time team achievement are different questions.`);
      chapters.push(`Career efficiency: ${fixed(ts*100)}% true shooting with ${fixed(per('tov'))} turnovers per game. Scoring volume came with trade-offs in ball security, shot diet and teammate opportunity.`);
      const teamStr = (c.teams||[]).length;
      if(teamStr>1)chapters.push(`The journey passed through ${teamStr} franchises. A different roster and role meant a different version of the same player.`);
      const changes=(c.altered||[]).length;
      if(changes)chapters.push(`${changes} recorded changes to the historical title picture. His career did not follow the original timeline.`);
    }
    const goatQualified=n>=10 && safe(T.g)>=700 && mvp>=3 && ring>=2 && safe(c.ptotals?.g)>=85 && (pts>=24||ast>=9||reb>=13) && safe(c.legacy?.rank,999)>=1 && safe(c.legacy?.rank,999)<=3;
    return {titles,chapters,metrics:{n,pts,ast,reb,steals,blocks,ts,p3,m3,peakPts,peakAst,peakDef,mvp,dpoy,ring},goatQualified};
  }
  return { gamePlans, teamReport, careerReport };
})();
