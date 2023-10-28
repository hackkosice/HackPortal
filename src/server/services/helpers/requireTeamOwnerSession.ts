import requireHackerSession from "@/server/services/helpers/requireHackerSession";
import { prisma } from "@/services/prisma";

const requireTeamOwnerSession = async () => {
  const hacker = await requireHackerSession();

  if (!hacker.teamId) {
    throw new Error("Hacker is not in a team");
  }

  const teamId = hacker.teamId;

  const team = await prisma.team.findUnique({
    where: {
      id: teamId,
    },
  });

  if (!team) {
    throw new Error("Team not found");
  }

  if (team.ownerId !== hacker.id) {
    throw new Error("You are not the owner of this team");
  }

  return { hacker, team };
};

export default requireTeamOwnerSession;
