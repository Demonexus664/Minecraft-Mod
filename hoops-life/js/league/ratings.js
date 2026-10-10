// Attributes, archetype profiles, OVR formula and age-based progression.
window.HL = window.HL || {};

HL.ATTRS = [
  // key, label, group
  ['close', 'Close Shot', 'Scoring'],
  ['mid', 'Mid-Range', 'Scoring'],
  ['three', 'Three-Point', 'Scoring'],
  ['ft', 'Free Throw', 'Scoring'],
  ['layup', 'Layup', 'Finishing'],
  ['dunk', 'Dunk', 'Finishing'],
  ['post', 'Post Control', 'Finishing'],
  ['handle', 'Ball Handle', 'Playmaking'],
  ['pass', 'Passing', 'Playmaking'],
  ['iq', 'Basketball IQ', 'Playmaking'],
  ['perD', 'Perimeter D', 'Defense'],
  ['intD', 'Interior D', 'Defense'],
  ['steal', 'Steal', 'Defense'],
  ['block', 'Block', 'Defense'],
  ['oreb', 'Off. Rebound', 'Rebounding'],
  ['dreb', 'Def. Rebound', 'Rebounding'],
  ['speed', 'Speed', 'Athleticism'],
  ['vert', 'Vertical', 'Athleticism'],
  ['str', 'Strength', 'Athleticism'],
  ['stam', 'Stamina', 'Athleticism'],
  ['dur', 'Durability', 'Athleticism'],
  // Estimated basketball traits, not official measured tracking values.
  ['accel', 'Acceleration', 'Athleticism'],
  ['lateral', 'Lateral Quickness', 'Defense'],
  ['releaseSpeed', 'Release Speed (est.)', 'Shooting Mechanics'],
  ['releaseHeight', 'Release Height (est.)', 'Shooting Mechanics'],
  ['shotArc', 'Shot Arc & Touch (est.)', 'Shooting Mechanics'],
  ['contested', 'Contested Shot', 'Scoring'],
  ['screen', 'Screen Setting', 'Finishing'],
  ['hustle', 'Hustle', 'Athleticism'],
  ['burst', 'Explosiveness', 'Athleticism'],
  ['agility', 'Change of Direction', 'Athleticism'],
  ['contactFinish', 'Contact Finishing', 'Finishing'],
  ['floater', 'Floater & Touch', 'Finishing'],
  ['fade', 'Post & Turnaround Fade', 'Scoring'],
  ['footwork', 'Footwork', 'Finishing'],
  ['shotCreation', 'Shot Creation', 'Scoring'],
  ['vision', 'Passing Vision', 'Playmaking'],
  ['passingAccuracy', 'Pass Accuracy', 'Playmaking'],
  ['helpD', 'Help Defense', 'Defense'],
  ['contestD', 'Shot Contest', 'Defense'],
  ['boxout', 'Box Out', 'Rebounding'],
  ['transition', 'Transition Threat', 'Athleticism'],
  ['clutchShot', 'Late-game Shotmaking', 'Scoring'],
  ['shotSelection', 'Shot Decision-Making (est.)', 'Scoring'],
].map(([key, label, group]) => ({ key, label, group }));

HL.ATTR_KEYS = HL.ATTRS.map(a => a.key);
HL.CORE_ATTR_KEYS = HL.ATTR_KEYS.filter(k => !['accel','lateral','releaseSpeed','releaseHeight','shotArc','contested','screen','hustle','burst','agility','contactFinish','floater','fade','footwork','shotCreation','vision','passingAccuracy','helpD','contestD','boxout','transition','clutchShot','shotSelection'].includes(k));
HL.ADV_ATTR_KEYS = HL.ATTR_KEYS.filter(k => !HL.CORE_ATTR_KEYS.includes(k));

// The historical box-score database contains the core 21 skills. No release-time or
// jump-height tracking exists for many old seasons. These additional values are scouting
// estimates derived independently from relevant traits and player dimensions.
// Keep them separate from accuracy and mark them as modeled in every detail screen.
HL.completeAttributes = function (a, height = 78, weight = 210) {
  const h=Number.isFinite(height)?height:78, w=Number.isFinite(weight)?weight:210;
  const val = (key, fallback=65) => Number.isFinite(a[key]) ? a[key] : fallback;
  const clip = x => Math.round(HL.clamp(x,25,99));
  const result={...a};
  const derived={
    accel: clip(val('speed')*.69+val('handle')*.19+val('vert')*.12),
    lateral: clip(val('perD')*.44+val('speed')*.34+val('steal')*.22),
    releaseSpeed: clip(val('three')*.33+val('mid')*.25+val('handle')*.22+val('iq')*.20),
    // A release score describes elevation relative to frame and skill, not raw height alone.
    // The matchup system already handles the player's absolute physical reach.
    releaseHeight: clip(50+(h-70)*1.35+(val('vert')-65)*.18+
      (Math.max(val('mid'),val('three'))-65)*.25+(val('iq')-65)*.04),
    shotArc: clip(val('ft')*.36+val('mid')*.30+val('three')*.20+val('iq')*.14),
    contested: clip(val('mid')*.28+val('close')*.18+val('handle')*.20+val('iq')*.20+val('str')*.14),
    screen: clip(val('str')*.58+val('iq')*.22+val('post')*.2+(w-215)*.05),
    hustle: clip(val('stam')*.38+val('dur')*.16+val('oreb')*.18+val('perD')*.14+val('iq')*.14),
    burst: clip(Math.max(val('vert')*.62+val('speed')*.38, val('dunk')*.42+val('vert')*.35+val('speed')*.23)),
    agility: clip(val('speed')*.39+val('handle')*.31+val('perD')*.20+val('vert')*.10),
    contactFinish: clip(val('layup')*.26+val('dunk')*.25+val('str')*.33+val('close')*.16),
    floater: clip(val('layup')*.40+val('mid')*.24+val('iq')*.21+val('ft')*.15),
    fade: clip(val('post')*.24+val('mid')*.48+val('close')*.08+val('iq')*.20 + Math.max(0,Math.min(val('mid'),val('post'))-80)*.32),
    footwork: clip(val('post')*.34+val('handle')*.27+val('iq')*.24+val('layup')*.15),
    shotCreation: clip(val('handle')*.39+val('mid')*.32+val('iq')*.15+val('layup')*.14),
    vision: clip(val('pass')*.65+val('iq')*.35),
    passingAccuracy: clip(val('pass')*.64+val('handle')*.15+val('iq')*.21),
    helpD: clip(val('intD')*.30+val('perD')*.25+val('block')*.22+val('iq')*.23),
    contestD: clip(val('perD')*.30+val('intD')*.30+val('block')*.22+val('vert')*.18),
    boxout: clip(val('dreb')*.49+val('oreb')*.16+val('str')*.27+val('iq')*.08 + Math.max(0,(val('dreb')-88)*.23)),
    transition: clip(val('speed')*.30+val('vert')*.20+val('layup')*.25+val('handle')*.25),
    clutchShot: clip(val('mid')*.26+val('three')*.18+val('close')*.16+val('iq')*.29+val('ft')*.11 + Math.max(0,val('iq')-88)*.28),
    // Decision-making is a skill. Shot-diet percentages are NOT ratings of shot quality.
    shotSelection: clip(val('iq')*.42 + val('shotCreation',
      val('handle')*.42+val('mid')*.32+val('iq')*.13+val('layup')*.13)*.22 +
      val('layup')*.13+val('pass')*.10+
      Math.max(val('mid'),val('three'),val('close'))*.13)
  };
  for(const k of HL.ADV_ATTR_KEYS) if(!Number.isFinite(result[k]))result[k]=derived[k];
  return result;
};

