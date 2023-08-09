import type { BaseResponse } from '@/shared/models';

export type CreateConversationRes = BaseResponse & { conversationId?: string };
