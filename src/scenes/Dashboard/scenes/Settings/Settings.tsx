import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Settings = () => {
  return (
    <Card>
      <CardContent>
        <Button asChild>
          <Link href="/option-lists">Manage option lists</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default Settings;
