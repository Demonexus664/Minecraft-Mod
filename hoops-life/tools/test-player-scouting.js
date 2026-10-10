const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), {load} = require('./load');
const seasons = fs.readdirSync(__dirname + '/../data/history/seasons').filter(f => /^\d{4}(?:-aba)?\.js$/i.test(f));
const HL = load(['js/core/rng.js', 'js/league/ratings.js', 'js/league/player.js', 'js/league/teams.js', 'js/league/history.js', 'data/history/index.js', ...seasons.map(f => 'data/history/seasons/' + f)]);
HL.UI = {esc: String}; load(['js/modes/challenge820.js']);
function row(name, year) { const r = HL.History.seasonRows(String(year)).find(r => HL.HISTORY.players[r.pid][0] === name); assert.ok(r, `${name} ${year}`); return r; }
function attrs(name, year) { return HL.historicalAttributes(row(name, year)); }
test('Curry mechanics measure his release and touch without penalizing his short frame', () => {
  const r = row('Stephen Curry', 2015), a = HL.historicalAttributes(r);
  assert.ok(a.releaseSpeed >= 99 && a.shotArc >= 99, `Curry release ${a.releaseSpeed}, touch ${a.shotArc}`);
  assert.ok(a.releaseHeight < 80, 'Actual release elevation remains distinct from technique');
  assert.ok(HL.Challenge.skillValue({row:r}, ['jumper', 'Jump shot mechanics', ['releaseSpeed','releaseHeight','shotArc']]) >= 99);
});
test('individually scouted historical specialists possess their defining tools', () => {
  for (const [name, year, key, minimum] of [
    ['Klay Thompson',2015,'releaseSpeed',98], ['Ray Allen',2000,'three',95], ['Reggie Miller',1995,'releaseSpeed',96],
    ['Larry Bird',1985,'shotArc',98], ['Dirk Nowitzki',2010,'fade',99], ['Hakeem Olajuwon',1993,'footwork',99],
    ['Kevin McHale',1986,'post',97], ['Gary Payton',1995,'perD',97], ['Bill Russell',1964,'helpD',98],
    ['Ben Wallace',2003,'intD',97], ['Dennis Rodman',1991,'boxout',99], ['Steve Nash',2005,'passingAccuracy',98],
    ['Allen Iverson',2000,'agility',98], ['Tony Parker',2012,'floater',97], ['Nikola Jokić',2022,'vision',99],
    ['Kyle Korver',2014,'releaseSpeed',95], ['Shane Battier',2007,'helpD',94], ['Bruce Bowen',2004,'perD',95],
  ]) assert.ok(attrs(name,year)[key] >= minimum, `${name} ${year}: ${key}=${attrs(name,year)[key]}`);
});
test('Curry develops, post-injury Klay loses mobility, and shooters keep real weaknesses', () => {
  assert.ok(attrs('Stephen Curry',2009).releaseSpeed < attrs('Stephen Curry',2015).releaseSpeed);
  assert.ok(attrs('Klay Thompson',2022).lateral < attrs('Klay Thompson',2015).lateral);
  const shaq=attrs("Shaquille O'Neal",2000), curry=attrs('Stephen Curry',2015), nash=attrs('Steve Nash',2005);
  assert.ok(shaq.three < 45 && shaq.ft < 65); assert.ok(curry.str < 85 && curry.block < 65); assert.ok(nash.perD < 75);
  assert.ok(attrs('Bill Russell',1964).three < 65);
});
test('scouting corrections are inspectable and shared by independently mutable roster players', () => {
  const r=row('Hakeem Olajuwon',1993), a=HL.historicalAttributes(r), original=r.attrs;
  assert.ok(HL.historicalScouting(r).some(n=>n.reason.includes('Dream Shake')));
  const p=HL.History.makePlayer(r,1993,1); assert.equal(p.attrs.footwork,a.footwork);
  p.attrs.footwork=25; assert.equal(HL.historicalAttributes(r).footwork,100); assert.equal(r.attrs,original);
});
test('every authored scouting note resolves to a real archive player and season', () => {
  const bios=Object.entries(HL.HISTORY.players), archive=seasons.flatMap(f=>HL.History.seasonRows(f.replace('.js','')));
  for(const n of HL.HISTORICAL_SCOUTING) {
    const pid=bios.find(([,b])=>b[0]===n.player)?.[0]; assert.ok(pid, n.player);
    assert.ok(archive.some(r=>r.pid===pid&&r.g>=15&&r.seasonStart>=n.from&&r.seasonStart<=n.through), `${n.player} ${n.from}–${n.through}`);
    assert.ok(n.reason.length>25);
    for(const [k,v] of Object.entries({...n.grades,...n.ceilings})) assert.ok(HL.ATTR_KEYS.includes(k)&&Number.isInteger(v)&&v>=25&&v<=100,`${n.player}: ${k}=${v}`);
  }
});
test('all archive grades are valid and no scouting note invents pre-line three-point accuracy', () => {
  let count=0;
  for(const f of seasons) for(const r of HL.History.seasonRows(f.replace('.js',''))) {
    const a=HL.historicalAttributes(r), base=HL.History.unpack(r.attrs,HL.HISTORY.attrs);
    for(const k of HL.ATTR_KEYS) assert.ok(Number.isInteger(a[k])&&a[k]>=25&&a[k]<=100,`${f} ${r.pid} ${k}=${a[k]}`);
    if(r.seasonStart<1979) assert.equal(a.three,base.three, `${r.pid}: preserve archive pre-line projection`);
    count++;
  }
  assert.ok(count>25000);
});
test('unknown, tiny-sample and unlabelled rows cannot receive a famous prime by accident', () => {
  const r=row('Stephen Curry',2015);
  assert.equal(HL.historicalScouting({...r,pid:'missing'}).length,0);
  assert.equal(HL.historicalScouting({...r,g:4}).length,0);
  assert.equal(HL.historicalScouting({...r,seasonStart:undefined}).length,0);
  assert.equal(HL.historicalScouting({...r,seasonStart:2008}).length,0);
});


