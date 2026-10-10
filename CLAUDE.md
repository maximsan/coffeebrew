# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run start        # Start Expo dev server (press i for iOS, a for Android)
npm run start:ios    # Start the dev server and open the app in Expo Go on the iOS simulator
npm run ios          # Build the native iOS app with Xcode and run it on the simulator
npm run typecheck    # TypeScript strict-mode check — run before committing
npm run lint         # Expo ESLint
npm run lint:fix     # Expo ESLint, applying automatic fixes
npm run format:check # Prettier formatting check
npm test -- --runInBand
npm run doctor       # Expo Doctor compatibility checks
npm run check        # Full local/CI verification
```

Jest is configured with `jest-expo` for service-level tests. `npm run check` is the primary correctness check before committing.

## V1 scope constraints

**V1 is iOS-only, no backend, no accounts.** These features are explicitly out of scope and should not be added unless `docs/v1_phase0_scope.md` is updated:

- Authentication / accounts
- Community/social features, comments, sharing
- AI/ML features (recipe analysis, bean photo recognition, personalized recommendations)
- Gamification (XP, badges, achievements, Bean Bank)
- In-app recipe creation/editing or image upload to a server
- Backend API or multi-device sync
- Android support

**V1 in scope:** curated read-only recipes (bundled JSON), guided brew flow, timer, local brew history (AsyncStorage, device-local only), iOS TestFlight.

## Architecture

### Entry point and providers

[App.tsx](App.tsx) wraps everything in `SafeAreaProvider` → `ThemeProvider` (styled-components) → `AuthProvider` → `NavigationContainer`. Auth remains a V1 stub; navigation has no auth gate.

### Navigation structure

[src/navigation/Navigation.tsx](src/navigation/Navigation.tsx) — two-tab structure, no auth gate:

- **Home** — HomeStack: `HomeScreen` → `RecipeDetails` → `BrewSession`
- **More** — `MoreScreen` (placeholder)

### Recipe data

Curated catalog is bundled JSON at [src/data/recipes.json](src/data/recipes.json) — update recipes by editing this file and shipping a release. `recipeService` loads it at startup via `bundledRecipes` (read-only). User-created recipes are stored separately in AsyncStorage under the key `brew_master_user_recipes_v1`. Built-in recipes cannot be edited or deleted.

### Services (singletons)

All services in `src/services/` are singleton instances:

- **`recipeService`** — merges `bundledRecipes` (from JSON) with user recipes from AsyncStorage. Guards against editing/deleting bundled entries.
- **`authService`** — stubbed, not used in V1.
- **`aiService`** — all methods return mock data; placeholder for future integration.
- **`achievementsService`** — stubbed, out of V1 scope.

### State management

No global state library in active use. Zustand and React Query are installed but not yet wired up. Component-local state + service calls is the current pattern.

### Theming

[src/theme/theme.ts](src/theme/theme.ts) defines a warm light theme with terracotta accent colors. Use `styled-components/native` for all components; access theme values via the theme object. Use the `StyledProps` type from `src/theme/styled-components.ts` for typed interpolations.

### Validation

Zod schemas live alongside their services (`recipeSchema` in `services/recipes.ts`, `userSchema` in `services/auth.ts`). Validate at service boundaries, not in components.

### App identifiers

| Setting       | Value                |
| ------------- | -------------------- |
| Display name  | Brew Master          |
| iOS bundle id | `com.brewmaster.app` |
| Expo slug     | `brew-master`        |
| URL scheme    | `brewmaster`         |

## Key docs

- V1 scope decisions: [docs/v1_phase0_scope.md](docs/v1_phase0_scope.md)
- Solo dev checklist: [docs/v1_solo_checklist.md](docs/v1_solo_checklist.md)
- Deferred UI and modules (post–v1): [docs/v2_backlog.md](docs/v2_backlog.md)
- Design specs: [docs/design/](docs/design/)
