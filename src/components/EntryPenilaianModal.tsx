import React, { useState, useEffect } from 'react';
import { X, Calendar, Save, Loader2 } from 'lucide-react';

interface EntryPenilaianModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EntryPenilaianFormData) => void;
}

export interface EntryPenilaianFormData {
  namaPegawai: string;
  jabatanPegawai: string;
  namaPenilai: string;
  jabatanPenilai: string;
  tanggal: string;
  agility: { [key: string]: number };
  kbi: { [key: string]: number };
  kpi: { [key: string]: number };
}

const EntryPenilaianModal: React.FC<EntryPenilaianModalProps> = ({ isOpen, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState('Agility');
  const [formData, setFormData] = useState<EntryPenilaianFormData>({
    namaPegawai: '',
    jabatanPegawai: '',
    namaPenilai: '',
    jabatanPenilai: '',
    tanggal: '',
    agility: {},
    kbi: {},
    kpi: {}
  });

  const [errors, setErrors] = useState<Partial<EntryPenilaianFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const tabs = ['Agility', 'KBI', 'KPI'];

  // Sample questions for each tab
  const agilityQuestions = [
    'Memiliki rasa ingin tahu',
    'Dapat menemukan akar permasalahan',
    'Dapat merasa nyaman dengan ambiguitas dan kompleksitas',
    'Dapat menemukan kesamaan dan perbedaan dengan mudah',
    'Menemukan solusi untuk masalah yang sulit',
    'Melihat secara luas dan memiliki minat yang luas',
    'Mengikuti kajian rutin',
    'Dapat mencapai tujuan dan menghadapi rintangan',
    'Memiliki dorongan yang tinggi untuk menyelesaikan tugas'
  ];

  const kbiQuestions = [
    'Memiliki rasa ingin tahu',
    'Dapat menemukan akar permasalahan',
    'Dapat merasa nyaman dengan ambiguitas dan kompleksitas',
    'Dapat menemukan kesamaan dan perbedaan dengan mudah',
    'Menemukan solusi untuk masalah yang sulit',
    'Melihat secara luas dan memiliki minat yang luas',
    'Mengikuti kajian rutin',
    'Dapat mencapai tujuan dan menghadapi rintangan',
    'Memiliki dorongan yang tinggi untuk menyelesaikan tugas'
  ];

  const kpiQuestions = [
    'Memiliki rasa ingin tahu',
    'Dapat menemukan akar permasalahan',
    'Dapat merasa nyaman dengan ambiguitas dan kompleksitas',
    'Dapat menemukan kesamaan dan perbedaan dengan mudah',
    'Menemukan solusi untuk masalah yang sulit',
    'Melihat secara luas dan memiliki minat yang luas',
    'Mengikuti kajian rutin',
    'Dapat mencapai tujuan dan menghadapi rintangan',
    'Memiliki dorongan yang tinggi untuk menyelesaikan tugas'
  ];

  const pegawaiOptions = [
    'Rosiyati',
    'Budi Santoso',
    'Indah Permata',
    'Joko Widodo',
    'Ahmad Fauzi',
    'Siti Nurhaliza'
  ];

  const jabatanOptions = [
    'Staff AP',
    'Supervisor',
    'Manager',
    'Senior Engineer',
    'Engineer',
    'Admin'
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
    const newErrors: Partial<EntryPenilaianFormData> = {};

    if (!formData.namaPegawai.trim()) {
      newErrors.namaPegawai = 'Nama Pegawai wajib diisi';
    }

    if (!formData.jabatanPegawai.trim()) {
      newErrors.jabatanPegawai = 'Jabatan Pegawai wajib diisi';
    }

    if (!formData.namaPenilai.trim()) {
      newErrors.namaPenilai = 'Nama Penilai wajib diisi';
    }

    if (!formData.jabatanPenilai.trim()) {
      newErrors.jabatanPenilai = 'Jabatan Penilai wajib diisi';
    }

    if (!formData.tanggal) {
      newErrors.tanggal = 'Tanggal wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof EntryPenilaianFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleRatingChange = (category: 'agility' | 'kbi' | 'kpi', questionIndex: number, rating: number) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [questionIndex]: rating
      }
    }));
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
      jabatanPegawai: '',
      namaPenilai: '',
      jabatanPenilai: '',
      tanggal: '',
      agility: {},
      kbi: {},
      kpi: {}
    });
    setActiveTab('Agility');
    setErrors({});
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderQuestionTable = (questions: string[], category: 'agility' | 'kbi' | 'kpi') => {
    return (
      <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">No</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Pertanyaan</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">1</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">2</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">3</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">4</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">5</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {questions.map((question, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900 text-center">{index + 1}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{question}</td>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <td key={rating} className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={formData[category][index] === rating}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleRatingChange(category, index, rating);
                        }
                      }}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">Entry Penilaian</h2>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium text-sm"
          >
            ← Kembali
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
          <form onSubmit={handleSubmit} className="p-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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

              {/* Jabatan Pegawai */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jabatan Pegawai <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.jabatanPegawai}
                  onChange={(e) => handleInputChange('jabatanPegawai', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.jabatanPegawai ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Pilih Jabatan Pegawai</option>
                  {jabatanOptions.map((jabatan) => (
                    <option key={jabatan} value={jabatan}>{jabatan}</option>
                  ))}
                </select>
                {errors.jabatanPegawai && (
                  <p className="mt-1 text-sm text-red-600">{errors.jabatanPegawai}</p>
                )}
              </div>

              {/* Nama Penilai */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Penilai <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.namaPenilai}
                  onChange={(e) => handleInputChange('namaPenilai', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.namaPenilai ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Masukkan nama penilai"
                />
                {errors.namaPenilai && (
                  <p className="mt-1 text-sm text-red-600">{errors.namaPenilai}</p>
                )}
              </div>

              {/* Jabatan Penilai */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jabatan Penilai <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.jabatanPenilai}
                  onChange={(e) => handleInputChange('jabatanPenilai', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.jabatanPenilai ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Pilih Jabatan Penilai</option>
                  {jabatanOptions.map((jabatan) => (
                    <option key={jabatan} value={jabatan}>{jabatan}</option>
                  ))}
                </select>
                {errors.jabatanPenilai && (
                  <p className="mt-1 text-sm text-red-600">{errors.jabatanPenilai}</p>
                )}
              </div>

              {/* Tanggal */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal <span className="text-red-500">*</span>
                </label>
                <div className="relative max-w-xs">
                  <input
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => handleInputChange('tanggal', e.target.value)}
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.tanggal ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    placeholder="dd/mm/yyyy"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.tanggal && (
                  <p className="mt-1 text-sm text-red-600">{errors.tanggal}</p>
                )}
              </div>
            </div>

            {/* Formulir Penilaian Section */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Formulir Penilaian</h3>

              {/* Tabs */}
              <div className="mb-6">
                <div className="flex space-x-1 border-b border-gray-200">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-all duration-200 ${
                        activeTab === tab
                          ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="mb-8">
                {activeTab === 'Agility' && renderQuestionTable(agilityQuestions, 'agility')}
                {activeTab === 'KBI' && renderQuestionTable(kbiQuestions, 'kbi')}
                {activeTab === 'KPI' && renderQuestionTable(kpiQuestions, 'kpi')}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium text-sm"
          >
            ← Kembali
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Simpan</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntryPenilaianModal;
