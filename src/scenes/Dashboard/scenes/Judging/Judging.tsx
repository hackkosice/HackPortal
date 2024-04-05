import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Button } from "@/components/ui/button";

type JudgingManagerProps = {
  hackathonId: number;
};
const Judging = async ({ hackathonId }: JudgingManagerProps) => {
  const session = await getServerSession(authOptions);
  return (
    <Card className="md:w-[70vw] mx-auto">
      <CardHeader>
        <CardTitle>Judging</CardTitle>
      </CardHeader>
      <CardContent>
        {session?.isAdmin && (
          <Button>
            <Link href={`/dashboard/${hackathonId}/judging/manage`}>
              Judging manager
            </Link>
          </Button>
        )}
        Judge judge judge
      </CardContent>
    </Card>
  );
};

export default Judging;
