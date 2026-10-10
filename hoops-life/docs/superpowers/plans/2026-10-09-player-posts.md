# Player Posts Implementation Plan

Use executing-plans inline with one final reviewer. User authorized continuous development and requested this media detail.

Goal: public choices and other players' voices that respond to actual events and persist in the world.
Architecture: `HL.PlayerPosts` domain, actual-game hooks and lifecycle cancellation; `PlayerPostUI` supplies photo cards/composer/reply choices in existing media hubs. Existing World memories and Career reputation provide consequences.

## Constraints and review focus
- Actual original speaker/team/game facts retained; no attributed real-world footage.
- Ownership, daily/seven-day cadence, one reply and Live freeze validate before mutation.
- Challenge resolves only its recorded actual fixture; departure cancels immediately.
- DNP/loss cannot become a personal victory; deterministic NPC generation preserves RNG.
- Historical voice and created-player faceless identity preserved; bounded save state.

- [ ] Write and observe failing domain assertions for public choice/reply ownership, real evidence, cadence, exact fixture, DNP/departure, save/load and RNG.
- [ ] Build domain and integrate actual results, roster departure cancellation and World memory.
- [ ] Build composer and photo cards with recorded sources, distinct voices and replies.
- [ ] Browser proof for Career/Franchise actual post/reply/save/mobile and inspect photographs.
- [ ] One fresh final review, fix Important findings, run final checks, update roadmap and push GitHub.
