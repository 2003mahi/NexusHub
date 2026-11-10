'use client';

import React, { useEffect } from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function Toast({ toasts, onDismiss }: ToastProps) {
  useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      onDismiss(toasts[0].id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border backdrop-blur-xl shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-3 ${
              isSuccess
                ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200'
                : isError
                ? 'bg-rose-950/80 border-rose-500/30 text-rose-200'
                : 'bg-indigo-950/80 border-indigo-500/30 text-indigo-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">
                {isSuccess ? '✓' : isError ? '⚠️' : 'ℹ️'}
              </span>
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="ml-3 text-white/50 hover:text-white text-xs px-1.5 py-0.5 rounded hover:bg-white/10 transition-colors"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
