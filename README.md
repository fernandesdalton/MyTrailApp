# MyTrailApp

Modern React Native starter based on Expo SDK 55, React Native 0.83, Expo Router, React Query, Zustand, and Zod.

## Stack

- Expo framework and Expo Router for the recommended React Native workflow
- React Native New Architecture and React Compiler enabled in `app.json`
- TypeScript in strict mode
- TanStack Query for server state
- Zustand for lightweight client state
- Zod for runtime validation and typed domain boundaries

## Project structure

```text
src
|- app/                 # Expo Router routes only
|- core/
|  \- providers/        # App-wide providers and bootstrapping
|- features/            # Feature-first UI, queries, stores
|- shared/
|  |- lib/              # Cross-cutting libraries
|  |- theme/            # Tokens and navigation theme
|  \- ui/               # Reusable primitives
```

## Before running

This template was created with the latest Expo toolchain on March 18, 2026. The installed React Native version requires Node `20.19.4` or newer.

Your current machine is on Node `18.15.0`, so upgrade Node first or Metro and Expo commands may fail.

## Commands

```bash
npm install
npm run start
npm run check
```

## Architecture guidelines

- Keep routing files small and delegate real UI to `features/*/screens`
- Put remote data behind feature `api` and `queries` modules
- Put local UI state in feature stores, not global singletons by default
- Keep `shared/ui` primitive and generic; avoid feature leakage there
- Add native modules through Expo first, and only prebuild when a package truly requires it

## Next good additions

- Authentication flow with a dedicated route group such as `src/app/(auth)`
- API client layer with request/response schemas using Zod
- Testing with Jest and React Native Testing Library
- CI checks for `npm run check`
