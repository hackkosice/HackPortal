import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";
import { Button } from "@/components/ui/button";
import ApplicationsTable from "@/scenes/Dashboard/ApplicationFormEditor/components/ApplicationsTable";
import Link from "next/link";

const Dashboard = () => {
  return (
    <Card>
      <Heading spaceAfter="large" centered>
        Dashboard Organizer
      </Heading>
      <Button asChild>
        <Link href="/dashboard/form-editor">Edit application form</Link>
      </Button>
      <ApplicationsTable />
    </Card>
  );
};

export default Dashboard;
