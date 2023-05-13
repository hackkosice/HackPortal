import EditStepForm, {
  Props,
} from "@/scenes/Dashboard/DashboardOrganizer/ApplicationFormEditor/scenes/EditStepForm/EditStepForm";
import { GetServerSidePropsContext } from "next";

export default function Page(props: Props) {
  return <EditStepForm {...props} />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { stepId } = context.query;
  return {
    props: {
      stepId: Number(stepId),
    },
  };
}
