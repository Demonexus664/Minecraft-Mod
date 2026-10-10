// Scouting dossiers, a saved lottery reveal and a playable draft-night desk.
window.HL = window.HL || {};
HL.DraftRoomUI = (function () {
  const U=HL.UI,D=HL.DraftRoom,esc=U.esc,L=()=>HL.League.get();
  const manager=()=>L().userTeamId!=null&&L().settings.role!=='coach';
  const club=id=>L().teams.find(t=>t.id===id);
  const range=r=>r.join('–');
  function card(p) {
    const d=L().draftRoom,r=D.report(L(),p.id),taken=d.selections.find(s=>s.pid===p.id);
    return `<button class="draft-prospect ${d.shortlist.includes(p.id)?'pinned':''}" data-prospect="${p.id}" ${taken?'disabled':''}>
      <span class="draft-rank">${taken?`PICK ${taken.pick}`:`BOARD ${p.boardRank}`}</span>${U.face(p,76)}<h3>${esc(p.name)}</h3><p class="t2 sm">${p.pos} · ${p.age} years · ${HL.fmtHeight(p.height)}</p><div class="draft-estimate"><span>Ability <b>${range(r.ability)}</b></span><span>Ceiling <b>${range(r.ceiling)}</b></span></div><div class="t3 sm">${esc(r.strengths.join(' · '))}</div>${d.shortlist.includes(p.id)?'<span class="draft-pin">SHORTLISTED</span>':''}</button>`;
  }
  function feed(selections) {
    if(!selections.length)return '<div class="empty">The first selection is still to come.</div>';
    return `<div class="draft-ticker">${selections.slice().reverse().map(s=>{const p=L().players[s.pid]||L().draftRoom?.prospects.find(p=>p.id===s.pid),t=club(s.teamId);return `<div class="draft-tick"><b>#${s.pick}</b>${U.logo(t,28)}<div><strong>${esc(p?.name||'Prospect')}</strong><span class="t3 sm">${esc(t.name)} · Round ${s.round}</span></div>${s.teamId===L().userTeamId?'<span class="tag">YOUR PICK</span>':''}</div>`;}).join('')}</div>`;
  }
  function render(state={}) {
    const lg=L(),d=lg.draftRoom,year=lg.season+1;
    const limits=`Original-team picks in this sandbox; traded rights and protections are not modeled. Historical classes contain rated NBA arrivals, not every overseas stash. Before 1989, the draft is capped at three rounds. Smaller historical weighted fields and territorial rights are approximate.`;
    const header=`<div class="page-title"><h2>Draft & Scouting</h2><span class="t2">${year} · Build the next chapter</span></div>`;
    if(!d)return header+`<section class="draft-stage"><div class="draft-kicker">THE FUTURE IS ON YOUR BOARD</div><h2>A pick becomes a person.</h2><p>Study the next class, compare uncertain reports and decide who belongs in your locker room. Your selections will be judged when they actually play.</p><button class="btn go big" data-draft-prepare>${state.loading?'Loading the class…':'Prepare draft board'}</button>${state.error?`<p role="alert">${esc(state.error)}</p>`:''}</section>${lg.lastDraft?`<section class="block"><header><h3>${lg.lastDraft.year} selections</h3></header>${feed(lg.lastDraft.selections||lg.lastDraft.picks.map(pid=>({...lg.players[pid].draft,pid})))}</section>`:''}<p class="t3 sm">${limits}</p>`;
    const status=`<div class="draft-status"><span>${d.historical?'REAL NBA ARRIVALS':'GENERATED CLASS'}</span><span>${d.sessions} / 12 scouting sessions left</span><span>${d.shortlist.length} shortlisted</span></div>`;
    if(d.stage==='lottery') {
      const order=d.lottery.order,own=order.indexOf(lg.userTeamId)+1;
      const next=order.length-d.revealed;
      return header+status+`<section class="draft-stage lottery-stage"><div class="draft-kicker">${d.lottery.format==='coin'?'COIN-FLIP REVEAL':d.lottery.format==='reverse'?'DRAFT ORDER REVEAL':'LOTTERY NIGHT'}</div><h2>${next>0?`Pick ${next} is next.`:'The order is set.'}</h2><p>${d.lottery.format==='coin'?'A coin flip decides the first two choices between the last-place clubs in each conference.':d.lottery.format==='reverse'?'This era uses reverse record, without a lottery.':`${d.lottery.drawn} selections drawn ${d.lottery.format==='equal'?'with equal chances':'by weighted odds'}. Remaining teams keep their reverse-record order.`}</p><div class="lottery-drum" aria-hidden="true"><i>1</i><i>2</i><i>3</i><i>4</i><i>5</i></div><div class="row wrap"><button class="btn go big" data-lottery-reveal ${next<=0?'disabled':''}>Reveal pick ${next}</button><button class="btn quiet" data-lottery-skip>Reveal all · Draft night</button></div></section><div class="lottery-grid">${order.map((tid,i)=>{const shown=i>=order.length-d.revealed,t=club(tid);return `<div class="lottery-envelope ${shown?'revealed':''} ${shown&&tid===lg.userTeamId?'mine':''}"><span class="draft-rank">PICK ${i+1}</span>${shown?`${U.logo(t,45)}<b>${esc(t.name)}</b>`:'<strong class="lottery-hidden">?</strong>'}</div>`;}).join('')}</div><p class="t3 sm">${d.revealed===order.length?`Your first selection: ${own}. `:''}${limits}</p>`;
    }
    if(d.stage==='complete')return header+status+`<section class="draft-stage"><div class="draft-kicker">THE CLASS IS IN</div><h2>Draft night is complete.</h2><p>${d.selections.length} players selected. Your rookies have their teams and contracts. Their first five team games will tell the next part of the story.</p><button class="btn go big" data-draft-next>Open ${year}–${String(year+1).slice(2)}</button></section><div class="draft-grid">${d.selections.filter(s=>s.teamId===lg.userTeamId).map(s=>HL.GFX.playerCard(lg.players[s.pid],club(s.teamId),{season:year})).join('')}</div><section class="block"><header><h3>Selection log</h3></header>${feed(d.selections)}</section><p class="t3 sm">${limits}</p>`;
    const slot=D.current(lg),onClock=d.stage==='draft',own=slot?.teamId===lg.userTeamId;
    const sorted=d.prospects.filter(p=>!d.selections.some(s=>s.pid===p.id)).filter(p=>(!state.position||p.pos===state.position)&&(!state.query||p.name.toLowerCase().includes(state.query.toLowerCase()))&&(!state.onlyShortlist||d.shortlist.includes(p.id)));
    const action=onClock?`<div class="draft-clock">${U.logo(club(slot.teamId),54)}<div><div class="draft-kicker">ROUND ${slot.round} · PICK ${slot.pick}</div><h2>${esc(club(slot.teamId).name)} on the clock</h2><p>${own&&manager()?'Your choice. Open a prospect report to make the selection.':'Follow the board, or advance to your next decision.'}</p></div></div><div class="row wrap"><button class="btn go" data-draft-to-own>${own?'Your team is on the clock':'Sim to your pick'}</button><button class="btn quiet" data-draft-finish>Delegate remaining draft</button></div>`:`<div class="draft-kicker">PRIVATE SCOUTING DESK</div><h2>Find your fit.</h2><p>Every report is an estimate. A workout narrows the range; an interview helps explain the person. Your shortlist is also your preference order when you delegate.</p>${lg.phase==='offseason'?'<button class="btn go big" data-draft-lottery>Draw the lottery · Set the order</button>':'<div class="tag">Lottery opens after the postseason</div>'}`;
    return header+status+`<section class="draft-stage">${action}${!manager()?'<p class="t2">Coach mode: inspect the class; your front office handles scouting and picks.</p>':''}</section><div class="row wrap draft-filters"><input type="text" aria-label="Find a prospect" placeholder="Find a prospect" data-draft-search value="${esc(state.query||'')}"><select aria-label="Prospect position" data-draft-position><option value="">All positions</option>${HL.POSITIONS.map(p=>`<option ${state.position===p?'selected':''}>${p}</option>`).join('')}</select><button class="btn ${state.onlyShortlist?'go':''}" data-draft-filter>Shortlist ${state.onlyShortlist?'only':'filter'}</button></div><div class="draft-grid">${sorted.map(card).join('')||'<div class="empty">No available prospects match this filter.</div>'}</div>${onClock?`<section class="block"><header><h3>Draft ticker</h3></header>${feed(d.selections)}</section>`:''}<p class="t3 sm">${limits}</p>`;
  }
  function bind(root,state,changed) {
    const action=fn=>{const result=fn();if(!result.ok){U.toast(esc(result.reason));return false;}changed(true);return result;};
    root.querySelector('[data-draft-prepare]')?.addEventListener('click',async e=>{
      if(state.loading)return;state.loading=true;e.currentTarget.disabled=true;
      try{const year=L().season+1;if(L().settings.history==='real'&&HL.HISTORY.seasons.includes(String(year)))await HL.History.load(String(year));const r=D.prepare(L());if(!r.ok)throw new Error(r.reason);state.error=null;}catch(e){state.error=e.message;}finally{state.loading=false;changed(true);}
    });
    root.querySelector('[data-draft-lottery]')?.addEventListener('click',()=>action(()=>D.lottery(L())));
    root.querySelector('[data-lottery-reveal]')?.addEventListener('click',()=>{const r=action(()=>D.reveal(L()));if(r){HL.FX.sfx.land();HL.FX.burst(document.querySelector('.lottery-envelope.revealed'),[club(r.teamId).color,'#fff'],14);}});
    root.querySelector('[data-lottery-skip]')?.addEventListener('click',()=>{while(L().draftRoom.revealed<L().draftRoom.lottery.order.length)D.reveal(L());changed(true);});
    root.querySelector('[data-draft-to-own]')?.addEventListener('click',()=>action(()=>D.simulate(L(),true)));
    root.querySelector('[data-draft-finish]')?.addEventListener('click',()=>action(()=>D.simulate(L(),false)));
    root.querySelector('[data-draft-next]')?.addEventListener('click',()=>document.querySelector('[data-sim="advance"]').click());
    root.querySelector('[data-draft-search]')?.addEventListener('change',e=>{state.query=e.target.value;changed(false);});
    root.querySelector('[data-draft-position]')?.addEventListener('change',e=>{state.position=e.target.value;changed(false);});
    root.querySelector('[data-draft-filter]')?.addEventListener('click',()=>{state.onlyShortlist=!state.onlyShortlist;changed(false);});
    root.querySelectorAll('[data-prospect]').forEach(b=>b.onclick=()=>showReport(+b.dataset.prospect,changed));
  }
  function showReport(pid,changed) {
    const lg=L(),d=lg.draftRoom,p=d.prospects.find(p=>p.id===pid),r=D.report(lg,pid),slot=D.current(lg);
    if(!p||!r)return;
    U.closeSheet();
    const m=U.sheet(`<h3>${esc(p.name)}</h3>`,`<div class="draft-dossier"><div class="row">${U.face(p,100)}<div><div class="caps">Consensus ${p.boardRank} · ${p.pos}</div><p>${p.age} years · ${HL.fmtHeight(p.height)} · ${p.weight} lb</p><p class="t2 sm">${esc(p.prospect?.college||'Prospect')}</p></div></div><div class="draft-estimate"><span>Ability estimate <b>${range(r.ability)}</b></span><span>Ceiling estimate <b>${range(r.ceiling)}</b></span></div><p><b>Strengths:</b> ${esc(r.strengths.join(', '))}<br><b>Concerns:</b> ${esc(r.concerns.join(', '))}</p>${r.personality?`<p>Work ethic estimate: ${range(r.personality.workEthic)} · Ego estimate: ${range(r.personality.ego)}</p>`:'<p class="t3">Interview him to learn about his personality.</p>'}${r.notes.map(n=>`<blockquote>${esc(n.text)}<small>${HL.fmtDay(n.season,n.day)}</small></blockquote>`).join('')}${manager()?`<div class="row wrap">${['workout','interview'].map(k=>`<button class="btn" data-scout="${k}" ${r[k]||d.sessions<=0||d.stage==='draft'||d.stage==='complete'?'disabled':''}>${r[k]?'Completed: ':''}${k==='workout'?'Private workout':'Interview'} · 1 session</button>`).join('')}<button class="btn" data-shortlist>${d.shortlist.includes(pid)?'Remove from shortlist':'Add to shortlist'}</button></div>${d.stage==='draft'&&slot?.teamId===lg.userTeamId?`<button class="btn go big" data-draft-select>Select ${esc(p.name)} · Pick ${slot.pick}</button>`:''}`:''}<p class="t3 sm">Scouting estimates are uncertain. Your notes are private. No future career achievements are used in this report.</p></div>`,{width:650});
    m.querySelectorAll('[data-scout]').forEach(b=>b.onclick=()=>{const result=D.scout(lg,pid,b.dataset.scout);if(!result.ok)return U.toast(esc(result.reason));changed(true);showReport(pid,changed);});
    m.querySelector('[data-shortlist]')?.addEventListener('click',()=>{const result=D.shortlist(lg,pid);if(!result.ok)return U.toast(esc(result.reason));changed(true);showReport(pid,changed);});
    m.querySelector('[data-draft-select]')?.addEventListener('click',()=>{
      const result=D.pick(lg,pid);if(!result.ok)return U.toast(esc(result.reason));changed(true);U.closeSheet();
      U.sheet('<h3>Selection confirmed</h3>',`${HL.GFX.playerCard(p,club(result.slot.teamId),{season:d.year})}<p>The ${esc(club(result.slot.teamId).name)} choose ${esc(p.name)} at number ${result.slot.pick}. His contract and team are saved.</p><p class="t2">“I am ready to earn my place.”</p>`,{width:470});HL.FX.sfx.fanfare();
    });
  }
  return {render,bind};
})();
