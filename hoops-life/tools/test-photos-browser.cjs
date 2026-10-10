// Serve hoops-life on port 8000. Photo fixtures keep assertions independent of CDN availability.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');
const pixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64');
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium' });
  try {
    const page = await browser.newPage();
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.route('**/headshots/**', route => route.fulfill({ contentType: 'image/png', body: pixel }));
    await page.route('**/assets/test-photo.png', route => route.fulfill({ contentType: 'image/png', body: pixel }));
    await page.route('**/assets/missing-photo.png', route => route.fulfill({ status: 404, body: '' }));
    await page.goto('http://127.0.0.1:8000/');
    await page.evaluate(() => {
      const p = { id: 1, name: 'Stephen Curry', nbaId: 201939, real: true, ovr: 95, pos: 'PG', number: 30 };
      const t = { name: 'Lakers', city: 'Los Angeles', abbr: 'LAL', bref: 'LAL', color: '#552583', color2: '#fdb927' };
      const gsw = { ...t, name: 'Warriors', abbr: 'GSW', bref: 'GSW' };
      window.HL_ASSETS = { 'real.stephen-curry.lal.2025': 'test-photo.png' };
      document.getElementById('app').innerHTML = `<div id="exact">${HL.GFX.figure(p, t, { season: 2025 })}</div><div id="archive">${HL.GFX.playerCard(p, gsw, { season: 2024 })}</div><div id="created">${HL.GFX.jerseyCard({ ...p, nbaId: null, real: false }, t)}</div>`;
    });
    await page.locator('#exact .gfx-head.ok').waitFor();
    assert.ok((await page.locator('#exact img').getAttribute('src')).endsWith('assets/test-photo.png'));
    assert.equal(await page.locator('#exact svg, #archive svg, #created svg').count(), 0, 'Player art must not use drawn faces, bodies or rays');
    assert.ok((await page.locator('#archive').innerText()).includes('Composite portrait'));
    assert.ok((await page.locator('#created').innerText()).includes('30'));
    await page.evaluate(() => {
      const team = { name: 'Celtics', abbr: 'BOS', color: '#007a33', color2: '#ffffff' };
      document.getElementById('app').innerHTML = `<div id="first">${HL.GFX.figure({ name: 'Stephen Curry', nbaId: 201939, real: true, number: 11 }, team)}</div><div id="second">${HL.GFX.figure({ name: 'LeBron James', nbaId: 2544, real: true, number: 6 }, team)}</div>`;
    });
    assert.equal(await page.locator('#first .gfx-uniform').count(), 1, 'A blank photographic jersey should be reused with this actual headshot');
    const garment = await page.locator('#first .gfx-uniform img').getAttribute('src');
    assert.equal(await page.locator('#second .gfx-uniform img').getAttribute('src'), garment);
    assert.equal(await page.locator('#first .gfx-uniform-number').innerText(), '11');
    assert.equal(await page.locator('#second .gfx-uniform-number').innerText(), '6');
    await page.locator('#first .gfx-head.ok').waitFor();
    await page.locator('#first .gfx-uniform.ready').waitFor();
    assert.ok(await page.locator('#first .gfx-uniform').isVisible());
    assert.equal(await page.locator('.gfx-uniform-tint').count(), 0, 'Each team has its own jersey artwork instead of a tinted white template');
    assert.equal(await page.locator('#first .gfx-head img').getAttribute('src'), 'media/players/stephen-curry-archive.png');
    assert.equal(await page.locator('svg').count(), 0);
    await page.evaluate(() => {
      const p = { name: 'Stephen Curry', nbaId: 201939, real: true };
      const t = { name: 'Lakers', abbr: 'LAL', color: '#552583', color2: '#fdb927' };
      window.HL_ASSETS = { 'real.stephen-curry.lal': 'missing-photo.png' };
      document.getElementById('app').innerHTML = HL.GFX.figure(p, t);
    });
    await page.locator('.gfx-head.ok').waitFor();
    assert.ok((await page.locator('.gfx-head img').getAttribute('src')).includes('cdn.nba.com'));
    assert.ok((await page.locator('.gfx-photo-credit').innerText()).includes('Archive photo'));
    await page.route('**/headshots/**', route => route.fulfill({ status: 404, body: '' }));
    await page.evaluate(() => { document.getElementById('app').innerHTML = HL.GFX.figure({ name: 'No Photo Player', nbaId: 99999 }, null) + HL.UI.face({ name: 'Created Player' }); });
    await page.waitForFunction(() => !document.querySelector('.gfx-head img'));
    assert.ok((await page.locator('.gfx-placeholder').innerText()).includes('NP'));
    assert.equal(await page.locator('svg').count(), 0);
    assert.deepEqual(errors, []);
    console.log('PASS real-photo graphics, team/season overrides, broken-photo fallback and created-player identity');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
