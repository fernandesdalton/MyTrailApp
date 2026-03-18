import { useContext } from 'react';

import { AuthSessionContext } from '@/features/auth/providers/auth-provider';

export function useAuthSession() {
  const value = useContext(AuthSessionContext);

  if (!value) {
    throw new Error('useAuthSession must be used inside AuthProvider');
  }

  return value;
}
