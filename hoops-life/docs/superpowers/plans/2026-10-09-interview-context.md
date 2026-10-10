# Interview Context Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans inline and one final reviewer. Steps use checkbox syntax.

**Goal:** Make misleading interview excerpts a playable, remembered media chain in both modes.
**Architecture:** `HL.Interviews` records statements/threads and hooks actual games; `InterviewUI` supplies Press Room, context and response dialogs. Career records actual selected postgame words; World remembers audience/person effects.
**Tech Stack:** Existing JavaScript/CSS, Node, Playwright; no footage/dependency/runtime AI.
**Spec:** `docs/superpowers/specs/2026-10-09-interview-context-design.md`

## Global Constraints
- Fictional in-save statements remain explicitly identified; original quote retained.
- Era-aware format, original real photos, private actions remain private.
- No manipulation of ability or fabricated game evidence; save/load and exact-once response/verdict.

## Review Focus
- Wrong-player responses in Career and wrong-team responses in Franchise reject without mutations.
- Response spam cannot farm trust/reputation; replay cannot double-assess games.
- Team departure/retirement and DNPs yield no false performance verdict.
- Source context survives later quotes/roster changes and is never rewritten by a response.
- Active live games prevent off-court interviews and responses.

### Task 1: Recorded source and reaction domain
Files: create `js/media/interviews.js`, `tools/test-interviews.js`; modify `career.js`, `world.js`, `season.js`.
Interfaces: `Interviews.record(L,pid,tone,fullQuote,facts)`, `hold(L,pid,tone)`, `respond(L,id,choice)`, `afterGame(L,g,res)`, `threads(L)`.
- [x] Write tests for provenance, ownership/atomicity, private boundary, era format, exact-once response/game verdicts, DNP/departure cancellation and actual Career hook; observe missing API failures.
- [x] Implement statements/threads, authored tones, response effects, World memories and actual-game hook.
- [x] Run domain suite and fix responsible layers.

### Task 2: Press Room, source and choices
Files: create `js/media/interview-ui.js`, `tools/test-interviews-browser.cjs`; modify `index.html`, `career.js` UI, `franchise.js`, `css/style.css`.
- [x] Observe missing visible media chain before implementation.
- [x] Wire Career Media and Franchise News; render real faces, excerpt/source comparison, one response, actual later status and press speaker/tone selection.
- [x] Verify Career quote → source → response → actual-game assessment, save/resume, Franchise player press scene and mobile/era view; inspect screenshots.
- [x] Fresh final reviewer, Important-fix pass, final checks, update roadmap and commit locally.

## Evidence and final review

- Missing domain/API and visible browser source controls were observed failing before implementation. Single-sentence context and invalid-club regressions also failed before their fixes.
- Independent reviewer reproduced retirement→return reviving an old thread. Observed failing regression, then fixed immediate cancellation at retirement/roster departures; 11 focused tests now pass. No second review loop was needed.
- 90 combined domain tests and 34 event assertions pass. Career/Franchise context browser flow, Live resume, photo overrides and thirty garment assets pass.
- The user added portrait quantity and lower, per-person garment fitting during execution. 600 source additions pass full SHA-256/registry/dimension/browser-decode checks. Desktop/mobile source-photo and media screenshots were inspected.
- Source statements are fictional in-save content. Real-world interview footage, broader social posting systems and the remaining scenario backlog are still outstanding.
