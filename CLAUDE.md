# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Commands live in [README.md](README.md). `npm run check` is the primary correctness check before committing.

## V1 scope

V1 scope is locked in [docs/v1_phase0_scope.md](docs/v1_phase0_scope.md). Do not add anything from its out-of-V1 table unless that doc is updated first.

## Architecture

### Recipe data

The curated catalog is described under "Recipe catalog" in [README.md](README.md). `recipeService` loads it at startup via `bundledRecipes` (read-only). It can also store user recipes in AsyncStorage under the key `brew_master_user_recipes_v1`, but no V1 screen creates them. Built-in recipes cannot be edited or deleted.

### State management

No global state library in active use. Zustand and React Query are installed but not yet wired up. Component-local state + service calls is the current pattern.

### Theming

[src/theme/theme.ts](src/theme/theme.ts) defines a warm light theme with terracotta accent colors.

- Build all components with `styled-components/native`.
- Import it as `import { styled } from "styled-components/native"`.
- Read colors, spacing and fonts from the theme object.
- Type interpolations with `StyledProps` from `src/theme/styled-components.ts`.

### Validation

Zod schemas live alongside their services (`recipeSchema` in `services/recipes.ts`, `brewLogEntrySchema` in `services/brewHistory.ts`, `userSchema` in `services/auth.ts`). Validate at service boundaries, not in components.

## Key docs

The docs index is under "Related docs" in [README.md](README.md).
