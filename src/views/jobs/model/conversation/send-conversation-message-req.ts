import type { BaseId } from '@/shared/models';

export interface SendConversationMessageReq {
  id: BaseId;
  message: string;
}
