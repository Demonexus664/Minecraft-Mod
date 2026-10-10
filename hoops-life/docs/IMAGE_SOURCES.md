# Player photos and reusable jerseys

Real player headshots remain the primary identity layer. Team-specific photo overrides and photographic jersey cutouts change the uniform presentation without replacing players with drawn faces.

## Bundled source photographs

Verified HTTPS downloads on 2026-10-10:

- `media/players/stephen-curry-archive.png`: NBA headshot, https://cdn.nba.com/headshots/nba/latest/1040x760/201939.png
- `media/players/lebron-james-archive.png`: NBA headshot, https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png
- `media/players/lal-logo.png`: ESPN, https://a.espncdn.com/i/teamlogos/nba/500/lal.png
- `media/players/gsw-logo.png`: ESPN, https://a.espncdn.com/i/teamlogos/nba/500/gs.png

Players without a bundled portrait use their NBA IDs and the live NBA headshot URL. Missing photos use neutral initials, with no illustrated person. Latest headshots are archive/source photographs, not season-specific historical evidence. Headshot and logo rights remain with their original owners.

Additional verified HTTPS NBA downloads on 2026-10-09 (local date): Michael Jordan (`893.png`), Sam Perkins (`64.png`), Michael Porter Jr. (`1629008.png`), and Day’Ron Sharpe (`1630549.png`), from the same `https://cdn.nba.com/headshots/nba/latest/1040x760/` path. Original PNGs are bundled under `media/players/` as archive headshots so draft/relationship examples can show real people offline; no image edits or certificate bypasses were used.

The Live Game pass also bundles unmodified source headshots for Kevin Durant (`201142.png`), Shai Gilgeous-Alexander (`1628983.png`), Amen Thompson (`1641708.png`), Alperen Şengün (`1630578.png`), Nikola Jokić (`203999.png`), and Bill Russell (`78049.png`), verified using the same HTTPS source and labeled as archive photos. These support current and historical examples without depending on external image access at runtime.

## Generated game artwork

`media/players/stephen-curry-lal-concept.png` is a generated fictional Lakers portrait based on Curry’s NBA source headshot. It demonstrates an optional full alternate-team cutout and does not assert a real transaction.

`media/uniforms/<team-code>.png` contains one generated photographic garment cutout for each of the 30 current NBA franchises. Each has its own team colors, wordmark and trim, with the player/skin/background and jersey number removed. The renderer places the garment over the real headshot and handles the number separately. These are team-inspired game assets, not official merchandise photographs or a complete archive of every historical uniform variant. They are not a white jersey tinted in the browser.

The original generated files are retained under `/workspace/generated_images`; copied game assets and their mapping are tracked. The abandoned white-template prototype is not used by the game.

## Custom overrides

Place optional photographs under `assets/` and define `window.HL_ASSETS` in `assets/manifest.js`. Existing overrides win. Keys use a normalized name slug and lowercase team abbreviation:

```js
window.HL_ASSETS = {
  'real.stephen-curry.lal.2025': 'real/curry-lakers-2025.png',
  'real.stephen-curry.lal': 'real/curry-lakers.png',
  'real.stephen-curry': 'real/curry-headshot.png',
  'jersey.lal': 'jerseys/lakers-numberless.png',
};
```

Season + team photo overrides take priority, followed by team photo overrides, a generic player source photograph and the NBA CDN. A full matching team photo does not get a second jersey drawn over it. Missing custom photographs retry the NBA source; a missing jersey leaves the real source portrait visible. The cutout should match the provided transparent garment canvas/framing. Number changes update the separate layer, so no per-player/per-number jersey image is required.

## Expanded local portrait library (2026-10-09 local date)

`data/portraits.js` adds 596 unmodified NBA CDN archive portraits under `media/players/library/`. Small roster portraits use 260×190 originals; selected historical stars use 1040×760 originals. The download checked 1,020 additional candidates and rejected 424 unavailable or generic-placeholder results. Identical files shared by three or more distinct NBA IDs were excluded. Older curated sharp portraits and custom team/season overrides retain priority.

Four further unmodified ESPN source PNGs are bundled for Kobe Bryant (ESPN ID 110), Shaquille O’Neal (614), Tim Duncan (215) and Kevin Garnett (261), from `https://a.espncdn.com/i/headshots/nba/players/full/<id>.png`. These were visually inspected as source images and through the game renderer. The expanded library therefore adds 600 photographs, for 612 bundled player portraits in total. Missing players continue to use their live source URL or neutral initials. These are source/archive portraits, not season-specific evidence or footage.

`docs/portrait-sources.json` records source URL, local path, resolution, byte count and SHA-256 for all 600 additions, plus unsuccessful candidates. `node tools/test-portraits-browser.cjs` verifies every local source hash, registry mapping and browser decode, preserves the sharper Curry override, and captures desktop/mobile galleries.

`data/jersey-fits.js` records person-specific garment offsets and scale where a portrait has been inspected. Other portraits use the lower default position; the .98 default scale is retained. Matching complete team photos bypass the garment. Fit settings follow the person across simulated trades and number changes. These are visual approximations for cropped bust photos; remaining portraits and historical uniform variants still need individual artwork/fit refinement.

Thirteen star portraits now use original 1040×760 NBA sources, downloaded by tools/upgrade-portrait-cutouts.py without image modification. All 600 additions passed hash and decode validation. These are real bust cutouts, not full-body 2K renders. NBA gallery and search pages returned HTTP 403 here; no claim is made to have inspected their blocked artwork.
