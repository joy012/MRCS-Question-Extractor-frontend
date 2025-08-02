import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast Provider Component
export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAll = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAll }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Toast Container Component
const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

// Individual Toast Item Component
const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
  const { removeToast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  // Auto-dismiss toast after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      handleRemove();
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.duration]);

  // Animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => {
      removeToast(toast.id);
    }, 200);
  };

  const getToastStyles = () => {
    const baseStyles = "flex items-start gap-3 p-4 rounded-lg border shadow-lg transition-all duration-200 transform";

    if (isLeaving) {
      return cn(baseStyles, "translate-x-full opacity-0");
    }

    if (!isVisible) {
      return cn(baseStyles, "translate-x-full opacity-0");
    }

    const variantStyles = {
      success: "bg-green-50 border-green-200 text-green-800",
      error: "bg-red-50 border-red-200 text-red-800",
      warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
      info: "bg-blue-50 border-blue-200 text-blue-800",
    };

    return cn(baseStyles, "translate-x-0 opacity-100", variantStyles[toast.type]);
  };

  const getIcon = () => {
    const iconProps = { className: "h-5 w-5 flex-shrink-0 mt-0.5" };

    switch (toast.type) {
      case 'success':
        return <CheckCircle {...iconProps} className={cn(iconProps.className, "text-green-600")} />;
      case 'error':
        return <AlertCircle {...iconProps} className={cn(iconProps.className, "text-red-600")} />;
      case 'warning':
        return <AlertTriangle {...iconProps} className={cn(iconProps.className, "text-yellow-600")} />;
      case 'info':
        return <Info {...iconProps} className={cn(iconProps.className, "text-blue-600")} />;
      default:
        return <Info {...iconProps} />;
    }
  };

  return (
    <div className={getToastStyles()}>
      {getIcon()}

      <div className="flex-1 space-y-1">
        <div className="font-medium text-sm">
          {toast.title}
        </div>
        {toast.description && (
          <div className="text-sm opacity-90">
            {toast.description}
          </div>
        )}
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="text-sm font-medium underline hover:no-underline mt-2"
          >
            {toast.action.label}
          </button>
        )}
      </div>

      <button
        onClick={handleRemove}
        className="flex-shrink-0 p-1 rounded-md hover:bg-black/10 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

// Convenience hooks for different toast types
export const useToastHelpers = () => {
  const { addToast } = useToast();

  const success = (title: string, description?: string, options?: Partial<Toast>) => {
    addToast({ type: 'success', title, description, ...options });
  };

  const error = (title: string, description?: string, options?: Partial<Toast>) => {
    addToast({ type: 'error', title, description, ...options });
  };

  const warning = (title: string, description?: string, options?: Partial<Toast>) => {
    addToast({ type: 'warning', title, description, ...options });
  };

  const info = (title: string, description?: string, options?: Partial<Toast>) => {
    addToast({ type: 'info', title, description, ...options });
  };

  return { success, error, warning, info };
};
