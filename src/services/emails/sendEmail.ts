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
  verificationToken,
  userId,
}: SendEmailParams & {
  verificationToken: string;
  userId: number;
}) => {
  const link = `${
    process.env.BASE_URL ?? "https://apply.hackkosice.com"
  }/auth/${userId}/verify?token=${verificationToken}`;
  await sendEmailSafely(async () => {
    await emailClient.smtp.sendTransacEmail({
      templateId: BrevoTemplateIds.EMAIL_CONFIRMATION,
      to: [
        {
          email: recipientEmail,
        },
      ],
      params: {
        confirmationLink: link,
      },
    });
  });
};
