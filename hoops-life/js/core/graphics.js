// Real headshots plus reusable team-specific photographic jerseys; matching full photos can override compositing.
window.HL = window.HL || {};

HL.GFX = (function () {
  const U = HL.UI;
  const esc = s => U.esc(s);
  let uid = 0;
  const id = (p) => `g${p}${++uid}`;

  function hash(s) { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) | 0; return Math.abs(h); }
  // Jersey number: stable per player (a real number can be set in the editor later).
  HL.jerseyNumber = (p) => {
    if (p.number != null) return p.number;
    const L = HL.League.get();
    const real = HL.jerseyFor ? HL.jerseyFor(p, L ? L.season : null) : null;
    return real != null ? real : (hash(p.name) % 55);
  };

  function teamColors(team) {
    if (!team) return { c: '#3a3f48', c2: '#9aa0aa', ink: '#fff' };
    const a = U.teamAccent(team);
    return { c: a.c, c2: a.c2, ink: a.ink };
  }

  // Keep the legacy card API while replacing the drawn uniform with typography.
  function jersey(team, number) { return `<div class="gfx-identity-number">${esc(number)}</div>`; }
  // Real player portraits are kept intact, without synthetic jerseys.
  function figure(p, team, opts = {}) {
    const { c } = teamColors(team);
    const source = U.photo(p, team, opts.season ?? HL.League.get()?.season);
    return `<div class="gfx-figure" style="--c:${c}"><div class="gfx-head"><div class="gfx-placeholder"><b>${esc(U.initials(p))}</b><span>Photo unavailable</span></div>${U.photoImage(p, source)}</div>${source.src ? `<span class="gfx-photo-credit">${esc(source.label)}</span>` : ''}</div>`;
  }
  function rays() { return '<div class="gfx-light" aria-hidden="true"></div>'; }
  function stripes(c2) {
    return `<div class="gfx-stripes" style="--s:${c2}"></div>`;
  }
  function confetti(colors, n = 46) {
    const r = HL.RNG;
    let out = '';
    for (let i = 0; i < n; i++) {
      const x = (hash(colors.join('') + i) % 1000) / 10, y = (hash(i + colors[0]) % 600) / 10, rot = hash('r' + i) % 360;
      const col = colors[i % colors.length];
      out += `<i style="left:${x}%;top:${y}%;background:${col};transform:rotate(${rot}deg);animation-delay:${(i % 9) * 0.12}s"></i>`;
    }
    return `<div class="gfx-confetti">${out}</div>`;
  }
  function trophy(kind = 'champ') {
    return `<div class="gfx-award-seal" aria-hidden="true"><span>${kind === 'mvp' ? 'MVP' : 'CHAMPIONS'}</span><b>${kind === 'mvp' ? '01' : '★'}</b></div>`;
  }

  // ---------- compositions ----------
  // Trading-card style player card.
  function playerCard(p, team, opts = {}) {
    const { c, c2 } = teamColors(team);
    const era = opts.era || (HL.League.get() && HL.mediaEra ? HL.mediaEra(HL.League.get()) : 'modern');
    return `<div class="gfx gfx-card" style="--c:${c};--c2:${c2}">
      <div class="gfx-bg"></div>${rays('#ffffff', 0.12)}${stripes(c2)}
      ${team ? `<div class="gfx-logo">${U.logo(team, 44)}</div>` : ''}
      <div class="gfx-ovr">${U.rating(p.ovr)}</div>
      <div class="gfx-stage">${figure(p, team, { era, season: opts.season })}</div>
      <div class="gfx-nameplate"><div class="gfx-pos">${esc(p.pos)} · #${HL.jerseyNumber(p)}</div><div class="gfx-name">${esc(p.name)}</div>${opts.sub ? `<div class="gfx-sub">${esc(opts.sub)}</div>` : ''}</div>
    </div>`;
  }

  // Matchup poster for any two teams: series, Finals, rivalry games.
  function matchupPoster(A, B, starsA, starsB, opts = {}) {
    const a = teamColors(A), b = teamColors(B);
    const side = (team, stars, cls) => `<div class="gfx-side ${cls}">${stars.slice(0, 2).map((p, i) => `<div class="gfx-slot s${i}">${figure(p, team)}</div>`).join('')}</div>`;
    return `<div class="gfx gfx-poster ${opts.wide ? 'wide' : ''}" style="--ca:${a.c};--ca2:${a.c2};--cb:${b.c};--cb2:${b.c2}">
      <div class="gfx-split"></div>${rays('#ffffff', 0.1)}
      ${side(A, starsA, 'left')}${side(B, starsB, 'right')}
      <div class="gfx-title">
        ${opts.kicker ? `<div class="gfx-kicker">${esc(opts.kicker)}</div>` : ''}
        <div class="gfx-headline">${esc(opts.title || 'Matchup')}</div>
        <div class="gfx-vs"><span>${U.logo(A, 54)}</span><b>VS</b><span>${U.logo(B, 54)}</span></div>
        ${opts.status ? `<div class="gfx-status">${esc(opts.status)}</div>` : ''}
      </div>
    </div>`;
  }

  // Award graphic (MVP, ROY, DPOY, Finals MVP...).
  function awardCard(p, team, award, line) {
    const { c, c2 } = teamColors(team);
    return `<div class="gfx gfx-award" style="--c:${c};--c2:${c2}">
      <div class="gfx-bg"></div>${rays('#ffd76a', 0.22)}
      <div class="gfx-stage">${figure(p, team)}</div>
      <div class="gfx-award-side">${trophy('mvp')}<div class="gfx-award-name">${esc(award)}</div><div class="gfx-name">${esc(p.name)}</div>${line ? `<div class="gfx-sub">${esc(line)}</div>` : ''}</div>
    </div>`;
  }

  // Trade / signing graphic: the player in his NEW colors, old team faded behind.
  function moveCard(p, from, to, label = 'Traded') {
    const n = teamColors(to);
    return `<div class="gfx gfx-move" style="--c:${n.c};--c2:${n.c2}">
      <div class="gfx-bg"></div>${stripes(n.c2)}
      ${from ? `<div class="gfx-from">${U.logo(from, 90)}</div>` : ''}
      <div class="gfx-stage">${figure(p, to)}</div>
      <div class="gfx-banner">${esc(label)}</div>
      <div class="gfx-nameplate"><div class="gfx-name">${esc(p.name)}</div><div class="gfx-sub">${from ? `${esc(from.name)} → ` : ''}${esc(to.city)} ${esc(to.name)}</div></div>
    </div>`;
  }

  // Champions poster.
  function championPoster(team, stars, year, opts = {}) {
    const { c, c2 } = teamColors(team);
    return `<div class="gfx gfx-champ ${opts.wide ? 'wide' : ''}" style="--c:${c};--c2:${c2}">
      <div class="gfx-bg"></div>${rays('#ffd76a', 0.25)}${confetti([c, c2, '#ffd76a', '#ffffff'])}
      <div class="gfx-group">${stars.slice(0, 3).map((p, i) => `<div class="gfx-slot g${i}">${figure(p, team)}</div>`).join('')}</div>
      <div class="gfx-champ-title"><div class="gfx-kicker">${opts.kicker ? esc(opts.kicker) : `${year} NBA Champions`}</div><div class="gfx-headline">${esc(team.city)} ${esc(team.name)}</div>${opts.sub ? `<div class="gfx-status">${esc(opts.sub)}</div>` : ''}</div>
      <div class="gfx-champ-trophy">${trophy('champ')}</div>
    </div>`;
  }

  // A created player's identity card: name and number, without a fabricated portrait.
  function jerseyCard(p, team, opts = {}) {
    const { c, c2 } = teamColors(team);
    const last = (p.name || '').split(' ').slice(-1)[0];
    return `<div class="gfx gfx-card gfx-jcard" style="--c:${c};--c2:${c2}">
      <div class="gfx-bg"></div>${rays('#ffffff', 0.12)}${stripes(c2)}
      ${team ? `<div class="gfx-logo">${U.logo(team, 44)}</div>` : ''}
      <div class="gfx-ovr">${U.rating(p.ovr)}</div>
      <div class="gfx-jbig"><div class="gfx-identity-label">${esc(last)}</div>${jersey(team, HL.jerseyNumber(p))}</div>
      <div class="gfx-nameplate"><div class="gfx-pos">${esc(p.pos)} · #${HL.jerseyNumber(p)}${p.height ? ' · ' + HL.fmtHeight(p.height) : ''}</div><div class="gfx-name">${esc(p.name)}</div>${opts.sub ? `<div class="gfx-sub">${esc(opts.sub)}</div>` : ''}</div>
    </div>`;
  }

  // ---------- media day & social (composed from the stored media-day pieces) ----------
  // Media graphic using an archive portrait; stored pose/expression are story context, not edits to the photograph.
  function portrait(p, comp, opts = {}) {
    const team = comp ? { name: comp.jersey.team, city: comp.jersey.city, abbr: comp.jersey.abbr, color: comp.jersey.color, color2: comp.jersey.color2 } : null;
    const { c, c2 } = teamColors(team);
    const light = { 'harsh flash': 'brightness(1.25) contrast(1.2) saturate(.8)', moody: 'brightness(.72) contrast(1.15)', backlit: 'brightness(.8) contrast(1.1)', studio: 'none' }[comp && comp.lighting] || 'none';
    const frame = { 'low angle': 'scale(1.06) translateY(4%)', 'high angle': 'scale(.92) translateY(8%)', 'tight crop': 'scale(1.35) translateY(14%)', 'straight on': 'none' }[comp && comp.angle] || 'none';
    const back = comp && comp.backdrop === 'step-and-repeat' ? `<div class="gfx-repeat">${Array.from({ length: 24 }, () => `<span>${esc(team ? team.abbr : '')}</span>`).join('')}</div>` : '';
    return `<div class="gfx gfx-portrait ${comp ? 'bd-' + comp.backdrop.replace(/[^a-z]/g, '') : ''} ${opts.cls || ''}" style="--c:${c};--c2:${c2}">
      <div class="gfx-bg"></div>${back}
      <div class="gfx-stage" style="transform:${frame};filter:${light}">${figure(p, team, { season: comp?.season })}</div>
      ${opts.plate === false ? '' : `<div class="gfx-nameplate"><div class="gfx-pos">${esc(team ? team.name : '')} · Media day${comp ? ' ' + comp.season : ''}</div><div class="gfx-name">${esc(p.name)}</div>${comp ? '<div class="gfx-sub">Media day coverage · Archive portrait</div>' : ''}</div>`}
    </div>`;
  }
  const k = n => n >= 1e6 ? (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? (n / 1e3).toFixed(n >= 1e4 ? 0 : 1) + 'K' : String(n);
  // A vertical short-video post: the portrait as the frame, caption burned in, side actions, sound line.
  function shortVideo(p, comp, v, handle) {
    return `<div class="gfx-short">
      ${portrait(p, comp, { plate: false })}
      <div class="sv-top">${esc(v.platform || 'ClipFeed')}</div>
      <div class="sv-caption">${esc(v.caption)}</div>
      <div class="sv-side"><span><b>${k(v.counts.likes)}</b>likes</span><span><b>${k(v.counts.comments)}</b>comments</span><span><b>${k(v.counts.shares)}</b>shares</span></div>
      <div class="sv-foot"><b>${esc(/^@/.test(handle || '') ? handle : '@' + (handle || 'hoopclips'))}</b><div class="sv-sound">${esc(v.sound)}</div></div>
    </div>`;
  }
  // A video thumbnail: portrait on one side, a two-word title, an arrow and a circle.
  function thumbnail(p, comp, v, channel) {
    return `<div class="gfx-thumb">
      ${portrait(p, comp, { plate: false })}
      <div class="th-title">${esc(v.title || 'WASHED?')}</div>
      <span class="th-arrow" aria-hidden="true">➜</span>
      <div class="th-ring"></div>
      <div class="th-meta">${esc(v.platform || 'StreamTube')} · ${esc(channel || 'Hoop Talk')} · ${k(v.counts.likes * 6)} views</div>
    </div>`;
  }
  // A quote graphic; once checked, a fabricated one is stamped.
  function quoteCard(p, comp, v) {
    return `<div class="gfx-quote ${v.fabricated ? 'fake' : ''}">
      ${portrait(p, comp, { plate: false })}
      <div class="qc-text">“${esc(v.quote)}”<div class="qc-by">— attributed to ${esc(p.name)}</div></div>
      ${v.fabricated ? '<div class="qc-stamp">Fabricated</div>' : ''}
    </div>`;
  }

  return { figure, jersey, playerCard, jerseyCard, matchupPoster, awardCard, moveCard, championPoster, rays, trophy, portrait, shortVideo, thumbnail, quoteCard };
})();
