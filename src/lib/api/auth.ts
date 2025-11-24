// Mock API client for authentication
// In production, replace with actual API calls

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    requires2FA?: boolean;
    token?: string;
    user?: {
        id: string;
        email: string;
        name: string;
    };
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ForgotPasswordResponse {
    success: boolean;
    message: string;
}

export interface Verify2FARequest {
    code: string;
}

export interface Verify2FAResponse {
    success: boolean;
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
}

// Simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authApi = {
    async login(data: LoginRequest): Promise<LoginResponse> {
        await delay(1000);

        // Mock login logic
        if (data.email === "admin@example.com" && data.password === "password123") {
            // Simulate 2FA requirement
            return {
                success: true,
                requires2FA: true,
            };
        }

        if (data.email === "user@example.com" && data.password === "password123") {
            // Direct login without 2FA
            return {
                success: true,
                token: "mock-jwt-token",
                user: {
                    id: "1",
                    email: data.email,
                    name: "Test User",
                },
            };
        }

        throw new Error("Invalid email or password");
    },

    async forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
        await delay(1000);

        // Always return success (don't reveal if email exists)
        return {
            success: true,
            message: "If an account exists, you'll receive reset instructions.",
        };
    },

    async verify2FA(data: Verify2FARequest): Promise<Verify2FAResponse> {
        await delay(1000);

        // Mock 2FA verification
        if (data.code === "123456") {
            return {
                success: true,
                token: "mock-jwt-token-2fa",
                user: {
                    id: "1",
                    email: "admin@example.com",
                    name: "Admin User",
                },
            };
        }

        throw new Error("Invalid verification code");
    },

    async resend2FA(): Promise<void> {
        await delay(500);
        // Mock resend logic
        console.log("2FA code resent");
    },
};
