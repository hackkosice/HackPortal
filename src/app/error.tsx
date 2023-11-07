"use client";

import React from "react";

const Page = ({ error }: { error: Error & { digest?: string } }) => {
  return <div className="m-auto">Error: {error.message}</div>;
};

export default Page;
