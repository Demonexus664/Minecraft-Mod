from pathlib import Path
root=Path('/mnt/data/hoops-mutant-release')
def edit(p, patches):
 f=root/p;s=f.read_text()
 for old,new in patches:
  n=s.count(old)
  if n!=1:raise Exception(f'{p}: expected one match found {n}: {old[:120]}')
  s=s.replace(old,new)
 f.write_text(s)
# Gameplay effects: all applied within possession engine, capped and matchup-relevant.
edit('js/league/gamesim.js',[
 ('  const aValue = (p,k) => p.attrs[k]??65;', '''  const aValue = (p,k) => p.attrs[k]??65;
  const dna = (p,key) => HL.clamp(p.dna?.effects?.[key] || 0,-0.03,0.095);
'''),
 ('      pTO += ((initiator.tend.riskyPass || 50)-50)*.00015;', '''      pTO += ((initiator.tend.riskyPass || 50)-50)*.00015;
      // Signature passing and defensive identities change actual turnover odds.
      pTO -= dna(initiator,'assist')*.19;
      pTO += dline.reduce((n,p)=>n+dna(p,'steal'),0)/Math.max(1,dline.length)*.12;'''),
 ("      if (strat.focus === 'motion') pAst += 0.08;", "      if (strat.focus === 'motion') pAst += 0.08;\n      pAst += dna(shooter,'assist') * .72;"),
 ('        if (transition) makeP += 0.07;', "        if (transition) makeP += 0.07 + dna(shooter,'transition')*.7;\n        makeP += dna(shooter,'rim') * .85 - dna(sDef,'defense')*.62;"),
 ("        label = 'jumper';", "        makeP += dna(shooter,'mid')*.85 - dna(sDef,'defense')*.60;\n        label = 'jumper';"),
 ("        if (deep) makeP -= 0.09;", "        if (deep) makeP -= 0.09;\n        makeP += dna(shooter,'three')*.88 - dna(sDef,'defense')*.6;"),
 ("      if (clutch) makeP += 0.017*HL.eliteImpact(shooter.attrs.clutchShot);", "      if (clutch) makeP += 0.017*HL.eliteImpact(shooter.attrs.clutchShot) + dna(shooter,'clutch')*.77;"),
 ("      if (type === 'three') pOff += 0.02;", "      if (type === 'three') pOff += 0.02;\n      pOff += O.onCourt.reduce((n,p)=>n+dna(p,'reb'),0)/Math.max(1,O.onCourt.length)*.36;"),
])
# Skill Draft: cache DNA and preserve it across seasons. Category-specific signature carries style.
edit('js/modes/skilldraft.js',[
 ("      pending: null, done: false, end: null, legacy: null,", "      pending: null, done: false, end: null, legacy: null, dna: prime.dna,"),
 ("    me.id = ME_ID; me.weight = prime.weight; me.realMpg = null;", "    me.id = ME_ID; me.weight = prime.weight; me.realMpg = null; me.dna={effects:prime.effects};"),
 ("    me.age = age; me.attrs = ratingsAt(c, age); me.ovr = HL.computeOvr(me.attrs, me.pos);", "    me.age = age; me.attrs = ratingsAt(c, age); me.ovr = HL.computeOvr(me.attrs, me.pos);\n    me.dna={effects:c.prime.effects||{}};"),
 ("    return { attrs, height, weight, pos, tendencies, longevity, primeLength };", "    const entries=Object.entries(st.picks).map(([cat,c])=>({pid:c.row.pid,cat}));\n    return HL.DNA.applyBuild({ attrs, height, weight, pos, tendencies, longevity, primeLength },HL.DNA.analyze(entries));"),
 ("      ${buildDetail(buildPrime())}", "      ${HL.DNA.board(buildPrime().dna)}\n      ${buildDetail(buildPrime())}"),
 ("      <div class=\"t3 sm\">Every drafted attribute contributes to the same player on the court.", "      <div class=\"t3 sm\">Chemistry DNA improves specific possession outcomes. Historical and fictional duos and trios can activate independently; mutations are revealed automatically. Every drafted attribute contributes to the same player on the court."),
])
