# Hoops Life: product vision and requirements

Reconciled on 2026-10-09 from the original approved plan, seven uploaded transcript files (two identical), the fuller conversation pasted in chat, and the current handoff. This document records intended behavior. Implementation status belongs in [ROADMAP.md](ROADMAP.md) and the [scenario ledger](scenarios/LEDGER.md).

## What we are building

A personal browser basketball game combining MyNBA franchise depth, MyCareer player development, and a BitLife-style life story. Basketball comes first; football would be a separate game later. The repository's Minecraft-Mod name does not describe the product.

The shared simulation and reactive world are the core: decisions affect basketball outcomes, relationships, opportunities, health, finances and reputation. The player should be able to explore a very broad, organized action space, including surprising choices, and see relevant immediate and delayed responses. Add original scenarios alongside the supplied content.

There is no controller basketball gameplay. Live Game should let a coach or player make detailed decisions during a game, with possessions resolved by the simulation. Quick simulation remains available.

Depth is optional: Simple/Detailed presets and individual automation toggles should let users delegate systems such as training, finances, cap management or relationships, then take control again. Both approaches should support a complete career.

## Corrections that override earlier proposals

- Use real NBA players and teams. The initial fictional-roster proposal was corrected; generated prospects remain useful beyond historical data or in an explicitly generated league.
- MyCareer freedom means actions as your player. It does not grant arbitrary rating edits, forced trades or automatic 99 OVR. Progress, role and opportunities must be earned; the league can respond to a dominant player with rule changes.
- MyNBA is the customizable sandbox, with coach/GM/owner roles and optional consequences for extraordinary interventions.
- The created player does not need a generated face or personal portrait. The created player uses a faceless name-and-number identity card; real players should use real photos.
- Graphics should be composed from reusable pieces reflecting this save's teams and matchups. A traded Curry should appear in his current team's colors. Finished posters for predetermined Finals matchups do not cover this requirement.
- 82-0 permits any player in any position with a meaningful simulation penalty, and includes three bench players. This supersedes the original position-locked draft description.
- Skill Draft supports detailed season-by-season decisions and reports as well as full-auto careers. The original one-button-only proposal is superseded.
- The chosen playing season and allowed drafting eras are separate settings in 82-0; visuals follow the playing season.
- Rename the experimental tackling rule to Full-contact defense. It is a fictional rule option, not an official NBA rule.
- Later requests refine the approved plan. Historical percentages, test numbers, commit/push reports and assistant promises are context, not evidence of the current implementation.

## Shared basketball world and historical timelines

- One league engine underpins both full modes, allowing a retired player to become a coach in the same save.
- Start in any supported era with real teams, including relocated/defunct teams, and historical players entering in their actual draft years. Model player development, peaks, longevity and team histories while allowing user decisions to change the timeline.
- Player Career setup should support inserting a new prospect or replacing a real player in their body/draft slot. Examples include debuting alongside Jordan in 1984 or becoming a LeBron-like star before LeBron arrives.
- Outcomes are simulated: the Bulls can lose, Jordan can finish with fewer titles, and different players can win awards. Historical references must not overwrite alternate outcomes.
- Track real history versus the save's champions, MVPs and major events, plus milestones and a GOAT race. Media, legends' dialogue and rivalries should acknowledge the changed history.
- Era affects pace, shot selection, rules, salary scale, cap, league size, expansion, playoff formats and presentation. Historical default behavior and user overrides both need persistence.
- Calendar scope includes camp, preseason, regular season, NBA Cup where appropriate, All-Star break, deadline, play-in where appropriate, playoffs, lottery, draft, Summer League and free agency.
- Players have body measurements, positions, attributes, potential, tendencies, badges, personalities, morale, contracts, injuries and statistics. Development can include busts, late bloomers and decline.
- Research and validate league averages, player distributions, minutes, efficiency, usage, margins, foul/injury rates, leaders and rare events across eras. Accuracy and tested increments take precedence over shortcuts. Distinguish recalled estimates from sourced measurements.

## Full Franchise / MyNBA

