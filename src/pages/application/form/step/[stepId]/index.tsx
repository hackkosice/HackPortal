import React from "react";
import { GetServerSidePropsContext } from "next";
import ApplicationFormStep, {
  Props,
} from "@/scenes/ApplicationFormStep/ApplicationFormStep";
import requireOrganizerServerSideProps from "@/services/helpers/requireOrganizerServerSideProps";

export default function Page(props: Props) {
  return <ApplicationFormStep {...props} />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (await requireOrganizerServerSideProps(context)) {
    return { redirect: { destination: "/dashboard" } };
  }

  const { stepId } = context.query;
  return {
    props: {
      stepId: Number(stepId),
    },
  };
}
