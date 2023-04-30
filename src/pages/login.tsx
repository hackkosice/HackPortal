import React from "react";
import LoginPage from "@/scenes/LoginPage/LoginPage";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getProviders } from "next-auth/react";

export type LoginPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

export default function Page({ providers }: LoginPageProps) {
  return <LoginPage />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  if (session) {
    return { redirect: { destination: "/dashboard" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
