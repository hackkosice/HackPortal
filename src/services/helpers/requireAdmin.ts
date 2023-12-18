import requireOrganizer from "@/services/helpers/requireOrganizer";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Session } from "next-auth";
import { redirect } from "next/navigation";

const requireAdmin = async () => {
  await requireOrganizer();

  // Session is guaranteed to exist at this point thanks to requireOrganizer
  const session = (await getServerSession(authOptions)) as Session;
  if (!session.isAdmin) {
    redirect("/dashboard");
  }
};
export default requireAdmin;
