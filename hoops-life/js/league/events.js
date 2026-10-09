// Event log: the authoritative facts behind stories (what happened, who, when, how public),
// detected from real simulation results, plus the league record book.
// Media reads from these events; nothing here is invented to fill a feed.
window.HL = window.HL || {};

HL.Events = (function () {
  // Real single-game regular-season records and when they were set: [season (start year), holder, value, club, date].
  // The book for a save holds the record that stood when the save began; later real records only happen if the sim repeats them.
  const REAL_RECORDS = {
    pts: [[1948, 'Joe Fulks', 63, 'Philadelphia Warriors', 'February 10, 1949'], [1959, 'Elgin Baylor', 64, 'Minneapolis Lakers', 'November 8, 1959'], [1960, 'Elgin Baylor', 71, 'Los Angeles Lakers', 'November 15, 1960'], [1961, 'Wilt Chamberlain', 78, 'Philadelphia Warriors', 'December 8, 1961'], [1961, 'Wilt Chamberlain', 100, 'Philadelphia Warriors', 'March 2, 1962']],
    reb: [[1959, 'Bill Russell', 51, 'Boston Celtics', 'February 5, 1960'], [1960, 'Wilt Chamberlain', 55, 'Philadelphia Warriors', 'November 24, 1960']],
    ast: [[1958, 'Bob Cousy', 28, 'Boston Celtics', 'February 27, 1959'], [1977, 'Kevin Porter', 29, 'New Jersey Nets', 'February 24, 1978'], [1990, 'Scott Skiles', 30, 'Orlando Magic', 'December 30, 1990']],
    stl: [[1976, 'Larry Kenon', 11, 'San Antonio Spurs', 'December 26, 1976']],
    blk: [[1973, 'Elmore Smith', 17, 'Los Angeles Lakers', 'October 28, 1973']],
    tpm: [[1995, 'Dennis Scott', 11, 'Orlando Magic', 'April 18, 1996'], [2002, 'Kobe Bryant', 12, 'Los Angeles Lakers', 'January 7, 2003'], [2016, 'Stephen Curry', 13, 'Golden State Warriors', 'November 7, 2016'], [2018, 'Klay Thompson', 14, 'Golden State Warriors', 'October 29, 2018']],
    ftm: [[1961, 'Wilt Chamberlain', 28, 'Philadelphia Warriors', 'March 2, 1962']],
  };
  const STAT_LABEL = { pts: 'points', reb: 'rebounds', ast: 'assists', stl: 'steals', blk: 'blocks', tpm: 'three-pointers', ftm: 'free throws' };
  // Stats the league did not keep before these seasons (no record is announced before them).
  const KEPT_SINCE = { reb: 1950, stl: 1973, blk: 1973, tpm: 1979 };
  const statOf = (b, k) => k === 'reb' ? b.orb + b.drb : b[k];

  function log(L, key, o = {}) {
    L.events = L.events || [];
    const ev = {
      id: (L.eventSeq = (L.eventSeq || 0) + 1), key,
      season: L.season, day: L.day, phase: L.phase, era: HL.mediaEra ? HL.mediaEra(L) : 'modern',
      source: o.source || 'official', visibility: o.visibility || 'public',
      players: o.players || [], teams: o.teams || [], data: o.data || {},
      // What things looked like at the time, so later trades or rebrands don't rewrite old stories.
      snap: {
        teams: Object.fromEntries((o.teams || []).map(id => { const t = L.teams[id]; return [id, { name: t.name, city: t.city, abbr: t.abbr, color: t.color, color2: t.color2 }]; })),
        players: Object.fromEntries((o.players || []).map(id => { const p = L.players[id]; return [id, p ? { name: p.name, teamId: p.teamId, pos: p.pos } : null]; })),
      },
    };
    L.events.push(ev);
    if (L.events.length > 5000) L.events.splice(0, L.events.length - 5000);
    return ev;
  }

  function recordBook(L) {
    if (L.records) return L.records;
    const start = L.startSeason || L.season;
    const league = {};
    for (const k in REAL_RECORDS) {
      const stood = REAL_RECORDS[k].filter(r => r[0] < start).pop();
      league[k] = stood ? { v: stood[2], name: stood[1], team: stood[3], when: stood[4], season: stood[0], known: true, history: [] } : null;
    }
    L.records = { since: start, league, franchise: {} };
    return L.records;
  }

  // ---------- detection from a finished game ----------
  function fromGame(L, g, res, playoffs) {
    const out = [];
    const book = recordBook(L);
    const E = res.events || {};
    const sides = [['home', res.home, res.away], ['away', res.away, res.home]];
    const label = id => L.players[id];
    for (const [side, me, them] of sides) {
      const tid = me.teamId, oid = them.teamId;
      let teamTov = 0;
      for (const pid in me.box) {
        const b = me.box[pid], p = label(pid);
        teamTov += b.tov;
        if (!p) continue;
        const reb = b.orb + b.drb;
        const base = { players: [p.id], teams: [tid, oid], data: { gid: g.gid, playoffs: !!playoffs, line: { pts: b.pts, reb, ast: b.ast, stl: b.stl, blk: b.blk, tov: b.tov, fgm: b.fgm, fga: b.fga, min: b.min } } };
        // League single-game records (regular season, stats the league kept that season).
        if (!playoffs) {
          for (const k in REAL_RECORDS) {
            if (KEPT_SINCE[k] && L.season < KEPT_SINCE[k]) continue;
            if (k === 'tpm' && !(L.rules && L.rules.threePoint)) continue;
            const v = statOf(b, k), rec = book.league[k];
            if (!rec || v > rec.v) {
              const prev = rec ? { v: rec.v, name: rec.name, team: rec.team, when: rec.when, season: rec.season } : null;
              book.league[k] = { v, name: p.name, pid: p.id, team: `${L.teams[tid].city} ${L.teams[tid].name}`, when: null, season: L.season, day: L.day, known: !!(rec && rec.known), history: [...(rec ? rec.history || [] : []), ...(prev ? [prev] : [])].slice(-6) };
              // Only a break of a known record is news; an unknown baseline just starts this league's book.
              if (rec && rec.known && v > 0) out.push(log(L, 'record.single_game', { ...base, data: { ...base.data, stat: k, value: v, prev } }));
            } else if (rec && rec.known && v === rec.v && v > 0) {
              out.push(log(L, 'record.single_game_tie', { ...base, data: { ...base.data, stat: k, value: v, prev: { v: rec.v, name: rec.name, team: rec.team, when: rec.when, season: rec.season } } }));
            }
          }
          // Franchise minutes record (tracked within this league).
          const fr = book.franchise[tid] = book.franchise[tid] || {};
          if (!fr.min || b.min > fr.min.v) {
            const had = fr.min;
            fr.min = { v: b.min, name: p.name, pid: p.id, season: L.season };
            if (had && res.ot >= 6) out.push(log(L, 'record.minutes_sixth_overtime', { ...base, data: { ...base.data, min: Math.round(b.min), ot: res.ot, prev: had } }));
          }
        }
        const five = [b.pts, reb, b.ast, b.stl, b.blk];
        if (five.every(v => v >= 5)) out.push(log(L, 'record.five_by_five', base));
        if (five.filter(v => v >= 10).length >= 4) out.push(log(L, 'record.quadruple_double', base));
        if (b.fga >= 10 && b.fgm === b.fga) out.push(log(L, 'record.perfect_high_volume', base));
        if (b.ast >= 20 && b.tov === 0) out.push(log(L, 'record.assist_turnover_clean', base));
        if ((E.charges || {})[pid] >= 3) out.push(log(L, 'court.charge_triple', { ...base, data: { ...base.data, charges: E.charges[pid] } }));
      }
      if (teamTov === 0 && Object.keys(me.box).length) out.push(log(L, 'record.team_zero_turnovers', { teams: [tid, oid], data: { gid: g.gid, playoffs: !!playoffs } }));
      // A full regulation quarter without allowing a field goal.
      const theirQ = (E.qfg || {})[side === 'home' ? 'away' : 'home'] || [];
      theirQ.slice(0, 4).forEach((n, q) => { if (n === 0) out.push(log(L, 'court.no_field_goals_quarter', { teams: [tid, oid], data: { gid: g.gid, quarter: q + 1, playoffs: !!playoffs } })); });
    }
    for (const f of E.four || []) {
      const me = f.side === 'home' ? res.home : res.away, them = f.side === 'home' ? res.away : res.home;
      if (L.players[f.pid]) out.push(log(L, f.total >= 5 ? 'court.five_point_play' : 'court.four_point_play', { players: [f.pid], teams: [me.teamId, them.teamId], data: { gid: g.gid, period: f.period, playoffs: !!playoffs } }));
    }
    const winSide = res.home.score > res.away.score ? 'home' : 'away';
    const W = winSide === 'home' ? res.home : res.away, Lo = winSide === 'home' ? res.away : res.home;
    const ga = E.goAhead;
    if (ga && ga.side === winSide && ga.period === E.periods && ga.clock <= 5 && L.players[ga.pid]) {
      out.push(log(L, ga.clock <= 1 ? 'game.buzzer_beater' : 'game.game_winner', { players: [ga.pid], teams: [W.teamId, Lo.teamId], data: { gid: g.gid, clock: ga.clock, period: ga.period, shot: ga.label, value: ga.value, putback: ga.putback, assist: ga.assist, before: ga.before, ws: W.score, ls: Lo.score, ot: res.ot, playoffs: !!playoffs } }));
    }
    const deficit = (E.trail || {})[winSide] || 0;
    if (deficit >= 20) out.push(log(L, 'game.comeback', { teams: [W.teamId, Lo.teamId], data: { gid: g.gid, deficit, ws: W.score, ls: Lo.score, playoffs: !!playoffs } }));
    return out;
  }

  const forPlayer = (L, pid) => (L.events || []).filter(e => e.players.includes(pid));
  const forTeam = (L, tid) => (L.events || []).filter(e => e.teams.includes(tid));

  return { log, fromGame, recordBook, forPlayer, forTeam, REAL_RECORDS, STAT_LABEL };
})();
