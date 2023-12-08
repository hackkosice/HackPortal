import { prisma } from "@/services/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export type TeamMemberData = {
  id: number;
  email: string;
  isOwner: boolean;
  isCurrentUser: boolean;
};

export type TeamData = {
  id: number;
  name: string;
  code: string;
  members: TeamMemberData[];
};
export type GetTeamData = {
  status: "not_signed_in" | "success";
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
    })),
  };

  return {
    status: "success",
    team,
    isOwnerSession: ownerId === hacker.id,
  };
};

export default getTeam;
