from pathlib import Path
p=Path('/mnt/data/hoops-mutant-release/js/modes/challenge820.js');s=p.read_text()
def put(a,b):
 global s
 n=s.count(a)
 if n!=1:raise Exception((n,a[:100]))
 s=s.replace(a,b)
put('    st.playoffTeams=L.teams;', '    st.playoffTeams=L.teams;st.playoffRules=Object.assign({},L.rules,{profile:L.profile});')
put('    const schedule = R.shuffle(Array.from({ length: games }, (_, i) => opps[i % opps.length]));', '    const schedule = R.shuffle(Array.from({ length: games }, (_, i) => opps[i % opps.length]));')
# first loss must ask, not just continue automatically; use one real user interaction
put("      if (!won && l === 1) { const s = q('.ticker .status'); if (s) { s.textContent = `Perfect season over · game ${g + 1} vs the ${opp.name}`; s.classList.add('over'); } FX.shake(q('.ticker'), 0.8); }", '''      if (!won && l === 1) {
        const status=q('.ticker .status');if(status){status.textContent=`First loss · Game ${g+1} vs ${opp.name}`;status.classList.add('over');}
        FX.shake(q('.ticker'),0.8);
        if(q('.ticker')){
          const decision=document.createElement('div');decision.className='dna-first-loss';
          decision.innerHTML=`<b>The perfect season is over.</b><p>Continue chasing 73 wins, a championship and your team's legacy, or restart the challenge?</p><button class="btn go" data-keep>Continue the season</button> <button class="btn" data-restart>Restart</button>`;
          q('.ticker').appendChild(decision);
          const continueRun=await new Promise(done=>{decision.querySelector('[data-keep]').onclick=()=>done(true);decision.querySelector('[data-restart]').onclick=()=>done(false);});
          decision.remove();
          if(!continueRun){st=null;render();return;}
        }
      }''')
put('      ${identityReport(r)}', '''      ${identityReport(r)}
      <section class="block"><header><h3>Postseason: The second challenge</h3></header><div class="body stack"><p>Now take your drafted superteam through four best-of-seven playoff series, one game at a time. Close finishes can become interactive clutch possessions. The regular-season 82–0 record stays separate.</p><button class="btn go" data-start-playoffs>Start the playoffs</button>${st.playoffs?.completed?`<p>${st.playoffs.champion?'NBA CHAMPIONS':'Playoff run ended'} · ${st.playoffs.history.length} games played.</p>`:''}</div></section>''')
# Bind click handlers
put('    const pl = app.querySelector(\'[data-play]\'); if (pl) pl.onclick = () => playSeason();', '''    const pl = app.querySelector('[data-play]'); if (pl) pl.onclick = () => playSeason();
    app.querySelectorAll('[data-start-playoffs]').forEach(b=>b.onclick=()=>{startPlayoffs();render();});
    app.querySelectorAll('[data-playoff-game]').forEach(b=>b.onclick=()=>playPlayoffGame());
    app.querySelectorAll('[data-final-possession]').forEach(b=>b.onclick=()=>resolvePlayoffClutch(b.dataset.finalPossession));''')
