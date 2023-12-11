import Link from "next/link";
import verifyForgotPasswordToken from "@/server/actions/auth/verifyForgotPasswordToken";
import callServerAction from "@/services/helpers/server/callServerAction";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Metadata } from "next";
import ResetPassword from "@/scenes/ForgotPassword/ResetPassword";
import React from "react";
import { Heading } from "@/components/ui/heading";

export const metadata: Metadata = {
  title: "Reset password",
};

const Page = async ({
  searchParams,
  params,
}: {
  searchParams: {
    [key: string]: string | string[];
  };
  params: {
    userId: string;
  };
}) => {
  if (isNaN(Number(params.userId))) {
    return <div className="m-auto">Invalid user ID</div>;
  }
  if (!Object.keys(searchParams).includes("token")) {
    return <div className="m-auto">Invalid or missing token</div>;
  }
  const session = await getServerSession(authOptions);
  if (session) {
    return (
      <div className="m-auto">
        You are already signed in! <br />
        <Link href="/application" className="text-hkOrange underline">
          Go to your application
        </Link>
      </div>
    );
  }
  const result = await callServerAction(verifyForgotPasswordToken, {
    userId: Number(params.userId),
    token: searchParams.token as string,
  });
  if (!result.success) {
    return (
      <div className="m-auto">
        Error reading token! <br />
        Try again and if the problem persists, contact Hack Kosice support.
      </div>
    );
  }
  return (
    <div className="m-auto">
      <Heading spaceAfter="medium">Reset password below!</Heading>
      <ResetPassword
        userId={Number(params.userId)}
        token={searchParams.token as string}
      />
    </div>
  );
};

export default Page;
