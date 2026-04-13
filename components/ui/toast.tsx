"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  autoDismiss?: boolean;
}

interface ToastOptions {
  duration?: number;
  autoDismiss?: boolean;
}

interface ToastContextType {
  toast: {
    success: (message: string, options?: ToastOptions) => void;
    error: (message: string, options?: ToastOptions) => void;
    warning: (message: string, options?: ToastOptions) => void;
    info: (message: string, options?: ToastOptions) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context.toast;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType, options?: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { 
      id, 
      message, 
      type, 
      duration: options?.duration ?? 3000,
      autoDismiss: options?.autoDismiss ?? true
    }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toastHandlers = {
    success: (msg: string, opt?: ToastOptions) => addToast(msg, "success", opt),
    error: (msg: string, opt?: ToastOptions) => addToast(msg, "error", opt),
    warning: (msg: string, opt?: ToastOptions) => addToast(msg, "warning", opt),
    info: (msg: string, opt?: ToastOptions) => addToast(msg, "info", opt),
  };

  return (
    <ToastContext.Provider value={{ toast: toastHandlers }}>
      {children}
      <div className="fixed top-24 right-6 z-[9999] flex flex-col gap-4 pointer-events-none items-end">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const { type, message } = toast;
  const duration = toast.duration || 3000;

  useEffect(() => {
    if (!toast.autoDismiss) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration, toast.autoDismiss]);

  const config = {
    success: {
      bg: "#16a34a",
      icon: <CheckCircle2 className="w-5 h-5 text-white" />,
    },
    error: {
      bg: "#ef4444",
      icon: <AlertCircle className="w-5 h-5 text-white" />,
    },
    warning: {
      bg: "#f59e0b",
      icon: <AlertTriangle className="w-5 h-5 text-white" />,
    },
    info: {
      bg: "#3b82f6",
      icon: <Info className="w-5 h-5 text-white" />,
    },
  }[type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100, transition: { duration: 0.15 } }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="w-[300px] bg-white rounded-[10px] shadow-[0_4px_24px_rgba(0,0,0,0.10)] overflow-hidden pointer-events-auto flex flex-col relative"
    >
      <div className="flex items-center gap-3 p-[14px_18px]">
        <div 
          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: config.bg }}
        >
          {config.icon}
        </div>
        
        <p className="text-[14px] font-medium text-[#1e293b] leading-tight flex-grow truncate">
          {message}
        </p>

        <button 
          onClick={onClose}
          className="text-[#94a3b8] hover:text-[#1e293b] transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {toast.autoDismiss && (
        <div className="h-[3px] w-full bg-slate-50 relative rounded-b-[10px] overflow-hidden">
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: duration / 1000, ease: "linear" }}
            className="h-full"
            style={{ backgroundColor: config.bg }}
          />
        </div>
      )}
    </motion.div>
  );
}
