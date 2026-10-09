# ChatGPT prompt: Hoops Life media content packs

Copy everything inside the box below into ChatGPT. When it gives you files, save them into
`hoops-life/packs/` with the exact file names it uses (`media-pack-1.js`, `media-pack-2.js`, …,
plus `ideas-1.md`). The game loads `media-pack-1.js` through `media-pack-20.js` automatically.
Ask for more packs any time ("make media-pack-4.js, focus on off-court scandals"). Every pack adds variety.

---

```
You are writing content for "Hoops Life", a text-based basketball career/franchise simulator (like NBA 2K MyNBA + MyCareer + BitLife). The game generates news headlines and media reactions from what actually happens in the sim. I need you to write a HUGE variety of lines so players almost never see the same text twice.

## OUTPUT FORMAT (must be exact — the game loads these files directly)
Produce downloadable JavaScript files named media-pack-1.js, media-pack-2.js, etc. (about 1,500–3,000 lines of content per file is great). Each file must look exactly like this:

window.HL_PACKS = window.HL_PACKS || [];
HL_PACKS.push({
  name: 'media-pack-1',
  lines: {
    'game.blowout': [
      '{winner} {~crush} {loser} by {margin}',
      '...more...'
    ],
    'game.react.blowout_loser_meme': [ '...' ],
    // more situation keys...
  },
  fragments: {
    beat: [ 'outclass', 'handle' ],   // optional: extra words for fragment pools
  },
});

Rules for the file:
- Valid JavaScript only. Strings in single quotes; escape apostrophes as \' (e.g. 'can\'t').
- Keys are situation keys from the catalog below, spelled exactly.
- Put an era suffix on a key for old-era versions: 'game.blowout@60s', '@70s', '@80s', '@90s', '@00s'. Era lines REPLACE modern lines in that era, so they must sound like that time (60s/70s = newspaper and radio language, no slang, no social media; 80s = newspaper/TV; 90s = cable sports shows, call-in radio, newspapers; 00s = blogs, message boards, early ESPN). Modern lines (no suffix) = 2010s–now: social media, podcasts, debate shows.

## PLACEHOLDERS
- {name} placeholders are filled by the game. ONLY use the placeholders listed for each key. A line that uses any other placeholder is thrown away.
- {~pool} inserts a random word/phrase from a fragment pool so lines vary even more. Available pools (use the exact form shown):
  {~beat} present-tense verb, plural subject: "beat, take down, handle, knock off…"  e.g. "{winner} {~beat} {loser}"
  {~crush} big-win verb: "crush, demolish, rout…"   {~edge} close-win verb: "edge, escape, squeak past…"
  {~scored} "dropped, poured in, erupted for…" (past tense, followed by a number)
  {~big} adjective: "monster, vintage, ridiculous…"   {~night} noun: "night, performance, clinic…"
  {~opener} hot-take opener: "Let me be very clear:"   {~hype} "is HIM", "cannot be guarded right now"
  {~doubt} "is fool's gold", "is a regular-season merchant"   {~sources} "Sources:", "League sources say"
  {~emoji_hype} 🔥 etc. (modern only)   {~emoji_sad} 💀 etc. (modern only)
  {~stat_open} "The numbers do not lie:"   {~old_open} "Back in my day"   {~injury_sad} "Brutal news."
  {~team_mood_good} "the vibes are immaculate"   {~team_mood_bad} "the locker room is tense"
  {~streak_w} "red-hot"   {~streak_l} "in freefall"   {~thriller} "classic"   {~beatdown} "statement"
  {~tight} "nail-biter"   {~carry} "power, lift, carry" (verb)   {~eliminate} "knock out"   {~shock} "stun"
  {~weeknight} "Tuesday, school night"   {~offseason_q} "Big questions this summer."
  You may ADD new words to any of these pools in the "fragments" section (same grammatical form!).

## STYLE RULES
- Headlines: present tense, like real sports headlines ("Celtics rout Knicks", not "Celtics routed Knicks"). Team names are plural ("the Heat win", "the Magic beat").
- Reactions are written in the voice of the role named in the key: hype = loud TV debate host / hot take; stats = calm analytics writer; insider = breaking-news reporter ("Sources:"); beat = local beat writer; oldhead = retired player, old-school; meme = meme account / jokester; homer = team's own superfan; hater = rival troll fan; odds = betting account; fan = regular fan.
- Mix tones: funny, savage, wholesome, dramatic, analytical, petty, respectful. Some short (5 words), some long (2–3 sentences).
- Do NOT use real media personalities' names, real brands as sponsors, slurs, or sexual content. Player and team names only come from placeholders.
- Lines must make sense for ANY player/team (don't assume position, age, race, nationality or gender of the subject beyond what placeholders say). Use "he/his" for players.
- Avoid repeating the same sentence structure. Aim for at least 40 lines per key (80+ for the common ones marked ★), plus at least 10 per key for each old-era suffix where it makes sense.

## SITUATION CATALOG (key: placeholders)
Common game placeholders: {winner} {loser} {wcity} {lcity} {wabbr} {labbr} {ws} {ls} {margin} {wrec} {lrec} {wstreak} {lstreak} {arena}
Star placeholders (best player of the game): {player} {plast} (last name) {pposs} (possessive, e.g. "Curry's") {team} {opp} {pts} {reb} {ast} {fgm} {fga} {ts} (true shooting %) {tov} {min} {line} (e.g. "31 points, 12 rebounds and 9 assists")

GAME HEADLINES
- game.recap ★: game placeholders only
- game.recap.starwin ★ / game.recap.starloss ★: game + star (starloss = the star's team LOST)
- game.close ★, game.blowout ★, game.upset, game.overtime (+ {ots} = "overtime"/"2 overtimes", {Ots} capitalized)
- game.streak.win ({wstreak}), game.streak.loss ({lstreak})
- game.star40.win / game.star40.loss / game.star50.win / game.star50.loss / game.tripledouble.win / game.tripledouble.loss: game + star
GAME REACTIONS
- game.react.star_hype ★ (hype): star placeholders
- game.react.star_stats (stats): star placeholders
- game.react.volume_hater (hater): star placeholders — star took a ton of shots inefficiently
- game.react.blowout_loser_meme ★ (meme): {loser} {margin}
- game.react.blowout_oldhead (oldhead): {loser} {margin}
- game.react.losing_streak_beat (beat): {loser} {lcity} {lstreak}
- game.react.win_streak_fan ★ (homer): {winner} {wcity} {wstreak}
- game.react.ot_meme (meme): {ots} {winner} {loser}
INJURIES ({player} {plast} {team} {tposs} {pos} {injury} {ainjury} (with a/an) {games} {weeks} {weekstr} e.g. "3 weeks")
- injury.headline ★, injury.star (star player), injury.long (out for months/season)
- injury.react.insider ★ (insider), injury.react.odds (odds), injury.react.fan (homer, supportive)
TRANSACTIONS
- transaction.hardship ({team} {player}), transaction.hardship.beat ({team} {healthy})
- trade.headline ★ ({team} {opp} {player} {assets}), trade.blockbuster, trade.fleeced ({winner_team} {loser_team} {player}), trade.react.winner_fan, trade.react.loser_fan, trade.react.grade (stats: {team} {grade} {player})
- signing.max ({player} {team} {years} {amount}), signing.vet_min ({player} {team} {age}), signing.ring_chaser ({player} {team} {age} {teams_count}), signing.react.hype, signing.react.hater
- request.trade ({player} {team}), holdout ({player} {team} {amount}), extension ({player} {team} {years} {amount}), waived ({player} {team})
- draft.pick ({player} {team} {pick} {college}), draft.steal, draft.bust ({player} {team} {pick} {years}), draft.react.fan
AWARDS ({player} {plast} {team} {season} {pts} {reb} {ast} {rec} {nth} e.g. "3rd", {runnerup} {rlast}, {label} = award name)
- award.mvp ★, award.mvp.repeat, award.mvp.react (hype), award.mvp.snub (hater, uses {runnerup}/{rlast})
- award.dpoy, award.roy, award.smoy, award.mip, award.coy ({coach} {team} {rec}), award.allstar ({player} {team} {n})
PLAYOFFS ({winner} {loser} {lposs} {score} e.g. "4-2" {round} {next} {wseed} {lseed})
- series.end ★, series.sweep, series.game7, series.upset, series.react.winner_fan (homer), series.react.loser_beat (beat)
- champion ({team} {city} {opp} {oposs} {score} {year} {n} titles), champion.repeat, champion.react.fan ★, champion.react.fmvp (hype: {fmvp} {flast}), champion.react.loser (meme: {opp})
- phase.regular_end ({east} {west}), phase.playoffs_start ({year}), season.start ({season}), season.react.favorites (odds: {f1} {f2} {f3})
RETIREMENT
- retire ({player} {plast} {age} {rings} {mvps}), retire.react (oldhead), unretire ({player} {age} {team}), unretire.react.hater
NARRATIVE LABELS — media talking about a player's reputation ({player} {plast} {team} {teams_count} {rings} {age} {stat} — use only what fits)
- narrative.ring_chaser ★ (changes teams to chase titles), narrative.journeyman, narrative.loyal_icon, narrative.choker, narrative.clutch, narrative.stat_padder, narrative.injury_prone, narrative.bust, narrative.late_bloomer, narrative.party_animal, narrative.locker_room_cancer, narrative.villain, narrative.hometown_hero, narrative.ringless_great, narrative.overpaid, narrative.offense_only (great scorer, terrible defender), narrative.defense_only (elite defender, no offense), narrative.goat_debate ★, narrative.washed (aging star declining), narrative.redemption (comeback story)
OFF-COURT / LIFE (Player Career) ({player} {plast} {team} {city} {age} + noted extras)
- life.party.viral, life.party.hangover_game (played badly after partying: {pts} {fga}), life.dui, life.arrest ({charge}), life.car_crash ({car} {injury}), life.car_purchase ({car} {price}), life.mansion ({city} {price}), life.ped_suspension ({games}), life.gambling, life.social_beef ({rival}), life.trash_talk ({rival}), life.fight ({rival}), life.suspension ({games} {reason}), life.charity ({cause} {amount}), life.business ({business}), life.bankrupt, life.shoe_deal ({amount}), life.endorsement_lost ({reason}), life.marriage, life.divorce, life.baby, life.family_death ({relation}), life.mental_health, life.hometown_return
PRESS CONFERENCE QUOTES — what the player/coach SAYS, by tone, then media reaction ({player} {team} {opp} {topic})
- presser.humble, presser.confident, presser.cocky, presser.deflect, presser.honest, presser.fiery, presser.funny, presser.no_comment
- presser.react.praise, presser.react.backlash, presser.react.meme
LEAGUE OFFICE ({team} {rule} {season} {player} as noted)
- rules.change.react.hype / .stats / .oldhead / .meme ({rule} = description of the rule change)
- league.superteam_outrage ({team} {stars}), league.investigation ({team}), league.fine ({team} {amount}), league.lockout ({season}), league.named_rule ({player} {rule}) e.g. "the {plast} Rule", league.tanking ({team} {rec})
MEDIA DAY — preseason takes on how players look and sound ({player} {plast} {team} {age} {oldteam} {change} = OVR change since last season, {weight} = weight change in lbs, {years} = years in league)
- mediaday.looks_washed ★ (older player declining: "he looks washed"), mediaday.best_shape (claims best shape of his life), mediaday.looks_bigger (added muscle), mediaday.lost_weight, mediaday.new_team_jersey ★ (looks weird/great in the new uniform: {oldteam}), mediaday.contract_year, mediaday.rookie_hype, mediaday.comeback_from_injury ({injury}), mediaday.quote_confident, mediaday.quote_humble, mediaday.quote_delusional (wildly overconfident quote), mediaday.react.slander, mediaday.react.respect
SOCIAL FORMATS — short platform-native posts (modern era only), write them like real captions/titles
- tiktok.slander ★ ({player} {plast} {team} {stat} {fail} = e.g. "0-for-9 from three"), tiktok.hype_edit ★ ({player} {pts} {moment}), tiktok.pov ("POV: you're guarding {player}…"), tiktok.fan_cam, tiktok.reaction, tiktok.sound (fake sound names like "original sound – hoopsedits"), tiktok.comments (short top comments under a clip)
- youtube.title ★ (clickbait video titles: "Is {player} WASHED? (The Truth)"), youtube.analysis_title, youtube.podcast_clip_title
- ig.caption (team/player post captions), ig.comments
- meme.caption ★ (top text / bottom text over a player image: {player} {team} {opp} {stat})
- quote_tweet.ratio (replies that ratio a bad take), comment_section.toxic, comment_section.wholesome

COACHING / FRONT OFFICE ({coach} {team} {rec} {gm} {owner})
- coach.fired ★, coach.hired, coach.hot_seat, gm.fired, owner.meddling, team.chemistry_bad, team.chemistry_good, team.leak ({player} {team})

## PART 2 — IDEAS (separate file ideas-1.md)
After the packs, write ideas-1.md: brainstorm 150+ NEW situations a basketball life/franchise sim should react to that are NOT in the catalog above (on-court, off-court, family, money, fame, legal, health, rivalries, records, milestones, rule changes, eras, coaching, ownership, fans, weird/funny/chaotic things a player might try). For each: a proposed key, what triggers it, which placeholders it would need, and 3 example lines. Group them by category. Be creative — think of things players would actually try just to see what happens.

Start with media-pack-1.js covering every key in the catalog (focus on ★ keys and modern lines), then media-pack-2.js (old-era @60s/@70s/@80s/@90s/@00s variants for the game, injury, award, playoff and champion keys), then media-pack-3.js (narrative, off-court/life, press conference, league office and coaching keys), then ideas-1.md.
```
