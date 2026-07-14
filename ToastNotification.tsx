import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ShoppingCart, Flame, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'cart-add' | 'info';
}

interface ToastNotificationProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({
  toasts,
  onDismiss,
}) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 w-full max-w-sm px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3500);

    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'cart-add':
        return <ShoppingCart className="w-4 h-4 text-[#ff5e00]" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Flame className="w-4 h-4 text-orange-400" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'cart-add':
        return 'border-[#ff5e00]/40';
      case 'success':
        return 'border-emerald-500/40';
      default:
        return 'border-zinc-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
      className={`bg-[#121214] border ${getBorderColor()} p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-xl backdrop-blur-md`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="p-2 bg-zinc-950 rounded-xl flex-shrink-0 flex items-center justify-center">
          {getIcon()}
        </div>
        <p className="text-xs font-mono font-semibold text-zinc-100 truncate pr-2">
          {toast.message}
        </p>
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className="text-zinc-500 hover:text-white p-1 rounded-lg transition"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
};
