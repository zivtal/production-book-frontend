import type { DbResponse } from '@/models';
import type { GetReview } from './get-review';
import type { ProfileBaseDetails } from '../';

export interface GetReviewRes extends GetReview, DbResponse {
  average: number;
  user: ProfileBaseDetails;
}
