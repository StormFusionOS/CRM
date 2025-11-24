"use client";

import { create } from "zustand";

export type AuthStep = "login" | "forgot-password" | "2fa";

interface AuthState {
    step: AuthStep;
    isSubmitting: boolean;
    email: string;
    setStep: (step: AuthStep) => void;
    setIsSubmitting: (isSubmitting: boolean) => void;
    setEmail: (email: string) => void;
    reset: () => void;
}

const initialState = {
    step: "login" as AuthStep,
    isSubmitting: false,
    email: "",
};

export const useAuthStore = create<AuthState>((set) => ({
    ...initialState,
    setStep: (step) => set({ step }),
    setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
    setEmail: (email) => set({ email }),
    reset: () => set(initialState),
}));
