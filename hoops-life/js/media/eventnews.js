// Stories from logged events (js/league/events.js). Each situation key has built-in lines plus any
// content-pack lines; old eras get newspaper-style lines. Lines only use facts the event recorded.
window.HL = window.HL || {};

HL.EventNews = (function () {
  const M = HL.Media;
  const R = HL.RNG;
  const poss = n => n.endsWith('s') ? n + "'" : n + "'s";
  const last = n => n.split(' ').slice(1).join(' ') || n;
  const ord = n => n + (['th', 'st', 'nd', 'rd'][(n % 100 - 20) % 10] || ['th', 'st', 'nd', 'rd'][n % 100] || 'th');
  const periodName = (p) => p <= 4 ? `the ${ord(p)} quarter` : p === 5 ? 'overtime' : `the ${ord(p - 4)} overtime`;

  const LINES = {
    'game.buzzer_beater': [
      '{player} beats the buzzer to lift the {team} past the {opp}, {ws}-{ls}',
      'At the horn: {player} sinks the winner against the {opp}',
      '{pposs} {shot} at the buzzer stuns the {opp}',
      'Zero on the clock, ball in the net: {player} wins it for the {team}',
      '{player} walks it off. {team} {ws}, {opp} {ls}',
      'Buzzer-beater: {plast} sends the {opp} home stunned',
      'The {opp} led until the final shot. {player} took it',
      '{plast} at the horn. The {team} win {ws}-{ls}',
      'The {team} steal one in the final second as {plast} connects',
      '{player} ends it at the buzzer against the {opp}',
    ],
    'game.game_winner': [
      '{player} puts the {team} ahead {when}, and they hold on against the {opp}',
      '{pposs} go-ahead {shot} {when} lifts the {team} over the {opp}',
      'Clutch: {player} delivers the winner {when} against the {opp}',
      'The {team} edge the {opp} {ws}-{ls} on a late {plast} {shot}',
      '{plast} came through {when}. {team} {ws}, {opp} {ls}',
      '{player} hits the dagger {when} as the {team} survive the {opp}',
      'Late drama: {player} gives the {team} the lead for good {when}',
      '{pposs} {shot} {when} decides it against the {opp}',
    ],
    'game.comeback': [
      'The {winner} erase a {deficit}-point deficit to beat the {loser}, {ws}-{ls}',
      'Down {deficit}, the {winner} storm back past the {loser}',
      'From {deficit} down to a win: the {winner} rally to stun the {loser}',
      'The {loser} led by {deficit}. The {winner} won by {margin}',
      'The {winner} complete a {deficit}-point comeback against the {loser}',
      'Collapse: the {loser} blow a {deficit}-point lead to the {winner}',
      'A {deficit}-point hole was not enough to stop the {winner}',
      'Comeback complete: {winner} {ws}, {loser} {ls} after trailing by {deficit}',
    ],
    'record.single_game': [
      '{player} sets the league record with {value} {stat}, breaking {prevposs} mark of {prev}',
      'History: {player} posts {value} {stat}, a new single-game record',
      '{value} {stat}. {pposs} night breaks a record that stood since {prevyear}',
      'The record book changes: {player} has {value} {stat} against the {opp}',
      '{prevposs} {prev} is gone. {player} owns the record now: {value} {stat}',
      'A night for the history books: {player} goes for a record {value} {stat}',
      'New league record: {value} {stat} for {player} of the {team}',
    ],
    'record.single_game_tie': [
      '{player} ties the league record with {value} {stat}',
      '{value} {stat}: {player} matches {prevposs} single-game record',
      '{plast} draws level with {prevholder}: {value} {stat} in one night',
      'Record tied: {player} reaches {value} {stat} against the {opp}',
    ],
    'record.five_by_five': [
      '5x5: {player} fills every column against the {opp} ({line5})',
      '{player} records a five-by-five: {line5}',
      'Points, boards, assists, steals and blocks: {player} gets at least five of each against the {opp}',
      'Every category: {pposs} {line5} for the {team}',
    ],
    'record.quadruple_double': [
      '{player} records a quadruple-double: {line}',
      'Quadruple-double: {player} goes {line} against the {opp}',
      'Four categories in double figures for {player}: {line}',
      'The rarest line in the sport: {player} posts {line}',
    ],
    'record.perfect_high_volume': [
      '{player} goes a perfect {fgm}-for-{fga} against the {opp}',
      'Not a single miss: {player} shoots {fgm} of {fga}',
      '{fgm}-of-{fga} from the field. {player} was perfect against the {opp}',
      'Flawless shooting night for {player}: {fgm} for {fga}',
    ],
    'record.assist_turnover_clean': [
      '{player} hands out {ast} assists without a turnover',
      '{ast} assists, zero turnovers: {player} runs a clinic for the {team}',
      'Flawless: {plast} with {ast} assists and no giveaways',
      '{player} dishes {ast} and never gives it away',
    ],
    'record.team_zero_turnovers': [
      'The {team} play a full game without a turnover against the {opp}',
      'Zero turnovers: the {team} take care of the ball all night',
      'Not one giveaway: the {team} turnover column reads zero against the {opp}',
    ],
    'record.minutes_sixth_overtime': [
      '{player} logs a franchise-record {min} minutes in a {ots} marathon',
      '{min} minutes: {player} sets the {team} record in a {ots} game',
    ],
    'court.four_point_play': [
      '{player} converts a four-point play against the {opp}',
      '{plast} hits the three, takes the contact and makes the free throw',
      'Four-point play for {player} in {period}',
      'Three, the foul, the free throw: {player} turns one trip into four points',
    ],
    'court.five_point_play': [
      '{player} turns a four-pointer and a foul into a five-point play',
      'Five points on one trip: {plast} converts the deep shot and the free throw',
    ],
    'court.charge_triple': [
      '{player} takes three charges against the {opp}',
      'Sacrificing the body: {plast} draws three offensive fouls',
      '{player} draws three charges as the {team} frustrate the {opp}',
    ],
    'court.no_field_goals_quarter': [
      'The {team} hold the {opp} without a field goal for the entire {quarter}',
      'Not one basket: the {opp} go the whole {quarter} without a field goal against the {team}',
      'Shutout quarter: the {team} allow zero field goals in the {quarter}',
    ],
  };
  // Newspaper style for the old eras.
  const OLD = {
    'game.buzzer_beater': ['{plast} Basket at Gun Decides It; {team} Win, {ws}-{ls}', '{team} Snatch Victory as {plast} Scores at the Final Horn', 'Last-Second Shot by {plast} Downs {opp}'],
    'game.game_winner': ['{plast} Shot in Closing Seconds Wins for {team}', '{team} Edge {opp} on Late Basket by {plast}'],
    'game.comeback': ['{winner} Rally From {deficit} Points Down to Top {loser}', 'Spirited Comeback Carries {winner} Past {loser}, {ws}-{ls}'],
    'record.single_game': ['{player} Shatters League Record With {value} {stat}', 'New Mark: {plast} Collects {value} {stat}, Eclipsing {prevholder}'],
    'record.single_game_tie': ['{plast} Equals League Mark of {value} {stat}'],
    'record.five_by_five': ['{plast} Excels in Every Department Against {opp}'],
    'record.quadruple_double': ['Rare Feat: {plast} Reaches Double Figures in Four Columns'],
    'record.perfect_high_volume': ['{plast} Perfect From the Floor, {fgm} for {fga}'],
    'record.assist_turnover_clean': ['{plast} Hands Out {ast} Assists Without a Miscue'],
    'record.team_zero_turnovers': ['{team} Commit Nary a Turnover Against {opp}'],
    'record.minutes_sixth_overtime': ['{plast} Plays {min} Minutes in Marathon'],
    'court.four_point_play': ['{plast} Converts Rare Four-Point Play'],
    'court.five_point_play': ['{plast} Scores Five on a Single Trip'],
    'court.charge_triple': ['{plast} Draws Three Charging Fouls'],
    'court.no_field_goals_quarter': ['{team} Blank {opp} From the Field for a Full Quarter'],
  };
  // Reactions: role, situation, built-in lines (only for the biggest moments).
  const REACT = {
    'game.buzzer_beater': [['hype', 'game.react.buzzer_hype', ['{~opener} {player} at the buzzer. {~emoji_hype}', 'Ice cold. {plast} with the game on the line.', 'Somebody check on the {opp} bench after that one.'], { eraBuiltins: ['What a finish! {plast} let it fly as the gun sounded and the place came apart!'] }],
      ['meme', 'game.react.buzzer_loser_meme', ['{opp} fans watching that shot go in {~emoji_sad}', 'The {opp} defense on the last play: a respectful distance.'], { eraBuiltins: ['To the editor: why was nobody guarding {plast} on the final play?'] }]],
    'game.comeback': [['meme', 'game.react.comeback_loser_meme', ['The {loser} were up {deficit}. Blown leads should be a team stat.', 'Up {deficit} and still lost. The {loser} found a way.'], { eraBuiltins: ['The {loser} had this one in hand by {deficit} points and let it slip away. Dismal.'] }],
      ['homer', 'game.react.comeback_fan', ['DOWN {deficit} AND WE WON. Never leave early. {~emoji_hype}', 'I turned it off at {deficit} down. I am never doing that again.'], { eraBuiltins: ['Caller from {wcity}: I never stopped believing, down {deficit} or not!'] }]],
    'record.single_game': [['oldhead', 'record.react.oldhead', ['{prevposs} {prev} stood since {prevyear}. {plast} just took it. Respect.', 'Nobody thought {prevposs} record would fall. {value} {stat} is real.']],
      ['stats', 'record.react.stats', ['{value} {stat}. The old record, {prev}, had stood since {prevyear}.', 'Record: {value} {stat}. Previous best {prev} ({prevholder}, {prevyear}).']]],
  };

  // Which events become stories. Rare feats always; common ones only when they matter.
  function newsworthy(L, ev) {
    const user = L.userTeamId != null && ev.teams.includes(L.userTeamId);
    switch (ev.key) {
      case 'court.four_point_play': return user || ev.data.playoffs;
      case 'game.game_winner': return user || ev.data.playoffs || R.chance(0.5);
      default: return true;
    }
  }

  function ctxFor(L, ev) {
    const d = ev.data;
    const p = ev.players[0] != null ? (ev.snap.players[ev.players[0]] || {}) : null;
    const t = L.teams[ev.teams[0]], o = L.teams[ev.teams[1]];
    const c = { team: t.name, opp: o ? o.name : '', winner: t.name, loser: o ? o.name : '', wcity: t.city, lcity: o ? o.city : '' };
    if (p && p.name) Object.assign(c, { player: p.name, plast: last(p.name), pposs: poss(p.name) });
    if (d.ws != null) Object.assign(c, { ws: d.ws, ls: d.ls, margin: d.ws - d.ls });
    if (d.line) {
      const l = d.line;
      Object.assign(c, { fgm: l.fgm, fga: l.fga, ast: l.ast, min: Math.round(l.min),
        line: [['points', l.pts], ['rebounds', l.reb], ['assists', l.ast], ['steals', l.stl], ['blocks', l.blk]].filter(x => x[1] >= 10 || x[0] === 'points').map(x => `${x[1]} ${x[0]}`).join(', '),
        line5: `${l.pts} points, ${l.reb} rebounds, ${l.ast} assists, ${l.stl} steals and ${l.blk} blocks` });
    }
    if (ev.key === 'game.buzzer_beater' || ev.key === 'game.game_winner') {
      c.shot = d.putback ? 'putback' : d.shot === 'free throws' ? 'free throws' : d.shot;
      c.when = d.clock <= 1 ? 'at the buzzer' : `with ${d.clock.toFixed(1)} seconds left${d.period > 4 ? ' in overtime' : ''}`;
    }
    if (ev.key === 'game.comeback') c.deficit = d.deficit;
    if (d.stat) {
      Object.assign(c, { stat: HL.Events.STAT_LABEL[d.stat], value: d.value });
      if (d.prev) Object.assign(c, { prev: d.prev.v, prevholder: d.prev.name, prevposs: poss(d.prev.name), prevyear: d.prev.when ? d.prev.when.split(', ').pop() : `${d.prev.season}-${String(d.prev.season + 1).slice(2)}` });
    }
    if (d.period) c.period = periodName(d.period);
    if (d.quarter) c.quarter = `${ord(d.quarter)} quarter`;
    if (d.ot) c.ots = `${d.ot}-overtime`;
    if (d.min && !c.min) c.min = d.min;
    return c;
  }

  function story(L, ev) {
    if (!LINES[ev.key] || !newsworthy(L, ev)) return null;
    const era = HL.mediaEra(L);
    const c = ctxFor(L, ev);
    const headline = M.line(L, ev.key, { ...c, era, eraBuiltins: OLD[ev.key] }, LINES[ev.key]);
    if (!headline) return null;
    const team = L.teams[ev.teams[0]];
    const reactions = (REACT[ev.key] || []).map(([role, sit, lines, extra]) => HL.News.react(L, role, sit, c, lines, sit.includes('loser') ? L.teams[ev.teams[1]] : team, Object.assign({ hype: 1.6 }, extra || {}))).filter(Boolean);
    const big = ev.key.startsWith('record.single') || ev.key === 'game.buzzer_beater' || ev.key === 'record.quadruple_double';
    return HL.News.push(L, { type: 'event', eventId: ev.id, key: ev.key, gid: ev.data.gid, headline, teamIds: ev.teams.slice(), playerIds: ev.players.slice(), importance: big ? 3 : 2, reactions });
  }

  return { story, LINES, OLD, ctxFor };
})();
