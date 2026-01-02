import { useState } from "react";
import type { AuthUser } from "../types/auth";
import { decodeToken } from "../lib/auth";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = localStorage.getItem("token");
    return token ? decodeToken(token) : null;
  });

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setUser(decodeToken(token));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
