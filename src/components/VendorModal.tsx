import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';

interface VendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: VendorFormData) => void;
}

export interface VendorFormData {
  namaVendor: string;
  kodeVendor: string;
  alamatVendor: string;
  namaPIC: string;
  noTelp: string;
  email: string;
  bidangUsaha: string;
}

const VendorModal: React.FC<VendorModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<VendorFormData>({
    namaVendor: '',
    kodeVendor: '',
    alamatVendor: '',
    namaPIC: '',
    noTelp: '',
    email: '',
    bidangUsaha: ''
  });

  const [errors, setErrors] = useState<Partial<VendorFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const bidangUsahaOptions = [
    'Supplier Material',
    'Jasa Konstruksi',
    'Teknologi Informasi',
    'Transportasi',
    'Konsultan',
    'Manufaktur',
    'Perdagangan'
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
    const newErrors: Partial<VendorFormData> = {};

    if (!formData.namaVendor.trim()) {
      newErrors.namaVendor = 'Nama Vendor wajib diisi';
    }

    if (!formData.kodeVendor.trim()) {
      newErrors.kodeVendor = 'Kode Vendor wajib diisi';
    }

    if (!formData.alamatVendor.trim()) {
      newErrors.alamatVendor = 'Alamat Vendor wajib diisi';
    }

    if (!formData.namaPIC.trim()) {
      newErrors.namaPIC = 'Nama PIC wajib diisi';
    }

    if (!formData.noTelp.trim()) {
      newErrors.noTelp = 'No. Telp wajib diisi';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof VendorFormData, value: string) => {
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
      namaVendor: '',
      kodeVendor: '',
      alamatVendor: '',
      namaPIC: '',
      noTelp: '',
      email: '',
      bidangUsaha: ''
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
          <h2 className="text-2xl font-bold text-gray-900">Entry Vendor</h2>
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
              {/* Nama Vendor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Vendor <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.namaVendor}
                  onChange={(e) => handleInputChange('namaVendor', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.namaVendor ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="PT Maju Jaya"
                />
                {errors.namaVendor && (
                  <p className="mt-1 text-sm text-red-600">{errors.namaVendor}</p>
                )}
              </div>

              {/* Kode Vendor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kode Vendor <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.kodeVendor}
                  onChange={(e) => handleInputChange('kodeVendor', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.kodeVendor ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="VND001"
                />
                {errors.kodeVendor && (
                  <p className="mt-1 text-sm text-red-600">{errors.kodeVendor}</p>
                )}
              </div>

              {/* Alamat Vendor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat Vendor <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.alamatVendor}
                  onChange={(e) => handleInputChange('alamatVendor', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                    errors.alamatVendor ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Jl. Merdeka No. 1, Jakarta"
                />
                {errors.alamatVendor && (
                  <p className="mt-1 text-sm text-red-600">{errors.alamatVendor}</p>
                )}
              </div>

              {/* Nama PIC */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama PIC <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.namaPIC}
                  onChange={(e) => handleInputChange('namaPIC', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.namaPIC ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Andi Saputra"
                />
                {errors.namaPIC && (
                  <p className="mt-1 text-sm text-red-600">{errors.namaPIC}</p>
                )}
              </div>

              {/* No. Telp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No. Telp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.noTelp}
                  onChange={(e) => handleInputChange('noTelp', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.noTelp ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="081234567890"
                />
                {errors.noTelp && (
                  <p className="mt-1 text-sm text-red-600">{errors.noTelp}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="vendor@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Bidang Usaha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bidang Usaha
                </label>
                <select
                  value={formData.bidangUsaha}
                  onChange={(e) => handleInputChange('bidangUsaha', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Pilih Bidang Usaha</option>
                  {bidangUsahaOptions.map((bidang) => (
                    <option key={bidang} value={bidang}>{bidang}</option>
                  ))}
                </select>
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

export default VendorModal;
