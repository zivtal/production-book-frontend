import { Gender } from '@/constants/gender.enum';
import { Appearance, ProfileExtendDetails, ReviewDetails } from './';

export interface ProfileFullDetails extends ProfileExtendDetails, Partial<ReviewDetails> {
  email: string;
  phone: string;
  birthday?: string;
  gender?: Gender;
  about?: string;
  appearance?: Appearance;
  language?: Array<string>;
}
