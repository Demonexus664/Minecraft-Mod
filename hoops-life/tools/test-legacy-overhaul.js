const test=require('node:test'), assert=require('node:assert/strict');
const {load}=require('./load');
const HL=load(['js/core/rng.js','js/league/legacy-experience.js']);
function stats(patch={}) {return {pts:24*1000,g:1000,reb:9500,ast:7600,stl:1200,blk:2300,tpm:1400,tpa:3500,fga:18000,fta:7100,tov:2900,fgm:9200,ftm:6200,...patch};}
function season(yr,ppg=26){return {yr,g:80,ppg,rpg:10,apg:7,w:67,l:15,line:{pts:ppg*80,blk:200,stl:130},team:{name:'Thunder'},awards:[],champion:false};}
function career(o={}) {
 const seasons=Array.from({length:13},(_,i)=>season(2009+i,26+i*.2));
 return {seasons,totals:stats(),ptotals:{g:190},prime:{attrs:{mid:95,fade:96,intD:96,perD:80,dunk:92,contactFinish:91}},awards:[...Array.from({length:5},()=>({award:'MVP'})),...Array.from({length:3},()=>({award:'DPOY'}))],rings:5,teams:['Thunder'],altered:[],log:[],legacy:{rank:1},...o};
}
test('specialty awards demand years, volume and production, not merely a 99 rating',()=>{
 const weak=career({totals:stats({tpm:0,tpa:0,pts:7500}),seasons:[season(2020,8)],rings:0,awards:[],ptotals:{g:0},legacy:{rank:1}});
 const titles=HL.Legacy.careerReport(weak).titles;
 assert.equal(titles.some(t=>t.name==='Generational Three-Point Shooter'),false);
 assert.equal(HL.Legacy.careerReport(weak).goatQualified,false);
 const strong=career();
 assert.equal(HL.Legacy.careerReport(strong).goatQualified,true);
});
test('shooting title respects both long-range volume and efficiency',()=>{
 const good=career({totals:stats({tpm:3500,tpa:7900})});
 assert.ok(HL.Legacy.careerReport(good).titles.some(t=>t.name==='Generational Three-Point Shooter'));
 const poor=career({totals:stats({tpm:3500,tpa:11200})});
 assert.equal(HL.Legacy.careerReport(poor).titles.some(t=>t.name==='Generational Three-Point Shooter'),false);
});
test('82-0 identity titles follow the actual box score and avoid fake 3-point awards before 1979',()=>{
 const line={pts:2100,fgm:740,fga:1700,tpm:390,tpa:900,ftm:230,fta:260,ast:510,stl:120,blk:105,orb:200,drb:630,tov:160,min:4000};
 const lines=Object.fromEntries(Array.from({length:8},(_,i)=>[i,{...line}]));
 const r={w:75,l:7,games:82,pf:128,pa:109,lines,players:[],gameLog:Array.from({length:82},(_,g)=>({opp:'Rival',home:g%2===0,for:130,against:g<75?104:132,win:g<75}))};
 const modern=HL.Legacy.teamReport(r,2025,'arc');
 assert.ok(modern.labels.some(x=>x.name==='Arc Architects'));
 assert.ok(modern.narrative.length>=4);
 const old=HL.Legacy.teamReport(r,1978,'arc');
 assert.ok(!old.labels.some(x=>x.name==='Arc Architects'));
});
test('all game plans specify valid basketball strategies',()=>{
 const focuses=new Set(['balanced','inside','perimeter','star','motion']);
 const defenses=new Set(['man','zone','switch','drop','press']);
 for(const plan of Object.values(HL.Legacy.gamePlans)){
  assert.ok(focuses.has(plan.focus));assert.ok(defenses.has(plan.defense));
  assert.ok(plan.pace>=0&&plan.pace<=100);
 }
});