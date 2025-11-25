This repository is an Expo + React Native app using Expo Router, MobX stores, and React Query.
These instructions help AI coding agents get productive quickly in this codebase.

- **Start/Run (developer workflow)**:
  - Use the repository scripts in `package.json`.
  - Typical commands (PowerShell):
    - `yarn install` or `npm install` — install dependencies
    - `yarn start` or `npm run start` — start Expo dev server (QR for Expo Go)
    - `yarn ios` or `npm run ios` — start on iOS (requires Xcode)
    - `yarn android` or `npm run android` — start on Android (requires Android Studio)
    - `yarn web` or `npm run web` — start web build
  - For caching issues: `expo start --clear` or `npm run start -- --reset-cache` (or `yarn start --reset-cache`).

- **Big picture architecture**:
  - File-based routing with `expo-router` lives under `src/app/`.
    - Root layout: `src/app/_layout.tsx` hydrates stores and mounts `Providers`.
    - Protected vs public routes follow grouping conventions: `(app)` folder is the protected app area.
  - Global providers are composed in `src/app/providers/index.tsx` in this order:
    `StoresProvider` -> `ThemeProvider` -> `AuthProvider` -> `APIProvider` -> `BottomSheetModalProvider`.
    - Side effects (e.g., hydration) run in `src/app/_layout.tsx` before rendering.
  - State: MobX stores under `src/stores/` with persistence via `mobx-persist-store` configured in `src/stores/_hydration.ts` using `AsyncStorage`.
  - Data fetching: `@tanstack/react-query` is provided via `src/api/common/api-provider.tsx` using a shared `queryClient`.

- **Where to add code / conventions**:
  - New screens/pages: add files under `src/app/` (follow nested folders for routing); `Stack.Screen` entries in `_layout.tsx` map to names used by router.
  - API hooks and types: look in `src/api/` — for posts see `src/api/posts/*` (e.g., `use-posts.ts`, `use-post.ts`).
  - UI components: `src/components/` (low-level primitives live in `src/components/ui/`).
  - Stores: add new store classes to `src/stores/` and export via `src/stores/index.tsx`; implement a `hydrate()` method if persistent.

- **Patterns & idioms specific to this project**:
  - MobX + mobx-persist-store + AsyncStorage are used for persistence; the code calls `hydrateStores()` at app startup — do not remove that flow.
  - The app prefers composition via providers instead of prop-drilling — add cross-cutting concerns as providers alongside existing ones.
  - `expo-router` file naming matters (`_layout.tsx`, `+html.tsx`, grouped folders like `(app)`); keep names consistent to avoid routing mistakes.
  - `useStores()` is the canonical way to access stores (from `src/stores/index.tsx`).
  - React Query dev tools are wired via `@dev-plugins/react-query` helper inside `APIProvider` — tests or CI can ignore dev-tools by consulting plugin behavior.

- **Important files to reference**:
  - `package.json` — scripts and deps
  - `src/app/_layout.tsx` — app hydration + routing entry
  - `src/app/providers/index.tsx` — provider ordering/composition
  - `src/api/common/api-provider.tsx` — `QueryClient` provider
  - `src/stores/_hydration.ts` and `src/stores/index.tsx` — persistence and store registration
  - `src/api/posts/*` — example of API hooks and types

- **Common tasks & examples for AI edits**:
  - Add a new protected screen: create `src/app/(app)/new-screen.tsx`, export a React component, then navigate from existing screens using `router.push('/new-screen')` or similar `expo-router` helpers.
  - Add a new persistent store: add class in `src/stores/`, implement `hydrate()` using `mobx-persist-store`, then export it from `src/stores/index.tsx` and access via `useStores()`.
  - Add an API hook: put new hooks in `src/api/` and use the shared `queryClient`; use `@tanstack/react-query` queries/mutations consistently.

- **What not to change lightly**:
  - The store hydration step in `src/app/_layout.tsx` — altering order or removing hydration will break persisted auth/theme states.
  - Provider composition order in `src/app/providers/index.tsx` — some providers depend on stores or auth context being available.

If anything here is unclear or you'd like more specific examples (e.g., adding a sample screen, a new store, or an API hook), say which area and I'll expand the instructions or create a small example patch.
