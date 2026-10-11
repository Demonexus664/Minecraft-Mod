// Genesis Fusion workstation: real archive faces split in halves, with explicit
// odds and full mechanics readout. Artwork is never an invented celebrity face.
window.HL=window.HL||{};
HL.FusionUI=(function(){
 const F=()=>HL.FusionLab,E=x=>HL.UI?.esc?HL.UI.esc(x):String(x??'');
 let root=null,a=null,b=null,onEquip=null,frame='blend',previous=null;

 function portrait(x,y,small=false){
  const sources=[...(x?F().lineageOf(x):[]),...(y?F().lineageOf(y):[])];
  if(!sources.length)return '';
  const count=sources.length;
  const tiles=sources.map((person,i)=>{
   const label=String(person.name||'Original player');
   const img=person.photo||'';
   return '<div class="gf-portrait-strip" style="--part:'+i+';--total:'+count+'">'+
      (img?'<img src="'+E(img)+'" alt="'+E(label)+'" loading="lazy" onerror="this.remove()">':
       '<div class="gf-initials">'+E(label.split(' ').map(w=>w[0]).slice(-2).join(''))+'</div>')+
      '<span>'+E(label)+'</span></div>';
  }).join('');
  return '<div class="gf-portrait gf-portrait-multi '+(small?'mini':'')+
    '" data-ancestors="'+count+'" aria-label="'+count+' original players contributing to this fusion">'+
    '<div class="gf-portrait-strips">'+tiles+'</div>'+
    '<span class="gf-image-label">'+(count===2?'DUAL':count===3?'THREE-WAY':count===4?'FOUR-WAY':count+'-WAY')+
    ' FUSION · '+count+' ORIGINAL PLAYERS</span></div>';
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


 // The reactor is a modal ON TOP of the live 82-0 court. Its user action
 // changes the actual active roster BEFORE any flashy cinematic reveal.
 function openDraft(cards,spent,used,onCommit){
  close();
  const screen=document.createElement('div');
  root=screen;
  screen.className='gf-overlay gf-draft-only gf-arena-reactor';
  screen.setAttribute('role','dialog');screen.setAttribute('aria-modal','true');
  screen.setAttribute('aria-label','Genesis reactor: fuse two 82-0 roster cards');
  document.body.appendChild(screen);
  let first=null,second=null,frameChoice='blend',outcome=null,stage='select',error='',timers=[];
  const key=(x,y)=>[x.id,y.id].sort().join('|');
  const valid=i=>cards[i]&&!used[cards[i].node.id];
  const from=i=>i==null?null:cards[i]?.node;
  const count=n=>F().lineageOf(n).length;
  const reduced=()=>HL.FX?.reduced?.()||HL.FX?.fxLevel?.()==='off';
  const clear=()=>{for(const timer of timers)clearTimeout(timer);timers=[];};
  const exit=()=>{clear();if(root===screen)close();};
  const caption=stage==='select'?'CHOOSE YOUR ANCESTORS':
    stage==='charge'?'CONSUMING SOURCE CARDS':
    stage==='collision'?'MERGING EVERY ORIGINAL PLAYER':
    stage==='stabilize'?'CALCULATING THE NEW IDENTITY':
    outcome?.ok?'HYBRID JOINS YOUR REAL TEAM':'NO HYBRID · BOTH CARDS LOST';
  function pickers(){
   const make=(side,selected,other)=>
    '<div class="gf-draft-source"><div class="caps">INPUT '+(side===0?'01':'02')+'</div>'+
    '<b>'+E(selected==null?'CHOOSE A TEAM CARD':cards[selected].node.name)+'</b>'+
    '<div class="gf-draft-picks">'+cards.map(({slot,node},i)=>
      '<button data-gf-pick="'+side+':'+i+'" '+(!valid(i)||i===other?'disabled':'')+
      ' class="'+(selected===i?'selected':'')+'">'+E(node.name)+
      '<small>'+E(slot)+' · '+node.ovr+' OVR · '+count(node)+' ORIGINALS</small></button>').join('')+
    '</div></div>';
   return '<div class="gf-draft-selection">'+make(0,first,second)+make(1,second,first)+'</div>';
  }
  function status(){
   const st=screen.querySelector('[data-fusion-stage]');
   if(st)st.textContent=stage==='select'?'SELECT TWO CARDS':stage==='charge'?'ANCESTOR SCANS ONLINE':
    stage==='collision'?'FUSION REACTION':stage==='stabilize'?'GENETIC STRUCTURE SETTLING':
    outcome?.ok?'GENESIS COMPLETE':'TOTAL FAILURE';
  }
  function paint(){
   if(root!==screen)return;
   const x=from(first),y=from(second),preview=x&&y&&!outcome?F().preview(x,y):null;
   const locked=preview&&spent[key(x,y)];
   const ancestry=outcome?.ok?F().lineageOf(outcome.node):
      x&&y?[...F().lineageOf(x),...F().lineageOf(y)]:[];
   const finished=stage==='result',charging=!['select','result'].includes(stage);
   const result=outcome&&finished?
    '<div class="gf-reactor-result '+(outcome.ok?'success':'failure')+'">'+
      '<div class="gf-reactor-verdict">'+(outcome.ok?'GENETIC STABILIZATION · SUCCESS':'GENETIC COLLAPSE · FAILED')+'</div>'+
      (outcome.ok?
       '<div class="gf-hybrid-name">'+E(outcome.node.name)+'</div>'+
       portrait(outcome.node,null)+
       '<div class="gf-result-power"><div><strong>'+outcome.node.ovr+'</strong><span>ON-COURT OVR</span></div>'+
       '<div><strong>'+count(outcome.node)+'</strong><span>INHERITED LEGENDS</span></div>'+
       '<div><strong>'+outcome.node.depth+'</strong><span>FUSION GENERATION</span></div></div>'+
       '<div class="gf-ability-list">'+Object.entries(outcome.node.mechanics||{}).slice(0,7).map(([id,n])=>
       '<div><strong>'+E(id.replace(/([A-Z])/g,' $1'))+'</strong>'+
       '<span>'+E(HL.DNA?.MECHANIC_TEXT?.[id]||'Specialized on-court possession effect.')+'</span>'+
       '<b>'+Math.round(n*100)+'% POWER</b></div>').join('')+'</div>'+
       '<p class="gf-reactor-meaning">'+ancestry.map(p=>E(p.name)).join(' + ')+
       ' → one real roster card. Every ancestor still contributes.</p>':
       '<div class="gf-failure-mark">NO SURVIVOR</div>'+
       '<p>'+E(outcome.failureReason||'The fusion destabilized.')+
       '</p><p>Both cards were consumed when the attempt started. Both roster slots are empty now.</p>')+
      '<button class="btn go big" data-gf-finish>RETURN TO MY TEAM</button></div>':'';
   screen.dataset.stage=stage;
   screen.innerHTML='<div class="gf-workbench gf-draft-workbench gf-fusion-chamber">'+
    '<div class="gf-top"><div><span>82-0 · LIVE TEAM FUSION</span>'+
    '<h2>GENESIS REACTOR</h2></div>'+
    '<button class="btn" data-gf-close '+(charging?'disabled':'')+'>'+
      (finished?'BACK TO TEAM':'CANCEL')+'</button></div>'+
    '<div class="gf-reactor-warning"><b>RISK:</b> BOTH CARDS ARE PERMANENTLY CONSUMED WHEN YOU FUSE. '+
      'SUCCESS GIVES ONE NEW CARD. FAILURE GIVES NOTHING. YOU CAN FUSE THAT NEW CARD AGAIN.</div>'+
    (stage==='select'?pickers():'')+
    (stage==='select'&&x&&y?portrait(x,y):'')+
    (preview&&stage==='select'?'<div class="gf-odds"><div class="gf-chance"><span>CHANCE OF SUCCESS</span>'+
      '<strong>'+preview.display+'</strong><div class="gf-probability"><i style="width:'+preview.chance+'%"></i></div></div>'+
      '<div class="gf-meters"><div><b>'+preview.affinity+'</b><span>Affinity</span></div>'+
      '<div><b>'+preview.tension+'</b><span>Instability</span></div>'+
      '<div><b>'+ancestry.length+'</b><span>Original Legends</span></div></div>'+
      '<div class="gf-risk-note">A '+ancestry.length+'-way hybrid retains all ancestor portraits. '+
       'Its basketball identity and real simulation ratings evolve with every successful fusion.</div></div>':'')+
    (charging?'<div class="gf-reactor-cinematic">'+
      '<div class="gf-reactor-status" data-fusion-stage></div>'+
      '<div class="gf-reactor-ring"><div class="gf-reactor-ring-inner">'+
      (outcome?.ok?portrait(outcome.node,null,true):portrait(x,y,true))+
      '</div></div><div class="gf-reactor-ancestors">'+ancestry.map((person,i)=>
      '<div style="--i:'+i+'"><span>'+E(person.name)+'</span></div>').join('')+'</div>'+
      '<div class="gf-reactor-progress"><i></i></div></div>':'')+
    (!outcome&&stage==='select'?'<div class="gf-controls"><label>BODY FRAME <select data-gf-frame>'+
     [['blend','Blend body'],['left','Input 01 frame'],['right','Input 02 frame']].map(([id,label])=>
     '<option value="'+id+'" '+(frameChoice===id?'selected':'')+'>'+label+'</option>').join('')+
     '</select></label><button class="btn go big" data-gf-roll '+(!preview||locked?'disabled':'')+
     '>CONSUME BOTH · ATTEMPT FUSION</button></div>':'')+
    (error?'<div class="gf-feedback">'+E(error)+'</div>':'')+result+'</div>';
   screen.querySelector('[data-gf-close]')?.addEventListener('click',exit);
   screen.querySelector('[data-gf-finish]')?.addEventListener('click',exit);
   screen.querySelector('[data-gf-frame]')?.addEventListener('change',e=>frameChoice=e.target.value);
   screen.querySelectorAll('[data-gf-pick]').forEach(btn=>btn.onclick=()=>{
    if(stage!=='select')return;
    const [side,i]=btn.dataset.gfPick.split(':').map(Number);
    if(!valid(i)||i===(side===0?second:first))return;
    if(side===0)first=i;else second=i;
    HL.FX?.sfx?.pop?.(1);paint();
   });
   screen.querySelector('[data-gf-roll]')?.addEventListener('click',()=>{
    if(!preview||locked||outcome||!valid(first)||!valid(second))return;
    try{
     outcome=F().attempt(x,y,{spent,frame:frameChoice});
     used[x.id]=true;used[y.id]=true;
     // Critical transaction: apply or destroy the REAL active roster cards now,
     // BEFORE the cinematic and independently of how the user closes it.
     if(onCommit?.(outcome,cards[first].slot,cards[second].slot)!==true)
      throw Error('The fusion attempt could not be committed to the current team.');
     stage='charge';paint();HL.FX?.sfx?.fusion?.('interior','interact');
     const pace=HL.FX?.fxLevel?.()==='lite'?.5:1;
     const go=(ms,next,sound)=>timers.push(setTimeout(()=>{
       if(root!==screen)return;stage=next;paint();if(sound)HL.FX?.sfx?.fusion?.('interior',sound);
       if(next==='result'){if(outcome.ok){
        HL.FX?.sfx?.achievement?.();HL.FX?.burst?.(screen.querySelector('.gf-portrait-multi'),['#f4d38d','#c6e5ff'],45,1.1);
       }else HL.FX?.sfx?.arena?.('loss');}
     },ms*pace));
     if(reduced()){stage='result';paint();}
     else{go(1050,'collision','climax');go(2280,'stabilize',null);go(3370,'result','result');}
    }catch(err){error=String(err?.message||err);stage='result';paint();}
   });
  }
  paint();screen.querySelector('[data-gf-close]')?.focus();
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
 return {open,openDraft,close,reset,portrait,profile,odds};
})();