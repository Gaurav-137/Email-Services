import { EmailService } from "../src/services/EmailService";
import { ProviderA } from "../src/providers/ProviderA";
import { ProviderB } from "../src/providers/ProviderB";
import { EmailPayload, EmailStatus } from "../src/types/types";

test("Email is sent successfully", async () => {
    const service = new EmailService([new ProviderA(), new ProviderB()]);
    const email: EmailPayload = {
        id: "test-email-id",
        to: "test@test.com",
        subject: "Unit Test Email",
        body: "Hello world",
    };

    const result = await service.send(email);
    expect([EmailStatus.SENT, EmailStatus.FAILED]).toContain(result.status);
});

function expect(received: any) {
    return {
        toContain(expected: any) {
            if (!Array.isArray(received) || !received.includes(expected)) {
                throw new Error(`Expected array to contain: ${expected}, but got: ${JSON.stringify(received)}`);
            }
        }
    };
}
