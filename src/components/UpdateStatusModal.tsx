import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, ChevronDown } from 'lucide-react';
import { UpdateStatusFormData, LamaranData } from '../types';

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: UpdateStatusFormData) => void;
  initialData: LamaranData | null;
  isEditable: boolean;
}

const statusOptions: Array<UpdateStatusFormData['status']> = ['Pending', 'Accepted', 'Rejected', 'Interview', 'Hired'];

const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  isEditable,
}) => {
  const [formData, setFormData] = useState<UpdateStatusFormData>({
    status: 'Pending',
    keterangan: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        status: initialData.status,
        keterangan: initialData.keterangan,
      });
    } else if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        status: 'Pending',
        keterangan: '',
      });
    }

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
  }, [isOpen, onClose, initialData]);

  const handleInputChange = (field: keyof UpdateStatusFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialData || !isEditable) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

    onSave(initialData.id, formData);

    setIsLoading(false);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">Update Status</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Status Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => isEditable && setStatusDropdownOpen(!statusDropdownOpen)}
                  className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 flex items-center justify-between bg-white text-sm ${
                    isEditable
                      ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                      : 'border-gray-200 bg-gray-50 text-gray-700 cursor-not-allowed'
                  }`}
                  disabled={!isEditable}
                >
                  <span className="text-gray-900">{formData.status}</span>
                  {isEditable && <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${statusDropdownOpen ? 'rotate-180' : ''}`} />}
                </button>

                {isEditable && statusDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg z-50 overflow-hidden">
                    {statusOptions.map((status) => (
                      <button
                        type="button"
                        key={status}
                        onClick={() => {
                          handleInputChange('status', status);
                          setStatusDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-sm"
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Keterangan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keterangan
              </label>
              <textarea
                value={formData.keterangan}
                onChange={(e) => handleInputChange('keterangan', e.target.value)}
                rows={3}
                className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 ${
                  isEditable
                    ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    : 'border-gray-200 bg-gray-50 text-gray-700 cursor-not-allowed'
                }`}
                placeholder="Tambahkan keterangan..."
                disabled={!isEditable}
              ></textarea>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
          >
            Close
          </button>
          {isEditable && (
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  <span>Simpan</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
