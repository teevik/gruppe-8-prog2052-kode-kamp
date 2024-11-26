import { z, ZodType } from "zod";
import type { UserJWT } from "../../../shared/types";

export const userJWTSchema: ZodType<UserJWT> = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
});
