// Persistent relationships and follow-ups grounded in decisions and actual games.
window.HL = window.HL || {};

HL.World = (function () {
  const clamp = v => HL.clamp(Math.round(v), 0, 100);
  const stamp = L => `${L.season}:${L.day}`;
  const fresh = () => ({ like: 50, respect: 50, trust: 50, memories: [], lastMeeting: null });
  const relationship = (L, pid) => L.world?.players[pid] || fresh();
  const teamMood = (L, tid) => L.world?.teams[tid] || { fans: 50, owner: 50, memories: [] };
  function world(L) {
    if (!L.world) L.world = { players: {}, teams: {}, watches: [], timeline: [] };
    return L.world;
  }
  function person(L, pid) { const w = world(L); return w.players[pid] || (w.players[pid] = fresh()); }
  function club(L, tid) { const w = world(L); return w.teams[tid] || (w.teams[tid] = { fans: 50, owner: 50, memories: [] }); }
  function memory(L, target, kind, text, delta = {}) {
    for (const k of ['like', 'respect', 'trust', 'fans', 'owner']) if (delta[k]) target[k] = clamp(target[k] + delta[k]);
    const entry = { season: L.season, day: L.day, kind, text, delta };
    target.memories.push(entry); target.memories = target.memories.slice(-24);
    const w = world(L); w.timeline.push(entry); w.timeline = w.timeline.slice(-300);
  }
  function morale(p, delta) { p.morale = clamp((p.morale ?? 70) + delta); }
  function story(L, p, headline, body, quote, kind, gid) {
    const t = L.teams.find(t => t.id === p.teamId) || L.teams.find(t => t.id === L.userTeamId);
    const era = HL.mediaEra ? HL.mediaEra(L) : HL.eraForSeason(L.season);
    return HL.News.push(L, { type: 'people', importance: 2, key: kind, headline, body, gid, playerIds: [p.id], teamIds: [t.id],
      reactions: [{ voice: { outlet: `${p.name}, player`, kind: 'player' }, format: era === 'modern' ? 'social' : 'print', likes: 0, reposts: 0, text: quote },
        HL.News.react(L, 'beat', kind, { player: p.name, team: t.name }, ['The {team} have more than a box score to manage. The relationship with {player} matters.'], t, { eraBuiltins: ['The handling of {player} has become a matter of discussion around the {team} dressing room.'] })].filter(Boolean) });
  }
  const ACTIONS = {
    support: { label: 'Offer support', desc: 'Listen to his concerns. Build trust without making a promise.' },
    challenge: { label: 'Challenge his effort', desc: 'Demand more. A driven player may respect it; a proud player may take it personally.' },
    promiseMinutes: { label: 'Promise a bigger role', desc: 'Promise at least 24 minutes per game across his next three team games. Your actual rotation must deliver.' },
    dismiss: { label: 'Dismiss his concerns', desc: 'Shut down the conversation. Expect a hit to trust and possible public criticism.' },
  };
  function meet(L, pid, action) {
    const p = L.players[pid];
    if (!ACTIONS[action] || !Number.isInteger(pid) || !p || p.retired || p.teamId !== L.userTeamId) return { ok: false, response: 'Choose an active player on your team and an available conversation.' };
    const r = relationship(L, pid);
    if (r.lastMeeting === stamp(L)) return { ok: false, response: 'Give him time to process this conversation. Speak again on another day.' };
    if (action === 'promiseMinutes' && L.world?.watches.some(w => w.kind === 'minutesPromise' && w.pid === pid && !w.resolved)) return { ok: false, response: 'Your current promise is still being judged. Deliver on it before making another.' };
    const saved = person(L, pid); saved.lastMeeting = stamp(L);
    let response;
    if (action === 'support') {
      memory(L, saved, action, 'You offered support and listened to his concerns.', { like: 5, trust: 4 }); morale(p, 6);
      response = 'I appreciate you listening. That means more than another speech.';
    } else if (action === 'challenge') {
      const driven = (p.traits?.workEthic ?? 50) >= 60 && (p.traits?.ego ?? 50) < 75;
      memory(L, saved, action, `You challenged his effort; he ${driven ? 'accepted the challenge' : 'felt singled out'}.`, { respect: driven ? 5 : -2, trust: driven ? 1 : -5 }); morale(p, driven ? 4 : -6);
      response = driven ? 'Fair. Hold me to it. I will show you at practice and in the game.' : 'Calling me out like that does not help. We need a better conversation.';
    } else if (action === 'promiseMinutes') {
      memory(L, saved, action, 'You promised at least 24 minutes per game over his next three team games.', { trust: 2 });
      world(L).watches.push({ kind: 'minutesPromise', pid, teamId: p.teamId, target: 24, games: 0, minutes: 0, pts: 0, wins: 0, seen: [], season: L.season });
      response = 'Twenty-four minutes a night. I will remember that. Let us see the rotation.';
    } else {
      memory(L, saved, action, 'You dismissed his concerns instead of hearing him out.', { like: -8, trust: -10, respect: -3 }); morale(p, -10);
      response = 'I wanted a real conversation. Now I know where I stand.';
      story(L, p, `${p.name} questions communication with ${L.teams.find(t => t.id === p.teamId).name}`, `${p.name} says his concerns were dismissed in a meeting. The conversation affects his trust and morale.`, response, 'people.communication');
    }
    return { ok: true, response, relationship: saved };
  }
  function onTransaction(L, tx) {
    const t = L.teams.find(t => t.id === tx.teamId), mood = club(L, t.id), news = L.news.at(-1);
    const received = (tx.receive || tx.playerIds).map(id => L.players[id]).filter(Boolean);
    const sent = (tx.send || []).map(id => L.players[id]).filter(Boolean);
    const names = received.map(p => p.name).join(' and ');
    if (tx.kind === 'trade') {
      const leader = sent.find(p => p.ovr >= 85);
      const improvement = Math.max(...received.map(p => p.ovr)) - Math.max(...sent.map(p => p.ovr));
      memory(L, mood, 'trade', `The front office traded ${sent.map(p => p.name).join(' and ')} for ${names}.`, { fans: improvement >= 0 ? 5 : -7, owner: improvement >= 0 ? 3 : -2 });
      for (const p of received) { memory(L, person(L, p.id), 'arrival', `You brought him to the ${t.name}.`, { trust: 3 }); morale(p, 4); }
      for (const p of sent) memory(L, person(L, p.id), 'departure', `You traded him away from the ${t.name}.`, { trust: -6 });
      if (leader) for (const p of Object.values(L.players).filter(p => !p.retired && p.teamId === t.id && !received.includes(p))) {
        memory(L, person(L, p.id), 'teammate_departure', `He watched teammate ${leader.name} leave in a trade.`, { trust: -3 }); morale(p, -4);
      }
    } else if (tx.kind === 'waiver') {
      const p = received[0]; memory(L, person(L, p.id), 'waiver', `You waived him from the ${t.name}.`, { trust: -8 }); morale(p, -8);
      memory(L, mood, 'waiver', `${p.name} was waived; his guaranteed salary stays on the payroll.`, { fans: p.ovr >= 80 ? -8 : -1, owner: -2 });
    } else {
      const p = received[0]; memory(L, person(L, p.id), tx.kind, `You ${tx.kind === 'extension' ? 'extended his contract' : 'signed him'} with the ${t.name}.`, { like: 4, trust: 5 }); morale(p, 6);
      memory(L, mood, tx.kind, `${p.name} agreed to ${tx.years} years at ${tx.amount.toFixed(3)}M per season.`, { fans: p.ovr >= 80 ? 6 : 2, owner: 1 });
    }
    if (tx.kind === 'trade' || tx.kind === 'signing') for (const p of received) world(L).watches.push({ kind: 'newArrival', pid: p.id, teamId: t.id, transactionId: tx.id, games: 0, minutes: 0, pts: 0, wins: 0, seen: [], season: L.season });
    if (news?.transaction?.id === tx.id) {
      news.reactions.push({ voice: { outlet: `${t.city} ownership`, kind: 'owner' }, format: 'print', likes: 0, reposts: 0, text: tx.kind === 'waiver' ? 'The roster spot is open, but the guaranteed salary is still our responsibility.' : tx.kind === 'extension' ? `We committed to ${names}. We expect this relationship to last beyond one good season.` : `We made this move for a reason. We will judge the fit after ${names} has played, not at the announcement.` });
      news.reactions.push(HL.News.react(L, 'homer', 'people.transaction.fan', { player: names, team: t.name }, ['The {team} changed our roster. I want to see how {player} fits before celebrating.'], t, { eraBuiltins: ['Supporters of the {team} await the first appearance of {player} before passing judgment on the decision.'] }));
      news.reactions = news.reactions.filter(Boolean);
    }
  }
  function afterGame(L, g, res) {
    if (!L.world) return;
    for (const w of L.world.watches) {
      if (w.resolved) continue;
      const p = L.players[w.pid];
      if (!p || p.retired || p.teamId !== w.teamId) { w.resolved = true; w.cancelled = 'Player left the team'; continue; }
      const side = [res.home, res.away].find(s => s.teamId === w.teamId);
      if (!side) continue;
      const gameKey = `${L.season}:${g.gid}`;
      if (w.seen.includes(gameKey)) continue;
      w.seen.push(gameKey); w.games++;
      const s = side.box[w.pid]; w.minutes += s?.min || 0; w.pts += s?.pts || 0;
      const opp = side === res.home ? res.away : res.home; if (side.score > opp.score) w.wins++;
      if (w.games < 3) continue;
      w.resolved = true;
      const r = person(L, p.id), avgMin = w.minutes / w.games, avgPts = w.pts / w.games;
      if (w.kind === 'minutesPromise') {
        const kept = avgMin >= w.target;
        memory(L, r, 'promise_result', `You ${kept ? 'kept' : 'broke'} the minutes promise: ${avgMin.toFixed(1)} per game across ${w.games} team games.`, { trust: kept ? 7 : -12, respect: kept ? 3 : -4 }); morale(p, kept ? 5 : -8);
        story(L, p, kept ? `${p.name}: ${L.teams.find(t => t.id === w.teamId).name} keeps its promise` : `${p.name} calls out a broken minutes promise`, `${avgMin.toFixed(1)} minutes per game across ${w.games} team games, against a promised ${w.target}. Did-not-play games count.`, kept ? 'They said I would get an opportunity, and they delivered.' : 'I was told I would get a bigger role. The rotation tells a different story.', 'people.minutes_promise', g.gid);
      } else {
        const promising = w.wins >= 2 || avgPts >= 18;
        const t = L.teams.find(t => t.id === w.teamId);
        memory(L, club(L, t.id), 'arrival_verdict', `${p.name}: ${avgPts.toFixed(1)} points and ${avgMin.toFixed(1)} minutes per game; team ${w.wins}-${w.games - w.wins} since arrival.`, { fans: promising ? 4 : -3, owner: promising ? 2 : -2 });
        story(L, p, `${p.name}: ${promising ? 'early returns encourage' : 'questions remain for'} ${t.name}`, `${avgPts.toFixed(1)} points and ${avgMin.toFixed(1)} minutes per game across his first ${w.games} team games. The ${t.name} went ${w.wins}-${w.games - w.wins}.`, promising ? 'It is only the start, but I feel the fit taking shape.' : 'We have work to do. Judge the whole adjustment, not one clip.', 'people.arrival_verdict', g.gid);
      }
    }
    L.world.watches = L.world.watches.filter(w => !w.resolved || L.season <= w.season + 1).slice(-200);
  }
  return { ACTIONS, relationship, teamMood, meet, onTransaction, afterGame };
})();
