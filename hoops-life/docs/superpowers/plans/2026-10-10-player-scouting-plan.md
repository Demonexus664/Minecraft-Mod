# Player scouting implementation plan

> **For agentic workers:** use superpowers:executing-plans inline. Preserve the existing branch and changes.

**Goal:** Correct recognizable player specialties with individually authored historical scouting judgments.
**Architecture:** Season-scoped notes in the existing ratings module enrich its shared historical projection. The common quick-mode skill scorer measures mechanics quality independently of physical release elevation.
**Tech Stack:** browser JavaScript, Node tests, Chromium/Playwright.
**Spec:** `docs/superpowers/specs/2026-10-10-player-scouting-design.md`.

## Global constraints

No bulk recalibration or automatic fame-based boosts. No forced overall. Preserve physical dependencies, historical statistics, era rules, photos, DNA and career behavior. Exact branch: `hoops-overhaul-2026-10`.

## Review focus

Rookie and post-injury seasons must not inherit a player's full prime. Shooting specialists keep defensive/physical weaknesses. Modern scouting notes cannot fabricate pre-line threes. Runtime grades must agree between cards and roster players. Higher specialties must not make mutations routine or corrupt score/stat ledgers.

## Task 1: Individual scouting and honest mechanics cards

Files: `js/league/ratings.js`, `js/modes/challenge820.js`, `tools/test-player-scouting.js`.
Interface: `HL.historicalScouting(row)` returns applicable named notes; `HL.historicalAttributes(row)` preserves its existing API; `HL.Challenge.skillValue(candidate,category)` remains the shared quick-mode grade.

- [ ] Write failing tests for Curry mechanics, historical specialists, temporal limits and projected trait consistency; run them and inspect the failures.
- [ ] Inspect current player-season data and author individual notes with years and basketball reasons; correct shared mechanics grading.
- [ ] Verify passing focused tests and review before/after coverage, specialty grades and overall distribution.

## Task 2: Integration, browser proof and publication

Files: tests and `docs/PLAYER_SCOUTING_AUDIT.md`, `docs/ROADMAP.md`.

- [ ] Run archive validation, existing Node suites, meaningful season simulations and browser cards; diagnose and fix regressions.
- [ ] Obtain one fresh final review and resolve material findings with regression tests.
- [ ] Record exact coverage/limits, commit verified changes and push to the user's branch.

## Evidence and rulings

Base: `69856ac109809f9c120dc60eb6fd81110a9fc2dd`. Working tree initially clean, remote exact match. Node/Chromium/Playwright and static port 8000 already available; no additional environment configuration needed.

Ruling: individually author specialties, not blanket whole-player upgrades; this preserves actual weaknesses but unreviewed archive players keep the existing projection.
