# Gameplay depth implementation
Spec: ../specs/2026-10-10-gameplay-depth.md
Base: f21013f

1. Write failing domain tests for eligible free lineups, emergency replacements, bounded timeouts, actual named play and matchup effects, own-player authority, huddle words/nonstacking, replay/RNG neutrality and outcome-based media. Expected: missing tactical API and snapshots fail.
2. Implement simulator commands and validated persistent LiveGame actions. Keep unattended result hashes unchanged. Expected: new and prior LiveGame tests pass.
3. Build grouped coaching/player controls, roster substitutions, named play sheet, matchups, timeouts, typed huddle and decision receipts; verify in browser on desktop/mobile and through IndexedDB resume. Expected: each chosen action produces its actual saved/game result.
4. Implement grounded final coverage and World memories; update roadmap and request comparison. Run relevant domain suites, event checks, browser checks and baseline hashes.
5. One fresh read-only review of this milestone; reproduce Important findings and fix in one pass, rerun relevant suite, commit and push authorized branch.

Review focus: interrupted replay after multiple same-checkpoint actions; team ID zero; late-quarter timeout limits, foul-out replacement while manual; Career bench calls and role bypass; pending plays whose participants leave; snapshot/result compatibility; article claims match box scores and performance; arbitrary manual lineups preserve all player stats and do not guarantee makes.

## Execution evidence

Completed 2026-10-10. 142/142 domain tests, 34/34 event assertions, new and legacy Live Game browser flows passed; original nine era result/RNG hashes preserved. Desktop team-talk and mobile bench/player screenshots inspected.

One fresh read-only review: no Critical findings. Two Important findings fixed with failing reproductions: fractional appearances dropping from boxes and a fabricated bench contribution quote. Incorrect pregame starter credits were regraded from Minor to Important because they also gave unused players a false game appearance; fixed with a failing reproduction. Visual inspection identified duplicate team-talk replies; distinct speakers and preceding-talk context were verified RED→GREEN in the same fix pass. No review findings deferred.
