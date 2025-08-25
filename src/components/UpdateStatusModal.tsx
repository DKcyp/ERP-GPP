import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UpdateStatusFormData) => void;
  currentItem?: {
    id: string;
    namaClient: string;
    statusPenawaran: string;
  } | null;
}

export interface UpdateStatusFormData {
  status: string;
  keterangan: string;
}

interface StatusHistory {
  no: number;
  terakhirUpdate: string;
  status: 'Deal' | 'Cancel';
}

const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({ isOpen, onClose, onSave, currentItem }) => {
  const [formData, setFormData] = useState<UpdateStatusFormData>({
    status: '',
    keterangan: ''
  });

  const [statusHistory] = useState<StatusHistory[]>([
    {
      no: 1,
      terakhirUpdate: '01-01-2025',
      status: 'Deal'
    },
    {
      no: 2,
      terakhirUpdate: '01-01-2025',
      status: 'Deal'
    },
    {
      no: 3,
      terakhirUpdate: '01-01-2025',
      status: 'Cancel'
    }
  ]);

  const statusOptions = ['Deal', 'Pending', 'Cancel'];

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      
      // Set current status when modal opens
      if (currentItem) {
        setFormData(prev => ({
          ...prev,
          status: currentItem.statusPenawaran
        }));
      }
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, currentItem]);

  const handleInputChange = (field: keyof UpdateStatusFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    
    // Reset form
    setFormData({
      status: '',
      keterangan: ''
    });
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Deal': return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancel': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-xl font-bold text-gray-900">Update Status Penawaran</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-160px)]">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Status Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Pilih Status</option>
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              {/* Keterangan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keterangan
                </label>
                <textarea
                  value={formData.keterangan}
                  onChange={(e) => handleInputChange('keterangan', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Masukkan keterangan..."
                />
              </div>

              {/* Status History Table */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Riwayat Status</h3>
                <div className="overflow-hidden border border-gray-200 rounded-xl">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">No</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Terakhir Update</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {statusHistory.map((item) => (
                        <tr key={item.no} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-900">{item.no}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{item.terakhirUpdate}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
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
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200 font-medium flex items-center space-x-2 text-sm"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Simpan</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatusModal;