test('second individual audit restores overlooked pre-modern and ABA basketball skills', () => {
  for (const [name, year, skill, minimum] of [
    ['Maurice Stokes', 1956, 'vision', 96],
    ['Dave DeBusschere', 1968, 'perD', 99],
    ['Jerry Sloan', 1968, 'perD', 98],
    ['Pete Maravich', 1975, 'handle', 100],
    ['Earl Monroe', 1968, 'shotCreation', 99],
    ['James Worthy', 1987, 'transition', 99],
    ['Joe Dumars', 1987, 'perD', 99],
    ['Dražen Petrović', 1992, 'releaseSpeed', 98],
    ['Mitch Richmond', 1996, 'mid', 96],
    ['Ralph Sampson', 1984, 'contestD', 97],
  ]) assert.ok(attrs(name, year)[skill] >= minimum, name + ' ' + year + ': ' + skill);
});

test('new hand-scored seasons retain missing three-point lines and injury boundaries', () => {
  const pistol=row('Pete Maravich',1975);
  assert.equal(attrs('Pete Maravich',1975).three,HL.History.unpack(pistol.attrs,HL.HISTORY.attrs).three);
  const early=attrs('Ralph Sampson',1984),later=attrs('Ralph Sampson',1987);
  assert.ok(early.contestD > later.contestD, 'Sampson must not inherit healthy peak coverage after injury');
  assert.equal(HL.historicalScouting(row('Ralph Sampson',1987)).length,0);
  assert.ok(attrs('Maurice Stokes',1956).three<65);
  assert.ok(attrs('Joe Dumars',1987).three<65, 'early Dumars cannot inherit late-career shooting');
  assert.ok(attrs('Joe Dumars',1996).three>=94, 'later Dumars develops his outside shot');
});
