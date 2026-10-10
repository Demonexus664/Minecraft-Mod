// Start python3 -m http.server 8000 from hoops-life, then run this file with Node.
// Requires Playwright and Chromium (both provided by the cloud environment).
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://127.0.0.1:8000/', { waitUntil: 'domcontentloaded' });
    await page.locator('[data-mode="franchise"]').click();
    await page.locator('[data-team="LAL"]').click();
    await page.locator('[data-start]').click();
    await page.locator('[data-sec="league-office"]').click();
    assert.ok((await page.locator('#page').innerText()).includes('Full-contact defense'));
    assert.ok(!(await page.locator('#page').innerText()).includes('Tackling'));
    await page.locator('[data-rule-select="backcourtSeconds"]').selectOption('10');
    // The visible switch is the label; the native checkbox is intentionally hidden.
    await page.locator('label.switch').filter({ has: page.locator('[data-rule="offensiveThreeSeconds"]') }).click();
    await page.locator('label.switch').filter({ has: page.locator('[data-rule="defensiveThreeSeconds"]') }).click();
    await page.locator('label.switch').filter({ has: page.locator('[data-rule="illegalDefense"]') }).click();
    await page.locator('[data-rule-num="shotClockReset"]').fill('9');
    await page.locator('[data-rule-num="shotClockReset"]').press('Tab');
    await page.locator('[data-rule-num="bonusFouls"]').fill('0');
    await page.locator('[data-rule-num="bonusFouls"]').press('Tab');
    const expected = { backcourtSeconds: 10, offensiveThreeSeconds: false, defensiveThreeSeconds: false, illegalDefense: true, shotClockReset: 9, bonusFouls: 0 };
    assert.deepEqual(await page.evaluate(keys => Object.fromEntries(keys.map(k => [k, HL.League.get().rules[k]])), Object.keys(expected)), expected);
    await page.locator('[data-rule-num="shotClockReset"]').fill('');
    await page.locator('[data-rule-num="shotClockReset"]').press('Tab');
    assert.equal(await page.locator('[data-rule-num="shotClockReset"]').inputValue(), '9');
    assert.equal(await page.evaluate(() => HL.League.get().ruleHistory.length), 6);
    console.log('PASS grouped controls, full-contact label, rule changes and empty-number handling');

    await page.locator('[data-sim="next"]').click();
    await page.locator('[role="dialog"]').waitFor();
    const facts = await page.evaluate(() => Object.values(HL.League.get().boxScores).flatMap(g => g.events.clockResets));
    assert.ok(facts.length > 0);
    assert.ok(facts.every(r => r.seconds === 9 && r.duration <= 9));
    await page.locator('[data-close]').click();
    const id = await page.evaluate(() => HL.Saves.save(HL.League.get()));
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.locator('[data-load]').click();
    await page.locator(`button[data-load="${id}"]`).click();
    await page.locator('[data-sec="league-office"]').click();
    assert.deepEqual(await page.evaluate(keys => Object.fromEntries(keys.map(k => [k, HL.League.get().rules[k]])), Object.keys(expected)), expected);
    assert.equal(await page.locator('[data-rule-num="bonusFouls"]').inputValue(), '0');
    assert.equal(await page.locator('[data-rule-select="backcourtSeconds"]').inputValue(), '10');
    console.log('PASS sim uses edited rules and IndexedDB reload preserves controls and history');
    await page.locator('[data-sec="home"]').click();
    await page.locator('[data-page="news"]').click();
    assert.ok((await page.locator('#page').innerText()).includes('Backcourt time limit'));
    assert.ok((await page.locator('#page').innerText()).includes('ownership'));
    assert.deepEqual(errors, []);
    console.log('PASS rule-change news and reactions render without browser errors');
  } finally {
    await browser.close();
  }
})().catch(e => { console.error(e); process.exitCode = 1; });
