import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { ApprovalPOTrainingActionData } from '../types';

interface ApprovalPOTrainingActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: ApprovalPOTrainingActionData) => void;
  poTrainingId: string | null;
  actionType: 'approve' | 'reject' | null;
}

const ApprovalPOTrainingActionModal: React.FC<ApprovalPOTrainingActionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  poTrainingId,
  actionType,
}) => {
  const [keterangan, setKeterangan] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setKeterangan(''); // Reset keterangan when modal closes
    }
  }, [isOpen]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!poTrainingId || !actionType) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    onConfirm({ poTrainingId, action: actionType, keterangan });
    setIsLoading(false);
    onClose();
  };

  if (!isOpen || !poTrainingId || !actionType) return null;

  const title = actionType === 'approve' ? 'Approve PO Training' : 'Reject PO Training';
  const confirmButtonText = actionType === 'approve' ? 'Approve' : 'Reject';
  const confirmButtonColor = actionType === 'approve' ? 'bg-green-600 hover:bg-green-700 hover:shadow-green-600/25' : 'bg-red-600 hover:bg-red-700 hover:shadow-red-600/25';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div>
            <label htmlFor="keterangan" className="block text-sm font-medium text-gray-700 mb-2">
              Keterangan
            </label>
            <textarea
              id="keterangan"
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Masukkan keterangan..."
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
            ></textarea>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
          >
            Close
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className={`px-4 py-2 text-white rounded-lg shadow-lg transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm ${confirmButtonColor}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{confirmButtonText}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalPOTrainingActionModal;
