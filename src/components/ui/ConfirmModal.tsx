import React from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  type?: 'default' | 'danger' | 'success' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'default',
  onConfirm,
  onCancel,
  isLoading = false,
  children,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const iconMap = {
    default: <Info className="w-6 h-6 text-blue-600" />,
    warning: <AlertTriangle className="w-6 h-6 text-amber-600" />,
    danger: <AlertTriangle className="w-6 h-6 text-red-600" />,
    success: <CheckCircle className="w-6 h-6 text-forest-600" />,
  };

  const confirmColorMap = {
    default: 'bg-forest-600 hover:bg-forest-700 text-white',
    warning: 'bg-amber-600 hover:bg-amber-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-forest-600 hover:bg-forest-700 text-white',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-100 relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-full bg-gray-50 border border-gray-100 shrink-0">
            {iconMap[type]}
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
            <div className="text-sm text-gray-600 leading-relaxed mb-4">
              {description}
            </div>

            {children && <div className="mb-4">{children}</div>}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={cn('px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm', confirmColorMap[type])}
              >
                {isLoading ? 'Processing...' : confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
