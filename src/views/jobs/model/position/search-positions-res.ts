import type { BaseRecords } from '@/shared/models';
import type { GetConversationRes } from '@/views/jobs/model/conversation';
import type { GetPositionDetailsRes } from '@/views/jobs/model/position';

export interface PositionSearchRes extends Omit<GetPositionDetailsRes, 'conversation'> {
  status?: GetConversationRes['status'];
  hasUpdated: boolean;
}

export type SearchPositionsRes = BaseRecords<PositionSearchRes>;
