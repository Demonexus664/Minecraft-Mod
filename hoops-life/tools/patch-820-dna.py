from pathlib import Path
p=Path('/mnt/data/hoops-mutant-release/js/modes/challenge820.js');s=p.read_text()
def put(a,b):
 global s
 if s.count(a)!=1: raise Exception((s.count(a),a[:120]))
 s=s.replace(a,b)
put("      skips: { team: 2, era: 2, all: 2 }, usedSkips: 0, used: [], plan: 'balanced', result: null, pulls: [] };", "      skips: { team: 2, era: 2, all: 2 }, usedSkips: 0, used: [], plan: 'balanced', result: null, pulls: [], special:null, dna:null, dream:null, playoffs:null };")
put("    // Deal the hand now (seeded), reveal it after the reels land.\n    const taken", "    // A rare legendary team REPLACES the team roll (no extra card).\n    st.special=null;\n    const special = what === 'both' || what === 'all' ? await HL.Legends.rollDraftTeam():null;\n    if(special){st.special=special.spec;st.decade=Math.floor(special.spec.year/10)*10;st.team=special.spec.franchise;}\n    // Deal the hand now (seeded), reveal it after the reels land.\n    const taken")
put("    st.hand = dealHand(st.team, st.decade, taken);\n    const wild=await HL.Legends.wildcard(null,[...taken]);\n    if(wild && !st.hand.some(c=>c.row.pid===wild.row.pid))st.hand.push(wild);", "    st.hand = special ? special.hand.filter(c=>!taken.has(c.row.pid)) : dealHand(st.team, st.decade, taken);")
put("    st.lineup[slot] = c;\n    if (c.legendary", "    const oldDna=st.dna;\n    st.lineup[slot] = c;\n    st.dna=HL.DNA.analyze(SLOTS.filter(x=>st.lineup[x]).map(x=>({pid:st.lineup[x].row.pid,cat:x})),{mode:'team'});\n    const unlocked=st.dna.mutations.find(x=>!oldDna?.mutations.some(y=>y.id===x.id)) || st.dna.trios.find(x=>!oldDna?.trios.some(y=>y.id===x.id)) || st.dna.pairs.find(x=>!oldDna?.pairs.some(y=>y.id===x.id));\n    if (c.legendary")
put("    if (pen >= 10) U.toast(", "    if(unlocked)setTimeout(()=>HL.DNAFX.reveal(unlocked,{title:unlocked.type==='mutation'||unlocked.type==='evolved'?'LEGENDARY MUTATION':'CHEMISTRY UNLOCKED'}),260);\n    if (pen >= 10) U.toast(")
put("    dream.players = players;", "    const dnaEntries=SLOTS.map(slot=>({pid:st.lineup[slot].row.pid,cat:slot,playerId:players[SLOTS.indexOf(slot)].id}));\n    // Historical mutations remain distinct from team chemistry.\n    st.dna=HL.DNA.applyTeam(players.slice(0,8),dnaEntries);\n    dream.players = players;\n    st.dream=dream;")
put("      p.slot = slot;\n      players.push(p);", "      p.slot = slot;p.historicalPid=c.row.pid;\n      players.push(p);")
put("    // Rare crossover exhibition games challenge even the strongest drafted five.\n    // They are explicitly fictional, outside the recorded NBA schedule.\n    const rare=await HL.Legends.rareOpponent();\n    const rareTeam=rare?await HL.Legends.opponent(rare):null;\n    const opps = L.teams;", "    // Legendary specials are draft-only. Exhibitions never replace league games.\n    const rareTeam=null;\n    const opps = L.teams;")
put("    st.result = { w, l, games, pf: pf / games, pa: pa / games, best, losses: log, lines, players, firstLoss, gameLog,absences,injuriesLog,specialEncounter:rareTeam?.legendSpec||null };", "    st.result = { w, l, games, pf: pf / games, pa: pa / games, best, losses: log, lines, players, firstLoss, gameLog,absences,injuriesLog,specialEncounter:null, dna:st.dna, specialDraft:st.special?.label||null };\n    st.playoffTeams=L.teams;")
put("    else if (st.phase === 'season') main = tickerView();", "    else if (st.phase === 'season') main = tickerView();\n    else if (st.phase === 'playoffs') main = playoffView();")
put('          <button class="btn" data-skip="era"', '          <button class="btn" data-skip="era"')
put("    const hand = st.phase === 'hand' ? `<div class=\"stack\" style=\"gap:8px;margin-top:18px\"><div class=\"t2 sm\" style=\"text-align:center\">${st.hand.length ? st.hand.some(c=>c.legendary) ? '★ RARE LEGENDARY WILDCARD! Choose any card, including this out-of-era bonus.' : 'Drag a card onto the court or the bench, or tap a card and then a spot.' : 'No players to deal from this club and decade. Use a skip.'}</div>", "    const hand = st.phase === 'hand' ? `<div class=\"stack\" style=\"gap:8px;margin-top:18px\"><div class=\"t2 sm\" style=\"text-align:center\">${st.hand.length ? st.special ? `✦ LEGENDARY TEAM ROLL · ${esc(st.special.label)} · Pick ONE player` : 'Drag a card onto the court or the bench, or tap a card and then a spot.' : 'No players to deal from this club and decade. Use a skip.'}</div>")
put("      ${identityReport(r)}", "      ${r.specialDraft?`<section class=\"block\"><header><h3>Legendary roster discovered</h3></header><div class=\"body\"><p>✦ ${esc(r.specialDraft)} supplied one of your drafted players. No extra draft slot was awarded.</p></div></section>`:''}\n      ${HL.DNA.board(st.dna)}\n      ${identityReport(r)}")
# add DNA at ready team preview; explicit summary
put("    const hand = st.phase === 'hand' ?", "    const chemistry = st.dna && st.dna.players.length>1 ? HL.DNA.board(st.dna,{compact:!done}):'';\n    const hand = st.phase === 'hand' ?")
put("    return `<section class=\"machine\"", "    return `<section class=\"machine\"") if False else None
# insert chemistry after machine in machineView via unique identification near return
pos=s.index('  function machineView(')
idx=s.index("    return `<",pos)
# Not all layouts include ability; insertion of chemistry at end of machine return via anchored end nearest last section.
chunk=s[pos:s.index('  function ',pos+18)]
# no alteration; show in right sidebar near court instead
put("${courtView()}\n        <section class=\"block\">", "${courtView()}${st.phase==='result'||st.phase==='playoffs'?'':st.dna?HL.DNA.board(st.dna,{compact:true}):''}\n        <section class=\"block\">")
p.write_text(s)