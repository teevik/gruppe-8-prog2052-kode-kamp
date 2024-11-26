import { jwtDecode } from "jwt-decode";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { z, ZodType } from "zod";
import type { UserJWT } from "../../shared/types";
import { ACCESS_TOKEN } from "./const";
import { trpc } from "./trpc";

/** Zod schema for ensuring token payload is valid */
const userJwtSchema: ZodType<UserJWT> = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
});

function userFromToken(token: string | null): UserJWT | null {
  if (!token) return null;

  try {
    // Decode token
    const payload = jwtDecode(token);

    // Check if token is expired
    if (payload.exp) {
      const expirationTime = payload.exp * 1000;

      if (Date.now() > expirationTime) {
        return null;
      }
    }

    // Validate token payload
    const user = userJwtSchema.parse(payload);
    return user;
  } catch (e) {
    return null;
  }
}

/** Get access token from localStorage */
export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN);
}

/** Set access token in localStorage */
function setAccessToken(token: string | null) {
  if (token !== null) {
    localStorage.setItem(ACCESS_TOKEN, token);
  } else {
    localStorage.removeItem(ACCESS_TOKEN);
  }
}

/** Auth context type */
interface AuthContextType {
  token: string | null;
  user: UserJWT | null;
  isVerified: boolean;
  setToken: (token: string) => void;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function useIsVerified(isLoggedIn: boolean): boolean {
  const query = trpc.user.isVerified.useQuery(undefined, {
    enabled: isLoggedIn,
    retry: false,
    initialData: true,
  });

  // Show as verified
  return query.data;
}

/** Auth context provider, must be at the top of react tree */
export function AuthContextProvider(props: { children: ReactNode }) {
  const [token, setToken] = useState(() => getAccessToken());
  const trpcUtils = trpc.useUtils();

  // Update localStorage and invalidate queries when token changes
  useEffect(() => {
    setAccessToken(token);
    trpcUtils.invalidate();
  }, [token]);

  // Decode user from token
  const user = useMemo(() => userFromToken(token), [token]);
  const isAuthenticated = user !== null;

  const logOut = useCallback(() => {
    setToken(null);
  }, []);

  const isVerified = useIsVerified(isAuthenticated);

  return (
    <AuthContext.Provider
      value={{
        token: isAuthenticated ? token : null,
        user,
        isVerified,
        setToken,
        logOut,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

/** Custom hook to use auth context */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }

  return context;
}
