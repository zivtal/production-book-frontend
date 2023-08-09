import type { BaseChat } from './base-chat';
import type { BaseRecords } from '@/shared/models';

export type ListChatsRes = BaseRecords<Omit<BaseChat, 'messages'>>;
