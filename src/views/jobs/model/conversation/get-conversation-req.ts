import type { BaseId } from '@/shared/models';

export interface GetConversationReq {
  conversationId: BaseId;
  userId?: BaseId;
}
