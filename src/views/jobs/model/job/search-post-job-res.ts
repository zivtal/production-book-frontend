import type { BaseRecords } from '@/shared/models';
import type { DbResponse } from '@/models';
import type { BasePostJob } from '@/views/jobs/model/job';
import type { ProfileBaseDetails } from '@/views/employee/models';
import type { BaseJobPosition } from '@/views/jobs/model/position/base-job-position';
import { ConversationStatusType } from '@/views/jobs/constants/conversation-status-type';

export type ListJobs = BaseRecords<SearchPostJobRes>;

interface ExtendParticipant extends ProfileBaseDetails {
  status: keyof typeof ConversationStatusType;
  hasUpdated: boolean;
}

interface Position extends BaseJobPosition, DbResponse {
  participants: Array<ExtendParticipant>;
}

export interface SearchPostJobRes extends BasePostJob, DbResponse {
  positions: Array<Position>;
}
