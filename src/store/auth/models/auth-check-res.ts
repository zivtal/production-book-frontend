import { AuthUser } from '@/store/auth/models/auth-user';

export interface AuthCheckRes {
  actions: Array<string>;
  user?: AuthUser;
  impersonate?: AuthUser;
  language: string;
}
