import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";
import { Button } from "@/components/Button";
import ApplicationsTable from "@/scenes/Dashboard/DashboardOrganizer/ApplicationFormEditor/components/ApplicationsTable";

const DashboardOrganizer = () => {
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

export default DashboardOrganizer;
