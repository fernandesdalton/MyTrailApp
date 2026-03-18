# Data Source Audit

## Fully API-backed

- `POST /posts` from `src/features/posts/screens/new-post-screen.tsx`
  The create post screen submits through the API client and post resource module.

## API-backed with fallback

- Home feed in `src/features/home/api/get-feed-posts.ts`
  Tries `GET /feed`, falls back to local demo feed posts when the backend is unavailable.
- Post composer user/trail data in `src/features/posts/api/get-post-composer-data.ts`
  Tries backend users and trails, falls back to a local demo user and mocked trails.
- Home stories row
  Now pulls from `GET /stories`, but falls back to local story bubbles if the request fails.

## Still mocked / local-only

- Home composer banner copy and create modal copy
  Pure UI state, no backend data.
- Map screen tracking stats in `src/features/explore/components/tracking-map.native.tsx`
  Hardcoded ride metrics and generated route line.
- Current location map helper text and fallback cards
  Device/location driven, not backend-driven.
- Post media upload destination
  The screen still posts a placeholder remote media URL instead of a real uploaded asset pipeline.

## Recommended next removals

1. Replace mocked tracking stats with trail session/live ride API data.
2. Add real media upload/storage and submit uploaded asset URLs instead of placeholder URLs.
3. Replace the `New Trail` placeholder flow with trail creation backed by `POST /trails`.
