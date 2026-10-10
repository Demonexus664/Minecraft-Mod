# DNA and quick-mode refinement — 2026-10-10

Branch: `hoops-overhaul-2026-10`, continued from published `0c35ce9`. Existing game modes, historical data, best-five hands, rare legendary draft teams/wildcards, photos, tactics, career stories and season reports remain. This document describes this refinement, rather than declaring the whole HoopsLife roadmap complete.

## Combinations and actual basketball behavior

`js/league/legend-dna.js` contains 43 individual signature profiles, 23 authored historical relationships, 12 skill-interaction patterns, four compatible-role partnership patterns and 20 exceptional transformation recipes (13 skill/build recipes, seven team recipes). The forms are authored; arbitrary famous duos/trios do not generate hash-based mutations.

Chemistry is immediate. Transformations require authentic loaded player-season rows, relevant skills, elite tools and a matching frame. Team recipes also check their specific historical period and participant tools. Changing a card's season label does not qualify its old row. Duplicate input does not multiply an effect; evolution replaces its precursor; only two mutation families can coexist. Compatible effects merge by the strongest value for each mechanic, rather than repeatedly adding boosts.

Examples:

| Transformation | Qualification and distinctive action |
| --- | --- |
| Low-Center Power Finisher | Shaq strength, strong contact finishing and handle on a frame of 76 inches or less; protects balance on drives against bigger defenders. |
| Deep-Seal Paint Dominator | Shaq strength and elite inside tools on an 82–92 inch frame; improves deep post position, draws help and contests second chances. Passing reads determine the kickout opportunity. |
| Read-and-Relocate Perimeter Architect | Curry range plus fast release, handle, speed and IQ; uses screen coverage and repeated relocation. Replaces Screen-to-Logo Shot Creator. |
| Seven-Foot High-Release Marksman | Elite range, Durant release height and difficult-shot tools on a tall frame; shoots above smaller defenders rather than behaving like a sprinting off-ball guard. |
| Double-Team Post Escape Artist | Hakeem footwork, Jokić vision and strong IQ; pivots or passes away from committed help. |
| Long-Frame Rotating Rim Eraser | Wembanyama interior tools, IQ, speed and a physically capable long frame; deters drives and supports recovery. A small-reach/low-elevation build cannot qualify merely by inheriting a block ceiling. |
| Unanimous Curry: Two-Screen Relocation | Verified peak Bay core with Curry, Klay and Draymond together on the floor. |
| Logo Shooter and Point-Center Handoff | Exceptional real Curry and Jokić cards create a fictional handoff/screen partnership. |
| Switch-to-Rim Defensive Relay | Strong Kawhi, Garnett and Wembanyama seasons create a coordinated containment/recovery/rim-protection relationship. |

Twenty-four mechanic channels affect the existing possession simulator: range/gravity, screen windows, relocation, release geometry, anticipation/creation, transition, contact balance, post position/doubles/kickouts, passing accuracy, lane disruption, recovery, rim intimidation and rebounding position. Forced post help can change the actual shooter and passer. Precision belongs to the supporting and selected passer; movement and release remain the shooter's tools. Team partners must share the floor. Ability strength fades when the corresponding physical or learned tool declines.

Shots, assists, fouls, turnovers, rebounds and points still use the normal game ledger. `game.events.dna.home/away` records compact action counts for verification. The new mechanics do not append points to completed games or multiply every attribute. Existing legacy numeric-effect fields remain readable.

## Dependent attributes and honest explanations

Skill Draft retains a drafted ceiling separately from executable attributes. Dunking depends on height/reach, vertical and burst; screening depends on strength and timing; blocking depends on reach, elevation and help defense; shot creation depends on handle, footwork and separation. Those limits are reapplied during aging. A 99 dunk ceiling on a short build with poor elevation cannot execute as 99 dunk.

Preview, fusion, sidebar and final career construction use the same effective qualification. Unfilled physical support contributes zero to qualification, preventing a premature fusion based on assumed average athleticism. Panels show changed ceilings, actual ingredient values and qualifying thresholds, frame requirements, basketball behavior and activation conditions. Career habits have their own inspectable preference panel; frequency is not presented as a skill rating.

## Fusion and quick-mode gameplay

Rare transformations enter a dedicated card fusion scene: ingredient identities/season/tools, interaction, climax and transformed result. Shooting uses arcs/trails, interior forms use converging cards and ground impacts, defense uses blocking shutters, and flight forms use directional movement. Result explanations remain readable after skipping.

Ordinary chemistry never opens a cinematic. Escape/Close and Skip remain available, focus and timers clean up, reduced motion goes directly to the explanation, and failed portraits retain readable identities. Reel/flip failures expose the playable hand. Mobile width and repeated spins are browser tested. New run/Home cancels abandoned work, including pending first-loss choices and career auto-simulation, without stale screen writes. Existing real-player photos and the faceless created-player card remain; photographic fallback availability still varies by player.

