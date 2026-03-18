import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render } from '@testing-library/react-native';
import * as Location from 'expo-location';

import { TrackingMapScreen as TrackingMapNative } from '@/features/explore/components/tracking-map.native';
import { TrackingMapScreen as TrackingMapWeb } from '@/features/explore/components/tracking-map.web';
import { ExploreScreen } from '@/features/explore/screens/explore-screen';

describe('explore components and screen', () => {
  beforeEach(() => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockImplementation(
      () => new Promise(() => undefined)
    );
  });

  it('renders web tracking map fallback', () => {
    const { getByText } = render(<TrackingMapWeb />);
    expect(getByText(/native-only for now/i)).toBeTruthy();
  });

  it('renders native tracking map missing-token fallback', () => {
    const { getByText } = render(<TrackingMapNative />);
    expect(getByText(/Add your Mapbox token/i)).toBeTruthy();
  });

  it('renders explore screen wrapper', () => {
    expect(render(<ExploreScreen />).toJSON()).toBeTruthy();
  });
});
