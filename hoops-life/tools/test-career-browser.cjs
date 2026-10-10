const assert=require('node:assert/strict');const{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium'});try{
 const page=await browser.newPage({viewport:{width:1360,height:950},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 async function finishGame(){await page.waitForFunction(()=>!document.querySelector('.simveil'));await page.locator('[data-career-reveal-close]').waitFor();const actual=await page.evaluate(()=>HL.League.get().career.gameLog.at(-1));assert.equal(await page.locator('[data-career-reveal-stat="pts"]').innerText(),String(actual.pts));assert.ok((await page.locator('.career-game-reveal').innerText()).includes(actual.score));await page.locator('[data-career-reveal-close]').click();}
 await page.goto('http://127.0.0.1:8000/');await page.locator('[data-mode="career"]').click();
 await page.locator('[data-create="name"]').fill('Rylan Brooks');await page.locator('[data-create="hometown"]').fill('Seattle');
 await page.locator('[data-create="pos"]').selectOption('C');await page.locator('[data-create="arch"]').selectOption('rimbig');await page.locator('[data-create="secondary"]').selectOption('defbig');
 await page.locator('[data-create="height"]').fill('84');await page.locator('[data-create="weight"]').fill('235');await page.locator('[data-create="wingspan"]').fill('87');
 await page.locator('[data-create="number"]').fill('9');await page.locator('[data-career-start]').click();await page.locator('[data-career-next]').waitFor();
 assert.equal(await page.evaluate(()=>HL.League.get().mode),'career');assert.equal(await page.locator('[data-trade-submit]').count(),0);assert.equal(await page.locator('.gfx-head').count(),0,'created player has no portrait');
 await page.locator('[data-career-tab="basketball"]').click();await page.locator('[data-career-action="train"]').click();await page.locator('[data-action-focus]').selectOption('three');await page.locator('[data-action-confirm]').click();assert.ok((await page.locator('.career-choice-feedback').innerText()).includes('Energy −15'));assert.ok((await page.locator('.career-choice-feedback').innerText()).includes('35%'));await page.locator('[data-close]').click();
 await page.locator('[data-career-tend="three"]').fill('80');await page.locator('[data-career-style-save]').click();assert.equal(await page.evaluate(()=>HL.League.get().players[HL.League.get().career.pid].tend.three),80);
 await page.locator('[data-career-tab="life"]').click();await page.locator('[data-career-action="charity"]').click();await page.locator('[data-action-amount]').fill('500');await page.locator('[data-action-confirm]').click();await page.locator('[data-close]').click();
 const before=await page.evaluate(()=>HL.League.get().career.cash);
 await page.locator('[data-career-tab="today"]').click();
 for(let g=0;g<12;g++){await page.locator('[data-career-next]').click();await finishGame();if(await page.evaluate(()=>!!HL.League.get().career.pendingPress))break;}
 assert.ok(await page.evaluate(()=>HL.League.get().career.gameLog.length>0));assert.ok(await page.evaluate(()=>HL.League.get().career.cash)>before);
 await page.locator('[data-career-tab="media"]').click();await page.locator('[data-career-presser="confident"]').click();assert.ok((await page.locator('#career-page').innerText()).includes('20'));
 await page.locator('[data-career-tab="today"]').click();await page.locator('[data-career-next]').click();await finishGame();
 assert.ok(await page.evaluate(()=>HL.League.get().news.some(n=>n.key==='career.prediction')));
 await page.screenshot({path:'/tmp/hoops-career-today.png',fullPage:true});
 const saved=await page.evaluate(()=>HL.Saves.save(HL.League.get()));await page.reload();await page.locator('[data-load]').click();await page.locator(`button[data-load="${saved}"]`).click();
 await page.locator('[data-career-tab="story"]').waitFor();assert.equal(await page.evaluate(()=>HL.League.get().career.identity.name),'Rylan Brooks');
 await page.locator('[data-career-tab="today"]').click();
 for(const total of [299,300,350]){
  await page.evaluate(total=>{const c=HL.League.get().career,last=c.gameLog.at(-1);c.gameLog=Array.from({length:Math.min(total,300)},(_,i)=>({...last,gid:`old-${i}`}));},total);
  if(total===300){const id=await page.evaluate(()=>HL.Saves.save(HL.League.get()));await page.reload();await page.locator('[data-load]').click();await page.locator(`button[data-load="${id}"]`).click();await page.locator('[data-career-next]').waitFor();}
  const count=await page.evaluate(()=>HL.League.get().career.seen.length);
  await page.locator('[data-career-next]').click();await finishGame();
  assert.equal(await page.evaluate(()=>HL.League.get().career.seen.length),count+1,`next-game stops after one actual team game at ${total} prior games`);
 }
 await page.setViewportSize({width:390,height:844});for(const tab of ['today','basketball','people','life','media','story']){await page.locator(`[data-career-tab="${tab}"]`).click();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${tab} mobile overflow`);}
 await page.screenshot({path:'/tmp/hoops-career-story-mobile.png',fullPage:true});
 await page.emulateMedia({reducedMotion:'no-preference'});await page.setViewportSize({width:1360,height:950});await page.locator('[data-career-tab="today"]').click();await page.locator('[data-career-next]').click();await page.locator('[data-career-reveal-close]').waitFor();
 await page.waitForFunction(()=>document.querySelector('[data-career-reveal-stat="pts"]').textContent===String(HL.League.get().career.gameLog.at(-1).pts));
 await page.waitForTimeout(800);await page.screenshot({path:'/tmp/hoops-career-game-reveal.png',fullPage:true});await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:'/tmp/hoops-career-game-reveal-mobile.png',fullPage:true});await page.keyboard.press('Escape');assert.equal(await page.locator('.career-game-reveal').count(),0);assert.deepEqual(errors,[]);
 console.log('PASS detailed career creation, training, real tendency edits, charity, actual games/income, quoted next-game prediction, IndexedDB mode restore, next-game stopping at the 300-game log limit and six mobile tabs');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
