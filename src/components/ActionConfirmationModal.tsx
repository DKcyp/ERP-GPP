import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';

interface ActionConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  actionType: 'approve' | 'reject' | 'delete';
}

const ActionConfirmationModal: React.FC<ActionConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title,
  message,
  confirmText = "Confirm",
  actionType
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  if (!isOpen) return null;

  const theme = {
    approve: {
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      buttonClass: "bg-green-600 hover:bg-green-700",
      headerBg: "from-green-50 to-white",
    },
    reject: {
      icon: <X className="h-5 w-5 text-red-600" />,
      buttonClass: "bg-red-600 hover:bg-red-700",
      headerBg: "from-red-50 to-white",
    },
    delete: {
      icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
      buttonClass: "bg-red-600 hover:bg-red-700",
      headerBg: "from-red-50 to-white",
    }
  };

  const currentTheme = theme[actionType];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        <div className={`flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r ${currentTheme.headerBg}`}>
          <div className="flex items-center space-x-3">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center bg-opacity-20`}>
              {currentTheme.icon}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-center text-gray-700">{message}</p>
        </div>

        <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`px-4 py-2 text-white rounded-lg transition-all duration-200 font-medium text-sm ${currentTheme.buttonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionConfirmationModal;
