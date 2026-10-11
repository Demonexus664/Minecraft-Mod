# Hoops Life: Arena Edition Overhaul Checkpoint

## LATEST AUTHORITATIVE CHECKPOINT · 82-0 FUSION REBUILD (2026-10-10)

**This section supersedes all older fusion rules further down.** User clarified: 82-0 gets roster fusion AND actual on-court teammate duos/trios/chemistry. Skill Draft gets combinations among the skills of one assembled player, NOT roster-parent team chemistry.

- **Genesis launches directly from the My Team court, not a detached Fusion tab.** Choose two currently rostered cards. The attempt permanently consumes BOTH immediately. On success, one hybrid goes directly into the first lineup slot; the second slot is empty. On failure, BOTH slots are empty and there is NO consolation card. Successful hybrids can be used for more fusions.
- **Atomic gameplay transaction**: `HL.FusionLab.commitRoster()` verifies the inputs and performs immediate success/failure updates before the charge/collision/reveal animation. Original-player lineage survives repeated fusions, including photos; a three-way hybrid displays THREE original portrait strips, a four-way hybrid FOUR, etc. Names show Paint Trinity (3), Paint Titans (4), or appropriately counted alternative identifiers.
- **Dominant statistical power**: successful generational interior hybrids inherit elite post scoring, contact finishing, strength, rebounding, blocks, vision and double-team reads, with genuine effects in the possession engine. They get realistic elite minute targets and meaningful usage, crash and rim protection, not a cosmetic OVR or fake box-score bonus.
- **Actual stats visible**: 82-0 results include Genesis Season Spotlight with the fusion's original ancestors and real simulated PPG, RPG, APG, BPG, MPG and TS%. The old sample's 77.4 was TRUE SHOOTING %, not 77.4 OVR. Best-run records and share summaries use the hybrid's name rather than the adapter-card name.
- **Controlled full-bench synthetic test**: the deterministic 12-game illustrative Wilt + David Robinson + Shaq-style experiment produced around 45–50 PPG and 20–24 RPG in successive balanced builds, substantially above the ordinary elite center and two-way fusion. These are elite synthetic profiles, NOT verified historical archival season predictions or guaranteed live-game numbers.
- **Mode presentation**: no solo historical named mutations for an 82-0 card just because Carmelo or another player was drafted. Team Combos shows actual duo/trio/team chemistry. Skill Draft's own ability display is driven by collected skill attributes.
- **Verified**: GitHub Actions run 38106597937 passed 82/82 tests on the preceding gameplay version. Subsequent UI cleanup requires an updated run. `tools/test-genesis-820.js` checks two-to-one roster replacement, total failure loss, 3/4-way ancestry and real full-rotation NBA possessions. Previous draft-first regression tests were updated to new irreversible rules.
- **Not visually inspected in a real browser**: the user's remotely connected PC remained offline. Source styling and code exist, but screenshots, animations and mobile pixel polish are not yet user-validated.

### Next iteration
1. Inspect actual running browser visuals (cards, reactor animation, failure, 3/4-way portrait, results) and fix what looks wrong.
2. Verify 82-0 combinations with ordinary team-mate duos/trios, clear requirements, and measured action counts in possession logs.
3. Deepen Skill Draft *personal* skill-fusion recipes and on-court skill activation, preserving the drafting-first UI.
4. Run wider era-by-era scoring and stat-balance tests and address save/resume or roster persistence bugs.

---
## CURRENT DIRECTION: DRAFTING FIRST (user correction, 2026-10-10)

This section supersedes earlier ideas about expanding Skill Draft seasons with media, game-night decisions, press rooms, career training and role studios. The user explicitly rejected that bloat. **Do not re-add these career UI systems unless specifically requested.** Spend the development effort on the actual card drafting, skill inheritance, team-building, duo/trio interactions and mutation displays.

### Now implemented

