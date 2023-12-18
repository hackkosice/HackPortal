import SignUp from "@/scenes/SignUp/SignUp";
import { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign up",
};

const SignUpPage = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/application");
  }
  return <SignUp />;
};

export default SignUpPage;
