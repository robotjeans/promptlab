import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Header } from "../components/layout/Header";
import { FormInput } from "../components/form/FormInput";
import { FormButton } from "../components/form/FormButton";
import { Checkbox } from "../components/form/Checkbox";

interface LoginFormInputs {
  emailOrUsername: string;
  password: string;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    mode: "onBlur",
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Invalid credentials");
      }

      login(result.access_token);
      navigate("/");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header showAuthButtons={false} />

      <main className="grow flex items-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[rgb(0,0,0)] mb-2 tracking-tight">
              Welcome back
            </h1>
            <p className="text-[rgb(107,114,128)] text-base sm:text-lg max-w-md mx-auto leading-relaxed">
              Sign in to access your private documents and continue your work
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 sm:p-8 border border-[rgb(238,243,251)] shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <FormInput
                label="Email or Username"
                id="emailOrUsername"
                type="text"
                registration={register("emailOrUsername", {
                  required: "Email or username is required",
                })}
                error={errors.emailOrUsername?.message}
                placeholder="Enter your email or username"
                containerClassName="space-y-1"
              />

              <FormInput
                label="Password"
                id="password"
                type="password"
                registration={register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                error={errors.password?.message}
                placeholder="Enter your password"
                containerClassName="space-y-1"
              />

              <div className="flex items-center justify-between">
                <Checkbox
                  id="remember-me"
                  label="Remember me"
                  containerClassName="flex items-center"
                />
                <a
                  href="#"
                  className="text-sm text-[rgb(94,145,226)] hover:text-[rgb(76,119,197)]"
                >
                  Forgot password?
                </a>
              </div>
              <FormButton loading={isSubmitting}>Sign In</FormButton>
            </form>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-[rgb(107,114,128)]">
              Your documents are encrypted and never shared with third parties
            </p>
          </div>
        </div>
      </main>

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
