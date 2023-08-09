// actions
export const SIGN_IN = 'signIn';
export const SIGN_UP = 'signUp';
export const SIGN_OUT = 'signOut';
export const AUTH_CHECK = 'authCheck';
export const FORGOT_PASSWORD = 'forgotPassword';
export const CHANGE_PASSWORD = 'changePassword';
export const EMAIL_VALIDATE = 'emailValidate';
export const IMPERSONATE_TO = 'impersonateTo';

// state
export const USER = 'user';
export const AUTH_ACTIONS = 'authActions';
export const VERIFICATION_EXPIRED_AT = 'verificationExpiredAt';
export const ACTIVE_USER = 'active';

// mutations
export const UPDATE_USER = 'updateUser';
export const SET_USER = 'setUser';
export const SET_AUTH_ACTIONS = 'setAuthActions';
export const SET_VERIFICATION_EXPIRED_AT = 'setVerificationExpiredAt';
export const SET_ACTIVE_USER = 'setActiveUser';

// getters
export const GET_USER = 'getUser';
export const GET_AUTH_ACTIONS = 'getAuthActions';
export const GET_AUTH_KEY = 'getAuthKey';
export const IS_LOGGED_IN = 'isLoggedIn';
export const IS_IMPERSONATED_MODE = 'isImpersonatedMode';
export const GET_CURRENCY = 'getCurrency';
