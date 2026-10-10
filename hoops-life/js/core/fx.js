// Game feel: slot reels, card flips, particle bursts, screen shake, count-ups, big banners and a tiny
// synth for sounds (mutable). Strong effects are kept for big moments; reduced-motion users get the
// results without the motion.
window.HL = window.HL || {};

HL.FX = (function () {
  const reduced = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = ms => new Promise(r => setTimeout(r, reduced() ? Math.min(ms, 60) : ms));
  const levels=['full','lite','off'];
  function fxLevel(){
    try {const val=localStorage.getItem('hl-fx-level');return levels.includes(val)?val:'full';}
    catch{return 'full';}
  }
  function setFxLevel(level){
    if(!levels.includes(level))return;
    try{localStorage.setItem('hl-fx-level',level);}catch{}
    document.documentElement.setAttribute('data-fx-level',level);
  }

  // ---------- sound (WebAudio blips, no files) ----------
  let ctx=null,master=null;
  function volume(){
    try{const raw=+localStorage.getItem('hl-volume');return Number.isFinite(raw)?Math.max(0,Math.min(1,raw)):.75;}
    catch{return .75;}
  }
  function setVolume(level){
    const safe=Math.max(0,Math.min(1,Number(level)||0));
    try{localStorage.setItem('hl-volume',String(safe));}catch{}
    if(master)master.gain.value=safe;
    return safe;
  }
  function audioGraph(){
    const Audio=window.AudioContext||window.webkitAudioContext;
    if(!Audio)return null;
    if(ctx)return ctx;
    ctx=new Audio();
    const compressor=ctx.createDynamicsCompressor();
    compressor.threshold.value=-18;compressor.knee.value=19;
    compressor.ratio.value=3.3;compressor.attack.value=.003;compressor.release.value=.18;
    master=ctx.createGain();master.gain.value=volume();
    compressor.connect(master);master.connect(ctx.destination);
    ctx._hlMix=compressor;
    return ctx;
  }
  const soundOn = () => { try { return localStorage.getItem('hl-sound') !== 'off'; } catch (e) { return true; } };
  function setSound(on) { try { localStorage.setItem('hl-sound', on ? 'on' : 'off'); } catch (e) { /* storage unavailable */ } }
  function tone(freq, dur = 0.08, type = 'square', vol = 0.04, slide = 0) {
    if (!soundOn()) return;
    try {
      if(!audioGraph())return;
      if(ctx.state==='suspended')ctx.resume().catch(()=>{});
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.value = freq;
      if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), ctx.currentTime + dur);
      g.gain.setValueAtTime(.0001,ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(Math.max(.00011,vol),ctx.currentTime+Math.min(.008,dur*.2));
      g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+dur);
      o.connect(g);g.connect(ctx._hlMix);
      o.onended=()=>{try{o.disconnect();g.disconnect();}catch{}};
      o.start(); o.stop(ctx.currentTime + dur + 0.02);
    } catch (e) { /* audio unavailable */ }
  }

  // A short filtered noise transient adds actual texture to impacts, whistles
  // and ball swishes. Nodes are disconnected automatically after playback.
  function noise(dur=.16,vol=.023,cutoff=1800) {
    if(!soundOn())return;
    try{
      if(!audioGraph())return;
      if(ctx.state==='suspended')ctx.resume().catch(()=>{});
      const length=Math.max(1,Math.round(ctx.sampleRate*dur));
      const buffer=ctx.createBuffer(1,length,ctx.sampleRate),data=buffer.getChannelData(0);
      for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*(1-i/length);
      const src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();
      filter.type='lowpass';filter.frequency.value=cutoff;src.buffer=buffer;
      gain.gain.setValueAtTime(vol,ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+dur);
      src.connect(filter);filter.connect(gain);gain.connect(ctx._hlMix);
      src.onended=()=>{try{src.disconnect();filter.disconnect();gain.disconnect();}catch{}};
      src.start();src.stop(ctx.currentTime+dur+.02);
    }catch{}
  }
  const schedules={
    shooting:[[180,0,'sine'],[660,115,'triangle'],[988,250,'sine'],[1320,380,'sine']],
    interior:[[80,0,'triangle'],[117,140,'sawtooth'],[78,270,'sine'],[59,420,'triangle']],
    defense:[[240,0,'sawtooth'],[182,115,'sawtooth'],[121,245,'triangle'],[94,410,'sine']],
    flight:[[210,0,'sine'],[315,125,'triangle'],[570,255,'sine'],[960,380,'sine']]
  };
  function fusionSound(family='shooting',stage='interact') {
    if(!soundOn())return;
    const melody=schedules[family]||schedules.shooting;
    if(stage==='interact'){
      noise(.21,.013,family==='defense'?600:2200);
      tone(melody[0][0],.25,melody[0][2],.044,120);
    }else if(stage==='climax'){
      const base=family==='interior'?72:family==='defense'?94:family==='flight'?150:126;
      tone(base,.52,'sawtooth',.049,-55);noise(.31,.038,800);
      melody.slice(1,3).forEach(([f,ms,type])=>setTimeout(()=>tone(f,.19,type,.033,140),ms/2));
    }else if(stage==='result'){
      noise(.12,.013,4800);
      melody.forEach(([f,ms,type],i)=>setTimeout(()=>tone(f,i===3?.52:.22,type,.034,75),ms));
    }
  }

  const sfx = {
    tick: () => tone(1400, 0.025, 'square', 0.015),
    land: () => { tone(220, 0.12, 'triangle', 0.08, -80); },
    flip: () => tone(700, 0.05, 'triangle', 0.03, 300),
    pop: (tier = 0) => { const base = [523, 587, 659, 784, 988][tier] || 523; tone(base, 0.12, 'triangle', 0.06); setTimeout(() => tone(base * 1.5, 0.16, 'triangle', 0.05), 70); },
    win: () => tone(880, 0.05, 'sine', 0.025),
    loss: () => tone(160, 0.12, 'sawtooth', 0.03),
    fanfare: () => [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => tone(f, i === 3 ? 0.5 : 0.14, 'triangle', 0.07), i * 120)),
    boo: () => [392, 330, 262].forEach((f, i) => setTimeout(() => tone(f, 0.22, 'sawtooth', 0.04), i * 180)),
    ui: () => tone(720+Math.random()*55,.038,'sine',.013,95),
    draft: () => { tone(180,.13,'triangle',.05,-65);setTimeout(()=>tone(440,.12,'sine',.027,185),85); },
    swish: () => {tone(860,.085,'sine',.027,-380);setTimeout(()=>tone(1300,.055,'triangle',.018,-640),55);},
    clutch: () => {tone(94,.24,'sawtooth',.044,52);setTimeout(()=>tone(208,.19,'triangle',.045,220),125);},
    rival: () => {tone(144,.28,'sawtooth',.046,-22);setTimeout(()=>tone(286,.12,'triangle',.028,340),160);},
    achievement: () => [523,659,784,988,1175].forEach((f,i)=>
      setTimeout(()=>tone(f,i===4?.44:.10,'triangle',.03),i*94)),
    camera:()=>{noise(.067,.035,3200);tone(680,.028,'square',.016,-250);},
    fusion: fusionSound,
    arena: (moment='win')=>{
      if(moment==='clutch'){noise(.19,.017,3600);tone(195,.17,'triangle',.035,100);}
      else if(moment==='loss'){noise(.34,.025,460);tone(110,.28,'sawtooth',.036,-45);}
      else {noise(.31,.024,2400);[196,294,392].forEach((f,i)=>setTimeout(()=>tone(f,.2,'triangle',.028),i*85));}
    },
  };

  // ---------- rarity tiers ----------
  const TIERS = [
    { key: 'bronze', name: 'Bronze', min: 0, colors: ['#b0703a', '#e0a46b'] },
    { key: 'silver', name: 'Silver', min: 77, colors: ['#9aa4b2', '#e9eef5'] },
    { key: 'gold', name: 'Gold', min: 84, colors: ['#c99a2e', '#ffe08a'] },
    { key: 'diamond', name: 'Diamond', min: 90, colors: ['#3fd0ff', '#d7f6ff'] },
    { key: 'legend', name: 'Legend', min: 95, colors: ['#ff4fd8', '#ffd84f', '#4fffb0'] },
  ];
  const tierOf = r => TIERS.slice().reverse().find(t => r >= t.min) || TIERS[0];
  const tierIndex = r => TIERS.indexOf(tierOf(r));

  // ---------- particles ----------
  function burst(el, colors = ['#ffd84f', '#fff'], n = 28, spread = 1) {
    if (!el || reduced()||fxLevel()==='off') return;
    n=fxLevel()==='lite'?Math.min(15,Math.ceil(n*.45)):n;
    const r = el.getBoundingClientRect();
    const layer = document.createElement('div');
    layer.className = 'fx-layer';
    layer.style.left = (r.left + r.width / 2) + 'px'; layer.style.top = (r.top + r.height / 2) + 'px';
    for (let i = 0; i < n; i++) {
      const s = document.createElement('i');
      const a = Math.random() * Math.PI * 2, d = (60 + Math.random() * 140) * spread;
      s.style.setProperty('--dx', Math.cos(a) * d + 'px'); s.style.setProperty('--dy', Math.sin(a) * d + 'px');
      s.style.background = colors[i % colors.length];
      s.style.animationDelay = (Math.random() * 80) + 'ms';
      layer.appendChild(s);
    }
    document.body.appendChild(layer);
    setTimeout(() => layer.remove(), 1100);
  }
  function shake(el = document.querySelector('.page'), strength = 1) {
    if (!el || reduced()||fxLevel()!=='full') return;
    el.style.setProperty('--shake', strength * 6 + 'px');
    el.classList.remove('fx-shake'); void el.offsetWidth; el.classList.add('fx-shake');
    setTimeout(() => el.classList.remove('fx-shake'), 400);
  }
  function flash(color = '#fff') {
    if (reduced()||fxLevel()!=='full') return;
    const f = document.createElement('div');
    f.className = 'fx-flash'; f.style.background = color;
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 450);
  }
  function countUp(el, to, ms = 900, fmt = v => Math.round(v)) {
    if (!el) return;
    if (reduced()||fxLevel()==='off') { el.textContent = fmt(to); return; }
    const from = parseFloat(el.dataset.from || '0'), t0 = performance.now();
    const step = (t) => { const k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3); el.textContent = fmt(from + (to - from) * e); if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }

  // ---------- slot reels ----------
  // reels: [{ items: [html, ...], final: index }] -> resolves when the last reel lands.
  async function reels(host, list, opts = {}) {
    host.innerHTML = `<div class="reels">${list.map((r, i) => `<div class="reel" data-i="${i}"><div class="reel-label">${r.label || ''}</div><div class="reel-win"><div class="reel-strip"></div></div></div>`).join('')}</div>`;
    const ITEM = opts.itemHeight || 96;
    const jobs = list.map((r, i) => new Promise(resolve => {
      const win = host.querySelectorAll('.reel')[i];
      const strip = win.querySelector('.reel-strip');
      const spins = 18 + i * 7;
      const seq = [];
      for (let k = 0; k < spins; k++) seq.push(r.items[Math.floor(Math.random() * r.items.length)]);
      seq.push(r.items[r.final]);
      strip.innerHTML = seq.map(h => `<div class="reel-item" style="height:${ITEM}px">${h}</div>`).join('');
      const dur = reduced()||fxLevel()==='off'?50:fxLevel()==='lite'?Math.round((1100+i*450)*.65):1100+i*450;
      strip.style.transition = 'none'; strip.style.transform = 'translateY(0)';
      void strip.offsetHeight;
      strip.style.transition = `transform ${dur}ms cubic-bezier(.15,.7,.2,1.04)`;
      strip.style.transform = `translateY(-${(seq.length - 1) * ITEM}px)`;
      // Ticks slow down with the reel.
      let t = 0, gap = 40;
      const tick = () => { if (t > dur - 120) return; sfx.tick(); t += gap; gap *= 1.12; setTimeout(tick, gap); };
      if (!reduced()&&fxLevel()==='full') tick();
      setTimeout(() => { win.classList.add('landed'); sfx.land(); burst(win, opts.colors || ['#ffd84f', '#ffffff'], 10, 0.5); resolve(); }, dur);
    }));
    await Promise.all(jobs);
  }

  // ---------- cards ----------
  async function flipIn(cards, opts = {}) {
    const list = Array.from(cards);
    if(reduced()||fxLevel()==='off'){for(const c of list){c.classList.remove('down','charging');c.classList.add('up');}return;}
    for (const c of list) {
      const tier = +(c.dataset.tier || 0);
      // Rare pulls get a beat of suspense and a glow before they turn.
      if (tier >= 3 && !reduced()) { c.classList.add('charging'); sfx.tick(); await wait(tier === 4 ? 650 : 380); }
      c.classList.remove('down', 'charging'); c.classList.add('up');
      sfx.flip();
      if (tier >= 2) setTimeout(() => sfx.pop(tier), 120);
      if (tier >= 3) setTimeout(() => { burst(c, tier === 4 ? ['#ff4fd8', '#ffd84f', '#4fffb0', '#fff'] : ['#3fd0ff', '#d7f6ff', '#fff'], tier === 4 ? 46 : 26); if (tier === 4) { shake(document.querySelector('.page'), 1); flash('rgba(255,216,79,.35)'); } }, 160);
      await wait(opts.gap || 230);
    }
  }
  // Pointer tilt for cards.
  function tilt(root) {
    if (reduced()||fxLevel()==='off') return;
    root.querySelectorAll('.gcard').forEach(c => {
      c.onpointermove = (e) => { const r = c.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; c.style.setProperty('--rx', (-y * 14) + 'deg'); c.style.setProperty('--ry', (x * 16) + 'deg'); c.style.setProperty('--mx', (x + 0.5) * 100 + '%'); c.style.setProperty('--my', (y + 0.5) * 100 + '%'); };
      c.onpointerleave = () => { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); };
    });
  }

  // ---------- banners ----------
  function banner(title, sub = '', opts = {}) {
    return new Promise(resolve => {
      const tier = opts.tier ?? 2;
      const el = document.createElement('div');
      el.className = `fx-banner tier-${tier}`;
      el.innerHTML = `<div class="fxb-rays"></div><div class="fxb-box"><div class="fxb-kicker">${opts.kicker || ''}</div><div class="fxb-title">${title}</div>${sub ? `<div class="fxb-sub">${sub}</div>` : ''}<div class="fxb-hint">Click to continue</div></div>`;
      document.body.appendChild(el);
      const colors = tier >= 4 ? ['#ff4fd8', '#ffd84f', '#4fffb0', '#fff'] : tier === 3 ? ['#3fd0ff', '#fff', '#ffd84f'] : tier <= 0 ? ['#888', '#555'] : ['#ffd84f', '#fff'];
      setTimeout(() => burst(el.querySelector('.fxb-title'), colors, tier >= 3 ? 70 : 30, 1.6), 150);
      if (tier >= 3) { sfx.fanfare(); flash('rgba(255,255,255,.25)'); } else if (tier <= 0) sfx.boo(); else sfx.pop(2);
      let done = false;
      const close = () => { if (done) return; done = true; el.classList.add('out'); setTimeout(() => { el.remove(); resolve(); }, 250); };
      el.onclick = close;
      setTimeout(close, opts.ms || 2600);
    });
  }

  function soundToggle() {
    return '<button class="btn small quiet" data-sound title="Toggle sound" aria-pressed="'+
      (soundOn()?'true':'false')+'">'+(soundOn()?'Sound on':'Sound off')+'</button>'+
      '<label class="fx-selector">FX <select data-fx-level aria-label="Visual effects intensity">'+
      levels.map(id=>'<option value="'+id+'" '+(fxLevel()===id?'selected':'')+'>'+
        (id==='full'?'Cinematic':id==='lite'?'Light':'Off')+'</option>').join('')+
      '</select></label>'+
      '<label class="sound-level">VOL <input type="range" data-volume min="0" max="100" step="5" aria-label="Sound effects volume" value="'+Math.round(volume()*100)+'"></label>';
  }
  const boundRoots=new WeakSet();
  function bindSound(root) {
    if(document.documentElement.getAttribute('data-fx-level')!==fxLevel())
      document.documentElement.setAttribute('data-fx-level',fxLevel());
    const effect=root.querySelector('[data-fx-level]');
    if(effect)effect.onchange=()=>setFxLevel(effect.value);
    const audioVolume=root.querySelector('[data-volume]');
    if(audioVolume)audioVolume.oninput=()=>setVolume(+audioVolume.value/100);
    const b=root.querySelector('[data-sound]');
    if(b)b.onclick=()=>{
      setSound(!soundOn());
      b.textContent=soundOn()?'Sound on':'Sound off';
      b.setAttribute('aria-pressed',soundOn()?'true':'false');
      if(soundOn())sfx.pop(1);
    };
    // Delegate to the persistent app root; repeated screen renders never stack
    // duplicate listeners. Give deliberate menu choices tactile feedback.
    if(!boundRoots.has(root)){
      boundRoots.add(root);
      root.addEventListener('click',event=>{
        const el=event.target.closest?.('button,[data-drop],.gcard');
        if(el&&!el.disabled&&!el.matches('[data-sound]')&&!el.closest('.ticker'))sfx.ui();
      },{passive:true});
    }
  }

  return { sfx, TIERS, tierOf, tierIndex, burst, shake, flash, countUp, reels, flipIn, tilt, banner, wait, soundToggle, bindSound, reduced,fxLevel,setFxLevel,volume,setVolume };
})();

