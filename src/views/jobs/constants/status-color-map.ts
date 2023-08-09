import { ConversationStatusType } from '@/views/jobs/constants/conversation-status-type';

export const statusColor = {
  [ConversationStatusType.OWNER_ACCEPT]: '#1cb616',
  [ConversationStatusType.FREELANCER_INTERESTING]: '#b271c2',
  [ConversationStatusType.FREELANCER_ACCEPT]: '#0b8307',
  [ConversationStatusType.OWNER_REJECT]: '#a80f0f',
  [ConversationStatusType.FREELANCER_REJECT]: '#c53a3a',
  [ConversationStatusType.OWNER_ACCEPT]: '#b07300',
  [ConversationStatusType.FREELANCER_LEFT]: '#151414',
  [ConversationStatusType.CANCELLATION]: '#810707',
  [ConversationStatusType.CANCEL]: '#500a0a',
};
