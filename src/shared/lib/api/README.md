# API Module

- API prefix: `/api/v1`
- Environment selector: `EXPO_PUBLIC_APP_ENV`
- Supported environments: `local`, `dev`, `production`
- Optional override: `EXPO_PUBLIC_API_BASE_URL`

Default environment URLs:

- `local`: `http://127.0.0.1:8000`
- `dev`: `http://my-trail-app-dev-alb-1467436399.us-east-1.elb.amazonaws.com`
- `production`: blank until the production deploy exists

Use `apiGet`, `apiPost`, `apiPatch`, and `apiDelete` from `api-client.ts` to call the backend.

Auth contract:

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/logout`
- `GET /auth/providers`

When a session exists, `api-client.ts` automatically sends `Authorization: Bearer <token>` using the securely stored access token.

Entity modules:

- `resources/users-api.ts`
- `resources/trails-api.ts`
- `resources/posts-api.ts`
- `resources/comments-api.ts`
- `resources/stories-api.ts`
- `resources/social-api.ts`

Examples:

- `usersApi.list()`
- `usersApi.getById(userId)`
- `postsApi.list()`
- `commentsApi.listByPost(postId)`
- `storiesApi.list()`
- `socialApi.likePost(postId, userId)`
- `trailsApi.list<Trail>()`
- `trailsApi.create<Trail>(payload as TrailCreatePayload)`

Important for Android emulator:

- In `local`, `http://127.0.0.1:8000` and `http://localhost:8000` are automatically remapped to `http://10.0.2.2:8000`.
- `127.0.0.1` points to the emulator itself, not your host machine.
- If you need a different target temporarily, set `EXPO_PUBLIC_API_BASE_URL` as an explicit override.

Trails contract:

- `GET /trails` returns full `Trail[]`
- `POST /trails` accepts `TrailCreatePayload`
- `PUT /trails/:trailId` accepts `TrailUpdatePayload`
- `POST /trails/:trailId/save?userId=...` returns `SavedTrailResponse`
- `DELETE /trails/:trailId/save?userId=...` returns `{ status: "unsaved" }`
