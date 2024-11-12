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
import type { User } from "../../shared/types";
import { ACCESS_TOKEN } from "./const";

/** Zod schema for ensuring token payload is valid */
const userSchema: ZodType<User> = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
});

function userFromToken(token: string | null): User | null {
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
    const user = userSchema.parse(payload);
    return user;
  } catch (e) {
    return null;
  }
}

/** Get access token from localStorage */
function getAccessToken(): string | null {
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
  user: User | null;
  setToken: (token: string) => void;
  logOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

/** Auth context provider, must be at the top of react tree */
export function AuthContextProvider(props: { children: ReactNode }) {
  const [token, setToken] = useState(() => getAccessToken());

  // Update localStorage when token changes
  useEffect(() => {
    setAccessToken(token);
  }, [token]);

  // Decode user from token
  const user = useMemo(() => userFromToken(token), [token]);

  const logOut = useCallback(() => {
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, setToken, logOut }}>
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
