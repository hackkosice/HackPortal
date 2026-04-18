"use client";

import React, { useState } from "react";
import { MyJudging } from "@/server/getters/dashboard/judging/getMyJudgings";
import dateToTimeString from "@/services/helpers/dateToTimeString";
import VotePicker from "@/scenes/Dashboard/scenes/ApplicationReview/components/VotePicker";
import { VoteParametersData } from "@/server/getters/dashboard/voteParameterManager/voteParameters";
import callServerAction from "@/services/helpers/server/callServerAction";
import addVerdictToTeamJudging from "@/server/actions/dashboard/judging/addVerdictToTeamJudging";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, Clock, ChevronDown, ChevronUp } from "lucide-react";

const voteParametersJudging: VoteParametersData = [
  {
    id: 1,
    name: "Innovation",
    minValue: 1,
    maxValue: 5,
    weight: 1,
    description: "How innovative is the project?",
  },
  {
    id: 2,
    name: "Functionality",
    minValue: 1,
    maxValue: 5,
    weight: 1,
    description: "How functional is the project?",
  },
  {
    id: 3,
    name: "Impact",
    minValue: 1,
    maxValue: 5,
    weight: 1,
    description: "How impactful is the project?",
  },
  {
    id: 4,
    name: "Presentation",
    minValue: 1,
    maxValue: 5,
    weight: 1,
    description: "How well is the project presented?",
  },
];

type JudgingListProps = {
  judgings: MyJudging[];
};

const JudgingList = ({ judgings }: JudgingListProps) => {
  const { toast } = useToast();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [verdicts, setVerdicts] = useState<Record<number, string>>(
    Object.fromEntries(
      judgings
        .filter((j) => j.judgingVerdict)
        .map((j) => [j.id, j.judgingVerdict as string])
    )
  );

  if (judgings.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">No judging assignments.</p>
    );
  }

  const doneCount = Object.keys(verdicts).length;

  const onVerdictSubmit = async (
    judgingId: number,
    values: { voteParameterId: number; value: number }[]
  ) => {
    const verdict = values
      .map(({ voteParameterId, value }) => {
        const vp = voteParametersJudging.find((p) => p.id === voteParameterId);
        return `${vp?.name ?? voteParameterId}-${value}`;
      })
      .join(";");

    const res = await callServerAction(addVerdictToTeamJudging, {
      teamJudgingId: judgingId,
      judgingVerdict: verdict,
    });

    if (res.success) {
      setVerdicts((prev) => ({ ...prev, [judgingId]: verdict }));
      setExpandedId(null);
      toast({ title: "Score saved" });
    }
  };

  return (
    <div className="mt-2">
      <p className="text-sm text-muted-foreground mb-3">
        {doneCount} / {judgings.length} scored
      </p>
      <div className="flex flex-col gap-2">
        {judgings.map((judging) => {
          const verdict = verdicts[judging.id];
          const isExpanded = expandedId === judging.id;
          const isScored = !!verdict;

          return (
            <div
              key={judging.id}
              className={`rounded-lg border ${
                isScored
                  ? "border-green-300 bg-green-50"
                  : "border-border bg-card"
              }`}
            >
              <button
                className="w-full text-left p-4 flex items-start justify-between gap-3"
                onClick={() => setExpandedId(isExpanded ? null : judging.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                      {dateToTimeString(judging.startTime)}–
                      {dateToTimeString(judging.endTime)}
                    </span>
                    {judging.team.tableCode && (
                      <span className="text-xs font-semibold text-hkOrange">
                        Table {judging.team.tableCode}
                      </span>
                    )}
                  </div>
                  <p className="font-semibold mt-1">{judging.team.name}</p>
                  {judging.team.challenges.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {judging.team.challenges.join(", ")}
                    </p>
                  )}
                  {isScored && !isExpanded && (
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {verdict.split(";").map((v) => {
                        const [name, score] = v.split("-");
                        return (
                          <span
                            key={name}
                            className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded"
                          >
                            {name}: {score}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0 mt-1">
                  {isScored ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  )}
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-border pt-3">
                  <VotePicker
                    voteParameters={voteParametersJudging}
                    onVoteSubmit={(values) =>
                      onVerdictSubmit(judging.id, values)
                    }
                    buttonLabel={isScored ? "Update score" : "Save score"}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JudgingList;
