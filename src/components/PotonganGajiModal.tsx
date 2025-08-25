import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Plus, Trash2, Calendar } from 'lucide-react';

interface PotonganGajiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PotonganGajiFormData) => void;
}

export interface PotonganGajiFormData {
  kodePegawai: string;
  namaPegawai: string;
  jenisPegawai: string;
  periode: string;
  keterangan: string;
  potonganItems: Array<{
    namaPotongan: string;
    nominal: string;
  }>;
}

const PotonganGajiModal: React.FC<PotonganGajiModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<PotonganGajiFormData>({
    kodePegawai: '',
    namaPegawai: 'Mr. White',
    jenisPegawai: '',
    periode: '',
    keterangan: '',
    potonganItems: [{ namaPotongan: '', nominal: '' }]
  });

  const [errors, setErrors] = useState<Partial<PotonganGajiFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const kodePegawaiOptions = [
    'EMP001',
    'EMP002',
    'EMP003',
    'EMP004',
    'EMP005'
  ];

  const jenisPegawaiOptions = [
    'Tetap',
    'Kontrak',
    'Magang'
  ];

  const potonganOptions = [
    'PPH21',
    'BPJS',
    'Mess',
    'Pinjaman',
    'Denda',
    'Lainnya'
  ];

  // Auto-populate nama pegawai based on kode pegawai
  const pegawaiMapping: { [key: string]: string } = {
    'EMP001': 'Ahmad Fauzi',
    'EMP002': 'Siti Nurhaliza',
    'EMP003': 'Budi Santoso',
    'EMP004': 'Dewi Lestari',
    'EMP005': 'Rizki Pratama'
  };

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
    const newErrors: Partial<PotonganGajiFormData> = {};

    if (!formData.kodePegawai) {
      newErrors.kodePegawai = 'Kode Pegawai wajib dipilih';
    }

    if (!formData.jenisPegawai) {
      newErrors.jenisPegawai = 'Jenis Pegawai wajib dipilih';
    }

    if (!formData.periode) {
      newErrors.periode = 'Periode wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof PotonganGajiFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-populate nama pegawai when kode pegawai changes
    if (field === 'kodePegawai') {
      setFormData(prev => ({ 
        ...prev, 
        [field]: value,
        namaPegawai: pegawaiMapping[value] || 'Mr. White'
      }));
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePotonganChange = (index: number, field: 'namaPotongan' | 'nominal', value: string) => {
    const newPotongan = [...formData.potonganItems];
    newPotongan[index] = { ...newPotongan[index], [field]: value };
    setFormData(prev => ({ ...prev, potonganItems: newPotongan }));
  };

  const addPotongan = () => {
    setFormData(prev => ({
      ...prev,
      potonganItems: [...prev.potonganItems, { namaPotongan: '', nominal: '' }]
    }));
  };

  const removePotongan = (index: number) => {
    if (formData.potonganItems.length > 1) {
      setFormData(prev => ({
        ...prev,
        potonganItems: prev.potonganItems.filter((_, i) => i !== index)
      }));
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
      kodePegawai: '',
      namaPegawai: 'Mr. White',
      jenisPegawai: '',
      periode: '',
      keterangan: '',
      potonganItems: [{ namaPotongan: '', nominal: '' }]
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-xl font-bold text-gray-900">Entry Potongan Gaji</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Kode Pegawai */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kode Pegawai <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.kodePegawai}
                  onChange={(e) => handleInputChange('kodePegawai', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.kodePegawai ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Pilih Kode Pegawai</option>
                  {kodePegawaiOptions.map((kode) => (
                    <option key={kode} value={kode}>{kode}</option>
                  ))}
                </select>
                {errors.kodePegawai && (
                  <p className="mt-1 text-sm text-red-600">{errors.kodePegawai}</p>
                )}
              </div>

              {/* Nama Pegawai */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Pegawai
                </label>
                <input
                  type="text"
                  value={formData.namaPegawai}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-700"
                />
              </div>

              {/* Jenis Pegawai */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Pegawai <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.jenisPegawai}
                  onChange={(e) => handleInputChange('jenisPegawai', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.jenisPegawai ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Pilih Jenis Pegawai</option>
                  {jenisPegawaiOptions.map((jenis) => (
                    <option key={jenis} value={jenis}>{jenis}</option>
                  ))}
                </select>
                {errors.jenisPegawai && (
                  <p className="mt-1 text-sm text-red-600">{errors.jenisPegawai}</p>
                )}
              </div>

              {/* Periode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Periode <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.periode}
                    onChange={(e) => handleInputChange('periode', e.target.value)}
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.periode ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.periode && (
                  <p className="mt-1 text-sm text-red-600">{errors.periode}</p>
                )}
              </div>

              {/* Potongan Items Table */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Daftar Potongan
                  </label>
                </div>
                
                <div className="overflow-x-auto border border-gray-200 rounded-xl">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">No</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nama Potongan</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nominal</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.potonganItems.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-gray-900 text-center">{index + 1}</td>
                          <td className="px-4 py-3">
                            <select
                              value={item.namaPotongan}
                              onChange={(e) => handlePotonganChange(index, 'namaPotongan', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Pilih Potongan</option>
                              {potonganOptions.map((potongan) => (
                                <option key={potongan} value={potongan}>{potongan}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={item.nominal}
                              onChange={(e) => handlePotonganChange(index, 'nominal', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Masukkan Nominal"
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => removePotongan(index)}
                              className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                              disabled={formData.potonganItems.length === 1}
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Hapus</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Add Row Button */}
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={addPotongan}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Tambah Baris</span>
                  </button>
                </div>
              </div>

              {/* Keterangan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keterangan
                </label>
                <textarea
                  value={formData.keterangan}
                  onChange={(e) => handleInputChange('keterangan', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Masukkan keterangan..."
                />
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

export default PotonganGajiModal;
