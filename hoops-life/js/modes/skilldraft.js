// Skill Draft Career: build one player out of real players' skills, simulate the whole career
// in the real league, and get a verdict measured against every real NBA career (legacy score).
window.HL = window.HL || {};

HL.SkillDraft = (function () {
  const U = HL.UI, esc = U.esc, R = HL.RNG, FX = HL.FX;
  const C = () => HL.Challenge;
  // Every rolled card represents one independently useful basketball tool.
  // All 29 player ratings have an owning category, so the final build cannot
  // silently drop a trait or average away a star's strength.
  const CATS = [
    ['inside','Inside & contact',['close','layup','dunk','post','contactFinish','floater','footwork']],
    ['mid','Mid-range & fade',['mid','fade']],
    ['three','Three-point accuracy',['three']],
    ['ft','Free throws',['ft']],
    ['pass','Passing & vision',['pass','vision','passingAccuracy']],
    ['handle','Handle & creation',['handle','shotCreation']],
    ['perD','Perimeter defense',['perD','lateral','agility']],
    ['intD','Interior & help defense',['intD','block','helpD','contestD']],
    ['steal','Steal skill',['steal']],
    ['reb','Rebounding & boxout',['oreb','dreb','boxout']],
    ['speed','Speed & acceleration',['speed','accel','transition']],
    ['vert','Vertical & explosiveness',['vert','burst']],
    ['strength','Strength & screens',['str','screen']],
    ['jumper','Jump shot mechanics',['releaseSpeed','releaseHeight','shotArc']],
    ['contested','Tough & clutch shots',['contested','clutchShot']],
    ['iq','Basketball IQ',['iq']],
    ['motor','Stamina & hustle',['dur','stam','hustle']],
    ['body','Body (height & frame)',[]],
    ['tendScorer','Scorer mentality',['usage','shotHunt','iso','pullUp','lateGame']],
    ['tendShot','Shot decisions & preferences',['three','mid','drive','post','catchShoot','transition','attackMismatch']],
    ['tendTeam','Team & defense habits',['passFirst','moveBall','riskyPass','crash','crashGlass','gamble','contest','foulAggr','drawFoul','foulDiscipline','effort']],
    ['longevity','Longevity',[]],
    ['primeLength','Prime duration',[]],
  ];
  const catOf = id => CATS.find(c => c[0] === id);
  const avgOf = (attrs, keys) => keys.length ? Math.round(keys.reduce((s, k) => s + attrs[k], 0) / keys.length) : 0;
  let st = null;

  // Debut: a real draft year. Random debuts leave room for a full career inside the real data.
  const randomDebut = () => R.int(1956, HL.LATEST_SEASON - 14);
  function newRun(mode, debut, draftStyle = 'original') {
    cache=null;futureWorld=null;
    HL.DNAFX?.reset();
    HL.FusionUI?.reset();
    st = { mode, draftStyle, debut: debut || randomDebut(), picks: {}, team: null, decade: null, cat: null, hand: [], phase: 'spin', skips: { team: 2, era: 2, stat: 2, all: 2 }, career: null, name: 'Your Player', pos: 'auto', selected: null, skillChoices: null, rosterQuery: '', rosterPage: 0, rosterSort: 'rating',fusionEquipped:null };
  }
  const remaining = () => CATS.filter(c => !st.picks[c[0]]).map(c => c[0]);
  const decades = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];

  const SHORT={inside:'INSIDE',mid:'MID',three:'3PT',ft:'FT',pass:'VISION',handle:'HANDLE',perD:'PER D',intD:'RIM D',steal:'STEAL',reb:'BOARDS',speed:'SPEED',vert:'VERT',strength:'POWER',jumper:'RELEASE',contested:'TOUGH',iq:'IQ',motor:'MOTOR',body:'FRAME',tendScorer:'USAGE',tendShot:'SHOT IQ',tendTeam:'HABITS',longevity:'LONGEVITY',primeLength:'PRIME'};
  // The BODY category is a physical frame measure, never a disguised OVR.
  const skillValue = (c, cat) => C().skillValue(c, cat);

  // Spin the three reels (team, decade, skill), deal a hand of five from that club and decade, flip it.
  async function spin(what = 'all') {
    if (st.draftStyle === 'free') return spinFree(what);
    const run=st;
    st.phase = 'reeling';
    if (what === 'all' || what === 'stat') st.cat = R.pick(remaining().filter(c => c !== st.cat || remaining().length === 1));
    if (what === 'all' || what === 'era') st.decade = R.pick(decades.filter(d => d !== st.decade));
    await C().loadDecade(st.decade);
    if(st!==run)return;
    const fr = C().franchisesIn(st.decade);
    if (what === 'all' || what === 'team' || !fr.includes(st.team)) st.team = R.pick(fr.filter(t => t !== st.team || fr.length === 1));
    // The five highest skill scores in the drawn team/era, ordered best-first.
    // Never substitute high overall players or draw random reserves.
    st.hand = C().dealSkillHand(st.team, st.decade, catOf(st.cat));
    // The ordinary hand remains the actual top five. On rare rolls a bonus
    // legendary card appears as a sixth option from outside the team/decade.
    const wild=await HL.Legends.wildcard(catOf(st.cat), Object.values(st.picks).map(c=>c.row.pid));
    if(st!==run)return;
    if(wild && !st.hand.some(c=>c.row.pid===wild.row.pid))st.hand.push(wild);
    render();
    const host = document.querySelector('#reels');
    const teams = HL.TEAMS.map(t => t.abbr);
    const decs = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];
    if (host) await FX.reels(host, [
      { label: 'Franchise', items: teams.map(a => `<div>${U.logo(tm(a), 62)}</div>`), final: teams.indexOf(st.team) },
      { label: 'Decade', items: decs.map(d => `<div>${d}s</div>`), final: decs.indexOf(st.decade) },
      { label: 'Skill', items: CATS.map(c => `<div class="txt">${esc(c[1])}</div>`), final: CATS.findIndex(c => c[0] === st.cat) },
    ], { colors: [U.teamAccent(tm(st.team)).c, '#ffd84f', '#fff'] }).catch(()=>U.toast('The reel animation was skipped. Your cards are ready.'));
    if(st!==run)return;
    st.phase = 'hand';
    render(true);
  }


  // Unlike the Original Draft's five specialist cards (and the 82-0 min-20-
  // game candidate filter), this mode lists EVERY player recorded with the
  // franchise in the decade, including brief appearances. Each player appears
  // once; their skill choices may use different team-season years.
  const freeRosterCache = new Map();
  function freeRosterCandidates(franchise, decade) {
    const key = franchise + ':' + decade;
    if (freeRosterCache.has(key)) return freeRosterCache.get(key);
    const best = new Map();
    for (const yr of HL.HISTORY.seasons) {
      if (yr.includes('-') || Math.floor(+yr / 10) * 10 !== decade || !HL.HISTORY_SEASONS[yr]) continue;
      for (const row of HL.History.seasonRows(yr)) {
        const teamStint = row.stints.find(t => C().LINEAGE[t[0]] === franchise && t[1] > 0);
        if (!teamStint) continue;
        const candidate = { row, season:+yr, club:teamStint[0] };
        const old = best.get(row.pid);
        if (!old || HL.historicalSeasonOvr(candidate.row) > HL.historicalSeasonOvr(old.row))
          best.set(row.pid, candidate);
      }
    }
    const players = [...best.values()].sort((a,b) =>
      HL.historicalSeasonOvr(b.row) - HL.historicalSeasonOvr(a.row));
    freeRosterCache.set(key, players);
    return players;
  }

  // Free Choice drafts spin only franchise and decade. Every qualifying player
  // is selectable, rather than restricting the hand to five specialists.
  async function spinFree(what = 'all') {
    const run = st;
    if (!run || !['spin', 'hand'].includes(run.phase)) return;
    run.phase = 'reeling';
    run.selected = null; run.skillChoices = null; run.rosterQuery = ''; run.rosterPage = 0;
    if (!run.decade || what === 'all' || what === 'era')
      run.decade = R.pick(decades.filter(d => d !== run.decade || decades.length === 1));
    try {
      await C().loadDecade(run.decade);
      if (st !== run) return;
      const franchises = C().franchisesIn(run.decade);
      if (!franchises.length) throw new Error('This decade has no eligible franchises');
      if (what === 'all' || what === 'team' || !franchises.includes(run.team))
        run.team = R.pick(franchises.filter(f => f !== run.team || franchises.length === 1));
      run.hand = freeRosterCandidates(run.team, run.decade);
      render();
      const host = document.querySelector('#reels');
      if (host) {
        const teams = HL.TEAMS.map(t => t.abbr);
        await FX.reels(host, [
          { label: 'Franchise', items: teams.map(a => '<div>' + U.logo(tm(a), 62) + '</div>'), final: teams.indexOf(run.team) },
          { label: 'Decade', items: decades.map(d => '<div>' + d + 's</div>'), final: decades.indexOf(run.decade) },
        ], { colors: [U.teamAccent(tm(run.team)).c, '#ffd84f'] }).catch(() => U.toast('Reels skipped; your full roster is ready.'));
      }
      if (st !== run) return;
      run.phase = 'hand';
      render(true);
    } catch (e) {
      if (st !== run) return;
      console.error(e);
      run.phase = 'spin';
      run.hand = [];
      U.toast('Unable to load that franchise and decade. Try another spin.');
      render();
    }
  }

  // Once a player is selected, identify their *best qualifying season* for
  // each unfilled tool. Do not use that player's highest OVR year for every skill.
  function freePlayerSkills(player) {
    const seasons = HL.HISTORY.seasons.filter(k =>
      !k.includes('-') && Math.floor(+k / 10) * 10 === st.decade && HL.HISTORY_SEASONS[k]);
    const career = [];
    for (const key of seasons) for (const row of HL.History.seasonRows(key)) {
      if (row.pid !== player.row.pid) continue;
      const club = row.stints.find(t => C().LINEAGE[t[0]] === st.team && t[1] > 0);
      if (club) career.push({ row, season: +key, club: club[0] });
    }
    const choices = {};
    for (const id of remaining()) {
      const cat = catOf(id);
      const best = career.reduce((chosen, option) =>
        !chosen || skillValue(option, cat) > skillValue(chosen, cat) ||
          (skillValue(option, cat) === skillValue(chosen, cat) &&
            HL.historicalSeasonOvr(option.row) > HL.historicalSeasonOvr(chosen.row))
          ? option : chosen, null);
      if (best) choices[id] = best;
    }
    return choices;
  }

  function chooseFreePlayer(i) {
    if (st.phase !== 'hand' || st.draftStyle !== 'free') return;
    const player = st.hand[i];
    if (!player) return;
    st.selected = player;
    st.skillChoices = freePlayerSkills(player);
    st.phase = 'choose-skill';
    render();
  }

  function take(i) {
    const c = st.hand[i];
    if (!c || st.phase !== 'hand') return;
    if(c.legendary) {st.wildCandidate=c;st.phase='wildchoice';render();return;}
    finishPick(c,st.cat);
  }
  function finishPick(c,category) {
    if (!c || !remaining().includes(category)) return;
    const oldDna=HL.DNA.analyze(Object.entries(st.picks).map(([cat,pk])=>({pid:pk.row.pid,cat,row:pk.row,season:pk.season})));
    const cat=catOf(category);
    st.picks[category] = c;
    const v = skillValue(c, cat);
    FX.sfx.pop(FX.tierIndex(v));
    const id = category;
    st.hand = []; st.cat = null;st.wildCandidate=null;st.selected=null;st.skillChoices=null;
    st.phase = remaining().length ? 'spin' : 'built';
    render();
    const tile = document.querySelector(`.tile[data-cat="${id}"]`);
    if (tile) { tile.classList.add('pop'); FX.burst(tile, FX.tierOf(v).colors.concat('#fff'), FX.tierIndex(v) >= 3 ? 30 : 12, 0.6); }
    const dna=HL.DNA.analyze(Object.entries(st.picks).map(([cat,pk])=>({pid:pk.row.pid,cat,row:pk.row,season:pk.season})));
    const fresh=dna.mutations.find(m=>!oldDna.mutations.some(o=>o.id===m.id));
    if(fresh) HL.DNAFX.reveal(fresh,{title:'LEGENDARY SKILL FUSION',resultPlayer:{name:st.name,pos:st.pos==='auto'?'':st.pos,number:7,height:dna.build.height,ovr:'DNA',real:false}});
    if (!remaining().length && !fresh) setTimeout(() => { const prime = buildPrime(); const ovr = HL.computeOvr(prime.attrs, prime.pos); FX.banner(`${ovr} OVR`, `Your ${prime.pos} is built: ${HL.fmtHeight(prime.height)}, ${prime.weight} lb.`, { tier: ovr >= 95 ? 4 : ovr >= 90 ? 3 : ovr >= 82 ? 2 : 1, kicker: 'Ceiling', ms: 2200 }); }, 350);
  }

  function rowAttrs(row) { return HL.historicalAttributes(row); }

  // ---------- build the player from the picks ----------
  function buildPrime() {
    const attrs = {};
    for (const [id, , keys] of CATS) {
      const pk = st.picks[id];
      if (!pk || !keys.length || id.startsWith('tend')) continue;
      const a = rowAttrs(pk.row);
      for (const k of keys) attrs[k] = a[k];
    }
    // Shot-decision skill follows the shot-preference player, but preference
    // percentages are kept separately so 25% three-point frequency is not 25 OVR.
    if (st.picks.tendShot) attrs.shotSelection=rowAttrs(st.picks.tendShot.row).shotSelection;
    const tendencies={};
    for(const [id,,keys] of CATS) if(id.startsWith('tend') && st.picks[id]) {
      const t=HL.historicalTendencies(st.picks[id].row);
      for(const key of keys) tendencies[key]=t[key];
    }
    // Historical cards contribute abilities, never partial or undefined attributes.
    for(const k of HL.ATTR_KEYS) if(!Number.isFinite(attrs[k])) attrs[k]=65;
    const longevity=HL.careerTraitFor(st.picks.longevity.row.pid).longevity;
    const primeLength=HL.careerTraitFor(st.picks.primeLength.row.pid).primeLength;
    const body = st.picks.body;
    const bio = HL.HISTORY.players[body.row.pid];
    const height = bio[3], weight = bio[4];
    // Auto estimates the best position, but the player can explicitly choose all five spots.
    const fits = { PG: [0, 77], SG: [74, 79], SF: [77, 81], PF: [79, 83], C: [80, 99] };
    const open = Object.keys(fits).filter(k => height >= fits[k][0] && height <= fits[k][1]);
    const pos = st.pos && st.pos !== 'auto' ? st.pos : (open.length ? open : [height < 74 ? 'PG' : 'C']).sort((a,b)=>HL.computeOvr(attrs,b)-HL.computeOvr(attrs,a))[0];
    const entries=Object.entries(st.picks).map(([cat,c])=>({pid:c.row.pid,cat,row:c.row,season:c.season}));
    const effective=HL.DNA.reconcileAttributes(attrs,height);
    const base=HL.DNA.applyBuild({ attrs:effective.attrs, draftedAttrs:{...attrs}, constraints:effective.constraints, height, weight, pos, tendencies, longevity, primeLength },HL.DNA.analyze(entries,{build:{attrs:effective.attrs,height,weight}}));
    return st.fusionEquipped&&HL.FusionLab?HL.FusionLab.project(base,st.fusionEquipped):base;
  }




  function rememberRival(c,s) {
    const r=s.rival;if(!r||!r.name)return;
    c.rivalries ||= {};
    const id=String(r.pid);
    const f=c.rivalries[id]||{name:r.name,met:0,wins:0,losses:0,history:[]};
    f.met++;
    if(r.win)f.wins++;else f.losses++;
    f.history.push({yr:s.yr,win:r.win,impact:r.myScore,opponent:r.theirScore});
    c.rivalries[id]=f;
  }
  function rivalryView(c) {
    const rivals=Object.values(c.rivalries||{}).sort((a,b)=>b.met-a.met||b.losses-a.losses).slice(0,5);
    if(!rivals.length)return '';
    return '<section class="block rivalry-ledger"><header><h3>RIVALRY LEDGER</h3>'+
      '<span class="ml-auto t3 sm">The MVP race through the years</span></header>'+
      '<div class="body stack"><p class="t2 sm">You go against the best real competitor every season. Repeated matchups build actual career rivalries.</p>'+
      rivals.map(r=>'<div class="rival-line"><div><b>'+esc(r.name)+'</b><small>'+r.met+
        ' season'+(r.met===1?'':'s')+' battling for impact</small></div><strong>'+r.wins+'-'+r.losses+'</strong>'+
        '<div class="rival-pips">'+r.history.map(h=>'<i class="'+(h.win?'won':'lost')+
        '" title="'+esc(yrLabel(h.yr)+(h.win?' win':' loss'))+'"></i>').join('')+'</div></div>').join('')+
      '</div></section>';
  }

  // An on-court identity changes usage, shot selection and defensive behavior
  // during possessions. Ratings are never padded to imitate the choice.
  const ROLES={
    balanced:{title:'Two-Way Balance',detail:'Keep your natural shot diet, play through your teammates.',t:{},focus:'balanced',usage:1,injury:0},
    scorer:{title:'First Option',detail:'More isolations and shot attempts; fewer passes and extra fatigue risk.',t:{usage:14,shotHunt:16,iso:13,passFirst:-13,moveBall:-10},focus:'star',usage:1.16,injury:.025},
    facilitator:{title:'Floor General',detail:'More touches, ball movement and assists; fewer forced jumpers.',t:{usage:7,passFirst:20,moveBall:18,riskyPass:-5,shotHunt:-13},focus:'motion',usage:1.08,injury:.005},
    finisher:{title:'Rim Attacker',detail:'More drives and drawn fouls; fewer perimeter attempts.',t:{usage:9,drive:19,drawFoul:14,three:-12,mid:-7},focus:'inside',usage:1.1,injury:.018},
    stopper:{title:'Defensive Specialist',detail:'More help and closeouts, less gambling and lower offensive usage.',t:{usage:-9,contest:16,effort:16,gamble:-10,shotHunt:-12},focus:'balanced',usage:.94,injury:.008}
  };
  const AGENDAS={
    points:{title:'Scoring Crown',detail:'Average at least 30 PPG across half the schedule.',test:(s,n)=>s.g>=n*.5&&s.ppg>=30},
    assists:{title:'Floor General',detail:'Average at least 10 APG across half the schedule.',test:(s,n)=>s.g>=n*.5&&s.apg>=10},
    rebounds:{title:'Own the Glass',detail:'Average at least 12 RPG across half the schedule.',test:(s,n)=>s.g>=n*.5&&s.rpg>=12},
    winning:{title:'Contender',detail:'Win at a 55-win pace and make the playoffs.',test:(s,n)=>s.w/Math.max(1,s.w+s.l)>=55/82&&s.made},
    legacy:{title:'Championship Chase',detail:'Win a championship and play 45% of the season.',test:(s,n)=>s.champion&&s.g>=n*.45}
  };
  function customizeRole(me,id) {
    const role=ROLES[id]||ROLES.balanced;
    const base=me._skillRoleBaseline||HL.completeTendencies(me);
    me._skillRoleBaseline ||= {...base};
    const tend={...base};
    for(const [key,delta]of Object.entries(role.t))tend[key]=HL.clamp((base[key]??50)+delta,0,100);
    me.tend=HL.completeTendencies({...me,tend});
    return role;
  }
  function finishAgenda(c,s,n) {
    const id=AGENDAS[c.agenda]?c.agenda:'winning',def=AGENDAS[id];
    const complete=!s.minors&&!!def.test(s,n);
    const out={year:c.yr,id,title:def.title,detail:def.detail,complete};
    c.agendaHistory ||= [];
    c.agendaHistory.push(out);
    if(complete){c.agendaVictories=(c.agendaVictories||0)+1;c.trainingReward=(c.trainingReward||0)+.2;}
    return out;
  }
  function rolePanel(c) {
    const roles=Object.entries(ROLES).map(([id,r])=>
      '<button class="role-card '+(c.role===id?'active':'')+'" data-role="'+id+'">'+
      '<small>'+(c.role===id?'ACTIVE STYLE':'PLAY STYLE')+'</small><b>'+esc(r.title)+'</b>'+
      '<span>'+esc(r.detail)+'</span></button>').join('');
    const objectives=Object.entries(AGENDAS).map(([id,a])=>
      '<option value="'+id+'" '+(c.agenda===id?'selected':'')+'>'+esc(a.title)+'</option>').join('');
    const prev=c.agendaHistory?.at(-1);
    return '<section class="block role-studio"><header><h3>SEASON GAMEPLAN STUDIO</h3><span class="ml-auto t3 sm">Real on-court decisions</span></header>'+
      '<div class="body stack"><p class="t2 sm">Your role changes shot selection, touches, passing, defense and fatigue. It does not grant fake ratings. Choose before the season.</p>'+
      '<div class="role-grid">'+roles+'</div><div class="season-agenda"><div class="grow"><b>Season contract</b>'+
      '<p class="t3 sm">Take on a tough statistical or championship goal. Success earns a small extra training session at the next offseason, with diminishing returns.</p></div>'+
      '<select data-agenda aria-label="Season objective">'+objectives+'</select></div>'+
      (prev?'<div class="role-last '+(prev.complete?'complete':'')+'">Previous challenge · '+
        esc(prev.title)+' · <b>'+(prev.complete?'ACHIEVED':'MISSED')+'</b> · '+yrLabel(prev.year)+'</div>':'')+
      '<div class="caps">Completed contracts: '+(c.agendaVictories||0)+'</div></div></section>';
  }

  // Offseason training is a real, modest attribute investment, not a free OVR
  // multiplier. It persists across seasons while age, health and DNA still rule.
  const TRAINING={
    balanced:{name:'Complete Player',detail:'Split time between skill work and recovery. Slower improvement, less accumulated wear.',keys:['iq','stam','dur'],rate:.8},
    shooting:{name:'Shot Lab',detail:'Improve off-dribble touch, release consistency and shot-making. Neglecting conditioning adds modest wear.',keys:['three','mid','shotArc','releaseSpeed'],rate:1.35},
    finishing:{name:'Rim Pressure',detail:'Develop your handle, contact finishing and above-the-rim timing.',keys:['dunk','layup','contactFinish','handle'],rate:1.35},
    playmaking:{name:'Floor General',detail:'Build passing vision, accuracy and decision-making.',keys:['pass','vision','passingAccuracy','iq'],rate:1.35},
    defense:{name:'Defensive Clinic',detail:'Improve positioning, perimeter containment and timing at the rim.',keys:['perD','intD','helpD','steal','block'],rate:1.35},
    athletic:{name:'Explosive Conditioning',detail:'Sprint, jump and stamina training. Most effective early; heavy workloads can increase injury risk.',keys:['speed','burst','vert','stam'],rate:1.2}
  };
  function trainSummer(c) {
    if(!c.training)c.training={};
    const id=TRAINING[c.trainingFocus]?c.trainingFocus:'balanced';
    const t=TRAINING[id],old=c.training[id]||0;
    // One training camp per offseason, diminishing returns across the career.
    const bonus=Math.min(.3,c.trainingReward||0);
    const gain=HL.clamp(t.rate*(1-old/9)+bonus,.15,t.rate+.3);
    c.trainingReward=0;
    c.training[id]=Math.round((old+gain)*100)/100;
    c.trainingHistory ||= [];
    c.trainingHistory.push({year:c.yr,program:id,gain:+gain.toFixed(2)});
    if(c.trainingHistory.length>26)c.trainingHistory.shift();
    return t.name;
  }
  function trainingView(c) {
    if(c.done)return '';
    return '<section class="block training-lab"><header><h3>OFFSEASON TRAINING LAB</h3>'+
      '<span class="ml-auto t3 sm">Every camp shapes the next season</span></header><div class="body stack">'+
      '<p class="t2 sm">Choose a specialization. It raises specific skills gradually, with diminishing returns and natural aging still active. Your selection applies at the next offseason.</p>'+
      '<div class="training-grid">'+Object.entries(TRAINING).map(([id,t])=>
      '<button class="training-choice '+(c.trainingFocus===id?'active':'')+'" data-training="'+id+'">'+
      '<span>'+ (c.trainingFocus===id?'● SELECTED':'○ PROGRAM')+'</span><b>'+esc(t.name)+'</b>'+
      '<small>'+esc(t.detail)+'</small>'+
      '<em>Investment '+(c.training?.[id]||0).toFixed(1)+'/9</em></button>').join('')+'</div>'+
      (c.trainingHistory?.length?'<p class="t3 sm">Most recent camp: '+
      esc(TRAINING[c.trainingHistory.at(-1).program]?.name||'Training')+
      ' · '+yrLabel(c.trainingHistory.at(-1).year)+'</p>':'')+
      '</div></section>';
  }
  function milestoneView(c) {
    const count=name=>c.awards.filter(a=>a.award===name).length;
    const played=c.seasons.filter(x=>!x.minors);
    const best=played.reduce((m,x)=>Math.max(m,x.ppg||0),0);
    const quests=[
      ['First 10K','Score 10,000 career points',c.totals.pts,10000],
      ['30K Club','Score 30,000 career points',c.totals.pts,30000],
      ['Walking Bucket','Average 30 PPG in a season',best,30],
      ['Award Season','Win your first MVP',count('MVP'),1],
      ['Ring Collector','Win three championships',c.rings,3],
      ['Scoring King','Win five scoring titles',count('Scoring title'),5],
      ['Iron Veteran','Complete 15 NBA seasons',played.length,15],
      ['GOAT Case','Reach a top-three legacy ranking',c.legacy?.rank<=3?1:0,1]
    ];
    const completed=quests.filter(q=>q[2]>=q[3]).length;
    return '<section class="block legacy-quests"><header><h3>LEGACY QUESTS</h3><span class="ml-auto t3 sm">'+
      completed+'/'+quests.length+' complete</span></header><div class="body"><div class="legacy-quest-grid">'+
      quests.map(([title,desc,v,target])=>{
        const pct=Math.round(Math.min(1,v/target)*100),done=v>=target;
        return '<article class="legacy-quest '+(done?'complete':'')+'"><div class="row"><b>'+
          esc(title)+'</b><span class="ml-auto">'+(done?'COMPLETE':pct+'%')+'</span></div>'+
          '<p>'+esc(desc)+'</p><div class="quest-track"><i style="width:'+pct+'%"></i></div>'+
          '<small>'+ (Number.isInteger(v)?v.toLocaleString():v.toFixed(1))+
          ' / '+target.toLocaleString()+'</small></article>';
      }).join('')+'</div></div></section>';
  }

  // ---------- career engine ----------
  // Historical seasons use their actual rosters. Once recorded history ends,
  // advance one persistent league through generated drafts, player development,
  // retirement and free agency; never replay the final historical roster.
  const ME_ID = 999999;
  const LIN = () => C().LINEAGE;
  const fr = t => LIN()[t.bref] || t.bref;
  const yrLabel = y => `${y}-${String(y + 1).slice(2)}`;
  const fullName = t => `${t.city} ${t.name}`;
  const metaOf = t => ({ abbr: t.abbr, bref: t.bref, city: t.city, name: t.name, color: t.color, color2: t.color2, espn: t.espn });
  const nameOf = pid => (HL.HISTORY.players[pid] || [pid])[0];
  const awardIndex = {};
  function realAwards(yr) {
    if (!awardIndex.built) {
      for (const [pid, list] of Object.entries(HL.HISTORY.awards)) for (const [y, a] of list) ((awardIndex[y] = awardIndex[y] || {})[a] = awardIndex[y][a] || []).push(pid);
      awardIndex.built = true;
    }
    return awardIndex[yr] || {};
  }
  // Voting value, calibrated on 1955-2025: ranking real seasons by it recovers 78% of All-NBA picks and 66% of MVPs.
  const voteValue = (ppg, ovr, rpg, apg, g, games) => { const avail = Math.min(1, g / (games * 0.85)); return (ppg * 0.6 + (ovr - 75) + rpg * 0.25 + apg * 0.35) * avail * avail; };
  const defValue = (a, g, games) => (Math.max(a.perD, a.intD) * 0.6 + (a.steal + a.block) * 0.2) * Math.min(1, g / (games * 0.85));
  const blankTotals = () => ({ g: 0, gs: 0, min: 0, pts: 0, reb: 0, ast: 0, stl: 0, blk: 0, tov: 0, fgm: 0, fga: 0, tpm: 0, tpa: 0, ftm: 0, fta: 0 });
  function addLine(tot, l) {
    tot.g += l.gp || 0; tot.gs += l.gs || 0; tot.min += l.min || 0; tot.pts += l.pts; tot.reb += l.orb + l.drb; tot.ast += l.ast;
    tot.stl += l.stl; tot.blk += l.blk; tot.tov += l.tov; tot.fgm += l.fgm; tot.fga += l.fga; tot.tpm += l.tpm; tot.tpa += l.tpa; tot.ftm += l.ftm; tot.fta += l.fta;
  }

  // One league per historical season. Post-data careers retain a genuinely
  // evolving world with rookies, transfers, retirements and developing peers.
  let cache = null, futureWorld = null;
  function projectFutureSeason(L) {
    // The short-form career sim does not play all other teams' 1,230 games.
    // Estimate their records from CURRENT rosters, rather than 2025's standings.
    const strength = L.teams.map(team => {
      const roster = HL.League.teamPlayers(team.id).sort((a,b)=>b.ovr-a.ovr).slice(0,9);
      const top = roster.slice(0,5).reduce((n,p)=>n+p.ovr,0)/Math.max(1,Math.min(5,roster.length));
      const depth = roster.slice(5).reduce((n,p)=>n+p.ovr,0)/Math.max(1,roster.slice(5).length);
      return {team, strength: top*.83+depth*.17 + R.normal(0,2.8)};
    });
    const avg = strength.reduce((n,x)=>n+x.strength,0)/Math.max(1,strength.length);
    for (const {team,strength:power} of strength) {
      const wins=Math.round(HL.clamp(L.games*.5+(power-avg)*2.5+R.normal(0,5),10,L.games-10));
      team.real={...team.real,w:wins,l:L.games-wins,playoffs:false};
      team.w=wins;team.l=L.games-wins;
    }
    for(const conf of new Set(L.teams.map(t=>t.conf))) {
      const members=L.teams.filter(t=>t.conf===conf).sort((a,b)=>b.real.w-a.real.w);
      members.slice(0,Math.min(8,members.length)).forEach(t=>{t.real.playoffs=true;});
    }
  }
  async function leagueFor(yr,c=null) {
    if(c?.cancelled)return null;
    if(cache && cache.yr===yr){HL.League.set(cache.L);return cache.L;}
    if(yr<=HL.LATEST_SEASON) {
      const key=String(yr);
      await HL.History.load(key);
      if(c?.cancelled)return null;
      const L=HL.League.createFromSeason({seasonKey:key,seed:R.int(1,1e9)});
      cache={yr,L};
      return L;
    }
    if(!futureWorld){
      const latest=HL.LATEST_SEASON;
      if(cache?.yr===latest)futureWorld=cache.L;
      else {
        await HL.History.load(String(latest));
        if(c?.cancelled)return null;
        futureWorld=HL.League.createFromSeason({seasonKey:String(latest),seed:R.int(1,1e9)});
      }
    }
    while(futureWorld.season<yr){
      if(c?.cancelled)return null;
      HL.League.set(futureWorld);
      futureWorld.settings.history='generated';
      const previousRatings=new Map(Object.values(futureWorld.players).map(p=>[p.id,p.ovr]));
      // Feed the league's existing offseason engine plausible previous records.
      for(const t of futureWorld.teams){t.w=t.real.w;t.l=t.real.l;}
      futureWorld.phase='offseason';
      const next=HL.League.advanceToNextSeason();
      if(next?.ok===false)throw new Error(next.reason||'League offseason could not advance');
      if(futureWorld.season<=HL.LATEST_SEASON)throw new Error('Future league failed to advance');
      futureWorld._careerDevelopment=Object.values(futureWorld.players).filter(p=>
        !p.retired&&p.teamId!=null&&previousRatings.has(p.id)).map(p=>
        ({name:p.name,ovr:p.ovr,change:p.ovr-previousRatings.get(p.id)}))
        .sort((a,b)=>b.change-a.change);
      projectFutureSeason(futureWorld);
      futureWorld._careerAwardField=null;
      futureWorld._careerAwardYear=null;
    }
    cache={yr,L:futureWorld};
    HL.League.set(futureWorld);
    return futureWorld;
  }
  const realWp = t => t.real.w / Math.max(1, t.real.w + t.real.l);
  const byRecord = L => L.teams.slice().sort((a, b) => realWp(a) - realWp(b));

  // A draft pick transfers the REAL attribute, including its 99-rated strengths.
  // Prime is achievable, not a misleading ceiling permanently diluted by "reach".
  // Work ethic determines how quickly the player develops; prime is exact at 28-29.
  function primeWindow(c) {
    // Exceptional builds are intentionally capable of superhuman primes.
    // Ordinary 55-80 ratings still produce normal multi-year peaks.
    const p=c.prime.primeLength;
    const seasons=extraordinaryLongevity(c)?14:HL.clamp(Math.round(3+9*(p-40)/59),3,12);
    const start=Math.max(23,28-Math.floor((seasons-1)/2));
    return {start,end:start+seasons-1,seasons};
  }
  // Real NBA careers ordinarily occupy one to two decades, with exceptionally
  // durable stars occasionally reaching their early 40s. Even 99s have a limit.
  function careerLimit(c) {
    if(!c?.prime)return 20;
    const p=c.prime, a=p.attrs||{};
    return Math.round(HL.clamp(
      12 + (p.longevity-55)*.17 + ((a.dur||65)-65)*.06 +
        (extraordinaryLongevity(c)?3:0),8,extraordinaryLongevity(c)?25:21));
  }
  function extraordinaryLongevity(c) {
    const p=c.prime,a=p.attrs;
    return p.longevity>=98&&p.primeLength>=98&&a.dur>=94&&a.stam>=96&&a.iq>=92&&Math.max(a.three||0,a.mid||0,a.pass||0,a.post||0)>=95;
  }
  function careerDemand(c) {
    const a=c.me.attrs||{},ovr=c.me.ovr||HL.computeOvr(a,c.me.pos);
    const mobility=((a.speed||25)+(a.agility||25)+(a.stam||25))/3;
    const defense=Math.max(a.perD||25,a.intD||25);
    const execution=ovr-Math.max(0,55-mobility)*.48-Math.max(0,48-defense)*.2;
    const recent=(c.seasons||[]).filter(s=>!s.minors).slice(-3);
    const missed=recent.reduce((n,s)=>n+(s.injury?.games||0),0)/Math.max(1,recent.length);
    const ageTax=Math.max(0,c.age-36)*(c.age>=40?1.3:.35);
    const value=execution-Math.max(0,missed-25)*.09-ageTax;
    return {eligible:value>=62,score:value,mobility,reason:value>=62?'NBA-level effectiveness and availability':'Declining mobility, effectiveness or availability no longer supports an NBA role'};
  }
  function shouldPauseAuto(c) {
    const tail=(c.seasons||[]).slice(-2);
    return c.pending?.type==='minors'&&tail.length===2&&tail.every(s=>s.minors||!s.g);
  }
  function ratingsAt(c, age) {
    const out={}, w=primeWindow(c);
    const work=(c.me.traits?.workEthic??60);
    // Reach the exact player-built ceiling throughout the chosen prime window.
    const buildUp=HL.clamp((age-19)/Math.max(3,w.start-19-(work-60)/100),0,1);
    // Exceptional longevity earns decades, not centuries. The late-life
    // attrition curve eventually outpaces even max longevity and stamina.
    // Retirement is still player-controlled; declining contract value, not a
    // hard scripted retirement date, closes the NBA market.
    const exceptional=extraordinaryLongevity(c),late=Math.max(0,age-(exceptional?37:33));
    const decline=Math.max(0,age-w.end)*(exceptional?1.2:1.65+(99-c.prime.longevity)*.018)+late*late*(exceptional?.22:.18);
    const wear=(c.seasons||[]).reduce((n,s)=>n+(s.injury?.lasting?Math.min(60,s.injury.games||0)/30:0),0);
    for(const k of HL.ATTR_KEYS) {
      const goal=Number.isFinite(c.prime.attrs[k]) ? c.prime.attrs[k] : 65;
      const physical=['speed','vert','burst','accel','agility','stam','transition'].includes(k);
      const skillFade=['iq','ft','pass','vision','passingAccuracy','shotArc','shotSelection'].includes(k)?.38:1;
      const earlyPhysical=physical?Math.max(0,age-(exceptional?30:28))*(exceptional?.35:.46+(99-c.prime.longevity)*.01):0;
      const fade=decline*(physical?1.45:skillFade)+earlyPhysical+(physical?wear*1.6:wear*.2);
      const gap=physical?5:13;
      const earned=Object.entries(c.training||{}).reduce((total,[id,invested])=>
        total+(TRAINING[id]?.keys.includes(k)?Math.min(5.5,invested*.9):0),0);
      const physicalTaper=physical?Math.max(.2,1-Math.max(0,age-31)*.055):1;
      out[k]=Math.round(HL.clamp(goal-gap*(1-buildUp)-fade+earned*physicalTaper,
        25,Math.max(99,goal)));
    }
    return HL.DNA.reconcileAttributes(out,c.prime.height||c.me.height||78).attrs;
  }
  function setAge(c, age) {
    const me = c.me;
    me.age = age; me.attrs = ratingsAt(c, age); me.ovr = HL.computeOvr(me.attrs, me.pos);
    me.dna={effects:c.prime.effects||{},mechanics:c.prime.mechanics||{}};
    // Rebuild shot diet from the combined skills: a borrowed elite 3PT rating
    // actively increases 3PA, while Shaq's frame stays with that same player.
    me.tend = HL.completeTendencies({...me,tend:{...HL.defaultTendencies(me),...c.prime.tendencies}});
    me._skillRoleBaseline={...me.tend};
  }

  function newCareer() {
    const prime = buildPrime();
    const me = HL.createPlayer({ name: st.name, pos: prime.pos, age: 19, height: prime.height, ovr: 60, arch: 'twoway', real: false, season: st.debut });
    me.id = ME_ID; me.weight = prime.weight; me.realMpg = null; me.dna={effects:prime.effects,mechanics:prime.mechanics};
    return {
      me, prime, primeOvr: HL.computeOvr(prime.attrs, prime.pos),
      noise: Object.fromEntries(HL.ATTR_KEYS.map(k => [k, R.normal(0, 1.6)])),
      debut: st.debut, age: 19, yr: st.debut, franchise: null, teamMeta: null, contract: null, minors: false,
      seasons: [], awards: [], rings: 0, teams: [], pick: null, altered: [], earnings: 0, log: [], lastRecords: {},
      totals: blankTotals(), ptotals: blankTotals(), highs: {}, tradeRequests: 0,
      pending: null, done: false, end: null, legacy: null, dna: prime.dna, story: [], pendingStory:null, franchiseLoyalty:0,
       trainingFocus:'balanced',training:{},trainingHistory:[],role:'balanced',agenda:'winning',agendaVictories:0,agendaHistory:[],trainingReward:0,rivalries:{},
    };
  }

  const minSalary = yr => 1.2 * HL.salaryScale(yr);
  const rookieScale = (pick, n, yr) => (pick <= n ? 12.5 * Math.pow(0.95, pick - 1) : 1.3) * HL.salaryScale(yr);
  const marketValue = (ovr, age, yr) => Math.max(HL.estimateSalary(ovr, age), 1.2) * HL.salaryScale(yr);

  function join(c, team, text, contract) {
    if (fr(team) !== c.franchise) c.teams.push(fullName(team));
    c.franchise = fr(team); c.teamMeta = metaOf(team); c.contract = contract; c.minors = false;
    c.log.push({ yr: c.yr, text });
  }

  async function draft(c) {
    const L = await leagueFor(c.yr,c);if(!L)return;
    setAge(c, 19);
    const n = L.teams.length, order = byRecord(L);
    const slot = Math.max(1, Math.round(31 - (c.me.ovr - 58) * 1.6 + R.normal(0, 3)));
    c.pick = slot <= n * 2 ? slot : null; // two rounds; anyone lower goes undrafted
    if (c.pick) {
      const team = order[(c.pick - 1) % n];
      join(c, team, `Drafted #${c.pick} overall by the ${fullName(team)}`, { amount: rookieScale(c.pick, n, c.yr), through: c.yr + (c.pick <= n ? 3 : 1), kind: c.pick <= n ? 'Rookie scale' : 'Second-round deal' });
    } else if (c.me.ovr >= 62) {
      const team = R.pick(order.slice(0, Math.ceil(n / 2)));
      join(c, team, `Went undrafted, then signed by the ${fullName(team)}`, { amount: minSalary(c.yr), through: c.yr, kind: 'Minimum' });
    } else {
      c.minors = true;
      c.log.push({ yr: c.yr, text: 'Went undrafted and headed to the minor leagues' });
    }
    c.draftClass = draftClass(c.yr);
    c.stage = 'draft';
  }
  // The real draft class he joined, for the draft-night screen.
  function draftClass(yr) {
    const rows = [];
    for (const [pid, d] of Object.entries(HL.HISTORY.drafts || {})) if (d[0] === yr && d[1]) rows.push({ pid, pick: d[1], club: d[2], college: d[3], name: nameOf(pid), nbaId: (HL.HISTORY.players[pid] || [])[1] });
    return rows.sort((a, b) => a.pick - b.pick).slice(0, 10);
  }

  async function playSeason(c) {
    const L = await leagueFor(c.yr,c);if(!L)return;
    const me = c.me;
    if (c.minors) {
      c.seasons.push({ age: c.age, yr: c.yr, minors: true, ovr: me.ovr, g: 0, ppg: 0, rpg: 0, apg: 0, awards: [], altered: [] });
      return;
    }
    let team = L.teams.find(t => fr(t) === c.franchise);
    if (!team) { team = R.pick(L.teams); join(c, team, `Joined the ${fullName(team)}`, c.contract); }
    // Major injury risk grows with age and poor durability.
    let missed = 0, injury = null;
    const eliteCondition = Math.max(0, (Math.min(me.attrs.stam || 65, me.attrs.dur || 65) - 70) / 29);
    const ageRisk = Math.max(0, c.age - 32) * 0.012 * (1 - 0.7 * eliteCondition);
    if (R.chance(HL.clamp(0.05 + Math.max(0, 70 - me.attrs.dur) * 0.004 + ageRisk + (ROLES[c.role]?.injury||0), 0.01, 0.75))) {
      const inj = HL.rollInjury(1.2);
      missed = Math.min(L.games, inj.games);
      if (inj.lasting) for (const k in inj.lasting) c.prime.attrs[k] = HL.clamp(c.prime.attrs[k] + inj.lasting[k], 25, 99);
      if (missed > 0) injury = { name: inj.name, games: missed, lasting: !!inj.lasting };
    }
    const res = simSeason(L, team, me, missed,c.role,c.press?.pledge);
    const s={age:c.age,yr:c.yr,key:String(L.season),team:metaOf(team),ovr:me.ovr,salary:c.contract?c.contract.amount:0,injury,role:c.role,...res};
    s.agenda=finishAgenda(c,s,L.games);
    HL.SkillPress?.resolve(c,s);
    if(L.season>HL.LATEST_SEASON){
      s.leagueRecap={
        rookies:Object.values(L.players).filter(p=>p.draft?.year===c.yr&&p.teamId!=null)
          .sort((a,b)=>b.ovr-a.ovr).slice(0,5).map(p=>
            ({name:p.name,ovr:p.ovr,team:L.teams[p.teamId]?.name||'NBA'})),
        rising:(L._careerDevelopment||[]).filter(p=>p.change>0).slice(0,4),
        scorers:(L._careerAwardField||[]).filter(p=>p.qual)
          .sort((a,b)=>b.row.pts-a.row.pts).slice(0,5)
          .map(p=>({name:p.name,ppg:p.row.pts.toFixed(1)}))
      };
    }
    c.seasons.push(s);
    rememberRival(c,s);
    addLine(c.totals, res.line); addLine(c.ptotals, res.pline);
    c.earnings += s.salary;
    for (const a of res.awards) c.awards.push({ season: c.yr, award: a.award || a, over: a.over });
    if (injury && injury.games >= 20) c.awards.push({ season: c.yr, award: `Injury: ${injury.name}` });
    for (const a of res.altered) c.altered.push({ season: c.yr, text: a });
    if (res.champion) c.rings++;
    for (const k of ['pts', 'reb', 'ast', 'stl', 'blk']) {
      const h = res.highs[k];
      if (h && (!c.highs[k] || h.v > c.highs[k].v)) c.highs[k] = { ...h, yr: c.yr };
    }
    // Last season's records for the offseason screen (his team's is the simulated one).
    c.lastRecords = {};
    for (const t of L.teams) c.lastRecords[fr(t)] = `${t.real.w}-${t.real.l}`;
    c.lastRecords[fr(team)] = `${res.w}-${res.l}`;
  }

  // ---------- offseason: development, contracts and decisions ----------
  async function offseason(c) {
    const from = c.me.ovr;
    c.age++; c.yr++;
    if(c.seasons.filter(s=>!s.minors).length>=careerLimit(c) || c.age>= (extraordinaryLongevity(c)?45:43)) {
      const played=c.seasons.filter(s=>!s.minors).length;
      end(c, 'Retired after '+played+' NBA seasons at age '+c.age+'.');
      return;
    }
    const earnedCamp=trainSummer(c);
    const L = await leagueFor(c.yr,c);if(!L)return;
    setAge(c, c.age);
    const ovr = c.me.ovr;
    const pend = { type: 'season', from, to: ovr, offers: [], notes: ['Completed '+earnedCamp+' camp. Specific practiced skills have improved, subject to aging.'] };
    const cur = c.franchise && !c.minors ? L.teams.find(t => fr(t) === c.franchise) : null;
    if (c.franchise && !c.minors && !cur) pend.notes.push(`The ${c.teamMeta.city} ${c.teamMeta.name} no longer exist. He is a free agent.`);
    // Leaving the NBA is not the same as retiring. Even at 50+, the player
    // can keep trying for a contract while his career save stays alive.
    if (!careerDemand(c).eligible) {
      pend.type = 'minors';
      pend.notes.push(`${careerDemand(c).reason}. Continue outside the league and reassess next summer, or retire by choice.`);
    } else if (!cur || !c.contract || c.contract.through < c.yr) {
      pend.type = 'fa';
      pend.offers = makeOffers(c, L, cur);
      if (!pend.offers.length) { pend.type = 'minors'; pend.notes.push('Free agency came and went without an offer.'); }
    }
    c.pending = pend;
    c.pendingStory=HL.Story.prompt(c);
  }

  function makeOffers(c, L, cur) {
    if(!careerDemand(c).eligible)return [];
    const ovr = c.me.ovr, age = c.age;
    const teams = L.teams.map(t => ({ t, s: HL.News.teamStrength(L, t.id) })).sort((a, b) => b.s - a.s);
    let n = ovr >= 85 ? 5 : ovr >= 78 ? 4 : ovr >= 70 ? 3 : ovr >= 65 ? 2 : 1;
    if (age >= 35) n = Math.max(1, n - 1);
    const pool = teams.filter(x => !cur || x.t.id !== cur.id);
    const picks = [];
    // Stars hear from everyone, contenders included; role players mostly from teams that need help.
    while (picks.length < n && pool.length) {
      const lo = ovr >= 82 ? 0 : Math.floor(pool.length * 0.25);
      picks.push(pool.splice(R.int(lo, pool.length - 1), 1)[0]);
    }
    // Contending teams should make an offer to retain proven champions, even in decline.
    const recent=c.seasons.filter(s=>!s.minors).slice(-2);
    const franchiseSuccess=recent.filter(s=>fr(s.team)===c.franchise).some(s=>s.champion || s.w/Math.max(1,s.w+s.l)>=.67);
    const retention=franchiseSuccess ? .995 : ovr>=72 ? .95 : ovr>=66 ? .60 : .30;
    if (cur && R.chance(retention)) picks.unshift(teams.find(x => x.t.id === cur.id));
    return picks.map(x => offerFrom(c, L, x.t, teams.indexOf(x), teams.length, cur && x.t.id === cur.id));
  }
  function offerFrom(c, L, t, strengthRank, nTeams, isCur) {
    const ovr = c.me.ovr, age = c.age;
    const roster = HL.League.teamPlayers(t.id).sort((a, b) => b.ovr - a.ovr);
    const rank = roster.filter(p => p.ovr > ovr).length + 1;
    const role = rank === 1 ? 'Number one option' : rank <= 3 ? 'Star role' : rank <= 5 ? 'Starter' : rank <= 8 ? 'Rotation' : 'End of bench';
    // Weak teams pay more to get him; contenders sell winning. His own team has his rights (Bird rights).
    const tilt = isCur ? 1.06 : 1.12 - (1 - strengthRank / Math.max(1, nTeams - 1)) * 0.24;
    const amount = Math.max(minSalary(c.yr), marketValue(ovr, age, c.yr) * tilt * R.range(0.93, 1.07) * (HL.SkillPress?.market(c)||1));
    let years = age <= 26 ? R.int(3, 5) : age <= 30 ? R.int(2, 4) : age <= 33 ? R.int(1, 3) : 1;
    if (ovr < 68) years = Math.min(years, R.int(1, 2));
    const tier = strengthRank < 5 ? 'Contender' : strengthRank < Math.round(nTeams * 0.45) ? 'Playoff team' : strengthRank < Math.round(nTeams * 0.75) ? 'Fringe' : 'Rebuilding';
    return {
      tid: t.id, team: metaOf(t), franchise: fr(t), isCur, amount, years, role, tier,
      top: roster.slice(0, 3).map(p => ({ name: p.name, ovr: p.ovr, nbaId: p.nbaId })), last: c.lastRecords[fr(t)] || null,
    };
  }

  function decide(c, choice) {
    const p = c.pending;
    if (!p) return;
    const L = cache && cache.L;
    const seasonsPlayed = c.seasons.filter(s => !s.minors).length;
    if (choice.type === 'retire') return end(c, `Retired after ${seasonsPlayed} NBA season${seasonsPlayed === 1 ? '' : 's'}, at ${c.age - 1}`);
    if (choice.type === 'sign') {
      const o = p.offers[choice.i];
      const t = L.teams.find(x => x.id === o.tid);
      join(c, t, `${o.isCur ? 'Re-signed with' : 'Signed with'} the ${fullName(t)}: ${o.years} year${o.years > 1 ? 's' : ''}, ${U.money(o.amount)} a year`, { amount: o.amount, through: c.yr + o.years - 1, kind: o.isCur ? 'Re-signed' : 'Free agent deal' });
    } else if (choice.type === 'trade') {
      // The front office finds a taker; good players get moved to teams trying to win.
      const others = L.teams.filter(t => fr(t) !== c.franchise).map(t => ({ t, s: HL.News.teamStrength(L, t.id) })).sort((a, b) => b.s - a.s);
      const pickFrom = c.me.ovr >= 80 ? others.slice(0, 10) : others.slice(Math.floor(others.length / 3));
      const t = R.pick(pickFrom).t;
      c.tradeRequests++;
      join(c, t, `Traded to the ${fullName(t)} after requesting a trade`, c.contract);
    } else if (choice.type === 'minors') {
      c.minors = true; c.contract = null;
      c.log.push({ yr: c.yr, text: 'Stayed active outside the NBA, seeking another opportunity' });
    }
    c.pending = null;
  }

  // Auto-pilot for "sim the whole career": stars chase titles, others follow the money, loyal players stay.
  function autoDecide(c) {
    const p = c.pending;
    if (!p) return;
    if (p.type === 'minors') return decide(c, { type: 'minors' });
    // Auto-play can negotiate offers but never elects retirement for the user.
    if (p.type === 'fa') {
      const cur = p.offers.findIndex(o => o.isCur);
      // Winning multiple titles rewrites free-agency incentives in this alternate history.
      const recent=c.seasons.filter(s=>!s.minors && fr(s.team)===c.franchise).slice(-3);
      const champions=recent.filter(s=>s.champion).length;
      const winning=recent.length ? recent.reduce((a,s)=>a+s.w/Math.max(1,s.w+s.l),0)/recent.length : 0;
      if (cur >= 0 && (champions>=2 || (winning>=.73 && c.me.traits.loyalty>=40) || c.me.traits.loyalty>78))
        return decide(c, {type:'sign',i:cur});
      const tierScore = { Contender: 3, 'Playoff team': 2, Fringe: 1, Rebuilding: 0 };
      const score = o => {
        const legacyFit=o.isCur && champions ? 20 + champions * 10 : o.isCur && winning>=.60 ? 8 : 0;
        const loyaltyFit=o.isCur ? Math.max(0,(c.me.traits.loyalty-50)/3) : 0;
        const roleFit=o.role==='Number one option' ? 8 : o.role==='Star role' ? 5 : 0;
        return legacyFit + loyaltyFit + roleFit + (c.me.ovr>=80 ? tierScore[o.tier]*9 : tierScore[o.tier]*3) + o.amount / HL.salaryScale(c.yr)*.23;
      };
      let best = 0;
      p.offers.forEach((o, i) => { if (score(o) > score(p.offers[best])) best = i; });
      return decide(c, { type: 'sign', i: best });
    }
    decide(c, { type: 'stay' });
  }

  function end(c, why) {
    c.done = true; c.end = why; c.pending = null;
    c.legacy = legacyOf(c.seasons, c);
  }

  async function simRest(c, onProgress, seasons = 10, interactive = false) {
    // Long-lived builds must remain playable. Advance in bounded, saveable
    // batches rather than silently ending the career at a fixed age.
    let guard = 0;
    while (!c.done && !c.cancelled && guard++ < seasons) {
      if (interactive && c.pendingStory) break;
      if (shouldPauseAuto(c)) {c.autoPaused='Two seasons without NBA demand. Choose a manual comeback attempt or retirement.';break;}
      if (c.pending) autoDecide(c);
      if (c.done) break;
      await playSeason(c);
      if(c.cancelled)break;
      await offseason(c);
      if(c.cancelled)break;
      if(shouldPauseAuto(c)){c.autoPaused='Two seasons without NBA demand. Choose a manual comeback attempt or retirement.';break;}
      if (!interactive && c.pendingStory) HL.Story.chooseDecision(c,'b');
      onProgress && onProgress(c);
      if (interactive && c.pendingStory) break;
      await new Promise(r => setTimeout(r, 0));
    }
  }


  // The generated league's award field is sampled from real possessions in
  // CURRENT rosters: new rookies, improving players and aging stars.
  function generatedAwardField(L) {
    if(L._careerAwardYear===L.season && L._careerAwardField)return L._careerAwardField;
    const totals=new Map(), sampled={};
    for(const t of L.teams)sampled[t.id]=0;
    const rules={...L.rules,profile:L.profile};
    for(const gm of R.shuffle(L.schedule.slice())) {
      if(sampled[gm.home]>=8||sampled[gm.away]>=8)continue;
      const home=L.teams[gm.home],away=L.teams[gm.away];
      const team=t=>({id:t.id,abbr:t.abbr,strategy:t.strategy||HL.DEFAULT_STRATEGY(),
        players:HL.League.teamPlayers(t.id).sort((a,b)=>b.ovr-a.ovr).slice(0,15)});
      const result=HL.simGame(team(home),team(away),rules);
      sampled[home.id]++;sampled[away.id]++;
      for(const side of [result.home,result.away])for(const [id,box] of Object.entries(side.box||{})){
        if(!box.gp)continue;
        const pid=+id,acc=totals.get(pid)||{g:0,pts:0,reb:0,ast:0,min:0};
        acc.g+=box.gp;acc.pts+=box.pts||0;
        acc.reb+=(box.orb||0)+(box.drb||0);acc.ast+=box.ast||0;acc.min+=box.min||0;
        totals.set(pid,acc);
      }
    }
    const field=[];
    for(const p of Object.values(L.players)){
      if(p.retired||p.teamId==null)continue;
      const x=totals.get(p.id);
      if(!x||x.g<2)continue;
      const team=L.teams[p.teamId],mpg=x.min/Math.max(1,x.g);
      const g=Math.round(L.games*HL.clamp(.86+((p.attrs.dur||75)-75)*.002,.68,.96));
      const row={pts:x.pts/x.g,trb:x.reb/x.g,ast:x.ast/x.g,g};
      const wp=team.real.w/Math.max(1,team.real.w+team.real.l);
      field.push({pid:p.id,name:p.name,row,player:p,wp,
        qual:x.g>=4&&mpg>=15&&g>=L.games*.7,
        v:voteValue(row.pts,p.ovr,row.trb,row.ast,g,L.games),
        def:defValue(p.attrs,g,L.games)*(mpg<18?.7:1)});
    }
    L._careerAwardField=field;
    L._careerAwardYear=L.season;
    return field;
  }

  // ---------- one season: real schedule, awards voted against the real field, playoff path ----------
  function simSeason(L, team, me, missed, role='balanced',pressPledge=null) {
    const roster = HL.League.teamPlayers(team.id).sort((a, b) => b.ovr - a.ovr).slice(0, 14);
    const historical=L.season<=HL.LATEST_SEASON;
    const realRows=historical?HL.History.seasonRows(String(L.season)):[];
    const stars=realRows.filter(r=>r.g>=L.games/2).sort((a,b)=>b.ovr-a.ovr).slice(0,10);
    const starMin=historical?Math.min(44,stars.reduce((n,r)=>n+r.mpg,0)/Math.max(1,stars.length)):36;
    me.teamId = team.id;
    const selectedRole=customizeRole(me,role);
    // The coach slots him by where he ranks on the roster; the real players' minutes shrink to make room.
    const rankOnTeam = roster.filter(p => p.ovr > me.ovr).length;
    const byRank = [36, 34, 32, 30, 28, 25, 22, 19, 15, 12, 8];
    me.realMpg = Math.min(starMin, byRank[Math.min(rankOnTeam, byRank.length - 1)] * Math.max(1, starMin / 36));
    const originalMinutes=roster.map(p=>[p,p.realMpg]);
    const othersMin = roster.filter(p => p.realMpg).reduce((a, p) => a + p.realMpg, 0);
    const room = 240 - me.realMpg;
    if (othersMin > room) for (const p of roster) if (p.realMpg) p.realMpg *= room / othersMin;
    me.minutesLock = true;
    me.stats = {}; me.injury = null;
    const strategy=HL.DEFAULT_STRATEGY();
    strategy.focus=selectedRole.focus;
    strategy.usageLock={[me.id]:selectedRole.usage};
    const tObj={id:team.id,abbr:team.abbr,strategy,players:[me,...roster]};
    const rules = Object.assign({}, L.rules, { profile: L.profile });
    const objOf = t => ({ id: t.id, abbr: t.abbr, strategy: t.strategy, players: HL.League.teamPlayers(t.id) });
    const line = HL.blankStatLine(), pline = HL.blankStatLine();
    const highs = {}, counts = { g30: 0, g40: 0, g50: 0, td: 0, dd: 0 };
    const note = (b, opp, won, sc, playoffs) => {
      const reb = b.orb + b.drb;
      const vals = { pts: b.pts, reb, ast: b.ast, stl: b.stl, blk: b.blk };
      for (const k in vals) if (!highs[k] || vals[k] > highs[k].v) highs[k] = { v: vals[k], opp: opp.name, won, sc, playoffs, line: `${b.pts} pts, ${reb} reb, ${b.ast} ast` };
      if (b.pts >= 30) counts.g30++;
      if (b.pts >= 40) counts.g40++;
      if (b.pts >= 50) counts.g50++;
      const tens = Object.values(vals).filter(v => v >= 10).length;
      if (tens >= 3) counts.td++; else if (tens >= 2) counts.dd++;
    };
    let w = 0, l = 0, gi = 0;
    for (const gm of L.schedule) {
      if (gm.home !== team.id && gm.away !== team.id) continue;
      me.injury = gi++ >= missed ? null : { name: 'Injured', games: 1 };
      const home = gm.home === team.id;
      const opp = L.teams[home ? gm.away : gm.home];
      const res = home ? HL.simGame(tObj, objOf(opp), rules) : HL.simGame(objOf(opp), tObj, rules);
      const mine = home ? res.home : res.away, theirs = home ? res.away : res.home;
      const won = mine.score > theirs.score;
      if (won) w++; else l++;
      const b = mine.box[me.id];
      if (b) { for (const k in line) line[k] += b[k] || 0; note(b, opp, won, `${mine.score}-${theirs.score}`, false); }
      for (const p of tObj.players) if (p !== me) p.injury = null;
    }
    me.injury = null;
    const g = line.gp || 0, games = w + l;
    const ppg = g ? line.pts / g : 0, rpg = g ? (line.orb + line.drb) / g : 0, apg = g ? line.ast / g : 0;
    const wp = games ? w / games : 0;

    // ---- Awards: voted against that season's real players (with voting noise) ----
    const RA=historical?realAwards(L.season):{};
    const field=historical?realRows.map(r=>{
      const main=r.stints.slice().sort((a,b)=>b[1]-a[1])[0];
      const t=L.teams.find(x=>x.bref===main[0]);
      return {pid:r.pid,name:nameOf(r.pid),row:r,v:voteValue(r.pts,r.ovr,r.trb,r.ast,r.g,L.games),wp:t?realWp(t):.5,
        def:defValue(HL.History.unpack(r.attrs,HL.HISTORY.attrs),r.g,L.games),qual:r.g>=L.games*.7};
    }):generatedAwardField(L);
    const competitorName=pid=>field.find(f=>f.pid===pid)?.name||nameOf(pid);
    const mine = { v: voteValue(ppg, me.ovr, rpg, apg, g, L.games) + R.normal(0, 1.2), wp };
    const mvpScore = x => x.v + (x.wp - 0.5) * 90;
    const myDef = defValue(me.attrs, g, L.games) + R.normal(0, 1.5);
    const ranks = {
      value: field.filter(f => f.v > mine.v).length + 1,
      mvp: field.filter(f => mvpScore(f) > mvpScore(mine)).length + 1,
      dpoy: field.filter(f => f.def > myDef).length + 1,
    };
    const above = ranks.value - 1;
    const awards = [], altered = [];
    const nAllNba=historical?['All-NBA 1st','All-NBA 2nd','All-NBA 3rd'].map(k=>(RA[k]||[]).length):[5,5,5];
    const nAllStar=historical?(RA['All-Star']||[]).length:24;
    const realMvp=historical?(RA['nba mvp']||[])[0]:field.slice().sort((a,b)=>
      (b.v+(b.wp-.5)*90)-(a.v+(a.wp-.5)*90))[0]?.pid;
    if(realMvp!=null&&g>=L.games*.7&&ranks.mvp===1){
      awards.push({award:'MVP',over:competitorName(realMvp)});
      altered.push('MVP over '+competitorName(realMvp));
    }
    if (nAllNba[0] && above < nAllNba[0]) awards.push('All-NBA 1st');
    else if (nAllNba[1] && above < nAllNba[0] + nAllNba[1]) awards.push('All-NBA 2nd');
    else if (nAllNba[2] && above < nAllNba[0] + nAllNba[1] + nAllNba[2]) awards.push('All-NBA 3rd');
    if (nAllStar && g >= L.games * 0.4 && above < nAllStar) awards.push('All-Star');
    const realDpoy=historical?(RA['nba dpoy']||[])[0]:field.slice().sort((a,b)=>b.def-a.def)[0]?.pid;
    if(realDpoy!=null&&g>=L.games*.7&&ranks.dpoy===1){
      awards.push({award:'DPOY',over:competitorName(realDpoy)});
      altered.push('Defensive Player of the Year over '+competitorName(realDpoy));
    }
    const rookieField=field.filter(f=>f.player?.yearsPro===0);
    const realRoy=historical?(RA['nba roy']||[])[0]:rookieField.slice().sort((a,b)=>b.v-a.v)[0]?.pid;
    if(me.age===19&&realRoy!=null){
      const rr=field.find(f=>f.pid===realRoy);
      if(rr&&mine.v>rr.v){
        awards.push({award:'ROY',over:competitorName(realRoy)});
        altered.push('Rookie of the Year over '+competitorName(realRoy));
      }
    }
    // Statistical titles: per game, against qualified real players.
    for (const [lab, mineV, key] of [['Scoring title', ppg, 'pts'], ['Rebounding title', rpg, 'trb'], ['Assists title', apg, 'ast']]) {
      const q = field.filter(f => f.qual).sort((a, b) => b.row[key] - a.row[key])[0];
      if(q&&g>=L.games*.7&&mineV>q.row[key]){
        awards.push({award:lab,over:competitorName(q.pid)});
        altered.push(lab+' ('+mineV.toFixed(1)+') over '+competitorName(q.pid)+' ('+q.row[key].toFixed(1)+')');
      }
    }

    const topRival=field.filter(f=>f.qual).sort((a,b)=>mvpScore(b)-mvpScore(a))[0];
    const rival=topRival?{
      pid:topRival.pid,name:topRival.name||competitorName(topRival.pid),
      win:mvpScore(mine)>mvpScore(topRival),
      myScore:+mvpScore(mine).toFixed(1),theirScore:+mvpScore(topRival).toFixed(1),
      ppg:+topRival.row.pts.toFixed(1)
    }:null;

    const target=pressPledge?.kind==='rival'?
      field.find(f=>String(f.pid)===String(pressPledge.rivalId)&&f.qual):null;
    const pressTarget=pressPledge?.kind==='rival'?{
      pid:pressPledge.rivalId,available:!!target,
      name:target?.name||pressPledge.rivalName||'Challenged rival',
      won:target?mvpScore(mine)>mvpScore(target):null,
      myScore:+mvpScore(mine).toFixed(1),
      theirScore:target?+mvpScore(target).toFixed(1):null
    }:null;

    // ---- Playoffs: that year's qualifying spots, format and opponents ----
    const fmt = HL.playoffFormat(L.season);
    const realPlayoff = L.teams.filter(t => t.real.playoffs);
    const spots = realPlayoff.length || fmt.perConf * 2;
    const others = L.teams.filter(t => t.id !== team.id).map(t => ({ t, wp: realWp(t) })).sort((a, b) => b.wp - a.wp);
    const seed = others.filter(o => o.wp > wp).length + 1;
    const rounds = fmt.bestOf.length;
    const made = seed <= spots;
    const series = [];
    let round = 0, champion = false;
    const pbox = {};
    if (made) {
      // Bracket: his conference's playoff teams until the Finals, then the other conference's best.
      const confs = [...new Set(L.teams.map(t => t.conf))];
      const split = confs.length > 1;
      const perConf = split ? Math.round(spots / confs.length) : spots;
      const confPool = others.filter(o => !split || o.t.conf === team.conf).slice(0, perConf - 1);
      const otherPool = split ? others.filter(o => o.t.conf !== team.conf).slice(0, perConf) : [];
      const confSeed = confPool.filter(o => o.wp > wp).length + 1;
      const played = new Set();
      const start = fmt.byes && confSeed <= fmt.byes ? 1 : 0;
      round = start;
      if (start) series.push({ round: 0, name: roundName(0, rounds, L.season), bye: true });
      for (let r = start; r < rounds; r++) {
        const finals = r === rounds - 1;
        let cands = (finals && split ? otherPool : confPool).filter(o => !played.has(o.t.id));
        if (!cands.length) cands = others.filter(o => !played.has(o.t.id));
        let pickO;
        if (finals) pickO = cands[R.chance(0.6) || cands.length < 2 ? 0 : R.chance(0.6) || cands.length < 3 ? 1 : 2];
        else if (r === start) pickO = cands[HL.clamp(cands.length - confSeed, 0, cands.length - 1)]; // mirror seed: 1 plays 8
        else pickO = cands[R.chance(0.65) || cands.length < 2 ? 0 : 1]; // the stronger survivors
        const oppT = pickO.t;
        played.add(oppT.id);
        const need = Math.ceil(fmt.bestOf[r] / 2);
        let sw = 0, sl = 0;
        while (sw < need && sl < need) {
          const home = (sw + sl) % 2 === 0;
          const res = home ? HL.simGame(tObj, objOf(oppT), rules) : HL.simGame(objOf(oppT), tObj, rules);
          const a = home ? res.home : res.away, b = home ? res.away : res.home;
          const won = a.score > b.score;
          if (won) sw++; else sl++;
          for (const id in a.box) { const x = pbox[id] = pbox[id] || HL.blankStatLine(); for (const k in x) x[k] += a.box[id][k] || 0; }
          const mb = a.box[me.id];
          if (mb) { for (const k in pline) pline[k] += mb[k] || 0; note(mb, oppT, won, `${a.score}-${b.score}`, true); }
        }
        series.push({ round: r, name: roundName(r, rounds, L.season), opp: metaOf(oppT), oppRec: `${oppT.real.w}-${oppT.real.l}`, w: sw, l: sl, won: sw === need });
        if (sw < need) break;
        round++;
      }
      champion = round === rounds;
      if (champion) {
        awards.push('Champion');
        // Finals MVP: the best playoff run on the team.
        const pv = b => b.pts + 0.7 * (b.orb + b.drb) + 0.8 * b.ast + b.stl + b.blk;
        const best = Object.entries(pbox).sort((a, b) => pv(b[1]) - pv(a[1]))[0];
        if (best && +best[0] === me.id) awards.push('Finals MVP');
      }
    }
    const realChamp = HL.HISTORY.champions[String(L.season)];
    const rcT = realChamp && L.teams.find(t => t.bref === realChamp);
    if (champion && realChamp && LIN()[realChamp] !== LIN()[team.bref]) altered.push(`Won the title that went to the ${rcT ? rcT.name : realChamp}`);
    const mates = roster.filter(p => p.id !== me.id).slice(0, 3).map(p => ({ name: p.name, ovr: p.ovr, nbaId: p.nbaId, pos: p.pos }));
    // The temporary MyPlayer rotation must never corrupt the persistent NBA roster.
    for(const [p,minutes] of originalMinutes)p.realMpg=minutes;
    return {
      g, line, pline, ppg, rpg, apg, leagueSource:historical?'Historical':'Generated', rivalCount:field.length,
      ts: (line.fga + 0.44 * line.fta) ? line.pts / (2 * (line.fga + 0.44 * line.fta)) : 0,
      w, l, seed, spots, made, series, rounds, playoffRound: round, champion, awards, altered, ranks, highs, counts, mates,rival,pressTarget,
      realChamp: rcT ? fullName(rcT) : realChamp || null, games: L.games, nTeams: L.teams.length,
    };
  }
  function roundName(r, rounds, season) {
    const fromEnd = rounds - 1 - r;
    const div = season < 1970;
    return ['Finals', div ? 'Division finals' : 'Conference finals', div ? 'Division semifinals' : 'Conference semifinals', 'First round'][fromEnd] || 'First round';
  }

  // Same formula as real careers in HL.HISTORY.legacy (tools/build-history.py).
  function legacyOf(seasons, career) {
    const W = HL.HISTORY.legacyWeights;
    let score = 0;
    for (const s of seasons) score += Math.pow(Math.max(0, s.ovr - 72), 1.6) / 10 * Math.min(1, s.g / 82);
    const count = name => career.awards.filter(a => a.award === name).length;
    score += W.MVP * count('MVP') + W.Ring * career.rings + W['All-NBA 1st'] * count('All-NBA 1st') + W['All-NBA 2nd'] * count('All-NBA 2nd') + W['All-NBA 3rd'] * count('All-NBA 3rd') + W['All-Star'] * count('All-Star') + W.DPOY * count('DPOY') + W.ROY * count('ROY');
    const real = Object.entries(HL.HISTORY.legacy).map(([pid, v]) => ({ pid, score: v[0], v })).sort((a, b) => b.score - a.score);
    const rank = real.filter(r => r.score > score).length + 1;
    const closest = real.slice().sort((a, b) => Math.abs(a.score - score) - Math.abs(b.score - score))[0];
    return { score: Math.round(score * 10) / 10, rank, closest, top: real[0] };
  }

  function verdict(c) {
    const lg = c.legacy, n = c.seasons.filter(s => !s.minors).length;
    if (!n) return ['NEVER MADE IT', `${c.pick ? `Drafted #${c.pick}, but` : 'Undrafted, and'} never played an NBA game. ${c.seasons.length} season${c.seasons.length === 1 ? '' : 's'} in the minors and overseas.`];
    const dossier=HL.Legacy.careerReport(c);
    const strongest=HL.HISTORY.players[lg.top.pid][0];
    if(lg.rank===1 && dossier.goatQualified)
      return ['GOAT FRONT-RUNNER', `The historical model places this career first, ahead of ${strongest}. The championships, elite seasons and sustained production make a formidable case, though eras and teammates keep the debate open.`];
    if(lg.rank<=3 && dossier.goatQualified)
      return ['GOAT CONTENDER', `Top ${lg.rank} by career impact, with enough peak dominance, longevity and playoff success for a genuine all-time argument.`];
    if(lg.rank===1)
      return ['HISTORIC PEAK', `First in the legacy model, but a GOAT verdict requires a longer, more complete résumé. Historical rank and overall greatness are not the same question.`];
    if(lg.rank <= 10) return ['ALL-TIME GREAT', `#${lg.rank} on the historical model. A basketball icon with a résumé worth weighing across eras.`];
    if (lg.rank <= 75) return ['HALL OF FAMER', `#${lg.rank} all-time. First-ballot.`];
    if (lg.rank <= 160) return ['SUPERSTAR', `#${lg.rank} all-time. A borderline Hall of Fame career.`];
    if (lg.rank <= 350) return ['ALL-STAR', `#${lg.rank} all-time. A very good career.`];
    const top10 = c.pick && c.pick <= 10;
    if (n <= 3) return [top10 ? 'BUST' : 'OUT OF THE LEAGUE', top10 ? `A top-${c.pick} pick who was out of the league in ${n} seasons.` : `Out of the league after ${n} season${n === 1 ? '' : 's'}.`];
    const avg = c.seasons.filter(s => !s.minors).reduce((s, x) => s + x.ovr, 0) / n;
    if (avg >= 76) return ['STARTER', 'A long, solid career as a starter.'];
    if (avg >= 70) return ['ROLE PLAYER', 'Carved out a career doing the little things.'];
    return [top10 ? 'BUST' : 'BENCH WARMER', top10 ? 'Never lived up to the draft slot.' : 'Waved the towel with pride.'];
  }

  // ---------- UI ----------
  const tm = fr => HL.TEAMS.find(t => t.abbr === fr);
  const pg = (tot, k) => tot.g ? tot[k] / tot.g : 0;
  const pctOf = (m, a) => a ? (m / a * 100).toFixed(1) : '—';
  const awardName = a => a.award || a;
  const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;

  function render(revealHand) {
    if (!st) return setupScreen();
    const c = st.career;
    const done = !remaining().length;
    const hide = st.mode === 'hoopiq';
    if (c && c.teamMeta && !c.minors) U.applyTeamTheme(c.teamMeta); else U.applyTeamTheme(st.team && !done ? tm(st.team) : null);
    U.setEra(c ? HL.eraForSeason(Math.min(c.yr, HL.LATEST_SEASON)) : 'modern');
    let main;
    if (st.busy) main = busyView();
    else if (c && c.done) main = resultView();
    else if (c && c.stage === 'draft') main = draftNightView();
    else if (c) main = hubView();
    else if (done) main = builtView();
    else if (st.phase === 'wildchoice') main = wildcardView();
    else if (st.phase === 'choose-skill' && st.draftStyle === 'free') main = freeSkillChoiceView(hide);
    else main = draftView(hide, revealHand);
    const side = c ? careerSide(c) : buildSide(done, hide);
    U.app().innerHTML = `<div class="frame"><div class="masthead"><div class="bar"><div class="wordmark" data-home>Hoops<i>Life</i></div><div class="mainnav"><button class="on">Skill Draft Career</button></div>
      <div class="simbar">${c ? `<span class="t2 sm">${c.done ? 'Career over' : `${yrLabel(c.yr)} · Age ${c.age}`}</span>` : `<span class="t2 sm">${CATS.length - remaining().length}/${CATS.length} skills</span>`}${FX.soundToggle()}<button class="btn small" data-new>New run</button></div></div></div>
      <div class="page">${c && !c.done && c.stage !== 'draft' && !st.busy ? teamBand(c) : ''}<div class="cols c-main"><div class="stack" style="gap:16px">${main}</div><div class="stack" style="gap:16px">${side}</div></div></div></div>`;
    bind();
    if (revealHand && st.draftStyle !== 'free') {
      const cards=[...document.querySelectorAll('.hand .gcard')];
      FX.flipIn(cards).catch(()=>cards.forEach(c=>{c.classList.remove('down','charging');c.classList.add('up');}));
    }
  }

  function busyView() {
    const b = st.busy;
    return `<section class="block"><div class="body"><h3>${esc(b.title)}</h3><div class="t2 sm" style="margin-top:6px">${esc(b.sub || '')}</div><div class="simcard" style="width:auto;border:0;padding:0"><div class="track"><i style="width:${b.pct || 0}%"></i></div></div></div></section>`;
  }

  function buildSide(done, hide) {
    const dna=HL.DNA.analyze(Object.entries(st.picks).map(([cat,pk])=>({pid:pk.row.pid,cat,row:pk.row,season:pk.season})));
    const prime = done ? buildPrime() : null;
    const tiles = CATS.map(cat => {
      const [id, label] = cat;
      const pk = st.picks[id];
      if (!pk) return `<div class="tile ${st.cat === id ? 'next' : ''}" data-cat="${id}"><span class="lab">${esc(label)}</span><span class="val t3">—</span><span class="who">${st.cat === id ? 'Drafting now' : ''}</span></div>`;
      const bio = HL.HISTORY.players[pk.row.pid];
      const v = skillValue(pk, cat);
      return `<div class="tile on t-${FX.tierOf(v).key}" data-cat="${id}"><span class="lab">${esc(label)}</span><span class="val">${hide ? '?' : id === 'body' ? HL.fmtHeight(bio[3]) : v}</span><span class="who">${esc(bio[0])} · ${yrLabel(pk.season)}</span></div>`;
    }).join('');
    return `${HL.DNA.board(dna,{compact:true})}<section class="block"><header><h3>Your build</h3><span class="ml-auto t3 sm">${CATS.length - remaining().length}/${CATS.length}</span>${prime && !hide ? `<span>${U.rating(HL.computeOvr(prime.attrs, prime.pos))}</span>` : ''}</header><div class="body"><div class="board">${tiles}</div></div></section>`;
  }

  function buildDetail(prime) {
    const groups = [...new Set(HL.ATTRS.map(a=>a.group))];
    return `<details class="skill-detail" open><summary>Full rating breakdown · ${prime.pos} · ${HL.computeOvr(prime.attrs,prime.pos)} OVR</summary><div class="skill-ratings">${groups.map(g=>`<div class="skill-rating-group"><b>${esc(g)}</b>${HL.ATTRS.filter(a=>a.group===g).map(a=>`<div class="skill-rating-row"><span>${esc(a.label)}</span><strong>${prime.attrs[a.key] ?? 25}</strong></div>`).join('')}</div>`).join('')}</div><div class="skill-ratings">${Object.entries(prime.tendencies).map(([k,v])=>`<div class="skill-rating-row"><span>${esc(k)}</span><strong>${v}</strong></div>`).join('')}</div><p class="t3 sm">Advanced ratings such as shot decision-making and release elevation are modeled scouting estimates. Shot-diet and usage numbers are frequency preferences on a 0–100 scale, <b>not skill grades</b>; low post or three-point frequency is not a weakness by itself. The simulation uses both separately.</p></details>`;
  }

  function wildcardView() {
    const c=st.wildCandidate,bio=HL.HISTORY.players[c.row.pid],open=remaining();
    return `<section class="block dna-legend-screen"><div class="body stack"><div class="dna-legend-title">✦ LEGENDARY WILDCARD</div><h2>${esc(bio[0])} · ${c.season}</h2><p>Choose ANY unfilled skill to inherit. This legendary card also carries its own signature DNA into the simulation.</p><div class="dna-choice-grid">${open.map(id=>{const cat=catOf(id),val=skillValue(c,cat);return `<button class="dna-choice" data-wild-cat="${id}"><b>${esc(cat[1])}</b><strong>${val}</strong></button>`;}).join('')}</div></div></section>`;
  }

  function builtView() {
    return `<section class="block"><div class="body stack"><h3>Your player is built</h3>
      <div class="setting"><div class="grow"><b>Name</b></div><input type="text" value="${esc(st.name)}" data-name maxlength="30"></div>
      <div class="setting"><div class="grow"><b>Draft class</b><div class="d">He enters the real league in this draft and plays every season against the real rosters of that year.</div></div>${debutSelect()}</div>
      <div class="setting"><div class="grow"><b>Choose your position</b><div class="d">Your choice changes OVR weighting, lineup role, matchups and minutes. No height restriction, so unusual builds are allowed.</div></div><select data-position><option value="auto" ${st.pos==='auto'?'selected':''}>Auto: best fit</option>${HL.POSITIONS.map(p=>`<option value="${p}" ${st.pos===p?'selected':''}>${p} · ${p==='PG'?'Point Guard':p==='SG'?'Shooting Guard':p==='SF'?'Small Forward':p==='PF'?'Power Forward':'Center'}</option>`).join('')}</select></div>
      ${(() => {const b=buildPrime(),w=primeWindow({prime:b});return `<section class="block subtle"><div class="body"><div class="cols c2"><div><b>Prime window</b><div class="t2">Age ${w.start}–${w.end} (${w.seasons} seasons) · duration ${b.primeLength}/99</div></div><div><b>Longevity ${b.longevity}/99</b><div class="t2">Controls aging decline and late-career viability; no fixed retirement age</div></div></div><div class="t3 sm" style="margin-top:8px">Position changes how your complete build is evaluated and matched up. Your drafted shot diet and scorer mentality stay active throughout the career.</div></div></section>`;})()}
      <div class="gf-launch"><div class="grow"><div class="caps">NEW · EXPERIMENTAL PLAYER ENGINEERING</div><h3>Genesis Fusion Laboratory</h3><p>Fuse any pair from the historical archive. Recombine successful fusions with new players or other creations. Even incompatible stars can produce rare paradox outcomes. Odds are shown before every attempt, and the outcome can alter your actual career skills.</p></div><button class="btn go big" data-open-fusion>OPEN FUSION LAB</button></div>
      ${st.fusionEquipped?'<div class="gf-equipped"><b>FUSION EQUIPPED · '+esc(st.fusionEquipped.name)+'</b><p>Generation '+st.fusionEquipped.depth+' · '+st.fusionEquipped.ovr+' donor OVR · '+esc(st.fusionEquipped.family)+' · '+st.fusionEquipped.ancestry.length+' ancestry entries. The physique and real gameplay mechanics are reflected in the full ratings panel below.</p><button class="btn small" data-unequip-fusion>Remove fusion</button></div>':''}
      ${HL.DNA.board(buildPrime().dna)}
      ${buildPrime().constraints.length?`<section class="block"><div class="body"><h3>How your tools work together</h3>${buildPrime().constraints.map(x=>`<p class="t2 sm"><b>${esc(x.key)}: ${x.ceiling} drafted → ${x.effective} executable.</b> ${esc(x.reason)}</p>`).join('')}</div></section>`:''}
      ${buildDetail(buildPrime())}
      <div class="row wrap" style="gap:10px"><button class="btn go big" data-begin="season">Play it season by season</button><button class="btn big" data-begin="auto">Sim next 10 seasons</button></div>
      <div class="t3 sm">Chemistry DNA improves specific possession outcomes. Historical and fictional duos and trios can activate independently; rare mutations are revealed automatically. Body, strength, elevation and basketball tools determine what your player can execute. The prime window supports learned skill; physical decline and injuries can still reduce athleticism during it.</div>
      <div class="t3 sm">Season by season: see every season's numbers, awards and playoff run, then choose free agency offers, ask for trades or retire. Simming the whole career makes those calls for you.</div>
    </div></section>`;
  }

  function debutSelect() {
    const years = [];
    for (let y = HL.LATEST_SEASON; y >= 1947; y--) years.push(y);
    return `<select data-debut>${years.map(y => `<option value="${y}" ${y === st.debut ? 'selected' : ''}>${y} draft · ${yrLabel(y)} season${y > HL.LATEST_SEASON - 15 ? ' (future seasons generate rookies and evolving rosters)' : ''}</option>`).join('')}</select>`;
  }

  function teamBand(c) {
    const t = c.teamMeta;
    const live = c.contract && !c.minors && c.contract.through >= c.yr;
    const ctr = live ? `${U.money(c.contract.amount)}` : c.minors ? '—' : 'FA';
    return `<div class="teamband">
      <div class="flag">${t && !c.minors ? U.logo(t, 64) : ''}</div>
      <div class="ident"><div class="city">${c.minors ? 'Minor leagues' : esc(fullName(t))} · ${yrLabel(c.yr)}</div><div class="name">${esc(c.me.name)}</div><div class="t3 sm">${esc(c.me.pos)} · ${HL.fmtHeight(c.me.height)} · ${c.me.weight} lb${c.pick ? ` · #${c.pick} pick, ${c.debut}` : ` · undrafted, ${c.debut}`}</div></div>
      <div class="facts">
        <div class="fact"><b>${c.me.ovr}</b><span>Overall</span></div>
        <div class="fact"><b>${c.age}</b><span>Age</span></div>
        <div class="fact"><b>${c.seasons.filter(s => !s.minors).length}</b><span>Seasons</span></div>
        <div class="fact"><b>${c.rings}</b><span>Rings</span></div>
        <div class="fact"><b>${ctr}</b><span>${live ? `Thru ${yrLabel(c.contract.through)}` : 'Contract'}</span></div>
      </div></div>`;
  }

  function draftNightView() {
    const c = st.career;
    const cls = c.draftClass || [];
    const t = c.teamMeta;
    return `<section class="block"><header><h3>Draft night · ${c.debut}</h3></header><div class="body stack">
        <div class="row" style="gap:16px">${t && !c.minors ? U.logo(t, 72) : ''}<div><div class="caps">${c.pick ? `Pick #${c.pick}` : 'Undrafted'}</div><h2 style="font-size:30px">${c.minors ? 'No team called his name' : `${esc(fullName(t))}`}</h2><div class="t2">${esc(c.log[c.log.length - 1].text)}${c.contract && !c.minors ? ` · ${esc(c.contract.kind)}, ${U.money(c.contract.amount)} a year through ${yrLabel(c.contract.through)}` : ''}</div></div></div>
        <div class="kv"><span>Rookie rating</span><b>${c.me.ovr} OVR</b></div>
        <div class="kv"><span>Achievable prime (age 28–29)</span><b>${c.primeOvr} OVR</b></div>
        <div class="kv"><span>Work ethic</span><b>${c.me.traits.workEthic >= 75 ? 'Gym rat' : c.me.traits.workEthic >= 55 ? 'Solid' : c.me.traits.workEthic >= 40 ? 'Inconsistent' : 'Questionable'}</b></div>
        ${trainingView(c)}
        <div class="row wrap" style="gap:10px"><button class="btn go big" data-play>Play the ${yrLabel(c.yr)} season</button><button class="btn" data-simrest>Sim next 10 seasons</button></div>
      </div></section>
      ${cls.length ? `<section class="block"><header><h3>The real ${c.debut} draft</h3><span class="ml-auto t3 sm">He joins this class</span></header><div class="body flush">${cls.map(r => `<div class="res-row" style="grid-template-columns:40px 1fr auto;cursor:default"><b class="num">${r.pick}</b><div class="row">${U.face({ name: r.name, nbaId: r.nbaId, real: true }, 26, null)}<span>${esc(r.name)}</span></div><span class="t3 sm">${esc(r.club)}${r.college ? ' · ' + esc(r.college) : ''}</span></div>`).join('')}</div></section>` : ''}`;
  }

  function hubView() {
    const c = st.career;
    const p = c.pending;
    const out = [];
    const sims = `<button class="btn" data-simrest>Sim next 10 seasons</button><button class="btn quiet" data-retire>Retire</button>`;
    if (p) {
      const dev = p.to - p.from;
      const head = `<header><h3>Offseason · ${yrLabel(c.yr)}</h3><span class="ml-auto sm ${dev > 0 ? 'win' : dev < 0 ? 'loss' : 't3'}">Summer: ${p.from} → ${p.to} OVR</span></header>`;
      const notes = p.notes.map(n => `<div class="t2">${esc(n)}</div>`).join('');
      if (p.type === 'fa') {
        out.push(`<section class="block">${head}<div class="body stack">${notes}<div class="t2">${c.contract && !p.notes.length ? `His contract with the ${esc(c.teamMeta.name)} is up.` : ''} ${plural(p.offers.length, 'team')} made an offer.</div>
          <div class="offers">${p.offers.map((o, i) => offerCard(o, i)).join('')}</div>
          <div class="row wrap" style="gap:8px">${sims}</div></div></section>`);
      } else if (p.type === 'minors') {
        out.push(`<section class="block">${head}<div class="body stack">${notes}<div class="row wrap" style="gap:8px"><button class="btn go" data-minors>Keep grinding in the minors</button>${sims}</div></div></section>`);
      } else {
        out.push(`<section class="block">${head}<div class="body stack">${notes}<div class="t2">Under contract with the ${esc(fullName(c.teamMeta))} through ${yrLabel(c.contract.through)} at ${U.money(c.contract.amount)} a year.</div>
          <div class="row wrap" style="gap:8px"><button class="btn go big" data-play>Play the ${yrLabel(c.yr)} season</button><button class="btn" data-trade>Request a trade</button>${sims}</div></div></section>`);
      }
    } else {
      out.push(`<section class="block"><div class="body row wrap" style="gap:10px"><div class="grow"><h3>${yrLabel(c.yr)}</h3><div class="t2 sm">${c.minors ? 'A season in the minor leagues.' : `With the ${esc(fullName(c.teamMeta))}.`}</div></div><button class="btn go big" data-play>Play the season</button><button class="btn" data-simrest>Sim next 10 seasons</button></div></section>`);
    }
    const last = c.seasons[c.seasons.length - 1];
    if(last&&!last.minors&&HL.SkillPress)out.push(HL.SkillPress.panel(c));
    out.push(rolePanel(c));
    if(c.pendingStory){const e=c.pendingStory;out.unshift(`<section class="block dna-story-choice"><div class="body stack"><span class="dna-section-label">A CAREER TURNING POINT</span><h2>${esc(e.title)}</h2><p>${esc(e.subtitle)}</p><div class="row wrap"><button class="btn go" data-story-choice="a">${esc(e.a)}</button><button class="btn" data-story-choice="b">${esc(e.b)}</button></div></div></section>`);}
    if (last) out.push(seasonReport(last));
    out.push(trainingView(c));
    if (c.seasons.length) out.push(milestoneView(c));
    if (c.seasons.length) out.push(rivalryView(c));
    if (c.seasons.length) out.push(careerTable(c));
    if (c.log.length) out.push(timeline(c));
    return out.join('');
  }

  function offerCard(o, i) {
    return `<div class="offer"><div class="row">${U.logo(o.team, 40)}<div class="grow"><div class="nm">${esc(o.team.city)} ${esc(o.team.name)}</div><div class="t3 xs">${o.isCur ? 'His team · Bird rights' : esc(o.tier)}${o.last ? ` · ${o.last} last season` : ''}</div></div></div>
      <div class="kv"><span>Contract</span><b>${o.years} yr${o.years > 1 ? 's' : ''} · ${U.money(o.amount)}/yr</b></div>
      <div class="kv"><span>Role</span><b>${esc(o.role)}</b></div>
      <div class="mates">${o.top.map(m => `<div class="row sm">${U.face({ name: m.name, nbaId: m.nbaId, real: true }, 22, o.team)}<span class="grow">${esc(m.name)}</span>${U.rating(m.ovr)}</div>`).join('')}</div>
      <button class="btn" data-sign="${i}">${o.isCur ? 'Re-sign' : 'Sign'}</button></div>`;
  }

  function statStrip(l, g, mpg) {
    const t = { g, pts: l.pts, reb: l.orb != null ? l.orb + l.drb : l.reb, ast: l.ast, stl: l.stl, blk: l.blk };
    const d = x => g ? (x / g).toFixed(1) : '0.0';
    const cells = [['GP', g], ['MPG', mpg], ['PTS', d(t.pts)], ['REB', d(t.reb)], ['AST', d(t.ast)], ['STL', d(t.stl)], ['BLK', d(t.blk)], ['FG%', pctOf(l.fgm, l.fga)], ['3P%', pctOf(l.tpm, l.tpa)], ['FT%', pctOf(l.ftm, l.fta)], ['TS%', (l.fga + 0.44 * l.fta) ? (l.pts / (2 * (l.fga + 0.44 * l.fta)) * 100).toFixed(1) : '—']];
    return `<div class="statstrip">${cells.map(([k, v]) => `<div><b>${v}</b><span>${k}</span></div>`).join('')}</div>`;
  }

  function seasonReport(s) {
    if (s.minors) return `<section class="block"><header><h3>${yrLabel(s.yr)} · Minor leagues</h3></header><div class="body t2">A year away from the NBA. Rating ${s.ovr}.</div></section>`;
    const l = s.line;
    const po = !s.made ? `Missed the playoffs (${ordinal(s.seed)} best record; ${s.spots} teams qualified)` : s.champion ? '<b>Won the championship</b>' : `Out in the ${s.series.filter(x => !x.bye).slice(-1)[0].name.toLowerCase()}`;
    const ranks = [`MVP voting: ${ordinal(s.ranks.mvp)}`, `Defense: ${ordinal(s.ranks.dpoy)}`, `Impact rank: ${ordinal(s.ranks.value)}`];
    const h = s.highs.pts;
    const cnt = s.counts;
    const extras = [cnt.g40 ? plural(cnt.g40, '40-point game') : '', cnt.g50 ? plural(cnt.g50, '50-point game') : '', cnt.td ? plural(cnt.td, 'triple-double') : '', cnt.dd ? plural(cnt.dd, 'double-double') : ''].filter(Boolean);
    return `<section class="block"><header><h3>${yrLabel(s.yr)} season report</h3><span class="ml-auto row sm">${U.logo(s.team, 22)} ${esc(s.team.name)} · ${s.ovr} OVR</span></header><div class="body stack">
      ${statStrip(l, s.g, s.g ? (l.min / s.g).toFixed(1) : '0.0')}
      ${s.agenda?'<div class="season-goal-report '+(s.agenda.complete?'complete':'')+'"><div><div class="caps">Season contract · '+esc(ROLES[s.role]?.title||'Balanced')+'</div><b>'+esc(s.agenda.title)+'</b><p>'+esc(s.agenda.detail)+'</p></div><strong>'+(s.agenda.complete?'GOAL ACHIEVED':'GOAL MISSED')+'</strong></div>':''}
      ${s.pressResult?'<div class="press-season-outcome '+(s.pressResult.won==null?'void':s.pressResult.won?'delivered':'backlash')+'"><span>PUBLIC PROMISE · '+(s.pressResult.won==null?'NO CONTEST':s.pressResult.won?'DELIVERED':'THE INTERNET KEPT RECEIPTS')+'</span><b>'+esc(s.pressResult.measure)+'</b><small>Fan approval '+(s.pressResult.impact>0?'+':'')+s.pressResult.impact+'. Public perception can influence future offers, not skills.</small></div>':''}
      ${s.rival?'<div class="season-rivalry '+(s.rival.win?'won':'')+'"><div class="caps">SEASON MVP RIVAL · '+
        esc(s.rival.name)+'</div><div class="row wrap"><strong>'+
        (s.rival.win?'RIVAL DEFEATED':'RIVAL WINS THIS ROUND')+'</strong><span class="ml-auto">'+
        s.rival.myScore.toFixed(1)+' vs '+s.rival.theirScore.toFixed(1)+' voting-impact points</span></div>'+
        '<p class="t3 sm">Measured with actual production and winning. Rival averaged '+
        s.rival.ppg.toFixed(1)+' PPG.</p></div>':''}
      ${HL.FanFeed?'<details class="courtside-fold"><summary>Courtside: fictional fan and analyst reactions</summary>'+
        HL.FanFeed.render(HL.FanFeed.skilldraft(s))+'</details>':''}
      
      ${s.leagueRecap ? `<details open><summary>League evolution · new rookies, rising players & scoring rivals</summary>
        <div class="cols c2" style="gap:12px">
        <div class="stack"><div class="caps">New rookie class</div>${s.leagueRecap.rookies.map(p=>`<div class="kv"><span>${esc(p.name)} · ${esc(p.team)}</span><b>${p.ovr} OVR</b></div>`).join('')||'<div class="t3">No rookies in this class</div>'}</div>
        <div class="stack"><div class="caps">Biggest developments</div>${s.leagueRecap.rising.map(p=>`<div class="kv"><span>${esc(p.name)}</span><b>+${p.change} → ${p.ovr}</b></div>`).join('')||'<div class="t3">No significant progress this offseason</div>'}</div>
        <div class="stack"><div class="caps">Scoring-title competitors</div>${s.leagueRecap.scorers.map(p=>`<div class="kv"><span>${esc(p.name)}</span><b>${p.ppg} PPG</b></div>`).join('')||'<div class="t3">No eligible scorers</div>'}</div></div></details>` : ''}
      <details><summary>${s.yr<1979?'No 3-point line · ':''}${yrLabel(s.yr)} era rules</summary><div class="t3 sm">${HL.eraContext(s.yr).facts.map(esc).join(' · ')}</div></details>
      <div class="cols c2"><div class="stack" style="gap:6px">
          <div class="caps">Team</div>
          <div><b class="num" style="font-size:26px">${s.w}-${s.l}</b> <span class="t2">${ordinal(s.seed)} best record of ${s.nTeams} teams</span></div>
          <div class="t2">${po}</div>
          ${s.series.map(x => x.bye ? `<div class="ser t3 sm">${esc(x.name)}: bye</div>` : `<div class="ser"><span class="t3 sm">${esc(x.name)}</span><span class="row sm">${U.logo(x.opp, 18)} ${esc(x.opp.name)} <span class="t3">(${x.oppRec})</span></span><b class="${x.won ? 'win' : 'loss'}">${x.won ? 'W' : 'L'} ${x.w}-${x.l}</b></div>`).join('')}
          ${s.realChamp ? `<div class="t3 sm">Real ${yrLabel(s.yr)} champion: ${esc(s.realChamp)}</div>` : ''}
        </div><div class="stack" style="gap:6px">
          <div class="caps">Honors</div>
          <div class="row wrap" style="gap:6px">${s.awards.length ? s.awards.map(a => `<span class="tag ${['Champion', 'MVP', 'Finals MVP'].includes(awardName(a)) ? 'team' : ''}" ${a.over ? `title="Over ${esc(a.over)}"` : ''}>${esc(awardName(a))}</span>`).join('') : '<span class="t3 sm">None this season</span>'}</div>
          <div class="t2 sm">${ranks.join(' · ')}</div>
          ${h ? `<div class="t2 sm">Season high: ${h.v} points ${h.playoffs ? 'in the playoffs ' : ''}vs the ${esc(h.opp)} (${h.won ? 'W' : 'L'} ${h.sc})</div>` : ''}
          ${extras.length ? `<div class="t2 sm">${extras.join(' · ')}</div>` : ''}
          ${s.injury ? `<div class="loss sm">Missed ${plural(s.injury.games, 'game')}: ${esc(s.injury.name)}${s.injury.lasting ? ' (lasting damage)' : ''}</div>` : ''}
          <div class="caps" style="margin-top:6px">Teammates</div>
          ${s.mates.map(m => `<div class="row sm">${U.face({ name: m.name, nbaId: m.nbaId, real: true }, 24, s.team)}<span class="grow">${esc(m.name)}</span><span class="t3">${esc(m.pos)}</span>${U.rating(m.ovr)}</div>`).join('')}
        </div></div>
      ${s.pline.gp ? `<div class="caps">Playoffs</div>${statStrip(s.pline, s.pline.gp, (s.pline.min / s.pline.gp).toFixed(1))}` : ''}
      ${s.altered.length ? `<div class="caps">History changed</div>${s.altered.map(a => `<div class="sm">${esc(a)}</div>`).join('')}` : ''}
    </div></section>`;
  }

  function careerTable(c) {
    const T = c.totals;
    const rows = c.seasons.map(s => {
      if (s.minors) return `<tr><td class="l">${yrLabel(s.yr)}</td><td>${s.age}</td><td class="l t3">Minor leagues</td><td>${U.rating(s.ovr)}</td><td colspan="12"></td></tr>`;
      const l = s.line, g = s.g || 1;
      const po = !s.made ? '<span class="t3">—</span>' : s.champion ? '<b class="win">Won title</b>' : esc(s.series.filter(x => !x.bye).slice(-1)[0].name.replace('Conference ', 'Conf. ').replace('Division ', 'Div. '));
      return `<tr><td class="l">${yrLabel(s.yr)}${s.leagueSource==='Generated' ? ' <span class="t3 xs" title="Evolving generated-league season">◆</span>' : ''}</td><td>${s.age}</td><td class="l"><div class="row">${U.logo(s.team, 20)} ${esc(s.team.name)}</div></td><td>${U.rating(s.ovr)}</td><td>${s.g}</td><td>${(l.min / g).toFixed(1)}</td><td class="hi">${(l.pts / g).toFixed(1)}</td><td>${((l.orb + l.drb) / g).toFixed(1)}</td><td>${(l.ast / g).toFixed(1)}</td><td>${(l.stl / g).toFixed(1)}</td><td>${(l.blk / g).toFixed(1)}</td><td>${pctOf(l.fgm, l.fga)}</td><td>${pctOf(l.tpm, l.tpa)}</td><td>${s.w}-${s.l}</td><td class="l sm">${po}</td><td class="l sm">${s.awards.filter(a => awardName(a) !== 'Champion').map(a => `<span class="tag ${['MVP', 'Finals MVP'].includes(awardName(a)) ? 'team' : ''}" ${a.over ? `title="Over ${esc(a.over)}"` : ''}>${esc(awardName(a))}</span>`).join(' ')}</td></tr>`;
    }).join('');
    const foot = T.g ? `<tfoot><tr><td class="l" colspan="4">Career</td><td>${T.g}</td><td>${pg(T, 'min').toFixed(1)}</td><td>${pg(T, 'pts').toFixed(1)}</td><td>${pg(T, 'reb').toFixed(1)}</td><td>${pg(T, 'ast').toFixed(1)}</td><td>${pg(T, 'stl').toFixed(1)}</td><td>${pg(T, 'blk').toFixed(1)}</td><td>${pctOf(T.fgm, T.fga)}</td><td>${pctOf(T.tpm, T.tpa)}</td><td colspan="3"></td></tr></tfoot>` : '';
    return `<section class="block"><header><h3>Career</h3><span class="ml-auto t3 sm">${Math.round(T.pts).toLocaleString()} points · ${U.money(c.earnings)} earned</span></header><div class="body flush"><div class="tbl-wrap"><table class="tbl"><thead><tr><th class="l">Season</th><th>Age</th><th class="l">Team</th><th>OVR</th><th>GP</th><th>MPG</th><th>PTS</th><th>REB</th><th>AST</th><th>STL</th><th>BLK</th><th>FG%</th><th>3P%</th><th>Record</th><th class="l">Playoffs</th><th class="l">Honors</th></tr></thead><tbody>${rows}</tbody>${foot}</table></div></div></section>`;
  }

  function timeline(c) {
    const items = [...c.log.map(x => ({ yr: x.yr, text: x.text, k: 'move' })), ...c.altered.map(a => ({ yr: a.season, text: a.text, k: 'alt' }))].sort((a, b) => a.yr - b.yr);
    return `<section class="block"><header><h3>Story so far</h3><span class="ml-auto t3 sm">Moves and the history he changed</span></header><div class="body flush">${items.map(x => `<div class="res-row" style="grid-template-columns:80px 1fr;cursor:default"><span class="t3">${yrLabel(x.yr)}</span><span class="${x.k === 'alt' ? 'hi' : ''}">${x.k === 'alt' ? '<b>History changed:</b> ' : ''}${esc(x.text)}</span></div>`).join('')}</div></section>`;
  }

  function careerSide(c) {
    const nba = c.seasons.filter(s => !s.minors);
    const peak = nba.length ? Math.max(...nba.map(s => s.ovr)) : c.me.ovr;
    const card = HL.GFX.jerseyCard(Object.assign({}, c.me, c.done ? { ovr: peak } : {}), c.minors ? null : c.teamMeta, { sub: c.done ? `Peak rating · ${plural(nba.length, 'season')}` : `${c.minors ? 'Minor leagues' : fullName(c.teamMeta)}` });
    const count = name => c.awards.filter(a => a.award === name).length;
    const cab = ['Champion', 'Finals MVP', 'MVP', 'DPOY', 'ROY', 'All-NBA 1st', 'All-NBA 2nd', 'All-NBA 3rd', 'All-Star', 'Scoring title', 'Rebounding title', 'Assists title'].map(k => [k === 'Champion' ? 'Championships' : k, count(k)]).filter(x => x[1]);
    const H = c.highs;
    const hi = [['Points', H.pts], ['Rebounds', H.reb], ['Assists', H.ast], ['Steals', H.stl], ['Blocks', H.blk]].filter(x => x[1]);
    const cur = Object.fromEntries(CATS.filter(x => x[2].length&&!x[0].startsWith('tend')).map(([id, label, keys]) => [id, [label, avgOf(c.me.attrs, keys), avgOf(c.prime.attrs, keys)]]));
    const habits=CATS.filter(x=>x[0].startsWith('tend')).map(([id,label,keys])=>`<details><summary>${esc(label)}</summary>${keys.map(k=>`<div class="kv"><span>${esc(k)}</span><b>${c.me.tend[k]??'—'}/100</b></div>`).join('')}</details>`).join('');
    return `<div style="max-width:340px">${card}</div>
      <section class="block"><header><h3>Trophy case</h3></header><div class="body">${cab.length ? cab.map(([k, n]) => `<div class="kv"><span>${esc(k)}</span><b>${n}</b></div>`).join('') : '<div class="t3 sm">Empty, for now.</div>'}</div></section>
      ${hi.length ? `<section class="block"><header><h3>Career highs</h3></header><div class="body">${hi.map(([k, h]) => `<div class="kv"><span>${k}</span><b>${h.v} <span class="t3 xs">vs ${esc(h.opp)}, ${yrLabel(h.yr)}${h.playoffs ? ' (playoffs)' : ''}</span></b></div>`).join('')}</div></section>` : ''}
      <section class="block"><header><h3>Ratings</h3><span class="ml-auto t3 sm">Now · ceiling</span></header><div class="body">${Object.values(cur).map(([label, now, top]) => `<div class="meter"><span class="lbl">${esc(label)}</span><span class="val">${now} <span class="t3 xs">/ ${top}</span></span><div class="track"><i class="${now >= 80 ? 'hi' : now < 55 ? 'lo' : 'mid'}" style="width:${now}%"></i></div></div>`).join('')}</div></section>
      <section class="block"><header><h3>Playing habits</h3></header><div class="body stack"><p class="t3 sm">Frequency preferences, rather than skill grades. Open a group to inspect every inherited habit.</p>${habits}</div></section>`;
  }

  function careerDeepReport(c) {
    const active=c.seasons.filter(s=>!s.minors&&s.g>0);
    const best=active.slice().sort((a,b)=>(b.ppg||0)-(a.ppg||0))[0];
    const w=primeWindow(c), yrs=active.length, total=c.totals;
    const ts=total.fga+ .44*total.fta ? (100*total.pts/(2*(total.fga+.44*total.fta))).toFixed(1)+'%' : '—';
    const threes=total.fga? (100*total.tpa/total.fga).toFixed(1)+'%' : '—';
    const ctx=HL.eraContext(c.debut), t=c.me.tend;
    return `<section class="block"><header><h3>Scouting & career analytics</h3></header><div class="body stack">
      <div class="cols c2"><div class="stack"><div class="kv"><span>Seasons played</span><b>${yrs}</b></div><div class="kv"><span>Prime designed</span><b>${w.start}–${w.end} (${w.seasons} years)</b></div><div class="kv"><span>Longevity grade</span><b>${c.prime.longevity}/99</b></div><div class="kv"><span>Career true shooting</span><b>${ts}</b></div></div><div class="stack"><div class="kv"><span>3-point attempt rate</span><b>${threes}</b></div><div class="kv"><span>Shot mentality</span><b>${t.shotHunt}/100 · usage ${t.usage}/100</b></div><div class="kv"><span>Playmaking inclination</span><b>${t.passFirst}/100 · move ball ${t.moveBall}/100</b></div><div class="kv"><span>Highest scoring season</span><b>${best?`${yrLabel(best.yr)} · ${(best.ppg||0).toFixed(1)} PPG`:'—'}</b></div></div></div>
      <details><summary>Era rulebook and scouting interpretation</summary><p class="t2 sm">Entered ${yrLabel(c.debut)}. ${ctx.facts.map(esc).join(' · ')}. Early-era seasons do not award three-point baskets regardless of the player's shooting range. Stats and rankings compare real seasons rather than artificially converting every generation into 2025-26.</p></details>
      </div></section>`;
  }
  function verdictDossier(c) {
    const a=HL.Legacy.careerReport(c), m=a.metrics, nba=c.seasons.filter(s=>!s.minors&&s.g>0);
    const film=HL.Story.documentary(c);
    const year=y=>yrLabel(y);
    const side=(c.legacy.rank<=3 ? 'Elite against the model’s career-score baseline. ' : 'Outside the very top tier of the model. ') +
      (m.ts<.54?'Efficiency gives critics an argument. ':'Shooting efficiency strengthens the case. ') +
      (c.rings>=3?'Team circumstances contributed to a strong title résumé.':'The ring count leaves a team-success question.');
    const prove=a.titles.filter(t=>t.name!=='Respected Pro');
    const titleCards=prove.length ? prove.map(t=>`<article class="dossier-honor"><div class="caps">Career identity</div><h3>${esc(t.name)}</h3><p>${esc(t.description)}</p><div class="t3 sm">Evidence: ${esc(t.basis)}</div></article>`).join('') :
      `<article class="dossier-honor"><h3>A career with its own identity</h3><p>Not every career clears historical specialty thresholds. Individual seasons and team impact still matter.</p></article>`;
    const top=nba.slice().sort((x,y)=>(y.ppg||0)-(x.ppg||0)).slice(0,3);
    const turns=[...nba.filter(s=>s.champion).slice(0,2).map(s=>`Won the ${year(s.yr)} championship with ${esc(s.team.name)} while averaging ${(s.ppg||0).toFixed(1)} points.`),
      ...nba.filter(s=>s.awards?.some(x=>awardName(x)==='MVP')).slice(0,1).map(s=>`Claimed MVP honors in ${year(s.yr)} with a ${s.w}-${s.l} club.`),
      ...c.log.filter(l=>/Signed with|Traded to|Re-signed with/.test(l.text)).slice(0,2).map(l=>`${year(l.yr)}: ${esc(l.text)}.`)].slice(0,5);
    const changed=c.altered.length;
    return `<section class="block dossier"><header><h3>The case for this career</h3><span class="ml-auto t3 sm">Beyond the legacy score</span></header>
      <div class="body stack"><div class="dossier-lead">${esc(a.chapters[0]||'The journey began with a dream.')}</div>
      <div class="dossier-two"><article><div class="caps">The strongest argument</div><h3>${esc(prove[0]?.name||'Longevity and production')}</h3><p>${esc(a.chapters[1]||'Every season contributed to the final story.')}</p></article>
      <article><div class="caps">The counterargument</div><h3>What the numbers leave out</h3><p>${esc(side)}</p></article></div>
      <div class="caps">Basketball identities earned on the floor</div><div class="dossier-grid">${titleCards}</div>${HL.DNA.board(c.dna)}
      <div class="caps">THE CAREER DOCUMENTARY · ${esc(film.title)}</div><div class="dna-film-chapters">${film.chapters.map((x,i)=>`<article class="dna-film"><span>CHAPTER ${i+1} · ${x.year} · ${esc(x.type)}</span><p>${esc(x.text)}</p></article>`).join('')}</div>
      <div class="dossier-two"><article><div class="caps">The media argument</div><p>${esc(film.debate[0])}</p></article><article><div class="caps">The skeptical take</div><p>${esc(film.debate[1])}</p></article></div>
      ${top.length?`<div class="caps">The most explosive scoring years</div><div class="dossier-grid">${top.map(s=>`<article class="dossier-honor"><div class="caps">${year(s.yr)} · ${esc(s.team.name)}</div><h3>${(s.ppg||0).toFixed(1)} PPG</h3><p>${(s.rpg||0).toFixed(1)} rebounds · ${(s.apg||0).toFixed(1)} assists · ${s.w}-${s.l} record</p></article>`).join('')}</div>`:''}
      ${turns.length?`<div class="caps">Turning points</div><div class="dossier-turns">${turns.map((x,i)=>`<div class="dossier-turn"><b>${String(i+1).padStart(2,'0')}</b><span>${x}</span></div>`).join('')}</div>`:''}
      <details><summary>How this verdict was judged</summary><p>Historical rank compares weighted awards and long-term production to real NBA career baselines. Special titles require actual simulated output, sustained seasons and, where noted, modeled scouting traits. Neither an individual 99 rating nor first place on a single score automatically establishes GOAT status.</p><p>${changed} historical award or title outcomes changed. Future seasons evolve through generated rookie drafts, development, retirements and roster changes; their simulated outcomes are alternate-history projections, not verified real results.</p></details>
    </div></section>`;
  }

  function resultView() {
    const c = st.career;
    const [tier, line] = verdict(c);
    const count = name => c.awards.filter(a => a.award === name).length;
    const comp = HL.HISTORY.players[c.legacy.closest.pid][0];
    const T = c.totals, P = c.ptotals;
    return `<section class="block"><div class="body stack">
          <div class="caps">The verdict</div><h1 style="font-size:56px;line-height:.9">${tier}</h1><div class="t2">${esc(line)}</div>
          <div class="cols c2"><div>
            <div class="kv"><span>All-time legacy rank</span><b>${c.legacy.rank > 1500 ? 'Outside the top 1,500' : '#' + c.legacy.rank}</b></div>
            <div class="kv"><span>Legacy score</span><b>${c.legacy.score}</b></div>
            ${c.legacy.score >= 2 ? `<div class="kv"><span>Most comparable career</span><b>${esc(comp)}</b></div>` : ''}
            <div class="kv"><span>Drafted</span><b>${c.pick ? `#${c.pick} overall · ${c.debut}` : `Undrafted · ${c.debut}`}</b></div>
            <div class="kv"><span>How it ended</span><b>${esc(c.end || '')}</b></div>
            <div class="kv"><span>Teams</span><b>${c.teams.length}</b></div>
          </div><div>
            <div class="kv"><span>Rings · MVPs · All-Star</span><b>${c.rings} · ${count('MVP')} · ${count('All-Star')}</b></div>
            <div class="kv"><span>Career</span><b>${pg(T, 'pts').toFixed(1)} PPG · ${pg(T, 'reb').toFixed(1)} RPG · ${pg(T, 'ast').toFixed(1)} APG</b></div>
            <div class="kv"><span>Totals</span><b>${Math.round(T.pts).toLocaleString()} pts · ${Math.round(T.reb).toLocaleString()} reb · ${Math.round(T.ast).toLocaleString()} ast</b></div>
            <div class="kv"><span>Playoffs</span><b>${P.g} games · ${pg(P, 'pts').toFixed(1)} PPG</b></div>
            <div class="kv"><span>Career earnings</span><b>${U.money(c.earnings)}</b></div>
            <div class="kv"><span>Games</span><b>${T.g.toLocaleString()}</b></div>
          </div></div>
          <div class="row"><button class="btn go" data-new>Build another</button></div>
        </div></section>
      ${verdictDossier(c)}
      ${careerDeepReport(c)}
      ${c.seasons.length ? `<details class="dossier-data"><summary>Full ${c.seasons.length}-season statistics and award ledger</summary>${careerTable(c)}</details>` : ''}
      ${c.log.length ? timeline(c) : ''}`;
  }

  const ordinal = n => U.ordinal(n);

  // Run an async step with a progress card.
  async function busy(title, sub, fn) {
    const run=st;
    st.busy = { title, sub, pct: 0 };
    render();
    await new Promise(r => setTimeout(r, 30));
    if(st!==run)return false;
    try { await fn(); } catch (e) { if(st===run){console.error(e); U.toast('Something went wrong: ' + esc(e.message));} }
    if(st!==run)return false;
    st.busy = null;
    render();
    window.scrollTo(0, 0);
    return true;
  }
  const setPct = (pct, sub) => { if (!st?.busy) return; st.busy.pct = pct; if (sub) st.busy.sub = sub; const bar = document.querySelector('.simcard .track i'); if (bar) bar.style.width = pct + '%'; const s = document.querySelector('.block .body .t2.sm'); if (s && sub) s.textContent = sub; };

  function bind() {
    const app = U.app();
    const abandon=()=>{if(st?.career)st.career.cancelled=true;HL.DNAFX?.reset();document.querySelectorAll('.fx-banner').forEach(e=>e.click());st=null;cache=null;};
    app.querySelector('[data-home]').onclick = () => {abandon();HL.App.title();};
    app.querySelectorAll('[data-new]').forEach(b => b.onclick = () => {abandon();render();});
    FX.bindSound(app);
    const sp = app.querySelector('[data-spin]'); if (sp) sp.onclick = () => { if (st.phase === 'spin') spin('all'); };
    app.querySelectorAll('[data-skip]').forEach(b => b.onclick = () => { const k = b.dataset.skip; if (!st.skips[k] || st.phase !== 'hand') return; st.skips[k]--; spin(k); });
    app.querySelectorAll('.hand .gcard').forEach(card => card.onclick = () => {
      if (card.classList.contains('down')) return;
      if (st.draftStyle === 'free') chooseFreePlayer(+card.dataset.freePlayer);
      else take(+card.dataset.hand);
    });
    const rosterSearch = app.querySelector('[data-roster-query]');
    if (rosterSearch) rosterSearch.oninput = () => {
      const cursor = rosterSearch.selectionStart ?? rosterSearch.value.length;
      st.rosterQuery = rosterSearch.value; st.rosterPage = 0;
      render();
      const refreshed = U.app().querySelector('[data-roster-query]');
      if (refreshed) { refreshed.focus(); refreshed.setSelectionRange(cursor, cursor); }
    };
    const rosterSort = app.querySelector('[data-roster-sort]');
    if (rosterSort) rosterSort.onchange = () => { st.rosterSort = rosterSort.value; st.rosterPage = 0; render(); };
    app.querySelectorAll('[data-roster-page]').forEach(btn => btn.onclick = () => {
      st.rosterPage = Math.max(0, st.rosterPage + (btn.dataset.rosterPage === 'next' ? 1 : -1));
      render();
    });
    const rosterBack = app.querySelector('[data-back-roster]');
    if (rosterBack) rosterBack.onclick = () => { st.phase = 'hand'; st.selected = null; st.skillChoices = null; render(); };
    app.querySelectorAll('[data-free-cat]').forEach(btn => btn.onclick = () => {
      if (st.phase !== 'choose-skill') return;
      const id = btn.dataset.freeCat, selected = st.skillChoices && st.skillChoices[id];
      if (selected && remaining().includes(id)) finishPick(selected, id);
    });
    app.querySelectorAll('[data-wild-cat]').forEach(btn=>btn.onclick=()=>finishPick(st.wildCandidate,btn.dataset.wildCat));
    app.querySelectorAll('[data-press]').forEach(btn=>btn.onclick=()=>{
      const c=st?.career;if(!c||c.done||!HL.SkillPress)return;
      const response=HL.SkillPress.respond(c,btn.dataset.press);
      if(!response.ok){U.toast(response.reason);return;}
      FX.sfx.camera?.();render();
    });
    app.querySelectorAll('[data-role]').forEach(btn=>btn.onclick=()=>{
      const c=st.career;if(!c||c.done||!ROLES[btn.dataset.role])return;
      c.role=btn.dataset.role;FX.sfx.pop(1);render();
    });
    const agendaSelect=app.querySelector('[data-agenda]');
    if(agendaSelect)agendaSelect.onchange=()=>{if(st.career&&!st.career.done)st.career.agenda=agendaSelect.value;render();};
    app.querySelectorAll('[data-training]').forEach(btn=>btn.onclick=()=>{
      const c=st.career;if(!c||c.done||!TRAINING[btn.dataset.training])return;
      c.trainingFocus=btn.dataset.training;FX.sfx.pop(1);render();
    });
    FX.tilt(app);
    const nm = app.querySelector('[data-name]'); if (nm) nm.oninput = () => { st.name = nm.value || 'Your Player'; };
    const position = app.querySelector('[data-position]'); if (position) position.onchange = () => { st.pos=position.value; render(); };
    const db = app.querySelector('[data-debut]'); if (db) db.onchange = () => { st.debut = +db.value; };
    const c = st.career;
    app.querySelectorAll('[data-begin]').forEach(b => b.onclick = async () => {
      const run=st;
      const proceeded=await busy(`The ${st.debut} draft`, 'Loading the real league…', async () => {
        const cc=run.career=newCareer();
        await draft(cc);if(st!==run)return;
        if (b.dataset.begin === 'auto') { cc.stage = null; await runRest(cc); }
      });if(!proceeded)return;
      const cc = st.career;
      if (cc.done) return verdictBanner(cc);
      await FX.banner(cc.pick ? `#${cc.pick}` : 'UNDRAFTED', cc.minors ? 'Heading to the minor leagues.' : `${esc(fullName(cc.teamMeta))} select ${esc(cc.me.name)}.`, { tier: !cc.pick ? 0 : cc.pick <= 3 ? 4 : cc.pick <= 10 ? 3 : cc.pick <= 30 ? 2 : 1, kicker: `Draft night · ${cc.debut}`, ms: 2400 });
    });
    const play = async () => {
      const proceeded=await busy(`Playing the ${yrLabel(c.yr)} season`, c.minors ? 'In the minor leagues' : `With the ${fullName(c.teamMeta)}`, async () => {
        if (c.pending) decide(c, { type: 'stay' });
        c.stage = null;
        await playSeason(c);
        await offseason(c);
      });if(!proceeded)return;
      await celebrate(c);
    };
    app.querySelectorAll('[data-play]').forEach(b => b.onclick = play);
    app.querySelectorAll('[data-simrest]').forEach(b => b.onclick = async () => { const proceeded=await busy('Simulating the next ten seasons', '', async () => { c.stage = null; await runRest(c); }); if(proceeded&&st.career.done)verdictBanner(st.career); });
    app.querySelectorAll('[data-sign]').forEach(b => b.onclick = () => { decide(c, { type: 'sign', i: +b.dataset.sign }); render(); });
    app.querySelectorAll('[data-story-choice]').forEach(b=>b.onclick=()=>{HL.Story.chooseDecision(c,b.dataset.storyChoice);setAge(c,c.age);render();});
    app.querySelectorAll('[data-trade]').forEach(b => b.onclick = () => { decide(c, { type: 'trade' }); U.toast(`${esc(c.log[c.log.length - 1].text)}.`); render(); });
    app.querySelectorAll('[data-minors]').forEach(b => b.onclick = () => { decide(c, { type: 'minors' }); render(); });
    app.querySelectorAll('[data-retire]').forEach(b => b.onclick = () => {
      if (!confirm('Retire now? The career ends and you get the verdict.')) return;
      if (!c.pending) c.pending = { type: 'season', offers: [], notes: [] };
      decide(c, { type: 'retire' }); render();
    });
  }
  // The payoff after each season: numbers count up, big honors get their own moment.
  async function celebrate(c) {
    const run=st;if(run?.career!==c)return;
    const s = c.seasons[c.seasons.length - 1];
    if (s && !s.minors) {
      document.querySelectorAll('.statstrip b').forEach(b => { const v = parseFloat(b.textContent); if (!isNaN(v)) { const dec = (b.textContent.split('.')[1] || '').length; FX.countUp(b, v, 900, x => x.toFixed(dec)); } });
      const award = n => s.awards.find(a => awardName(a) === n);
      const over = n => { const a = award(n); return a && a.over ? `Over ${esc(a.over)}` : ''; };
      const firstAllStar = award('All-Star') && c.awards.filter(a => a.award === 'All-Star').length === 1;
      const queue = [];
      if (s.champion) queue.push(['CHAMPIONS', `${esc(fullName(s.team))} · ${yrLabel(s.yr)}`, 4]);
      if (award('Finals MVP')) queue.push(['FINALS MVP', '', 4]);
      if (award('MVP')) queue.push(['MVP', over('MVP'), 4]);
      if (award('DPOY')) queue.push(['DEFENSIVE PLAYER OF THE YEAR', over('DPOY'), 3]);
      if (award('ROY')) queue.push(['ROOKIE OF THE YEAR', over('ROY'), 3]);
      if (award('Scoring title')) queue.push(['SCORING TITLE', over('Scoring title'), 3]);
      if (award('All-NBA 1st') && !award('MVP')) queue.push(['ALL-NBA FIRST TEAM', '', 3]);
      if (firstAllStar) queue.push(['ALL-STAR', 'First selection', 2]);
      for (const [t, sub, tier] of queue.slice(0, 3)) {await FX.banner(t, sub, { tier, kicker: yrLabel(s.yr), ms: 2200 });if(st!==run)return;}
      if (!queue.length && s.injury && s.injury.games >= 30) FX.shake(document.querySelector('.page'), 0.6);
    }
    if (c.done) await verdictBanner(c);
  }
  function verdictBanner(c) {
    const [tier, line] = verdict(c);
    const t = ['BROKEN', 'THE GOAT'].includes(tier) ? 4 : ['ALL-TIME GREAT', 'HALL OF FAMER'].includes(tier) ? 3 : ['SUPERSTAR', 'ALL-STAR'].includes(tier) ? 2 : ['STARTER', 'ROLE PLAYER'].includes(tier) ? 1 : 0;
    return FX.banner(tier, esc(line), { tier: t, kicker: 'The verdict', ms: 3600 });
  }
  async function runRest(c=st.career) {
    const start = c.seasons.length;
    await simRest(c, cc => {if(st?.career===cc)setPct(Math.min(100, Math.round((cc.seasons.length-start)/10*100)), `${yrLabel(cc.yr)} · age ${cc.age} · ${cc.seasons.length} seasons`);}, 10, true);
  }


  function freeDraftView(hide) {
    const ready = st.phase === 'hand' && !!st.team;
    const team = st.team ? tm(st.team) : null;
    const reel = (label, inner) => '<div class="reel ' + (ready ? 'landed' : '') + '"><div class="reel-label">' + label +
      '</div><div class="reel-win"><div class="reel-item" style="height:96px">' + inner + '</div></div></div>';
    const wheels = '<div id="reels"><div class="reels">' +
      reel('Franchise', ready ? U.logo(team, 62) : '?') +
      reel('Decade', ready ? st.decade + 's' : '?') + '</div></div>';
    const skip = k => '<button class="btn" data-skip="' + k + '" ' +
      (!st.skips[k] || !ready ? 'disabled' : '') + '>' +
      (k === 'team' ? 'New franchise' : 'New decade') + ' (' + st.skips[k] + ')</button>';
    const controls = '<div class="row wrap" style="justify-content:center;gap:10px;margin-top:16px">' +
      '<button class="btn spin" data-spin ' + (st.phase !== 'spin' ? 'disabled' : '') + '>' +
      (Object.keys(st.picks).length ? 'Roll for your next skill' : 'Spin franchise & decade') + '</button>' +
      skip('team') + skip('era') + '</div>';
    if (!ready) return '<section class="machine"><div class="lights">' + '<i></i>'.repeat(14) +
      '</div>' + wheels + controls +
      (!Object.keys(st.picks).length ? '<p class="t2" style="max-width:62ch;margin:16px auto;text-align:center">Only the franchise and decade are random. Browse every player who appeared for that franchise, pick anyone, and decide which unfilled skill you want from their best qualifying season.</p>' : '') + '</section>';

    const query = (st.rosterQuery || '').trim().toLowerCase();
    let roster = st.hand.map((c, i) => ({ c, i })).filter(({c}) => {
      const name = HL.HISTORY.players[c.row.pid]?.[0] || '';
      return !query || name.toLowerCase().includes(query);
    });
    if (st.rosterSort === 'name')
      roster.sort((a, b) => HL.HISTORY.players[a.c.row.pid][0].localeCompare(HL.HISTORY.players[b.c.row.pid][0]));
    const pageSize = 24;
    const pages = Math.max(1, Math.ceil(roster.length / pageSize));
    const page = Math.min(st.rosterPage || 0, pages - 1);
    const visible = roster.slice(page * pageSize, (page + 1) * pageSize);
    const pagination = pages > 1 ? '<div class="row wrap" style="gap:10px;justify-content:center">' +
      '<button class="btn small" data-roster-page="prev" ' + (page === 0 ? 'disabled' : '') + '>Previous</button>' +
      '<span class="t2 sm">Page ' + (page + 1) + ' of ' + pages + '</span>' +
      '<button class="btn small" data-roster-page="next" ' + (page >= pages - 1 ? 'disabled' : '') + '>Next</button></div>' : '';
    const cards = visible.map(({c,i}) => {
      const bio = HL.HISTORY.players[c.row.pid], r = c.row;
      const star = HL.DNA.STARS[c.row.pid];
      return '<div class="dna-card-shell ' + (star ? 'dna-star-card' : '') + '">' +
        HL.Cards.card({
          pid:r.pid, name:bio[0], nbaId:bio[1], team:tm(C().LINEAGE[c.club]) || team,
          pos:r.pos, rating:HL.historicalSeasonOvr(r), ratingLabel:'OVR',
          meta:'Best overall: ' + yrLabel(c.season) + ' · ' + c.club,
          stat:[['PTS',r.pts],['REB',r.trb],['AST',r.ast]],
          hidden:hide, attrs:'data-free-player="' + i + '"'
        }) + (star ? '<div class="dna-card-hint">★ ' + esc(star.title) + '</div>' : '') + '</div>';
    }).join('');
    return '<section class="machine"><div class="lights">' + '<i></i>'.repeat(14) + '</div>' +
      wheels + controls + '<div class="result">' + esc(team.city + ' ' + team.name) +
      ' · ' + st.decade + 's · ' + st.hand.length + ' players across the decade</div>' +
      '<div class="stack" style="gap:12px;margin-top:20px">' +
      '<p class="t2 sm" style="text-align:center;margin:0">Choose any player, then pick any unfilled skill. Each skill uses that player’s strongest qualifying season with this franchise in this decade.</p>' +
      '<div class="row wrap" style="gap:10px;align-items:center">' +
      '<input data-roster-query type="search" aria-label="Find a player" placeholder="Search players..." value="' + esc(st.rosterQuery || '') + '" style="min-width:180px;flex:1">' +
      '<select data-roster-sort aria-label="Sort players">' +
      '<option value="rating" ' + (st.rosterSort !== 'name' ? 'selected' : '') + '>Highest OVR</option>' +
      '<option value="name" ' + (st.rosterSort === 'name' ? 'selected' : '') + '>A to Z</option></select>' +
      '<span class="t2 sm">' + roster.length + ' shown</span></div>' +
      (visible.length ? '<div class="hand">' + cards + '</div>' : '<p class="t2">No matching players. Try another name or reroll.</p>') +
      pagination + '</div></section>';
  }

  function freeSkillChoiceView(hide) {
    const selected = st.selected;
    if (!selected || !st.skillChoices) return freeDraftView(hide);
    const bio = HL.HISTORY.players[selected.row.pid];
    const picks = Object.entries(st.picks).map(([cat, c]) =>
      ({ pid:c.row.pid, cat, row:c.row, season:c.season }));
    const groups = [
      ['Basketball skills', CATS.filter(c => !c[0].startsWith('tend') && !['longevity','primeLength'].includes(c[0]))],
      ['Playing tendencies', CATS.filter(c => c[0].startsWith('tend'))],
      ['Career traits', CATS.filter(c => ['longevity','primeLength'].includes(c[0]))]
    ];
    const options = groups.map(([heading, cats]) => {
      const available = cats.filter(c => st.skillChoices[c[0]]);
      if (!available.length) return '';
      return '<div class="stack" style="gap:8px"><h3>' + heading + '</h3><div class="dna-choice-grid">' +
        available.map(cat => {
          const option = st.skillChoices[cat[0]];
          const v = skillValue(option, cat);
          const fusion = HL.DNA.preview(picks, { pid:option.row.pid, cat:cat[0], row:option.row, season:option.season });
          return '<button class="dna-choice" data-free-cat="' + cat[0] + '">' +
            '<span class="stack" style="gap:4px;text-align:left"><b>' + esc(cat[1]) + '</b>' +
            '<span class="t3 sm">' + yrLabel(option.season) + (fusion ? ' · ✦ Fusion possibility' : '') + '</span></span>' +
            '<strong>' + (hide ? '?' : cat[0] === 'body' ? HL.fmtHeight(bio[3]) : v) + '</strong></button>';
        }).join('') + '</div></div>';
    }).join('');
    return '<section class="block"><header><h3>Select a skill from ' + esc(bio[0]) + '</h3></header>' +
      '<div class="body stack" style="gap:14px"><div class="row wrap" style="gap:12px;align-items:center">' +
      HL.Cards.card({ pid:selected.row.pid, name:bio[0], nbaId:bio[1], team:tm(C().LINEAGE[selected.club]) || tm(st.team), pos:selected.row.pos,
        rating:HL.historicalSeasonOvr(selected.row), ratingLabel:'OVR', meta:'Selected player · ' + st.decade + 's',
        stat:[['PTS',selected.row.pts],['REB',selected.row.trb],['AST',selected.row.ast]], hidden:hide }) +
      '<div class="grow"><p class="t2">Which skill do you want to inherit? All unfilled categories are available. The year beside each choice is this player’s best season for that specific skill.</p>' +
      '<button class="btn" data-back-roster>Back to full roster</button></div></div>' +
      options + '</div></section>';
  }

  function draftView(hide, reveal) {
    if (st.draftStyle === 'free') return freeDraftView(hide);
    const fm = st.team ? tm(st.team) : null, cat = st.cat ? catOf(st.cat) : null;
    const show = fm && cat && st.phase === 'hand';
    const reel = (label, inner) => `<div class="reel ${show ? 'landed' : ''}"><div class="reel-label">${label}</div><div class="reel-win"><div class="reel-item ${label === 'Skill' ? 'txt' : ''}" style="height:96px">${inner}</div></div></div>`;
    const reels = `<div id="reels"><div class="reels">${reel('Franchise', show ? U.logo(fm, 62) : '?')}${reel('Decade', show ? `${st.decade}s` : '?')}${reel('Skill', show ? esc(cat[1]) : '?')}</div></div>`;
    const controls = `<div class="row" style="justify-content:center;gap:10px;margin-top:16px;flex-wrap:wrap">
        <button class="btn spin" data-spin ${st.phase !== 'spin' ? 'disabled' : ''}>${Object.keys(st.picks).length ? `Spin skill ${Object.keys(st.picks).length + 1}` : 'Spin'}</button>
        <button class="btn" data-skip="team" ${st.skips.team && st.phase === 'hand' ? '' : 'disabled'}>Team skip (${st.skips.team})</button>
        <button class="btn" data-skip="era" ${st.skips.era && st.phase === 'hand' ? '' : 'disabled'}>Decade skip (${st.skips.era})</button>
        <button class="btn" data-skip="stat" ${st.skips.stat && st.phase === 'hand' ? '' : 'disabled'}>Skill skip (${st.skips.stat})</button>
        <button class="btn" data-skip="all" ${st.skips.all && st.phase === 'hand' ? '' : 'disabled'}>Full respin (${st.skips.all})</button></div>
      ${show ? `<div class="result">${esc(cat[1])} from the ${esc(fm.city)} ${esc(fm.name)} · ${st.decade}s</div>` : ''}`;
    const cards = show ? `<div class="stack" style="gap:8px;margin-top:18px"><div class="t2 sm" style="text-align:center">${st.hand.length ? `Top five by ${esc(cat[1].toLowerCase())}${st.hand.some(c=>c.legendary) ? " + RARE LEGENDARY WILDCARD" : ""}. Tap a card to choose.` : 'Nobody to deal from this club and decade. Use a skip.'}</div>
      <div class="hand">${st.hand.map((c, i) => { const previews=HL.DNA.preview(Object.entries(st.picks).map(([cat,pk])=>({pid:pk.row.pid,cat,row:pk.row,season:pk.season})),{pid:c.row.pid,cat:st.cat,row:c.row,season:c.season});const special=HL.DNA.STARS[c.row.pid]; const bio = HL.HISTORY.players[c.row.pid]; const r = c.row; const v = skillValue(c, cat);
        return `<div class="dna-card-shell ${special?'dna-star-card':''}" style="--dna-a:${special?(HL.DNA.PALETTE[special.tone]||[])[0]:'#6c7888'};--dna-b:${special?(HL.DNA.PALETTE[special.tone]||[])[1]:'#9faabb'}">`+HL.Cards.card({ pid: r.pid, name: bio[0], nbaId: bio[1], team: tm(C().LINEAGE[c.club]) || fm, pos: r.pos, rating: v, ratingLabel: SHORT[cat[0]], meta: c.legendary ? `★ LEGENDARY WILDCARD · ${c.legendaryName} · ${yrLabel(c.season)}` : `#${i + 1} IN ${cat[1].toUpperCase()} · ${yrLabel(c.season)} · ${c.club}`,
          stat: cat[0] === 'body' ? [['HT', HL.fmtHeight(bio[3])], ['WT', bio[4]]] : ['longevity','primeLength'].includes(cat[0]) ? [['YRS', HL.careerTraitFor(r.pid).playedYears], ['PEAK', HL.careerTraitFor(r.pid).peakYears]] : [['PTS', r.pts], ['REB', r.trb], ['AST', r.ast]], hidden: hide, down: !!reveal, attrs: `data-hand="${i}"` })+`${previews?`<div class="dna-card-hint">✦ ${esc(previews.name)} · ${esc(previews.type)}</div>`:special?`<div class="dna-card-hint">★ ${esc(special.title)}</div>`:''}</div>`; }).join('')}</div></div>` : '';
    const intro = !st.cat && st.phase === 'spin' && !Object.keys(st.picks).length ? '<p class="t2" style="text-align:center;max-width:52ch;margin:14px auto 0">Each spin lands a franchise, a decade and a skill. You get dealt five players who played there. Take one player\'s skill. Each draftable tool, habit and career trait builds your player.</p>' : '';
    const mechanicsNote=show&&cat[0]==='jumper'?'<p class="t3 sm" style="text-align:center">Mechanics grade: 60% release speed, 40% arc and touch. Release elevation is inherited separately and affects contests; a shorter frame does not mean worse shooting technique.</p>':'';
    return `<section class="machine"><div class="lights">${'<i></i>'.repeat(14)}</div>${reels}${intro}${controls}${cards}${mechanicsNote}</section>`;
  }

  function setupScreen() {
    U.applyTeamTheme(null); U.setEra('modern');
    let mode = 'classic', draftStyle = 'original';
    const draw = () => {
      U.app().innerHTML = `<div class="frame"><div class="masthead"><div class="bar"><div class="wordmark" data-home>Hoops<i>Life</i></div><div class="mainnav"><button class="on">Skill Draft Career</button></div></div></div>
      <div class="page" style="max-width:900px"><div class="page-title"><h2>Skill Draft Career</h2></div>
      <section class="block"><div class="body stack">
        <p class="t2" style="margin:0">Build one player from real historical players' skills, then play out a full NBA career. Original Draft spins a franchise, decade and skill, and deals five specialists. Free Choice spins only franchise and decade: browse the full qualifying roster, choose any player, then choose any unfilled skill. Both versions lead into the same realistic career simulator, legacy rankings, and DNA fusions.</p>
        <div class="setting" style="flex-wrap:wrap"><div class="grow"><b>Draft rules</b><div class="d">Free Choice gives control over each skill, but the franchise and decade are still random for every pick.</div></div>
          <select data-draft-style><option value="original" ${draftStyle === 'original' ? 'selected' : ''}>Original: three reels + five cards</option><option value="free" ${draftStyle === 'free' ? 'selected' : ''}>Free Choice: two reels + full roster</option></select></div>
        <div class="setting" style="flex-wrap:wrap"><div class="grow"><b>Mode</b><div class="d">HoopIQ hides the ratings.</div></div>${U.seg('mode', [['classic', 'Classic'], ['hoopiq', 'HoopIQ']], mode)}</div>
        <div class="row"><button class="btn go big ml-auto" data-go>Start</button></div>
      </div></section></div></div>`;
      const app = U.app();
      app.querySelector('[data-home]').onclick = () => HL.App.title();
      app.querySelectorAll('[data-seg] button').forEach(b => b.onclick = () => { mode = b.dataset.v; draw(); });
      app.querySelector('[data-draft-style]').onchange = e => { draftStyle = e.target.value; draw(); };
      app.querySelector('[data-go]').onclick = () => { newRun(mode, null, draftStyle); render(); };
    };
    draw();
  }

  // Headless runs (tools/test-skilldraft.js): picks = { cat: { row, season } }.
  async function simulate(picks, name = 'Test Player', debut = null) {
    newRun('classic', debut);
    st.picks = picks; st.name = name;
    const c = st.career = newCareer();
    await draft(c);
    c.stage = null;
    await simRest(c, null, 45);
    // The headless benchmark reports an interim legacy ranking at its checkpoint;
    // do not retire an active player to force a verdict.
    if (!c.legacy) c.legacy = legacyOf(c.seasons, c);
    return { ...c, verdict: verdict(c), checkpoint: !c.done };
  }

  return { open: () => { st = null; cache = null; render(); }, CATS, simulate, ratingsAt, primeWindow, careerLimit, extraordinaryLongevity, careerDemand, shouldPauseAuto, evaluateCareer: c => ({ verdict: verdict(c), specialties: HL.Legacy.careerReport(c) }) };
})();
