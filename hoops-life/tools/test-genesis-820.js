// 82-0 Genesis: lineage, irreversible failure, actual opponent gameplay.
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const {load}=require('./load');
const HL=load(['js/core/rng.js','data/injuries.js','js/league/ratings.js',
 'js/league/player.js','js/league/gamesim.js','js/league/fusion-lab.js']);
const F=HL.FusionLab;
const attr={...HL.buildAttributes(96,'C',85,'rimbig'),post:98,close:99,block:97,
 dreb:98,oreb:98,boxout:97,str:96,dunk:98,intD:97,speed:90,vert:96,
 contactFinish:99,stam:97};
const names=['Wilt Chamberlain','David Robinson',"Shaquille O'Neal"];
const base=[
 {id:'wilt',pid:'wilt',name:names[0],photo:'wilt.png',height:85,weight:275,attrs:{...attr},ovr:98},
 {id:'robinson',pid:'robinson',name:names[1],photo:'robinson.png',height:85,weight:250,attrs:{...attr,speed:96,block:99,intD:99,str:91},ovr:98},
 {id:'shaq',pid:'shaq',name:names[2],photo:'shaq.png',height:85,weight:325,attrs:{...attr,str:99,dunk:99,post:99,close:99,ft:55},ovr:98}
];
const dual=F.attempt(base[0],base[1],{roll:()=>0});
const triple=F.attempt(dual.node,base[2],{roll:()=>0});

test('Wilt + Robinson + Shaq keeps ALL three original player photos and names',()=>{
 assert.equal(dual.ok,true);assert.equal(triple.ok,true);
 assert.deepEqual(Array.from(F.lineageOf(triple.node),x=>x.name),names);
 assert.deepEqual(Array.from(F.lineageOf(triple.node),x=>x.photo),
  ['wilt.png','robinson.png','shaq.png']);
 assert.match(triple.node.name,/Chamberlain.*Robinson.*O'Neal/);
 assert.match(triple.node.name,/TRINITY|TRIAD/);
 assert.equal(triple.node.ancestorCount,3);
 for(const stat of ['post','block','dreb','oreb','str','close'])
  assert.ok(triple.node.attrs[stat]>=dual.node.attrs[stat]-1,
    stat+' must not disappear in the next generation');
 assert.ok(triple.node.mechanics.deepSeal>=1.5);
 assert.ok(triple.node.mechanics.rimIntimidation>=1.5);
 assert.ok(triple.node.mechanics.secondChance>=1.5);
});

test('fusion failure consumes the source attempt and creates no player',()=>{
 const spent={};
 const left={...base[0],id:'failA'},right={...base[1],id:'failB'};
 const bad=F.attempt(left,right,{roll:()=>.999999,spent});
 assert.equal(bad.ok,false);
 assert.equal(bad.node,undefined);
 assert.equal(Object.keys(spent).length,1);
 assert.throws(()=>F.attempt(left,right,{roll:()=>0,spent}),/already/);
});

test('actual game action is wired into the roster before cinematic results',()=>{
 const ui=fs.readFileSync(path.join(__dirname,'../js/core/fusion-ui.js'),'utf8');
 const mode=fs.readFileSync(path.join(__dirname,'../js/modes/challenge820.js'),'utf8');
 assert.match(ui,/onCommit\?\.\(outcome,cards\[first\]\.slot,cards\[second\]\.slot\)/);
 assert.match(ui,/stage='charge';paint\(\)/);
 assert.match(mode,/st\.lineup\[first\]=null;st\.lineup\[second\]=null/);
 assert.match(mode,/st\.lineup\[first\]=\{\.\.\.adapter,fusionId:outcome\.node\.id\}/);
 assert.match(mode,/genesisPower/);
 assert.match(mode,/data-fusion-open/);
 assert.doesNotMatch(ui,/Failure preserves both players/);
});

function roster(mode,opponent=false){
 const positions=['PG','SG','SF','PF','C','PG','SG','SF','PF','C'];
 const heights=[75,76,78,81,85,75,77,79,81,83];
 const ps=positions.map((pos,i)=>{
  const center=i===4,starter=i<5;
  const p=HL.createPlayer({name:(opponent?'Opp ':'Team ')+i,pos,age:26,
    height:heights[i],ovr:center?96:starter?82:67,
    arch:center?'rimbig':starter?'twoway':'defguard',real:false,season:2025});
  p.realMpg=starter?(center?(mode==='triple'?42:mode==='dual'?38:34):34):12;
  return p;
 });
 const center=ps[4],node=mode==='triple'?triple.node:mode==='dual'?dual.node:base[0];
 center.name=node.name;center.height=node.height;center.weight=node.weight;
 center.attrs=HL.completeAttributes({...node.attrs},node.height);
 center.ovr=HL.computeOvr(center.attrs,'C');
 const strategy=HL.DEFAULT_STRATEGY();
 strategy.starters=ps.slice(0,5).map(p=>p.id);
 if(mode!=='base'&&!opponent){
  const elite=mode==='triple',n=F.lineageOf(node).length;
  const t=HL.defaultTendencies(center);
  center.tend=HL.completeTendencies({...center,tend:{...t,
   usage:elite?99:87,shotHunt:elite?99:82,drive:elite?97:86,
   post:elite?99:90,crash:elite?99:94,drawFoul:elite?97:90,
   passFirst:elite?12:24,moveBall:elite?31:43,three:16,mid:32,iso:49}});
  center.genesisAncestors=n;
  center.genesisPower={usage:elite?2.35:1.55,paint:elite?1.62:1.24,
   boards:elite?1.65:1.25,rimProtection:elite?1.35:1.13};
  center.dna={mechanics:{...node.mechanics}};
  strategy.usageLock={[center.id]:center.genesisPower.usage};
 }
 return {id:opponent?89:82,name:opponent?'Opp':'You',strategy,players:ps};
}
function sample(mode,games=12){
 const sums={pts:0,reb:0,blk:0,min:0,team:0};
 for(let i=0;i<games;i++){
  HL.RNG.setSeed(45210+i);
  const mine=roster(mode),opponent=roster('base',true);
  const id=mine.players[4].id;
  HL.RNG.setSeed(94000+i);
  const result=HL.simGame(mine,opponent,HL.DEFAULT_RULES(),{});
  const stat=result.home.box[id];
  assert.ok(stat?.gp,mode+' center played');
  sums.pts+=stat.pts;sums.reb+=stat.orb+stat.drb;
  sums.blk+=stat.blk;sums.min+=stat.min;sums.team+=result.home.score;
 }
 return Object.fromEntries(Object.entries(sums).map(([k,v])=>[k,+(v/games).toFixed(1)]));
}
test('a full rotation + real possessions gives a 3-way GOAT center meaningful dominance',()=>{
 const ordinary=sample('base'),two=sample('dual'),three=sample('triple');
 assert.ok(three.pts>two.pts*1.12,JSON.stringify({ordinary,two,three}));
 assert.ok(three.pts>ordinary.pts*1.35,JSON.stringify({ordinary,two,three}));
 assert.ok(three.pts>=30,JSON.stringify({ordinary,two,three}));
 assert.ok(three.reb>=15,JSON.stringify({ordinary,two,three}));
 assert.ok(three.min<=48.5,'complete bench rotation remains active');
 console.log('GENESIS FULL BENCH BENCHMARK',JSON.stringify({ordinary,two,three}));
});
