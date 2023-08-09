import type { BaseId } from '@/shared/models';
import { ConversationStatusType } from '@/views/jobs/constants/conversation-status-type';

export interface UpdateConversationStatusReq {
  id: BaseId;
  status: keyof typeof ConversationStatusType;
}
