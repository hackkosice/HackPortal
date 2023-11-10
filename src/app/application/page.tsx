import React from "react";
import { Metadata } from "next";
import Application from "@/scenes/Application/Application";
import requireNonOrganizer from "@/services/helpers/requireNonOrganizer";

export const metadata: Metadata = {
  title: "Application",
};

const ApplicationPage = async () => {
  await requireNonOrganizer();
  return <Application />;
};

export default ApplicationPage;
