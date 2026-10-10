// Person-focused conversations and the memories behind relationship meters.
window.HL = window.HL || {};

HL.PeopleUI = (function () {
  const U = HL.UI, esc = U.esc;
  const meter = (label, value) => `<div class="meter"><span class="lbl">${label}</span><span class="val">${value}</span><div class="track"><i style="width:${value}%"></i></div></div>`;
  function render() {
    const L = HL.League.get(), t = L.teams.find(t => t.id === L.userTeamId), m = HL.World.teamMood(L, t.id);
    return `<div class="page-title"><h2>People & relationships</h2><span class="t2">They remember your decisions. Results give those decisions a second life.</span></div>
      <section class="block"><header><h3>Outside the locker room</h3></header><div class="body cols c2">${meter('Fan confidence', m.fans)}${meter('Ownership approval', m.owner)}</div>${m.memories.length ? `<div class="body t2 sm">${esc(m.memories.at(-1).text)}</div>` : ''}</section>
      <div class="fo-people">${HL.FrontOffice.roster(L, t.id).sort((a, b) => b.ovr - a.ovr).map(p => {
        const r = HL.World.relationship(L, p.id), pending = L.world?.watches.find(w => w.pid === p.id && w.kind === 'minutesPromise' && !w.resolved);
        return `<button class="fo-person" data-person="${p.id}"><div class="row">${U.face(p, 66, t)}<div class="grow"><h3>${esc(p.name)}</h3><span class="t3 sm">${p.pos} · Age ${p.age} · Morale ${p.morale ?? 70}</span></div>${U.rating(p.ovr)}</div><div class="fo-relationship">${meter('Like', r.like)}${meter('Respect', r.respect)}${meter('Trust', r.trust)}</div><p class="t2 sm">${pending ? `Minutes promise: ${pending.games} / 3 games assessed` : r.memories.length ? esc(r.memories.at(-1).text) : 'Start a conversation. Give this relationship a history.'}</p><span class="caps">Talk to player →</span></button>`;
      }).join('')}</div>
      <section class="block"><header><h3>Story so far</h3><span class="t3 sm">Decisions and their follow-ups</span></header><div class="body stack">${L.world?.timeline.length ? L.world.timeline.slice(-12).reverse().map(e => `<div class="fo-ledger"><span class="caps">${HL.fmtDay(e.season, e.day, { year: true })}</span><span>${esc(e.text)}</span></div>`).join('') : '<p class="t3">Conversations, roster decisions and their consequences will appear here.</p>'}</div></section>`;
  }
  function bind(root, changed) {
    const L = HL.League.get();
    root.querySelectorAll('[data-person]').forEach(b => b.onclick = () => {
      const p = L.players[+b.dataset.person], r = HL.World.relationship(L, p.id);
      const sheet = U.sheet(`<h3>${esc(p.name)} · Player meeting</h3>`, `<div class="row">${U.face(p, 80)}<div class="grow"><b>${esc(p.name)}</b><div class="t2">${p.pos} · Age ${p.age}</div></div></div><div class="fo-relationship" style="margin:18px 0">${meter('Like', r.like)}${meter('Respect', r.respect)}${meter('Trust', r.trust)}</div><div class="fo-conversations">${Object.entries(HL.World.ACTIONS).map(([key, action]) => `<button data-conversation="${key}"><b>${action.label}</b><span>${action.desc}</span></button>`).join('')}</div><p class="fo-message" data-conversation-response role="status">Choose how to handle this conversation.</p>${r.memories.length ? `<div class="caps">What he remembers</div>${r.memories.slice(-4).reverse().map(e => `<p class="t2 sm">${esc(e.text)}</p>`).join('')}` : ''}`, { width: 620 });
      sheet.querySelectorAll('[data-conversation]').forEach(btn => btn.onclick = () => {
        const result = HL.World.meet(L, p.id, btn.dataset.conversation);
        sheet.querySelector('[data-conversation-response]').textContent = `${p.name}: ${result.response}`;
        if (result.ok) { sheet.querySelectorAll('[data-conversation]').forEach(n => { n.disabled = true; }); changed(); }
      });
    });
  }
  return { render, bind };
})();
