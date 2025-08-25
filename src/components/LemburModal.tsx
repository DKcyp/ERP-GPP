import React, { useState, useEffect } from 'react';
import { X, Calendar, Save, Loader2, ChevronDown } from 'lucide-react';

interface LemburModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: LemburFormData) => void;
}

export interface LemburFormData {
  namaDriver: string;
  jamLembur: string;
  tanggal: string;
  keterangan: string;
}

const LemburModal: React.FC<LemburModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<LemburFormData>({
    namaDriver: '',
    jamLembur: '',
    tanggal: '',
    keterangan: ''
  });

  const [errors, setErrors] = useState<Partial<LemburFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [namaDriverDropdownOpen, setNamaDriverDropdownOpen] = useState(false);

  const namaDriverOptions = [
    'Ahmad',
    'Budi Santoso',
    'Slamet Riyadi',
    'Agus Prasetyo',
    'Rudi Hartono',
    'Fauzan Malik',
    'Joko Widodo',
    'Hariyanto'
  ];

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
    const newErrors: Partial<LemburFormData> = {};

    if (!formData.namaDriver.trim()) {
      newErrors.namaDriver = 'Nama Driver wajib dipilih';
    }

    if (!formData.jamLembur.trim()) {
      newErrors.jamLembur = 'Jam Lembur wajib diisi';
    }

    if (!formData.tanggal) {
      newErrors.tanggal = 'Tanggal wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof LemburFormData, value: string) => {
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
      namaDriver: '',
      jamLembur: '',
      tanggal: '',
      keterangan: ''
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
          <h2 className="text-2xl font-bold text-gray-900">Entry Lembur</h2>
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
              {/* Nama Driver */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Driver <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setNamaDriverDropdownOpen(!namaDriverDropdownOpen)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between bg-white ${
                      errors.namaDriver ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <span className={formData.namaDriver ? 'text-gray-900' : 'text-gray-500'}>
                      {formData.namaDriver || 'Pilih Nama Driver'}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${namaDriverDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {namaDriverDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden max-h-60 overflow-y-auto">
                      {namaDriverOptions.map((driver) => (
                        <button
                          key={driver}
                          type="button"
                          onClick={() => {
                            handleInputChange('namaDriver', driver);
                            setNamaDriverDropdownOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                        >
                          {driver}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.namaDriver && (
                  <p className="mt-1 text-sm text-red-600">{errors.namaDriver}</p>
                )}
              </div>

              {/* Jam Lembur */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jam Lembur <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.jamLembur}
                  onChange={(e) => handleInputChange('jamLembur', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.jamLembur ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="2 Jam"
                />
                {errors.jamLembur && (
                  <p className="mt-1 text-sm text-red-600">{errors.jamLembur}</p>
                )}
              </div>

              {/* Tanggal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => handleInputChange('tanggal', e.target.value)}
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.tanggal ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="dd/mm/yyyy"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.tanggal && (
                  <p className="mt-1 text-sm text-red-600">{errors.tanggal}</p>
                )}
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
                  placeholder="Masukkan keterangan lembur..."
                />
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

export default LemburModal;
