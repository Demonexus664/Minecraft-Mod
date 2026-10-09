// Draft classes (generated prospects for future years) and NBA headshot ID lookup.
window.HL = window.HL || {};

HL.normName = (n) => n.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
HL.lookupNbaId = (name) => (HL.NBA_IDS && HL.NBA_IDS[HL.normName(name)]) || null;

HL.Draft = {
  generateClass(year, n = 70) {
    const R = HL.RNG;
    const out = [];
    const archs = Object.keys(HL.ARCHETYPES);
    for (let i = 0; i < n; i++) {
      const pos = R.pick(HL.POSITIONS);
      const baseH = { PG: 75, SG: 77, SF: 79, PF: 81, C: 83 }[pos];
      const height = Math.round(baseH + R.normal(0, 1.6));
      const age = R.weighted([19, 20, 21, 22, 23], a => ({ 19: 30, 20: 25, 21: 20, 22: 15, 23: 10 })[a]);
      // A few elite prospects each year, a long tail of projects.
      const tier = R.random();
      let ovr = tier < 0.03 ? R.int(74, 80) : tier < 0.15 ? R.int(68, 74) : tier < 0.5 ? R.int(60, 68) : R.int(50, 61);
      ovr -= Math.max(0, 21 - age) * 0;
      let arch = R.pick(archs);
      if ((pos === 'PG' || pos === 'SG') && ['rimbig', 'postbig', 'defbig', 'pointcenter', 'stretchbig', 'unicorn'].includes(arch)) arch = R.pick(['scorer', 'playmaker', 'sniper', 'defguard', 'slasher']);
      if ((pos === 'C') && ['playmaker', 'defguard', 'sniper', 'scorer', 'slasher'].includes(arch)) arch = R.pick(['rimbig', 'defbig', 'stretchbig', 'unicorn', 'postbig']);
      const name = `${R.pick(HL.NAMES.first)} ${R.pick(HL.NAMES.last)}`;
      const potential = Math.min(99, Math.round(ovr + (24 - age) * R.range(2, 5) + R.normal(4, 5)));
      const p = HL.createPlayer({ name, pos, age, height, ovr, arch, teamId: null, season: year, real: false, potential });
      p.yearsPro = 0;
      p.prospect = { year, college: R.pick(HL.COLLEGES) };
      out.push(p);
    }
    return out;
  },
};

HL.COLLEGES = ['Duke', 'Kentucky', 'Kansas', 'North Carolina', 'UCLA', 'Gonzaga', 'Arizona', 'Villanova', 'Michigan State', 'UConn', 'Baylor', 'Houston', 'Auburn', 'Alabama', 'Tennessee', 'Texas', 'Arkansas', 'Indiana', 'Purdue', 'Michigan', 'Ohio State', 'Florida', 'Syracuse', 'Georgetown', 'Louisville', 'Memphis', 'USC', 'Oregon', 'Iowa State', 'Creighton', 'Marquette', 'Overtime Elite', 'G League Ignite', 'Real Madrid (Spain)', 'Partizan (Serbia)', 'ASVEL (France)', 'NBL Next Stars (Australia)', 'Mega Basket (Serbia)', 'Baskonia (Spain)', 'Fenerbahçe (Turkey)'];
