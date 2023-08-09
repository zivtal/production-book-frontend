import type { DbResponse } from '@/models';
import type { Position } from '@/views/jobs/model/position';
import type { GetConversationRes } from '@/views/jobs/model/conversation';
import type { BaseDate, BaseId } from '@/shared/models';
import type { BasePostJob } from '@/views/jobs/model/job/base-post-job';

export interface JobPosition extends Position, DbResponse {
  jobId: BaseId;
  conversations: Array<GetConversationRes>;
}

export interface GetJobDetailsRes extends BasePostJob, DbResponse {
  positions: Array<JobPosition>;
  lastSeenAt?: BaseDate;
}
