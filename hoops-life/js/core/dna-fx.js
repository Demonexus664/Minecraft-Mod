// Staged card fusion: composite-friendly choreography and no simulation randomness.
window.HL=window.HL||{};
HL.DNAFX=(function(){
 const seen=new Set();let active=null;
 const reduced=()=>typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
 const esc=s=>HL.DNA.esc(s);
 function close(){active?.cleanup();active=null;}
 function reset(){close();seen.clear();}
 function family(e){return e.family==='defense'?'defense':['contact','post','glass'].includes(e.family)?'interior':e.family==='flight'?'flight':'shooting';}

 const CHOREOGRAPHY={
  shooting:{
    ingredients:'Tracing the shot DNA',interact:'Gravity bends defensive coverage',
    climax:'Three-point gravity is colliding',result:'The shooting identity is unlocked',
    stamp:'THE ARC',kind:'shooting',headline:'DEFEND THE WHOLE FLOOR'},
  interior:{
    ingredients:'Measuring contact and leverage',interact:'The paint is under pressure',
    climax:'A new finishing force is taking shape',result:'The paint identity is unlocked',
    stamp:'THE IMPACT',kind:'interior',headline:'NOTHING EASY AT THE RIM'},
  defense:{
    ingredients:'Reading the defensive film',interact:'Passing lanes begin to close',
    climax:'Lockdown instincts synchronize',result:'The defensive identity is unlocked',
    stamp:'THE LOCK',kind:'defense',headline:'THE FLOOR JUST GOT SMALLER'},
  flight:{
    ingredients:'Building explosive lift',interact:'The runway is open',
    climax:'Aerial movement takes over',result:'The flight identity is unlocked',
    stamp:'THE FLIGHT',kind:'flight',headline:'ABOVE THE RIM'}
 };
 const pretty=k=>String(k).replace(/([A-Z])/g,' $1').replace(/^./,ch=>ch.toUpperCase());
 function mechanicReport(effect){
  const methods=Object.entries(effect.mechanics||{}).filter(([,v])=>Number.isFinite(v)&&v>0)
   .sort((a,b)=>b[1]-a[1]).slice(0,4);
  if(!methods.length)return '<p class="dna-fusion-no-magic">This fusion transforms the on-court identity through its listed activation conditions. It does not award an automatic 99 overall.</p>';
  return '<div class="dna-fusion-mechanics"><div class="dna-mechanic-heading">LIVE GAME MECHANICS</div>'+
   methods.map(([id,power],i)=>'<div class="dna-fusion-mechanic" style="--sequence:'+i+'">'+
    '<div class="dna-mechanic-number">0'+(i+1)+'</div><div><b>'+esc(pretty(id))+
    '</b><p>'+esc(HL.DNA.MECHANIC_TEXT?.[id]||'Specialized basketball interaction triggered during matching possessions.')+
    '</p></div><span class="dna-mechanic-strength">'+Math.round(power*100)+'% intensity</span></div>').join('')+
   '</div>';
 }

 function cards(effect){
  const groups=new Map();for(const e of effect.ingredients||[]){const k=`${e.pid}:${e.season}`,g=groups.get(k)||{...e,cats:[]};g.cats.push(e.cat);groups.set(k,g);}
  return [...groups.values()].slice(0,5).map(e=>{
   const bio=HL.HISTORY.players[e.pid]||[HL.DNA.STARS[e.pid]?.name||e.pid],club=e.row?.stints?.[0]?.[0],fr=HL.Challenge?.LINEAGE?.[club]||club,team=HL.TEAMS.find(t=>t.abbr===fr);
   const required=(effect.needs||[]).filter(n=>e.cats.includes(n.cat)&&(!n.pid||n.pid===e.pid)).flatMap(n=>Object.keys(n.min||{}));
   const keys=[...new Set([...required,...Object.keys(effect.roleTools?.[e.pid]||{}),...e.cats.flatMap(c=>HL.DNA.CATEGORY_ATTRS[c]||[])])],a=e.attrs||{};
   const values=keys.slice(0,3).map(k=>[k.toUpperCase(),a[k]??'—']);
   return `<div class="dna-fusion-input">${HL.Cards.card({pid:e.pid,name:bio[0],nbaId:bio[1],season:e.season,team,pos:e.row?.pos,rating:e.row?HL.historicalSeasonOvr(e.row):99,meta:e.season?`${e.season}-${String(+e.season+1).slice(-2)}`:'Inherited DNA',stat:values})}<b>${esc(e.cats.join(' · '))}</b></div>`;
  }).join('');
 }
 async function reveal(effect,{title='LEGENDARY TRANSFORMATION',resultPlayer=null,replay=false}={}){
  if(!effect||!['mutation','evolved'].includes(effect.type)||!document.body||(!replay&&seen.has(effect.id)))return;
  close();seen.add(effect.id);
  const before=document.activeElement,layer=document.createElement('div'),timers=[];
  const phase=CHOREOGRAPHY[family(effect)]||CHOREOGRAPHY.shooting;
  layer.className='dna-reveal dna-fusion';layer.dataset.family=phase.kind;layer.dataset.stage='ingredients';
  layer.setAttribute('role','dialog');layer.setAttribute('aria-modal','true');layer.setAttribute('aria-labelledby','dna-fusion-title');
  const colors=effect.colors||HL.DNA.PALETTE.arc;layer.style.setProperty('--dna-a',colors[0]);layer.style.setProperty('--dna-b',colors[1]);
  const target=effect.ingredients?.find(e=>e.pid===effect.target)||effect.ingredients?.[0],bio=target&&HL.HISTORY.players[target.pid];
  const resultCard=resultPlayer&&HL.GFX?.jerseyCard?HL.GFX.jerseyCard(resultPlayer,null,{sub:'Transformed build'}):target?HL.Cards.card({pid:target.pid,name:bio?.[0]||effect.name,nbaId:bio?.[1],season:target.season,rating:target.row?HL.historicalSeasonOvr(target.row):99,meta:'TRANSFORMED IDENTITY',pos:target.row?.pos}):'';
  layer.innerHTML=`<div class="dna-fusion-atmosphere" aria-hidden="true"></div><div class="dna-fusion-window"><header><span>${esc(title)}</span><button class="btn small" data-dna-skip>Skip animation</button><button class="btn small" data-dna-dismiss aria-label="Close fusion">Close</button></header><div class="dna-fusion-status" aria-live="polite">The qualifying cards</div>
   <div class="dna-fusion-hero"><small>DNA PROTOCOL · ${esc(phase.stamp)}</small><strong>${esc(phase.headline)}</strong></div>
   <div class="dna-fusion-stage"><div class="dna-fusion-ingredients">${cards(effect)}</div><div class="dna-fusion-court" aria-hidden="true"><i class="dna-arc arc-one"></i><i class="dna-arc arc-two"></i><i class="dna-ball"></i><i class="dna-impact impact-one"></i><i class="dna-impact impact-two"></i><div class="dna-lockdown">${'<i></i>'.repeat(6)}</div><div class="dna-flight-trails">${'<i></i>'.repeat(3)}</div></div><div class="dna-fusion-output" aria-hidden="true">${resultCard}</div></div>
   <div class="dna-fusion-result" hidden><h2 id="dna-fusion-title">${esc(effect.name)}</h2><p>${esc(effect.description)}</p><details open><summary>Why these cards qualified</summary><p>${esc(effect.qualification)}</p></details><div class="dna-fusion-activation"><b>ON-COURT TRIGGER</b><p>${esc(effect.activation)}</p></div>${mechanicReport(effect)}<button class="btn go" data-dna-continue>Use this transformation</button></div><p class="dna-fusion-evidence">${esc(effect.qualification)}</p></div>`;
  const labels=phase;
  function stage(value){if(!layer.isConnected)return;layer.dataset.stage=value;layer.querySelector('.dna-fusion-status').textContent=labels[value];
    if(value!=='ingredients')HL.FX?.sfx?.fusion?.(phase.kind,value);
    if(value==='result'){layer.querySelector('.dna-fusion-result').hidden=false;layer.querySelector('.dna-fusion-evidence').hidden=true;layer.querySelector('.dna-fusion-output').setAttribute('aria-hidden','false');layer.querySelector('[data-dna-skip]').hidden=true;layer.querySelector('[data-dna-continue]').focus();}}
  function cleanup(){timers.forEach(clearTimeout);document.removeEventListener('keydown',keys);layer.remove();if(before?.isConnected)before.focus();}
  function keys(e){if(e.key==='Escape'){e.preventDefault();close();}else if(e.key==='Tab'){const items=[...layer.querySelectorAll('button,summary')].filter(x=>x.offsetParent!==null),first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}}
  layer.querySelector('[data-dna-skip]').onclick=()=>{timers.forEach(clearTimeout);stage('result');};layer.querySelector('[data-dna-dismiss]').onclick=close;layer.querySelector('[data-dna-continue]').onclick=close;
  document.body.appendChild(layer);active={layer,cleanup};document.addEventListener('keydown',keys);layer.querySelector('[data-dna-skip]').focus();
  if(reduced()||HL.FX?.fxLevel?.()==='off'){
    layer.classList.add('dna-no-motion');stage('result');
  }else{
    const fast=HL.FX?.fxLevel?.()==='lite';
    for(const [value,ms]of [['interact',fast?350:950],['climax',fast?850:2150],['result',fast?1450:3400]])
      timers.push(setTimeout(()=>stage(value),ms));
  }
  return layer;
 }
 return {reveal,reset,close};
})();
