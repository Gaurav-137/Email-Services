"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const types_1 = require("../types/types");
const Retry_1 = require("../utils/Retry");
const CircuitBreaker_1 = require("../utils/CircuitBreaker");
const RateLimiter_1 = require("../utils/RateLimiter");
const StatusStore_1 = require("../store/StatusStore");
const Logger_1 = require("../utils/Logger");
class EmailService {
    constructor(providers) {
        this.providers = providers;
        this.store = new StatusStore_1.StatusStore();
        this.circuitBreakers = new Map();
        this.rateLimiter = new RateLimiter_1.RateLimiter(10); // max 10 emails per minute
        for (const provider of providers) {
            this.circuitBreakers.set(provider.name, new CircuitBreaker_1.CircuitBreaker());
        }
    }
    async send(email) {
        if (this.store.exists(email.id)) {
            return this.store.getStatus(email.id);
        }
        if (!this.rateLimiter.canProceed()) {
            const result = {
                status: types_1.EmailStatus.FAILED,
                provider: "N/A",
                error: "Rate limit exceeded",
            };
            this.store.setStatus(email.id, result);
            Logger_1.Logger.error("Rate limit exceeded for email ID: " + email.id);
            return result;
        }
        for (const provider of this.providers) {
            const cb = this.circuitBreakers.get(provider.name);
            try {
                await cb.exec(() => (0, Retry_1.retryWithExponentialBackoff)(() => provider.sendEmail(email), 3));
                const result = {
                    status: types_1.EmailStatus.SENT,
                    provider: provider.name,
                };
                this.store.setStatus(email.id, result);
                Logger_1.Logger.log(`Email sent via ${provider.name}`);
                return result;
            }
            catch (err) {
                Logger_1.Logger.error(`Provider ${provider.name} failed: ${err.message}`);
            }
        }
        const result = {
            status: types_1.EmailStatus.FAILED,
            provider: "None",
            error: "All providers failed",
        };
        this.store.setStatus(email.id, result);
        return result;
    }
    getStatus(id) {
        return this.store.getStatus(id);
    }
}
exports.EmailService = EmailService;
