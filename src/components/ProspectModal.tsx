import React, { useState, useEffect } from 'react';
import { X, Calendar, Save, Loader2 } from 'lucide-react';

export interface ProspectFormData {
  namaPerusahaan: string;
  pic: string;
  email: string;
  noTelp: string;
  deadlineProspect: string;
  topikPembicaraan: string;
  tindakLanjut: string;
  hasil: string;
  catatan: string;
  keterangan: string;
  tanggalUpdate: string;
}

interface ProspectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProspectFormData) => void;
  initialData?: ProspectFormData | null; // New prop for pre-filling
  title: string; // New prop for modal title
}

const ProspectModal: React.FC<ProspectModalProps> = ({ isOpen, onClose, onSave, initialData, title }) => {
  const [formData, setFormData] = useState<ProspectFormData>({
    namaPerusahaan: '',
    pic: '',
    email: '',
    noTelp: '',
    deadlineProspect: '',
    topikPembicaraan: '',
    tindakLanjut: '',
    hasil: '',
    catatan: '',
    keterangan: '',
    tanggalUpdate: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState<Partial<ProspectFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      if (initialData) {
        setFormData(initialData);
      } else {
        // Reset form for new entry if no initialData
        setFormData({
          namaPerusahaan: '',
          pic: '',
          email: '',
          noTelp: '',
          deadlineProspect: '',
          topikPembicaraan: '',
          tindakLanjut: '',
          hasil: '',
          catatan: '',
          keterangan: '',
          tanggalUpdate: new Date().toISOString().split('T')[0]
        });
      }
    } else {
      // Reset form and errors when modal closes
      setFormData({
        namaPerusahaan: '',
        pic: '',
        email: '',
        noTelp: '',
        deadlineProspect: '',
        topikPembicaraan: '',
        tindakLanjut: '',
        hasil: '',
        catatan: '',
        keterangan: '',
        tanggalUpdate: new Date().toISOString().split('T')[0]
      });
      setErrors({});
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, initialData]); // Add initialData to dependency array

  const validateForm = (): boolean => {
    const newErrors: Partial<ProspectFormData> = {};

    if (!formData.namaPerusahaan.trim()) {
      newErrors.namaPerusahaan = 'Nama Perusahaan wajib diisi';
    }

    if (!formData.pic.trim()) {
      newErrors.pic = 'PIC wajib diisi';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.noTelp.trim()) {
      newErrors.noTelp = 'No. Telp wajib diisi';
    }

    if (!formData.deadlineProspect) {
      newErrors.deadlineProspect = 'Deadline Prospect wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ProspectFormData, value: string) => {
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
    
    // onClose will trigger useEffect to reset form
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
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Nama Perusahaan */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Nama Perusahaan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.namaPerusahaan}
                  onChange={(e) => handleInputChange('namaPerusahaan', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.namaPerusahaan ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Masukkan Nama Perusahaan"
                />
                {errors.namaPerusahaan && (
                  <p className="mt-1 text-sm text-red-600">{errors.namaPerusahaan}</p>
                )}
              </div>

              {/* Topik Pembicaraan */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Topik Pembicaraan
                </label>
                <input
                  type="text"
                  value={formData.topikPembicaraan}
                  onChange={(e) => handleInputChange('topikPembicaraan', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Masukkan topik pembicaraan"
                />
              </div>

              {/* PIC */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  PIC <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.pic}
                  onChange={(e) => handleInputChange('pic', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.pic ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Masukkan nama PIC"
                />
                {errors.pic && (
                  <p className="mt-1 text-sm text-red-600">{errors.pic}</p>
                )}
              </div>

              {/* Tindak Lanjut */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Tindak Lanjut
                </label>
                <input
                  type="text"
                  value={formData.tindakLanjut}
                  onChange={(e) => handleInputChange('tindakLanjut', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Masukkan tindak lanjut"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="contoh@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Hasil */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Hasil
                </label>
                <input
                  type="text"
                  value={formData.hasil}
                  onChange={(e) => handleInputChange('hasil', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Masukkan hasil"
                />
              </div>

              {/* No. Telp */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  No. Telp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.noTelp}
                  onChange={(e) => handleInputChange('noTelp', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.noTelp ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="08xxxxxxxxxx"
                />
                {errors.noTelp && (
                  <p className="mt-1 text-sm text-red-600">{errors.noTelp}</p>
                )}
              </div>

              {/* Tanggal Update */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Tanggal Update
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.tanggalUpdate}
                    onChange={(e) => handleInputChange('tanggalUpdate', e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
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

export default ProspectModal;
