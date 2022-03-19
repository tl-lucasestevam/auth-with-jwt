import { useRouter } from "next/router";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "../services";
import { setCookie, parseCookies } from "nookies";

interface User {
  email: string;
  permissions: string[];
  roles: string[];
}
interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  signIn(credentials: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
  user: User;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState({} as User);
  const isAuthenticated = false;

  useEffect(() => {
    const { "nextauth.token": token } = parseCookies();

    if (token) {
      api.get("/me").then((response) => {
        const { email, permissions, roles } = response.data;
        setUser({ email, permissions, roles });
      });
    }
  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post("sessions", {
        email,
        password,
      });
      const { token, refreshToken, permissions, roles } = response.data;

      setUser({
        email,
        permissions,
        roles,
      });

      setCookie(undefined, "nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30, // 1 Month
        path: "/",
      });

      setCookie(undefined, "nextauth.refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 1 Month
        path: "/",
      });

      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      router.push("/dashboard");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
