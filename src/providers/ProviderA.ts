import { EmailProvider } from "./BaseProvider";
import { EmailPayload } from "../types/types";

export class ProviderA implements EmailProvider {
  name = "ProviderA";

  async sendEmail(email: EmailPayload): Promise<void> {
    if (Math.random() < 0.3) throw new Error("Provider A failed");
    return;
  }
}