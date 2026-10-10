// Historically grounded, non-destructive era profiles used by every game mode.
window.HL = window.HL || {};
HL.eraContext = function(season) {
  const year=Number(season)||2025;
  const facts=[];
  if(year<1954)facts.push('No shot clock (pre-1954); possession lengths are approximated');
  else facts.push('24-second shot clock');
  facts.push(year<1979?'No three-point line':'Three-point line in play');
  if(year>=1994&&year<=1996)facts.push('22-foot shortened arc');
  if(year<2001)facts.push('Illegal-defense restrictions; no modern zone');
  else facts.push('Zone defenses legal, defensive three-second rule');
  if(year<2004)facts.push('More perimeter contact / hand-checking');
  else facts.push('Hand-check restrictions');
  if(year>=2018)facts.push('14-second offensive rebound reset');
  if(year>=2022)facts.push('Transition take foul penalty');
  const prof=HL.HISTORY?.profiles?.[year]||{};
  return {season:year, facts, pace:prof.pace||null, efg:prof.efg||null, three:year>=1979,
    strength:year<2004?1.13:1, speed:year>=2004?1.10:1,
    perimeter:year<1979?0:year<1994?0.65:year<2015?0.84:1,
    rim:year<1965?1.12:1, spacing:year>=2015?1.08:year<1979?.83:1};
};
HL.careerTraitFor = function(pid) {
  const years=HL.CAREER_SPANS?.[pid]||[9,4,0,0];
  // A season span does not establish how many future years an active player will play.
  return { longevity: Math.round(HL.clamp(36+years[0]*2.75,25,99)),
    primeLength:Math.round(HL.clamp(34+years[1]*5.3,25,99)),
    playedYears: years[0], peakYears: years[1], incomplete:years[3]>=HL.LATEST_SEASON };
};

HL.historicalTendencies = function(row) {
  const bio=HL.HISTORY.players[row.pid]||[];
  const attrs=HL.historicalAttributes(row);
  const raw=HL.History.unpack(row.tend,HL.HISTORY.tends);
  return HL.completeTendencies({attrs,height:bio[3],weight:bio[4],ovr:row.ovr,tend:raw});
};