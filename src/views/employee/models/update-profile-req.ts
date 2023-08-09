import { Cover, ProfileFullDetails } from './';

export interface UpdateProfileReq
  extends Omit<
    Partial<ProfileFullDetails>,
    '_id' | 'verified' | 'email' | 'createdAt' | 'updatedAt' | 'rate' | 'reviews' | 'skills' | 'specialization' | 'cover'
  > {
  cover?: Cover;
  skills?: Array<string>;
  specialization?: Array<string>;
}
