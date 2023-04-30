import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { trpc } from "@/services/trpc";
import { Button } from "@/components/Button";
import Step from "./components/Step";

const ApplicationFormEditor = () => {
  const { data, isLoading } = trpc.steps.useQuery();
  const utils = trpc.useContext();
  const { mutateAsync: newStep } = trpc.newStep.useMutation({
    onSuccess: () => {
      utils.steps.invalidate();
    },
  });
  const { mutateAsync: editStep } = trpc.editStep.useMutation({
    onSuccess: () => {
      utils.steps.invalidate();
    },
  });

  const createNewStep = () => {
    newStep();
  };

  const onStepEdit = async (stepId: number) => {
    editStep({ id: stepId, title: "New title" });
  };

  return (
    <Card>
      <Heading centered spaceAfter="medium">
        Application Form Editor
      </Heading>
      {isLoading && <Text>Loading...</Text>}
      {data?.data.map(({ title, id, stepNumber }) => (
        <Step
          key={id}
          title={title}
          stepNumber={stepNumber}
          onEdit={() => onStepEdit(id)}
        />
      ))}
      <br />
      <Button label="Create new step" onClick={createNewStep} />
    </Card>
  );
};

export default ApplicationFormEditor;
