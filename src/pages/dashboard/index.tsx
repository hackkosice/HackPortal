import React from "react";
import Dashboard from "@/scenes/Dashboard/Dashboard";
import { GetServerSidePropsContext } from "next";
import requireAuthServerSideProps from "@/services/helpers/requireAuthServerSideProps";

export default function Page() {
  return <Dashboard />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (!(await requireAuthServerSideProps(context))) {
    return { redirect: { destination: "/login" } };
  }

  return { props: {} };
}
