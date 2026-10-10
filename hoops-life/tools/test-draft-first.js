// Draft-first regression tests: 82-0 fusion and clean Skill Draft workspace.
const test=require('node:test'),assert=require('node:assert/strict');
const vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
function setup(){
 const HL={UI:{esc:String,photo:()=>({src:''})},RNG:{setSeed(){}},FX:{},
   DNAFX:{reset(){}},DNA:{MECHANIC_TEXT:{},analyze:()=>({
     mutations:[],pairs:[],trios:[],signatures:[]}),reconcileAttributes:a=>({attrs:a,constraints:[]})},
   HISTORY:{players:{
      curry:['Stephen Curry',201939,'PG',75,185],
      kobe:['Kobe Bryant',977,'SG',78,210],
      shaq:['Shaquille ONeal',406,'C',85,325]
    }},
   historicalAttributes:r=>r.attrs,
   historicalSeasonOvr:r=>r.ovr,
   computeOvr:a=>Math.round((a.three+a.post+a.mid+a.handle)/4),
   clamp:(x,min,max)=>Math.max(min,Math.min(max,x)),TEAMS:[]};
 const ctx={HL,window:{HL},console};
 vm.runInNewContext(read('js/league/fusion-lab.js'),ctx);
 const code=read('js/modes/challenge820.js');
 const needle='return { open: () => { st = null; render(); }, LINEAGE,';
 assert.ok(code.includes(needle));
 vm.runInNewContext(code.replace(needle,
  'return {__draft:{newRun,genesisPanel,assignFusion,fusionAllowed,fusionAt,draftFitChip,'+
  'refreshTeamDna,state:()=>st}, open: () => { st = null; render(); }, LINEAGE,'),ctx);
 const make=(id,year,three,post,handle,ovr=94)=>{
  const keys=['three','post','mid','handle','pass','perD','intD','str','speed','vert',
    'stam','steal','vision','iq','dunk','oreb','dreb','block','helpD'];
  const attrs=Object.fromEntries(keys.map(k=>[k,78]));
  Object.assign(attrs,{three,post,handle,mid:88});
  return {row:{pid:id,pos:HL.HISTORY.players[id][2],attrs,ovr},
    season:year,club:id==='curry'?'GSW':id==='kobe'?'LAL':'LAL'};
 };
 return {HL,api:HL.Challenge.__draft,make};
}
test('Genesis works with two drafted cards while keeping fair, fixed probabilities',()=>{
 const {HL,api,make}=setup();
 api.newRun({mode:'classic',decades:[2000],playSeason:2025});
 const s=api.state();
 assert.equal(api.fusionAllowed(),false);
 const a=make('curry',2016,99,40,97),b=make('kobe',2006,88,73,93);
 s.lineup.PG=a;s.lineup.SG=b;s.round=2;s.phase='spin';
 api.refreshTeamDna();
 assert.equal(api.fusionAllowed(),true);
 assert.match(api.genesisPanel(),/data-fusion-open/);
 const p=HL.FusionLab.fromDraftCard(a),q=HL.FusionLab.fromDraftCard(b);
 const odds=HL.FusionLab.preview(p,q);
 assert.ok(odds.chance>0&&odds.chance<100);
 assert.ok(Number.isFinite(odds.tension));
 assert.equal(HL.FusionLab.preview(p,q).chance,odds.chance);
});
test('fusion consumes one attempt for each drafted source, with no retries or chances increasing',()=>{
 const {HL,api,make}=setup();
 api.newRun({mode:'classic',decades:[2000],playSeason:2025});
 const s=api.state();const a=make('curry',2016,99,40,97),b=make('shaq',2000,35,99,52);
 s.lineup.PG=a;s.lineup.C=b;s.round=2;s.phase='spin';api.refreshTeamDna();
 const p=HL.FusionLab.fromDraftCard(a),q=HL.FusionLab.fromDraftCard(b);
 const fixed=HL.FusionLab.preview(p,q).chance;
 const out=HL.FusionLab.attempt(p,q,{roll:()=>.9999,spent:s.fusionSpent});
 s.fusionUsedCards[p.id]=true;s.fusionUsedCards[q.id]=true;
 assert.equal(out.ok,false);
 assert.equal(HL.FusionLab.preview(p,q).chance,fixed);
 assert.ok(s.fusionUsedCards[p.id]&&s.fusionUsedCards[q.id]);
 assert.throws(()=>HL.FusionLab.attempt(p,q,{roll:()=>0,spent:s.fusionSpent}),
   /ONE ATTEMPT/);
 assert.equal(s.lineup.PG,a);
 assert.equal(s.lineup.C,b);
});
test('success makes a real hybrid, consumes both originals and reopens one roster slot',()=>{
 const {HL,api,make}=setup();
 api.newRun({mode:'classic',decades:[2000],playSeason:2025});
 const s=api.state(),a=make('curry',2016,99,40,97),
 b=make('kobe',2006,88,73,93);
 s.lineup.PG=a;s.lineup.SG=b;s.round=2;s.phase='spin';api.refreshTeamDna();
 const p=HL.FusionLab.fromDraftCard(a),q=HL.FusionLab.fromDraftCard(b);
 const res=HL.FusionLab.attempt(p,q,{roll:()=>0,spent:s.fusionSpent});
 assert.equal(res.ok,true);
 assert.equal(api.assignFusion('PG',res.node),true);
 assert.equal(api.fusionAt('PG').id,res.node.id);
 assert.equal(s.lineup.SG,null);
 assert.equal(s.round,1);
 assert.equal(s.phase,'spin');
 assert.equal(Object.values(s.lineup).filter(Boolean).length,1);
 assert.equal(api.assignFusion('SG',res.node),false,'cannot clone a fused player');
});
test('daily challenge and HoopIQ cannot access altered fusion rosters',()=>{
 const {api,make}=setup();
 api.newRun({mode:'classic',decades:[2000],playSeason:2025,daily:true});
 const st=api.state();st.lineup.PG=make('curry',2016,99,40,95);
 st.lineup.C=make('shaq',2000,35,99,52);st.phase='spin';
 assert.equal(api.fusionAllowed(),false);
 assert.doesNotMatch(api.genesisPanel(),/data-fusion-open/);
 api.newRun({mode:'hoopiq',decades:[2000],playSeason:2025});
 const blind=api.state();blind.lineup.PG=st.lineup.PG;blind.lineup.C=st.lineup.C;
 blind.phase='spin';assert.equal(api.fusionAllowed(),false);
});
test('draft views separate roster, player skills and DNA from unrelated season menus',()=>{
 const skill=read('js/modes/skilldraft.js'),challenge=read('js/modes/challenge820.js');
 const ui=read('js/core/fusion-ui.js'),css=read('css/overhaul.css');
 assert.match(skill,/data-build-view/);
 assert.match(skill,/data-skill-filter/);
 assert.match(skill,/data-free-group/);
 assert.match(skill,/ABILITIES & COMBOS/);
 assert.match(skill,/newPairs|gainedPairs/);
 assert.doesNotMatch(skill,/out\.push\(rolePanel\(c\)\)/);
 assert.doesNotMatch(skill,/HL\.SkillPress\?\.resolve\(c,s\)/);
 assert.match(challenge,/data-team-view/);
 assert.match(challenge,/draftFitChip\(c\)/);
 assert.match(challenge,/FusionUI\?\.openDraft/);
 assert.match(ui,/function openDraft\(/);
 assert.match(ui,/used\[x\.id\]=true/);
 assert.match(css,/draft-workspace-tabs/);
 assert.match(css,/gf-draft-selection/);
 assert.match(css,/max-height:calc\(100dvh/);
});
