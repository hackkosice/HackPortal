import React from "react";
import Dashboard from "@/scenes/Dashboard/Dashboard";
import { GetServerSidePropsContext } from "next";
import requireOrganizerServerSideProps from "@/services/helpers/requireOrganizerServerSideProps";

export default function Page() {
  return <Dashboard />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (!(await requireOrganizerServerSideProps(context))) {
    return { redirect: { destination: "/signin" } };
  }

  return { props: {} };
}
