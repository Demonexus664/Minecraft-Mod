// Situational news + social reactions generated from league events.
window.HL = window.HL || {};

HL.News = (function () {
  const R = HL.RNG;
  const M = HL.Media;
  const f = (L, n) => M.frag(L, n);
  const T = (L, id) => L.teams[id];
  const full = t => `${t.city} ${t.name}`;
  const last = p => p.name.split(' ').slice(1).join(' ') || p.name;
  const poss = n => n.endsWith('s') ? n + "'" : n + "'s";
  const aan = w => (/^[aeiou]/i.test(w) ? 'an ' : 'a ') + w;
  const ord = n => n + (['th', 'st', 'nd', 'rd'][(n % 100 - 20) % 10] || ['th', 'st', 'nd', 'rd'][n % 100] || 'th');

  function push(L, item) {
    L.news = L.news || [];
    item.id = (L.newsSeq = (L.newsSeq || 0) + 1);
    item.season = L.season; item.day = L.day; item.phase = L.phase;
    L.news.push(item);
    if (L.news.length > 600) L.news.splice(0, L.news.length - 600);
    return item;
  }
  function social(L, voiceKey, text, team, extra = {}) {
    const v = M.voiceInfo(voiceKey, team);
    return {
      voice: v, text,
      likes: Math.round(Math.pow(R.random(), 2) * 50000 * (extra.hype || 1)) + R.int(10, 400),
      reposts: Math.round(Math.pow(R.random(), 2.5) * 8000 * (extra.hype || 1)),
    };
  }

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
  const gameTemplates = [
    { id: 'g_blowout', when: c => c.margin >= 25, w: 2, h: (L, c) => `${c.W.name} ${f(L, 'crush')} ${c.Lo.name} by ${c.margin}` },
    { id: 'g_blowout2', when: c => c.margin >= 25, w: 2, h: (L, c) => `${c.margin}-point ${R.pick(['beatdown', 'massacre', 'statement', 'clinic', 'disaster'])}: ${c.W.abbr} ${c.ws}, ${c.Lo.abbr} ${c.ls}` },
    { id: 'g_ot', when: c => c.ot > 0, w: 3, h: (L, c) => `${c.ot > 1 ? (c.ot === 2 ? 'Double' : c.ot === 3 ? 'Triple' : c.ot + 'x') + '-overtime' : 'Overtime'} ${R.pick(['thriller', 'classic', 'marathon', 'instant classic', 'war'])}: ${c.W.name} ${f(L, 'edge')} ${c.Lo.name} ${c.ws}-${c.ls}` },
    { id: 'g_close', when: c => c.margin <= 3 && !c.ot, w: 2, h: (L, c) => `${c.W.name} ${f(L, 'edge')} ${c.Lo.name} ${c.ws}-${c.ls} in a ${R.pick(['nail-biter', 'tight one', 'down-to-the-wire finish', 'heart-stopper', 'gut-check win'])}` },
    { id: 'g_star', when: c => c.star && c.star.l.pts >= 40, w: 4, h: (L, c) => `${c.star.p.name} ${f(L, 'scored')} ${c.star.l.pts} as ${c.starWon ? `${c.star.t.name} ${f(L, 'beat')} ${c.starOpp.name}` : `${c.star.t.name} still fell to ${c.starOpp.name}`}` },
    { id: 'g_star2', when: c => c.star && c.star.l.pts >= 50, w: 6, h: (L, c) => `${c.star.l.pts}! ${c.star.p.name} has a ${f(L, 'big')} ${f(L, 'night')} ${c.starWon ? 'in the win' : 'in a losing effort'}` },
    { id: 'g_td', when: c => c.star && isTripleDouble(c.star.l), w: 4, h: (L, c) => `Triple-double: ${c.star.p.name} posts ${statStr(c.star.l)} ${c.starWon ? 'in the win' : 'but ' + c.star.t.name + ' come up short'}` },
    { id: 'g_streakW', when: c => c.W.streak >= 6, w: 3, h: (L, c) => `${c.W.name} are ${f(L, 'streak_w')}: ${c.W.streak} straight wins after beating ${c.Lo.name}` },
    { id: 'g_streakL', when: c => c.Lo.streak <= -6, w: 3, h: (L, c) => `${c.Lo.name} ${f(L, 'streak_l')}: ${-c.Lo.streak} straight losses after falling to ${c.W.name}` },
    { id: 'g_upset', when: c => c.upset, w: 3, h: (L, c) => `Upset alert: ${c.W.w - 1 <= c.W.l ? 'struggling ' : ''}${c.W.name} (${c.W.w}-${c.W.l}) ${f(L, 'beat')} ${c.Lo.name} (${c.Lo.w}-${c.Lo.l})` },
    { id: 'g_plain', w: 1, h: (L, c) => `${c.W.name} ${f(L, 'beat')} ${c.Lo.name} ${c.ws}-${c.ls}${c.star ? `; ${last(c.star.p)} leads with ${c.star.l.pts}` : ''}` },
    { id: 'g_plain2', w: 1, h: (L, c) => `${c.star ? `${poss(c.star.p.name)} ${c.star.l.pts} ` + (c.starWon ? 'powers' : 'not enough for') + ` ${c.star.t.name}` : `${c.W.name} win`} ${c.starWon ? 'past' : 'against'} ${c.starWon ? c.starOpp.name : c.starOpp.name}, ${c.ws}-${c.ls}` },
  ];

  function gameReactions(L, c) {
    const out = [];
    const s = c.star;
    if (s && s.l.pts >= 35) {
      out.push(social(L, 'debate', `${f(L, 'opener')} ${s.p.name} ${f(L, 'hype')}. ${s.l.pts} on ${s.l.fgm}-of-${s.l.fga}. ${f(L, 'emoji_hype')}`, s.t, { hype: 2 }));
      out.push(social(L, 'stats', `${f(L, 'stat_open')} ${s.p.name} scored ${s.l.pts} on ${(s.l.pts / Math.max(1, 2 * (s.l.fga + 0.44 * s.l.fta)) * 100).toFixed(1)}% true shooting with ${s.l.tov} turnover${s.l.tov === 1 ? '' : 's'} in ${Math.round(s.l.min)} minutes.`, s.t));
      if (s.l.fga >= 30 && s.l.pts / s.l.fga < 1.1) out.push(social(L, 'hater', `${s.l.fga} shots for ${s.l.pts}? Volume merchant behavior ${f(L, 'emoji_sad')}`, s.t));
    }
    if (c.margin >= 25) {
      out.push(social(L, 'memes', `${c.Lo.name} fans after the first quarter: "it's a long game" ${f(L, 'emoji_sad')}`, c.Lo));
      out.push(social(L, 'oldhead', `${f(L, 'old_open')} getting beat by ${c.margin} meant extra practice and no plane snacks. ${c.Lo.name} need to look in the mirror.`, c.Lo));
    }
    if (c.Lo.streak <= -5) out.push(social(L, 'beat', `Postgame in ${c.Lo.city}: ${f(L, 'team_mood_bad')}. That's ${-c.Lo.streak} straight.`, c.Lo));
    if (c.W.streak >= 5) out.push(social(L, 'homer', `${c.W.streak} STRAIGHT. ${f(L, 'team_mood_good')} ${f(L, 'emoji_hype')}`, c.W, { hype: 1.4 }));
    if (c.ot) out.push(social(L, 'memes', `My heart cannot take ${c.ot > 1 ? c.ot + ' overtimes' : 'overtime'} on a ${R.pick(['Tuesday', 'Wednesday', 'Thursday', 'school night', 'work night'])} ${f(L, 'emoji_sad')}`, c.W));
    return out;
  }

  function game(L, g, res, playoffs) {
    if (playoffs) return; // playoff stories come from series events
    const hs = res.home.score, as = res.away.score;
    const homeWon = hs > as;
    const W = T(L, homeWon ? g.home : g.away), Lo = T(L, homeWon ? g.away : g.home);
    const ws = Math.max(hs, as), ls = Math.min(hs, as);
    const hb = topLine(L, res.home), ab = topLine(L, res.away);
    const starRaw = (hb && ab) ? (hb.gs >= ab.gs ? { ...hb, home: true } : { ...ab, home: false }) : null;
    const star = starRaw ? { ...starRaw, t: T(L, starRaw.home ? g.home : g.away) } : null;
    const c = {
      W, Lo, ws, ls, margin: ws - ls, ot: res.ot, star,
      starWon: star && (star.home === homeWon),
      starOpp: star ? T(L, star.home ? g.away : g.home) : null,
      upset: (W.w + W.l > 15) && (Lo.w / (Lo.w + Lo.l) - W.w / (W.w + W.l) > 0.3),
    };
    const isUser = L.userTeamId != null && (g.home === L.userTeamId || g.away === L.userTeamId);
    const notable = isUser || c.margin >= 30 || res.ot >= 2 || (star && (star.l.pts >= 45 || isTripleDouble(star.l) && star.l.pts >= 25)) || c.upset && R.chance(0.3) || W.streak === 10 || Lo.streak === -10;
    if (!notable) return;
    const t = M.choose(L, gameTemplates, c);
    push(L, {
      type: 'game', gid: g.gid, headline: t.h(L, c), teamIds: [g.home, g.away], playerIds: star ? [star.p.id] : [],
      importance: isUser ? 2 : 1, reactions: gameReactions(L, c),
    });
  }

  // ---------- INJURY ----------
  function injury(L, p, inj) {
    const t = T(L, p.teamId);
    const weeks = Math.round(inj.games / 3.5);
    const longTerm = inj.games >= 50;
    const hl = M.choose(L, [
      { id: 'i1', h: () => `${p.name} (${inj.name.toLowerCase()}) expected to miss ${weeks >= 2 ? `${weeks} weeks` : `${inj.games} games`}` },
      { id: 'i2', h: () => `${f(L, 'injury_sad')} ${poss(t.name)} ${p.name} sidelined with ${inj.name.toLowerCase()}` },
      { id: 'i3', when: () => longTerm, w: 3, h: () => `${p.name} suffers ${inj.name.toLowerCase()}; ${inj.games >= 82 ? 'season in jeopardy' : 'out for months'}` },
      { id: 'i4', when: () => p.ovr >= 85, w: 2, h: () => `Major blow for ${t.name}: star ${p.name} out with ${inj.name.toLowerCase()}` },
    ], {}).h();
    const reactions = [
      social(L, 'insider', `${f(L, 'sources')} ${t.name} ${p.pos} ${p.name} has been diagnosed with ${aan(inj.name.toLowerCase())} and will be re-evaluated in ${Math.max(1, weeks)} week${weeks === 1 ? '' : 's'}.`, t, { hype: p.ovr >= 85 ? 3 : 1 }),
    ];
    if (p.ovr >= 85) reactions.push(social(L, 'odds', `${t.name} title odds move from +${R.int(6, 20) * 100} to +${R.int(21, 60) * 100} after the ${last(p)} news.`, t));
    if (longTerm) reactions.push(social(L, 'homer', `Praying for ${last(p)}. Come back stronger. 🙏`, t));
    push(L, { type: 'injury', headline: hl, teamIds: [t.id], playerIds: [p.id], importance: p.ovr >= 85 ? 2 : 1, reactions });
  }

  // ---------- AWARDS / PHASES ----------
  function awards(L, a) {
    const pn = id => L.players[id];
    const mvp = pn(a.mvp);
    if (mvp) {
      const s = HL.League.perGame(mvp, L.season);
      const prev = mvp.careerAwards.filter(x => x.award === 'MVP').length;
      push(L, {
        type: 'award', importance: 3, playerIds: [mvp.id], teamIds: [mvp.teamId],
        headline: prev > 1 ? `${mvp.name} wins ${ord(prev)} MVP` : `${mvp.name} is your ${L.season}-${String(L.season + 1).slice(2)} MVP`,
        body: `${s.pts.toFixed(1)} PPG, ${s.reb.toFixed(1)} RPG, ${s.ast.toFixed(1)} APG for the ${T(L, mvp.teamId).w}-${T(L, mvp.teamId).l} ${T(L, mvp.teamId).name}.`,
        reactions: [
          social(L, 'debate', `${f(L, 'opener')} the right man won. ${mvp.name} ${f(L, 'hype')}.`, T(L, mvp.teamId), { hype: 2 }),
          a.mvpRace[1] != null ? social(L, 'hater', `${pn(a.mvpRace[1]).name} got ROBBED. Voters are a joke ${f(L, 'emoji_sad')}`, T(L, pn(a.mvpRace[1]).teamId)) : null,
        ].filter(Boolean),
      });
    }
    const line = (id, award) => id != null && push(L, { type: 'award', importance: 2, playerIds: [id], teamIds: [pn(id).teamId], headline: `${pn(id).name} named ${award}` });
    line(a.dpoy, 'Defensive Player of the Year');
    line(a.roy, 'Rookie of the Year');
    line(a.smoy, 'Sixth Man of the Year');
  }

  function phase(L, ph) {
    if (ph === 'playin') push(L, { type: 'phase', importance: 2, headline: `Regular season wraps up: ${HL.League.standings('East')[0].name} and ${HL.League.standings('West')[0].name} earn top seeds` });
    if (ph === 'playoffs') push(L, { type: 'phase', importance: 2, headline: `Play-in set the field: the ${L.season + 1} Playoffs begin` });
  }

  function seriesEnd(L, s, roundNo) {
    const W = T(L, s.winner), Lo = T(L, s.winner === s.hi ? s.lo : s.hi);
    const score = s.wins.slice().sort((a, b) => b - a).join('-');
    const roundName = ['First Round', 'Conference Semifinals', 'Conference Finals', 'NBA Finals'][roundNo - 1];
    if (roundNo === 4) return;
    const sweep = score === '4-0', seven = score === '4-3';
    const upset = s.winner === s.lo && s.hiSeed && s.loSeed - s.hiSeed >= 3;
    const t = M.choose(L, [
      { id: 's1', h: () => `${W.name} eliminate ${Lo.name} ${score} in the ${roundName}` },
      { id: 's2', when: () => sweep, w: 3, h: () => `Brooms out: ${W.name} sweep ${Lo.name}` },
      { id: 's3', when: () => seven, w: 3, h: () => `${W.name} survive Game 7, ${R.pick(['stun', 'outlast', 'break the hearts of', 'end the season of'])} ${Lo.name}` },
      { id: 's4', when: () => upset, w: 4, h: () => `${s.loSeed}-seed ${W.name} ${R.pick(['shock', 'stun', 'topple', 'upset'])} ${s.hiSeed}-seed ${Lo.name}` },
      { id: 's5', h: () => `${W.name} advance past ${Lo.name} (${score}); ${roundNo === 3 ? 'headed to the NBA Finals' : 'next up: ' + ['Conference Semifinals', 'Conference Finals'][roundNo - 1]}` },
    ], {});
    push(L, { type: 'playoffs', importance: roundNo >= 3 ? 3 : 2, teamIds: [W.id, Lo.id], headline: t.h(), reactions: [
      social(L, 'homer', `${f(L, 'emoji_hype')} ${W.name.toUpperCase()} MOVING ON ${f(L, 'emoji_hype')}`, W, { hype: 1.5 }),
      social(L, 'beat', `${poss(Lo.name)} season is over. ${R.pick(['Big questions this summer.', 'Change feels inevitable.', 'Plenty to process.', 'The front office has decisions to make.'])}`, Lo),
    ] });
  }

  function champion(L, champId, finals) {
    const W = T(L, champId), Lo = T(L, finals.winner === finals.hi ? finals.lo : finals.hi);
    const titles = L.history.filter(h => h.champion === champId).length;
    const fm = L.awards[L.season].fmvp != null ? L.players[L.awards[L.season].fmvp] : null;
    const score = finals.wins.slice().sort((a, b) => b - a).join('-');
    push(L, {
      type: 'champion', importance: 4, teamIds: [W.id, Lo.id], playerIds: fm ? [fm.id] : [],
      headline: M.choose(L, [
        { id: 'c1', h: () => `${full(W)} are ${L.season + 1} NBA Champions` },
        { id: 'c2', h: () => `${W.name} win the title, beating ${Lo.name} ${score}` },
        { id: 'c3', when: () => titles > 1, h: () => `Banner No. ${titles} for this era: ${W.name} beat ${Lo.name} for another championship` },
      ], {}).h(),
      body: fm ? `${fm.name} named Finals MVP.` : '',
      reactions: [
        social(L, 'homer', `CHAMPIONS!!! ${f(L, 'emoji_hype')}${f(L, 'emoji_hype')}${f(L, 'emoji_hype')}`, W, { hype: 4 }),
        fm ? social(L, 'debate', `${f(L, 'opener')} ${fm.name} just changed his legacy forever.`, W, { hype: 3 }) : null,
        social(L, 'memes', `${Lo.name} fans logging off for the summer ${f(L, 'emoji_sad')}`, Lo, { hype: 2 }),
      ].filter(Boolean),
    });
  }

  function retire(L, p) {
    const rings = p.careerAwards.filter(a => a.award === 'Champion').length;
    const mvps = p.careerAwards.filter(a => a.award === 'MVP').length;
    if (p.ovr < 76 && rings === 0 && mvps === 0) return;
    push(L, { type: 'retire', importance: p.ovr >= 85 || mvps ? 3 : 1, playerIds: [p.id],
      headline: `${p.name} announces retirement${rings ? ` after ${rings} championship${rings > 1 ? 's' : ''}` : ''}${mvps ? ` and ${mvps} MVP${mvps > 1 ? 's' : ''}` : ''}`,
      reactions: [social(L, 'oldhead', `${R.pick(['One of the good ones.', 'Hall of Fame talent, Hall of Fame person.', 'They do not make them like that anymore.', 'Enjoy retirement, young fella.'])} Salute to ${last(p)}.`, null)] });
  }

  function seasonStart(L) {
    push(L, { type: 'phase', importance: 2, headline: `The ${L.season}-${String(L.season + 1).slice(2)} season tips off`, reactions: [
      social(L, 'odds', `Title favorites entering the season: ${favorites(L).slice(0, 3).map(t => t.name).join(', ')}.`, null),
    ] });
  }

  function favorites(L) {
    return L.teams.slice().sort((a, b) => teamStrength(L, b.id) - teamStrength(L, a.id));
  }
  function teamStrength(L, tid) {
    const ps = HL.League.teamPlayers(tid).filter(p => !p.injury || p.injury.games < 20).sort((a, b) => b.ovr - a.ovr).slice(0, 8);
    return ps.reduce((s, p, i) => s + p.ovr * [1.4, 1.3, 1.2, 1.1, 1, 0.7, 0.6, 0.5][i], 0);
  }

  function hardship(L, t, p) {
    push(L, { type: 'transaction', importance: 1, teamIds: [t.id], playerIds: [p.id],
      headline: M.choose(L, [
        { id: 'hs1', h: () => `${t.name} sign ${p.name} via hardship exception` },
        { id: 'hs2', h: () => `Injury-ravaged ${t.name} add ${p.name} on a hardship deal` },
        { id: 'hs3', h: () => `Short-handed ${t.name} turn to ${p.name}` },
      ], {}).h(),
      reactions: [social(L, 'beat', `${t.name} had ${HL.League.teamPlayers(t.id).filter(x => !x.injury || x.injury.games <= 0).length - 1} healthy bodies at shootaround. ${R.pick(['Desperate times.', 'Next man up.', 'The training room is fuller than the locker room.', 'Somebody check the water in that building.'])}`, t)] });
  }

  return { hardship, game, injury, awards, phase, seriesEnd, champion, retire, seasonStart, teamStrength, favorites, social, push };
})();
