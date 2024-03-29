import React from "react";
import { Metadata } from "next";
import OptionListsManager from "@/scenes/Dashboard/scenes/OptionListsManager/OptionListsManager";

export const metadata: Metadata = {
  title: "Option Lists",
};

const OptionListsPage = () => {
  return <OptionListsManager />;
};

export default OptionListsPage;
