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
