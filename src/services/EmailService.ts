import { EmailPayload, EmailResult, EmailStatus } from "../types/types";
import { EmailProvider } from "../providers/BaseProvider";
import { retryWithExponentialBackoff } from "../utils/Retry";
import { CircuitBreaker } from "../utils/CircuitBreaker";
import { RateLimiter } from "../utils/RateLimiter";
import { StatusStore } from "../store/StatusStore";
import { Logger } from "../utils/Logger";

export class EmailService {
  private providers: EmailProvider[];
  private circuitBreakers: Map<string, CircuitBreaker>;
  private store: StatusStore;
  private rateLimiter: RateLimiter;

  constructor(providers: EmailProvider[]) {
    this.providers = providers;
    this.store = new StatusStore();
    this.circuitBreakers = new Map();
    this.rateLimiter = new RateLimiter(10); // 10 requests/min

    for (const provider of providers) {
      this.circuitBreakers.set(provider.name, new CircuitBreaker());
    }
  }

  async send(email: EmailPayload): Promise<EmailResult> {
    // Idempotency
    if (this.store.exists(email.id)) {
      return this.store.getStatus(email.id)!;
    }

    // Rate limiting
    if (!this.rateLimiter.canProceed()) {
      const result: EmailResult = {
        status: EmailStatus.FAILED,
        provider: "N/A",
        error: "Rate limit exceeded",
      };
      this.store.setStatus(email.id, result);
      Logger.error("Rate limit exceeded for email ID: " + email.id);
      return result;
    }

    // Try each provider with retries and circuit breaker
    for (const provider of this.providers) {
      const cb = this.circuitBreakers.get(provider.name)!;
      try {
        await cb.exec(() =>
          retryWithExponentialBackoff(() => provider.sendEmail(email), 3)
        );

        const result: EmailResult = {
          status: EmailStatus.SENT,
          provider: provider.name,
        };

        this.store.setStatus(email.id, result);
        Logger.log(`Email sent via ${provider.name}`);
        return result;
      } catch (err: any) {
        Logger.error(`Provider ${provider.name} failed: ${err.message}`);
      }
    }

    const result: EmailResult = {
      status: EmailStatus.FAILED,
      provider: "None",
      error: "All providers failed",
    };

    this.store.setStatus(email.id, result); // ✅ FINAL STEP THIS FIXES YOUR ISSUE
    return result;
  }

  getStatus(id: string) {
    return this.store.getStatus(id);
  }
}