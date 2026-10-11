const test=require('node:test'),assert=require('node:assert/strict');const {load,ctx}=require('./load');
const HL=load(['js/core/rng.js','data/history/index.js','data/history/career-traits.js','js/league/ratings.js','js/league/legend-dna.js']);ctx.HL.UI={esc:String};ctx.HL.FX={};load(['js/modes/challenge820.js','js/modes/skilldraft.js']);
function career(rating=80,longevity=80,primeLength=80){return {prime:{attrs:Object.fromEntries(HL.ATTR_KEYS.map(k=>[k,rating])),longevity,primeLength,height:78},me:{pos:'SF',height:78,traits:{workEthic:80}},seasons:[],age:19};}
function viable(c){const years=[];for(let age=19;age<=100;age++){c.age=age;c.me.attrs=HL.SkillDraft.ratingsAt(c,age);c.me.ovr=HL.computeOvr(c.me.attrs,c.me.pos);if(HL.SkillDraft.careerDemand(c).eligible)years.push(age);}return years;}
test('a maximum prime card alone does not give an ordinary build a decades-long plateau',()=>{
 const c=career(80,80,99),w=HL.SkillDraft.primeWindow(c);assert.ok(w.end<=39);assert.ok(HL.SkillDraft.ratingsAt(c,45).speed<60);
});
test('extraordinary durability has a rare extended career, not 50 viable seasons',()=>{
 const c=career(99,99,99);assert.equal(HL.SkillDraft.extraordinaryLongevity(c),true);const years=viable(c);
 assert.ok(years.length>=17&&years.length<=30,`${years.length} eligible ages`);
 assert.ok(HL.SkillDraft.careerLimit(c)<=25,'No 45–55 year NBA career');
 assert.ok(HL.SkillDraft.primeWindow(c).seasons<=14,'Even all-time greats decline');
 assert.ok(!HL.SkillDraft.extraordinaryLongevity(career(99,99,80)));
});
test('200 varying ordinary builds and elite builds have sensible viability distributions',()=>{
 HL.RNG.setSeed(19);const counts=[];
 for(let i=0;i<200;i++){const c=career(HL.RNG.int(62,97),HL.RNG.int(45,95),HL.RNG.int(45,99));counts.push(viable(c).length);}
 const mean=counts.reduce((a,b)=>a+b,0)/counts.length;assert.ok(mean>=5&&mean<23,`mean ${mean}`);assert.ok(Math.max(...counts)<35,`max ${Math.max(...counts)}`);
 console.log(`ordinary viability sample: mean ${mean.toFixed(1)}, max ${Math.max(...counts)}, n=200`);
});
test('injury history reduces physical viability without erasing learned shooting skill',()=>{
 const healthy=career(90,85,85),hurt=career(90,85,85);hurt.seasons=[{injury:{games:55,lasting:true}},{injury:{games:45,lasting:true}}];
 const a=HL.SkillDraft.ratingsAt(healthy,36),b=HL.SkillDraft.ratingsAt(hurt,36);assert.ok(b.speed<a.speed);assert.ok(b.ft>=b.speed);assert.ok(viable(hurt).length<viable(healthy).length);
});
test('automatic minors pause after two empty years but a manual comeback remains possible',()=>{
 const c=career(55,50,50);c.seasons=[{minors:true},{minors:true}];c.pending={type:'minors'};
 assert.equal(HL.SkillDraft.shouldPauseAuto(c),true);assert.equal(c.done,undefined);
 c.seasons.push({minors:false,g:50});assert.equal(HL.SkillDraft.shouldPauseAuto(c),false);
});
