import { useQueryClient } from '@tanstack/react-query';
import { createContext, type PropsWithChildren, useEffect, useMemo, useState } from 'react';

import { authApi } from '@/features/auth/api/auth-api';
import { clearStoredSession, getStoredSession, setStoredSession } from '@/features/auth/lib/auth-storage';
import { setCachedSession } from '@/features/auth/lib/auth-session';
import {
  type AuthSession,
  type LoginPayload,
  type RegisterPayload,
} from '@/features/auth/model/auth.types';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthSessionContextValue = {
  session: AuthSession | null;
  status: AuthStatus;
  signInWithPassword: (payload: LoginPayload) => Promise<void>;
  registerWithPassword: (payload: RegisterPayload) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      try {
        const storedSession = await getStoredSession();

        if (!isMounted) {
          return;
        }

        if (!storedSession) {
          setSession(null);
          setCachedSession(null);
          setStatus('unauthenticated');
          return;
        }

        setCachedSession(storedSession);

        try {
          const user = await authApi.getMe();
          const hydratedSession = {
            ...storedSession,
            user,
          };

          if (!isMounted) {
            return;
          }

          await setStoredSession(hydratedSession);
          setSession(hydratedSession);
          setCachedSession(hydratedSession);
          setStatus('authenticated');
        } catch {
          if (!isMounted) {
            return;
          }

          await clearStoredSession();
          setSession(null);
          setCachedSession(null);
          setStatus('unauthenticated');
        }
      } catch {
        if (!isMounted) {
          return;
        }

        setSession(null);
        setCachedSession(null);
        setStatus('unauthenticated');
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<AuthSessionContextValue>(
    () => ({
      session,
      status,
      async signInWithPassword(payload) {
        const nextSession = await authApi.login(payload);
        await setStoredSession(nextSession);
        setCachedSession(nextSession);
        setSession(nextSession);
        setStatus('authenticated');
        await queryClient.invalidateQueries();
      },
      async registerWithPassword(payload) {
        const nextSession = await authApi.register(payload);
        await setStoredSession(nextSession);
        setCachedSession(nextSession);
        setSession(nextSession);
        setStatus('authenticated');
        await queryClient.invalidateQueries();
      },
      async signOut() {
        try {
          await authApi.logout();
        } catch {
          // Always clear the local session, even if logout fails remotely.
        }
        await clearStoredSession();
        setCachedSession(null);
        setSession(null);
        setStatus('unauthenticated');
        queryClient.clear();
      },
    }),
    [queryClient, session, status]
  );

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}
