# Hoops Life: implement the events behind the media

## Goal

Expand the existing browser game into a basketball life and franchise simulator with broad player freedom and believable consequences. Support Player Career and the Franchise Hub: the quick undefeated-season challenge, fantasy drafts from any combination of eras, and detailed Coach/GM/Owner play. Simple mode should remain easy to navigate; Detailed mode should expose the underlying decisions. Becoming the greatest should require a strong career, rather than being the automatic result of aging up.

This package contains written media and a proposed feature backlog. These files do not prove that an event is already simulated. Inspect the actual repository and identify what exists before changing it. Keep existing saves working.

## Use the files

- `media-pack-1.js`: modern content for every key in the supplied situation catalog, plus fragment pools.
- `media-pack-2.js`: historical replacements for games, injuries, awards, series, championships, and season transitions.
- `media-pack-3.js`: additional modern life, reputation, press-conference, league-office, and coaching content, plus other historical replacements where appropriate.
- `ideas-1.md`: a large proposed scenario backlog, grouped by domain, with explicit triggers, required placeholders, and three media examples per event.
- `scenarios-1.json`: the same proposed events in a machine-readable registry. These proposed keys extend the original catalog.
- `media-pack-4.js`: the proposed events' three example templates in the same registration format. Connect a key only after its feature and placeholder contract exist.
- `media-pack-5.js`: expanded modern media-day and social-feed responses for the corresponding proposed events.

The `state`, `consequences`, `modes`, and `availability` fields, when present, are design requirements rather than executable expressions. Never evaluate trigger descriptions as code. Map them to explicit handlers and conditions.

Mode tags identify the main decision context. Eligible NPCs can still generate world events and public stories in other modes. Keep control rights separate: an owner can react to a player's personal event without automatically choosing every private action for that player.

## Required implementation behavior

Do not merely add these lines to the random media pool. Implement the choices, state changes, and event checks that make the scenarios possible. Do not mark a scenario complete because its headline can be displayed.

For every proposed event:

1. Find the system it belongs to and check whether its trigger is already supported. Identify any shared dependencies.
2. Add the required player, coach, GM, owner, or league action. Some events are outcomes or world events and need no action button.
3. Store the authoritative facts, not just a narrative label. Record the event ID, simulation date, participants, source, visibility, era, and relevant numeric results.
4. Apply immediate and delayed consequences to basketball, health, finances, relationships, availability, reputation, team chemistry, and league integrity as appropriate. Include favorable and neutral outcomes when the event permits them.
5. Emit the matching event only when its complete trigger is true. Fill every required placeholder from that event or the save. Skip templates requiring unavailable facts; do not fabricate values to make a line render.
6. Persist the feature and delayed consequences through save/load. Distinguish private facts from what media personas can know.
7. Verify at least the trigger, a nearby non-trigger, the important consequences, and persistence for the feature or its shared subsystem.

Work in coherent batches with shared systems rather than hardcoding a thousand unrelated random popups. Maintain a completion ledger with `implemented`, `partially implemented`, `blocked`, and `not started`, plus the concrete handler, required data, and verification evidence. A blocking dependency should become an implementation task, not a reason to silently discard the scenario. Report honest progress.

## Player Career

Preserve the distinction between current ability and future potential. Body, skill, preparation, fatigue, health, age, and opportunity affect outcomes. Let the player attempt unusual builds and strategies; determine feasibility and results from the chosen realism settings. An unusual choice can succeed, fail, or have mixed consequences. Fame alone does not guarantee basketball skill.

Cover basketball development and decisions alongside relationships, family responsibilities, education, employment, money, fame, health, legal disputes, public behavior, and retirement. Activities can cause delayed effects: missed sleep can affect tomorrow, an investment can mature later, a relationship can change over time, and a legal case can progress through several distinct stages. Simple mode should summarize and automate routine choices while retaining major decisions and consequences.

## Franchise, Coach, GM, and Owner

Connect outcomes to rosters, coaching, rotations, scouting, transactions, contract rules, staffing, facilities, ownership budgets, fan demand, arena logistics, and league governance. Preserve differences in authority: a coach does not automatically control owner-only decisions.

