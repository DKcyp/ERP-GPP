import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Plus, Trash2 } from 'lucide-react';

interface TunjanganPegawaiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TunjanganPegawaiFormData) => void;
}

export interface TunjanganPegawaiFormData {
  kodePegawai: string;
  jenisPegawai: string;
  periode: string;
  namaPegawai: string;
  tunjangan: Array<{
    namaTunjangan: string;
    nominal: string;
  }>;
}

const TunjanganPegawaiModal: React.FC<TunjanganPegawaiModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<TunjanganPegawaiFormData>({
    kodePegawai: '',
    jenisPegawai: '',
    periode: '',
    namaPegawai: 'Mr. White',
    tunjangan: [{ namaTunjangan: '', nominal: '' }]
  });

  const [errors, setErrors] = useState<Partial<TunjanganPegawaiFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const kodePegawaiOptions = [
    'KP001',
    'KP002',
    'KP003',
    'KP004',
    'KP005'
  ];

  const jenisPegawaiOptions = [
    'Pegawai Tetap',
    'Pegawai Kontrak',
    'Freelance',
    'Magang'
  ];

  const periodeOptions = [
    'Januari 2025',
    'Februari 2025',
    'Maret 2025',
    'April 2025',
    'Mei 2025',
    'Juni 2025'
  ];

  const tunjanganOptions = [
    'Transport',
    'Makan',
    'Kesehatan',
    'Komunikasi',
    'Lembur',
    'Bonus Kinerja'
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
    const newErrors: Partial<TunjanganPegawaiFormData> = {};

    if (!formData.kodePegawai) {
      newErrors.kodePegawai = 'Kode Pegawai wajib dipilih';
    }

    if (!formData.jenisPegawai) {
      newErrors.jenisPegawai = 'Jenis Pegawai wajib dipilih';
    }

    if (!formData.periode) {
      newErrors.periode = 'Periode wajib dipilih';
    }

    if (!formData.namaPegawai.trim()) {
      newErrors.namaPegawai = 'Nama Pegawai wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof TunjanganPegawaiFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleTunjanganChange = (index: number, field: 'namaTunjangan' | 'nominal', value: string) => {
    const newTunjangan = [...formData.tunjangan];
    newTunjangan[index] = { ...newTunjangan[index], [field]: value };
    setFormData(prev => ({ ...prev, tunjangan: newTunjangan }));
  };

  const addTunjangan = () => {
    setFormData(prev => ({
      ...prev,
      tunjangan: [...prev.tunjangan, { namaTunjangan: '', nominal: '' }]
    }));
  };

  const removeTunjangan = (index: number) => {
    if (formData.tunjangan.length > 1) {
      setFormData(prev => ({
        ...prev,
        tunjangan: prev.tunjangan.filter((_, i) => i !== index)
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
      jenisPegawai: '',
      periode: '',
      namaPegawai: 'Mr. White',
      tunjangan: [{ namaTunjangan: '', nominal: '' }]
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">Entry Tunjangan Pegawai</h2>
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
              {/* Basic Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  <select
                    value={formData.periode}
                    onChange={(e) => handleInputChange('periode', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.periode ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Pilih Periode Bulan</option>
                    {periodeOptions.map((periode) => (
                      <option key={periode} value={periode}>{periode}</option>
                    ))}
                  </select>
                  {errors.periode && (
                    <p className="mt-1 text-sm text-red-600">{errors.periode}</p>
                  )}
                </div>

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
                    placeholder="Mr. White"
                  />
                  {errors.namaPegawai && (
                    <p className="mt-1 text-sm text-red-600">{errors.namaPegawai}</p>
                  )}
                </div>
              </div>

              {/* Tunjangan Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Tunjangan
                  </label>
                  <button
                    type="button"
                    onClick={addTunjangan}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Tambah Baris</span>
                  </button>
                </div>
                
                <div className="overflow-x-auto border border-gray-200 rounded-xl">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">No</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nama Tunjangan</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nominal</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.tunjangan.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-gray-900 text-center">{index + 1}</td>
                          <td className="px-4 py-3">
                            <select
                              value={item.namaTunjangan}
                              onChange={(e) => handleTunjanganChange(index, 'namaTunjangan', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="">Pilih Tunjangan</option>
                              {tunjanganOptions.map((tunjangan) => (
                                <option key={tunjangan} value={tunjangan}>{tunjangan}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={item.nominal}
                              onChange={(e) => handleTunjanganChange(index, 'nominal', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Masukkan Nominal"
                            />
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              type="button"
                              onClick={() => removeTunjangan(index)}
                              className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                              disabled={formData.tunjangan.length === 1}
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

export default TunjanganPegawaiModal;
