# ChatGPT prompt: Hoops Life image pack

Real players already show their official NBA.com headshots and real team logos load from ESPN
automatically when you're online. You can ALSO use your own images of real players (see
"Real player portraits" at the bottom) and they will replace the official headshot everywhere.
The main pack below covers everything else: generated players, people in your story, scenes,
cars, houses and items.

Paste the prompt below into ChatGPT (image generation). Ask for one folder at a time if it stops early.
Put the files into `hoops-life/assets/` keeping the folder names, then save the manifest file it writes
as `hoops-life/assets/manifest.js`. The `assets/` folder is ignored by git, so it stays on your computer.

---

```
I'm building a personal, offline basketball life/career simulator and need an image pack. Please generate the images below in batches, then give me a single .zip with this exact folder structure and file names, plus a file named manifest.js.

STYLE (keep consistent across everything): semi-realistic digital painting, cinematic sports-broadcast lighting, rich but natural color, shallow depth of field, no text, no watermarks, no logos, no real people, no real brands. Portraits 512x512 PNG; scenes and items 1024x576 JPG.

1. players/ — 60 fictional basketball player portraits, head and shoulders, plain dark gradient background, plain sleeveless jersey with no logo or number. Mix of skin tones, hairstyles (braids, fades, afros, buzz cuts, long hair, headbands), ages 18–38, some beards, a few with goggles or a mouthguard. Files: player_01.png … player_60.png
2. people/ — fictional portraits: coach_01–08 (suits/polos, ages 35–70), agent_01–04, reporter_01–06 (holding a microphone), owner_01–04, parent_01–08 (mothers and fathers, ages 40–60), partner_01–08 (romantic partners, ages 22–40), kid_01–04 (children), teammate_01–04, doctor_01–02, lawyer_01–02.
3. scenes/ — scene_press_conference, scene_locker_room, scene_practice_gym, scene_empty_arena, scene_packed_arena, scene_draft_stage, scene_parade, scene_hospital, scene_rehab_gym, scene_nightclub, scene_courtroom, scene_car_crash (no gore, damaged car at night with lights), scene_high_school_gym, scene_college_arena, scene_mansion_party, scene_bedroom_night, scene_private_jet, scene_retirement_ceremony, scene_hall_of_fame, scene_streetball, scene_funeral, scene_wedding, scene_hospital_birth, scene_airport, scene_film_room, scene_weight_room, scene_contract_signing, scene_trade_call (GM office at night), scene_owner_box, scene_tv_studio, scene_podcast_studio, scene_childhood_driveway_hoop, scene_1960s_arena (black and white photo style), scene_1980s_arena (film grain), scene_1990s_arena (VHS look)
4. cars/ — 25 generic unbranded cars, 5 per tier: used_01–05 (old beaters), sedan_01–05, luxury_01–05 (luxury SUVs and sedans), supercar_01–05, hypercar_01–05. 3/4 front view, studio or street at dusk.
5. homes/ — home_apartment_01–02, home_starter_01–02, home_suburban_01–02, home_penthouse_01–02, home_beach_01–02, home_mansion_01–03, home_ranch_01
6. items/ — on dark backgrounds: item_watch_01–03, item_chain_01–03, item_ring_championship (generic, no logos), item_yacht, item_jet, item_sneakers_01–03 (generic), item_trophy_mvp (generic), item_trophy_championship (generic), item_microphone, item_contract, item_pill_bottle, item_syringe (medical), item_dog, item_cat
7. ui/ — ui_title_bg_01–02 (moody arena), ui_slot_machine_bg, ui_office_bg, ui_body_front and ui_body_back (plain anatomical outline for an injury diagram, white lines on transparent background, PNG), badge_bronze, badge_silver, badge_gold, badge_hof, badge_legend (empty badge frames, PNG with transparency).

manifest.js must look exactly like this (one line per file, key = folder name without the "s" + "." + file name without extension):
window.HL_ASSETS = {
  "player.player_01": "players/player_01.png",
  "people.coach_01": "people/coach_01.png",
  "scene.scene_press_conference": "scenes/scene_press_conference.jpg",
  "car.supercar_01": "cars/supercar_01.jpg",
  "home.home_mansion_01": "homes/home_mansion_01.jpg",
  "item.item_watch_01": "items/item_watch_01.jpg",
  "ui.ui_title_bg_01": "ui/ui_title_bg_01.jpg"
};
```

---

## Real player portraits (optional)

Any image you put in `assets/real/` replaces that player's headshot in every save. Add one line per
player to `assets/manifest.js` using the player's name in lowercase with dashes:

```
"real.michael-jordan": "real/michael-jordan.png",
"real.nikola-jokic": "real/nikola-jokic.png",
```

You can use photos you find yourself, or ask ChatGPT with the prompt below. (ChatGPT sometimes declines
images of specific real people. If it does for someone, the official NBA.com headshot is used instead.)

```
Create stylized basketball trading-card portraits (head and shoulders, painted illustration style,
dark gradient background, no text, no team logos, no jersey numbers) of these NBA players, one image
each, 512x512 PNG, named with the player's name in lowercase with dashes (e.g. michael-jordan.png).
Then give me a .zip of the images plus a manifest snippet with one line per image in this format:
"real.michael-jordan": "real/michael-jordan.png",

Players: Michael Jordan, Kareem Abdul-Jabbar, Bill Russell, Wilt Chamberlain, Magic Johnson, Larry Bird,
Oscar Robertson, Jerry West, Elgin Baylor, Bob Cousy, Julius Erving, Moses Malone, Hakeem Olajuwon,
Shaquille O'Neal, Tim Duncan, Kobe Bryant, LeBron James, Stephen Curry, Kevin Durant, Dirk Nowitzki,
Kevin Garnett, Charles Barkley, Karl Malone, John Stockton, Isiah Thomas, David Robinson, Patrick Ewing,
Scottie Pippen, Allen Iverson, Dwyane Wade, Chris Paul, Steve Nash, Jason Kidd, Gary Payton,
Giannis Antetokounmpo, Nikola Jokic, Shai Gilgeous-Alexander, Luka Doncic, Victor Wembanyama
(continue with any players you want)
```
