// Media day: before the opener every team shoots portraits and short interviews. The portraits are
// composed from pieces (current jersey and number, pose, expression, camera angle, lighting, backdrop,
// hairstyle) and stored, so the picture and the posts describe the same thing.
// Social reaction threads follow (washed takes, rebuttals, bad clips, memes, fake quotes, corrections)
// with player responses that can backfire or be redeemed by real games. Opinions never change ratings.
window.HL = window.HL || {};

HL.MediaDay = (function () {
  const R = HL.RNG;
  const M = HL.Media;
  // Fictional platform names (configurable).
  const PLATFORMS = { short: 'ClipFeed', video: 'StreamTube', micro: 'Chirp', photo: 'Snapshot' };
  const POSES = ['arms crossed', 'ball on the hip', 'pointing at the camera', 'spinning the ball', 'hood up', 'holding the ball overhead', 'chin up, eyes down the lens', 'hands on the hips', 'looking off camera', 'flexing', 'one finger to the lips', 'ball tucked under the arm'];
  const MEME_POSES = ['pointing at the camera', 'hood up', 'one finger to the lips', 'flexing', 'looking off camera'];
  const EXPRESSIONS = ['neutral', 'smiling', 'serious', 'tired', 'laughing', 'squinting'];
  const ANGLES = ['straight on', 'low angle', 'high angle', 'tight crop'];
  const LIGHTING = ['studio', 'harsh flash', 'moody', 'backlit'];
  const BACKDROPS = ['step-and-repeat', 'team color', 'arena dark', 'gradient'];
  const CLIPS = [
    { clip: 'ball-spin attempt that rolls away', context: 'the next take, two seconds later, is clean' },
    { clip: 'blank stare at a summer-workout question', context: 'he was listening to a second reporter asking at the same time' },
    { clip: 'airballed shootaround three', context: 'he made the next nine shots in the same session' },
    { clip: 'laugh in the middle of a season-prediction answer', context: 'a teammate was making faces behind the camera' },
    { clip: 'walk straight into the backdrop', context: 'the set had been moved between takes' },
    { clip: 'mispronounced the new arena sponsor', context: 'the name had changed that morning' },
  ];
  const FAKE_QUOTES = ['I carried this franchise and nobody says thank you', "Rings are overrated. Ask anybody who doesn't have one", 'I already know we are winning it all, write it down', 'The coach works for me', 'I could average 30 on any team in this league'];
  const CAUSES = ['youth basketball courts', 'a children’s hospital wing', 'school lunch programs', 'local food banks', 'after-school literacy programs'];
  const LOOK_WORDS = { 'harsh flash': 'washed-out flash', moody: 'dark, moody', backlit: 'backlit', studio: 'studio' };
  const HAIR_NAMES = ['short crop', 'tight fade', 'high top', 'twists', 'shaved head'];

  const enabled = L => L.season >= 2010 && !(L.settings && L.settings.mediaDay === false);
  const fame = p => Math.round(1800 * Math.pow(1.17, p.ovr - 70));
  const reach = (L, p) => { const t = p.teamId != null ? L.teams[p.teamId] : null; return Math.round(fame(p) * (0.7 + (t && t.market ? t.market / 10 : 0.5)) * R.range(0.6, 1.5)); };
  const last = n => n.split(' ').slice(1).join(' ') || n;
  const poss = n => n.endsWith('s') ? n + "'" : n + "'s";

  // ---------- portraits ----------
  function compose(L, p, extra = {}) {
    const t = L.teams[p.teamId];
    const pr = p.persona || {};
    const comp = {
      id: `md${L.season}-${p.id}`, pid: p.id, teamId: p.teamId, season: L.season,
      number: HL.jerseyNumber(p),
      pose: extra.pose || R.pick(POSES),
      expression: extra.expression || R.weighted(EXPRESSIONS, e => e === 'tired' ? (p.age >= 33 ? 2 : 0.4) : e === 'smiling' ? 1.4 + (pr.extro || 0) : 1),
      angle: extra.angle || R.weighted(ANGLES, a => a === 'straight on' ? 3 : 1),
      lighting: extra.lighting || R.weighted(LIGHTING, l => l === 'studio' ? 4 : 1),
      backdrop: R.pick(BACKDROPS),
      jersey: { team: t.name, city: t.city, abbr: t.abbr, color: t.color, color2: t.color2 },
      look: Object.assign({}, p.look || {}),
    };
    return comp;
  }

  // ---------- the event ----------
  function run(L) {
    L.mediaDays = L.mediaDays || {};
    if (L.mediaDays[L.season] || !enabled(L)) return null;
    const md = L.mediaDays[L.season] = { season: L.season, portraits: [], events: [] };
    L.mediaThreads = L.mediaThreads || [];
    const players = Object.values(L.players).filter(p => p.teamId != null);
    const ev = (key, p, data = {}, extra = {}) => {
      const e = HL.Events.log(L, key, { players: [p.id, ...(extra.others || [])], teams: [p.teamId], source: extra.source || 'media day', visibility: 'public', data });
      md.events.push(e.id);
      story(L, e);
      return e;
    };
    for (const t of L.teams) {
      const roster = players.filter(p => p.teamId === t.id).sort((a, b) => b.ovr - a.ovr);
      for (const [i, p] of roster.entries()) {
        const prev = p.md || null;
        const extra = {};
        const fam = fame(p);
        // Visible changes since the last media day (facts first).
        if (!p.real && p.look && prev && prev.hair != null && p.look.hair !== prev.hair) extra.hairChanged = true;
        if (!p.real && R.chance(0.08)) { p.look = Object.assign({}, p.look || {}, { hair: (((p.look && p.look.hair) || 0) + R.int(1, 4)) % 5 }); extra.hairChanged = true; }
        // Offseason body changes are measured at media day.
        if (prev && prev.weight && R.chance(0.07)) { const d = R.pick([-1, 1]) * R.int(8, 20); p.weight = Math.max(160, p.weight + d); }
        const notable = i < 3 || !prev || (prev && prev.teamId !== p.teamId) || p.ovr >= 80;
        if (!notable) { p.md = snap(L, p); continue; }
        const comp = compose(L, p, extra);
        md.portraits.push(comp);
        const base = { asset: comp.id, pose: comp.pose, expression: comp.expression, angle: comp.angle, lighting: comp.lighting, backdrop: comp.backdrop, number: comp.number };
        const rookie = p.draft && p.draft.year === L.season || (p.yearsPro === 0);
        // First impressions: rookies and headline arrivals.
        if (rookie && p.ovr >= 72 || (prev && prev.teamId !== p.teamId && p.ovr >= 84)) {
          const pos = Math.round(reach(L, p) * R.range(0.5, 0.9));
          if (pos >= 4000) ev('media.day.first_impression_hype', p, { ...base, positive_reactions: pos, threshold: 4000 });
        }
        // Numbers: a first professional number, or a new one with a new team.
        if ((rookie || (prev && prev.number != null && prev.number !== comp.number)) && p.ovr >= 74) ev('media.day.number_reveal_reaction', p, { ...base, number: comp.number, previous: prev ? prev.number : null, first: !!rookie });
        // A familiar star in a new uniform.
        if (prev && prev.teamId != null && prev.teamId !== p.teamId && p.ovr >= 80) {
          const was = L.teams[prev.teamId];
          ev('media.day.new_team_jersey_debate', p, { ...base, previousTeam: was ? was.name : prev.teamName, jersey: `${t.name} home`, discussion: reach(L, p) });
        }
        // Hairstyle (generated players: their portrait is drawn from these pieces).
        if (extra.hairChanged) ev('media.day.hairstyle_reveal', p, { ...base, look: HAIR_NAMES[p.look.hair] || 'new', previous: prev && prev.hair != null ? HAIR_NAMES[prev.hair] : null });
        // Measured weight change against last year's measurement.
        if (prev && prev.weight && Math.abs(p.weight - prev.weight) >= 8) ev('media.day.fitness_change', p, { ...base, metric: 'weight', previous: prev.weight, current: p.weight, change: `${p.weight > prev.weight ? 'added' : 'dropped'} ${Math.abs(p.weight - prev.weight)} pounds since last media day (${prev.weight} to ${p.weight})` });
        // "Washed": aging stars below their peak, or whose rating fell since last season.
        // Peak so far: the real career peak for real players (only used for veterans, whose peaks are behind them).
        const realPeak = p.hid && HL.HISTORY && HL.HISTORY.legacy && HL.HISTORY.legacy[p.hid] && p.age >= 31 ? HL.HISTORY.legacy[p.hid][1] : 0;
        const peak = Math.max(p.peakOvr || 0, prev ? prev.peak || 0 : 0, realPeak, p.ovr);
        const decline = prev ? prev.ovr - p.ovr : 0;
        const washedCase = p.age >= 31 && peak >= 84 && (peak - p.ovr >= 4 || decline >= 2);
        if (washedCase && R.chance(0.22 + Math.min(0.3, (peak - p.ovr) * 0.03) + (comp.expression === 'tired' ? 0.15 : 0))) {
          const count = Math.round(reach(L, p) * R.range(0.15, 0.4));
          if (count >= 1500) {
            const e = ev('media.social.washed_slander', p, { ...base, platform: R.pick([PLATFORMS.short, PLATFORMS.micro]), washed_reactions: count, threshold: 1500, age: p.age, peak, ovr: p.ovr });
            openThread(L, e, p, 'washed');
          }
        } else if (fam >= 9000 && R.chance(0.12)) {
          // A bad still or angle, nothing more.
          comp.lighting = R.pick(['harsh flash', 'moody']); comp.angle = R.pick(['high angle', 'tight crop']);
          const e = ev('media.social.unflattering_photo_reaction', p, { ...base, lighting: comp.lighting, angle: comp.angle, platform: PLATFORMS.photo, look: `${LOOK_WORDS[comp.lighting]} ${comp.angle}`, negative: Math.round(reach(L, p) * R.range(0.1, 0.3)) });
          openThread(L, e, p, 'photo');
        }
        // Awkward clips (and whether the circulating version was cut).
        if (fam >= 6000 && R.chance(0.07)) {
          const c = R.pick(CLIPS);
          const e = ev('media.social.bad_clip_pile_on', p, { ...base, platform: PLATFORMS.short, clip: c.clip, critical: Math.round(reach(L, p) * R.range(0.2, 0.5)), edited: R.chance(0.45), fullContext: c.context });
          openThread(L, e, p, 'clip');
        }
        // Poses that become memes.
        if (MEME_POSES.includes(comp.pose) && fam >= 8000 && R.chance(0.18)) {
          const e = ev('media.social.pose_becomes_meme', p, { ...base, platform: PLATFORMS.short, remakes: Math.round(reach(L, p) * R.range(0.02, 0.08)) });
          openThread(L, e, p, 'meme');
        }
        // Split reception for big names.
        if (fam >= 20000 && R.chance(0.12)) {
          const pos = R.range(0.35, 0.6);
          ev('media.social.audience_split', p, { ...base, platform: PLATFORMS.micro, positive_share: Math.round(pos * 100), negative_share: Math.round((1 - pos) * 100 - R.int(0, 8)) });
        }
        // Body-language readings of the portrait.
        if (fam >= 12000 && ['looking off camera', 'arms crossed'].includes(comp.pose) && comp.expression !== 'smiling' && R.chance(0.3)) {
          ev('media.day.chemistry_body_language', p, { ...base, look: `${comp.expression}, ${comp.pose}`, interpretations: Math.round(reach(L, p) * R.range(0.05, 0.15)) });
        }
        // Old footage passed off as new.
        if (p.age >= 27 && fam >= 9000 && R.chance(0.03)) {
          const yrs = R.int(2, Math.min(8, p.age - 20));
          ev('media.social.old_clip_recycled', p, { ...base, platform: PLATFORMS.short, date: String(L.season - yrs), reposts: Math.round(reach(L, p) * R.range(0.05, 0.2)) }, { source: 'social' });
        }
        // Fabricated quote graphics are rare, and always corrected once checked.
        if (fam >= 25000 && R.chance(0.025)) {
          const e = ev('media.social.fake_quote_corrected', p, { ...base, platform: PLATFORMS.micro, quote: R.pick(FAKE_QUOTES), fabricated: true }, { source: 'verification' });
          e.data.correction = true;
        }
        // Rivals who are now teammates share a frame.
        const rv = rivalOf(L, p);
        if (rv && L.players[rv.pid] && L.players[rv.pid].teamId === p.teamId && p.id < rv.pid && R.chance(0.6)) {
          ev('media.day.rivals_group_photo', p, { ...base, rival: L.players[rv.pid].name, rivalId: rv.pid, pose: R.pick(['back to back', 'shoulder to shoulder', 'one seated, one standing']), rivalry: rv.text }, { others: [rv.pid] });
        }
        p.md = snap(L, p);
      }
    }
    return md;
  }
  function snap(L, p) {
    return { season: L.season, teamId: p.teamId, teamName: p.teamId != null ? L.teams[p.teamId].name : null, number: HL.jerseyNumber(p), ovr: p.ovr, peak: Math.max(p.ovr, p.md ? p.md.peak || 0 : 0, p.peakOvr || 0), weight: p.weight, hair: p.look ? p.look.hair : null };
  }

  // ---------- rivalries (from playoff series in this league) ----------
  function noteSeries(L, s) {
    if (s.winner == null) return;
    const close = Math.abs(s.wins[0] - s.wins[1]) <= 2 || s.conf === 'Finals';
    if (!close) return;
    const star = tid => HL.League.teamPlayers(tid).filter(p => p.ovr >= 80).sort((a, b) => b.ovr - a.ovr)[0];
    const a = star(s.hi), b = star(s.lo);
    if (!a || !b) return;
    L.rivalries = L.rivalries || [];
    const text = `${L.teams[s.winner].name} won their ${L.season} ${s.conf === 'Finals' ? 'Finals' : 'playoff'} series ${Math.max(...s.wins)}-${Math.min(...s.wins)}`;
    L.rivalries.push({ a: a.id, b: b.id, season: L.season, text });
    if (L.rivalries.length > 200) L.rivalries.shift();
  }
  function rivalOf(L, p) {
    const r = (L.rivalries || []).filter(x => x.a === p.id || x.b === p.id).pop();
    return r ? { pid: r.a === p.id ? r.b : r.a, text: r.text } : null;
  }

  // ---------- threads, responses and follow-ups ----------
  function openThread(L, e, p, kind) {
    const th = { id: e.id, eventId: e.id, pid: p.id, teamId: p.teamId, kind, season: L.season, day: L.day, status: 'open', response: null, followups: [] };
    L.mediaThreads.push(th);
    if (L.mediaThreads.length > 300) L.mediaThreads.shift();
    const user = L.userTeamId != null && p.teamId === L.userTeamId;
    if (!user) autoRespond(L, th);
    return th;
  }
  const OPTIONS = {
    washed: ['ignore', 'joke', 'clapback', 'hoop'],
    photo: ['ignore', 'joke', 'repost', 'clapback'],
    clip: ['ignore', 'joke', 'context', 'clapback'],
    meme: ['ignore', 'embrace', 'charity'],
  };
  const OPTION_TEXT = {
    ignore: ['Ignore it', 'Say nothing. It fades or it doesn\'t.'],
    joke: ['Laugh it off', 'Post a self-deprecating joke about it.'],
    clapback: ['Clap back', 'Fire back at the critics. High risk.'],
    hoop: ['Let the game answer', 'No comment until the season starts. A big game could flip it.'],
    repost: ['Repost a better photo', 'Share your own pick of the shoot.'],
    context: ['Ask for the full clip', 'Have the team publish the uncut footage.'],
    embrace: ['Embrace the meme', 'Recreate it yourself.'],
    charity: ['Turn it into a fundraiser', 'Link the meme to a charity drive; only delivered money counts.'],
  };
  const QUOTES = {
    clapback: ['Check the tape, not the photo.', 'Y\'all said that last year too.', 'Washed? Come guard me then.', 'Respectfully, the comments section has never won a game.'],
    joke: ['In my defense, the photographer said "look tired."', 'I am 34 in human years and 90 in basketball years.', 'New season, same face. Sorry.', 'Lighting guy owes me an apology.'],
  };

  function autoRespond(L, th) {
    const p = L.players[th.pid];
    const tr = p.traits || {};
    const opts = OPTIONS[th.kind] || ['ignore'];
    // Personality picks the response: egos clap back, calm veterans ignore or joke.
    const pick = R.weighted(opts, o => ({ ignore: 3, joke: 1 + (tr.temperament || 50) / 50, clapback: (tr.ego || 50) / 30 * (100 - (tr.temperament || 50)) / 60, hoop: 1.2, repost: 0.8, context: 1.5, embrace: 1.5, charity: 0.5 }[o] || 1));
    respond(L, th, pick, true);
  }

  function respond(L, th, choice, auto) {
    if (th.status !== 'open') return null;
    const p = L.players[th.pid];
    if (!p) return null;
    th.response = { choice, day: L.day, auto: !!auto };
    const orig = (L.events || []).find(e => e.id === th.eventId);
    const plat = orig && orig.data.platform || PLATFORMS.micro;
    const tr = p.traits || {};
    p.media = p.media || { pressure: 0, buzz: 0 };
    if (choice === 'ignore') { th.status = 'closed'; p.media.pressure += 2; return null; }
    if (choice === 'context' && orig) {
      th.status = 'closed';
      if (orig.data.edited) {
        const e = HL.Events.log(L, 'media.social.selective_edit_exposed', { players: [p.id], teams: [p.teamId], source: 'team release', data: { platform: plat, clip: orig.data.clip, context: orig.data.fullContext, excerpt: orig.id, asset: orig.data.asset } });
        th.followups.push(e.id); story(L, e);
        p.media.pressure = Math.max(0, p.media.pressure - 6);
        return e;
      }
      th.note = 'The full clip matched the circulating version.';
      p.media.pressure += 3;
      return null;
    }
    if (choice === 'charity') {
      th.status = 'charity';
      th.charity = { cause: R.pick(CAUSES), due: L.day + R.int(10, 25), raised: Math.round(reach(L, p) * R.range(1.5, 6) / 100) * 100 };
      return null;
    }
    if (choice === 'embrace' || choice === 'repost') { th.status = 'closed'; p.media.buzz += 5; return null; }
    if (choice === 'hoop') { th.status = 'proof'; th.until = L.day + 21; return null; }
    // joke / clapback: a measured audience reaction, then possibly redemption on the court.
    const quote = R.pick(QUOTES[choice] || QUOTES.joke);
    th.response.quote = quote;
    const backfireP = choice === 'clapback' ? 0.35 + ((tr.ego || 50) - 50) / 200 : 0.12;
    if (R.chance(backfireP)) {
      const base = R.range(0.35, 0.5), after = base + R.range(0.15, 0.3);
      const e = HL.Events.log(L, 'media.social.player_response_backfire', { players: [p.id], teams: [p.teamId], source: 'social', data: { platform: plat, quote, baseline_negative: Math.round(base * 100), followup_negative: Math.round(after * 100), source_event: th.eventId, asset: orig && orig.data.asset } });
      th.followups.push(e.id); story(L, e);
      p.media.pressure += 8;
      th.status = 'proof'; th.until = L.day + 30;
      return e;
    }
    th.status = 'proof'; th.until = L.day + 21;
    p.media.buzz += choice === 'joke' ? 4 : 2;
    return null;
  }

  // Daily: charity confirmations, washed rebuttals, rival support, thread expiry.
  const assetOf = (L, th) => { const e = (L.events || []).find(x => x.id === th.eventId); return e ? e.data.asset : null; };
  function tick(L) {
    if (!L.mediaThreads) return;
    for (const th of L.mediaThreads) {
      if (th.season !== L.season) continue;
      const p = L.players[th.pid];
      if (!p) { th.status = 'closed'; continue; }
      if (th.status === 'charity' && L.day >= th.charity.due) {
        th.status = 'closed';
        const e = HL.Events.log(L, 'media.social.meme_to_charity', { players: [p.id], teams: [p.teamId], source: 'recipient confirmation', data: { platform: PLATFORMS.short, cause: th.charity.cause, amount: th.charity.raised, amountText: '$' + th.charity.raised.toLocaleString('en-US'), asset: assetOf(L, th) } });
        th.followups.push(e.id); story(L, e);
      }
      if (th.kind === 'washed' && !th.rebuttal && L.day >= th.day + 2) {
        th.rebuttal = true;
        if (R.chance(0.35 + Math.min(0.4, (p.ovr - 80) * 0.03))) {
          const e = HL.Events.log(L, 'media.social.washed_rebuttal', { players: [p.id], teams: [p.teamId], source: 'social', data: { platform: PLATFORMS.micro, supporters: Math.round(reach(L, p) * R.range(0.05, 0.15)), source_event: th.eventId, asset: assetOf(L, th) } });
          th.followups.push(e.id); story(L, e);
        }
        const rv = rivalOf(L, p);
        if (rv && L.players[rv.pid] && R.chance(0.25)) {
          const rp = L.players[rv.pid];
          const quote = R.pick([`Anybody calling ${last(p.name)} washed never had to guard him.`, `I have seen ${last(p.name)} up close. Leave him alone until the games start.`, `Respect where it is due. ${last(p.name)} is still a problem.`]);
          const e = HL.Events.log(L, 'media.social.unexpected_rival_support', { players: [p.id, rp.id], teams: [p.teamId, rp.teamId].filter(x => x != null), source: 'social', data: { platform: PLATFORMS.micro, rival: rp.name, quote, rivalry: rv.text, asset: assetOf(L, th) } });
          th.followups.push(e.id); story(L, e);
        }
      }
      if (th.status === 'proof' && L.day > th.until) th.status = 'closed';
    }
    if (L.players) for (const p of Object.values(L.players)) if (p.media) { p.media.pressure *= 0.98; p.media.buzz *= 0.97; }
  }

  // After each game: a big line can redeem a player who answered his critics.
  function afterGame(L, res) {
    if (!L.mediaThreads) return;
    for (const th of L.mediaThreads) {
      if (th.status !== 'proof' || th.season !== L.season) continue;
      for (const side of [res.home, res.away]) {
        const b = side.box[th.pid];
        if (!b) continue;
        const reb = b.orb + b.drb;
        const big = b.pts >= 30 || (b.pts >= 20 && (reb >= 10 || b.ast >= 10)) || (b.pts >= 25 && b.fga && b.fgm / b.fga >= 0.6);
        if (!big) continue;
        const p = L.players[th.pid];
        th.status = 'closed';
        const line = `${b.pts}-point${reb >= 10 ? `, ${reb}-rebound` : ''}${b.ast >= 10 ? `, ${b.ast}-assist` : ''} game`;
        const e = HL.Events.log(L, 'media.social.player_response_redeemed', { players: [p.id], teams: [p.teamId], source: 'box score + social', data: { platform: PLATFORMS.micro, line, response: th.response ? th.response.choice : null, quote: th.response && th.response.quote, baseline_favorable: R.int(30, 45), followup_favorable: R.int(55, 75), source_event: th.eventId, asset: assetOf(L, th) } });
        th.followups.push(e.id); story(L, e);
        if (p.media) p.media.pressure = Math.max(0, p.media.pressure - 10);
      }
    }
  }

  // ---------- stories: a headline plus native-format posts ----------
  const HEAD = {
    'media.day.first_impression_hype': ['{player} steals media day for the {team}', 'First look: {player} in {tposs} colors draws a crowd', '{player} makes a first impression at {tposs} media day'],
    'media.social.washed_slander': ['{player} media day photo sparks "washed" pile-on', '"Washed" takes swarm {player} after media day', 'Media day photo, decline debate: {platform} piles on {player}'],
    'media.social.washed_rebuttal': ['{tposs} fans push back on the {player} washed talk', 'The {player} defense arrives: supporters want evidence, not photos'],
    'media.day.fitness_change': ['{player} {change}', 'Media day measurements: {player} {change}'],
    'media.day.chemistry_body_language': ['Body-language readers dissect {tposs} {player} portrait', 'One photo, many theories: {player} at media day'],
    'media.social.bad_clip_pile_on': ['{player} clip ({clip}) goes around {platform}', 'Media day blooper: {platform} has fun with {player}'],
    'media.social.selective_edit_exposed': ['Full footage: the {player} media day clip left something out', 'Uncut video puts the viral {player} clip in context'],
    'media.social.fake_quote_corrected': ['Fake: {player} never said "{quote}"', 'Viral {player} quote graphic is fabricated, team says'],
    'media.social.player_response_backfire': ['{player} answers critics; it goes badly', '{pposs} response to media day jokes backfires'],
    'media.social.player_response_redeemed': ['{player} answers the media day jokes with a {line}', 'Who is washed? {player} responds with a {line}'],
    'media.social.unflattering_photo_reaction': ['{pposs} media day portrait is having a rough day online', '{pposs} media day photo ({look}) becomes a talking point', 'The internet has notes on {pposs} media day portrait'],
    'media.social.audience_split': ['{player} media day splits the internet', 'Love it or hate it: {pposs} media day look divides fans'],
    'media.social.old_clip_recycled': ['That viral {player} clip is from {date}', 'Old footage of {player} recirculates as new'],
    'media.social.unexpected_rival_support': ['{rival} defends {player} from the washed talk', 'Unexpected backup: {rival} speaks up for {player}'],
    'media.social.meme_to_charity': ['{pposs} media day meme raises {amountText} for {cause}', '{player} turns a meme into {amountText} for {cause}'],
    'media.social.pose_becomes_meme': ['{pposs} "{pose}" pose is the meme of media day', 'Everybody is recreating {pposs} media day pose'],
    'media.day.number_reveal_reaction': ['{player} will wear No. {number} for the {team}', 'No. {number}: {player} reveals his number at media day'],
    'media.day.new_team_jersey_debate': ['First look: {player} in a {team} uniform', '{player} in {team} colors takes some getting used to'],
    'media.day.rivals_group_photo': ['{player} and {rival} share a frame at {tposs} media day', 'Former rivals, same photo: {player} and {rival}'],
    'media.day.hairstyle_reveal': ['{player} debuts a new {look} at media day', 'New look: {player} goes with a {look}'],
  };
  // My own sharper posts (fan accounts and creators), added to the pack lines for the same key.
  const POSTS = {
    'media.social.washed_slander': [
      'media day {plast} looking like he coaches the second unit now',
      'not {player} posing like it is still the year he made first team',
      'bro took the media day photo and the photo took the rest of his prime',
      'the knees in this picture are older than me',
      '{player} at media day vs {player} in his prime. I miss him already',
      'he is smiling like his contract runs through 2031 (it might)',
      'washed is a strong word. I would say retired-adjacent',
      'that is not a media day photo, that is a jersey retirement rehearsal',
    ],
    'media.social.bad_clip_pile_on': [
      'I have watched the {plast} clip 40 times and it gets funnier',
      'this is going in the end-of-season blooper reel already',
      '{clip}. at MEDIA DAY. in front of every camera in the building',
    ],
    'media.social.pose_becomes_meme': [
      'everybody at my gym doing the {pose} now',
      'the {pose} is officially a template. go wild',
      'my dog did the {plast} pose better',
    ],
    'media.social.unflattering_photo_reaction': [
      'whoever edited the {plast} photo owes him an apology',
      'the lighting in the {plast} portrait should be illegal',
      'that photo was taken at 6 a.m. and you can tell',
    ],
    'media.day.new_team_jersey_debate': [
      '{player} in {team} colors still looks like a 2K edit',
      'I need a few weeks before {player} in this jersey stops looking fake',
      'ok {player} in this uniform actually works',
    ],
    'media.day.first_impression_hype': [
      'the {team} have a new face and it is {player}',
      '{player} media day fit is clean. that matters (it does not, but still)',
    ],
    'media.social.audience_split': ['half the replies love the {plast} look, half are already planning the roast', 'the {plast} photo is a personality test and the app is failing it', 'if you hate this photo you just do not like fun'],
    'media.social.player_response_backfire': ['he should have stayed off the app', 'responding to the comments was the real airball', '{plast} replied and now there are twice as many jokes'],
    'media.social.player_response_redeemed': ['who was calling {plast} washed? log off', '{line}. the comment section has gone very quiet', 'receipts posted. {plast} said it with the box score'],
    'media.day.number_reveal_reaction': ['No. {number} on {plast} looks right. jersey sales incoming', 'not No. {number} again. every rookie wants that number', '{plast} in No. {number} is a 2K cover'],
    'media.day.hairstyle_reveal': ['the {look} on {plast} is a choice. a brave one', '{plast} with the {look} is giving new contract energy'],
    'media.day.fitness_change': ['{plast} {change}. somebody found a nutritionist', 'best shape of his life season has officially started'],
    'media.day.chemistry_body_language': ['why does {plast} look like he just read the depth chart', 'arms crossed, no smile. we are reading way too much into this and I love it'],
    'media.social.old_clip_recycled': ['that clip is from {date}, relax', 'people posting a {date} clip like it happened this morning'],
    'media.social.fake_quote_corrected': ['yall fell for a fake quote again', 'if it is a quote graphic with no source, it is fake. every time'],
    'media.social.selective_edit_exposed': ['full clip is out and the edit was doing a LOT of work', 'whoever cut that clip should be banned from the app'],
    'media.social.washed_rebuttal': ['yall said the same thing two years ago and he dropped 40 on your team', 'one photo and the whole app turned scout. relax', 'he averaged real numbers last year. the photo did not play any minutes', 'call him washed after the season starts, not after a lighting guy did him dirty'],
    'media.social.unexpected_rival_support': ['even {rival} is defending him. that should end the discussion', '{rival} sticking up for {plast} was not on my bingo card'],
    'media.social.meme_to_charity': ['the meme raised {amountText}. best use of a bad photo ever', 'turning the roast into {amountText} for {cause} is elite'],
    'media.day.rivals_group_photo': ['{plast} and {rival} in the same photo is a crossover nobody expected', 'these two used to trade 40-point games. now they share a backdrop'],
  };
  const KIND = { // which composed visual each story uses
    'media.social.washed_slander': 'short', 'media.social.bad_clip_pile_on': 'short', 'media.social.pose_becomes_meme': 'short', 'media.social.old_clip_recycled': 'short',
    'media.social.player_response_redeemed': 'thumb', 'media.social.unflattering_photo_reaction': 'portrait', 'media.social.audience_split': 'thumb',
    'media.social.fake_quote_corrected': 'quote', 'media.day.first_impression_hype': 'portrait', 'media.day.new_team_jersey_debate': 'portrait', 'media.day.hairstyle_reveal': 'portrait',
    'media.day.number_reveal_reaction': 'portrait', 'media.day.rivals_group_photo': 'portrait', 'media.day.chemistry_body_language': 'portrait', 'media.day.fitness_change': 'portrait',
    'media.social.washed_rebuttal': 'thumb',
  };
  const THUMB_TEXT = {
    'media.social.washed_slander': ['WASHED?', 'IS IT OVER?', 'FELL OFF?'],
    'media.social.player_response_redeemed': ['NOT WASHED', 'HE HEARD YOU', 'RECEIPTS'],
    'media.social.audience_split': ['LOVE IT OR HATE IT', 'FANS DIVIDED'],
    'media.social.washed_rebuttal': ['STOP IT', 'NOT WASHED', 'RELAX'],
    'media.social.bad_clip_pile_on': ['OOPS', 'MEDIA DAY FAIL'],
    'media.social.pose_becomes_meme': ['THE POSE', 'NEW MEME'],
    'media.social.old_clip_recycled': ['OLD CLIP', 'NOT NEW'],
  };

  function ctxFor(L, e) {
    const d = e.data;
    const p = e.snap.players[e.players[0]] || { name: 'Unknown' };
    const t = L.teams[e.teams[0]];
    const c = { player: p.name, plast: last(p.name), pposs: poss(p.name), team: t ? t.name : '', tposs: t ? poss(t.name) : '' };
    for (const k of ['platform', 'clip', 'quote', 'line', 'look', 'pose', 'change', 'number', 'jersey', 'date', 'rival', 'cause', 'amountText', 'context']) if (d[k] != null) c[k] = d[k];
    if (d.amountText) c.amount = d.amountText;
    if (d.context) c.context = d.context;
    return c;
  }

  function story(L, e) {
    const head = HEAD[e.key];
    if (!head) return null;
    const c = ctxFor(L, e);
    const era = HL.mediaEra(L);
    const headline = M.line(L, e.key + '.headline', { ...c, era }, head);
    if (!headline) return null;
    const p = L.players[e.players[0]];
    const team = L.teams[e.teams[0]];
    // Native-format posts: pack lines and mine for the same situation, from creators, fans and haters.
    // One post in the creators' own voice (the ".take" key: my lines, plus any pack lines added for it),
    // the rest from the pack's measured voices for the same situation.
    const spicy = POSTS[e.key] && POSTS[e.key].length ? [['meme', e.key + '.take', POSTS[e.key]]] : [];
    const roles = e.key === 'media.social.washed_slander' || e.key === 'media.social.bad_clip_pile_on' || e.key === 'media.social.unflattering_photo_reaction' ? ['hater', 'homer'] : e.key.endsWith('rebuttal') || e.key.endsWith('redeemed') ? ['homer', 'stats'] : ['beat', 'homer'];
    const posts = [...spicy, ...roles.map(r => [r, e.key, []])].map(([role, sit, lines]) => HL.News.react(L, role, sit, c, lines, team, { hype: e.key.startsWith('media.social') ? 2.2 : 1.2 })).filter(Boolean);
    const thumbs = THUMB_TEXT[e.key];
    const visual = { kind: KIND[e.key] || 'portrait', asset: e.data.asset, platform: e.data.platform || null, title: thumbs ? R.pick(thumbs) : null, quote: e.data.quote || null, fabricated: !!e.data.fabricated, caption: posts[0] ? posts[0].text : headline, sound: `original sound - ${(posts[0] && posts[0].voice.handle) || 'clips'}`, counts: { likes: Math.round((e.data.washed_reactions || e.data.critical || e.data.remakes * 20 || e.data.positive_reactions || e.data.negative || e.data.supporters || 3000) * R.range(3, 9)), comments: 0, shares: 0 } };
    visual.counts.comments = Math.round(visual.counts.likes * R.range(0.03, 0.09));
    visual.counts.shares = Math.round(visual.counts.likes * R.range(0.01, 0.05));
    const importance = e.key === 'media.social.washed_slander' || e.key === 'media.social.player_response_redeemed' || (p && p.ovr >= 88) ? 2 : 1;
    return HL.News.push(L, { type: 'media', key: e.key, eventId: e.id, headline, teamIds: e.teams.slice(), playerIds: e.players.slice(), importance, reactions: posts, visual });
  }

  // The composition for a story (stored at media day).
  function portraitFor(L, assetId) {
    for (const s in L.mediaDays || {}) { const f = L.mediaDays[s].portraits.find(x => x.id === assetId); if (f) return f; }
    return null;
  }

  return { run, tick, afterGame, respond, noteSeries, portraitFor, OPTIONS, OPTION_TEXT, PLATFORMS, enabled };
})();
