import React, { useState, useEffect } from 'react';
import { X, Calendar, Save, Loader2 } from 'lucide-react';

interface TunjanganUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TunjanganUnitFormData) => void;
}

export interface TunjanganUnitFormData {
  namaTeknisi: string;
  tanggal: string;
  zonaKerja: string;
  proyek: string;
  progress: string;
}

const TunjanganUnitModal: React.FC<TunjanganUnitModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<TunjanganUnitFormData>({
    namaTeknisi: '',
    tanggal: '',
    zonaKerja: '',
    proyek: '',
    progress: ''
  });

  const [errors, setErrors] = useState<Partial<TunjanganUnitFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const zonaKerjaOptions = [
    'Zona Utara',
    'Zona Selatan', 
    'Zona Timur',
    'Zona Barat',
    'Zona Pusat'
  ];

  const proyekOptions = [
    'Proyek Jaringan Fiber Optik',
    'Proyek Internet Sekolah',
    'Proyek Smart City',
    'Proyek Perluasan Jaringan',
    'Proyek Data Center'
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
    const newErrors: Partial<TunjanganUnitFormData> = {};

    if (!formData.namaTeknisi.trim()) {
      newErrors.namaTeknisi = 'Nama Teknisi wajib diisi';
    }

    if (!formData.tanggal) {
      newErrors.tanggal = 'Tanggal wajib diisi';
    }

    if (!formData.zonaKerja) {
      newErrors.zonaKerja = 'Zona Kerja wajib dipilih';
    }

    if (!formData.proyek) {
      newErrors.proyek = 'Proyek wajib dipilih';
    }

    if (!formData.progress.trim()) {
      newErrors.progress = 'Progress wajib diisi';
    }

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
      namaTeknisi: '',
      tanggal: '',
      zonaKerja: '',
      proyek: '',
      progress: ''
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
            <div className="space-y-6">
              {/* Nama Teknisi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Teknisi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.namaTeknisi}
                  onChange={(e) => handleInputChange('namaTeknisi', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.namaTeknisi ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Masukkan nama teknisi"
                />
                {errors.namaTeknisi && (
                  <p className="mt-1 text-sm text-red-600">{errors.namaTeknisi}</p>
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
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.tanggal && (
                  <p className="mt-1 text-sm text-red-600">{errors.tanggal}</p>
                )}
              </div>

              {/* Zona Kerja */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zona Kerja <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.zonaKerja}
                  onChange={(e) => handleInputChange('zonaKerja', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.zonaKerja ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Pilih Zona Kerja</option>
                  {zonaKerjaOptions.map((zona) => (
                    <option key={zona} value={zona}>{zona}</option>
                  ))}
                </select>
                {errors.zonaKerja && (
                  <p className="mt-1 text-sm text-red-600">{errors.zonaKerja}</p>
                )}
              </div>

              {/* Proyek */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Proyek <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.proyek}
                  onChange={(e) => handleInputChange('proyek', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.proyek ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Pilih Proyek</option>
                  {proyekOptions.map((proyek) => (
                    <option key={proyek} value={proyek}>{proyek}</option>
                  ))}
                </select>
                {errors.proyek && (
                  <p className="mt-1 text-sm text-red-600">{errors.proyek}</p>
                )}
              </div>

              {/* Progress */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Progress <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.progress}
                  onChange={(e) => handleInputChange('progress', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                    errors.progress ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Masukkan progress pekerjaan..."
                />
                {errors.progress && (
                  <p className="mt-1 text-sm text-red-600">{errors.progress}</p>
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
