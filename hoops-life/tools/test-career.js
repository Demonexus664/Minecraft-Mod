const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');const{load}=require('./load');
const files=['js/core/rng.js','data/names.js','data/injuries.js','data/nbaids.js','js/league/teams.js','js/league/ratings.js','js/league/player.js','js/league/gamesim.js','js/league/draft.js','js/league/history.js','js/media/engine.js','js/media/news.js','js/league/season.js','js/league/frontoffice.js','js/league/world.js','js/league/draftroom.js','data/history/index.js','data/history/seasons/2025.js','data/history/seasons/1983.js','data/history/seasons/1984.js'];
if(fs.existsSync(__dirname+'/../js/league/career.js'))files.push('js/league/career.js');const HL=load(files);
const config={name:'Jordan Vale',hometown:'Seattle',nationality:'USA',age:19,pos:'PG',arch:'playmaker',secondary:'sniper',height:76,weight:190,wingspan:80,hand:'right',number:11,personality:'driven',route:'college',season:2025,seed:11};
function fixture(extra={}){const r=HL.Career.create({...config,...extra});assert.equal(r.ok,true);return r.league;}
function result(L,gid,{min=24,pts=15,tpa=5}={}){const p=L.players[L.career.pid],opp=L.teams.find(t=>t.id!==p.teamId).id;return {g:{gid},res:{home:{teamId:p.teamId,score:100,box:min?{[p.id]:{...HL.blankStatLine(),gp:1,min,pts,tpa,ast:4,tov:2}}:{}},away:{teamId:opp,score:90,box:{}}}};}
test('creator rejects invalid bodies/names without changing the live league or RNG',()=>{
 const L=HL.League.createFromSeason({seasonKey:'2025',seed:4}),saved=JSON.stringify(L),seed=HL.RNG.getSeed();
 for(const bad of [{name:''},{height:999},{wingspan:70},{pos:'QB'},{age:12},{number:101},{weight:NaN},{arch:'unknown'}])assert.equal(HL.Career.create({...config,...bad}).ok,false);
 assert.equal(JSON.stringify(L),saved);assert.equal(HL.League.get(),L);assert.equal(HL.RNG.getSeed(),seed);
});
test('preview is repeatable, body choices affect attributes and it never grants 99 ability',()=>{
 HL.RNG.setSeed(44);const seed=HL.RNG.getSeed(),a=HL.Career.preview(config),b=HL.Career.preview(config),big=HL.Career.preview({...config,height:85,weight:260,wingspan:90});
 assert.deepEqual(a,b);assert.equal(HL.RNG.getSeed(),seed);assert.ok(a.player.ovr<75);assert.ok(big.player.attrs.str>a.player.attrs.str);assert.ok(big.player.attrs.speed<a.player.attrs.speed);
});
test('career owns only its inserted player, has earned capped minutes and saves identity',()=>{
 const L=fixture(),p=L.players[L.career.pid];assert.equal(L.mode,'career');assert.equal(L.settings.role,'player');assert.equal(p.real,false);assert.equal(p.number,11);assert.equal(p.yearsPro,0);
 assert.ok(p.realMpg>=5&&p.realMpg<=28);assert.equal(p.minutesLock,true);assert.ok(L.career.timeline.length);assert.equal(p.teamId,L.userTeamId);
 const reload=JSON.parse(JSON.stringify(L));HL.League.set(reload);assert.equal(reload.career.identity.hometown,'Seattle');
});
test('training spends decisions and energy, is incremental/capped, and stays private',()=>{
 const L=fixture(),p=L.players[L.career.pid],start=p.attrs.three,energy=L.career.energy,n=L.news.length;
 assert.equal(HL.Career.act(L,'train',{focus:'three'}).ok,true);assert.equal(p.attrs.three,start);assert.ok(L.career.energy<energy);assert.equal(L.news.length,n);
 HL.Career.act(L,'train',{focus:'three'});HL.Career.act(L,'train',{focus:'three'});const snap=JSON.stringify(L);
 assert.equal(HL.Career.act(L,'train',{focus:'three'}).ok,false);assert.equal(JSON.stringify(L),snap);
 for(let w=1;w<=10;w++){L.day=w*7;HL.Career.act(L,'train',{focus:'three'});}
 assert.equal(p.attrs.three,start,'training earns XP but never auto-spends points');
 assert.ok(L.career.skillPoints>0,'training grants skill points after enough XP');
 const before=L.career.skillPoints;const upgraded=HL.Career.upgrade(L,'three');
 assert.equal(upgraded.ok,true);assert.equal(p.attrs.three,start+1);
 assert.equal(L.career.skillPoints,before-HL.Career.upgradeCost(start));
 assert.ok(p.attrs.three<=p.caps.three);
});
test('invalid tendency edits are atomic; valid shot/effort values change only the career player',()=>{
 const L=fixture(),p=L.players[L.career.pid],snap=JSON.stringify(L);
 for(const bad of [{three:Infinity},{three:101},{notAStyle:20},{effort:'100'}])assert.equal(HL.Career.setTendencies(L,bad).ok,false);
 assert.equal(JSON.stringify(L),snap);assert.equal(HL.Career.setTendencies(L,{three:90,drive:10,effort:85}).ok,true);assert.equal(p.tend.three,90);
});
test('cash checks prevent debt; family decisions remain private and public charity has attributed coverage',()=>{
 const L=fixture(),n=L.news.length,money=L.career.cash;assert.equal(HL.Career.act(L,'car',{price:money+1}).ok,false);assert.equal(L.career.cash,money);
 assert.equal(HL.Career.act(L,'family').ok,true);assert.equal(L.news.length,n);assert.ok(L.career.people.family.trust>50);
 assert.equal(HL.Career.act(L,'charity',{amount:1000}).ok,true);assert.equal(L.career.cash,money-1000);assert.ok(L.news.at(-1).body.includes('1000'));assert.ok(L.news.at(-1).reactions.length>=2);
});
test('teammate support records the actual person with separate relationship memory',()=>{
 const L=fixture(),p=L.players[L.career.pid],mate=Object.values(L.players).find(q=>q.teamId===p.teamId&&q.id!==p.id);const before=HL.World.relationship(L,mate.id).trust;
 assert.equal(HL.Career.act(L,'teammate',{pid:mate.id}).ok,true);assert.ok(HL.World.relationship(L,mate.id).trust>before);assert.ok(L.career.timeline.at(-1).text.includes(mate.name));
});
test('income and game outcomes are exact-once; DNP logs no personal stats or fake scoring coverage',()=>{
 const L=fixture(),cash=L.career.cash,x=result(L,'g0',{min:0,pts:0});HL.Career.afterGame(L,x.g,x.res);const once=L.career.cash,n=L.news.length;
 assert.ok(once>cash);assert.equal(L.career.gameLog.at(-1).min,0);assert.equal(L.career.pendingPress,null);HL.Career.afterGame(L,x.g,x.res);assert.equal(L.career.cash,once);assert.equal(L.news.length,n);
 const reload=JSON.parse(JSON.stringify(L));HL.Career.afterGame(reload,x.g,x.res);assert.equal(reload.career.cash,once);
});
test('actual box score opens an interview; boast is quoted and judged against the next actual game',()=>{
 const L=fixture(),first=result(L,'first',{pts:22});HL.Career.afterGame(L,first.g,first.res);assert.ok(L.career.pendingPress);
 assert.equal(HL.Career.act(L,'presser',{tone:'confident'}).ok,true);assert.ok(L.news.at(-1).body.includes('20'));assert.ok(L.career.watches.some(w=>w.kind==='prediction'&&!w.resolved));
 const second=result(L,'second',{pts:7});HL.Career.afterGame(L,second.g,second.res);assert.ok(L.news.at(-1).body.includes('7'));assert.ok(L.news.at(-1).headline.toLowerCase().includes('prediction'));assert.ok(L.career.reputation<50);
});
test('party follow-up uses actual output and remains pending until a team game',()=>{
 const L=fixture();HL.Career.act(L,'party');assert.ok(L.career.watches.some(w=>w.kind==='party'));L.day+=2;HL.Career.beforeDay(L);
 const x=result(L,'party-game',{pts:4});HL.Career.afterGame(L,x.g,x.res);assert.ok(L.news.at(-1).body.includes('4'));assert.ok(L.career.watches.find(w=>w.kind==='party').resolved);
});
test('role request is subject to coach trust and competition instead of a forced starter edit',()=>{
 const L=fixture(),p=L.players[L.career.pid],mins=p.realMpg;L.career.people.coach.trust=10;
 assert.equal(HL.Career.act(L,'role').ok,true);assert.ok(p.realMpg<=mins);assert.ok(L.career.timeline.at(-1).text.includes('Earn'));
});
test('career playing style affects actual possessions, leaving neutral fitness intact',()=>{
 const L=fixture(),p=L.players[L.career.pid],home=L.teams[p.teamId],away=L.teams.find(t=>t.id!==p.teamId);
 p.realMpg=32;p.minutesLock=true;const H={...home,players:HL.League.teamPlayers(home.id)},A={...away,players:HL.League.teamPlayers(away.id)},rules={...L.rules,injuryMult:0};
 let low=0,high=0;for(let seed=1;seed<=12;seed++){p.tend.three=0;HL.RNG.setSeed(seed);low+=HL.simGame(H,A,rules).home.box[p.id]?.tpa||0;p.tend.three=100;HL.RNG.setSeed(seed);high+=HL.simGame(H,A,rules).home.box[p.id]?.tpa||0;}assert.ok(high>low);
 p.careerFitness=1;HL.RNG.setSeed(5);const base=HL.simGame(H,A,rules);delete p.careerFitness;HL.RNG.setSeed(5);assert.deepEqual(JSON.parse(JSON.stringify(base)),JSON.parse(JSON.stringify(HL.simGame(H,A,rules))));
});
test('retirement and return preserve the life save while requiring an actual team offer',()=>{
 const L=fixture(),p=L.players[L.career.pid];assert.equal(HL.Career.retire(L).ok,true);assert.equal(p.teamId,null);assert.equal(L.career.retired,true);assert.ok(L.career.timeline.at(-1).text.includes('retired'));
 assert.equal(HL.Career.unretire(L).ok,true);const offers=HL.Career.offers(L);assert.ok(offers.length);assert.equal(HL.Career.sign(L,offers[0].teamId).ok,true);assert.ok(p.teamId!=null);assert.equal(p.retired,null);
});
test('offseason retains actual season report and protects user progression, tendencies and contract',()=>{
 const L=fixture({season:1983}),p=L.players[L.career.pid];L.phase='offseason';p.stats['1983']={...HL.blankStatLine(),gp:10,min:220,pts:120,teamId:p.teamId};L.career.people.coach.trust=60;
 const three=p.tend.three=92,deal=JSON.stringify(p.contract);assert.equal(HL.Career.advance(L).ok,true);assert.equal(L.season,1984);assert.equal(L.career.seasons[0].stats.pts,120);assert.equal(p.tend.three,three);assert.equal(JSON.stringify(p.contract),deal);assert.ok(p.teamId!=null);assert.equal(p.retired,undefined);
});
test('player mode cannot transact for the front office or draft other players',()=>{
 const L=fixture(),p=L.players[L.career.pid],other=L.teams.find(t=>t.id!==p.teamId),theirs=HL.League.teamPlayers(other.id)[0];
 const q=HL.FrontOffice.tradePreview(L,{teamId:other.id,send:[p.id],receive:[theirs.id]});assert.equal(q.ok,false);
 L.phase='offseason';HL.DraftRoom.prepare(L);HL.DraftRoom.lottery(L);HL.DraftRoom.simulate(L,true);
 const snap=JSON.stringify(L);assert.equal(HL.DraftRoom.pick(L,L.draftRoom.prospects.at(-1).id).ok,false);assert.equal(JSON.stringify(L),snap);
});
test('career player cannot be automatically trimmed from a crowded protected roster',()=>{
 const L=fixture(),p=L.players[L.career.pid];HL.League.teamPlayers(p.teamId).forEach(q=>q.userRosterMove=true);p.ovr=50;L.phase='offseason';
 assert.equal(HL.Career.advance(L).ok,true);assert.ok(p.teamId!=null);
});
test('unsigned returning career player cannot be hired automatically as emergency depth',()=>{
 const L=fixture(),p=L.players[L.career.pid],oldTeam=L.userTeamId;
 HL.Career.retire(L);HL.Career.unretire(L);p.ovr=100;
 const deal=JSON.stringify(p.contract),g=L.schedule.find(g=>g.day===L.day),tid=g.home;
 HL.League.teamPlayers(tid).slice(7).forEach(q=>q.injury={name:'Test injury',games:80});
 HL.League.simDay();assert.equal(p.teamId,null);assert.equal(JSON.stringify(p.contract),deal);assert.equal(L.userTeamId,oldTeam);
});
test('legacy hardship flag cannot let emergency cleanup release the career player',()=>{
 const L=fixture(),p=L.players[L.career.pid],tid=p.teamId;p.hardship=true;
 const g=L.schedule.find(g=>g.home===tid||g.away===tid);L.day=g.day;
 HL.League.simDay();assert.equal(p.teamId,tid);
});


