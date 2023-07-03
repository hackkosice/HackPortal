import FormStepEditor, {
  Props,
} from "@/scenes/Dashboard/ApplicationFormEditor/scenes/EditStepForm/FormStepEditor";
import { GetServerSidePropsContext } from "next";
import requireAuthServerSideProps from "@/services/helpers/requireAuthServerSideProps";
import requireOrganizerServerSideProps from "@/services/helpers/requireOrganizerServerSideProps";

export default function Page(props: Props) {
  return <FormStepEditor {...props} />;
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
