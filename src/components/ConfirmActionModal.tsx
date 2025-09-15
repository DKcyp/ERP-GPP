import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  confirmColor?: "red" | "green" | "blue" | "yellow";
  Icon?: React.ComponentType<{ className?: string }>;
}

const colorClasses: Record<NonNullable<ConfirmActionModalProps["confirmColor"]>, { bg: string; hover: string; shadow: string; iconBg: string; iconText: string; headerFrom: string; } > = {
  red: {
    bg: "bg-red-600",
    hover: "hover:bg-red-700",
    shadow: "hover:shadow-lg hover:shadow-red-600/25",
    iconBg: "bg-red-100",
    iconText: "text-red-600",
    headerFrom: "from-red-50",
  },
  green: {
    bg: "bg-green-600",
    hover: "hover:bg-green-700",
    shadow: "hover:shadow-lg hover:shadow-green-600/25",
    iconBg: "bg-green-100",
    iconText: "text-green-600",
    headerFrom: "from-green-50",
  },
  blue: {
    bg: "bg-blue-600",
    hover: "hover:bg-blue-700",
    shadow: "hover:shadow-lg hover:shadow-blue-600/25",
    iconBg: "bg-blue-100",
    iconText: "text-blue-600",
    headerFrom: "from-blue-50",
  },
  yellow: {
    bg: "bg-yellow-600",
    hover: "hover:bg-yellow-700",
    shadow: "hover:shadow-lg hover:shadow-yellow-600/25",
    iconBg: "bg-yellow-100",
    iconText: "text-yellow-600",
    headerFrom: "from-yellow-50",
  },
};

const ConfirmActionModal: React.FC<ConfirmActionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  confirmColor = "blue",
  Icon,
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const colors = colorClasses[confirmColor];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r ${colors.headerFrom} to-white`}>
          <div className="flex items-center space-x-3">
            {Icon && (
              <div className={`h-10 w-10 ${colors.iconBg} rounded-full flex items-center justify-center`}>
                <Icon className={`h-5 w-5 ${colors.iconText}`} />
              </div>
            )}
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center">
            <p className="text-lg text-gray-900">{message}</p>
          </div>
        </div>

        {/* Footer */}
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
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 ${colors.bg} text-white rounded-lg ${colors.hover} ${colors.shadow} transition-all duration-200 font-medium text-sm`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmActionModal;
