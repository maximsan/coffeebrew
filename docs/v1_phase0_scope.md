# Phase 0 — V1 scope locked

This document completes **Phase 0** from `docs/v1_solo_checklist.md`. Revise it if strategy changes; keep it short.

---

## V1 product sentence (one paragraph)

**Brew Master v1 helps people who brew coffee at home follow a small library of trusted recipes step by step, time each stage with confidence, and see a simple history of what they brewed—without needing an account or a social feed.** The app exists to reduce guesswork during the actual brew and to build a light habit of repeating what worked.

---

## Explicitly out of v1

Ship v1 **without** the following. Revisit any item only after the core brew → timer → history loop is live and tested.

| Area                   | Out of v1                                                                                                                                                |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Community**          | Feed, posts, comments, sharing to social, other users’ content                                                                                           |
| **AI**                 | Recipe analysis, bean photo recognition, personalized recommendations, any paid model API                                                                |
| **Gamification**       | XP, badges, levels, challenges, “coffee passport,” Bean Bank                                                                                             |
| **Accounts (default)** | No login required for v1. Optional: add **Sign in with Apple** or email **later** if you need sync or backup—treat as post-v1 unless you change this doc |
| **Recipe authoring**   | No in-app recipe editor, image upload to a server, or publishing user recipes                                                                            |
| **Commerce**           | Shop links, affiliate flows, roaster integrations                                                                                                        |
| **Backend / sync**     | No custom API, no multi-device sync, no cloud recipe catalog in v1                                                                                       |
| **Android**            | iOS first; Android after v1 is stable on TestFlight (see checklist Phase 9)                                                                              |

**In scope for v1:** curated recipes (read-only in the app), guided brew flow, timer, local brew history, polish and TestFlight on iOS.

---

## Data approach for v1

**Decision:**

1. **Recipe catalog:** **Bundled static data** (e.g. `src/data/recipes.json` or a TypeScript module). Shipped with the app; no CMS in v1. Update recipes by app releases until you add a server.
2. **Brew history:** `**AsyncStorage`** (or SQLite later if needed) — append-only log: recipe id, timestamps, optional notes/rating. **Device-local only.\*\*
3. **User-edited recipes:** **Out of v1** — users do not create or edit recipe definitions in the app for v1.

This matches “curated content + persistence for what the user actually did,” without pretending to support UGC or sync.

---

## Phase 0 checklist (complete)

- One-paragraph v1 product sentence — see above
- Explicit out-of-v1 list — see table + bullets
- Data approach — bundled recipes + local history store; no recipe editing in v1

---

_Next: Phase 1 — project hygiene & iOS runway (`docs/v1_solo_checklist.md`)._
