import { EmailPayload } from "../types/types";

export interface EmailProvider {
  name: string;
  sendEmail(email: EmailPayload): Promise<void>;
}