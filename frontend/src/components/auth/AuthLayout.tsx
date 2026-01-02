import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 p-6">
      <div className="relative w-full max-w-6xl overflow-hidden rounded-3xl bg-white/90 backdrop-blur-xl shadow-[0_40px_120px_rgba(0,0,0,0.35)]">
        <div className="flex">
          {/* LEFT */}
          <div className="w-full md:w-1/2 px-10 py-12">{children}</div>

          {/* RIGHT */}
          <div className="relative hidden md:block w-1/2 overflow-hidden">
            {/* Base gradient */}
            <div className="absolute inset-0 bg-linear-to-br from-[rgb(237,116,90)] via-[rgb(255,150,130)] to-[rgb(94,145,226)]" />

            {/* Fluid highlights */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.25),transparent_60%)]" />

            {/* Bottom glass pill */}
            <div className="absolute bottom-8 left-8 right-8 rounded-2xl bg-white/20 backdrop-blur-lg px-6 py-3">
              <p className="text-center text-xs text-white/80">
                © 2026 PromptLab. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
