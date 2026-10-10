// Basketball possession evidence drives 82-0 Film IQ
const test=require('node:test'),assert=require('node:assert/strict');
const {load}=require('./load');
const HL=load(['js/league/film-iq.js']);
const F=HL.FilmIQ;
const side=(team,stat,score)=>({team,score,box:{1:{gp:1,...stat}}});
const values={
 fgm:30,fga:82,tpm:6,tpa:29,ftm:14,fta:17,orb:8,drb:28,tov:17,ast:17,stl:6,blk:4
},opp={
 fgm:42,fga:90,tpm:14,tpa:30,ftm:21,fta:24,orb:15,drb:34,tov:8,ast:31,stl:10,blk:7
};
test('bad turnovers, opponent threes and rebounding are diagnosed from actual box stats',()=>{
 const result=F.analyze(side('You',values,80),side('Rival',opp,119),{defense:'drop',pace:75});
 const flags=result.flags.map(f=>f.key);
 assert.ok(flags.includes('turnovers'));
 assert.ok(flags.includes('perimeter')||flags.includes('glass'));
 assert.equal(result.measures.oppThree,46.7);
 assert.equal(result.measures.turnovers,17);
 assert.equal(result.measures.rebounds,36);
 assert.equal(result.scheme.defense,'drop');
 assert.ok(result.flags.every(f=>f.detail&&f.adjustment));
});
test('a narrow victory still gets a genuine clue without being labeled a loss',()=>{
 const own=side('You',{...values,fgm:44,tov:8,ast:28},111);
 const other=side('Rival',{...values,fgm:44,tov:10,ast:24},109);
 const a=F.analyze(own,other,{defense:'switch'});
 assert.ok(a.flags.some(f=>f.key==='clutch'||f.key==='balanced'));
 assert.equal(a.measures.margin,2);
});
test('observed tactic record is presented as win-loss and actual net margin',()=>{
 const g=[{g:1,opp:'Celtics',for:90,against:125,win:false,
    film:F.analyze(side('You',values,90),side('Rival',opp,125))},
   {g:2,opp:'Knicks',for:125,against:122,win:true,
    film:F.analyze(side('You',{...values,fgm:50,tov:4},125),side('Rival',opp,122))}];
 const schemes={'switch · motion · 60':{games:2,wins:1,pf:215,pa:247}};
 const sf=F.seasonFilm(g,schemes);
 assert.equal(sf.records[0].games,2);
 assert.equal(sf.records[0].wins,1);
 assert.equal(sf.records[0].losses,1);
 assert.equal(sf.records[0].avgDiff,-16);
 assert.equal(sf.featured.length,2);
 const html=F.render(g,schemes);
 assert.match(html,/FILM IQ/);
 assert.match(html,/GAME 1/);
 assert.match(html,/1-1/);
 assert.match(html,/-16\.0 net PPG/);
});
test('scouting overlays escape team names and never invent data for empty boxes',()=>{
 const clean=F.analyze(side('You',{},0),side('Rival',{},0));
 assert.equal(clean.measures.fg,0);
 assert.ok(clean.flags.length>0);
 const html=F.render([{g:8,opp:'<img src=x onerror=alert(1)>',for:98,against:123,
 win:false,film:clean}],{});
 assert.doesNotMatch(html,/<img/);
 assert.match(html,/&lt;img/);
 assert.match(html,/No coaching data recorded/);
});
