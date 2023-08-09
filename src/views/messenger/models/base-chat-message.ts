import type { BaseDate, BaseId } from '@/shared/models';

export interface BaseChatMessage {
  key: string;
  fromId: BaseId;
  message: string;
  updatedAt: BaseDate;
}
