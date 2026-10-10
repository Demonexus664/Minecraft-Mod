// Serve hoops-life on port 8000 before running; requires Playwright and Chromium.
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1360, height: 900 } });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://127.0.0.1:8000/', { waitUntil: 'domcontentloaded' });
    await page.locator('[data-mode="franchise"]').click();
    await page.locator('[data-team="LAL"]').click(); await page.locator('[data-start]').click();
    await page.locator('[data-sec="office"]').click();
    assert.ok((await page.locator('#page').innerText()).toLowerCase().includes('trade desk'));
    // A controlled roster fixture isolates UI decisions from real roster cap differences.
    const fixture = await page.evaluate(() => {
      const L = HL.League.get(); L.settings.salaryCap = 1000;
      const mine = L.userTeamId, other = L.teams.find(t => t.id !== mine).id;
      const ps = Object.values(L.players).filter(p => p.teamId === mine), theirs = Object.values(L.players).filter(p => p.teamId === other);
      const a = ps[ps.length - 1], b = theirs[theirs.length - 1];
      for (const p of [a, b]) { p.ovr = 75; p.potential = 80; p.age = 27; p.contract.amount = 6; p.injury = null; p.pos = 'PG'; }
      const fa = HL.createPlayer({ name: 'Browser Free Agent', teamId: null, ovr: 60, age: 28, season: L.season });
      L.players[fa.id] = fa; L.nextPid = HL.nextPlayerId();
      return { mine, other, send: a.id, receive: b.id, waive: ps[ps.length - 2].id, fa: fa.id };
    });
    await page.locator('[data-page="trades"]').click();
    await page.locator('[data-trade-team]').selectOption(String(fixture.other));
    await page.locator(`[data-trade-send="${fixture.send}"]`).click();
    await page.locator('[data-trade-find]').click();
    assert.ok(await page.locator('[data-found-offer]').count() > 0);
    await page.locator(`[data-trade-receive="${fixture.receive}"]`).click();
    await page.locator('[data-trade-submit]').click();
    await page.locator('[role="dialog"]').waitFor();
    assert.equal(await page.evaluate(id => HL.League.get().players[id].teamId, fixture.receive), fixture.mine);
    assert.equal(await page.evaluate(id => HL.League.get().players[id].teamId, fixture.send), fixture.other);
    await page.locator('[data-close]').click();
    console.log('PASS visible trade selection, Finder, AI acceptance and new-team announcement');

    await page.locator('[data-page="freeagency"]').click();
    await page.locator(`[data-waive="${fixture.waive}"]`).click();
    await page.locator('[data-confirm-waive]').click();
    await page.locator('[data-close]').click();
    assert.equal(await page.evaluate(id => HL.League.get().players[id].teamId, fixture.waive), null);
    await page.locator('[data-market-search]').fill('Browser Free Agent');
    await page.locator(`[data-negotiate="${fixture.fa}"]`).click();
    await page.locator('[data-offer-amount]').fill('0.01');
    await page.locator('[data-offer-submit]').click();
    assert.ok((await page.locator('[data-offer-response]').innerText()).includes('minimum'));
    assert.equal(await page.evaluate(id => HL.League.get().players[id].teamId, fixture.fa), null);
    await page.locator('[data-offer-amount]').fill('10');
    await page.locator('[data-offer-years]').selectOption('2');
    await page.locator('[data-offer-submit]').click();
    assert.ok((await page.locator('[role="dialog"]').innerText()).toLowerCase().includes('deal complete'));
    await page.locator('[data-close]').click();
    assert.equal(await page.evaluate(id => HL.League.get().players[id].teamId, fixture.fa), fixture.mine);
    await page.locator('[data-page="finances"]').click();
    assert.ok((await page.locator('#page').innerText()).includes('Browser Free Agent'));
    console.log('PASS failed and successful contract negotiation, actual roster and payroll');

    const id = await page.evaluate(() => HL.Saves.save(HL.League.get()));
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.locator('[data-load]').click(); await page.locator(`button[data-load="${id}"]`).click();
    await page.locator('[data-sec="office"]').click(); await page.locator('[data-page="finances"]').click();
    assert.equal(await page.evaluate(pid => HL.League.get().players[pid].contract.amount, fixture.fa), 10);
    assert.ok((await page.locator('#page').innerText()).includes('Browser Free Agent'));
    await page.setViewportSize({ width: 390, height: 844 });
    for (const pg of ['trades', 'freeagency', 'finances']) {
      await page.locator(`[data-page="${pg}"]`).click();
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${pg} overflows mobile viewport`);
    }
    await page.screenshot({ path: '/tmp/hoops-frontoffice-mobile.png', fullPage: true });
    await page.evaluate(() => { HL.League.get().settings.role = 'coach'; });
    await page.locator('[data-page="trades"]').click();
    assert.ok((await page.locator('#page').innerText()).includes('delegates roster decisions'));
    assert.equal(await page.locator('[data-trade-submit]').count(), 0);
    await page.locator('[data-sec="team"]').click();
    await page.locator('[data-page="people"]').click();
    await page.locator(`[data-person="${fixture.fa}"]`).click();
    await page.locator('[data-conversation="promiseMinutes"]').click();
    assert.ok((await page.locator('[data-conversation-response]').innerText()).includes('remember'));
    await page.locator('[data-close]').click();
    for (let i = 0; i < 3; i++) {
      await page.locator('[data-sim="next"]').click();
      await page.locator('[role="dialog"]').waitFor();
      await page.locator('[data-close]').click();
    }
    assert.ok(await page.evaluate(pid => HL.League.get().world.watches.some(w => w.pid === pid && w.kind === 'minutesPromise' && w.resolved), fixture.fa));
    assert.ok(await page.evaluate(() => HL.League.get().news.some(n => n.key === 'people.minutes_promise')));
    await page.screenshot({ path: '/tmp/hoops-people-mobile.png', fullPage: true });
    assert.deepEqual(errors, []);
    console.log('PASS IndexedDB reload, coach inspection, responsive screens, conversations and promises resolved by real games');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
