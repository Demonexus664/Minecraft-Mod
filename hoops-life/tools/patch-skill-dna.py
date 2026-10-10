from pathlib import Path
p=Path('/mnt/data/hoops-mutant-release/js/modes/skilldraft.js');s=p.read_text()
def put(a,b):
 global s
 n=s.count(a)
 if n!=1:raise ValueError((n,a[:110]))
 s=s.replace(a,b)
put("  function take(i) {\n    const c = st.hand[i];", "  function take(i) {\n    const c = st.hand[i];")
put("    const cat = catOf(st.cat);\n    st.picks[st.cat] = c;\n    const v = skillValue(c, cat);", "    if(c.legendary) {st.wildCandidate=c;st.phase='wildchoice';render();return;}\n    finishPick(c,st.cat);\n  }\n  function finishPick(c,category) {\n    const oldDna=HL.DNA.analyze(Object.entries(st.picks).map(([cat,pk])=>({pid:pk.row.pid,cat})));\n    const cat=catOf(category);\n    st.picks[category] = c;\n    const v = skillValue(c, cat);")
put("    const id = st.cat;\n    st.hand = []; st.cat = null;", "    const id = category;\n    st.hand = []; st.cat = null;st.wildCandidate=null;")
put("    if (tile) { tile.classList.add('pop'); FX.burst(tile, FX.tierOf(v).colors.concat('#fff'), FX.tierIndex(v) >= 3 ? 30 : 12, 0.6); }", "    if (tile) { tile.classList.add('pop'); FX.burst(tile, FX.tierOf(v).colors.concat('#fff'), FX.tierIndex(v) >= 3 ? 30 : 12, 0.6); }\n    const dna=HL.DNA.analyze(Object.entries(st.picks).map(([cat,pk])=>({pid:pk.row.pid,cat})));\n    const fresh=dna.mutations.find(m=>!oldDna.mutations.some(o=>o.id===m.id)) || dna.trios.find(m=>!oldDna.trios.some(o=>o.id===m.id)) || dna.pairs.find(m=>!oldDna.pairs.some(o=>o.id===m.id));\n    if(fresh) setTimeout(()=>{ HL.DNAFX.reveal(fresh,{title:fresh.type.includes('mutation')||fresh.type==='evolved'?'MUTATION UNLOCKED':'CHEMISTRY DISCOVERED'}); },220);")
put("    else if (done) main = builtView();\n    else main = draftView(hide, revealHand);", "    else if (done) main = builtView();\n    else if (st.phase === 'wildchoice') main = wildcardView();\n    else main = draftView(hide, revealHand);")
put("  function builtView() {", "  function wildcardView() {\n    const c=st.wildCandidate,bio=HL.HISTORY.players[c.row.pid],open=remaining();\n    return `<section class=\"block dna-legend-screen\"><div class=\"body stack\"><div class=\"dna-legend-title\">✦ LEGENDARY WILDCARD</div><h2>${esc(bio[0])} · ${c.season}</h2><p>Choose ANY unfilled skill to inherit. This legendary card also carries its own signature DNA into the simulation.</p><div class=\"dna-choice-grid\">${open.map(id=>{const cat=catOf(id),val=skillValue(c,cat);return `<button class=\"dna-choice\" data-wild-cat=\"${id}\"><b>${esc(cat[1])}</b><strong>${val}</strong></button>`;}).join('')}</div></div></section>`;\n  }\n\n  function builtView() {")
put("    app.querySelectorAll('.hand .gcard').forEach(card => card.onclick = () => { if (!card.classList.contains('down')) take(+card.dataset.hand); });", "    app.querySelectorAll('.hand .gcard').forEach(card => card.onclick = () => { if (!card.classList.contains('down')) take(+card.dataset.hand); });\n    app.querySelectorAll('[data-wild-cat]').forEach(btn=>btn.onclick=()=>finishPick(st.wildCandidate,btn.dataset.wildCat));")
put("  function buildSide(done, hide) {\n    const prime", "  function buildSide(done, hide) {\n    const dna=HL.DNA.analyze(Object.entries(st.picks).map(([cat,pk])=>({pid:pk.row.pid,cat})));\n    const prime")
put('    return `<section class="block"><header><h3>Your build</h3>', '    return `${HL.DNA.board(dna,{compact:true})}<section class="block"><header><h3>Your build</h3>')
# animated artwork for skill draft card in existing hand
start=s.index("    const cards = show ? `<div class=\"stack\"",s.index('function draftView('))
end=s.index("    const intro =",start)
segment=s[start:end]
segment=segment.replace("${st.hand.map((c, i) => { const bio", "${st.hand.map((c, i) => { const previews=HL.DNA.preview(Object.entries(st.picks).map(([cat,pk])=>({pid:pk.row.pid,cat})),{pid:c.row.pid,cat:st.cat});const special=HL.DNA.STARS[c.row.pid]; const bio")
segment=segment.replace('        return HL.Cards.card({', '        return `<div class="dna-card-shell ${special?\'dna-star-card\':\'\'}" style="--dna-a:${special?(HL.DNA.PALETTE[special.tone]||[])[0]:\'#6c7888\'};--dna-b:${special?(HL.DNA.PALETTE[special.tone]||[])[1]:\'#9faabb\'}">`+HL.Cards.card({')
segment=segment.replace('attrs: `data-hand="${i}"` }); }).join(\'\')}</div></div>` : \'\';', 'attrs: `data-hand="${i}"` })+`${previews?`<div class="dna-card-hint">✦ ${esc(previews.name)} · ${esc(previews.type)}</div>`:special?`<div class="dna-card-hint">★ ${esc(special.title)}</div>`:\'\'}</div>`; }).join(\'\')}</div></div>` : \'\';')
if segment == s[start:end] or 'dna-card-hint' not in segment: raise Exception('bad segment')
s=s[:start]+segment+s[end:]
p.write_text(s)