// 82-0 Challenge: spin a franchise + decade, draft one real player per position, then play
// the full 82-game season against the real 2025-26 league with the actual sim.
window.HL = window.HL || {};

HL.Challenge = (function () {
  const U = HL.UI, esc = U.esc, R = HL.RNG;
  const SLOTS = ['PG', 'SG', 'SF', 'PF', 'C'];
  const OPP_SEASON = String(HL.LATEST_SEASON);

  // Every historical club -> the modern franchise it belongs to (official lineage).
  const LINEAGE = {
    TRI: 'ATL', MLH: 'ATL', STL: 'ATL', ATL: 'ATL', BOS: 'BOS', NYN: 'BKN', NJN: 'BKN', BRK: 'BKN', CHH: 'CHA', CHA: 'CHA', CHO: 'CHA', CHI: 'CHI', CLE: 'CLE',
    DAL: 'DAL', DEN: 'DEN', FTW: 'DET', DET: 'DET', PHW: 'GSW', SFW: 'GSW', GSW: 'GSW', SDR: 'HOU', HOU: 'HOU', IND: 'IND', BUF: 'LAC', SDC: 'LAC', LAC: 'LAC',
    MNL: 'LAL', LAL: 'LAL', VAN: 'MEM', MEM: 'MEM', MIA: 'MIA', MIL: 'MIL', MIN: 'MIN', NOH: 'NOP', NOK: 'NOP', NOP: 'NOP', NYK: 'NYK', SEA: 'OKC', OKC: 'OKC',
    ORL: 'ORL', SYR: 'PHI', PHI: 'PHI', PHO: 'PHX', POR: 'POR', ROC: 'SAC', CIN: 'SAC', KCO: 'SAC', KCK: 'SAC', SAC: 'SAC', SAS: 'SAS', TOR: 'TOR', NOJ: 'UTA', UTA: 'UTA',
    CHP: 'WAS', CHZ: 'WAS', BAL: 'WAS', CAP: 'WAS', WSB: 'WAS', WAS: 'WAS',
  };
  const posOk = (posStr, slot) => posStr.split('-').some(p => p === slot || (p === 'G' && (slot === 'PG' || slot === 'SG')) || (p === 'F' && (slot === 'SF' || slot === 'PF')));

  let st = null;

  function newRun(mode, decades) {
    st = { mode, decades, used: [], slots: { PG: null, SG: null, SF: null, PF: null, C: null }, team: null, decade: null, skips: { team: 1, era: 1 }, spinning: false, result: null };
  }

  async function loadDecade(dec) {
    const keys = HL.HISTORY.seasons.filter(k => !k.includes('-') && Math.floor(+k / 10) * 10 === dec);
    await Promise.all(keys.map(k => HL.History.load(k)));
    return keys;
  }

  // Best season with this franchise in this decade, for every player (min 20 games there).
  function candidates(franchise, dec) {
    const best = new Map();
    for (const k of HL.HISTORY.seasons) {
      if (k.includes('-') || Math.floor(+k / 10) * 10 !== dec || !HL.HISTORY_SEASONS[k]) continue;
      for (const r of HL.History.seasonRows(k)) {
        const games = r.stints.filter(s => LINEAGE[s[0]] === franchise).reduce((a, s) => a + s[1], 0);
        if (games < 20) continue;
        const cur = best.get(r.pid);
        if (!cur || r.ovr > cur.row.ovr) best.set(r.pid, { row: r, season: +k, club: r.stints.find(s => LINEAGE[s[0]] === franchise)[0] });
      }
    }
    return [...best.values()].sort((a, b) => b.row.ovr - a.row.ovr);
  }

  function franchisesIn(dec) {
    const set = new Set();
    for (const k of HL.HISTORY.seasons) {
      if (k.includes('-') || Math.floor(+k / 10) * 10 !== dec || !HL.HISTORY_SEASONS[k]) continue;
      for (const t of HL.HISTORY_SEASONS[k].teams) if (LINEAGE[t[0]]) set.add(LINEAGE[t[0]]);
    }
    return [...set];
  }

  async function spin(what = 'both') {
    st.spinning = true;
    render();
    const openDecades = st.decades.filter(d => !st.used.includes(d) || st.decades.length < 5);
    if (what !== 'team') st.decade = R.pick(openDecades.filter(d => d !== st.decade || openDecades.length === 1));
    await loadDecade(st.decade);
    const fr = franchisesIn(st.decade);
    if (what !== 'era' || !fr.includes(st.team)) st.team = R.pick(fr.filter(t => t !== st.team || fr.length === 1));
    // A little slot-machine theatre.
    setTimeout(() => { st.spinning = false; render(); }, 650);
  }

  // ---------- season sim against the real latest league ----------
  async function simSeason() {
    await HL.History.load(OPP_SEASON);
    const L = HL.League.createFromSeason({ seasonKey: OPP_SEASON, seed: Date.now() % 100000 });
    const dream = { id: 999, abbr: 'YOU', city: 'Your', name: 'Five', color: '#c9a227', color2: '#111111', conf: 'East', strategy: HL.DEFAULT_STRATEGY() };
    const players = [];
    for (const slot of SLOTS) {
      const c = st.slots[slot];
      const p = HL.History.makePlayer(c.row, c.season, 999);
      p.pos = slot;
      p.realMpg = 37;
      // Era translation: before the 3-point line, good shooters convert some mid-range shots to threes.
      if (c.season < 1979 && p.attrs.three >= 55) { const move = Math.round(p.tend.mid * 0.45 * (p.attrs.three - 40) / 59); p.tend.three += move; p.tend.mid -= move; }
      p.ovr = HL.computeOvr(p.attrs, p.pos);
      players.push(p);
    }
    // Replacement-level bench.
    const archs = ['3d', 'defguard', 'rimbig', 'sniper', 'twoway', 'stretchbig', 'slasher', 'defbig'];
    for (let i = 0; i < 8; i++) {
      const pos = SLOTS[i % 5];
      const b = HL.createPlayer({ name: `${R.pick(HL.NAMES.first)} ${R.pick(HL.NAMES.last)}`, pos, age: 27, height: { PG: 75, SG: 77, SF: 79, PF: 81, C: 83 }[pos], ovr: R.int(68, 73), arch: archs[i], real: false, season: 2025, teamId: 999 });
      b.realMpg = i < 4 ? 12 : 4;
      players.push(b);
    }
    dream.players = players;
    dream.strategy.starters = players.slice(0, 5).map(p => p.id);
    const opps = L.teams;
    const rules = Object.assign({}, L.rules, { profile: L.profile });
    let w = 0, l = 0, pf = 0, pa = 0, streak = 0, best = 0;
    const lines = {};
    for (const p of players) lines[p.id] = HL.blankStatLine();
    const log = [];
    for (let g = 0; g < 82; g++) {
      const opp = opps[g % opps.length];
      const oppObj = { id: opp.id, abbr: opp.abbr, strategy: opp.strategy, players: HL.League.teamPlayers(opp.id) };
      for (const p of players) p.injury = null;
      const home = g % 2 === 0;
      const res = home ? HL.simGame(dream, oppObj, rules) : HL.simGame(oppObj, dream, rules);
      const mine = home ? res.home : res.away, theirs = home ? res.away : res.home;
      const won = mine.score > theirs.score;
      if (won) { w++; streak++; best = Math.max(best, streak); } else { l++; streak = 0; }
      pf += mine.score; pa += theirs.score;
      for (const id in mine.box) for (const k in lines[id]) lines[id][k] += mine.box[id][k] || 0;
      if (!won) log.push({ opp, score: `${mine.score}-${theirs.score}`, g: g + 1 });
    }
    st.result = { w, l, pf: pf / 82, pa: pa / 82, best, losses: log, lines, players };
    saveBest();
    render();
  }

  function saveBest() {
    try {
      const all = JSON.parse(localStorage.getItem('hl-820') || '[]');
      all.push({ w: st.result.w, l: st.result.l, at: Date.now(), mode: st.mode, five: SLOTS.map(s => `${HL.HISTORY.players[st.slots[s].row.pid][0]} (${st.slots[s].season})`) });
      all.sort((a, b) => b.w - a.w);
      localStorage.setItem('hl-820', JSON.stringify(all.slice(0, 20)));
    } catch (e) { /* storage unavailable */ }
  }
  function bestRuns() { try { return JSON.parse(localStorage.getItem('hl-820') || '[]'); } catch (e) { return []; } }

  function verdict(w) {
    if (w === 82) return ['PERFECT', '82-0. Immortal. They will never stop talking about this five.'];
    if (w >= 75) return ['ALL-TIME TEAM', 'One of the greatest teams ever assembled.'];
    if (w >= 66) return ['DYNASTY', 'Title favorites by a mile.'];
    if (w >= 55) return ['CONTENDER', 'Real contender, but not a juggernaut.'];
    if (w >= 42) return ['PLAYOFF TEAM', 'Good, not great. The fit matters.'];
    return ['LOTTERY', 'History will not be kind to this five.'];
  }

  // ---------- UI ----------
  function teamMeta(fr) { return HL.TEAMS.find(t => t.abbr === fr); }
  const decLabel = d => `${d}s`;

  function render() {
    const app = U.app();
    if (!st) return setupScreen();
    U.applyTeamTheme(st.team ? teamMeta(st.team) : null);
    const filled = SLOTS.filter(s => st.slots[s]).length;
    const done = filled === 5;
    const hide = st.mode === 'hoopiq';
    let body = '';
    if (st.result) body = resultView();
    else if (done) body = `<section class="block"><div class="body row wrap" style="gap:14px"><div class="grow"><h3>Your five is set</h3><div class="t2 sm" style="margin-top:4px">They'll play all 82 games against the real ${OPP_SEASON}-${String(+OPP_SEASON + 1).slice(2)} league with the full possession sim.</div></div><button class="btn go big" data-sim>Play the season</button></div></section>`;
    else body = draftView(hide);
    app.innerHTML = `
    <div class="frame">
      <div class="masthead"><div class="bar">
        <div class="wordmark" data-home>Hoops<i>Life</i></div>
        <div class="mainnav"><button class="on">82-0 Challenge</button></div>
        <div class="simbar"><span class="t2 sm">${hide ? 'HoopIQ (stats hidden)' : 'Classic'} · ${filled}/5 picked</span><button class="btn small" data-new>New run</button></div>
      </div></div>
      <div class="page">
        <div class="cols c-main">
          <div class="stack" style="gap:16px">${body}</div>
          <div class="stack" style="gap:16px">
            <section class="block"><header><h3>Your five</h3></header><div class="body flush">
              ${SLOTS.map(s => { const c = st.slots[s]; if (!c) return `<div class="res-row future" style="grid-template-columns:34px 1fr"><b class="caps">${s}</b><span class="t3">Open</span></div>`; const nm = HL.HISTORY.players[c.row.pid][0]; const fm = teamMeta(LINEAGE[c.club]); return `<div class="res-row" style="grid-template-columns:34px 1fr auto;cursor:default"><b class="caps">${s}</b><div class="row">${U.logo(fm, 22)}<div><div><b>${esc(nm)}</b></div><div class="t3 xs">${c.season}-${String(c.season + 1).slice(2)} · ${esc(c.club)}</div></div></div>${hide && !st.result ? '' : U.rating(c.row.ovr)}</div>`; }).join('')}
            </div></section>
            <section class="block"><header><h3>Best runs</h3></header><div class="body">${bestRuns().slice(0, 6).map(r => `<div class="kv"><span>${r.five.slice(0, 2).map(esc).join(', ')}…</span><b>${r.w}-${r.l}</b></div>`).join('') || '<div class="t3 sm">No runs yet.</div>'}</div></section>
          </div>
        </div>
      </div>
    </div>`;
    bind();
  }

  function draftView(hide) {
    if (!st.team) return `<section class="block"><div class="body row" style="gap:16px"><div class="grow"><h3>Spin for your first pick</h3><div class="t2 sm" style="margin-top:4px">You'll get a franchise and a decade. Pick one player who played there, into an open position he actually played.</div></div><button class="btn go big" data-spin>Spin</button></div></section>`;
    const fm = teamMeta(st.team);
    const reel = `<section class="block"><div class="body row wrap" style="gap:18px">
      <div class="row" style="gap:14px">${st.spinning ? `<div class="spinbox">${U.logo(R.pick(HL.TEAMS), 64)}</div><div class="spinbox num" style="font-size:40px">${R.pick(st.decades)}s</div>` : `${U.logo(fm, 64)}<div><div class="caps">Spin result</div><h2 style="font-size:30px">${esc(fm.city)} ${esc(fm.name)} · ${decLabel(st.decade)}</h2></div>`}</div>
      <div class="row ml-auto" style="gap:8px"><button class="btn" data-skip="team" ${st.skips.team ? '' : 'disabled'}>Team skip (${st.skips.team})</button><button class="btn" data-skip="era" ${st.skips.era ? '' : 'disabled'}>Era skip (${st.skips.era})</button></div>
    </div></section>`;
    if (st.spinning) return reel;
    const open = SLOTS.filter(s => !st.slots[s]);
    const cands = candidates(st.team, st.decade).filter(c => !SLOTS.some(s => st.slots[s] && st.slots[s].row.pid === c.row.pid));
    const rows = cands.slice(0, 40).map(c => {
      const bio = HL.HISTORY.players[c.row.pid];
      const fits = open.filter(s => posOk(c.row.pos + '-' + bio[2], s));
      const r = c.row;
      return `<tr class="${fits.length ? '' : 't3'}"><td class="l"><div class="row">${U.face({ name: bio[0], nbaId: bio[1], real: true }, 30, fm)}<div><b>${esc(bio[0])}</b><div class="t3 xs">${esc(bio[2])} · ${c.season}-${String(c.season + 1).slice(2)}</div></div></div></td>
        ${hide ? '' : `<td>${U.rating(r.ovr)}</td><td>${r.pts}</td><td>${r.trb}</td><td>${r.ast}</td><td>${c.season >= 1973 ? r.stl : '–'}</td><td>${c.season >= 1973 ? r.blk : '–'}</td>`}
        <td class="l">${fits.length ? fits.map(s => `<button class="btn small" data-pick="${r.pid}" data-slot="${s}">${s}</button>`).join(' ') : '<span class="xs">No open position</span>'}</td></tr>`;
    }).join('');
    return reel + `<section class="block"><header><h3>${esc(fm.name)} · ${decLabel(st.decade)}</h3><span class="t3 sm">${cands.length} players · best season with the club that decade${st.decade < 1980 ? ' · steals/blocks were not tracked before 1973-74' : ''}</span></header>
      <div class="body flush"><div class="tbl-wrap" style="max-height:62vh;overflow-y:auto"><table class="tbl"><thead><tr><th class="l">Player</th>${hide ? '' : '<th>OVR</th><th>PTS</th><th>REB</th><th>AST</th><th>STL</th><th>BLK</th>'}<th class="l">Pick for</th></tr></thead><tbody>${rows || '<tr><td class="l t3">No eligible players. Use a skip.</td></tr>'}</tbody></table></div></div></section>`;
  }

  function resultView() {
    const r = st.result;
    const [tier, line] = verdict(r.w);
    const five = SLOTS.map(s => st.slots[s]);
    const posterTeam = { abbr: 'YOU', city: 'The', name: 'Five', color: '#c9a227', color2: '#111111', espn: null };
    const starsFig = r.players.slice(0, 5);
    const rows = r.players.slice(0, 5).map((p, i) => { const l = r.lines[p.id]; const g = Math.max(1, l.gp); return `<tr><td class="l"><b>${esc(p.name)}</b> <span class="t3 xs">${five[i].season}</span></td><td>${(l.min / g).toFixed(1)}</td><td class="hi">${(l.pts / g).toFixed(1)}</td><td>${((l.orb + l.drb) / g).toFixed(1)}</td><td>${(l.ast / g).toFixed(1)}</td><td>${(l.stl / g).toFixed(1)}</td><td>${(l.blk / g).toFixed(1)}</td><td>${l.fga ? (l.fgm / l.fga * 100).toFixed(1) : '-'}</td></tr>`; }).join('');
    return `${HL.GFX.championPoster(posterTeam, starsFig, '', { wide: true, kicker: `82-0 Challenge · ${r.w}-${r.l}`, sub: tier })}
      <section class="block"><div class="body row wrap" style="gap:24px">
        <div><div class="caps">Final record</div><div class="num" style="font-size:64px;line-height:1">${r.w}-${r.l}</div></div>
        <div class="grow"><h2 style="font-size:28px">${tier}</h2><div class="t2" style="margin-top:6px">${esc(line)}</div>
          <div class="t3 sm" style="margin-top:8px">${r.pf.toFixed(1)} PPG · ${r.pa.toFixed(1)} allowed · longest win streak ${r.best}</div></div>
        <button class="btn go" data-new>Play again</button>
      </div></section>
      <section class="block"><header><h3>Season stats</h3></header><div class="body flush"><div class="tbl-wrap"><table class="tbl"><thead><tr><th class="l">Player</th><th>MIN</th><th>PTS</th><th>REB</th><th>AST</th><th>STL</th><th>BLK</th><th>FG%</th></tr></thead><tbody>${rows}</tbody></table></div></div></section>
      ${r.losses.length ? `<section class="block"><header><h3>The losses</h3></header><div class="body">${r.losses.slice(0, 12).map(x => `<div class="kv"><span>Game ${x.g} vs ${esc(x.opp.city)} ${esc(x.opp.name)}</span><b>${x.score}</b></div>`).join('')}</div></section>` : ''}`;
  }

  function bind() {
    const app = U.app();
    app.querySelector('[data-home]').onclick = () => HL.App.title();
    app.querySelectorAll('[data-new]').forEach(b => b.onclick = () => { st = null; render(); });
    const sp = app.querySelector('[data-spin]'); if (sp) sp.onclick = () => spin();
    app.querySelectorAll('[data-skip]').forEach(b => b.onclick = () => { const k = b.dataset.skip; if (!st.skips[k]) return; st.skips[k]--; spin(k); });
    app.querySelectorAll('[data-pick]').forEach(b => b.onclick = () => {
      const c = candidates(st.team, st.decade).find(x => x.row.pid === b.dataset.pick);
      st.slots[b.dataset.slot] = c;
      st.used.push(st.decade);
      if (SLOTS.every(s => st.slots[s])) { st.team = null; render(); }
      else spin();
    });
    const sim = app.querySelector('[data-sim]');
    if (sim) sim.onclick = () => { sim.disabled = true; sim.textContent = 'Playing 82 games…'; setTimeout(() => simSeason(), 30); };
  }

  function setupScreen() {
    U.applyTeamTheme(null);
    U.setEra('modern');
    const all = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];
    const cfg = { mode: 'classic', decades: all.slice(1) };
    const draw = () => {
      U.app().innerHTML = `<div class="frame"><div class="masthead"><div class="bar"><div class="wordmark" data-home>Hoops<i>Life</i></div><div class="mainnav"><button class="on">82-0 Challenge</button></div></div></div>
      <div class="page" style="max-width:900px">
        <div class="page-title"><h2>82-0 Challenge</h2></div>
        <section class="block"><div class="body stack">
          <p class="t2" style="margin:0">Spin a franchise and a decade, then draft one real player who played there into an open position he actually played. You get one team skip and one decade skip. When your five is set, they play all 82 games against the real 2025-26 league. Can they go 82-0?</p>
          <div class="setting" style="flex-wrap:wrap"><div class="grow"><b>Mode</b><div class="d">HoopIQ hides ratings and stats, so you draft from memory.</div></div>${U.seg('mode', [['classic', 'Classic'], ['hoopiq', 'HoopIQ']], cfg.mode)}</div>
          <div class="setting" style="flex-wrap:wrap"><div class="grow"><b>Decades in the spin</b><div class="d">Each pick uses a different decade while possible.</div></div>
            <div class="row wrap">${all.map(d => `<label class="row sm" style="gap:4px"><input type="checkbox" data-dec="${d}" ${cfg.decades.includes(d) ? 'checked' : ''}> ${d}s</label>`).join('')}</div></div>
          <div class="row"><button class="btn go big ml-auto" data-go>Start</button></div>
        </div></section>
      </div></div>`;
      const app = U.app();
      app.querySelector('[data-home]').onclick = () => HL.App.title();
      app.querySelectorAll('[data-seg] button').forEach(b => b.onclick = () => { cfg.mode = b.dataset.v; draw(); });
      app.querySelectorAll('[data-dec]').forEach(cb => cb.onchange = () => { const d = +cb.dataset.dec; cfg.decades = cb.checked ? [...cfg.decades, d] : cfg.decades.filter(x => x !== d); });
      app.querySelector('[data-go]').onclick = () => { if (cfg.decades.length < 1) return U.toast('Pick at least one decade.'); newRun(cfg.mode, cfg.decades.sort()); render(); };
    };
    draw();
  }

  return { open: () => { st = null; render(); }, LINEAGE, candidates, franchisesIn, loadDecade, posOk };
})();
