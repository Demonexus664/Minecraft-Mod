# Media overhaul implementation plan
Spec: ../specs/2026-10-10-media-overhaul-design.md
Execution: inline; user requested continuous autonomous development.

- [x] RED: meaningful domain regressions for freedom, sources, private visibility, remembered personal responses and actual outcome checks.
- [x] GREEN: extend PlayerPosts, add context-aware PublicVoices, preserve actual-game/lifecycle hooks and legacy saves.
- [x] Replace the rigid composer with grouped intents, own words, named subjects, outlets, source excerpts and continuous conversation. Preserve real portraits and historical presentation.
- [x] Browser verification and visual inspection, full related suite, one fresh-context final review and reproductions for Important findings.
- [x] Record actual implemented limits, update roadmap and push authorized GitHub branch.

Review focus: quote/source authenticity, arbitrary-text factual invention, privacy leakage, invalid-input atomicity, legacy post.reply compatibility, unlimited actions versus capped rewards, real fixture promise attribution and no simulation RNG drift.

Ruling: existing continuous-development authorization controls; no new approval loop. This replaces the rejected media design rather than completing the full product vision.

Ruling from user feedback: inspect the adjoining spoken systems as well, because leaving the old three-tone interview verbatim would retain the repetition the user rejected. Add typed Franchise/Career press answers, varied actual-postgame phrasing and stop duplicating every reply as a new news story. Costs if wrong: broader verification across the existing interview and Career flows.

Final review: no Critical; four Important reproductions: custom answers mislabeled as leaving; untracked confident Franchise 20-point claim; interview reactions consumed simulator RNG; friendly continuations turned argumentative. Two findings were labelled Minor, but original speaker identity drifting after rename and Career self-dialogue are regraded Important because they undermine the requested evidence fidelity and believable people. All six enter one reproduction/fix pass. Their failure cases are now in test-media-freedom.js; no extra review loop.

Final evidence: 121 domain tests pass, 34 event assertions pass, free-media and updated interview browser scenarios pass. All six reviewer reproductions received failing tests before fixes; 32 focused media/interview tests and the whole related suite pass. Screenshots inspected. Broader freedom, negotiations, family/life, integrity and sandbox editing remain explicitly listed in BUILD_VS_REQUEST.md rather than claimed complete.
