# Hoops Life: expanded scenario and feature backlog

These are proposed features and events for Player Career and MyNBA-style franchise play. They extend the original 152 situation keys. Existing media packs do not implement their mechanics. Claude should use `CLAUDE_HANDOFF.md` and the machine-readable `scenarios-1.json` to add actions, state, consequences, save support, and verified triggers before connecting the matching templates in `media-pack-4.js`.

## Event rules

- Emit only from recorded facts that satisfy the complete trigger. Do not infer a court outcome from an arrest, a record from a big game, or an injury from a risky activity alone.
- Separate personal, team, league, legal, and financial outcomes. A rumor can affect reputation while its truth remains unresolved; an acquittal does not automatically reverse a separately justified league action.
- Gate by era, jurisdiction, league rules, competition, realism settings, and mode. A nonexistent award or platform needs an explicit alternate-history setting. Custom periods and schedules override standard league assumptions.
- Some triggers describe future results. Simulate their inputs and persist pending consequences; do not choose a favorable headline first and manufacture the event backward.
- Public media needs public knowledge. Keep confidential, sealed, undisclosed, or private facts out of the feed until an explicit disclosure event occurs.
- Use supportive coverage for health, bereavement, and caregiving. Match persona and tone to the actual event.
- Include ordinary, successful, failed, neutral, rare, and sandbox outcomes. The player can make a choice without automatically succeeding or being punished.
- Track cooldowns for templates, rendered text, voices, fragments, and event chains. The collection is finite, so anti-repeat behavior remains an engine responsibility.


**1,140 proposed situations across 98 categories; 3,420 starter media lines.**

## 1. 1. Possessions, shots, and clock mechanics

### `court.buzzer_review_reversal`

**Trigger:** Replay confirms the apparent game-winning shot left the shooter's hand after the final horn; result is officially reversed.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- Replay wipes out {player}'s apparent winner for {team}.
- The ball is still in {player}'s hand at the horn. The celebration ends at the monitor.
- {team} lose the shot to the clock, not the rim.

### `court.four_point_play`

**Trigger:** A made three, shooting foul, and made free throw produce an official four-point play.

**Placeholders:** `{player}`, `{opp}`

**Media examples:**

- {player} converts a four-point play against {opp}.
- One shot, one whistle, four points for {player}.
- {opp} surrender the basket and the extra free throw.

### `court.intentional_free_throw_miss`

**Trigger:** Player intentionally misses a free throw, legally hits the rim, and his team secures the rebound.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player}'s deliberate miss gives {team} another possession.
- {team} win the rebound after {player} targets the rim.
- The miss is the plan; possession is the prize for {team}.

### `court.foul_up_three_backfire`

**Trigger:** A documented intentional foul while leading by three leads to a completed opponent scoring sequence that flips the lead.

**Placeholders:** `{team}`, `{opp}`

**Media examples:**

- {team}'s foul-up-three plan hands {opp} the lead.
- {opp} turn the intentional whistle into an advantage.
- {team} try to remove the tying three from the equation. {opp} find another way to take the lead.

### `court.shot_clock_buzzer_make`

**Trigger:** Valid basket is released with at most 0.2 seconds on the shot clock and officially counts.

**Placeholders:** `{player}`, `{team}`, `{opp}`

**Media examples:**

- {player} beats the shot clock for {team}.
- {opp} defend almost the entire possession; {player} finishes the rest.
- The clock nearly wins. {player} gets there first.

### `court.self_rebound_putback`

**Trigger:** Player legally rebounds his own missed field goal and scores on the immediate putback.

**Placeholders:** `{player}`, `{opp}`

**Media examples:**

- {player} cleans up his own miss against {opp}.
- The first attempt misses; {player}'s second effort lands.
- {opp} stop the shot but surrender the follow-up.

### `court.own_basket`

**Trigger:** Officials credit an accidental basket in the wrong hoop to the opposing team.

**Placeholders:** `{team}`, `{opp}`

**Media examples:**

- {team} gift {opp} an accidental basket.
- Wrong hoop, real points: {opp} benefit from {team}'s mistake.
- {opp} get points from the most reluctant scorer on the floor.

### `court.backcourt_violation_decider`

**Trigger:** A confirmed backcourt violation ends the trailing team's final possession within one score.

**Placeholders:** `{team}`, `{opp}`

**Media examples:**

- {team}'s final chance ends with a backcourt whistle.
- {opp} get the stop without another shot being taken.
- The final chance crosses halfway and goes no farther for {team}.

### `court.heave_team_record`

**Trigger:** A counted basket exceeds the team's recorded longest made shot; measurement is confirmed.

**Placeholders:** `{player}`, `{team}`, `{distance}`

**Media examples:**

- {player} sets {team}'s distance mark with a {distance} basket.
- The measurement is official: {distance} for {player}.
- {team}'s longest-shot record now belongs to {player}.

### `court.live_ball_timeout_denied`

**Trigger:** Player requests a timeout without possession or without a legal entitlement; play continues and opponent scores.

**Placeholders:** `{player}`, `{opp}`

**Media examples:**

- {player}'s timeout request cannot stop {opp}'s score.
- {opp} keep playing while {player} looks toward the officials.
- {player} asks for a pause; {opp} supply another basket.

## 2. 2. Defensive feats and breakdowns

### `court.charge_triple`

**Trigger:** Player draws three officially recorded offensive-charge fouls in one game.

**Placeholders:** `{player}`, `{team}`, `{opp}`

**Media examples:**

- {player} draws three charges for {team}.
- {opp} meet the same stationary obstacle three times.
- {player} changes three possessions without blocking a shot.

### `court.verticality_clean_stop`

**Trigger:** Replay confirms a contested rim stop with legal verticality, no foul, and a defensive rebound.

**Placeholders:** `{player}`, `{opp}`, `{team}`

**Media examples:**

- {player} wins the rim contest cleanly against {opp}.
- Arms straight up, possession secured: {team} finish the stop.
- The replay backs {player}'s defense at the basket.

### `court.block_recovered_by_shooter`

**Trigger:** Player blocks a shot, but the original shooter recovers it and scores on the same possession.

**Placeholders:** `{opp}`, `{player}`, `{team}`

**Media examples:**

- {opp} score after recovering {player}'s block.
- Nice block from {player}. Unfortunately for {team}, the possession is still alive.
- The block makes the highlight. The second shot makes {opp}'s scorebook.

### `court.full_court_press_turnovers`

**Trigger:** A declared full-court press causes at least three consecutive opponent turnovers, tracked by possession.

**Placeholders:** `{team}`, `{opp}`

**Media examples:**

- {team}'s press forces three straight {opp} turnovers.
- {opp} cannot get through the first wave of pressure.
- Three possessions disappear before {opp} can settle into offense.

### `court.zone_corner_exposure`

**Trigger:** Opponent makes at least four corner threes against a tracked zone defense in a quarter.

**Placeholders:** `{opp}`, `{team}`

**Media examples:**

- {opp} punish {team}'s zone from the corners.
- The zone protects the middle while {opp} collect corner threes.
- {opp} keep finding the corners of {team}'s comfort zone.

### `court.defensive_three_seconds_spree`

**Trigger:** Player receives two defensive three-second violations in one game under applicable rules.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player} is whistled twice for defensive three seconds.
- {team} pay twice for {player}'s extended stay in the lane.
- {player} spends too long in the paint twice. The officials charge rent.

### `court.switch_miscommunication`

**Trigger:** Two defenders explicitly switch onto the same attacker, leaving another open for a made basket.

**Placeholders:** `{team}`, `{opp}`

**Media examples:**

- {team}'s crossed switch leaves {opp} an open basket.
- Two defenders choose one assignment; {opp} find the abandoned one.
- The coverage call and the coverage itself part ways for {team}.

### `court.no_field_goals_quarter`

**Trigger:** Team completes a quarter without allowing an opponent field goal; free throws may occur.

**Placeholders:** `{team}`, `{opp}`

**Media examples:**

- {team} hold {opp} without a field goal for a quarter.
- Every {opp} shot from the floor stays out in that period.
- An entire quarter, and {opp} cannot buy a make from the floor.

### `court.steal_without_dribble`

**Trigger:** Player intercepts the inbound pass and scores before the opponent records a touch in live play.

**Placeholders:** `{player}`, `{opp}`, `{team}`

**Media examples:**

- {player} steals the inbound and scores against {opp}.
- {opp}'s possession barely begins before {player} ends it.
- One intercepted pass puts {team} straight back on the board.

### `court.rebound_after_five_tips`

**Trigger:** An officially tracked rebound follows at least five contested tip contacts, then the team retains possession.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player} secures the rebound after five contested tips.
- The ball refuses to land until {player} claims it for {team}.
- The rebound needs five tips and one stubborn finish from {player}.

## 3. 3. Wild tactics with measured results

### `strategy.five_out_zero_paint`

**Trigger:** A declared five-out lineup completes a quarter with no paint touches and a recorded scoring total.

**Placeholders:** `{team}`, `{pts}`

**Media examples:**

- {team} score {pts} in a quarter without a paint touch.
- The paint might as well be wet: {team} never touch it while scoring {pts}.
- {team}'s perimeter-only quarter ends at {pts}.

### `strategy.two_big_guards_press`

**Trigger:** Two players classified by the sim as the lineup's tallest take the guard assignments in a declared experiment.

**Placeholders:** `{coach}`, `{team}`

**Media examples:**

- {coach} assigns {team}'s two tallest players to the perimeter.
- {team} test size against the ball under {coach}'s new assignments.
- The experiment moves {team}'s height away from the rim.

### `strategy.deliberate_last_shot_fail`

**Trigger:** Team deliberately holds for the final shot but loses possession before attempting it.

**Placeholders:** `{team}`, `{opp}`

**Media examples:**

- {team} wait for the last shot and never take it.
- {opp} break up the possession {team} spend the clock protecting.
- The final-shot plan ends in a turnover for {team}.

### `strategy.intentional_foul_target_counter`

**Trigger:** Opponent removes a repeatedly intentionally fouled player, and the fouling team stops the tactic.

**Placeholders:** `{opp}`, `{team}`

**Media examples:**

- {opp}'s substitution ends {team}'s targeted fouling scheme.
- The intended free-throw target leaves; {team} change their plan.
- {opp} answer the whistles through the substitution table.

### `strategy.zero_dribble_possession`

**Trigger:** Team scores on a possession containing only passes and a shot, with no dribbles.

**Placeholders:** `{team}`, `{opp}`

**Media examples:**

- {team} score without a single dribble against {opp}.
- The ball travels by pass all the way to {team}'s basket.
- No dribbling required. {team} pass their way directly to a basket.

### `strategy.keeper_inbound_lob`

**Trigger:** A legal long inbound lob directly creates a made shot in the final second.

**Placeholders:** `{team}`, `{opp}`

**Media examples:**

- {team}'s long inbound lob beats the final second.
- One pass travels the floor and delivers {team}'s basket.
- {opp} cannot interrupt the airborne shortcut.

### `strategy.no_timeout_protocol`

**Trigger:** Coach explicitly declines an available timeout after a conceded run; the team then executes its rehearsed self-organizing set.

**Placeholders:** `{coach}`, `{team}`

**Media examples:**

- {coach} lets {team} organize their own response.
- No whistle from the bench: {team} reach their rehearsed set themselves.
- {team} use the on-court reset {coach} has practiced.

### `strategy.bench_unit_full_half`

**Trigger:** Coach intentionally uses the designated second unit for every minute of a half, without injury necessity.

**Placeholders:** `{coach}`, `{team}`

**Media examples:**

- {coach} hands an entire half to {team}'s second unit.
- {team}'s rotation experiment gives the reserves the whole period.
- The usual starters watch an entire half become somebody else's shift.

### `strategy.switch_everything_small_sample`

**Trigger:** A declared switch-everything scheme records zero opponent paint makes over its first ten possessions.

**Placeholders:** `{team}`, `{opp}`

**Media examples:**

- {team}'s switching experiment starts with ten possessions of paint denial.
- {opp} find no made basket in the lane during the opening test.
- Ten possessions, zero paint makes for {opp}. Promising start; long exam ahead.

### `strategy.rule_legal_four_players`

**Trigger:** Team intentionally plays with four players where the active rulebook explicitly permits it, for a documented tactical possession.

**Placeholders:** `{team}`, `{coach}`

**Media examples:**

- {team} try a legal four-player possession.
- {coach} leaves one spot empty under the active rulebook.
- Four players take the floor for {team}'s unusual experiment.

## 4. 4. Officiating, replay, and scorekeeping

### `ref.double_technical_offset`

**Trigger:** Two technical fouls are officially assessed as offsetting, with no free throws awarded.

**Placeholders:** `{team}`, `{opp}`

**Media examples:**

- Officials assess offsetting technicals to {team} and {opp}.
- The whistle makes a double appearance. The free-throw line gets no visitors.
- The officials record both penalties and cancel their shooting effect.

### `ref.challenge_success_cost`

**Trigger:** A challenge overturns a call but consumes the team's last available timeout under that era's rules.

**Placeholders:** `{team}`, `{coach}`

**Media examples:**

- {team} win the review and lose their last timeout.
- {coach} gets the call corrected at a clock-management cost.
- {team} get the right call and an empty timeout cupboard.

### `ref.goaltending_reversed`

**Trigger:** Replay legally overturns a goaltending call into a clean block, removing the credited basket.

**Placeholders:** `{player}`, `{opp}`, `{team}`

**Media examples:**

- Replay restores {player}'s block and removes {opp}'s points.
- The points disappear; {player}'s block gets its name back.
- {team} get a clean stop back from the review.

### `ref.stat_correction_assist`

**Trigger:** Official postgame correction changes a player's assist total without changing the result.

**Placeholders:** `{player}`, `{ast}`

**Media examples:**

- The official scorer revises {player}'s assists to {ast}.
- {player}'s final line changes after the film review.
- The film-room recount gives {player} {ast} assists. The final score stays put.

### `ref.wrong_free_throw_shooter`

**Trigger:** Officials detect and correct an ineligible free-throw shooter using the applicable correctable-error procedure.

**Placeholders:** `{team}`

**Media examples:**

- Officials correct {team}'s free-throw shooter error.
- The wrong player steps up; the rulebook supplies the remedy.
- {team}'s free-throw sequence is reset under the error procedure.

### `ref.clock_reset_dispute_resolved`

**Trigger:** Official review confirms the clock displayed an incorrect time and records the corrected remaining time.

**Placeholders:** `{remaining}`, `{team}`, `{opp}`

**Media examples:**

- Officials reset the clock to {remaining} for {team} and {opp}.
- The timing review restores {remaining} to the display.
- A clock correction gives both teams the same verified time.

### `ref.inadvertent_whistle_replay`

**Trigger:** An acknowledged accidental whistle requires replaying or redistributing a possession under the active rules.

**Placeholders:** `{team}`, `{opp}`

**Media examples:**

- An inadvertent whistle interrupts {team}'s possession.
- Play stops for a sound the official confirms was unintended.
- {team} and {opp} resume under the accidental-whistle procedure.

### `ref.unsportsmanlike_upgrade`

**Trigger:** A video review officially upgrades a foul classification to unsportsmanlike or equivalent, with the announced penalty.

**Placeholders:** `{player}`, `{classification}`, `{penalty}`, `{team}`

**Media examples:**

- Review upgrades {player}'s foul to {classification}.
- The officials apply {penalty} after reviewing {player}'s contact.
- {team} face the confirmed consequence of the upgraded call.

### `ref.last_two_minutes_error`

**Trigger:** League publishes a report acknowledging a specified officiating error; the result remains final.

**Placeholders:** `{error}`, `{team}`

**Media examples:**

- League report identifies {error} in {team}'s game.
- The review acknowledges {error}; it does not replay the finish.
- {team} receive an official explanation after the result becomes final.

### `ref.scoreboard_three_corrected`

**Trigger:** A made basket shown as three is officially corrected to two after the shooter is found on the line.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player}'s basket is corrected from three points to two.
- A foot on the line changes {team}'s total.
- The replay keeps the make and removes one point.

## 5. 5. Records and unusual statistical milestones

### `record.five_by_five`

**Trigger:** Player officially reaches at least five points, rebounds, assists, steals, and blocks in one game.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player} fills all five columns for {team}.
- Five in every major counting category: {player} leaves no empty lane.
- {team} get a five-by-five from {player}.

### `record.perfect_high_volume`

**Trigger:** Player makes every field-goal attempt with at least ten attempts; final box score verified.

**Placeholders:** `{player}`, `{fgm}`, `{fga}`, `{opp}`

**Media examples:**

- {player} goes {fgm}-for-{fga} against {opp}.
- Ten attempts or more, zero misses for {player}.
- {opp} never see a missed field goal from {player}.

### `record.quadruple_double`

**Trigger:** Official final statistics show double figures in four of points, rebounds, assists, steals, and blocks.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player} records a verified quadruple-double for {team}.
- Four categories reach double digits in {player}'s final box score.
- Four columns, double digits, one {player}. The final box score is remarkable.

### `record.assist_turnover_clean`

**Trigger:** Player reaches at least twenty assists with zero turnovers.

**Placeholders:** `{player}`, `{ast}`, `{team}`

**Media examples:**

- {player} delivers {ast} assists without a turnover.
- Every risk pays its way in {player}'s passing ledger.
- {team} get {ast} assists and no lost possession from {player}.

### `record.minutes_sixth_overtime`

**Trigger:** Player sets franchise single-game minutes record in a game with at least six overtime periods.

**Placeholders:** `{player}`, `{min}`, `{team}`

**Media examples:**

- {player} logs a franchise-record {min} minutes for {team}.
- Six extra periods stretch {player}'s workload into team history.
- {team}'s minutes record changes hands during the marathon.

### `record.career_free_throw_mark`

**Trigger:** Official career made-free-throw total passes the league's existing record.

**Placeholders:** `{player}`, `{league}`

**Media examples:**

- {player} becomes {league}'s career free-throw leader.
- The latest make gives {player} the all-time total.
- One more trip to the stripe puts {player} above everyone in {league}'s history.

### `record.oldest_debut`

**Trigger:** Player makes his first league appearance at an age above the existing debut record.

**Placeholders:** `{player}`, `{league}`, `{age}`

**Media examples:**

- {player} sets {league}'s debut-age record at {age}.
- His first appearance arrives at {age}; the record book notices.
- {league} welcome their oldest first-time player in {player}.

### `record.team_zero_turnovers`

**Trigger:** Team finishes a complete game with zero officially recorded turnovers.

**Placeholders:** `{team}`, `{opp}`

**Media examples:**

- {team} complete an entire game without a turnover.
- {opp} never collect a turnover from {team}'s final ledger.
- Every possession avoids a giveaway for {team}.

### `record.one_point_scoring_record`

**Trigger:** Player breaks the applicable season record for made free throws while recording no made field goals that game.

**Placeholders:** `{player}`

**Media examples:**

- {player}'s free throws carry him past the season mark.
- No field-goal make is needed for {player}'s record-setting total.
- The stripe supplies every point on {player}'s milestone night.

### `record.shared_jersey_milestone`

**Trigger:** Two active teammates wearing legally distinct numbers both reach the same career milestone in one game.

**Placeholders:** `{player}`, `{teammate}`, `{milestone}`, `{team}`

**Media examples:**

- {player} and {teammate} both reach {milestone} for {team}.
- One game gives {team} two career landmarks.
- {team} need two milestone balls tonight: one for {player}, one for {teammate}.

## 6. 6. Amateur and preprofessional paths

### `amateur.walk_on_roster`

**Trigger:** Player earns an officially offered walk-on roster place after an open tryout.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player} earns a walk-on place with {team}.
- The open tryout ends with a roster invitation for {player}.
- {player} shows up for the open door and earns a seat inside.

### `amateur.scholarship_reinstated`

**Trigger:** An institution restores a previously withdrawn athletic scholarship following a documented appeal.

**Placeholders:** `{school}`, `{player}`

**Media examples:**

- {school} restore {player}'s scholarship after appeal.
- The written decision gives {player} his funding back.
- {player}'s successful appeal changes the cost of staying at {school}.

### `amateur.exam_ineligible`

**Trigger:** School officially rules a player academically ineligible for competition until stated requirements are met.

**Placeholders:** `{player}`, `{school}`

**Media examples:**

- {player} becomes academically ineligible at {school}.
- The classroom requirement removes {player} from competition.
- {school}'s eligibility ruling makes academic recovery the next assignment.

### `amateur.eligibility_restored`

**Trigger:** Player completes the documented academic remediation and receives official eligibility clearance.

**Placeholders:** `{school}`, `{player}`

**Media examples:**

- {school} clear {player} to compete again.
- The required coursework is complete; {player}'s eligibility returns.
- Academic recovery opens the court door for {player}.

### `amateur.transfer_credit_delay`

**Trigger:** Accepted transfer credits are insufficient for immediate eligibility, causing an official delayed debut.

**Placeholders:** `{player}`, `{school}`

**Media examples:**

- {player}'s debut at {school} waits on transfer-credit requirements.
- The move is complete; the academic paperwork is not.
- {school} cannot field {player} until the credit requirement is satisfied.

### `amateur.grassroots_travel_fund`

**Trigger:** Player secures a verified travel bursary for a grassroots tournament without a commercial endorsement agreement.

**Placeholders:** `{player}`, `{tournament}`

**Media examples:**

- {player} receives travel support for {tournament}.
- The bursary pays for the route to {tournament}.
- {player}'s opportunity no longer stops at the travel bill.

### `amateur.combine_measurement_error`

**Trigger:** Combine organizers acknowledge and correct a published physical measurement.

**Placeholders:** `{event}`, `{player}`, `{measurement}`

**Media examples:**

- {event} correct {player}'s published measurement to {measurement}.
- The measuring record changes after {event} acknowledge the error.
- {player} has not changed overnight. The corrected measuring sheet has.

### `amateur.undrafted_tryout_offer`

**Trigger:** An undrafted player receives a formal tryout invitation, without a roster contract.

**Placeholders:** `{team}`, `{player}`

**Media examples:**

- {team} invite undrafted {player} to a tryout.
- Draft night passes; {player}'s next chance arrives by invitation.
- The draft overlooks him. {team} still want to see {player} on their court.

### `amateur.redshirt_decision`

**Trigger:** Player and school formally elect a permitted redshirt season that preserves an eligibility year.

**Placeholders:** `{player}`, `{school}`

**Media examples:**

- {player} takes an approved redshirt year at {school}.
- This season becomes development time for {player}.
- {school} preserve an eligibility year through the redshirt choice.

### `amateur.school_team_disbanded`

**Trigger:** School officially ends its basketball program, releasing enrolled players under applicable transfer rules.

**Placeholders:** `{school}`, `{player}`

**Media examples:**

- {school} end their basketball program; {player} faces a new route.
- The roster disappears with the program at {school}.
- {player}'s next decision begins with a team that no longer exists.

## 7. 7. Skill development and career education

### `training.offhand_breakthrough`

**Trigger:** Tracking shows a predefined improvement threshold in off-hand finishing across at least twenty competitive attempts.

**Placeholders:** `{player}`

**Media examples:**

- {player}'s off-hand work clears the tracked improvement mark.
- Practice shows up in twenty competitive attempts for {player}.
- The hand opponents used to invite is becoming the hand they have to respect.

### `training.shot_rebuild_regression`

**Trigger:** Player formally rebuilds shooting mechanics and falls below the pre-agreed efficiency baseline over the test window.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player}'s rebuilt shot trails his previous baseline.
- The mechanics change is real; the early results are worse.
- {team} face the measured cost of {player}'s shooting reset.

### `training.shot_rebuild_recovery`

**Trigger:** After a recorded rebuild regression, player exceeds the original baseline over a fresh qualifying sample.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player}'s rebuilt shot finally clears his old baseline.
- The follow-up sample rewards the mechanical overhaul.
- The ugly adjustment period finally gives {team} a better version of {player}'s shot.

### `training.film_mentor_certification`

**Trigger:** Player completes a formal opponent-scouting qualification or team analyst course.

**Placeholders:** `{player}`, `{course}`, `{team}`

**Media examples:**

- {player} completes {course} with {team}.
- The film room adds a qualification to {player}'s resume.
- {team} gain a player who finishes the scouting coursework.

### `training.language_course_complete`

**Trigger:** Player completes an accredited or team-verified language course needed for his new league environment.

**Placeholders:** `{player}`, `{language}`, `{team}`

**Media examples:**

- {player} finishes the {language} course.
- Learning the local language becomes another completed assignment for {player}.
- {team}'s language program records {player}'s completion.

### `training.late_growth_adaptation`

**Trigger:** Verified physical measurements show a substantial growth change, and staff formally alter the player's development plan.

**Placeholders:** `{team}`, `{player}`, `{coach}`

**Media examples:**

- {team} revise {player}'s plan after a verified growth change.
- New measurements give {player} a new development assignment.
- {coach} adjusts the skill work to {player}'s changed frame.

### `training.coach_license`

**Trigger:** Player earns a recognized coaching qualification while still active.

**Placeholders:** `{player}`, `{license}`

**Media examples:**

- {player} earns {license} during his playing career.
- {player} earns the bench qualification while his playing career is still open.
- {player} adds a formal coaching qualification to his resume.

### `training.degree_completed`

**Trigger:** Player finishes a verified academic degree during his professional career.

**Placeholders:** `{player}`, `{school}`

**Media examples:**

- {player} completes his degree at {school}.
- The graduation requirement is satisfied alongside the game schedule.
- {player}'s season includes a diploma from {school}.

### `training.apprentice_trainer`

**Trigger:** Player completes a supervised nonmedical strength-training apprenticeship with a qualified staff member.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player} completes a supervised strength-training apprenticeship.
- The weight-room lessons give {player} a verified qualification.
- {team}'s supervised program adds another skill to {player}'s future plans.

### `training.retrain_position_plan`

**Trigger:** Staff formally reclassify a player into a new tactical role after a completed development assessment.

**Placeholders:** `{team}`, `{player}`, `{role}`, `{coach}`

**Media examples:**

- {team} move {player} into {role} after the assessment.
- The development review gives {player} a new assignment.
- {coach} turns the completed training plan into a role change.

## 8. 8. International basketball and multiple leagues

### `world.national_team_choice`

**Trigger:** A player eligible for multiple national teams submits a legally binding representation choice where applicable.

**Placeholders:** `{player}`, `{country}`

**Media examples:**

- {player} commits to representing {country}.
- The official choice settles {player}'s national-team route.
- {country} receive {player}'s confirmed commitment.

### `world.citizenship_clearance`

**Trigger:** Government and federation both confirm the citizenship and sport-eligibility requirements for national competition.

**Placeholders:** `{player}`, `{country}`

**Media examples:**

- {player} receives clearance to represent {country}.
- Citizenship paperwork and federation eligibility are both complete.
- {country}'s roster can now formally include {player}.

### `world.club_country_schedule`

**Trigger:** Verified club and national-team schedules overlap, and the player formally chooses one obligation with documented consent or sanction.

**Placeholders:** `{player}`, `{competition}`, `{team}`

**Media examples:**

- {player} chooses {competition} after a confirmed schedule conflict.
- Two calendars collide; {player}'s filed decision selects {competition}.
- {team} receive the official resolution of {player}'s overlapping commitments.

### `world.release_letter_delayed`

**Trigger:** A required international release letter is not issued by the registration deadline, preventing a debut.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player}'s debut for {team} stalls over the release letter.
- The deadline passes without the required international clearance.
- {team} cannot register {player} for the scheduled opener.

### `world.dual_league_contract`

**Trigger:** Player signs two compatible seasonal contracts where both leagues explicitly permit dual participation.

**Placeholders:** `{player}`, `{team}`, `{otherteam}`

**Media examples:**

- {player} signs a permitted dual-league arrangement with {team} and {otherteam}.
- One player, two permitted schedules: {player} has a busy basketball calendar.
- {team} and {otherteam} approve the shared-season contract structure.

### `world.relegation`

**Trigger:** Club mathematically and officially loses top-division status under its competition's promotion system.

**Placeholders:** `{team}`, `{league}`

**Media examples:**

- {team} are relegated from {league}.
- The final table sends {team} down a division.
- Next season's road map changes for {team}; the final table sends them down.

### `world.promotion`

**Trigger:** Club officially earns promotion through the applicable league table or promotion playoff.

**Placeholders:** `{team}`, `{league}`, `{city}`

**Media examples:**

- {team} secure promotion to {league}.
- The route upward is complete for {team}.
- {city} get to circle a higher division on next season's calendar.

### `world.currency_payment_shortfall`

**Trigger:** Club salary paid in contract currency converts below a guaranteed indexed minimum; adjudicator confirms the shortfall.

**Placeholders:** `{player}`, `{amount}`, `{team}`

**Media examples:**

- {player}'s indexed salary falls short by {amount}.
- The currency clause gives {player} a verified unpaid balance.
- {team} owe the confirmed exchange-adjustment shortfall.

### `world.visa_work_clearance`

**Trigger:** Work authorization is formally granted after a previously blocked registration; no citizenship claim is implied.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player} receives work clearance for {team}.
- The permit arrives and opens {player}'s professional route.
- {team}'s registration can proceed after the authorization decision.

### `world.cross_league_supercup`

**Trigger:** Team qualifies for a formally sanctioned cross-league cup outside its domestic championship.

**Placeholders:** `{team}`, `{competition}`, `{league}`

**Media examples:**

- {team} qualify for {competition}.
- The next bracket brings opponents from beyond {league}.
- {team}'s season expands into the cross-league cup.

## 9. 9. Money, investing, taxes, and scams

### `money.agent_fee_audit`

**Trigger:** An independent contractual audit verifies agent fees exceeded the authorized rate and calculates the recoverable amount.

**Placeholders:** `{amount}`, `{player}`

**Media examples:**

- An audit finds {amount} in excess fees charged to {player}.
- The contract math leaves {player} with a verified repayment claim.
- {player} checks the fees and finds money he should never have been charged.

### `money.tax_payment_plan`

**Trigger:** Relevant tax authority accepts a formal installment arrangement for an established debt; no fraud finding is implied.

**Placeholders:** `{player}`, `{amount}`

**Media examples:**

- {player} enters a tax payment plan for {amount}.
- The approved schedule gives {player} a structured way to repay.
- A tax balance becomes a documented installment obligation for {player}.

### `money.tax_refund`

**Trigger:** Tax authority approves a verified refund after correcting an overpayment.

**Placeholders:** `{player}`, `{amount}`

**Media examples:**

- {player} receives a confirmed tax refund of {amount}.
- The corrected filing puts {amount} back in {player}'s accounts.
- The corrected tax bill comes with {amount} traveling back toward {player}.

### `money.identity_theft_freeze`

**Trigger:** Financial institution verifies unauthorized identity-based transactions and freezes the affected account.

**Placeholders:** `{player}`

**Media examples:**

- {player}'s account is frozen after verified identity theft.
- The bank blocks further activity on {player}'s compromised account.
- Unauthorized transactions force an account-security reset for {player}.

### `money.scam_offer_rejected`

**Trigger:** Player rejects a documented fraudulent investment solicitation after independent verification, with no loss incurred.

**Placeholders:** `{player}`

**Media examples:**

- {player} rejects a verified investment scam before paying.
- The independent check protects {player}'s money.
- The pitch promises everything. {player}'s independent check saves him from buying it.

### `money.scam_loss_confirmed`

**Trigger:** Financial investigation verifies a fraudulent investment loss and records the amount; no named perpetrator is convicted by this trigger.

**Placeholders:** `{player}`, `{amount}`

**Media examples:**

- {player} loses {amount} in a verified investment scam.
- The loss is confirmed; recovery remains a separate question.
- {player}'s account balance records the cost of the fraudulent pitch.

### `money.passive_income_covers_salary`

**Trigger:** Verified nonplaying investment income exceeds the player's annual basketball salary for the first time.

**Placeholders:** `{player}`

**Media examples:**

- {player}'s investment income overtakes his playing salary.
- For {player}, the portfolio now earns more than the uniform.
- The audited portfolio pays {player} more than the season contract.

### `money.business_profitable_exit`

**Trigger:** Player completes a verified sale of an existing business for a documented realized profit.

**Placeholders:** `{player}`, `{business}`, `{amount}`

**Media examples:**

- {player} exits {business} with a {amount} profit.
- The sale closes and turns {player}'s ownership stake into realized gains.
- {player} leaves {business} with a completed sale and a {amount} profit.

### `money.family_loan_repaid`

**Trigger:** A voluntarily agreed family loan is fully repaid, with both parties confirming settlement.

**Placeholders:** `{player}`, `{relation}`

**Media examples:**

- {player} settles the family loan in full.
- The last payment closes {player}'s agreed debt to {relation}.
- {relation} confirm the repayment and the end of the loan.

### `money.insurance_claim_approved`

**Trigger:** Insurer accepts a documented nonmedical claim after a covered loss and confirms payment.

**Placeholders:** `{player}`, `{amount}`

**Media examples:**

- {player}'s insurer approves a {amount} claim.
- The covered loss receives a confirmed payout.
- {player} gets a decision on the policy he actually bought.

## 10. 10. Legal allegations, specific offenses, and charging decisions

### `legal.public_allegation_unverified`

**Trigger:** A publicly filed complaint makes a specific allegation against the player; no investigation finding, arrest, or charge is established.

**Placeholders:** `{allegation}`, `{player}`

**Media examples:**

- A filed complaint alleges {allegation} against {player}.
- {player} faces a public allegation that has not been established.
- The complaint is on record; its claim remains unproven.

### `legal.private_inquiry_no_charge`

**Trigger:** Authorities formally open a criminal inquiry into a specified allegation and confirm no charges have been filed.

**Placeholders:** `{player}`, `{allegation}`

**Media examples:**

- Authorities open an inquiry into allegations involving {player}.
- No charge is filed as investigators examine {allegation}.
- An inquiry begins; {player}'s legal outcome remains unresolved.

### `legal.financial_fraud_charge`

**Trigger:** Prosecutor formally files a financial-fraud charge under the applicable fictional jurisdiction; guilt is unresolved.

**Placeholders:** `{player}`, `{jurisdiction}`

**Media examples:**

- {player} is charged with financial fraud in {jurisdiction}.
- The filed charge begins a case, not a finding of guilt.
- {player} faces court proceedings over the prosecutor's fraud allegation.

### `legal.tax_evasion_charge`

**Trigger:** Prosecutor files a tax-evasion charge supported by an official charging document; no conviction exists.

**Placeholders:** `{player}`, `{jurisdiction}`

**Media examples:**

- {player} faces a filed tax-evasion charge.
- The tax case moves into court with guilt undecided.
- Prosecutors formally allege tax evasion by {player} in {jurisdiction}.

### `legal.match_fixing_charge`

**Trigger:** Prosecutor files a criminal match-fixing charge where such conduct is criminalized; league discipline is separately tracked.

**Placeholders:** `{player}`, `{jurisdiction}`

**Media examples:**

- {player} is charged in an alleged match-fixing case.
- {jurisdiction}'s prosecutors file charges; the sporting outcome remains separate.
- The case alleges manipulated competition, with no verdict against {player} yet.

### `legal.assault_charge`

**Trigger:** An official prosecutor files an assault charge from a specific off-court incident; no conviction or injury severity is assumed.

**Placeholders:** `{player}`, `{incident}`

**Media examples:**

- {player} faces an assault charge over {incident}.
- Prosecutors bring the case to court; guilt remains undecided.
- The filed allegation concerns {incident}, not an on-court confrontation.

### `legal.possession_charge`

**Trigger:** Prosecutor files a drug-possession charge in a jurisdiction where the recorded substance and conduct are prohibited.

**Placeholders:** `{player}`, `{jurisdiction}`, `{substance}`

**Media examples:**

- {player} faces a possession charge under {jurisdiction}'s law.
- The charging document concerns {substance}; the case has no verdict.
- {player}'s legal team respond to the filed possession allegation.

### `legal.trespass_charge`

**Trigger:** Prosecutor files a trespass charge involving a specified restricted place; guilt remains unresolved.

**Placeholders:** `{player}`, `{place}`

**Media examples:**

- {player} is charged with trespass at {place}.
- A disputed entry becomes a formal court case for {player}.
- The charge alleges unauthorized entry; it does not establish guilt.

### `legal.property_damage_charge`

**Trigger:** Prosecutor files a property-damage charge and records the alleged loss amount, without a verdict.

**Placeholders:** `{player}`, `{amount}`, `{place}`

**Media examples:**

- {player} faces a property-damage charge over alleged losses of {amount}.
- The prosecutor alleges damage at {place}; the case is unresolved.
- {player}'s court case centers on a disputed property incident.

### `legal.weapons_law_charge`

**Trigger:** Prosecutor files a jurisdiction-specific weapons-law violation from verified charging documents, without procedural details or a conviction.

**Placeholders:** `{player}`, `{jurisdiction}`

**Media examples:**

- {player} faces a weapons-law charge in {jurisdiction}.
- The allegation enters court under the applicable local statute.
- A filed charge creates a legal case for {player}; guilt is unproven.

## 11. 11. Family, caregiving, and ordinary life commitments

### `family.parental_leave`

**Trigger:** Player formally takes approved parental leave with a stated return date; no childbirth event is required.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player} takes approved parental leave from {team}.
- {team} confirm time away for {player}'s family responsibilities.
- {team} make room on the calendar for a different kind of responsibility.

### `family.caregiver_leave`

**Trigger:** Player takes approved leave to provide care to a living relative, with publicly consented disclosure.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player} steps away from {team} for caregiving leave.
- Family care becomes {player}'s immediate commitment.
- {team} approve the requested time away without demanding private details.

### `family.eldercare_schedule`

**Trigger:** Player and team agree a recurring practice adjustment to support eldercare while retaining game availability.

**Placeholders:** `{team}`, `{player}`

**Media examples:**

- {team} adjust {player}'s practice schedule for eldercare.
- A recurring care commitment gets a workable basketball timetable.
- {player} keeps his game duties under the agreed care arrangement.

### `family.adoption_finalized`

**Trigger:** A competent authority finalizes an adoption and the family chooses to announce it publicly.

**Placeholders:** `{player}`

**Media examples:**

- {player}'s family announce a finalized adoption.
- The legal process concludes with a new family chapter.
- {player} shares the family news after the final approval.

### `family.foster_care_approved`

**Trigger:** Authorities approve the player's household as foster carers; identifying details of children remain private.

**Placeholders:** `{player}`

**Media examples:**

- {player}'s household receives foster-care approval.
- The approved household prepares for a new care responsibility.
- {player} announces the approval while keeping children's details private.

### `family.partner_distance_plan`

**Trigger:** Player and partner publicly confirm a jointly chosen long-distance arrangement following a transfer, without a breakup.

**Placeholders:** `{player}`

**Media examples:**

- {player} and his partner choose a long-distance plan.
- Two cities become part of the couple's agreed schedule.
- A basketball move changes the travel, not the announced commitment.

### `family.partner_job_relocation`

**Trigger:** Partner independently accepts employment elsewhere; player publicly confirms a family relocation plan.

**Placeholders:** `{player}`, `{city}`

**Media examples:**

- {player}'s family plan a move for his partner's new job.
- Another career sets the family destination this time; {player} confirms the move.
- {player} confirms the jointly agreed relocation to {city}.

### `family.home_school_schedule`

**Trigger:** Household chooses a lawful schooling arrangement and player adjusts his nonteam time; no child's identity is exposed.

**Placeholders:** `{player}`, `{schooling}`

**Media examples:**

- {player} adjusts his home schedule around {schooling}.
- Family education adds a regular appointment to {player}'s calendar.
- The household's chosen school plan changes the routine off the court.

### `family.sibling_career_meeting`

**Trigger:** Player and a sibling both make official rosters in the same league and meet for the first time as opponents.

**Placeholders:** `{player}`, `{sibling}`, `{league}`, `{team}`

**Media examples:**

- {player} faces {sibling} for their first meeting in {league}.
- The family matchup finally reaches the official schedule.
- {team} get a scouting report with a family connection.

### `family.reunion_after_estrangement`

**Trigger:** Player and an estranged relative mutually confirm reconciliation and consent to a public announcement.

**Placeholders:** `{player}`, `{relation}`

**Media examples:**

- {player} and {relation} announce a reconciliation.
- The family confirm a renewed connection on their own terms.
- {player} shares a repaired relationship with no private dispute details.

## 12. 12. Health, recovery, and prevention

### `health.sleep_study_treatment`

**Trigger:** A licensed clinician diagnoses a sleep condition and the player publicly confirms a treatment plan.

**Placeholders:** `{player}`, `{condition}`, `{team}`

**Media examples:**

- {player} begins clinician-guided care for {condition}.
- A confirmed diagnosis gives {player}'s sleep concerns a treatment plan.
- {team} support the publicly disclosed care arrangement.

### `health.concussion_protocol_clear`

**Trigger:** Player completes the applicable medical concussion protocol and receives independent clearance.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player} completes the concussion protocol for {team}.
- Independent clearance opens the next stage of {player}'s return.
- The required medical checks are complete; availability still follows team planning.

### `health.second_opinion_disagreement`

**Trigger:** Two qualified medical opinions differ on a publicly disclosed treatment decision; player has not selected a plan.

**Placeholders:** `{player}`, `{condition}`, `{team}`

**Media examples:**

- {player} weighs differing medical opinions on {condition}.
- The specialists disagree; {player}'s treatment choice remains open.
- {team} wait while {player} reviews the two qualified assessments.

### `health.second_opinion_choice`

**Trigger:** Player selects a documented treatment plan after qualified second opinions and voluntarily announces the decision.

**Placeholders:** `{player}`, `{treatment}`, `{team}`

**Media examples:**

- {player} selects {treatment} after a second-opinion review.
- The medical decision is made with qualified input.
- {team} receive {player}'s confirmed treatment plan.

### `health.preventive_rest`

**Trigger:** Medical staff prescribe preventive rest despite no diagnosed injury, with a recorded workload threshold.

**Placeholders:** `{team}`, `{player}`

**Media examples:**

- {team} rest {player} after the workload threshold is reached.
- The medical recommendation responds to accumulation, not a new injury.
- {player}'s schedule pauses under the preventive-rest plan.

### `health.nutrition_plan_success`

**Trigger:** Clinician-supervised nutrition plan meets a predefined performance or recovery benchmark without claiming a medical cure.

**Placeholders:** `{player}`, `{benchmark}`, `{team}`

**Media examples:**

- {player}'s supervised nutrition plan meets {benchmark}.
- The tracked result reaches the target set with qualified staff.
- {team} record a successful checkpoint in {player}'s nutrition plan.

### `health.extreme_diet_stopped`

**Trigger:** Player's self-chosen extreme diet produces documented health concerns and he agrees to clinician-guided correction.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player} ends an extreme diet after documented health concerns.
- Qualified advice redirects {player}'s food plan.
- {team} confirm a supervised correction after the risky experiment.

### `health.emergency_response_survival`

**Trigger:** Player survives a medical emergency after professional treatment and consents to a limited public update.

**Placeholders:** `{player}`

**Media examples:**

- {player} survives a medical emergency and remains under care.
- The family authorize a limited update: {player} is receiving treatment.
- Basketball waits while {player}'s care team handle recovery.

### `health.substance_treatment_completed`

**Trigger:** Player voluntarily announces completion of a licensed substance-use treatment program; ongoing care is not presumed finished.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player} completes a licensed treatment program.
- The announced milestone marks one step in {player}'s ongoing recovery.
- {team} support the care plan that follows the completed program.

### `health.medication_exemption`

**Trigger:** Governing medical authority grants a documented therapeutic-use exemption for a prescribed medication.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player} receives a therapeutic-use exemption.
- The medical authority approves the documented prescription arrangement.
- {team} receive confirmation of {player}'s permitted treatment status.

## 13. 13. Disability, accessibility, and inclusion

### `access.hearing_accommodation`

**Trigger:** Player requests and team implements a verified visual communication accommodation for hearing access.

**Placeholders:** `{team}`, `{player}`

**Media examples:**

- {team} add visual signals for {player}'s hearing access.
- The new cue system makes the play call accessible.
- {player}'s requested communication support becomes part of team practice.

### `access.vision_equipment`

**Trigger:** Competition authority approves prescribed vision equipment after safety review.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player}'s vision equipment receives competition approval.
- The safety review clears the prescribed equipment for {team}'s games.
- {player} can use the approved aid during competition.

### `access.chronic_condition_plan`

**Trigger:** Player and clinicians approve a privately detailed chronic-condition management plan; only consented availability facts are public.

**Placeholders:** `{team}`, `{player}`

**Media examples:**

- {team} adopt {player}'s clinician-approved availability plan.
- A chronic condition receives an agreed management schedule.
- {player} sets the public boundaries around his care arrangements.

### `access.arena_ramp_complete`

**Trigger:** An audited arena access renovation opens step-free spectator routes.

**Placeholders:** `{arena}`, `{team}`

**Media examples:**

- {arena} open newly audited step-free routes.
- The renovation improves entry for supporters with mobility needs.
- {team}'s home venue removes a verified access barrier.

### `access.sensory_session`

**Trigger:** Team holds a scheduled lower-stimulation fan event with published accommodations.

**Placeholders:** `{team}`, `{arena}`

**Media examples:**

- {team} host a lower-stimulation event at {arena}.
- The published access plan changes the crowd experience.
- {arena} welcome fans through the adapted event schedule.

### `access.caption_feed_launch`

**Trigger:** Arena launches live captions after a completed technical and user-access test.

**Placeholders:** `{arena}`, `{team}`

**Media examples:**

- {arena} launch tested live captions.
- The public-address message gains a readable route to fans.
- {team}'s venue adds verified caption access.

### `access.adaptive_league_entry`

**Trigger:** Player registers in an adaptive basketball competition under that competition's eligibility rules.

**Placeholders:** `{player}`, `{competition}`

**Media examples:**

- {player} joins {competition} under its eligibility rules.
- A new competition route opens for {player}.
- The confirmed registration puts {player} on the adaptive basketball schedule.

### `access.coach_remote_health`

**Trigger:** Qualified coach receives an approved remote working arrangement for a documented access need.

**Placeholders:** `{coach}`, `{team}`

**Media examples:**

- {coach} begins an approved remote arrangement with {team}.
- The team adapt the job around an agreed access need.
- {team}'s coaching work continues through the new arrangement.

### `access.support_animal_approval`

**Trigger:** Venue formally approves a legally recognized assistance animal under applicable access rules.

**Placeholders:** `{arena}`, `{player}`

**Media examples:**

- {arena} approve the assistance-animal access arrangement.
- A verified access decision supports {player}'s attendance.
- The venue confirms the accommodation under the applicable rules.

### `access.disabled_staff_hire`

**Trigger:** Team hires a publicly self-identified disabled staff member and implements requested job accommodations.

**Placeholders:** `{team}`, `{staff}`

**Media examples:**

- {team} hire {staff} with agreed workplace accommodations.
- The role begins with the access support already arranged.
- {staff} join {team}'s staff under the confirmed employment plan.

## 14. 14. Fame, art, broadcasting, and public creativity

### `fame.album_release`

**Trigger:** Player releases a completed music project and its release is publicly verified; commercial success is not assumed.

**Placeholders:** `{player}`, `{project}`

**Media examples:**

- {player} releases {project} outside basketball.
- The music project reaches listeners; sales remain to be seen.
- {player}'s creative season now has a release date behind it.

### `fame.album_chart`

**Trigger:** Released music project reaches a verified chart position.

**Placeholders:** `{player}`, `{project}`, `{rank}`

**Media examples:**

- {player}'s {project} reaches number {rank} on the chart.
- The published listing gives {player} a measurable music milestone.
- {player} has another ranking to check, and {project} is climbing into view.

### `fame.film_role_complete`

**Trigger:** Player completes a verified acting role in a released production.

**Placeholders:** `{player}`, `{project}`

**Media examples:**

- {player} appears in the released film {project}.
- The credits roll, and {player}'s name is in them.
- {project} reaches viewers with {player} in its cast.

### `fame.documentary_fact_dispute`

**Trigger:** A documentary releases a disputed assertion and player publicly identifies the specific disagreement; truth is not adjudicated.

**Placeholders:** `{player}`, `{claim}`, `{project}`

**Media examples:**

- {player} disputes {claim} in {project}.
- The documentary's claim meets an on-record disagreement.
- The account is contested; neither version becomes established by the argument.

### `fame.memoir_release`

**Trigger:** A completed memoir is published with the player's authorized authorship or collaboration.

**Placeholders:** `{player}`, `{project}`

**Media examples:**

- {player} publishes his memoir, {project}.
- The next chapter of {player}'s career comes bound in a book.
- {project} gives {player} a new place to tell his story.

### `fame.podcast_regular_season`

**Trigger:** Player launches a recurring podcast with at least three released episodes during active competition.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player}'s podcast reaches its third episode during the season.
- The microphone becomes a recurring appointment alongside {team}'s games.
- {player} has three episodes out and games still on the calendar.

### `fame.art_sale`

**Trigger:** A verified sale transfers the player's original artwork for a disclosed amount.

**Placeholders:** `{player}`, `{amount}`, `{project}`

**Media examples:**

- {player}'s original artwork sells for {amount}.
- The buyer completes the purchase of {project}.
- The artwork finds a buyer; {player}'s creative ledger records {amount}.

### `fame.stage_show_cancelled`

**Trigger:** A booked public performance is officially canceled due to a documented basketball schedule conflict.

**Placeholders:** `{player}`, `{event}`, `{team}`

**Media examples:**

- {player} cancels {event} after a confirmed game conflict.
- The stage booking yields to {team}'s schedule.
- Ticket holders receive notice of {player}'s canceled appearance.

### `fame.fan_award_accessibility`

**Trigger:** Independent fan body awards a verified honor specifically for accessible public appearances.

**Placeholders:** `{player}`, `{award}`

**Media examples:**

- {player} receives {award} for accessible fan events.
- The honor recognizes the practical access choices in his appearances.
- {award} adds a public-service chapter to {player}'s profile.

### `fame.broadcast_trial`

**Trigger:** Player completes a verified guest-commentary trial with a fictional outlet during permitted nonplaying time.

**Placeholders:** `{player}`, `{outlet}`

**Media examples:**

- {player} completes a commentary trial with {outlet}.
- The guest microphone gives {player} a new professional audition.
- {player} tries the commentary chair while the playing career continues.

## 15. 15. Fan behavior, arena culture, and boundaries

### `fan.standing_ovation_return`

**Trigger:** Arena records an organized or sustained standing ovation for a returning former player before tip-off.

**Placeholders:** `{arena}`, `{player}`

**Media examples:**

- {arena} welcome {player} back with a standing ovation.
- The first response to {player}'s return comes from the seats.
- Before the opponent label can land, {arena} remind {player} he mattered here.

### `fan.tickets_boycott_verified`

**Trigger:** An organized boycott is publicly announced and verified ticket attendance drops below its predeclared comparison baseline.

**Placeholders:** `{team}`, `{arena}`

**Media examples:**

- {team}'s attendance falls during the announced boycott.
- The empty-seat count gives the protest a measurable footprint.
- Supporters withhold attendance; {arena}'s verified total drops.

### `fan.court_intrusion_removed`

**Trigger:** Security removes an unauthorized spectator from the playing surface; no player confrontation is assumed.

**Placeholders:** `{arena}`, `{team}`, `{opp}`

**Media examples:**

- Security stop a court intrusion at {arena}.
- Play pauses while an unauthorized spectator is removed.
- {team} and {opp} wait for the court to be cleared.

### `fan.harassment_ban`

**Trigger:** Venue formally bars a fan after a completed conduct review substantiates targeted harassment.

**Placeholders:** `{arena}`, `{team}`

**Media examples:**

- {arena} ban a spectator after substantiated harassment.
- The conduct review leads to a confirmed access ban.
- {team} announce the venue's response without repeating the abusive language.

### `fan.autograph_boundary`

**Trigger:** Player publicly establishes a noncommercial autograph boundary outside official fan events.

**Placeholders:** `{player}`

**Media examples:**

- {player} sets new boundaries around off-hours autographs.
- The announced policy redirects requests to scheduled fan sessions.
- {player} keeps the public fan sessions and asks for space outside them.

### `fan.fake_quote_correction`

**Trigger:** Outlet acknowledges that a circulated quote attributed to the player was fabricated and publishes a correction.

**Placeholders:** `{outlet}`, `{player}`

**Media examples:**

- {outlet} retract a fabricated quote attributed to {player}.
- The correction confirms that {player} never made the circulated statement.
- The quote travels fast. {outlet}'s correction finally catches it.

### `fan.deepfake_labelled`

**Trigger:** Independent verification establishes a purported player video as synthetic; distribution is publicly corrected.

**Placeholders:** `{player}`

**Media examples:**

- Verification identifies the {player} video as synthetic.
- The footage is fabricated, and the correction is on record.
- {player}'s actual actions cannot be inferred from the false clip.

### `fan.arena_silence_tribute`

**Trigger:** Team and family approve a respectful pregame silence for a publicly announced remembrance.

**Placeholders:** `{arena}`, `{team}`

**Media examples:**

- {arena} observe the approved pregame remembrance.
- The crowd pause together before {team}'s game.
- A quiet tribute follows the family's stated wishes.

### `fan.supporter_translation`

**Trigger:** A volunteer supporter group completes and publishes an authorized translation of team fan information.

**Placeholders:** `{team}`, `{language}`, `{arena}`

**Media examples:**

- Supporters publish {team}'s authorized guide in {language}.
- More fans can read the practical information for {arena}.
- The volunteer translation gives {team}'s welcome another language.

### `fan.chant_rule_approved`

**Trigger:** Venue approves a supporter-created chant after a documented content and timing review.

**Placeholders:** `{arena}`, `{team}`

**Media examples:**

- {arena} approve the supporters' new chant.
- The reviewed chant enters {team}'s matchday routine.
- The supporters write it; {arena} clear it; the crowd get a new refrain.

## 16. 16. Community, civic work, and public commitments

### `community.court_reopened`

**Trigger:** A funded neighborhood court renovation passes inspection and opens to the public.

**Placeholders:** `{player}`, `{city}`

**Media examples:**

- {player}'s supported court project opens in {city}.
- The inspection is complete; the neighborhood can use the court.
- The fence comes down and the neighborhood gets its court back.

### `community.court_budget_overrun`

**Trigger:** A court project publicly reports a verified budget overrun and a revised completion schedule.

**Placeholders:** `{project}`, `{amount}`, `{player}`

**Media examples:**

- {project} exceeds its budget by {amount}.
- The court is still a promise, and its construction bill just grows.
- {player}'s backed project publishes the revised completion plan.

### `community.water_distribution`

**Trigger:** Player participates in a verified emergency-supply distribution organized by qualified relief agencies.

**Placeholders:** `{player}`, `{city}`

**Media examples:**

- {player} helps distribute emergency supplies in {city}.
- The relief agency records the completed distribution shift.
- A day off becomes practical support under the local response plan.

### `community.youth_coach_training`

**Trigger:** Player completes safeguarding and coaching training required for a community youth program.

**Placeholders:** `{player}`, `{program}`

**Media examples:**

- {player} completes the required training for {program}.
- The community coaching role begins with its qualifications satisfied.
- {program} clear {player} for the supervised youth sessions.

### `community.local_election_candidate`

**Trigger:** Player legally registers as a candidate in a local election and publicly announces the campaign.

**Placeholders:** `{player}`, `{office}`, `{city}`

**Media examples:**

- {player} registers for {office} in {city}.
- {player} trades an offseason announcement for a place on the ballot.
- {player}'s campaign begins with the registration complete.

### `community.local_election_result`

**Trigger:** Electoral authority certifies the player's candidacy result, expressed by a status placeholder.

**Placeholders:** `{player}`, `{result}`, `{office}`, `{city}`

**Media examples:**

- {player}'s certified election result is {result}.
- The official count settles his campaign for {office}.
- {city}'s electoral authority confirms {result} for {player}.

### `community.disaster_game_postponed`

**Trigger:** League officially postpones a game because a local disaster makes the venue or travel unsafe.

**Placeholders:** `{team}`, `{arena}`, `{opp}`

**Media examples:**

- {team}'s game at {arena} is postponed for safety.
- Basketball pauses under the verified local emergency plan.
- {opp} await a new date while responders handle the emergency.

### `community.worker_housing_support`

**Trigger:** Player or club funds a completed housing-support program administered by an independent eligible provider.

**Placeholders:** `{team}`, `{city}`, `{amount}`, `{program}`

**Media examples:**

- {team} complete the agreed housing-support contribution in {city}.
- The independent provider confirms receipt of {amount}.
- The documented contribution supports housing through {program}.

### `community.public_transit_campaign`

**Trigger:** Player joins a verified transit-access campaign with a specific published proposal.

**Placeholders:** `{player}`, `{proposal}`, `{city}`

**Media examples:**

- {player} backs {proposal} for {city}'s transit network.
- The campaign connects arena access with everyday travel.
- {player}'s public support attaches to a published transport proposal.

### `community.school_attendance_mentor`

**Trigger:** An independently evaluated mentoring program supported by the player reports improved attendance against its registered baseline.

**Placeholders:** `{program}`, `{player}`, `{change}`

**Media examples:**

- {program} report improved school attendance with {player}'s support.
- The evaluation records {change} against the program's baseline.
- {program}'s attendance improvement comes with a measured result, not just a photo opportunity.

## 17. 17. Travel, accommodation, and game logistics

### `travel.charter_delay`

**Trigger:** Verified flight disruption delays the team's charter arrival and the league formally adjusts the game timetable.

**Placeholders:** `{team}`, `{time}`, `{arena}`, `{opp}`

**Media examples:**

- {team}'s delayed charter moves tip-off to {time}.
- The verified travel disruption changes {arena}'s schedule.
- {opp} receive the revised start time after {team}'s flight delay.

### `travel.equipment_missing`

**Trigger:** Airline or carrier confirms loss of the team's game equipment shipment; verified replacements are obtained before play.

**Placeholders:** `{team}`, `{arena}`

**Media examples:**

- {team} secure replacement equipment after the shipment goes missing.
- The gear takes the wrong trip; {team}'s staff rescue the right game.
- {arena}'s game proceeds with the confirmed replacement gear.

### `travel.passport_replacement`

**Trigger:** Player receives an emergency replacement passport through lawful official procedures after a verified loss.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player} receives a replacement passport after losing the original.
- The document problem ends with official travel papers restored.
- {team} can resume {player}'s travel arrangements after the replacement.

### `travel.hotel_double_booking`

**Trigger:** Hotel acknowledges a team booking error and the club relocates the traveling party.

**Placeholders:** `{team}`

**Media examples:**

- {team} change hotels after an acknowledged booking error.
- The confirmed rooms are not available; the staff arrange another base.
- The road trip acquires one more road: the route to another hotel.

### `travel.altitude_acclimation`

**Trigger:** Team completes a planned acclimation stay ahead of an officially designated high-altitude venue.

**Placeholders:** `{team}`, `{arena}`, `{coach}`

**Media examples:**

- {team} complete their acclimation stay before {arena}'s game.
- The travel plan includes preparation for the venue's altitude.
- {coach}'s schedule gives {team} a verified adaptation window.

### `travel.border_entry_denied`

**Trigger:** Border authority formally denies lawful entry for a stated administrative reason; no crime or deportation is assumed.

**Placeholders:** `{player}`, `{reason}`, `{team}`

**Media examples:**

- {player}'s entry is denied over {reason}.
- The official border decision prevents {player} joining {team}'s trip.
- Administrative entry requirements stop the journey at this checkpoint.

### `travel.storm_shelter`

**Trigger:** Authorities direct the team to shelter during travel due to a verified severe-weather alert.

**Placeholders:** `{team}`

**Media examples:**

- {team} shelter under the official weather directive.
- The trip pauses while the alert remains active.
- Basketball travel waits for the safety authority's all-clear.

### `travel.bus_repair_good_samaritan`

**Trigger:** Team bus suffers a verified mechanical breakdown and a local licensed operator provides an authorized replacement.

**Placeholders:** `{team}`

**Media examples:**

- A local operator gets {team} moving after the bus breakdown.
- The replacement vehicle keeps the verified road trip alive.
- The bus stops, the local replacement arrives, and {team} get moving again.

### `travel.time_zone_schedule_error`

**Trigger:** Staff acknowledge a time-zone scheduling error that causes a missed mandatory team appointment.

**Placeholders:** `{team}`, `{appointment}`

**Media examples:**

- {team} miss {appointment} after a time-zone mix-up.
- The itinerary and the local clock disagree. {team} miss the appointment.
- Staff confirm the scheduling error behind the missed appointment.

### `travel.neutral_site_reschedule`

**Trigger:** League moves a game to a verified neutral venue because the original venue becomes unavailable.

**Placeholders:** `{team}`, `{opp}`, `{arena}`

**Media examples:**

- {team} and {opp} move their game to {arena}.
- The original venue falls through; a neutral court takes its place.
- The revised fixture has a confirmed home at {arena}.

## 18. 18. Coaching, assistants, and staff careers

### `staff.assistant_head_interim`

**Trigger:** An assistant receives an officially temporary head-coaching appointment while the permanent coach is on approved leave.

**Placeholders:** `{coach}`, `{team}`

**Media examples:**

- {coach} takes interim charge of {team}.
- The temporary appointment covers the head coach's approved absence.
- {team} confirm the interim bench arrangement.

### `staff.player_coach_contract`

**Trigger:** Competition rules permit and club signs an explicit player-coach agreement, with duties publicly defined.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player} signs a permitted player-coach agreement with {team}.
- {player} now has to prepare for the huddle and the minutes after it.
- {team} formalize the dual role under the active competition rules.

### `staff.coaching_tree_final`

**Trigger:** Two coaches with a verified former supervisor-assistant relationship meet in a championship series.

**Placeholders:** `{coach}`, `{mentor}`, `{competition}`

**Media examples:**

- {coach} faces former mentor {mentor} in {competition}'s final.
- The coaching tree splits across the championship sidelines.
- A documented bench partnership becomes the final's coaching matchup.

### `staff.playbook_stolen_verified`

**Trigger:** An independent review verifies unauthorized copying of confidential team strategy documents, without identifying an unproven perpetrator.

**Placeholders:** `{team}`

**Media examples:**

- A review confirms {team}'s confidential playbook was copied without authorization.
- The document breach is verified; individual responsibility requires separate findings.
- {team} replace compromised strategy material after the review.

### `staff.interpreter_hired`

**Trigger:** Club formally hires a qualified interpreter for team communication.

**Placeholders:** `{team}`, `{staff}`, `{coach}`

**Media examples:**

- {team} hire {staff} as a qualified interpreter.
- Team instructions gain a dedicated language bridge.
- {coach}'s meetings add verified communication support.

### `staff.scout_false_report`

**Trigger:** Club audit substantiates that a scouting report contained fabricated observations and withdraws the report.

**Placeholders:** `{team}`, `{gm}`

**Media examples:**

- {team} withdraw a scouting report after verified fabrication.
- The audit finds invented observations in the evaluation file.
- {gm} remove the false report from {team}'s decision process.

### `staff.scout_hidden_gem_validation`

**Trigger:** An overlooked player identified by a logged scouting recommendation earns a roster role and meets a predeclared performance threshold.

**Placeholders:** `{scout}`, `{team}`, `{player}`

**Media examples:**

- {scout}'s logged recommendation pays off for {team}.
- {player} meets the benchmark that tests the scouting call.
- The overlooked recruit turns {scout}'s written projection into measured value.

### `staff.qualified_medical_hire`

**Trigger:** Club hires a licensed medical professional into a newly created role after verifying credentials.

**Placeholders:** `{team}`, `{staff}`

**Media examples:**

- {team} add {staff} to a new licensed medical role.
- The verified appointment expands the club's care capacity.
- A new staff position becomes an actual hire for {team}.

### `staff.coach_delegates_timeout`

**Trigger:** Head coach formally delegates a timeout huddle to an assistant and the team runs that assistant's documented set.

**Placeholders:** `{coach}`, `{team}`, `{assistant}`

**Media examples:**

- {coach} hands {team}'s timeout huddle to {assistant}.
- The assistant's recorded set comes out of the break.
- {coach} gives the huddle away; {assistant}'s set comes out onto the floor.

### `staff.staff_payroll_missed`

**Trigger:** Club payroll records confirm nonplayer staff have not received wages by the contractual date.

**Placeholders:** `{team}`

**Media examples:**

- {team} miss the contractual staff payroll date.
- The club's records confirm overdue wages to nonplayer employees.
- The employment obligation is unpaid; the balance is documented.

## 19. 19. Ownership, facilities, and club business

### `owner.sale_closed`

**Trigger:** A club sale receives all required approvals and ownership transfer legally closes.

**Placeholders:** `{owner}`, `{team}`

**Media examples:**

- {owner} complete the purchase of {team}.
- The approved sale closes and transfers the club.
- The signatures settle it: {owner} now owns {team}.

### `owner.fan_share_launch`

**Trigger:** Club legally launches a regulated supporter-share offering after required disclosures and approvals.

**Placeholders:** `{team}`

**Media examples:**

- {team} launch an approved supporter-share offering.
- Fans can review the published ownership terms.
- The club's legal structure opens a documented route to supporter participation.

### `owner.arena_debt_refinance`

**Trigger:** Club completes a verified refinancing of arena debt and publishes the new repayment terms.

**Placeholders:** `{team}`, `{arena}`, `{owner}`

**Media examples:**

- {team} refinance {arena}'s debt under the confirmed agreement.
- The stadium balance receives a new repayment schedule.
- {owner} close the arena financing transaction.

### `owner.facility_upgrade_complete`

**Trigger:** A training facility upgrade passes operational inspection and opens for team use.

**Placeholders:** `{team}`, `{coach}`

**Media examples:**

- {team} open the inspected training upgrade.
- The upgrade leaves the renderings behind and opens to {team}'s players.
- {coach}'s sessions move into the completed space.

### `owner.training_project_cancelled`

**Trigger:** Club officially cancels a planned facility project after a verified funding failure.

**Placeholders:** `{team}`, `{owner}`

**Media examples:**

- {team} cancel the facility project after funding falls through.
- The construction plan ends before the upgrade opens.
- {owner} confirm the financing failure behind the canceled project.

### `owner.concession_price_cut`

**Trigger:** Club implements a published price reduction for arena concessions, with actual sales prices verified.

**Placeholders:** `{arena}`, `{team}`

**Media examples:**

- {arena} put the announced concession price cuts into effect.
- {team}'s supporters meet the lower prices at the counter.
- {team}'s supporters find the promised lower prices on the actual menu.

### `owner.community_ownership_vote`

**Trigger:** Eligible supporters approve a legally permitted community-ownership conversion in a certified vote.

**Placeholders:** `{team}`, `{city}`

**Media examples:**

- {team}'s supporters approve community ownership.
- The certified vote clears the proposed governance conversion.
- {city}'s club gains a voter-approved ownership direction.

### `owner.succession_plan_activated`

**Trigger:** A previously documented club ownership succession plan takes effect after an approved transfer of control.

**Placeholders:** `{team}`, `{owner}`

**Media examples:**

- {team} activate the approved succession plan.
- Control passes under the previously documented arrangement.
- {owner} take the role defined in the club's succession agreement.

### `owner.insolvency_administration`

**Trigger:** A competent commercial court places the club into formal administration or equivalent; continued fixtures depend on explicit league permission.

**Placeholders:** `{team}`, `{city}`

**Media examples:**

- {team} enter court-supervised administration.
- A formal insolvency process takes control of the club's finances.
- {city}'s team face a court-managed restructuring, with fixtures separately reviewed.

### `owner.employees_buyout`

**Trigger:** Employees complete a legally approved purchase of a controlling club stake.

**Placeholders:** `{team}`

**Media examples:**

- {team}'s employees complete the controlling-stake buyout.
- The workers become the club's approved controlling owners.
- The people who work for {team} now control the club they keep running.

## 20. 20. League integrity and competitive interventions

### `integrity.suspicion_threshold`

**Trigger:** With integrity enabled, documented commissioner-account records cross a suspicion threshold from roster edits or forced transactions; no wrongdoing is yet established.

**Placeholders:** `{team}`

**Media examples:**

- {team}'s recorded alterations trigger an integrity warning.
- The warning flags unusual changes without deciding a violation.
- A documented suspicion threshold puts {team}'s roster under closer review.

### `integrity.owners_complaint_filed`

**Trigger:** Multiple owners file a formally recorded complaint alleging competitive distortion, without an official finding.

**Placeholders:** `{team}`

**Media examples:**

- Owners file a competitive-balance complaint concerning {team}.
- The filing alleges distortion; the league has not ruled on it.
- {team} face a recorded owner complaint rather than a proven violation.

### `integrity.trade_veto`

**Trigger:** League officially vetoes a completed or pending transaction under a cited competition rule.

**Placeholders:** `{team}`, `{opp}`, `{rule}`, `{player}`

**Media examples:**

- League vetoes {team}'s proposed transaction with {opp}.
- The official decision blocks the deal under {rule}.
- {player}'s planned move cannot proceed after the veto.

### `integrity.draft_picks_forfeited`

**Trigger:** A final disciplinary finding removes specified future draft selections from a club.

**Placeholders:** `{team}`, `{picks}`

**Media examples:**

- {team} forfeit {picks} after a final integrity ruling.
- The confirmed penalty reaches beyond this season's roster.
- {team}'s future draft board has {picks} missing from it.

### `integrity.roster_remediation_order`

**Trigger:** A final league ruling requires a club to remove illegally registered players or undo illegal roster changes by a deadline.

**Placeholders:** `{team}`, `{deadline}`, `{gm}`

**Media examples:**

- {team} receive a roster-remediation order due by {deadline}.
- The final ruling requires the illegal registrations to be corrected.
- {gm} must repair the roster under the published league order.

### `integrity.union_formal_protest`

**Trigger:** Player union files an official protest against a specific integrity remedy; no strike or lockout is assumed.

**Placeholders:** `{remedy}`

**Media examples:**

- The union formally protests {remedy}.
- Players contest the league's response through the recorded process.
- The remedy faces a filed union objection rather than a work stoppage.

### `integrity.season_shortened`

**Trigger:** Governing parties ratify a shortened season schedule after a verified labor or integrity disruption.

**Placeholders:** `{games}`, `{season}`

**Media examples:**

- League ratifies a {games}-game season after the disruption.
- The revised schedule replaces the abandoned full-length calendar.
- {season} will finish under the confirmed shortened format.

### `integrity.season_cancelled`

**Trigger:** Governing authority formally cancels the remainder of a season and specifies whether any championship is awarded.

**Placeholders:** `{season}`

**Media examples:**

- League cancels the remainder of {season}.
- The official decision ends the schedule before its planned finish.
- Clubs receive the published cancellation terms for {season}.

### `integrity.cba_ratified`

**Trigger:** League and player representatives ratify a new collective bargaining agreement after negotiations.

**Placeholders:** `{season}`

**Media examples:**

- League and union ratify the new collective agreement.
- The signed labor deal establishes the next competition framework.
- {season}'s operating terms move into a formally approved agreement.

### `integrity.sandbox_exemption`

**Trigger:** User explicitly enables Sandbox with integrity enforcement off, and a normally restricted edit is accepted under that setting.

**Placeholders:** `{team}`, `{change}`

**Media examples:**

- Sandbox accepts {team}'s edit with integrity enforcement disabled.
- The configured exemption permits {change} in this save.
- {team}'s experiment proceeds under the declared Sandbox rules.

## 21. 21. Historical eras and technological transitions

### `history.three_point_line_debut`

**Trigger:** A league plays its first official game under a newly adopted three-point rule; era and competition availability verified.

**Placeholders:** `{league}`

**Media examples:**

- {league} play their first game with the three-point line.
- A new scoring boundary enters the official scorebook.
- The perimeter acquires a different value in {league}.

### `history.shot_clock_first_game`

**Trigger:** Competition plays its first officially timed game after adopting a shot clock.

**Placeholders:** `{league}`, `{competition}`

**Media examples:**

- {league} begin the shot-clock era.
- Possession now has a measured deadline in {competition}.
- The new clock changes the conditions of the opening fixture.

### `history.televised_first_game`

**Trigger:** An era-appropriate broadcaster airs the club's first officially televised game.

**Placeholders:** `{team}`, `{arena}`

**Media examples:**

- {team}'s game reaches television for the first time.
- The approved broadcast brings {arena}'s contest into viewers' homes.
- A new medium carries {team}'s basketball beyond the seats.

### `history.radio_call_debut`

**Trigger:** Fictional station airs the club's first live radio commentary with confirmed rights.

**Placeholders:** `{station}`, `{team}`, `{arena}`

**Media examples:**

- {station} carry {team}'s first live radio call.
- Listeners follow the contest through the new authorized broadcast.
- The action at {arena} now reaches supporters who cannot take a seat.

### `history.integrated_team_debut`

**Trigger:** A historically modeled discriminatory registration barrier is officially removed and a qualified player previously excluded under it debuts; no protected identity is exposed unless explicitly supplied and consented.

**Placeholders:** `{player}`, `{league}`, `{team}`

**Media examples:**

- {player} debuts after {league} remove the exclusionary rule.
- A discriminatory barrier ends; the qualified player takes the floor.
- {team}'s lineup reflects the formally changed eligibility policy.

### `history.minimum_wage_first_contract`

**Trigger:** Era-specific collective agreement first establishes a minimum salary and a player's contract is formally adjusted to it.

**Placeholders:** `{player}`, `{league}`, `{team}`

**Media examples:**

- {player}'s contract reaches {league}'s new minimum salary.
- The labor agreement creates a floor beneath the player's pay.
- {team} make the first required minimum-salary adjustment.

### `history.neutral_barn_game`

**Trigger:** Era-appropriate venue records explicitly locate an official game in a converted agricultural building approved for play.

**Placeholders:** `{team}`, `{opp}`, `{arena}`

**Media examples:**

- {team} meet {opp} in the approved converted hall.
- The inspected venue supplies an unusual setting for the fixture.
- The traveling contest brings official basketball to {arena}.

### `history.computer_scouting_first`

**Trigger:** Club adopts its first computer-assisted scouting system in an era where that technology is available.

**Placeholders:** `{team}`, `{gm}`

**Media examples:**

- {team} introduce their first computer-assisted scouting system.
- The scouting office adds a new method to its existing reports.
- {gm} approve the club's first digital evaluation workflow.

### `history.hand_check_rule_first`

**Trigger:** First official game under a changed hand-contact enforcement standard records the new calls; this is execution, not a generic rule opinion.

**Placeholders:** `{team}`, `{calls}`, `{arena}`, `{coach}`

**Media examples:**

- {team}'s first game under the new contact standard records {calls} calls.
- The written enforcement change reaches the whistle at {arena}.
- {coach} gets the first measured sample of the new standard.

### `history.merger_club_admission`

**Trigger:** Two fictional leagues legally merge and a formerly separate club plays its first fixture in the combined competition.

**Placeholders:** `{team}`, `{league}`

**Media examples:**

- {team} make their debut in the merged {league}.
- The merger moves from signatures to the official schedule.
- The old league boundary disappears from {team}'s new fixture list.

## 22. 22. Relocation, expansion, branding, and civic choices

### `relocate.move_approved`

**Trigger:** Club receives all required governing approvals for a permanent move to a specified city.

**Placeholders:** `{team}`, `{city}`

**Media examples:**

- {team}'s move to {city} receives final approval.
- The relocation proposal becomes an authorized plan.
- The required votes clear {team}'s new city destination.

### `relocate.vote_rejected`

**Trigger:** A governing vote formally rejects a proposed relocation and requires the club to remain for the stated term.

**Placeholders:** `{team}`, `{city}`

**Media examples:**

- The relocation vote keeps {team} in {city}.
- The proposed move fails at the official decision.
- {team} remain under the confirmed stay requirement.

### `relocate.new_city_first_home`

**Trigger:** Relocated club completes its first home game in its new city.

**Placeholders:** `{team}`, `{city}`, `{arena}`

**Media examples:**

- {team} play their first home game in {city}.
- The new arena schedule begins with an official fixture.
- {arena} becomes {team}'s actual home court.

### `relocate.old_city_exhibition`

**Trigger:** A relocated club returns to its previous city for a formally agreed exhibition.

**Placeholders:** `{team}`, `{oldcity}`

**Media examples:**

- {team} return to {oldcity} for the agreed exhibition.
- The visit reconnects the club with its previous home.
- The team come back for a night; {oldcity} get the agreed return visit.

### `relocate.expansion_franchise_awarded`

**Trigger:** Governing authority awards a new franchise after a completed application and approval process.

**Placeholders:** `{city}`, `{league}`

**Media examples:**

- {city} receive an approved expansion franchise.
- The application clears the league's final vote.
- {league}'s next roster of clubs includes a new city.

### `relocate.expansion_draft_complete`

**Trigger:** Expansion club completes its permitted selection draft under the published protection rules.

**Placeholders:** `{team}`, `{gm}`

**Media examples:**

- {team} complete their expansion selections.
- The protection lists give way to an actual opening roster.
- {gm} finish the draft that builds {team}'s first squad.

### `relocate.rebrand_approved`

**Trigger:** Existing club legally approves and publicly launches a new name or identity without moving cities.

**Placeholders:** `{team}`, `{city}`

**Media examples:**

- {team} launch their approved new identity in {city}.
- The club's name changes while its home city remains.
- The approved rebrand reaches uniforms and official records.

### `relocate.jersey_number_conflict`

**Trigger:** Two incoming players request the same unavailable number and resolve the conflict through a documented agreement.

**Placeholders:** `{player}`, `{teammate}`, `{team}`

**Media examples:**

- {player} and {teammate} settle {team}'s jersey-number conflict.
- The agreed allocation ends the duplicate-number request.
- {team} publish the resolved numbers before registration.

### `relocate.name_vote_result`

**Trigger:** Club holds an authorized supporter vote on a shortlist and certifies the winning identity.

**Placeholders:** `{identity}`, `{team}`

**Media examples:**

- Supporters choose {identity} in {team}'s certified name vote.
- The published count settles the club's naming shortlist.
- A supporter ballot gives the new identity its official selection.

### `relocate.arena_groundbreaking`

**Trigger:** Fully approved and financed arena construction actually begins, with permits and funding confirmed.

**Placeholders:** `{team}`, `{city}`, `{arena}`

**Media examples:**

- Work begins on {team}'s approved new arena in {city}.
- {team}'s new home finally moves past the drawing board.
- Permits and financing turn {arena} from a drawing into a building site.

## 23. 23. Comebacks, interrupted careers, and new chapters

### `comeback.release_from_service`

**Trigger:** Player completes a lawful public-service or military obligation and re-registers after league eligibility review.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player} re-registers with {team} after completing his service.
- The official obligation ends and the basketball route reopens.
- {team} receive clearance for his post-service return.

### `comeback.after_care_leave_first_game`

**Trigger:** Player completes his first game after approved caregiving leave and consented public return announcement.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player} returns to competition after caregiving leave.
- Family leave gives way to a completed appearance for {team}.
- The comeback is a game played, with the care commitment still respected.

### `comeback.after_medical_emergency_first_game`

**Trigger:** Player makes a completed competitive appearance after a prior medical emergency and independent clearance.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player} completes his first game after the medical emergency.
- The return follows independent clearance and the agreed plan.
- {team} welcome an actual appearance after the long care journey.

### `comeback.amateur_status_return`

**Trigger:** Governing body formally restores amateur eligibility where the rules permit, following prior professional participation.

**Placeholders:** `{player}`

**Media examples:**

- {player} receives restored amateur eligibility.
- The applicable federation opens a permitted competition route.
- The status change is official, with future appearances still to come.

### `comeback.career_gap_paid_trial`

**Trigger:** Player receives a paid trial after a verified multiyear career gap, without a full-season contract.

**Placeholders:** `{team}`, `{player}`, `{years}`

**Media examples:**

- {team} offer {player} a paid trial after {years} away.
- {player} gets a paid chance to answer what {years} away have changed.
- {player} gets paid time to prove his basketball return.

### `comeback.return_trial_passed`

**Trigger:** Previously issued comeback trial concludes with a formal roster contract after the player meets its stated conditions.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player} passes the return trial and earns {team}'s contract.
- The audition ends with a place on the roster.
- The audition is over. {player} has a roster place again.

### `comeback.return_trial_failed`

**Trigger:** A previously issued comeback trial concludes without a contract after documented unmet sporting requirements.

**Placeholders:** `{team}`, `{player}`

**Media examples:**

- {team} end {player}'s return trial without a contract.
- The assessment does not meet the stated roster requirements.
- This door closes for {player}; the comeback has not found a contract here.

### `comeback.second_sport_debut`

**Trigger:** Player obtains clearance and competes officially in a different sport under its registration rules.

**Placeholders:** `{player}`, `{sport}`

**Media examples:**

- {player} makes an official debut in {sport}.
- A cleared registration turns the second-sport plan into competition.
- The new scorebook records {player}'s first appearance.

### `comeback.education_gap_return`

**Trigger:** Player returns to professional competition after a documented career pause to complete education, without retirement.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player} returns to {team} after the education break.
- The completed course gives way to a new competitive appearance.
- His basketball pause ends with the academic objective met.

### `comeback.probation_roster_offer`

**Trigger:** League grants conditional sporting eligibility after a prior exclusion and club offers a contract containing published behavioral conditions.

**Placeholders:** `{team}`, `{player}`, `{conditions}`

**Media examples:**

- {team} offer {player} a conditional return contract.
- The league clearance carries {conditions} into the roster agreement.
- A new opportunity comes with the documented requirements attached.

## 24. 24. Chaotic builds, Sandbox, and custom experiments

### `experiment.eight_foot_build`

**Trigger:** User selects a build at least eight feet tall with unrestricted builder enabled; simulation accepts it and records explicit physical tradeoffs or Sandbox override.

**Placeholders:** `{player}`, `{height}`, `{tradeoffs}`

**Media examples:**

- {player}'s {height} build enters the custom simulation.
- The configured builder accepts the unusual frame with {tradeoffs}.
- The custom roster lists {player} at {height}. The experiment is about to meet a schedule.

### `experiment.minimum_height_build`

**Trigger:** User chooses height below realistic preset bounds with unrestricted builder enabled and simulated reach/mobility consequences explicitly recorded.

**Placeholders:** `{player}`, `{height}`, `{tradeoffs}`, `{team}`

**Media examples:**

- {player}'s {height} build tests the lower end of the custom builder.
- The simulation records {tradeoffs} for the selected frame.
- {team} enter the experiment with the reach and mobility settings declared.

### `experiment.zero_cap`

**Trigger:** User explicitly sets the salary cap to zero in a custom league and selects an exemption policy that makes roster registration valid.

**Placeholders:** `{league}`, `{policy}`, `{team}`

**Media examples:**

- {league} begin with a zero cap and {policy}.
- The unusual budget setting operates under the selected exemption policy.
- {team}'s registration follows the declared zero-cap framework.

### `experiment.no_cap_budget_shortfall`

**Trigger:** No-cap league permits legal signings but verified cash payroll exceeds available owner funding.

**Placeholders:** `{team}`, `{amount}`

**Media examples:**

- {team}'s legal no-cap payroll exceeds their cash funding.
- Removing the ceiling does not supply the bank balance.
- No salary ceiling, but still a cash shortage: {team} face a {amount} funding gap.

### `experiment.four_point_make`

**Trigger:** Active custom rules include a four-point line and an official game records the player's first qualifying make.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player} makes his first four-point basket for {team}.
- The custom boundary turns that made shot into four.
- {team}'s scorebook records the new line in action.

### `experiment.cross_era_lineup`

**Trigger:** Custom all-era draft is enabled and a legally registered lineup fields players from at least four distinct source eras together.

**Placeholders:** `{team}`, `{eras}`

**Media examples:**

- {team} field a lineup drawn from {eras} source eras.
- Four source eras share one huddle for {team}. The custom adjustment rules do the translation.
- The declared era-adjustment model governs {team}'s mixed lineup.

### `experiment.clone_roster`

**Trigger:** Sandbox explicitly permits duplicated player identities and a registered lineup contains multiple instances of the same fictional player.

**Placeholders:** `{copies}`, `{player}`, `{team}`

**Media examples:**

- Sandbox fields {copies} versions of {player} for {team}.
- The duplicate-identity setting makes the impossible lineup intentional.
- {team}'s Sandbox huddle has {copies} copies of the same answer.

### `experiment.no_three_point_points`

**Trigger:** Custom rules remove the three-point bonus and an official formerly three-point-distance shot is correctly credited as two.

**Placeholders:** `{player}`, `{league}`, `{team}`

**Media examples:**

- {player}'s long-range make counts for two under {league}'s custom rules.
- The shot is still long. Its scoreboard reward is now two.
- {team}'s official score follows the no-three-point setting.

### `experiment.no_foul_limit`

**Trigger:** Sandbox removes foul-out limits and a player remains eligible after exceeding the normal foul threshold.

**Placeholders:** `{player}`, `{fouls}`, `{team}`

**Media examples:**

- {player} stays in after {fouls} fouls under the custom limit setting.
- The Sandbox eligibility rule keeps him available to {team}.
- The foul total climbs while the declared exemption preserves his place.

### `experiment.user_rating_edit_first_game`

**Trigger:** User visibly edits a player's rating, declares integrity setting, and the first post-edit game completes; no performance outcome is assumed.

**Placeholders:** `{player}`, `{rating}`, `{team}`

**Media examples:**

- {player} completes his first game after the declared {rating} edit.
- The custom adjustment reaches an actual simulated appearance.
- {team}'s game record now has a clear before-and-after boundary.

## 25. 25. Criminal adjudication, defense, and appeal outcomes

### `legal.trial_opened`

**Trigger:** A competent court formally opens the player's criminal trial on filed charges; no verdict exists.

**Placeholders:** `{player}`, `{jurisdiction}`

**Media examples:**

- {player}'s trial opens in {jurisdiction}.
- The court begins hearing the charged case, with guilt undecided.
- Evidence will be tested at {player}'s formal trial.

### `legal.charges_dismissed`

**Trigger:** Court or authorized prosecutor formally dismisses all specified pending charges; dismissal grounds are recorded and no factual exoneration is presumed.

**Placeholders:** `{player}`, `{case}`, `{grounds}`

**Media examples:**

- {player}'s {case} charges are dismissed.
- The case ends on {grounds}; the ruling's stated limits still matter.
- The pending charges are no longer active against {player}.

### `legal.acquitted`

**Trigger:** A competent tribunal returns a not-guilty verdict on every charge in the specified case.

**Placeholders:** `{player}`, `{case}`

**Media examples:**

- {player} is acquitted in {case}.
- The court returns a not-guilty verdict after the trial.
- {player}'s charged case ends in acquittal.

### `legal.convicted`

**Trigger:** A competent tribunal finds the player guilty of a specified offense; sentencing has not yet occurred.

**Placeholders:** `{player}`, `{offense}`

**Media examples:**

- Court finds {player} guilty of {offense}.
- The verdict is entered; sentencing remains a separate stage.
- {player}'s case reaches a conviction on the recorded offense.

### `legal.mixed_verdict`

**Trigger:** Court returns a formally recorded mixture of guilty and not-guilty findings across separate counts.

**Placeholders:** `{player}`, `{guiltycounts}`, `{clearedcounts}`

**Media examples:**

- {player}'s trial ends with a mixed verdict.
- The court convicts on {guiltycounts} and acquits on {clearedcounts}.
- Each count has its own outcome in {player}'s final verdict.

### `legal.plea_accepted`

**Trigger:** Court formally accepts a documented guilty plea to a specified offense; agreed sentence terms remain subject to the court's actual order.

**Placeholders:** `{player}`, `{offense}`

**Media examples:**

- Court accepts {player}'s guilty plea to {offense}.
- The accepted plea resolves the admitted count.
- {player}'s sentencing will follow the court's actual order.

### `legal.mistrial_declared`

**Trigger:** Court formally declares a mistrial and records whether a retrial is pending; no conviction or acquittal results from this event.

**Placeholders:** `{player}`, `{retrialstatus}`

**Media examples:**

- Court declares a mistrial in {player}'s case.
- The trial ends without a verdict; {retrialstatus}.
- Neither conviction nor acquittal follows this interrupted proceeding.

### `legal.conviction_appeal_filed`

**Trigger:** Player formally files a permitted appeal against an existing conviction; the conviction's current legal status is explicitly retained.

**Placeholders:** `{player}`

**Media examples:**

- {player} files an appeal against his conviction.
- The appeal is registered; it has not reversed the verdict.
- The existing judgment faces review through the permitted court process.

### `legal.conviction_overturned`

**Trigger:** Appellate court formally vacates the player's conviction and records whether charges remain or a retrial is ordered.

**Placeholders:** `{player}`, `{nextstep}`

**Media examples:**

- Appeal court overturns {player}'s conviction.
- The judgment is vacated; {nextstep}.
- {player}'s legal status changes under the appellate ruling.

### `legal.conviction_upheld`

**Trigger:** Appellate court formally affirms the specified conviction; no claim about further appeals is implied.

**Placeholders:** `{player}`, `{offense}`

**Media examples:**

- Appeal court upholds {player}'s conviction for {offense}.
- The reviewed judgment remains in force.
- This appeal ends without changing the recorded conviction.

## 26. 26. Civil disputes, contracts, family law, and rights

### `civil.agent_commission_suit`

**Trigger:** Player files a civil claim contesting a specific agent commission under a signed agreement; liability is unresolved.

**Placeholders:** `{player}`, `{amount}`

**Media examples:**

- {player} files a civil claim over {amount} in disputed commission.
- The agent-fee disagreement enters court with liability undecided.
- The filed claim asks the court to interpret the signed commission terms.

### `civil.contract_breach_judgment`

**Trigger:** Civil court finds a club breached a specified player contract and orders a documented remedy.

**Placeholders:** `{team}`, `{player}`, `{remedy}`

**Media examples:**

- Court finds {team} breached {player}'s contract.
- The judgment awards {remedy} under the proved contractual claim.
- {player} receives a civil ruling on the club's recorded obligations.

### `civil.wrongful_termination_claim`

**Trigger:** Player files a lawful civil or labor claim alleging wrongful contract termination; no merits finding exists.

**Placeholders:** `{player}`, `{tribunal}`, `{team}`

**Media examples:**

- {player} challenges his contract termination through {tribunal}.
- The filed claim alleges unlawful dismissal; the issue is unresolved.
- {team} receive formal notice of {player}'s employment challenge.

### `civil.business_partner_settlement`

**Trigger:** Player and business partner execute a civil settlement over a recorded dispute; no admission of wrongdoing is assumed unless expressly included.

**Placeholders:** `{player}`, `{partner}`, `{business}`

**Media examples:**

- {player} and {partner} settle their {business} dispute.
- The signed agreement resolves the civil case on its recorded terms.
- The partnership conflict ends with a negotiated settlement.

### `civil.defamation_judgment`

**Trigger:** Court finds a specific publication unlawfully defamatory under applicable jurisdiction and awards the stated remedy.

**Placeholders:** `{publication}`, `{player}`, `{remedy}`

**Media examples:**

- Court rules {publication}'s statement about {player} defamatory.
- The judgment awards {remedy} under the applicable law.
- The challenged statement receives a civil finding, not merely a disagreement.

### `civil.image_rights_injunction`

**Trigger:** Court orders an identified unauthorized commercial use of the player's image stopped under applicable rights law.

**Placeholders:** `{player}`, `{use}`

**Media examples:**

- Court halts the unauthorized commercial use of {player}'s image.
- The injunction applies to {use}, as specified in the order.
- {player}'s image-rights claim produces a binding restriction.

### `civil.tenancy_deposit_ruling`

**Trigger:** Housing tribunal decides a documented rental-deposit dispute involving the player and orders a specific return or deduction.

**Placeholders:** `{tribunal}`, `{player}`, `{outcome}`

**Media examples:**

- {tribunal} resolve {player}'s rental-deposit dispute.
- The housing ruling orders {outcome} for the recorded deposit.
- {player}'s tenancy case ends with a defined financial decision.

### `civil.custody_schedule_order`

**Trigger:** Family court issues a lawful parenting schedule and player consents to announcing availability changes without identifying a child.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player}'s availability adjusts to a court-approved parenting schedule.
- The announced basketball dates follow the family court's order.
- {team} receive scheduling facts while the child's details stay private.

### `civil.support_obligation_modified`

**Trigger:** Family court lawfully modifies a documented support obligation after a recorded financial change; sensitive amounts may be kept private.

**Placeholders:** `{player}`

**Media examples:**

- Court modifies {player}'s support obligation under the new order.
- The financial duty changes through the legal review process.
- The revised obligation replaces the previous court-approved terms.

### `civil.inheritance_dispute_resolved`

**Trigger:** Probate court resolves a documented inheritance dispute involving the player without requiring a new bereavement event.

**Placeholders:** `{player}`, `{outcome}`

**Media examples:**

- {player}'s inheritance dispute reaches a probate ruling.
- The court orders {outcome} for the contested estate issue.
- The recorded dispute ends with a lawful distribution decision.

## 27. 27. Sentencing, restitution, legal recovery, and clearance

### `legal.sentence_entered`

**Trigger:** Court issues an actual sentence after a conviction, with jurisdiction-specific terms supplied exactly.

**Placeholders:** `{player}`, `{sentence}`, `{offense}`

**Media examples:**

- Court sentences {player} to {sentence} for {offense}.
- The entered order defines the consequence of the conviction.
- {player}'s legal case moves from verdict to the recorded sentence.

### `legal.community_service_complete`

**Trigger:** Authorized supervising body certifies completion of court-ordered community service.

**Placeholders:** `{player}`, `{hours}`

**Media examples:**

- {player} completes the ordered {hours} hours of community service.
- The supervising body certifies the work requirement is satisfied.
- A documented sentence obligation is complete; other duties remain separately tracked.

### `legal.restitution_paid`

**Trigger:** Court or authorized recipient confirms full payment of a specified restitution order.

**Placeholders:** `{player}`, `{amount}`

**Media examples:**

- {player} pays the ordered {amount} in restitution.
- The confirmed payment settles that compensation obligation.
- The restitution ledger closes after receipt of the full amount.

### `legal.probation_completed`

**Trigger:** Court or authorized supervisor formally discharges the player after completion of probation requirements.

**Placeholders:** `{player}`

**Media examples:**

- {player} completes probation under the court's discharge order.
- The supervising authority confirms the required term is finished.
- That legal supervision ends with the formal completion decision.

### `legal.diversion_completed`

**Trigger:** Player completes a jurisdiction-permitted diversion program and receives its explicitly recorded disposition.

**Placeholders:** `{player}`, `{disposition}`

**Media examples:**

- {player} completes the court-approved diversion program.
- The recorded disposition is {disposition}, as confirmed by the authority.
- Program completion changes the case only to the extent stated in the order.

### `legal.records_sealed`

**Trigger:** Competent authority seals eligible records under applicable law; historical facts are not erased or publicly re-disclosed.

**Placeholders:** `{player}`, `{jurisdiction}`

**Media examples:**

- {player}'s eligible legal records are sealed.
- The authority grants the application under {jurisdiction}'s rules.
- Access to the specified records changes under the formal order.

### `legal.asset_freeze_lifted`

**Trigger:** Court formally lifts a previously imposed freeze on specific player assets after the recorded legal basis ends.

**Placeholders:** `{player}`

**Media examples:**

- Court lifts the freeze on {player}'s specified assets.
- The new order restores control of the identified accounts.
- {player}'s financial access changes after the freeze is removed.

### `legal.court_date_game_leave`

**Trigger:** Court requires attendance on a game date and club grants a documented leave; no guilt assumption or sporting suspension.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player} receives leave for a required court appearance.
- The legal attendance order conflicts with {team}'s game.
- A mandatory hearing changes availability without deciding the case.

### `legal.civil_damages_recovered`

**Trigger:** Player receives actual payment of a civil damages award against another party, after enforceable judgment.

**Placeholders:** `{player}`, `{amount}`

**Media examples:**

- {player} collects the awarded {amount} in civil damages.
- The judgment becomes an actual recovered payment.
- The civil remedy reaches {player}'s account after enforcement.

### `legal.league_clearance_after_case`

**Trigger:** League formally reinstates sporting eligibility after reviewing a concluded legal case under its own policy; court outcome alone does not trigger it.

**Placeholders:** `{league}`, `{player}`, `{team}`

**Media examples:**

- {league} restore {player}'s sporting eligibility.
- The league's separate review ends with explicit clearance.
- {team} can register {player} under the confirmed eligibility decision.

## 28. 28. Integrity safeguards, appeals, and custom governance

### `integrity.whistleblower_protected`

**Trigger:** League accepts a documented whistleblower report and formally grants its published anti-retaliation protections.

**Placeholders:** `{league}`

**Media examples:**

- {league} grant protection to an accepted whistleblower.
- The report enters the process under the published safeguard policy.
- Retaliation protections attach to the accepted integrity submission.

### `integrity.audit_no_violation`

**Trigger:** Independent completed audit finds no violation within its explicitly defined roster-edit or transaction scope.

**Placeholders:** `{team}`

**Media examples:**

- Independent audit finds no violation in {team}'s reviewed transactions.
- The published conclusion clears the defined audit scope.
- The review reaches a clean finding without claiming every club action was examined.

### `integrity.evidence_fabrication_exposed`

**Trigger:** Independent review establishes that specific evidence submitted in an integrity case was fabricated and formally withdraws it.

**Placeholders:** `{team}`

**Media examples:**

- Review removes fabricated evidence from {team}'s integrity case.
- The specified material is invalidated after verification.
- The case must proceed without the evidence the review finds false.

### `integrity.sanction_appeal_reduced`

**Trigger:** An authorized appeals panel reduces an existing sporting integrity sanction to a specified replacement.

**Placeholders:** `{team}`, `{penalty}`

**Media examples:**

- Appeals panel reduce {team}'s sanction to {penalty}.
- The original punishment changes under the formal review decision.
- {team} remain subject to the revised sanction, as ordered.

### `integrity.remediation_certified`

**Trigger:** League certifies that a club has completed all requirements of a prior formal roster-remediation order.

**Placeholders:** `{team}`

**Media examples:**

- {team} complete their ordered roster remediation.
- The league certifies the corrected registrations.
- The club closes the published compliance task after verification.

### `integrity.union_arbitration_win`

**Trigger:** Independent labor arbitration finds an integrity remedy violated the collective agreement and orders a specific correction.

**Placeholders:** `{remedy}`, `{correction}`

**Media examples:**

- Arbitrator rules {remedy} breached the collective agreement.
- The binding labor decision orders {correction}.
- The union's challenge produces a verified contractual ruling.

### `integrity.custom_records_separated`

**Trigger:** User activates custom scoring or ratings settings and the record registry officially marks all subsequent records as custom-mode results.

**Placeholders:** `{league}`, `{team}`

**Media examples:**

- {league} separate the custom-mode record book.
- The new settings place future milestones in the declared custom registry.
- {team}'s next milestone gets a custom-rules label attached to its place in history.

### `integrity.emergency_powers_expire`

**Trigger:** A time-limited commissioner authority expires on its recorded date without an approved extension.

**Placeholders:** `{league}`, `{date}`

**Media examples:**

- {league}'s emergency powers expire on {date}.
- The temporary authority ends under its original sunset terms.
- Decisions return to the ordinary governance process after the deadline.

### `integrity.owner_recusal`

**Trigger:** Governing panel formally removes a conflicted owner from a specific decision under its recusal rules.

**Placeholders:** `{owner}`, `{team}`

**Media examples:**

- {owner} is recused from the vote concerning {team}.
- The conflict policy removes the owner from this decision.
- The remaining eligible panel members determine the matter.

### `integrity.sandbox_reenabled_review`

**Trigger:** User turns integrity back on after Sandbox edits and explicitly selects prospective-only enforcement; prior edits are tagged as exempt.

**Placeholders:** `{league}`, `{team}`

**Media examples:**

- {league} resume integrity checks for future actions.
- The chosen policy tags prior Sandbox edits as exempt.
- {team}'s next changes face the reenabled review framework.

## 29. 29. Hobbies, exploration, and calculated personal risks

### `hobby.marathon_finish`

**Trigger:** Player completes an officially timed marathon with team permission where required and a recorded recovery plan.

**Placeholders:** `{player}`, `{time}`, `{team}`

**Media examples:**

- {player} completes the marathon in {time}.
- The sanctioned run adds a verified finish to his offseason.
- {team}'s agreed recovery plan follows the completed race.

### `hobby.mountain_trip_safe`

**Trigger:** Player completes a guided trip within contractual restrictions and returns on time without a recorded incident.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player} completes the approved mountain trip on schedule.
- The planned adventure ends on schedule before {team}'s return date.
- The trip delivers its intended experience without a recorded disruption.

### `hobby.risky_trip_contract_breach`

**Trigger:** Club establishes that a player's dangerous recreational trip breached a specifically signed activity restriction; no injury is required.

**Placeholders:** `{team}`, `{player}`, `{activity}`, `{consequence}`

**Media examples:**

- {team} find {player}'s trip breached his signed activity restriction.
- The contractual issue concerns {activity}, not an assumed injury.
- The club's documented finding triggers {consequence} under the agreement.

### `hobby.chess_tournament_win`

**Trigger:** Player wins a verified organized chess tournament during permitted nonplaying time.

**Placeholders:** `{player}`, `{tournament}`

**Media examples:**

- {player} wins {tournament} away from the basketball court.
- The completed bracket gives him a second kind of victory.
- {player} wins without a dribble: the chess bracket is his.

### `hobby.garden_harvest`

**Trigger:** Player completes a publicly documented community-garden growing season and donates the measured harvest.

**Placeholders:** `{player}`, `{amount}`

**Media examples:**

- {player}'s garden project delivers {amount} of harvested produce.
- The growing season ends with a verified community delivery.
- The offseason work grows into a real harvest for the neighborhood.

### `hobby.pilot_license`

**Trigger:** Player earns a legally recognized pilot license through qualified training; no untrained flight event is implied.

**Placeholders:** `{player}`, `{license}`

**Media examples:**

- {player} earns {license} after certified flight training.
- The aviation authority confirms the new qualification.
- Another completed course gives {player} a lawful new skill.

### `hobby.language_event_host`

**Trigger:** Player uses a completed language qualification to host a verified multilingual fan event.

**Placeholders:** `{player}`, `{event}`, `{language}`

**Media examples:**

- {player} hosts {event} in {language}.
- The studied language becomes part of a completed public appearance.
- Supporters hear {player}'s prepared event in another language.

### `hobby.invention_patent_granted`

**Trigger:** Patent authority grants the player's legitimate application for a specified invention; commercial success not assumed.

**Placeholders:** `{player}`, `{invention}`

**Media examples:**

- {player} receives a patent for {invention}.
- The granted application gives the idea formal legal protection.
- A patent is recorded; a profitable product remains a separate goal.

### `hobby.amateur_cooking_final`

**Trigger:** Player reaches a verified final in a fictional organized cooking competition during an approved offseason window.

**Placeholders:** `{player}`, `{competition}`

**Media examples:**

- {player} reaches the final of {competition}.
- The offseason kitchen produces a verified competitive result.
- His next challenge comes with a recipe instead of a playbook.

### `hobby.long_distance_cycle`

**Trigger:** Player completes a planned cycling route under a contract-compliant safety plan, with distance verified.

**Placeholders:** `{player}`, `{distance}`, `{team}`

**Media examples:**

- {player} completes the approved {distance} cycling route.
- The measured ride reaches its planned finish.
- {team}'s offseason agreement accommodates the completed cycling challenge.

## 30. 30. Player employment, labor rights, and bargaining

### `labor.salary_grievance_filed`

**Trigger:** Player union files a formal grievance over documented unpaid player salary; no tribunal finding yet exists.

**Placeholders:** `{player}`, `{amount}`, `{team}`

**Media examples:**

- Union files a salary grievance for {player}.
- The recorded unpaid balance of {amount} enters the contractual process.
- {team} receive the formal wage complaint.

### `labor.salary_arbitration_award`

**Trigger:** Authorized arbitrator finds a club owes unpaid salary and issues an enforceable award.

**Placeholders:** `{team}`, `{player}`, `{amount}`

**Media examples:**

- Arbitrator orders {team} to pay {player} {amount}.
- The wage dispute ends in an enforceable salary award.
- The recorded debt receives a binding labor decision.

### `labor.grievance_rejected`

**Trigger:** Authorized arbitrator rejects a specified player grievance after examining its merits, without implying all complaints are unfounded.

**Placeholders:** `{player}`, `{grievance}`, `{team}`

**Media examples:**

- Arbitrator rejects {player}'s {grievance} claim.
- The ruling resolves this dispute under the agreement's terms.
- {team} receive a decision on the specific filed grievance.

### `labor.collective_salary_deferral`

**Trigger:** Player representatives and club ratify a lawful temporary salary-deferral agreement with disclosed repayment terms.

**Placeholders:** `{team}`, `{repaymentterms}`

**Media examples:**

- {team} and their players approve a salary-deferral agreement.
- The signed terms delay payment under {repaymentterms}.
- The club's cash plan receives negotiated consent rather than unilateral delay.

### `labor.contract_opt_out`

**Trigger:** Player exercises a valid contractual option to end the remaining term by its specified deadline.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player} exercises his opt-out from {team}'s contract.
- The filed notice activates the option already in the agreement.
- The remaining term ends through a permitted contractual choice.

### `labor.no_trade_clause_enforced`

**Trigger:** Player refuses consent to a specific trade where an enforceable no-trade clause requires it.

**Placeholders:** `{player}`, `{team}`, `{opp}`

**Media examples:**

- {player} invokes his no-trade clause to block the proposed move.
- The contract gives him consent rights, and he uses them.
- {team}'s deal with {opp} cannot proceed without the required approval.

### `labor.no_trade_clause_waived`

**Trigger:** Player grants documented consent to a specified trade despite holding an enforceable no-trade clause.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player} waives his no-trade protection for the move to {team}.
- The recorded consent clears the contractual barrier.
- He chooses this destination under the rights in his agreement.

### `labor.union_election`

**Trigger:** Union certifies the player's election to a representative role after a valid membership ballot.

**Placeholders:** `{player}`, `{role}`

**Media examples:**

- {player} wins election as {role} in the union.
- The certified membership vote gives him a representative mandate.
- His colleagues choose {player} for the documented labor role.

### `labor.roster_status_arbitration`

**Trigger:** Arbitrator corrects a disputed active, reserve, or development roster classification under the collective agreement.

**Placeholders:** `{player}`, `{status}`, `{team}`

**Media examples:**

- Arbitrator places {player} in {status} under the agreement.
- The disputed roster classification receives a binding correction.
- {team} must apply the status specified in the labor ruling.

### `labor.contract_translation_verified`

**Trigger:** Player receives an independently certified translation of a proposed contract before signing; no agreement is yet executed.

**Placeholders:** `{player}`, `{language}`

**Media examples:**

- {player} receives a certified {language} contract translation.
- The proposed terms become readable before the signature decision.
- The verified translation supports an informed choice rather than a completed signing.

## 31. 31. Home routines, animals, and practical adulthood

### `home.pet_adoption`

**Trigger:** Player lawfully adopts an animal from an approved provider and publicly announces the completed adoption.

**Placeholders:** `{player}`, `{animal}`, `{team}`

**Media examples:**

- {player} welcomes an adopted {animal} at home.
- The completed adoption adds a care responsibility to his routine.
- {team}'s travel schedule now shares space with the pet-care plan.

### `home.pet_care_travel_plan`

**Trigger:** Player arranges a verified qualified care plan for his animal during an extended team trip.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player} confirms pet care before {team}'s road trip.
- The roster leave town; {player}'s pet keeps a dependable home routine.
- An arranged care plan clears one practical worry from the departure list.

### `home.pet_rescue_verified`

**Trigger:** Qualified responders safely retrieve the player's missing animal and its return is confirmed.

**Placeholders:** `{player}`, `{animal}`

**Media examples:**

- {player}'s missing {animal} returns safely with qualified help.
- The confirmed recovery ends the search at home.
- A practical rescue gives the household its companion back.

### `home.home_access_renovation`

**Trigger:** Player completes an inspected accessibility renovation for a household member who consents to the public summary.

**Placeholders:** `{player}`

**Media examples:**

- {player}'s home access renovation passes inspection.
- The completed work supports the household's requested access needs.
- A practical change makes the home easier to use.

### `home.utility_outage_relocation`

**Trigger:** A verified extended utility outage forces the player's household into temporary accommodation without property injury assumed.

**Placeholders:** `{player}`

**Media examples:**

- {player}'s household relocate during the utility outage.
- The verified loss of service changes the home routine.
- Temporary accommodation covers the gap while repairs continue.

### `home.neighbor_mediation`

**Trigger:** Player and neighbor sign a voluntary mediated agreement over a documented noise or access dispute.

**Placeholders:** `{player}`

**Media examples:**

- {player} settles the neighbor dispute through mediation.
- The signed agreement gives the household a workable local arrangement.
- A recorded disagreement ends with mutually accepted terms.

### `home.first_budget_balanced`

**Trigger:** Player completes a full year of independently tracked spending within a voluntarily set household budget.

**Placeholders:** `{player}`

**Media examples:**

- {player} completes a year inside his household budget.
- The verified ledger matches the plan he chose.
- Twelve months of recorded spending reach the agreed target.

### `home.cooking_for_teammates`

**Trigger:** Player hosts a verified team meal during approved downtime, with no asserted chemistry benefit.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player} hosts {team}'s agreed meal at home.
- {player} invites the roster over for a different kind of team possession: dinner.
- The meal happens; its basketball effect is another question.

### `home.house_repair_completed`

**Trigger:** Licensed trades complete and certify a necessary repair after a verified household defect.

**Placeholders:** `{player}`, `{repair}`

**Media examples:**

- {player}'s {repair} passes the final inspection.
- The certified work closes the documented household problem.
- The home repair is complete after the qualified crew's visit.

### `home.name_change_registered`

**Trigger:** Player legally registers a chosen name change and the league updates official records without altering historical identity links.

**Placeholders:** `{league}`, `{player}`

**Media examples:**

- {league} update {player}'s official registration after his name change.
- The legal record and the basketball record now match.
- His existing career totals remain linked to the updated identity.

## 32. 32. Fantasy drafts, quick challenges, and custom competition setup

### `challenge.perfect_projection`

**Trigger:** Quick-build mode produces an officially labeled undefeated projection from its declared model, without claiming an actual simulated perfect season.

**Placeholders:** `{team}`, `{record}`

**Media examples:**

- {team}'s challenge build projects to {record}.
- The model predicts an unbeaten run; the games have not been played.
- {team}'s build reaches the predicted perfect record. Now comes the question of actual games.

### `challenge.projection_actual_gap`

**Trigger:** A completed season differs from the stored preseason quick-build projection by at least a configured win threshold.

**Placeholders:** `{team}`, `{record}`, `{projection}`

**Media examples:**

- {team}'s actual {record} finish differs from the {projection} projection.
- The played season tests the challenge model and finds a gap.
- Prediction and outcome now sit beside each other for {team}.

### `challenge.last_slot_mismatch`

**Trigger:** In a quick draft, the final required role cannot use the selected candidate under locked-position eligibility rules.

**Placeholders:** `{player}`, `{team}`, `{role}`

**Media examples:**

- {player} cannot fill {team}'s final locked {role} slot.
- The last selection meets an eligibility wall in the challenge rules.
- {player} is available. The last legal roster slot is not available to him.

### `challenge.skip_used_success`

**Trigger:** Player uses a permitted team or era reroll and the replacement pick improves the declared roster model score.

**Placeholders:** `{team}`, `{score}`

**Media examples:**

- {team}'s reroll improves their model score to {score}.
- The allowed skip pays off in the published evaluation.
- A new draw gives the challenge roster a measured improvement.

### `challenge.hidden_stats_reveal`

**Trigger:** Hidden-stat challenge concludes its draft and then reveals the selected player's previously concealed ratings.

**Placeholders:** `{player}`, `{rating}`, `{team}`

**Media examples:**

- The challenge reveals {player}'s hidden {rating} rating.
- The choice is already locked when the hidden number finally appears.
- {team}'s draft is locked before the concealed number appears.

### `challenge.snake_turn_value`

**Trigger:** At least two consecutive picks at a snake-draft turn complete and a registered evaluation gives their combined grade.

**Placeholders:** `{team}`, `{grade}`

**Media examples:**

- {team}'s turn picks receive a combined {grade} grade.
- The back-to-back selections complete the planned draft pair.
- The evaluator assesses the pair together after the snake turn.

### `challenge.custom_pool_empty`

**Trigger:** User-set era, role, and team filters produce no eligible candidates; the draft safely pauses for a settings revision.

**Placeholders:** `{team}`

**Media examples:**

- {team}'s custom filters leave no eligible draft candidates.
- The custom draft has a shortlist with nobody on it.
- The declared pool needs a revised filter before selection can continue.

### `challenge.generated_only_first_season`

**Trigger:** User starts a new league with an entirely generated fictional player pool and completes its first scheduled fixture.

**Placeholders:** `{league}`, `{team}`

**Media examples:**

- {league}'s generated-only roster era begins with an official game.
- Every registered player comes from the save's declared fictional pool.
- {team} help open the new competition's independent history.

### `challenge.redistribution_draft`

**Trigger:** All owners and player representatives approve a league-wide roster redistribution draft under a valid custom agreement.

**Placeholders:** `{league}`, `{team}`

**Media examples:**

- {league} open the agreed roster-redistribution draft.
- The approved custom agreement resets team allocation through a defined process.
- {team} build again under the ratified redistribution rules.

### `challenge.era_adjustment_recalculated`

**Trigger:** User changes the declared era-normalization model and the system recalculates draft ratings before any affected match, preserving original raw statistics.

**Placeholders:** `{league}`, `{model}`, `{team}`

**Media examples:**

- {league} recalculate draft ratings under {model}.
- The raw historical numbers remain intact while the adjustment changes.
- The era model changes how {team} read the draft board; the original statistics stay intact.

## 33. 33. Rare transport emergencies and verified passenger status

### `emergency.aircraft_incident_reported`

**Trigger:** Authorized aviation responders confirm an aircraft incident involving a verified team travel flight; passenger outcomes remain unknown. Critical interrupt.

**Placeholders:** `{team}`

**Media examples:**

- Responders confirm an aircraft incident involving {team}'s travel flight.
- Passenger outcomes remain unconfirmed while the emergency response begins.
- {team}'s simulation pauses for verified information about the flight incident.

### `emergency.aircraft_safe_evacuation`

**Trigger:** Authorized responders confirm every person on the team's flight manifest is accounted for alive after an aircraft incident; injuries must be separately established.

**Placeholders:** `{team}`

**Media examples:**

- Every person on {team}'s flight manifest is confirmed alive.
- Responders account for the entire travel group after evacuation.
- The passenger status is verified; medical updates remain separate.

### `emergency.aircraft_injured_survivors`

**Trigger:** Qualified responders and clinicians confirm at least one injured survivor, with the exact count confirmed from the team's aircraft incident; no other passenger status inferred.

**Placeholders:** `{survivors}`, `{team}`

**Media examples:**

- Responders confirm {survivors} injured survivors from {team}'s flight.
- The medical teams treat the verified survivors while other updates remain separate.
- {team} release only the confirmed survivor information authorized for publication.

### `emergency.aircraft_missing_people`

**Trigger:** Incident command confirms at least one person, with the exact count supplied, from the verified flight manifest remain unaccounted for; no death declaration exists.

**Placeholders:** `{missing}`, `{team}`

**Media examples:**

- {missing} people from {team}'s flight remain unaccounted for.
- The search continues; missing status is not a death confirmation.
- Incident command report unresolved passenger whereabouts for the travel group.

### `emergency.aircraft_fatalities_confirmed`

**Trigger:** Competent authorities confirm multiple fatalities from the team's flight; next of kin are privately notified before any identifiable public announcement. Critical interrupt.

**Placeholders:** `{fatalities}`, `{team}`

**Media examples:**

- Authorities confirm {fatalities} deaths from {team}'s flight after family notification.
- The verified loss is announced with the families' privacy respected.
- Basketball operations pause as {team} respond to the confirmed deaths.

### `emergency.aircraft_traveling_roster_lost`

**Trigger:** Competent authorities confirm every rostered player on the actual travel manifest (at least two verified rostered passengers) has died, all families are privately notified, and nontraveling players are explicitly excluded. Critical interrupt.

**Placeholders:** `{travelers}`, `{team}`

**Media examples:**

- Authorities confirm the deaths of all {travelers} rostered players on {team}'s flight.
- The confirmed loss concerns the traveling roster; everyone outside the manifest is excluded.
- After private family notification, {team} announce the verified loss of their traveling players.

### `emergency.aircraft_no_team_on_board`

**Trigger:** Officials verify that an aircraft initially linked to a club had no team passengers, correcting the public association.

**Placeholders:** `{team}`

**Media examples:**

- Officials confirm no {team} passengers were aboard the reported aircraft.
- The verified manifest corrects the earlier team association.
- {team}'s travel group is not part of the confirmed passenger list.

### `emergency.bus_collision_response`

**Trigger:** Emergency services confirm a collision involving the team's travel bus; injury status is not yet verified. Critical interrupt.

**Placeholders:** `{team}`

**Media examples:**

- Emergency services respond to {team}'s confirmed bus collision.
- Injury information remains unverified as responders secure the scene.
- The travel plan stops while authorities handle the bus emergency.

### `emergency.rail_evacuation`

**Trigger:** Rail authority confirms the team's train was evacuated during a serious operational emergency and all team travelers are accounted for alive.

**Placeholders:** `{team}`

**Media examples:**

- {team}'s rail travelers are accounted for after evacuation.
- The rail authority confirms the team group is alive and off the train.
- The journey pauses after the verified emergency evacuation.

### `emergency.ferry_rescue`

**Trigger:** Maritime responders confirm all registered team travelers have been rescued alive after a ferry emergency; no injury assumptions.

**Placeholders:** `{team}`

**Media examples:**

- Maritime responders rescue {team}'s entire registered travel group alive.
- The passenger check accounts for every team traveler.
- Medical assessments follow separately after the confirmed rescue.

## 34. 34. Rare venue and natural emergencies

### `emergency.arena_evacuation_fire`

**Trigger:** Fire authority orders an immediate arena evacuation after a verified fire; casualty status is separate. Critical interrupt.

**Placeholders:** `{arena}`, `{team}`

**Media examples:**

- Fire authorities order the evacuation of {arena}.
- {team}'s game stops while the verified emergency is addressed.
- Spectators and staff follow the official evacuation order.

### `emergency.arena_structural_closure`

**Trigger:** Licensed inspectors identify an immediate structural hazard and authorities close the arena before the next event. Critical interrupt.

**Placeholders:** `{arena}`, `{team}`

**Media examples:**

- Authorities close {arena} after an urgent structural finding.
- The inspection removes the venue from use until it is cleared.
- {team}'s home schedule pauses for the confirmed building hazard.

### `emergency.earthquake_venue_check`

**Trigger:** A verified earthquake leads authorities to suspend venue access pending inspection, with no damage or deaths presumed. Critical interrupt.

**Placeholders:** `{arena}`, `{team}`

**Media examples:**

- {arena} suspend access after the earthquake.
- Inspectors must clear the venue before {team}'s schedule resumes.
- The precaution follows the verified tremor, not an assumed damage finding.

### `emergency.flood_training_center`

**Trigger:** Emergency authorities confirm floodwater has made the training center inaccessible and order no entry. Critical interrupt.

**Placeholders:** `{team}`, `{coach}`

**Media examples:**

- Flooding closes {team}'s training center under the official order.
- The facility is inaccessible while the emergency restriction remains.
- {coach}'s sessions stop at the affected site.

### `emergency.wildfire_city_departure`

**Trigger:** Authorities issue a mandatory evacuation affecting the team facility and verify the club's lawful departure plan. Critical interrupt.

**Placeholders:** `{team}`

**Media examples:**

- {team} follow the mandatory wildfire evacuation order.
- The basketball schedule yields to the city's verified emergency directive.
- The club relocate under the authorities' approved departure plan.

### `emergency.hurricane_shelter_order`

**Trigger:** Authorities impose a shelter directive affecting the arena's city, causing an official game suspension. Critical interrupt.

**Placeholders:** `{team}`, `{arena}`

**Media examples:**

- {team}'s game is suspended under the hurricane shelter directive.
- The official order keeps the event from proceeding at {arena}.
- The league wait for the local safety authority's clearance.

### `emergency.public_health_venue_closure`

**Trigger:** Competent health authority formally closes the venue during a declared public-health emergency; no player diagnosis is implied. Critical interrupt.

**Placeholders:** `{arena}`, `{team}`

**Media examples:**

- Health authorities close {arena} during the declared emergency.
- The venue order suspends public games without identifying any player diagnosis.
- {team}'s schedule follows the formal public-health restriction.

### `emergency.crowd_compression_response`

**Trigger:** Qualified safety officials confirm a crowd-compression emergency and halt entry and play; individual injuries require separate verification. Critical interrupt.

**Placeholders:** `{arena}`, `{team}`

**Media examples:**

- Safety officials halt {arena}'s event after a crowd emergency.
- Entry stops while qualified responders assist the affected area.
- {team}'s game pauses under the official safety command.

### `emergency.power_grid_shutdown`

**Trigger:** Grid authority confirms a dangerous regional power failure and venue safety staff formally abandon the current event. Critical interrupt.

**Placeholders:** `{arena}`, `{team}`

**Media examples:**

- A confirmed grid emergency ends the event at {arena}.
- Venue safety staff abandon {team}'s game under the emergency procedure.
- The official grid notice leaves the arena unable to operate safely.

### `emergency.verified_threat_venue_shutdown`

**Trigger:** Qualified authorities assess a specific credible threat and order a venue shutdown; no perpetrator, motive, or attack is presumed. Critical interrupt.

**Placeholders:** `{arena}`, `{team}`

**Media examples:**

- Authorities close {arena} after assessing a credible threat.
- {team}'s event stops under the official safety order.
- The shutdown addresses the verified risk while other claims remain unconfirmed.

## 35. 35. Emergency continuity, support, memorials, and rebuilding

### `emergency.simulation_hard_stop`

**Trigger:** Any newly confirmed critical emergency creates a persistent unresolved incident record and forces the simulation to stop before advancing another day.

**Placeholders:** `{team}`

**Media examples:**

- {team}'s simulation stops for the unresolved emergency.
- The incident record requires a decision before the calendar advances.
- Routine basketball updates pause until the verified emergency is addressed.

### `emergency.family_liaison_activated`

**Trigger:** Club formally activates qualified family-liaison support after an emergency, with private contact preceding identifiable public information.

**Placeholders:** `{team}`

**Media examples:**

- {team} activate private family-liaison support.
- The care process begins with direct communication to affected households.
- Public updates wait for the required private notifications.

### `emergency.game_block_postponed`

**Trigger:** League officially postpones a specified block of fixtures due to an active severe club emergency.

**Placeholders:** `{team}`, `{games}`

**Media examples:**

- League postpones {team}'s next {games} games.
- The emergency response receives a formally cleared window.
- The fixture block pauses rather than advancing through the crisis.

### `emergency.emergency_roster_draft`

**Trigger:** League and player representatives approve an exceptional replacement-player allocation draft after verified catastrophic roster loss; participants consent under written terms.

**Placeholders:** `{league}`, `{team}`

**Media examples:**

- {league} approve an emergency allocation draft for {team}.
- The exceptional roster process follows agreed player protections.
- {team}'s rebuilding route begins under the published emergency framework.

### `emergency.affected_season_withdrawal`

**Trigger:** League approves a club's request to withdraw from the remainder of the season after a verified catastrophic emergency.

**Placeholders:** `{team}`, `{season}`

**Media examples:**

- {team} receive approval to withdraw from the rest of {season}.
- The league formally suspend the club's remaining fixtures.
- The decision gives the affected organization time beyond the current schedule.

### `emergency.franchise_continuity_vote`

**Trigger:** Governing authority and lawful owners certify a decision on the affected franchise's continuation after a catastrophic incident.

**Placeholders:** `{team}`, `{decision}`

**Media examples:**

- The certified continuity decision for {team} is {decision}.
- The club's future receives a formal ruling after the emergency.
- The verified governance process settles the next organizational step.

### `emergency.memorial_authorized`

**Trigger:** Families consent to a specified public memorial after confirmed deaths and private notification; event tone must be respectful.

**Placeholders:** `{team}`, `{venue}`

**Media examples:**

- {team} announce the family-approved memorial at {venue}.
- The remembrance follows the affected families' stated wishes.
- Supporters receive the confirmed plan for a respectful public tribute.

### `emergency.survivor_return_plan`

**Trigger:** A surviving player, qualified clinicians, and club agree a medically cleared phased return after a severe emergency.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player} agrees a medically cleared phased return with {team}.
- The plan proceeds at the pace established with qualified care staff.
- A return timetable is agreed without promising an immediate appearance.

### `emergency.first_game_after_loss`

**Trigger:** Club completes its first officially scheduled game after a catastrophic loss under approved continuity arrangements and family-sensitive presentation.

**Placeholders:** `{team}`

**Media examples:**

- {team} complete their first game under the approved return plan.
- The appearance marks a basketball step after the confirmed loss.
- The schedule resumes with the remembrance wishes respected.

### `emergency.independent_safety_report`

**Trigger:** Authorized independent investigators publish a final transport or venue safety report after a serious incident; findings limited to the published scope.

**Placeholders:** `{finding}`, `{team}`

**Media examples:**

- The final safety report identifies {finding} in the {team} incident.
- The published review establishes its stated findings without expanding beyond them.
- {team} receive the independent report's verified recommendations.

## 36. 36. Rare opportunities, hidden connections, and unexpected crossovers

### `surprise.license_helps_stranded_team`

**Trigger:** Player's previously earned relevant qualification is checked by professionals and he provides a lawful, supervised nonhazardous role during a travel disruption.

**Placeholders:** `{player}`, `{qualification}`, `{team}`

**Media examples:**

- {player}'s {qualification} suddenly helps {team} off the court.
- The offseason course pays off in a place nobody put on the schedule.
- The backup plan turns out to be sitting in the team seats.

### `surprise.old_school_opponent_revealed`

**Trigger:** Public school records and both participants confirm two current opponents shared an earlier school team that had not been part of their media profiles.

**Placeholders:** `{player}`, `{opponent}`

**Media examples:**

- {player} and {opponent} discover a shared school-team chapter.
- Tonight's opponents once wore the same colors. The old roster has receipts.
- A school photograph changes the introduction to this matchup.

### `surprise.former_mentor_referee`

**Trigger:** A licensed referee assigned to a game is publicly confirmed as the player's former permitted youth mentor; conflict rules explicitly permit the assignment.

**Placeholders:** `{player}`, `{referee}`

**Media examples:**

- {player}'s old mentor returns with the whistle.
- The reunion comes with an official assignment and a competition-cleared connection.
- Familiar face, different job: {player} meets {referee} at midcourt.

### `surprise.garden_supplies_team`

**Trigger:** A player-run garden produces a measured harvest that passes the team's food-safety process and supplies a planned team meal.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player}'s garden makes it onto {team}'s dinner table.
- He grows the ingredients, then watches the entire roster eat the results.
- The garden project gets its first team catering call-up.

### `surprise.music_becomes_anthem`

**Trigger:** Club licenses an existing player-created composition as its official arena entrance music after rights clearance.

**Placeholders:** `{team}`, `{player}`, `{arena}`

**Media examples:**

- {team} choose {player}'s music for their arena entrance.
- He hears his own song before his name is announced. That is a different kind of home advantage.
- The side project becomes the sound of {arena}'s introductions.

### `surprise.invention_team_adoption`

**Trigger:** A team adopts a player-owned, legally licensed nonmedical invention after a completed independent safety and usability review.

**Placeholders:** `{team}`, `{player}`

**Media examples:**

- {team} put {player}'s invention to work.
- The prototype leaves the workbench and joins the staff routine.
- His side project now has a basketball employer.

### `surprise.translation_saves_registration`

**Trigger:** Player's completed translation qualification helps staff identify a correctable administrative misunderstanding before the registration deadline; officials confirm timely resolution.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player}'s language training helps rescue {team}'s registration deadline.
- One translated detail keeps the paperwork from becoming a roster problem.
- The useful offseason skill turns out to be nowhere in the box score.

### `surprise.opponent_pays_travel_rescue`

**Trigger:** Opposing club voluntarily and lawfully funds an approved replacement trip after a verified funding disruption, allowing the scheduled game to occur.

**Placeholders:** `{opp}`, `{team}`

**Media examples:**

- {opp} help {team} reach the game they are about to contest.
- First they fund the journey. Then they try to win the matchup.
- The opponent becomes the reason there is an opponent on the court.

### `surprise.community_funds_club_survival`

**Trigger:** An independently audited community fundraising drive covers a specified imminent club operating shortfall without selling ownership interests.

**Placeholders:** `{city}`, `{team}`

**Media examples:**

- {city}'s fundraising keeps {team} operating.
- The crowd pay toward a club they refuse to lose. The audited target is met.
- A thousand small contributions solve the bill one owner could not cover.

### `surprise.tryout_scout_from_hobby`

**Trigger:** A qualified scout meets the player at an unrelated lawful hobby event, later conducts a formal basketball assessment, and issues a genuine tryout invitation.

**Placeholders:** `{player}`, `{hobby}`

**Media examples:**

- {player}'s {hobby} outing leads to a basketball tryout.
- He arrives for one activity and leaves with a completely different opportunity.
- The chance meeting opens a door; the court assessment earns the invitation.

## 37. 37. Administrative oddities, improbable timing, and harmless chaos

### `surprise.same_name_registration`

**Trigger:** League detects that two distinct players with the same display name were accidentally linked and corrects identities before any eligibility penalty.

**Placeholders:** `{league}`, `{player}`

**Media examples:**

- {league} untangle two different players named {player}.
- Same name, separate careers: the registration desk finally gives each his own file.
- The paperwork finds its double. Neither player loses his place.

### `surprise.trophy_shipping_wrong_city`

**Trigger:** Trophy carrier acknowledges delivery to the wrong city and the league arranges lawful recovery before presentation.

**Placeholders:** `{trophy}`, `{wrongcity}`

**Media examples:**

- {trophy} take a detour to {wrongcity}.
- The winners know where they are. The shipping label needs help.
- The celebration waits for an award with a surprisingly adventurous itinerary.

### `surprise.uniform_colors_identical`

**Trigger:** Officials discover both clubs brought indistinguishable approved uniform colors and authorize a legal replacement before tip-off.

**Placeholders:** `{team}`, `{opp}`

**Media examples:**

- {team} and {opp} arrive dressed for the same side.
- The colors clash by refusing to clash. A legal replacement saves the introductions.
- Before anyone can defend an opponent, someone has to identify one.

### `surprise.practice_ball_signed_artifact`

**Trigger:** Staff independently authenticate a donated practice ball as a valuable historical artifact and withdraw it from use with the donor's agreement.

**Placeholders:** `{team}`

**Media examples:**

- {team}'s practice ball turns out to belong in the archives.
- Nobody takes another bounce after the authentication comes back.
- A routine donation delivers history with the air still in it.

### `surprise.delayed_letter_tryout`

**Trigger:** Club confirms a legitimately issued tryout invitation was delivered after its original date and voluntarily grants a new assessment slot.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- A late letter gives {player} a second date with {team}.
- The delivery misses the tryout; the club make room for the person.
- The invitation survives its own travel delay.

### `surprise.fan_returns_lost_contract`

**Trigger:** A fan finds a legally unsecured nonconfidential contract folder, returns it unopened, and the club confirms safe recovery.

**Placeholders:** `{team}`

**Media examples:**

- A supporter returns {team}'s lost contract folder unopened.
- The biggest assist of the morning comes from outside the roster.
- The folder makes it home with its contents still private.

### `surprise.arena_cat_pauses_warmup`

**Trigger:** A loose domestic animal enters during warmups; qualified handlers safely remove it before competitive play.

**Placeholders:** `{arena}`, `{animal}`

**Media examples:**

- {arena}'s warmup gets an unexpected {animal} visitor.
- The smallest arrival owns the court until the handlers finish their job.
- Both teams wait while a four-legged guest receives the escort.

### `surprise.calendar_double_celebration`

**Trigger:** Club history office verifies a player's current milestone falls exactly on the club's founding anniversary, and both are celebrated.

**Placeholders:** `{player}`, `{milestone}`, `{team}`

**Media examples:**

- {player}'s {milestone} lands on {team}'s founding anniversary.
- Two reasons for one celebration, and the history office confirms the date.
- The calendar delivers a coincidence the presentation staff could not script.

### `surprise.custom_tactic_opponent_copy`

**Trigger:** An opposing coach publicly credits the user's unusual legal tactic and fields a documented version in a later game.

**Placeholders:** `{opp}`, `{team}`, `{coach}`

**Media examples:**

- {opp} borrow the legal experiment first used by {team}.
- The strange idea has a second customer. {coach} openly credits the source.
- Yesterday's eyebrow-raiser becomes somebody else's scouting problem.

### `surprise.rookie_owns_old_ticket`

**Trigger:** Player authenticates his childhood ticket to a historic club game and publicly shares it after joining that club.

**Placeholders:** `{player}`, `{team}`

**Media examples:**

- {player} joins {team} with an old ticket to his new home.
- He once came through the gate as a spectator. Now the pass gets him onto the court.
- The saved ticket gives his arrival a story no contract clause can supply.

## 38. Shot selection and finishing

### `skill.finish_inside_hand`

**Trigger:** Player selects an inside-hand layup to shield the release from a defender positioned on his outside shoulder, and the shot counts.

**Placeholders:** `{defender}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires tracked shot geometry and shot-type inputs; restricted shot zones follow the active court and rulebook.

**Required state:** finish_hand; defender_shoulder; release_location; shot_result

**Consequences:** Improve shielded-finish familiarity; opponent can scout the hand choice.

**Media examples:**

- {player} hides the finish from {defender} with the inside hand.
- The defender's shoulder position explains {player}'s release choice.
- {defender} gets the view; {player} gets the basket.

### `skill.finish_reverse_shield`

**Trigger:** Player uses the rim as a shield on a reverse finish against a tracked pursuing contest and legally scores.

**Placeholders:** `{defender}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires tracked shot geometry and shot-type inputs; restricted shot zones follow the active court and rulebook.

**Required state:** finish_path; rim_shield; contest_path; shot_result

**Consequences:** Unlock reverse-finish scouting tendency and defensive anticipation.

**Media examples:**

- {player} puts the rim between his shot and {defender}.
- The reverse changes the contest geometry for {player}.
- {defender} arrives at the wrong side of the basket.

### `skill.finish_wrong_foot`

**Trigger:** Player deliberately launches a made layup from the unexpected foot while defender timing predicts his normal takeoff.

**Placeholders:** `{defender}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires tracked shot geometry and shot-type inputs; restricted shot zones follow the active court and rulebook.

**Required state:** takeoff_foot; usual_takeoff; defender_prediction; shot_result

**Consequences:** Add timing deception familiarity; repeated use reduces surprise value.

**Media examples:**

- {player} scores before {defender}'s expected takeoff cue.
- Wrong-foot timing changes the release window rather than the shot location.
- {defender}'s timing chart needs an eraser.

### `skill.finish_floater_drop`

**Trigger:** Player chooses and makes a floater before entering the contest radius of a defender in declared drop coverage.

**Placeholders:** `{opp}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires tracked shot geometry and shot-type inputs; restricted shot zones follow the active court and rulebook.

**Required state:** coverage_tag; release_distance; contest_radius; shot_result

**Consequences:** Improve floater confidence; invite higher defensive pickup points.

**Media examples:**

- {player}'s floater clears the gap in {opp}'s drop coverage.
- The early release keeps {player} outside the tracked rim contest.
- {opp} protect the rim; {player} takes the space in front of it.

### `skill.finish_contact_declined`

**Trigger:** Player cancels an intended contact finish after reading a planted defender and makes a legal pull-up instead.

**Placeholders:** `{defender}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires tracked shot geometry and shot-type inputs; restricted shot zones follow the active court and rulebook.

**Required state:** intended_finish; defender_set; cancel_window; replacement_shot; shot_result

**Consequences:** Reward decision discipline instead of contact-finish experience.

**Media examples:**

- {player} changes the finish before meeting {defender}.
- The decision removes a tracked collision risk and creates a pull-up.
- {player} reads the obstacle and chooses another road.

### `skill.shot_bank_angle`

**Trigger:** A deliberately chosen bank shot scores from a geometry band identified in the player's shot plan.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires tracked shot geometry and shot-type inputs; restricted shot zones follow the active court and rulebook.

**Required state:** bank_intent; shot_angle; practiced_band; shot_result

**Consequences:** Build angle-specific mastery and reveal a bank-shot tendency.

**Media examples:**

- {player} uses the glass from his practiced angle.
- The bank selection follows the stored geometry band for {player}.
- The backboard finally gets a meaningful role in the plan.

### `skill.shot_stepthrough_patience`

**Trigger:** Player legally maintains his pivot, lets an airborne contest pass, and scores a step-through.

**Placeholders:** `{defender}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires tracked shot geometry and shot-type inputs; restricted shot zones follow the active court and rulebook.

**Required state:** pivot_foot; contest_airborne; stepthrough_path; legality; shot_result

**Consequences:** Increase pivot-poise familiarity; defenders can shift toward staying down.

**Media examples:**

- {player} waits out {defender} and scores the step-through.
- Legal pivot control turns the airborne contest into a finishing window.
- {defender} takes the flight; {player} takes the basket.

### `skill.shot_turnaround_blindside`

**Trigger:** Player selects a turnaround away from the documented help side and makes the shot.

**Placeholders:** `{opp}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires tracked shot geometry and shot-type inputs; restricted shot zones follow the active court and rulebook.

**Required state:** help_side; turnaround_direction; release_window; shot_result

**Consequences:** Reinforce directional post counters and help-side scouting.

**Media examples:**

- {player} turns away from {opp}'s help and scores.
- The turnaround direction avoids the logged second-defender lane.
- {opp}'s help gets a very good view of the wrong shoulder.

### `skill.shot_escape_sideways`

**Trigger:** After a defender closes straight ahead, player uses a legal lateral escape dribble to create and make a shot.

**Placeholders:** `{defender}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires tracked shot geometry and shot-type inputs; restricted shot zones follow the active court and rulebook.

**Required state:** closeout_vector; escape_vector; separation; shot_result

**Consequences:** Add escape-dribble proficiency and opponent closeout adjustments.

**Media examples:**

- {player} steps sideways out of {defender}'s closeout.
- The escape changes lateral separation rather than merely increasing distance.
- {defender} closes the front door; {player} finds the side entrance.

### `skill.shot_foot_on_arc_awareness`

**Trigger:** Player interrupts his shooting gather after detecting a foot on the active arc, legally relocates behind it, and makes the higher-value shot.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires tracked shot geometry and shot-type inputs; restricted shot zones follow the active court and rulebook.

**Required state:** arc_exists; foot_location; gather_state; relocation; legality; shot_value

**Consequences:** Improve spatial discipline; relocation consumes available possession time.

**Media examples:**

- {player} moves his foot clear of the arc before scoring.
- The relocation changes the shot's value under the current court markings.
- {player} checks the address before mailing the shot.

### `skill.shot_deep_range_declined`

**Trigger:** Player rejects a high-distance shot outside his practiced range and creates a made attempt inside his reliable band.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires tracked shot geometry and shot-type inputs; restricted shot zones follow the active court and rulebook.

**Required state:** range_map; offered_shot; selected_shot; possession_outcome

**Consequences:** Reward shot-selection discipline and update range preferences.

**Media examples:**

- {player} passes on the distant attempt and finds his range.
- The selection follows {player}'s measured accuracy map.
- A little restraint gives the basket a better proposal.

### `skill.finish_alleyoop_abort`

**Trigger:** Receiver aborts a tracked unsafe aerial catch and safely gathers the lob for a grounded scoring finish.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires tracked shot geometry and shot-type inputs; restricted shot zones follow the active court and rulebook.

**Required state:** lob_height; catch_risk; abort_choice; gather_state; shot_result

**Consequences:** Lower reckless-catch tendency while preserving lob chemistry.

**Media examples:**

- {player} brings the lob down before finishing.
- The decision trades aerial spectacle for a controlled legal gather.
- The highlight waited; the basket did not mind.

### `skill.shot_double_clutch_blocked`

**Trigger:** A deliberate midair double clutch exhausts the release window and the recovering defender blocks the attempt.

**Placeholders:** `{defender}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires tracked shot geometry and shot-type inputs; restricted shot zones follow the active court and rulebook.

**Required state:** aerial_adjustments; remaining_airtime; contest_recovery; block_event

**Consequences:** Reduce confidence in overcomplicated finishes; open simpler counter training.

**Media examples:**

- {defender} recovers while {player} adds the extra clutch.
- The delayed release gives the contest time to return.
- One extra adjustment sends the shot into {defender}'s appointment book.

### `skill.shot_fake_into_crowd`

**Trigger:** A pump fake draws the primary defender up, but the player advances into a pretracked help crowd and loses the ball.

**Placeholders:** `{defender}`, `{opp}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires tracked shot geometry and shot-type inputs; restricted shot zones follow the active court and rulebook.

**Required state:** fake_response; help_density; drive_choice; turnover_event

**Consequences:** Add second-read training and penalize tunnel-vision tendency.

**Media examples:**

- {player}'s first fake works; the next lane does not.
- Beating one contest still leaves the logged help traffic.
- {defender} buys the fake. {opp}'s help refuse the rest of the sale.

### `skill.shot_contest_reclassification`

**Trigger:** Tracking identifies a defender outside the effective contest cone, so a visually crowded made attempt is classified as functionally open.

**Placeholders:** `{defender}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires tracked shot geometry and shot-type inputs; restricted shot zones follow the active court and rulebook.

**Required state:** contest_cone; defender_position; release_height; contest_label

**Consequences:** Improve scouting precision and prevent misleading tough-shot rewards.

**Media examples:**

- {player}'s crowded-looking make comes outside the contest cone.
- Appearance and effective defensive reach differ on this attempt.
- {defender} appears in the picture without touching the shooting window.

## 39. Passing mechanics and shared reads

### `skill.pass_pocket_gap`

**Trigger:** Ball handler threads a bounce pass through the live gap between two pick-and-roll defenders; receiver controls it and scores.

**Placeholders:** `{opp}`, `{player}`, `{teammate}`

**Modes:** player; franchise

**Availability:** Requires pass trajectories, receiver routes, and possession attribution.

**Required state:** pass_path; defender_gap; receiver_control; shot_result

**Consequences:** Build two-player pocket-pass chemistry and invite tighter gap defense.

**Media examples:**

- {player} finds {teammate} through the pocket.
- The bounce path clears the gap between both defenders.
- {opp} close the big doors and forget the small one.

### `skill.pass_shortroll_release`

**Trigger:** Double-teamed ball handler releases to a short-roll receiver who directs the resulting numerical advantage into a made shot.

**Placeholders:** `{opp}`, `{player}`, `{team}`, `{teammate}`

**Modes:** player; franchise

**Availability:** Requires pass trajectories, receiver routes, and possession attribution.

**Required state:** double_team; shortroll_position; advantage_count; secondary_decision

**Consequences:** Improve short-roll decision network and mark its outlet for scouting.

**Media examples:**

- {player} gives {teammate} the short-roll decision.
- The pass moves the ball out of the double-team and into the advantage.
- {opp} send two; {team} make the remaining space count.

### `skill.pass_lookaway_interception`

**Trigger:** A defender follows the passer's body rather than his gaze and intercepts a deliberately lookaway pass.

**Placeholders:** `{defender}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires pass trajectories, receiver routes, and possession attribution.

**Required state:** gaze_vector; body_vector; defender_read; interception

**Consequences:** Reduce repeated gaze-fake effectiveness against this scout profile.

**Media examples:**

- {defender} ignores {player}'s eyes and takes the pass.
- Body orientation overrules the false visual cue.
- {player}'s no-look pass gets a very attentive reader.

### `skill.pass_onehand_velocity`

**Trigger:** A legal one-hand pass reaches a moving receiver before the help rotation and directly produces a made shot.

**Placeholders:** `{opp}`, `{player}`, `{teammate}`

**Modes:** player; franchise

**Availability:** Requires pass trajectories, receiver routes, and possession attribution.

**Required state:** pass_hand; release_delay; help_arrival; receiver_shot

**Consequences:** Improve fast-release passing while retaining accuracy costs in the model.

**Media examples:**

- {player}'s one-hand delivery beats the help rotation.
- Release speed, not just pass distance, creates the window for {teammate}.
- {opp}'s help arrive after the mail.

### `skill.pass_skip_airtime_trap`

**Trigger:** A long skip pass gives the far-side defender enough flight time to trap the receiver, causing a held-ball outcome under current rules.

**Placeholders:** `{opp}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires pass trajectories, receiver routes, and possession attribution.

**Required state:** skip_flight; trap_arrival; receiver_options; held_ball_rule

**Consequences:** Add pass-speed and receiver-safety considerations to decision ratings.

**Media examples:**

- {opp} turn {player}'s skip pass into a trap.
- The ball's airtime gives the weak-side rotation its opportunity.
- The pass travels across the court and delivers a problem.

### `skill.pass_touch_redirect`

**Trigger:** Receiver redirects an incoming pass without controlling it first, legally finding a teammate who scores.

**Placeholders:** `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Requires pass trajectories, receiver routes, and possession attribution.

**Required state:** incoming_vector; touch_vector; legality; receiver_shot

**Consequences:** Build quick-read chemistry and increase mishandle risk for poor timing.

**Media examples:**

- {player}'s touch pass keeps the advantage moving.
- The redirection removes a gather delay from {team}'s sequence.
- The ball visits {player} without unpacking.

### `skill.pass_live_dribble_weakhand`

**Trigger:** Player makes a successful weak-hand pass directly from a live dribble to a cutter without first gathering with both hands.

**Placeholders:** `{opp}`, `{player}`, `{teammate}`

**Modes:** player; franchise

**Availability:** Requires pass trajectories, receiver routes, and possession attribution.

**Required state:** live_hand; pass_hand; gather_delay; cutter_window

**Consequences:** Add weak-hand passing proficiency separate from weak-hand finishing.

**Media examples:**

- {player} finds {teammate} straight from the weak-hand dribble.
- The live-dribble release preserves a window a full gather would close.
- {opp} wait for the pickup; the pass has already left.

### `skill.pass_behindback_wrong_target`

**Trigger:** A deliberately selected behind-back pass reaches the wrong teammate's occupied space and results in a turnover.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires pass trajectories, receiver routes, and possession attribution.

**Required state:** pass_style; intended_receiver; landing_zone; turnover_event

**Consequences:** Lower flair-pass reliability until target recognition improves.

**Media examples:**

- {player}'s behind-back pass finds the wrong traffic.
- The chosen release hides the ball from its intended receiver as well.
- The stylish route loses the delivery address.

### `skill.pass_entry_angle_reset`

**Trigger:** A fronted post entry is abandoned; reversing the ball creates a legal new entry angle and a scored post touch.

**Placeholders:** `{opp}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Requires pass trajectories, receiver routes, and possession attribution.

**Required state:** fronting_tag; initial_angle; reversal; new_entry; post_result

**Consequences:** Improve patience in entry systems and force fronting adjustments.

**Media examples:**

- {team} change the angle before finding {player} inside.
- The reversal removes the fronting defender's initial advantage.
- {opp} guard one doorway. {team} use another.

### `skill.pass_handoff_denied`

**Trigger:** Defender legally takes away a scheduled handoff and the ball holder retains possession, turning the denial into a made keeper drive.

**Placeholders:** `{opp}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires pass trajectories, receiver routes, and possession attribution.

**Required state:** handoff_denial; keeper_option; drive_lane; shot_result

**Consequences:** Unlock handoff counter familiarity without crediting an assist.

**Media examples:**

- {player} keeps the ball when {opp} deny the handoff.
- The keeper option responds to the logged denial cue.
- {opp} cancel the handoff and accidentally order the drive.

### `skill.pass_lob_ceiling`

**Trigger:** A lob chosen above the receiver's modeled catch envelope sails out untouched.

**Placeholders:** `{player}`, `{teammate}`

**Modes:** player; franchise

**Availability:** Requires pass trajectories, receiver routes, and possession attribution.

**Required state:** lob_apex; catch_envelope; touch_log; out_of_bounds

**Consequences:** Update pairing-specific lob targets and passing calibration.

**Media examples:**

- {player}'s lob exceeds {teammate}'s catch window.
- Target height matters as much as the passing lane.
- The idea reaches a higher floor than the receiver can.

### `skill.pass_drag_cutter_delay`

**Trigger:** Passer holds a live passing lane until a trailing defender crosses behind the cutter, then completes a pass for a made shot.

**Placeholders:** `{player}`, `{teammate}`

**Modes:** player; franchise

**Availability:** Requires pass trajectories, receiver routes, and possession attribution.

**Required state:** cutter_route; trailing_cross; pass_delay; shot_result

**Consequences:** Improve timing patience; excessive delay remains punishable.

**Media examples:**

- {player} waits for the trailing defender before releasing to {teammate}.
- The delay changes which body can obstruct the cutter's catch.
- This pass arrives late on purpose and right on time.

### `skill.pass_outlet_receiver_scan`

**Trigger:** Rebounder scans before turning and identifies a receiver outside the opponent's preassigned outlet trap, leading to a safe advance.

**Placeholders:** `{opp}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires pass trajectories, receiver routes, and possession attribution.

**Required state:** scan_timing; outlet_trap; receiver_choice; advance_result

**Consequences:** Improve transition awareness without requiring a basket.

**Media examples:**

- {player} looks beyond {opp}'s outlet trap.
- The preturn scan changes the first receiver selection.
- The trap waits at the wrong delivery point.

### `skill.pass_stationary_overload`

**Trigger:** Multiple teammates occupy the intended receiving lane, and a selected pass is deflected because their routes were not staggered.

**Placeholders:** `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Requires pass trajectories, receiver routes, and possession attribution.

**Required state:** receiver_routes; lane_overlap; pass_path; deflection

**Consequences:** Add spacing discipline needs to team passing chemistry.

**Media examples:**

- {team} crowd the pass that {player} wants to make.
- Overlapping receiving lanes create a single defender's deflection opportunity.
- Too many delivery addresses end up in the same hallway.

### `skill.pass_receiver_signal_mismatch`

**Trigger:** Passer follows a stored cut signal while receiver executes the opposite option, causing an unforced out-of-bounds pass.

**Placeholders:** `{player}`, `{teammate}`

**Modes:** player; franchise

**Availability:** Requires pass trajectories, receiver routes, and possession attribution.

**Required state:** signal_version; passer_read; receiver_read; turnover_event

**Consequences:** Lower shared-read trust; unlock signal-review practice.

**Media examples:**

- {player} and {teammate} read the same signal differently.
- The turnover comes from route interpretation rather than pass accuracy.
- The ball follows the plan. The receiver follows another plan.

## 40. Dribble control and footwork

### `skill.dribble_split_hipgap`

**Trigger:** Player legally splits two converging defenders through their tracked hip gap and reaches a scoring attempt.

**Placeholders:** `{opp}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires continuous ball-control and foot-placement states; move legality uses the active rulebook.

**Required state:** defender_hipgap; dribble_vector; ball_control; scoring_attempt

**Consequences:** Improve split recognition and increase risk when gaps shrink.

**Media examples:**

- {player} splits the space between {opp}'s defenders.
- The hip gap opens a route through the pressure.
- Two defenders become one very inconvenient doorway.

### `skill.dribble_snake_screen`

**Trigger:** Ball handler legally snakes behind his screener, holding the pursuing defender on his back while producing a made shot.

**Placeholders:** `{defender}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires continuous ball-control and foot-placement states; move legality uses the active rulebook.

**Required state:** screen_path; snake_route; pursuit_position; shot_result

**Consequences:** Add pursuit-control mastery and incentivize earlier help.

**Media examples:**

- {player} snakes around the screen and keeps {defender} behind.
- The route changes the pursuit angle before the shot.
- {defender} gets a guided tour of {player}'s back.

### `skill.dribble_reject_screen`

**Trigger:** Defender leans toward a scheduled screen; handler rejects it and scores along the opposite driving lane.

**Placeholders:** `{defender}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires continuous ball-control and foot-placement states; move legality uses the active rulebook.

**Required state:** screen_schedule; defender_lean; rejection; drive_result

**Consequences:** Build reject-screen tendency; defenses can stop overleaning.

**Media examples:**

- {player} rejects the screen and attacks the open side.
- {defender}'s screen anticipation creates the alternative lane.
- The screen never needs to touch anyone to do its job.

### `skill.dribble_retreat_reset`

**Trigger:** Handler retreats legally out of a trapped dribble while retaining live-ball control, allowing a new offensive set.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires continuous ball-control and foot-placement states; move legality uses the active rulebook.

**Required state:** trap_geometry; dribble_live; retreat_path; reset_event

**Consequences:** Improve escape control while consuming possession time.

**Media examples:**

- {player} backs out of the trap without surrendering the dribble.
- The retreat restores options rather than forcing a pass.
- Sometimes progress looks like taking two steps away from trouble.

### `skill.dribble_change_pace`

**Trigger:** Tracking credits an intentional deceleration and reacceleration for defender overshoot that opens a made drive.

**Placeholders:** `{defender}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires continuous ball-control and foot-placement states; move legality uses the active rulebook.

**Required state:** speed_curve; defender_response; separation; shot_result

**Consequences:** Add pace-control familiarity and defender rhythm scouting.

**Media examples:**

- {player} changes pace and leaves {defender} chasing the wrong rhythm.
- Acceleration timing creates the gap, not maximum speed alone.
- {defender} keeps the beat; {player} changes the song.

### `skill.dribble_high_bounce_pick`

**Trigger:** A chosen high dribble exposes the ball within a defender's reach envelope and is legally stripped.

**Placeholders:** `{defender}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires continuous ball-control and foot-placement states; move legality uses the active rulebook.

**Required state:** bounce_height; reach_envelope; ball_exposure; steal_event

**Consequences:** Shift handle coaching toward lower control under pressure.

**Media examples:**

- {defender} reaches {player}'s high bounce.
- The exposed dribble height makes the ball accessible.
- The dribble gives {defender} a very generous invitation.

### `skill.dribble_spin_trap`

**Trigger:** A spin move escapes the first defender but enters a previously visible second defender's trap, ending in a turnover.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires continuous ball-control and foot-placement states; move legality uses the active rulebook.

**Required state:** spin_direction; secondary_defender; trap_visibility; turnover_event

**Consequences:** Penalize missing the second read rather than spin technique alone.

**Media examples:**

- {player} spins past one problem into another.
- The secondary defender, not the initial contest, causes the turnover.
- The exit door opens directly into the waiting room.

### `skill.dribble_crossover_ballshield`

**Trigger:** Player lowers and shields a legal crossover so the defender's reaching attempt misses, then retains possession into a new lane.

**Placeholders:** `{defender}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires continuous ball-control and foot-placement states; move legality uses the active rulebook.

**Required state:** crossover_height; torso_shield; reach_attempt; retention

**Consequences:** Improve crossover protection independently of speed.

**Media examples:**

- {player} keeps the crossover beyond {defender}'s reach.
- Shielding changes ball exposure during the direction switch.
- {defender} reaches for a ball that has changed neighborhoods.

### `skill.footwork_pivot_escape`

**Trigger:** Trapped player uses a legal reverse pivot to reopen a passing lane and completes the pass without a turnover.

**Placeholders:** `{opp}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires continuous ball-control and foot-placement states; move legality uses the active rulebook.

**Required state:** pivot_anchor; pivot_direction; trap_layout; completed_pass

**Consequences:** Build pivot confidence; mobility ends when the live dribble is exhausted.

**Media examples:**

- {player}'s reverse pivot reopens the pass.
- His pivot foot stays legal while the receiving angle changes.
- {opp} close the lane; {player} rotates the floor plan.

### `skill.footwork_gather_mistimed`

**Trigger:** Player's chosen gather begins earlier than his movement estimate, so subsequent steps trigger a confirmed violation under current rules.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires continuous ball-control and foot-placement states; move legality uses the active rulebook.

**Required state:** gather_point; step_log; active_step_rule; violation

**Consequences:** Add gather-timing correction without assuming identical rules across eras.

**Media examples:**

- {player}'s early gather turns the drive into a violation.
- The active step rule is applied to the recorded gather point.
- The feet keep their plan after the ball has changed the count.

### `skill.dribble_chest_square_reset`

**Trigger:** Player voluntarily resquares his torso after an off-balance handle sequence and completes a safe pass rather than the selected risky shot.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires continuous ball-control and foot-placement states; move legality uses the active rulebook.

**Required state:** balance_state; torso_angle; cancel_choice; pass_completion

**Consequences:** Reward composure; reduce forced-attempt tendency.

**Media examples:**

- {player} restores his balance and chooses the pass.
- The reset sacrifices the immediate shot to recover control.
- A smaller highlight produces a cleaner possession.

### `skill.dribble_sideline_escape`

**Trigger:** Handler preserves a legal inward escape lane before an opponent trap reaches the sideline and advances safely.

**Placeholders:** `{opp}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires continuous ball-control and foot-placement states; move legality uses the active rulebook.

**Required state:** boundary_distance; trap_arrival; escape_vector; advance_result

**Consequences:** Add boundary awareness to handling decisions.

**Media examples:**

- {player} escapes inward before {opp} close the sideline trap.
- Boundary awareness preserves the remaining route.
- The sideline joins the defense, but {player} leaves before the meeting.

### `skill.dribble_dead_ball_bait`

**Trigger:** Handler intentionally ends his dribble to invite pressure, then uses a rehearsed release pass for a made shot.

**Placeholders:** `{opp}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires continuous ball-control and foot-placement states; move legality uses the active rulebook.

**Required state:** dribble_end_intent; pressure_response; rehearsed_release; shot_result

**Consequences:** Build team bait-set familiarity; failed release creates severe possession risk.

**Media examples:**

- {player} gives up the dribble and springs the planned pass.
- The dead-ball bait draws pressure into a prepared release.
- {opp} smell a trap and find they are standing inside it.

### `skill.dribble_hesitation_no_carry`

**Trigger:** A hesitation legally keeps the hand outside the carry criteria, freezes the defender, and creates a scoring attempt.

**Placeholders:** `{defender}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires continuous ball-control and foot-placement states; move legality uses the active rulebook.

**Required state:** hand_ball_position; carry_rule; hesitation_response; scoring_attempt

**Consequences:** Increase legal hesitation mastery and mark defensive susceptibility.

**Media examples:**

- {player}'s legal hesitation freezes {defender}.
- The ball-control log satisfies the current carry rule.
- {defender} pauses. The rulebook does not.

### `skill.footwork_jumpstop_options`

**Trigger:** Player executes a legal jump stop that preserves both available pivot choices, then selects the side opposite the help defender for a basket.

**Placeholders:** `{opp}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires continuous ball-control and foot-placement states; move legality uses the active rulebook.

**Required state:** landing_pattern; pivot_options; help_side; shot_result

**Consequences:** Improve stop-control decisions with era-specific legality.

**Media examples:**

- {player}'s jump stop preserves the useful pivot.
- The active footwork rule leaves two options before the decision.
- {opp}'s help choose a side; {player} chooses the other.

## 41. Screening, cutting, and offensive geometry

### `tactics.screen_slip_early`

**Trigger:** Screener slips before contact when his defender precommits to a switch; he receives the ball and scores.

**Placeholders:** `{opp}`, `{player}`, `{teammate}`

**Modes:** player; franchise

**Availability:** Requires off-ball routes, screen contacts, and teammate decision tags.

**Required state:** screen_contact; switch_commit; slip_route; shot_result

**Consequences:** Increase slip-read chemistry and discourage premature switching.

**Media examples:**

- {player} slips the switch before the screen lands.
- Early switching creates {teammate}'s passing window.
- {opp} trade assignments on a screen that never arrives.

### `tactics.screen_rescreen_flip`

**Trigger:** Screener legally changes the screen angle after the first route is denied, creating a made ball-handler shot.

**Placeholders:** `{defender}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires off-ball routes, screen contacts, and teammate decision tags.

**Required state:** first_angle; denial; second_angle; shot_result

**Consequences:** Build rescreen coordination and force multi-angle coverage.

**Media examples:**

- {player} flips the screen and opens the second route.
- The rescreen changes {defender}'s recovery direction.
- The first door closes; the same screen builds another.

### `tactics.screen_ghost_pop`

**Trigger:** Player fakes setting a screen without contact, pops to an available shooting zone, receives the ball, and makes the shot.

**Placeholders:** `{opp}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires off-ball routes, screen contacts, and teammate decision tags.

**Required state:** fake_screen; no_contact; pop_zone; catch; shot_result

**Consequences:** Add ghost-screen familiarity and a scoutable pop tendency.

**Media examples:**

- {player} leaves the ghost screen for an open catch.
- Anticipation creates the separation without physical screening.
- {opp} prepare for contact and get a disappearing act.

### `tactics.screen_ram_preparation`

**Trigger:** An off-ball legal screen frees the future ball screener, preventing the opponent from setting its planned coverage before a scored action.

**Placeholders:** `{opp}`, `{team}`

**Modes:** player; franchise

**Availability:** Requires off-ball routes, screen contacts, and teammate decision tags.

**Required state:** prep_screen; screener_delay; coverage_readiness; shot_result

**Consequences:** Unlock layered-screen playbook knowledge.

**Media examples:**

- {team} clear the screener before running the main action.
- The preparatory screen delays {opp}'s coverage position.
- Even the screen gets a screen on this possession.

### `tactics.screen_brush_false_positive`

**Trigger:** Tracking finds no screen contact or legal obstruction despite visual proximity; a made shot is attributed to the handler's separation alone.

**Placeholders:** `{player}`, `{teammate}`

**Modes:** player; franchise

**Availability:** Requires off-ball routes, screen contacts, and teammate decision tags.

**Required state:** screen_obstruction; contact_log; separation_source; shot_result

**Consequences:** Avoid false screen-assist chemistry gains.

**Media examples:**

- {player} earns the separation without a credited screen.
- Nearby bodies do not establish a screening contribution.
- {teammate} appears in the picture; {player} does the escaping.

### `tactics.cut_backdoor_overplay`

**Trigger:** Defender denies an outside catch; attacker cuts behind him, receives a pass, and scores.

**Placeholders:** `{defender}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires off-ball routes, screen contacts, and teammate decision tags.

**Required state:** catch_denial; defender_orientation; cut_route; shot_result

**Consequences:** Improve denial counters and increase defender rear-side awareness.

**Media examples:**

- {player} punishes {defender}'s denial with a backdoor cut.
- The overplay opens the route behind the receiving lane.
- {defender} guards the invitation while {player} uses the entrance.

### `tactics.cut_baseline_drift`

**Trigger:** Off-ball player drifts along the baseline opposite a teammate's drive and receives a pass for a made shot.

**Placeholders:** `{opp}`, `{player}`, `{teammate}`

**Modes:** player; franchise

**Availability:** Requires off-ball routes, screen contacts, and teammate decision tags.

**Required state:** drive_vector; drift_route; pass_window; shot_result

**Consequences:** Improve drive-and-drift pairing chemistry.

**Media examples:**

- {player} drifts into {teammate}'s passing window.
- Baseline movement tracks the drive's changing angle.
- {opp} follow the ball and lose its destination.

### `tactics.cut_lift_from_corner`

**Trigger:** Corner player lifts to a higher passing angle as baseline help arrives, receives the pass, and scores.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires off-ball routes, screen contacts, and teammate decision tags.

**Required state:** corner_occupancy; help_route; lift_route; shot_result

**Consequences:** Build lift-read timing; vacated corners change future spacing.

**Media examples:**

- {player} lifts out of the corner and finds the catch.
- The relocation avoids the help defender's baseline obstruction.
- The open address moves upstairs before the pass arrives.

### `tactics.cut_two_players_same_gap`

**Trigger:** Two coordinated cuts mistakenly target one open lane, causing collision avoidance that wastes the passing window without a foul.

**Placeholders:** `{team}`

**Modes:** player; franchise

**Availability:** Requires off-ball routes, screen contacts, and teammate decision tags.

**Required state:** cutter_routes; route_overlap; avoidance; pass_window_expired

**Consequences:** Lower route coordination and trigger staggered-cut practice.

**Media examples:**

- {team} send two cutters through one opening.
- Route overlap erases the available catch window.
- One good lane gets twice the traffic it can handle.

### `tactics.screen_pin_in_help`

**Trigger:** A legal off-ball screen pins the designated help defender away from a teammate's drive, which ends in a basket.

**Placeholders:** `{player}`, `{teammate}`

**Modes:** player; franchise

**Availability:** Requires off-ball routes, screen contacts, and teammate decision tags.

**Required state:** help_assignment; pin_screen; drive_path; shot_result

**Consequences:** Build help-screen recognition and invite alternate rotations.

**Media examples:**

- {player} screens the help before {teammate} drives.
- The pin removes the planned second defender from the route.
- The rim help get an appointment somewhere else.

### `tactics.screen_stagger_spacing`

**Trigger:** Two legal sequential screens create separate direction changes that free a cutter for a made catch-and-shoot attempt.

**Placeholders:** `{defender}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires off-ball routes, screen contacts, and teammate decision tags.

**Required state:** screen_sequence; gap_between_screens; cutter_route; shot_result

**Consequences:** Improve stagger timing and opponent trail navigation scouting.

**Media examples:**

- {player} clears both screens and makes the catch count.
- The separation comes from the sequence, not one isolated contact.
- {defender} gets directions that keep changing.

### `tactics.screen_elevator_closed`

**Trigger:** Two stationary legal screeners narrow the gap after a teammate passes between them, blocking the pursuing path and creating a made shot.

**Placeholders:** `{defender}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Requires off-ball routes, screen contacts, and teammate decision tags.

**Required state:** gap_width; teammate_clearance; screener_legality; shot_result

**Consequences:** Add precise timing demands and rule-aware screening risk.

**Media examples:**

- {team} close the screen gap behind {player}.
- Timing preserves legality while removing the pursuit route.
- {defender} misses the elevator.

### `tactics.spacing_dunker_eviction`

**Trigger:** Coach instructs an off-ball player to leave a congested rim-side spot; the cleared lane leads to a made drive.

**Placeholders:** `{coach}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires off-ball routes, screen contacts, and teammate decision tags.

**Required state:** occupied_spot; relocation_order; drive_lane; shot_result

**Consequences:** Update lineup spacing preferences rather than penalize talent alone.

**Media examples:**

- {coach} clears the rim-side spot for {player}.
- Removing one teammate changes the driving corridor.
- The paint improves after somebody moves out.

### `tactics.cut_screen_fake_relocate`

**Trigger:** Cutter fakes using an off-ball screen, reverses direction when the defender cheats over, and makes a received shot.

**Placeholders:** `{defender}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires off-ball routes, screen contacts, and teammate decision tags.

**Required state:** expected_route; defender_cheat; reverse_cut; shot_result

**Consequences:** Teach screen-rejection reads off the ball.

**Media examples:**

- {player} refuses the expected screen route.
- {defender}'s shortcut creates the reverse-cut window.
- The defender skips a step and loses the destination.

### `tactics.spacing_one_side_clear`

**Trigger:** Team deliberately clears all off-ball teammates from the ball handler's side; the resulting isolation produces a made attempt without help arrival.

**Placeholders:** `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Requires off-ball routes, screen contacts, and teammate decision tags.

**Required state:** teammate_side; clearout_order; help_distance; shot_result

**Consequences:** Add side-clear isolation knowledge and weak-side rotation counters.

**Media examples:**

- {team} empty the side for {player}.
- The logged clear-out lengthens the available help route.
- {player} gets a little more room to conduct business.

## 42. Defensive coverage decisions

### `tactics.defense_toplock_escape`

**Trigger:** Defender denies the upward route of a shooter; shooter attempts the coached baseline escape, but rotating help stops the attempt without a foul.

**Placeholders:** `{opp}`, `{team}`

**Modes:** player; franchise

**Availability:** Requires individual defensive assignments, help timing, and tagged opponent actions.

**Required state:** toplock_assignment; escape_route; help_timing; shot_result

**Consequences:** Improve linked denial-help communication.

**Media examples:**

- {team} pair the top lock with the waiting help.
- The denied route is covered by a planned second rotation.
- {opp} find the escape marked closed.

### `tactics.defense_ice_sideline`

**Trigger:** On a side ball screen, defenders force the handler toward the boundary and contain the resulting possession without a made basket.

**Placeholders:** `{opp}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Requires individual defensive assignments, help timing, and tagged opponent actions.

**Required state:** screen_side; force_direction; containment; possession_result

**Consequences:** Reinforce boundary coverage; scout rejects and rescreens.

**Media examples:**

- {team} steer {player} away from the middle.
- Boundary-directed coverage controls the screen's preferred lane.
- {opp}'s route planner loses the middle option.

### `tactics.defense_show_recover`

**Trigger:** Screen defender briefly shows pressure, then recovers to his assignment before a pass can exploit the opening.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires individual defensive assignments, help timing, and tagged opponent actions.

**Required state:** show_duration; recovery_distance; pass_window; possession_result

**Consequences:** Improve calibrated hedging instead of permanent switching.

**Media examples:**

- {player} shows at the screen and gets back in time.
- Pressure duration stays within the tracked recovery window.
- Two jobs, one defender, and no open appointment.

### `tactics.defense_drop_depth_adjust`

**Trigger:** Coach moves a drop defender's pickup depth forward after repeated intermediate attempts; the next tracked action ends in a missed contested shot.

**Placeholders:** `{coach}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires individual defensive assignments, help timing, and tagged opponent actions.

**Required state:** drop_depth; adjustment_reason; next_action; contest_result

**Consequences:** Record matchup-specific depth and expose lob space behind it.

**Media examples:**

- {coach} brings {player}'s drop coverage forward.
- The new pickup depth changes the intermediate shooting window.
- The open space receives a defender's forwarding address.

### `tactics.defense_peel_switch`

**Trigger:** A beaten on-ball defender switches onto the helper's previous assignment while the helper stops the drive and the team completes the stop.

**Placeholders:** `{team}`

**Modes:** player; franchise

**Availability:** Requires individual defensive assignments, help timing, and tagged opponent actions.

**Required state:** beaten_defender; helper_takeover; vacated_assignment; stop_result

**Consequences:** Improve emergency switching cohesion.

**Media examples:**

- {team} complete the peel switch behind the drive.
- The displaced defender fills the vacated assignment rather than chasing the ball.
- Losing the first matchup does not lose the whole possession.

### `tactics.defense_scram_small_matchup`

**Trigger:** Teammates legally exchange assignments away from the ball to remove a smaller defender from a targeted interior mismatch before an entry.

**Placeholders:** `{opp}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Requires individual defensive assignments, help timing, and tagged opponent actions.

**Required state:** mismatch_target; offball_exchange; entry_time; assignment_state

**Consequences:** Add scram-switch coordination and counter-entry scouting.

**Media examples:**

- {team} move {player} out of the targeted mismatch.
- The off-ball exchange happens before the entry arrives.
- {opp} prepare the matchup and discover it has moved.

### `tactics.defense_late_double_turnover`

**Trigger:** Team delays a post double until the ball handler turns away from his outlet, and the resulting trap forces a turnover.

**Placeholders:** `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Requires individual defensive assignments, help timing, and tagged opponent actions.

**Required state:** post_orientation; outlet_visibility; double_time; turnover_event

**Consequences:** Build timing-based post pressure and ball-handler outlet counters.

**Media examples:**

- {team} wait for {player}'s turn before sending help.
- The double arrives after the easy outlet leaves his view.
- The extra defender knocks when the exit is hardest to see.

### `tactics.defense_stunt_no_commit`

**Trigger:** Helper briefly stunts at a drive, causing pickup, then recovers to prevent a completed escape pass.

**Placeholders:** `{opp}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires individual defensive assignments, help timing, and tagged opponent actions.

**Required state:** stunt_depth; pickup_event; recovery_time; pass_denial

**Consequences:** Improve feint-help skill with overcommit risk.

**Media examples:**

- {player}'s stunt interrupts the drive without abandoning his assignment.
- Brief help influences the ball while preserving recovery distance.
- {opp} mistake the visit for a permanent move.

### `tactics.defense_nail_help_corner_cost`

**Trigger:** Helper leaves a perimeter receiver to stop a central drive, but the ball handler finds the vacated receiver for a made shot.

**Placeholders:** `{opp}`, `{team}`

**Modes:** player; franchise

**Availability:** Requires individual defensive assignments, help timing, and tagged opponent actions.

**Required state:** central_help; origin_assignment; kickout; shot_result

**Consequences:** Store coverage tradeoff rather than blame one defender generically.

**Media examples:**

- {opp} score where {team}'s central help began.
- The drive stop transfers risk to the abandoned assignment.
- The paint gets help; the receiver gets a gift.

### `tactics.defense_xout_closeouts`

**Trigger:** Two weak-side defenders cross their recovery assignments after help and successfully contest the resulting perimeter shot.

**Placeholders:** `{team}`

**Modes:** player; franchise

**Availability:** Requires individual defensive assignments, help timing, and tagged opponent actions.

**Required state:** help_origin; xout_assignments; closeout_distances; shot_result

**Consequences:** Improve multi-defender recovery chemistry.

**Media examples:**

- {team} complete the crossed recovery behind the help.
- The exchange shortens both closeout routes.
- Two defenders change addresses without losing the mail.

### `tactics.defense_closeout_brake`

**Trigger:** Defender deliberately brakes a closeout to avoid a pump-fake foul and contains the subsequent dribble.

**Placeholders:** `{opponent}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires individual defensive assignments, help timing, and tagged opponent actions.

**Required state:** closeout_speed; brake_point; fake_response; containment

**Consequences:** Add disciplined-closeout mastery.

**Media examples:**

- {player} stops short and stays in front of {opponent}.
- Controlled arrival trades maximum speed for balanced containment.
- The pump fake asks for a flight; {player} stays grounded.

### `tactics.defense_force_weakside`

**Trigger:** Defender follows a scouted hand-forcing instruction, funnels the attacker toward his less effective side, and records a stop.

**Placeholders:** `{opponent}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires individual defensive assignments, help timing, and tagged opponent actions.

**Required state:** hand_preference; force_side; attacker_route; stop_result

**Consequences:** Strengthen matchup scout trust without permanent superiority claims.

**Media examples:**

- {player} sends {opponent} toward the scouted weaker side.
- The stop follows a documented direction choice.
- The scouting note finally gets to defend a possession.

### `tactics.defense_switch_post_front`

**Trigger:** A forced switch leaves an interior mismatch, but the new defender fronts legally and denies the entry for the possession.

**Placeholders:** `{opp}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires individual defensive assignments, help timing, and tagged opponent actions.

**Required state:** switched_assignment; front_position; entry_denial; possession_end

**Consequences:** Improve mismatch survival and invite lob counters.

**Media examples:**

- {player} survives the switch by denying the entry.
- Fronting prevents the mismatch from becoming a post touch.
- {opp} get the matchup but not the ball.

### `tactics.defense_offball_ballwatch`

**Trigger:** Defender's tracked gaze stays on the ball as his assigned receiver relocates, leading to a made uncontested catch.

**Placeholders:** `{opponent}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires individual defensive assignments, help timing, and tagged opponent actions.

**Required state:** gaze_target; receiver_route; assignment_gap; shot_result

**Consequences:** Trigger scanning drills and lower off-ball awareness confidence.

**Media examples:**

- {player} watches the ball while {opponent} leaves his assignment.
- The missed relocation comes before the open catch.
- The basketball gets an audience; the receiver gets space.

### `tactics.defense_zone_matchup_handoff`

**Trigger:** A declared matchup zone transfers a cutter between defenders through a recognized handoff cue, producing a defended missed attempt.

**Placeholders:** `{team}`

**Modes:** player; franchise

**Availability:** Requires individual defensive assignments, help timing, and tagged opponent actions.

**Required state:** zone_mode; cutter_sectors; handoff_cue; shot_result

**Consequences:** Improve matchup-zone communication distinct from blanket zone success.

**Media examples:**

- {team} pass the cutter between assignments cleanly.
- The zone handoff preserves coverage through the route.
- The cutter changes neighborhoods without finding a vacancy.

## 43. Rebounding and transition choices

### `skill.rebound_hit_find`

**Trigger:** Defender makes legal box-out contact before locating the airborne ball, then secures the rebound.

**Placeholders:** `{opponent}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires rebound opportunity tracking, body positioning, and transition routes.

**Required state:** legal_contact; ball_location; boxout_order; rebound_owner

**Consequences:** Improve contact-location sequencing rather than raw jump ratings.

**Media examples:**

- {player} handles the body before collecting the ball.
- The contact-first sequence preserves rebounding position.
- {opponent} lose the seat before the ball arrives.

### `skill.rebound_early_flight_miss`

**Trigger:** Player jumps before the rebound reaches his catch envelope, and the opponent collects the descending ball.

**Placeholders:** `{opponent}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires rebound opportunity tracking, body positioning, and transition routes.

**Required state:** takeoff_time; ball_flight; catch_envelope; rebound_owner

**Consequences:** Target timing training instead of assuming insufficient athleticism.

**Media examples:**

- {player}'s early jump leaves the rebound for {opponent}.
- Peak reach occurs before the ball enters the window.
- The best height arrives at the wrong appointment time.

### `skill.rebound_long_bounce_read`

**Trigger:** Player anticipates a tracked long rebound outside the normal paint region and secures it before an inward-moving opponent.

**Placeholders:** `{opponent}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires rebound opportunity tracking, body positioning, and transition routes.

**Required state:** shot_angle; projected_bounce; pursuit_routes; rebound_owner

**Consequences:** Build shot-dependent rebounding anticipation.

**Media examples:**

- {player} reads the long bounce ahead of {opponent}.
- The rebound route follows the shot's projected exit angle.
- The ball changes postal districts; {player} is already there.

### `skill.rebound_tip_to_teammate`

**Trigger:** Player intentionally directs a contested rebound to a teammate who secures possession; official attribution follows current scoring rules.

**Placeholders:** `{player}`, `{teammate}`

**Modes:** player; franchise

**Availability:** Requires rebound opportunity tracking, body positioning, and transition routes.

**Required state:** tip_intent; tip_target; secure_owner; official_attribution

**Consequences:** Reward team rebounding judgment separately from personal totals.

**Media examples:**

- {player} tips the ball safely to {teammate}.
- Controlled direction secures team possession without a personal catch.
- The rebound needs a delivery service, and {player} supplies it.

### `skill.rebound_wedge_inside`

**Trigger:** Player legally works from behind to establish inside rebounding position before the shot reaches the rim and then secures the miss.

**Placeholders:** `{opponent}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires rebound opportunity tracking, body positioning, and transition routes.

**Required state:** starting_position; legal_route; inside_position; rebound_owner

**Consequences:** Improve positioning skill and expose early-contact counters.

**Media examples:**

- {player} wins the inside position before the rebound.
- The route change precedes the ball's arrival.
- {opponent} lose the better address before the delivery.

### `skill.rebound_chase_boundary_save`

**Trigger:** Player saves a rebound legally before it crosses a boundary and sends it to his team rather than blindly into the middle.

**Placeholders:** `{player}`, `{teammate}`

**Modes:** player; franchise

**Availability:** Requires rebound opportunity tracking, body positioning, and transition routes.

**Required state:** boundary_distance; last_touch; save_target; possession_owner

**Consequences:** Build targeted-save skill and reduce blind-rescue habits.

**Media examples:**

- {player} saves the rebound to {teammate}.
- The target choice preserves team possession on the boundary rescue.
- A desperate save still finds a proper address.

### `skill.rebound_crash_transition_cost`

**Trigger:** Coach orders an additional offensive rebounder to crash; the missed rebound leaves the recorded transition lane uncovered for an opponent basket.

**Placeholders:** `{team}`

**Modes:** player; franchise

**Availability:** Requires rebound opportunity tracking, body positioning, and transition routes.

**Required state:** crash_order; rebound_result; floor_balance; transition_score

**Consequences:** Adjust crash-versus-retreat preferences and store tactical responsibility.

**Media examples:**

- {team}'s extra rebound chase leaves a transition lane open.
- The gamble has a logged floor-balance cost.
- One more person at the glass means one fewer on the road home.

### `skill.rebound_retreat_forced_reset`

**Trigger:** A designated retreat player forgoes an offensive rebound chance, arrives ahead of the outlet, and forces the opponent to abandon a fast attack.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires rebound opportunity tracking, body positioning, and transition routes.

**Required state:** rebound_opportunity; retreat_intent; outlet_arrival; attack_reset

**Consequences:** Reward preventive transition work separately from steals or blocks.

**Media examples:**

- {player} retreats early and closes the break.
- The decision sacrifices rebound opportunity for transition containment.
- No rebound credit, but the road home stays covered.

### `skill.rebound_teammates_compete`

**Trigger:** Two teammates reach for the same uncontested rebound without a claim cue, knocking it away to the opponent.

**Placeholders:** `{team}`

**Modes:** player; franchise

**Availability:** Requires rebound opportunity tracking, body positioning, and transition routes.

**Required state:** rebound_claims; cue_missing; contact_result; possession_owner

**Consequences:** Add rebound-call practice and pairing trust penalties.

**Media examples:**

- {team} lose a rebound by both trying to own it.
- Missing communication converts an uncontested chance into a turnover of possession.
- One ball receives two claims and finds a third owner.

### `skill.rebound_seal_for_other`

**Trigger:** Player legally seals the nearest opponent while deliberately leaving a teammate to collect the ball.

**Placeholders:** `{player}`, `{teammate}`

**Modes:** player; franchise

**Availability:** Requires rebound opportunity tracking, body positioning, and transition routes.

**Required state:** seal_assignment; rebound_choice; collector; team_possession

**Consequences:** Reward enabling box-outs and defensive-rebound cooperation.

**Media examples:**

- {player} secures the position; {teammate} secures the rebound.
- The seal creates possession without claiming the statistic.
- The box score thanks one player for a two-player job.

### `skill.transition_drag_screen`

**Trigger:** A trailing teammate sets a legal drag screen before the defense reaches its planned positions, leading to a made attempt.

**Placeholders:** `{opp}`, `{team}`

**Modes:** player; franchise

**Availability:** Requires rebound opportunity tracking, body positioning, and transition routes.

**Required state:** transition_positions; drag_time; legality; shot_result

**Consequences:** Build early-offense screen familiarity.

**Media examples:**

- {team} screen before {opp} finish getting organized.
- Early screen timing exploits the unset coverage.
- The defense starts its meeting after the action has begun.

### `skill.transition_crossmatch_hunt`

**Trigger:** Team identifies a temporary transition mismatch and deliberately feeds that matchup for a basket before assignments normalize.

**Placeholders:** `{opp}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Requires rebound opportunity tracking, body positioning, and transition routes.

**Required state:** transition_assignments; mismatch_target; entry_time; shot_result

**Consequences:** Add cross-match recognition and opponent recovery priorities.

**Media examples:**

- {team} find the temporary mismatch for {player}.
- The entry beats {opp}'s assignment recovery.
- The matchup window closes just after the ball goes through it.

### `skill.transition_outlet_spinout`

**Trigger:** Outlet receiver spins away from the expected passing window just as the pass leaves, producing an unforced turnover.

**Placeholders:** `{player}`, `{teammate}`

**Modes:** player; franchise

**Availability:** Requires rebound opportunity tracking, body positioning, and transition routes.

**Required state:** outlet_release; receiver_rotation; target_window; turnover

**Consequences:** Lower outlet chemistry and trigger receiver-route rehearsal.

**Media examples:**

- {player}'s route changes after {teammate} releases the outlet.
- Release timing and receiver movement disagree.
- The pass has an old address and no forwarding notice.

### `skill.transition_middle_lane_traffic`

**Trigger:** Ball handler chooses the middle lane despite two teammates filling it, collides through legal avoidance with his own spacing, and loses the fast-break advantage.

**Placeholders:** `{team}`

**Modes:** player; franchise

**Availability:** Requires rebound opportunity tracking, body positioning, and transition routes.

**Required state:** lane_choices; route_convergence; avoidance; advantage_expired

**Consequences:** Assign transition lanes more clearly without inventing an opponent stop.

**Media examples:**

- {team} crowd their own transition route.
- Three paths converge before the defense needs to stop them.
- The fast break runs into team traffic.

### `skill.transition_numbers_declined`

**Trigger:** Handler recognizes that an apparent advantage has equal defenders already recovered, pulls out, and begins a safe half-court set.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires rebound opportunity tracking, body positioning, and transition routes.

**Required state:** attacker_count; defender_count; pullout_choice; set_entry

**Consequences:** Reward transition judgment instead of treating every retreat as timid.

**Media examples:**

- {player} cancels the break when the numbers disappear.
- The live count changes the decision before a forced attempt.
- The highlight invitation expires; the possession survives.

## 44. In-game coaching controls

### `tactics.coach_pace_override`

**Trigger:** Player deliberately pushes the ball despite an active slow-tempo order; possession ends before the called set with a missed attempt.

**Placeholders:** `{coach}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires live coach orders, legal substitutions, and possession-level comparisons; no fixed period length is assumed.

**Required state:** tempo_order; player_override; set_state; shot_result

**Consequences:** Reduce tactical trust while preserving the player's agency.

**Media examples:**

- {player} speeds past {coach}'s tempo instruction.
- The possession departs from the stored plan before the shot.
- The playbook wants patience; the ball files a different itinerary.

### `tactics.coach_matchup_hide`

**Trigger:** Coach reallocates a targeted defender to a low-involvement opponent; the next tracked attack is redirected elsewhere.

**Placeholders:** `{coach}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires live coach orders, legal substitutions, and possession-level comparisons; no fixed period length is assumed.

**Required state:** targeted_defender; new_assignment; next_attack_target

**Consequences:** Track protection success and let opponents counter through new actions.

**Media examples:**

- {coach} moves {player} away from the hunted matchup.
- The reassignment changes which defender the next attack targets.
- The weak link gets a new office before the callers arrive.

### `tactics.coach_substitution_window_lost`

**Trigger:** A requested substitution misses its legal entry window because play restarts before the replacement reports correctly.

**Placeholders:** `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Requires live coach orders, legal substitutions, and possession-level comparisons; no fixed period length is assumed.

**Required state:** substitution_request; report_status; entry_window; restart

**Consequences:** Extend current lineup exposure; update bench coordination.

**Media examples:**

- {team} miss the legal window for {player}'s entry.
- The requested change remains pending under the current substitution rule.
- The rotation has a plan; the scorer's table has a deadline.

### `tactics.coach_foul_budget_shift`

**Trigger:** Coach lowers a player's permitted contact-risk setting after his personal-foul count approaches the current disqualification threshold; subsequent defense avoids another foul.

**Placeholders:** `{coach}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires live coach orders, legal substitutions, and possession-level comparisons; no fixed period length is assumed.

**Required state:** foul_count; disqualification_limit; risk_order; next_defense

**Consequences:** Trade aggression for continued availability without assuming six-foul rules.

**Media examples:**

- {coach} reduces {player}'s contact budget.
- The active foul limit changes the defensive risk tolerance.
- The defender stays involved without inviting another whistle.

### `tactics.coach_timeout_set_broken`

**Trigger:** Team leaves a legal timeout with a called set, but an opponent denial makes the designated first option unavailable and the players choose a fallback.

**Placeholders:** `{coach}`, `{opp}`, `{team}`

**Modes:** player; franchise

**Availability:** Requires live coach orders, legal substitutions, and possession-level comparisons; no fixed period length is assumed.

**Required state:** timeout_set; first_option_denial; fallback_choice; possession_result

**Consequences:** Increase fallback familiarity; update opponent timeout scouting.

**Media examples:**

- {opp} deny the first option from {coach}'s huddle.
- {team} use the recorded fallback rather than improvising blindly.
- The timeout drawing meets a defender with other plans.

### `tactics.coach_offense_install_live`

**Trigger:** Coach introduces a previously unused legal set during a live game; players execute all required route cues correctly on its first possession.

**Placeholders:** `{coach}`, `{team}`

**Modes:** player; franchise

**Availability:** Requires live coach orders, legal substitutions, and possession-level comparisons; no fixed period length is assumed.

**Required state:** set_id; prior_usage; live_instruction; cue_execution

**Consequences:** Unlock in-game install trust, with future learning costs still active.

**Media examples:**

- {team} execute {coach}'s new set on the first attempt.
- The route log matches the fresh instruction.
- New handwriting, familiar teamwork.

### `tactics.coach_language_shortcall`

**Trigger:** Coach replaces a lengthy play signal with a rehearsed short call because little legal setup time remains; team enters the correct set.

**Placeholders:** `{coach}`, `{team}`

**Modes:** player; franchise

**Availability:** Requires live coach orders, legal substitutions, and possession-level comparisons; no fixed period length is assumed.

**Required state:** signal_length; setup_time; shortcall_rehearsal; set_entry

**Consequences:** Reward communication preparedness instead of creating extra clock time.

**Media examples:**

- {coach}'s short call puts {team} into the right action.
- The compressed signal fits the remaining setup window.
- A shorter sentence saves the possession a longer conversation.

### `tactics.coach_player_veto_success`

**Trigger:** Authorized floor leader rejects the initial called play based on a visible mismatch, selects an approved alternative, and it produces a basket.

**Placeholders:** `{coach}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires live coach orders, legal substitutions, and possession-level comparisons; no fixed period length is assumed.

**Required state:** veto_permission; mismatch_read; approved_alternative; shot_result

**Consequences:** Strengthen delegated control while exposing rejected-play review.

**Media examples:**

- {player} uses the approved veto and finds the better matchup.
- The change stays within {coach}'s delegated decision options.
- The playbook allows an edit, and the floor makes it count.

### `tactics.coach_conflicting_signals`

**Trigger:** Two authorized staff signals give different sets on the same possession, causing players to occupy incompatible starting positions.

**Placeholders:** `{team}`

**Modes:** player; franchise

**Availability:** Requires live coach orders, legal substitutions, and possession-level comparisons; no fixed period length is assumed.

**Required state:** staff_signals; set_conflict; starting_positions; setup_failure

**Consequences:** Reduce communication confidence and require a primary caller setting.

**Media examples:**

- {team} receive two different play calls at once.
- Conflicting signals create a documented setup failure.
- The huddle has two authors and one confused floor.

### `tactics.coach_rotation_pair_split`

**Trigger:** Coach separates a heavily paired duo to test independent creation; one player's tracked creation output falls below the predeclared trial baseline.

**Placeholders:** `{coach}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires live coach orders, legal substitutions, and possession-level comparisons; no fixed period length is assumed.

**Required state:** duo_pair; split_trial; creation_metric; baseline

**Consequences:** Inform lineup dependence ratings without equating it to overall talent.

**Media examples:**

- {coach}'s split-pair trial changes {player}'s creation output.
- The assessment compares the trial to its stored baseline.
- The partnership looks easier to replace on the rotation sheet.

### `tactics.coach_emergency_ballhandler`

**Trigger:** All planned ball handlers become unavailable under verified game conditions; coach designates a new player who completes a pressure advance.

**Placeholders:** `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Requires live coach orders, legal substitutions, and possession-level comparisons; no fixed period length is assumed.

**Required state:** planned_handlers; availability; emergency_assignment; advance_result

**Consequences:** Add emergency-role familiarity and workload exposure.

**Media examples:**

- {player} handles the emergency advance for {team}.
- The assignment follows the recorded loss of planned handlers.
- An unfamiliar job gets an unexpectedly steady first shift.

### `tactics.coach_offball_energy_budget`

**Trigger:** Coach reduces a fatigued player's off-ball route load while keeping him active; his tracked sprint workload falls without a missed assignment.

**Placeholders:** `{coach}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires live coach orders, legal substitutions, and possession-level comparisons; no fixed period length is assumed.

**Required state:** fatigue_state; route_load; adjustment; assignment_execution

**Consequences:** Change tactical role and energy recovery without medical claims.

**Media examples:**

- {coach} trims {player}'s off-ball workload.
- The new route plan preserves the required assignments with fewer sprints.
- Less running gets designed, not merely hoped for.

### `tactics.coach_hot_hand_order_counter`

**Trigger:** Coach routes consecutive called actions to a recently accurate shooter, but opponent top priority denies the next catch and forces a different option.

**Placeholders:** `{coach}`, `{opp}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires live coach orders, legal substitutions, and possession-level comparisons; no fixed period length is assumed.

**Required state:** recent_accuracy; target_order; opponent_priority; denied_catch

**Consequences:** Enable dynamic attention feedback rather than automatic hot-hand bonuses.

**Media examples:**

- {opp} deny {coach}'s next action for {player}.
- Recent shooting changes both the offensive plan and defensive priority.
- The hot hand receives a very cold welcome at the catch.

### `tactics.coach_playcall_disobey_team`

**Trigger:** Several players knowingly run their preferred set instead of the coach's documented call; the possession's result is separately recorded.

**Placeholders:** `{coach}`, `{team}`

**Modes:** player; franchise

**Availability:** Requires live coach orders, legal substitutions, and possession-level comparisons; no fixed period length is assumed.

**Required state:** coach_call; player_choice; route_log; result; discipline_policy

**Consequences:** Change coach trust and autonomy settings, independent of make or miss.

**Media examples:**

- {team} choose their own action over {coach}'s call.
- The route log identifies deliberate team-level disobedience.
- The playbook gets outvoted on the floor.

### `tactics.coach_decoy_star_role`

**Trigger:** Coach assigns the primary scorer as a decoy; two defenders follow him and the designed alternate receiver scores.

**Placeholders:** `{player}`, `{teammate}`

**Modes:** player; franchise

**Availability:** Requires live coach orders, legal substitutions, and possession-level comparisons; no fixed period length is assumed.

**Required state:** decoy_assignment; defenders_follow; alternate_target; shot_result

**Consequences:** Credit decoy impact and teach opponents selective attention.

**Media examples:**

- {player}'s decoy route opens the basket for {teammate}.
- Defensive attention moves where the play intended.
- The headline name does useful work without receiving the shot.

## 45. Opponent scouting and countermoves

### `tactics.scout_tendency_small_sample`

**Trigger:** Staff explicitly label a new opponent tendency as low-confidence because the available sample misses the declared minimum.

**Placeholders:** `{player}`, `{sample}`, `{team}`

**Modes:** player; franchise

**Availability:** Requires logged tendencies and scout-version history; report certainty depends on its observation sample.

**Required state:** tendency_id; observed_sample; minimum_sample; confidence_label

**Consequences:** Prevent low-sample tendencies from becoming permanent facts.

**Media examples:**

- {team} flag the report on {player} as provisional.
- {sample} observations do not clear the stored confidence threshold.
- The scouting file has a theory and a very small stack of receipts.

### `tactics.scout_prediction_exploited`

**Trigger:** Team baits an opponent into a behavior predicted by a prior logged tendency, then completes its rehearsed counter for a basket.

**Placeholders:** `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Requires logged tendencies and scout-version history; report certainty depends on its observation sample.

**Required state:** prediction_version; bait_action; observed_response; counter_result

**Consequences:** Raise model confidence while allowing opponent adaptation.

**Media examples:**

- {team} turn {player}'s scouted habit into a scoring chance.
- The bait and response match the stored prediction.
- The scouting note gets its own successful trap.

### `tactics.scout_new_move_surprise`

**Trigger:** Opponent uses a legal move absent from the active scout's tracked repertoire, defeating the specifically prepared counter.

**Placeholders:** `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Requires logged tendencies and scout-version history; report certainty depends on its observation sample.

**Required state:** active_report; repertoire_known; new_move; counter_failure

**Consequences:** Update opponent repertoire and lower stale-report confidence.

**Media examples:**

- {player} adds a move the {team} scout did not contain.
- The preparation fails on a documented repertoire gap.
- The scouting folder needs another page.

### `tactics.scout_film_age_cost`

**Trigger:** Team follows a report older than a logged opponent mechanics change; the outdated assumption creates a failed defensive assignment.

**Placeholders:** `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Requires logged tendencies and scout-version history; report certainty depends on its observation sample.

**Required state:** report_timestamp; mechanics_change; assumption; assignment_result

**Consequences:** Add scout freshness checks and report-refresh pressure.

**Media examples:**

- {team} defend an older version of {player}'s game.
- The report predates the documented technique change.
- Yesterday's scouting address misses today's player.

### `tactics.scout_false_hand_preference`

**Trigger:** A matched-sample assessment overturns the report's claimed dominant driving direction before the next matchup plan is approved.

**Placeholders:** `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Requires logged tendencies and scout-version history; report certainty depends on its observation sample.

**Required state:** old_preference; matched_sample; revised_preference; plan_status

**Consequences:** Rebuild coverage direction without fabricating past outcomes.

**Media examples:**

- {team} revise the drive-direction report on {player}.
- The validated sample reverses the earlier preference estimate.
- The arrow on the scouting page finally points the right way.

### `tactics.scout_hidden_trigger_revealed`

**Trigger:** Tracking identifies that an opponent's pass choice changes only after a specific help-defender cue, enabling a conditional counter plan.

**Placeholders:** `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Requires logged tendencies and scout-version history; report certainty depends on its observation sample.

**Required state:** help_cue; pass_response; conditional_sample; counter_plan

**Consequences:** Unlock conditional scouting instead of universal pass predictions.

**Media examples:**

- {team} identify the cue behind {player}'s pass choice.
- The tendency depends on the help signal rather than a blanket habit.
- The scouting report discovers the switch behind the switch.

### `tactics.scout_left_lane_bait_fail`

**Trigger:** Team deliberately opens an opponent's weaker lane, but he declines the bait and executes an independently logged successful alternate action.

**Placeholders:** `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Requires logged tendencies and scout-version history; report certainty depends on its observation sample.

**Required state:** offered_lane; predicted_choice; actual_action; action_result

**Consequences:** Lower bait confidence and improve opponent decision-resilience reputation.

**Media examples:**

- {player} refuses {team}'s offered lane.
- The opponent chooses the documented alternative rather than the predicted weakness.
- The trap has an invitation nobody accepts.

### `tactics.scout_shared_play_recognition`

**Trigger:** Defender recognizes an opponent set from prior personal participation in that system and calls the correct counter before its first action.

**Placeholders:** `{opp}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires logged tendencies and scout-version history; report certainty depends on its observation sample.

**Required state:** prior_system_experience; recognized_set; call_time; execution

**Consequences:** Reward transferable system knowledge without assuming former-team rivalry.

**Media examples:**

- {player} recognizes {opp}'s set before the opening cue.
- His stored system experience supplies the early defensive call.
- Familiar homework turns up on the other team's desk.

### `tactics.scout_masked_entry`

**Trigger:** Team uses identical starting positions for two different legal plays; defender commits to the previously scouted version and concedes a basket to the new branch.

**Placeholders:** `{opp}`, `{team}`

**Modes:** player; franchise

**Availability:** Requires logged tendencies and scout-version history; report certainty depends on its observation sample.

**Required state:** shared_alignment; branch_choice; defender_prediction; shot_result

**Consequences:** Add branching-play disguise and scout uncertainty.

**Media examples:**

- {team} disguise a different action in a familiar opening.
- The first positions do not uniquely identify the play.
- {opp} recognize the cover and miss the new chapter.

### `tactics.scout_coverage_frequency_shift`

**Trigger:** Opponent changes its coverage mix beyond the scouting model's registered range during the game, triggering a formal live report refresh.

**Placeholders:** `{opp}`, `{team}`

**Modes:** player; franchise

**Availability:** Requires logged tendencies and scout-version history; report certainty depends on its observation sample.

**Required state:** expected_mix; observed_mix; deviation_limit; report_refresh

**Consequences:** Adjust live play recommendations without presuming the new coverage succeeds.

**Media examples:**

- {team} update the live report as {opp} change their coverage mix.
- Observed frequencies move outside the model's prepared range.
- The game refuses to stay inside the pregame percentages.

### `tactics.scout_shooter_relocation_map`

**Trigger:** Staff identify that a shooter relocates to a recurring destination after passing; the next defender tracks that destination and denies the catch.

**Placeholders:** `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Requires logged tendencies and scout-version history; report certainty depends on its observation sample.

**Required state:** relocation_tendency; pass_event; tracked_destination; denied_catch

**Consequences:** Improve off-ball scout depth and prompt alternate routes.

**Media examples:**

- {team} follow {player}'s post-pass destination.
- The denial uses a logged relocation map, not ball watching.
- The pass is not the end of the scouting assignment.

### `tactics.scout_screen_contact_threshold`

**Trigger:** Staff identify that a defender changes coverage only after actual screen contact; a fake screen leaves him correctly attached to his assignment.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires logged tendencies and scout-version history; report certainty depends on its observation sample.

**Required state:** switch_trigger; contact_observed; fake_screen; assignment_result

**Consequences:** Add contact-dependent defensive reads.

**Media examples:**

- {player} waits for real contact before changing assignments.
- The counter rejects the fake-screen cue in the active report.
- The ghost screen fails to haunt this defender.

### `tactics.scout_play_number_deception`

**Trigger:** Team changes the mapping between a public play number and its actual set; opponent follows the obsolete mapping and the new set produces a basket.

**Placeholders:** `{opp}`, `{team}`

**Modes:** player; franchise

**Availability:** Requires logged tendencies and scout-version history; report certainty depends on its observation sample.

**Required state:** public_call; mapping_version; opponent_mapping; shot_result

**Consequences:** Introduce signal security and limit public-call scout reliability.

**Media examples:**

- {team} change the play behind the familiar number.
- {opp}'s recognition uses an obsolete call mapping.
- The same number now opens a different door.

### `tactics.scout_personnel_conditional`

**Trigger:** Staff detect that an opponent set is used only with a specific legal personnel combination and correctly predict its next appearance.

**Placeholders:** `{opp}`, `{team}`

**Modes:** player; franchise

**Availability:** Requires logged tendencies and scout-version history; report certainty depends on its observation sample.

**Required state:** personnel_combination; conditional_usage; prediction; actual_set

**Consequences:** Add lineup-dependent scouting and counter substitution deception.

**Media examples:**

- {team} connect {opp}'s set to the personnel on the floor.
- The conditional lineup pattern predicts the action before the call.
- The lineup supplies the clue the hand signal was hiding.

### `tactics.scout_self_report_exposed`

**Trigger:** Player is shown the opponent's verified report of his own tendencies and formally selects one targeted skill counter for practice.

**Placeholders:** `{opp}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires logged tendencies and scout-version history; report certainty depends on its observation sample.

**Required state:** external_report; verification; selected_counter; practice_plan

**Consequences:** Link opponent scouting to player agency without immediate skill gains.

**Media examples:**

- {player} reads how {opp} plan to defend him.
- The verified report turns a tendency into a development target.
- His game gets an outside review and an inside response.

## 46. Training choices and opportunity costs

### `development.practice_focus_crowds_out`

**Trigger:** Player allocates most available training time to one skill, and a separately tracked neglected skill declines below its prior baseline.

**Placeholders:** `{focus}`, `{neglected}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires chosen practice plans, limited training resources, and measured baselines; effects occur only after qualifying samples.

**Required state:** practice_budget; focus_skill; neglected_skill; prior_baseline; assessment

**Consequences:** Force a rebalancing choice; gains and decline remain distinct metrics.

**Media examples:**

- {player}'s {focus} work comes with a measured cost to {neglected}.
- The training ledger links the neglected practice volume to the decline.
- One skill gets the calendar; another notices the missing appointments.

### `development.practice_random_order`

**Trigger:** Player completes a randomized drill block and improves retention in an unprompted later test compared with his prior fixed-order baseline.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires chosen practice plans, limited training resources, and measured baselines; effects occur only after qualifying samples.

**Required state:** drill_order; delayed_test; fixed_order_baseline; retention_score

**Consequences:** Improve adaptability, with slower initial repetition speed possible.

**Media examples:**

- {player}'s mixed drill order survives the later test.
- Retention improves outside the practiced sequence.
- The skills remember their job after the drill stops giving directions.

### `development.practice_pressure_transfer`

**Trigger:** Player meets a skill target in quiet practice but misses it in a matched distraction test, formally failing the transfer assessment.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires chosen practice plans, limited training resources, and measured baselines; effects occur only after qualifying samples.

**Required state:** quiet_baseline; pressure_conditions; matched_task; transfer_result

**Consequences:** Unlock pressure-specific practice without deleting technical mastery.

**Media examples:**

- {player}'s practice target does not carry into the pressure test.
- Matching the task isolates the change in distraction conditions.
- The empty-gym version gets a tougher audience.

### `development.practice_variable_distance`

**Trigger:** A varied-distance shooting plan improves measured accuracy across multiple tested distances while reducing specialization at the prior favorite spot.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires chosen practice plans, limited training resources, and measured baselines; effects occur only after qualifying samples.

**Required state:** distance_distribution; prior_spot; multi_zone_test; specialization_delta

**Consequences:** Offer broad-range versus specialist development choices.

**Media examples:**

- {player} gains a broader shooting map at a cost to his favorite spot.
- The assessment separates range coverage from peak specialization.
- More addresses, a little less comfort at home.

### `development.practice_film_overload`

**Trigger:** Player chooses excessive scouting study at the expense of recovery time; next qualified decision test shows slower response despite better recall.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires chosen practice plans, limited training resources, and measured baselines; effects occur only after qualifying samples.

**Required state:** study_hours; recovery_budget; recall_score; response_time

**Consequences:** Add cognitive-load tradeoffs rather than automatic intelligence gains.

**Media examples:**

- {player} remembers more and responds more slowly in the test.
- Recall and reaction are measured separately after the overloaded study plan.
- The scouting answers arrive with a longer loading time.

### `development.practice_partner_timing`

**Trigger:** Two players practice a specific passing route together and improve its timing benchmark without improving the passer's unrelated accuracy tests.

**Placeholders:** `{player}`, `{teammate}`

**Modes:** player; franchise

**Availability:** Requires chosen practice plans, limited training resources, and measured baselines; effects occur only after qualifying samples.

**Required state:** partner_pair; route_id; timing_baseline; general_accuracy

**Consequences:** Build chemistry skill isolated to the practiced interaction.

**Media examples:**

- {player} and {teammate} sharpen one shared passing route.
- The gain is pairing-specific rather than a general passing upgrade.
- Familiar timing gets better without rewriting every pass.

### `development.practice_visual_cues_removed`

**Trigger:** Player trains a route first with visual floor markers, then clears an unmarked retention test after those aids are removed.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires chosen practice plans, limited training resources, and measured baselines; effects occur only after qualifying samples.

**Required state:** marker_aids; aid_removal; route_test; retention_result

**Consequences:** Convert assisted learning into usable unprompted mastery.

**Media examples:**

- {player} runs the route after the markers disappear.
- The unmarked test confirms he retained the spacing cues.
- The floor stops whispering, and he still knows the path.

### `development.practice_routine_skip_cost`

**Trigger:** Player skips his selected pregame control routine despite sufficient legal preparation time and misses its tracked readiness target.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires chosen practice plans, limited training resources, and measured baselines; effects occur only after qualifying samples.

**Required state:** routine_plan; prep_time; skip_choice; readiness_target

**Consequences:** Lower readiness, leaving game outcomes independently simulated.

**Media examples:**

- {player} skips the routine and misses his readiness benchmark.
- The assessment compares his preparation choice with its stored target.
- The shortcut saves minutes and loses the check mark.

### `development.practice_rest_plateau_break`

**Trigger:** After a documented skill plateau, player chooses a planned rest interval and later clears a fresh equivalent skill assessment.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires chosen practice plans, limited training resources, and measured baselines; effects occur only after qualifying samples.

**Required state:** plateau_history; rest_interval; equivalent_test; skill_delta

**Consequences:** Reward recovery scheduling without prescribing medical treatment.

**Media examples:**

- {player}'s fresh assessment clears the old plateau after rest.
- Equivalent test conditions separate recovery from an easier assignment.
- A day away finally helps the work move forward.

### `development.practice_speed_accuracy_trade`

**Trigger:** Player trains faster releases and meets the release-time target while his matched accuracy declines beyond the accepted tolerance.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires chosen practice plans, limited training resources, and measured baselines; effects occur only after qualifying samples.

**Required state:** release_time; accuracy_baseline; tolerance; training_result

**Consequences:** Offer rollback or accuracy consolidation instead of unconditional upgrades.

**Media examples:**

- {player}'s shot gets quicker but less accurate in the assessment.
- The result meets one target and fails the companion measure.
- The ball leaves earlier; the basket agrees less often.

### `development.practice_strength_touch`

**Trigger:** Increased force-production training clears a strength benchmark but disrupts a calibrated soft-touch drill over the next measured window.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires chosen practice plans, limited training resources, and measured baselines; effects occur only after qualifying samples.

**Required state:** strength_plan; force_score; touch_baseline; touch_test

**Consequences:** Unlock touch recalibration; avoid labeling all strength gains harmful.

**Media examples:**

- {player} gains force and loses some measured touch.
- The two tests capture different effects of the selected training emphasis.
- More power needs a quieter setting near the rim.

### `development.practice_unfamiliar_ball`

**Trigger:** Player practices with a legal alternative ball specification, then initially miscalibrates the return to the competition ball in a measured drill.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires chosen practice plans, limited training resources, and measured baselines; effects occur only after qualifying samples.

**Required state:** practice_ball; competition_ball; adaptation_score; return_test

**Consequences:** Add equipment adaptation and forbid unsupported universal effects.

**Media examples:**

- {player} needs to recalibrate after the equipment switch.
- The assessment records a specification change rather than a broken technique.
- The practice ball leaves its own handwriting on the release.

### `development.practice_feedback_dependency`

**Trigger:** Player reaches a drill target only with continuous coach prompts, then fails the same target when cues are withheld.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires chosen practice plans, limited training resources, and measured baselines; effects occur only after qualifying samples.

**Required state:** prompt_frequency; coached_score; unprompted_score; target

**Consequences:** Shift development toward independent decisions.

**Media examples:**

- {player}'s coached result does not survive the unprompted test.
- Cue dependence remains after the technical repetitions.
- The skill works until the instructor stops narrating it.

### `development.practice_deliberate_error`

**Trigger:** Player intentionally tests a legal low-success option in practice to map its failure boundary and improves later option rejection in a blinded test.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires chosen practice plans, limited training resources, and measured baselines; effects occur only after qualifying samples.

**Required state:** test_option; failure_boundary; blind_choice_test; rejection_accuracy

**Consequences:** Reward exploratory practice without treating deliberate game failure as progress.

**Media examples:**

- {player} studies where the move fails before choosing it again.
- The benefit appears in rejection decisions, not a higher success rate for the move.
- A bad practice option teaches a better decision.

### `development.practice_goal_revised`

**Trigger:** Player and staff jointly lower an unattained training target after an assessment shows the original goal exceeded the measured physical envelope.

**Placeholders:** `{coach}`, `{player}`

**Modes:** player; franchise

**Availability:** Requires chosen practice plans, limited training resources, and measured baselines; effects occur only after qualifying samples.

**Required state:** original_target; physical_envelope; assessment; revised_target

**Consequences:** Preserve motivation and redirect skill budget toward feasible gains.

**Media examples:**

- {player} and {coach} replace an unreachable drill target.
- The revised goal follows a measured constraint rather than a mood change.
- The development plan discovers the limits of wishing harder.

## 47. Physical builds and modeled constraints

### `physical.reach_contest_radius`

**Trigger:** A user-selected reach change expands the measured contest envelope but leaves the player's movement-speed rating unchanged in calibration.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires explicit body dimensions and calibrated performance envelopes; fantastical settings require an enabled sandbox builder. No trait implies identity or medical diagnosis.

**Required state:** selected_reach; contest_envelope; movement_speed; calibration

**Consequences:** Change reachable shots while preserving independent mobility ratings.

**Media examples:**

- {player}'s reach changes his contest area, not his speed.
- The calibration separates arm geometry from foot movement.
- Longer coverage gets no free acceleration package.

### `physical.wingspan_handle_clearance`

**Trigger:** A longer-arm build passes a reach test but fails a tight-dribble clearance target under the selected body geometry.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires explicit body dimensions and calibrated performance envelopes; fantastical settings require an enabled sandbox builder. No trait implies identity or medical diagnosis.

**Required state:** wingspan; body_geometry; handle_clearance; drill_target

**Consequences:** Offer dribble-height adaptation or build revision instead of blanket penalties.

**Media examples:**

- {player}'s added reach complicates his tight-handle drill.
- The recorded clearance limit follows the chosen dimensions.
- More reach also means more arm to fit through traffic.

### `physical.mass_screen_stability`

**Trigger:** A heavier selected build improves measured legal-screen stability but exceeds its previous acceleration time in a matched movement test.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires explicit body dimensions and calibrated performance envelopes; fantastical settings require an enabled sandbox builder. No trait implies identity or medical diagnosis.

**Required state:** body_mass; screen_stability; acceleration_baseline; matched_test

**Consequences:** Change contact and mobility envelopes independently.

**Media examples:**

- {player}'s build holds the screen better and accelerates more slowly.
- Matched tests expose the selected stability-versus-start tradeoff.
- The screen gets an anchor; the first step gets a bill.

### `physical.light_build_displacement`

**Trigger:** A light build is legally displaced from its chosen rebounding position by modeled opponent contact despite matching the jump-height target.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires explicit body dimensions and calibrated performance envelopes; fantastical settings require an enabled sandbox builder. No trait implies identity or medical diagnosis.

**Required state:** body_mass; legal_contact; position_displacement; jump_target

**Consequences:** Encourage positioning counters or stability development.

**Media examples:**

- {player} meets the jump target but loses the rebound position.
- Contact stability, not vertical reach, explains the lost spot.
- The jump is ready; the landing address has moved.

### `physical.center_gravity_turn`

**Trigger:** A build with a higher modeled center of gravity misses a rapid direction-change balance target while clearing a straight-line speed test.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires explicit body dimensions and calibrated performance envelopes; fantastical settings require an enabled sandbox builder. No trait implies identity or medical diagnosis.

**Required state:** center_of_gravity; turn_radius; balance_target; straight_speed

**Consequences:** Adjust turn control without automatically reducing maximum speed.

**Media examples:**

- {player}'s straight-line speed does not solve the turn test.
- The calibrated balance envelope changes with his center of gravity.
- Fast on the straight road, more careful at the corner.

### `physical.handspan_ball_control`

**Trigger:** Selected hand dimensions improve single-hand ball retention in testing but do not alter the player's passing-read score.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires explicit body dimensions and calibrated performance envelopes; fantastical settings require an enabled sandbox builder. No trait implies identity or medical diagnosis.

**Required state:** hand_dimensions; grip_test; passing_read; control_delta

**Consequences:** Modify retention envelopes without granting court vision.

**Media examples:**

- {player}'s grip improves while the passing-read result stays the same.
- Ball security and decision recognition remain separate skills.
- A stronger hold does not come with a better map.

### `physical.jump_repeat_dropoff`

**Trigger:** Player clears the single-jump target but falls below the repeat-jump envelope in a calibrated sequence, with recovery timing recorded.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires explicit body dimensions and calibrated performance envelopes; fantastical settings require an enabled sandbox builder. No trait implies identity or medical diagnosis.

**Required state:** peak_jump; repeated_jumps; recovery_time; repeatability_target

**Consequences:** Add repeat-effort constraints to rebounding and shot contests.

**Media examples:**

- {player}'s first jump and repeated jumps tell different stories.
- The assessment isolates repeatability from peak height.
- The highlight leap has a shorter subscription than the rebound battle.

### `physical.longstride_crowded_lane`

**Trigger:** A long-stride build clears open-court speed targets but fails a foot-placement test in a narrowed legal driving corridor.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires explicit body dimensions and calibrated performance envelopes; fantastical settings require an enabled sandbox builder. No trait implies identity or medical diagnosis.

**Required state:** stride_length; corridor_width; foot_placement; open_speed

**Consequences:** Offer shortened-step training and route preferences.

**Media examples:**

- {player}'s long strides need a different crowded-lane solution.
- Open-space speed does not establish tight-space foot control.
- The open road likes the build more than the hallway does.

### `physical.release_height_clearance`

**Trigger:** A higher selected release point passes a defender-clearance test but misses the user's chosen release-time target.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires explicit body dimensions and calibrated performance envelopes; fantastical settings require an enabled sandbox builder. No trait implies identity or medical diagnosis.

**Required state:** release_height; defender_envelope; release_time; target

**Consequences:** Trade contest protection against available shooting windows.

**Media examples:**

- {player}'s higher release clears the contest at a timing cost.
- The measurement distinguishes clearance from speed of release.
- The shot finds a higher window and takes longer to open it.

### `physical.foot_size_boundary`

**Trigger:** A larger-foot build repeatedly places part of the foot across a tested scoring boundary despite the player's torso remaining in the intended zone.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires explicit body dimensions and calibrated performance envelopes; fantastical settings require an enabled sandbox builder. No trait implies identity or medical diagnosis.

**Required state:** foot_dimensions; boundary_contact; torso_position; shot_value

**Consequences:** Add placement discipline and court-geometry awareness.

**Media examples:**

- {player}'s foot placement changes the tested shot value.
- The scoring boundary follows contact geometry, not body-center position.
- The shot has the right idea and the wrong footprint.

### `physical.rotation_inertia_spin`

**Trigger:** A selected mass distribution slows the calibrated spin rotation while its contact-stability benchmark improves.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires explicit body dimensions and calibrated performance envelopes; fantastical settings require an enabled sandbox builder. No trait implies identity or medical diagnosis.

**Required state:** mass_distribution; rotation_time; contact_stability; calibration

**Consequences:** Change move timings and invite alternate counters.

**Media examples:**

- {player}'s build makes the spin slower and the contact base steadier.
- Mass distribution affects rotation separately from total strength.
- The sturdy version takes a little longer to turn around.

### `physical.sprint_recovery_budget`

**Trigger:** A build meets peak-sprint targets but fails its recovery interval target between repeated efforts in a matched conditioning test.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires explicit body dimensions and calibrated performance envelopes; fantastical settings require an enabled sandbox builder. No trait implies identity or medical diagnosis.

**Required state:** peak_sprint; recovery_interval; repeat_test; endurance_target

**Consequences:** Alter burst scheduling and rotation planning without medical conclusions.

**Media examples:**

- {player}'s top speed clears the test; his recovery interval does not.
- Peak output and repeat-effort recovery are tracked separately.
- The first sprint is a promise the next sprint cannot yet keep.

### `physical.low_jump_angle_counter`

**Trigger:** A player with a documented limited jump envelope selects a bank-angle finishing plan and meets its scoring benchmark without improving his vertical test.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires explicit body dimensions and calibrated performance envelopes; fantastical settings require an enabled sandbox builder. No trait implies identity or medical diagnosis.

**Required state:** jump_envelope; angle_plan; finish_test; vertical_baseline

**Consequences:** Unlock geometry-based compensation rather than overriding physical limits.

**Media examples:**

- {player} meets the finishing target without a bigger jump.
- The plan changes angles while the measured jump ceiling stays fixed.
- The basket accepts a smarter route instead of a higher flight.

### `physical.max_strength_ball_speed`

**Trigger:** A strength-heavy sandbox build exceeds the receiver's catch-speed envelope on a chosen pass, causing a tracked mishandle despite correct aim.

**Placeholders:** `{player}`, `{teammate}`

**Modes:** player; franchise

**Availability:** Requires explicit body dimensions and calibrated performance envelopes; fantastical settings require an enabled sandbox builder. No trait implies identity or medical diagnosis.

**Required state:** sandbox_override; force_output; pass_velocity; receiver_envelope; mishandle

**Consequences:** Require force calibration and pairing-specific pass settings.

**Media examples:**

- {player}'s pass reaches the target too forcefully for {teammate}.
- Direction is correct; arrival speed exceeds the recorded catch window.
- The delivery arrives with more power than the door can handle.

### `physical.dimensions_lock_confirmed`

**Trigger:** Before a competitive career begins, the user confirms body dimensions after a calibration preview and the engine locks geometry changes under the selected mode.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Requires explicit body dimensions and calibrated performance envelopes; fantastical settings require an enabled sandbox builder. No trait implies identity or medical diagnosis.

**Required state:** build_preview; selected_dimensions; mode_policy; confirmation; geometry_lock

**Consequences:** Make build choices persistent while reserving legal later conditioning changes.

**Media examples:**

- {player}'s physical build is confirmed for this career.
- The lock preserves the previewed geometry and its tradeoffs.
- The builder closes; the basketball decisions begin.

## 48. Contract clauses and promised opportunities

### `contract.player_option_kept`

**Trigger:** Player files an irrevocable exercise notice for an existing player option before its deadline.

**Placeholders:** `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Only when the saved contract and fictional league rules expressly support the stated clause.

**Required state:** player_option; option_deadline; option_notice; remaining_term

**Consequences:** Keep the option season and guaranteed salary on the roster ledger.

**Media examples:**

- {player} exercises his option to stay with {team}.
- The option notice keeps {player}'s next season under contract.
- {team} retain a player who chooses the agreed extra year.

### `contract.team_option_declined`

**Trigger:** Club declines an existing unguaranteed team option by its deadline; player enters the defined free-agent pool.

**Placeholders:** `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Only when the saved contract and fictional league rules expressly support the stated clause.

**Required state:** team_option; option_deadline; club_notice; free_agent_status

**Consequences:** Remove the option year without treating this as an ordinary midcontract waiver.

**Media examples:**

- {team} decline {player}'s contract option.
- The optional year ends before it begins for {player}.
- {player} reaches free agency through the club's recorded option decision.

### `contract.guarantee_date_passed`

**Trigger:** Partially guaranteed contract crosses its saved guarantee date while player remains registered.

**Placeholders:** `{amount}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Only when the saved contract and fictional league rules expressly support the stated clause.

**Required state:** guarantee_date; guarantee_amount; roster_status; contract_guarantee

**Consequences:** Increase guaranteed liability to the contract's stated amount.

**Media examples:**

- {player}'s contract guarantee rises to {amount}.
- The deadline passes with {player} still on {team}'s roster.
- A calendar clause turns the saved protection into a guaranteed commitment.

### `contract.appearance_bonus_earned`

**Trigger:** Player completes the exact qualifying appearance count in a signed bonus clause and payroll certifies it.

**Placeholders:** `{amount}`, `{player}`

**Modes:** player; franchise

**Availability:** Only when the saved contract and fictional league rules expressly support the stated clause.

**Required state:** bonus_clause; qualifying_appearances; bonus_threshold; bonus_certified

**Consequences:** Credit the specified bonus and mark this clause settled for the season.

**Media examples:**

- {player} earns his {amount} appearance bonus.
- The contract's appearance target is officially satisfied.
- Playing availability turns a written clause into earned pay for {player}.

### `contract.bonus_target_missed`

**Trigger:** Season closes below an explicitly stated contract performance-bonus target; payroll confirms no award.

**Placeholders:** `{player}`, `{target}`, `{team}`

**Modes:** player; franchise

**Availability:** Only when the saved contract and fictional league rules expressly support the stated clause.

**Required state:** bonus_metric; bonus_threshold; final_metric; season_closed

**Consequences:** Set this bonus payment to zero without changing ordinary salary.

**Media examples:**

- {player} finishes short of his {target} bonus condition.
- The recorded target remains unmet when the season closes.
- {team}'s bonus clause does not pay out this year.

### `contract.bonus_reclassified`

**Trigger:** League accountant reclassifies an existing incentive under the configured likelihood rule after verified prior-season results.

**Placeholders:** `{classification}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Only when the saved contract and fictional league rules expressly support the stated clause.

**Required state:** incentive_rule; incentive_metric; prior_results; cap_classification

**Consequences:** Update next season's cap entry under that rule, leaving actual pay entitlement separate.

**Media examples:**

- {player}'s incentive changes salary-accounting classification.
- The league ledger now lists the clause as {classification}.
- {team}'s next salary plan uses the revised incentive entry.

### `contract.trade_kicker_reduced`

**Trigger:** Player voluntarily signs a permitted partial reduction of an existing trade bonus before a pending transfer can satisfy the applicable accounting rule.

**Placeholders:** `{amount}`, `{player}`

**Modes:** player; franchise

**Availability:** Only when the saved contract and fictional league rules expressly support the stated clause.

**Required state:** trade_bonus; consent_form; waived_amount; pending_transfer

**Consequences:** Reduce only the recorded bonus; transfer remains pending until other requirements pass.

**Media examples:**

- {player} reduces his trade bonus by {amount}.
- His consent changes the financial terms of the proposed move.
- The bonus adjustment is complete; the transfer still has its own approval checks.

### `contract.training_location_clause_used`

**Trigger:** Player invokes an enforceable signed location clause and club schedules required training at the approved facility.

**Placeholders:** `{facility}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Only when the saved contract and fictional league rules expressly support the stated clause.

**Required state:** location_clause; approved_facility; player_notice; training_calendar

**Consequences:** Route mandatory sessions to the stipulated facility for this contract window.

**Media examples:**

- {player} invokes his training-location clause.
- {team}'s required sessions move to {facility} under the agreement.
- A detail in the contract becomes a detail on the training calendar.

### `contract.role_promise_honored`

**Trigger:** A signed measurable development-role promise reaches its review date and verified usage meets the contractual target.

**Placeholders:** `{player}`, `{role}`, `{team}`

**Modes:** player; franchise

**Availability:** Only when the saved contract and fictional league rules expressly support the stated clause.

**Required state:** role_promise; usage_target; actual_usage; review_date

**Consequences:** Mark promise fulfilled and close the associated remedy window.

**Media examples:**

- {team} meet their written role commitment to {player}.
- The review confirms {player}'s promised {role} opportunity was delivered.
- Contract language and recorded usage agree at the deadline.

### `contract.role_promise_remedy`

**Trigger:** Review confirms a signed measurable role commitment was missed and both parties activate its predefined nonjudicial remedy.

**Placeholders:** `{player}`, `{remedy}`, `{team}`

**Modes:** player; franchise

**Availability:** Only when the saved contract and fictional league rules expressly support the stated clause.

**Required state:** role_promise; usage_target; actual_usage; remedy_selected

**Consequences:** Apply only the agreed remedy and update the player's available choices.

**Media examples:**

- {player} activates the agreed remedy for a missed role promise.
- {team}'s recorded usage falls short of the signed commitment.
- The contract provides {remedy}, and both sides put it into effect.

### `contract.relocation_stipend_used`

**Trigger:** A player submits an eligible relocation invoice and club reimburses it within the signed stipend limit.

**Placeholders:** `{amount}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Only when the saved contract and fictional league rules expressly support the stated clause.

**Required state:** relocation_clause; eligible_invoice; stipend_limit; reimbursement

**Consequences:** Credit reimbursement and reduce the remaining stipend allowance.

**Media examples:**

- {team} reimburse {player}'s eligible moving costs.
- The relocation clause covers {amount} of the documented move.
- {player}'s new address comes with the support already written into his deal.

### `contract.pay_schedule_switched`

**Trigger:** Player and club execute a permitted change from seasonal to year-round installments without changing total compensation.

**Placeholders:** `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Only when the saved contract and fictional league rules expressly support the stated clause.

**Required state:** payment_schedule; schedule_consent; total_compensation; installment_dates

**Consequences:** Replace payment dates while preserving total contractual salary.

**Media examples:**

- {player} switches to a year-round salary schedule.
- {team} spread the same contract value across the agreed calendar.
- The amount stays fixed while the timing changes for {player}.

### `contract.deferred_payment_arrives`

**Trigger:** A previously agreed deferred installment reaches maturity and actual receipt is confirmed.

**Placeholders:** `{amount}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Only when the saved contract and fictional league rules expressly support the stated clause.

**Required state:** deferral_schedule; maturity_date; payment_received; deferred_balance

**Consequences:** Credit cash and retire this installment from the deferred liability.

**Media examples:**

- {player} receives the matured {amount} deferred payment.
- Money from an earlier contract reaches his account on the agreed date.
- {team} settle this recorded deferred installment.

### `contract.cooling_period_withdrawal`

**Trigger:** Player withdraws a proposed agreement during an expressly permitted cooling-off period before it becomes effective.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Only when the saved contract and fictional league rules expressly support the stated clause.

**Required state:** proposed_contract; cooling_period; withdrawal_notice; effective_date

**Consequences:** Cancel only the ineffective proposal and restore negotiations to open status.

**Media examples:**

- {player} withdraws the proposal within its permitted review period.
- The agreement never reaches its effective date.
- A saved contract safeguard gives {player} time to change his decision.

### `contract.copy_conflict_corrected`

**Trigger:** Both parties discover mismatched nonfinancial clause versions before execution and sign one reconciled text.

**Placeholders:** `{clause}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Only when the saved contract and fictional league rules expressly support the stated clause.

**Required state:** contract_versions; conflicting_clause; reconciled_version; signatures

**Consequences:** Supersede both drafts; signing can proceed using the agreed version.

**Media examples:**

- {player} and {team} reconcile their conflicting contract drafts.
- The two copies now contain the same {clause} language.
- The paperwork problem is fixed before the agreement takes effect.

## 49. Agents, representation, and negotiation choices

### `agent.relationship_ended`

**Trigger:** Player terminates an agency relationship through its permitted notice procedure without an unresolved fee dispute.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Agency agreements, disclosures, consent windows, and representation rules must be explicitly configured.

**Required state:** agency_contract; notice_period; termination_notice; representation_status

**Consequences:** Remove representation authority after the notice period; preserve existing earned fees.

**Media examples:**

- {player} parts with his agent under the agreed notice terms.
- Representation ends without rewriting the contracts already signed.
- {player}'s next negotiation begins with a vacant agent role.

### `agent.self_representation_registered`

**Trigger:** League accepts player's self-representation registration after required declarations.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Agency agreements, disclosures, consent windows, and representation rules must be explicitly configured.

**Required state:** representation_choice; self_registration; league_acceptance; agent_authority

**Consequences:** Give the player direct negotiation controls and remove agent-only actions.

**Media examples:**

- {player} registers to negotiate for himself.
- The league accept his self-representation paperwork.
- His next contract conversation goes directly through {player}.

### `agent.dual_client_recusal`

**Trigger:** Agent discloses representing two players competing for the same single roster offer and one client appoints an independent negotiator.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Agency agreements, disclosures, consent windows, and representation rules must be explicitly configured.

**Required state:** client_overlap; single_offer; conflict_disclosure; independent_negotiator

**Consequences:** Remove conflicted agent from this offer only while retaining other representation.

**Media examples:**

- {player} appoints independent help for a conflicted offer.
- One roster opening and two clients require a different negotiating arrangement.
- The disclosed overlap is handled before {player}'s offer proceeds.

### `agent.business_stake_disclosed`

**Trigger:** Agent's financial interest in a proposed off-court venture is disclosed and player elects an independent review before any investment.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Agency agreements, disclosures, consent windows, and representation rules must be explicitly configured.

**Required state:** agent_business_interest; disclosure; review_requested; investment_status

**Consequences:** Freeze commitment until review completes; no investment or misconduct finding yet.

**Media examples:**

- {player} pauses the venture for an independent conflict review.
- The agent's disclosed stake changes how the proposal will be examined.
- No funds move while {player} reviews the overlapping interests.

### `agent.commission_cap_negotiated`

**Trigger:** Player and agent sign a lower prospective commission cap after a valid negotiation.

**Placeholders:** `{player}`, `{rate}`

**Modes:** player

**Availability:** Agency agreements, disclosures, consent windows, and representation rules must be explicitly configured.

**Required state:** agency_rate; commission_cap; new_rate; effective_date

**Consequences:** Apply the new cap to future eligible earnings only.

**Media examples:**

- {player} negotiates a lower commission cap.
- Future eligible fees follow the new {rate} ceiling.
- The agency agreement changes without revisiting past earned commissions.

### `agent.flat_fee_trial`

**Trigger:** Player signs a permitted time-limited flat-fee representation arrangement instead of a percentage-based contract.

**Placeholders:** `{date}`, `{player}`

**Modes:** player

**Availability:** Agency agreements, disclosures, consent windows, and representation rules must be explicitly configured.

**Required state:** agency_model; flat_fee; trial_term; permitted_models

**Consequences:** Charge the agreed flat fee and schedule a trial-end review.

**Media examples:**

- {player} starts a flat-fee representation trial.
- His agent's pay no longer rises automatically with this trial's contract value.
- The new arrangement runs until {date}, when both sides review it.

### `agent.offer_withheld_found`

**Trigger:** An internal agency compliance review verifies an offer was not forwarded before its expiry and discloses the omission without alleging a crime.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Agency agreements, disclosures, consent windows, and representation rules must be explicitly configured.

**Required state:** received_offer; forwarding_log; offer_expiry; review_finding

**Consequences:** Mark offer expired, lower representation trust, open permitted agency remedies.

**Media examples:**

- A compliance review finds {player} was not shown an expired offer.
- The offer deadline passed before the client received the terms.
- {player}'s representation review now includes a verified communication failure.

### `agent.all_offers_dashboard`

**Trigger:** Player activates a contractual requirement that every written offer be entered in a client-visible log; first reconciliation passes.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Agency agreements, disclosures, consent windows, and representation rules must be explicitly configured.

**Required state:** offer_log; visibility_clause; received_offers; reconciliation

**Consequences:** Make subsequent offer decisions auditable by the client.

**Media examples:**

- {player}'s offer log passes its first reconciliation.
- Every written proposal appears in the shared negotiating record.
- The new visibility rule gives {player} a complete offer list.

### `agent.negotiation_limit_set`

**Trigger:** Player signs instructions forbidding acceptance below a declared nonfinancial condition; agent acknowledges them.

**Placeholders:** `{condition}`, `{player}`

**Modes:** player

**Availability:** Agency agreements, disclosures, consent windows, and representation rules must be explicitly configured.

**Required state:** negotiation_instructions; nonfinancial_condition; agent_acknowledgment; offer_permissions

**Consequences:** Disable agent acceptance of offers failing the condition.

**Media examples:**

- {player} sets a firm {condition} limit for negotiations.
- His representative accepts the instruction before the next offer.
- The mandate narrows which proposals can receive an authorized yes.

### `agent.deadline_authority_revoked`

**Trigger:** Player revokes previously delegated acceptance authority before a recorded offer deadline, with timely notice verified.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Agency agreements, disclosures, consent windows, and representation rules must be explicitly configured.

**Required state:** delegated_authority; revocation_time; offer_deadline; notice_receipt

**Consequences:** Require direct player approval for this and later offers.

**Media examples:**

- {player} takes back final offer approval before the deadline.
- The agent can continue negotiating but cannot accept for him.
- A timely instruction returns the signature decision to {player}.

### `agent.specialist_added`

**Trigger:** Player retains a separate qualified specialist for a complex contract element with written scope and no duplicate authority.

**Placeholders:** `{issue}`, `{player}`

**Modes:** player

**Availability:** Agency agreements, disclosures, consent windows, and representation rules must be explicitly configured.

**Required state:** specialist_scope; retainer; authority_boundaries; main_agent

**Consequences:** Route only the specified review task to the specialist and record its cost.

**Media examples:**

- {player} adds a specialist for {issue}.
- The retainer assigns a defined review task rather than a second full negotiator.
- Two advisers share the work under written boundaries.

### `agent.agency_merger_choice`

**Trigger:** Agency merges with another firm and a saved client clause permits the player to retain representation or leave; player files a choice.

**Placeholders:** `{choice}`, `{player}`

**Modes:** player

**Availability:** Agency agreements, disclosures, consent windows, and representation rules must be explicitly configured.

**Required state:** agency_merger; client_choice_clause; choice_deadline; choice_notice

**Consequences:** Apply the selected representation path without assuming new fees.

**Media examples:**

- {player} chooses {choice} after his agency's merger.
- The client option settles who handles his next negotiations.
- The agency changes; {player} uses the choice written into his agreement.

### `agent.unsolicited_pitch_blocked`

**Trigger:** Player enables a permitted agency-contact filter and an unsolicited representation pitch is logged but excluded from decision prompts.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Agency agreements, disclosures, consent windows, and representation rules must be explicitly configured.

**Required state:** contact_preferences; agency_pitch; filter_enabled; contact_log

**Consequences:** Reduce negotiation interruptions while retaining a reviewable contact log.

**Media examples:**

- {player}'s contact filter keeps an unsolicited agency pitch off his desk.
- The approach is recorded without reopening representation discussions.
- He keeps the agent search closed by choice.

### `agent.performance_review_retained`

**Trigger:** A scheduled representation review meets the player's previously declared response-time and disclosure criteria; player renews the mandate.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Agency agreements, disclosures, consent windows, and representation rules must be explicitly configured.

**Required state:** review_criteria; response_log; disclosure_log; mandate_renewal

**Consequences:** Continue current authority and raise trust for verified service delivery.

**Media examples:**

- {player}'s agent meets the agreed service-review standards.
- The client renews representation after checking the records.
- Continuity follows documented work rather than a new sales pitch.

### `agent.pro_bono_rookie_advice`

**Trigger:** An eligible player receives a league-approved independent advice session funded by a player association, with no representation agreement.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Agency agreements, disclosures, consent windows, and representation rules must be explicitly configured.

**Required state:** advice_program; player_eligibility; session_complete; representation_status

**Consequences:** Unlock contract-comprehension information without installing an agent.

**Media examples:**

- {player} completes an independent contract-advice session.
- The association's program supplies guidance without a representation contract.
- He leaves with a reviewed proposal and the same freedom to choose.

## 50. Employment and operating businesses

### `work.coaching_apprenticeship_paid`

**Trigger:** Player completes an approved paid offseason coaching apprenticeship and employer certifies the hours.

**Placeholders:** `{amount}`, `{player}`

**Modes:** player

**Availability:** Business and nonplaying employment systems enabled; required club consent and calendar restrictions must be satisfied.

**Required state:** apprenticeship_contract; club_consent; hours_completed; wage_receipt

**Consequences:** Credit earned wages and coaching experience without awarding a coaching job.

**Media examples:**

- {player} completes his paid coaching apprenticeship.
- The certified hours add experience beyond playing.
- His offseason work produces an earned {amount} payment.

### `work.side_job_shift_conflict`

**Trigger:** A saved nonplaying job shift overlaps a newly published mandatory team session and player chooses the team session.

**Placeholders:** `{amount}`, `{player}`, `{team}`

**Modes:** player

**Availability:** Business and nonplaying employment systems enabled; required club consent and calendar restrictions must be satisfied.

**Required state:** job_shifts; team_calendar; overlap_verified; shift_choice

**Consequences:** Cancel the selected shift under agreed employment terms and lose only that shift's wage.

**Media examples:**

- {player} gives up a side-job shift for {team}'s required session.
- Two work calendars collide, and basketball takes the selected slot.
- The choice costs {amount} in scheduled nonplaying wages.

### `work.consulting_assignment_complete`

**Trigger:** Player delivers an approved nonplaying consultancy task and client accepts the deliverable.

**Placeholders:** `{player}`, `{project}`

**Modes:** player

**Availability:** Business and nonplaying employment systems enabled; required club consent and calendar restrictions must be satisfied.

**Required state:** consulting_scope; approved_window; deliverable_accepted; fee_received

**Consequences:** Credit the fee and work reputation; do not infer business profit.

**Media examples:**

- {player} completes the accepted consultancy assignment.
- The client signs off on {project}.
- A finished deliverable turns the approved side work into earned income.

### `work.business_break_even`

**Trigger:** Existing player-owned business completes its first verified accounting period with revenue equal to total recorded expenses.

**Placeholders:** `{business}`, `{period}`, `{player}`

**Modes:** player

**Availability:** Business and nonplaying employment systems enabled; required club consent and calendar restrictions must be satisfied.

**Required state:** business_accounts; revenue; expenses; period_closed

**Consequences:** Set operating result to zero and unlock a sustainable-budget review.

**Media examples:**

- {business} reaches verified break-even under {player}'s ownership.
- Revenue covers the recorded operating costs for {period}.
- The business finishes this period without a profit or a loss.

### `work.business_payroll_met`

**Trigger:** A player chooses to fund an existing business payroll shortage with personal capital and wages clear on time.

**Placeholders:** `{amount}`, `{business}`, `{player}`

**Modes:** player

**Availability:** Business and nonplaying employment systems enabled; required club consent and calendar restrictions must be satisfied.

**Required state:** payroll_due; business_cash; capital_injection; wages_cleared

**Consequences:** Reduce personal liquidity and prevent this scheduled payroll delay.

**Media examples:**

- {player} funds {business}'s payroll gap.
- Staff wages clear after the recorded {amount} capital injection.
- The business meets its pay date using new owner funds.

### `work.manager_handover`

**Trigger:** Player transfers daily business authority to a contracted manager with signed decision limits and completed handover.

**Placeholders:** `{business}`, `{player}`

**Modes:** player

**Availability:** Business and nonplaying employment systems enabled; required club consent and calendar restrictions must be satisfied.

**Required state:** manager_contract; delegated_limits; handover_complete; business_role

**Consequences:** Reduce player operating workload and add management expense.

**Media examples:**

- {player} hands daily operations of {business} to its manager.
- The written limits define which decisions no longer need his approval.
- A completed handover creates more room in his basketball schedule.

### `work.franchise_location_closed`

**Trigger:** Player-owned retail franchise closes one underperforming location after an approved operational decision and staff transition plan.

**Placeholders:** `{business}`, `{location}`, `{player}`

**Modes:** player

**Availability:** Business and nonplaying employment systems enabled; required club consent and calendar restrictions must be satisfied.

**Required state:** location_results; closure_approval; staff_plan; lease_exit

**Consequences:** End location revenue and expenses and charge only recorded closure costs.

**Media examples:**

- {player}'s business closes its {location} outlet.
- The approved closure follows the location's recorded operating results.
- {business} continues with one fewer branch.

### `work.product_recall_voluntary`

**Trigger:** Existing player-owned business voluntarily recalls a documented defective product before a safety incident is recorded.

**Placeholders:** `{amount}`, `{business}`, `{player}`, `{product}`

**Modes:** player

**Availability:** Business and nonplaying employment systems enabled; required club consent and calendar restrictions must be satisfied.

**Required state:** product_defect; recall_scope; customer_notice; recall_cost

**Consequences:** Stop affected sales, fund the recall, preserve unclaimed products outside its scope.

**Media examples:**

- {business} issue a voluntary recall for {product}.
- {player}'s company responds to the verified defect before any recorded incident.
- The recall creates {amount} in documented operating costs.

### `work.employee_equity_granted`

**Trigger:** Player-owned company grants an approved equity pool to employees under a valid vesting agreement.

**Placeholders:** `{business}`, `{player}`

**Modes:** player

**Availability:** Business and nonplaying employment systems enabled; required club consent and calendar restrictions must be satisfied.

**Required state:** employee_pool; equity_grant; vesting_terms; ownership_table

**Consequences:** Dilute owner stake by the stated share and begin employee vesting clocks.

**Media examples:**

- {player} approves employee ownership at {business}.
- The grant starts vesting under the published terms.
- Staff receive a share of the company, with conditions still to fulfill.

### `work.inventory_sellout`

**Trigger:** A limited product run from the player's existing business sells its entire tracked inventory at posted prices.

**Placeholders:** `{business}`, `{player}`, `{product}`

**Modes:** player

**Availability:** Business and nonplaying employment systems enabled; required club consent and calendar restrictions must be satisfied.

**Required state:** production_run; inventory; sales_receipts; posted_price

**Consequences:** Record revenue and zero remaining stock; profit awaits cost accounting.

**Media examples:**

- {business} sell out the documented {product} run.
- The inventory reaches zero after verified sales.
- {player}'s company has revenue to count and production costs still to reconcile.

### `work.unsold_stock_write_down`

**Trigger:** Accountants approve a documented write-down of unsold inventory in the player's existing business.

**Placeholders:** `{amount}`, `{business}`, `{player}`

**Modes:** player

**Availability:** Business and nonplaying employment systems enabled; required club consent and calendar restrictions must be satisfied.

**Required state:** inventory_cost; recoverable_value; write_down_approval; accounting_period

**Consequences:** Reduce asset book value and period earnings without an invented cash outflow.

**Media examples:**

- {business} write down unsold inventory by {amount}.
- The accounting change lowers the recorded stock value.
- {player}'s business recognizes a loss already present in its inventory.

### `work.customer_contract_renewed`

**Trigger:** Existing business customer renews a recurring service agreement after a completed quality review.

**Placeholders:** `{business}`, `{player}`, `{term}`

**Modes:** player

**Availability:** Business and nonplaying employment systems enabled; required club consent and calendar restrictions must be satisfied.

**Required state:** service_contract; review_result; renewal_signature; new_term

**Consequences:** Add confirmed recurring revenue and future service obligations.

**Media examples:**

- {business} retain their customer through a signed renewal.
- The review ends with another {term} of agreed service.
- {player}'s company gains continuing revenue and continuing work.

### `work.business_buyout_offer_declined`

**Trigger:** Player rejects a genuine documented offer to buy his existing business while remaining owner.

**Placeholders:** `{amount}`, `{business}`, `{player}`

**Modes:** player

**Availability:** Business and nonplaying employment systems enabled; required club consent and calendar restrictions must be satisfied.

**Required state:** business_offer; offer_validity; rejection_notice; ownership_table

**Consequences:** Keep current ownership; close this offer without recording a sale gain.

**Media examples:**

- {player} turns down the {amount} offer for {business}.
- The proposed sale ends with ownership unchanged.
- He chooses continued operation over the documented buyout price.

### `work.professional_license_renewed`

**Trigger:** Player completes the specified continuing-education requirements and nonplaying professional license is officially renewed.

**Placeholders:** `{license}`, `{player}`

**Modes:** player

**Availability:** Business and nonplaying employment systems enabled; required club consent and calendar restrictions must be satisfied.

**Required state:** license; renewal_requirements; course_completion; license_status

**Consequences:** Extend eligibility for that side profession without inventing a client or job.

**Media examples:**

- {player} renews his {license} qualification.
- The required coursework keeps his nonplaying credential active.
- Another career option remains available beyond the court.

### `work.cooperative_membership`

**Trigger:** Player joins a permitted worker cooperative with an approved capital contribution and defined voting rights.

**Placeholders:** `{cooperative}`, `{player}`

**Modes:** player

**Availability:** Business and nonplaying employment systems enabled; required club consent and calendar restrictions must be satisfied.

**Required state:** cooperative_rules; capital_contribution; membership_approval; voting_rights

**Consequences:** Deduct contribution and grant only the approved work and governance rights.

**Media examples:**

- {player} joins {cooperative} as a working member.
- The contribution comes with the cooperative's stated voting rights.
- His side work uses shared ownership rather than sole control.

## 51. Investments and portfolio outcomes

### `investment.lockup_blocks_withdrawal`

**Trigger:** Player requests withdrawal from an existing investment before its disclosed lockup ends and administrator refuses under the saved terms.

**Placeholders:** `{date}`, `{player}`

**Modes:** player

**Availability:** Optional fictional investment module with recorded costs, liquidity, risk, and realized results; no real-world return promises.

**Required state:** investment_lockup; withdrawal_request; lockup_end; administrator_reply

**Consequences:** Keep value invested and mark cash unavailable until the stated exit window.

**Media examples:**

- {player}'s withdrawal request meets the fund's lockup.
- The investment cannot supply the requested cash before {date}.
- Its disclosed exit terms matter when he wants the money back.

### `investment.capital_call_paid`

**Trigger:** A previously signed investment commitment produces a valid capital call and player pays it by deadline.

**Placeholders:** `{amount}`, `{fund}`, `{player}`

**Modes:** player

**Availability:** Optional fictional investment module with recorded costs, liquidity, risk, and realized results; no real-world return promises.

**Required state:** capital_commitment; call_notice; payment_deadline; payment_received

**Consequences:** Reduce cash and undrawn commitment; increase contributed capital.

**Media examples:**

- {player} meets the {amount} capital call.
- The signed commitment becomes a funded contribution.
- Money moves into {fund} under terms already agreed.

### `investment.capital_call_default`

**Trigger:** Player misses a valid capital-call deadline and fund applies the exact recorded contractual dilution consequence.

**Placeholders:** `{consequence}`, `{player}`

**Modes:** player

**Availability:** Optional fictional investment module with recorded costs, liquidity, risk, and realized results; no real-world return promises.

**Required state:** capital_commitment; call_notice; missed_deadline; default_clause

**Consequences:** Apply stated dilution only and mark remaining commitment subject to its saved terms.

**Media examples:**

- {player}'s missed capital call reduces his fund stake.
- The fund applies its disclosed {consequence} clause.
- The deadline costs ownership rather than inventing a market loss.

### `investment.dividend_reinvested`

**Trigger:** Player elects an available dividend-reinvestment option and a confirmed distribution buys additional units at the recorded price.

**Placeholders:** `{amount}`, `{investment}`, `{player}`

**Modes:** player

**Availability:** Optional fictional investment module with recorded costs, liquidity, risk, and realized results; no real-world return promises.

**Required state:** dividend_receipt; reinvestment_choice; unit_price; new_units

**Consequences:** Add units instead of available cash and record transaction cost.

**Media examples:**

- {player} reinvests the confirmed {amount} distribution.
- The payment becomes additional units in {investment}.
- His holdings rise while the distribution stays out of spending cash.

### `investment.dividend_taken_cash`

**Trigger:** Player elects cash receipt for a declared investment distribution and actual funds clear.

**Placeholders:** `{amount}`, `{player}`

**Modes:** player

**Availability:** Optional fictional investment module with recorded costs, liquidity, risk, and realized results; no real-world return promises.

**Required state:** distribution_notice; cash_election; payment_cleared; portfolio_units

**Consequences:** Increase liquidity without selling underlying units.

**Media examples:**

- {player} takes {amount} in investment distributions as cash.
- The holdings remain in place while the payment clears.
- The portfolio supplies spendable money through this recorded distribution.

### `investment.dilution_round`

**Trigger:** Existing company holding completes an approved new funding round without player's participation and his ownership percentage falls.

**Placeholders:** `{business}`, `{player}`, `{share}`

**Modes:** player

**Availability:** Optional fictional investment module with recorded costs, liquidity, risk, and realized results; no real-world return promises.

**Required state:** previous_stake; new_shares; funding_closed; participation_choice

**Consequences:** Update ownership percentage; asset value is calculated separately.

**Media examples:**

- {player}'s stake in {business} falls to {share} after new funding.
- He does not join the completed financing round.
- The ownership slice shrinks without by itself proving the investment lost value.

### `investment.pro_rata_right_used`

**Trigger:** Player exercises an existing participation right in a completed funding round and pays the required contribution.

**Placeholders:** `{amount}`, `{business}`, `{player}`, `{share}`

**Modes:** player

**Availability:** Optional fictional investment module with recorded costs, liquidity, risk, and realized results; no real-world return promises.

**Required state:** pro_rata_right; round_terms; exercise_notice; contribution

**Consequences:** Preserve stipulated stake percentage and reduce personal cash.

**Media examples:**

- {player} funds his participation right in {business}.
- The completed contribution keeps his ownership at {share}.
- Maintaining the stake costs the recorded {amount}.

### `investment.fund_winddown_distribution`

**Trigger:** Existing investment fund completes an orderly winddown and sends its final verified distribution.

**Placeholders:** `{amount}`, `{fund}`, `{player}`

**Modes:** player

**Availability:** Optional fictional investment module with recorded costs, liquidity, risk, and realized results; no real-world return promises.

**Required state:** winddown_status; asset_sales; final_distribution; units_cancelled

**Consequences:** Credit final cash and close the holding with its realized lifetime result.

**Media examples:**

- {fund} send {player} their final winddown distribution.
- The holding closes after {amount} reaches his account.
- The complete investment result can now be calculated from actual payments.

### `investment.paper_gain_not_cash`

**Trigger:** Portfolio valuation reaches a configured milestone while no units are sold and no distribution occurs.

**Placeholders:** `{amount}`, `{player}`

**Modes:** player

**Availability:** Optional fictional investment module with recorded costs, liquidity, risk, and realized results; no real-world return promises.

**Required state:** portfolio_valuation; milestone; units_sold; distributions

**Consequences:** Mark valuation milestone without increasing spendable cash.

**Media examples:**

- {player}'s portfolio reaches a quoted value of {amount}.
- The milestone is a valuation, not a completed cash withdrawal.
- His account shows a paper gain while the units remain invested.

### `investment.loss_realized_sale`

**Trigger:** Player sells a documented holding below its recorded purchase cost and settlement completes.

**Placeholders:** `{amount}`, `{investment}`, `{player}`

**Modes:** player

**Availability:** Optional fictional investment module with recorded costs, liquidity, risk, and realized results; no real-world return promises.

**Required state:** purchase_cost; sale_proceeds; fees; settlement

**Consequences:** Credit sale cash and record realized loss after specified costs.

**Media examples:**

- {player} realizes a {amount} loss on the completed sale.
- {investment} leaves his portfolio after settlement.
- The price difference is now a recorded result rather than a changing quote.

### `investment.rebalance_complete`

**Trigger:** Player completes a voluntarily specified allocation rebalance using confirmed trades and pays the recorded fees.

**Placeholders:** `{allocation}`, `{amount}`, `{player}`

**Modes:** player

**Availability:** Optional fictional investment module with recorded costs, liquidity, risk, and realized results; no real-world return promises.

**Required state:** target_allocation; executed_trades; trade_fees; new_allocation

**Consequences:** Update exposure and liquidity; do not predict performance.

**Media examples:**

- {player} completes his chosen portfolio rebalance.
- The holdings now match the saved {allocation} target.
- Transaction costs of {amount} accompany the new mix.

### `investment.single_asset_limit`

**Trigger:** A holding's price movement exceeds player's own concentration limit and he follows the saved reduction plan.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Optional fictional investment module with recorded costs, liquidity, risk, and realized results; no real-world return promises.

**Required state:** concentration_limit; current_weight; sale_plan; executed_sale

**Consequences:** Reduce that exposure and credit settled cash without claiming loss prevention.

**Media examples:**

- {player} reduces a holding that crosses his chosen exposure limit.
- The sale follows his saved concentration rule.
- The portfolio changes shape; future performance remains uncertain.

### `investment.suspension_of_redemptions`

**Trigger:** Fund formally suspends redemptions under a disclosed exceptional-liquidity clause and player's pending request is queued.

**Placeholders:** `{fund}`, `{player}`

**Modes:** player

**Availability:** Optional fictional investment module with recorded costs, liquidity, risk, and realized results; no real-world return promises.

**Required state:** fund_clause; suspension_notice; pending_request; redemption_queue

**Consequences:** Mark units unavailable for withdrawal and preserve ownership.

**Media examples:**

- {fund} suspend redemptions with {player}'s request pending.
- His units remain owned but cannot currently become cash.
- The queue is confirmed; a payment date is not.

### `investment.collectible_sale_authentication`

**Trigger:** Player's documented collectible passes independent authentication and its completed sale settles at a recorded price.

**Placeholders:** `{amount}`, `{item}`, `{player}`

**Modes:** player

**Availability:** Optional fictional investment module with recorded costs, liquidity, risk, and realized results; no real-world return promises.

**Required state:** collectible; authentication; sale_price; settlement

**Consequences:** Convert the asset into actual proceeds after costs; no broader market inference.

**Media examples:**

- {player}'s authenticated {item} sells for {amount}.
- The verified sale turns a stored collectible into settled proceeds.
- The transaction is complete after the authenticity check and payment.

### `investment.community_bond_matures`

**Trigger:** A legally permitted fictional community-project bond held by player reaches maturity and issuer repays principal as specified.

**Placeholders:** `{amount}`, `{player}`, `{project}`

**Modes:** player

**Availability:** Optional fictional investment module with recorded costs, liquidity, risk, and realized results; no real-world return promises.

**Required state:** bond_terms; maturity_date; principal; payment_received

**Consequences:** Credit repaid principal and close the bond; interest separately follows recorded terms.

**Media examples:**

- {player}'s {project} bond returns its principal at maturity.
- The scheduled {amount} repayment clears.
- His community investment completes its stated principal cycle.

## 52. Tax administration and insurance terms

### `tax.withholding_adjustment_applied`

**Trigger:** Payroll applies a player-requested valid withholding change beginning on the specified pay date.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Fictional jurisdiction and policy terms supplied by the save; outcomes require confirmed records, not generalized legal or financial claims.

**Required state:** withholding_request; payroll_acceptance; effective_date; withholding_rate

**Consequences:** Change take-home timing; final tax liability remains separately calculated.

**Media examples:**

- {player}'s requested withholding change reaches payroll.
- His next payment uses the new recorded deduction setting.
- The paycheck changes without settling his final annual tax bill.

### `tax.multijurisdiction_return_complete`

**Trigger:** Player's prepared filings for all saved work jurisdictions receive completion confirmations before their configured deadlines.

**Placeholders:** `{count}`, `{player}`

**Modes:** player; franchise

**Availability:** Fictional jurisdiction and policy terms supplied by the save; outcomes require confirmed records, not generalized legal or financial claims.

**Required state:** work_jurisdictions; required_filings; filing_confirmations; deadlines

**Consequences:** Mark those filings complete; do not declare no tax owed.

**Media examples:**

- {player} completes the required filings across {count} work jurisdictions.
- The travel calendar produces several tax records, all now submitted.
- Filing is complete; payment and review remain separate states.

### `tax.estimated_payment_late`

**Trigger:** A required estimated payment misses its saved deadline and tax system assesses its explicitly configured administrative charge.

**Placeholders:** `{amount}`, `{player}`

**Modes:** player; franchise

**Availability:** Fictional jurisdiction and policy terms supplied by the save; outcomes require confirmed records, not generalized legal or financial claims.

**Required state:** estimated_payment; deadline; payment_time; configured_charge

**Consequences:** Add only the assessed charge to the tax ledger.

**Media examples:**

- {player} receives a {amount} late-payment charge.
- The recorded tax installment reaches the authority after its deadline.
- The save's published payment rule supplies the stated cost.

### `tax.residency_change_confirmed`

**Trigger:** Relevant fictional authority confirms a prospective tax-residency change after documented residence requirements are met.

**Placeholders:** `{jurisdiction}`, `{player}`

**Modes:** player; franchise

**Availability:** Fictional jurisdiction and policy terms supplied by the save; outcomes require confirmed records, not generalized legal or financial claims.

**Required state:** residency_rules; residence_days; application; confirmation

**Consequences:** Use the new jurisdiction for applicable future calculations only.

**Media examples:**

- {player}'s tax-residency change is confirmed.
- {jurisdiction} accept the documented residence status.
- Future calculations follow the confirmed effective date, not the move announcement alone.

### `tax.expense_claim_disallowed`

**Trigger:** Tax administrator disallows a specific documented claimed expense under the saved fictional rules without a fraud finding.

**Placeholders:** `{expense}`, `{player}`

**Modes:** player; franchise

**Availability:** Fictional jurisdiction and policy terms supplied by the save; outcomes require confirmed records, not generalized legal or financial claims.

**Required state:** expense_claim; allowability_rule; assessment; additional_balance

**Consequences:** Remove this deduction and recalculate only the affected balance.

**Media examples:**

- {player}'s {expense} deduction is disallowed.
- The assessment changes the tax calculation without alleging fraud.
- The revised balance reflects the rule applied to this expense.

### `tax.audit_records_accepted`

**Trigger:** A noncriminal tax review accepts the requested documentation and closes its stated scope with no adjustment.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Fictional jurisdiction and policy terms supplied by the save; outcomes require confirmed records, not generalized legal or financial claims.

**Required state:** review_scope; records_submitted; review_decision; balance_adjustment

**Consequences:** Close this review with zero adjustment; leave other periods untouched.

**Media examples:**

- {player}'s documented tax review closes without adjustment.
- The requested records satisfy the stated review.
- This period's examined items pass; the finding goes no further.

### `tax.overlapping_withholding_credit`

**Trigger:** Fictional tax administrator accepts a valid credit for duplicated cross-jurisdiction withholding; liability is revised before any refund or payment.

**Placeholders:** `{amount}`, `{player}`

**Modes:** player; franchise

**Availability:** Fictional jurisdiction and policy terms supplied by the save; outcomes require confirmed records, not generalized legal or financial claims.

**Required state:** overlapping_withholding; credit_rules; credit_approval; revised_liability

**Consequences:** Reduce assessed liability by the approved credit, cash unchanged until settlement.

**Media examples:**

- {player} receives an approved cross-jurisdiction withholding credit.
- The assessment removes the documented overlap of {amount}.
- His liability changes; actual cash settlement is a later step.

### `insurance.coverage_exclusion_disclosed`

**Trigger:** Player requests a policy quote and review identifies the proposed activity as excluded before coverage is bought.

**Placeholders:** `{activity}`, `{player}`

**Modes:** player; franchise

**Availability:** Fictional jurisdiction and policy terms supplied by the save; outcomes require confirmed records, not generalized legal or financial claims.

**Required state:** policy_quote; activity; exclusions; review_result

**Consequences:** Keep activity uncovered unless a different valid policy is purchased.

**Media examples:**

- {player}'s proposed {activity} is excluded from the quoted policy.
- The review reveals the gap before the premium is paid.
- A quote is not coverage for the excluded activity.

### `insurance.rider_added`

**Trigger:** Insurer issues a player-requested permitted policy rider after approval and premium receipt.

**Placeholders:** `{coverage}`, `{date}`, `{player}`

**Modes:** player; franchise

**Availability:** Fictional jurisdiction and policy terms supplied by the save; outcomes require confirmed records, not generalized legal or financial claims.

**Required state:** policy; rider_scope; underwriting_approval; premium_received

**Consequences:** Add only stated coverage from its effective date.

**Media examples:**

- {player} adds the approved {coverage} rider.
- The paid premium activates the new policy terms on {date}.
- The coverage expands within the rider's written scope.

### `insurance.renewal_premium_jump`

**Trigger:** Existing nonmedical policy renews at a documented higher premium, and player accepts the renewal.

**Placeholders:** `{amount}`, `{player}`

**Modes:** player; franchise

**Availability:** Fictional jurisdiction and policy terms supplied by the save; outcomes require confirmed records, not generalized legal or financial claims.

**Required state:** old_premium; new_premium; renewal_notice; acceptance

**Consequences:** Preserve coverage and charge the confirmed new premium.

**Media examples:**

- {player} renews coverage at a higher premium.
- The new policy period costs {amount}.
- Keeping the protection now requires the recorded additional payment.

### `insurance.claim_exclusion_denial`

**Trigger:** Insurer issues a final nonmedical claim denial based on an expressly saved exclusion; no legal appeal is triggered automatically.

**Placeholders:** `{amount}`, `{claim}`, `{player}`

**Modes:** player; franchise

**Availability:** Fictional jurisdiction and policy terms supplied by the save; outcomes require confirmed records, not generalized legal or financial claims.

**Required state:** claim_loss; policy_exclusion; claim_decision; uncovered_amount

**Consequences:** Leave the covered balance zero and retain any separately available review choice.

**Media examples:**

- {player}'s insurer denies the {claim} claim under a stated exclusion.
- The decision leaves {amount} of the documented loss uncovered.
- The policy terms, rather than an invented payout, determine this claim's result.

### `insurance.deductible_paid`

**Trigger:** A covered nonmedical loss is processed and player pays the stated deductible independently of the insurer's pending portion.

**Placeholders:** `{amount}`, `{player}`

**Modes:** player; franchise

**Availability:** Fictional jurisdiction and policy terms supplied by the save; outcomes require confirmed records, not generalized legal or financial claims.

**Required state:** loss; policy_deductible; deductible_receipt; insurer_balance

**Consequences:** Reduce cash by deductible only and preserve pending insurer liability.

**Media examples:**

- {player} pays the {amount} deductible on the covered loss.
- His contractual share clears while the insurer's portion remains separate.
- The policy limits what this payment settles.

### `insurance.coverage_lapse_reinstated`

**Trigger:** Player pays an allowed reinstatement amount after a recorded policy lapse and insurer confirms prospective coverage resumes.

**Placeholders:** `{date}`, `{player}`

**Modes:** player; franchise

**Availability:** Fictional jurisdiction and policy terms supplied by the save; outcomes require confirmed records, not generalized legal or financial claims.

**Required state:** lapse_date; reinstatement_rule; payment; coverage_restart

**Consequences:** Restore coverage from stated restart date; do not cover the lapse retroactively.

**Media examples:**

- {player}'s policy coverage resumes on {date}.
- The permitted reinstatement payment is complete.
- The recorded lapse remains outside the restored coverage window.

### `insurance.agreed_value_updated`

**Trigger:** Player and insurer approve a new documented agreed value for an existing insured asset before renewal.

**Placeholders:** `{amount}`, `{asset}`, `{player}`

**Modes:** player; franchise

**Availability:** Fictional jurisdiction and policy terms supplied by the save; outcomes require confirmed records, not generalized legal or financial claims.

**Required state:** insured_asset; valuation_report; agreed_value; endorsement

**Consequences:** Update future policy valuation within stated limits and charge any recorded premium difference.

**Media examples:**

- {player}'s insured {asset} receives an updated agreed value.
- The policy records {amount} after the valuation review.
- Renewal now uses the endorsed value rather than the previous figure.

### `insurance.team_travel_policy_gap`

**Trigger:** A club's internal review discovers a planned trip outside its existing nonmedical travel policy scope before departure; club buys confirmed extension.

**Placeholders:** `{team}`, `{trip}`

**Modes:** player; franchise

**Availability:** Fictional jurisdiction and policy terms supplied by the save; outcomes require confirmed records, not generalized legal or financial claims.

**Required state:** trip_route; policy_scope; coverage_gap; extension_confirmed

**Consequences:** Close that identified gap and add premium expense before the trip.

**Media examples:**

- {team} extend their travel policy before departure.
- The planned {trip} falls outside the old coverage map.
- A confirmed extension covers the route the club actually intend to take.

## 53. Credit, debt, and usable cash

### `credit.revolving_line_opened`

**Trigger:** Lender approves a requested revolving facility and player accepts its documented limit without drawing funds.

**Placeholders:** `{amount}`, `{player}`

**Modes:** player

**Availability:** Fictional credit contracts and lending rules required; approvals, costs, and restrictions come from explicit saved terms.

**Required state:** credit_application; approval; credit_limit; drawn_balance

**Consequences:** Add available borrowing capacity with zero borrowed principal and any stated setup fee.

**Media examples:**

- {player} opens a {amount} credit line without drawing it.
- The approval creates borrowing capacity, not income.
- The lender's limit is available under the recorded terms.

### `credit.line_draw_settled`

**Trigger:** Player requests a permitted draw on an existing credit line and funds actually clear.

**Placeholders:** `{amount}`, `{player}`

**Modes:** player

**Availability:** Fictional credit contracts and lending rules required; approvals, costs, and restrictions come from explicit saved terms.

**Required state:** available_limit; draw_request; draw_settlement; interest_terms

**Consequences:** Add cash and matching principal debt; begin configured interest accrual.

**Media examples:**

- {player} draws {amount} from his existing credit line.
- Cash and debt rise together when the transfer clears.
- The facility becomes a borrowing balance rather than merely an available limit.

### `credit.line_frozen_voluntarily`

**Trigger:** Player elects a permitted voluntary lock on unused borrowing capacity and lender confirms new draws disabled.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Fictional credit contracts and lending rules required; approvals, costs, and restrictions come from explicit saved terms.

**Required state:** credit_line; voluntary_lock; confirmation; outstanding_debt

**Consequences:** Disable new draws while preserving outstanding repayment obligations.

**Media examples:**

- {player} locks further borrowing on his credit line.
- The unused limit can no longer be drawn by choice.
- Existing debt remains due under its original schedule.

### `credit.rate_reset_notice`

**Trigger:** A variable-rate debt reaches its specified reset date and confirmed benchmark changes its contractual rate.

**Placeholders:** `{player}`, `{rate}`

**Modes:** player

**Availability:** Fictional credit contracts and lending rules required; approvals, costs, and restrictions come from explicit saved terms.

**Required state:** debt_balance; reset_date; benchmark; contract_spread

**Consequences:** Recompute future scheduled interest using the saved formula.

**Media examples:**

- {player}'s loan rate resets to {rate}.
- The change follows the benchmark formula in his agreement.
- Future scheduled interest uses the confirmed new rate.

### `credit.refinance_cost_break_even`

**Trigger:** Completed refinancing reaches the date when actual cumulative interest savings equal recorded closing costs.

**Placeholders:** `{amount}`, `{player}`

**Modes:** player

**Availability:** Fictional credit contracts and lending rules required; approvals, costs, and restrictions come from explicit saved terms.

**Required state:** refinancing_cost; old_payment_model; actual_new_payments; cumulative_savings

**Consequences:** Mark realized cost recovery without predicting remaining savings.

**Media examples:**

- {player}'s refinancing recovers its recorded setup cost.
- Actual savings reach the {amount} closing expense.
- The decision has passed its measured break-even point.

### `credit.early_payoff_charge`

**Trigger:** Player voluntarily retires an existing loan early and lender applies the contract's disclosed prepayment charge.

**Placeholders:** `{amount}`, `{player}`

**Modes:** player

**Availability:** Fictional credit contracts and lending rules required; approvals, costs, and restrictions come from explicit saved terms.

**Required state:** loan_principal; payoff_request; prepayment_clause; settlement

**Consequences:** Remove principal debt and deduct payoff plus stated charge.

**Media examples:**

- {player} pays off the loan ahead of schedule.
- The signed prepayment clause adds a {amount} charge.
- The debt closes at its documented early-exit cost.

### `credit.balloon_payment_due`

**Trigger:** A saved loan reaches its final balloon-payment date and player confirms payment from available cash.

**Placeholders:** `{amount}`, `{player}`

**Modes:** player

**Availability:** Fictional credit contracts and lending rules required; approvals, costs, and restrictions come from explicit saved terms.

**Required state:** balloon_amount; maturity_date; available_cash; payment_confirmation

**Consequences:** Deduct cash and extinguish the balloon balance.

**Media examples:**

- {player} settles the loan's final {amount} balloon payment.
- The large maturity installment clears from available funds.
- A scheduled debt obligation reaches its completed ending.

### `credit.collateral_release`

**Trigger:** Lender confirms collateral release after the specifically secured obligation is satisfied.

**Placeholders:** `{asset}`, `{player}`

**Modes:** player

**Availability:** Fictional credit contracts and lending rules required; approvals, costs, and restrictions come from explicit saved terms.

**Required state:** secured_loan; payoff_status; collateral; release_confirmation

**Consequences:** Remove lender restriction from that asset without changing its ownership value.

**Media examples:**

- {player}'s lender releases {asset} from collateral.
- The secured obligation is satisfied and the release is confirmed.
- The asset stays his, with this lending restriction removed.

### `credit.collateral_topup_required`

**Trigger:** Verified collateral valuation falls below a loan's saved maintenance covenant and lender issues a valid top-up notice.

**Placeholders:** `{amount}`, `{player}`

**Modes:** player

**Availability:** Fictional credit contracts and lending rules required; approvals, costs, and restrictions come from explicit saved terms.

**Required state:** collateral_value; maintenance_ratio; loan_balance; topup_notice

**Consequences:** Open a timed choice to add collateral, repay, or take stated contractual action.

**Media examples:**

- {player}'s lender requests {amount} in added collateral.
- The notice follows the loan's saved maintenance ratio.
- The valuation change creates a deadline, not an automatic asset seizure.

### `credit.salary_advance_repaid`

**Trigger:** A permitted previously recorded salary advance is recovered through the exact authorized payroll deduction.

**Placeholders:** `{amount}`, `{player}`

**Modes:** player

**Availability:** Fictional credit contracts and lending rules required; approvals, costs, and restrictions come from explicit saved terms.

**Required state:** salary_advance; deduction_authorization; payroll_run; remaining_advance

**Consequences:** Reduce advance debt and take-home cash by the same deduction.

**Media examples:**

- {player}'s paycheck repays {amount} of his salary advance.
- The authorized deduction settles part of money received earlier.
- The advance balance falls while ordinary gross pay remains unchanged.

### `credit.cash_buffer_restored`

**Trigger:** Player's selected cash-reserve plan rebuilds liquid reserves to its saved target through completed transfers.

**Placeholders:** `{amount}`, `{player}`

**Modes:** player

**Availability:** Fictional credit contracts and lending rules required; approvals, costs, and restrictions come from explicit saved terms.

**Required state:** reserve_target; liquid_cash; completed_transfers; reserve_plan

**Consequences:** Mark reserve goal reached without increasing total wealth beyond actual income.

**Media examples:**

- {player} restores his chosen cash buffer to {amount}.
- Completed transfers reach the saved reserve target.
- More of his existing money is now available for near-term needs.

### `credit.asset_rich_payment_short`

**Trigger:** A confirmed upcoming bill exceeds spendable cash while independently valued assets exceed the bill; no default has yet occurred.

**Placeholders:** `{amount}`, `{bill}`, `{player}`

**Modes:** player

**Availability:** Fictional credit contracts and lending rules required; approvals, costs, and restrictions come from explicit saved terms.

**Required state:** bill_due; liquid_cash; asset_values; payment_deadline

**Consequences:** Open liquidity choices without declaring bankruptcy or an unpaid debt.

**Media examples:**

- {player} has valuable assets but not enough ready cash for {bill}.
- The deadline approaches with a {amount} liquidity gap.
- His balance sheet and his spending account tell different stories.

### `credit.auction_reserve_not_met`

**Trigger:** Player attempts to sell an owned asset for liquidity through a documented auction, but highest bid misses the valid reserve and no sale closes.

**Placeholders:** `{asset}`, `{player}`

**Modes:** player

**Availability:** Fictional credit contracts and lending rules required; approvals, costs, and restrictions come from explicit saved terms.

**Required state:** asset; reserve_price; highest_bid; auction_result

**Consequences:** Retain asset and provide no sale cash; charge only stated auction costs.

**Media examples:**

- {player}'s {asset} remains unsold after the reserve is missed.
- The auction does not produce the cash he planned to raise.
- Ownership stays in place while recorded sale-attempt costs remain.

### `credit.automatic_payment_prevents_late`

**Trigger:** A player-enabled payment instruction executes a required debt installment before its deadline and receipt is verified.

**Placeholders:** `{amount}`, `{player}`

**Modes:** player

**Availability:** Fictional credit contracts and lending rules required; approvals, costs, and restrictions come from explicit saved terms.

**Required state:** payment_instruction; available_cash; due_date; receipt

**Consequences:** Set installment paid and avoid only this specific lateness event.

**Media examples:**

- {player}'s automatic loan payment clears before the deadline.
- The saved instruction settles the scheduled {amount} installment.
- One recurring obligation is handled without a missed-date charge.

### `credit.guarantee_released`

**Trigger:** A lender agrees in writing to release player from a previously recorded business-loan guarantee after stated conditions are met.

**Placeholders:** `{business}`, `{player}`

**Modes:** player

**Availability:** Fictional credit contracts and lending rules required; approvals, costs, and restrictions come from explicit saved terms.

**Required state:** personal_guarantee; release_conditions; lender_consent; guarantee_status

**Consequences:** Remove contingent liability prospectively; underlying business debt may remain.

**Media examples:**

- {player} is released from {business}'s loan guarantee.
- The lender confirms the agreed release conditions are satisfied.
- The business balance remains separate from his former contingent obligation.

## 54. Estate planning and charitable governance

### `planning.living_trust_funded`

**Trigger:** Player completes an approved transfer of specified assets into a valid living trust while alive.

**Placeholders:** `{assets}`, `{player}`

**Modes:** player; franchise

**Availability:** Optional fictional planning and nonprofit governance systems; no bereavement is needed and all authority changes require valid recorded consent.

**Required state:** trust_document; transfer_assets; transfer_confirmation; trust_balance

**Consequences:** Move asset control to the trust terms without recording a gift to an outside recipient.

**Media examples:**

- {player} funds his living trust with {assets}.
- The documented transfers put the plan into operation.
- Planning changes how the assets are held while he remains alive.

### `planning.beneficiary_record_updated`

**Trigger:** Player submits a valid beneficiary update for an existing account and provider confirms acceptance.

**Placeholders:** `{date}`, `{player}`

**Modes:** player; franchise

**Availability:** Optional fictional planning and nonprofit governance systems; no bereavement is needed and all authority changes require valid recorded consent.

**Required state:** beneficiary_instruction; account_provider; provider_acceptance; effective_date

**Consequences:** Replace account designation from its stated effective date; current ownership unchanged.

**Media examples:**

- {player}'s beneficiary update is accepted by the account provider.
- The recorded designation changes on {date}.
- The planning instruction is complete without any transfer of money today.

### `planning.successor_manager_named`

**Trigger:** Player appoints an approved successor manager for an existing holding company through signed governance documents, without activating succession.

**Placeholders:** `{business}`, `{player}`

**Modes:** player; franchise

**Availability:** Optional fictional planning and nonprofit governance systems; no bereavement is needed and all authority changes require valid recorded consent.

**Required state:** holding_company; successor_appointment; governance_approval; activation_conditions

**Consequences:** Store authorized fallback leadership while player retains current control.

**Media examples:**

- {player} names a successor manager for {business}.
- The appointment records who may act if the saved conditions arise.
- Control remains unchanged while the contingency plan gains a named role.

### `planning.inventory_reconciled`

**Trigger:** Independent planner reconciles player's asset inventory against provider statements and all previously omitted holdings are entered.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Optional fictional planning and nonprofit governance systems; no bereavement is needed and all authority changes require valid recorded consent.

**Required state:** asset_inventory; provider_statements; reconciliation; omitted_assets

**Consequences:** Improve planning completeness without changing values beyond verified corrections.

**Media examples:**

- {player}'s planning inventory now includes every reconciled holding.
- The review adds the assets missing from the old list.
- Better records make the plan more complete without creating new wealth.

### `planning.document_review_sunset`

**Trigger:** A planning authority grant reaches its expressly written expiry and player lets it lapse without renewal.

**Placeholders:** `{date}`, `{player}`

**Modes:** player; franchise

**Availability:** Optional fictional planning and nonprofit governance systems; no bereavement is needed and all authority changes require valid recorded consent.

**Required state:** authority_document; expiry_date; renewal_choice; active_authority

**Consequences:** Remove that delegated authority only; underlying assets and valid documents remain.

**Media examples:**

- {player}'s temporary planning authority expires on {date}.
- He chooses not to renew the time-limited mandate.
- The delegated power ends under its own recorded terms.

### `planning.independent_custodian_selected`

**Trigger:** Player appoints a qualified permitted independent custodian for trust-held assets and accepted transfer completes.

**Placeholders:** `{amount}`, `{player}`

**Modes:** player; franchise

**Availability:** Optional fictional planning and nonprofit governance systems; no bereavement is needed and all authority changes require valid recorded consent.

**Required state:** custodian_eligibility; appointment; asset_transfer; custody_fee

**Consequences:** Move custody and add stated fees without giving custodian beneficial ownership.

**Media examples:**

- {player}'s trust assets move to an independent custodian.
- The accepted appointment separates custody from beneficial ownership.
- The plan now carries the recorded {amount} custody cost.

### `philanthropy.restricted_grant_conditions_met`

**Trigger:** An existing conditional grant reaches its review date and recipient supplies verified evidence satisfying all saved release conditions.

**Placeholders:** `{condition}`, `{foundation}`, `{recipient}`

**Modes:** player; franchise

**Availability:** Optional fictional planning and nonprofit governance systems; no bereavement is needed and all authority changes require valid recorded consent.

**Required state:** grant_conditions; recipient_report; verification; restricted_balance

**Consequences:** Release the previously committed grant tranche and close those conditions.

**Media examples:**

- {foundation} release the conditional grant after verification.
- {recipient} meet the documented {condition} requirement.
- The promised support becomes available under the original terms.

### `philanthropy.restricted_grant_paused`

**Trigger:** Existing grant review verifies a required milestone is incomplete and board pauses the next tranche under signed terms.

**Placeholders:** `{date}`, `{foundation}`, `{milestone}`

**Modes:** player; franchise

**Availability:** Optional fictional planning and nonprofit governance systems; no bereavement is needed and all authority changes require valid recorded consent.

**Required state:** grant_terms; milestone_report; missing_condition; board_decision

**Consequences:** Retain undisbursed funds and set a stated remediation review date.

**Media examples:**

- {foundation} pause the next grant installment.
- The documented {milestone} condition is not yet met.
- The recipient has until {date} for the agreed review rather than an automatic cancellation.

### `philanthropy.matching_pool_unlocked`

**Trigger:** Verified qualifying outside donations reach an existing donor's matching threshold and the pledged match is paid.

**Placeholders:** `{amount}`, `{foundation}`

**Modes:** player; franchise

**Availability:** Optional fictional planning and nonprofit governance systems; no bereavement is needed and all authority changes require valid recorded consent.

**Required state:** matching_pledge; qualifying_donations; threshold; match_receipt

**Consequences:** Add matching funds once and mark pledge fulfilled.

**Media examples:**

- {foundation} unlock the pledged {amount} donation match.
- Verified outside contributions reach the stated trigger.
- The campaign gains money already promised for this condition.

### `philanthropy.board_conflict_recusal`

**Trigger:** Foundation director declares a recorded financial conflict in a grant applicant and is formally excluded from that decision.

**Placeholders:** `{foundation}`, `{recipient}`

**Modes:** player; franchise

**Availability:** Optional fictional planning and nonprofit governance systems; no bereavement is needed and all authority changes require valid recorded consent.

**Required state:** director_interest; applicant; conflict_policy; recusal_record

**Consequences:** Remove that director's vote for this application; keep ordinary duties elsewhere.

**Media examples:**

- {foundation} record a recusal for the {recipient} grant decision.
- The declared financial interest removes one director from this vote.
- The remaining eligible board decide the application.

### `philanthropy.administration_ratio_review`

**Trigger:** Completed foundation accounts breach a voluntarily adopted administrative-cost limit and board approves a specific correction plan.

**Placeholders:** `{foundation}`, `{plan}`

**Modes:** player; franchise

**Availability:** Optional fictional planning and nonprofit governance systems; no bereavement is needed and all authority changes require valid recorded consent.

**Required state:** admin_expenses; total_spend; internal_limit; correction_plan

**Consequences:** Schedule approved cost changes without labeling the organization fraudulent.

**Media examples:**

- {foundation} approve a plan to reduce administrative costs.
- The completed accounts exceed their own spending limit.
- The review leads to {plan}, with future results still to be measured.

### `philanthropy.endowment_draw_cap_used`

**Trigger:** Foundation's declared annual draw rule limits proposed grants and board adopts a budget within the cap.

**Placeholders:** `{amount}`, `{foundation}`

**Modes:** player; franchise

**Availability:** Optional fictional planning and nonprofit governance systems; no bereavement is needed and all authority changes require valid recorded consent.

**Required state:** endowment_value; draw_rule; proposed_grants; approved_budget

**Consequences:** Restrict this budget to allowed spending; preserve remainder in endowment.

**Media examples:**

- {foundation} adopt a grant budget within their endowment cap.
- The saved draw rule limits this year's spending to {amount}.
- The approved plan leaves the remaining endowment invested.

### `philanthropy.community_budget_vote`

**Trigger:** Foundation gives an approved defined grant pool to a certified community allocation vote and implements the winning eligible selections.

**Placeholders:** `{amount}`, `{foundation}`

**Modes:** player; franchise

**Availability:** Optional fictional planning and nonprofit governance systems; no bereavement is needed and all authority changes require valid recorded consent.

**Required state:** participatory_pool; eligible_projects; certified_vote; allocations

**Consequences:** Disburse pool to selected projects and preserve spending audit records.

**Media examples:**

- {foundation} implement the community's grant choices.
- The certified vote allocates the {amount} participatory pool.
- Eligible projects receive funding through the announced decision process.

### `philanthropy.donor_data_minimization`

**Trigger:** Foundation completes an approved donor-data reduction project and independent check verifies only required records retained.

**Placeholders:** `{foundation}`

**Modes:** player; franchise

**Availability:** Optional fictional planning and nonprofit governance systems; no bereavement is needed and all authority changes require valid recorded consent.

**Required state:** data_policy; retention_requirements; deletion_log; verification

**Consequences:** Reduce stored personal data while retaining required financial records.

**Media examples:**

- {foundation} complete their donor-data cleanup.
- The verified process retains the required financial records.
- Supporter information now follows the approved minimum-retention policy.

### `philanthropy.pledge_budget_reduced`

**Trigger:** Player voluntarily renegotiates an unfulfilled revocable future pledge with nonprofit consent after a recorded cash-budget change.

**Placeholders:** `{amount}`, `{foundation}`, `{player}`

**Modes:** player; franchise

**Availability:** Optional fictional planning and nonprofit governance systems; no bereavement is needed and all authority changes require valid recorded consent.

**Required state:** pledge_terms; revocability; budget_change; recipient_consent

**Consequences:** Replace future pledged amount only; do not claw back completed donations.

**Media examples:**

- {player} and {foundation} agree to a smaller future pledge.
- The revised commitment follows the recorded budget change.
- Past gifts stand while the remaining promise becomes {amount}.

## 55. Team cash flow, facilities, and operating budgets

### `club.season_ticket_cash_arrives`

**Trigger:** A scheduled season-ticket collection window closes and actual cleared receipts are recorded.

**Placeholders:** `{amount}`, `{team}`

**Modes:** franchise

**Availability:** Club finance module enabled with contracts, invoices, reserves, and explicit arena responsibilities recorded.

**Required state:** ticket_contracts; collection_window; cleared_receipts; cash_balance

**Consequences:** Credit cash and record future matchday service obligations; revenue recognition is separate.

**Media examples:**

- {team} collect {amount} in cleared season-ticket receipts.
- The collection window gives the club cash before all the games are played.
- The tickets still carry the promised season of arena access.

### `club.ticket_refunds_paid`

**Trigger:** Club executes its published refund policy for verified canceled fixtures and completed repayments are confirmed.

**Placeholders:** `{amount}`, `{team}`

**Modes:** franchise

**Availability:** Club finance module enabled with contracts, invoices, reserves, and explicit arena responsibilities recorded.

**Required state:** canceled_fixtures; refund_policy; eligible_tickets; repayments

**Consequences:** Reduce cash and corresponding ticket liabilities under the stated policy.

**Media examples:**

- {team} complete the eligible canceled-fixture refunds.
- Supporters receive {amount} under the club's announced policy.
- The refund ledger closes these recorded ticket claims.

### `club.naming_payment_delayed`

**Trigger:** Arena naming-rights partner misses a recorded noncriminal payment deadline and club activates its contractual reminder process.

**Placeholders:** `{amount}`, `{team}`

**Modes:** franchise

**Availability:** Club finance module enabled with contracts, invoices, reserves, and explicit arena responsibilities recorded.

**Required state:** naming_agreement; payment_due; receipt_status; reminder_notice

**Consequences:** Mark receivable overdue and open contract response choices without alleging fraud.

**Media examples:**

- {team} await the overdue arena-rights payment.
- The scheduled {amount} installment has not cleared.
- The reminder process begins under the existing commercial agreement.

### `club.naming_payment_catchup`

**Trigger:** A previously overdue arena-rights installment is actually paid and club confirms receipt.

**Placeholders:** `{amount}`, `{team}`

**Modes:** franchise

**Availability:** Club finance module enabled with contracts, invoices, reserves, and explicit arena responsibilities recorded.

**Required state:** overdue_receivable; payment_received; installment_id; cash_balance

**Consequences:** Credit cash and clear this receivable without implying full future payment.

**Media examples:**

- {team} receive the overdue {amount} arena-rights installment.
- The delayed payment clears into the club's account.
- This receivable is settled; later installments retain their own dates.

### `club.arena_rent_escalator`

**Trigger:** Existing arena lease reaches a specified escalation date and landlord issues the valid revised invoice.

**Placeholders:** `{amount}`, `{team}`

**Modes:** franchise

**Availability:** Club finance module enabled with contracts, invoices, reserves, and explicit arena responsibilities recorded.

**Required state:** lease_escalator; effective_date; rent_invoice; operating_budget

**Consequences:** Update future rent expense by the signed formula.

**Media examples:**

- {team}'s arena rent rises to {amount}.
- The lease's recorded escalation clause reaches its effective date.
- The next operating budget must use the new invoice.

### `club.nonbasketball_event_profit`

**Trigger:** Club hosts a permitted nonbasketball arena event and final accounts certify a positive net result.

**Placeholders:** `{amount}`, `{arena}`, `{event}`, `{team}`

**Modes:** franchise

**Availability:** Club finance module enabled with contracts, invoices, reserves, and explicit arena responsibilities recorded.

**Required state:** event_license; event_receipts; event_costs; closed_accounts

**Consequences:** Add verified net operating surplus without assuming basketball effects.

**Media examples:**

- {arena}'s {event} produces a verified {amount} surplus.
- The completed accounts show income above the recorded event costs.
- {team} gain a financial result from a date outside their playing schedule.

### `club.nonbasketball_event_damage_bill`

**Trigger:** A permitted arena event ends with a verified repair invoice and contractual cost allocation assigns it to club.

**Placeholders:** `{amount}`, `{event}`, `{team}`

**Modes:** franchise

**Availability:** Club finance module enabled with contracts, invoices, reserves, and explicit arena responsibilities recorded.

**Required state:** event_contract; damage_report; repair_invoice; cost_allocation

**Consequences:** Add the club's recorded repair expense; venue availability follows inspections separately.

**Media examples:**

- {team} receive the {amount} repair bill after {event}.
- The event agreement assigns the verified cost to the club.
- The expense is recorded without assuming a canceled basketball game.

### `club.energy_budget_shock`

**Trigger:** Utility supplier's verified tariff change increases forecast arena energy expense under the existing service contract.

**Placeholders:** `{amount}`, `{team}`

**Modes:** franchise

**Availability:** Club finance module enabled with contracts, invoices, reserves, and explicit arena responsibilities recorded.

**Required state:** utility_contract; tariff_notice; usage_forecast; budget_revision

**Consequences:** Raise forecast expense; actual cost waits on usage invoices.

**Media examples:**

- {team} revise the arena energy budget after the tariff change.
- Forecast costs rise by {amount} under the supplier's notice.
- The operating plan changes before the actual utility bills arrive.

### `club.payroll_reserve_used`

**Trigger:** Club draws from a designated internal payroll reserve to complete a scheduled salary run when ordinary cash is insufficient.

**Placeholders:** `{amount}`, `{team}`

**Modes:** franchise

**Availability:** Club finance module enabled with contracts, invoices, reserves, and explicit arena responsibilities recorded.

**Required state:** payroll_due; operating_cash; reserve_balance; salary_receipts

**Consequences:** Transfer reserve funds and pay salaries; lower reserve without creating debt.

**Media examples:**

- {team} use {amount} from their payroll reserve.
- The scheduled salary run clears despite the operating-cash shortage.
- The wages are paid and the reserve is smaller.

### `club.owner_capital_injection`

**Trigger:** Approved owner contributes new equity funds to club and cleared receipt is verified without a control transfer.

**Placeholders:** `{amount}`, `{owner}`, `{team}`

**Modes:** franchise

**Availability:** Club finance module enabled with contracts, invoices, reserves, and explicit arena responsibilities recorded.

**Required state:** owner_contribution; approval; funds_received; ownership_terms

**Consequences:** Increase cash and equity under stated terms; owner identity remains unchanged.

**Media examples:**

- {owner} inject {amount} in approved capital into {team}.
- The funds clear without a transfer of club control.
- The balance sheet receives new equity rather than a loan.

### `club.owner_bridge_loan`

**Trigger:** Club receives a permitted documented short-term owner loan with recorded maturity and interest terms.

**Placeholders:** `{amount}`, `{owner}`, `{team}`

**Modes:** franchise

**Availability:** Club finance module enabled with contracts, invoices, reserves, and explicit arena responsibilities recorded.

**Required state:** owner_loan; league_permission; receipt; maturity; interest

**Consequences:** Increase cash and debt and schedule the exact repayment obligation.

**Media examples:**

- {team} receive a {amount} bridge loan from {owner}.
- The club gain cash and a new repayment date.
- The agreement is borrowing, with the recorded terms still to fulfill.

### `club.sponsor_in_kind_delivery`

**Trigger:** Commercial partner fulfills a signed in-kind obligation by delivering verified eligible equipment instead of cash.

**Placeholders:** `{equipment}`, `{team}`

**Modes:** franchise

**Availability:** Club finance module enabled with contracts, invoices, reserves, and explicit arena responsibilities recorded.

**Required state:** sponsorship_terms; delivery; accepted_equipment; contract_value

**Consequences:** Add equipment and settle only the matched in-kind obligation.

**Media examples:**

- {team} receive the promised {equipment} delivery.
- The partner fulfills the agreement through goods rather than cash.
- The accepted equipment closes this in-kind contract item.

### `club.vendor_bulk_discount`

**Trigger:** Club completes a planned group procurement at a documented volume discount and accepts delivery.

**Placeholders:** `{amount}`, `{equipment}`, `{team}`

**Modes:** franchise

**Availability:** Club finance module enabled with contracts, invoices, reserves, and explicit arena responsibilities recorded.

**Required state:** procurement_order; volume_threshold; invoice; accepted_delivery

**Consequences:** Record actual lower unit costs without asserting unrelated profit.

**Media examples:**

- {team} secure the recorded bulk discount on {equipment}.
- The accepted order saves {amount} against the standard quoted total.
- A procurement choice changes this invoice's cost.

### `club.construction_contingency_spent`

**Trigger:** An approved arena project encounters a verified unforeseen condition and authorized contingency funds pay the required change order.

**Placeholders:** `{amount}`, `{issue}`, `{team}`

**Modes:** franchise

**Availability:** Club finance module enabled with contracts, invoices, reserves, and explicit arena responsibilities recorded.

**Required state:** project_budget; condition_report; change_order; contingency_balance

**Consequences:** Reduce contingency by approved cost; project continuation remains scheduled.

**Media examples:**

- {team} spend {amount} of the arena-project contingency.
- The approved change order addresses {issue}.
- The project continues with a smaller reserve for later surprises.

### `club.budget_veto_exercised`

**Trigger:** A club's valid governance rule gives finance committee veto authority and it rejects a proposed nonplaying discretionary expenditure.

**Placeholders:** `{amount}`, `{project}`, `{team}`

**Modes:** franchise

**Availability:** Club finance module enabled with contracts, invoices, reserves, and explicit arena responsibilities recorded.

**Required state:** spending_proposal; committee_authority; vote_result; budget_status

**Consequences:** Keep money unspent and mark proposal rejected without changing player contracts.

**Media examples:**

- {team}'s finance committee reject the {project} expense.
- The vote uses the spending authority in the club's governance rules.
- The proposed {amount} remains outside the approved budget.

## 56. International pay and cross-border contracts

### `international.salary_currency_choice`

**Trigger:** An existing contract offers a valid one-time payment-currency election and player files it before the deadline.

**Placeholders:** `{currency}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Only in leagues with the declared cross-border contract, banking, and currency rules; every amount uses the save's own exchange and fee records.

**Required state:** currency_option; allowed_currencies; election_notice; election_deadline

**Consequences:** Set future salary settlement currency according to the saved conversion formula.

**Media examples:**

- {player} elects to receive future salary in {currency}.
- The contract's currency option is exercised before its deadline.
- {team}'s next payroll uses the recorded settlement choice.

### `international.split_currency_payroll`

**Trigger:** Player and club activate an existing permitted two-currency salary split and the first payment reconciles correctly.

**Placeholders:** `{currency1}`, `{currency2}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Only in leagues with the declared cross-border contract, banking, and currency rules; every amount uses the save's own exchange and fee records.

**Required state:** currency_split; conversion_formula; payroll_receipts; reconciliation

**Consequences:** Credit the two confirmed account balances without treating the split as extra salary.

**Media examples:**

- {player}'s first split-currency payment reconciles.
- {team} settle the agreed portions in {currency1} and {currency2}.
- Two receipts fulfill one salary obligation.

### `international.bank_holiday_clearing_delay`

**Trigger:** A correctly initiated salary transfer misses normal clearing timing because of a confirmed destination banking holiday.

**Placeholders:** `{country}`, `{days}`, `{player}`

**Modes:** player; franchise

**Availability:** Only in leagues with the declared cross-border contract, banking, and currency rules; every amount uses the save's own exchange and fee records.

**Required state:** transfer_initiated; bank_calendar; clearing_date; salary_receipt

**Consequences:** Mark transfer in transit; do not label club default unless its contract deadline is actually breached.

**Media examples:**

- {player}'s salary transfer waits on {country}'s bank holiday.
- The payment is initiated, but the clearing calendar adds {days} days.
- Money in transit is not yet money received.

### `international.conversion_fee_reconciled`

**Trigger:** Player's cross-border salary receipt includes disclosed conversion fees and reconciliation verifies the net amount.

**Placeholders:** `{amount}`, `{player}`

**Modes:** player; franchise

**Availability:** Only in leagues with the declared cross-border contract, banking, and currency rules; every amount uses the save's own exchange and fee records.

**Required state:** gross_transfer; exchange_rate; fee_schedule; net_receipt

**Consequences:** Credit net cash and record the actual conversion cost.

**Media examples:**

- {player}'s salary conversion carries a verified {amount} fee.
- The gross transfer and net receipt reconcile under the saved schedule.
- The cross-border payment arrives with its documented currency cost.

### `international.fx_hedge_settled`

**Trigger:** An allowed preexisting currency hedge reaches its contract date and settlement is completed at the saved terms.

**Placeholders:** `{amount}`, `{player}`, `{result}`

**Modes:** player; franchise

**Availability:** Only in leagues with the declared cross-border contract, banking, and currency rules; every amount uses the save's own exchange and fee records.

**Required state:** hedge_contract; settlement_date; reference_rate; settlement_receipt

**Consequences:** Apply the actual hedge cash result alongside salary conversion; no prediction of later rates.

**Media examples:**

- {player}'s currency hedge settles with a {result} of {amount}.
- The completed contract fixes this settlement's exchange outcome.
- Future salary conversions remain exposed to their own dates and terms.

### `international.salary_escrow_funded`

**Trigger:** Foreign club fulfills a signed player-pay security clause by depositing the required verified amount with an approved independent escrow holder.

**Placeholders:** `{amount}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Only in leagues with the declared cross-border contract, banking, and currency rules; every amount uses the save's own exchange and fee records.

**Required state:** pay_security_clause; escrow_holder; required_deposit; deposit_confirmation

**Consequences:** Mark specified future wages secured to the deposit limit, not already paid.

**Media examples:**

- {team} fund the required salary escrow for {player}.
- The independent holder confirms the {amount} deposit.
- The security is in place while the future wages remain future obligations.

### `international.escrow_release_on_payday`

**Trigger:** Existing salary escrow releases a scheduled installment after its contractual conditions are verified and player receives it.

**Placeholders:** `{amount}`, `{player}`

**Modes:** player; franchise

**Availability:** Only in leagues with the declared cross-border contract, banking, and currency rules; every amount uses the save's own exchange and fee records.

**Required state:** escrow_terms; pay_date; release_conditions; receipt

**Consequences:** Credit salary cash and reduce escrow balance by the same amount.

**Media examples:**

- {player} receives {amount} from the salary escrow.
- The scheduled release conditions are satisfied.
- Secured money becomes actual pay on the contract's recorded date.

### `international.guaranteed_net_pay_grossup`

**Trigger:** A valid net-pay clause requires the club to increase gross payroll after the saved fictional withholding rate changes.

**Placeholders:** `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Only in leagues with the declared cross-border contract, banking, and currency rules; every amount uses the save's own exchange and fee records.

**Required state:** net_pay_clause; withholding_change; grossup_formula; payroll

**Consequences:** Increase club gross cost to preserve specified net pay under the configured formula.

**Media examples:**

- {team} adjust gross salary to preserve {player}'s contracted net pay.
- The recorded withholding change activates the agreed formula.
- The player keeps the stated net amount while the club's payroll cost changes.

### `international.housing_clause_in_kind`

**Trigger:** Overseas contract's approved housing clause is fulfilled through a verified provided residence rather than cash allowance.

**Placeholders:** `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Only in leagues with the declared cross-border contract, banking, and currency rules; every amount uses the save's own exchange and fee records.

**Required state:** housing_clause; approved_residence; availability_confirmation; allowance_status

**Consequences:** Mark housing obligation met in kind and suppress duplicate cash housing payment.

**Media examples:**

- {team} provide the residence specified in {player}'s contract.
- The verified housing arrangement fulfills the in-kind clause.
- The saved agreement supplies a place to live rather than a second cash allowance.

### `international.return_fare_reserved`

**Trigger:** Club books and pays the permitted return journey required by a player's existing international contract.

**Placeholders:** `{destination}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Only in leagues with the declared cross-border contract, banking, and currency rules; every amount uses the save's own exchange and fee records.

**Required state:** return_fare_clause; approved_route; booking_confirmation; payment

**Consequences:** Fulfill fare obligation and add documented club travel expense.

**Media examples:**

- {team} book {player}'s contracted return journey.
- The confirmed route to {destination} fulfills the existing fare clause.
- The travel provision becomes a paid reservation.

### `international.buyout_release_paid`

**Trigger:** Player uses a valid cross-league release clause and the exact required payment clears; club confirms contractual release without guaranteeing new registration.

**Placeholders:** `{amount}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Only in leagues with the declared cross-border contract, banking, and currency rules; every amount uses the save's own exchange and fee records.

**Required state:** release_clause; buyout_amount; payment_receipt; club_release

**Consequences:** End contract under the agreed release terms; next-league clearance remains separate.

**Media examples:**

- {player} pays the {amount} required by his release clause.
- {team} confirm the contractual release after receipt.
- The old agreement ends; eligibility elsewhere still needs its own checks.

### `international.buyout_deadline_expired`

**Trigger:** A time-limited cross-league release clause expires unused and player remains under the existing contract.

**Placeholders:** `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Only in leagues with the declared cross-border contract, banking, and currency rules; every amount uses the save's own exchange and fee records.

**Required state:** release_window; deadline; payment_status; current_contract

**Consequences:** Disable that release route while preserving the existing playing obligation.

**Media examples:**

- {player}'s special release window expires unused.
- The recorded deadline passes without the required payment.
- His {team} contract continues under its remaining terms.

### `international.loan_salary_allocation`

**Trigger:** Two clubs in a valid existing player loan reconcile the first salary payment under their saved cost-sharing agreement.

**Placeholders:** `{otherteam}`, `{player}`, `{share}`, `{team}`

**Modes:** player; franchise

**Availability:** Only in leagues with the declared cross-border contract, banking, and currency rules; every amount uses the save's own exchange and fee records.

**Required state:** active_loan; cost_shares; payroll_receipts; club_reconciliation

**Consequences:** Charge each club only its agreed share while player receives one total salary.

**Media examples:**

- {team} and {otherteam} reconcile {player}'s loan salary.
- The cost-sharing agreement assigns {share} to the receiving club.
- Two clubs fund one recorded player payment.

### `international.transfer_fee_installment_paid`

**Trigger:** An already completed permitted cross-league transfer reaches a scheduled fee installment and receiving club actually pays it.

**Placeholders:** `{amount}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Only in leagues with the declared cross-border contract, banking, and currency rules; every amount uses the save's own exchange and fee records.

**Required state:** transfer_fee_schedule; installment_due; payment_received; remaining_balance

**Consequences:** Credit seller cash and reduce buyer fee debt; player status stays unchanged.

**Media examples:**

- {team} settle the scheduled {amount} transfer-fee installment.
- The payment follows an existing cross-league agreement.
- {player}'s registration does not change when the club balance falls.

### `international.bank_account_portability_denied`

**Trigger:** A player moving jurisdictions asks to retain a particular payroll account and club's verified payment system cannot use it under declared rules.

**Placeholders:** `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Only in leagues with the declared cross-border contract, banking, and currency rules; every amount uses the save's own exchange and fee records.

**Required state:** account_request; payroll_rules; compatibility_check; alternative_account

**Consequences:** Require a supported settlement account; do not invent missed salary until its deadline passes.

**Media examples:**

- {player}'s preferred account is incompatible with the new payroll system.
- {team} request an account that supports the declared payment route.
- The banking choice needs revision before the scheduled salary run.

## 57. Labor benefits and negotiated workplace rights

### `labor.pension_vesting_confirmed`

**Trigger:** Benefits administrator confirms player reaches the plan's saved service requirement for vested pension rights.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Enabled only where the save's fictional collective agreement or employee scheme grants the named benefit or process.

**Required state:** pension_rules; credited_service; vesting_threshold; administrator_confirmation

**Consequences:** Preserve the specified accrued rights under the plan; no immediate pension payment.

**Media examples:**

- {player}'s pension rights become vested under the plan.
- The administrator confirms his credited service meets the requirement.
- A career milestone creates a future benefit right rather than a new paycheck.

### `labor.pension_contribution_posted`

**Trigger:** Club's due employer pension contribution is actually credited to player's plan account.

**Placeholders:** `{amount}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Enabled only where the save's fictional collective agreement or employee scheme grants the named benefit or process.

**Required state:** employer_contribution; payroll_period; plan_receipt; pension_balance

**Consequences:** Add contribution to plan assets without adding spendable cash.

**Media examples:**

- {team}'s {amount} pension contribution posts for {player}.
- The plan account receives the employer payment.
- His benefit balance rises while take-home salary remains separate.

### `labor.pension_transfer_accepted`

**Trigger:** Receiving eligible pension plan accepts a valid transfer from a previous permitted plan and funds clear.

**Placeholders:** `{amount}`, `{player}`

**Modes:** player; franchise

**Availability:** Enabled only where the save's fictional collective agreement or employee scheme grants the named benefit or process.

**Required state:** source_plan; receiving_plan; transfer_eligibility; transfer_receipt

**Consequences:** Move accumulated pension assets and extinguish duplicate source holding.

**Media examples:**

- {player}'s eligible pension transfer is complete.
- {amount} moves into the accepted receiving plan.
- His retirement assets change providers without becoming salary.

### `labor.benefit_enrollment_completed`

**Trigger:** Eligible player submits a valid voluntary benefit election inside the saved enrollment window and administrator accepts it.

**Placeholders:** `{benefit}`, `{date}`, `{player}`

**Modes:** player; franchise

**Availability:** Enabled only where the save's fictional collective agreement or employee scheme grants the named benefit or process.

**Required state:** benefit_eligibility; enrollment_window; election; acceptance

**Consequences:** Activate elected benefit on its stated date with its specified contribution.

**Media examples:**

- {player} completes enrollment in {benefit}.
- The accepted election activates the scheme on {date}.
- Participation now follows the selected contribution terms.

### `labor.enrollment_window_missed`

**Trigger:** Eligible player submits a benefit election after a declared deadline with no applicable exception, and administrator defers it to next window.

**Placeholders:** `{benefit}`, `{date}`, `{player}`

**Modes:** player; franchise

**Availability:** Enabled only where the save's fictional collective agreement or employee scheme grants the named benefit or process.

**Required state:** enrollment_deadline; submission_time; exception_status; next_window

**Consequences:** Keep this election inactive until the defined next opportunity; preserve other benefits.

**Media examples:**

- {player}'s late {benefit} election waits until {date}.
- The saved enrollment window closes before his submission.
- This benefit remains inactive without changing the schemes he already holds.

### `labor.transition_fund_grant`

**Trigger:** Eligible player receives an approved benefit-scheme career-transition grant for a documented training program.

**Placeholders:** `{amount}`, `{player}`, `{program}`

**Modes:** player; franchise

**Availability:** Enabled only where the save's fictional collective agreement or employee scheme grants the named benefit or process.

**Required state:** transition_eligibility; approved_program; grant_decision; receipt

**Consequences:** Credit restricted training funds and track permitted spending only.

**Media examples:**

- {player} receives {amount} for approved career-transition training.
- The benefit scheme approves his {program} application.
- The funds support a next-career plan under their stated restrictions.

### `labor.emergency_assistance_grant`

**Trigger:** Player association approves a nonrepayable assistance grant after verifying a defined qualifying cash emergency.

**Placeholders:** `{amount}`, `{player}`

**Modes:** player; franchise

**Availability:** Enabled only where the save's fictional collective agreement or employee scheme grants the named benefit or process.

**Required state:** assistance_rules; qualifying_emergency; application; grant_receipt

**Consequences:** Credit the stated grant without creating a loan or changing team salary.

**Media examples:**

- The association approve {player}'s emergency-assistance grant.
- The verified application produces {amount} in nonrepayable support.
- A benefit fund supplies help beyond his team contract.

### `labor.strike_authorization_vote`

**Trigger:** Members certify a valid vote authorizing player representatives to call a strike under configured labor rules, with no stoppage yet called.

**Placeholders:** `{season}`

**Modes:** player; franchise

**Availability:** Enabled only where the save's fictional collective agreement or employee scheme grants the named benefit or process.

**Required state:** ballot_rules; certified_vote; authorization_threshold; strike_called

**Consequences:** Enable an authorized future stoppage choice; games remain scheduled.

**Media examples:**

- Players authorize a possible strike in a certified vote.
- The union gain a mandate, not an automatic canceled game.
- {season}'s schedule remains active until a separate stoppage decision.

### `labor.authorized_strike_begins`

**Trigger:** Representatives formally call a previously authorized player strike for stated dates under configured rules and league confirms affected fixtures postponed.

**Placeholders:** `{date}`, `{league}`

**Modes:** player; franchise

**Availability:** Enabled only where the save's fictional collective agreement or employee scheme grants the named benefit or process.

**Required state:** strike_authorization; call_notice; strike_dates; fixture_decision

**Consequences:** Pause the confirmed fixtures and apply recorded pay rules; do not call it an owner lockout.

**Media examples:**

- Players begin their authorized strike on {date}.
- {league} postpone the confirmed affected fixtures.
- A player-called stoppage changes the schedule under the saved labor process.

### `labor.strike_fund_payment`

**Trigger:** A valid participant in an ongoing authorized strike receives a scheduled payment from the union's recorded strike fund.

**Placeholders:** `{amount}`, `{player}`

**Modes:** player; franchise

**Availability:** Enabled only where the save's fictional collective agreement or employee scheme grants the named benefit or process.

**Required state:** strike_status; participant_eligibility; fund_rules; payment_receipt

**Consequences:** Credit the benefit payment and debit fund balance; not team playing salary.

**Media examples:**

- {player} receives {amount} from the strike fund.
- The payment follows the participant rules for the active stoppage.
- Union support reaches his account separately from club payroll.

### `labor.travel_rest_right_used`

**Trigger:** Player invokes a saved contractual travel-rest entitlement and club removes a conflicting optional event after verifying eligibility.

**Placeholders:** `{event}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Enabled only where the save's fictional collective agreement or employee scheme grants the named benefit or process.

**Required state:** rest_entitlement; travel_schedule; event_requirement; club_confirmation

**Consequences:** Cancel only the eligible optional event and preserve mandatory playing obligations.

**Media examples:**

- {player} uses his agreed travel-rest entitlement.
- {team} remove the conflicting optional {event}.
- The calendar changes through a written workplace right.

### `labor.education_leave_approved`

**Trigger:** Club approves player-requested paid education leave under a saved benefit, with exact permitted dates documented.

**Placeholders:** `{course}`, `{days}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Enabled only where the save's fictional collective agreement or employee scheme grants the named benefit or process.

**Required state:** education_leave_rules; course_dates; leave_balance; approval

**Consequences:** Deduct permitted leave days and mark player excused only for those approved obligations.

**Media examples:**

- {team} approve {player}'s education leave for {course}.
- The benefit covers the recorded {days} days.
- The approved dates become excused time under the agreement.

### `labor.escrow_balance_returned`

**Trigger:** Final certified league revenue accounts determine player's withheld salary escrow exceeds his required contribution and actual return is paid.

**Placeholders:** `{amount}`, `{player}`

**Modes:** player; franchise

**Availability:** Enabled only where the save's fictional collective agreement or employee scheme grants the named benefit or process.

**Required state:** escrow_withheld; certified_revenue; required_contribution; return_receipt

**Consequences:** Credit excess only and close the season escrow reconciliation.

**Media examples:**

- {player} receives {amount} from the salary-escrow reconciliation.
- Certified revenue accounts establish the excess withholding.
- The season's agreed accounting process returns money already held from his pay.

### `labor.minimum_compensation_topup`

**Trigger:** Benefits payroll review finds player's actual credited compensation below a saved collective minimum for his eligible service and club pays the exact top-up.

**Placeholders:** `{amount}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Enabled only where the save's fictional collective agreement or employee scheme grants the named benefit or process.

**Required state:** eligible_service; collective_minimum; credited_compensation; topup_receipt

**Consequences:** Credit confirmed difference and mark this period reconciled without creating a new signing.

**Media examples:**

- {team} pay {player} the {amount} compensation top-up.
- The payroll review applies the saved collective minimum.
- This period's pay reaches the agreed floor without a new contract.

### `labor.dues_payment_corrected`

**Trigger:** Association's internal nonjudicial reconciliation verifies duplicate dues collection and returns the extra payment.

**Placeholders:** `{amount}`, `{player}`

**Modes:** player; franchise

**Availability:** Enabled only where the save's fictional collective agreement or employee scheme grants the named benefit or process.

**Required state:** dues_schedule; collection_log; duplicate_verified; return_receipt

**Consequences:** Credit the duplicate amount and correct membership payment record.

**Media examples:**

- {player}'s duplicate union-dues payment is returned.
- The association reconcile the collection record and refund {amount}.
- Membership remains active with the payment ledger corrected.

## 58. Schedule construction and certification

### `schedule.rest_imbalance_repaired`

**Trigger:** Released schedule fails configured rest-equity tolerance; approved regeneration brings every club inside tolerance.

**Placeholders:** `{league}`, `{gap}`

**Modes:** franchise

**Availability:** Before affected fixtures; rest-equity validator enabled.

**Required state:** fixture_version; rest_gap; equity_tolerance

**Consequences:** Replace future fixtures, refresh travel and rest projections, preserve completed results.

**Media examples:**

- {league} repair the rest imbalance in their schedule.
- The revised calendar cuts the largest rest gap to {gap}.
- The schedule audit passes after the fixture order changes.

### `schedule.road_trip_split`

**Trigger:** Approved calendar amendment splits a continuous road trip above the configured threshold into two trips with a home interval.

**Placeholders:** `{team}`, `{games}`

**Modes:** franchise

**Availability:** Franchise mode; only when the relevant configured competition system is enabled.

**Required state:** road_trip_ids; home_interval; travel_cost

**Consequences:** Reduce continuous away burden while updating travel cost and rest.

**Media examples:**

- {team} get a break in their {games}-game road stretch.
- The amended itinerary returns {team} home between trips.
- One long road block becomes two shorter journeys.

### `schedule.rescheduled_double_booking`

**Trigger:** Validator discovers a newly rescheduled game conflicts with another certified venue booking and blocks publication.

**Placeholders:** `{team}`, `{arena}`, `{date}`

**Modes:** franchise

**Availability:** Venue booking ledger enabled; no emergency implied.

**Required state:** venue_booking_ids; pending_fixture; publish_block

**Consequences:** Require a free slot or alternate venue before confirmation.

**Media examples:**

- {team}'s new date at {arena} fails the booking check.
- Two events cannot use the same court on {date}.
- The fixture remains pending while the venue conflict is resolved.

### `schedule.early_finish_cost`

**Trigger:** A user requests an earlier season finish; approved schedule meets the deadline but exceeds the old travel-cost estimate.

**Placeholders:** `{league}`, `{amount}`

**Modes:** franchise

**Availability:** User-configured calendar deadline; valid schedule generated.

**Required state:** season_end; travel_estimate; compressed_dates

**Consequences:** Update club budgets and recovery planning without assuming injury.

**Media examples:**

- {league} finish earlier under a more expensive itinerary.
- The compressed calendar adds {amount} to projected travel costs.
- Saving calendar days costs the league more miles.

### `schedule.rivalry_rotation_balance`

**Trigger:** Multi-season scheduler finally gives each configured rivalry pair an equal number of home dates over its rotation cycle.

**Placeholders:** `{league}`, `{seasons}`

**Modes:** franchise

**Availability:** Multi-season rotation system enabled.

**Required state:** rotation_cycle; pair_home_counts; cycle_complete

**Consequences:** Reset rotation counters and retain historical dates.

**Media examples:**

- {league} complete their {seasons}-season rivalry rotation.
- Every configured rivalry gets an equal home-date ledger.
- The calendar's long-term balance check now clears.

### `schedule.broadcast_window_declined`

**Trigger:** Club formally declines an optional televised start-time change because it violates its approved recovery constraint.

**Placeholders:** `{team}`, `{time}`

**Modes:** franchise

**Availability:** Opt-in broadcast rescheduling rules allow refusal.

**Required state:** requested_start; rest_floor; club_consent

**Consequences:** Keep original fixture; recalculate optional broadcast revenue.

**Media examples:**

- {team} decline the proposed {time} tip-off.
- The recovery plan wins this scheduling decision.
- The optional television window passes without moving {team}'s game.

### `schedule.simultaneous_final_round`

**Trigger:** Published final-round schedule assigns all matches affecting the same qualification race identical start times.

**Placeholders:** `{league}`, `{time}`

**Modes:** franchise

**Availability:** Competition permits synchronized final-round fixtures.

**Required state:** qualification_groups; start_times; simultaneous_policy

**Consequences:** Synchronize sim resolution and standings publication.

**Media examples:**

- {league} align the qualification race at {time}.
- The decisive fixtures share one opening time.
- Nobody in that race gets to wait for an earlier final result.

### `schedule.unbalanced_fixture_disclosure`

**Trigger:** League approves a deliberately unequal opponent rotation and publishes opponent counts before the season begins.

**Placeholders:** `{league}`, `{format}`

**Modes:** franchise

**Availability:** Configured unbalanced schedule; advance approval required.

**Required state:** opponent_matrix; disclosure_version; approval

**Consequences:** Store schedule-strength context with results; no hidden normalization.

**Media examples:**

- {league} publish the opponent counts for {format}.
- The unequal fixture rotation is disclosed before play.
- Every club can inspect the schedule imbalance it will face.

### `schedule.reserve_date_consumed`

**Trigger:** First postponement uses the competition's last reserved makeup date, leaving no unused reserve window.

**Placeholders:** `{league}`, `{date}`

**Modes:** franchise

**Availability:** Reserve-date calendar enabled; official postponement recorded.

**Required state:** reserve_dates; used_date; unplaced_games

**Consequences:** Future disruptions require explicit extension or alternate window.

**Media examples:**

- {league} use their final reserve date on {date}.
- The calendar's makeup cushion is now exhausted.
- Any further postponement will need a new scheduling decision.

### `schedule.home_stand_capacity`

**Trigger:** Released calendar creates a home stand whose projected staffing hours exceed the venue's contracted capacity; staffing amendment closes the gap.

**Placeholders:** `{team}`, `{hours}`

**Modes:** franchise

**Availability:** Staffing-capacity model enabled; contract amended.

**Required state:** home_stand; staff_capacity; contract_hours

**Consequences:** Increase event costs and remove staffing scheduling block.

**Media examples:**

- {team} add venue staffing for their extended home stand.
- The amended contract covers the missing {hours} hours.
- The home dates stay intact after staffing catches up.

## 59. Qualification, seeding, and tiebreak resolution

### `qualify.multi_team_tie_order`

**Trigger:** Three or more teams finish tied; approved multi-team procedure computes and certifies the complete ordering.

**Placeholders:** `{league}`, `{criterion}`

**Modes:** franchise

**Availability:** Multi-team tie under active qualification rules.

**Required state:** tied_team_ids; tie_rule; certified_order

**Consequences:** Assign seeds using published procedure and archive calculation.

**Media examples:**

- {league} resolve the shared record through {criterion}.
- The multi-team tie gets an official order.
- Equal records no longer mean an unresolved bracket.

### `qualify.mini_table_restart`

**Trigger:** Active rules require restarting the tiebreak process after one team separates from a multi-team tie; restart changes remaining order.

**Placeholders:** `{team}`, `{criterion}`

**Modes:** franchise

**Availability:** Rulebook explicitly specifies recursive tiebreak restart.

**Required state:** tie_iteration; separated_team; remaining_order

**Consequences:** Recompute only tied clubs; freeze certified separated position.

**Media examples:**

- {team} gain position when the tie procedure restarts.
- The remaining clubs return to {criterion}.
- Separating one team changes how the rest of the tie is resolved.

### `qualify.coin_draw_decision`

**Trigger:** All sporting tiebreaks are exhausted; preannounced witnessed random draw officially awards the disputed seed.

**Placeholders:** `{team}`, `{seed}`

**Modes:** franchise

**Availability:** Only leagues with a published random-draw final tiebreak.

**Required state:** tie_exhausted; draw_seed; draw_audit

**Consequences:** Assign seed, archive draw proof, preserve equal sporting records.

**Media examples:**

- {team} receive seed {seed} in the authorized draw.
- Every sporting separator runs out before the draw decides it.
- The witnessed result settles the last qualification dispute.

### `qualify.points_deduction_drop`

**Trigger:** Final non-criminal sporting eligibility deduction recalculates standings and moves a team outside qualification places.

**Placeholders:** `{team}`, `{points}`

**Modes:** franchise

**Availability:** Points-table competition; final sporting order, not an allegation.

**Required state:** deduction_order; adjusted_points; qualification_status

**Consequences:** Update qualification and opponent assignments; retain appeal status separately.

**Media examples:**

- {team} drop outside qualification after a {points}-point deduction.
- The certified penalty changes the bracket line.
- The original record stays archived beside the adjusted table.

### `qualify.appeal_seed_restored`

**Trigger:** Authorized sporting appeal restores previously deducted table points before bracket lock and returns the club to a qualifying seed.

**Placeholders:** `{team}`, `{seed}`

**Modes:** franchise

**Availability:** Applicable sporting appeal finalized before lock.

**Required state:** appeal_decision; restored_points; bracket_lock

**Consequences:** Recompute affected seeds without inventing a replay.

**Media examples:**

- {team} regain seed {seed} after the table correction.
- The appeal decision changes qualification before bracket lock.
- The restored points put {team} back into the field.

### `qualify.division_winner_reseeded`

**Trigger:** Format grants division winners qualification without protected seed order; a division winner receives its lower overall-record seed.

**Placeholders:** `{team}`, `{seed}`

**Modes:** franchise

**Availability:** Division qualification with record-only seeding enabled.

**Required state:** division_title; overall_rank; seed_policy

**Consequences:** Award division honor and apply record-based matchup separately.

**Media examples:**

- {team} win their division but enter at seed {seed}.
- The format rewards qualification without protecting bracket position.
- The overall record decides where the division winner lands.

### `qualify.playin_consolation_route`

**Trigger:** Team loses first permitted play-in game but officially retains a second qualification attempt under the configured format.

**Placeholders:** `{team}`, `{opp}`

**Modes:** franchise

**Availability:** Configured double-chance play-in; no generic series-loss duplicate.

**Required state:** playin_result; remaining_lives; next_fixture

**Consequences:** Schedule final permitted attempt and update elimination risk.

**Media examples:**

- {team} lose once but still have a route through {opp}.
- The format leaves one qualification chance open.
- The first play-in defeat does not end {team}'s season.

### `qualify.no_head_to_head_sample`

**Trigger:** Tied clubs never meet in an interrupted or custom schedule, so the rulebook skips the unavailable head-to-head criterion.

**Placeholders:** `{league}`, `{criterion}`

**Modes:** franchise

**Availability:** Custom or interrupted schedules with missing direct meetings.

**Required state:** head_to_head_count; next_criterion; tie_state

**Consequences:** Advance criterion without assigning fictitious results.

**Media examples:**

- {league} skip a tiebreak with no games to measure.
- The tie moves directly to {criterion}.
- An empty head-to-head ledger cannot settle this race.

### `qualify.fewer_games_percentage`

**Trigger:** Clubs have unequal completed games; active rules rank winning percentage and a fewer-win team officially qualifies above a more-win team.

**Placeholders:** `{team}`, `{opp}`

**Modes:** franchise

**Availability:** Winning-percentage qualification explicitly active.

**Required state:** games_played; win_percentage; ranking_basis

**Consequences:** Certify qualification and display denominator for each club.

**Media examples:**

- {team} qualify above {opp} on winning percentage.
- The table counts success rate rather than raw victories.
- Unequal games make the published percentage rule decisive.

### `qualify.bracket_lock_error_reopened`

**Trigger:** Before any postseason game, independent check finds the locked bracket used the wrong rule version and league certifies a corrected bracket.

**Placeholders:** `{league}`, `{version}`

**Modes:** franchise

**Availability:** Documented administrative error before postseason play.

**Required state:** locked_bracket; rule_version; correction_certificate

**Consequences:** Unlock once, rebuild affected fixtures, notify roster scheduler.

**Media examples:**

- {league} reopen the bracket after a rule-version mismatch.
- The corrected field uses version {version}.
- No playoff game starts under the superseded qualification rules.

## 60. Playoff and cup format mechanics

### `format.reseed_next_round`

**Trigger:** After a completed round, active rules redraw pairings by remaining seeds instead of following a fixed bracket.

**Placeholders:** `{team}`, `{opp}`

**Modes:** franchise

**Availability:** Reseeding playoff format enabled.

**Required state:** surviving_seeds; reseed_round; new_pairings

**Consequences:** Replace prospective pairings; no past series changed.

**Media examples:**

- Reseeding sends {team} into a matchup with {opp}.
- The remaining seeds determine the next round anew.
- The old bracket path gives way to the published reseeding rule.

### `format.two_leg_aggregate_advance`

**Trigger:** Under explicit aggregate scoring, a team loses the return game but qualifies on total points across both legs.

**Placeholders:** `{team}`, `{opp}`, `{total}`

**Modes:** franchise

**Availability:** Two-leg aggregate cup enabled; totals supplied.

**Required state:** leg_scores; aggregate_points; tie_winner

**Consequences:** Advance aggregate winner and preserve both individual results.

**Media examples:**

- {team} lose the return leg but advance over {opp}.
- The aggregate total of {total} decides the tie.
- A single-game defeat does not erase {team}'s two-leg advantage.

### `format.double_elimination_lower_run`

**Trigger:** Team loses an upper-bracket tie and is officially reassigned to the lower bracket instead of eliminated.

**Placeholders:** `{team}`, `{round}`

**Modes:** franchise

**Availability:** Double-elimination tournament only.

**Required state:** loss_count; bracket_path; next_lower_tie

**Consequences:** Assign lower-bracket opponent and consume first life.

**Media examples:**

- {team} move to the lower bracket after losing {round}.
- The defeat costs their upper path, not their tournament place.
- A second route remains under the double-elimination rules.

### `format.bracket_reset_required`

**Trigger:** Lower-bracket finalist wins the first final against an unbeaten upper finalist and active rules require a reset final.

**Placeholders:** `{team}`, `{opp}`

**Modes:** franchise

**Availability:** Double-elimination with explicit grand-final reset.

**Required state:** finalist_losses; first_final_result; reset_required

**Consequences:** Schedule reset final; championship remains unawarded.

**Media examples:**

- {team} force a reset final against {opp}.
- The first final uses the unbeaten side's spare life.
- The championship still needs another deciding contest.

### `format.bye_rest_tradeoff`

**Trigger:** Club receives a seeded bye; sim records more rest days but fewer competitive appearances than its next opponent.

**Placeholders:** `{team}`, `{days}`, `{opp}`

**Modes:** franchise

**Availability:** Seeded-bye format with rest and rhythm models.

**Required state:** bye_award; rest_days; competitive_gap

**Consequences:** Apply rest recovery and configured inactivity effects separately.

**Media examples:**

- {team} get {days} rest days from their bye.
- The bye offers recovery while {opp} keep playing.
- The bracket gives {team} time, with rhythm still to be tested.

### `format.host_choice_opponent`

**Trigger:** Top qualifier exercises its published right to choose an opponent from eligible clubs; selection is formally locked.

**Placeholders:** `{team}`, `{opp}`

**Modes:** franchise

**Availability:** Only custom formats with announced opponent choice.

**Required state:** selector_id; eligible_opponents; chosen_opponent

**Consequences:** Lock tie and track chosen-opponent narrative for later results.

**Media examples:**

- {team} choose {opp} under the opponent-selection rule.
- The bracket gains an opponent by choice rather than a fixed path.
- The eligible pool closes when {team} submit their pick.

### `format.cup_group_margin_cap`

**Trigger:** A team wins by more than the permitted differential contribution, but standings use the configured cap.

**Placeholders:** `{team}`, `{cap}`

**Modes:** franchise

**Availability:** Group cup with published margin cap.

**Required state:** raw_margin; capped_margin; group_table

**Consequences:** Store actual score and capped tiebreak value separately.

**Media examples:**

- {team}'s cup tiebreak gain stops at {cap}.
- The full game result stands; the group separator is capped.
- The standings refuse the extra margin under the published rule.

### `format.away_goals_disabled_decider`

**Trigger:** Aggregate tie remains equal; explicitly no away-score bonus applies and a configured decider is scheduled.

**Placeholders:** `{team}`, `{opp}`

**Modes:** franchise

**Availability:** Custom two-leg competition with no away-score bonus.

**Required state:** aggregate_tie; away_bonus_disabled; decider_fixture

**Consequences:** Create decider without importing rules from another competition.

**Media examples:**

- {team} and {opp} need the format's deciding contest.
- Away scoring offers no shortcut in this competition.
- The aggregate tie survives until the published decider.

### `format.consolation_placement`

**Trigger:** Eliminated contenders play an official classification match that determines final finishing positions and prize allocation.

**Placeholders:** `{team}`, `{place}`

**Modes:** franchise

**Availability:** Tournament supports classification matches.

**Required state:** classification_result; final_place; prize_band

**Consequences:** Award placement money and record final rank without title credit.

**Media examples:**

- {team} earn place {place} through the classification match.
- The title chase is over, but the final rank still counts.
- The placement result settles the remaining prize position.

### `format.series_length_transition`

**Trigger:** Published competition rules use different series lengths by round; advancing club receives the next round's required-win target.

**Placeholders:** `{team}`, `{wins}`, `{round}`

**Modes:** franchise

**Availability:** Variable-length playoff format enabled.

**Required state:** round_format; required_wins; series_rule_id

**Consequences:** Reset series counter and communicate new target before play.

**Media examples:**

- {team} now need {wins} victories in {round}.
- The next round changes the series target.
- The qualification path becomes a different-length test.

## 61. Historical records and archive quality

### `archive.record_reclassification`

**Trigger:** Verified audit finds a legacy record used exhibition games; competition-only total is officially reclassified.

**Placeholders:** `{player}`, `{stat}`, `{total}`

**Modes:** franchise

**Availability:** Archive audit enabled; verified classification error.

**Required state:** record_scope; source_games; corrected_total

**Consequences:** Recalculate leaderboard with provenance; never erase exhibition history.

**Media examples:**

- {player}'s official {stat} record is revised to {total}.
- The archive separates exhibitions from competition games.
- The old total remains documented with its original scope.

### `archive.stat_category_inception`

**Trigger:** League introduces official tracking for a previously unrecorded statistic and creates a dated leaderboard starting from that season.

**Placeholders:** `{league}`, `{stat}`, `{season}`

**Modes:** franchise

**Availability:** Tracking technology and staffing exist in selected era.

**Required state:** tracking_start; stat_id; missing_data_policy

**Consequences:** Create new leaderboard; mark earlier data unavailable.

**Media examples:**

- {league} start official {stat} records in {season}.
- A new statistic gets a clear beginning in the archive.
- Earlier seasons remain unmeasured rather than assigned zeros.

### `archive.franchise_lineage_split`

**Trigger:** Approved historical policy assigns old-city records to a retained civic franchise while the relocated entity starts a separate lineage.

**Placeholders:** `{team}`, `{city}`

**Modes:** franchise

**Availability:** Relocation already approved; explicit lineage agreement required.

**Required state:** lineage_agreement; retained_records; new_franchise_id

**Consequences:** Split career team totals and banners according to agreement.

**Media examples:**

- {team} begin a separate history under the lineage agreement.
- The old records stay with {city}'s retained franchise.
- The move creates two archive paths instead of one blended total.

### `archive.vacated_title_marker`

**Trigger:** Final sporting ruling vacates a previously awarded title without automatically naming a replacement winner.

**Placeholders:** `{team}`, `{season}`

**Modes:** franchise

**Availability:** Final non-criminal competition ruling with title remedy.

**Required state:** vacatur_order; title_status; replacement_policy

**Consequences:** Adjust team honors and label season; replacements require separate decision.

**Media examples:**

- {team}'s {season} title receives a vacated marker.
- The championship archive changes without inventing a new winner.
- The final ruling removes title credit from that season.

### `archive.shared_record_exact`

**Trigger:** Two players finish a qualifying season with exactly equal verified totals at the league record and both receive shared credit.

**Placeholders:** `{player}`, `{other}`, `{stat}`, `{total}`

**Modes:** franchise

**Availability:** Verified equal record totals in enabled category.

**Required state:** record_value; coholder_ids; verification

**Consequences:** Create shared record ownership without a false tiebreak.

**Media examples:**

- {player} and {other} share the {stat} record at {total}.
- The official totals leave no sole leader.
- The archive gives both players equal record credit.

### `archive.rate_record_minimum_miss`

**Trigger:** Player posts the best raw rate but falls short of the published attempt minimum and is excluded from the official rate record.

**Placeholders:** `{player}`, `{stat}`, `{minimum}`

**Modes:** franchise

**Availability:** Rate statistics with published sample minimum.

**Required state:** raw_rate; qualifying_attempts; record_minimum

**Consequences:** Show nonqualifying rate separately; retain official holder.

**Media examples:**

- {player}'s {stat} rate misses the {minimum} eligibility floor.
- The best raw figure does not become the official record.
- The archive keeps the performance while enforcing the minimum.

### `archive.season_length_context`

**Trigger:** A season total surpasses a prior record in a longer configured schedule; archive displays both totals and per-game comparison.

**Placeholders:** `{player}`, `{stat}`, `{total}`

**Modes:** franchise

**Availability:** Season schedule lengths differ in historical registry.

**Required state:** schedule_length; season_total; per_game_context

**Consequences:** Award total record and show schedule context without downgrading it.

**Media examples:**

- {player} set the season {stat} total at {total}.
- The archive displays the longer schedule beside the new mark.
- The total record and the per-game comparison tell different parts of the story.

### `archive.missing_boxscore_recovered`

**Trigger:** Authenticated source recovers a previously missing official game box score and updates affected career totals.

**Placeholders:** `{player}`, `{game}`

**Modes:** franchise

**Availability:** Historical archive mode; source independently authenticated.

**Required state:** source_authentication; recovered_game; affected_totals

**Consequences:** Recompute affected records and store source attribution.

**Media examples:**

- The archive restores {player}'s missing box score from {game}.
- A verified game returns to the statistical ledger.
- The recovered page changes totals without creating a new performance.

### `archive.team_identity_alias_merged`

**Trigger:** Archive discovers a documented spelling or identity alias caused one franchise's records to be split and officially merges the aliases.

**Placeholders:** `{team}`, `{alias}`

**Modes:** franchise

**Availability:** Verified alias, not distinct relocated lineage.

**Required state:** canonical_id; alias_id; merged_totals

**Consequences:** Merge duplicate identity references; preserve dates and names.

**Media examples:**

- The archive joins {alias} to {team}'s verified history.
- Two labels turn out to describe one franchise.
- The corrected identity map repairs the split ledger.

### `archive.exhibition_record_flag`

**Trigger:** Sandbox or preseason exhibition performance exceeds an official record; system records it only in exhibition history.

**Placeholders:** `{player}`, `{stat}`, `{total}`

**Modes:** franchise

**Availability:** Exhibition classification locked before game begins.

**Required state:** fixture_class; exhibition_mark; official_record

**Consequences:** Create exhibition milestone without official record credit.

**Media examples:**

- {player} reach {total} in {stat} during exhibition play.
- The performance enters the exhibition archive.
- The official competition record remains a separate ledger.

## 62. Hall of Fame and institutional legacy

### `legacy.hall_ballot_entry`

**Trigger:** Retired player's configured waiting period expires and eligibility committee places him on the Hall ballot.

**Placeholders:** `{player}`, `{years}`

**Modes:** franchise

**Availability:** Hall system enabled; waiting period met.

**Required state:** retirement_date; waiting_period; ballot_status

**Consequences:** Enable voting, media evaluation, and repeat eligibility rules.

**Media examples:**

- {player} reach the Hall ballot after the {years}-year wait.
- The eligibility clock opens his candidacy.
- The career now enters a voting process rather than an automatic induction.

### `legacy.hall_inducted`

**Trigger:** Certified vote exceeds Hall induction threshold and official class announcement names the player.

**Placeholders:** `{player}`, `{class}`

**Modes:** franchise

**Availability:** Hall ballot certified; era-appropriate institution exists.

**Required state:** vote_share; induction_threshold; hall_class

**Consequences:** Record induction and schedule ceremony with consent.

**Media examples:**

- {player} join the Hall class of {class}.
- The certified vote turns his candidacy into induction.
- His career gains the institution's permanent recognition.

### `legacy.hall_ballot_survival`

**Trigger:** Candidate misses induction but meets the retention threshold and remains eligible next ballot.

**Placeholders:** `{player}`

**Modes:** franchise

**Availability:** Hall rules include ballot retention.

**Required state:** vote_share; retention_floor; ballots_remaining

**Consequences:** Keep candidate eligible; do not award induction credit.

**Media examples:**

- {player} stay on the Hall ballot without entering the class.
- The vote keeps his candidacy alive.
- The next ballot still has a place for his career.

### `legacy.hall_ballot_expiry`

**Trigger:** Candidate uses the final permitted regular ballot without induction and moves to the published later-review route.

**Placeholders:** `{player}`, `{committee}`

**Modes:** franchise

**Availability:** Hall rules include a separate later-review committee.

**Required state:** ballot_count; ordinary_eligibility; committee_route

**Consequences:** Close standard voting and create later-review date.

**Media examples:**

- {player}'s regular Hall ballot window closes.
- Future review moves to {committee}.
- The final ordinary vote ends one route, not every possible route.

### `legacy.jersey_retirement_approved`

**Trigger:** Club formally approves retiring a former player's number after checking active-use transition rules.

**Placeholders:** `{team}`, `{player}`, `{number}`

**Modes:** franchise

**Availability:** Club number-retirement policy enabled; consented ceremony.

**Required state:** retired_number; active_use_policy; ceremony_date

**Consequences:** Block new assignments; current wearer follows explicit transition.

**Media examples:**

- {team} approve retiring {player}'s number {number}.
- The number leaves future circulation under the club policy.
- A permanent banner honor follows the formal decision.

### `legacy.active_number_grandfathered`

**Trigger:** Number retirement policy lets an existing wearer retain the number until leaving the team but forbids new assignments.

**Placeholders:** `{team}`, `{player}`, `{number}`

**Modes:** franchise

**Availability:** Approved number retirement with grandfather clause.

**Required state:** current_wearer; grandfather_flag; future_assignment_block

**Consequences:** Preserve current identity; reserve retired status for future assignments.

**Media examples:**

- {player} keep number {number} under {team}'s transition policy.
- The retirement honors the number while grandfathering its current wearer.
- No new player can claim it after this assignment ends.

### `legacy.banner_restored_display`

**Trigger:** Previously stored authenticated club banner is restored and returned to public display after conservation approval.

**Placeholders:** `{team}`, `{season}`

**Modes:** franchise

**Availability:** Authenticated artifact; conservation completed.

**Required state:** artifact_id; conservation_status; display_location

**Consequences:** Update museum display and fan-history engagement.

**Media examples:**

- {team} return the {season} banner to display.
- Conservation brings a piece of club history back into view.
- The existing honor gets a restored home, not a new title.

### `legacy.founders_anniversary_game`

**Trigger:** League officially designates a fixture for a verified founding anniversary and uses approved archival presentation.

**Placeholders:** `{league}`, `{years}`

**Modes:** franchise

**Availability:** Verified founding history and sanctioned fixture.

**Required state:** founding_date; anniversary_fixture; archival_program

**Consequences:** Add commemorative presentation without changing competitive value.

**Media examples:**

- {league} mark {years} years with an anniversary fixture.
- The celebration follows the league's verified founding date.
- One scheduled game becomes an occasion to revisit the institution's beginning.

### `legacy.hall_coach_role_review`

**Trigger:** Hall committee formally accepts a coach nomination under coaching criteria distinct from playing achievements.

**Placeholders:** `{coach}`

**Modes:** franchise

**Availability:** Hall supports coaching category; formal nomination accepted.

**Required state:** nomination_role; coaching_record; committee_review

**Consequences:** Begin coach evaluation and preserve role-specific honors.

**Media examples:**

- {coach} enter the Hall review on coaching merits.
- The nomination evaluates work on the bench.
- The committee opens the coaching record rather than a playing ballot.

### `legacy.club_museum_acquisition`

**Trigger:** Club acquires authenticated historical game equipment with documented consent and provenance.

**Placeholders:** `{team}`, `{artifact}`

**Modes:** franchise

**Availability:** Museum system enabled; rights and authenticity established.

**Required state:** artifact_provenance; acquisition_consent; museum_inventory

**Consequences:** Increase collection and optional museum attendance; no ownership claim without acquisition.

**Media examples:**

- {team} add {artifact} to their history collection.
- The provenance check clears the museum's new acquisition.
- A piece of game history gains a documented permanent home.

## 63. Experimental scoring and rule outcomes

### `experiment.target_score_shorter_finish`

**Trigger:** Configured target-score pilot ends a qualifying game below the comparison window's median elapsed duration; no game clock winner is assumed.

**Placeholders:** `{league}`, `{duration}`

**Modes:** franchise

**Availability:** Explicit custom target-score pilot; measured comparison window.

**Required state:** target_score; elapsed_duration; comparison_median

**Consequences:** Store pilot timing evidence and retain separate ruleset records.

**Media examples:**

- {league}'s target-score pilot finishes in {duration}.
- The winning threshold ends this test faster than the stored median.
- The pilot records a shorter finish, with the sample still limited.

### `experiment.four_point_scoring_share`

**Trigger:** Enabled four-point zone produces a measured share of total tournament scoring after the pilot sample closes.

**Placeholders:** `{league}`, `{share}`

**Modes:** franchise

**Availability:** Custom four-point zone enabled; completed evaluation sample.

**Required state:** four_point_total; total_points; pilot_sample

**Consequences:** Present measured scoring distribution for continuation vote.

**Media examples:**

- Four-point shots supply {share} of {league}'s pilot scoring.
- The new zone's actual contribution reaches the evaluation table.
- The pilot counts points earned, not just attempts launched.

### `experiment.single_free_throw_accounting`

**Trigger:** Custom one-attempt multiple-value foul rule creates a made-shot count different from points; official scorer correctly separates both fields.

**Placeholders:** `{player}`, `{makes}`, `{points}`

**Modes:** franchise

**Availability:** Sandbox scoring preset explicitly enables weighted free throws.

**Required state:** ft_makes; ft_points; custom_foul_value

**Consequences:** Save distinct attempt and scoring metrics; exclude incompatible standard records.

**Media examples:**

- {player}'s {makes} free-throw makes produce {points} points.
- The custom foul rule separates attempts from scoring value.
- The ledger counts both the shot and what it is worth.

### `experiment.running_clock_time_saved`

**Trigger:** Running-clock pilot passes complete-game validation and recorded real-time duration is lower than baseline by configured threshold.

**Placeholders:** `{league}`, `{saved}`

**Modes:** franchise

**Availability:** Custom running-clock pilot with verified comparable baseline.

**Required state:** running_clock_policy; elapsed_time; baseline_delta

**Consequences:** Track duration and broadcast scheduling effects separately from competitive results.

**Media examples:**

- {league}'s running-clock pilot saves {saved} against the baseline.
- The timing test clears its planned reduction threshold.
- The measured duration becomes evidence for the format review.

### `experiment.no_foulout_finish`

**Trigger:** Custom no-foulout rules allow a player over the normal reference foul limit to legally finish an official custom game.

**Placeholders:** `{player}`, `{fouls}`

**Modes:** franchise

**Availability:** Sandbox no-foulout preset enabled before tip-off.

**Required state:** foul_total; disqualification_policy; custom_eligibility

**Consequences:** Retain eligibility and custom-game tag; no standard-rule misconduct implied.

**Media examples:**

- {player} finish legally with {fouls} fouls under the custom rules.
- The no-foulout preset keeps him eligible through the end.
- The reference limit is informational in this competition.

### `experiment.penalty_carryover_served`

**Trigger:** Tournament accumulative-foul rules trigger an automatic next-match absence that is officially served and then cleared.

**Placeholders:** `{player}`, `{team}`

**Modes:** franchise

**Availability:** Tournament explicitly uses published cumulative-foul suspensions.

**Required state:** tournament_fouls; penalty_fixture; served_status

**Consequences:** Restore tournament eligibility after serving; unrelated disciplinary records unaffected.

**Media examples:**

- {player} serve the tournament's accumulated-foul absence.
- {team} complete the required match without him.
- The carryover counter clears after the designated penalty.

### `experiment.mercy_rule_completed`

**Trigger:** Predeclared mercy condition is reached; officials end the custom game early and certify its shortened status.

**Placeholders:** `{team}`, `{condition}`

**Modes:** franchise

**Availability:** Custom mercy-rule competition only; condition configured before play.

**Required state:** mercy_threshold; termination_reason; short_game_flag

**Consequences:** Count custom result, annotate minutes and statistic comparisons.

**Media examples:**

- {team}'s game ends under the mercy condition {condition}.
- The format closes the contest before its ordinary duration.
- The result is official within this preset and labeled shortened.

### `experiment.player_veto_token_used`

**Trigger:** Experimental league grants each team one ruleset-veto token per season; team spends it before a randomized fixture's rule draw.

**Placeholders:** `{team}`, `{rule}`

**Modes:** franchise

**Availability:** Explicit rule-lottery sandbox; all candidate rules declared in advance.

**Required state:** veto_balance; rejected_rule; redraw_pool

**Consequences:** Consume token and certify replacement rules before play.

**Media examples:**

- {team} spend their veto token against {rule}.
- The experimental fixture redraws its eligible ruleset.
- One choice is removed, and the team's token is gone.

### `experiment.substitution_window_denial`

**Trigger:** Custom fixed substitution windows prevent a non-emergency requested change between windows; officials enforce the preset and record the denial.

**Placeholders:** `{team}`, `{window}`

**Modes:** franchise

**Availability:** Custom substitution-window competition; emergency exceptions explicit.

**Required state:** request_time; sub_window; next_legal_change

**Consequences:** Delay legal substitution; preserve medically required exception protocol.

**Media examples:**

- {team} must wait until {window} for their requested substitution.
- The fixed-window rule rejects the ordinary change.
- The roster remains as registered until the next legal window.

### `experiment.score_reset_round`

**Trigger:** Published multi-round exhibition resets scoreboard each segment; team wins the exhibition by segment victories despite lower aggregate points.

**Placeholders:** `{team}`, `{segments}`

**Modes:** franchise

**Availability:** Custom reset-score exhibition format only.

**Required state:** segment_scores; segments_won; aggregate_total

**Consequences:** Award custom match by segments and display scoring total separately.

**Media examples:**

- {team} win {segments} segments to take the exhibition.
- The reset format rewards segment wins instead of aggregate points.
- The total scoring ledger and the match winner follow different columns.

## 64. Mixed-era worlds and simulation provenance

### `world.duplicate_player_version_blocked`

**Trigger:** Mixed-era draft rejects a second season-version of an already rostered identity under one-version-per-person settings.

**Placeholders:** `{team}`, `{player}`, `{season}`

**Modes:** franchise

**Availability:** Mixed-era mode with duplicate identity prohibition enabled.

**Required state:** identity_id; version_ids; duplicate_policy

**Consequences:** Return pick to selection; retain original player version.

**Media examples:**

- {team} cannot add the {season} version of {player}.
- The identity rule blocks a second version of the same person.
- The draft slot stays open for an eligible alternative.

### `world.duplicate_versions_allowed_meeting`

**Trigger:** User explicitly permits multiple temporal versions; two registered versions of one identity face each other in a custom fixture.

**Placeholders:** `{player}`, `{first}`, `{second}`

**Modes:** franchise

**Availability:** Sandbox explicitly allows temporal duplicates; fictional scenario tagged.

**Required state:** identity_id; version_pair; duplicate_permission

**Consequences:** Keep distinct stats and visual identifiers for each version.

**Media examples:**

- {player}'s {first} and {second} versions meet in the custom fixture.
- The two season profiles share an identity but keep separate rosters.
- The time-crossing matchup is legal in this sandbox.

### `world.retirement_age_override_path`

**Trigger:** User raises or removes forced-retirement age in a custom league; player past previous boundary remains contracted and active without health guarantees.

**Placeholders:** `{player}`, `{age}`

**Modes:** franchise

**Availability:** User-enabled longevity configuration; no fixed age limit assumed.

**Required state:** retirement_age_setting; player_age; active_contract

**Consequences:** Continue career checks under chosen aging model; no automatic rejuvenation.

**Media examples:**

- {player} remain active at {age} under the custom longevity settings.
- The old forced-retirement boundary no longer closes his career.
- Availability still depends on the simulation's current player state.

### `world.era_translation_uncertainty`

**Trigger:** Cross-era comparison publishes a model interval rather than a point ranking because missing-data uncertainty exceeds configured tolerance.

**Placeholders:** `{player}`, `{range}`

**Modes:** franchise

**Availability:** Cross-era model enabled; auditable missing-data threshold crossed.

**Required state:** raw_statistics; normalization_model; uncertainty_interval

**Consequences:** Show interval and suppress unsupported definitive ranking.

**Media examples:**

- {player}'s era-adjusted estimate spans {range}.
- The comparison displays uncertainty instead of false precision.
- Missing historical inputs widen the model's answer.

### `world.ruleset_portability_failure`

**Trigger:** Historic profile includes a skill or statistic incompatible with selected rules; validator requires an explicit translation before team activation.

**Placeholders:** `{player}`, `{rule}`

**Modes:** franchise

**Availability:** Mixed-era import; actual incompatibility detected.

**Required state:** source_era; target_rules; mapping_status

**Consequences:** Block activation, offer documented compatible mapping without altering original profile.

**Media examples:**

- {player}'s profile needs translation for {rule}.
- The mixed-era roster pauses at a rules compatibility check.
- The player can enter once the chosen mapping is declared.

### `world.replay_same_seed_verified`

**Trigger:** User reruns a saved scenario with identical engine version, inputs, and seed; deterministic output checksum matches.

**Placeholders:** `{scenario}`

**Modes:** franchise

**Availability:** Replay mode with deterministic engine and preserved inputs.

**Required state:** engine_version; input_hash; seed; result_hash

**Consequences:** Mark reproducible replay and store audit result.

**Media examples:**

- {scenario} reproduce the saved simulation exactly.
- The replay matches its original result checksum.
- The audit confirms the same inputs follow the same path.

### `world.forked_history_diverges`

**Trigger:** User forks an archived save and makes one declared change; first later state divergence is detected and documented.

**Placeholders:** `{season}`, `{change}`

**Modes:** franchise

**Availability:** Explicit alternate-history fork; change logged.

**Required state:** parent_save; fork_change; first_divergence

**Consequences:** Maintain two separate histories and prevent cross-branch record mixing.

**Media examples:**

- The fork of {season} diverges after {change}.
- The alternate timeline now has its first distinct state.
- The original history remains available beside the branch.

### `world.same_roster_era_test`

**Trigger:** Identical locked roster completes sanctioned sandbox trials in two declared eras; report compares measured team outputs.

**Placeholders:** `{team}`, `{first}`, `{second}`

**Modes:** franchise

**Availability:** Controlled mixed-era experiment with unchanged roster seed.

**Required state:** locked_roster; era_pair; trial_outputs

**Consequences:** Store paired experiment and model assumptions; no real-world certainty claimed.

**Media examples:**

- {team} complete the {first} and {second} era trials.
- One locked roster meets two different basketball environments.
- The report compares the trials without changing the source team.

### `world.generated_descendant_identity`

**Trigger:** User enables fictional successor generation; new player is assigned an explicit simulated lineage link without implying real family facts.

**Placeholders:** `{player}`, `{ancestor}`

**Modes:** franchise

**Availability:** Explicit fictional-generation setting; no real biographical assertion.

**Required state:** generated_identity; fictional_lineage; world_tag

**Consequences:** Create lineage narratives only inside tagged world.

**Media examples:**

- {player} enter the fictional world with a link to {ancestor}.
- The successor profile belongs to this generated timeline.
- The lineage is a simulation setting, not a historical claim.

### `world.uniform_current_assignment`

**Trigger:** A mixed-era player joins a custom club and the game's identity snapshot switches to that club's current colors and assigned number while preserving source-season profile.

**Placeholders:** `{player}`, `{team}`, `{number}`

**Modes:** franchise

**Availability:** Fantasy or mixed-era mode; valid roster transfer and number assignment.

**Required state:** source_profile; current_team; jersey_colors; jersey_number

**Consequences:** Use current roster identity for visuals; archive prior assignments.

**Media examples:**

- {player} appear in {team}'s current colors as number {number}.
- The historic profile now wears its actual custom-roster assignment.
- The career source stays intact while the team identity updates.

## 65. Franchise challenge goals and constraints

### `challenge.homegrown_title_verified`

**Trigger:** User-defined challenge requires every champion roster member to have entered league through that franchise; title roster audit passes.

**Placeholders:** `{team}`

**Modes:** franchise

**Availability:** User opts into homegrown challenge before roster building.

**Required state:** challenge_rule; entry_franchise_ids; title_roster

**Consequences:** Award challenge completion separately from normal title credit.

**Media examples:**

- {team} complete the homegrown championship challenge.
- Every registered title player entered through the club.
- The trophy and the roster provenance both pass the challenge audit.

### `challenge.homegrown_roster_violation`

**Trigger:** Same provenance challenge accepts a player originally registered elsewhere and immediately marks the run nonqualifying while allowing ordinary play.

**Placeholders:** `{team}`, `{player}`

**Modes:** franchise

**Availability:** Homegrown challenge active; actual provenance violation.

**Required state:** challenge_status; entry_franchise; new_registration

**Consequences:** End challenge eligibility without undoing authorized transaction.

**Media examples:**

- {team}'s homegrown challenge ends when {player} join.
- The roster remains legal for ordinary competition.
- The provenance condition no longer matches the challenge.

### `challenge.no_trade_season_complete`

**Trigger:** User locks trading off for a season and completes the full configured schedule without any trade executed.

**Placeholders:** `{team}`, `{season}`

**Modes:** franchise

**Availability:** Opt-in no-trade challenge locked before season.

**Required state:** trade_lock; executed_trades; season_complete

**Consequences:** Award completion badge and compare predeclared performance target.

**Media examples:**

- {team} complete {season} without a trade.
- The no-trade challenge survives the entire configured schedule.
- The roster plan reaches the finish without a trading shortcut.

### `challenge.minimum_budget_qualifier`

**Trigger:** Club qualifies for playoffs while staying within predeclared low-budget spending cap throughout the challenge window.

**Placeholders:** `{team}`, `{cap}`

**Modes:** franchise

**Availability:** User-defined budget challenge; spending rule specified upfront.

**Required state:** challenge_cap; peak_spending; qualification

**Consequences:** Award dual-condition completion; retain actual league accounting.

**Media examples:**

- {team} qualify while staying below {cap}.
- The budget challenge clears both spending and qualification tests.
- The club meets its sporting goal without exceeding the declared limit.

### `challenge.one_nation_roster_audit`

**Trigger:** Custom challenge restricts roster to player profiles with a user-chosen sporting eligibility field; completed season audit verifies all registered entries.

**Placeholders:** `{team}`, `{eligibility}`

**Modes:** franchise

**Availability:** Voluntary challenge using explicit sporting eligibility data only.

**Required state:** chosen_eligibility; registration_history; audit_pass

**Consequences:** Record custom challenge completion without inferring ethnicity or birthplace.

**Media examples:**

- {team} complete the roster challenge for {eligibility}.
- Every registered player satisfies the chosen sporting-eligibility rule.
- The season audit confirms the challenge pool stayed intact.

### `challenge.random_gm_decision_accepted`

**Trigger:** User enables randomized management; a seeded authorized random choice selects one of the legally valid offered roster actions and is executed.

**Placeholders:** `{team}`, `{decision}`

**Modes:** franchise

**Availability:** Explicit sandbox random-management setting enabled.

**Required state:** random_mode; valid_options; chosen_action; seed

**Consequences:** Execute only validated action; archive draw and resulting roster.

**Media examples:**

- {team} accept the random management choice: {decision}.
- The seeded draw picks from the valid decision menu.
- The custom front office follows its agreed chance-based rule.

### `challenge.random_gm_no_legal_option`

**Trigger:** Random-management draw finds no legally valid action under the current cap and roster constraints and safely returns a pass.

**Placeholders:** `{team}`

**Modes:** franchise

**Availability:** Random-management mode; all offered actions invalid.

**Required state:** valid_option_count; decision_pass; cap_state

**Consequences:** Advance decision window with no mutation and logged explanation.

**Media examples:**

- {team}'s random front office has no legal move to draw.
- The decision becomes a pass rather than a broken roster.
- The constraint validator keeps the challenge within its rules.

### `challenge.rebuild_deadline_met`

**Trigger:** User sets a multi-season improvement target and franchise reaches it within the recorded deadline using the original challenge starting state.

**Placeholders:** `{team}`, `{target}`, `{seasons}`

**Modes:** franchise

**Availability:** Opt-in rebuild goal and deadline recorded before sim.

**Required state:** initial_state; challenge_target; deadline; completion

**Consequences:** Award challenge success; preserve ordinary franchise milestones.

**Media examples:**

- {team} reach {target} within {seasons} seasons.
- The rebuild challenge clears its declared deadline.
- The final audit compares the result with the saved starting state.

### `challenge.expansion_win_floor_missed`

**Trigger:** Expansion-specific challenge season finishes below its predeclared minimum win-rate goal despite completing all legal fixtures.

**Placeholders:** `{team}`, `{target}`

**Modes:** franchise

**Availability:** Opt-in expansion challenge; target set before first season.

**Required state:** expansion_start; win_rate; target_rate

**Consequences:** Mark challenge failure, allow normal continuation and new goals.

**Media examples:**

- {team} miss the expansion challenge target of {target}.
- The first campaign finishes below the declared win-rate floor.
- The challenge fails while the franchise can keep building.

### `challenge.manual_intervention_breaks_run`

**Trigger:** User makes a prohibited manual roster edit during an autopilot-only challenge; system records the edit and ends eligibility.

**Placeholders:** `{team}`, `{edit}`

**Modes:** franchise

**Availability:** Autopilot-only challenge explicitly enabled.

**Required state:** autopilot_rule; manual_edit; challenge_eligibility

**Consequences:** End challenge certification; preserve edited sandbox save.

**Media examples:**

- {team}'s autopilot challenge stops qualifying after {edit}.
- The manual intervention changes the run's declared conditions.
- The save continues with the challenge marked incomplete.

## 66. Expansion entry and player allocation

### `expansion.protection_list_lock`

**Trigger:** Existing team submits and locks its expansion protection list by the published deadline.

**Placeholders:** `{team}`, `{count}`

**Modes:** franchise

**Availability:** Approved expansion draft pending; protection rules published.

**Required state:** protection_list; deadline; lock_status

**Consequences:** Freeze protected entries; permit only defined later exceptions.

**Media examples:**

- {team} lock {count} protected roster places.
- The expansion list closes before selection begins.
- The club's unprotected pool now follows the published allocation rules.

### `expansion.invalid_protection_overflow`

**Trigger:** Team protection submission exceeds configured limit; validator rejects it without exposing submitted names publicly.

**Placeholders:** `{team}`, `{limit}`

**Modes:** franchise

**Availability:** Expansion protection validation before deadline.

**Required state:** submitted_count; protection_limit; validation_error

**Consequences:** Require legal resubmission; no player selected from invalid list.

**Media examples:**

- {team}'s protection list exceeds the {limit}-player limit.
- The submission must shrink before it can lock.
- The expansion process rejects the invalid list before selections begin.

### `expansion.player_consent_declined`

**Trigger:** Expansion rules explicitly require consent for a specified contract class; player declines selection and remains with original club.

**Placeholders:** `{player}`, `{team}`

**Modes:** franchise

**Availability:** Only expansion frameworks with enforceable consent protection.

**Required state:** contract_consent_clause; selection_offer; consent

**Consequences:** Cancel selection and reopen expansion slot without penalizing refusal.

**Media examples:**

- {player} decline the expansion transfer under the consent clause.
- {team} retain him after the permitted refusal.
- The selection cannot close without the contract's required agreement.

### `expansion.club_loss_limit_reached`

**Trigger:** Expansion allocation reaches the maximum permitted player losses from one existing club and removes its remaining players from eligibility.

**Placeholders:** `{team}`, `{limit}`

**Modes:** franchise

**Availability:** Expansion draft with per-club loss cap.

**Required state:** lost_player_count; loss_limit; selection_eligibility

**Consequences:** Close further selections from that club.

**Media examples:**

- {team} reach the expansion loss limit of {limit}.
- Their remaining eligible players leave the selection pool.
- The published club-loss cap now protects the rest of the roster.

### `expansion.pick_compensation_settled`

**Trigger:** Expansion selection triggers a published compensation formula and league transfers the exact designated draft asset to the affected club.

**Placeholders:** `{team}`, `{asset}`

**Modes:** franchise

**Availability:** Expansion rules include explicit draft compensation.

**Required state:** selection_id; compensation_formula; asset_transfer

**Consequences:** Update pick ownership and prevent duplicate compensation.

**Media examples:**

- {team} receive {asset} as expansion compensation.
- The allocation rule transfers the promised draft asset.
- The club's selection loss gets its specified remedy.

### `expansion.extra_roster_grace_expired`

**Trigger:** New club's temporary expanded roster allowance expires on schedule; club legally reduces registration to ordinary limit.

**Placeholders:** `{team}`, `{limit}`

**Modes:** franchise

**Availability:** New club with preannounced temporary roster grace.

**Required state:** grace_expiry; roster_limit; registered_count

**Consequences:** Close temporary allowance; process only authorized roster adjustments.

**Media examples:**

- {team} return to the ordinary {limit}-player roster limit.
- The expansion grace period ends on its published date.
- The registration list clears the standard-size check.

### `expansion.conference_assignment_certified`

**Trigger:** New franchise receives a formal conference assignment based on approved geography and competitive-balance criteria.

**Placeholders:** `{team}`, `{conference}`

**Modes:** franchise

**Availability:** Approved expansion; alignment vote certified.

**Required state:** new_franchise; conference_id; alignment_version

**Consequences:** Regenerate future conference rotations and qualification tables.

**Media examples:**

- {team} join {conference} under the expansion alignment.
- The new franchise gets its place in the league map.
- The certified assignment completes the conference structure.

### `expansion.launch_capacity_shortfall`

**Trigger:** New club's licensed home venue cannot meet the promised launch-date event capacity; league grants a documented lower-capacity first phase.

**Placeholders:** `{team}`, `{capacity}`

**Modes:** franchise

**Availability:** Non-emergency launch shortfall; conditional operating approval.

**Required state:** licensed_capacity; launch_permission; revenue_projection

**Consequences:** Reduce ticket inventory and income forecast; retain expansion approval.

**Media examples:**

- {team} launch with an approved capacity of {capacity}.
- The original attendance plan yields to the licensed venue limit.
- The club can open with a smaller first-phase crowd.

### `expansion.number_of_teams_lottery_resize`

**Trigger:** League increases active franchise count and formally applies its configurable lottery allocation to the new number of eligible clubs.

**Placeholders:** `{league}`, `{teams}`, `{eligible}`

**Modes:** franchise

**Availability:** Expansion approved; configurable lottery system active.

**Required state:** active_club_count; lottery_eligible_ids; lottery_config

**Consequences:** Rebuild draw slots and probabilities, validate total probability.

**Media examples:**

- {league}'s {teams}-team field produces {eligible} lottery entrants.
- The draw resizes to the actual competition.
- The allocation follows configured eligibility rather than an old fixed team count.

### `expansion.first_operating_surplus`

**Trigger:** New franchise completes an audited operating year with revenues above recorded expenses for the first time.

**Placeholders:** `{team}`, `{amount}`

**Modes:** franchise

**Availability:** Club accounting enabled; audited first positive operating year.

**Required state:** operating_revenue; operating_expense; surplus_history

**Consequences:** Update reserves and enable approved reinvestment decisions.

**Media examples:**

- {team} post their first operating surplus of {amount}.
- The expansion balance sheet moves above break-even.
- The audited year gives the new club a positive operating result.

## 67. Relocation continuity and roster identity

### `identity.final_old_venue_fixture`

**Trigger:** Relocating club completes the officially designated last competitive home fixture at its old venue.

**Placeholders:** `{team}`, `{arena}`

**Modes:** franchise

**Availability:** Permanent move already approved; official final fixture designated.

**Required state:** relocation_date; last_old_home; venue_history

**Consequences:** Close old home schedule; preserve result and local record.

**Media examples:**

- {team} complete their final scheduled home game at {arena}.
- The approved move reaches the old venue's closing fixture.
- The farewell game enters the club's venue history.

### `identity.lease_exit_payment`

**Trigger:** Relocating franchise fulfills a disclosed non-criminal lease termination payment before moving.

**Placeholders:** `{team}`, `{amount}`

**Modes:** franchise

**Availability:** Relocation approved; disclosed lease exit clause applies.

**Required state:** lease_exit_clause; payment_complete; move_budget

**Consequences:** Reduce funds and clear contractual venue transition.

**Media examples:**

- {team} settle the {amount} lease exit payment.
- The old venue agreement closes under its published terms.
- The move carries a verified cost before the first new-city game.

### `identity.local_ticket_refunds_complete`

**Trigger:** Club processes every eligible prepaid ticket refund for abandoned old-city dates after relocation.

**Placeholders:** `{team}`, `{city}`

**Modes:** franchise

**Availability:** Approved move removes prepaid dates; refund policy active.

**Required state:** refundable_ticket_ids; paid_claims; refund_liability

**Consequences:** Clear ticket liability and record supporter-service outcome.

**Media examples:**

- {team} complete the eligible ticket refunds in {city}.
- The old-city prepaid dates receive their promised remedy.
- The ticket ledger closes with every qualified claim paid.

### `identity.transitional_home_ground`

**Trigger:** Approved relocation starts before permanent arena opens; club officially uses a licensed temporary home venue for the specified fixtures.

**Placeholders:** `{team}`, `{arena}`, `{games}`

**Modes:** franchise

**Availability:** Approved transition plan; venue licensed for basketball.

**Required state:** temporary_venue; fixture_block; permanent_open_date

**Consequences:** Apply temporary capacity and travel effects only to listed dates.

**Media examples:**

- {team} use {arena} for their first {games} home dates.
- The new-city start gets a temporary court.
- The permanent arena remains a later step in the approved plan.

### `identity.color_palette_current_snapshot`

**Trigger:** Club's authorized colors change; all current roster identity snapshots receive the active palette while archived season visuals retain theirs.

**Placeholders:** `{team}`, `{palette}`

**Modes:** franchise

**Availability:** Authorized club palette change; no real sponsor or brand names.

**Required state:** palette_version; current_roster; archived_palettes

**Consequences:** Refresh current player appearances and retain historical visual provenance.

**Media examples:**

- {team}'s current roster moves to the {palette} palette.
- The new colors follow today's team identity.
- Old season snapshots keep the colors they actually used.

### `identity.retired_number_import_collision`

**Trigger:** Mixed-era roster import carries a historical jersey number already retired by the destination club; validator blocks that number and requests an available assignment.

**Placeholders:** `{team}`, `{player}`, `{number}`

**Modes:** franchise

**Availability:** Mixed-era import into club with active number-retirement policy.

**Required state:** source_number; retired_numbers; current_assignment

**Consequences:** Keep player profile intact and pause final jersey snapshot until a legal number is chosen.

**Media examples:**

- {player}'s imported number {number} is retired by {team}.
- The historic profile needs a current available jersey assignment.
- The source number stays in history without overriding the destination policy.

### `identity.finals_bracket_snapshot_updated`

**Trigger:** Official Finals pairing is certified; presentation snapshot now includes only the actual current finalists and current team identity versions.

**Placeholders:** `{team}`, `{opp}`

**Modes:** franchise

**Availability:** Finals reached and certified; dynamic identity presentation enabled.

**Required state:** certified_finalists; identity_versions; bracket_snapshot

**Consequences:** Use live pairing in Finals visuals; preserve previous years separately.

**Media examples:**

- The Finals presentation pairs {team} with {opp}.
- The current bracket supplies both finalists.
- The championship scene updates to the teams actually competing.

### `identity.renamed_team_record_search`

**Trigger:** Rebranded club's history search successfully resolves both old and current approved names to the same unchanged franchise lineage.

**Placeholders:** `{team}`, `{oldname}`

**Modes:** franchise

**Availability:** Approved rebrand without lineage split.

**Required state:** name_aliases; franchise_id; search_index

**Consequences:** Keep player and banner histories accessible across identity change.

**Media examples:**

- {team}'s records remain searchable under {oldname}.
- The name changes without splitting the franchise ledger.
- The historical index links both identities to one club.

### `identity.moved_city_banner_terms`

**Trigger:** Relocation agreement requires specified banners to stay in the old city while official sporting credit remains with the moving franchise.

**Placeholders:** `{team}`, `{city}`, `{banners}`

**Modes:** franchise

**Availability:** Approved move with explicit banner-custody agreement.

**Required state:** banner_custody; title_credit; lineage_terms

**Consequences:** Transfer artifact custody only; preserve agreed title attribution.

**Media examples:**

- {team} leave {banners} banners in {city} under the agreement.
- The display stays behind while the title ledger keeps its assigned owner.
- The move separates physical artifacts from sporting credit.

### `identity.return_city_application`

**Trigger:** Former home city submits a complete formal application for a new franchise under a separate ownership group; no award is implied.

**Placeholders:** `{city}`, `{group}`

**Modes:** franchise

**Availability:** Expansion application window open; lawful group registered.

**Required state:** application_id; applicant_group; review_stage

**Consequences:** Open application review; do not create team or schedule yet.

**Media examples:**

- {city} apply for a new franchise through {group}.
- The return effort reaches the official application stage.
- The league has a filed proposal, with approval still undecided.

## 68. Ownership governance and decision rights

### `governance.board_quorum_failure`

**Trigger:** Scheduled ownership board meeting lacks the minimum voting attendance and formally postpones its spending resolution.

**Placeholders:** `{team}`, `{quorum}`

**Modes:** franchise

**Availability:** Club charter has enforceable quorum rules.

**Required state:** board_attendance; required_quorum; pending_resolution

**Consequences:** Delay decision and retain previous approved budget.

**Media examples:**

- {team}'s board cannot reach the {quorum}-member quorum.
- The spending proposal waits without a valid vote.
- An empty seat has an immediate governance consequence.

### `governance.supermajority_project_block`

**Trigger:** Facility proposal wins a simple majority but fails the charter's required supermajority and is officially rejected.

**Placeholders:** `{team}`, `{threshold}`

**Modes:** franchise

**Availability:** Published supermajority requirement for capital projects.

**Required state:** vote_tally; supermajority_threshold; project_status

**Consequences:** Block spending authorization; allow revised later proposal.

**Media examples:**

- {team}'s project falls short of the {threshold} approval threshold.
- A majority is not enough under the club charter.
- The proposal fails the actual voting rule.

### `governance.chair_casting_vote`

**Trigger:** Board vote ties; charter authorizes chair's additional casting vote and that vote formally decides the issue.

**Placeholders:** `{team}`, `{decision}`

**Modes:** franchise

**Availability:** Charter explicitly allows casting vote; issue non-criminal.

**Required state:** initial_tally; casting_vote; resolution

**Consequences:** Execute certified resolution and archive both voting stages.

**Media examples:**

- {team}'s tied board vote resolves as {decision}.
- The chair uses the charter's casting-vote power.
- The final decision follows the tie procedure rather than an ordinary majority.

### `governance.owner_budget_veto`

**Trigger:** Owner exercises a previously disclosed budget veto over board-approved additional spending within charter powers.

**Placeholders:** `{team}`, `{amount}`

**Modes:** franchise

**Availability:** Documented ownership veto right; discretionary new spend only.

**Required state:** reserved_veto; board_resolution; approved_budget

**Consequences:** Cancel uncommitted extra spending; respect existing contracts.

**Media examples:**

- {team}'s extra {amount} spending proposal meets the owner veto.
- Board approval does not clear the reserved spending power.
- The original budget stays in force.

### `governance.sporting_autonomy_charter`

**Trigger:** Club amends governance charter so ownership cannot override named sporting decisions after delegation, and first attempted override is denied.

**Placeholders:** `{team}`, `{decision}`

**Modes:** franchise

**Availability:** Approved autonomy charter; actual attempted override recorded.

**Required state:** delegated_rights; override_attempt; charter_version

**Consequences:** Keep valid sporting decision and log governance boundary.

**Media examples:**

- {team}'s sporting charter blocks an ownership override of {decision}.
- The delegated authority holds on its first contested decision.
- The owner cannot substitute a preference for the approved decision holder.

### `governance.supporter_seat_first_vote`

**Trigger:** Authorized supporter-elected board member casts a first binding vote on a real club resolution.

**Placeholders:** `{team}`, `{issue}`

**Modes:** franchise

**Availability:** Club charter already grants lawful supporter voting seat.

**Required state:** supporter_seat; first_vote; resolution_id

**Consequences:** Include vote with normal charter weight; no automatic majority assumed.

**Media examples:**

- {team}'s supporter seat casts its first binding vote on {issue}.
- The representative moves from election to a recorded decision.
- The fan seat now appears in the certified tally.

### `governance.rotation_delegate_changed`

**Trigger:** Multi-owner league rotates its official club representative under a preannounced term schedule and new delegate attends first vote.

**Placeholders:** `{team}`, `{delegate}`

**Modes:** franchise

**Availability:** Published delegate rotation; authorized new representative.

**Required state:** delegate_term; authorized_delegate; first_league_vote

**Consequences:** Transfer league voting credential, preserve club ownership.

**Media examples:**

- {delegate} cast {team}'s first vote of the new term.
- The scheduled representative rotation takes effect.
- The league register updates who can speak for the club.

### `governance.commissioner_term_limit`

**Trigger:** Commissioner reaches charter term limit; governing body starts the prescribed successor selection process without extending incumbent authority.

**Placeholders:** `{league}`, `{term}`

**Modes:** franchise

**Availability:** League charter includes commissioner term limits.

**Required state:** term_count; term_limit; succession_stage

**Consequences:** Open nomination window; no successor named until certified.

**Media examples:**

- {league} open succession at the {term} term limit.
- The charter closes another route to extending the incumbent.
- The selection process begins with authority bounded by the existing term.

### `governance.resolution_sunset`

**Trigger:** Time-limited club policy expires without renewal and the prior standing policy resumes automatically.

**Placeholders:** `{team}`, `{policy}`

**Modes:** franchise

**Availability:** Explicit sunset clause adopted earlier.

**Required state:** temporary_policy; expiry_date; baseline_policy

**Consequences:** Restore documented baseline; avoid retroactive decision changes.

**Media examples:**

- {team}'s temporary {policy} policy expires.
- The sunset date restores the standing arrangement.
- The board would need a new resolution to keep the temporary terms.

### `governance.remote_vote_credential_rejected`

**Trigger:** League voting system rejects a remote ballot lacking the registered delegate credential before tally certification.

**Placeholders:** `{team}`

**Modes:** franchise

**Availability:** Remote voting technology available in era; credential mismatch verified.

**Required state:** ballot_credential; authorized_delegate; tally_status

**Consequences:** Allow authorized resubmission before deadline; no misconduct finding.

**Media examples:**

- {team}'s remote ballot fails the credential check.
- The tally stays uncertified until an authorized vote arrives.
- The system rejects the submission without inferring anyone's motive.

## 69. Club budgets, revenues, and operating choices

### `budget.revenue_share_threshold`

**Trigger:** Audited eligible league revenue crosses the published redistribution threshold, triggering an automatic club payment.

**Placeholders:** `{team}`, `{amount}`

**Modes:** franchise

**Availability:** Revenue-sharing framework active; audited pool certified.

**Required state:** eligible_revenue; distribution_formula; club_payment

**Consequences:** Increase operating funds under collective formula.

**Media examples:**

- {team} receive {amount} under the revenue-sharing threshold.
- The audited pool activates the published transfer.
- The budget gains an amount the distribution formula actually supports.

### `budget.playoff_profit_reconciled`

**Trigger:** Club's completed playoff run yields a verified net operating contribution after event expenses, rather than projected gross receipts.

**Placeholders:** `{team}`, `{amount}`

**Modes:** franchise

**Availability:** Club finance model; completed postseason ledger.

**Required state:** playoff_receipts; event_costs; net_contribution

**Consequences:** Update reserves from audited net, not headline gross.

**Media examples:**

- {team}'s playoff run adds a net {amount} to operations.
- The event costs are counted before the postseason profit.
- The final ledger replaces the ticket-revenue forecast.

### `budget.sellout_loses_money`

**Trigger:** A sold-out event's confirmed venue and travel costs exceed its total event revenue.

**Placeholders:** `{team}`, `{loss}`

**Modes:** franchise

**Availability:** Confirmed sold-out fixture and audited event expenses.

**Required state:** ticket_inventory; event_revenue; event_cost

**Consequences:** Reduce funds and show cost drivers without blaming fans.

**Media examples:**

- {team}'s sellout still records a {loss} event loss.
- Every seat sells, but the expense ledger wins.
- Attendance success does not clear this game's operating costs.

### `budget.reserve_floor_locks_project`

**Trigger:** Proposed discretionary project would lower reserves below the charter's minimum floor; finance validator blocks commitment.

**Placeholders:** `{team}`, `{floor}`

**Modes:** franchise

**Availability:** Club has published reserve policy; no insolvency claim implied.

**Required state:** cash_reserves; reserve_floor; project_commitment

**Consequences:** Hold proposal; retain funds for existing obligations.

**Media examples:**

- {team}'s project cannot cross the {floor} reserve floor.
- The cash safeguard stops the new commitment.
- The club must revise funding before work is authorized.

### `budget.ticket_freeze_renewal_gain`

**Trigger:** Club freezes season-ticket prices and measured renewal rate exceeds its stored pre-policy baseline after the renewal window closes.

**Placeholders:** `{team}`, `{rate}`

**Modes:** franchise

**Availability:** Price freeze enacted; comparable renewal baseline available.

**Required state:** ticket_price; renewal_rate; baseline_rate

**Consequences:** Update retained customer revenue; do not claim sole causation.

**Media examples:**

- {team}'s price-freeze renewal rate reaches {rate}.
- The closed window beats the stored renewal baseline.
- The club gains a measured result from its affordability choice.

### `budget.ticket_hike_capacity_loss`

**Trigger:** Published ticket-price increase is followed by verified paid attendance below the predeclared forecast, producing lower net ticket revenue than plan.

**Placeholders:** `{team}`, `{shortfall}`

**Modes:** franchise

**Availability:** Actual policy and comparable forecast recorded before sales.

**Required state:** ticket_price; paid_attendance; revenue_forecast

**Consequences:** Revise future demand model and budget; permit price review.

**Media examples:**

- {team}'s ticket plan finishes {shortfall} below forecast.
- The higher price meets a smaller paying crowd than projected.
- The completed ledger misses the plan without proving one sole cause.

### `budget.local_rights_expiry_gap`

**Trigger:** Club's broadcast agreement expires before replacement closes, leaving next approved games without contracted local media revenue.

**Placeholders:** `{team}`, `{games}`

**Modes:** franchise

**Availability:** Broadcast-rights era and market exist; no unauthorized stream assumed.

**Required state:** rights_expiry; new_contract_status; uncovered_games

**Consequences:** Remove forecast income for uncovered dates; schedule lawful distribution separately.

**Media examples:**

- {team} face {games} games without contracted local-rights income.
- The old agreement expires before a replacement is signed.
- The budget loses a revenue line while distribution remains a separate decision.

### `budget.cooperative_purchasing_savings`

**Trigger:** Multiple clubs complete an authorized joint equipment purchase; audited unit cost is below their prior individual price.

**Placeholders:** `{league}`, `{saved}`

**Modes:** franchise

**Availability:** Permitted club purchasing cooperative; completed order audited.

**Required state:** purchasing_group; prior_unit_cost; actual_cost

**Consequences:** Distribute verified savings and preserve product standards.

**Media examples:**

- {league}'s joint purchase saves {saved}.
- The shared equipment order beats the previous unit cost.
- Cooperation lowers operations spending without changing rosters.

### `budget.prize_payment_delay`

**Trigger:** Organizing league confirms a due competition prize payment is delayed under an announced revised payment date.

**Placeholders:** `{team}`, `{amount}`, `{date}`

**Modes:** franchise

**Availability:** Published prize terms; delay officially acknowledged.

**Required state:** prize_due; announced_payment_date; cash_projection

**Consequences:** Reschedule cash flow without deleting earned sporting prize.

**Media examples:**

- {team}'s {amount} prize payment moves to {date}.
- The honor stays recorded while the cash arrives later.
- The revised payment date changes the short-term budget.

### `budget.training_spend_tradeoff`

**Trigger:** Club elects to redirect uncommitted discretionary marketing funds to development facilities and certified budget reflects both reductions and additions.

**Placeholders:** `{team}`, `{amount}`

**Modes:** franchise

**Availability:** Discretionary funds legally reallocated; existing contracts honored.

**Required state:** marketing_allocation; development_allocation; budget_revision

**Consequences:** Update both budgets; outcomes measured later.

**Media examples:**

- {team} move {amount} from marketing into development.
- The approved budget funds one priority by trimming another.
- The reallocation changes resources without promising player improvement.

## 70. Facilities and operational capacity

### `facility.second_court_overbooked`

**Trigger:** Two authorized team units book the same practice court simultaneously; booking validator reallocates one to an available licensed court.

**Placeholders:** `{team}`, `{unit}`

**Modes:** franchise

**Availability:** Multiple licensed courts and scheduling system enabled.

**Required state:** court_bookings; unit_schedules; alternate_court

**Consequences:** Move affected session without assuming competitive disadvantage.

**Media examples:**

- {team} resolve a practice-court clash involving {unit}.
- The corrected booking gives both units their own space.
- One court cannot host two full sessions at once.

### `facility.recovery_room_capacity`

**Trigger:** Medical support staff document that routine recovery-room appointments exceed capacity; club adds approved appointment slots without changing care protocols.

**Placeholders:** `{team}`, `{slots}`

**Modes:** franchise

**Availability:** Qualified medical staffing and facility-capacity model.

**Required state:** appointment_demand; licensed_capacity; added_slots

**Consequences:** Reduce waiting queue; do not infer diagnosis or faster healing.

**Media examples:**

- {team} add {slots} routine recovery appointments.
- The facility schedule expands to meet its documented queue.
- Care decisions stay with qualified staff while access improves.

### `facility.simultaneous_youth_priority`

**Trigger:** Venue charter gives community youth sessions priority at specified times and club officially shifts its own discretionary practice reservation.

**Placeholders:** `{team}`, `{time}`

**Modes:** franchise

**Availability:** Existing shared-use charter and nonessential practice conflict.

**Required state:** protected_slots; club_booking; revised_practice

**Consequences:** Reschedule permitted session; preserve community access.

**Media examples:**

- {team} move practice around the protected {time} community slot.
- The venue charter keeps its youth-access promise.
- The professional schedule yields within the shared-use agreement.

### `facility.energy_retrofit_verified`

**Trigger:** Completed approved energy retrofit produces a measured operating-energy reduction against a weather-adjusted baseline.

**Placeholders:** `{team}`, `{reduction}`

**Modes:** franchise

**Availability:** Retrofit already complete; verified comparable measurement window.

**Required state:** meter_usage; adjusted_baseline; efficiency_delta

**Consequences:** Reduce measured utility costs where tariffs support it.

**Media examples:**

- {team}'s retrofit cuts measured energy use by {reduction}.
- The adjusted meter comparison clears the efficiency target.
- The facility gets a verified result beyond its construction promise.

### `facility.sound_treatment_compliant`

**Trigger:** Arena acoustic treatment passes independent event-noise test and clears previously imposed volume restrictions.

**Placeholders:** `{arena}`, `{limit}`

**Modes:** franchise

**Availability:** Noise restriction exists; qualified testing completed.

**Required state:** acoustic_test; approved_limit; restriction_status

**Consequences:** Restore only certified sound settings; no hearing benefit presumed.

**Media examples:**

- {arena} pass the revised noise test at {limit}.
- The treatment clears the venue's imposed sound restriction.
- The event plan can use the newly certified limits.

### `facility.practice_site_distance_cost`

**Trigger:** Team chooses cheaper rented practice space farther from its home venue and measured staff travel cost erases projected rent savings.

**Placeholders:** `{team}`, `{amount}`

**Modes:** franchise

**Availability:** Non-emergency rental choice; completed travel-cost sample.

**Required state:** rent_savings; travel_cost; net_facility_cost

**Consequences:** Revise budget and allow later location review.

**Media examples:**

- {team}'s cheaper practice lease saves no net operating money.
- Added travel consumes the projected {amount} rent savings.
- The full cost ledger changes the facility decision's value.

### `facility.floor_surface_recertified`

**Trigger:** Routine court resurfacing passes required grip and dimensional testing; venue returns to approved sporting use.

**Placeholders:** `{arena}`

**Modes:** franchise

**Availability:** Routine maintenance, qualified inspection; no emergency assumed.

**Required state:** surface_work; certification_result; venue_eligibility

**Consequences:** Restore venue eligibility; no injury-prevention claim invented.

**Media examples:**

- {arena} regain court certification after resurfacing.
- The test results clear the new playing surface.
- The venue returns under the verified court standards.

### `facility.storage_inventory_failure`

**Trigger:** Event setup audit finds essential approved equipment absent from the team's inventory and a documented licensed loan fills the shortage before play.

**Placeholders:** `{team}`, `{item}`

**Modes:** franchise

**Availability:** Essential nonmedical equipment absent; safe approved substitute available.

**Required state:** inventory_gap; loaned_equipment; setup_clearance

**Consequences:** Record inventory corrective action and any loan cost.

**Media examples:**

- {team} secure a loan of the missing {item}.
- The setup audit finds the inventory gap before the fixture.
- The approved replacement lets the event proceed.

### `facility.access_route_test_pass`

**Trigger:** Venue completes a documented spectator access-route improvement and independent usability test clears the stated requirements.

**Placeholders:** `{arena}`, `{route}`

**Modes:** franchise

**Availability:** Qualified accessibility review and explicit test criteria.

**Required state:** route_spec; usability_results; access_information

**Consequences:** Update event access plan without claiming universal accessibility.

**Media examples:**

- {arena} pass the usability test for {route}.
- The revised route meets its stated access requirements.
- The venue can publish verified access information for guests.

### `facility.temporary_capacity_reduction`

**Trigger:** Planned non-emergency renovation removes licensed seats for a defined fixture block; club revises ticket inventory before sale.

**Placeholders:** `{team}`, `{seats}`, `{games}`

**Modes:** franchise

**Availability:** Planned works with approved safe partial operation.

**Required state:** renovation_block; licensed_seats; ticket_inventory

**Consequences:** Reduce projected attendance revenue and avoid overselling.

**Media examples:**

- {team} remove {seats} seats from sale for {games} fixtures.
- The renovation changes the licensed ticket inventory.
- The smaller crowd limit is published before tickets go out.

## 71. Collective rules, cap accounting, and league administration

### `admin.cap_projection_revised`

**Trigger:** Audited collective revenue estimate changes the officially announced next-season cap before contract negotiation window begins.

**Placeholders:** `{league}`, `{cap}`

**Modes:** franchise

**Availability:** Cap tied to collective revenue; pre-window revision authorized.

**Required state:** revenue_estimate; announced_cap; negotiation_window

**Consequences:** Recalculate future club room without rewriting executed contracts.

**Media examples:**

- {league} revise the next-season cap to {cap}.
- The certified revenue estimate replaces the early projection.
- Front offices now plan against the announced limit.

### `admin.hard_cap_registration_block`

**Trigger:** Proposed registration would exceed club's active hard cap; league refuses activation before player appears.

**Placeholders:** `{team}`, `{amount}`

**Modes:** franchise

**Availability:** Hard-cap rules active; verified accounting, not allegation.

**Required state:** hard_cap; committed_salary; registration_status

**Consequences:** Keep proposal pending; player remains unregistered for competition.

**Media examples:**

- {team}'s registration fails the hard-cap check by {amount}.
- The roster addition cannot become active under the present limit.
- The front office needs a lawful cap adjustment first.

### `admin.salary_floor_trueup`

**Trigger:** Club finishes the accounting season below negotiated team spending floor and pays the prescribed collective true-up.

**Placeholders:** `{team}`, `{amount}`

**Modes:** franchise

**Availability:** Collective agreement explicitly defines spending floor and remedy.

**Required state:** team_spend; salary_floor; trueup_payment

**Consequences:** Reduce club funds and distribute only per agreement.

**Media examples:**

- {team} pay the {amount} salary-floor adjustment.
- The season-end ledger activates the agreement's minimum-spend remedy.
- The true-up closes the shortfall without inventing new contracts.

### `admin.bonus_cap_reclassification`

**Trigger:** Certified prior-season performance changes a contractual bonus from likely to unlikely or vice versa under published accounting rules.

**Placeholders:** `{team}`, `{player}`, `{status}`

**Modes:** franchise

**Availability:** Contract bonus and applicable likelihood accounting rule exist.

**Required state:** bonus_trigger; last_season_result; cap_classification

**Consequences:** Recalculate cap commitments; preserve contractual payment conditions.

**Media examples:**

- {player}'s bonus becomes {status} on {team}'s cap ledger.
- The accounting category follows the certified performance test.
- The contract remains unchanged while projected cap charges move.

### `admin.tax_band_reached`

**Trigger:** Final club salary accounting enters a published progressive luxury-tax band for the first time that season.

**Placeholders:** `{team}`, `{band}`

**Modes:** franchise

**Availability:** Luxury-tax system enabled; no fixed rate assumed.

**Required state:** taxable_payroll; tax_band; tax_due

**Consequences:** Record tax liability and update funds under active formula.

**Media examples:**

- {team}'s final payroll reaches tax band {band}.
- The progressive formula adds its specified charge.
- The tax calculation follows the completed salary ledger.

### `admin.cap_rule_grandfather_contract`

**Trigger:** New cap-accounting rule includes an explicit grandfather clause, preserving one executed contract's old charge treatment.

**Placeholders:** `{team}`, `{player}`

**Modes:** franchise

**Availability:** Ratified transition rules with defined grandfather eligibility.

**Required state:** contract_date; grandfather_clause; charge_method

**Consequences:** Maintain exempt charge classification until clause ends.

**Media examples:**

- {team} retain the prior cap treatment for {player}'s contract.
- The agreement's grandfather clause applies to the existing deal.
- Future contracts follow the new rule; this one keeps its protected accounting.

### `admin.registration_window_late`

**Trigger:** Club submits otherwise valid player registration after the competition window closes and receives an official next-window activation date.

**Placeholders:** `{team}`, `{player}`, `{date}`

**Modes:** franchise

**Availability:** Competition explicitly restricts registration windows.

**Required state:** submission_time; window_end; next_activation

**Consequences:** Delay eligibility without implying contract invalidity.

**Media examples:**

- {team} cannot activate {player} until {date}.
- The paperwork is valid but arrives outside the window.
- The roster must wait for the next permitted registration period.

### `admin.cross_league_clearance_received`

**Trigger:** Player transfer between distinct competitions receives required sporting clearance after both registries certify eligibility.

**Placeholders:** `{player}`, `{team}`

**Modes:** franchise

**Availability:** Cross-competition clearance framework exists.

**Required state:** origin_registration; destination_registration; clearance

**Consequences:** Permit activation subject to remaining roster rules.

**Media examples:**

- {player} receive the clearance needed to register with {team}.
- Both competition registries complete the sporting transfer check.
- The administrative barrier clears without a new contract announcement.

### `admin.escrow_team_reconciliation`

**Trigger:** Collective season-end accounting certifies team-level escrow reconciliation and adjusts the club's league settlement balance.

**Placeholders:** `{team}`, `{amount}`

**Modes:** franchise

**Availability:** Collective agreement includes escrow; team accounting only.

**Required state:** collective_revenue; team_escrow; settlement_balance

**Consequences:** Adjust club settlement; individual payouts remain separate authorized records.

**Media examples:**

- {team}'s collective settlement adjusts by {amount}.
- The certified reconciliation closes the team's escrow ledger.
- The league-accounting result replaces the provisional balance.

### `admin.development_affiliate_eligibility`

**Trigger:** Affiliate registration audit confirms a player meets newly triggered recall eligibility conditions and opens a permitted first-team activation route.

**Placeholders:** `{player}`, `{team}`

**Modes:** franchise

**Availability:** Affiliate system and explicit recall rules active.

**Required state:** affiliate_status; recall_conditions; eligibility

**Consequences:** Enable lawful recall offer; do not automatically transfer or assign minutes.

**Media examples:**

- {player} become eligible for recall by {team}.
- The affiliate record clears the required activation conditions.
- A permitted route opens, with the roster decision still ahead.

## 72. Staffing, scouting, and front-office decisions

### `frontoffice.dual_approval_deadlock`

**Trigger:** Club charter requires coach and GM consent for a roster proposal; recorded disagreement prevents execution by deadline.

**Placeholders:** `{team}`, `{coach}`, `{gm}`

**Modes:** franchise

**Availability:** Published dual-approval decision rights; no leak assumed.

**Required state:** dual_consent; coach_decision; gm_decision; deadline

**Consequences:** Let proposal expire; keep current roster and track decision friction.

**Media examples:**

- {coach} and {gm} leave {team}'s proposal without joint approval.
- The required second signature never arrives.
- The front-office structure blocks the move before execution.

### `frontoffice.authority_split_resolved`

**Trigger:** Board officially reallocates distinct roster and coaching decision rights after a documented recurring approval deadlock.

**Placeholders:** `{team}`, `{gm}`, `{coach}`

**Modes:** franchise

**Availability:** Board-approved governance amendment, not generic chemistry event.

**Required state:** old_rights; new_rights; deadlock_history

**Consequences:** Apply revised authority prospectively; prior decisions stay archived.

**Media examples:**

- {team} divide decision authority between {gm} and {coach}.
- The revised charter resolves the repeated approval bottleneck.
- Each sporting decision now has a named accountable role.

### `frontoffice.draft_clock_fallback`

**Trigger:** Live draft selection clock expires; preauthorized ranked fallback list automatically supplies an eligible candidate under the draft rules.

**Placeholders:** `{team}`, `{player}`

**Modes:** franchise

**Availability:** Draft permits automated fallback and user authorized list beforehand.

**Required state:** pick_clock; fallback_list; selected_candidate

**Consequences:** Execute valid fallback selection; log user decision lapse.

**Media examples:**

- {team}'s fallback list selects {player} as the clock expires.
- The preapproved ranking keeps the missed decision from becoming an empty slot.
- The pick follows the recorded contingency policy.

### `frontoffice.scout_disagreement_logged`

**Trigger:** Two independent scouting teams submit materially conflicting evaluations and club formally commissions a third assessment instead of averaging them blindly.

**Placeholders:** `{team}`, `{player}`

**Modes:** franchise

**Availability:** Scouting system records independent reports and review threshold.

**Required state:** report_pair; disagreement_threshold; third_review

**Consequences:** Delay evaluation-dependent choice and budget added scouting cost.

**Media examples:**

- {team} order a third assessment of {player}.
- The first two scouting evaluations conflict beyond the review threshold.
- The decision waits for another documented look.

### `frontoffice.scout_region_uncovered`

**Trigger:** Assigned scout position becomes vacant and coverage audit shows one declared recruiting region has no active evaluator.

**Placeholders:** `{team}`, `{region}`

**Modes:** franchise

**Availability:** Regional scouting model enabled; no talent quality inference.

**Required state:** scout_assignments; vacant_role; uncovered_region

**Consequences:** Reduce fresh report availability for region; open authorized hire.

**Media examples:**

- {team}'s scouting map leaves {region} uncovered.
- The vacant assignment creates a documented information gap.
- The front office must fill the role or accept the blind spot.

### `frontoffice.data_purchase_low_coverage`

**Trigger:** Club buys a declared scouting dataset; audit finds coverage below the contract's promised sample and supplier supplies corrected files.

**Placeholders:** `{team}`, `{coverage}`

**Modes:** franchise

**Availability:** Era-appropriate data service, verified contractual coverage shortfall.

**Required state:** dataset_contract; actual_coverage; corrected_delivery

**Consequences:** Replace incomplete data and log delay; no fabricated scouting claim.

**Media examples:**

- {team}'s scouting dataset initially covers only {coverage}.
- The coverage audit prompts a corrected delivery.
- The office receives the promised information after the gap is documented.

### `frontoffice.assistant_noncompete_cleared`

**Trigger:** A staff candidate's permitted competition-restriction clause expires and registry confirms eligibility to join a new club.

**Placeholders:** `{coach}`, `{team}`

**Modes:** franchise

**Availability:** Applicable lawful staff restriction, not player no-trade clause.

**Required state:** restriction_expiry; staff_eligibility; hiring_status

**Consequences:** Enable lawful appointment; no hire assumed until signed.

**Media examples:**

- {coach} become eligible to join {team}'s staff.
- The recorded restriction period expires before the appointment.
- The hiring route opens without breaching the prior agreement.

### `frontoffice.staff_budget_role_choice`

**Trigger:** Limited approved staffing budget can fund only one of two evaluated roles; GM formally chooses a role and leaves the other vacant.

**Placeholders:** `{team}`, `{role}`, `{other}`

**Modes:** franchise

**Availability:** Staff model and legally valid budget choice enabled.

**Required state:** staff_budget; role_costs; chosen_role

**Consequences:** Apply role-specific coverage and workload consequences only.

**Media examples:**

- {team} fund {role} and leave {other} vacant.
- The staffing budget forces an explicit priority.
- One capability gains resources while the other remains a gap.

### `frontoffice.coach_certification_lapse`

**Trigger:** Staff credential required by the active competition expires; league temporarily bars that coach from regulated bench duties until renewed.

**Placeholders:** `{coach}`, `{team}`

**Modes:** franchise

**Availability:** Competition actually requires the credential; no ability judgment.

**Required state:** credential_expiry; bench_eligibility; renewal_status

**Consequences:** Remove regulated duty eligibility; allow qualified replacement and renewal.

**Media examples:**

- {coach} pause regulated bench duties with {team}.
- The required credential expires before renewal is recorded.
- The club must use an eligible staff assignment for now.

### `frontoffice.succession_shadow_completed`

**Trigger:** Designated executive successor completes an approved shadow period and board certifies readiness without transferring power yet.

**Placeholders:** `{team}`, `{successor}`

**Modes:** franchise

**Availability:** Formal executive development plan exists and requirements met.

**Required state:** succession_candidate; shadow_requirements; readiness_certificate

**Consequences:** Unlock future succession option; current executive retains office.

**Media examples:**

- {successor} complete {team}'s executive shadow program.
- The board certifies readiness without changing today's authority.
- The succession plan gains a prepared candidate, not an automatic appointment.

## 73. Classroom choices and qualifications

### `education.major_switch`

**Trigger:** Player formally changes academic major, changing the remaining course plan.

**Placeholders:** `{major}`, `{player}`

**Modes:** player

**Availability:** All eras; enrolled players; institutional calendars and education rules apply; announcements require player consent.

**Required state:** education.major_switch.status; education.major_switch.decision; education.major_switch.public_disclosure; degree_progress; course_deadlines; study_time

**Consequences:** Replace degree prerequisites and shift nonteam time allocation.

**Media examples:**

- {player} changes his academic route to {major}.
- The classroom plan takes a new direction for {player}.
- A different major changes what {player} must finish.

### `education.capstone_defense_pass`

**Trigger:** Player presents and passes a required final capstone assessment while maintaining active career commitments.

**Placeholders:** `{player}`, `{school}`

**Modes:** player

**Availability:** All eras; enrolled players; institutional calendars and education rules apply; announcements require player consent.

**Required state:** education.capstone_defense_pass.status; education.capstone_defense_pass.decision; education.capstone_defense_pass.public_disclosure; degree_progress; course_deadlines; study_time

**Consequences:** Unlock degree completion check and add academic credibility.

**Media examples:**

- {player} passes his capstone defense at {school}.
- The final project survives the questions for {player}.
- {school} sign off on {player}'s capstone work.

### `education.class_presentation_conflict`

**Trigger:** Player chooses a mandatory assessed presentation over a previously optional media appearance and notifies both organizers.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; enrolled players; institutional calendars and education rules apply; announcements require player consent.

**Required state:** education.class_presentation_conflict.status; education.class_presentation_conflict.decision; education.class_presentation_conflict.public_disclosure; degree_progress; course_deadlines; study_time

**Consequences:** Record assessment attendance; remove appearance and adjust media relationship.

**Media examples:**

- {player} chooses the classroom presentation over the microphone.
- The optional interview gives way to {player}'s assessed work.
- An academic deadline takes priority on {player}'s calendar.

### `education.incomplete_course_plan`

**Trigger:** Instructor approves an incomplete-course agreement with a new submission deadline following a documented scheduling disruption.

**Placeholders:** `{course}`, `{player}`, `{school}`

**Modes:** player

**Availability:** All eras; enrolled players; institutional calendars and education rules apply; announcements require player consent.

**Required state:** education.incomplete_course_plan.status; education.incomplete_course_plan.decision; education.incomplete_course_plan.public_disclosure; degree_progress; course_deadlines; study_time

**Consequences:** Create assignment deadline and block credit until submission, without automatic ineligibility.

**Media examples:**

- {player} receives an approved completion plan for {course}.
- The coursework remains unfinished, but {player} has a deadline.
- {school} put {player}'s remaining assignment on a written timetable.

### `education.remote_degree_enrollment`

**Trigger:** Player enrolls in an accredited remote degree program without pausing competition.

**Placeholders:** `{player}`, `{subject}`

**Modes:** player

**Availability:** All eras; enrolled players; institutional calendars and education rules apply; announcements require player consent.

**Required state:** education.remote_degree_enrollment.status; education.remote_degree_enrollment.decision; education.remote_degree_enrollment.public_disclosure; degree_progress; course_deadlines; study_time

**Consequences:** Create recurring study slots and degree progress meter.

**Media examples:**

- {player} starts a remote degree in {subject}.
- The road schedule now includes coursework for {player}.
- A new classroom fits inside {player}'s travel routine.

### `education.graduation_ceremony_choice`

**Trigger:** Degree-qualified player accepts a graduation ceremony invitation and selects attendance over an optional team social event.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; enrolled players; institutional calendars and education rules apply; announcements require player consent.

**Required state:** education.graduation_ceremony_choice.status; education.graduation_ceremony_choice.decision; education.graduation_ceremony_choice.public_disclosure; degree_progress; course_deadlines; study_time

**Consequences:** Record ceremony attendance and social opportunity cost; degree completion already established.

**Media examples:**

- {player} chooses to attend his graduation ceremony.
- The gown gets a place on {player}'s calendar.
- A completed degree receives a personal celebration from {player}.

### `education.research_publication`

**Trigger:** Institution accepts player's original academic paper for publication after independent peer review.

**Placeholders:** `{player}`, `{subject}`

**Modes:** player

**Availability:** All eras; enrolled players; institutional calendars and education rules apply; announcements require player consent.

**Required state:** education.research_publication.status; education.research_publication.decision; education.research_publication.public_disclosure; degree_progress; course_deadlines; study_time

**Consequences:** Unlock research recognition and possible education invitations.

**Media examples:**

- {player}'s research paper earns publication.
- Peer review opens a new audience for {player}.
- The byline belongs to {player}; the subject is {subject}.

### `education.lab_team_role`

**Trigger:** Player accepts a defined role on a supervised academic project and completes the assigned milestone.

**Placeholders:** `{player}`, `{school}`

**Modes:** player

**Availability:** All eras; enrolled players; institutional calendars and education rules apply; announcements require player consent.

**Required state:** education.lab_team_role.status; education.lab_team_role.decision; education.lab_team_role.public_disclosure; degree_progress; course_deadlines; study_time

**Consequences:** Increase collaboration standing and academic progress without implying scientific breakthrough.

**Media examples:**

- {player} completes his part of {school}'s research project.
- The academic team gets its assigned work from {player}.
- A project milestone puts {player}'s classroom contribution on record.

### `education.tutoring_appointment_kept`

**Trigger:** Player maintains an agreed series of subject-tutoring appointments and completes the attendance goal.

**Placeholders:** `{player}`, `{subject}`

**Modes:** player

**Availability:** All eras; enrolled players; institutional calendars and education rules apply; announcements require player consent.

**Required state:** education.tutoring_appointment_kept.status; education.tutoring_appointment_kept.decision; education.tutoring_appointment_kept.public_disclosure; degree_progress; course_deadlines; study_time

**Consequences:** Improve study habit state; academic results remain separately simulated.

**Media examples:**

- {player} completes his tutoring attendance plan.
- The study routine holds through {player}'s crowded calendar.
- {subject} gets consistent time from {player}.

### `education.gap_term_declared`

**Trigger:** Player requests and receives an academic leave term without claiming a completed degree or retiring.

**Placeholders:** `{player}`, `{school}`

**Modes:** player

**Availability:** All eras; enrolled players; institutional calendars and education rules apply; announcements require player consent.

**Required state:** education.gap_term_declared.status; education.gap_term_declared.decision; education.gap_term_declared.public_disclosure; degree_progress; course_deadlines; study_time

**Consequences:** Pause course progress and create a re-enrollment date.

**Media examples:**

- {player} takes an approved academic leave term.
- The degree clock pauses under {school}'s agreed plan.
- {player} sets a date to revisit his coursework.

## 74. Campus belonging and amateur decisions

### `campus.dorm_roommate_agreement`

**Trigger:** Player and consenting roommate sign a practical room-use agreement after scheduling friction.

**Placeholders:** `{player}`, `{roommate}`

**Modes:** player

**Availability:** All eras; amateur or college pathway enabled; institution rules apply; public disclosure is optional.

**Required state:** campus.dorm_roommate_agreement.status; campus.dorm_roommate_agreement.decision; campus.dorm_roommate_agreement.public_disclosure; campus_relationships; residence_assignment; amateur_path

**Consequences:** Reduce household friction and establish quiet-hour obligations.

**Media examples:**

- {player} and {roommate} agree a dorm-room routine.
- Two schedules find common ground in {player}'s room.
- The roommate agreement gives {player}'s campus life clearer boundaries.

### `campus.student_club_election`

**Trigger:** Player stands for an ordinary student-club role and receives the confirmed election result.

**Placeholders:** `{player}`, `{result}`

**Modes:** player

**Availability:** All eras; amateur or college pathway enabled; institution rules apply; public disclosure is optional.

**Required state:** campus.student_club_election.status; campus.student_club_election.decision; campus.student_club_election.public_disclosure; campus_relationships; residence_assignment; amateur_path

**Consequences:** Add club responsibilities if elected; record civic engagement outcome.

**Media examples:**

- {player}'s student-club election ends with {result}.
- The campus ballot delivers {result} for {player}.
- Basketball fame does not replace the vote in {player}'s club race.

### `campus.campus_radio_shift`

**Trigger:** Player volunteers for a scheduled student-radio slot and completes the first broadcast.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; amateur or college pathway enabled; institution rules apply; public disclosure is optional.

**Required state:** campus.campus_radio_shift.status; campus.campus_radio_shift.decision; campus.campus_radio_shift.public_disclosure; campus_relationships; residence_assignment; amateur_path

**Consequences:** Create regular media activity and on-air experience.

**Media examples:**

- {player} completes his first campus-radio shift.
- The microphone belongs to {player} for a different reason.
- Student radio puts {player} on the air.

### `campus.exchange_term_approved`

**Trigger:** Institution approves player's educational exchange term and the career schedule explicitly permits participation.

**Placeholders:** `{destination}`, `{player}`, `{school}`

**Modes:** player

**Availability:** All eras; amateur or college pathway enabled; institution rules apply; public disclosure is optional.

**Required state:** campus.exchange_term_approved.status; campus.exchange_term_approved.decision; campus.exchange_term_approved.public_disclosure; campus_relationships; residence_assignment; amateur_path

**Consequences:** Open exchange location and temporarily replace campus routine.

**Media examples:**

- {player} receives approval for an exchange term in {destination}.
- A new campus becomes part of {player}'s education plan.
- {school} clear the educational exchange on {player}'s calendar.

### `campus.housing_lottery_result`

**Trigger:** Player enters the ordinary campus housing lottery without special treatment and receives a room allocation.

**Placeholders:** `{player}`, `{residence}`

**Modes:** player

**Availability:** All eras; amateur or college pathway enabled; institution rules apply; public disclosure is optional.

**Required state:** campus.housing_lottery_result.status; campus.housing_lottery_result.decision; campus.housing_lottery_result.public_disclosure; campus_relationships; residence_assignment; amateur_path

**Consequences:** Change housing location, commute and roommate opportunities.

**Media examples:**

- {player}'s housing lottery assigns {residence}.
- The campus draw, rather than the roster, decides {player}'s room.
- A housing allocation gives {player} a new campus address.

### `campus.study_group_boundary`

**Trigger:** Player asks a study group to prohibit sharing private basketball information and the group accepts the rule.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; amateur or college pathway enabled; institution rules apply; public disclosure is optional.

**Required state:** campus.study_group_boundary.status; campus.study_group_boundary.decision; campus.study_group_boundary.public_disclosure; campus_relationships; residence_assignment; amateur_path

**Consequences:** Create information boundary and preserve academic relationship.

**Media examples:**

- {player}'s study group agrees to keep basketball confidences private.
- Coursework stays coursework under {player}'s new group rule.
- The study table is not a scouting desk for {player}.

### `campus.intramural_spectator_role`

**Trigger:** Player opts to support a recreational campus team as a spectator instead of entering as a participant.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; amateur or college pathway enabled; institution rules apply; public disclosure is optional.

**Required state:** campus.intramural_spectator_role.status; campus.intramural_spectator_role.decision; campus.intramural_spectator_role.public_disclosure; campus_relationships; residence_assignment; amateur_path

**Consequences:** Build campus relationships without changing amateur competition eligibility.

**Media examples:**

- {player} takes a seat as a campus spectator.
- For once, the campus game asks {player} only to cheer.
- The recreational team gets support from {player}, not a roster addition.

### `campus.student_orientation_guide`

**Trigger:** Player completes an authorized orientation-guide shift for new students.

**Placeholders:** `{player}`, `{school}`

**Modes:** player

**Availability:** All eras; amateur or college pathway enabled; institution rules apply; public disclosure is optional.

**Required state:** campus.student_orientation_guide.status; campus.student_orientation_guide.decision; campus.student_orientation_guide.public_disclosure; campus_relationships; residence_assignment; amateur_path

**Consequences:** Add community belonging and a recurring campus obligation.

**Media examples:**

- {player} helps new students find their way around {school}.
- The campus map becomes {player}'s assignment.
- New arrivals meet {player} as an orientation guide.

### `campus.recruit_visit_host`

**Trigger:** Program appoints player to host a permitted campus visit and visitor completes it without player making unauthorized promises.

**Placeholders:** `{player}`, `{school}`, `{visitor}`

**Modes:** player

**Availability:** All eras; amateur or college pathway enabled; institution rules apply; public disclosure is optional.

**Required state:** campus.recruit_visit_host.status; campus.recruit_visit_host.decision; campus.recruit_visit_host.public_disclosure; campus_relationships; residence_assignment; amateur_path

**Consequences:** Build hosting reputation and record recruit relationship separately from commitment.

**Media examples:**

- {player} hosts {visitor}'s permitted campus visit.
- The tour ends without a commitment being assumed.
- {school} put {player} on welcome duty for {visitor}.

### `campus.amateur_roster_refusal`

**Trigger:** Player declines a formal amateur roster offer to continue a chosen education pathway without joining another team.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** All eras; amateur or college pathway enabled; institution rules apply; public disclosure is optional.

**Required state:** campus.amateur_roster_refusal.status; campus.amateur_roster_refusal.decision; campus.amateur_roster_refusal.public_disclosure; campus_relationships; residence_assignment; amateur_path

**Consequences:** Remove offered roster spot and preserve selected noncompetition route.

**Media examples:**

- {player} declines the roster offer from {team}.
- Education takes priority in {player}'s next chapter.
- The offered uniform stays unworn after {player}'s decision.

## 75. Household responsibilities and shared living

### `household.chore_rotation`

**Trigger:** Household members agree a recurring chore rotation and player accepts specified duties.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; relevant household relationship exists; shared stories require every affected person to consent.

**Required state:** household.chore_rotation.status; household.chore_rotation.decision; household.chore_rotation.public_disclosure; household_tasks; home_facilities; household_trust

**Consequences:** Create duty deadlines and change household reliability through completion.

**Media examples:**

- {player} joins a household chore rotation.
- The schedule at home has assignments for {player} too.
- Shared living gets a clearer division of work.

### `household.roommate_move_out`

**Trigger:** Roommate chooses to move out and player confirms the move without implying conflict or romance.

**Placeholders:** `{player}`, `{roommate}`

**Modes:** player

**Availability:** All eras; relevant household relationship exists; shared stories require every affected person to consent.

**Required state:** household.roommate_move_out.status; household.roommate_move_out.decision; household.roommate_move_out.public_disclosure; household_tasks; home_facilities; household_trust

**Consequences:** Remove cohabitation relationship and change home routine.

**Media examples:**

- {roommate} moves out of {player}'s shared home.
- The household changes without a feud being assumed.
- {player}'s home routine loses a familiar roommate.

### `household.guest_stay_limit`

**Trigger:** Player and household jointly set a maximum stay for invited guests and communicate it before visits.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; relevant household relationship exists; shared stories require every affected person to consent.

**Required state:** household.guest_stay_limit.status; household.guest_stay_limit.decision; household.guest_stay_limit.public_disclosure; household_tasks; home_facilities; household_trust

**Consequences:** Establish visitor boundary and affect hosting relationships.

**Media examples:**

- {player}'s household sets a clear guest-stay limit.
- The welcome mat now comes with an agreed timetable.
- Home gets a practical visitor boundary around {player}.

### `household.quiet_space_agreement`

**Trigger:** Player and cohabitants designate a shared-home quiet room with agreed access hours.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; relevant household relationship exists; shared stories require every affected person to consent.

**Required state:** household.quiet_space_agreement.status; household.quiet_space_agreement.decision; household.quiet_space_agreement.public_disclosure; household_tasks; home_facilities; household_trust

**Consequences:** Unlock private recovery/study space and constrain room access fairly.

**Media examples:**

- {player}'s household agrees a quiet-space schedule.
- One room gets a calmer purpose at home.
- The shared floor plan makes room for {player}'s study time.

### `household.relative_school_pickup`

**Trigger:** Player accepts an agreed recurring school pickup responsibility for a dependent relative and completes its first scheduled week.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; relevant household relationship exists; shared stories require every affected person to consent.

**Required state:** household.relative_school_pickup.status; household.relative_school_pickup.decision; household.relative_school_pickup.public_disclosure; household_tasks; home_facilities; household_trust

**Consequences:** Add recurring caregiving time and build household trust without identifying a child publicly.

**Media examples:**

- {player} completes an agreed family pickup routine.
- The family calendar gets a dependable contribution from {player}.
- A week of shared responsibility ends with the plan kept.

### `household.care_rotation_handoff`

**Trigger:** Player and consenting adult relatives agree a handoff of an existing caregiving shift without changing team practice availability.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; relevant household relationship exists; shared stories require every affected person to consent.

**Required state:** household.care_rotation_handoff.status; household.care_rotation_handoff.decision; household.care_rotation_handoff.public_disclosure; household_tasks; home_facilities; household_trust

**Consequences:** Reallocate caregiving duties and record family reciprocity.

**Media examples:**

- {player}'s family agree a new care-duty rotation.
- A shared responsibility changes hands under an agreed plan.
- The caregiving calendar gets a coordinated handoff.

### `household.homecoming_host`

**Trigger:** Player accepts responsibility for organizing an already planned family gathering and all invited guests confirm attendance choices.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; relevant household relationship exists; shared stories require every affected person to consent.

**Required state:** household.homecoming_host.status; household.homecoming_host.decision; household.homecoming_host.public_disclosure; household_tasks; home_facilities; household_trust

**Consequences:** Build hosting reliability and create preparation tasks.

**Media examples:**

- {player} takes charge of the family gathering.
- The basketball calendar now shares space with hosting duties.
- A family occasion has {player} handling the arrangements.

### `household.shared_meal_pact`

**Trigger:** Household voluntarily agrees a recurring shared-meal night and completes the first month with attendance logged.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; relevant household relationship exists; shared stories require every affected person to consent.

**Required state:** household.shared_meal_pact.status; household.shared_meal_pact.decision; household.shared_meal_pact.public_disclosure; household_tasks; home_facilities; household_trust

**Consequences:** Increase household connection; create recurring time obligation.

**Media examples:**

- {player}'s household keeps its shared-meal agreement.
- A regular table becomes part of {player}'s home routine.
- The first month of planned meals brings the household together.

### `household.personal_room_repurpose`

**Trigger:** Household consents to convert player's unused hobby room into communal space.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; relevant household relationship exists; shared stories require every affected person to consent.

**Required state:** household.personal_room_repurpose.status; household.personal_room_repurpose.decision; household.personal_room_repurpose.public_disclosure; household_tasks; home_facilities; household_trust

**Consequences:** Change home facilities and trade private hobby access for shared benefit.

**Media examples:**

- {player}'s unused room becomes shared household space.
- A personal corner gets a collective purpose.
- The home layout changes with the household's agreement.

### `household.family_archive_sort`

**Trigger:** Player and consenting relatives complete a project to organize family photographs without publicly sharing private material.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; relevant household relationship exists; shared stories require every affected person to consent.

**Required state:** household.family_archive_sort.status; household.family_archive_sort.decision; household.family_archive_sort.public_disclosure; household_tasks; home_facilities; household_trust

**Consequences:** Create personal memory archive and deepen family connection.

**Media examples:**

- {player} helps organize the family archive.
- The photographs find order without losing their privacy.
- A shared project gives {player}'s household its history back in sequence.

## 76. Friendship, reciprocity and social boundaries

### `friendship.old_friend_visit`

**Trigger:** Player accepts a planned visit from an established friend during free time and completes it without a commercial appearance.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; established friendship state; public statements need consent; no invented private revelations.

**Required state:** friendship.old_friend_visit.status; friendship.old_friend_visit.decision; friendship.old_friend_visit.public_disclosure; friendship_closeness; social_commitments; access_boundaries

**Consequences:** Refresh friendship closeness and use leisure time.

**Media examples:**

- {player} makes time for an old friend.
- The visit is personal rather than promotional.
- A familiar friendship gets a place on {player}'s calendar.

### `friendship.group_trip_choice`

**Trigger:** Player declines an optional friend-group trip to honor an existing commitment and explains the choice privately.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; established friendship state; public statements need consent; no invented private revelations.

**Required state:** friendship.group_trip_choice.status; friendship.group_trip_choice.decision; friendship.group_trip_choice.public_disclosure; friendship_closeness; social_commitments; access_boundaries

**Consequences:** Preserve prior commitment while lowering shared-trip participation.

**Media examples:**

- {player} passes on the group trip.
- An existing promise takes priority over the invitation.
- The travel plan goes ahead without {player}.

### `friendship.nonbasketball_pact`

**Trigger:** Player and friends agree a recurring gathering where basketball discussion is voluntarily excluded.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; established friendship state; public statements need consent; no invented private revelations.

**Required state:** friendship.nonbasketball_pact.status; friendship.nonbasketball_pact.decision; friendship.nonbasketball_pact.public_disclosure; friendship_closeness; social_commitments; access_boundaries

**Consequences:** Build noncareer identity and set social boundary.

**Media examples:**

- {player}'s friends agree to leave basketball outside one gathering.
- The game gets a night off in {player}'s social circle.
- A shared boundary creates room for other conversations.

### `friendship.friend_project_help`

**Trigger:** Player completes a promised nonfinancial task for a friend's independently run creative project.

**Placeholders:** `{friend}`, `{player}`

**Modes:** player

**Availability:** All eras; established friendship state; public statements need consent; no invented private revelations.

**Required state:** friendship.friend_project_help.status; friendship.friend_project_help.decision; friendship.friend_project_help.public_disclosure; friendship_closeness; social_commitments; access_boundaries

**Consequences:** Build reliability and deepen reciprocal relationship.

**Media examples:**

- {player} keeps a promise on {friend}'s project.
- The help arrives as work rather than a cheque.
- A friend's project gets the contribution {player} agreed to provide.

### `friendship.apology_accepted`

**Trigger:** Following a recorded scheduling disappointment, player offers a private apology and friend explicitly accepts it; both consent to any public mention.

**Placeholders:** `{friend}`, `{player}`

**Modes:** player

**Availability:** All eras; established friendship state; public statements need consent; no invented private revelations.

**Required state:** friendship.apology_accepted.status; friendship.apology_accepted.decision; friendship.apology_accepted.public_disclosure; friendship_closeness; social_commitments; access_boundaries

**Consequences:** Resolve specific relationship tension without erasing trust history.

**Media examples:**

- {player} and {friend} resolve a scheduling disagreement.
- An accepted apology opens a better conversation.
- The friendship gets a clear repair, not a guessed reconciliation.

### `friendship.group_host_rotation`

**Trigger:** Player and friends agree to rotate hosting rather than relying on his fame or home every time.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; established friendship state; public statements need consent; no invented private revelations.

**Required state:** friendship.group_host_rotation.status; friendship.group_host_rotation.decision; friendship.group_host_rotation.public_disclosure; friendship_closeness; social_commitments; access_boundaries

**Consequences:** Distribute planning obligations and improve peer equality.

**Media examples:**

- {player}'s friend group agrees to share hosting duties.
- The gathering has more than one organizer now.
- A rotation takes the social workload off a single person.

### `friendship.childhood_reunion_declined`

**Trigger:** Player declines a nostalgic reunion invitation after deciding he does not want to reopen that social chapter.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; established friendship state; public statements need consent; no invented private revelations.

**Required state:** friendship.childhood_reunion_declined.status; friendship.childhood_reunion_declined.decision; friendship.childhood_reunion_declined.public_disclosure; friendship_closeness; social_commitments; access_boundaries

**Consequences:** Close optional reunion branch and preserve privacy boundary.

**Media examples:**

- {player} declines the reunion invitation.
- An old chapter stays closed by choice.
- The familiar invitation does not become a new commitment.

### `friendship.new_city_peer_circle`

**Trigger:** Player joins an ordinary local hobby group and completes the membership introduction process without celebrity privileges.

**Placeholders:** `{city}`, `{player}`

**Modes:** player

**Availability:** All eras; established friendship state; public statements need consent; no invented private revelations.

**Required state:** friendship.new_city_peer_circle.status; friendship.new_city_peer_circle.decision; friendship.new_city_peer_circle.public_disclosure; friendship_closeness; social_commitments; access_boundaries

**Consequences:** Unlock new local friendships outside team and fan relationships.

**Media examples:**

- {player} joins a local peer group in {city}.
- A new city offers company beyond the roster.
- The introduction begins with shared interests rather than highlights.

### `friendship.friend_milestone_attendance`

**Trigger:** Player attends a consenting adult friend's announced personal milestone event after securing a free calendar slot.

**Placeholders:** `{friend}`, `{player}`

**Modes:** player

**Availability:** All eras; established friendship state; public statements need consent; no invented private revelations.

**Required state:** friendship.friend_milestone_attendance.status; friendship.friend_milestone_attendance.decision; friendship.friend_milestone_attendance.public_disclosure; friendship_closeness; social_commitments; access_boundaries

**Consequences:** Increase friendship investment and consume leisure time.

**Media examples:**

- {player} makes time for {friend}'s milestone celebration.
- The occasion belongs to a friend, and {player} shows up.
- A personal invitation receives a kept commitment.

### `friendship.inner_circle_redefined`

**Trigger:** Player individually informs friends of a mutually agreed smaller private travel circle without accusing excluded people of wrongdoing.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; established friendship state; public statements need consent; no invented private revelations.

**Required state:** friendship.inner_circle_redefined.status; friendship.inner_circle_redefined.decision; friendship.inner_circle_redefined.public_disclosure; friendship_closeness; social_commitments; access_boundaries

**Consequences:** Change travel access and record relationship reactions.

**Media examples:**

- {player} changes the size of his private travel circle.
- A smaller guest list sets a new personal boundary.
- Access changes without a public accusation against anyone.

## 77. Mentorship across generations

### `mentorship.offcourt_mentor_selected`

**Trigger:** Player chooses a consenting retired professional as an off-court decision mentor with agreed meeting frequency.

**Placeholders:** `{mentor}`, `{player}`

**Modes:** player

**Availability:** All eras; consenting adult mentor relationships; no training-stat events; protect private advice.

**Required state:** mentorship.offcourt_mentor_selected.status; mentorship.offcourt_mentor_selected.decision; mentorship.offcourt_mentor_selected.public_disclosure; mentor_relationships; advice_permissions; meeting_schedule

**Consequences:** Add mentor relationship and recurring reflection meetings.

**Media examples:**

- {player} chooses {mentor} as an off-court mentor.
- The career gets a sounding board beyond the team staff.
- An agreed mentorship gives {player} a regular place to think.

### `mentorship.reverse_tech_lesson`

**Trigger:** Player teaches a consenting older mentor a specific noncompetitive digital task and mentor confirms completion.

**Placeholders:** `{mentor}`, `{player}`, `{task}`

**Modes:** player

**Availability:** All eras; consenting adult mentor relationships; no training-stat events; protect private advice.

**Required state:** mentorship.reverse_tech_lesson.status; mentorship.reverse_tech_lesson.decision; mentorship.reverse_tech_lesson.public_disclosure; mentor_relationships; advice_permissions; meeting_schedule

**Consequences:** Build reciprocal mentorship and verified technology capability.

**Media examples:**

- {player} helps {mentor} master {task}.
- The usual advice route runs in the other direction.
- The mentor finishes the lesson as the learner.

### `mentorship.advice_declined_respectfully`

**Trigger:** Player explicitly declines a mentor's proposed life decision while both agree to continue the relationship.

**Placeholders:** `{mentor}`, `{player}`

**Modes:** player

**Availability:** All eras; consenting adult mentor relationships; no training-stat events; protect private advice.

**Required state:** mentorship.advice_declined_respectfully.status; mentorship.advice_declined_respectfully.decision; mentorship.advice_declined_respectfully.public_disclosure; mentor_relationships; advice_permissions; meeting_schedule

**Consequences:** Record autonomous choice and preserve mentorship with updated expectations.

**Media examples:**

- {player} takes a different path from {mentor}'s advice.
- The disagreement leaves the mentorship intact.
- An independent decision does not require a broken relationship.

### `mentorship.mentor_retreat`

**Trigger:** Player and mentor complete a preplanned nontraining reflection retreat during permitted free time.

**Placeholders:** `{mentor}`, `{player}`

**Modes:** player

**Availability:** All eras; consenting adult mentor relationships; no training-stat events; protect private advice.

**Required state:** mentorship.mentor_retreat.status; mentorship.mentor_retreat.decision; mentorship.mentor_retreat.public_disclosure; mentor_relationships; advice_permissions; meeting_schedule

**Consequences:** Refresh long-term priorities and use leisure window.

**Media examples:**

- {player} completes a reflection retreat with {mentor}.
- The career plan gets a quieter setting.
- Time away is used to examine the next direction.

### `mentorship.peer_buddy_match`

**Trigger:** Team formally pairs player with a consenting newcomer for practical off-court orientation, not coaching or playing-time influence.

**Placeholders:** `{newcomer}`, `{player}`, `{team}`

**Modes:** player

**Availability:** All eras; consenting adult mentor relationships; no training-stat events; protect private advice.

**Required state:** mentorship.peer_buddy_match.status; mentorship.peer_buddy_match.decision; mentorship.peer_buddy_match.public_disclosure; mentor_relationships; advice_permissions; meeting_schedule

**Consequences:** Create buddy duties and newcomer relationship.

**Media examples:**

- {player} becomes {newcomer}'s off-court orientation partner.
- The new arrival gets a practical guide to team life.
- {team} assign a welcome role rather than a coaching role.

### `mentorship.boundaries_reset`

**Trigger:** Mentor and player mutually agree to stop discussing a previously contentious personal topic while continuing other meetings.

**Placeholders:** `{mentor}`, `{player}`

**Modes:** player

**Availability:** All eras; consenting adult mentor relationships; no training-stat events; protect private advice.

**Required state:** mentorship.boundaries_reset.status; mentorship.boundaries_reset.decision; mentorship.boundaries_reset.public_disclosure; mentor_relationships; advice_permissions; meeting_schedule

**Consequences:** Update advice-topic permissions and reduce relationship friction.

**Media examples:**

- {player} and {mentor} reset their advice boundaries.
- One subject leaves the agenda without ending the relationship.
- The mentorship continues under a clearer agreement.

### `mentorship.formal_program_completed`

**Trigger:** Player completes a nonprofit adult mentorship curriculum based on documented attendance and assignments.

**Placeholders:** `{player}`, `{program}`

**Modes:** player

**Availability:** All eras; consenting adult mentor relationships; no training-stat events; protect private advice.

**Required state:** mentorship.formal_program_completed.status; mentorship.formal_program_completed.decision; mentorship.formal_program_completed.public_disclosure; mentor_relationships; advice_permissions; meeting_schedule

**Consequences:** Unlock verified mentor qualification for nonbasketball program.

**Media examples:**

- {player} completes {program}'s mentorship curriculum.
- The mentoring role gains a formal foundation.
- Attendance and assignments put the completion on record.

### `mentorship.mentee_independence`

**Trigger:** Adult mentee tells player they no longer need regular guidance and both agree to close scheduled mentorship.

**Placeholders:** `{mentee}`, `{player}`

**Modes:** player

**Availability:** All eras; consenting adult mentor relationships; no training-stat events; protect private advice.

**Required state:** mentorship.mentee_independence.status; mentorship.mentee_independence.decision; mentorship.mentee_independence.public_disclosure; mentor_relationships; advice_permissions; meeting_schedule

**Consequences:** End recurring duty with successful independence outcome.

**Media examples:**

- {mentee} completes the regular mentorship with {player}.
- The meetings end because independence has grown.
- A mentoring relationship closes on its own agreed terms.

### `mentorship.multi_mentor_conflict`

**Trigger:** Player receives incompatible documented advice from two consenting mentors and chooses one plan after clarifying priorities.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; consenting adult mentor relationships; no training-stat events; protect private advice.

**Required state:** mentorship.multi_mentor_conflict.status; mentorship.multi_mentor_conflict.decision; mentorship.multi_mentor_conflict.public_disclosure; mentor_relationships; advice_permissions; meeting_schedule

**Consequences:** Record chosen decision path and both mentor relationship responses.

**Media examples:**

- {player} chooses a direction after conflicting advice.
- Two perspectives lead to one deliberate decision.
- The mentors disagree; {player} still has to choose.

### `mentorship.thank_you_private`

**Trigger:** Player delivers a promised private thank-you project to a mentor and refuses an optional publicity rollout.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; consenting adult mentor relationships; no training-stat events; protect private advice.

**Required state:** mentorship.thank_you_private.status; mentorship.thank_you_private.decision; mentorship.thank_you_private.public_disclosure; mentor_relationships; advice_permissions; meeting_schedule

**Consequences:** Increase personal gratitude state while leaving public visibility unchanged.

**Media examples:**

- {player} keeps his mentor tribute private.
- The thank-you reaches its recipient without a campaign.
- A personal gesture stays personal by design.

## 78. Partnership choices and shared priorities

### `partnership.shared_calendar`

**Trigger:** Player and partner establish a shared calendar with protected personal dates and both agree its first month.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; consenting adult partner exists; no assumed partner gender; private relationship events remain private unless both opt in.

**Required state:** partnership.shared_calendar.status; partnership.shared_calendar.decision; partnership.shared_calendar.public_disclosure; partnership_status; shared_commitments; relationship_boundaries

**Consequences:** Create mutual commitments and relationship reliability checks.

**Media examples:**

- {player} and his partner agree a shared calendar.
- Personal time gets a place beside basketball time.
- The relationship receives a practical scheduling plan.

### `partnership.public_visibility_choice`

**Trigger:** Player and partner jointly choose not to attend public events together for a defined period without separating.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; consenting adult partner exists; no assumed partner gender; private relationship events remain private unless both opt in.

**Required state:** partnership.public_visibility_choice.status; partnership.public_visibility_choice.decision; partnership.public_visibility_choice.public_disclosure; partnership_status; shared_commitments; relationship_boundaries

**Consequences:** Change joint-appearance permission while preserving partnership status.

**Media examples:**

- {player} and his partner choose a quieter public profile.
- Fewer joint appearances do not mean a breakup.
- The couple set a public-visibility boundary together.

### `partnership.professional_independence`

**Trigger:** Player and partner explicitly separate their professional representation and stop using a shared public profile.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; consenting adult partner exists; no assumed partner gender; private relationship events remain private unless both opt in.

**Required state:** partnership.professional_independence.status; partnership.professional_independence.decision; partnership.professional_independence.public_disclosure; partnership_status; shared_commitments; relationship_boundaries

**Consequences:** Create independent career permissions and reduce intertwined appearance obligations.

**Media examples:**

- {player} and his partner separate their professional profiles.
- Shared life no longer means shared representation.
- The relationship stays intact while career boundaries change.

### `partnership.anniversary_reschedule`

**Trigger:** Player and partner jointly move a planned anniversary celebration around a fixed work obligation and complete the replacement date.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; consenting adult partner exists; no assumed partner gender; private relationship events remain private unless both opt in.

**Required state:** partnership.anniversary_reschedule.status; partnership.anniversary_reschedule.decision; partnership.anniversary_reschedule.public_disclosure; partnership_status; shared_commitments; relationship_boundaries

**Consequences:** Resolve schedule conflict and record kept replacement promise.

**Media examples:**

- {player} and his partner keep their rescheduled celebration.
- A changed date does not become a lost promise.
- The anniversary plan finds its agreed second slot.

### `partnership.future_home_deadlock`

**Trigger:** Player and partner formally pause a shared future-home decision after stating incompatible location preferences.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; consenting adult partner exists; no assumed partner gender; private relationship events remain private unless both opt in.

**Required state:** partnership.future_home_deadlock.status; partnership.future_home_deadlock.decision; partnership.future_home_deadlock.public_disclosure; partnership_status; shared_commitments; relationship_boundaries

**Consequences:** Create unresolved planning branch and negotiation deadline without automatic breakup.

**Media examples:**

- {player} and his partner pause their future-home decision.
- Two preferred locations leave one plan unresolved.
- The home question stays open by mutual acknowledgment.

### `partnership.separate_hobby_weekend`

**Trigger:** Player and partner agree an occasional independent hobby weekend and both complete separate plans.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; consenting adult partner exists; no assumed partner gender; private relationship events remain private unless both opt in.

**Required state:** partnership.separate_hobby_weekend.status; partnership.separate_hobby_weekend.decision; partnership.separate_hobby_weekend.public_disclosure; partnership_status; shared_commitments; relationship_boundaries

**Consequences:** Increase personal autonomy while tracking agreed relationship time.

**Media examples:**

- {player} and his partner try a weekend of separate interests.
- The plans diverge without the relationship doing so.
- Independent hobbies get space in a shared life.

### `partnership.support_project_repaid`

**Trigger:** After partner supported a recorded career milestone, player completes a promised practical role on partner's noncommercial project.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; consenting adult partner exists; no assumed partner gender; private relationship events remain private unless both opt in.

**Required state:** partnership.support_project_repaid.status; partnership.support_project_repaid.decision; partnership.support_project_repaid.public_disclosure; partnership_status; shared_commitments; relationship_boundaries

**Consequences:** Increase reciprocity and consume free-time commitments.

**Media examples:**

- {player} returns support through his partner's project.
- The promise becomes a completed contribution.
- A shared relationship gets a two-way investment of time.

### `partnership.interview_boundary`

**Trigger:** Player and partner jointly decline questions about future relationship plans while permitting discussion of current public projects.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; consenting adult partner exists; no assumed partner gender; private relationship events remain private unless both opt in.

**Required state:** partnership.interview_boundary.status; partnership.interview_boundary.decision; partnership.interview_boundary.public_disclosure; partnership_status; shared_commitments; relationship_boundaries

**Consequences:** Update interview permissions and protect shared decisions.

**Media examples:**

- {player} and his partner set a boundary on future-plan questions.
- The public projects remain open; private plans stay private.
- The interview agreement draws a clear line together.

### `partnership.home_role_negotiation`

**Trigger:** Player and partner replace an informal division of household responsibilities with a mutually accepted written plan.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; consenting adult partner exists; no assumed partner gender; private relationship events remain private unless both opt in.

**Required state:** partnership.home_role_negotiation.status; partnership.home_role_negotiation.decision; partnership.home_role_negotiation.public_disclosure; partnership_status; shared_commitments; relationship_boundaries

**Consequences:** Rebalance domestic workload and schedule recurring duties.

**Media examples:**

- {player} and his partner agree a new division of household work.
- A shared home gets clearer responsibilities.
- The arrangement changes through agreement rather than assumption.

### `partnership.breakup_mutual_statement`

**Trigger:** Unmarried player and consenting adult partner end their relationship and jointly authorize a neutral statement; no divorce trigger applies.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; consenting adult partner exists; no assumed partner gender; private relationship events remain private unless both opt in.

**Required state:** partnership.breakup_mutual_statement.status; partnership.breakup_mutual_statement.decision; partnership.breakup_mutual_statement.public_disclosure; partnership_status; shared_commitments; relationship_boundaries

**Consequences:** Set partnership ended and revoke future joint-appearance bookings.

**Media examples:**

- {player} and his partner announce their relationship has ended.
- The joint statement confirms the separation without assigning blame.
- Future plans change after a mutually acknowledged breakup.

## 79. Personal identity and noncommercial self-expression

### `identity.pronunciation_guide`

**Trigger:** Player publishes an approved pronunciation guide for his own name and asks announcers to use it.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras except where noted; player-authorized statements only; no automatic assumptions about identity or background.

**Required state:** identity.pronunciation_guide.status; identity.pronunciation_guide.decision; identity.pronunciation_guide.public_disclosure; chosen_public_labels; profile_permissions; personal_goals

**Consequences:** Update pronunciation record and track presentation compliance.

**Media examples:**

- {player} publishes the pronunciation he wants used.
- The introduction gets an answer directly from its subject.
- The name guide gives announcers a clearer standard.

### `identity.chosen_nickname`

**Trigger:** Player adopts an original nonoffensive nickname for optional public appearances and explicitly requests its use.

**Placeholders:** `{nickname}`, `{player}`

**Modes:** player

**Availability:** All eras except where noted; player-authorized statements only; no automatic assumptions about identity or background.

**Required state:** identity.chosen_nickname.status; identity.chosen_nickname.decision; identity.chosen_nickname.public_disclosure; chosen_public_labels; profile_permissions; personal_goals

**Consequences:** Store chosen nickname and toggle permitted presentation usage.

**Media examples:**

- {player} adopts the nickname {nickname}.
- A chosen name joins the public introduction.
- The new nickname comes from {player}, not the rumor mill.

### `identity.nickname_retired`

**Trigger:** Player explicitly stops using a previously adopted nickname and asks the club to remove it from presentation material.

**Placeholders:** `{nickname}`, `{player}`

**Modes:** player

**Availability:** All eras except where noted; player-authorized statements only; no automatic assumptions about identity or background.

**Required state:** identity.nickname_retired.status; identity.nickname_retired.decision; identity.nickname_retired.public_disclosure; chosen_public_labels; profile_permissions; personal_goals

**Consequences:** Disable old nickname display without deleting its career history.

**Media examples:**

- {player} retires the nickname {nickname}.
- The old label leaves the current introduction.
- A familiar nickname becomes part of the past.

### `identity.public_values_statement`

**Trigger:** Player publishes a self-authored account of a personal nonpartisan value after approving the full text.

**Placeholders:** `{player}`, `{value}`

**Modes:** player

**Availability:** All eras except where noted; player-authorized statements only; no automatic assumptions about identity or background.

**Required state:** identity.public_values_statement.status; identity.public_values_statement.decision; identity.public_values_statement.public_disclosure; chosen_public_labels; profile_permissions; personal_goals

**Consequences:** Add declared value and enable future consistency questions without assuming conduct.

**Media examples:**

- {player} shares why {value} matters to him.
- The public statement gives a value his own words.
- A personal principle becomes part of the approved profile.

### `identity.noncareer_introduction`

**Trigger:** Player asks an event host to introduce his nonbasketball work first and the host follows the request.

**Placeholders:** `{event}`, `{player}`

**Modes:** player

**Availability:** All eras except where noted; player-authorized statements only; no automatic assumptions about identity or background.

**Required state:** identity.noncareer_introduction.status; identity.noncareer_introduction.decision; identity.noncareer_introduction.public_disclosure; chosen_public_labels; profile_permissions; personal_goals

**Consequences:** Change event presentation priority and strengthen noncareer identity.

**Media examples:**

- {player} chooses a different first line for his introduction.
- Basketball takes the second sentence at {event}.
- The host leads with the work {player} requested.

### `identity.style_signature_abandoned`

**Trigger:** Player stops using a previously documented harmless signature outfit or accessory by choice.

**Placeholders:** `{item}`, `{player}`

**Modes:** player

**Availability:** All eras except where noted; player-authorized statements only; no automatic assumptions about identity or background.

**Required state:** identity.style_signature_abandoned.status; identity.style_signature_abandoned.decision; identity.style_signature_abandoned.public_disclosure; chosen_public_labels; profile_permissions; personal_goals

**Consequences:** Disable recurring style cue and create fan reaction branch.

**Media examples:**

- {player} retires his familiar {item}.
- The signature look changes by choice.
- A recognizable accessory leaves {player}'s routine.

### `identity.handwritten_manifesto`

**Trigger:** Player finishes an original handwritten personal goals document and elects to show selected nonprivate passages.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras except where noted; player-authorized statements only; no automatic assumptions about identity or background.

**Required state:** identity.handwritten_manifesto.status; identity.handwritten_manifesto.decision; identity.handwritten_manifesto.public_disclosure; chosen_public_labels; profile_permissions; personal_goals

**Consequences:** Create explicit goals and public knowledge limited to approved excerpts.

**Media examples:**

- {player} shares selected passages from his goals notebook.
- The handwriting makes the priorities personal.
- Only the approved pages enter the public conversation.

### `identity.heritage_story_approved`

**Trigger:** Player and relevant relatives approve a specific family-history story for an official profile; all details come from verified saved state.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras except where noted; player-authorized statements only; no automatic assumptions about identity or background.

**Required state:** identity.heritage_story_approved.status; identity.heritage_story_approved.decision; identity.heritage_story_approved.public_disclosure; chosen_public_labels; profile_permissions; personal_goals

**Consequences:** Unlock heritage profile while preserving unapproved family details.

**Media examples:**

- {player} approves a family-history chapter for his profile.
- The story reaches the public with the family's consent.
- An authorized heritage account adds context to the career.

### `identity.public_label_declined`

**Trigger:** Player explicitly declines a media-imposed personal label without disclosing any alternative private identity.

**Placeholders:** `{label}`, `{player}`

**Modes:** player

**Availability:** All eras except where noted; player-authorized statements only; no automatic assumptions about identity or background.

**Required state:** identity.public_label_declined.status; identity.public_label_declined.decision; identity.public_label_declined.public_disclosure; chosen_public_labels; profile_permissions; personal_goals

**Consequences:** Record rejected label and guide future media wording.

**Media examples:**

- {player} asks reporters to stop using {label}.
- The public label loses the subject's consent.
- A clearer boundary changes how {player} wants to be described.

### `identity.authored_biography_control`

**Trigger:** Player reviews an authorized biographical profile and refuses publication until specified factual changes are made; publisher accepts revisions.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras except where noted; player-authorized statements only; no automatic assumptions about identity or background.

**Required state:** identity.authored_biography_control.status; identity.authored_biography_control.decision; identity.authored_biography_control.public_disclosure; chosen_public_labels; profile_permissions; personal_goals

**Consequences:** Correct biography source and add approval workflow.

**Media examples:**

- {player}'s authorized profile waits for factual revisions.
- The subject asks the biography to get the details right.
- The publisher agrees to correct the approved life account.

## 80. Art, performance and creative projects

### `creative.gallery_opening`

**Trigger:** A curated gallery accepts player's original visual artworks and completes the announced exhibition opening.

**Placeholders:** `{gallery}`, `{player}`

**Modes:** player

**Availability:** All eras; permitted free time; invented works only; modern digital formats gated by era.

**Required state:** creative.gallery_opening.status; creative.gallery_opening.decision; creative.gallery_opening.public_disclosure; creative_credits; project_progress; creative_collaborators

**Consequences:** Unlock artist recognition and exhibition follow-ups.

**Media examples:**

- {player}'s artwork opens at {gallery}.
- The career gets a wall outside the arena.
- A curated exhibition puts {player}'s creative work on display.

### `creative.stage_audition_rejection`

**Trigger:** Player auditions for a fictional stage production and receives a confirmed rejection without role or performance assumptions.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; permitted free time; invented works only; modern digital formats gated by era.

**Required state:** creative.stage_audition_rejection.status; creative.stage_audition_rejection.decision; creative.stage_audition_rejection.public_disclosure; creative_credits; project_progress; creative_collaborators

**Consequences:** Close offered role branch and record artistic setback.

**Media examples:**

- {player}'s stage audition ends without a role.
- The casting decision sends the project in another direction.
- The theater dream meets a real audition result.

### `creative.stage_debut_completed`

**Trigger:** Player completes a credited role in a fictional stage performance after approved rehearsal attendance.

**Placeholders:** `{player}`, `{production}`

**Modes:** player

**Availability:** All eras; permitted free time; invented works only; modern digital formats gated by era.

**Required state:** creative.stage_debut_completed.status; creative.stage_debut_completed.decision; creative.stage_debut_completed.public_disclosure; creative_credits; project_progress; creative_collaborators

**Consequences:** Unlock stage credits and future audition opportunities.

**Media examples:**

- {player} completes his debut in {production}.
- The stage appearance moves from rehearsal to a credited performance.
- A different kind of audience sees {player} finish the role.

### `creative.poetry_reading`

**Trigger:** Player reads original approved poems at an organized noncommercial event and completes the program.

**Placeholders:** `{event}`, `{player}`

**Modes:** player

**Availability:** All eras; permitted free time; invented works only; modern digital formats gated by era.

**Required state:** creative.poetry_reading.status; creative.poetry_reading.decision; creative.poetry_reading.public_disclosure; creative_credits; project_progress; creative_collaborators

**Consequences:** Build writing identity and event-host relationship.

**Media examples:**

- {player} reads his own poetry at {event}.
- The microphone carries verse rather than basketball answers.
- An original reading gives {player} a different public voice.

### `creative.film_edit_locked`

**Trigger:** Player finishes editing an independently created short film and submits a locked version to a permitted fictional festival.

**Placeholders:** `{festival}`, `{film}`, `{player}`

**Modes:** player

**Availability:** All eras; permitted free time; invented works only; modern digital formats gated by era.

**Required state:** creative.film_edit_locked.status; creative.film_edit_locked.decision; creative.film_edit_locked.public_disclosure; creative_credits; project_progress; creative_collaborators

**Consequences:** Create completed film artifact and pending selection outcome.

**Media examples:**

- {player} submits {film} to {festival}.
- The short film leaves the editing room for a selection process.
- A finished cut gives the project a real next step.

### `creative.festival_selection`

**Trigger:** Fictional festival formally selects player's previously submitted original film, without implying award or commercial return.

**Placeholders:** `{festival}`, `{film}`, `{player}`

**Modes:** player

**Availability:** All eras; permitted free time; invented works only; modern digital formats gated by era.

**Required state:** creative.festival_selection.status; creative.festival_selection.decision; creative.festival_selection.public_disclosure; creative_credits; project_progress; creative_collaborators

**Consequences:** Unlock screening event and artistic visibility.

**Media examples:**

- {festival} select {player}'s film {film}.
- The submitted project earns a place in the program.
- Selection gives the finished film an audience, not an automatic trophy.

### `creative.band_rehearsal_commitment`

**Trigger:** Player joins a fictional amateur music ensemble and completes its agreed rehearsal attendance window.

**Placeholders:** `{ensemble}`, `{player}`

**Modes:** player

**Availability:** All eras; permitted free time; invented works only; modern digital formats gated by era.

**Required state:** creative.band_rehearsal_commitment.status; creative.band_rehearsal_commitment.decision; creative.band_rehearsal_commitment.public_disclosure; creative_credits; project_progress; creative_collaborators

**Consequences:** Create ensemble membership and recurring leisure commitment.

**Media examples:**

- {player} completes his first rehearsal run with {ensemble}.
- The new team uses instruments rather than a basketball.
- An agreed music commitment makes it through the calendar.

### `creative.writing_manuscript_finished`

**Trigger:** Player completes a self-authored fiction manuscript without selling it or claiming publication.

**Placeholders:** `{player}`, `{title}`

**Modes:** player

**Availability:** All eras; permitted free time; invented works only; modern digital formats gated by era.

**Required state:** creative.writing_manuscript_finished.status; creative.writing_manuscript_finished.decision; creative.writing_manuscript_finished.public_disclosure; creative_credits; project_progress; creative_collaborators

**Consequences:** Unlock submission or private-archive choices.

**Media examples:**

- {player} finishes the manuscript for {title}.
- The last page turns a side project into a completed draft.
- A fictional story reaches its first full ending.

### `creative.public_art_collaboration`

**Trigger:** Player and consenting professional artist finish an authorized temporary public installation using a preapproved plan.

**Placeholders:** `{artist}`, `{installation}`, `{player}`

**Modes:** player

**Availability:** All eras; permitted free time; invented works only; modern digital formats gated by era.

**Required state:** creative.public_art_collaboration.status; creative.public_art_collaboration.decision; creative.public_art_collaboration.public_disclosure; creative_credits; project_progress; creative_collaborators

**Consequences:** Unlock artistic collaborator relationship and display duration.

**Media examples:**

- {player} and {artist} complete {installation}.
- The approved design takes its place in public space.
- A collaboration finishes beyond the basketball floor.

### `creative.comedy_open_mic`

**Trigger:** Player voluntarily completes a scheduled fictional open-mic set and organizer records the performance; audience response simulated separately.

**Placeholders:** `{player}`, `{venue}`

**Modes:** player

**Availability:** All eras; permitted free time; invented works only; modern digital formats gated by era.

**Required state:** creative.comedy_open_mic.status; creative.comedy_open_mic.decision; creative.comedy_open_mic.public_disclosure; creative_credits; project_progress; creative_collaborators

**Consequences:** Add performance experience and optional audience feedback.

**Media examples:**

- {player} completes an open-mic set at {venue}.
- The jokes make it from the notebook to the stage.
- A microphone appearance has a different assignment for {player}.

## 81. Hobbies, collecting and harmless experiments

### `hobby.model_train_layout`

**Trigger:** Player completes a documented miniature railway layout and chooses a public hobby-club demonstration.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras unless the selected hobby requires later technology; contract permissions and venue consent apply.

**Required state:** hobby.model_train_layout.status; hobby.model_train_layout.decision; hobby.model_train_layout.public_disclosure; hobby_progress; personal_artifacts; leisure_time

**Consequences:** Unlock hobby display and club relationships.

**Media examples:**

- {player} finishes his miniature railway layout.
- The smallest route in his schedule is finally complete.
- A hobby-club demonstration gives the model its first audience.

### `hobby.birdwatching_checklist`

**Trigger:** Qualified hobby organizers verify player's completed local birdwatching checklist without disturbing wildlife.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras unless the selected hobby requires later technology; contract permissions and venue consent apply.

**Required state:** hobby.birdwatching_checklist.status; hobby.birdwatching_checklist.decision; hobby.birdwatching_checklist.public_disclosure; hobby_progress; personal_artifacts; leisure_time

**Consequences:** Unlock naturalist hobby milestone and outdoor community relationships.

**Media examples:**

- {player} completes the local birdwatching checklist.
- The sightings get verified one species at a time.
- A quiet hobby reaches a documented milestone.

### `hobby.puzzle_competition_finish`

**Trigger:** Player enters a permitted organized puzzle event and receives an official completion placing.

**Placeholders:** `{event}`, `{place}`, `{player}`

**Modes:** player

**Availability:** All eras unless the selected hobby requires later technology; contract permissions and venue consent apply.

**Required state:** hobby.puzzle_competition_finish.status; hobby.puzzle_competition_finish.decision; hobby.puzzle_competition_finish.public_disclosure; hobby_progress; personal_artifacts; leisure_time

**Consequences:** Record puzzle skill and event result, separate from basketball ratings.

**Media examples:**

- {player} finishes {place} in {event}.
- The puzzle clock produces an official result.
- A different contest gives {player} a place in the standings.

### `hobby.pottery_first_firing`

**Trigger:** Player's pottery instructor confirms his first finished piece survives firing and player elects to keep it rather than sell it.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras unless the selected hobby requires later technology; contract permissions and venue consent apply.

**Required state:** hobby.pottery_first_firing.status; hobby.pottery_first_firing.decision; hobby.pottery_first_firing.public_disclosure; hobby_progress; personal_artifacts; leisure_time

**Consequences:** Create personal artwork item and hobby confidence.

**Media examples:**

- {player}'s first pottery piece survives the kiln.
- The finished work gets a place at home.
- A hands-on lesson leaves something solid behind.

### `hobby.amateur_theatre_crew`

**Trigger:** Player completes an assigned backstage crew role at an approved community production without taking a stage part.

**Placeholders:** `{player}`, `{production}`

**Modes:** player

**Availability:** All eras unless the selected hobby requires later technology; contract permissions and venue consent apply.

**Required state:** hobby.amateur_theatre_crew.status; hobby.amateur_theatre_crew.decision; hobby.amateur_theatre_crew.public_disclosure; hobby_progress; personal_artifacts; leisure_time

**Consequences:** Build technical hobby skill and behind-the-scenes relationships.

**Media examples:**

- {player} completes backstage work on {production}.
- The show gets help without putting him in the spotlight.
- A theater crew assignment reaches the final curtain.

### `hobby.boardgame_design_test`

**Trigger:** Player organizes consenting adult testers for his original board game and completes a logged feedback session.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras unless the selected hobby requires later technology; contract permissions and venue consent apply.

**Required state:** hobby.boardgame_design_test.status; hobby.boardgame_design_test.decision; hobby.boardgame_design_test.public_disclosure; hobby_progress; personal_artifacts; leisure_time

**Consequences:** Add prototype feedback and unlock revised design decisions.

**Media examples:**

- {player}'s board-game prototype completes its first test session.
- The table finds the rules that need work.
- A hobby invention receives feedback rather than automatic praise.

### `hobby.collection_catalogued`

**Trigger:** Player independently authenticates and catalogs an existing lawful personal collection without reporting a sale or valuation.

**Placeholders:** `{collection}`, `{player}`

**Modes:** player

**Availability:** All eras unless the selected hobby requires later technology; contract permissions and venue consent apply.

**Required state:** hobby.collection_catalogued.status; hobby.collection_catalogued.decision; hobby.collection_catalogued.public_disclosure; hobby_progress; personal_artifacts; leisure_time

**Consequences:** Unlock archive access and exhibition/privacy choice.

**Media examples:**

- {player} completes the catalog of his {collection}.
- The collection gets an organized record.
- Personal objects become a documented hobby archive.

### `hobby.urban_sketch_route`

**Trigger:** Player completes a planned public-place sketching route while complying with site permissions.

**Placeholders:** `{city}`, `{player}`

**Modes:** player

**Availability:** All eras unless the selected hobby requires later technology; contract permissions and venue consent apply.

**Required state:** hobby.urban_sketch_route.status; hobby.urban_sketch_route.decision; hobby.urban_sketch_route.public_disclosure; hobby_progress; personal_artifacts; leisure_time

**Consequences:** Create finished sketch portfolio and regional familiarity.

**Media examples:**

- {player} completes his sketching route through {city}.
- A notebook follows the city beyond the arena.
- The route ends with drawings rather than a score.

### `hobby.community_quiz_team`

**Trigger:** Player joins a fictional organized adult quiz team and completes a match with confirmed result.

**Placeholders:** `{player}`, `{result}`

**Modes:** player

**Availability:** All eras unless the selected hobby requires later technology; contract permissions and venue consent apply.

**Required state:** hobby.community_quiz_team.status; hobby.community_quiz_team.decision; hobby.community_quiz_team.public_disclosure; hobby_progress; personal_artifacts; leisure_time

**Consequences:** Add nonbasketball peer group and quiz-team outcome.

**Media examples:**

- {player}'s quiz team record {result}.
- The questions, rather than the rim, decide this contest.
- A new team experience ends with an official result.

### `hobby.no_clock_day`

**Trigger:** Player voluntarily completes one permission-cleared day without checking nonessential clocks while a trusted contact manages mandatory timing.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras unless the selected hobby requires later technology; contract permissions and venue consent apply.

**Required state:** hobby.no_clock_day.status; hobby.no_clock_day.decision; hobby.no_clock_day.public_disclosure; hobby_progress; personal_artifacts; leisure_time

**Consequences:** Create novelty challenge result without abandoning safety or obligations.

**Media examples:**

- {player} completes an approved day without checking the clock.
- The time experiment ends with every required appointment kept.
- One ordinary day follows a deliberately unusual routine.

## 82. Fan connection and participatory formats

### `fan.letter_reply_project`

**Trigger:** Player completes an agreed number of personal replies to consented fan letters without a merchandise offer.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras when corresponding format exists; fan participants opt in; private identities and contact details stay protected.

**Required state:** fan.letter_reply_project.status; fan.letter_reply_project.decision; fan.letter_reply_project.public_disclosure; fan_connection; community_commitments; event_permissions

**Consequences:** Increase correspondence connection and consume leisure time.

**Media examples:**

- {player} completes his fan-letter reply project.
- The replies reach people who took time to write.
- A stack of letters receives individual attention.

### `fan.supporter_book_club`

**Trigger:** Player joins a moderated adult supporter reading group and completes its first book discussion.

**Placeholders:** `{book}`, `{player}`

**Modes:** player

**Availability:** All eras when corresponding format exists; fan participants opt in; private identities and contact details stay protected.

**Required state:** fan.supporter_book_club.status; fan.supporter_book_club.decision; fan.supporter_book_club.public_disclosure; fan_connection; community_commitments; event_permissions

**Consequences:** Unlock recurring discussion community outside basketball performance.

**Media examples:**

- {player}'s supporter book club completes its first discussion.
- The shared topic is {book}, rather than the box score.
- A reading group gives fans another way to connect.

### `fan.accessible_meetup_feedback`

**Trigger:** Player hosts an approved accessible fan meetup and an independent organizer records the participants' accessibility feedback.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras when corresponding format exists; fan participants opt in; private identities and contact details stay protected.

**Required state:** fan.accessible_meetup_feedback.status; fan.accessible_meetup_feedback.decision; fan.accessible_meetup_feedback.public_disclosure; fan_connection; community_commitments; event_permissions

**Consequences:** Update event-design preferences and community relationship.

**Media examples:**

- {player}'s fan meetup receives its accessibility review.
- The next gathering has concrete feedback to use.
- The event is assessed by the people it was meant to welcome.

### `fan.supporter_skill_exchange`

**Trigger:** Player participates in a consent-based adult community skill exchange, teaching a declared nonbasketball hobby and learning another.

**Placeholders:** `{player}`, `{skill}`

**Modes:** player

**Availability:** All eras when corresponding format exists; fan participants opt in; private identities and contact details stay protected.

**Required state:** fan.supporter_skill_exchange.status; fan.supporter_skill_exchange.decision; fan.supporter_skill_exchange.public_disclosure; fan_connection; community_commitments; event_permissions

**Consequences:** Add reciprocal fan connection and verified hobby lesson.

**Media examples:**

- {player} exchanges {skill} lessons with supporters.
- The event has learners on both sides of the table.
- A fan meeting becomes a two-way workshop.

### `fan.fan_art_jury_choice`

**Trigger:** Player joins a transparent jury for an opt-in fictional fan-art exhibition and selected artists consent to display.

**Placeholders:** `{exhibition}`, `{player}`

**Modes:** player

**Availability:** All eras when corresponding format exists; fan participants opt in; private identities and contact details stay protected.

**Required state:** fan.fan_art_jury_choice.status; fan.fan_art_jury_choice.decision; fan.fan_art_jury_choice.public_disclosure; fan_connection; community_commitments; event_permissions

**Consequences:** Unlock curated exhibition and selection transparency obligations.

**Media examples:**

- {player} helps select work for {exhibition}.
- The fan-art display follows its announced judging process.
- Supporter creativity receives a curated public space.

### `fan.small_town_visit_lottery`

**Trigger:** Player fulfills a publicly announced random-draw visit to an eligible supporter community after its organizers consent.

**Placeholders:** `{player}`, `{town}`

**Modes:** player

**Availability:** All eras when corresponding format exists; fan participants opt in; private identities and contact details stay protected.

**Required state:** fan.small_town_visit_lottery.status; fan.small_town_visit_lottery.decision; fan.small_town_visit_lottery.public_disclosure; fan_connection; community_commitments; event_permissions

**Consequences:** Record fulfilled appearance pledge and local fan relationship.

**Media examples:**

- {player} fulfills the supporter-visit draw in {town}.
- The selected community receives the promised visit.
- The lottery result becomes an actual appointment.

### `fan.fan_question_archive`

**Trigger:** Player answers a moderated set of previously submitted supporter questions and publishes the complete approved transcript.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras when corresponding format exists; fan participants opt in; private identities and contact details stay protected.

**Required state:** fan.fan_question_archive.status; fan.fan_question_archive.decision; fan.fan_question_archive.public_disclosure; fan_connection; community_commitments; event_permissions

**Consequences:** Create durable Q-and-A artifact and public knowledge from answers only.

**Media examples:**

- {player}'s complete supporter Q-and-A reaches the archive.
- The answers stay together instead of becoming isolated fragments.
- Fans get the approved transcript of their submitted questions.

### `fan.one_event_no_selfies`

**Trigger:** Player and organizers designate one opt-in fan event as conversation-only with no posed photographs; participants receive notice before attendance.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras when corresponding format exists; fan participants opt in; private identities and contact details stay protected.

**Required state:** fan.one_event_no_selfies.status; fan.one_event_no_selfies.decision; fan.one_event_no_selfies.public_disclosure; fan_connection; community_commitments; event_permissions

**Consequences:** Change event rules and emphasize in-person conversation.

**Media examples:**

- {player}'s fan gathering chooses conversation over posed photos.
- The event follows its announced camera boundary.
- Supporters meet under a clearly stated format.

### `fan.supporter_memory_map`

**Trigger:** Player supports an opt-in anonymized project mapping fans' meaningful basketball locations and verifies completed submission review.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras when corresponding format exists; fan participants opt in; private identities and contact details stay protected.

**Required state:** fan.supporter_memory_map.status; fan.supporter_memory_map.decision; fan.supporter_memory_map.public_disclosure; fan_connection; community_commitments; event_permissions

**Consequences:** Create supporter geography artifact without disclosing private addresses.

**Media examples:**

- {player}'s supporter memory map opens after review.
- The landmarks come from people who chose to contribute.
- A fan project connects basketball memories to public places.

### `fan.penpal_cycle_closed`

**Trigger:** Player completes a limited moderated correspondence cycle with consenting adult supporters and clearly announces its planned closure.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras when corresponding format exists; fan participants opt in; private identities and contact details stay protected.

**Required state:** fan.penpal_cycle_closed.status; fan.penpal_cycle_closed.decision; fan.penpal_cycle_closed.public_disclosure; fan_connection; community_commitments; event_permissions

**Consequences:** Fulfill correspondence pledge and remove ongoing reply expectation.

**Media examples:**

- {player} completes the promised correspondence cycle.
- The final replies close the project on schedule.
- A fan connection ends at the boundary agreed from the start.

## 83. Authored media projects and interview formats

### `media_project.first_person_essay`

**Trigger:** Player writes and approves a full first-person essay for a fictional editorial publication, without a commercial brand deal.

**Placeholders:** `{player}`, `{publication}`

**Modes:** player

**Availability:** All eras; radio/print projects earliest, television where available, blogs/podcasts only corresponding modern eras; explicit participant and editorial consent.

**Required state:** media_project.first_person_essay.status; media_project.first_person_essay.decision; media_project.first_person_essay.public_disclosure; authored_artifacts; editorial_permissions; presenter_experience

**Consequences:** Create authored public account and limit attribution to approved text.

**Media examples:**

- {player} publishes his own account in {publication}.
- The story reaches readers in the player's approved words.
- A first-person essay gives {player} a complete public statement.

### `media_project.documentary_cut_approval`

**Trigger:** Player approves the final cut of a consent-based fictional documentary after all featured participants approve their own protected disclosures.

**Placeholders:** `{documentary}`, `{player}`

**Modes:** player

**Availability:** All eras; radio/print projects earliest, television where available, blogs/podcasts only corresponding modern eras; explicit participant and editorial consent.

**Required state:** media_project.documentary_cut_approval.status; media_project.documentary_cut_approval.decision; media_project.documentary_cut_approval.public_disclosure; authored_artifacts; editorial_permissions; presenter_experience

**Consequences:** Unlock release event and documentary artifact.

**Media examples:**

- {player} approves the final cut of {documentary}.
- The authorized film clears its last review.
- A completed documentary receives permission to reach an audience.

### `media_project.interview_walkout_notice`

**Trigger:** Player ends an interview under a previously agreed topic-boundary clause after interviewer asks a specifically excluded personal question.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; radio/print projects earliest, television where available, blogs/podcasts only corresponding modern eras; explicit participant and editorial consent.

**Required state:** media_project.interview_walkout_notice.status; media_project.interview_walkout_notice.decision; media_project.interview_walkout_notice.public_disclosure; authored_artifacts; editorial_permissions; presenter_experience

**Consequences:** Terminate recording session and record editor relationship impact; no league fine assumed.

**Media examples:**

- {player} ends the interview under its agreed boundaries.
- The excluded question brings the session to a close.
- A prearranged limit changes the interview's ending.

### `media_project.host_role_trial`

**Trigger:** Player completes a guest-host trial for a fictional nonbasketball cultural program; producer provides a formal evaluation.

**Placeholders:** `{player}`, `{program}`

**Modes:** player

**Availability:** All eras; radio/print projects earliest, television where available, blogs/podcasts only corresponding modern eras; explicit participant and editorial consent.

**Required state:** media_project.host_role_trial.status; media_project.host_role_trial.decision; media_project.host_role_trial.public_disclosure; authored_artifacts; editorial_permissions; presenter_experience

**Consequences:** Add presenter experience and unlock role offer or refusal.

**Media examples:**

- {player} completes a hosting trial on {program}.
- The interview subject tries the other chair.
- The producer now has a full hosting sample to evaluate.

### `media_project.longform_unedited`

**Trigger:** Player and interviewer agree to publish a full-length unedited interview, excluding premarked private segments.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; radio/print projects earliest, television where available, blogs/podcasts only corresponding modern eras; explicit participant and editorial consent.

**Required state:** media_project.longform_unedited.status; media_project.longform_unedited.decision; media_project.longform_unedited.public_disclosure; authored_artifacts; editorial_permissions; presenter_experience

**Consequences:** Create complete record and public-context resource.

**Media examples:**

- {player}'s approved long-form interview appears in full.
- The audience gets the conversation beyond a short quote.
- The released interview preserves its agreed context.

### `media_project.audio_diary_complete`

**Trigger:** Player completes a private audio-diary project and elects to release only an approved edited nonprivate episode.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; radio/print projects earliest, television where available, blogs/podcasts only corresponding modern eras; explicit participant and editorial consent.

**Required state:** media_project.audio_diary_complete.status; media_project.audio_diary_complete.decision; media_project.audio_diary_complete.public_disclosure; authored_artifacts; editorial_permissions; presenter_experience

**Consequences:** Unlock authored audio artifact and keep raw recordings private.

**Media examples:**

- {player} releases an approved episode from his audio diary.
- The raw recordings stay private while one episode reaches listeners.
- A personal project finds a controlled public form.

### `media_project.fictional_cameo_declined`

**Trigger:** Player declines a offered fictional screen cameo because the script conflicts with his stated personal goals, without alleging wrongdoing.

**Placeholders:** `{player}`, `{production}`

**Modes:** player

**Availability:** All eras; radio/print projects earliest, television where available, blogs/podcasts only corresponding modern eras; explicit participant and editorial consent.

**Required state:** media_project.fictional_cameo_declined.status; media_project.fictional_cameo_declined.decision; media_project.fictional_cameo_declined.public_disclosure; authored_artifacts; editorial_permissions; presenter_experience

**Consequences:** Close role offer and preserve chosen public identity.

**Media examples:**

- {player} declines a cameo in {production}.
- The script does not fit the direction he wants.
- An offered screen role ends with a deliberate refusal.

### `media_project.archival_interview`

**Trigger:** Player participates in an oral-history interview for an accredited fictional archive and approves access conditions.

**Placeholders:** `{archive}`, `{player}`

**Modes:** player

**Availability:** All eras; radio/print projects earliest, television where available, blogs/podcasts only corresponding modern eras; explicit participant and editorial consent.

**Required state:** media_project.archival_interview.status; media_project.archival_interview.decision; media_project.archival_interview.public_disclosure; authored_artifacts; editorial_permissions; presenter_experience

**Consequences:** Create preserved testimony with time-limited or open access setting.

**Media examples:**

- {player} records an oral history for {archive}.
- The account gets preserved under his approved access terms.
- A career conversation enters the historical archive.

### `media_project.guest_editor_issue`

**Trigger:** Player curates a completed fictional magazine issue under professional editorial supervision and approves the final selections.

**Placeholders:** `{player}`, `{publication}`

**Modes:** player

**Availability:** All eras; radio/print projects earliest, television where available, blogs/podcasts only corresponding modern eras; explicit participant and editorial consent.

**Required state:** media_project.guest_editor_issue.status; media_project.guest_editor_issue.decision; media_project.guest_editor_issue.public_disclosure; authored_artifacts; editorial_permissions; presenter_experience

**Consequences:** Unlock editorial credit and collaboration reputation.

**Media examples:**

- {player}'s guest-edited issue of {publication} is complete.
- The byline is not his only role in this edition.
- The selected stories reach a finished editorial package.

### `media_project.translation_review`

**Trigger:** Player commissions an authorized translation of his existing personal essay and approves it after qualified independent review.

**Placeholders:** `{language}`, `{player}`

**Modes:** player

**Availability:** All eras; radio/print projects earliest, television where available, blogs/podcasts only corresponding modern eras; explicit participant and editorial consent.

**Required state:** media_project.translation_review.status; media_project.translation_review.decision; media_project.translation_review.public_disclosure; authored_artifacts; editorial_permissions; presenter_experience

**Consequences:** Unlock additional-language readership without claiming player fluency.

**Media examples:**

- {player}'s essay receives an approved {language} translation.
- Qualified review brings the account to another readership.
- The translated words preserve the approved original story.

## 84. Privacy, consent and personal information control

### `privacy.home_tour_refused`

**Trigger:** Player declines an optional public home-tour proposal before recording begins.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; technology-specific settings only when available; private events use player-facing text until explicit publication consent.

**Required state:** privacy.home_tour_refused.status; privacy.home_tour_refused.decision; privacy.home_tour_refused.public_disclosure; public_knowledge; disclosure_permissions; privacy_boundaries

**Consequences:** Preserve home location privacy and close publicity opportunity.

**Media examples:**

- {player} declines the proposed home tour.
- The door stays closed to a public camera crew.
- A publicity opportunity ends at a personal boundary.

### `privacy.childhood_photo_consent`

**Trigger:** Player and identifiable adults jointly approve one archived childhood photograph for publication while all other images remain restricted.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; technology-specific settings only when available; private events use player-facing text until explicit publication consent.

**Required state:** privacy.childhood_photo_consent.status; privacy.childhood_photo_consent.decision; privacy.childhood_photo_consent.public_disclosure; public_knowledge; disclosure_permissions; privacy_boundaries

**Consequences:** Unlock specific photo only; do not expose unapproved relatives.

**Media examples:**

- {player} approves one childhood photograph for publication.
- The permission applies to a single image, not the whole album.
- A selected memory reaches the public with consent.

### `privacy.location_delay_rule`

**Trigger:** Player voluntarily adopts delayed location posting for his personal public accounts and completes the initial compliance window.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; technology-specific settings only when available; private events use player-facing text until explicit publication consent.

**Required state:** privacy.location_delay_rule.status; privacy.location_delay_rule.decision; privacy.location_delay_rule.public_disclosure; public_knowledge; disclosure_permissions; privacy_boundaries

**Consequences:** Create posting-delay setting and reduce real-time location exposure.

**Media examples:**

- {player} adopts a delay for public location updates.
- The personal account stops announcing movements in real time.
- A new posting rule separates travel from instant disclosure.

### `privacy.family_press_permission`

**Trigger:** Adult relatives and player jointly require advance permission for identifiable family participation in press projects.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; technology-specific settings only when available; private events use player-facing text until explicit publication consent.

**Required state:** privacy.family_press_permission.status; privacy.family_press_permission.decision; privacy.family_press_permission.public_disclosure; public_knowledge; disclosure_permissions; privacy_boundaries

**Consequences:** Create consent registry and block unapproved family features.

**Media examples:**

- {player}'s family set an advance-permission rule for press features.
- A personal connection is not automatic interview access.
- The family profile gets a clear consent gate.

### `privacy.contact_channel_changed`

**Trigger:** Player replaces an open personal contact channel with a moderated professional inbox and announces the permitted route.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; technology-specific settings only when available; private events use player-facing text until explicit publication consent.

**Required state:** privacy.contact_channel_changed.status; privacy.contact_channel_changed.decision; privacy.contact_channel_changed.public_disclosure; public_knowledge; disclosure_permissions; privacy_boundaries

**Consequences:** Close direct access and preserve approved message intake.

**Media examples:**

- {player} moves public contact to a moderated channel.
- The new route keeps messages available without an open personal inbox.
- A clear contact boundary changes how supporters reach him.

### `privacy.private_journal_rejected`

**Trigger:** Player refuses an optional publisher's request to reproduce his private journal despite an offer to feature selected pages.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; technology-specific settings only when available; private events use player-facing text until explicit publication consent.

**Required state:** privacy.private_journal_rejected.status; privacy.private_journal_rejected.decision; privacy.private_journal_rejected.public_disclosure; public_knowledge; disclosure_permissions; privacy_boundaries

**Consequences:** Keep journal unpublished and close personal-story branch.

**Media examples:**

- {player} keeps his journal out of publication.
- The notebook stays a private record.
- A proposed feature stops at the player's decision.

### `privacy.personal_archive_embargo`

**Trigger:** Player deposits an approved personal archive with a fictional institution under an agreed future-release date.

**Placeholders:** `{archive}`, `{player}`

**Modes:** player

**Availability:** All eras; technology-specific settings only when available; private events use player-facing text until explicit publication consent.

**Required state:** privacy.personal_archive_embargo.status; privacy.personal_archive_embargo.decision; privacy.personal_archive_embargo.public_disclosure; public_knowledge; disclosure_permissions; privacy_boundaries

**Consequences:** Create escrowed archive and locked public access until chosen date.

**Media examples:**

- {player}'s personal archive receives a release-date restriction.
- The material is preserved without becoming immediately public.
- {archive} accept the collection under its agreed embargo.

### `privacy.venue_camera_boundary`

**Trigger:** Player and an approved small-event venue agree a camera-free personal gathering and clearly notify invitees.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; technology-specific settings only when available; private events use player-facing text until explicit publication consent.

**Required state:** privacy.venue_camera_boundary.status; privacy.venue_camera_boundary.decision; privacy.venue_camera_boundary.public_disclosure; public_knowledge; disclosure_permissions; privacy_boundaries

**Consequences:** Set event capture permissions and invitee compliance checks.

**Media examples:**

- {player}'s gathering adopts an announced camera boundary.
- The venue prepares a personal occasion without public recording.
- Invitees receive the rules before the event begins.

### `privacy.shared_story_withdrawn`

**Trigger:** Player and another adult mutually withdraw a planned shared personal profile before publication under its consent agreement.

**Placeholders:** `{participant}`, `{player}`

**Modes:** player

**Availability:** All eras; technology-specific settings only when available; private events use player-facing text until explicit publication consent.

**Required state:** privacy.shared_story_withdrawn.status; privacy.shared_story_withdrawn.decision; privacy.shared_story_withdrawn.public_disclosure; public_knowledge; disclosure_permissions; privacy_boundaries

**Consequences:** Cancel story release and preserve collaboration relationship.

**Media examples:**

- {player} and {participant} withdraw their planned shared profile.
- The authorized story stops before publication.
- A mutual decision keeps the account private.

### `privacy.retired_routine_publication`

**Trigger:** Player chooses to publish an old personal routine only after it is no longer current and affected adults consent.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; technology-specific settings only when available; private events use player-facing text until explicit publication consent.

**Required state:** privacy.retired_routine_publication.status; privacy.retired_routine_publication.decision; privacy.retired_routine_publication.public_disclosure; public_knowledge; disclosure_permissions; privacy_boundaries

**Consequences:** Reveal historical routine while current habits remain private.

**Media examples:**

- {player} shares a routine that is no longer in use.
- The old schedule becomes a story without exposing the present one.
- A historical account leaves current movements outside the frame.

## 85. Culture, language and everyday adaptation

### `culture.local_language_course`

**Trigger:** Player enrolls in a qualified everyday-language course after moving and completes its first assessment.

**Placeholders:** `{language}`, `{player}`

**Modes:** player

**Availability:** All eras; travel/location and verified cultural context must exist; no assumed nationality, faith or background; no emergency travel or immigration events.

**Required state:** culture.local_language_course.status; culture.local_language_course.decision; culture.local_language_course.public_disclosure; cultural_familiarity; language_progress; regional_relationships

**Consequences:** Add tested language level and local integration opportunities.

**Media examples:**

- {player} completes the first assessment in {language}.
- Everyday conversation becomes part of the new-city plan.
- The course gives language progress a verified starting point.

### `culture.interpreter_preference`

**Trigger:** Player chooses a qualified interpreter for an important nonteam public conversation rather than overstating his fluency.

**Placeholders:** `{event}`, `{player}`

**Modes:** player

**Availability:** All eras; travel/location and verified cultural context must exist; no assumed nationality, faith or background; no emergency travel or immigration events.

**Required state:** culture.interpreter_preference.status; culture.interpreter_preference.decision; culture.interpreter_preference.public_disclosure; cultural_familiarity; language_progress; regional_relationships

**Consequences:** Set interpreter preference and protect accurate communication.

**Media examples:**

- {player} chooses qualified interpretation for {event}.
- Clear communication matters more than pretending fluency.
- The conversation receives the language support he requests.

### `culture.local_history_walk`

**Trigger:** Player completes a permission-cleared guided local-history route and elects to share only the guide's verified public information.

**Placeholders:** `{city}`, `{player}`

**Modes:** player

**Availability:** All eras; travel/location and verified cultural context must exist; no assumed nationality, faith or background; no emergency travel or immigration events.

**Required state:** culture.local_history_walk.status; culture.local_history_walk.decision; culture.local_history_walk.public_disclosure; cultural_familiarity; language_progress; regional_relationships

**Consequences:** Increase regional familiarity and community engagement.

**Media examples:**

- {player} completes a history walk through {city}.
- The new place gets a story beyond its arena.
- A guided route gives the city context.

### `culture.regional_food_class`

**Trigger:** Player attends a qualified local cooking workshop with a specific regional dish and completes it without competition or endorsement.

**Placeholders:** `{dish}`, `{player}`

**Modes:** player

**Availability:** All eras; travel/location and verified cultural context must exist; no assumed nationality, faith or background; no emergency travel or immigration events.

**Required state:** culture.regional_food_class.status; culture.regional_food_class.decision; culture.regional_food_class.public_disclosure; cultural_familiarity; language_progress; regional_relationships

**Consequences:** Add hobby skill and cultural familiarity.

**Media examples:**

- {player} completes a workshop on {dish}.
- The lesson brings a regional tradition into the kitchen.
- A local class gives the new city another familiar detail.

### `culture.customary_greeting_clarified`

**Trigger:** Local hosts explain a greeting convention and player adjusts his next agreed public introduction accordingly.

**Placeholders:** `{event}`, `{player}`

**Modes:** player

**Availability:** All eras; travel/location and verified cultural context must exist; no assumed nationality, faith or background; no emergency travel or immigration events.

**Required state:** culture.customary_greeting_clarified.status; culture.customary_greeting_clarified.decision; culture.customary_greeting_clarified.public_disclosure; cultural_familiarity; language_progress; regional_relationships

**Consequences:** Improve cultural familiarity; no offense inferred from prior uncertainty.

**Media examples:**

- {player} adopts the hosts' explained greeting at {event}.
- The introduction follows local guidance.
- A small lesson makes the next welcome clearer.

### `culture.translation_mistake_owned`

**Trigger:** Qualified translators confirm a harmless mistake in player's personally authored multilingual greeting and he publishes the corrected wording.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; travel/location and verified cultural context must exist; no assumed nationality, faith or background; no emergency travel or immigration events.

**Required state:** culture.translation_mistake_owned.status; culture.translation_mistake_owned.decision; culture.translation_mistake_owned.public_disclosure; cultural_familiarity; language_progress; regional_relationships

**Consequences:** Correct text and build transparent cross-language communication.

**Media examples:**

- {player} corrects his translated greeting.
- The revision follows a qualified language check.
- A small wording error gets a direct fix.

### `culture.offseason_local_stay`

**Trigger:** Player chooses to stay in his current team's region for an approved offseason block to build ordinary community ties.

**Placeholders:** `{player}`, `{region}`

**Modes:** player

**Availability:** All eras; travel/location and verified cultural context must exist; no assumed nationality, faith or background; no emergency travel or immigration events.

**Required state:** culture.offseason_local_stay.status; culture.offseason_local_stay.decision; culture.offseason_local_stay.public_disclosure; cultural_familiarity; language_progress; regional_relationships

**Consequences:** Change offseason location and open local social opportunities.

**Media examples:**

- {player} chooses an offseason stay in {region}.
- The current basketball home gets some ordinary-life time.
- A permitted calendar block stays close to the team's community.

### `culture.hometown_custom_shared`

**Trigger:** Player and local organizers authorize a factual demonstration of a hometown custom he personally practices, with no religion or nationality inferred.

**Placeholders:** `{custom}`, `{player}`

**Modes:** player

**Availability:** All eras; travel/location and verified cultural context must exist; no assumed nationality, faith or background; no emergency travel or immigration events.

**Required state:** culture.hometown_custom_shared.status; culture.hometown_custom_shared.decision; culture.hometown_custom_shared.public_disclosure; cultural_familiarity; language_progress; regional_relationships

**Consequences:** Unlock cultural event participation and consented identity context.

**Media examples:**

- {player} shares {custom} at an authorized community event.
- The demonstration follows his chosen personal connection.
- A familiar practice reaches a new audience on agreed terms.

### `culture.local_library_membership`

**Trigger:** Player registers with an ordinary local library and completes its public membership procedure without special access.

**Placeholders:** `{city}`, `{player}`

**Modes:** player

**Availability:** All eras; travel/location and verified cultural context must exist; no assumed nationality, faith or background; no emergency travel or immigration events.

**Required state:** culture.local_library_membership.status; culture.local_library_membership.decision; culture.local_library_membership.public_disclosure; cultural_familiarity; language_progress; regional_relationships

**Consequences:** Open reading resources and nonbasketball community setting.

**Media examples:**

- {player} joins {city}'s public library.
- A new membership has nothing to do with the roster.
- The local branch becomes part of his everyday map.

### `culture.return_visit_promise`

**Trigger:** Player revisits a previous nonteam community abroad after keeping a documented promise to local adult hosts.

**Placeholders:** `{community}`, `{player}`

**Modes:** player

**Availability:** All eras; travel/location and verified cultural context must exist; no assumed nationality, faith or background; no emergency travel or immigration events.

**Required state:** culture.return_visit_promise.status; culture.return_visit_promise.decision; culture.return_visit_promise.public_disclosure; cultural_familiarity; language_progress; regional_relationships

**Consequences:** Refresh international personal ties and consume planned leisure trip.

**Media examples:**

- {player} returns to {community} as promised.
- The visit follows a personal commitment rather than a game schedule.
- A remembered welcome receives a kept promise.

## 86. Conflicting commitments and player autonomy

### `autonomy.double_booked_choices`

**Trigger:** Player discovers two optional previously accepted personal events overlap and explicitly chooses which to attend while notifying the other organizer.

**Placeholders:** `{chosen_event}`, `{declined_event}`, `{player}`

**Modes:** player

**Availability:** All eras; decisions involve nonmandatory or formally released obligations; do not create inferred team-rule breaches or financial events.

**Required state:** autonomy.double_booked_choices.status; autonomy.double_booked_choices.decision; autonomy.double_booked_choices.public_disclosure; personal_commitments; decision_authority; availability_calendar

**Consequences:** Cancel one commitment, fulfill one and record both relationship effects.

**Media examples:**

- {player} chooses {chosen_event} over {declined_event}.
- An overlapping calendar forces a direct decision.
- The second organizer gets notice rather than an empty chair.

### `autonomy.volunteer_shift_trade`

**Trigger:** Player exchanges an approved volunteer shift with another consenting participant to honor a previously fixed team obligation.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; decisions involve nonmandatory or formally released obligations; do not create inferred team-rule breaches or financial events.

**Required state:** autonomy.volunteer_shift_trade.status; autonomy.volunteer_shift_trade.decision; autonomy.volunteer_shift_trade.public_disclosure; personal_commitments; decision_authority; availability_calendar

**Consequences:** Preserve volunteer duty through swap and team attendance.

**Media examples:**

- {player} arranges an approved volunteer-shift exchange.
- The commitment moves instead of disappearing.
- A willing substitute helps both calendars hold together.

### `autonomy.free_day_protected`

**Trigger:** Player declines all new optional appearance requests for one predeclared free day.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; decisions involve nonmandatory or formally released obligations; do not create inferred team-rule breaches or financial events.

**Required state:** autonomy.free_day_protected.status; autonomy.free_day_protected.decision; autonomy.free_day_protected.public_disclosure; personal_commitments; decision_authority; availability_calendar

**Consequences:** Preserve personal time and lower short-term publicity availability.

**Media examples:**

- {player} keeps one announced day free of new appearances.
- The calendar gets a boundary before the invitations arrive.
- A free day remains free by choice.

### `autonomy.community_role_overload`

**Trigger:** Player resigns one of several voluntary community roles after a recorded workload review identifies unsustainable scheduling.

**Placeholders:** `{player}`, `{role}`

**Modes:** player

**Availability:** All eras; decisions involve nonmandatory or formally released obligations; do not create inferred team-rule breaches or financial events.

**Required state:** autonomy.community_role_overload.status; autonomy.community_role_overload.decision; autonomy.community_role_overload.public_disclosure; personal_commitments; decision_authority; availability_calendar

**Consequences:** Remove chosen duty and create replacement coordination task.

**Media examples:**

- {player} steps back from {role} after reviewing his commitments.
- One voluntary role leaves an overcrowded calendar.
- The handover begins with an honest capacity decision.

### `autonomy.family_event_media_decline`

**Trigger:** Player declines an optional publicity event that conflicts with an already agreed adult family occasion, without skipping mandatory team work.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; decisions involve nonmandatory or formally released obligations; do not create inferred team-rule breaches or financial events.

**Required state:** autonomy.family_event_media_decline.status; autonomy.family_event_media_decline.decision; autonomy.family_event_media_decline.public_disclosure; personal_commitments; decision_authority; availability_calendar

**Consequences:** Preserve family commitment and close publicity slot.

**Media examples:**

- {player} chooses the agreed family occasion over the optional appearance.
- The prior promise stays on the calendar.
- A publicity invitation loses to an existing commitment.

### `autonomy.career_gap_personal_project`

**Trigger:** Active player formally negotiates a permitted unpaid career pause for a noneducation personal project without retiring or citing health.

**Placeholders:** `{player}`, `{project}`

**Modes:** player

**Availability:** All eras; decisions involve nonmandatory or formally released obligations; do not create inferred team-rule breaches or financial events.

**Required state:** autonomy.career_gap_personal_project.status; autonomy.career_gap_personal_project.decision; autonomy.career_gap_personal_project.public_disclosure; personal_commitments; decision_authority; availability_calendar

**Consequences:** Suspend active availability for agreed period and create return decision date.

**Media examples:**

- {player} agrees a permitted career pause for {project}.
- The break has a stated personal purpose and a return review.
- Basketball availability pauses under an approved agreement.

### `autonomy.no_entourage_trip`

**Trigger:** Player chooses to take an approved nonteam trip without companions and informs relevant personal contacts of the plan.

**Placeholders:** `{destination}`, `{player}`

**Modes:** player

**Availability:** All eras; decisions involve nonmandatory or formally released obligations; do not create inferred team-rule breaches or financial events.

**Required state:** autonomy.no_entourage_trip.status; autonomy.no_entourage_trip.decision; autonomy.no_entourage_trip.public_disclosure; personal_commitments; decision_authority; availability_calendar

**Consequences:** Change travel social state and preserve practical contact boundaries.

**Media examples:**

- {player} chooses a solo leisure trip to {destination}.
- The approved journey has a smaller passenger list.
- A personal travel choice creates time on his own.

### `autonomy.delegation_restored`

**Trigger:** Player reclaims responsibility for one previously delegated nonfinancial life decision and notifies the helper respectfully.

**Placeholders:** `{decision}`, `{player}`

**Modes:** player

**Availability:** All eras; decisions involve nonmandatory or formally released obligations; do not create inferred team-rule breaches or financial events.

**Required state:** autonomy.delegation_restored.status; autonomy.delegation_restored.decision; autonomy.delegation_restored.public_disclosure; personal_commitments; decision_authority; availability_calendar

**Consequences:** Change decision authority and relationship expectations.

**Media examples:**

- {player} takes direct control of {decision}.
- The helper receives notice of a changed responsibility.
- A personal choice returns to the person it concerns.

### `autonomy.appearance_limit_set`

**Trigger:** Player establishes a personal annual cap on voluntary noncommercial appearances and turns down the first request beyond it.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; decisions involve nonmandatory or formally released obligations; do not create inferred team-rule breaches or financial events.

**Required state:** autonomy.appearance_limit_set.status; autonomy.appearance_limit_set.decision; autonomy.appearance_limit_set.public_disclosure; personal_commitments; decision_authority; availability_calendar

**Consequences:** Set appearance budget and record declined optional opportunity.

**Media examples:**

- {player} enforces his voluntary-appearance limit.
- The next request arrives after the chosen cap.
- A personal schedule rule becomes an actual refusal.

### `autonomy.offseason_project_vote`

**Trigger:** Player invites consenting household adults to rank conflicting optional offseason projects, then records his agreed final choice.

**Placeholders:** `{player}`, `{project}`

**Modes:** player

**Availability:** All eras; decisions involve nonmandatory or formally released obligations; do not create inferred team-rule breaches or financial events.

**Required state:** autonomy.offseason_project_vote.status; autonomy.offseason_project_vote.decision; autonomy.offseason_project_vote.public_disclosure; personal_commitments; decision_authority; availability_calendar

**Consequences:** Select shared-priority project and defer alternatives.

**Media examples:**

- {player}'s household chooses {project} for the offseason calendar.
- The competing plans reach a shared priority.
- One project gets the time while the others wait.

## 87. Second careers, legacy and unusual life experiments

### `legacy.return_to_first_job`

**Trigger:** Player completes an employer-approved guest shift at a verified former nonbasketball workplace with no loss of current role.

**Placeholders:** `{player}`, `{workplace}`

**Modes:** player

**Availability:** All eras; qualifications, consent and era-specific technology respected; no inferred retirement, ownership investment or licensing violations.

**Required state:** legacy.return_to_first_job.status; legacy.return_to_first_job.decision; legacy.return_to_first_job.public_disclosure; second_career_progress; legacy_artifacts; future_personal_events

**Consequences:** Refresh old professional ties and unlock nostalgia narrative.

**Media examples:**

- {player} returns for an approved guest shift at {workplace}.
- The old job gets a familiar visitor doing real work.
- A former workplace becomes part of the story again.

### `legacy.classroom_guest_lecturer`

**Trigger:** Qualified institution invites player to deliver a prepared lecture on his documented nonbasketball expertise and confirms completion.

**Placeholders:** `{player}`, `{subject}`

**Modes:** player

**Availability:** All eras; qualifications, consent and era-specific technology respected; no inferred retirement, ownership investment or licensing violations.

**Required state:** legacy.classroom_guest_lecturer.status; legacy.classroom_guest_lecturer.decision; legacy.classroom_guest_lecturer.public_disclosure; second_career_progress; legacy_artifacts; future_personal_events

**Consequences:** Add teaching credit and educational relationship.

**Media examples:**

- {player} completes a guest lecture on {subject}.
- The classroom welcomes expertise beyond the basketball career.
- A prepared lesson gives students something specific to learn.

### `legacy.second_career_apprenticeship`

**Trigger:** Player starts a recognized nonhazardous craft apprenticeship during a permitted schedule window.

**Placeholders:** `{craft}`, `{player}`

**Modes:** player

**Availability:** All eras; qualifications, consent and era-specific technology respected; no inferred retirement, ownership investment or licensing violations.

**Required state:** legacy.second_career_apprenticeship.status; legacy.second_career_apprenticeship.decision; legacy.second_career_apprenticeship.public_disclosure; second_career_progress; legacy_artifacts; future_personal_events

**Consequences:** Create qualification progress and competing time commitment.

**Media examples:**

- {player} starts an apprenticeship in {craft}.
- A possible second career begins with supervised learning.
- The new route asks for work before a title.

### `legacy.apprenticeship_completed`

**Trigger:** Qualified supervisor confirms player completes an existing nonhazardous apprenticeship and earns its stated credential.

**Placeholders:** `{craft}`, `{player}`

**Modes:** player

**Availability:** All eras; qualifications, consent and era-specific technology respected; no inferred retirement, ownership investment or licensing violations.

**Required state:** legacy.apprenticeship_completed.status; legacy.apprenticeship_completed.decision; legacy.apprenticeship_completed.public_disclosure; second_career_progress; legacy_artifacts; future_personal_events

**Consequences:** Unlock qualified second-career options without assuming a job offer.

**Media examples:**

- {player} completes his {craft} apprenticeship.
- The supervised work earns its stated credential.
- A second-career skill reaches a verified milestone.

### `legacy.time_capsule_sealed`

**Trigger:** Player and consenting community participants seal an authorized time capsule with an agreed opening date.

**Placeholders:** `{date}`, `{player}`

**Modes:** player

**Availability:** All eras; qualifications, consent and era-specific technology respected; no inferred retirement, ownership investment or licensing violations.

**Required state:** legacy.time_capsule_sealed.status; legacy.time_capsule_sealed.decision; legacy.time_capsule_sealed.public_disclosure; second_career_progress; legacy_artifacts; future_personal_events

**Consequences:** Create legacy artifact and future scheduled reveal event.

**Media examples:**

- {player}'s community time capsule is sealed until {date}.
- The future audience gets an agreed appointment with the past.
- The contents wait under a shared opening plan.

### `legacy.personal_museum_room`

**Trigger:** Player loans authenticated career objects to a fictional institution for a limited exhibition without sale or gift of ownership.

**Placeholders:** `{museum}`, `{player}`

**Modes:** player

**Availability:** All eras; qualifications, consent and era-specific technology respected; no inferred retirement, ownership investment or licensing violations.

**Required state:** legacy.personal_museum_room.status; legacy.personal_museum_room.decision; legacy.personal_museum_room.public_disclosure; second_career_progress; legacy_artifacts; future_personal_events

**Consequences:** Unlock temporary legacy display and track object return deadline.

**Media examples:**

- {player}'s career objects open a temporary display at {museum}.
- The loan puts memories on view without changing ownership.
- A limited exhibition gives the artifacts a public home.

### `legacy.nonbasketball_coach_refusal`

**Trigger:** Player declines a proposed basketball coaching career after formally considering it and chooses a documented nonbasketball route.

**Placeholders:** `{path}`, `{player}`

**Modes:** player

**Availability:** All eras; qualifications, consent and era-specific technology respected; no inferred retirement, ownership investment or licensing violations.

**Required state:** legacy.nonbasketball_coach_refusal.status; legacy.nonbasketball_coach_refusal.decision; legacy.nonbasketball_coach_refusal.public_disclosure; second_career_progress; legacy_artifacts; future_personal_events

**Consequences:** Disable chosen coaching branch and open selected second-career path.

**Media examples:**

- {player} chooses {path} instead of a coaching role.
- The next professional direction leaves the basketball bench aside.
- A considered career choice reaches a clear answer.

### `legacy.public_skill_beginner`

**Trigger:** Player publicly enrolls as an ordinary beginner in a permitted adult class and accepts the standard assessment process.

**Placeholders:** `{player}`, `{skill}`

**Modes:** player

**Availability:** All eras; qualifications, consent and era-specific technology respected; no inferred retirement, ownership investment or licensing violations.

**Required state:** legacy.public_skill_beginner.status; legacy.public_skill_beginner.decision; legacy.public_skill_beginner.public_disclosure; second_career_progress; legacy_artifacts; future_personal_events

**Consequences:** Create beginner status and ordinary peer-learning opportunities.

**Media examples:**

- {player} starts {skill} as an ordinary beginner.
- The class uses the same standard for every learner.
- A public reputation does not replace the first lesson.

### `legacy.alternate_day_persona`

**Trigger:** Player completes a permission-cleared fictional performance experiment using an openly identified stage persona rather than deceiving participants about identity.

**Placeholders:** `{persona}`, `{player}`

**Modes:** player

**Availability:** All eras; qualifications, consent and era-specific technology respected; no inferred retirement, ownership investment or licensing violations.

**Required state:** legacy.alternate_day_persona.status; legacy.alternate_day_persona.decision; legacy.alternate_day_persona.public_disclosure; second_career_progress; legacy_artifacts; future_personal_events

**Consequences:** Unlock performance artifact and creative identity branch.

**Media examples:**

- {player} completes a staged day as {persona}.
- The experiment announces its fiction before the performance.
- A creative character gets one agreed day in public.

### `legacy.one_year_letter`

**Trigger:** Player writes a private letter to his future self, seals it and selects a one-year opening date without publishing its content.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** All eras; qualifications, consent and era-specific technology respected; no inferred retirement, ownership investment or licensing violations.

**Required state:** legacy.one_year_letter.status; legacy.one_year_letter.decision; legacy.one_year_letter.public_disclosure; second_career_progress; legacy_artifacts; future_personal_events

**Consequences:** Create future reflection event and preserve current content privacy.

**Media examples:**

- {player} seals a letter for his future self.
- The answer waits one year inside an envelope.
- A private reflection gets a date rather than a headline.

## 88. Investigation, privacy, and new evidence

### `legal.alibi_timestamp_clears`

**Trigger:** Authorities close the inquiry against the player after independently authenticated timestamps establish he was elsewhere; closure is publicly announced.

**Placeholders:** `{case}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; allegation; evidence_status; authority_decision; public_record; media_visibility

**Consequences:** Update the specified investigative or protective status; leave other allegations and case outcomes unresolved.

**Media examples:**

- Authenticated timestamps clear {player} in {case}.
- The timeline puts {player} somewhere else. Investigators close his part of the case.
- A verified alibi ends the inquiry hanging over {player}.

### `legal.identity_mixup_corrected`

**Trigger:** Authorities publicly correct a mistaken-identity notice and formally remove the player as a suspect.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; allegation; evidence_status; authority_decision; public_record; media_visibility

**Consequences:** Update the specified investigative or protective status; leave other allegations and case outcomes unresolved.

**Media examples:**

- Authorities correct the mistaken identification of {player}.
- Same name, different person: the official notice is corrected.
- {player} is removed from the suspect list after the identity error.

### `legal.forged_evidence_exposed`

**Trigger:** Investigators authenticate that a public allegation relied on fabricated evidence and announce that finding, without deciding unrelated allegations.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; allegation; evidence_status; authority_decision; public_record; media_visibility

**Consequences:** Update the specified investigative or protective status; leave other allegations and case outcomes unresolved.

**Media examples:**

- Investigators identify fabricated evidence in {player}'s case.
- The document driving the accusation is exposed as a forgery.
- One major claim against {player} loses its purported evidence.

### `legal.witness_recantation_reported`

**Trigger:** A material witness formally withdraws a prior statement on the public record; the case remains unresolved.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; allegation; evidence_status; authority_decision; public_record; media_visibility

**Consequences:** Update the specified investigative or protective status; leave other allegations and case outcomes unresolved.

**Media examples:**

- A key witness withdraws the statement concerning {player}.
- The account changes. The court outcome has not.
- {player}'s case faces a new evidentiary question after the recantation.

### `legal.corroborating_video_released`

**Trigger:** An authorized body releases authenticated footage that corroborates a specified allegation; no finding of guilt is entered.

**Placeholders:** `{case}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; allegation; evidence_status; authority_decision; public_record; media_visibility

**Consequences:** Update the specified investigative or protective status; leave other allegations and case outcomes unresolved.

**Media examples:**

- Released footage corroborates part of the allegation in {case}.
- New video strengthens a claim involving {player}; a verdict remains ahead.
- The evidence changes the case against {player}, without deciding it.

### `legal.chain_of_custody_failure`

**Trigger:** The court excludes a specific exhibit after finding its chain of custody unreliable; other evidence and charges remain separately active.

**Placeholders:** `{case}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; allegation; evidence_status; authority_decision; public_record; media_visibility

**Consequences:** Update the specified investigative or protective status; leave other allegations and case outcomes unresolved.

**Media examples:**

- Court excludes the disputed exhibit in {player}'s case.
- The evidence trail fails scrutiny, and one exhibit leaves the courtroom.
- {case} proceeds without the excluded material.

### `legal.phone_search_authorization_denied`

**Trigger:** A court denies the requested search authorization for a player's device under the save's legal rules; guilt remains unresolved.

**Placeholders:** `{case}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; allegation; evidence_status; authority_decision; public_record; media_visibility

**Consequences:** Update the specified investigative or protective status; leave other allegations and case outcomes unresolved.

**Media examples:**

- Court denies the requested device search in {case}.
- Investigators cannot use the proposed search authority against {player}.
- The ruling limits the investigation without resolving its allegation.

### `legal.leak_source_identified`

**Trigger:** A completed independent inquiry identifies who unlawfully leaked confidential case information; the finding is public and unrelated guilt remains unresolved.

**Placeholders:** `{case}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; allegation; evidence_status; authority_decision; public_record; media_visibility

**Consequences:** Update the specified investigative or protective status; leave other allegations and case outcomes unresolved.

**Media examples:**

- Inquiry identifies the source of the confidential leak in {case}.
- The leak has an identified source; {player}'s underlying case remains separate.
- Private case details became public through the breach now established by investigators.

### `legal.public_correction_ordered`

**Trigger:** A competent authority orders correction of a false public identification involving the player, and the correction is actually published.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; allegation; evidence_status; authority_decision; public_record; media_visibility

**Consequences:** Update the specified investigative or protective status; leave other allegations and case outcomes unresolved.

**Media examples:**

- Official correction removes {player} from the erroneous case report.
- The public record finally catches up with the corrected identity.
- {player}'s name leaves a story he should never have been placed in.

### `legal.witness_protection_availability`

**Trigger:** Authorities place the player under a lawful protective arrangement and authorize a limited announcement of resulting unavailability.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; allegation; evidence_status; authority_decision; public_record; media_visibility

**Consequences:** Update the specified investigative or protective status; leave other allegations and case outcomes unresolved.

**Media examples:**

- {player} becomes unavailable under an authorized protective arrangement.
- {team} receive the permitted availability update. Personal details remain restricted.
- Basketball pauses for {player} while the protection plan is in effect.

### `legal.cold_case_reopened`

**Trigger:** Authorities formally reopen a previously closed case involving the player after newly authenticated evidence; no new charges are assumed.

**Placeholders:** `{case}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; allegation; evidence_status; authority_decision; public_record; media_visibility

**Consequences:** Update the specified investigative or protective status; leave other allegations and case outcomes unresolved.

**Media examples:**

- New evidence reopens {case} involving {player}.
- A closed file returns to investigators after an authenticated discovery.
- {player}'s old case becomes an active inquiry again.

### `legal.voluntary_interview_completed`

**Trigger:** Player completes a voluntary, lawyer-assisted interview in a public inquiry; no arrest, charge, or admission is established.

**Placeholders:** `{case}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; allegation; evidence_status; authority_decision; public_record; media_visibility

**Consequences:** Update the specified investigative or protective status; leave other allegations and case outcomes unresolved.

**Media examples:**

- {player} completes a voluntary interview in {case}.
- Investigators hear from {player} without announcing a charge.
- The interview is over. The inquiry remains open.

### `legal.conflict_investigator_replaced`

**Trigger:** Oversight body finds a documented conflict and replaces the assigned investigator in a publicly known case.

**Placeholders:** `{case}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; allegation; evidence_status; authority_decision; public_record; media_visibility

**Consequences:** Update the specified investigative or protective status; leave other allegations and case outcomes unresolved.

**Media examples:**

- Oversight body replaces the conflicted investigator in {case}.
- {player}'s case gets a new investigator after the conflict finding.
- The inquiry continues under different supervision.

### `legal.forensic_review_inconclusive`

**Trigger:** Qualified forensic review returns an inconclusive result on a specified contested issue and the result is disclosed lawfully.

**Placeholders:** `{case}`, `{issue}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; allegation; evidence_status; authority_decision; public_record; media_visibility

**Consequences:** Update the specified investigative or protective status; leave other allegations and case outcomes unresolved.

**Media examples:**

- Forensic review leaves {issue} unresolved in {player}'s case.
- The laboratory result provides no clear answer to the disputed question.
- An inconclusive finding leaves {case} awaiting other evidence.

### `legal.complainant_protection_order`

**Trigger:** Court grants a specified protective order after the applicable findings; no criminal verdict is implied, and the public terms are supplied.

**Placeholders:** `{case}`, `{player}`, `{restriction}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; allegation; evidence_status; authority_decision; public_record; media_visibility

**Consequences:** Update the specified investigative or protective status; leave other allegations and case outcomes unresolved.

**Media examples:**

- Court issues a protective order with {restriction} in {case}.
- The order sets a binding boundary involving {player}.
- The protective terms take effect while other legal questions remain separate.

## 89. Court access, attendance, and pretrial decisions

### `legal.remote_hearing_permission`

**Trigger:** Court grants a requested remote appearance that removes a specific conflict with a team's road game; the hearing still occurs.

**Placeholders:** `{hearing}`, `{player}`, `{team}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; court_calendar; attendance_order; release_conditions; travel_permissions; player_availability; media_visibility

**Consequences:** Apply the actual procedural order and related travel/availability changes; retain unresolved merits.

**Media examples:**

- Court permits {player} to attend {hearing} remotely.
- The legal appearance stays on the calendar without the extra journey.
- {team}'s road schedule no longer conflicts with {player}'s hearing location.

### `legal.hearing_relocation_travel`

**Trigger:** Court changes a public hearing's venue, creating a documented travel conflict and a revised player availability plan.

**Placeholders:** `{city}`, `{hearing}`, `{player}`, `{team}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; court_calendar; attendance_order; release_conditions; travel_permissions; player_availability; media_visibility

**Consequences:** Apply the actual procedural order and related travel/availability changes; retain unresolved merits.

**Media examples:**

- Venue change forces {player} to revise his travel plan.
- {hearing} moves to {city}, changing {team}'s availability picture.
- A courtroom move reaches the basketball schedule.

### `legal.bail_conditions_training`

**Trigger:** Court imposes lawful pretrial release conditions that specifically permit supervised training while restricting other travel.

**Placeholders:** `{player}`, `{restriction}`, `{team}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; court_calendar; attendance_order; release_conditions; travel_permissions; player_availability; media_visibility

**Consequences:** Apply the actual procedural order and related travel/availability changes; retain unresolved merits.

**Media examples:**

- {player} may train under the court's release conditions.
- Training resumes within {restriction}; the case is still pending.
- {team} adjust the routine to the conditions of {player}'s release.

### `legal.bail_conditions_modified`

**Trigger:** Court modifies existing pretrial release terms to allow a specified basketball trip; no dismissal or acquittal occurs.

**Placeholders:** `{city}`, `{player}`, `{team}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; court_calendar; attendance_order; release_conditions; travel_permissions; player_availability; media_visibility

**Consequences:** Apply the actual procedural order and related travel/availability changes; retain unresolved merits.

**Media examples:**

- Court permits {player}'s specified trip to {city}.
- A revised release order changes travel eligibility, not the case outcome.
- {team} receive clearance for the journey covered by the order.

### `legal.release_revoked_verified`

**Trigger:** Court revokes pretrial release after a verified breach of its conditions; guilt on the underlying charge remains undecided.

**Placeholders:** `{case}`, `{player}`, `{team}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; court_calendar; attendance_order; release_conditions; travel_permissions; player_availability; media_visibility

**Consequences:** Apply the actual procedural order and related travel/availability changes; retain unresolved merits.

**Media examples:**

- Court revokes {player}'s pretrial release after the condition breach.
- The breach changes custody status while {case} remains unresolved.
- {team} lose access to {player} under the court's new order.

### `legal.required_document_deadline_missed`

**Trigger:** Player's side misses a required court filing deadline and the court imposes the specified procedural consequence.

**Placeholders:** `{case}`, `{consequence}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; court_calendar; attendance_order; release_conditions; travel_permissions; player_availability; media_visibility

**Consequences:** Apply the actual procedural order and related travel/availability changes; retain unresolved merits.

**Media examples:**

- Missed filing deadline brings {consequence} in {player}'s case.
- The legal team faces a consequence before the merits are decided.
- {case} changes course after the missed deadline.

### `legal.counsel_conflict_change`

**Trigger:** Court accepts replacement counsel after establishing a conflict of interest in the player's public case.

**Placeholders:** `{case}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; court_calendar; attendance_order; release_conditions; travel_permissions; player_availability; media_visibility

**Consequences:** Apply the actual procedural order and related travel/availability changes; retain unresolved merits.

**Media examples:**

- {player} changes counsel after a confirmed conflict.
- A new legal team takes over {case}.
- The representation changes while the underlying dispute continues.

### `legal.interpreter_requested_granted`

**Trigger:** Court grants a qualified interpreter for the player at a public hearing in a language he requests.

**Placeholders:** `{hearing}`, `{language}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; court_calendar; attendance_order; release_conditions; travel_permissions; player_availability; media_visibility

**Consequences:** Apply the actual procedural order and related travel/availability changes; retain unresolved merits.

**Media examples:**

- Court grants {player} an interpreter for {hearing}.
- The proceeding will include qualified language support.
- {player}'s hearing gets the requested {language} interpretation.

### `legal.accessible_hearing_accommodation`

**Trigger:** Court grants a requested accessibility accommodation for a public proceeding; private medical details are not disclosed.

**Placeholders:** `{accommodation}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; court_calendar; attendance_order; release_conditions; travel_permissions; player_availability; media_visibility

**Consequences:** Apply the actual procedural order and related travel/availability changes; retain unresolved merits.

**Media examples:**

- {player}'s hearing receives the requested access accommodation.
- Court arrangements change so {player} can participate.
- The proceeding continues with {accommodation} in place.

### `legal.jury_duty_selection`

**Trigger:** Player is selected for lawful civic jury service and the club confirms the resulting dates of unavailability.

**Placeholders:** `{dates}`, `{player}`, `{team}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; court_calendar; attendance_order; release_conditions; travel_permissions; player_availability; media_visibility

**Consequences:** Apply the actual procedural order and related travel/availability changes; retain unresolved merits.

**Media examples:**

- Jury service takes {player} away from {team} for {dates}.
- The summons becomes an actual civic assignment.
- Basketball shares the calendar with {player}'s jury duty.

### `legal.witness_testimony_leave`

**Trigger:** Player is required to testify as a witness in another person's case and the club grants time away; he is not accused.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; court_calendar; attendance_order; release_conditions; travel_permissions; player_availability; media_visibility

**Consequences:** Apply the actual procedural order and related travel/availability changes; retain unresolved merits.

**Media examples:**

- {player} takes leave to testify as a witness.
- A required appearance changes {team}'s schedule without an accusation against their player.
- The courtroom calls {player} in a witness role.

### `legal.emergency_hearing_delays_trip`

**Trigger:** Court schedules an urgent mandatory hearing before a planned flight; the player actually misses departure.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; court_calendar; attendance_order; release_conditions; travel_permissions; player_availability; media_visibility

**Consequences:** Apply the actual procedural order and related travel/availability changes; retain unresolved merits.

**Media examples:**

- Urgent hearing keeps {player} off {team}'s departing flight.
- The team leave while {player} meets the court's attendance requirement.
- An emergency legal date splits the travel party.

### `legal.trial_calendar_rescheduled`

**Trigger:** Court postpones the scheduled trial for an identified procedural reason, with a new public date established.

**Placeholders:** `{case}`, `{date}`, `{player}`, `{reason}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; court_calendar; attendance_order; release_conditions; travel_permissions; player_availability; media_visibility

**Consequences:** Apply the actual procedural order and related travel/availability changes; retain unresolved merits.

**Media examples:**

- {player}'s trial moves to {date}.
- The calendar changes after {reason}; no verdict has been reached.
- {case} remains pending under the revised trial date.

### `legal.court_appearance_no_show`

**Trigger:** Court formally finds the player failed to attend a required appearance without an accepted excuse and issues the specified order.

**Placeholders:** `{case}`, `{order}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; court_calendar; attendance_order; release_conditions; travel_permissions; player_availability; media_visibility

**Consequences:** Apply the actual procedural order and related travel/availability changes; retain unresolved merits.

**Media examples:**

- Court issues {order} after {player} misses the required hearing.
- A missed appearance creates a new procedural problem in {case}.
- The legal calendar now carries the consequence of {player}'s absence.

### `legal.competency_review_ordered`

**Trigger:** Court orders a qualified competency assessment and pauses the affected proceeding; no medical conclusion is yet reached.

**Placeholders:** `{case}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; court_calendar; attendance_order; release_conditions; travel_permissions; player_availability; media_visibility

**Consequences:** Apply the actual procedural order and related travel/availability changes; retain unresolved merits.

**Media examples:**

- Court pauses {case} for a qualified competency review.
- The assessment is ordered; its result is not yet known.
- {player}'s proceeding waits for the independent evaluation.

## 90. Evidence, trial procedure, and public findings

### `legal.juror_misconduct_hearing`

**Trigger:** Court opens a hearing into documented juror misconduct in the player's trial; the trial outcome is not automatically void.

**Placeholders:** `{case}`, `{issue}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; charges; admissible_evidence; trial_stage; orders; appeal_status; media_visibility

**Consequences:** Update the specified evidence, proceeding, order, or review route without inventing a final outcome.

**Media examples:**

- Court examines juror misconduct in {player}'s trial.
- A courtroom integrity question creates a separate hearing.
- The court reviews {issue} before deciding its effect on {case}.

### `legal.venue_change_bias`

**Trigger:** Court grants a change of venue after finding the applicable fairness criteria satisfied; the trial remains pending.

**Placeholders:** `{city}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; charges; admissible_evidence; trial_stage; orders; appeal_status; media_visibility

**Consequences:** Update the specified evidence, proceeding, order, or review route without inventing a final outcome.

**Media examples:**

- {player}'s trial moves to {city} under a fairness ruling.
- A new venue replaces the disputed setting.
- The case continues before a different local audience.

### `legal.publicity_restriction_imposed`

**Trigger:** Court imposes a lawful restriction on public statements by named case participants and the terms are public.

**Placeholders:** `{case}`, `{player}`, `{restriction}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; charges; admissible_evidence; trial_stage; orders; appeal_status; media_visibility

**Consequences:** Update the specified evidence, proceeding, order, or review route without inventing a final outcome.

**Media examples:**

- Court restrict public statements about {case}.
- {player}'s public comments must stay within {restriction}.
- The proceeding moves under a new communication order.

### `legal.sealed_exhibit_public_summary`

**Trigger:** Court authorizes a narrowly defined public summary of a sealed exhibit while protecting its contents.

**Placeholders:** `{case}`, `{summary}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; charges; admissible_evidence; trial_stage; orders; appeal_status; media_visibility

**Consequences:** Update the specified evidence, proceeding, order, or review route without inventing a final outcome.

**Media examples:**

- Court releases a limited summary in {case}.
- The permitted update leaves the sealed material protected.
- Public coverage gains {summary}, not the entire private exhibit.

### `legal.expert_opinion_excluded`

**Trigger:** Court rules a proposed expert opinion inadmissible under the applicable standard; other evidence remains active.

**Placeholders:** `{case}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; charges; admissible_evidence; trial_stage; orders; appeal_status; media_visibility

**Consequences:** Update the specified evidence, proceeding, order, or review route without inventing a final outcome.

**Media examples:**

- Court excludes the proposed expert opinion in {case}.
- {player}'s trial proceeds without that testimony.
- The admissibility ruling removes one planned strand of evidence.

### `legal.partial_count_withdrawal`

**Trigger:** Prosecutor formally withdraws specified counts while other identified charges against the player remain pending.

**Placeholders:** `{case}`, `{counts}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; charges; admissible_evidence; trial_stage; orders; appeal_status; media_visibility

**Consequences:** Update the specified evidence, proceeding, order, or review route without inventing a final outcome.

**Media examples:**

- Prosecutors withdraw {counts} in {player}'s case.
- Some charges leave the case; the remaining counts still await resolution.
- {case} narrows without ending.

### `legal.negotiated_charge_reduction`

**Trigger:** Authorities formally replace a filed charge with a specified lesser charge; no plea or verdict is assumed.

**Placeholders:** `{charge}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; charges; admissible_evidence; trial_stage; orders; appeal_status; media_visibility

**Consequences:** Update the specified evidence, proceeding, order, or review route without inventing a final outcome.

**Media examples:**

- {player}'s filed charge changes to {charge}.
- The case continues on the amended charging document.
- A reduced allegation changes the stakes before any verdict.

### `legal.plea_offer_rejected`

**Trigger:** Player declines a documented plea proposal and the case continues toward trial; guilt remains unresolved.

**Placeholders:** `{case}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; charges; admissible_evidence; trial_stage; orders; appeal_status; media_visibility

**Consequences:** Update the specified evidence, proceeding, order, or review route without inventing a final outcome.

**Media examples:**

- {player} rejects the proposed plea agreement.
- The offer is declined, and {case} continues toward a contested hearing.
- The legal team choose trial over the proposed resolution.

### `legal.plea_withdrawal_allowed`

**Trigger:** Court permits withdrawal of a previously accepted plea under its applicable rules; the remaining case status is specified.

**Placeholders:** `{player}`, `{status}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; charges; admissible_evidence; trial_stage; orders; appeal_status; media_visibility

**Consequences:** Update the specified evidence, proceeding, order, or review route without inventing a final outcome.

**Media examples:**

- Court allows {player} to withdraw the prior plea.
- The case returns to {status} under the new ruling.
- An accepted resolution reopens for further proceedings.

### `legal.new_trial_granted`

**Trigger:** Court grants a new trial after identifying a specific defect; the order does not itself establish innocence.

**Placeholders:** `{defect}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; charges; admissible_evidence; trial_stage; orders; appeal_status; media_visibility

**Consequences:** Update the specified evidence, proceeding, order, or review route without inventing a final outcome.

**Media examples:**

- Court grants {player} a new trial after finding {defect}.
- Another hearing will test the case under the corrected process.
- The new-trial order changes the procedure without deciding innocence.

### `legal.verdict_readback_corrected`

**Trigger:** Court corrects a documented clerical error in the public verdict record without changing the adjudicated outcome.

**Placeholders:** `{case}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; charges; admissible_evidence; trial_stage; orders; appeal_status; media_visibility

**Consequences:** Update the specified evidence, proceeding, order, or review route without inventing a final outcome.

**Media examples:**

- Court corrects the public record of {player}'s verdict.
- The clerical mistake is fixed; the actual decision stays intact.
- {case}'s official entry now matches the ruling that was delivered.

### `legal.sentence_credit_corrected`

**Trigger:** Court corrects the calculation of legally credited time under an existing sentence; the revised dates are supplied.

**Placeholders:** `{date}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; charges; admissible_evidence; trial_stage; orders; appeal_status; media_visibility

**Consequences:** Update the specified evidence, proceeding, order, or review route without inventing a final outcome.

**Media examples:**

- Court corrects the credited time in {player}'s sentence.
- The revised order changes {date} in the existing legal schedule.
- A calculation correction changes the sentence ledger.

### `legal.appellate_stay_granted`

**Trigger:** Appellate court grants a specific temporary stay pending review; the challenged judgment remains otherwise recorded.

**Placeholders:** `{case}`, `{measure}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; charges; admissible_evidence; trial_stage; orders; appeal_status; media_visibility

**Consequences:** Update the specified evidence, proceeding, order, or review route without inventing a final outcome.

**Media examples:**

- Appeal court pauses {measure} while reviewing {player}'s case.
- The stay delays enforcement within its stated limits.
- {case} enters review with a temporary restriction on enforcement.

### `legal.appeal_permission_denied`

**Trigger:** Competent court declines permission for the specified further appeal; no claim is made about unrelated available remedies.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; charges; admissible_evidence; trial_stage; orders; appeal_status; media_visibility

**Consequences:** Update the specified evidence, proceeding, order, or review route without inventing a final outcome.

**Media examples:**

- Court denies permission for {player}'s specified further appeal.
- That review route closes under the published decision.
- The existing judgment remains unaffected by this application.

### `legal.independent_review_referral`

**Trigger:** Authorized review body refers a concluded conviction for fresh judicial examination based on a publicly stated concern.

**Placeholders:** `{concern}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; charges; admissible_evidence; trial_stage; orders; appeal_status; media_visibility

**Consequences:** Update the specified evidence, proceeding, order, or review route without inventing a final outcome.

**Media examples:**

- Review body refers {player}'s conviction for fresh examination.
- {concern} opens a new route back to court.
- The referral requests scrutiny; it does not itself reverse the judgment.

## 91. Restrictions, compliance, and restoration

### `legal.travel_permission_expired`

**Trigger:** A time-limited court travel authorization expires before a planned team journey and no renewal has been granted.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; supervision_conditions; obligations; compliance_records; authorization_status; public_consent

**Consequences:** Change only the identified restriction, duty, or authorization; persist remaining conditions and future deadlines.

**Media examples:**

- {player} cannot use the expired travel authorization for {team}'s trip.
- The legal permission runs out before departure.
- A pending renewal leaves {player} off the travel list.

### `legal.monitoring_equipment_exception`

**Trigger:** Authorities grant a specific competition-compatible exception to a lawful monitoring condition without ending supervision.

**Placeholders:** `{condition}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; supervision_conditions; obligations; compliance_records; authorization_status; public_consent

**Consequences:** Change only the identified restriction, duty, or authorization; persist remaining conditions and future deadlines.

**Media examples:**

- {player} receives a competition exception within his monitoring order.
- The approved adjustment permits play under {condition}.
- Supervision continues with a basketball-specific arrangement.

### `legal.restitution_installment_default`

**Trigger:** Supervising authority confirms an unpaid required installment and initiates the specified compliance review, without automatic incarceration.

**Placeholders:** `{action}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; supervision_conditions; obligations; compliance_records; authorization_status; public_consent

**Consequences:** Change only the identified restriction, duty, or authorization; persist remaining conditions and future deadlines.

**Media examples:**

- Missed restitution payment sends {player} into a compliance review.
- The required installment is unpaid; {action} begins.
- A payment obligation creates a new legal checkpoint.

### `legal.restitution_schedule_revised`

**Trigger:** Court approves a revised payment schedule after reviewing documented circumstances; the obligation remains.

**Placeholders:** `{player}`, `{terms}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; supervision_conditions; obligations; compliance_records; authorization_status; public_consent

**Consequences:** Change only the identified restriction, duty, or authorization; persist remaining conditions and future deadlines.

**Media examples:**

- Court revises {player}'s restitution schedule.
- The payment plan changes to {terms}, while the debt remains due.
- A new timetable replaces the original court-approved schedule.

### `legal.service_assignment_safety_change`

**Trigger:** Supervising body changes a service assignment after finding a documented safety or access concern, with required hours preserved.

**Placeholders:** `{assignment}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; supervision_conditions; obligations; compliance_records; authorization_status; public_consent

**Consequences:** Change only the identified restriction, duty, or authorization; persist remaining conditions and future deadlines.

**Media examples:**

- {player}'s service assignment changes after the safety review.
- The work requirement remains, but {assignment} replaces the prior placement.
- Compliance continues under the revised arrangement.

### `legal.supervision_transfer_approved`

**Trigger:** Authorities approve a lawful transfer of supervision to accommodate a completed team move; all remaining conditions are retained.

**Placeholders:** `{city}`, `{player}`, `{team}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; supervision_conditions; obligations; compliance_records; authorization_status; public_consent

**Consequences:** Change only the identified restriction, duty, or authorization; persist remaining conditions and future deadlines.

**Media examples:**

- Authorities transfer {player}'s supervision to {city}.
- The legal administration follows his basketball move.
- {team} receive him with the existing conditions still in force.

### `legal.supervision_violation_dismissed`

**Trigger:** Authorized hearing rejects an alleged supervision breach after reviewing evidence; the underlying supervision continues.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; supervision_conditions; obligations; compliance_records; authorization_status; public_consent

**Consequences:** Change only the identified restriction, duty, or authorization; persist remaining conditions and future deadlines.

**Media examples:**

- Hearing rejects the alleged supervision breach by {player}.
- The disputed incident produces no violation finding.
- {player}'s existing supervision continues without the proposed penalty.

### `legal.restricted_contact_accidental_review`

**Trigger:** Authorities investigate a documented incidental contact under an existing order and formally find no actionable breach.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; supervision_conditions; obligations; compliance_records; authorization_status; public_consent

**Consequences:** Change only the identified restriction, duty, or authorization; persist remaining conditions and future deadlines.

**Media examples:**

- Review find no actionable breach in {player}'s incidental contact.
- The event is examined under the existing order and cleared.
- The restriction remains, but this encounter brings no violation finding.

### `legal.license_reinstated_driving`

**Trigger:** Licensing authority restores the player's driving entitlement after all applicable requirements are met; no wider clearance is implied.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; supervision_conditions; obligations; compliance_records; authorization_status; public_consent

**Consequences:** Change only the identified restriction, duty, or authorization; persist remaining conditions and future deadlines.

**Media examples:**

- {player}'s driving entitlement is restored.
- The completed requirements put him legally back behind the wheel.
- The licensing decision changes transport options for {player}.

### `legal.passport_return_order`

**Trigger:** Court orders return of a previously surrendered passport and specifies any remaining travel restrictions.

**Placeholders:** `{player}`, `{terms}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; supervision_conditions; obligations; compliance_records; authorization_status; public_consent

**Consequences:** Change only the identified restriction, duty, or authorization; persist remaining conditions and future deadlines.

**Media examples:**

- Court returns {player}'s passport under {terms}.
- The document comes back; the remaining restrictions still apply.
- {player}'s travel status changes only as far as the order permits.

### `legal.record_disclosure_limit_enforced`

**Trigger:** Court enforces an applicable limit on disclosure of protected historical records and orders the specified publication action.

**Placeholders:** `{order}`, `{player}`, `{publication}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; supervision_conditions; obligations; compliance_records; authorization_status; public_consent

**Consequences:** Change only the identified restriction, duty, or authorization; persist remaining conditions and future deadlines.

**Media examples:**

- Court enforces the protected-record limit in {player}'s case.
- {publication} must follow {order} concerning the restricted material.
- Historical records receive the protection established by the ruling.

### `legal.immigration_registration_gap`

**Trigger:** Authorized immigration decision lawfully interrupts sporting work authorization; the club confirms the resulting eligibility gap.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; supervision_conditions; obligations; compliance_records; authorization_status; public_consent

**Consequences:** Change only the identified restriction, duty, or authorization; persist remaining conditions and future deadlines.

**Media examples:**

- {player}'s work authorization gap interrupts registration with {team}.
- The administrative decision affects playing eligibility, not his basketball ability.
- {team} wait for the lawful registration route to reopen.

### `legal.immigration_appeal_success`

**Trigger:** Authorized tribunal reverses the specified work-authorization denial and sporting registration is separately completed.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; supervision_conditions; obligations; compliance_records; authorization_status; public_consent

**Consequences:** Change only the identified restriction, duty, or authorization; persist remaining conditions and future deadlines.

**Media examples:**

- {player}'s successful authorization appeal clears the route back to {team}.
- The administrative reversal is followed by completed registration.
- The paperwork barrier finally lifts for {player}.

### `legal.rehabilitation_certificate_granted`

**Trigger:** Applicable authority grants a jurisdiction-specific rehabilitation certificate after its requirements are met; its legal effects are explicitly supplied.

**Placeholders:** `{certificate}`, `{effect}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; supervision_conditions; obligations; compliance_records; authorization_status; public_consent

**Consequences:** Change only the identified restriction, duty, or authorization; persist remaining conditions and future deadlines.

**Media examples:**

- {player} receives {certificate} after meeting its requirements.
- The certificate grants {effect}, within the authority's stated limits.
- A completed rehabilitation process changes one part of {player}'s legal status.

### `legal.voluntary_accountability_meeting`

**Trigger:** Player and an affected consenting adult complete a professionally facilitated restorative meeting without replacing any mandatory legal duty.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** case_id; supervision_conditions; obligations; compliance_records; authorization_status; public_consent

**Consequences:** Change only the identified restriction, duty, or authorization; persist remaining conditions and future deadlines.

**Media examples:**

- {player} completes the agreed restorative meeting.
- The participants meet voluntarily while legal duties remain separate.
- A conversation creates a recovery step without erasing the case history.

## 92. Civil rights, property, and consumer remedies

### `civil.counterfeit_merchandise_removed`

**Trigger:** Court or authorized enforcement body orders removal of proven counterfeit merchandise falsely presented as authorized by the player; removal is completed.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** civil_case_id; claimant; respondent; findings; remedy; enforcement_status; public_record

**Consequences:** Apply the established remedy or actual enforcement result to relevant rights, assets, and reputation.

**Media examples:**

- Counterfeit merchandise falsely tied to {player} is removed.
- The fake collection disappears after the enforcement order.
- {player}'s authorized products no longer share that outlet with the proven knockoffs.

### `civil.ticket_scam_refunds_ordered`

**Trigger:** Court finds a promoter liable for selling a nonexistent player appearance and orders refunds; player did not authorize the appearance.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** civil_case_id; claimant; respondent; findings; remedy; enforcement_status; public_record

**Consequences:** Apply the established remedy or actual enforcement result to relevant rights, assets, and reputation.

**Media examples:**

- Court orders refunds for the fake {player} appearance.
- Fans paid for a visit that {player} never agreed to make.
- The promoter's false booking ends in an enforceable refund order.

### `civil.unpaid_appearance_fee_recovered`

**Trigger:** Player receives a court-enforced payment for an actual completed appearance after a promoter failed to pay.

**Placeholders:** `{amount}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** civil_case_id; claimant; respondent; findings; remedy; enforcement_status; public_record

**Consequences:** Apply the established remedy or actual enforcement result to relevant rights, assets, and reputation.

**Media examples:**

- {player} recovers {amount} for the unpaid appearance.
- The appearance happened. The payment finally follows.
- Enforcement turns the completed event into the compensation owed.

### `civil.loan_document_forgery_ruling`

**Trigger:** Civil court finds the player's purported loan signature was forged and rules he has no obligation on that document.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** civil_case_id; claimant; respondent; findings; remedy; enforcement_status; public_record

**Consequences:** Apply the established remedy or actual enforcement result to relevant rights, assets, and reputation.

**Media examples:**

- Court rejects the forged loan document bearing {player}'s name.
- {player} is not liable for the loan established through the false signature.
- A fraudulent document no longer creates a debt against {player}.

### `civil.identity_theft_accounts_corrected`

**Trigger:** Relevant institutions complete correction of publicly disclosed fraudulent accounts opened in the player's identity.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** civil_case_id; claimant; respondent; findings; remedy; enforcement_status; public_record

**Consequences:** Apply the established remedy or actual enforcement result to relevant rights, assets, and reputation.

**Media examples:**

- Fraudulent accounts in {player}'s name are corrected.
- The identity-theft cleanup reaches the institutions holding the false debts.
- {player}'s financial record sheds the accounts he never opened.

### `civil.property_boundary_judgment`

**Trigger:** Court resolves a publicly disclosed property-boundary dispute affecting the player's home and orders the specified correction.

**Placeholders:** `{player}`, `{remedy}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** civil_case_id; claimant; respondent; findings; remedy; enforcement_status; public_record

**Consequences:** Apply the established remedy or actual enforcement result to relevant rights, assets, and reputation.

**Media examples:**

- Court resolves {player}'s boundary dispute with {remedy}.
- The contested strip of land finally gets a legal answer.
- {player}'s home map changes under the property ruling.

### `civil.construction_defect_remedy`

**Trigger:** Court finds a contractor liable for proven defects in the player's property and orders repairs or compensation.

**Placeholders:** `{player}`, `{remedy}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** civil_case_id; claimant; respondent; findings; remedy; enforcement_status; public_record

**Consequences:** Apply the established remedy or actual enforcement result to relevant rights, assets, and reputation.

**Media examples:**

- Proven defects bring {player} a remedy against the contractor.
- The expensive renovation ends with a court-ordered correction.
- {remedy} becomes the legal response to the faulty work.

### `civil.insurance_denial_overturned`

**Trigger:** Authorized tribunal reverses a specific wrongful insurance denial and orders coverage for the identified loss.

**Placeholders:** `{loss}`, `{player}`, `{remedy}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** civil_case_id; claimant; respondent; findings; remedy; enforcement_status; public_record

**Consequences:** Apply the established remedy or actual enforcement result to relevant rights, assets, and reputation.

**Media examples:**

- Tribunal overturns the denied claim for {player}'s {loss}.
- The coverage dispute ends with an order honoring the claim.
- The insurer must provide {remedy} under the ruling.

### `civil.unwanted_tracking_injunction`

**Trigger:** Court orders a proven unauthorized commercial tracking activity involving the player to stop; no criminal guilt is implied.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** civil_case_id; claimant; respondent; findings; remedy; enforcement_status; public_record

**Consequences:** Apply the established remedy or actual enforcement result to relevant rights, assets, and reputation.

**Media examples:**

- Court halts the unauthorized tracking of {player}.
- The injunction puts a legal boundary around the proven surveillance.
- {player}'s privacy claim produces an enforceable stop order.

### `civil.doxxing_removal_compliance`

**Trigger:** Competent authority lawfully orders removal of unlawfully published private location data; the publisher actually complies.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** civil_case_id; claimant; respondent; findings; remedy; enforcement_status; public_record

**Consequences:** Apply the established remedy or actual enforcement result to relevant rights, assets, and reputation.

**Media examples:**

- Unlawfully published location details concerning {player} are removed.
- The disclosure comes down after the enforceable privacy order.
- {player}'s current whereabouts stop circulating through that publication.

### `civil.access_discrimination_remedy`

**Trigger:** Tribunal finds a specific unlawful accessibility denial affecting the player and orders a public remedy.

**Placeholders:** `{player}`, `{remedy}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** civil_case_id; claimant; respondent; findings; remedy; enforcement_status; public_record

**Consequences:** Apply the established remedy or actual enforcement result to relevant rights, assets, and reputation.

**Media examples:**

- Tribunal orders {remedy} after the access denial involving {player}.
- The complaint produces a finding and a practical correction.
- The proven barrier receives an enforceable response.

### `civil.workplace_retaliation_finding`

**Trigger:** Authorized tribunal finds the club unlawfully retaliated against the player for a protected complaint and orders the stated remedy.

**Placeholders:** `{player}`, `{remedy}`, `{team}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** civil_case_id; claimant; respondent; findings; remedy; enforcement_status; public_record

**Consequences:** Apply the established remedy or actual enforcement result to relevant rights, assets, and reputation.

**Media examples:**

- Tribunal finds unlawful retaliation against {player}.
- {team} must apply {remedy} under the employment ruling.
- The protected complaint becomes a case the club cannot dismiss as ordinary friction.

### `civil.defamation_claim_rejected`

**Trigger:** Court rejects the player's specified defamation claim on its merits; no claim is made that every challenged statement was true.

**Placeholders:** `{case}`, `{grounds}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** civil_case_id; claimant; respondent; findings; remedy; enforcement_status; public_record

**Consequences:** Apply the established remedy or actual enforcement result to relevant rights, assets, and reputation.

**Media examples:**

- Court rejects {player}'s specified defamation claim.
- The civil claim fails under {grounds}; the ruling has stated limits.
- {case} ends without the requested defamation remedy.

### `civil.confidential_settlement_breach`

**Trigger:** Tribunal establishes breach of an enforceable confidentiality term and orders a specified remedy without disclosing protected settlement terms.

**Placeholders:** `{case}`, `{remedy}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** civil_case_id; claimant; respondent; findings; remedy; enforcement_status; public_record

**Consequences:** Apply the established remedy or actual enforcement result to relevant rights, assets, and reputation.

**Media examples:**

- Tribunal finds a confidentiality breach in {case}.
- The public ruling identifies the breach while protected terms stay private.
- {remedy} follows the established disclosure violation.

### `civil.volunteer_injury_liability_rejected`

**Trigger:** Court finds the player not liable under the applicable facts for an injury at a publicly known volunteer event.

**Placeholders:** `{event}`, `{player}`

**Modes:** player

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** civil_case_id; claimant; respondent; findings; remedy; enforcement_status; public_record

**Consequences:** Apply the established remedy or actual enforcement result to relevant rights, assets, and reputation.

**Media examples:**

- Court rejects the liability claim against {player} over {event}.
- The event's injury does not create the alleged civil responsibility.
- {player}'s volunteer-event dispute ends without the proposed damages award.

## 93. Sporting disputes, sanctions, and independent review

### `sportlaw.failed_test_sample_identity`

**Trigger:** Accredited review establishes that an adverse test sample was assigned to the wrong player; the relevant allegation is formally withdrawn.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** proceeding_id; policy_version; evidence; finding; sanction; eligibility; appeal_status; media_visibility

**Consequences:** Apply the actual sporting ruling separately from criminal or civil cases; update eligibility, registration, or the identified result.

**Media examples:**

- Testing review clears {player} after the sample identification error.
- The sample was not his. The allegation is withdrawn.
- A corrected identity changes the anti-doping case.

### `sportlaw.positive_b_sample_confirmation`

**Trigger:** Accredited B-sample analysis confirms the recorded adverse finding, and the competent body begins its specified proceeding; no final sanction yet.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** proceeding_id; policy_version; evidence; finding; sanction; eligibility; appeal_status; media_visibility

**Consequences:** Apply the actual sporting ruling separately from criminal or civil cases; update eligibility, registration, or the identified result.

**Media examples:**

- B-sample analysis confirms the adverse finding involving {player}.
- The test result advances the proceeding without announcing a final sanction.
- {player}'s case moves to the governing body's review stage.

### `sportlaw.contamination_finding_reduction`

**Trigger:** Competent panel finds proven contamination and applies a specified reduced sanction under its actual policy.

**Placeholders:** `{player}`, `{sanction}`

**Modes:** player; franchise

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** proceeding_id; policy_version; evidence; finding; sanction; eligibility; appeal_status; media_visibility

**Consequences:** Apply the actual sporting ruling separately from criminal or civil cases; update eligibility, registration, or the identified result.

**Media examples:**

- Panel reduces {player}'s sanction after finding proven contamination.
- The decision changes the penalty to {sanction}.
- The established source matters under the governing body's rules.

### `sportlaw.whereabouts_notice_corrected`

**Trigger:** Governing body corrects an erroneous whereabouts notice after authenticated reporting records establish compliance.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** proceeding_id; policy_version; evidence; finding; sanction; eligibility; appeal_status; media_visibility

**Consequences:** Apply the actual sporting ruling separately from criminal or civil cases; update eligibility, registration, or the identified result.

**Media examples:**

- Governing body corrects the whereabouts notice concerning {player}.
- His submitted record meets the requirement, and the notice is withdrawn.
- {player}'s reporting file loses an incorrectly recorded failure.

### `sportlaw.test_refusal_finding`

**Trigger:** Competent panel finds an unjustified refusal under its testing policy and enters the actual sanction, after hearing the defense.

**Placeholders:** `{player}`, `{sanction}`, `{team}`

**Modes:** player; franchise

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** proceeding_id; policy_version; evidence; finding; sanction; eligibility; appeal_status; media_visibility

**Consequences:** Apply the actual sporting ruling separately from criminal or civil cases; update eligibility, registration, or the identified result.

**Media examples:**

- Panel imposes {sanction} after finding a testing refusal by {player}.
- The hearing reaches a policy finding and an entered penalty.
- {team} receive the eligibility consequence specified in the ruling.

### `sportlaw.contaminated_batch_recall`

**Trigger:** Authority confirms a batch of a legally sold product is contaminated and a club removes that batch from its facilities; no player violation assumed.

**Placeholders:** `{product}`, `{team}`

**Modes:** player; franchise

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** proceeding_id; policy_version; evidence; finding; sanction; eligibility; appeal_status; media_visibility

**Consequences:** Apply the actual sporting ruling separately from criminal or civil cases; update eligibility, registration, or the identified result.

**Media examples:**

- {team} remove the recalled {product} batch from their facilities.
- A confirmed contamination alert reaches the training supplies.
- The club act on the recall without announcing a player violation.

### `sportlaw.sanction_clock_miscalculation`

**Trigger:** Independent panel corrects a miscalculated sporting suspension end date; the corrected eligibility date is publicly supplied.

**Placeholders:** `{date}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** proceeding_id; policy_version; evidence; finding; sanction; eligibility; appeal_status; media_visibility

**Consequences:** Apply the actual sporting ruling separately from criminal or civil cases; update eligibility, registration, or the identified result.

**Media examples:**

- Panel corrects {player}'s suspension end date to {date}.
- A calendar error changes the eligibility timetable.
- {team}'s return plan now follows the corrected ruling.

### `sportlaw.double_discipline_limit`

**Trigger:** Authorized panel finds the same sporting incident was penalized twice contrary to policy and removes the duplicate sanction.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** proceeding_id; policy_version; evidence; finding; sanction; eligibility; appeal_status; media_visibility

**Consequences:** Apply the actual sporting ruling separately from criminal or civil cases; update eligibility, registration, or the identified result.

**Media examples:**

- Panel removes the duplicate penalty against {player}.
- One incident cannot carry that extra sanction under the applicable policy.
- The original ruling remains; the improper second penalty does not.

### `sportlaw.player_sanction_stay`

**Trigger:** Authorized sports tribunal temporarily stays a specific league sanction pending a timely appeal; final merits remain unresolved.

**Placeholders:** `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** proceeding_id; policy_version; evidence; finding; sanction; eligibility; appeal_status; media_visibility

**Consequences:** Apply the actual sporting ruling separately from criminal or civil cases; update eligibility, registration, or the identified result.

**Media examples:**

- Tribunal pauses {player}'s league sanction during review.
- Eligibility follows the temporary order while the appeal continues.
- {team} get an interim ruling, rather than a final victory in the case.

### `sportlaw.team_sanction_evidence_release`

**Trigger:** League lawfully publishes the evidentiary basis for an existing team sanction, with protected personal information removed.

**Placeholders:** `{team}`

**Modes:** player; franchise

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** proceeding_id; policy_version; evidence; finding; sanction; eligibility; appeal_status; media_visibility

**Consequences:** Apply the actual sporting ruling separately from criminal or civil cases; update eligibility, registration, or the identified result.

**Media examples:**

- League release the public evidence behind {team}'s sanction.
- The ruling's stated basis becomes available for scrutiny.
- The penalty debate gains facts while private details remain protected.

### `sportlaw.match_result_restored`

**Trigger:** Authorized appeal overturns a specific improper administrative forfeiture and restores the original played result.

**Placeholders:** `{opp}`, `{team}`

**Modes:** player; franchise

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** proceeding_id; policy_version; evidence; finding; sanction; eligibility; appeal_status; media_visibility

**Consequences:** Apply the actual sporting ruling separately from criminal or civil cases; update eligibility, registration, or the identified result.

**Media examples:**

- Appeal restores {team}'s played result against {opp}.
- The administrative forfeiture is reversed; the original score returns.
- A ruling changes the standings back to the result earned on court.

### `sportlaw.eligibility_document_misread`

**Trigger:** Authorized panel finds a valid registration document was misread and corrects a player's ineligibility finding.

**Placeholders:** `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** proceeding_id; policy_version; evidence; finding; sanction; eligibility; appeal_status; media_visibility

**Consequences:** Apply the actual sporting ruling separately from criminal or civil cases; update eligibility, registration, or the identified result.

**Media examples:**

- Panel restores {player}'s registration after finding the document error.
- The paperwork was valid, and the eligibility ruling is corrected.
- {team} regain access to their properly registered player.

### `sportlaw.coach_license_appeal`

**Trigger:** Licensing panel overturns a coach's specific licensing suspension after reviewing the recorded appeal grounds.

**Placeholders:** `{coach}`, `{team}`

**Modes:** player; franchise

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** proceeding_id; policy_version; evidence; finding; sanction; eligibility; appeal_status; media_visibility

**Consequences:** Apply the actual sporting ruling separately from criminal or civil cases; update eligibility, registration, or the identified result.

**Media examples:**

- Panel overturns {coach}'s licensing suspension.
- The appeal reopens the coaching eligibility route for {team}.
- {coach}'s professional status changes under the independent decision.

### `sportlaw.owner_sanction_personal_scope`

**Trigger:** Authorized ruling confines an owner's proven personal violation to the owner and explicitly preserves innocent players' eligibility.

**Placeholders:** `{owner}`, `{sanction}`, `{team}`

**Modes:** player; franchise

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** proceeding_id; policy_version; evidence; finding; sanction; eligibility; appeal_status; media_visibility

**Consequences:** Apply the actual sporting ruling separately from criminal or civil cases; update eligibility, registration, or the identified result.

**Media examples:**

- Ruling penalizes {owner} while preserving {team}'s player eligibility.
- The finding sets a boundary between ownership conduct and the roster.
- The owner faces {sanction}; the players remain eligible under the order.

### `sportlaw.hearing_translation_error`

**Trigger:** Independent sports tribunal orders a new hearing after establishing that a material translation error prevented a fair defense.

**Placeholders:** `{player}`

**Modes:** player; franchise

**Availability:** Fictional applicable jurisdiction or sporting policy, appropriate competition and era; emit only from an authorized public record.

**Required state:** proceeding_id; policy_version; evidence; finding; sanction; eligibility; appeal_status; media_visibility

**Consequences:** Apply the actual sporting ruling separately from criminal or civil cases; update eligibility, registration, or the identified result.

**Media examples:**

- Translation error sends {player}'s sporting case to a new hearing.
- The first process fails the panel's fairness review.
- Another hearing will consider the defense with accurate interpretation.

## 94. Diagnosis, monitoring, and medical discovery

### `medical.screening_heart_followup`

**Trigger:** A qualified screening identifies a cardiac finding requiring further assessment; player consents to a limited public availability update and no diagnosis is presumed.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Qualified medical assessment and consented public disclosure; details remain private otherwise. Medical effects require actual recorded results.

**Required state:** assessment_id; qualified_medical_findings; consented_disclosure; care_plan; workload; availability

**Consequences:** Apply clinician-established availability and care changes; outcomes remain conditional and private information requires consent.

**Media examples:**

- {player} pauses play for a cardiac follow-up assessment.
- Screening prompts another medical check before a return decision.
- {team} wait for qualified answers rather than guessing at the finding.

### `medical.false_positive_resolved`

**Trigger:** Qualified confirmatory assessment establishes that a previously disclosed screening result was false positive and clinicians issue the actual updated plan.

**Placeholders:** `{plan}`, `{player}`, `{team}`

**Modes:** player

**Availability:** Qualified medical assessment and consented public disclosure; details remain private otherwise. Medical effects require actual recorded results.

**Required state:** assessment_id; qualified_medical_findings; consented_disclosure; care_plan; workload; availability

**Consequences:** Apply clinician-established availability and care changes; outcomes remain conditional and private information requires consent.

**Media examples:**

- Confirmatory tests resolve {player}'s false-positive screening result.
- The follow-up changes the medical picture to {plan}.
- {team} receive an updated plan after the initial alert is resolved.

### `medical.hidden_fracture_detected`

**Trigger:** Imaging and qualified review identify a previously missed fracture after persistent symptoms; player publicly discloses the revised diagnosis.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Qualified medical assessment and consented public disclosure; details remain private otherwise. Medical effects require actual recorded results.

**Required state:** assessment_id; qualified_medical_findings; consented_disclosure; care_plan; workload; availability

**Consequences:** Apply clinician-established availability and care changes; outcomes remain conditional and private information requires consent.

**Media examples:**

- Further imaging identifies {player}'s previously missed fracture.
- Persistent symptoms lead clinicians to a different answer.
- The diagnosis changes {team}'s plan for his return.

### `medical.food_allergy_travel_plan`

**Trigger:** Qualified evaluation establishes a food allergy and the player publicly confirms a team travel-meal accommodation.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Qualified medical assessment and consented public disclosure; details remain private otherwise. Medical effects require actual recorded results.

**Required state:** assessment_id; qualified_medical_findings; consented_disclosure; care_plan; workload; availability

**Consequences:** Apply clinician-established availability and care changes; outcomes remain conditional and private information requires consent.

**Media examples:**

- {team} change {player}'s travel meals after the confirmed allergy.
- The diagnosis reaches the team kitchen and the road routine.
- Meal planning becomes part of keeping {player}'s travel manageable.

### `medical.exercise_asthma_plan`

**Trigger:** A qualified clinician establishes an exercise-related respiratory condition and the player consents to disclosure of the resulting competition plan.

**Placeholders:** `{condition}`, `{player}`, `{team}`

**Modes:** player

**Availability:** Qualified medical assessment and consented public disclosure; details remain private otherwise. Medical effects require actual recorded results.

**Required state:** assessment_id; qualified_medical_findings; consented_disclosure; care_plan; workload; availability

**Consequences:** Apply clinician-established availability and care changes; outcomes remain conditional and private information requires consent.

**Media examples:**

- {player} receives a clinician-led competition plan for {condition}.
- The diagnosis gives {team} a specific availability arrangement.
- Medical planning replaces speculation about {player}'s breathing difficulties.

### `medical.anemia_workload_change`

**Trigger:** Qualified assessment identifies anemia and the player publicly announces the clinician-prescribed workload change; no cure is assumed.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Qualified medical assessment and consented public disclosure; details remain private otherwise. Medical effects require actual recorded results.

**Required state:** assessment_id; qualified_medical_findings; consented_disclosure; care_plan; workload; availability

**Consequences:** Apply clinician-established availability and care changes; outcomes remain conditional and private information requires consent.

**Media examples:**

- {player}'s workload changes after a confirmed anemia diagnosis.
- The care plan adjusts the basketball schedule.
- {team} follow the medical recommendation while treatment proceeds.

### `medical.hearing_issue_reversible`

**Trigger:** Qualified treatment resolves a publicly disclosed reversible hearing problem and the player reports the actual measured improvement.

**Placeholders:** `{improvement}`, `{player}`

**Modes:** player

**Availability:** Qualified medical assessment and consented public disclosure; details remain private otherwise. Medical effects require actual recorded results.

**Required state:** assessment_id; qualified_medical_findings; consented_disclosure; care_plan; workload; availability

**Consequences:** Apply clinician-established availability and care changes; outcomes remain conditional and private information requires consent.

**Media examples:**

- Treatment improves {player}'s disclosed hearing problem.
- The follow-up confirms {improvement}, rather than a guessed outcome.
- A measured recovery changes the communication challenge for {player}.

### `medical.vision_prescription_changed`

**Trigger:** Qualified assessment updates the player's prescription and approved equipment is fitted before his next appearance; he discloses the change.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Qualified medical assessment and consented public disclosure; details remain private otherwise. Medical effects require actual recorded results.

**Required state:** assessment_id; qualified_medical_findings; consented_disclosure; care_plan; workload; availability

**Consequences:** Apply clinician-established availability and care changes; outcomes remain conditional and private information requires consent.

**Media examples:**

- {player} takes a new prescription into his approved playing equipment.
- The fitting is complete before his next appearance for {team}.
- A different view of the court starts with the updated prescription.

### `medical.dental_infection_leave`

**Trigger:** A qualified clinician diagnoses a dental infection requiring treatment and the player authorizes an availability-only announcement.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Qualified medical assessment and consented public disclosure; details remain private otherwise. Medical effects require actual recorded results.

**Required state:** assessment_id; qualified_medical_findings; consented_disclosure; care_plan; workload; availability

**Consequences:** Apply clinician-established availability and care changes; outcomes remain conditional and private information requires consent.

**Media examples:**

- {player} takes treatment leave for the disclosed dental condition.
- A medical problem away from the usual injury report interrupts availability.
- {team} adjust while {player} receives qualified care.

### `medical.referred_pain_source`

**Trigger:** Qualified assessment identifies a different source for previously disclosed pain and the player publicly confirms the revised treatment direction.

**Placeholders:** `{player}`, `{treatment}`

**Modes:** player

**Availability:** Qualified medical assessment and consented public disclosure; details remain private otherwise. Medical effects require actual recorded results.

**Required state:** assessment_id; qualified_medical_findings; consented_disclosure; care_plan; workload; availability

**Consequences:** Apply clinician-established availability and care changes; outcomes remain conditional and private information requires consent.

**Media examples:**

- Clinicians identify a different source for {player}'s pain.
- The revised diagnosis changes the care plan to {treatment}.
- The symptom story becomes clearer after the specialist review.

### `medical.longstanding_symptom_explanation`

**Trigger:** Qualified evaluation diagnoses the cause of a long-running publicly disclosed symptom, with consented disclosure and an actual management plan.

**Placeholders:** `{player}`, `{symptom}`, `{team}`

**Modes:** player

**Availability:** Qualified medical assessment and consented public disclosure; details remain private otherwise. Medical effects require actual recorded results.

**Required state:** assessment_id; qualified_medical_findings; consented_disclosure; care_plan; workload; availability

**Consequences:** Apply clinician-established availability and care changes; outcomes remain conditional and private information requires consent.

**Media examples:**

- {player} finally receives an explanation for {symptom}.
- The long-running concern gets a qualified diagnosis and a plan.
- {team} receive {player}'s consented update after the medical review.

### `medical.wearable_alert_clinical_review`

**Trigger:** A device alert leads to qualified examination and a real clinical recommendation, which player consents to announce; device alone does not diagnose.

**Placeholders:** `{player}`, `{recommendation}`, `{team}`

**Modes:** player

**Availability:** Qualified medical assessment and consented public disclosure; details remain private otherwise. Medical effects require actual recorded results.

**Required state:** assessment_id; qualified_medical_findings; consented_disclosure; care_plan; workload; availability

**Consequences:** Apply clinician-established availability and care changes; outcomes remain conditional and private information requires consent.

**Media examples:**

- A device alert sends {player} for a qualified medical review.
- The actual examination produces {recommendation}.
- {team} act on the clinician's assessment after the alert.

### `medical.genetic_risk_counseling`

**Trigger:** Player voluntarily announces completed qualified counseling after a consented inherited-risk finding; no active illness is presumed.

**Placeholders:** `{plan}`, `{player}`

**Modes:** player

**Availability:** Qualified medical assessment and consented public disclosure; details remain private otherwise. Medical effects require actual recorded results.

**Required state:** assessment_id; qualified_medical_findings; consented_disclosure; care_plan; workload; availability

**Consequences:** Apply clinician-established availability and care changes; outcomes remain conditional and private information requires consent.

**Media examples:**

- {player} completes qualified counseling on the disclosed inherited risk.
- The finding informs a prevention plan without establishing an active illness.
- His care team set {plan} after the consultation.

### `medical.retired_player_scan_update`

**Trigger:** A retired player voluntarily discloses a qualified assessment relating to prior sport exposure and the actual care recommendation; no automatic career-causation finding.

**Placeholders:** `{player}`, `{recommendation}`

**Modes:** player

**Availability:** Qualified medical assessment and consented public disclosure; details remain private otherwise. Medical effects require actual recorded results.

**Required state:** assessment_id; qualified_medical_findings; consented_disclosure; care_plan; workload; availability

**Consequences:** Apply clinician-established availability and care changes; outcomes remain conditional and private information requires consent.

**Media examples:**

- {player} shares his post-career medical update.
- The assessment leads to {recommendation}, with its stated limits.
- Basketball is in the past; the care plan belongs to the present.

### `medical.environment_trigger_identified`

**Trigger:** Qualified review identifies a specific environmental factor worsening a disclosed condition and the club actually changes the affected venue routine.

**Placeholders:** `{player}`, `{team}`, `{trigger}`

**Modes:** player

**Availability:** Qualified medical assessment and consented public disclosure; details remain private otherwise. Medical effects require actual recorded results.

**Required state:** assessment_id; qualified_medical_findings; consented_disclosure; care_plan; workload; availability

**Consequences:** Apply clinician-established availability and care changes; outcomes remain conditional and private information requires consent.

**Media examples:**

- {team} change the venue routine after identifying {trigger}.
- {player}'s care plan now accounts for the confirmed environmental factor.
- The clinical finding leads to a practical change around the court.

## 95. Treatment decisions and medical process

### `care.surgery_scheduled_choice`

**Trigger:** After qualified assessment presents genuinely available options, player gives informed consent to a scheduled operation and authorizes disclosure of the decision; no second-opinion review is required or implied.

**Placeholders:** `{player}`, `{team}`, `{date}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** treatment.options; treatment.choice; treatment.consent; treatment.procedure_date; media.health_consent

**Consequences:** Reserve the procedure date, update availability to the clinician's actual plan, and retain uncertainty about recovery.

**Media examples:**

- {player} chooses the scheduled operation after the clinical review.
- The decision is made; {team} now plan around {date}.
- {player}'s next basketball chapter starts with the treatment option he consents to take.

### `care.conservative_trial_chosen`

**Trigger:** Qualified clinicians offer an appropriate monitored nonoperative trial alongside another available option; player chooses that trial, accepts its review criteria, and consents to public disclosure.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** treatment.options; treatment.choice; treatment.review_criteria; treatment.review_date; media.health_consent

**Consequences:** Start a time-bounded treatment trial with a review checkpoint; neither success nor later surgery is guaranteed.

**Media examples:**

- {player} chooses a monitored nonoperative treatment trial.
- {team} get a review date rather than a promised return date.
- His care team will judge the trial against the agreed checkpoints.

### `care.trial_goal_unmet`

**Trigger:** A previously chosen monitored treatment trial reaches its review date, qualified clinicians find its specified goal unmet, and player permits an availability-only update; no replacement treatment has been selected.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** treatment.trial_id; treatment.review_result; treatment.goal_status; availability.plan; media.health_consent

**Consequences:** Mark the actual trial outcome and reopen qualified treatment discussion without automatically selecting a procedure.

**Media examples:**

- {player}'s treatment trial does not reach its agreed goal.
- The checkpoint brings a new discussion, not an automatic operation.
- {team} wait for the next medical decision after the unsuccessful trial.

### `care.hospital_reschedules_procedure`

**Trigger:** Hospital formally moves the player's already consented procedure because capacity is reassigned to urgent care; player permits disclosure of the scheduling change, with no clinical deterioration implied.

**Placeholders:** `{player}`, `{date}`, `{team}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** treatment.procedure_date; treatment.provider_capacity; treatment.schedule_reason; media.health_consent

**Consequences:** Update the appointment and associated leave dates; do not change the diagnosis or severity from scheduling alone.

**Media examples:**

- Hospital scheduling moves {player}'s procedure to {date}.
- The appointment changes because urgent care needs the space. His diagnosis has not changed with it.
- {team} redraw the calendar around the hospital's new date.

### `care.postprocedure_discharge`

**Trigger:** After a completed procedure, qualified clinicians confirm discharge criteria are met and release the player to a documented home-care plan; player authorizes this limited update.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** treatment.procedure_completed; treatment.discharge_status; treatment.home_plan; media.health_consent

**Consequences:** Change care location and apply the actual follow-up plan; discharge does not confer sports clearance.

**Media examples:**

- {player} leaves hospital under the agreed follow-up plan.
- Home is the next care setting; the court is still a separate decision.
- {team} receive the consented discharge update after his procedure.

### `care.postprocedure_complication`

**Trigger:** Qualified clinicians diagnose a specific complication after a recorded procedure, revise the care plan, and obtain consent for a limited availability announcement.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** treatment.procedure_id; treatment.complication; treatment.revised_plan; availability.status; media.health_consent

**Consequences:** Record the diagnosed complication and clinician-directed plan; severity and duration depend on the actual assessment.

**Media examples:**

- A confirmed complication changes {player}'s post-procedure care.
- {team} adjust after the medical team revise the plan.
- His recovery takes a different route; the next timetable comes from the clinicians.

### `care.medication_side_effect_review`

**Trigger:** Qualified clinician attributes a disclosed adverse effect to a prescribed medicine and actually changes the prescription plan; player consents to the limited public update, with no dose or drug name required.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** treatment.prescription_plan; treatment.adverse_effect; treatment.clinical_review; media.health_consent

**Consequences:** Apply only the clinician's recorded change and follow-up; do not imply stopping all treatment or immediate recovery.

**Media examples:**

- {player}'s prescribed treatment changes after a side-effect review.
- A qualified reassessment redirects his care rather than leaving him to guess.
- {team} receive the revised availability plan without private prescription details.

### `care.medication_reconciliation_catches_conflict`

**Trigger:** Qualified medication reconciliation identifies a previously unrecognized compatibility concern and clinicians resolve it before the affected new treatment begins; player consents to a nonspecific public summary.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** treatment.reconciliation; treatment.compatibility_flag; treatment.plan_updated; media.health_consent

**Consequences:** Block the incompatible plan, retain the resolved review result, and initiate only the professionally approved alternative.

**Media examples:**

- A clinical cross-check catches a treatment conflict before {player} begins it.
- The care team resolve the compatibility concern before it becomes an exposure.
- {player}'s treatment plan gets a useful correction at the review table.

### `care.specialist_wait_transfer`

**Trigger:** A verified specialist waiting list exceeds the patient's accepted window, an appropriately qualified alternative provider accepts transfer, and player authorizes disclosure of the logistics; no opinion disagreement implied.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** treatment.waiting_list; treatment.provider_transfer; treatment.appointment_date; media.health_consent

**Consequences:** Transfer responsibility and appointment details while preserving the existing medical record and current restrictions.

**Media examples:**

- {player} transfers care to secure an accepted specialist appointment.
- The waiting list changes the provider, not the established diagnosis.
- {team} follow the new appointment date after the qualified handover.

### `care.prior_authorization_ready`

**Trigger:** Health insurer or plan administrator grants required pre-treatment authorization for a specifically proposed intervention, enabling an already consented booking; no claim settlement or court ruling is involved. Player authorizes the availability update.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** treatment.authorization_status; treatment.booking_status; treatment.consent; media.health_consent

**Consequences:** Remove the administrative booking block without deciding whether treatment succeeds.

**Media examples:**

- {player}'s treatment booking clears its authorization hurdle.
- The paperwork finally permits the appointment already agreed with his care team.
- {team} can plan around the confirmed booking instead of an administrative hold.

### `care.informed_consent_withdrawn`

**Trigger:** Before an elective intervention starts, player lawfully withdraws consent after qualified consultation; clinicians confirm a safe interim plan and player authorizes disclosure of the choice.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** treatment.consent; treatment.booking_status; treatment.interim_plan; media.health_consent

**Consequences:** Cancel the unstarted elective intervention and apply the actual interim plan without forcing the original choice.

**Media examples:**

- {player} withdraws consent for the planned elective procedure.
- The appointment stops before treatment begins; the care team arrange the interim plan.
- The choice changes, and {team} receive the revised availability facts.

### `care.research_enrollment_approved`

**Trigger:** A regulated study accepts the player's informed enrollment after independent eligibility review; competition and clinical authorities confirm the permitted participation terms, and player elects public disclosure.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** treatment.study_approval; treatment.study_consent; treatment.study_terms; eligibility.research_permission; media.health_consent

**Consequences:** Track study-specific monitoring and eligibility conditions; no benefit or experimental cure is presumed.

**Media examples:**

- {player} joins an approved clinical study under the permitted terms.
- Participation creates monitoring commitments rather than a promised cure.
- {team} receive the actual competition conditions attached to his enrollment.

### `care.research_participation_ended`

**Trigger:** Player lawfully withdraws from a previously approved clinical study, qualified staff complete the specified safety handover, and player permits a limited public statement; no adverse result is assumed.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** treatment.study_id; treatment.study_status; treatment.safety_handover; media.health_consent

**Consequences:** End study participation and transfer ongoing care according to the documented handover.

**Media examples:**

- {player} ends his clinical-study participation.
- The research appointment closes with a qualified care handover.
- His regular care continues under the actual transition plan.

### `care.diagnosis_unresolved_followup`

**Trigger:** Qualified assessment explicitly remains inconclusive, clinicians book a specific follow-up and set interim activity limits, and player consents to an uncertainty-framed availability update.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** treatment.diagnostic_status; treatment.followup_date; availability.interim_limits; media.health_consent

**Consequences:** Preserve unknown diagnosis status and actual interim limits; do not manufacture a named illness or clearance.

**Media examples:**

- {player}'s medical review remains inconclusive.
- There is a follow-up appointment, but no settled diagnosis to announce.
- {team} work with the interim limits while qualified assessment continues.

### `care.patient_record_correction`

**Trigger:** Care provider verifies that a clinically relevant factual entry in the player's medical record is wrong and corrects it before revising the actual care plan; player authorizes a nonidentifying public summary.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** treatment.record_error; treatment.record_corrected; treatment.plan_reassessed; media.health_consent

**Consequences:** Correct the erroneous record and trigger professional plan review without implying every prior decision was negligent.

**Media examples:**

- {player}'s care plan is reviewed after a record correction.
- The provider fixes the factual entry before the next treatment decision.
- A paperwork error receives a clinical cross-check, with private details kept private.

## 96. Rehabilitation and reintegration checkpoints

### `rehab.baseline_function_logged`

**Trigger:** Qualified rehabilitation professional completes the first condition-specific functional assessment after a treatment episode and agrees measurable goals; player consents to a goal-only public summary.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** rehab.baseline; rehab.goals; rehab.assessor; media.health_consent

**Consequences:** Establish a comparison baseline and goal set; this assessment alone does not grant practice or game eligibility.

**Media examples:**

- {player} sets his first measured rehabilitation targets.
- The comeback has a starting line, with goals his rehabilitation team can actually test.
- {team} get a structured plan rather than a guess about readiness.

### `rehab.solo_ballwork_first`

**Trigger:** Qualified care staff clear a specified first solo ball-work stage and the player completes its supervised session; he authorizes disclosure of that milestone, without team-practice clearance.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** rehab.stage; rehab.ballwork_permission; rehab.session_completed; media.health_consent

**Consequences:** Advance only to the cleared solo stage and retain separate group, contact, and game restrictions.

**Media examples:**

- {player} completes his first cleared solo ball-work session.
- The ball is back in his hands. Team practice remains another checkpoint.
- A small supervised session gives the rehabilitation plan a tangible step forward.

### `rehab.noncontact_group_session`

**Trigger:** Qualified staff clear the noncontact group-practice stage and player completes the first session under its actual restrictions; he consents to this update.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** rehab.stage; rehab.group_permission; rehab.contact_restriction; rehab.session_completed; media.health_consent

**Consequences:** Add permitted team interaction while maintaining contact and competition restrictions.

**Media examples:**

- {player} rejoins {team} for cleared noncontact practice.
- The group is back around him, with the contact limit still in place.
- His first completed team session stays inside the medical plan.

### `rehab.contact_stage_deferred`

**Trigger:** Condition-specific testing fails the pre-agreed criteria for contact progression, qualified clinicians defer contact work, and player permits an availability-only statement; no new injury is implied.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** rehab.progression_test; rehab.contact_criteria; rehab.contact_permission; media.health_consent

**Consequences:** Keep the player at the prior safe stage and schedule actual reassessment instead of advancing by calendar alone.

**Media examples:**

- {player}'s contact-practice step is deferred after testing.
- The calendar says time has passed; the agreed criteria still need to be met.
- {team} keep the next stage on hold under the qualified assessment.

### `rehab.contact_session_completed`

**Trigger:** After a prior noncontact rehabilitation stage, qualified staff clear restricted contact practice and player completes its first supervised session; no independent concussion clearance or game return is inferred. Player consents to disclosure.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** rehab.contact_permission; rehab.contact_limits; rehab.session_completed; media.health_consent

**Consequences:** Record completion of this stage while preserving any remaining competitive restrictions.

**Media examples:**

- {player} completes his first cleared contact session.
- The rehabilitation moves into contact without jumping straight to game clearance.
- {team} welcome another completed checkpoint in his return plan.

### `rehab.return_minutes_cap_met`

**Trigger:** Player returns from a documented rehabilitation episode under a clinician-approved minutes cap and the completed game stays at or below that exact cap; he consents to the public restriction.

**Placeholders:** `{player}`, `{limit}`, `{team}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** rehab.return_plan; availability.minutes_cap; game.minutes_played; rehab.postgame_review; media.health_consent

**Consequences:** Mark the cap as respected and await the actual follow-up before changing future limits.

**Media examples:**

- {player}'s return stays inside the agreed {limit}-minute cap.
- {team} get him back without stretching the plan on the first appearance.
- The clock reaches the limit and the rotation respects it.

### `rehab.return_minutes_cap_breached`

**Trigger:** A completed game exceeds an explicitly agreed medical return cap; qualified staff document the breach and reassess availability, with the player's consented disclosure and no presumed injury.

**Placeholders:** `{team}`, `{player}`, `{excess}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** rehab.return_plan; availability.minutes_cap; game.minutes_played; rehab.cap_breach_review; media.health_consent

**Consequences:** Flag the real cap breach, record responsible decisions, and apply the clinician's actual reassessment; do not automatically cause reinjury.

**Media examples:**

- {team} exceed {player}'s agreed return cap by {excess} minutes.
- The appearance ends outside the medical plan, and a qualified review follows.
- The extra minutes create a documented protocol problem rather than a guessed medical outcome.

### `rehab.stage_rolled_back`

**Trigger:** A supervised rehabilitation session produces confirmed symptoms that qualified staff judge sufficient to revert one previously cleared stage; player authorizes only the stage update.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** rehab.stage; rehab.symptom_review; rehab.rollback_reason; rehab.reassessment_date; media.health_consent

**Consequences:** Revert the actual activity stage and schedule the recorded review without equating this with a new diagnosed injury.

**Media examples:**

- {player}'s rehabilitation steps back after a supervised review.
- The next session returns to the earlier cleared stage.
- Progress is not a straight line, and his care team change the plan accordingly.

### `rehab.unsupervised_workload_breach`

**Trigger:** Qualified staff establish that player performed extra activity explicitly barred by his rehabilitation plan; they reassess him and he permits disclosure of the procedural breach, without inventing harm.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** rehab.activity_limits; rehab.actual_activity; rehab.plan_breach; rehab.clinical_reassessment; media.health_consent

**Consequences:** Record the deviation and actual reassessment, then revise supervision or availability only as specifically decided.

**Media examples:**

- {player}'s extra work breaches the agreed rehabilitation limits.
- More effort does not replace the plan; his care team reassess the deviation.
- The unsupervised session creates a real process issue, with health effects assessed separately.

### `rehab.missed_session_rebooked`

**Trigger:** Player misses a required rehabilitation appointment for a confirmed nonclinical scheduling reason, the provider rebooks it, and he consents to the calendar-only update.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** rehab.appointment_status; rehab.absence_reason; rehab.rebooked_date; media.health_consent

**Consequences:** Rebook the actual session and review timeline only if the professional plan requires it; do not imply deterioration.

**Media examples:**

- {player}'s rehabilitation appointment moves after a scheduling miss.
- The session gets a new date rather than a guessed setback.
- The provider and {team} repair the calendar gap.

### `rehab.home_equipment_delay`

**Trigger:** Prescribed or professionally selected home rehabilitation equipment fails to arrive by the planned session date, and qualified staff approve an actual interim arrangement; player consents to the logistics update.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** rehab.equipment_delivery; rehab.home_program; rehab.interim_arrangement; media.health_consent

**Consequences:** Apply only the approved interim activity and track equipment arrival; no unsafe improvised substitute is created.

**Media examples:**

- A delivery delay changes {player}'s home rehabilitation routine.
- His rehabilitation team provide an approved interim arrangement while the equipment is missing.
- The practical obstacle is a shipment, not a new diagnosis.

### `rehab.provider_handover_completed`

**Trigger:** After an actual team or city move, both qualified rehabilitation providers confirm full handover of the active plan and baseline records; player permits a nonspecific public update.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** rehab.provider_previous; rehab.provider_current; rehab.handover_complete; rehab.baseline_transfer; media.health_consent

**Consequences:** Preserve the active stage and restrictions through the provider transfer rather than resetting progress.

**Media examples:**

- {player}'s rehabilitation follows him through the provider handover.
- The new care team receive the actual plan, not a blank starting sheet.
- The move changes the clinic while the established checkpoints stay connected.

### `rehab.remote_review_approved`

**Trigger:** Qualified provider determines a scheduled rehabilitation review is suitable for secure remote assessment, conducts it, and records its actual findings; player consents to modality-only disclosure.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** rehab.review_modality; rehab.remote_suitability; rehab.review_completed; rehab.review_result; media.health_consent

**Consequences:** Complete only the remotely appropriate review; tests requiring physical attendance remain outstanding until separately done.

**Media examples:**

- {player} completes an approved remote rehabilitation review.
- The appointment travels through a secure connection; hands-on tests remain separate.
- His qualified provider finishes the review that can safely happen away from the clinic.

### `rehab.plateau_plan_revised`

**Trigger:** Repeated qualified measurements remain below a predefined rehabilitation improvement target over its agreed interval, prompting an actual revised plan; player consents to the milestone-only update.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** rehab.serial_measurements; rehab.plateau_criteria; rehab.plan_version; media.health_consent

**Consequences:** Retain the observed plateau and apply the professional revision without guaranteeing that the new plan succeeds.

**Media examples:**

- {player}'s rehabilitation plan changes after a measured plateau.
- The improvement target stays unmet, so the care team revise the approach.
- The next stage has a different plan, not a promised faster ending.

### `rehab.supervision_graduation`

**Trigger:** Qualified rehabilitation provider confirms completion of specified supervised goals and transfers the player to an approved self-managed maintenance plan; competition clearance is separately determined and disclosure is consented.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** rehab.supervised_goals; rehab.graduation_status; rehab.maintenance_plan; media.health_consent

**Consequences:** End that supervised program while retaining maintenance obligations and any independent sports restrictions.

**Media examples:**

- {player} completes the supervised rehabilitation program.
- The goals are met, and the next phase moves into the approved maintenance routine.
- Graduation from the program changes the supervision, not every separate eligibility decision.

## 97. Long-term wellbeing and practical health interruptions

### `wellbeing.travel_sleep_environment_changed`

**Trigger:** Player reports an actual sleep-environment disruption on a team trip, staff confirm the cause and implement his requested room or schedule adjustment, and he authorizes a nonspecific public mention; no sleep disorder is diagnosed.

**Placeholders:** `{team}`, `{player}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** wellbeing.sleep_environment; travel.room_arrangement; wellbeing.accommodation_completed; media.health_consent

**Consequences:** Change the verified practical arrangement without creating a clinical diagnosis or guaranteed performance bonus.

**Media examples:**

- {team} change {player}'s travel arrangement after a sleep disruption.
- A quieter setup replaces the confirmed disturbance. The box score will tell its own story.
- The road routine gets one practical problem removed.

### `wellbeing.preventive_check_completed`

**Trigger:** Qualified clinician completes a scheduled preventive examination and records that no actionable concern was found within its defined scope; player consents to that scoped statement, with no universal health guarantee.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** wellbeing.check_scope; wellbeing.check_completed; wellbeing.check_result; media.health_consent

**Consequences:** Record completion and the actual next due date without treating a limited check as proof against every illness.

**Media examples:**

- {player}'s scheduled preventive check finds no actionable concern within its scope.
- The appointment ends with the actual reviewed areas clear.
- One routine health checkpoint is complete, with no claim that every future risk has disappeared.

### `wellbeing.mouthguard_fitting`

**Trigger:** Qualified dental professional completes a requested custom protective-mouthguard fitting and competition rules approve its use; player permits a public equipment update.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** wellbeing.dental_fitting; equipment.mouthguard_approved; equipment.mouthguard_ready; media.health_consent

**Consequences:** Add the permitted protective equipment without guaranteeing prevention of dental injury.

**Media examples:**

- {player} gets a professionally fitted, approved mouthguard.
- The equipment bag gains one carefully fitted piece of protection.
- His dental appointment produces gear he can legally use on the court.

### `wellbeing.vaccination_visit_completed`

**Trigger:** Player voluntarily elects and completes a clinician-approved routine vaccination appointment; he expressly chooses public disclosure, with no claim of immediate immunity or performance effect.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** wellbeing.preventive_choice; wellbeing.clinical_approval; wellbeing.appointment_completed; media.health_consent

**Consequences:** Record the actual appointment and clinician-set follow-up without prescribing a product, dose, or guaranteed immunity.

**Media examples:**

- {player} completes his chosen preventive-health appointment.
- The clinic visit fits into his calendar under qualified advice.
- A routine care choice is complete; no instant basketball benefit is promised.

### `wellbeing.minor_illness_absence`

**Trigger:** Qualified clinician assesses a disclosed short-term noninjury illness and records actual temporary game unavailability; player permits only the stated availability detail.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** wellbeing.illness_assessment; availability.temporary_status; wellbeing.review_date; media.health_consent

**Consequences:** Apply the actual absence and review date; do not infer severity, contagion, or a fixed recovery time.

**Media examples:**

- A clinician-assessed illness keeps {player} out of {team}'s game.
- An ordinary health interruption reaches the lineup without becoming an injury diagnosis.
- The next availability decision waits for his scheduled review.

### `wellbeing.symptom_isolation_started`

**Trigger:** Qualified clinician or authorized health professional requires temporary individual separation after assessed symptoms under an applicable protocol; player authorizes a limited announcement, with no diagnosis yet confirmed.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** wellbeing.symptom_assessment; wellbeing.isolation_requirement; availability.contact_status; media.health_consent

**Consequences:** Restrict the actual shared activities for the specified period while preserving unknown diagnostic status.

**Media examples:**

- {player} follows a temporary separation requirement after assessment.
- The precaution changes his contact with {team}; the cause is not yet confirmed.
- Qualified staff set the boundary while they assess the symptoms.

### `wellbeing.symptom_isolation_ended`

**Trigger:** After a symptom-triggered separation with no prior confirmed positive diagnosis, qualified authority explicitly clears the player to rejoin specified shared activities; he consents to this update.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** wellbeing.isolation_requirement; wellbeing.clearance_scope; availability.contact_status; media.health_consent

**Consequences:** Restore only the shared activities actually cleared, leaving separate game-fitness decisions intact.

**Media examples:**

- {player} receives clearance to rejoin the specified team activities.
- The symptom-related separation ends under the qualified review.
- {team} welcome him back within the exact scope of the clearance.

### `wellbeing.motion_sickness_route_changed`

**Trigger:** Qualified assessment establishes travel-related sickness, player agrees an appropriate permitted travel alternative, and club implements it with consented disclosure; no crash or injury is involved.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** wellbeing.travel_assessment; travel.transport_mode; travel.alternative_approved; media.health_consent

**Consequences:** Use the actual approved route and retain real travel-time consequences without claiming a cure.

**Media examples:**

- {player}'s travel plan changes after a qualified assessment.
- {team} arrange the permitted alternative instead of repeating the difficult journey.
- The new route solves the immediate logistics; symptom response remains an assessment question.

### `wellbeing.heat_illness_session_stopped`

**Trigger:** Qualified on-site staff assess an actual heat-related illness, stop the player's session, and establish the recorded care and availability plan; he permits a limited public update.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** wellbeing.heat_assessment; training.session_stopped; availability.care_plan; media.health_consent

**Consequences:** End exposure and apply the professional plan; no self-treatment instructions or guessed return interval are generated.

**Media examples:**

- Qualified staff stop {player}'s session after a heat-related illness.
- The workout ends when the assessed condition requires care.
- {team} follow the actual medical plan before considering another session.

### `wellbeing.eye_condition_equipment_restriction`

**Trigger:** Qualified clinician diagnoses an acute eye condition and temporarily restricts an existing contact-lens or other equipment routine; player consents to availability-only disclosure and no prescription change is assumed.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** wellbeing.eye_assessment; equipment.temporary_restriction; availability.review_date; media.health_consent

**Consequences:** Apply the actual short-term equipment restriction and review plan without inventing a new vision prescription.

**Media examples:**

- {player}'s equipment routine changes during care for an eye condition.
- The temporary clinical restriction reaches his preparation for {team}.
- His next availability update follows the eye-care review rather than speculation.

### `wellbeing.migraine_game_withdrawal`

**Trigger:** Qualified clinician assesses an acute migraine episode during the game-day window and player withdraws under the actual care recommendation; he authorizes a limited public explanation.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** wellbeing.acute_episode; wellbeing.clinical_assessment; availability.game_withdrawal; media.health_consent

**Consequences:** Remove the player from that game's availability and retain the clinician's actual follow-up, without labeling every headache as migraine.

**Media examples:**

- {player} withdraws after a clinician-assessed migraine episode.
- The game-day plan changes because the current episode requires care.
- {team} adjust the lineup under the qualified recommendation.

### `wellbeing.blood_donation_schedule_adjusted`

**Trigger:** Player completes an eligible voluntary blood-donation appointment after qualified screening and club applies the clinician-approved activity schedule; he elects public disclosure.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** wellbeing.donation_eligibility; wellbeing.donation_completed; training.activity_adjustment; media.health_consent

**Consequences:** Record the voluntary appointment and actual activity adjustment without instructing donation timing or implying universal eligibility.

**Media examples:**

- {player} completes an approved blood-donation appointment.
- {team}'s training schedule follows the qualified activity guidance from the visit.
- His voluntary contribution comes with a properly arranged basketball calendar.

### `wellbeing.health_supply_travel_replacement`

**Trigger:** An essential legally carried prescribed health supply is lost in transit, and qualified professionals arrange an authorized replacement before the player resumes the affected activity; public disclosure is limited and consented.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** wellbeing.prescribed_supply; travel.supply_loss; treatment.authorized_replacement; availability.resume_condition; media.health_consent

**Consequences:** Hold the affected activity until the actual authorized replacement arrives; disclose no prescription or dosing details.

**Media examples:**

- {player}'s required health supply is replaced through the authorized care route.
- A travel loss interrupts the routine, then qualified staff restore the needed arrangement.
- {team} wait for the replacement rather than improvising his care.

### `wellbeing.care_followup_overdue_booked`

**Trigger:** Records show the player missed a previously due nonrehabilitation chronic-care review, qualified staff arrange the actual catch-up appointment, and he consents to a scheduling-only statement.

**Placeholders:** `{player}`, `{team}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** wellbeing.followup_due; wellbeing.followup_overdue; treatment.catchup_appointment; media.health_consent

**Consequences:** Restore the actual care schedule without inferring deterioration from a missed review or changing the existing diagnosis.

**Media examples:**

- {player} books the overdue follow-up with his care team.
- The missed checkpoint gets a date instead of another delay.
- {team} accommodate the catch-up appointment while private details stay private.

### `wellbeing.maintenance_success_observed`

**Trigger:** A qualified long-term care review confirms that the player's existing self-management plan met its pre-agreed stability measure over the specified observation window; player consents to the scoped result.

**Placeholders:** `{player}`

**Modes:** player

**Availability:** Requires the specific professional assessment, consent, and process facts in the trigger. Public media may disclose only the player-authorized summary; private clinical details remain restricted. Respect applicable jurisdiction, provider capability, active competition rules, and actual sporting availability decisions. No template supplies medical instructions or guarantees a clinical outcome.

**Required state:** wellbeing.maintenance_plan; wellbeing.review_window; wellbeing.stability_measure; wellbeing.review_result; media.health_consent

**Consequences:** Record the observed stable interval and continue or revise the plan only as actually recommended; do not declare a cure.

**Media examples:**

- {player}'s long-term care review meets its agreed stability target.
- The everyday routine earns a measured good report from the care team.
- The reviewed interval is stable; the maintenance work continues beyond it.

## 98. Media day, social reactions, and configurable portraits

### `media.day.first_impression_hype`

**Trigger:** Before the opener, a newly published player media-day introduction receives a verified positive-reaction count above the configured first-impression threshold. No playing result is implied.

**Placeholders:** `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Modern eras only; verified public media-day assets and enabled social-reaction module. Platform names are configured strings.

**Required state:** player_id; team_id; session_phase; published_asset_id; first_impression_threshold; positive_reactions

**Consequences:** Create a positive first-impression news item and temporary publicity modifier; do not alter ability or wins.

**Media examples:**

- {player}'s media-day introduction draws a measured wave of enthusiasm.
- The public first look gives {team} supporters an early talking point.
- The reception is positive for {player}; the season still supplies its own tests.

### `media.social.washed_slander`

**Trigger:** A preseason media-day asset before the first official season game receives a configured volume of public washed or finished reactions. These are labeled audience opinions, not actual ratings, injuries, or decline.

**Placeholders:** `{platform}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Modern eras only; verified public media-day assets and enabled social-reaction module. Platform names are configured strings.

**Required state:** player_id; team_id; platform; session_phase; official_season_games; asset_id; washed_reaction_count; washed_threshold

**Consequences:** Open an optional ignore/respond/context-review choice and store public reputation pressure; actual basketball attributes stay independent.

**Media examples:**

- {platform}'s replies put {player} in a decline debate based on media-day footage.
- {team} receive a slander cycle rather than an official basketball assessment.
- The washed tag trends around {player}, with no performance finding attached.

### `media.social.washed_rebuttal`

**Trigger:** A public defense of a player targeted by the preceding preseason washed reaction event passes the configured distinct-supporter threshold; rebuttal points explicitly challenge insufficient evidence.

**Placeholders:** `{platform}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Modern eras only; verified public media-day assets and enabled social-reaction module. Platform names are configured strings.

**Required state:** player_id; team_id; platform; source_slander_id; rebuttal_posts; distinct_supporters; rebuttal_threshold

**Consequences:** Publish a counterreaction and add a competing reputation narrative; do not automatically erase the original reactions or declare future success.

**Media examples:**

- Supporters challenge the evidence behind the {player} washed claim.
- {platform}'s discussion gains a documented defense of the player.
- {team} fans push for actual game evidence before a decline verdict.

### `media.day.fitness_change`

**Trigger:** Preseason media-day records show a verified player-consented observable measurement or completed standardized fitness-test change against an explicitly comparable earlier record. The change string describes only that verified difference.

**Placeholders:** `{change}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Modern eras only; verified public media-day assets and enabled social-reaction module. Platform names are configured strings.

**Required state:** player_id; team_id; session_phase; measurement_metric; previous_result; current_result; comparison_validated; change_description; publication_consent

**Consequences:** Update the measurement history and publish a factual comparison. Change performance ratings only through a separate validated training model, never from appearance alone.

**Media examples:**

- A verified comparison records {change} for {player}.
- {team} publish an observable update with its measurement context.
- The documented change joins {player}'s preseason record without guaranteeing a basketball effect.

### `media.day.chemistry_body_language`

**Trigger:** Published media-day portrait receives a threshold of chemistry interpretations based on its visible expression or pose. look is an observation or explicitly tagged impression; interpretations never establish actual chemistry.

**Placeholders:** `{look}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Modern eras only; media-day portrait composer enabled. User choices may set pose, expression, angle, lighting, backdrop, uniform pieces, hairstyle, and permitted accessories; only the published render triggers reactions.

**Required state:** player_id; team_id; photo_id; photo_pose; photo_expression; photo_camera_angle; look_description; body_language_posts; interpretation_threshold

**Consequences:** Create opinion-only media pressure and optional response choices. Keep chemistry, relationships, and private motives unchanged unless independent team events establish them.

**Media examples:**

- The {look} media-day image starts a body-language debate around {player}.
- Audience interpretations of the portrait are opinions about {team}.
- The public frame draws chemistry guesses without verifying a locker-room condition.

### `media.social.bad_clip_pile_on`

**Trigger:** A verified public media-day excerpt tagged as an awkward or unsuccessful on-camera moment crosses the configured critical-post threshold. clip is its factual short descriptor; game results and enduring ability are not inferred.

**Placeholders:** `{clip}`, `{platform}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Modern eras only; verified public media-day assets and enabled social-reaction module. Platform names are configured strings.

**Required state:** player_id; team_id; platform; source_asset; clip_descriptor; critical_posts; pile_on_threshold

**Consequences:** Store a public criticism cycle and unlock ignore, respond, or inspect-full-source options; no automatic morale or performance penalty beyond separately configured media stress.

**Media examples:**

- {player}'s {clip} excerpt crosses the measured criticism threshold.
- {platform}'s response turns one camera-day moment into a public pile-on.
- The circulating clip adds pressure around {team} without establishing a season outcome.

### `media.social.selective_edit_exposed`

**Trigger:** Verified uncut source proves that a circulated negative media-day excerpt omitted relevant context and that its sweeping claim is unsupported by the complete footage. context describes the specifically verified omission.

**Placeholders:** `{context}`, `{platform}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Modern eras only; verified public media-day assets and enabled social-reaction module. Platform names are configured strings.

**Required state:** player_id; team_id; platform; excerpt_id; full_source_id; source_verification; omitted_context; unsupported_claim; correction_published

**Consequences:** Publish a source-backed correction linked to the excerpt, reduce misinformation credibility, and retain the original circulation record.

**Media examples:**

- The complete source adds {context} to the {player} clip.
- A verified recording corrects the selective-edit claim on {platform}.
- {team} have a documented contextual correction to the circulating excerpt.

### `media.social.fake_quote_corrected`

**Trigger:** A viral quote graphic using the player photo is verified as fabricated through authenticated source records and a completed attribution check; a public correction is released. quote is the false text and is always labeled fabricated.

**Placeholders:** `{platform}`, `{player}`, `{quote}`, `{team}`

**Modes:** player; franchise

**Availability:** Modern eras only; verified public media-day assets and enabled social-reaction module. Platform names are configured strings.

**Required state:** player_id; team_id; platform; quote_graphic_id; attributed_quote; authenticated_record; attribution_check; correction_release

**Consequences:** Tag the graphic as false attribution and issue a linked correction. Do not create a player statement, legal charge, or automatic removal of every repost.

**Media examples:**

- Verification rejects "{quote}" as a genuine {player} quotation.
- {platform}'s viral quote graphic receives an attribution correction.
- The confirmed media-day record for {team} excludes the fabricated line.

### `media.social.player_response_backfire`

**Trigger:** Player publishes an authenticated response to a media-day criticism event. A defined comparable audience sample becomes significantly more negative and majority unfavorable after the response, beyond the configured threshold.

**Placeholders:** `{platform}`, `{player}`, `{quote}`, `{team}`

**Modes:** player; franchise

**Availability:** Modern eras only; verified public media-day assets and enabled social-reaction module. Platform names are configured strings.

**Required state:** player_id; team_id; platform; source_event_id; response_quote; response_timestamp; baseline_sentiment; followup_sentiment; comparable_sample; backfire_threshold

**Consequences:** Save the unfavorable measured reaction and unlock a pause, clarification, or basketball-first follow-up choice. Never assume the reaction represents every viewer.

**Media examples:**

- {player}'s public "{quote}" response receives a measured negative reception.
- The sampled discussion on {platform} becomes more critical after the reply.
- {team} get another communication decision after the response backfires.

### `media.social.player_response_redeemed`

**Trigger:** Following an authenticated media-day response, player produces a verified game line and a comparable monitored audience sample becomes significantly more favorable about that response. Both performance and sentiment conditions are required.

**Placeholders:** `{line}`, `{platform}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Modern eras only; verified public media-day assets and enabled social-reaction module. Platform names are configured strings.

**Required state:** player_id; team_id; platform; response_id; game_id; verified_stat_line; baseline_sentiment; followup_sentiment; comparable_sample; redemption_threshold

**Consequences:** Link the real game evidence to a measured reputation recovery. Do not imply a team win, universal approval, or permanent redemption.

**Media examples:**

- {player}'s {line} accompanies a verified improvement in response sentiment.
- The recorded audience on {platform} reacts more favorably after the game.
- {team} have an evidence-linked follow-up to the media-day reply story.

### `media.social.unflattering_photo_reaction`

**Trigger:** User-approved published media-day portrait receives a threshold of negative image-specific aesthetic reactions. look is a tagged description of the image or its reception, never a diagnosis or objective bodily judgment.

**Placeholders:** `{look}`, `{platform}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Modern eras only; media-day portrait composer enabled. User choices may set pose, expression, angle, lighting, backdrop, uniform pieces, hairstyle, and permitted accessories; only the published render triggers reactions.

**Required state:** player_id; team_id; platform; photo_id; photo_pose; photo_expression; photo_camera_angle; photo_lighting; photo_backdrop; photo_uniform; photo_accessories; look_description; negative_photo_reactions

**Consequences:** Create a portrait-reception news item; allow next-photo settings changes, a voluntary repost, ignore, or a public response. No automatic basketball decline or medical effect.

**Media examples:**

- {player}'s {look} portrait receives a measured negative photo reaction.
- The public image draws criticism on {platform} without establishing a basketball problem.
- {team}'s portrait reception opens an optional photo-editing or response decision.

### `media.social.audience_split`

**Trigger:** One authenticated player media-day asset produces meaningful favorable and unfavorable shares in a defined sample, each exceeding a configured split threshold. No exact half-and-half assumption.

**Placeholders:** `{platform}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Modern eras only; verified public media-day assets and enabled social-reaction module. Platform names are configured strings.

**Required state:** player_id; team_id; platform; asset_id; sentiment_sample; positive_share; negative_share; split_threshold

**Consequences:** Store both sentiment tracks and publish a divided-reception item, enabling targeted response choices without forcing a universal verdict.

**Media examples:**

- The measured reaction to {player}'s media-day appearance is divided.
- {platform}'s sample contains substantial support and criticism.
- {team} receive a mixed public first impression rather than a consensus.

### `media.social.old_clip_recycled`

**Trigger:** A verified older public recording of the player crosses a circulation threshold in current media-day discourse while posts imply it is current. The authenticated original date is published as context.

**Placeholders:** `{date}`, `{platform}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Modern eras only; verified public media-day assets and enabled social-reaction module. Platform names are configured strings.

**Required state:** player_id; team_id; platform; old_asset_id; original_date; current_session_id; repost_count; misdated_claims; date_verification

**Consequences:** Attach source date to the story and open a contextual correction; do not pretend the recorded moment occurred again or proves current performance.

**Media examples:**

- The source dates the circulating {player} footage to {date}.
- {platform}'s current reaction cycle is using an older recording.
- {team}'s media-day discussion receives a verified timestamp correction.

### `media.social.unexpected_rival_support`

**Trigger:** A player with a previously established sporting rivalry publishes an authenticated supportive statement about the target player media-day criticism event. quote contains the verified words; support does not establish reconciliation.

**Placeholders:** `{platform}`, `{player}`, `{quote}`, `{rival}`, `{team}`

**Modes:** player; franchise

**Availability:** Modern eras only; verified public media-day assets and enabled social-reaction module. Platform names are configured strings.

**Required state:** player_id; team_id; rival_id; rivalry_record; platform; support_quote; statement_verification; source_event_id

**Consequences:** Add a public respectful-rival moment and a media counterreaction. Change relationship state only through a separately modeled verified interaction.

**Media examples:**

- {rival} offer verified public support for {player}.
- The statement "{quote}" adds a rival's backing to the debate.
- {team} receive an unexpected supportive voice on {platform}.

### `media.social.meme_to_charity`

**Trigger:** A player explicitly links a public media-day meme to a permitted charitable effort, and an independent recipient confirms actual funds delivered for the stated cause. A pledge or engagement count alone does not trigger it.

**Placeholders:** `{amount}`, `{cause}`, `{platform}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Modern eras only; verified public media-day assets and enabled social-reaction module. Platform names are configured strings.

**Required state:** player_id; team_id; platform; meme_asset_id; player_linked_campaign; cause; verified_contribution; recipient_confirmation

**Consequences:** Credit only confirmed charitable funding and create a constructive meme follow-up. Popularity or basketball benefits remain separate optional systems.

**Media examples:**

- The meme-linked effort around {player} delivers {amount} for {cause}.
- {platform}'s media-day joke gains a confirmed charitable follow-up.
- {team}'s public moment now includes a verified contribution receipt.

### `media.social.pose_becomes_meme`

**Trigger:** A player-selected or approved media-day pose is publicly published, then distinct user-made recreations or visual remixes exceed the configured meme threshold. Deliberate and accidental meme attempts are both eligible.

**Placeholders:** `{platform}`, `{player}`, `{pose}`, `{team}`

**Modes:** player; franchise

**Availability:** Modern eras only; media-day portrait composer enabled. User choices may set pose, expression, angle, lighting, backdrop, uniform pieces, hairstyle, and permitted accessories; only the published render triggers reactions.

**Required state:** player_id; team_id; platform; photo_id; photo_pose; photo_expression; photo_camera_angle; photo_lighting; photo_backdrop; pose_description; distinct_remakes; meme_threshold

**Consequences:** Create a reusable public meme record and optional embrace, ignore, or remix choices. Only permitted fictional pieces enter the composer; no claim that a player intended the outcome.

**Media examples:**

- The {pose} media-day pose becomes a measured recreation trend.
- {player}'s portrait supplies {platform} with a recognizable public meme format.
- {team} receive a pose-driven reaction cycle built from verified remixes.

### `media.day.number_reveal_reaction`

**Trigger:** A registered new or first professional jersey-number assignment receives its first authenticated public media-day reveal. Number legality and roster registration are already verified.

**Placeholders:** `{number}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Modern eras only; media-day portrait composer enabled. User choices may set pose, expression, angle, lighting, backdrop, uniform pieces, hairstyle, and permitted accessories; only the published render triggers reactions.

**Required state:** player_id; team_id; registered_number; previous_number; number_assignment_new; photo_id; first_public_reveal

**Consequences:** Publish the confirmed assignment and audience reactions; update visible portrait number. Do not invent a number conflict, retired number, or future achievement.

**Media examples:**

- {player}'s newly registered No. {number} receives its public introduction.
- {team} confirm the number visible in the media-day presentation.
- The reveal adds an official jersey detail to the first-look discussion.

### `media.day.new_team_jersey_debate`

**Trigger:** A player already legally registered with a different team publishes the first approved media-day portrait in the new team uniform, and audience aesthetic reactions cross a discussion threshold. jersey describes the chosen uniform pieces.

**Placeholders:** `{jersey}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Modern eras only; media-day portrait composer enabled. User choices may set pose, expression, angle, lighting, backdrop, uniform pieces, hairstyle, and permitted accessories; only the published render triggers reactions.

**Required state:** player_id; team_id; previous_team_id; registration_verified; first_new_team_photo; uniform_style; uniform_colors; uniform_layers; jersey_description; aesthetic_discussion_count

**Consequences:** Create a new-uniform first-impression story and allow future photo-piece choices. Team destination and contract remain unchanged; visual reaction does not establish fit.

**Media examples:**

- {player}'s {jersey} portrait makes the team change visible.
- The first verified {team} uniform image prompts an aesthetic debate.
- The jersey reaction introduces the new chapter without grading its basketball outcome.

### `media.day.rivals_group_photo`

**Trigger:** Two players with an established sporting rivalry voluntarily approve and publish a verified joint media-day photograph. pose describes the public arrangement, not an inferred relationship.

**Placeholders:** `{player}`, `{pose}`, `{rival}`, `{team}`

**Modes:** player; franchise

**Availability:** Modern eras only; media-day portrait composer enabled. User choices may set pose, expression, angle, lighting, backdrop, uniform pieces, hairstyle, and permitted accessories; only the published render triggers reactions.

**Required state:** player_id; team_id; rival_id; rivalry_record; photo_id; joint_photo_consent; photo_pose; photo_expression; photo_camera_angle; pose_description

**Consequences:** Store a public joint-camera moment and optional media interpretations. Preserve actual rivalry and relationship state unless independently changed.

**Media examples:**

- {player} and {rival} appear together in the verified media-day photo.
- The public {pose} arrangement creates a rival-photo talking point.
- {team}'s shared frame records a camera moment without declaring a friendship.

### `media.day.hairstyle_reveal`

**Trigger:** User selects or approves a permitted visible hairstyle piece that differs from the previously published player look, and a new media-day portrait is publicly released. The change is observable and no private motive is inferred.

**Placeholders:** `{look}`, `{player}`, `{team}`

**Modes:** player; franchise

**Availability:** Modern eras only; media-day portrait composer enabled. User choices may set pose, expression, angle, lighting, backdrop, uniform pieces, hairstyle, and permitted accessories; only the published render triggers reactions.

**Required state:** player_id; team_id; previous_hairstyle; selected_hairstyle; hairstyle_change_verified; photo_id; look_description; publication_approved

**Consequences:** Update the visible portrait piece and publish a style-reveal reaction. No automatic ability, attractiveness, medical, age, or personality judgment is attached.

**Media examples:**

- {player}'s changed {look} hairstyle receives a public media-day reveal.
- {team} publish the verified style update in the approved portrait.
- The camera records an appearance change while its cause remains private.

