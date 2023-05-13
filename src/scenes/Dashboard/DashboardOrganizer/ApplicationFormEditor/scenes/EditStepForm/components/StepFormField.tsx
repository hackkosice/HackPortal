import React from "react";

export type Props = {
  label: string;
  type: string;
  formFieldNumber: number;
};

const StepFormField = ({ label, type, formFieldNumber }: Props) => {
  return (
    <div>
      {formFieldNumber}. {label} ({type})
    </div>
  );
};

export default StepFormField;
