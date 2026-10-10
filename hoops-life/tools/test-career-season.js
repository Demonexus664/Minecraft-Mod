// Two real schedule/playoff cycles exercise the new Career hooks and offseason contract path.
const assert=require('node:assert/strict');const{load}=require('./load');
const HL=load(['js/core/rng.js','data/names.js','data/injuries.js','data/nbaids.js','js/league/teams.js','js/league/ratings.js','js/league/player.js','js/league/gamesim.js','js/league/draft.js','js/league/history.js','js/media/engine.js','js/media/news.js','js/league/season.js','js/league/frontoffice.js','js/league/world.js','js/league/draftroom.js','js/league/career.js','data/history/index.js','data/history/seasons/2025.js']);
const r=HL.Career.create({...HL.Career.defaults,name:'Season Runner',pos:'SG',seed:44});assert.equal(r.ok,true);const L=r.league,p=L.players[L.career.pid],start=p.ovr;
for(let season=0;season<2;season++){
 let guard=0;while(L.phase!=='offseason'&&guard++<400){
  if(L.day%7===0){HL.Career.act(L,'train',{focus:'three'});HL.Career.act(L,'film');HL.Career.act(L,'recover');}
  if(L.career.pendingPress)HL.Career.act(L,'presser',{tone:'humble'});
  HL.League.simDay();
 }
 assert.equal(L.phase,'offseason');HL.Career.offseason(L);
 const last=L.career.seasons.at(-1);assert.equal(last.season,L.season);assert.ok(last.stats.gp>0);assert.ok(L.career.earnings>0);
 console.log(`${L.season}: ${last.stats.gp} appearances, ${(last.stats.pts/last.stats.gp).toFixed(1)} PPG, ${(last.stats.min/last.stats.gp).toFixed(1)} MPG, OVR ${p.ovr}, earnings ${Math.round(L.career.earnings)}`);
 if(p.contract.exp<=L.season){const offer=HL.Career.offers(L)[0];assert.ok(offer);assert.equal(HL.Career.sign(L,offer.teamId).ok,true);}
 assert.equal(HL.Career.advance(L).ok,true);assert.ok(p.teamId!=null);assert.equal(p.retired,undefined);
}
assert.ok(p.ovr>start);assert.equal(L.career.seasons.length,2);
const ids=Object.values(L.players).map(p=>p.id);assert.equal(new Set(ids).size,ids.length);
console.log('PASS two full Career season/playoff/offseason cycles, earned growth, actual stats, pay and contract continuity');
