"use client";

import { useAuthStore } from "@/stores/auth-store";
import {
    useForgotPasswordMutation,
    useLoginMutation,
    useResend2FAMutation,
    useVerify2FAMutation,
} from "@/hooks/use-auth-mutations";
import { ForgotPasswordForm } from "./forgot-password-form";
import { LoginForm } from "./login-form";
import { TwoFactorForm } from "./two-factor-form";

export function AuthContainer() {
    const step = useAuthStore((state) => state.step);

    // Mutations
    const loginMutation = useLoginMutation();
    const forgotPasswordMutation = useForgotPasswordMutation();
    const verify2FAMutation = useVerify2FAMutation();
    const resend2FAMutation = useResend2FAMutation();

    return (
        <div className="w-full">
            {/* Logo/Brand */}
            <div className="mb-8">
                <div className="flex items-center justify-center gap-3 lg:justify-start">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg">
                        <svg className="size-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                    </div>
                    <span className="text-2xl font-bold text-white">Home Service SaaS</span>
                </div>
            </div>

            {/* Header based on step */}
            {step === "login" && (
                <div className="mb-6 text-center lg:text-left">
                    <h1 className="text-3xl font-bold text-white">Welcome back</h1>
                    <p className="mt-2 text-slate-400">Sign in to your account to continue</p>
                </div>
            )}

            {/* Render appropriate form based on step */}
            {step === "login" && (
                <LoginForm
                    onSubmit={async (data) => {
                        await loginMutation.mutateAsync(data);
                    }}
                    isLoading={loginMutation.isPending}
                    error={loginMutation.error?.message}
                />
            )}

            {step === "forgot-password" && (
                <ForgotPasswordForm
                    onSubmit={async (data) => {
                        await forgotPasswordMutation.mutateAsync(data);
                    }}
                    isLoading={forgotPasswordMutation.isPending}
                    error={forgotPasswordMutation.error?.message}
                />
            )}

            {step === "2fa" && (
                <TwoFactorForm
                    onSubmit={async (data) => {
                        await verify2FAMutation.mutateAsync(data);
                    }}
                    onResend={async () => {
                        await resend2FAMutation.mutateAsync();
                    }}
                    isLoading={verify2FAMutation.isPending}
                    error={verify2FAMutation.error?.message}
                />
            )}
        </div>
    );
}
