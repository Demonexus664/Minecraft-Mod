const test=require('node:test'),assert=require('node:assert/strict');const {load,ctx}=require('./load');
const HL=load(['js/core/rng.js','data/names.js','data/injuries.js','data/nbaids.js','data/history/index.js','js/league/teams.js','js/league/ratings.js','js/league/player.js','js/league/history.js','js/league/legend-dna.js','js/league/gamesim.js','data/history/seasons/2015.js']);ctx.HL.UI={esc:String};ctx.HL.FX={};load(['js/modes/challenge820.js']);
const rows=HL.History.seasonRows('2015');
function team(club,id){return {id,abbr:club,strategy:HL.DEFAULT_STRATEGY(),players:rows.filter(r=>r.stints.some(s=>s[0]===club)).slice(0,12).map(r=>({...HL.History.makePlayer(r,2015,id),historicalPid:r.pid}))};}
function accounting(g){for(const s of [g.home,g.away]){assert.equal(Object.values(s.box).reduce((n,l)=>n+l.pts,0),s.score);assert.equal(s.quarters.reduce((n,x)=>n+x,0),s.score);for(const l of Object.values(s.box)){assert.ok(l.fgm<=l.fga&&l.tpm<=l.tpa&&l.ftm<=l.fta);}}assert.notEqual(g.home.score,g.away.score);}
test('clutch decisions occur on a real remaining possession and preserve boxes/quarters in both home orientations',()=>{
 let clutch=0;for(let seed=1;seed<=40;seed++){HL.RNG.setSeed(seed);const me=team('GSW',999),opp=team('CLE',2),session=HL.Challenge.createPlayoffSession(me,opp,{...HL.DEFAULT_RULES(),injuryMult:0},seed%2===0);const step=session.advance();if(step.pending){clutch++;const v=step.snapshot;assert.ok(v.period>=4&&v.seconds>0&&v.possessionTeamId===999);const pid=v.lineups[999][0].pid;const before=JSON.stringify(v);assert.equal(session.choose(-1,'three').ok,false);assert.equal(JSON.stringify(session.snapshot()),before);const choice=session.choose(pid,['three','fade','drive','pass'][seed%4]);assert.equal(choice.ok,true);accounting(choice.result);}else accounting(step.result);}
 assert.ok(clutch>=2,`${clutch} clutch games`);console.log(`40 playoff games: ${clutch} genuine interactive closing possessions`);
});
test('a full 82-game DNA season has valid totals and no tied outcomes',()=>{
 const me=team('GSW',999),opp=team('CLE',2);HL.DNA.applyTeam(me.players,me.players.map(p=>({pid:p.historicalPid,cat:p.pos,row:rows.find(r=>r.pid===p.historicalPid),season:2015})));let w=0,l=0,actions=0;
 for(let i=0;i<82;i++){HL.RNG.setSeed(400+i);const g=i%2?HL.simGame(opp,me,HL.DEFAULT_RULES()):HL.simGame(me,opp,HL.DEFAULT_RULES());accounting(g);const home=i%2===0,mine=home?g.home:g.away,other=home?g.away:g.home;mine.score>other.score?w++:l++;actions+=Object.values(g.events.dna?.[home?'home':'away']||{}).reduce((n,x)=>n+x,0);}
 assert.equal(w+l,82);assert.ok(actions>100);console.log(`82-game accounting: ${w}-${l}, ${actions} DNA action applications`);
});
