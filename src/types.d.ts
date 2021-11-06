export interface ErrorMessage {
  code: string;
  message: string;
}

export interface ResponseEvent {
  eventName: string;
  eventContent: unknown;
}
