// Distinct deterministic VFX: each DNA ID gets a stable color/shape/motion.
// Only composite-friendly opacity/transform animates; reduced motion is respected.
window.HL=window.HL||{};
HL.DNAFX=(function(){
 const reduced=()=>matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
 const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
 let active=null;
 async function reveal(effect,{title='CHEMISTRY REVEALED'}={}){
  if(!effect||!document.body)return;
  active?.remove(); const seed=hash(effect.id),colors=effect.colors||['#74cfff','#d7a6ff'];
  const patterns=['orbit','pulse','comet','shards','crown','wave'];
  const layer=document.createElement('div');layer.className='dna-reveal';
  layer.dataset.pattern=patterns[seed%patterns.length];
  layer.style.setProperty('--dna-a',colors[0]);layer.style.setProperty('--dna-b',colors[1]);
  const particles=Array.from({length:reduced()?0:Math.min(30,14+(seed%12))},(_,i)=>{
   const angle=(i/24*Math.PI*2)+(seed%100)/60,d=95+(i*31+seed)%180;
   const ch=['✦','◆','●','✧','◈'][seed%5];
   return `<i class="dna-particle" style="--dx:${Math.cos(angle)*d}px;--dy:${Math.sin(angle)*d}px;--delay:${i*18}ms;--sz:${6+i%5*3}px">${ch}</i>`;
  }).join('');
  layer.innerHTML=`<div class="dna-reveal-bg"></div><div class="dna-aura" aria-hidden="true"><i></i><i></i><i></i></div><div class="dna-reveal-core"><small>${HL.DNA.esc(title)}</small><span class="dna-reveal-glyph">${effect.type==='mutation'||effect.type==='evolved'?'✦':effect.type.includes('trio')?'Ⅲ':'Ⅱ'}</span><h2>${HL.DNA.esc(effect.name)}</h2><p>${HL.DNA.esc(Object.entries(effect.bonus).map(([k,v])=>`${k} +${(v*100).toFixed(1)}%`).join(' · '))}</p><button class="btn go" data-dna-dismiss>Continue</button></div>${particles}`;
  layer.querySelector('[data-dna-dismiss]').onclick=()=>{layer.remove();if(active===layer)active=null;};
  document.body.appendChild(layer);active=layer;
  if(HL.FX?.sfx && !reduced()) HL.FX.sfx.fanfare();
  if(reduced())layer.classList.add('dna-no-motion');
  return layer;
 }
 return {reveal};
})();
