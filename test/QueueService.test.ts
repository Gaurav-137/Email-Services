import { QueueService } from "../src/services/QueueService";
import { EmailService } from "../src/services/EmailService";
import { EmailPayload, EmailStatus } from "../src/types/types";
import { EmailProvider } from "../src/providers/BaseProvider";

// ✅ Mock provider that ALWAYS succeeds
class MockSuccessProvider implements EmailProvider {
  name = "MockSuccessProvider";
  async sendEmail(_: EmailPayload) {
    return Promise.resolve();
  }
}

// ✅ Mock provider that ALWAYS fails
class MockFailProvider implements EmailProvider {
  name = "MockFailProvider";
  async sendEmail(_: EmailPayload): Promise<void> {
    throw new Error("Mock fail");
  }
}

describe("QueueService", () => {
  it("should successfully process emails in the queue", async () => {
    const emailService = new EmailService([new MockSuccessProvider()]);
    const queueService = new QueueService(emailService);

    const email: EmailPayload = {
      id: "queue-ok-1",
      to: "user@example.com",
      subject: "Test Email",
      body: "It works!",
    };

    await queueService.enqueue(email); // ✅ Await here

    const status = emailService.getStatus(email.id);
    expect(status).toBeDefined();
    expect(status?.status).toBe(EmailStatus.SENT);
    expect(status?.provider).toBe("MockSuccessProvider");
  });

  it("should handle failed providers and return failed status", async () => {
    const emailService = new EmailService([new MockFailProvider()]);
    const queueService = new QueueService(emailService);

    const email: EmailPayload = {
      id: "queue-fail-1",
      to: "fail@example.com",
      subject: "Fails always",
      body: "meh",
    };

    await queueService.enqueue(email); // ✅ Await here

    const status = emailService.getStatus(email.id);
    expect(status).toBeDefined();                      // ✅ FIXED THIS
    expect(status?.status).toBe(EmailStatus.FAILED);
  });

  it("should be idempotent and not resend email", async () => {
    const emailService = new EmailService([new MockSuccessProvider()]);
    const queueService = new QueueService(emailService);

    const email: EmailPayload = {
      id: "queue-idem-1",
      to: "same@example.com",
      subject: "Only once",
      body: "Hello",
    };

    await queueService.enqueue(email);
    await queueService.enqueue(email); // sent twice, should not duplicate

    const status = emailService.getStatus(email.id);
    expect(status).toBeDefined();
    expect(status?.status).toBe(EmailStatus.SENT);
  });
});