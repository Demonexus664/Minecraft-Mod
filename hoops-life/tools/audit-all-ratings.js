// Full historical player-season audit. No player-specific rating overrides.
const fs=require('fs'), path=require('path');
const {load}=require('./load');
const seasonDir=path.join(__dirname,'../data/history/seasons');
const seasons=fs.readdirSync(seasonDir).filter(f=>/^\d{4}\.js$/.test(f));
const HL=load(['js/core/rng.js','js/league/ratings.js','js/league/player.js','js/league/history.js','data/history/index.js',...seasons.map(f=>'data/history/seasons/'+f)]);
const findings={}; const suspects=[]; let n=0;const values={};
const checks=[
 ['bigRebound',r=>r.trb*36/r.mpg>=11&&r.g>=25&&r.mpg>=20&&HL.HISTORY.players[r.pid][3]>=80,a=>(a.oreb+a.dreb+a.boxout)/3],
 ['highUsageDecision',r=>r.pts>=25&&r.g>=40&&r.mpg>=25,a=>a.shotSelection],
 ['highUsageClutch',r=>r.pts>=25&&r.g>=40&&r.mpg>=25,a=>a.clutchShot],
 ['eliteShooter',r=>r.pts>=20&&r.tpp>=.39&&r.g>=40,a=>a.three],
 ['highPlaymaker',r=>r.ast>=8&&r.g>=40,a=>a.vision],
 ['athleticGuard',r=>r.pts>=20&&r.g>=45&&HL.HISTORY.players[r.pid][3]<=76,a=>a.burst],
];
for(const k of HL.HISTORY.seasons){if(k.includes('-'))continue;for(const row of HL.History.seasonRows(k)||[]) {
 const a=HL.historicalAttributes(row), name=HL.HISTORY.players[row.pid][0];n++;
 for(const [label,test,get] of checks)if(test(row)){
 const v=+get(a).toFixed(1);(values[label]||=[]).push(v);if(v<85)suspects.push({label,name,year:k,pts:row.pts,trb:row.trb,mpg:row.mpg,ovr:row.ovr,v});
 }
}}
for(const [label,arr] of Object.entries(values)){arr.sort((a,b)=>a-b);findings[label]={count:arr.length,p10:arr[Math.floor(arr.length*.1)],median:arr[Math.floor(arr.length*.5)],p90:arr[Math.floor(arr.length*.9)],below85:arr.filter(x=>x<85).length};}
console.log(JSON.stringify({n,seasons:seasons.length,findings,suspects:suspects.filter(x=>x.v<78).sort((a,b)=>a.v-b.v).slice(0,55)},null,2));