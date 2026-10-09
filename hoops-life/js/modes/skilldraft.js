// Skill Draft Career: build one player out of real players' skills, simulate the whole career
// in the real league, and get a verdict measured against every real NBA career (legacy score).
window.HL = window.HL || {};

HL.SkillDraft = (function () {
  const U = HL.UI, esc = U.esc, R = HL.RNG;
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
    st = { mode, debut: debut || randomDebut(), picks: {}, team: null, decade: null, cat: null, skips: { team: 1, era: 1, stat: 1 }, spinning: false, career: null, name: 'Your Player' };
  }
  const remaining = () => CATS.filter(c => !st.picks[c[0]]).map(c => c[0]);
  const decades = [1960, 1970, 1980, 1990, 2000, 2010, 2020];

  async function spin(what = 'all') {
    st.spinning = true; render();
    if (what === 'all' || what === 'stat') st.cat = R.pick(remaining().filter(c => c !== st.cat || remaining().length === 1));
    if (what === 'all' || what === 'era') st.decade = R.pick(decades.filter(d => d !== st.decade));
    await C().loadDecade(st.decade);
    const fr = C().franchisesIn(st.decade);
    if (what === 'all' || what === 'team' || !fr.includes(st.team)) st.team = R.pick(fr.filter(t => t !== st.team || fr.length === 1));
    setTimeout(() => { st.spinning = false; render(); }, 600);
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

  // ---------- career sim ----------
  // Every season is played in that year's real league (real rosters, rules, schedule length and
  // playoff format). Seasons past the latest data replay the latest league.
  const ME_ID = 999999;
  const LIN = () => C().LINEAGE;
  const awardIndex = {};
  function realAwards(yr) {
    if (!awardIndex.built) {
      for (const [pid, list] of Object.entries(HL.HISTORY.awards)) for (const [y, a] of list) ((awardIndex[y] = awardIndex[y] || {})[a] = awardIndex[y][a] || []).push(pid);
      awardIndex.built = true;
    }
    return awardIndex[yr] || {};
  }
  const nameOf = pid => (HL.HISTORY.players[pid] || [pid])[0];
  // Voting value, calibrated on 1955-2025: ranking real seasons by it recovers 78% of All-NBA picks and 66% of MVPs.
  const voteValue = (ppg, ovr, rpg, apg, g, games) => { const avail = Math.min(1, g / (games * 0.85)); return (ppg * 0.6 + (ovr - 75) + rpg * 0.25 + apg * 0.35) * avail * avail; };
  const defValue = (a, g, games) => (Math.max(a.perD, a.intD) * 0.6 + (a.steal + a.block) * 0.2) * Math.min(1, g / (games * 0.85));
  const metaOf = t => ({ abbr: t.abbr, bref: t.bref, city: t.city, name: t.name, color: t.color, color2: t.color2, espn: t.espn });

  async function simCareer(onProgress) {
    const prime = buildPrime();
    const debut = st.debut;
    const me = HL.createPlayer({ name: st.name, pos: prime.pos, age: 19, height: prime.height, ovr: 60, arch: 'twoway', real: false, season: debut });
    me.id = ME_ID; me.weight = prime.weight;
    const primeOvr = HL.computeOvr(prime.attrs, prime.pos);
    // Work ethic decides how close the player gets to the prime he was drafted for.
    const we = me.traits.workEthic;
    const reach = HL.clamp(0.88 + (we - 50) / 400 + R.normal(0, 0.04), 0.78, 1.04);
    const skillGap = k => ['speed', 'vert', 'str', 'dur', 'stam'].includes(k) ? 3 : 13;
    const at = (age) => {
      const out = {};
      const grow = age <= 19 ? 0 : age >= 26 ? 1 : (age - 19) / 7;
      const decline = age <= 29 ? 0 : (age - 29) * (age >= 33 ? 2.6 : 1.6);
      for (const k of HL.ATTR_KEYS) {
        const target = prime.attrs[k] * reach + (1 - reach) * 50;
        const phys = ['speed', 'vert', 'stam'].includes(k) ? 1.5 : ['iq', 'ft', 'pass'].includes(k) ? 0.3 : 1;
        out[k] = Math.round(HL.clamp(target - skillGap(k) * (1 - grow) - decline * phys + R.normal(0, 1.5), 25, 99));
      }
      return out;
    };
    const seasons = [];
    const career = { awards: [], rings: 0, teams: [], pick: null, primeOvr, reach, debut, altered: [], totals: { g: 0, pts: 0, reb: 0, ast: 0 } };
    let franchise = null;
    for (let age = 19; age <= 42; age++) {
      const yr = debut + (age - 19);
      const key = String(Math.min(yr, HL.LATEST_SEASON));
      await HL.History.load(key);
      const L = HL.League.createFromSeason({ seasonKey: key, seed: R.int(1, 1e9) });
      me.age = age; me.attrs = at(age); me.ovr = HL.computeOvr(me.attrs, me.pos); me.tend = HL.defaultTendencies(me);
      const byRecord = L.teams.slice().sort((a, b) => a.real.w / (a.real.w + a.real.l) - b.real.w / (b.real.w + b.real.l));
      const fr = t => LIN()[t.bref] || t.bref;
      let team;
      if (age === 19) {
        // Draft: the slot follows the rookie's rating; the team holding it is the one with that record.
        const n = L.teams.length;
        const slot = Math.max(1, Math.round(31 - (me.ovr - 58) * 1.6 + R.normal(0, 3)));
        career.pick = slot <= n * 2 ? slot : null; // two rounds; anyone lower goes undrafted
        team = byRecord[((career.pick || R.int(1, n)) - 1) % n];
      } else {
        team = L.teams.find(t => fr(t) === franchise);
        // Free agency at 23 (end of the rookie deal), 27, 31 and 34: stars chase contenders, others take what they can get.
        const fa = [23, 27, 31, 34].includes(age);
        if (fa || !team) {
          const best = byRecord.slice().reverse();
          const n = best.length;
          const nxt = me.ovr >= 86 ? best[R.int(0, Math.min(4, n - 1))] : me.ovr >= 78 ? best[R.int(0, Math.floor(n / 2))] : best[R.int(Math.floor(n / 3), n - 1)];
          if (!team || (nxt && fr(nxt) !== franchise && R.chance(me.traits.loyalty > 70 ? 0.35 : 0.7))) {
            if (!team && franchise) career.altered.push({ season: yr, text: `${seasons[seasons.length - 1].teamMeta.name} no longer exist; signs elsewhere` });
            team = nxt || best[0];
          }
        }
      }
      if (fr(team) !== franchise) { franchise = fr(team); career.teams.push(`${team.city} ${team.name}`); }
      // Major injury risk grows with age and poor durability.
      let missed = 0;
      if (R.chance(0.05 + Math.max(0, 70 - me.attrs.dur) * 0.004 + Math.max(0, age - 30) * 0.015)) {
        const inj = HL.rollInjury(1.2);
        missed = Math.min(L.games, inj.games);
        if (inj.lasting) for (const k in inj.lasting) prime.attrs[k] = HL.clamp(prime.attrs[k] + inj.lasting[k], 25, 99);
        if (missed >= 20) career.awards.push({ season: yr, award: `Injury: ${inj.name}` });
      }
      // Retirement: out of the league, or calls it when the skills are gone.
      if (age > 19 && ((me.ovr < 64 && age >= 24) || (age >= 35 && me.ovr < 72 && R.chance(0.5)) || age >= 41)) break;
      // Not good enough for an NBA roster yet: a season in the minor leagues or overseas.
      if (me.ovr < 62) {
        seasons.push({ age, yr, key, minors: true, ovr: me.ovr, g: 0, ppg: 0, rpg: 0, apg: 0, ts: 0, w: 0, l: 0, awards: [], altered: [] });
        onProgress && onProgress(age);
        continue;
      }
      const res = simSeason(L, team, me, missed, yr);
      seasons.push({ age, yr, key, team: team.abbr, teamMeta: metaOf(team), ovr: me.ovr, ...res });
      career.totals.g += res.g; career.totals.pts += res.ppg * res.g; career.totals.reb += res.rpg * res.g; career.totals.ast += res.apg * res.g;
      for (const a of res.awards) career.awards.push({ season: yr, award: a.award || a, over: a.over });
      for (const a of res.altered) career.altered.push({ season: yr, text: a });
      if (res.champion) career.rings++;
      onProgress && onProgress(age);
      await new Promise(r => setTimeout(r, 0));
    }
    st.career = { me, seasons, ...career, legacy: legacyOf(seasons, career) };
  }

  // One season: the team's real schedule with the full sim, then the playoff path in that year's format.
  function simSeason(L, team, me, missed, yr) {
    const roster = HL.League.teamPlayers(team.id).sort((a, b) => b.ovr - a.ovr).slice(0, 14);
    const realRows = HL.History.seasonRows(String(L.season));
    // Minutes: a coach plays him by quality, up to what that era's stars played.
    const stars = realRows.filter(r => r.g >= L.games / 2).sort((a, b) => b.ovr - a.ovr).slice(0, 10);
    const starMin = Math.min(44, stars.reduce((s, r) => s + r.mpg, 0) / Math.max(1, stars.length));
    me.teamId = team.id;
    me.realMpg = HL.clamp((me.ovr - 55) * 1.15, 8, starMin);
    me.stats = {};
    const tObj = { id: team.id, abbr: team.abbr, strategy: HL.DEFAULT_STRATEGY(), players: [me, ...roster] };
    const rules = Object.assign({}, L.rules, { profile: L.profile });
    const objOf = t => ({ id: t.id, abbr: t.abbr, strategy: t.strategy, players: HL.League.teamPlayers(t.id) });
    const line = HL.blankStatLine();
    let w = 0, l = 0, gi = 0;
    for (const gm of L.schedule) {
      if (gm.home !== team.id && gm.away !== team.id) continue;
      me.injury = gi++ >= missed ? null : { name: 'Injured', games: 1 };
      const home = gm.home === team.id;
      const opp = L.teams[home ? gm.away : gm.home];
      const res = home ? HL.simGame(tObj, objOf(opp), rules) : HL.simGame(objOf(opp), tObj, rules);
      const mine = home ? res.home : res.away, theirs = home ? res.away : res.home;
      if (mine.score > theirs.score) w++; else l++;
      const b = mine.box[me.id];
      if (b) for (const k in line) line[k] += b[k] || 0;
      for (const p of tObj.players) if (p !== me) p.injury = null;
    }
    me.injury = null;
    const g = line.gp || 0, games = w + l;
    const ppg = g ? line.pts / g : 0, rpg = g ? (line.orb + line.drb) / g : 0, apg = g ? line.ast / g : 0;
    const ts = (line.fga + 0.44 * line.fta) ? line.pts / (2 * (line.fga + 0.44 * line.fta)) : 0;
    const wp = games ? w / games : 0;

    // ---- Awards: voted against that season's real players (with voting noise) ----
    const RA = realAwards(L.season);
    const yrNum = L.season;
    const field = realRows.map(r => {
      const main = r.stints.slice().sort((a, b) => b[1] - a[1])[0];
      const t = L.teams.find(x => x.bref === main[0]);
      const twp = t ? t.real.w / (t.real.w + t.real.l) : 0.5;
      return { pid: r.pid, v: voteValue(r.pts, r.ovr, r.trb, r.ast, r.g, L.games), wp: twp, def: defValue(HL.History.unpack(r.attrs, HL.HISTORY.attrs), r.g, L.games) };
    });
    const mine = { v: voteValue(ppg, me.ovr, rpg, apg, g, L.games) + R.normal(0, 1.2), wp };
    const above = field.filter(f => f.v > mine.v).length;
    const awards = [], altered = [];
    const nAllNba = ['All-NBA 1st', 'All-NBA 2nd', 'All-NBA 3rd'].map(k => (RA[k] || []).length);
    const nAllStar = (RA['All-Star'] || []).length;
    const mvpScore = x => x.v + (x.wp - 0.5) * 90;
    const realMvp = (RA['nba mvp'] || [])[0];
    if (realMvp && g >= L.games * 0.7 && field.every(f => mvpScore(f) < mvpScore(mine))) { awards.push({ award: 'MVP', over: nameOf(realMvp) }); altered.push(`MVP instead of ${nameOf(realMvp)}`); }
    if (nAllNba[0] && above < nAllNba[0]) awards.push('All-NBA 1st');
    else if (nAllNba[1] && above < nAllNba[0] + nAllNba[1]) awards.push('All-NBA 2nd');
    else if (nAllNba[2] && above < nAllNba[0] + nAllNba[1] + nAllNba[2]) awards.push('All-NBA 3rd');
    if (nAllStar && g >= L.games * 0.4 && above < nAllStar) awards.push('All-Star');
    const realDpoy = (RA['nba dpoy'] || [])[0];
    const myDef = defValue(me.attrs, g, L.games) + R.normal(0, 1.5);
    if (realDpoy && g >= L.games * 0.7 && field.every(f => f.def < myDef)) { awards.push({ award: 'DPOY', over: nameOf(realDpoy) }); altered.push(`DPOY instead of ${nameOf(realDpoy)}`); }
    const realRoy = (RA['nba roy'] || [])[0];
    if (me.age === 19 && realRoy) {
      const rr = field.find(f => f.pid === realRoy);
      if (rr && mine.v > rr.v) { awards.push({ award: 'ROY', over: nameOf(realRoy) }); altered.push(`Rookie of the Year instead of ${nameOf(realRoy)}`); }
    }

    // ---- Playoffs: that year's qualifying spots, format and opponents ----
    const fmt = HL.playoffFormat(yrNum);
    const realPlayoff = L.teams.filter(t => t.real.playoffs);
    const spots = realPlayoff.length || fmt.perConf * 2;
    const others = L.teams.filter(t => t.id !== team.id).map(t => ({ t, wp: t.real.w / (t.real.w + t.real.l) })).sort((a, b) => b.wp - a.wp);
    const seed = others.filter(o => o.wp > wp).length + 1;
    let champion = false, round = 0, made = seed <= spots;
    const realChamp = HL.HISTORY.champions[String(yrNum)];
    if (made) {
      const pool = others.slice(0, spots);
      const rounds = fmt.bestOf.length;
      const start = fmt.byes && seed <= fmt.byes * 2 ? 1 : 0;
      round = start;
      for (let r = start; r < rounds; r++) {
        // Later rounds draw from the stronger seeds.
        const hi = Math.max(0, Math.floor(pool.length * (rounds - 1 - r) / rounds)), lo = Math.max(0, Math.floor(pool.length * (rounds - 2 - r) / rounds));
        const opp = pool[R.int(Math.max(0, lo), Math.max(0, Math.min(pool.length - 1, hi)))].t;
        const need = Math.ceil(fmt.bestOf[r] / 2);
        let sw = 0, sl = 0;
        while (sw < need && sl < need) {
          const home = (sw + sl) % 2 === 0;
          const res = home ? HL.simGame(tObj, objOf(opp), rules) : HL.simGame(objOf(opp), tObj, rules);
          const a = home ? res.home : res.away, b = home ? res.away : res.home;
          if (a.score > b.score) sw++; else sl++;
        }
        if (sw < need) break;
        round++;
      }
      champion = round === rounds;
      if (champion) {
        awards.push('Champion');
        if (realChamp && LIN()[realChamp] !== LIN()[team.bref]) {
          const rc = L.teams.find(t => t.bref === realChamp);
          altered.push(`Won the title that went to the ${rc ? rc.name : realChamp}`);
        }
      }
    }
    const rcT = realChamp && L.teams.find(t => t.bref === realChamp);
    return { g, ppg, rpg, apg, ts, w, l, awards, altered, champion, playoffRound: round, made, rounds: fmt.bestOf.length, realChamp: rcT ? `${rcT.city} ${rcT.name}` : realChamp || null };
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
    if (lg.score > lg.top.score * 1.35) return ['BROKEN', 'This is a cheat code. Nobody in history comes close, and the league is already drafting a rule with your name on it.'];
    if (lg.rank === 1) return ['THE GOAT', `Ahead of ${HL.HISTORY.players[lg.top.pid][0]}. The debate is over.`];
    if (lg.rank <= 10) return ['ALL-TIME GREAT', `#${lg.rank} all-time. Mount Rushmore conversations include you.`];
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
  function render() {
    const app = U.app();
    if (!st) return setupScreen();
    const done = !remaining().length;
    const hide = st.mode === 'hoopiq';
    U.applyTeamTheme(st.team && !done ? tm(st.team) : null);
    let main;
    if (st.career) main = resultView();
    else if (st.simming) main = `<section class="block"><div class="body"><h3>Simulating your career…</h3><div class="t2 sm" style="margin-top:6px">Age ${st.simming} · ${st.debut + st.simming - 19}-${String(st.debut + st.simming - 18).slice(2)}. Every season is played in that year's real league with the full sim.</div><div class="simcard" style="width:auto;border:0;padding:0"><div class="track"><i style="width:${Math.round((st.simming - 19) / 22 * 100)}%"></i></div></div></div></section>`;
    else if (done) main = `<section class="block"><div class="body stack"><h3>Your player is built</h3><div class="setting"><div class="grow"><b>Name</b></div><input type="text" value="${esc(st.name)}" data-name maxlength="30"></div><div class="setting"><div class="grow"><b>Draft class</b><div class="d">You enter the real league in this draft and play every season against the real rosters of that year.</div></div>${debutSelect()}</div><button class="btn go big" data-career>Sim the whole career</button></div></section>`;
    else main = draftView(hide);
    const prime = done ? buildPrime() : null;
    app.innerHTML = `<div class="frame"><div class="masthead"><div class="bar"><div class="wordmark" data-home>Hoops<i>Life</i></div><div class="mainnav"><button class="on">Skill Draft Career</button></div>
      <div class="simbar"><span class="t2 sm">${CATS.length - remaining().length}/${CATS.length} skills</span><button class="btn small" data-new>New run</button></div></div></div>
      <div class="page"><div class="cols c-main"><div class="stack" style="gap:16px">${main}</div>
        <div class="stack" style="gap:16px"><section class="block"><header><h3>Your build</h3>${prime ? `<span class="ml-auto">${U.rating(HL.computeOvr(prime.attrs, prime.pos))}</span>` : ''}</header><div class="body flush">
          ${CATS.map(([id, label, keys]) => { const pk = st.picks[id]; if (!pk) return `<div class="res-row future" style="grid-template-columns:1fr auto"><span>${label}</span><span class="t3">—</span></div>`; const nm = HL.HISTORY.players[pk.row.pid][0]; const val = id === 'body' ? HL.fmtHeight(HL.HISTORY.players[pk.row.pid][3]) : avgOf(rowAttrs(pk.row), keys); return `<div class="res-row" style="grid-template-columns:1fr auto;cursor:default"><div><div>${label}</div><div class="t3 xs">${esc(nm)} · ${pk.season}-${String(pk.season + 1).slice(2)}</div></div><b class="num" style="font-size:18px">${hide && !st.career ? '?' : val}</b></div>`; }).join('')}
        </div></section></div></div></div></div>`;
    bind();
  }

  function draftView(hide) {
    if (!st.cat) return `<section class="block"><div class="body row" style="gap:16px"><div class="grow"><h3>Spin for your first skill</h3><div class="t2 sm" style="margin-top:4px">Each spin gives a franchise, a decade and a skill. Take that skill from any player who played there.</div></div><button class="btn go big" data-spin>Spin</button></div></section>`;
    const fm = tm(st.team), cat = catOf(st.cat);
    const reel = `<section class="block"><div class="body row wrap" style="gap:18px">
      ${st.spinning ? `<div class="row" style="gap:12px"><div class="spinbox">${U.logo(R.pick(HL.TEAMS), 60)}</div><div class="spinbox num" style="font-size:34px">${R.pick(decades)}s</div><div class="spinbox"><b>${esc(R.pick(CATS)[1])}</b></div></div>`
        : `<div class="row" style="gap:14px">${U.logo(fm, 60)}<div><div class="caps">${esc(cat[1])}</div><h2 style="font-size:28px">${esc(fm.city)} ${esc(fm.name)} · ${st.decade}s</h2></div></div>`}
      <div class="row ml-auto" style="gap:8px"><button class="btn small" data-skip="team" ${st.skips.team ? '' : 'disabled'}>Team skip (${st.skips.team})</button><button class="btn small" data-skip="era" ${st.skips.era ? '' : 'disabled'}>Era skip (${st.skips.era})</button><button class="btn small" data-skip="stat" ${st.skips.stat ? '' : 'disabled'}>Skill skip (${st.skips.stat})</button></div></div></section>`;
    if (st.spinning) return reel;
    const cands = C().candidates(st.team, st.decade).map(c => ({ ...c, val: cat[0] === 'body' ? HL.HISTORY.players[c.row.pid][3] : avgOf(rowAttrs(c.row), cat[2]) }))
      .sort((a, b) => b.val - a.val);
    return reel + `<section class="block"><header><h3>Take ${esc(cat[1].toLowerCase())} from…</h3></header><div class="body flush"><div class="tbl-wrap" style="max-height:62vh;overflow-y:auto"><table class="tbl"><thead><tr><th class="l">Player</th><th>Season</th><th>${cat[0] === 'body' ? 'Height / weight' : esc(cat[1])}</th><th></th></tr></thead><tbody>
      ${cands.slice(0, 40).map(c => { const bio = HL.HISTORY.players[c.row.pid]; return `<tr><td class="l"><div class="row">${U.face({ name: bio[0], nbaId: bio[1], real: true }, 28, fm)}<b>${esc(bio[0])}</b> <span class="t3 xs">${esc(bio[2])}</span></div></td><td>${c.season}-${String(c.season + 1).slice(2)}</td><td class="hi">${hide ? '?' : cat[0] === 'body' ? `${HL.fmtHeight(bio[3])} · ${bio[4]} lb` : c.val}</td><td><button class="btn small" data-take="${c.row.pid}">Take</button></td></tr>`; }).join('')}
    </tbody></table></div></div></section>`;
  }

  // Draft classes with the real players who came in that year (from the history database).
  function debutSelect() {
    const years = [];
    for (let y = HL.LATEST_SEASON; y >= 1947; y--) years.push(y);
    return `<select data-debut>${years.map(y => `<option value="${y}" ${y === st.debut ? 'selected' : ''}>${y} draft · ${y}-${String(y + 1).slice(2)} season${y > HL.LATEST_SEASON - 15 ? ' (later years replay ' + HL.LATEST_SEASON + '-' + String(HL.LATEST_SEASON + 1).slice(2) + ')' : ''}</option>`).join('')}</select>`;
  }
  const awardName = a => a.award || a;

  function resultView() {
    const c = st.career, me = c.me;
    const [tier, line] = verdict(c);
    const nba = c.seasons.filter(s => !s.minors);
    const lastTeam = nba.length ? nba[nba.length - 1].teamMeta : null;
    const count = name => c.awards.filter(a => a.award === name).length;
    const comp = HL.HISTORY.players[c.legacy.closest.pid][0];
    const T = c.totals;
    return `<div class="cols c2" style="align-items:stretch">
        <div style="max-width:340px">${HL.GFX.playerCard(Object.assign({}, me, { ovr: c.seasons.length ? Math.max(...c.seasons.map(s => s.ovr)) : me.ovr }), lastTeam, { sub: `Peak rating · ${c.seasons.length} seasons · ${c.teams.length} team${c.teams.length > 1 ? 's' : ''}` })}</div>
        <section class="block"><div class="body stack">
          <div class="caps">The verdict</div><h1 style="font-size:52px;line-height:.9">${tier}</h1><div class="t2">${esc(line)}</div>
          <div class="kv"><span>All-time legacy rank</span><b>${c.legacy.rank > 1500 ? 'Outside the top 1,500' : '#' + c.legacy.rank}</b></div>
          <div class="kv"><span>Legacy score</span><b>${c.legacy.score}</b></div>
          ${c.legacy.score >= 2 ? `<div class="kv"><span>Most comparable career</span><b>${esc(comp)}</b></div>` : ''}
          <div class="kv"><span>Drafted</span><b>${c.pick ? `#${c.pick} overall · ${c.debut}` : `Undrafted · ${c.debut}`}</b></div>
          <div class="kv"><span>Rings · MVPs · All-Star</span><b>${c.rings} · ${count('MVP')} · ${count('All-Star')}</b></div>
          <div class="kv"><span>Career</span><b>${T.g ? (T.pts / T.g).toFixed(1) : 0} PPG · ${T.g ? (T.reb / T.g).toFixed(1) : 0} RPG · ${T.g ? (T.ast / T.g).toFixed(1) : 0} APG</b></div>
          <div class="kv"><span>Totals</span><b>${Math.round(T.pts).toLocaleString()} pts · ${T.g} games</b></div>
          <button class="btn go" data-new>Build another</button>
        </div></section></div>
      ${c.altered.length ? `<section class="block"><header><h3>History you changed</h3><span class="ml-auto t3 sm">Real timeline vs yours</span></header><div class="body flush">${c.altered.map(a => `<div class="res-row" style="grid-template-columns:90px 1fr;cursor:default"><span class="t3">${a.season}-${String(a.season + 1).slice(2)}</span><span>${esc(a.text)}</span></div>`).join('')}</div></section>` : ''}
      <section class="block"><header><h3>Career</h3></header><div class="body flush"><div class="tbl-wrap"><table class="tbl"><thead><tr><th class="l">Season</th><th>Age</th><th class="l">Team</th><th>OVR</th><th>GP</th><th>PTS</th><th>REB</th><th>AST</th><th>TS%</th><th>Record</th><th class="l">Honors</th><th class="l">Real champion</th></tr></thead><tbody>
        ${c.seasons.map(s => { if (s.minors) return `<tr><td class="l">${s.yr}-${String(s.yr + 1).slice(2)}</td><td>${s.age}</td><td class="l t3">Minor leagues / overseas</td><td>${U.rating(s.ovr)}</td><td colspan="8"></td></tr>`; const t = s.teamMeta; return `<tr><td class="l">${s.yr}-${String(s.yr + 1).slice(2)}${s.key !== String(s.yr) ? ` <span class="t3 xs" title="Replays the ${s.key} league">*</span>` : ''}</td><td>${s.age}</td><td class="l"><div class="row">${U.logo(t, 20)} ${esc(t.name)}</div></td><td>${U.rating(s.ovr)}</td><td>${s.g}</td><td class="hi">${s.ppg.toFixed(1)}</td><td>${s.rpg.toFixed(1)}</td><td>${s.apg.toFixed(1)}</td><td>${(s.ts * 100).toFixed(1)}</td><td>${s.w}-${s.l}</td><td class="l sm">${s.awards.map(a => `<span class="tag ${['Champion', 'MVP'].includes(awardName(a)) ? 'team' : ''}" ${a.over ? `title="Over ${esc(a.over)}"` : ''}>${esc(awardName(a))}</span>`).join(' ')}${s.made && !s.champion ? ` <span class="t3 xs">${roundLabel(s)}</span>` : ''}${!s.made ? ' <span class="t3 xs">Missed playoffs</span>' : ''}</td><td class="l t3 sm">${s.key === String(s.yr) && s.realChamp ? esc(s.realChamp) : ''}</td></tr>`; }).join('')}
      </tbody></table></div></div></section>`;
  }

  function roundLabel(s) {
    const left = s.rounds - s.playoffRound;
    return left === 1 ? 'Lost in the Finals' : left === 2 ? 'Lost in the semifinals' : `Lost in round ${s.playoffRound + 1}`;
  }

  function bind() {
    const app = U.app();
    app.querySelector('[data-home]').onclick = () => HL.App.title();
    app.querySelectorAll('[data-new]').forEach(b => b.onclick = () => { st = null; render(); });
    const sp = app.querySelector('[data-spin]'); if (sp) sp.onclick = () => spin('all');
    app.querySelectorAll('[data-skip]').forEach(b => b.onclick = () => { const k = b.dataset.skip; if (!st.skips[k]) return; st.skips[k]--; spin(k); });
    app.querySelectorAll('[data-take]').forEach(b => b.onclick = () => {
      const c = C().candidates(st.team, st.decade).find(x => x.row.pid === b.dataset.take);
      st.picks[st.cat] = c;
      if (remaining().length) spin('all'); else { st.cat = null; render(); }
    });
    const nm = app.querySelector('[data-name]'); if (nm) nm.oninput = () => { st.name = nm.value || 'Your Player'; };
    const db = app.querySelector('[data-debut]'); if (db) db.onchange = () => { st.debut = +db.value; };
    const go = app.querySelector('[data-career]');
    if (go) go.onclick = async () => { st.simming = 19; render(); await simCareer(age => { st.simming = age; const bar = document.querySelector('.track i'); if (bar) bar.style.width = `${Math.round((age - 19) / 22 * 100)}%`; }); st.simming = null; render(); };
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
    await simCareer();
    const c = st.career;
    return { ...c, verdict: verdict(c) };
  }

  return { open: () => { st = null; render(); }, CATS, simulate };
})();
