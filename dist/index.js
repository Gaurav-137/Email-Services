"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProviderA_1 = require("./providers/ProviderA");
const ProviderB_1 = require("./providers/ProviderB");
const EmailService_1 = require("./services/EmailService");
const QueueService_1 = require("./services/QueueService");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const emailService = new EmailService_1.EmailService([new ProviderA_1.ProviderA(), new ProviderB_1.ProviderB()]);
const queueService = new QueueService_1.QueueService(emailService);
const exampleEmail = {
    id: "email-001",
    to: "user@example.com",
    subject: "Test Email",
    body: "This is a test email",
};
queueService.enqueue(exampleEmail);
