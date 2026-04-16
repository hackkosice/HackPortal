import { NextRequest, NextResponse } from "next/server";
import requireOrganizerSession from "@/server/services/helpers/auth/requireOrganizerSession";
import getApplicationStatistics from "@/server/getters/dashboard/statistics/getApplicationStatistics";
import {
  ApplicationStatus,
  ApplicationStatusEnum,
} from "@/services/types/applicationStatus";

export async function GET(
  request: NextRequest,
  { params }: { params: { hackathonId: string } }
) {
  try {
    await requireOrganizerSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const hackathonId = Number(params.hackathonId);
  if (isNaN(hackathonId)) {
    return NextResponse.json({ error: "Invalid hackathonId" }, { status: 400 });
  }

  const rawStatus = request.nextUrl.searchParams.get("status") ?? "all";
  const validStatuses: string[] = [
    ...Object.values(ApplicationStatusEnum),
    "all",
  ];
  const status = validStatuses.includes(rawStatus)
    ? (rawStatus as ApplicationStatus | "all")
    : "all";

  try {
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
