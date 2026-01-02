import type { ReactNode } from "react";
import { PromptLabLogo } from "../PromptLabLogo";

interface FooterProps {
  children?: ReactNode;
  className?: string;
  showFullFooter?: boolean;
}

export const Footer = ({
  children,
  className = "",
  showFullFooter = false,
}: FooterProps) => {
  const currentYear = new Date().getFullYear();

  if (children) {
    return (
      <footer
        className={`border-t border-[rgb(238,243,251)] mt-auto ${className}`}
      >
        {children}
      </footer>
    );
  }

  if (showFullFooter) {
    return (
      <footer className={`bg-white ${className}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <PromptLabLogo className="w-auto h-8" />
                <span className="text-lg font-semibold text-[rgb(0,0,0)]">
                  PromptLab
                </span>
              </div>
              <p className="text-[rgb(107,114,128)] text-sm max-w-md">
                Secure AI document intelligence platform for professionals who
                need privacy-first document analysis.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[rgb(0,0,0)] mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-[rgb(107,114,128)]">
                <li>
                  <a
                    href="/features/document-qna"
                    className="hover:text-[rgb(94,145,226)] transition-colors"
                  >
                    Document Q&A
                  </a>
                </li>
                <li>
                  <a
                    href="/features/security"
                    className="hover:text-[rgb(94,145,226)] transition-colors"
                  >
                    Security
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-[rgb(0,0,0)] mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-[rgb(107,114,128)]">
                <li>
                  <a
                    href="/privacy"
                    className="hover:text-[rgb(94,145,226)] transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[rgb(238,243,251)] mt-8 pt-8 text-center">
            <p className="text-sm text-[rgb(107,114,128)]">
              © {currentYear} PromptLab. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer
      className={`border-t border-[rgb(238,243,251)] mt-auto ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <p className="text-center text-sm text-[rgb(107,114,128)]">
          © {currentYear} PromptLab. All rights reserved.{" "}
          <a href="/privacy" className="text-[rgb(94,145,226)] hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </footer>
  );
};
