# Player photos and reusable jerseys

Real player headshots remain the primary identity layer. Team-specific photo overrides and photographic jersey cutouts change the uniform presentation without replacing players with drawn faces.

## Bundled source photographs

Verified HTTPS downloads on 2026-10-10:

- `media/players/stephen-curry-archive.png`: NBA headshot, https://cdn.nba.com/headshots/nba/latest/1040x760/201939.png
- `media/players/lebron-james-archive.png`: NBA headshot, https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png
- `media/players/lal-logo.png`: ESPN, https://a.espncdn.com/i/teamlogos/nba/500/lal.png
- `media/players/gsw-logo.png`: ESPN, https://a.espncdn.com/i/teamlogos/nba/500/gs.png

Other existing NBA players use their NBA IDs and the live NBA headshot URL. Missing photos use neutral initials, with no illustrated person. Latest headshots are archive/source photographs, not season-specific historical evidence. Headshot and logo rights remain with their original owners.

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
