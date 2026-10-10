# Playable Front Office Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan inline. Steps use checkbox syntax for tracking.

**Goal:** Replace three Franchise placeholders with real roster decisions and saved consequences.

**Architecture:** A standalone `HL.FrontOffice` domain module validates and executes decisions. A separate screen module integrates with Franchise through render/bind callbacks; season rollover honors financial commitments.

**Tech Stack:** Existing plain browser JavaScript/CSS, Node test runner, Playwright and Chromium. No product dependencies or build step.

**Spec:** `docs/superpowers/specs/2026-10-09-front-office-design.md`

## Global Constraints

- Preserve the existing cloud checkout and all prior local rulebook changes.
- Real rosters, historical outcomes and save compatibility remain intact.
- State and reactions come from actual accepted decisions; preview is read-only.
- Simplified cap/trade policies must be labeled, not presented as the full CBA.
- Coach inspects; GM/owner transact for their own team.

## Review Focus

- Stale offers or duplicate players cannot move assets twice.
- Team ID zero and legacy saves work without truthiness mistakes.
- A transaction cannot leave either team unable to field five healthy players.
- Over-cap teams and waived salary retain coherent financial obligations.
- Season rollover must honor new signings/extensions and real-history settings.

### Task 1: Domain decisions and season integration

Files: create `js/league/frontoffice.js`, `tools/test-frontoffice.js`; modify `js/league/season.js`.

Interfaces: `HL.FrontOffice.finances(L, tid, year?)`, `tradePreview(L, proposal)`, `trade(L, proposal)`, `findTrades(L, outgoingIds)`, `quote(L, pid, kind?)`, `sign(L, pid, amount, years)`, `extend(L, pid, amount, years)`, `waive(L, pid)`, `rollover(L, season, next)`. Decisions return `{ok, reasons, ...facts}`; previews expose AI value and projected payroll without RNG consumption.

- [x] Write deterministic domain/integration tests for every Review Focus condition and negotiation/validation behavior.
- [x] Run `node --test tools/test-frontoffice.js`; observe missing API failures before implementation.
- [x] Implement policy, valuation, financial commitments, transaction facts and era-aware coverage; integrate rollover before automatic contracts/free agency.
- [x] Run the same suite; all assertions must pass.

### Task 2: Playable screens and announcements

Files: create `js/coach/frontoffice.js`, `tools/test-frontoffice-browser.cjs`; modify `index.html`, `js/coach/franchise.js`, `css/style.css`.

Interfaces: `HL.FrontOfficeUI.render(page, state)` and `bind(page, root, state, changed)` consume Task 1 API; `changed()` renders and autosaves. Trades/freeagency/finances lose their SOON labels. Successful moves show a confirmation/new-team graphic; waiver needs a clear payroll confirmation.

- [x] Write and run the browser flow; observe missing screens before integration.
- [x] Implement two-sided trade desk, roster selectors, AI response, Trade Finder, market/contract negotiation, extension/waiver confirmation, ledger/payroll views and responsive styles.
- [x] Run the browser check; visible trades, negotiations, saves and mobile width must pass without page errors.

### Task 3: Verification, review and durable handoff

- [x] Run rule/event assertions and full season/offseason integration; inspect results.
- [x] Review the new module/integration for the five failure classes; fix important findings with regressions.
- [x] Update ROADMAP with concrete implemented scope, tests and remaining systems; keep scenario counts honest.
- [x] Check syntax and `git diff --check`; save the completed milestone locally in git.


## Added milestone work and verification ledger

User steering added persistent reactions/conversations, photo-based player graphics, reusable blank photographic uniforms, and reference-inspired visual polish. These preserve the existing development objective and do not replace the larger Player Career/Live Game queue.

- Domain decisions: missing API and missing-screen failures observed before implementation; 17 front-office cases now pass.
- People/world: missing API and missing morale effects observed before implementation; 10 world cases now pass. Baseline seeded games are identical at default morale.
- Photo rendering: team-specific override test failed on the old NBA-only source; new rendering and fallback behavior pass in Chromium. Actual NBA PNGs and generated alternate-team assets were inspected in browser screenshots.
- Final reviewer: `review_franchise_world`, read-only review of the new modules and integrations. One Important finding: automatic hardship cleanup erased extensions and temporary trade assets. Fixed by rejecting these temporary assets until a standard contract is available. `temporary hardship signings cannot be traded or extended into deals that cleanup would erase` failed before the fix and passes after it; complete rule/front-office/world suite 39/39.
- Existing event, full-season, historical and browser checks completed; detailed evidence is in ROADMAP. No important review findings remain unresolved.

- Final user art correction: all 30 current NBA teams have distinct photographic jersey assets in their own colors/wordmarks/trim, without numbers baked in. Removed the white-template/tint fallback. Real source headshots stay unchanged; the same Celtics asset is reused for Curry and LeBron with different separately rendered numbers. All-team resource/decoding checks and inspected screenshots accompany `test-uniforms-browser.cjs`.
- Fit correction: removed the 24% horizontal stretch and reduced the garment to 98% scale, anchored at the bottom. Rechecked both players and the full 30-team browser gallery after the user's request for smaller jerseys.
