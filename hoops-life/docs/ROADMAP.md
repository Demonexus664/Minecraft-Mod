# Hoops Life: progress, roadmap and handoff

Last updated: 2026-10-09. Branch: `claude/eager-davinci-buz3b6` (everything below is committed and pushed).
Open `hoops-life/index.html` in a browser; no build step. Real headshots and logos load from the NBA/ESPN CDNs in your browser.

## Where things stand

| Area | State | Notes |
|---|---|---|
| League engine and sim | Strong (~85%) | Every season 1946-47 to 2025-26 with real rosters; possession sim calibrated to real stats (2025-26 PPG r 0.96, FT/FGA .204 vs .206). Era rules, playoff formats, real drafts, aging and retirement. Foul trouble, offensive fouls and charges, last-second heaves and buzzer-beaters were added this session. |
| 82-0 Challenge | Done, game-style | Slot reels, dealt hands of 5 cards, a court with drag and drop where anyone plays anywhere (out-of-position rating cost), 3 bench spots, a live season ticker, daily challenge, share, achievements, any season and era look. |
| Skill Draft Career | Done, game-style | Three reels (team, decade, skill), dealt hands, a build board; your player is a jersey card with no face. Pick any real draft class. Play season by season (stats, award voting ranks, playoff series, FA offers, trades, minors, retire) or sim it all; banners for big moments. The verdict is ranked against every real career. |
| Franchise (MyNBA) | Core playable (~35%) | Any season, any team, sim, playoffs, real drafts, news, a Media Day page, a record book, a few rules. Missing the front-office half (see below). |
| Media | ~50% | Era voices, no-repeat engine, 21,520 ChatGPT pack lines wired, event stories (records, buzzer-beaters, comebacks...), media day and social threads with composed TikTok/YouTube/quote visuals and player responses. |
| Scenario ledger | 27 implemented, 4 partial, 5 blocked, 1,104 not started (of 1,140), plus 9 of mine | See `docs/scenarios/LEDGER.md`. 605 of the scenarios need Player Career. |
| Player Career (MyCareer + BitLife) | Not started | The biggest remaining part. |
| Live Game (make the calls during a game) | Not started | |

## Your requests still in the queue (in order)

1. **Look like NFL Perry.** I could not open nflperry.com (blocked in my sandbox). Send 2-3 screenshots (home, a draft or game screen) and I'll restyle to match.
2. **Rulebook expansion** (task #9). Far more rules, grouped by category, with real names. "Tackling" becomes a realistic name ("Full-contact defense: flagrant fouls not called"). Add real ones: hand-checking, defensive three seconds, illegal defense / zone ban, take-foul penalty, clear-path foul, goaltending and basket interference, backcourt, 8/10-second and 5-second rules, coach's challenge, timeouts, foul-out limit, bonus rules, Elam ending, FIBA lane, 4-point line, shot clock length and reset, quarter length, overtime length, roster size, minutes limits, and more. Each needs a sim effect plus media, player and owner reactions.
3. **More "game" everywhere.** Bring the same feel (reveals, cards, banners) to Franchise: a draft lottery reveal with ping-pong balls, draft-night cards, trade announcement cards, and playoff bracket animations.
4. **Front office** (task #5): trades plus AI value plus Trade Finder, free agency as dialogue, draft and scouting screens, staff, finances, owner, directives, game plans (presets up to "give Steph the ball every play"; the sim already supports `strategy.usageLock`), and talking to players.
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
- Browser tests use Playwright with the preinstalled Chromium; my test scripts lived in a temp folder, so they need recreating in a new session.
- Calibration guardrails: after any sim change, re-run `test-history.js` for 2025, 1990 and 1964, plus `test-sim.js`.

## Recent history (this session)

Skill Draft Career, season by season, then the content packs, scenario batch 1 (event log, record book, buzzer-beaters, comebacks), media day and social threads, the jersey and photo fix, 82-0 in any season, then 82-0 and Skill Draft rebuilt as card games.
