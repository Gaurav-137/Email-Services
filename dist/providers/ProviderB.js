"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderB = void 0;
class ProviderB {
    constructor() {
        this.name = "ProviderB";
    }
    async sendEmail(email) {
        if (Math.random() < 0.4)
            throw new Error("Provider B failed");
        return;
    }
}
exports.ProviderB = ProviderB;
