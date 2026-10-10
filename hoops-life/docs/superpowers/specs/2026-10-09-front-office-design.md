# Playable Franchise front office

The user asked to keep developing toward the full game, using the reconciled product vision, without another planning pause. This milestone replaces the existing Trades, Free Agency and Finances placeholders with working roster decisions. It does not claim the full CBA, scouting, staff or Player Career are complete.

## Behavior

GM and owner can manage their own team; coach can inspect but roster moves remain delegated. Trades exchange one to three players per side, validate live ownership, roster size/healthy bodies, phase/deadline and a stated simplified salary policy, then use deterministic AI valuation based on ability, age, potential, positional need and contract cost. Preview and Trade Finder never mutate the save or consume simulation randomness. The AI explains rejection or acceptance; repeatedly pressing submit cannot reroll the decision. Accepted moves change the actual simulation roster and reset affected rotation selections, leaving historical statistics intact.

The free-agent market shows active unsigned players, expected salary, fit/role and willingness. Negotiations compare annual salary and one-to-four-year terms against a deterministic asking price. Team success and opportunity influence the ask. Minimum deals remain possible over the cap, with no claim to full NBA exception rules. Extensions add years after the existing deal and record next-contract terms; waivers keep guaranteed money on the payroll until the existing contract expires. Signing during the offseason starts next season; signing during the regular season includes that season.

Finances exposes current payroll, dead money, committed future salaries and the simplified cap policy. For historical seasons cap estimates are explicitly approximate; pre-1984 has no cap. Every decision validates again at commit time. Invalid/stale offers leave all state unchanged. Accepted moves create durable transaction facts, era-aware media, and a visual announcement in the player's new colors. Trades and negotiations have organized two-sided/card views and confirmations rather than a large unstructured action list.

## Integration

`js/league/frontoffice.js` owns policy, quotes, validation, decisions, financial commitments and transaction news. It operates on the current league object using a public `HL.FrontOffice` API. `js/coach/frontoffice.js` owns screen rendering and bindings, called by the existing Franchise hub with an autosave/render callback. Load both in index.html in dependency order.

Season rollover applies negotiated extensions before automatic free agency, preserves user deals that still run next season, accounts for waived obligations without double-charging expired years, and makes room for signed players rather than silently cutting them in automatic roster trimming. New state consists of JSON-compatible transaction entries, dead-cap obligations, pending extensions and an explicit user roster protection flag; old saves need no destructive migration.

## Proof

Headless tests cover accepted and rejected exchanges, salary restrictions, a zero-valued team ID, permissions, duplicate/stale assets, deadline, healthy roster minimum, negotiation thresholds, invalid money/terms, roster limits, extensions/waiver money through rollover, real-history continuity, no preview RNG changes, media facts and JSON reload. Browser checks exercise actual visible screens, a trade, a failed and accepted signing, confirmation, payroll, save/reload, coach inspection and mobile layout. Existing rule/event tests and a full season/offseason run guard integration.


## Reactive people and visual direction (user steering)

Media, people and a responsive world are core requirements. This milestone also adds a persistent relationship record (like, respect, trust and memories), fan/owner confidence and a story timeline. Own-roster meetings offer support, effort challenges, a concrete playing-time promise, or dismissal; personality affects the answer, trust affects future asking prices, and morale gently affects actual possession performance. A minutes promise is assessed against the next three actual team games, including DNPs. New arrivals receive a three-game performance follow-up based on actual minutes, points and team results. Leaving the team or retirement cancels a pending promise rather than inventing a betrayal.

User screenshots of NFL Perry and BitLife are references for contrast, focused game stages, organized person-centered actions and consequence dialogs; they are not instructions to copy screens or their unrelated example activities. Historical palettes remain active. Player imagery retains real NBA headshots, uses photographed or generated alternate-team cutouts when available, and avoids illustrated faces or jersey bodies. The first bundled concept depicts Curry with the Lakers; it is a fictional image for the save, not historical evidence. Each current NBA team gets its own photographic jersey cutout, with its team colors/wordmark and a blank number space. Numbers are assigned separately at runtime, without baking a player or number into every image.

The world module is groundwork for Player Career's much larger action space, not a claim that family, money, legal, health and other life systems are implemented. The transaction policy excludes temporary hardship contracts from trades/extensions so automatic recovery cleanup cannot erase a negotiated deal.
