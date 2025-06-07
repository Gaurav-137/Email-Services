export class RateLimiter {
  private timestamps: number[] = [];
  private maxRequestsPerMinute: number;

  constructor(maxRequestsPerMinute: number) {
    this.maxRequestsPerMinute = maxRequestsPerMinute;
  }

  canProceed(): boolean {
    const oneMinuteAgo = Date.now() - 60000;
    this.timestamps = this.timestamps.filter(ts => ts > oneMinuteAgo);
    if (this.timestamps.length < this.maxRequestsPerMinute) {
      this.timestamps.push(Date.now());
      return true;
    }
    return false;
  }
}