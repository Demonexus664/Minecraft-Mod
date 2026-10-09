// Composable graphics: every image is assembled at runtime from layered pieces
// (team-color backgrounds, light rays, logos, player cutouts re-dressed in their CURRENT
// team's jersey, props and broadcast typography). Nothing is pre-made, so a Finals poster
// of your 1991 Bulls vs your custom super-team is drawn exactly for that matchup.
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

  // ---------- jersey (drawn over the bottom of the cutout, so old uniforms never show) ----------
  function jersey(team, number, opts = {}) {
    const { c, c2 } = teamColors(team);
    const era = opts.era || 'modern';
    // Jersey wordmarks as teams actually wear them.
    const WORD = { Timberwolves: 'WOLVES', 'Trail Blazers': 'BLAZERS', Cavaliers: 'CAVS', Mavericks: 'MAVS', SuperSonics: 'SONICS', Grizzlies: 'GRIZZLIES', Pelicans: 'PELICANS', Clippers: 'CLIPPERS' };
    const word = team ? (WORD[team.name] || (team.name.length > 10 ? team.city : team.name)).toUpperCase() : '';
    const trim = c2.toLowerCase() === c.toLowerCase() ? '#ffffff' : c2;
    const gid = id('j');
    // Retro eras get thicker trim and tighter lettering.
    const trimW = era === '70s' || era === '80s' ? 9 : 6;
    return `<svg class="gfx-jersey" viewBox="0 0 200 110" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}" stop-opacity="1"/><stop offset="1" stop-color="${c}" stop-opacity=".92"/></linearGradient>
        <linearGradient id="${gid}s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset=".3" stop-color="#000" stop-opacity="0"/><stop offset=".7" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient></defs>
      <path d="M0 110 L0 46 Q4 22 40 14 L74 6 Q100 38 126 6 L160 14 Q196 22 200 46 L200 110 Z" fill="url(#${gid})"/>
      <path d="M0 110 L0 46 Q4 22 40 14 L74 6 Q100 38 126 6 L160 14 Q196 22 200 46 L200 110 Z" fill="url(#${gid}s)"/>
      <path d="M74 6 Q100 38 126 6" fill="none" stroke="${trim}" stroke-width="${trimW}" stroke-linecap="round"/>
      <path d="M40 14 Q34 58 22 110 M160 14 Q166 58 178 110" fill="none" stroke="${trim}" stroke-width="${trimW - 1}" opacity=".95"/>
      ${word ? `<text x="100" y="62" text-anchor="middle" font-family="var(--display)" font-weight="800" font-size="${word.length > 7 ? 15 : 18}" letter-spacing="1" fill="${trim}">${esc(word)}</text>` : ''}
      <text x="100" y="${word ? 100 : 92}" text-anchor="middle" font-family="var(--display)" font-weight="800" font-size="${word ? 36 : 44}" fill="#fff" stroke="${trim}" stroke-width="2" paint-order="stroke">${number}</text>
    </svg>`;
  }

  // ---------- figure: background-less cutout (head from real headshot or SVG face) + jersey ----------
  function figure(p, team, opts = {}) {
    const { c } = teamColors(team);
    const asset = U.asset;
    const slug = (p.name || '').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const src = (p.real && asset('real.' + slug)) || asset('player.' + p.id) || HL.headshotUrl(p);
    return `<div class="gfx-figure" style="--c:${c}">
      <div class="gfx-head">${U.svgFace(p, 'transparent')}${src ? `<img src="${src}" alt="" loading="lazy" onerror="this.remove()">` : ''}</div>
      ${jersey(team, HL.jerseyNumber(p), opts)}
    </div>`;
  }

  // ---------- backgrounds ----------
  function rays(color, opacity = 0.18) {
    const n = 14, g = id('r');
    return `<svg class="gfx-rays" viewBox="-100 -100 200 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><radialGradient id="${g}"><stop offset="0" stop-color="${color}" stop-opacity="${opacity}"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></radialGradient></defs>
      ${Array.from({ length: n }, (_, i) => { const a = (i / n) * Math.PI * 2, b = a + Math.PI / n / 1.6; return `<path d="M0 0 L${Math.cos(a) * 200} ${Math.sin(a) * 200} L${Math.cos(b) * 200} ${Math.sin(b) * 200} Z" fill="url(#${g})"/>`; }).join('')}</svg>`;
  }
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
    // Generic trophies drawn in SVG (no real trophy likeness).
    if (kind === 'mvp') return `<svg class="gfx-trophy" viewBox="0 0 60 100" aria-hidden="true"><defs><linearGradient id="tm" x1="0" x2="1"><stop offset="0" stop-color="#8a6a1f"/><stop offset=".5" stop-color="#f3d27a"/><stop offset="1" stop-color="#8a6a1f"/></linearGradient></defs>
      <rect x="14" y="84" width="32" height="12" rx="2" fill="#2b2b2b"/><rect x="22" y="62" width="16" height="24" fill="url(#tm)"/><circle cx="30" cy="40" r="20" fill="url(#tm)"/><path d="M22 34 a9 9 0 0 1 16 0" stroke="#7a5a16" stroke-width="2" fill="none"/></svg>`;
    return `<svg class="gfx-trophy" viewBox="0 0 60 120" aria-hidden="true"><defs><linearGradient id="tc" x1="0" x2="1"><stop offset="0" stop-color="#8a6a1f"/><stop offset=".5" stop-color="#f6dc8c"/><stop offset="1" stop-color="#8a6a1f"/></linearGradient></defs>
      <rect x="12" y="104" width="36" height="12" rx="2" fill="url(#tc)"/><path d="M24 104 L26 58 L34 58 L36 104 Z" fill="url(#tc)"/><path d="M14 10 L46 10 L42 50 Q30 62 18 50 Z" fill="url(#tc)"/><circle cx="30" cy="22" r="11" fill="#c8732a" stroke="#7a3f12" stroke-width="1.5"/><path d="M19 22 h22 M30 11 v22" stroke="#7a3f12" stroke-width="1.2"/></svg>`;
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
      <div class="gfx-stage">${figure(p, team, { era })}</div>
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
      <div class="gfx-champ-title"><div class="gfx-kicker">${year} NBA Champions</div><div class="gfx-headline">${esc(team.city)} ${esc(team.name)}</div>${opts.sub ? `<div class="gfx-status">${esc(opts.sub)}</div>` : ''}</div>
      <div class="gfx-champ-trophy">${trophy('champ')}</div>
    </div>`;
  }

  return { figure, jersey, playerCard, matchupPoster, awardCard, moveCard, championPoster, rays, trophy };
})();
