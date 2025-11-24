'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient, ApiError } from './api-client';

interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
}

interface Company {
    id: string;
    name: string;
    subdomain: string;
}

interface AuthContextType {
    user: User | null;
    company: Company | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

interface RegisterData {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    companyName: string;
    subdomain: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [company, setCompany] = useState<Company | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load user on mount
    useEffect(() => {
        loadUser();
    }, []);

    async function loadUser() {
        try {
            const response = await apiClient.getCurrentUser();
            if (response.success && response.data) {
                setUser(response.data.user);
                setCompany(response.data.company);
            }
        } catch (error) {
            // Token invalid or expired, clear state
            setUser(null);
            setCompany(null);
        } finally {
            setIsLoading(false);
        }
    }

    async function login(email: string, password: string) {
        try {
            const response = await apiClient.login({ email, password });

            if (response.success && response.data) {
                setUser(response.data.user);
                setCompany(response.data.company);
            } else {
                throw new Error(response.error || 'Login failed');
            }
        } catch (error) {
            if (error instanceof ApiError) {
                throw new Error(error.message);
            }
            throw error;
        }
    }

    async function register(data: RegisterData) {
        try {
            const response = await apiClient.register(data);

            if (response.success && response.data) {
                setUser(response.data.user);
                setCompany(response.data.company);
            } else {
                throw new Error(response.error || 'Registration failed');
            }
        } catch (error) {
            if (error instanceof ApiError) {
                throw new Error(error.message);
            }
            throw error;
        }
    }

    function logout() {
        apiClient.logout();
        setUser(null);
        setCompany(null);
    }

    async function refreshUser() {
        await loadUser();
    }

    const value: AuthContextType = {
        user,
        company,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
