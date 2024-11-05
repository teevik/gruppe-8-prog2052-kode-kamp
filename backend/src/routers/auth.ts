import { sign as signJwt } from "jsonwebtoken";
import type { User } from "../../../shared/types";
import { JWT_SECRET } from "../env";
import { publicProcedure, router } from "../trpc";

const registerGuest = publicProcedure.mutation(() => {
  const id = crypto.randomUUID();
  // TODO random username
  const username = "guest";

  const user: User = {
    kind: "guest",
    id,
    username,
  };

  const jwt = signJwt(user, JWT_SECRET);
  return jwt;
});

export const authRouter = router({
  registerGuest,
});
