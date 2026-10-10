const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({executablePath:'/usr/bin/chromium'});try{
 const page=await browser.newPage({viewport:{width:1360,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8000');
 await page.evaluate(async()=>{await HL.History.load('2015');const es=['curryst01','thompkl01','greendr01'].map((pid,i)=>({pid,cat:['PG','SG','PF'][i],season:2015,row:HL.History.seasonRows('2015').find(r=>r.pid===pid)}));await HL.DNAFX.reveal(HL.DNA.analyze(es,{mode:'team'}).mutations[0]);});
 assert.equal(await page.locator('.dna-reveal').getAttribute('data-stage'),'ingredients');
 assert.equal(await page.locator('.dna-fusion-ingredients .gcard').count(),3);
 await page.locator('.dna-reveal[data-stage=result]').waitFor({timeout:10000});
 await page.waitForFunction(()=>{const e=document.querySelector('.dna-fusion-output');return e&&getComputedStyle(e).transform==='matrix(1, 0, 0, 1, 0, 0)';});
 await page.screenshot({path:'/tmp/hoops-dna-fusion-shooting.png',fullPage:true});
 assert.ok((await page.locator('.dna-fusion-result').innerText()).includes('Draymond'));
 await page.keyboard.press('Escape');assert.equal(await page.locator('.dna-reveal').count(),0);
 for(const family of ['interior','defense']){
  await page.evaluate(async family=>{await Promise.all(['1999','2012','2023'].map(y=>HL.History.load(y)));const spec=family==='interior'?[['onealsh01','strength',1999],['onealsh01','inside',1999],['onealsh01','body',1999]]:[['wembavi01','intD',2023],['jamesle01','iq',2012],['jamesle01','speed',2012],['wembavi01','body',2023]];const es=spec.map(([pid,cat,season])=>({pid,cat,season,row:HL.History.seasonRows(String(season)).find(r=>r.pid===pid)}));await HL.DNAFX.reveal(HL.DNA.analyze(es).mutations[0]);},family);
  assert.equal(await page.locator('.dna-reveal').getAttribute('data-family'),family);await page.locator('.dna-reveal[data-stage=interact]').waitFor();await page.screenshot({path:`/tmp/hoops-dna-fusion-${family}.png`,fullPage:true});await page.locator('[data-dna-skip]').click();await page.locator('.dna-fusion-result').waitFor();await page.locator('[data-dna-continue]').click();
 }
 await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>HL.DNAFX.reveal(HL.DNA.analyze([{pid:'curryst01',cat:'three'},{pid:'thompkl01',cat:'jumper'}]).pairs[0]));assert.equal(await page.locator('.dna-reveal').count(),0,'Minor chemistry must not interrupt drafting');
 await page.locator('[data-mode=skill]').click();await page.locator('[data-go]').click();
 for(let i=0;i<5;i++){
  await page.locator('[data-spin]').click();await page.locator('.hand .gcard').first().waitFor();
  await page.waitForFunction(()=>document.querySelectorAll('.hand .gcard.up').length>=5);
  const widths=await page.locator('.hand .gcard').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().width));assert.ok(widths.length>=5&&widths.every(w=>w>=100),JSON.stringify(widths));
  await page.locator('.hand .gcard.up').first().click();await page.locator('[data-spin]').waitFor();
 }
 await page.setViewportSize({width:390,height:844});await page.locator('[data-spin]').click();await page.waitForFunction(()=>document.querySelectorAll('.hand .gcard.up').length>=5);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:'/tmp/hoops-dna-hand-mobile.png',fullPage:true});
 await page.locator('.hand .gcard.up').first().click();await page.evaluate(()=>{HL.FX.reels=async()=>{throw new Error('Animation unavailable');};});await page.locator('[data-spin]').click();await page.waitForFunction(()=>document.querySelectorAll('.hand .gcard.up').length>=5,{},{timeout:5000});await page.locator('.hand .gcard.up').first().click();await page.locator('[data-spin]').waitFor();assert.deepEqual(errors,[]);
 console.log('PASS fusion stages/ingredients/explanation/Escape, noninterrupting chemistry and six repeated visible draft hands including mobile');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
