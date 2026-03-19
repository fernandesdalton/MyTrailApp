import { useLocalSearchParams } from 'expo-router';

import { ProfileScreen } from '@/features/profile/screens/profile-screen';

export default function UserProfileRoute() {
  const params = useLocalSearchParams<{ userId?: string | string[] }>();
  const userId = Array.isArray(params.userId) ? params.userId[0] : params.userId;

  return <ProfileScreen userId={userId} />;
}
