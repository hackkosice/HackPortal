import React from "react";
import Application from "@/scenes/Application/Application";
import requireOrganizerServerSideProps from "@/services/helpers/requireOrganizerServerSideProps";
import { GetServerSidePropsContext } from "next";

export default function Page() {
  return <Application />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (await requireOrganizerServerSideProps(context)) {
    return { redirect: { destination: "/dashboard" } };
  }
  return { props: {} };
}
