import { ConversationAgreement } from '@/views/jobs/model/conversation/conversation-agreement';

export type UpdateConversationAgreementReq = Omit<ConversationAgreement, 'updatedAt'>;
