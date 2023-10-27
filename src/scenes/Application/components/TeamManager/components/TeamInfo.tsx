"use client";

import React, { useMemo } from "react";
import { TeamData, TeamMemberData } from "@/server/getters/team";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/ui/stack";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";

type TeamInfoProps = {
  team: TeamData;
  isOwnerSession: boolean;
};

const getTeamMembersColumns = (
  isOwnerSession: boolean
): ColumnDef<TeamMemberData>[] => {
  const columns: ColumnDef<TeamMemberData>[] = [
    {
      header: "Email",
      cell: ({ row }) => {
        return (
          <span>
            {row.original.email} {row.original.isOwner && " (owner)"}
          </span>
        );
      },
    },
  ];
  if (isOwnerSession) {
    columns.push({
      header: "Actions",
      cell: ({ row }) => {
        return (
          <Stack direction="row" spacing="none">
            <Button
              onClick={() => {
                console.log(`KICK member ${row.original.email}`);
              }}
              variant="ghost"
              size="icon"
            >
              Kick
            </Button>
          </Stack>
        );
      },
    });
  }

  return columns;
};
const TeamInfo = ({ team, isOwnerSession }: TeamInfoProps) => {
  const teamMembersColumns = useMemo(
    () => getTeamMembersColumns(isOwnerSession),
    [isOwnerSession]
  );
  return (
    <>
      <Text>
        Team name: <span className="font-bold">{team.name}</span>
      </Text>
      <Stack direction="row" alignItems="center" spacing="none">
        <Text>Team&apos;s code: {team.code}</Text>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(team.code);
          }}
          variant="ghost"
          size="icon"
        >
          <DocumentDuplicateIcon className="w-4 h-4 mr-1 inline" />
        </Button>
      </Stack>
      <Text>Team members:</Text>
      <DataTable columns={teamMembersColumns} data={team.members} />
    </>
  );
};

export default TeamInfo;
