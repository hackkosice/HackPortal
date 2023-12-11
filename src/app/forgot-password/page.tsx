import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import ForgotPassword from "@/scenes/ForgotPassword/ForgotPassword";

export const metadata: Metadata = {
  title: "Forgot password",
};

const SignInPage = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/application");
  }
  return <ForgotPassword />;
};

export default SignInPage;
