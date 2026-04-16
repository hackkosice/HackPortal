import { NextRequest, NextResponse } from "next/server";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";
import getApplicationStatistics from "@/server/getters/dashboard/statistics/getApplicationStatistics";
import { ApplicationStatus } from "@/services/types/applicationStatus";

export async function GET(
  request: NextRequest,
  { params }: { params: { hackathonId: string } }
) {
  try {
    await requireOrganizerSession();

    const searchParams = request.nextUrl.searchParams;
    const status = (searchParams.get("status") || "all") as
      | ApplicationStatus
      | "all";

    const hackathonId = Number(params.hackathonId);

    const data = await getApplicationStatistics(hackathonId, status);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Statistics API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
