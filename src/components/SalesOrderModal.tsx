import React, { useState, useEffect } from 'react';
import { X, Calendar, Save, Loader2, ChevronDown } from 'lucide-react';

interface SalesOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SalesOrderFormData) => void;
}

export interface SalesOrderFormData {
  nomorKontrak: string;
  namaClient: string;
  namaProyek: string;
  sow: string;
  lokasi: string;
  jenisPekerjaan: 'On Call' | 'Tender';
  tanggalMOB: string;
  tanggalDeMOB: string;
  tanggalDibuat: string;
  estimasiSO: string;
}

const SalesOrderModal: React.FC<SalesOrderModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<SalesOrderFormData>({
    nomorKontrak: '',
    namaClient: '',
    namaProyek: '',
    sow: '',
    lokasi: '',
    jenisPekerjaan: 'On Call',
    tanggalMOB: '',
    tanggalDeMOB: '',
    tanggalDibuat: new Date().toISOString().split('T')[0],
    estimasiSO: ''
  });

  const [errors, setErrors] = useState<Partial<SalesOrderFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const clientOptions = [
    'Client A',
    'Client B', 
    'Client C',
    'Client D',
    'PT Teknologi Maju',
    'CV Digital Solutions',
    'PT Industri Kreatif'
  ];

  const kontrakOptions = [
    '001/02/P0810',
    '001/03/P0811',
    '001/04/P0810',
    '002/02/P0819'
  ];

  const lokasiOptions = [
    'Jakarta',
    'Bandung',
    'Surabaya',
    'Yogyakarta'
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
    const newErrors: Partial<SalesOrderFormData> = {};

    if (!formData.nomorKontrak.trim()) {
      newErrors.nomorKontrak = 'Nomor Kontrak wajib diisi';
    }

    if (!formData.namaClient.trim()) {
      newErrors.namaClient = 'Nama Client wajib diisi';
    }

    if (!formData.namaProyek.trim()) {
      newErrors.namaProyek = 'Nama Proyek wajib diisi';
    }

    if (!formData.sow.trim()) {
      newErrors.sow = 'SOW wajib diisi';
    }

    if (!formData.lokasi.trim()) {
      newErrors.lokasi = 'Lokasi wajib diisi';
    }

    if (!formData.estimasiSO.trim()) {
      newErrors.estimasiSO = 'Estimasi SO wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof SalesOrderFormData, value: string) => {
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
      nomorKontrak: '',
      namaClient: '',
      namaProyek: '',
      sow: '',
      lokasi: '',
      jenisPekerjaan: 'On Call',
      tanggalMOB: '',
      tanggalDeMOB: '',
      tanggalDibuat: new Date().toISOString().split('T')[0],
      estimasiSO: ''
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
          <h2 className="text-2xl font-bold text-gray-900">Entry Sales Order</h2>
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
              {/* Auto-generated No SO Display */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">No SO</label>
                <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-900 font-medium">
                  SO{String(Date.now()).slice(-6)}
                </div>
                <p className="mt-1 text-xs text-gray-500">Nomor SO akan dibuat otomatis</p>
              </div>

              {/* Jenis Pekerjaan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Pekerjaan
                </label>
                <select
                  value={formData.jenisPekerjaan}
                  onChange={(e) => handleInputChange('jenisPekerjaan', e.target.value as 'On Call' | 'Tender')}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="On Call">On Call</option>
                  <option value="Tender">Tender</option>
                </select>
              </div>

              {/* Nomor Kontrak */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Kontrak <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.nomorKontrak}
                  onChange={(e) => handleInputChange('nomorKontrak', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.nomorKontrak ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Pilih Nomor Kontrak</option>
                  {kontrakOptions.map((kontrak) => (
                    <option key={kontrak} value={kontrak}>{kontrak}</option>
                  ))}
                </select>
                {errors.nomorKontrak && (
                  <p className="mt-1 text-sm text-red-600">{errors.nomorKontrak}</p>
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
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Nama Client */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Client <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.namaClient}
                  onChange={(e) => handleInputChange('namaClient', e.target.value)}
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

              {/* Tanggal DeMOB */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal DeMOB
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.tanggalDeMOB}
                    onChange={(e) => handleInputChange('tanggalDeMOB', e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.namaProyek ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Masukkan nama proyek"
                />
                {errors.namaProyek && (
                  <p className="mt-1 text-sm text-red-600">{errors.namaProyek}</p>
                )}
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
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* SOW */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SOW <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.sow}
                  onChange={(e) => handleInputChange('sow', e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.sow ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  } resize-none`}
                  placeholder="Masukkan scope of work..."
                />
                {errors.sow && (
                  <p className="mt-1 text-sm text-red-600">{errors.sow}</p>
                )}
              </div>

              {/* Estimasi SO */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimasi SO <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.estimasiSO}
                  onChange={(e) => handleInputChange('estimasiSO', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.estimasiSO ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Rp 20.000.000"
                />
                {errors.estimasiSO && (
                  <p className="mt-1 text-sm text-red-600">{errors.estimasiSO}</p>
                )}
              </div>

              {/* Lokasi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lokasi <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.lokasi}
                  onChange={(e) => handleInputChange('lokasi', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.lokasi ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Pilih Lokasi</option>
                  {lokasiOptions.map((lokasi) => (
                    <option key={lokasi} value={lokasi}>{lokasi}</option>
                  ))}
                </select>
                {errors.lokasi && (
                  <p className="mt-1 text-sm text-red-600">{errors.lokasi}</p>
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

export default SalesOrderModal;
