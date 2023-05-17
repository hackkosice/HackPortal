import React from "react";
import { trpc } from "@/services/trpc";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const ApplicationsTable = () => {
  const { data } = trpc.applicationsList.useQuery();
  return (
    <div className="relative overflow-x-auto mt-5">
      <table className="w-full text-sm text-left text-gray-500 ">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              Full name
            </th>
            <th scope="col" className="px-6 py-3">
              School
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {data?.data.map((application) => (
            <tr className="bg-white border-b" key={application.id}>
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {application.values["Full name"]}
              </th>
              <td className="px-6 py-4">{application.values["School"]}</td>
              <td className="px-6 py-4">{application.status}</td>
              <td className="px-6 py-4">
                <Link href={`/dashboard/application/${application.id}/detail`}>
                  <InformationCircleIcon className="w-5 h-5 text-hkOrange inline" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationsTable;
