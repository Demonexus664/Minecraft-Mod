from pathlib import Path
base=Path('/mnt/data/hoops-mutant-release')
def patch(rel,modify):
 p=base/rel;s=p.read_text();t=modify(s)
 if s==t:raise ValueError('Unchanged: '+rel)
 p.write_text(t); print('PATCHED',rel,len(s),'to',len(t))
def update820(s):
 a="function swap(a, b) { if (st.phase === 'season' || st.phase === 'result') return;"
 assert a in s
 s=s.replace(a,"function swap(a, b) { if (['season', 'result', 'playoffs'].includes(st.phase)) return;")
 a="if (st.phase === 'season' || st.phase === 'result' || card.classList.contains('down')) return;"
 assert a in s
 s=s.replace(a,"if (['season', 'result', 'playoffs'].includes(st.phase) || card.classList.contains('down')) return;")
 # A clutch two that ties the score forces a genuine overtime decision instead of a phantom loss.
 a="    g.hero=hero.name;g.play=move;g.made=made;g.odds=odds;\n    P.pending=null;finishPlayoffGame(g);"
 b="""    g.hero=hero.name;g.play=move;g.made=made;g.odds=odds;
    if (g.mine===g.theirs) {
      // Ties cannot be recorded as losses; play overtime on the same simulated
      // possession model and synchronize the visible score/quarter breakdown.
      const extra=HL.simGame(st.dream,{...g.opponent,players:HL.League.teamPlayers(g.opponent.id)},st.playoffRules);
      const extraMe=g.home?extra.home:extra.away,extraOpp=g.home?extra.away:extra.home;
      const margin=extraMe.score-extraOpp.score;
      const otMine=Math.max(6,Math.round(extraMe.score*.09));
      const otOpp=Math.max(6,otMine-(margin===0?(R.chance(.5)?2:-2):Math.sign(margin)*(-2)));
      // Preserve exactly one extra period with a clear winner.
      g.mine+=otMine;g.theirs+=otOpp;
      if (g.mine===g.theirs)g.mine+=R.chance(.5)?2:-2;
      const myBox=g.home?g.raw.home:g.raw.away,theirBox=g.home?g.raw.away:g.raw.home;
      myBox.score=g.mine;theirBox.score=g.theirs;
      myBox.quarters.push(otMine+(g.mine-g.theirs===0?2:0));
      theirBox.quarters.push(otOpp);
      g.overtime=true;
    }
    P.pending=null;finishPlayoffGame(g);"""
 assert a in s
 # Better OT: above uses sim another entire game to calibrate OT and chance, too expensive, but only small number of cases.
 s=s.replace(a,b)
 # Remove meaningless dead special team opponent code.
 s=s.replace("    const rareTeam=null;\n","").replace("    if(rareTeam) schedule[R.int(0,games-1)]=rareTeam;\n","")
 return s
def updateSkill(s):
 a="    const decline=age>w.end?(age-w.end)*(1.15+(99-c.prime.longevity)*.032):0;"
 b="""    // Exceptional longevity earns decades, not centuries. The late-life
    // attrition curve eventually outpaces even max longevity and stamina.
    // Retirement is still player-controlled; declining contract value, not a
    // hard scripted retirement date, closes the NBA market.
    const late=Math.max(0,age-55);
    const decline=(age>w.end?(age-w.end)*(1.15+(99-c.prime.longevity)*.032):0)+late*late*.09;"""
 assert a in s
 return s.replace(a,b)
def updateDNA(s):
 # Store active effects for all signature abilities (not just first three famous players), with bounded aggregate bonuses.
 a="    const active=[...signatures.slice(0,3),...sortedPairs.slice(0,4),...sortedTrios.slice(0,2),...mutations.slice(0,2)];"
 b="""    const active=[...signatures,...sortedPairs.slice(0,6),...sortedTrios.slice(0,4),...mutations.slice(0,3)];"""
 assert a in s
 s=s.replace(a,b)
 # Every famous historical signature card contributes its own small attribute-based twist to a Skill Draft player.
 a="    for(const fx of dna.active.filter(x=>x.type==='mutation'||x.type==='evolved'))for(const [k,b] of Object.entries(fx.boost))"
 b="    for(const fx of dna.active.filter(x=>x.type==='signature'||x.type==='mutation'||x.type==='evolved'))for(const [k,b] of Object.entries(fx.boost))"
 assert a in s
 s=s.replace(a,b)
 # Make large combinations uniquely labeled with player identity and categories (without renaming iconic historic combos).
 a="      const name=rel?.name || pattern?.[2] || `${pairNames[h%pairNames.length]} ${pairEnds[(h>>>6)%pairEnds.length]}`;"
 b="""      const name=rel?.name || pattern?.[2] || `${pairNames[h%pairNames.length]} ${pairEnds[(h>>>6)%pairEnds.length]} · ${[STARS[pa]?.name?.split(' ').pop()||pa,STARS[pb]?.name?.split(' ').pop()||pb].join(' × ')}`;"""
 assert a in s
 s=s.replace(a,b)
 a="      const name=rel?.name||`${pairNames[h%pairNames.length]} ${pairEnds[(h>>>9)%pairEnds.length]} · Trinity`;"
 b="""      const name=rel?.name||`${pairNames[h%pairNames.length]} ${pairEnds[(h>>>9)%pairEnds.length]} · ${ps.map(p=>STARS[p]?.name?.split(' ').pop()||p).join(' / ')}`;"""
 assert a in s
 s=s.replace(a,b)
 # Give every fictional combo a distinct *effects* footprint derived from player traits and chosen categories.
 a="      const bonus=rel?.bonus||pattern?.[4]||{[ca==='three'||cb==='three'?'three':ca==='reb'||cb==='reb'?'reb':ca==='pass'||cb==='pass'?'assist':'rim']:.007+(h%6)*.001};"
 b="""      const primary=ca==='three'||cb==='three'?'three':ca==='reb'||cb==='reb'?'reb':ca==='pass'||cb==='pass'?'assist':ca==='steal'||cb==='steal'?'steal':'rim';
      const secondary=['mid','transition','clutch','defense','assist','reb'][(h>>>8)%6];
      const bonus=rel?.bonus||pattern?.[4]||{[primary]:.007+(h%6)*.001,[secondary]:.002+(h%4)*.001};"""
 assert a in s
 s=s.replace(a,b)
 return s
patch('js/modes/challenge820.js',update820)
patch('js/modes/skilldraft.js',updateSkill)
patch('js/league/legend-dna.js',updateDNA)