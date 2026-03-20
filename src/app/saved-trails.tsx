import { Redirect } from 'expo-router';

import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { SavedTrailsScreen } from '@/features/trails/screens/saved-trails-screen';

export default function SavedTrailsRoute() {
  const { status } = useAuthSession();

  if (status === 'loading') {
    return null;
  }

  if (status !== 'authenticated') {
    return <Redirect href="/(auth)/login" />;
  }

  return <SavedTrailsScreen />;
}
