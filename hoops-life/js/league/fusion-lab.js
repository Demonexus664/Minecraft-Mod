// Genesis: any historical player or crafted fusion can be merged recursively.
window.HL=window.HL||{};
HL.FusionLab=(function(){
 const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
 let creations=[],history=[],tries={},serial=0;
 const tagMap={curryst01:['gravity','range','quickRelease','relocation'],onealsh01:['deepSeal','postDouble','contactBalance','secondChance'],
  bryanko01:['creation','clutchChoice','highRelease'],jordami01:['creation','clutchChoice','transition'],
  jamesle01:['transition','postRead','contactBalance'],jokicni01:['postRead','precision','screenRead'],
  wembavi01:['rimIntimidation','rotations','highRelease'],pippesc01:['laneDisruption','rotations'],
  duranke01:['highRelease','gravity','creation'],rodmade01:['boxPosition','secondChance']};
 function tags(p){
  if(p.tags?.length)return p.tags;
  const a=p.attrs||{};
  const candidates=[['gravity',a.three],['creation',a.handle],['deepSeal',a.post],['contactBalance',a.str],
    ['precision',a.vision],['laneDisruption',a.steal],['rimIntimidation',a.block],
    ['lob',a.vert],['secondChance',a.oreb],['rotations',a.helpD],['clutchChoice',a.clutchShot]];
  return [...new Set([...(tagMap[p.pid]||[]),...candidates.filter(c=>c[1]>=82).sort((a,b)=>b[1]-a[1]).slice(0,3).map(c=>c[0])])].slice(0,8);
 }
 const overall=p=>p.ovr||Math.round(Object.values(p.attrs||{}).filter(Number.isFinite).reduce((a,b)=>a+b,0)/
  Math.max(1,Object.values(p.attrs||{}).filter(Number.isFinite).length));
 function rating(a,b){
  const keys=['three','mid','dunk','post','handle','pass','perD','intD','speed','str','vert','vision'];
  const divergence=keys.reduce((n,k)=>n+Math.abs((a.attrs?.[k]??60)-(b.attrs?.[k]??60)),0)/keys.length;
  const height=Math.abs((a.height||78)-(b.height||78)),overlap=tags(a).filter(x=>tags(b).includes(x)).length;
  const load=(a.depth||0)+(b.depth||0),tension=divergence*.58+height*1.5+load*3;
  const power=clamp(72+Math.max(0,70-overlap*6)*.2+(overall(a)+overall(b)-155)*.22,64,100);
  let chance=clamp(55+overlap*7+(overall(a)+overall(b)-164)*.28-tension*1.8,1,89);
  if(height>=9&&divergence>=21)chance=Math.min(4.2,chance*.29);
  if(a.id===b.id)chance=Math.max(.6,chance*.25);
  const t=[...new Set([...tags(a),...tags(b)])].slice(0,9);
  const paradox=t.includes('gravity')&&t.includes('deepSeal');
  return {chance,affinity:clamp(Math.round(72-tension+overlap*5),0,100),tension:Math.round(tension),
   power:Math.round(power),family:paradox?'Impossible Gravity':overlap>=2?'Perfect Synchronization':
    height>=9?'Extremes of the Court':'Hybrid Weapon',tags:t};
 }
 const pairKey=(a,b)=>[a.id,b.id].sort().join('|');
 function preview(a,b){
  if(!a||!b)return null;
  const base=rating(a,b),repeats=tries[pairKey(a,b)]||0;
  const chance=Math.round(Math.max(.5,base.chance*Math.pow(.91,repeats))*10)/10;
  return {...base,chance,display:chance.toFixed(1)+'%',repeats,rare:chance<=8};
 }
 function combine(a,b,p,success){
  const attrs={};const keys=new Set([...Object.keys(a.attrs||{}),...Object.keys(b.attrs||{})]);
  for(const k of keys){
   const x=a.attrs?.[k]??65,y=b.attrs?.[k]??65;
   const v=success?Math.max(x,y)*.96+Math.min(x,y)*.04+(p.rare?5.5:p.chance<25?3.5:1.5):x*.58+y*.42;
   attrs[k]=Math.round(clamp(v,25,99));
  }
  return attrs;
 }
 function mechanics(p){
  const out={};for(const k of p.tags)if(HL.DNA?.MECHANIC_TEXT?.[k])out[k]=p.rare?1.3:.7;
  if(p.tags.includes('gravity')&&p.tags.includes('deepSeal'))Object.assign(out,
   {gravity:1.65,deepSeal:1.65,postRead:1.25});
  if(p.tags.includes('creation')&&p.tags.includes('quickRelease'))
   Object.assign(out,{creation:1.45,quickRelease:1.35,clutchChoice:1.3});
  if(p.tags.includes('rimIntimidation')&&p.tags.includes('laneDisruption'))
   Object.assign(out,{rimIntimidation:1.5,rotations:1.4,laneDisruption:1.3});
  return out;
 }
 function attempt(a,b,{roll=Math.random,frame='blend'}={}){
  if(!a||!b)throw Error('Select both fusion sources');
  const p=preview(a,b),r=clamp(Number(roll()),0,.9999999),ok=r<p.chance/100;
  tries[pairKey(a,b)]=(tries[pairKey(a,b)]||0)+1;
  const res={ok,chance:p.chance,roll:r,family:p.family,sourceA:a.name,sourceB:b.name,
   outcome:ok?(p.rare?'miracle':'stabilized'):r>.9?'unstable-echo':'fracture'};
  if(!ok){history.unshift(res);history=history.slice(0,80);return res;}
  const height=frame==='left'?a.height:frame==='right'?b.height:Math.round((a.height+b.height)/2);
  const weight=frame==='left'?a.weight:frame==='right'?b.weight:Math.round((a.weight+b.weight)/2);
  const attrs=combine(a,b,p,true),special=mechanics(p);
  const name=(p.rare?'APEX · ':'')+a.name.split(' ').at(-1)+' × '+b.name.split(' ').at(-1);
  const id='fusion:'+(++serial),pos=height>=81?'C':height>=79?'PF':height>=77?'SF':height>=75?'SG':'PG';
  const node={id,name,attrs,height,weight,ovr:HL.computeOvr?.(attrs,pos)||overall({attrs}),
   pos,depth:Math.max(a.depth||0,b.depth||0)+1,
   ancestry:[...(a.ancestry||[]),...(b.ancestry||[])],tags:p.tags,mechanics:special,
   heads:[a.name,b.name],images:[a.photo||a.images?.[0]||'',b.photo||b.images?.[1]||''],
   tier:p.rare?'apex':p.chance<25?'mythic':'fusion',family:p.family,rarity:p.chance,
   parentIds:[a.id,b.id],successChance:p.chance,dna:{mechanics:special,effects:{},links:[],mutations:[p.family]}};
  creations.unshift(node);res.node=node;history.unshift({...res,id});history=history.slice(0,80);
  return res;
 }
 async function historical(pid){
  const bio=HL.HISTORY?.players?.[pid];if(!bio)throw Error('Player not found');
  const lg=HL.HISTORY?.legacy?.[pid],debut=lg?.[9]||1946,end=lg?.[10]||HL.LATEST_SEASON||2025;
  const y=Math.round(clamp((bio[5]||1970)+26-1,debut,end)),years=[y,clamp(y-3,debut,end),clamp(y+3,debut,end)];
  let picked=null;
  for(const year of [...new Set(years)]){
   try{await HL.History.load(String(year));
    const row=HL.History.seasonRows(String(year))?.find(x=>x.pid===pid);
    if(row&&(!picked||HL.historicalSeasonOvr(row)>HL.historicalSeasonOvr(picked.row)))picked={row,year};}catch{}
  }
  if(!picked)throw Error('Archived player seasons could not load');
  let photo='';try{photo=HL.UI?.photo({name:bio[0],real:true,nbaId:bio[1]},null,picked.year)?.src||'';}catch{}
  const attrs=HL.historicalAttributes(picked.row);
  return {id:'archive:'+pid,pid,name:bio[0],nbaId:bio[1],attrs,height:bio[3]||78,weight:bio[4]||200,
   year:picked.year,ovr:HL.historicalSeasonOvr(picked.row),tags:tags({pid,attrs}),photo,
   depth:0,ancestry:[pid],tier:'archive'};
 }
 function project(build,node){
  if(!node)return build;
  const attrs={...build.attrs};
  for(const [k,v]of Object.entries(node.attrs||{}))if(Number.isFinite(v))
   attrs[k]=Math.max(attrs[k]||25,Math.round(clamp(v*.94+4,25,99)));
  const physical=HL.DNA.reconcileAttributes(attrs,node.height);
  return {...build,attrs:physical.attrs,height:node.height,weight:node.weight,
   mechanics:HL.DNA.mergeMechanics([{mechanics:build.mechanics||{}},{mechanics:node.mechanics}]),
   fusion:node,fusionReport:{id:node.id,ancestry:node.ancestry,depth:node.depth,tier:node.tier}};
 }
 function search(q){
  const term=String(q||'').trim().toLowerCase();if(term.length<2)return [];
  return Object.entries(HL.HISTORY?.players||{}).filter(([,p])=>p[0].toLowerCase().includes(term))
   .slice(0,24).map(([pid,p])=>({id:'archive:'+pid,pid,name:p[0],height:p[3]}));
 }
 const find=id=>creations.find(x=>x.id===id);
 const reset=()=>{creations=[];history=[];tries={};serial=0;};
 return {tags,overall,rating,preview,attempt,historical,project,search,find,reset,
  creations:()=>creations,history:()=>history};
})();