# DNA refinement implementation plan

> For agentic workers: use superpowers:executing-plans inline, maintain this checklist, and request one fresh final review.

Goal: preserve the recently published overhaul while making its combinations distinct, qualified and playable.
Architecture: retain `HL.DNA` and both mode APIs; enrich entry provenance and introduce pure scoped basketball context. Extend existing game events and generator rather than replacing the sim. Retain photos and legendary draft systems.
Tech stack: browser JavaScript/CSS, Node test runner, Chromium/Playwright.
Spec: `docs/superpowers/specs/2026-10-10-dna-refinement-design.md`.
Global constraints: exact branch; no discarded features; no analysis RNG consumption; capped mutations; no minor chemistry cinematics; no fixed retirement age.

Review focus: incomplete historical evidence; signatures inherited from unrelated skills; bench-only partner effects; repeated application/duplicate categories; clutch points and overtime box/quarter consistency; elderly skill-only viability; dismissal during animation and mobile card width.

- [x] Task 1: `legend-dna.js`, `test-dna-refinement.js`, mode entry producers. RED tests: random famous trio has no mutation, short/tall same strength differ, real recipes qualify only with season/category/body evidence, evolution replaces, team scope/idempotence. Implement authored recipes and explanations; GREEN `node --test tools/test-dna-refinement.js tools/test-draft-hands.js`. Update obsolete expectations explicitly rather than perpetuating automatic mutations. Commit.
- [x] Task 2: `legend-dna.js`, `gamesim.js`, `challenge820.js`, `test-dna-mechanics.js`. RED tests on movement/gravity/post/defensive context and simulation action traces; clutch bookkeeping via generator. Add actual mechanics and compact counters, genuine pre-finish playoff decisions. GREEN targeted mechanics, live-game regression and 82-game test. Commit.
- [x] Task 3: `skilldraft.js`, `test-dna-longevity.js`. RED ordinary/elite/exotic demand distribution, injury attrition and automatic minors stopping. Add joint extraordinary eligibility and differentiated decline/demand; preserve manual decisions. GREEN distribution and actual career runs. Commit.
- [x] Task 4: `dna-fx.js`, `dna.css`, mode reveal calls, `test-dna-browser.cjs`. Browser RED confirms current immediate result/no ingredient cards and draft hand collapse guards. Implement staged shooting/interior/defense fusion, keyboard/skip/cleanup/portrait fallback and readable panels. Browser GREEN across repeated spins, viewport sizes and reduced motion; inspect screenshots. Commit.
- [x] Task 5: run all domain suites plus relevant full-season/career/browser checks; fix observed regressions. Fresh reviewer checks whole change from base `0c35ce9`. Record evidence and limitations in `docs/DNA_REFINEMENT.md`, update roadmap, commit verified fixes and push `HEAD:hoops-overhaul-2026-10` without force.

Execution ledger
---------------
Baseline: 25/25 DNA/rare/legacy/draft-hand assertions pass, but some encode behavior the user explicitly wants replaced (automatic famous-trio mutation and a 99 duration keeping every attribute unchanged at age 50).
Ruling: use the existing checkout on the exact requested branch and keep approval implicit in the user's explicit autonomy/publication instructions — avoids diverging from recent work; cost if wrong: branch commits can be reverted.

Task 1: complete — authored qualification, category ownership, duplicate/evolution and reachability checks; commit 3bb0c76 plus the verified refinement checkpoint.
Task 2: complete — actual possession context, 40 playoff games with seven real closing calls, 82-game score accounting and browser postseason (21 games/three calls).
Task 3: complete — 200 ordinary viability curves (mean 16.6, maximum 28); six actual careers: random 1/14 NBA seasons, good 24/26, best 25/26; automatic play pauses after two final minor-league seasons.
Task 4: complete — staged fusion screenshots inspected; shooting/interior/defense choreography, reduced motion, Escape/skip, animation failure recovery, mobile hands and all 23 Skill Draft picks verified in Chromium.
Validation checkpoint: 46 focused tests and 155 domain regression tests pass. Native browser end-to-end 82-0 and first Skill Draft season pass.
Ruling: published-base golden hashes and the offensive-rebound horn fixture were already stale — independently reproduce with the untouched 0c35ce9 simulator, regenerate hashes from that base and search deterministic horn cases instead of one obsolete seed — cost if wrong: golden-fixture changes could hide a regression; nine matching base/current hashes and RNG states guard against this.
Ruling: calibrate unreachable recipe thresholds and exceptional durability against actual archival card values — makes all 20 authored transformations reachable while retaining joint rare conditions — cost if wrong: rarity may require further balancing with player telemetry.
Ruling: every inspected chemistry ability is active, merged by per-mechanic maximum rather than a silent first-six cap — explanations match gameplay without additive stacking — cost if wrong: strong compatible builds could need balance adjustments.

Final review: fresh reviewer examined 0c35ce9..8a20568; two Important findings and one preexisting Minor. No critical issue.
Final: fixed raw-vs-effective mutation qualification — historical Wembanyama/Bogut/Dirk regression RED→GREEN; preview/reveal/sidebar/final build share reconciled limits and incomplete supports fail closed.
Final: fixed precision passing ownership — receiver-versus-passer regression RED→GREEN; supporting precision changes pass opportunities, actual passer improves the delivered shot and records precisionPass actions.
Final: Ruling: re-grade the preexisting tendency-panel NaN as Important — invalid visible career data conflicts with the user's explicit requirement to repair invalid statistics; display actual habits separately as preferences — cost if wrong: a small additional UI change. Browser NaN assertion RED→GREEN.
Final suite after semantic fixes: 203/203 assertions passed; fusion/modes/gameplay browser suites passed; event assertions 34/34, full Franchise season/rollover and 1964 diagnostic report completed.
Final: Ruling: use zero support for unfilled physical tools during qualification — prevents assumed-average previews from promising transformations that a later low-vertical card revokes — cost if wrong: some fusions appear later in drafting.
Final: fixed abandoned-run writes — real-browser cancellation regression reproduced null `busy` and `dna` errors in both modes RED→GREEN; guarded asynchronous continuations, cancelled pending choices, stopped abandoned career auto batches and protected navigation. Final combined suite 203/203 and modes browser with cancellation passed.
Task 5: complete — 203/203 tests, all three browser helpers, event checks and final two actual random careers passed; implementation commits 3bb0c76, 8a20568 and aa4cba4 published to the exact requested branch. No worktree or user changes discarded.
