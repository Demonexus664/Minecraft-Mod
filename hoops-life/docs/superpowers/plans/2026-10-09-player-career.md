# Player Career Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans inline and one final review of this continuation. Steps use checkbox syntax.

**Goal:** Deliver a playable first NBA Player Career with earned development, decisions and remembered consequences.
**Architecture:** `HL.Career` validates character creation/actions and hooks actual league days/games/rollover. `HL.CareerUI` supplies creation and the dedicated hub. League saves route to the appropriate mode.
**Tech Stack:** Existing JavaScript/CSS, historical data, Node and Playwright. No dependencies or runtime AI.
**Spec:** `docs/superpowers/specs/2026-10-09-player-career-design.md`

## Global Constraints

- Preserve Franchise, quick modes, rulebook, draft room and real player headshots.
- Created player remains faceless; no arbitrary OVR control or guaranteed selection of a team.
- All state and delayed consequences persist in `L.career` and actual game facts.
- Training/private family actions do not become public headlines. Public scenes match the era.
- Plain JavaScript; existing isolated cloud checkout; proceed under ongoing user authorization.

## Review Focus

- Malformed creation/tendencies and insufficient money reject without save mutation.
- Reload/duplicate game delivery cannot pay salary or judge a promise twice.
- Injured/DNP players earn no fake stats or fabricated postgame headlines.
- Career role cannot expose GM/editor capabilities; rotation changes protect only own earned minutes.
- Rollover cannot randomly retire, waive, overwrite tendencies or replace the user player's negotiated deal.

### Task 1: Creation and career domain

Create `js/league/career.js`, `tools/test-career.js`; modify `js/league/season.js`, `js/league/gamesim.js`.
Interfaces: `preview(config)`, `create(config)`, `act(L,key,params)`, `setTendencies(L,values)`, `beforeDay(L)`, `afterGame(L,g,res)`, `offseason(L)`, `offers(L)`, `sign(L,teamId)`, `retire(L)`, `unretire(L)`, `advance(L)`.

- [x] Write and observe failing assertions for creation bounds/seed, body effects, training/time costs, private/public effects, finances, named relationships, next-game promises, actual minutes, income idempotency, retirement/returns and rollover protection.
- [x] Implement domain and league hooks; tests must demonstrate actual possession effects and earned role rather than UI-only sliders.
- [x] Run career and existing domain assertions; fix failures and record evidence.

### Task 2: Creator and dedicated career hub

Create `js/modes/career.js`, `tools/test-career-browser.cjs`; modify `index.html`, `js/main.js`, `js/core/state.js`, `css/style.css`.
Interfaces: `CareerUI.setup()`, `open()`; title and load dispatch via `L.mode`. Controls consume only Task 1 APIs.

- [x] Write browser scenario and observe disabled/missing career flow.
- [x] Implement builder preview, Today/Basketball/People/Life/Media/Story, real-game reports, action dialogs, offseason reports/offers and retirement/return.
- [x] Verify an actual next game, quoted media choice/follow-up, training, financial action, save/reload and mobile screens; inspect screenshots.

### Task 3: Review and handoff

- [x] Run all applicable domain/event and browser checks; verify non-career calibration remains unchanged.
- [x] Fresh final reviewer checks both milestone diffs and Review Focus; fix important findings with failing regressions.
- [x] Update roadmap with exact playable scope, larger remaining Career/Live Game systems and verified evidence.
- [x] Syntax/diff checks and local commit; preserve existing branch and no automatic publishing.

## Execution evidence

This follows the draft-room milestone in the user-requested development/improvement loop. Full pre-NBA life simulation is intentionally not represented as completed by the first playable NBA career.

### Reference-driven presentation pass

The user's latest steering asks for NFL Perry contrast/reveals combined with BitLife's personal consequence dialogs. Add a dismissible final-whistle reveal using the actual game and attributed follow-up coverage; count up real stats and use a small burst only for an earned 20-point night. Choices show actual changes to energy, money, trust and ability, with gradual training progress. Keep original real headshots, distinct era palettes, reduced-motion and sound controls. No extra simulation rewards from animations.

- [x] Observe browser failures for missing choice feedback and actual-game reveal.
- [x] Implement scoped Career presentation and verify normal/reduced-motion desktop/mobile views, dismissal and factual stats.

Verification recorded in ROADMAP.md. Draft milestone commit: a6c258f. Career: 18 domain tests; combined continuation suite 71/71, browser flows and two actual Career season cycles passed. One fresh final reviewer inspected both milestones; both Important findings were reproduced failing and corrected. Career presentation RED/GREEN browser proof and screenshots cover real results, consequence feedback, normal/reduced motion and mobile.
