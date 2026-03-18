// Expo resolves platform files correctly here, but ESLint's import resolver does not.
// eslint-disable-next-line import/no-unresolved
import { TrackingMapScreen } from '@/features/explore/components/tracking-map';

export function ExploreScreen() {
  return <TrackingMapScreen />;
}
