"use client";

import React, { useMemo, useState } from "react";
import { TeamData, TeamMemberData } from "@/server/getters/team";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/ui/stack";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import NewTeamDialog from "@/scenes/Application/components/TeamManager/components/NewTeamDialog";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import kickTeamMember from "@/server/actions/team/kickTeamMember";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import leaveTeam from "@/server/actions/team/leaveTeam";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip as TooltipBase,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type TeamInfoProps = {
  team: TeamData;
  isOwnerSession: boolean;
};

const ActionsCell = ({ member }: { member: TeamMemberData }) => {
  const [isKickConfirmationDialogOpened, setIsKickConfirmationDialogOpened] =
    useState(false);

  if (member.isCurrentUser) {
    return null;
  }

  return (
    <>
      <ConfirmationDialog
        question={`Are you sure you want to kick ${member.email}?`}
        onAnswer={async (answer) => {
          if (answer) {
            await kickTeamMember({ memberId: member.id });
          }
          setIsKickConfirmationDialogOpened(false);
        }}
        isManuallyOpened={isKickConfirmationDialogOpened}
      />
      <Button
        onClick={() => {
          setIsKickConfirmationDialogOpened(true);
        }}
        variant="ghost"
        size="small"
      >
        Kick
      </Button>
    </>
  );
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
        return <ActionsCell member={row.original} />;
      },
    });
  }

  return columns;
};
const TeamInfo = ({
  team: { name, code, members },
  isOwnerSession,
}: TeamInfoProps) => {
  const teamMembersColumns = useMemo(
    () => getTeamMembersColumns(isOwnerSession),
    [isOwnerSession]
  );
  const onLeaveTeamClick = async () => {
    await leaveTeam();
  };
  const { toast } = useToast();
  return (
    <Stack direction="column" spacing="medium">
      <div>
        <Stack direction="row" alignItems="center">
          <Text>
            Team name: <span className="font-bold">{name}</span>
          </Text>
          {isOwnerSession && (
            <NewTeamDialog mode="edit" initialData={{ name }} />
          )}
        </Stack>
        <Stack direction="row" alignItems="center" spacing="none">
          <Text>Team&apos;s code: {code}</Text>
          <TooltipProvider delayDuration={400}>
            <TooltipBase>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => {
                    toast({
                      title: "Team code copied to clipboard",
                    });
                    navigator.clipboard.writeText(code);
                  }}
                  variant="ghost"
                  size="icon"
                  aria-label="Copy team code"
                >
                  <DocumentDuplicateIcon className="w-4 h-4 mr-1 inline" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy team code to clipboard</TooltipContent>
            </TooltipBase>
          </TooltipProvider>
        </Stack>
        <Text>Team members ({members.length}/4):</Text>
        <DataTable columns={teamMembersColumns} data={members} />
      </div>
      {!isOwnerSession && (
        <ConfirmationDialog
          question="Are you sure you want to leave this team?"
          onAnswer={async (answer) => {
            if (answer) {
              await onLeaveTeamClick();
            }
          }}
        >
          <Button variant="outline" className="text-red-500">
            <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-1" />
            Leave team
          </Button>
        </ConfirmationDialog>
      )}
    </Stack>
  );
};

export default TeamInfo;
