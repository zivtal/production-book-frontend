import type { GetReview } from './get-review';

export interface AverageRating {
  attitude?: number | null;
  reliability?: number | null;
  craftsmanship?: number | null;
  communication?: number | null;
  average: number | null;
  total: number;
  review?: GetReview;
}
