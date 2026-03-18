import { Redirect } from 'expo-router';

import { useAuthSession } from '@/features/auth/hooks/use-auth-session';

export default function Index() {
  const { status } = useAuthSession();

  if (status === 'loading') {
    return null;
  }

  return <Redirect href={status === 'authenticated' ? '/(tabs)' : '/(auth)/login'} />;
}
