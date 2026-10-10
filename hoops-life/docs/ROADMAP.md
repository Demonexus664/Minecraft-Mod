# Hoops Life: progress, roadmap and handoff

Last updated: 2026-10-09. Previous handoff branch: `claude/eager-davinci-buz3b6`. The current cloud checkout is on `work`; local commits are separate from the previous handoff branch and have not been pushed.
Open `hoops-life/index.html` in a browser; no build step. Real headshots and logos load from the NBA/ESPN CDNs in your browser.

## Product goal

A browser basketball world combining deep Franchise/MyNBA control, Player Career/MyCareer + BitLife decisions, and the 82-0 and Skill Draft quick modes. Games resolve through simulation, including the planned Live Game decisions. Training, playing style, relationships, contracts, trades, money, fame and personal choices should have immediate and delayed consequences, with the league and media reacting to actual events. MyCareer earns progress through player actions; MyNBA provides broad sandbox customization.

The fuller original plan and later corrections are reconciled in [PRODUCT_VISION.md](PRODUCT_VISION.md). Read it before choosing future feature scope. The user supplied the older conversation as context, including outdated progress reports; it does not change the queued order below. Player Career remains a major planned mode and needs a coherent playable loop when its milestone is reached.

The older percentage estimates below are inherited handoff estimates, not measured completion percentages for the full vision. Use the concrete missing features and scenario ledger to assess scope.

## Where things stand

| Area | State | Notes |
|---|---|---|
| League engine and sim | Strong (~85%) | Every season 1946-47 to 2025-26 with real rosters; possession sim calibrated to real stats (2025-26 PPG r 0.96, FT/FGA .204 vs .206). Era rules, playoff formats, real drafts, aging and retirement. Foul trouble, offensive fouls and charges, last-second heaves and buzzer-beaters were added this session. |
| 82-0 Challenge | Done, game-style | Slot reels, dealt hands of 5 cards, a court with drag and drop where anyone plays anywhere (out-of-position rating cost), 3 bench spots, a live season ticker, daily challenge, share, achievements, any season and era look. |
| Skill Draft Career | Done, game-style | Three reels (team, decade, skill), dealt hands, a build board; your player is a jersey card with no face. Pick any real draft class. Play season by season (stats, award voting ranks, playoff series, FA offers, trades, minors, retire) or sim it all; banners for big moments. The verdict is ranked against every real career. |
| Franchise (MyNBA) | Playable core + roster decisions | Any season, any team, sim, playoffs, news, Media Day, records, grouped rules, player trades/Trade Finder, free agency, contracts, payroll and player meetings. Draft/scouting, staff, advanced CBA and broader sandbox/business systems remain. |
| Media | ~50% | Era voices, no-repeat engine, 21,520 ChatGPT pack lines wired, event stories (records, buzzer-beaters, comebacks...), media day and social threads with composed TikTok/YouTube/quote visuals and player responses. |
| Scenario ledger | 27 implemented, 4 partial, 5 blocked, 1,104 not started (of 1,140), plus 9 of mine | See `docs/scenarios/LEDGER.md`. 605 of the scenarios need Player Career. |
| Player Career (MyCareer + BitLife) | Not started | The biggest remaining part. |
| Live Game (make the calls during a game) | Not started | |

## Your requests still in the queue (in order)

