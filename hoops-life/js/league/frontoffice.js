// Roster decisions for the Franchise hub. Money is stored in $M.
window.HL = window.HL || {};

HL.FrontOffice = (function () {
  const round = n => Math.round(n * 1e6) / 1e6;
  const active = p => p && !p.retired;
  const roster = (L, tid) => Object.values(L.players).filter(p => active(p) && p.teamId === tid);
  const team = (L, tid) => L.teams.find(t => t.id === tid);
  const healthy = ps => ps.filter(p => !p.injury || p.injury.games <= 0).length;
  const failure = (...reasons) => ({ ok: false, reasons, response: reasons.join(' ') });
  const manageable = L => L.userTeamId != null && !!team(L, L.userTeamId) && ['gm', 'owner'].includes(L.settings.role || 'gm');
  const money = n => n >= 1 ? `$${n.toFixed(1)}M` : `$${Math.round(n * 1000)}K`;

  // Approximate historical cap anchors; current value is the 2025-26 cap.
  // Exceptions/aprons/Bird rights are not modeled by this initial policy.
  const CAPS = [[1984, 3.6], [1990, 11.871], [1995, 23], [2000, 35.5], [2005, 49.5], [2010, 58.044], [2015, 70], [2020, 109.14], [2025, 154.647]];
  function capFor(L, year) {
    if (Number.isFinite(L.settings.salaryCap) && L.settings.salaryCap > 0) return L.settings.salaryCap;
    if (year < 1984) return null;
    if (year >= 2025) return round(154.647 * Math.pow(1.05, year - 2025));
    for (let i = 1; i < CAPS.length; i++) if (year <= CAPS[i][0]) {
      const [y0, v0] = CAPS[i - 1], [y1, v1] = CAPS[i];
      return round(v0 + (v1 - v0) * (year - y0) / (y1 - y0));
    }
    return 3.6;
  }
  const contractYear = L => L.phase === 'offseason' ? L.season + 1 : L.season;
  function salary(p, year) {
    if (p.extension && year >= p.extension.start && year <= p.extension.exp) return p.extension.amount;
    const c = p.contract;
    return c && year <= c.exp && year >= (c.start ?? -Infinity) ? c.amount : 0;
  }
  function finances(L, tid, year = L.season) {
    const ps = roster(L, tid);
    const salaries = ps.map(p => ({ pid: p.id, name: p.name, amount: salary(p, year), exp: p.extension && year >= p.extension.start ? p.extension.exp : p.contract.exp }));
    const dead = (L.deadCap || []).filter(d => d.teamId === tid && year >= d.start && year <= d.exp).reduce((n, d) => n + d.amount, 0);
    const salaryTotal = salaries.reduce((n, c) => n + c.amount, 0), cap = capFor(L, year);
    return { year, salaries, dead: round(dead), salaryTotal: round(salaryTotal), payroll: round(salaryTotal + dead), cap, room: cap == null ? null : round(cap - salaryTotal - dead), count: ps.length, healthy: healthy(ps) };
  }

  function tradeDeadline(L) {
    const d = new Date(Date.UTC(L.season + 1, 1, 1));
    while (d.getUTCDay() !== 4) d.setUTCDate(d.getUTCDate() + 1);
    return Math.round((d - HL.seasonStartDate(L.season)) / 86400000);
  }
  function permission(L, trading = false) {
    if (!manageable(L)) return 'Your role delegates roster decisions to the front office.';
    if (L.phase !== 'regular' && L.phase !== 'offseason') return 'Roster negotiations reopen in the offseason.';
    if (trading && L.phase === 'regular' && L.day > tradeDeadline(L)) return 'The trade deadline has passed. Talks reopen in the offseason.';
    return null;
  }

  function tradeValue(L, p, tid, leaving = []) {
    const t = team(L, tid), ps = roster(L, tid).filter(x => !leaving.includes(x.id)), games = t.w + t.l;
    const rebuilding = games >= 15 ? t.w / games < 0.42 : ps.slice().sort((a, b) => b.ovr - a.ovr).slice(0, 5).reduce((n, x) => n + x.ovr, 0) / 5 < 78;
    const youth = p.age < 26 ? 1 + (26 - p.age) * (rebuilding ? 0.045 : 0.025) : Math.max(0.55, 1 - Math.max(0, p.age - 30) * (rebuilding ? 0.045 : 0.025));
    const bestAtPos = Math.max(50, ...ps.filter(x => x.id !== p.id && x.pos === p.pos).map(x => x.ovr));
    const need = p.ovr > bestAtPos ? 1.08 : 1;
    const talent = Math.pow(Math.max(5, p.ovr - 45), 2) + Math.max(0, (p.potential || p.ovr) - p.ovr) * (rebuilding ? 18 : 8);
    const expected = Math.max(1e-6, HL.estimateSalary(p.ovr, p.age) * HL.salaryScale(contractYear(L)));
    const cost = Math.min(1.2, Math.max(0.75, 1 + (expected - salary(p, contractYear(L))) / expected * 0.12));
    return talent * youth * need * cost;
  }
  function tradePreview(L, deal) {
    const denied = permission(L, true); if (denied) return failure(denied);
    if (!deal || !Number.isInteger(deal.teamId) || deal.teamId === L.userTeamId || !team(L, deal.teamId)) return failure('Choose another team.');
    const { send, receive } = deal;
    if (![send, receive].every(ids => Array.isArray(ids) && ids.length >= 1 && ids.length <= 3 && ids.every(Number.isInteger))) return failure('Select one to three players on each side.');
    if (new Set([...send, ...receive]).size !== send.length + receive.length) return failure('Each player can appear only once in a trade.');
    if (!send.every(id => active(L.players[id]) && L.players[id].teamId === L.userTeamId) || !receive.every(id => active(L.players[id]) && L.players[id].teamId === deal.teamId)) return failure('This offer is stale: a selected player is no longer on that roster.');
    const ours = send.map(id => L.players[id]), theirs = receive.map(id => L.players[id]);
    if ([...ours, ...theirs].some(p => p.hardship)) return failure('Temporary hardship signings cannot be traded. Wait for a standard contract.');
    const reasons = [], year = contractYear(L), projections = [];
    for (const [tid, leaving, arriving] of [[L.userTeamId, ours, theirs], [deal.teamId, theirs, ours]]) {
      const current = roster(L, tid), updated = current.filter(p => !leaving.includes(p)).concat(arriving);
      if (updated.length > 15) reasons.push(`${team(L, tid).name} would exceed the 15-player roster limit.`);
      if (healthy(updated) < 5) reasons.push(`${team(L, tid).name} need at least five healthy players after the move.`);
      const f = finances(L, tid, year), out = leaving.reduce((n, p) => n + salary(p, year), 0), incoming = arriving.reduce((n, p) => n + salary(p, year), 0);
      const projected = round(f.payroll - out + incoming);
      const matching = out * 1.25 + 0.25 * HL.salaryScale(year);
      const limit = f.cap == null ? null : Math.max(f.cap - (f.payroll - out), matching);
      if (limit != null && incoming > limit + 1e-6) reasons.push(`${team(L, tid).name} can receive ${money(Math.max(0, limit))}; this package brings in ${money(incoming)}.`);
      projections.push({ teamId: tid, payroll: projected, outgoing: round(out), incoming: round(incoming), cap: f.cap });
    }
    const offered = ours.reduce((n, p) => n + tradeValue(L, p, deal.teamId, receive), 0);
    const requested = theirs.reduce((n, p) => n + tradeValue(L, p, deal.teamId), 0);
    const threshold = { rookie: 0.9, pro: 1, allstar: 1.08, hof: 1.16 }[L.settings.difficulty] || 1;
    const ratio = offered / Math.max(1, requested), accepted = !reasons.length && ratio >= threshold;
    const response = reasons.length ? reasons.join(' ') : accepted ? `We can work with that. ${ours.map(p => p.name).join(' and ')} gives us enough value for this deal.` : `We value ${theirs.map(p => p.name).join(' and ')} more than this return. Add a stronger player, a younger prospect, or address our positional needs.`;
    return { ok: !reasons.length, accepted, reasons, response, ratio, threshold, offered: round(offered), requested: round(requested), projections };
  }

  function resetRotation(L, tid) {
    const t = team(L, tid);
    t.strategy = { ...HL.DEFAULT_STRATEGY(), ...t.strategy, starters: null, minutes: null, closers: null };
  }
  function record(L, facts) {
    L.transactions = L.transactions || [];
    const entry = { ...facts, id: (L.transactionSeq = (L.transactionSeq || L.transactions.length) + 1), season: L.season, day: L.day, phase: L.phase };
    L.transactions.push(entry);
    if (HL.News) {
      const t = team(L, facts.teamId), p = L.players[facts.playerIds[0]], era = HL.eraForSeason(L.season);
      let headline, body, rx;
      if (facts.kind === 'trade') {
        const other = team(L, facts.otherTeamId), names = facts.receive.map(id => L.players[id].name).join(' and '), assets = facts.send.map(id => L.players[id].name).join(' and ');
        headline = `${t.name} acquire ${names} from ${other.name}`;
        body = `${t.city} receive ${names}; ${other.city} receive ${assets}. Both teams will rebuild their rotations.`;
        const c = { team: t.name, opp: other.name, player: names, assets };
        rx = [HL.News.react(L, 'insider', 'trade.headline', c, ['{team} and {opp} agree to a deal: {player} for {assets}.'], t), HL.News.react(L, 'homer', 'trade.react.winner_fan', c, ['A new chapter for the {team}. Let us see how {player} fits.'], t)];
      } else {
        const c = { team: t.name, player: p.name, years: facts.years, amount: money(facts.amount || 0) };
        headline = facts.kind === 'waiver' ? `${t.name} waive ${p.name}` : facts.kind === 'extension' ? `${p.name} agrees to extension with ${t.name}` : `${t.name} sign ${p.name}`;
        body = facts.kind === 'waiver' ? `${p.name} enters free agency. Guaranteed salary remains on the ${t.name} payroll through ${facts.through + 1}.` : `${facts.years} year${facts.years === 1 ? '' : 's'} at ${money(facts.amount)} per season, starting in ${facts.start}-${String(facts.start + 1).slice(2)}.`;
        rx = [HL.News.react(L, 'insider', facts.kind === 'extension' ? 'extension' : facts.kind === 'waiver' ? 'waived' : 'signing.react.hype', c, ['The {team} front office confirms its decision on {player}.'], t), { voice: { outlet: `${p.name}, player`, kind: 'player' }, format: era === 'modern' ? 'social' : 'print', likes: 0, text: facts.kind === 'waiver' ? 'I am looking for my next opportunity.' : facts.kind === 'extension' ? 'I am glad we have a plan for the next chapter here.' : 'I am ready to earn my place in the rotation.' }];
      }
      HL.News.push(L, { type: 'transaction', importance: p.ovr >= 85 ? 3 : 2, headline, body, playerIds: facts.playerIds.slice(), teamIds: facts.kind === 'trade' ? [facts.teamId, facts.otherTeamId] : [facts.teamId], transaction: entry, reactions: rx.filter(Boolean) });
    }
    if (HL.World) HL.World.onTransaction(L, entry);
    return entry;
  }
  function trade(L, deal) {
    const preview = tradePreview(L, deal);
    if (!preview.ok || !preview.accepted) return { ...preview, ok: false };
    for (const [ids, tid] of [[deal.send, deal.teamId], [deal.receive, L.userTeamId]]) for (const id of ids) {
      L.players[id].teamId = tid; L.players[id].userRosterMove = true;
    }
    resetRotation(L, L.userTeamId); resetRotation(L, deal.teamId);
    const transaction = record(L, { kind: 'trade', teamId: L.userTeamId, otherTeamId: deal.teamId, send: deal.send.slice(), receive: deal.receive.slice(), playerIds: [...deal.receive, ...deal.send] });
    return { ok: true, reasons: [], transaction };
  }
  function findTrades(L, send) {
    if (permission(L, true) || !Array.isArray(send) || !send.length || !send.every(id => Number.isInteger(id) && active(L.players[id]) && L.players[id].teamId === L.userTeamId)) return [];
    const offers = [];
    for (const t of L.teams.filter(t => t.id !== L.userTeamId)) {
      for (const p of roster(L, t.id)) {
        const d = { teamId: t.id, send: send.slice(), receive: [p.id] }, q = tradePreview(L, d);
        if (q.accepted) offers.push({ ...d, targetValue: tradeValue(L, p, L.userTeamId), response: q.response });
      }
    }
    return offers.sort((a, b) => b.targetValue - a.targetValue).slice(0, 12);
  }

  function quote(L, pid, kind = 'signing') {
    const p = L.players[pid], denied = permission(L);
    if (denied) return failure(denied);
    if (!Number.isInteger(pid) || !active(p)) return failure('This player is not available.');
    if (kind === 'extension' && p.hardship) return failure('Temporary hardship contracts cannot be extended. Negotiate a standard deal if he enters free agency.');
    if (kind === 'extension' ? p.teamId !== L.userTeamId || p.extension || p.contract.exp > L.season + 1 : p.teamId != null) return failure(kind === 'extension' ? 'Extensions are available in the final two seasons of a contract, once per deal.' : 'This player is already under contract.');
    const year = kind === 'extension' ? p.contract.exp + 1 : contractYear(L), minimum = round(1.2 * HL.salaryScale(year));
    const ps = roster(L, L.userTeamId), rank = ps.filter(x => x.ovr > p.ovr).length;
    const role = rank < 5 ? 'Starter' : rank < 9 ? 'Rotation' : 'Reserve';
    const t = team(L, L.userTeamId), games = t.w + t.l;
    const winning = games ? t.w / games : 0.5;
    const demand = (p.traits && p.traits.greed || 50) / 100;
    const opportunity = role === 'Starter' ? 0.95 : role === 'Reserve' && p.ovr >= 75 ? 1.15 : 1;
    const market = p.ovr < 65 ? minimum : HL.estimateSalary(p.ovr, p.age) * HL.salaryScale(year);
    const trust = L.world?.players[pid]?.trust ?? 50;
    const ask = p.ovr < 65 ? minimum : round(Math.max(minimum, market * (0.95 + demand * 0.1) * opportunity * (1 + (0.5 - winning) * 0.12) * (1 + (50 - trust) / 500)));
    return { ok: true, reasons: [], ask, minimum, role, start: year, maximumYears: 4, response: `I see a ${role.toLowerCase()} opportunity here. I am looking for at least ${money(ask)} a season.` };
  }
  function negotiate(L, pid, amount, years, kind) {
    const q = quote(L, pid, kind); if (!q.ok) return q;
    if (!Number.isFinite(amount) || amount <= 0 || !Number.isInteger(years) || years < 1 || years > 4) return failure('Offer a positive annual salary and one to four whole years.');
    if (amount + 1e-6 < q.minimum) return failure(`The league minimum is ${money(q.minimum)}.`);
    if (amount + 1e-6 < q.ask) return failure(`That offer is below my asking price of ${money(q.ask)}. We can talk again with a stronger offer.`);
    const p = L.players[pid], exp = q.start + years - 1;
    if (kind === 'signing' && roster(L, L.userTeamId).length >= 15) return failure('Your 15-player roster is full. Trade or waive a player first.');
    // The minimum exception applies to a new signing; extensions retain their player's rights.
    if (kind === 'signing') {
      const f = finances(L, L.userTeamId, q.start);
      if (f.cap != null && f.payroll + amount > f.cap + 1e-6 && amount > q.minimum + 1e-6) return failure(`You have ${money(Math.max(0, f.room))} in cap room. Over the cap, only a league-minimum signing is available under this policy.`);
      p.teamId = L.userTeamId; p.contract = { amount: round(amount), start: q.start, exp }; p.extension = null; p.hardship = false;
      resetRotation(L, L.userTeamId);
    } else {
      p.extension = { amount: round(amount), start: q.start, exp };
    }
    p.userRosterMove = true;
    const transaction = record(L, { kind, teamId: L.userTeamId, playerIds: [pid], amount: round(amount), years, start: q.start, through: exp });
    return { ok: true, reasons: [], transaction };
  }
  const sign = (L, pid, amount, years) => negotiate(L, pid, amount, years, 'signing');
  const extend = (L, pid, amount, years) => negotiate(L, pid, amount, years, 'extension');
  function waive(L, pid) {
    const denied = permission(L); if (denied) return failure(denied);
    const p = L.players[pid];
    if (!Number.isInteger(pid) || !active(p) || p.teamId !== L.userTeamId) return failure('This player is no longer on your roster.');
    if (healthy(roster(L, L.userTeamId).filter(x => x !== p)) < 5) return failure('Keep at least five healthy players on the roster.');
    L.deadCap = L.deadCap || [];
    if (p.contract.exp >= L.season) L.deadCap.push({ teamId: p.teamId, pid, name: p.name, amount: p.contract.amount, start: Math.max(L.season, p.contract.start ?? L.season), exp: p.contract.exp });
    if (p.extension) L.deadCap.push({ teamId: p.teamId, pid, name: p.name, ...p.extension });
    const through = p.extension ? p.extension.exp : p.contract.exp;
    p.teamId = null; p.extension = null; p.userRosterMove = false;
    resetRotation(L, L.userTeamId);
    const transaction = record(L, { kind: 'waiver', teamId: L.userTeamId, playerIds: [pid], through });
    return { ok: true, reasons: [], transaction };
  }
  function rollover(L, season, next) {
    L.deadCap = (L.deadCap || []).filter(d => d.exp >= next);
    for (const p of Object.values(L.players)) if (active(p) && p.teamId != null && p.extension && p.extension.start <= next) {
      p.contract = { ...p.extension }; p.extension = null;
    }
  }
  return { finances, tradeDeadline, tradePreview, trade, findTrades, quote, sign, extend, waive, rollover, roster };
})();
