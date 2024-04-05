import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const disallowVolunteer = async (hackathonId: string) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/application");
    return;
  }

  const isVolunteerEmail = session.user?.email === "volunteers@hackkosice.com";

  if (isVolunteerEmail) {
    redirect(`/dashboard/${hackathonId}/check-in`);
    return;
  }
};
