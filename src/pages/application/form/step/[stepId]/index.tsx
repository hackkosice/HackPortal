import React from "react";
import { GetServerSidePropsContext } from "next";
import requireAuthServerSideProps from "@/services/helpers/requireAuthServerSideProps";
import ApplicationFormStep, {
  Props,
} from "@/scenes/ApplicationFormStep/ApplicationFormStep";

export default function Page(props: Props) {
  return <ApplicationFormStep {...props} />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (!(await requireAuthServerSideProps(context))) {
    return { redirect: { destination: "/login" } };
  }

  const { stepId } = context.query;
  return {
    props: {
      stepId: Number(stepId),
    },
  };
}
