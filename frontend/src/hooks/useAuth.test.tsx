import { renderHook, act } from "@testing-library/react";
import { useAuth } from "./useAuth";
import type { AuthUser } from "../types/auth";
import { AuthProvider } from "./AuthProvider";

vi.mock("../lib/auth", () => ({
  decodeToken: (token: string) => {
    if (token === "valid-token") {
      return { id: "1", email: "test@example.com", username: "testuser" };
    }
    return null;
  },
}));

const mockToken = "valid-token";
const mockUser: AuthUser = {
  id: "1",
  email: "test@example.com",
  username: "testuser",
};

describe("useAuth", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("initializes with null user when no token", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it("loads user from localStorage on init", () => {
    localStorage.getItem = vi.fn().mockReturnValue(mockToken);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isLoading).toBe(false);
  });

  it("handles login correctly", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.login(mockToken);
    });

    expect(localStorage.setItem).toHaveBeenCalledWith("token", mockToken);
    expect(result.current.user).toEqual(mockUser);
  });

  it("handles logout correctly", () => {
    localStorage.getItem = vi.fn().mockReturnValue(mockToken);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.logout();
    });

    expect(localStorage.removeItem).toHaveBeenCalledWith("token");
    expect(result.current.user).toBeNull();
  });
});
