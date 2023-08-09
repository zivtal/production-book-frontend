import type { DbResponse, Role } from '@/models';
import type { Privacy, ProfileFullDetails } from '@/views/employee/models';
import type { BaseDate } from '@/shared/models';

interface UserDb extends Omit<ProfileFullDetails, 'specialization' | 'skills'>, DbResponse {
  skills?: Array<string>;
  specialization?: Array<string>;
}

export interface AuthUser extends UserDb {
  birthday: UserDb['birthday'];
  email: UserDb['email'];
  phone: UserDb['phone'];
  wage: UserDb['wage'];
  location: UserDb['location'];
  skills: UserDb['skills'];
  specialization: UserDb['specialization'];
  privacy?: Privacy;
  role?: Role;
  lastSeenAt?: BaseDate;
}

export interface ActiveUser extends AuthUser {
  impersonate?: boolean;
}
