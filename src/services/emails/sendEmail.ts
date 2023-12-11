import emailClient from "./emailClient";
import { BrevoTemplateIds } from "@/services/emails/consts/brevoTemplateIds";
import * as Sentry from "@sentry/nextjs";

type SendEmailParams = {
  recipientEmail: string;
};
const sendEmailSafely = async (callback: () => Promise<void>) => {
  if (process.env.EMAILS_ENABLED !== "true") {
    console.log("Emails not enabled, not sending email");
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

export const sendSubmittedApplicationEmail = async ({
  recipientEmail,
}: SendEmailParams) => {
  await sendEmailSafely(async () => {
    await emailClient.smtp.sendTransacEmail({
      templateId: BrevoTemplateIds.APPLICATION_SUBMITTED,
      to: [
        {
          email: recipientEmail,
        },
      ],
    });
  });
};

export const sendSubmittedReimbursementEmail = async ({
  recipientEmail,
}: SendEmailParams) => {
  await sendEmailSafely(async () => {
    await emailClient.smtp.sendTransacEmail({
      templateId: BrevoTemplateIds.REIMBURSEMENT_SUBMITTED,
      to: [
        {
          email: recipientEmail,
        },
      ],
    });
  });
};

export const sendApprovedReimbursementEmail = async ({
  recipientEmail,
}: SendEmailParams) => {
  await sendEmailSafely(async () => {
    await emailClient.smtp.sendTransacEmail({
      templateId: BrevoTemplateIds.REIMBURSEMENT_APPROVED,
      to: [
        {
          email: recipientEmail,
        },
      ],
    });
  });
};

export const sendDeclinedReimbursementEmail = async ({
  recipientEmail,
}: SendEmailParams) => {
  await sendEmailSafely(async () => {
    await emailClient.smtp.sendTransacEmail({
      templateId: BrevoTemplateIds.REIMBURSEMENT_DECLINED,
      to: [
        {
          email: recipientEmail,
        },
      ],
    });
  });
};

export const sendRejectedApplicationEmail = async ({
  recipientEmail,
}: SendEmailParams) => {
  await sendEmailSafely(async () => {
    await emailClient.smtp.sendTransacEmail({
      templateId: BrevoTemplateIds.APPLICATION_REJECTED,
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

export const sendEmailForgotPassword = async ({
  recipientEmail,
  verificationToken,
  userId,
}: SendEmailParams & {
  verificationToken: string;
  userId: number;
}) => {
  const link = `${
    process.env.BASE_URL ?? "https://apply.hackkosice.com"
  }/auth/${userId}/forgot-password?token=${verificationToken}`;
  await sendEmailSafely(async () => {
    await emailClient.smtp.sendTransacEmail({
      templateId: BrevoTemplateIds.RESET_PASSWORD,
      to: [
        {
          email: recipientEmail,
        },
      ],
      params: {
        resetLink: link,
      },
    });
  });
};
