// Rare historical wildcard cards and clearly fictional crossover opponents.
// These appearances are intentionally uncommon, independent of normal hand ranking.
window.HL = window.HL || {};
HL.Legends = (function () {
  const ICONS = [
    ['Air Jordan · 1990-91',1990,'jordami01'],
    ['Prime LeBron · 2017-18',2017,'jamesle01'],
    ['Unanimous Curry · 2015-16',2015,'curryst01'],
    ['Peak Shaq · 1999-00',1999,'onealsh01'],
    ['Wilt the Stilt · 1961-62',1961,'chambwi01'],
    ['Magic Johnson · 1986-87',1986,'johnsma02'],
    ['Larry Bird · 1985-86',1985,'birdla01'],
    ['Kobe Bryant · 2005-06',2005,'bryanko01'],
    ['Kevin Durant · 2013-14',2013,'duranke01'],
  ];
  const ENCOUNTERS = [
    { id:'warriors73', name:'73-9 Warriors: Supercharged', year:2015,
      pids:['curryst01','thompkl01','greendr01','iguodan01','barneha02'],
      note:'An elevated version of the 2015-16, 73-win Warriors. Fictional crossover challenge, not an additional real NBA game.' },
    { id:'dreamteam92', name:'1992 Dream Team Showcase', year:1991,
      pids:['jordami01','johnsma02','birdla01','barklch01','ewingpa01','pippesc01','robinda01','malonka01','stockjo01','mullich01','drexlcl01'],
      note:'A fictional NBA-rule exhibition using season-era NBA versions of the 1992 Team USA stars; not a historical NBA franchise.' },
    { id:'superteam17',name:'2017 Warriors Superteam+',year:2016,
      pids:['curryst01','duranke01','thompkl01','greendr01','iguodan01'],
      note:'The Durant-era Warriors, boosted for an alternate-history challenge.' },
    { id:'redeem08',name:'2008 USA All-Star Showcase',year:2007,
      pids:['jamesle01','bryanko01','wadedw01','anthoca01','paulch01','howardw01','boshch01'],
      note:'A fictional 2008 USA-inspired all-star exhibition, not a historical NBA roster.' }
  ];
  const LOOKUP = {GSW:'GSW',LAL:'LAL',CHI:'CHI',CLE:'CLE',MIA:'MIA'};
  async function wildcard(category, excluded = [], chance = 0.022) {
    if (!HL.RNG.chance(chance)) return null;
    const excludedIds=new Set(excluded);
    const valid=[];
    for(const [label,year,pid] of ICONS) {
      if(excludedIds.has(pid) || !HL.HISTORY.players[pid]) continue;
      await HL.History.load(''+year);
      const row=HL.History.seasonRows(''+year).find(x=>x.pid===pid);
      if(!row) continue;
      const club=row.stints[0]?.[0]||'LAL';
      const c={row,season:year,club,legendary:true,legendaryName:label};
      const value=category && HL.Challenge?.skillValue ? HL.Challenge.skillValue(c,category) : HL.historicalSeasonOvr(row);
      valid.push({candidate:c,value});
    }
    if(!valid.length)return null;
    valid.sort((a,b)=>b.value-a.value);
    // Choose from the top three relevant icons so the prize suits the category.
    return HL.RNG.pick(valid.slice(0,3)).candidate;
  }
  async function rareOpponent(chance=0.035) {
    if(!HL.RNG.chance(chance))return null;
    return HL.RNG.pick(ENCOUNTERS);
  }
  async function opponent(spec) {
    await HL.History.load(''+spec.year);
    const roster=HL.History.seasonRows(''+spec.year), players=[];
    const wanted=spec.pids;
    for(const pid of wanted) {
      const row=roster.find(r=>r.pid===pid);
      if(!row)continue;
      const p=HL.History.makePlayer(row,spec.year,-100);
      if(spec.id==='warriors73'||spec.id==='superteam17') {
        // Boost the existing stars' specialties, not every skill and every player.
        const main=['curryst01','duranke01','thompkl01'].includes(pid);
        for(const key of main?['three','mid','releaseSpeed','shotCreation']:['perD','intD','pass','iq'])
          p.attrs[key]=Math.min(Math.max(99,p.attrs[key]),p.attrs[key]+(main?5:3));
        p.ovr=HL.computeOvr(p.attrs,p.pos);
      }
      players.push(p);
    }
    if(players.length<5)return null;
    const team={ id:-100,abbr:'LEG',city:'Legends',name:spec.name,conf:'East',
      strategy:HL.DEFAULT_STRATEGY(), players,customPlayers:players,legendSpec:spec };
    return team;
  }
  return { ICONS, ENCOUNTERS, wildcard, rareOpponent, opponent };
})();
