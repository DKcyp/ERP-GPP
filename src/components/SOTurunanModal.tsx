import React, { useState, useEffect } from 'react';
import { X, Calendar, Save, Loader2, ChevronDown } from 'lucide-react';

interface SOTurunanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SOTurunanFormData) => void;
  readOnly?: boolean;
  initialData?: Partial<SOTurunanFormData> | null;
}

export interface SOTurunanFormData {
  soInduk: string;
  soTurunan: string;
  nomorKontrak: string;
  namaProyek: string;
  namaClient: string;
  tanggalDibuat: string;
  jenisPekerjaan: string;
  tanggalMOB: string;
  tanggalDemob: string;
  estimasiSO: string;
  keterangan: string;
}

const SOTurunanModal: React.FC<SOTurunanModalProps> = ({ isOpen, onClose, onSave, readOnly = false, initialData = null }) => {
  const [formData, setFormData] = useState<SOTurunanFormData>({
    soInduk: '',
    soTurunan: '',
    nomorKontrak: '',
    namaProyek: '',
    namaClient: '',
    tanggalDibuat: new Date().toISOString().split('T')[0],
    jenisPekerjaan: '',
    tanggalMOB: '',
    tanggalDemob: '',
    estimasiSO: '',
    keterangan: ''
  });

  const [errors, setErrors] = useState<Partial<SOTurunanFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const soIndukOptions = [
    'SO001',
    'SO002', 
    'SO003',
    'SO004',
    'SO005'
  ];

  const jenisPekerjaanOptions = [
    'On Call',
    'Project Based',
    'Maintenance',
    'Consulting'
  ];

  const clientOptions = [
    'PT Adem Ayem',
    'PT Permata Buana',
    'CV Sejahtera',
    'CV Makmur',
    'PT WorkHome'
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

  // Preload data when opening in read-only or edit mode
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        tanggalDibuat: initialData.tanggalDibuat || prev.tanggalDibuat,
      }));
    }
  }, [isOpen, initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<SOTurunanFormData> = {};

    if (!formData.soInduk.trim()) {
      newErrors.soInduk = 'SO Induk wajib dipilih';
    }

    if (!formData.soTurunan.trim()) {
      newErrors.soTurunan = 'SO Turunan wajib diisi';
    }

    if (!formData.nomorKontrak.trim()) {
      newErrors.nomorKontrak = 'Nomor Kontrak wajib diisi';
    }

    if (!formData.namaProyek.trim()) {
      newErrors.namaProyek = 'Nama Proyek wajib diisi';
    }

    if (!formData.namaClient.trim()) {
      newErrors.namaClient = 'Nama Client wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof SOTurunanFormData, value: string) => {
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
      soInduk: '',
      soTurunan: '',
      nomorKontrak: '',
      namaProyek: '',
      namaClient: '',
      tanggalDibuat: new Date().toISOString().split('T')[0],
      jenisPekerjaan: '',
      tanggalMOB: '',
      tanggalDemob: '',
      estimasiSO: '',
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">{readOnly ? 'Detail SO Turunan' : 'Entry Produksi'}</h2>
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
              {/* SO Induk */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SO Induk <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.soInduk}
                  onChange={(e) => handleInputChange('soInduk', e.target.value)}
                  disabled={readOnly}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.soInduk ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Pilih SO Induk</option>
                  {soIndukOptions.map((so) => (
                    <option key={so} value={so}>{so}</option>
                  ))}
                </select>
                {errors.soInduk && (
                  <p className="mt-1 text-sm text-red-600">{errors.soInduk}</p>
                )}
              </div>

              {/* Jenis Pekerjaan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Pekerjaan
                </label>
                <select
                  value={formData.jenisPekerjaan}
                  onChange={(e) => handleInputChange('jenisPekerjaan', e.target.value)}
                  disabled={readOnly}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Pilih Jenis Pekerjaan</option>
                  {jenisPekerjaanOptions.map((jenis) => (
                    <option key={jenis} value={jenis}>{jenis}</option>
                  ))}
                </select>
              </div>

              {/* SO Turunan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SO Turunan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.soTurunan}
                  onChange={(e) => handleInputChange('soTurunan', e.target.value)}
                  disabled={readOnly}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.soTurunan ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Masukkan SO Turunan"
                />
                {errors.soTurunan && (
                  <p className="mt-1 text-sm text-red-600">{errors.soTurunan}</p>
                )}
              </div>

              {/* Tanggal MOB */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal MOB
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.tanggalMOB}
                    onChange={(e) => handleInputChange('tanggalMOB', e.target.value)}
                    disabled={readOnly}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="dd/mm/yyyy"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Nomor Kontrak */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Kontrak <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nomorKontrak}
                  onChange={(e) => handleInputChange('nomorKontrak', e.target.value)}
                  disabled={readOnly}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.nomorKontrak ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Masukkan nomor kontrak"
                />
                {errors.nomorKontrak && (
                  <p className="mt-1 text-sm text-red-600">{errors.nomorKontrak}</p>
                )}
              </div>

              {/* Tanggal Demob */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Demob
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.tanggalDemob}
                    onChange={(e) => handleInputChange('tanggalDemob', e.target.value)}
                    disabled={readOnly}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="dd/mm/yyyy"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Nama Proyek */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Proyek <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.namaProyek}
                  onChange={(e) => handleInputChange('namaProyek', e.target.value)}
                  disabled={readOnly}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.namaProyek ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Masukkan nama proyek"
                />
                {errors.namaProyek && (
                  <p className="mt-1 text-sm text-red-600">{errors.namaProyek}</p>
                )}
              </div>

              {/* Estimasi SO */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimasi SO
                </label>
                <input
                  type="text"
                  value={formData.estimasiSO}
                  onChange={(e) => handleInputChange('estimasiSO', e.target.value)}
                  disabled={readOnly}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Rp 0"
                />
              </div>

              {/* Nama Client */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Client <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.namaClient}
                  onChange={(e) => handleInputChange('namaClient', e.target.value)}
                  disabled={readOnly}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.namaClient ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Pilih Nama Client</option>
                  {clientOptions.map((client) => (
                    <option key={client} value={client}>{client}</option>
                  ))}
                </select>
                {errors.namaClient && (
                  <p className="mt-1 text-sm text-red-600">{errors.namaClient}</p>
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
                  disabled={readOnly}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Masukkan keterangan..."
                />
              </div>

              {/* Tanggal Dibuat */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Dibuat
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.tanggalDibuat}
                    onChange={(e) => handleInputChange('tanggalDibuat', e.target.value)}
                    disabled={readOnly}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="dd/mm/yyyy"
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
          {!readOnly && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default SOTurunanModal;
