// Detailed Franchise (MyNBA-style): setup + hub with organized sections.
window.HL = window.HL || {};

HL.Franchise = (function () {
  const U = HL.UI;
  const esc = U.esc;
  let view = 'dashboard';
  let viewState = {};
  const L = () => HL.League.get();
  const me = () => L().teams[L().userTeamId];

  // ---------------- SETUP ----------------
  function setup() {
    HL.App.setAccent();
    const st = { team: null, difficulty: 'pro', depth: 'detailed', role: 'gm' };
    const teams = HL.TEAMS.slice().sort((a, b) => a.city.localeCompare(b.city));
    const render = () => {
      U.app().innerHTML = `
      <div class="content" style="max-width:1200px;margin:0 auto">
        <div class="row wrap">
          <button class="btn sm ghost" data-back>← Back</button>
          <h1 style="font-size:32px">New Franchise</h1>
          <span class="chip accent">${esc(HL.ROSTER_META.label)}</span>
        </div>
        <div class="grid c3">
          <div class="panel"><h3>Start</h3>
            <div class="col">
              <label class="row"><input type="radio" checked> <b>Current season</b> <span class="muted small">real 2025-26 rosters</span></label>
              <label class="row muted"><input type="radio" disabled> Any era (1960s → today) <span class="chip soon">soon</span></label>
              <label class="row muted"><input type="radio" disabled> Fantasy draft (any era) <span class="chip soon">soon</span></label>
            </div>
          </div>
          <div class="panel"><h3>Your role</h3>
            ${U.seg('role', [['coach', 'Coach'], ['gm', 'GM'], ['owner', 'Owner']], st.role)}
            <p class="muted small" style="margin-top:10px">${{ coach: 'Rotations, strategy and player relationships. The front office handles roster moves.', gm: 'Coach + front office: roster, contracts, trades, draft (MyGM-style RPG).', owner: 'Total control, including business, budget and the rulebook (MyNBA-style).' }[st.role]}</p>
          </div>
          <div class="panel"><h3>Difficulty & depth</h3>
            <div class="col">
              ${U.seg('difficulty', [['rookie', 'Rookie'], ['pro', 'Pro'], ['allstar', 'All-Star'], ['hof', 'Hall of Fame']], st.difficulty)}
              ${U.seg('depth', [['simple', 'Simple'], ['detailed', 'Detailed']], st.depth)}
              <span class="muted small">Simple lets the AI handle the details. Detailed puts every system in your hands. You can change this any time.</span>
            </div>
          </div>
        </div>
        <div class="panel">
          <h3>Pick your team</h3>
          <div class="team-grid">
            ${teams.map(t => `<div class="team-card ${st.team === t.id ? 'sel' : ''}" style="--c:${t.color}" data-team="${t.id}">
              ${U.logo(t, 64)}
              <div class="tn">${esc(t.city)}<br>${esc(t.name)}</div>
              <span class="muted tiny">${t.conf} · ${t.div}</span>
            </div>`).join('')}
          </div>
        </div>
        <div class="row" style="justify-content:flex-end">
          <button class="btn primary lg" data-start ${st.team == null ? 'disabled' : ''}>Start Franchise →</button>
        </div>
      </div>`;
      U.app().querySelector('[data-back]').onclick = () => HL.App.title();
      U.app().querySelectorAll('[data-team]').forEach(el => el.onclick = () => {
        st.team = +el.dataset.team;
        const t = HL.TEAMS[st.team];
        HL.App.setAccent(t.color, t.color2);
        render();
      });
      U.app().querySelectorAll('[data-seg]').forEach(sg => sg.querySelectorAll('button').forEach(b => b.onclick = () => { st[sg.dataset.seg] = b.dataset.v; render(); }));
      U.app().querySelector('[data-start]').onclick = () => {
        HL.League.create({ userTeamId: st.team, settings: { difficulty: st.difficulty, depth: st.depth, role: st.role } });
        L().mode = 'franchise';
        view = 'dashboard';
        open();
        autosave();
      };
    };
    render();
  }

  // ---------------- SHELL ----------------
  const NAV = [
    ['Home', [['dashboard', '🏠', 'Dashboard'], ['news', '📰', 'News & Media']]],
    ['Team', [['roster', '👥', 'Roster'], ['strategy', '🧠', 'Rotation & Strategy'], ['schedule', '📅', 'Schedule & Results'], ['teamstats', '📊', 'Team Stats']]],
    ['League', [['standings', '🏆', 'Standings'], ['leaders', '⭐', 'League Leaders'], ['playoffs', '🗂️', 'Playoffs'], ['players', '🔎', 'Player Search'], ['history', '📜', 'History & Awards']]],
    ['Front Office', [['trades', '🔁', 'Trades', true], ['freeagency', '✍️', 'Free Agency', true], ['draft', '🎓', 'Draft & Scouting', true], ['finances', '💰', 'Finances', true], ['staff', '🧑‍🏫', 'Staff', true]]],
    ['League Office', [['rules', '📘', 'Rulebook'], ['settings', '⚙️', 'Settings & Saves']]],
  ];

  function open() {
    const t = me();
    HL.App.setAccent(t.color, t.color2);
    render();
  }

  function render() {
    const t = me(), Lg = L();
    const phaseLabel = { regular: `Regular season · Day ${Lg.day + 1}`, playin: 'Play-In Tournament', playoffs: 'Playoffs', offseason: 'Offseason' }[Lg.phase];
    const seed = HL.League.standings(t.conf).indexOf(t) + 1;
    U.app().innerHTML = `
    <div class="shell">
      <aside class="sidebar" id="sidebar">
        <div class="brand">Hoops<span>Life</span></div>
        ${NAV.map(([g, items]) => `<div class="nav-group"><div class="label">${g}</div>
          ${items.map(([id, ic, label, soon]) => `<button class="nav-item ${view === id ? 'active' : ''}" data-view="${id}"><span class="ic">${ic}</span>${label}${soon ? '<span class="soon">SOON</span>' : ''}</button>`).join('')}
        </div>`).join('')}
        <div class="nav-group"><button class="nav-item" data-quit><span class="ic">⏏️</span>Main menu</button></div>
      </aside>
      <div class="main">
        <div class="topbar">
          <button class="btn sm menu-toggle" data-menu>☰</button>
          <div class="team-id">${U.logo(t, 42)}<div><div class="name">${esc(t.city)} ${esc(t.name)}</div>
            <div class="rec">${t.w}-${t.l} · ${seed}${['th', 'st', 'nd', 'rd'][seed] || 'th'} in ${t.conf} · ${Lg.season}-${String(Lg.season + 1).slice(2)} · ${phaseLabel}</div></div></div>
          <div class="sim">${simButtons()}</div>
        </div>
        <div class="content" id="view"></div>
      </div>
    </div>`;
    const root = U.app();
    root.querySelectorAll('[data-view]').forEach(b => b.onclick = () => { view = b.dataset.view; viewState = {}; render(); });
    root.querySelector('[data-menu]').onclick = () => root.querySelector('#sidebar').classList.toggle('open');
    root.querySelector('[data-quit]').onclick = async () => { await autosave(); HL.App.title(); };
    root.querySelectorAll('[data-sim]').forEach(b => b.onclick = () => sim(b.dataset.sim));
    renderView();
  }

  function simButtons() {
    const Lg = L();
    if (Lg.phase === 'regular') return `
      <button class="btn sm primary" data-sim="next">▶ Play next game</button>
      <button class="btn sm" data-sim="week">Week</button>
      <button class="btn sm" data-sim="month">Month</button>
      <button class="btn sm" data-sim="regular">To playoffs</button>`;
    if (Lg.phase === 'playin' || Lg.phase === 'playoffs') return `
      <button class="btn sm primary" data-sim="day">▶ Next day</button>
      <button class="btn sm" data-sim="round">Finish round</button>
      <button class="btn sm" data-sim="season">Finish playoffs</button>`;
    return `<button class="btn sm primary" data-sim="advance">Start ${Lg.season + 1}-${String(Lg.season + 2).slice(2)} season →</button>`;
  }

  function sim(kind) {
    const Lg = L();
    const uid = Lg.userTeamId;
    if (kind === 'advance') {
      HL.League.advanceToNextSeason();
      U.toast(`Welcome to the ${Lg.season}-${String(Lg.season + 1).slice(2)} season. The draft, progression, retirements and free agency are done.`);
      view = 'dashboard';
      render(); autosave();
      return;
    }
    let total = 1, stepFn;
    const lastDay = HL.League.lastDay();
    if (kind === 'next') {
      const next = Lg.schedule.find(g => !g.res && (g.home === uid || g.away === uid));
      total = next ? next.day - Lg.day + 1 : 1;
      stepFn = () => { HL.League.simDay(); };
    } else if (kind === 'week' || kind === 'month') {
      total = Math.min(kind === 'week' ? 7 : 30, lastDay - Lg.day + 1);
      stepFn = () => { if (L().phase !== 'regular') return false; HL.League.simDay(); };
    } else if (kind === 'regular') {
      total = lastDay - Lg.day + 1;
      stepFn = () => { if (L().phase !== 'regular') return false; HL.League.simDay(); };
    } else if (kind === 'day') {
      total = 1; stepFn = () => HL.League.simDay();
    } else if (kind === 'round') {
      const startRounds = Lg.playoffs ? Lg.playoffs.rounds.length : 0;
      const startPhase = Lg.phase;
      total = 12;
      stepFn = () => {
        HL.League.simDay();
        const P = L().playoffs;
        if (L().phase === 'offseason') return false;
        if (startPhase === 'playin' && L().phase === 'playoffs') return false;
        if (P && P.rounds.length > startRounds && startPhase === 'playoffs') return false;
      };
    } else if (kind === 'season') {
      total = 120;
      stepFn = () => { if (L().phase === 'offseason') return false; HL.League.simDay(); };
    }
    const before = Lg.news.length;
    U.runWithProgress('Simulating…', Math.max(1, total), stepFn, () => {
      render();
      autosave();
      // Surface the user's latest game.
      if (kind === 'next' || kind === 'day') {
        const g = [...L().schedule].reverse().find(x => x.res && (x.home === uid || x.away === uid));
        const recentBox = Object.keys(L().boxScores).reverse().find(k => { const b = L().boxScores[k]; return b.home.teamId === uid || b.away.teamId === uid; });
        if (kind === 'next' && g) boxScore(g.gid);
        else if (kind === 'day' && recentBox) boxScore(recentBox);
      }
      const fresh = L().news.slice(before).filter(n => n.importance >= 3);
      if (fresh.length) U.toast(`📰 ${esc(fresh[fresh.length - 1].headline)}`, 4000);
    });
  }

  async function autosave() {
    try { await HL.Saves.save(L()); } catch (e) { console.warn('autosave failed', e); }
  }

  // ---------------- VIEWS ----------------
  function renderView() {
    const el = document.getElementById('view');
    const fn = VIEWS[view] || VIEWS.soon;
    el.innerHTML = fn();
    bindCommon(el);
    if (BIND[view]) BIND[view](el);
  }

  function bindCommon(el) {
    el.querySelectorAll('[data-player]').forEach(x => x.onclick = (e) => { e.stopPropagation(); playerCard(+x.dataset.player); });
    el.querySelectorAll('[data-box]').forEach(x => x.onclick = () => boxScore(x.dataset.box));
    el.querySelectorAll('[data-goto]').forEach(x => x.onclick = () => { view = x.dataset.goto; render(); });
    el.querySelectorAll('[data-team-view]').forEach(x => x.onclick = () => teamCard(+x.dataset.teamView));
  }

  const plCell = (p, size = 32) => `<div class="pl" data-player="${p.id}">${U.avatar(p, size)}<div><div class="nm"><b>${esc(p.name)}</b></div><div class="tiny muted">${p.pos} · ${HL.fmtHeight(p.height)} · ${p.age}y</div></div></div>`;
  const injTag = p => p.injury && p.injury.games > 0 ? `<div class="injury">🩹 ${esc(p.injury.name)} · ${p.injury.games}g</div>` : '';

  function nextGameOf(tid) {
    return L().schedule.find(g => !g.res && (g.home === tid || g.away === tid));
  }

  function newsItem(n, compact) {
    const big = n.importance >= 3;
    const rx = (n.reactions || []).slice(0, compact ? 1 : 4);
    return `<div class="news-item ${big ? 'big' : ''}">
      <div class="meta">${n.type.toUpperCase()} · ${n.season}-${String(n.season + 1).slice(2)} ${n.phase === 'regular' ? '· Day ' + (n.day + 1) : '· ' + n.phase}
        ${(n.teamIds || []).slice(0, 2).map(id => U.logo(L().teams[id], 18)).join('')}</div>
      <div class="hl">${esc(n.headline)}</div>
      ${n.body ? `<div class="muted">${esc(n.body)}</div>` : ''}
      ${n.gid && !compact ? `<button class="btn sm" style="align-self:flex-start" data-box="${n.gid}">Box score</button>` : ''}
      ${rx.map(r => post(r)).join('')}
    </div>`;
  }

  function post(r) {
    const initials = r.voice.outlet.replace(/[^A-Za-z ]/g, '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const colors = { debate: '#dc2626', stats: '#0ea5e9', insider: '#16a34a', beat: '#7c3aed', oldhead: '#a16207', memes: '#db2777', homer: 'var(--accent)', hater: '#475569', odds: '#059669', pod: '#9333ea', wire: '#334155' };
    const k = n => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K' : n;
    return `<div class="post"><div class="pfp" style="--c:${colors[r.voice.key] || '#334'}">${initials}</div>
      <div><div class="who"><b>${esc(r.voice.outlet)}</b> <span>${esc(r.voice.handle)} · ${esc(r.voice.kind)}</span></div>
      <div class="txt">${esc(r.text)}</div>
      <div class="eng"><span>💬 ${k(Math.round(r.reposts * 0.6))}</span><span>🔁 ${k(r.reposts)}</span><span>❤️ ${k(r.likes)}</span></div></div></div>`;
  }

  const VIEWS = {
    dashboard() {
      const t = me(), Lg = L();
      const players = HL.League.teamPlayers(t.id).sort((a, b) => b.ovr - a.ovr);
      const ng = nextGameOf(t.id);
      const opp = ng ? Lg.teams[ng.home === t.id ? ng.away : ng.home] : null;
      const recent = Lg.schedule.filter(g => g.res && (g.home === t.id || g.away === t.id)).slice(-5).reverse();
      const conf = HL.League.standings(t.conf);
      const news = Lg.news.slice().reverse().filter(n => n.importance >= 2 || (n.teamIds || []).includes(t.id)).slice(0, 6);
      const leaders = ['pts', 'reb', 'ast'].map(k => {
        const rows = players.map(p => ({ p, s: HL.League.perGame(p, Lg.season) })).filter(x => x.s);
        rows.sort((a, b) => b.s[k] - a.s[k]);
        return { k, x: rows[0] };
      });
      const champ = Lg.phase === 'offseason' && Lg.history.length ? Lg.history[Lg.history.length - 1] : null;
      return `
      ${champ ? `<div class="panel" style="text-align:center;background:linear-gradient(120deg,color-mix(in srgb,${Lg.teams[champ.champion].color} 45%,#000),#0b0f16)">
        <div class="row" style="justify-content:center">${U.logo(Lg.teams[champ.champion], 80)}</div>
        <h1 style="margin-top:8px">${esc(Lg.teams[champ.champion].city)} ${esc(Lg.teams[champ.champion].name)}</h1>
        <div class="muted">${champ.season}-${String(champ.season + 1).slice(2)} NBA Champions · beat ${esc(Lg.teams[champ.runnerUp].name)} ${champ.finalsScore}${champ.fmvp != null ? ` · Finals MVP ${esc(Lg.players[champ.fmvp].name)}` : ''}</div>
      </div>` : ''}
      <div class="grid c3">
        <div class="stat-tile"><div class="v">${t.w}-${t.l}</div><div class="k">Record · ${t.streak > 0 ? 'W' + t.streak : t.streak < 0 ? 'L' + (-t.streak) : '—'} streak</div></div>
        <div class="stat-tile"><div class="v">${conf.indexOf(t) + 1}${['th', 'st', 'nd', 'rd'][conf.indexOf(t) + 1] || 'th'}</div><div class="k">${t.conf}ern Conference</div></div>
        <div class="stat-tile"><div class="v">${t.w + t.l ? ((t.pf - t.pa) / (t.w + t.l)).toFixed(1) : '0.0'}</div><div class="k">Point differential / game</div></div>
      </div>
      <div class="grid c2">
        <div class="panel"><h3>Next game</h3>
          ${ng ? `<div class="row" style="justify-content:space-around;padding:10px 0">
            <div class="col center" style="align-items:center">${U.logo(Lg.teams[ng.away], 64)}<b>${esc(Lg.teams[ng.away].name)}</b><span class="muted small">${Lg.teams[ng.away].w}-${Lg.teams[ng.away].l}</span></div>
            <div class="center"><h2>@</h2><div class="muted small">Day ${ng.day + 1}<br>${esc(Lg.teams[ng.home].arena)}</div></div>
            <div class="col center" style="align-items:center">${U.logo(Lg.teams[ng.home], 64)}<b>${esc(Lg.teams[ng.home].name)}</b><span class="muted small">${Lg.teams[ng.home].w}-${Lg.teams[ng.home].l}</span></div>
          </div>
          <div class="muted small center">Projected edge: ${edgeText(t.id, opp.id, ng.home === t.id)}</div>`
          : `<div class="empty">${Lg.phase === 'regular' ? 'Season complete.' : Lg.phase === 'offseason' ? 'Offseason. Start the next season from the top bar.' : 'Playoff games are on the Playoffs page.'}</div>`}
        </div>
        <div class="panel"><h3>Recent results</h3>
          ${recent.length ? recent.map(g => gameRow(g, t.id)).join('') : '<div class="empty">No games played yet.</div>'}
        </div>
      </div>
      <div class="grid c2">
        <div class="panel"><h3>Team leaders</h3>
          ${leaders.map(({ k, x }) => x ? `<div class="row" style="padding:6px 0">${plCell(x.p, 40)}<div class="right center"><div style="font-family:var(--font-display);font-size:26px">${x.s[k].toFixed(1)}</div><div class="tiny muted">${k.toUpperCase()}</div></div></div>` : '').join('') || '<div class="empty">Stats appear after the first game.</div>'}
          <h3 style="margin-top:14px">Injury report</h3>
          ${players.filter(p => p.injury && p.injury.games > 0).map(p => `<div class="row" style="padding:4px 0">${plCell(p, 30)}<span class="right injury">${esc(p.injury.name)} · out ${p.injury.games} games</span></div>`).join('') || '<div class="muted small">All healthy. ✅</div>'}
        </div>
        <div class="panel"><h3>Headlines</h3>
          <div class="col">${news.map(n => newsItem(n, true)).join('') || '<div class="empty">Quiet so far.</div>'}</div>
          <button class="btn sm" style="margin-top:10px" data-goto="news">All news →</button>
        </div>
      </div>`;
    },

    news() {
      const Lg = L(), t = me();
      const filter = viewState.filter || 'all';
      let items = Lg.news.slice().reverse();
      if (filter === 'mine') items = items.filter(n => (n.teamIds || []).includes(t.id));
      if (filter === 'big') items = items.filter(n => n.importance >= 2);
      return `<div class="row wrap"><h2>News & Media</h2><div class="right">${U.seg('filter', [['all', 'All'], ['big', 'Top stories'], ['mine', 'My team']], filter)}</div></div>
        <div class="col" style="max-width:820px">${items.slice(0, 80).map(n => newsItem(n)).join('') || '<div class="empty">No news yet. Sim some games.</div>'}</div>`;
    },

    roster() {
      const t = viewState.team != null ? L().teams[viewState.team] : me();
      const players = HL.League.teamPlayers(t.id).sort((a, b) => b.ovr - a.ovr);
      const payroll = players.reduce((s, p) => s + p.contract.amount, 0);
      return `<div class="row wrap"><h2>${esc(t.name)} Roster</h2><span class="chip">${players.length} players</span><span class="chip">Payroll ${U.money(payroll)}</span>
        <div class="right"><select data-team-select>${L().teams.map(x => `<option value="${x.id}" ${x.id === t.id ? 'selected' : ''}>${esc(x.city)} ${esc(x.name)}</option>`).join('')}</select></div></div>
        <div class="table-wrap"><table class="t"><thead><tr><th class="l">Player</th><th>OVR</th><th>POT</th><th class="l">Archetype</th><th>Age</th><th>Contract</th><th>PPG</th><th>RPG</th><th>APG</th><th class="l">Status</th></tr></thead><tbody>
        ${players.map(p => {
          const s = HL.League.perGame(p, L().season);
          return `<tr><td class="l">${plCell(p)}</td><td>${U.ovr(p.ovr)}</td><td class="muted">${p.potential}</td><td class="l small">${esc(HL.archetypeName(p))}</td><td>${p.age}</td>
            <td>${U.money(p.contract.amount)} <span class="dim tiny">→${String(p.contract.exp + 1).slice(2)}</span></td>
            <td>${s ? U.fx(s.pts) : '-'}</td><td>${s ? U.fx(s.reb) : '-'}</td><td>${s ? U.fx(s.ast) : '-'}</td><td class="l">${injTag(p) || '<span class="good tiny">Healthy</span>'}</td></tr>`;
        }).join('')}</tbody></table></div>`;
    },

    strategy() {
      const t = me();
      const s = Object.assign(HL.DEFAULT_STRATEGY(), t.strategy);
      const players = HL.League.teamPlayers(t.id).sort((a, b) => b.ovr - a.ovr);
      const avail = players.filter(p => !p.injury || p.injury.games <= 0);
      const starters = (s.starters ? s.starters.map(id => L().players[id]).filter(p => p && avail.includes(p)) : null);
      const autoS = HL.autoStarters(avail);
      const st = starters && starters.length === 5 ? starters : autoS;
      const mins = s.minutes || HL.autoMinutes(avail, st, 240);
      const total = avail.reduce((a, p) => a + (mins[p.id] || 0), 0);
      return `<div class="row wrap"><h2>Rotation & Strategy</h2><span class="muted small">Changes apply to the next game simmed.</span></div>
      <div class="grid c2">
        <div class="panel"><h3>Game plan</h3>
          <div class="col">
            <div class="field"><label>Pace · ${s.pace < 35 ? 'Grind it out' : s.pace > 65 ? 'Run and gun' : 'Balanced'}</label><input type="range" min="0" max="100" value="${s.pace}" data-strat="pace"></div>
            <div class="field"><label>Offensive focus</label>${U.seg('focus', [['balanced', 'Balanced'], ['inside', 'Attack inside'], ['perimeter', 'Bomb threes'], ['star', 'Feed the star'], ['motion', 'Ball movement']], s.focus)}</div>
            <div class="field"><label>Defensive scheme</label>${U.seg('defense', [['man', 'Man'], ['switch', 'Switch all'], ['drop', 'Drop coverage'], ['zone', '2-3 Zone'], ['press', 'Full-court press']], s.defense)}</div>
            <div class="field"><label>Crash the offensive glass · ${s.crash}</label><input type="range" min="0" max="100" value="${s.crash}" data-strat="crash"></div>
            <div class="muted small">Pace changes possessions per game. Zone gives up more threes but protects the rim. Press forces turnovers but allows easy layups. Crashing the glass gets more offensive rebounds.</div>
          </div>
        </div>
        <div class="panel"><h3>Starting five</h3>
          <div class="col">
            ${[0, 1, 2, 3, 4].map(i => `<div class="row"><span class="chip" style="width:42px;justify-content:center">${HL.POSITIONS[i]}</span>
              <select class="grow" data-starter="${i}">${avail.map(p => `<option value="${p.id}" ${st[i] && st[i].id === p.id ? 'selected' : ''}>${esc(p.name)} (${p.pos}, ${p.ovr})</option>`).join('')}</select></div>`).join('')}
            <div class="row"><button class="btn sm" data-auto-starters>Auto (best lineup)</button></div>
          </div>
        </div>
      </div>
      <div class="panel"><h3>Minutes</h3>
        <div class="row wrap" style="margin-bottom:10px"><span class="chip ${Math.abs(total - 240) < 1 ? 'good' : 'bad'}">Total ${Math.round(total)} / 240</span>
          <button class="btn sm" data-auto-min>Auto minutes</button><span class="muted small">Minutes are scaled to 240 at game time. Tired players lose effectiveness and get hurt more.</span></div>
        <div class="table-wrap"><table class="t"><thead><tr><th class="l">Player</th><th>OVR</th><th>Stamina</th><th class="l" style="width:45%">Target minutes</th><th>MIN</th></tr></thead><tbody>
          ${players.map(p => {
            const inj = p.injury && p.injury.games > 0;
            const v = inj ? 0 : Math.round(mins[p.id] || 0);
            return `<tr><td class="l">${plCell(p, 28)}${injTag(p)}</td><td>${U.ovr(p.ovr)}</td><td>${p.attrs.stam}</td>
            <td class="l"><input type="range" min="0" max="48" value="${v}" data-min="${p.id}" ${inj ? 'disabled' : ''}></td><td class="mono" data-minv="${p.id}">${v}</td></tr>`;
          }).join('')}
        </tbody></table></div>
      </div>`;
    },

    schedule() {
      const t = me(), Lg = L();
      const games = Lg.schedule.filter(g => g.home === t.id || g.away === t.id);
      return `<h2>Schedule & Results</h2><div class="panel"><div class="col" style="gap:2px">
        ${games.map(g => gameRow(g, t.id, true)).join('')}</div></div>`;
    },

    teamstats() {
      const t = me(), Lg = L();
      const players = HL.League.teamPlayers(t.id).map(p => ({ p, s: HL.League.perGame(p, Lg.season) })).filter(x => x.s).sort((a, b) => b.s.pts - a.s.pts);
      if (!players.length) return `<h2>Team Stats</h2><div class="panel empty">Play some games first.</div>`;
      return `<h2>${esc(t.name)} Player Stats</h2>${statsTable(players)}
        ${Object.values(Lg.players).some(p => p.teamId === t.id && p.stats[Lg.season + 'p']) ? `<h3>Playoffs</h3>${statsTable(HL.League.teamPlayers(t.id).map(p => ({ p, s: HL.League.perGame(p, Lg.season, true) })).filter(x => x.s))}` : ''}`;
    },

    standings() {
      return `<h2>Standings</h2><div class="grid c2">${['East', 'West'].map(conf => {
        const st = HL.League.standings(conf);
        return `<div class="panel"><h3>${conf}ern Conference</h3><div class="table-wrap"><table class="t"><thead><tr><th class="l">#</th><th class="l">Team</th><th>W</th><th>L</th><th>PCT</th><th>GB</th><th>Home</th><th>Away</th><th>L10</th><th>Strk</th><th>Diff</th></tr></thead><tbody>
          ${st.map((t, i) => `<tr class="${t.id === L().userTeamId ? 'me' : ''} ${i === 6 || i === 10 ? 'cut' : ''}"><td class="l">${i + 1}</td>
            <td class="l"><div class="pl" data-team-view="${t.id}">${U.logo(t, 24)}<b class="nm">${esc(t.name)}</b></div></td>
            <td>${t.w}</td><td>${t.l}</td><td>${(t.w / Math.max(1, t.w + t.l)).toFixed(3).replace(/^0/, '')}</td><td>${i ? HL.League.gamesBack(t, st[0]).toFixed(1) : '—'}</td>
            <td>${t.homeW}-${t.homeL}</td><td>${t.awayW}-${t.awayL}</td><td>${t.last10.filter(x => x).length}-${t.last10.filter(x => !x).length}</td>
            <td class="${t.streak > 0 ? 'good' : t.streak < 0 ? 'bad' : ''}">${t.streak > 0 ? 'W' + t.streak : t.streak < 0 ? 'L' + (-t.streak) : '-'}</td>
            <td class="${t.pf - t.pa >= 0 ? 'good' : 'bad'}">${t.w + t.l ? ((t.pf - t.pa) / (t.w + t.l)).toFixed(1) : '0.0'}</td></tr>`).join('')}
          </tbody></table></div><div class="tiny muted" style="margin-top:6px">1-6 make the playoffs · 7-10 go to the play-in</div></div>`;
      }).join('')}</div>`;
    },

    leaders() {
      const Lg = L();
      const rows = Object.values(Lg.players).filter(p => p.teamId != null).map(p => ({ p, s: HL.League.perGame(p, Lg.season) })).filter(x => x.s && x.s.gp >= Math.max(1, Math.floor(maxGP() * 0.5)));
      const cats = [['pts', 'Points'], ['reb', 'Rebounds'], ['ast', 'Assists'], ['stl', 'Steals'], ['blk', 'Blocks'], ['ts', 'True Shooting %', true], ['tpp', '3P% (min 2 3PA)', true], ['pm', 'Plus/Minus']];
      return `<h2>League Leaders</h2>${rows.length ? `<div class="grid c4">${cats.map(([k, label, isPct]) => {
        let r = rows;
        if (k === 'tpp') r = r.filter(x => x.p.stats[Lg.season].tpa / x.s.gp >= 2);
        if (k === 'ts') r = r.filter(x => x.s.pts >= 10);
        const top = r.slice().sort((a, b) => b.s[k] - a.s[k]).slice(0, 8);
        return `<div class="panel"><h3>${label}</h3>${top.map((x, i) => `<div class="row" style="padding:4px 0"><span class="dim mono" style="width:16px">${i + 1}</span>
          <div class="pl" data-player="${x.p.id}" style="cursor:pointer">${U.avatar(x.p, 28)}<span class="nm small"><b>${esc(x.p.name)}</b></span></div>
          <span class="right mono"><b>${isPct ? U.pct(x.s[k]) : U.fx(x.s[k])}</b></span></div>`).join('')}</div>`;
      }).join('')}</div>` : '<div class="panel empty">Leaders appear after a few games.</div>'}`;
    },

    playoffs() {
      const Lg = L(), P = Lg.playoffs;
      if (!P) {
        return `<h2>Playoffs</h2><div class="panel"><h3>If the season ended today</h3><div class="grid c2">${['East', 'West'].map(c => `<div><b>${c}</b>${HL.League.standings(c).slice(0, 10).map((t, i) => `<div class="row" style="padding:3px 0"><span class="dim mono" style="width:18px">${i + 1}</span>${U.logo(t, 22)} ${esc(t.name)} <span class="right muted">${t.w}-${t.l}</span>${i === 5 ? '' : ''}</div>`).join('')}</div>`).join('')}</div></div>`;
      }
      const T = id => Lg.teams[id];
      const pin = c => {
        const pi = P.playin[c];
        return `<div class="panel"><h3>${c} Play-In</h3>${pi.games.map((g, i) => g.a != null ? `<div class="row small" style="padding:4px 0"><span class="dim" style="width:70px">${['7 vs 8', '9 vs 10', 'Final'][i]}</span>${U.logo(T(g.a), 20)} ${esc(T(g.a).abbr)} <span class="dim">vs</span> ${U.logo(T(g.b), 20)} ${esc(T(g.b).abbr)} <span class="right">${g.winner != null ? `<b>${esc(T(g.winner).abbr)}</b> advances` : 'TBD'}</span></div>` : '').join('')}</div>`;
      };
      const seriesBox = s => `<div class="series">${[[s.hi, s.wins[0], s.hiSeed], [s.lo, s.wins[1], s.loSeed]].map(([id, w, seed]) => `<div class="tm ${s.winner != null ? (s.winner === id ? 'won' : 'lost') : ''}">${U.logo(T(id), 18)}<span>${seed ? `<span class="dim">${seed}</span> ` : ''}${esc(T(id).abbr)}</span><span class="w">${w}</span></div>`).join('')}</div>`;
      const r = P.rounds;
      const col = (round, conf) => r[round] ? r[round].filter(s => s.conf === conf).map(seriesBox).join('') : '';
      return `<h2>${Lg.season + 1} Playoffs</h2>
        ${P.champion != null ? `<div class="panel center"><div class="row" style="justify-content:center">${U.logo(T(P.champion), 72)}</div><h2 style="margin-top:8px">${esc(T(P.champion).city)} ${esc(T(P.champion).name)}: Champions</h2></div>` : ''}
        <div class="grid c2">${pin('East')}${pin('West')}</div>
        ${r.length ? `<div class="panel"><div class="bracket">
          <div class="colh">West R1</div><div class="colh">West Semis</div><div class="colh">West Finals</div><div class="colh">NBA Finals</div><div class="colh">East Finals</div><div class="colh">East Semis</div><div class="colh">East R1</div>
          <div class="col">${col(0, 'West')}</div><div class="col">${col(1, 'West')}</div><div class="col">${col(2, 'West')}</div>
          <div class="col">${r[3] ? r[3].map(seriesBox).join('') : '<div class="series center dim">TBD</div>'}</div>
          <div class="col">${col(2, 'East')}</div><div class="col">${col(1, 'East')}</div><div class="col">${col(0, 'East')}</div>
        </div></div>` : ''}`;
    },

    players() {
      const q = (viewState.q || '').toLowerCase();
      const pos = viewState.pos || 'all';
      let list = Object.values(L().players).filter(p => !p.retired && (p.teamId != null));
      if (q) list = list.filter(p => p.name.toLowerCase().includes(q));
      if (pos !== 'all') list = list.filter(p => p.pos === pos);
      list.sort((a, b) => b.ovr - a.ovr);
      return `<div class="row wrap"><h2>Player Search</h2><input type="text" placeholder="Search players…" value="${esc(viewState.q || '')}" data-q style="min-width:220px">
        ${U.seg('pos', [['all', 'All'], ...HL.POSITIONS.map(p => [p, p])], pos)}</div>
        <div class="table-wrap"><table class="t"><thead><tr><th class="l">Player</th><th class="l">Team</th><th>OVR</th><th>POT</th><th class="l">Archetype</th><th>Contract</th></tr></thead><tbody>
        ${list.slice(0, 150).map(p => `<tr><td class="l">${plCell(p, 28)}</td><td class="l">${p.teamId != null ? `<div class="pl" data-team-view="${p.teamId}">${U.logo(L().teams[p.teamId], 22)}<span class="nm">${esc(L().teams[p.teamId].abbr)}</span></div>` : 'FA'}</td>
          <td>${U.ovr(p.ovr)}</td><td class="muted">${p.potential}</td><td class="l small">${esc(HL.archetypeName(p))}</td><td>${U.money(p.contract.amount)}</td></tr>`).join('')}
        </tbody></table></div>`;
    },

    history() {
      const Lg = L();
      if (!Lg.history.length && !Lg.awards[Lg.season]) return `<h2>History & Awards</h2><div class="panel empty">Your league's history starts after the first season. Real NBA history comes with era mode.</div>`;
      const pn = id => id != null ? `<span class="pl" data-player="${id}" style="display:inline-flex;cursor:pointer"><span class="nm">${esc(Lg.players[id].name)}</span></span>` : '—';
      return `<h2>History & Awards</h2>
        ${Lg.awards[Lg.season] && !Lg.history.find(h => h.season === Lg.season) ? `<div class="panel"><h3>${Lg.season}-${String(Lg.season + 1).slice(2)} awards</h3>${awardsBlock(Lg.awards[Lg.season], pn)}</div>` : ''}
        <div class="table-wrap"><table class="t"><thead><tr><th class="l">Season</th><th class="l">Champion</th><th class="l">Runner-up</th><th>Series</th><th class="l">MVP</th><th class="l">Finals MVP</th><th class="l">DPOY</th><th class="l">ROY</th></tr></thead><tbody>
        ${Lg.history.slice().reverse().map(h => `<tr><td class="l">${h.season}-${String(h.season + 1).slice(2)}</td>
          <td class="l"><div class="pl">${U.logo(Lg.teams[h.champion], 22)}<b>${esc(Lg.teams[h.champion].name)}</b></div></td><td class="l">${esc(Lg.teams[h.runnerUp].name)}</td><td>${h.finalsScore}</td>
          <td class="l">${pn(h.mvp)}</td><td class="l">${pn(h.fmvp)}</td><td class="l">${pn(h.dpoy)}</td><td class="l">${pn(h.roy)}</td></tr>`).join('')}
        </tbody></table></div>`;
    },

    rules() {
      const r = L().rules;
      const tog = (k, label, desc) => `<div class="row" style="padding:8px 0;border-bottom:1px solid #1b2431"><div class="grow"><b>${label}</b><div class="muted small">${desc}</div></div><label class="switch"><input type="checkbox" data-rule="${k}" ${r[k] ? 'checked' : ''}><span></span></label></div>`;
      const num = (k, label, desc, min, max) => `<div class="row" style="padding:8px 0;border-bottom:1px solid #1b2431"><div class="grow"><b>${label}</b><div class="muted small">${desc}</div></div><input type="number" min="${min}" max="${max}" value="${r[k]}" data-rule-num="${k}" style="width:80px"></div>`;
      return `<div class="row wrap"><h2>Rulebook</h2><span class="muted small">Every change affects the sim, and the league will react to it.</span></div>
      <div class="grid c2">
        <div class="panel"><h3>Court & scoring</h3>
          ${tog('threePoint', 'Three-point line', 'Turn it off and watch the spacing disappear.')}
          ${tog('fourPoint', '4-point line', 'A deep zone worth four. Shooters become gold.')}
          ${num('threeValue', 'Three-pointer value', 'How many points a three is worth.', 2, 5)}
        </div>
        <div class="panel"><h3>Clock & game</h3>
          ${num('quarterLen', 'Quarter length (min)', 'NBA: 12, FIBA: 10.', 4, 20)}
          ${num('otLen', 'Overtime length (min)', 'NBA: 5.', 1, 12)}
          ${num('shotClock', 'Shot clock (sec)', 'Shorter = faster pace.', 10, 35)}
        </div>
        <div class="panel"><h3>Contact & fouls (chaos)</h3>
          ${tog('handCheck', 'Hand-checking allowed', '90s-style defense. Perimeter scoring gets harder.')}
          ${tog('tackling', 'Allow tackling', 'Yes, really. Injuries skyrocket and the players\' union will riot.')}
          ${tog('noFouls', 'No fouls called', 'Anything goes. No free throws.')}
          ${num('foulOut', 'Foul-out limit (0 = never)', 'NBA: 6.', 0, 12)}
        </div>
        <div class="panel"><h3>Health</h3>
          ${num('injuryMult', 'Injury frequency multiplier', '1 = realistic, 0 = no injuries.', 0, 5)}
          <div class="muted small" style="margin-top:8px">More rule tabs are on the way (roster size, 3v3, season length, CBA, lottery, relegation…) plus full media reactions and league-integrity consequences.</div>
        </div>
      </div>`;
    },

    settings() {
      const s = L().settings;
      return `<h2>Settings & Saves</h2><div class="grid c2">
        <div class="panel"><h3>Game</h3><div class="col">
          <div class="field"><label>Difficulty</label>${U.seg('difficulty', [['rookie', 'Rookie'], ['pro', 'Pro'], ['allstar', 'All-Star'], ['hof', 'Hall of Fame']], s.difficulty)}</div>
          <div class="field"><label>Depth</label>${U.seg('depth', [['simple', 'Simple'], ['detailed', 'Detailed']], s.depth)}</div>
        </div></div>
        <div class="panel"><h3>Saves</h3><div class="col">
          <button class="btn" data-save>💾 Save now</button>
          <button class="btn" data-export>⬇️ Export save file</button>
          <div class="muted small">The game autosaves after every sim. Saves live in this browser (IndexedDB). Export a file to back one up or move it.</div>
        </div></div>
      </div>`;
    },

    soon() {
      const titles = { trades: 'Trades & Trade Finder', freeagency: 'Free Agency', draft: 'Draft & Scouting', finances: 'Finances & Owner Goals', staff: 'Staff' };
      return `<h2>${titles[view] || 'Coming soon'}</h2><div class="panel empty">This part of the front office is coming in the next milestone. The sim already handles it automatically (AI draft, re-signings and free agency each offseason).</div>`;
    },
  };
  VIEWS.trades = VIEWS.freeagency = VIEWS.draft = VIEWS.finances = VIEWS.staff = VIEWS.soon;

  // ---------------- view bindings ----------------
  const BIND = {
    news(el) { el.querySelectorAll('[data-seg] button').forEach(b => b.onclick = () => { viewState.filter = b.dataset.v; renderView(); }); },
    roster(el) { el.querySelector('[data-team-select]').onchange = (e) => { viewState.team = +e.target.value; renderView(); }; },
    players(el) {
      const q = el.querySelector('[data-q]');
      q.oninput = () => { viewState.q = q.value; renderView(); const n = document.querySelector('[data-q]'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); };
      el.querySelectorAll('[data-seg] button').forEach(b => b.onclick = () => { viewState.pos = b.dataset.v; renderView(); });
    },
    strategy(el) {
      const t = me();
      t.strategy = Object.assign(HL.DEFAULT_STRATEGY(), t.strategy);
      el.querySelectorAll('[data-strat]').forEach(r => r.onchange = () => { t.strategy[r.dataset.strat] = +r.value; renderView(); });
      el.querySelectorAll('[data-seg]').forEach(sg => sg.querySelectorAll('button').forEach(b => b.onclick = () => { t.strategy[sg.dataset.seg] = b.dataset.v; renderView(); }));
      el.querySelectorAll('[data-starter]').forEach(sel => sel.onchange = () => {
        const ids = [...el.querySelectorAll('[data-starter]')].map(s => +s.value);
        if (new Set(ids).size < 5) { U.toast('A player can only start at one position.'); return renderView(); }
        t.strategy.starters = ids;
        renderView();
      });
      el.querySelector('[data-auto-starters]').onclick = () => { t.strategy.starters = null; renderView(); };
      el.querySelector('[data-auto-min]').onclick = () => { t.strategy.minutes = null; renderView(); };
      el.querySelectorAll('[data-min]').forEach(r => {
        r.oninput = () => { el.querySelector(`[data-minv="${r.dataset.min}"]`).textContent = r.value; };
        r.onchange = () => {
          const players = HL.League.teamPlayers(t.id).filter(p => !p.injury || p.injury.games <= 0);
          if (!t.strategy.minutes) {
            const st = HL.autoStarters(players);
            t.strategy.minutes = HL.autoMinutes(players, st, 240);
          }
          t.strategy.minutes[r.dataset.min] = +r.value;
          renderView();
        };
      });
    },
    rules(el) {
      const r = L().rules;
      el.querySelectorAll('[data-rule]').forEach(cb => cb.onchange = () => { r[cb.dataset.rule] = cb.checked; ruleReaction(cb.dataset.rule, cb.checked); });
      el.querySelectorAll('[data-rule-num]').forEach(inp => inp.onchange = () => {
        const v = Math.max(+inp.min, Math.min(+inp.max, +inp.value));
        const old = r[inp.dataset.ruleNum];
        r[inp.dataset.ruleNum] = v;
        if (old !== v) ruleReaction(inp.dataset.ruleNum, v, old);
      });
    },
    settings(el) {
      el.querySelectorAll('[data-seg]').forEach(sg => sg.querySelectorAll('button').forEach(b => b.onclick = () => { L().settings[sg.dataset.seg] = b.dataset.v; renderView(); }));
      el.querySelector('[data-save]').onclick = async () => { await autosave(); U.toast('Saved ✅'); };
      el.querySelector('[data-export]').onclick = () => HL.Saves.exportFile(L());
    },
  };

  function ruleReaction(key, val, old) {
    const n = HL.RuleReactions ? HL.RuleReactions.react(L(), key, val, old) : null;
    if (n) U.toast(`📰 ${esc(n.headline)}`, 4200);
    autosave();
  }

  // ---------------- shared bits ----------------
  function maxGP() { return Math.max(1, ...L().teams.map(t => t.w + t.l)); }

  function edgeText(tid, oid, home) {
    const a = HL.News.teamStrength(L(), tid), b = HL.News.teamStrength(L(), oid);
    const d = (a - b) / 10 + (home ? 1 : -1);
    const pct = Math.round(100 / (1 + Math.exp(-d / 2.2)));
    return `${pct}% win chance ${pct >= 50 ? '🟢' : '🔴'}`;
  }

  function gameRow(g, tid, showUnplayed) {
    const Lg = L();
    const home = g.home === tid;
    const opp = Lg.teams[home ? g.away : g.home];
    if (!g.res) return showUnplayed ? `<div class="game-row" style="cursor:default"><span class="res dim">·</span><span class="dim mono small" style="width:54px">Day ${g.day + 1}</span>${home ? 'vs' : '@'} ${U.logo(opp, 24)} <span>${esc(opp.city)} ${esc(opp.name)}</span></div>` : '';
    const my = home ? g.res.hs : g.res.as, their = home ? g.res.as : g.res.hs;
    const won = my > their;
    return `<div class="game-row" data-box="${g.gid}"><span class="res ${won ? 'good' : 'bad'}">${won ? 'W' : 'L'}</span><span class="dim mono small" style="width:54px">Day ${g.day + 1}</span>${home ? 'vs' : '@'} ${U.logo(opp, 24)} <span>${esc(opp.name)}</span><span class="right mono"><b>${my}-${their}</b>${g.res.ot ? ` <span class="dim">${g.res.ot > 1 ? g.res.ot : ''}OT</span>` : ''}</span></div>`;
  }

  function statsTable(rows) {
    return `<div class="table-wrap"><table class="t"><thead><tr><th class="l">Player</th><th>GP</th><th>GS</th><th>MIN</th><th>PTS</th><th>REB</th><th>AST</th><th>STL</th><th>BLK</th><th>TOV</th><th>FG%</th><th>3P%</th><th>FT%</th><th>TS%</th><th>+/-</th></tr></thead><tbody>
      ${rows.map(({ p, s }) => `<tr><td class="l">${plCell(p, 28)}</td><td>${s.gp}</td><td>${s.gs}</td><td>${U.fx(s.min)}</td><td><b>${U.fx(s.pts)}</b></td><td>${U.fx(s.reb)}</td><td>${U.fx(s.ast)}</td><td>${U.fx(s.stl)}</td><td>${U.fx(s.blk)}</td><td>${U.fx(s.tov)}</td><td>${U.pct(s.fgp)}</td><td>${U.pct(s.tpp)}</td><td>${U.pct(s.ftp)}</td><td>${U.pct(s.ts)}</td><td class="${s.pm >= 0 ? 'good' : 'bad'}">${s.pm >= 0 ? '+' : ''}${U.fx(s.pm)}</td></tr>`).join('')}
    </tbody></table></div>`;
  }

  function awardsBlock(a, pn) {
    return `<div class="grid c3">
      <div><div class="tiny muted">MVP</div><b>${pn(a.mvp)}</b></div>
      <div><div class="tiny muted">Defensive POY</div><b>${pn(a.dpoy)}</b></div>
      <div><div class="tiny muted">Rookie of the Year</div><b>${pn(a.roy)}</b></div>
      <div><div class="tiny muted">Sixth Man</div><b>${pn(a.smoy)}</b></div>
      <div><div class="tiny muted">Scoring title</div><b>${pn(a.scoringChamp)}</b></div>
      <div><div class="tiny muted">MVP race</div>${a.mvpRace.map(pn).join(', ')}</div>
    </div>
    <div style="margin-top:10px">${a.allNba.map((tm, i) => `<div class="small" style="padding:3px 0"><span class="muted">All-NBA ${['1st', '2nd', '3rd'][i]}:</span> ${tm.map(pn).join(', ')}</div>`).join('')}</div>`;
  }

  // ---------------- MODALS ----------------
  function playerCard(pid) {
    const Lg = L(), p = Lg.players[pid];
    if (!p) return;
    const t = p.teamId != null ? Lg.teams[p.teamId] : null;
    const color = t ? t.color : '#334155';
    const groups = {};
    for (const a of HL.ATTRS) (groups[a.group] = groups[a.group] || []).push(a);
    const seasons = Object.keys(p.stats).filter(k => !k.endsWith('p')).sort();
    const awards = p.careerAwards.reduce((m, a) => { m[a.award] = (m[a.award] || 0) + 1; return m; }, {});
    const m = U.modal(`${t ? U.logo(t, 28) : ''}<h3>${esc(p.name)}</h3>`, `
      <div class="hero" style="--c:${color}">
        <div class="big-num">${p.ovr}</div>
        ${U.avatar(p, 180, t)}
        <div>
          <div class="nm">${esc(p.name)}</div>
          <div class="bio"><span>${p.pos}</span><span>${HL.fmtHeight(p.height)} · ${p.weight} lbs</span><span>Wingspan ${HL.fmtHeight(p.wingspan)}</span><span>Age ${p.age}</span><span>${t ? esc(t.city + ' ' + t.name) : 'Free agent'}</span></div>
          <div class="row wrap" style="margin-top:10px"><span class="chip accent">${esc(HL.archetypeName(p))}</span><span class="chip">${U.money(p.contract.amount)} thru ${p.contract.exp + 1}</span>${p.real ? '<span class="chip">Real player</span>' : '<span class="chip">Generated</span>'}${injTag(p)}</div>
          <div class="row wrap" style="margin-top:8px">${Object.entries(awards).map(([k, v]) => `<span class="chip ${k === 'Champion' || k === 'MVP' ? 'accent' : ''}">${v > 1 ? v + '× ' : ''}${esc(k)}</span>`).join('')}</div>
        </div>
        <div class="ovr-box center">${U.ovr(p.ovr, true)}<div class="tiny muted" style="margin-top:4px">POT ${p.potential}</div></div>
      </div>
      <div class="tabs"><button class="tab active" data-tab="ratings">Ratings</button><button class="tab" data-tab="stats">Stats</button><button class="tab" data-tab="tend">Tendencies</button><button class="tab" data-tab="traits">Personality</button></div>
      <div data-pane="ratings" class="grid c3">${Object.entries(groups).map(([g, attrs]) => `<div class="panel"><h3>${g}</h3><div class="col" style="gap:8px">${attrs.map(a => `<div class="attr"><span>${a.label}</span><b class="mono" style="text-align:right">${p.attrs[a.key]}</b><div class="bar"><i style="width:${p.attrs[a.key]}%"></i></div></div>`).join('')}</div></div>`).join('')}</div>
      <div data-pane="stats" class="hidden">${seasons.length ? `<div class="table-wrap"><table class="t"><thead><tr><th class="l">Season</th><th class="l">Team</th><th>GP</th><th>MIN</th><th>PTS</th><th>REB</th><th>AST</th><th>STL</th><th>BLK</th><th>FG%</th><th>3P%</th><th>FT%</th><th>TS%</th></tr></thead><tbody>
        ${seasons.map(sk => { const s = HL.League.perGame(p, +sk); const tm = Lg.teams[p.stats[sk].teamId]; return s ? `<tr><td class="l">${sk}-${String(+sk + 1).slice(2)}</td><td class="l">${tm ? esc(tm.abbr) : '-'}</td><td>${s.gp}</td><td>${U.fx(s.min)}</td><td><b>${U.fx(s.pts)}</b></td><td>${U.fx(s.reb)}</td><td>${U.fx(s.ast)}</td><td>${U.fx(s.stl)}</td><td>${U.fx(s.blk)}</td><td>${U.pct(s.fgp)}</td><td>${U.pct(s.tpp)}</td><td>${U.pct(s.ftp)}</td><td>${U.pct(s.ts)}</td></tr>` : ''; }).join('')}
      </tbody></table></div>` : '<div class="empty">No games played yet.</div>'}</div>
      <div data-pane="tend" class="hidden"><div class="grid c2">${Object.entries({ usage: 'Usage / shot volume', three: 'Three-point frequency', mid: 'Mid-range frequency', drive: 'Drive to the rim', post: 'Post-ups', passFirst: 'Pass-first', gamble: 'Gamble for steals', crash: 'Crash the glass', effort: 'Effort / intensity', foulAggr: 'Physicality' }).map(([k, label]) => `<div class="attr"><span>${label}</span><b class="mono" style="text-align:right">${p.tend[k]}</b><div class="bar"><i style="width:${p.tend[k]}%"></i></div></div>`).join('')}</div>
        <div class="muted small" style="margin-top:10px">Tendencies drive this player's decisions in the possession sim. In Player Career you set your own.</div></div>
      <div data-pane="traits" class="hidden"><div class="grid c2">${Object.entries({ workEthic: 'Work ethic', competitive: 'Competitiveness', clutch: 'Clutch', leadership: 'Leadership', loyalty: 'Loyalty', greed: 'Money motivation', ego: 'Ego', temperament: 'Temperament' }).map(([k, label]) => `<div class="attr"><span>${label}</span><b class="mono" style="text-align:right">${p.traits[k]}</b><div class="bar"><i style="width:${p.traits[k]}%"></i></div></div>`).join('')}</div></div>
    `);
    requestAnimationFrame(() => m.querySelectorAll('.bar > i').forEach(i => { const w = i.style.width; i.style.width = '0'; requestAnimationFrame(() => { i.style.width = w; }); }));
    m.querySelectorAll('[data-tab]').forEach(tb => tb.onclick = () => {
      m.querySelectorAll('[data-tab]').forEach(x => x.classList.toggle('active', x === tb));
      m.querySelectorAll('[data-pane]').forEach(x => x.classList.toggle('hidden', x.dataset.pane !== tb.dataset.tab));
    });
  }

  function teamCard(tid) {
    viewState = { team: tid };
    view = 'roster';
    render();
  }

  function boxScore(gid) {
    const Lg = L();
    const b = Lg.boxScores[gid];
    if (!b) { U.toast('Box score no longer stored for that game.'); return; }
    const H = Lg.teams[b.home.teamId], A = Lg.teams[b.away.teamId];
    const hs = b.home.score, as = b.away.score;
    const qn = b.home.quarters.length;
    const side = (sd, team) => {
      const rows = Object.entries(sd.box).map(([id, l]) => ({ p: Lg.players[id], l })).sort((x, y) => (y.l.gs - x.l.gs) || (y.l.min - x.l.min));
      const tot = rows.reduce((t, { l }) => { for (const k in l) t[k] = (t[k] || 0) + l[k]; return t; }, {});
      const r = l => `<td>${Math.round(l.min)}</td><td><b>${l.pts}</b></td><td>${l.orb + l.drb}</td><td>${l.ast}</td><td>${l.stl}</td><td>${l.blk}</td><td>${l.tov}</td><td>${l.fgm}-${l.fga}</td><td>${l.tpm}-${l.tpa}</td><td>${l.ftm}-${l.fta}</td><td>${l.pf}</td><td class="${l.pm >= 0 ? 'good' : 'bad'}">${l.pm > 0 ? '+' : ''}${l.pm}</td>`;
      return `<div class="row">${U.logo(team, 26)}<h3>${esc(team.city)} ${esc(team.name)}</h3></div>
        <div class="table-wrap"><table class="t"><thead><tr><th class="l">Player</th><th>MIN</th><th>PTS</th><th>REB</th><th>AST</th><th>STL</th><th>BLK</th><th>TO</th><th>FG</th><th>3P</th><th>FT</th><th>PF</th><th>+/-</th></tr></thead><tbody>
        ${rows.map(({ p, l }) => `<tr><td class="l"><div class="pl" data-player="${p.id}">${U.avatar(p, 26, team)}<span class="nm">${esc(p.name)}${l.gs ? ' <span class="dim tiny">S</span>' : ''}</span></div></td>${r(l)}</tr>`).join('')}
        <tr><td class="l"><b>Totals</b></td><td></td><td><b>${tot.pts}</b></td><td>${tot.orb + tot.drb}</td><td>${tot.ast}</td><td>${tot.stl}</td><td>${tot.blk}</td><td>${tot.tov}</td><td>${tot.fgm}-${tot.fga}</td><td>${tot.tpm}-${tot.tpa}</td><td>${tot.ftm}-${tot.fta}</td><td>${tot.pf}</td><td></td></tr>
        </tbody></table></div>`;
    };
    const m = U.modal('<h3>Box score</h3>', `
      <div class="scoreboard" style="--ca:${A.color};--ch:${H.color}">
        <div class="side">${U.logo(A, 64)}<div><div class="tn">${esc(A.name)}</div><div class="muted small">${esc(A.city)}</div></div><div class="score ${as > hs ? 'win' : 'loss'}" style="margin-left:auto">${as}</div></div>
        <div class="mid"><b>FINAL${b.ot ? (b.ot > 1 ? ' / ' + b.ot + 'OT' : ' / OT') : ''}</b><div>${esc(H.arena)}</div></div>
        <div class="side home"><div class="score ${hs > as ? 'win' : 'loss'}" style="margin-right:auto">${hs}</div><div><div class="tn">${esc(H.name)}</div><div class="muted small">${esc(H.city)}</div></div>${U.logo(H, 64)}</div>
      </div>
      <div class="table-wrap quarters"><table class="t"><thead><tr><th class="l">Team</th>${b.home.quarters.map((_, i) => `<th>${i < 4 ? 'Q' + (i + 1) : 'OT' + (i - 3 > 1 ? i - 3 : '')}</th>`).join('')}<th>T</th></tr></thead><tbody>
        <tr><td class="l">${esc(A.abbr)}</td>${b.away.quarters.map(q => `<td>${q}</td>`).join('')}<td><b>${as}</b></td></tr>
        <tr><td class="l">${esc(H.abbr)}</td>${b.home.quarters.map(q => `<td>${q}</td>`).join('')}<td><b>${hs}</b></td></tr></tbody></table></div>
      <div class="tabs"><button class="tab active" data-tab="box">Box score</button>${b.pbp ? '<button class="tab" data-tab="pbp">Play-by-play</button>' : ''}</div>
      <div data-pane="box" class="col">${side(b.away, A)}${side(b.home, H)}</div>
      ${b.pbp ? `<div data-pane="pbp" class="hidden"><div class="table-wrap" style="max-height:60vh;overflow-y:auto"><table class="t"><thead><tr><th class="l">Q</th><th class="l">Time</th><th class="l">Team</th><th class="l">Play</th><th>Score</th></tr></thead><tbody>
        ${b.pbp.map(e => `<tr><td class="l">${e.q > 4 ? 'OT' + (e.q - 4) : 'Q' + e.q}</td><td class="l mono">${e.t}</td><td class="l">${e.team ? esc(e.team) : ''}</td><td class="l" style="white-space:normal">${esc(e.txt)}</td><td class="mono">${e.as}-${e.hs}</td></tr>`).join('')}
      </tbody></table></div></div>` : ''}
    `);
    bindCommon(m);
    m.querySelectorAll('[data-tab]').forEach(tb => tb.onclick = () => {
      m.querySelectorAll('[data-tab]').forEach(x => x.classList.toggle('active', x === tb));
      m.querySelectorAll('[data-pane]').forEach(x => x.classList.toggle('hidden', x.dataset.pane !== tb.dataset.tab));
    });
  }

  return { setup, open, render, playerCard, boxScore };
})();
