import { initTRPC } from "@trpc/server";
import { Context } from "@/server/context";

const trpc = initTRPC.context<Context>().create();
// Base router and procedure helpers
export const router = trpc.router;
export const procedure = trpc.procedure;
