import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import ApplicationsTable from "@/scenes/Dashboard/ApplicationFormEditor/components/ApplicationsTable";
import Link from "next/link";
import { Suspense } from "react";
import { Stack } from "@/components/ui/stack";

const Dashboard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard Organizer</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack direction="column">
          <Button asChild>
            <Link href="/dashboard/form-editor">Edit application form</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/option-lists">Manage option lists</Link>
          </Button>
          <Suspense fallback={<Text>Loading...</Text>}>
            <ApplicationsTable />
          </Suspense>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
