// Save slots in IndexedDB (leagues grow ~250KB per season, too big for localStorage).
window.HL = window.HL || {};

HL.Saves = (function () {
  const DB = 'hoops-life', STORE = 'saves';
  let dbp = null;
  function db() {
    if (dbp) return dbp;
    dbp = new Promise((res, rej) => {
      const req = indexedDB.open(DB, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'id' });
      req.onsuccess = () => res(req.result);
      req.onerror = () => rej(req.error);
    });
    return dbp;
  }
  async function tx(mode, fn) {
    const d = await db();
    return new Promise((res, rej) => {
      const t = d.transaction(STORE, mode);
      const r = fn(t.objectStore(STORE));
      t.oncomplete = () => res(r && r.result);
      t.onerror = () => rej(t.error);
    });
  }

  return {
    async save(league, slotId) {
      league.rngSeed = HL.RNG.getSeed();
      league.nextPid = HL.nextPlayerId();
      const t = league.userTeamId != null ? league.teams[league.userTeamId] : null;
      const id = slotId || league.saveId || ('save-' + Date.now());
      league.saveId = id;
      const rec = {
        id, mode: league.mode || 'franchise', savedAt: Date.now(),
        label: `${league.mode === 'career' && league.career ? league.players[league.career.pid].name + ' · ' : ''}${t ? t.city + ' ' + t.name : 'League'} · ${league.season}-${String(league.season + 1).slice(2)}`,
        teamAbbr: t ? t.abbr : null, season: league.season, phase: league.phase,
        record: t ? `${t.w}-${t.l}` : '',
        data: JSON.stringify(league),
      };
      await tx('readwrite', s => s.put(rec));
      return id;
    },
    async list() {
      const all = await tx('readonly', s => s.getAll());
      return (all || []).map(({ data, ...meta }) => meta).sort((a, b) => b.savedAt - a.savedAt);
    },
    async load(id) {
      const rec = await tx('readonly', s => s.get(id));
      if (!rec) return null;
      const league = JSON.parse(rec.data);
      HL.RNG.setSeed(league.rngSeed || Date.now());
      HL.League.set(league);
      return league;
    },
    async remove(id) { await tx('readwrite', s => s.delete(id)); },
    exportFile(league) {
      const blob = new Blob([JSON.stringify(league)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `hoops-life-${league.season}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    },
  };
})();
