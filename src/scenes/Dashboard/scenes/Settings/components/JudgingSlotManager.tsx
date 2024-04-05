import React from "react";
import { JudgingSlots } from "@/server/getters/dashboard/settings/getJudgingSlots";
import { Heading } from "@/components/ui/heading";
import NewJudgingSlotDialog from "@/scenes/Dashboard/scenes/Settings/components/NewJudgingSlotDialog";
import dateToTimeString from "@/services/helpers/dateToTimeString";
import DeleteJudgingSlotButton from "@/scenes/Dashboard/scenes/Settings/components/DeleteJudgingSlotButton";

type JudgingSlotManagerProps = {
  hackathonId: number;
  judgingSlots: JudgingSlots;
};
const JudgingSlotManager = ({
  hackathonId,
  judgingSlots,
}: JudgingSlotManagerProps) => {
  return (
    <div>
      <Heading size="small">Judging slots</Heading>
      <div>
        {judgingSlots.judgingSlots.map((judgingSlot) => {
          const startTime = dateToTimeString(judgingSlot.startTime);
          const endTime = dateToTimeString(judgingSlot.endTime);
          return (
            <div
              key={judgingSlot.id}
              className="flex flex-row items-center gap-1"
            >
              <span>{startTime}</span>
              {" - "}
              <span>{endTime}</span>
              <NewJudgingSlotDialog
                mode="edit"
                judgingSlotId={judgingSlot.id}
                initialData={{
                  startTime,
                  endTime,
                }}
              />
              <DeleteJudgingSlotButton
                judgingSlotId={judgingSlot.id}
                startTime={startTime}
                endTime={endTime}
              />
            </div>
          );
        })}
      </div>
      <NewJudgingSlotDialog mode="create" hackathonId={hackathonId} />
    </div>
  );
};

export default JudgingSlotManager;
