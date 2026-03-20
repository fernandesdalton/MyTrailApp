import { getCachedAccessToken } from '@/features/auth/lib/auth-session';
import { buildApiUrl } from '@/shared/lib/api/api-config';

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: BodyInit | Record<string, unknown> | null;
};

export type ApiRequestBody = ApiRequestOptions['body'];

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public url: string,
    public payload?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function extractApiErrorMessage(payload: unknown, status: number) {
  if (typeof payload === 'string') {
    const trimmed = payload.trim();
    if (trimmed) {
      return trimmed;
    }
  }

  if (payload && typeof payload === 'object') {
    const candidateKeys = ['detail', 'message', 'error'] as const;

    for (const key of candidateKeys) {
      const value = payload[key];
      if (typeof value === 'string' && value.trim()) {
        return value.trim();
      }
    }
  }

  if (status === 409) {
    return 'That account information is already in use.';
  }

  return `Request failed with status ${status}`;
}

export function buildQueryString(query?: Record<string, string | number | boolean | null | undefined>) {
  if (!query) {
    return '';
  }

  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value == null) {
      continue;
    }

    params.set(key, String(value));
  }

  const serialized = params.toString();
  return serialized ? `?${serialized}` : '';
}

function normalizeBody(body: ApiRequestOptions['body'], headers: Headers) {
  if (body == null) {
    return undefined;
  }

  if (
    typeof body === 'string' ||
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof Blob ||
    body instanceof ArrayBuffer
  ) {
    return body;
  }

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return JSON.stringify(body);
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}) {
  const url = buildApiUrl(path);
  const headers = new Headers(options.headers);
  const accessToken = getCachedAccessToken();

  if (accessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  let response: Response;

  try {
    response = await fetch(url, {
      ...options,
      headers,
      body: normalizeBody(options.body, headers),
    });
  } catch (error) {
    const fallbackMessage =
      `Network request failed for ${url}. ` +
      'If you are using Android emulator, use 10.0.2.2 or your Expo host IP instead of 127.0.0.1.';

    throw new ApiError(
      error instanceof Error ? `${fallbackMessage} ${error.message}` : fallbackMessage,
      0,
      url
    );
  }

  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new ApiError(extractApiErrorMessage(payload, response.status), response.status, url, payload);
  }

  return payload as T;
}

export function apiGet<T>(path: string, init?: Omit<ApiRequestOptions, 'method' | 'body'>) {
  return apiRequest<T>(path, {
    ...init,
    method: 'GET',
  });
}

export function apiPost<T>(path: string, body?: ApiRequestOptions['body'], init?: Omit<ApiRequestOptions, 'method' | 'body'>) {
  return apiRequest<T>(path, {
    ...init,
    method: 'POST',
    body,
  });
}

export function apiPatch<T>(path: string, body?: ApiRequestOptions['body'], init?: Omit<ApiRequestOptions, 'method' | 'body'>) {
  return apiRequest<T>(path, {
    ...init,
    method: 'PATCH',
    body,
  });
}

export function apiPut<T>(path: string, body?: ApiRequestOptions['body'], init?: Omit<ApiRequestOptions, 'method' | 'body'>) {
  return apiRequest<T>(path, {
    ...init,
    method: 'PUT',
    body,
  });
}

export function apiDelete<T>(path: string, init?: Omit<ApiRequestOptions, 'method' | 'body'>) {
  return apiRequest<T>(path, {
    ...init,
    method: 'DELETE',
  });
}
