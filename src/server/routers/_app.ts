import { router } from "../trpc";
import signup from "@/server/routers/signup";
import userInfo from "@/server/routers/userInfo";
import steps from "@/server/routers/organizerDashboard/formEditor/steps";
import newStep from "@/server/routers/organizerDashboard/formEditor/newStep";
import editStep from "@/server/routers/organizerDashboard/formEditor/editStep";
import deleteStep from "@/server/routers/organizerDashboard/formEditor/deleteStep";
import stepInfo from "@/server/routers/organizerDashboard/formEditor/stepInfo";
import newFormField from "@/server/routers/organizerDashboard/formEditor/newFormField";
import formFieldTypes from "@/server/routers/organizerDashboard/formEditor/formFieldTypes";
import stepsHacker from "@/server/routers/hackerDashboard/stepsHacker";
import stepFormFields from "@/server/routers/applicationForm/stepFormFields";
import application from "@/server/routers/hackerDashboard/application";
import saveFieldValues from "@/server/routers/applicationForm/saveFieldValues";
import deleteFormField from "@/server/routers/organizerDashboard/formEditor/deleteFormField";

export const appRouter = router({
  signup,
  userInfo,
  steps,
  newStep,
  editStep,
  deleteStep,
  stepInfo,
  newFormField,
  formFieldTypes,
  stepsHacker,
  stepFormFields,
  application,
  saveFieldValues,
  deleteFormField,
});
// export type definition of API
export type AppRouter = typeof appRouter;
