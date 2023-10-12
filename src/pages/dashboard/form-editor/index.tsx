import ApplicationFormEditor from "@/scenes/Dashboard/ApplicationFormEditor/ApplicationFormEditor";
import { GetServerSidePropsContext } from "next";
import requireAuthServerSideProps from "@/services/helpers/requireAuthServerSideProps";
import requireOrganizerServerSideProps from "@/services/helpers/requireOrganizerServerSideProps";

export default function Page() {
  return <ApplicationFormEditor />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (!(await requireAuthServerSideProps(context))) {
    return { redirect: { destination: "/signin" } };
  }

  if (!(await requireOrganizerServerSideProps(context))) {
    return { redirect: { destination: "/dashboard" } };
  }

  return { props: {} };
}
