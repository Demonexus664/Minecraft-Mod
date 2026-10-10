window.HL = window.HL || {};
// Legacy report engine. Specialty honors require long-run production, not only a card rating.
HL.Legacy = (function () {
  const div=(a,b)=>b?a/b:0, fixed=x=>(Number.isFinite(x)?x:0).toFixed(1);
  const plans={
    balanced:{title:"Positionless balance",focus:"balanced",pace:50,defense:"man",crash:50},
    pace:{title:"Fast-break attack",focus:"motion",pace:90,defense:"press",crash:42},
    arc:{title:"Three-point revolution",focus:"perimeter",pace:64,defense:"switch",crash:35},
    paint:{title:"Paint domination",focus:"inside",pace:37,defense:"drop",crash:85},
    clamp:{title:"Defensive pressure",focus:"motion",pace:29,defense:"press",crash:65},
    star:{title:"Superstar takeover",focus:"star",pace:53,defense:"man",crash:46}
  };
  function teamReport(r,yr,plan) {
    const values=Object.values(r.lines),g=Math.max(1,r.games);
    const total=k=>values.reduce((n,l)=>n+(Number(l[k])||0),0);
    const attempts=total("fga"),threes=total("tpa"),made=total("tpm"),assists=total("ast"),fgm=total("fgm"),blocks=total("blk"),steals=total("stl");
    const tRate=div(threes,attempts),ts=div(total("pts"),2*(attempts+.44*total("fta"))),astRate=div(assists,fgm),margin=r.pf-r.pa;
    const prof=HL.HISTORY && HL.HISTORY.profiles && HL.HISTORY.profiles[yr] || {};
    const leaguePts=(prof.ortg||112)*(prof.pace||99)/100;
    const games=r.gameLog||[],close=games.filter(x=>Math.abs(x.for-x.against)<=5),clW=close.filter(x=>x.win).length,blow=games.filter(x=>x.win&&x.for-x.against>=20).length;
    const badges=[];const add=(name,proof,valid)=>{if(valid)badges.push({name,proof});};
    add("Arc Architects",fixed(threes/g)+" three-point attempts per game, "+fixed(100*tRate)+"% of all shots.",yr>=1979&&threes/g>=28&&tRate>Math.max(.30,(prof.tpar||.25)*1.14));
    add("Snipers",fixed(made/g)+" made threes per game on "+fixed(100*div(made,threes))+"% accuracy.",yr>=1979&&made/g>=12&&div(made,threes)>=.36);
    add("Ball-Movement Orchestra",fixed(100*astRate)+"% assisted baskets and "+fixed(assists/g)+" assists per game.",astRate>.66&&assists/g>=24);
    add("No-Fly Zone",fixed(r.pa)+" points conceded, "+fixed(blocks/g)+" blocks per game.",r.pa<leaguePts-7&&blocks/g>=5);
    add("Above-the-Rim Society","Starting five combines dunking and burst.",r.players.slice(0,5).reduce((s,p)=>s+(p.attrs.dunk||0),0)/5>=83);
    add("Relentless Juggernaut",blow+" wins by 20+ with a "+fixed(margin)+" scoring margin.",blow>=15&&margin>=10);
    add("Ice in the Veins",clW+" close wins in "+close.length+" games decided by five points.",close.length>=6&&clW/close.length>.7);
    if(!badges.length)badges.push({name:"A Team with its Own Identity",proof:fixed(margin)+" scoring margin, "+fixed(100*ts)+"% true shooting."});
    const best=games.slice().sort((a,b)=>(b.for-b.against)-(a.for-a.against))[0];
    return {badges,closeWins:clW,closeGames:close.length,blowouts:blow,threeRate:tRate,ts,assists:assists/g,blocks:blocks/g,steals:steals/g,best,plan:plans[plan]||plans.balanced,leaguePts,margin};
  }
  function careerReport(c) {
    const seasons=(c.seasons||[]).filter(s=>!s.minors&&s.g>0),n=seasons.length,T=c.totals||{},g=Math.max(1,T.g||0);
    const per=k=>(T[k]||0)/g;
    const pts=per("pts"),reb=per("reb"),ast=per("ast"),stl=per("stl"),blk=per("blk");
    const ts=div(T.pts,2*((T.fga||0)+.44*(T.fta||0))),threePct=div(T.tpm,T.tpa),threeMakes=per("tpm");
    const award=name=>(c.awards||[]).filter(x=>x.award===name).length;
    const mvp=award("MVP"),ring=c.rings||0,dpoy=award("DPOY");
    const honors=[];const add=(name,why,condition)=>{if(condition)honors.push({name,why});};
    add("Generational Shooter",fixed(threeMakes)+" threes per game at "+fixed(100*threePct)+"%, "+(T.tpm||0)+" career makes.",n>=6&&(T.tpm||0)>=1800&&threePct>=.385&&threeMakes>=2.8);
    add("Mid-Range Artisan","Elite mid-range scouting traits backed by "+fixed(pts)+" career PPG.",n>=7&&(c.prime?.attrs?.mid||0)>=94&&pts>=22);
    add("Defensive Legend",fixed(blk)+" blocks and "+fixed(stl)+" steals per game, "+dpoy+" DPOY trophies.",n>=7&&g>=400&&(blk>=2.5||stl>=2.2||dpoy>=3));
    add("Rim-Pressure Icon",fixed(pts)+" career PPG with an elite finishing grade.",n>=7&&pts>=25&&(c.prime?.attrs?.dunk||0)>=92);
    add("Floor General",fixed(ast)+" assists per game and "+(T.ast||0)+" for the career.",n>=7&&(T.ast||0)>=5000&&ast>=8);
    add("Board Sovereign",fixed(reb)+" rebounds per game across "+n+" seasons.",n>=7&&(T.reb||0)>=8000&&reb>=12);
    add("Scoring Machine",fixed(pts)+" career PPG with "+(T.pts||0)+" total points.",n>=7&&(T.pts||0)>=16000&&pts>=27);
    add("Ironman",n+" seasons and "+(T.g||0)+" regular-season games.",n>=17&&(T.g||0)>=1150);
    add("Playoff Proven",ring+" championships over "+n+" seasons.",ring>=3&&(c.ptotals?.g||0)>=100);
    const best=seasons.slice().sort((a,b)=>(b.ppg||0)-(a.ppg||0))[0];
    const peak=best?best.ppg:0;
    const goatQualified=n>=10&&g>=700&&mvp>=3&&ring>=2&&(c.ptotals?.g||0)>=85&&(pts>=24||ast>=9||reb>=13)&&(c.legacy?.rank||999)<=3;
    const chapters=[
      n?"Debut season: "+seasons[0].yr+" with "+fixed(seasons[0].ppg||0)+" points per game.":"The career never reached the NBA.",
      best?"Scoring peak: "+fixed(peak)+" PPG in "+best.yr+"-"+(best.yr+1)+".":"No NBA scoring season.",
      "The resume contains "+ring+" championships, "+mvp+" MVPs and "+dpoy+" Defensive Player of the Year awards.",
      "Efficiency and selection: "+fixed(100*ts)+"% true shooting, "+fixed(100*threePct)+"% from three on "+(T.tpa||0)+" attempts.",
      (c.teams?.length||0)+" franchise stops and "+(c.altered?.length||0)+" altered historical outcomes."
    ];
    return {honors,chapters,goatQualified,pts,reb,ast,blk,stl,ts,best,n,mvp,dpoy,ring};
  }
  return {gamePlans:plans,teamReport,careerReport};
})();