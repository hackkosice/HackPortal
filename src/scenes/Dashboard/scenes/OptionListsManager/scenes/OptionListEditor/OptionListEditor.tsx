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
import OptionsTable from "@/scenes/Dashboard/scenes/OptionListsManager/scenes/OptionListEditor/components/OptionsTable";

type OptionListEditorProps = {
  optionListId: number;
};
const OptionListEditor = async ({ optionListId }: OptionListEditorProps) => {
  const optionList = await getOptionList({ id: optionListId });
  return (
    <Card className="m-auto">
      <CardHeader>
        <CardTitle>Option List Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <OptionsTable optionList={optionList} />
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline">
          <Link href="/option-lists">Back to option lists</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OptionListEditor;
