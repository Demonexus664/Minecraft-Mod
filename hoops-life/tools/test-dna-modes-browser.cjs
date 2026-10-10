const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium'});try{
 const page=await browser.newPage({viewport:{width:1360,height:1000},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8000');await page.evaluate(()=>HL.RNG.setSeed(176));
 await page.locator('[data-mode="820"]').click();await page.locator('[data-go]').click();
 for(const slot of ['PG','SG','SF','PF','C','B1','B2','B3']){
  await page.locator('[data-spin]').click();await page.waitForFunction(()=>document.querySelectorAll('.hand .gcard.up').length>=1);
  await page.locator('.hand .gcard.up').first().click();await page.locator(`[data-drop=${slot}]`).click();
  if(await page.locator('[data-dna-dismiss]').count())await page.locator('[data-dna-dismiss]').click();
 }
 await page.locator('[data-play]').click();
 await page.waitForFunction(()=>document.querySelector('[data-keep]')||document.querySelector('[data-start-playoffs]'),{},{timeout:120000});
 if(await page.locator('[data-keep]').count())await page.locator('[data-keep]').click();
 await page.locator('[data-start-playoffs]').waitFor({timeout:120000});
 if(await page.locator('.fx-banner').count())await page.locator('.fx-banner').click();
 const season=await page.locator('.caps',{hasText:'Final record'}).locator('..').locator('.num').innerText();
 await page.screenshot({path:'/tmp/hoops-dna-820-season.png',fullPage:true});
 await page.locator('[data-start-playoffs]').click();let games=0,decisions=0;
 while(!await page.locator('[data-finish-playoffs]').count()){
  assert.ok(games<28,'Four best-of-seven rounds must finish within 28 games');await page.locator('[data-playoff-game]').click();games++;
  if(await page.locator('[data-final-possession]').count()){decisions++;await page.locator('[data-final-possession=drive]').click();}
 }
 const log=await page.locator('.scouting-games .kv').allTextContents();assert.equal(log.length,games);
 for(const line of log){const m=line.match(/(?:W|L) (\d+)-(\d+)$/);assert.ok(m,line);assert.notEqual(m[1],m[2],line);}
 await page.screenshot({path:'/tmp/hoops-dna-820-playoffs.png',fullPage:true});await page.locator('[data-finish-playoffs]').click();
 await page.locator('[data-home]').click();await page.locator('[data-mode=skill]').click();await page.locator('[data-go]').click();
 for(let i=0;i<23;i++){
  await page.locator('[data-spin]').click();await page.waitForFunction(()=>document.querySelectorAll('.hand .gcard.up').length>=5,{},{timeout:30000});
  assert.ok(!((await page.locator('.hand').innerText()).includes('&amp;')));await page.locator('.hand .gcard.up').first().click();
  if(await page.locator('[data-dna-dismiss]').count())await page.locator('[data-dna-dismiss]').click();
  if(await page.locator('.fx-banner').count())await page.locator('.fx-banner').click();
 }
 await page.locator('[data-name]').fill('DNA Browser Check');await page.locator('[data-debut]').selectOption('2000');await page.locator('[data-position]').selectOption('SG');
 await page.screenshot({path:'/tmp/hoops-dna-built.png',fullPage:true});await page.locator('[data-begin=season]').click();
 await page.locator('[data-play]').waitFor({timeout:120000});if(await page.locator('.fx-banner').count())await page.locator('.fx-banner').click();await page.locator('[data-play]').click();
 await page.locator('.statstrip').first().waitFor({timeout:120000});if(await page.locator('.fx-banner').count())await page.locator('.fx-banner').click();
 await page.screenshot({path:'/tmp/hoops-dna-career-season.png',fullPage:true});const careerText=await page.locator('.page').innerText();assert.ok(careerText.toLowerCase().includes('dna browser check'),careerText.slice(0,1000));
 assert.deepEqual(errors,[]);console.log(`PASS actual 82-0 draft/season (${season}), ${games} playoff games/${decisions} decisions, all 23 Skill Draft hands, build and first career season`);
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
