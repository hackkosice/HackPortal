import React from "react";
import { Metadata } from "next";
import requireOrganizerApp from "@/services/helpers/requireOrganizerApp";
import Application from "@/scenes/Application/Application";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Application",
};

const ApplicationPage = async () => {
  if (await requireOrganizerApp()) {
    redirect("/dashboard");
  }
  return <Application />;
};

export default ApplicationPage;
