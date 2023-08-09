import type { SearchPostJobRes } from '@/views/jobs/model/job';
import { ConversationStatusType } from '@/views/jobs/constants/conversation-status-type';

export const getUnfilled = (job: any) =>
  (job as SearchPostJobRes).positions.reduce(
    (sum, { participants, amount }) => sum + amount - participants.filter(({ status }) => status === ConversationStatusType.FREELANCER_ACCEPT).length,
    0
  );
