// League creation (any real season), schedule, day-by-day sim, standings, era playoff formats,
// awards, offseason (real-history careers & drafts, or generated beyond the data).
window.HL = window.HL || {};

HL.LATEST_SEASON = 2025; // 2025-26 is the most recent season in the bundled data

// ---------- Calendar ----------
// Day 0 = opening night. Special start dates for shortened seasons.
const SPECIAL_STARTS = { 1998: [1999, 1, 5], 2011: [2011, 11, 25], 2020: [2020, 11, 22] };
HL.seasonStartDate = function (season) {
  if (SPECIAL_STARTS[season]) { const [y, m, d] = SPECIAL_STARTS[season]; return new Date(Date.UTC(y, m, d)); }
  const d = new Date(Date.UTC(season, 9, season >= 1990 ? 20 : 12));
  while (d.getUTCDay() !== 2) d.setUTCDate(d.getUTCDate() + 1);
  return d;
};
HL.dateOfDay = function (season, day) {
  const d = HL.seasonStartDate(season);
  d.setUTCDate(d.getUTCDate() + day);
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
};
HL.seasonCalendar = function (season, games = 82) {
  const start = HL.seasonStartDate(season);
  const dayOf = (y, m, dd) => Math.round((Date.UTC(y, m, dd) - start) / 86400000);
  const breakDays = new Set();
  // All-Star break around the third Sunday of February (All-Star Game since 1951).
  let asg = null;
  if (season >= 1950 && !SPECIAL_STARTS[season]) {
    const feb = new Date(Date.UTC(season + 1, 1, 1));
    let sundays = 0;
    while (true) { if (feb.getUTCDay() === 0 && ++sundays === 3) break; feb.setUTCDate(feb.getUTCDate() + 1); }
    asg = dayOf(feb.getUTCFullYear(), feb.getUTCMonth(), feb.getUTCDate());
    for (let d = asg - 2; d <= asg + 3; d++) breakDays.add(d);
  }
  if (!SPECIAL_STARTS[season]) {
    const nov = new Date(Date.UTC(season, 10, 1));
    let thursdays = 0;
    while (true) { if (nov.getUTCDay() === 4 && ++thursdays === 4) break; nov.setUTCDate(nov.getUTCDate() + 1); }
    breakDays.add(dayOf(season, 10, nov.getUTCDate()));
    breakDays.add(dayOf(season, 11, 24));
  }
  // Length scales with games: 82 games ≈ 173 days (late October to the second Sunday of April).
  let last;
  if (games >= 80 && !SPECIAL_STARTS[season] && season >= 1990) {
    const apr = new Date(Date.UTC(season + 1, 3, 1));
    let aprSun = 0;
    while (true) { if (apr.getUTCDay() === 0 && ++aprSun === 2) break; apr.setUTCDate(apr.getUTCDate() + 1); }
    last = dayOf(apr.getUTCFullYear(), 3, apr.getUTCDate());
  } else {
    last = Math.round(games * 2.1) + breakDays.size;
  }
  return { allStarDay: asg, breakDays, lastRegularDay: last };
};
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
HL.fmtDay = function (season, day, opts = {}) {
  const d = HL.dateOfDay(season, day);
  return `${opts.weekday ? WEEKDAYS[d.getDay()] + ', ' : ''}${MONTHS[d.getMonth()]} ${d.getDate()}${opts.year ? ', ' + d.getFullYear() : ''}`;
};

// ---------- Era rules, money, playoff formats ----------
HL.eraRules = function (season) {
  const r = HL.DEFAULT_RULES();
  r.threePoint = season >= 1979;
  r.handCheck = season < 2004;
  r.shotClock = season >= 1954 ? 24 : 35;
  return r;
};
// Average NBA salary by season (approx., $M) -> money scale relative to 2025-26.
const AVG_SALARY = [[1946, 0.004], [1955, 0.008], [1965, 0.018], [1970, 0.035], [1975, 0.109], [1980, 0.17], [1985, 0.325], [1990, 0.75], [1995, 1.9], [2000, 3.5], [2005, 4.4], [2010, 5.1], [2015, 4.9], [2017, 6.2], [2020, 7.5], [2025, 11.5]];
HL.salaryScale = function (season) {
  const pts = AVG_SALARY;
  if (season >= pts[pts.length - 1][0]) return Math.pow(1.05, season - 2025);
  for (let i = 1; i < pts.length; i++) {
    if (season <= pts[i][0]) {
      const [s0, v0] = pts[i - 1], [s1, v1] = pts[i];
      const v = v0 + (v1 - v0) * (season - s0) / (s1 - s0);
      return v / 11.5;
    }
  }
  return 1;
};
HL.playoffFormat = function (season) {
  if (season >= 2020) return { perConf: 8, playIn: true, bestOf: [7, 7, 7, 7] };
  if (season >= 2002) return { perConf: 8, bestOf: [7, 7, 7, 7] };
  if (season >= 1983) return { perConf: 8, bestOf: [5, 7, 7, 7] };
  if (season >= 1976) return { perConf: 6, byes: 2, bestOf: [3, 7, 7, 7] };
  if (season >= 1974) return { perConf: 5, byes: 3, bestOf: [3, 7, 7, 7] };
  if (season >= 1970) return { perConf: 4, bestOf: [7, 7, 7] };
  if (season >= 1954) return { perConf: 3, byes: 1, bestOf: [5, 7, 7] };
  return { perConf: 4, bestOf: [3, 5, 7] };
};

