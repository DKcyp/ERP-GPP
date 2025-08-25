import React, { useState, useEffect } from 'react';
import { X, Calendar, Save, Loader2 } from 'lucide-react';

interface ProsesProduksiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProsesProduksiFormData) => void;
}

export interface ProsesProduksiFormData {
  noSOTurunan: string;
  namaProyek: string;
  mob: string;
  demob: string;
  tglPenerimaanReportTeknisi: string;
  tglPenerimaanFinalReport: string;
  nilaiProduksi: string;
  statusReport: 'Approved' | 'Revisi';
}

const ProsesProduksiModal: React.FC<ProsesProduksiModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<ProsesProduksiFormData>({
    noSOTurunan: '',
    namaProyek: '',
    mob: '',
    demob: '',
    tglPenerimaanReportTeknisi: '',
    tglPenerimaanFinalReport: '',
    nilaiProduksi: '',
    statusReport: 'Approved'
  });

  const [errors, setErrors] = useState<Partial<ProsesProduksiFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const soTurunanOptions = [
    'SO101.12',
    'SO102.33',
    'SO103.12',
    'SO104.87',
    'SO105.21'
  ];

  const proyekOptions = [
    'Proyek A',
    'Proyek B',
    'Proyek C',
    'Proyek D',
    'Proyek E'
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
    const newErrors: Partial<ProsesProduksiFormData> = {};

    if (!formData.noSOTurunan.trim()) {
      newErrors.noSOTurunan = 'No SO Turunan wajib dipilih';
    }

    if (!formData.namaProyek.trim()) {
      newErrors.namaProyek = 'Nama Proyek wajib dipilih';
    }

    if (!formData.mob) {
      newErrors.mob = 'MOB wajib diisi';
    }

    if (!formData.demob) {
      newErrors.demob = 'DEMOB wajib diisi';
    }

    if (!formData.tglPenerimaanReportTeknisi) {
      newErrors.tglPenerimaanReportTeknisi = 'Tanggal Penerimaan Report Teknisi wajib diisi';
    }

    if (!formData.nilaiProduksi.trim()) {
      newErrors.nilaiProduksi = 'Nilai Produksi wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ProsesProduksiFormData, value: string) => {
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
      noSOTurunan: '',
      namaProyek: '',
      mob: '',
      demob: '',
      tglPenerimaanReportTeknisi: '',
      tglPenerimaanFinalReport: '',
      nilaiProduksi: '',
      statusReport: 'Approved'
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
          <h2 className="text-2xl font-bold text-gray-900">Entry Proses Produksi</h2>
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
              {/* No SO Turunan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No SO Turunan <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.noSOTurunan}
                  onChange={(e) => handleInputChange('noSOTurunan', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.noSOTurunan ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Pilih No SO Turunan</option>
                  {soTurunanOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.noSOTurunan && (
                  <p className="mt-1 text-sm text-red-600">{errors.noSOTurunan}</p>
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

              {/* MOB */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  MOB <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.mob}
                    onChange={(e) => handleInputChange('mob', e.target.value)}
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.mob ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.mob && (
                  <p className="mt-1 text-sm text-red-600">{errors.mob}</p>
                )}
              </div>

              {/* DEMOB */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DEMOB <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.demob}
                    onChange={(e) => handleInputChange('demob', e.target.value)}
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.demob ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.demob && (
                  <p className="mt-1 text-sm text-red-600">{errors.demob}</p>
                )}
              </div>

              {/* Tanggal Penerimaan Report Teknisi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tgl Penerimaan Report Teknisi <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.tglPenerimaanReportTeknisi}
                    onChange={(e) => handleInputChange('tglPenerimaanReportTeknisi', e.target.value)}
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.tglPenerimaanReportTeknisi ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.tglPenerimaanReportTeknisi && (
                  <p className="mt-1 text-sm text-red-600">{errors.tglPenerimaanReportTeknisi}</p>
                )}
              </div>

              {/* Tanggal Penerimaan Final Report */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tgl Penerimaan Final Report
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.tglPenerimaanFinalReport}
                    onChange={(e) => handleInputChange('tglPenerimaanFinalReport', e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Nilai Produksi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nilai Produksi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nilaiProduksi}
                  onChange={(e) => handleInputChange('nilaiProduksi', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.nilaiProduksi ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Rp 80,000,000"
                />
                {errors.nilaiProduksi && (
                  <p className="mt-1 text-sm text-red-600">{errors.nilaiProduksi}</p>
                )}
              </div>

              {/* Status Report */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Report
                </label>
                <select
                  value={formData.statusReport}
                  onChange={(e) => handleInputChange('statusReport', e.target.value as 'Approved' | 'Revisi')}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="Approved">Approved</option>
                  <option value="Revisi">Revisi</option>
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

export default ProsesProduksiModal;
