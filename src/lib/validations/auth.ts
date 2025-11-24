import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const twoFactorSchema = z.object({
    code: z.string().length(6, "Code must be 6 digits").regex(/^\d{6}$/, "Code must contain only numbers"),
});

export type TwoFactorFormData = z.infer<typeof twoFactorSchema>;
