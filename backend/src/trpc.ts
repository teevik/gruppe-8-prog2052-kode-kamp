import { initTRPC, TRPCError } from "@trpc/server";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { verify as verifyJwt } from "jsonwebtoken";
import type { User } from "../../shared/types";
import { JWT_SECRET } from "./env";
import { userSchema } from "./user";

export interface Context {
  user?: User;
  // TODO add database
  // db: ...
}

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create(); // TODO set context type

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;

/** Create tRPC context, parses auth token and provides database access */
export function createContext(opts: CreateExpressContextOptions): Context {
  const { req } = opts;

  const context = {};

  const { authorization } = req.headers;
  if (!authorization) return context;

  const token = authorization.split(" ").at(1);
  if (!token) return context;

  try {
    // Verify the JWT
    const payload = verifyJwt(token, JWT_SECRET);

    // Validate the payload incase the schema has changed since creating the JWT
    const user = userSchema.parse(payload);

    return { user, ...context };
  } catch (e) {
    return context;
  }
}

export const authenticatedProcedure = publicProcedure.use(async (opts) => {
  const user = opts.ctx.user;
  if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

  // User is now always available in context
  return opts.next({
    ctx: {
      ...opts.ctx,
      user,
    },
  });
});
