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
import callServerAction from "@/services/helpers/server/callServerAction";
import reassignJudge from "@/server/actions/dashboard/judging/reassignJudge";

type Judge = { id: number; name: string };

type ReassignJudgeDialogProps = {
  teamJudgingId: number;
  currentJudgeId: number;
  judges: Judge[];
};

const ReassignJudgeDialog = ({
  teamJudgingId,
  currentJudgeId,
  judges,
}: ReassignJudgeDialogProps) => {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const otherJudges = judges.filter((j) => j.id !== currentJudgeId);

  const handleSave = async () => {
    if (!selectedId) return;
    setLoading(true);
    setError(null);
    const res = await callServerAction(reassignJudge, {
      teamJudgingId,
      newOrganizerId: Number(selectedId),
    });
    setLoading(false);
    if (!res.success) {
      setError(res.message);
      return;
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-xs underline opacity-60 hover:opacity-100 mt-1">
          Reassign
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reassign to another judge</DialogTitle>
        </DialogHeader>
        {error && (
          <Text size="small" className="text-red-500">
            {error}
          </Text>
        )}
        <Select onValueChange={setSelectedId} value={selectedId}>
          <SelectTrigger>
            <SelectValue placeholder="Select a judge" />
          </SelectTrigger>
          <SelectContent>
            {otherJudges.map((judge) => (
              <SelectItem key={judge.id} value={String(judge.id)}>
                {judge.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <DialogFooter>
          <Button onClick={handleSave} disabled={!selectedId || loading}>
            {loading ? "Saving..." : "Reassign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReassignJudgeDialog;
