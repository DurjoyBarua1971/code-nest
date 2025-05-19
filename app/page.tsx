"use client";

import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useRouter } from "next/navigation";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import createClientForBrowser from "./lib/supabase/client";
import {
  signinWithEmailPassword,
  signupWithEmailPassword,
  signinWithGoogle,
} from "./lib/action";

interface AuthFormInputs {
  email: string;
  password: string;
}

export default function AuthPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthFormInputs>();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const router = useRouter();
  const supabase = createClientForBrowser();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push("/dashboard");
      }
    };
    checkSession();
  }, [router, supabase]);

  const onSubmit: SubmitHandler<AuthFormInputs> = async (data) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    setError(null);
    setSuccess(null);

    if (isLoginMode) {
      const result = await signinWithEmailPassword(null, formData);
      if (result.error) {
        setError(result.error);
      } else {
        reset();
        router.push("/dashboard");
      }
    } else {
      const result = await signupWithEmailPassword(null, formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(
          result.success ||
            "Registration successful !!"
        );
        reset();
        setTimeout(() => {
          setSuccess(null);
          setIsLoginMode(true);
        }, 2000);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signinWithGoogle();
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google");
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError(null);
    setSuccess(null);
    reset();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-100">
      <div className="flex max-w-6xl">
        {/* Image Section */}
        <div className="hidden md:block w-full md:w-1/2">
          <img
            src={isLoginMode ? "/login.jpg" : "/signup.jpeg"}
            alt={isLoginMode ? "Login Illustration" : "Signup Illustration"}
            className="w-[444px] object-cover"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 px-8">
          <div className="p-6 bg-white rounded shadow-md max-w-md mx-auto ">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              {isLoginMode ? "Login" : "Register"}
            </h2>
            {error && <p className="text-red-500 mb-4 text-center text-wrap break-words">{error}</p>}
            {success && (
              <p className="text-green-500 mb-4 text-center">{success}</p>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <InputText
                  id="email"
                  type="email"
                  className="w-full mt-1"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <InputText
                  id="password"
                  type="password"
                  className="w-full mt-1"
                  {...register("password", {
                    required: "Password is required",
                    minLength: isLoginMode
                      ? undefined
                      : {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                  })}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className={`${!isLoginMode ? " my-8 py-3" : ""}`}>
                <Button
                  label={isLoginMode ? "Login with Email" : "Register"}
                  type="submit"
                  className="w-full p-button-primary"
                />
              </div>
            </form>

            {isLoginMode && (
              <div className="mt-4">
                <Button
                  label="Login with Google"
                  icon="pi pi-google"
                  className="w-full p-button-secondary"
                  onClick={handleGoogleSignIn}
                />
              </div>
            )}

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                {isLoginMode
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="text-blue-500 hover:underline"
                >
                  {isLoginMode ? "Register here" : "Login here"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
