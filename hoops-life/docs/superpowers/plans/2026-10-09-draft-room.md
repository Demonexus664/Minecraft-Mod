# Draft Room Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans inline; complete the feature and one fresh final review. Steps use checkbox syntax.

**Goal:** Make scouting, the lottery and drafting playable, with persistent rookie reactions.
**Architecture:** `HL.DraftRoom` owns JSON state and validation; `HL.DraftRoomUI` renders stages. League rollover commits completed classes; World judges rookies from actual games.
**Tech Stack:** Existing plain JavaScript/CSS, Node tests, Playwright/Chromium, static Python server.
**Spec:** `docs/superpowers/specs/2026-10-09-draft-room-design.md`

## Global Constraints

- Work in the existing cloud checkout; preserve prior completed features and real player photos.
- No build dependency or runtime AI service. All state lives in the league save.
- Use team IDs explicitly, including zero; reads never consume RNG.
- Label historical lottery/class/pick-rights approximations in the product.
- Follow user authorization to continue without another approval gate.

## Review Focus

- Reloading and double-clicking cannot reroll or double-draft.
- Prepared classes never become free agents before selection; player IDs remain unique after reload.
- Coach cannot pick or spend scouting resources.
- First-round lottery must not reorder round two; tied records resolve once.
- User rookies retain their team and deal when a full roster advances; watches use actual games and DNPs.

### Task 1: Draft domain and rookie consequences

Files: create `js/league/draftroom.js`, `tools/test-draftroom.js`; modify `js/league/season.js`, `js/league/world.js`.
Interfaces: `prepare(L)`, `report(L,pid)`, `scout(L,pid,kind)`, `shortlist(L,pid)`, `lottery(L)`, `reveal(L)`, `pick(L,pid)`, `simulate(L,untilOwn)`, `commit(L)` return results with `ok`/`reason`; `current(L)` inspects current slot. `World.onDraft(L,p,slot)` stores memories/watches.

- [ ] Write assertions for idempotent class/lottery, era odds/round order, zero-ID selection, permission/stale-pick errors, scouting uncertainty/budget/privacy, save/resume, future and historical classes, rollover protection and five-game rookie consequences.
- [ ] Run `node --test tools/test-draftroom.js`; observe missing API failures.
- [ ] Implement the domain, safe rollover and exact-once World hooks.
- [ ] Run draft tests and existing domain/event tests; inspect failures and fix their responsible layer.
- [ ] Commit verified domain work with this plan's evidence.

### Task 2: Lottery and draft-night UI

Files: create `js/coach/draftroom.js`, `tools/test-draftroom-browser.cjs`; modify `index.html`, `js/coach/franchise.js`, `css/style.css`.
Interfaces: `DraftRoomUI.render(state)`, `bind(root,state,changed)`; async prepare loads next-year data before domain work; changed callback re-renders/autosaves. Franchise advance routes incomplete rooms to draft, then returns to season startup after completion.

- [ ] Write a browser flow for real preparation, workouts/interviews, shortlist, lottery reveal/save-resume, user selection, auto finish, next-season ownership/contract, coach inspection and mobile width.
- [ ] Run the flow and observe the absent Draft screen.
- [ ] Build focused lottery/reveal and on-clock screens with optional skip/reduced motion, photo cards, confirmation and selection feed. Remove Draft's SOON label.
- [ ] Run the browser flow; inspect desktop/mobile screenshots, page errors and asset failures.
- [ ] Commit verified UI work.

### Task 3: Verification and handoff

- [ ] Run existing rule/front-office/world/event assertions, full season/offseason and relevant browser checks.
- [ ] Fresh reviewer checks changed files/spec and Review Focus; reproduce/fix important findings with failing regressions and rerun the suite.
- [ ] Update roadmap and implementation evidence with actual scope/remaining systems. Do not inflate scenario counts.
- [ ] Verify syntax/diff; commit the milestone locally.

## Execution evidence

Starting point: `401ab7b`. NBA official lottery explainer request was denied by the environment network proxy (HTTP tunnel 403); no verification bypass used. Era tables follow the established documented lottery formats; smaller historical weighted fields and pre-1966/territorial picks remain explicitly approximate.
