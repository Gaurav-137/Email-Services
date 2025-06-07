"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = void 0;
class QueueService {
    constructor(emailService) {
        this.emailService = emailService;
        this.queue = [];
        this.isProcessing = false;
    }
    enqueue(email) {
        return new Promise((resolve) => {
            this.queue.push(email);
            this.processQueue().then(resolve);
        });
    }
    async processQueue() {
        if (this.isProcessing)
            return;
        this.isProcessing = true;
        while (this.queue.length) {
            const email = this.queue.shift();
            await this.emailService.send(email);
        }
        this.isProcessing = false;
    }
}
exports.QueueService = QueueService;
