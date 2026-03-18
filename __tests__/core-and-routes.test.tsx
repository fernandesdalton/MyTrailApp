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

import RootLayout from '@/app/_layout';
import Index from '@/app/index';
import ExploreRoute from '@/app/(tabs)/explore';
import OverviewRoute from '@/app/(tabs)/index';
import TabsLayout from '@/app/(tabs)/_layout';
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
    expect(render(<ExploreRoute />).getByText('explore-screen')).toBeTruthy();
  });
});
