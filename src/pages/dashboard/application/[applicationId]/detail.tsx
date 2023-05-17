import { GetServerSidePropsContext } from "next";
import requireAuthServerSideProps from "@/services/helpers/requireAuthServerSideProps";
import requireOrganizerServerSideProps from "@/services/helpers/requireOrganizerServerSideProps";
import ApplicationDetail, {
  Props,
} from "@/scenes/Dashboard/DashboardOrganizer/ApplicationDetail/ApplicationDetail";

export default function Page(props: Props) {
  return <ApplicationDetail {...props} />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (!(await requireAuthServerSideProps(context))) {
    return { redirect: { destination: "/login" } };
  }

  if (!(await requireOrganizerServerSideProps(context))) {
    return { redirect: { destination: "/dashboard" } };
  }

  const { applicationId } = context.query;
  return {
    props: {
      applicationId: Number(applicationId),
    },
  };
}
