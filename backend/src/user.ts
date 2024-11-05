import { z, ZodType } from "zod";
import type { User } from "../../shared/types";

export const userSchema: ZodType<User> = z.object({
  kind: z.literal("guest"),
  id: z.string(),
  username: z.string(),
});
