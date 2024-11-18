import { z, ZodType } from "zod";
import type { User } from "../../shared/types";

export const userSchema: ZodType<User> = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  verified: z.boolean(),
});
