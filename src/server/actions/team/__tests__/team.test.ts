import createTeam from "@/server/actions/team/createTeam";
import deleteTeam from "@/server/actions/team/deleteTeam";
import editTeamName from "@/server/actions/team/editTeamName";
import joinTeam from "@/server/actions/team/joinTeam";
import kickTeamMember from "@/server/actions/team/kickTeamMember";
import leaveTeam from "@/server/actions/team/leaveTeam";
import requireHackerSession from "@/server/services/helpers/auth/requireHackerSession";
import { prismaMock } from "@/services/jest/prisma-singleton";

jest.mock("@/server/services/helpers/auth/requireHackerSession", () => ({
  __esModule: true,
  default: jest.fn(),
}));
const mockRequireHackerSession = requireHackerSession as jest.Mock;

jest.mock("next/cache", () => ({
  __esModule: true,
  revalidatePath: jest.fn(),
}));

const mockHacker = (teamId: number | null) =>
  mockRequireHackerSession.mockResolvedValue({
    id: 1,
    hackathonId: 2,
    teamId,
  });

describe("team actions", () => {
  describe("createTeam", () => {
    beforeEach(() => mockHacker(null));

    it("should throw an error if the name is too long", async () => {
      await expect(createTeam({ name: "a".repeat(21) })).rejects.toThrow(
        "Team name too long"
      );
    });

    it("should throw an error if the name is taken", async () => {
      prismaMock.team.findFirst.mockResolvedValue({ id: 3 } as never);
      await expect(createTeam({ name: "team" })).rejects.toThrow(
        "Team with this name already exists"
      );
    });

    it("should create the team and add the owner to it", async () => {
      prismaMock.team.findFirst.mockResolvedValue(null);
      prismaMock.team.create.mockResolvedValue({ id: 3 } as never);

      await createTeam({ name: "team" });

      expect(prismaMock.team.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: {
            name: "team",
            code: expect.stringMatching(/^[0-9a-f]{12}$/),
            ownerId: 1,
          },
        })
      );
      expect(prismaMock.hacker.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { teamId: 3 },
      });
    });
  });

  describe("joinTeam", () => {
    it("should throw an error if the hacker already has a team", async () => {
      mockHacker(3);
      await expect(joinTeam({ code: "code" })).rejects.toThrow(
        "Hacker already has a team"
      );
    });

    it("should throw an error if the team is not found", async () => {
      mockHacker(null);
      prismaMock.team.findUnique.mockResolvedValue(null);
      await expect(joinTeam({ code: "code" })).rejects.toThrow(
        "Team not found"
      );
    });

    it("should throw an error if the hackathon is not found", async () => {
      mockHacker(null);
      prismaMock.team.findUnique.mockResolvedValue({
        id: 3,
        members: [],
      } as never);
      prismaMock.hackathon.findUnique.mockResolvedValue(null);
      await expect(joinTeam({ code: "code" })).rejects.toThrow(
        "Hackathon not found"
      );
    });

    it("should throw an error if the team is full", async () => {
      mockHacker(null);
      prismaMock.team.findUnique.mockResolvedValue({
        id: 3,
        members: [{ id: 4 }, { id: 5 }],
      } as never);
      prismaMock.hackathon.findUnique.mockResolvedValue({
        maxTeamSize: 2,
      } as never);
      await expect(joinTeam({ code: "code" })).rejects.toThrow("Team is full");
      expect(prismaMock.hacker.update).not.toHaveBeenCalled();
    });

    it("should add the hacker to the team", async () => {
      mockHacker(null);
      prismaMock.team.findUnique.mockResolvedValue({
        id: 3,
        members: [{ id: 4 }],
      } as never);
      prismaMock.hackathon.findUnique.mockResolvedValue({
        maxTeamSize: 2,
      } as never);

      await joinTeam({ code: "code" });

      expect(prismaMock.hacker.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { teamId: 3 },
      });
    });
  });

  describe("leaveTeam", () => {
    it("should throw an error if the hacker is not in a team", async () => {
      mockHacker(null);
      await expect(leaveTeam()).rejects.toThrow("Hacker is not in a team");
    });

    it("should throw an error if the team is not found", async () => {
      mockHacker(3);
      prismaMock.team.findUnique.mockResolvedValue(null);
      await expect(leaveTeam()).rejects.toThrow("Team not found");
    });

    it("should not let the owner leave", async () => {
      mockHacker(3);
      prismaMock.team.findUnique.mockResolvedValue({
        id: 3,
        ownerId: 1,
      } as never);
      await expect(leaveTeam()).rejects.toThrow("Owner cannot leave team");
    });

    it("should remove the hacker from the team", async () => {
      mockHacker(3);
      prismaMock.team.findUnique.mockResolvedValue({
        id: 3,
        ownerId: 9,
      } as never);

      await leaveTeam();

      expect(prismaMock.hacker.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { teamId: null },
      });
    });
  });

  describe("team owner actions", () => {
    const mockOwnedTeam = () => {
      mockHacker(3);
      prismaMock.team.findUnique.mockResolvedValue({
        id: 3,
        ownerId: 1,
      } as never);
    };

    it("should throw an error if the hacker is not in a team", async () => {
      mockHacker(null);
      await expect(deleteTeam()).rejects.toThrow("Hacker is not in a team");
    });

    it("should throw an error if the team is not found", async () => {
      mockHacker(3);
      prismaMock.team.findUnique.mockResolvedValue(null);
      await expect(deleteTeam()).rejects.toThrow("Team not found");
    });

    it("should throw an error if the hacker is not the owner", async () => {
      mockHacker(3);
      prismaMock.team.findUnique.mockResolvedValue({
        id: 3,
        ownerId: 9,
      } as never);
      await expect(deleteTeam()).rejects.toThrow(
        "You are not the owner of this team"
      );
      expect(prismaMock.team.delete).not.toHaveBeenCalled();
    });

    it("should delete the team", async () => {
      mockOwnedTeam();
      await deleteTeam();
      expect(prismaMock.team.delete).toHaveBeenCalledWith({
        where: { id: 3 },
      });
    });

    it("should not rename the team to a taken name", async () => {
      mockOwnedTeam();
      prismaMock.team.findFirst.mockResolvedValue({ id: 4 } as never);
      await expect(editTeamName({ newName: "taken" })).rejects.toThrow(
        "Team with this name already exists"
      );
    });

    it("should rename the team", async () => {
      mockOwnedTeam();
      prismaMock.team.findFirst.mockResolvedValue(null);
      await editTeamName({ newName: "new name" });
      expect(prismaMock.team.update).toHaveBeenCalledWith({
        where: { id: 3 },
        data: { name: "new name" },
      });
    });

    it("should not let the owner kick themselves", async () => {
      mockOwnedTeam();
      await expect(kickTeamMember({ memberId: 1 })).rejects.toThrow(
        "You cannot kick yourself"
      );
    });

    it("should kick the team member", async () => {
      mockOwnedTeam();
      await kickTeamMember({ memberId: 7 });
      expect(prismaMock.hacker.update).toHaveBeenCalledWith({
        where: { id: 7 },
        data: { teamId: null },
      });
    });
  });
});
