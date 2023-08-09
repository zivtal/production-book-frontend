import type { BaseChatMessage } from './base-chat-message';
import type { BaseDate } from '@/shared/models';
import type { ProfileExtendDetails } from '@/views/employee/models';
import type { DbResponse } from '@/models';

export interface BaseChat extends DbResponse {
  participants: Array<ProfileExtendDetails>;
  messages: Array<BaseChatMessage>;
  updatedAt: BaseDate;
  hasUpdated: boolean;
  lastSeenAt: BaseDate;
}
