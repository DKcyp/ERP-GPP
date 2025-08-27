import React, { useState, useEffect } from 'react';
import { X, Calendar, Save, Loader2 } from 'lucide-react';
import { KPIPerspective } from '../types'; // Import KPIPerspective from types

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
  kbi: {
    [sectionIndex: number]: {
      [questionIndex: number]: number; // Rating for each question in a section
    };
  };
  kpi: KPIPerspective[]; // Array of KPI perspectives
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
    kpi: [] // Initialize with empty array, will be populated by default data for display
  });

  const [errors, setErrors] = useState<Partial<EntryPenilaianFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const tabs = ['Agility', 'KBI', 'KPI'];

  // Sample questions for Agility tab
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

  // KBI Questions and Sections (based on image)
  const kbiSections = [
    {
      title: 'Smart Keep Learning',
      maxRating: 5,
      questions: [
        'Saya selalu mengembangkan kemampuan diri, pengetahuan, dan keterampilan untuk menjadi yang terbaik demi kemajuan diri sendiri dan perusahaan',
        'Saya selalu mampu bekerja secara tuntas serta bertekad mencapai prestasi melebihi target.'
      ]
    },
    {
      title: 'Uncompromised integrity',
      maxRating: 10,
      questions: [
        'Saya teguh dalam mempertahankan perilaku jujur pada diri sendiri dan orang lain dengan penuh integritas, sesuai dengan etika dan nilai-nilai perusahaan',
        'Saya akan merahasiakan data perusahaan yang bersifat rahasia dan penting'
      ]
    },
    {
      title: 'Communicative',
      maxRating: 10,
      questions: [
        'Saya selalu melakukan komunikasi yang baik untuk memberikan informasi penting kepada departemen terkait',
        'Saya mampu merespon informasi dari luar dengan baik sehingga menyelesaikan pekerjaan sesuai dengan maksud dan tujuan yang diberikan'
      ]
    },
    {
      title: 'Commitment & consistent',
      maxRating: 5, // Assuming 5 based on common practice, not explicitly shown in image for this section
      questions: [
        'Saya selalu berkomitmen untuk menyelesaikan tugas dan tanggung jawab yang diberikan',
        'Saya konsisten dalam menunjukkan kinerja yang baik dan dapat diandalkan'
      ]
    }
  ];

  // KPI Perspectives (based on image)
  const kpiPerspectives: KPIPerspective[] = [
    {
      id: 'kpi-1',
      perspektif: 'Financial',
      indicator: 'Efisiensi penyerapan kebutuhan budget departemen',
      responsibility: 'Control Budget departemen 10%',
      bobot: '10%',
      target: '1D',
      realisasi: '1D',
      polaritas: 'Negative',
      finalScore: '9.90%'
    },
    {
      id: 'kpi-2',
      perspektif: 'Customer',
      indicator: 'Customer satisfaction indeks',
      responsibility: 'Melakukan survey Penilain kepuasan terhadap kinerja AP minimal 90%',
      bobot: '10%',
      target: '9D',
      realisasi: '7D',
      polaritas: 'Negative',
      finalScore: '7.78%'
    }
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
      // Initialize KPI data for display when modal opens
      setFormData(prev => ({ ...prev, kpi: kpiPerspectives }));
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

  const handleRatingChange = (category: 'agility' | 'kbi', key: string | number, rating: number) => {
    if (category === 'agility') {
      setFormData(prev => ({
        ...prev,
        agility: {
          ...prev.agility,
          [key]: rating
        }
      }));
    } else if (category === 'kbi') {
      const [sectionIndexStr, questionIndexStr] = String(key).split('-');
      const sectionIndex = parseInt(sectionIndexStr);
      const questionIndex = parseInt(questionIndexStr);

      setFormData(prev => ({
        ...prev,
        kbi: {
          ...prev.kbi,
          [sectionIndex]: {
            ...(prev.kbi[sectionIndex] || {}), // Ensure section object exists
            [questionIndex]: rating
          }
        }
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
      namaPegawai: '',
      jabatanPegawai: '',
      namaPenilai: '',
      jabatanPenilai: '',
      tanggal: '',
      agility: {},
      kbi: {},
      kpi: kpiPerspectives // Reset KPI to default display data
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

  // Refactored renderQuestionTable for Agility tab
  const renderQuestionTable = (questions: string[], category: 'agility', maxRating: number = 5) => {
    return (
      <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">No</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Pertanyaan</th>
              {[...Array(maxRating)].map((_, rIdx) => (
                <th key={rIdx + 1} className="px-4 py-3 text-center text-sm font-medium text-gray-700">{rIdx + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {questions.map((question, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900 text-center">{index + 1}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{question}</td>
                {[...Array(maxRating)].map((_, rating) => (
                  <td key={rating + 1} className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={formData[category][index] === (rating + 1)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleRatingChange(category, index, rating + 1);
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

  // New renderKBITab function
  const renderKBITab = () => {
    return (
      <div className="space-y-8">
        {kbiSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">{section.title}</h4>
            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">No</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Pertanyaan</th>
                    {[...Array(section.maxRating)].map((_, rIdx) => (
                      <th key={rIdx + 1} className="px-4 py-3 text-center text-sm font-medium text-gray-700">{rIdx + 1}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {section.questions.map((question, questionIndex) => (
                    <tr key={questionIndex} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 text-center">{questionIndex + 1}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{question}</td>
                      {[...Array(section.maxRating)].map((_, rating) => (
                        <td key={rating + 1} className="px-4 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={formData.kbi[sectionIndex]?.[questionIndex] === (rating + 1)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleRatingChange('kbi', `${sectionIndex}-${questionIndex}`, rating + 1);
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
          </div>
        ))}
      </div>
    );
  };

  // New renderKPITab function
  const renderKPITab = () => {
    const getPolaritasColor = (polaritas: KPIPerspective['polaritas']) => {
      switch (polaritas) {
        case 'Negative': return 'bg-red-100 text-red-800';
        case 'Positive': return 'bg-green-100 text-green-800';
        case 'Neutral': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getFinalScoreColor = (score: string) => {
      const scoreValue = parseFloat(score);
      if (scoreValue >= 8.0) return 'bg-green-600 text-white';
      if (scoreValue >= 5.0) return 'bg-yellow-500 text-white';
      return 'bg-red-600 text-white';
    };

    return (
      <div className="space-y-6">
        {formData.kpi.map((kpi) => (
          <div key={kpi.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">Perspektif: {kpi.perspektif}</h4>
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-medium">Indicator:</span> {kpi.indicator}
            </p>
            <p className="text-sm text-gray-700 mb-4">
              <span className="font-medium">Responsibility:</span> {kpi.responsibility}
            </p>

            <div className="grid grid-cols-3 gap-4 text-sm text-gray-700 mb-4">
              <div>
                <span className="font-medium block mb-1">Bobot</span>
                <span className="text-gray-900">{kpi.bobot}</span>
              </div>
              <div>
                <span className="font-medium block mb-1">Target</span>
                <span className="text-gray-900">{kpi.target}</span>
              </div>
              <div>
                <span className="font-medium block mb-1">Realisasi</span>
                <span className="text-gray-900">{kpi.realisasi}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Polaritas:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPolaritasColor(kpi.polaritas)}`}>
                  {kpi.polaritas}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Final Score:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getFinalScoreColor(kpi.finalScore)}`}>
                  {kpi.finalScore}
                </span>
              </div>
            </div>
          </div>
        ))}
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
                {activeTab === 'Agility' && renderQuestionTable(agilityQuestions, 'agility', 5)}
                {activeTab === 'KBI' && renderKBITab()}
                {activeTab === 'KPI' && renderKPITab()}
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