82-0 closing calls now pause the existing game generator before a genuine final possession. Only eligible on-court closers can receive the call; three-point choices respect era rules. Drive, fade, three or pass resumes real possessions, including overtime if needed. Quarter scores, box scores and series results agree. Persistent roster injuries continue through the postseason. The four best-of-seven rounds remain the quick challenge format, distinct from Franchise's era-specific bracket.

## Longevity

Ordinary prime length is 3–12 seasons. Physical decline begins before learned-skill decline, with greater late-career attrition and lasting injury wear. NBA demand considers remaining effectiveness, mobility, defense and availability; it is not a fixed retirement-age switch.

The extraordinary curve requires **all** of longevity ≥98, prime duration ≥98, durability ≥94, stamina ≥96, IQ ≥92 and an elite learned basketball tool ≥95. Actual archive cards can assemble it. Such deliberately exceptional builds can retain roughly 45–55 viable years in the demand model; one maximum prime card alone cannot grant that outcome.

Auto-simulation pauses after two consecutive empty/minor seasons while no NBA offers are pending. The player remains active: manual development, offer decisions, comeback attempts and retirement remain possible. This avoids repeatedly generating meaningless minors until an arbitrary forced retirement.

## Evidence

- **203 Node tests passed** in the combined DNA, draft-hands, legacy, ratings, rules, live-game, career, front-office, relationships, media and interview suites.
- Twenty authored recipes checked against the real archive for reachable ingredients and valid physical qualification; short/tall power, evolving forms, duplicate handling, category ownership and partner-on-floor scope covered.
- Frequency samples: 3/400 mixed elite skill builds mutated; 284/400 randomly assembled legend-heavy teams had chemistry and none qualified a transformation in that particular best-season sample. This is a reproducible sample, not a claimed universal drop rate. Separate deliberate constructions qualify all 20 recipes.
- 200 ordinary aging viability curves: mean **16.6**, maximum **28** viable seasons. Six actual simulated careers at the initial refinement checkpoint: random builds **1 and 14 NBA seasons**, careful builds **24 and 26**, maximum-specialty builds **26 and 25**. Each eventually paused automatic play after two final minor seasons. These are samples, not a population census.
- Forty playoff games in both home orientations produced seven genuine interactive closing calls. An 82-game DNA accounting fixture completed 74–8 with 6,401 traced DNA actions against its repeated test opponent; this fixture is not a general difficulty benchmark.
- Chromium completed actual eight-card drafts/full 82-game seasons and postseason runs, all 23 Skill Draft hands, a complete build and its first season report. One initial browser run finished 64–18 and won four rounds in 21 games with three closing calls; a post-review run finished 61–21 and completed 18 playoff games with four calls. Runs are intentionally variable.
- Fusion stage/ingredient/result checks, category choreography, skip/Escape, no minor-chemistry interruption, reduced motion, mobile width, repeated five-card hands and injected animation failure passed. Screenshots were inspected.
- Existing coach/player gameplay browser regression passed, including persisted replay, matchups, tactical calls, typed conversation and eleven Player Career decisions.
- Event suite: **34 assertions passed**. A full Franchise regular season/playoffs/offseason rollover completed. A 1964 historical calibration report completed; it is a diagnostic report, not a tolerance-based pass/fail test.
- Nine no-DNA golden game hashes and RNG states match the untouched published-base simulator across 2025/1990/1964 and three seeds each. The old fixture already failed the untouched base; replacement hashes were generated independently from that base. The stale rebound-at-the-horn test now searches deterministic examples instead of assuming one obsolete seed.
- A fresh reviewer found two important semantic issues (raw/effective qualification and passer ownership) and a preexisting tendency-panel defect. Reproduction tests failed first; all three fixes passed the combined suite and browser checks.
- A final navigation regression reproduced null-state errors in both modes while starting a new run during asynchronous work. Cancellation guards, pending-choice cleanup and stopped career auto-simulation passed the same real-browser reproduction after the fix.

Reproduce from `hoops-life/` with Node's test runner and the three browser helpers: `tools/test-dna-browser.cjs`, `tools/test-dna-modes-browser.cjs`, `tools/test-gameplay-depth-browser.cjs`. Serve this directory on port 8000; browser helpers require Playwright and Chromium. Cloud startup instructions have been saved separately in the environment configuration draft.

## Limits and follow-up

This remains a statistical possession engine, rather than a player-coordinate tracking simulation. Spacing, screen coverage and rotations model conditional basketball effects without complete moving-player geometry. Existing no-DNA calibration is preserved, including its approximation limits: the 1964 sample undershoots pace/eFG and overproduces free throws, and team-record correlation varies. The work does not claim every historical season or fantasy team is perfectly balanced.

The extraordinary 45–55-year range has demand-curve and real-ingredient coverage, not dozens of complete half-century career simulations. Seasons beyond the archive reuse the latest available league, as in the existing mode. More player telemetry would improve rarity and long-career balance. Some historical players lack available photos; fallback identities stay usable. External animation documentation requests were blocked by the environment; choreography/performance techniques were validated in Chromium instead.

The wider Franchise/Player Career/media/scenario roadmap remains in ROADMAP.md and the scenario ledger. This change preserves those systems and their regressions; it does not mark all proposed scenarios implemented.
