import type { UserLocation } from '@/models';
import type { BasePagination } from '@/shared/models';
import type { AuthUser } from '@/store/auth/models/auth-user';
import type { GetJobDetailsRes } from '@/views/jobs/model/job';
import { ConversationStatusType } from '@/views/jobs/constants/conversation-status-type';

export interface SearchPositionsReq {
  jobType?: AuthUser['specialization'];
  dateFrom?: GetJobDetailsRes['dateFrom'];
  dateTo?: GetJobDetailsRes['dateTo'];
  skills?: AuthUser['skills'];
  status?: keyof typeof ConversationStatusType;
  inConversation?: boolean;
  page?: BasePagination;
  location?: UserLocation | null;
  maxDistance?: number;
}
