const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { load } = require('./load');
const files = ['js/core/rng.js','data/names.js','data/injuries.js','data/nbaids.js','js/league/teams.js','js/league/ratings.js','js/league/player.js','js/league/gamesim.js','js/league/draft.js','js/league/history.js','js/media/engine.js','js/media/news.js','js/league/season.js','js/league/frontoffice.js','js/league/world.js','data/history/index.js','data/history/seasons/2025.js','data/history/seasons/1983.js','data/history/seasons/1984.js'];
if (fs.existsSync(__dirname+'/../js/league/draftroom.js')) files.push('js/league/draftroom.js');
const HL=load(files);
function fixture(season=2025) {
 const L=HL.League.createFromSeason({seasonKey:String(season),seed:7,settings:{history:season===1983?'real':'random',role:'gm'}});
 L.userTeamId=0;L.teams.forEach((t,i)=>{t.w=i+10;t.l=82-t.w;});
 L.playoffs={field:{East:L.teams.filter((t,i)=>i>=14&&t.conf==='East').map(t=>t.id),West:L.teams.filter((t,i)=>i>=14&&t.conf==='West').map(t=>t.id)}};
 return L;
}
function ready(L) {L.phase='offseason';assert.equal(HL.DraftRoom.prepare(L).ok,true);assert.equal(HL.DraftRoom.lottery(L).ok,true);while(L.draftRoom.revealed<L.draftRoom.lottery.order.length)HL.DraftRoom.reveal(L);return L.draftRoom;}
test('preparation is idempotent, keeps prospects outside live rosters and reserves IDs for reload',()=>{
 const L=fixture();HL.DraftRoom.prepare(L);const saved=JSON.stringify(L),seed=HL.RNG.getSeed();
 const ids=L.draftRoom.prospects.map(p=>p.id);assert.equal(new Set(ids).size,ids.length);
 assert.ok(ids.every(id=>!L.players[id]));assert.ok(L.nextPid>Math.max(...ids));
 assert.equal(HL.DraftRoom.prepare(L).ok,true);assert.equal(JSON.stringify(L),saved);assert.equal(HL.RNG.getSeed(),seed);
 HL.League.set(JSON.parse(saved));const newcomer=HL.createPlayer({name:'After reload',age:20,height:78,pos:'SF',ovr:60});assert.ok(!ids.includes(newcomer.id));
});
test('modern lottery records four weighted draws once and round two retains reverse-record order',()=>{
 const L=fixture(),d=ready(L);assert.equal(d.lottery.drawn,4);assert.deepEqual(Array.from(d.lottery.entries.slice(0,3),e=>e.weight),[140,140,140]);
 const first=d.slots.slice(0,L.teams.length).map(s=>s.teamId),second=d.slots.slice(L.teams.length,L.teams.length*2).map(s=>s.teamId);
 assert.equal(new Set(first).size,L.teams.length);assert.deepEqual(Array.from(second),Array.from(d.lottery.baseOrder));
 const snap=JSON.stringify(L),seed=HL.RNG.getSeed();HL.DraftRoom.lottery(L);assert.equal(JSON.stringify(L),snap);assert.equal(HL.RNG.getSeed(),seed);
});
test('historical draft enters Jordan in 1984 and uses a two-club coin flip without territorial claims',()=>{
 const L=fixture(1983),d=ready(L);assert.ok(d.prospects.some(p=>p.name==='Michael Jordan'));
 assert.equal(d.year,1984);assert.equal(d.lottery.format,'coin');assert.equal(d.lottery.entries.length,2);assert.equal(d.slots[0].round,1);
 assert.equal(d.slots.length,L.teams.length*3);assert.equal(L.players[d.prospects.find(p=>p.name==='Michael Jordan').id],undefined);
});
test('1985/1987/1990 lottery formats use equal full order, equal top three and descending weights',()=>{
 for(const [year,format,drawn] of [[1985,'equal',14],[1987,'equal',3],[1990,'weighted',3],[1994,'weighted',3]]){
  const L=fixture();L.season=year-1;const d=ready(L);assert.equal(d.lottery.format,format);assert.equal(d.lottery.drawn,drawn);
  if(year<1990) assert.ok(d.lottery.entries.every(e=>e.weight===1));
  if(year===1990) assert.ok(d.lottery.entries[0].weight>d.lottery.entries[1].weight);
 }
});
test('scouting narrows uncertain reports, consumes a finite budget and stays private',()=>{
 const L=fixture();HL.DraftRoom.prepare(L);const p=L.draftRoom.prospects[0],n=L.news.length,before=HL.DraftRoom.report(L,p.id),seed=HL.RNG.getSeed();
 assert.equal(HL.RNG.getSeed(),seed);assert.equal(HL.DraftRoom.scout(L,p.id,'workout').ok,true);
 const after=HL.DraftRoom.report(L,p.id);assert.ok(after.ability[1]-after.ability[0]<before.ability[1]-before.ability[0]);assert.equal(after.notes.length,1);
 assert.equal(HL.DraftRoom.scout(L,p.id,'workout').ok,false);assert.equal(HL.DraftRoom.scout(L,p.id,'interview').ok,true);
 assert.ok(HL.DraftRoom.report(L,p.id).personality);assert.equal(L.draftRoom.sessions,10);assert.equal(L.news.length,n);
 const snap=JSON.stringify(L);assert.equal(HL.DraftRoom.scout(L,999999,'workout').ok,false);assert.equal(JSON.stringify(L),snap);
 for(const q of L.draftRoom.prospects.slice(1,11)) HL.DraftRoom.scout(L,q.id,'workout');
 assert.equal(L.draftRoom.sessions,0);assert.equal(HL.DraftRoom.scout(L,L.draftRoom.prospects[12].id,'workout').ok,false);
});
test('shortlist survives reload and delegation honors an available preferred prospect at own pick',()=>{
 const L=fixture();HL.DraftRoom.prepare(L);const p=L.draftRoom.prospects.at(-1);HL.DraftRoom.shortlist(L,p.id);
 const reload=JSON.parse(JSON.stringify(L));HL.League.set(reload);ready(reload);HL.DraftRoom.simulate(reload,true);
 assert.equal(HL.DraftRoom.current(reload).teamId,0);HL.DraftRoom.simulate(reload,false);
 assert.equal(reload.draftRoom.selections.find(s=>s.teamId===0).pid,p.id);
});
test('coach and other-team picks reject manual actions without mutations',()=>{
 const L=fixture(),d=ready(L);L.userTeamId=d.slots[0].teamId;L.settings.role='coach';const snap=JSON.stringify(L),pid=d.prospects[0].id;
 assert.equal(HL.DraftRoom.pick(L,pid).ok,false);assert.equal(HL.DraftRoom.scout(L,pid,'workout').ok,false);assert.equal(HL.DraftRoom.shortlist(L,pid).ok,false);assert.equal(JSON.stringify(L),snap);
 L.settings.role='gm';L.userTeamId=(d.slots[0].teamId+1)%L.teams.length;const before=JSON.stringify(L);assert.equal(HL.DraftRoom.pick(L,pid).ok,false);assert.equal(JSON.stringify(L),before);
});
test('picking once assigns real team/deal, rejects duplicate prospect and stores attributed reactions',()=>{
 const L=fixture(),d=ready(L);L.userTeamId=d.slots[0].teamId;const pid=d.prospects[0].id;
 assert.equal(HL.DraftRoom.pick(L,pid).ok,true);const s=d.selections[0];assert.equal(s.pid,pid);assert.equal(L.players[pid].teamId,L.userTeamId);assert.equal(L.players[pid].contract.exp,2029);
 const snap=JSON.stringify(L);assert.equal(HL.DraftRoom.pick(L,pid).ok,false);assert.equal(JSON.stringify(L),snap);
 assert.ok(L.news.at(-1).reactions.some(r=>r.voice.kind==='player'));assert.ok(HL.World.relationship(L,pid).memories.length);
 assert.ok(L.world.watches.some(w=>w.kind==='draftRookie'&&w.pid===pid));
});
test('an incomplete manual draft blocks rollover; completed picks and rookie contracts survive a crowded roster',()=>{
 const L=fixture(),d=ready(L);HL.DraftRoom.simulate(L,true);L.userTeamId=HL.DraftRoom.current(L).teamId;const pid=d.prospects.at(-1).id;HL.DraftRoom.pick(L,pid);
 const year=L.season;assert.equal(HL.League.advanceToNextSeason().ok,false);assert.equal(L.season,year);
 HL.DraftRoom.simulate(L,false);const team=L.players[pid].teamId,deal=JSON.stringify(L.players[pid].contract);
 HL.League.advanceToNextSeason();assert.equal(L.season,year+1);assert.equal(L.players[pid].teamId,team);assert.equal(JSON.stringify(L.players[pid].contract),deal);
 assert.equal(L.lastDraft.picks.filter(id=>id===pid).length,1);assert.equal(L.draftRoom,undefined);
 assert.ok(L.teams.every(t=>Object.values(L.players).filter(p=>!p.retired&&p.teamId===t.id).length<=15));
});
test('legacy/headless rollover delegates one draft without manual preparation',()=>{
 const L=fixture();L.phase='offseason';HL.League.advanceToNextSeason();assert.equal(L.season,2026);assert.equal(new Set(L.lastDraft.picks).size,L.lastDraft.picks.length);assert.ok(L.lastDraft.picks.length>0);
});
test('lottery and picks require offseason and a missing historical season does not mutate state',()=>{
 const L=fixture();HL.DraftRoom.prepare(L);const snap=JSON.stringify(L);assert.equal(HL.DraftRoom.lottery(L).ok,false);assert.equal(HL.DraftRoom.pick(L,L.draftRoom.prospects[0].id).ok,false);assert.equal(JSON.stringify(L),snap);
 const h=fixture(1983);h.season=1984;const before=JSON.stringify(h);assert.equal(HL.DraftRoom.prepare(h).ok,false);assert.equal(JSON.stringify(h),before);
});
test('rookie watch waits for five actual team games, counts DNP and is idempotent after reload',()=>{
 const L=fixture(),d=ready(L);L.userTeamId=d.slots[0].teamId;HL.DraftRoom.pick(L,d.prospects[0].id);const p=L.players[d.selections[0].pid];
 L.season++;const n=L.news.length,other=L.teams.find(t=>t.id!==p.teamId).id;
 for(let i=0;i<5;i++){
  const res={home:{teamId:p.teamId,score:100,box:i===0?{}:{[p.id]:{min:20,pts:10}}},away:{teamId:other,score:90,box:{}}};
  HL.World.afterGame(L,{gid:i},res);if(i<4)assert.equal(L.news.length,n);
 }
 assert.ok(L.news.at(-1).body.includes('8.0'));assert.ok(L.news.at(-1).body.includes('16.0'));
 const watch=L.world.watches.find(w=>w.kind==='draftRookie');assert.equal(watch.resolved,true);assert.equal(watch.games,5);
 const reload=JSON.parse(JSON.stringify(L)),news=reload.news.length;HL.World.afterGame(reload,{gid:4},{home:{teamId:p.teamId,score:100,box:{}},away:{teamId:other,score:90,box:{}}});assert.equal(reload.news.length,news);
});
test('lottery outcome remains out of the news until its reveal completes',()=>{
 const L=fixture();L.phase='offseason';HL.DraftRoom.prepare(L);const n=L.news.length;HL.DraftRoom.lottery(L);
 assert.equal(L.news.length,n);HL.DraftRoom.reveal(L);assert.equal(L.news.length,n);
 HL.DraftRoom.simulate(L,true);assert.equal(L.news.filter(n=>n.key==='draft.lottery').length,1);
});
test('second-round rookie deals meet the salary floor',()=>{
 const L=fixture();ready(L);HL.DraftRoom.simulate(L,false);const picks=L.draftRoom.selections.filter(s=>s.round===2);
 assert.ok(picks.every(s=>L.players[s.pid].contract.amount>=Math.round(1.2*HL.salaryScale(2026)*1000)/1000));
});
