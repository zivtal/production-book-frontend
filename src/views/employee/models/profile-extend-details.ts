import type { UserLocation } from '@/models';
import type { BaseOptions } from '@/shared/models';
import type { AverageRating, ReviewDetails, ProfileBaseDetails, Wage } from './';

export interface ProfileExtendDetails extends ProfileBaseDetails, Partial<ReviewDetails> {
  location?: UserLocation;
  cover?: string | null;
  wage?: Wage;
  skills?: BaseOptions<string>;
  specialization?: BaseOptions<string>;
  rating?: AverageRating;
}
