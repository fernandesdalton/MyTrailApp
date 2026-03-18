import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';
import { fireEvent, render, waitFor } from '@testing-library/react-native';

import { authApi } from '@/features/auth/api/auth-api';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { AuthScreen } from '@/features/auth/screens/auth-screen';
import { usersApi } from '@/shared/lib/api/resources/users-api';

jest.mock('@/shared/lib/api/resources/users-api', () => ({
  usersApi: {
    list: jest.fn(),
    create: jest.fn(),
    getById: jest.fn(),
  },
}));

jest.mock('@/features/auth/hooks/use-auth-session', () => ({
  useAuthSession: jest.fn(),
}));

const mockedUsersApi = usersApi as jest.Mocked<typeof usersApi>;
const mockedUseAuthSession = useAuthSession as jest.Mock;
const mockedRouter = router as unknown as {
  replace: jest.Mock;
};

describe('auth api and screens', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await SecureStore.deleteItemAsync('trailblazer.auth.session');
    await SecureStore.deleteItemAsync('trailblazer.auth.credentials');
    mockedRouter.replace.mockReset();
  });

  it('registers against backend users and then logs in with stored credentials', async () => {
    mockedUsersApi.list.mockResolvedValue([]);
    mockedUsersApi.create.mockResolvedValue({
      id: '11111111-1111-4111-8111-111111111111',
      username: 'alex',
      displayName: 'Alex Rider',
      avatarUrl: null,
    });
    mockedUsersApi.getById.mockResolvedValue({
      id: '11111111-1111-4111-8111-111111111111',
      username: 'alex',
      displayName: 'Alex Rider',
      avatarUrl: null,
    });

    const registeredSession = await authApi.register({
      displayName: 'Alex Rider',
      email: 'alex@trailblazer.app',
      password: 'supersecure',
    });

    expect(mockedUsersApi.create).toHaveBeenCalledWith({
      username: 'alex',
      displayName: 'Alex Rider',
    });
    expect(registeredSession.user.email).toBe('alex@trailblazer.app');
    expect(registeredSession.accessToken).toContain('atk_');

    const loggedInSession = await authApi.login({
      email: 'alex@trailblazer.app',
      password: 'supersecure',
    });

    expect(mockedUsersApi.getById).toHaveBeenCalledWith('11111111-1111-4111-8111-111111111111');
    expect(loggedInSession.user.username).toBe('alex');
  });

  it('submits the login screen and navigates into tabs', async () => {
    const signInWithPassword = jest.fn(async () => undefined);

    mockedUseAuthSession.mockReturnValue({
      signInWithPassword,
      registerWithPassword: jest.fn(),
    });

    const { getByPlaceholderText, getByText } = render(<AuthScreen mode="login" />);

    fireEvent.changeText(getByPlaceholderText('rider@leapxdirt.com'), 'alex@trailblazer.app');
    fireEvent.changeText(getByPlaceholderText('********'), 'supersecure');
    fireEvent.press(getByText('SIGN IN'));

    await waitFor(() =>
      expect(signInWithPassword).toHaveBeenCalledWith({
        email: 'alex@trailblazer.app',
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
