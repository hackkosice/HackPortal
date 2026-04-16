import { NextRequest, NextResponse } from "next/server";
import getApplicationStatistics from "@/server/getters/dashboard/statistics/getApplicationStatistics";
import { ApplicationStatus } from "@/services/types/applicationStatus";

export const GET = async (
  request: NextRequest,
  { params }: { params: { hackathonId: string } }
) => {
  try {
    const hackathonId = Number(params.hackathonId);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as ApplicationStatus | "all" | null;

    const data = await getApplicationStatistics(
      hackathonId,
      status ?? "all"
    );

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
};
