import type { DbResponse } from '@/models';

export interface ProfileBaseDetails extends DbResponse {
  firstName: string;
  lastName: string;
  company?: string;
  nickName?: string;
  avatar?: string | null;
  verified?: boolean;
}