1. **Reference-inspired visuals.** Screenshots are now supplied. The modern 82-0 stage has dark texture and orange contrast; continue visual polish without copying NFL Perry. Real headshots and reusable team-specific photographic jerseys replace drawn player art.
2. **Rulebook expansion** (task #9), first batch completed locally. Added backcourt timing, offensive/defensive three seconds, illegal defense / zone ban, rebound clock resets and team-foul bonus; renamed the experimental contact rule to "Full-contact defense." Existing controls already include hand-checking, foul-out limit, scoring lines, full shot clock and period lengths. Remaining: take-foul and clear-path penalties, goaltending/interference, five-second violations, coach's challenge, timeouts, Elam ending, FIBA lane, roster size and minutes limits. Each addition needs actual consequences, reactions, persistence and tests. Full-contact defense currently modifies rim finishing and injury risk; flagrant foul grading is not implemented.
3. **More "game" everywhere.** Bring the same feel (reveals, cards, banners) to Franchise: a draft lottery reveal with ping-pong balls, draft-night cards, trade announcement cards, and playoff bracket animations.
4. **Remaining front office** (task #5): draft/scouting and lottery, picks/swaps and multi-team trades, staff, owner directives/business, advanced CBA and game plans. Player trades/Trade Finder, negotiated free agency/extensions/waivers, financial commitments and four player-meeting choices now work; the broader action space remains queued.
5. **Player Career** (task #6): MyCareer + BitLife in any era, freedom with consequences, a storyline screen, dialogue, and the league reacting to you. It uses the event log, media day and threads built this session.
6. **Live Game mode**: make the calls in any game as coach or player, resolved by the same possession sim.
7. **Remaining scenarios**, in batches by system (see the ledger), plus my own additions.

## How to continue (technical notes)

- Code map: `js/league/` (sim, season, history, events), `js/media/` (engine, news, eventnews, mediaday, rules), `js/core/` (ui, graphics, fx = effects and cards, state), `js/modes/` (challenge820, skilldraft), `js/coach/franchise.js`.
- Data: `data/history/` (built by `tools/build-history.py` from the Basketball-Reference datasets; see `data/history/README.md`).
- Content packs: `packs/media-pack-*.js` (`window.HL_PACKS`). Prompts for more content are in `packs/CHATGPT_PROMPT.md`, and for images in `IMAGE_PROMPT.md`.
- Scenario status: edit `docs/scenarios/status.json` and `claude-additions.json`, then run `node tools/scenario-ledger.js`.
- Tests (Node, headless):
  - `node tools/test-history.js 2025` checks sim calibration against a real season.
  - `node tools/test-sim.js` checks scoring distributions.
  - `node tools/test-events.js` checks event triggers, near misses, record books and save/load.
  - `node tools/check-packs.js 2025` checks pack lines against facts the game emits.
  - `node tools/test-skilldraft.js 3 good` checks career balance.
  - `node --test tools/test-rules.js` checks the rulebook and its effects, migration, historical overrides and reactions.
- Browser checks also include `node tools/test-frontoffice-browser.cjs`, `node tools/test-photos-browser.cjs`, and `node tools/test-uniforms-browser.cjs` (the latter creates two 15-team galleries and a two-player reuse screenshot under `/tmp`).
- Serve from `hoops-life` with `python3 -m http.server 8000 --bind 127.0.0.1`. With Playwright and Chromium installed, `node tools/test-rules-browser.cjs` tests the visible switches, inputs, rule-change news, actual sim and IndexedDB reload. Set `CHROMIUM_PATH` if Chromium is elsewhere. The cloud environment also retains a general gameplay smoke helper at `/workspace/scratch/hoops-life-smoke.cjs`; that helper is not tracked in the repository.
- Calibration guardrails: after any sim change, re-run `test-history.js` for 2025, 1990 and 1964, plus `test-sim.js`.

## Recent history (this session)

Skill Draft Career, season by season, then the content packs, scenario batch 1 (event log, record book, buzzer-beaters, comebacks), media day and social threads, the jersey and photo fix, 82-0 in any season, then 82-0 and Skill Draft rebuilt as card games.

## 2026-10-09 continuation: approved rulebook batch

- Grouped six new settings into Clock, Lane & defensive coverage, and Contact & fouls. Backcourt offers 8 seconds, 10 seconds, or disabled; the team bonus can also be disabled.
- Backcourt and offensive lane violations charge real player turnovers. Defensive lane violations award one technical free throw and retain offensive possession without a personal foul. Zone game plans use man coverage when zones are banned. Rebound resets cap the next possession duration; team fouls control bonus trips (the overtime threshold is capped at four).
- New game facts are kept in box scores as typed violations, clock resets, bonus trips and coverage adjustments. These are not yet separate scenario news stories. Lane/backcourt violations use statistical estimates from possession duration and tactics, rather than player coordinates. The zone ban is a coverage restriction, not a full historical illegal-defense officiating model.
- Historical defaults switch defense/backcourt settings in 2001 and the rebound reset in 2018. Old saves acquire missing defaults; explicit rule changes and recorded history survive loading and season transitions.
- Rule changes publish media commentary plus attributed player and team-ownership quotes. Existing controversy/history bookkeeping remains; ownership quotes do not implement union negotiations, financial consequences or sanctions.
- Renamed "Tackling" in the screen and rule-change headlines, retaining its saved key for compatibility. Fixed the existing zero-injury-frequency bug and a rebound-at-the-horn clock leak into the next quarter. Empty numeric edits restore the previous value instead of silently becoming zero.
- Verification: 12 rule tests passed; browser rule editing, gameplay and reload checks passed; all 34 existing event assertions passed. The 400-game sample and historical checks for 2025, 1990 and 1964 completed, with scoring correlations of 0.96 in each era. A full season/offseason run, one complete Skill Draft career, and the content-pack audit also completed on the final simulation. These calibration scripts report statistics, not assertion-based pass/fail tolerances; league pace/efficiency still have the model's existing approximation limits.
- The initial repository inventory covered all 178 files: JavaScript/JSON parse checks, all 89 generated season files, 5,416 player bios, 27,011 player-season rows, five content packs totaling 21,520 lines, and all 28 font-file headers. Generated data and binary assets were checked structurally; application code and the relevant handoff were reviewed for the chosen feature. The two new rule test files accompany the feature.

The scenario ledger remains at 27 implemented, 4 partial and 5 blocked: this batch does not claim that publishing a rule change completes a proposed scenario. Follow-up event stories still require their exact triggers, consequences and tests. Also keep in mind that four-point attempts currently share the sim's three-point stat fields; separating them is follow-up work outside this approved batch.


## 2026-10-10 continuation: front office and a reactive locker room

- Trades, Free Agency and Finances are playable. Exchange 1–3 players on each side, inspect deterministic AI valuation, use Trade Finder, negotiate contracts, extend expiring deals, waive players and inspect five-year commitments. Moves change real rosters; waiver guarantees and pending extensions survive JSON/IndexedDB and season rollover. Coach can inspect; GM/owner transact. Draft/scouting, staff, picks/swaps and the full CBA are still outstanding.
- The explicitly simplified financial policy uses approximate era caps, 125% outgoing salary plus a scaled allowance or cap room, and minimum free-agent signings over the cap. It does not model modern aprons, complete Bird rights/exception rules or buyout/setoff accounting. Temporary hardship signings cannot be traded/extended, preventing recovery/offseason cleanup from silently deleting negotiated deals.
- **People & relationships** is a new Team screen. Players remember support, challenges, dismissal and promises. Like/respect/trust, morale, fan confidence and owner approval persist. Low trust changes extension demands; morale makes a small, bounded difference to simulation performance while its default leaves the existing seeded game unchanged.
- A minutes promise is judged over the next three actual team games, including DNPs. Coverage reports kept/broken promises. A new arrival gets a three-game assessment using his actual points, minutes and team record. Trading a leader changes remaining teammates' trust. A trade/retirement cancels a pending promise rather than reporting a false betrayal. These are authored, context-driven reactions, not a live AI service.
- Real player headshots remain. Drawn faces and jersey bodies have been replaced with photo-based graphics; missing images use neutral initials. Curry and LeBron archive headshots and two logos are bundled so these examples also work without their CDN. A generated Curry-in-Lakers cutout is retained as an optional alternate-team example; default player identity uses the unmodified real headshot plus the reusable team garment. Generic archive photographs retain their original uniform and get a small archive label. Team/season overrides and generated concept assets are documented in IMAGE_SOURCES.md. The created player keeps a faceless name-and-number card.
- The modern 82-0 stage takes contrast, dark texture and orange primary actions from the NFL Perry references. Historical palettes remain unchanged. The BitLife references inform player-centered meetings, not a copy of its builder or unrelated activities.
- Verification: 39 rule/front-office/world tests passed (12 + 17 + 10), including an observed failing regression before fixing hardship deals. All 34 event assertions, full season/offseason, 400-game sample and historical seasons 2025/1990/1964 completed. The latter scripts report calibration statistics rather than tolerance-based pass/fail; existing era-model approximation limits remain. Browser checks cover visible trades, failed/successful negotiations, mobile width, coach permissions, IndexedDB reload, actual-game promise resolution, rule controls and photographic assets. Screenshots were inspected after replacing the artwork. All 30 current teams now have distinct photographic jersey cutouts with blank number spaces, reused over the original faces; the all-team gallery test verifies every asset decodes and preserves the real headshot layer. Historical uniform variants remain future artwork.

The scenario ledger remains 27 implemented and 4 partial; these foundations do not automatically complete proposed scenario entries. Prioritize media/people consequences in upcoming game plans, draft/scouting and Player Career. Player Career and Live Game remain major unfinished milestones; this is not a finished-game claim.
