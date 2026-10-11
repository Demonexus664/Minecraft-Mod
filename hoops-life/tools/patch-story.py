from pathlib import Path
p=Path('/mnt/data/hoops-mutant-release/js/modes/skilldraft.js');s=p.read_text()
def put(a,b):
 global s
 if s.count(a)!=1:raise Exception((s.count(a),a[:110]))
 s=s.replace(a,b)
put("      pending: null, done: false, end: null, legacy: null, dna: prime.dna,", "      pending: null, done: false, end: null, legacy: null, dna: prime.dna, story: [], pendingStory:null, franchiseLoyalty:0,")
put('    c.pending = pend;\n  }\n\n  function makeOffers', '    c.pending = pend;\n    c.pendingStory=HL.Story.prompt(c);\n  }\n\n  function makeOffers')
put('  async function simRest(c, onProgress, seasons = 10) {', '  async function simRest(c, onProgress, seasons = 10, interactive = false) {')
put('      if (c.pending) autoDecide(c);', '      if (interactive && c.pendingStory) break;\n      if (c.pending) autoDecide(c);')
put('      await offseason(c);\n      onProgress && onProgress(c);', '      await offseason(c);\n      if (!interactive && c.pendingStory) HL.Story.chooseDecision(c,\'b\');\n      onProgress && onProgress(c);\n      if (interactive && c.pendingStory) break;')
put('    await simRest(c, cc => setPct(', '    await simRest(c, cc => setPct(')
put('), 10);\n  }\n\n  function draftView(', '), 10, true);\n  }\n\n  function draftView(')
# hubView: story prompt displayed before full hub with reaction
put("    const last = c.seasons[c.seasons.length - 1];\n    if (last) out.push(seasonReport(last));", "    const last = c.seasons[c.seasons.length - 1];\n    if(c.pendingStory){const e=c.pendingStory;out.unshift(`<section class=\"block dna-story-choice\"><div class=\"body stack\"><span class=\"dna-section-label\">A CAREER TURNING POINT</span><h2>${esc(e.title)}</h2><p>${esc(e.subtitle)}</p><div class=\"row wrap\"><button class=\"btn go\" data-story-choice=\"a\">${esc(e.a)}</button><button class=\"btn\" data-story-choice=\"b\">${esc(e.b)}</button></div></div></section>`);}\n    if (last) out.push(seasonReport(last));")
put("    app.querySelectorAll('[data-trade]').forEach", "    app.querySelectorAll('[data-story-choice]').forEach(b=>b.onclick=()=>{HL.Story.chooseDecision(c,b.dataset.storyChoice);setAge(c,c.age);render();});\n    app.querySelectorAll('[data-trade]').forEach")
put("    const a=HL.Legacy.careerReport(c), m=a.metrics, nba=c.seasons.filter(s=>!s.minors&&s.g>0);", "    const a=HL.Legacy.careerReport(c), m=a.metrics, nba=c.seasons.filter(s=>!s.minors&&s.g>0);\n    const film=HL.Story.documentary(c);")
put('      <div class="caps">The full story</div>${a.chapters.slice(2).map(t=>`<p class="dossier-chapter">${esc(t)}</p>`).join(\'\')}', '''      <div class="caps">THE CAREER DOCUMENTARY · ${esc(film.title)}</div><div class="dna-film-chapters">${film.chapters.map((x,i)=>`<article class="dna-film"><span>CHAPTER ${i+1} · ${x.year} · ${esc(x.type)}</span><p>${esc(x.text)}</p></article>`).join('')}</div>
      <div class="dossier-two"><article><div class="caps">The media argument</div><p>${esc(film.debate[0])}</p></article><article><div class="caps">The skeptical take</div><p>${esc(film.debate[1])}</p></article></div>''')
# add discovered chemistries to verdict, but no repeated overly verbose list
put('      <div class="caps">Basketball identities earned on the floor</div><div class="dossier-grid">${titleCards}</div>', '      <div class="caps">Basketball identities earned on the floor</div><div class="dossier-grid">${titleCards}</div>${HL.DNA.board(c.dna)}')
p.write_text(s)
