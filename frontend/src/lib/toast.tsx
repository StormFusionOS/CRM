import React, { createContext, useContext, useState } from "react";

export interface ToastMessage {
  id: number;
  type: "success" | "error";
  message: string;
}

interface ToastContextValue {
  messages: ToastMessage[];
  addToast: (message: Omit<ToastMessage, "id">) => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  const addToast = (toast: Omit<ToastMessage, "id">) => {
    setMessages((current) => [...current, { ...toast, id: Date.now() }]);
  };
  const removeToast = (id: number) => {
    setMessages((current) => current.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ messages, addToast, removeToast }}>
      {children}
      <div role="status" aria-label="toast-container">
        {messages.map((toast) => (
          <div key={toast.id} role="alert">
            <span>{toast.type}</span>
            <p>{toast.message}</p>
            <button type="button" onClick={() => removeToast(toast.id)}>
              Dismiss
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
};
