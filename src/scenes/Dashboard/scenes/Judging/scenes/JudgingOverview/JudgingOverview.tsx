import React from "react";
import Link from "next/link";
import { Stack } from "@/components/ui/stack";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JudgingOverviewData } from "@/server/getters/dashboard/judging/getJudgingOverview";
import { headers } from "next/headers";
import AutoAssignButton from "./AutoAssignButton";
import AutoAssignSponsorButton from "./AutoAssignSponsorButton";
import ReassignJudgeDialog from "./ReassignJudgeDialog";
import DeleteTeamJudgingButton from "./DeleteTeamJudgingButton";
import ExternalJudgeManager from "./ExternalJudgeManager";

type JudgingOverviewProps = {
  hackathonId: number;
  data: JudgingOverviewData;
};

const formatTime = (date: Date) =>
  new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

type TeamJudgingRow = {
  teamId: number;
  teamName: string;
  tableCode?: string;
  judgeAssignments: {
    label: string;
    slotStart: Date;
    slotEnd: Date;
    hasVerdict: boolean;
    teamJudgingId?: number;
    type: "organizer" | "sponsor";
  }[];
};

const JudgingOverview = ({ hackathonId, data }: JudgingOverviewProps) => {
  const { slots, judges, sponsors, externalJudges, challengeStats, teamStats } =
    data;
  const headersList = headers();
  const host = headersList.get("host") ?? "";
  const proto = headersList.get("x-forwarded-proto") ?? "https";
  const baseUrl = `${proto}://${host}`;

  const totalAssignments = judges.flatMap((j) =>
    j.assignments.filter((a) => a.team)
  ).length;
  const totalVerdicts = judges.flatMap((j) =>
    j.assignments.filter((a) => a.hasVerdict)
  ).length;

  const totalSponsorAssignments = sponsors.flatMap((s) => s.assignments).length;
  const totalSponsorVerdicts = sponsors
    .flatMap((s) => s.assignments)
    .filter((a) => a.hasVerdict).length;

  // Pivot judge×slot grid into team-centric rows
  const slotById = new Map(slots.map((s) => [s.id, s]));
  const teamRowsMap = new Map<number, TeamJudgingRow>();

  for (const judge of judges) {
    for (const assignment of judge.assignments) {
      if (!assignment.team) continue;
      const slot = slotById.get(assignment.slotId);
      if (!slot) continue;
      if (!teamRowsMap.has(assignment.team.id)) {
        teamRowsMap.set(assignment.team.id, {
          teamId: assignment.team.id,
          teamName: assignment.team.name,
          tableCode: assignment.team.tableCode,
          judgeAssignments: [],
        });
      }
      teamRowsMap.get(assignment.team.id)?.judgeAssignments.push({
        label: judge.name,
        slotStart: slot.startTime,
        slotEnd: slot.endTime,
        hasVerdict: assignment.hasVerdict,
        teamJudgingId: assignment.teamJudgingId,
        type: "organizer",
      });
    }
  }

  for (const sponsor of sponsors) {
    for (const assignment of sponsor.assignments) {
      if (!assignment.team) continue;
      const slot = slotById.get(assignment.slotId);
      if (!slot) continue;
      if (!teamRowsMap.has(assignment.team.id)) {
        teamRowsMap.set(assignment.team.id, {
          teamId: assignment.team.id,
          teamName: assignment.team.name,
          tableCode: assignment.team.tableCode,
          judgeAssignments: [],
        });
      }
      teamRowsMap.get(assignment.team.id)?.judgeAssignments.push({
        label: `${sponsor.name} (sponsor)`,
        slotStart: slot.startTime,
        slotEnd: slot.endTime,
        hasVerdict: assignment.hasVerdict,
        type: "sponsor",
      });
    }
  }

  const teamRows = Array.from(teamRowsMap.values()).sort((a, b) =>
    a.teamName.localeCompare(b.teamName)
  );

  return (
    <Stack direction="column" className="md:w-[90vw] mx-auto mb-20 gap-6">
      <Link
        href={`/dashboard/${hackathonId}/judging`}
        className="text-hkOrange"
      >
        <Stack direction="row" alignItems="center" spacing="small">
          <ChevronLeftIcon className="h-5 w-5" />
          Back to judging
        </Stack>
      </Link>

      {/* Progress summary */}
      <Card>
        <CardHeader>
          <CardTitle>Judging progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row gap-8 text-sm mb-4">
            <div>
              <span className="font-semibold text-2xl">{totalVerdicts}</span>
              <span className="text-muted-foreground ml-1">
                / {totalAssignments} organizer verdicts
              </span>
            </div>
            <div>
              <span className="font-semibold text-2xl">
                {totalSponsorVerdicts}
              </span>
              <span className="text-muted-foreground ml-1">
                / {totalSponsorAssignments} sponsor verdicts
              </span>
            </div>
            <div>
              <span className="font-semibold text-2xl">{judges.length}</span>
              <span className="text-muted-foreground ml-1">judges</span>
            </div>
            <div>
              <span className="font-semibold text-2xl">{slots.length}</span>
              <span className="text-muted-foreground ml-1">slots</span>
            </div>
            <div>
              <span className="font-semibold text-2xl">{teamStats.length}</span>
              <span className="text-muted-foreground ml-1">
                teams with tables
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div>
              <AutoAssignButton hackathonId={hackathonId} />
              <p className="text-xs text-muted-foreground mt-1">
                Fills empty judge slots evenly across teams. Existing
                assignments are not changed.
              </p>
            </div>
            <div>
              <AutoAssignSponsorButton hackathonId={hackathonId} />
              <p className="text-xs text-muted-foreground mt-1">
                Assigns sponsor challenge teams to sponsors for each slot.
                Existing assignments are not changed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team coverage */}
      <Card>
        <CardHeader>
          <CardTitle>Team judging coverage</CardTitle>
        </CardHeader>
        <CardContent>
          {teamStats.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No teams with tables found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="text-sm border-collapse w-full">
                <thead>
                  <tr>
                    <th className="text-left p-2 border border-border bg-muted font-medium">
                      Team
                    </th>
                    <th className="text-left p-2 border border-border bg-muted font-medium">
                      Table
                    </th>
                    <th className="text-center p-2 border border-border bg-muted font-medium">
                      Assigned
                    </th>
                    <th className="text-center p-2 border border-border bg-muted font-medium">
                      Verdicts
                    </th>
                    <th className="text-center p-2 border border-border bg-muted font-medium">
                      Sponsor Assigned
                    </th>
                    <th className="text-center p-2 border border-border bg-muted font-medium">
                      Sponsor Verdicts
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {teamStats.map((team) => {
                    const allDone =
                      team.assignmentCount > 0 &&
                      team.verdictCount === team.assignmentCount;
                    const noneAssigned = team.assignmentCount === 0;
                    const rowClass = noneAssigned
                      ? "bg-red-50"
                      : allDone
                      ? "bg-green-50"
                      : "bg-yellow-50";
                    return (
                      <tr key={team.id} className={rowClass}>
                        <td className="p-2 border border-border font-medium">
                          {team.name}
                        </td>
                        <td className="p-2 border border-border text-muted-foreground">
                          {team.tableCode ?? "—"}
                        </td>
                        <td className="p-2 border border-border text-center">
                          {team.assignmentCount}
                        </td>
                        <td className="p-2 border border-border text-center">
                          {team.verdictCount} / {team.assignmentCount}
                        </td>
                        <td className="p-2 border border-border text-center">
                          {team.sponsorAssignmentCount}
                        </td>
                        <td className="p-2 border border-border text-center">
                          {team.sponsorVerdictCount} /{" "}
                          {team.sponsorAssignmentCount}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded bg-green-100 border border-green-300" />
              All verdicts in
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded bg-yellow-100 border border-yellow-300" />
              Partially judged
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded bg-red-100 border border-red-300" />
              Not assigned yet
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Judging by team */}
      <Card>
        <CardHeader>
          <CardTitle>Judging by team</CardTitle>
        </CardHeader>
        <CardContent>
          {teamRows.length === 0 ? (
            <p className="text-muted-foreground text-sm">No assignments yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="text-sm border-collapse w-full">
                <thead>
                  <tr>
                    <th className="text-left p-2 border border-border bg-muted font-medium min-w-[140px]">
                      Team
                    </th>
                    <th className="text-left p-2 border border-border bg-muted font-medium">
                      Table
                    </th>
                    <th className="text-left p-2 border border-border bg-muted font-medium">
                      Judges & slots
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {teamRows.map((row) => (
                    <tr key={row.teamId}>
                      <td className="p-2 border border-border font-medium align-top">
                        {row.teamName}
                      </td>
                      <td className="p-2 border border-border text-muted-foreground align-top">
                        {row.tableCode ?? "—"}
                      </td>
                      <td className="p-2 border border-border">
                        <div className="flex flex-col gap-1">
                          {row.judgeAssignments
                            .sort(
                              (a, b) =>
                                new Date(a.slotStart).getTime() -
                                new Date(b.slotStart).getTime()
                            )
                            .map((ja, i) => (
                              <div
                                key={i}
                                className={`flex items-center gap-2 text-xs px-2 py-1 rounded ${
                                  ja.hasVerdict
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                <span className="font-medium">
                                  {formatTime(ja.slotStart)}–
                                  {formatTime(ja.slotEnd)}
                                </span>
                                <span>{ja.label}</span>
                                <span>{ja.hasVerdict ? "✓" : "pending"}</span>
                                {ja.type === "organizer" &&
                                  ja.teamJudgingId && (
                                    <ReassignJudgeDialog
                                      teamJudgingId={ja.teamJudgingId}
                                      currentJudgeId={
                                        judges.find((j) => j.name === ja.label)
                                          ?.id ?? 0
                                      }
                                      judges={judges.map((j) => ({
                                        id: j.id,
                                        name: j.name,
                                      }))}
                                    />
                                  )}
                              </div>
                            ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Judge × Slot grid */}
      <Card>
        <CardHeader>
          <CardTitle>Judge assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="text-sm border-collapse w-full">
              <thead>
                <tr>
                  <th className="text-left p-2 border border-border bg-muted font-medium min-w-[140px]">
                    Judge
                  </th>
                  {slots.map((slot) => (
                    <th
                      key={slot.id}
                      className="text-center p-2 border border-border bg-muted font-medium min-w-[120px]"
                    >
                      {formatTime(slot.startTime)}–{formatTime(slot.endTime)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {judges.map((judge) => (
                  <tr key={judge.id}>
                    <td className="p-2 border border-border font-medium">
                      {judge.name}
                    </td>
                    {judge.assignments.map((assignment) => {
                      let cellClass =
                        "p-2 border border-border text-center text-xs";
                      let label = (
                        <span className="text-muted-foreground">—</span>
                      );

                      if (assignment.team && assignment.teamJudgingId) {
                        if (assignment.hasVerdict) {
                          cellClass += " bg-green-100 text-green-800";
                        } else {
                          cellClass += " bg-yellow-100 text-yellow-800";
                        }
                        label = (
                          <div>
                            <div className="font-medium">
                              {assignment.team.name}
                            </div>
                            {assignment.team.tableCode && (
                              <div className="opacity-70">
                                {assignment.team.tableCode}
                              </div>
                            )}
                            <div className="mt-0.5">
                              {assignment.hasVerdict ? "✓ done" : "pending"}
                            </div>
                            <div className="flex items-center justify-center gap-1 mt-0.5">
                              <ReassignJudgeDialog
                                teamJudgingId={assignment.teamJudgingId}
                                currentJudgeId={judge.id}
                                judges={judges.map((j) => ({
                                  id: j.id,
                                  name: j.name,
                                }))}
                              />
                              <DeleteTeamJudgingButton
                                teamJudgingId={assignment.teamJudgingId}
                              />
                            </div>
                          </div>
                        );
                      }

                      return (
                        <td key={assignment.slotId} className={cellClass}>
                          {label}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded bg-green-100 border border-green-300" />
              Verdict submitted
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded bg-yellow-100 border border-yellow-300" />
              Assigned, pending
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 rounded bg-background border border-border" />
              Unassigned
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Sponsor × Slot grid */}
      {sponsors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sponsor assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="text-sm border-collapse w-full">
                <thead>
                  <tr>
                    <th className="text-left p-2 border border-border bg-muted font-medium min-w-[140px]">
                      Sponsor
                    </th>
                    {slots.map((slot) => (
                      <th
                        key={slot.id}
                        className="text-center p-2 border border-border bg-muted font-medium min-w-[120px]"
                      >
                        {formatTime(slot.startTime)}–{formatTime(slot.endTime)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sponsors.map((sponsor) => (
                    <tr key={sponsor.id}>
                      <td className="p-2 border border-border font-medium">
                        {sponsor.name}
                      </td>
                      {slots.map((slot) => {
                        const assignment = sponsor.assignments.find(
                          (a) => a.slotId === slot.id
                        );
                        let cellClass =
                          "p-2 border border-border text-center text-xs";
                        let label = (
                          <span className="text-muted-foreground">—</span>
                        );

                        if (assignment?.team) {
                          if (assignment.hasVerdict) {
                            cellClass += " bg-green-100 text-green-800";
                          } else {
                            cellClass += " bg-yellow-100 text-yellow-800";
                          }
                          label = (
                            <div>
                              <div className="font-medium">
                                {assignment.team.name}
                              </div>
                              {assignment.team.tableCode && (
                                <div className="opacity-70">
                                  {assignment.team.tableCode}
                                </div>
                              )}
                              <div className="mt-0.5">
                                {assignment.hasVerdict ? "✓ done" : "pending"}
                              </div>
                            </div>
                          );
                        }

                        return (
                          <td key={slot.id} className={cellClass}>
                            {label}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded bg-green-100 border border-green-300" />
                Verdict submitted
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded bg-yellow-100 border border-yellow-300" />
                Assigned, pending
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded bg-background border border-border" />
                Unassigned
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* External judges */}
      <Card>
        <CardHeader>
          <CardTitle>External judges</CardTitle>
        </CardHeader>
        <CardContent>
          <ExternalJudgeManager
            hackathonId={hackathonId}
            externalJudges={externalJudges}
            slots={slots}
            baseUrl={baseUrl}
          />
        </CardContent>
      </Card>

      {/* Challenge breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Teams per challenge</CardTitle>
        </CardHeader>
        <CardContent>
          {challengeStats.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No challenges found.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {challengeStats.map((challenge) => (
                <div key={challenge.id}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{challenge.title}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {challenge.teamCount} team
                      {challenge.teamCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  {challenge.teams.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {challenge.teams.map((team) => (
                        <span
                          key={team.name}
                          className="text-xs bg-muted px-2 py-1 rounded"
                        >
                          {team.name}
                          {team.tableCode && (
                            <span className="opacity-60 ml-1">
                              ({team.tableCode})
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      No teams assigned
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
};

export default JudgingOverview;
