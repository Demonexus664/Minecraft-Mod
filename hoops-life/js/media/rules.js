// Media/player/owner/fan reactions to rulebook changes.
window.HL = window.HL || {};

HL.RuleReactions = (function () {
  const R = HL.RNG;
  const M = HL.Media;

  // For each rule: how controversial it is, and voice lines per direction.
  const RULES = {
    threePoint: {
      off: { heat: 4, hl: ['League eliminates the three-point line', 'The three-pointer is dead: league scraps the arc', 'No more threes: rulebook shock sends shooters scrambling'],
        lines: { debate: ['They just killed basketball as we know it and I am weirdly here for it.', 'Shooters woke up unemployed today.'], oldhead: ['FINALLY. Back to real basketball. Post it up!', 'Big men are back, baby.'], stats: ['Projected impact: league eFG% drops sharply, paint touches spike. Spacing is gone.'], hater: ['Imagine paying a max to a shooter last summer 💀'] } },
      on: { heat: 1, hl: ['The three-point line returns', 'League restores the arc after experiment'], lines: { memes: ['Shooters after hearing the news: 😮‍💨'], stats: ['Spacing is back. Expect 3PA rate to climb right back toward 40%.'] } },
    },
    fourPoint: {
      on: { heat: 3, hl: ['League adds a 4-point line', 'Four-pointers are now legal', 'Deep range now worth four: is this the future or a gimmick?'],
        lines: { debate: ['A FOUR point line?! I need everybody to understand what this does to the record books.'], stats: ['A 4-pointer only needs ~27% to match a 36% three. Expect volume to explode.'], oldhead: ['Clown basketball. What is next, a 5-point line from the parking lot?'], memes: ['Logo shooters seeing the 4-point line: 😈'] } },
      off: { heat: 1, hl: ['4-point line scrapped'], lines: { stats: ['The 4-point era ends. Records set during it will carry an asterisk in some people\'s eyes.'] } },
    },
    tackling: {
      on: { heat: 10, hl: ['League introduces full-contact defense', 'Full-contact defense draws player safety concerns', 'League relaxes contact restrictions starting tonight'],
        lines: { debate: ['I have been doing this for twenty years and I have never been more speechless.', 'Somebody is going to get hurt and it is on the league office.'], oldhead: ['Honestly? We were halfway there in the 90s.'], insider: ['Sources: the players\' union is exploring every legal option, including a work stoppage.'], memes: ['NBA 2026 trailer, but it is just linebackers in jerseys 🏈🏀'], odds: ['Injury props are now the most bet market on the board.'] } },
      off: { heat: 2, hl: ['Full-contact defense scrapped after league-wide backlash', 'League restores contact restrictions'], lines: { insider: ['Sources: union leadership calls the reversal "the bare minimum."'] } },
    },
    noFouls: {
      on: { heat: 8, hl: ['No fouls will be called, the league announces', 'Referees told to swallow their whistles. All of them'], lines: { debate: ['So we are just letting them fight now? Cool cool cool.'], oldhead: ['That is just pickup at the Y. I love it.'], stats: ['Free throws go to zero. Rim protection becomes everything.'] } },
      off: { heat: 2, hl: ['Fouls are back'], lines: { memes: ['Refs returning to work like 😤🦓'] } },
    },
    handCheck: {
      on: { heat: 3, hl: ['Hand-checking is back', 'League brings back 90s-style hand-checking'], lines: { oldhead: ['Now THAT is defense. Let them play!'], stats: ['Perimeter efficiency should drop. Expect mid-range volume to rise.'], debate: ['Guards today could not survive this. I said what I said.'] } },
      off: { heat: 1, hl: ['Hand-checking banned again'], lines: { stats: ['Freedom of movement restored. Guards rejoice.'] } },
    },
    quarterLen: { any: { heat: 3, hl: ['Quarters will now be {v} minutes long', 'League changes quarter length to {v} minutes'], lines: { stats: ['Per-game stats will shift with a {v}-minute quarter. Per-36 numbers are the fair comparison now.'], debate: ['{v}-minute quarters? Record books are about to get weird.'] } } },
    shotClock: { any: { heat: 2, hl: ['Shot clock set to {v} seconds', 'League experiments with a {v}-second shot clock'], lines: { stats: ['A {v}-second clock changes pace considerably.'] } } },
    foulOut: { any: { heat: 2, hl: ['New foul-out rule: {v} fouls', 'Personal foul limit changed to {v}'], lines: { oldhead: ['Let the big fellas play physical.'] } } },
    injuryMult: { any: { heat: 1, hl: ['League medical policy update'], lines: { stats: ['Health environment adjusted league-wide.'] } } },
    threeValue: { any: { heat: 5, hl: ['Three-pointers now worth {v} points', 'Shock change: the arc is now worth {v}'], lines: { debate: ['{v} points for a three? Every record from here is fake.'], stats: ['Changing the value of the three to {v} rewrites shot-selection math overnight.'] } } },
    otLen: { any: { heat: 1, hl: ['Overtime periods changed to {v} minutes'], lines: {} } },
    backcourtSeconds: { label: 'Backcourt time limit', player: 'We will have to adjust how we bring the ball up against pressure.', any: { heat: 2, hl: ['Backcourt time limit: {v}'], lines: { stats: ['Backcourt time limit: {v}. Shorter limits put more pressure on ball handlers.'] } } },
    offensiveThreeSeconds: { label: 'Offensive three seconds', player: 'Our bigs will have to time their cuts and post position around the lane rule.', any: { heat: 2, hl: ['Offensive three-second rule {v}'], lines: { stats: ['The offensive lane restriction is {v}. When enforced, staying in the paint can cost a possession.'] } } },
    defensiveThreeSeconds: { label: 'Defensive three seconds', player: 'This changes how long our rim protectors can wait in the paint.', any: { heat: 3, hl: ['Defensive three-second rule {v}'], lines: { stats: ['The defensive lane restriction is {v}. A violation gives the offense one free throw and the ball.'] } } },
    illegalDefense: { label: 'Illegal defense / zone ban', player: 'We will need to adjust our coverage to the new defensive restrictions.', any: { heat: 3, hl: ['Zone-defense ban {v}'], lines: { stats: ['The zone-defense ban is {v}. When active, teams must use man coverage.'] } } },
    shotClockReset: { label: 'Offensive-rebound clock reset', player: 'That changes how much time we have to organize a second-chance attack.', any: { heat: 2, hl: ['Offensive-rebound shot clock set to {v} seconds'], lines: { stats: ['Second chances get up to {v} seconds, capped by the full shot clock. A shorter reset forces quicker shots.'] } } },
    bonusFouls: { label: 'Team-foul bonus', player: 'We will have to watch our team fouls and choose our contact carefully.', any: { heat: 3, hl: ['Team-foul penalty: {v}'], lines: { stats: ['Team-foul penalty: {v}. Shooting fouls still award free throws when the team bonus is disabled.'] } } },
  };

  function react(L, key, val, old) {
    if (val === old) return null;
    const def = RULES[key];
    if (!def) return null;
    const d = def.any || (val ? def.on : def.off);
    if (!d) return null;
    const midSeason = L.phase !== 'offseason' && L.day > 0;
    const value = typeof val === 'boolean' ? (val ? 'enabled' : 'disabled')
      : key === 'backcourtSeconds' ? (val ? `${val} seconds` : 'disabled')
      : key === 'bonusFouls' ? (val ? `begins on team foul ${val} (${Math.min(val, 4)} in overtime)` : 'disabled') : val;
    const fill = s => s.replace(/\{v\}/g, value);
    const reactions = [];
    for (const [voice, lines] of Object.entries(d.lines)) {
      const line = M.pickFresh(L, 'rule-' + key + '-' + voice, lines);
      reactions.push(HL.News.social(L, voice, fill(line), null, { hype: d.heat / 2 }));
    }
    if (midSeason && d.heat >= 3) {
      reactions.push(HL.News.social(L, 'insider', `Sources: multiple owners are furious the rule was changed mid-season. "${R.pick(['You do not change the rules during the game', 'This is not how a professional league operates', 'We built our roster for the old rules'])}," one said.`, null, { hype: 2 }));
    }
    const candidates = Object.values(L.players || {}).filter(p => p.teamId != null && !p.retired)
      .sort((a, b) => b.ovr - a.ovr).slice(0, 12);
    const p = candidates.length ? R.pick(candidates) : null;
    const team = p && L.teams[p.teamId] || L.teams[0];
    if (p) reactions.push({ voice: { key: 'player', outlet: p.name, handle: '', kind: 'player' }, format: 'quote',
      text: def.player || `We have to adapt to the new ${def.label || key} rule.`, likes: 0, reposts: 0 });
    if (team) reactions.push({ voice: { key: 'owner', outlet: `${team.city} ${team.name} ownership`, handle: '', kind: 'owner' }, format: 'quote',
      text: midSeason ? 'We built this roster under the previous rules. The timing of this change matters to us.' : 'We will review what this means for our roster before the new season.', likes: 0, reposts: 0 });
    L.integrity = L.integrity || { suspicion: 0, log: [] };
    L.integrity.suspicion += d.heat * (midSeason ? 2 : 1);
    L.integrity.log.push({ season: L.season, day: L.day, what: `Rule change: ${key} → ${val}`, heat: d.heat });
    L.ruleHistory = L.ruleHistory || [];
    L.ruleHistory.push({ season: L.season, day: L.day, key, from: old, to: val });
    return HL.News.push(L, { type: 'rules', importance: d.heat >= 4 ? 3 : 2, headline: fill(M.pickFresh(L, 'rulehl-' + key, d.hl)), reactions,
      playerIds: p ? [p.id] : [], teamIds: team ? [team.id] : [], ruleChange: { key, from: old, to: val } });
  }
  return { react };
})();