- **Historical note (superseded):** 82-0 now has My Team and Combos views. Fusion is an immersive reactor launched from the My Team court, never a separate tab.
- **Genesis moves exclusively to 82-0**, usable as soon as two Classic-mode players are drafted (not after eight). The selector can choose only from players the user actually rolled into the current lineup. Every parent card is eligible for exactly **one attempt per run**, regardless of success/failure. Fusion odds are computed from real player skill profiles, size, similarity and tension, capped below certainty even for two players at the same position. Repeated attempts never improve odds.
- **Updated rule:** BOTH cards are permanently consumed on any attempted fusion. Successful hybrid replaces one; failure leaves both spaces vacant. Successful hybrids can fuse again.
- Real 82-0 sim creates fused players with real attributes, out-of-position penalties, tendencies, body frame and actual possession mechanics. The original parent no longer quietly contributes double team DNA. Hybrid lineup cards show a split source portrait and can be dragged between slots.
- Every rolled 82-0 card now shows a compact **best open position / effective OVR / potential new duo, trio or rare DNA** indicator. This is information at the moment of selecting a player, not a distant results panel.
- **Skill Draft** has separate My Skills and Abilities & Combos tabs. Skill cells can be filtered to All, Collected or Empty, with an independently scrolling grid. Free Choice's list of available skills is grouped into tabs for Skills, Playstyle and Career Traits, and potential new duos, trios and rare DNA reactions are previewed *before* selection.
- **Skill Draft career was slimmed down on purpose**: recurrent Press Room, training, role selection, public promise, gameplay-night, rivalry reports, repeated DNA telemetry and auto-generated media were removed from its active gameplay path. The career sidebar is a compact player card and basic numbers, while season recaps contain team record, player box-score strip, awards and an optional playoff details fold. Existing basketball league evolution, records, free agency, playoffs, aging and retirement remain.
- Legacy unused helpers/files may remain for compatibility with older tests, but are not presented in Skill Draft or invoked by its standard career loop. The user does not want these reintroduced.
- Regression suites were updated for no-roll-farming probability and no hidden offseason rating boosts. New `tools/test-draft-first.js` validates successful two-into-one fusion, one-attempt failures, unavailable fusion in HoopIQ/Daily and draft-only tabs. CI invokes it with the other season/draft tests.
- **Verified current gameplay:** GitHub-hosted workflow run 38106597937 completed 82 tests, 82 passed, 0 failed. Recheck later commits.

### Next iteration targets

1. Observe *actual browser UI*, especially short screens and mobile. Fix overflow, sticky sidebar behavior, touch dragging, fusion modal controls, keyboard navigation, and cramped role/skill selection. The authorized remote PC has been offline: do not claim screenshot verification.
2. More **draft-time** interaction and clarity: card-to-card comparison, candidate chemistry/effective OVR, selected skill interplay, and transparent rare mutation requirements. Improve duo/trio and ability consequences *inside actual possessions* with careful tests.
3. Improve fusion outcomes and readable tradeoffs, rather than adding random effects. Keep one attempt per parent and fair odds. Avoid a giant archive-search laboratory or automatic stat inflation.
4. Keep career simulation simple. Do not add narrative management or training menus unless user opts in.

---



Branch: hoops-overhaul-2026-10 | Updated: 2026-10-10

## Purpose
Keep iterating on both 82-0 and Skill Draft. Focus on actual player decisions, grounded basketball skills, evolving leagues, challenge variety, distinct audio and VFX, fictional reactive media, polish and regression testing. This is an iterative work-in-progress, not a finished-game certification.

## What has been implemented

### 82-0
- Four independent season missions: perfection, defensive success, offensive success and clutch results.
- Three adaptive coach personalities modify actual possession-engine defensive coverage, tempo, pace or offense.
- Interactive tactical Film Room timeouts approximately every 20 games, optional for uninterrupted sims.
- Optional four-date Legend Gauntlet against real elite contemporary rosters, with no invented opponent ratings.
- Card scouting Film Room shows historical strengths, weaknesses and positional fit, while HoopIQ keeps its hidden information.
- Lineup swaps recalculate draft-stage DNA; first-loss restart is shown only for the perfection mission.
- Live ticker shows matchup, clutch/boss events and outcomes.
- Postseason reports now include unscripted standout games, game-by-game film strip, 10-game chapters, high scorers, tough losses and boss wins.
- Courtside generates clearly fictional fan/analyst reactions to real simulated games and completed or failed missions.

### Skill Draft
- Original and Free Choice drafting remain available; Free Choice rolls franchise/decade, then choose any player and unfilled skill.
- After the archive ends, generated leagues draft rookies, develop players, move rosters, retire veterans and regenerate award rivals.
- Ordinary careers have bounded aging and longevity rather than half-century NBA primes.
- Offseason Training Lab offers six specialties with small, diminishing, skill-specific development.
- Legacy Quests track career achievements using actual recorded results.
- Season Gameplan Studio has five roles that alter real game usage, passing, driving, defensive effort and workload, never the raw build ratings.
- Season contracts give a modest additional training-session reward only when a real statistical or championship target is met.
- Persistent MVP rivalries keep records of repeat season challenges against actual league competitors, including post-archive players.
- Courtside produces fictional, conditional reactions to rivalries, injuries, records, titles and awards.

