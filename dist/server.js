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
app.post("/send-email", async (req, res, next) => {
    try {
        const { id, to, subject, body } = req.body;
        if (!id || !to || !subject || !body) {
            res.status(400).json({ error: "Missing required fields" });
            return;
        }
        const result = await emailService.send({ id, to, subject, body });
        res.json(result);
    }
    catch (error) {
        next(error);
    }
});
app.get("/", (_, res) => {
    res.send("Resilient Email Service is running ✅");
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
