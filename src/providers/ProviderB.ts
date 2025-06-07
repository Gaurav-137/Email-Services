import { EmailProvider } from "./BaseProvider";
import { EmailPayload } from "../types/types";

export class ProviderB implements EmailProvider {
  name = "ProviderB";

  async sendEmail(email: EmailPayload): Promise<void> {
    if (Math.random() < 0.4) throw new Error("Provider B failed");
    return;
  }
}