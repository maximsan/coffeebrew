# Brew Master (Expo)

React Native app for guided coffee brewing. Project root for Metro / Expo is this directory.

**[V1](GLOSSARY.md) navigation:** two tabs — **Home** and **More**. No login required to use the app.

- **Home:** recipes → recipe detail → brew session → brew complete. Recipe detail also opens dose editing. Home and More both open brew history.

**Recipe catalog:** bundled JSON at `src/data/recipes.json` (edit + ship with releases). V1 has no recipe creation.

**Brew history:** Completed sessions are saved to a local log, newest first, keeping only the most recent ones (`brewHistoryService`, key `brew_master_brew_history_v1`). Not synced — device-only. Optional tasting notes are a later feature.

## Brew timer (V1)

- **Model:** **Countdown** per step. The duration comes from the step’s `time` field (`M:SS` → seconds), with a small floor so the control stays usable on short steps.
- **Backgrounding:** The UI uses a **wall-clock deadline** (end timestamp). When you come back to the app, remaining time is recomputed from that deadline, so brief interruptions don’t silently “lose” ticks. The OS may still throttle or suspend JS in edge cases—treat the timer as a guide, not a precision instrument.
- **Flow:** Timers do **not** auto-start when you open the brew — tap **Start** when you begin each step. When the countdown hits **zero**, the session **advances automatically** to the next step (or completion). **Skip ahead** / **Finish early** uses a light impact haptic for the optional shortcut.
- **Feedback:** When the countdown hits zero, the app fires **haptic** success (with vibration fallback) before advancing.

## Everyday command

From this directory:

```bash
npm install
npm run start
```

That runs the Expo dev server (Metro). Press `i` for iOS Simulator, `a` for Android emulator, or scan the QR code with **Expo Go** on a phone.

Other ways to run the app:

```bash
npm run start:ios    # Dev server + Expo Go on the iOS simulator
npm run ios          # Native build with Xcode, then run on the simulator
```

The native build needs Xcode and several gigabytes of free disk space. It generates an `ios/` folder, which git ignores.

## Package manager

This project uses npm. Keep `package-lock.json` as the only lockfile.

## Verification (CI / before commit)

```bash
npm run check
```

The aggregate check runs TypeScript, Expo ESLint, Prettier formatting checks, Jest, and Expo Doctor.

For focused local checks:

```bash
npm run typecheck
npm run lint
npm run lint:fix
npm run format:check
npm test -- --runInBand
npm run doctor
```

## Run on a physical iPhone (Phase 1)

1. Install **Expo Go** from the App Store.
2. Connect the phone to the same Wi‑Fi as your Mac (or use USB with Expo’s tunnel mode if the network blocks LAN discovery).
3. `npm run start`, then scan the QR from the terminal or Dev Tools in the browser.
4. For **TestFlight / App Store** builds later, you will use a **development or production build** (e.g. EAS Build) with the bundle id set in `app.json` — Expo Go is only for development.

## App identifiers (TestFlight-ready naming)

| Setting                | Value                                  |
| ---------------------- | -------------------------------------- |
| Display name           | Brew Master (`app.json` → `expo.name`) |
| Expo slug              | `brew-master`                          |
| URL scheme             | `brewmaster`                           |
| iOS bundle id          | `com.brewmaster.app`                   |
| Android application id | `com.brewmaster.app`                   |

Change the bundle / package identifiers before shipping if you use your own reverse-DNS domain (e.g. `com.yourname.brewmaster`).

## Assets

Icons and splash live in `assets/`. Replace `icon.png`, `splash-icon.png`, and `adaptive-icon.png` when you have final branding; keep Expo’s recommended sizes.

## Related docs

- Project terms: `GLOSSARY.md`
- V1 scope: `docs/v1_phase0_scope.md`
- Checklist: `docs/v1_solo_checklist.md`
- Code postponed past V1: `docs/v2_backlog.md`
- Product ideas for postponed areas: `docs/design/`. Its `files/` folder holds mockups from before V1 was scoped; some show features outside V1.
