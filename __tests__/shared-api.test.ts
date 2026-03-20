import { beforeEach, describe, expect, it, jest } from '@jest/globals';

import { setCachedSession } from '@/features/auth/lib/auth-session';
import { apiConfig, buildApiUrl } from '@/shared/lib/api/api-config';
import {
  ApiError,
  apiDelete,
  apiGet,
  apiPatch,
  apiPost,
  apiPut,
  apiRequest,
  buildQueryString,
} from '@/shared/lib/api/api-client';

const fetchMock = global.fetch as unknown as jest.MockedFunction<
  (input: RequestInfo | URL, init?: RequestInit) => Promise<unknown>
>;

describe('api-config', () => {
  it('builds urls using configured base and prefix', () => {
    expect(apiConfig.baseUrl).toBe('http://127.0.0.1:8000');
    expect(buildApiUrl('/users')).toBe('http://127.0.0.1:8000/api/v1/users');
  });
});

describe('api-client', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    setCachedSession(null);
  });

  it('builds query strings correctly', () => {
    expect(buildQueryString({ userId: '123', active: true, empty: null })).toBe(
      '?userId=123&active=true'
    );
  });

  it('performs a json request successfully', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ ok: true }),
      text: async () => '',
    });

    await expect(apiGet('/posts')).resolves.toEqual({ ok: true });
    expect(global.fetch).toHaveBeenCalledWith('http://127.0.0.1:8000/api/v1/posts', expect.objectContaining({ method: 'GET' }));
  });

  it('serializes object bodies for post/put/patch', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ ok: true }),
      text: async () => '',
    });

    await apiPost('/users', { name: 'Jane' });
    await apiPut('/users/1', { name: 'Jake' });
    await apiPatch('/users/1', { name: 'Jo' });
    await apiDelete('/users/1');

    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      'http://127.0.0.1:8000/api/v1/users',
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ name: 'Jane' }) })
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      'http://127.0.0.1:8000/api/v1/users/1',
      expect.objectContaining({ method: 'PUT', body: JSON.stringify({ name: 'Jake' }) })
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      3,
      'http://127.0.0.1:8000/api/v1/users/1',
      expect.objectContaining({ method: 'PATCH', body: JSON.stringify({ name: 'Jo' }) })
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      4,
      'http://127.0.0.1:8000/api/v1/users/1',
      expect.objectContaining({ method: 'DELETE' })
    );
  });

  it('throws ApiError on failed requests', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      headers: { get: () => 'application/json' },
      json: async () => ({ detail: 'boom' }),
      text: async () => '',
    });

    await expect(apiRequest('/boom')).rejects.toBeInstanceOf(ApiError);
  });

  it('uses backend error detail when available', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 409,
      headers: { get: () => 'application/json' },
      json: async () => ({ detail: 'Username already exists' }),
      text: async () => '',
    });

    await expect(apiRequest('/auth/register')).rejects.toMatchObject({
      message: 'Username already exists',
      status: 409,
    });
  });

  it('attaches bearer auth when a session token is cached', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      headers: { get: () => 'application/json' },
      json: async () => ({ ok: true }),
      text: async () => '',
    });

    setCachedSession({
      accessToken: 'atk_test',
      refreshToken: 'rtk_test',
      expiresAt: new Date().toISOString(),
      provider: 'password',
      user: {
        id: '11111111-1111-4111-8111-111111111111',
        email: 'alex@trailblazer.app',
        username: 'alex',
        displayName: 'Alex',
      },
    });

    await apiGet('/users');

    expect(global.fetch).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/api/v1/users',
      expect.objectContaining({
        method: 'GET',
        headers: expect.any(Headers),
      })
    );

    const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const headers = init.headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer atk_test');
  });
});
