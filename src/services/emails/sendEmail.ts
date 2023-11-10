import emailClient from "./emailClient";
import { BrevoTemplateIds } from "@/services/emails/consts/brevoTemplateIds";

type SendEmailParams = {
  recipientEmail: string;
};
const sendEmailSafely = async (callback: () => Promise<void>) => {
  try {
    await callback();
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`Failed to send email: ${e.message}`);
    }
    throw new Error(`Failed to send email - unknown error`);
  }
};
export const sendInvitationEmail = async ({
  recipientEmail,
}: SendEmailParams) => {
  await sendEmailSafely(async () => {
    await emailClient.smtp.sendTransacEmail({
      templateId: BrevoTemplateIds.INVITATION,
      to: [
        {
          email: recipientEmail,
        },
      ],
    });
  });
};

export const sendEmailConfirmationEmail = async ({
  recipientEmail,
}: SendEmailParams) => {
  await sendEmailSafely(async () => {
    await emailClient.smtp.sendTransacEmail({
      templateId: BrevoTemplateIds.EMAIL_CONFIRMATION,
      to: [
        {
          email: recipientEmail,
        },
      ],
      params: {
        confirmationLink: "https://apply.hackkosice.com/confirm-email",
      },
    });
  });
};
