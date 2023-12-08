import emailClient from "./emailClient";
import { BrevoTemplateIds } from "@/services/emails/consts/brevoTemplateIds";
import * as Sentry from "@sentry/nextjs";

type SendEmailParams = {
  recipientEmail: string;
};
const sendEmailSafely = async (callback: () => Promise<void>) => {
  if (process.env.EMAIL_DEBUG) {
    console.log("Email debug mode enabled, not sending email");
    return;
  }
  try {
    await callback();
  } catch (e) {
    if (e instanceof Error) {
      Sentry.captureException(`Failed to send email: ${e.message}`);
      throw new Error(`Failed to send email: ${e.message}`);
    }
    Sentry.captureException("Failed to send email unknown error");
    throw new Error(`Failed to send email - unknown error`);
  }
};
export const sendInvitationEmail = async ({
  recipientEmail,
}: SendEmailParams) => {
  await sendEmailSafely(async () => {
    await emailClient.smtp.sendTransacEmail({
      templateId: BrevoTemplateIds.APPLICATION_INVITED,
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
