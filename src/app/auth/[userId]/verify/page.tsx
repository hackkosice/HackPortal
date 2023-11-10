import verifyUser from "@/server/actions/auth/verifyUser";
import Link from "next/link";

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
  const result = await verifyUser({
    userIdParam: Number(params.userId),
    verificationToken: searchParams.token as string,
  });
  if (!result.success) {
    return (
      <div className="m-auto">
        Verification Error! <br />
        {result.error} <br />
        Try again and if the problem persists, contact Hack Kosice support.
      </div>
    );
  }
  return (
    <div className="m-auto">
      <h1 className="text-2xl">Email verified!</h1>
      {result.isSignedIn ? (
        <p>
          Take me back to my <Link href="/application">application</Link>.
        </p>
      ) : (
        <p>
          Now you can <Link href="/signin">sign in</Link>.
        </p>
      )}
    </div>
  );
};

export default Page;
