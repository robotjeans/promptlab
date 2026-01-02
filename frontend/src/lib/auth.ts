import type { AuthUser } from "../types/auth";

export function decodeToken(token: string): AuthUser | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return { id: payload.id, email: payload.email, username: payload.username };
  } catch {
    return null;
  }
}
