from pathlib import Path
p=Path('/mnt/data/hoops-mutant-release/js/league/rare-encounters.js');s=p.read_text()
pos=s.index('  const LOOKUP = ')
s=s[:pos]+'''  // Legendary rolls REPLACE the ordinary team hand, never add a free sixth card.
  // The NBA versions of Olympic participants are used for USA fantasy rosters.
  const DRAFT_TEAMS = [
    {id:'warriors73',label:'73–9 Warriors · SUPERCHARGED',year:2015,franchise:'GSW',pids:['curryst01','thompkl01','greendr01','iguodan01','barneha02']},
    {id:'golden17',label:'2017 Warriors · HAMPTON FIVE',year:2016,franchise:'GSW',pids:['curryst01','duranke01','thompkl01','greendr01','iguodan01']},
    {id:'bulls96',label:'72–10 Bulls · SECOND THREE-PEAT',year:1995,franchise:'CHI',pids:['jordami01','pippesc01','rodmade01','kukoc to01'.replace(' ',''),'harperro01']},
    {id:'dream92',label:'1992 USA DREAM TEAM · FANTASY',year:1991,franchise:'CHI',pids:['jordami01','johnsma02','birdla01','barklch01','pippesc01','malonka01','ewingpa01','stockjo01','drexlcl01']},
    {id:'heat13',label:'2013 Heatles · HISTORIC',year:2012,franchise:'MIA',pids:['jamesle01','wadedw01','boshch01','allenra02','chalmma01']},
    {id:'lakers01',label:'2001 Lakers · THREE-PEAT CORE',year:2000,franchise:'LAL',pids:['onealsh01','bryanko01','fish ede01'.replace(' ',''),'horryro01','foxri01']},
  ];
  async function draftTeam(spec) {
    await HL.History.load(''+spec.year);
    const rows=HL.History.seasonRows(''+spec.year), output=[];
    for(const pid of spec.pids){const row=rows.find(r=>r.pid===pid);if(!row)continue;
      output.push({row,season:spec.year,club:row.stints?.[0]?.[0]||spec.franchise,legendary:true,legendaryName:spec.label,specialTeam:spec.id});
      if(output.length===5)break;
    }
    return output.length===5?output:null;
  }
  async function rollDraftTeam(chance=0.013) {
    if(!HL.RNG.chance(chance))return null;
    const shuffled=HL.RNG.shuffle([...DRAFT_TEAMS]);
    for(const spec of shuffled){const hand=await draftTeam(spec);if(hand)return {spec,hand};}
    return null;
  }
''' +s[pos:]
s=s.replace('return { ICONS, ENCOUNTERS, wildcard, rareOpponent, opponent };','return { ICONS, ENCOUNTERS, DRAFT_TEAMS, wildcard, rareOpponent, opponent, draftTeam, rollDraftTeam };')
p.write_text(s)