// Individually authored scouting corrections, NOT another bulk recalibration.
// Years are season START years. Grades are floors for demonstrated specialties;
// explicit ceilings preserve weaknesses. Other skills and historical stats stay
// season-derived. These are editorial scouting estimates, not tracking measurements.
// Read each reason together with its years: reputation alone never applies a prime.
HL.HISTORICAL_SCOUTING = (() => {
  const n = (player, from, through, grades, reason, ceilings = {}) => ({player, from, through, grades, reason, ceilings});
  return [
    // Release specialists: quick hands, repeatable touch and actual shot-making.
    n('Stephen Curry',2009,2011,{releaseSpeed:95,shotArc:97,handle:88},'Early one-motion release and exceptional touch; handle still developing.'),
    n('Stephen Curry',2012,2025,{releaseSpeed:100,shotArc:100,handle:96,agility:94,floater:95,footwork:93},'One-motion release, relocation footwork and off-dribble touch; elevation remains frame-dependent.',{perD:83,pass:92}),
    n('Klay Thompson',2011,2012,{releaseSpeed:94,shotArc:94},'Early catch-and-shoot mechanics before the mature two-way role.'),
    n('Klay Thompson',2013,2018,{releaseSpeed:99,shotArc:98,three:95,perD:91,lateral:88,contestD:88},'Fast repeatable catch-and-shoot release and prime point-of-attack defense.',{handle:83,pass:79}),
    n('Klay Thompson',2021,2025,{releaseSpeed:96,shotArc:95},'Shooting technique survives Achilles/ACL injuries; prime lateral mobility does not.',{lateral:72,agility:76,perD:77,handle:79}),
    n('Ray Allen',1996,1998,{releaseSpeed:92,shotArc:93,three:89},'Young movement shooter with a disciplined elevated release.'),
    n('Ray Allen',1999,2013,{releaseSpeed:99,shotArc:99,three:95,footwork:91},'Elite movement shooting, squared feet and repeatable elevated release.',{intD:68}),
    n('Reggie Miller',1989,2004,{releaseSpeed:98,shotArc:98,three:94,clutchShot:97,footwork:91},'Off-screen footwork, rapid catch-and-shoot and proven late-game shooting.',{post:70,intD:67}),
    n('Larry Bird',1979,1988,{shotArc:99,releaseSpeed:95,contested:98,clutchShot:98,vision:98,passingAccuracy:97,footwork:96,iq:99},'High-touch release, difficult-shot counters and anticipatory passing.'),
    n('Larry Bird',1984,1988,{three:95},'Established long-range shot-making and three-point contest mastery.'),
    n('Larry Bird',1989,1991,{shotArc:98,contested:94,vision:97,iq:98},'Late-career touch and reads survive back problems without restoring peak mobility.'),
    n('Dirk Nowitzki',2001,2011,{shotArc:99,releaseHeight:95,fade:100,footwork:97,contested:98,mid:97,clutchShot:98},'High-release one-legged fade and exceptional face-up touch.',{perD:76}),
    n('Dirk Nowitzki',2012,2017,{shotArc:97,releaseHeight:93,fade:97,footwork:94,contested:92},'Late-career shooting geometry and technique, with season-derived athletic decline.'),
    n('Kevin Durant',2009,2025,{releaseHeight:98,shotArc:98,releaseSpeed:95,contested:99,shotCreation:96,footwork:94,mid:96},'Long-frame pull-ups and high-release difficult-shot creation.'),
    n('Peja Stojaković',2000,2007,{three:96,releaseSpeed:96,shotArc:98,footwork:88},'Elite movement shooter with high repeatable touch.',{perD:76}),
    n('Steve Nash',2000,2011,{shotArc:99,releaseSpeed:94,three:94,vision:100,passingAccuracy:100,handle:96,floater:97,iq:99},'Ambidextrous ball-screen passing, pull-up touch and shooting efficiency.',{perD:68,intD:59}),
    n('Mark Price',1987,1995,{three:94,shotArc:98,releaseSpeed:95,handle:92,passingAccuracy:96,vision:94,floater:91},'Elite split-screen handling, precise passing and compact shooting.',{intD:60}),
    n('Chris Mullin',1988,1996,{mid:94,three:91,shotArc:98,releaseSpeed:94,footwork:91},'Left-handed touch, off-ball timing and deliberate shooting footwork.'),
    n('Glen Rice',1993,1999,{three:96,mid:93,shotArc:97,releaseSpeed:95},'High-volume wing shooting and catch-and-shoot range.'),
    n('Dale Ellis',1986,1996,{three:95,shotArc:96,releaseSpeed:95,mid:91},'Quick-release high-volume perimeter specialist.'),
    n('Dell Curry',1988,1999,{three:94,releaseSpeed:97,shotArc:95},'Quick bench-shooter release independent of low overall usage.'),
    n('Kyle Korver',2004,2017,{three:97,releaseSpeed:98,shotArc:99,footwork:90},'Off-screen specialist with elite preparation and shooting touch.',{handle:73,shotCreation:78}),
    n('JJ Redick',2009,2019,{three:94,releaseSpeed:97,shotArc:96,footwork:92},'Sprint-to-square movement shooting and fast release.',{handle:78,intD:63}),
    n('Desmond Bane',2021,2025,{three:94,releaseSpeed:95,shotArc:95,contactFinish:86},'Compact high-volume release and strong driving balance.'),
    n('Buddy Hield',2017,2025,{three:93,releaseSpeed:96,shotArc:94},'Fast volume catch-and-shoot specialist.',{perD:74}),
    n('Duncan Robinson',2019,2025,{three:94,releaseSpeed:96,shotArc:95,footwork:87},'Movement shooting and handoff release; not an isolation creator.',{handle:76,perD:73}),
    n('Joe Harris',2016,2021,{three:94,releaseSpeed:93,shotArc:96},'Accurate prepared catch-and-shoot wing.'),
    n('Seth Curry',2015,2023,{three:95,releaseSpeed:94,shotArc:96},'High-touch reserve shooting, without his brother’s complete creation package.'),
    n('Kevin Huerter',2020,2024,{releaseSpeed:91,shotArc:91},'Quick handoff and movement-shooting mechanics.'),
    n('Malik Beasley',2018,2025,{three:91,releaseSpeed:95,shotArc:92},'Quick high-volume catch-and-shoot release.'),
    n('Luke Kennard',2018,2025,{three:95,releaseSpeed:93,shotArc:96},'Left-handed touch and prepared spot-up shooting.'),
    n('Steve Kerr',1988,2002,{three:95,releaseSpeed:94,shotArc:97},'Exceptional open-shot touch and quick preparation; limited self-creation.',{handle:74,shotCreation:74}),
    n('Tim Legler',1994,1996,{three:94,releaseSpeed:93,shotArc:95},'Peak spot-up shooting specialist, scoped to the demonstrated Washington years.'),
    n('Craig Hodges',1987,1992,{three:93,releaseSpeed:94,shotArc:96},'Repeatable long-range specialist release.'),
    n('Dennis Scott',1992,1996,{three:94,releaseSpeed:94,shotArc:95},'High-volume Orlando floor spacing.'),
    n('Hubert Davis',1993,2001,{three:93,releaseSpeed:93,shotArc:95},'Prepared reserve shooting touch.'),
    n('Brent Barry',1999,2006,{three:92,passingAccuracy:89,releaseSpeed:93,shotArc:94},'Efficient shooting and connective passing beyond bench scoring volume.'),
    n('Wesley Person',1994,2002,{three:92,releaseSpeed:94,shotArc:94},'Quick-release specialist wing shooting.'),
    n('Chuck Person',1988,1995,{three:90,releaseSpeed:91,contested:88},'Confident high-volume wing shooting.'),
    n('Jason Kapono',2005,2007,{three:95,shotArc:97,releaseSpeed:93},'Peak spot-up accuracy, with limited handling and creation.',{handle:70,shotCreation:71}),
    n('Mike Miller',2000,2012,{three:93,shotArc:95,releaseSpeed:92,passingAccuracy:86},'Wing shooting and passing connector, including low-usage title roles.'),
    n('Anthony Morrow',2008,2015,{three:94,releaseSpeed:94,shotArc:95},'Specialist spot-up shooting unrelated to star overall.'),
    n('Wayne Ellington',2014,2020,{three:91,releaseSpeed:95,shotArc:93},'Sprint-to-catch quick-release bench shooter.'),
    n('Doug McDermott',2016,2025,{three:91,shotArc:94,releaseSpeed:92},'Off-ball shooting and cutting touch.'),
    n('Bojan Bogdanović',2015,2023,{three:92,shotArc:94,contested:88},'Wing shooting and mismatch scoring touch.'),
    n('Bogdan Bogdanović',2018,2024,{three:91,releaseSpeed:92,shotCreation:89,passingAccuracy:87},'Pull-up, catch shooting and secondary ball-screen reads.'),
    n('Danny Green',2011,2019,{three:91,releaseSpeed:92,helpD:91,contestD:89,perD:88},'Transition/perimeter spacing and disciplined team defense.'),

    // Signature scoring tools: footwork and difficult shots are not box-score averages.
    n('Michael Jordan',1984,1988,{contactFinish:99,agility:99,burst:99,shotCreation:99,contested:99,layup:99},'Explosive first step and airborne finishing; not yet the mature post-fade version.'),
    n('Michael Jordan',1989,1997,{mid:99,fade:100,footwork:100,shotCreation:100,contested:100,clutchShot:100,contactFinish:98,perD:98},'Mature isolation counters, post footwork and elite late-game shot-making.'),
    n('Michael Jordan',2001,2002,{mid:94,fade:97,footwork:97,contested:94},'Washington-era technique without restoring Chicago athleticism.'),
    n('Kobe Bryant',1999,2012,{footwork:99,fade:99,contested:99,shotCreation:99,handle:96,clutchShot:99,mid:95,contactFinish:95},'Pivot counters, post fades and off-dribble difficult-shot creation.'),
    n('Kobe Bryant',1999,2007,{perD:94,lateral:92,contestD:91},'Prime on-ball defense; later reputation is not a permanent mobility boost.'),
    n('Kobe Bryant',2013,2015,{footwork:95,fade:94,contested:91},'Post-Achilles technique retains value without restoring peak separation.'),
    n('LeBron James',2005,2017,{contactFinish:99,layup:99,vision:99,passingAccuracy:98,transition:100,iq:99,footwork:93},'Power finishing, transition playmaking and cross-court passing reads.'),
    n('LeBron James',2008,2013,{perD:95,lateral:94,helpD:96,contestD:93},'Prime versatile containment and weak-side defensive rotations.'),
    n('LeBron James',2018,2025,{contactFinish:96,vision:99,passingAccuracy:98,iq:99,footwork:95},'Late-career strength and orchestration; current athletic/defensive grades remain season-specific.'),
    n('Dwyane Wade',2004,2011,{layup:99,contactFinish:98,floater:97,agility:98,footwork:94,shotCreation:96,helpD:89,contestD:87},'Slashing angles, pump-fake footwork and exceptional guard help defense.'),
    n('Tracy McGrady',2000,2006,{shotCreation:99,contested:98,handle:96,releaseHeight:91,footwork:94,mid:94},'Tall isolation release, pull-up creation and passing out of pressure.'),
    n('Allen Iverson',1998,2006,{handle:100,agility:100,accel:99,burst:98,shotCreation:98,contactFinish:94,layup:96,clutchShot:95},'Low dribble crossover, explosive separation and contact finishing.',{perD:80}),
    n('Kyrie Irving',2013,2025,{handle:100,agility:99,footwork:99,layup:99,floater:98,shotCreation:98,contested:96,shotArc:97},'Ambidextrous finishing, handle counters and multidirectional shooting footwork.'),
    n('Damian Lillard',2013,2025,{releaseSpeed:99,shotArc:98,handle:95,clutchShot:99,shotCreation:96},'Compact deep pull-up release and pressure shot-making.',{perD:74,intD:62}),
    n('James Harden',2012,2020,{handle:99,shotCreation:99,contested:97,passingAccuracy:97,vision:98,footwork:97,contactFinish:96},'Step-back separation, deceleration and pocket-pass reads.',{perD:81}),
    n('James Harden',2021,2025,{handle:96,passingAccuracy:97,vision:98,footwork:94},'Later-career ball-screen orchestration without peak driving explosion.'),
    n('Luka Dončić',2019,2025,{handle:98,footwork:99,shotCreation:99,contested:99,vision:99,passingAccuracy:98,contactFinish:97,clutchShot:97},'Deceleration, size-based separation and weak-side passing reads.',{perD:76}),
    n('Shai Gilgeous-Alexander',2021,2025,{footwork:99,mid:98,shotCreation:99,contested:97,agility:97,contactFinish:96,floater:97},'Change of pace, paint pivots and repeated midrange counters.'),
    n('Carmelo Anthony',2005,2013,{mid:97,post:94,fade:98,footwork:98,contested:98,shotCreation:96,clutchShot:97},'Jab-step, triple-threat and post-scoring counters.',{perD:77}),
    n('Paul Pierce',1999,2011,{footwork:97,contested:97,shotCreation:95,fade:94,clutchShot:97,contactFinish:94},'Pace changes, shoulder fakes and contact-based isolation scoring.'),
    n('Devin Booker',2018,2025,{mid:96,footwork:96,shotCreation:97,contested:97,releaseSpeed:94,shotArc:96},'Pull-up shooting, curled catches and mature scoring footwork.'),
    n('Donovan Mitchell',2019,2025,{shotCreation:95,handle:94,burst:96,contactFinish:92,releaseSpeed:94},'Explosive pull-up guard with contact balance and range.'),
    n('Jayson Tatum',2019,2025,{shotCreation:95,contested:94,handle:92,footwork:93,perD:86,helpD:88},'Tall wing shot creation and switchable defensive reads.'),
    n('Jaylen Brown',2021,2025,{burst:95,contactFinish:95,mid:92,perD:88,lateral:89},'Power-wing drives, athletic containment and developed pull-ups.'),
    n('Anthony Edwards',2022,2025,{burst:99,contactFinish:97,shotCreation:95,handle:92,perD:87,lateral:92},'Explosive power drives and active on-ball wing defense.'),
    n('Vince Carter',1998,2005,{dunk:100,vert:100,burst:99,contactFinish:97,contested:94},'Exceptional aerial repertoire and powerful one- and two-foot takeoffs.'),
    n('Dominique Wilkins',1984,1993,{dunk:99,burst:98,contactFinish:98,shotCreation:94,contested:94},'Power dunking and repeated wing scoring through contact.'),
    n('Julius Erving',1976,1983,{dunk:99,layup:99,contactFinish:98,footwork:95,transition:97},'Aerial finishing angles and open-floor wing attacks.'),
    n('David Thompson',1976,1981,{vert:99,burst:99,dunk:97,contactFinish:95,shotCreation:95},'Exceptional elevation and explosive guard scoring.'),
    n('George Gervin',1976,1985,{floater:100,layup:98,mid:95,contested:96,releaseHeight:89,footwork:94},'Finger-roll touch and high-release scoring angles.'),
    n('Adrian Dantley',1979,1987,{post:97,footwork:99,contactFinish:99,mid:96,fade:96},'Low-post wing leverage, pump fakes and patient contact scoring.'),
    n('Bernard King',1981,1984,{mid:98,footwork:98,fade:97,contested:98,shotCreation:97},'Rapid baseline turnaround and minimal-dribble scoring footwork.'),
    n('Alex English',1980,1988,{mid:97,contested:95,footwork:95,releaseHeight:88,shotArc:94},'High-release midrange wing scoring.'),
    n('Walter Davis',1977,1985,{mid:96,shotCreation:92,shotArc:95,footwork:92},'Smooth pull-up scorer and efficient wing touch.'),
    n('DeMar DeRozan',2015,2025,{mid:98,footwork:98,fade:97,contested:96,shotCreation:97,clutchShot:95},'Pump-fake, pivot and midrange counter specialist.',{three:73}),
    n('Brandon Roy',2006,2009,{shotCreation:97,footwork:95,contested:96,clutchShot:97,handle:95},'Controlled isolation scoring and late-game pace changes before knee decline.'),
    n('Gilbert Arenas',2003,2006,{shotCreation:96,handle:95,clutchShot:96,releaseSpeed:95},'Explosive pull-up creation and deep-shot confidence before knee injuries.'),
    n('Joe Johnson',2004,2013,{handle:93,footwork:95,contested:94,clutchShot:96,shotCreation:94},'Size-based isolation and patient late-clock counters.'),
    n('Michael Redd',2002,2007,{three:94,releaseSpeed:96,shotArc:96,contested:93},'Quick left-handed scoring release and off-screen shooting.'),
    n('Richard Hamilton',2001,2008,{mid:96,footwork:95,releaseSpeed:96,stam:97},'Relentless screen-running and balanced midrange catches.'),
    n('Allan Houston',1995,2002,{mid:95,three:92,shotArc:97,releaseSpeed:94},'High-touch wing jumper and controlled pull-up scoring.'),
    n('Latrell Sprewell',1993,2003,{burst:93,perD:88,lateral:89,shotCreation:89},'Explosive wing slashing and pressure defense.'),
    n('Jerry Stackhouse',1998,2002,{contactFinish:93,shotCreation:92,contested:90},'Volume wing creation and strong driving contact.'),
    n('Jamal Crawford',2003,2016,{handle:97,shotCreation:94,contested:95,agility:94},'Crossover counters and off-balance bench shot-making.',{perD:72}),
    n('Lou Williams',2014,2019,{handle:94,shotCreation:95,contested:93,floater:92},'Bench pick-and-roll creation and change-of-pace scoring.'),
    n('Jamal Murray',2018,2025,{mid:94,contested:96,clutchShot:96,shotCreation:94,footwork:94},'Two-man pull-up game and difficult playoff shot-making.'),
    n('Zach LaVine',2017,2025,{dunk:98,vert:99,burst:98,releaseSpeed:94,contested:92},'Elite leaping combined with quick pull-up shooting.',{perD:76}),
    n('Bradley Beal',2016,2022,{mid:94,shotCreation:95,releaseSpeed:93,footwork:93},'Off-screen scoring and mature pull-up creation.'),
    n('CJ McCollum',2015,2025,{handle:94,footwork:95,mid:95,shotCreation:95,floater:93},'Compact crossover into midrange pull-ups and floaters.'),
    n('Brandon Ingram',2019,2025,{releaseHeight:93,mid:94,contested:93,shotCreation:93},'Long wing pull-up geometry and midrange creation.'),
    n('Lauri Markkanen',2022,2025,{releaseHeight:96,shotArc:96,three:94,footwork:89},'Tall movement shooter and high-release perimeter finishing.'),
    n('Kristaps Porziņģis',2019,2025,{releaseHeight:99,shotArc:93,three:89,contestD:94,helpD:90},'Very high shooting point and long-frame rim contests.'),

    // Floor generals: reads, placement and handling, not a reward for high usage.
    n('Magic Johnson',1981,1990,{vision:100,passingAccuracy:100,iq:100,handle:97,transition:99,post:93,footwork:93},'Tall fast-break orchestration, pass disguise and post mismatches.'),
    n('John Stockton',1987,2002,{vision:99,passingAccuracy:100,iq:99,handle:94,screen:82,shotSelection:99},'Precise pick-and-roll placement and efficient low-waste decisions.'),
    n('Jason Kidd',1996,2007,{vision:100,passingAccuracy:98,iq:98,handle:96,transition:96,helpD:94,perD:92,boxout:83},'Transition passing and anticipatory guard defense/rebounding.'),
    n('Jason Kidd',2008,2012,{vision:97,passingAccuracy:96,iq:99,helpD:90},'Veteran orchestration and positional reads without prime footspeed.'),
    n('Chris Paul',2006,2017,{vision:99,passingAccuracy:100,handle:99,iq:99,mid:96,floater:98,footwork:97,perD:94,lateral:92},'Screen manipulation, precise pocket passes and controlled elbow pull-ups.'),
    n('Chris Paul',2018,2025,{vision:98,passingAccuracy:99,iq:99,mid:94,floater:95,footwork:95},'Veteran coverage reading and touch without preserving prime burst.'),
    n('Isiah Thomas',1982,1991,{handle:99,agility:98,vision:98,passingAccuracy:96,layup:95,shotCreation:95,clutchShot:97},'Low crossover, paint creation and pressure-game orchestration.'),
    n('Gary Payton',1993,2001,{perD:99,lateral:97,contestD:94,helpD:91,handle:96,vision:95,post:87},'Glove-era point-of-attack containment, anticipation and guard post leverage.'),
    n('Gary Payton',2002,2006,{helpD:87,iq:94},'Veteran positioning and team reads; does not restore peak lateral speed.'),
    n('Tony Parker',2002,2015,{floater:99,layup:97,agility:97,footwork:95,handle:96,accel:96},'Paint spins, teardrop touch and high-speed direction changes.'),
    n('Manu Ginóbili',2003,2013,{footwork:98,contactFinish:97,layup:98,vision:96,passingAccuracy:95,handle:95,helpD:92},'Eurostep angles, creative passing and anticipatory team defense.'),
    n('Rajon Rondo',2007,2013,{vision:99,passingAccuracy:97,handle:96,perD:92,helpD:93,iq:96},'Pass disguise, paint probing and anticipatory point defense.',{three:76}),
    n('Chauncey Billups',2002,2009,{iq:97,passingAccuracy:96,clutchShot:97,perD:90,contactFinish:92},'Controlled ball screens, strong guard containment and pressure shooting.'),
    n('Tim Hardaway',1989,1997,{handle:99,agility:98,vision:96,passingAccuracy:95,shotCreation:95},'UTEP two-step crossover and penetrating ball-screen reads.'),
    n('Anfernee Hardaway',1993,1996,{handle:97,vision:97,passingAccuracy:96,shotCreation:96,contactFinish:94},'Tall point-guard creation and passing before major knee decline.'),
    n('Kevin Johnson',1988,1996,{handle:97,accel:97,agility:97,vision:96,layup:95},'Explosive guard penetration and drive-and-kick creation.'),
    n('Rod Strickland',1989,1998,{handle:98,layup:97,vision:97,passingAccuracy:94,floater:97},'Paint probing, unusual finishing angles and drive-and-dish reads.'),
    n('Maurice Cheeks',1979,1988,{perD:95,lateral:92,helpD:92,passingAccuracy:93,iq:96},'Disciplined point defense and low-waste playmaking.'),
    n('Dennis Johnson',1978,1987,{perD:97,lateral:94,helpD:95,clutchShot:93},'Championship guard containment and defensive rotations.'),
    n('Terry Porter',1987,1993,{passingAccuracy:95,vision:94,three:89,clutchShot:94},'Controlled ball-screen orchestration and reliable perimeter touch.'),
    n('Sam Cassell',1997,2005,{mid:96,footwork:96,passingAccuracy:94,clutchShot:95,shotCreation:94},'Elbow pull-ups, guard post counters and pressure-game pacing.'),
    n('Andre Miller',1999,2012,{vision:96,passingAccuracy:94,post:88,footwork:93,iq:96},'Patient paint orchestration and guard post footwork.',{three:66}),
    n('Mike Conley',2012,2021,{passingAccuracy:96,vision:94,floater:95,perD:88,iq:96},'Precise ball-screen decisions, floater touch and disciplined point defense.'),
    n('Kyle Lowry',2013,2020,{helpD:94,perD:90,iq:97,passingAccuracy:94,contactFinish:91,screen:85},'Strong guard leverage, charges and connected team defense.'),
    n('José Calderón',2006,2013,{passingAccuracy:98,vision:94,shotArc:94,three:89,iq:96},'Low-turnover pass placement and efficient open-shot touch.'),
    n('Deron Williams',2006,2011,{handle:96,vision:97,passingAccuracy:96,contactFinish:94,shotCreation:93},'Strong change-of-direction ball-screen creator.'),
    n('Stephon Marbury',1998,2004,{handle:97,accel:95,vision:94,layup:94,contactFinish:91},'Explosive point penetration and drive passing.'),
    n('Steve Francis',1999,2003,{handle:97,burst:96,vert:97,agility:96,contactFinish:93},'Explosive guard crossover and aerial finishing.'),
    n('John Wall',2012,2016,{speed:99,accel:99,transition:99,vision:97,passingAccuracy:95,layup:95},'Peak transition speed and paint passing before major leg injuries.'),
    n('Derrick Rose',2008,2011,{burst:99,accel:100,agility:100,handle:97,layup:98,contactFinish:97,floater:95},'Pre-ACL explosive deceleration, paint angles and guard elevation.'),
    n('Derrick Rose',2014,2020,{floater:94,footwork:92,handle:92,layup:93},'Adapted finishing and handle; peak explosiveness is not inherited after ACL injury.'),
    n('Russell Westbrook',2010,2017,{burst:99,accel:99,transition:100,contactFinish:97,handle:96,vision:95,hustle:98},'Explosive transition attacks and relentless guard motor.',{three:78}),
    n('Trae Young',2019,2025,{vision:99,passingAccuracy:97,handle:97,floater:99,releaseSpeed:96,shotCreation:96},'Deep pull-up release, lob disguise and elite floater touch.',{perD:66,intD:53}),
    n('Tyrese Haliburton',2021,2025,{vision:99,passingAccuracy:99,iq:97,releaseSpeed:94},'Early-read pass placement and unusual but quick functional shooting release.'),
    n('Jalen Brunson',2022,2025,{footwork:99,handle:97,contactFinish:96,floater:98,shotCreation:97,mid:95,clutchShot:96},'Paint pivots, deceleration and balance on a short frame.'),
    n('Ja Morant',2019,2025,{burst:99,accel:99,agility:98,layup:98,floater:96,handle:96,vision:94},'Exceptional elevation, paint angles and explosive guard creation.'),
    n("De'Aaron Fox",2018,2025,{speed:99,accel:99,burst:97,handle:95,layup:95,clutchShot:95,mid:92},'Fast paint attacks, change of pace and developed late-game pull-ups.'),
    n('Darius Garland',2021,2025,{handle:96,vision:95,passingAccuracy:94,floater:95,releaseSpeed:95},'Compact ball-screen handling and pull-up/floater touch.'),
    n('LaMelo Ball',2021,2025,{vision:98,passingAccuracy:94,handle:95,shotCreation:92},'Tall creative transition and live-dribble passing.'),
    n('Cade Cunningham',2023,2025,{vision:96,passingAccuracy:94,handle:94,footwork:93,mid:93},'Tall patient ball-screen creator and paint reads.'),
    n('Tyrese Maxey',2022,2025,{speed:97,accel:98,burst:96,layup:95,releaseSpeed:95,handle:94},'Fast downhill attacks and rapidly developed pull-up release.'),
    n('Isaiah Thomas',2014,2016,{handle:97,shotCreation:98,contactFinish:95,floater:96,clutchShot:97},'Peak small-guard scoring leverage before hip injury.'),
    n('Goran Dragić',2012,2017,{layup:94,contactFinish:92,passingAccuracy:92,footwork:93},'Left-handed paint attacks and ball-screen finishing.'),
    n('Ricky Rubio',2011,2020,{vision:98,passingAccuracy:94,perD:90,helpD:91},'Creative passing and point-defense anticipation.',{three:80}),

    // Post and interior specialists: technique is distinct from jump shooting.
    n('Hakeem Olajuwon',1984,1989,{post:91,footwork:95,intD:97,helpD:95,contestD:97},'Early rim defense and developed post agility before the championship-era counters.'),
    n('Hakeem Olajuwon',1990,1996,{post:99,footwork:100,fade:97,mid:88,contested:95,helpD:99,intD:99,contestD:99,lateral:91},'Dream Shake: pivots, up-and-under counters, face-up touch and rotating rim defense.'),
    n('Hakeem Olajuwon',1997,1999,{post:94,footwork:97,fade:91,helpD:94},'Veteran post technique and reads without peak recovery speed.'),
    n('Kareem Abdul-Jabbar',1969,1985,{close:100,post:100,footwork:98,floater:98,contactFinish:96,shotArc:90},'Skyhook touch and post pivots, not invented perimeter range.'),
    n('Kareem Abdul-Jabbar',1986,1988,{close:95,post:96,footwork:96,floater:94},'Late-career skyhook craft without restoring peak defense or stamina.'),
    n("Shaquille O'Neal",1993,2002,{str:100,post:99,close:99,contactFinish:100,footwork:94,screen:98},'Deep seals, power drop steps and contact leverage; poor free throws remain.'),
    n("Shaquille O'Neal",2003,2005,{str:99,post:97,close:97,contactFinish:98,screen:97},'Later interior power without Orlando/Lakers mobility.'),
    n('Tim Duncan',1998,2006,{post:98,footwork:99,close:97,mid:88,fade:94,helpD:99,contestD:98,intD:99,iq:99},'Bank-shot touch, controlled post counters and disciplined rim positioning.'),
    n('Tim Duncan',2007,2014,{post:94,footwork:97,helpD:98,contestD:96,intD:97,iq:99},'Veteran defensive positioning and post timing; mobility remains season-derived.'),
    n('Kevin McHale',1983,1991,{post:99,footwork:100,close:98,fade:96,contactFinish:97,intD:92,helpD:91},'Exceptional post pivots, up-and-under counters and long-reach interior finishing.'),
    n('Moses Malone',1978,1988,{oreb:100,boxout:100,post:96,contactFinish:97,close:97,hustle:97},'Relentless second-chance positioning, deep seals and repeat-effort finishing.'),
    n('Karl Malone',1986,1998,{str:98,screen:99,post:97,mid:94,footwork:96,contactFinish:98,transition:92},'Pick-and-roll leverage, sprinting seals and developed face-up touch.'),
    n('Charles Barkley',1985,1995,{contactFinish:100,post:97,footwork:96,str:99,oreb:97,boxout:97,transition:96},'Low-center leverage, explosive second jumps and transition power on a short big frame.'),
    n('Patrick Ewing',1987,1996,{mid:88,post:95,footwork:93,helpD:97,intD:98,contestD:97},'Face-up jumper and anchored rim defense.'),
    n('David Robinson',1989,1997,{intD:99,helpD:98,contestD:99,transition:96,contactFinish:97,footwork:92},'Explosive rim protection, sprinting center finishes and face-up attacks.'),
    n('Alonzo Mourning',1994,1999,{intD:99,helpD:97,contestD:99,contactFinish:96,str:97},'Power rim defense and vertical shot contests.'),
    n('Dwight Howard',2006,2011,{intD:99,helpD:97,contestD:99,screen:97,contactFinish:98,boxout:97,burst:98},'Peak roll gravity, vertical rim defense and strong rebounding position.',{mid:65,post:87}),
    n('Yao Ming',2003,2008,{post:98,footwork:97,mid:88,releaseHeight:100,shotArc:93,close:98,contestD:95},'Very high release, soft center touch and deliberate post pivots.'),
    n('Pau Gasol',2004,2014,{post:96,footwork:98,close:95,passingAccuracy:94,vision:92,mid:88,shotArc:92},'Skilled post counters, touch and high-low passing.'),
    n('Marc Gasol',2011,2018,{helpD:98,intD:96,iq:98,passingAccuracy:94,vision:94,screen:95,footwork:92},'Coverage positioning, elbow orchestration and defensive communication.'),
    n('Arvydas Sabonis',1995,2001,{vision:98,passingAccuracy:97,iq:98,post:94,footwork:94,screen:95,shotArc:91},'NBA-era post passing and touch; does not import younger overseas athleticism.'),
    n('Chris Webber',1996,2003,{vision:96,passingAccuracy:95,post:94,footwork:94,contactFinish:94,mid:89},'High-post passing, elbow scoring and mobile interior creation.'),
    n('Rasheed Wallace',1998,2007,{post:94,footwork:94,releaseHeight:93,helpD:95,intD:94,contestD:94,shotArc:91},'High-release post jumper and disciplined championship team defense.'),
    n('Chris Bosh',2005,2014,{mid:93,footwork:94,helpD:93,contestD:92,releaseHeight:92},'Face-up scoring and mobile help defense in changing team roles.'),
    n("Amar'e Stoudemire",2003,2010,{dunk:98,burst:98,contactFinish:98,mid:89,footwork:91,transition:94},'Explosive rolling finishes and developed face-up touch.'),
    n('Blake Griffin',2010,2014,{dunk:99,burst:99,contactFinish:99,transition:95,footwork:90},'Explosive roll finishing and contact power before later role changes.'),
    n('Blake Griffin',2017,2018,{passingAccuracy:92,vision:91,handle:87,footwork:93},'Detroit-era point-forward adaptation rather than restoring peak leaping.'),
    n('Zion Williamson',2019,2025,{contactFinish:100,layup:99,burst:99,str:99,footwork:93},'Exceptional short-big power, balance and explosive paint angles.'),
    n('Giannis Antetokounmpo',2016,2025,{contactFinish:99,layup:98,transition:100,helpD:97,contestD:95,footwork:95,burst:98},'Long-stride rim pressure, transition power and weak-side defensive coverage.'),
    n('Anthony Davis',2013,2025,{helpD:99,intD:98,contestD:99,contactFinish:97,footwork:94,floater:92},'Mobile rim contests, lob finishing and short-roll touch.'),
    n('Nikola Jokić',2018,2025,{vision:100,passingAccuracy:100,iq:100,post:99,footwork:99,floater:100,shotArc:98,contactFinish:96,screen:95},'Disguised live-dribble passing, post balance and exceptional soft touch.',{perD:79,burst:78}),
    n('Joel Embiid',2018,2025,{post:98,mid:97,footwork:97,fade:96,contested:97,contactFinish:98,intD:96,contestD:97},'Face-up foul pressure, post counters and high-release center scoring.'),
    n('Karl-Anthony Towns',2016,2025,{three:93,shotArc:97,releaseHeight:95,releaseSpeed:89,post:90,footwork:91},'Exceptional shooting touch for a center, distinct from guard release speed.',{helpD:87}),
    n('Domantas Sabonis',2019,2025,{post:94,footwork:95,vision:96,passingAccuracy:95,screen:98,boxout:98},'Handoff orchestration, leverage and strong positional rebounding.'),
    n('Alperen Şengün',2023,2025,{post:96,footwork:98,vision:94,passingAccuracy:94,floater:96},'Young center post pivots, soft touch and creative high-low passing.'),
    n('DeMarcus Cousins',2013,2016,{post:96,footwork:94,contactFinish:98,vision:91,passingAccuracy:90,str:98},'Prime power post creation and unusual center passing before Achilles injury.'),
    n('Elton Brand',1999,2005,{post:95,footwork:94,mid:91,contactFinish:96,helpD:92,boxout:94},'Strong low-post leverage, face-up touch and long-arm help contests.'),
    n('LaMarcus Aldridge',2009,2018,{mid:96,fade:96,post:95,footwork:94,releaseHeight:94,contested:93},'High-release turnaround and face-up midrange specialist.'),
    n('Zach Randolph',2005,2014,{post:98,footwork:97,contactFinish:97,str:98,oreb:95,boxout:97},'Low-post craft and second-chance leverage without elite jumping.'),
    n('Al Jefferson',2006,2014,{post:98,footwork:98,close:97,fade:93,contactFinish:95},'Patient low-post pivots, ball fakes and soft interior touch.'),
    n('Carlos Boozer',2003,2010,{post:93,footwork:93,mid:91,contactFinish:94,boxout:94},'Strong pick-and-roll finishes and face-up midrange touch.'),
    n('David West',2005,2013,{mid:94,post:92,footwork:93,str:95,screen:96},'Elbow shooting and sturdy two-man-game leverage.'),
    n('Luis Scola',2007,2012,{post:94,footwork:97,mid:88,floater:92},'Under-the-rim pivots, fakes and international post craft.'),
    n('Boris Diaw',2005,2015,{vision:94,passingAccuracy:95,iq:97,footwork:94,post:89},'Connective big-man passing and mismatch footwork.'),
    n('Nikola Vučević',2014,2025,{post:92,footwork:92,mid:88,passingAccuracy:88,boxout:94},'Interior touch, rebound positioning and elbow connections.'),
    n('Brook Lopez',2017,2025,{contestD:96,helpD:94,intD:94,releaseHeight:95,screen:94},'Late-career drop rim defense and stretch-center role; not young post usage.'),
    n('Brook Lopez',2009,2016,{post:95,footwork:93,close:94},'Earlier Brooklyn low-post scoring role.'),
    n('Al Horford',2009,2025,{helpD:95,iq:97,passingAccuracy:93,screen:94,footwork:92},'Coverage reading and low-waste high-post connections, across changing athletic roles.'),

    // Defensive/rebounding specialists whose value was hidden by scoring averages.
    n('Bill Russell',1956,1968,{intD:100,helpD:100,contestD:100,boxout:99,iq:100,hustle:99,passingAccuracy:88,vision:89},'Anticipatory rim defense, outlet reads and positional rebounding; no invented perimeter shooting.'),
    n('Dennis Rodman',1988,1997,{oreb:100,dreb:100,boxout:100,hustle:100,helpD:95,screen:94},'Elite ball-flight reading, low-center box-outs and repeat rebounding effort.'),
    n('Dennis Rodman',1988,1992,{perD:98,lateral:95,contestD:94,intD:93},'Detroit-era versatile forward containment, distinct from later specialist usage.'),
    n('Dennis Rodman',1993,1997,{perD:92,intD:92,contestD:92},'Spurs/Bulls positional defense and rebounding rather than restored younger lateral peak.'),
    n('Ben Wallace',1999,2005,{intD:100,helpD:99,contestD:99,str:97,boxout:99,hustle:99,lateral:86,screen:96},'Low-center switch recovery, explosive rim contests and positional rebounding.',{mid:55,three:35}),
    n('Dikembe Mutombo',1991,2001,{intD:99,helpD:98,contestD:99,boxout:97,screen:93},'Long-reach rim deterrence and defensive rebounding position.'),
    n('Nate Thurmond',1963,1973,{intD:99,helpD:97,contestD:98,str:96,boxout:99},'Strong man-to-man center defense and positional rebounding.'),
    n('Wes Unseld',1968,1977,{str:99,screen:100,boxout:100,vision:91,passingAccuracy:94,iq:97},'Low-center seals, crushing screens and accurate early outlet passes.'),
    n('Dave Cowens',1970,1977,{hustle:99,boxout:98,helpD:94,lateral:85,passingAccuracy:88,screen:94},'Active mobile center defense and relentless positional effort.'),
    n('Bill Walton',1975,1977,{helpD:99,intD:99,contestD:98,vision:97,passingAccuracy:97,screen:95,iq:98},'Healthy Portland peak: rim coverage and high-post passing; durability remains poor.'),
    n('Bobby Jones',1976,1984,{perD:96,helpD:99,contestD:96,lateral:93,hustle:98,iq:96},'Versatile rotations, transition defense and disciplined help.'),
    n('Sidney Moncrief',1981,1985,{perD:99,lateral:97,contestD:95,helpD:94,hustle:97},'Two-time defensive guard peak with disciplined on-ball containment.'),
    n('Michael Cooper',1980,1988,{perD:98,lateral:95,helpD:96,contestD:95},'Showtime-era wing containment and recovery length.'),
    n('Scottie Pippen',1990,1997,{perD:100,lateral:98,helpD:100,contestD:98,vision:95,passingAccuracy:94,transition:96},'Long-wing pressure, help rotations and transition point-forward reads.'),
    n('Scottie Pippen',1998,2001,{helpD:95,iq:96,passingAccuracy:92},'Veteran team defense and orchestration without Chicago-era recovery speed.'),
    n('Kawhi Leonard',2013,2016,{perD:100,lateral:97,contestD:98,helpD:97,steal:98},'Peak hand disruption, wing containment and defensive recovery.'),
    n('Kawhi Leonard',2018,2025,{mid:97,footwork:97,contested:97,shotCreation:96,contactFinish:95},'Mature power-wing shooting counters; knee-limited defense remains season-derived.'),
    n('Kevin Garnett',1998,2007,{helpD:100,intD:98,contestD:99,lateral:92,mid:96,footwork:97,vision:94,screen:97,iq:99},'Mobile coverage captain with face-up touch and high-post passing.'),
    n('Kevin Garnett',2008,2012,{helpD:99,intD:97,contestD:97,screen:96,iq:99},'Boston-era positioning and defensive communication without restoring Minnesota athleticism.'),
    n('Draymond Green',2014,2021,{helpD:100,iq:99,perD:95,intD:97,contestD:96,vision:97,passingAccuracy:95,screen:98},'Switch communication, rim help and short-roll passing.',{three:82}),
    n('Draymond Green',2022,2025,{helpD:97,iq:98,vision:94,passingAccuracy:94,screen:96},'Veteran defensive organization and handoff reads.'),
    n('Rudy Gobert',2014,2024,{intD:99,helpD:97,contestD:100,boxout:98,screen:98},'Long-reach drop deterrence and roll-screen leverage.',{post:81,mid:61}),
    n('Bam Adebayo',2018,2025,{perD:94,lateral:91,intD:95,helpD:98,contestD:95,screen:97,passingAccuracy:92,footwork:92},'Switchable center containment and short-roll/handoff timing.'),
    n('Evan Mobley',2022,2025,{helpD:98,contestD:97,intD:96,perD:87,lateral:86},'Young long-frame recovery defender and versatile rim help.'),
    n('Victor Wembanyama',2023,2025,{contestD:100,helpD:98,intD:99,releaseHeight:100},'Extraordinary standing reach and recovery contests; perimeter touch remains season-derived.'),
    n('Shawn Marion',2001,2008,{helpD:97,perD:94,lateral:93,contestD:93,transition:97,hustle:98,boxout:89},'Long-wing rotations, transition finishing and active rebounding.'),
    n('Andrei Kirilenko',2001,2010,{helpD:99,contestD:98,perD:94,lateral:92,hustle:97,vision:89},'Help-side disruption, passing lanes and unusual wing rim protection.'),
    n('Metta World Peace',2001,2009,{perD:99,lateral:94,contestD:96,str:96,helpD:95},'Ron Artest-era strong on-ball wing pressure and physical containment.'),
    n('Metta World Peace',2010,2012,{perD:93,helpD:92,contestD:92,str:95},'Veteran wing leverage and positional defense under his later name.'),
    n('Bruce Bowen',2001,2007,{perD:98,lateral:94,contestD:96,helpD:93},'Disciplined perimeter containment and denial without creating a scorer.'),
    n('Shane Battier',2001,2013,{helpD:98,contestD:97,perD:92,iq:98},'Scouting-led rotations, positional contests and disciplined team defense.'),
    n('Tony Allen',2009,2015,{perD:99,lateral:96,contestD:96,helpD:95,hustle:97},'First-team pressure defense and wing disruption.',{three:63}),
    n('Jrue Holiday',2012,2025,{perD:99,lateral:95,helpD:96,contestD:95,str:88,passingAccuracy:94},'Strong guard containment, screen navigation and composed secondary creation.'),
    n('Marcus Smart',2015,2022,{perD:97,helpD:97,contestD:94,hustle:98,str:90,screen:86},'Switch communication, low-center leverage and repeated defensive effort.'),
    n('Alex Caruso',2019,2025,{perD:98,helpD:98,lateral:94,contestD:95,hustle:98,iq:95},'Screen navigation, anticipatory help and guard disruption.'),
    n('Derrick White',2020,2025,{perD:94,helpD:98,contestD:95,iq:96,passingAccuracy:90},'Rotations, guard rim contests and low-waste connective decisions.'),
    n('Mikal Bridges',2019,2022,{perD:97,lateral:95,helpD:94,contestD:95},'Phoenix-era wing denial and recovery; later scoring roles do not inherit this peak automatically.'),
    n('OG Anunoby',2019,2025,{perD:98,lateral:93,helpD:96,contestD:96,str:93},'Strong multi-position wing containment and rotating help.'),
    n('Herbert Jones',2021,2025,{perD:97,helpD:97,contestD:96,lateral:94,hustle:96},'Long-wing rotations, screen recovery and point-of-attack disruption.'),
    n('Jaden McDaniels',2022,2025,{perD:96,contestD:96,lateral:94,helpD:93},'Long-limbed perimeter recovery and difficult-shot contests.'),
    n('Luguentz Dort',2020,2025,{perD:98,lateral:96,str:93,contestD:95,hustle:96},'Strong screen-navigation and point-of-attack containment.'),
    n('Chet Holmgren',2023,2025,{helpD:97,contestD:98,intD:95,releaseHeight:98},'Long-frame vertical contests and weak-side recovery.'),
    n('Jaren Jackson Jr.',2020,2025,{helpD:98,contestD:98,intD:97,lateral:84},'Mobile weak-side shot deterrence and recovery; foul history stays in tendencies.'),
    n('Myles Turner',2015,2025,{contestD:97,helpD:95,intD:94,releaseHeight:93},'Drop rim contests and stretch-center shooting geometry.'),
    n('Robert Williams',2019,2022,{helpD:98,contestD:99,intD:96,burst:93},'Healthy roaming rim-defense peak; injury availability is unchanged.'),
    n('Joakim Noah',2009,2013,{helpD:99,intD:97,hustle:100,screen:96,vision:94,passingAccuracy:93,iq:97},'High-motor coverage communication and elbow passing.'),
    n('Tyson Chandler',2006,2013,{helpD:97,intD:96,contestD:98,screen:98,boxout:96,contactFinish:94},'Roll screens, vertical contests and positional defense.'),
    n('Marcus Camby',1999,2009,{helpD:96,contestD:98,intD:94,boxout:94},'Weak-side shot blocking and rebound positioning.'),
    n('DeAndre Jordan',2012,2016,{dunk:98,contactFinish:97,screen:97,contestD:96,boxout:98},'Peak lob finishing and positional rebounding without low-post craft.',{post:77}),
    n('Clint Capela',2016,2021,{screen:97,contactFinish:95,contestD:95,helpD:93,boxout:97},'Roll timing, vertical rim contests and second-chance position.'),
    n('Steven Adams',2014,2025,{str:99,screen:100,boxout:99,oreb:97,hustle:95},'Exceptional screens, low-center seals and offensive rebound position.'),
    n('Andrew Bogut',2010,2015,{helpD:98,contestD:96,intD:95,screen:99,passingAccuracy:93,iq:96},'Defensive positioning, hard screens and accurate high-post connections.'),
    n('Anderson Varejão',2006,2012,{hustle:99,screen:96,helpD:93,boxout:95},'Repeat effort, charges and positional rebounding.'),
    n('Serge Ibaka',2010,2015,{contestD:98,helpD:95,intD:95,mid:86},'Weak-side rim recovery and developed face-up touch.'),
    n('Horace Grant',1989,1995,{helpD:96,intD:92,screen:95,boxout:95,mid:86,iq:94},'Low-usage defensive rotations, screens and positional boards.'),
    n('Larry Nance',1984,1992,{contestD:96,helpD:94,burst:95,dunk:95,contactFinish:93},'Mobile power-forward rim recovery and aerial finishing.'),
    n('Charles Oakley',1986,1998,{str:98,screen:99,boxout:98,hustle:96},'Strong screen setting and low-center rebound leverage.'),
    n('Anthony Mason',1993,2000,{str:98,perD:90,post:90,passingAccuracy:91,screen:97},'Strong switching forward with point-forward/post leverage.'),
    n('P.J. Brown',1993,2004,{helpD:94,intD:91,boxout:94,screen:94},'Disciplined rotation big and positional defender.'),
    n('Kurt Thomas',1998,2007,{str:94,screen:96,boxout:95,helpD:93,mid:85},'Strong interior positioning and reliable elbow touch.'),
    n('Paul Silas',1967,1976,{boxout:98,oreb:97,hustle:97,helpD:93,str:95},'Physical rebound position and low-usage defensive work.'),
    n('Mark Eaton',1983,1988,{intD:99,contestD:100,helpD:97,str:96},'Exceptional standing-reach rim deterrence without mobility or scoring inflation.'),
    n('Tree Rollins',1978,1986,{intD:96,contestD:98,helpD:95},'Specialist long-reach rim defense.'),
    n('Manute Bol',1985,1990,{contestD:100,intD:96,helpD:94},'Extreme reach and shot blocking; strength and offense remain limited.'),
    n('Mookie Blaylock',1992,1998,{perD:97,lateral:95,helpD:94,iq:94},'Point pressure and anticipatory passing-lane defense.'),
    n('Alvin Robertson',1985,1991,{perD:98,lateral:97,helpD:94,hustle:97},'Exceptional guard disruption and recovery defense.'),
    n('Fat Lever',1985,1989,{perD:92,helpD:93,boxout:87,vision:92,hustle:95},'Anticipatory guard defense, rebounding and connective playmaking.'),
    n('Doug Christie',1996,2003,{perD:96,lateral:94,helpD:95,passingAccuracy:89},'Wing denial and team defense within a motion offense.'),
    n('Eddie Jones',1995,2002,{perD:95,lateral:94,helpD:94,releaseSpeed:92},'Long guard disruption and quick perimeter shooting.'),
    n('Dan Majerle',1989,1996,{perD:93,contestD:92,hustle:96,three:90},'Physical wing defense and long-range spacing.'),
    n('Tayshaun Prince',2003,2008,{perD:95,contestD:96,helpD:94,lateral:89},'Long-wing recovery and disciplined title-team rotations.'),
    n('Gerald Wallace',2004,2010,{hustle:99,helpD:96,contestD:94,contactFinish:94,burst:94},'Relentless wing help, rebounding and contact attacks.'),
    n('Andre Iguodala',2007,2016,{perD:97,helpD:97,contestD:94,vision:94,passingAccuracy:94,iq:97},'Versatile wing containment and intelligent passing connections.'),
    n('Luc Mbah a Moute',2008,2017,{perD:95,helpD:94,lateral:91,contestD:93},'Versatile low-usage forward containment.'),
    n('Thabo Sefolosha',2008,2015,{perD:95,helpD:94,lateral:92,contestD:93},'Long guard pressure and positional help.'),
    n('Trevor Ariza',2008,2017,{perD:92,helpD:93,contestD:92,lateral:90},'Wing recovery, passing lanes and low-usage perimeter defense.'),
    n('Patrick Beverley',2013,2020,{perD:95,lateral:93,hustle:98,helpD:90},'Aggressive screen-navigation and point pressure.'),
    n('P.J. Tucker',2015,2021,{str:96,perD:92,helpD:94,boxout:90,screen:92},'Strong small-ball switching and positional rebounding.'),
    n('Shane Battier',2011,2013,{screen:84},'Late Miami small-ball screening supplements his existing defense note.'),

    // Early-era specialties, judged without pretending the NBA had a three-point line.
    n('George Mikan',1948,1953,{post:99,close:99,footwork:96,contactFinish:97,boxout:98,intD:97},'Foundational pivot/hook scoring and dominant interior position.'),
    n('Bob Pettit',1955,1963,{mid:94,post:94,contactFinish:95,oreb:98,boxout:98,hustle:97},'Face-up power scoring and relentless second chances.'),
    n('Dolph Schayes',1952,1961,{mid:94,shotArc:96,releaseHeight:90,post:91,boxout:95},'Early high-arc big-man shooting and strong rebound positioning.'),
    n('Paul Arizin',1950,1961,{mid:98,releaseSpeed:94,shotArc:96,contested:95},'Early elevated jump-shot specialist; no fabricated NBA threes.'),
    n('Bob Cousy',1952,1961,{handle:98,vision:100,passingAccuracy:96,agility:95},'Creative dribble and fast-break passing relative to his era.'),
    n('Bill Sharman',1953,1960,{mid:96,shotArc:98,releaseSpeed:94,footwork:90},'Elite prepared shooting and touch in the pre-line NBA.'),
    n('Neil Johnston',1952,1957,{post:96,close:98,floater:96,footwork:93},'Productive sweeping-hook and pivot scoring.'),
    n('Elgin Baylor',1959,1968,{layup:99,contactFinish:98,contested:98,footwork:96,mid:95,shotCreation:97},'Aerial wing creativity, hang-time finishes and difficult-shot counters.'),
    n('Oscar Robertson',1960,1970,{handle:98,vision:100,passingAccuracy:99,iq:99,post:94,mid:97,footwork:97,contactFinish:97},'Strong guard leverage, complete orchestration and deliberate midrange creation.'),
    n('Jerry West',1961,1972,{mid:99,releaseSpeed:98,shotArc:98,clutchShot:100,shotCreation:98,perD:95,passingAccuracy:96},'Quick pull-up release, late-game shot-making and active guard defense.'),
    n('Sam Jones',1959,1967,{mid:98,shotArc:97,releaseSpeed:95,clutchShot:97,footwork:94},'Bank-shot touch and prepared championship wing shooting.'),
    n('John Havlicek',1965,1975,{hustle:100,stam:99,perD:97,helpD:97,mid:94,footwork:94},'Relentless off-ball movement and versatile wing containment.'),
    n('Wilt Chamberlain',1959,1965,{str:100,close:100,post:99,contactFinish:100,oreb:100,boxout:100,contestD:99},'Extreme interior scoring leverage, elevation and second-chance dominance.'),
    n('Wilt Chamberlain',1966,1972,{str:100,close:98,post:97,boxout:100,helpD:99,contestD:99,vision:90,passingAccuracy:91},'Later defensive/rebounding and passing role, distinct from early scoring volume.'),
    n('Jerry Lucas',1963,1971,{boxout:100,dreb:99,mid:94,shotArc:95,vision:88},'Elite rebound reading and unusually skilled long-two touch.'),
    n('Walt Frazier',1968,1975,{perD:99,lateral:97,helpD:96,handle:96,mid:94,footwork:95,clutchShot:96},'Disciplined point containment and controlled pull-up orchestration.'),
    n('Rick Barry',1965,1976,{mid:97,shotArc:97,contested:95,vision:94,passingAccuracy:94,footwork:94},'Wing scoring touch, creative passing and deliberate shot preparation.'),
    n('Willis Reed',1966,1970,{mid:90,post:95,contactFinish:96,intD:96,helpD:94,boxout:97,str:97},'Strong pivot defense, face-up touch and physical interior leverage.'),
    n('Walt Bellamy',1961,1965,{close:97,post:94,contactFinish:96,boxout:97},'Young center interior scoring and rebound position.'),
    n('Dave Bing',1966,1973,{handle:96,mid:96,shotCreation:95,vision:94,releaseSpeed:94},'Explosive guard creation and pre-line pull-up shooting.'),
    n('Tiny Archibald',1970,1975,{handle:99,accel:99,agility:99,vision:98,layup:97,floater:96},'Peak small-guard speed, paint passing and scoring angles.'),
    n('Bob McAdoo',1972,1977,{mid:98,releaseHeight:94,shotArc:97,contested:96,footwork:94},'High-release face-up center shooting and scoring mobility.'),
    n('Elvin Hayes',1968,1978,{fade:98,post:96,footwork:96,mid:90,contestD:93,boxout:98},'Signature turnaround jumper and strong interior positioning.'),
    n('Artis Gilmore',1976,1983,{str:99,close:99,contactFinish:98,intD:97,contestD:98,boxout:99},'Long-reach power finishing and defensive rebound leverage.'),
    n('Dan Issel',1976,1983,{mid:94,post:95,footwork:94,shotArc:94,contactFinish:94},'High-output center touch and face-up scoring craft.'),
    n('Bob Lanier',1970,1977,{post:98,close:98,footwork:96,mid:91,contactFinish:97,passingAccuracy:86},'Left-handed hook touch and skilled big-man post counters.'),
    n('Robert Parish',1979,1988,{post:92,close:95,helpD:95,intD:96,contestD:95,screen:94},'High-release interior touch and disciplined center positioning.'),
    n('Jack Sikma',1979,1989,{footwork:97,post:92,mid:94,shotArc:96,screen:93,boxout:97},'Reverse-pivot high-release jumper and rebound position.'),
    n('Spencer Haywood',1971,1975,{post:94,mid:92,contactFinish:95,footwork:93},'Mobile power-forward scoring and face-up touch.'),
    n('Billy Cunningham',1967,1975,{hustle:96,contactFinish:94,boxout:92,vision:90},'Active forward finishing, rebounding and connective playmaking.'),
    n('Chet Walker',1966,1974,{mid:94,post:93,footwork:95,contested:94},'Patient scoring footwork and wing post leverage.'),
    n('Paul Westphal',1975,1979,{mid:95,shotCreation:95,handle:95,footwork:94},'Creative guard scoring and controlled pull-up counters.'),
    n('Gus Williams',1977,1984,{speed:97,accel:97,transition:97,handle:94,layup:94},'Fast transition point attacks and driving creation.'),
    n('Marques Johnson',1977,1984,{post:95,footwork:96,contactFinish:95,shotCreation:93},'Point-forward mismatch creation and strong wing post craft.'),

    // More distinct role players and modern two-way/situational strengths.
    n('Grant Hill',1994,1999,{handle:96,vision:97,passingAccuracy:96,contactFinish:95,transition:98,agility:95},'Healthy Detroit point-forward orchestration before ankle injuries.'),
    n('Clyde Drexler',1986,1994,{transition:99,contactFinish:97,layup:97,vision:94,burst:97},'Gliding open-floor wing finishing and drive passing.'),
    n('Jimmy Butler',2013,2023,{contactFinish:97,footwork:97,clutchShot:97,perD:95,helpD:95,iq:97},'Strong paint counters, pressure creation and anticipatory wing defense.'),
    n('Paul George',2012,2018,{perD:97,lateral:95,contestD:96,helpD:96,handle:91,shotCreation:93},'Prime wing recovery defense and pull-up scoring.'),
    n('Pascal Siakam',2018,2025,{footwork:95,contactFinish:94,transition:95,helpD:91,vision:88},'Spin counters, open-floor attacks and connective forward reads.'),
    n('Kevin Love',2009,2015,{boxout:99,oreb:97,vision:91,passingAccuracy:94,shotArc:94},'Rebound positioning and early outlet placement, with season-derived shooting.'),
    n('Shawn Kemp',1989,1996,{burst:99,dunk:99,contactFinish:98,transition:96,contestD:92},'Explosive power-forward rolls and transition elevation.'),
    n('Detlef Schrempf',1991,1997,{vision:92,passingAccuracy:93,three:90,shotArc:94,footwork:91},'Tall shooting/playmaking connector.'),
    n('Toni Kukoč',1994,1999,{vision:96,passingAccuracy:94,handle:87,shotArc:91,footwork:93},'Tall creative passing and bench mismatch orchestration.'),
    n('Lamar Odom',2003,2010,{vision:94,passingAccuracy:93,handle:90,helpD:90,transition:92},'Tall secondary handling, passing and switchable forward reads.'),
    n('Hedo Türkoğlu',2006,2009,{vision:94,passingAccuracy:92,handle:88,shotCreation:90,releaseHeight:91},'Orlando-era tall ball-screen orchestration.'),
    n('Rashard Lewis',2001,2009,{three:92,releaseHeight:94,shotArc:94},'Tall floor-spacing wing/big shooter.'),
    n('Antawn Jamison',2000,2009,{floater:95,close:93,footwork:92,oreb:87},'Unusual quick-release interior touch and second-chance angles.'),
    n('David Lee',2007,2013,{contactFinish:93,boxout:95,screen:93,passingAccuracy:88},'Ambidextrous interior finishing and rebound position.'),
    n('Paul Millsap',2012,2016,{helpD:96,iq:95,post:92,footwork:93,boxout:93},'Strong positional defense and connective post skill.'),
    n('Josh Smith',2006,2012,{helpD:95,contestD:96,transition:95,burst:94,passingAccuracy:87},'Weak-side recovery and transition-forward passing.',{three:73}),
    n('J.J. Barea',2010,2015,{handle:94,agility:94,floater:94,vision:90},'Small-guard ball-screen changes of pace and paint touch.'),
    n('J.J. Barea',2016,2018,{vision:92,passingAccuracy:92,floater:92},'Veteran bench orchestration and floater touch.'),
    n('J.J. Hickson',2009,2013,{contactFinish:91,oreb:91,boxout:90},'Active interior finishing and second-chance positioning.'),
    n('J.R. Smith',2008,2016,{three:91,releaseSpeed:94,contested:94,dunk:93},'Quick difficult-shot wing release and athletic finishing.'),
    n('Jason Terry',2001,2010,{three:91,releaseSpeed:95,clutchShot:94,floater:90},'Quick bench pull-ups and pressure-game shooting.'),
    n('Leandro Barbosa',2004,2008,{speed:98,accel:98,transition:96,layup:92},'Peak bench transition speed and downhill finishing.'),
    n('Nate Robinson',2007,2012,{vert:99,burst:98,handle:92,agility:95},'Extreme guard elevation and explosive bench creation.'),
    n('Spud Webb',1985,1991,{vert:100,burst:97,agility:94,accel:96},'Exceptional elevation on a very short frame; body-dependent dunk constraints remain.'),
    n('Muggsy Bogues',1989,1995,{handle:96,vision:95,passingAccuracy:95,agility:97},'Very low dribble control and precise passing, without invented reach.'),
    n('Darrell Armstrong',1997,2000,{hustle:98,perD:91,accel:94,helpD:90},'Active point pressure and bench-to-starter motor.'),
    n('Terrell Brandon',1993,1999,{handle:95,mid:93,passingAccuracy:95,floater:94},'Controlled small-guard pull-ups and ball-screen placement.'),
    n('Derek Harper',1986,1994,{perD:94,lateral:92,passingAccuracy:92,iq:94},'Strong point defense and composed secondary orchestration.'),
    n('Hersey Hawkins',1989,1996,{three:91,releaseSpeed:93,shotArc:94,perD:88},'Prepared perimeter shooting and disciplined guard defense.'),
    n('Jeff Hornacek',1989,1998,{shotArc:97,mid:94,three:92,passingAccuracy:91,iq:96},'Touch, off-ball timing and low-waste connective passing.'),
    n('Byron Scott',1985,1992,{mid:91,three:89,releaseSpeed:93,transition:92},'Showtime transition wing finishing and prepared perimeter shooting.'),
    n('Derek Fisher',1999,2009,{iq:92,clutchShot:92,helpD:88,screen:80},'Veteran guard positioning and prepared pressure shots, without star creation.'),
    n('Robert Horry',1994,2006,{helpD:93,clutchShot:96,iq:94,contestD:89},'Rotational help and ready-to-catch late-game shooting.'),
    n('Mario Elie',1993,1998,{perD:90,helpD:91,clutchShot:92,three:88},'Championship role-wing defense and prepared perimeter touch.'),
    n('Kenny Smith',1989,1994,{three:92,releaseSpeed:93,passingAccuracy:89,iq:91},'Prepared catch shooting and controlled point connections.'),
    n('Vernon Maxwell',1989,1994,{perD:93,lateral:92,contested:89,releaseSpeed:91},'Aggressive guard pressure and quick high-variance shooting.'),
    n('Matthew Dellavedova',2014,2017,{hustle:96,perD:87,helpD:88},'Reserve guard screen navigation and effort.'),
    n('Dillon Brooks',2020,2025,{perD:95,lateral:91,contestD:93,str:89},'Physical wing containment and difficult matchup assignments.'),
    n('Deni Avdija',2023,2025,{helpD:91,perD:88,transition:92,passingAccuracy:88},'Tall wing recovery and connective transition handling.'),
    n('Aaron Gordon',2018,2025,{dunk:98,contactFinish:96,screen:93,perD:90,helpD:92},'Power-wing cutting, screens and large-matchup containment.'),
    n('Josh Hart',2018,2025,{hustle:99,boxout:91,helpD:93,transition:93},'Guard rebound positioning and repeated connective effort.'),
    n('Donte DiVincenzo',2021,2025,{hustle:96,helpD:92,perD:89,releaseSpeed:94},'Active guard rotations and quick high-volume prepared shooting.'),
    n('Austin Reaves',2022,2025,{footwork:92,passingAccuracy:92,floater:92,contactFinish:91,iq:92},'Change-of-pace secondary creation and positional touch.'),
    n('Jalen Williams',2023,2025,{footwork:95,mid:94,contactFinish:94,helpD:92,perD:91},'Strong wing separation, paint touch and versatile rotations.'),
    n('Jalen Johnson',2023,2025,{transition:96,vision:90,passingAccuracy:90,contactFinish:94,helpD:89},'Athletic transition-forward attacks and connective passing.'),
    n('Scottie Barnes',2022,2025,{vision:94,passingAccuracy:92,helpD:94,contactFinish:93,post:89},'Point-forward reads, positional defense and strength-based paint creation.'),
    n('Franz Wagner',2022,2025,{footwork:94,layup:94,contactFinish:93,vision:89,helpD:90},'Long wing driving angles and controlled secondary reads.'),
    n('Paolo Banchero',2023,2025,{contactFinish:96,footwork:94,post:92,shotCreation:94,vision:90},'Large-frame wing post leverage and self-created paint attacks.'),
    n('Amen Thompson',2023,2025,{burst:99,speed:97,transition:98,perD:94,helpD:94,hustle:97},'Explosive transition creation and versatile recovery defense.',{three:63}),
    n('Ausar Thompson',2023,2025,{burst:97,perD:95,helpD:95,lateral:95,hustle:97},'Long athletic wing containment and recovery.',{three:68}),
    n('Dyson Daniels',2023,2025,{perD:97,helpD:95,lateral:94,contestD:93},'Long guard pressure and anticipatory disruption.'),
    n('Toumani Camara',2023,2025,{perD:96,helpD:94,lateral:93,hustle:96},'Strong wing screen recovery and connected defensive effort.'),
    n('Jarrett Allen',2020,2025,{intD:94,helpD:94,contestD:95,screen:95,boxout:96,contactFinish:94},'Vertical rim contests, roll timing and positional rebounding.'),
    n('Ivica Zubac',2020,2025,{screen:97,boxout:97,intD:92,helpD:92,contactFinish:94},'Strong screen positioning, rolls and drop coverage.'),
    n('Isaiah Hartenstein',2021,2025,{screen:98,boxout:97,vision:91,passingAccuracy:92,helpD:95,floater:94},'High-post connections, short-roll touch and positional defense.'),
    n('Walker Kessler',2022,2025,{contestD:98,intD:95,helpD:94,boxout:94},'Young drop rim deterrence and long-reach vertical contests.'),
    n('Daniel Gafford',2020,2025,{dunk:96,contactFinish:94,contestD:95,helpD:91,burst:92},'Explosive rolls and recovery rim contests.'),
    n('Dereck Lively II',2023,2025,{helpD:94,contestD:94,screen:94,passingAccuracy:88,contactFinish:93},'Young roll timing, short-roll passing and mobile rim coverage.'),
    n('Mark Williams',2023,2025,{contestD:94,screen:94,boxout:94,contactFinish:94},'Long-reach drop contests and strong roll finishing.'),
    n('Jalen Duren',2023,2025,{str:95,screen:96,boxout:96,contactFinish:96,burst:93},'Young power roll finishing and positional rebounding.'),
    n('Onyeka Okongwu',2022,2025,{helpD:94,perD:87,lateral:86,contestD:93,contactFinish:91},'Mobile short-center coverage and switching recovery.'),
    n('Naz Reid',2022,2025,{three:90,releaseSpeed:90,shotArc:91,footwork:90,contactFinish:91},'Bench stretch-big release and controlled driving counters.'),
    n('Bobby Portis',2020,2025,{boxout:93,oreb:92,mid:89,shotArc:89,hustle:94},'Second-chance effort and prepared big-man shooting.'),
    n('Kevon Looney',2018,2022,{screen:98,boxout:98,oreb:95,helpD:94,iq:94},'Title-era screens, rebound positioning and coverage discipline.'),
    n('Mitchell Robinson',2019,2025,{contestD:96,oreb:98,boxout:96,contactFinish:93},'Long-reach rim contests and exceptional offensive rebound position.'),
    n('Nicolas Batum',2012,2025,{helpD:94,passingAccuracy:92,vision:90,iq:95},'Long-wing team-defense reads and connective passing across changing roles.'),
    n('Kyle Anderson',2017,2025,{iq:95,vision:92,passingAccuracy:92,helpD:94,footwork:90},'Patient forward orchestration and positional help without invented speed.'),
    n('Joe Ingles',2016,2020,{vision:94,passingAccuracy:94,shotArc:94,three:91,iq:95},'Peak left-handed pick-and-roll connections and prepared shooting.'),
    n('Josh Giddey',2022,2025,{vision:96,passingAccuracy:94,boxout:82,transition:90},'Tall guard transition reads and rebound-to-pass connections.'),
    n('T.J. McConnell',2017,2025,{handle:90,passingAccuracy:93,perD:88,hustle:98,floater:91},'Paint probing, backup orchestration and persistent point pressure.'),
    n('Monte Morris',2018,2022,{passingAccuracy:95,iq:94,floater:90,handle:90},'Low-turnover reserve point decisions and controlled paint touch.'),
    n('Tyus Jones',2018,2025,{passingAccuracy:96,iq:95,vision:91,floater:91},'Low-waste passing and deliberate reserve point orchestration.'),
    n('Payton Pritchard',2023,2025,{releaseSpeed:95,three:91,shotArc:94,handle:91,hustle:94},'Quick bench shooting and active small-guard creation.'),
    n('Norman Powell',2019,2025,{releaseSpeed:94,three:91,contactFinish:93,burst:91},'Efficient catch shooting and strong straight-line wing attacks.'),
    n('Malik Monk',2021,2025,{burst:94,handle:92,shotCreation:92,vision:89,contested:91},'Explosive bench pull-ups and secondary drive passing.'),
    n('Anfernee Simons',2021,2025,{releaseSpeed:96,shotArc:94,handle:92,shotCreation:93,burst:94},'Quick pull-up release and athletic guard creation.'),
    n('Cam Thomas',2022,2025,{shotCreation:94,contested:94,mid:92,footwork:91},'Difficult-shot scoring specialist rather than complete orchestration.'),
    n('Jordan Clarkson',2018,2024,{handle:94,shotCreation:93,contested:92,floater:92},'Bench isolation counters and paint-touch creation.'),
    n('Immanuel Quickley',2021,2025,{floater:95,handle:92,releaseSpeed:93,perD:87},'Guard floater craft, quick release and active point recovery.'),
    n('Coby White',2022,2025,{speed:94,releaseSpeed:93,handle:92,shotCreation:91},'Developed fast guard pull-ups and transition creation.'),
    n('Bennedict Mathurin',2022,2025,{contactFinish:94,burst:92,layup:92},'Young wing contact angles and downhill scoring.'),
    n('Shaedon Sharpe',2022,2025,{vert:99,burst:98,dunk:98,contactFinish:92},'Exceptional young wing elevation and aerial finishing.'),
    n('Jabari Smith Jr.',2023,2025,{releaseHeight:95,shotArc:91,contestD:88,helpD:87},'Tall prepared release and developing positional contests.'),
    n('Keegan Murray',2022,2025,{releaseHeight:91,releaseSpeed:92,shotArc:92,perD:88,helpD:89},'Prepared wing shooting and developed containment.'),
    n('Trey Murphy III',2022,2025,{releaseHeight:94,releaseSpeed:95,shotArc:95,three:93,contactFinish:90},'Long wing movement shooting and strong perimeter preparation.'),
    n('Gradey Dick',2023,2025,{releaseSpeed:92,shotArc:92,footwork:87},'Developing movement-shooting footwork without assuming a finished star.'),
    n('Brandin Podziemski',2023,2025,{vision:88,passingAccuracy:89,boxout:82,hustle:94},'Guard rebound positioning and connective decisions.'),
    n('Jaime Jaquez Jr.',2023,2025,{post:87,footwork:91,contactFinish:90,helpD:88},'Young wing post pivots and positional paint craft.'),

    // Second hand-scored pass: historical specialists absent from the first audit.
    // These are season-scoped skills, not reputation or whole-player OVR bonuses.
    n('Joe Fulks',1946,1950,{shotCreation:92,contested:91,mid:88},'Early jump-shot pioneer with difficult self-created perimeter attempts; efficiency remains archive-derived.'),
    n('Bob Davies',1948,1953,{vision:94,passingAccuracy:92,handle:92,agility:89},'Early fast-break point orchestration, controlled passing and dribble changes of direction.'),
    n('Harry Gallatin',1952,1957,{oreb:96,dreb:96,boxout:98,hustle:96},'Undersized but relentless rebound positioning and second-effort interior work.'),
    n('Ed Macauley',1950,1956,{post:96,footwork:96,floater:94,close:95},'Skilled pivot finishing, touch and movement before modern shot charts.'),
    n('Slater Martin',1951,1959,{perD:95,lateral:93,passingAccuracy:91,iq:92},'Point-of-attack ball pressure and composed championship-era guard distribution.'),
    n('Vern Mikkelsen',1950,1956,{post:94,contactFinish:96,str:95,boxout:94},'Physical interior seals, repeated contact and positional big-man defense.'),
    n('Clyde Lovellette',1954,1961,{post:95,mid:90,footwork:93,shotArc:91},'Inside-out big scoring and unusual soft shooting touch for his era.'),
    n('George Yardley',1955,1958,{shotCreation:95,contested:94,mid:92,contactFinish:92},'Volume wing scoring with varied face-up finishes in a condensed prime.'),
    n('Maurice Stokes',1955,1957,{dreb:99,boxout:98,vision:96,passingAccuracy:94,helpD:96},'Elite rebounding and unusually creative forward outlet passing before his career-ending injury.'),
    n('Jack Twyman',1958,1963,{mid:95,releaseSpeed:93,shotArc:94,contested:93},'High-volume wing jump shooting and consistent self-created midrange scoring.'),
    n('Richie Guerin',1959,1963,{handle:94,shotCreation:94,vision:93,passingAccuracy:91},'Scoring-guard creation mixed with strong backcourt distribution and rebounding.'),
    n('Cliff Hagan',1958,1963,{post:92,footwork:96,shotCreation:93,mid:92},'Inventive wing pivots and short-post scoring counters from a forward frame.'),
    n('Frank Ramsey',1956,1962,{shotCreation:92,contactFinish:92,transition:94,hustle:94},'Bench offense, opportunistic cutting and relentless transition finishing.'),
    n('Tom Gola',1956,1963,{vision:95,dreb:94,boxout:93,helpD:94,passingAccuracy:94},'Rebounding and passing from the wing with versatile positional team defense.'),
    n('Hal Greer',1961,1970,{mid:96,releaseSpeed:96,shotArc:95,footwork:93},'Fast repeatable jumper, off-screen footwork and trusted midrange offense.'),
    n('Guy Rodgers',1960,1968,{vision:99,passingAccuracy:98,handle:92},'High-volume assist creation and anticipatory passes without importing elite shooting.'),
    n('Lenny Wilkens',1964,1973,{vision:98,passingAccuracy:97,iq:96,handle:93},'Floor-general reads, controlled pacing and accurate pick-and-roll distribution.'),
    n('Zelmo Beaty',1965,1974,{post:95,boxout:97,str:95,close:94,footwork:93},'Strong leverage and efficient low-post work across NBA and ABA seasons.'),
    n('Dave DeBusschere',1965,1973,{perD:99,helpD:98,boxout:97,str:96,contestD:96},'Elite physical forward containment, early rotations and strong rebound positioning.'),
    n('Gus Johnson',1963,1971,{vert:98,contactFinish:97,str:96,perD:94,hustle:94},'Explosive power-wing finishing and physical multi-position defensive activity.'),
    n('Gail Goodrich',1969,1976,{mid:95,shotArc:96,releaseSpeed:94,handle:92},'Left-handed perimeter shotmaking, nimble pull-ups and halfcourt guard craft.'),
    n('Jerry Sloan',1967,1974,{perD:98,lateral:95,hustle:99,boxout:94,helpD:94},'Relentless guard pressure, screen fighting and unusually strong wing rebounding.'),
    n('Lou Hudson',1967,1975,{mid:96,contested:95,releaseSpeed:94,footwork:93},'Efficient wing pull-up shooting and difficult midrange separation.'),
    n('Connie Hawkins',1969,1973,{contactFinish:98,shotCreation:96,footwork:96,vision:92},'Large-handed creative finishing, airborne adjustments and forward playmaking.'),
    n('Earl Monroe',1967,1975,{handle:99,shotCreation:99,agility:96,footwork:96,contested:94},'Change-of-pace dribbling, spins and twisting self-created guard scoring.'),
    n('Jo Jo White',1970,1976,{mid:94,contested:93,vision:92,perD:91,stam:96},'Durable two-way guard with poised pull-ups and championship decision-making.'),
    n('Pete Maravich',1971,1977,{handle:100,vision:99,shotCreation:99,passingAccuracy:97,contested:96},'Pioneering live-dribble passes, off-balance shots and elaborate dribble creation.'),
    n('Calvin Murphy',1972,1979,{ft:99,handle:96,accel:96,mid:94,agility:95},'Free-throw precision, fast small-guard separation and high-touch midrange play.'),
    n('Rudy Tomjanovich',1972,1978,{mid:95,shotArc:95,footwork:92,contested:91},'Reliable forward jump shooting and balanced face-up scoring.'),
    n('George McGinnis',1972,1977,{contactFinish:98,str:98,post:95,oreb:95,transition:92},'Massive power-forward paint pressure, strong boards and driving leverage.'),
    n('Jamaal Wilkes',1975,1982,{mid:95,transition:96,perD:93,footwork:93},'Unorthodox but repeatable jumper, intelligent cuts and wing containment.'),
    n('James Worthy',1984,1991,{transition:99,footwork:98,contactFinish:97,post:94,close:96},'Open-court speed, quick spin finishes and championship wing-post attacks.'),
    n('Ralph Sampson',1983,1985,{vert:97,intD:96,contestD:97,helpD:95,transition:93},'Healthy early-career seven-foot mobility and recovery contests; later injuries never inherit this note.'),
    n('Joe Dumars',1987,1993,{perD:99,lateral:97,iq:96,releaseSpeed:94,contested:92},'Elite disciplined point-of-attack defense and controlled scoring against top guards.'),
    n('Joe Dumars',1994,1998,{three:94,releaseSpeed:96,shotArc:95,iq:95},'Veteran three-point shooting and economical backcourt decisions without restored peak lateral speed.'),
    n('Mitch Richmond',1989,1998,{mid:96,three:93,releaseSpeed:95,contested:96,contactFinish:93},'Strong-bodied three-level guard scoring and consistent contested pull-up touch.'),
    n('Vlade Divac',1992,2002,{vision:97,passingAccuracy:95,footwork:95,screen:95,iq:96},'Center elbow orchestration, deceptive feeds and positional screen craft.'),
    n('Dražen Petrović',1991,1992,{three:97,releaseSpeed:98,shotArc:97,mid:95,contested:94},'Peak Nets shooting, instant catch-and-shoot balance and sharp midrange footwork.'),
    n('Šarūnas Marčiulionis',1990,1993,{contactFinish:96,handle:92,layup:95,agility:92,str:88},'Left-handed downhill attacks through contact and powerful driving angles.'),
    n('Dino Radja',1993,1996,{post:96,footwork:96,contactFinish:94,floater:93},'European post-pivot craft, fakes and soft around-rim scoring.'),
    n('Bob Dandridge',1970,1978,{perD:95,footwork:94,contested:95,mid:92},'Strong wing defense, pressure-game face-up scoring and balanced pivots.'),
    n('Dick Barnett',1963,1969,{mid:94,fade:93,footwork:94,shotArc:93},'Distinctive leaning jumper with practiced release touch and midrange counters.'),
    n('Carl Braun',1948,1957,{mid:93,shotArc:92,passingAccuracy:90},'Productive early-era jump shooting and connective guard distribution.'),
    n('K.C. Jones',1959,1966,{perD:98,lateral:95,helpD:93,passingAccuracy:92},'Defense-first point pressure and organized Boston passing, not a scoring reputation.'),
    n('Al Attles',1961,1969,{perD:94,hustle:97,lateral:92,helpD:92},'Physical defensive guard pressure and high-effort help assignments.'),
    n('Bailey Howell',1961,1970,{contactFinish:94,oreb:94,boxout:95,footwork:92},'Reliable interior finishing and positional forward rebounding.'),
    n('Don Nelson',1966,1974,{mid:92,helpD:91,iq:93,footwork:90},'Smart veteran forward positioning and unusual set-shot touch.'),
  ];
})();
const scoutingByPlayer = new Map();
for (const note of HL.HISTORICAL_SCOUTING) {
  if (!scoutingByPlayer.has(note.player)) scoutingByPlayer.set(note.player, []);
  scoutingByPlayer.get(note.player).push(note);
}
HL.historicalScouting = function(row) {
  if (!row || !Number.isFinite(row.seasonStart) || row.g < 15) return [];
  const name = HL.HISTORY?.players?.[row.pid]?.[0];
  return (scoutingByPlayer.get(name) || []).filter(n => row.seasonStart >= n.from && row.seasonStart <= n.through);
};
// Use the exact same historical attribute projection for Skill Draft, 82-0,
// exhibition games and Franchise. Never invent packed data fields.
const historicalAttributeCache = new WeakMap();
HL.historicalAttributes = function(row) {
  if (historicalAttributeCache.has(row)) return historicalAttributeCache.get(row);
  const bio=HL.HISTORY.players[row.pid]||[];
  const base=HL.History.unpack(row.attrs,HL.HISTORY.attrs);
  const result=HL.completeAttributes(base,bio[3],bio[4]);
  // Historical rebound production is independent evidence of rebounding talent.
  // Per-36 avoids treating a high-minute era as inherently more skilled; height
  // prevents guard rebounding volume from turning into a fictional elite box-out.
  if (row.g >= 20 && Number.isFinite(row.trb) && Number.isFinite(row.mpg) && row.mpg > 12) {
    const per36 = row.trb * 36 / row.mpg;
    const size = (bio[3] || 78) >= 80 ? 1 : 0.55;
    const adjustment = HL.clamp((per36 - 8.2)*3.0,-5,14) * size * HL.clamp(row.g/50,0,1);
    result.oreb = Math.round(HL.clamp(base.oreb + adjustment*.84,25,99));
    result.dreb = Math.round(HL.clamp(base.dreb + adjustment,25,99));
    // Derive the dependent attributes AFTER the measured-production correction.
    result.boxout = HL.completeAttributes({ ...base, oreb:result.oreb, dreb:result.dreb },bio[3],bio[4]).boxout;
  }
  // Genuine high-usage midrange specialists have demonstrated the repetition and
  // footwork that the generic average could not identify; this is still a proxy.
  if (row.g >= 30 && row.pts >= 24 && result.mid >= 82) {
    result.fade = Math.round(HL.clamp(result.fade + Math.min(9,(result.mid-80)*.48) + (result.post>=75?2:0),25,99));
    result.clutchShot = Math.round(HL.clamp(result.clutchShot + Math.min(7,(row.pts-22)*.32),25,99));
  }
  // FG% is an imperfect cross-era proxy (especially for bigs); use only a
  // small, bounded contextual correction. IQ and shot creation drive the skill.
  if (Number.isFinite(row.fgp) && row.g>=15) {
    const reliability=HL.clamp(row.g/45,0,1);
    const baseline=(bio[3]||78)>=82 ? .51 : .455;
    result.shotSelection=Math.round(HL.clamp(result.shotSelection+
      HL.clamp((row.fgp-baseline)*43,-6,6)*reliability,25,99));
  }
  // Carefully scoped 100-tier scouting grades. They are not derived by raising
  // every rating to a requested OVR. Each case requires a documented combination
  // of a historic specialty and strong season production; every weakness stays.
  const name=String(bio[0]||'');
  if (name === 'Stephen Curry' && row.g >= 50 && row.pts >= 24 &&
      row.tpp >= .40 && result.three >= 97) result.three=100;
  if (name === 'Michael Jordan' && row.g >= 50 && row.pts >= 26 &&
      result.mid >= 85 && result.fade >= 90 && row.bpm >= 7.5)
    result.fade=100;
  if (name === "Shaquille O'Neal" && row.g >= 50 && row.pts >= 25 &&
      row.fgp >= .55 && result.dunk >= 93) result.dunk=100;
  // Each floor/cap above is a specific basketball judgment for these years.
  // Apply measured core corrections before recomputing their dependent traits;
  // then apply independently scouted technique (which a box score cannot measure).
  const notes = HL.historicalScouting(row);
  if (notes.length) {
    const beforeCore = Object.fromEntries(HL.CORE_ATTR_KEYS.map(key=>[key,result[key]]));
    const beforeDependent = HL.completeAttributes(beforeCore,bio[3],bio[4]);
    for (const note of notes) {
      for (const [key,grade] of Object.entries(note.grades)) if (HL.CORE_ATTR_KEYS.includes(key)) result[key]=Math.max(result[key],grade);
      for (const [key,grade] of Object.entries(note.ceilings)) if (HL.CORE_ATTR_KEYS.includes(key)) result[key]=Math.min(result[key],grade);
    }
    const core = Object.fromEntries(HL.CORE_ATTR_KEYS.map(key=>[key,result[key]]));
    const dependent = HL.completeAttributes(core,bio[3],bio[4]);
    // Carry existing season-context adjustments forward. A release-only note
    // cannot erase an earlier rebound, decision-quality or clutch correction.
    for (const key of HL.ADV_ATTR_KEYS) result[key]=Math.round(HL.clamp(result[key]+dependent[key]-beforeDependent[key],25,100));
    for (const note of notes) {
      for (const [key,grade] of Object.entries(note.grades)) if (HL.ADV_ATTR_KEYS.includes(key)) result[key]=Math.max(result[key],grade);
      for (const [key,grade] of Object.entries(note.ceilings)) if (HL.ADV_ATTR_KEYS.includes(key)) result[key]=Math.min(result[key],grade);
    }
  }
  historicalAttributeCache.set(row,result);
  return result;
};


