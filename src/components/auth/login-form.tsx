"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail01, Key01 } from "@untitledui/icons";
import { motion } from "motion/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/base/buttons/button";
import { Form } from "@/components/base/form/form";
import { Input } from "@/components/base/input/input";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { useAuthStore } from "@/stores/auth-store";

interface LoginFormProps {
    onSubmit: (data: LoginFormData) => Promise<void>;
    isLoading?: boolean;
    error?: string | null;
}

export function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
    const setStep = useAuthStore((state) => state.setStep);
    const [showPassword, setShowPassword] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: "onBlur",
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
        >
            <Form
                onSubmit={handleSubmit(onSubmit)}
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

                {/* Password field */}
                <div className="space-y-1.5">
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                label="Password"
                                placeholder="Enter your password"
                                icon={Key01}
                                size="md"
                                isRequired
                                isInvalid={!!errors.password}
                                hint={errors.password?.message}
                                isDisabled={isLoading}
                                autoComplete="current-password"
                            />
                        )}
                    />

                    {/* Forgot password link */}
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-sm text-brand-secondary hover:text-brand-secondary_hover transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? "Hide" : "Show"} password
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep("forgot-password")}
                            className="text-sm font-medium text-brand-secondary hover:text-brand-secondary_hover transition-colors"
                        >
                            Forgot password?
                        </button>
                    </div>
                </div>

                {/* Submit button */}
                <Button
                    type="submit"
                    color="primary"
                    size="lg"
                    className="w-full"
                    isLoading={isLoading}
                    isDisabled={isLoading}
                >
                    Sign in
                </Button>
            </Form>
        </motion.div>
    );
}
