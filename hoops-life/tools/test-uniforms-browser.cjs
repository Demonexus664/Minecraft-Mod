// Serve hoops-life on port 8000. This also writes two inspectable 15-team galleries.
const {chromium}=require('playwright');const assert=require('node:assert/strict');
(async()=>{
 const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium'});
 try {
 const p=await b.newPage({viewport:{width:1360,height:1050}});
 const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:8000/');
 assert.equal(await p.evaluate(()=>Object.keys(HL_UNIFORMS).length),30);
 assert.ok(await p.evaluate(()=>HL.TEAMS.every(t=>HL_UNIFORMS[t.abbr.toLowerCase()])));
 for(let half=0;half<2;half++){
  await p.evaluate(half=>{
   const ps=[{name:'Stephen Curry',nbaId:201939,real:true,number:30},{name:'LeBron James',nbaId:2544,real:true,number:23}];
   document.getElementById('app').innerHTML=`<main class="page"><div class="page-title"><h2>Reusable team jerseys</h2><span class="t2">Original headshots · Each team's own photographic garment · Separate numbers</span></div><div style="display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px">${HL.TEAMS.slice(half*15,half*15+15).map((t,i)=>`<article><div class="gfx" style="background:#20242c">${HL.GFX.figure(ps[i%2],t)}</div><h3 style="margin-top:6px;font-size:18px">${t.city} ${t.name}</h3></article>`).join('')}</div></main>`;
  },half);
  await p.waitForFunction(()=>document.querySelectorAll('.gfx-head.ok img').length===15&&document.querySelectorAll('.gfx-uniform.ready img').length===15);
  assert.equal(await p.locator('.gfx-uniform-tint').count(),0);
  assert.equal(await p.locator('svg').count(),0);
  assert.ok(await p.locator('.gfx-uniform img').evaluateAll(imgs=>imgs.every(i=>i.naturalWidth>1000)));
  assert.equal(new Set(await p.locator('.gfx-uniform img').evaluateAll(imgs=>imgs.map(i=>i.src))).size,15);
  await p.screenshot({path:`/tmp/hoops-jerseys-${half+1}.png`,fullPage:true});
 }
 await p.setViewportSize({width:1000,height:950});
 await p.evaluate(()=>{
  const t=HL.TEAMS.find(t=>t.abbr==='BOS');
  document.getElementById('app').innerHTML=`<main class="page"><div class="page-title"><h2>One jersey. Different players.</h2></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:28px">${[{name:'Stephen Curry',nbaId:201939,real:true,number:11,ovr:95,pos:'PG'},{name:'LeBron James',nbaId:2544,real:true,number:6,ovr:92,pos:'SF'}].map(p=>HL.GFX.playerCard(p,t)).join('')}</div></main>`;
 });
 await p.waitForFunction(()=>document.querySelectorAll('.gfx-head.ok img').length===2&&document.querySelectorAll('.gfx-uniform.ready img').length===2);
 await p.screenshot({path:'/tmp/hoops-jersey-reuse.png',fullPage:true});
 assert.deepEqual(errors,[]);
 console.log('PASS all 30 photographic jerseys loaded on actual headshots; same template reused for different players');
 } finally { await b.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
