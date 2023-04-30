import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

const requireAuthServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<boolean> => {
  const session = await getServerSession(context.req, context.res, authOptions);

  return Boolean(session);
};

export default requireAuthServerSideProps;
