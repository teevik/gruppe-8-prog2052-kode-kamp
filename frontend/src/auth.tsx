/**
 * Module for handling authentication and authorization in the app.
 * 
 * It exports a custom hook, `useAuth`, that can be used to get the current user
 * and authentication state. It also exports a context provider, `AuthContextProvider`,
 * that must be used to wrap the root element of the app.
 * 
 * The context provider uses the `tRPC` library to make API requests to the server
 * and get the user data. It also stores the user data in local storage and
 * invalidates the tRPC queries when the token changes.
 * 
 * The `useIsVerified` function is used to check if the user is verified or not.
 * It uses the `tRPC` library to make an API request to the server and get the
 * verification status.
 * 
 * The `userFromToken` function is used to decode the user data from the token.
 * It uses the `jwt-decode` library to decode the token and the `zod` library to
 * validate the token payload.
 */
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

/**
 * Zod schema for ensuring token payload is valid
 */
const userJwtSchema: ZodType<UserJWT> = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
});

/**
 * Decode user data from token
 * 
 * @param token - The token to decode
 * @returns The user data or null if the token is invalid
 */
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

/**
 * Get access token from localStorage
 * 
 * @returns The access token or null if it doesn't exist
 */
export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN);
}

/**
 * Set access token in localStorage
 * 
 * @param token - The token to set
 */
function setAccessToken(token: string | null) {
  if (token !== null) {
    localStorage.setItem(ACCESS_TOKEN, token);
  } else {
    localStorage.removeItem(ACCESS_TOKEN);
  }
}

/**
 * Auth context type
 */
interface AuthContextType {
  token: string | null;
  user: UserJWT | null;
  isVerified: boolean;
  setToken: (token: string) => void;
  logOut: () => void;
}

/**
 * Auth context
 */
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Check if the user is verified
 * 
 * @param isLoggedIn - Whether the user is logged in or not
 * @returns Whether the user is verified or not
 */
function useIsVerified(isLoggedIn: boolean): boolean {
  const query = trpc.user.isVerified.useQuery(undefined, {
    enabled: isLoggedIn,
    retry: false,
    initialData: true,
  });

  // Show as verified
  return query.data;
}

/**
 * Auth context provider, must be at the top of react tree
 * 
 * @param props - The props for the provider
 * @returns The provider element
 */
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

/**
 * Custom hook to use auth context
 * 
 * @returns The auth context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }

  return context;
}

