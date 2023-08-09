interface AuthSignIn {
  email: string;
}

export interface AuthSecuredSignInReq extends AuthSignIn {
  hash: string;
}

export interface AuthUnsecuredSignIn extends AuthSignIn {
  password: string;
}

export type AuthSignInReq = AuthSecuredSignInReq | AuthUnsecuredSignIn;
