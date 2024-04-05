"use client";

import React from "react";
import { MyJudging } from "@/server/getters/dashboard/judging/getMyJudgings";
import dateToTimeString from "@/services/helpers/dateToTimeString";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Clock from "@/components/common/Clock";
import VotePicker from "@/scenes/Dashboard/scenes/ApplicationReview/components/VotePicker";
import { VoteParametersData } from "@/server/getters/dashboard/voteParameterManager/voteParameters";
import callServerAction from "@/services/helpers/server/callServerAction";
import addVerdictToTeamJudging from "@/server/actions/dashboard/judging/addVerdictToTeamJudging";
import { useToast } from "@/components/ui/use-toast";

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

type JudgingSwitcherProps = {
  judgings: MyJudging[];
  initialJudgingIndex: number;
};
const JudgingSwitcher = ({
  judgings,
  initialJudgingIndex,
}: JudgingSwitcherProps) => {
  const { toast } = useToast();
  const [changeJudging, setChangeJudging] = React.useState(false);
  const [judgingIndex, setJudgingIndex] = React.useState(initialJudgingIndex);
  if (judgingIndex < 0 || judgingIndex >= judgings.length) {
    return <div>No judging left.</div>;
  }
  const judging = judgings[judgingIndex];
  const onVerdictSubmit = async (
    values: { voteParameterId: number; value: number }[]
  ) => {
    const verdict = values
      .map(({ voteParameterId, value }) => {
        const voteParameter = voteParametersJudging.find(
          (vp) => vp.id === voteParameterId
        );
        if (!voteParameter) {
          throw new Error("Vote parameter not found");
        }

        return `${voteParameter.name}-${value}`;
      })
      .join(";");

    const res = await callServerAction(addVerdictToTeamJudging, {
      teamJudgingId: judging.id,
      judgingVerdict: verdict,
    });

    if (res.success) {
      if (!changeJudging) {
        setJudgingIndex(judgingIndex + 1);
        toast({
          title: "Verdict saved",
          description: "The verdict has been saved.",
        });
      } else {
        toast({
          title: "Verdict changed",
          description: "The verdict has been changed.",
        });
      }
      setChangeJudging(false);
    }
  };
  return (
    <div className="mt-5">
      <Clock className="font-bold" />
      <Heading size="small">{judgingIndex + 1}. Judging</Heading>
      <div>
        <strong>Time:</strong> {dateToTimeString(judging.startTime)} -{" "}
        {dateToTimeString(judging.endTime)}
      </div>
      <div>
        <strong>Team:</strong> {judging.team.name}
      </div>
      {judging.team.tableCode && (
        <div>
          <strong>Table:</strong> {judging.team.tableCode}
        </div>
      )}
      <div>
        <strong>Challenges:</strong> {judging.team.challenges.join(", ")}
      </div>
      {judging.judgingVerdict && !changeJudging ? (
        <div>
          <div>
            {judging.judgingVerdict.split(";").map((value) => (
              <div key={value.split("-")[0]}>
                {value.split("-")[0]}: {value.split("-")[1]}
              </div>
            ))}
          </div>
          <Button
            size="small"
            variant="outline"
            onClick={() => {
              setChangeJudging(true);
            }}
          >
            Change verdict
          </Button>
        </div>
      ) : (
        <VotePicker
          voteParameters={voteParametersJudging}
          onVoteSubmit={onVerdictSubmit}
          buttonLabel="Save verdict"
        />
      )}
      <div className="flex flex-row items-center">
        {judgingIndex > 0 && (
          <Button
            variant="ghost"
            onClick={() => setJudgingIndex(judgingIndex - 1)}
            className="flex-grow-0"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous judging
          </Button>
        )}
        <span className="flex-grow"></span>
        {judgingIndex < judgings.length - 1 && (
          <Button
            variant="ghost"
            onClick={() => setJudgingIndex(judgingIndex + 1)}
            className="flex-grow-0"
          >
            Next judging
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default JudgingSwitcher;
