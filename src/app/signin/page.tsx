import { getServerSession } from "next-auth/next";
import SignIn from "@/scenes/SignIn/SignIn";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getProviders } from "next-auth/react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in",
};

const SignInPage = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/application");
  }
  const providers = await getProviders();
  return <SignIn providers={providers} />;
};

export default SignInPage;
