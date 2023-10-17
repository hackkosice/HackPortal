import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/services/prisma";

const requireOrganizerServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<boolean> => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return false;
  }

  const user = await prisma.user.findFirst({
    where: {
      id: session.id,
    },
    include: {
      organizer: true,
    },
  });

  return Boolean(user?.organizer);
};

export default requireOrganizerServerSideProps;
