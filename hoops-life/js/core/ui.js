// UI helpers: escaping, team logos, player avatars (real headshots w/ SVG fallback), modals, toasts, progress.
window.HL = window.HL || {};

HL.UI = (function () {
  const app = () => document.getElementById('app');
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Optional user image pack (assets/manifest.js sets window.HL_ASSETS = {key: path}).
  const asset = (key) => (window.HL_ASSETS && window.HL_ASSETS[key]) ? 'assets/' + window.HL_ASSETS[key] : null;

  function logo(team, size = 40) {
    if (!team) return '';
    const src = asset('logo.' + team.abbr) || HL.teamLogoUrl(team);
    return `<span class="logo" style="width:${size}px;height:${size}px;font-size:${size}px;--c:${team.color};--c2:${team.color2}"><b>${esc(team.abbr)}</b><img src="${src}" alt="" loading="lazy" onload="this.parentNode.classList.add('loaded')" onerror="this.remove()"></span>`;
  }

  function hashStr(s) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0; return Math.abs(h); }

  // Layered SVG avatar for generated people (and fallback for real players without a headshot).
  function svgAvatar(p, color) {
    const h = hashStr(p.name || 'x');
    const skins = ['#f1c7a5', '#e0ac85', '#c68a62', '#a86b45', '#8a5433', '#6b3f25', '#4f2e1b'];
    const hairs = ['#141414', '#2b1b10', '#4a2f1b', '#6b4423', '#a07040', '#d9b26f', '#888'];
    const skin = skins[h % skins.length];
    const hair = hairs[(h >> 3) % hairs.length];
    const style = (h >> 6) % 5;
    const beard = (h >> 9) % 3 === 0;
    const hairPath = [
      `<path d="M30 42 Q50 18 70 42 Q70 30 50 26 Q30 30 30 42Z" fill="${hair}"/>`,
      `<ellipse cx="50" cy="33" rx="22" ry="13" fill="${hair}"/>`,
      `<path d="M28 44 Q30 16 50 18 Q70 16 72 44 Q66 30 50 30 Q34 30 28 44Z" fill="${hair}"/>`,
      `<g fill="${hair}">${Array.from({ length: 9 }, (_, i) => `<circle cx="${32 + i * 4.5}" cy="${28 + Math.abs(4 - i)}" r="5"/>`).join('')}</g>`,
      '',
    ][style];
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 100 Q16 72 50 70 Q84 72 86 100Z" fill="${color || '#334'}"/>
      <path d="M38 70 L50 82 L62 70" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="3"/>
      <rect x="43" y="56" width="14" height="16" rx="5" fill="${skin}"/>
      <ellipse cx="50" cy="44" rx="18" ry="21" fill="${skin}"/>
      ${hairPath}
      ${beard ? `<path d="M34 50 Q36 66 50 67 Q64 66 66 50 Q60 60 50 60 Q40 60 34 50Z" fill="${hair}" opacity=".9"/>` : ''}
      <circle cx="43" cy="45" r="1.8" fill="#1a1a1a"/><circle cx="57" cy="45" r="1.8" fill="#1a1a1a"/>
      <path d="M45 55 Q50 58 55 55" stroke="#5a3322" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    </svg>`;
  }

  function avatar(p, size = 44, team) {
    const t = team || (p.teamId != null && HL.League.get() ? HL.League.team(p.teamId) : null);
    const color = t ? t.color : '#334155';
    const src = asset('player.' + p.id) || HL.headshotUrl(p);
    const img = src ? `<img src="${src}" alt="" loading="lazy" onerror="this.remove()">` : '';
    return `<span class="avatar" style="width:${size}px;height:${size}px;--c:${color};border-radius:${Math.max(8, size / 5)}px">${svgAvatar(p, color)}${img}</span>`;
  }

  function tier(ovr) {
    return ovr >= 95 ? 't-legend' : ovr >= 86 ? 't-elite' : ovr >= 78 ? 't-good' : ovr >= 70 ? 't-avg' : ovr >= 60 ? 't-low' : 't-bad';
  }
  const ovr = (v, big) => `<span class="ovr ${tier(v)} ${big ? 'big' : ''}">${v}</span>`;
  const money = (m) => m >= 1 ? `$${m.toFixed(1)}M` : `$${Math.round(m * 1000)}K`;
  const pct = (v, d = 1) => (v * 100).toFixed(d);
  const fx = (v, d = 1) => (v ?? 0).toFixed(d);

  function modal(title, body, opts = {}) {
    closeModal();
    const bg = document.createElement('div');
    bg.className = 'modal-bg';
    bg.innerHTML = `<div class="modal" style="${opts.width ? `width:min(${opts.width}px,100%)` : ''}"><div class="modal-head">${title}<button class="btn sm ghost right" data-close>✕</button></div><div class="modal-body">${body}</div></div>`;
    bg.addEventListener('click', e => { if (e.target === bg || e.target.closest('[data-close]')) closeModal(); });
    document.body.appendChild(bg);
    document.addEventListener('keydown', escClose);
    return bg.querySelector('.modal');
  }
  function escClose(e) { if (e.key === 'Escape') closeModal(); }
  function closeModal() {
    document.querySelectorAll('.modal-bg').forEach(m => m.remove());
    document.removeEventListener('keydown', escClose);
  }

  function toast(msg, ms = 2600) {
    let w = document.querySelector('.toast-wrap');
    if (!w) { w = document.createElement('div'); w.className = 'toast-wrap'; document.body.appendChild(w); }
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = msg;
    w.appendChild(t);
    setTimeout(() => t.remove(), ms);
  }

  // Runs work in chunks so the page stays responsive and shows progress.
  function runWithProgress(label, total, stepFn, done) {
    const ov = document.createElement('div');
    ov.className = 'sim-overlay';
    ov.innerHTML = `<div class="sim-box"><h3>${esc(label)}</h3><div class="muted small" data-sub>Starting…</div><div class="bar"><i style="width:0%"></i></div><button class="btn sm ghost" style="margin-top:12px" data-stop>Stop</button></div>`;
    document.body.appendChild(ov);
    let i = 0, stop = false;
    ov.querySelector('[data-stop]').onclick = () => { stop = true; };
    const bar = ov.querySelector('.bar > i'), sub = ov.querySelector('[data-sub]');
    function tick() {
      const t0 = performance.now();
      while (i < total && !stop && performance.now() - t0 < 40) {
        const r = stepFn(i);
        i++;
        if (r === false) { stop = true; break; }
      }
      bar.style.width = `${Math.round(i / total * 100)}%`;
      sub.textContent = `${i} / ${total}`;
      if (i < total && !stop) requestAnimationFrame(tick);
      else { ov.remove(); done && done(); }
    }
    requestAnimationFrame(tick);
  }

  function seg(name, options, current) {
    return `<div class="seg" data-seg="${name}">${options.map(([v, l]) => `<button data-v="${v}" class="${String(v) === String(current) ? 'on' : ''}">${esc(l)}</button>`).join('')}</div>`;
  }

  return { app, esc, logo, avatar, svgAvatar, ovr, tier, money, pct, fx, modal, closeModal, toast, runWithProgress, seg, asset };
})();
