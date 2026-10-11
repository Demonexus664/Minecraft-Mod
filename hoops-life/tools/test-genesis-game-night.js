// Batch 4: arbitrary player fusion, real choices and ability telemetry.
const test=require('node:test'),assert=require('node:assert/strict'),
 fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {load,ctx}=require('./load');
const HL=load(['js/core/rng.js','js/league/ratings.js','js/league/legend-dna.js',
 'js/league/fusion-lab.js','js/modes/game-night.js','js/league/ability-replay.js']);
HL.UI={esc:s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&gt;'}[c]))};
function player(pid,name,height,attrs) {
 return {id:'archive:'+pid,pid,name,height,weight:height*2.55,depth:0,ancestry:[pid],
   attrs:Object.fromEntries((HL.ATTR_KEYS||['three','mid','post','speed']).map(k=>
     [k,attrs[k]??73])),ovr:92,photo:'test.png'};
}
const curr=player('curryst01','Stephen Curry',75,{three:99,mid:94,handle:96,post:29,
 str:50,vision:93,releaseSpeed:95,speed:88,vert:58});
const shaq=player('onealsh01',"Shaquille O'Neal",85,{three:30,post:99,
 str:99,contactFinish:99,oreb:95,block:91,speed:65,vert:78});
const kobe=player('bryanko01','Kobe Bryant',78,{three:85,mid:98,
 handle:92,shotCreation:97,clutchShot:99,speed:88,releaseSpeed:90,post:78});

test('every parent pairing is accepted but incompatibility makes a paradox difficult',()=>{
 const F=HL.FusionLab;
 const good=F.preview(curr,kobe),strange=F.preview(curr,shaq);
 assert.ok(good.chance>strange.chance,JSON.stringify({good,strange}));
 assert.ok(strange.chance>0&&strange.chance<15);
 assert.equal(strange.family,'Impossible Gravity');
 assert.ok(good.tags.includes('creation')||good.tags.includes('quickRelease'));
});
test('failure preserves parents and fixes probability after failure',()=>{
 const F=HL.FusionLab,old=F.creations().length;
 const before=F.preview(curr,shaq).chance;
 const out=F.attempt(curr,shaq,{roll:()=>.999});
 assert.equal(out.ok,false);
 assert.ok(out.failureReason&&out.echo);
 assert.equal(F.creations().length,old);
 assert.equal(F.preview(curr,shaq).chance,before);
 assert.equal(curr.attrs.three,99);
});
test('a successful hybrid has inheritance tradeoffs, and can be a parent again',()=>{
 const F=HL.FusionLab;
 const first=F.attempt(curr,kobe,{roll:()=>0});
 assert.equal(first.ok,true);
 const node=first.node;
 assert.equal(node.depth,1);
 assert.ok(node.strengths.length>0);
 assert.ok(node.ancestry.includes('curryst01')&&node.ancestry.includes('bryanko01'));
 assert.ok(node.attrs.three>=94&&node.attrs.mid>=94,'elite shooters retain their real signature skills');
 assert.ok(Object.values(node.attrs).some(v=>v<80),'fusion still has basketball weaknesses outside its specialties');
 assert.ok(node.mechanics&&Object.keys(node.mechanics).length>0);
 const next=F.attempt(node,shaq,{roll:()=>0,frame:'right'});
 assert.equal(next.ok,true);
 assert.equal(next.node.depth,2);
 assert.ok(next.node.ancestry.includes('onealsh01'));
 assert.ok(next.node.ancestry.length<=3);
 assert.ok(next.node.tradeoffs.length>0);
 const baseline={attrs:Object.fromEntries(HL.ATTR_KEYS.map(k=>[k,60])),
    height:77,weight:195,dna:{},mechanics:{}};
 const projected=F.project(baseline,node);
 const n=HL.ATTR_KEYS.filter(k=>projected.attrs[k]!==baseline.attrs[k]).length;
 assert.ok(n<=10,'equipping selectively upgrades skills rather than all attributes');
 assert.ok(projected.fusionReport.changes.length<=6);
});
test('season strategy choices change REAL simulator settings with bounded fatigue cost',()=>{
 const G=HL.GameNights,me={id:77,name:'My Player'},team={strategy:{pace:50,focus:'balanced',
 defense:'man',crash:50,usageLock:{}}};
 const log={game:21,opponent:'Bucks',record:'13-7'};
 G.apply(team,me,'takeover',log);
 assert.equal(team.strategy.focus,'star');
 assert.equal(team.strategy.usageLock[77],1.27);
 assert.equal(log.wear,2);
 G.apply(team,me,'run',log);
 assert.equal(team.strategy.pace,91);
 assert.equal(team.strategy.defense,'press');
 G.apply(team,me,'share',log);
 assert.equal(team.strategy.focus,'motion');
 assert.ok(team.strategy.usageLock[77]<1);
 assert.match(G.recap([{game:21,opponent:'Bucks',title:log.title,win:true,points:118,
 allowed:111,record:'13-7'}]),/GAME NIGHT DECISIONS/);
});
test('real DNA activations are counted and escaped in an independent replay',()=>{
 const A=HL.AbilityReplay,counts={};
 A.accumulate(counts,{dna:{home:{gravitySpace:8,quickRelease:5},away:{rimIntimidation:3}}},'home');
 A.accumulate(counts,{dna:{home:{quickRelease:2},away:{rimIntimidation:9}}},'away');
 assert.deepEqual({...counts},{gravitySpace:8,quickRelease:5,rimIntimidation:9});
 const rows=A.rows(counts);
 assert.equal(rows[0].key,'rimIntimidation');
 const html=A.render(counts);
 assert.match(html,/Weak-side shot intimidation/);
 assert.match(html,/9<small> TRIGGERS/);
 assert.doesNotMatch(html,/<script>/);
});
test('NBA game-night interactive path and sync path are both available',()=>{
 const source=fs.readFileSync(path.join(__dirname,'../js/modes/skilldraft.js'),'utf8');
 assert.match(source,/function\* simSeasonFlow/);
 assert.match(source,/async function simSeasonInteractive/);
 assert.match(source,/const id=yield \{type:'game-night'/);
 assert.match(source,/await playSeason\(c,true\)/);
 assert.match(source,/HL\.AbilityReplay\?\.accumulate/);
 assert.match(source,/gameNights:nightEvents/);
});

test('successful fusion creations persist across a real browser-style reload',()=>{
 const storage=new Map();
 const localStorage={getItem:k=>storage.has(k)?storage.get(k):null,
   setItem:(k,v)=>storage.set(k,v)};
 const raw=fs.readFileSync(path.join(__dirname,'../js/league/fusion-lab.js'),'utf8');
 const newInstance=()=>{
  const h={ATTR_KEYS:HL.ATTR_KEYS,computeOvr:HL.computeOvr,DNA:HL.DNA};
  vm.runInNewContext(raw,{window:{HL:h},HL:h,localStorage});
  return h.FusionLab;
 };
 const F1=newInstance(),r=F1.attempt(curr,kobe,{roll:()=>0});
 assert.equal(r.ok,true);
 assert.equal(r.persisted,true);
 const F2=newInstance();
 assert.equal(F2.creations().length,1);
 assert.equal(F2.find(r.node.id).name,r.node.name);
 assert.ok(F2.history().length>0);
 F2.reset();
 assert.equal(newInstance().creations().length,0,'explicit reset is the only deletion');
});

test('Genesis portraits use a real split-photo seam and display inheritance costs',()=>{
 const css=fs.readFileSync(path.join(__dirname,'../css/fusion-lab.css'),'utf8');
 const js=fs.readFileSync(path.join(__dirname,'../js/core/fusion-ui.js'),'utf8');
 assert.match(css,/gf-photo-half\.left\{clip-path:polygon/);
 assert.match(css,/gf-photo-half\.right\{clip-path:polygon/);
 assert.match(css,/\.gf-genome/);
 assert.match(css,/\.gf-collection/);
 assert.match(js,/gf-failed-reading/);
 assert.match(js,/node\.strengths/);
 assert.match(js,/node\.tradeoffs/);
});