test('creator supports independent 99 potential and never gifts starting attributes',()=>{
 const c=HL.Career.preview(config),caps=Object.fromEntries(HL.ATTR_KEYS.map(k=>[k,99]));
 const custom=HL.Career.preview({...config,caps});assert.equal(custom.ok,true);
 assert.deepEqual(custom.player.attrs,c.player.attrs);
 assert.equal(custom.player.potential,99);
 assert.equal(custom.player.caps.three,99);
 assert.equal(HL.Career.preview({...config,caps:{three:20}}).ok,false);
 assert.equal(HL.Career.preview({...config,caps:{three:100}}).ok,false);
 const L=fixture({caps}),p=L.players[L.career.pid];assert.equal(p.caps.three,99);
 assert.equal(p.attrs.three,c.player.attrs.three);
});

test('earned upgrades are user-selected, do not change unrelated ratings, and stop at caps',()=>{
 const L=fixture(),p=L.players[L.career.pid],other=p.attrs.mid,start=p.attrs.three;
 L.career.skillPoints=50;
 assert.equal(HL.Career.upgrade(L,'imaginary').ok,false);
 assert.equal(p.attrs.three,start);
 assert.equal(HL.Career.upgrade(L,'three').ok,true);
 assert.equal(p.attrs.three,start+1);assert.equal(p.attrs.mid,other);
 assert.equal(HL.Career.upgrade(L,'three').ok,true);
 p.caps.three=p.attrs.three;
 const snap=JSON.stringify(p.attrs),points=L.career.skillPoints;
 assert.equal(HL.Career.upgrade(L,'three').ok,false);
 assert.equal(JSON.stringify(p.attrs),snap);assert.equal(L.career.skillPoints,points);
});

test('actual box-score XP is exact-once, DNP awards none, and outcomes affect earnings',()=>{
 const L=fixture(),c=L.career,base=c.xp;
 const {g,res}=result(L,'xp-box',{min:32,pts:34,tpa:10});
 const earned0=c.totalSkillPoints;
 HL.Career.afterGame(L,g,res);
 assert.ok(c.xp>base||c.skillPoints>0);
 assert.ok(c.gameLog.at(-1).xp>0);
 assert.equal(c.gameLog.at(-1).skillPoints,c.totalSkillPoints-earned0);
 const snapshot=JSON.stringify({xp:c.xp,points:c.skillPoints,games:c.gameLog.length});
 HL.Career.afterGame(L,g,res);
 assert.equal(JSON.stringify({xp:c.xp,points:c.skillPoints,games:c.gameLog.length}),snapshot);
 const {g:dnp,res:dr}=result(L,'dnp-xp',{min:0,pts:0,tpa:0});
 HL.Career.afterGame(L,dnp,dr);
 assert.equal(c.gameLog.at(-1).xp,0);
});
