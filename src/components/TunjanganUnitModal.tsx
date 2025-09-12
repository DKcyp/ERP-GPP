import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';

interface TunjanganUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TunjanganUnitFormData) => void;
}

export interface TunjanganUnitFormData {
  namaTunjangan: string;
  kualifikasi: string;
  nominalTunjangan: string;
  satuan: 'Unit';
}

const TunjanganUnitModal: React.FC<TunjanganUnitModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<TunjanganUnitFormData>({
    namaTunjangan: '',
    kualifikasi: '',
    nominalTunjangan: '',
    satuan: 'Unit',
  });

  const [errors, setErrors] = useState<Partial<TunjanganUnitFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  // no external options required in this simplified modal

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

  const validateForm = (): boolean => {
    const newErrors: Partial<TunjanganUnitFormData> = {};
    if (!formData.namaTunjangan.trim()) newErrors.namaTunjangan = 'Nama Tunjangan wajib diisi';
    if (!formData.kualifikasi.trim()) newErrors.kualifikasi = 'Kualifikasi wajib diisi';
    if (!formData.nominalTunjangan.trim()) newErrors.nominalTunjangan = 'Nominal Tunjangan wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof TunjanganUnitFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSave(formData);
    setIsLoading(false);
    
    // Reset form
    setFormData({
      namaTunjangan: '',
      kualifikasi: '',
      nominalTunjangan: '',
      satuan: 'Unit',
    });
    setErrors({});
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">Entry Tunjangan</h2>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Nama Tunjangan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nama Tunjangan <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.namaTunjangan}
                  onChange={(e) => handleInputChange('namaTunjangan', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.namaTunjangan ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                  placeholder="Contoh: Tunjangan Unit"
                />
              </div>

              {/* Kualifikasi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kualifikasi <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.kualifikasi}
                  onChange={(e) => handleInputChange('kualifikasi', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.kualifikasi ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                  placeholder="Contoh: Teknisi Unit"
                />
              </div>

              {/* Nominal Tunjangan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nominal Tunjangan <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={formData.nominalTunjangan}
                  onChange={(e) => handleInputChange('nominalTunjangan', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.nominalTunjangan ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                  placeholder="Contoh: Rp 150.000"
                />
              </div>

              {/* Satuan (fixed Unit) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Satuan</label>
                <input type="text" value={formData.satuan} readOnly className="w-full px-4 py-3 border rounded-xl bg-gray-100 text-gray-700" />
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
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Save changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TunjanganUnitModal;
