import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

interface Toast extends ToastOptions {
  id: number;
}

interface ToastContextValue {
  toasts: Toast[];
  toast: (options: ToastOptions) => void;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToasterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((options: ToastOptions) => {
    setToasts((prev) => [...prev, { id: Date.now(), ...options }]);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const value = useMemo(() => ({ toasts, toast, dismiss }), [toasts, toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex w-80 flex-col gap-3">
        {toasts.map((toastItem) => (
          <button
            key={toastItem.id}
            type="button"
            onClick={() => dismiss(toastItem.id)}
            className={cn(
              'rounded-md border border-border bg-background p-4 text-left shadow-lg transition hover:shadow-xl',
              toastItem.variant === 'destructive' && 'border-destructive text-destructive'
            )}
          >
            {toastItem.title && <p className="text-sm font-semibold">{toastItem.title}</p>}
            {toastItem.description && <p className="text-sm text-muted-foreground">{toastItem.description}</p>}
            <p className="mt-2 text-xs text-muted-foreground">Click to dismiss</p>
          </button>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToasterProvider');
  }
  return ctx;
};
