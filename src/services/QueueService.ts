import { EmailPayload } from "../types/types";
import { EmailService } from "./EmailService";

export class QueueService {
  private queue: EmailPayload[] = [];
  private isProcessing = false;

  constructor(private emailService: EmailService) {}

  enqueue(email: EmailPayload): Promise<void> {
    return new Promise((resolve) => {
      this.queue.push(email);
      this.processQueue().then(resolve);
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (this.queue.length) {
      const email = this.queue.shift()!;
      await this.emailService.send(email);
    }

    this.isProcessing = false;
  }
}