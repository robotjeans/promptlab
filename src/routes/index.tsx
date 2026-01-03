import type { RouteObject } from "react-router";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import DocumentQnA from "../pages/Features/DocumentQnA";
import Security from "../pages/Features/Security";
import PrivacyPolicy from "../pages/Legal/PrivacyPolicy";
import { ProtectedRoute } from "../components/ProtectedRoute";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
    handle: {
      meta: {
        title: "PromptLab - Secure Document Intelligence for Professionals",
        description:
          "Ask questions about your confidential documents with AI. End-to-end encryption. Your data never shared. Perfect for legal, research, and professional use.",
        canonical: "https://promptlab.com",
      },
    },
  },
  {
    path: "/login",
    element: <Login />,
    handle: {
      meta: {
        title: "Sign In | PromptLab",
        description:
          "Sign in to your secure PromptLab workspace to access your private documents and AI-powered insights.",
        canonical: "https://promptlab.com/login",
      },
    },
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    handle: {
      meta: {
        title: "Dashboard | PromptLab",
        description:
          "Your secure document intelligence workspace. Upload documents and ask AI questions with complete privacy.",
        canonical: "https://promptlab.com/dashboard",
      },
    },
  },
  {
    path: "/features/document-qna",
    element: <DocumentQnA />,
    handle: {
      meta: {
        title: "Secure PDF Document Q&A | PromptLab",
        description:
          "Ask AI questions about your PDF documents privately. Source citations included. No data sharing.",
        canonical: "https://promptlab.com/features/document-qna",
      },
    },
  },
  {
    path: "/features/security",
    element: <Security />,
    handle: {
      meta: {
        title: "Security & Privacy | PromptLab",
        description:
          "Enterprise-grade security for your sensitive documents. End-to-end encryption and zero data sharing.",
        canonical: "https://promptlab.com/features/security",
      },
    },
  },
  {
    path: "/privacy",
    element: <PrivacyPolicy />,
    handle: {
      meta: {
        title: "Privacy Policy | PromptLab",
        description:
          "Learn how PromptLab protects your privacy and handles your data.",
        canonical: "https://promptlab.com/privacy",
      },
    },
  },
];
