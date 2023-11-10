import "server-only";

import { Api as Brevo } from "@/services/emails/types/BrevoApi";

if (!process.env.BREVO_API_KEY) throw new Error("No Brevo API key found");

const emailClient = new Brevo({
  baseApiParams: {
    headers: {
      "api-key": process.env.BREVO_API_KEY,
    },
  },
});

export default emailClient;
