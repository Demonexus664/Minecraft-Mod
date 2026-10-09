// Detailed Franchise (MyNBA-style): setup + hub.
window.HL = window.HL || {};

HL.Franchise = (function () {
  const U = HL.UI;
  const esc = U.esc;
  const L = () => HL.League.get();
  const me = () => L().teams[L().userTeamId];
  let section = 'home', page = 'overview', pageState = {};

  // ---------------- navigation map ----------------
  const SECTIONS = [
    ['home', 'Home', [['overview', 'Overview'], ['news', 'News']]],
    ['team', 'Team', [['roster', 'Roster'], ['rotation', 'Rotation & Game Plan'], ['schedule', 'Schedule'], ['stats', 'Player Stats']]],
    ['league', 'League', [['standings', 'Standings'], ['leaders', 'Leaders'], ['playoffs', 'Playoffs'], ['players', 'Players'], ['history', 'History']]],
    ['office', 'Front Office', [['trades', 'Trades', 1], ['freeagency', 'Free Agency', 1], ['draft', 'Draft', 1], ['finances', 'Finances', 1], ['staff', 'Staff', 1]]],
    ['league-office', 'League Office', [['rules', 'Rulebook'], ['settings', 'Settings']]],
  ];
  const go = (sec, pg, state = {}) => { section = sec; page = pg; pageState = state; render(); window.scrollTo(0, 0); };

  // ---------------- SETUP ----------------
  const QUICK = [
    [2025, 'Latest season'], [2015, '73-9 Warriors'], [2012, 'Heat repeat'], [2007, 'Big Three Celtics'], [2003, 'LeBron arrives'],
    [1995, '72-10 Bulls'], [1990, 'Jordan\'s first ring'], [1984, 'Jordan\'s rookie year'], [1979, 'Bird & Magic'], [1964, 'Celtics dynasty'],
  ];
  function setup() {
    U.applyTeamTheme(null);
    U.setEra('modern');
    const st = { season: HL.LATEST_SEASON, team: null, difficulty: 'pro', depth: 'detailed', role: 'gm', history: 'real', loading: false };
    const seasons = HL.HISTORY.seasons.filter(k => !k.includes('-')).map(Number).sort((a, b) => b - a);
    const strengthOf = (S, abbr) => {
      const ovrs = S.players.filter(r => r[1][0] && r[1][0][0] === abbr).map(r => r[14]).sort((a, b) => b - a).slice(0, 8);
      return Math.round(ovrs.reduce((s, v, i) => s + v * [1.4, 1.3, 1.2, 1.1, 1, .7, .6, .5][i], 0) / 7.8);
    };
    const render = () => {
      const S = HL.HISTORY_SEASONS[String(st.season)];
      const teams = S ? S.teams.map(t => ({ meta: HL.History.teamMeta(t[0], t[1], st.season), w: t[2], l: t[3], abbr: t[0], str: strengthOf(S, t[0]) })).sort((a, b) => a.meta.city.localeCompare(b.meta.city)) : [];
      const label = `${st.season}-${String(st.season + 1).slice(2)}`;
      U.app().innerHTML = `
      <div class="frame">
        <div class="masthead"><div class="bar">
          <div class="wordmark" data-home>Hoops<i>Life</i></div>
          <div class="mainnav"><button class="on">New Franchise</button></div>
        </div></div>
        <div class="page">
          <div class="page-title"><h2>New Franchise</h2><span class="t2">Real rosters, ratings and records from Basketball-Reference</span></div>
          <section class="block"><header><h3>Season</h3><span class="t3 sm">Start in any season. History is simulated from there, so it can go differently.</span></header><div class="body stack">
            <div class="row wrap">
              <select data-season style="min-width:160px">${seasons.map(y => `<option value="${y}" ${y === st.season ? 'selected' : ''}>${y}-${String(y + 1).slice(2)}</option>`).join('')}</select>
              ${QUICK.map(([y, t]) => `<button class="btn small ${y === st.season ? 'go' : ''}" data-quick="${y}">${y}-${String(y + 1).slice(2)} · ${t}</button>`).join('')}
            </div>
          </div></section>
          <div class="cols c3">
            <section class="block"><header><h3>Your role</h3></header><div class="body stack">
              ${U.seg('role', [['coach', 'Coach'], ['gm', 'GM'], ['owner', 'Owner']], st.role)}
              <div class="t2 sm">${{ coach: 'Rotations, game plans and player relationships. The front office makes the roster moves.', gm: 'Coach plus front office: roster, contracts, trades and the draft.', owner: 'Everything, including the business side and the rulebook.' }[st.role]}</div>
            </div></section>
            <section class="block"><header><h3>History</h3></header><div class="body stack">
              ${U.seg('history', [['real', 'Real careers'], ['random', 'Fictional future']], st.history)}
              <div class="t2 sm">${st.history === 'real' ? 'Real players follow their real careers, and real draft classes arrive each year (Jordan in 1984, LeBron in 2003…). Results are simulated, so history can change.' : 'From your start season on, careers develop randomly and future draft classes are fictional.'}</div>
            </div></section>
            <section class="block"><header><h3>Difficulty & depth</h3></header><div class="body stack">
              ${U.seg('difficulty', [['rookie', 'Rookie'], ['pro', 'Pro'], ['allstar', 'All-Star'], ['hof', 'Hall of Fame']], st.difficulty)}
              ${U.seg('depth', [['simple', 'Simple'], ['detailed', 'Detailed']], st.depth)}
            </div></section>
          </div>
          <section class="block"><header><h3>Choose a team · ${label}</h3><span class="t3 sm ml-auto">${S ? `${teams.length} teams · real record shown · strength = top-8 weighted OVR` : ''}</span></header>
            <div class="body flush">${st.loading || !S ? '<div class="empty">Loading season…</div>' : `<div class="picker" style="border:0;border-radius:0">
              ${teams.map(t => `<button class="pick ${st.team === t.abbr ? 'on' : ''}" style="--c:${U.teamAccent(t.meta).c}" data-team="${t.abbr}">
                ${U.logo(t.meta, 40)}<div><div class="cty">${esc(t.meta.city)}</div><div class="nm">${esc(t.meta.name)}</div></div>
                <div class="str"><div class="num" style="font-size:22px">${t.str}</div><div class="caps" style="font-size:10px">${t.w}-${t.l}</div></div>
              </button>`).join('')}
            </div>`}</div>
          </section>
          <div class="row"><button class="btn quiet" data-back>${U.icon('back')} Back</button>
            <button class="btn go big ml-auto" data-start ${st.team == null ? 'disabled' : ''}>${st.team != null && S ? `Start as the ${label} ${esc(teams.find(t => t.abbr === st.team).meta.name)}` : 'Pick a team'}</button></div>
        </div>
      </div>`;
      const root = U.app();
      root.querySelector('[data-back]').onclick = () => HL.App.title();
      root.querySelector('[data-home]').onclick = () => HL.App.title();
      const pickSeason = (y) => { st.season = y; st.team = null; U.applyTeamTheme(null); loadSeason(); };
      root.querySelector('[data-season]').onchange = (e) => pickSeason(+e.target.value);
      root.querySelectorAll('[data-quick]').forEach(b => b.onclick = () => pickSeason(+b.dataset.quick));
      root.querySelectorAll('[data-team]').forEach(el => el.onclick = () => {
        st.team = el.dataset.team;
        const t = teams.find(x => x.abbr === st.team);
        U.applyTeamTheme(t.meta);
        render();
      });
      root.querySelectorAll('[data-seg]').forEach(sg => sg.querySelectorAll('button').forEach(b => b.onclick = () => { st[sg.dataset.seg] = b.dataset.v; render(); }));
      root.querySelector('[data-start]').onclick = () => {
        if (st.team == null) return;
        HL.League.createFromSeason({ seasonKey: String(st.season), userAbbr: st.team, settings: { difficulty: st.difficulty, depth: st.depth, role: st.role, history: st.history } });
        L().mode = 'franchise';
        section = 'home'; page = 'overview'; pageState = {};
        open();
        autosave();
      };
    };
    const loadSeason = () => {
      st.loading = true; render();
      HL.History.load(String(st.season)).then(() => { st.loading = false; render(); }).catch(e => { st.loading = false; U.toast(esc(e.message)); render(); });
    };
    loadSeason();
  }

  // ---------------- FRAME ----------------
  function open() {
    U.applyTeamTheme(me());
    U.setEra(L().settings.eraTheme && L().settings.eraTheme !== 'auto' ? L().settings.eraTheme : HL.eraForSeason(L().season));
    render();
  }

  function render() {
    U.setEra(L().settings.eraTheme && L().settings.eraTheme !== 'auto' ? L().settings.eraTheme : HL.eraForSeason(L().season));
    const sec = SECTIONS.find(s => s[0] === section);
    U.app().innerHTML = `
    <div class="frame">
      <div class="masthead">
        <div class="bar">
          <div class="wordmark" data-quit title="Main menu">Hoops<i>Life</i></div>
          <nav class="mainnav">${SECTIONS.map(([id, label, pages]) => `<button class="${id === section ? 'on' : ''}" data-sec="${id}" data-first="${pages[0][0]}">${label}</button>`).join('')}</nav>
          <div class="simbar"><span class="t2 sm" style="margin-right:6px;white-space:nowrap">${HL.fmtDay(L().season, L().day, { weekday: 1 })}</span>${simButtons()}</div>
        </div>
        <nav class="subnav">${sec[2].map(([id, label, soon]) => `<button class="${id === page ? 'on' : ''}" data-page="${id}">${label}${soon ? '<span class="soon">SOON</span>' : ''}</button>`).join('')}</nav>
      </div>
      <main class="page" id="page"></main>
    </div>`;
    const root = U.app();
    root.querySelectorAll('[data-sec]').forEach(b => b.onclick = () => go(b.dataset.sec, b.dataset.first));
    root.querySelectorAll('[data-page]').forEach(b => b.onclick = () => go(section, b.dataset.page));
    root.querySelector('[data-quit]').onclick = async () => { await autosave(); HL.App.title(); };
    root.querySelectorAll('[data-sim]').forEach(b => b.onclick = () => sim(b.dataset.sim));
    renderPage();
  }

  function simButtons() {
    const Lg = L();
    if (Lg.phase === 'regular') return `
      <button class="btn go small" data-sim="next">${U.icon('play')}<span class="lbl">Play next</span></button>
      <button class="btn small" data-sim="week"><span>Week</span></button>
      <button class="btn small" data-sim="month"><span>Month</span></button>
      <button class="btn small" data-sim="regular">${U.icon('ff')}<span class="lbl">To playoffs</span></button>`;
    if (Lg.phase === 'playin' || Lg.phase === 'playoffs') return `
      <button class="btn go small" data-sim="day">${U.icon('play')}<span class="lbl">Next day</span></button>
      <button class="btn small" data-sim="round"><span>Round</span></button>
      <button class="btn small" data-sim="season">${U.icon('ff')}<span class="lbl">Finish</span></button>`;
    return `<button class="btn go small" data-sim="advance">${U.icon('next')}<span class="lbl">Start ${Lg.season + 1}-${String(Lg.season + 2).slice(2)}</span></button>`;
  }

  function sim(kind) {
    const Lg = L();
    const uid = Lg.userTeamId;
    if (kind === 'advance') {
      const nextKey = String(Lg.season + 1);
      if (Lg.settings.history === 'real' && HL.HISTORY.seasons.includes(nextKey) && !HL.HISTORY_SEASONS[nextKey]) {
        HL.History.load(nextKey).then(() => sim('advance')).catch(e => U.toast(esc(e.message)));
        return;
      }
      HL.League.advanceToNextSeason();
      U.toast(`The ${Lg.season}-${String(Lg.season + 1).slice(2)} season is here. The draft, player progression, retirements and free agency are complete.`);
      go('home', 'overview');
      autosave();
      return;
    }
    let total = 1, stepFn;
    const lastDay = HL.League.lastDay();
    if (kind === 'next') {
      const next = Lg.schedule.find(g => !g.res && (g.home === uid || g.away === uid));
      total = next ? next.day - Lg.day + 1 : 1;
      stepFn = () => { HL.League.simDay(); };
    } else if (kind === 'week' || kind === 'month') {
      total = Math.max(1, Math.min(kind === 'week' ? 7 : 30, lastDay - Lg.day + 1));
      stepFn = () => { if (L().phase !== 'regular') return false; HL.League.simDay(); };
    } else if (kind === 'regular') {
      total = Math.max(1, lastDay - Lg.day + 1);
      stepFn = () => { if (L().phase !== 'regular') return false; HL.League.simDay(); };
    } else if (kind === 'day') {
      stepFn = () => HL.League.simDay();
    } else if (kind === 'round') {
      const startRounds = Lg.playoffs ? Lg.playoffs.rounds.length : 0, startPhase = Lg.phase;
      total = 14;
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
    U.runWithProgress(kind === 'next' ? 'Playing…' : 'Simulating…', total, stepFn, () => {
      render();
      autosave();
      if (kind === 'next' || kind === 'day') {
        const key = Object.keys(L().boxScores).reverse().find(k => { const b = L().boxScores[k]; return b.home.teamId === uid || b.away.teamId === uid; });
        if (key && (kind === 'next' || L().boxScores[key].day === L().day - 1)) boxScore(key);
      }
      const big = L().news.slice(before).filter(n => n.importance >= 3);
      if (big.length) U.toast(esc(big[big.length - 1].headline), 4200);
    });
  }

  async function autosave() {
    try { await HL.Saves.save(L()); } catch (e) { console.warn('autosave failed', e); }
  }

  // ---------------- shared fragments ----------------
  const who = (p, size = 30, sub) => `<div class="who" data-player="${p.id}">${U.face(p, size)}<div style="min-width:0"><div class="nm">${esc(p.name)}</div>${sub !== false ? `<div class="meta">${sub || `${p.pos} · ${HL.fmtHeight(p.height)} · ${p.age}`}</div>` : ''}</div></div>`;
  const hurt = p => p.injury && p.injury.games > 0 ? `<span class="tag hurt">${esc(p.injury.name)} · ${p.injury.games}g</span>` : '';
  const teamLink = (t, size = 22) => `<div class="who" data-teamv="${t.id}">${U.logo(t, size)}<span class="nm">${esc(t.name)}</span></div>`;
  const seasonLabel = s => `${s}-${String(s + 1).slice(2)}`;
  const topStars = (tid, n = 3) => HL.League.teamPlayers(tid).filter(p => !p.injury || p.injury.games <= 0).sort((a, b) => b.ovr - a.ovr).slice(0, n);
  function seriesStatus(s) {
    const T = id => L().teams[id];
    const [a, b] = s.wins;
    if (s.winner != null) return `${T(s.winner).name} win ${Math.max(a, b)}-${Math.min(a, b)}`;
    if (a === b) return a === 0 ? `Game 1 · best of ${s.bestOf || 7}` : `Series tied ${a}-${b}`;
    return `${T(a > b ? s.hi : s.lo).name} lead ${Math.max(a, b)}-${Math.min(a, b)}`;
  }
  function roundName(s) {
    if (s.conf === 'Finals') return `${L().season + 1} NBA Finals`;
    const P = L().playoffs, fmt = P.format;
    const n = Math.ceil(Math.log2(Math.max(2, fmt.perConf)));
    const idx = P.rounds.findIndex(r => r.includes(s));
    const word = L().season < 1970 ? 'Division' : 'Conference';
    return `${s.conf}ern ${idx === n - 1 ? word + ' Finals' : idx === n - 2 ? word + ' Semifinals' : 'First Round'}`;
  }
  function seriesPoster(s) {
    const A = L().teams[s.hi], B = L().teams[s.lo];
    return HL.GFX.matchupPoster(A, B, topStars(A.id, 2), topStars(B.id, 2), { kicker: roundName(s), title: s.conf === 'Finals' ? 'The Finals' : `${A.abbr} vs ${B.abbr}`, status: seriesStatus(s), wide: true });
  }
  function heroFor(n) {
    const Lg = L();
    try {
      if (n.type === 'champion' && n.teamIds) {
        const t = Lg.teams[n.teamIds[0]];
        return HL.GFX.championPoster(t, topStars(t.id), n.season + 1, { sub: n.body || '' });
      }
      if (n.type === 'award' && n.playerIds && n.playerIds.length && n.importance >= 3) {
        const p = Lg.players[n.playerIds[0]];
        const t = p.teamId != null ? Lg.teams[p.teamId] : null;
        return HL.GFX.awardCard(p, t, 'Most Valuable Player', n.body || '');
      }
      if ((n.type === 'game' || n.type === 'event') && n.playerIds && n.playerIds.length && n.teamIds && n.teamIds.length > 1) {
        const p = Lg.players[n.playerIds[0]];
        const A = Lg.teams[n.teamIds[1]], H = Lg.teams[n.teamIds[0]];
        if (!p) return '';
        const mine = p.teamId === A.id ? A : H, other = mine === A ? H : A;
        return HL.GFX.matchupPoster(mine, other, [p].concat(topStars(mine.id, 2).filter(x => x !== p)).slice(0, 2), topStars(other.id, 2), { kicker: HL.fmtDay(n.season, n.day, { weekday: 1 }), title: n.headline.length > 42 ? `${mine.abbr} vs ${other.abbr}` : n.headline, status: '' });
      }
    } catch (e) { return ''; }
    return '';
  }

  function bindCommon(el) {
    el.querySelectorAll('[data-player]').forEach(x => x.onclick = (e) => { e.stopPropagation(); playerSheet(+x.dataset.player); });
    el.querySelectorAll('[data-box]').forEach(x => x.onclick = () => boxScore(x.dataset.box));
    el.querySelectorAll('[data-goto]').forEach(x => x.onclick = () => { const [s, p] = x.dataset.goto.split('/'); go(s, p); });
    el.querySelectorAll('[data-teamv]').forEach(x => x.onclick = (e) => { e.stopPropagation(); go('team', 'roster', { team: +x.dataset.teamv }); });
  }

  function teamBand(t) {
    const Lg = L();
    const conf = HL.League.standings(t.conf);
    const seed = conf.indexOf(t) + 1;
    const gp = t.w + t.l;
    const net = gp ? (t.pf - t.pa) / gp : 0;
    const payroll = HL.League.teamPlayers(t.id).reduce((s, p) => s + p.contract.amount, 0);
    const l10 = t.last10.length ? `${t.last10.filter(x => x).length}-${t.last10.filter(x => !x).length}` : '—';
    return `<section class="teamband">
      <div class="flag">${U.logo(t, 70)}</div>
      <div class="ident"><div class="city">${esc(t.city)} · ${seasonLabel(Lg.season)}</div><div class="name">${esc(t.name)}</div></div>
      <div class="facts">
        <div class="fact"><b>${t.w}-${t.l}</b><span>Record</span></div>
        <div class="fact"><b>${gp ? U.ordinal(seed) : '—'}</b><span>${t.conf}</span></div>
        <div class="fact"><b class="${net > 0 ? 'win' : net < 0 ? 'loss' : ''}">${gp ? (net > 0 ? '+' : '') + net.toFixed(1) : '—'}</b><span>Net / game</span></div>
        <div class="fact"><b>${t.streak > 0 ? 'W' + t.streak : t.streak < 0 ? 'L' + (-t.streak) : '—'}</b><span>Streak</span></div>
        <div class="fact"><b>${l10}</b><span>Last 10</span></div>
        <div class="fact"><b>${U.money(payroll)}</b><span>Payroll</span></div>
      </div>
    </section>`;
  }

  function resultRow(g, tid) {
    const Lg = L();
    const home = g.home === tid;
    const opp = Lg.teams[home ? g.away : g.home];
    if (!g.res) return `<div class="res-row future"><span class="wl t3">·</span><span class="d">${HL.fmtDay(Lg.season, g.day)}</span><span class="t3">${home ? 'vs' : '@'}</span><div class="row">${U.logo(opp, 22)}<span>${esc(opp.city)} ${esc(opp.name)}</span></div><span class="t3 sm">${opp.w}-${opp.l}</span></div>`;
    const my = home ? g.res.hs : g.res.as, their = home ? g.res.as : g.res.hs;
    const won = my > their;
    return `<div class="res-row" data-box="${g.gid}"><span class="wl ${won ? 'win' : 'loss'}">${won ? 'W' : 'L'}</span><span class="d">${HL.fmtDay(Lg.season, g.day)}</span><span class="t3">${home ? 'vs' : '@'}</span><div class="row">${U.logo(opp, 22)}<span>${esc(opp.name)}</span></div><span class="num" style="font-size:17px">${my}-${their}${g.res.ot ? `<span class="t3 xs"> ${g.res.ot > 1 ? g.res.ot : ''}OT</span>` : ''}</span></div>`;
  }

  const VOICE_COLORS = { debate: '#b42318', stats: '#1570ef', insider: '#067647', beat: '#6941c6', oldhead: '#93370d', memes: '#c11574', homer: 'var(--team)', hater: '#475467', odds: '#087443', pod: '#7a2e98', wire: '#344054' };
  function post(r) {
    const fmt = r.format || 'social';
    // Older eras: newspaper columns, wire copy and letters; radio/TV quotes; message-board posts.
    if (fmt === 'print') return `<div class="quote print"><div class="src">${esc(r.voice.outlet)}${r.voice.handle ? ` · ${esc(r.voice.handle)}` : ''}</div><div class="tx">${esc(r.text)}</div></div>`;
    if (fmt === 'broadcast') return `<div class="quote air"><div class="src"><span class="onair">On air</span> ${esc(r.voice.outlet)}</div><div class="tx">“${esc(r.text)}”</div></div>`;
    if (fmt === 'forum') return `<div class="quote forum"><div class="src">${esc(r.voice.outlet)} · re: thread</div><div class="tx">${esc(r.text)}</div></div>`;
    const initials = r.voice.outlet.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const k = n => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1) + 'K' : n;
    return `<div class="post"><div class="av" style="--c:${VOICE_COLORS[r.voice.key] || '#444'}">${initials}</div>
      <div><div class="hd"><b>${esc(r.voice.outlet)}</b> <span>${esc(r.voice.handle)}</span></div><div class="tx">${esc(r.text)}</div>
      <div class="en"><span>${k(Math.round(r.reposts * 0.6))} replies</span><span>${k(r.reposts)} reposts</span><span>${k(r.likes)} likes</span></div></div></div>`;
  }
  function kicker(n) {
    const types = { game: 'Game recap', injury: 'Injury report', award: 'Awards', playoffs: 'Playoffs', champion: 'Champions', retire: 'Retirement', phase: 'League', rules: 'League office', transaction: 'Transactions' };
    const events = { 'game.buzzer_beater': 'Buzzer-beater', 'game.game_winner': 'Game-winner', 'game.comeback': 'Comeback', 'record.single_game': 'Record book', 'record.single_game_tie': 'Record book', 'record.minutes_sixth_overtime': 'Record book', 'court.four_point_play': 'Four-point play', 'court.five_point_play': 'Five-point play', 'court.charge_triple': 'Defense', 'court.no_field_goals_quarter': 'Defense' };
    const label = n.type === 'event' ? (events[n.key] || 'Rare feat') : (types[n.type] || n.type);
    return `${label} · ${HL.fmtDay(n.season, n.day, { year: 1 })}`;
  }
  function story(n, opts = {}) {
    const posts = (n.reactions || []).slice(0, opts.posts ?? 3);
    return `<article class="story"><div class="kicker">${kicker(n)} ${(n.teamIds || []).slice(0, 2).map(id => U.logo(L().teams[id], 16)).join('')}</div>
      <h4>${esc(n.headline)}</h4>${n.body ? `<div class="dek">${esc(n.body)}</div>` : ''}
      ${n.gid && opts.box !== false ? `<button class="btn small" style="margin-top:8px" data-box="${n.gid}">Box score</button>` : ''}
      ${posts.length ? `<div class="posts">${posts.map(post).join('')}</div>` : ''}</article>`;
  }
  function leadStory(n) {
    const hero = heroFor(n);
    return `<article class="lead-story">${hero ? `<div style="margin-bottom:12px">${hero}</div>` : ''}<div class="kicker">${kicker(n)}</div><h2>${esc(n.headline)}</h2>${n.body ? `<div class="t2">${esc(n.body)}</div>` : ''}
      ${n.gid ? `<button class="btn small" style="margin-top:8px" data-box="${n.gid}">Box score</button>` : ''}
      ${(n.reactions || []).length ? `<div class="posts">${n.reactions.slice(0, 3).map(post).join('')}</div>` : ''}</article>`;
  }

  function statsTable(rows) {
    return `<div class="tbl-wrap"><table class="tbl"><thead><tr><th class="l">Player</th><th>GP</th><th>GS</th><th>MIN</th><th>PTS</th><th>REB</th><th>AST</th><th>STL</th><th>BLK</th><th>TOV</th><th>FG%</th><th>3P%</th><th>FT%</th><th>TS%</th><th>+/-</th></tr></thead><tbody>
      ${rows.map(({ p, s }) => `<tr><td class="l">${who(p, 28)}</td><td>${s.gp}</td><td>${s.gs}</td><td>${U.fx(s.min)}</td><td class="hi">${U.fx(s.pts)}</td><td>${U.fx(s.reb)}</td><td>${U.fx(s.ast)}</td><td>${U.fx(s.stl)}</td><td>${U.fx(s.blk)}</td><td>${U.fx(s.tov)}</td><td>${U.pct(s.fgp)}</td><td>${U.pct(s.tpp)}</td><td>${U.pct(s.ftp)}</td><td>${U.pct(s.ts)}</td><td class="${s.pm >= 0 ? 'win' : 'loss'}">${s.pm >= 0 ? '+' : ''}${U.fx(s.pm)}</td></tr>`).join('')}
    </tbody></table></div>`;
  }

  function winProb(tid, oid, home) {
    const a = HL.News.teamStrength(L(), tid), b = HL.News.teamStrength(L(), oid);
    const d = (a - b) / 10 + (home ? 1 : -1);
    return Math.round(100 / (1 + Math.exp(-d / 2.2)));
  }
  const maxGP = () => Math.max(1, ...L().teams.map(t => t.w + t.l));

  // ---------------- PAGES ----------------
  const PAGES = {
    overview() {
      const t = me(), Lg = L();
      const players = HL.League.teamPlayers(t.id).sort((a, b) => b.ovr - a.ovr);
      const ng = Lg.schedule.find(g => !g.res && (g.home === t.id || g.away === t.id));
      const recent = Lg.schedule.filter(g => g.res && (g.home === t.id || g.away === t.id)).slice(-6).reverse();
      const conf = HL.League.standings(t.conf);
      const news = Lg.news.slice().reverse().filter(n => n.importance >= 2 || (n.teamIds || []).includes(t.id)).slice(0, 7);
      const champ = Lg.phase === 'offseason' && Lg.history.length ? Lg.history[Lg.history.length - 1] : null;
      const rows = players.map(p => ({ p, s: HL.League.perGame(p, Lg.season) })).filter(x => x.s);
      const lead = k => rows.slice().sort((a, b) => b.s[k] - a.s[k])[0];
      let nextHtml;
      if (ng) {
        const A = Lg.teams[ng.away], H = Lg.teams[ng.home];
        const wp = winProb(t.id, ng.home === t.id ? ng.away : ng.home, ng.home === t.id);
        nextHtml = `<div class="bug">
          <div class="tm away" style="--c:${U.teamAccent(A).c}">${U.logo(A, 44)}<div><div class="abbr">${esc(A.abbr)}</div><div class="rec">${A.w}-${A.l}</div></div></div>
          <div class="mid"><b>${HL.fmtDay(Lg.season, ng.day, { weekday: 1 })}</b><span>${esc(H.arena)}</span></div>
          <div class="tm home" style="--c:${U.teamAccent(H).c}">${U.logo(H, 44)}<div><div class="abbr">${esc(H.abbr)}</div><div class="rec">${H.w}-${H.l}</div></div></div>
        </div>
        <div class="row sm" style="margin-top:10px"><span class="t2">Win probability</span><div class="grow" style="height:4px;background:var(--surface-3)"><div style="height:100%;width:${wp}%;background:var(--team)"></div></div><span class="num" style="font-size:17px">${wp}%</span></div>`;
      } else {
        nextHtml = `<div class="empty">${Lg.phase === 'regular' ? 'Regular season complete.' : Lg.phase === 'offseason' ? 'Offseason. Start the next season from the top bar.' : 'Playoff schedule is on the Playoffs page.'}</div>`;
      }
      return `
      ${champ ? HL.GFX.championPoster(Lg.teams[champ.champion], topStars(champ.champion), champ.season + 1, { wide: true, sub: `Beat the ${Lg.teams[champ.runnerUp].name} ${champ.finalsScore}${champ.fmvp != null ? ` · Finals MVP ${Lg.players[champ.fmvp].name}` : ''}` }) : ''}
      ${(() => {
        if (Lg.phase !== 'playoffs' || !Lg.playoffs) return '';
        const round = Lg.playoffs.rounds[Lg.playoffs.rounds.length - 1] || [];
        const mine = round.find(x => x.hi === t.id || x.lo === t.id);
        const fin = round.find(x => x.conf === 'Finals');
        const s = mine || fin;
        return s ? seriesPoster(s) : '';
      })()}
      ${teamBand(t)}
      <div class="cols c-main">
        <div class="stack" style="gap:16px">
          <div class="cols c2">
            <section class="block"><header><h3>Next game</h3></header><div class="body">${nextHtml}</div></section>
            <section class="block"><header><h3>Recent results</h3><button class="more" data-goto="team/schedule">Schedule</button></header><div class="body flush">${recent.length ? recent.map(g => resultRow(g, t.id)).join('') : '<div class="empty">No games played yet.</div>'}</div></section>
          </div>
          <section class="block"><header><h3>Around the league</h3><button class="more" data-goto="home/news">All news</button></header>
            <div class="body flush">${news.length ? leadStory(news[0]) + news.slice(1).map(n => story(n, { posts: 1, box: false })).join('') : '<div class="empty">Quiet so far. Sim some games.</div>'}</div></section>
        </div>
        <div class="stack" style="gap:16px">
          <section class="block"><header><h3>${t.conf}</h3><button class="more" data-goto="league/standings">Standings</button></header><div class="body flush"><div class="tbl-wrap"><table class="tbl"><thead><tr><th class="l">#</th><th class="l">Team</th><th>W</th><th>L</th><th>GB</th></tr></thead><tbody>
            ${conf.slice(0, 10).map((x, i) => `<tr class="${x.id === t.id ? 'mine' : ''} ${i === 5 || i === 9 ? 'line' : ''}"><td class="rk">${i + 1}</td><td class="l">${teamLink(x)}</td><td>${x.w}</td><td>${x.l}</td><td class="t3">${i ? HL.League.gamesBack(x, conf[0]).toFixed(1) : '—'}</td></tr>`).join('')}
          </tbody></table></div></div></section>
          <section class="block"><header><h3>Team leaders</h3></header><div class="body">
            ${rows.length ? [['pts', 'Points'], ['reb', 'Rebounds'], ['ast', 'Assists']].map(([k, label]) => { const x = lead(k); return `<div class="row" style="padding:6px 0">${who(x.p, 36, label)}<span class="num ml-auto" style="font-size:26px">${x.s[k].toFixed(1)}</span></div>`; }).join('') : '<div class="t3 sm">Leaders appear after the first game.</div>'}
          </div></section>
          <section class="block"><header><h3>Injury report</h3></header><div class="body">
            ${players.filter(p => p.injury && p.injury.games > 0).map(p => `<div class="row" style="padding:5px 0">${who(p, 28, `${p.injury.name}`)}<span class="tag hurt ml-auto">Out ${p.injury.games}g</span></div>`).join('') || '<div class="t3 sm">No injuries.</div>'}
          </div></section>
        </div>
      </div>`;
    },

    news() {
      const Lg = L(), t = me();
      const filter = pageState.filter || 'all';
      let items = Lg.news.slice().reverse();
      if (filter === 'mine') items = items.filter(n => (n.teamIds || []).includes(t.id));
      if (filter === 'top') items = items.filter(n => n.importance >= 2);
      return `<div class="page-title"><h2>News</h2><div class="ml-auto">${U.seg('filter', [['all', 'All'], ['top', 'Top stories'], ['mine', esc(t.name)]], filter)}</div></div>
        <section class="block" style="max-width:860px">${items.length ? leadStory(items[0]) + items.slice(1, 80).map(n => story(n)).join('') : '<div class="empty">No news yet. Sim some games.</div>'}</section>`;
    },

    roster() {
      const t = pageState.team != null ? L().teams[pageState.team] : me();
      const players = HL.League.teamPlayers(t.id).sort((a, b) => b.ovr - a.ovr);
      return `${t.id === me().id ? teamBand(t) : `<div class="page-title"><h2>${esc(t.city)} ${esc(t.name)}</h2></div>`}
        <section class="block"><header><h3>Roster</h3><span class="t3 sm">${players.length} players</span>
          <select class="ml-auto" data-team-select>${L().teams.map(x => `<option value="${x.id}" ${x.id === t.id ? 'selected' : ''}>${esc(x.city)} ${esc(x.name)}</option>`).join('')}</select></header>
        <div class="body flush"><div class="tbl-wrap"><table class="tbl"><thead><tr><th class="l">Player</th><th>Pos</th><th>Age</th><th>Ht</th><th>OVR</th><th>Pot</th><th class="l">Style</th><th>Salary</th><th>Thru</th><th>PTS</th><th>REB</th><th>AST</th><th class="l">Status</th></tr></thead><tbody>
        ${players.map(p => {
          const s = HL.League.perGame(p, L().season);
          return `<tr><td class="l">${who(p, 32, false)}</td><td>${p.pos}</td><td>${p.age}</td><td>${HL.fmtHeight(p.height)}</td><td>${U.rating(p.ovr)}</td><td class="t3">${p.potential}</td><td class="l t2 sm">${esc(HL.archetypeName(p))}</td>
            <td>${U.money(p.contract.amount)}</td><td class="t3">${String(p.contract.exp + 1).slice(2)}</td><td>${s ? U.fx(s.pts) : '–'}</td><td>${s ? U.fx(s.reb) : '–'}</td><td>${s ? U.fx(s.ast) : '–'}</td><td class="l">${hurt(p) || (p.hardship ? '<span class="tag new">Hardship</span>' : '')}</td></tr>`;
        }).join('')}</tbody></table></div></div></section>`;
    },

    rotation() {
      const t = me();
      const s = Object.assign(HL.DEFAULT_STRATEGY(), t.strategy);
      const players = HL.League.teamPlayers(t.id).sort((a, b) => b.ovr - a.ovr);
      const avail = players.filter(p => !p.injury || p.injury.games <= 0);
      const chosen = s.starters ? s.starters.map(id => L().players[id]).filter(p => p && avail.includes(p)) : null;
      const st = chosen && chosen.length === 5 ? chosen : HL.autoStarters(avail);
      const mins = s.minutes || HL.autoMinutes(avail, st, 240);
      const total = avail.reduce((a, p) => a + (mins[p.id] || 0), 0);
      const paceLabel = s.pace < 35 ? 'Grind it out' : s.pace > 65 ? 'Run and gun' : 'Balanced';
      return `<div class="page-title"><h2>Rotation & Game Plan</h2><span class="t2">Applies from the next game.</span></div>
      <div class="cols c2">
        <section class="block"><header><h3>Game plan</h3></header><div class="body">
          <div class="setting"><div class="grow"><b>Pace</b><div class="d">${paceLabel}. More possessions means more variance.</div></div><input type="range" min="0" max="100" value="${s.pace}" data-strat="pace" style="width:180px"></div>
          <div class="setting" style="flex-wrap:wrap"><div class="grow"><b>Offensive focus</b><div class="d">Who and where you attack.</div></div>${U.seg('focus', [['balanced', 'Balanced'], ['inside', 'Inside'], ['perimeter', 'Threes'], ['star', 'Star'], ['motion', 'Motion']], s.focus)}</div>
          <div class="setting" style="flex-wrap:wrap"><div class="grow"><b>Defensive scheme</b><div class="d">Zone gives up threes but protects the rim. Press forces turnovers but gives up layups.</div></div>${U.seg('defense', [['man', 'Man'], ['switch', 'Switch'], ['drop', 'Drop'], ['zone', 'Zone'], ['press', 'Press']], s.defense)}</div>
          <div class="setting"><div class="grow"><b>Crash the glass</b><div class="d">More offensive rebounds, fewer fast breaks.</div></div><input type="range" min="0" max="100" value="${s.crash}" data-strat="crash" style="width:180px"></div>
        </div></section>
        <section class="block"><header><h3>Starting five</h3><button class="more" data-auto-starters>Reset to best</button></header><div class="body">
          ${[0, 1, 2, 3, 4].map(i => `<div class="setting"><span class="caps" style="width:28px">${HL.POSITIONS[i]}</span>
            <select class="grow" data-starter="${i}">${avail.map(p => `<option value="${p.id}" ${st[i] && st[i].id === p.id ? 'selected' : ''}>${esc(p.name)} · ${p.pos} · ${p.ovr}</option>`).join('')}</select></div>`).join('')}
        </div></section>
      </div>
      <section class="block"><header><h3>Minutes</h3><span class="tag ${Math.abs(total - 240) < 1 ? '' : 'hurt'}">${Math.round(total)} / 240</span><button class="more" data-auto-min>Auto minutes</button></header>
        <div class="body flush"><div class="tbl-wrap"><table class="tbl"><thead><tr><th class="l">Player</th><th>OVR</th><th>Stamina</th><th class="l" style="width:46%">Target</th><th>Min</th></tr></thead><tbody>
          ${players.map(p => {
            const inj = p.injury && p.injury.games > 0;
            const v = inj ? 0 : Math.round(mins[p.id] || 0);
            return `<tr><td class="l"><div class="row">${who(p, 28)}${hurt(p)}</div></td><td>${U.rating(p.ovr)}</td><td>${p.attrs.stam}</td>
            <td class="l"><input type="range" min="0" max="48" value="${v}" data-min="${p.id}" ${inj ? 'disabled' : ''}></td><td class="num" style="font-size:17px" data-minv="${p.id}">${v}</td></tr>`;
          }).join('')}
        </tbody></table></div><div class="t3 sm" style="padding:10px 14px">Minutes are scaled to 240 at tip-off. Tired players lose effectiveness and get hurt more often.</div></div>
      </section>`;
    },

    schedule() {
      const t = me();
      const games = L().schedule.filter(g => g.home === t.id || g.away === t.id);
      const played = games.filter(g => g.res), upcoming = games.filter(g => !g.res);
      return `<div class="page-title"><h2>Schedule</h2><span class="t2">${played.length} played · ${upcoming.length} remaining</span></div>
        <div class="cols c2">
          <section class="block"><header><h3>Results</h3></header><div class="body flush">${played.slice().reverse().map(g => resultRow(g, t.id)).join('') || '<div class="empty">No games yet.</div>'}</div></section>
          <section class="block"><header><h3>Upcoming</h3></header><div class="body flush">${upcoming.map(g => resultRow(g, t.id)).join('') || '<div class="empty">Regular season complete.</div>'}</div></section>
        </div>`;
    },

    stats() {
      const t = me(), Lg = L();
      const rows = HL.League.teamPlayers(t.id).map(p => ({ p, s: HL.League.perGame(p, Lg.season) })).filter(x => x.s).sort((a, b) => b.s.pts - a.s.pts);
      const po = HL.League.teamPlayers(t.id).map(p => ({ p, s: HL.League.perGame(p, Lg.season, true) })).filter(x => x.s).sort((a, b) => b.s.pts - a.s.pts);
      return `<div class="page-title"><h2>Player Stats</h2><span class="t2">${seasonLabel(Lg.season)} · per game</span></div>
        <section class="block"><header><h3>Regular season</h3></header><div class="body flush">${rows.length ? statsTable(rows) : '<div class="empty">Play some games first.</div>'}</div></section>
        ${po.length ? `<section class="block"><header><h3>Playoffs</h3></header><div class="body flush">${statsTable(po)}</div></section>` : ''}`;
    },

    standings() {
      const fmt = HL.playoffFormat(L().season);
      return `<div class="page-title"><h2>Standings</h2><span class="t2">${fmt.playIn ? '1-6 clinch a playoff spot · 7-10 play-in' : `Top ${fmt.perConf} per ${L().season < 1970 ? 'division' : 'conference'} make the playoffs`}</span></div><div class="cols c2">${HL.League.conferences().map(conf => {
        const st = HL.League.standings(conf);
        return `<section class="block"><header><h3>${conf}ern ${L().season < 1970 ? 'Division' : 'Conference'}</h3></header><div class="body flush"><div class="tbl-wrap"><table class="tbl"><thead><tr><th class="l">#</th><th class="l">Team</th><th>W</th><th>L</th><th>Pct</th><th>GB</th><th>Home</th><th>Away</th><th>L10</th><th>Strk</th><th>Net</th></tr></thead><tbody>
          ${st.map((t, i) => { const gp = t.w + t.l, net = gp ? (t.pf - t.pa) / gp : 0; return `<tr class="${t.id === L().userTeamId ? 'mine' : ''} ${(fmt.playIn ? (i === 5 || i === 9) : i === fmt.perConf - 1) ? 'line' : ''}"><td class="rk">${i + 1}</td>
            <td class="l">${teamLink(t)}</td><td>${t.w}</td><td>${t.l}</td><td>${(t.w / Math.max(1, gp)).toFixed(3).replace(/^0/, '')}</td><td class="t3">${i ? HL.League.gamesBack(t, st[0]).toFixed(1) : '—'}</td>
            <td>${t.homeW}-${t.homeL}</td><td>${t.awayW}-${t.awayL}</td><td>${t.last10.filter(x => x).length}-${t.last10.filter(x => !x).length}</td>
            <td class="${t.streak > 0 ? 'win' : t.streak < 0 ? 'loss' : ''}">${t.streak > 0 ? 'W' + t.streak : t.streak < 0 ? 'L' + (-t.streak) : '–'}</td>
            <td class="${net >= 0 ? 'win' : 'loss'}">${net > 0 ? '+' : ''}${net.toFixed(1)}</td></tr>`; }).join('')}
          </tbody></table></div></div></section>`;
      }).join('')}</div>`;
    },

    leaders() {
      const Lg = L();
      const rows = Object.values(Lg.players).filter(p => p.teamId != null).map(p => ({ p, s: HL.League.perGame(p, Lg.season) })).filter(x => x.s && x.s.gp >= Math.max(1, Math.floor(maxGP() * 0.5)));
      const cats = [['pts', 'Points'], ['reb', 'Rebounds'], ['ast', 'Assists'], ['stl', 'Steals'], ['blk', 'Blocks'], ['ts', 'True shooting', 1], ['tpp', '3-point %', 1], ['pm', 'Plus-minus']];
      return `<div class="page-title"><h2>League Leaders</h2><span class="t2">${seasonLabel(Lg.season)} · min. 50% of games played</span></div>
        ${rows.length ? `<div class="cols c4">${cats.map(([k, label, isPct]) => {
          let r = rows;
          if (k === 'tpp') r = r.filter(x => x.p.stats[Lg.season].tpa / x.s.gp >= 2);
          if (k === 'ts') r = r.filter(x => x.s.pts >= 10);
          const top = r.slice().sort((a, b) => b.s[k] - a.s[k]).slice(0, 8);
          return `<section class="block"><header><h3>${label}</h3></header><div class="body flush"><table class="tbl"><tbody>${top.map((x, i) => `<tr><td class="rk">${i + 1}</td><td class="l">${who(x.p, 26, L().teams[x.p.teamId].abbr)}</td><td class="hi">${isPct ? U.pct(x.s[k]) : U.fx(x.s[k])}</td></tr>`).join('')}</tbody></table></div></section>`;
        }).join('')}</div>` : '<section class="block"><div class="empty">Leaders appear after a few games.</div></section>'}`;
    },

    playoffs() {
      const Lg = L(), P = Lg.playoffs;
      const T = id => Lg.teams[id];
      const confs = HL.League.conferences();
      const fmt = HL.playoffFormat(Lg.season);
      if (!P) {
        const per = fmt.perConf, pin = fmt.playIn;
        return `<div class="page-title"><h2>Playoff picture</h2><span class="t2">If the season ended today · ${per * confs.length} teams${pin ? ' plus the play-in' : ''}${fmt.byes ? ` · top ${fmt.byes} seeds get a bye` : ''}</span></div>
          <div class="cols c2">${confs.map(c => `<section class="block"><header><h3>${c}</h3></header><div class="body flush"><table class="tbl"><tbody>${HL.League.standings(c).slice(0, pin ? 10 : per + 2).map((t, i) => `<tr class="${t.id === Lg.userTeamId ? 'mine' : ''} ${i === per - 1 || (pin && i === 5) ? 'line' : ''}"><td class="rk">${i + 1}</td><td class="l">${teamLink(t)}</td><td>${t.w}-${t.l}</td><td class="t3 l">${pin ? (i < 6 ? 'Playoffs' : 'Play-in') : i < per ? (fmt.byes && i < fmt.byes ? 'Bye' : 'Playoffs') : 'Out'}</td></tr>`).join('')}</tbody></table></div></section>`).join('')}</div>`;
      }
      const seriesBox = s => `<div class="series">${[[s.hi, s.wins[0], s.hiSeed], [s.lo, s.wins[1], s.loSeed]].map(([id, w, seed]) => `<div class="s ${s.winner != null ? (s.winner === id ? 'won' : 'out') : ''}">${U.logo(T(id), 18)}${seed ? `<span class="t3">${seed}</span>` : ''}<span>${esc(T(id).abbr)}</span><span class="w">${w}</span></div>`).join('')}</div>`;
      const rounds = P.rounds;
      const confRounds = rounds.map(r => r.filter(x => x.conf !== 'Finals')).filter(r => r.length);
      const finals = rounds.flat().filter(x => x.conf === 'Finals');
      const roundTitle = (i, n) => i === n - 1 ? (Lg.season < 1970 ? 'Division finals' : 'Conference finals') : i === n - 2 ? 'Semifinals' : 'First round';
      const nConfRounds = Math.ceil(Math.log2(Math.max(2, fmt.perConf)));
      const pinBlock = c => {
        if (!P.playin) return '';
        const pi = P.playin[c];
        return `<section class="block"><header><h3>${c} play-in</h3></header><div class="body flush"><table class="tbl"><tbody>${pi.games.map((g, i) => g.a != null ? `<tr><td class="l t3">${['7 vs 8', '9 vs 10', 'For the 8 seed'][i]}</td><td class="l">${teamLink(T(g.a), 18)}</td><td class="l">${teamLink(T(g.b), 18)}</td><td class="l">${g.winner != null ? `<b>${esc(T(g.winner).abbr)}</b> wins` : '—'}</td></tr>` : '').join('')}</tbody></table></div></section>`;
      };
      return `<div class="page-title"><h2>${Lg.season + 1} Playoffs</h2><span class="t2">${fmt.bestOf.map((b, i) => `${i === fmt.bestOf.length - 1 ? 'Finals' : 'R' + (i + 1)}: best of ${b}`).join(' · ')}</span></div>
        ${P.champion != null ? `<section class="block"><div class="body row" style="gap:16px">${U.logo(T(P.champion), 64)}<div><div class="caps">NBA Champions</div><h2 style="font-size:34px;margin-top:4px">${esc(T(P.champion).city)} ${esc(T(P.champion).name)}</h2></div></div></section>` : ''}
        ${finals.length ? seriesPoster(finals[0]) : ''}
        <div class="cols c2">${confs.map(c => `<section class="block"><header><h3>${c}</h3></header><div class="body"><div class="row" style="align-items:flex-start;gap:12px;overflow-x:auto">
          ${Array.from({ length: nConfRounds }, (_, i) => { const r = confRounds[i] ? confRounds[i].filter(x => x.conf === c) : []; return `<div class="stack" style="gap:8px;min-width:130px"><div class="caps">${roundTitle(i, nConfRounds)}</div>${r.length ? r.map(seriesBox).join('') : '<div class="series"><div class="s t3">TBD</div></div>'}</div>`; }).join('')}
          ${P.byes && P.byes[c] && P.byes[c].length ? `<div class="stack" style="gap:6px;min-width:120px"><div class="caps">Byes</div>${P.byes[c].map(id => `<div class="row sm">${U.logo(T(id), 18)} ${esc(T(id).abbr)}</div>`).join('')}</div>` : ''}
        </div></div></section>`).join('')}</div>
        ${P.playin ? `<div class="cols c2">${confs.map(pinBlock).join('')}</div>` : ''}`;
    },

    players() {
      const q = (pageState.q || '').toLowerCase();
      const pos = pageState.pos || 'all';
      let list = Object.values(L().players).filter(p => !p.retired && p.teamId != null);
      if (q) list = list.filter(p => p.name.toLowerCase().includes(q));
      if (pos !== 'all') list = list.filter(p => p.pos === pos);
      list.sort((a, b) => b.ovr - a.ovr);
      return `<div class="page-title"><h2>Players</h2><input type="text" placeholder="Search by name" value="${esc(pageState.q || '')}" data-q style="min-width:240px">${U.seg('pos', [['all', 'All'], ...HL.POSITIONS.map(p => [p, p])], pos)}</div>
        <section class="block"><div class="body flush"><div class="tbl-wrap"><table class="tbl"><thead><tr><th class="l">#</th><th class="l">Player</th><th class="l">Team</th><th>Pos</th><th>Age</th><th>OVR</th><th>Pot</th><th class="l">Style</th><th>Salary</th></tr></thead><tbody>
        ${list.slice(0, 200).map((p, i) => `<tr><td class="rk">${i + 1}</td><td class="l">${who(p, 28, false)}</td><td class="l">${teamLink(L().teams[p.teamId], 20)}</td><td>${p.pos}</td><td>${p.age}</td>
          <td>${U.rating(p.ovr)}</td><td class="t3">${p.potential}</td><td class="l t2 sm">${esc(HL.archetypeName(p))}</td><td>${U.money(p.contract.amount)}</td></tr>`).join('')}
        </tbody></table></div></div></section>`;
    },

    history() {
      const Lg = L();
      const pn = id => id != null ? `<span class="who" data-player="${id}" style="display:inline-flex"><span class="nm">${esc(Lg.players[id].name)}</span></span>` : '—';
      const cur = Lg.awards[Lg.season] && !Lg.history.find(h => h.season === Lg.season) ? Lg.awards[Lg.season] : null;
      // League single-game record book: the real records standing when the save began, and any broken since.
      const book = HL.Events ? HL.Events.recordBook(Lg).league : {};
      const recRows = Object.entries(book).filter(([, r]) => r && r.known).map(([k, r]) => {
        const inSave = r.pid != null;
        const who = inSave && Lg.players[r.pid] ? pn(r.pid) : esc(r.name);
        const prior = (r.history || []).slice(-1)[0];
        const label = HL.Events.STAT_LABEL[k];
        const possName = n => n.endsWith('s') ? n + "'" : n + "'s";
        return `<tr><td class="l">${esc(label[0].toUpperCase() + label.slice(1))}</td><td class="hi">${r.v}</td><td class="l">${who}</td><td class="l t2">${esc(r.team || '')}</td><td class="l t3">${inSave ? `${seasonLabel(r.season)}${prior ? ` · broke ${esc(possName(prior.name))} ${prior.v}` : ''}` : esc(r.when || seasonLabel(r.season))}</td></tr>`;
      }).join('');
      const recordBlock = recRows ? `<section class="block"><header><h3>League record book</h3><span class="ml-auto t3 sm">Single game, regular season</span></header><div class="body flush"><div class="tbl-wrap"><table class="tbl"><thead><tr><th class="l">Record</th><th></th><th class="l">Holder</th><th class="l">Team</th><th class="l">Set</th></tr></thead><tbody>${recRows}</tbody></table></div></div></section>` : '';
      if (!Lg.history.length && !cur) return `<div class="page-title"><h2>History</h2></div>${recordBlock}<section class="block"><div class="empty">Your league's champions and awards appear here after the first season.</div></section>`;
      return `<div class="page-title"><h2>History</h2></div>${recordBlock}
        ${cur ? `<section class="block"><header><h3>${seasonLabel(Lg.season)} awards</h3></header><div class="body"><div class="cols c3">
          ${[['MVP', cur.mvp], ['Defensive Player', cur.dpoy], ['Rookie of the Year', cur.roy], ['Sixth Man', cur.smoy], ['Scoring title', cur.scoringChamp]].map(([k, id]) => `<div class="kv"><span>${k}</span><b>${pn(id)}</b></div>`).join('')}
          </div>${cur.allNba.map((tm, i) => `<div class="kv"><span>All-NBA ${['1st', '2nd', '3rd'][i]}</span><span>${tm.map(pn).join(', ')}</span></div>`).join('')}</div></section>` : ''}
        ${Lg.history.length ? `<section class="block"><header><h3>Champions</h3></header><div class="body flush"><div class="tbl-wrap"><table class="tbl"><thead><tr><th class="l">Season</th><th class="l">Champion</th><th class="l">Runner-up</th><th>Series</th><th class="l">MVP</th><th class="l">Finals MVP</th><th class="l">DPOY</th><th class="l">ROY</th></tr></thead><tbody>
        ${Lg.history.slice().reverse().map(h => `<tr><td class="l">${seasonLabel(h.season)}</td><td class="l">${teamLink(Lg.teams[h.champion])}</td><td class="l t2">${esc(Lg.teams[h.runnerUp].name)}</td><td>${h.finalsScore}</td>
          <td class="l">${pn(h.mvp)}</td><td class="l">${pn(h.fmvp)}</td><td class="l">${pn(h.dpoy)}</td><td class="l">${pn(h.roy)}</td></tr>`).join('')}
        </tbody></table></div></div></section>` : ''}`;
    },

    rules() {
      const r = L().rules;
      const tog = (k, label, desc) => `<div class="setting"><div class="grow"><b>${label}</b><div class="d">${desc}</div></div><label class="switch"><input type="checkbox" data-rule="${k}" ${r[k] ? 'checked' : ''}><span></span></label></div>`;
      const num = (k, label, desc, min, max, step = 1) => `<div class="setting"><div class="grow"><b>${label}</b><div class="d">${desc}</div></div><input type="number" min="${min}" max="${max}" step="${step}" value="${r[k]}" data-rule-num="${k}" style="width:84px"></div>`;
      return `<div class="page-title"><h2>Rulebook</h2><span class="t2">Every change affects the sim, and the league reacts. Changing rules mid-season is more controversial.</span></div>
      <div class="cols c2">
        <section class="block"><header><h3>Court & scoring</h3></header><div class="body">
          ${tog('threePoint', 'Three-point line', 'Remove it and spacing disappears.')}
          ${tog('fourPoint', 'Four-point line', 'A deep zone worth four points.')}
          ${num('threeValue', 'Value of a three', 'Points awarded beyond the arc.', 2, 5)}
        </div></section>
        <section class="block"><header><h3>Clock</h3></header><div class="body">
          ${num('quarterLen', 'Quarter length', 'Minutes. NBA 12, FIBA 10.', 4, 20)}
          ${num('otLen', 'Overtime length', 'Minutes. NBA 5.', 1, 12)}
          ${num('shotClock', 'Shot clock', 'Seconds. Shorter means faster pace.', 10, 35)}
        </div></section>
        <section class="block"><header><h3>Contact & fouls</h3></header><div class="body">
          ${tog('handCheck', 'Hand-checking', '1990s-style perimeter defense.')}
          ${tog('tackling', 'Tackling', 'Injuries skyrocket. The players\' union will not be happy.')}
          ${tog('noFouls', 'No fouls called', 'No free throws. Anything goes.')}
          ${num('foulOut', 'Foul-out limit', 'Personal fouls before disqualification. 0 = never.', 0, 12)}
        </div></section>
        <section class="block"><header><h3>Health</h3></header><div class="body">
          ${num('injuryMult', 'Injury frequency', '1 = realistic, 0 = none.', 0, 5, 0.1)}
          <div class="t3 sm" style="padding-top:10px">More rule groups are coming: roster size, 3-on-3, season length, CBA, lottery, relegation and more.</div>
        </div></section>
      </div>`;
    },

    settings() {
      const s = L().settings;
      return `<div class="page-title"><h2>Settings</h2></div><div class="cols c2">
        <section class="block"><header><h3>Game</h3></header><div class="body">
          <div class="setting" style="flex-wrap:wrap"><div class="grow"><b>Difficulty</b><div class="d">Affects player progression and AI decisions.</div></div>${U.seg('difficulty', [['rookie', 'Rookie'], ['pro', 'Pro'], ['allstar', 'All-Star'], ['hof', 'HOF']], s.difficulty)}</div>
          <div class="setting" style="flex-wrap:wrap"><div class="grow"><b>Depth</b><div class="d">Simple automates details. Detailed gives you everything.</div></div>${U.seg('depth', [['simple', 'Simple'], ['detailed', 'Detailed']], s.depth)}</div>
          <div class="setting" style="flex-wrap:wrap"><div class="grow"><b>Era presentation</b><div class="d">Auto follows the season being played. The others are previews.</div></div>${U.seg('eraTheme', [['auto', 'Auto'], ['60s', '60s'], ['70s', '70s'], ['80s', '80s'], ['90s', '90s'], ['00s', '00s'], ['modern', 'Modern']], s.eraTheme || 'auto')}</div>
        </div></section>
        <section class="block"><header><h3>Saves</h3></header><div class="body">
          <div class="setting"><div class="grow"><b>Save now</b><div class="d">The game also autosaves after every sim.</div></div><button class="btn" data-save>${U.icon('save')} Save</button></div>
          <div class="setting"><div class="grow"><b>Export</b><div class="d">Download a backup file you can import later.</div></div><button class="btn" data-export>${U.icon('download')} Export</button></div>
        </div></section>
      </div>`;
    },

    soon() {
      const titles = { trades: 'Trades', freeagency: 'Free Agency', draft: 'Draft & Scouting', finances: 'Finances', staff: 'Staff' };
      return `<div class="page-title"><h2>${titles[page] || 'Coming soon'}</h2></div><section class="block"><div class="empty">This front-office tool is coming in the next milestone. Until then the league handles it automatically each offseason (draft, re-signings and free agency).</div></section>`;
    },
  };
  for (const k of ['trades', 'freeagency', 'draft', 'finances', 'staff']) PAGES[k] = PAGES.soon;

  function renderPage() {
    const el = document.getElementById('page');
    el.innerHTML = (PAGES[page] || PAGES.soon)();
    bindCommon(el);
    if (BIND[page]) BIND[page](el);
  }

  // ---------------- page bindings ----------------
  const BIND = {
    news(el) { el.querySelectorAll('[data-seg] button').forEach(b => b.onclick = () => { pageState.filter = b.dataset.v; renderPage(); }); },
    roster(el) { el.querySelector('[data-team-select]').onchange = (e) => { pageState.team = +e.target.value; renderPage(); }; },
    players(el) {
      const q = el.querySelector('[data-q]');
      q.oninput = () => { pageState.q = q.value; renderPage(); const n = document.querySelector('[data-q]'); n.focus(); n.setSelectionRange(n.value.length, n.value.length); };
      el.querySelectorAll('[data-seg] button').forEach(b => b.onclick = () => { pageState.pos = b.dataset.v; renderPage(); });
    },
    rotation(el) {
      const t = me();
      t.strategy = Object.assign(HL.DEFAULT_STRATEGY(), t.strategy);
      el.querySelectorAll('[data-strat]').forEach(r => r.onchange = () => { t.strategy[r.dataset.strat] = +r.value; renderPage(); });
      el.querySelectorAll('[data-seg]').forEach(sg => sg.querySelectorAll('button').forEach(b => b.onclick = () => { t.strategy[sg.dataset.seg] = b.dataset.v; renderPage(); }));
      el.querySelectorAll('[data-starter]').forEach(sel => sel.onchange = () => {
        const ids = [...el.querySelectorAll('[data-starter]')].map(s => +s.value);
        if (new Set(ids).size < 5) { U.toast('A player can only start at one position.'); return renderPage(); }
        t.strategy.starters = ids;
        renderPage();
      });
      el.querySelector('[data-auto-starters]').onclick = () => { t.strategy.starters = null; renderPage(); };
      el.querySelector('[data-auto-min]').onclick = () => { t.strategy.minutes = null; renderPage(); };
      el.querySelectorAll('[data-min]').forEach(r => {
        r.oninput = () => { el.querySelector(`[data-minv="${r.dataset.min}"]`).textContent = r.value; };
        r.onchange = () => {
          if (!t.strategy.minutes) {
            const players = HL.League.teamPlayers(t.id).filter(p => !p.injury || p.injury.games <= 0);
            t.strategy.minutes = HL.autoMinutes(players, HL.autoStarters(players), 240);
          }
          t.strategy.minutes[r.dataset.min] = +r.value;
          renderPage();
        };
      });
    },
    rules(el) {
      const r = L().rules;
      el.querySelectorAll('[data-rule]').forEach(cb => cb.onchange = () => { r[cb.dataset.rule] = cb.checked; ruleChanged(cb.dataset.rule, cb.checked, !cb.checked); });
      el.querySelectorAll('[data-rule-num]').forEach(inp => inp.onchange = () => {
        const v = Math.max(+inp.min, Math.min(+inp.max, +inp.value));
        const old = r[inp.dataset.ruleNum];
        r[inp.dataset.ruleNum] = v;
        if (old !== v) ruleChanged(inp.dataset.ruleNum, v, old);
      });
    },
    settings(el) {
      el.querySelectorAll('[data-seg]').forEach(sg => sg.querySelectorAll('button').forEach(b => b.onclick = () => {
        L().settings[sg.dataset.seg] = b.dataset.v;
        if (sg.dataset.seg === 'eraTheme') open(); else renderPage();
        autosave();
      }));
      el.querySelector('[data-save]').onclick = async () => { await autosave(); U.toast('Game saved.'); };
      el.querySelector('[data-export]').onclick = () => HL.Saves.exportFile(L());
    },
  };

  function ruleChanged(key, val, old) {
    const n = HL.RuleReactions ? HL.RuleReactions.react(L(), key, val, old) : null;
    if (n) U.toast(`<b>League office:</b> ${esc(n.headline)}`, 4200);
    autosave();
  }

  // ---------------- SHEETS ----------------
  function playerSheet(pid) {
    const Lg = L(), p = Lg.players[pid];
    if (!p) return;
    const t = p.teamId != null ? Lg.teams[p.teamId] : null;
    const acc = t ? U.teamAccent(t) : { c: '#2a2d33' };
    const groups = {};
    for (const a of HL.ATTRS) (groups[a.group] = groups[a.group] || []).push(a);
    const seasons = Object.keys(p.stats).filter(k => !k.endsWith('p')).sort();
    const awards = p.careerAwards.reduce((m, a) => { m[a.award] = (m[a.award] || 0) + 1; return m; }, {});
    const meter = (label, v) => `<div class="meter"><span class="lbl">${label}</span><span class="val">${v}</span><div class="track"><i class="${v >= 80 ? 'hi' : v < 55 ? 'lo' : 'mid'}" style="width:${v}%"></i></div></div>`;
    const m = U.sheet(`${t ? U.logo(t, 24) : ''}<h3>${esc(p.name)}</h3>`, `
      <div class="phead">
        <div class="shot" style="--team-c:${acc.c}">${HL.GFX.figure(p, t)}</div>
        <div class="info">
          <div class="jersey">${t ? esc(t.city + ' ' + t.name) : 'Free agent'} · ${p.pos}</div>
          <div class="pname">${esc(p.name)}</div>
          <div class="bio"><span>${HL.fmtHeight(p.height)}</span><span>${p.weight} lbs</span><span>${HL.fmtHeight(p.wingspan)} wingspan</span><span>Age ${p.age}</span><span>${U.money(p.contract.amount)} through ${p.contract.exp + 1}</span></div>
          <div class="row wrap"><span class="tag team">${esc(HL.archetypeName(p))}</span>${hurt(p)}${Object.entries(awards).map(([k, v]) => `<span class="tag">${v > 1 ? v + '× ' : ''}${esc(k)}</span>`).join('')}</div>
        </div>
        <div class="ovrcol">${U.rating(p.ovr, true)}<span class="caps">Overall</span><span class="t2 sm">Potential ${p.potential}</span></div>
      </div>
      <div class="tabs"><button class="on" data-tab="ratings">Ratings</button><button data-tab="stats">Stats</button><button data-tab="tend">Tendencies</button><button data-tab="traits">Personality</button></div>
      <div data-pane="ratings" class="cols c3">${Object.entries(groups).map(([g, attrs]) => `<section class="block"><header><h3>${g}</h3></header><div class="body stack" style="gap:10px">${attrs.map(a => meter(a.label, p.attrs[a.key])).join('')}</div></section>`).join('')}</div>
      <div data-pane="stats" class="hidden">${seasons.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th class="l">Season</th><th class="l">Team</th><th>GP</th><th>MIN</th><th>PTS</th><th>REB</th><th>AST</th><th>STL</th><th>BLK</th><th>FG%</th><th>3P%</th><th>FT%</th><th>TS%</th></tr></thead><tbody>
        ${seasons.map(sk => { const s = HL.League.perGame(p, +sk); const tm = Lg.teams[p.stats[sk].teamId]; return s ? `<tr><td class="l">${seasonLabel(+sk)}</td><td class="l">${tm ? esc(tm.abbr) : '–'}</td><td>${s.gp}</td><td>${U.fx(s.min)}</td><td class="hi">${U.fx(s.pts)}</td><td>${U.fx(s.reb)}</td><td>${U.fx(s.ast)}</td><td>${U.fx(s.stl)}</td><td>${U.fx(s.blk)}</td><td>${U.pct(s.fgp)}</td><td>${U.pct(s.tpp)}</td><td>${U.pct(s.ftp)}</td><td>${U.pct(s.ts)}</td></tr>` : ''; }).join('')}
      </tbody></table></div>` : '<div class="empty">No games played yet.</div>'}</div>
      <div data-pane="tend" class="hidden"><div class="cols c2">${Object.entries({ usage: 'Shot volume', three: 'Three-point frequency', mid: 'Mid-range frequency', drive: 'Drives to the rim', post: 'Post-ups', passFirst: 'Pass-first', gamble: 'Gambles for steals', crash: 'Crashes the glass', effort: 'Effort', foulAggr: 'Physicality' }).map(([k, label]) => meter(label, p.tend[k])).join('')}</div>
        <div class="t3 sm" style="margin-top:12px">Tendencies drive this player's decisions in the possession sim. In Player Career you set your own.</div></div>
      <div data-pane="traits" class="hidden"><div class="cols c2">${Object.entries({ workEthic: 'Work ethic', competitive: 'Competitiveness', clutch: 'Clutch', leadership: 'Leadership', loyalty: 'Loyalty', greed: 'Money motivation', ego: 'Ego', temperament: 'Temperament' }).map(([k, label]) => meter(label, p.traits[k])).join('')}</div></div>
    `);
    m.querySelectorAll('[data-tab]').forEach(tb => tb.onclick = () => {
      m.querySelectorAll('[data-tab]').forEach(x => x.classList.toggle('on', x === tb));
      m.querySelectorAll('[data-pane]').forEach(x => x.classList.toggle('hidden', x.dataset.pane !== tb.dataset.tab));
    });
  }

  function boxScore(gid) {
    const Lg = L();
    const b = Lg.boxScores[gid];
    if (!b) { U.toast('That box score is no longer stored.'); return; }
    const H = Lg.teams[b.home.teamId], A = Lg.teams[b.away.teamId];
    const hs = b.home.score, as = b.away.score;
    const side = (sd, team) => {
      const rows = Object.entries(sd.box).map(([id, l]) => ({ p: Lg.players[id], l })).sort((x, y) => (y.l.gs - x.l.gs) || (y.l.min - x.l.min));
      const tot = rows.reduce((t, { l }) => { for (const k in l) t[k] = (t[k] || 0) + l[k]; return t; }, {});
      const cells = l => `<td>${Math.round(l.min)}</td><td class="hi">${l.pts}</td><td>${l.orb + l.drb}</td><td>${l.ast}</td><td>${l.stl}</td><td>${l.blk}</td><td>${l.tov}</td><td>${l.fgm}-${l.fga}</td><td>${l.tpm}-${l.tpa}</td><td>${l.ftm}-${l.fta}</td><td>${l.pf}</td><td class="${l.pm >= 0 ? 'win' : 'loss'}">${l.pm > 0 ? '+' : ''}${l.pm}</td>`;
      return `<section class="block"><header>${U.logo(team, 24)}<h3>${esc(team.city)} ${esc(team.name)}</h3></header><div class="body flush"><div class="tbl-wrap"><table class="tbl"><thead><tr><th class="l">Player</th><th>Min</th><th>Pts</th><th>Reb</th><th>Ast</th><th>Stl</th><th>Blk</th><th>TO</th><th>FG</th><th>3P</th><th>FT</th><th>PF</th><th>+/-</th></tr></thead><tbody>
        ${rows.map(({ p, l }, i) => `<tr class="${i === 4 ? 'line' : ''}"><td class="l">${who(p, 26, l.gs ? 'Starter' : p.pos)}</td>${cells(l)}</tr>`).join('')}</tbody>
        <tfoot><tr><td class="l">Team</td><td></td><td>${tot.pts}</td><td>${tot.orb + tot.drb}</td><td>${tot.ast}</td><td>${tot.stl}</td><td>${tot.blk}</td><td>${tot.tov}</td><td>${tot.fgm}-${tot.fga}</td><td>${tot.tpm}-${tot.tpa}</td><td>${tot.ftm}-${tot.fta}</td><td>${tot.pf}</td><td></td></tr></tfoot></table></div></div></section>`;
    };
    const qLabel = i => i < 4 ? `Q${i + 1}` : `OT${i - 3 > 1 ? i - 3 : ''}`;
    const m = U.sheet('<h3>Box score</h3>', `
      <div class="bug">
        <div class="tm away" style="--c:${U.teamAccent(A).c}">${U.logo(A, 48)}<div><div class="abbr">${esc(A.abbr)}</div><div class="rec">${esc(A.name)}</div></div><div class="sc ${as < hs ? 'lost' : ''}">${as}</div></div>
        <div class="mid"><b>Final${b.ot ? (b.ot > 1 ? ' · ' + b.ot + 'OT' : ' · OT') : ''}</b><span>${esc(H.arena)}</span></div>
        <div class="tm home" style="--c:${U.teamAccent(H).c}">${U.logo(H, 48)}<div><div class="abbr">${esc(H.abbr)}</div><div class="rec">${esc(H.name)}</div></div><div class="sc ${hs < as ? 'lost' : ''}">${hs}</div></div>
      </div>
      <div class="tbl-wrap"><table class="tbl"><thead><tr><th class="l">Team</th>${b.home.quarters.map((_, i) => `<th>${qLabel(i)}</th>`).join('')}<th>Final</th></tr></thead><tbody>
        <tr><td class="l">${esc(A.abbr)}</td>${b.away.quarters.map(q => `<td>${q}</td>`).join('')}<td class="hi">${as}</td></tr>
        <tr><td class="l">${esc(H.abbr)}</td>${b.home.quarters.map(q => `<td>${q}</td>`).join('')}<td class="hi">${hs}</td></tr></tbody></table></div>
      <div class="tabs"><button class="on" data-tab="box">Box score</button>${b.pbp ? '<button data-tab="pbp">Play-by-play</button>' : ''}</div>
      <div data-pane="box" class="stack">${side(b.away, A)}${side(b.home, H)}</div>
      ${b.pbp ? `<div data-pane="pbp" class="hidden"><div class="tbl-wrap" style="max-height:62vh;overflow-y:auto"><table class="tbl"><thead><tr><th class="l">Per</th><th class="l">Clock</th><th class="l">Team</th><th class="l">Play</th><th>${esc(A.abbr)}</th><th>${esc(H.abbr)}</th></tr></thead><tbody>
        ${b.pbp.map(e => `<tr><td class="l t3">${e.q > 4 ? 'OT' + (e.q - 4) : 'Q' + e.q}</td><td class="l num">${e.t}</td><td class="l t2">${e.team ? esc(e.team) : ''}</td><td class="l" style="white-space:normal">${esc(e.txt)}</td><td>${e.as}</td><td>${e.hs}</td></tr>`).join('')}
      </tbody></table></div></div>` : ''}
    `);
    bindCommon(m);
    m.querySelectorAll('[data-tab]').forEach(tb => tb.onclick = () => {
      m.querySelectorAll('[data-tab]').forEach(x => x.classList.toggle('on', x === tb));
      m.querySelectorAll('[data-pane]').forEach(x => x.classList.toggle('hidden', x.dataset.pane !== tb.dataset.tab));
    });
  }

  return { setup, open, render, playerSheet, boxScore };
})();
