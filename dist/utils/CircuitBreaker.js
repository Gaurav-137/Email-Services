"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreaker = void 0;
class CircuitBreaker {
    constructor(threshold = 5, timeout = 10000) {
        this.failureCount = 0;
        this.successCount = 0;
        this.state = "CLOSED";
        this.lastFailureTime = 0;
        this.threshold = threshold;
        this.timeout = timeout;
    }
    async exec(fn) {
        if (this.state === "OPEN") {
            if (Date.now() - this.lastFailureTime > this.timeout) {
                this.state = "HALF_OPEN";
            }
            else {
                throw new Error("Circuit is OPEN");
            }
        }
        try {
            const result = await fn();
            this.successCount++;
            if (this.state === "HALF_OPEN")
                this.state = "CLOSED";
            return result;
        }
        catch (err) {
            this.failureCount++;
            this.lastFailureTime = Date.now();
            if (this.failureCount >= this.threshold) {
                this.state = "OPEN";
            }
            throw err;
        }
    }
}
exports.CircuitBreaker = CircuitBreaker;
