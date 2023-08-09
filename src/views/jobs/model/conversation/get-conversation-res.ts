import type { DbResponse } from '@/models';
import type { ProfileBaseDetails } from '@/views/employee/models';
import type { ConversationAgreement } from '@/views/jobs/model/conversation';
import type { BaseDate, BaseId } from '@/shared/models';
import type { BaseChatMessage } from '@/views/messenger/models';
import { ConversationStatusType } from '@/views/jobs/constants/conversation-status-type';

export interface ConversationStatus {
  id: BaseId;
  type: keyof typeof ConversationStatusType;
  userId: BaseId;
  createdAt: BaseDate;
}

export interface GetConversationRes extends DbResponse {
  positionId: BaseId;
  status: ConversationStatus;
  participants: Array<ProfileBaseDetails>;
  messages: Array<BaseChatMessage>;
  agreement?: ConversationAgreement;
  hasUpdated: boolean;
}