// A historical season's OVR is an evaluation of its demonstrated impact, in
// addition to the independently computed basketball skills.  The box-score
// record's BPM measures era-relative impact; scoring at volume and elite 3PT
// gravity supply complementary evidence. No player's name or desired OVR is
// used here, and NO unrelated attributes are raised to hit an OVR number.
// Important: a small per-game sample cannot establish an all-time season.
const historicalOvrCache = new WeakMap();
HL.historicalSeasonImpact = function (row, attrs) {
  if (!row) return 0;
  const a=attrs || HL.historicalAttributes(row);
  const games=Number(row.g)||0, minutes=Number(row.mpg)||0;
  if (games < 15 || minutes < 15) return 0;
  const bpm=Number.isFinite(row.bpm)?row.bpm:0;
  const ppg=Number.isFinite(row.pts)?row.pts:0;
  const sample=HL.clamp((games-12)/43,0,1) * HL.clamp((minutes-15)/13,0,1);
  // Advanced impact statistics are not exact for all early seasons. Season
  // production is weighted more conservatively when BPM is unavailable.
  const measuredImpact=Math.max(0,bpm-4)*0.85;
  const scoringVolume=Math.max(0,ppg-24)*0.31;
  const shotDiet = typeof row.tend === 'string' && HL.HISTORY?.tends
    ? HL.History.unpack(row.tend,HL.HISTORY.tends) : {};
  const eliteShooting=HL.clamp((a.three-90)/9,0,1);
  const highVolume=HL.clamp(((shotDiet.three||0)-30)/40,0,1);
  const gravity=ppg>=20 ? eliteShooting*highVolume*2.8 : 0;
  return HL.clamp((measuredImpact+scoringVolume+gravity)*sample,0,11);
};
HL.historicalSeasonOvr = function (row) {
  if (historicalOvrCache.has(row)) return historicalOvrCache.get(row);
  const a=HL.historicalAttributes(row);
  const skillOvr=HL.computeOvr(a,row.pos);
  const ovr=Math.round(HL.clamp(skillOvr + HL.historicalSeasonImpact(row,a),25,99));
  historicalOvrCache.set(row,ovr);
  return ovr;
};

