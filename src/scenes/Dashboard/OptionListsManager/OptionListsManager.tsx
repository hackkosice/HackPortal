import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import getOptionLists from "@/server/getters/dashboard/optionListManager/getOptionLists";
import OptionListsTable from "@/scenes/Dashboard/OptionListsManager/components/OptionListsTable";

const OptionListsManager = async () => {
  const optionLists = await getOptionLists();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Option Lists Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <OptionListsTable optionLists={optionLists} />
      </CardContent>
      <CardFooter>
        <Button asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OptionListsManager;
