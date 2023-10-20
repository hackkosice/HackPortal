import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import getOptionList from "@/server/getters/dashboard/optionListManager/getOptionList";

type OptionListEditorProps = {
  optionListId: number;
};
const OptionListEditor = async ({ optionListId }: OptionListEditorProps) => {
  const optionList = await getOptionList({ id: optionListId });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Option List Editor</CardTitle>
      </CardHeader>
      <CardContent>Editing option list {optionList.name}</CardContent>
      <CardFooter>
        <Button asChild variant="outline">
          <Link href="/dashboard/option-lists">Back to option lists</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OptionListEditor;