// The 100 overall is reserved for exceptional real historical peak seasons,
// not all players with a regular 99 OVR. Only a natural-position fit can unlock
// this extra OVR point. This function does not modify the underlying attributes.
HL.legendaryPeak = function(row) {
  if (!row || row.g < 50 || row.mpg < 28 || HL.historicalSeasonOvr(row) < 99) return false;
  const bio=HL.HISTORY?.players?.[row.pid] || [];
  const name=bio[0];
  // All-time production and impact threshold, with limited documented peak
  // seasons where BPM is less useful than the historical achievements.
  if (row.bpm >= 10 && row.pts >= 23) return true;
  if (name==='LeBron James' && row.bpm>=8.5 && row.pts>=25) return true;
  if (name==='Michael Jordan' && row.bpm>=8 && row.pts>=27) return true;
  if (name==='Stephen Curry' && row.bpm>=7.5 && row.pts>=28 && row.tpp>=.40) return true;
  if (name==="Shaquille O'Neal" && row.bpm>=8 && row.pts>=27 && row.fgp>=.55) return true;
  return false;
};

// Nonlinear elite response. 99 is a difference-making skill, not a cosmetic +1.
// It is deliberately bounded; opposing elite defense can counter elite offense.
HL.eliteImpact = r => {
  const grade=HL.clamp(Number(r)||0,25,100);
  const gradual=Math.pow(Math.max(0,grade-88)/11,1.35);
  // The historic 100 tier should be noticeable, while still counterable.
  return gradual+(grade===100?.28:0);
};