Support historical, generated, mixed-era, fantasy-draft, and custom leagues. Track how rule changes actually change the simulation before reporting their results. A four-point line should create four-point attempts and makes; a schedule change should alter qualification and record context. Adjust record comparisons for season length and rule set, and preserve the original achievement in history.

## Freedom, cheating, and integrity

Allow the configured editing and sandbox actions. In a consequence-enabled league, unusual roster changes, forced trades, cap violations, and rules favoring one team can raise suspicion. Suspicion is not proof.

Model distinct escalation stages: media scrutiny, verified fan action, complaints from owners, league review, findings, sanctions if supported by those findings, union response, negotiation, and work stoppages when the corresponding conditions are met. Potential sanctions include trade vetoes, fines, lost picks, or required roster changes. Do not automatically trigger every sanction from one edited rating.

Sandbox mode should disable the configured integrity penalties without erasing ordinary basketball, family, financial, or health consequences unless the relevant settings also disable them. Save each toggle explicitly. Provide a clear configuration for fully unrestricted play.

## Legal cases and serious life events

Use explicit procedural states. A rumor is not a complaint; a complaint is not an arrest; an arrest is not a filed charge; a charge is not a conviction. Distinguish investigations, court appearances, dropped charges, acquittals, findings of liability, convictions, sentencing, appeals, reversals, settlements, and completion of an obligation. Team and league decisions are separate from court outcomes.

Use the save's fictional jurisdiction, era, and configured legal rules. Do not pretend that every offense carries the same sentence everywhere. Model possible effects on availability, travel, contracts, finances, relationships, and reputation only when the corresponding fact or rule establishes them. Respect sealed, private, or confidential information when deciding whether to emit public media.

Health, bereavement, caregiving, and mental-health coverage should use suitable voices. Prevent a meme or rival troll response from being automatically attached to a family death or a private medical disclosure. Give the player recovery and support paths, not just punishment chains.

## Rare emergencies that interrupt simulation

Allow extremely rare, consequential emergencies, including a team aircraft accident. Resolve the actual passenger list and recorded outcome: a diversion, missing aircraft, survivable crash, serious injuries, confirmed fatalities, or—in an exceptionally rare outcome—the deaths of every member of the travelling roster. Players who were not aboard remain alive. Missing people are not automatically reported dead.

When a critical incident occurs during a multi-day sim, stop the advance at the incident time and present an emergency bulletin plus the available decisions. Do not quietly finish the season and display the event afterward. Persist the incident, pending decisions, participant statuses, and remaining simulation target. Let the player resume after resolving the interruption.

Separate operational response, investigation, family notifications, public reporting, postponements, memorials, emergency roster provisions, contracts/estates, league assistance, and rebuilding. Use restrained, non-graphic reporting for fatalities. A complete travelling-roster loss should change the franchise and world; it cannot be just a headline followed by the same starting lineup.

Keep the default catastrophe frequency extremely low. Use exposure-based risk and one shared disaster budget, followed by conditional severity/outcome selection. Adding more scenario templates must not multiply the chance of a catastrophe. Provide off/default/custom intensity settings and save them. Deterministic saved randomness should prevent accidental rerolls or duplicate incidents on load. Verify frequency over many simulated seasons and trips, and use explicit test fixtures to exercise severe branches without increasing ordinary-play probability.

## Composable graphics from the current save

The user wants images assembled from pieces at runtime. A traded player must appear in his current team's colors and number. Compose player cards and news graphics from a portrait/head layer, a tintable jersey or SVG torso, current team identity, optional approved props, and typography. Use historical styling when the save's era calls for it. Provide a dependable offline fallback when a portrait or logo is unavailable.

Finals posters, series cards, trade announcements, awards, draft cards, celebrations, and challenge results must derive their participants and facts from the event and current save. Do not select a pre-made poster that happens to resemble the matchup. Use the actual bracket, rosters, team branding, player identifiers, year, and declared era model. Preserve identity links through a name change, a team rebrand, historical player imports, or permitted duplicate-player experiments.

Keep private, sealed, or medically sensitive facts out of visual layers as well as text. Use restrained bulletin and memorial treatments for serious emergencies, rather than ordinary celebratory confetti. Missing assets should change the rendering fallback, not the simulation outcome.

Current player cards follow current team identity. News archives preserve event-time snapshots of team colors, appearance, participants, and results, so a later trade can update today's card while keeping the older story accurate.

