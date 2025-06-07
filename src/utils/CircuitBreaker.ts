export class CircuitBreaker {
  private failureCount = 0;
  private successCount = 0;
  private state: "CLOSED" | "OPEN" | "HALF_OPEN" = "CLOSED";
  private readonly threshold: number;
  private readonly timeout: number;
  private lastFailureTime: number = 0;

  constructor(threshold = 5, timeout = 10000) {
    this.threshold = threshold;
    this.timeout = timeout;
  }

  async exec<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === "OPEN") {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = "HALF_OPEN";
      } else {
        throw new Error("Circuit is OPEN");
      }
    }

    try {
      const result = await fn();
      this.successCount++;
      if (this.state === "HALF_OPEN") this.state = "CLOSED";
      return result;
    } catch (err) {
      this.failureCount++;
      this.lastFailureTime = Date.now();
      if (this.failureCount >= this.threshold) {
        this.state = "OPEN";
      }
      throw err;
    }
  }
}