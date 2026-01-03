import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { authApi } from "../../lib/api";
import { PromptLabLogo } from "../PromptLabLogo";

interface HeaderProps {
  showAuthButtons?: boolean;
  rightContent?: ReactNode;
  className?: string;
}

export const Header = ({
  showAuthButtons = true,
  rightContent,
  className = "",
}: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    authApi.logout();
    navigate("/login");
  };

  const renderAuthButtons = () => {
    if (!showAuthButtons) return null;

    if (authApi.isAuthenticated()) {
      return (
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-[rgb(107,114,128)] hover:text-[rgb(94,145,226)] transition-colors"
        >
          Sign Out
        </button>
      );
    }

    return (
      <button
        onClick={handleLogin}
        className="text-sm font-medium text-[rgb(94,145,226)] hover:text-[rgb(76,119,197)] transition-colors"
      >
        Sign In
      </button>
    );
  };

  return (
    <header className={`border-b border-[rgb(238,243,251)] ${className}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <PromptLabLogo />
          </div>
          {rightContent ? rightContent : renderAuthButtons()}
        </div>
      </div>
    </header>
  );
};
