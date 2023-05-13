import React from "react";

export type Props = {
  label: string;
  type: string;
};

const StepFormField = ({ label, type }: Props) => {
  return (
    <div>
      {label} ({type})
    </div>
  );
};

export default StepFormField;
