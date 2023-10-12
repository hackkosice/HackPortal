import React from "react";
import SignInPage from "@/scenes/SignInPage/SignInPage";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getProviders } from "next-auth/react";

export type SigninPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

export default function Page({ providers }: SigninPageProps) {
  return <SignInPage providers={providers} />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  if (session) {
    return { redirect: { destination: "/application" } };
  }

  const providers = await getProviders();

  return {
    props: { providers: providers ?? [] },
  };
}
