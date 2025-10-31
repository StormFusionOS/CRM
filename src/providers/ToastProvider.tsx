import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

interface Toast extends Required<ToastOptions> {
  id: number;
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const defaultDuration = 4000;
const palette: Record<ToastType, string> = {
  success: "#0f766e",
  error: "#b91c1c",
  info: "#1d4ed8",
  warning: "#b45309",
};

export const ToastProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (options: ToastOptions) => {
      const id = Date.now();
      const toast: Toast = {
        id,
        message: options.message,
        type: options.type ?? "info",
        duration: options.duration ?? defaultDuration,
      };
      setToasts((current) => [...current, toast]);
      const timer = typeof window !== "undefined" ? window.setTimeout : setTimeout;
      timer(() => removeToast(id), toast.duration);
    },
    [removeToast],
  );

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="assertive"
        style={{
          position: "fixed",
          inset: "1rem auto auto 50%",
          transform: "translateX(-50%)",
          display: "grid",
          gap: "0.5rem",
          zIndex: 1000,
        }}
      >
        {toasts.map((toast) => (
          <button
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            style={{
              border: "none",
              borderRadius: 8,
              padding: "0.75rem 1rem",
              color: "white",
              backgroundColor: palette[toast.type],
              boxShadow: "0 10px 20px rgba(15, 23, 42, 0.15)",
              cursor: "pointer",
              fontWeight: 500,
              textAlign: "left",
            }}
          >
            {toast.message}
          </button>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export default ToastProvider;
