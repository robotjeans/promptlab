import { apiClient } from "./client";
import type {
  LoginRequest,
  LoginResponse,
  CreateUserRequest,
  CreateUserResponse,
  User,
} from "./types";

export const authApi = {
  /**
   * Login user
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>(
      "/auth/login",
      credentials
    );

    // Store token and user info
    localStorage.setItem("auth_token", data.access_token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
  },

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    const { data } = await apiClient.get<User>("/auth/profile");
    return data;
  },

  /**
   * Create a new user (admin only)
   */
  async createUser(userData: CreateUserRequest): Promise<CreateUserResponse> {
    const { data } = await apiClient.post<CreateUserResponse>(
      "/auth/create-user",
      userData
    );
    return data;
  },

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem("auth_token");
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
};
