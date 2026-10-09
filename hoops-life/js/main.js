// App entry: title screen, mode selection, load game.
window.HL = window.HL || {};

HL.App = (function () {
  const U = HL.UI;

  function setAccent(color, color2) {
    document.documentElement.style.setProperty('--accent', color || '#ff6b1a');
    document.documentElement.style.setProperty('--accent2', color2 && color2.toLowerCase() !== '#ffffff' && color2.toLowerCase() !== '#000000' ? color2 : '#ffd23f');
  }

  function title() {
    setAccent();
    U.app().innerHTML = `
    <div class="title-screen">
      <div class="title-bg"><div class="court"></div></div>
      <div class="title-card">
        <div class="logo-mark">Hoops<span>Life</span></div>
        <div class="tagline">Basketball career &amp; franchise simulator · real players · any era · your story</div>
        <div class="mode-grid">
          <button class="mode-card" data-go="franchise">
            <div class="icon">🏟️</div>
            <div class="chip accent">Franchise · MyNBA-style</div>
            <h2 style="margin-top:10px">Detailed Franchise</h2>
            <p>Take over any NBA team with real rosters. Rotations, strategy, the full season, playoffs, awards and media. Customize everything.</p>
            <div class="sub"><span class="chip good">Playable</span><span class="chip soon">Any era · Fantasy draft · Trades soon</span></div>
          </button>
          <button class="mode-card disabled" data-soon="Player Career (MyCareer + BitLife)">
            <div class="icon">⛹️</div>
            <div class="chip accent">Career · MyCareer + BitLife</div>
            <h2 style="margin-top:10px">Player Career</h2>
            <p>Live a whole life: build your player, high school to the league, every choice has consequences. Any era, so stop the GOAT before he's the GOAT.</p>
            <div class="sub"><span class="chip soon">In development</span></div>
          </button>
          <button class="mode-card disabled" data-soon="82-0 Challenge">
            <div class="icon">🎰</div>
            <div class="chip accent">Quick play</div>
            <h2 style="margin-top:10px">82-0 Challenge</h2>
            <p>Spin a team and decade, draft one real player per slot, and see if your all-time five can run the table.</p>
            <div class="sub"><span class="chip soon">In development</span></div>
          </button>
          <button class="mode-card disabled" data-soon="Skill Draft Career">
            <div class="icon">🧬</div>
            <div class="chip accent">Quick play</div>
            <h2 style="margin-top:10px">Skill Draft Career</h2>
            <p>Build one player out of real players' skills, sim the whole career and get the verdict: GOAT, all-time great, role player… or broken.</p>
            <div class="sub"><span class="chip soon">In development</span></div>
          </button>
        </div>
        <div class="row" style="margin-top:18px">
          <button class="btn" data-go="load">📂 Load game</button>
          <span class="muted small right">Rosters: ${U.esc(HL.ROSTER_META.label)}</span>
        </div>
      </div>
    </div>`;
    U.app().querySelectorAll('[data-go]').forEach(b => b.onclick = () => {
      if (b.dataset.go === 'franchise') HL.Franchise.setup();
      if (b.dataset.go === 'load') loadScreen();
    });
    U.app().querySelectorAll('[data-soon]').forEach(b => b.onclick = () => U.toast(`<b>${U.esc(b.dataset.soon)}</b> is being built in an upcoming milestone.`));
  }

  async function loadScreen() {
    let saves = [];
    try { saves = await HL.Saves.list(); } catch (e) { U.toast('Could not open saves: ' + U.esc(e.message)); }
    const body = saves.length ? saves.map(s => {
      const t = s.teamAbbr ? HL.TEAMS.find(x => x.abbr === s.teamAbbr) : null;
      return `<div class="game-row" data-load="${s.id}">
        ${t ? U.logo(t, 38) : ''}
        <div class="grow"><b>${U.esc(s.label)}</b><div class="muted small">${s.phase} · ${s.record} · saved ${new Date(s.savedAt).toLocaleString()}</div></div>
        <button class="btn sm" data-load="${s.id}">Load</button>
        <button class="btn sm ghost" data-del="${s.id}" title="Delete">🗑️</button>
      </div>`;
    }).join('') : '<div class="empty">No saved games yet.</div>';
    const m = U.modal('<h3>Load game</h3>', `<div class="col">${body}<label class="btn sm" style="align-self:flex-start">Import save file<input type="file" accept=".json" hidden data-import></label></div>`, { width: 640 });
    m.querySelectorAll('[data-load]').forEach(el => el.onclick = async (e) => {
      e.stopPropagation();
      const L = await HL.Saves.load(el.dataset.load);
      U.closeModal();
      if (L) HL.Franchise.open();
    });
    m.querySelectorAll('[data-del]').forEach(el => el.onclick = async (e) => {
      e.stopPropagation();
      if (!confirm('Delete this save? This cannot be undone.')) return;
      await HL.Saves.remove(el.dataset.del);
      loadScreen();
    });
    m.querySelector('[data-import]').onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const L = JSON.parse(await file.text());
        L.saveId = null;
        HL.League.set(L);
        HL.RNG.setSeed(L.rngSeed || Date.now());
        U.closeModal();
        HL.Franchise.open();
      } catch (err) { U.toast('That file is not a valid save.'); }
    };
  }

  return { title, setAccent, loadScreen };
})();

window.addEventListener('DOMContentLoaded', () => HL.App.title());
