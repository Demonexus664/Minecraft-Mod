// Saved draft classes, private scouting and draft night. All inspections are read-only.
window.HL = window.HL || {};
HL.DraftRoom = (function () {
  const R = HL.RNG, fail = reason => ({ ok: false, reason });
  const manager = L => L.userTeamId != null && L.settings.role !== 'coach';
  const available = d => d.prospects.filter(p => !d.selections.some(s => s.pid === p.id));
  const current = L => L.draftRoom?.slots[L.draftRoom.selections.length] || null;
  const prospect = (L, pid) => L.draftRoom?.prospects.find(p => p.id === pid);
  function prepare(L) {
    const year = L.season + 1;
    if (L.draftRoom?.year === year) return { ok: true, room: L.draftRoom };
    const historical = L.settings.history === 'real' && HL.HISTORY.seasons.includes(String(year));
    if (historical && !HL.HISTORY_SEASONS[String(year)]) return fail('Load the upcoming historical season before preparing its class.');
    const existing = new Set(Object.values(L.players).map(p => p.hid).filter(Boolean));
    const rows = historical ? HL.History.seasonRows(String(year)) : null;
    const pool = historical ? rows.filter(row => {
      const draft = HL.HISTORY.drafts[row.pid]; return draft && draft[0] === year && draft[1] > 0 && !existing.has(row.pid);
    }).map(row => {
      const p = HL.History.makePlayer(row, year, null);
      p.realAttrs = { ...p.attrs }; p.yearsPro = 0;
      p.consensus = HL.HISTORY.drafts[row.pid][1];
      p.prospect = { year, college: HL.HISTORY.drafts[row.pid][3] || p.college || 'International / high school' };
      return p;
    }) : HL.Draft.generateClass(year, Math.max(70, L.teams.length * (year >= 1989 ? 2 : 3)));
    pool.sort((a, b) => historical ? a.consensus - b.consensus : (b.ovr * .6 + b.potential * .4) - (a.ovr * .6 + a.potential * .4));
    pool.forEach((p, i) => { p.boardRank = i + 1; });
    L.draftRoom = { year, historical, stage: 'scouting', sessions: 12, reports: {}, shortlist: [], prospects: pool, slots: [], selections: [], lottery: null, revealed: 0 };
    L.nextPid = HL.nextPlayerId();
    return { ok: true, room: L.draftRoom };
  }
  function offset(year, pid, key) {
    let h = 2166136261;
    for (const c of `${year}:${pid}:${key}`) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
    return (h % 2001) / 1000 - 1;
  }
  function report(L, pid) {
    const d = L.draftRoom, p = prospect(L, pid);
    if (!p) return null;
    const r = d.reports[pid] || { notes: [], workout: false, interview: false };
    const spread = r.workout ? 3 : 8;
    const range = (value, key, width) => {
      const center = value + offset(d.year, pid, key) * width * .7;
      return [Math.round(HL.clamp(center - width, 25, 99)), Math.round(HL.clamp(center + width, 25, 99))];
    };
    const strengths = HL.ATTRS.filter(a => !['dur','stam'].includes(a.key)).slice().sort((a, b) => p.attrs[b.key] - p.attrs[a.key]).slice(0, 2).map(a => a.label);
    const concerns = HL.ATTRS.filter(a => !['dur','stam'].includes(a.key)).slice().sort((a, b) => p.attrs[a.key] - p.attrs[b.key]).slice(0, 2).map(a => a.label);
    return { ability: range(p.ovr, 'ability', spread), ceiling: range(p.potential, 'ceiling', r.workout ? 7 : 12), strengths, concerns,
      personality: r.interview ? { workEthic: range(p.traits.workEthic, 'work', 5), ego: range(p.traits.ego, 'ego', 5) } : null,
      notes: r.notes, workout: r.workout, interview: r.interview };
  }
  function scout(L, pid, kind) {
    const d = L.draftRoom, p = prospect(L, pid);
    if (!manager(L)) return fail('The front office handles scouting in Coach mode.');
    if (!p || !['workout','interview'].includes(kind) || !['scouting','lottery'].includes(d.stage)) return fail('Choose an available prospect before draft night.');
    if (d.reports[pid]?.[kind]) return fail('That evaluation is already in your report.');
    if (d.sessions <= 0) return fail('All 12 scouting sessions are used.');
    const r = d.reports[pid] || (d.reports[pid] = { notes: [], workout: false, interview: false });
    r[kind] = true; d.sessions--;
    const note = kind === 'workout' ? `Private evaluation: ${report(L, pid).strengths.join(' and ')} stood out. Ability estimates narrowed; potential remains uncertain.` : (p.traits.workEthic >= 65 ? 'Interview: he describes a disciplined practice routine and asks how he can earn his role.' : p.traits.ego >= 70 ? 'Interview: he wants a prominent role and believes he should play immediately.' : 'Interview: he wants a clear development plan and honest communication about his role.');
    r.notes.push({ season: L.season, day: L.day, kind, text: note });
    return { ok: true, report: report(L, pid) };
  }
  function shortlist(L, pid) {
    const d = L.draftRoom;
    if (!manager(L) || !prospect(L, pid) || d.stage === 'complete') return fail('Choose a prospect while your front office is preparing or drafting.');
    const i = d.shortlist.indexOf(pid);
    if (i < 0) d.shortlist.push(pid); else d.shortlist.splice(i, 1);
    return { ok: true };
  }
  function lottery(L) {
    const d = L.draftRoom;
    if (!d || L.phase !== 'offseason') return fail('The lottery opens after the postseason.');
    if (d.lottery) return { ok: true, lottery: d.lottery };
    // One saved seeded tie-break, used in both rounds.
    const base = R.shuffle(L.teams.slice()).sort((a, b) => a.w / Math.max(1,a.w+a.l) - b.w / Math.max(1,b.w+b.l));
    const field = Object.values(L.playoffs?.field || {}).flat();
    const non = base.filter(t => !field.includes(t.id)), playoff = base.filter(t => field.includes(t.id));
    const year = d.year;
    let entries = [], top = [], format = 'reverse', drawn = 0;
    if (year >= 1985) {
      format = year < 1990 ? 'equal' : 'weighted';
      const weights = year >= 2019 ? [140,140,140,125,105,90,75,60,45,30,20,15,10,5] : [250,199,156,119,88,63,43,28,17,11,8,7,6,5];
      entries = non.map((t, i) => ({ teamId: t.id, weight: year < 1990 ? 1 : year < 1994 ? non.length - i : weights[i] || 5, record: `${t.w}-${t.l}` }));
      drawn = Math.min(entries.length, year >= 2019 ? 4 : year >= 1987 ? 3 : entries.length);
      const remaining = entries.slice();
      for (let i = 0; i < drawn; i++) {
        const e = R.weighted(remaining, e => e.weight); top.push(e.teamId); remaining.splice(remaining.indexOf(e), 1);
      }
    } else if (year >= 1966) {
      format = 'coin';
      entries = [...new Set(base.map(t => t.conf))].map(conf => ({ teamId: base.find(t => t.conf === conf).id, weight: 1 }));
      if (entries.length === 2) { const winner = R.pick(entries); top = [winner.teamId, entries.find(e => e !== winner).teamId]; drawn = 1; }
    }
    const first = year >= 1985 ? [...top, ...non.map(t => t.id).filter(id => !top.includes(id)), ...playoff.map(t => t.id)] : [...top, ...base.map(t => t.id).filter(id => !top.includes(id))];
    const sum = entries.reduce((s,e) => s+e.weight,0);
    entries.forEach(e => { e.chance = e.weight / sum; });
    d.lottery = { format, drawn, entries, order: first, baseOrder: base.map(t=>t.id) };
    for (let round = 1; round <= (year >= 1989 ? 2 : 3); round++) {
      const order = round === 1 ? first : d.lottery.baseOrder;
      for (const tid of order) d.slots.push({ pick: d.slots.length + 1, round, teamId: tid });
    }
    d.stage = 'lottery';
    return { ok: true, lottery: d.lottery };
  }
  function publishLottery(L) {
    const d = L.draftRoom;
    if (d.lottery.announced) return;
    d.lottery.announced = true;
    if (HL.News) {
      const tid = d.lottery.order[0], t = L.teams[tid], format = d.lottery.format, year = d.year;
      HL.News.push(L, { type: 'draft', key: 'draft.lottery', importance: 3, teamIds: [tid], headline: `${t.name} claim the first pick in the ${year} draft`,
        body: format === 'coin' ? `${t.city} win the two-club coin flip. Draft outcomes now belong to this timeline.` : format === 'reverse' ? 'The first selection follows reverse standings; this era has no draft lottery.' : `${t.city} emerge first from the ${format === 'equal' ? 'equal-chance' : 'weighted'} lottery. Round two still follows reverse record.`,
        reactions: [HL.News.react(L,'homer','draft.lottery.fan',{team:t.name,year},['The {team} have the first pick. Now make it count.'],t,{eraBuiltins:['Supporters of the {team} welcome the first selection and await the club\'s decision.']})].filter(Boolean) });
    }
  }
  function reveal(L) {
    const d = L.draftRoom;
    if (!d?.lottery || L.phase !== 'offseason') return fail('Draw the lottery first.');
    if (d.revealed >= d.lottery.order.length) return fail('The full order is already revealed.');
    const index = d.lottery.order.length - 1 - d.revealed++;
    if (d.revealed === d.lottery.order.length) { d.stage = 'draft'; publishLottery(L); }
    return { ok: true, position: index + 1, teamId: d.lottery.order[index] };
  }
  function announce(L, p, slot) {
    const t = L.teams[slot.teamId], c = { player:p.name,team:t.name,pick:slot.pick,college:p.prospect?.college || p.college || 'the prospect pool' };
    const reach = p.boardRank > slot.pick + 8;
    if (HL.News) HL.News.push(L, { type:'draft',key:'draft.pick',importance:slot.pick<=3?3:2,playerIds:[p.id],teamIds:[t.id],headline:`${t.name} select ${p.name} with pick ${slot.pick}`,
      body:`${p.name}, ${p.age}, ${p.pos}, joins ${t.city} from ${c.college}. ${reach ? `The selection is ahead of his consensus slot (${p.boardRank}), so the front office will need to explain its conviction.` : 'The club now has to turn a draft-night decision into a development plan.'}`,
      reactions:[{voice:{outlet:`${p.name}, player`,kind:'player'},format:'print',likes:0,reposts:0,text:reach?'They believed in me earlier than others did. I want to repay that trust.':'I am ready to earn my place. Being selected is the beginning, not the result.'},
        {voice:{outlet:`${t.city} ownership`,kind:'owner'},format:'print',likes:0,reposts:0,text:`We chose ${p.name}. We will judge development and opportunity, not just the first headline.`},
        HL.News.react(L,reach?'stats':'homer',reach?'draft.pick.reach':'draft.react.fan',c,reach?['The {team} take {player} at {pick}. The scouting department is putting its reputation on this one.']:['Welcome to the {team}, {player}. Earn that jersey.'],t,{eraBuiltins:reach?['The selection of {player} at number {pick} has raised questions among observers of the {team}.']:['The {team} supporters welcome {player} and look forward to his first appearance.']})].filter(Boolean) });
    if (slot.teamId === L.userTeamId && HL.World) HL.World.onDraft(L,p,slot);
  }
  function select(L, pid) {
    const d = L.draftRoom, slot = current(L), p = prospect(L, pid);
    if (!slot || !p || d.selections.some(s=>s.pid===pid)) return fail('That pick or prospect is no longer available.');
    const roundIndex = (slot.pick - 1) % L.teams.length;
    p.teamId = slot.teamId; p.picked = true;
    p.draft = { year:d.year,round:slot.round,pick:slot.pick,teamId:slot.teamId };
    p.contract = { amount:Math.round(Math.max(1.2,(12-roundIndex*.3) * (slot.round===1?1:.15)) * HL.salaryScale(d.year)*1000)/1000,start:d.year,exp:d.year+(slot.round===1?3:1) };
    if (slot.teamId === L.userTeamId) p.userRosterMove = true;
    L.players[pid] = p; d.selections.push({ ...slot, pid });
    d.stage = current(L) && available(d).length ? 'draft' : 'complete';
    announce(L,p,slot);
    return { ok:true,player:p,slot };
  }
  function pick(L, pid) {
    const d = L.draftRoom;
    if (!manager(L)) return fail('The front office makes the picks in Coach mode.');
    if (L.phase !== 'offseason' || d?.stage !== 'draft' || current(L)?.teamId !== L.userTeamId) return fail('Wait until your team is on the clock.');
    return select(L,pid);
  }
  function best(L, tid) {
    const d=L.draftRoom,pool=available(d);
    if(tid===L.userTeamId) {const preferred=d.shortlist.map(id=>pool.find(p=>p.id===id)).find(Boolean);if(preferred)return preferred;}
    const roster=Object.values(L.players).filter(p=>!p.retired&&p.teamId===tid);
    const score=p=>-p.boardRank+(roster.filter(q=>q.pos===p.pos&&q.ovr>=72).length===0?3:0);
    return pool.slice().sort((a,b)=>score(b)-score(a)||a.id-b.id)[0];
  }
  function simulate(L, untilOwn=false) {
    const d=L.draftRoom;
    if (!d?.lottery || L.phase!=='offseason') return fail('Draw the lottery before starting draft night.');
    if(d.stage==='complete') return {ok:true,count:0};
    d.revealed=d.lottery.order.length;d.stage='draft';publishLottery(L);let count=0;
    while(current(L)&&available(d).length) {
      if(untilOwn&&current(L).teamId===L.userTeamId)break;
      select(L,best(L,current(L).teamId).id);count++;
    }
    if(!current(L)||!available(d).length)d.stage='complete';
    return {ok:true,count};
  }
  function commit(L) {
    const d=L.draftRoom;
    if(!d||d.stage!=='complete')return fail('Finish the draft before opening the next season.');
    if(d.committed)return {ok:true};
    for(const p of available(d)) {
      p.teamId=null;p.contract={amount:Math.round(1.2*HL.salaryScale(d.year)*1000)/1000,exp:d.year};L.players[p.id]=p;
    }
    if(d.historical) {
      const have=new Set(Object.values(L.players).map(p=>p.hid).filter(Boolean));
      for(const row of HL.History.seasonRows(String(d.year))) {
        if(have.has(row.pid))continue;
        const p=HL.History.makePlayer(row,d.year,null);p.realAttrs={...p.attrs};p.yearsPro=0;
        p.contract={amount:Math.round(HL.estimateSalary(p.ovr,p.age)*HL.salaryScale(d.year)*1000)/1000,exp:d.year};L.players[p.id]=p;have.add(row.pid);
      }
    }
    L.lastDraft={year:d.year,picks:d.selections.map(s=>s.pid),selections:d.selections.map(s=>({...s})),lottery:d.lottery};
    d.committed=true;L.nextPid=HL.nextPlayerId();return {ok:true};
  }
  return {prepare,report,scout,shortlist,lottery,reveal,pick,simulate,commit,current};
})();
