import React, { useState } from "react";
import { X, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  isReject?: boolean; // If true, show reason input
  confirmButtonColor?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  isReject = false,
  confirmButtonColor = "bg-green-600 hover:bg-green-700",
}) => {
  const [rejectReason, setRejectReason] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(isReject ? rejectReason : undefined);
    setRejectReason(""); // Reset reason on close
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-gray-700 mb-4">{message}</p>

          {isReject && (
            <div className="mb-4">
              <label
                htmlFor="reject-reason"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Alasan Penolakan:
              </label>
              <textarea
                id="reject-reason"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Masukkan alasan penolakan..."
              ></textarea>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`px-4 py-2 text-white rounded-lg transition-colors duration-200 ${confirmButtonColor}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
