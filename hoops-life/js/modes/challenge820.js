// 82-0 Challenge, played as a card game: spin the reels for a franchise and a decade, get dealt a hand
// of real player cards from that club and decade, drag one onto the court (any spot; playing out of
// position costs rating) or the bench. Eight rounds: five starters, three backups. Then the whole season
// plays out live against the real league of the season you pick.
window.HL = window.HL || {};

HL.Challenge = (function () {
  const U = HL.UI, esc = U.esc, R = HL.RNG, FX = HL.FX;
  const STARTERS = ['PG', 'SG', 'SF', 'PF', 'C'];
  const BENCH = ['B1', 'B2', 'B3'];
  const SLOTS = [...STARTERS, ...BENCH];
  const POSI = { PG: 0, SG: 1, SF: 2, PF: 3, C: 4 };
  const TYPICAL_HT = { PG: 75, SG: 77, SF: 79, PF: 81, C: 83 };
  const HAND = 5;
  const yrLabel = y => `${y}-${String(+y + 1).slice(2)}`;

  // Every historical club -> the modern franchise it belongs to (official lineage).
  const LINEAGE = {
    TRI: 'ATL', MLH: 'ATL', STL: 'ATL', ATL: 'ATL', BOS: 'BOS', NYN: 'BKN', NJN: 'BKN', BRK: 'BKN', CHH: 'CHA', CHA: 'CHA', CHO: 'CHA', CHI: 'CHI', CLE: 'CLE',
    DAL: 'DAL', DEN: 'DEN', FTW: 'DET', DET: 'DET', PHW: 'GSW', SFW: 'GSW', GSW: 'GSW', SDR: 'HOU', HOU: 'HOU', IND: 'IND', BUF: 'LAC', SDC: 'LAC', LAC: 'LAC',
    MNL: 'LAL', LAL: 'LAL', VAN: 'MEM', MEM: 'MEM', MIA: 'MIA', MIL: 'MIL', MIN: 'MIN', NOH: 'NOP', NOK: 'NOP', NOP: 'NOP', NYK: 'NYK', SEA: 'OKC', OKC: 'OKC',
    ORL: 'ORL', SYR: 'PHI', PHI: 'PHI', PHO: 'PHX', POR: 'POR', ROC: 'SAC', CIN: 'SAC', KCO: 'SAC', KCK: 'SAC', SAC: 'SAC', SAS: 'SAS', TOR: 'TOR', NOJ: 'UTA', UTA: 'UTA',
    CHP: 'WAS', CHZ: 'WAS', BAL: 'WAS', CAP: 'WAS', WSB: 'WAS', WAS: 'WAS',
  };
  const posOk = (posStr, slot) => posStr.split('-').some(p => p === slot || (p === 'G' && (slot === 'PG' || slot === 'SG')) || (p === 'F' && (slot === 'SF' || slot === 'PF')));
  const teamMeta = fr => HL.TEAMS.find(t => t.abbr === fr);

  let st = null;

  // ---------- data ----------
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
        if (!cur || HL.historicalSeasonOvr(r) > HL.historicalSeasonOvr(cur.row)) best.set(r.pid, { row: r, season: +k, club: r.stints.find(s => LINEAGE[s[0]] === franchise)[0] });
      }
    }
    return [...best.values()].sort((a, b) => HL.historicalSeasonOvr(b.row) - HL.historicalSeasonOvr(a.row));
  }
  // Deal the best available players, rather than a minutes-weighted lottery of reserves.
  function dealHand(franchise, dec, excluded = []) {
    const taken = new Set(excluded);
    return R.shuffle(candidates(franchise, dec).filter(c => !taken.has(c.row.pid)).slice(0, HAND));
  }
  // A player's best 3PT season may not be their highest OVR season. Search every
  // qualifying season, pick their strongest season FOR the drawn skill, then deal.
  function bodyValue(c) {
    const bio = HL.HISTORY.players[c.row.pid];
    // Frame rating, not an overall basketball or athleticism rating.
    return Math.round(HL.clamp(38 + (bio[3] - 69) * 2.6 + (bio[4] - 175) * 0.12, 25, 99));
  }
  function skillValue(c, category) {
    if (category[0] === 'body') return bodyValue(c);
    if (category[0] === 'longevity' || category[0] === 'primeLength')
      return HL.careerTraitFor(c.row.pid)[category[0]];
    if (category[0] === 'tendShot') {
      // Higher shot frequencies are not better decisions. Rank the card by
      // actual estimated shot-choice quality, while importing its shot diet.
      return HL.historicalAttributes(c.row).shotSelection;
    }
    if (category[0] === 'tendTeam') {
      const a=HL.historicalAttributes(c.row);
      return Math.round((a.iq+a.vision+a.passingAccuracy+a.helpD+a.hustle)/5);
    }
    if (category[0].startsWith('tend')) {
      const t=HL.historicalTendencies(c.row);
      return Math.round(category[2].reduce((n,k)=>n+(t[k]??50),0)/category[2].length);
    }
    const a = HL.historicalAttributes ? HL.historicalAttributes(c.row) : HL.History.unpack(c.row.attrs, HL.HISTORY.attrs);
    // Elevation is a physical matchup tool, not a measure of shooting technique.
    // A short, quick-release shooter must not lose a mechanics grade to height.
    if (category[0] === 'jumper') return Math.round(a.releaseSpeed * .6 + a.shotArc * .4);
    return Math.round(category[2].reduce((n, k) => n + a[k], 0) / category[2].length);
  }
  const skillCache = new Map();
  function skillCandidates(franchise, dec, category) {
    const ck = `${franchise}:${dec}:${category[0]}`;
    if (skillCache.has(ck)) return skillCache.get(ck);
    const best = new Map();
    for (const k of HL.HISTORY.seasons) {
      if (k.includes('-') || Math.floor(+k / 10) * 10 !== dec || !HL.HISTORY_SEASONS[k]) continue;
      for (const r of HL.History.seasonRows(k)) {
        const club = r.stints.find(s => LINEAGE[s[0]] === franchise && s[1] >= 20);
        if (!club) continue;
        const c = { row: r, season: +k, club: club[0] };
        const old = best.get(r.pid);
        if (!old || skillValue(c, category) > skillValue(old, category) ||
          (skillValue(c, category) === skillValue(old, category) && HL.historicalSeasonOvr(c.row) > HL.historicalSeasonOvr(old.row))) best.set(r.pid, c);
      }
    }
    const ranked = [...best.values()].sort((a, b) => skillValue(b, category) - skillValue(a, category) || HL.historicalSeasonOvr(b.row) - HL.historicalSeasonOvr(a.row));
    skillCache.set(ck, ranked);
    return ranked;
  }
  function dealSkillHand(franchise, dec, category, excluded = []) {
    const taken = new Set(excluded);
    return skillCandidates(franchise, dec, category).filter(c => !taken.has(c.row.pid)).slice(0, HAND);
  }
  function franchisesIn(dec) {
    const set = new Set();
    for (const k of HL.HISTORY.seasons) {
      if (k.includes('-') || Math.floor(+k / 10) * 10 !== dec || !HL.HISTORY_SEASONS[k]) continue;
      for (const t of HL.HISTORY_SEASONS[k].teams) if (LINEAGE[t[0]]) set.add(LINEAGE[t[0]]);
    }
    return [...set];
  }

  // Natural positions from the player's listed position ("G-F", "C", "PF"...).
  function naturals(c) {
    const bio = HL.HISTORY.players[c.row.pid];
    const out = new Set();
    for (const p of String(c.row.pos + '-' + (bio[2] || '')).split('-')) {
      if (POSI[p] != null) out.add(POSI[p]);
      if (p === 'G') { out.add(0); out.add(1); }
      if (p === 'F') { out.add(2); out.add(3); }
    }
    // Generational point-forwards who truly combine elite passing/handling,
    // quickness and paint resistance can operate at all five positions.
    // This is evidence-based eligibility rather than a name-specific exception.
    const a=HL.historicalAttributes(c.row);
    if (bio[3]>=79 && bio[3]<=85 && a.pass>=96 && a.handle>=83 &&
        a.speed>=79 && a.intD>=75 && a.str>=76 && a.iq>=88)
      for (let i=0;i<5;i++) out.add(i);
    return out.size ? [...out] : [2];
  }
  // Out-of-position cost in rating points: distance between spots, plus how far his size is from the spot's.
  function penalty(c, slot) {
    if (!STARTERS.includes(slot)) return 0;
    const d = Math.min(...naturals(c).map(n => Math.abs(n - POSI[slot])));
    const ht = HL.HISTORY.players[c.row.pid][3] || TYPICAL_HT[slot];
    const size = Math.max(0, Math.abs(ht - TYPICAL_HT[slot]) - 4) * 0.8;
    return Math.round([0, 2, 6, 11, 16][d] + (d ? size : 0));
  }
  const rating = c => HL.historicalSeasonOvr(c.row);
  function fittedAttributes(c, slot, original) {
    const out = { ...original }, pen = penalty(c, slot);
    if (!pen) return out;
    const role = ['PG', 'SG'].includes(slot) ? ['handle', 'pass', 'perD', 'steal', 'iq'] :
      ['PF', 'C'].includes(slot) ? ['intD', 'block', 'oreb', 'dreb', 'post', 'iq'] :
      ['handle', 'pass', 'perD', 'intD', 'iq'];
    for (const k of role) out[k] = Math.max(25, out[k] - pen);
    return out;
  }
  // Offensive impact survives a natural-position assignment, but is reduced
  // when the player is forced into a significantly different position.
  const effRating = (c, slot) => {
    const pen=penalty(c,slot);
    // 82-0 uses the same season rating as Skill Draft and the historical roster.
    // Matching a natural spot is a +1 bonus, never an inexplicable demotion.
    // The 100 tier belongs only to verified all-time peaks, not every 99 card.
    if (pen===0) return Math.min(HL.legendaryPeak(c.row)?100:99,rating(c)+1);
    // Out-of-position players lose effectiveness in real possessions through
    // fittedAttributes; the displayed rating also reflects that role penalty.
    return Math.max(25,rating(c)-pen);
  };

  // ---------- run ----------
  function seedFor(s) { let h = 2166136261; for (const ch of s) h = Math.imul(h ^ ch.charCodeAt(0), 16777619); return Math.abs(h) % 2147483647; }
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  function newRun(cfg) {
    HL.DNAFX?.reset();
    st = { mode: cfg.mode, decades: cfg.decades, playSeason: cfg.playSeason, daily: !!cfg.daily, date: cfg.daily ? today() : null,
      round: 0, phase: 'spin', team: null, decade: null, hand: [], lineup: Object.fromEntries(SLOTS.map(s => [s, null])),
      skips: { team: 2, era: 2, all: 2 }, usedSkips: 0, used: [], plan: 'balanced', result: null, pulls: [], special:null, dna:null, dream:null, playoffs:null };
    if (st.daily) { st.playSeason = HL.LATEST_SEASON; st.decades = [1960, 1970, 1980, 1990, 2000, 2010, 2020]; R.setSeed(seedFor('820-' + st.date)); }
  }
  const filled = () => SLOTS.filter(s => st.lineup[s]).length;

  async function spin(what = 'both') {
    const run=st;
    st.phase = 'reeling';
    const openDecades = st.decades.filter(d => !st.used.includes(d) || st.used.length >= st.decades.length);
    if (what !== 'team') st.decade = R.pick(openDecades.filter(d => d !== st.decade || openDecades.length === 1));
    await loadDecade(st.decade);
    if(st!==run)return;
    const fr = franchisesIn(st.decade);
    if (what !== 'era' || !fr.includes(st.team)) st.team = R.pick(fr.filter(t => t !== st.team || fr.length === 1));
    // A rare legendary team REPLACES the team roll (no extra card).
    st.special=null;
    const special = what === 'both' || what === 'all' ? await HL.Legends.rollDraftTeam():null;
    if(st!==run)return;
    if(special){st.special=special.spec;st.decade=Math.floor(special.spec.year/10)*10;st.team=special.spec.franchise;}
    // Deal the hand now (seeded), reveal it after the reels land.
    const taken = new Set(SLOTS.filter(s => st.lineup[s]).map(s => st.lineup[s].row.pid));
    st.hand = special ? special.hand.filter(c=>!taken.has(c.row.pid)) : dealHand(st.team, st.decade, taken);
    render();
    const host = document.querySelector('#reels');
    const teams = HL.TEAMS.map(t => t.abbr);
    const decs = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];
    await FX.reels(host, [
      { label: 'Franchise', items: teams.map(a => `<div>${U.logo(teamMeta(a), 62)}</div>`), final: teams.indexOf(st.team) },
      { label: 'Decade', items: decs.map(d => `<div>${d}s</div>`), final: decs.indexOf(st.decade) },
    ], { colors: [U.teamAccent(teamMeta(st.team)).c, '#ffd84f', '#fff'] }).catch(()=>U.toast('The reel animation was skipped. Your cards are ready.'));
    if(st!==run)return;
    st.phase = 'hand';
    render(true);
  }

  function place(handIdx, slot) {
    const c = st.hand[handIdx];
    if (!c || st.lineup[slot] || st.phase !== 'hand') return;
    const oldDna=st.dna;
    st.lineup[slot] = c;
    st.dna=HL.DNA.analyze(SLOTS.filter(x=>st.lineup[x]).map(x=>({pid:st.lineup[x].row.pid,cat:x,row:st.lineup[x].row,season:st.lineup[x].season})),{mode:'team'});
    const unlocked=st.dna.mutations.find(x=>!oldDna?.mutations.some(y=>y.id===x.id));
    if (c.legendary && !st.pulls.includes(c.row.pid)) st.pulls.push(c.row.pid);
    st.used.push(st.decade);
    st.hand = [];
    st.round++;
    const pen = penalty(c, slot);
    FX.sfx.pop(Math.min(4, FX.tierIndex(rating(c))));
    st.phase = filled() === SLOTS.length ? 'ready' : 'spin';
    render();
    const el = document.querySelector(`.slot-wrap[data-slot="${slot}"]`);
    if (el) FX.burst(el, FX.tierOf(rating(c)).colors.concat('#fff'), FX.tierIndex(rating(c)) >= 3 ? 30 : 14, 0.6);
    if(unlocked)HL.DNAFX.reveal(unlocked,{title:'LEGENDARY TEAM FUSION'});
    if (pen >= 10) U.toast(`<b>${esc(HL.HISTORY.players[c.row.pid][0])}</b> at ${slot}: −${pen} out of position.`);
  }
  function swap(a, b) { if (['season', 'result', 'playoffs'].includes(st.phase)) return; const t = st.lineup[a]; st.lineup[a] = st.lineup[b]; st.lineup[b] = t; FX.sfx.flip(); render(); }

  // ---------- the season, played live ----------
  async function playSeason() {
    const run=st;
    st.phase = 'season';
    render();
    const key = String(st.playSeason);
    await HL.History.load(key);
    if(st!==run)return;
    const L = HL.League.createFromSeason({ seasonKey: key, seed: st.daily ? seedFor('820s-' + st.date) : Date.now() % 100000 });
    const games = L.games;
    const dream = { id: 999, abbr: 'YOU', city: 'Your', name: 'Five', color: '#c9a227', color2: '#111111', conf: 'East', strategy: HL.DEFAULT_STRATEGY() };
    const players = [];
    // Load archived seasons for unlocked historical forms before changing cards.
    for(const form of st.dna?.mutations||[])if(form.year){await HL.History.load(String(form.year));if(st!==run)return;}
    const minutes = { PG: 34, SG: 34, SF: 34, PF: 33, C: 33, B1: 22, B2: 18, B3: 14 };
    for (const slot of SLOTS) {
      const c = st.lineup[slot];
      const p = HL.History.makePlayer(c.row, c.season, 999);
      if (STARTERS.includes(slot)) p.pos = slot;
      // Position changes cost decision-making and role execution, not God-given height,
      // shooting touch or strength. Bigs running PG lose creation, not their post game.
      p.attrs = fittedAttributes(c, slot, p.attrs);
      const forms=(st.dna?.mutations||[]).filter(m=>m.target===c.row.pid);
      for(const form of forms){
        if(!form.year)continue;
        const historic=HL.History.seasonRows(String(form.year))?.find(r=>r.pid===c.row.pid);
        if(!historic)continue;
        const transformed=HL.historicalAttributes(historic);
        // In a fantastical mutation we preserve the drafted player's best
        // tools while changing his form toward the partnered historical peak.
        for(const [key,value] of Object.entries(transformed))if(Number.isFinite(p.attrs[key]))p.attrs[key]=Math.max(p.attrs[key],value);
      }
      p.mutationNames=forms.map(x=>x.name);
      p.realMpg = minutes[slot];
      if (c.season < 1979 && st.playSeason >= 1979 && p.attrs.three >= 55) { const move = Math.round(p.tend.mid * 0.45 * (p.attrs.three - 40) / 59); p.tend.three += move; p.tend.mid -= move; }
      p.ovr = Math.min(100,Math.max(effRating(c,slot),HL.computeOvr(p.attrs,p.pos)));
      p.slot = slot;p.historicalPid=c.row.pid;
      players.push(p);
    }
    // Five replacement-level players fill out the roster for garbage time and emergencies.
    const archs = ['3d', 'defguard', 'rimbig', 'sniper', 'twoway'];
    for (let i = 0; i < 5; i++) {
      const pos = STARTERS[i];
      const b = HL.createPlayer({ name: `${R.pick(HL.NAMES.first)} ${R.pick(HL.NAMES.last)}`, pos, age: 27, height: TYPICAL_HT[pos], ovr: R.int(66, 71), arch: archs[i], real: false, season: 2025, teamId: 999 });
      b.realMpg = 2;
      players.push(b);
    }
    const dnaEntries=SLOTS.map(slot=>({pid:st.lineup[slot].row.pid,cat:slot,row:st.lineup[slot].row,season:st.lineup[slot].season,playerId:players[SLOTS.indexOf(slot)].id}));
    // Historical mutations remain distinct from team chemistry.
    st.dna=HL.DNA.applyTeam(players.slice(0,8),dnaEntries);
    dream.players = players;
    st.dream=dream;
    dream.strategy.starters = players.slice(0, 5).map(p => p.id);
    // Game plans alter real possessions: tempo, shot priorities, defensive coverage and glass.
    const tactical=HL.Legacy.gamePlans[st.plan] || HL.Legacy.gamePlans.balanced;
    Object.assign(dream.strategy,{ focus:tactical.focus, pace:tactical.pace, defense:tactical.defense, crash:tactical.crash });
    // Legendary specials are draft-only. Exhibitions never replace league games.
    const opps = L.teams;
    // Fair opponent mix: everyone appears twice before any third matchup; shuffle the dates.
    const schedule = R.shuffle(Array.from({ length: games }, (_, i) => opps[i % opps.length]));
    const rules = Object.assign({}, L.rules, { profile: L.profile });
    let w = 0, l = 0, pf = 0, pa = 0, streak = 0, best = 0, firstLoss = null;
    const lines = {};
    for (const p of players) lines[p.id] = HL.blankStatLine();
    // Injuries last across the full schedule. This prevents eight legends from
    // being fully healthy at every tip-off regardless of what happened last night.
    const absences=Object.fromEntries(players.map(p=>[p.id,0]));
    const injuriesLog=[];
    const log = [], gameLog=[];
    const q = sel => document.querySelector(sel);
    const batch = FX.reduced() ? games : 1;
    for (let g = 0; g < games; g++) {
      const opp = schedule[g];
      const oppObj = { id: opp.id, abbr: opp.abbr, strategy: opp.strategy, players: opp.customPlayers || HL.League.teamPlayers(opp.id) };
      for (const p of players) {
        if(p.injury?.games>0) { absences[p.id]++; }
        else p.injury=null;
      }
      const home = g % 2 === 0;
      const res = home ? HL.simGame(dream, oppObj, rules) : HL.simGame(oppObj, dream, rules);
      const mine = home ? res.home : res.away, theirs = home ? res.away : res.home;
      // Injury duration is consumed after the player actually misses a game.
      for (const p of players) if(p.injury?.games>0) p.injury.games--;
      // Treat in-game injuries as future-game absences; only our players persist.
      for (const event of res.injuries||[]) {
        if(event.teamId!==dream.id) continue;
        const victim=players.find(p=>p.id===event.pid);
        if(!victim) continue;
        const duration=Math.max(1,Math.round(event.games||1));
        victim.injury={name:event.name||'Injury', games:duration};
        injuriesLog.push({g:g+1,name:victim.name,injury:victim.injury.name,games:duration});
      }
      const won = mine.score > theirs.score;
      if (won) { w++; streak++; best = Math.max(best, streak); } else { l++; streak = 0; }
      pf += mine.score; pa += theirs.score;
      gameLog.push({g:g+1,opp:opp.name,home,for:mine.score,against:theirs.score,win:won});
      for (const id in mine.box) for (const k in lines[id]) lines[id][k] += mine.box[id][k] || 0;
      if (!won) { log.push({ opp, score: `${mine.score}-${theirs.score}`, g: g + 1 }); if (!firstLoss) firstLoss = { g: g + 1, opp }; }
      // Live ticker.
      const d = document.querySelectorAll('.ticker .dots i')[g];
      if (d) d.className = won ? 'w' : 'l';
      if (q('.ticker .rec')) q('.ticker .rec').textContent = `${w}-${l}`;
      if (won) FX.sfx.win(); else FX.sfx.loss();
      if (!won && l === 1) {
        const status=q('.ticker .status');if(status){status.textContent=`First loss · Game ${g+1} vs ${opp.name}`;status.classList.add('over');}
        FX.shake(q('.ticker'),0.8);
        if(q('.ticker')){
          const decision=document.createElement('div');decision.className='dna-first-loss';
          decision.innerHTML=`<b>The perfect season is over.</b><p>Continue chasing 73 wins, a championship and your team's legacy, or restart the challenge?</p><button class="btn go" data-keep>Continue the season</button> <button class="btn" data-restart>Restart</button>`;
          q('.ticker').appendChild(decision);
          const continueRun=await new Promise(done=>{run.cancelSeason=()=>done(false);decision.querySelector('[data-keep]').onclick=()=>done(true);decision.querySelector('[data-restart]').onclick=()=>done(false);});
          run.cancelSeason=null;
          decision.remove();
          if(st!==run)return;
          if(!continueRun){st=null;render();return;}
        }
      }
      if (q('.ticker .sub')) q('.ticker .sub').textContent = `${(pf / (g + 1)).toFixed(1)} PPG · ${(pa / (g + 1)).toFixed(1)} allowed · ${streak > 1 ? `${streak}-game win streak` : streak === 1 ? 'won the last one' : 'lost the last one'}`;
      // Starts quick, and slows down when a perfect season is still alive late.
      if ((g + 1) % batch === 0) await FX.wait(!l && g > games - 8 ? 320 : g < 10 ? 90 : 50);
      if(st!==run)return;
    }
    st.result = { w, l, games, pf: pf / games, pa: pa / games, best, losses: log, lines, players, firstLoss, gameLog,absences,injuriesLog,specialEncounter:null, dna:st.dna, specialDraft:st.special?.label||null };
    st.playoffTeams=L.teams;st.playoffRules=Object.assign({},L.rules,{profile:L.profile});
    st.result.identity = HL.Legacy.teamReport(st.result,st.playSeason,st.plan);
    st.result.unlocked = achievements();
    saveBest();
    const [tier, line] = verdict(w, games);
    const t = w === games ? 4 : w / games >= 75 / 82 ? 3 : w / games >= 55 / 82 ? 2 : w / games >= 42 / 82 ? 1 : 0;
    await FX.banner(tier, `${w}-${l}. ${esc(line)}`, { tier: t, kicker: `${games}-0 Challenge · ${yrLabel(st.playSeason)}`, ms: 3200 });
    if(st!==run)return;
    st.phase = 'result';
    render();
    for (const a of st.result.unlocked.filter(x => x.fresh)) { await FX.wait(250);if(st!==run)return; U.toast(`Achievement unlocked: <b>${esc(a.name)}</b>`); FX.sfx.pop(3); }
  }

  // ---------- Postseason side quest: game by game, four best-of-seven series ----------
  const ROUND_TITLES=['First round','Conference semifinals','Conference finals','NBA Finals'];
  function createPlayoffSession(dream,guest,rules,home=true){
    const game=home?HL.createGame(dream,guest,rules):HL.createGame(guest,dream,rules);
    let pending=false,completed=null,decisionUsed=false;
    function advance(){
      if(completed)return {result:completed};
      if(pending)return {pending:true,snapshot:game.snapshot()};
      let step;
      do{
        step=game.step();
        if(step.done){completed=step.value;return {result:completed};}
        const v=game.snapshot(),my=home?v.home:v.away,opp=home?v.away:v.home;
        if(!decisionUsed&&v.period>=4&&v.seconds>0&&v.seconds<=24&&Math.abs(my.score-opp.score)<=3&&v.possessionTeamId===dream.id){pending=true;return {pending:true,snapshot:v};}
      }while(!step.done);
    }
    function choose(pid,move){
      if(!pending||!['three','fade','drive','pass'].includes(move))return {ok:false,reason:'No supported closing decision is pending.'};
      const v=game.snapshot(),on=v.lineups[dream.id],hero=on.find(x=>x.pid===pid);
      if(!hero||v.out.includes(pid))return {ok:false,reason:'Choose an available player already on the floor.'};
      if(move==='three'&&!rules.threePoint)return {ok:false,reason:'This era has no three-point line.'};
      const partner=on.filter(x=>x.pid!==pid).sort((a,b)=>{
        const pa=dream.players.find(p=>p.id===a.pid),pb=dream.players.find(p=>p.id===b.pid);
        return (move==='pass'?pb.attrs.three:pb.attrs.pass)-(move==='pass'?pa.attrs.three:pa.attrs.pass);
      })[0]?.pid;
      const play=move==='three'?'catchShoot':move==='drive'?'cut':move==='pass'?'driveKick':'isolation';
      const call={play,pid,...(HL.GAME_PLAYS[play].partner?{partnerId:partner}:{})};
      const response=game.command(dream.id,'play',call);if(!response.ok)return response;
      pending=false;decisionUsed=true;
      const done=advance();return {ok:true,result:done.result,event:response.event,hero:dream.players.find(p=>p.id===pid)?.name,play:HL.GAME_PLAYS[play].label};
    }
    return {advance,choose,snapshot:()=>game.snapshot()};
  }
  function startPlayoffs(){
    const pool=(st.playoffTeams||[]).slice().sort((a,b)=>(b.real?.w||0)-(a.real?.w||0));
    const without=pool.filter(t=>t.id!==999);
    const chosen=[];
    // Escalating opposition rather than four arbitrary repeat matches.
    for(const slot of [Math.min(7,without.length-1),Math.min(3,without.length-1),Math.min(1,without.length-1),0]){
      const opp=without[slot]||R.pick(without);if(opp&&!chosen.some(x=>x.id===opp.id))chosen.push(opp);
      else{const alt=without.find(t=>!chosen.some(x=>x.id===t.id));if(alt)chosen.push(alt);}
    }
    st.playoffs={round:0,wins:0,losses:0,opponents:chosen,history:[],pending:null,last:null,completed:false,champion:false};
    st.phase='playoffs';
  }
  function finishPlayoffGame(result){
    const P=st.playoffs,winner=result.mine>result.theirs;winner?P.wins++:P.losses++;
    P.last={...result,winner,round:ROUND_TITLES[P.round],series:`${P.wins}-${P.losses}`};
    P.history.push(P.last);
    if(P.wins===4){if(P.round>=3){P.completed=true;P.champion=true;}else{P.round++;P.wins=0;P.losses=0;}}
    if(P.losses===4){P.completed=true;P.champion=false;}
    if(P.completed){st.result.playoffRun=P.history.slice();st.result.champion=P.champion;}
    render();
  }
  function playPlayoffGame(){
    const P=st.playoffs;if(!P||P.completed||P.pending)return;
    const opp=P.opponents[P.round],players=HL.League.teamPlayers(opp.id),home=(P.wins+P.losses)%2===0;
    const guest={...opp,players,strategy:opp.strategy||HL.DEFAULT_STRATEGY()};
    const session=createPlayoffSession(st.dream,guest,st.playoffRules,home),step=session.advance();
    const raw=step.snapshot||step.result,my=home?raw.home:raw.away,rival=home?raw.away:raw.home;
    const game={mine:my.score,theirs:rival.score,opp:opp.name,opponent:opp,raw,home,game:P.history.length+1,hero:null,play:null};
    if(step.pending){P.session=session;P.pending=game;render();return;}
    consumePlayoffInjuries(game);finishPlayoffGame(game);
  }
  function consumePlayoffInjuries(g){
    for(const p of st.dream.players)if(p.injury?.games>0)p.injury.games--;
    for(const e of g.raw.injuries||[]){const p=st.dream.players.find(p=>p.id===e.pid);if(p&&e.teamId===st.dream.id)p.injury={name:e.name,games:Math.max(1,e.games||1)};}
  }
  function resolvePlayoffClutch(move){
    const P=st.playoffs,g=P?.pending;if(!g||!P.session)return;
    const sel=document.querySelector('[data-playoff-shooter]'),pid=+(sel?.value);
    const decision=P.session.choose(pid,move);if(!decision.ok){U.toast(esc(decision.reason));return;}
    g.raw=decision.result;const my=g.home?g.raw.home:g.raw.away,opp=g.home?g.raw.away:g.raw.home;
    g.mine=my.score;g.theirs=opp.score;g.decisionPoints=decision.event.points||0;g.hero=decision.hero;g.play=decision.play;g.overtime=g.raw.ot>0;
    P.pending=null;P.session=null;consumePlayoffInjuries(g);finishPlayoffGame(g);
  }
  function playoffView(){
    const P=st.playoffs,opp=P.opponents[Math.min(P.round,3)],last=P.last;
    const pending=P.pending;
    const chooser=pending?`<article class="dna-playoff-clutch"><div class="dna-section-label">THE FINAL POSSESSION</div><h3>One possession can change the series.</h3><p>${esc(pending.opp)} · ${pending.mine}-${pending.theirs}. Choose your closer and move. Matchups, clutch ratings and DNA effects determine the outcome.</p><label>Closer <select data-playoff-shooter>${st.dream.players.filter(p=>pending.raw.lineups[st.dream.id].some(x=>x.pid===p.id)&&!pending.raw.out.includes(p.id)).map(p=>`<option value="${p.id}">${esc(p.name)} · ${p.ovr} OVR</option>`).join('')}</select></label><div class="row wrap">${[['three','Set up a three'],['fade','Create a fade'],['drive','Attack the rim'],['pass','Drive and pass']].filter(([k])=>k!=='three'||st.playoffRules.threePoint).map(([k,label])=>`<button class="btn" data-final-possession="${k}">${label}</button>`).join('')}</div></article>`:'';
    return `<div class="stack" style="gap:13px"><section class="block"><div class="body stack"><div class="caps">82-0 · Postseason side quest</div><h2>${P.completed?(P.champion?'NBA CHAMPIONS':'THE RUN ENDS'):ROUND_TITLES[P.round]}</h2><p>${P.completed?'Final postseason report below':`${esc(opp.name)} · series ${P.wins}-${P.losses} · first to four wins`}</p>${!P.completed&&!pending?'<button class="btn go big" data-playoff-game>Sim next playoff game</button>':''}${chooser}${last?`<div class="dossier-honor"><div class="caps">Last playoff game · ${esc(last.round)}</div><h3>${last.winner?'WIN':'LOSS'} ${last.mine}-${last.theirs} vs ${esc(last.opp)}</h3>${last.hero?`<p>${esc(last.hero)} calls ${esc(last.play)}. The actual possession produces ${last.decisionPoints||0} points; the remaining game and any overtime finish on the possession simulator.</p>`:''}</div>`:''}</div></section><section class="block"><header><h3>Playoff game log</h3></header><div class="body"><div class="scouting-games">${P.history.map((g,i)=>`<div class="kv"><span>${i+1}. ${esc(g.round)} vs ${esc(g.opp)}</span><b>${g.winner?'W':'L'} ${g.mine}-${g.theirs}</b></div>`).join('')||'<p>Your first playoff game awaits.</p>'}</div></div></section>${HL.DNA.board(st.dna,{compact:true})}${P.completed?`<button class="btn go" data-finish-playoffs>Return to your season Verdict</button>`:''}</div>`;
  }

  // ---------- achievements ----------
  const ACH = [
    ['perfect', 'Perfect season', r => r.w === r.games],
    ['seventy', '70-win pace', r => r.w / r.games >= 70 / 82],
    ['legend', 'Legend pull', () => st.pulls.length > 0],
    ['allgold', 'All gold', () => SLOTS.every(s => rating(st.lineup[s]) >= 84)],
    ['bargain', 'Bargain bin (no 90+ starter, 55-win pace)', r => STARTERS.every(s => rating(st.lineup[s]) < 90) && r.w / r.games >= 55 / 82],
    ['oop', 'Out of position, still winning', r => STARTERS.some(s => penalty(st.lineup[s], s) >= 10) && r.w / r.games >= 50 / 82],
    ['noskip', 'No skips, 60-win pace', r => !st.usedSkips && r.w / r.games >= 60 / 82],
    ['oneera', 'One-decade team', () => new Set(SLOTS.map(s => Math.floor(st.lineup[s].season / 10))).size === 1],
    ['daily', 'Daily challenge finished', () => st.daily],
  ];
  function achievements() {
    let have = [];
    try { have = JSON.parse(localStorage.getItem('hl-820-ach') || '[]'); } catch (e) { /* storage unavailable */ }
    const out = ACH.map(([id, name, test]) => ({ id, name, got: !!test(st.result), had: have.includes(id) })).map(a => ({ ...a, fresh: a.got && !a.had }));
    try { localStorage.setItem('hl-820-ach', JSON.stringify([...new Set([...have, ...out.filter(a => a.got).map(a => a.id)])])); } catch (e) { /* storage unavailable */ }
    return out;
  }
  function saveBest() {
    try {
      const all = JSON.parse(localStorage.getItem('hl-820') || '[]');
      all.push({ w: st.result.w, l: st.result.l, season: st.playSeason, daily: st.date, at: Date.now(), mode: st.mode, five: STARTERS.map(s => `${HL.HISTORY.players[st.lineup[s].row.pid][0]} (${st.lineup[s].season})`) });
      all.sort((a, b) => b.w / (b.w + b.l) - a.w / (a.w + a.l));
      localStorage.setItem('hl-820', JSON.stringify(all.slice(0, 20)));
    } catch (e) { /* storage unavailable */ }
  }
  function bestRuns() { try { return JSON.parse(localStorage.getItem('hl-820') || '[]'); } catch (e) { return []; } }

  function verdict(w, games = 82) {
    const f = w / games;
    if (w === games) return ['PERFECT', `${games}-0. Immortal. They will never stop talking about this team.`];
    if (f >= 75 / 82) return ['ALL-TIME TEAM', 'One of the greatest teams ever assembled.'];
    if (f >= 66 / 82) return ['DYNASTY', 'Title favorites by a mile.'];
    if (f >= 55 / 82) return ['CONTENDER', 'Real contender, but not a juggernaut.'];
    if (f >= 42 / 82) return ['PLAYOFF TEAM', 'Good, not great. The fit matters.'];
    return ['LOTTERY', 'History will not be kind to this team.'];
  }

  // ---------- UI ----------
  function cardFor(c, opts = {}) {
    const bio = HL.HISTORY.players[c.row.pid];
    const team = teamMeta(LINEAGE[c.club]) || null;
    const r = c.row;
    const forms=(st.dna?.mutations||[]).filter(m=>m.target===c.row.pid);
    return HL.Cards.card({
      pid: c.row.pid, name: bio[0], nbaId: bio[1], team, pos: r.pos, rating: opts.rating != null ? opts.rating : rating(c),
      meta: `${forms.length ? '✦ MUTATED: '+forms.map(f=>f.name).join(' / ')+' · ' : ''}${c.legendary ? '★ LEGENDARY TEAM · ' : ''}${yrLabel(c.season)} · ${c.club}${bio[3] ? ' · ' + HL.fmtHeight(bio[3]) : ''}`,
      stat: [['PTS', r.pts], ['REB', r.trb], ['AST', r.ast]], hidden: st.mode === 'hoopiq' && st.phase !== 'result', down: opts.down, cls: opts.cls || '', attrs: opts.attrs || '',
    });
  }

  function courtView() {
    const spots = { PG: [50, 80], SG: [83, 57], SF: [17, 57], PF: [71, 24], C: [29, 24] };
    const hide = st.mode === 'hoopiq' && st.phase !== 'result';
    const five = STARTERS.filter(s => st.lineup[s]).map(s => effRating(st.lineup[s], s));
    const avg = five.length ? Math.round(five.reduce((a, b) => a + b, 0) / five.length) : null;
    const spotHtml = s => {
      const c = st.lineup[s];
      const pen = c ? penalty(c, s) : 0;
      return `<div class="spot slot-wrap" data-slot="${s}" style="left:${spots[s][0]}%;top:${spots[s][1]}%">
        ${c ? cardFor(c, { cls: 'mini placed', attrs: `data-from="${s}"`, rating: hide ? rating(c) : effRating(c, s) }) : `<div class="slot" data-drop="${s}">${s}</div>`}
        ${c ? `<span class="fit ${pen >= 6 ? 'bad' : pen ? '' : 'ok'}">${s}${hide ? '' : pen ? ` −${pen}` : ' +1 fit'}</span>` : ''}</div>`;
    };
    const bench = BENCH.map((s, i) => {
      const c = st.lineup[s];
      return `<div class="bench-spot slot-wrap" data-slot="${s}">${c ? cardFor(c, { cls: 'mini placed', attrs: `data-from="${s}"` }) : `<div class="slot" data-drop="${s}">${['6th', '7th', '8th'][i]}</div>`}<span class="t3 xs">${['Sixth man', 'Seventh man', 'Eighth man'][i]}</span></div>`;
    }).join('');
    return `<div class="court">
      <svg class="lines" viewBox="0 0 500 410" preserveAspectRatio="none" aria-hidden="true">
        <g fill="none" stroke="rgba(255,255,255,.75)" stroke-width="3">
          <rect x="4" y="4" width="492" height="402"/><rect x="170" y="4" width="160" height="190"/>
          <circle cx="250" cy="194" r="60"/><path d="M30 4 V140 A220 220 0 0 0 470 140 V4"/><path d="M190 410 A60 60 0 0 1 310 410"/>
          <line x1="220" y1="40" x2="280" y2="40"/><circle cx="250" cy="55" r="9"/>
        </g></svg>
      ${STARTERS.map(spotHtml).join('')}
    </div>
    <div class="bench">${bench}</div>
    ${avg != null && !hide ? `<div class="t2 sm" style="text-align:center">Starting five: <b>${avg}</b> average after position fit</div>` : ''}`;
  }

  function render(revealHand) {
    if (!st) return setupScreen();
    const fm = st.team ? teamMeta(st.team) : null;
    U.applyTeamTheme(fm);
    U.setEra(HL.eraForSeason(st.playSeason));
    let main;
    if (st.phase === 'result') main = resultView();
    else if (st.phase === 'season') main = tickerView();
    else if (st.phase === 'playoffs') main = playoffView();
    else main = machineView(revealHand);
    U.app().innerHTML = `<div class="frame challenge-frame"><div class="masthead"><div class="bar">
        <div class="wordmark" data-home>Hoops<i>Life</i></div>
        <div class="mainnav"><button class="on">82-0 Challenge${st.daily ? ' · Daily' : ''}</button></div>
        <div class="simbar"><span class="t2 sm">${st.mode === 'hoopiq' ? 'HoopIQ' : 'Classic'} · ${yrLabel(st.playSeason)} · Pick ${Math.min(filled() + 1, SLOTS.length)}/${SLOTS.length}</span>${FX.soundToggle()}<button class="btn small" data-new>New run</button></div>
      </div></div>
      <div class="page"><div class="game820">${main}<div class="stack" style="gap:12px">${courtView()}${st.phase==='result'||st.phase==='playoffs'?'':st.dna?HL.DNA.board(st.dna,{compact:true}):''}
        <section class="block"><header><h3>Best runs</h3></header><div class="body">${bestRuns().slice(0, 5).map(r => `<div class="kv"><span>${r.daily ? `<span class="tag">Daily ${esc(r.daily)}</span> ` : ''}${r.five.slice(0, 2).map(esc).join(', ')}…</span><b>${r.w}-${r.l}</b></div>`).join('') || '<div class="t3 sm">No runs yet.</div>'}</div></section>
      </div></div></div></div>`;
    bind();
    if (revealHand) {const cards=[...document.querySelectorAll('.hand .gcard')];FX.flipIn(cards).catch(()=>cards.forEach(c=>{c.classList.remove('down','charging');c.classList.add('up');}));}
  }

  function machineView(reveal) {
    const fm = st.team ? teamMeta(st.team) : null;
    const done = st.phase === 'ready';
    const reel = (label, inner, landed) => `<div class="reel ${landed ? 'landed' : ''}"><div class="reel-label">${label}</div><div class="reel-win"><div class="reel-item" style="height:96px">${inner}</div></div></div>`;
    const showResult = fm && st.phase !== 'reeling' && st.phase !== 'spin';
    const reelHost = `<div id="reels"><div class="reels">${reel('Franchise', showResult ? U.logo(fm, 62) : '?', showResult)}${reel('Decade', showResult ? `${st.decade}s` : '?', showResult)}</div></div>`;
    const controls = done
      ? `<div class="stack" style="align-items:center;gap:8px;margin-top:16px"><div class="result">Your team is set</div><div class="t2 sm">Drag cards between spots, choose your game plan, then play the ${yrLabel(st.playSeason)} season.</div><div class="gameplan-select"><div class="caps">Your coaching identity</div><div class="gameplan-grid">${Object.entries(HL.Legacy.gamePlans).map(([key,plan])=>`<button class="gameplan-option ${st.plan===key?'active':''}" data-gameplan="${key}"><b>${esc(plan.title)}</b><small>${esc(plan.caption)}</small></button>`).join('')}</div><p class="t3 sm">Game plan changes tempo, offensive focus, defensive scheme and rebounding. No three-point bonus applies before 1979-80.</p></div><button class="btn spin" data-play>Play the season</button></div>`
      : `<div class="row" style="justify-content:center;gap:10px;margin-top:16px;flex-wrap:wrap">
          <button class="btn spin" data-spin ${st.phase !== 'spin' ? 'disabled' : ''}>${st.round === 0 ? 'Spin' : `Spin pick ${st.round + 1}`}</button>
          <button class="btn" data-skip="team" ${st.skips.team && st.phase === 'hand' ? '' : 'disabled'}>Team skip (${st.skips.team})</button>
          <button class="btn" data-skip="era" ${st.skips.era && st.phase === 'hand' ? '' : 'disabled'}>Decade skip (${st.skips.era})</button><button class="btn" data-skip="all" ${st.skips.all && st.phase === 'hand' ? '' : 'disabled'}>Full respin (${st.skips.all})</button></div>
        ${fm && st.phase === 'hand' ? `<div class="result">${esc(fm.city)} ${esc(fm.name)} · ${st.decade}s</div>` : ''}`;
    const hand = st.phase === 'hand' ? `<div class="stack" style="gap:8px;margin-top:18px"><div class="t2 sm" style="text-align:center">${st.hand.length ? st.special ? `✦ LEGENDARY TEAM ROLL · ${esc(st.special.label)} · Pick ONE player` : 'Drag a card onto the court or the bench, or tap a card and then a spot.' : 'No players to deal from this club and decade. Use a skip.'}</div>
        <div class="hand">${st.hand.map((c, i) => cardFor(c, { down: !!reveal, attrs: `data-hand="${i}"` })).join('')}</div></div>` : '';
    return `<section class="machine"><div class="lights">${'<i></i>'.repeat(14)}</div>${reelHost}${controls}${hand}</section>`;
  }

  function tickerView() {
    const S = HL.HISTORY_SEASONS[String(st.playSeason)];
    const games = S ? Math.max(...S.teams.map(t => t[2] + t[3])) : 82;
    return `<section class="machine"><div class="lights">${'<i></i>'.repeat(14)}</div><div class="ticker">
      <div class="caps">${yrLabel(st.playSeason)} season · live</div>
      <div class="rec">0-0</div><div class="status">Perfect season alive</div>
      <div class="dots" style="grid-template-columns:repeat(${Math.ceil(games / 2)},1fr)">${'<i></i>'.repeat(games)}</div>
      <div class="sub">Tip-off…</div></div></section>`;
  }

  function identityReport(r) {
    const report=r.identity || HL.Legacy.teamReport(r,st.playSeason,st.plan);
    const m=report.metrics;
    const chapter=(heading,body)=>`<article class="dossier-chapter"><div class="caps">${esc(heading)}</div><p>${esc(body)}</p></article>`;
    const listed=report.labels.map(a=>`<article class="dossier-honor"><div class="caps">Team identity unlocked</div><h3>${esc(a.name)}</h3><p>${esc(a.why)}</p></article>`).join('');
    const swings=[report.biggestWin&&`Biggest blowout: ${esc(report.biggestWin.opp)}, ${report.biggestWin.for}-${report.biggestWin.against}.`,report.worst&&`Toughest loss or closest scare: ${esc(report.worst.opp)}, ${report.worst.for}-${report.worst.against}.`,report.mostPoints&&`Highest scoring night: ${report.mostPoints.for} vs ${esc(report.mostPoints.opp)}.`].filter(Boolean);
    return `<section class="block dossier"><header><h3>The 82-0 Season Film</h3><span class="ml-auto t3 sm">Team DNA · era context · signature moments</span></header><div class="body stack">
      <div class="dossier-lead">${esc(report.summary)}</div>
      ${r.specialEncounter?`<article class="dossier-honor"><div class="caps">Rare alternate-history encounter</div><h3>${esc(r.specialEncounter.name)}</h3><p>${esc(r.specialEncounter.note)}</p></article>`:''}<div class="caps">What this team became</div><div class="dossier-grid">${listed}</div>
      ${report.narrative.map((x,i)=>chapter(['The bigger picture','Compared with the era','Under pressure','Rules changed the game'][i]||'Film-room note',x)).join('')}
      <div class="dossier-two"><article class="dossier-honor"><div class="caps">The offense</div><h3>${(100*m.ts).toFixed(1)}% TS</h3><p>${(m.assists).toFixed(1)} assists and ${(m.threes).toFixed(1)} made threes per game. ${(m.threeRate*100).toFixed(1)}% of all shots from distance.</p></article>
      <article class="dossier-honor"><div class="caps">The defense</div><h3>${r.pa.toFixed(1)} allowed</h3><p>${m.blocks.toFixed(1)} blocks, ${m.steals.toFixed(1)} steals per game. Margin: ${m.margin>=0?'+':''}${m.margin.toFixed(1)}.</p></article></div>
      <div class="caps">Signature nights</div><div class="dossier-turns">${swings.map((x,i)=>`<div class="dossier-turn"><b>${String(i+1).padStart(2,'0')}</b><span>${x}</span></div>`).join('')}</div>
      <details><summary>Season health and availability (${r.injuriesLog?.length||0} injuries)</summary>
        <p>Availability matters in a full schedule. Healthy replacements are used when drafted starters and reserves cannot play.</p>
        ${(r.injuriesLog||[]).length ? r.injuriesLog.slice(0,30).map(e=>`<p>Game ${e.g}: ${esc(e.name)} · ${esc(e.injury)} · ${e.games} projected missed games.</p>`).join('') : '<p>No recorded injuries to your drafted team this season.</p>'}
        <div class="dossier-grid">${r.players.slice(0,8).filter(p=>r.absences?.[p.id]).map(p=>`<div class="dossier-honor"><b>${esc(p.name)}</b><p>${r.absences[p.id]} games unavailable</p></div>`).join('')}</div>
      </details>
      <details><summary>How these team titles are earned</summary><p>Each identity is based on actual simulated attempts, makes, assists, stops, margins or role traits. Thresholds change with rules and, when available, real league baselines. The era is ${yrLabel(st.playSeason)}. Game-plan identity: ${esc(report.plan.title)}. An undefeated record is never guaranteed.</p></details>
    </div></section>`;
  }

  function resultView() {
    const r = st.result;
    const [tier, line] = verdict(r.w, r.games);
    const posterTeam = { abbr: 'YOU', city: 'The', name: 'Five', color: '#c9a227', color2: '#111111', espn: null };
    const rows = r.players.slice(0, SLOTS.length).map(p => { const l = r.lines[p.id]; const g = Math.max(1, l.gp); return `<tr><td class="l"><b>${esc(p.name)}</b> <span class="t3 xs">${p.slot.startsWith('B') ? 'Bench' : p.slot}</span></td><td>${(l.min / g).toFixed(1)}</td><td class="hi">${(l.pts / g).toFixed(1)}</td><td>${((l.orb + l.drb) / g).toFixed(1)}</td><td>${(l.ast / g).toFixed(1)}</td><td>${(l.stl/g).toFixed(1)}</td><td>${(l.blk/g).toFixed(1)}</td><td>${(l.tpa/g).toFixed(1)}</td><td>${l.fga+.44*l.fta ? (100*l.pts/(2*(l.fga+.44*l.fta))).toFixed(1) : '-'}</td></tr>`; }).join('');
    const k = Math.round(r.w / r.games * 10);
    const share = `${r.games}-0 Challenge${st.daily ? ` · Daily ${st.date}` : ''} · ${yrLabel(st.playSeason)}\n${r.w}-${r.l} · ${tier}\n${'🟩'.repeat(k)}${'🟥'.repeat(10 - k)}\n${STARTERS.map(s => `${s} ${HL.HISTORY.players[st.lineup[s].row.pid][0]}`).join(' · ')}`;
    return `<div class="stack" style="gap:14px">${HL.GFX.championPoster(posterTeam, r.players.slice(0, 5), '', { wide: true, kicker: `${r.games}-0 Challenge · ${yrLabel(st.playSeason)} · ${r.w}-${r.l}`, sub: tier })}
      <section class="block"><div class="body row wrap" style="gap:24px">
        <div><div class="caps">Final record</div><div class="num" style="font-size:64px;line-height:1">${r.w}-${r.l}</div></div>
        <div class="grow"><h2 style="font-size:28px">${tier}</h2><div class="t2" style="margin-top:6px">${esc(line)}</div>
          <div class="t3 sm" style="margin-top:8px">${r.pf.toFixed(1)} PPG · ${r.pa.toFixed(1)} allowed · longest win streak ${r.best}${r.firstLoss ? ` · first loss: game ${r.firstLoss.g} vs the ${esc(r.firstLoss.opp.name)}` : ''}</div></div>
        <div class="stack" style="gap:8px"><button class="btn spin" data-new>Play again</button><button class="btn" data-share>Copy result</button></div>
      </div></section>
      ${r.specialDraft?`<section class="block"><header><h3>Legendary roster discovered</h3></header><div class="body"><p>✦ ${esc(r.specialDraft)} supplied one of your drafted players. No extra draft slot was awarded.</p></div></section>`:''}
      ${HL.DNA.board(st.dna)}
      ${identityReport(r)}
      <section class="block"><header><h3>Postseason: The second challenge</h3></header><div class="body stack"><p>Now take your drafted superteam through four best-of-seven playoff series, one game at a time. Close finishes can become interactive clutch possessions. The regular-season 82–0 record stays separate.</p><button class="btn go" data-start-playoffs>Start the playoffs</button>${st.playoffs?.completed?`<p>${st.playoffs.champion?'NBA CHAMPIONS':'Playoff run ended'} · ${st.playoffs.history.length} games played.</p>`:''}</div></section>
      <section class="block"><header><h3>Achievements</h3></header><div class="body"><div class="achv">${r.unlocked.map(a => `<span class="${a.got || a.had ? '' : 'locked'}">${a.fresh ? 'NEW · ' : ''}${esc(a.name)}</span>`).join('')}</div></div></section>
      <section class="block"><header><h3>Season scouting report</h3></header><div class="body stack">
        <div class="cols c2"><div><div class="kv"><span>Net points / game</span><b>${(r.pf-r.pa).toFixed(1)}</b></div><div class="kv"><span>Season efficiency (TS%)</span><b>${(() => {const a=Object.values(r.lines).reduce((t,b)=>({pts:t.pts+b.pts,fga:t.fga+b.fga,fta:t.fta+b.fta}),{pts:0,fga:0,fta:0});return a.fga+.44*a.fta ? (100*a.pts/(2*(a.fga+.44*a.fta))).toFixed(1)+'%' : '—';})()}</b></div></div><div><div class="kv"><span>Era environment</span><b>${yrLabel(st.playSeason)}</b></div><div class="kv"><span>Schedule</span><b>${r.games} games · ${r.w} wins</b></div></div></div>
        <details><summary>Rule differences in this era</summary><p class="t2 sm">${HL.eraContext(st.playSeason).facts.map(esc).join(' · ')}</p></details>
        <details><summary>Every game result (${r.gameLog.length})</summary><div class="scouting-games">${r.gameLog.map(g=>`<div class="kv"><span>#${g.g} · ${esc(g.opp)} ${g.home?'HOME':'AWAY'}</span><b class="${g.win?'win':'loss'}">${g.win?'W':'L'} ${g.for}-${g.against}</b></div>`).join('')}</div></details>
        <div class="t3 sm">All eight players keep their recorded historical shot preferences and a separate skill profile. Skill differences interact through defense, size, pace, team context and era rules.</div>
      </div></section>
      <section class="block"><header><h3>Season stats</h3></header><div class="body flush"><div class="tbl-wrap"><table class="tbl"><thead><tr><th class="l">Player</th><th>MIN</th><th>PTS</th><th>REB</th><th>AST</th><th>STL</th><th>BLK</th><th>3PA</th><th>TS%</th></tr></thead><tbody>${rows}</tbody></table></div></div></section>
      <textarea hidden data-share-text>${esc(share)}</textarea></div>`;
  }

  // ---------- drag & drop (pointer events: mouse and touch), with tap-to-place ----------
  let picked = null;
  function bindDrag(app) {
    const drop = (src, slot) => {
      if (src.hand != null) place(src.hand, slot);
      else if (src.from && src.from !== slot) swap(src.from, slot);
    };
    app.querySelectorAll('.hand .gcard, .gcard.placed').forEach(card => {
      card.onpointerdown = (e) => {
        if (['season', 'result', 'playoffs'].includes(st.phase) || card.classList.contains('down')) return;
        e.preventDefault();
        const src = card.dataset.hand != null ? { hand: +card.dataset.hand } : { from: card.dataset.from };
        const start = { x: e.clientX, y: e.clientY };
        let ghost = null, hot = null;
        const move = (ev) => {
          if (!ghost && Math.hypot(ev.clientX - start.x, ev.clientY - start.y) > 6) {
            ghost = card.cloneNode(true); ghost.classList.add('ghost'); ghost.classList.remove('picked');
            ghost.style.width = card.getBoundingClientRect().width + 'px';
            document.body.appendChild(ghost); card.classList.add('dragging');
          }
          if (!ghost) return;
          ghost.style.left = (ev.clientX - ghost.offsetWidth / 2) + 'px'; ghost.style.top = (ev.clientY - ghost.offsetHeight / 2) + 'px';
          const el = document.elementFromPoint(ev.clientX, ev.clientY);
          const spot = el && el.closest('.slot-wrap');
          const target = spot && (spot.querySelector('.slot') || spot.querySelector('.gcard'));
          if (hot && hot !== target) hot.classList.remove('hot');
          hot = target; if (hot) hot.classList.add('hot');
        };
        const up = (ev) => {
          document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up);
          card.classList.remove('dragging');
          if (hot) hot.classList.remove('hot');
          if (ghost) {
            ghost.remove();
            const el = document.elementFromPoint(ev.clientX, ev.clientY);
            const spot = el && el.closest('.slot-wrap');
            if (spot) drop(src, spot.dataset.slot);
            return;
          }
          // A tap: select it (or, with a placed card already selected, swap the two spots).
          if (picked && picked.from && src.from && picked.from !== src.from) { const p = picked; picked = null; drop(p, src.from); return; }
          app.querySelectorAll('.gcard.picked').forEach(x => x.classList.remove('picked'));
          picked = src; card.classList.add('picked');
        };
        document.addEventListener('pointermove', move); document.addEventListener('pointerup', up);
      };
    });
    app.querySelectorAll('[data-drop]').forEach(s => s.onclick = () => { if (picked) { const p = picked; picked = null; drop(p, s.dataset.drop); } });
  }

  function bind() {
    const app = U.app();
    picked = null;
    const abandon=()=>{st?.cancelSeason?.();HL.DNAFX?.reset();document.querySelectorAll('.fx-banner').forEach(e=>e.click());st=null;};
    app.querySelector('[data-home]').onclick = () => {abandon();HL.App.title();};
    app.querySelectorAll('[data-new]').forEach(b => b.onclick = () => {abandon();render();});
    FX.bindSound(app);
    const sp = app.querySelector('[data-spin]'); if (sp) sp.onclick = () => { if (st.phase === 'spin') spin(); };
    app.querySelectorAll('[data-skip]').forEach(b => b.onclick = () => { const k = b.dataset.skip; if (!st.skips[k] || st.phase !== 'hand') return; st.skips[k]--; st.usedSkips++; spin(k); });
    app.querySelectorAll('[data-gameplan]').forEach(b=>b.onclick=()=>{st.plan=b.dataset.gameplan;render();});
    const pl = app.querySelector('[data-play]'); if (pl) pl.onclick = () => playSeason();
    app.querySelectorAll('[data-start-playoffs]').forEach(b=>b.onclick=()=>{startPlayoffs();render();});
    app.querySelectorAll('[data-finish-playoffs]').forEach(b=>b.onclick=()=>{st.phase='result';render();});
    app.querySelectorAll('[data-playoff-game]').forEach(b=>b.onclick=()=>playPlayoffGame());
    app.querySelectorAll('[data-final-possession]').forEach(b=>b.onclick=()=>resolvePlayoffClutch(b.dataset.finalPossession));
    const sh = app.querySelector('[data-share]');
    if (sh) sh.onclick = async () => { const t = app.querySelector('[data-share-text]').value; try { await navigator.clipboard.writeText(t); U.toast('Result copied. Paste it anywhere.'); } catch (e) { U.toast('Copy failed. Here it is:<br>' + esc(t).replace(/\n/g, '<br>')); } };
    bindDrag(app);
    FX.tilt(app);
  }

  function setupScreen() {
    U.applyTeamTheme(null);
    U.setEra('modern');
    const all = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];
    const cfg = { mode: 'classic', decades: all.slice(), playSeason: HL.LATEST_SEASON, daily: false };
    const years = [];
    for (let y = HL.LATEST_SEASON; y >= 1946; y--) years.push(y);
    const dailyDone = bestRuns().find(r => r.daily === today());
    const draw = () => {
      U.app().innerHTML = `<div class="frame challenge-frame"><div class="masthead"><div class="bar"><div class="wordmark" data-home>Hoops<i>Life</i></div><div class="mainnav"><button class="on">82-0 Challenge</button></div><div class="simbar">${FX.soundToggle()}</div></div></div>
      <div class="page" style="max-width:980px">
        <section class="machine" style="text-align:center"><div class="lights">${'<i></i>'.repeat(14)}</div>
          <div class="fxb-kicker" style="margin-top:14px">Spin · Draft · Go undefeated</div>
          <h1 style="font-size:clamp(44px,8vw,86px);line-height:.9;margin:8px 0">82-0 Challenge</h1>
          <p class="t2" style="max-width:60ch;margin:0 auto">Spin a franchise and a decade, get dealt five real players from that club, and drag one onto the court. Anyone can play any spot, but out of position he loses rating. Eight picks: five starters and three backups. Then watch the season play out live.</p>
          <div class="row wrap" style="justify-content:center;gap:12px;margin-top:20px">
            <button class="btn spin" data-go>Play</button>
            <button class="btn spin daily" data-daily>Daily challenge</button>
          </div>
          <div class="t3 sm" style="margin-top:10px">${dailyDone ? `Today's daily: you went ${dailyDone.w}-${dailyDone.l}. Same spins for everyone, every day.` : 'Daily: the same spins and hands for everyone today, in the 2025-26 league.'}</div>
        </section>
        <section class="block"><header><h3>Options</h3></header><div class="body stack">
          <div class="setting" style="flex-wrap:wrap"><div class="grow"><b>Mode</b><div class="d">HoopIQ hides ratings and stats, so you draft from memory.</div></div>${U.seg('mode', [['classic', 'Classic'], ['hoopiq', 'HoopIQ']], cfg.mode)}</div>
          <div class="setting" style="flex-wrap:wrap"><div class="grow"><b>Play the season in</b><div class="d">Your team joins that year's real league: its teams, rules (no three-point line before 1979-80), schedule length and era look.</div></div>
            <select data-play-season>${years.map(y => `<option value="${y}" ${y === cfg.playSeason ? 'selected' : ''}>${yrLabel(y)}${y === HL.LATEST_SEASON ? ' (today)' : ''}</option>`).join('')}</select></div>
          <div class="setting" style="flex-wrap:wrap"><div class="grow"><b>Decades in the spin</b><div class="d">Each pick uses a different decade while possible. Tick one decade for an all-'90s team.</div></div>
            <div class="row wrap">${all.map(d => `<label class="row sm" style="gap:4px"><input type="checkbox" data-dec="${d}" ${cfg.decades.includes(d) ? 'checked' : ''}> ${d}s</label>`).join('')}</div></div>
        </div></section>
      </div></div>`;
      const app = U.app();
      app.querySelector('[data-home]').onclick = () => HL.App.title();
      FX.bindSound(app);
      app.querySelectorAll('[data-seg] button').forEach(b => b.onclick = () => { cfg.mode = b.dataset.v; draw(); });
      app.querySelectorAll('[data-dec]').forEach(cb => cb.onchange = () => { const d = +cb.dataset.dec; cfg.decades = cb.checked ? [...cfg.decades, d] : cfg.decades.filter(x => x !== d); });
      const ps = app.querySelector('[data-play-season]');
      ps.onchange = () => { cfg.playSeason = +ps.value; U.setEra(HL.eraForSeason(cfg.playSeason)); };
      app.querySelector('[data-go]').onclick = () => { if (cfg.decades.length < 1) return U.toast('Pick at least one decade.'); newRun({ ...cfg, decades: cfg.decades.slice().sort() }); render(); };
      app.querySelector('[data-daily]').onclick = () => { newRun({ ...cfg, daily: true }); render(); };
    };
    draw();
  }

  return { open: () => { st = null; render(); }, LINEAGE, candidates, dealHand, skillCandidates, skillValue, dealSkillHand, fittedAttributes, effRating, rating, franchisesIn, loadDecade, posOk, penalty, naturals, createPlayoffSession };
})();
