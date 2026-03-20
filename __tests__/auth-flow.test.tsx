import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { router } from 'expo-router';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { authApi } from '@/features/auth/api/auth-api';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { AuthScreen } from '@/features/auth/screens/auth-screen';
import { ApiError, apiGet, apiPost } from '@/shared/lib/api/api-client';

jest.mock('@/shared/lib/api/api-client', () => {
  const actual = jest.requireActual('@/shared/lib/api/api-client');

  return {
    ...actual,
    apiGet: jest.fn(),
    apiPost: jest.fn(),
  };
});

jest.mock('@/features/auth/hooks/use-auth-session', () => ({
  useAuthSession: jest.fn(),
}));

const mockedApiPost = apiPost as jest.MockedFunction<typeof apiPost>;
const mockedApiGet = apiGet as jest.MockedFunction<typeof apiGet>;
const mockedUseAuthSession = useAuthSession as jest.Mock;
const mockedRouter = router as unknown as {
  replace: jest.Mock;
};

describe('auth api and screens', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedRouter.replace.mockReset();
  });

  it('registers and logs in against backend auth endpoints', async () => {
    mockedApiPost
      .mockResolvedValueOnce({
        accessToken: 'register_token',
        tokenType: 'bearer',
        expiresAt: '2026-03-19T12:00:00Z',
        user: {
          id: '11111111-1111-4111-8111-111111111111',
          username: 'alex',
          displayName: 'Alex Rider',
          bio: null,
          avatarUrl: null,
          locationLabel: null,
          createdAt: '2026-03-19T11:00:00Z',
          updatedAt: '2026-03-19T11:00:00Z',
        },
      } as never)
      .mockResolvedValueOnce({
        accessToken: 'login_token',
        tokenType: 'bearer',
        expiresAt: '2026-03-19T12:00:00Z',
        user: {
          id: '11111111-1111-4111-8111-111111111111',
          username: 'alex',
          displayName: 'Alex Rider',
          bio: null,
          avatarUrl: null,
          locationLabel: null,
          createdAt: '2026-03-19T11:00:00Z',
          updatedAt: '2026-03-19T11:00:00Z',
        },
      } as never);

    const registeredSession = await authApi.register({
      displayName: 'Alex Rider',
      email: 'alex@trailblazer.app',
      password: 'supersecure',
    });

    expect(mockedApiPost).toHaveBeenNthCalledWith(
      1,
      '/auth/register',
      {
        username: 'alex',
        displayName: 'Alex Rider',
        email: 'alex@trailblazer.app',
        password: 'supersecure',
      }
    );
    expect(registeredSession.accessToken).toBe('register_token');
    expect(registeredSession.user.username).toBe('alex');

    const loggedInSession = await authApi.login({
      username: 'alex',
      password: 'supersecure',
    });

    expect(mockedApiPost).toHaveBeenNthCalledWith(
      2,
      '/auth/login',
      {
        username: 'alex',
        password: 'supersecure',
      }
    );
    expect(loggedInSession.accessToken).toBe('login_token');
  });

  it('retries registration with a fallback username after a 409 conflict', async () => {
    mockedApiPost
      .mockRejectedValueOnce(
        new ApiError('Username already exists', 409, '/auth/register', {
          detail: 'Username already exists',
        }) as never
      )
      .mockResolvedValueOnce({
        accessToken: 'register_token',
        tokenType: 'bearer',
        expiresAt: '2026-03-19T12:00:00Z',
        user: {
          id: '11111111-1111-4111-8111-111111111111',
          username: 'alex_1234',
          displayName: 'Alex Rider',
          bio: null,
          avatarUrl: null,
          locationLabel: null,
          createdAt: '2026-03-19T11:00:00Z',
          updatedAt: '2026-03-19T11:00:00Z',
        },
      } as never);

    const registeredSession = await authApi.register({
      displayName: 'Alex Rider',
      email: 'alex@trailblazer.app',
      password: 'supersecure',
    });

    expect(mockedApiPost).toHaveBeenNthCalledWith(
      1,
      '/auth/register',
      expect.objectContaining({
        username: 'alex',
        displayName: 'Alex Rider',
        email: 'alex@trailblazer.app',
        password: 'supersecure',
      })
    );
    expect(mockedApiPost).toHaveBeenNthCalledWith(
      2,
      '/auth/register',
      expect.objectContaining({
        username: expect.stringMatching(/^alex(_rider|_\d{4})$/),
        displayName: 'Alex Rider',
        email: 'alex@trailblazer.app',
        password: 'supersecure',
      })
    );
    expect(registeredSession.user.username).toBe('alex_1234');
  });

  it('hydrates the current user and logs out through backend auth endpoints', async () => {
    mockedApiGet.mockResolvedValue({
      id: '11111111-1111-4111-8111-111111111111',
      username: 'alex',
      displayName: 'Alex Rider',
      bio: null,
      avatarUrl: null,
      locationLabel: null,
      createdAt: '2026-03-19T11:00:00Z',
      updatedAt: '2026-03-19T11:00:00Z',
    } as never);
    mockedApiPost.mockResolvedValue({} as never);

    const currentUser = await authApi.getMe();
    expect(mockedApiGet).toHaveBeenCalledWith('/auth/me');
    expect(currentUser.username).toBe('alex');

    await authApi.logout();
    expect(mockedApiPost).toHaveBeenCalledWith('/auth/logout');
  });

  it('submits the login screen and navigates into tabs', async () => {
    const signInWithPassword = jest.fn(async () => undefined);

    mockedUseAuthSession.mockReturnValue({
      signInWithPassword,
      registerWithPassword: jest.fn(),
    });

    const { getByPlaceholderText, getByText } = render(<AuthScreen mode="login" />);

    fireEvent.changeText(getByPlaceholderText('auth-user'), 'auth-user');
    fireEvent.changeText(getByPlaceholderText('********'), 'supersecure');
    fireEvent.press(getByText('SIGN IN'));

    await waitFor(() =>
      expect(signInWithPassword).toHaveBeenCalledWith({
        username: 'auth-user',
        password: 'supersecure',
      })
    );

    expect(mockedRouter.replace).toHaveBeenCalledWith('/(tabs)');
  });

  it('submits the register screen and routes to login footer action', async () => {
    const registerWithPassword = jest.fn(async () => undefined);

    mockedUseAuthSession.mockReturnValue({
      signInWithPassword: jest.fn(),
      registerWithPassword,
    });

    const { getAllByPlaceholderText, getByPlaceholderText, getByText } = render(
      <AuthScreen mode="register" />
    );

    fireEvent.changeText(getByPlaceholderText('RIDER NAME'), 'Alex Rider');
    fireEvent.changeText(getByPlaceholderText('COCKPIT@APEXDIRT.COM'), 'alex@trailblazer.app');
    fireEvent.changeText(getAllByPlaceholderText('********')[0], 'supersecure');
    fireEvent.changeText(getAllByPlaceholderText('********')[1], 'supersecure');
    fireEvent.press(getByText(/I agree to the/i));
    fireEvent.press(getByText('CREATE ACCOUNT'));

    await waitFor(() =>
      expect(registerWithPassword).toHaveBeenCalledWith({
        displayName: 'Alex Rider',
        email: 'alex@trailblazer.app',
        password: 'supersecure',
      })
    );

    fireEvent.press(getByText('Sign in'));
    expect(mockedRouter.replace).toHaveBeenCalledWith('/(auth)/login');
  });

  it('blocks register submission until terms are accepted', async () => {
    const registerWithPassword = jest.fn(async () => undefined);

    mockedUseAuthSession.mockReturnValue({
      signInWithPassword: jest.fn(),
      registerWithPassword,
    });

    const { getAllByPlaceholderText, getByPlaceholderText, getByText } = render(
      <AuthScreen mode="register" />
    );

    fireEvent.changeText(getByPlaceholderText('RIDER NAME'), 'Alex Rider');
    fireEvent.changeText(getByPlaceholderText('COCKPIT@APEXDIRT.COM'), 'alex@trailblazer.app');
    fireEvent.changeText(getAllByPlaceholderText('********')[0], 'supersecure');
    fireEvent.changeText(getAllByPlaceholderText('********')[1], 'supersecure');
    fireEvent.press(getByText('CREATE ACCOUNT'));

    await waitFor(() =>
      expect(getByText('Accept the Terms of Service and Privacy Policy to continue.')).toBeTruthy()
    );
    expect(registerWithPassword).not.toHaveBeenCalled();
  });
});
