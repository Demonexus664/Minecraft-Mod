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
    const { remaining, quarterStart, quarter, diff, clutchTime, garbage } = ctx;
    const cands = T.avail.filter(p => !T.st[p.id].out);
    const scored = cands.map(p => {
      const s = T.st[p.id];
      const need = (s.target - s.played) / Math.max(60, remaining);
      let score = need * 2.2 + (s.energy - 0.7) * 1.5;
      if (T.onCourt.includes(p)) score += 0.35;
      if (s.target <= 0) score -= 3;
      if (quarterStart && (quarter === 1 || quarter === 3) && T.starters.includes(p)) score += 4;
      if (clutchTime) {
        const closers = T.strat.closers;
        if (closers ? closers.includes(p.id) : true) score += (p.ovr - 70) * 0.08 + (closers ? 2 : 0);
      }
      if (garbage) score += T.starters.includes(p) ? -3 : 1 - (p.ovr - 70) * 0.03;
      if (s.energy < 0.35) score -= 2;
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
  const eff = (T, p, key) => {
    const e = T.st[p.id].energy;
    return p.attrs[key] * (0.86 + 0.14 * Math.min(1, e + 0.15));
  };

  function addPM(T, pts) { for (const p of T.onCourt) T.st[p.id].line.pm += pts; }

  function pickBy(players, wfn) { return R.weighted(players, wfn); }

  function shotWeights(T, shooter, rules, strat, oppDef) {
    const t = shooter.tend;
    let three = rules.threePoint ? t.three : 0;
    let mid = t.mid;
    let rim = t.drive + t.post * 0.6 + (isBig(shooter) ? 15 : 0);
    if (strat.focus === 'inside') { rim *= 1.3; three *= 0.8; }
    if (strat.focus === 'perimeter') { three *= 1.3; rim *= 0.85; }
    if (oppDef === 'zone') { three *= 1.25; rim *= 0.8; }
    if (oppDef === 'drop') { mid *= 1.3; }
    if (rules.fourPoint) three *= 1.1;
    if (rules.handCheck) { rim *= 0.85; mid *= 1.15; }
    return { three: Math.max(0, three), mid: Math.max(1, mid), rim: Math.max(1, rim) };
  }

  // ---------- Main ----------
  HL.simGame = function (homeTeam, awayTeam, rules = HL.DEFAULT_RULES(), opts = {}) {
    const H = prepTeam(homeTeam, rules), A = prepTeam(awayTeam, rules);
    H.home = true;
    const pbp = opts.pbp ? [] : null;
    const injuries = [];
    const teams = [H, A];
    for (const T of teams) for (const p of T.starters) T.st[p.id].line.gs = 1;

    const paceAdj = ((H.strat.pace + A.strat.pace) / 2 - 50) * 0.12;
    const possPerTeam48 = 99.6 * 1.045 + paceAdj + (opts.paceMod || 0);
    const avgPossSec = 2880 / (possPerTeam48 * 2);
    const regSeconds = rules.quarterLen * 60 * 4;

    let offense = R.chance(0.5) ? H : A;
    let transition = false;
    let quarter = 0;
    const log = (txt, T) => { if (pbp) pbp.push({ q: quarter, t: clockStr, txt, team: T ? T.team.abbr : null, hs: H.score, as: A.score }); };
    let clockStr = '';

    const playPeriod = (lenSec, isOT) => {
      quarter++;
      let clock = lenSec;
      const qStartH = H.score, qStartA = A.score;
      H.teamFouls = 0; A.teamFouls = 0;
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
            });
          }
          nextCheck = clock - R.range(150, 230);
        }

        const D = offense === H ? A : H;
        let dur = transition ? R.range(4, 9) : HL.clamp(R.normal(avgPossSec, 4.5), 5, rules.shotClock);
        dur = Math.min(dur, clock);
        clock -= dur;
        const mm = Math.floor(clock / 60), ss = Math.floor(clock % 60);
        clockStr = `${mm}:${String(ss).padStart(2, '0')}`;

        // Minutes, energy
        for (const T of teams) {
          for (const p of T.avail) {
            const s = T.st[p.id];
            if (T.onCourt.includes(p)) {
              s.played += dur; s.line.min += dur / 60;
              const drain = dur / (60 * (9 + p.attrs.stam / 9)) * (0.6 + p.tend.effort / 125);
              s.energy = Math.max(0, s.energy - drain);
            } else {
              s.energy = Math.min(1, s.energy + dur / (60 * 5));
            }
          }
        }

        const clutch = (quarter >= 4) && clock <= 300 && Math.abs(H.score - A.score) <= 5;
        const result = runPossession(offense, D, rules, transition, clutch, log);
        transition = result.transition;

        // Injuries: per player-second risk, driven by durability, fatigue, age and rules.
        for (const T of teams) {
          for (const p of T.onCourt) {
            const s = T.st[p.id];
            let risk = 1.15e-5 * dur * (rules.injuryMult || 1);
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
        // Fouled-out or injured players must leave immediately.
        for (const T of teams) {
          if (T.onCourt.some(p => T.st[p.id].out)) nextCheck = clock + 1;
        }

        if (!result.keep) offense = D;
      }
      H.quarters.push(H.score - qStartH);
      A.quarters.push(A.score - qStartA);
    };

    function runPossession(O, D, rules, transition, clutch, log) {
      const strat = O.strat, dstrat = D.strat;
      const lineup = O.onCourt, dline = D.onCourt;
      const homeBoost = O.home ? 0.007 * (rules.homeCourt ?? 1) : 0;

      // Usage: who initiates.
      const focusStar = strat.focus === 'star';
      const initiator = pickBy(lineup, p => {
        let w = Math.pow(p.tend.usage / 50, 1.3) * Math.pow(p.ovr / 75, 2.6);
        if (focusStar) w *= Math.pow(p.ovr / 75, 3);
        return w;
      });
      const idx = lineup.indexOf(initiator);
      const defender = dline[idx] || dline[0];

      // Turnovers
      const toSkill = (eff(O, initiator, 'handle') + eff(O, initiator, 'pass') + eff(O, initiator, 'iq')) / 3;
      const dSteal = dline.reduce((s, p) => s + p.attrs.steal * (0.7 + p.tend.gamble / 166), 0) / 5;
      let pTO = 0.128 + (68 - toSkill) * 0.0022 + (dSteal - 62) * 0.0018;
      if (dstrat.defense === 'press') pTO += 0.025;
      if (strat.focus === 'motion') pTO += 0.008;
      if (transition) pTO += 0.01;
      if (R.chance(HL.clamp(pTO, 0.06, 0.25))) {
        O.st[initiator.id].line.tov++;
        const stealP = 0.5 + (dSteal - 62) * 0.01;
        if (R.chance(HL.clamp(stealP, 0.3, 0.7))) {
          const thief = pickBy(dline, p => Math.pow(p.attrs.steal, 3) * (0.6 + p.tend.gamble / 100));
          D.st[thief.id].line.stl++;
          log(`${thief.name} steals it from ${initiator.name}.`, D);
          return { keep: false, transition: R.chance(0.55) };
        }
        log(`Turnover by ${initiator.name}.`, O);
        return { keep: false, transition: false };
      }

      // Non-shooting foul (common foul); in the bonus this sends the offense to the line.
      if (!rules.noFouls && R.chance(0.1)) {
        const fouler = pickBy(dline, p => 1 + p.tend.foulAggr / 50);
        foul(D, fouler, rules, log);
        if (D.teamFouls > 4) {
          shootFTs(O, initiator, 2, rules, log);
          return { keep: false, transition: false };
        }
      }

      // Create the shot: initiator shoots or creates for a teammate.
      let shooter = initiator, passer = null;
      let passP = 0.53 + (initiator.tend.passFirst - 50) / 160;
      if (strat.focus === 'motion') passP += 0.12;
      if (focusStar) passP -= 0.08;
      if (R.chance(HL.clamp(passP, 0.1, 0.8))) {
        const others = lineup.filter(p => p !== initiator);
        shooter = pickBy(others, p => Math.pow(p.tend.usage / 50, 0.8) * Math.pow(p.ovr / 75, 2));
        passer = initiator;
      }
      const sIdx = lineup.indexOf(shooter);
      const sDef = dline[sIdx] || defender;
      const helper = dline.slice().sort((a, b) => (b.attrs.intD + b.attrs.block) - (a.attrs.intD + a.attrs.block))[0];

      const w = shotWeights(O, shooter, rules, strat, dstrat.defense);
      let type = R.weighted(['three', 'mid', 'rim'], k => w[k]);
      if (transition && R.chance(0.45)) type = 'rim';

      let makeP, value = 2, blockP = 0, foulP = 0, label;
      const contest = (key) => eff(D, sDef, key);
      if (type === 'rim') {
        const isPost = shooter.tend.post > 25 && R.chance(shooter.tend.post / 100);
        const finish = isPost
          ? (eff(O, shooter, 'post') * 0.6 + eff(O, shooter, 'close') * 0.4)
          : Math.max(eff(O, shooter, 'layup'), eff(O, shooter, 'dunk') * 0.92 + shooter.attrs.vert * 0.08, eff(O, shooter, 'close') * 0.97);
        const help = (eff(D, helper, 'intD') + eff(D, helper, 'block')) / 2;
        makeP = 0.632 + (finish - 70) * 0.0062 - (help - 70) * 0.0033 - (contest('intD') - 65) * 0.0015;
        if (transition) makeP += 0.07;
        if (dstrat.defense === 'drop') makeP -= 0.015;
        blockP = 0.06 + (helper.attrs.block - 65) * 0.0022;
        foulP = 0.20 + (shooter.attrs.str + finish - 140) * 0.0012;
        label = isPost ? 'post' : (shooter.attrs.dunk > 70 && R.chance(0.35) ? 'dunk' : 'layup');
      } else if (type === 'mid') {
        makeP = 0.418 + (eff(O, shooter, 'mid') - 70) * 0.0052 - (contest('perD') - 65) * 0.0026;
        if (dstrat.defense === 'drop') makeP += 0.02;
        blockP = 0.018; foulP = 0.055;
        label = 'jumper';
      } else {
        let deep = rules.fourPoint && R.chance(0.12);
        value = deep ? 4 : (rules.threeValue || 3);
        makeP = 0.302 + (eff(O, shooter, 'three') - 70) * 0.0058 - (contest('perD') - 65) * 0.0016;
        if (deep) makeP -= 0.09;
        if (passer) makeP += 0.018; else makeP -= 0.015;
        if (dstrat.defense === 'switch') makeP -= 0.008;
        if (dstrat.defense === 'zone') makeP += 0.01;
        blockP = 0.008; foulP = 0.02;
        label = deep ? 'deep 4-pointer' : 'three';
      }
      if (rules.handCheck && type !== 'rim') makeP -= 0.012;
      if (clutch) makeP += (shooter.traits.clutch - 55) * 0.0012;
      makeP += homeBoost;
      if (rules.noFouls) foulP = 0;
      if (rules.tackling && type === 'rim') { makeP -= 0.06; }
      makeP = HL.clamp(makeP, 0.05, 0.9);

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
      const made = R.chance(fouled ? makeP * 0.55 : makeP);
      if (fouled) {
        const fouler = type === 'rim' ? (R.chance(0.6) ? sDef : helper) : sDef;
        foul(D, fouler, rules, log);
      }
      if (made) {
        sl.fga++; sl.fgm++; sl.pts += value;
        if (value >= 3) { sl.tpa++; sl.tpm++; }
        O.score += value; addPM(O, value); addPM(D, -value);
        let astTxt = '';
        const assisted = passer ? R.chance(0.9) : R.chance(type === 'rim' ? 0.32 : 0.22);
        if (assisted) {
          const ap = passer || pickBy(lineup.filter(p => p !== shooter), p => Math.pow(p.attrs.pass, 2));
          O.st[ap.id].line.ast++;
          astTxt = ` (${ap.name} assist)`;
        }
        log(`${shooter.name} makes ${value === 4 ? 'a ' : value === 3 ? 'a ' : 'a '}${label}${astTxt}.`, O);
        if (fouled) {
          log(`And one!`, O);
          shootFTs(O, shooter, 1, rules, log);
        }
        return { keep: false, transition: false };
      }
      if (fouled) {
        shootFTs(O, shooter, Math.min(value, 3), rules, log);
        return { keep: false, transition: false };
      }
      sl.fga++; if (value >= 3) sl.tpa++;
      log(`${shooter.name} misses a ${label}.`, O);
      return rebound(O, D, rules, type, log);
    }

    function foul(T, p, rules, log) {
      const s = T.st[p.id];
      s.line.pf++; s.fouls++; T.teamFouls++;
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
        if (R.chance(HL.clamp(0.17 + p.attrs.ft * 0.0075, 0.3, 0.94))) { s.ftm++; s.pts++; made++; }
      }
      T.score += made;
      addPM(T, made); addPM(T === H ? A : H, -made);
      log(`${p.name} makes ${made} of ${n} free throws.`, T);
    }

    function rebound(O, D, rules, type, log) {
      const oStr = O.onCourt.reduce((s, p) => s + eff(O, p, 'oreb') * (0.75 + p.tend.crash / 200), 0) / 5;
      const dStr = D.onCourt.reduce((s, p) => s + eff(D, p, 'dreb'), 0) / 5;
      let pOff = 0.255 + (oStr - dStr) * 0.0045 + (O.strat.crash - 50) * 0.0012;
      if (type === 'three') pOff += 0.02;
      if (D.strat.defense === 'zone') pOff += 0.02;
      if (R.chance(HL.clamp(pOff, 0.1, 0.45))) {
        const r = pickBy(O.onCourt, p => Math.pow(p.attrs.oreb, 3) * (0.5 + p.tend.crash / 100));
        O.st[r.id].line.orb++;
        log(`Offensive rebound ${r.name}.`, O);
        return { keep: true, transition: false };
      }
      const r = pickBy(D.onCourt, p => Math.pow(p.attrs.dreb, 3));
      D.st[r.id].line.drb++;
      // Defensive rebounds sometimes lead to a fast break; fast teams run more.
      return { keep: false, transition: R.chance(0.13 + (D.strat.pace - 50) * 0.002) };
    }

    for (let q = 0; q < 4; q++) playPeriod(rules.quarterLen * 60, false);
    let ot = 0;
    while (H.score === A.score && ot < 8) { ot++; playPeriod(rules.otLen * 60, true); }

    const box = (T) => {
      const out = {};
      for (const id in T.st) {
        const l = T.st[id].line;
        l.min = Math.round(l.min * 10) / 10;
        if (l.min > 0 || l.gs) { l.gp = 1; out[id] = l; }
      }
      return out;
    };
    return {
      home: { teamId: homeTeam.id, score: H.score, quarters: H.quarters, box: box(H) },
      away: { teamId: awayTeam.id, score: A.score, quarters: A.quarters, box: box(A) },
      ot, pbp, injuries,
    };
  };
})();