// Game cards (collectible style) for real player-seasons.
HL.Cards = (function () {
  const U = HL.UI, esc = s => U.esc(s);
  // o: { pid, name, nbaId, season, team (meta), pos, rating, stat: [[label, value], ...], hidden, down, extra }
  function card(o) {
    const tier = HL.FX.tierOf(o.rating);
    const ti = HL.FX.TIERS.indexOf(tier);
    const p = { name: o.name, nbaId: o.nbaId, real: true, id: o.pid || o.name };
    const fig = HL.GFX.figure(p, o.team, { season: o.season });
    return `<div class="gcard t-${tier.key} ${o.down ? 'down' : 'up'} ${o.cls || ''}" data-tier="${ti}" ${o.attrs || ''} style="--c:${o.team ? U.teamAccent(o.team).c : '#444'}">
      <div class="gc-inner">
        <div class="gc-back"><div class="gc-back-mark">HL</div></div>
        <div class="gc-front">
          <div class="gc-shine"></div>
          <div class="gc-top"><div class="gc-ovr">${o.hidden ? '?' : o.rating}<span>${esc(o.ratingLabel || 'OVR')}</span></div><div class="gc-pos">${esc(o.pos || '')}</div>${o.team ? `<div class="gc-logo">${U.logo(o.team, 26)}</div>` : ''}</div>
          <div class="gc-art">${fig}</div>
          <div class="gc-plate"><div class="gc-name">${esc(o.name)}</div><div class="gc-meta">${esc(o.meta || '')}</div>
            ${o.stat && o.stat.length ? `<div class="gc-stats">${o.stat.map(([k, v]) => `<div><b>${o.hidden ? '?' : v}</b><span>${esc(k)}</span></div>`).join('')}</div>` : ''}
            <div class="gc-tier">${tier.name}</div></div>
        </div>
      </div>
    </div>`;
  }
  return { card };
})();
