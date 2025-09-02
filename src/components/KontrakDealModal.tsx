import React, { useState, useEffect } from 'react';
import { X, Calendar, Save, Loader2 } from 'lucide-react';

interface KontrakDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: KontrakDealFormData) => void;
  initialData?: KontrakDealFormData | null; // Optional initial data for editing
  title: string; // Dynamic title for the modal
}

export interface KontrakDealFormData {
  id?: string; // Add optional ID for editing
  noKontrak: string;
  namaClient: string;
  namaKontrak: string;
  jenisKontrak: string;
  tanggalKontrak: string;
  durasiKontrakStart: string;
  durasiKontrakEnd: string;
  nilaiKontrak: string;
  lokasiPekerjaan: string;
  scopeOfWork: string;
  uploadKontrak: File | null;
}

const KontrakDealModal: React.FC<KontrakDealModalProps> = ({ isOpen, onClose, onSave, initialData, title }) => {
  const initialEmptyFormData: KontrakDealFormData = {
    noKontrak: '',
    namaClient: '',
    namaKontrak: '',
    jenisKontrak: '',
    tanggalKontrak: '',
    durasiKontrakStart: '',
    durasiKontrakEnd: '',
    nilaiKontrak: '',
    lokasiPekerjaan: '',
    scopeOfWork: '',
    uploadKontrak: null
  };

  const [formData, setFormData] = useState<KontrakDealFormData>(initialEmptyFormData);
  const [errors, setErrors] = useState<Partial<KontrakDealFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const clientOptions = [
    'PT Teknologi Maju',
    'CV Digital Solutions',
    'PT Industri Kreatif',
    'UD Berkah Jaya',
    'PT Global Mandiri',
    'PT Inovasi Digital',
    'CV Solusi Terpadu',
    'PT Mitra Sejahtera'
  ];

  const jenisKontrakOptions = [
    'Tender',
    'On Call'
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
      setFormData(initialData || initialEmptyFormData);
      setErrors({}); // Clear errors when opening
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      // Reset form data and errors when modal closes
      setFormData(initialEmptyFormData);
      setErrors({});
    };
  }, [isOpen, onClose, initialData]); // initialData is a dependency

  const validateForm = (): boolean => {
    const newErrors: Partial<KontrakDealFormData> = {};

    if (!formData.noKontrak.trim()) {
      newErrors.noKontrak = 'No Kontrak wajib diisi';
    }

    if (!formData.namaClient.trim()) {
      newErrors.namaClient = 'Nama Client wajib diisi';
    }

    if (!formData.namaKontrak.trim()) {
      newErrors.namaKontrak = 'Nama Kontrak wajib diisi';
    }

    if (!formData.jenisKontrak.trim()) {
      newErrors.jenisKontrak = 'Jenis Kontrak wajib dipilih';
    }

    if (!formData.tanggalKontrak) {
      newErrors.tanggalKontrak = 'Tanggal Kontrak wajib diisi';
    }

    if (!formData.durasiKontrakStart) {
      newErrors.durasiKontrakStart = 'Tanggal mulai durasi kontrak wajib diisi';
    }

    if (!formData.durasiKontrakEnd) {
      newErrors.durasiKontrakEnd = 'Tanggal akhir durasi kontrak wajib diisi';
    }

    if (!formData.nilaiKontrak.trim()) {
      newErrors.nilaiKontrak = 'Nilai Kontrak wajib diisi';
    }

    if (!formData.lokasiPekerjaan.trim()) {
      newErrors.lokasiPekerjaan = 'Lokasi Pekerjaan wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof KontrakDealFormData, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleInputChange('uploadKontrak', file);
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
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300 text-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-all duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-140px)]">
          <form onSubmit={handleSubmit} className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {/* No Kontrak */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  No Kontrak <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.noKontrak}
                  onChange={(e) => handleInputChange('noKontrak', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs ${
                    errors.noKontrak ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Masukkan no kontrak"
                />
                {errors.noKontrak && (
                  <p className="mt-1 text-xs text-red-600">{errors.noKontrak}</p>
                )}
              </div>

              {/* Tanggal Kontrak */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Tanggal Kontrak <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.tanggalKontrak}
                    onChange={(e) => handleInputChange('tanggalKontrak', e.target.value)}
                    className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs ${
                      errors.tanggalKontrak ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                </div>
                {errors.tanggalKontrak && (
                  <p className="mt-1 text-xs text-red-600">{errors.tanggalKontrak}</p>
                )}
              </div>

              {/* Nama Kontrak */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nama Kontrak <span className="text-red-500">*</span>
                </label>
                 <input
                  type="text"
                  value={formData.namaKontrak}
                  onChange={(e) => handleInputChange('namaKontrak', e.target.value)} // Corrected field name
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs ${
                    errors.namaKontrak ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Masukkan Nama kontrak"
                />
                {errors.namaKontrak && (
                  <p className="mt-1 text-xs text-red-600">{errors.namaKontrak}</p>
                )}
              </div>

              {/* Durasi Kontrak */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Durasi Kontrak <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <input
                      type="date"
                      value={formData.durasiKontrakStart}
                      onChange={(e) => handleInputChange('durasiKontrakStart', e.target.value)}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs ${
                        errors.durasiKontrakStart ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                  </div>
                  <span className="text-gray-500 text-xs">s.d</span>
                  <div className="relative flex-1">
                    <input
                      type="date"
                      value={formData.durasiKontrakEnd}
                      onChange={(e) => handleInputChange('durasiKontrakEnd', e.target.value)}
                      className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs ${
                        errors.durasiKontrakEnd ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                {(errors.durasiKontrakStart || errors.durasiKontrakEnd) && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.durasiKontrakStart || errors.durasiKontrakEnd}
                  </p>
                )}
              </div>

              {/* Nama Client */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nama Client <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.namaClient}
                  onChange={(e) => handleInputChange('namaClient', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs ${
                    errors.namaClient ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Pilih Nama Client</option>
                  {clientOptions.map((client) => (
                    <option key={client} value={client}>{client}</option>
                  ))}
                </select>
                {errors.namaClient && (
                  <p className="mt-1 text-xs text-red-600">{errors.namaClient}</p>
                )}
              </div>

              {/* Lokasi Pekerjaan */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Lokasi Pekerjaan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lokasiPekerjaan}
                  onChange={(e) => handleInputChange('lokasiPekerjaan', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs ${
                    errors.lokasiPekerjaan ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Masukkan lokasi pekerjaan"
                />
                {errors.lokasiPekerjaan && (
                  <p className="mt-1 text-xs text-red-600">{errors.lokasiPekerjaan}</p>
                )}
              </div>

              {/* Jenis Kontrak */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Jenis Kontrak <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.jenisKontrak}
                  onChange={(e) => handleInputChange('jenisKontrak', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs ${
                    errors.jenisKontrak ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Pilih Jenis Kontrak</option> {/* Changed default option text */}
                  {jenisKontrakOptions.map((jenis) => (
                    <option key={jenis} value={jenis}>{jenis}</option>
                  ))}
                </select>
                {errors.jenisKontrak && (
                  <p className="mt-1 text-xs text-red-600">{errors.jenisKontrak}</p>
                )}
              </div>

              {/* Nilai Kontrak */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Nilai Kontrak <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nilaiKontrak}
                  onChange={(e) => handleInputChange('nilaiKontrak', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-xs ${
                    errors.nilaiKontrak ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Rp 0"
                />
                {errors.nilaiKontrak && (
                  <p className="mt-1 text-xs text-red-600">{errors.nilaiKontrak}</p>
                )}
              </div>

              {/* Scope Of Work */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Scope of work
                </label>
                <textarea
                  value={formData.scopeOfWork}
                  onChange={(e) => handleInputChange('scopeOfWork', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none text-xs"
                  placeholder="Masukkan scope of work"
                />
              </div>

              {/* Upload Kontrak */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Upload Kontrak
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="block w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                  />
                </div>
                {formData.uploadKontrak && (
                  <p className="mt-2 text-xs text-green-600">
                    File selected: {formData.uploadKontrak.name}
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-2 p-3 border-t border-gray-200 bg-gray-50 flex-shrink-0 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-all duration-200 font-medium"
          >
            Close
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/20 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-3 w-3" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KontrakDealModal;
