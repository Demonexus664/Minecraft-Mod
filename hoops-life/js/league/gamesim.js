// Possession-by-possession game simulation.
// Calibrated against 2024-25 NBA league averages: pace ~99.6, ORtg ~113.7,
// ~14.3 TOV per 100 poss, FTA/FGA ~0.243, ~42% of shots from three.
window.HL = window.HL || {};

HL.DEFAULT_STRATEGY = () => ({
  pace: 50,            // 0 slow - 100 fast
  focus: 'balanced',   // balanced | inside | perimeter | star | motion
  defense: 'man',      // man | switch | drop | zone | press
  crash: 50,           // offensive rebounding aggression 0-100
  starters: null,      // [pid x5] or null for auto
  minutes: null,       // {pid: minutes} or null for auto
  closers: null,       // [pid x5] or null for auto
});

HL.DEFAULT_RULES = () => ({
  quarterLen: 12,
  otLen: 5,
  threePoint: true,
  threeValue: 3,
  fourPoint: false,     // a deep "4-point" zone
  shotClock: 24,
  shotClockReset: 14,   // after an offensive rebound; capped at the full shot clock
  backcourtSeconds: 8, // 0 disables the backcourt time limit
  offensiveThreeSeconds: true,
  defensiveThreeSeconds: true,
  illegalDefense: false, // zone defenses must use man coverage
  bonusFouls: 5,        // this team foul starts the penalty; 0 disables it
  foulOut: 6,
  handCheck: false,     // hand-checking allowed (pre-2004 style)
  tackling: false,      // the chaos rule
  noFouls: false,
  injuryMult: 1,
  homeCourt: 1,
});

