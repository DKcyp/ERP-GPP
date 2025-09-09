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
  // Local form aligned with table columns
  const [namaPegawai, setNamaPegawai] = useState<string>('');
  const [totalIncome, setTotalIncome] = useState<string>('');
  const [totalDeduct, setTotalDeduct] = useState<string>('');
  const [gajiBersih, setGajiBersih] = useState<string>('');

  const [errors, setErrors] = useState<Partial<Record<'namaPegawai' | 'totalIncome' | 'totalDeduct', string>>>({});
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

  // Helpers: format Rupiah and parsing
  const toNumber = (rp: string) => parseFloat(rp.replace(/[^\d]/g, '')) || 0;
  const formatRp = (n: number) => (n ? `Rp ${n.toLocaleString('id-ID')}` : '');

  // Auto calculate Gaji Bersih from totals
  useEffect(() => {
    const income = toNumber(totalIncome);
    const deduct = toNumber(totalDeduct);
    const bersih = Math.max(income - deduct, 0);
    setGajiBersih(formatRp(bersih));
  }, [totalIncome, totalDeduct]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<'namaPegawai' | 'totalIncome' | 'totalDeduct', string>> = {};
    if (!namaPegawai.trim()) newErrors.namaPegawai = 'Nama Pegawai wajib dipilih';
    if (!totalIncome.trim()) newErrors.totalIncome = 'Total Income wajib diisi';
    if (!totalDeduct.trim()) newErrors.totalDeduct = 'Total Deduct wajib diisi';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCurrencyChange = (setter: (v: string) => void, key: 'totalIncome' | 'totalDeduct') => (value: string) => {
    const numericValue = value.replace(/[^\d]/g, '');
    const formattedValue = numericValue ? `Rp ${parseInt(numericValue).toLocaleString('id-ID')}` : '';
    setter(formattedValue);
    setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Map totals to underlying fields so it aligns with table columns
    const mapped: GajiFormData = {
      namaPegawai,
      gajiPokok: totalIncome, // map total income to gaji pokok
      tunjangan: 'Rp 0',
      pph21: totalDeduct, // map total deduct to pph21
      potonganMess: 'Rp 0',
      bpjs: 'Rp 0',
      gajiBersih,
    };
    onSave(mapped);
    setIsLoading(false);
    
    // Reset form
    setNamaPegawai('');
    setTotalIncome('');
    setTotalDeduct('');
    setGajiBersih('');
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
              {/* Nama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama <span className="text-red-500">*</span>
                </label>
                <select
                  value={namaPegawai}
                  onChange={(e) => { setNamaPegawai(e.target.value); setErrors(prev => ({ ...prev, namaPegawai: undefined })); }}
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

              {/* Total Income */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Income <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={totalIncome}
                  onChange={(e) => handleCurrencyChange(setTotalIncome, 'totalIncome')(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.totalIncome ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Rp 6.000.000"
                />
                {errors.totalIncome && (
                  <p className="mt-1 text-sm text-red-600">{errors.totalIncome}</p>
                )}
              </div>

              {/* Total Deduct */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Deduct <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={totalDeduct}
                  onChange={(e) => handleCurrencyChange(setTotalDeduct, 'totalDeduct')(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.totalDeduct ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Rp 500.000"
                />
                {errors.totalDeduct && (
                  <p className="mt-1 text-sm text-red-600">{errors.totalDeduct}</p>
                )}
              </div>

              {/* Gaji Bersih (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gaji Bersih
                </label>
                <input
                  type="text"
                  value={gajiBersih}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-700 font-medium"
                  placeholder="Rp 0"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Otomatis dihitung: Total Income - Total Deduct
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
