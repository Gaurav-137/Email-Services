import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { EmailService } from "./services/EmailService";
import { ProviderA } from "./providers/ProviderA";
import { ProviderB } from "./providers/ProviderB";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const emailService = new EmailService([new ProviderA(), new ProviderB()]);

// Health check route
app.get("/", (_: Request, res: Response) => {
  res.send("✅ Email API is running.");
});

// Email sending API
app.post("/send-email", async (req: Request, res: Response): Promise<void> => {
  const { id, to, subject, body } = req.body;

  if (!id || !to || !subject || !body) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    const result = await emailService.send({ id, to, subject, body });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to send email" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🌐 API running on http://localhost:${PORT}`);
});