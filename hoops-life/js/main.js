// App entry: title screen, mode selection, load game.
window.HL = window.HL || {};

HL.App = (function () {
  const U = HL.UI;
  const esc = U.esc;

  const MODES = [
    { id: 'franchise', name: 'Franchise', live: true, desc: 'Take over any real NBA team from any season since 1946. Real rosters and ratings, the full schedule, era playoffs and media. Rewrite history, and change every rule.' },
    { id: 'career', name: 'Player Career', desc: 'Live a whole life, from a kid with a ball to a Hall of Fame speech (or not). MyCareer meets BitLife, in any era.' },
    { id: '820', name: '82-0 Challenge', live: true, desc: 'Spin a franchise and a decade, draft one real player per spot, and see if your five can run the table.' },
    { id: 'skill', name: 'Skill Draft Career', live: true, desc: 'Build one player from real players\' skills, drop him into any real draft class, sim the whole career against the real league, and get the verdict.' },
  ];

  function title() {
    U.applyTeamTheme(null);
    U.setEra('modern');
    U.app().innerHTML = `
    <div class="title">
      <div class="stage">
        <div>
          <div class="mark">Hoops<span>Life</span></div>
          <p class="lede">A basketball simulator built on the real league. Real rosters, a possession-by-possession sim calibrated to NBA numbers, and a story that remembers everything you do.</p>
        </div>
        <div class="modes">
          ${MODES.map((m, i) => `<button class="mode ${m.live ? '' : 'off'}" data-mode="${m.id}">
            <span class="ix">0${i + 1}</span>
            <div><h3>${esc(m.name)}</h3><p>${esc(m.desc)}</p></div>
            <span class="st ${m.live ? 'live' : ''}">${m.live ? 'Play' : 'In development'}</span>
          </button>`).join('')}
        </div>
      </div>
      <footer>
        <button class="btn" data-load>${U.icon('load')} Load game</button>
        <span class="t3 sm ml-auto">Real NBA data · every season 1946-47 to 2025-26</span>
      </footer>
    </div>`;
    U.app().querySelectorAll('[data-mode]').forEach(b => b.onclick = () => {
      if (b.dataset.mode === 'franchise') return HL.Franchise.setup();
      if (b.dataset.mode === '820') return HL.Challenge.open();
      if (b.dataset.mode === 'skill') return HL.SkillDraft.open();
      const m = MODES.find(x => x.id === b.dataset.mode);
      U.toast(`<b>${esc(m.name)}</b> is in development and is coming in an upcoming milestone.`);
    });
    U.app().querySelector('[data-load]').onclick = loadScreen;
  }

  async function loadScreen() {
    let saves = [];
    try { saves = await HL.Saves.list(); } catch (e) { U.toast('Could not open saves: ' + esc(e.message)); }
    const rows = saves.map(s => {
      const t = s.teamAbbr ? HL.TEAMS.find(x => x.abbr === s.teamAbbr) : null;
      return `<tr><td class="l"><div class="who" data-load="${esc(s.id)}">${t ? U.logo(t, 32) : ''}<div><div class="nm">${esc(s.label)}</div><div class="meta">${esc(s.phase)} · ${esc(s.record)}</div></div></div></td>
        <td class="t3 sm">${new Date(s.savedAt).toLocaleString()}</td>
        <td><button class="btn small" data-load="${esc(s.id)}">Load</button> <button class="btn small quiet" data-del="${esc(s.id)}" aria-label="Delete">${U.icon('trash')}</button></td></tr>`;
    }).join('');
    const m = U.sheet('<h3>Load game</h3>', `
      ${saves.length ? `<div class="tbl-wrap"><table class="tbl"><thead><tr><th class="l">Save</th><th>Last played</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>` : '<div class="empty">No saved games yet.</div>'}
      <label class="btn" style="align-self:flex-start">${U.icon('download')} Import save file<input type="file" accept=".json" hidden data-import></label>`, { width: 720 });
    m.querySelectorAll('[data-load]').forEach(el => el.onclick = async (e) => {
      e.stopPropagation();
      const L = await HL.Saves.load(el.dataset.load);
      U.closeSheet();
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
        U.closeSheet();
        HL.Franchise.open();
      } catch (err) { U.toast('That file is not a valid save.'); }
    };
  }

  return { title, loadScreen };
})();

window.addEventListener('DOMContentLoaded', () => HL.App.title());
