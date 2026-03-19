# Data Source Audit

## Fully API-backed

- `POST /posts` from `src/features/posts/screens/new-post-screen.tsx`
  The create post screen submits through the API client and post resource module.
- Home feed in `src/features/home/api/get-feed-posts.ts`
  Uses `GET /posts`, `GET /users`, and `GET /trails` to assemble the feed cards.
- Home stories row in `src/features/home/api/get-home-stories.ts`
  Uses `GET /stories/all` and `GET /users` to build the story bubbles.
- Post composer user/trail data in `src/features/posts/api/get-post-composer-data.ts`
  Uses the signed-in session user, `GET /users/:userId`, `GET /trails`, and `GET /users/:userId/trails`.
- Profile data in `src/features/profile/api/get-profile-data.ts`
  Uses `GET /users`, `GET /users/:userId`, `GET /users/:userId/posts`, and `GET /users/:userId/trails`.

## API-backed with backend session/token auth

- Auth flow in `src/features/auth/api/auth-api.ts`
  Uses `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, and `POST /auth/logout`. The app stores the bearer token securely and sends `Authorization: Bearer <token>` on authenticated requests.
- Trail favorites actions
  Save/unsave uses the API, and the app reads the user trail list from `GET /users/:userId/trails` for favorite-style flows.

## Still mocked / local-only

- Home composer banner copy and create modal copy
  Pure UI state, no backend data.
- Map screen tracking stats in `src/features/explore/components/tracking-map.native.tsx`
  Hardcoded ride metrics and generated route line.
- Current location map helper text and fallback cards
  Device/location driven, not backend-driven.
- Post media upload destination
  The screen still posts a placeholder remote media URL instead of a real uploaded asset pipeline.
- Connection counts
  The UI still derives a rough count because the backend has follow/unfollow actions but no read endpoint for connection lists or totals.

## Recommended next removals

1. Replace mocked tracking stats with trail session/live ride API data.
2. Add real media upload/storage and submit uploaded asset URLs instead of placeholder URLs.
3. Replace the `New Trail` placeholder flow with trail creation backed by `POST /trails`.
