import type { BaseDate, BaseId } from '@/shared/models';

export interface DbResponse {
  _id: BaseId;
  createdAt?: BaseDate;
  updatedAt?: BaseDate;
}