### Presentation
- The new css/overhaul.css Arena Edition layer upgrades reels, cards, rarities, courts, matchups, film-room UI, seasonal reports, training, rivals and mobile layout.
- Context-specific synthesized SFX are used for important moments. The shared FX control offers Cinematic, Light and Off modes, persists across game modes and respects reduced-motion settings.
- css/overhaul.css is loaded by index.html, and js/media/fanfeed.js is loaded before both challenge modes.

## Quality checks
- Dedicated Node regression suites: tools/test-overhaul-batch1.js, tools/test-overhaul-batch2.js and tools/test-fanfeed.js.
- Existing regressions remain covered: test-skilldraft-freechoice.js, test-skilldraft-future.js, test-dna-longevity.js and test-rare-and-overhaul.js.
- GitHub Actions automation: .github/workflows/hoops-life-overhaul.yml, triggered on branch pushes and manually.
- A GitHub-hosted run completed 34 of 35 tests, with one failed assertion caused by VM-created arrays crossing Node realms; the assertion has since been corrected. Later runs must be checked for full green status.
- In-chat execution confirmed real 2026 games with different on-court play styles and dynamic rival standings. Standalone targeted suite checks also passed.
- Browser screenshot inspection, complete keyboard/accessibility review, all-mode playthroughs, wide-season statistical Monte Carlo and strict historical balance are not yet finished.

## Batch 3: Directed presentation, career discourse and basketball film

- DNA transformation overlays now have four separately directed cinematic families: shooting gravity, paint power, perimeter defense and vertical flight. Their stage headlines, interaction motion and synth motifs differ. The overlay directly lists active, explained basketball mechanics and tested intensity, not generic OVR promises.
- Sound engine now uses a shared WebAudio compressor, dynamic master volume (default 75%), tapered envelopes, filtered impact noise, camera shutter, arena sounds and family-specific fusion motifs; Cinematic/Light/Off FX settings remain supported.
- Skill Draft Press Room creates one relevant annual media question based on authentic season facts: MVP rivalry, scoring reputation, injury, championship defense, missing playoffs or decline. Responses include quiet work, supporting teammates and accountable high-stakes public promises.
- Era-correct visual/media treatment: classic sports newspaper and press rooms before modern video platforms, ClipFeed-style coverage in the modern era. Vertical broadcast press screen, reputation/trust/heat gauges, response cards and carried-forward receipts.
- Bold press statements are checked against the next actually simulated season: 30 PPG, a playoff berth or beating the specific named MVP rival. A retired or unqualified named rival voids the challenge without penalty. Failed statements get believable fictional backlash, successful statements get positive coverage.
- Public reputation changes future free-agent offer amounts within a bounded 8–9% range. It does not inflate player attributes, award voting, possessions or win probability.
- Rotation stability: Skill Draft now restores all historical/generated teammates' realMPG after the temporary user-star minutes adjustment; role tendencies derive from a fresh yearly baseline rather than compounding when switched.
- 82-0 Film IQ now records actual shooting, turnover, rebound and assist evidence in every game, names recurring concerns and offers non-guaranteed coaching suggestions. It also compares real records and net point differential for each used defensive/offensive/tempo combination.
- Dedicated Film IQ and Press Room visual CSS, mobile presentation, reduced motion and intensity support. No real social accounts or outside brand logos were added.
- Regression suites added: test-skill-press.js, test-presentation-batch3.js and test-film-iq.js. The Batch 2 suite also checks repeat seasons do not permanently shrink teammate minutes or stack role bonuses. CI workflow includes new modules.
- Local focused tests: 12/12 Press Room and Film IQ logic tests passed. The latest verified GitHub-hosted branch run (run 38086526357, commit d9ac5b6c2d2bed665b44d673e92b442212d70315) completed **58 tests, 58 passed, 0 failed**. The earlier Film IQ threshold and optional-chaining assertion failures were fixed.
- A full desktop/browser visual screenshot walkthrough was **not** performed: authorized Remote Desktop Commander PC was offline. The code and CSS are present, but pixel-level layout QA is still pending.
## Batch 4: DNA Synergy Network, Recursive Player Fusion and Live Game Choices

