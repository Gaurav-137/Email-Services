import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { EmailService } from "./services/EmailService";
import { ProviderA } from "./providers/ProviderA";
import { ProviderB } from "./providers/ProviderB";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const emailService = new EmailService([new ProviderA(), new ProviderB()]);

app.post("/send-email", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id, to, subject, body } = req.body;

    if (!id || !to || !subject || !body) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const result = await emailService.send({ id, to, subject, body });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.get("/", (_, res) => {
  res.send("Resilient Email Service is running ✅");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});