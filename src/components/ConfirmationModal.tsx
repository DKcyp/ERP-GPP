import React from "react";
import { X, AlertTriangle } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  showNoteInput?: boolean; // New prop for conditional note input
  note?: string; // New prop for note value
  onNoteChange?: (note: string) => void; // New prop for note change handler
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  showNoteInput = false, // Default to false
  note = "",
  onNoteChange,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all duration-300 ease-out scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-4 border-b border-border mb-4">
          <h3 className="text-xl font-semibold text-text flex items-center">
            <AlertTriangle className="h-6 w-6 text-yellow-500 mr-2" /> {title}
          </h3>
          <button
            onClick={onClose}
            className="text-textSecondary hover:text-text transition-colors duration-200"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="text-textSecondary mb-6">
          <p>{message}</p>
          {showNoteInput && (
            <div className="mt-4">
              <label
                htmlFor="rejectionNote"
                className="block text-sm font-medium text-text mb-2"
              >
                Catatan Penolakan:
              </label>
              <textarea
                id="rejectionNote"
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg shadow-sm focus:ring-primary focus:border-primary text-sm text-text bg-background"
                placeholder="Masukkan catatan penolakan..."
                value={note}
                onChange={(e) => onNoteChange && onNoteChange(e.target.value)}
              ></textarea>
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
