import { useEffect, useState } from "react";
import type { AuthUser } from "../types/auth";
import { decodeToken } from "../lib/auth";
import { AuthContext } from "../context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedUser = decodeToken(token);
        if (decodedUser) {
          setUser(decodedUser);
        } else {
          localStorage.removeItem("token");
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    const decodedUser = decodeToken(token);
    if (decodedUser) {
      setUser(decodedUser);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
