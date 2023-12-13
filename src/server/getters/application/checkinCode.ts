import requireHackerSession from "@/server/services/helpers/auth/requireHackerSession";
import { createCipheriv, randomBytes } from "crypto";
import { prisma } from "@/services/prisma";
import {
  ApplicationStatus,
  ApplicationStatusEnum,
} from "@/services/types/applicationStatus";

type CheckinCodeData = {
  checkinCode: string | null;
  email: string;
};
const getCheckinCode = async (): Promise<CheckinCodeData> => {
  const hacker = await requireHackerSession();
  const application = await prisma.application.findUnique({
    select: {
      status: {
        select: {
          name: true,
        },
      },
      hacker: {
        select: {
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
    where: {
      hackerId: hacker.id,
    },
  });
  if (!application) {
    throw new Error("Missing application");
  }
  const applicationStatus = application.status.name as ApplicationStatus;
  if (applicationStatus !== ApplicationStatusEnum.confirmed) {
    return {
      checkinCode: null,
      email: application.hacker.user.email,
    };
  }
  const checkinCode = `hackathon-${hacker.hackathonId}-hacker-${hacker.id}`;

  if (!process.env.CHECKIN_CODE_KEY) {
    throw new Error("Missing checkin code key");
  }

  const iv = randomBytes(16);
  const key = Buffer.from(process.env.CHECKIN_CODE_KEY, "base64");
  const ivHex = iv.toString("hex");

  const cipher = createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(checkinCode),
    cipher.final(),
  ]).toString("hex");

  return {
    checkinCode: `${encrypted}-${ivHex}`,
    email: application.hacker.user.email,
  };
};

export default getCheckinCode;
