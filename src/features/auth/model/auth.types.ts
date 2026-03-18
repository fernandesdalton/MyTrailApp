import { type UserSummary } from '@/features/posts/model/post.types';

export type AuthProvider = 'password' | 'google' | 'apple';

export type AuthUser = UserSummary & {
  email: string;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  provider: AuthProvider;
  user: AuthUser;
};

export type StoredCredential = {
  email: string;
  password: string;
  userId: string;
  username: string;
  displayName: string;
  createdAt: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  displayName: string;
  email: string;
  password: string;
};
