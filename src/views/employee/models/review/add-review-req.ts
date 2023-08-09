import type { GetReview } from './get-review';

export interface AddReviewReq extends GetReview {
  userId?: string;
}
