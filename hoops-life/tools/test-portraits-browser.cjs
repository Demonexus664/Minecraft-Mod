// Verify every local library photo, then inspect real faces through the game renderer.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'docs/portrait-sources.json')));
const assets = [...manifest.portraits, ...(manifest.additionalPortraits || [])];

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium' });
  try {
    assert.equal(manifest.portraits.length, 596);
    for (const asset of assets) {
      const bytes = fs.readFileSync(path.join(root, asset.src));
      assert.equal(bytes.length, asset.bytes);
      assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), asset.sha256);
    }
    const p = await browser.newPage({ viewport: { width: 1360, height: 950 }, reducedMotion: 'reduce' });
    const errors = []; p.on('pageerror', e => errors.push(e.message));
    await p.goto('http://127.0.0.1:8000/');
    const decoded = await p.evaluate(async assets => {
      const results = await Promise.all(assets.map(async asset => {
        const registered = window.HL_PHOTOS['real.' + asset.slug];
        if (registered?.src !== asset.src) return { name: asset.name, error: 'not registered' };
        const img = new Image(); img.src = registered.src;
        try { await img.decode(); return { name: asset.name, size: `${img.naturalWidth}x${img.naturalHeight}` }; }
        catch { return { name: asset.name, error: 'decode failed' }; }
      }));
      return { results, curry: window.HL_PHOTOS['real.stephen-curry'].src };
    }, assets);
    assert.deepEqual(decoded.results.filter(r => r.error), []);
    assert.equal(decoded.curry, 'media/players/stephen-curry-archive.png');
    decoded.results.forEach((r, i) => assert.equal(r.size, assets[i].size));
    const featured = ['Luka Dončić', 'Giannis Antetokounmpo', 'Anthony Edwards', 'Jayson Tatum', 'Victor Wembanyama', 'Kobe Bryant', 'Shaquille O\'Neal', 'Magic Johnson', 'Larry Bird', 'Kareem Abdul-Jabbar', 'Tim Duncan', 'Kevin Garnett'];
    const chosen = [...assets.filter(a => featured.includes(a.name)), ...manifest.portraits.slice(0, 38)].slice(0, 48);
    await p.evaluate(assets => {
      const esc = HL.UI.esc;
      document.getElementById('app').innerHTML = `<main style="padding:24px;max-width:1300px;margin:auto"><h1>Real faces · local photo library</h1><p>Original NBA archive headshots · reusable team jerseys</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px">${assets.map((a, i) => {
        const team = HL.TEAMS[i % HL.TEAMS.length];
        const player = { name: a.name, nbaId: a.id, real: true, number: (i + 1) % 99, ovr: 82, pos: 'SF' };
        return `<article style="background:#171b22;border-radius:18px;padding:12px;text-align:center">${HL.GFX.figure(player, team)}<strong>${esc(a.name)}</strong></article>`;
      }).join('')}</div></main>`;
      document.querySelectorAll('img').forEach(img => img.loading = 'eager');
    }, chosen);
    await p.waitForFunction(n => document.querySelectorAll('.gfx-head.ok').length === n, chosen.length);
    assert.ok(await p.locator('.gfx-uniform-number').evaluateAll(nums => nums.every(n => {
      const number = n.getBoundingClientRect(), figure = n.closest('.gfx-figure').getBoundingClientRect();
      return number.top >= figure.top && number.bottom <= figure.bottom + 1;
    })), 'Separate jersey numbers must remain inside the portrait');
    await p.screenshot({ path: '/tmp/hoops-real-portrait-gallery.png', fullPage: true });
    await p.setViewportSize({ width: 390, height: 844 });
    assert.ok(await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await p.screenshot({ path: '/tmp/hoops-real-portrait-mobile.png', fullPage: true });
    assert.deepEqual(errors, []);
    console.log(`PASS ${assets.length} source hashes, registered local images and browser decodes; preserved sharp Curry portrait; real faces/team jerseys desktop and mobile`);
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
