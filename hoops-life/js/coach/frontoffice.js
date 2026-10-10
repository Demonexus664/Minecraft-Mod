// Franchise roster tools. The league module owns all validation and mutations.
window.HL = window.HL || {};

HL.FrontOfficeUI = (function () {
  const U = HL.UI, esc = U.esc, F = HL.FrontOffice;
  const league = () => HL.League.get();
  const mine = L => L.teams.find(t => t.id === L.userTeamId);
  const controls = L => (L.settings.role || 'gm') !== 'coach';
  const name = t => `${t.city} ${t.name}`;
  const label = y => `${y}-${String(y + 1).slice(2)}`;
  const policy = '<p class="fo-policy">Initial league policy: 15-player rosters; incoming trade salary may fit cap room or 125% of outgoing salary plus a scaled allowance. Over-cap free-agent signings use the minimum exception. Historical caps and salaries are estimates; full CBA exceptions and aprons are still planned.</p>';
  const inspect = '<div class="fo-message">Your coach role delegates roster decisions to the front office. You can inspect the market and payroll here.</div>';
  function heading(title, sub) { return `<div class="page-title"><h2>${title}</h2><span class="t2">${sub}</span></div>`; }
  function summary(L) {
    const f = F.finances(L, L.userTeamId, L.phase === 'offseason' ? L.season + 1 : L.season);
    return `<div class="fo-strip"><div><span class="caps">Payroll · ${label(f.year)}</span><b>${U.money(f.payroll)}</b></div><div><span class="caps">${f.room == null ? 'Salary cap' : f.room >= 0 ? 'Cap room' : 'Over cap'}</span><b>${f.room == null ? 'Uncapped' : U.money(Math.abs(f.room))}</b></div><div><span class="caps">Roster</span><b>${f.count} / 15</b></div><div><span class="caps">Healthy</span><b>${f.healthy}</b></div></div>`;
  }
  function playerButton(p, t, side, chosen) {
    return `<button class="fo-player ${chosen ? 'selected' : ''}" data-trade-${side}="${p.id}" aria-pressed="${chosen}">
      ${U.face(p, 42, t)}<span class="fo-player-name"><b>${esc(p.name)}</b><span>${p.pos} · Age ${p.age} · ${U.money(p.contract.amount)}</span></span>${U.rating(p.ovr)}<span class="fo-check" aria-hidden="true">${chosen ? '✓' : '+'}</span></button>`;
  }
  function initTrade(L, st) {
    if (!L.teams.some(t => t.id === st.other && t.id !== L.userTeamId)) st.other = L.teams.find(t => t.id !== L.userTeamId)?.id;
    st.send = (st.send || []).filter(id => L.players[id]?.teamId === L.userTeamId);
    st.receive = (st.receive || []).filter(id => L.players[id]?.teamId === st.other);
  }
  function trades(L, st) {
    const own = mine(L);
    if (!controls(L)) return heading('Trade desk', 'Scout possible moves') + inspect + summary(L);
    initTrade(L, st);
    const other = L.teams.find(t => t.id === st.other);
    if (!other) return heading('Trade desk', 'No other teams available');
    const deal = { teamId: st.other, send: st.send, receive: st.receive }, q = F.tradePreview(L, deal);
    const ready = st.send.length && st.receive.length;
    const board = (t, side, ids, title) => `<section class="block fo-side"><header>${U.logo(t, 36)}<div><span class="caps">${title}</span><h3>${esc(name(t))}</h3></div><span class="ml-auto t3 sm">${ids.length} / 3 selected</span></header><div class="fo-roster">${F.roster(L, t.id).sort((a, b) => b.ovr - a.ovr).map(p => playerButton(p, t, side, ids.includes(p.id))).join('')}</div></section>`;
    const projection = ready && q.projections ? q.projections.map(p => `<span>${esc(L.teams.find(t => t.id === p.teamId).abbr)} payroll after trade <b>${U.money(p.payroll)}</b></span>`).join('') : '';
    return heading('Trade desk', 'Build an offer. Hear their answer. Change your roster.') + summary(L) + `
      <div class="fo-toolbar"><label class="caps" for="trade-partner">Trading partner</label><select id="trade-partner" data-trade-team>${L.teams.filter(t => t.id !== L.userTeamId).map(t => `<option value="${t.id}" ${t.id === st.other ? 'selected' : ''}>${esc(name(t))}</option>`).join('')}</select><button class="btn" data-trade-find ${st.send.length ? '' : 'disabled'}>Trade Finder</button></div>
      <div class="fo-desk">${board(own, 'send', st.send, 'You send')}${board(other, 'receive', st.receive, 'You receive')}</div>
      <section class="block fo-response"><header><h3>${esc(other.name)} front office</h3><span class="ml-auto tag ${ready && q.accepted ? 'new' : ''}">${ready ? q.accepted ? 'Ready to agree' : q.ok ? 'Needs more value' : 'Cannot complete' : 'Build your offer'}</span></header><div class="body stack"><p>${esc(ready ? q.response : 'Choose one to three players from each roster. We will review salary, roster space and the value of your offer.')}</p>${projection ? `<div class="fo-projection">${projection}</div>` : ''}<div class="row wrap"><button class="btn go" data-trade-submit ${ready && q.ok ? '' : 'disabled'}>Submit trade</button><button class="btn quiet" data-trade-clear>Clear offer</button>${st.feedback ? `<span role="status" class="t2">${esc(st.feedback)}</span>` : ''}</div></div></section>
      ${st.offers ? `<section class="block"><header><h3>Trade Finder</h3><span class="t3 sm">Offers these teams would accept under the current policy</span></header><div class="body fo-found">${st.offers.length ? st.offers.map((d, i) => { const t = L.teams.find(t => t.id === d.teamId), p = L.players[d.receive[0]]; return `<button class="fo-found-card" data-found-offer="${i}">${U.logo(t, 32)}<span><b>${esc(p.name)}</b><small>${esc(t.name)} · ${p.pos} · ${U.money(p.contract.amount)}</small></span>${U.rating(p.ovr)}<span class="caps">Review offer →</span></button>`; }).join('') : '<p class="t2">No legal, accepted offers for this package. Change the players you are offering.</p>'}</div></section>` : ''}${policy}${history(L)}`;
  }
  function freeagency(L, st) {
    const ps = Object.values(L.players).filter(p => !p.retired && p.teamId == null && (!st.search || p.name.toLowerCase().includes(st.search.toLowerCase())) && (!st.pos || p.pos === st.pos)).sort((a, b) => b.ovr - a.ovr);
    const row = p => {
      const q = F.quote(L, p.id);
      return `<div class="fo-market-card">${U.face(p, 52)}<div class="grow"><b>${esc(p.name)}</b><div class="t3 sm">${p.pos} · Age ${p.age}${p.injury && p.injury.games > 0 ? ` · Injured (${p.injury.games} games)` : ''}</div><div class="t2 sm">${q.ok ? `${esc(q.role)} opportunity · asks ${U.money(q.ask)} / year` : 'Unsigned'}</div></div>${U.rating(p.ovr)}${controls(L) ? `<button class="btn small" data-negotiate="${p.id}" data-kind="signing">Negotiate</button>` : ''}</div>`;
    };
    const owned = F.roster(L, L.userTeamId).sort((a, b) => b.ovr - a.ovr);
    return heading('Free Agency', 'Find a fit. Negotiate the contract. Make room for the next chapter.') + (controls(L) ? '' : inspect) + summary(L) + `
      <div class="fo-toolbar"><label class="sr-only" for="market-search">Search free agents</label><input type="text" id="market-search" data-market-search placeholder="Search free agents…" value="${esc(st.search || '')}"><label class="sr-only" for="market-position">Position</label><select id="market-position" data-market-pos><option value="">All positions</option>${HL.POSITIONS.map(pos => `<option ${st.pos === pos ? 'selected' : ''}>${pos}</option>`).join('')}</select><span class="caps">${ps.length} available</span></div>
      <section class="block"><header><h3>Available players</h3><span class="t3 sm">Contracts start ${label(L.phase === 'offseason' ? L.season + 1 : L.season)}</span></header><div class="body fo-market">${ps.length ? ps.slice(0, 60).map(row).join('') : '<p class="t2">No available players match this search.</p>'}${ps.length > 60 ? '<p class="t3 sm">Showing the top 60. Search or filter to find more.</p>' : ''}</div></section>
      <section class="block"><header><h3>Your contracts</h3><span class="t3 sm">Extend expiring deals or open a roster spot</span></header><div class="body fo-market">${owned.map(p => `<div class="fo-market-card">${U.face(p, 42)}<div class="grow"><b>${esc(p.name)}</b><div class="t3 sm">${U.money(p.contract.amount)} / year through ${label(p.contract.exp)}${p.extension ? ` · Extended through ${label(p.extension.exp)}` : ''}</div></div>${controls(L) ? `<div class="row wrap">${!p.hardship && !p.extension && p.contract.exp <= L.season + 1 ? `<button class="btn small" data-negotiate="${p.id}" data-kind="extension">Extend</button>` : ''}<button class="btn quiet small" data-waive="${p.id}">Waive</button></div>` : ''}</div>`).join('')}</div></section>${policy}${history(L)}`;
  }
  function finances(L) {
    const years = Array.from({ length: 5 }, (_, i) => L.season + i), fs = years.map(y => F.finances(L, L.userTeamId, y)), now = fs[0];
    return heading('Payroll & commitments', 'Know what is guaranteed before you make your next move.') + summary(L) + `
      <section class="block"><header><h3>Five-season outlook</h3><span class="t3 sm">Existing guarantees only; new automatic deals are not projected</span></header><div class="body fo-outlook">${fs.map(f => `<div><span class="caps">${label(f.year)}</span><b class="num">${U.money(f.payroll)}</b><div class="track"><i style="width:${f.cap ? Math.min(100, f.payroll / f.cap * 100) : 0}%"></i></div><small>${f.cap == null ? 'No salary cap' : `Cap ${U.money(f.cap)}`}</small><small>Dead money ${U.money(f.dead)}</small></div>`).join('')}</div></section>
      <section class="block"><header><h3>Guaranteed contracts</h3></header><div class="tbl-wrap"><table class="tbl"><thead><tr><th class="l">Player</th>${years.map(y => `<th>${label(y)}</th>`).join('')}</tr></thead><tbody>${now.salaries.map(c => `<tr><td class="l">${esc(c.name)}</td>${fs.map(f => `<td>${U.money(f.salaries.find(s => s.pid === c.pid)?.amount || 0)}</td>`).join('')}</tr>`).join('')}<tr><td class="l">Waived / dead money</td>${fs.map(f => `<td>${U.money(f.dead)}</td>`).join('')}</tr><tr><td class="l"><b>Total committed</b></td>${fs.map(f => `<td><b>${U.money(f.payroll)}</b></td>`).join('')}</tr></tbody></table></div></section>
      ${(L.deadCap || []).some(d => d.teamId === L.userTeamId) ? `<section class="block"><header><h3>Waived obligations</h3></header><div class="body stack">${(L.deadCap || []).filter(d => d.teamId === L.userTeamId).map(d => `<div class="row wrap"><b>${esc(d.name)}</b><span class="t2">${U.money(d.amount)} / year · ${label(d.start)} through ${label(d.exp)}</span></div>`).join('')}</div></section>` : ''}${policy}${history(L)}`;
  }
  function history(L) {
    const entries = (L.transactions || []).filter(n => n.teamId === L.userTeamId || n.otherTeamId === L.userTeamId).slice(-8).reverse();
    return `<section class="block"><header><h3>Transaction wire</h3></header><div class="body stack">${entries.length ? entries.map(n => `<div class="fo-ledger"><span class="caps">${n.kind} · ${HL.fmtDay(n.season, n.day)}</span><b>${(n.playerIds || []).map(id => esc(L.players[id]?.name || 'Former player')).join(' · ')}</b><span class="t3 sm">${n.kind === 'trade' ? 'Rosters and rotations updated' : n.kind === 'waiver' ? 'Guaranteed money retained' : `${n.years} years · ${U.money(n.amount)} / year`}</span></div>`).join('') : '<p class="t3">Your completed roster moves appear here.</p>'}</div></section>`;
  }
  function announce(L, result, changed) {
    if (!result.ok) { U.toast(esc(result.response || result.reasons.join(' '))); return; }
    const n = result.transaction, p = L.players[n.playerIds[0]], to = L.teams.find(t => t.id === n.teamId), from = n.kind === 'trade' ? L.teams.find(t => t.id === n.otherTeamId) : null;
    changed(true);
    U.sheet('<h3>Deal complete</h3>', `${n.kind === 'waiver' ? '' : `<div class="fo-announcement">${HL.GFX.moveCard(p, from, to, n.kind === 'trade' ? 'Trade agreed' : n.kind === 'extension' ? 'Staying home' : 'Signed')}</div>`}<p class="fo-message">${n.kind === 'trade' ? 'The trade is final. Players are on their new teams and rotations will adjust for the next game.' : n.kind === 'waiver' ? 'The player is a free agent. Guaranteed salary remains on your payroll.' : n.kind === 'extension' ? 'The extension is signed. Current salary stays the same; the new terms begin after the existing contract.' : 'The contract is signed. Your new player is available for the rotation.'}</p>`, { width: 540 });
  }
  function negotiation(L, pid, kind, changed) {
    const q = F.quote(L, pid, kind);
    if (!q.ok) return U.toast(esc(q.response));
    const p = L.players[pid], sheet = U.sheet(`<h3>${kind === 'extension' ? 'Extend' : 'Negotiate'} · ${esc(p.name)}</h3>`, `<div class="fo-negotiation"><div class="row">${U.face(p, 72)}<div><b>${esc(p.name)}</b><div class="t2">${p.pos} · Age ${p.age} · ${q.role}</div></div>${U.rating(p.ovr)}</div><blockquote>${esc(q.response)}</blockquote><div class="fo-offer-input"><label for="offer-amount">Annual salary ($M)</label><input id="offer-amount" data-offer-amount type="number" min="${q.minimum}" step="0.001" value="${q.ask}"><label for="offer-years">Contract years</label><select id="offer-years" data-offer-years>${[1, 2, 3, 4].map(n => `<option value="${n}">${n} year${n === 1 ? '' : 's'}</option>`).join('')}</select></div><p class="t3 sm">Starts ${label(q.start)}. League minimum ${U.money(q.minimum)}. ${kind === 'extension' ? 'New terms follow the current deal.' : 'Salary, roster space and willingness are checked when you submit.'}</p><p data-offer-response role="status" class="fo-message">Make an offer to begin talks.</p><button class="btn go" data-offer-submit>Offer contract</button></div>`, { width: 560 });
    sheet.querySelector('[data-offer-submit]').onclick = () => {
      const raw = sheet.querySelector('[data-offer-amount]').value, amount = raw.trim() ? Number(raw) : NaN;
      const years = +sheet.querySelector('[data-offer-years]').value;
      const result = kind === 'extension' ? F.extend(L, pid, amount, years) : F.sign(L, pid, amount, years);
      if (!result.ok) sheet.querySelector('[data-offer-response]').textContent = result.response;
      else announce(L, result, changed);
    };
  }
  function bind(page, root, st, changed) {
    const L = league();
    if (page === 'trades' && controls(L)) {
      root.querySelector('[data-trade-team]')?.addEventListener('change', e => { st.other = +e.target.value; st.receive = []; st.feedback = ''; changed(); });
      for (const side of ['send', 'receive']) root.querySelectorAll(`[data-trade-${side}]`).forEach(b => b.onclick = () => {
        const id = +b.dataset[side === 'send' ? 'tradeSend' : 'tradeReceive'], ids = st[side];
        if (ids.includes(id)) st[side] = ids.filter(x => x !== id);
        else if (ids.length < 3) ids.push(id); else return U.toast('Choose up to three players per side.');
        st.offers = null; st.feedback = ''; changed();
      });
      root.querySelector('[data-trade-clear]')?.addEventListener('click', () => { st.send = []; st.receive = []; st.offers = null; st.feedback = ''; changed(); });
      root.querySelector('[data-trade-find]')?.addEventListener('click', () => { st.offers = F.findTrades(L, st.send); changed(); });
      root.querySelectorAll('[data-found-offer]').forEach(b => b.onclick = () => { const d = st.offers[+b.dataset.foundOffer]; st.other = d.teamId; st.send = d.send.slice(); st.receive = d.receive.slice(); st.offers = null; changed(); });
      root.querySelector('[data-trade-submit]')?.addEventListener('click', () => {
        const result = F.trade(L, { teamId: st.other, send: st.send, receive: st.receive });
        if (!result.ok) { st.feedback = result.response; changed(); }
        else { st.send = []; st.receive = []; st.offers = null; st.feedback = ''; announce(L, result, changed); }
      });
    }
    if (page === 'freeagency') {
      root.querySelector('[data-market-search]').oninput = e => {
        st.search = e.target.value; changed();
        const next = document.querySelector('[data-market-search]'); next.focus(); next.setSelectionRange(next.value.length, next.value.length);
      };
      root.querySelector('[data-market-pos]').onchange = e => { st.pos = e.target.value; changed(); };
      root.querySelectorAll('[data-negotiate]').forEach(b => b.onclick = () => negotiation(L, +b.dataset.negotiate, b.dataset.kind, changed));
      root.querySelectorAll('[data-waive]').forEach(b => b.onclick = () => {
        const p = L.players[+b.dataset.waive];
        const sheet = U.sheet(`<h3>Waive ${esc(p.name)}?</h3>`, `<p>He becomes a free agent and leaves your rotation. Guaranteed salary of ${U.money(p.contract.amount)} per year stays on your payroll through ${label(p.contract.exp)}${p.extension ? ', plus his signed extension' : ''}.</p><div class="row" style="margin-top:20px"><button class="btn" data-close>Keep player</button><button class="btn go" data-confirm-waive>Waive player</button></div>`);
        sheet.querySelector('[data-confirm-waive]').onclick = () => announce(L, F.waive(L, p.id), changed);
      });
    }
  }
  function render(page, st) {
    const L = league();
    return page === 'trades' ? trades(L, st) : page === 'freeagency' ? freeagency(L, st) : finances(L);
  }
  return { render, bind };
})();