// Relative strengths per archetype (added to a base around the target OVR).
HL.ARCHETYPES = {
  scorer:      { label: 'Shot Creator',      p: { mid: 12, three: 8, ft: 8, layup: 8, handle: 8, close: 6, iq: 4, perD: -6, intD: -10, block: -10, oreb: -10, dreb: -6, pass: 0 } },
  sniper:      { label: 'Sharpshooter',      p: { three: 16, mid: 8, ft: 12, iq: 4, dunk: -12, post: -10, intD: -10, block: -12, oreb: -12, str: -6, layup: -2 } },
  slasher:     { label: 'Slasher',           p: { layup: 14, dunk: 12, speed: 10, vert: 10, handle: 4, close: 6, three: -8, mid: -4, post: -6, block: -6 } },
  playmaker:   { label: 'Floor General',     p: { pass: 16, handle: 14, iq: 10, three: 4, ft: 6, speed: 4, dunk: -10, post: -10, intD: -12, block: -14, oreb: -12, dreb: -8, str: -8 } },
  '3d':        { label: '3&D Wing',          p: { three: 10, perD: 12, steal: 6, ft: 2, handle: -6, pass: -6, post: -8, mid: -2 } },
  twoway:      { label: 'Two-Way Wing',      p: { perD: 10, steal: 6, layup: 6, mid: 4, three: 2, speed: 4, iq: 4, post: -6, block: -2 } },
  defguard:    { label: 'Lockdown Guard',    p: { perD: 16, steal: 12, speed: 6, iq: 4, handle: 2, three: -2, mid: -4, post: -10, block: -6, dunk: -6 } },
  pointfwd:    { label: 'Point Forward',     p: { pass: 12, handle: 6, iq: 10, layup: 6, dreb: 4, str: 4, three: -2, perD: 2 } },
  rimbig:      { label: 'Rim Runner',        p: { dunk: 14, close: 10, oreb: 14, dreb: 10, block: 8, vert: 8, intD: 6, three: -20, mid: -10, handle: -14, pass: -8, ft: -10 } },
  stretchbig:  { label: 'Stretch Big',       p: { three: 10, mid: 8, ft: 6, dreb: 8, close: 4, handle: -10, speed: -6, steal: -6, perD: -6, dunk: -4 } },
  postbig:     { label: 'Post Scorer',       p: { post: 16, close: 12, str: 10, oreb: 8, dreb: 8, mid: 2, three: -12, speed: -10, handle: -12, perD: -10, steal: -8 } },
  defbig:      { label: 'Rim Protector',     p: { block: 16, intD: 16, dreb: 12, oreb: 8, str: 6, three: -16, mid: -8, handle: -16, pass: -8, ft: -8, layup: -4 } },
  unicorn:     { label: 'Unicorn',           p: { block: 12, intD: 10, three: 6, dreb: 8, mid: 4, vert: 4, handle: -4, post: -2, str: -4 } },
  pointcenter: { label: 'Point Center',      p: { pass: 16, iq: 14, post: 10, close: 10, dreb: 10, str: 6, mid: 4, speed: -14, vert: -10, steal: -4, perD: -10, dunk: -6, block: -9, intD: -5 } },
};

