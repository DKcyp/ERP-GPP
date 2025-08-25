import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, ChevronDown } from 'lucide-react';

interface PegawaiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PegawaiFormData) => void;
}

export interface PegawaiFormData {
  namaPegawai: string;
  noKTP: string;
  jabatan: string;
  wilayahKerja: string;
  jenisKontrak: 'Tetap' | 'Freelancer';
  jenisGaji: 'Bulanan' | 'Harian' | 'Proyek';
  gajiPokok: string;
}

const PegawaiModal: React.FC<PegawaiModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<PegawaiFormData>({
    namaPegawai: '',
    noKTP: '',
    jabatan: '',
    wilayahKerja: '',
    jenisKontrak: 'Tetap',
    jenisGaji: 'Bulanan',
    gajiPokok: ''
  });

  const [errors, setErrors] = useState<Partial<PegawaiFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const wilayahKerjaOptions = [
    'Jakarta',
    'Bandung',
    'Surabaya',
    'Yogyakarta',
    'Semarang',
    'Medan',
    'Makassar',
    'Bali'
  ];

  const jabatanOptions = [
    'Manager',
    'Supervisor',
    'Engineer',
    'Technician',
    'Admin',
    'Finance',
    'HR Specialist',
    'Marketing Executive'
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
    const newErrors: Partial<PegawaiFormData> = {};

    if (!formData.namaPegawai.trim()) {
      newErrors.namaPegawai = 'Nama Pegawai wajib diisi';
    }

    if (!formData.noKTP.trim()) {
      newErrors.noKTP = 'No KTP wajib diisi';
    }

    if (!formData.jabatan.trim()) {
      newErrors.jabatan = 'Jabatan wajib diisi';
    }

    if (!formData.wilayahKerja) {
      newErrors.wilayahKerja = 'Wilayah Kerja wajib dipilih';
    }

    if (!formData.gajiPokok.trim()) {
      newErrors.gajiPokok = 'Gaji Pokok wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof PegawaiFormData, value: string) => {
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
      namaPegawai: '',
      noKTP: '',
      jabatan: '',
      wilayahKerja: '',
      jenisKontrak: 'Tetap',
      jenisGaji: 'Bulanan',
      gajiPokok: ''
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
          <h2 className="text-2xl font-bold text-gray-900">Entry Pegawai</h2>
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
              {/* Nama Pegawai */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Pegawai <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.namaPegawai}
                  onChange={(e) => handleInputChange('namaPegawai', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.namaPegawai ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Masukkan nama pegawai"
                />
                {errors.namaPegawai && (
                  <p className="mt-1 text-sm text-red-600">{errors.namaPegawai}</p>
                )}
              </div>

              {/* No KTP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No KTP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.noKTP}
                  onChange={(e) => handleInputChange('noKTP', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.noKTP ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Masukkan nomor KTP"
                />
                {errors.noKTP && (
                  <p className="mt-1 text-sm text-red-600">{errors.noKTP}</p>
                )}
              </div>

              {/* Jabatan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jabatan <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.jabatan}
                  onChange={(e) => handleInputChange('jabatan', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.jabatan ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Pilih Jabatan</option>
                  {jabatanOptions.map((jabatan) => (
                    <option key={jabatan} value={jabatan}>{jabatan}</option>
                  ))}
                </select>
                {errors.jabatan && (
                  <p className="mt-1 text-sm text-red-600">{errors.jabatan}</p>
                )}
              </div>

              {/* Wilayah Kerja */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wilayah Kerja <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.wilayahKerja}
                  onChange={(e) => handleInputChange('wilayahKerja', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.wilayahKerja ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Pilih Wilayah Kerja</option>
                  {wilayahKerjaOptions.map((wilayah) => (
                    <option key={wilayah} value={wilayah}>{wilayah}</option>
                  ))}
                </select>
                {errors.wilayahKerja && (
                  <p className="mt-1 text-sm text-red-600">{errors.wilayahKerja}</p>
                )}
              </div>

              {/* Jenis Kontrak */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Kontrak
                </label>
                <select
                  value={formData.jenisKontrak}
                  onChange={(e) => handleInputChange('jenisKontrak', e.target.value as 'Tetap' | 'Freelancer')}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="Tetap">Tetap</option>
                  <option value="Freelancer">Freelancer</option>
                </select>
              </div>

              {/* Jenis Gaji */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Gaji
                </label>
                <select
                  value={formData.jenisGaji}
                  onChange={(e) => handleInputChange('jenisGaji', e.target.value as 'Bulanan' | 'Harian' | 'Proyek')}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="Bulanan">Bulanan</option>
                  <option value="Harian">Harian</option>
                  <option value="Proyek">Proyek</option>
                </select>
              </div>

              {/* Gaji Pokok */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gaji Pokok <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.gajiPokok}
                  onChange={(e) => handleInputChange('gajiPokok', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.gajiPokok ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Rp 7.500.000"
                />
                {errors.gajiPokok && (
                  <p className="mt-1 text-sm text-red-600">{errors.gajiPokok}</p>
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
                <span>Simpan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PegawaiModal;
