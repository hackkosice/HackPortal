import { router } from "../trpc";
import signup from "@/server/routers/signup";
import userInfo from "@/server/routers/userInfo";
import steps from "@/server/routers/organizerDashboard/formEditor/steps";
import newStep from "@/server/routers/organizerDashboard/formEditor/newStep";
import editStep from "@/server/routers/organizerDashboard/formEditor/editStep";
import deleteStep from "@/server/routers/organizerDashboard/formEditor/deleteStep";

export const appRouter = router({
  signup,
  userInfo,
  steps,
  newStep,
  editStep,
  deleteStep,
});
// export type definition of API
export type AppRouter = typeof appRouter;
