"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import type { LoginFormData } from "@/lib/validations/auth";
import type { ForgotPasswordFormData } from "@/lib/validations/auth";
import type { TwoFactorFormData } from "@/lib/validations/auth";
import { useAuthStore } from "@/stores/auth-store";

export function useLoginMutation() {
    const { setStep, setEmail } = useAuthStore();
    const router = useRouter();

    return useMutation({
        mutationFn: (data: LoginFormData) => authApi.login(data),
        onSuccess: (response, variables) => {
            if (response.requires2FA) {
                setEmail(variables.email);
                setStep("2fa");
            } else if (response.token) {
                // Store token (in production, use secure storage)
                localStorage.setItem("auth-token", response.token);

                // Redirect to dashboard
                router.push("/app/dashboard");
            }
        },
    });
}

export function useForgotPasswordMutation() {
    return useMutation({
        mutationFn: (data: ForgotPasswordFormData) => authApi.forgotPassword(data),
    });
}

export function useVerify2FAMutation() {
    const router = useRouter();

    return useMutation({
        mutationFn: (data: TwoFactorFormData) => authApi.verify2FA(data),
        onSuccess: (response) => {
            if (response.token) {
                // Store token (in production, use secure storage)
                localStorage.setItem("auth-token", response.token);

                // Redirect to dashboard
                router.push("/app/dashboard");
            }
        },
    });
}

export function useResend2FAMutation() {
    return useMutation({
        mutationFn: () => authApi.resend2FA(),
    });
}
