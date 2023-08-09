import type { DbResponse } from '@/models';
import type { BaseOptions } from '@/shared/models';
import type { Position } from '@/views/jobs/model/position';
import type { GetConversationRes } from '@/views/jobs/model/conversation';
import type { BasePostJob } from '@/views/jobs/model/job';

export interface GetPositionDetailsRes extends Omit<BasePostJob, 'title'>, Omit<Position, 'type'>, DbResponse {
  title?: string;
  type: BaseOptions<string>;
  conversation?: Pick<GetConversationRes, 'hasUpdated' | 'status' | '_id'>;
}
