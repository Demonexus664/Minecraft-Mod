from pathlib import Path
p=Path('/mnt/data/hoops-mutant-release/js/league/legend-dna.js')
s=p.read_text()
marker='    boshch01:{name:\'Chris Bosh\''
assert marker in s
extra='''    olajuha01:{name:'Hakeem Olajuwon',key:'dream',title:'Dream Shake',style:'deceptive low-post footwork and elite rim defense',tone:'emerald',bonus:{rim:.023,block:.020},boost:{post:2,footwork:3}},
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
'''
s=s.replace(marker,extra+marker)
# tie every category to a relevant simulator domain; rare patterned pair synergies remain richer
anchor='  const FAMILIES = ['
addition='''  const CATEGORY_DOMAINS={
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
'''
assert anchor in s;s=s.replace(anchor,addition+anchor)
a="      const primary=ca==='three'||cb==='three'?'three':ca==='reb'||cb==='reb'?'reb':ca==='pass'||cb==='pass'?'assist':ca==='steal'||cb==='steal'?'steal':'rim';\n      const secondary=['mid','transition','clutch','defense','assist','reb'][(h>>>8)%6];"
b="""      const ad=CATEGORY_DOMAINS[ca]||['rim','transition'],bd=CATEGORY_DOMAINS[cb]||['mid','assist'];
      const primary=ad[0]===bd[0]?ad[0]:[ad[0],bd[0]][(h>>>5)%2];
      const secondary=[ad[1],bd[1]][(h>>>8)%2];"""
assert a in s;s=s.replace(a,b)
a="      const domain=['three','rim','assist','defense','reb','mid','transition'][h%7];"
b="""      const core=ps.map(p=>categoriesFor(entries,p)[0]||'star').map(c=>CATEGORY_DOMAINS[c]||['transition']);
      const domain=core[h%core.length][0];"""
assert a in s;s=s.replace(a,b)
p.write_text(s)
print('expanded signature identities to',s.count('title:'),'and added category-domain chemistry')