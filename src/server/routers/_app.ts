import { router } from "../trpc";
import signup from "@/server/routers/signup";
import userInfo from "@/server/routers/userInfo";

export const appRouter = router({
  signup,
  userInfo,
});
// export type definition of API
export type AppRouter = typeof appRouter;
