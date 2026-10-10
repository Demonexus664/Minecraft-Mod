# Live Game: possession decisions in the shared basketball world

The user's gameplay means simulated decisions, not controller movement. Coaching choices and personal approaches should affect the possession engine, with photos, a focused broadcast stage and real media consequences. Build under the continuing authorization to develop and improve without asking for another approval.

Approaches considered: scripted decision scenes would disconnect results from the actual engine; replaying completed box scores would make choices cosmetic. Use a resumable generator around the existing possession loop. Normal `simGame` drains it with unchanged seeded results. Live mode steps one possession or short chunks and can finish automatically.

Persist team/player/rule snapshots, start seed, completed possession count and a command journal in `L.liveGame`. Reconstruct the generator by deterministic replay after reload. Keep pending results separate from league statistics and salary until final commitment. Reads/replays restore the external RNG; completed game advances the league RNG to its final state exactly once.

First live milestone covers scheduled regular-season games for the user's club. Advancing to tipoff follows other days normally, then freezes the league until this game finishes. Postseason/play-in integration, timeouts/challenges and selected individual play diagrams remain explicit follow-ups; no pretend controls. The same result pipeline updates real standings, box scores, injuries, events, relationships, Career salary and interviews.

Coach/GM/owner can change pace, offensive focus, defensive coverage and rebounding aggression. Career can alter only its player's shot preferences, involvement and effort for this game; no team lineup editing, ratings edits or forced playing time. Substitution control follows later after the first safe engine checkpoint is verified. Defense and rules still resolve in the shared engine.

A live scoreboard shows actual period/clock, score, lineup/fouls/energy, recent play-by-play and actual box score. Real photos remain. Per-possession and short-run buttons, an auto-finish option and save/resume controls keep choices organized. Era palettes, reduced motion and sound controls remain. A final reveal and existing factual media/World hooks provide consequences, not extra rewards.

Reject invalid commands without mutations. Missing fixtures, retired/unsigned Career players, finished games and wrong mode cannot start/control a game. Freeze other sim and roster actions while active. Save/reload cannot reroll or pay twice; final completion is idempotent.