- Setup: coach, GM or owner role; historical start, fantasy draft, custom/imported rosters or generated league; control one or multiple teams. Fantasy draft supports era pools, snake/random order and automation.
- Customization: league size, expansion/contraction/relocation, conferences, schedule, playoffs, Cup, sliders, difficulty, injuries, progression, trade frequency/difficulty and player/team editors.
- Front office: multi-team trades, protected picks and swaps, Trade Finder, incoming offers, competing AI contenders/rebuilders, free agency with interest and negotiations, extensions, options, waivers, buyouts, two-way players and G League.
- CBA: caps, tax/aprons, minimum/max contracts, term limits, rookie scales, Bird rights, exceptions, salary matching, hard cap, stretch provision and cap growth, with simpler automation available.
- Draft/scouting: hidden information, scouting resources, combine, workouts, interviews, big board, interactive lottery, draft-night picks and trades.
- Coaching: rotations, minutes, closers, game plans and playbooks, pace, focus, defensive schemes, doubles, usage priorities, practice and development plans. Player meetings should affect trust, role satisfaction and chemistry.
- Staff/business/RPG: hiring, owner directives, budgets, facility/medical/arena upgrades, prices, attendance, revenue, hype, job security, firing, offers, coaching reputation, awards and HOF.
- Integrity consequences: edits, forced transactions, cap violations and self-serving rule changes can provoke media/fan backlash, ownership complaints, commissioner investigations, vetoes, fines, lost picks, roster sanctions and union/lockout chains. Sandbox mode can disable these consequences.
- Rulebook target: 100+ grouped real and experimental rules, covering scoring/court, clocks, fouls/contact, rosters/minutes/eligibility, schedules/competitions, economy and integrity. Each supported control needs real effects, reactions and save compatibility. Midseason changes should have stronger consequences. Existing rulebook batch is only part of this scope.

## Full Player Career / MyCareer + life simulation

- Builder: body/position freedom with realistic caps and tradeoffs, archetypes and scouting report; curated, custom and badge-led builds. Unusual size should change mobility, stamina, injuries and longevity rather than simply being prohibited.
- Start around prospect-level ability and earn skill progression through performance and training. Badges grow through use/practice; takeover, teammate grade, coach trust, fatigue and role affect the basketball experience. No paid progression shortcut.
- Career paths: high school, college with grades/eligibility/NIL, overseas or development league, combine, draft, NBA, career transitions and post-retirement life.
- Detailed playing-style choices: shot diet, usage, passing, defensive aggression, steal gambling, effort, preparation and other tendencies should measurably affect the sim.
- Basketball decisions: training, minutes/role requests, agent, contracts, free agency, trade requests, endorsements/shoe line, rivalries and press conferences.
- Life: happiness, health, smarts, looks, fitness, karma, fame, reputation and money; parents/siblings/friends/partners, marriage/divorce, children and pets; hobbies, travel, nightlife, possessions, businesses, investments, taxes, charity and bankruptcy.
- Possessions include cars with prices, depreciation, insurance and maintenance, homes by city, jewelry, boats and jets, with item imagery where useful.
- Health: detailed injury regions/severity, surgery/rehab/second opinions, risky returns, lasting damage, mental health, family illness/deaths, and longevity through training, diet, recovery and treatment. PED choices need testing, suspensions and health consequences.
- Risky actions: partying, practice absences, holdouts, public disputes, fighting, gambling, legal trouble, accidents and other user-driven choices, with realistic follow-up effects rather than isolated flavor text.
- Retirement/unretirement, switching paths or sports, and post-career coach/analyst/GM/owner/business roles. Life/legacy can extend beyond retirement to an obituary and HOF record.
- Persistent status effects and delayed events connect choices over time. For example, partying can produce a viral clip, then a hangover affecting a game, then trust or endorsement consequences; later performances can support redemption.
- An accessible chronological Storyline/Timeline screen records basketball and life events, decisions and media responses throughout the save.

## Relationships, dialogue and reputation

- Separate like, respect and trust, with personalities and memories of specific actions. Track mentorships, cliques, rivalries and disputes.
- Chemistry incorporates role/minutes satisfaction, relationships, contracts, leadership and playstyle fit, and influences performance and requests. Show the reasons behind morale.
- Public approval differs among local/national fans, media, players, front offices and sponsors. Reputation should include separate offensive, defensive and clutch identities: an elite scorer can still be a poor defender.
- Interactive scenes with the media, coaches, teammates, front office, agent and family offer several response tones and meaningful outcomes. Follow-up coverage should quote what the user actually said.
- Narrative tags such as ring chaser, loyal icon, journeyman, choker/clutch, stat padder, villain, washed or redemption arise from the save's history and can evolve.

## Media and visual presentation

