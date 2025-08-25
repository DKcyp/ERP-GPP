import React, { useState, useEffect } from 'react';
import { X, Calendar, Save, Loader2 } from 'lucide-react';

interface SuspectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SuspectFormData) => void;
}

export interface SuspectFormData {
  namaPerusahaan: string;
  pic: string;
  emailPIC: string;
  noTelp: string;
  alamatPerusahaan: string;
  bidangUsaha: string;
}

const SuspectModal: React.FC<SuspectModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<SuspectFormData>({
    namaPerusahaan: '',
    pic: '',
    emailPIC: '',
    noTelp: '',
    alamatPerusahaan: '',
    bidangUsaha: ''
  });

  const [errors, setErrors] = useState<Partial<SuspectFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const companyOptions = [
    'PT Teknologi Maju',
    'CV Digital Solutions',
    'PT Industri Kreatif',
    'UD Berkah Jaya',
    'PT Global Mandiri',
    'PT Inovasi Digital',
    'CV Solusi Terpadu',
    'PT Mitra Sejahtera'
  ];

  const bidangUsahaOptions = [
    'Teknologi Informasi',
    'Manufaktur',
    'Perdagangan',
    'Jasa Konsultasi',
    'Konstruksi',
    'Pendidikan',
    'Kesehatan',
    'Transportasi'
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
    const newErrors: Partial<SuspectFormData> = {};

    if (!formData.namaPerusahaan.trim()) {
      newErrors.namaPerusahaan = 'Nama Perusahaan wajib diisi';
    }

    if (!formData.pic.trim()) {
      newErrors.pic = 'PIC wajib diisi';
    }

    if (!formData.emailPIC.trim()) {
      newErrors.emailPIC = 'Email PIC wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailPIC)) {
      newErrors.emailPIC = 'Format email tidak valid';
    }

    if (!formData.noTelp.trim()) {
      newErrors.noTelp = 'No. Telp wajib diisi';
    }

    if (!formData.alamatPerusahaan.trim()) {
      newErrors.alamatPerusahaan = 'Alamat Perusahaan wajib diisi';
    }

    if (!formData.bidangUsaha.trim()) {
      newErrors.bidangUsaha = 'Bidang Usaha wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof SuspectFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
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
    
    // Reset form
    setFormData({
      namaPerusahaan: '',
      pic: '',
      emailPIC: '',
      noTelp: '',
      alamatPerusahaan: '',
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">Entry Suspect</h2>
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
            <div className="grid grid-cols-2 gap-6">
              {/* Nama Perusahaan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Perusahaan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.namaPerusahaan}
                  onChange={(e) => handleInputChange('namaPerusahaan', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.namaPerusahaan ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Masukkan Nama Perusahaan"
                />
                {errors.namaPerusahaan && (
                  <p className="mt-1 text-sm text-red-600">{errors.namaPerusahaan}</p>
                )}
              </div>

              {/* Bidang Usaha */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bidang Usaha <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.bidangUsaha}
                  onChange={(e) => handleInputChange('bidangUsaha', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.bidangUsaha ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Masukkan Bidang Usaha"
                />
                {errors.bidangUsaha && (
                  <p className="mt-1 text-sm text-red-600">{errors.bidangUsaha}</p>
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
                  placeholder="08xxxxxxxxxx"
                />
                {errors.noTelp && (
                  <p className="mt-1 text-sm text-red-600">{errors.noTelp}</p>
                )}
              </div>

              {/* PIC */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PIC <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.pic}
                  onChange={(e) => handleInputChange('pic', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.pic ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Masukkan Nama PIC"
                />
                {errors.pic && (
                  <p className="mt-1 text-sm text-red-600">{errors.pic}</p>
                )}
              </div>

              {/* Alamat Perusahaan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat Perusahaan <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.alamatPerusahaan}
                  onChange={(e) => handleInputChange('alamatPerusahaan', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-[36px] ${
                    errors.alamatPerusahaan ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Masukkan Alamat Lengkap Perusahaan"
                  style={{ minHeight: '50px', resize: 'vertical' }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.max(50, target.scrollHeight) + 'px';
                  }}
                />
                {errors.alamatPerusahaan && (
                  <p className="mt-1 text-sm text-red-600">{errors.alamatPerusahaan}</p>
                )}
              </div>

              {/* Email PIC */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email PIC <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.emailPIC}
                  onChange={(e) => handleInputChange('emailPIC', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none h-[36px] ${
                    errors.emailPIC ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="contoh@email.com"
                  style={{ minHeight: '50px', resize: 'vertical' }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.max(50, target.scrollHeight) + 'px';
                  }}
                />
                {errors.emailPIC && (
                  <p className="mt-1 text-sm text-red-600">{errors.emailPIC}</p>
                )}
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
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuspectModal;
