export interface ErrorResponseMessage {
  message: string;
  property?: string;
  index?: number;
  value?: string | number;
}

export interface ErrorResponse {
  errorCode?: number;
  errorMessage?: Array<ErrorResponseMessage>;
}
