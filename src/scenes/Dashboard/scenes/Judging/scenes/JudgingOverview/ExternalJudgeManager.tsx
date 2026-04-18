"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Copy, Check, UserPlus } from "lucide-react";
import callServerAction from "@/services/helpers/server/callServerAction";
import createExternalJudge from "@/server/actions/dashboard/judging/createExternalJudge";
import deleteExternalJudge from "@/server/actions/dashboard/judging/deleteExternalJudge";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import {
  ExternalJudgeOverview,
  JudgingOverviewSlot,
} from "@/server/getters/dashboard/judging/getJudgingOverview";
import dateToTimeString from "@/services/helpers/dateToTimeString";

type ExternalJudgeManagerProps = {
  hackathonId: number;
  externalJudges: ExternalJudgeOverview[];
  slots: JudgingOverviewSlot[];
  baseUrl: string;
};

const ExternalJudgeManager = ({
  hackathonId,
  externalJudges,
  slots,
  baseUrl,
}: ExternalJudgeManagerProps) => {
  const slotById = new Map(slots.map((s) => [s.id, s]));
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const onAdd = async () => {
    if (!name.trim()) return;
    setError(null);
    const res = await callServerAction(createExternalJudge, {
      hackathonId,
      name: name.trim(),
    });
    if (res.success) {
      setName("");
    } else {
      setError(res.message);
    }
  };

  const onDelete = async (id: number) => {
    await callServerAction(deleteExternalJudge, { externalJudgeId: id });
  };

  const copyLink = (accessToken: string, id: number) => {
    navigator.clipboard.writeText(`${baseUrl}/judging/${accessToken}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Input
          placeholder="External judge name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onAdd()}
          className="max-w-xs"
        />
        <Button onClick={onAdd} size="small">
          <UserPlus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}

      {externalJudges.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No external judges yet. Add one above.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {externalJudges.map((judge) => (
            <div
              key={judge.id}
              className="rounded-lg border border-border p-3 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{judge.name}</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => copyLink(judge.accessToken, judge.id)}
                    title="Copy judging link"
                  >
                    {copiedId === judge.id ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <ConfirmationDialog
                    question={`Remove ${judge.name} and all their assignments?`}
                    onAnswer={async (answer) => {
                      if (answer) await onDelete(judge.id);
                    }}
                  >
                    <Button
                      variant="ghost"
                      size="small"
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </ConfirmationDialog>
                </div>
              </div>
              <p className="text-xs text-muted-foreground break-all">
                Link: {baseUrl}/judging/{judge.accessToken}
              </p>
              {judge.assignments.length > 0 && (
                <div className="flex flex-col gap-1 mt-1">
                  {judge.assignments.map((a) => {
                    const slot = slotById.get(a.slotId);
                    return (
                      <div
                        key={a.externalTeamJudgingId}
                        className={`text-xs px-2 py-1 rounded flex items-center gap-2 ${
                          a.hasVerdict
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        <span className="font-mono">
                          {slot ? dateToTimeString(slot.startTime) : "—"}
                        </span>
                        <span>{a.team?.name ?? "—"}</span>
                        {a.team?.tableCode && (
                          <span className="opacity-70">
                            ({a.team.tableCode})
                          </span>
                        )}
                        <span className="ml-auto">
                          {a.hasVerdict ? "✓" : "pending"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExternalJudgeManager;
