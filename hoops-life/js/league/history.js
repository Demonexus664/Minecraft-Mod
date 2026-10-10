// Real NBA history (built from Basketball-Reference data by tools/build-history.py).
// HL.HISTORY (index) is always loaded; individual seasons load on demand.
window.HL = window.HL || {};

HL.History = (function () {
  const H = () => HL.HISTORY;
  HL.HISTORY_SEASONS = HL.HISTORY_SEASONS || {};

  // Basketball-Reference abbreviation -> current franchise (for logos/colors) when it is the same club.
  const MODERN = { ATL: 'ATL', BOS: 'BOS', BRK: 'BKN', CHO: 'CHA', CHI: 'CHI', CLE: 'CLE', DAL: 'DAL', DEN: 'DEN', DET: 'DET', GSW: 'GSW', HOU: 'HOU', IND: 'IND', LAC: 'LAC', LAL: 'LAL', MEM: 'MEM', MIA: 'MIA', MIL: 'MIL', MIN: 'MIN', NOP: 'NOP', NYK: 'NYK', OKC: 'OKC', ORL: 'ORL', PHI: 'PHI', PHO: 'PHX', POR: 'POR', SAC: 'SAC', SAS: 'SAS', TOR: 'TOR', UTA: 'UTA', WAS: 'WAS' };
  // Historical clubs: colors and (approximate) conference. Unknown clubs fall back to geography.
  const HIST = {
    SEA: ['#00653A', '#FFC200', 'West'], NJN: ['#002A60', '#CD1041', 'East'], NYN: ['#002A60', '#CD1041', 'East'], NOH: ['#00778B', '#280071', 'West'], NOK: ['#00778B', '#280071', 'West'],
    CHH: ['#00778B', '#280071', 'East'], CHA: ['#F26532', '#2C5234', 'East'], VAN: ['#00B2A9', '#E43C40', 'West'], WSB: ['#002B5C', '#E31837', 'East'], CAP: ['#002B5C', '#E31837', 'East'],
    BAL: ['#002B5C', '#E31837', 'East'], KCK: ['#5A2D81', '#63727A', 'West'], KCO: ['#5A2D81', '#63727A', 'West'], CIN: ['#5A2D81', '#63727A', 'East'], ROC: ['#5A2D81', '#63727A', 'West'],
    SDC: ['#C8102E', '#1D428A', 'West'], BUF: ['#002B5C', '#FDB927', 'East'], SDR: ['#CE1141', '#FDB927', 'West'], SFW: ['#1D428A', '#FFC72C', 'West'], PHW: ['#1D428A', '#FFC72C', 'East'],
    NOJ: ['#002B5C', '#F9A01B', 'East'], MNL: ['#552583', '#FDB927', 'West'], STL: ['#E03A3E', '#C1D32F', 'West'], MLH: ['#E03A3E', '#C1D32F', 'West'], TRI: ['#E03A3E', '#C1D32F', 'West'],
    FTW: ['#C8102E', '#1D42BA', 'West'], SYR: ['#006BB6', '#ED174C', 'East'], CHP: ['#002B5C', '#E31837', 'West'], CHZ: ['#002B5C', '#E31837', 'West'], BLB: ['#3a3a3a', '#c9a227', 'East'],
    INO: ['#00205B', '#FFC633', 'West'], AND: ['#7A1E2B', '#d6b06b', 'West'], WAT: ['#1F4E79', '#c0c0c0', 'West'], SHE: ['#13294B', '#E87722', 'West'], DNN: ['#5A2D81', '#ffd23f', 'West'],
    CHS: ['#B22222', '#ffffff', 'West'], WSC: ['#002B5C', '#ffffff', 'East'], PRO: ['#003A70', '#ffffff', 'East'], STB: ['#C8102E', '#003A70', 'West'], TRH: ['#003A70', '#ffffff', 'East'],
    DTF: ['#C8102E', '#1D42BA', 'West'], PIT: ['#000000', '#FFB612', 'East'], CLR: ['#6F263D', '#FFB81C', 'East'], INJ: ['#002D62', '#FDBB30', 'West'], BOM: ['#C8102E', '#002B5C', 'East'],
  };
  // Franchise moves between conferences (approximate, by season start year).
  function conference(abbr, season) {
    const cur = HL.TEAMS.find(t => t.abbr === MODERN[abbr]);
    if (season < 1970) {
      // Pre-merger divisions (East/West).
      const west = ['LAL', 'MNL', 'STL', 'ATL', 'MLH', 'TRI', 'FTW', 'DET', 'SFW', 'CHI', 'CHP', 'CHZ', 'SEA', 'SDR', 'PHO', 'INO', 'AND', 'WAT', 'SHE', 'DNN', 'CHS', 'STB', 'ROC'];
      if (abbr === 'MIL' && season < 1969) return 'East';
      return west.includes(abbr) ? 'West' : 'East';
    }
    if (abbr === 'MIL' || abbr === 'CHI') return season < 1980 ? 'West' : 'East';
    if (abbr === 'DET') return season < 1978 ? 'West' : 'East';
    if (abbr === 'HOU') return season >= 1972 && season < 1980 ? 'East' : 'West';
    if (abbr === 'SAS') return season < 1980 ? 'East' : 'West';
    if (abbr === 'NOH') return season < 2004 ? 'East' : 'West';
    if (abbr === 'ATL') return 'East';
    if (abbr === 'NOJ') return 'West';
    if (cur) return cur.conf;
    return (HIST[abbr] || [])[2] || 'East';
  }

  function teamName(full) {
    // "Los Angeles Lakers" -> city/name (last word, or last two for e.g. "Trail Blazers").
    const two = ['Trail Blazers'];
    for (const t of two) if (full.endsWith(t)) return [full.slice(0, -t.length).trim(), t];
    const parts = full.split(' ');
    return [parts.slice(0, -1).join(' '), parts[parts.length - 1]];
  }

  function teamMeta(abbr, full, season) {
    const mod = MODERN[abbr] ? HL.TEAMS.find(t => t.abbr === MODERN[abbr]) : null;
    const [city, name] = teamName(full);
    const h = HIST[abbr];
    // The modern logo only makes sense if the club still has that name.
    const sameClub = mod && mod.name === name;
    return {
      abbr: sameClub ? mod.abbr : abbr, bref: abbr, city, name,
      espn: sameClub ? mod.espn : null,
      color: mod ? mod.color : h ? h[0] : '#4a4f59', color2: mod ? mod.color2 : h ? h[1] : '#9aa0aa',
      conf: conference(abbr, season), div: mod && season >= 2004 ? mod.div : null,
      market: mod ? mod.market : 5, arena: mod && season >= 2023 ? mod.arena : '',
    };
  }

  function unpack(str, keys) {
    const o = {};
    keys.forEach((k, i) => { o[k] = +str.substr(i * 2, 2); });
    return o;
  }

  // Avoid rebuilding thousands of rows on every card search or award comparison.
  const rowCache = new Map();
  function seasonRows(key) {
    const S = HL.HISTORY_SEASONS[key];
    if (!S) return null;
    if (rowCache.has(key)) return rowCache.get(key);
    const F = H().seasonFields;
    const rows = S.players.map(r => { const o = {}; F.forEach((f, i) => { o[f] = r[i]; }); return o; });
    rowCache.set(key, rows);
    return rows;
  }

  // Load a season file (browser: script tag; node tests preload them).
  function load(key) {
    if (HL.HISTORY_SEASONS[key]) return Promise.resolve(HL.HISTORY_SEASONS[key]);
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = `data/history/seasons/${key}.js`;
      s.onload = () => res(HL.HISTORY_SEASONS[key]);
      s.onerror = () => rej(new Error('Missing season data ' + key));
      document.head.appendChild(s);
    });
  }

  // Turn a historical player-season into a game player.
  function makePlayer(row, seasonStart, teamId) {
    const bio = H().players[row.pid];
    const [name, nbaId, , height, weight, born, hof, college] = bio;
    // A new roster player gets an independent mutable copy. The cached historical
    // scouting record is shared across Skill Draft, 82-0 and Franchise, and must
    // never be overwritten by training, injury changes, or legendary boosts.
    const attrs = { ...HL.historicalAttributes(row) };
    const t = unpack(row.tend, H().tends);
    const p = {
      id: HL.nextPlayerId(), hid: row.pid,
      name, pos: row.pos, age: row.age, height, weight, wingspan: height + 3, arch: null,
      born: born || seasonStart - row.age, real: true, nbaId, hof: !!hof, college,
      attrs, ovr: HL.historicalSeasonOvr(row),
      traits: null, teamId, morale: 70, injury: null, contract: null, stats: {}, careerAwards: [], draft: null,
    };
    p.tend = HL.completeTendencies({ ...p, tend: { usage: t.usage, three: t.three, mid: t.mid, drive: t.drive, post: t.post, passFirst: t.passFirst, gamble: t.gamble, crash: t.crash, effort: 75, foulAggr: t.foulAggr, drawFoul: t.drawFoul } });
    const R = HL.RNG;
    p.traits = {
      workEthic: HL.clamp(Math.round(R.normal(60, 14)), 10, 99),
      ego: HL.clamp(Math.round(R.normal(50, 18) + (p.ovr - 75) * 0.8), 5, 99),
      clutch: HL.clamp(Math.round(R.normal(55, 14) + (p.ovr - 75) * 0.5), 10, 99),
      loyalty: HL.clamp(Math.round(R.normal(50, 18)), 5, 99),
      greed: HL.clamp(Math.round(R.normal(50, 18)), 5, 99),
      competitive: HL.clamp(Math.round(R.normal(60, 15)), 10, 99),
      leadership: HL.clamp(Math.round(R.normal(50, 18) + (row.age - 25) * 1.5), 5, 99),
      temperament: HL.clamp(Math.round(R.normal(55, 18)), 5, 99),
    };
    p.potential = Math.max(p.ovr, Math.round(p.ovr + Math.max(0, 24 - row.age) * R.range(1, 2.6)));
    p.real_season = { g: row.g, pts: row.pts, trb: row.trb, ast: row.ast, ovr: row.ovr };
    p.realMpg = row.mpg;
    // Draft year N = first season N-(N+1).
    const d = H().drafts[row.pid];
    if (d) p.draft = { year: d[0], pick: d[1], team: d[2] };
    p.yearsPro = d ? Math.max(0, seasonStart - d[0]) : Math.max(0, row.age - 22);
    return p;
  }

  return { load, seasonRows, makePlayer, teamMeta, conference, MODERN, unpack };
})();
