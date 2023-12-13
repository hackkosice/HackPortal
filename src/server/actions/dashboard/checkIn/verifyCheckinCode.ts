"use server";

import { prisma } from "@/services/prisma";
import { Prisma } from ".prisma/client";
import SortOrder = Prisma.SortOrder;
import { createDecipheriv } from "crypto";
import { ExpectedServerActionError } from "@/services/types/serverErrors";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";
import getFormFieldValue from "@/server/services/helpers/applications/getFormFieldValue";
import {
  ApplicationStatus,
  ApplicationStatusEnum,
} from "@/services/types/applicationStatus";

type VerifyCheckinCodeInput = {
  checkinCode: string | null;
  email: string | null;
  hackathonId: number;
};

export type VerifyCheckinCodeOutput = {
  teamName: string | null;
  hackerId: number;
  applicationValues: {
    fieldId: number;
    value: string | null;
    label: string;
  }[];
};
const verifyCheckinCode = async ({
  checkinCode,
  hackathonId,
  email,
}: VerifyCheckinCodeInput): Promise<VerifyCheckinCodeOutput> => {
  await requireOrganizerSession();
  let hackerId: number;

  if (checkinCode) {
    const checkinCodeRegex = /^.+-.+$/;
    if (!checkinCodeRegex.test(checkinCode)) {
      throw new Error("Invalid checkin code");
    }

    const [encrypted, ivHex] = checkinCode.split("-");
    const iv = Buffer.from(ivHex, "hex");
    if (!process.env.CHECKIN_CODE_KEY) {
      throw new Error("Missing checkin code key");
    }
    let decrypted: string;
    try {
      const key = Buffer.from(process.env.CHECKIN_CODE_KEY, "base64");
      const decipher = createDecipheriv("aes-256-cbc", key, iv);
      decrypted = Buffer.concat([
        decipher.update(Buffer.from(encrypted, "hex")),
        decipher.final(),
      ]).toString();
    } catch {
      throw new ExpectedServerActionError("Invalid checkin code");
    }

    const descryptedRegex =
      /^hackathon-(?<hackathonId>\d+)-hacker-(?<hackerId>\d+)$/;
    const match = descryptedRegex.exec(decrypted);
    if (!match) {
      throw new ExpectedServerActionError("Invalid checkin code");
    }
    const { hackerId: scannedHackerId, hackathonId: scannedHackathonId } =
      match.groups as {
        hackerId: string;
        hackathonId: string;
      };
    if (Number(scannedHackathonId) !== hackathonId) {
      throw new ExpectedServerActionError("Invalid checkin code");
    }
    hackerId = Number(scannedHackerId);
  } else if (email) {
    const hacker = await prisma.hacker.findFirst({
      select: {
        id: true,
      },
      where: {
        AND: [
          {
            hackathonId,
          },
          {
            user: {
              email,
            },
          },
        ],
      },
    });
    if (!hacker) {
      throw new ExpectedServerActionError("Invalid checkin email");
    }
    hackerId = hacker.id;
  } else {
    throw new ExpectedServerActionError("Invalid checkin code");
  }
  const hacker = await prisma.hacker.findUnique({
    select: {
      team: {
        select: {
          name: true,
        },
      },
      application: {
        select: {
          status: {
            select: {
              name: true,
            },
          },
        },
      },
    },
    where: {
      id: hackerId,
    },
  });
  if (!hacker) {
    throw new ExpectedServerActionError("Invalid checkin code");
  }

  if (!hacker.application) {
    throw new ExpectedServerActionError("Hacker has no application");
  }
  const applicationStatus = hacker.application.status.name as ApplicationStatus;

  if (applicationStatus === ApplicationStatusEnum.attended) {
    throw new ExpectedServerActionError("Hacker already checked in");
  }

  if (applicationStatus !== ApplicationStatusEnum.confirmed) {
    throw new ExpectedServerActionError("Hacker not confirmed");
  }
  const applicationValuesDb = await prisma.applicationFormFieldValue.findMany({
    select: {
      value: true,
      option: {
        select: {
          value: true,
        },
      },
      field: {
        select: {
          id: true,
          label: true,
        },
      },
      file: {
        select: {
          name: true,
          path: true,
        },
      },
    },
    where: {
      AND: [
        {
          application: {
            hackerId: hackerId,
          },
        },
        {
          field: {
            shownInCheckin: true,
          },
        },
      ],
    },
    orderBy: [
      {
        field: {
          step: {
            position: SortOrder.asc,
          },
        },
      },
      {
        field: {
          position: SortOrder.asc,
        },
      },
    ],
  });
  const values = applicationValuesDb.map((value) => ({
    value: getFormFieldValue({ formValue: value }) ?? "",
    label: value.field.label,
    fieldId: value.field.id,
  }));
  return {
    hackerId,
    teamName: hacker.team?.name ?? null,
    applicationValues: values,
  };
};

export default verifyCheckinCode;
