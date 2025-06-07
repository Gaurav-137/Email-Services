"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const EmailService_1 = require("./services/EmailService");
const ProviderA_1 = require("./providers/ProviderA");
const ProviderB_1 = require("./providers/ProviderB");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
const emailService = new EmailService_1.EmailService([new ProviderA_1.ProviderA(), new ProviderB_1.ProviderB()]);
// Health check route
app.get("/", (_, res) => {
    res.send("✅ Email API is running.");
});
// Email sending API
app.post("/send-email", async (req, res) => {
    const { id, to, subject, body } = req.body;
    if (!id || !to || !subject || !body) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }
    try {
        const result = await emailService.send({ id, to, subject, body });
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to send email" });
    }
});
// Start server
app.listen(PORT, () => {
    console.log(`🌐 API running on http://localhost:${PORT}`);
});
