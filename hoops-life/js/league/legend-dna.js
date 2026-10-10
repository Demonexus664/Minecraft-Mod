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
  const PALETTE={arc:['#21d5ff','#9b8cff'],scarlet:['#ff526a','#ffc362'],royal:['#a175ff','#ffd46a'],gold:['#ffdc61','#fff4bf'],earth:['#ffb06d','#bd654f'],emerald:['#2cdda9','#a7ffe9'],violet:['#c879ff','#e3a6ff'],ember:['#ff8557','#ffe08a']};
  const key=list=>[...list].sort().join(':');
  const esc=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const name=pid=>HL.HISTORY?.players?.[pid]?.[0]||STARS[pid]?.name||pid;
  const PROFILES={
    curryst01:{gravity:1,relocation:1,quickRelease:.9,range:1},thompkl01:{screenMove:.9,quickRelease:.9},
    birdla01:{anticipation:.9,highRelease:.65,precision:.65},jordami01:{creation:.95,clutchChoice:.9,contactBalance:.45},
    jamesle01:{transition:.95,postRead:.8,contactBalance:.65},onealsh01:{deepSeal:1,postDouble:1,secondChance:.7},
    wadedw01:{contactBalance:.8,transition:.8,laneDisruption:.35},bryanko01:{creation:1,clutchChoice:1,highRelease:.5},
    duranke01:{highRelease:1,gravity:.65,creation:.7},johnsma02:{precision:.95,transition:1},
    chambwi01:{deepSeal:.85,secondChance:1,rimIntimidation:.7},antetgi01:{transition:1,lob:.8,contactBalance:.7},
    irvinky01:{creation:.8,contactBalance:.6},greendr01:{rotations:1,postRead:.8,screen:.8},
    pippesc01:{laneDisruption:1,rotations:.75,transition:.6},rodmade01:{boxPosition:1,secondChance:1},
    boshch01:{rotations:.6,screen:.55},boschch01:{rotations:.6,screen:.55},olajuha01:{postFootwork:1,rimIntimidation:.85},
    duncati01:{boxPosition:.9,rotations:1,postFootwork:.65},garneke01:{rotations:1,rimIntimidation:.55,screen:.65},
    millere01:{screenMove:1,quickRelease:.8,gravity:.75},allenra02:{screenMove:.8,quickRelease:.9,gravity:.75},
    iversal01:{creation:.9,contactBalance:.55,transition:.7},nashst01:{precision:1,screenRead:1,transition:.8},
    stockjo01:{precision:1,screenRead:.9,laneDisruption:.75},malonka01:{screen:1,deepSeal:.8,postFootwork:.5},
    mcgratr01:{highRelease:.8,creation:1},cartevi01:{lob:1,transition:.7},nowitdi01:{highRelease:1,postFootwork:.8},
    anthoca01:{creation:.75,postFootwork:.75},westbru01:{transition:1,secondChance:.4},hardeja01:{creation:1,range:.7,screenRead:.8},
    leonaka01:{laneDisruption:.9,rotations:.85,creation:.6},davisan02:{rimIntimidation:1,lob:.85,rotations:.8},
    lillada01:{range:1,clutchChoice:.9,quickRelease:.7},jokicni01:{postRead:1,precision:1,postFootwork:.8,screen:.65},
    embiijo01:{postDouble:.8,deepSeal:.8,postFootwork:.7},tatumja01:{creation:.7,highRelease:.7,rotations:.5},
    doncilu01:{screenRead:1,creation:.9,postRead:.7},gilgesh01:{creation:.85,contactBalance:.7,anticipation:.7},
    edwaran01:{lob:.7,creation:.65,transition:.85},wembavi01:{rimIntimidation:1,highRelease:1,rotations:.75}
  };
  const DOMAINS={gravity:['three'],relocation:['three','speed','tendShot'],quickRelease:['jumper'],range:['three'],screenMove:['three','speed','tendShot'],
    anticipation:['iq','tendShot','three'],highRelease:['jumper','mid','three'],precision:['pass'],creation:['handle','contested','mid'],clutchChoice:['contested','iq'],
    contactBalance:['inside','strength'],transition:['speed','pass','tendShot'],postRead:['pass','iq'],deepSeal:['inside','strength'],postDouble:['inside'],
    secondChance:['reb','motor'],lob:['vert','inside'],laneDisruption:['steal','perD'],rotations:['intD','perD','iq'],screen:['strength'],boxPosition:['reb'],
    rimIntimidation:['intD'],postFootwork:['inside'],screenRead:['pass','handle','iq']};
  const CATEGORY_ATTRS={inside:['close','layup','dunk','post','contactFinish','floater','footwork'],mid:['mid','fade'],three:['three'],ft:['ft'],pass:['pass','vision','passingAccuracy'],
    handle:['handle','shotCreation'],perD:['perD','lateral','agility'],intD:['intD','block','helpD','contestD'],steal:['steal'],reb:['oreb','dreb','boxout'],
    speed:['speed','accel','transition'],vert:['vert','burst'],strength:['str','screen'],jumper:['releaseSpeed','releaseHeight','shotArc'],contested:['contested','clutchShot'],iq:['iq'],motor:['dur','stam','hustle']};
  const MECHANIC_TEXT={gravity:'Range pulls help toward the perimeter and opens rim space for teammates.',relocation:'Relocate into space after a screen or pass.',quickRelease:'Release an assisted jumper before the closeout arrives.',range:'Create farther-out pull-up opportunities.',screenMove:'Use off-ball screens to create a catch window.',anticipation:'Read the defender to choose a better shot window.',highRelease:'Shoot above a shorter defender’s reach.',precision:'Protect a passing lane and deliver a better assisted shot.',creation:'Create a controlled jumper against a set defender.',clutchChoice:'Prefer the suitable late-clock counter.',contactBalance:'Preserve balance through contact on drives against size.',transition:'Sprint into an unsettled cross-match.',postRead:'Read help and pass to the vacated shooter.',deepSeal:'Establish deeper post position against smaller defenders.',postDouble:'Force a second defender toward a threatening post touch.',secondChance:'Win inside offensive-rebound and putback opportunities.',lob:'Finish assisted rim chances above late help.',laneDisruption:'Shrink high-risk passing lanes.',rotations:'Recover from helping toward the vacated shooter.',screen:'Create separation with a solid screen.',boxPosition:'Establish position before the rebound.',rimIntimidation:'Deter or block drives from the help position.',postFootwork:'Use pivots to evade post contests.',screenRead:'Read screen coverage and punish its available lane.'};
  function evidence(e){
    const pid=e.pid||e.row?.pid,archive=Number.isInteger(+e.season)&&HL.History?.seasonRows(String(e.season))?.find(r=>r.pid===pid);
    const row=e.row&&archive&&(e.row===archive||JSON.stringify(e.row)===JSON.stringify(archive))?archive:null;
    return {...e,pid,row,attrs:row?HL.historicalAttributes(row):{},verified:!!row};
  }
  function buildContext(entries,supplied={}){const attrs={};for(const e of entries)for(const k of CATEGORY_ATTRS[e.cat]||[])if(e.verified)attrs[k]=e.attrs[k];
    const body=entries.find(e=>e.cat==='body'&&e.verified),bio=body&&HL.HISTORY.players[body.pid],height=supplied.height??bio?.[3],combined={...attrs,...supplied.attrs};
    // Unfilled support tools contribute zero to qualification, never an assumed
    // 65. Preview/reveal/final construction therefore share executable limits,
    // and later weak physical cards cannot revoke a prematurely revealed form.
    const effective=Number.isFinite(height)?reconcileAttributes({...Object.fromEntries((HL.ATTR_KEYS||[]).map(k=>[k,0])),...combined},height).attrs:combined;
    return {attrs:effective,height,weight:supplied.weight??bio?.[4],body:!!body};}
  const N=(cat,pid,min)=>({cat,pid,min});
  // Conditions are exact authored evidence. No random famous trio or hash lottery qualifies.
  const RECIPES=[
    {id:'compact-contact',name:'Low-Center Power Finisher',family:'contact',tone:'earth',frame:[60,76],needs:[N('strength','onealsh01',{str:96}),N('inside',null,{contactFinish:90}),N('handle',null,{handle:85})],tools:{str:96,contactFinish:90,handle:85},mechanics:{contactBalance:1.6,creation:.65},activation:'On a drive against a taller defender: keep balance, dislodge the defender and use an offset finishing angle.',description:'A small frame uses Shaq-level force below the defender’s center of gravity; it does not inherit a center’s deep-post game.'},
    {id:'deep-post-power',name:'Deep-Seal Paint Dominator',family:'contact',tone:'earth',frame:[82,92],needs:[N('strength','onealsh01',{str:96}),N('inside',null,{post:90,contactFinish:92})],tools:{str:96,post:90},mechanics:{deepSeal:1.6,postDouble:1.4,secondChance:1.2},activation:'In half-court rim possessions: seal deep, force help and pursue inside-position rebounds.',description:'A center’s frame converts force into post position. Passing IQ decides whether the forced double exposes a teammate or causes a turnover.'},
    {id:'moving-range',name:'Screen-to-Logo Shot Creator',family:'shooting',tone:'arc',frame:[68,81],needs:[N('three','curryst01',{three:98}),N('jumper',null,{releaseSpeed:84}),N('handle',null,{handle:94})],tools:{three:98,handle:94},mechanics:{gravity:1.35,relocation:1.25,range:1.25,quickRelease:1.1},activation:'After screens and off-ball catches: extend defensive coverage, relocate and release before recovery.',description:'Elite handle plus range changes where a screen is dangerous and opens teammates at the rim.'},
    {id:'moving-range-evolved',name:'Read-and-Relocate Perimeter Architect',family:'shooting',type:'evolved',priority:3,tone:'arc',frame:[68,81],needs:[N('three','curryst01',{three:98}),N('jumper',null,{releaseSpeed:84}),N('handle',null,{handle:94}),N('speed',null,{speed:85}),N('iq',null,{iq:90})],tools:{three:98,handle:94,speed:85,iq:90},mechanics:{gravity:1.65,relocation:1.65,range:1.3,quickRelease:1.3,screenRead:1.2},activation:'Read the screen coverage, re-screen or relocate; following the shooter exposes the roll and weak side.',description:'Adds fast coverage reads and a second movement to Screen-to-Logo Shot Creator. It replaces that form instead of stacking.'},
    {id:'tall-release',name:'Seven-Foot High-Release Marksman',family:'shooting',tone:'violet',frame:[83,91],needs:[N('three',null,{three:97}),N('jumper','duranke01',{releaseHeight:79}),N('contested',null,{contested:84})],tools:{three:97,releaseHeight:79,contested:84},mechanics:{highRelease:1.65,gravity:1.2,creation:.8},activation:'Against shorter perimeter defenders: shoot over the close contest.',description:'Long release geometry punishes a guard switched onto the big. It does not require sprinting around screens.'},
    {id:'one-leg-counter',name:'High-Post Fade Counter',family:'creation',tone:'gold',frame:[79,88],needs:[N('mid','nowitdi01',{fade:90}),N('jumper',null,{releaseHeight:80}),N('inside',null,{footwork:85})],tools:{fade:90,releaseHeight:80},mechanics:{highRelease:1.45,postFootwork:1.4,creation:1.2},activation:'On unassisted midrange attempts: use post footwork and a high fade to evade contact.',description:'A tall balanced fade counters a crowded paint while retaining the drafted three-point accuracy.'},
    {id:'dream-read',name:'Double-Team Post Escape Artist',family:'post',tone:'emerald',frame:[79,89],needs:[N('inside','olajuha01',{footwork:80}),N('pass','jokicni01',{vision:90}),N('iq',null,{iq:88})],tools:{footwork:80,vision:90},mechanics:{postFootwork:1.55,postRead:1.6,precision:1.3},activation:'When help commits to the post: pivot away or pass to the vacated shooter.',description:'Dream-style pivots and point-center vision create a choice between the counter and the passing lane.'},
    {id:'rim-network',name:'Long-Frame Rotating Rim Eraser',family:'defense',tone:'emerald',frame:[84,92],needs:[N('intD','wembavi01',{block:90}),N('iq',null,{iq:88}),N('speed',null,{speed:78})],tools:{block:90,iq:88,speed:78},mechanics:{rimIntimidation:1.65,rotations:1.5},activation:'As the help defender: deter the drive and recover toward the vacated shooter.',description:'Reach plus fast reads support a second rotation. Floor spacing still forces a defensive choice.'},
    {id:'guard-net',name:'Point-of-Attack Passing-Lane Hunter',family:'defense',tone:'scarlet',frame:[70,81],needs:[N('perD','pippesc01',{perD:85}),N('steal',null,{steal:92}),N('speed',null,{speed:88}),N('iq',null,{iq:85})],tools:{perD:85,steal:92,speed:88},mechanics:{laneDisruption:1.55,rotations:1.25,transition:1.1},activation:'Against perimeter creation and risky passes: shrink the lane and turn steals into a break.',description:'Pressure and anticipation reward defensive speed. They cannot make a small guard a seven-foot shot blocker.'},
    {id:'glass-position',name:'Relentless Inside-Position Rebounder',family:'glass',tone:'earth',frame:[77,87],needs:[N('reb','rodmade01',{boxout:88}),N('motor',null,{stam:93,hustle:90}),N('strength',null,{str:85})],tools:{boxout:88,stam:93,str:85},mechanics:{boxPosition:1.6,secondChance:1.6},activation:'After misses: claim position early, hold it through contact and pursue the putback.',description:'Position and effort win repeat possessions; they never guarantee where every missed shot lands.'},
    {id:'vertical-lob',name:'Full-Speed Above-Rim Finisher',family:'flight',tone:'ember',frame:[77,88],needs:[N('vert','cartevi01',{vert:94}),N('speed',null,{speed:90}),N('inside',null,{dunk:93})],tools:{vert:94,speed:90,dunk:93},mechanics:{lob:1.6,transition:1.4,contactBalance:.9},activation:'On breaks or assisted rim attempts: sprint into a mismatch and finish above late help.',description:'Explosive finishing needs space and a capable passer; packed half-court defense limits it.'},
    {id:'pickroll-read',name:'Ball-Screen Coverage Manipulator',family:'creation',tone:'gold',frame:[68,81],needs:[N('pass','nashst01',{vision:90}),N('handle','doncilu01',{handle:92}),N('iq',null,{iq:90})],tools:{vision:90,handle:92,iq:90},mechanics:{screenRead:1.65,precision:1.5,creation:1},activation:'On a ball screen: read switch versus drop, find the roll or pull-up and protect the pass against a trap.',description:'Passing vision and pace manipulation create a different attack from off-ball shooting.'},
    {id:'late-counter',name:'Late-Clock Contested-Shot Counter',family:'creation',tone:'royal',frame:[74,83],needs:[N('mid','jordami01',{mid:94}),N('contested','bryanko01',{contested:84}),N('handle',null,{handle:90})],tools:{mid:94,contested:84,handle:90},mechanics:{creation:1.6,clutchChoice:1.6,highRelease:.8},activation:'In close late possessions: create a controlled fade or drive instead of an unsuitable jumper.',description:'Counters a set defender without converting a desperate heave into a normal shot.'},
    {id:'bay-motion',name:'Unanimous Curry: Two-Screen Relocation',family:'shooting',tone:'arc',mode:'team',p:['curryst01','thompkl01','greendr01'],years:[2015,2016],target:'curryst01',year:2015,roleTools:{curryst01:{three:98},thompkl01:{three:94},greendr01:{iq:86}},mechanics:{relocation:1.6,gravity:1.55,screenRead:1.1},activation:'With Klay and Draymond on the floor: chain a screen, a handoff and a second relocation.',description:'The verified Bay core transforms Curry’s movement; Klay pins the weak side and Draymond reads coverage.'},
    {id:'heat-pressure',name:'Peak LeBron: Two-Lane Transition Pressure',family:'flight',tone:'scarlet',mode:'team',p:['jamesle01','wadedw01','boshch01'],years:[2011,2013],target:'jamesle01',year:2012,roleTools:{jamesle01:{contactFinish:85},wadedw01:{speed:77},boshch01:{mid:75}},mechanics:{transition:1.65,contactBalance:1.3,postRead:1},activation:'With Wade and Bosh on the floor in transition: pressure the downhill, parallel cut and trailing-big lanes.',description:'Verified Miami tools create different defensive choices, rather than upgrading any LeBron because Wade was drafted.'},
    {id:'chicago-control',name:'72-Win Jordan: Turnover-to-Second-Chance Attack',family:'defense',tone:'scarlet',mode:'team',p:['jordami01','pippesc01','rodmade01'],years:[1995,1997],target:'jordami01',year:1995,roleTools:{jordami01:{mid:94},pippesc01:{perD:85},rodmade01:{boxout:88}},mechanics:{laneDisruption:1.4,transition:1.2,secondChance:1.2,clutchChoice:1.3},activation:'With Pippen and Rodman on the floor: turn wing pressure into breaks and extend misses with inside position.',description:'A verified championship core creates repeat offensive opportunities.'},
    {id:'laker-post',name:'Peak Shaq: Double-Team Punisher',family:'contact',tone:'royal',mode:'team',p:['onealsh01','bryanko01'],years:[1999,2001],target:'onealsh01',year:1999,roleTools:{onealsh01:{str:96,post:90},bryanko01:{mid:86,handle:90}},mechanics:{deepSeal:1.65,postDouble:1.55,postRead:.9,secondChance:1.2},activation:'With peak Kobe on the floor: seal deep and punish help with the vacated perimeter space.',description:'Peak cards must qualify. Aging Shaq and rookie Kobe keep their ordinary chemistry without this form.'},
    {id:'fictional-orbit',name:'Logo Shooter and Point-Center Handoff',family:'shooting',tone:'gold',mode:'team',p:['curryst01','jokicni01'],target:'curryst01',roleTools:{curryst01:{three:99,handle:95},jokicni01:{vision:95,screen:80}},mechanics:{screenRead:1.5,relocation:1.5,gravity:1.5},activation:'With Curry and Jokić sharing the floor: chain a handoff into a screen and punish its coverage.',description:'Two extraordinary verified seasons create a fictional relationship grounded in compatible roles.'},
    {id:'fictional-sky',name:'Long-Range Entry to an Above-Rim Seal',family:'post',tone:'violet',mode:'team',p:['johnsma02','chambwi01','curryst01'],target:'chambwi01',roleTools:{johnsma02:{vision:94},chambwi01:{post:87,vert:90},curryst01:{three:98}},mechanics:{deepSeal:1.5,lob:1.5,postRead:1.2},activation:'With elite vision and range on the floor: throw over the front and finish the deep seal.',description:'Three elite roles create a high-low attack. Three arbitrary legends do not qualify.'},
    {id:'fictional-wall',name:'Switch-to-Rim Defensive Relay',family:'defense',tone:'emerald',mode:'team',p:['leonaka01','garneke01','wembavi01'],target:'wembavi01',roleTools:{leonaka01:{perD:93},garneke01:{helpD:90},wembavi01:{block:92}},mechanics:{rimIntimidation:1.65,rotations:1.65,laneDisruption:1.2},activation:'With all three sharing the floor: contain the ball, switch the screen and relay the drive to rim protection.',description:'Strong versions of the whole defensive trio coordinate a recovery.'}
  ];
  const REL_MECHANICS={'Splash Brothers':{screenMove:.75,relocation:.7,gravity:.65,quickRelease:.65},'Heatles Reborn':{transition:.85,contactBalance:.55},'Unfair Inside-Out':{postDouble:.65,postRead:.55},'The Unsolvable Switch':{gravity:.7,highRelease:.65},'Chicago Lockdown':{laneDisruption:.7,rotations:.75},'Purple and Gold':{transition:.65,precision:.55},'The Big Three':{transition:.85,rotations:.65},'The Bay Blueprint':{screenRead:.8,relocation:.85},'Unfair Spacing':{gravity:.85,highRelease:.65},'Second Three-Peat':{laneDisruption:.85,boxPosition:.85}};
  for(const [p,n,m]of [
    [['stockjo01','malonka01'],'Stockton–Malone Ball-Screen Timing',{screenRead:.85,screen:.85}],
    [['nashst01','stoudam01'],'Nash–Stoudemire Roll Timing',{screenRead:.8,lob:.8}],
    [['jokicni01','murraja01'],'Denver Handoff Timing',{screenRead:.8,creation:.65}],
    [['duncati01','parketo01'],'Spurs Screen and Paint Timing',{screenRead:.75,postRead:.65}],
    [['duncati01','ginobma01'],'Spurs Weak-Side Reads',{rotations:.7,precision:.75}],
    [['birdla01','mchalke01','parisro01'],'Boston Frontcourt Positioning',{postRead:.8,boxPosition:.85}],
    [['garneke01','piercpa01','allenra02'],'Boston Inside-Out Coverage',{rotations:.8,screenMove:.7}],
    [['johnsma02','abdulka01','worthja01'],'Showtime Three-Lane Break',{transition:.95,precision:.8}],
    [['duranke01','westbru01'],'Thunder Drive-and-Rise',{transition:.75,highRelease:.65}],
    [['jamesle01','irvinky01'],'Cleveland Drive-and-Counter',{creation:.75,postRead:.6}],
    [['jamesle01','davisan02'],'Lakers Lob and Weak-Side Cover',{lob:.8,rotations:.75}],
    [['olajuha01','drexlcl01'],'Houston Post-and-Cut',{postRead:.7,transition:.7}],
    [['birdla01','mchalke01'],'Boston Post Entry and Cut',{postRead:.75,precision:.65}]
  ]){RELATIONS.push({p,name:n,tone:'gold',bonus:{},boost:{}});REL_MECHANICS[n]=m;}
  const SECONDARY=[
    [['three','pass'],'Range Opens the Passing Lane',{gravity:.45,precision:.4},'arc'],
    [['strength','inside'],'Screen Force into Contact Finish',{screen:.45,contactBalance:.45},'earth'],
    [['pass','iq'],'Anticipated Passing Window',{precision:.55,postRead:.35},'gold'],
    [['reb','motor'],'Early Box-Out and Repeat Effort',{boxPosition:.5,secondChance:.45},'earth'],
    [['intD','iq'],'Help-and-Recover Timing',{rotations:.5,rimIntimidation:.35},'emerald'],
    [['speed','vert'],'Sprint into the Lob Window',{transition:.45,lob:.45},'ember'],
    [['mid','contested'],'Controlled Contested Pull-Up',{creation:.5,clutchChoice:.35},'violet'],
    [['three','jumper'],'Catch Before the Closeout',{quickRelease:.55,screenMove:.3},'arc'],
    [['steal','perD'],'Pressure into Passing-Lane Reads',{laneDisruption:.55},'scarlet'],
    [['inside','pass'],'Post Touch into the Open Side',{postRead:.55},'gold'],
    [['handle','three'],'Ball-Screen Pull-Up Threat',{screenRead:.4,creation:.4},'violet'],
    [['strength','reb'],'Hold the Inside Rebounding Spot',{boxPosition:.55},'earth']
  ];

  // Procedural basketball relationships stay role-grounded. These 32 distinct
  // pairs and 14 three-skill chains modify possessions via the existing engine,
  // but never count as extremely rare form transformations.
  const COMBO_DUOS=[
    ['three','handle','Deep Pull-Up Geometry',{range:.75,creation:.65,gravity:.45},'arc'],
    ['three','pass','Gravity and the Skip Pass',{gravity:.74,precision:.62,postRead:.3},'arc'],
    ['three','jumper','Split-Second Green Light',{quickRelease:.84,screenMove:.4},'arc'],
    ['three','speed','Trailing Three-Point Threat',{transition:.67,relocation:.82,gravity:.4},'arc'],
    ['three','iq','Long-Range Coverage Decoder',{gravity:.63,screenRead:.75},'arc'],
    ['mid','handle','Three-Level Counter',{creation:.82,clutchChoice:.5},'gold'],
    ['mid','contested','Footwork Fade Specialist',{creation:.86,highRelease:.52},'gold'],
    ['mid','inside','Inside-Out Post Counter',{creation:.55,postFootwork:.67},'earth'],
    ['inside','strength','Contact Finishing Wall',{contactBalance:.85,deepSeal:.53},'earth'],
    ['inside','vert','Catch Above the Crowd',{lob:.89,contactBalance:.42},'ember'],
    ['inside','pass','The Double-Team Escape',{postRead:.83,precision:.45},'gold'],
    ['inside','handle','Rim Pressure Creator',{creation:.61,contactBalance:.69},'earth'],
    ['inside','reb','Relentless Second Chance',{secondChance:.84,boxPosition:.52},'earth'],
    ['pass','handle','Pick-and-Roll Manipulator',{screenRead:.88,precision:.75},'gold'],
    ['pass','iq','Possession Architect',{precision:.84,anticipation:.51},'gold'],
    ['pass','speed','One-Pass Fastbreak',{transition:.83,precision:.51},'ember'],
    ['perD','steal','Elite Ball Hawk',{laneDisruption:.92,rotations:.4},'scarlet'],
    ['perD','speed','Recovery Lockdown',{rotations:.79,laneDisruption:.5},'emerald'],
    ['perD','intD','The Switch Everything Wall',{rotations:.9,rimIntimidation:.52},'emerald'],
    ['intD','vert','Late-Help Shot Eraser',{rimIntimidation:.93,rotations:.51},'emerald'],
    ['intD','iq','Two-Rotation Read',{rotations:.93,rimIntimidation:.41},'emerald'],
    ['reb','strength','Own the Box',{boxPosition:.88,secondChance:.59},'earth'],
    ['reb','motor','Tireless Glass Cleaner',{secondChance:.9,boxPosition:.7},'earth'],
    ['speed','vert','Poster Fastbreak',{transition:.8,lob:.9},'ember'],
    ['speed','handle','First-Step Advantage',{transition:.58,creation:.81},'ember'],
    ['contested','iq','Fourth-Quarter Shot Selector',{clutchChoice:.94,anticipation:.56},'violet'],
    ['strength','perD','Physical Point of Attack',{laneDisruption:.59,rotations:.58},'scarlet'],
    ['strength','intD','The Paint Anchor',{rimIntimidation:.79,boxPosition:.57},'earth'],
    ['jumper','contested','Pressure Jumper',{highRelease:.6,clutchChoice:.62},'violet'],
    ['motor','speed','Nonstop Two-Way Engine',{transition:.76,rotations:.46},'ember'],
    ['motor','perD','Forty-Eight-Minute Pest',{laneDisruption:.74,rotations:.64},'scarlet'],
    ['steal','speed','Steal-to-Dunk Express',{laneDisruption:.66,transition:.77},'emerald'],
    ['three','contested','Logo Pressure Specialist',{range:.69,clutchChoice:.9,highRelease:.52},'violet'],
    ['three','motor','Endless Relocator',{screenMove:.9,relocation:.78,gravity:.54},'arc'],
    ['jumper','handle','Pull-Up Separation Lab',{creation:.97,quickRelease:.67},'violet'],
    ['jumper','pass','Catch-Read-Fire',{quickRelease:.84,precision:.74},'gold'],
    ['handle','iq','The Tempo Thief',{screenRead:.94,anticipation:.86},'violet'],
    ['pass','contested','One More or One-on-One',{precision:.89,clutchChoice:.72},'gold'],
    ['pass','reb','Rebound-to-Break Outlet',{precision:.75,transition:.88,boxPosition:.37},'ember'],
    ['inside','mid','Post-Fade Decision Tree',{postFootwork:.89,creation:.72},'earth'],
    ['vert','perD','Recovery Above the Screen',{rotations:.91,lob:.47},'emerald'],
    ['steal','iq','Anticipate the Skip',{laneDisruption:.89,anticipation:.82},'scarlet'],
    ['intD','motor','Nonstop Paint Protector',{rimIntimidation:.9,rotations:.75},'emerald'],
    ['reb','pass','Outlet Surgeon',{boxPosition:.84,precision:.78,transition:.48},'gold']
  ];
  const COMBO_TRIOS=[
    [['three','handle','jumper'],'Logo-to-Release Chain',{range:1,creation:.9,quickRelease:1.1},'arc'],
    [['three','pass','iq'],'Read the Double, Burn the Help',{gravity:1,precision:.9,postRead:.8},'arc'],
    [['three','speed','jumper'],'Off-Ball Relocation Terror',{relocation:1.1,screenMove:.95,quickRelease:.82},'arc'],
    [['inside','strength','reb'],'Second-Chance Powerhouse',{deepSeal:.95,secondChance:1.1,boxPosition:.82},'earth'],
    [['inside','vert','speed'],'Above-the-Rim Avalanche',{transition:1.08,lob:1.1,contactBalance:.75},'ember'],
    [['inside','pass','iq'],'Point-Center Help Decoder',{postRead:1.1,precision:.95,postFootwork:.6},'gold'],
    [['perD','steal','speed'],'Ninety-Four-Feet Pressure',{laneDisruption:1.13,rotations:.84,transition:.76},'scarlet'],
    [['perD','intD','iq'],'Full-Court Defensive Relay',{rotations:1.18,rimIntimidation:.7,laneDisruption:.63},'emerald'],
    [['reb','strength','motor'],'The Glass Never Sleeps',{boxPosition:1.13,secondChance:1.07},'earth'],
    [['mid','contested','handle'],'Impossible Shot Artist',{creation:1.12,clutchChoice:1.07,highRelease:.55},'violet'],
    [['three','inside','pass'],'Unsolvable Inside-Out',{gravity:.87,postRead:.91,precision:.79},'arc'],
    [['inside','vert','pass'],'Lob and Kick-Out Threat',{lob:1,postRead:.83,precision:.73},'ember'],
    [['pass','handle','speed'],'Seven-Second Floor General',{screenRead:.95,transition:.98,precision:.95},'gold'],
    [['strength','intD','reb'],'Paint Fortress',{rimIntimidation:.99,boxPosition:1.12,rotations:.6},'earth'],
    [['three','handle','contested'],'The Four-Level Bag',{creation:1.18,clutchChoice:1.15,range:.91},'violet'],
    [['three','pass','jumper'],'Quick-Skip Shooting Grid',{precision:1.06,quickRelease:1.07,gravity:.86},'arc'],
    [['three','motor','speed'],'Cardio Nightmare',{screenMove:1.2,relocation:1.13,transition:.84},'arc'],
    [['mid','iq','contested'],'Last-Five-Seconds Solver',{clutchChoice:1.17,anticipation:1.04,creation:.79},'gold'],
    [['handle','pass','iq'],'Unscripted Floor General',{screenRead:1.21,precision:1.12,postRead:.61},'gold'],
    [['inside','strength','vert'],'Violent Contact Pressure',{contactBalance:1.13,deepSeal:.89,lob:1.02},'earth'],
    [['reb','pass','speed'],'Grab and Go Machine',{boxPosition:.98,transition:1.14,precision:.94},'ember'],
    [['perD','steal','iq'],'Predictive Ball Pressure',{laneDisruption:1.2,rotations:1.02,anticipation:.84},'scarlet'],
    [['perD','intD','motor'],'No Rest on Defense',{rotations:1.24,rimIntimidation:.84,laneDisruption:.57},'emerald'],
    [['inside','pass','contested'],'Help-Defense Trap',{postDouble:1.07,postRead:1.08,clutchChoice:.7},'earth']
  ];
  const TEAM_CHAINS=[
    [['three',91],['post',89],['vision',87],'The Floor-Splitting Triangle',{gravity:1.1,deepSeal:1.05,postRead:.89},'arc'],
    [['three',94],['vision',93],['speed',89],'Relocate and Deliver',{relocation:1.15,screenRead:.97,precision:1.01},'arc'],
    [['perD',89],['block',91],['steal',88],'The Rotating Lock',{laneDisruption:1.1,rimIntimidation:1.1,rotations:1.17},'emerald'],
    [['pass',90],['vert',91],['screen',86],'The Alley-Oop Machine',{precision:1.15,lob:1.08,screenRead:.79},'ember'],
    [['post',92],['three',94],['dreb',90],'Paint, Pop and Rebound',{deepSeal:1.01,gravity:.95,boxPosition:.99},'earth'],
    [['mid',94],['handle',91],['three',91],'Three-Level Scoring Hydra',{creation:1.17,gravity:.81,clutchChoice:.89},'violet'],
    [['speed',91],['vision',90],['dunk',93],'Run the Whole Floor',{transition:1.17,precision:.87,lob:.91},'ember'],
    [['intD',89],['perD',91],['iq',91],'Five-Man Defensive Geometry',{rotations:1.2,rimIntimidation:.82},'emerald'],
    [['three',91],['screen',88],['vision',90],'Screen and Relocate',{screenMove:1.19,screenRead:1.04,gravity:.83},'arc'],
    [['pass',92],['post',89],['three',90],'Inverted Offense',{postRead:1.18,precision:1.09,gravity:.81},'gold'],
    [['steal',90],['speed',91],['dunk',91],'Defend to Detonate',{laneDisruption:.94,transition:1.24,lob:.87},'emerald'],
    [['block',92],['dreb',91],['vision',88],'Stop and Start',{rimIntimidation:1.12,boxPosition:.93,precision:.79},'emerald'],
    [['three',92],['mid',91],['pass',87],'Impossible Help Decision',{gravity:1.14,creation:.96,precision:.98},'violet'],
    [['oreb',91],['str',90],['post',90],'Second-Chance Punishment',{secondChance:1.2,deepSeal:1.04,boxPosition:1.11},'earth']
  ];
  const sourceGrade=e=>Math.max(0,...(CATEGORY_ATTRS[e.cat]||[]).map(k=>e.attrs[k]||0));
  function derivedChemistry(entries,mode){
    const pairs=[],trios=[];
    if(mode==='skill'){
      for(const [a,b,title,m,tone]of COMBO_DUOS){
        const x=entries.find(e=>e.cat===a&&e.verified&&sourceGrade(e)>=83);
        const y=entries.find(e=>e.cat===b&&e.verified&&sourceGrade(e)>=83);
        if(x&&y)pairs.push(effect('mix:'+a+':'+b,title,'elite-duo',tone,[...new Set([x.pid,y.pid])],m,{
          ingredients:[x,y],qualification:name(x.pid)+' '+a+' ('+sourceGrade(x)+') + '+name(y.pid)+' '+b+' ('+sourceGrade(y)+') · both 83+',
          activation:'When these two high-level tools work together in a matching possession, modify the shot, read or defensive recovery.'}));
      }
      for(const [cats,title,m,tone]of COMBO_TRIOS){
        const es=cats.map(c=>entries.find(e=>e.cat===c&&e.verified&&sourceGrade(e)>=87));
        if(es.every(Boolean))trios.push(effect('triple:'+cats.join(':'),title,'elite-trio',tone,
          [...new Set(es.map(e=>e.pid))],m,{ingredients:es,
          qualification:es.map(e=>name(e.pid)+' '+e.cat+' ('+sourceGrade(e)+')').join(' + ')+' · 87+ each',
          activation:'The three qualified skills combine during matching plays to unlock coordinated counters and recovery actions.'}));
      }
    }else if(mode==='team'){
      for(const [tools,title,m,tone]of TEAM_CHAINS){
        const used=new Set(),es=[];
        for(const [tool,min]of tools){
          const selected=entries.filter(e=>e.verified&&!used.has(e.pid)&&e.attrs[tool]>=min)
            .sort((a,b)=>b.attrs[tool]-a.attrs[tool])[0];
          if(!selected)break;used.add(selected.pid);es.push(selected);
        }
        if(es.length===3)trios.push(effect('scheme:'+tools.map(x=>x[0]).join(':'),title,'tactical-trio',
          tone,es.map(e=>e.pid),m,{ingredients:es,
          qualification:es.map((e,i)=>name(e.pid)+' '+tools[i][0]+' '+Math.round(e.attrs[tools[i][0]])+' ≥ '+tools[i][1]).join(' + '),
          activation:'Only when all three named historical-season players are on the floor, their complementary roles influence actual possessions.'}));
      }
    }
    return {pairs,trios};
  }

  function selectedMechanics(pid,cats,mode){return Object.fromEntries(Object.entries(PROFILES[pid]||{}).filter(([k])=>mode==='team'||DOMAINS[k]?.some(c=>cats.includes(c))));}
  function effect(id,n,type,tone,ps,mechanics,extra={}){return {id,name:n,type,tone,players:ps,mechanics,bonus:{},boost:{},colors:PALETTE[tone]||PALETTE.arc,
    activation:'While the relevant skills are used together; team partners must share the floor.',description:Object.keys(mechanics).map(k=>MECHANIC_TEXT[k]).join(' '),...extra};}
  function qualificationFor(r,es,b,mode){
    const label=k=>HL.ATTRS?.find(a=>a.key===k)?.label||k;
    const measured=(minimum,attrs)=>Object.entries(minimum||{}).map(([k,v])=>`${label(k)} ${Math.round(attrs[k])} ≥ ${v}`).join(', ');
    if(mode==='team')return es.map(e=>`${name(e.pid)} · ${e.season}-${String(+e.season+1).slice(-2)}: ${measured(r.roleTools?.[e.pid],e.attrs)}`).join('; ');
    return `${b.height} inch frame (requires ${r.frame[0]}–${r.frame[1]}); ${r.needs.map((n,i)=>`${name(es[i].pid)}’s ${n.cat}: ${measured(n.min,b.attrs)}`).join('; ')}. Values reflect the playable build.`;
  }
  function qualify(r,entries,b,mode){
    if(r.mode){if(mode!==r.mode)return null;const es=r.p.map(pid=>entries.find(e=>e.pid===pid&&e.verified&&(!r.years||(+e.season>=r.years[0]&&+e.season<=r.years[1]))&&Object.entries(r.roleTools?.[pid]||{}).every(([k,v])=>e.attrs[k]>=v)));return es.every(Boolean)?es:null;}
    if(mode!=='skill'||!b.body||!Number.isFinite(b.height)||b.height<r.frame[0]||b.height>r.frame[1]||!Object.entries(r.tools||{}).every(([k,v])=>b.attrs[k]>=v))return null;
    const es=r.needs.map(n=>entries.find(e=>e.cat===n.cat&&(!n.pid||n.pid===e.pid)&&e.verified&&Object.entries(n.min||{}).every(([k,v])=>e.attrs[k]>=v&&b.attrs[k]>=v)));
    return es.every(Boolean)?[...es,entries.find(e=>e.cat==='body'&&e.verified)]:null;
  }
  function analyze(rawEntries,{mode='skill',build:supplied={}}={}){
    const entries=[...new Map(rawEntries.filter(e=>e.pid||e.row?.pid).map(e=>[`${e.pid||e.row.pid}:${e.cat}`,evidence(e)])).values()].sort((a,b)=>`${a.pid}:${a.cat}`.localeCompare(`${b.pid}:${b.cat}`));
    const players=[...new Set(entries.map(e=>e.pid))],cats=[...new Set(entries.map(e=>e.cat))],build=buildContext(entries,supplied),signatures=[],pairs=[],trios=[];
    for(const pid of players){const s=STARS[pid],es=entries.filter(e=>e.pid===pid),m=selectedMechanics(pid,es.map(e=>e.cat),mode);if(s&&Object.keys(m).length)signatures.push(effect(`sig:${pid}`,s.title,'signature',s.tone,[pid],m,{qualification:`Inherited from ${name(pid)}: ${es.map(e=>e.cat).join(', ')}.`,ingredients:es}));}
    for(const r of RELATIONS)if(r.p.every(pid=>players.includes(pid))){
      const m=Object.fromEntries(Object.entries(REL_MECHANICS[r.name]||{}).filter(([k])=>mode==='team'||DOMAINS[k]?.some(c=>cats.includes(c))));
      const relevant=e=>Object.keys(m).some(k=>DOMAINS[k]?.includes(e.cat));
      if(!Object.keys(m).length||mode==='skill'&&!r.p.every(pid=>entries.some(e=>e.pid===pid&&relevant(e))))continue;
      const es=r.p.map(pid=>entries.find(e=>e.pid===pid&&(mode==='team'||relevant(e))));
      const f=effect(`chem:${key(r.p)}`,r.name,r.p.length===3?'historical-trio':'historical-duo',r.tone,r.p,m,{qualification:`Established partnership: ${es.map(e=>`${name(e.pid)}${mode==='skill'?`’s ${e.cat}`:''}`).join(' + ')}.`,ingredients:es});(r.p.length===3?trios:pairs).push(f);
    }
    if(mode==='skill')for(const [cs,n,m,tone]of SECONDARY){const es=cs.map(c=>entries.find(e=>e.cat===c&&e.verified));if(es.every(Boolean)&&es.every(e=>Math.max(...(CATEGORY_ATTRS[e.cat]||[]).map(k=>e.attrs[k]))>=75))pairs.push(effect(`skill:${cs.join(':')}`,n,'duo',tone,[...new Set(es.map(e=>e.pid))],m,{ingredients:es,qualification:es.map(e=>`${name(e.pid)}’s ${e.cat}`).join(' + ')}));}
    if(mode==='team')for(const [a,b,n,m,tone]of [
      ['gravity','deepSeal','Range and Deep-Post Space',{gravity:.45,postRead:.35},'arc'],['precision','lob','Passer and Above-Rim Target',{precision:.45,lob:.5},'gold'],
      ['screenRead','screen','Ball Handler and Screen Setter',{screenRead:.45,screen:.5},'earth'],['laneDisruption','rimIntimidation','Wing Pressure and Back-Line Cover',{rotations:.5,laneDisruption:.35},'emerald']]){
      const ea=entries.find(e=>e.verified&&(PROFILES[e.pid]?.[a]||0)>=.8),eb=entries.find(e=>e.verified&&e.pid!==ea?.pid&&(PROFILES[e.pid]?.[b]||0)>=.8);
      if(ea&&eb&&!pairs.some(f=>f.players.includes(ea.pid)&&f.players.includes(eb.pid)))pairs.push(effect(`fit:${a}:${b}:${key([ea.pid,eb.pid])}`,n,'duo',tone,[ea.pid,eb.pid],m,{ingredients:[ea,eb],qualification:`${name(ea.pid)} + ${name(eb.pid)}; compatible ${a} and ${b} roles.`}));}
    const generated=derivedChemistry(entries,mode);
    pairs.push(...generated.pairs);trios.push(...generated.trios);
    const qualified=RECIPES.map(r=>({r,es:qualify(r,entries,build,mode)})).filter(x=>x.es).sort((a,b)=>(b.r.priority||1)-(a.r.priority||1)||a.r.id.localeCompare(b.r.id)),mutations=[],families=new Set();
    for(const {r,es}of qualified){if(families.has(r.family)||mutations.length>=2)continue;families.add(r.family);mutations.push(effect(`mutation:${r.id}`,r.name,r.type||'mutation',r.tone,[...new Set(es.map(e=>e.pid))],r.mechanics,{...r,id:`mutation:${r.id}`,type:r.type||'mutation',ingredients:es,qualification:qualificationFor(r,es,build,mode),target:r.target||null}));}
    return {players,cats,mode,build,signatures,pairs,trios,mutations,active:[...signatures,...pairs,...trios,...mutations]};
  }
  function mergeMechanics(items){const out={};for(const f of items)for(const[k,v]of Object.entries(f.mechanics||{}))out[k]=Math.max(out[k]||0,v);return out;}
  function bonusEffects(dna,scope=null){const out={};for(const f of dna.active||[])if(!scope||f.players.includes(scope))for(const[k,v]of Object.entries(f.bonus||{}))out[k]=clamp((out[k]||0)+v,-.03,.06);return out;}
  function applyBuild(build,dna){build.dna=dna;build.effects=bonusEffects(dna);build.mechanics=mergeMechanics(dna.active);return build;}
  function applyTeam(players,entries){const dna=analyze(entries,{mode:'team'});for(const p of players){const pid=p.historicalPid||p.pid||entries.find(e=>e.playerId===p.id)?.pid,privateFx=dna.signatures.filter(s=>s.players.includes(pid)),links=dna.active.filter(s=>s.type!=='signature'&&s.players.includes(pid)&&(!s.target||s.target===pid));p.dna={effects:bonusEffects({active:privateFx}),mechanics:mergeMechanics(privateFx),links:links.map(f=>({id:f.id,players:f.players,mechanics:f.mechanics})),signature:privateFx[0]?.name||null,mutations:links.filter(s=>s.type==='mutation'||s.type==='evolved').map(s=>s.name)};}return dna;}
  function mechanicsFor(p,lineup=[],cache=null){
    if(cache?.get(lineup)?.has(p))return cache.get(lineup).get(p);
    const items=[{mechanics:p?.dna?.mechanics||{}}];for(const link of p?.dna?.links||[])if(link.players.every(pid=>lineup.some(x=>(x.historicalPid||x.pid)===pid)))items.push(link);
    const tool={gravity:'three',relocation:'speed',quickRelease:'releaseSpeed',range:'three',screenMove:'speed',anticipation:'iq',highRelease:'releaseHeight',precision:'vision',creation:'shotCreation',clutchChoice:'clutchShot',contactBalance:'str',transition:'speed',postRead:'vision',deepSeal:'post',postDouble:'post',secondChance:'oreb',lob:'vert',laneDisruption:'steal',rotations:'helpD',screen:'screen',boxPosition:'boxout',rimIntimidation:'block',postFootwork:'footwork',screenRead:'vision'},a=p?.attrs||{};
    const result=Object.fromEntries(Object.entries(mergeMechanics(items)).map(([k,v])=>[k,v*clamp(((a[tool[k]]??75)-25)/50,0,1)]));
    if(cache){if(!cache.has(lineup))cache.set(lineup,new WeakMap());cache.get(lineup).set(p,result);}return result;}
  function reconcileAttributes(source,height=78){
    const attrs={...source},constraints=[];
    const cap=(k,value,reason)=>{if(Number.isFinite(attrs[k])&&attrs[k]>value){constraints.push({key:k,ceiling:attrs[k],effective:Math.round(value),reason});attrs[k]=Math.round(value);}};
    // Tall standing reach needs less lift; a short player needs both elevation and burst.
    cap('dunk',clamp(37+(attrs.vert??65)*.42+(attrs.burst??65)*.24+Math.max(0,height-72)*1.8,25,100),'Dunk execution depends on standing reach, vertical and explosiveness.');
    cap('screen',clamp(28+(attrs.str??65)*.65+(attrs.iq??65)*.18,25,100),'Screen execution depends on strength and positional timing.');
    cap('block',clamp(35+Math.max(0,height-72)*2+(attrs.vert??65)*.28+(attrs.helpD??65)*.16,25,100),'Block execution depends on reach, elevation and help timing.');
    cap('shotCreation',clamp(30+(attrs.handle??65)*.55+(attrs.footwork??65)*.2+(attrs.burst??65)*.15,25,100),'Shot creation needs handle, footwork and separation.');
    return {attrs,constraints};
  }
  function basketballContext({shooter,defender,lineup=[],dline=[],type=null,transition=false,clutch=false,assisted=false,passer=null,coverage='man',play=null,cache=null}){
    const m=mechanicsFor(shooter,lineup,cache),dm=dline.map(p=>mechanicsFor(p,dline,cache)),a=shooter.attrs||{};
    const best=k=>Math.max(0,...dm.map(x=>x[k]||0)),own=k=>m[k]||0;
    const gravity=Math.max(0,...lineup.filter(p=>p!==shooter).map(p=>mechanicsFor(p,lineup,cache).gravity||0));
    const supportingPrecision=Math.max(0,...lineup.filter(p=>p!==shooter).map(p=>mechanicsFor(p,lineup,cache).precision||0));
    const passingPrecision=passer&&passer!==shooter&&lineup.includes(passer)?mechanicsFor(passer,lineup,cache).precision||0:0;
    const height=shooter.height||78,dh=defender?.height||78;
    const screener=lineup.filter(p=>p!==shooter).reduce((v,p)=>Math.max(v,(p.attrs?.screen||50)/100*(.65+(mechanicsFor(p,lineup,cache).screen||0)*.35)),0);
    const screen=(own('screenMove')+own('screenRead')*.65+own('relocation')*.65)*screener;
    const postThreat=!transition&&(shooter.tend?.post||0)>25?own('postDouble'):0;
    const read=clamp(own('postRead')+Math.max(0,(a.vision||65)-75)/40,0,1.8);
    const out={make:0,block:0,foul:0,assist:0,turnover:0,rimWeight:1,midWeight:1,threeWeight:1,kickChance:0,rebOff:0,actions:[]};
    const add=(key,amount)=>{if(amount>0&&!out.actions.includes(key))out.actions.push(key);};
    out.threeWeight+=own('range')*.25+own('relocation')*.25+screen*.18;
    out.rimWeight+=own('deepSeal')*.3+own('contactBalance')*.12+own('transition')*(transition?.4:0);
    out.rimWeight*=Math.max(.65,1-best('rimIntimidation')*.12);
    out.midWeight+=own('creation')*.18+own('highRelease')*.12;
    if(clutch){out.midWeight+=own('clutchChoice')*.22;out.threeWeight+=own('clutchChoice')*(a.three>=a.mid?.18:-.1);}
    out.turnover=best('laneDisruption')*.012-own('precision')*.012+postThreat*.015*(1-read*.45);
    out.assist=supportingPrecision*.035+screen*.07+read*postThreat*.04;
    out.kickChance=clamp(postThreat*read*.24,0,.6);
    out.rebOff=clamp(own('secondChance')*.025+own('boxPosition')*.01-best('boxPosition')*.025,-.06,.06);
    if(type==='rim'){
      out.make+=gravity*.05;add('gravitySpace',gravity);
      if(height<=77&&dh>height+2){out.make+=own('contactBalance')*.055;out.foul+=own('contactBalance')*.18;add('contactBalance',own('contactBalance'));}
      if(!transition&&(shooter.tend?.post||0)>25){out.make+=own('deepSeal')*(dh<height?.065:.04)+own('postFootwork')*.035-postThreat*.015;add('deepSeal',own('deepSeal'));add('postDouble',postThreat);}
      if(transition){out.make+=own('transition')*.06;add('transitionMismatch',own('transition'));}
      if(assisted){out.make+=own('lob')*.06;add('lob',own('lob'));}
      out.make-=best('rimIntimidation')*.05;out.block+=best('rimIntimidation')*.025;add('rimIntimidation',best('rimIntimidation'));
    }else if(type){
      if(assisted){out.make+=own('quickRelease')*.03+screen*.025;add('quickRelease',own('quickRelease'));add('screenWindow',screen);add('relocation',own('relocation'));}
      else{out.make+=own('creation')*.04+own('anticipation')*.025;add('shotCreation',own('creation'));add('shotAnticipation',own('anticipation'));}
      if(height>dh){out.make+=own('highRelease')*.035*clamp((height-dh)/5,0,1);add('highRelease',own('highRelease'));}
      out.make-=best('rotations')*.025;add('defensiveRecovery',best('rotations'));
      if(coverage==='drop'&&screen>0)out.make+=screen*.015;
    }
    if(assisted&&type){out.make+=passingPrecision*.02;add('precisionPass',passingPrecision);}
    if(clutch&&type){out.make+=own('clutchChoice')*.025;add('clutchCounter',own('clutchChoice'));}
    if(type&&out.turnover>0)add('passingLanePressure',best('laneDisruption'));
    out.make=clamp(out.make,-.14,.18);return out;
  }
  function visual(f,{compact=false}={}){const detail=`<p>${esc(f.description)}</p><p><b>Unlocked by</b> ${esc(f.qualification)}</p><p><b>Activates</b> ${esc(f.activation)}</p>`;return `<article class="dna-effect dna-${esc(f.type)}" style="--dna-a:${f.colors[0]};--dna-b:${f.colors[1]}" data-dna="${esc(f.id)}"><div class="dna-mark" aria-hidden="true">${['mutation','evolved'].includes(f.type)?'✦':f.type.includes('trio')?'Ⅲ':f.type.includes('duo')?'Ⅱ':'★'}</div><div><span class="dna-kind">${esc(f.type.replaceAll('-',' '))}</span><b>${esc(f.name)}</b><details><summary>How it works</summary>${detail}</details>${compact?'':`<p>${esc(f.activation)}</p>`}</div></article>`;}
  function board(dna,{compact=false}={}){if(!dna)return '';const featured=[...dna.mutations,...dna.trios,...dna.pairs.slice(0,compact?2:6),...dna.signatures.slice(0,compact?1:3)],more=[...dna.pairs.slice(compact?2:6),...dna.signatures.slice(compact?1:3)];if(!featured.length)return '<p class="t3 sm">Draft compatible skills to discover chemistry. Transformations require verified elite tools and a matching build.</p>';return `<section class="dna-showcase"><div class="dna-section-label">${compact?'BUILD DNA':'SIGNATURES · CHEMISTRY · RARE TRANSFORMATIONS'}</div><div class="dna-effect-grid">${featured.map(f=>visual(f,{compact})).join('')}</div>${more.length?`<details><summary>Inspect ${more.length} more abilities</summary><div class="dna-effect-grid">${more.map(f=>visual(f,{compact})).join('')}</div></details>`:''}</section>`;}

  function codex(dna){
    if(!dna)return '';
    const active=[...dna.signatures,...dna.pairs,...dna.trios,...dna.mutations];
    const existing=new Set(active.map(x=>x.id));
    const unlocked=active.filter(x=>!x.type.includes('signature'));
    const show=f=>'<article class="dna-index-entry"><div class="dna-index-top"><b>'+
      esc(f.name)+'</b><span class="dna-index-rank">'+esc(f.type.replaceAll('-',' ').toUpperCase())+'</span></div>'+
      '<p>'+esc(f.activation)+'</p><div class="dna-index-tools">'+
      Object.entries(f.mechanics||{}).map(([k,v])=>'<div><strong>'+esc(k.replace(/([A-Z])/g,' $1'))+
      '</strong><span>'+esc(MECHANIC_TEXT[k]||'Specialized basketball advantage.')+
      '</span><small>'+Math.round(v*100)+'% force</small></div>').join('')+'</div>'+
      '<small class="dna-index-trigger">'+esc(f.qualification||'')+'</small></article>';
    const locked=(id,name,cats,threshold,m,tone)=>'<article class="dna-index-entry locked">'+
      '<div class="dna-index-top"><b>'+esc(name)+'</b><span class="dna-index-rank">NOT UNLOCKED</span></div>'+
      '<p>Draft '+cats.map(x=>esc(x)).join(' + ')+' with verified ratings of '+threshold+
      '+ in each category, then use the qualifying skills together.</p>'+
      '<div class="dna-index-tools">'+Object.keys(m).map(k=>'<div><strong>'+esc(k.replace(/([A-Z])/g,' $1'))+
      '</strong><span>'+esc(MECHANIC_TEXT[k]||'Tactical possession behavior')+'</span></div>').join('')+'</div></article>';
    const lockedD=COMBO_DUOS.filter(([a,b])=>!existing.has('mix:'+a+':'+b));
    const lockedT=COMBO_TRIOS.filter(([cats])=>!existing.has('triple:'+cats.join(':')));
    const pending=dna.mode==='team'?TEAM_CHAINS.filter(([tools])=>!existing.has('scheme:'+tools.map(x=>x[0]).join(':'))):[];
    return '<section class="block dna-codex"><header><h3>DNA ABILITY ENCYCLOPEDIA</h3>'+
      '<span class="ml-auto t3 sm">'+unlocked.length+' ACTIVE · '+
      (COMBO_DUOS.length+COMBO_TRIOS.length+TEAM_CHAINS.length)+' POSSIBLE POWER PATTERNS</span></header>'+
      '<div class="body stack"><p class="t2 sm">Every unlocked link is an actual basketball possession mechanic. They do not provide automatic overall boosts. Rare mutations need verified elite historical evidence, and each form has its own activation condition.</p>'+
      '<div class="dna-index-summary"><div><b>'+dna.pairs.length+'</b><span>Duos</span></div>'+
      '<div><b>'+dna.trios.length+'</b><span>Trios</span></div>'+
      '<div><b>'+dna.mutations.length+'</b><span>Rare forms</span></div>'+
      '<div><b>'+dna.signatures.length+'</b><span>Signature tools</span></div></div>'+
      '<details open><summary>ACTIVE SPECIAL SKILLS · '+active.length+'</summary>'+
      '<div class="dna-index-grid">'+active.map(show).join('')+'</div></details>'+
      (dna.mode==='skill'?'<details><summary>UNDISCOVERED ELITE DUOS · '+lockedD.length+'</summary>'+
        '<div class="dna-index-grid">'+lockedD.map(([a,b,name,m,tone])=>
        locked('mix:'+a+':'+b,name,[a,b],83,m,tone)).join('')+'</div></details>'+
        '<details><summary>UNDISCOVERED POWER TRIOS · '+lockedT.length+'</summary>'+
        '<div class="dna-index-grid">'+lockedT.map(([cats,name,m,tone])=>
        locked('triple:'+cats.join(':'),name,cats,87,m,tone)).join('')+'</div></details>':
        '<details><summary>TEAM POWER PLAYS TO ASSEMBLE · '+pending.length+'</summary>'+
        '<div class="dna-index-grid">'+pending.map(([tools,name,m,tone])=>
        locked('scheme:'+tools.map(x=>x[0]).join(':'),name,tools.map(x=>x[0]+' ≥ '+x[1]),'exact roster',m,tone)).join('')+
        '</div></details>')+
      '</div></section>';
  }

  // Live combination visualization: show exactly which borrowed ingredients
  // connected, which powers activate, and what a possession can actually do.
  function powerMap(dna,{compact=false}={}){
    if(!dna)return '';
    const active=[...(dna.mutations||[]),...(dna.trios||[]),...(dna.pairs||[]),...(dna.signatures||[])];
    const sorted=active.slice().sort((a,b)=>{
      const rank=f=>f.type==='mutation'||f.type==='evolved'?4:f.type.includes('trio')?3:
       f.type.includes('duo')?2:1;
      return rank(b)-rank(a)||Object.keys(b.mechanics||{}).length-Object.keys(a.mechanics||{}).length;
    });
    const selected=sorted.slice(0,7);
    const dot=key=>'<span class="power-map-source">'+esc(key)+'</span>';
    const nodes=selected.map((f,i)=>{
      const ingredients=[...new Set((f.ingredients||[]).map(e=>name(e.pid)))];
      const trigger=Object.entries(f.mechanics||{}).sort((a,b)=>b[1]-a[1]).slice(0,3);
      return '<article class="power-map-node" style="--power-order:'+i+';--power-a:'+f.colors[0]+'">'+
        '<div class="power-map-top"><span>'+esc(f.type.replaceAll('-',' '))+'</span><b>'+
          (f.type==='mutation'||f.type==='evolved'?'APEX':f.type.includes('trio')?'TRIO':
            f.type.includes('duo')?'DUO':'SIGNATURE')+'</b></div>'+
        '<h4>'+esc(f.name)+'</h4><div class="power-map-parents">'+
          (ingredients.length?ingredients.map(dot).join('<i>+</i>'):f.players.map(pid=>dot(name(pid))).join('<i>+</i>'))+'</div>'+
        '<div class="power-map-active">'+trigger.map(([key,v])=>
          '<div><b>'+esc(key.replace(/([A-Z])/g,' $1'))+'</b><span>'+
           Math.round(v*100)+'% potency</span></div>').join('')+'</div>'+
        '<details><summary>When does this actually activate?</summary><p>'+esc(f.activation)+'</p>'+
          '<p>'+esc(f.description)+'</p><p>'+esc(f.qualification||'Historical attributes confirmed.')+
          '</p></details></article>';
    }).join('');
    return '<section class="block power-map"><header><h3>POWER NETWORK · ACTIVE ON-COURT ABILITIES</h3>'+
      '<span class="ml-auto t3 sm">'+active.length+' unlocked · '+(dna.mutations||[]).length+
      ' rare mutations</span></header><div class="body stack">'+
      '<div class="power-map-scoreboard"><div><strong>'+(dna.pairs||[]).length+
      '</strong><span>Elite duos</span></div><div><strong>'+(dna.trios||[]).length+
      '</strong><span>Power trios</span></div><div><strong>'+(dna.signatures||[]).length+
      '</strong><span>Individual tools</span></div><div><strong>'+(dna.mutations||[]).length+
      '</strong><span>Rare forms</span></div></div>'+
      '<p class="t2 sm">Each strand has named historical sources and measurable gameplay interactions. Stronger combinations unlock different possessions, not free permanent OVR boosts.</p>'+
      '<div class="power-map-network">'+(nodes||
       '<div class="power-map-empty">Draft your first verified elite basketball tool to light the network.</div>')+
      '</div><details><summary>Explore every possible and missing power combination</summary>'+
      codex(dna)+'</details></div></section>';
  }

  function preview(entries,candidate,options={}){const next=analyze([...entries,candidate],options),old=analyze(entries,options);return [...next.mutations,...next.trios,...next.pairs].find(f=>!old.active.some(o=>o.id===f.id))||null;}
  return {STARS,RELATIONS,FORMS:RECIPES.filter(r=>r.mode==='team'),RECIPES,PROFILES,CATEGORY_ATTRS,MECHANIC_TEXT,COMBO_DUOS,COMBO_TRIOS,TEAM_CHAINS,analyze,bonusEffects,mergeMechanics,mechanicsFor,reconcileAttributes,basketballContext,applyBuild,applyTeam,visual,board,codex,powerMap,preview,esc,PALETTE};
})();
