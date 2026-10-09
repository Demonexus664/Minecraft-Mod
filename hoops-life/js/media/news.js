// Situational news + reactions generated from league events.
// Every line has a situation key (see packs/CHATGPT_PROMPT.md) so content packs can add to it.
// Placeholders: {name} from the context, {~pool} draws a fresh fragment (see engine.js).
window.HL = window.HL || {};

HL.News = (function () {
  const R = HL.RNG;
  const M = HL.Media;
  const T = (L, id) => L.teams[id];
  const last = p => p.name.split(' ').slice(1).join(' ') || p.name;
  const poss = n => n.endsWith('s') ? n + "'" : n + "'s";
  const injName = n => n.split(' ').map(w => /^[A-Z]{2,}$/.test(w) ? w : w.toLowerCase()).join(' ');
  // "an MCL sprain", "an ACL tear", "a hamstring strain"
  const aan = w => ((/^[aeiou]/i.test(w) || /^[AEFHILMNORSX][A-Z]/.test(w)) ? 'an ' : 'a ') + w;
  const ord = n => n + (['th', 'st', 'nd', 'rd'][(n % 100 - 20) % 10] || ['th', 'st', 'nd', 'rd'][n % 100] || 'th');
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

  // ---------- era voices ----------
  HL.mediaEra = (L) => (L.settings && L.settings.eraTheme && L.settings.eraTheme !== 'auto') ? L.settings.eraTheme : HL.eraForSeason(L.season);
  // Role -> voice per era. Old eras have columnists, radio and letters instead of social media.
  const ROLE_VOICE = {
    modern: { hype: 'debate', stats: 'stats', insider: 'insider', beat: 'beat', oldhead: 'oldhead', meme: 'memes', homer: 'homer', hater: 'hater', odds: 'odds' },
    '00s': { hype: 'tvshow', stats: 'blogstats', insider: 'insider', beat: 'beat', oldhead: 'oldhead', meme: 'forum', homer: 'forum', hater: 'forum', odds: 'odds' },
    '90s': { hype: 'tvshow', stats: 'column', insider: 'wire', beat: 'beat', oldhead: 'oldtimer', meme: 'callin', homer: 'callin', hater: 'callin', odds: 'odds' },
    '80s': { hype: 'column', stats: 'column', insider: 'wire', beat: 'beat', oldhead: 'oldtimer', meme: 'callin', homer: 'radio', hater: 'letter', odds: 'column' },
    '70s': { hype: 'column', stats: 'column', insider: 'wire', beat: 'beat', oldhead: 'oldtimer', meme: 'letter', homer: 'radio', hater: 'letter', odds: 'column' },
    '60s': { hype: 'column', stats: 'column', insider: 'wire', beat: 'beat', oldhead: 'oldtimer', meme: 'letter', homer: 'radio', hater: 'letter', odds: 'column' },
  };
  Object.assign(M.VOICES, {
    tvshow: { outlet: 'Primetime Hoops', handle: 'TV', kind: 'tv', format: 'broadcast' },
    blogstats: { outlet: 'The Numbers Blog', handle: 'blog', kind: 'blog', format: 'forum' },
    forum: { outlet: 'Hoops Message Board', handle: 'thread', kind: 'forum', format: 'forum' },
    callin: { outlet: 'Sports Talk 1050', handle: 'caller', kind: 'radio call-in', format: 'broadcast' },
    column: { outlet: 'The Evening Herald', handle: 'Sports Desk', kind: 'column', format: 'print' },
    wire: { outlet: 'Associated Wire', handle: 'AW', kind: 'wire', format: 'print' },
    radio: { outlet: '{city} Radio', handle: 'play-by-play', kind: 'radio', format: 'broadcast' },
    letter: { outlet: 'Letters to the Editor', handle: 'reader', kind: 'letter', format: 'print' },
    oldtimer: { outlet: 'Radio color man, former player', handle: '', kind: 'radio', format: 'broadcast' },
  });

  function push(L, item) {
    L.news = L.news || [];
    item.id = (L.newsSeq = (L.newsSeq || 0) + 1);
    item.season = L.season; item.day = L.day; item.phase = L.phase;
    item.era = HL.mediaEra(L);
    L.news.push(item);
    if (L.news.length > 600) L.news.splice(0, L.news.length - 600);
    return item;
  }

  // A reaction from a role ("hype", "stats", "homer"...), voiced for the era.
  function react(L, role, situation, ctx, builtins, team, extra = {}) {
    const era = HL.mediaEra(L);
    const text = M.line(L, situation, { ...ctx, era, eraBuiltins: extra.eraBuiltins }, builtins);
    if (!text) return null;
    const vkey = (ROLE_VOICE[era] || ROLE_VOICE.modern)[role] || role;
    const v = M.voiceInfo(vkey, team);
    const isSocial = !v.format;
    return {
      voice: v, text, format: v.format || 'social',
      likes: isSocial ? Math.round(Math.pow(R.random(), 2) * 50000 * (extra.hype || 1)) + R.int(10, 400) : 0,
      reposts: isSocial ? Math.round(Math.pow(R.random(), 2.5) * 8000 * (extra.hype || 1)) : 0,
    };
  }
  // A fixed text from a specific voice (used by other modules).
  function social(L, voiceKey, text, team, extra = {}) {
    const v = M.voiceInfo(voiceKey, team);
    return { voice: v, text, format: v.format || 'social', likes: Math.round(Math.pow(R.random(), 2) * 50000 * (extra.hype || 1)) + R.int(10, 400), reposts: Math.round(Math.pow(R.random(), 2.5) * 8000 * (extra.hype || 1)) };
  }
  const headline = (L, situation, ctx, builtins, eraBuiltins) => M.line(L, situation, { ...ctx, era: HL.mediaEra(L), eraBuiltins }, builtins);

  // ---------- best performer in a box ----------
  function topLine(L, side) {
    let best = null;
    for (const id in side.box) {
      const l = side.box[id];
      const gs = l.pts + 0.4 * l.fgm - 0.7 * l.fga - 0.4 * (l.fta - l.ftm) + 0.7 * l.orb + 0.3 * l.drb + l.stl + 0.7 * l.ast + 0.7 * l.blk - 0.4 * l.pf - l.tov;
      if (!best || gs > best.gs) best = { p: L.players[id], l, gs };
    }
    return best;
  }
  const statStr = l => {
    const reb = l.orb + l.drb;
    const parts = [`${l.pts} points`];
    if (reb >= 8) parts.push(`${reb} rebounds`);
    if (l.ast >= 7) parts.push(`${l.ast} assists`);
    if (l.blk >= 4) parts.push(`${l.blk} blocks`);
    if (l.stl >= 4) parts.push(`${l.stl} steals`);
    return parts.length > 1 ? parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1] : parts[0];
  };
  const isTripleDouble = l => [l.pts, l.orb + l.drb, l.ast, l.stl, l.blk].filter(v => v >= 10).length >= 3;

  // ---------- GAME ----------
  const GAME_B = {
    'game.star50.win': ['{pts}! {player} has a {~big} {~night} as the {team} {~beat} the {opp}', 'Fifty-plus: {player} goes for {pts} as the {team} {~beat} the {opp}', '{player} explodes for {pts} in a {team} win'],
    'game.star50.loss': ['{pts} not enough: {pposs} {~big} {~night} wasted as the {winner} win', '{player} scores {pts}, but the {winner} still {~beat} the {loser}'],
    'game.tripledouble.win': ['Triple-double: {player} posts {line} in a {team} win', '{player} fills the box score ({line}) as the {team} {~beat} the {opp}'],
    'game.tripledouble.loss': ['{pposs} triple-double ({line}) not enough against the {winner}', '{player} posts {line}, but the {opp} win {ws}-{ls}'],
    'game.star40.win': ['{player} scores {pts} as the {team} {~beat} the {opp}', '{pposs} {pts} {~carry} the {team} past the {opp}, {ws}-{ls}', '{pts} from {plast} lifts the {team} over the {opp}'],
    'game.star40.loss': ['{pposs} {pts} not enough as the {winner} {~beat} the {loser}', '{player} scores {pts}, but the {team} still fall to the {opp}'],
    'game.overtime': ['{Ots} {~thriller}: {winner} {~edge} {loser} {ws}-{ls}', '{winner} survive {ots} against the {loser}, {ws}-{ls}', 'Bonus basketball: {winner} outlast {loser} in {ots}'],
    'game.blowout': ['{winner} {~crush} {loser} by {margin}', '{margin}-point {~beatdown}: {wabbr} {ws}, {labbr} {ls}', 'No contest: {winner} {~crush} {loser} {ws}-{ls}'],
    'game.streak.win': ['{winner} stay {~streak_w}: {wstreak} straight after beating the {loser}', 'Make it {wstreak} in a row for the {winner}', '{winner} stretch their win streak to {wstreak}'],
    'game.streak.loss': ['{loser} {~streak_l}: {lstreak} straight losses after falling to the {winner}', 'The skid reaches {lstreak} for the {loser}', '{lstreak} and counting: {loser} drop another, this time to the {winner}'],
    'game.upset': ['Upset: the {wrec} {winner} {~beat} the {lrec} {loser}', 'The {winner} ({wrec}) stun the {loser} ({lrec})'],
    'game.close': ['{winner} {~edge} {loser} {ws}-{ls} in a {~tight}', '{winner} hang on against the {loser}, {ws}-{ls}'],
    'game.recap.starwin': ['{winner} {~beat} {loser} {ws}-{ls}; {plast} scores {pts}', '{pposs} {pts} {~carry} the {team} past the {opp}, {ws}-{ls}', '{winner} {~beat} the {loser} behind {pts} from {plast}'],
    'game.recap.starloss': ['{winner} {~beat} {loser} {ws}-{ls} despite {pposs} {pts}', '{winner} hold off {loser} {ws}-{ls}; {plast} scores {pts} in defeat'],
    'game.recap': ['{winner} {~beat} {loser} {ws}-{ls}'],
  };
  // Newspaper voice for the old eras.
  const GAME_OLD = {
    'game.star50.win': ['{player} Tallies {pts} as {winner} Best {loser}', 'Remarkable {pts}-Point Showing by {plast} Paces {winner}'],
    'game.star40.win': ['{plast} Scores {pts}; {winner} Turn Back {loser}, {ws}-{ls}', '{winner} Down {loser} Behind {pts} by {plast}'],
    'game.blowout': ['{winner} Rout {loser}, {ws}-{ls}', '{winner} Romp Past Hapless {loser}'],
    'game.overtime': ['{winner} Outlast {loser} in Extra Session, {ws}-{ls}', 'Thriller Goes to Overtime; {winner} Prevail'],
    'game.close': ['{winner} Edge {loser} in Thriller, {ws}-{ls}', '{winner} Nip {loser} at the Wire'],
    'game.recap.starwin': ['{winner} Top {loser}, {ws}-{ls}; {plast} Paces Attack With {pts}', '{winner} Best {loser} as {plast} Pours In {pts}'],
    'game.recap.starloss': ['{winner} Beat {loser}, {ws}-{ls}, Despite {pts} by {plast}'],
    'game.recap': ['{winner} Defeat {loser}, {ws}-{ls}'],
    'game.star50.loss': ['{plast} Pours In {pts}, but {winner} Prevail', 'Brilliant {pts} by {plast} Not Enough as {loser} Fall'],
    'game.star40.loss': ['{winner} Withstand {pts}-Point Barrage by {plast}', '{plast} Tallies {pts} in Losing Cause'],
    'game.tripledouble.win': ['{plast} Does It All as {winner} Win, {ws}-{ls}'],
    'game.tripledouble.loss': ['All-Around Effort by {plast} Falls Short Against {winner}'],
    'game.streak.win': ['{winner} Run Streak to {wstreak}', '{winner} Make It {wstreak} Straight'],
    'game.streak.loss': ['{loser} Drop {lstreak}th Straight', 'Slump Deepens: {loser} Lose Again'],
    'game.upset': ['Lowly {winner} Stun {loser}', '{winner} Pull Surprise Over {loser}'],
  };

  function game(L, g, res, playoffs) {
    if (playoffs) return;
    const hs = res.home.score, as = res.away.score;
    const homeWon = hs > as;
    const W = T(L, homeWon ? g.home : g.away), Lo = T(L, homeWon ? g.away : g.home);
    const hb = topLine(L, res.home), ab = topLine(L, res.away);
    const sr = (hb && ab) ? (hb.gs >= ab.gs ? { ...hb, home: true } : { ...ab, home: false }) : null;
    const star = sr ? { ...sr, t: T(L, sr.home ? g.home : g.away), opp: T(L, sr.home ? g.away : g.home), won: sr.home === homeWon } : null;
    const margin = Math.max(hs, as) - Math.min(hs, as);
    const upset = (W.w + W.l > 15) && (Lo.w / (Lo.w + Lo.l) - W.w / (W.w + W.l) > 0.3);
    const isUser = L.userTeamId != null && (g.home === L.userTeamId || g.away === L.userTeamId);
    const notable = isUser || margin >= 30 || res.ot >= 2 || (star && (star.l.pts >= 45 || (isTripleDouble(star.l) && star.l.pts >= 25))) || (upset && R.chance(0.3)) || W.streak === 10 || Lo.streak === -10;
    if (!notable) return;

    const c = {
      winner: W.name, loser: Lo.name, wcity: W.city, lcity: Lo.city, wabbr: W.abbr, labbr: Lo.abbr,
      ws: Math.max(hs, as), ls: Math.min(hs, as), margin, wrec: `${W.w}-${W.l}`, lrec: `${Lo.w}-${Lo.l}`,
      wstreak: W.streak, lstreak: -Lo.streak, arena: T(L, g.home).arena,
      ots: res.ot > 1 ? `${res.ot} overtimes` : 'overtime', Ots: res.ot > 1 ? `${res.ot} overtimes` : 'Overtime',
    };
    if (star) Object.assign(c, {
      player: star.p.name, plast: last(star.p), pposs: poss(star.p.name), team: star.t.name, opp: star.opp.name,
      pts: star.l.pts, reb: star.l.orb + star.l.drb, ast: star.l.ast, fgm: star.l.fgm, fga: star.l.fga, tov: star.l.tov, min: Math.round(star.l.min),
      line: statStr(star.l), ts: (star.l.pts / Math.max(1, 2 * (star.l.fga + 0.44 * star.l.fta)) * 100).toFixed(1),
    });

    // Story angle, most newsworthy first.
    let sit;
    if (star && star.l.pts >= 50) sit = star.won ? 'game.star50.win' : 'game.star50.loss';
    else if (star && isTripleDouble(star.l) && star.l.pts >= 20) sit = star.won ? 'game.tripledouble.win' : 'game.tripledouble.loss';
    else if (star && star.l.pts >= 40) sit = star.won ? 'game.star40.win' : 'game.star40.loss';
    else if (res.ot) sit = 'game.overtime';
    else if (margin >= 25) sit = 'game.blowout';
    else if (W.streak >= 6) sit = 'game.streak.win';
    else if (Lo.streak <= -6) sit = 'game.streak.loss';
    else if (upset) sit = 'game.upset';
    else if (margin <= 3) sit = 'game.close';
    else sit = star ? (star.won ? 'game.recap.starwin' : 'game.recap.starloss') : 'game.recap';
    const hl = headline(L, sit, c, GAME_B[sit] || GAME_B['game.recap'], GAME_OLD[sit] || GAME_OLD['game.recap']) || headline(L, 'game.recap', c, GAME_B['game.recap'], GAME_OLD['game.recap']);

    const rx = [];
    if (star && star.l.pts >= 35) {
      rx.push(react(L, 'hype', 'game.react.star_hype', c, ['{~opener} {player} {~hype}. {pts} on {fgm}-of-{fga}. {~emoji_hype}', '{player} {~hype}. {pts} tonight and it looked easy.'], star.t, { hype: 2, eraBuiltins: ['{player} was simply magnificent, collecting {pts} points with a shooting touch that bordered on the uncanny.'] }));
      rx.push(react(L, 'stats', 'game.react.star_stats', c, ['{~stat_open} {player} scored {pts} on {ts}% true shooting with {tov} turnovers in {min} minutes.'], star.t, { eraBuiltins: ['The figures tell the tale: {pts} points for {plast}, on {fgm} field goals from {fga} attempts.'] }));
      if (star.l.fga >= 30 && star.l.pts / star.l.fga < 1.1) rx.push(react(L, 'hater', 'game.react.volume_hater', c, ['{fga} shots for {pts}? Volume merchant behavior {~emoji_sad}', 'Took {fga} shots to get {pts}. Somebody count the passes.'], star.t, { eraBuiltins: ['Sir: {fga} shots for {pts} points is no feat. Pass the ball, young man.'] }));
    }
    if (margin >= 25) {
      rx.push(react(L, 'meme', 'game.react.blowout_loser_meme', c, ['{loser} fans after the first quarter: "it\'s a long game" {~emoji_sad}', 'The {loser} lost by {margin}. The flight home is going to be quiet.'], Lo, { eraBuiltins: ['To the editor: I have followed the {loser} for twenty years and have never seen a sorrier display.'] }));
      rx.push(react(L, 'oldhead', 'game.react.blowout_oldhead', c, ['{~old_open}, losing by {margin} meant extra practice and no plane snacks. The {loser} need to look in the mirror.'], Lo));
    }
    if (Lo.streak <= -5) rx.push(react(L, 'beat', 'game.react.losing_streak_beat', c, ['Postgame in {lcity}: {~team_mood_bad}. That is {lstreak} straight.'], Lo));
    if (W.streak >= 5) rx.push(react(L, 'homer', 'game.react.win_streak_fan', c, ['{wstreak} STRAIGHT. {~team_mood_good} {~emoji_hype}', '{wstreak} in a row. Book the parade route.'], W, { hype: 1.4, eraBuiltins: ['...and that is {wstreak} in a row for your {winner}, folks! What a time to be a fan in {wcity}!'] }));
    if (res.ot) rx.push(react(L, 'meme', 'game.react.ot_meme', c, ['My heart cannot take {ots} on a {~weeknight} {~emoji_sad}'], W));
    push(L, { type: 'game', gid: g.gid, headline: hl, teamIds: [g.home, g.away], playerIds: star ? [star.p.id] : [], importance: isUser ? 2 : 1, reactions: rx.filter(Boolean) });
  }

  // ---------- INJURY ----------
  function injury(L, p, inj) {
    const t = T(L, p.teamId);
    const weeks = Math.max(1, Math.round(inj.games / 3.5));
    const c = { player: p.name, plast: last(p), team: t.name, tposs: poss(t.name), pos: p.pos, injury: injName(inj.name), ainjury: aan(injName(inj.name)), games: inj.games, weeks, weekstr: weeks === 1 ? '1 week' : `${weeks} weeks` };
    const sit = inj.games >= 50 ? 'injury.long' : p.ovr >= 85 ? 'injury.star' : 'injury.headline';
    const B = {
      'injury.headline': ['{player} ({injury}) expected to miss {weekstr}', '{~injury_sad} {tposs} {player} sidelined with {ainjury}', '{team} without {player} for {weekstr} ({injury})'],
      'injury.star': ['Major blow for the {team}: {player} out with {ainjury}', '{~injury_sad} {player} sidelined {weekstr} with {ainjury}', '{team} lose {player} to {ainjury}'],
      'injury.long': ['{player} suffers {ainjury}; out for months', '{tposs} {player} faces long road back from {ainjury}', 'Season in doubt for {player} after {ainjury}'],
    };
    const OLD = { 'injury.headline': ['{player} Hurt; Will Miss {weekstr}', '{team} Star {plast} Out With {injury}'], 'injury.star': ['{plast} Injured; {team} Hopes Dim'], 'injury.long': ['{plast} Lost for Season With {injury}'] };
    const rx = [react(L, 'insider', 'injury.react.insider', c, ['{~sources} {team} {pos} {player} has been diagnosed with {ainjury} and will be re-evaluated in {weekstr}.'], t, { hype: p.ovr >= 85 ? 3 : 1, eraBuiltins: ['{team} physicians announced that {player} has sustained {ainjury} and will be out of action for an estimated {weekstr}.'] })];
    if (p.ovr >= 85) rx.push(react(L, 'odds', 'injury.react.odds', c, ['{team} title odds lengthen after the {plast} news.'], t));
    if (inj.games >= 50) rx.push(react(L, 'homer', 'injury.react.fan', c, ['Praying for {plast}. Come back stronger.'], t));
    push(L, { type: 'injury', headline: headline(L, sit, c, B[sit], OLD[sit]), teamIds: [t.id], playerIds: [p.id], importance: p.ovr >= 85 ? 2 : 1, reactions: rx.filter(Boolean) });
  }

  function hardship(L, t, p) {
    const healthy = HL.League.teamPlayers(t.id).filter(x => !x.injury || x.injury.games <= 0).length - 1;
    const c = { team: t.name, player: p.name, healthy };
    push(L, { type: 'transaction', importance: 1, teamIds: [t.id], playerIds: [p.id],
      headline: headline(L, 'transaction.hardship', c, ['{team} sign {player} via hardship exception', 'Injury-ravaged {team} add {player} on a hardship deal', 'Short-handed {team} turn to {player}'], ['{team} Sign {player} to Bolster Depleted Roster']),
      reactions: [react(L, 'beat', 'transaction.hardship.beat', c, ['The {team} had {healthy} healthy bodies at shootaround. Next man up.', '{healthy} healthy players. The training room is fuller than the locker room.'], t)].filter(Boolean) });
  }

  // ---------- AWARDS / PHASES ----------
  function awards(L, a) {
    const pn = id => L.players[id];
    const mvp = pn(a.mvp);
    if (mvp) {
      const s = HL.League.perGame(mvp, L.season);
      const n = mvp.careerAwards.filter(x => x.award === 'MVP').length;
      const t = T(L, mvp.teamId ?? mvp.stats[String(L.season)].teamId);
      const c = { player: mvp.name, plast: last(mvp), team: t.name, nth: ord(n), season: `${L.season}-${String(L.season + 1).slice(2)}`, pts: s.pts.toFixed(1), reb: s.reb.toFixed(1), ast: s.ast.toFixed(1), rec: `${t.w}-${t.l}` };
      const runner = a.mvpRace[1] != null ? pn(a.mvpRace[1]) : null;
      if (runner) Object.assign(c, { runnerup: runner.name, rlast: last(runner) });
      push(L, {
        type: 'award', importance: 3, playerIds: [mvp.id], teamIds: [t.id],
        headline: headline(L, n > 1 ? 'award.mvp.repeat' : 'award.mvp', c, n > 1 ? ['{player} wins {nth} MVP', 'MVP No. {n}: {player} does it again'.replace('{n}', n)] : ['{player} is your {season} MVP', '{player} wins MVP after a {rec} season for the {team}'], ['{player} Named Most Valuable Player']),
        body: `${c.pts} PPG, ${c.reb} RPG, ${c.ast} APG for the ${c.rec} ${t.name}.`,
        reactions: [
          react(L, 'hype', 'award.mvp.react', c, ['{~opener} the right man won. {player} {~hype}.'], t, { hype: 2 }),
          runner ? react(L, 'hater', 'award.mvp.snub', c, ['{runnerup} got robbed. Voters are a joke {~emoji_sad}', 'Put some respect on {rlast}. Robbery.'], T(L, runner.teamId ?? t.id)) : null,
        ].filter(Boolean),
      });
    }
    const award = (id, key, label) => {
      if (id == null) return;
      const p = pn(id);
      push(L, { type: 'award', importance: 2, playerIds: [id], teamIds: p.teamId != null ? [p.teamId] : [], headline: headline(L, key, { player: p.name, plast: last(p), label }, ['{player} named {label}', '{player} wins {label}'], ['{player} Named {label}']) });
    };
    award(a.dpoy, 'award.dpoy', 'Defensive Player of the Year');
    award(a.roy, 'award.roy', 'Rookie of the Year');
    award(a.smoy, 'award.smoy', 'Sixth Man of the Year');
  }

  function phase(L, ph) {
    if (ph === 'playin') push(L, { type: 'phase', importance: 2, headline: headline(L, 'phase.regular_end', { east: HL.League.standings('East')[0].name, west: HL.League.standings('West')[0].name }, ['Regular season wraps up: the {east} and {west} earn top seeds']) });
    if (ph === 'playoffs') push(L, { type: 'phase', importance: 2, headline: headline(L, 'phase.playoffs_start', { year: L.season + 1 }, ['The play-in is done: the {year} Playoffs begin', 'Sixteen teams left: the {year} Playoffs are here']) });
  }

  function seriesEnd(L, s, roundNo) {
    if (s.conf === 'Finals') return;
    // Name the round by how far it is from the conference final.
    const fmt = L.playoffs && L.playoffs.format;
    const confRounds = fmt ? Math.ceil(Math.log2(Math.max(2, fmt.perConf))) : 3;
    const fromEnd = confRounds - roundNo;
    const confWord = L.season < 1970 ? 'Division' : 'Conference';
    roundNo = fromEnd <= 0 ? 3 : fromEnd === 1 ? 2 : 1;
    const W = T(L, s.winner), Lo = T(L, s.winner === s.hi ? s.lo : s.hi);
    const score = s.wins.slice().sort((a, b) => b - a).join('-');
    const roundName = ['First Round', `${confWord} Semifinals`, `${confWord} Finals`][roundNo - 1];
    const upset = s.winner === s.lo && s.hiSeed && s.loSeed - s.hiSeed >= 3;
    const c = { winner: W.name, loser: Lo.name, lposs: poss(Lo.name), score, round: roundName, next: roundNo === 3 ? 'the NBA Finals' : [`the ${confWord} Semifinals`, `the ${confWord} Finals`][roundNo - 1], wseed: s.winner === s.hi ? s.hiSeed : s.loSeed, lseed: s.winner === s.hi ? s.loSeed : s.hiSeed };
    const sit = score === '4-0' ? 'series.sweep' : score === '4-3' ? 'series.game7' : upset ? 'series.upset' : 'series.end';
    const B = {
      'series.sweep': ['Brooms out: {winner} sweep {loser}', '{winner} sweep {loser}, advance to {next}'],
      'series.game7': ['{winner} survive Game 7, {~eliminate} {loser}', 'Game 7 goes to the {winner}; {lposs} season is over'],
      'series.upset': ['{wseed}-seed {winner} {~shock} {lseed}-seed {loser}', 'Upset complete: the {winner} knock out the {loser} {score}'],
      'series.end': ['{winner} eliminate {loser} {score} in the {round}', '{winner} advance past {loser} ({score}); next up: {next}'],
    };
    push(L, { type: 'playoffs', importance: roundNo >= 3 ? 3 : 2, teamIds: [W.id, Lo.id], headline: headline(L, sit, c, B[sit], ['{winner} Eliminate {loser}, {score}']), reactions: [
      react(L, 'homer', 'series.react.winner_fan', c, ['{~emoji_hype} {winner} MOVING ON {~emoji_hype}', 'On to {next}. Let us go.'], W, { hype: 1.5, eraBuiltins: ['The {winner} are moving on, ladies and gentlemen, and this building is shaking!'] }),
      react(L, 'beat', 'series.react.loser_beat', c, ['{lposs} season is over. {~offseason_q}'], Lo),
    ].filter(Boolean) });
  }

  function champion(L, champId, finals) {
    const W = T(L, champId), Lo = T(L, finals.winner === finals.hi ? finals.lo : finals.hi);
    const titles = L.history.filter(h => h.champion === champId).length;
    const fmId = L.awards[L.season].fmvp;
    const fm = fmId != null ? L.players[fmId] : null;
    const c = { team: W.name, city: W.city, opp: Lo.name, oposs: poss(Lo.name), score: finals.wins.slice().sort((a, b) => b - a).join('-'), year: L.season + 1, n: titles };
    if (fm) Object.assign(c, { fmvp: fm.name, flast: last(fm) });
    push(L, {
      type: 'champion', importance: 4, teamIds: [W.id, Lo.id], playerIds: fm ? [fm.id] : [],
      headline: headline(L, titles > 1 ? 'champion.repeat' : 'champion', c, titles > 1 ? ['Title No. {n} in this league for the {team}', 'The {team} beat the {opp} for another championship'] : ['The {city} {team} are {year} NBA Champions', 'The {team} win the title, beating the {opp} {score}'], ['{team} Capture Championship!', '{city} Celebrates as {team} Win Crown']),
      body: fm ? `${fm.name} named Finals MVP.` : '',
      reactions: [
        react(L, 'homer', 'champion.react.fan', c, ['CHAMPIONS!!! {~emoji_hype}{~emoji_hype}{~emoji_hype}', 'WE ARE THE CHAMPIONS. {city} is partying all night.'], W, { hype: 4, eraBuiltins: ['The {team} are champions of the world! Pandemonium here, absolute pandemonium!'] }),
        fm ? react(L, 'hype', 'champion.react.fmvp', c, ['{~opener} {fmvp} just changed his legacy forever.', '{fmvp}. Finals MVP. Put some respect on that name.'], W, { hype: 3 }) : null,
        react(L, 'meme', 'champion.react.loser', c, ['{opp} fans logging off for the summer {~emoji_sad}'], Lo, { hype: 2 }),
      ].filter(Boolean),
    });
  }

  function retire(L, p) {
    const rings = p.careerAwards.filter(a => a.award === 'Champion').length;
    const mvps = p.careerAwards.filter(a => a.award === 'MVP').length;
    if (!p.real && p.ovr < 76 && !rings && !mvps) return;
    if (p.ovr < 68 && !rings && !mvps) return;
    const c = { player: p.name, plast: last(p), rings, mvps, age: p.age };
    const hl = rings || mvps
      ? `${p.name} announces retirement${rings ? ` after ${rings} championship${rings > 1 ? 's' : ''}` : ''}${mvps ? `${rings ? ' and' : ' after'} ${mvps} MVP${mvps > 1 ? 's' : ''}` : ''}`
      : headline(L, 'retire', c, ['{player} announces retirement at {age}', '{player} calls it a career'], ['{player} Announces Retirement']);
    push(L, { type: 'retire', importance: p.ovr >= 85 || mvps ? 3 : 1, playerIds: [p.id], headline: hl,
      reactions: [react(L, 'oldhead', 'retire.react', c, ['One of the good ones. Salute to {plast}.', 'They do not make them like {plast} anymore.', 'Enjoy retirement, {plast}. You earned it.'], null)].filter(Boolean) });
  }

  function seasonStart(L) {
    const favs = favorites(L).slice(0, 3).map(t => t.name);
    push(L, { type: 'phase', importance: 2,
      headline: headline(L, 'season.start', { season: `${L.season}-${String(L.season + 1).slice(2)}` }, ['The {season} season tips off', 'Opening night: the {season} season is here'], ['New Campaign Opens Tonight']),
      reactions: [react(L, 'odds', 'season.react.favorites', { f1: favs[0], f2: favs[1], f3: favs[2] }, ['Title favorites entering the season: {f1}, {f2}, {f3}.'], null)].filter(Boolean) });
  }

  function favorites(L) { return L.teams.slice().sort((a, b) => teamStrength(L, b.id) - teamStrength(L, a.id)); }
  function teamStrength(L, tid) {
    const ps = HL.League.teamPlayers(tid).filter(p => !p.injury || p.injury.games < 20).sort((a, b) => b.ovr - a.ovr).slice(0, 8);
    return ps.reduce((s, p, i) => s + p.ovr * [1.4, 1.3, 1.2, 1.1, 1, 0.7, 0.6, 0.5][i], 0);
  }

  return { hardship, game, injury, awards, phase, seriesEnd, champion, retire, seasonStart, teamStrength, favorites, social, react, push };
})();
