import { type UserSummary } from '@/features/posts/model/post.types';

export type AuthProvider = 'password' | 'google' | 'apple';

export type AuthUser = UserSummary & {
  bio?: string | null;
  locationLabel?: string | null;
  createdAt?: string;
  updatedAt?: string;
  email?: string;
};

export type AuthSession = {
  accessToken: string;
  refreshToken?: string | null;
  expiresAt: string;
  provider: AuthProvider;
  tokenType?: string;
  user: AuthUser;
};

export type LoginPayload = {
  username: string;
  password: string;
};

export type RegisterPayload = {
  username?: string;
  displayName: string;
  email: string;
  password: string;
};
