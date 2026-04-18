"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { Plus } from "lucide-react";
import callServerAction from "@/services/helpers/server/callServerAction";
import createTeamJudging from "@/server/actions/dashboard/judging/createTeamJudging";

type Team = { id: number; name: string; tableCode?: string };

type AssignTeamDialogProps = {
  judgeId: number;
  slotId: number;
  teams: Team[];
};

const AssignTeamDialog = ({
  judgeId,
  slotId,
  teams,
}: AssignTeamDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!selectedTeamId) return;
    setLoading(true);
    setError(null);
    const res = await callServerAction(createTeamJudging, {
      organizerId: judgeId,
      teamId: Number(selectedTeamId),
      judgingSlotId: slotId,
    });
    setLoading(false);
    if (!res.success) {
      setError(res.message);
      return;
    }
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) {
          setSelectedTeamId("");
          setError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <button
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          title="Assign team"
        >
          <Plus className="h-3.5 w-3.5" />
          Assign
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign team to slot</DialogTitle>
        </DialogHeader>
        {error && (
          <Text size="small" className="text-red-500">
            {error}
          </Text>
        )}
        <Select onValueChange={setSelectedTeamId} value={selectedTeamId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a team" />
          </SelectTrigger>
          <SelectContent>
            {teams.map((team) => (
              <SelectItem key={team.id} value={String(team.id)}>
                {team.name}
                {team.tableCode ? ` (${team.tableCode})` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button onClick={handleSave} disabled={!selectedTeamId || loading}>
            {loading ? "Saving..." : "Assign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignTeamDialog;
