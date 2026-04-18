"use server";

import { prisma } from "@/services/prisma";
import requireAdminSession from "@/server/services/helpers/auth/requireAdminSession";
import { revalidatePath } from "next/cache";
import { ExpectedServerActionError } from "@/services/types/serverErrors";

const autoAssignSponsorJudging = async (hackathonId: number) => {
  await requireAdminSession();

  const [slots, sponsors, existingAssignments] = await Promise.all([
    prisma.judgingSlot.findMany({
      where: { hackathonId },
      orderBy: { startTime: "asc" },
    }),
    prisma.sponsor.findMany({
      where: { hackathonId },
      select: {
        id: true,
        challenge: {
          select: {
            teams: {
              where: {
                members: { some: { hackathonId } },
                table: { hackathonId },
              },
              select: { id: true },
            },
          },
        },
      },
    }),
    prisma.sponsorJudging.findMany({
      where: { judgingSlot: { hackathonId } },
      select: { judgingSlotId: true, sponsorId: true, teamId: true },
    }),
  ]);

  if (slots.length === 0) {
    throw new ExpectedServerActionError(
      "No judging slots found for this hackathon"
    );
  }

  const sponsorsWithTeams = sponsors.filter(
    (s) => s.challenge && s.challenge.teams.length > 0
  );

  if (sponsorsWithTeams.length === 0) {
    throw new ExpectedServerActionError(
      "No sponsors with challenge teams found. Ensure sponsors have challenges and teams are assigned to tables."
    );
  }

  // Track existing assignments for O(1) lookups
  // sponsorSlots: sponsorId → Set<slotId> (sponsors already assigned in a slot)
  const sponsorSlots = new Map<number, Set<number>>();
  // teamAssignmentCount per slot: slotId_teamId → count (for picking least-assigned team)
  const teamAssignmentCount = new Map<number, number>();

  for (const sponsor of sponsorsWithTeams) {
    sponsorSlots.set(sponsor.id, new Set());
  }
  for (const sponsor of sponsorsWithTeams) {
    if (sponsor.challenge) {
      for (const team of sponsor.challenge.teams) {
        teamAssignmentCount.set(team.id, 0);
      }
    }
  }

  for (const a of existingAssignments) {
    sponsorSlots.get(a.sponsorId)?.add(a.judgingSlotId);
    teamAssignmentCount.set(
      a.teamId,
      (teamAssignmentCount.get(a.teamId) ?? 0) + 1
    );
  }

  const toCreate: {
    judgingSlotId: number;
    sponsorId: number;
    teamId: number;
  }[] = [];

  for (const slot of slots) {
    for (const sponsor of sponsorsWithTeams) {
      // Skip if sponsor already assigned in this slot
      if (sponsorSlots.get(sponsor.id)?.has(slot.id)) continue;

      const challengeTeams = sponsor.challenge?.teams ?? [];

      // Find the challenge team with fewest assignments not already assigned to this sponsor in this slot
      const existingAssignmentsForSponsorSlot = existingAssignments.filter(
        (a) => a.sponsorId === sponsor.id && a.judgingSlotId === slot.id
      );
      const alreadyAssignedTeamIds = new Set(
        existingAssignmentsForSponsorSlot.map((a) => a.teamId)
      );

      // Also exclude teams already queued in toCreate for this sponsor+slot
      for (const pending of toCreate) {
        if (
          pending.sponsorId === sponsor.id &&
          pending.judgingSlotId === slot.id
        ) {
          alreadyAssignedTeamIds.add(pending.teamId);
        }
      }

      const eligible = challengeTeams.filter(
        (team) => !alreadyAssignedTeamIds.has(team.id)
      );

      if (eligible.length === 0) continue;

      // Pick team with fewest existing sponsor judging assignments
      const best = eligible.reduce((a, b) =>
        (teamAssignmentCount.get(a.id) ?? 0) <=
        (teamAssignmentCount.get(b.id) ?? 0)
          ? a
          : b
      );

      toCreate.push({
        judgingSlotId: slot.id,
        sponsorId: sponsor.id,
        teamId: best.id,
      });

      sponsorSlots.get(sponsor.id)?.add(slot.id);
      teamAssignmentCount.set(
        best.id,
        (teamAssignmentCount.get(best.id) ?? 0) + 1
      );
    }
  }

  if (toCreate.length === 0) {
    throw new ExpectedServerActionError(
      "All sponsor slots are already assigned"
    );
  }

  await prisma.$transaction(
    toCreate.map((data) => prisma.sponsorJudging.create({ data }))
  );

  revalidatePath(`/dashboard/${hackathonId}/judging/overview`, "page");
  revalidatePath(`/dashboard/${hackathonId}/judging/manage`, "page");
};

export default autoAssignSponsorJudging;
