"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderA = void 0;
class ProviderA {
    constructor() {
        this.name = "ProviderA";
    }
    async sendEmail(email) {
        if (Math.random() < 0.3)
            throw new Error("Provider A failed");
        return;
    }
}
exports.ProviderA = ProviderA;
