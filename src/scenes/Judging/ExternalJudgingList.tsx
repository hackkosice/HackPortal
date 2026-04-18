"use client";

import React, { useState } from "react";
import { ExternalJudgingTeamJudging } from "@/server/getters/judging/getExternalJudgingByToken";
import dateToTimeString from "@/services/helpers/dateToTimeString";
import VotePicker from "@/scenes/Dashboard/scenes/ApplicationReview/components/VotePicker";
import { VoteParametersData } from "@/server/getters/dashboard/voteParameterManager/voteParameters";
import callServerAction from "@/services/helpers/server/callServerAction";
import addVerdictToExternalTeamJudging from "@/server/actions/judging/addVerdictToExternalTeamJudging";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, Clock, ChevronDown, ChevronUp } from "lucide-react";

const voteParameters: VoteParametersData = [
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

type ExternalJudgingListProps = {
  teamJudgings: ExternalJudgingTeamJudging[];
  accessToken: string;
};

const ExternalJudgingList = ({
  teamJudgings,
  accessToken,
}: ExternalJudgingListProps) => {
  const { toast } = useToast();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [verdicts, setVerdicts] = useState<Record<number, string>>(
    Object.fromEntries(
      teamJudgings
        .filter((tj) => tj.judgingVerdict)
        .map((tj) => [tj.id, tj.judgingVerdict as string])
    )
  );

  if (teamJudgings.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">No judging assignments.</p>
    );
  }

  const doneCount = Object.keys(verdicts).length;

  const onVerdictSubmit = async (
    tjId: number,
    values: { voteParameterId: number; value: number }[]
  ) => {
    const verdict = values
      .map(({ voteParameterId, value }) => {
        const vp = voteParameters.find((p) => p.id === voteParameterId);
        return `${vp?.name ?? voteParameterId}-${value}`;
      })
      .join(";");

    const res = await callServerAction(addVerdictToExternalTeamJudging, {
      externalTeamJudgingId: tjId,
      accessToken,
      judgingVerdict: verdict,
    });

    if (res.success) {
      setVerdicts((prev) => ({ ...prev, [tjId]: verdict }));
      setExpandedId(null);
      toast({ title: "Score saved" });
    }
  };

  return (
    <div className="mt-2">
      <p className="text-sm text-muted-foreground mb-3">
        {doneCount} / {teamJudgings.length} scored
      </p>
      <div className="flex flex-col gap-2">
        {teamJudgings.map((tj) => {
          const verdict = verdicts[tj.id];
          const isExpanded = expandedId === tj.id;
          const isScored = !!verdict;

          return (
            <div
              key={tj.id}
              className={`rounded-lg border ${
                isScored
                  ? "border-green-300 bg-green-50"
                  : "border-border bg-card"
              }`}
            >
              <button
                className="w-full text-left p-4 flex items-start justify-between gap-3"
                onClick={() => setExpandedId(isExpanded ? null : tj.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">
                      {dateToTimeString(tj.startTime)}–
                      {dateToTimeString(tj.endTime)}
                    </span>
                    {tj.team.tableCode && (
                      <span className="text-xs font-semibold text-hkOrange">
                        Table {tj.team.tableCode}
                      </span>
                    )}
                  </div>
                  <p className="font-semibold mt-1">{tj.team.name}</p>
                  {tj.team.challenges.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {tj.team.challenges.join(", ")}
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
                    voteParameters={voteParameters}
                    onVoteSubmit={(values) => onVerdictSubmit(tj.id, values)}
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

export default ExternalJudgingList;