// How much each attribute matters to OVR per position.
HL.OVR_WEIGHTS = {
  PG: { close: 1, mid: 3, three: 4, ft: 1, layup: 3, dunk: 0.5, post: 0.2, handle: 4, pass: 4, iq: 3, perD: 3, intD: 0.5, steal: 2, block: 0.3, oreb: 0.3, dreb: 1, speed: 3, vert: 1, str: 0.5, stam: 1 },
  SG: { close: 1, mid: 3, three: 4, ft: 1, layup: 3, dunk: 1, post: 0.3, handle: 3, pass: 2, iq: 3, perD: 3, intD: 0.5, steal: 2, block: 0.5, oreb: 0.5, dreb: 1, speed: 3, vert: 1.5, str: 0.7, stam: 1 },
  SF: { close: 1.5, mid: 3, three: 3, ft: 1, layup: 3, dunk: 2, post: 1, handle: 2, pass: 2, iq: 3, perD: 3, intD: 1.5, steal: 1.5, block: 1, oreb: 1, dreb: 2, speed: 2, vert: 2, str: 1.5, stam: 1 },
  PF: { close: 3, mid: 2, three: 2, ft: 1, layup: 2.5, dunk: 2.5, post: 2, handle: 1, pass: 1.5, iq: 3, perD: 2, intD: 3, steal: 1, block: 2, oreb: 2, dreb: 3, speed: 1.5, vert: 2, str: 2.5, stam: 1 },
  C:  { close: 4, mid: 1.5, three: 1.5, ft: 0.8, layup: 2, dunk: 3, post: 2.5, handle: 0.5, pass: 1.5, iq: 3, perD: 1, intD: 4, steal: 0.5, block: 3.5, oreb: 3, dreb: 4, speed: 1, vert: 2, str: 3, stam: 1 },
};

