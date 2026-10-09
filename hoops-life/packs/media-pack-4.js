window.HL_PACKS = window.HL_PACKS || [];

HL_PACKS.push({
  name: 'media-pack-4',
  lines: {
    'court.buzzer_review_reversal': [
      'Replay wipes out {player}\'s apparent winner for {team}.',
      'The ball is still in {player}\'s hand at the horn. The celebration ends at the monitor.',
      '{team} lose the shot to the clock, not the rim.',
    ],
    'court.four_point_play': [
      '{player} converts a four-point play against {opp}.',
      'One shot, one whistle, four points for {player}.',
      '{opp} surrender the basket and the extra free throw.',
    ],
    'court.intentional_free_throw_miss': [
      '{player}\'s deliberate miss gives {team} another possession.',
      '{team} win the rebound after {player} targets the rim.',
      'The miss is the plan; possession is the prize for {team}.',
    ],
    'court.foul_up_three_backfire': [
      '{team}\'s foul-up-three plan hands {opp} the lead.',
      '{opp} turn the intentional whistle into an advantage.',
      '{team} try to remove the tying three from the equation. {opp} find another way to take the lead.',
    ],
    'court.shot_clock_buzzer_make': [
      '{player} beats the shot clock for {team}.',
      '{opp} defend almost the entire possession; {player} finishes the rest.',
      'The clock nearly wins. {player} gets there first.',
    ],
    'court.self_rebound_putback': [
      '{player} cleans up his own miss against {opp}.',
      'The first attempt misses; {player}\'s second effort lands.',
      '{opp} stop the shot but surrender the follow-up.',
    ],
    'court.own_basket': [
      '{team} gift {opp} an accidental basket.',
      'Wrong hoop, real points: {opp} benefit from {team}\'s mistake.',
      '{opp} get points from the most reluctant scorer on the floor.',
    ],
    'court.backcourt_violation_decider': [
      '{team}\'s final chance ends with a backcourt whistle.',
      '{opp} get the stop without another shot being taken.',
      'The final chance crosses halfway and goes no farther for {team}.',
    ],
    'court.heave_team_record': [
      '{player} sets {team}\'s distance mark with a {distance} basket.',
      'The measurement is official: {distance} for {player}.',
      '{team}\'s longest-shot record now belongs to {player}.',
    ],
    'court.live_ball_timeout_denied': [
      '{player}\'s timeout request cannot stop {opp}\'s score.',
      '{opp} keep playing while {player} looks toward the officials.',
      '{player} asks for a pause; {opp} supply another basket.',
    ],
    'court.charge_triple': [
      '{player} draws three charges for {team}.',
      '{opp} meet the same stationary obstacle three times.',
      '{player} changes three possessions without blocking a shot.',
    ],
    'court.verticality_clean_stop': [
      '{player} wins the rim contest cleanly against {opp}.',
      'Arms straight up, possession secured: {team} finish the stop.',
      'The replay backs {player}\'s defense at the basket.',
    ],
    'court.block_recovered_by_shooter': [
      '{opp} score after recovering {player}\'s block.',
      'Nice block from {player}. Unfortunately for {team}, the possession is still alive.',
      'The block makes the highlight. The second shot makes {opp}\'s scorebook.',
    ],
    'court.full_court_press_turnovers': [
      '{team}\'s press forces three straight {opp} turnovers.',
      '{opp} cannot get through the first wave of pressure.',
      'Three possessions disappear before {opp} can settle into offense.',
    ],
    'court.zone_corner_exposure': [
      '{opp} punish {team}\'s zone from the corners.',
      'The zone protects the middle while {opp} collect corner threes.',
      '{opp} keep finding the corners of {team}\'s comfort zone.',
    ],
    'court.defensive_three_seconds_spree': [
      '{player} is whistled twice for defensive three seconds.',
      '{team} pay twice for {player}\'s extended stay in the lane.',
      '{player} spends too long in the paint twice. The officials charge rent.',
    ],
    'court.switch_miscommunication': [
      '{team}\'s crossed switch leaves {opp} an open basket.',
      'Two defenders choose one assignment; {opp} find the abandoned one.',
      'The coverage call and the coverage itself part ways for {team}.',
    ],
    'court.no_field_goals_quarter': [
      '{team} hold {opp} without a field goal for a quarter.',
      'Every {opp} shot from the floor stays out in that period.',
      'An entire quarter, and {opp} cannot buy a make from the floor.',
    ],
    'court.steal_without_dribble': [
      '{player} steals the inbound and scores against {opp}.',
      '{opp}\'s possession barely begins before {player} ends it.',
      'One intercepted pass puts {team} straight back on the board.',
    ],
    'court.rebound_after_five_tips': [
      '{player} secures the rebound after five contested tips.',
      'The ball refuses to land until {player} claims it for {team}.',
      'The rebound needs five tips and one stubborn finish from {player}.',
    ],
    'strategy.five_out_zero_paint': [
      '{team} score {pts} in a quarter without a paint touch.',
      'The paint might as well be wet: {team} never touch it while scoring {pts}.',
      '{team}\'s perimeter-only quarter ends at {pts}.',
    ],
    'strategy.two_big_guards_press': [
      '{coach} assigns {team}\'s two tallest players to the perimeter.',
      '{team} test size against the ball under {coach}\'s new assignments.',
      'The experiment moves {team}\'s height away from the rim.',
    ],
    'strategy.deliberate_last_shot_fail': [
      '{team} wait for the last shot and never take it.',
      '{opp} break up the possession {team} spend the clock protecting.',
      'The final-shot plan ends in a turnover for {team}.',
    ],
    'strategy.intentional_foul_target_counter': [
      '{opp}\'s substitution ends {team}\'s targeted fouling scheme.',
      'The intended free-throw target leaves; {team} change their plan.',
      '{opp} answer the whistles through the substitution table.',
    ],
    'strategy.zero_dribble_possession': [
      '{team} score without a single dribble against {opp}.',
      'The ball travels by pass all the way to {team}\'s basket.',
      'No dribbling required. {team} pass their way directly to a basket.',
    ],
    'strategy.keeper_inbound_lob': [
      '{team}\'s long inbound lob beats the final second.',
      'One pass travels the floor and delivers {team}\'s basket.',
      '{opp} cannot interrupt the airborne shortcut.',
    ],
    'strategy.no_timeout_protocol': [
      '{coach} lets {team} organize their own response.',
      'No whistle from the bench: {team} reach their rehearsed set themselves.',
      '{team} use the on-court reset {coach} has practiced.',
    ],
    'strategy.bench_unit_full_half': [
      '{coach} hands an entire half to {team}\'s second unit.',
      '{team}\'s rotation experiment gives the reserves the whole period.',
      'The usual starters watch an entire half become somebody else\'s shift.',
    ],
    'strategy.switch_everything_small_sample': [
      '{team}\'s switching experiment starts with ten possessions of paint denial.',
      '{opp} find no made basket in the lane during the opening test.',
      'Ten possessions, zero paint makes for {opp}. Promising start; long exam ahead.',
    ],
    'strategy.rule_legal_four_players': [
      '{team} try a legal four-player possession.',
      '{coach} leaves one spot empty under the active rulebook.',
      'Four players take the floor for {team}\'s unusual experiment.',
    ],
    'ref.double_technical_offset': [
      'Officials assess offsetting technicals to {team} and {opp}.',
      'The whistle makes a double appearance. The free-throw line gets no visitors.',
      'The officials record both penalties and cancel their shooting effect.',
    ],
    'ref.challenge_success_cost': [
      '{team} win the review and lose their last timeout.',
      '{coach} gets the call corrected at a clock-management cost.',
      '{team} get the right call and an empty timeout cupboard.',
    ],
    'ref.goaltending_reversed': [
      'Replay restores {player}\'s block and removes {opp}\'s points.',
      'The points disappear; {player}\'s block gets its name back.',
      '{team} get a clean stop back from the review.',
    ],
    'ref.stat_correction_assist': [
      'The official scorer revises {player}\'s assists to {ast}.',
      '{player}\'s final line changes after the film review.',
      'The film-room recount gives {player} {ast} assists. The final score stays put.',
    ],
    'ref.wrong_free_throw_shooter': [
      'Officials correct {team}\'s free-throw shooter error.',
      'The wrong player steps up; the rulebook supplies the remedy.',
      '{team}\'s free-throw sequence is reset under the error procedure.',
    ],
    'ref.clock_reset_dispute_resolved': [
      'Officials reset the clock to {remaining} for {team} and {opp}.',
      'The timing review restores {remaining} to the display.',
      'A clock correction gives both teams the same verified time.',
    ],
    'ref.inadvertent_whistle_replay': [
      'An inadvertent whistle interrupts {team}\'s possession.',
      'Play stops for a sound the official confirms was unintended.',
      '{team} and {opp} resume under the accidental-whistle procedure.',
    ],
    'ref.unsportsmanlike_upgrade': [
      'Review upgrades {player}\'s foul to {classification}.',
      'The officials apply {penalty} after reviewing {player}\'s contact.',
      '{team} face the confirmed consequence of the upgraded call.',
    ],
    'ref.last_two_minutes_error': [
      'League report identifies {error} in {team}\'s game.',
      'The review acknowledges {error}; it does not replay the finish.',
      '{team} receive an official explanation after the result becomes final.',
    ],
    'ref.scoreboard_three_corrected': [
      '{player}\'s basket is corrected from three points to two.',
      'A foot on the line changes {team}\'s total.',
      'The replay keeps the make and removes one point.',
    ],
    'record.five_by_five': [
      '{player} fills all five columns for {team}.',
      'Five in every major counting category: {player} leaves no empty lane.',
      '{team} get a five-by-five from {player}.',
    ],
    'record.perfect_high_volume': [
      '{player} goes {fgm}-for-{fga} against {opp}.',
      'Ten attempts or more, zero misses for {player}.',
      '{opp} never see a missed field goal from {player}.',
    ],
    'record.quadruple_double': [
      '{player} records a verified quadruple-double for {team}.',
      'Four categories reach double digits in {player}\'s final box score.',
      'Four columns, double digits, one {player}. The final box score is remarkable.',
    ],
    'record.assist_turnover_clean': [
      '{player} delivers {ast} assists without a turnover.',
      'Every risk pays its way in {player}\'s passing ledger.',
      '{team} get {ast} assists and no lost possession from {player}.',
    ],
    'record.minutes_sixth_overtime': [
      '{player} logs a franchise-record {min} minutes for {team}.',
      'Six extra periods stretch {player}\'s workload into team history.',
      '{team}\'s minutes record changes hands during the marathon.',
    ],
    'record.career_free_throw_mark': [
      '{player} becomes {league}\'s career free-throw leader.',
      'The latest make gives {player} the all-time total.',
      'One more trip to the stripe puts {player} above everyone in {league}\'s history.',
    ],
    'record.oldest_debut': [
      '{player} sets {league}\'s debut-age record at {age}.',
      'His first appearance arrives at {age}; the record book notices.',
      '{league} welcome their oldest first-time player in {player}.',
    ],
    'record.team_zero_turnovers': [
      '{team} complete an entire game without a turnover.',
      '{opp} never collect a turnover from {team}\'s final ledger.',
      'Every possession avoids a giveaway for {team}.',
    ],
    'record.one_point_scoring_record': [
      '{player}\'s free throws carry him past the season mark.',
      'No field-goal make is needed for {player}\'s record-setting total.',
      'The stripe supplies every point on {player}\'s milestone night.',
    ],
    'record.shared_jersey_milestone': [
      '{player} and {teammate} both reach {milestone} for {team}.',
      'One game gives {team} two career landmarks.',
      '{team} need two milestone balls tonight: one for {player}, one for {teammate}.',
    ],
    'amateur.walk_on_roster': [
      '{player} earns a walk-on place with {team}.',
      'The open tryout ends with a roster invitation for {player}.',
      '{player} shows up for the open door and earns a seat inside.',
    ],
    'amateur.scholarship_reinstated': [
      '{school} restore {player}\'s scholarship after appeal.',
      'The written decision gives {player} his funding back.',
      '{player}\'s successful appeal changes the cost of staying at {school}.',
    ],
    'amateur.exam_ineligible': [
      '{player} becomes academically ineligible at {school}.',
      'The classroom requirement removes {player} from competition.',
      '{school}\'s eligibility ruling makes academic recovery the next assignment.',
    ],
    'amateur.eligibility_restored': [
      '{school} clear {player} to compete again.',
      'The required coursework is complete; {player}\'s eligibility returns.',
      'Academic recovery opens the court door for {player}.',
    ],
    'amateur.transfer_credit_delay': [
      '{player}\'s debut at {school} waits on transfer-credit requirements.',
      'The move is complete; the academic paperwork is not.',
      '{school} cannot field {player} until the credit requirement is satisfied.',
    ],
    'amateur.grassroots_travel_fund': [
      '{player} receives travel support for {tournament}.',
      'The bursary pays for the route to {tournament}.',
      '{player}\'s opportunity no longer stops at the travel bill.',
    ],
    'amateur.combine_measurement_error': [
      '{event} correct {player}\'s published measurement to {measurement}.',
      'The measuring record changes after {event} acknowledge the error.',
      '{player} has not changed overnight. The corrected measuring sheet has.',
    ],
    'amateur.undrafted_tryout_offer': [
      '{team} invite undrafted {player} to a tryout.',
      'Draft night passes; {player}\'s next chance arrives by invitation.',
      'The draft overlooks him. {team} still want to see {player} on their court.',
    ],
    'amateur.redshirt_decision': [
      '{player} takes an approved redshirt year at {school}.',
      'This season becomes development time for {player}.',
      '{school} preserve an eligibility year through the redshirt choice.',
    ],
    'amateur.school_team_disbanded': [
      '{school} end their basketball program; {player} faces a new route.',
      'The roster disappears with the program at {school}.',
      '{player}\'s next decision begins with a team that no longer exists.',
    ],
    'training.offhand_breakthrough': [
      '{player}\'s off-hand work clears the tracked improvement mark.',
      'Practice shows up in twenty competitive attempts for {player}.',
      'The hand opponents used to invite is becoming the hand they have to respect.',
    ],
    'training.shot_rebuild_regression': [
      '{player}\'s rebuilt shot trails his previous baseline.',
      'The mechanics change is real; the early results are worse.',
      '{team} face the measured cost of {player}\'s shooting reset.',
    ],
    'training.shot_rebuild_recovery': [
      '{player}\'s rebuilt shot finally clears his old baseline.',
      'The follow-up sample rewards the mechanical overhaul.',
      'The ugly adjustment period finally gives {team} a better version of {player}\'s shot.',
    ],
    'training.film_mentor_certification': [
      '{player} completes {course} with {team}.',
      'The film room adds a qualification to {player}\'s resume.',
      '{team} gain a player who finishes the scouting coursework.',
    ],
    'training.language_course_complete': [
      '{player} finishes the {language} course.',
      'Learning the local language becomes another completed assignment for {player}.',
      '{team}\'s language program records {player}\'s completion.',
    ],
    'training.late_growth_adaptation': [
      '{team} revise {player}\'s plan after a verified growth change.',
      'New measurements give {player} a new development assignment.',
      '{coach} adjusts the skill work to {player}\'s changed frame.',
    ],
    'training.coach_license': [
      '{player} earns {license} during his playing career.',
      '{player} earns the bench qualification while his playing career is still open.',
      '{player} adds a formal coaching qualification to his resume.',
    ],
    'training.degree_completed': [
      '{player} completes his degree at {school}.',
      'The graduation requirement is satisfied alongside the game schedule.',
      '{player}\'s season includes a diploma from {school}.',
    ],
    'training.apprentice_trainer': [
      '{player} completes a supervised strength-training apprenticeship.',
      'The weight-room lessons give {player} a verified qualification.',
      '{team}\'s supervised program adds another skill to {player}\'s future plans.',
    ],
    'training.retrain_position_plan': [
      '{team} move {player} into {role} after the assessment.',
      'The development review gives {player} a new assignment.',
      '{coach} turns the completed training plan into a role change.',
    ],
    'world.national_team_choice': [
      '{player} commits to representing {country}.',
      'The official choice settles {player}\'s national-team route.',
      '{country} receive {player}\'s confirmed commitment.',
    ],
    'world.citizenship_clearance': [
      '{player} receives clearance to represent {country}.',
      'Citizenship paperwork and federation eligibility are both complete.',
      '{country}\'s roster can now formally include {player}.',
    ],
    'world.club_country_schedule': [
      '{player} chooses {competition} after a confirmed schedule conflict.',
      'Two calendars collide; {player}\'s filed decision selects {competition}.',
      '{team} receive the official resolution of {player}\'s overlapping commitments.',
    ],
    'world.release_letter_delayed': [
      '{player}\'s debut for {team} stalls over the release letter.',
      'The deadline passes without the required international clearance.',
      '{team} cannot register {player} for the scheduled opener.',
    ],
    'world.dual_league_contract': [
      '{player} signs a permitted dual-league arrangement with {team} and {otherteam}.',
      'One player, two permitted schedules: {player} has a busy basketball calendar.',
      '{team} and {otherteam} approve the shared-season contract structure.',
    ],
    'world.relegation': [
      '{team} are relegated from {league}.',
      'The final table sends {team} down a division.',
      'Next season\'s road map changes for {team}; the final table sends them down.',
    ],
    'world.promotion': [
      '{team} secure promotion to {league}.',
      'The route upward is complete for {team}.',
      '{city} get to circle a higher division on next season\'s calendar.',
    ],
    'world.currency_payment_shortfall': [
      '{player}\'s indexed salary falls short by {amount}.',
      'The currency clause gives {player} a verified unpaid balance.',
      '{team} owe the confirmed exchange-adjustment shortfall.',
    ],
    'world.visa_work_clearance': [
      '{player} receives work clearance for {team}.',
      'The permit arrives and opens {player}\'s professional route.',
      '{team}\'s registration can proceed after the authorization decision.',
    ],
    'world.cross_league_supercup': [
      '{team} qualify for {competition}.',
      'The next bracket brings opponents from beyond {league}.',
      '{team}\'s season expands into the cross-league cup.',
    ],
    'money.agent_fee_audit': [
      'An audit finds {amount} in excess fees charged to {player}.',
      'The contract math leaves {player} with a verified repayment claim.',
      '{player} checks the fees and finds money he should never have been charged.',
    ],
    'money.tax_payment_plan': [
      '{player} enters a tax payment plan for {amount}.',
      'The approved schedule gives {player} a structured way to repay.',
      'A tax balance becomes a documented installment obligation for {player}.',
    ],
    'money.tax_refund': [
      '{player} receives a confirmed tax refund of {amount}.',
      'The corrected filing puts {amount} back in {player}\'s accounts.',
      'The corrected tax bill comes with {amount} traveling back toward {player}.',
    ],
    'money.identity_theft_freeze': [
      '{player}\'s account is frozen after verified identity theft.',
      'The bank blocks further activity on {player}\'s compromised account.',
      'Unauthorized transactions force an account-security reset for {player}.',
    ],
    'money.scam_offer_rejected': [
      '{player} rejects a verified investment scam before paying.',
      'The independent check protects {player}\'s money.',
      'The pitch promises everything. {player}\'s independent check saves him from buying it.',
    ],
    'money.scam_loss_confirmed': [
      '{player} loses {amount} in a verified investment scam.',
      'The loss is confirmed; recovery remains a separate question.',
      '{player}\'s account balance records the cost of the fraudulent pitch.',
    ],
    'money.passive_income_covers_salary': [
      '{player}\'s investment income overtakes his playing salary.',
      'For {player}, the portfolio now earns more than the uniform.',
      'The audited portfolio pays {player} more than the season contract.',
    ],
    'money.business_profitable_exit': [
      '{player} exits {business} with a {amount} profit.',
      'The sale closes and turns {player}\'s ownership stake into realized gains.',
      '{player} leaves {business} with a completed sale and a {amount} profit.',
    ],
    'money.family_loan_repaid': [
      '{player} settles the family loan in full.',
      'The last payment closes {player}\'s agreed debt to {relation}.',
      '{relation} confirm the repayment and the end of the loan.',
    ],
    'money.insurance_claim_approved': [
      '{player}\'s insurer approves a {amount} claim.',
      'The covered loss receives a confirmed payout.',
      '{player} gets a decision on the policy he actually bought.',
    ],
    'legal.public_allegation_unverified': [
      'A filed complaint alleges {allegation} against {player}.',
      '{player} faces a public allegation that has not been established.',
      'The complaint is on record; its claim remains unproven.',
    ],
    'legal.private_inquiry_no_charge': [
      'Authorities open an inquiry into allegations involving {player}.',
      'No charge is filed as investigators examine {allegation}.',
      'An inquiry begins; {player}\'s legal outcome remains unresolved.',
    ],
    'legal.financial_fraud_charge': [
      '{player} is charged with financial fraud in {jurisdiction}.',
      'The filed charge begins a case, not a finding of guilt.',
      '{player} faces court proceedings over the prosecutor\'s fraud allegation.',
    ],
    'legal.tax_evasion_charge': [
      '{player} faces a filed tax-evasion charge.',
      'The tax case moves into court with guilt undecided.',
      'Prosecutors formally allege tax evasion by {player} in {jurisdiction}.',
    ],
    'legal.match_fixing_charge': [
      '{player} is charged in an alleged match-fixing case.',
      '{jurisdiction}\'s prosecutors file charges; the sporting outcome remains separate.',
      'The case alleges manipulated competition, with no verdict against {player} yet.',
    ],
    'legal.assault_charge': [
      '{player} faces an assault charge over {incident}.',
      'Prosecutors bring the case to court; guilt remains undecided.',
      'The filed allegation concerns {incident}, not an on-court confrontation.',
    ],
    'legal.possession_charge': [
      '{player} faces a possession charge under {jurisdiction}\'s law.',
      'The charging document concerns {substance}; the case has no verdict.',
      '{player}\'s legal team respond to the filed possession allegation.',
    ],
    'legal.trespass_charge': [
      '{player} is charged with trespass at {place}.',
      'A disputed entry becomes a formal court case for {player}.',
      'The charge alleges unauthorized entry; it does not establish guilt.',
    ],
    'legal.property_damage_charge': [
      '{player} faces a property-damage charge over alleged losses of {amount}.',
      'The prosecutor alleges damage at {place}; the case is unresolved.',
      '{player}\'s court case centers on a disputed property incident.',
    ],
    'legal.weapons_law_charge': [
      '{player} faces a weapons-law charge in {jurisdiction}.',
      'The allegation enters court under the applicable local statute.',
      'A filed charge creates a legal case for {player}; guilt is unproven.',
    ],
    'family.parental_leave': [
      '{player} takes approved parental leave from {team}.',
      '{team} confirm time away for {player}\'s family responsibilities.',
      '{team} make room on the calendar for a different kind of responsibility.',
    ],
    'family.caregiver_leave': [
      '{player} steps away from {team} for caregiving leave.',
      'Family care becomes {player}\'s immediate commitment.',
      '{team} approve the requested time away without demanding private details.',
    ],
    'family.eldercare_schedule': [
      '{team} adjust {player}\'s practice schedule for eldercare.',
      'A recurring care commitment gets a workable basketball timetable.',
      '{player} keeps his game duties under the agreed care arrangement.',
    ],
    'family.adoption_finalized': [
      '{player}\'s family announce a finalized adoption.',
      'The legal process concludes with a new family chapter.',
      '{player} shares the family news after the final approval.',
    ],
    'family.foster_care_approved': [
      '{player}\'s household receives foster-care approval.',
      'The approved household prepares for a new care responsibility.',
      '{player} announces the approval while keeping children\'s details private.',
    ],
    'family.partner_distance_plan': [
      '{player} and his partner choose a long-distance plan.',
      'Two cities become part of the couple\'s agreed schedule.',
      'A basketball move changes the travel, not the announced commitment.',
    ],
    'family.partner_job_relocation': [
      '{player}\'s family plan a move for his partner\'s new job.',
      'Another career sets the family destination this time; {player} confirms the move.',
      '{player} confirms the jointly agreed relocation to {city}.',
    ],
    'family.home_school_schedule': [
      '{player} adjusts his home schedule around {schooling}.',
      'Family education adds a regular appointment to {player}\'s calendar.',
      'The household\'s chosen school plan changes the routine off the court.',
    ],
    'family.sibling_career_meeting': [
      '{player} faces {sibling} for their first meeting in {league}.',
      'The family matchup finally reaches the official schedule.',
      '{team} get a scouting report with a family connection.',
    ],
    'family.reunion_after_estrangement': [
      '{player} and {relation} announce a reconciliation.',
      'The family confirm a renewed connection on their own terms.',
      '{player} shares a repaired relationship with no private dispute details.',
    ],
    'health.sleep_study_treatment': [
      '{player} begins clinician-guided care for {condition}.',
      'A confirmed diagnosis gives {player}\'s sleep concerns a treatment plan.',
      '{team} support the publicly disclosed care arrangement.',
    ],
    'health.concussion_protocol_clear': [
      '{player} completes the concussion protocol for {team}.',
      'Independent clearance opens the next stage of {player}\'s return.',
      'The required medical checks are complete; availability still follows team planning.',
    ],
    'health.second_opinion_disagreement': [
      '{player} weighs differing medical opinions on {condition}.',
      'The specialists disagree; {player}\'s treatment choice remains open.',
      '{team} wait while {player} reviews the two qualified assessments.',
    ],
    'health.second_opinion_choice': [
      '{player} selects {treatment} after a second-opinion review.',
      'The medical decision is made with qualified input.',
      '{team} receive {player}\'s confirmed treatment plan.',
    ],
    'health.preventive_rest': [
      '{team} rest {player} after the workload threshold is reached.',
      'The medical recommendation responds to accumulation, not a new injury.',
      '{player}\'s schedule pauses under the preventive-rest plan.',
    ],
    'health.nutrition_plan_success': [
      '{player}\'s supervised nutrition plan meets {benchmark}.',
      'The tracked result reaches the target set with qualified staff.',
      '{team} record a successful checkpoint in {player}\'s nutrition plan.',
    ],
    'health.extreme_diet_stopped': [
      '{player} ends an extreme diet after documented health concerns.',
      'Qualified advice redirects {player}\'s food plan.',
      '{team} confirm a supervised correction after the risky experiment.',
    ],
    'health.emergency_response_survival': [
      '{player} survives a medical emergency and remains under care.',
      'The family authorize a limited update: {player} is receiving treatment.',
      'Basketball waits while {player}\'s care team handle recovery.',
    ],
    'health.substance_treatment_completed': [
      '{player} completes a licensed treatment program.',
      'The announced milestone marks one step in {player}\'s ongoing recovery.',
      '{team} support the care plan that follows the completed program.',
    ],
    'health.medication_exemption': [
      '{player} receives a therapeutic-use exemption.',
      'The medical authority approves the documented prescription arrangement.',
      '{team} receive confirmation of {player}\'s permitted treatment status.',
    ],
    'access.hearing_accommodation': [
      '{team} add visual signals for {player}\'s hearing access.',
      'The new cue system makes the play call accessible.',
      '{player}\'s requested communication support becomes part of team practice.',
    ],
    'access.vision_equipment': [
      '{player}\'s vision equipment receives competition approval.',
      'The safety review clears the prescribed equipment for {team}\'s games.',
      '{player} can use the approved aid during competition.',
    ],
    'access.chronic_condition_plan': [
      '{team} adopt {player}\'s clinician-approved availability plan.',
      'A chronic condition receives an agreed management schedule.',
      '{player} sets the public boundaries around his care arrangements.',
    ],
    'access.arena_ramp_complete': [
      '{arena} open newly audited step-free routes.',
      'The renovation improves entry for supporters with mobility needs.',
      '{team}\'s home venue removes a verified access barrier.',
    ],
    'access.sensory_session': [
      '{team} host a lower-stimulation event at {arena}.',
      'The published access plan changes the crowd experience.',
      '{arena} welcome fans through the adapted event schedule.',
    ],
    'access.caption_feed_launch': [
      '{arena} launch tested live captions.',
      'The public-address message gains a readable route to fans.',
      '{team}\'s venue adds verified caption access.',
    ],
    'access.adaptive_league_entry': [
      '{player} joins {competition} under its eligibility rules.',
      'A new competition route opens for {player}.',
      'The confirmed registration puts {player} on the adaptive basketball schedule.',
    ],
    'access.coach_remote_health': [
      '{coach} begins an approved remote arrangement with {team}.',
      'The team adapt the job around an agreed access need.',
      '{team}\'s coaching work continues through the new arrangement.',
    ],
    'access.support_animal_approval': [
      '{arena} approve the assistance-animal access arrangement.',
      'A verified access decision supports {player}\'s attendance.',
      'The venue confirms the accommodation under the applicable rules.',
    ],
    'access.disabled_staff_hire': [
      '{team} hire {staff} with agreed workplace accommodations.',
      'The role begins with the access support already arranged.',
      '{staff} join {team}\'s staff under the confirmed employment plan.',
    ],
    'fame.album_release': [
      '{player} releases {project} outside basketball.',
      'The music project reaches listeners; sales remain to be seen.',
      '{player}\'s creative season now has a release date behind it.',
    ],
    'fame.album_chart': [
      '{player}\'s {project} reaches number {rank} on the chart.',
      'The published listing gives {player} a measurable music milestone.',
      '{player} has another ranking to check, and {project} is climbing into view.',
    ],
    'fame.film_role_complete': [
      '{player} appears in the released film {project}.',
      'The credits roll, and {player}\'s name is in them.',
      '{project} reaches viewers with {player} in its cast.',
    ],
    'fame.documentary_fact_dispute': [
      '{player} disputes {claim} in {project}.',
      'The documentary\'s claim meets an on-record disagreement.',
      'The account is contested; neither version becomes established by the argument.',
    ],
    'fame.memoir_release': [
      '{player} publishes his memoir, {project}.',
      'The next chapter of {player}\'s career comes bound in a book.',
      '{project} gives {player} a new place to tell his story.',
    ],
    'fame.podcast_regular_season': [
      '{player}\'s podcast reaches its third episode during the season.',
      'The microphone becomes a recurring appointment alongside {team}\'s games.',
      '{player} has three episodes out and games still on the calendar.',
    ],
    'fame.art_sale': [
      '{player}\'s original artwork sells for {amount}.',
      'The buyer completes the purchase of {project}.',
      'The artwork finds a buyer; {player}\'s creative ledger records {amount}.',
    ],
    'fame.stage_show_cancelled': [
      '{player} cancels {event} after a confirmed game conflict.',
      'The stage booking yields to {team}\'s schedule.',
      'Ticket holders receive notice of {player}\'s canceled appearance.',
    ],
    'fame.fan_award_accessibility': [
      '{player} receives {award} for accessible fan events.',
      'The honor recognizes the practical access choices in his appearances.',
      '{award} adds a public-service chapter to {player}\'s profile.',
    ],
    'fame.broadcast_trial': [
      '{player} completes a commentary trial with {outlet}.',
      'The guest microphone gives {player} a new professional audition.',
      '{player} tries the commentary chair while the playing career continues.',
    ],
    'fan.standing_ovation_return': [
      '{arena} welcome {player} back with a standing ovation.',
      'The first response to {player}\'s return comes from the seats.',
      'Before the opponent label can land, {arena} remind {player} he mattered here.',
    ],
    'fan.tickets_boycott_verified': [
      '{team}\'s attendance falls during the announced boycott.',
      'The empty-seat count gives the protest a measurable footprint.',
      'Supporters withhold attendance; {arena}\'s verified total drops.',
    ],
    'fan.court_intrusion_removed': [
      'Security stop a court intrusion at {arena}.',
      'Play pauses while an unauthorized spectator is removed.',
      '{team} and {opp} wait for the court to be cleared.',
    ],
    'fan.harassment_ban': [
      '{arena} ban a spectator after substantiated harassment.',
      'The conduct review leads to a confirmed access ban.',
      '{team} announce the venue\'s response without repeating the abusive language.',
    ],
    'fan.autograph_boundary': [
      '{player} sets new boundaries around off-hours autographs.',
      'The announced policy redirects requests to scheduled fan sessions.',
      '{player} keeps the public fan sessions and asks for space outside them.',
    ],
    'fan.fake_quote_correction': [
      '{outlet} retract a fabricated quote attributed to {player}.',
      'The correction confirms that {player} never made the circulated statement.',
      'The quote travels fast. {outlet}\'s correction finally catches it.',
    ],
    'fan.deepfake_labelled': [
      'Verification identifies the {player} video as synthetic.',
      'The footage is fabricated, and the correction is on record.',
      '{player}\'s actual actions cannot be inferred from the false clip.',
    ],
    'fan.arena_silence_tribute': [
      '{arena} observe the approved pregame remembrance.',
      'The crowd pause together before {team}\'s game.',
      'A quiet tribute follows the family\'s stated wishes.',
    ],
    'fan.supporter_translation': [
      'Supporters publish {team}\'s authorized guide in {language}.',
      'More fans can read the practical information for {arena}.',
      'The volunteer translation gives {team}\'s welcome another language.',
    ],
    'fan.chant_rule_approved': [
      '{arena} approve the supporters\' new chant.',
      'The reviewed chant enters {team}\'s matchday routine.',
      'The supporters write it; {arena} clear it; the crowd get a new refrain.',
    ],
    'community.court_reopened': [
      '{player}\'s supported court project opens in {city}.',
      'The inspection is complete; the neighborhood can use the court.',
      'The fence comes down and the neighborhood gets its court back.',
    ],
    'community.court_budget_overrun': [
      '{project} exceeds its budget by {amount}.',
      'The court is still a promise, and its construction bill just grows.',
      '{player}\'s backed project publishes the revised completion plan.',
    ],
    'community.water_distribution': [
      '{player} helps distribute emergency supplies in {city}.',
      'The relief agency records the completed distribution shift.',
      'A day off becomes practical support under the local response plan.',
    ],
    'community.youth_coach_training': [
      '{player} completes the required training for {program}.',
      'The community coaching role begins with its qualifications satisfied.',
      '{program} clear {player} for the supervised youth sessions.',
    ],
    'community.local_election_candidate': [
      '{player} registers for {office} in {city}.',
      '{player} trades an offseason announcement for a place on the ballot.',
      '{player}\'s campaign begins with the registration complete.',
    ],
    'community.local_election_result': [
      '{player}\'s certified election result is {result}.',
      'The official count settles his campaign for {office}.',
      '{city}\'s electoral authority confirms {result} for {player}.',
    ],
    'community.disaster_game_postponed': [
      '{team}\'s game at {arena} is postponed for safety.',
      'Basketball pauses under the verified local emergency plan.',
      '{opp} await a new date while responders handle the emergency.',
    ],
    'community.worker_housing_support': [
      '{team} complete the agreed housing-support contribution in {city}.',
      'The independent provider confirms receipt of {amount}.',
      'The documented contribution supports housing through {program}.',
    ],
    'community.public_transit_campaign': [
      '{player} backs {proposal} for {city}\'s transit network.',
      'The campaign connects arena access with everyday travel.',
      '{player}\'s public support attaches to a published transport proposal.',
    ],
    'community.school_attendance_mentor': [
      '{program} report improved school attendance with {player}\'s support.',
      'The evaluation records {change} against the program\'s baseline.',
      '{program}\'s attendance improvement comes with a measured result, not just a photo opportunity.',
    ],
    'travel.charter_delay': [
      '{team}\'s delayed charter moves tip-off to {time}.',
      'The verified travel disruption changes {arena}\'s schedule.',
      '{opp} receive the revised start time after {team}\'s flight delay.',
    ],
    'travel.equipment_missing': [
      '{team} secure replacement equipment after the shipment goes missing.',
      'The gear takes the wrong trip; {team}\'s staff rescue the right game.',
      '{arena}\'s game proceeds with the confirmed replacement gear.',
    ],
    'travel.passport_replacement': [
      '{player} receives a replacement passport after losing the original.',
      'The document problem ends with official travel papers restored.',
      '{team} can resume {player}\'s travel arrangements after the replacement.',
    ],
    'travel.hotel_double_booking': [
      '{team} change hotels after an acknowledged booking error.',
      'The confirmed rooms are not available; the staff arrange another base.',
      'The road trip acquires one more road: the route to another hotel.',
    ],
    'travel.altitude_acclimation': [
      '{team} complete their acclimation stay before {arena}\'s game.',
      'The travel plan includes preparation for the venue\'s altitude.',
      '{coach}\'s schedule gives {team} a verified adaptation window.',
    ],
    'travel.border_entry_denied': [
      '{player}\'s entry is denied over {reason}.',
      'The official border decision prevents {player} joining {team}\'s trip.',
      'Administrative entry requirements stop the journey at this checkpoint.',
    ],
    'travel.storm_shelter': [
      '{team} shelter under the official weather directive.',
      'The trip pauses while the alert remains active.',
      'Basketball travel waits for the safety authority\'s all-clear.',
    ],
    'travel.bus_repair_good_samaritan': [
      'A local operator gets {team} moving after the bus breakdown.',
      'The replacement vehicle keeps the verified road trip alive.',
      'The bus stops, the local replacement arrives, and {team} get moving again.',
    ],
    'travel.time_zone_schedule_error': [
      '{team} miss {appointment} after a time-zone mix-up.',
      'The itinerary and the local clock disagree. {team} miss the appointment.',
      'Staff confirm the scheduling error behind the missed appointment.',
    ],
    'travel.neutral_site_reschedule': [
      '{team} and {opp} move their game to {arena}.',
      'The original venue falls through; a neutral court takes its place.',
      'The revised fixture has a confirmed home at {arena}.',
    ],
    'staff.assistant_head_interim': [
      '{coach} takes interim charge of {team}.',
      'The temporary appointment covers the head coach\'s approved absence.',
      '{team} confirm the interim bench arrangement.',
    ],
    'staff.player_coach_contract': [
      '{player} signs a permitted player-coach agreement with {team}.',
      '{player} now has to prepare for the huddle and the minutes after it.',
      '{team} formalize the dual role under the active competition rules.',
    ],
    'staff.coaching_tree_final': [
      '{coach} faces former mentor {mentor} in {competition}\'s final.',
      'The coaching tree splits across the championship sidelines.',
      'A documented bench partnership becomes the final\'s coaching matchup.',
    ],
    'staff.playbook_stolen_verified': [
      'A review confirms {team}\'s confidential playbook was copied without authorization.',
      'The document breach is verified; individual responsibility requires separate findings.',
      '{team} replace compromised strategy material after the review.',
    ],
    'staff.interpreter_hired': [
      '{team} hire {staff} as a qualified interpreter.',
      'Team instructions gain a dedicated language bridge.',
      '{coach}\'s meetings add verified communication support.',
    ],
    'staff.scout_false_report': [
      '{team} withdraw a scouting report after verified fabrication.',
      'The audit finds invented observations in the evaluation file.',
      '{gm} remove the false report from {team}\'s decision process.',
    ],
    'staff.scout_hidden_gem_validation': [
      '{scout}\'s logged recommendation pays off for {team}.',
      '{player} meets the benchmark that tests the scouting call.',
      'The overlooked recruit turns {scout}\'s written projection into measured value.',
    ],
    'staff.qualified_medical_hire': [
      '{team} add {staff} to a new licensed medical role.',
      'The verified appointment expands the club\'s care capacity.',
      'A new staff position becomes an actual hire for {team}.',
    ],
    'staff.coach_delegates_timeout': [
      '{coach} hands {team}\'s timeout huddle to {assistant}.',
      'The assistant\'s recorded set comes out of the break.',
      '{coach} gives the huddle away; {assistant}\'s set comes out onto the floor.',
    ],
    'staff.staff_payroll_missed': [
      '{team} miss the contractual staff payroll date.',
      'The club\'s records confirm overdue wages to nonplayer employees.',
      'The employment obligation is unpaid; the balance is documented.',
    ],
    'owner.sale_closed': [
      '{owner} complete the purchase of {team}.',
      'The approved sale closes and transfers the club.',
      'The signatures settle it: {owner} now owns {team}.',
    ],
    'owner.fan_share_launch': [
      '{team} launch an approved supporter-share offering.',
      'Fans can review the published ownership terms.',
      'The club\'s legal structure opens a documented route to supporter participation.',
    ],
    'owner.arena_debt_refinance': [
      '{team} refinance {arena}\'s debt under the confirmed agreement.',
      'The stadium balance receives a new repayment schedule.',
      '{owner} close the arena financing transaction.',
    ],
    'owner.facility_upgrade_complete': [
      '{team} open the inspected training upgrade.',
      'The upgrade leaves the renderings behind and opens to {team}\'s players.',
      '{coach}\'s sessions move into the completed space.',
    ],
    'owner.training_project_cancelled': [
      '{team} cancel the facility project after funding falls through.',
      'The construction plan ends before the upgrade opens.',
      '{owner} confirm the financing failure behind the canceled project.',
    ],
    'owner.concession_price_cut': [
      '{arena} put the announced concession price cuts into effect.',
      '{team}\'s supporters meet the lower prices at the counter.',
      '{team}\'s supporters find the promised lower prices on the actual menu.',
    ],
    'owner.community_ownership_vote': [
      '{team}\'s supporters approve community ownership.',
      'The certified vote clears the proposed governance conversion.',
      '{city}\'s club gains a voter-approved ownership direction.',
    ],
    'owner.succession_plan_activated': [
      '{team} activate the approved succession plan.',
      'Control passes under the previously documented arrangement.',
      '{owner} take the role defined in the club\'s succession agreement.',
    ],
    'owner.insolvency_administration': [
      '{team} enter court-supervised administration.',
      'A formal insolvency process takes control of the club\'s finances.',
      '{city}\'s team face a court-managed restructuring, with fixtures separately reviewed.',
    ],
    'owner.employees_buyout': [
      '{team}\'s employees complete the controlling-stake buyout.',
      'The workers become the club\'s approved controlling owners.',
      'The people who work for {team} now control the club they keep running.',
    ],
    'integrity.suspicion_threshold': [
      '{team}\'s recorded alterations trigger an integrity warning.',
      'The warning flags unusual changes without deciding a violation.',
      'A documented suspicion threshold puts {team}\'s roster under closer review.',
    ],
    'integrity.owners_complaint_filed': [
      'Owners file a competitive-balance complaint concerning {team}.',
      'The filing alleges distortion; the league has not ruled on it.',
      '{team} face a recorded owner complaint rather than a proven violation.',
    ],
    'integrity.trade_veto': [
      'League vetoes {team}\'s proposed transaction with {opp}.',
      'The official decision blocks the deal under {rule}.',
      '{player}\'s planned move cannot proceed after the veto.',
    ],
    'integrity.draft_picks_forfeited': [
      '{team} forfeit {picks} after a final integrity ruling.',
      'The confirmed penalty reaches beyond this season\'s roster.',
      '{team}\'s future draft board has {picks} missing from it.',
    ],
    'integrity.roster_remediation_order': [
      '{team} receive a roster-remediation order due by {deadline}.',
      'The final ruling requires the illegal registrations to be corrected.',
      '{gm} must repair the roster under the published league order.',
    ],
    'integrity.union_formal_protest': [
      'The union formally protests {remedy}.',
      'Players contest the league\'s response through the recorded process.',
      'The remedy faces a filed union objection rather than a work stoppage.',
    ],
    'integrity.season_shortened': [
      'League ratifies a {games}-game season after the disruption.',
      'The revised schedule replaces the abandoned full-length calendar.',
      '{season} will finish under the confirmed shortened format.',
    ],
    'integrity.season_cancelled': [
      'League cancels the remainder of {season}.',
      'The official decision ends the schedule before its planned finish.',
      'Clubs receive the published cancellation terms for {season}.',
    ],
    'integrity.cba_ratified': [
      'League and union ratify the new collective agreement.',
      'The signed labor deal establishes the next competition framework.',
      '{season}\'s operating terms move into a formally approved agreement.',
    ],
    'integrity.sandbox_exemption': [
      'Sandbox accepts {team}\'s edit with integrity enforcement disabled.',
      'The configured exemption permits {change} in this save.',
      '{team}\'s experiment proceeds under the declared Sandbox rules.',
    ],
    'history.three_point_line_debut': [
      '{league} play their first game with the three-point line.',
      'A new scoring boundary enters the official scorebook.',
      'The perimeter acquires a different value in {league}.',
    ],
    'history.shot_clock_first_game': [
      '{league} begin the shot-clock era.',
      'Possession now has a measured deadline in {competition}.',
      'The new clock changes the conditions of the opening fixture.',
    ],
    'history.televised_first_game': [
      '{team}\'s game reaches television for the first time.',
      'The approved broadcast brings {arena}\'s contest into viewers\' homes.',
      'A new medium carries {team}\'s basketball beyond the seats.',
    ],
    'history.radio_call_debut': [
      '{station} carry {team}\'s first live radio call.',
      'Listeners follow the contest through the new authorized broadcast.',
      'The action at {arena} now reaches supporters who cannot take a seat.',
    ],
    'history.integrated_team_debut': [
      '{player} debuts after {league} remove the exclusionary rule.',
      'A discriminatory barrier ends; the qualified player takes the floor.',
      '{team}\'s lineup reflects the formally changed eligibility policy.',
    ],
    'history.minimum_wage_first_contract': [
      '{player}\'s contract reaches {league}\'s new minimum salary.',
      'The labor agreement creates a floor beneath the player\'s pay.',
      '{team} make the first required minimum-salary adjustment.',
    ],
    'history.neutral_barn_game': [
      '{team} meet {opp} in the approved converted hall.',
      'The inspected venue supplies an unusual setting for the fixture.',
      'The traveling contest brings official basketball to {arena}.',
    ],
    'history.computer_scouting_first': [
      '{team} introduce their first computer-assisted scouting system.',
      'The scouting office adds a new method to its existing reports.',
      '{gm} approve the club\'s first digital evaluation workflow.',
    ],
    'history.hand_check_rule_first': [
      '{team}\'s first game under the new contact standard records {calls} calls.',
      'The written enforcement change reaches the whistle at {arena}.',
      '{coach} gets the first measured sample of the new standard.',
    ],
    'history.merger_club_admission': [
      '{team} make their debut in the merged {league}.',
      'The merger moves from signatures to the official schedule.',
      'The old league boundary disappears from {team}\'s new fixture list.',
    ],
    'relocate.move_approved': [
      '{team}\'s move to {city} receives final approval.',
      'The relocation proposal becomes an authorized plan.',
      'The required votes clear {team}\'s new city destination.',
    ],
    'relocate.vote_rejected': [
      'The relocation vote keeps {team} in {city}.',
      'The proposed move fails at the official decision.',
      '{team} remain under the confirmed stay requirement.',
    ],
    'relocate.new_city_first_home': [
      '{team} play their first home game in {city}.',
      'The new arena schedule begins with an official fixture.',
      '{arena} becomes {team}\'s actual home court.',
    ],
    'relocate.old_city_exhibition': [
      '{team} return to {oldcity} for the agreed exhibition.',
      'The visit reconnects the club with its previous home.',
      'The team come back for a night; {oldcity} get the agreed return visit.',
    ],
    'relocate.expansion_franchise_awarded': [
      '{city} receive an approved expansion franchise.',
      'The application clears the league\'s final vote.',
      '{league}\'s next roster of clubs includes a new city.',
    ],
    'relocate.expansion_draft_complete': [
      '{team} complete their expansion selections.',
      'The protection lists give way to an actual opening roster.',
      '{gm} finish the draft that builds {team}\'s first squad.',
    ],
    'relocate.rebrand_approved': [
      '{team} launch their approved new identity in {city}.',
      'The club\'s name changes while its home city remains.',
      'The approved rebrand reaches uniforms and official records.',
    ],
    'relocate.jersey_number_conflict': [
      '{player} and {teammate} settle {team}\'s jersey-number conflict.',
      'The agreed allocation ends the duplicate-number request.',
      '{team} publish the resolved numbers before registration.',
    ],
    'relocate.name_vote_result': [
      'Supporters choose {identity} in {team}\'s certified name vote.',
      'The published count settles the club\'s naming shortlist.',
      'A supporter ballot gives the new identity its official selection.',
    ],
    'relocate.arena_groundbreaking': [
      'Work begins on {team}\'s approved new arena in {city}.',
      '{team}\'s new home finally moves past the drawing board.',
      'Permits and financing turn {arena} from a drawing into a building site.',
    ],
    'comeback.release_from_service': [
      '{player} re-registers with {team} after completing his service.',
      'The official obligation ends and the basketball route reopens.',
      '{team} receive clearance for his post-service return.',
    ],
    'comeback.after_care_leave_first_game': [
      '{player} returns to competition after caregiving leave.',
      'Family leave gives way to a completed appearance for {team}.',
      'The comeback is a game played, with the care commitment still respected.',
    ],
    'comeback.after_medical_emergency_first_game': [
      '{player} completes his first game after the medical emergency.',
      'The return follows independent clearance and the agreed plan.',
      '{team} welcome an actual appearance after the long care journey.',
    ],
    'comeback.amateur_status_return': [
      '{player} receives restored amateur eligibility.',
      'The applicable federation opens a permitted competition route.',
      'The status change is official, with future appearances still to come.',
    ],
    'comeback.career_gap_paid_trial': [
      '{team} offer {player} a paid trial after {years} away.',
      '{player} gets a paid chance to answer what {years} away have changed.',
      '{player} gets paid time to prove his basketball return.',
    ],
    'comeback.return_trial_passed': [
      '{player} passes the return trial and earns {team}\'s contract.',
      'The audition ends with a place on the roster.',
      'The audition is over. {player} has a roster place again.',
    ],
    'comeback.return_trial_failed': [
      '{team} end {player}\'s return trial without a contract.',
      'The assessment does not meet the stated roster requirements.',
      'This door closes for {player}; the comeback has not found a contract here.',
    ],
    'comeback.second_sport_debut': [
      '{player} makes an official debut in {sport}.',
      'A cleared registration turns the second-sport plan into competition.',
      'The new scorebook records {player}\'s first appearance.',
    ],
    'comeback.education_gap_return': [
      '{player} returns to {team} after the education break.',
      'The completed course gives way to a new competitive appearance.',
      'His basketball pause ends with the academic objective met.',
    ],
    'comeback.probation_roster_offer': [
      '{team} offer {player} a conditional return contract.',
      'The league clearance carries {conditions} into the roster agreement.',
      'A new opportunity comes with the documented requirements attached.',
    ],
    'experiment.eight_foot_build': [
      '{player}\'s {height} build enters the custom simulation.',
      'The configured builder accepts the unusual frame with {tradeoffs}.',
      'The custom roster lists {player} at {height}. The experiment is about to meet a schedule.',
    ],
    'experiment.minimum_height_build': [
      '{player}\'s {height} build tests the lower end of the custom builder.',
      'The simulation records {tradeoffs} for the selected frame.',
      '{team} enter the experiment with the reach and mobility settings declared.',
    ],
    'experiment.zero_cap': [
      '{league} begin with a zero cap and {policy}.',
      'The unusual budget setting operates under the selected exemption policy.',
      '{team}\'s registration follows the declared zero-cap framework.',
    ],
    'experiment.no_cap_budget_shortfall': [
      '{team}\'s legal no-cap payroll exceeds their cash funding.',
      'Removing the ceiling does not supply the bank balance.',
      'No salary ceiling, but still a cash shortage: {team} face a {amount} funding gap.',
    ],
    'experiment.four_point_make': [
      '{player} makes his first four-point basket for {team}.',
      'The custom boundary turns that made shot into four.',
      '{team}\'s scorebook records the new line in action.',
    ],
    'experiment.cross_era_lineup': [
      '{team} field a lineup drawn from {eras} source eras.',
      'Four source eras share one huddle for {team}. The custom adjustment rules do the translation.',
      'The declared era-adjustment model governs {team}\'s mixed lineup.',
    ],
    'experiment.clone_roster': [
      'Sandbox fields {copies} versions of {player} for {team}.',
      'The duplicate-identity setting makes the impossible lineup intentional.',
      '{team}\'s Sandbox huddle has {copies} copies of the same answer.',
    ],
    'experiment.no_three_point_points': [
      '{player}\'s long-range make counts for two under {league}\'s custom rules.',
      'The shot is still long. Its scoreboard reward is now two.',
      '{team}\'s official score follows the no-three-point setting.',
    ],
    'experiment.no_foul_limit': [
      '{player} stays in after {fouls} fouls under the custom limit setting.',
      'The Sandbox eligibility rule keeps him available to {team}.',
      'The foul total climbs while the declared exemption preserves his place.',
    ],
    'experiment.user_rating_edit_first_game': [
      '{player} completes his first game after the declared {rating} edit.',
      'The custom adjustment reaches an actual simulated appearance.',
      '{team}\'s game record now has a clear before-and-after boundary.',
    ],
    'legal.trial_opened': [
      '{player}\'s trial opens in {jurisdiction}.',
      'The court begins hearing the charged case, with guilt undecided.',
      'Evidence will be tested at {player}\'s formal trial.',
    ],
    'legal.charges_dismissed': [
      '{player}\'s {case} charges are dismissed.',
      'The case ends on {grounds}; the ruling\'s stated limits still matter.',
      'The pending charges are no longer active against {player}.',
    ],
    'legal.acquitted': [
      '{player} is acquitted in {case}.',
      'The court returns a not-guilty verdict after the trial.',
      '{player}\'s charged case ends in acquittal.',
    ],
    'legal.convicted': [
      'Court finds {player} guilty of {offense}.',
      'The verdict is entered; sentencing remains a separate stage.',
      '{player}\'s case reaches a conviction on the recorded offense.',
    ],
    'legal.mixed_verdict': [
      '{player}\'s trial ends with a mixed verdict.',
      'The court convicts on {guiltycounts} and acquits on {clearedcounts}.',
      'Each count has its own outcome in {player}\'s final verdict.',
    ],
    'legal.plea_accepted': [
      'Court accepts {player}\'s guilty plea to {offense}.',
      'The accepted plea resolves the admitted count.',
      '{player}\'s sentencing will follow the court\'s actual order.',
    ],
    'legal.mistrial_declared': [
      'Court declares a mistrial in {player}\'s case.',
      'The trial ends without a verdict; {retrialstatus}.',
      'Neither conviction nor acquittal follows this interrupted proceeding.',
    ],
    'legal.conviction_appeal_filed': [
      '{player} files an appeal against his conviction.',
      'The appeal is registered; it has not reversed the verdict.',
      'The existing judgment faces review through the permitted court process.',
    ],
    'legal.conviction_overturned': [
      'Appeal court overturns {player}\'s conviction.',
      'The judgment is vacated; {nextstep}.',
      '{player}\'s legal status changes under the appellate ruling.',
    ],
    'legal.conviction_upheld': [
      'Appeal court upholds {player}\'s conviction for {offense}.',
      'The reviewed judgment remains in force.',
      'This appeal ends without changing the recorded conviction.',
    ],
    'civil.agent_commission_suit': [
      '{player} files a civil claim over {amount} in disputed commission.',
      'The agent-fee disagreement enters court with liability undecided.',
      'The filed claim asks the court to interpret the signed commission terms.',
    ],
    'civil.contract_breach_judgment': [
      'Court finds {team} breached {player}\'s contract.',
      'The judgment awards {remedy} under the proved contractual claim.',
      '{player} receives a civil ruling on the club\'s recorded obligations.',
    ],
    'civil.wrongful_termination_claim': [
      '{player} challenges his contract termination through {tribunal}.',
      'The filed claim alleges unlawful dismissal; the issue is unresolved.',
      '{team} receive formal notice of {player}\'s employment challenge.',
    ],
    'civil.business_partner_settlement': [
      '{player} and {partner} settle their {business} dispute.',
      'The signed agreement resolves the civil case on its recorded terms.',
      'The partnership conflict ends with a negotiated settlement.',
    ],
    'civil.defamation_judgment': [
      'Court rules {publication}\'s statement about {player} defamatory.',
      'The judgment awards {remedy} under the applicable law.',
      'The challenged statement receives a civil finding, not merely a disagreement.',
    ],
    'civil.image_rights_injunction': [
      'Court halts the unauthorized commercial use of {player}\'s image.',
      'The injunction applies to {use}, as specified in the order.',
      '{player}\'s image-rights claim produces a binding restriction.',
    ],
    'civil.tenancy_deposit_ruling': [
      '{tribunal} resolve {player}\'s rental-deposit dispute.',
      'The housing ruling orders {outcome} for the recorded deposit.',
      '{player}\'s tenancy case ends with a defined financial decision.',
    ],
    'civil.custody_schedule_order': [
      '{player}\'s availability adjusts to a court-approved parenting schedule.',
      'The announced basketball dates follow the family court\'s order.',
      '{team} receive scheduling facts while the child\'s details stay private.',
    ],
    'civil.support_obligation_modified': [
      'Court modifies {player}\'s support obligation under the new order.',
      'The financial duty changes through the legal review process.',
      'The revised obligation replaces the previous court-approved terms.',
    ],
    'civil.inheritance_dispute_resolved': [
      '{player}\'s inheritance dispute reaches a probate ruling.',
      'The court orders {outcome} for the contested estate issue.',
      'The recorded dispute ends with a lawful distribution decision.',
    ],
    'legal.sentence_entered': [
      'Court sentences {player} to {sentence} for {offense}.',
      'The entered order defines the consequence of the conviction.',
      '{player}\'s legal case moves from verdict to the recorded sentence.',
    ],
    'legal.community_service_complete': [
      '{player} completes the ordered {hours} hours of community service.',
      'The supervising body certifies the work requirement is satisfied.',
      'A documented sentence obligation is complete; other duties remain separately tracked.',
    ],
    'legal.restitution_paid': [
      '{player} pays the ordered {amount} in restitution.',
      'The confirmed payment settles that compensation obligation.',
      'The restitution ledger closes after receipt of the full amount.',
    ],
    'legal.probation_completed': [
      '{player} completes probation under the court\'s discharge order.',
      'The supervising authority confirms the required term is finished.',
      'That legal supervision ends with the formal completion decision.',
    ],
    'legal.diversion_completed': [
      '{player} completes the court-approved diversion program.',
      'The recorded disposition is {disposition}, as confirmed by the authority.',
      'Program completion changes the case only to the extent stated in the order.',
    ],
    'legal.records_sealed': [
      '{player}\'s eligible legal records are sealed.',
      'The authority grants the application under {jurisdiction}\'s rules.',
      'Access to the specified records changes under the formal order.',
    ],
    'legal.asset_freeze_lifted': [
      'Court lifts the freeze on {player}\'s specified assets.',
      'The new order restores control of the identified accounts.',
      '{player}\'s financial access changes after the freeze is removed.',
    ],
    'legal.court_date_game_leave': [
      '{player} receives leave for a required court appearance.',
      'The legal attendance order conflicts with {team}\'s game.',
      'A mandatory hearing changes availability without deciding the case.',
    ],
    'legal.civil_damages_recovered': [
      '{player} collects the awarded {amount} in civil damages.',
      'The judgment becomes an actual recovered payment.',
      'The civil remedy reaches {player}\'s account after enforcement.',
    ],
    'legal.league_clearance_after_case': [
      '{league} restore {player}\'s sporting eligibility.',
      'The league\'s separate review ends with explicit clearance.',
      '{team} can register {player} under the confirmed eligibility decision.',
    ],
    'integrity.whistleblower_protected': [
      '{league} grant protection to an accepted whistleblower.',
      'The report enters the process under the published safeguard policy.',
      'Retaliation protections attach to the accepted integrity submission.',
    ],
    'integrity.audit_no_violation': [
      'Independent audit finds no violation in {team}\'s reviewed transactions.',
      'The published conclusion clears the defined audit scope.',
      'The review reaches a clean finding without claiming every club action was examined.',
    ],
    'integrity.evidence_fabrication_exposed': [
      'Review removes fabricated evidence from {team}\'s integrity case.',
      'The specified material is invalidated after verification.',
      'The case must proceed without the evidence the review finds false.',
    ],
    'integrity.sanction_appeal_reduced': [
      'Appeals panel reduce {team}\'s sanction to {penalty}.',
      'The original punishment changes under the formal review decision.',
      '{team} remain subject to the revised sanction, as ordered.',
    ],
    'integrity.remediation_certified': [
      '{team} complete their ordered roster remediation.',
      'The league certifies the corrected registrations.',
      'The club closes the published compliance task after verification.',
    ],
    'integrity.union_arbitration_win': [
      'Arbitrator rules {remedy} breached the collective agreement.',
      'The binding labor decision orders {correction}.',
      'The union\'s challenge produces a verified contractual ruling.',
    ],
    'integrity.custom_records_separated': [
      '{league} separate the custom-mode record book.',
      'The new settings place future milestones in the declared custom registry.',
      '{team}\'s next milestone gets a custom-rules label attached to its place in history.',
    ],
    'integrity.emergency_powers_expire': [
      '{league}\'s emergency powers expire on {date}.',
      'The temporary authority ends under its original sunset terms.',
      'Decisions return to the ordinary governance process after the deadline.',
    ],
    'integrity.owner_recusal': [
      '{owner} is recused from the vote concerning {team}.',
      'The conflict policy removes the owner from this decision.',
      'The remaining eligible panel members determine the matter.',
    ],
    'integrity.sandbox_reenabled_review': [
      '{league} resume integrity checks for future actions.',
      'The chosen policy tags prior Sandbox edits as exempt.',
      '{team}\'s next changes face the reenabled review framework.',
    ],
    'hobby.marathon_finish': [
      '{player} completes the marathon in {time}.',
      'The sanctioned run adds a verified finish to his offseason.',
      '{team}\'s agreed recovery plan follows the completed race.',
    ],
    'hobby.mountain_trip_safe': [
      '{player} completes the approved mountain trip on schedule.',
      'The planned adventure ends on schedule before {team}\'s return date.',
      'The trip delivers its intended experience without a recorded disruption.',
    ],
    'hobby.risky_trip_contract_breach': [
      '{team} find {player}\'s trip breached his signed activity restriction.',
      'The contractual issue concerns {activity}, not an assumed injury.',
      'The club\'s documented finding triggers {consequence} under the agreement.',
    ],
    'hobby.chess_tournament_win': [
      '{player} wins {tournament} away from the basketball court.',
      'The completed bracket gives him a second kind of victory.',
      '{player} wins without a dribble: the chess bracket is his.',
    ],
    'hobby.garden_harvest': [
      '{player}\'s garden project delivers {amount} of harvested produce.',
      'The growing season ends with a verified community delivery.',
      'The offseason work grows into a real harvest for the neighborhood.',
    ],
    'hobby.pilot_license': [
      '{player} earns {license} after certified flight training.',
      'The aviation authority confirms the new qualification.',
      'Another completed course gives {player} a lawful new skill.',
    ],
    'hobby.language_event_host': [
      '{player} hosts {event} in {language}.',
      'The studied language becomes part of a completed public appearance.',
      'Supporters hear {player}\'s prepared event in another language.',
    ],
    'hobby.invention_patent_granted': [
      '{player} receives a patent for {invention}.',
      'The granted application gives the idea formal legal protection.',
      'A patent is recorded; a profitable product remains a separate goal.',
    ],
    'hobby.amateur_cooking_final': [
      '{player} reaches the final of {competition}.',
      'The offseason kitchen produces a verified competitive result.',
      'His next challenge comes with a recipe instead of a playbook.',
    ],
    'hobby.long_distance_cycle': [
      '{player} completes the approved {distance} cycling route.',
      'The measured ride reaches its planned finish.',
      '{team}\'s offseason agreement accommodates the completed cycling challenge.',
    ],
    'labor.salary_grievance_filed': [
      'Union files a salary grievance for {player}.',
      'The recorded unpaid balance of {amount} enters the contractual process.',
      '{team} receive the formal wage complaint.',
    ],
    'labor.salary_arbitration_award': [
      'Arbitrator orders {team} to pay {player} {amount}.',
      'The wage dispute ends in an enforceable salary award.',
      'The recorded debt receives a binding labor decision.',
    ],
    'labor.grievance_rejected': [
      'Arbitrator rejects {player}\'s {grievance} claim.',
      'The ruling resolves this dispute under the agreement\'s terms.',
      '{team} receive a decision on the specific filed grievance.',
    ],
    'labor.collective_salary_deferral': [
      '{team} and their players approve a salary-deferral agreement.',
      'The signed terms delay payment under {repaymentterms}.',
      'The club\'s cash plan receives negotiated consent rather than unilateral delay.',
    ],
    'labor.contract_opt_out': [
      '{player} exercises his opt-out from {team}\'s contract.',
      'The filed notice activates the option already in the agreement.',
      'The remaining term ends through a permitted contractual choice.',
    ],
    'labor.no_trade_clause_enforced': [
      '{player} invokes his no-trade clause to block the proposed move.',
      'The contract gives him consent rights, and he uses them.',
      '{team}\'s deal with {opp} cannot proceed without the required approval.',
    ],
    'labor.no_trade_clause_waived': [
      '{player} waives his no-trade protection for the move to {team}.',
      'The recorded consent clears the contractual barrier.',
      'He chooses this destination under the rights in his agreement.',
    ],
    'labor.union_election': [
      '{player} wins election as {role} in the union.',
      'The certified membership vote gives him a representative mandate.',
      'His colleagues choose {player} for the documented labor role.',
    ],
    'labor.roster_status_arbitration': [
      'Arbitrator places {player} in {status} under the agreement.',
      'The disputed roster classification receives a binding correction.',
      '{team} must apply the status specified in the labor ruling.',
    ],
    'labor.contract_translation_verified': [
      '{player} receives a certified {language} contract translation.',
      'The proposed terms become readable before the signature decision.',
      'The verified translation supports an informed choice rather than a completed signing.',
    ],
    'home.pet_adoption': [
      '{player} welcomes an adopted {animal} at home.',
      'The completed adoption adds a care responsibility to his routine.',
      '{team}\'s travel schedule now shares space with the pet-care plan.',
    ],
    'home.pet_care_travel_plan': [
      '{player} confirms pet care before {team}\'s road trip.',
      'The roster leave town; {player}\'s pet keeps a dependable home routine.',
      'An arranged care plan clears one practical worry from the departure list.',
    ],
    'home.pet_rescue_verified': [
      '{player}\'s missing {animal} returns safely with qualified help.',
      'The confirmed recovery ends the search at home.',
      'A practical rescue gives the household its companion back.',
    ],
    'home.home_access_renovation': [
      '{player}\'s home access renovation passes inspection.',
      'The completed work supports the household\'s requested access needs.',
      'A practical change makes the home easier to use.',
    ],
    'home.utility_outage_relocation': [
      '{player}\'s household relocate during the utility outage.',
      'The verified loss of service changes the home routine.',
      'Temporary accommodation covers the gap while repairs continue.',
    ],
    'home.neighbor_mediation': [
      '{player} settles the neighbor dispute through mediation.',
      'The signed agreement gives the household a workable local arrangement.',
      'A recorded disagreement ends with mutually accepted terms.',
    ],
    'home.first_budget_balanced': [
      '{player} completes a year inside his household budget.',
      'The verified ledger matches the plan he chose.',
      'Twelve months of recorded spending reach the agreed target.',
    ],
    'home.cooking_for_teammates': [
      '{player} hosts {team}\'s agreed meal at home.',
      '{player} invites the roster over for a different kind of team possession: dinner.',
      'The meal happens; its basketball effect is another question.',
    ],
    'home.house_repair_completed': [
      '{player}\'s {repair} passes the final inspection.',
      'The certified work closes the documented household problem.',
      'The home repair is complete after the qualified crew\'s visit.',
    ],
    'home.name_change_registered': [
      '{league} update {player}\'s official registration after his name change.',
      'The legal record and the basketball record now match.',
      'His existing career totals remain linked to the updated identity.',
    ],
    'challenge.perfect_projection': [
      '{team}\'s challenge build projects to {record}.',
      'The model predicts an unbeaten run; the games have not been played.',
      '{team}\'s build reaches the predicted perfect record. Now comes the question of actual games.',
    ],
    'challenge.projection_actual_gap': [
      '{team}\'s actual {record} finish differs from the {projection} projection.',
      'The played season tests the challenge model and finds a gap.',
      'Prediction and outcome now sit beside each other for {team}.',
    ],
    'challenge.last_slot_mismatch': [
      '{player} cannot fill {team}\'s final locked {role} slot.',
      'The last selection meets an eligibility wall in the challenge rules.',
      '{player} is available. The last legal roster slot is not available to him.',
    ],
    'challenge.skip_used_success': [
      '{team}\'s reroll improves their model score to {score}.',
      'The allowed skip pays off in the published evaluation.',
      'A new draw gives the challenge roster a measured improvement.',
    ],
    'challenge.hidden_stats_reveal': [
      'The challenge reveals {player}\'s hidden {rating} rating.',
      'The choice is already locked when the hidden number finally appears.',
      '{team}\'s draft is locked before the concealed number appears.',
    ],
    'challenge.snake_turn_value': [
      '{team}\'s turn picks receive a combined {grade} grade.',
      'The back-to-back selections complete the planned draft pair.',
      'The evaluator assesses the pair together after the snake turn.',
    ],
    'challenge.custom_pool_empty': [
      '{team}\'s custom filters leave no eligible draft candidates.',
      'The custom draft has a shortlist with nobody on it.',
      'The declared pool needs a revised filter before selection can continue.',
    ],
    'challenge.generated_only_first_season': [
      '{league}\'s generated-only roster era begins with an official game.',
      'Every registered player comes from the save\'s declared fictional pool.',
      '{team} help open the new competition\'s independent history.',
    ],
    'challenge.redistribution_draft': [
      '{league} open the agreed roster-redistribution draft.',
      'The approved custom agreement resets team allocation through a defined process.',
      '{team} build again under the ratified redistribution rules.',
    ],
    'challenge.era_adjustment_recalculated': [
      '{league} recalculate draft ratings under {model}.',
      'The raw historical numbers remain intact while the adjustment changes.',
      'The era model changes how {team} read the draft board; the original statistics stay intact.',
    ],
    'emergency.aircraft_incident_reported': [
      'Responders confirm an aircraft incident involving {team}\'s travel flight.',
      'Passenger outcomes remain unconfirmed while the emergency response begins.',
      '{team}\'s simulation pauses for verified information about the flight incident.',
    ],
    'emergency.aircraft_safe_evacuation': [
      'Every person on {team}\'s flight manifest is confirmed alive.',
      'Responders account for the entire travel group after evacuation.',
      'The passenger status is verified; medical updates remain separate.',
    ],
    'emergency.aircraft_injured_survivors': [
      'Responders confirm {survivors} injured survivors from {team}\'s flight.',
      'The medical teams treat the verified survivors while other updates remain separate.',
      '{team} release only the confirmed survivor information authorized for publication.',
    ],
    'emergency.aircraft_missing_people': [
      '{missing} people from {team}\'s flight remain unaccounted for.',
      'The search continues; missing status is not a death confirmation.',
      'Incident command report unresolved passenger whereabouts for the travel group.',
    ],
    'emergency.aircraft_fatalities_confirmed': [
      'Authorities confirm {fatalities} deaths from {team}\'s flight after family notification.',
      'The verified loss is announced with the families\' privacy respected.',
      'Basketball operations pause as {team} respond to the confirmed deaths.',
    ],
    'emergency.aircraft_traveling_roster_lost': [
      'Authorities confirm the deaths of all {travelers} rostered players on {team}\'s flight.',
      'The confirmed loss concerns the traveling roster; everyone outside the manifest is excluded.',
      'After private family notification, {team} announce the verified loss of their traveling players.',
    ],
    'emergency.aircraft_no_team_on_board': [
      'Officials confirm no {team} passengers were aboard the reported aircraft.',
      'The verified manifest corrects the earlier team association.',
      '{team}\'s travel group is not part of the confirmed passenger list.',
    ],
    'emergency.bus_collision_response': [
      'Emergency services respond to {team}\'s confirmed bus collision.',
      'Injury information remains unverified as responders secure the scene.',
      'The travel plan stops while authorities handle the bus emergency.',
    ],
    'emergency.rail_evacuation': [
      '{team}\'s rail travelers are accounted for after evacuation.',
      'The rail authority confirms the team group is alive and off the train.',
      'The journey pauses after the verified emergency evacuation.',
    ],
    'emergency.ferry_rescue': [
      'Maritime responders rescue {team}\'s entire registered travel group alive.',
      'The passenger check accounts for every team traveler.',
      'Medical assessments follow separately after the confirmed rescue.',
    ],
    'emergency.arena_evacuation_fire': [
      'Fire authorities order the evacuation of {arena}.',
      '{team}\'s game stops while the verified emergency is addressed.',
      'Spectators and staff follow the official evacuation order.',
    ],
    'emergency.arena_structural_closure': [
      'Authorities close {arena} after an urgent structural finding.',
      'The inspection removes the venue from use until it is cleared.',
      '{team}\'s home schedule pauses for the confirmed building hazard.',
    ],
    'emergency.earthquake_venue_check': [
      '{arena} suspend access after the earthquake.',
      'Inspectors must clear the venue before {team}\'s schedule resumes.',
      'The precaution follows the verified tremor, not an assumed damage finding.',
    ],
    'emergency.flood_training_center': [
      'Flooding closes {team}\'s training center under the official order.',
      'The facility is inaccessible while the emergency restriction remains.',
      '{coach}\'s sessions stop at the affected site.',
    ],
    'emergency.wildfire_city_departure': [
      '{team} follow the mandatory wildfire evacuation order.',
      'The basketball schedule yields to the city\'s verified emergency directive.',
      'The club relocate under the authorities\' approved departure plan.',
    ],
    'emergency.hurricane_shelter_order': [
      '{team}\'s game is suspended under the hurricane shelter directive.',
      'The official order keeps the event from proceeding at {arena}.',
      'The league wait for the local safety authority\'s clearance.',
    ],
    'emergency.public_health_venue_closure': [
      'Health authorities close {arena} during the declared emergency.',
      'The venue order suspends public games without identifying any player diagnosis.',
      '{team}\'s schedule follows the formal public-health restriction.',
    ],
    'emergency.crowd_compression_response': [
      'Safety officials halt {arena}\'s event after a crowd emergency.',
      'Entry stops while qualified responders assist the affected area.',
      '{team}\'s game pauses under the official safety command.',
    ],
    'emergency.power_grid_shutdown': [
      'A confirmed grid emergency ends the event at {arena}.',
      'Venue safety staff abandon {team}\'s game under the emergency procedure.',
      'The official grid notice leaves the arena unable to operate safely.',
    ],
    'emergency.verified_threat_venue_shutdown': [
      'Authorities close {arena} after assessing a credible threat.',
      '{team}\'s event stops under the official safety order.',
      'The shutdown addresses the verified risk while other claims remain unconfirmed.',
    ],
    'emergency.simulation_hard_stop': [
      '{team}\'s simulation stops for the unresolved emergency.',
      'The incident record requires a decision before the calendar advances.',
      'Routine basketball updates pause until the verified emergency is addressed.',
    ],
    'emergency.family_liaison_activated': [
      '{team} activate private family-liaison support.',
      'The care process begins with direct communication to affected households.',
      'Public updates wait for the required private notifications.',
    ],
    'emergency.game_block_postponed': [
      'League postpones {team}\'s next {games} games.',
      'The emergency response receives a formally cleared window.',
      'The fixture block pauses rather than advancing through the crisis.',
    ],
    'emergency.emergency_roster_draft': [
      '{league} approve an emergency allocation draft for {team}.',
      'The exceptional roster process follows agreed player protections.',
      '{team}\'s rebuilding route begins under the published emergency framework.',
    ],
    'emergency.affected_season_withdrawal': [
      '{team} receive approval to withdraw from the rest of {season}.',
      'The league formally suspend the club\'s remaining fixtures.',
      'The decision gives the affected organization time beyond the current schedule.',
    ],
    'emergency.franchise_continuity_vote': [
      'The certified continuity decision for {team} is {decision}.',
      'The club\'s future receives a formal ruling after the emergency.',
      'The verified governance process settles the next organizational step.',
    ],
    'emergency.memorial_authorized': [
      '{team} announce the family-approved memorial at {venue}.',
      'The remembrance follows the affected families\' stated wishes.',
      'Supporters receive the confirmed plan for a respectful public tribute.',
    ],
    'emergency.survivor_return_plan': [
      '{player} agrees a medically cleared phased return with {team}.',
      'The plan proceeds at the pace established with qualified care staff.',
      'A return timetable is agreed without promising an immediate appearance.',
    ],
    'emergency.first_game_after_loss': [
      '{team} complete their first game under the approved return plan.',
      'The appearance marks a basketball step after the confirmed loss.',
      'The schedule resumes with the remembrance wishes respected.',
    ],
    'emergency.independent_safety_report': [
      'The final safety report identifies {finding} in the {team} incident.',
      'The published review establishes its stated findings without expanding beyond them.',
      '{team} receive the independent report\'s verified recommendations.',
    ],
    'surprise.license_helps_stranded_team': [
      '{player}\'s {qualification} suddenly helps {team} off the court.',
      'The offseason course pays off in a place nobody put on the schedule.',
      'The backup plan turns out to be sitting in the team seats.',
    ],
    'surprise.old_school_opponent_revealed': [
      '{player} and {opponent} discover a shared school-team chapter.',
      'Tonight\'s opponents once wore the same colors. The old roster has receipts.',
      'A school photograph changes the introduction to this matchup.',
    ],
    'surprise.former_mentor_referee': [
      '{player}\'s old mentor returns with the whistle.',
      'The reunion comes with an official assignment and a competition-cleared connection.',
      'Familiar face, different job: {player} meets {referee} at midcourt.',
    ],
    'surprise.garden_supplies_team': [
      '{player}\'s garden makes it onto {team}\'s dinner table.',
      'He grows the ingredients, then watches the entire roster eat the results.',
      'The garden project gets its first team catering call-up.',
    ],
    'surprise.music_becomes_anthem': [
      '{team} choose {player}\'s music for their arena entrance.',
      'He hears his own song before his name is announced. That is a different kind of home advantage.',
      'The side project becomes the sound of {arena}\'s introductions.',
    ],
    'surprise.invention_team_adoption': [
      '{team} put {player}\'s invention to work.',
      'The prototype leaves the workbench and joins the staff routine.',
      'His side project now has a basketball employer.',
    ],
    'surprise.translation_saves_registration': [
      '{player}\'s language training helps rescue {team}\'s registration deadline.',
      'One translated detail keeps the paperwork from becoming a roster problem.',
      'The useful offseason skill turns out to be nowhere in the box score.',
    ],
    'surprise.opponent_pays_travel_rescue': [
      '{opp} help {team} reach the game they are about to contest.',
      'First they fund the journey. Then they try to win the matchup.',
      'The opponent becomes the reason there is an opponent on the court.',
    ],
    'surprise.community_funds_club_survival': [
      '{city}\'s fundraising keeps {team} operating.',
      'The crowd pay toward a club they refuse to lose. The audited target is met.',
      'A thousand small contributions solve the bill one owner could not cover.',
    ],
    'surprise.tryout_scout_from_hobby': [
      '{player}\'s {hobby} outing leads to a basketball tryout.',
      'He arrives for one activity and leaves with a completely different opportunity.',
      'The chance meeting opens a door; the court assessment earns the invitation.',
    ],
    'surprise.same_name_registration': [
      '{league} untangle two different players named {player}.',
      'Same name, separate careers: the registration desk finally gives each his own file.',
      'The paperwork finds its double. Neither player loses his place.',
    ],
    'surprise.trophy_shipping_wrong_city': [
      '{trophy} take a detour to {wrongcity}.',
      'The winners know where they are. The shipping label needs help.',
      'The celebration waits for an award with a surprisingly adventurous itinerary.',
    ],
    'surprise.uniform_colors_identical': [
      '{team} and {opp} arrive dressed for the same side.',
      'The colors clash by refusing to clash. A legal replacement saves the introductions.',
      'Before anyone can defend an opponent, someone has to identify one.',
    ],
    'surprise.practice_ball_signed_artifact': [
      '{team}\'s practice ball turns out to belong in the archives.',
      'Nobody takes another bounce after the authentication comes back.',
      'A routine donation delivers history with the air still in it.',
    ],
    'surprise.delayed_letter_tryout': [
      'A late letter gives {player} a second date with {team}.',
      'The delivery misses the tryout; the club make room for the person.',
      'The invitation survives its own travel delay.',
    ],
    'surprise.fan_returns_lost_contract': [
      'A supporter returns {team}\'s lost contract folder unopened.',
      'The biggest assist of the morning comes from outside the roster.',
      'The folder makes it home with its contents still private.',
    ],
    'surprise.arena_cat_pauses_warmup': [
      '{arena}\'s warmup gets an unexpected {animal} visitor.',
      'The smallest arrival owns the court until the handlers finish their job.',
      'Both teams wait while a four-legged guest receives the escort.',
    ],
    'surprise.calendar_double_celebration': [
      '{player}\'s {milestone} lands on {team}\'s founding anniversary.',
      'Two reasons for one celebration, and the history office confirms the date.',
      'The calendar delivers a coincidence the presentation staff could not script.',
    ],
    'surprise.custom_tactic_opponent_copy': [
      '{opp} borrow the legal experiment first used by {team}.',
      'The strange idea has a second customer. {coach} openly credits the source.',
      'Yesterday\'s eyebrow-raiser becomes somebody else\'s scouting problem.',
    ],
    'surprise.rookie_owns_old_ticket': [
      '{player} joins {team} with an old ticket to his new home.',
      'He once came through the gate as a spectator. Now the pass gets him onto the court.',
      'The saved ticket gives his arrival a story no contract clause can supply.',
    ],
    'skill.finish_inside_hand': [
      '{player} hides the finish from {defender} with the inside hand.',
      'The defender\'s shoulder position explains {player}\'s release choice.',
      '{defender} gets the view; {player} gets the basket.',
    ],
    'skill.finish_reverse_shield': [
      '{player} puts the rim between his shot and {defender}.',
      'The reverse changes the contest geometry for {player}.',
      '{defender} arrives at the wrong side of the basket.',
    ],
    'skill.finish_wrong_foot': [
      '{player} scores before {defender}\'s expected takeoff cue.',
      'Wrong-foot timing changes the release window rather than the shot location.',
      '{defender}\'s timing chart needs an eraser.',
    ],
    'skill.finish_floater_drop': [
      '{player}\'s floater clears the gap in {opp}\'s drop coverage.',
      'The early release keeps {player} outside the tracked rim contest.',
      '{opp} protect the rim; {player} takes the space in front of it.',
    ],
    'skill.finish_contact_declined': [
      '{player} changes the finish before meeting {defender}.',
      'The decision removes a tracked collision risk and creates a pull-up.',
      '{player} reads the obstacle and chooses another road.',
    ],
    'skill.shot_bank_angle': [
      '{player} uses the glass from his practiced angle.',
      'The bank selection follows the stored geometry band for {player}.',
      'The backboard finally gets a meaningful role in the plan.',
    ],
    'skill.shot_stepthrough_patience': [
      '{player} waits out {defender} and scores the step-through.',
      'Legal pivot control turns the airborne contest into a finishing window.',
      '{defender} takes the flight; {player} takes the basket.',
    ],
    'skill.shot_turnaround_blindside': [
      '{player} turns away from {opp}\'s help and scores.',
      'The turnaround direction avoids the logged second-defender lane.',
      '{opp}\'s help gets a very good view of the wrong shoulder.',
    ],
    'skill.shot_escape_sideways': [
      '{player} steps sideways out of {defender}\'s closeout.',
      'The escape changes lateral separation rather than merely increasing distance.',
      '{defender} closes the front door; {player} finds the side entrance.',
    ],
    'skill.shot_foot_on_arc_awareness': [
      '{player} moves his foot clear of the arc before scoring.',
      'The relocation changes the shot\'s value under the current court markings.',
      '{player} checks the address before mailing the shot.',
    ],
    'skill.shot_deep_range_declined': [
      '{player} passes on the distant attempt and finds his range.',
      'The selection follows {player}\'s measured accuracy map.',
      'A little restraint gives the basket a better proposal.',
    ],
    'skill.finish_alleyoop_abort': [
      '{player} brings the lob down before finishing.',
      'The decision trades aerial spectacle for a controlled legal gather.',
      'The highlight waited; the basket did not mind.',
    ],
    'skill.shot_double_clutch_blocked': [
      '{defender} recovers while {player} adds the extra clutch.',
      'The delayed release gives the contest time to return.',
      'One extra adjustment sends the shot into {defender}\'s appointment book.',
    ],
    'skill.shot_fake_into_crowd': [
      '{player}\'s first fake works; the next lane does not.',
      'Beating one contest still leaves the logged help traffic.',
      '{defender} buys the fake. {opp}\'s help refuse the rest of the sale.',
    ],
    'skill.shot_contest_reclassification': [
      '{player}\'s crowded-looking make comes outside the contest cone.',
      'Appearance and effective defensive reach differ on this attempt.',
      '{defender} appears in the picture without touching the shooting window.',
    ],
    'skill.pass_pocket_gap': [
      '{player} finds {teammate} through the pocket.',
      'The bounce path clears the gap between both defenders.',
      '{opp} close the big doors and forget the small one.',
    ],
    'skill.pass_shortroll_release': [
      '{player} gives {teammate} the short-roll decision.',
      'The pass moves the ball out of the double-team and into the advantage.',
      '{opp} send two; {team} make the remaining space count.',
    ],
    'skill.pass_lookaway_interception': [
      '{defender} ignores {player}\'s eyes and takes the pass.',
      'Body orientation overrules the false visual cue.',
      '{player}\'s no-look pass gets a very attentive reader.',
    ],
    'skill.pass_onehand_velocity': [
      '{player}\'s one-hand delivery beats the help rotation.',
      'Release speed, not just pass distance, creates the window for {teammate}.',
      '{opp}\'s help arrive after the mail.',
    ],
    'skill.pass_skip_airtime_trap': [
      '{opp} turn {player}\'s skip pass into a trap.',
      'The ball\'s airtime gives the weak-side rotation its opportunity.',
      'The pass travels across the court and delivers a problem.',
    ],
    'skill.pass_touch_redirect': [
      '{player}\'s touch pass keeps the advantage moving.',
      'The redirection removes a gather delay from {team}\'s sequence.',
      'The ball visits {player} without unpacking.',
    ],
    'skill.pass_live_dribble_weakhand': [
      '{player} finds {teammate} straight from the weak-hand dribble.',
      'The live-dribble release preserves a window a full gather would close.',
      '{opp} wait for the pickup; the pass has already left.',
    ],
    'skill.pass_behindback_wrong_target': [
      '{player}\'s behind-back pass finds the wrong traffic.',
      'The chosen release hides the ball from its intended receiver as well.',
      'The stylish route loses the delivery address.',
    ],
    'skill.pass_entry_angle_reset': [
      '{team} change the angle before finding {player} inside.',
      'The reversal removes the fronting defender\'s initial advantage.',
      '{opp} guard one doorway. {team} use another.',
    ],
    'skill.pass_handoff_denied': [
      '{player} keeps the ball when {opp} deny the handoff.',
      'The keeper option responds to the logged denial cue.',
      '{opp} cancel the handoff and accidentally order the drive.',
    ],
    'skill.pass_lob_ceiling': [
      '{player}\'s lob exceeds {teammate}\'s catch window.',
      'Target height matters as much as the passing lane.',
      'The idea reaches a higher floor than the receiver can.',
    ],
    'skill.pass_drag_cutter_delay': [
      '{player} waits for the trailing defender before releasing to {teammate}.',
      'The delay changes which body can obstruct the cutter\'s catch.',
      'This pass arrives late on purpose and right on time.',
    ],
    'skill.pass_outlet_receiver_scan': [
      '{player} looks beyond {opp}\'s outlet trap.',
      'The preturn scan changes the first receiver selection.',
      'The trap waits at the wrong delivery point.',
    ],
    'skill.pass_stationary_overload': [
      '{team} crowd the pass that {player} wants to make.',
      'Overlapping receiving lanes create a single defender\'s deflection opportunity.',
      'Too many delivery addresses end up in the same hallway.',
    ],
    'skill.pass_receiver_signal_mismatch': [
      '{player} and {teammate} read the same signal differently.',
      'The turnover comes from route interpretation rather than pass accuracy.',
      'The ball follows the plan. The receiver follows another plan.',
    ],
    'skill.dribble_split_hipgap': [
      '{player} splits the space between {opp}\'s defenders.',
      'The hip gap opens a route through the pressure.',
      'Two defenders become one very inconvenient doorway.',
    ],
    'skill.dribble_snake_screen': [
      '{player} snakes around the screen and keeps {defender} behind.',
      'The route changes the pursuit angle before the shot.',
      '{defender} gets a guided tour of {player}\'s back.',
    ],
    'skill.dribble_reject_screen': [
      '{player} rejects the screen and attacks the open side.',
      '{defender}\'s screen anticipation creates the alternative lane.',
      'The screen never needs to touch anyone to do its job.',
    ],
    'skill.dribble_retreat_reset': [
      '{player} backs out of the trap without surrendering the dribble.',
      'The retreat restores options rather than forcing a pass.',
      'Sometimes progress looks like taking two steps away from trouble.',
    ],
    'skill.dribble_change_pace': [
      '{player} changes pace and leaves {defender} chasing the wrong rhythm.',
      'Acceleration timing creates the gap, not maximum speed alone.',
      '{defender} keeps the beat; {player} changes the song.',
    ],
    'skill.dribble_high_bounce_pick': [
      '{defender} reaches {player}\'s high bounce.',
      'The exposed dribble height makes the ball accessible.',
      'The dribble gives {defender} a very generous invitation.',
    ],
    'skill.dribble_spin_trap': [
      '{player} spins past one problem into another.',
      'The secondary defender, not the initial contest, causes the turnover.',
      'The exit door opens directly into the waiting room.',
    ],
    'skill.dribble_crossover_ballshield': [
      '{player} keeps the crossover beyond {defender}\'s reach.',
      'Shielding changes ball exposure during the direction switch.',
      '{defender} reaches for a ball that has changed neighborhoods.',
    ],
    'skill.footwork_pivot_escape': [
      '{player}\'s reverse pivot reopens the pass.',
      'His pivot foot stays legal while the receiving angle changes.',
      '{opp} close the lane; {player} rotates the floor plan.',
    ],
    'skill.footwork_gather_mistimed': [
      '{player}\'s early gather turns the drive into a violation.',
      'The active step rule is applied to the recorded gather point.',
      'The feet keep their plan after the ball has changed the count.',
    ],
    'skill.dribble_chest_square_reset': [
      '{player} restores his balance and chooses the pass.',
      'The reset sacrifices the immediate shot to recover control.',
      'A smaller highlight produces a cleaner possession.',
    ],
    'skill.dribble_sideline_escape': [
      '{player} escapes inward before {opp} close the sideline trap.',
      'Boundary awareness preserves the remaining route.',
      'The sideline joins the defense, but {player} leaves before the meeting.',
    ],
    'skill.dribble_dead_ball_bait': [
      '{player} gives up the dribble and springs the planned pass.',
      'The dead-ball bait draws pressure into a prepared release.',
      '{opp} smell a trap and find they are standing inside it.',
    ],
    'skill.dribble_hesitation_no_carry': [
      '{player}\'s legal hesitation freezes {defender}.',
      'The ball-control log satisfies the current carry rule.',
      '{defender} pauses. The rulebook does not.',
    ],
    'skill.footwork_jumpstop_options': [
      '{player}\'s jump stop preserves the useful pivot.',
      'The active footwork rule leaves two options before the decision.',
      '{opp}\'s help choose a side; {player} chooses the other.',
    ],
    'tactics.screen_slip_early': [
      '{player} slips the switch before the screen lands.',
      'Early switching creates {teammate}\'s passing window.',
      '{opp} trade assignments on a screen that never arrives.',
    ],
    'tactics.screen_rescreen_flip': [
      '{player} flips the screen and opens the second route.',
      'The rescreen changes {defender}\'s recovery direction.',
      'The first door closes; the same screen builds another.',
    ],
    'tactics.screen_ghost_pop': [
      '{player} leaves the ghost screen for an open catch.',
      'Anticipation creates the separation without physical screening.',
      '{opp} prepare for contact and get a disappearing act.',
    ],
    'tactics.screen_ram_preparation': [
      '{team} clear the screener before running the main action.',
      'The preparatory screen delays {opp}\'s coverage position.',
      'Even the screen gets a screen on this possession.',
    ],
    'tactics.screen_brush_false_positive': [
      '{player} earns the separation without a credited screen.',
      'Nearby bodies do not establish a screening contribution.',
      '{teammate} appears in the picture; {player} does the escaping.',
    ],
    'tactics.cut_backdoor_overplay': [
      '{player} punishes {defender}\'s denial with a backdoor cut.',
      'The overplay opens the route behind the receiving lane.',
      '{defender} guards the invitation while {player} uses the entrance.',
    ],
    'tactics.cut_baseline_drift': [
      '{player} drifts into {teammate}\'s passing window.',
      'Baseline movement tracks the drive\'s changing angle.',
      '{opp} follow the ball and lose its destination.',
    ],
    'tactics.cut_lift_from_corner': [
      '{player} lifts out of the corner and finds the catch.',
      'The relocation avoids the help defender\'s baseline obstruction.',
      'The open address moves upstairs before the pass arrives.',
    ],
    'tactics.cut_two_players_same_gap': [
      '{team} send two cutters through one opening.',
      'Route overlap erases the available catch window.',
      'One good lane gets twice the traffic it can handle.',
    ],
    'tactics.screen_pin_in_help': [
      '{player} screens the help before {teammate} drives.',
      'The pin removes the planned second defender from the route.',
      'The rim help get an appointment somewhere else.',
    ],
    'tactics.screen_stagger_spacing': [
      '{player} clears both screens and makes the catch count.',
      'The separation comes from the sequence, not one isolated contact.',
      '{defender} gets directions that keep changing.',
    ],
    'tactics.screen_elevator_closed': [
      '{team} close the screen gap behind {player}.',
      'Timing preserves legality while removing the pursuit route.',
      '{defender} misses the elevator.',
    ],
    'tactics.spacing_dunker_eviction': [
      '{coach} clears the rim-side spot for {player}.',
      'Removing one teammate changes the driving corridor.',
      'The paint improves after somebody moves out.',
    ],
    'tactics.cut_screen_fake_relocate': [
      '{player} refuses the expected screen route.',
      '{defender}\'s shortcut creates the reverse-cut window.',
      'The defender skips a step and loses the destination.',
    ],
    'tactics.spacing_one_side_clear': [
      '{team} empty the side for {player}.',
      'The logged clear-out lengthens the available help route.',
      '{player} gets a little more room to conduct business.',
    ],
    'tactics.defense_toplock_escape': [
      '{team} pair the top lock with the waiting help.',
      'The denied route is covered by a planned second rotation.',
      '{opp} find the escape marked closed.',
    ],
    'tactics.defense_ice_sideline': [
      '{team} steer {player} away from the middle.',
      'Boundary-directed coverage controls the screen\'s preferred lane.',
      '{opp}\'s route planner loses the middle option.',
    ],
    'tactics.defense_show_recover': [
      '{player} shows at the screen and gets back in time.',
      'Pressure duration stays within the tracked recovery window.',
      'Two jobs, one defender, and no open appointment.',
    ],
    'tactics.defense_drop_depth_adjust': [
      '{coach} brings {player}\'s drop coverage forward.',
      'The new pickup depth changes the intermediate shooting window.',
      'The open space receives a defender\'s forwarding address.',
    ],
    'tactics.defense_peel_switch': [
      '{team} complete the peel switch behind the drive.',
      'The displaced defender fills the vacated assignment rather than chasing the ball.',
      'Losing the first matchup does not lose the whole possession.',
    ],
    'tactics.defense_scram_small_matchup': [
      '{team} move {player} out of the targeted mismatch.',
      'The off-ball exchange happens before the entry arrives.',
      '{opp} prepare the matchup and discover it has moved.',
    ],
    'tactics.defense_late_double_turnover': [
      '{team} wait for {player}\'s turn before sending help.',
      'The double arrives after the easy outlet leaves his view.',
      'The extra defender knocks when the exit is hardest to see.',
    ],
    'tactics.defense_stunt_no_commit': [
      '{player}\'s stunt interrupts the drive without abandoning his assignment.',
      'Brief help influences the ball while preserving recovery distance.',
      '{opp} mistake the visit for a permanent move.',
    ],
    'tactics.defense_nail_help_corner_cost': [
      '{opp} score where {team}\'s central help began.',
      'The drive stop transfers risk to the abandoned assignment.',
      'The paint gets help; the receiver gets a gift.',
    ],
    'tactics.defense_xout_closeouts': [
      '{team} complete the crossed recovery behind the help.',
      'The exchange shortens both closeout routes.',
      'Two defenders change addresses without losing the mail.',
    ],
    'tactics.defense_closeout_brake': [
      '{player} stops short and stays in front of {opponent}.',
      'Controlled arrival trades maximum speed for balanced containment.',
      'The pump fake asks for a flight; {player} stays grounded.',
    ],
    'tactics.defense_force_weakside': [
      '{player} sends {opponent} toward the scouted weaker side.',
      'The stop follows a documented direction choice.',
      'The scouting note finally gets to defend a possession.',
    ],
    'tactics.defense_switch_post_front': [
      '{player} survives the switch by denying the entry.',
      'Fronting prevents the mismatch from becoming a post touch.',
      '{opp} get the matchup but not the ball.',
    ],
    'tactics.defense_offball_ballwatch': [
      '{player} watches the ball while {opponent} leaves his assignment.',
      'The missed relocation comes before the open catch.',
      'The basketball gets an audience; the receiver gets space.',
    ],
    'tactics.defense_zone_matchup_handoff': [
      '{team} pass the cutter between assignments cleanly.',
      'The zone handoff preserves coverage through the route.',
      'The cutter changes neighborhoods without finding a vacancy.',
    ],
    'skill.rebound_hit_find': [
      '{player} handles the body before collecting the ball.',
      'The contact-first sequence preserves rebounding position.',
      '{opponent} lose the seat before the ball arrives.',
    ],
    'skill.rebound_early_flight_miss': [
      '{player}\'s early jump leaves the rebound for {opponent}.',
      'Peak reach occurs before the ball enters the window.',
      'The best height arrives at the wrong appointment time.',
    ],
    'skill.rebound_long_bounce_read': [
      '{player} reads the long bounce ahead of {opponent}.',
      'The rebound route follows the shot\'s projected exit angle.',
      'The ball changes postal districts; {player} is already there.',
    ],
    'skill.rebound_tip_to_teammate': [
      '{player} tips the ball safely to {teammate}.',
      'Controlled direction secures team possession without a personal catch.',
      'The rebound needs a delivery service, and {player} supplies it.',
    ],
    'skill.rebound_wedge_inside': [
      '{player} wins the inside position before the rebound.',
      'The route change precedes the ball\'s arrival.',
      '{opponent} lose the better address before the delivery.',
    ],
    'skill.rebound_chase_boundary_save': [
      '{player} saves the rebound to {teammate}.',
      'The target choice preserves team possession on the boundary rescue.',
      'A desperate save still finds a proper address.',
    ],
    'skill.rebound_crash_transition_cost': [
      '{team}\'s extra rebound chase leaves a transition lane open.',
      'The gamble has a logged floor-balance cost.',
      'One more person at the glass means one fewer on the road home.',
    ],
    'skill.rebound_retreat_forced_reset': [
      '{player} retreats early and closes the break.',
      'The decision sacrifices rebound opportunity for transition containment.',
      'No rebound credit, but the road home stays covered.',
    ],
    'skill.rebound_teammates_compete': [
      '{team} lose a rebound by both trying to own it.',
      'Missing communication converts an uncontested chance into a turnover of possession.',
      'One ball receives two claims and finds a third owner.',
    ],
    'skill.rebound_seal_for_other': [
      '{player} secures the position; {teammate} secures the rebound.',
      'The seal creates possession without claiming the statistic.',
      'The box score thanks one player for a two-player job.',
    ],
    'skill.transition_drag_screen': [
      '{team} screen before {opp} finish getting organized.',
      'Early screen timing exploits the unset coverage.',
      'The defense starts its meeting after the action has begun.',
    ],
    'skill.transition_crossmatch_hunt': [
      '{team} find the temporary mismatch for {player}.',
      'The entry beats {opp}\'s assignment recovery.',
      'The matchup window closes just after the ball goes through it.',
    ],
    'skill.transition_outlet_spinout': [
      '{player}\'s route changes after {teammate} releases the outlet.',
      'Release timing and receiver movement disagree.',
      'The pass has an old address and no forwarding notice.',
    ],
    'skill.transition_middle_lane_traffic': [
      '{team} crowd their own transition route.',
      'Three paths converge before the defense needs to stop them.',
      'The fast break runs into team traffic.',
    ],
    'skill.transition_numbers_declined': [
      '{player} cancels the break when the numbers disappear.',
      'The live count changes the decision before a forced attempt.',
      'The highlight invitation expires; the possession survives.',
    ],
    'tactics.coach_pace_override': [
      '{player} speeds past {coach}\'s tempo instruction.',
      'The possession departs from the stored plan before the shot.',
      'The playbook wants patience; the ball files a different itinerary.',
    ],
    'tactics.coach_matchup_hide': [
      '{coach} moves {player} away from the hunted matchup.',
      'The reassignment changes which defender the next attack targets.',
      'The weak link gets a new office before the callers arrive.',
    ],
    'tactics.coach_substitution_window_lost': [
      '{team} miss the legal window for {player}\'s entry.',
      'The requested change remains pending under the current substitution rule.',
      'The rotation has a plan; the scorer\'s table has a deadline.',
    ],
    'tactics.coach_foul_budget_shift': [
      '{coach} reduces {player}\'s contact budget.',
      'The active foul limit changes the defensive risk tolerance.',
      'The defender stays involved without inviting another whistle.',
    ],
    'tactics.coach_timeout_set_broken': [
      '{opp} deny the first option from {coach}\'s huddle.',
      '{team} use the recorded fallback rather than improvising blindly.',
      'The timeout drawing meets a defender with other plans.',
    ],
    'tactics.coach_offense_install_live': [
      '{team} execute {coach}\'s new set on the first attempt.',
      'The route log matches the fresh instruction.',
      'New handwriting, familiar teamwork.',
    ],
    'tactics.coach_language_shortcall': [
      '{coach}\'s short call puts {team} into the right action.',
      'The compressed signal fits the remaining setup window.',
      'A shorter sentence saves the possession a longer conversation.',
    ],
    'tactics.coach_player_veto_success': [
      '{player} uses the approved veto and finds the better matchup.',
      'The change stays within {coach}\'s delegated decision options.',
      'The playbook allows an edit, and the floor makes it count.',
    ],
    'tactics.coach_conflicting_signals': [
      '{team} receive two different play calls at once.',
      'Conflicting signals create a documented setup failure.',
      'The huddle has two authors and one confused floor.',
    ],
    'tactics.coach_rotation_pair_split': [
      '{coach}\'s split-pair trial changes {player}\'s creation output.',
      'The assessment compares the trial to its stored baseline.',
      'The partnership looks easier to replace on the rotation sheet.',
    ],
    'tactics.coach_emergency_ballhandler': [
      '{player} handles the emergency advance for {team}.',
      'The assignment follows the recorded loss of planned handlers.',
      'An unfamiliar job gets an unexpectedly steady first shift.',
    ],
    'tactics.coach_offball_energy_budget': [
      '{coach} trims {player}\'s off-ball workload.',
      'The new route plan preserves the required assignments with fewer sprints.',
      'Less running gets designed, not merely hoped for.',
    ],
    'tactics.coach_hot_hand_order_counter': [
      '{opp} deny {coach}\'s next action for {player}.',
      'Recent shooting changes both the offensive plan and defensive priority.',
      'The hot hand receives a very cold welcome at the catch.',
    ],
    'tactics.coach_playcall_disobey_team': [
      '{team} choose their own action over {coach}\'s call.',
      'The route log identifies deliberate team-level disobedience.',
      'The playbook gets outvoted on the floor.',
    ],
    'tactics.coach_decoy_star_role': [
      '{player}\'s decoy route opens the basket for {teammate}.',
      'Defensive attention moves where the play intended.',
      'The headline name does useful work without receiving the shot.',
    ],
    'tactics.scout_tendency_small_sample': [
      '{team} flag the report on {player} as provisional.',
      '{sample} observations do not clear the stored confidence threshold.',
      'The scouting file has a theory and a very small stack of receipts.',
    ],
    'tactics.scout_prediction_exploited': [
      '{team} turn {player}\'s scouted habit into a scoring chance.',
      'The bait and response match the stored prediction.',
      'The scouting note gets its own successful trap.',
    ],
    'tactics.scout_new_move_surprise': [
      '{player} adds a move the {team} scout did not contain.',
      'The preparation fails on a documented repertoire gap.',
      'The scouting folder needs another page.',
    ],
    'tactics.scout_film_age_cost': [
      '{team} defend an older version of {player}\'s game.',
      'The report predates the documented technique change.',
      'Yesterday\'s scouting address misses today\'s player.',
    ],
    'tactics.scout_false_hand_preference': [
      '{team} revise the drive-direction report on {player}.',
      'The validated sample reverses the earlier preference estimate.',
      'The arrow on the scouting page finally points the right way.',
    ],
    'tactics.scout_hidden_trigger_revealed': [
      '{team} identify the cue behind {player}\'s pass choice.',
      'The tendency depends on the help signal rather than a blanket habit.',
      'The scouting report discovers the switch behind the switch.',
    ],
    'tactics.scout_left_lane_bait_fail': [
      '{player} refuses {team}\'s offered lane.',
      'The opponent chooses the documented alternative rather than the predicted weakness.',
      'The trap has an invitation nobody accepts.',
    ],
    'tactics.scout_shared_play_recognition': [
      '{player} recognizes {opp}\'s set before the opening cue.',
      'His stored system experience supplies the early defensive call.',
      'Familiar homework turns up on the other team\'s desk.',
    ],
    'tactics.scout_masked_entry': [
      '{team} disguise a different action in a familiar opening.',
      'The first positions do not uniquely identify the play.',
      '{opp} recognize the cover and miss the new chapter.',
    ],
    'tactics.scout_coverage_frequency_shift': [
      '{team} update the live report as {opp} change their coverage mix.',
      'Observed frequencies move outside the model\'s prepared range.',
      'The game refuses to stay inside the pregame percentages.',
    ],
    'tactics.scout_shooter_relocation_map': [
      '{team} follow {player}\'s post-pass destination.',
      'The denial uses a logged relocation map, not ball watching.',
      'The pass is not the end of the scouting assignment.',
    ],
    'tactics.scout_screen_contact_threshold': [
      '{player} waits for real contact before changing assignments.',
      'The counter rejects the fake-screen cue in the active report.',
      'The ghost screen fails to haunt this defender.',
    ],
    'tactics.scout_play_number_deception': [
      '{team} change the play behind the familiar number.',
      '{opp}\'s recognition uses an obsolete call mapping.',
      'The same number now opens a different door.',
    ],
    'tactics.scout_personnel_conditional': [
      '{team} connect {opp}\'s set to the personnel on the floor.',
      'The conditional lineup pattern predicts the action before the call.',
      'The lineup supplies the clue the hand signal was hiding.',
    ],
    'tactics.scout_self_report_exposed': [
      '{player} reads how {opp} plan to defend him.',
      'The verified report turns a tendency into a development target.',
      'His game gets an outside review and an inside response.',
    ],
    'development.practice_focus_crowds_out': [
      '{player}\'s {focus} work comes with a measured cost to {neglected}.',
      'The training ledger links the neglected practice volume to the decline.',
      'One skill gets the calendar; another notices the missing appointments.',
    ],
    'development.practice_random_order': [
      '{player}\'s mixed drill order survives the later test.',
      'Retention improves outside the practiced sequence.',
      'The skills remember their job after the drill stops giving directions.',
    ],
    'development.practice_pressure_transfer': [
      '{player}\'s practice target does not carry into the pressure test.',
      'Matching the task isolates the change in distraction conditions.',
      'The empty-gym version gets a tougher audience.',
    ],
    'development.practice_variable_distance': [
      '{player} gains a broader shooting map at a cost to his favorite spot.',
      'The assessment separates range coverage from peak specialization.',
      'More addresses, a little less comfort at home.',
    ],
    'development.practice_film_overload': [
      '{player} remembers more and responds more slowly in the test.',
      'Recall and reaction are measured separately after the overloaded study plan.',
      'The scouting answers arrive with a longer loading time.',
    ],
    'development.practice_partner_timing': [
      '{player} and {teammate} sharpen one shared passing route.',
      'The gain is pairing-specific rather than a general passing upgrade.',
      'Familiar timing gets better without rewriting every pass.',
    ],
    'development.practice_visual_cues_removed': [
      '{player} runs the route after the markers disappear.',
      'The unmarked test confirms he retained the spacing cues.',
      'The floor stops whispering, and he still knows the path.',
    ],
    'development.practice_routine_skip_cost': [
      '{player} skips the routine and misses his readiness benchmark.',
      'The assessment compares his preparation choice with its stored target.',
      'The shortcut saves minutes and loses the check mark.',
    ],
    'development.practice_rest_plateau_break': [
      '{player}\'s fresh assessment clears the old plateau after rest.',
      'Equivalent test conditions separate recovery from an easier assignment.',
      'A day away finally helps the work move forward.',
    ],
    'development.practice_speed_accuracy_trade': [
      '{player}\'s shot gets quicker but less accurate in the assessment.',
      'The result meets one target and fails the companion measure.',
      'The ball leaves earlier; the basket agrees less often.',
    ],
    'development.practice_strength_touch': [
      '{player} gains force and loses some measured touch.',
      'The two tests capture different effects of the selected training emphasis.',
      'More power needs a quieter setting near the rim.',
    ],
    'development.practice_unfamiliar_ball': [
      '{player} needs to recalibrate after the equipment switch.',
      'The assessment records a specification change rather than a broken technique.',
      'The practice ball leaves its own handwriting on the release.',
    ],
    'development.practice_feedback_dependency': [
      '{player}\'s coached result does not survive the unprompted test.',
      'Cue dependence remains after the technical repetitions.',
      'The skill works until the instructor stops narrating it.',
    ],
    'development.practice_deliberate_error': [
      '{player} studies where the move fails before choosing it again.',
      'The benefit appears in rejection decisions, not a higher success rate for the move.',
      'A bad practice option teaches a better decision.',
    ],
    'development.practice_goal_revised': [
      '{player} and {coach} replace an unreachable drill target.',
      'The revised goal follows a measured constraint rather than a mood change.',
      'The development plan discovers the limits of wishing harder.',
    ],
    'physical.reach_contest_radius': [
      '{player}\'s reach changes his contest area, not his speed.',
      'The calibration separates arm geometry from foot movement.',
      'Longer coverage gets no free acceleration package.',
    ],
    'physical.wingspan_handle_clearance': [
      '{player}\'s added reach complicates his tight-handle drill.',
      'The recorded clearance limit follows the chosen dimensions.',
      'More reach also means more arm to fit through traffic.',
    ],
    'physical.mass_screen_stability': [
      '{player}\'s build holds the screen better and accelerates more slowly.',
      'Matched tests expose the selected stability-versus-start tradeoff.',
      'The screen gets an anchor; the first step gets a bill.',
    ],
    'physical.light_build_displacement': [
      '{player} meets the jump target but loses the rebound position.',
      'Contact stability, not vertical reach, explains the lost spot.',
      'The jump is ready; the landing address has moved.',
    ],
    'physical.center_gravity_turn': [
      '{player}\'s straight-line speed does not solve the turn test.',
      'The calibrated balance envelope changes with his center of gravity.',
      'Fast on the straight road, more careful at the corner.',
    ],
    'physical.handspan_ball_control': [
      '{player}\'s grip improves while the passing-read result stays the same.',
      'Ball security and decision recognition remain separate skills.',
      'A stronger hold does not come with a better map.',
    ],
    'physical.jump_repeat_dropoff': [
      '{player}\'s first jump and repeated jumps tell different stories.',
      'The assessment isolates repeatability from peak height.',
      'The highlight leap has a shorter subscription than the rebound battle.',
    ],
    'physical.longstride_crowded_lane': [
      '{player}\'s long strides need a different crowded-lane solution.',
      'Open-space speed does not establish tight-space foot control.',
      'The open road likes the build more than the hallway does.',
    ],
    'physical.release_height_clearance': [
      '{player}\'s higher release clears the contest at a timing cost.',
      'The measurement distinguishes clearance from speed of release.',
      'The shot finds a higher window and takes longer to open it.',
    ],
    'physical.foot_size_boundary': [
      '{player}\'s foot placement changes the tested shot value.',
      'The scoring boundary follows contact geometry, not body-center position.',
      'The shot has the right idea and the wrong footprint.',
    ],
    'physical.rotation_inertia_spin': [
      '{player}\'s build makes the spin slower and the contact base steadier.',
      'Mass distribution affects rotation separately from total strength.',
      'The sturdy version takes a little longer to turn around.',
    ],
    'physical.sprint_recovery_budget': [
      '{player}\'s top speed clears the test; his recovery interval does not.',
      'Peak output and repeat-effort recovery are tracked separately.',
      'The first sprint is a promise the next sprint cannot yet keep.',
    ],
    'physical.low_jump_angle_counter': [
      '{player} meets the finishing target without a bigger jump.',
      'The plan changes angles while the measured jump ceiling stays fixed.',
      'The basket accepts a smarter route instead of a higher flight.',
    ],
    'physical.max_strength_ball_speed': [
      '{player}\'s pass reaches the target too forcefully for {teammate}.',
      'Direction is correct; arrival speed exceeds the recorded catch window.',
      'The delivery arrives with more power than the door can handle.',
    ],
    'physical.dimensions_lock_confirmed': [
      '{player}\'s physical build is confirmed for this career.',
      'The lock preserves the previewed geometry and its tradeoffs.',
      'The builder closes; the basketball decisions begin.',
    ],
    'contract.player_option_kept': [
      '{player} exercises his option to stay with {team}.',
      'The option notice keeps {player}\'s next season under contract.',
      '{team} retain a player who chooses the agreed extra year.',
    ],
    'contract.team_option_declined': [
      '{team} decline {player}\'s contract option.',
      'The optional year ends before it begins for {player}.',
      '{player} reaches free agency through the club\'s recorded option decision.',
    ],
    'contract.guarantee_date_passed': [
      '{player}\'s contract guarantee rises to {amount}.',
      'The deadline passes with {player} still on {team}\'s roster.',
      'A calendar clause turns the saved protection into a guaranteed commitment.',
    ],
    'contract.appearance_bonus_earned': [
      '{player} earns his {amount} appearance bonus.',
      'The contract\'s appearance target is officially satisfied.',
      'Playing availability turns a written clause into earned pay for {player}.',
    ],
    'contract.bonus_target_missed': [
      '{player} finishes short of his {target} bonus condition.',
      'The recorded target remains unmet when the season closes.',
      '{team}\'s bonus clause does not pay out this year.',
    ],
    'contract.bonus_reclassified': [
      '{player}\'s incentive changes salary-accounting classification.',
      'The league ledger now lists the clause as {classification}.',
      '{team}\'s next salary plan uses the revised incentive entry.',
    ],
    'contract.trade_kicker_reduced': [
      '{player} reduces his trade bonus by {amount}.',
      'His consent changes the financial terms of the proposed move.',
      'The bonus adjustment is complete; the transfer still has its own approval checks.',
    ],
    'contract.training_location_clause_used': [
      '{player} invokes his training-location clause.',
      '{team}\'s required sessions move to {facility} under the agreement.',
      'A detail in the contract becomes a detail on the training calendar.',
    ],
    'contract.role_promise_honored': [
      '{team} meet their written role commitment to {player}.',
      'The review confirms {player}\'s promised {role} opportunity was delivered.',
      'Contract language and recorded usage agree at the deadline.',
    ],
    'contract.role_promise_remedy': [
      '{player} activates the agreed remedy for a missed role promise.',
      '{team}\'s recorded usage falls short of the signed commitment.',
      'The contract provides {remedy}, and both sides put it into effect.',
    ],
    'contract.relocation_stipend_used': [
      '{team} reimburse {player}\'s eligible moving costs.',
      'The relocation clause covers {amount} of the documented move.',
      '{player}\'s new address comes with the support already written into his deal.',
    ],
    'contract.pay_schedule_switched': [
      '{player} switches to a year-round salary schedule.',
      '{team} spread the same contract value across the agreed calendar.',
      'The amount stays fixed while the timing changes for {player}.',
    ],
    'contract.deferred_payment_arrives': [
      '{player} receives the matured {amount} deferred payment.',
      'Money from an earlier contract reaches his account on the agreed date.',
      '{team} settle this recorded deferred installment.',
    ],
    'contract.cooling_period_withdrawal': [
      '{player} withdraws the proposal within its permitted review period.',
      'The agreement never reaches its effective date.',
      'A saved contract safeguard gives {player} time to change his decision.',
    ],
    'contract.copy_conflict_corrected': [
      '{player} and {team} reconcile their conflicting contract drafts.',
      'The two copies now contain the same {clause} language.',
      'The paperwork problem is fixed before the agreement takes effect.',
    ],
    'agent.relationship_ended': [
      '{player} parts with his agent under the agreed notice terms.',
      'Representation ends without rewriting the contracts already signed.',
      '{player}\'s next negotiation begins with a vacant agent role.',
    ],
    'agent.self_representation_registered': [
      '{player} registers to negotiate for himself.',
      'The league accept his self-representation paperwork.',
      'His next contract conversation goes directly through {player}.',
    ],
    'agent.dual_client_recusal': [
      '{player} appoints independent help for a conflicted offer.',
      'One roster opening and two clients require a different negotiating arrangement.',
      'The disclosed overlap is handled before {player}\'s offer proceeds.',
    ],
    'agent.business_stake_disclosed': [
      '{player} pauses the venture for an independent conflict review.',
      'The agent\'s disclosed stake changes how the proposal will be examined.',
      'No funds move while {player} reviews the overlapping interests.',
    ],
    'agent.commission_cap_negotiated': [
      '{player} negotiates a lower commission cap.',
      'Future eligible fees follow the new {rate} ceiling.',
      'The agency agreement changes without revisiting past earned commissions.',
    ],
    'agent.flat_fee_trial': [
      '{player} starts a flat-fee representation trial.',
      'His agent\'s pay no longer rises automatically with this trial\'s contract value.',
      'The new arrangement runs until {date}, when both sides review it.',
    ],
    'agent.offer_withheld_found': [
      'A compliance review finds {player} was not shown an expired offer.',
      'The offer deadline passed before the client received the terms.',
      '{player}\'s representation review now includes a verified communication failure.',
    ],
    'agent.all_offers_dashboard': [
      '{player}\'s offer log passes its first reconciliation.',
      'Every written proposal appears in the shared negotiating record.',
      'The new visibility rule gives {player} a complete offer list.',
    ],
    'agent.negotiation_limit_set': [
      '{player} sets a firm {condition} limit for negotiations.',
      'His representative accepts the instruction before the next offer.',
      'The mandate narrows which proposals can receive an authorized yes.',
    ],
    'agent.deadline_authority_revoked': [
      '{player} takes back final offer approval before the deadline.',
      'The agent can continue negotiating but cannot accept for him.',
      'A timely instruction returns the signature decision to {player}.',
    ],
    'agent.specialist_added': [
      '{player} adds a specialist for {issue}.',
      'The retainer assigns a defined review task rather than a second full negotiator.',
      'Two advisers share the work under written boundaries.',
    ],
    'agent.agency_merger_choice': [
      '{player} chooses {choice} after his agency\'s merger.',
      'The client option settles who handles his next negotiations.',
      'The agency changes; {player} uses the choice written into his agreement.',
    ],
    'agent.unsolicited_pitch_blocked': [
      '{player}\'s contact filter keeps an unsolicited agency pitch off his desk.',
      'The approach is recorded without reopening representation discussions.',
      'He keeps the agent search closed by choice.',
    ],
    'agent.performance_review_retained': [
      '{player}\'s agent meets the agreed service-review standards.',
      'The client renews representation after checking the records.',
      'Continuity follows documented work rather than a new sales pitch.',
    ],
    'agent.pro_bono_rookie_advice': [
      '{player} completes an independent contract-advice session.',
      'The association\'s program supplies guidance without a representation contract.',
      'He leaves with a reviewed proposal and the same freedom to choose.',
    ],
    'work.coaching_apprenticeship_paid': [
      '{player} completes his paid coaching apprenticeship.',
      'The certified hours add experience beyond playing.',
      'His offseason work produces an earned {amount} payment.',
    ],
    'work.side_job_shift_conflict': [
      '{player} gives up a side-job shift for {team}\'s required session.',
      'Two work calendars collide, and basketball takes the selected slot.',
      'The choice costs {amount} in scheduled nonplaying wages.',
    ],
    'work.consulting_assignment_complete': [
      '{player} completes the accepted consultancy assignment.',
      'The client signs off on {project}.',
      'A finished deliverable turns the approved side work into earned income.',
    ],
    'work.business_break_even': [
      '{business} reaches verified break-even under {player}\'s ownership.',
      'Revenue covers the recorded operating costs for {period}.',
      'The business finishes this period without a profit or a loss.',
    ],
    'work.business_payroll_met': [
      '{player} funds {business}\'s payroll gap.',
      'Staff wages clear after the recorded {amount} capital injection.',
      'The business meets its pay date using new owner funds.',
    ],
    'work.manager_handover': [
      '{player} hands daily operations of {business} to its manager.',
      'The written limits define which decisions no longer need his approval.',
      'A completed handover creates more room in his basketball schedule.',
    ],
    'work.franchise_location_closed': [
      '{player}\'s business closes its {location} outlet.',
      'The approved closure follows the location\'s recorded operating results.',
      '{business} continues with one fewer branch.',
    ],
    'work.product_recall_voluntary': [
      '{business} issue a voluntary recall for {product}.',
      '{player}\'s company responds to the verified defect before any recorded incident.',
      'The recall creates {amount} in documented operating costs.',
    ],
    'work.employee_equity_granted': [
      '{player} approves employee ownership at {business}.',
      'The grant starts vesting under the published terms.',
      'Staff receive a share of the company, with conditions still to fulfill.',
    ],
    'work.inventory_sellout': [
      '{business} sell out the documented {product} run.',
      'The inventory reaches zero after verified sales.',
      '{player}\'s company has revenue to count and production costs still to reconcile.',
    ],
    'work.unsold_stock_write_down': [
      '{business} write down unsold inventory by {amount}.',
      'The accounting change lowers the recorded stock value.',
      '{player}\'s business recognizes a loss already present in its inventory.',
    ],
    'work.customer_contract_renewed': [
      '{business} retain their customer through a signed renewal.',
      'The review ends with another {term} of agreed service.',
      '{player}\'s company gains continuing revenue and continuing work.',
    ],
    'work.business_buyout_offer_declined': [
      '{player} turns down the {amount} offer for {business}.',
      'The proposed sale ends with ownership unchanged.',
      'He chooses continued operation over the documented buyout price.',
    ],
    'work.professional_license_renewed': [
      '{player} renews his {license} qualification.',
      'The required coursework keeps his nonplaying credential active.',
      'Another career option remains available beyond the court.',
    ],
    'work.cooperative_membership': [
      '{player} joins {cooperative} as a working member.',
      'The contribution comes with the cooperative\'s stated voting rights.',
      'His side work uses shared ownership rather than sole control.',
    ],
    'investment.lockup_blocks_withdrawal': [
      '{player}\'s withdrawal request meets the fund\'s lockup.',
      'The investment cannot supply the requested cash before {date}.',
      'Its disclosed exit terms matter when he wants the money back.',
    ],
    'investment.capital_call_paid': [
      '{player} meets the {amount} capital call.',
      'The signed commitment becomes a funded contribution.',
      'Money moves into {fund} under terms already agreed.',
    ],
    'investment.capital_call_default': [
      '{player}\'s missed capital call reduces his fund stake.',
      'The fund applies its disclosed {consequence} clause.',
      'The deadline costs ownership rather than inventing a market loss.',
    ],
    'investment.dividend_reinvested': [
      '{player} reinvests the confirmed {amount} distribution.',
      'The payment becomes additional units in {investment}.',
      'His holdings rise while the distribution stays out of spending cash.',
    ],
    'investment.dividend_taken_cash': [
      '{player} takes {amount} in investment distributions as cash.',
      'The holdings remain in place while the payment clears.',
      'The portfolio supplies spendable money through this recorded distribution.',
    ],
    'investment.dilution_round': [
      '{player}\'s stake in {business} falls to {share} after new funding.',
      'He does not join the completed financing round.',
      'The ownership slice shrinks without by itself proving the investment lost value.',
    ],
    'investment.pro_rata_right_used': [
      '{player} funds his participation right in {business}.',
      'The completed contribution keeps his ownership at {share}.',
      'Maintaining the stake costs the recorded {amount}.',
    ],
    'investment.fund_winddown_distribution': [
      '{fund} send {player} their final winddown distribution.',
      'The holding closes after {amount} reaches his account.',
      'The complete investment result can now be calculated from actual payments.',
    ],
    'investment.paper_gain_not_cash': [
      '{player}\'s portfolio reaches a quoted value of {amount}.',
      'The milestone is a valuation, not a completed cash withdrawal.',
      'His account shows a paper gain while the units remain invested.',
    ],
    'investment.loss_realized_sale': [
      '{player} realizes a {amount} loss on the completed sale.',
      '{investment} leaves his portfolio after settlement.',
      'The price difference is now a recorded result rather than a changing quote.',
    ],
    'investment.rebalance_complete': [
      '{player} completes his chosen portfolio rebalance.',
      'The holdings now match the saved {allocation} target.',
      'Transaction costs of {amount} accompany the new mix.',
    ],
    'investment.single_asset_limit': [
      '{player} reduces a holding that crosses his chosen exposure limit.',
      'The sale follows his saved concentration rule.',
      'The portfolio changes shape; future performance remains uncertain.',
    ],
    'investment.suspension_of_redemptions': [
      '{fund} suspend redemptions with {player}\'s request pending.',
      'His units remain owned but cannot currently become cash.',
      'The queue is confirmed; a payment date is not.',
    ],
    'investment.collectible_sale_authentication': [
      '{player}\'s authenticated {item} sells for {amount}.',
      'The verified sale turns a stored collectible into settled proceeds.',
      'The transaction is complete after the authenticity check and payment.',
    ],
    'investment.community_bond_matures': [
      '{player}\'s {project} bond returns its principal at maturity.',
      'The scheduled {amount} repayment clears.',
      'His community investment completes its stated principal cycle.',
    ],
    'tax.withholding_adjustment_applied': [
      '{player}\'s requested withholding change reaches payroll.',
      'His next payment uses the new recorded deduction setting.',
      'The paycheck changes without settling his final annual tax bill.',
    ],
    'tax.multijurisdiction_return_complete': [
      '{player} completes the required filings across {count} work jurisdictions.',
      'The travel calendar produces several tax records, all now submitted.',
      'Filing is complete; payment and review remain separate states.',
    ],
    'tax.estimated_payment_late': [
      '{player} receives a {amount} late-payment charge.',
      'The recorded tax installment reaches the authority after its deadline.',
      'The save\'s published payment rule supplies the stated cost.',
    ],
    'tax.residency_change_confirmed': [
      '{player}\'s tax-residency change is confirmed.',
      '{jurisdiction} accept the documented residence status.',
      'Future calculations follow the confirmed effective date, not the move announcement alone.',
    ],
    'tax.expense_claim_disallowed': [
      '{player}\'s {expense} deduction is disallowed.',
      'The assessment changes the tax calculation without alleging fraud.',
      'The revised balance reflects the rule applied to this expense.',
    ],
    'tax.audit_records_accepted': [
      '{player}\'s documented tax review closes without adjustment.',
      'The requested records satisfy the stated review.',
      'This period\'s examined items pass; the finding goes no further.',
    ],
    'tax.overlapping_withholding_credit': [
      '{player} receives an approved cross-jurisdiction withholding credit.',
      'The assessment removes the documented overlap of {amount}.',
      'His liability changes; actual cash settlement is a later step.',
    ],
    'insurance.coverage_exclusion_disclosed': [
      '{player}\'s proposed {activity} is excluded from the quoted policy.',
      'The review reveals the gap before the premium is paid.',
      'A quote is not coverage for the excluded activity.',
    ],
    'insurance.rider_added': [
      '{player} adds the approved {coverage} rider.',
      'The paid premium activates the new policy terms on {date}.',
      'The coverage expands within the rider\'s written scope.',
    ],
    'insurance.renewal_premium_jump': [
      '{player} renews coverage at a higher premium.',
      'The new policy period costs {amount}.',
      'Keeping the protection now requires the recorded additional payment.',
    ],
    'insurance.claim_exclusion_denial': [
      '{player}\'s insurer denies the {claim} claim under a stated exclusion.',
      'The decision leaves {amount} of the documented loss uncovered.',
      'The policy terms, rather than an invented payout, determine this claim\'s result.',
    ],
    'insurance.deductible_paid': [
      '{player} pays the {amount} deductible on the covered loss.',
      'His contractual share clears while the insurer\'s portion remains separate.',
      'The policy limits what this payment settles.',
    ],
    'insurance.coverage_lapse_reinstated': [
      '{player}\'s policy coverage resumes on {date}.',
      'The permitted reinstatement payment is complete.',
      'The recorded lapse remains outside the restored coverage window.',
    ],
    'insurance.agreed_value_updated': [
      '{player}\'s insured {asset} receives an updated agreed value.',
      'The policy records {amount} after the valuation review.',
      'Renewal now uses the endorsed value rather than the previous figure.',
    ],
    'insurance.team_travel_policy_gap': [
      '{team} extend their travel policy before departure.',
      'The planned {trip} falls outside the old coverage map.',
      'A confirmed extension covers the route the club actually intend to take.',
    ],
    'credit.revolving_line_opened': [
      '{player} opens a {amount} credit line without drawing it.',
      'The approval creates borrowing capacity, not income.',
      'The lender\'s limit is available under the recorded terms.',
    ],
    'credit.line_draw_settled': [
      '{player} draws {amount} from his existing credit line.',
      'Cash and debt rise together when the transfer clears.',
      'The facility becomes a borrowing balance rather than merely an available limit.',
    ],
    'credit.line_frozen_voluntarily': [
      '{player} locks further borrowing on his credit line.',
      'The unused limit can no longer be drawn by choice.',
      'Existing debt remains due under its original schedule.',
    ],
    'credit.rate_reset_notice': [
      '{player}\'s loan rate resets to {rate}.',
      'The change follows the benchmark formula in his agreement.',
      'Future scheduled interest uses the confirmed new rate.',
    ],
    'credit.refinance_cost_break_even': [
      '{player}\'s refinancing recovers its recorded setup cost.',
      'Actual savings reach the {amount} closing expense.',
      'The decision has passed its measured break-even point.',
    ],
    'credit.early_payoff_charge': [
      '{player} pays off the loan ahead of schedule.',
      'The signed prepayment clause adds a {amount} charge.',
      'The debt closes at its documented early-exit cost.',
    ],
    'credit.balloon_payment_due': [
      '{player} settles the loan\'s final {amount} balloon payment.',
      'The large maturity installment clears from available funds.',
      'A scheduled debt obligation reaches its completed ending.',
    ],
    'credit.collateral_release': [
      '{player}\'s lender releases {asset} from collateral.',
      'The secured obligation is satisfied and the release is confirmed.',
      'The asset stays his, with this lending restriction removed.',
    ],
    'credit.collateral_topup_required': [
      '{player}\'s lender requests {amount} in added collateral.',
      'The notice follows the loan\'s saved maintenance ratio.',
      'The valuation change creates a deadline, not an automatic asset seizure.',
    ],
    'credit.salary_advance_repaid': [
      '{player}\'s paycheck repays {amount} of his salary advance.',
      'The authorized deduction settles part of money received earlier.',
      'The advance balance falls while ordinary gross pay remains unchanged.',
    ],
    'credit.cash_buffer_restored': [
      '{player} restores his chosen cash buffer to {amount}.',
      'Completed transfers reach the saved reserve target.',
      'More of his existing money is now available for near-term needs.',
    ],
    'credit.asset_rich_payment_short': [
      '{player} has valuable assets but not enough ready cash for {bill}.',
      'The deadline approaches with a {amount} liquidity gap.',
      'His balance sheet and his spending account tell different stories.',
    ],
    'credit.auction_reserve_not_met': [
      '{player}\'s {asset} remains unsold after the reserve is missed.',
      'The auction does not produce the cash he planned to raise.',
      'Ownership stays in place while recorded sale-attempt costs remain.',
    ],
    'credit.automatic_payment_prevents_late': [
      '{player}\'s automatic loan payment clears before the deadline.',
      'The saved instruction settles the scheduled {amount} installment.',
      'One recurring obligation is handled without a missed-date charge.',
    ],
    'credit.guarantee_released': [
      '{player} is released from {business}\'s loan guarantee.',
      'The lender confirms the agreed release conditions are satisfied.',
      'The business balance remains separate from his former contingent obligation.',
    ],
    'planning.living_trust_funded': [
      '{player} funds his living trust with {assets}.',
      'The documented transfers put the plan into operation.',
      'Planning changes how the assets are held while he remains alive.',
    ],
    'planning.beneficiary_record_updated': [
      '{player}\'s beneficiary update is accepted by the account provider.',
      'The recorded designation changes on {date}.',
      'The planning instruction is complete without any transfer of money today.',
    ],
    'planning.successor_manager_named': [
      '{player} names a successor manager for {business}.',
      'The appointment records who may act if the saved conditions arise.',
      'Control remains unchanged while the contingency plan gains a named role.',
    ],
    'planning.inventory_reconciled': [
      '{player}\'s planning inventory now includes every reconciled holding.',
      'The review adds the assets missing from the old list.',
      'Better records make the plan more complete without creating new wealth.',
    ],
    'planning.document_review_sunset': [
      '{player}\'s temporary planning authority expires on {date}.',
      'He chooses not to renew the time-limited mandate.',
      'The delegated power ends under its own recorded terms.',
    ],
    'planning.independent_custodian_selected': [
      '{player}\'s trust assets move to an independent custodian.',
      'The accepted appointment separates custody from beneficial ownership.',
      'The plan now carries the recorded {amount} custody cost.',
    ],
    'philanthropy.restricted_grant_conditions_met': [
      '{foundation} release the conditional grant after verification.',
      '{recipient} meet the documented {condition} requirement.',
      'The promised support becomes available under the original terms.',
    ],
    'philanthropy.restricted_grant_paused': [
      '{foundation} pause the next grant installment.',
      'The documented {milestone} condition is not yet met.',
      'The recipient has until {date} for the agreed review rather than an automatic cancellation.',
    ],
    'philanthropy.matching_pool_unlocked': [
      '{foundation} unlock the pledged {amount} donation match.',
      'Verified outside contributions reach the stated trigger.',
      'The campaign gains money already promised for this condition.',
    ],
    'philanthropy.board_conflict_recusal': [
      '{foundation} record a recusal for the {recipient} grant decision.',
      'The declared financial interest removes one director from this vote.',
      'The remaining eligible board decide the application.',
    ],
    'philanthropy.administration_ratio_review': [
      '{foundation} approve a plan to reduce administrative costs.',
      'The completed accounts exceed their own spending limit.',
      'The review leads to {plan}, with future results still to be measured.',
    ],
    'philanthropy.endowment_draw_cap_used': [
      '{foundation} adopt a grant budget within their endowment cap.',
      'The saved draw rule limits this year\'s spending to {amount}.',
      'The approved plan leaves the remaining endowment invested.',
    ],
    'philanthropy.community_budget_vote': [
      '{foundation} implement the community\'s grant choices.',
      'The certified vote allocates the {amount} participatory pool.',
      'Eligible projects receive funding through the announced decision process.',
    ],
    'philanthropy.donor_data_minimization': [
      '{foundation} complete their donor-data cleanup.',
      'The verified process retains the required financial records.',
      'Supporter information now follows the approved minimum-retention policy.',
    ],
    'philanthropy.pledge_budget_reduced': [
      '{player} and {foundation} agree to a smaller future pledge.',
      'The revised commitment follows the recorded budget change.',
      'Past gifts stand while the remaining promise becomes {amount}.',
    ],
    'club.season_ticket_cash_arrives': [
      '{team} collect {amount} in cleared season-ticket receipts.',
      'The collection window gives the club cash before all the games are played.',
      'The tickets still carry the promised season of arena access.',
    ],
    'club.ticket_refunds_paid': [
      '{team} complete the eligible canceled-fixture refunds.',
      'Supporters receive {amount} under the club\'s announced policy.',
      'The refund ledger closes these recorded ticket claims.',
    ],
    'club.naming_payment_delayed': [
      '{team} await the overdue arena-rights payment.',
      'The scheduled {amount} installment has not cleared.',
      'The reminder process begins under the existing commercial agreement.',
    ],
    'club.naming_payment_catchup': [
      '{team} receive the overdue {amount} arena-rights installment.',
      'The delayed payment clears into the club\'s account.',
      'This receivable is settled; later installments retain their own dates.',
    ],
    'club.arena_rent_escalator': [
      '{team}\'s arena rent rises to {amount}.',
      'The lease\'s recorded escalation clause reaches its effective date.',
      'The next operating budget must use the new invoice.',
    ],
    'club.nonbasketball_event_profit': [
      '{arena}\'s {event} produces a verified {amount} surplus.',
      'The completed accounts show income above the recorded event costs.',
      '{team} gain a financial result from a date outside their playing schedule.',
    ],
    'club.nonbasketball_event_damage_bill': [
      '{team} receive the {amount} repair bill after {event}.',
      'The event agreement assigns the verified cost to the club.',
      'The expense is recorded without assuming a canceled basketball game.',
    ],
    'club.energy_budget_shock': [
      '{team} revise the arena energy budget after the tariff change.',
      'Forecast costs rise by {amount} under the supplier\'s notice.',
      'The operating plan changes before the actual utility bills arrive.',
    ],
    'club.payroll_reserve_used': [
      '{team} use {amount} from their payroll reserve.',
      'The scheduled salary run clears despite the operating-cash shortage.',
      'The wages are paid and the reserve is smaller.',
    ],
    'club.owner_capital_injection': [
      '{owner} inject {amount} in approved capital into {team}.',
      'The funds clear without a transfer of club control.',
      'The balance sheet receives new equity rather than a loan.',
    ],
    'club.owner_bridge_loan': [
      '{team} receive a {amount} bridge loan from {owner}.',
      'The club gain cash and a new repayment date.',
      'The agreement is borrowing, with the recorded terms still to fulfill.',
    ],
    'club.sponsor_in_kind_delivery': [
      '{team} receive the promised {equipment} delivery.',
      'The partner fulfills the agreement through goods rather than cash.',
      'The accepted equipment closes this in-kind contract item.',
    ],
    'club.vendor_bulk_discount': [
      '{team} secure the recorded bulk discount on {equipment}.',
      'The accepted order saves {amount} against the standard quoted total.',
      'A procurement choice changes this invoice\'s cost.',
    ],
    'club.construction_contingency_spent': [
      '{team} spend {amount} of the arena-project contingency.',
      'The approved change order addresses {issue}.',
      'The project continues with a smaller reserve for later surprises.',
    ],
    'club.budget_veto_exercised': [
      '{team}\'s finance committee reject the {project} expense.',
      'The vote uses the spending authority in the club\'s governance rules.',
      'The proposed {amount} remains outside the approved budget.',
    ],
    'international.salary_currency_choice': [
      '{player} elects to receive future salary in {currency}.',
      'The contract\'s currency option is exercised before its deadline.',
      '{team}\'s next payroll uses the recorded settlement choice.',
    ],
    'international.split_currency_payroll': [
      '{player}\'s first split-currency payment reconciles.',
      '{team} settle the agreed portions in {currency1} and {currency2}.',
      'Two receipts fulfill one salary obligation.',
    ],
    'international.bank_holiday_clearing_delay': [
      '{player}\'s salary transfer waits on {country}\'s bank holiday.',
      'The payment is initiated, but the clearing calendar adds {days} days.',
      'Money in transit is not yet money received.',
    ],
    'international.conversion_fee_reconciled': [
      '{player}\'s salary conversion carries a verified {amount} fee.',
      'The gross transfer and net receipt reconcile under the saved schedule.',
      'The cross-border payment arrives with its documented currency cost.',
    ],
    'international.fx_hedge_settled': [
      '{player}\'s currency hedge settles with a {result} of {amount}.',
      'The completed contract fixes this settlement\'s exchange outcome.',
      'Future salary conversions remain exposed to their own dates and terms.',
    ],
    'international.salary_escrow_funded': [
      '{team} fund the required salary escrow for {player}.',
      'The independent holder confirms the {amount} deposit.',
      'The security is in place while the future wages remain future obligations.',
    ],
    'international.escrow_release_on_payday': [
      '{player} receives {amount} from the salary escrow.',
      'The scheduled release conditions are satisfied.',
      'Secured money becomes actual pay on the contract\'s recorded date.',
    ],
    'international.guaranteed_net_pay_grossup': [
      '{team} adjust gross salary to preserve {player}\'s contracted net pay.',
      'The recorded withholding change activates the agreed formula.',
      'The player keeps the stated net amount while the club\'s payroll cost changes.',
    ],
    'international.housing_clause_in_kind': [
      '{team} provide the residence specified in {player}\'s contract.',
      'The verified housing arrangement fulfills the in-kind clause.',
      'The saved agreement supplies a place to live rather than a second cash allowance.',
    ],
    'international.return_fare_reserved': [
      '{team} book {player}\'s contracted return journey.',
      'The confirmed route to {destination} fulfills the existing fare clause.',
      'The travel provision becomes a paid reservation.',
    ],
    'international.buyout_release_paid': [
      '{player} pays the {amount} required by his release clause.',
      '{team} confirm the contractual release after receipt.',
      'The old agreement ends; eligibility elsewhere still needs its own checks.',
    ],
    'international.buyout_deadline_expired': [
      '{player}\'s special release window expires unused.',
      'The recorded deadline passes without the required payment.',
      'His {team} contract continues under its remaining terms.',
    ],
    'international.loan_salary_allocation': [
      '{team} and {otherteam} reconcile {player}\'s loan salary.',
      'The cost-sharing agreement assigns {share} to the receiving club.',
      'Two clubs fund one recorded player payment.',
    ],
    'international.transfer_fee_installment_paid': [
      '{team} settle the scheduled {amount} transfer-fee installment.',
      'The payment follows an existing cross-league agreement.',
      '{player}\'s registration does not change when the club balance falls.',
    ],
    'international.bank_account_portability_denied': [
      '{player}\'s preferred account is incompatible with the new payroll system.',
      '{team} request an account that supports the declared payment route.',
      'The banking choice needs revision before the scheduled salary run.',
    ],
    'labor.pension_vesting_confirmed': [
      '{player}\'s pension rights become vested under the plan.',
      'The administrator confirms his credited service meets the requirement.',
      'A career milestone creates a future benefit right rather than a new paycheck.',
    ],
    'labor.pension_contribution_posted': [
      '{team}\'s {amount} pension contribution posts for {player}.',
      'The plan account receives the employer payment.',
      'His benefit balance rises while take-home salary remains separate.',
    ],
    'labor.pension_transfer_accepted': [
      '{player}\'s eligible pension transfer is complete.',
      '{amount} moves into the accepted receiving plan.',
      'His retirement assets change providers without becoming salary.',
    ],
    'labor.benefit_enrollment_completed': [
      '{player} completes enrollment in {benefit}.',
      'The accepted election activates the scheme on {date}.',
      'Participation now follows the selected contribution terms.',
    ],
    'labor.enrollment_window_missed': [
      '{player}\'s late {benefit} election waits until {date}.',
      'The saved enrollment window closes before his submission.',
      'This benefit remains inactive without changing the schemes he already holds.',
    ],
    'labor.transition_fund_grant': [
      '{player} receives {amount} for approved career-transition training.',
      'The benefit scheme approves his {program} application.',
      'The funds support a next-career plan under their stated restrictions.',
    ],
    'labor.emergency_assistance_grant': [
      'The association approve {player}\'s emergency-assistance grant.',
      'The verified application produces {amount} in nonrepayable support.',
      'A benefit fund supplies help beyond his team contract.',
    ],
    'labor.strike_authorization_vote': [
      'Players authorize a possible strike in a certified vote.',
      'The union gain a mandate, not an automatic canceled game.',
      '{season}\'s schedule remains active until a separate stoppage decision.',
    ],
    'labor.authorized_strike_begins': [
      'Players begin their authorized strike on {date}.',
      '{league} postpone the confirmed affected fixtures.',
      'A player-called stoppage changes the schedule under the saved labor process.',
    ],
    'labor.strike_fund_payment': [
      '{player} receives {amount} from the strike fund.',
      'The payment follows the participant rules for the active stoppage.',
      'Union support reaches his account separately from club payroll.',
    ],
    'labor.travel_rest_right_used': [
      '{player} uses his agreed travel-rest entitlement.',
      '{team} remove the conflicting optional {event}.',
      'The calendar changes through a written workplace right.',
    ],
    'labor.education_leave_approved': [
      '{team} approve {player}\'s education leave for {course}.',
      'The benefit covers the recorded {days} days.',
      'The approved dates become excused time under the agreement.',
    ],
    'labor.escrow_balance_returned': [
      '{player} receives {amount} from the salary-escrow reconciliation.',
      'Certified revenue accounts establish the excess withholding.',
      'The season\'s agreed accounting process returns money already held from his pay.',
    ],
    'labor.minimum_compensation_topup': [
      '{team} pay {player} the {amount} compensation top-up.',
      'The payroll review applies the saved collective minimum.',
      'This period\'s pay reaches the agreed floor without a new contract.',
    ],
    'labor.dues_payment_corrected': [
      '{player}\'s duplicate union-dues payment is returned.',
      'The association reconcile the collection record and refund {amount}.',
      'Membership remains active with the payment ledger corrected.',
    ],
    'schedule.rest_imbalance_repaired': [
      '{league} repair the rest imbalance in their schedule.',
      'The revised calendar cuts the largest rest gap to {gap}.',
      'The schedule audit passes after the fixture order changes.',
    ],
    'schedule.road_trip_split': [
      '{team} get a break in their {games}-game road stretch.',
      'The amended itinerary returns {team} home between trips.',
      'One long road block becomes two shorter journeys.',
    ],
    'schedule.rescheduled_double_booking': [
      '{team}\'s new date at {arena} fails the booking check.',
      'Two events cannot use the same court on {date}.',
      'The fixture remains pending while the venue conflict is resolved.',
    ],
    'schedule.early_finish_cost': [
      '{league} finish earlier under a more expensive itinerary.',
      'The compressed calendar adds {amount} to projected travel costs.',
      'Saving calendar days costs the league more miles.',
    ],
    'schedule.rivalry_rotation_balance': [
      '{league} complete their {seasons}-season rivalry rotation.',
      'Every configured rivalry gets an equal home-date ledger.',
      'The calendar\'s long-term balance check now clears.',
    ],
    'schedule.broadcast_window_declined': [
      '{team} decline the proposed {time} tip-off.',
      'The recovery plan wins this scheduling decision.',
      'The optional television window passes without moving {team}\'s game.',
    ],
    'schedule.simultaneous_final_round': [
      '{league} align the qualification race at {time}.',
      'The decisive fixtures share one opening time.',
      'Nobody in that race gets to wait for an earlier final result.',
    ],
    'schedule.unbalanced_fixture_disclosure': [
      '{league} publish the opponent counts for {format}.',
      'The unequal fixture rotation is disclosed before play.',
      'Every club can inspect the schedule imbalance it will face.',
    ],
    'schedule.reserve_date_consumed': [
      '{league} use their final reserve date on {date}.',
      'The calendar\'s makeup cushion is now exhausted.',
      'Any further postponement will need a new scheduling decision.',
    ],
    'schedule.home_stand_capacity': [
      '{team} add venue staffing for their extended home stand.',
      'The amended contract covers the missing {hours} hours.',
      'The home dates stay intact after staffing catches up.',
    ],
    'qualify.multi_team_tie_order': [
      '{league} resolve the shared record through {criterion}.',
      'The multi-team tie gets an official order.',
      'Equal records no longer mean an unresolved bracket.',
    ],
    'qualify.mini_table_restart': [
      '{team} gain position when the tie procedure restarts.',
      'The remaining clubs return to {criterion}.',
      'Separating one team changes how the rest of the tie is resolved.',
    ],
    'qualify.coin_draw_decision': [
      '{team} receive seed {seed} in the authorized draw.',
      'Every sporting separator runs out before the draw decides it.',
      'The witnessed result settles the last qualification dispute.',
    ],
    'qualify.points_deduction_drop': [
      '{team} drop outside qualification after a {points}-point deduction.',
      'The certified penalty changes the bracket line.',
      'The original record stays archived beside the adjusted table.',
    ],
    'qualify.appeal_seed_restored': [
      '{team} regain seed {seed} after the table correction.',
      'The appeal decision changes qualification before bracket lock.',
      'The restored points put {team} back into the field.',
    ],
    'qualify.division_winner_reseeded': [
      '{team} win their division but enter at seed {seed}.',
      'The format rewards qualification without protecting bracket position.',
      'The overall record decides where the division winner lands.',
    ],
    'qualify.playin_consolation_route': [
      '{team} lose once but still have a route through {opp}.',
      'The format leaves one qualification chance open.',
      'The first play-in defeat does not end {team}\'s season.',
    ],
    'qualify.no_head_to_head_sample': [
      '{league} skip a tiebreak with no games to measure.',
      'The tie moves directly to {criterion}.',
      'An empty head-to-head ledger cannot settle this race.',
    ],
    'qualify.fewer_games_percentage': [
      '{team} qualify above {opp} on winning percentage.',
      'The table counts success rate rather than raw victories.',
      'Unequal games make the published percentage rule decisive.',
    ],
    'qualify.bracket_lock_error_reopened': [
      '{league} reopen the bracket after a rule-version mismatch.',
      'The corrected field uses version {version}.',
      'No playoff game starts under the superseded qualification rules.',
    ],
    'format.reseed_next_round': [
      'Reseeding sends {team} into a matchup with {opp}.',
      'The remaining seeds determine the next round anew.',
      'The old bracket path gives way to the published reseeding rule.',
    ],
    'format.two_leg_aggregate_advance': [
      '{team} lose the return leg but advance over {opp}.',
      'The aggregate total of {total} decides the tie.',
      'A single-game defeat does not erase {team}\'s two-leg advantage.',
    ],
    'format.double_elimination_lower_run': [
      '{team} move to the lower bracket after losing {round}.',
      'The defeat costs their upper path, not their tournament place.',
      'A second route remains under the double-elimination rules.',
    ],
    'format.bracket_reset_required': [
      '{team} force a reset final against {opp}.',
      'The first final uses the unbeaten side\'s spare life.',
      'The championship still needs another deciding contest.',
    ],
    'format.bye_rest_tradeoff': [
      '{team} get {days} rest days from their bye.',
      'The bye offers recovery while {opp} keep playing.',
      'The bracket gives {team} time, with rhythm still to be tested.',
    ],
    'format.host_choice_opponent': [
      '{team} choose {opp} under the opponent-selection rule.',
      'The bracket gains an opponent by choice rather than a fixed path.',
      'The eligible pool closes when {team} submit their pick.',
    ],
    'format.cup_group_margin_cap': [
      '{team}\'s cup tiebreak gain stops at {cap}.',
      'The full game result stands; the group separator is capped.',
      'The standings refuse the extra margin under the published rule.',
    ],
    'format.away_goals_disabled_decider': [
      '{team} and {opp} need the format\'s deciding contest.',
      'Away scoring offers no shortcut in this competition.',
      'The aggregate tie survives until the published decider.',
    ],
    'format.consolation_placement': [
      '{team} earn place {place} through the classification match.',
      'The title chase is over, but the final rank still counts.',
      'The placement result settles the remaining prize position.',
    ],
    'format.series_length_transition': [
      '{team} now need {wins} victories in {round}.',
      'The next round changes the series target.',
      'The qualification path becomes a different-length test.',
    ],
    'archive.record_reclassification': [
      '{player}\'s official {stat} record is revised to {total}.',
      'The archive separates exhibitions from competition games.',
      'The old total remains documented with its original scope.',
    ],
    'archive.stat_category_inception': [
      '{league} start official {stat} records in {season}.',
      'A new statistic gets a clear beginning in the archive.',
      'Earlier seasons remain unmeasured rather than assigned zeros.',
    ],
    'archive.franchise_lineage_split': [
      '{team} begin a separate history under the lineage agreement.',
      'The old records stay with {city}\'s retained franchise.',
      'The move creates two archive paths instead of one blended total.',
    ],
    'archive.vacated_title_marker': [
      '{team}\'s {season} title receives a vacated marker.',
      'The championship archive changes without inventing a new winner.',
      'The final ruling removes title credit from that season.',
    ],
    'archive.shared_record_exact': [
      '{player} and {other} share the {stat} record at {total}.',
      'The official totals leave no sole leader.',
      'The archive gives both players equal record credit.',
    ],
    'archive.rate_record_minimum_miss': [
      '{player}\'s {stat} rate misses the {minimum} eligibility floor.',
      'The best raw figure does not become the official record.',
      'The archive keeps the performance while enforcing the minimum.',
    ],
    'archive.season_length_context': [
      '{player} set the season {stat} total at {total}.',
      'The archive displays the longer schedule beside the new mark.',
      'The total record and the per-game comparison tell different parts of the story.',
    ],
    'archive.missing_boxscore_recovered': [
      'The archive restores {player}\'s missing box score from {game}.',
      'A verified game returns to the statistical ledger.',
      'The recovered page changes totals without creating a new performance.',
    ],
    'archive.team_identity_alias_merged': [
      'The archive joins {alias} to {team}\'s verified history.',
      'Two labels turn out to describe one franchise.',
      'The corrected identity map repairs the split ledger.',
    ],
    'archive.exhibition_record_flag': [
      '{player} reach {total} in {stat} during exhibition play.',
      'The performance enters the exhibition archive.',
      'The official competition record remains a separate ledger.',
    ],
    'legacy.hall_ballot_entry': [
      '{player} reach the Hall ballot after the {years}-year wait.',
      'The eligibility clock opens his candidacy.',
      'The career now enters a voting process rather than an automatic induction.',
    ],
    'legacy.hall_inducted': [
      '{player} join the Hall class of {class}.',
      'The certified vote turns his candidacy into induction.',
      'His career gains the institution\'s permanent recognition.',
    ],
    'legacy.hall_ballot_survival': [
      '{player} stay on the Hall ballot without entering the class.',
      'The vote keeps his candidacy alive.',
      'The next ballot still has a place for his career.',
    ],
    'legacy.hall_ballot_expiry': [
      '{player}\'s regular Hall ballot window closes.',
      'Future review moves to {committee}.',
      'The final ordinary vote ends one route, not every possible route.',
    ],
    'legacy.jersey_retirement_approved': [
      '{team} approve retiring {player}\'s number {number}.',
      'The number leaves future circulation under the club policy.',
      'A permanent banner honor follows the formal decision.',
    ],
    'legacy.active_number_grandfathered': [
      '{player} keep number {number} under {team}\'s transition policy.',
      'The retirement honors the number while grandfathering its current wearer.',
      'No new player can claim it after this assignment ends.',
    ],
    'legacy.banner_restored_display': [
      '{team} return the {season} banner to display.',
      'Conservation brings a piece of club history back into view.',
      'The existing honor gets a restored home, not a new title.',
    ],
    'legacy.founders_anniversary_game': [
      '{league} mark {years} years with an anniversary fixture.',
      'The celebration follows the league\'s verified founding date.',
      'One scheduled game becomes an occasion to revisit the institution\'s beginning.',
    ],
    'legacy.hall_coach_role_review': [
      '{coach} enter the Hall review on coaching merits.',
      'The nomination evaluates work on the bench.',
      'The committee opens the coaching record rather than a playing ballot.',
    ],
    'legacy.club_museum_acquisition': [
      '{team} add {artifact} to their history collection.',
      'The provenance check clears the museum\'s new acquisition.',
      'A piece of game history gains a documented permanent home.',
    ],
    'experiment.target_score_shorter_finish': [
      '{league}\'s target-score pilot finishes in {duration}.',
      'The winning threshold ends this test faster than the stored median.',
      'The pilot records a shorter finish, with the sample still limited.',
    ],
    'experiment.four_point_scoring_share': [
      'Four-point shots supply {share} of {league}\'s pilot scoring.',
      'The new zone\'s actual contribution reaches the evaluation table.',
      'The pilot counts points earned, not just attempts launched.',
    ],
    'experiment.single_free_throw_accounting': [
      '{player}\'s {makes} free-throw makes produce {points} points.',
      'The custom foul rule separates attempts from scoring value.',
      'The ledger counts both the shot and what it is worth.',
    ],
    'experiment.running_clock_time_saved': [
      '{league}\'s running-clock pilot saves {saved} against the baseline.',
      'The timing test clears its planned reduction threshold.',
      'The measured duration becomes evidence for the format review.',
    ],
    'experiment.no_foulout_finish': [
      '{player} finish legally with {fouls} fouls under the custom rules.',
      'The no-foulout preset keeps him eligible through the end.',
      'The reference limit is informational in this competition.',
    ],
    'experiment.penalty_carryover_served': [
      '{player} serve the tournament\'s accumulated-foul absence.',
      '{team} complete the required match without him.',
      'The carryover counter clears after the designated penalty.',
    ],
    'experiment.mercy_rule_completed': [
      '{team}\'s game ends under the mercy condition {condition}.',
      'The format closes the contest before its ordinary duration.',
      'The result is official within this preset and labeled shortened.',
    ],
    'experiment.player_veto_token_used': [
      '{team} spend their veto token against {rule}.',
      'The experimental fixture redraws its eligible ruleset.',
      'One choice is removed, and the team\'s token is gone.',
    ],
    'experiment.substitution_window_denial': [
      '{team} must wait until {window} for their requested substitution.',
      'The fixed-window rule rejects the ordinary change.',
      'The roster remains as registered until the next legal window.',
    ],
    'experiment.score_reset_round': [
      '{team} win {segments} segments to take the exhibition.',
      'The reset format rewards segment wins instead of aggregate points.',
      'The total scoring ledger and the match winner follow different columns.',
    ],
    'world.duplicate_player_version_blocked': [
      '{team} cannot add the {season} version of {player}.',
      'The identity rule blocks a second version of the same person.',
      'The draft slot stays open for an eligible alternative.',
    ],
    'world.duplicate_versions_allowed_meeting': [
      '{player}\'s {first} and {second} versions meet in the custom fixture.',
      'The two season profiles share an identity but keep separate rosters.',
      'The time-crossing matchup is legal in this sandbox.',
    ],
    'world.retirement_age_override_path': [
      '{player} remain active at {age} under the custom longevity settings.',
      'The old forced-retirement boundary no longer closes his career.',
      'Availability still depends on the simulation\'s current player state.',
    ],
    'world.era_translation_uncertainty': [
      '{player}\'s era-adjusted estimate spans {range}.',
      'The comparison displays uncertainty instead of false precision.',
      'Missing historical inputs widen the model\'s answer.',
    ],
    'world.ruleset_portability_failure': [
      '{player}\'s profile needs translation for {rule}.',
      'The mixed-era roster pauses at a rules compatibility check.',
      'The player can enter once the chosen mapping is declared.',
    ],
    'world.replay_same_seed_verified': [
      '{scenario} reproduce the saved simulation exactly.',
      'The replay matches its original result checksum.',
      'The audit confirms the same inputs follow the same path.',
    ],
    'world.forked_history_diverges': [
      'The fork of {season} diverges after {change}.',
      'The alternate timeline now has its first distinct state.',
      'The original history remains available beside the branch.',
    ],
    'world.same_roster_era_test': [
      '{team} complete the {first} and {second} era trials.',
      'One locked roster meets two different basketball environments.',
      'The report compares the trials without changing the source team.',
    ],
    'world.generated_descendant_identity': [
      '{player} enter the fictional world with a link to {ancestor}.',
      'The successor profile belongs to this generated timeline.',
      'The lineage is a simulation setting, not a historical claim.',
    ],
    'world.uniform_current_assignment': [
      '{player} appear in {team}\'s current colors as number {number}.',
      'The historic profile now wears its actual custom-roster assignment.',
      'The career source stays intact while the team identity updates.',
    ],
    'challenge.homegrown_title_verified': [
      '{team} complete the homegrown championship challenge.',
      'Every registered title player entered through the club.',
      'The trophy and the roster provenance both pass the challenge audit.',
    ],
    'challenge.homegrown_roster_violation': [
      '{team}\'s homegrown challenge ends when {player} join.',
      'The roster remains legal for ordinary competition.',
      'The provenance condition no longer matches the challenge.',
    ],
    'challenge.no_trade_season_complete': [
      '{team} complete {season} without a trade.',
      'The no-trade challenge survives the entire configured schedule.',
      'The roster plan reaches the finish without a trading shortcut.',
    ],
    'challenge.minimum_budget_qualifier': [
      '{team} qualify while staying below {cap}.',
      'The budget challenge clears both spending and qualification tests.',
      'The club meets its sporting goal without exceeding the declared limit.',
    ],
    'challenge.one_nation_roster_audit': [
      '{team} complete the roster challenge for {eligibility}.',
      'Every registered player satisfies the chosen sporting-eligibility rule.',
      'The season audit confirms the challenge pool stayed intact.',
    ],
    'challenge.random_gm_decision_accepted': [
      '{team} accept the random management choice: {decision}.',
      'The seeded draw picks from the valid decision menu.',
      'The custom front office follows its agreed chance-based rule.',
    ],
    'challenge.random_gm_no_legal_option': [
      '{team}\'s random front office has no legal move to draw.',
      'The decision becomes a pass rather than a broken roster.',
      'The constraint validator keeps the challenge within its rules.',
    ],
    'challenge.rebuild_deadline_met': [
      '{team} reach {target} within {seasons} seasons.',
      'The rebuild challenge clears its declared deadline.',
      'The final audit compares the result with the saved starting state.',
    ],
    'challenge.expansion_win_floor_missed': [
      '{team} miss the expansion challenge target of {target}.',
      'The first campaign finishes below the declared win-rate floor.',
      'The challenge fails while the franchise can keep building.',
    ],
    'challenge.manual_intervention_breaks_run': [
      '{team}\'s autopilot challenge stops qualifying after {edit}.',
      'The manual intervention changes the run\'s declared conditions.',
      'The save continues with the challenge marked incomplete.',
    ],
    'expansion.protection_list_lock': [
      '{team} lock {count} protected roster places.',
      'The expansion list closes before selection begins.',
      'The club\'s unprotected pool now follows the published allocation rules.',
    ],
    'expansion.invalid_protection_overflow': [
      '{team}\'s protection list exceeds the {limit}-player limit.',
      'The submission must shrink before it can lock.',
      'The expansion process rejects the invalid list before selections begin.',
    ],
    'expansion.player_consent_declined': [
      '{player} decline the expansion transfer under the consent clause.',
      '{team} retain him after the permitted refusal.',
      'The selection cannot close without the contract\'s required agreement.',
    ],
    'expansion.club_loss_limit_reached': [
      '{team} reach the expansion loss limit of {limit}.',
      'Their remaining eligible players leave the selection pool.',
      'The published club-loss cap now protects the rest of the roster.',
    ],
    'expansion.pick_compensation_settled': [
      '{team} receive {asset} as expansion compensation.',
      'The allocation rule transfers the promised draft asset.',
      'The club\'s selection loss gets its specified remedy.',
    ],
    'expansion.extra_roster_grace_expired': [
      '{team} return to the ordinary {limit}-player roster limit.',
      'The expansion grace period ends on its published date.',
      'The registration list clears the standard-size check.',
    ],
    'expansion.conference_assignment_certified': [
      '{team} join {conference} under the expansion alignment.',
      'The new franchise gets its place in the league map.',
      'The certified assignment completes the conference structure.',
    ],
    'expansion.launch_capacity_shortfall': [
      '{team} launch with an approved capacity of {capacity}.',
      'The original attendance plan yields to the licensed venue limit.',
      'The club can open with a smaller first-phase crowd.',
    ],
    'expansion.number_of_teams_lottery_resize': [
      '{league}\'s {teams}-team field produces {eligible} lottery entrants.',
      'The draw resizes to the actual competition.',
      'The allocation follows configured eligibility rather than an old fixed team count.',
    ],
    'expansion.first_operating_surplus': [
      '{team} post their first operating surplus of {amount}.',
      'The expansion balance sheet moves above break-even.',
      'The audited year gives the new club a positive operating result.',
    ],
    'identity.final_old_venue_fixture': [
      '{team} complete their final scheduled home game at {arena}.',
      'The approved move reaches the old venue\'s closing fixture.',
      'The farewell game enters the club\'s venue history.',
    ],
    'identity.lease_exit_payment': [
      '{team} settle the {amount} lease exit payment.',
      'The old venue agreement closes under its published terms.',
      'The move carries a verified cost before the first new-city game.',
    ],
    'identity.local_ticket_refunds_complete': [
      '{team} complete the eligible ticket refunds in {city}.',
      'The old-city prepaid dates receive their promised remedy.',
      'The ticket ledger closes with every qualified claim paid.',
    ],
    'identity.transitional_home_ground': [
      '{team} use {arena} for their first {games} home dates.',
      'The new-city start gets a temporary court.',
      'The permanent arena remains a later step in the approved plan.',
    ],
    'identity.color_palette_current_snapshot': [
      '{team}\'s current roster moves to the {palette} palette.',
      'The new colors follow today\'s team identity.',
      'Old season snapshots keep the colors they actually used.',
    ],
    'identity.retired_number_import_collision': [
      '{player}\'s imported number {number} is retired by {team}.',
      'The historic profile needs a current available jersey assignment.',
      'The source number stays in history without overriding the destination policy.',
    ],
    'identity.finals_bracket_snapshot_updated': [
      'The Finals presentation pairs {team} with {opp}.',
      'The current bracket supplies both finalists.',
      'The championship scene updates to the teams actually competing.',
    ],
    'identity.renamed_team_record_search': [
      '{team}\'s records remain searchable under {oldname}.',
      'The name changes without splitting the franchise ledger.',
      'The historical index links both identities to one club.',
    ],
    'identity.moved_city_banner_terms': [
      '{team} leave {banners} banners in {city} under the agreement.',
      'The display stays behind while the title ledger keeps its assigned owner.',
      'The move separates physical artifacts from sporting credit.',
    ],
    'identity.return_city_application': [
      '{city} apply for a new franchise through {group}.',
      'The return effort reaches the official application stage.',
      'The league has a filed proposal, with approval still undecided.',
    ],
    'governance.board_quorum_failure': [
      '{team}\'s board cannot reach the {quorum}-member quorum.',
      'The spending proposal waits without a valid vote.',
      'An empty seat has an immediate governance consequence.',
    ],
    'governance.supermajority_project_block': [
      '{team}\'s project falls short of the {threshold} approval threshold.',
      'A majority is not enough under the club charter.',
      'The proposal fails the actual voting rule.',
    ],
    'governance.chair_casting_vote': [
      '{team}\'s tied board vote resolves as {decision}.',
      'The chair uses the charter\'s casting-vote power.',
      'The final decision follows the tie procedure rather than an ordinary majority.',
    ],
    'governance.owner_budget_veto': [
      '{team}\'s extra {amount} spending proposal meets the owner veto.',
      'Board approval does not clear the reserved spending power.',
      'The original budget stays in force.',
    ],
    'governance.sporting_autonomy_charter': [
      '{team}\'s sporting charter blocks an ownership override of {decision}.',
      'The delegated authority holds on its first contested decision.',
      'The owner cannot substitute a preference for the approved decision holder.',
    ],
    'governance.supporter_seat_first_vote': [
      '{team}\'s supporter seat casts its first binding vote on {issue}.',
      'The representative moves from election to a recorded decision.',
      'The fan seat now appears in the certified tally.',
    ],
    'governance.rotation_delegate_changed': [
      '{delegate} cast {team}\'s first vote of the new term.',
      'The scheduled representative rotation takes effect.',
      'The league register updates who can speak for the club.',
    ],
    'governance.commissioner_term_limit': [
      '{league} open succession at the {term} term limit.',
      'The charter closes another route to extending the incumbent.',
      'The selection process begins with authority bounded by the existing term.',
    ],
    'governance.resolution_sunset': [
      '{team}\'s temporary {policy} policy expires.',
      'The sunset date restores the standing arrangement.',
      'The board would need a new resolution to keep the temporary terms.',
    ],
    'governance.remote_vote_credential_rejected': [
      '{team}\'s remote ballot fails the credential check.',
      'The tally stays uncertified until an authorized vote arrives.',
      'The system rejects the submission without inferring anyone\'s motive.',
    ],
    'budget.revenue_share_threshold': [
      '{team} receive {amount} under the revenue-sharing threshold.',
      'The audited pool activates the published transfer.',
      'The budget gains an amount the distribution formula actually supports.',
    ],
    'budget.playoff_profit_reconciled': [
      '{team}\'s playoff run adds a net {amount} to operations.',
      'The event costs are counted before the postseason profit.',
      'The final ledger replaces the ticket-revenue forecast.',
    ],
    'budget.sellout_loses_money': [
      '{team}\'s sellout still records a {loss} event loss.',
      'Every seat sells, but the expense ledger wins.',
      'Attendance success does not clear this game\'s operating costs.',
    ],
    'budget.reserve_floor_locks_project': [
      '{team}\'s project cannot cross the {floor} reserve floor.',
      'The cash safeguard stops the new commitment.',
      'The club must revise funding before work is authorized.',
    ],
    'budget.ticket_freeze_renewal_gain': [
      '{team}\'s price-freeze renewal rate reaches {rate}.',
      'The closed window beats the stored renewal baseline.',
      'The club gains a measured result from its affordability choice.',
    ],
    'budget.ticket_hike_capacity_loss': [
      '{team}\'s ticket plan finishes {shortfall} below forecast.',
      'The higher price meets a smaller paying crowd than projected.',
      'The completed ledger misses the plan without proving one sole cause.',
    ],
    'budget.local_rights_expiry_gap': [
      '{team} face {games} games without contracted local-rights income.',
      'The old agreement expires before a replacement is signed.',
      'The budget loses a revenue line while distribution remains a separate decision.',
    ],
    'budget.cooperative_purchasing_savings': [
      '{league}\'s joint purchase saves {saved}.',
      'The shared equipment order beats the previous unit cost.',
      'Cooperation lowers operations spending without changing rosters.',
    ],
    'budget.prize_payment_delay': [
      '{team}\'s {amount} prize payment moves to {date}.',
      'The honor stays recorded while the cash arrives later.',
      'The revised payment date changes the short-term budget.',
    ],
    'budget.training_spend_tradeoff': [
      '{team} move {amount} from marketing into development.',
      'The approved budget funds one priority by trimming another.',
      'The reallocation changes resources without promising player improvement.',
    ],
    'facility.second_court_overbooked': [
      '{team} resolve a practice-court clash involving {unit}.',
      'The corrected booking gives both units their own space.',
      'One court cannot host two full sessions at once.',
    ],
    'facility.recovery_room_capacity': [
      '{team} add {slots} routine recovery appointments.',
      'The facility schedule expands to meet its documented queue.',
      'Care decisions stay with qualified staff while access improves.',
    ],
    'facility.simultaneous_youth_priority': [
      '{team} move practice around the protected {time} community slot.',
      'The venue charter keeps its youth-access promise.',
      'The professional schedule yields within the shared-use agreement.',
    ],
    'facility.energy_retrofit_verified': [
      '{team}\'s retrofit cuts measured energy use by {reduction}.',
      'The adjusted meter comparison clears the efficiency target.',
      'The facility gets a verified result beyond its construction promise.',
    ],
    'facility.sound_treatment_compliant': [
      '{arena} pass the revised noise test at {limit}.',
      'The treatment clears the venue\'s imposed sound restriction.',
      'The event plan can use the newly certified limits.',
    ],
    'facility.practice_site_distance_cost': [
      '{team}\'s cheaper practice lease saves no net operating money.',
      'Added travel consumes the projected {amount} rent savings.',
      'The full cost ledger changes the facility decision\'s value.',
    ],
    'facility.floor_surface_recertified': [
      '{arena} regain court certification after resurfacing.',
      'The test results clear the new playing surface.',
      'The venue returns under the verified court standards.',
    ],
    'facility.storage_inventory_failure': [
      '{team} secure a loan of the missing {item}.',
      'The setup audit finds the inventory gap before the fixture.',
      'The approved replacement lets the event proceed.',
    ],
    'facility.access_route_test_pass': [
      '{arena} pass the usability test for {route}.',
      'The revised route meets its stated access requirements.',
      'The venue can publish verified access information for guests.',
    ],
    'facility.temporary_capacity_reduction': [
      '{team} remove {seats} seats from sale for {games} fixtures.',
      'The renovation changes the licensed ticket inventory.',
      'The smaller crowd limit is published before tickets go out.',
    ],
    'admin.cap_projection_revised': [
      '{league} revise the next-season cap to {cap}.',
      'The certified revenue estimate replaces the early projection.',
      'Front offices now plan against the announced limit.',
    ],
    'admin.hard_cap_registration_block': [
      '{team}\'s registration fails the hard-cap check by {amount}.',
      'The roster addition cannot become active under the present limit.',
      'The front office needs a lawful cap adjustment first.',
    ],
    'admin.salary_floor_trueup': [
      '{team} pay the {amount} salary-floor adjustment.',
      'The season-end ledger activates the agreement\'s minimum-spend remedy.',
      'The true-up closes the shortfall without inventing new contracts.',
    ],
    'admin.bonus_cap_reclassification': [
      '{player}\'s bonus becomes {status} on {team}\'s cap ledger.',
      'The accounting category follows the certified performance test.',
      'The contract remains unchanged while projected cap charges move.',
    ],
    'admin.tax_band_reached': [
      '{team}\'s final payroll reaches tax band {band}.',
      'The progressive formula adds its specified charge.',
      'The tax calculation follows the completed salary ledger.',
    ],
    'admin.cap_rule_grandfather_contract': [
      '{team} retain the prior cap treatment for {player}\'s contract.',
      'The agreement\'s grandfather clause applies to the existing deal.',
      'Future contracts follow the new rule; this one keeps its protected accounting.',
    ],
    'admin.registration_window_late': [
      '{team} cannot activate {player} until {date}.',
      'The paperwork is valid but arrives outside the window.',
      'The roster must wait for the next permitted registration period.',
    ],
    'admin.cross_league_clearance_received': [
      '{player} receive the clearance needed to register with {team}.',
      'Both competition registries complete the sporting transfer check.',
      'The administrative barrier clears without a new contract announcement.',
    ],
    'admin.escrow_team_reconciliation': [
      '{team}\'s collective settlement adjusts by {amount}.',
      'The certified reconciliation closes the team\'s escrow ledger.',
      'The league-accounting result replaces the provisional balance.',
    ],
    'admin.development_affiliate_eligibility': [
      '{player} become eligible for recall by {team}.',
      'The affiliate record clears the required activation conditions.',
      'A permitted route opens, with the roster decision still ahead.',
    ],
    'frontoffice.dual_approval_deadlock': [
      '{coach} and {gm} leave {team}\'s proposal without joint approval.',
      'The required second signature never arrives.',
      'The front-office structure blocks the move before execution.',
    ],
    'frontoffice.authority_split_resolved': [
      '{team} divide decision authority between {gm} and {coach}.',
      'The revised charter resolves the repeated approval bottleneck.',
      'Each sporting decision now has a named accountable role.',
    ],
    'frontoffice.draft_clock_fallback': [
      '{team}\'s fallback list selects {player} as the clock expires.',
      'The preapproved ranking keeps the missed decision from becoming an empty slot.',
      'The pick follows the recorded contingency policy.',
    ],
    'frontoffice.scout_disagreement_logged': [
      '{team} order a third assessment of {player}.',
      'The first two scouting evaluations conflict beyond the review threshold.',
      'The decision waits for another documented look.',
    ],
    'frontoffice.scout_region_uncovered': [
      '{team}\'s scouting map leaves {region} uncovered.',
      'The vacant assignment creates a documented information gap.',
      'The front office must fill the role or accept the blind spot.',
    ],
    'frontoffice.data_purchase_low_coverage': [
      '{team}\'s scouting dataset initially covers only {coverage}.',
      'The coverage audit prompts a corrected delivery.',
      'The office receives the promised information after the gap is documented.',
    ],
    'frontoffice.assistant_noncompete_cleared': [
      '{coach} become eligible to join {team}\'s staff.',
      'The recorded restriction period expires before the appointment.',
      'The hiring route opens without breaching the prior agreement.',
    ],
    'frontoffice.staff_budget_role_choice': [
      '{team} fund {role} and leave {other} vacant.',
      'The staffing budget forces an explicit priority.',
      'One capability gains resources while the other remains a gap.',
    ],
    'frontoffice.coach_certification_lapse': [
      '{coach} pause regulated bench duties with {team}.',
      'The required credential expires before renewal is recorded.',
      'The club must use an eligible staff assignment for now.',
    ],
    'frontoffice.succession_shadow_completed': [
      '{successor} complete {team}\'s executive shadow program.',
      'The board certifies readiness without changing today\'s authority.',
      'The succession plan gains a prepared candidate, not an automatic appointment.',
    ],
    'education.major_switch': [
      '{player} changes his academic route to {major}.',
      'The classroom plan takes a new direction for {player}.',
      'A different major changes what {player} must finish.',
    ],
    'education.capstone_defense_pass': [
      '{player} passes his capstone defense at {school}.',
      'The final project survives the questions for {player}.',
      '{school} sign off on {player}\'s capstone work.',
    ],
    'education.class_presentation_conflict': [
      '{player} chooses the classroom presentation over the microphone.',
      'The optional interview gives way to {player}\'s assessed work.',
      'An academic deadline takes priority on {player}\'s calendar.',
    ],
    'education.incomplete_course_plan': [
      '{player} receives an approved completion plan for {course}.',
      'The coursework remains unfinished, but {player} has a deadline.',
      '{school} put {player}\'s remaining assignment on a written timetable.',
    ],
    'education.remote_degree_enrollment': [
      '{player} starts a remote degree in {subject}.',
      'The road schedule now includes coursework for {player}.',
      'A new classroom fits inside {player}\'s travel routine.',
    ],
    'education.graduation_ceremony_choice': [
      '{player} chooses to attend his graduation ceremony.',
      'The gown gets a place on {player}\'s calendar.',
      'A completed degree receives a personal celebration from {player}.',
    ],
    'education.research_publication': [
      '{player}\'s research paper earns publication.',
      'Peer review opens a new audience for {player}.',
      'The byline belongs to {player}; the subject is {subject}.',
    ],
    'education.lab_team_role': [
      '{player} completes his part of {school}\'s research project.',
      'The academic team gets its assigned work from {player}.',
      'A project milestone puts {player}\'s classroom contribution on record.',
    ],
    'education.tutoring_appointment_kept': [
      '{player} completes his tutoring attendance plan.',
      'The study routine holds through {player}\'s crowded calendar.',
      '{subject} gets consistent time from {player}.',
    ],
    'education.gap_term_declared': [
      '{player} takes an approved academic leave term.',
      'The degree clock pauses under {school}\'s agreed plan.',
      '{player} sets a date to revisit his coursework.',
    ],
    'campus.dorm_roommate_agreement': [
      '{player} and {roommate} agree a dorm-room routine.',
      'Two schedules find common ground in {player}\'s room.',
      'The roommate agreement gives {player}\'s campus life clearer boundaries.',
    ],
    'campus.student_club_election': [
      '{player}\'s student-club election ends with {result}.',
      'The campus ballot delivers {result} for {player}.',
      'Basketball fame does not replace the vote in {player}\'s club race.',
    ],
    'campus.campus_radio_shift': [
      '{player} completes his first campus-radio shift.',
      'The microphone belongs to {player} for a different reason.',
      'Student radio puts {player} on the air.',
    ],
    'campus.exchange_term_approved': [
      '{player} receives approval for an exchange term in {destination}.',
      'A new campus becomes part of {player}\'s education plan.',
      '{school} clear the educational exchange on {player}\'s calendar.',
    ],
    'campus.housing_lottery_result': [
      '{player}\'s housing lottery assigns {residence}.',
      'The campus draw, rather than the roster, decides {player}\'s room.',
      'A housing allocation gives {player} a new campus address.',
    ],
    'campus.study_group_boundary': [
      '{player}\'s study group agrees to keep basketball confidences private.',
      'Coursework stays coursework under {player}\'s new group rule.',
      'The study table is not a scouting desk for {player}.',
    ],
    'campus.intramural_spectator_role': [
      '{player} takes a seat as a campus spectator.',
      'For once, the campus game asks {player} only to cheer.',
      'The recreational team gets support from {player}, not a roster addition.',
    ],
    'campus.student_orientation_guide': [
      '{player} helps new students find their way around {school}.',
      'The campus map becomes {player}\'s assignment.',
      'New arrivals meet {player} as an orientation guide.',
    ],
    'campus.recruit_visit_host': [
      '{player} hosts {visitor}\'s permitted campus visit.',
      'The tour ends without a commitment being assumed.',
      '{school} put {player} on welcome duty for {visitor}.',
    ],
    'campus.amateur_roster_refusal': [
      '{player} declines the roster offer from {team}.',
      'Education takes priority in {player}\'s next chapter.',
      'The offered uniform stays unworn after {player}\'s decision.',
    ],
    'household.chore_rotation': [
      '{player} joins a household chore rotation.',
      'The schedule at home has assignments for {player} too.',
      'Shared living gets a clearer division of work.',
    ],
    'household.roommate_move_out': [
      '{roommate} moves out of {player}\'s shared home.',
      'The household changes without a feud being assumed.',
      '{player}\'s home routine loses a familiar roommate.',
    ],
    'household.guest_stay_limit': [
      '{player}\'s household sets a clear guest-stay limit.',
      'The welcome mat now comes with an agreed timetable.',
      'Home gets a practical visitor boundary around {player}.',
    ],
    'household.quiet_space_agreement': [
      '{player}\'s household agrees a quiet-space schedule.',
      'One room gets a calmer purpose at home.',
      'The shared floor plan makes room for {player}\'s study time.',
    ],
    'household.relative_school_pickup': [
      '{player} completes an agreed family pickup routine.',
      'The family calendar gets a dependable contribution from {player}.',
      'A week of shared responsibility ends with the plan kept.',
    ],
    'household.care_rotation_handoff': [
      '{player}\'s family agree a new care-duty rotation.',
      'A shared responsibility changes hands under an agreed plan.',
      'The caregiving calendar gets a coordinated handoff.',
    ],
    'household.homecoming_host': [
      '{player} takes charge of the family gathering.',
      'The basketball calendar now shares space with hosting duties.',
      'A family occasion has {player} handling the arrangements.',
    ],
    'household.shared_meal_pact': [
      '{player}\'s household keeps its shared-meal agreement.',
      'A regular table becomes part of {player}\'s home routine.',
      'The first month of planned meals brings the household together.',
    ],
    'household.personal_room_repurpose': [
      '{player}\'s unused room becomes shared household space.',
      'A personal corner gets a collective purpose.',
      'The home layout changes with the household\'s agreement.',
    ],
    'household.family_archive_sort': [
      '{player} helps organize the family archive.',
      'The photographs find order without losing their privacy.',
      'A shared project gives {player}\'s household its history back in sequence.',
    ],
    'friendship.old_friend_visit': [
      '{player} makes time for an old friend.',
      'The visit is personal rather than promotional.',
      'A familiar friendship gets a place on {player}\'s calendar.',
    ],
    'friendship.group_trip_choice': [
      '{player} passes on the group trip.',
      'An existing promise takes priority over the invitation.',
      'The travel plan goes ahead without {player}.',
    ],
    'friendship.nonbasketball_pact': [
      '{player}\'s friends agree to leave basketball outside one gathering.',
      'The game gets a night off in {player}\'s social circle.',
      'A shared boundary creates room for other conversations.',
    ],
    'friendship.friend_project_help': [
      '{player} keeps a promise on {friend}\'s project.',
      'The help arrives as work rather than a cheque.',
      'A friend\'s project gets the contribution {player} agreed to provide.',
    ],
    'friendship.apology_accepted': [
      '{player} and {friend} resolve a scheduling disagreement.',
      'An accepted apology opens a better conversation.',
      'The friendship gets a clear repair, not a guessed reconciliation.',
    ],
    'friendship.group_host_rotation': [
      '{player}\'s friend group agrees to share hosting duties.',
      'The gathering has more than one organizer now.',
      'A rotation takes the social workload off a single person.',
    ],
    'friendship.childhood_reunion_declined': [
      '{player} declines the reunion invitation.',
      'An old chapter stays closed by choice.',
      'The familiar invitation does not become a new commitment.',
    ],
    'friendship.new_city_peer_circle': [
      '{player} joins a local peer group in {city}.',
      'A new city offers company beyond the roster.',
      'The introduction begins with shared interests rather than highlights.',
    ],
    'friendship.friend_milestone_attendance': [
      '{player} makes time for {friend}\'s milestone celebration.',
      'The occasion belongs to a friend, and {player} shows up.',
      'A personal invitation receives a kept commitment.',
    ],
    'friendship.inner_circle_redefined': [
      '{player} changes the size of his private travel circle.',
      'A smaller guest list sets a new personal boundary.',
      'Access changes without a public accusation against anyone.',
    ],
    'mentorship.offcourt_mentor_selected': [
      '{player} chooses {mentor} as an off-court mentor.',
      'The career gets a sounding board beyond the team staff.',
      'An agreed mentorship gives {player} a regular place to think.',
    ],
    'mentorship.reverse_tech_lesson': [
      '{player} helps {mentor} master {task}.',
      'The usual advice route runs in the other direction.',
      'The mentor finishes the lesson as the learner.',
    ],
    'mentorship.advice_declined_respectfully': [
      '{player} takes a different path from {mentor}\'s advice.',
      'The disagreement leaves the mentorship intact.',
      'An independent decision does not require a broken relationship.',
    ],
    'mentorship.mentor_retreat': [
      '{player} completes a reflection retreat with {mentor}.',
      'The career plan gets a quieter setting.',
      'Time away is used to examine the next direction.',
    ],
    'mentorship.peer_buddy_match': [
      '{player} becomes {newcomer}\'s off-court orientation partner.',
      'The new arrival gets a practical guide to team life.',
      '{team} assign a welcome role rather than a coaching role.',
    ],
    'mentorship.boundaries_reset': [
      '{player} and {mentor} reset their advice boundaries.',
      'One subject leaves the agenda without ending the relationship.',
      'The mentorship continues under a clearer agreement.',
    ],
    'mentorship.formal_program_completed': [
      '{player} completes {program}\'s mentorship curriculum.',
      'The mentoring role gains a formal foundation.',
      'Attendance and assignments put the completion on record.',
    ],
    'mentorship.mentee_independence': [
      '{mentee} completes the regular mentorship with {player}.',
      'The meetings end because independence has grown.',
      'A mentoring relationship closes on its own agreed terms.',
    ],
    'mentorship.multi_mentor_conflict': [
      '{player} chooses a direction after conflicting advice.',
      'Two perspectives lead to one deliberate decision.',
      'The mentors disagree; {player} still has to choose.',
    ],
    'mentorship.thank_you_private': [
      '{player} keeps his mentor tribute private.',
      'The thank-you reaches its recipient without a campaign.',
      'A personal gesture stays personal by design.',
    ],
    'partnership.shared_calendar': [
      '{player} and his partner agree a shared calendar.',
      'Personal time gets a place beside basketball time.',
      'The relationship receives a practical scheduling plan.',
    ],
    'partnership.public_visibility_choice': [
      '{player} and his partner choose a quieter public profile.',
      'Fewer joint appearances do not mean a breakup.',
      'The couple set a public-visibility boundary together.',
    ],
    'partnership.professional_independence': [
      '{player} and his partner separate their professional profiles.',
      'Shared life no longer means shared representation.',
      'The relationship stays intact while career boundaries change.',
    ],
    'partnership.anniversary_reschedule': [
      '{player} and his partner keep their rescheduled celebration.',
      'A changed date does not become a lost promise.',
      'The anniversary plan finds its agreed second slot.',
    ],
    'partnership.future_home_deadlock': [
      '{player} and his partner pause their future-home decision.',
      'Two preferred locations leave one plan unresolved.',
      'The home question stays open by mutual acknowledgment.',
    ],
    'partnership.separate_hobby_weekend': [
      '{player} and his partner try a weekend of separate interests.',
      'The plans diverge without the relationship doing so.',
      'Independent hobbies get space in a shared life.',
    ],
    'partnership.support_project_repaid': [
      '{player} returns support through his partner\'s project.',
      'The promise becomes a completed contribution.',
      'A shared relationship gets a two-way investment of time.',
    ],
    'partnership.interview_boundary': [
      '{player} and his partner set a boundary on future-plan questions.',
      'The public projects remain open; private plans stay private.',
      'The interview agreement draws a clear line together.',
    ],
    'partnership.home_role_negotiation': [
      '{player} and his partner agree a new division of household work.',
      'A shared home gets clearer responsibilities.',
      'The arrangement changes through agreement rather than assumption.',
    ],
    'partnership.breakup_mutual_statement': [
      '{player} and his partner announce their relationship has ended.',
      'The joint statement confirms the separation without assigning blame.',
      'Future plans change after a mutually acknowledged breakup.',
    ],
    'identity.pronunciation_guide': [
      '{player} publishes the pronunciation he wants used.',
      'The introduction gets an answer directly from its subject.',
      'The name guide gives announcers a clearer standard.',
    ],
    'identity.chosen_nickname': [
      '{player} adopts the nickname {nickname}.',
      'A chosen name joins the public introduction.',
      'The new nickname comes from {player}, not the rumor mill.',
    ],
    'identity.nickname_retired': [
      '{player} retires the nickname {nickname}.',
      'The old label leaves the current introduction.',
      'A familiar nickname becomes part of the past.',
    ],
    'identity.public_values_statement': [
      '{player} shares why {value} matters to him.',
      'The public statement gives a value his own words.',
      'A personal principle becomes part of the approved profile.',
    ],
    'identity.noncareer_introduction': [
      '{player} chooses a different first line for his introduction.',
      'Basketball takes the second sentence at {event}.',
      'The host leads with the work {player} requested.',
    ],
    'identity.style_signature_abandoned': [
      '{player} retires his familiar {item}.',
      'The signature look changes by choice.',
      'A recognizable accessory leaves {player}\'s routine.',
    ],
    'identity.handwritten_manifesto': [
      '{player} shares selected passages from his goals notebook.',
      'The handwriting makes the priorities personal.',
      'Only the approved pages enter the public conversation.',
    ],
    'identity.heritage_story_approved': [
      '{player} approves a family-history chapter for his profile.',
      'The story reaches the public with the family\'s consent.',
      'An authorized heritage account adds context to the career.',
    ],
    'identity.public_label_declined': [
      '{player} asks reporters to stop using {label}.',
      'The public label loses the subject\'s consent.',
      'A clearer boundary changes how {player} wants to be described.',
    ],
    'identity.authored_biography_control': [
      '{player}\'s authorized profile waits for factual revisions.',
      'The subject asks the biography to get the details right.',
      'The publisher agrees to correct the approved life account.',
    ],
    'creative.gallery_opening': [
      '{player}\'s artwork opens at {gallery}.',
      'The career gets a wall outside the arena.',
      'A curated exhibition puts {player}\'s creative work on display.',
    ],
    'creative.stage_audition_rejection': [
      '{player}\'s stage audition ends without a role.',
      'The casting decision sends the project in another direction.',
      'The theater dream meets a real audition result.',
    ],
    'creative.stage_debut_completed': [
      '{player} completes his debut in {production}.',
      'The stage appearance moves from rehearsal to a credited performance.',
      'A different kind of audience sees {player} finish the role.',
    ],
    'creative.poetry_reading': [
      '{player} reads his own poetry at {event}.',
      'The microphone carries verse rather than basketball answers.',
      'An original reading gives {player} a different public voice.',
    ],
    'creative.film_edit_locked': [
      '{player} submits {film} to {festival}.',
      'The short film leaves the editing room for a selection process.',
      'A finished cut gives the project a real next step.',
    ],
    'creative.festival_selection': [
      '{festival} select {player}\'s film {film}.',
      'The submitted project earns a place in the program.',
      'Selection gives the finished film an audience, not an automatic trophy.',
    ],
    'creative.band_rehearsal_commitment': [
      '{player} completes his first rehearsal run with {ensemble}.',
      'The new team uses instruments rather than a basketball.',
      'An agreed music commitment makes it through the calendar.',
    ],
    'creative.writing_manuscript_finished': [
      '{player} finishes the manuscript for {title}.',
      'The last page turns a side project into a completed draft.',
      'A fictional story reaches its first full ending.',
    ],
    'creative.public_art_collaboration': [
      '{player} and {artist} complete {installation}.',
      'The approved design takes its place in public space.',
      'A collaboration finishes beyond the basketball floor.',
    ],
    'creative.comedy_open_mic': [
      '{player} completes an open-mic set at {venue}.',
      'The jokes make it from the notebook to the stage.',
      'A microphone appearance has a different assignment for {player}.',
    ],
    'hobby.model_train_layout': [
      '{player} finishes his miniature railway layout.',
      'The smallest route in his schedule is finally complete.',
      'A hobby-club demonstration gives the model its first audience.',
    ],
    'hobby.birdwatching_checklist': [
      '{player} completes the local birdwatching checklist.',
      'The sightings get verified one species at a time.',
      'A quiet hobby reaches a documented milestone.',
    ],
    'hobby.puzzle_competition_finish': [
      '{player} finishes {place} in {event}.',
      'The puzzle clock produces an official result.',
      'A different contest gives {player} a place in the standings.',
    ],
    'hobby.pottery_first_firing': [
      '{player}\'s first pottery piece survives the kiln.',
      'The finished work gets a place at home.',
      'A hands-on lesson leaves something solid behind.',
    ],
    'hobby.amateur_theatre_crew': [
      '{player} completes backstage work on {production}.',
      'The show gets help without putting him in the spotlight.',
      'A theater crew assignment reaches the final curtain.',
    ],
    'hobby.boardgame_design_test': [
      '{player}\'s board-game prototype completes its first test session.',
      'The table finds the rules that need work.',
      'A hobby invention receives feedback rather than automatic praise.',
    ],
    'hobby.collection_catalogued': [
      '{player} completes the catalog of his {collection}.',
      'The collection gets an organized record.',
      'Personal objects become a documented hobby archive.',
    ],
    'hobby.urban_sketch_route': [
      '{player} completes his sketching route through {city}.',
      'A notebook follows the city beyond the arena.',
      'The route ends with drawings rather than a score.',
    ],
    'hobby.community_quiz_team': [
      '{player}\'s quiz team record {result}.',
      'The questions, rather than the rim, decide this contest.',
      'A new team experience ends with an official result.',
    ],
    'hobby.no_clock_day': [
      '{player} completes an approved day without checking the clock.',
      'The time experiment ends with every required appointment kept.',
      'One ordinary day follows a deliberately unusual routine.',
    ],
    'fan.letter_reply_project': [
      '{player} completes his fan-letter reply project.',
      'The replies reach people who took time to write.',
      'A stack of letters receives individual attention.',
    ],
    'fan.supporter_book_club': [
      '{player}\'s supporter book club completes its first discussion.',
      'The shared topic is {book}, rather than the box score.',
      'A reading group gives fans another way to connect.',
    ],
    'fan.accessible_meetup_feedback': [
      '{player}\'s fan meetup receives its accessibility review.',
      'The next gathering has concrete feedback to use.',
      'The event is assessed by the people it was meant to welcome.',
    ],
    'fan.supporter_skill_exchange': [
      '{player} exchanges {skill} lessons with supporters.',
      'The event has learners on both sides of the table.',
      'A fan meeting becomes a two-way workshop.',
    ],
    'fan.fan_art_jury_choice': [
      '{player} helps select work for {exhibition}.',
      'The fan-art display follows its announced judging process.',
      'Supporter creativity receives a curated public space.',
    ],
    'fan.small_town_visit_lottery': [
      '{player} fulfills the supporter-visit draw in {town}.',
      'The selected community receives the promised visit.',
      'The lottery result becomes an actual appointment.',
    ],
    'fan.fan_question_archive': [
      '{player}\'s complete supporter Q-and-A reaches the archive.',
      'The answers stay together instead of becoming isolated fragments.',
      'Fans get the approved transcript of their submitted questions.',
    ],
    'fan.one_event_no_selfies': [
      '{player}\'s fan gathering chooses conversation over posed photos.',
      'The event follows its announced camera boundary.',
      'Supporters meet under a clearly stated format.',
    ],
    'fan.supporter_memory_map': [
      '{player}\'s supporter memory map opens after review.',
      'The landmarks come from people who chose to contribute.',
      'A fan project connects basketball memories to public places.',
    ],
    'fan.penpal_cycle_closed': [
      '{player} completes the promised correspondence cycle.',
      'The final replies close the project on schedule.',
      'A fan connection ends at the boundary agreed from the start.',
    ],
    'media_project.first_person_essay': [
      '{player} publishes his own account in {publication}.',
      'The story reaches readers in the player\'s approved words.',
      'A first-person essay gives {player} a complete public statement.',
    ],
    'media_project.documentary_cut_approval': [
      '{player} approves the final cut of {documentary}.',
      'The authorized film clears its last review.',
      'A completed documentary receives permission to reach an audience.',
    ],
    'media_project.interview_walkout_notice': [
      '{player} ends the interview under its agreed boundaries.',
      'The excluded question brings the session to a close.',
      'A prearranged limit changes the interview\'s ending.',
    ],
    'media_project.host_role_trial': [
      '{player} completes a hosting trial on {program}.',
      'The interview subject tries the other chair.',
      'The producer now has a full hosting sample to evaluate.',
    ],
    'media_project.longform_unedited': [
      '{player}\'s approved long-form interview appears in full.',
      'The audience gets the conversation beyond a short quote.',
      'The released interview preserves its agreed context.',
    ],
    'media_project.audio_diary_complete': [
      '{player} releases an approved episode from his audio diary.',
      'The raw recordings stay private while one episode reaches listeners.',
      'A personal project finds a controlled public form.',
    ],
    'media_project.fictional_cameo_declined': [
      '{player} declines a cameo in {production}.',
      'The script does not fit the direction he wants.',
      'An offered screen role ends with a deliberate refusal.',
    ],
    'media_project.archival_interview': [
      '{player} records an oral history for {archive}.',
      'The account gets preserved under his approved access terms.',
      'A career conversation enters the historical archive.',
    ],
    'media_project.guest_editor_issue': [
      '{player}\'s guest-edited issue of {publication} is complete.',
      'The byline is not his only role in this edition.',
      'The selected stories reach a finished editorial package.',
    ],
    'media_project.translation_review': [
      '{player}\'s essay receives an approved {language} translation.',
      'Qualified review brings the account to another readership.',
      'The translated words preserve the approved original story.',
    ],
    'privacy.home_tour_refused': [
      '{player} declines the proposed home tour.',
      'The door stays closed to a public camera crew.',
      'A publicity opportunity ends at a personal boundary.',
    ],
    'privacy.childhood_photo_consent': [
      '{player} approves one childhood photograph for publication.',
      'The permission applies to a single image, not the whole album.',
      'A selected memory reaches the public with consent.',
    ],
    'privacy.location_delay_rule': [
      '{player} adopts a delay for public location updates.',
      'The personal account stops announcing movements in real time.',
      'A new posting rule separates travel from instant disclosure.',
    ],
    'privacy.family_press_permission': [
      '{player}\'s family set an advance-permission rule for press features.',
      'A personal connection is not automatic interview access.',
      'The family profile gets a clear consent gate.',
    ],
    'privacy.contact_channel_changed': [
      '{player} moves public contact to a moderated channel.',
      'The new route keeps messages available without an open personal inbox.',
      'A clear contact boundary changes how supporters reach him.',
    ],
    'privacy.private_journal_rejected': [
      '{player} keeps his journal out of publication.',
      'The notebook stays a private record.',
      'A proposed feature stops at the player\'s decision.',
    ],
    'privacy.personal_archive_embargo': [
      '{player}\'s personal archive receives a release-date restriction.',
      'The material is preserved without becoming immediately public.',
      '{archive} accept the collection under its agreed embargo.',
    ],
    'privacy.venue_camera_boundary': [
      '{player}\'s gathering adopts an announced camera boundary.',
      'The venue prepares a personal occasion without public recording.',
      'Invitees receive the rules before the event begins.',
    ],
    'privacy.shared_story_withdrawn': [
      '{player} and {participant} withdraw their planned shared profile.',
      'The authorized story stops before publication.',
      'A mutual decision keeps the account private.',
    ],
    'privacy.retired_routine_publication': [
      '{player} shares a routine that is no longer in use.',
      'The old schedule becomes a story without exposing the present one.',
      'A historical account leaves current movements outside the frame.',
    ],
    'culture.local_language_course': [
      '{player} completes the first assessment in {language}.',
      'Everyday conversation becomes part of the new-city plan.',
      'The course gives language progress a verified starting point.',
    ],
    'culture.interpreter_preference': [
      '{player} chooses qualified interpretation for {event}.',
      'Clear communication matters more than pretending fluency.',
      'The conversation receives the language support he requests.',
    ],
    'culture.local_history_walk': [
      '{player} completes a history walk through {city}.',
      'The new place gets a story beyond its arena.',
      'A guided route gives the city context.',
    ],
    'culture.regional_food_class': [
      '{player} completes a workshop on {dish}.',
      'The lesson brings a regional tradition into the kitchen.',
      'A local class gives the new city another familiar detail.',
    ],
    'culture.customary_greeting_clarified': [
      '{player} adopts the hosts\' explained greeting at {event}.',
      'The introduction follows local guidance.',
      'A small lesson makes the next welcome clearer.',
    ],
    'culture.translation_mistake_owned': [
      '{player} corrects his translated greeting.',
      'The revision follows a qualified language check.',
      'A small wording error gets a direct fix.',
    ],
    'culture.offseason_local_stay': [
      '{player} chooses an offseason stay in {region}.',
      'The current basketball home gets some ordinary-life time.',
      'A permitted calendar block stays close to the team\'s community.',
    ],
    'culture.hometown_custom_shared': [
      '{player} shares {custom} at an authorized community event.',
      'The demonstration follows his chosen personal connection.',
      'A familiar practice reaches a new audience on agreed terms.',
    ],
    'culture.local_library_membership': [
      '{player} joins {city}\'s public library.',
      'A new membership has nothing to do with the roster.',
      'The local branch becomes part of his everyday map.',
    ],
    'culture.return_visit_promise': [
      '{player} returns to {community} as promised.',
      'The visit follows a personal commitment rather than a game schedule.',
      'A remembered welcome receives a kept promise.',
    ],
    'autonomy.double_booked_choices': [
      '{player} chooses {chosen_event} over {declined_event}.',
      'An overlapping calendar forces a direct decision.',
      'The second organizer gets notice rather than an empty chair.',
    ],
    'autonomy.volunteer_shift_trade': [
      '{player} arranges an approved volunteer-shift exchange.',
      'The commitment moves instead of disappearing.',
      'A willing substitute helps both calendars hold together.',
    ],
    'autonomy.free_day_protected': [
      '{player} keeps one announced day free of new appearances.',
      'The calendar gets a boundary before the invitations arrive.',
      'A free day remains free by choice.',
    ],
    'autonomy.community_role_overload': [
      '{player} steps back from {role} after reviewing his commitments.',
      'One voluntary role leaves an overcrowded calendar.',
      'The handover begins with an honest capacity decision.',
    ],
    'autonomy.family_event_media_decline': [
      '{player} chooses the agreed family occasion over the optional appearance.',
      'The prior promise stays on the calendar.',
      'A publicity invitation loses to an existing commitment.',
    ],
    'autonomy.career_gap_personal_project': [
      '{player} agrees a permitted career pause for {project}.',
      'The break has a stated personal purpose and a return review.',
      'Basketball availability pauses under an approved agreement.',
    ],
    'autonomy.no_entourage_trip': [
      '{player} chooses a solo leisure trip to {destination}.',
      'The approved journey has a smaller passenger list.',
      'A personal travel choice creates time on his own.',
    ],
    'autonomy.delegation_restored': [
      '{player} takes direct control of {decision}.',
      'The helper receives notice of a changed responsibility.',
      'A personal choice returns to the person it concerns.',
    ],
    'autonomy.appearance_limit_set': [
      '{player} enforces his voluntary-appearance limit.',
      'The next request arrives after the chosen cap.',
      'A personal schedule rule becomes an actual refusal.',
    ],
    'autonomy.offseason_project_vote': [
      '{player}\'s household chooses {project} for the offseason calendar.',
      'The competing plans reach a shared priority.',
      'One project gets the time while the others wait.',
    ],
    'legacy.return_to_first_job': [
      '{player} returns for an approved guest shift at {workplace}.',
      'The old job gets a familiar visitor doing real work.',
      'A former workplace becomes part of the story again.',
    ],
    'legacy.classroom_guest_lecturer': [
      '{player} completes a guest lecture on {subject}.',
      'The classroom welcomes expertise beyond the basketball career.',
      'A prepared lesson gives students something specific to learn.',
    ],
    'legacy.second_career_apprenticeship': [
      '{player} starts an apprenticeship in {craft}.',
      'A possible second career begins with supervised learning.',
      'The new route asks for work before a title.',
    ],
    'legacy.apprenticeship_completed': [
      '{player} completes his {craft} apprenticeship.',
      'The supervised work earns its stated credential.',
      'A second-career skill reaches a verified milestone.',
    ],
    'legacy.time_capsule_sealed': [
      '{player}\'s community time capsule is sealed until {date}.',
      'The future audience gets an agreed appointment with the past.',
      'The contents wait under a shared opening plan.',
    ],
    'legacy.personal_museum_room': [
      '{player}\'s career objects open a temporary display at {museum}.',
      'The loan puts memories on view without changing ownership.',
      'A limited exhibition gives the artifacts a public home.',
    ],
    'legacy.nonbasketball_coach_refusal': [
      '{player} chooses {path} instead of a coaching role.',
      'The next professional direction leaves the basketball bench aside.',
      'A considered career choice reaches a clear answer.',
    ],
    'legacy.public_skill_beginner': [
      '{player} starts {skill} as an ordinary beginner.',
      'The class uses the same standard for every learner.',
      'A public reputation does not replace the first lesson.',
    ],
    'legacy.alternate_day_persona': [
      '{player} completes a staged day as {persona}.',
      'The experiment announces its fiction before the performance.',
      'A creative character gets one agreed day in public.',
    ],
    'legacy.one_year_letter': [
      '{player} seals a letter for his future self.',
      'The answer waits one year inside an envelope.',
      'A private reflection gets a date rather than a headline.',
    ],
    'legal.alibi_timestamp_clears': [
      'Authenticated timestamps clear {player} in {case}.',
      'The timeline puts {player} somewhere else. Investigators close his part of the case.',
      'A verified alibi ends the inquiry hanging over {player}.',
    ],
    'legal.identity_mixup_corrected': [
      'Authorities correct the mistaken identification of {player}.',
      'Same name, different person: the official notice is corrected.',
      '{player} is removed from the suspect list after the identity error.',
    ],
    'legal.forged_evidence_exposed': [
      'Investigators identify fabricated evidence in {player}\'s case.',
      'The document driving the accusation is exposed as a forgery.',
      'One major claim against {player} loses its purported evidence.',
    ],
    'legal.witness_recantation_reported': [
      'A key witness withdraws the statement concerning {player}.',
      'The account changes. The court outcome has not.',
      '{player}\'s case faces a new evidentiary question after the recantation.',
    ],
    'legal.corroborating_video_released': [
      'Released footage corroborates part of the allegation in {case}.',
      'New video strengthens a claim involving {player}; a verdict remains ahead.',
      'The evidence changes the case against {player}, without deciding it.',
    ],
    'legal.chain_of_custody_failure': [
      'Court excludes the disputed exhibit in {player}\'s case.',
      'The evidence trail fails scrutiny, and one exhibit leaves the courtroom.',
      '{case} proceeds without the excluded material.',
    ],
    'legal.phone_search_authorization_denied': [
      'Court denies the requested device search in {case}.',
      'Investigators cannot use the proposed search authority against {player}.',
      'The ruling limits the investigation without resolving its allegation.',
    ],
    'legal.leak_source_identified': [
      'Inquiry identifies the source of the confidential leak in {case}.',
      'The leak has an identified source; {player}\'s underlying case remains separate.',
      'Private case details became public through the breach now established by investigators.',
    ],
    'legal.public_correction_ordered': [
      'Official correction removes {player} from the erroneous case report.',
      'The public record finally catches up with the corrected identity.',
      '{player}\'s name leaves a story he should never have been placed in.',
    ],
    'legal.witness_protection_availability': [
      '{player} becomes unavailable under an authorized protective arrangement.',
      '{team} receive the permitted availability update. Personal details remain restricted.',
      'Basketball pauses for {player} while the protection plan is in effect.',
    ],
    'legal.cold_case_reopened': [
      'New evidence reopens {case} involving {player}.',
      'A closed file returns to investigators after an authenticated discovery.',
      '{player}\'s old case becomes an active inquiry again.',
    ],
    'legal.voluntary_interview_completed': [
      '{player} completes a voluntary interview in {case}.',
      'Investigators hear from {player} without announcing a charge.',
      'The interview is over. The inquiry remains open.',
    ],
    'legal.conflict_investigator_replaced': [
      'Oversight body replaces the conflicted investigator in {case}.',
      '{player}\'s case gets a new investigator after the conflict finding.',
      'The inquiry continues under different supervision.',
    ],
    'legal.forensic_review_inconclusive': [
      'Forensic review leaves {issue} unresolved in {player}\'s case.',
      'The laboratory result provides no clear answer to the disputed question.',
      'An inconclusive finding leaves {case} awaiting other evidence.',
    ],
    'legal.complainant_protection_order': [
      'Court issues a protective order with {restriction} in {case}.',
      'The order sets a binding boundary involving {player}.',
      'The protective terms take effect while other legal questions remain separate.',
    ],
    'legal.remote_hearing_permission': [
      'Court permits {player} to attend {hearing} remotely.',
      'The legal appearance stays on the calendar without the extra journey.',
      '{team}\'s road schedule no longer conflicts with {player}\'s hearing location.',
    ],
    'legal.hearing_relocation_travel': [
      'Venue change forces {player} to revise his travel plan.',
      '{hearing} moves to {city}, changing {team}\'s availability picture.',
      'A courtroom move reaches the basketball schedule.',
    ],
    'legal.bail_conditions_training': [
      '{player} may train under the court\'s release conditions.',
      'Training resumes within {restriction}; the case is still pending.',
      '{team} adjust the routine to the conditions of {player}\'s release.',
    ],
    'legal.bail_conditions_modified': [
      'Court permits {player}\'s specified trip to {city}.',
      'A revised release order changes travel eligibility, not the case outcome.',
      '{team} receive clearance for the journey covered by the order.',
    ],
    'legal.release_revoked_verified': [
      'Court revokes {player}\'s pretrial release after the condition breach.',
      'The breach changes custody status while {case} remains unresolved.',
      '{team} lose access to {player} under the court\'s new order.',
    ],
    'legal.required_document_deadline_missed': [
      'Missed filing deadline brings {consequence} in {player}\'s case.',
      'The legal team faces a consequence before the merits are decided.',
      '{case} changes course after the missed deadline.',
    ],
    'legal.counsel_conflict_change': [
      '{player} changes counsel after a confirmed conflict.',
      'A new legal team takes over {case}.',
      'The representation changes while the underlying dispute continues.',
    ],
    'legal.interpreter_requested_granted': [
      'Court grants {player} an interpreter for {hearing}.',
      'The proceeding will include qualified language support.',
      '{player}\'s hearing gets the requested {language} interpretation.',
    ],
    'legal.accessible_hearing_accommodation': [
      '{player}\'s hearing receives the requested access accommodation.',
      'Court arrangements change so {player} can participate.',
      'The proceeding continues with {accommodation} in place.',
    ],
    'legal.jury_duty_selection': [
      'Jury service takes {player} away from {team} for {dates}.',
      'The summons becomes an actual civic assignment.',
      'Basketball shares the calendar with {player}\'s jury duty.',
    ],
    'legal.witness_testimony_leave': [
      '{player} takes leave to testify as a witness.',
      'A required appearance changes {team}\'s schedule without an accusation against their player.',
      'The courtroom calls {player} in a witness role.',
    ],
    'legal.emergency_hearing_delays_trip': [
      'Urgent hearing keeps {player} off {team}\'s departing flight.',
      'The team leave while {player} meets the court\'s attendance requirement.',
      'An emergency legal date splits the travel party.',
    ],
    'legal.trial_calendar_rescheduled': [
      '{player}\'s trial moves to {date}.',
      'The calendar changes after {reason}; no verdict has been reached.',
      '{case} remains pending under the revised trial date.',
    ],
    'legal.court_appearance_no_show': [
      'Court issues {order} after {player} misses the required hearing.',
      'A missed appearance creates a new procedural problem in {case}.',
      'The legal calendar now carries the consequence of {player}\'s absence.',
    ],
    'legal.competency_review_ordered': [
      'Court pauses {case} for a qualified competency review.',
      'The assessment is ordered; its result is not yet known.',
      '{player}\'s proceeding waits for the independent evaluation.',
    ],
    'legal.juror_misconduct_hearing': [
      'Court examines juror misconduct in {player}\'s trial.',
      'A courtroom integrity question creates a separate hearing.',
      'The court reviews {issue} before deciding its effect on {case}.',
    ],
    'legal.venue_change_bias': [
      '{player}\'s trial moves to {city} under a fairness ruling.',
      'A new venue replaces the disputed setting.',
      'The case continues before a different local audience.',
    ],
    'legal.publicity_restriction_imposed': [
      'Court restrict public statements about {case}.',
      '{player}\'s public comments must stay within {restriction}.',
      'The proceeding moves under a new communication order.',
    ],
    'legal.sealed_exhibit_public_summary': [
      'Court releases a limited summary in {case}.',
      'The permitted update leaves the sealed material protected.',
      'Public coverage gains {summary}, not the entire private exhibit.',
    ],
    'legal.expert_opinion_excluded': [
      'Court excludes the proposed expert opinion in {case}.',
      '{player}\'s trial proceeds without that testimony.',
      'The admissibility ruling removes one planned strand of evidence.',
    ],
    'legal.partial_count_withdrawal': [
      'Prosecutors withdraw {counts} in {player}\'s case.',
      'Some charges leave the case; the remaining counts still await resolution.',
      '{case} narrows without ending.',
    ],
    'legal.negotiated_charge_reduction': [
      '{player}\'s filed charge changes to {charge}.',
      'The case continues on the amended charging document.',
      'A reduced allegation changes the stakes before any verdict.',
    ],
    'legal.plea_offer_rejected': [
      '{player} rejects the proposed plea agreement.',
      'The offer is declined, and {case} continues toward a contested hearing.',
      'The legal team choose trial over the proposed resolution.',
    ],
    'legal.plea_withdrawal_allowed': [
      'Court allows {player} to withdraw the prior plea.',
      'The case returns to {status} under the new ruling.',
      'An accepted resolution reopens for further proceedings.',
    ],
    'legal.new_trial_granted': [
      'Court grants {player} a new trial after finding {defect}.',
      'Another hearing will test the case under the corrected process.',
      'The new-trial order changes the procedure without deciding innocence.',
    ],
    'legal.verdict_readback_corrected': [
      'Court corrects the public record of {player}\'s verdict.',
      'The clerical mistake is fixed; the actual decision stays intact.',
      '{case}\'s official entry now matches the ruling that was delivered.',
    ],
    'legal.sentence_credit_corrected': [
      'Court corrects the credited time in {player}\'s sentence.',
      'The revised order changes {date} in the existing legal schedule.',
      'A calculation correction changes the sentence ledger.',
    ],
    'legal.appellate_stay_granted': [
      'Appeal court pauses {measure} while reviewing {player}\'s case.',
      'The stay delays enforcement within its stated limits.',
      '{case} enters review with a temporary restriction on enforcement.',
    ],
    'legal.appeal_permission_denied': [
      'Court denies permission for {player}\'s specified further appeal.',
      'That review route closes under the published decision.',
      'The existing judgment remains unaffected by this application.',
    ],
    'legal.independent_review_referral': [
      'Review body refers {player}\'s conviction for fresh examination.',
      '{concern} opens a new route back to court.',
      'The referral requests scrutiny; it does not itself reverse the judgment.',
    ],
    'legal.travel_permission_expired': [
      '{player} cannot use the expired travel authorization for {team}\'s trip.',
      'The legal permission runs out before departure.',
      'A pending renewal leaves {player} off the travel list.',
    ],
    'legal.monitoring_equipment_exception': [
      '{player} receives a competition exception within his monitoring order.',
      'The approved adjustment permits play under {condition}.',
      'Supervision continues with a basketball-specific arrangement.',
    ],
    'legal.restitution_installment_default': [
      'Missed restitution payment sends {player} into a compliance review.',
      'The required installment is unpaid; {action} begins.',
      'A payment obligation creates a new legal checkpoint.',
    ],
    'legal.restitution_schedule_revised': [
      'Court revises {player}\'s restitution schedule.',
      'The payment plan changes to {terms}, while the debt remains due.',
      'A new timetable replaces the original court-approved schedule.',
    ],
    'legal.service_assignment_safety_change': [
      '{player}\'s service assignment changes after the safety review.',
      'The work requirement remains, but {assignment} replaces the prior placement.',
      'Compliance continues under the revised arrangement.',
    ],
    'legal.supervision_transfer_approved': [
      'Authorities transfer {player}\'s supervision to {city}.',
      'The legal administration follows his basketball move.',
      '{team} receive him with the existing conditions still in force.',
    ],
    'legal.supervision_violation_dismissed': [
      'Hearing rejects the alleged supervision breach by {player}.',
      'The disputed incident produces no violation finding.',
      '{player}\'s existing supervision continues without the proposed penalty.',
    ],
    'legal.restricted_contact_accidental_review': [
      'Review find no actionable breach in {player}\'s incidental contact.',
      'The event is examined under the existing order and cleared.',
      'The restriction remains, but this encounter brings no violation finding.',
    ],
    'legal.license_reinstated_driving': [
      '{player}\'s driving entitlement is restored.',
      'The completed requirements put him legally back behind the wheel.',
      'The licensing decision changes transport options for {player}.',
    ],
    'legal.passport_return_order': [
      'Court returns {player}\'s passport under {terms}.',
      'The document comes back; the remaining restrictions still apply.',
      '{player}\'s travel status changes only as far as the order permits.',
    ],
    'legal.record_disclosure_limit_enforced': [
      'Court enforces the protected-record limit in {player}\'s case.',
      '{publication} must follow {order} concerning the restricted material.',
      'Historical records receive the protection established by the ruling.',
    ],
    'legal.immigration_registration_gap': [
      '{player}\'s work authorization gap interrupts registration with {team}.',
      'The administrative decision affects playing eligibility, not his basketball ability.',
      '{team} wait for the lawful registration route to reopen.',
    ],
    'legal.immigration_appeal_success': [
      '{player}\'s successful authorization appeal clears the route back to {team}.',
      'The administrative reversal is followed by completed registration.',
      'The paperwork barrier finally lifts for {player}.',
    ],
    'legal.rehabilitation_certificate_granted': [
      '{player} receives {certificate} after meeting its requirements.',
      'The certificate grants {effect}, within the authority\'s stated limits.',
      'A completed rehabilitation process changes one part of {player}\'s legal status.',
    ],
    'legal.voluntary_accountability_meeting': [
      '{player} completes the agreed restorative meeting.',
      'The participants meet voluntarily while legal duties remain separate.',
      'A conversation creates a recovery step without erasing the case history.',
    ],
    'civil.counterfeit_merchandise_removed': [
      'Counterfeit merchandise falsely tied to {player} is removed.',
      'The fake collection disappears after the enforcement order.',
      '{player}\'s authorized products no longer share that outlet with the proven knockoffs.',
    ],
    'civil.ticket_scam_refunds_ordered': [
      'Court orders refunds for the fake {player} appearance.',
      'Fans paid for a visit that {player} never agreed to make.',
      'The promoter\'s false booking ends in an enforceable refund order.',
    ],
    'civil.unpaid_appearance_fee_recovered': [
      '{player} recovers {amount} for the unpaid appearance.',
      'The appearance happened. The payment finally follows.',
      'Enforcement turns the completed event into the compensation owed.',
    ],
    'civil.loan_document_forgery_ruling': [
      'Court rejects the forged loan document bearing {player}\'s name.',
      '{player} is not liable for the loan established through the false signature.',
      'A fraudulent document no longer creates a debt against {player}.',
    ],
    'civil.identity_theft_accounts_corrected': [
      'Fraudulent accounts in {player}\'s name are corrected.',
      'The identity-theft cleanup reaches the institutions holding the false debts.',
      '{player}\'s financial record sheds the accounts he never opened.',
    ],
    'civil.property_boundary_judgment': [
      'Court resolves {player}\'s boundary dispute with {remedy}.',
      'The contested strip of land finally gets a legal answer.',
      '{player}\'s home map changes under the property ruling.',
    ],
    'civil.construction_defect_remedy': [
      'Proven defects bring {player} a remedy against the contractor.',
      'The expensive renovation ends with a court-ordered correction.',
      '{remedy} becomes the legal response to the faulty work.',
    ],
    'civil.insurance_denial_overturned': [
      'Tribunal overturns the denied claim for {player}\'s {loss}.',
      'The coverage dispute ends with an order honoring the claim.',
      'The insurer must provide {remedy} under the ruling.',
    ],
    'civil.unwanted_tracking_injunction': [
      'Court halts the unauthorized tracking of {player}.',
      'The injunction puts a legal boundary around the proven surveillance.',
      '{player}\'s privacy claim produces an enforceable stop order.',
    ],
    'civil.doxxing_removal_compliance': [
      'Unlawfully published location details concerning {player} are removed.',
      'The disclosure comes down after the enforceable privacy order.',
      '{player}\'s current whereabouts stop circulating through that publication.',
    ],
    'civil.access_discrimination_remedy': [
      'Tribunal orders {remedy} after the access denial involving {player}.',
      'The complaint produces a finding and a practical correction.',
      'The proven barrier receives an enforceable response.',
    ],
    'civil.workplace_retaliation_finding': [
      'Tribunal finds unlawful retaliation against {player}.',
      '{team} must apply {remedy} under the employment ruling.',
      'The protected complaint becomes a case the club cannot dismiss as ordinary friction.',
    ],
    'civil.defamation_claim_rejected': [
      'Court rejects {player}\'s specified defamation claim.',
      'The civil claim fails under {grounds}; the ruling has stated limits.',
      '{case} ends without the requested defamation remedy.',
    ],
    'civil.confidential_settlement_breach': [
      'Tribunal finds a confidentiality breach in {case}.',
      'The public ruling identifies the breach while protected terms stay private.',
      '{remedy} follows the established disclosure violation.',
    ],
    'civil.volunteer_injury_liability_rejected': [
      'Court rejects the liability claim against {player} over {event}.',
      'The event\'s injury does not create the alleged civil responsibility.',
      '{player}\'s volunteer-event dispute ends without the proposed damages award.',
    ],
    'sportlaw.failed_test_sample_identity': [
      'Testing review clears {player} after the sample identification error.',
      'The sample was not his. The allegation is withdrawn.',
      'A corrected identity changes the anti-doping case.',
    ],
    'sportlaw.positive_b_sample_confirmation': [
      'B-sample analysis confirms the adverse finding involving {player}.',
      'The test result advances the proceeding without announcing a final sanction.',
      '{player}\'s case moves to the governing body\'s review stage.',
    ],
    'sportlaw.contamination_finding_reduction': [
      'Panel reduces {player}\'s sanction after finding proven contamination.',
      'The decision changes the penalty to {sanction}.',
      'The established source matters under the governing body\'s rules.',
    ],
    'sportlaw.whereabouts_notice_corrected': [
      'Governing body corrects the whereabouts notice concerning {player}.',
      'His submitted record meets the requirement, and the notice is withdrawn.',
      '{player}\'s reporting file loses an incorrectly recorded failure.',
    ],
    'sportlaw.test_refusal_finding': [
      'Panel imposes {sanction} after finding a testing refusal by {player}.',
      'The hearing reaches a policy finding and an entered penalty.',
      '{team} receive the eligibility consequence specified in the ruling.',
    ],
    'sportlaw.contaminated_batch_recall': [
      '{team} remove the recalled {product} batch from their facilities.',
      'A confirmed contamination alert reaches the training supplies.',
      'The club act on the recall without announcing a player violation.',
    ],
    'sportlaw.sanction_clock_miscalculation': [
      'Panel corrects {player}\'s suspension end date to {date}.',
      'A calendar error changes the eligibility timetable.',
      '{team}\'s return plan now follows the corrected ruling.',
    ],
    'sportlaw.double_discipline_limit': [
      'Panel removes the duplicate penalty against {player}.',
      'One incident cannot carry that extra sanction under the applicable policy.',
      'The original ruling remains; the improper second penalty does not.',
    ],
    'sportlaw.player_sanction_stay': [
      'Tribunal pauses {player}\'s league sanction during review.',
      'Eligibility follows the temporary order while the appeal continues.',
      '{team} get an interim ruling, rather than a final victory in the case.',
    ],
    'sportlaw.team_sanction_evidence_release': [
      'League release the public evidence behind {team}\'s sanction.',
      'The ruling\'s stated basis becomes available for scrutiny.',
      'The penalty debate gains facts while private details remain protected.',
    ],
    'sportlaw.match_result_restored': [
      'Appeal restores {team}\'s played result against {opp}.',
      'The administrative forfeiture is reversed; the original score returns.',
      'A ruling changes the standings back to the result earned on court.',
    ],
    'sportlaw.eligibility_document_misread': [
      'Panel restores {player}\'s registration after finding the document error.',
      'The paperwork was valid, and the eligibility ruling is corrected.',
      '{team} regain access to their properly registered player.',
    ],
    'sportlaw.coach_license_appeal': [
      'Panel overturns {coach}\'s licensing suspension.',
      'The appeal reopens the coaching eligibility route for {team}.',
      '{coach}\'s professional status changes under the independent decision.',
    ],
    'sportlaw.owner_sanction_personal_scope': [
      'Ruling penalizes {owner} while preserving {team}\'s player eligibility.',
      'The finding sets a boundary between ownership conduct and the roster.',
      'The owner faces {sanction}; the players remain eligible under the order.',
    ],
    'sportlaw.hearing_translation_error': [
      'Translation error sends {player}\'s sporting case to a new hearing.',
      'The first process fails the panel\'s fairness review.',
      'Another hearing will consider the defense with accurate interpretation.',
    ],
    'medical.screening_heart_followup': [
      '{player} pauses play for a cardiac follow-up assessment.',
      'Screening prompts another medical check before a return decision.',
      '{team} wait for qualified answers rather than guessing at the finding.',
    ],
    'medical.false_positive_resolved': [
      'Confirmatory tests resolve {player}\'s false-positive screening result.',
      'The follow-up changes the medical picture to {plan}.',
      '{team} receive an updated plan after the initial alert is resolved.',
    ],
    'medical.hidden_fracture_detected': [
      'Further imaging identifies {player}\'s previously missed fracture.',
      'Persistent symptoms lead clinicians to a different answer.',
      'The diagnosis changes {team}\'s plan for his return.',
    ],
    'medical.food_allergy_travel_plan': [
      '{team} change {player}\'s travel meals after the confirmed allergy.',
      'The diagnosis reaches the team kitchen and the road routine.',
      'Meal planning becomes part of keeping {player}\'s travel manageable.',
    ],
    'medical.exercise_asthma_plan': [
      '{player} receives a clinician-led competition plan for {condition}.',
      'The diagnosis gives {team} a specific availability arrangement.',
      'Medical planning replaces speculation about {player}\'s breathing difficulties.',
    ],
    'medical.anemia_workload_change': [
      '{player}\'s workload changes after a confirmed anemia diagnosis.',
      'The care plan adjusts the basketball schedule.',
      '{team} follow the medical recommendation while treatment proceeds.',
    ],
    'medical.hearing_issue_reversible': [
      'Treatment improves {player}\'s disclosed hearing problem.',
      'The follow-up confirms {improvement}, rather than a guessed outcome.',
      'A measured recovery changes the communication challenge for {player}.',
    ],
    'medical.vision_prescription_changed': [
      '{player} takes a new prescription into his approved playing equipment.',
      'The fitting is complete before his next appearance for {team}.',
      'A different view of the court starts with the updated prescription.',
    ],
    'medical.dental_infection_leave': [
      '{player} takes treatment leave for the disclosed dental condition.',
      'A medical problem away from the usual injury report interrupts availability.',
      '{team} adjust while {player} receives qualified care.',
    ],
    'medical.referred_pain_source': [
      'Clinicians identify a different source for {player}\'s pain.',
      'The revised diagnosis changes the care plan to {treatment}.',
      'The symptom story becomes clearer after the specialist review.',
    ],
    'medical.longstanding_symptom_explanation': [
      '{player} finally receives an explanation for {symptom}.',
      'The long-running concern gets a qualified diagnosis and a plan.',
      '{team} receive {player}\'s consented update after the medical review.',
    ],
    'medical.wearable_alert_clinical_review': [
      'A device alert sends {player} for a qualified medical review.',
      'The actual examination produces {recommendation}.',
      '{team} act on the clinician\'s assessment after the alert.',
    ],
    'medical.genetic_risk_counseling': [
      '{player} completes qualified counseling on the disclosed inherited risk.',
      'The finding informs a prevention plan without establishing an active illness.',
      'His care team set {plan} after the consultation.',
    ],
    'medical.retired_player_scan_update': [
      '{player} shares his post-career medical update.',
      'The assessment leads to {recommendation}, with its stated limits.',
      'Basketball is in the past; the care plan belongs to the present.',
    ],
    'medical.environment_trigger_identified': [
      '{team} change the venue routine after identifying {trigger}.',
      '{player}\'s care plan now accounts for the confirmed environmental factor.',
      'The clinical finding leads to a practical change around the court.',
    ],
    'care.surgery_scheduled_choice': [
      '{player} chooses the scheduled operation after the clinical review.',
      'The decision is made; {team} now plan around {date}.',
      '{player}\'s next basketball chapter starts with the treatment option he consents to take.',
    ],
    'care.conservative_trial_chosen': [
      '{player} chooses a monitored nonoperative treatment trial.',
      '{team} get a review date rather than a promised return date.',
      'His care team will judge the trial against the agreed checkpoints.',
    ],
    'care.trial_goal_unmet': [
      '{player}\'s treatment trial does not reach its agreed goal.',
      'The checkpoint brings a new discussion, not an automatic operation.',
      '{team} wait for the next medical decision after the unsuccessful trial.',
    ],
    'care.hospital_reschedules_procedure': [
      'Hospital scheduling moves {player}\'s procedure to {date}.',
      'The appointment changes because urgent care needs the space. His diagnosis has not changed with it.',
      '{team} redraw the calendar around the hospital\'s new date.',
    ],
    'care.postprocedure_discharge': [
      '{player} leaves hospital under the agreed follow-up plan.',
      'Home is the next care setting; the court is still a separate decision.',
      '{team} receive the consented discharge update after his procedure.',
    ],
    'care.postprocedure_complication': [
      'A confirmed complication changes {player}\'s post-procedure care.',
      '{team} adjust after the medical team revise the plan.',
      'His recovery takes a different route; the next timetable comes from the clinicians.',
    ],
    'care.medication_side_effect_review': [
      '{player}\'s prescribed treatment changes after a side-effect review.',
      'A qualified reassessment redirects his care rather than leaving him to guess.',
      '{team} receive the revised availability plan without private prescription details.',
    ],
    'care.medication_reconciliation_catches_conflict': [
      'A clinical cross-check catches a treatment conflict before {player} begins it.',
      'The care team resolve the compatibility concern before it becomes an exposure.',
      '{player}\'s treatment plan gets a useful correction at the review table.',
    ],
    'care.specialist_wait_transfer': [
      '{player} transfers care to secure an accepted specialist appointment.',
      'The waiting list changes the provider, not the established diagnosis.',
      '{team} follow the new appointment date after the qualified handover.',
    ],
    'care.prior_authorization_ready': [
      '{player}\'s treatment booking clears its authorization hurdle.',
      'The paperwork finally permits the appointment already agreed with his care team.',
      '{team} can plan around the confirmed booking instead of an administrative hold.',
    ],
    'care.informed_consent_withdrawn': [
      '{player} withdraws consent for the planned elective procedure.',
      'The appointment stops before treatment begins; the care team arrange the interim plan.',
      'The choice changes, and {team} receive the revised availability facts.',
    ],
    'care.research_enrollment_approved': [
      '{player} joins an approved clinical study under the permitted terms.',
      'Participation creates monitoring commitments rather than a promised cure.',
      '{team} receive the actual competition conditions attached to his enrollment.',
    ],
    'care.research_participation_ended': [
      '{player} ends his clinical-study participation.',
      'The research appointment closes with a qualified care handover.',
      'His regular care continues under the actual transition plan.',
    ],
    'care.diagnosis_unresolved_followup': [
      '{player}\'s medical review remains inconclusive.',
      'There is a follow-up appointment, but no settled diagnosis to announce.',
      '{team} work with the interim limits while qualified assessment continues.',
    ],
    'care.patient_record_correction': [
      '{player}\'s care plan is reviewed after a record correction.',
      'The provider fixes the factual entry before the next treatment decision.',
      'A paperwork error receives a clinical cross-check, with private details kept private.',
    ],
    'rehab.baseline_function_logged': [
      '{player} sets his first measured rehabilitation targets.',
      'The comeback has a starting line, with goals his rehabilitation team can actually test.',
      '{team} get a structured plan rather than a guess about readiness.',
    ],
    'rehab.solo_ballwork_first': [
      '{player} completes his first cleared solo ball-work session.',
      'The ball is back in his hands. Team practice remains another checkpoint.',
      'A small supervised session gives the rehabilitation plan a tangible step forward.',
    ],
    'rehab.noncontact_group_session': [
      '{player} rejoins {team} for cleared noncontact practice.',
      'The group is back around him, with the contact limit still in place.',
      'His first completed team session stays inside the medical plan.',
    ],
    'rehab.contact_stage_deferred': [
      '{player}\'s contact-practice step is deferred after testing.',
      'The calendar says time has passed; the agreed criteria still need to be met.',
      '{team} keep the next stage on hold under the qualified assessment.',
    ],
    'rehab.contact_session_completed': [
      '{player} completes his first cleared contact session.',
      'The rehabilitation moves into contact without jumping straight to game clearance.',
      '{team} welcome another completed checkpoint in his return plan.',
    ],
    'rehab.return_minutes_cap_met': [
      '{player}\'s return stays inside the agreed {limit}-minute cap.',
      '{team} get him back without stretching the plan on the first appearance.',
      'The clock reaches the limit and the rotation respects it.',
    ],
    'rehab.return_minutes_cap_breached': [
      '{team} exceed {player}\'s agreed return cap by {excess} minutes.',
      'The appearance ends outside the medical plan, and a qualified review follows.',
      'The extra minutes create a documented protocol problem rather than a guessed medical outcome.',
    ],
    'rehab.stage_rolled_back': [
      '{player}\'s rehabilitation steps back after a supervised review.',
      'The next session returns to the earlier cleared stage.',
      'Progress is not a straight line, and his care team change the plan accordingly.',
    ],
    'rehab.unsupervised_workload_breach': [
      '{player}\'s extra work breaches the agreed rehabilitation limits.',
      'More effort does not replace the plan; his care team reassess the deviation.',
      'The unsupervised session creates a real process issue, with health effects assessed separately.',
    ],
    'rehab.missed_session_rebooked': [
      '{player}\'s rehabilitation appointment moves after a scheduling miss.',
      'The session gets a new date rather than a guessed setback.',
      'The provider and {team} repair the calendar gap.',
    ],
    'rehab.home_equipment_delay': [
      'A delivery delay changes {player}\'s home rehabilitation routine.',
      'His rehabilitation team provide an approved interim arrangement while the equipment is missing.',
      'The practical obstacle is a shipment, not a new diagnosis.',
    ],
    'rehab.provider_handover_completed': [
      '{player}\'s rehabilitation follows him through the provider handover.',
      'The new care team receive the actual plan, not a blank starting sheet.',
      'The move changes the clinic while the established checkpoints stay connected.',
    ],
    'rehab.remote_review_approved': [
      '{player} completes an approved remote rehabilitation review.',
      'The appointment travels through a secure connection; hands-on tests remain separate.',
      'His qualified provider finishes the review that can safely happen away from the clinic.',
    ],
    'rehab.plateau_plan_revised': [
      '{player}\'s rehabilitation plan changes after a measured plateau.',
      'The improvement target stays unmet, so the care team revise the approach.',
      'The next stage has a different plan, not a promised faster ending.',
    ],
    'rehab.supervision_graduation': [
      '{player} completes the supervised rehabilitation program.',
      'The goals are met, and the next phase moves into the approved maintenance routine.',
      'Graduation from the program changes the supervision, not every separate eligibility decision.',
    ],
    'wellbeing.travel_sleep_environment_changed': [
      '{team} change {player}\'s travel arrangement after a sleep disruption.',
      'A quieter setup replaces the confirmed disturbance. The box score will tell its own story.',
      'The road routine gets one practical problem removed.',
    ],
    'wellbeing.preventive_check_completed': [
      '{player}\'s scheduled preventive check finds no actionable concern within its scope.',
      'The appointment ends with the actual reviewed areas clear.',
      'One routine health checkpoint is complete, with no claim that every future risk has disappeared.',
    ],
    'wellbeing.mouthguard_fitting': [
      '{player} gets a professionally fitted, approved mouthguard.',
      'The equipment bag gains one carefully fitted piece of protection.',
      'His dental appointment produces gear he can legally use on the court.',
    ],
    'wellbeing.vaccination_visit_completed': [
      '{player} completes his chosen preventive-health appointment.',
      'The clinic visit fits into his calendar under qualified advice.',
      'A routine care choice is complete; no instant basketball benefit is promised.',
    ],
    'wellbeing.minor_illness_absence': [
      'A clinician-assessed illness keeps {player} out of {team}\'s game.',
      'An ordinary health interruption reaches the lineup without becoming an injury diagnosis.',
      'The next availability decision waits for his scheduled review.',
    ],
    'wellbeing.symptom_isolation_started': [
      '{player} follows a temporary separation requirement after assessment.',
      'The precaution changes his contact with {team}; the cause is not yet confirmed.',
      'Qualified staff set the boundary while they assess the symptoms.',
    ],
    'wellbeing.symptom_isolation_ended': [
      '{player} receives clearance to rejoin the specified team activities.',
      'The symptom-related separation ends under the qualified review.',
      '{team} welcome him back within the exact scope of the clearance.',
    ],
    'wellbeing.motion_sickness_route_changed': [
      '{player}\'s travel plan changes after a qualified assessment.',
      '{team} arrange the permitted alternative instead of repeating the difficult journey.',
      'The new route solves the immediate logistics; symptom response remains an assessment question.',
    ],
    'wellbeing.heat_illness_session_stopped': [
      'Qualified staff stop {player}\'s session after a heat-related illness.',
      'The workout ends when the assessed condition requires care.',
      '{team} follow the actual medical plan before considering another session.',
    ],
    'wellbeing.eye_condition_equipment_restriction': [
      '{player}\'s equipment routine changes during care for an eye condition.',
      'The temporary clinical restriction reaches his preparation for {team}.',
      'His next availability update follows the eye-care review rather than speculation.',
    ],
    'wellbeing.migraine_game_withdrawal': [
      '{player} withdraws after a clinician-assessed migraine episode.',
      'The game-day plan changes because the current episode requires care.',
      '{team} adjust the lineup under the qualified recommendation.',
    ],
    'wellbeing.blood_donation_schedule_adjusted': [
      '{player} completes an approved blood-donation appointment.',
      '{team}\'s training schedule follows the qualified activity guidance from the visit.',
      'His voluntary contribution comes with a properly arranged basketball calendar.',
    ],
    'wellbeing.health_supply_travel_replacement': [
      '{player}\'s required health supply is replaced through the authorized care route.',
      'A travel loss interrupts the routine, then qualified staff restore the needed arrangement.',
      '{team} wait for the replacement rather than improvising his care.',
    ],
    'wellbeing.care_followup_overdue_booked': [
      '{player} books the overdue follow-up with his care team.',
      'The missed checkpoint gets a date instead of another delay.',
      '{team} accommodate the catch-up appointment while private details stay private.',
    ],
    'wellbeing.maintenance_success_observed': [
      '{player}\'s long-term care review meets its agreed stability target.',
      'The everyday routine earns a measured good report from the care team.',
      'The reviewed interval is stable; the maintenance work continues beyond it.',
    ],
    'media.day.first_impression_hype': [
      '{player}\'s media-day introduction draws a measured wave of enthusiasm.',
      'The public first look gives {team} supporters an early talking point.',
      'The reception is positive for {player}; the season still supplies its own tests.',
    ],
    'media.social.washed_slander': [
      '{platform}\'s replies put {player} in a decline debate based on media-day footage.',
      '{team} receive a slander cycle rather than an official basketball assessment.',
      'The washed tag trends around {player}, with no performance finding attached.',
    ],
    'media.social.washed_rebuttal': [
      'Supporters challenge the evidence behind the {player} washed claim.',
      '{platform}\'s discussion gains a documented defense of the player.',
      '{team} fans push for actual game evidence before a decline verdict.',
    ],
    'media.day.fitness_change': [
      'A verified comparison records {change} for {player}.',
      '{team} publish an observable update with its measurement context.',
      'The documented change joins {player}\'s preseason record without guaranteeing a basketball effect.',
    ],
    'media.day.chemistry_body_language': [
      'The {look} media-day image starts a body-language debate around {player}.',
      'Audience interpretations of the portrait are opinions about {team}.',
      'The public frame draws chemistry guesses without verifying a locker-room condition.',
    ],
    'media.social.bad_clip_pile_on': [
      '{player}\'s {clip} excerpt crosses the measured criticism threshold.',
      '{platform}\'s response turns one camera-day moment into a public pile-on.',
      'The circulating clip adds pressure around {team} without establishing a season outcome.',
    ],
    'media.social.selective_edit_exposed': [
      'The complete source adds {context} to the {player} clip.',
      'A verified recording corrects the selective-edit claim on {platform}.',
      '{team} have a documented contextual correction to the circulating excerpt.',
    ],
    'media.social.fake_quote_corrected': [
      'Verification rejects "{quote}" as a genuine {player} quotation.',
      '{platform}\'s viral quote graphic receives an attribution correction.',
      'The confirmed media-day record for {team} excludes the fabricated line.',
    ],
    'media.social.player_response_backfire': [
      '{player}\'s public "{quote}" response receives a measured negative reception.',
      'The sampled discussion on {platform} becomes more critical after the reply.',
      '{team} get another communication decision after the response backfires.',
    ],
    'media.social.player_response_redeemed': [
      '{player}\'s {line} accompanies a verified improvement in response sentiment.',
      'The recorded audience on {platform} reacts more favorably after the game.',
      '{team} have an evidence-linked follow-up to the media-day reply story.',
    ],
    'media.social.unflattering_photo_reaction': [
      '{player}\'s {look} portrait receives a measured negative photo reaction.',
      'The public image draws criticism on {platform} without establishing a basketball problem.',
      '{team}\'s portrait reception opens an optional photo-editing or response decision.',
    ],
    'media.social.audience_split': [
      'The measured reaction to {player}\'s media-day appearance is divided.',
      '{platform}\'s sample contains substantial support and criticism.',
      '{team} receive a mixed public first impression rather than a consensus.',
    ],
    'media.social.old_clip_recycled': [
      'The source dates the circulating {player} footage to {date}.',
      '{platform}\'s current reaction cycle is using an older recording.',
      '{team}\'s media-day discussion receives a verified timestamp correction.',
    ],
    'media.social.unexpected_rival_support': [
      '{rival} offer verified public support for {player}.',
      'The statement "{quote}" adds a rival\'s backing to the debate.',
      '{team} receive an unexpected supportive voice on {platform}.',
    ],
    'media.social.meme_to_charity': [
      'The meme-linked effort around {player} delivers {amount} for {cause}.',
      '{platform}\'s media-day joke gains a confirmed charitable follow-up.',
      '{team}\'s public moment now includes a verified contribution receipt.',
    ],
    'media.social.pose_becomes_meme': [
      'The {pose} media-day pose becomes a measured recreation trend.',
      '{player}\'s portrait supplies {platform} with a recognizable public meme format.',
      '{team} receive a pose-driven reaction cycle built from verified remixes.',
    ],
    'media.day.number_reveal_reaction': [
      '{player}\'s newly registered No. {number} receives its public introduction.',
      '{team} confirm the number visible in the media-day presentation.',
      'The reveal adds an official jersey detail to the first-look discussion.',
    ],
    'media.day.new_team_jersey_debate': [
      '{player}\'s {jersey} portrait makes the team change visible.',
      'The first verified {team} uniform image prompts an aesthetic debate.',
      'The jersey reaction introduces the new chapter without grading its basketball outcome.',
    ],
    'media.day.rivals_group_photo': [
      '{player} and {rival} appear together in the verified media-day photo.',
      'The public {pose} arrangement creates a rival-photo talking point.',
      '{team}\'s shared frame records a camera moment without declaring a friendship.',
    ],
    'media.day.hairstyle_reveal': [
      '{player}\'s changed {look} hairstyle receives a public media-day reveal.',
      '{team} publish the verified style update in the approved portrait.',
      'The camera records an appearance change while its cause remains private.',
    ],
  },
  fragments: {
  },
});
