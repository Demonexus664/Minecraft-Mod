// Genesis Fusion workstation: real archive faces split in halves, with explicit
// odds and full mechanics readout. Artwork is never an invented celebrity face.
window.HL=window.HL||{};
HL.FusionUI=(function(){
 const F=()=>HL.FusionLab,E=x=>HL.UI?.esc?HL.UI.esc(x):String(x??'');
 let root=null,a=null,b=null,onEquip=null,frame='blend',previous=null;
 function portrait(x,y,small=false){
  const half=(p,side)=>{
   const img=p.photo||p.images?.[side==='left'?0:1]||'';
   const label=p.heads?.[side==='left'?0:1]||p.name||'Unknown';
   return '<div class="gf-photo-half '+side+'">'+(img?
     '<img src="'+E(img)+'" alt="'+E(label)+'" loading="lazy" onerror="this.remove()">':
     '<span class="gf-initials">'+E(label.split(' ').map(x=>x[0]).slice(-2).join(''))+'</span>')+'</div>';
  };
  return '<div class="gf-portrait '+(small?'mini':'')+'">'+half(x,'left')+half(y,'right')+
   '<div class="gf-seam"></div><span class="gf-image-label">TWO ORIGINAL PLAYERS · ONE HYBRID</span></div>';
 }
 function profile(p,label){
  return '<div class="gf-parent"><span class="caps">'+label+'</span>'+
   (p?'<strong>'+E(p.name)+'</strong><small>'+p.ovr+' OVR · '+(p.height||78)+' inches · '+
      (p.depth?'GENERATION '+p.depth:'ARCHIVE '+p.year)+'</small>'+
      '<div class="gf-tools">'+F().tags(p).slice(0,5).map(t=>'<span>'+E(t)+'</span>').join('')+'</div>':
    '<strong>SELECT A PLAYER</strong><small>Search any NBA legend or one of your creations.</small>')+
   '</div>';
 }
 function catalog(q,side){
  const custom=F().creations().filter(p=>p.name.toLowerCase().includes(q.toLowerCase())).slice(0,16);
  const historical=F().search(q);
  return '<div class="gf-suggestions">'+[...custom,...historical].map(p=>
   '<button data-gf-select="'+E(p.id)+'" data-gf-side="'+side+'"><b>'+E(p.name)+'</b><small>'+
   (p.depth?'Fusion Gen '+p.depth: 'Historical player')+'</small></button>').join('')+
   (!custom.length&&!historical.length?'<p class="t3 sm">Enter at least two letters to search the complete archive.</p>':'')+
   '</div>';
 }
 function odds(){
  if(!a||!b)return '<div class="gf-odds empty">Select both parents to scout compatibility, fusion chance and expected strengths.</div>';
  const p=F().preview(a,b),rare=p.rare;
  return '<div class="gf-odds '+(rare?'rare':'')+'"><div class="gf-chance"><span>TRUE SUCCESS ODDS</span>'+
   '<strong>'+p.display+'</strong><div class="gf-probability"><i style="width:'+p.chance+'%"></i></div>'+
   '<small>'+p.repeats+' experiment(s) · each attempt slightly improves stabilization odds, maximum 93%</small></div>'+
   '<div class="gf-meters"><div><b>'+p.affinity+'</b><span>Chemistry</span></div>'+
   '<div><b>'+p.tension+'</b><span>Instability</span></div>'+
   '<div><b>'+p.power+'</b><span>Ceiling</span></div></div>'+
   '<div class="gf-science"><strong>'+E(p.family)+'</strong><p>'+
   (rare?'Extremely difficult, potentially extraordinary. A rare successful paradox can combine otherwise incompatible on-court abilities.':
   'A successful experiment produces real combined ratings and mechanics. Failure never deletes the original players.')+
   '</p><div class="gf-predicted"><b>WHAT THIS PAIR COULD CREATE</b>'+
   '<p>'+E(p.tags.slice(0,6).join(' + '))+'</p>'+
   '<small>Major physical gaps can limit speed, contact finishing or release mechanics. A successful pairing is never guaranteed to inherit both parents’ 99s.</small></div>'+
   '</div></div>';
 }
 function result(r){
  if(!root)return;
  previous=r;
  const target=root.querySelector('[data-gf-result]');
  target.className='gf-result '+(r.ok?'success':'failure')+(r.outcome==='miracle'?' miracle':'');
  target.innerHTML='<div class="gf-reveal-flags"><span>'+(r.ok?'STABILIZATION CONFIRMED':'EXPERIMENT FAILED')+
   '</span><b>'+E(r.ok?r.node.tier.toUpperCase():'PARENTS PRESERVED')+'</b></div>'+
   (a&&b?portrait(a,b):'')+
   '<h2>'+E(r.ok?r.node.name:'FUSION REJECTED')+'</h2>'+
   '<p>'+(r.ok?'This creation inherits a specific set of elite tools and can be fused again indefinitely.':
       'Both parents remain intact. The experiment has no successful specimen, but the research history persists.')+'</p>'+
   (!r.ok?'<div class="gf-failed-reading"><b>DIAGNOSIS · '+E(r.outcome.replaceAll('-',' '))+
     '</b><p>'+E(r.failureReason||'The experiment did not stabilize.')+'</p>'+
     '<small>'+E(r.echo||'You can try again without losing your originals.')+'</small></div>':'')+
   (r.ok?'<div class="gf-result-metrics"><b>'+r.node.ovr+' OVR</b><b>GEN '+r.node.depth+
        '</b><b>'+E(r.node.family)+'</b></div>'+
      '<div class="gf-genome"><div class="gf-genome-head"><b>INHERITED ELITE TOOLS</b>'+
      '<span>'+r.node.ancestry.length+' unique historical ancestors</span></div>'+
      '<div class="gf-lineage"><div class="caps">LINEAGE · GENERATION '+r.node.depth+'</div>'+
      r.node.ancestry.slice(0,18).map(pid=>'<span>'+E(HL.HISTORY?.players?.[pid]?.[0]||pid)+'</span>').join('')+
      (r.node.ancestry.length>18?'<small>+ '+(r.node.ancestry.length-18)+' ancestors</small>':'')+
      '</div>'+
      '<div class="gf-gene-grid">'+(r.node.strengths?.length?r.node.strengths.map(g=>
        '<div class="gf-gene"><small>'+E(g.key.replace(/([A-Z])/g,' $1'))+
        '</small><b>'+g.value+'</b><div class="gf-gene-track"><i style="width:'+g.value+'%"></i></div></div>').join(''):
        '<p>Specialist inheritance is carried mainly in the active abilities below.</p>')+'</div>'+
      (r.node.tradeoffs?.length?'<div class="gf-tradeoff"><b>THE PHYSICAL COST</b>'+
        r.node.tradeoffs.map(g=>'<div><span>'+E(g.key.replace(/([A-Z])/g,' $1'))+
        '</span><strong>−'+g.lost+' vs the better parent · '+g.value+' retained</strong></div>').join('')+
        '</div>':'<div class="gf-tradeoff small">No significant frame-specific mismatch was found.</div>')+
      '</div><div class="gf-ability-list">'+
      Object.entries(r.node.mechanics).slice(0,9).map(([k,v])=>
       '<div><strong>'+E(k.replace(/([A-Z])/g,' $1'))+'</strong><span>'+
       E(HL.DNA.MECHANIC_TEXT?.[k]||'Specialized basketball possession bonus.')+'</span><b>'+
       Math.round(v*100)+'%</b></div>').join('')+'</div>'+
      '<button class="btn go big" data-gf-equip="'+E(r.node.id)+'">EQUIP FUSION ON MYPLAYER</button>':'')+
   '<small>Rolled '+(100*r.roll).toFixed(2)+' against '+r.chance.toFixed(1)+'% success.</small>';
  target.querySelector('[data-gf-equip]')?.addEventListener('click',()=>{
   const node=F().find(r.node.id);if(node){onEquip?.(node);close();}
  });
  HL.FX?.sfx?.fusion?.(r.ok?'shooting':'defense',r.ok?'result':'climax');
  if(r.ok)HL.FX?.burst?.(target.querySelector('.gf-portrait'),
   r.outcome==='miracle'?['#ffdf98','#5fecff','#d1a1ff']:['#cfabff','#81d9fb'],r.outcome==='miracle'?64:24,1);
 }
 function redraw(){
  if(!root)return;
  root.innerHTML='<div class="gf-workbench"><div class="gf-top"><div><span>HOOPS LIFE RESEARCH FACILITY</span>'+
   '<h2>GENESIS FUSION</h2></div><button class="btn" data-gf-close>EXIT LAB</button></div>'+
   '<p class="gf-explainer">Fuse any two real basketball players. Then combine fusions with players, or fusions with fusions. There are no predefined forbidden pairings and no generation cap. All outcomes use the displayed probability.</p>'+
   '<div class="gf-sources"><div class="gf-search-column">'+profile(a,'SOURCE A')+
   '<input placeholder="Find a real player or fusion…" data-gf-search="a" aria-label="First fusion source">'+
   '<div data-gf-list="a"></div></div><span class="gf-cross">×</span>'+
   '<div class="gf-search-column">'+profile(b,'SOURCE B')+
   '<input placeholder="Find a real player or fusion…" data-gf-search="b" aria-label="Second fusion source">'+
   '<div data-gf-list="b"></div></div></div>'+
   (a&&b?portrait(a,b):'')+odds()+
   '<div class="gf-controls"><label>BODY / FRAME <select data-gf-frame>'+
   [['blend','Blended frame'],['left','Parent A frame'],['right','Parent B frame']].map(([id,title])=>
     '<option value="'+id+'" '+(frame===id?'selected':'')+'>'+title+'</option>').join('')+
   '</select></label><button class="btn go big" data-gf-attempt '+(!a||!b?'disabled':'')+
   '>ATTEMPT FUSION</button><button class="btn" data-gf-swap '+(!a||!b?'disabled':'')+'>SWAP</button></div>'+
   '<div class="gf-feedback" data-gf-status aria-live="polite"></div><div data-gf-result></div>'+
   '<section class="gf-created"><h3>MY HYBRIDS · '+F().creations().length+'</h3>'+
   '<p class="t3 sm">Your fusion collection persists between careers and reloads when browser storage is available. You can keep merging any generation with any other parent.</p>'+
   (F().creations().length?'<div class="gf-collection">'+F().creations().slice(0,30).map(node=>
    '<article class="gf-collection-card">'+portrait(
       {photo:node.images?.[0],name:node.heads?.[0]||node.name},
       {photo:node.images?.[1],name:node.heads?.[1]||node.name},true)+
    '<div class="gf-collection-desc"><b>'+E(node.name)+'</b><small>GEN '+node.depth+
       ' · '+node.ovr+' OVR · '+E(node.tier.toUpperCase())+'</small>'+
       '<span>'+E(Object.keys(node.mechanics||{}).slice(0,3).join(' / '))+'</span></div>'+
    '<div class="gf-collection-actions"><button class="btn small" data-gf-reuse="'+E(node.id)+'">FUSE AGAIN</button>'+
     '<button class="btn small" data-gf-equip="'+E(node.id)+'">EQUIP</button></div></article>').join('')+
    '</div>':
    '<p class="t3 sm">Successful creations live here. Reuse them as new parents or equip one on your Skill Draft build.</p>')+
   '</section><details class="gf-history"><summary>EXPERIMENT LOG · '+F().history().length+'</summary>'+
   F().history().slice(0,25).map(entry=>
    '<div><b>'+(entry.ok?'SUCCESS':'FAILED')+'</b><span>'+E(entry.sourceA)+
      ' × '+E(entry.sourceB)+'</span><small>'+entry.chance.toFixed(1)+'% chance</small></div>').join('')+
   '</details></div>';
  root.querySelector('[data-gf-close]').onclick=close;
  root.querySelector('[data-gf-frame]').onchange=e=>{frame=e.target.value;};
  root.querySelector('[data-gf-swap]').onclick=()=>{const x=a;a=b;b=x;redraw();};
  root.querySelector('[data-gf-attempt]').onclick=()=>{
   const r=F().attempt(a,b,{frame});redraw();result(r);
  };
  root.querySelectorAll('[data-gf-equip]').forEach(x=>x.onclick=()=>{
   const n=F().find(x.dataset.gfEquip);if(n){onEquip?.(n);close();}
  });
  root.querySelectorAll('[data-gf-reuse]').forEach(x=>x.onclick=()=>{
   const n=F().find(x.dataset.gfReuse);
   if(n){if(!a)a=n;else b=n;redraw();}
  });
  root.querySelectorAll('[data-gf-search]').forEach(input=>{
   const side=input.dataset.gfSearch;
   input.oninput=()=>{
    const box=root.querySelector('[data-gf-list="'+side+'"]');
    box.innerHTML=catalog(input.value,side);
    box.querySelectorAll('[data-gf-select]').forEach(button=>button.onclick=async()=>{
     const id=button.dataset.gfSelect,feedback=root.querySelector('[data-gf-status]');
     feedback.textContent='LOADING HISTORICAL PLAYER RATINGS…';
     try{
      const node=F().find(id)||await F().historical(id.slice(8));
      if(!root)return;
      if(side==='a')a=node;else b=node;
      redraw();
     }catch(e){if(root)root.querySelector('[data-gf-status]').textContent=String(e.message||e);}
    });
   };
  });
 }
 function open(callback){
  close();onEquip=callback;
  root=document.createElement('div');root.className='gf-overlay';
  root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');
  root.setAttribute('aria-label','Genesis Fusion Laboratory');
  document.body.appendChild(root);root.addEventListener('click',e=>{if(e.target===root)close();});
  redraw();root.querySelector('[data-gf-close]')?.focus();
 }
 function close(){root?.remove();root=null;}
 function reset(){close();a=b=previous=onEquip=null;frame='blend';F().reset();}
 return {open,close,reset,portrait,profile,odds};
})();