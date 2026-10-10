// UI helpers: escaping, SVG icons, team colors, logos, portraits (real headshots w/ SVG fallback),
// rating chips, sheets (modals), toasts, chunked progress.
window.HL = window.HL || {};

HL.UI = (function () {
  const app = () => document.getElementById('app');
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Optional user image pack (assets/manifest.js sets window.HL_ASSETS = {key: path}).
  const asset = (key) => (window.HL_ASSETS && window.HL_ASSETS[key]) ? 'assets/' + window.HL_ASSETS[key] : null;

  // ---------- icons (24x24 line icons) ----------
  const ICONS = {
    play: '<path d="M7 5v14l11-7z"/>',
    ff: '<path d="M4 6v12l8-6zM12 6v12l8-6z"/>',
    next: '<path d="M6 6v12l9-6zM18 6v12"/>',
    back: '<path d="M15 18l-6-6 6-6"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    save: '<path d="M5 4h11l3 3v13H5zM8 4v5h7V4M8 20v-6h8v6"/>',
    load: '<path d="M4 7h6l2 2h8v10H4z"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    exit: '<path d="M14 5h5v14h-5M10 8l-4 4 4 4M6 12h10"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    trash: '<path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13"/>',
    whistle: '<circle cx="9" cy="14" r="5"/><path d="M13 11l7-4v4l-6 2"/>',
    ball: '<circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4v16M6.5 6.5c3 3 3 8 0 11M17.5 6.5c-3 3-3 8 0 11"/>',
    injury: '<path d="M12 4v16M4 12h16"/>',
  };
  const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ''}</svg>`;

  // ---------- team colors with contrast handling ----------
  function lum(hex) {
    const h = hex.replace('#', '');
    const [r, g, b] = [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16) / 255).map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  // A team's usable accent on a dark UI: very dark primaries fall back to the secondary color.
  function teamAccent(t) {
    let c = t.color, c2 = t.color2;
    if (lum(c) < 0.035) { c = t.color2; c2 = t.color; }
    if (lum(c) > 0.85) c = '#c4ced4';
    return { c, c2, ink: lum(c) > 0.4 ? '#0b0c0e' : '#ffffff' };
  }
  function applyTeamTheme(t) {
    const root = document.documentElement.style;
    if (!t) { root.removeProperty('--team'); root.removeProperty('--team-2'); root.removeProperty('--team-ink'); return; }
    const a = teamAccent(t);
    root.setProperty('--team', a.c);
    root.setProperty('--team-2', a.c2);
    root.setProperty('--team-ink', a.ink);
  }

  function logo(team, size = 40) {
    if (!team) return '';
    const src = asset('logo.' + (team.bref || team.abbr)) || asset('logo.' + team.abbr) || window.HL_PHOTOS?.['logo.' + (team.bref || team.abbr)]?.src || window.HL_PHOTOS?.['logo.' + team.abbr]?.src || HL.teamLogoUrl(team);
    const img = src ? `<img src="${src}" alt="${esc(team.name)}" loading="lazy" onload="this.parentNode.classList.add('loaded')" onerror="this.remove()">` : '';
    return `<span class="logo" style="width:${size}px;height:${size}px;font-size:${size}px;--c:${teamAccent(team).c}"><b>${esc(team.abbr)}</b>${img}</span>`;
  }

  function hashStr(s) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0; return Math.abs(h); }

  const slugOf = s => (s || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const initials = p => (p.name || '?').trim().split(/\s+/).map(x => x[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
  // A photographed uniform is never relabeled as a different team's real uniform.
  function photo(p, team, season) {
    const slug = slugOf(p.name), club = slugOf(team?.bref || team?.abbr);
    const fallback = HL.headshotUrl(p);
    const resolve = key => {
      const custom = asset(key); if (custom) return { src: custom, label: 'Team photo' };
      const bundled = window.HL_PHOTOS?.[key];
      return bundled && (p.number == null || bundled.number == null || String(p.number) === String(bundled.number)) ? { src: bundled.src, label: bundled.kind === 'concept' ? 'Concept portrait' : 'Team photo' } : null;
    };
    const selected = club && ((season != null && resolve(`real.${slug}.${club}.${season}`)) || resolve(`real.${slug}.${club}`));
    const exact = selected?.src;
    const src = exact || (p.real && (asset('real.' + slug) || window.HL_PHOTOS?.['real.' + slug]?.src)) || asset('player.' + p.id) || fallback;
    return { src, fallback, exact: !!exact, label: selected?.label || 'Archive photo' };
  }
  function photoImage(p, source) {
    if (!source.src) return '';
    return `<img src="${esc(source.src)}" alt="${esc(p.name)}" loading="lazy" data-fallback="${esc(source.fallback && source.fallback !== source.src ? source.fallback : '')}" onload="this.parentNode.classList.add('ok')" onerror="if(this.dataset.fallback){this.src=this.dataset.fallback;this.dataset.fallback='';const note=this.parentNode.parentNode.querySelector('.gfx-photo-credit');if(note)note.textContent='Archive photo'}else{this.remove()}">`;
  }
  function face(p, size = 40, team, season) {
    const L = HL.League.get();
    const t = team || (p.teamId != null && L ? L.teams.find(x => x.id === p.teamId) : null);
    const color = t ? teamAccent(t).c : '#3a3f48';
    return `<span class="face" style="width:${size}px;height:${size}px;--fc:${color}"><span class="face-initials" aria-label="${esc(p.name)}">${esc(initials(p))}</span>${photoImage(p, photo(p, t, season ?? L?.season))}</span>`;
  }

  function rtClass(v) { return v >= 95 ? 'r-99' : v >= 90 ? 'r-90' : v >= 85 ? 'r-85' : v >= 80 ? 'r-80' : v >= 75 ? 'r-75' : v >= 70 ? 'r-70' : 'r-lo'; }
  const rating = (v, lg) => `<span class="rt ${rtClass(v)} ${lg ? 'lg' : ''}">${v}</span>`;
  const money = (m) => m >= 1 ? `$${m.toFixed(1)}M` : `$${Math.round(m * 1000)}K`;
  const pct = (v, d = 1) => (v * 100).toFixed(d);
  const fx = (v, d = 1) => (v ?? 0).toFixed(d);
  const ordinal = n => n + (['th', 'st', 'nd', 'rd'][(n % 100 - 20) % 10] || ['th', 'st', 'nd', 'rd'][n % 100] || 'th');

  function sheet(titleHtml, body, opts = {}) {
    closeSheet();
    const bg = document.createElement('div');
    bg.className = 'scrim';
    bg.innerHTML = `<div class="sheet" role="dialog" style="${opts.width ? `width:min(${opts.width}px,100%)` : ''}"><header>${titleHtml}<button class="btn quiet small ml-auto" data-close aria-label="Close">${icon('close')}</button></header><div class="body">${body}</div></div>`;
    bg.addEventListener('click', e => { if (e.target === bg || e.target.closest('[data-close]')) closeSheet(); });
    document.body.appendChild(bg);
    document.addEventListener('keydown', escClose);
    return bg.querySelector('.sheet');
  }
  function escClose(e) { if (e.key === 'Escape') closeSheet(); }
  function closeSheet() {
    document.querySelectorAll('.scrim').forEach(m => m.remove());
    document.removeEventListener('keydown', escClose);
  }

  function toast(msg, ms = 2800) {
    let w = document.querySelector('.toasts');
    if (!w) { w = document.createElement('div'); w.className = 'toasts'; document.body.appendChild(w); }
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML = msg;
    w.appendChild(t);
    setTimeout(() => t.remove(), ms);
  }

  // Runs work in chunks so the page stays responsive and shows progress.
  function runWithProgress(label, total, stepFn, done) {
    const ov = document.createElement('div');
    ov.className = 'simveil';
    ov.innerHTML = `<div class="simcard"><div class="row"><h3>${esc(label)}</h3><span class="t3 sm ml-auto" data-sub></span></div><div class="track"><i></i></div><div class="row" style="margin-top:12px"><button class="btn small" data-stop>Stop</button></div></div>`;
    document.body.appendChild(ov);
    let i = 0, stop = false;
    ov.querySelector('[data-stop]').onclick = () => { stop = true; };
    const bar = ov.querySelector('.track > i'), sub = ov.querySelector('[data-sub]');
    function tick() {
      const t0 = performance.now();
      try {
        while (i < total && !stop && performance.now() - t0 < 40) {
          const r = stepFn(i);
          i++;
          if (r === false) { stop = true; break; }
        }
      } catch (err) {
        console.error(err);
        stop = true;
        toast('Something went wrong during the sim: ' + esc(err.message));
      }
      bar.style.width = `${Math.round(i / total * 100)}%`;
      sub.textContent = `${i} / ${total}`;
      if (i < total && !stop) requestAnimationFrame(tick);
      else { ov.remove(); done && done(); }
    }
    requestAnimationFrame(tick);
  }

  function seg(name, options, current) {
    return `<div class="seg" data-seg="${name}">${options.map(([v, l]) => `<button data-v="${esc(v)}" class="${String(v) === String(current) ? 'on' : ''}">${esc(l)}</button>`).join('')}</div>`;
  }

  // Era presentation theme ('modern' | '60s' | '70s' | '80s' | '90s' | '00s').
  function setEra(era) {
    if (!era || era === 'modern') document.documentElement.removeAttribute('data-era');
    else document.documentElement.setAttribute('data-era', era);
  }

  return { app, esc, icon, teamAccent, applyTeamTheme, logo, face, photo, photoImage, initials, slugOf, rating, rtClass, money, pct, fx, ordinal, sheet, closeSheet, toast, runWithProgress, seg, asset, setEra };
})();
