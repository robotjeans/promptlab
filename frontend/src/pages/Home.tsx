import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { Header } from "../components/layout/Header";
import { LockIcon, ShieldIcon } from "../components/icons";

export default function Home() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !isLoading) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, isLoading, navigate]);

  const handleGetStarted = () => {
    navigate("/login");
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="grow flex items-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 w-full">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[rgb(0,0,0)] tracking-tight mb-6">
              Ask questions about your
              <span className="text-[rgb(237,116,90)]"> private documents</span>
            </h1>

            <p className="text-xl text-[rgb(107,114,128)] max-w-2xl mx-auto mb-10">
              Secure AI-powered document intelligence platform that keeps your
              data private and never shares with third parties.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="bg-[rgb(237,116,90)] hover:bg-[rgb(221,89,66)] text-white font-medium py-3 px-8 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </main>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-8">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-[rgb(107,114,128)] text-sm">
          <div className="flex items-center">
            <ShieldIcon className="w-5 h-5 text-[rgb(94,145,226)] mr-2" />
            End-to-end encryption
          </div>
          <div className="flex items-center">
            <LockIcon className="w-5 h-5 text-[rgb(94,145,226)] mr-2" />
            Your data, your control
          </div>
        </div>
      </div>

      <footer className="border-t border-[rgb(238,243,251)] mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <p className="text-center text-sm text-[rgb(107,114,128)]">
            © 2026 PromptLab. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
