import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";
import { Button } from "@/components/Button";

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
    </Card>
  );
};

export default DashboardOrganizer;
