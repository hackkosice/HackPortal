"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Stack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";
import { ApplicationStatisticsData } from "@/server/getters/dashboard/statistics/getApplicationStatistics";
import { ApplicationStatus } from "@/services/types/applicationStatus";

type StatisticsProps = {
  initialData: ApplicationStatisticsData;
  hackathonId: number;
};

type FilterOption = ApplicationStatus | "all";

const Statistics = ({ initialData, hackathonId }: StatisticsProps) => {
  const [statusFilter, setStatusFilter] = useState<FilterOption>("all");
  const [data, setData] = useState<ApplicationStatisticsData>(initialData);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const handleFilterChange = async (newStatus: FilterOption) => {
    setLoading(true);
    setFetchError(null);

    try {
      const response = await fetch(
        `/api/dashboard/${hackathonId}/statistics?status=${newStatus}`,
        {
          method: "GET",
        }
      );

      if (response.ok) {
        const newData = await response.json();
        setData(newData);
        setStatusFilter(newStatus);
      } else {
        setFetchError("Failed to load statistics. Please try again.");
      }
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
      setFetchError("Failed to load statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-navbarHeightOffsetMobile md:mt-navbarHeightOffset mx-auto">
      <Card className="md:w-[90vw] mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Application Statistics</CardTitle>
          <Stack direction="row" alignItems="center" spacing="medium">
            <label className="font-medium">Filter by status:</label>
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange(e.target.value as FilterOption)}
              disabled={loading}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Applications</option>
              <option value="open">Open</option>
              <option value="submitted">Submitted</option>
              <option value="confirmed">Confirmed</option>
              <option value="attended">Attended</option>
              <option value="rejected">Rejected</option>
            </select>
            {loading && (
              <span className="text-sm text-gray-500">Loading...</span>
            )}
          </Stack>
          {fetchError && (
            <p className="text-sm text-red-500 mt-1">{fetchError}</p>
          )}
        </CardHeader>

        <CardContent>
          <Stack direction="column" spacing="large">
            <div>
              <Text className="text-lg font-semibold">
                Total Applications: {data.totalApplications}
              </Text>
            </div>

            {data.stepStatistics.length === 0 ? (
              <Text className="text-gray-500">
                No dropdown fields found or no responses yet.
              </Text>
            ) : (
              <Stack direction="column" spacing="large">
                {data.stepStatistics.map((step) => (
                  <div key={step.stepId}>
                    <CardTitle className="text-xl mb-4 text-hkOrange">
                      {step.stepTitle}
                    </CardTitle>
                    <Stack direction="column" spacing="large">
                      {step.fields.map((field) => (
                        <Card key={field.fieldId} className="bg-gray-50">
                          <CardHeader>
                            <CardTitle className="text-lg">
                              {field.fieldLabel}
                            </CardTitle>
                            <Text className="text-sm text-gray-600">
                              Total responses: {field.totalResponses}
                            </Text>
                          </CardHeader>
                          <CardContent>
                            <Stack direction="column" spacing="small">
                              {field.options.map((option) => (
                                <div
                                  key={option.optionValue}
                                  className="flex items-center justify-between p-3 bg-white rounded border"
                                >
                                  <div className="flex-1">
                                    <Text className="font-medium">
                                      {option.optionValue}
                                    </Text>
                                  </div>
                                  <div className="ml-4 text-right">
                                    <Text className="font-semibold">
                                      {option.count}
                                    </Text>
                                    <Text className="text-sm text-gray-600">
                                      {option.percentage.toFixed(1)}%
                                    </Text>
                                  </div>
                                  <div className="ml-4 w-48 bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-hkOrange h-2 rounded-full"
                                      style={{
                                        width: `${option.percentage}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </Stack>
                          </CardContent>
                        </Card>
                      ))}
                    </Stack>
                  </div>
                ))}
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statistics;
