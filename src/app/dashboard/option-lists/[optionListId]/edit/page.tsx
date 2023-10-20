import OptionListEditor from "@/scenes/Dashboard/OptionListsManager/scenes/OptionListEditor/OptionListEditor";
import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Option List Editor",
};

const OptionListEditPage = ({
  params: { optionListId },
}: {
  params: {
    optionListId: string;
  };
}) => {
  return <OptionListEditor optionListId={Number(optionListId)} />;
};

export default OptionListEditPage;