- Large authored libraries and contextual template/fragment grammar provide variety without needing a runtime AI service. Per-save anti-repeat memory and accurate placeholders remain essential.
- Distinct fictional media voices include debate hosts, analytics writers, insiders, beat writers, former players, fans, trolls, meme creators and odds writers. Formats include headlines, debates, interviews, grades, rankings, documentaries and social threads.
- Coverage should reference actual statistics, decisions, quotes, streaks, rule changes and history. Supplied scenario ideas require triggers, choices, effects, follow-ups and tests; available lines alone do not implement a scenario.
- Media Day includes portraits and composed short-video, thumbnail and quote formats, washed takes, bad clips, corrections, responses, backlash and redemption. Continue expanding the context and consequences beyond the existing batch.
- Era adaptation covers both language and format: old newspaper/radio presentation, monochrome and subtle grain/static for the 60s; period TV/cable, then blogs/forums, then social/video/podcasts. No modern social counters or voices pasted into early eras.
- Aim for a polished sports/broadcast game at desktop and mobile widths, using team colors, deliberate typography and clear hierarchy. Avoid a flat wall of lists, generic card grids or endless unrelated buttons.
- Research relevant games and sports UI; The supplied NFL Perry screenshots guide contrast, textured stages and focused reveals; BitLife guides personal choices and consequence dialogs.
- Use real player photos and team logos where available, with local overrides and reliable fallbacks. Ask for image-generation prompts when pieces cannot be sourced. Compose jerseys, backgrounds, trophies, matchup graphics, trade/award posters and celebration layers from this save's data.
- Make decisions and milestones satisfying through reels, card deals/flips, rarity treatments, lottery reveals, count-ups, live tickers, bursts and banners. Effects should support an enjoyable loop and understandable stakes.

## Quick modes

**82-0:** spin team/decade, limited skips, Classic/HoopIQ, limited dealt hands and difficult decisions, rarity cards, a drag-and-drop court, positional penalties and three backups. Choose the playing season and eligible source eras independently. Simulate against that league, show live results, statistics, losses and verdicts, with daily challenges, sharing, achievements and best runs.

**Skill Draft Career:** spin team/decade/skill, limited dealt hands and skips, assemble 13 categories including body, and show the build board and faceless jersey. Debut in a chosen historical class. Each season should report full stats, awards/voting ranks, team record and each playoff series; offer team/contract/trade and retirement choices. Full-auto retains equivalent tracking. Show peak/career data, real-player comparisons, legacy rankings, memorable reveals and a shareable result. GOAT should be rare and earned; poor builds can fail or leave the NBA.

## Development and continuity

Keep the prior queued order in ROADMAP.md; this context import does not authorize a new priority order. Preserve playable modes and saves while building one coherent, researched system at a time. Persist decisions and unfinished work so another session can continue.

Verify relevant game flows in a browser and meaningful simulation effects headlessly. Maintain era calibration checks, save/reload coverage, scenario near-miss checks and balance measurements. The original full-vision targets included long season/career runs, rare GOAT outcomes, media diversity, integrity escalation and complete Simple/Detailed careers; those are goals to validate as their systems exist, not claims that they currently pass.

Current limits: the first NBA Player Career is playable, while pre-NBA life, wider Career systems and the full Live Game scope remain unfinished; regular-season possession decisions are now playable, Franchise front-office depth remains incomplete, and most proposed scenarios still need systems. See the roadmap and ledger for exact progress rather than inferring completion from the transcript.


## Latest user reference corrections (2026-10-10)

Media, people and the world responding are major product pillars, not an optional layer after basketball systems. Keep relationship memory, situational answers and delayed consequences in each new feature. The NFL Perry screenshots guide bold contrast, texture and focused sim stages. The BitLife screenshots guide person-focused actions, relationship visibility and meaningful consequence dialogs; they do not reduce the detailed basketball builder or prescribe the depicted activities.

Real headshots must stay visible. Replace drawn player bodies/uniform overlays with photographic assets; generated alternate-team cutouts are also acceptable. Prefer reusable photographic jerseys in each team’s own colors and style, with numbers removed and added separately, so any player can wear them and jersey-number changes do not require regenerating the photograph. Preserve a real headshot fallback when a team-specific photograph or uniform template is unavailable.

## Ongoing steering: immersive what-ifs and media context

The user reaffirmed broad freedom, a world that remembers changes, realistic player posting and greater alternate-history depth in Franchise and Career. Prioritize organized actions with actual consequences and consistent timeline ownership. Add full interview statements, misleading excerpts and visible original context, then responses/corrections and delayed public judgments. Real photos may support fictional in-save scenes; generated quotes/posts must not masquerade as statements made by the real person outside the game. Modern screens should feel less square/flat: rounded personal choices combined with layered sports stages and satisfying reveals, retaining era adaptation.
