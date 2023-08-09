import type { DbResponse } from '@/models';
import type { ProfileFullDetails } from '@/views/employee/models';
import { BasePagination } from '@/shared/models';

interface NotificationsDb extends Omit<ProfileFullDetails, 'specialization' | 'skills'>, DbResponse {
  skills?: Array<string>;
  specialization?: Array<string>;
  page: BasePagination;
}

export interface Notifications extends NotificationsDb {
  specialization: NotificationsDb['specialization'];
  skills?: NotificationsDb['skills'];
  page: BasePagination;
}
