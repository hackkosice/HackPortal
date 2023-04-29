import React from "react";
import { Card } from "@/components/Card";
import { Heading } from "@/components/Heading";
import { Text } from "@/components/Text";
import { useSession } from "next-auth/react";
import Link from "next/link";

const Dashboard = () => {
  const { data: session } = useSession();

  return (
    <Card>
      <Heading spaceAfter="large" centered>
        Dashboard
      </Heading>
      {session ? (
        <Text>Welcome {session.user?.email}!</Text>
      ) : (
        <>
          <Text>Not logged in</Text>
          <Link href="/login" className="text-hkOrange">
            Log in
          </Link>
        </>
      )}
    </Card>
  );
};

export default Dashboard;
