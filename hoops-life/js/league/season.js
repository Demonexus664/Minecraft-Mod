// League creation, schedule, day-by-day sim, standings, play-in, playoffs, awards, offseason.
window.HL = window.HL || {};

HL.ROOKIES_2025 = new Set(['Cooper Flagg', 'Dylan Harper', 'VJ Edgecombe', 'Kon Knueppel', 'Ace Bailey', 'Tre Johnson', 'Jeremiah Fears', 'Egor Dëmin', 'Collin Murray-Boyles', 'Khaman Maluach', 'Cedric Coward', 'Noa Essengue', 'Derik Queen', 'Carter Bryant', 'Thomas Sorber', 'Yang Hansen', 'Joan Beringer', 'Walter Clayton Jr.', 'Nolan Traore', 'Kasparas Jakučionis', 'Will Riley', 'Drake Powell', 'Asa Newell', 'Nique Clifford', 'Jase Richardson', 'Ben Saraf', 'Danny Wolf', 'Hugo González', 'Liam McNeeley', 'Rasheer Fleming', 'Noah Penda', 'Sion James', 'Ryan Kalkbrenner', 'Adou Thiero', 'Chaz Lanier', 'Kam Jones', 'Micah Peavy', 'Maxime Raynaud', 'Tyrese Proctor', 'Kobe Sanders', 'Mohamed Diawara', 'Will Richard']);

HL.League = {};

