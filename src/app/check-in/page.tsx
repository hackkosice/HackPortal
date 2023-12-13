import CheckinCard from "@/scenes/CheckIn/CheckinCard";
import { Metadata } from "next";
import requireHacker from "@/services/helpers/requireHacker";

export const metadata: Metadata = {
  title: "Check-in",
};

const Page = async () => {
  await requireHacker();
  return <CheckinCard />;
};

export default Page;
