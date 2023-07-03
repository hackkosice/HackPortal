import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";
import { Button } from "@/components/Button";
import ApplicationsTable from "@/scenes/Dashboard/ApplicationFormEditor/components/ApplicationsTable";

const Dashboard = () => {
  return (
    <Card>
      <Heading spaceAfter="large" centered>
        Dashboard Organizer
      </Heading>
      <Button
        label={"Edit application form"}
        type="buttonLink"
        href="/dashboard/form-editor"
      />
      <ApplicationsTable />
    </Card>
  );
};

export default Dashboard;
