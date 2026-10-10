# Hoops Life image workflow

Keep real NBA player headshots. The game now uses separate photographic jersey cutouts for each current team, with their own colors, wordmark and trim and no number baked in. See [docs/IMAGE_SOURCES.md](docs/IMAGE_SOURCES.md) for sources and override keys.

When adding a jersey asset, preserve the transparent garment-only frame: no head, skin, arms, body or background. Remove all numbers and player names; retain the team design. Match the neck opening and shoulder placement to the existing cutouts so many real headshots can share it. Avoid drawn/vector uniforms and do not use a tinted white template as the team artwork.

For a full alternate-team portrait, edit a real source photograph while preserving the player’s identity and photographic lighting. Change only the uniform, keep the background transparent, and record it as a fictional concept asset. A matching full photo can override the composited version.

Future life images should be separate reusable scenes/items/fictional people. Assets are optional; the game must keep functioning when a file is absent. Do not replace the actual created player with an unrelated generated face.
