export interface AuthUser {
  id: string;
  email: string;
  username: string;
}

export type AuthContextType = {
  user: AuthUser | null;
  login: (token: string) => void;
  logout: () => void;
};
