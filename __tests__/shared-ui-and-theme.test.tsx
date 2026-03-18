import { describe, expect, it } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { queryClient } from '@/shared/lib/react-query/query-client';
import { colors } from '@/shared/theme/colors';
import { darkNavigationTheme, lightNavigationTheme } from '@/shared/theme/navigation-theme';
import { AppScreen } from '@/shared/ui/app-screen';
import { AppText } from '@/shared/ui/app-text';

describe('shared theme and ui', () => {
  it('exports expected theme colors', () => {
    expect(colors.accent).toBe('#FF8A33');
    expect(lightNavigationTheme.colors.primary).toBe(colors.accent);
    expect(darkNavigationTheme.colors.background).toBe(colors.darkBackground);
  });

  it('creates query client with configured defaults', () => {
    const defaults = queryClient.getDefaultOptions().queries;
    expect(defaults?.retry).toBe(1);
    expect(defaults?.refetchOnWindowFocus).toBe(false);
  });

  it('renders AppScreen children', () => {
    const { getByText } = render(
      <AppScreen>
        <AppText>Hello world</AppText>
      </AppScreen>
    );

    expect(getByText('Hello world')).toBeTruthy();
  });

  it('renders AppText variants', () => {
    const { getByText } = render(
      <>
        <AppText variant="headline">Headline</AppText>
        <AppText variant="title">Title</AppText>
        <AppText variant="caption">Caption</AppText>
      </>
    );

    expect(getByText('Headline')).toBeTruthy();
    expect(getByText('Title')).toBeTruthy();
    expect(getByText('Caption')).toBeTruthy();
  });
});
