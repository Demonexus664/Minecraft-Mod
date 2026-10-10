from pathlib import Path
p=Path('/mnt/data/hoops-mutant-release')
f=p/'js/modes/challenge820.js';s=f.read_text()
s=s.replace('const otOpp=Math.max(6,otMine-(margin===0?(R.chance(.5)?2:-2):Math.sign(margin)*(-2)));','let otOpp=Math.max(6,otMine-(margin===0?(R.chance(.5)?2:-2):Math.sign(margin)*2));')
s=s.replace('if (g.mine===g.theirs)g.mine+=R.chance(.5)?2:-2;','let tieBreak=0;\n      if (g.mine===g.theirs){tieBreak=R.chance(.5)?2:-2; if(tieBreak>0)g.mine+=tieBreak;else g.theirs-=tieBreak;}')
s=s.replace('myBox.quarters.push(otMine+(g.mine-g.theirs===0?2:0));','myBox.quarters.push(otMine+(tieBreak>0?tieBreak:0));')
s=s.replace('theirBox.quarters.push(otOpp);','theirBox.quarters.push(otOpp+(tieBreak<0?-tieBreak:0));')
s=s.replace('      myBox.score=g.mine;myBox.quarters[myBox.quarters.length-1]+=value;','      myBox.score=g.mine;myBox.quarters[myBox.quarters.length-1]+=value;')
f.write_text(s)
f=p/'js/core/dna-fx.js';s=f.read_text()
a="  const layer=document.createElement('div');layer.className='dna-reveal';layer.style.setProperty('--dna-a',colors[0]);layer.style.setProperty('--dna-b',colors[1]);"
b="""  const patterns=['orbit','pulse','comet','shards','crown','wave'];
  const layer=document.createElement('div');layer.className='dna-reveal';
  layer.dataset.pattern=patterns[seed%patterns.length];
  layer.style.setProperty('--dna-a',colors[0]);layer.style.setProperty('--dna-b',colors[1]);"""
assert a in s;s=s.replace(a,b)
s=s.replace('<div class="dna-reveal-bg"></div><div class="dna-reveal-core">','<div class="dna-reveal-bg"></div><div class="dna-aura" aria-hidden="true"><i></i><i></i><i></i></div><div class="dna-reveal-core">')
f.write_text(s)
f=p/'css/dna.css';s=f.read_text()
s+='''
/* Pattern variants are derived from each combination's immutable ID. All six
   treatments animate only transforms/opacity, and none require image assets. */
.dna-aura{position:absolute;inset:0;pointer-events:none;display:grid;place-items:center;isolation:isolate}
.dna-aura i{grid-area:1/1;width:min(50vw,430px);aspect-ratio:1;border:1px solid var(--dna-a);border-radius:50%;opacity:.32;box-shadow:0 0 18px color-mix(in srgb,var(--dna-b) 28%,transparent);animation:dna-ring 2.4s ease-out infinite}
.dna-aura i:nth-child(2){animation-delay:.8s}
.dna-aura i:nth-child(3){animation-delay:1.6s}
@keyframes dna-ring{0%{opacity:.6;transform:scale(.25)}100%{opacity:0;transform:scale(1.5)}}
.dna-reveal[data-pattern="orbit"] .dna-aura i{border-style:dashed;animation:dna-orbit 4s linear infinite;opacity:.5}
@keyframes dna-orbit{to{transform:rotate(360deg) scale(1.2)}}
.dna-reveal[data-pattern="pulse"] .dna-aura i{border-width:3px;animation:dna-ring 1.2s cubic-bezier(.2,.7,.3,1) infinite}
.dna-reveal[data-pattern="comet"] .dna-reveal-bg{animation:dna-sweep 2.8s ease-in-out infinite alternate}
@keyframes dna-sweep{from{opacity:.1;transform:translate(-8%,-2%) rotate(-12deg)}to{opacity:.43;transform:translate(8%,2%) rotate(16deg)}}
.dna-reveal[data-pattern="shards"] .dna-aura i{border-radius:12%;animation:dna-shear 3s ease-in-out infinite alternate}
@keyframes dna-shear{from{transform:rotate(0) scale(.72);opacity:.6}to{transform:rotate(62deg) scale(1.26);opacity:.12}}
.dna-reveal[data-pattern="crown"] .dna-aura i{border-radius:32% 68% 57% 43%;animation:dna-crown 2.3s ease-in-out infinite alternate}
@keyframes dna-crown{from{transform:rotate(-35deg) scale(.8);opacity:.65}to{transform:rotate(35deg) scale(1.18);opacity:.22}}
.dna-reveal[data-pattern="wave"] .dna-aura i{border-radius:49%;animation:dna-ring 3.2s ease-out infinite}
@media(prefers-reduced-motion:reduce){.dna-reveal .dna-aura i,.dna-reveal .dna-reveal-bg{animation:none!important}.dna-reveal .dna-aura i{opacity:.08!important}}
'''
f.write_text(s)
print('Playoff and VFX refinements applied')