(function () {
  const R = HL.RNG;
  let L = null; // active league

  HL.League.get = () => L;
  HL.League.set = (league) => { L = league; if (league) HL.setNextPlayerId(league.nextPid || 1); };

  HL.League.create = function ({ userTeamId = null, seed = null, settings = {} } = {}) {
    if (seed != null) R.setSeed(seed);
    HL.setNextPlayerId(1);
    const season = HL.ROSTER_META.season;
    const league = {
      version: 1,
      createdAt: Date.now(),
      season,
      phase: 'regular',
      day: 0,
      rules: HL.DEFAULT_RULES(),
      settings: Object.assign({ difficulty: 'pro', depth: 'detailed', simSpeed: 'normal' }, settings),
      userTeamId,
      teams: HL.TEAMS.map(t => ({
        id: t.id, abbr: t.abbr, espn: t.espn, city: t.city, name: t.name, conf: t.conf, div: t.div,
        color: t.color, color2: t.color2, arena: t.arena, market: t.market,
        strategy: HL.DEFAULT_STRATEGY(),
        w: 0, l: 0, homeW: 0, homeL: 0, awayW: 0, awayL: 0, confW: 0, confL: 0, streak: 0, last10: [],
        pf: 0, pa: 0,
      })),
      players: {},
      schedule: [],
      boxScores: {},     // gid -> full result (kept for recent games)
      playoffs: null,
      awards: {},
      history: [],
      news: [],
      transactions: [],
      nbaIds: null,
    };
    // Real rosters.
    for (const t of league.teams) {
      const lines = HL.ROSTERS_2025[t.abbr].trim().split('\n');
      for (const line of lines) {
        const d = HL.parseRosterLine(line);
        const p = HL.createPlayer({ ...d, teamId: t.id, season, nbaId: HL.lookupNbaId ? HL.lookupNbaId(d.name) : null });
        p.yearsPro = HL.ROOKIES_2025.has(p.name) ? 0 : Math.max(1, p.age - 20);
        league.players[p.id] = p;
      }
    }
    league.schedule = buildSchedule(league.teams);
    league.nextPid = HL.nextPlayerId();
    L = league;
    HL.News && HL.News.seasonStart && HL.News.seasonStart(league);
    return league;
  };

  // ---------- Schedule (82 games: 2 vs other conf, 3-4 vs own conf) ----------
  function buildSchedule(teams) {
    const games = [];
    const byConf = { East: teams.filter(t => t.conf === 'East'), West: teams.filter(t => t.conf === 'West') };
    for (const conf of ['East', 'West']) {
      const ct = byConf[conf];
      const n = ct.length;
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const d = Math.min(j - i, n - (j - i));
          const count = d <= 2 ? 3 : 4; // circulant: each team plays 4 opponents 3x, 10 opponents 4x
          for (let k = 0; k < count; k++) {
            const home = (k % 2 === 0) ? ct[i] : ct[j];
            const away = home === ct[i] ? ct[j] : ct[i];
            games.push({ home: home.id, away: away.id });
          }
        }
      }
    }
    for (const e of byConf.East) for (const w of byConf.West) {
      games.push({ home: e.id, away: w.id });
      games.push({ home: w.id, away: e.id });
    }
    R.shuffle(games);
    // Assign to days: each team at most one game per day, avoid too many back-to-backs.
    const days = [];
    const lastDay = {};
    let remaining = games;
    let day = 0;
    while (remaining.length) {
      const busy = new Set();
      const today = [];
      const next = [];
      for (const g of remaining) {
        const b2b = (lastDay[g.home] === day - 1) + (lastDay[g.away] === day - 1);
        const cap = 15;
        if (!busy.has(g.home) && !busy.has(g.away) && today.length < cap && (b2b === 0 || R.chance(0.35))) {
          today.push(g); busy.add(g.home); busy.add(g.away);
        } else next.push(g);
      }
      for (const g of today) { lastDay[g.home] = day; lastDay[g.away] = day; }
      days.push(today);
      remaining = next;
      day++;
    }
    const out = [];
    let gid = 1;
    days.forEach((dg, d) => dg.forEach(g => out.push({ gid: gid++, day: d, home: g.home, away: g.away, res: null })));
    return out;
  }

  // ---------- Helpers ----------
  HL.League.teamPlayers = (tid) => Object.values(L.players).filter(p => p.teamId === tid);
  HL.League.player = (id) => L.players[id];
  HL.League.team = (id) => L.teams[id];
  HL.League.lastDay = () => L.schedule.length ? L.schedule[L.schedule.length - 1].day : 0;

  function simTeamObj(t) {
    return { id: t.id, abbr: t.abbr, strategy: t.strategy, players: HL.League.teamPlayers(t.id) };
  }

  function seasonLine(p, season, playoffs) {
    const key = playoffs ? season + 'p' : String(season);
    p.stats[key] = p.stats[key] || Object.assign(HL.blankStatLine(), { teamId: p.teamId });
    return p.stats[key];
  }

  function applyResult(g, res, playoffs) {
    const ht = L.teams[g.home], at = L.teams[g.away];
    const hs = res.home.score, as = res.away.score;
    g.res = { hs, as, ot: res.ot };
    for (const [side, t] of [[res.home, ht], [res.away, at]]) {
      for (const id in side.box) {
        const line = seasonLine(L.players[id], L.season, playoffs);
        const b = side.box[id];
        for (const k in b) if (typeof b[k] === 'number' && k in line) line[k] += b[k];
      }
    }
    // Injuries: tick down existing, then apply new.
    for (const tid of [g.home, g.away]) {
      for (const p of HL.League.teamPlayers(tid)) {
        if (p.injury && p.injury.games > 0) {
          p.injury.games--;
          if (p.injury.games <= 0) healPlayer(p);
        }
      }
    }
    for (const inj of res.injuries) {
      const p = L.players[inj.pid];
      if (inj.games > 0) {
        p.injury = { name: inj.name, region: inj.region, games: inj.games, lasting: inj.lasting };
        if (inj.games >= 10) HL.News && HL.News.injury && HL.News.injury(L, p, inj);
      }
    }
    if (!playoffs) {
      const hw = hs > as;
      const W = hw ? ht : at, Lo = hw ? at : ht;
      W.w++; Lo.l++;
      if (hw) { ht.homeW++; at.awayL++; } else { at.awayW++; ht.homeL++; }
      if (ht.conf === at.conf) { W.confW++; Lo.confL++; }
      W.streak = W.streak > 0 ? W.streak + 1 : 1;
      Lo.streak = Lo.streak < 0 ? Lo.streak - 1 : -1;
      W.last10 = [...W.last10, 1].slice(-10); Lo.last10 = [...Lo.last10, 0].slice(-10);
      ht.pf += hs; ht.pa += as; at.pf += as; at.pa += hs;
    }
    // Keep full box scores for user's games and recent games only.
    L.boxScores[g.gid] = { ...res, pbp: res.pbp, day: g.day, home: res.home, away: res.away };
    const keys = Object.keys(L.boxScores);
    if (keys.length > 160) {
      for (const k of keys.slice(0, keys.length - 160)) {
        const b = L.boxScores[k];
        const isUser = L.userTeamId != null && (b.home.teamId === L.userTeamId || b.away.teamId === L.userTeamId);
        if (!isUser || keys.length > 400) delete L.boxScores[k];
      }
    }
    HL.News && HL.News.game && HL.News.game(L, g, res, playoffs);
  }

  function healPlayer(p) {
    if (p.injury && p.injury.lasting) {
      for (const k in p.injury.lasting) p.attrs[k] = HL.clamp(p.attrs[k] + p.injury.lasting[k], 25, 99);
      p.ovr = HL.computeOvr(p.attrs, p.pos);
    }
    p.injury = null;
  }

  // ---------- Hardship exception ----------
  // Like the real NBA: a team with fewer than 8 healthy players may sign replacements.
  const healthy = tid => HL.League.teamPlayers(tid).filter(p => !p.injury || p.injury.games <= 0);
  function ensureHealthy(tid) {
    let guard = 0;
    while (healthy(tid).length < 8 && guard++ < 8) {
      const t = L.teams[tid];
      let p = Object.values(L.players).filter(x => x.teamId == null && !x.retired && (!x.injury || x.injury.games <= 0)).sort((a, b) => b.ovr - a.ovr)[0];
      if (!p) {
        const pos = R.pick(HL.POSITIONS);
        p = HL.createPlayer({ name: `${R.pick(HL.NAMES.first)} ${R.pick(HL.NAMES.last)}`, pos, age: R.int(23, 31), height: { PG: 75, SG: 77, SF: 79, PF: 81, C: 83 }[pos] + R.int(-1, 1), ovr: R.int(55, 63), arch: R.pick(['3d', 'twoway', 'rimbig', 'defguard', 'sniper']), real: false, season: L.season, potential: 0 });
        p.yearsPro = R.int(1, 6);
        L.players[p.id] = p;
      }
      p.teamId = tid;
      p.hardship = true;
      p.contract = { amount: 0.6, exp: L.season, hardship: true };
      L.transactions.push({ season: L.season, day: L.day, type: 'hardship', teamId: tid, pid: p.id });
      HL.News && HL.News.hardship && HL.News.hardship(L, t, p);
    }
    // Release hardship signings once the roster is healthy again.
    const hs = HL.League.teamPlayers(tid).filter(p => p.hardship);
    if (hs.length && healthy(tid).length - hs.length >= 9) {
      for (const p of hs) { p.teamId = null; p.hardship = false; }
    }
  }

  // ---------- Regular season sim ----------
  HL.League.simDay = function () {
    if (L.phase !== 'regular') return HL.League.simPostseasonDay();
    const games = L.schedule.filter(g => g.day === L.day && !g.res);
    for (const g of games) {
      ensureHealthy(g.home); ensureHealthy(g.away);
      const isUser = L.userTeamId != null && (g.home === L.userTeamId || g.away === L.userTeamId);
      const res = HL.simGame(simTeamObj(L.teams[g.home]), simTeamObj(L.teams[g.away]), L.rules, { pbp: isUser });
      applyResult(g, res, false);
    }
    L.day++;
    // Teams not playing today still heal a little (rest days count as 0.5 games).
    if (L.day > HL.League.lastDay()) startPostseason();
    return games.length;
  };

  HL.League.simDays = function (n, onProgress) {
    for (let i = 0; i < n; i++) {
      if (L.phase === 'offseason') break;
      HL.League.simDay();
      if (onProgress) onProgress(i);
    }
  };

  // ---------- Standings ----------
  HL.League.standings = function (conf) {
    const ts = L.teams.filter(t => !conf || t.conf === conf);
    return ts.slice().sort((a, b) => {
      const pa = a.w / Math.max(1, a.w + a.l), pb = b.w / Math.max(1, b.w + b.l);
      if (pb !== pa) return pb - pa;
      if (b.confW !== a.confW) return b.confW - a.confW;
      return (b.pf - b.pa) - (a.pf - a.pa);
    });
  };
  HL.League.gamesBack = function (t, leader) {
    return ((leader.w - t.w) + (t.l - leader.l)) / 2;
  };

  // ---------- Postseason ----------
  function startPostseason() {
    L.phase = 'playin';
    computeAwards();
    const po = { playin: {}, rounds: [], champion: null, day: 0 };
    for (const conf of ['East', 'West']) {
      const s = HL.League.standings(conf).map(t => t.id);
      po.playin[conf] = { seeds: s.slice(0, 10), games: [
        { id: '7v8', a: s[6], b: s[7], winner: null, loser: null },
        { id: '9v10', a: s[8], b: s[9], winner: null, loser: null },
        { id: 'final', a: null, b: null, winner: null },
      ] };
    }
    L.playoffs = po;
    HL.News && HL.News.phase && HL.News.phase(L, 'playin');
  }

  function playSingle(homeId, awayId) {
    ensureHealthy(homeId); ensureHealthy(awayId);
    const res = HL.simGame(simTeamObj(L.teams[homeId]), simTeamObj(L.teams[awayId]), L.rules, { pbp: L.userTeamId === homeId || L.userTeamId === awayId });
    const g = { gid: 'P' + L.season + '-' + (Object.keys(L.boxScores).length + 1) + '-' + homeId + '-' + awayId, day: L.day, home: homeId, away: awayId, res: null, playoff: true };
    applyResult(g, res, true);
    return { winner: res.home.score > res.away.score ? homeId : awayId, g };
  }

  HL.League.simPostseasonDay = function () {
    const po = L.playoffs;
    if (!po) return 0;
    if (L.phase === 'playin') {
      let played = 0;
      for (const conf of ['East', 'West']) {
        const pi = po.playin[conf];
        const [g78, g910, fin] = pi.games;
        if (g78.winner == null) {
          for (const g of [g78, g910]) {
            const r = playSingle(g.a, g.b);
            g.winner = r.winner; g.loser = r.winner === g.a ? g.b : g.a;
          }
          played++;
        } else if (fin.winner == null) {
          fin.a = g78.loser; fin.b = g910.winner;
          const r = playSingle(fin.a, fin.b);
          fin.winner = r.winner;
          played++;
        }
      }
      L.day++;
      if (po.playin.East.games[2].winner != null && po.playin.West.games[2].winner != null) {
        L.phase = 'playoffs';
        const round1 = [];
        for (const conf of ['East', 'West']) {
          const pi = po.playin[conf];
          const seeds = [...pi.seeds.slice(0, 6), pi.games[0].winner, pi.games[2].winner];
          for (const [h, a] of [[0, 7], [3, 4], [2, 5], [1, 6]]) {
            round1.push({ conf, hi: seeds[h], lo: seeds[a], hiSeed: h + 1, loSeed: a + 1, wins: [0, 0], games: [], winner: null });
          }
        }
        po.rounds.push(round1);
        HL.News && HL.News.phase && HL.News.phase(L, 'playoffs');
      }
      return played;
    }
    if (L.phase === 'playoffs') {
      const round = po.rounds[po.rounds.length - 1];
      for (const s of round) {
        if (s.winner != null) continue;
        const gameNo = s.wins[0] + s.wins[1];
        const hiHome = [0, 1, 4, 6].includes(gameNo);
        const homeId = hiHome ? s.hi : s.lo, awayId = hiHome ? s.lo : s.hi;
        const r = playSingle(homeId, awayId);
        s.games.push(r.g.gid);
        if (r.winner === s.hi) s.wins[0]++; else s.wins[1]++;
        if (s.wins[0] === 4) s.winner = s.hi;
        if (s.wins[1] === 4) s.winner = s.lo;
        if (s.winner != null) HL.News && HL.News.seriesEnd && HL.News.seriesEnd(L, s, po.rounds.length);
      }
      L.day++;
      if (round.every(s => s.winner != null)) {
        if (round.length === 1) {
          po.champion = round[0].winner;
          finishSeason();
        } else {
          const next = [];
          for (let i = 0; i < round.length; i += 2) {
            const a = round[i].winner, b = round[i + 1].winner;
            const ta = L.teams[a], tb = L.teams[b];
            const rec = t => t.w / Math.max(1, t.w + t.l);
            const [hi, lo] = rec(ta) >= rec(tb) ? [a, b] : [b, a];
            const conf = round.length === 2 ? 'Finals' : round[i].conf;
            next.push({ conf, hi, lo, wins: [0, 0], games: [], winner: null });
          }
          po.rounds.push(next);
        }
      }
      return round.length;
    }
    return 0;
  };

  // ---------- Awards ----------
  function perGame(p, season, playoffs) {
    const s = p.stats[playoffs ? season + 'p' : String(season)];
    if (!s || !s.gp) return null;
    const g = s.gp;
    return {
      gp: g, gs: s.gs, min: s.min / g, pts: s.pts / g, reb: (s.orb + s.drb) / g, ast: s.ast / g, stl: s.stl / g, blk: s.blk / g, tov: s.tov / g,
      fgp: s.fga ? s.fgm / s.fga : 0, tpp: s.tpa ? s.tpm / s.tpa : 0, ftp: s.fta ? s.ftm / s.fta : 0,
      ts: (s.fga + 0.44 * s.fta) ? s.pts / (2 * (s.fga + 0.44 * s.fta)) : 0, pm: s.pm / g,
    };
  }
  HL.League.perGame = perGame;

  function computeAwards() {
    const season = L.season;
    const rows = Object.values(L.players).map(p => ({ p, s: perGame(p, season) })).filter(x => x.s && x.s.gp >= 50);
    const winPct = id => { const t = L.teams[id]; return t ? t.w / Math.max(1, t.w + t.l) : 0.3; };
    for (const x of rows) x.tid = x.p.teamId ?? x.p.stats[String(season)].teamId;
    const val = x => x.s.pts + x.s.reb * 0.9 + x.s.ast * 1.3 + x.s.stl * 1.5 + x.s.blk * 1.3 - x.s.tov + (x.s.ts - 0.56) * 60 + x.s.pm * 0.6;
    const mvpScore = x => val(x) + winPct(x.tid) * 30;
    const sorted = rows.slice().sort((a, b) => mvpScore(b) - mvpScore(a));
    const a = {};
    a.mvp = sorted[0] && sorted[0].p.id;
    a.mvpRace = sorted.slice(0, 5).map(x => x.p.id);
    const dScore = x => x.s.stl * 2.5 + x.s.blk * 3 + x.s.reb * 0.15 + (Math.max(x.p.attrs.perD, x.p.attrs.intD) * 2 + x.p.attrs.steal + x.p.attrs.block) / 9 + winPct(x.tid) * 8;
    a.dpoy = rows.slice().sort((x, y) => dScore(y) - dScore(x))[0]?.p.id;
    const rookies = rows.filter(x => x.p.yearsPro === 0);
    a.roy = rookies.sort((x, y) => val(y) - val(x))[0]?.p.id;
    const bench = rows.filter(x => x.s.gs < x.s.gp * 0.4);
    a.smoy = bench.sort((x, y) => val(y) - val(x))[0]?.p.id;
    a.allNba = [sorted.slice(0, 5), sorted.slice(5, 10), sorted.slice(10, 15)].map(t => t.map(x => x.p.id));
    a.scoringChamp = rows.slice().sort((x, y) => y.s.pts - x.s.pts)[0]?.p.id;
    L.awards[season] = a;
    const tag = (id, award) => { if (id != null) L.players[id].careerAwards.push({ season, award }); };
    tag(a.mvp, 'MVP'); tag(a.dpoy, 'DPOY'); tag(a.roy, 'ROY'); tag(a.smoy, '6MOY');
    a.allNba.forEach((team, i) => team.forEach(id => tag(id, `All-NBA ${['1st', '2nd', '3rd'][i]}`)));
    HL.News && HL.News.awards && HL.News.awards(L, a);
  }

  function finishSeason() {
    const po = L.playoffs;
    const finals = po.rounds[3][0];
    const champ = po.champion;
    // Finals MVP: best performer on the champion in the Finals.
    let best = null, bestV = -1;
    for (const gid of finals.games) {
      const b = L.boxScores[gid];
      if (!b) continue;
      const side = b.home.teamId === champ ? b.home : b.away;
      for (const id in side.box) {
        const l = side.box[id];
        const v = l.pts + (l.orb + l.drb) * 0.8 + l.ast;
        best = best || {};
        best[id] = (best[id] || 0) + v;
      }
    }
    if (best) for (const id in best) if (best[id] > bestV) { bestV = best[id]; L.awards[L.season].fmvp = +id; }
    const a = L.awards[L.season];
    if (a.fmvp != null) L.players[a.fmvp].careerAwards.push({ season: L.season, award: 'Finals MVP' });
    for (const p of HL.League.teamPlayers(champ)) p.careerAwards.push({ season: L.season, award: 'Champion' });
    L.history.push({
      season: L.season, champion: champ, runnerUp: finals.winner === finals.hi ? finals.lo : finals.hi,
      mvp: a.mvp, fmvp: a.fmvp, dpoy: a.dpoy, roy: a.roy,
      finalsScore: finals.wins.slice().sort((x, y) => y - x).join('-'),
      records: L.teams.map(t => ({ id: t.id, w: t.w, l: t.l })),
    });
    L.phase = 'offseason';
    HL.News && HL.News.champion && HL.News.champion(L, champ, finals);
  }

  // ---------- Offseason ----------
  HL.League.advanceToNextSeason = function () {
    if (L.phase !== 'offseason') return;
    const season = L.season;
    // Draft order (reverse standings, simplified lottery for bottom 14).
    const order = draftOrder();
    const draftClass = HL.Draft ? HL.Draft.generateClass(season + 1, 70) : [];
    const picks = [];
    for (let round = 0; round < 2; round++) {
      for (const tid of order) {
        const pool = draftClass.filter(p => p.teamId == null);
        if (!pool.length) break;
        const pick = pool.sort((a, b) => (b.ovr * 0.6 + b.potential * 0.4) - (a.ovr * 0.6 + a.potential * 0.4) + R.normal(0, 1.5))[0];
        pick.teamId = tid;
        pick.draft = { year: season + 1, round: round + 1, pick: picks.length + 1, teamId: tid };
        picks.push(pick);
      }
    }
    for (const p of draftClass) {
      if (p.teamId != null) {
        p.contract = { amount: Math.max(1.2, 12 - p.draft.pick * 0.3), exp: season + 1 + (p.draft.round === 1 ? 4 : 2) };
        L.players[p.id] = p;
      }
    }
    L.lastDraft = { year: season + 1, picks: picks.map(p => p.id) };

    // Aging, progression, retirement.
    const diff = { rookie: 1.2, pro: 1, allstar: 0.9, hof: 0.8 }[L.settings.difficulty] || 1;
    for (const p of Object.values(L.players)) {
      if (p.retired) continue;
      const isNew = p.draft && p.draft.year === season + 1;
      if (!isNew) {
        p.age++;
        p.yearsPro = (p.yearsPro || 0) + 1;
        const delta = HL.progressionDelta(p.age, p.potential - p.ovr, p.traits.workEthic, diff);
        HL.applyProgression(p, delta);
        p.potential = Math.max(p.ovr, p.potential - (p.age > 25 ? 2 : 0));
      }
      const retireP = p.age >= 40 ? 0.9 : p.age >= 37 ? 0.45 + (80 - p.ovr) * 0.03 : p.age >= 34 ? (75 - p.ovr) * 0.04 : p.ovr < 58 && p.age >= 28 ? 0.3 : 0;
      if (!isNew && R.chance(HL.clamp(retireP, 0, 0.98))) {
        p.retired = season; p.teamId = null;
        HL.News && HL.News.retire && HL.News.retire(L, p);
      }
    }
    for (const p of Object.values(L.players)) if (p.hardship) { p.hardship = false; p.teamId = null; }
    // Contracts: expire, AI re-signs or releases to free agency, then AI signs free agents.
    const fa = [];
    for (const p of Object.values(L.players)) {
      if (p.retired || p.teamId == null) { if (!p.retired && p.teamId == null) fa.push(p); continue; }
      if (p.contract.exp <= season) {
        const keep = p.ovr >= 74 ? R.chance(0.7) : R.chance(0.35);
        if (keep) p.contract = { amount: Math.round(HL.estimateSalary(p.ovr, p.age) * 10) / 10, exp: season + R.int(1, 4) };
        else { p.teamId = null; fa.push(p); }
      }
    }
    fa.sort((a, b) => b.ovr - a.ovr);
    for (const t of L.teams) {
      const roster = () => HL.League.teamPlayers(t.id);
      while (roster().length < 13 && fa.length) {
        const p = fa.shift();
        p.teamId = t.id;
        p.contract = { amount: Math.round(HL.estimateSalary(p.ovr, p.age) * 10) / 10, exp: season + R.int(1, 3) };
      }
      // Cut down to 15.
      const r = roster().sort((a, b) => a.ovr - b.ovr);
      while (r.length > 15) { const cut = r.shift(); cut.teamId = null; }
    }
    // Reset team records.
    for (const t of L.teams) Object.assign(t, { w: 0, l: 0, homeW: 0, homeL: 0, awayW: 0, awayL: 0, confW: 0, confL: 0, streak: 0, last10: [], pf: 0, pa: 0 });
    L.season++;
    L.day = 0;
    L.phase = 'regular';
    L.playoffs = null;
    L.boxScores = {};
    L.schedule = buildSchedule(L.teams);
    L.nextPid = HL.nextPlayerId();
    HL.News && HL.News.seasonStart && HL.News.seasonStart(L);
  };

  function draftOrder() {
    const all = HL.League.standings().slice().reverse(); // worst first
    const lottery = all.slice(0, 14).map(t => t.id);
    const odds = [140, 140, 140, 125, 105, 90, 75, 60, 45, 30, 20, 15, 10, 5];
    const top4 = [];
    const pool = lottery.map((id, i) => ({ id, w: odds[i] }));
    for (let i = 0; i < 4; i++) {
      const pick = R.weighted(pool.filter(x => !top4.includes(x.id)), x => x.w);
      top4.push(pick.id);
    }
    const restLottery = lottery.filter(id => !top4.includes(id));
    const playoffTeams = all.slice(14).map(t => t.id);
    return [...top4, ...restLottery, ...playoffTeams];
  }
})();
