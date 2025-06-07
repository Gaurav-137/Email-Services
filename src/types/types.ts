export interface EmailPayload {
  id: string; // for idempotency
  to: string;
  subject: string;
  body: string;
}

export enum EmailStatus {
  PENDING = "PENDING",
  SENT = "SENT",
  FAILED = "FAILED",
}

export interface EmailResult {
  status: EmailStatus;
  provider: string;
  error?: string;
}