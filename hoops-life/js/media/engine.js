// Media grammar engine: situational templates + large fragment pools + anti-repeat memory.
// Every output is assembled from the actual situation (names, numbers, streaks, history),
// so the same line only reappears if the same thing happens again.
window.HL = window.HL || {};

HL.Media = (function () {
  const R = HL.RNG;

  // Fictional outlets & voices (styles modeled on real basketball media, no real people).
  const VOICES = {
    wire:     { outlet: 'Hoops Wire', handle: '@HoopsWire', kind: 'headline' },
    insider:  { outlet: 'Marcus Vale', handle: '@MarcusValeNBA', kind: 'insider' },
    debate:   { outlet: 'Full Court Fire', handle: '@FullCourtFire', kind: 'hot take' },
    stats:    { outlet: 'Possession Lab', handle: '@PossessionLab', kind: 'analytics' },
    beat:     { outlet: '{city} Courier', handle: '@{abbr}Courier', kind: 'beat writer' },
    oldhead:  { outlet: 'Big Al Turner (ret.)', handle: '@BigAlTurner', kind: 'ex-player' },
    memes:    { outlet: 'Hoop Memes', handle: '@HoopMemesHQ', kind: 'meme' },
    homer:    { outlet: '{name} Faithful', handle: '@{abbr}Faithful', kind: 'fan' },
    hater:    { outlet: 'Ratio King', handle: '@RatioKing23', kind: 'fan' },
    odds:     { outlet: 'Sharp Line', handle: '@SharpLineHoops', kind: 'odds' },
    pod:      { outlet: 'The Corner Three Pod', handle: '@Corner3Pod', kind: 'podcast' },
  };

  // Fragment pools. Keep adding: every new entry multiplies the possible outputs.
  const P = {
    beat: ['beat', 'took down', 'handled', 'got past', 'outlasted', 'knocked off', 'dispatched', 'took care of', 'edged', 'held off', 'topped', 'downed', 'outdueled', 'put away', 'survived'],
    crush: ['crushed', 'demolished', 'routed', 'embarrassed', 'steamrolled', 'blew out', 'dismantled', 'humiliated', 'ran past', 'pummeled', 'buried', 'flattened', 'torched', 'overwhelmed'],
    edge: ['edged', 'escaped', 'squeaked past', 'survived', 'held on against', 'snuck past', 'outlasted', 'clipped', 'nipped', 'got by'],
    big: ['monster', 'massive', 'huge', 'ridiculous', 'absurd', 'vintage', 'stat-sheet-stuffing', 'career-type', 'video-game', 'jaw-dropping', 'scorching', 'nuclear', 'surgical', 'heroic', 'outrageous'],
    scored: ['dropped', 'poured in', 'piled up', 'put up', 'erupted for', 'exploded for', 'racked up', 'hung', 'went off for', 'torched them for', 'unloaded', 'tallied', 'carved out', 'cooked them for'],
    night: ['night', 'performance', 'outing', 'showing', 'game', 'evening', 'display', 'masterclass', 'clinic', 'eruption'],
    opener: ['Let me be very clear:', 'I said it before and I will say it again:', 'Hear me out.', 'Nobody wants to admit this, but', 'Here is the truth:', 'I am not overreacting when I say', 'Write this down:', 'Mark my words:', 'I need everybody to calm down, because', 'Real ones already knew:', 'Let us be honest with ourselves.', 'Respectfully,', 'With all due respect,', 'I hate to be that guy, but', 'Somebody had to say it:'],
    hype: ['is HIM', 'is that dude', 'is different', 'is built for this', 'cannot be guarded right now', 'is on a mission', 'is playing like an MVP', 'is the problem', 'has the league on notice', 'is a walking bucket', 'just reminded everybody', 'is in his bag', 'is not human'],
    doubt: ['is not a real contender', 'is fool\'s gold', 'is going to fold in April', 'has no clue in the clutch', 'is overrated and I will die on this hill', 'is a regular-season merchant', 'is wasting everybody\'s time', 'has a ceiling and we are looking at it', 'does not scare anybody', 'needs a reality check'],
    emoji_hype: ['🔥', '😤', '🐐', '👀', '🚨', '💯', '🤯', '🥶', '⚡', '🏀'],
    emoji_sad: ['💀', '😭', '🤡', '😬', '🫠', '📉', '🗑️', '🥴', '😴'],
    stat_open: ['The numbers do not lie:', 'Per our tracking,', 'Quick note:', 'Context matters here:', 'Worth flagging:', 'Interesting split:', 'Fun fact:', 'For the record,', 'Data point:', 'Under the hood,'],
    old_open: ['Back in my day', 'When I played', 'In the 90s', 'Where I come from', 'Old school rules:', 'Let me tell you something, young fella:'],
    old_close: ['we would have put him on the floor.', 'that would not fly.', 'you earned your respect.', 'nobody got easy buckets.', 'you had to bleed for a bucket.', 'hand-checking would have fixed that.', 'that is a 12-point game, tops.'],
    sources: ['Sources:', 'Sources tell me:', 'League sources say', 'Per sources,', 'Story developing:', 'Breaking:', 'BREAKING:', 'Hearing that'],
    team_mood_good: ['the vibes are immaculate', 'the locker room is buzzing', 'confidence is sky-high', 'everybody is eating', 'this group believes'],
    team_mood_bad: ['frustration is boiling over', 'the locker room is tense', 'nobody is looking at each other', 'patience is running out', 'something has to give'],
    injury_sad: ['Brutal news.', 'Tough break.', 'Gut punch.', 'Awful timing.', 'Not what anybody wanted.', 'Devastating.', 'Bad news on the injury front.', 'Ugh.'],
    streak_w: ['rolling', 'red-hot', 'on a heater', 'scorching', 'unstoppable lately', 'surging', 'on a tear', 'cooking'],
    streak_l: ['in freefall', 'reeling', 'ice cold', 'spiraling', 'sinking', 'stuck in the mud', 'in crisis mode', 'collapsing'],
  };

  // ---------- memory / anti-repeat ----------
  function mem(L) {
    L.mediaMem = L.mediaMem || { t: [], f: {} };
    return L.mediaMem;
  }
  function pickFresh(L, poolName, arr) {
    const m = mem(L);
    const recent = m.f[poolName] = m.f[poolName] || [];
    const fresh = arr.filter(x => !recent.includes(x));
    const choice = R.pick(fresh.length ? fresh : arr);
    recent.push(choice);
    const keep = Math.max(1, Math.floor(arr.length * 0.6));
    while (recent.length > keep) recent.shift();
    return choice;
  }
  function frag(L, name) { return pickFresh(L, name, P[name]); }

  // Choose a template among those whose condition matches, avoiding recently used ones.
  function choose(L, templates, c) {
    const m = mem(L);
    const ok = templates.filter(t => !t.when || t.when(c));
    const fresh = ok.filter(t => !m.t.includes(t.id));
    const pick = R.weighted(fresh.length ? fresh : ok, t => t.w || 1);
    if (!pick) return null;
    m.t.push(pick.id);
    while (m.t.length > 60) m.t.shift();
    return pick;
  }

  function voiceInfo(key, team) {
    const v = Object.assign({}, VOICES[key] || VOICES.wire);
    if (team) for (const k of ['outlet', 'handle']) v[k] = v[k].replace('{city}', team.city).replace('{abbr}', team.abbr).replace('{name}', team.name);
    v.key = key;
    return v;
  }

  return {
    P, VOICES, frag, choose, voiceInfo, pickFresh,
    // Expose for adding content packs.
    addFragments(pool, items) { P[pool] = (P[pool] || []).concat(items); },
  };
})();
