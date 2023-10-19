import LandingPage from "@/scenes/LandingPage/LandingPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hack Kosice Application Portal",
};

const Landing = () => {
  return <LandingPage />;
};

export default Landing;
