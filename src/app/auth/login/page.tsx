import type { Metadata } from "next";
import { AuthContainer } from "@/components/auth/auth-container";
import { AuthLayout } from "@/components/auth/auth-layout";

export const metadata: Metadata = {
    title: "Sign In | Home Service SaaS",
    description: "Sign in to your Home Service SaaS account",
};

export default function LoginPage() {
    return (
        <AuthLayout>
            <AuthContainer />
        </AuthLayout>
    );
}