// Each position gets a small supporting weight for specialist movement and
// shot creation. Core ratings retain most of the OVR influence.
for (const [pos,w] of Object.entries(HL.OVR_WEIGHTS)) {
  Object.assign(w, {
    accel: ['PG','SG'].includes(pos) ? 1.0 : .5,
    lateral: ['PG','SG','SF'].includes(pos) ? .8 : .5,
    releaseSpeed: ['PG','SG','SF'].includes(pos) ? .7 : .35,
    releaseHeight: ['PF','C'].includes(pos) ? .55 : .4,
    shotArc: .35, shotSelection: .65, contested: .7, screen: ['PF','C'].includes(pos) ? .7 : .25,
    hustle: .45, burst: .75, agility: .35, contactFinish: .4, floater: .2, fade: .2, footwork: .3, shotCreation: .5, vision: .35, passingAccuracy: .3, helpD: .4, contestD: .4, boxout: .25, transition: .35, clutchShot: .15
  });
}

// OVR = weighted average blended with top-attribute peaks, so specialists still rate well.
HL.computeOvr = function (a, pos) {
  const w = HL.OVR_WEIGHTS[pos] || HL.OVR_WEIGHTS.SF;
  let sum = 0, wsum = 0;
  for (const k in w) { sum += (Number.isFinite(a[k]) ? a[k] : 65) * w[k]; wsum += w[k]; }
  const avg = sum / wsum;
  const top = HL.CORE_ATTR_KEYS.filter(k => k !== 'dur' && k !== 'stam').map(k => Number.isFinite(a[k]) ? a[k] : 65).sort((x, y) => y - x).slice(0, 6);
  const topAvg = top.reduce((s, v) => s + v, 0) / top.length;
  // Strengths drive OVR (like 2K), so stars keep real weaknesses.
  const raw = avg * 0.45 + topAvg * 0.55;
  return Math.round(HL.clamp(40 + (raw - 52) * 1.5, 25, 99));
};

