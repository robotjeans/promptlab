import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { Header } from "../components/layout/Header";
import { FormInput } from "../components/form/FormInput";
import { FormButton } from "../components/form/FormButton";
import { Checkbox } from "../components/form/Checkbox";
import { Footer } from "../components/layout";
import { authApi, type ApiError } from "../lib/api";
import type { AxiosError } from "axios";
import { loginSchema } from "../lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";

interface LoginFormInputs {
  emailOrUsername: string;
  password: string;
}

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (authApi.isAuthenticated()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    setServerError(null);

    console.log(data);

    try {
      const response = await authApi.login(data);
      console.log("Logged in:", response.user);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const error = err as AxiosError<ApiError>;

      if (error.response?.status === 429) {
        setServerError("Too many login attempts. Please try again later.");
      } else {
        setServerError(
          error.response?.data?.message || "Login failed. Please try again."
        );
        console.log(serverError);
      }
    } finally {
      setLoading(false);
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
                name="emailOrUsername"
                label="Email or Username"
                type="text"
                control={control}
                error={errors.emailOrUsername?.message}
                placeholder="Enter your email or username"
              />

              <FormInput
                name="password"
                label="Password"
                type="password"
                control={control}
                error={errors.password?.message}
                placeholder="Enter your password"
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
              <FormButton loading={loading || isSubmitting}>Sign In</FormButton>
            </form>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-[rgb(107,114,128)]">
              Your documents are encrypted and never shared with third parties
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
