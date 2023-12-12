import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";

const requireAdminSession = async () => {
  const org = await requireOrganizerSession();
  if (!org.isAdmin) {
    throw new Error("Organizer is not an admin");
  }
  return org;
};

export default requireAdminSession;
