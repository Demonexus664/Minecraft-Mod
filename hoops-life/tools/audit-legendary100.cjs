const {load}=require('./load');
const path=require('path'),fs=require('fs');
const root=path.join(__dirname,'..');
const years=fs.readdirSync(path.join(root,'data/history/seasons')).filter(f=>/^\d{4}\.js$/.test(f));
const HL=load(['js/core/rng.js','data/history/index.js','js/league/ratings.js','js/league/history.js',...years.map(y=>'data/history/seasons/'+y)]);
let n=0,elite=0,pts100=0,who=new Map();
for(const f of years){const rows=HL.History.seasonRows(f.slice(0,4));if(!rows)continue;for(const r of rows){n++;const a=HL.historicalAttributes(r);const top=Object.entries(a).filter(([k,v])=>v===100);if(top.length){pts100++;const name=HL.HISTORY.players[r.pid][0];for(const [k] of top)who.set(name+'/'+k,(who.get(name+'/'+k)||0)+1)}if(HL.legendaryPeak(r))elite++;}}
console.log(JSON.stringify({playerSeasons:n,elitePeakSeasons:elite,seasonRecordsWith100Specialty:pts100,players:[...who].sort((a,b)=>b[1]-a[1]).slice(0,30)},null,2));