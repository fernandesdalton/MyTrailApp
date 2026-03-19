/* eslint-disable import/first, @typescript-eslint/no-require-imports */
import { describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

jest.mock('@/features/home/screens/home-screen', () => ({
  HomeScreen: () => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, null, 'home-screen');
  },
}));

jest.mock('@/features/explore/screens/explore-screen', () => ({
  ExploreScreen: () => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, null, 'explore-screen');
  },
}));

jest.mock('@/features/trails/screens/trails-screen', () => ({
  TrailsScreen: () => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, null, 'trails-screen');
  },
}));

jest.mock('@/features/profile/screens/profile-screen', () => ({
  ProfileScreen: () => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, null, 'profile-screen');
  },
}));

jest.mock('@/features/posts/screens/new-post-screen', () => ({
  NewPostScreen: () => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, null, 'new-post-screen');
  },
}));

jest.mock('@/features/auth/providers/auth-provider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => {
    const React = require('react');
    const { View } = require('react-native');
    return React.createElement(View, null, children);
  },
}));

jest.mock('@/features/auth/hooks/use-auth-session', () => ({
  useAuthSession: jest.fn(() => ({
    status: 'authenticated',
    session: {
      user: {
        id: '11111111-1111-4111-8111-111111111111',
        email: 'alex@trailblazer.app',
        username: 'alex',
        displayName: 'Alex',
      },
    },
    signInWithPassword: jest.fn(),
    registerWithPassword: jest.fn(),
    signOut: jest.fn(),
  })),
}));

import RootLayout from '@/app/_layout';
import Index from '@/app/index';
import NewPostRoute from '@/app/new-post';
import ExploreRoute from '@/app/(tabs)/explore';
import OverviewRoute from '@/app/(tabs)/index';
import ProfileRoute from '@/app/(tabs)/profile';
import TrailsRoute from '@/app/(tabs)/trails';
import TabsLayout from '@/app/(tabs)/_layout';
import LoginRoute from '@/app/(auth)/login';
import RegisterRoute from '@/app/(auth)/register';
import { AppProviders } from '@/core/providers/app-providers';

describe('core providers and routes', () => {
  it('renders AppProviders children', () => {
    const { getByText } = render(
      <AppProviders>
        <Text>provider-child</Text>
      </AppProviders>
    );

    expect(getByText('provider-child')).toBeTruthy();
  });

  it('renders root layout and tabs layout', () => {
    expect(render(<RootLayout />).toJSON()).toBeTruthy();
    expect(render(<TabsLayout />).toJSON()).toBeTruthy();
  });

  it('renders redirect index route', () => {
    const { getByText } = render(<Index />);
    expect(getByText('/(tabs)')).toBeTruthy();
  });

  it('renders tab route wrappers', () => {
    expect(render(<OverviewRoute />).getByText('home-screen')).toBeTruthy();
    expect(render(<TrailsRoute />).getByText('trails-screen')).toBeTruthy();
    expect(render(<ExploreRoute />).getByText('explore-screen')).toBeTruthy();
    expect(render(<ProfileRoute />).getByText('profile-screen')).toBeTruthy();
  });

  it('renders auth and protected route wrappers', () => {
    expect(render(<LoginRoute />).getByText('Welcome back')).toBeTruthy();
    expect(render(<RegisterRoute />).getByText('JOIN THE PACK')).toBeTruthy();
    expect(render(<NewPostRoute />).getByText('new-post-screen')).toBeTruthy();
  });
});
