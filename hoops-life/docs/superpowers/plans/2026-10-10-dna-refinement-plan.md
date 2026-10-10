# DNA refinement implementation plan

> For agentic workers: use superpowers:executing-plans inline, maintain this checklist, and request one fresh final review.

Goal: preserve the recently published overhaul while making its combinations distinct, qualified and playable.
Architecture: retain `HL.DNA` and both mode APIs; enrich entry provenance and introduce pure scoped basketball context. Extend existing game events and generator rather than replacing the sim. Retain photos and legendary draft systems.
Tech stack: browser JavaScript/CSS, Node test runner, Chromium/Playwright.
Spec: `docs/superpowers/specs/2026-10-10-dna-refinement-design.md`.
Global constraints: exact branch; no discarded features; no analysis RNG consumption; capped mutations; no minor chemistry cinematics; no fixed retirement age.

Review focus: incomplete historical evidence; signatures inherited from unrelated skills; bench-only partner effects; repeated application/duplicate categories; clutch points and overtime box/quarter consistency; elderly skill-only viability; dismissal during animation and mobile card width.

- [ ] Task 1: `legend-dna.js`, `test-dna-refinement.js`, mode entry producers. RED tests: random famous trio has no mutation, short/tall same strength differ, real recipes qualify only with season/category/body evidence, evolution replaces, team scope/idempotence. Implement authored recipes and explanations; GREEN `node --test tools/test-dna-refinement.js tools/test-draft-hands.js`. Update obsolete expectations explicitly rather than perpetuating automatic mutations. Commit.
- [ ] Task 2: `legend-dna.js`, `gamesim.js`, `challenge820.js`, `test-dna-mechanics.js`. RED tests on movement/gravity/post/defensive context and simulation action traces; clutch bookkeeping via generator. Add actual mechanics and compact counters, genuine pre-finish playoff decisions. GREEN targeted mechanics, live-game regression and 82-game test. Commit.
- [ ] Task 3: `skilldraft.js`, `test-dna-longevity.js`. RED ordinary/elite/exotic demand distribution, injury attrition and automatic minors stopping. Add joint extraordinary eligibility and differentiated decline/demand; preserve manual decisions. GREEN distribution and actual career runs. Commit.
- [ ] Task 4: `dna-fx.js`, `dna.css`, mode reveal calls, `test-dna-browser.cjs`. Browser RED confirms current immediate result/no ingredient cards and draft hand collapse guards. Implement staged shooting/interior/defense fusion, keyboard/skip/cleanup/portrait fallback and readable panels. Browser GREEN across repeated spins, viewport sizes and reduced motion; inspect screenshots. Commit.
- [ ] Task 5: run all domain suites plus relevant full-season/career/browser checks; fix observed regressions. Fresh reviewer checks whole change from base `0c35ce9`. Record evidence and limitations in `docs/DNA_REFINEMENT.md`, update roadmap, commit verified fixes and push `HEAD:hoops-overhaul-2026-10` without force.

Execution ledger
---------------
Baseline: 25/25 DNA/rare/legacy/draft-hand assertions pass, but some encode behavior the user explicitly wants replaced (automatic famous-trio mutation and a 99 duration keeping every attribute unchanged at age 50).
Ruling: use the existing checkout on the exact requested branch and keep approval implicit in the user's explicit autonomy/publication instructions — avoids diverging from recent work; cost if wrong: branch commits can be reverted.
