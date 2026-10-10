const test=require('node:test');
const assert=require('node:assert/strict');
const {load}=require('./load');
const HL=load(['js/media/fanfeed.js']);
const feed=HL.FanFeed;

test('perfect 82-0 season gets grounded celebration, objective and true standout',()=>{
 const r={w:82,l:0,games:82,pf:121.2,pa:97.8,
   closeGames:5,closeWins:4,mission:{title:'The Impossible',completed:true},
   gameLog:[{g:22,opp:'Lakers',hero:{name:'Star Player',pts:56,reb:6,ast:5}}],
   bosses:[{g:21,opp:'Celtics',win:true}]};
 const posts=feed.season82(r);
 assert.ok(posts.some(p=>p.text.includes('82-0')));
 assert.ok(posts.some(p=>p.text.includes('Star Player')&&p.text.includes('56')));
 assert.ok(posts.some(p=>p.text.includes('objective cleared')));
 assert.ok(posts.some(p=>p.text.includes('Celtics')));
 assert.ok(!posts.some(p=>p.text.includes('The undefeated talk stopped')));
});

test('failed run acknowledges losses instead of guaranteed praise',()=>{
 const r={w:60,l:22,games:82,pf:112,pa:111,
   mission:{title:'The Impossible',completed:false},
   firstLoss:{g:12,opp:{name:'Knicks'}},losses:[{g:12}]};
 const posts=feed.season82(r);
 assert.ok(posts.some(p=>p.text.includes('game 12')&&p.mood==='heat'));
 assert.ok(posts.some(p=>p.text.includes('objective failed')));
 assert.ok(!posts.some(p=>p.text.includes('Every team in the league took a shot. Nobody won.')));
});

test('career reactions depend on actual rivalry, scoring, health and awards',()=>{
 const s={yr:2027,g:79,w:60,l:22,ppg:30.5,rpg:6.3,apg:8.1,
   team:{name:'Chicago Bulls'},counts:{g50:3,td:1},
   rival:{name:'Jordan Rival',win:false,myScore:45.2,theirScore:62.3},
   agenda:{title:'Scoring Crown',complete:true},champion:true,
   series:[{name:'First Round'},{name:'Semifinals'},{name:'Finals'}],
   awards:[{award:'MVP'}],injury:{games:16,name:'Ankle sprain'}};
 const posts=feed.skilldraft(s);
 assert.ok(posts.some(p=>p.text.includes('three')||p.text.includes('3 fifty-point')));
 assert.ok(posts.some(p=>p.text.includes('Jordan Rival')&&p.mood==='heat'));
 assert.ok(posts.some(p=>p.text.includes('summer development')));
 assert.ok(posts.some(p=>p.text.includes('title is real')));
 assert.ok(posts.length<=7);
});

test('fictional posts escape injected names and do not claim to be real accounts',()=>{
 const s={g:82,w:40,l:42,ppg:23,rpg:5,apg:5,team:{name:'<script>alert(1)</script>'},
   awards:[],counts:{g50:0,td:0}};
 const out=feed.render(feed.skilldraft(s));
 assert.ok(!out.includes('<script>'));
 assert.match(out,/&lt;script&gt;/);
 assert.match(out,/Fictional game-universe voices/);
 assert.ok(!feed.skilldraft({minors:true}).length);
});
