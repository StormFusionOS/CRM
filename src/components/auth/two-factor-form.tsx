"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "@untitledui/icons";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/base/buttons/button";
import { Form } from "@/components/base/form/form";
import { twoFactorSchema, type TwoFactorFormData } from "@/lib/validations/auth";
import { useAuthStore } from "@/stores/auth-store";
import { OTPInput } from "./otp-input";

interface TwoFactorFormProps {
    onSubmit: (data: TwoFactorFormData) => Promise<void>;
    onResend: () => Promise<void>;
    isLoading?: boolean;
    error?: string | null;
}

export function TwoFactorForm({ onSubmit, onResend, isLoading, error }: TwoFactorFormProps) {
    const { setStep, email } = useAuthStore();
    const [code, setCode] = useState("");
    const [resendTimer, setResendTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    const {
        handleSubmit,
        setValue,
        formState: { errors },
        setError,
        clearErrors,
    } = useForm<TwoFactorFormData>({
        resolver: zodResolver(twoFactorSchema),
        mode: "onChange",
    });

    // Update form value when code changes
    useEffect(() => {
        setValue("code", code);
        if (code.length === 6) {
            clearErrors("code");
        }
    }, [code, setValue, clearErrors]);

    // Resend timer countdown
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [resendTimer]);

    const handleResend = async () => {
        try {
            await onResend();
            setResendTimer(60);
            setCanResend(false);
            setCode("");
        } catch {
            // Error handled by parent
        }
    };

    // Auto-submit when code is complete
    useEffect(() => {
        if (code.length === 6 && !isLoading) {
            handleSubmit(onSubmit)();
        }
    }, [code, isLoading, handleSubmit, onSubmit]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
        >
            {/* Back button */}
            <button
                type="button"
                onClick={() => setStep("login")}
                className="mb-6 flex items-center gap-2 text-sm text-tertiary hover:text-tertiary_hover transition-colors"
            >
                <ArrowLeft className="size-4" />
                Back to sign in
            </button>

            <Form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
            >
                {/* Error alert */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="rounded-lg border border-error-subtle bg-error-primary/10 p-4"
                        role="alert"
                        aria-live="polite"
                    >
                        <p className="text-sm text-error-primary">{error}</p>
                    </motion.div>
                )}

                <div className="text-center">
                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-brand-primary/10">
                        <svg className="size-8 text-brand-solid" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-primary">Two-factor authentication</h2>
                    <p className="mt-2 text-sm text-tertiary">
                        Enter the 6-digit code sent to{" "}
                        <span className="font-medium text-secondary">{email}</span>
                    </p>
                </div>

                {/* OTP Input */}
                <div className="flex flex-col items-center gap-4">
                    <OTPInput
                        length={6}
                        value={code}
                        onChange={setCode}
                        isInvalid={!!errors.code || !!error}
                        isDisabled={isLoading}
                    />
                    {errors.code && (
                        <p className="text-sm text-error-primary">{errors.code.message}</p>
                    )}
                </div>

                {/* Resend code */}
                <div className="text-center">
                    {canResend ? (
                        <button
                            type="button"
                            onClick={handleResend}
                            className="text-sm font-medium text-brand-secondary hover:text-brand-secondary_hover transition-colors"
                        >
                            Resend code
                        </button>
                    ) : (
                        <p className="text-sm text-tertiary">
                            Resend code in{" "}
                            <span className="font-medium text-secondary">{resendTimer}s</span>
                        </p>
                    )}
                </div>

                {/* Submit button (shown only if not auto-submitting) */}
                <Button
                    type="submit"
                    color="primary"
                    size="lg"
                    className="w-full"
                    isLoading={isLoading}
                    isDisabled={code.length < 6 || isLoading}
                >
                    Verify code
                </Button>
            </Form>
        </motion.div>
    );
}
