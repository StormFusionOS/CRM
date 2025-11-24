"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail01, ArrowLeft } from "@untitledui/icons";
import { motion } from "motion/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/base/buttons/button";
import { Form } from "@/components/base/form/form";
import { Input } from "@/components/base/input/input";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/validations/auth";
import { useAuthStore } from "@/stores/auth-store";

interface ForgotPasswordFormProps {
    onSubmit: (data: ForgotPasswordFormData) => Promise<void>;
    isLoading?: boolean;
    error?: string | null;
}

export function ForgotPasswordForm({ onSubmit, isLoading, error }: ForgotPasswordFormProps) {
    const setStep = useAuthStore((state) => state.setStep);
    const [submitted, setSubmitted] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: "onBlur",
    });

    const handleFormSubmit = async (data: ForgotPasswordFormData) => {
        await onSubmit(data);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
            >
                {/* Success state */}
                <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-success-primary/10">
                    <svg className="size-8 text-success-solid" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h3 className="mb-2 text-xl font-semibold text-primary">Check your email</h3>
                <p className="mb-6 text-tertiary">
                    If an account exists with that email, you'll receive password reset instructions shortly.
                </p>

                <Button
                    type="button"
                    color="link-color"
                    onClick={() => {
                        setSubmitted(false);
                        setStep("login");
                    }}
                    iconLeading={ArrowLeft}
                >
                    Back to sign in
                </Button>
            </motion.div>
        );
    }

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
                onSubmit={handleSubmit(handleFormSubmit)}
                className="space-y-5"
                validationErrors={errors}
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
                    <h2 className="text-2xl font-semibold text-primary">Forgot password?</h2>
                    <p className="mt-2 text-sm text-tertiary">
                        No worries, we'll send you reset instructions.
                    </p>
                </div>

                {/* Email field */}
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            type="email"
                            label="Email"
                            placeholder="you@company.com"
                            icon={Mail01}
                            size="md"
                            isRequired
                            isInvalid={!!errors.email}
                            hint={errors.email?.message}
                            isDisabled={isLoading}
                            autoComplete="email"
                            autoFocus
                        />
                    )}
                />

                {/* Submit button */}
                <Button
                    type="submit"
                    color="primary"
                    size="lg"
                    className="w-full"
                    isLoading={isLoading}
                    isDisabled={isLoading}
                >
                    Reset password
                </Button>
            </Form>
        </motion.div>
    );
}
