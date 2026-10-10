# V1 solo checklist — Brew Master

Tracks progress toward [V1](../GLOSSARY.md). Scope is locked in `docs/v1_phase0_scope.md`. Adjust dates to your calendar; order matters more than week labels.

---

## Phase 0 — Lock the slice (before coding)

**Completed — see `docs/v1_phase0_scope.md`.**

- [x] Write a one-paragraph **v1 product sentence** (who it’s for, one job-to-be-done).
- [x] List **explicitly out of v1**: community tab, AI screens, gamification, accounts (or keep “account later” as a decision).
- [x] Choose **data approach for v1**: bundled JSON recipes only, or bundled + AsyncStorage edits (pick one).

---

## Phase 1 — Project hygiene & iOS runway

**Repo done:** `app.json` (display name Brew Master, slug `brew-master`, scheme `brewmaster`, iOS `bundleIdentifier` + Android `package` `com.brewmaster.app`, light splash `#FAF6EF`), `README.md`, `npm run typecheck`, `tsconfig` includes root entry files, strict TypeScript passes.

- [ ] Confirm **Expo SDK / RN** run on a physical **iPhone** (not only simulator) — _do this on your device_.
- [x] Set **app name, bundle id, icon, splash** so TestFlight is possible later.
- [x] Turn on **TypeScript strict** if not already; fix any easy errors in files you touch.
- [x] Add **one command** you always use: `npm run start` (or `npx expo start`) documented in `README.md`.

---

## Phase 2 — Navigation: one happy path

**Completed in repo:** Tabs are **Home** + **More** (`MoreScreen` links to brew history). **Auth gate removed** — app opens on the main tabs (v1 scope: no required login). Flow: `HomeScreen` → `RecipeDetails` (→ `EditDose`) → `BrewSession` → `BrewComplete`; `History` from Home or More (`src/navigation/Navigation.tsx`, `src/screens/home/*`). Stack headers on recipe + brew for system back. Single `NavigationContainer` in `App.tsx` only.

- [x] **Hide or remove** tabs not in v1 (e.g. Community, Create, Profile sub-menus) — or replace with a single “More / Settings” placeholder.
- [x] **Home** → recipe list (or featured + list) → **recipe detail** → **brew session** (new screen or modal).
- [x] **Back navigation** works everywhere in that path (no dead ends).
- [x] **No duplicate `NavigationContainer`** (keep a single root container in `App.tsx`).

---

## Phase 3 — Recipe content (curated, boring, correct)

**Completed in repo:** `src/data/recipes.json` holds the curated recipes (steps with time hints, `brewMethod`, descriptions). Images are bundled JPEGs in `assets/images/recipes/` (refresh with `npm run download-recipe-images`). `recipeService` loads the catalog from that file, persists **user-created** recipes separately (`brew_master_user_recipes_v1`), removes legacy `recipes` AsyncStorage, and blocks edit/delete of built-in ids. List/detail screens already use `recipeService` only.

- [x] **10–20 recipes** in one module (e.g. `src/data/recipes.json` or TS constant) with: title, method, steps with **time hints**, short description.
- [x] **No dependency** on mock `https://example.com` images — use local assets or a stable CDN; **placeholder** if needed.
- [x] Wire **recipe list + detail** to this data only (remove or bypass extra mock layers if confusing).

---

## Phase 4 — Brew session + timer (core value)

**Completed in repo:** Brew screen shows current step, **Next step** preview card (time + text), hint, **countdown** `BrewTimer` (deadline-based, resync on foreground — see `README.md`). Countdown does not auto-start; at **zero** the flow **advances automatically**. Optional **Skip ahead** / **Finish early** (outline) + haptics (`expo-haptics`). Timer completion uses notification haptic (+ vibration fallback).

- [x] **Brew screen** shows **current step**, **next step** preview, and **primary action** (Next / Finish).
- [x] Integrate **BrewTimer** (or replace) so timing matches your step model (count-up vs count-down — pick one and document it).
- [x] Handle **app backgrounding**: document behavior for v1 (e.g. “timer may pause”) or implement **minimal** recovery if you can.
- [x] **Haptics or sound** at step end (optional but high delight / low effort).

---

## Phase 5 — History (local only)

**Completed in repo:** `brewHistoryService` (`src/services/brewHistory.ts`) persists to AsyncStorage (`brew_master_brew_history_v1`, capped at `MAX_BREW_HISTORY_ENTRIES`). Each completed session saves **recipeId**, title, method, **startedAt** / **finishedAt** (ISO), dose + step count. **BrewCompleteScreen** writes once per completion; **Home** shows the most recent brews + “View all”; **History** screen lists all with pull-to-refresh; **More** links to History. Navigation: `MainTabParamList.Home` uses `NavigatorScreenParams<HomeStackParamList>`; stack includes **History**.

- [x] **Save** a log entry: recipe id, started/finished time (and outcome optional).
- [x] **List** recent brews on a simple “History” screen or home section.
- [x] **Persist** with AsyncStorage or **SQLite** (if you outgrow JSON); no backend in v1.

---

## Phase 6 — Polish & stability

**Completed in repo:** `SafeAreaProvider` in `App.tsx`; tab roots **Home** / **More** use **SafeAreaView** top/left/right. **Button** min height **44pt**, `accessibilityLabel` / `hint` / `state`, loading indicator label; **Card** a11y for pressable; **BrewTimer** live region + control labels; key screens **alert** roles on errors; **Home** error state + **Try again**; **BrewComplete** **Alert** if history write fails. **maxFontSizeMultiplier** 1.35 on button text.

- [x] **Empty states** (no history yet).
- [x] **Loading** where async (even if fast).
- [x] **Error** message if recipe missing or storage fails.
- [ ] Run through **full flow** 10 times on device; fix crashes and layout on small/large iPhone — _do this locally before TestFlight._
- [x] **Accessibility**: minimum font scaling, tap targets, VoiceOver labels on primary buttons (basic pass).

---

## Phase 7 — Auth decision (only if v1 needs accounts)

Skip entire phase if v1 is **local-only**.

- [ ] If accounts: **one** provider (e.g. Sign in with Apple + email) — not three.
- [x] If no accounts: remove fake **login wall** so users aren’t blocked — done: the app opens on the tabs, with no auth gate.

---

## Phase 8 — Ship to testers (iOS)

- **Apple Developer** account; create App Store Connect app.
- **EAS Build** or Expo build path for **production iOS** binary.
- **TestFlight** internal testing → 3–10 external testers.
- Collect **notes**: what confused people, did they brew again within a week?

---

## Phase 9 — Android (post-v1)

- Only after iOS v1 is stable: **Android build**, permissions, adaptive icon.
- **Internal testing** track on Play Console.
- Fix **device-specific** issues (back button, font, safe area).

---

## Learning React Native (parallel track)

Check these off as you go — don’t block shipping on reading everything.

- **Flexbox** layout: comfortable with `flex`, `ScrollView` vs `FlatList`.
- **Navigation** params and types (`RootStackParamList` pattern).
- **Styled-components** or StyleSheet — pick one style for new code and stick to it in v1.
- **AsyncStorage** (or SQLite) read/write patterns and **migration** if you change shape later.
- **One debugging workflow**: Metro logs, React Native debugger or Expo dev tools.

---

## Stop-the-line rules (avoid scope creep)

If you catch yourself building anything from the out-of-V1 table in `docs/v1_phase0_scope.md`, pause and add it to `docs/v2_backlog.md` instead.

---

## Done =

V1 is “done” when a stranger can **install from TestFlight**, **open one recipe**, **complete a brew with the timer**, and **see it in history** — without you explaining the app in person.
