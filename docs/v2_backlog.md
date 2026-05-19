# Postponed past v1 (backlog)

Code under `app/src/` that is **not mounted** in the v1 navigator (`src/navigation/Navigation.tsx`) or **only exists to support that deferred UI** is labeled with a one-line header in the file: _Postponed past v1 — … see `app/docs/v2_backlog.md`_.

**V1 product slice** is defined in `v1_phase0_scope.md` and tracked in `v1_solo_checklist.md`.

---

## Screens (not in v1 navigator)

| Path                                          | Notes                                                                                       |
| --------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `src/screens/recipes/RecipesScreen.tsx`       | Alternate recipes stack; v1 uses `HomeScreen` list.                                         |
| `src/screens/recipes/RecipeDetailsScreen.tsx` | Rich detail (rating, comments, timer demo); v1 uses `screens/home/RecipeDetailsScreen.tsx`. |
| `src/screens/create/CreateScreen.tsx`         | Recipe authoring — out of v1 scope.                                                         |
| `src/screens/create/CreateRecipeScreen.tsx`   | Same.                                                                                       |
| `src/screens/auth/LoginScreen.tsx`            | Accounts deferred; no auth gate in v1.                                                      |
| `src/screens/auth/RegisterScreen.tsx`         | Same.                                                                                       |
| `src/screens/ai/AIScreen.tsx`                 | AI features out of v1 scope.                                                                |
| `src/screens/community/CommunityScreen.tsx`   | Community out of v1 scope.                                                                  |
| `src/screens/profile/ProfileScreen.tsx`       | Profile/settings tab out of v1 scope.                                                       |

---

## Components (only used from deferred screens, or unused)

| Path                                             | Notes                                                |
| ------------------------------------------------ | ---------------------------------------------------- |
| `src/components/RecipeAnalysis.tsx`              | Wired from `AIScreen`.                               |
| `src/components/BeanRecognition.tsx`             | Same.                                                |
| `src/components/PersonalizedRecommendations.tsx` | Same.                                                |
| `src/components/BrewingHistory.tsx`              | AI “insights” UI; same.                              |
| `src/components/Achievements.tsx`                | Gamification; not imported by any screen today.      |
| `src/components/Rating.tsx`                      | `recipes/RecipeDetailsScreen` only.                  |
| `src/components/Comments.tsx`                    | Same.                                                |
| `src/components/ImagePicker.tsx`                 | Create flow only.                                    |
| `src/components/Logo.tsx`                        | Auth screens only.                                   |
| `src/components/TextInput.tsx`                   | Auth + create screens only (not home/brew path).     |
| `src/components/Modal.tsx`                       | Shared primitive; nothing in v1 tree imports it yet. |

---

## Types (only referenced from deferred UI)

| Path                   | Notes                                 |
| ---------------------- | ------------------------------------- |
| `src/types/comment.ts` | Comments on legacy recipe detail.     |
| `src/types/user.ts`    | Legacy recipe detail / social shapes. |

---

## Services

| Path                           | Notes                                                                                                             |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `src/services/ai.ts`           | Mock AI; only deferred components/screens call it.                                                                |
| `src/services/achievements.ts` | Gamification mock; only `Achievements.tsx`.                                                                       |
| `src/services/auth.ts`         | Stub still initialized via `AuthContext` in v1; **login/register screens** are deferred, not this file’s removal. |

---

## Navigation types (legacy param lists)

In `src/navigation/types.ts`, `AuthStackParamList`, `RecipesStackParamList`, `CommunityStackParamList`, and `ProfileStackParamList` remain for **type-checking deferred screens** if you re-mount them later. They are **not** used by the v1 tab/stack navigator.

---

## Runtime still in v1 but related to deferred work

| Path                        | Notes                                                             |
| --------------------------- | ----------------------------------------------------------------- |
| `src/store/AuthContext.tsx` | Wraps the app in v1; provides stub session until real auth ships. |

Revise this file when you delete, move, or wire any deferred module back into navigation.
