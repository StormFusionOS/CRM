import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { apiClient, setAuthToken } from "../services/api";
import type { AuthState, AuthUser, UserRole } from "../types/auth";

interface DecodedToken {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
  exp: number;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "crm_admin_token";

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<AuthState>({ user: null, token: null });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    const storedToken = window.localStorage.getItem(TOKEN_KEY);
    if (storedToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(storedToken);
        if (decoded.exp * 1000 > Date.now()) {
          const user: AuthUser = {
            id: decoded.sub,
            email: decoded.email,
            name: decoded.name,
            role: decoded.role
          };
          setState({ token: storedToken, user });
          setAuthToken(storedToken);
        } else {
          window.localStorage.removeItem(TOKEN_KEY);
        }
      } catch (error) {
        console.error("Failed to decode token", error);
        window.localStorage.removeItem(TOKEN_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post<{ token: string }>("/auth/login", { email, password });
      const token = response.data.token;
      const decoded = jwtDecode<DecodedToken>(token);
      const user: AuthUser = {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role
      };
      if (typeof window !== "undefined") {
        window.localStorage.setItem(TOKEN_KEY, token);
      }
      setAuthToken(token);
      setState({ token, user });
      navigate("/");
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(TOKEN_KEY);
    }
    setAuthToken(null);
    setState({ user: null, token: null });
    navigate("/login");
  }, [navigate]);

  const value = useMemo(() => ({ ...state, login, logout, isLoading }), [state, login, logout, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
