// Seeded RNG so simulations are reproducible from a save.
window.HL = window.HL || {};

HL.RNG = (function () {
  let seed = (Date.now() ^ 0x9e3779b9) >>> 0;

  function next() {
    // mulberry32
    seed = (seed + 0x6d2b79f5) >>> 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  const api = {
    setSeed(s) { seed = s >>> 0; },
    getSeed() { return seed; },
    random: next,
    range(min, max) { return min + next() * (max - min); },
    int(min, max) { return Math.floor(min + next() * (max - min + 1)); },
    chance(p) { return next() < p; },
    pick(arr) { return arr[Math.floor(next() * arr.length)]; },
    // Normal distribution via Box-Muller.
    normal(mean = 0, sd = 1) {
      let u = 0, v = 0;
      while (u === 0) u = next();
      while (v === 0) v = next();
      return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    },
    weighted(items, weightFn) {
      let total = 0;
      const ws = items.map(i => { const w = Math.max(0, weightFn(i)); total += w; return w; });
      let r = next() * total;
      for (let i = 0; i < items.length; i++) { r -= ws[i]; if (r <= 0) return items[i]; }
      return items[items.length - 1];
    },
    shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },
  };
  return api;
})();

HL.clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
