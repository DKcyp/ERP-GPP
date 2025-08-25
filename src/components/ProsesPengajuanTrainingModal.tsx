import React, { useState, useEffect } from 'react';
import { X, Calendar, Save, Loader2 } from 'lucide-react';

interface ProsesPengajuanTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProsesPengajuanTrainingFormData) => void;
}

export interface ProsesPengajuanTrainingFormData {
  noTraining: string;
  noSO: string;
  soTurunan: string;
  namaProyek: string;
  jenisTraining: 'New Training' | 'Re-Training';
  tanggalPelatihanStart: string;
  tanggalPelatihanEnd: string;
  tanggalExpired: string;
  statusDokumen: 'Open' | 'Closed';
  statusPembayaran: 'Paid' | 'Unpaid';
}

const ProsesPengajuanTrainingModal: React.FC<ProsesPengajuanTrainingModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<ProsesPengajuanTrainingFormData>({
    noTraining: '',
    noSO: '',
    soTurunan: '',
    namaProyek: '',
    jenisTraining: 'New Training',
    tanggalPelatihanStart: '',
    tanggalPelatihanEnd: '',
    tanggalExpired: '',
    statusDokumen: 'Open',
    statusPembayaran: 'Paid'
  });

  const [errors, setErrors] = useState<Partial<ProsesPengajuanTrainingFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const soOptions = [
    'SO001',
    'SO002',
    'SO003',
    'SO004',
    'SO005'
  ];

  const soTurunanOptions = [
    'SO001.12',
    'SO002.2',
    'SO003.34',
    'SO004.25',
    'SO005.12'
  ];

  const proyekOptions = [
    'Project A',
    'Project B',
    'Project C',
    'Project D',
    'Project E'
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
    const newErrors: Partial<ProsesPengajuanTrainingFormData> = {};

    if (!formData.noTraining.trim()) {
      newErrors.noTraining = 'No Training wajib diisi';
    }

    if (!formData.noSO.trim()) {
      newErrors.noSO = 'No SO wajib dipilih';
    }

    if (!formData.soTurunan.trim()) {
      newErrors.soTurunan = 'SO Turunan wajib dipilih';
    }

    if (!formData.namaProyek.trim()) {
      newErrors.namaProyek = 'Nama Proyek wajib dipilih';
    }

    if (!formData.tanggalPelatihanStart) {
      newErrors.tanggalPelatihanStart = 'Tanggal Pelatihan Start wajib diisi';
    }

    if (!formData.tanggalPelatihanEnd) {
      newErrors.tanggalPelatihanEnd = 'Tanggal Pelatihan End wajib diisi';
    }

    if (!formData.tanggalExpired) {
      newErrors.tanggalExpired = 'Tanggal Expired wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ProsesPengajuanTrainingFormData, value: string) => {
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
      noTraining: '',
      noSO: '',
      soTurunan: '',
      namaProyek: '',
      jenisTraining: 'New Training',
      tanggalPelatihanStart: '',
      tanggalPelatihanEnd: '',
      tanggalExpired: '',
      statusDokumen: 'Open',
      statusPembayaran: 'Paid'
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
          <h2 className="text-2xl font-bold text-gray-900">Entry Proses Pengajuan Training</h2>
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
              {/* No Training */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No Training <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.noTraining}
                  onChange={(e) => handleInputChange('noTraining', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.noTraining ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="TRNG001"
                />
                {errors.noTraining && (
                  <p className="mt-1 text-sm text-red-600">{errors.noTraining}</p>
                )}
              </div>

              {/* No SO */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No SO <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.noSO}
                  onChange={(e) => handleInputChange('noSO', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.noSO ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Pilih No SO</option>
                  {soOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.noSO && (
                  <p className="mt-1 text-sm text-red-600">{errors.noSO}</p>
                )}
              </div>

              {/* SO Turunan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SO Turunan <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.soTurunan}
                  onChange={(e) => handleInputChange('soTurunan', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.soTurunan ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Pilih SO Turunan</option>
                  {soTurunanOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.soTurunan && (
                  <p className="mt-1 text-sm text-red-600">{errors.soTurunan}</p>
                )}
              </div>

              {/* Nama Proyek */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Proyek <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.namaProyek}
                  onChange={(e) => handleInputChange('namaProyek', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.namaProyek ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Pilih Nama Proyek</option>
                  {proyekOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.namaProyek && (
                  <p className="mt-1 text-sm text-red-600">{errors.namaProyek}</p>
                )}
              </div>

              {/* Jenis Training */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Training
                </label>
                <select
                  value={formData.jenisTraining}
                  onChange={(e) => handleInputChange('jenisTraining', e.target.value as 'New Training' | 'Re-Training')}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="New Training">New Training</option>
                  <option value="Re-Training">Re-Training</option>
                </select>
              </div>

              {/* Tanggal Pelatihan Start */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Pelatihan Start <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.tanggalPelatihanStart}
                    onChange={(e) => handleInputChange('tanggalPelatihanStart', e.target.value)}
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.tanggalPelatihanStart ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.tanggalPelatihanStart && (
                  <p className="mt-1 text-sm text-red-600">{errors.tanggalPelatihanStart}</p>
                )}
              </div>

              {/* Tanggal Pelatihan End */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Pelatihan End <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.tanggalPelatihanEnd}
                    onChange={(e) => handleInputChange('tanggalPelatihanEnd', e.target.value)}
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.tanggalPelatihanEnd ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.tanggalPelatihanEnd && (
                  <p className="mt-1 text-sm text-red-600">{errors.tanggalPelatihanEnd}</p>
                )}
              </div>

              {/* Tanggal Expired */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Expired <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.tanggalExpired}
                    onChange={(e) => handleInputChange('tanggalExpired', e.target.value)}
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.tanggalExpired ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.tanggalExpired && (
                  <p className="mt-1 text-sm text-red-600">{errors.tanggalExpired}</p>
                )}
              </div>

              {/* Status Dokumen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Dokumen
                </label>
                <select
                  value={formData.statusDokumen}
                  onChange={(e) => handleInputChange('statusDokumen', e.target.value as 'Open' | 'Closed')}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="Open">Open</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Status Pembayaran */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Pembayaran
                </label>
                <select
                  value={formData.statusPembayaran}
                  onChange={(e) => handleInputChange('statusPembayaran', e.target.value as 'Paid' | 'Unpaid')}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
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
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProsesPengajuanTrainingModal;
