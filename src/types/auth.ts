export interface AuthUser {
  id: string;
  email: string;
  username: string;
}

export type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
};