// Height shapes what a body can do: bigs rebound/block, smalls are quick and handle.
function heightMods(heightIn) {
  const d = heightIn - 79; // 6'7" is neutral
  return {
    oreb: d * 1.6, dreb: d * 1.6, block: d * 1.8, intD: d * 1.4, post: d * 1.0, close: d * 0.6, dunk: d * 0.8, str: d * 1.0,
    speed: -d * 1.5, handle: -d * 1.3, steal: -d * 0.8, perD: -d * 0.6, pass: -d * 0.3, three: -d * 0.3,
  };
}

// Build a full attribute set whose OVR lands on the target.
HL.buildAttributes = function (targetOvr, pos, heightIn, arch, opts = {}) {
  const R = HL.RNG;
  // Archetypes can be combined ("scorer+playmaker"); profiles are blended.
  const parts = String(arch || 'twoway').split('+').map(a => (HL.ARCHETYPES[a] || HL.ARCHETYPES.twoway).p);
  const prof = {};
  for (const pp of parts) for (const k in pp) prof[k] = (prof[k] || 0) + pp[k] * (parts.length > 1 ? 0.7 : 1);
  // Stars have more extreme profiles: elite strengths, real weaknesses.
  const amp = 1 + Math.max(0, targetOvr - 72) * 0.045;
  const hm = heightMods(heightIn);
  const raw = {};
  for (const k of HL.CORE_ATTR_KEYS) {
    raw[k] = 60 + (prof[k] || 0) * 1.25 * amp + (hm[k] || 0) + R.normal(0, opts.noise ?? 4.5);
  }
  raw.stam = 70 + R.normal(0, 6);
  raw.dur = opts.durability ?? (75 + R.normal(0, 9));

  let shift = targetOvr - 60;
  let attrs = {};
  // Iteratively shift until computed OVR matches target.
  for (let i = 0; i < 12; i++) {
    for (const k of HL.CORE_ATTR_KEYS) {
      const k2 = k === 'dur' ? 0 : k === 'stam' ? 0.4 : 1;
      attrs[k] = Math.round(HL.clamp(raw[k] + shift * k2, 25, 99));
    }
    const diff = targetOvr - HL.computeOvr(attrs, pos);
    if (diff === 0) break;
    shift += diff * 0.9;
  }
  return HL.completeAttributes(attrs, heightIn, Math.round(185 + (heightIn - 76) * 7));
};

// Age curve: growth until ~26, plateau, decline after ~30.
HL.progressionDelta = function (age, potentialGap, workEthic, difficultyMult = 1) {
  const R = HL.RNG;
  let base;
  if (age <= 20) base = 4.5;
  else if (age <= 22) base = 3.2;
  else if (age <= 24) base = 2.0;
  else if (age <= 26) base = 0.9;
  else if (age <= 29) base = 0;
  else if (age <= 31) base = -0.8;
  else if (age <= 33) base = -1.7;
  else if (age <= 35) base = -2.6;
  else if (age <= 37) base = -3.4;
  else base = -4.2;
  if (base > 0) base *= HL.clamp(potentialGap / 10, 0.2, 1.6) * difficultyMult;
  // Work ethic helps young players grow and slows the decline of veterans.
  base += (workEthic - 50) / (base < 0 ? 60 : 40);
  // A rare breakout is possible, but routine offseasons shouldn't randomly erase stars.
  // Physical decline can remain steeper than skill decline in applyProgression.
  const noise = R.normal(0, age >= 30 ? 0.8 : 1.5);
  return HL.clamp(base + noise, age >= 30 ? -3.2 : -2.5, age >= 30 ? 1.5 : 4.5);
};

HL.applyProgression = function (p, delta) {
  const physical = new Set(['speed', 'vert', 'accel', 'lateral', 'stam']);
  for (const k of HL.ATTR_KEYS) {
    if (k === 'dur') continue;
    let d = delta + HL.RNG.normal(0, 0.65);
    // Old players lose burst first; shooting touch, technique and court vision endure.
    if (delta < 0 && physical.has(k)) d *= 1.45;
    if (delta < 0 && ['three','mid','ft','iq','pass','post','handle','releaseSpeed','shotArc'].includes(k)) d *= 0.25;
    if (delta > 0 && k === 'iq') d += 0.5;
    const cap = (p.caps && p.caps[k]) || 99;
    p.attrs[k] = Math.round(HL.clamp(p.attrs[k] + d, 25, cap));
  }
  p.ovr = HL.computeOvr(p.attrs, p.pos);
};

HL.archetypeName = function (p) {
  // Name from top two attribute groups, MyCareer-style.
  const groups = {};
  for (const a of HL.ATTRS) {
    if (a.group === 'Athleticism') continue;
    (groups[a.group] = groups[a.group] || []).push(p.attrs[a.key]);
  }
  const avg = g => groups[g].reduce((s, v) => s + v, 0) / groups[g].length;
  const order = Object.keys(groups).sort((x, y) => avg(y) - avg(x));
  const adj = { Scoring: '3-Level', Finishing: 'Slashing', Playmaking: 'Playmaking', Defense: 'Lockdown', Rebounding: 'Glass-Cleaning' };
  const noun = { Scoring: 'Scorer', Finishing: 'Finisher', Playmaking: 'Shot Creator', Defense: 'Defender', Rebounding: 'Anchor' };
  return `${adj[order[1]]} ${noun[order[0]]}`;
};
