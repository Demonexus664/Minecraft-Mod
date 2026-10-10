const test=require('node:test'),assert=require('node:assert/strict');
const {load}=require('./load');
const HL=load(['js/league/legend-dna.js']);
const DNA=HL.DNA;
HL.HISTORY={players:{curryst01:['Stephen Curry'],bryanko01:['Kobe Bryant'],onealsh01:["Shaquille O'Neal"]}};
test('elite duo/trio and team-chain catalog is substantially expanded',()=>{
 assert.ok(DNA.COMBO_DUOS.length>=35);
 assert.ok(DNA.COMBO_TRIOS.length>=22);
 assert.ok(DNA.TEAM_CHAINS.length>=13);
 const names=DNA.COMBO_TRIOS.map(x=>x[1]);
 assert.ok(names.includes('The Four-Level Bag'));
 assert.ok(names.includes('Unscripted Floor General'));
 assert.ok(names.includes('No Rest on Defense'));
});
test('power map renders actual player sources, activation triggers and strength instead of fake OVR',()=>{
 const pair={id:'mix:three:contested',name:'Logo Pressure Specialist',type:'elite-duo',
   players:['curryst01','bryanko01'],ingredients:[
    {pid:'curryst01',cat:'three',season:2016},
    {pid:'bryanko01',cat:'contested',season:2006}
   ],mechanics:{range:.69,clutchChoice:.9},colors:['#a1ffba','#6688ff'],
   activation:'Activates when a late-clock three-point shot is contested.',
   description:'Deep range changes shot opportunities and the late-clock counter.',
   qualification:'Verified high-level skills on both cards.'};
 const dna={mode:'skill',signatures:[],pairs:[pair],trios:[],mutations:[],active:[pair]};
 const html=DNA.powerMap(dna);
 assert.match(html,/POWER NETWORK/);
 assert.match(html,/Stephen Curry/);
 assert.match(html,/Kobe Bryant/);
 assert.match(html,/90% potency/);
 assert.match(html,/Activates when/);
 assert.match(html,/UNDISCOVERED ELITE DUOS/);
 assert.doesNotMatch(html,/automatic 99 overall/);
});
test('rarity network never requires a mutation for every drafted card',()=>{
 assert.ok(DNA.RECIPES.length>0);
 const example={mode:'skill',signatures:[],pairs:[],trios:[],mutations:[],active:[]};
 assert.match(DNA.powerMap(example),/Draft your first verified/);
 assert.equal(DNA.preview([], {pid:'nobody',cat:'mid',row:null,season:1981}),null);
});
