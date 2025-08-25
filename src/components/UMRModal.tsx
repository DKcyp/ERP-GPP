import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, ChevronDown } from 'lucide-react';

interface UMRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UMRFormData) => void;
}

export interface UMRFormData {
  provinsi: string;
  kabupatenKota: string;
  tahun: string;
  gajiUMR: string;
}

const UMRModal: React.FC<UMRModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<UMRFormData>({
    provinsi: '',
    kabupatenKota: '',
    tahun: '',
    gajiUMR: ''
  });

  const [errors, setErrors] = useState<Partial<UMRFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [provinsiDropdownOpen, setProvinsiDropdownOpen] = useState(false);
  const [kabupatenKotaDropdownOpen, setKabupatenKotaDropdownOpen] = useState(false);

  const provinsiOptions = [
    'DKI Jakarta',
    'Jawa Barat',
    'Jawa Tengah',
    'Jawa Timur',
    'Yogyakarta',
    'Banten',
    'Sumatera Utara',
    'Sumatera Barat',
    'Sumatera Selatan',
    'Kalimantan Timur',
    'Kalimantan Selatan',
    'Sulawesi Selatan',
    'Sulawesi Utara',
    'Bali',
    'Nusa Tenggara Barat',
    'Nusa Tenggara Timur'
  ];

  const kabupatenKotaOptions: { [key: string]: string[] } = {
    'DKI Jakarta': ['Jakarta Pusat', 'Jakarta Utara', 'Jakarta Selatan', 'Jakarta Timur', 'Jakarta Barat'],
    'Jawa Barat': ['Bandung', 'Bekasi', 'Bogor', 'Depok', 'Cimahi', 'Sukabumi', 'Cirebon', 'Tasikmalaya'],
    'Jawa Tengah': ['Semarang', 'Solo', 'Yogyakarta', 'Magelang', 'Salatiga', 'Surakarta', 'Pekalongan'],
    'Jawa Timur': ['Surabaya', 'Malang', 'Kediri', 'Blitar', 'Mojokerto', 'Madiun', 'Pasuruan', 'Probolinggo'],
    'Yogyakarta': ['Sleman', 'Bantul', 'Kulon Progo', 'Gunung Kidul', 'Yogyakarta'],
    'Banten': ['Tangerang', 'Tangerang Selatan', 'Serang', 'Cilegon', 'Lebak', 'Pandeglang'],
    'Sumatera Utara': ['Medan', 'Binjai', 'Tebing Tinggi', 'Pematang Siantar', 'Tanjung Balai'],
    'Sumatera Barat': ['Padang', 'Bukittinggi', 'Padang Panjang', 'Payakumbuh', 'Sawahlunto'],
    'Sumatera Selatan': ['Palembang', 'Prabumulih', 'Pagar Alam', 'Lubuk Linggau'],
    'Kalimantan Timur': ['Samarinda', 'Balikpapan', 'Bontang', 'Tarakan'],
    'Kalimantan Selatan': ['Banjarmasin', 'Banjarbaru'],
    'Sulawesi Selatan': ['Makassar', 'Parepare', 'Palopo'],
    'Sulawesi Utara': ['Manado', 'Bitung', 'Tomohon', 'Kotamobagu'],
    'Bali': ['Denpasar', 'Badung', 'Gianyar', 'Tabanan'],
    'Nusa Tenggara Barat': ['Mataram', 'Bima', 'Dompu', 'Lombok Barat'],
    'Nusa Tenggara Timur': ['Kupang', 'Ende', 'Maumere', 'Atambua']
  };

  const tahunOptions = ['2024', '2025', '2026', '2027', '2028'];

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
    const newErrors: Partial<UMRFormData> = {};

    if (!formData.provinsi.trim()) {
      newErrors.provinsi = 'Provinsi wajib dipilih';
    }

    if (!formData.kabupatenKota.trim()) {
      newErrors.kabupatenKota = 'Kabupaten/Kota wajib dipilih';
    }

    if (!formData.tahun.trim()) {
      newErrors.tahun = 'Tahun wajib diisi';
    }

    if (!formData.gajiUMR.trim()) {
      newErrors.gajiUMR = 'Gaji UMR wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof UMRFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Reset kabupaten/kota when provinsi changes
    if (field === 'provinsi') {
      setFormData(prev => ({ ...prev, kabupatenKota: '' }));
    }
    
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
      provinsi: '',
      kabupatenKota: '',
      tahun: '',
      gajiUMR: ''
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

  const availableKabupatenKota = formData.provinsi ? kabupatenKotaOptions[formData.provinsi] || [] : [];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-xl font-bold text-gray-900">Entry UMR</h2>
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
              {/* Provinsi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Provinsi <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProvinsiDropdownOpen(!provinsiDropdownOpen)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between bg-white ${
                      errors.provinsi ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <span className={formData.provinsi ? 'text-gray-900' : 'text-gray-500'}>
                      {formData.provinsi || 'Pilih Provinsi'}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${provinsiDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {provinsiDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden max-h-60 overflow-y-auto">
                      {provinsiOptions.map((provinsi) => (
                        <button
                          key={provinsi}
                          type="button"
                          onClick={() => {
                            handleInputChange('provinsi', provinsi);
                            setProvinsiDropdownOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                        >
                          {provinsi}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.provinsi && (
                  <p className="mt-1 text-sm text-red-600">{errors.provinsi}</p>
                )}
              </div>

              {/* Kabupaten/Kota */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kabupaten/Kota <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setKabupatenKotaDropdownOpen(!kabupatenKotaDropdownOpen)}
                    disabled={!formData.provinsi}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between ${
                      !formData.provinsi 
                        ? 'bg-gray-100 cursor-not-allowed' 
                        : 'bg-white'
                    } ${
                      errors.kabupatenKota ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <span className={formData.kabupatenKota ? 'text-gray-900' : 'text-gray-500'}>
                      {formData.kabupatenKota || 'Pilih Kabupaten/Kota'}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${kabupatenKotaDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {kabupatenKotaDropdownOpen && formData.provinsi && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden max-h-60 overflow-y-auto">
                      {availableKabupatenKota.map((kabupatenKota) => (
                        <button
                          key={kabupatenKota}
                          type="button"
                          onClick={() => {
                            handleInputChange('kabupatenKota', kabupatenKota);
                            setKabupatenKotaDropdownOpen(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                        >
                          {kabupatenKota}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {errors.kabupatenKota && (
                  <p className="mt-1 text-sm text-red-600">{errors.kabupatenKota}</p>
                )}
              </div>

              {/* Tahun */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tahun <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.tahun}
                  onChange={(e) => handleInputChange('tahun', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.tahun ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="2024"
                />
                {errors.tahun && (
                  <p className="mt-1 text-sm text-red-600">{errors.tahun}</p>
                )}
              </div>

              {/* Gaji UMR */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gaji UMR <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.gajiUMR}
                  onChange={(e) => handleInputChange('gajiUMR', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.gajiUMR ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Rp 5.067.381"
                />
                {errors.gajiUMR && (
                  <p className="mt-1 text-sm text-red-600">{errors.gajiUMR}</p>
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

export default UMRModal;
