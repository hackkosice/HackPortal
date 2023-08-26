import React from "react";
import { Heading } from "@/components/Heading";
import { Metadata } from "next";
import requireOrganizerApp from "@/services/helpers/requireOrganizerApp";
import Application from "@/scenes/Application/Application";
import getApplicationData from "@/server/endpoints/application";

export const metadata: Metadata = {
  title: "Application",
};

const ApplicationPage = async () => {
  if (await requireOrganizerApp()) {
    return <Heading>Organizer</Heading>;
  }
  const applicationData = await getApplicationData();
  return <Application data={applicationData} />;
};

export default ApplicationPage;
