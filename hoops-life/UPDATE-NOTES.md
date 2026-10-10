# HoopsLife: Legacy Expansion (October 2026)

## What's in this update

**Skill Draft:** 23 independent picks, including body, specific basketball tools, shot mechanics, separate tendencies, career longevity and duration of prime. Choose PG / SG / SF / PF / C after drafting. Specialty honors require career production. GOAT verdict requires elite legacy rank plus longevity, championships and MVPs. The end screen has a narrative career dossier, turning points and evidence. The full statistics are still available behind an expandable section.

**82-0:** Choose among six game plans that alter possession-level strategy. The season-film report evaluates actual team performance, style identities, clutch results, scoring nights, era comparisons and injuries. Injuries now persist across games.

**Shared simulation:** 44 player ratings including modeled speed, burst, strength, jump shot mechanics, defensive details and passing subtleties; separate tendency profiles; era rules and alternate-history career decisions. Advanced attributes are scouting *estimates* when no historical tracking data exists.

**Ratings hotfix:** Shot frequency and shooting IQ now have independent scores; LeBron's 2017-18 shot decision estimate is 94 rather than the meaningless ~54 tendency average. The shot-preference card ranks by decision quality while retaining actual preferences. Release elevation is measured relative to a player's frame and shooting skill, instead of letting short guards automatically grade in the 40s. Accurate grades remain weak where appropriate; this is not a universal rating boost. Historical grades are scouting estimates based on available records.

**Technical:** Corrected catch-and-shoot tendency timing; manual testing tools and new report regression tests.

## Run

Open `hoops-life/index.html` from a local static web server; for example, from the folder containing `hoops-life` run `python -m http.server 8000` and open http://localhost:8000/hoops-life/.

## Tests

Run from `hoops-life`: `node --test tools/test-draft-hands.js tools/test-legacy-overhaul.js tools/test-ratings-recalibration.js`

The long-form career and full-season simulations have not passed a complete browser end-to-end regression in this environment, so retain the previous build as a backup.

## Fonts

Font binaries are excluded from this redistribution. Your existing game folder can retain its own installed font files; otherwise the browser uses fallbacks.

## Open-ended careers (October 10, 2026)

**Skill Draft** no longer forces retirement at a set age or because the player falls outside NBA-level rotation talent. Manual retirement is available at any age. NBA contracts remain conditional on ratings and opportunities. Players with 99 longevity, prime duration, and stamina can remain in their prime deep into their 50s, then gradually decline. A season without an offer is an active out-of-league year, not an automatic end. Auto-play advances **ten seasons per click** so exceptional 45+ season careers can be continued without an unbounded browser simulation. A complete Verdict is available when the user chooses retirement.

**Player Career** removes the age-45 ban on contracts and comebacks, retaining role/roster competition. These are deliberately fictional extreme longevity options, not claims about realistic human careers.

## Legendary 100-tier rating & natural-position fit (October 10, 2026)

- Normal attributes and overall remain capped at 99. A curated, evidence-gated 100 specialty is possible for a small number of historic peaks (e.g., 2015 and 2020 Curry three-point shooting, peak Jordan fadeaway, peak Shaq finishing), without boosting unrelated weaknesses.
- 82-0 natural-position assignment grants +1 OVR. A historically exceptional 99-rated season can reach 100 on a natural position; other 99-rated seasons remain at 99. A legitimate five-position player may qualify across all five positions based on passing, ball control, mobility, defensive size, strength, and IQ.
- The simulation's nonlinear elite-response curve recognizes 100 as an exceptionally strong tool. Skill Draft preserves inherited 100 ratings through prime progression; rare fictional opponents cannot accidentally downgrade a 100 specialty when boosted.
- Historical all-time status is an estimated game-design judgment, **not** an official NBA or 2K rating. The full long-career browser regression is still pending.