"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
class RateLimiter {
    constructor(maxRequestsPerMinute) {
        this.timestamps = [];
        this.maxRequestsPerMinute = maxRequestsPerMinute;
    }
    canProceed() {
        const oneMinuteAgo = Date.now() - 60000;
        this.timestamps = this.timestamps.filter(ts => ts > oneMinuteAgo);
        if (this.timestamps.length < this.maxRequestsPerMinute) {
            this.timestamps.push(Date.now());
            return true;
        }
        return false;
    }
}
exports.RateLimiter = RateLimiter;
