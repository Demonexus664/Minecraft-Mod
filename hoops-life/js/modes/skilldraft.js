// Skill Draft Career: build one player out of real players' skills, simulate the whole career
// in the real league, and get a verdict measured against every real NBA career (legacy score).
window.HL = window.HL || {};

HL.SkillDraft = (function () {
  const U = HL.UI, esc = U.esc, R = HL.RNG, FX = HL.FX;
  const C = () => HL.Challenge;
  const CATS = [
    ['inside', 'Inside scoring', ['close', 'layup', 'dunk', 'post']],
    ['mid', 'Mid-range', ['mid']],
    ['three', 'Three-point', ['three']],
    ['ft', 'Free throws', ['ft']],
    ['pass', 'Playmaking', ['pass']],
    ['handle', 'Ball handling', ['handle']],
    ['perD', 'Perimeter defense', ['perD', 'steal']],
    ['intD', 'Rim protection', ['intD', 'block']],
    ['reb', 'Rebounding', ['oreb', 'dreb']],
    ['ath', 'Athleticism', ['speed', 'vert', 'str']],
    ['iq', 'Basketball IQ', ['iq']],
    ['motor', 'Durability & motor', ['dur', 'stam']],
    ['body', 'Body (height & frame)', []],
  ];
  const catOf = id => CATS.find(c => c[0] === id);
  const avgOf = (attrs, keys) => keys.length ? Math.round(keys.reduce((s, k) => s + attrs[k], 0) / keys.length) : 0;
  let st = null;

  // Debut: a real draft year. Random debuts leave room for a full career inside the real data.
  const randomDebut = () => R.int(1956, HL.LATEST_SEASON - 14);
  function newRun(mode, debut) {
    st = { mode, debut: debut || randomDebut(), picks: {}, team: null, decade: null, cat: null, hand: [], phase: 'spin', skips: { team: 1, era: 1, stat: 1 }, career: null, name: 'Your Player' };
  }
  const remaining = () => CATS.filter(c => !st.picks[c[0]]).map(c => c[0]);
  const decades = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];

  const SHORT = { inside: 'INSIDE', mid: 'MID', three: '3PT', ft: 'FT', pass: 'PASS', handle: 'HANDLE', perD: 'PER D', intD: 'RIM D', reb: 'REB', ath: 'ATH', iq: 'IQ', motor: 'MOTOR', body: 'BODY' };
  // BODY measures frame independently from skill or overall.
  const skillValue = (c, cat) => C().skillValue(c, cat);

  // Spin the three reels (team, decade, skill), deal a hand of five from that club and decade, flip it.
  async function spin(what = 'all') {
    st.phase = 'reeling';
    if (what === 'all' || what === 'stat') st.cat = R.pick(remaining().filter(c => c !== st.cat || remaining().length === 1));
    if (what === 'all' || what === 'era') st.decade = R.pick(decades.filter(d => d !== st.decade));
    await C().loadDecade(st.decade);
    const fr = C().franchisesIn(st.decade);
    if (what === 'all' || what === 'team' || !fr.includes(st.team)) st.team = R.pick(fr.filter(t => t !== st.team || fr.length === 1));
    // Use the same best-five team/decade hand as 82-0.
    st.hand = C().dealSkillHand(st.team, st.decade, catOf(st.cat));
    render();
    const host = document.querySelector('#reels');
    const teams = HL.TEAMS.map(t => t.abbr);
    const decs = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];
    if (host) await FX.reels(host, [
      { label: 'Franchise', items: teams.map(a => `<div>${U.logo(tm(a), 62)}</div>`), final: teams.indexOf(st.team) },
      { label: 'Decade', items: decs.map(d => `<div>${d}s</div>`), final: decs.indexOf(st.decade) },
      { label: 'Skill', items: CATS.map(c => `<div class="txt">${esc(c[1])}</div>`), final: CATS.findIndex(c => c[0] === st.cat) },
    ], { colors: [U.teamAccent(tm(st.team)).c, '#ffd84f', '#fff'] });
    st.phase = 'hand';
    render(true);
  }
  function take(i) {
    const c = st.hand[i];
    if (!c || st.phase !== 'hand') return;
    const cat = catOf(st.cat);
    st.picks[st.cat] = c;
    const v = skillValue(c, cat);
    FX.sfx.pop(FX.tierIndex(v));
    const id = st.cat;
    st.hand = []; st.cat = null;
    st.phase = remaining().length ? 'spin' : 'built';
    render();
    const tile = document.querySelector(`.tile[data-cat="${id}"]`);
    if (tile) { tile.classList.add('pop'); FX.burst(tile, FX.tierOf(v).colors.concat('#fff'), FX.tierIndex(v) >= 3 ? 30 : 12, 0.6); }
    if (!remaining().length) setTimeout(() => { const prime = buildPrime(); const ovr = HL.computeOvr(prime.attrs, prime.pos); FX.banner(`${ovr} OVR`, `Your ${prime.pos} is built: ${HL.fmtHeight(prime.height)}, ${prime.weight} lb.`, { tier: ovr >= 95 ? 4 : ovr >= 90 ? 3 : ovr >= 82 ? 2 : 1, kicker: 'Ceiling', ms: 2200 }); }, 350);
  }

  function rowAttrs(row) { return HL.History.unpack(row.attrs, HL.HISTORY.attrs); }

  // ---------- build the player from the picks ----------
  function buildPrime() {
    const attrs = {};
    for (const [id, , keys] of CATS) {
      const pk = st.picks[id];
      if (!pk || !keys.length) continue;
      const a = rowAttrs(pk.row);
      for (const k of keys) attrs[k] = a[k];
    }
    const body = st.picks.body;
    const bio = HL.HISTORY.players[body.row.pid];
    const height = bio[3], weight = bio[4];
    // Position: whichever spot this body could play where the skill set rates best.
    const fits = { PG: [0, 77], SG: [74, 79], SF: [77, 81], PF: [79, 83], C: [80, 99] };
    const open = Object.keys(fits).filter(k => height >= fits[k][0] && height <= fits[k][1]);
    const pos = (open.length ? open : [height < 74 ? 'PG' : 'C']).sort((a, b) => HL.computeOvr(attrs, b) - HL.computeOvr(attrs, a))[0];
    return { attrs, height, weight, pos };
  }

  // ---------- career engine ----------
  // Every season is played in that year's real league (real rosters, schedule length and playoff
  // format). Seasons past the latest data replay the latest league. The career is a sequence of
  // seasons and offseason decisions, so it can be played one season at a time or simmed to the end.
  const ME_ID = 999999;
  const LIN = () => C().LINEAGE;
  const fr = t => LIN()[t.bref] || t.bref;
  const yrLabel = y => `${y}-${String(y + 1).slice(2)}`;
  const fullName = t => `${t.city} ${t.name}`;
  const metaOf = t => ({ abbr: t.abbr, bref: t.bref, city: t.city, name: t.name, color: t.color, color2: t.color2, espn: t.espn });
  const nameOf = pid => (HL.HISTORY.players[pid] || [pid])[0];
  const awardIndex = {};
  function realAwards(yr) {
    if (!awardIndex.built) {
      for (const [pid, list] of Object.entries(HL.HISTORY.awards)) for (const [y, a] of list) ((awardIndex[y] = awardIndex[y] || {})[a] = awardIndex[y][a] || []).push(pid);
      awardIndex.built = true;
    }
    return awardIndex[yr] || {};
  }
  // Voting value, calibrated on 1955-2025: ranking real seasons by it recovers 78% of All-NBA picks and 66% of MVPs.
  const voteValue = (ppg, ovr, rpg, apg, g, games) => { const avail = Math.min(1, g / (games * 0.85)); return (ppg * 0.6 + (ovr - 75) + rpg * 0.25 + apg * 0.35) * avail * avail; };
  const defValue = (a, g, games) => (Math.max(a.perD, a.intD) * 0.6 + (a.steal + a.block) * 0.2) * Math.min(1, g / (games * 0.85));
  const blankTotals = () => ({ g: 0, gs: 0, min: 0, pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, tov: 0, fgm: 0, fga: 0, tpm: 0, tpa: 0, ftm: 0, fta: 0 });
  function addLine(tot, l) {
    tot.g += l.gp || 0; tot.gs += l.gs || 0; tot.min += l.min || 0; tot.pts += l.pts; tot.reb += l.orb + l.drb; tot.ast += l.ast;
    tot.stl += l.stl; tot.blk += l.blk; tot.tov += l.tov; tot.fgm += l.fgm; tot.fga += l.fga; tot.tpm += l.tpm; tot.tpa += l.tpa; tot.ftm += l.ftm; tot.fta += l.fta;
  }

  // One league per season, reused while the career is on that season.
  let cache = null;
  async function leagueFor(yr) {
    if (cache && cache.yr === yr) { HL.League.set(cache.L); return cache.L; }
    const key = String(Math.min(yr, HL.LATEST_SEASON));
    await HL.History.load(key);
    const L = HL.League.createFromSeason({ seasonKey: key, seed: R.int(1, 1e9) });
    cache = { yr, L };
    return L;
  }
  const realWp = t => t.real.w / Math.max(1, t.real.w + t.real.l);
  const byRecord = L => L.teams.slice().sort((a, b) => realWp(a) - realWp(b));

  // Ratings by age: physical tools arrive early, skills grow until ~26, decline after 29.
  // Work ethic ("reach") decides how close he gets to the prime he was built for.
  // The acquired attributes are reachable at prime. Work ethic controls speed to prime, not a secret ceiling.
  function ratingsAt(c, age) {
    const out = {};
    const yearsToPrime = HL.clamp(7-(c.me.traits.workEthic-50)/22,5,9);
    const growth = HL.clamp((age-19)/yearsToPrime,0,1);
    const fullPrime = age >= 28 && age <= 29;
    const decline = age<=29 ? 0 : (age-29)*(age>=33 ? 2.6 : 1.6);
    for (const k of HL.ATTR_KEYS) {
      const target = c.prime.attrs[k];
      if (fullPrime) {out[k]=target;continue;}
      const gap = ['speed','vert','str','dur','stam'].includes(k)?4:13;
      const fade = ['speed','vert','stam'].includes(k)?1.5:['iq','ft','pass'].includes(k)?0.3:1;
      const variation = age<28?(c.noise?.[k]||0)*(1-growth):0;
      out[k] = Math.round(HL.clamp(target-gap*(1-growth)-decline*fade+variation,25,99));
    }
    return out;
  }
  function setAge(c, age) {
    const me = c.me;
    me.age = age; me.attrs = ratingsAt(c, age); me.ovr = HL.computeOvr(me.attrs, me.pos); me.tend = HL.defaultTendencies(me);
  }

  function newCareer() {
    const prime = buildPrime();
    const me = HL.createPlayer({ name: st.name, pos: prime.pos, age: 19, height: prime.height, ovr: 60, arch: 'twoway', real: false, season: st.debut });
    me.id = ME_ID; me.weight = prime.weight; me.realMpg = null;
    return {
      me, prime, primeOvr: HL.computeOvr(prime.attrs, prime.pos),
      noise: Object.fromEntries(HL.ATTR_KEYS.map(k => [k, R.normal(0, 1.6)])),
      debut: st.debut, age: 19, yr: st.debut, franchise: null, teamMeta: null, contract: null, minors: false,
      seasons: [], awards: [], rings: 0, teams: [], pick: null, altered: [], earnings: 0, log: [], lastRecords: {},
      totals: blankTotals(), ptotals: blankTotals(), highs: {}, tradeRequests: 0,
      pending: null, done: false, end: null, legacy: null,
    };
  }

  const minSalary = yr => 1.2 * HL.salaryScale(yr);
  const rookieScale = (pick, n, yr) => (pick <= n ? 12.5 * Math.pow(0.95, pick - 1) : 1.3) * HL.salaryScale(yr);
  const marketValue = (ovr, age, yr) => Math.max(HL.estimateSalary(ovr, age), 1.2) * HL.salaryScale(yr);

  function join(c, team, text, contract) {
    if (fr(team) !== c.franchise) c.teams.push(fullName(team));
    c.franchise = fr(team); c.teamMeta = metaOf(team); c.contract = contract; c.minors = false;
    c.log.push({ yr: c.yr, text });
  }

  async function draft(c) {
    const L = await leagueFor(c.yr);
    setAge(c, 19);
    const n = L.teams.length, order = byRecord(L);
    const slot = Math.max(1, Math.round(31 - (c.me.ovr - 58) * 1.6 + R.normal(0, 3)));
    c.pick = slot <= n * 2 ? slot : null; // two rounds; anyone lower goes undrafted
    if (c.pick) {
      const team = order[(c.pick - 1) % n];
      join(c, team, `Drafted #${c.pick} overall by the ${fullName(team)}`, { amount: rookieScale(c.pick, n, c.yr), through: c.yr + (c.pick <= n ? 3 : 1), kind: c.pick <= n ? 'Rookie scale' : 'Second-round deal' });
    } else if (c.me.ovr >= 62) {
      const team = R.pick(order.slice(0, Math.ceil(n / 2)));
      join(c, team, `Went undrafted, then signed by the ${fullName(team)}`, { amount: minSalary(c.yr), through: c.yr, kind: 'Minimum' });
    } else {
      c.minors = true;
      c.log.push({ yr: c.yr, text: 'Went undrafted and headed to the minor leagues' });
    }
    c.draftClass = draftClass(c.yr);
    c.stage = 'draft';
  }
  // The real draft class he joined, for the draft-night screen.
  function draftClass(yr) {
    const rows = [];
    for (const [pid, d] of Object.entries(HL.HISTORY.drafts || {})) if (d[0] === yr && d[1]) rows.push({ pid, pick: d[1], club: d[2], college: d[3], name: nameOf(pid), nbaId: (HL.HISTORY.players[pid] || [])[1] });
    return rows.sort((a, b) => a.pick - b.pick).slice(0, 10);
  }

  async function playSeason(c) {
    const L = await leagueFor(c.yr);
    const me = c.me;
    if (c.minors) {
      c.seasons.push({ age: c.age, yr: c.yr, minors: true, ovr: me.ovr, g: 0, ppg: 0, rpg: 0, apg: 0, awards: [], altered: [] });
      return;
    }
    let team = L.teams.find(t => fr(t) === c.franchise);
    if (!team) { team = R.pick(L.teams); join(c, team, `Joined the ${fullName(team)}`, c.contract); }
    // Major injury risk grows with age and poor durability.
    let missed = 0, injury = null;
    if (R.chance(0.05 + Math.max(0, 70 - me.attrs.dur) * 0.004 + Math.max(0, c.age - 30) * 0.015)) {
      const inj = HL.rollInjury(1.2);
      missed = Math.min(L.games, inj.games);
      if (inj.lasting) for (const k in inj.lasting) c.prime.attrs[k] = HL.clamp(c.prime.attrs[k] + inj.lasting[k], 25, 99);
      if (missed > 0) injury = { name: inj.name, games: missed, lasting: !!inj.lasting };
    }
    const res = simSeason(L, team, me, missed);
    const s = { age: c.age, yr: c.yr, key: String(L.season), team: metaOf(team), ovr: me.ovr, salary: c.contract ? c.contract.amount : 0, injury, ...res };
    c.seasons.push(s);
    addLine(c.totals, res.line); addLine(c.ptotals, res.pline);
    c.earnings += s.salary;
    for (const a of res.awards) c.awards.push({ season: c.yr, award: a.award || a, over: a.over });
    if (injury && injury.games >= 20) c.awards.push({ season: c.yr, award: `Injury: ${injury.name}` });
    for (const a of res.altered) c.altered.push({ season: c.yr, text: a });
    if (res.champion) c.rings++;
    for (const k of ['pts', 'reb', 'ast', 'stl', 'blk']) {
      const h = res.highs[k];
      if (h && (!c.highs[k] || h.v > c.highs[k].v)) c.highs[k] = { ...h, yr: c.yr };
    }
    // Last season's records for the offseason screen (his team's is the simulated one).
    c.lastRecords = {};
    for (const t of L.teams) c.lastRecords[fr(t)] = `${t.real.w}-${t.real.l}`;
    c.lastRecords[fr(team)] = `${res.w}-${res.l}`;
  }

  // ---------- offseason: development, contracts and decisions ----------
  async function offseason(c) {
    const from = c.me.ovr;
    c.age++; c.yr++;
    const L = await leagueFor(c.yr);
    setAge(c, c.age);
    const ovr = c.me.ovr;
    const pend = { type: 'season', from, to: ovr, offers: [], notes: [] };
    const cur = c.franchise && !c.minors ? L.teams.find(t => fr(t) === c.franchise) : null;
    if (c.franchise && !c.minors && !cur) pend.notes.push(`The ${c.teamMeta.city} ${c.teamMeta.name} no longer exist. He is a free agent.`);
    if (c.age >= 45 || (ovr < 58 && c.age >= 24)) return end(c, ovr < 58 ? 'No team wanted him any more' : 'Retired at 44');
    if (ovr < 62) {
      if (c.age >= 30) return end(c, c.minors ? 'Never made it back to the league' : `Fell out of the league at ${c.age - 1}`);
      pend.type = 'minors';
      pend.notes.push('No NBA team has a spot for him this year.');
    } else if (!cur || !c.contract || c.contract.through < c.yr) {
      pend.type = 'fa';
      pend.offers = makeOffers(c, L, cur);
      if (!pend.offers.length) { pend.type = 'minors'; pend.notes.push('Free agency came and went without an offer.'); }
    }
    c.pending = pend;
  }

  function makeOffers(c, L, cur) {
    const ovr = c.me.ovr, age = c.age;
    const teams = L.teams.map(t => ({ t, s: HL.News.teamStrength(L, t.id) })).sort((a, b) => b.s - a.s);
    let n = ovr >= 85 ? 5 : ovr >= 78 ? 4 : ovr >= 70 ? 3 : ovr >= 65 ? 2 : 1;
    if (age >= 35) n = Math.max(1, n - 1);
    const pool = teams.filter(x => !cur || x.t.id !== cur.id);
    const picks = [];
    // Stars hear from everyone, contenders included; role players mostly from teams that need help.
    while (picks.length < n && pool.length) {
      const lo = ovr >= 82 ? 0 : Math.floor(pool.length * 0.25);
      picks.push(pool.splice(R.int(lo, pool.length - 1), 1)[0]);
    }
    if (cur && R.chance(c.seasons.slice(-3).some(s=>s.champion&&s.team.bref===c.teamMeta?.bref) ? 0.995 : ovr>=72 ? .95 : ovr>=66 ? .6 : .3)) picks.unshift(teams.find(x => x.t.id === cur.id));
    return picks.map(x => offerFrom(c, L, x.t, teams.indexOf(x), teams.length, cur && x.t.id === cur.id));
  }
  function offerFrom(c, L, t, strengthRank, nTeams, isCur) {
    const ovr = c.me.ovr, age = c.age;
    const roster = HL.League.teamPlayers(t.id).sort((a, b) => b.ovr - a.ovr);
    const rank = roster.filter(p => p.ovr > ovr).length + 1;
    const role = rank === 1 ? 'Number one option' : rank <= 3 ? 'Star role' : rank <= 5 ? 'Starter' : rank <= 8 ? 'Rotation' : 'End of bench';
    // Weak teams pay more to get him; contenders sell winning. His own team has his rights (Bird rights).
    const tilt = isCur ? 1.06 : 1.12 - (1 - strengthRank / Math.max(1, nTeams - 1)) * 0.24;
    const amount = Math.max(minSalary(c.yr), marketValue(ovr, age, c.yr) * tilt * R.range(0.93, 1.07));
    let years = age <= 26 ? R.int(3, 5) : age <= 30 ? R.int(2, 4) : age <= 33 ? R.int(1, 3) : 1;
    if (ovr < 68) years = Math.min(years, R.int(1, 2));
    const tier = strengthRank < 5 ? 'Contender' : strengthRank < Math.round(nTeams * 0.45) ? 'Playoff team' : strengthRank < Math.round(nTeams * 0.75) ? 'Fringe' : 'Rebuilding';
    return {
      tid: t.id, team: metaOf(t), franchise: fr(t), isCur, amount, years, role, tier,
      top: roster.slice(0, 3).map(p => ({ name: p.name, ovr: p.ovr, nbaId: p.nbaId })), last: c.lastRecords[fr(t)] || null,
    };
  }

  function decide(c, choice) {
    const p = c.pending;
    if (!p) return;
    const L = cache && cache.L;
    const seasonsPlayed = c.seasons.filter(s => !s.minors).length;
    if (choice.type === 'retire') return end(c, `Retired after ${seasonsPlayed} NBA season${seasonsPlayed === 1 ? '' : 's'}, at ${c.age - 1}`);
    if (choice.type === 'sign') {
      const o = p.offers[choice.i];
      const t = L.teams.find(x => x.id === o.tid);
      join(c, t, `${o.isCur ? 'Re-signed with' : 'Signed with'} the ${fullName(t)}: ${o.years} year${o.years > 1 ? 's' : ''}, ${U.money(o.amount)} a year`, { amount: o.amount, through: c.yr + o.years - 1, kind: o.isCur ? 'Re-signed' : 'Free agent deal' });
    } else if (choice.type === 'trade') {
      // The front office finds a taker; good players get moved to teams trying to win.
      const others = L.teams.filter(t => fr(t) !== c.franchise).map(t => ({ t, s: HL.News.teamStrength(L, t.id) })).sort((a, b) => b.s - a.s);
      const pickFrom = c.me.ovr >= 80 ? others.slice(0, 10) : others.slice(Math.floor(others.length / 3));
      const t = R.pick(pickFrom).t;
      c.tradeRequests++;
      join(c, t, `Traded to the ${fullName(t)} after requesting a trade`, c.contract);
    } else if (choice.type === 'minors') {
      c.minors = true;
      c.log.push({ yr: c.yr, text: 'Spent the season in the minor leagues' });
    }
    c.pending = null;
  }

  // Auto-pilot for "sim the whole career": stars chase titles, others follow the money, loyal players stay.
  function autoDecide(c) {
    const p = c.pending;
    if (!p) return;
    if (p.type === 'minors') return decide(c, { type: c.age < 27 ? 'minors' : 'retire' });
    if ((c.age >= 35 && c.me.ovr < 72 && R.chance(0.5)) || c.age >= 41) return decide(c, { type: 'retire' });
    if (p.type === 'fa') {
      const cur = p.offers.findIndex(o => o.isCur);
      const recent=c.seasons.filter(s=>!s.minors && s.team?.bref===c.teamMeta?.bref).slice(-3);
      const ringRun=recent.filter(s=>s.champion).length;
      const winning=recent.length ? recent.reduce((a,s)=>a+s.w/Math.max(1,s.w+s.l),0)/recent.length : 0;
      if (cur >= 0 && (ringRun>=2 || winning>=.73 && c.me.traits.loyalty>=40 || c.me.traits.loyalty>78))
        return decide(c, {type:'sign',i:cur});
      const tierScore = { Contender: 3, 'Playoff team': 2, Fringe: 1, Rebuilding: 0 };
      const score = o => (o.isCur ? ringRun*12+Math.max(0,c.me.traits.loyalty-50)/3 : 0)+(c.me.ovr>=80?tierScore[o.tier]*9:tierScore[o.tier]*3)+(o.role==='Number one option'?7:0)+o.amount/HL.salaryScale(c.yr)*.23;
      let best = 0;
      p.offers.forEach((o, i) => { if (score(o) > score(p.offers[best])) best = i; });
      return decide(c, { type: 'sign', i: best });
    }
    decide(c, { type: 'stay' });
  }

  function end(c, why) {
    c.done = true; c.end = why; c.pending = null;
    c.legacy = legacyOf(c.seasons, c);
  }

  async function simRest(c, onProgress) {
    let guard = 0;
    while (!c.done && guard++ < 40) {
      if (c.pending) autoDecide(c);
      if (c.done) break;
      await playSeason(c);
      await offseason(c);
      onProgress && onProgress(c);
      await new Promise(r => setTimeout(r, 0));
    }
  }

  // ---------- one season: real schedule, awards voted against the real field, playoff path ----------
  function simSeason(L, team, me, missed) {
    const roster = HL.League.teamPlayers(team.id).sort((a, b) => b.ovr - a.ovr).slice(0, 14);
    const realRows = HL.History.seasonRows(String(L.season));
    // Minutes: a coach plays him by quality, up to what that era's stars played.
    const stars = realRows.filter(r => r.g >= L.games / 2).sort((a, b) => b.ovr - a.ovr).slice(0, 10);
    const starMin = Math.min(44, stars.reduce((s, r) => s + r.mpg, 0) / Math.max(1, stars.length));
    me.teamId = team.id;
    // The coach slots him by where he ranks on the roster; the real players' minutes shrink to make room.
    const rankOnTeam = roster.filter(p => p.ovr > me.ovr).length;
    const byRank = [36, 34, 32, 30, 28, 25, 22, 19, 15, 12, 8];
    me.realMpg = Math.min(starMin, byRank[Math.min(rankOnTeam, byRank.length - 1)] * Math.max(1, starMin / 36));
    const othersMin = roster.filter(p => p.realMpg).reduce((a, p) => a + p.realMpg, 0);
    const room = 240 - me.realMpg;
    if (othersMin > room) for (const p of roster) if (p.realMpg) p.realMpg *= room / othersMin;
    me.minutesLock = true;
    me.stats = {}; me.injury = null;
    const tObj = { id: team.id, abbr: team.abbr, strategy: HL.DEFAULT_STRATEGY(), players: [me, ...roster] };
    const rules = Object.assign({}, L.rules, { profile: L.profile });
    const objOf = t => ({ id: t.id, abbr: t.abbr, strategy: t.strategy, players: HL.League.teamPlayers(t.id) });
    const line = HL.blankStatLine(), pline = HL.blankStatLine();
    const highs = {}, counts = { g30: 0, g40: 0, g50: 0, td: 0, dd: 0 };
    const note = (b, opp, won, sc, playoffs) => {
      const reb = b.orb + b.drb;
      const vals = { pts: b.pts, reb, ast: b.ast, stl: b.stl, blk: b.blk };
      for (const k in vals) if (!highs[k] || vals[k] > highs[k].v) highs[k] = { v: vals[k], opp: opp.name, won, sc, playoffs, line: `${b.pts} pts, ${reb} reb, ${b.ast} ast` };
      if (b.pts >= 30) counts.g30++;
      if (b.pts >= 40) counts.g40++;
      if (b.pts >= 50) counts.g50++;
      const tens = Object.values(vals).filter(v => v >= 10).length;
      if (tens >= 3) counts.td++; else if (tens >= 2) counts.dd++;
    };
    let w = 0, l = 0, gi = 0;
    for (const gm of L.schedule) {
      if (gm.home !== team.id && gm.away !== team.id) continue;
      me.injury = gi++ >= missed ? null : { name: 'Injured', games: 1 };
      const home = gm.home === team.id;
      const opp = L.teams[home ? gm.away : gm.home];
      const res = home ? HL.simGame(tObj, objOf(opp), rules) : HL.simGame(objOf(opp), tObj, rules);
      const mine = home ? res.home : res.away, theirs = home ? res.away : res.home;
      const won = mine.score > theirs.score;
      if (won) w++; else l++;
      const b = mine.box[me.id];
      if (b) { for (const k in line) line[k] += b[k] || 0; note(b, opp, won, `${mine.score}-${theirs.score}`, false); }
      for (const p of tObj.players) if (p !== me) p.injury = null;
    }
    me.injury = null;
    const g = line.gp || 0, games = w + l;
    const ppg = g ? line.pts / g : 0, rpg = g ? (line.orb + line.drb) / g : 0, apg = g ? line.ast / g : 0;
    const wp = games ? w / games : 0;

    // ---- Awards: voted against that season's real players (with voting noise) ----
    const RA = realAwards(L.season);
    const field = realRows.map(r => {
      const main = r.stints.slice().sort((a, b) => b[1] - a[1])[0];
      const t = L.teams.find(x => x.bref === main[0]);
      return { pid: r.pid, row: r, v: voteValue(r.pts, r.ovr, r.trb, r.ast, r.g, L.games), wp: t ? realWp(t) : 0.5, def: defValue(HL.History.unpack(r.attrs, HL.HISTORY.attrs), r.g, L.games), qual: r.g >= L.games * 0.7 };
    });
    const mine = { v: voteValue(ppg, me.ovr, rpg, apg, g, L.games) + R.normal(0, 1.2), wp };
    const mvpScore = x => x.v + (x.wp - 0.5) * 90;
    const myDef = defValue(me.attrs, g, L.games) + R.normal(0, 1.5);
    const ranks = {
      value: field.filter(f => f.v > mine.v).length + 1,
      mvp: field.filter(f => mvpScore(f) > mvpScore(mine)).length + 1,
      dpoy: field.filter(f => f.def > myDef).length + 1,
    };
    const above = ranks.value - 1;
    const awards = [], altered = [];
    const nAllNba = ['All-NBA 1st', 'All-NBA 2nd', 'All-NBA 3rd'].map(k => (RA[k] || []).length);
    const nAllStar = (RA['All-Star'] || []).length;
    const realMvp = (RA['nba mvp'] || [])[0];
    if (realMvp && g >= L.games * 0.7 && ranks.mvp === 1) { awards.push({ award: 'MVP', over: nameOf(realMvp) }); altered.push(`MVP instead of ${nameOf(realMvp)}`); }
    if (nAllNba[0] && above < nAllNba[0]) awards.push('All-NBA 1st');
    else if (nAllNba[1] && above < nAllNba[0] + nAllNba[1]) awards.push('All-NBA 2nd');
    else if (nAllNba[2] && above < nAllNba[0] + nAllNba[1] + nAllNba[2]) awards.push('All-NBA 3rd');
    if (nAllStar && g >= L.games * 0.4 && above < nAllStar) awards.push('All-Star');
    const realDpoy = (RA['nba dpoy'] || [])[0];
    if (realDpoy && g >= L.games * 0.7 && ranks.dpoy === 1) { awards.push({ award: 'DPOY', over: nameOf(realDpoy) }); altered.push(`Defensive Player of the Year instead of ${nameOf(realDpoy)}`); }
    const realRoy = (RA['nba roy'] || [])[0];
    if (me.age === 19 && realRoy) {
      const rr = field.find(f => f.pid === realRoy);
      if (rr && mine.v > rr.v) { awards.push({ award: 'ROY', over: nameOf(realRoy) }); altered.push(`Rookie of the Year instead of ${nameOf(realRoy)}`); }
    }
    // Statistical titles: per game, against qualified real players.
    for (const [lab, mineV, key] of [['Scoring title', ppg, 'pts'], ['Rebounding title', rpg, 'trb'], ['Assists title', apg, 'ast']]) {
      const q = field.filter(f => f.qual).sort((a, b) => b.row[key] - a.row[key])[0];
      if (q && g >= L.games * 0.7 && mineV > q.row[key]) { awards.push({ award: lab, over: nameOf(q.pid) }); altered.push(`${lab} (${mineV.toFixed(1)}) over ${nameOf(q.pid)} (${q.row[key]})`); }
    }

    // ---- Playoffs: that year's qualifying spots, format and opponents ----
    const fmt = HL.playoffFormat(L.season);
    const realPlayoff = L.teams.filter(t => t.real.playoffs);
    const spots = realPlayoff.length || fmt.perConf * 2;
    const others = L.teams.filter(t => t.id !== team.id).map(t => ({ t, wp: realWp(t) })).sort((a, b) => b.wp - a.wp);
    const seed = others.filter(o => o.wp > wp).length + 1;
    const rounds = fmt.bestOf.length;
    const made = seed <= spots;
    const series = [];
    let round = 0, champion = false;
    const pbox = {};
    if (made) {
      // Bracket: his conference's playoff teams until the Finals, then the other conference's best.
      const confs = [...new Set(L.teams.map(t => t.conf))];
      const split = confs.length > 1;
      const perConf = split ? Math.round(spots / confs.length) : spots;
      const confPool = others.filter(o => !split || o.t.conf === team.conf).slice(0, perConf - 1);
      const otherPool = split ? others.filter(o => o.t.conf !== team.conf).slice(0, perConf) : [];
      const confSeed = confPool.filter(o => o.wp > wp).length + 1;
      const played = new Set();
      const start = fmt.byes && confSeed <= fmt.byes ? 1 : 0;
      round = start;
      if (start) series.push({ round: 0, name: roundName(0, rounds, L.season), bye: true });
      for (let r = start; r < rounds; r++) {
        const finals = r === rounds - 1;
        let cands = (finals && split ? otherPool : confPool).filter(o => !played.has(o.t.id));
        if (!cands.length) cands = others.filter(o => !played.has(o.t.id));
        let pickO;
        if (finals) pickO = cands[R.chance(0.6) || cands.length < 2 ? 0 : R.chance(0.6) || cands.length < 3 ? 1 : 2];
        else if (r === start) pickO = cands[HL.clamp(cands.length - confSeed, 0, cands.length - 1)]; // mirror seed: 1 plays 8
        else pickO = cands[R.chance(0.65) || cands.length < 2 ? 0 : 1]; // the stronger survivors
        const oppT = pickO.t;
        played.add(oppT.id);
        const need = Math.ceil(fmt.bestOf[r] / 2);
        let sw = 0, sl = 0;
        while (sw < need && sl < need) {
          const home = (sw + sl) % 2 === 0;
          const res = home ? HL.simGame(tObj, objOf(oppT), rules) : HL.simGame(objOf(oppT), tObj, rules);
          const a = home ? res.home : res.away, b = home ? res.away : res.home;
          const won = a.score > b.score;
          if (won) sw++; else sl++;
          for (const id in a.box) { const x = pbox[id] = pbox[id] || HL.blankStatLine(); for (const k in x) x[k] += a.box[id][k] || 0; }
          const mb = a.box[me.id];
          if (mb) { for (const k in pline) pline[k] += mb[k] || 0; note(mb, oppT, won, `${a.score}-${b.score}`, true); }
        }
        series.push({ round: r, name: roundName(r, rounds, L.season), opp: metaOf(oppT), oppRec: `${oppT.real.w}-${oppT.real.l}`, w: sw, l: sl, won: sw === need });
        if (sw < need) break;
        round++;
      }
      champion = round === rounds;
      if (champion) {
        awards.push('Champion');
        // Finals MVP: the best playoff run on the team.
        const pv = b => b.pts + 0.7 * (b.orb + b.drb) + 0.8 * b.ast + b.stl + b.blk;
        const best = Object.entries(pbox).sort((a, b) => pv(b[1]) - pv(a[1]))[0];
        if (best && +best[0] === me.id) awards.push('Finals MVP');
      }
    }
    const realChamp = HL.HISTORY.champions[String(L.season)];
    const rcT = realChamp && L.teams.find(t => t.bref === realChamp);
    if (champion && realChamp && LIN()[realChamp] !== LIN()[team.bref]) altered.push(`Won the title that went to the ${rcT ? rcT.name : realChamp}`);
    const mates = roster.filter(p => p.id !== me.id).slice(0, 3).map(p => ({ name: p.name, ovr: p.ovr, nbaId: p.nbaId, pos: p.pos }));
    return {
      g, line, pline, ppg, rpg, apg, ts: (line.fga + 0.44 * line.fta) ? line.pts / (2 * (line.fga + 0.44 * line.fta)) : 0,
      w, l, seed, spots, made, series, rounds, playoffRound: round, champion, awards, altered, ranks, highs, counts, mates,
      realChamp: rcT ? fullName(rcT) : realChamp || null, games: L.games, nTeams: L.teams.length,
    };
  }
  function roundName(r, rounds, season) {
    const fromEnd = rounds - 1 - r;
    const div = season < 1970;
    return ['Finals', div ? 'Division finals' : 'Conference finals', div ? 'Division semifinals' : 'Conference semifinals', 'First round'][fromEnd] || 'First round';
  }

  // Same formula as real careers in HL.HISTORY.legacy (tools/build-history.py).
  function legacyOf(seasons, career) {
    const W = HL.HISTORY.legacyWeights;
    let score = 0;
    for (const s of seasons) score += Math.pow(Math.max(0, s.ovr - 72), 1.6) / 10 * Math.min(1, s.g / 82);
    const count = name => career.awards.filter(a => a.award === name).length;
    score += W.MVP * count('MVP') + W.Ring * career.rings + W['All-NBA 1st'] * count('All-NBA 1st') + W['All-NBA 2nd'] * count('All-NBA 2nd') + W['All-NBA 3rd'] * count('All-NBA 3rd') + W['All-Star'] * count('All-Star') + W.DPOY * count('DPOY') + W.ROY * count('ROY');
    const real = Object.entries(HL.HISTORY.legacy).map(([pid, v]) => ({ pid, score: v[0], v })).sort((a, b) => b.score - a.score);
    const rank = real.filter(r => r.score > score).length + 1;
    const closest = real.slice().sort((a, b) => Math.abs(a.score - score) - Math.abs(b.score - score))[0];
    return { score: Math.round(score * 10) / 10, rank, closest, top: real[0] };
  }

  function verdict(c) {
    const lg = c.legacy, n = c.seasons.filter(s => !s.minors).length;
    if (!n) return ['NEVER MADE IT', `${c.pick ? `Drafted #${c.pick}, but` : 'Undrafted, and'} never played an NBA game. ${c.seasons.length} season${c.seasons.length === 1 ? '' : 's'} in the minors and overseas.`];
    const report=HL.Legacy.careerReport(c);
    if(lg.rank===1 && report.goatQualified)
      return ['GOAT FRONT-RUNNER', 'First in the historical legacy model, with the sustained MVP, title and playoff resume to support the case. The cross-era debate stays open.'];
    if(lg.rank<=3 && report.goatQualified)
      return ['GOAT CONTENDER', 'An elite historical rank backed by meaningful championships, production and longevity.'];
    if(lg.rank===1)
      return ['HISTORIC PEAK', 'First in the legacy model, but one rank does not settle the all-time debate.'];
    if(lg.rank<=10)return ['ALL-TIME GREAT', 'A career worthy of a detailed, era-aware comparison with the legends.'];
    if (lg.rank <= 75) return ['HALL OF FAMER', `#${lg.rank} all-time. First-ballot.`];
    if (lg.rank <= 160) return ['SUPERSTAR', `#${lg.rank} all-time. A borderline Hall of Fame career.`];
    if (lg.rank <= 350) return ['ALL-STAR', `#${lg.rank} all-time. A very good career.`];
    const top10 = c.pick && c.pick <= 10;
    if (n <= 3) return [top10 ? 'BUST' : 'OUT OF THE LEAGUE', top10 ? `A top-${c.pick} pick who was out of the league in ${n} seasons.` : `Out of the league after ${n} season${n === 1 ? '' : 's'}.`];
    const avg = c.seasons.filter(s => !s.minors).reduce((s, x) => s + x.ovr, 0) / n;
    if (avg >= 76) return ['STARTER', 'A long, solid career as a starter.'];
    if (avg >= 70) return ['ROLE PLAYER', 'Carved out a career doing the little things.'];
    return [top10 ? 'BUST' : 'BENCH WARMER', top10 ? 'Never lived up to the draft slot.' : 'Waved the towel with pride.'];
  }

  // ---------- UI ----------
  const tm = fr => HL.TEAMS.find(t => t.abbr === fr);
  const pg = (tot, k) => tot.g ? tot[k] / tot.g : 0;
  const pctOf = (m, a) => a ? (m / a * 100).toFixed(1) : '—';
  const awardName = a => a.award || a;
  const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;

  function render(revealHand) {
    if (!st) return setupScreen();
    const c = st.career;
    const done = !remaining().length;
    const hide = st.mode === 'hoopiq';
    if (c && c.teamMeta && !c.minors) U.applyTeamTheme(c.teamMeta); else U.applyTeamTheme(st.team && !done ? tm(st.team) : null);
    U.setEra(c ? HL.eraForSeason(Math.min(c.yr, HL.LATEST_SEASON)) : 'modern');
    let main;
    if (st.busy) main = busyView();
    else if (c && c.done) main = resultView();
    else if (c && c.stage === 'draft') main = draftNightView();
    else if (c) main = hubView();
    else if (done) main = builtView();
    else main = draftView(hide, revealHand);
    const side = c ? careerSide(c) : buildSide(done, hide);
    U.app().innerHTML = `<div class="frame"><div class="masthead"><div class="bar"><div class="wordmark" data-home>Hoops<i>Life</i></div><div class="mainnav"><button class="on">Skill Draft Career</button></div>
      <div class="simbar">${c ? `<span class="t2 sm">${c.done ? 'Career over' : `${yrLabel(c.yr)} · Age ${c.age}`}</span>` : `<span class="t2 sm">${CATS.length - remaining().length}/${CATS.length} skills</span>`}${FX.soundToggle()}<button class="btn small" data-new>New run</button></div></div></div>
      <div class="page">${c && !c.done && c.stage !== 'draft' && !st.busy ? teamBand(c) : ''}<div class="cols c-main"><div class="stack" style="gap:16px">${main}</div><div class="stack" style="gap:16px">${side}</div></div></div></div>`;
    bind();
    if (revealHand) FX.flipIn(document.querySelectorAll('.hand .gcard'));
  }

  function busyView() {
    const b = st.busy;
    return `<section class="block"><div class="body"><h3>${esc(b.title)}</h3><div class="t2 sm" style="margin-top:6px">${esc(b.sub || '')}</div><div class="simcard" style="width:auto;border:0;padding:0"><div class="track"><i style="width:${b.pct || 0}%"></i></div></div></div></section>`;
  }

  function buildSide(done, hide) {
    const prime = done ? buildPrime() : null;
    const tiles = CATS.map(cat => {
      const [id, label] = cat;
      const pk = st.picks[id];
      if (!pk) return `<div class="tile ${st.cat === id ? 'next' : ''}" data-cat="${id}"><span class="lab">${esc(label)}</span><span class="val t3">—</span><span class="who">${st.cat === id ? 'Drafting now' : ''}</span></div>`;
      const bio = HL.HISTORY.players[pk.row.pid];
      const v = skillValue(pk, cat);
      return `<div class="tile on t-${FX.tierOf(v).key}" data-cat="${id}"><span class="lab">${esc(label)}</span><span class="val">${hide ? '?' : id === 'body' ? HL.fmtHeight(bio[3]) : v}</span><span class="who">${esc(bio[0])} · ${yrLabel(pk.season)}</span></div>`;
    }).join('');
    return `<section class="block"><header><h3>Your build</h3><span class="ml-auto t3 sm">${CATS.length - remaining().length}/${CATS.length}</span>${prime && !hide ? `<span>${U.rating(HL.computeOvr(prime.attrs, prime.pos))}</span>` : ''}</header><div class="body"><div class="board">${tiles}</div></div></section>`;
  }

  function builtView() {
    return `<section class="block"><div class="body stack"><h3>Your player is built</h3>
      <div class="setting"><div class="grow"><b>Name</b></div><input type="text" value="${esc(st.name)}" data-name maxlength="30"></div>
      <div class="setting"><div class="grow"><b>Draft class</b><div class="d">He enters the real league in this draft and plays every season against the real rosters of that year.</div></div>${debutSelect()}</div>
      <div class="row wrap" style="gap:10px"><button class="btn go big" data-begin="season">Play it season by season</button><button class="btn big" data-begin="auto">Sim the whole career</button></div>
      <div class="t3 sm">Season by season: see every season's numbers, awards and playoff run, then choose free agency offers, ask for trades or retire. Simming the whole career makes those calls for you.</div>
    </div></section>`;
  }

  function debutSelect() {
    const years = [];
    for (let y = HL.LATEST_SEASON; y >= 1947; y--) years.push(y);
    return `<select data-debut>${years.map(y => `<option value="${y}" ${y === st.debut ? 'selected' : ''}>${y} draft · ${yrLabel(y)} season${y > HL.LATEST_SEASON - 15 ? ` (later years replay ${yrLabel(HL.LATEST_SEASON)})` : ''}</option>`).join('')}</select>`;
  }

  function teamBand(c) {
    const t = c.teamMeta;
    const live = c.contract && !c.minors && c.contract.through >= c.yr;
    const ctr = live ? `${U.money(c.contract.amount)}` : c.minors ? '—' : 'FA';
    return `<div class="teamband">
      <div class="flag">${t && !c.minors ? U.logo(t, 64) : ''}</div>
      <div class="ident"><div class="city">${c.minors ? 'Minor leagues' : esc(fullName(t))} · ${yrLabel(c.yr)}</div><div class="name">${esc(c.me.name)}</div><div class="t3 sm">${esc(c.me.pos)} · ${HL.fmtHeight(c.me.height)} · ${c.me.weight} lb${c.pick ? ` · #${c.pick} pick, ${c.debut}` : ` · undrafted, ${c.debut}`}</div></div>
      <div class="facts">
        <div class="fact"><b>${c.me.ovr}</b><span>Overall</span></div>
        <div class="fact"><b>${c.age}</b><span>Age</span></div>
        <div class="fact"><b>${c.seasons.filter(s => !s.minors).length}</b><span>Seasons</span></div>
        <div class="fact"><b>${c.rings}</b><span>Rings</span></div>
        <div class="fact"><b>${ctr}</b><span>${live ? `Thru ${yrLabel(c.contract.through)}` : 'Contract'}</span></div>
      </div></div>`;
  }

  function draftNightView() {
    const c = st.career;
    const cls = c.draftClass || [];
    const t = c.teamMeta;
    return `<section class="block"><header><h3>Draft night · ${c.debut}</h3></header><div class="body stack">
        <div class="row" style="gap:16px">${t && !c.minors ? U.logo(t, 72) : ''}<div><div class="caps">${c.pick ? `Pick #${c.pick}` : 'Undrafted'}</div><h2 style="font-size:30px">${c.minors ? 'No team called his name' : `${esc(fullName(t))}`}</h2><div class="t2">${esc(c.log[c.log.length - 1].text)}${c.contract && !c.minors ? ` · ${esc(c.contract.kind)}, ${U.money(c.contract.amount)} a year through ${yrLabel(c.contract.through)}` : ''}</div></div></div>
        <div class="kv"><span>Rookie rating</span><b>${c.me.ovr} OVR</b></div>
        <div class="kv"><span>Achievable prime (age 28–29)</span><b>${c.primeOvr} OVR</b></div>
        <div class="kv"><span>Work ethic</span><b>${c.me.traits.workEthic >= 75 ? 'Gym rat' : c.me.traits.workEthic >= 55 ? 'Solid' : c.me.traits.workEthic >= 40 ? 'Inconsistent' : 'Questionable'}</b></div>
        <div class="row wrap" style="gap:10px"><button class="btn go big" data-play>Play the ${yrLabel(c.yr)} season</button><button class="btn" data-simrest>Sim the whole career</button></div>
      </div></section>
      ${cls.length ? `<section class="block"><header><h3>The real ${c.debut} draft</h3><span class="ml-auto t3 sm">He joins this class</span></header><div class="body flush">${cls.map(r => `<div class="res-row" style="grid-template-columns:40px 1fr auto;cursor:default"><b class="num">${r.pick}</b><div class="row">${U.face({ name: r.name, nbaId: r.nbaId, real: true }, 26, null)}<span>${esc(r.name)}</span></div><span class="t3 sm">${esc(r.club)}${r.college ? ' · ' + esc(r.college) : ''}</span></div>`).join('')}</div></section>` : ''}`;
  }

  function hubView() {
    const c = st.career;
    const p = c.pending;
    const out = [];
    const sims = `<button class="btn" data-simrest>Sim the rest of the career</button><button class="btn quiet" data-retire>Retire</button>`;
    if (p) {
      const dev = p.to - p.from;
      const head = `<header><h3>Offseason · ${yrLabel(c.yr)}</h3><span class="ml-auto sm ${dev > 0 ? 'win' : dev < 0 ? 'loss' : 't3'}">Summer: ${p.from} → ${p.to} OVR</span></header>`;
      const notes = p.notes.map(n => `<div class="t2">${esc(n)}</div>`).join('');
      if (p.type === 'fa') {
        out.push(`<section class="block">${head}<div class="body stack">${notes}<div class="t2">${c.contract && !p.notes.length ? `His contract with the ${esc(c.teamMeta.name)} is up.` : ''} ${plural(p.offers.length, 'team')} made an offer.</div>
          <div class="offers">${p.offers.map((o, i) => offerCard(o, i)).join('')}</div>
          <div class="row wrap" style="gap:8px">${sims}</div></div></section>`);
      } else if (p.type === 'minors') {
        out.push(`<section class="block">${head}<div class="body stack">${notes}<div class="row wrap" style="gap:8px"><button class="btn go" data-minors>Keep grinding in the minors</button>${sims}</div></div></section>`);
      } else {
        out.push(`<section class="block">${head}<div class="body stack">${notes}<div class="t2">Under contract with the ${esc(fullName(c.teamMeta))} through ${yrLabel(c.contract.through)} at ${U.money(c.contract.amount)} a year.</div>
          <div class="row wrap" style="gap:8px"><button class="btn go big" data-play>Play the ${yrLabel(c.yr)} season</button><button class="btn" data-trade>Request a trade</button>${sims}</div></div></section>`);
      }
    } else {
      out.push(`<section class="block"><div class="body row wrap" style="gap:10px"><div class="grow"><h3>${yrLabel(c.yr)}</h3><div class="t2 sm">${c.minors ? 'A season in the minor leagues.' : `With the ${esc(fullName(c.teamMeta))}.`}</div></div><button class="btn go big" data-play>Play the season</button><button class="btn" data-simrest>Sim the rest</button></div></section>`);
    }
    const last = c.seasons[c.seasons.length - 1];
    if (last) out.push(seasonReport(last));
    if (c.seasons.length) out.push(careerTable(c));
    if (c.log.length) out.push(timeline(c));
    return out.join('');
  }

  function offerCard(o, i) {
    return `<div class="offer"><div class="row">${U.logo(o.team, 40)}<div class="grow"><div class="nm">${esc(o.team.city)} ${esc(o.team.name)}</div><div class="t3 xs">${o.isCur ? 'His team · Bird rights' : esc(o.tier)}${o.last ? ` · ${o.last} last season` : ''}</div></div></div>
      <div class="kv"><span>Contract</span><b>${o.years} yr${o.years > 1 ? 's' : ''} · ${U.money(o.amount)}/yr</b></div>
      <div class="kv"><span>Role</span><b>${esc(o.role)}</b></div>
      <div class="mates">${o.top.map(m => `<div class="row sm">${U.face({ name: m.name, nbaId: m.nbaId, real: true }, 22, o.team)}<span class="grow">${esc(m.name)}</span>${U.rating(m.ovr)}</div>`).join('')}</div>
      <button class="btn" data-sign="${i}">${o.isCur ? 'Re-sign' : 'Sign'}</button></div>`;
  }

  function statStrip(l, g, mpg) {
    const t = { g, pts: l.pts, reb: l.orb != null ? l.orb + l.drb : l.reb, ast: l.ast, stl: l.stl, blk: l.blk };
    const d = x => g ? (x / g).toFixed(1) : '0.0';
    const cells = [['GP', g], ['MPG', mpg], ['PTS', d(t.pts)], ['REB', d(t.reb)], ['AST', d(t.ast)], ['STL', d(t.stl)], ['BLK', d(t.blk)], ['FG%', pctOf(l.fgm, l.fga)], ['3P%', pctOf(l.tpm, l.tpa)], ['FT%', pctOf(l.ftm, l.fta)], ['TS%', (l.fga + 0.44 * l.fta) ? (l.pts / (2 * (l.fga + 0.44 * l.fta)) * 100).toFixed(1) : '—']];
    return `<div class="statstrip">${cells.map(([k, v]) => `<div><b>${v}</b><span>${k}</span></div>`).join('')}</div>`;
  }

  function seasonReport(s) {
    if (s.minors) return `<section class="block"><header><h3>${yrLabel(s.yr)} · Minor leagues</h3></header><div class="body t2">A year away from the NBA. Rating ${s.ovr}.</div></section>`;
    const l = s.line;
    const po = !s.made ? `Missed the playoffs (${ordinal(s.seed)} best record; ${s.spots} teams qualified)` : s.champion ? '<b>Won the championship</b>' : `Out in the ${s.series.filter(x => !x.bye).slice(-1)[0].name.toLowerCase()}`;
    const ranks = [`MVP voting: ${ordinal(s.ranks.mvp)}`, `Defense: ${ordinal(s.ranks.dpoy)}`, `Impact rank: ${ordinal(s.ranks.value)}`];
    const h = s.highs.pts;
    const cnt = s.counts;
    const extras = [cnt.g40 ? plural(cnt.g40, '40-point game') : '', cnt.g50 ? plural(cnt.g50, '50-point game') : '', cnt.td ? plural(cnt.td, 'triple-double') : '', cnt.dd ? plural(cnt.dd, 'double-double') : ''].filter(Boolean);
    return `<section class="block"><header><h3>${yrLabel(s.yr)} season report</h3><span class="ml-auto row sm">${U.logo(s.team, 22)} ${esc(s.team.name)} · ${s.ovr} OVR</span></header><div class="body stack">
      ${statStrip(l, s.g, s.g ? (l.min / s.g).toFixed(1) : '0.0')}
      <div class="cols c2"><div class="stack" style="gap:6px">
          <div class="caps">Team</div>
          <div><b class="num" style="font-size:26px">${s.w}-${s.l}</b> <span class="t2">${ordinal(s.seed)} best record of ${s.nTeams} teams</span></div>
          <div class="t2">${po}</div>
          ${s.series.map(x => x.bye ? `<div class="ser t3 sm">${esc(x.name)}: bye</div>` : `<div class="ser"><span class="t3 sm">${esc(x.name)}</span><span class="row sm">${U.logo(x.opp, 18)} ${esc(x.opp.name)} <span class="t3">(${x.oppRec})</span></span><b class="${x.won ? 'win' : 'loss'}">${x.won ? 'W' : 'L'} ${x.w}-${x.l}</b></div>`).join('')}
          ${s.realChamp ? `<div class="t3 sm">Real ${yrLabel(s.yr)} champion: ${esc(s.realChamp)}</div>` : ''}
        </div><div class="stack" style="gap:6px">
          <div class="caps">Honors</div>
          <div class="row wrap" style="gap:6px">${s.awards.length ? s.awards.map(a => `<span class="tag ${['Champion', 'MVP', 'Finals MVP'].includes(awardName(a)) ? 'team' : ''}" ${a.over ? `title="Over ${esc(a.over)}"` : ''}>${esc(awardName(a))}</span>`).join('') : '<span class="t3 sm">None this season</span>'}</div>
          <div class="t2 sm">${ranks.join(' · ')}</div>
          ${h ? `<div class="t2 sm">Season high: ${h.v} points ${h.playoffs ? 'in the playoffs ' : ''}vs the ${esc(h.opp)} (${h.won ? 'W' : 'L'} ${h.sc})</div>` : ''}
          ${extras.length ? `<div class="t2 sm">${extras.join(' · ')}</div>` : ''}
          ${s.injury ? `<div class="loss sm">Missed ${plural(s.injury.games, 'game')}: ${esc(s.injury.name)}${s.injury.lasting ? ' (lasting damage)' : ''}</div>` : ''}
          <div class="caps" style="margin-top:6px">Teammates</div>
          ${s.mates.map(m => `<div class="row sm">${U.face({ name: m.name, nbaId: m.nbaId, real: true }, 24, s.team)}<span class="grow">${esc(m.name)}</span><span class="t3">${esc(m.pos)}</span>${U.rating(m.ovr)}</div>`).join('')}
        </div></div>
      ${s.pline.gp ? `<div class="caps">Playoffs</div>${statStrip(s.pline, s.pline.gp, (s.pline.min / s.pline.gp).toFixed(1))}` : ''}
      ${s.altered.length ? `<div class="caps">History changed</div>${s.altered.map(a => `<div class="sm">${esc(a)}</div>`).join('')}` : ''}
    </div></section>`;
  }

  function careerTable(c) {
    const T = c.totals;
    const rows = c.seasons.map(s => {
      if (s.minors) return `<tr><td class="l">${yrLabel(s.yr)}</td><td>${s.age}</td><td class="l t3">Minor leagues</td><td>${U.rating(s.ovr)}</td><td colspan="12"></td></tr>`;
      const l = s.line, g = s.g || 1;
      const po = !s.made ? '<span class="t3">—</span>' : s.champion ? '<b class="win">Won title</b>' : esc(s.series.filter(x => !x.bye).slice(-1)[0].name.replace('Conference ', 'Conf. ').replace('Division ', 'Div. '));
      return `<tr><td class="l">${yrLabel(s.yr)}${s.key !== String(s.yr) ? ' <span class="t3 xs" title="Replays the latest real league">*</span>' : ''}</td><td>${s.age}</td><td class="l"><div class="row">${U.logo(s.team, 20)} ${esc(s.team.name)}</div></td><td>${U.rating(s.ovr)}</td><td>${s.g}</td><td>${(l.min / g).toFixed(1)}</td><td class="hi">${(l.pts / g).toFixed(1)}</td><td>${((l.orb + l.drb) / g).toFixed(1)}</td><td>${(l.ast / g).toFixed(1)}</td><td>${(l.stl / g).toFixed(1)}</td><td>${(l.blk / g).toFixed(1)}</td><td>${pctOf(l.fgm, l.fga)}</td><td>${pctOf(l.tpm, l.tpa)}</td><td>${s.w}-${s.l}</td><td class="l sm">${po}</td><td class="l sm">${s.awards.filter(a => awardName(a) !== 'Champion').map(a => `<span class="tag ${['MVP', 'Finals MVP'].includes(awardName(a)) ? 'team' : ''}" ${a.over ? `title="Over ${esc(a.over)}"` : ''}>${esc(awardName(a))}</span>`).join(' ')}</td></tr>`;
    }).join('');
    const foot = T.g ? `<tfoot><tr><td class="l" colspan="4">Career</td><td>${T.g}</td><td>${pg(T, 'min').toFixed(1)}</td><td>${pg(T, 'pts').toFixed(1)}</td><td>${pg(T, 'reb').toFixed(1)}</td><td>${pg(T, 'ast').toFixed(1)}</td><td>${pg(T, 'stl').toFixed(1)}</td><td>${pg(T, 'blk').toFixed(1)}</td><td>${pctOf(T.fgm, T.fga)}</td><td>${pctOf(T.tpm, T.tpa)}</td><td colspan="3"></td></tr></tfoot>` : '';
    return `<section class="block"><header><h3>Career</h3><span class="ml-auto t3 sm">${Math.round(T.pts).toLocaleString()} points · ${U.money(c.earnings)} earned</span></header><div class="body flush"><div class="tbl-wrap"><table class="tbl"><thead><tr><th class="l">Season</th><th>Age</th><th class="l">Team</th><th>OVR</th><th>GP</th><th>MPG</th><th>PTS</th><th>REB</th><th>AST</th><th>STL</th><th>BLK</th><th>FG%</th><th>3P%</th><th>Record</th><th class="l">Playoffs</th><th class="l">Honors</th></tr></thead><tbody>${rows}</tbody>${foot}</table></div></div></section>`;
  }

  function timeline(c) {
    const items = [...c.log.map(x => ({ yr: x.yr, text: x.text, k: 'move' })), ...c.altered.map(a => ({ yr: a.season, text: a.text, k: 'alt' }))].sort((a, b) => a.yr - b.yr);
    return `<section class="block"><header><h3>Story so far</h3><span class="ml-auto t3 sm">Moves and the history he changed</span></header><div class="body flush">${items.map(x => `<div class="res-row" style="grid-template-columns:80px 1fr;cursor:default"><span class="t3">${yrLabel(x.yr)}</span><span class="${x.k === 'alt' ? 'hi' : ''}">${x.k === 'alt' ? '<b>History changed:</b> ' : ''}${esc(x.text)}</span></div>`).join('')}</div></section>`;
  }

  function careerSide(c) {
    const nba = c.seasons.filter(s => !s.minors);
    const peak = nba.length ? Math.max(...nba.map(s => s.ovr)) : c.me.ovr;
    const card = HL.GFX.jerseyCard(Object.assign({}, c.me, c.done ? { ovr: peak } : {}), c.minors ? null : c.teamMeta, { sub: c.done ? `Peak rating · ${plural(nba.length, 'season')}` : `${c.minors ? 'Minor leagues' : fullName(c.teamMeta)}` });
    const count = name => c.awards.filter(a => a.award === name).length;
    const cab = ['Champion', 'Finals MVP', 'MVP', 'DPOY', 'ROY', 'All-NBA 1st', 'All-NBA 2nd', 'All-NBA 3rd', 'All-Star', 'Scoring title', 'Rebounding title', 'Assists title'].map(k => [k === 'Champion' ? 'Championships' : k, count(k)]).filter(x => x[1]);
    const H = c.highs;
    const hi = [['Points', H.pts], ['Rebounds', H.reb], ['Assists', H.ast], ['Steals', H.stl], ['Blocks', H.blk]].filter(x => x[1]);
    const cur = Object.fromEntries(CATS.filter(x => x[2].length).map(([id, label, keys]) => [id, [label, avgOf(c.me.attrs, keys), avgOf(c.prime.attrs, keys)]]));
    return `<div style="max-width:340px">${card}</div>
      <section class="block"><header><h3>Trophy case</h3></header><div class="body">${cab.length ? cab.map(([k, n]) => `<div class="kv"><span>${esc(k)}</span><b>${n}</b></div>`).join('') : '<div class="t3 sm">Empty, for now.</div>'}</div></section>
      ${hi.length ? `<section class="block"><header><h3>Career highs</h3></header><div class="body">${hi.map(([k, h]) => `<div class="kv"><span>${k}</span><b>${h.v} <span class="t3 xs">vs ${esc(h.opp)}, ${yrLabel(h.yr)}${h.playoffs ? ' (playoffs)' : ''}</span></b></div>`).join('')}</div></section>` : ''}
      <section class="block"><header><h3>Ratings</h3><span class="ml-auto t3 sm">Now · ceiling</span></header><div class="body">${Object.values(cur).map(([label, now, top]) => `<div class="meter"><span class="lbl">${esc(label)}</span><span class="val">${now} <span class="t3 xs">/ ${top}</span></span><div class="track"><i class="${now >= 80 ? 'hi' : now < 55 ? 'lo' : 'mid'}" style="width:${now}%"></i></div></div>`).join('')}</div></section>`;
  }

  function careerNarrative(c) {
    const d=HL.Legacy.careerReport(c), P=c.ptotals||{},T=c.totals||{},top=c.seasons.filter(s=>!s.minors).slice().sort((a,b)=>(b.ppg||0)-(a.ppg||0)).slice(0,3);
    const honors=d.honors.length ? d.honors.map(x=>'<article class="dossier-honor"><div class="caps">Career identity earned</div><h3>'+esc(x.name)+'</h3><p>'+esc(x.why)+'</p></article>').join('') : '<article class="dossier-honor"><h3>A meaningful career</h3><p>No specialty award was earned just for having a high attribute. Production matters.</p></article>';
    const moments=top.map(s=>'<article class="dossier-honor"><div class="caps">'+s.yr+'-'+(s.yr+1)+' · '+esc(s.team.name)+'</div><h3>'+(s.ppg||0).toFixed(1)+' PPG</h3><p>'+(s.rpg||0).toFixed(1)+' rebounds · '+(s.apg||0).toFixed(1)+' assists</p></article>').join('');
    const doubt=(d.ts<.54?'Efficiency leaves room for criticism. ':'Production supports the case. ')+(c.rings>=3?'A dynasty requires teammates and circumstances too.':'Team success is one part of the historical argument.');
    return '<section class="block dossier"><header><h3>The full career verdict</h3><span class="ml-auto t3 sm">Evidence · specialization · storytelling</span></header><div class="body stack">'+
      '<div class="dossier-lead">'+esc(d.chapters[0])+'</div>'+
      '<div class="dossier-grid">'+honors+'</div>'+
      '<div class="dossier-two"><article class="dossier-honor"><div class="caps">The strongest argument</div><h3>Prime and longevity</h3><p>'+esc(d.chapters[1])+'</p></article><article class="dossier-honor"><div class="caps">What critics would say</div><h3>The counterargument</h3><p>'+esc(doubt)+'</p></article></div>'+
      d.chapters.slice(2).map(t=>'<p class="dossier-chapter">'+esc(t)+'</p>').join('')+
      (moments?'<div class="caps">Signature scoring seasons</div><div class="dossier-grid">'+moments+'</div>':'')+
      '<details><summary>How honors are decided</summary><p>Historical legacy rank is a weighted comparison with real players. Specialty titles require enough NBA years, actual simulated production and, where noted, scouting strengths. Neither a 99 rating nor the highest numerical score automatically makes a player the GOAT.</p></details></div></section>';
  }

  function resultView() {
    const c = st.career;
    const [tier, line] = verdict(c);
    const count = name => c.awards.filter(a => a.award === name).length;
    const comp = HL.HISTORY.players[c.legacy.closest.pid][0];
    const T = c.totals, P = c.ptotals;
    return `<section class="block"><div class="body stack">
          <div class="caps">The verdict</div><h1 style="font-size:56px;line-height:.9">${tier}</h1><div class="t2">${esc(line)}</div>
          <div class="cols c2"><div>
            <div class="kv"><span>All-time legacy rank</span><b>${c.legacy.rank > 1500 ? 'Outside the top 1,500' : '#' + c.legacy.rank}</b></div>
            <div class="kv"><span>Legacy score</span><b>${c.legacy.score}</b></div>
            ${c.legacy.score >= 2 ? `<div class="kv"><span>Most comparable career</span><b>${esc(comp)}</b></div>` : ''}
            <div class="kv"><span>Drafted</span><b>${c.pick ? `#${c.pick} overall · ${c.debut}` : `Undrafted · ${c.debut}`}</b></div>
            <div class="kv"><span>How it ended</span><b>${esc(c.end || '')}</b></div>
            <div class="kv"><span>Teams</span><b>${c.teams.length}</b></div>
          </div><div>
            <div class="kv"><span>Rings · MVPs · All-Star</span><b>${c.rings} · ${count('MVP')} · ${count('All-Star')}</b></div>
            <div class="kv"><span>Career</span><b>${pg(T, 'pts').toFixed(1)} PPG · ${pg(T, 'reb').toFixed(1)} RPG · ${pg(T, 'ast').toFixed(1)} APG</b></div>
            <div class="kv"><span>Totals</span><b>${Math.round(T.pts).toLocaleString()} pts · ${Math.round(T.reb).toLocaleString()} reb · ${Math.round(T.ast).toLocaleString()} ast</b></div>
            <div class="kv"><span>Playoffs</span><b>${P.g} games · ${pg(P, 'pts').toFixed(1)} PPG</b></div>
            <div class="kv"><span>Career earnings</span><b>${U.money(c.earnings)}</b></div>
            <div class="kv"><span>Games</span><b>${T.g.toLocaleString()}</b></div>
          </div></div>
          <div class="row"><button class="btn go" data-new>Build another</button></div>
        </div></section>
      ${careerNarrative(c)}
      ${c.seasons.length ? `<details class="dossier-data"><summary>Expand all ${c.seasons.length} seasons of statistics and awards</summary>${careerTable(c)}</details>` : ''}
      ${c.log.length ? timeline(c) : ''}`;
  }

  const ordinal = n => U.ordinal(n);

  // Run an async step with a progress card.
  async function busy(title, sub, fn) {
    st.busy = { title, sub, pct: 0 };
    render();
    await new Promise(r => setTimeout(r, 30));
    try { await fn(); } catch (e) { console.error(e); U.toast('Something went wrong: ' + esc(e.message)); }
    st.busy = null;
    render();
    window.scrollTo(0, 0);
  }
  const setPct = (pct, sub) => { if (!st.busy) return; st.busy.pct = pct; if (sub) st.busy.sub = sub; const bar = document.querySelector('.simcard .track i'); if (bar) bar.style.width = pct + '%'; const s = document.querySelector('.block .body .t2.sm'); if (s && sub) s.textContent = sub; };

  function bind() {
    const app = U.app();
    app.querySelector('[data-home]').onclick = () => HL.App.title();
    app.querySelectorAll('[data-new]').forEach(b => b.onclick = () => { st = null; cache = null; render(); });
    FX.bindSound(app);
    const sp = app.querySelector('[data-spin]'); if (sp) sp.onclick = () => { if (st.phase === 'spin') spin('all'); };
    app.querySelectorAll('[data-skip]').forEach(b => b.onclick = () => { const k = b.dataset.skip; if (!st.skips[k] || st.phase !== 'hand') return; st.skips[k]--; spin(k); });
    app.querySelectorAll('.hand .gcard').forEach(card => card.onclick = () => { if (!card.classList.contains('down')) take(+card.dataset.hand); });
    FX.tilt(app);
    const nm = app.querySelector('[data-name]'); if (nm) nm.oninput = () => { st.name = nm.value || 'Your Player'; };
    const db = app.querySelector('[data-debut]'); if (db) db.onchange = () => { st.debut = +db.value; };
    const c = st.career;
    app.querySelectorAll('[data-begin]').forEach(b => b.onclick = async () => {
      await busy(`The ${st.debut} draft`, 'Loading the real league…', async () => {
        st.career = newCareer();
        await draft(st.career);
        if (b.dataset.begin === 'auto') { st.career.stage = null; await runRest(); }
      });
      const cc = st.career;
      if (cc.done) return verdictBanner(cc);
      await FX.banner(cc.pick ? `#${cc.pick}` : 'UNDRAFTED', cc.minors ? 'Heading to the minor leagues.' : `${esc(fullName(cc.teamMeta))} select ${esc(cc.me.name)}.`, { tier: !cc.pick ? 0 : cc.pick <= 3 ? 4 : cc.pick <= 10 ? 3 : cc.pick <= 30 ? 2 : 1, kicker: `Draft night · ${cc.debut}`, ms: 2400 });
    });
    const play = async () => {
      await busy(`Playing the ${yrLabel(c.yr)} season`, c.minors ? 'In the minor leagues' : `With the ${fullName(c.teamMeta)}`, async () => {
        if (c.pending) decide(c, { type: 'stay' });
        c.stage = null;
        await playSeason(c);
        await offseason(c);
      });
      await celebrate(c);
    };
    app.querySelectorAll('[data-play]').forEach(b => b.onclick = play);
    app.querySelectorAll('[data-simrest]').forEach(b => b.onclick = async () => { await busy('Simulating the rest of the career', '', async () => { c.stage = null; await runRest(); }); if (st.career.done) verdictBanner(st.career); });
    app.querySelectorAll('[data-sign]').forEach(b => b.onclick = () => { decide(c, { type: 'sign', i: +b.dataset.sign }); render(); });
    app.querySelectorAll('[data-trade]').forEach(b => b.onclick = () => { decide(c, { type: 'trade' }); U.toast(`${esc(c.log[c.log.length - 1].text)}.`); render(); });
    app.querySelectorAll('[data-minors]').forEach(b => b.onclick = () => { decide(c, { type: 'minors' }); render(); });
    app.querySelectorAll('[data-retire]').forEach(b => b.onclick = () => {
      if (!confirm('Retire now? The career ends and you get the verdict.')) return;
      if (!c.pending) c.pending = { type: 'season', offers: [], notes: [] };
      decide(c, { type: 'retire' }); render();
    });
  }
  // The payoff after each season: numbers count up, big honors get their own moment.
  async function celebrate(c) {
    const s = c.seasons[c.seasons.length - 1];
    if (s && !s.minors) {
      document.querySelectorAll('.statstrip b').forEach(b => { const v = parseFloat(b.textContent); if (!isNaN(v)) { const dec = (b.textContent.split('.')[1] || '').length; FX.countUp(b, v, 900, x => x.toFixed(dec)); } });
      const award = n => s.awards.find(a => awardName(a) === n);
      const over = n => { const a = award(n); return a && a.over ? `Over ${esc(a.over)}` : ''; };
      const firstAllStar = award('All-Star') && c.awards.filter(a => a.award === 'All-Star').length === 1;
      const queue = [];
      if (s.champion) queue.push(['CHAMPIONS', `${esc(fullName(s.team))} · ${yrLabel(s.yr)}`, 4]);
      if (award('Finals MVP')) queue.push(['FINALS MVP', '', 4]);
      if (award('MVP')) queue.push(['MVP', over('MVP'), 4]);
      if (award('DPOY')) queue.push(['DEFENSIVE PLAYER OF THE YEAR', over('DPOY'), 3]);
      if (award('ROY')) queue.push(['ROOKIE OF THE YEAR', over('ROY'), 3]);
      if (award('Scoring title')) queue.push(['SCORING TITLE', over('Scoring title'), 3]);
      if (award('All-NBA 1st') && !award('MVP')) queue.push(['ALL-NBA FIRST TEAM', '', 3]);
      if (firstAllStar) queue.push(['ALL-STAR', 'First selection', 2]);
      for (const [t, sub, tier] of queue.slice(0, 3)) await FX.banner(t, sub, { tier, kicker: yrLabel(s.yr), ms: 2200 });
      if (!queue.length && s.injury && s.injury.games >= 30) FX.shake(document.querySelector('.page'), 0.6);
    }
    if (c.done) await verdictBanner(c);
  }
  function verdictBanner(c) {
    const [tier, line] = verdict(c);
    const t = ['BROKEN', 'THE GOAT'].includes(tier) ? 4 : ['ALL-TIME GREAT', 'HALL OF FAMER'].includes(tier) ? 3 : ['SUPERSTAR', 'ALL-STAR'].includes(tier) ? 2 : ['STARTER', 'ROLE PLAYER'].includes(tier) ? 1 : 0;
    return FX.banner(tier, esc(line), { tier: t, kicker: 'The verdict', ms: 3600 });
  }
  async function runRest() {
    const c = st.career;
    await simRest(c, cc => setPct(Math.min(100, Math.round((cc.age - 19) / 22 * 100)), `${yrLabel(cc.yr)} · age ${cc.age} · ${cc.seasons.length} seasons`));
  }

  function draftView(hide, reveal) {
    const fm = st.team ? tm(st.team) : null, cat = st.cat ? catOf(st.cat) : null;
    const show = fm && cat && st.phase === 'hand';
    const reel = (label, inner) => `<div class="reel ${show ? 'landed' : ''}"><div class="reel-label">${label}</div><div class="reel-win"><div class="reel-item ${label === 'Skill' ? 'txt' : ''}" style="height:96px">${inner}</div></div></div>`;
    const reels = `<div id="reels"><div class="reels">${reel('Franchise', show ? U.logo(fm, 62) : '?')}${reel('Decade', show ? `${st.decade}s` : '?')}${reel('Skill', show ? esc(cat[1]) : '?')}</div></div>`;
    const controls = `<div class="row" style="justify-content:center;gap:10px;margin-top:16px;flex-wrap:wrap">
        <button class="btn spin" data-spin ${st.phase !== 'spin' ? 'disabled' : ''}>${Object.keys(st.picks).length ? `Spin skill ${Object.keys(st.picks).length + 1}` : 'Spin'}</button>
        <button class="btn" data-skip="team" ${st.skips.team && st.phase === 'hand' ? '' : 'disabled'}>Team skip (${st.skips.team})</button>
        <button class="btn" data-skip="era" ${st.skips.era && st.phase === 'hand' ? '' : 'disabled'}>Decade skip (${st.skips.era})</button>
        <button class="btn" data-skip="stat" ${st.skips.stat && st.phase === 'hand' ? '' : 'disabled'}>Skill skip (${st.skips.stat})</button></div>
      ${show ? `<div class="result">${esc(cat[1])} from the ${esc(fm.city)} ${esc(fm.name)} · ${st.decade}s</div>` : ''}`;
    const cards = show ? `<div class="stack" style="gap:8px;margin-top:18px"><div class="t2 sm" style="text-align:center">${st.hand.length ? `Top ${st.hand.length} by ${esc(cat[1].toLowerCase())} · best-first. Tap a card to select.` : 'Nobody to deal from this club and decade. Use a skip.'}</div>
      <div class="hand">${st.hand.map((c, i) => { const bio = HL.HISTORY.players[c.row.pid]; const r = c.row; const v = skillValue(c, cat);
        return HL.Cards.card({ pid: r.pid, name: bio[0], nbaId: bio[1], team: tm(C().LINEAGE[c.club]) || fm, pos: r.pos, rating: v, ratingLabel: cat[0] === 'body' ? 'FRAME' : SHORT[cat[0]], meta: `#${i + 1} · ${yrLabel(c.season)} · ${c.club}`,
          stat: cat[0] === 'body' ? [['HT', HL.fmtHeight(bio[3])], ['WT', bio[4]]] : [['PTS', r.pts], ['REB', r.trb], ['AST', r.ast]], hidden: hide, down: !!reveal, attrs: `data-hand="${i}"` }); }).join('')}</div></div>` : '';
    const intro = !st.cat && st.phase === 'spin' && !Object.keys(st.picks).length ? '<p class="t2" style="text-align:center;max-width:52ch;margin:14px auto 0">Each spin lands a franchise, a decade and a skill. You get dealt five players who played there. Take one player\'s skill. Thirteen skills build one player.</p>' : '';
    return `<section class="machine"><div class="lights">${'<i></i>'.repeat(14)}</div>${reels}${intro}${controls}${cards}</section>`;
  }

  function setupScreen() {
    U.applyTeamTheme(null); U.setEra('modern');
    let mode = 'classic';
    const draw = () => {
      U.app().innerHTML = `<div class="frame"><div class="masthead"><div class="bar"><div class="wordmark" data-home>Hoops<i>Life</i></div><div class="mainnav"><button class="on">Skill Draft Career</button></div></div></div>
      <div class="page" style="max-width:900px"><div class="page-title"><h2>Skill Draft Career</h2></div>
      <section class="block"><div class="body stack">
        <p class="t2" style="margin:0">Build one player out of real players' skills. Each spin gives a franchise, a decade and a skill (inside scoring, three-point shooting, rebounding, your body…). Take that skill from anyone who played there. Then the game simulates your whole career in the real league and ranks it against every real NBA career. Broken, GOAT, all-time great… or a bust.</p>
        <div class="setting" style="flex-wrap:wrap"><div class="grow"><b>Mode</b><div class="d">HoopIQ hides the ratings.</div></div>${U.seg('mode', [['classic', 'Classic'], ['hoopiq', 'HoopIQ']], mode)}</div>
        <div class="row"><button class="btn go big ml-auto" data-go>Start</button></div>
      </div></section></div></div>`;
      const app = U.app();
      app.querySelector('[data-home]').onclick = () => HL.App.title();
      app.querySelectorAll('[data-seg] button').forEach(b => b.onclick = () => { mode = b.dataset.v; draw(); });
      app.querySelector('[data-go]').onclick = () => { newRun(mode); render(); };
    };
    draw();
  }

  // Headless runs (tools/test-skilldraft.js): picks = { cat: { row, season } }.
  async function simulate(picks, name = 'Test Player', debut = null) {
    newRun('classic', debut);
    st.picks = picks; st.name = name;
    const c = st.career = newCareer();
    await draft(c);
    c.stage = null;
    await simRest(c);
    if (!c.done) end(c, 'Simulation limit');
    return { ...c, verdict: verdict(c) };
  }

  return { open: () => { st = null; cache = null; render(); }, CATS, simulate, ratingsAt };
})();
