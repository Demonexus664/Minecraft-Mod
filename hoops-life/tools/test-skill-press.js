// Skill Draft Press Room deterministic contracts, historical coverage and receipts
const test=require('node:test'),assert=require('node:assert/strict');
const {load}=require('./load');
const HL=load(['js/media/skill-press.js']);
const P=HL.SkillPress;
function player(year=2029,options={}) {
 const season={yr:year-1,g:78,games:82,w:61,l:21,ppg:29.1,rpg:7.2,apg:7.3,ovr:91,
   made:true,champion:false,awards:[],rival:{pid:42,name:'MVP Rival',
   win:false,myScore:42.2,theirScore:57.3},...options};
 return {yr:year,age:26,done:false,me:{name:'My Player'},
   seasons:[season],press:{image:50,trust:50,heat:12,history:[]}};
}
test('pre-NBA careers have no fictional press scandal',()=>{
 const c={yr:1962,age:19,seasons:[],done:false};
 assert.equal(P.beat(c),null);
 assert.equal(P.panel(c),'');
 assert.equal(P.respond(c,'bold').ok,false);
});
test('press responds to actual losing an MVP rivalry and remembers one public quote per offseason',()=>{
 const c=player();const b=P.beat(c);
 assert.equal(b.id,'rival');
 const r=P.respond(c,'rival');assert.equal(r.ok,true);
 assert.equal(c.press.pledge.kind,'rival');
 assert.equal(c.press.heat,27);
 assert.equal(P.respond(c,'bold').ok,false);
 const html=P.panel(c);
 assert.match(html,/STATEMENT IS ON RECORD/);
 assert.match(html,/MVP Rival/);
 assert.ok(!html.includes('data-press="bold"'),'cannot make two statements in one year');
});
test('guaranteed 30 PPG is actually settled by the next season, with real downside and caps',()=>{
 const c=player(2030,{ppg:31.4,champion:false,rival:null});
 const r=P.respond(c,'bold');assert.equal(r.ok,true);
 assert.equal(c.press.pledge.kind,'30ppg');
 const failed={yr:2030,g:78,games:82,ppg:28.8,made:true,rival:null};
 let result=P.resolve(c,failed);
 assert.equal(result.won,false);
 assert.equal(result.impact,-11);
 assert.equal(c.press.image,40);
 assert.equal(c.press.pledge.status,'lost');
 assert.equal(P.resolve(c,failed),null,'no double-dipping on the same season');
 assert.equal(c.press.history.at(-1).receipt,'28.8 PPG');
 assert.ok(P.market(c)<1);
 const next={...c,yr:2031,press:{...c.press,lastYear:2030,pledge:null}};
 P.respond(next,'bold');
 const succeeded={yr:2031,g:79,games:82,ppg:33.1,rival:null};
 assert.equal(P.resolve(next,succeeded).won,true);
 assert.ok(next.press.image>c.press.image);
});
test('quiet answers lower the pressure without free attributes or phantom wins',()=>{
 const c=player();
 const original=JSON.stringify(c.me);
 const r=P.respond(c,'quiet');assert.ok(r.ok);
 assert.equal(c.press.pledge,null);
 assert.equal(c.press.trust,53);
 assert.equal(c.press.heat,5);
 assert.equal(JSON.stringify(c.me),original);
 assert.ok(P.market(c)>=.92&&P.market(c)<=1.09);
});
test('the era changes media technology and loaded content is HTML-escaped',()=>{
 const pre=player(1986,{rival:{pid:3,name:'<script>alert(1)</script>',win:false,myScore:37.1,theirScore:42.1}});
 const old=P.panel(pre);
 assert.match(old,/SPORTS DESK/);
 assert.match(old,/FRONT PAGE/);
 assert.doesNotMatch(old,/CLIPFEED/);
 assert.doesNotMatch(old,/<script>/);
 assert.match(old,/&lt;script&gt;/);
 const modern=P.panel(player(2029));
 assert.match(modern,/CLIPFEED/);
 assert.match(modern,/data-press="bold"/);
});
test('press consequences stay bounded even across a long career of callouts',()=>{
 const c=player(2026);
 for(let yr=2026;yr<=2066;yr++){
   c.yr=yr;c.seasons.at(-1).yr=yr-1;
   c.press.lastYear=null;
   P.respond(c,'bold');
   P.resolve(c,{yr,g:75,games:82,ppg:10,made:false});
 }
 assert.ok(c.press.image>=0&&c.press.image<=100);
 assert.ok(c.press.heat>=0&&c.press.heat<=100);
 assert.ok(P.market(c)>=.92&&P.market(c)<=1.09);
 assert.ok(c.press.history.length<=24);
});

test('named-rival callouts track that exact athlete, not an unrelated MVP contender',()=>{
 const c=player(2032);
 P.respond(c,'rival');
 assert.equal(c.press.pledge.rivalId,42);
 const win=P.resolve(c,{yr:2032,g:80,games:82,
   rival:{pid:300,name:'Unrelated MVP Leader',win:false},
   pressTarget:{pid:42,available:true,name:'MVP Rival',won:true,myScore:62,theirScore:55}});
 assert.equal(win.won,true);
 assert.match(win.measure,/Outperformed MVP Rival/);
 assert.equal(c.press.pledge.status,'won');
});
test('a retiring or unqualified named rival voids the public challenge without slander penalty',()=>{
 const c=player(2032);
 P.respond(c,'rival');
 const before=c.press.image;
 const out=P.resolve(c,{yr:2032,g:82,games:82,pressTarget:{pid:42,available:false}});
 assert.equal(out.won,null);
 assert.equal(out.impact,0);
 assert.equal(c.press.image,before);
 assert.equal(c.press.pledge.status,'void');
 assert.match(P.panel({...c,yr:2033,seasons:[...c.seasons,{yr:2032,ppg:23.1,
   apg:5,rpg:5,w:40,l:42,made:false}]}),/NO CONTEST/);
});
