# API Module

- Base URL: `http://127.0.0.1:8000`
- API prefix: `/api/v1`
- Docs: `http://127.0.0.1:8000/docs`
- OpenAPI JSON: `http://127.0.0.1:8000/openapi.json`

Use `apiGet`, `apiPost`, `apiPatch`, and `apiDelete` from `api-client.ts` to call the backend.

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

Important for Android emulator:

- `127.0.0.1` points to the emulator itself, not your host machine.
- If the API is running on your computer and you are testing on the Android emulator, you will usually need `http://10.0.2.2:8000` instead.
