"use client";

import React from "react";
import { CSVLink } from "react-csv";
import { Button } from "@/components/ui/button";

type DownloadTablesTeamProps = {
  data: {
    name: string;
    tableCode: string;
    challenges: string;
  }[];
};
const DownloadTablesTeam = ({ data }: DownloadTablesTeamProps) => {
  return (
    <CSVLink data={data} filename="teams-tables.csv">
      <Button className="mt-5">Download export</Button>
    </CSVLink>
  );
};

export default DownloadTablesTeam;
