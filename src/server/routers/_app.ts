import { router } from "../trpc";
import signup from "@/server/routers/signup";

export const appRouter = router({
  signup,
});
// export type definition of API
export type AppRouter = typeof appRouter;
