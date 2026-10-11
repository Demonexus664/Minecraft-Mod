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
      // Distribute unused rotation minutes without inventing 50+ minute regulation games.
      // A depleted five-man lineup can each play 48; deeper rotations cap at 46.
      const ceiling = players.length <= 5 ? 48 : 46;
      let attempts = 0;
      while (left > 0.001 && attempts++ < 15) {
        const active = order.filter(p => mins[p.id] < ceiling - 0.001);
        if (!active.length) break;
        const each = left / active.length;
        for (const p of active) {
          const extra = Math.min(each, ceiling - mins[p.id]);
          mins[p.id] += extra; left -= extra;
        }
      }
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

  HL.GAME_PLAYS = {
    pickRoll: { label: 'High pick-and-roll', partner: true, desc: 'A handler and roller attack the screen; passing and finishing matter.' },
    pickPop: { label: 'Pick-and-pop', partner: true, desc: 'The screener fades for a jumper. Drop coverage gives space; switching contests it.' },
    isolation: { label: 'Isolation', desc: 'Clear a side for your creator; ball handling and the matchup decide the advantage.' },
    postUp: { label: 'Post-up', desc: 'Find your scorer on the block. Strength and post skill matter against interior defense.' },
    handoff: { label: 'Dribble handoff', partner: true, desc: 'A teammate hands off to the receiver; timing and passing create space.' },
    catchShoot: { label: 'Catch-and-shoot', partner: true, desc: 'A passer finds the selected shooter. Denial can disrupt the route.' },
    cut: { label: 'Backdoor cut', partner: true, desc: 'Send a cutter behind the defense. Denial exposes the back door; a crowded paint makes it harder.' },
    driveKick: { label: 'Drive-and-kick', partner: true, desc: 'A driver pulls help toward the paint, then looks for the selected receiver.' },
  };

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
    if (T.manualLineup) {
      const selected = T.manualLineup.map(id => T.avail.find(p => p.id === id)).filter(p => p && !T.st[p.id].out);
      // A coach may use any positions. Injuries and foul-outs still force replacements.
      for (const x of scored) if (selected.length < 5 && !selected.includes(x.p)) selected.push(x.p);
      while (selected.length < 5) {
        const extra = T.avail.find(p => !selected.includes(p)); if (!extra) break;
        selected.push(extra);
      }
      T.manualLineup = selected.map(p => p.id);
      T.onCourt = selected.sort((a, b) => POS_IDX[a.pos] - POS_IDX[b.pos]);
      return;
    }
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
    let three = rules.threePoint ? t.three * .85 * (rules.eraPerimeter ?? 1) : 0;
    let mid = t.mid * HL.clamp(.8+t.pullUp/330,.8,1.11);
    let rim = (t.drive + t.post * 0.6 + (isBig(shooter) ? 5 : 0)) * (rules.eraRim ?? 1);
    // Genesis is mode-specific: an elite hybrid's distinctive strength must
    // affect where the possession actually goes, not just its card portrait.
    if(shooter.genesisPower?.paint)rim*=shooter.genesisPower.paint;
    if (strat.focus === 'inside') { rim *= 1.3; three *= 0.8; }
    if (strat.focus === 'perimeter') { three *= 1.3; rim *= 0.85; }
    if (oppDef === 'zone') { three *= 1.25; rim *= 0.8; }
    if (oppDef === 'drop') { mid *= 1.3; }
    if (rules.fourPoint) three *= 1.1;
    if (rules.handCheck) { rim *= 0.85; mid *= 1.15; }
    return { three: Math.max(0, three), mid: Math.max(1, mid), rim: Math.max(1, rim) };
  }

  // Cross-attribute matchup effects: the shooting stroke, body, handle, strength,
  // speed and defender all contribute to ONE contest. Kept modest so specialists
  // matter without making basketball a height-only simulation.
  HL.matchupEffects = function (shooter, defender, helper = defender) {
    const a = shooter.attrs, d = defender.attrs;
    const reach = p => (p.wingspan || p.height + 3) + (p.attrs.vert - 65) * 0.045;
    const size = HL.clamp((shooter.height - helper.height) * 0.0035 +
      ((shooter.weight || 210) - (helper.weight || 210)) * 0.00016, -0.05, 0.05);
    const contest = HL.clamp((reach(defender) - reach(shooter)) * 0.0017, -0.025, 0.025);
    const handleAdvantage = HL.clamp(((a.handle * .40 + a.speed * .24 + a.accel * .21+a.agility*.15) -
      (d.perD * .50 + d.speed * .22+d.lateral*.28)) * 0.0005, -0.024, 0.024);
    const postAdvantage = HL.clamp(((shooter.height - defender.height) * .0017 +
      ((shooter.weight || 210) - (defender.weight || 210)) * .00013 +
      (a.str - d.str) * .00018), -.035, .035);
    return { size, contest, handleAdvantage, postAdvantage,
      blockReach: HL.clamp((reach(helper) - reach(shooter)) * 0.003, -0.04, 0.04) };
  };

  const aValue = (p,k) => p.attrs[k]??65;
  const dna = (p,key) => HL.clamp(p.dna?.effects?.[key] || 0,-0.03,0.095);

  // ---------- Main ----------
  HL.createGame = function (homeTeam, awayTeam, rules = HL.DEFAULT_RULES(), opts = {}) {
    // Live intentions belong to this game; never edit the league player's tendencies.
    const own = t => ({ ...t, players: t.players.map(p => { const attrs=HL.completeAttributes(p.attrs || {},p.height,p.weight);return {...p, attrs, tend:HL.completeTendencies({...p,attrs})}; }) });
    homeTeam = own(homeTeam); awayTeam = own(awayTeam);
    rules = Object.assign(HL.DEFAULT_RULES(), rules);
    const era = HL.eraContext ? HL.eraContext(rules.season ?? opts.season ?? 2025) : {perimeter:1,rim:1};
    rules.eraPerimeter = era.perimeter; rules.eraRim=era.rim;
    const H = prepTeam(homeTeam, rules), A = prepTeam(awayTeam, rules);
    const hasDNA=[...homeTeam.players,...awayTeam.players].some(p=>p.dna?.mechanics||p.dna?.links);
    const dnaCache=new WeakMap();
    H.home = true;
    const pbp = opts.pbp ? [] : null;
    const injuries = [];
    // Facts for the event log (records, game-winners, four-point plays...), kept for every game.
    const track = { four: [], goAhead: null, last: null, violations: [], clockResets: [], bonusTrips: [], dna:{home:{},away:{}} };
    const recordDNA=(T,actions)=>{const counts=track.dna[T===H?'home':'away'];for(const action of actions)counts[action]=(counts[action]||0)+1;};
    const strategyAdjustments = [homeTeam, awayTeam]
      .filter(t => rules.illegalDefense && t.strategy && t.strategy.defense === 'zone')
      .map(t => ({ teamId: t.id, from: 'zone', to: 'man', reason: 'illegalDefense' }));
    H.qfg = []; A.qfg = []; H.maxTrail = 0; A.maxTrail = 0;
    const teams = [H, A];
    const tactical = [];
    for (const T of teams) {
      T.timeouts = opts.season != null && opts.season < 2017 ? 6 : 7;
      T.timeoutsFourth = 0; T.timeoutsLate = 0; T.timeoutOT = 0;
      T.pendingPlay = null; T.matchup = null; T.huddle = null;
    }
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
    const possPerTeam48 = E.pace * 1.025 + paceAdj + (opts.paceMod || 0);
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
      if (isOT) for (const T of teams) { T.timeouts = 2; T.timeoutOT = quarter; }
      // A rebound at the horn belongs to the finished period, not its next opening possession.
      H.lastOreb = null; A.lastOreb = null;
      let nextCheck = clock;
      const elapsedBefore = Math.min(regSeconds, (quarter - 1) * rules.quarterLen * 60);

      while (clock > 0) {
        // Substitutions at quarter start and every ~3 minutes of game time.
        if (clock >= nextCheck - 0.01 || clock === lenSec || teams.some(T => T.manualLineup && T.onCourt.some(p => T.st[p.id].out))) {
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
          if (quarter === 1 && clock === lenSec) for (const T of teams) if (T.finalizeStarters) {
            for (const x of Object.values(T.st)) x.line.gs = T.onCourt.includes(x.p) ? 1 : 0;
            T.finalizeStarters = false;
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
        const play = offense.pendingPlay;
        offense.pendingPlay = null;
        let playEvent = null;
        if (play) {
          playEvent = tactical.find(e => e.id === play.eventId);
          const eligible = [play.pid, play.partnerId].filter(id => id != null).every(id => offense.onCourt.some(p => p.id === id && !offense.st[id].out));
          playEvent.resolved = true; playEvent.cancelled = !eligible;
          if (!eligible) log(`${HL.GAME_PLAYS[play.play].label} is waved off: a participant has left the floor.`, offense);
          else log(`${offense.st[play.pid].p.name}: ${HL.GAME_PLAYS[play.play].label.toLowerCase()}${play.partnerId != null ? ' with ' + offense.st[play.partnerId].p.name : ''}.`, offense);
        }
        const result = runPossession(offense, D, rules, transition, clutch, log, before, dur, playEvent && !playEvent.cancelled ? play : null, playEvent);
        if (playEvent && !playEvent.cancelled) {
          playEvent.points = offense.score - D.score - before;
          playEvent.offensiveRebound = !!result.keep;
        }
        if (offense.huddle?.remaining > 0) offense.huddle.remaining--;
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

    function runPossession(O, D, rules, transition, clutch, log, lead, secs = 99, play = null, playEvent = null) {
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
        let w = (Math.max(0, p.tend.usage) / 3.4 + 10) * Math.pow(p.ovr / 75, 0.5) * RANK[order.indexOf(p)] * HL.clamp(0.72+(p.tend.shotHunt||55)/190,.78,1.25);
        if (focusStar) w *= Math.pow(p.ovr / 75, 3);
        if (play) {
          const recipient = ['pickPop', 'driveKick'].includes(play.play) ? play.partnerId : play.pid;
          if (p.id === recipient) w *= 3;
          if (p.id === play.pid && p.id !== recipient) w *= 1.35;
        }
        if (O.livePassing?.has(p.id)) w *= HL.clamp(1.25 - (p.tend.passFirst + p.tend.moveBall)/200, .3, 1.25);
        if (D.matchup?.pressure === 'deny' && D.matchup.targetId === p.id && dline.some(x => x.id === D.matchup.pid)) w *= .65;
        if (strat.usageLock && strat.usageLock[p.id]) w *= strat.usageLock[p.id];
        return w;
      });
      const idx = lineup.indexOf(initiator);
      const assigned = D.matchup && dline.find(p => p.id === D.matchup.pid);
      const guarding = (p, index) => {
        if (!assigned || !lineup.some(x => x.id === D.matchup.targetId)) return dline[index] || dline[0];
        D.matchup.event.active = true;
        if (p.id === D.matchup.targetId) return assigned;
        // Swap the original defender so the assigned guard does not cover two players.
        if (dline[index] === assigned) return dline[lineup.findIndex(x => x.id === D.matchup.targetId)] || dline[0];
        return dline[index] || dline[0];
      };
      const defender = guarding(initiator, idx);
      const dnaContext = (p, def, extra = {}) => hasDNA&&HL.DNA?.basketballContext({shooter:p,defender:def,lineup,dline,transition,clutch,coverage:dstrat.defense,play,cache:dnaCache,...extra});
      const formation = dnaContext(initiator,defender);
      if (playEvent && !playEvent.cancelled) playEvent.actualPid = initiator.id;

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
      const dSteal = dline.reduce((s, p) => s + (p.attrs.steal*.8+p.attrs.lateral*.2) * (0.7 + p.tend.gamble / 166), 0) / 5;
      // Lane/backcourt violations account for part of the previously generic turnover budget.
      let pTO = 0.121 + (68 - toSkill) * 0.0022 + (dSteal - 62) * 0.0018;
      if (dstrat.defense === 'press') pTO += 0.025;
      if (strat.focus === 'motion') pTO += 0.008;
      if (play && ['pickRoll','handoff','driveKick'].includes(play.play)) pTO += .012 * (100 - initiator.attrs.pass) / 50;
      if (assigned && D.matchup.targetId === initiator.id && D.matchup.pressure === 'trap') pTO += .018;
      if (transition) pTO += 0.01;
      pTO += ((initiator.tend.riskyPass || 50)-50)*.00015;
      // Signature passing and defensive identities change actual turnover odds.
      pTO -= dna(initiator,'assist')*.19;
      pTO += dline.reduce((n,p)=>n+dna(p,'steal'),0)/Math.max(1,dline.length)*.12;
      pTO += E.tov;
      pTO += formation?.turnover || 0;
      if (R.chance(HL.clamp(pTO, 0.06, 0.25))) {
        O.st[initiator.id].line.tov++;
        const stealP = 0.56 + (dSteal - 62) * 0.008;
        if (R.chance(HL.clamp(stealP, 0.3, 0.7))) {
          const thief = pickBy(dline, p => Math.pow(p.attrs.steal*.85+p.attrs.lateral*.15, 3) * (0.6 + p.tend.gamble / 100));
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
      let shooter = initiator;
      let passer = null;
      // A forced post double can turn this touch into a different player's shot.
      if (formation?.kickChance > 0 && lineup.length > 1 && R.chance(formation.kickChance)) {
        shooter=pickBy(lineup.filter(p=>p!==initiator),p=>Math.pow(Math.max(25,rules.threePoint?p.attrs.three:p.attrs.mid),3));
        passer=initiator;
        log(`${initiator.name} draws help and passes to ${shooter.name}.`,O);
        recordDNA(O,['postKickout']);
      }
      const sIdx = lineup.indexOf(shooter);
      const sDef = guarding(shooter, sIdx);
      const helper = dline.slice().sort((a, b) => (b.attrs.intD + b.attrs.block) - (a.attrs.intD + a.attrs.block))[0];

      const w = shotWeights(O, shooter, rules, strat, dstrat.defense);
      const shotPlan=dnaContext(shooter,sDef);
      if(shotPlan){w.three*=shotPlan.threeWeight;w.mid*=shotPlan.midWeight;w.rim*=shotPlan.rimWeight;}
      // Shot IQ changes which attempts a player chooses, not merely his FG%.
      // Preferences still control play style; intelligent players lean towards
      // their strongest shot types, and poor decisions lead to worse choices.
      if (!play && !transition) {
        const decision = aValue(shooter,'shotSelection');
        const quality = {rim:Math.max(aValue(shooter,'layup'),aValue(shooter,'close'),aValue(shooter,'post')),
          mid:aValue(shooter,'mid'),three:aValue(shooter,'three')};
        const mean=(quality.rim+quality.mid+(rules.threePoint?quality.three:quality.mid))/(rules.threePoint?3:3);
        for (const k of (rules.threePoint?['rim','mid','three']:['rim','mid'])) {
          w[k]*=HL.clamp(1+(decision-55)/45*(quality[k]-mean)*.015,.72,1.4);
        }
      }
      if (play) {
        if (['pickPop','catchShoot','driveKick'].includes(play.play)) { w.three *= 2.4; w.rim *= .55; }
        if (['pickRoll','postUp','cut'].includes(play.play)) { w.rim *= 2.4; w.three *= .5; }
        if (play.play === 'isolation') w.mid *= 1.4;
      }
      // Catch-and-shoot is a shot preference, not a bonus to shooting accuracy.
      // It must act before choosing a shot; the passer is assigned afterwards.
      if (rules.threePoint && shooter.tend.catchShoot > 65) w.three *= 1 + (shooter.tend.catchShoot - 65) / 110;
      let type = R.weighted(['three', 'mid', 'rim'], k => w[k]);
      // Under two seconds there is only time for a catch-and-heave.
      const heave = secs < 2 && !transition;
      if (heave) type = rules.threePoint ? 'three' : 'mid';
      if (transition && R.chance(HL.clamp(.25 + shooter.tend.transition/300,.25,.62))) type = 'rim';
      // An isolation scorer takes more self-created jumpers; off-ball specialists prefer catch-and-shoot.
      if (!play && !transition) {
        if (shooter.tend.iso > 70 && R.chance((shooter.tend.iso-65)/260)) type=shooter.attrs.mid>=shooter.attrs.three ? 'mid' : (rules.threePoint?'three':'mid');
      }
      // Assisted or self-created: real NBA ~85% of made threes, ~55% at the rim, ~40% mid-range are assisted;
      // high-usage creators make their own shots far more often.
      const usgPct = shooter.tend.usage / 3.4 + 10;
      let pAst = { three: 0.86, rim: 0.63, mid: 0.49 }[type] * HL.clamp(1.38 - usgPct * 0.017, 0.3, 1.2);
      // High-level passers convert otherwise similar opportunities into assisted shots.
      const supportingPass = lineup.filter(p => p !== shooter).reduce((m, p) => Math.max(m, p.attrs.pass), 25);
      pAst += HL.clamp((supportingPass - 75) * 0.003, -0.035, 0.055);
      pAst += ((shooter.tend.moveBall||50)-50)*.00025;
      if (strat.focus === 'motion') pAst += 0.08;
      pAst += dna(shooter,'assist') * .72;
      pAst += shotPlan?.assist || 0;
      if (focusStar) pAst -= 0.05;
      if (play && ['catchShoot','cut','pickPop','handoff','driveKick'].includes(play.play)) pAst += .18;
      if (play?.play === 'isolation') pAst -= .2;
      if (transition) pAst += 0.1;
      if (!passer && R.chance(HL.clamp(pAst, 0.05, 0.95))) {
        const intended = play && ['pickPop','driveKick'].includes(play.play) ? play.pid : play?.partnerId;
        passer = pickBy(lineup.filter(p => p !== shooter), p => Math.pow(p.attrs.pass / 50, 3) * (20 + p.tend.passFirst) * (p.id === intended ? 3 : 1) * (1+(hasDNA?(HL.DNA?.mechanicsFor(p,lineup,dnaCache).precision||0)*.5:0)));
      }

      let makeP, value = 2, blockP = 0, foulP = 0, label;
      // Team context: five-man defense and floor spacing affect every shot.
      const teamD = dline.reduce((sum, p) => sum + (eff(D, p, 'perD') + eff(D, p, 'intD') + p.attrs.iq) / 3, 0) / dline.length;
      const spacing = lineup.filter(p => p !== shooter).reduce((sum, p) => sum + p.attrs.three, 0) / Math.max(1, lineup.length - 1);
      const teamIQ = lineup.reduce((sum, p) => sum + p.attrs.iq, 0) / lineup.length;
      const contest = (key) => eff(D, sDef, key);
      const matchup = HL.matchupEffects(shooter, sDef, helper);
      if (type === 'rim') {
        const isPost = play?.play === 'postUp' && shooter.id === play.pid || shooter.tend.post > 25 && R.chance(shooter.tend.post / 100);
        const finish = isPost
          ? (eff(O, shooter, 'post') * 0.6 + eff(O, shooter, 'close') * 0.4)
          : Math.max(eff(O, shooter, 'layup'), eff(O, shooter, 'dunk') * 0.92 + shooter.attrs.vert * 0.08, eff(O, shooter, 'close') * 0.97);
        const help = (eff(D, helper, 'intD') + eff(D, helper, 'block') + eff(D,helper,'helpD')) / 3;
        makeP = 0.682 + ((aValue(shooter,'contactFinish')-65)*.00045 +(aValue(shooter,'footwork')-65)*.00022) + (soft(finish) - 70) * 0.0056 - (help - 70) * 0.0031 - (contest('intD') - 65) * 0.0013 + matchup.size + (isPost ? matchup.postAdvantage : matchup.handleAdvantage * 0.5);
        if (transition) makeP += 0.07 + dna(shooter,'transition')*.7;
        makeP += dna(shooter,'rim') * .85 - dna(sDef,'defense')*.62;
        if (dstrat.defense === 'drop') makeP -= 0.015;
        blockP = 0.068 + (helper.attrs.block - 65) * 0.0022 +
          matchup.blockReach;
        foulP = 0.31 + (shooter.attrs.str + finish - 140) * 0.0012;
        label = isPost ? 'post' : (shooter.attrs.dunk > 70 && R.chance(0.35) ? 'dunk' : 'layup');
      } else if (type === 'mid') {
        makeP = 0.455 + ((shooter.attrs.shotCreation-65)*.00042 +(shooter.attrs.contested-65)*.0003) + (soft(eff(O, shooter, 'mid')) - 70) * 0.0048 - (contest('perD') - 65) * 0.0024-(sDef.attrs.contestD-65)*.00028 - matchup.contest + matchup.handleAdvantage;
        if (dstrat.defense === 'drop') makeP += 0.02;
        blockP = 0.018; foulP = 0.06;
        makeP += dna(shooter,'mid')*.85 - dna(sDef,'defense')*.60;
        label = 'jumper';
      } else {
        let deep = rules.fourPoint && R.chance(0.12);
        value = deep ? 4 : (rules.threeValue || 3);
        makeP = 0.338 + ((shooter.attrs.releaseSpeed-65)*.00045 +(shooter.attrs.shotArc-65)*.00035 +(shooter.attrs.releaseHeight-65)*.00028) + (soft(eff(O, shooter, 'three')) - 70) * 0.0055 - (contest('perD') - 65) * 0.0015-(sDef.attrs.contestD-65)*.00022 - matchup.contest * 0.75 + matchup.handleAdvantage * 0.6;
        if (deep) makeP -= 0.09;
        makeP += dna(shooter,'three')*.88 - dna(sDef,'defense')*.6;
        if (passer) makeP += 0.013 + (eff(O, passer, 'pass') - 65) * 0.00045 + (shooter.attrs.iq - 65) * 0.00014;
        else makeP -= 0.015;
        if (dstrat.defense === 'switch') makeP -= 0.008;
        if (dstrat.defense === 'zone') makeP += 0.01;
        blockP = 0.008; foulP = 0.02;
        label = deep ? 'deep 4-pointer' : 'three';
      }
      if (passer && type !== 'three') makeP += 0.008 + (eff(O, passer, 'pass') - 65) * 0.00035;
      if (passer) makeP += (aValue(passer,'vision')-65)*.00022+(aValue(passer,'passingAccuracy')-65)*.00018;
      if (type==='mid' && !passer) makeP += (aValue(shooter,'pullUp')-50)*.00025+(aValue(shooter,'fade')-65)*.00018;
      if (type==='rim') makeP += (aValue(shooter,'burst')-65)*.00018+(aValue(shooter,'floater')-65)*.00013;
      if (play) {
        const partner = play.partnerId != null ? O.st[play.partnerId].p : null;
        if (play.play === 'pickRoll') makeP += ((partner?.attrs.str ?? 50) - 65) * .0006 + (dstrat.defense === 'switch' ? -.008 : .008);
        if (play.play === 'pickPop' && dstrat.defense === 'drop') makeP += .018;
        if (play.play === 'cut') makeP += dstrat.defense === 'zone' ? -.015 : D.matchup?.pressure === 'deny' ? .02 : .008;
        if (partner && ['handoff','catchShoot','driveKick'].includes(play.play)) makeP += (partner.attrs.pass - 65) * .0007;
        if (play.play === 'isolation') makeP += (shooter.attrs.handle - sDef.attrs.perD) * .0006;
      }
      if (assigned && D.matchup.targetId === shooter.id) {
        const pressure = D.matchup.pressure;
        if (pressure === 'tight') { makeP += type === 'rim' ? .012 : -.014; foulP *= 1.15; }
        if (pressure === 'sag') makeP += type === 'rim' ? -.014 : .022;
        if (pressure === 'trap') { makeP -= .025; if (passer) makeP += .035; }
      }
      if (O.huddle?.remaining > 0) makeP += O.huddle.boost;
      // Exceptional tools influence both the shot and its contest. A 99 skill
      // adds meaningful but resistible value, and weaker skills get no free boost.
      const eliteShot = type === 'rim'
        ? Math.max(shooter.attrs.close,shooter.attrs.layup,shooter.attrs.dunk,shooter.attrs.post)
        : type === 'mid' ? Math.max(shooter.attrs.mid,shooter.attrs.fade*.94)
        : shooter.attrs.three;
      const eliteStop = type === 'rim' ? Math.max(sDef.attrs.intD,helper.attrs.block)
        : Math.max(sDef.attrs.perD,sDef.attrs.contestD);
      makeP += 0.042*HL.eliteImpact(eliteShot) - 0.026*HL.eliteImpact(eliteStop);
      if (type === 'mid' && !passer) makeP += 0.016*HL.eliteImpact(shooter.attrs.fade);
      if (type === 'rim') makeP += 0.016*HL.eliteImpact(shooter.attrs.contactFinish);
      if (clutch) makeP += 0.017*HL.eliteImpact(shooter.attrs.clutchShot) + dna(shooter,'clutch')*.77;
      makeP -= (teamD - 66) * 0.0052;
      makeP += (teamIQ - 68) * 0.0024;
      if (type === 'rim') makeP += (spacing - 62) * 0.0018;
      if (rules.handCheck && type !== 'rim') makeP -= 0.012;
      if (clutch) makeP += ((shooter.traits?.clutch ?? 55) - 55) * 0.00085 + (shooter.attrs.clutchShot-65)*.00055 + (shooter.tend.lateGame-50)*.00025;
      makeP += homeBoost + E.efg - 0.025; // Calibrate 2025-26 eFG and offensive efficiency to measured league rates.
      // Score effects: big leads breed complacency, trailing teams push harder.
      makeP -= HL.clamp(lead, -18, 26) * 0.0016;
      // Foul drawing: real players use their real free-throw rate; generated players use scoring talent.
      const draw = shooter.tend.drawFoul != null ? Math.pow(shooter.tend.drawFoul / 44, 0.85) : 1 + (offRating(shooter) - 104) / 55;
      foulP *= HL.clamp(draw, 0.35, 2.4) * E.ftr;
      if (rules.noFouls) foulP = 0;
      if (rules.tackling && type === 'rim') { makeP -= 0.06; }
      const basketball=dnaContext(shooter,sDef,{type,assisted:!!passer,passer});
      if(basketball){makeP+=basketball.make;blockP+=basketball.block;foulP*=1+basketball.foul;recordDNA(O,basketball.actions);}
      makeP = HL.clamp(makeP, 0.05, 0.9);
      if (heave) { makeP = 0.07; foulP = 0; label = 'heave'; }
      else if (secs < 4 && !transition) makeP -= 0.1; // rushed

      const sl = O.st[shooter.id].line;
      // Block
      if(type==='rim'&&helper.genesisPower?.rimProtection)
        blockP+=(helper.genesisPower.rimProtection-1)*.075;
      if (R.chance(HL.clamp(blockP, 0, 0.24))) {
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
      const frameRebound = p => HL.clamp((p.height - 79) * 0.8 + ((p.weight || 215) - 215) * 0.03, -11, 11);
      const oStr = O.onCourt.reduce((s, p) => s + (eff(O, p, 'oreb') + frameRebound(p) + (p.attrs.boxout-65)*.18 + 12*HL.eliteImpact(p.attrs.oreb) + 6*HL.eliteImpact(p.attrs.boxout)) * (0.75 + p.tend.crash / 200), 0) / 5;
      const dStr = D.onCourt.reduce((s, p) => s + eff(D, p, 'dreb') + frameRebound(p)+(p.attrs.boxout-65)*.18 + 12*HL.eliteImpact(p.attrs.dreb) + 6*HL.eliteImpact(p.attrs.boxout), 0) / 5;
      let pOff = 0.268 + (oStr - dStr) * 0.0045 + (O.strat.crash - 50) * 0.0012 + E.orb;
      if (type === 'three') pOff += 0.02;
      pOff += O.onCourt.reduce((n,p)=>n+dna(p,'reb'),0)/Math.max(1,O.onCourt.length)*.36;
      const positioning=(p,T)=>hasDNA&&HL.DNA?.mechanicsFor(p,T.onCourt,dnaCache)||{};
      const offPosition=O.onCourt.reduce((n,p)=>{const m=positioning(p,O);return n+(m.boxPosition||0)*.012+(m.secondChance||0)*.025;},0)/5;
      const defPosition=D.onCourt.reduce((n,p)=>n+(positioning(p,D).boxPosition||0)*.025,0)/5;
      pOff+=HL.clamp(offPosition-defPosition,-.05,.06);
      if(offPosition>0)recordDNA(O,['reboundPosition']);if(defPosition>0)recordDNA(D,['boxOutPosition']);
      if (D.strat.defense === 'zone') pOff += 0.02;
      if (R.chance(HL.clamp(pOff, 0.1, 0.45))) {
        const r = pickBy(O.onCourt, p => Math.pow(Math.max(25, p.attrs.oreb + frameRebound(p)+(p.attrs.boxout-65)*.2+13*HL.eliteImpact(p.attrs.oreb)+8*(positioning(p,O).secondChance||0)) / 50, 1.7) * (0.5 + p.tend.crash / 100) *
          (p.genesisPower?.boards||1));
        O.st[r.id].line.orb++;
        O.lastOreb = r.id;
        log(`Offensive rebound ${r.name}.`, O);
        return { keep: true, transition: false };
      }
      const r = pickBy(D.onCourt, p => Math.pow(Math.max(25, p.attrs.dreb + frameRebound(p)+13*HL.eliteImpact(p.attrs.dreb)+8*(positioning(p,D).boxPosition||0)) / 50, 1.85) *
        (p.genesisPower?.boards||1));
      D.st[r.id].line.drb++;
      // Defensive rebounds sometimes lead to a fast break; fast teams run more.
      return { keep: false, transition: R.chance(0.13 + (D.strat.pace - 50) * 0.002) };
    }

    let ot = 0;

    const box = (T) => {
      const out = {};
      for (const id in T.st) {
        const l = { ...T.st[id].line, min: Math.round(T.st[id].line.min * 10) / 10 };
        if (T.st[id].played > 0 || l.gs) { l.gp = 1; out[id] = l; }
      }
      return out;
    };
    const result = () => ({
      home: { teamId: homeTeam.id, score: H.score, quarters: H.quarters, box: box(H) },
      away: { teamId: awayTeam.id, score: A.score, quarters: A.quarters, box: box(A) },
      ot, pbp, injuries,
      events: {
        ...(Object.keys(track.dna.home).length||Object.keys(track.dna.away).length?{dna:track.dna}:{}),
        ...(tactical.length ? { tactical } : {}),
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
      command(teamId, kind, values = {}) {
        const T = teams.find(t => t.team.id === teamId);
        const fail = reason => ({ ok: false, reason });
        if (!T || finished || quarter >= 4 && remaining <= 0 && H.score !== A.score) return fail('The game is no longer awaiting a decision.');
        const schemas = { lineup:['pids'],autoRotation:[],timeout:[],play:['play','pid','partnerId'],matchup:['pid','targetId','pressure'],clearMatchup:[],huddle:['intent','text'] };
        if (!Object.hasOwn(schemas,kind) || !values || typeof values !== 'object' || Array.isArray(values) || Object.keys(values).some(k => !schemas[kind].includes(k))) return fail('Choose a supported game decision.');
        const eligible = pid => Number.isInteger(pid) && T.st[pid] && !T.st[pid].out;
        const opening = T.onCourt.length ? T.onCourt : T.starters;
        if (kind === 'lineup' && (!Array.isArray(values.pids) || values.pids.length !== 5 || new Set(values.pids).size !== 5 || !values.pids.every(eligible))) return fail('Choose five different available players from your team.');
        if (kind === 'play') {
          const spec = Object.hasOwn(HL.GAME_PLAYS,values.play) ? HL.GAME_PLAYS[values.play] : null;
          if (!spec || !eligible(values.pid) || !opening.some(p => p.id === values.pid) || spec.partner && (!eligible(values.partnerId) || values.partnerId === values.pid || !opening.some(p => p.id === values.partnerId)) || !spec.partner && values.partnerId != null) return fail('Choose a supported play and its available participants on the floor.');
        }
        if (kind === 'matchup' && (!eligible(values.pid) || !opening.some(p => p.id === values.pid) || !['tight','sag','deny','trap'].includes(values.pressure) || !teams.find(t => t !== T).avail.some(p => p.id === values.targetId && !teams.find(t => t !== T).st[p.id].out))) return fail('Choose your on-floor defender, an available opponent and a coverage.');
        if (kind === 'huddle' && (!['encourage','challenge','calm','accountability','reassure','focus'].includes(values.intent) || typeof values.text !== 'string' || !values.text.trim() || values.text.length > 2000)) return fail('Choose a team-talk intent and write up to 2,000 characters.');
        const modern = opts.season == null || opts.season >= 2017;
        if (kind === 'timeout' && (quarter === 0 || T.timeouts <= 0 || modern && quarter === 4 && (T.timeoutsFourth >= 4 || remaining <= 180 && T.timeoutsLate >= 2))) return fail(quarter === 0 ? 'Tip off before using a timeout.' : 'No timeout is available under the current period limits.');
        const event = { id:tactical.length + 1,kind,teamId,period:quarter,clock:clockStr, ...JSON.parse(JSON.stringify(values)) };
        tactical.push(event);
        if (!T.onCourt.length) chooseLineup(T,{remaining:regSeconds,quarterStart:true,quarter:1,diff:0,clutchTime:false,garbage:false,foulOut:rules.foulOut||0});
        if (kind === 'lineup') {
          T.manualLineup = values.pids.slice(); if (quarter === 0) T.finalizeStarters = true;
          T.onCourt = values.pids.map(id => T.st[id].p).sort((a,b) => POS_IDX[a.pos] - POS_IDX[b.pos]);
          if (quarter === 0) for (const x of Object.values(T.st)) x.line.gs = T.onCourt.includes(x.p) ? 1 : 0;
          event.names = T.onCourt.map(p => p.name); log(`Lineup change: ${event.names.join(', ')}.`,T);
        }
        if (kind === 'autoRotation') { T.manualLineup = null; if (quarter === 0) { T.onCourt = []; T.finalizeStarters = true; for (const x of Object.values(T.st)) x.line.gs = T.starters.includes(x.p) ? 1 : 0; } log('The coach returns to the automatic rotation.',T); }
        if (kind === 'timeout') {
          T.timeouts--; if (quarter === 4) { T.timeoutsFourth++; if (remaining <= 180) T.timeoutsLate++; }
          // Both clubs benefit from the real stoppage. Inventory limits prevent unlimited recovery.
          for (const t of teams) for (const x of Object.values(t.st)) if (!x.out) x.energy = Math.min(1,x.energy + .055);
          event.score = [H.score,A.score]; log(`${T.team.abbr} call timeout. ${T.timeouts} remaining.`,T);
        }
        if (kind === 'play') {
          if (T.pendingPlay) { const old=tactical.find(e=>e.id===T.pendingPlay.eventId); old.cancelled=true;old.resolved=true;old.reason='Replaced by another call'; }
          T.pendingPlay = {...values,eventId:event.id}; event.label=HL.GAME_PLAYS[values.play].label;event.name=T.st[values.pid].p.name;event.resolved=false;
        }
        if (kind === 'matchup') { T.matchup = {...values,event}; log(`${T.st[values.pid].p.name} takes ${teams.find(t=>t!==T).st[values.targetId].p.name}: ${values.pressure} coverage.`,T); }
        if (kind === 'clearMatchup') T.matchup = null;
        if (kind === 'huddle') {
          const ego=T.onCourt.reduce((n,p)=>n+(p.traits?.ego??50),0)/5,ethic=T.onCourt.reduce((n,p)=>n+(p.traits?.workEthic??50),0)/5;
          const boost=values.intent==='challenge' ? (ethic-ego)*.0002 : values.intent==='calm' ? .006 : values.intent==='accountability' ? (ethic-50)*.00015 : .005;
          const usedReplies=new Set(),previousReplies=T.huddle?.responses||[];
          T.talkSequence=(T.talkSequence||0)+1;
          const repeated=T.huddle?.text===values.text&&T.huddle?.intent===values.intent;
          const replies = T.onCourt.map(p => {
            const x=T.st[p.id],ego=p.traits?.ego??50,driven=p.traits?.workEthic??50;
            const lines=values.intent==='challenge'&&ego>=75 ? ['Hold everybody to the same standard. I am working out here.','I heard you. Just make sure everybody hears it too.'] : values.intent==='challenge'&&driven>=65 ? ['Fair. I can give you more on that end.','You are right. Next possession, I will set the tone.'] : x.fouls>=4 ? ['I have to stay disciplined. I cannot give away another foul.','I will contest without reaching. I know my foul count.'] : x.energy<.45 ? ['I am feeling it. A short breather would help me execute.','I want to help, but my legs need a moment.'] : values.intent==='calm' ? ['Let us get into our set. No need to force the first look.','I will settle us down. We have time to run the action.'] : values.intent==='accountability' ? ['That last mistake is on me. Let us get the next one right.','We all have a job to do. I know mine.'] : ['I hear you. Keep moving it and I will stay ready.','We are together. Get a stop, then work for a good shot.','Got it. I will talk more on defense.'];
            const roleLines=isGuard(p)?['I will get us organized before we rush into a shot.','I will keep my head up and find the next pass.','I will make sure we are all hearing the call.']:['I will give the guards a solid screen and roll hard.','I will keep moving after the first action breaks down.','I will keep my body between my man and the basket.'];
            const additions=values.intent==='challenge'&&ego>=75?['Demand it of us all, not just me.','I am giving you what I have. Let us talk about the execution.','I can take criticism. Make sure it is fair.','I want to win too. Tell me the adjustment.','We need each other out here. Keep the message consistent.']:values.intent==='challenge'?['I can be sharper with my assignment.','Let us get the next stop first.','I know what you need. I will do my part.','We cannot wait for someone else to change it.','I will take that responsibility.']:values.intent==='calm'?['One possession at a time. I understand.','I will trust the first good look instead of chasing a hard one.','Let them pressure us. I will stay patient.','I will make the simple play when it is there.','We have to see the whole floor.']:['I will stay connected to the guy next to me.','No wandering after the first pass. I hear you.','I will be ready when the ball comes back.','Keep talking to me on the next action.','We can clean this up together.'];
            const specific=values.intent==='challenge'&&ego>=75||x.fouls>=4||x.energy<.45;
            const stateLines=x.fouls>=4?['I will keep my hands back and move my feet.','I know I am in foul trouble. I have to stay available.','I cannot afford to swipe at another drive.','Tell me if you want a different matchup with these fouls.','I will be careful on the next contest.','I can still defend without reaching.']:x.energy<.45?['My legs are heavy. I need to be honest about that.','I will make the simple play until I catch my breath.','If you give me a short rest, I can bring more energy.','I am trying to stay sharp, but I am tired.','I do not want my fatigue to hurt the group.','Let me get a breather before I lose my assignment.']:additions;
            const all=[...(repeated?['I heard you the first time. Let me put it into practice.','The message is clear. Let us play the next possession.']:[]),...lines,...stateLines,...(specific?[]:roleLines)];
            const prior=previousReplies.find(r=>r.pid===p.id)?.text;
            const choices=all.filter(text=>!usedReplies.has(text)&&text!==prior);
            const text=choices[(p.id+quarter+Math.floor(remaining)+T.talkSequence)%choices.length];
            usedReplies.add(text);
            return {pid:p.id,name:p.name,text,stance:values.intent==='challenge'&&ego>=75?'pushback':x.fouls>=4?'cautious':x.energy<.45?'tired':'engaged'};
          });
          T.huddle = {intent:values.intent,text:values.text,boost:HL.clamp(boost,-.012,.012),remaining:6,responses:replies};
          event.boost=T.huddle.boost; log(`Team talk (${values.intent}): “${values.text}”`,T);
        }
        return {ok:true,event};
      },
      snapshot: () => ({ ...result(), period: quarter, seconds: remaining, clock: clockStr || `${rules.quarterLen}:00`, finished,
        lineups: Object.fromEntries(teams.map(T => [T.team.id, T.onCourt.map(p => ({ pid: p.id, energy: T.st[p.id].energy, fouls: T.st[p.id].fouls }))])),
        possessionTeamId: offense.team.id,
        tactics: Object.fromEntries(teams.map(T => [T.team.id,{manual:!!T.manualLineup,timeouts:T.timeouts,timeoutsFourth:T.timeoutsFourth,timeoutsLate:T.timeoutsLate,pendingPlay:T.pendingPlay?{...T.pendingPlay}:null,matchup:T.matchup?{pid:T.matchup.pid,targetId:T.matchup.targetId,pressure:T.matchup.pressure}:null,huddle:T.huddle?{...T.huddle}:null}])),
        roster: Object.fromEntries(teams.map(T => [T.team.id,T.avail.map(p => ({pid:p.id,energy:T.st[p.id].energy,fouls:T.st[p.id].fouls,targetMinutes:T.st[p.id].target/60,out:T.st[p.id].out}))])),
        out: teams.flatMap(T => T.avail.filter(p => T.st[p.id].out).map(p => p.id)) }),
      control(teamId, values) {
        const T = teams.find(T => T.team.id === teamId); if (!T) return false;
        Object.assign(T.strat, values);
        if (rules.illegalDefense && T.strat.defense === 'zone') T.strat.defense = 'man';
        avgPossSec = 2880 / ((E.pace * 1.025 + ((H.strat.pace + A.strat.pace) / 2 - 50) * .12 + (opts.paceMod || 0)) * 2);
        return true;
      },
      playerControl(pid, values) {
        const T = teams.find(T => T.st[pid]); if (!T) return false;
        Object.assign(T.st[pid].p.tend, values);
        if ('passFirst' in values) { T.livePassing ||= new Set(); T.livePassing.add(pid); }
        return true;
      },
    };
  };
  HL.simGame = function (home, away, rules, opts) {
    const game = HL.createGame(home, away, rules, opts);
    let next; do { next = game.step(); } while (!next.done);
    return next.value;
  };
})();
