const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium'});try{
 const p=await b.newPage({viewport:{width:1360,height:950},reducedMotion:'reduce'}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:8000');
 await p.locator('[data-mode=career]').click();await p.locator('[data-career-start]').click();await p.locator('[data-career-tab=media]').click();
 await p.locator('[data-post-compose]').click();await p.locator('[data-post-topic]').selectOption('challenge');await p.locator('[data-post-confirm]').click();await p.locator('[data-close]').click();
 assert.equal(await p.evaluate(()=>HL.PlayerPosts.entries(HL.League.get())[0].status),'watching');assert.equal(await p.locator('.player-post-created img').count(),0);
 await p.locator('[data-career-tab=today]').click();await p.locator('[data-career-next]').click();await p.locator('[data-career-reveal-close]').click();await p.locator('[data-career-tab=media]').click();
 assert.equal(await p.evaluate(()=>HL.PlayerPosts.entries(HL.League.get()).find(e=>e.pid===HL.League.get().career.pid).status),'resolved');
 for(let i=0;i<5&&await p.locator('[data-post-reply=support]').count()===0;i++){await p.locator('[data-career-tab=today]').click();await p.locator('[data-career-next]').click();await p.locator('[data-career-reveal-close]').click();await p.locator('[data-career-tab=media]').click();}
 await p.locator('[data-post-reply=support]').first().click();await p.waitForFunction(()=>HL.PlayerPosts.entries(HL.League.get()).some(e=>e.reply?.choice==='support'));
 const id=await p.evaluate(()=>HL.Saves.save(HL.League.get()));await p.reload();await p.locator('[data-load]').click();await p.locator(`button[data-load="${id}"]`).click();await p.locator('[data-career-tab=media]').click();
 assert.equal(await p.evaluate(()=>HL.PlayerPosts.entries(HL.League.get()).filter(e=>e.reply).length),1);await p.screenshot({path:'/tmp/hoops-player-voices.png',fullPage:true});
 await p.setViewportSize({width:390,height:844});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await p.screenshot({path:'/tmp/hoops-player-voices-mobile.png',fullPage:true});
 await p.evaluate(()=>HL.App.title());await p.locator('[data-mode=franchise]').click();await p.locator('[data-team=GSW]').click();await p.locator('[data-start]').click();await p.locator('[data-page=news]').click();await p.locator('[data-post-compose]').click();
 const curry=await p.evaluate(()=>HL.League.teamPlayers(HL.League.get().userTeamId).find(q=>q.name==='Stephen Curry').id);await p.locator('[data-post-speaker]').selectOption(String(curry));await p.locator('[data-post-confirm]').click();await p.locator('[data-close]').click();
 assert.ok((await p.locator('.player-post-card').first().innerText()).includes('Stephen Curry'));await p.locator('.player-post-photo .gfx-head.ok').first().waitFor();assert.ok((await p.locator('.player-post-photo .gfx-head img').first().getAttribute('src')).includes('stephen-curry-archive'));
 await p.evaluate(id=>HL.League.get().players[id].number=12,curry);await p.locator('[data-page=news]').click();assert.equal(await p.locator('.player-post-photo .gfx-uniform-number').first().innerText(),'30');
 assert.deepEqual(errors,[]);console.log('PASS Career named-matchup statement/actual assessment, NPC reply, saved thread, faceless identity, mobile and Franchise Curry photo post');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
