import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import ApplicationsTable from "@/scenes/Dashboard/ApplicationFormEditor/components/ApplicationsTable";
import Link from "next/link";
import { Suspense } from "react";

const Dashboard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard Organizer</CardTitle>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link href="/dashboard/form-editor">Edit application form</Link>
        </Button>
        <Suspense fallback={<Text>Loading...</Text>}>
          <ApplicationsTable />
        </Suspense>
      </CardContent>
    </Card>
  );
};

export default Dashboard;
