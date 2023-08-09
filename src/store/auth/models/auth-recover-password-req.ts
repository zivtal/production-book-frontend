export interface AuthRecoverPassword {
  email: string;
  code: number | string;
}

export interface AuthUnsecuredRecoverPassword extends AuthRecoverPassword {
  password: string;
}

export interface AuthSecuredRecoverPasswordReq extends AuthRecoverPassword {
  hash: string;
}

export type AuthRecoverPasswordReq = AuthSecuredRecoverPasswordReq & AuthUnsecuredRecoverPassword;
