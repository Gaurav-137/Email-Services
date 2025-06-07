import { ProviderA } from "./providers/ProviderA";
import { ProviderB } from "./providers/ProviderB";
import { EmailService } from "./services/EmailService";
import { QueueService } from "./services/QueueService";
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

const emailService = new EmailService([new ProviderA(), new ProviderB()]);
const queueService = new QueueService(emailService);

const exampleEmail = {
  id: "email-001",
  to: "user@example.com",
  subject: "Test Email",
  body: "This is a test email",
};

queueService.enqueue(exampleEmail);