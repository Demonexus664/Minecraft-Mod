# Historical player scouting audit (2026-10-10)

## What changed

The previously interrupted audit was recovered intact: eight files, 569 lines added and four removed compared with commit `69856ac`. A second, manual basketball scouting pass added 47 additional player-and-season notes, covering 46 more previously unscouted players. Total current coverage in `HL.HISTORICAL_SCOUTING`: **439 notes for 403 unique players**.

The historical index contains **5,416 player biographies**. Individual authored coverage is therefore **403/5,416 (7.4%)**, not every player. The archive-derived baseline projection still provides values for other players, but those values should not be described as individually reviewed.

The second pass prioritized formerly unreviewed guards and forwards from the 1940s through 1990s: Joe Fulks, Ed Macauley, Maurice Stokes, Lenny Wilkens, Guy Rodgers, Dave DeBusschere, Jerry Sloan, Earl Monroe, Pete Maravich, Calvin Murphy, James Worthy, Ralph Sampson, Joe Dumars, Mitch Richmond, Vlade Divac, Dražen Petrović and others. Each note records the season-start window, specific skills and a basketball reason. Hall of Fame listings alone do not establish on-court greatness, since some inductions recognize coaching or other contributions.

## Rating interpretation

* **Skill-specific**: no mass attribute lifting, fame multipliers, automatic player-by-player replacements or forced target overalls.
* **Era-aware**: preserve the archived projection of three-point attributes before the NBA adopted the line; do not retroactively project modern outside shooting.
* **Career-aware**: rookie, healthy-prime, injury and veteran phases are separate where relevant. Ralph Sampson's 1983–1985 mobile rim-defense note does not transfer to his 1987 knee-injury-affected season. Joe Dumars's earlier defensive peak is distinct from his later three-point shooting.
* **Role-aware**: 100-tier tools are exceptional. Scoring guards can still have poor interior defense or rebounding; defense-first players do not receive shooting they did not demonstrate.
* **Shared source**: the corrected `HL.historicalAttributes(row)` serves 82-0, Skill Draft, live roster players and related systems. Jumper technique measures release speed and touch independently of release elevation.

All named grades beyond the underlying Basketball-Reference-derived statistics are **editorial scouting judgments**. They are not measured release-speed, arc, footwork or decision-tracking numbers.

## Verification evidence

**Before the second pass**, the interrupted worker's transcript reported a passing broad Node suite and nine unchanged old-input game-simulation hashes. Those results applied to the original eight recovered files; they must not be presented as a post-extension test run.

**After the second pass**, the current GitHub `ratings.js` was executed directly against the real historical index and **14,252 archived NBA player-season rows spanning 1946 through 2002**. This sweep confirmed every new note matches a qualifying season (at least 15 games), no missing/invalid ratings (all attributes integers 25–100), and no pre-three-point-line attributes changed. A separate representative evaluation of 2,149 rows across eight selected seasons also confirmed specialist floors, no 1987 Sampson prime-note leakage and computed OVRs of 59–99. Additional regression tests were added in `tools/test-player-scouting.js`, but the complete Node/Chromium suite **has not been rerun after this second pass** because the original execution environment is unavailable. The archive sweep covered NBA season files, not separate ABA files or post-2002 seasons.

## Remaining audit work

Continue individual review across the remaining **5,013 players**, prioritizing seasons with obviously implausible card grades or historically distinguished specialties. Avoid blindly scoring every archive player from a formula. Use multiple representative seasons per career, compare observed statistical strengths with known scouting evidence, adjust only justified traits, then check rookie/injury/veteran boundaries. Each batch needs season tests, a look at cards in both quick modes, team and career simulation samples, and a new browser regression. Full-archive tests plus game baselines should run before labeling the entire audit complete.
