import { z, ZodType } from "zod";
import type { UserJWT } from "../../shared/types";

export const userSchema: ZodType<UserJWT> = z.object({
  id: z.string(),
  username: z.string(),
});
