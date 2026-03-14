'use client';

import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

type ToastType = 'success' | 'error';

interface ToastMessage {
  id: number;
  text: string;
  type: ToastType;
  exiting: boolean;
}

type ToastContextType = {
  showToast: (text: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const nextId = useRef(0);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  const showToast = useCallback((text: string, type: ToastType = 'success') => {
    const id = nextId.current++;
    setToasts((prev) => [...prev, { id, text, type, exiting: false }]);

    // Start exit animation after 2.5s
    const exitTimer = setTimeout(() => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
      );
      // Remove after exit animation (300ms)
      const removeTimer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        timersRef.current.delete(id);
      }, 300);
      timersRef.current.set(id, removeTimer);
    }, 2500);
    timersRef.current.set(id, exitTimer);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-2.5 rounded-lg text-sm font-medium shadow-lg backdrop-blur-sm ${
              toast.type === 'error'
                ? 'bg-error/90 text-white'
                : 'bg-elevated/95 text-primary border border-border-subtle'
            }`}
            style={{
              animation: toast.exiting
                ? 'toast-out 300ms var(--ease-default) forwards'
                : 'toast-in 300ms var(--ease-out) forwards',
            }}
          >
            {toast.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
