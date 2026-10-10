// HoopsLife DNA: season-specific player identity, deterministic multiway chemistry,
// historically grounded partnerships, mutation forms and bounded in-game effects.
// All effects are explicit and applied to simulated possessions, not just card labels.
window.HL = window.HL || {};
HL.DNA = (function () {
  const clamp = (n,lo,hi)=>Math.max(lo,Math.min(hi,n));
  const STARS = {
    curryst01:{name:'Stephen Curry',key:'gravity',title:'Limitless Gravity',style:'pull-up range, relocation and movement shooting',tone:'arc',bonus:{three:.033,assist:.014}, boost:{three:2,releaseSpeed:2}},
    thompkl01:{name:'Klay Thompson',key:'catch',title:'Catch-Fire Circuit',style:'quick-trigger catch-and-shoot efficiency',tone:'ember',bonus:{three:.022,assist:.025},boost:{releaseSpeed:2}},
    jordami01:{name:'Michael Jordan',key:'air',title:'Airborne Assassin',style:'mid-range footwork, drives and late-clock finishes',tone:'scarlet',bonus:{mid:.03,rim:.016,clutch:.023},boost:{fade:2,clutchShot:2}},
    jamesle01:{name:'LeBron James',key:'engine',title:'The Freight Train',style:'downhill playmaking and transition mismatches',tone:'royal',bonus:{rim:.022,assist:.024,transition:.02},boost:{contactFinish:2,vision:1}},
    onealsh01:{name:"Shaquille O'Neal",key:'force',title:'Paint Gravity',style:'deep seals, contact finishing and second chances',tone:'earth',bonus:{rim:.036,reb:.028},boost:{str:2,boxout:2}},
    wadedw01:{name:'Dwyane Wade',key:'flash',title:'Flash Step',style:'slashing angles and on-ball pressure',tone:'scarlet',bonus:{rim:.022,steal:.014},boost:{accel:2}},
    bryanko01:{name:'Kobe Bryant',key:'mamba',title:'Last Possession',style:'contested shot creation and tough fadeaways',tone:'royal',bonus:{mid:.027,clutch:.024},boost:{fade:2,contested:2}},
    duranke01:{name:'Kevin Durant',key:'tower',title:'Unblockable Arc',style:'long-release jumpers over close contests',tone:'arc',bonus:{mid:.018,three:.016},boost:{releaseHeight:3}},
    johnsma02:{name:'Magic Johnson',key:'showtime',title:'Showtime Vision',style:'fast-break creation and spectacular passing',tone:'gold',bonus:{assist:.039,transition:.026},boost:{vision:2}},
    birdla01:{name:'Larry Bird',key:'legend',title:'The Anticipator',style:'shooting anticipation and precision passing',tone:'emerald',bonus:{three:.018,mid:.021,assist:.012},boost:{shotSelection:2}},
    chambwi01:{name:'Wilt Chamberlain',key:'tower',title:'Above the Rim',style:'overwhelming finishing and interior glass',tone:'earth',bonus:{rim:.023,reb:.028,block:.015},boost:{vert:2,oreb:2}},
    antetgi01:{name:'Giannis Antetokounmpo',key:'freak',title:'Full-Court Collision',style:'length, speed and overwhelming paint pressure',tone:'emerald',bonus:{rim:.03,transition:.02,block:.008},boost:{contactFinish:2}},
    irvinky01:{name:'Kyrie Irving',key:'dance',title:'Handle Laboratory',style:'change of direction and unorthodox finishing',tone:'violet',bonus:{rim:.013,mid:.015},boost:{handle:2,shotCreation:2}},
    greendr01:{name:'Draymond Green',key:'anchor',title:'Defensive Conductor',style:'switchable defense, anticipatory rotations and passing',tone:'emerald',bonus:{defense:.024,assist:.015},boost:{helpD:3}},
    pippesc01:{name:'Scottie Pippen',key:'wing',title:'The Shadow',style:'wing pressure, transition defense and lane disruption',tone:'scarlet',bonus:{defense:.024,steal:.018},boost:{perD:2}},
    rodmade01:{name:'Dennis Rodman',key:'glass',title:'Possession Thief',style:'tireless box-outs and offensive rebounds',tone:'earth',bonus:{reb:.045},boost:{oreb:3,boxout:2}},
    boschch01:{name:'Chris Bosh',key:'stretch',title:'Stretch Connector',style:'spacing and defensive versatility',tone:'scarlet',bonus:{three:.012,defense:.012},boost:{mid:2}},
    olajuha01:{name:'Hakeem Olajuwon',key:'dream',title:'Dream Shake',style:'deceptive low-post footwork and elite rim defense',tone:'emerald',bonus:{rim:.023,block:.020},boost:{post:2,footwork:3}},
    duncati01:{name:'Tim Duncan',key:'fundamentals',title:'Bank & Anchor',style:'bank-shot touch, defensive positioning and box-outs',tone:'earth',bonus:{mid:.014,defense:.023,reb:.012},boost:{helpD:2,boxout:2}},
    garneke01:{name:'Kevin Garnett',key:'switch',title:'All-Court Anchor',style:'versatile defense, intensity and high-post creation',tone:'emerald',bonus:{defense:.026,mid:.014},boost:{lateral:2,helpD:2}},
    millere01:{name:'Reggie Miller',key:'runner',title:'Catch & Escape',style:'constant motion and screens into quick threes',tone:'ember',bonus:{three:.026,assist:.012},boost:{releaseSpeed:3}},
    allenra02:{name:'Ray Allen',key:'silk',title:'Silk Trigger',style:'balanced catch-and-shoot footwork and deep-ball precision',tone:'arc',bonus:{three:.028,clutch:.012},boost:{releaseSpeed:2,shotArc:2}},
    iversal01:{name:'Allen Iverson',key:'crossover',title:'The Answer',style:'explosive high-usage scoring and slippery penetration',tone:'violet',bonus:{mid:.018,rim:.014,clutch:.015},boost:{handle:2,agility:2}},
    nashst01:{name:'Steve Nash',key:'orchestra',title:'Seven-Second Orchestra',style:'pick-and-roll passing and transition shooting',tone:'gold',bonus:{assist:.039,transition:.017,three:.012},boost:{vision:3}},
    stockjo01:{name:'John Stockton',key:'precision',title:'The Threaded Pass',style:'high-efficiency creation and disruptive help steals',tone:'emerald',bonus:{assist:.035,steal:.019},boost:{passingAccuracy:3}},
    malonka01:{name:'Karl Malone',key:'roll',title:'Mailman Seal',style:'powerful screens, roll gravity and mid-post finishing',tone:'earth',bonus:{rim:.026,reb:.017},boost:{screen:3,str:2}},
    mcgratr01:{name:'Tracy McGrady',key:'rise',title:'Impossible Release',style:'high-volume pull-up creation from a tall wing',tone:'royal',bonus:{mid:.027,clutch:.015},boost:{shotCreation:3,releaseHeight:2}},
    cartevi01:{name:'Vince Carter',key:'flight',title:'Half-Man, Half-Amazing',style:'elite vertical finishing and crowd-silencing dunking',tone:'ember',bonus:{rim:.031,transition:.018},boost:{vert:3,burst:2}},
    nowitdi01:{name:'Dirk Nowitzki',key:'fade',title:'One-Legged Fade',style:'unguardable high-release fades and shooting big-man spacing',tone:'gold',bonus:{mid:.035,three:.015},boost:{fade:3,releaseHeight:3}},
    anthoca01:{name:'Carmelo Anthony',key:'jab',title:'Jab-Step Artisan',style:'triple-threat jab series and mid-post pull-ups',tone:'ember',bonus:{mid:.024,clutch:.011},boost:{fade:2,shotCreation:2}},
    westbru01:{name:'Russell Westbrook',key:'velocity',title:'Triple-Double Engine',style:'relentless full-speed attacks and rebounding guards',tone:'royal',bonus:{transition:.030,rim:.022,reb:.018},boost:{accel:3}},
    hardeja01:{name:'James Harden',key:'stepback',title:'The Stepback Equation',style:'stepback threes, isolation dribbling and foul pressure',tone:'violet',bonus:{three:.025,clutch:.016,draw:.025},boost:{shotCreation:3,handle:2}},
    leonaka01:{name:'Kawhi Leonard',key:'clamp',title:'The Klaw',style:'strength, anticipation and efficient contested jumpers',tone:'scarlet',bonus:{defense:.034,steal:.022,mid:.016},boost:{perD:3,contested:2}},
    davisan02:{name:'Anthony Davis',key:'tower',title:'Two-Way Flight',style:'perimeter-to-rim defensive coverage and lob finishing',tone:'gold',bonus:{block:.029,defense:.017,rim:.016},boost:{helpD:2,vert:2}},
    lillada01:{name:'Damian Lillard',key:'logo',title:'Logo Time',style:'very deep threes and decisive late-clock shots',tone:'ember',bonus:{three:.029,clutch:.024},boost:{clutchShot:3,releaseSpeed:2}},
    jokicni01:{name:'Nikola Jokić',key:'conductor',title:'Point-Center Paradox',style:'one-touch passing, inverted offense and soft post touch',tone:'gold',bonus:{assist:.038,rim:.014,mid:.010},boost:{vision:3,post:2}},
    embiijo01:{name:'Joel Embiid',key:'size',title:'The Foul-Line Giant',style:'powerful isolation post-ups and contact drawing',tone:'earth',bonus:{rim:.026,mid:.018,draw:.024},boost:{post:2,contactFinish:3}},
    tatumja01:{name:'Jayson Tatum',key:'wing',title:'Three-Level Wing',style:'wing pull-ups, switching defense and playoff isolation scoring',tone:'royal',bonus:{three:.016,mid:.015,defense:.012},boost:{shotCreation:2,contested:2}},
    doncilu01:{name:'Luka Dončić',key:'tempo',title:'Hesitation Maestro',style:'ball-screen reads, tempo manipulation and stepbacks',tone:'violet',bonus:{assist:.032,three:.018,clutch:.016},boost:{vision:2,shotCreation:3}},
    gilgesh01:{name:'Shai Gilgeous-Alexander',key:'glide',title:'The Midrange Glide',style:'cadence changes, paint touches and efficient pull-ups',tone:'arc',bonus:{mid:.029,rim:.019,draw:.012},boost:{shotSelection:3,footwork:2}},
    edwaran01:{name:'Anthony Edwards',key:'antman',title:'Ant-Man Takeoff',style:'explosive self-created downhill finishes and hard pull-ups',tone:'ember',bonus:{rim:.028,mid:.014,clutch:.012},boost:{burst:3,vert:2}},
    wembavi01:{name:'Victor Wembanyama',key:'alien',title:'No-Fly Geometry',style:'extraordinary release reach, weak-side blocks and rangy finishing',tone:'violet',bonus:{block:.038,defense:.021,mid:.012},boost:{releaseHeight:3,block:3}},
    boshch01:{name:'Chris Bosh',key:'stretch',title:'Stretch Connector',style:'spacing and defensive versatility',tone:'scarlet',bonus:{three:.012,defense:.012},boost:{mid:2}},
  };
  const RELATIONS = [
    {p:['curryst01','thompkl01'],name:'Splash Brothers',tone:'arc',bonus:{three:.035,assist:.02}, boost:{three:2,releaseSpeed:2}},
    {p:['jamesle01','wadedw01'],name:'Heatles Reborn',tone:'scarlet',bonus:{transition:.043,rim:.031,defense:.018},boost:{accel:2,contactFinish:2}},
    {p:['onealsh01','bryanko01'],name:'Unfair Inside-Out',tone:'royal',bonus:{mid:.025,rim:.029,reb:.014},boost:{fade:2,post:2}},
    {p:['curryst01','duranke01'],name:'The Unsolvable Switch',tone:'arc',bonus:{three:.029,mid:.023},boost:{shotCreation:2}},
    {p:['jordami01','pippesc01'],name:'Chicago Lockdown',tone:'scarlet',bonus:{steal:.022,defense:.029,transition:.02},boost:{perD:2}},
    {p:['johnsma02','bryanko01'],name:'Purple and Gold',tone:'royal',bonus:{assist:.029,clutch:.021},boost:{vision:2}},
    {p:['jamesle01','wadedw01','boshch01'],name:'The Big Three',tone:'scarlet',bonus:{rim:.041,transition:.04,defense:.032,assist:.018},boost:{contactFinish:3}},
    {p:['curryst01','thompkl01','greendr01'],name:'The Bay Blueprint',tone:'arc',bonus:{three:.041,assist:.042,defense:.017},boost:{three:2}},
    {p:['curryst01','thompkl01','duranke01'],name:'Unfair Spacing',tone:'arc',bonus:{three:.045,mid:.035,assist:.02},boost:{three:2,releaseHeight:2}},
    {p:['jordami01','pippesc01','rodmade01'],name:'Second Three-Peat',tone:'scarlet',bonus:{defense:.05,reb:.033,clutch:.025},boost:{perD:2,boxout:3}},
  ];
  // A mutation transforms the FORM, while chemistry remains a separate effect.
  const FORMS = [
    {p:['jamesle01','wadedw01'],target:'jamesle01',year:2012,name:'Heat LeBron · Unleashed',tone:'scarlet',bonus:{transition:.025,rim:.02,defense:.014},boost:{accel:3,contactFinish:2}},
    {p:['curryst01','thompkl01'],target:'curryst01',year:2015,name:'Unanimous Splash Curry',tone:'arc',bonus:{three:.025,assist:.012},boost:{releaseSpeed:3,three:2}},
    {p:['onealsh01','bryanko01'],target:'onealsh01',year:1999,name:'Three-Peat Shaq · Untethered',tone:'royal',bonus:{rim:.028,reb:.017},boost:{post:3,str:2}},
    {p:['jordami01','pippesc01'],target:'jordami01',year:1995,name:'72-Win Jordan · Air Supremacy',tone:'scarlet',bonus:{mid:.025,defense:.015},boost:{fade:3,clutchShot:2}},
    {p:['curryst01','duranke01'],target:'duranke01',year:2016,name:'Bay Area Durant · Unbound',tone:'arc',bonus:{three:.018,mid:.022},boost:{releaseHeight:3}},
    {p:['jamesle01','wadedw01','boshch01'],target:'jamesle01',year:2012,name:'Heatles Apex · LeBron',tone:'scarlet',bonus:{rim:.022,transition:.026,defense:.026},boost:{contactFinish:3,perD:2}},
  ];
  const CATEGORY_DOMAINS={
    inside:['rim','draw'],mid:['mid','clutch'],three:['three','assist'],ft:['clutch','draw'],
    pass:['assist','transition'],handle:['mid','rim'],perD:['defense','steal'],
    intD:['defense','block'],steal:['steal','transition'],reb:['reb','defense'],
    speed:['transition','rim'],vert:['rim','block'],strength:['rim','reb'],
    jumper:['three','mid'],contested:['mid','clutch'],iq:['assist','defense'],
    motor:['reb','defense'],body:['block','reb'],tendScorer:['clutch','rim'],
    tendShot:['three','mid'],tendTeam:['assist','defense'],longevity:['defense','reb'],
    primeLength:['mid','assist'], PG:['assist','three'],SG:['three','mid'],
    SF:['transition','defense'],PF:['reb','rim'],C:['block','reb'],
  };
  const FAMILIES = [
    ['three','handle','Ankle-Breaking Range','arc',{three:.018,mid:.008}],
    ['mid','jumper','The High Window','violet',{mid:.023}],
    ['speed','inside','Full-Court Avalanche','ember',{rim:.020,transition:.014}],
    ['strength','inside','No-Mercy Contact','earth',{rim:.022}],
    ['pass','three','Drive-Kick Engine','arc',{assist:.024,three:.012}],
    ['reb','intD','Paint Lockdown','earth',{reb:.025,block:.014}],
    ['contested','mid','Unanswerable Fade','violet',{mid:.023,clutch:.012}],
    ['speed','vert','Flight Path','ember',{rim:.021,transition:.016}],
    ['iq','pass','The Chessboard','emerald',{assist:.026}],
    ['steal','speed','Fastbreak Predator','emerald',{steal:.015,transition:.025}],
  ];
  const PALETTE={arc:['#21d5ff','#9b8cff'],scarlet:['#ff526a','#ffc362'],royal:['#a175ff','#ffd46a'],gold:['#ffdc61','#fff4bf'],earth:['#ffb06d','#bd654f'],emerald:['#2cdda9','#a7ffe9'],violet:['#c879ff','#e3a6ff'],ember:['#ff8557','#ffe08a']};
  const key = list=>[...list].sort().join(':');
  const hash = s=>{let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return h>>>0;};
  const pairNames=['Orbit','Collision','Showtime','Gravity','Afterburn','Crossfire','Skyline','Overdrive','Shadow','Velocity','Pressure','Precision'];
  const pairEnds=['Protocol','Connection','Machine','Circuit','Fusion','Theory','Engine','Paradox','Shift','Break','System','Matrix'];
  const seenIds=entries=>[...new Set(entries.map(x=>x.pid||x.row?.pid).filter(Boolean))];
  function categoriesFor(entries,pid){return entries.filter(x=>(x.pid||x.row?.pid)===pid).map(x=>x.cat).filter(Boolean);}
  function makeEffect(id,name,type,tone,bonus,boost,players,extra={}){
    return {id,name,type,tone,bonus:{...bonus},boost:{...(boost||{})},players:[...players],colors:PALETTE[tone]||PALETTE.arc,...extra};
  }
  function analyze(entries,{mode='skill'}={}){
    const players=seenIds(entries),cats=[...new Set(entries.map(x=>x.cat).filter(Boolean))];
    const pairs=[],mutations=[],signatures=[];
    for(const pid of players){const s=STARS[pid];if(s)signatures.push(makeEffect(`sig:${pid}`,s.title,'signature',s.tone,s.bonus,s.boost,[pid],{description:s.style}));}
    for(let i=0;i<entries.length;i++)for(let j=i+1;j<entries.length;j++){
      const a=entries[i],b=entries[j],pa=a.pid||a.row?.pid,pb=b.pid||b.row?.pid;
      if(!pa||!pb||pa===pb)continue;
      const ca=a.cat||'star',cb=b.cat||'star';const h=hash(`${key([pa,pb])}|${key([ca,cb])}`);
      const rel=RELATIONS.find(r=>r.p.length===2&&r.p.every(x=>[pa,pb].includes(x)));
      const pattern=FAMILIES.find(x=>[ca,cb].includes(x[0])&&[ca,cb].includes(x[1]));
      const shared=rel||pattern;
      const name=rel?.name || pattern?.[2] || `${pairNames[h%pairNames.length]} ${pairEnds[(h>>>6)%pairEnds.length]} · ${[STARS[pa]?.name?.split(' ').pop()||pa,STARS[pb]?.name?.split(' ').pop()||pb].join(' × ')}`;
      const tone=rel?.tone || pattern?.[3] || Object.keys(PALETTE)[h%Object.keys(PALETTE).length];
      const ad=CATEGORY_DOMAINS[ca]||['rim','transition'],bd=CATEGORY_DOMAINS[cb]||['mid','assist'];
      const primary=ad[0]===bd[0]?ad[0]:[ad[0],bd[0]][(h>>>5)%2];
      const secondary=[ad[1],bd[1]][(h>>>8)%2];
      const bonus=rel?.bonus||pattern?.[4]||{[primary]:.007+(h%6)*.001,[secondary]:.002+(h%4)*.001};
      const boost=rel?.boost||{};
      pairs.push(makeEffect(`duo:${key([pa,pb])}:${key([ca,cb])}`,name,rel?'historical-duo':'duo',tone,bonus,boost,[pa,pb]));
    }
    // Real trios are stronger than imagined combinations; unusual fictional
    // trios get their own stable names and effects based on exact ingredients.
    const trios=[];
    for(let i=0;i<players.length;i++)for(let j=i+1;j<players.length;j++)for(let k=j+1;k<players.length;k++){
      const ps=[players[i],players[j],players[k]],h=hash(key(ps));
      const rel=RELATIONS.find(r=>r.p.length===3&&r.p.every(x=>ps.includes(x)));
      const name=rel?.name||`${pairNames[h%pairNames.length]} ${pairEnds[(h>>>9)%pairEnds.length]} · ${ps.map(p=>STARS[p]?.name?.split(' ').pop()||p).join(' / ')}`;
      const tone=rel?.tone||Object.keys(PALETTE)[(h>>>5)%Object.keys(PALETTE).length];
      const core=ps.map(p=>categoriesFor(entries,p)[0]||'star').map(c=>CATEGORY_DOMAINS[c]||['transition']);
      const domain=core[h%core.length][0];
      trios.push(makeEffect(`trio:${key(ps)}`,name,rel?'historical-trio':'trio',tone,rel?.bonus||{[domain]:.018+(h%7)*.002},rel?.boost||{},ps));
    }
    for(const f of FORMS)if(f.p.every(pid=>players.includes(pid)))mutations.push(makeEffect(`mutation:${key(f.p)}`,f.name,'mutation',f.tone,f.bonus,f.boost,f.p,{target:f.target,year:f.year}));
    // Rare evolving form for three distinct famous players, even if their
    // historical paths never crossed. Its identity is deterministic per trio.
    const iconic=players.filter(p=>STARS[p]);
    if(iconic.length>=3){const ps=iconic.slice(0,3),h=hash(key(ps));mutations.push(makeEffect(`evolved:${key(ps)}`,`Apex ${pairNames[h%pairNames.length]} · Evolved`,'evolved',Object.keys(PALETTE)[h%8],{[(['three','rim','mid','assist'][h%4])]:.018}, {shotCreation:2},ps,{target:ps[h%3],year:null}));}
    // Avoid drowning the UI or overpowering the sim. Every pair/trio exists,
    // but only the strongest 4 pairs and 2 trios have active game bonuses.
    const sortedPairs=pairs.sort((a,b)=>(b.type==='historical-duo')-(a.type==='historical-duo')||hash(a.id)-hash(b.id));
    const sortedTrios=trios.sort((a,b)=>(b.type==='historical-trio')-(a.type==='historical-trio')||hash(a.id)-hash(b.id));
    const active=[...signatures,...sortedPairs.slice(0,6),...sortedTrios.slice(0,4),...mutations.slice(0,3)];
    return {players,cats,signatures,pairs:sortedPairs,trios:sortedTrios,mutations,active};
  }
  function bonusEffects(dna,scope='all'){
    const result={};for(const item of dna.active||[])for(const [kind,v]of Object.entries(item.bonus)) result[kind]=(result[kind]||0)+v;
    for(const kind in result)result[kind]=clamp(result[kind],-.03,.095);
    return result;
  }
  function applyBuild(build,dna){
    build.dna=dna; build.effects=bonusEffects(dna);
    for(const fx of dna.active.filter(x=>x.type==='signature'||x.type==='mutation'||x.type==='evolved'))for(const [k,b] of Object.entries(fx.boost))
      if(Number.isFinite(build.attrs[k]))build.attrs[k]=Math.min(100,build.attrs[k]+b);
    return build;
  }
  function applyTeam(players,entries){
    const dna=analyze(entries,{mode:'team'});
    const combined=bonusEffects(dna);
    for(const p of players){const playerId=p.historicalPid||p.pid||entries.find(e=>e.playerId===p.id)?.pid;
      const signature=dna.signatures.find(s=>s.players.includes(playerId));
      // Signature boost goes to its owner. General chemistry scales across
      // the lineup because it represents team interactions, not private OVR.
      p.attrs={...p.attrs};
      if(signature)for(const [k,v]of Object.entries(signature.boost))if(Number.isFinite(p.attrs[k]))p.attrs[k]=Math.min(100,p.attrs[k]+v);
      const mutations=dna.mutations.filter(m=>m.target===playerId);
      for(const m of mutations)for(const [k,v]of Object.entries(m.boost))if(Number.isFinite(p.attrs[k]))p.attrs[k]=Math.min(100,p.attrs[k]+v);
      p.dna={effects:combined,signature:signature?.name||null,mutations:mutations.map(m=>m.name)};
    }
    return dna;
  }
  const fmt=(effect)=>`--dna-a:${effect.colors[0]};--dna-b:${effect.colors[1]};`;
  const esc=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  function visual(f,{compact=false}={}){
    const body=f.description?`<p>${esc(f.description)}</p>`:`<p>${esc(Object.entries(f.bonus).map(([k,v])=>`${k} +${(v*100).toFixed(1)}% situational effect`).join(' · '))}</p>`;
    return `<article class="dna-effect dna-${f.type}" style="${fmt(f)}" data-dna="${esc(f.id)}"><div class="dna-mark" aria-hidden="true">${f.type==='mutation'||f.type==='evolved'?'✦':f.type.includes('trio')?'Ⅲ':f.type.includes('duo')?'Ⅱ':'★'}</div><div><span class="dna-kind">${esc(f.type.replaceAll('-',' '))}</span><b>${esc(f.name)}</b>${compact?'':body}</div></article>`;
  }
  function board(dna,{compact=false}={}){
    if(!dna)return '';
    const feature=[...dna.mutations,...dna.trios.slice(0,compact?1:4),...dna.pairs.slice(0,compact?2:7),...dna.signatures.slice(0,compact?1:3)];
    if(!feature.length)return '<p class="t3 sm">Draft more players to reveal your DNA.</p>';
    return `<section class="dna-showcase"><div class="dna-section-label">${compact?'SYNERGY PREVIEW':'SIGNATURES · CHEMISTRY · MUTATIONS'}</div><div class="dna-effect-grid">${feature.map(f=>visual(f,{compact})).join('')}</div>${!compact&&dna.pairs.length>7?`<details><summary>${dna.pairs.length-7} more duo combinations</summary><div class="dna-effect-grid">${dna.pairs.slice(7).map(f=>visual(f,{compact:true})).join('')}</div></details>`:''}</section>`;
  }
  function preview(entries,candidate){const next=analyze([...entries,candidate]);const old=analyze(entries);const fresh=[...next.mutations,...next.trios,...next.pairs].filter(x=>![...old.mutations,...old.trios,...old.pairs].some(y=>y.id===x.id));return fresh[0]||null;}
  return {STARS,RELATIONS,FORMS,analyze,bonusEffects,applyBuild,applyTeam,visual,board,preview,esc,PALETTE};
})();