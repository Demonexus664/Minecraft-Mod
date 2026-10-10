// Fusion family visual director + audio mixer + Skill Draft role consistency
const test=require('node:test'),assert=require('node:assert/strict'),
  fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');

const root=path.join(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
test('four distinct gameplay-linked fusion film sequences',()=>{
 const source=read('js/core/dna-fx.js');
 const HL={DNA:{esc:x=>String(x).replace(/</g,'&lt;'),MECHANIC_TEXT:{
   gravity:'Pulls help defenders away from the rim',postDouble:'Doubles at the block'
 }},FX:{fxLevel:()=> 'full'}};
 const ctx={HL,window:{HL},document:{},matchMedia:()=>({matches:false})};
 vm.runInNewContext(source.replace('return {reveal,reset,close};',
  'return {reveal,reset,close,__test:{CHOREOGRAPHY,mechanicReport,family}};'),ctx);
 const d=HL.DNAFX.__test;
 assert.deepEqual(Object.keys(d.CHOREOGRAPHY).sort(),['defense','flight','interior','shooting']);
 assert.equal(new Set(Object.values(d.CHOREOGRAPHY).map(f=>f.headline)).size,4);
 assert.equal(d.family({family:'glass'}),'interior');
 assert.equal(d.family({family:'defense'}),'defense');
 const html=d.mechanicReport({mechanics:{gravity:.9,postDouble:.6}});
 assert.match(html,/LIVE GAME MECHANICS/);
 assert.match(html,/90% intensity/);
 assert.match(html,/Pulls help defenders away from the rim/);
 assert.doesNotMatch(html,/<script>/);
 assert.match(source,/HL\.FX\?\.sfx\?\.fusion/);
 assert.match(source,/FX\?\.fxLevel/);
});

test('FX controls have audible default, capped volume, and safe cinematic switch',()=>{
 const source=read('js/core/fx.js');
 const data=new Map();
 const doc={documentElement:{setAttribute(k,v){this[k]=v;}},querySelector:()=>null};
 const HL={},ctx={HL,window:{HL,matchMedia:()=>({matches:false})},document:doc,
   localStorage:{getItem:key=>data.has(key)?data.get(key):null,setItem:(k,v)=>data.set(k,v)},
   setTimeout(){},console};
 vm.runInNewContext(source,ctx);
 const FX=HL.FX;
 assert.equal(FX.volume(),.75);
 assert.equal(FX.setVolume(.3),.3);
 assert.equal(FX.volume(),.3);
 assert.equal(FX.setVolume(9),1);
 assert.equal(FX.setVolume(-9),0);
 FX.setFxLevel('lite');
 assert.equal(FX.fxLevel(),'lite');
 FX.setFxLevel('off');
 assert.equal(FX.fxLevel(),'off');
 assert.match(FX.soundToggle(),/data-volume/);
 assert.equal(typeof FX.sfx.fusion,'function');
 assert.equal(typeof FX.sfx.camera,'function');
 assert.equal(typeof FX.sfx.arena,'function');
});

test('visual designs have mechanical specificity, mobile layout and motion escape',()=>{
 const css=read('css/overhaul.css'),index=read('index.html');
 for(const selector of ['.dna-fusion-mechanics','.press-choice','.press-phone',
   '.press-classic','.sound-level','.dna-fusion-hero'])assert.ok(css.includes(selector),selector);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/data-fx-level=off/);
 assert.match(index,/js\/media\/skill-press\.js/);
 assert.match(index,/css\/overhaul\.css/);
});

test('career season shows press receipts as story outcomes, not fabricated boosts',()=>{
 const mode=read('js/modes/skilldraft.js'),press=read('js/media/skill-press.js');
 assert.match(mode,/HL\.SkillPress\?\.resolve\(c,s\)/);
 assert.match(mode,/HL\.SkillPress\.market\(c\)/);
 assert.match(mode,/data-press/);
 assert.match(mode,/PUBLIC PROMISE/);
 assert.match(mode,/originalMinutes/);
 assert.match(mode,/p\.realMpg=minutes/);
 assert.match(mode,/_skillRoleBaseline/);
 assert.match(press,/pledge/);
 assert.match(press,/next season|Future contract-market/);
});
