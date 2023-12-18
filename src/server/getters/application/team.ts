import { prisma } from "@/services/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ApplicationStatus } from "@/services/types/applicationStatus";

export type TeamMemberData = {
  id: number;
  email: string;
  isOwner: boolean;
  isCurrentUser: boolean;
  applicationStatus: ApplicationStatus;
};

export type TeamData = {
  id: number;
  name: string;
  code: string;
  members: TeamMemberData[];
};
export type GetTeamData = {
  status: "not_signed_in" | "unverified_email" | "success";
  team: TeamData | null;
  isOwnerSession: boolean;
};

type GetTeamInput = {
  hackerId: number | null;
};

const getTeam = async ({ hackerId }: GetTeamInput): Promise<GetTeamData> => {
  const session = await getServerSession(authOptions);
  if (!session?.id || !hackerId) {
    return {
      status: "not_signed_in",
      team: null,
      isOwnerSession: false,
    };
  }
  if (!session.emailVerified) {
    return {
      status: "unverified_email",
      team: null,
      isOwnerSession: false,
    };
  }
  const hacker = await prisma.hacker.findUnique({
    select: {
      id: true,
      team: {
        select: {
          id: true,
          name: true,
          code: true,
          ownerId: true,
          members: {
            select: {
              id: true,
              application: {
                select: {
                  status: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
              user: {
                select: {
                  email: true,
                },
              },
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
    throw new Error("Hacker not found");
  }

  if (!hacker.team) {
    return {
      status: "success",
      team: null,
      isOwnerSession: false,
    };
  }

  const ownerId = hacker.team.ownerId;

  const team: TeamData = {
    id: hacker.team.id,
    name: hacker.team.name,
    code: hacker.team.code,
    members: hacker.team.members.map((member) => ({
      id: member.id,
      email: member.user.email,
      isOwner: member.id === ownerId,
      isCurrentUser: member.id === hacker.id,
      applicationStatus: member.application?.status.name as ApplicationStatus,
    })),
  };

  return {
    status: "success",
    team,
    isOwnerSession: ownerId === hacker.id,
  };
};

export default getTeam;