(function () {
  const R = HL.RNG;
  const POS_IDX = { PG: 0, SG: 1, SF: 2, PF: 3, C: 4 };
  const isGuard = p => p.pos === 'PG' || p.pos === 'SG';
  const isBig = p => p.pos === 'PF' || p.pos === 'C';

  // ---------- Rotation ----------
  HL.autoStarters = function (players) {
    const pool = players.slice().sort((a, b) => b.ovr - a.ovr);
    const starters = [];
    for (const pos of HL.POSITIONS) {
      let pick = pool.find(p => p.pos === pos && !starters.includes(p));
      if (!pick) {
        const idx = POS_IDX[pos];
        pick = pool.find(p => !starters.includes(p) && Math.abs(POS_IDX[p.pos] - idx) <= 1);
      }
      if (pick) starters.push(pick);
    }
    // If the best player overall was left out (e.g. two great PGs), swap him in for the weakest starter.
    for (const p of pool.slice(0, 3)) {
      if (!starters.includes(p) && starters.length === 5) {
        const weakest = starters.slice().sort((a, b) => a.ovr - b.ovr)[0];
        if (p.ovr - weakest.ovr >= 4) starters[starters.indexOf(weakest)] = p;
      }
    }
    while (starters.length < 5 && pool.length > starters.length) {
      starters.push(pool.find(p => !starters.includes(p)));
    }
    return starters;
  };

  HL.autoMinutes = function (players, starters, totalMinutes = 240) {
    const bench = players.filter(p => !starters.includes(p)).sort((a, b) => b.ovr - a.ovr);
    const mins = {};
    // Real players: the healthy rotation gets its real minutes; the end of the bench gets what's left
    // (like a real coach, not a proportional cut for everyone).
    if (players.filter(p => p.realMpg).length >= 7) {
      const want = p => p.realMpg != null ? p.realMpg : Math.max(0, (p.ovr - 60) * 0.8);
      // Players with a set role (minutesLock: game plans, a career player's earned minutes) are slotted first.
      const order = players.slice().sort((a, b) => (!!b.minutesLock - !!a.minutesLock) || (starters.includes(b) - starters.includes(a)) || (want(b) - want(a)));
      let left = totalMinutes;
      for (const p of order) {
        const m = Math.min(starters.includes(p) && !p.minutesLock ? Math.max(want(p), 24) : want(p), left, 46);
        mins[p.id] = Math.max(0, m);
        left -= mins[p.id];
      }
      if (left > 0) for (const p of order.slice(0, 8)) mins[p.id] += left / 8; // short-handed: starters play more
      return mins;
    }
    const sTemplate = [34, 33, 32, 31, 30];
    const bTemplate = [24, 20, 16, 12, 8, 0, 0, 0, 0, 0];
    starters.slice().sort((a, b) => b.ovr - a.ovr).forEach((p, i) => {
      mins[p.id] = sTemplate[i] + HL.clamp((p.ovr - 82) * 0.35, -4, 3);
    });
    bench.forEach((p, i) => {
      const t = bTemplate[i] ?? 0;
      mins[p.id] = t > 0 ? Math.max(0, t + (p.ovr - 72) * 0.5) : 0;
    });
    // Normalize to the game total.
    const sum = Object.values(mins).reduce((s, v) => s + v, 0) || 1;
    for (const id in mins) mins[id] = mins[id] * totalMinutes / sum;
    return mins;
  };

  function prepTeam(team, rules) {
    const strat = Object.assign(HL.DEFAULT_STRATEGY(), team.strategy || {});
    if (rules.illegalDefense && strat.defense === 'zone') strat.defense = 'man';
    let avail = team.players.filter(p => !p.injury || p.injury.games <= 0);
    if (avail.length < 5) {
      // Not enough healthy bodies: the least-injured players play hurt.
      const hurt = team.players.filter(p => !avail.includes(p)).sort((a, b) => a.injury.games - b.injury.games);
      avail = avail.concat(hurt.slice(0, 5 - avail.length));
    }
    let starters = null;
    if (strat.starters) {
      starters = strat.starters.map(id => avail.find(p => p.id === id)).filter(Boolean);
      if (starters.length < 5) starters = null;
    }
    starters = starters || HL.autoStarters(avail);
    const regMin = rules.quarterLen * 4 * 5;
    let mins = null;
    if (strat.minutes) {
      mins = {};
      for (const p of avail) mins[p.id] = strat.minutes[p.id] ?? 0;
      const sum = Object.values(mins).reduce((s, v) => s + v, 0);
      if (sum < 100) mins = null;
      else for (const id in mins) mins[id] = mins[id] * regMin / sum;
    }
    mins = mins || HL.autoMinutes(avail, starters, regMin);
    const st = {};
    for (const p of avail) {
      st[p.id] = { p, played: 0, target: (mins[p.id] || 0) * 60, energy: 1, fouls: 0, out: false, line: HL.blankStatLine() };
    }
    return { team, strat, avail, starters, st, onCourt: [], score: 0, quarters: [], teamFouls: 0 };
  }

  // ---------- Lineup selection ----------
  function chooseLineup(T, ctx) {
    const { remaining, quarterStart, quarter, diff, clutchTime, garbage, foulOut } = ctx;
    const cands = T.avail.filter(p => !T.st[p.id].out);
    const scored = cands.map(p => {
      const s = T.st[p.id];
      const need = (s.target - s.played) / Math.max(60, remaining);
      // Iron-man roles (40+ minute targets, common before the 1980s) barely rest.
      const ironMan = s.target > 38 * 60;
      let score = need * (ironMan ? 3.2 : 2.2) + (s.energy - 0.7) * (ironMan ? 0.5 : 1.5);
      if (T.onCourt.includes(p)) score += 0.35;
      if (s.target <= 0) score -= 3;
      if (quarterStart && (quarter === 1 || quarter === 3) && T.starters.includes(p)) score += 4;
      if (clutchTime) {
        const closers = T.strat.closers;
        if (closers ? closers.includes(p.id) : true) score += (p.ovr - 70) * 0.08 + (closers ? 2 : 0);
      }
      if (garbage && !(ironMan && Math.abs(diff) < 30)) score += T.starters.includes(p) ? -3 : 1 - (p.ovr - 70) * 0.03;
      if (s.energy < (ironMan ? 0.15 : 0.35)) score -= 2;
      // Foul trouble: coaches sit a player who is one foul over the line for the quarter
      // (2 in the 1st, 3 in the 2nd, 4 in the 3rd, 5 in the 4th) until crunch time.
      if (foulOut > 0 && !(quarter >= 4 && remaining <= 300)) {
        const allowed = foulOut - Math.max(1, 5 - Math.min(quarter, 4));
        if (s.fouls >= allowed) score -= ironMan ? 2 : 5.5;
      }
      return { p, score };
    }).sort((a, b) => b.score - a.score);

    let lineup = scored.slice(0, 5).map(x => x.p);
    // Keep the floor playable: at least one guard and one big if we have them.
    const rest = scored.slice(5).map(x => x.p);
    const ensure = (test) => {
      if (lineup.some(test)) return;
      const inc = rest.find(test);
      if (!inc) return;
      const worst = lineup.slice().reverse().find(p => !test(p));
      lineup[lineup.indexOf(worst)] = inc;
    };
    ensure(isGuard);
    ensure(isBig);
    while (lineup.length < 5) {
      // Emergency: everyone fouled out/injured; bring back fouled-out players.
      const extra = T.avail.find(p => !lineup.includes(p));
      if (!extra) break;
      lineup.push(extra);
    }
    lineup.sort((a, b) => POS_IDX[a.pos] - POS_IDX[b.pos]);
    T.onCourt = lineup;
  }

  // ---------- Helpers ----------
  // Players in foul trouble defend more carefully (and foul less).
  const caution = (T, p) => { const f = T.st[p.id].fouls; return f >= 5 ? 0.35 : f >= 4 ? 0.6 : 1; };
  const eff = (T, p, key) => {
    const e = T.st[p.id].energy;
    // Relationships can affect focus; keep the influence modest and preserve the
    // calibrated baseline (70 morale), including older players without this field.
    const focus = HL.clamp(1 + ((p.morale ?? 70) - 70) * 0.0005, 0.97, 1.015);
    return p.attrs[key] * (0.86 + 0.14 * Math.min(1, e + 0.15)) * focus * (p.careerFitness ?? 1);
  };
  // How dangerous a scorer is (used for the on-floor pecking order).
  const offRating = (p) => {
    const a = p.attrs;
    return Math.max(a.layup, a.dunk, a.close, a.post) * 0.4 + Math.max(a.mid, a.three) * 0.35 + a.handle * 0.25 + p.ovr * 0.3;
  };
  // Diminishing returns at the top end: a 99 shooter is great, not automatic.
  const soft = (x) => x <= 74 ? x : 74 + (x - 74) * 0.5;

  function addPM(T, pts) { for (const p of T.onCourt) T.st[p.id].line.pm += pts; }

  function pickBy(players, wfn) { return R.weighted(players, wfn); }

  function shotWeights(T, shooter, rules, strat, oppDef) {
    const t = shooter.tend;
    let three = rules.threePoint ? t.three * 0.85 : 0;
    let mid = t.mid;
    let rim = t.drive + t.post * 0.6 + (isBig(shooter) ? 5 : 0);
    if (strat.focus === 'inside') { rim *= 1.3; three *= 0.8; }
    if (strat.focus === 'perimeter') { three *= 1.3; rim *= 0.85; }
    if (oppDef === 'zone') { three *= 1.25; rim *= 0.8; }
    if (oppDef === 'drop') { mid *= 1.3; }
    if (rules.fourPoint) three *= 1.1;
    if (rules.handCheck) { rim *= 0.85; mid *= 1.15; }
    return { three: Math.max(0, three), mid: Math.max(1, mid), rim: Math.max(1, rim) };
  }

  // ---------- Main ----------
  HL.createGame = function (homeTeam, awayTeam, rules = HL.DEFAULT_RULES(), opts = {}) {
    // Live intentions belong to this game; never edit the league player's tendencies.
    const own = t => ({ ...t, players: t.players.map(p => ({ ...p, tend: { ...p.tend } })) });
    homeTeam = own(homeTeam); awayTeam = own(awayTeam);
    rules = Object.assign(HL.DEFAULT_RULES(), rules);
    const H = prepTeam(homeTeam, rules), A = prepTeam(awayTeam, rules);
    H.home = true;
    const pbp = opts.pbp ? [] : null;
    const injuries = [];
    // Facts for the event log (records, game-winners, four-point plays...), kept for every game.
    const track = { four: [], goAhead: null, last: null, violations: [], clockResets: [], bonusTrips: [] };
    const strategyAdjustments = [homeTeam, awayTeam]
      .filter(t => rules.illegalDefense && t.strategy && t.strategy.defense === 'zone')
      .map(t => ({ teamId: t.id, from: 'zone', to: 'man', reason: 'illegalDefense' }));
    H.qfg = []; A.qfg = []; H.maxTrail = 0; A.maxTrail = 0;
    const teams = [H, A];
    for (const T of teams) for (const p of T.starters) T.st[p.id].line.gs = 1;

    // Era profile: the season's real league averages shift pace, shooting, turnovers, boards and fouls.
    // The sim is calibrated on 2025-26, so everything is relative to that season.
    const prof = rules.profile || null;
    const BASE = { pace: 99.4, efg: 0.546, tov: 12.7, orb: 26.0, ftr: 0.206 };
    const E = {
      pace: prof && prof.pace ? prof.pace : BASE.pace,
      efg: prof && prof.efg ? prof.efg - BASE.efg + (prof.tpar != null && prof.tpar < 0.12 ? 0.028 : prof.tpar == null ? 0.03 : 0) : 0,
      tov: prof ? ((prof.tov != null ? prof.tov : 16.5) - BASE.tov) / 100 * 0.55 : 0,
      orb: prof ? ((prof.orb != null ? prof.orb : 31) - BASE.orb) / 100 : 0,
      ftr: 1, // real players' foul drawing already reflects their era
      // Non-shooting fouls follow the era's whistle (bonus free throws were a bigger share of scoring in the past).
      common: 0.068 * (prof && prof.ftr ? HL.clamp(prof.ftr / BASE.ftr, 0.8, 1.6) : 1),
    };
    const paceAdj = ((H.strat.pace + A.strat.pace) / 2 - 50) * 0.12;
    const possPerTeam48 = E.pace * 1.045 + paceAdj + (opts.paceMod || 0);
    let avgPossSec = 2880 / (possPerTeam48 * 2);
    const regSeconds = rules.quarterLen * 60 * 4;

    let offense = R.chance(0.5) ? H : A;
    let transition = false;
    let quarter = 0;
    const log = (txt, T) => { if (pbp) pbp.push({ q: quarter, t: clockStr, txt, team: T ? T.team.abbr : null, hs: H.score, as: A.score }); };
    let clockStr = '';
    let remaining = rules.quarterLen * 60, finished = false;

    const playPeriod = function* (lenSec, isOT) {
      quarter++;
      let clock = lenSec;
      const qStartH = H.score, qStartA = A.score;
      H.qfg.push(0); A.qfg.push(0);
      H.teamFouls = 0; A.teamFouls = 0;
      // A rebound at the horn belongs to the finished period, not its next opening possession.
      H.lastOreb = null; A.lastOreb = null;
      let nextCheck = clock;
      const elapsedBefore = Math.min(regSeconds, (quarter - 1) * rules.quarterLen * 60);

      while (clock > 0) {
        // Substitutions at quarter start and every ~3 minutes of game time.
        if (clock >= nextCheck - 0.01 || clock === lenSec) {
          const elapsed = elapsedBefore + (lenSec - clock);
          for (const T of teams) {
            const diff = T.score - (T === H ? A : H).score;
            const late = (quarter >= 4) && clock <= 360;
            chooseLineup(T, {
              remaining: Math.max(60, regSeconds - elapsed),
              quarterStart: clock === lenSec,
              quarter,
              diff,
              clutchTime: (late && Math.abs(diff) <= 10) || isOT,
              garbage: quarter >= 4 && clock <= 420 && Math.abs(diff) >= 20,
              foulOut: rules.foulOut || 0,
            });
          }
          nextCheck = clock - R.range(150, 230);
        }

        const D = offense === H ? A : H;
        const reboundReset = offense.lastOreb != null;
        const possessionClock = reboundReset ? Math.min(rules.shotClock, rules.shotClockReset) : rules.shotClock;
        let dur = transition ? R.range(4, 9) : HL.clamp(R.normal(avgPossSec, 4.5), Math.min(5, possessionClock), possessionClock);
        const lastShot = dur >= clock;
        dur = Math.min(dur, clock);
        clock -= dur;
        if (reboundReset) track.clockResets.push({ teamId: offense.team.id, period: quarter, seconds: possessionClock, duration: dur });
        // Last possession of a period: teams play for one shot but often get it off with a few seconds
        // left, which leaves the other side a rushed try or a heave.
        if (lastShot && dur >= 4 && R.chance(0.55)) clock = Math.min(R.range(0.4, 4.5), dur - 1);
        const mm = Math.floor(clock / 60), ss = Math.floor(clock % 60);
        clockStr = `${mm}:${String(ss).padStart(2, '0')}`;

        // Minutes, energy
        for (const T of teams) {
          for (const p of T.avail) {
            const s = T.st[p.id];
            if (T.onCourt.includes(p)) {
              s.played += dur; s.line.min += dur / 60;
              let drain = dur / (60 * (6 + p.attrs.stam / 5.5)) * (0.6 + p.tend.effort / 125);
              if (s.target > 38 * 60) drain *= 0.5; // conditioned for heavy minutes
              s.energy = Math.max(0, s.energy - drain);
            } else {
              s.energy = Math.min(1, s.energy + dur / (60 * 5));
            }
          }
        }

        const clutch = (quarter >= 4) && clock <= 300 && Math.abs(H.score - A.score) <= 5;
        const before = offense.score - D.score;
        track.last = null;
        const result = runPossession(offense, D, rules, transition, clutch, log, before, dur);
        transition = result.transition;
        const after = offense.score - D.score;
        // Lead changes (the last one decides the game) and the biggest deficit each side faced.
        if (before <= 0 && after > 0 && track.last) track.goAhead = { side: offense === H ? 'home' : 'away', pid: track.last.pid, label: track.last.label, value: track.last.value, putback: track.last.putback, assist: track.last.assist, period: quarter, clock: Math.round(clock * 10) / 10, before, after };
        H.maxTrail = Math.max(H.maxTrail, A.score - H.score);
        A.maxTrail = Math.max(A.maxTrail, H.score - A.score);

        // Injuries: per player-second risk, driven by durability, fatigue, age and rules.
        for (const T of teams) {
          for (const p of T.onCourt) {
            const s = T.st[p.id];
            let risk = 1.15e-5 * dur * (rules.injuryMult ?? 1);
            risk *= 1 + (60 - p.attrs.dur) / 60;
            risk *= 1 + Math.max(0, 0.5 - s.energy) * 1.5;
            risk *= 1 + Math.max(0, p.age - 31) * 0.08;
            if (rules.tackling) risk *= 3.5;
            if (R.chance(risk)) {
              const inj = HL.rollInjury(rules.tackling ? 1.4 : 1);
              injuries.push({ pid: p.id, teamId: T.team.id, ...inj });
              s.out = true;
              log(`${p.name} leaves the game (${inj.name}).`, T);
              nextCheck = clock + 1; // force a lineup check
            }
          }
        }
        // Fouled-out or injured players must leave immediately; foul trouble triggers a look at the bench.
        for (const T of teams) {
          if (T.onCourt.some(p => T.st[p.id].out) || T.recheck) nextCheck = clock + 1;
          T.recheck = false;
        }

        if (!result.keep) offense = D;
        remaining = clock;
        yield { period: quarter, clock: clockStr, seconds: clock };
      }
      H.quarters.push(H.score - qStartH);
      A.quarters.push(A.score - qStartA);
    };

    function runPossession(O, D, rules, transition, clutch, log, lead, secs = 99) {
      const strat = O.strat, dstrat = D.strat;
      const lineup = O.onCourt, dline = D.onCourt;
      const putbackBy = O.lastOreb; O.lastOreb = null;
      const homeBoost = O.home ? 0.011 * (rules.homeCourt ?? 1) : 0;

      // Usage: who initiates.
      const focusStar = strat.focus === 'star';
      // Offensive pecking order on the floor: the alpha gets the most touches.
      const order = O.orderCache === lineup ? O.order : (O.orderCache = lineup, O.order = lineup.slice().sort((a, b) => offRating(b) - offRating(a)));
      const RANK = [1.15, 1.04, 1, 0.95, 0.92];
      const initiator = pickBy(lineup, p => {
        // Usage tendency already encodes the real role (from usage %), so talent only nudges it.
        // Usage tendency maps back to usage % (usage/3.4 + 10): touches are proportional to it.
        let w = (Math.max(0, p.tend.usage) / 3.4 + 10) * Math.pow(p.ovr / 75, 0.5) * RANK[order.indexOf(p)];
        if (focusStar) w *= Math.pow(p.ovr / 75, 3);
        if (strat.usageLock && strat.usageLock[p.id]) w *= strat.usageLock[p.id];
        return w;
      });
      const idx = lineup.indexOf(initiator);
      const defender = dline[idx] || dline[0];

      // The sim has no player coordinates: rule violations are exposure-based, driven by
      // possession duration, pressure, paint usage and IQ. They still have real box-score
      // consequences and retain their type and participants in the game result.
      const violation = (type, T, p, facts) => track.violations.push({ type, side: T === H ? 'home' : 'away', pid: p.id, teamId: T.team.id, period: quarter, clock: clockStr, ...facts });
      const backcourtRisk = !transition && putbackBy == null && rules.backcourtSeconds > 0 && secs >= rules.backcourtSeconds
        ? 0.002 * HL.clamp((11 - rules.backcourtSeconds) / 3, 0, 3) * (dstrat.defense === 'press' ? 3 : 1) : 0;
      if (backcourtRisk > 0 && R.chance(backcourtRisk)) {
        O.st[initiator.id].line.tov++;
        violation('backcourt', O, initiator, { turnover: true, seconds: rules.backcourtSeconds });
        log(`${initiator.name}: ${rules.backcourtSeconds}-second backcourt violation.`, O);
        return { keep: false, transition: false };
      }
      const paintPlayers = lineup.filter(isBig);
      if (rules.offensiveThreeSeconds && secs >= 3 && paintPlayers.length && R.chance(0.002 * (strat.focus === 'inside' ? 1.5 : 1))) {
        const p = pickBy(paintPlayers, p => (20 + p.tend.post) * (120 - p.attrs.iq));
        O.st[p.id].line.tov++;
        violation('offensiveThreeSeconds', O, p, { turnover: true });
        log(`Offensive three-second violation on ${p.name}.`, O);
        return { keep: false, transition: false };
      }
      if (!rules.noFouls && rules.defensiveThreeSeconds && secs >= 3 && R.chance(0.0015 * (dstrat.defense === 'zone' ? 2 : 1))) {
        const p = pickBy(dline, p => (isBig(p) ? 3 : 1) * (120 - p.attrs.iq));
        const shooter = lineup.slice().sort((a, b) => b.attrs.ft - a.attrs.ft)[0];
        log(`Defensive three-second violation on ${p.name}. One technical free throw; offense keeps possession.`, D);
        const made = shootFTs(O, shooter, 1, rules, log);
        if (made) track.last = { pid: shooter.id, label: 'technical free throw', value: made, putback: false, assist: null };
        violation('defensiveThreeSeconds', D, p, { freeThrows: 1, made, shooterId: shooter.id, retainedPossession: true, personalFoul: false });
      }

      // Turnovers
      const toSkill = (eff(O, initiator, 'handle') + eff(O, initiator, 'pass') + eff(O, initiator, 'iq')) / 3;
      const dSteal = dline.reduce((s, p) => s + p.attrs.steal * (0.7 + p.tend.gamble / 166), 0) / 5;
      // Lane/backcourt violations account for part of the previously generic turnover budget.
      let pTO = 0.121 + (68 - toSkill) * 0.0022 + (dSteal - 62) * 0.0018;
      if (dstrat.defense === 'press') pTO += 0.025;
      if (strat.focus === 'motion') pTO += 0.008;
      if (transition) pTO += 0.01;
      pTO += E.tov;
      if (R.chance(HL.clamp(pTO, 0.06, 0.25))) {
        O.st[initiator.id].line.tov++;
        const stealP = 0.56 + (dSteal - 62) * 0.008;
        if (R.chance(HL.clamp(stealP, 0.3, 0.7))) {
          const thief = pickBy(dline, p => Math.pow(p.attrs.steal, 3) * (0.6 + p.tend.gamble / 100));
          D.st[thief.id].line.stl++;
          log(`${thief.name} steals it from ${initiator.name}.`, D);
          return { keep: false, transition: R.chance(0.55) };
        }
        // About a fifth of live-ball-dead turnovers are offensive fouls: charges and illegal screens.
        if (!rules.noFouls && R.chance(0.22)) {
          const drawer = pickBy(dline, p => Math.pow((p.attrs.iq + p.attrs.perD) / 130, 4) * (0.6 + p.attrs.str / 150));
          const ds = D.st[drawer.id];
          ds.charges = (ds.charges || 0) + 1;
          foul(O, initiator, rules, log, true);
          log(`Offensive foul on ${initiator.name}. ${drawer.name} draws the charge.`, O);
          return { keep: false, transition: false };
        }
        log(`Turnover by ${initiator.name}.`, O);
        return { keep: false, transition: false };
      }

      // Non-shooting foul (common foul); in the bonus this sends the offense to the line.
      if (!rules.noFouls && R.chance(E.common)) {
        const fouler = pickBy(dline, p => Math.pow(p.tend.foulAggr / 50, 1.6) * caution(D, p));
        foul(D, fouler, rules, log);
        const threshold = quarter > 4 ? Math.min(rules.bonusFouls, 4) : rules.bonusFouls;
        if (threshold > 0 && D.teamFouls >= threshold) {
          track.bonusTrips.push({ teamId: O.team.id, pid: initiator.id, period: quarter, teamFouls: D.teamFouls, threshold, freeThrows: 2 });
          const ft = shootFTs(O, initiator, 2, rules, log);
          if (ft) track.last = { pid: initiator.id, label: 'free throws', value: ft, putback: false, assist: null };
          return { keep: false, transition: false };
        }
      }

      // The usage pick IS the player who uses the possession (like usage %). Whether a teammate
      // set the shot up is decided after the shot type (catch-and-shoot threes are usually assisted).
      const shooter = initiator;
      let passer = null;
      const sIdx = lineup.indexOf(shooter);
      const sDef = dline[sIdx] || defender;
      const helper = dline.slice().sort((a, b) => (b.attrs.intD + b.attrs.block) - (a.attrs.intD + a.attrs.block))[0];

      const w = shotWeights(O, shooter, rules, strat, dstrat.defense);
      let type = R.weighted(['three', 'mid', 'rim'], k => w[k]);
      // Under two seconds there is only time for a catch-and-heave.
      const heave = secs < 2 && !transition;
      if (heave) type = rules.threePoint ? 'three' : 'mid';
      if (transition && R.chance(0.45)) type = 'rim';
      // Assisted or self-created: real NBA ~85% of made threes, ~55% at the rim, ~40% mid-range are assisted;
      // high-usage creators make their own shots far more often.
      const usgPct = shooter.tend.usage / 3.4 + 10;
      let pAst = { three: 0.84, rim: 0.56, mid: 0.42 }[type] * HL.clamp(1.35 - usgPct * 0.021, 0.3, 1.2);
      if (strat.focus === 'motion') pAst += 0.08;
      if (focusStar) pAst -= 0.05;
      if (transition) pAst += 0.1;
      if (R.chance(HL.clamp(pAst, 0.05, 0.95))) {
        passer = pickBy(lineup.filter(p => p !== shooter), p => Math.pow(p.attrs.pass / 50, 3) * (20 + p.tend.passFirst));
      }

      let makeP, value = 2, blockP = 0, foulP = 0, label;
      // Team context: five-man defense and floor spacing affect every shot.
      const teamD = dline.reduce((sum, p) => sum + (eff(D, p, 'perD') + eff(D, p, 'intD') + p.attrs.iq) / 3, 0) / dline.length;
      const spacing = lineup.filter(p => p !== shooter).reduce((sum, p) => sum + p.attrs.three, 0) / Math.max(1, lineup.length - 1);
      const teamIQ = lineup.reduce((sum, p) => sum + p.attrs.iq, 0) / lineup.length;
      const contest = (key) => eff(D, sDef, key);
      if (type === 'rim') {
        const isPost = shooter.tend.post > 25 && R.chance(shooter.tend.post / 100);
        const finish = isPost
          ? (eff(O, shooter, 'post') * 0.6 + eff(O, shooter, 'close') * 0.4)
          : Math.max(eff(O, shooter, 'layup'), eff(O, shooter, 'dunk') * 0.92 + shooter.attrs.vert * 0.08, eff(O, shooter, 'close') * 0.97);
        const help = (eff(D, helper, 'intD') + eff(D, helper, 'block')) / 2;
        makeP = 0.682 + (soft(finish) - 70) * 0.0056 - (help - 70) * 0.0031 - (contest('intD') - 65) * 0.0013;
        if (transition) makeP += 0.07;
        if (dstrat.defense === 'drop') makeP -= 0.015;
        blockP = 0.068 + (helper.attrs.block - 65) * 0.0022;
        foulP = 0.31 + (shooter.attrs.str + finish - 140) * 0.0012;
        label = isPost ? 'post' : (shooter.attrs.dunk > 70 && R.chance(0.35) ? 'dunk' : 'layup');
      } else if (type === 'mid') {
        makeP = 0.455 + (soft(eff(O, shooter, 'mid')) - 70) * 0.0048 - (contest('perD') - 65) * 0.0024;
        if (dstrat.defense === 'drop') makeP += 0.02;
        blockP = 0.018; foulP = 0.06;
        label = 'jumper';
      } else {
        let deep = rules.fourPoint && R.chance(0.12);
        value = deep ? 4 : (rules.threeValue || 3);
        makeP = 0.338 + (soft(eff(O, shooter, 'three')) - 70) * 0.0055 - (contest('perD') - 65) * 0.0015;
        if (deep) makeP -= 0.09;
        if (passer) makeP += 0.018; else makeP -= 0.015;
        if (dstrat.defense === 'switch') makeP -= 0.008;
        if (dstrat.defense === 'zone') makeP += 0.01;
        blockP = 0.008; foulP = 0.02;
        label = deep ? 'deep 4-pointer' : 'three';
      }
      makeP -= (teamD - 66) * 0.0052;
      makeP += (teamIQ - 68) * 0.0024;
      if (type === 'rim') makeP += (spacing - 62) * 0.0018;
      if (rules.handCheck && type !== 'rim') makeP -= 0.012;
      if (clutch) makeP += (shooter.traits.clutch - 55) * 0.0012;
      makeP += homeBoost + E.efg;
      // Score effects: big leads breed complacency, trailing teams push harder.
      makeP -= HL.clamp(lead, -18, 26) * 0.0016;
      // Foul drawing: real players use their real free-throw rate; generated players use scoring talent.
      const draw = shooter.tend.drawFoul != null ? Math.pow(shooter.tend.drawFoul / 44, 0.85) : 1 + (offRating(shooter) - 104) / 55;
      foulP *= HL.clamp(draw, 0.35, 2.4) * E.ftr;
      if (rules.noFouls) foulP = 0;
      if (rules.tackling && type === 'rim') { makeP -= 0.06; }
      makeP = HL.clamp(makeP, 0.05, 0.9);
      if (heave) { makeP = 0.07; foulP = 0; label = 'heave'; }
      else if (secs < 4 && !transition) makeP -= 0.1; // rushed

      const sl = O.st[shooter.id].line;
      // Block
      if (R.chance(HL.clamp(blockP, 0, 0.2))) {
        const blocker = type === 'rim' ? helper : sDef;
        D.st[blocker.id].line.blk++;
        sl.fga++; if (value >= 3) sl.tpa++;
        log(`${blocker.name} blocks ${shooter.name}'s ${label}!`, D);
        return rebound(O, D, rules, type, log);
      }
      // Shooting foul
      const fouled = R.chance(HL.clamp(foulP, 0, 0.35));
      // Contact rarely leaves a jumper intact; finishing through it at the rim is far more common.
      const made = R.chance(fouled ? makeP * (type === 'rim' ? 0.55 : type === 'mid' ? 0.3 : 0.1) : makeP);
      if (fouled) {
        // Who gets whistled: mostly the man guarding the shooter, sometimes the help; scaled by each
        // player's real foul rate (Wilt never fouled out; some bigs live in foul trouble).
        const fouler = pickBy(dline, p => (p === sDef ? 1.6 : p === helper && type === 'rim' ? 0.7 : 0.35) * Math.pow(p.tend.foulAggr / 50, 1.6) * caution(D, p));
        foul(D, fouler, rules, log);
      }
      if (made) {
        sl.fga++; sl.fgm++; sl.pts += value;
        if (value >= 3) { sl.tpa++; sl.tpm++; }
        O.score += value; addPM(O, value); addPM(D, -value);
        O.qfg[O.qfg.length - 1]++;
        track.last = { pid: shooter.id, label, value, putback: putbackBy === shooter.id, assist: passer ? passer.id : null };
        let astTxt = '';
        if (passer) {
          O.st[passer.id].line.ast++;
          astTxt = ` (${passer.name} assist)`;
        }
        log(`${shooter.name} makes ${value === 4 ? 'a ' : value === 3 ? 'a ' : 'a '}${label}${astTxt}.`, O);
        if (fouled) {
          log(`And one!`, O);
          const ft = shootFTs(O, shooter, 1, rules, log);
          if (ft && value >= 3) track.four.push({ pid: shooter.id, side: O === H ? 'home' : 'away', period: quarter, total: value + 1 });
        }
        return { keep: false, transition: false };
      }
      if (fouled) {
        const ft = shootFTs(O, shooter, Math.min(value, 3), rules, log);
        if (ft) track.last = { pid: shooter.id, label: 'free throws', value: ft, putback: false, assist: null };
        return { keep: false, transition: false };
      }
      sl.fga++; if (value >= 3) sl.tpa++;
      log(`${shooter.name} misses a ${label}.`, O);
      return rebound(O, D, rules, type, log);
    }

    function foul(T, p, rules, log, offensive) {
      const s = T.st[p.id];
      s.line.pf++; s.fouls++;
      if (!offensive) T.teamFouls++; // offensive fouls are personal fouls, not team fouls
      if (s.fouls >= 2) T.recheck = true;
      if (rules.foulOut > 0 && s.fouls >= rules.foulOut) {
        s.out = true;
        log(`${p.name} has fouled out.`, T);
      }
    }

    function shootFTs(T, p, n, rules, log) {
      const s = T.st[p.id].line;
      let made = 0;
      for (let i = 0; i < n; i++) {
        s.fta++;
        if (R.chance(HL.clamp(0.235 + p.attrs.ft * 0.0072, 0.3, 0.94))) { s.ftm++; s.pts++; made++; }
      }
      T.score += made;
      addPM(T, made); addPM(T === H ? A : H, -made);
      log(`${p.name} makes ${made} of ${n} free throws.`, T);
      return made;
    }

    function rebound(O, D, rules, type, log) {
      const oStr = O.onCourt.reduce((s, p) => s + eff(O, p, 'oreb') * (0.75 + p.tend.crash / 200), 0) / 5;
      const dStr = D.onCourt.reduce((s, p) => s + eff(D, p, 'dreb'), 0) / 5;
      let pOff = 0.268 + (oStr - dStr) * 0.0045 + (O.strat.crash - 50) * 0.0012 + E.orb;
      if (type === 'three') pOff += 0.02;
      if (D.strat.defense === 'zone') pOff += 0.02;
      if (R.chance(HL.clamp(pOff, 0.1, 0.45))) {
        const r = pickBy(O.onCourt, p => Math.pow(p.attrs.oreb / 50, 1.7) * (0.5 + p.tend.crash / 100));
        O.st[r.id].line.orb++;
        O.lastOreb = r.id;
        log(`Offensive rebound ${r.name}.`, O);
        return { keep: true, transition: false };
      }
      const r = pickBy(D.onCourt, p => Math.pow(p.attrs.dreb / 50, 1.85));
      D.st[r.id].line.drb++;
      // Defensive rebounds sometimes lead to a fast break; fast teams run more.
      return { keep: false, transition: R.chance(0.13 + (D.strat.pace - 50) * 0.002) };
    }

    let ot = 0;

    const box = (T) => {
      const out = {};
      for (const id in T.st) {
        const l = { ...T.st[id].line, min: Math.round(T.st[id].line.min * 10) / 10 };
        if (l.min > 0 || l.gs) { l.gp = 1; out[id] = l; }
      }
      return out;
    };
    const result = () => ({
      home: { teamId: homeTeam.id, score: H.score, quarters: H.quarters, box: box(H) },
      away: { teamId: awayTeam.id, score: A.score, quarters: A.quarters, box: box(A) },
      ot, pbp, injuries,
      events: {
        violations: track.violations, clockResets: track.clockResets, bonusTrips: track.bonusTrips, strategyAdjustments,
        four: track.four, goAhead: track.goAhead, periods: 4 + ot,
        qfg: { home: H.qfg, away: A.qfg }, trail: { home: H.maxTrail, away: A.maxTrail },
        charges: Object.assign({}, ...[H, A].map(T => Object.fromEntries(Object.entries(T.st).filter(([, x]) => x.charges).map(([id, x]) => [id, x.charges])))),
      },
    });
    function* run() {
      for (let q = 0; q < 4; q++) yield* playPeriod(rules.quarterLen * 60, false);
      while (H.score === A.score && ot < 8) { ot++; yield* playPeriod(rules.otLen * 60, true); }
      finished = true;
      return result();
    }
    const game = run();
    return {
      step: () => game.next(),
      snapshot: () => ({ ...result(), period: quarter, seconds: remaining, clock: clockStr || `${rules.quarterLen}:00`, finished,
        lineups: Object.fromEntries(teams.map(T => [T.team.id, T.onCourt.map(p => ({ pid: p.id, energy: T.st[p.id].energy, fouls: T.st[p.id].fouls }))])),
        out: teams.flatMap(T => T.avail.filter(p => T.st[p.id].out).map(p => p.id)) }),
      control(teamId, values) {
        const T = teams.find(T => T.team.id === teamId); if (!T) return false;
        Object.assign(T.strat, values);
        if (rules.illegalDefense && T.strat.defense === 'zone') T.strat.defense = 'man';
        avgPossSec = 2880 / ((E.pace * 1.045 + ((H.strat.pace + A.strat.pace) / 2 - 50) * .12 + (opts.paceMod || 0)) * 2);
        return true;
      },
      playerControl(pid, values) {
        const T = teams.find(T => T.st[pid]); if (!T) return false;
        Object.assign(T.st[pid].p.tend, values); return true;
      },
    };
  };
  HL.simGame = function (home, away, rules, opts) {
    const game = HL.createGame(home, away, rules, opts);
    let next; do { next = game.step(); } while (!next.done);
    return next.value;
  };
})();
