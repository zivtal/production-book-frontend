import { GetConversationRes } from '@/views/jobs/model/conversation';
import { ConversationStatusType } from '@/views/jobs/constants/conversation-status-type';

export const getSummeryOfConversations = (conversations: Array<GetConversationRes>, type?: keyof typeof ConversationStatusType): number =>
  (conversations || []).reduce((sum, { status }) => (status?.type === type ? sum + 1 : sum), 0);
