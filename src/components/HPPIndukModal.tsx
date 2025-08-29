import React, { useState, useEffect } from 'react';
import { X, Calendar, Save, Loader2 } from 'lucide-react';

interface HPPIndukModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: HPPIndukFormData) => void;
  initialData?: HPPIndukFormData | null;
  title: string;
}

export interface HPPIndukFormData {
  noHPP: string;
  pic: string;
  jenisPekerjaan: string;
  lokasiPekerjaan: string;
  estimasiNilaiKontrak: string; // This will store the raw numeric string (e.g., "1500000")
}

// Helper functions for Rupiah formatting
const formatRupiah = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined || value === '') return '';
  const stringValue = String(value);
  const cleanValue = stringValue.replace(/[^0-9]/g, ''); // Remove all non-digits
  const num = parseInt(cleanValue, 10);

  if (isNaN(num) || cleanValue === '') {
    return '';
  }

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

const parseRupiah = (value: string): string => {
  return value.replace(/[^0-9]/g, '');
};

const HPPIndukModal: React.FC<HPPIndukModalProps> = ({ isOpen, onClose, onSave, initialData, title }) => {
  const initialEmptyFormData: HPPIndukFormData = {
    noHPP: '',
    pic: '',
    jenisPekerjaan: '',
    lokasiPekerjaan: '',
    estimasiNilaiKontrak: '',
  };

  const [formData, setFormData] = useState<HPPIndukFormData>(initialEmptyFormData);
  const [errors, setErrors] = useState<Partial<HPPIndukFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const jenisPekerjaanOptions = [
    'ERP Implementation',
    'Website Development',
    'IT Infrastructure Upgrade',
    'POS System Integration',
    'Mobile App Development',
    'Lainnya'
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
      // Set form data when modal opens, either from initialData or reset to empty
      setFormData(initialData ? {
        ...initialData,
        // Parse the initial formatted Rupiah string to a clean numeric string
        estimasiNilaiKontrak: parseRupiah(initialData.estimasiNilaiKontrak || '')
      } : initialEmptyFormData);
      setErrors({}); // Clear errors when opening
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      // Reset form data and errors when modal closes
      setFormData(initialEmptyFormData);
      setErrors({});
    };
  }, [isOpen, onClose, initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<HPPIndukFormData> = {};

    if (!formData.noHPP.trim()) {
      newErrors.noHPP = 'No HPP wajib diisi';
    }

    if (!formData.pic.trim()) {
      newErrors.pic = 'PIC wajib diisi';
    }

    if (!formData.jenisPekerjaan.trim()) {
      newErrors.jenisPekerjaan = 'Jenis Pekerjaan wajib dipilih';
    }

    if (!formData.lokasiPekerjaan.trim()) {
      newErrors.lokasiPekerjaan = 'Lokasi Pekerjaan wajib diisi';
    }

    // Validate estimasiNilaiKontrak using the parsed numeric value
    const parsedEstimasi = parseInt(formData.estimasiNilaiKontrak, 10);
    if (!formData.estimasiNilaiKontrak.trim() || isNaN(parsedEstimasi) || parsedEstimasi <= 0) {
      newErrors.estimasiNilaiKontrak = 'Estimasi Nilai Kontrak wajib diisi dan harus lebih dari nol';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof HPPIndukFormData, value: string | File | null) => {
    let processedValue: string | File | null = value;

    if (field === 'estimasiNilaiKontrak' && typeof value === 'string') {
      // Parse the input value to store only the numeric string
      processedValue = parseRupiah(value);
    }

    setFormData(prev => ({ ...prev, [field]: processedValue }));

    // Clear error when user starts typing
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

    onClose(); // This will trigger the useEffect cleanup and reset
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
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-160px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* No HPP */}
            <div>
              <label htmlFor="noHPP" className="block text-sm font-medium text-gray-700 mb-2">
                No HPP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="noHPP"
                value={formData.noHPP}
                onChange={(e) => handleInputChange('noHPP', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.noHPP ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="Masukkan No HPP"
              />
              {errors.noHPP && (
                <p className="mt-1 text-sm text-red-600">{errors.noHPP}</p>
              )}
            </div>

            {/* PIC */}
            <div>
              <label htmlFor="pic" className="block text-sm font-medium text-gray-700 mb-2">
                PIC <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="pic"
                value={formData.pic}
                onChange={(e) => handleInputChange('pic', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.pic ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="Masukkan nama PIC"
              />
              {errors.pic && (
                <p className="mt-1 text-sm text-red-600">{errors.pic}</p>
              )}
            </div>

            {/* Jenis Pekerjaan */}
            <div>
              <label htmlFor="jenisPekerjaan" className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Pekerjaan <span className="text-red-500">*</span>
              </label>
              <select
                id="jenisPekerjaan"
                value={formData.jenisPekerjaan}
                onChange={(e) => handleInputChange('jenisPekerjaan', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.jenisPekerjaan ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              >
                <option value="">Pilih Jenis Pekerjaan</option>
                {jenisPekerjaanOptions.map((jenis) => (
                  <option key={jenis} value={jenis}>{jenis}</option>
                ))}
              </select>
              {errors.jenisPekerjaan && (
                <p className="mt-1 text-sm text-red-600">{errors.jenisPekerjaan}</p>
              )}
            </div>

            {/* Lokasi Pekerjaan */}
            <div>
              <label htmlFor="lokasiPekerjaan" className="block text-sm font-medium text-gray-700 mb-2">
                Lokasi Pekerjaan <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lokasiPekerjaan"
                value={formData.lokasiPekerjaan}
                onChange={(e) => handleInputChange('lokasiPekerjaan', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.lokasiPekerjaan ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="Masukkan lokasi pekerjaan"
              />
              {errors.lokasiPekerjaan && (
                <p className="mt-1 text-sm text-red-600">{errors.lokasiPekerjaan}</p>
              )}
            </div>

            {/* Estimasi Nilai Kontrak */}
            <div>
              <label htmlFor="estimasiNilaiKontrak" className="block text-sm font-medium text-gray-700 mb-2">
                Estimasi Nilai Kontrak <span className="text-red-500">*</span>
              </label>
              <input
                type="text" // Keep as text to allow custom formatting
                id="estimasiNilaiKontrak"
                value={formatRupiah(formData.estimasiNilaiKontrak)} // Display formatted value
                onChange={(e) => handleInputChange('estimasiNilaiKontrak', e.target.value)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.estimasiNilaiKontrak ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
                placeholder="Rp 0"
              />
              {errors.estimasiNilaiKontrak && (
                <p className="mt-1 text-sm text-red-600">{errors.estimasiNilaiKontrak}</p>
              )}
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
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HPPIndukModal;