## Adapt the existing engine to configurable worlds

The pasted conversation describes an existing season engine and historical-stat calibration. Inspect that implementation; this package does not verify the numerical results reported in the conversation. Reuse working systems and measure new behavior against the appropriate data and save rules.

Check fixed assumptions when extending the engine: a fourteen-team lottery pool, an eighty-two-game schedule, a thirty-team league, twelve-minute periods, specific retirement ages, fixed playoff rounds, and a single cap structure cannot silently govern every custom universe. Derive eligible lottery teams, odds, rounds, rotation minutes, calendars, aging, retirement, and transaction constraints from the configured competition. Keep player choice and actual performance relevant to longevity while honoring the realism and sandbox settings.

Historical profiles should govern pace, shot selection, efficiency, turnovers, rebounding, free throws, and workload according to the selected model. Separate original real-world data from simulation ratings and era-adjusted comparisons. Mixed-era experiments should disclose their normalization model in the relevant setup and analysis; ordinary headlines should focus on the resulting basketball story.

## Media quality and repetition

### Media day, social slander, and follow-up stories

Media day is an actual event with portraits, poses, jersey reveals, hairstyle or outfit choices, current team identity, interviews, and observable interactions. Store the event's photo composition and clip context. Compose the picture from the player's current saved appearance, portrait layers, jersey, team colors, number, pose, backdrop, and permitted accessories. The graphic and its caption should describe the same save state.

Support a range of fictional accounts and formats: short-form-video captions, skeptical rival edits, optimistic team fans, creator commentary, analyst pushback, quote cards, comment threads, and debate segments. Platforms exist only in the appropriate era or configured alternate history. A meme can spread through a bad still frame or an awkward pose without a real ability decline.

For example, a media-day photo can generate a creator's “looks washed” opinion, a rival pile-on, a homer defense, and later reactions to actual games. Do not turn one image into a confirmed injury, a medical finding, or a hidden ratings change. Record whether a clip is complete, selectively edited, misdated, manipulated, or falsely attributed. Corrections need their own events and should not retroactively erase that a rumor circulated.

Separate popularity, audience sentiment, reach, credibility, player confidence, relationships, and basketball ability. Model outcomes from context and player response, rather than making every criticism lower skill or every viral post improve it. The player can ignore, joke, reply, clarify, ask for a correction, adopt a meme, or demonstrate a response through actual basketball. Consequences can be favorable, neutral, mixed, or negative.

Persist story threads, original evidence, source type, timestamps, replies, reach, and subsequent corrections or reversals. Keep a measured cooldown so every season's media day does not produce the same slander cycle. Private information remains private in captions, image layers, and replies.

Keep persona, tone, format, and event separate. Headlines describe facts; fan reactions can express opinions; insiders attribute verified reporting. Do not turn an opinion into an authoritative fact. Support short posts, longer analysis, call-in reactions, press quotes, local beat coverage, and fictional debate exchanges without impersonating real media personalities.

Use the era-specific key before the modern fallback. Historical text must match the period's technology and reporting styles. Some award categories, salary mechanisms, social platforms, and league structures may not exist in a historical save; feature availability comes from that save's rules. Alternate-history settings can deliberately enable them.

The proposed-event pack supplies three starter lines per new situation. When a new feature becomes a frequent source of stories, expand its pool to at least forty distinct base templates, and eighty or more for heavily repeated topics. Preserve the event's exact placeholder contract and media voice. The media-day extension already supplies forty extra responses for each of its twenty situations.

Render names, quotes, and other filled values as text. Format money, percentages, possessives, and singular quantities consistently with the event contract. The source files contain ordinary strings, not executable trigger logic or HTML instructions.

Combine template cooldowns, rendered-output cooldowns, fragment cooldowns, and topic/voice weighting. Do not describe this finite collection as a guarantee of zero repetition. Allow quiet periods rather than inventing an event just to fill the feed. Reactions to a reused topic should be driven by new facts or a deliberate follow-up format.

## Done means playable

Implement the features in the existing app, wire their actions into the UI, connect media to verified events, and test the important consequences. Maintain the Simple/Detailed distinction. Finish a playable batch before moving on, and keep a ledger of remaining scenarios so the breadth of this package becomes an implementation roadmap rather than an ignored text file.