- Extended the genuine on-court DNA system by **12 new elite duo combinations, 10 elite trios and 6 lineup team chains**, each with actual basketball context and qualification thresholds. Superhuman builds still need correct source skills and specific possession opportunities; no free mutation per card.
- Added a responsive **Power Network** in Skill Draft and 82-0 showing verified player source names, elite tool links, duos, trios, mutations, specific gameplay activations and mechanic potency. Compact while drafting, full encyclopedia once the player build is finished.
- Added **Ability Replay** sourced from `HL.simGame(...).events.dna`, aggregating actual recorded team-wide actions (spacing gravity, late release, weak-side intimidation, precision passing, etc.). Team-wide, not falsely attributed to individual players.
- Improved existing **Genesis Fusion**: any historical players and hybrids can be combined recursively and re-used as parents without a generation cap. Examples Kobe+Curry are more compatible, while Curry+Shaq remains possible but extremely rare. A meaningful failed fusion leaves parents intact and provides a diagnosis, with a small, bounded experimental stabilization learning curve.
- Successful fusions now inherit specialist strengths rather than magically taking the best of each parent's every 99. Height/frame restrictions, certain physical tradeoffs and active ability effects carry through. Equipping one improves at most six elite rated tools plus special gameplay interactions. Original draft skill choices still matter.
- Real historical player photos are shown split left/right; the Genesis UI displays inherited skills, ancestral origins, actual frame costs, failed experiment diagnoses and a persistent multi-generation hybrid gallery. `localStorage` saves the collection between sessions and careers when available; a brand-new Skill Draft run no longer erases the gallery.
- Added **Game Night decision scenes** to manually played Skill Draft seasons at games 1, 21, 41 and 61, with distinct contextual story beats: debut, early league momentum, midyear adjustments and playoff push. Choices include takeover, transition, pass-first, defense, or balanced basketball; each changes real `HL.simGame` team strategy (pace, offensive focus, defense, rebounding, usage). No story-only stat or OVR rewards.
- In featured games, actual `HL.createGame` stepwise simulation also pauses at the start of Q3 for **live scoreboard adjustment**, then updates the live team tactical controls for the remaining game. Results save both the pregame decision and the live third-quarter adjustment. Automated 10-season sim keeps the original uninterrupted path.
- Aggressive tactical choices add a small, strictly bounded next-season fatigue/injury risk (decays with rest). Choice records and score-driven outcomes are shown on the season report.
- Major additional CSS visual treatments for game-night broadcasts, live scoreboards, active DNA networks, ability telemetry, hybrid portraits and ancestry gallery, inherited tool meters, failure diagnostics and MyPlayer equipped fusion dossier. Light/Off modes and reduced motion remain supported.
- Added tests: `tools/test-genesis-game-night.js`, `tools/test-power-network.js`, expanded `tools/test-overhaul-batch2.js` verifying interactive games against real NBA possession simulation. All are in the GitHub Actions regression workflow.
- Verified hosted run `38089086530` (including live third-quarter choices): **71 passed, 0 failed**. A subsequent docs-only commit preserved this verified code state.
- **Not yet done:** real browser screenshot QA. Desktop Commander PC remained offline; do not claim screenshots or user-playtested polish.
## Next priorities
1. Use a real browser for screenshot comparisons of 82-0 draft, scout screen, game ticker, film reel and Skill Draft pick/career/result screens. Improve what visibly looks wrong, especially smaller screens and pacing.
2. Replay balance tests across eras, coach identities, missions, gauntlet opponents, individual career roles, generated rivals, titles and retirement ranges.
3. Continue player-driven depth: more basketball-specific dynamic decisions, media pressure, longer-lived rivalries, meaningful coaching choices and scenario-specific game stories. Avoid arbitrary stat inflation.
4. Improve stability: safe resumable saves, long-campaign performance, card-grid rendering cost, error recovery and regression coverage for new features.
5. Review entire gameplay, audio, motion and UX by actually playing through cases rather than assuming source edits automatically look good.

## Continuation instruction
When user says continue, inspect this file and the latest branch commit, review any failing GitHub Actions runs, and start the next meaningful gameplay/visual/QA batch. Implement changes, run targeted checks, commit, and update this checkpoint. Do not redo completed work unless addressing a bug or quality gap. Do not claim infinite unattended background work.