HL.League = {};

(function () {
  const R = HL.RNG;
  let L = null; // active league

  HL.League.get = () => L;
  HL.League.set = (league) => { L = league; if (league) HL.setNextPlayerId(league.nextPid || 1); };

  const blankRecord = () => ({ w: 0, l: 0, homeW: 0, homeL: 0, awayW: 0, awayL: 0, confW: 0, confL: 0, streak: 0, last10: [], pf: 0, pa: 0 });

  // ---------- Create from any real season ----------
  HL.League.createFromSeason = function ({ seasonKey = String(HL.LATEST_SEASON), userAbbr = null, seed = null, settings = {} } = {}) {
    const S = HL.HISTORY_SEASONS[seasonKey];
    if (!S) throw new Error('Season data not loaded: ' + seasonKey);
    if (seed != null) R.setSeed(seed);
    HL.setNextPlayerId(1);
    const season = +seasonKey;
    const games = Math.max(...S.teams.map(t => t[2] + t[3]));
    const league = {
      version: 2, createdAt: Date.now(), season, startSeason: season, phase: 'regular', day: 0,
      rules: HL.eraRules(season), profile: S.profile || null, games,
      settings: Object.assign({ difficulty: 'pro', depth: 'detailed', history: 'real' }, settings),
      userTeamId: null,
      teams: S.teams.map((t, i) => Object.assign(HL.History.teamMeta(t[0], t[1], season), {
        id: i, strategy: HL.DEFAULT_STRATEGY(), real: { w: t[2], l: t[3], srs: t[4], playoffs: !!t[8] },
      }, blankRecord())),
      players: {}, schedule: [], boxScores: {}, playoffs: null, awards: {}, history: [], news: [], transactions: [],
    };
    L = league;
    if (userAbbr) { const ut = league.teams.find(t => t.bref === userAbbr || t.abbr === userAbbr); league.userTeamId = ut ? ut.id : null; }
    // Opening rosters: each player's first team that season; keep the 15 who played the most.
    const byTeam = {};
    for (const row of HL.History.seasonRows(seasonKey)) {
      const first = row.stints[0] && row.stints[0][0];
      const team = league.teams.find(t => t.bref === first);
      const p = HL.History.makePlayer(row, season, team ? team.id : null);
      p.realAttrs = Object.assign({}, p.attrs);
      setContract(p, season);
      league.players[p.id] = p;
      if (team) (byTeam[team.id] = byTeam[team.id] || []).push({ p, share: row.stints[0][1] * row.mpg });
    }
    for (const id in byTeam) {
      const list = byTeam[id].sort((a, b) => b.share - a.share);
      list.slice(15).forEach(x => { x.p.teamId = null; });
    }
    league.schedule = buildSchedule(league.teams, season, games);
    league.nextPid = HL.nextPlayerId();
    HL.News && HL.News.seasonStart && HL.News.seasonStart(league);
    return league;
  };
  // Default: the most recent real season.
  HL.League.create = function ({ userTeamId = null, seed = null, settings = {} } = {}) {
    const lg = HL.League.createFromSeason({ seasonKey: String(HL.LATEST_SEASON), seed, settings });
    if (userTeamId != null) lg.userTeamId = userTeamId;
    return lg;
  };

  function setContract(p, season) {
    const amt = HL.estimateSalary(p.ovr, p.age) * HL.salaryScale(season);
    p.contract = { amount: Math.round(amt * 1000) / 1000, exp: season + R.int(0, 3) };
  }

  // ---------- Schedule ----------
  // Conference opponents more often than the other conference, then spread over real dates.
  function buildMatchups(teams, games) {
    const out = [];
    const confs = {};
    for (const t of teams) (confs[t.conf] = confs[t.conf] || []).push(t);
    const N = teams.length;
    const cross = N >= 17 ? 2 : Math.max(2, Math.floor(games / (N - 1)) - 2);
    const addGames = (a, b, n) => { for (let k = 0; k < n; k++) out.push(k % 2 === 0 ? { home: a.id, away: b.id } : { home: b.id, away: a.id }); };
    const names = Object.keys(confs);
    for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++)
      for (const a of confs[names[i]]) for (const b of confs[names[j]]) addGames(a, b, cross);
    for (const c of names) {
      const ct = confs[c], n = ct.length;
      const other = N - n;
      const need = games - cross * other;               // games left for conference opponents
      const base = Math.floor(need / Math.max(1, n - 1));
      let extra = need - base * (n - 1);                // extra games: circulant within the conference
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
        const d = Math.min(j - i, n - (j - i));
        let k = base;
        if (d <= Math.floor(extra / 2)) k++;
        else if (extra % 2 === 1 && n % 2 === 0 && d === n / 2) k++;
        addGames(ct[i], ct[j], k);
      }
    }
    return out;
  }

  function buildSchedule(teams, season, games = 82) {
    const matchups = buildMatchups(teams, games);
    R.shuffle(matchups);
    const cal = HL.seasonCalendar(season, games);
    const playDays = [];
    for (let d = 0; d <= cal.lastRegularDay; d++) if (!cal.breakDays.has(d)) playDays.push(d);
    const left = {};
    for (const t of teams) left[t.id] = 0;
    for (const g of matchups) { left[g.home]++; left[g.away]++; }
    const lastDay = {}, b2b = {};
    const maxPerDay = Math.floor(teams.length / 2);
    let remaining = matchups;
    const days = [];
    playDays.forEach((day, idx) => {
      const daysLeft = playDays.length - idx;
      const dow = HL.dateOfDay(season, day).getDay();
      const weight = dow === 0 ? 0.9 : dow === 1 ? 0.75 : dow === 2 || dow === 5 || dow === 3 ? 1.1 : dow === 4 ? 0.8 : 1.15;
      let quota = Math.round(remaining.length / daysLeft * weight + R.normal(0, 1.2));
      quota = HL.clamp(quota, 1, maxPerDay);
      if (daysLeft <= 3) quota = maxPerDay;
      const isB2B = g => (lastDay[g.home] === day - 1) + (lastDay[g.away] === day - 1);
      const urgency = g => (left[g.home] + left[g.away]) / (2 * daysLeft) + R.random() * 0.3 - isB2B(g) * 0.35;
      const pool = remaining.slice().sort((a, b) => urgency(b) - urgency(a));
      const busy = new Set(), today = [];
      for (const g of pool) {
        if (today.length >= quota) break;
        if (busy.has(g.home) || busy.has(g.away)) continue;
        if ([g.home, g.away].some(t => lastDay[t] === day - 1 && (b2b[t] || 0) >= 13) && daysLeft > 8) continue;
        today.push(g); busy.add(g.home); busy.add(g.away);
      }
      const set = new Set(today);
      remaining = remaining.filter(g => !set.has(g));
      for (const g of today) for (const t of [g.home, g.away]) {
        if (lastDay[t] === day - 1) b2b[t] = (b2b[t] || 0) + 1;
        lastDay[t] = day; left[t]--;
      }
      days.push([day, today]);
    });
    let extra = cal.lastRegularDay + 1;
    while (remaining.length) {
      const busy = new Set(), today = [];
      for (const g of remaining) if (!busy.has(g.home) && !busy.has(g.away)) { today.push(g); busy.add(g.home); busy.add(g.away); }
      const set = new Set(today);
      remaining = remaining.filter(g => !set.has(g));
      days.push([extra++, today]);
    }
    const out = [];
    let gid = 1;
    days.forEach(([d, dg]) => dg.forEach(g => out.push({ gid: gid++, day: d, home: g.home, away: g.away, res: null })));
    return out;
  }

  // ---------- Helpers ----------
  HL.League.teamPlayers = (tid) => Object.values(L.players).filter(p => p.teamId === tid);
  HL.League.player = (id) => L.players[id];
  HL.League.team = (id) => L.teams[id];
  HL.League.lastDay = () => L.schedule.length ? L.schedule[L.schedule.length - 1].day : 0;
  HL.League.conferences = () => [...new Set(L.teams.map(t => t.conf))].sort();

  function simRules() { return Object.assign({}, L.rules, { profile: L.profile }); }
  function simTeamObj(t) { return { id: t.id, abbr: t.abbr, strategy: t.strategy, players: HL.League.teamPlayers(t.id) }; }

  function seasonLine(p, season, playoffs) {
    const key = playoffs ? season + 'p' : String(season);
    p.stats[key] = p.stats[key] || Object.assign(HL.blankStatLine(), { teamId: p.teamId });
    return p.stats[key];
  }

  function applyResult(g, res, playoffs) {
    const ht = L.teams[g.home], at = L.teams[g.away];
    const hs = res.home.score, as = res.away.score;
    g.res = { hs, as, ot: res.ot };
    for (const side of [res.home, res.away]) {
      for (const id in side.box) {
        const line = seasonLine(L.players[id], L.season, playoffs);
        const b = side.box[id];
        for (const k in b) if (typeof b[k] === 'number' && k in line) line[k] += b[k];
      }
    }
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
    L.boxScores[g.gid] = { ...res, day: g.day };
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
  const healthy = tid => HL.League.teamPlayers(tid).filter(p => !p.injury || p.injury.games <= 0);
  function ensureHealthy(tid) {
    let guard = 0;
    while (healthy(tid).length < 8 && guard++ < 8) {
      const t = L.teams[tid];
      let p = Object.values(L.players).filter(x => x.teamId == null && !x.retired && !x.away && (!x.injury || x.injury.games <= 0)).sort((a, b) => b.ovr - a.ovr)[0];
      if (!p) {
        const pos = R.pick(HL.POSITIONS);
        p = HL.createPlayer({ name: `${R.pick(HL.NAMES.first)} ${R.pick(HL.NAMES.last)}`, pos, age: R.int(23, 31), height: { PG: 75, SG: 77, SF: 79, PF: 81, C: 83 }[pos] + R.int(-1, 1), ovr: R.int(55, 63), arch: R.pick(['3d', 'twoway', 'rimbig', 'defguard', 'sniper']), real: false, season: L.season, potential: 0 });
        p.yearsPro = R.int(1, 6);
        L.players[p.id] = p;
      }
      p.teamId = tid;
      p.hardship = true;
      p.contract = { amount: Math.round(1.2 * HL.salaryScale(L.season) * 1000) / 1000, exp: L.season, hardship: true };
      L.transactions.push({ season: L.season, day: L.day, type: 'hardship', teamId: tid, pid: p.id });
      HL.News && HL.News.hardship && HL.News.hardship(L, t, p);
    }
    const hs = HL.League.teamPlayers(tid).filter(p => p.hardship);
    if (hs.length && healthy(tid).length - hs.length >= 9) for (const p of hs) { p.teamId = null; p.hardship = false; }
  }

  // ---------- Regular season ----------
  HL.League.simDay = function () {
    if (L.phase !== 'regular') return HL.League.simPostseasonDay();
    const games = L.schedule.filter(g => g.day === L.day && !g.res);
    for (const g of games) {
      ensureHealthy(g.home); ensureHealthy(g.away);
      const isUser = L.userTeamId != null && (g.home === L.userTeamId || g.away === L.userTeamId);
      const res = HL.simGame(simTeamObj(L.teams[g.home]), simTeamObj(L.teams[g.away]), simRules(), { pbp: isUser });
      applyResult(g, res, false);
    }
    L.day++;
    if (L.day > HL.League.lastDay()) { L.day += 1; startPostseason(); }
    return games.length;
  };

  HL.League.standings = function (conf) {
    const ts = L.teams.filter(t => !conf || t.conf === conf);
    return ts.slice().sort((a, b) => {
      const pa = a.w / Math.max(1, a.w + a.l), pb = b.w / Math.max(1, b.w + b.l);
      if (pb !== pa) return pb - pa;
      if (b.confW !== a.confW) return b.confW - a.confW;
      return (b.pf - b.pa) - (a.pf - a.pa);
    });
  };
  HL.League.gamesBack = (t, leader) => ((leader.w - t.w) + (t.l - leader.l)) / 2;

  // ---------- Postseason (era formats) ----------
  function startPostseason() {
    computeAwards();
    const fmt = HL.playoffFormat(L.season);
    const po = { format: fmt, seeds: {}, byes: {}, playin: null, rounds: [], champion: null };
    for (const conf of HL.League.conferences()) {
      const st = HL.League.standings(conf).map(t => t.id);
      po.seeds[conf] = st;
    }
    L.playoffs = po;
    if (fmt.playIn) {
      L.phase = 'playin';
      po.playin = {};
      for (const conf of HL.League.conferences()) {
        const s = po.seeds[conf];
        po.playin[conf] = { seeds: s.slice(0, 10), games: [
          { id: '7v8', a: s[6], b: s[7], winner: null, loser: null },
          { id: '9v10', a: s[8], b: s[9], winner: null, loser: null },
          { id: 'final', a: null, b: null, winner: null },
        ] };
      }
      HL.News && HL.News.phase && HL.News.phase(L, 'playin');
    } else {
      beginPlayoffs();
    }
  }

  // Seed lists per conference, then the first round.
  function beginPlayoffs() {
    const po = L.playoffs, fmt = po.format;
    L.phase = 'playoffs';
    po.field = {};
    for (const conf of HL.League.conferences()) {
      let field;
      if (fmt.playIn) {
        const pi = po.playin[conf];
        field = [...pi.seeds.slice(0, 6), pi.games[0].winner, pi.games[2].winner];
      } else {
        field = po.seeds[conf].slice(0, Math.min(fmt.perConf, po.seeds[conf].length));
      }
      po.field[conf] = field;
      po.byes[conf] = field.slice(0, fmt.byes || 0);
    }
    po.rounds.push(firstRound());
    HL.News && HL.News.phase && HL.News.phase(L, 'playoffs');
  }

  function series(conf, a, b, seedOf, bestOf) {
    const [hi, lo] = seedOf(a) <= seedOf(b) ? [a, b] : [b, a];
    return { conf, hi, lo, hiSeed: seedOf(hi), loSeed: seedOf(lo), bestOf, wins: [0, 0], games: [], winner: null };
  }

  function firstRound() {
    const po = L.playoffs, fmt = po.format, out = [];
    for (const conf of HL.League.conferences()) {
      const field = po.field[conf], seedOf = id => field.indexOf(id) + 1;
      const playing = field.slice(fmt.byes || 0);
      if (field.length === 8 && !fmt.byes) {
        for (const [h, a] of [[0, 7], [3, 4], [2, 5], [1, 6]]) out.push(series(conf, field[h], field[a], seedOf, fmt.bestOf[0]));
      } else {
        for (let i = 0; i < Math.floor(playing.length / 2); i++) out.push(series(conf, playing[i], playing[playing.length - 1 - i], seedOf, fmt.bestOf[0]));
      }
    }
    return out;
  }

  function nextRound(round) {
    const po = L.playoffs, fmt = po.format;
    const rIdx = po.rounds.length; // index of the round being created
    const confs = HL.League.conferences();
    const champs = [];
    const out = [];
    for (const conf of confs) {
      const field = po.field[conf], seedOf = id => field.indexOf(id) + 1;
      const done = round.filter(s => s.conf === conf);
      if (!done.length) { const c = round.find(s => s.conf === 'Finals'); if (!c) champs.push(field[0]); continue; }
      let alive = done.map(s => s.winner);
      if (rIdx === 1) alive = alive.concat(po.byes[conf] || []);
      if (alive.length === 1) { champs.push(alive[0]); continue; }
      const bestOf = fmt.bestOf[Math.min(rIdx, fmt.bestOf.length - 2)];
      if (done.length === 4 && !fmt.byes && alive.length === 4) {
        // Fixed bracket: 1/8 vs 4/5, 3/6 vs 2/7.
        out.push(series(conf, done[0].winner, done[1].winner, seedOf, bestOf), series(conf, done[2].winner, done[3].winner, seedOf, bestOf));
      } else {
        alive.sort((a, b) => seedOf(a) - seedOf(b));
        for (let i = 0; i < Math.floor(alive.length / 2); i++) out.push(series(conf, alive[i], alive[alive.length - 1 - i], seedOf, bestOf));
      }
    }
    if (!out.length && champs.length === 2) {
      const rec = id => { const t = L.teams[id]; return t.w / Math.max(1, t.w + t.l); };
      const [hi, lo] = rec(champs[0]) >= rec(champs[1]) ? champs : [champs[1], champs[0]];
      out.push({ conf: 'Finals', hi, lo, hiSeed: null, loSeed: null, bestOf: fmt.bestOf[fmt.bestOf.length - 1], wins: [0, 0], games: [], winner: null });
    }
    return out;
  }

  function playSingle(homeId, awayId) {
    ensureHealthy(homeId); ensureHealthy(awayId);
    const res = HL.simGame(simTeamObj(L.teams[homeId]), simTeamObj(L.teams[awayId]), simRules(), { pbp: L.userTeamId === homeId || L.userTeamId === awayId });
    const g = { gid: 'P' + L.season + '-' + L.day + '-' + homeId + '-' + awayId, day: L.day, home: homeId, away: awayId, res: null, playoff: true };
    applyResult(g, res, true);
    return { winner: res.home.score > res.away.score ? homeId : awayId, g };
  }

  const HOME_PATTERN = { 7: [1, 1, 0, 0, 1, 0, 1], 5: [1, 1, 0, 0, 1], 3: [1, 0, 1] };

  HL.League.simPostseasonDay = function () {
    const po = L.playoffs;
    if (!po) return 0;
    if (L.phase === 'playin') {
      let played = 0;
      for (const conf of HL.League.conferences()) {
        const [g78, g910, fin] = po.playin[conf].games;
        if (g78.winner == null) {
          for (const g of [g78, g910]) { const r = playSingle(g.a, g.b); g.winner = r.winner; g.loser = r.winner === g.a ? g.b : g.a; }
          played++;
        } else if (fin.winner == null) {
          fin.a = g78.loser; fin.b = g910.winner;
          fin.winner = playSingle(fin.a, fin.b).winner;
          played++;
        }
      }
      L.day++;
      if (HL.League.conferences().every(c => po.playin[c].games[2].winner != null)) beginPlayoffs();
      return played;
    }
    if (L.phase === 'playoffs') {
      const round = po.rounds[po.rounds.length - 1];
      for (const s of round) {
        if (s.winner != null) continue;
        const need = Math.ceil(s.bestOf / 2);
        const gameNo = s.wins[0] + s.wins[1];
        const hiHome = (HOME_PATTERN[s.bestOf] || HOME_PATTERN[7])[gameNo];
        const r = playSingle(hiHome ? s.hi : s.lo, hiHome ? s.lo : s.hi);
        s.games.push(r.g.gid);
        if (r.winner === s.hi) s.wins[0]++; else s.wins[1]++;
        if (s.wins[0] === need) s.winner = s.hi;
        if (s.wins[1] === need) s.winner = s.lo;
        if (s.winner != null) HL.News && HL.News.seriesEnd && HL.News.seriesEnd(L, s, s.conf === 'Finals' ? 99 : po.rounds.length);
      }
      L.day += 2;
      if (round.every(s => s.winner != null)) {
        if (round.length === 1 && round[0].conf === 'Finals') {
          po.champion = round[0].winner;
          finishSeason();
        } else {
          const nr = nextRound(round);
          po.rounds.push(nr);
          L.day += nr.length === 1 && nr[0].conf === 'Finals' ? 4 : 2;
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
    const minG = Math.round(L.games * 0.6);
    const rows = Object.values(L.players).map(p => ({ p, s: perGame(p, season) })).filter(x => x.s && x.s.gp >= minG);
    const winPct = id => { const t = L.teams[id]; return t ? t.w / Math.max(1, t.w + t.l) : 0.3; };
    for (const x of rows) x.tid = x.p.teamId ?? x.p.stats[String(season)].teamId;
    const val = x => x.s.pts + x.s.reb * 0.9 + x.s.ast * 1.3 + x.s.stl * 1.5 + x.s.blk * 1.3 - x.s.tov + (x.s.ts - 0.56) * 60 + x.s.pm * 0.6;
    const mvpScore = x => val(x) + winPct(x.tid) * 30;
    const sorted = rows.slice().sort((a, b) => mvpScore(b) - mvpScore(a));
    const a = {};
    a.mvp = sorted[0] && sorted[0].p.id;
    a.mvpRace = sorted.slice(0, 5).map(x => x.p.id);
    const dScore = x => x.s.stl * 2.5 + x.s.blk * 3 + x.s.reb * 0.15 + (Math.max(x.p.attrs.perD, x.p.attrs.intD) * 2 + x.p.attrs.steal + x.p.attrs.block) / 9 + winPct(x.tid) * 8;
    if (season >= 1982) a.dpoy = rows.slice().sort((x, y) => dScore(y) - dScore(x))[0]?.p.id;
    a.roy = rows.filter(x => x.p.yearsPro === 0).sort((x, y) => val(y) - val(x))[0]?.p.id;
    if (season >= 1982) a.smoy = rows.filter(x => x.s.gs < x.s.gp * 0.4).sort((x, y) => val(y) - val(x))[0]?.p.id;
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
    const finals = po.rounds[po.rounds.length - 1][0];
    const champ = po.champion;
    const totals = {};
    for (const gid of finals.games) {
      const b = L.boxScores[gid];
      if (!b) continue;
      const side = b.home.teamId === champ ? b.home : b.away;
      for (const id in side.box) { const l = side.box[id]; totals[id] = (totals[id] || 0) + l.pts + (l.orb + l.drb) * 0.8 + l.ast; }
    }
    const a = L.awards[L.season];
    let bestV = -1;
    for (const id in totals) if (totals[id] > bestV) { bestV = totals[id]; a.fmvp = +id; }
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
  // Next season's real data (if any) must be loaded first: HL.History.load(String(L.season + 1)).
  HL.League.nextSeasonKey = () => String(L.season + 1);
  HL.League.usesRealHistory = () => L.settings.history === 'real' && !!(HL.HISTORY && HL.HISTORY.seasons.includes(String(L.season + 1)));

  HL.League.advanceToNextSeason = function () {
    if (L.phase !== 'offseason') return;
    const season = L.season, next = season + 1;
    const real = HL.League.usesRealHistory() && HL.HISTORY_SEASONS[String(next)];
    if (real) applyFranchiseChanges(HL.HISTORY_SEASONS[String(next)], next);
    runDraft(season, next, real);
    progressAndRetire(season, next, real);
    contractsAndFreeAgency(season, next);
    for (const t of L.teams) Object.assign(t, blankRecord());
    L.season = next;
    L.day = 0;
    L.phase = 'regular';
    L.playoffs = null;
    L.boxScores = {};
    L.rules = Object.assign(HL.eraRules(next), pickCustomRules(L.rules, season));
    if (real) { L.profile = real.profile || L.profile; L.games = Math.max(...real.teams.map(t => t[2] + t[3])); }
    L.schedule = buildSchedule(L.teams, next, L.games || 82);
    L.nextPid = HL.nextPlayerId();
    HL.News && HL.News.seasonStart && HL.News.seasonStart(L);
  };

  // Keep any rule the user changed away from the era default.
  function pickCustomRules(rules, season) {
    const base = HL.eraRules(season), out = {};
    for (const k in rules) if (rules[k] !== base[k]) out[k] = rules[k];
    return out;
  }

  // Relocations and expansions in real history (bref abbreviations).
  const MOVES = { TRI: 'MLH', MLH: 'STL', ROC: 'CIN', FTW: 'DET', MNL: 'LAL', PHW: 'SFW', CHP: 'CHZ', CHZ: 'BAL', SYR: 'PHI', STL: 'ATL', SFW: 'GSW', SDR: 'HOU', CIN: 'KCO', BAL: 'CAP', CAP: 'WSB', KCO: 'KCK', NYN: 'NJN', BUF: 'SDC', NOJ: 'UTA', SDC: 'LAC', KCK: 'SAC', WSB: 'WAS', VAN: 'MEM', CHH: 'NOH', NOH: 'NOK', NOK: 'NOH', SEA: 'OKC', NJN: 'BRK', CHA: 'CHO' };
  function applyFranchiseChanges(S, next) {
    const nextAbbrs = new Set(S.teams.map(t => t[0]));
    for (const t of L.teams) {
      if (nextAbbrs.has(t.bref)) {
        const row = S.teams.find(x => x[0] === t.bref);
        if (row && row[1] !== `${t.city} ${t.name}`) Object.assign(t, keepRecord(t, HL.History.teamMeta(row[0], row[1], next)));
        continue;
      }
      let to = MOVES[t.bref];
      if (t.bref === 'NOH' && next === 2013) to = 'NOP';
      if (to && nextAbbrs.has(to)) {
        const row = S.teams.find(x => x[0] === to);
        Object.assign(t, keepRecord(t, HL.History.teamMeta(row[0], row[1], next)));
        HL.News && HL.News.push && HL.News.push(L, { type: 'phase', importance: 3, teamIds: [t.id], headline: `Franchise on the move: the team will play as the ${t.city} ${t.name} in ${next}-${String(next + 1).slice(2)}` });
      }
    }
    // Expansion teams.
    const have = new Set(L.teams.map(t => t.bref));
    for (const row of S.teams) {
      if (have.has(row[0])) continue;
      const t = Object.assign(HL.History.teamMeta(row[0], row[1], next), { id: L.teams.length, strategy: HL.DEFAULT_STRATEGY(), real: { w: row[2], l: row[3] } }, blankRecord());
      L.teams.push(t);
      L.newTeams = (L.newTeams || []).concat(t.id);
      HL.News && HL.News.push && HL.News.push(L, { type: 'phase', importance: 3, teamIds: [t.id], headline: `The league expands: welcome the ${t.city} ${t.name}` });
    }
  }
  function keepRecord(t, meta) { const { id, strategy } = t; return Object.assign(meta, { id, strategy }); }

  function runDraft(season, next, real) {
    const order = draftOrder();
    let pool;
    if (real) {
      // The real draft class enters; teams pick by the consensus of the time (real pick order with noise).
      const H = HL.HISTORY;
      const rows = HL.History.seasonRows(String(next));
      const rookies = rows.filter(r => { const d = H.drafts[r.pid]; return d && d[0] === next; });
      pool = rookies.map(r => {
        const p = HL.History.makePlayer(r, next, null);
        p.realAttrs = Object.assign({}, p.attrs);
        p.consensus = H.drafts[r.pid][1] + R.normal(0, 2.5);
        p.yearsPro = 0;
        return p;
      });
      // Undrafted real newcomers join free agency.
      const inLeague = new Set(Object.values(L.players).map(p => p.hid).filter(Boolean));
      for (const r of rows) {
        // Newcomers who were not drafted this year (undrafted, or drafted earlier and stashed overseas).
        if (inLeague.has(r.pid) || rookies.includes(r)) continue;
        const p = HL.History.makePlayer(r, next, null);
        p.realAttrs = Object.assign({}, p.attrs);
        p.yearsPro = 0;
        L.players[p.id] = p;
        setContract(p, next);
      }
      pool.sort((a, b) => a.consensus - b.consensus);
    } else {
      pool = HL.Draft ? HL.Draft.generateClass(next, 70) : [];
      pool.sort((a, b) => (b.ovr * 0.6 + b.potential * 0.4) - (a.ovr * 0.6 + a.potential * 0.4));
    }
    const picks = [];
    const rounds = next >= 1989 ? 2 : 3;
    for (let round = 0; round < rounds; round++) {
      for (const tid of order) {
        const avail = pool.filter(p => p.teamId == null && !p.picked);
        if (!avail.length) break;
        const pick = real ? avail[0] : avail.sort((a, b) => (b.ovr * 0.6 + b.potential * 0.4) - (a.ovr * 0.6 + a.potential * 0.4) + R.normal(0, 1.5))[0];
        pick.picked = true;
        pick.teamId = tid;
        pick.draft = { year: next, round: round + 1, pick: picks.length + 1, teamId: tid };
        pick.contract = { amount: Math.round(Math.max(1.2, 12 - picks.length * 0.3) * HL.salaryScale(next) * 1000) / 1000, exp: next + (round === 0 ? 3 : 1) };
        picks.push(pick);
        L.players[pick.id] = pick;
      }
    }
    for (const p of pool) if (!p.picked) { p.teamId = null; L.players[p.id] = p; setContract(p, next); }
    L.lastDraft = { year: next, picks: picks.map(p => p.id) };
  }

  function progressAndRetire(season, next, real) {
    const diff = { rookie: 1.2, pro: 1, allstar: 0.9, hof: 0.8 }[L.settings.difficulty] || 1;
    const realRows = real ? new Map(HL.History.seasonRows(String(next)).map(r => [r.pid, r])) : null;
    for (const p of Object.values(L.players)) {
      if (p.retired && !(real && p.hid && realRows.has(p.hid) && p.retiredBecause === 'history')) continue;
      const isNew = p.draft && p.draft.year === next;
      if (isNew) continue;
      if (p.retired) {
        // A real player who sat out (e.g. a year away from the game) returns as a free agent.
        p.retired = null; p.retiredBecause = null; p.teamId = null;
      }
      p.age++;
      p.yearsPro = (p.yearsPro || 0) + 1;
      if (real && p.hid) {
        const row = realRows.get(p.hid);
        if (row) {
          // Follow the real trajectory, keeping half of how this timeline has diverged.
          const target = HL.History.unpack(row.attrs, HL.HISTORY.attrs);
          for (const k of HL.ATTR_KEYS) {
            const drift = (p.attrs[k] - (p.realAttrs ? p.realAttrs[k] : p.attrs[k])) * 0.5;
            p.attrs[k] = Math.round(HL.clamp(target[k] + drift + R.normal(0, 1.2), 25, 99));
          }
          p.realAttrs = target;
          p.ovr = HL.computeOvr(p.attrs, p.pos);
          p.realMpg = row.mpg;
          const t = HL.History.unpack(row.tend, HL.HISTORY.tends);
          Object.assign(p.tend, { usage: t.usage, three: t.three, mid: t.mid, drive: t.drive, post: t.post, passFirst: t.passFirst, drawFoul: t.drawFoul });
          continue;
        }
        // Not in the league next season in real life: retire (may come back if he reappears later).
        p.retired = season; p.teamId = null; p.retiredBecause = 'history';
        if (p.age >= 30) HL.News && HL.News.retire && HL.News.retire(L, p);
        continue;
      }
      const delta = HL.progressionDelta(p.age, p.potential - p.ovr, p.traits.workEthic, diff);
      HL.applyProgression(p, delta);
      p.potential = Math.max(p.ovr, p.potential - (p.age > 25 ? 2 : 0));
      if (R.chance(HL.clamp(retireChance(p), 0, 0.98))) {
        p.retired = season; p.teamId = null;
        if (p.age < 30) p.leftFor = R.pick(['EuroLeague', 'the Chinese Basketball Association', 'the Australian NBL', 'Japan\'s B.League', 'the Turkish BSL', 'the Spanish ACB']);
        else HL.News && HL.News.retire && HL.News.retire(L, p);
      }
    }
  }

  function contractsAndFreeAgency(season, next) {
    for (const p of Object.values(L.players)) if (p.hardship) { p.hardship = false; p.teamId = null; }
    const fa = [];
    for (const p of Object.values(L.players)) {
      if (p.retired) continue;
      if (p.teamId == null) { fa.push(p); continue; }
      if (p.contract.exp <= season) {
        const keep = p.ovr >= 74 ? R.chance(0.7) : R.chance(0.35);
        if (keep) setContract(p, next);
        else { p.teamId = null; fa.push(p); }
      }
    }
    fa.sort((a, b) => b.ovr - a.ovr);
    // Expansion teams pick first in free agency.
    const order = L.teams.slice().sort((a, b) => ((L.newTeams || []).includes(b.id) - (L.newTeams || []).includes(a.id)));
    for (const t of order) {
      const roster = () => HL.League.teamPlayers(t.id);
      while (roster().length < 13 && fa.length) {
        const p = fa.shift();
        p.teamId = t.id;
        setContract(p, next);
      }
      const r = roster().sort((a, b) => a.ovr - b.ovr);
      while (r.length > 15) { const cut = r.shift(); cut.teamId = null; }
    }
    L.newTeams = [];
  }

  // Good players keep playing into their late 30s; fringe veterans get pushed out earlier.
  function retireChance(p) {
    const a = p.age, o = p.ovr;
    if (a >= 42) return 0.95;
    if (o >= 82) return a >= 40 ? 0.55 : a >= 39 ? 0.3 : a >= 38 ? 0.15 : a >= 36 ? 0.04 : 0;
    if (o >= 74) return a >= 39 ? 0.75 : a >= 37 ? 0.4 : a >= 35 ? 0.18 : a >= 33 ? 0.05 : 0;
    if (o >= 66) return a >= 37 ? 0.7 : a >= 35 ? 0.35 : a >= 33 ? 0.12 : a >= 31 ? 0.03 : 0;
    return a >= 33 ? 0.8 : a >= 30 ? 0.4 : a >= 27 ? 0.15 : 0.03;
  }

  // Draft order by era: lottery since 1985 (current odds since 2019), worst-first before that.
  function draftOrder() {
    const all = HL.League.standings().slice().reverse();
    const nonPlayoff = all.filter(t => !playoffTeam(t.id));
    const playoff = all.filter(t => playoffTeam(t.id));
    if (L.season + 1 < 1985) return [...nonPlayoff, ...playoff].map(t => t.id);
    const lottery = nonPlayoff.map(t => t.id);
    const odds = L.season + 1 >= 2019 ? [140, 140, 140, 125, 105, 90, 75, 60, 45, 30, 20, 15, 10, 5] : [250, 199, 156, 119, 88, 63, 43, 28, 17, 11, 8, 7, 6, 5];
    const drawn = L.season + 1 >= 2019 ? 4 : L.season + 1 >= 1990 ? 3 : 1;
    const top = [];
    const pool = lottery.map((id, i) => ({ id, w: odds[i] || 5 }));
    for (let i = 0; i < Math.min(drawn, pool.length); i++) top.push(R.weighted(pool.filter(x => !top.includes(x.id)), x => x.w).id);
    return [...top, ...lottery.filter(id => !top.includes(id)), ...playoff.map(t => t.id)];
  }
  function playoffTeam(id) {
    const po = L.playoffs;
    if (!po || !po.field) return false;
    return Object.values(po.field).some(f => f.includes(id));
  }
})();
