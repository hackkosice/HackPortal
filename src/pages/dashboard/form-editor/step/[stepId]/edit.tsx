import EditStepForm, {
  Props,
} from "@/scenes/Dashboard/DashboardOrganizer/ApplicationFormEditor/scenes/EditStepForm/EditStepForm";
import { GetServerSidePropsContext } from "next";
import requireAuthServerSideProps from "@/services/helpers/requireAuthServerSideProps";
import requireOrganizerServerSideProps from "@/services/helpers/requireOrganizerServerSideProps";

export default function Page(props: Props) {
  return <EditStepForm {...props} />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (!(await requireAuthServerSideProps(context))) {
    return { redirect: { destination: "/login" } };
  }

  if (!(await requireOrganizerServerSideProps(context))) {
    return { redirect: { destination: "/dashboard" } };
  }

  const { stepId } = context.query;
  return {
    props: {
      stepId: Number(stepId),
    },
  };
}