# insert playoffs engine before achievements
mark='  // ---------- achievements ----------'
if s.count(mark)!=1:raise Exception('mark')
ins='''  // ---------- Postseason side quest: game by game, four best-of-seven series ----------
  const ROUND_TITLES=['First round','Conference semifinals','Conference finals','NBA Finals'];
  function startPlayoffs(){
    const pool=(st.playoffTeams||[]).slice().sort((a,b)=>(b.real?.w||0)-(a.real?.w||0));
    const without=pool.filter(t=>t.id!==999);
    const chosen=[];
    // Escalating opposition rather than four arbitrary repeat matches.
    for(const slot of [Math.min(7,without.length-1),Math.min(3,without.length-1),Math.min(1,without.length-1),0]){
      const opp=without[slot]||R.pick(without);if(opp&&!chosen.some(x=>x.id===opp.id))chosen.push(opp);
      else{const alt=without.find(t=>!chosen.some(x=>x.id===t.id));if(alt)chosen.push(alt);}
    }
    st.playoffs={round:0,wins:0,losses:0,opponents:chosen,history:[],pending:null,last:null,completed:false,champion:false};
    st.phase='playoffs';
  }
  function finishPlayoffGame(result){
    const P=st.playoffs,winner=result.mine>result.theirs;winner?P.wins++:P.losses++;
    P.last={...result,winner,round:ROUND_TITLES[P.round],series:`${P.wins}-${P.losses}`};
    P.history.push(P.last);
    if(P.wins===4){if(P.round>=3){P.completed=true;P.champion=true;}else{P.round++;P.wins=0;P.losses=0;}}
    if(P.losses===4){P.completed=true;P.champion=false;}
    if(P.completed){st.result.playoffRun=P.history.slice();st.result.champion=P.champion;}
    render();
  }
  function playPlayoffGame(){
    const P=st.playoffs;if(!P||P.completed||P.pending)return;
    const opp=P.opponents[P.round],players=HL.League.teamPlayers(opp.id);
    const home=(P.wins+P.losses)%2===0;
    const guest={...opp,players,customPlayers:players,strategy:opp.strategy||HL.DEFAULT_STRATEGY()};
    const raw=home?HL.simGame(st.dream,guest,st.playoffRules):HL.simGame(guest,st.dream,st.playoffRules);
    const me=home?raw.home:raw.away,rival=home?raw.away:raw.home;
    const game={mine:me.score,theirs:rival.score,opp:opp.name,opponent:opp,raw,home,game:P.history.length+1,hero:null,play:null,made:null};
    // In close games, one final meaningful offensive possession can matter.
    // The sim result is held until the selected possession has been resolved.
    if(Math.abs(game.mine-game.theirs)<=3 && st.dream.players.length){P.pending=game;render();return;}
    finishPlayoffGame(game);
  }
  function resolvePlayoffClutch(move){
    const P=st.playoffs,g=P?.pending;if(!g)return;
    const sel=document.querySelector('[data-playoff-shooter]'),hero=st.dream.players.find(p=>p.id===+(sel?.value))||st.dream.players[0];
    const attr=move==='three'?'three':move==='fade'?'fade':move==='pass'?'pass':'contactFinish';
    const value=move==='three'?3:2,skill=hero.attrs[attr]||65;
    const defender=HL.League.teamPlayers(g.opponent.id).sort((a,b)=>b.ovr-a.ovr)[0];
    const d=defender?.attrs?.perD||75;
    const situational=(hero.dna?.effects?.[move==='three'?'three':move==='fade'?'mid':move==='pass'?'assist':'rim']||0);
    const odds=HL.clamp(.3+(skill-70)*.006+(hero.attrs.clutchShot-65)*.0012-(d-75)*.0012+situational,.16,.78);
    const made=R.chance(odds);
    if(made){g.mine+=value;
      const myBox=g.home?g.raw.home:g.raw.away;
      const line=myBox.box[hero.id];if(line){line.pts+=value;line.fgm++;line.fga++;if(value===3){line.tpm++;line.tpa++;}}
      myBox.score=g.mine;myBox.quarters[myBox.quarters.length-1]+=value;
    }
    g.hero=hero.name;g.play=move;g.made=made;g.odds=odds;
    P.pending=null;finishPlayoffGame(g);
  }
  function playoffView(){
    const P=st.playoffs,opp=P.opponents[Math.min(P.round,3)],last=P.last;
    const pending=P.pending;
    const chooser=pending?`<article class="dna-playoff-clutch"><div class="dna-section-label">THE FINAL POSSESSION</div><h3>One possession can change the series.</h3><p>${esc(pending.opp)} · ${pending.mine}-${pending.theirs}. Choose your closer and move. Matchups, clutch ratings and DNA effects determine the outcome.</p><label>Closer <select data-playoff-shooter>${st.dream.players.slice(0,8).map(p=>`<option value="${p.id}">${esc(p.name)} · ${p.ovr} OVR</option>`).join('')}</select></label><div class="row wrap">${[['three','Deep three'],['fade','Fadeaway'],['drive','Attack the rim'],['pass','Create with a pass']].map(([k,label])=>`<button class="btn" data-final-possession="${k}">${label}</button>`).join('')}</div></article>`:'';
    return `<div class="stack" style="gap:13px"><section class="block"><div class="body stack"><div class="caps">82-0 · Postseason side quest</div><h2>${P.completed?(P.champion?'NBA CHAMPIONS':'THE RUN ENDS'):ROUND_TITLES[P.round]}</h2><p>${P.completed?'Final postseason report below':`${esc(opp.name)} · series ${P.wins}-${P.losses} · first to four wins`}</p>${!P.completed&&!pending?'<button class="btn go big" data-playoff-game>Sim next playoff game</button>':''}${chooser}${last?`<div class="dossier-honor"><div class="caps">Last playoff game · ${esc(last.round)}</div><h3>${last.winner?'WIN':'LOSS'} ${last.mine}-${last.theirs} vs ${esc(last.opp)}</h3>${last.hero?`<p>${esc(last.hero)} ${last.made?'made':'missed'} the final ${esc(last.play)} attempt (${Math.round(last.odds*100)}% modeled chance).</p>`:''}</div>`:''}</div></section><section class="block"><header><h3>Playoff game log</h3></header><div class="body"><div class="scouting-games">${P.history.map((g,i)=>`<div class="kv"><span>${i+1}. ${esc(g.round)} vs ${esc(g.opp)}</span><b>${g.winner?'W':'L'} ${g.mine}-${g.theirs}</b></div>`).join('')||'<p>Your first playoff game awaits.</p>'}</div></div></section>${HL.DNA.board(st.dna,{compact:true})}${P.completed?`<button class="btn go" data-finish-playoffs>Return to your season Verdict</button>`:''}</div>`;
  }

'''
s=s.replace(mark,ins+mark)
put("    app.querySelectorAll('[data-start-playoffs]').forEach(b=>b.onclick=()=>{startPlayoffs();render();});", "    app.querySelectorAll('[data-start-playoffs]').forEach(b=>b.onclick=()=>{startPlayoffs();render();});\n    app.querySelectorAll('[data-finish-playoffs]').forEach(b=>b.onclick=()=>{st.phase='result';render();});")
p.write_text(s)