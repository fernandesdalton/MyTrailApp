import { Redirect, useLocalSearchParams } from 'expo-router';

import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { TrailDetailScreen } from '@/features/trails/screens/trail-detail-screen';

export default function TrailDetailRoute() {
  const { status } = useAuthSession();
  const params = useLocalSearchParams<{ trailId?: string | string[] }>();
  const trailId = Array.isArray(params.trailId) ? params.trailId[0] : params.trailId;

  if (status === 'loading') {
    return null;
  }

  if (status !== 'authenticated') {
    return <Redirect href="/(auth)/login" />;
  }

  if (!trailId) {
    return null;
  }

  return <TrailDetailScreen trailId={trailId} />;
}
