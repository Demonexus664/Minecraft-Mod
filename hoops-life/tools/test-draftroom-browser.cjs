// Serve hoops-life at port 8000. Exercises visible scouting, draft, save/resume and season entry.
const assert=require('node:assert/strict');const{chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium'});
 try{
 const page=await browser.newPage({viewport:{width:1360,height:950},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8000/');await page.locator('[data-mode="franchise"]').click();
 await page.locator('[data-quick="1983"]').count().then(async n=>{if(n)await page.locator('[data-quick="1983"]').click();else await page.locator('[data-season]').selectOption('1983');});
 await page.locator('[data-team="CHI"]').click();await page.locator('[data-start]').click();
 await page.locator('[data-sec="office"]').click();await page.locator('[data-page="draft"]').click();
 await page.locator('[data-draft-prepare]').click();await page.locator('[data-prospect]').first().waitFor();
 const jordan=await page.evaluate(()=>HL.League.get().draftRoom.prospects.find(p=>p.name==='Michael Jordan').id);
 await page.locator(`[data-prospect="${jordan}"]`).click();await page.locator('[data-scout="workout"]').click();await page.locator('[data-scout="interview"]').click();await page.locator('[data-shortlist]').click();
 assert.ok((await page.locator('[role="dialog"]').innerText()).includes('Private evaluation'));await page.locator('[data-close]').click();
 assert.equal(await page.evaluate(()=>HL.League.get().draftRoom.sessions),10);
 await page.evaluate(()=>{const L=HL.League.get();L.phase='offseason';L.teams.forEach((t,i)=>{t.w=i+10;t.l=82-t.w;});L.playoffs={field:{East:[],West:[]}};});
 await page.locator('[data-page="draft"]').click();await page.locator('[data-draft-lottery]').click();
 await page.locator('[data-lottery-reveal]').click();assert.equal(await page.evaluate(()=>HL.League.get().draftRoom.revealed),1);
 const order=await page.evaluate(()=>HL.League.get().draftRoom.lottery.order),save=await page.evaluate(()=>HL.Saves.save(HL.League.get()));
 await page.reload();await page.locator('[data-load]').click();await page.locator(`button[data-load="${save}"]`).click();
 await page.locator('[data-sec="office"]').click();await page.locator('[data-page="draft"]').click();
 assert.equal(await page.evaluate(()=>HL.League.get().draftRoom.revealed),1);assert.deepEqual(await page.evaluate(()=>HL.League.get().draftRoom.lottery.order),order);
 await page.locator('[data-lottery-skip]').click();await page.locator('[data-draft-to-own]').click();
 // Choose an actually available prospect after AI picks. No fixture changes to the class or pick position.
 const own=await page.evaluate(()=>HL.DraftRoom.current(HL.League.get()).teamId),chosen=await page.locator('[data-prospect]').first().getAttribute('data-prospect');
 assert.equal(own,await page.evaluate(()=>HL.League.get().userTeamId));
 await page.locator('[data-prospect]').first().click();await page.locator('[data-draft-select]').click();
 assert.ok((await page.locator('[role="dialog"]').innerText()).toLowerCase().includes('selection confirmed'));await page.locator('[data-close]').click();
 const deal=await page.evaluate(id=>HL.League.get().players[id].contract,+chosen);
 await page.locator('[data-draft-finish]').click();assert.equal(await page.evaluate(()=>HL.League.get().draftRoom.stage),'complete');
 await page.screenshot({path:'/tmp/hoops-draft-night.png',fullPage:true});
 await page.locator('[data-sim="advance"]').click();await page.waitForFunction(()=>HL.League.get().season===1984);
 assert.equal(await page.evaluate(id=>HL.League.get().players[id].teamId,+chosen),own);assert.deepEqual(await page.evaluate(id=>HL.League.get().players[id].contract,+chosen),deal);
 await page.evaluate(()=>{const L=HL.League.get();let days=0;while(!L.world.watches.filter(w=>w.kind==='draftRookie').every(w=>w.resolved)&&days++<30)HL.League.simDay();});
 assert.ok(await page.evaluate(()=>HL.League.get().news.some(n=>n.key==='draft.rookie_opportunity')));
 await page.locator('[data-sec="office"]').click();await page.locator('[data-page="draft"]').click();
 await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 await page.screenshot({path:'/tmp/hoops-draft-mobile.png',fullPage:true});
 await page.evaluate(()=>HL.League.get().settings.role='coach');await page.locator('[data-page="draft"]').click();
 assert.equal(await page.locator('[data-scout]').count(),0);assert.deepEqual(errors,[]);
 console.log('PASS visible historical scouting, shortlist, lottery save/resume, user pick, completion, season ownership/deal, actual rookie follow-up and mobile/coach screens');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
