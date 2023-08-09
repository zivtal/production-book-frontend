import type { UserLocation } from '@/models';
import { Gender } from '@/constants/gender.enum';

interface AuthSignUp {
  email: string;
  firstName: string;
  lastName: string;
  nickName?: string;
  company?: string;
  location?: UserLocation;
  phone: string;
  birthday?: string;
  gender?: Gender;
  skills?: Array<string>;
  specialization?: Array<string>;
  emailValidateCode: number;
}

export interface AuthSecuredSignUpReq extends AuthSignUp {
  hash: string;
}

export interface AuthUnsecuredSignUp extends AuthSignUp {
  password: string;
}

export type AuthSignUpReq = AuthSecuredSignUpReq | AuthUnsecuredSignUp;
