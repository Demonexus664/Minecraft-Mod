// Genesis: any historical player or crafted fusion can be merged recursively.
window.HL=window.HL||{};
HL.FusionLab=(function(){
 const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
 let creations=[],history=[],tries={},serial=0;
 const SAVE_KEY='hoops-life-genesis-v1';
 function save(){
  if(typeof localStorage==='undefined')return false;
  try{localStorage.setItem(SAVE_KEY,
   JSON.stringify({v:1,creations,history,tries,serial}));return true;}catch{return false;}
 }
 function restore(){
  try{
   const data=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');
   if(!data||data.v!==1)return false;
   creations=Array.isArray(data.creations)?data.creations.filter(n=>n?.id&&n?.attrs&&Array.isArray(n.parentIds)):[];
   history=Array.isArray(data.history)?data.history.slice(0,80):[];
   tries=data.tries&&typeof data.tries==='object'&&!Array.isArray(data.tries)?data.tries:{};
   serial=Math.max(+data.serial||0,...creations.map(n=>+(String(n.id).split(':')[1])||0),0);
   return true;
  }catch{return false;}
 }
 restore();
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
  if(paradox&&height>=8)chance=Math.min(chance,4.5);
  return {chance,affinity:clamp(Math.round(72-tension+overlap*5),0,100),tension:Math.round(tension),
   power:Math.round(power),family:paradox?'Impossible Gravity':overlap>=2?'Perfect Synchronization':
    height>=9?'Extremes of the Court':'Hybrid Weapon',tags:t};
 }
 const pairKey=(a,b)=>[a.id,b.id].sort().join('|');
 function preview(a,b){
  if(!a||!b)return null;
  const base=rating(a,b),repeats=tries[pairKey(a,b)]||0;
  // Repeated research brings a small bounded stabilization benefit. No pairing
  // becomes guaranteed and paradoxical specimens remain difficult.
  const chance=Math.round(clamp(base.chance+Math.min(12,repeats*1.4),.5,93)*10)/10;
  return {...base,chance,display:chance.toFixed(1)+'%',repeats,rare:chance<=8};
 }
 // Basketball genetics: strengths require actual complementary tools. A success
 // never simply takes BOTH parents' best number in every category.
 const PHYSICAL=new Set(['speed','accel','agility','burst','vert','stam','lateral']);
 const POST=new Set(['post','str','contactFinish','oreb','dreb','boxout','screen','intD','block']);
 const PERIMETER=new Set(['three','mid','shotCreation','handle','releaseSpeed','range','pass','vision','passingAccuracy']);
 function combine(a,b,p,height){
  const attrs={},strengths=[],tradeoffs=[];
  const keys=new Set([...Object.keys(a.attrs||{}),...Object.keys(b.attrs||{})]);
  const rare=p.rare?2.8:p.chance<25?1.4:.6;
  for(const k of keys){
   const x=a.attrs?.[k]??65,y=b.attrs?.[k]??65,best=Math.max(x,y),worst=Math.min(x,y);
   const overlap=Math.abs(x-y)<=12;
   const training=overlap?best*.88+worst*.12:best*.71+worst*.29;
   const frameCost=height>=82&&PHYSICAL.has(k)?Math.max(0,(height-80)*1.8):0;
   const smallCost=height<=76&&POST.has(k)?Math.max(0,(79-height)*1.4):0;
   const paradox=p.family==='Impossible Gravity'&&
     ((POST.has(k)&&height<=77)||(PERIMETER.has(k)&&height>=83))?2.1:0;
   const fatigue=(a.depth||0)+(b.depth||0);
   const val=clamp(Math.round(training+rare+paradox-frameCost-smallCost-Math.min(6,fatigue*.7)),25,99);
   attrs[k]=val;
   if(val>=88&&best>=90)strengths.push({key:k,value:val});
   if((frameCost+smallCost)>=3&&best-val>=4)tradeoffs.push({key:k,lost:Math.round(best-val),value:val});
  }
  return {attrs,strengths:strengths.sort((a,b)=>b.value-a.value).slice(0,8),
    tradeoffs:tradeoffs.sort((a,b)=>b.lost-a.lost).slice(0,6)};
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
  if(!ok){
   const mismatch=p.family==='Impossible Gravity'?'Body and playstyle pulled in opposite directions.':
    p.tension>=22?'Different athletic and skill profiles would not stabilize.':
    'The genetic roll did not stabilize a new basketball identity.';
   res.failureReason=mismatch;
   res.echo=r>.9?'A partial ability echo appeared, but the specimen did not stabilize.':'No viable hybrid was created.';
   history.unshift(res);history=history.slice(0,80);save();return res;
  }
  const height=frame==='left'?a.height:frame==='right'?b.height:Math.round((a.height+b.height)/2);
  const weight=frame==='left'?a.weight:frame==='right'?b.weight:Math.round((a.weight+b.weight)/2);
  const combined=combine(a,b,p,height);
  const limited=HL.DNA?.reconcileAttributes?HL.DNA.reconcileAttributes(combined.attrs,height):{attrs:combined.attrs,constraints:[]};
  const attrs=limited.attrs,special=mechanics(p);
  const cost=combined.tradeoffs;
  const name=(p.rare?'APEX · ':'')+a.name.split(' ').at(-1)+' × '+b.name.split(' ').at(-1);
  const id='fusion:'+(++serial),pos=height>=81?'C':height>=79?'PF':height>=77?'SF':height>=75?'SG':'PG';
  const node={id,name,attrs,height,weight,ovr:HL.computeOvr?.(attrs,pos)||overall({attrs}),
   pos,depth:Math.max(a.depth||0,b.depth||0)+1,
   ancestry:[...new Set([...(a.ancestry||[]),...(b.ancestry||[])])],tags:p.tags,mechanics:special,
   heads:[a.name,b.name],images:[a.photo||a.images?.[0]||'',b.photo||b.images?.[1]||''],
   tier:p.rare?'apex':p.chance<25?'mythic':'fusion',family:p.family,rarity:p.chance,
   parentIds:[a.id,b.id],successChance:p.chance,
   strengths:combined.strengths,tradeoffs:cost,constraints:limited.constraints,
   dna:{mechanics:special,effects:{},links:[],mutations:[p.family]}};
  creations.unshift(node);res.node=node;history.unshift({...res,id});history=history.slice(0,80);
  res.persisted=save();
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
  // Equipping changes up to six elite tools and the specimen's body, not every
  // rating. This preserves the importance of the actual Skill Draft.
  const tools=Object.entries(node.attrs||{}).filter(([k,v])=>Number.isFinite(v)&&v>=88)
   .sort((a,b)=>b[1]-a[1]).slice(0,6);
  const changes=[];
  for(const [k,v]of tools){
   const before=attrs[k]??65;
   const upgraded=Math.min(99,Math.round(Math.max(before,v*.87+before*.13)));
   attrs[k]=upgraded;
   if(upgraded>before)changes.push({key:k,from:before,to:upgraded});
  }
  const physical=HL.DNA.reconcileAttributes(attrs,node.height);
  const mechanisms=HL.DNA.mergeMechanics([{mechanics:build.mechanics||{}},{mechanics:node.mechanics}]);
  return {...build,attrs:physical.attrs,height:node.height,weight:node.weight,
   dna:{...(build.dna||{}),mechanics:mechanisms,mutations:[...(build.dna?.mutations||[]),node.family]},
   mechanics:mechanisms,fusion:node,
   fusionReport:{id:node.id,ancestry:node.ancestry,depth:node.depth,tier:node.tier,changes,
     tradeoffs:node.tradeoffs||[],active:Object.keys(node.mechanics||{})}};
 }
 function search(q){
  const term=String(q||'').trim().toLowerCase();if(term.length<2)return [];
  return Object.entries(HL.HISTORY?.players||{}).filter(([,p])=>p[0].toLowerCase().includes(term))
   .slice(0,24).map(([pid,p])=>({id:'archive:'+pid,pid,name:p[0],height:p[3]}));
 }
 const find=id=>creations.find(x=>x.id===id);
 // Only an explicit delete action should wipe the user's multi-run genome library.
 const reset=()=>{creations=[];history=[];tries={};serial=0;save();};
 const status=()=>({creations:creations.length,experiments:history.length,persisted:typeof localStorage!=='undefined'});

 return {tags,overall,rating,preview,attempt,historical,project,search,find,reset,
  creations:()=>creations,history:()=>history,status,save,restore};
})();