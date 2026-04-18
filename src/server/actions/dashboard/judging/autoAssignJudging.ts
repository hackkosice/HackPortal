"use server";

import { prisma } from "@/services/prisma";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { revalidatePath } from "next/cache";

const autoAssignJudging = async (hackathonId: number) => {
  await requireAdminSession();

  const [slots, organizers, teams, existingAssignments] = await Promise.all([
    prisma.judgingSlot.findMany({
      where: { hackathonId },
      orderBy: { startTime: "asc" },
    }),
    prisma.organizer.findMany({
      select: { id: true },
    }),
    prisma.team.findMany({
      where: {
        members: { some: { hackathonId } },
        table: { hackathonId },
      },
      select: { id: true },
    }),
    prisma.teamJudging.findMany({
      where: { judgingSlot: { hackathonId } },
      select: { judgingSlotId: true, organizerId: true, teamId: true },
    }),
  ]);

  if (slots.length === 0 || organizers.length === 0 || teams.length === 0) {
    return;
  }

  // Track assignments per slot, per judge, and per team (counts)
  const slotTeams = new Map<number, Set<number>>();
  const judgeTeams = new Map<number, Set<number>>();
  const teamAssignmentCount = new Map<number, number>();

  for (const slot of slots) slotTeams.set(slot.id, new Set());
  for (const org of organizers) judgeTeams.set(org.id, new Set());
  for (const team of teams) teamAssignmentCount.set(team.id, 0);

  for (const a of existingAssignments) {
    slotTeams.get(a.judgingSlotId)?.add(a.teamId);
    judgeTeams.get(a.organizerId)?.add(a.teamId);
    teamAssignmentCount.set(
      a.teamId,
      (teamAssignmentCount.get(a.teamId) ?? 0) + 1
    );
  }

  const toCreate: { judgingSlotId: number; organizerId: number; teamId: number }[] = [];

  for (const slot of slots) {
    for (const org of organizers) {
      // Skip if judge already has a team in this slot
      const judgeAlreadyAssigned = existingAssignments.some(
        (a) => a.judgingSlotId === slot.id && a.organizerId === org.id
      ) || toCreate.some(
        (a) => a.judgingSlotId === slot.id && a.organizerId === org.id
      );
      if (judgeAlreadyAssigned) continue;

      // Find eligible team: not in this slot, not already with this judge, fewest assignments
      const eligible = teams.filter(
        (team) =>
          !slotTeams.get(slot.id)?.has(team.id) &&
          !judgeTeams.get(org.id)?.has(team.id)
      );

      if (eligible.length === 0) continue;

      const best = eligible.reduce((a, b) =>
        (teamAssignmentCount.get(a.id) ?? 0) <=
        (teamAssignmentCount.get(b.id) ?? 0)
          ? a
          : b
      );

      toCreate.push({ judgingSlotId: slot.id, organizerId: org.id, teamId: best.id });

      // Update tracking for subsequent iterations
      slotTeams.get(slot.id)?.add(best.id);
      judgeTeams.get(org.id)?.add(best.id);
      teamAssignmentCount.set(best.id, (teamAssignmentCount.get(best.id) ?? 0) + 1);
    }
  }

  for (const data of toCreate) {
    await prisma.teamJudging.create({ data });
  }

  revalidatePath(`/dashboard/${hackathonId}/judging/overview`, "page");
  revalidatePath(`/dashboard/${hackathonId}/judging/manage`, "page");
};

export default autoAssignJudging;
