import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ApplicationsTable from "@/scenes/Dashboard/ApplicationFormEditor/components/ApplicationsTable";
import Link from "next/link";

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
        <ApplicationsTable />
      </CardContent>
    </Card>
  );
};

export default Dashboard;
