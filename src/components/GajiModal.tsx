import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';

interface GajiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: GajiFormData) => void;
}

export interface GajiFormData {
  namaPegawai: string;
  gajiPokok: string;
  tunjangan: string;
  pph21: string;
  potonganMess: string;
  bpjs: string;
  gajiBersih: string;
}

const GajiModal: React.FC<GajiModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<GajiFormData>({
    namaPegawai: '',
    gajiPokok: '',
    tunjangan: '',
    pph21: '',
    potonganMess: '',
    bpjs: '',
    gajiBersih: ''
  });

  const [errors, setErrors] = useState<Partial<GajiFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const pegawaiOptions = [
    'Ahmad Fauzi',
    'Siti Nurhaliza',
    'Budi Santoso',
    'Rina Setiawati',
    'Wahyudi Hidayat',
    'Siti Aminah',
    'Dedi Kurniawan',
    'Lina Marlina'
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

  // Auto calculate Gaji Bersih when other fields change
  useEffect(() => {
    const gajiPokok = parseFloat(formData.gajiPokok.replace(/[^\d]/g, '')) || 0;
    const tunjangan = parseFloat(formData.tunjangan.replace(/[^\d]/g, '')) || 0;
    const pph21 = parseFloat(formData.pph21.replace(/[^\d]/g, '')) || 0;
    const potonganMess = parseFloat(formData.potonganMess.replace(/[^\d]/g, '')) || 0;
    const bpjs = parseFloat(formData.bpjs.replace(/[^\d]/g, '')) || 0;

    const gajiBersih = gajiPokok + tunjangan - pph21 - potonganMess - bpjs;
    
    setFormData(prev => ({
      ...prev,
      gajiBersih: gajiBersih > 0 ? `Rp ${gajiBersih.toLocaleString('id-ID')}` : ''
    }));
  }, [formData.gajiPokok, formData.tunjangan, formData.pph21, formData.potonganMess, formData.bpjs]);

  const validateForm = (): boolean => {
    const newErrors: Partial<GajiFormData> = {};

    if (!formData.namaPegawai.trim()) {
      newErrors.namaPegawai = 'Nama Pegawai wajib dipilih';
    }

    if (!formData.gajiPokok.trim()) {
      newErrors.gajiPokok = 'Gaji Pokok wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof GajiFormData, value: string) => {
    // Format currency for numeric fields
    if (['gajiPokok', 'tunjangan', 'pph21', 'potonganMess', 'bpjs'].includes(field)) {
      const numericValue = value.replace(/[^\d]/g, '');
      const formattedValue = numericValue ? `Rp ${parseInt(numericValue).toLocaleString('id-ID')}` : '';
      setFormData(prev => ({ ...prev, [field]: formattedValue }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
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
      namaPegawai: '',
      gajiPokok: '',
      tunjangan: '',
      pph21: '',
      potonganMess: '',
      bpjs: '',
      gajiBersih: ''
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
          <h2 className="text-2xl font-bold text-gray-900">Entry Gaji</h2>
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
                <select
                  value={formData.namaPegawai}
                  onChange={(e) => handleInputChange('namaPegawai', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.namaPegawai ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Pilih Nama Pegawai</option>
                  {pegawaiOptions.map((pegawai) => (
                    <option key={pegawai} value={pegawai}>{pegawai}</option>
                  ))}
                </select>
                {errors.namaPegawai && (
                  <p className="mt-1 text-sm text-red-600">{errors.namaPegawai}</p>
                )}
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
                  placeholder="Rp 5.000.000"
                />
                {errors.gajiPokok && (
                  <p className="mt-1 text-sm text-red-600">{errors.gajiPokok}</p>
                )}
              </div>

              {/* Tunjangan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tunjangan
                </label>
                <input
                  type="text"
                  value={formData.tunjangan}
                  onChange={(e) => handleInputChange('tunjangan', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Rp 1.000.000"
                />
              </div>

              {/* PPH 21 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PPH 21
                </label>
                <input
                  type="text"
                  value={formData.pph21}
                  onChange={(e) => handleInputChange('pph21', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Rp 250.000"
                />
              </div>

              {/* Potongan Mess */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Potongan Mess
                </label>
                <input
                  type="text"
                  value={formData.potonganMess}
                  onChange={(e) => handleInputChange('potonganMess', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Rp 100.000"
                />
              </div>

              {/* BPJS */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  BPJS
                </label>
                <input
                  type="text"
                  value={formData.bpjs}
                  onChange={(e) => handleInputChange('bpjs', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Rp 200.000"
                />
              </div>

              {/* Gaji Bersih (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gaji Bersih
                </label>
                <input
                  type="text"
                  value={formData.gajiBersih}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-700 font-medium"
                  placeholder="Rp 0"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Otomatis dihitung: Gaji Pokok + Tunjangan - PPH 21 - Potongan Mess - BPJS
                </p>
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

export default GajiModal;
