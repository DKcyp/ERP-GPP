import React, { useState, useEffect } from 'react';
import { X, Calendar, Save, Loader2, ChevronDown } from 'lucide-react';
import { Editor } from '@tinymce/tinymce-react';

interface PenawaranModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PenawaranFormData) => void;
  type: 'on-call' | 'tender';
}

export interface PenawaranFormData {
  namaClient: string;
  pic: string;
  namaSales: string;
  statusPenawaran: string;
  statusDokumen: string;
  periodeStart: string;
  periodeEnd: string;
  keterangan: string;
  catatan: string;
  tanggalUpdate: string;
}

const PenawaranModal: React.FC<PenawaranModalProps> = ({ isOpen, onClose, onSave, type }) => {
  const [formData, setFormData] = useState<PenawaranFormData>({
    namaClient: '',
    pic: '',
    namaSales: '',
    statusPenawaran: '',
    statusDokumen: '',
    periodeStart: '',
    periodeEnd: '',
    keterangan: '',
    catatan: '',
    tanggalUpdate: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState<Partial<PenawaranFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Removed clientOptions as Nama Client will be a free text input

  const salesOptions = [
    'Ahmad Rizki',
    'Sari Dewi',
    'Budi Santoso',
    'Maya Putri',
    'Andi Wijaya',
    'Rina Sari',
    'Dedi Kurniawan',
    'Lina Maharani'
  ];

  const statusPenawaranOptions = ['Deal', 'Pending', 'Cancel'];
  const statusDokumenOptions = ['Open', 'Close'];

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
    const newErrors: Partial<PenawaranFormData> = {};

    if (!formData.namaClient.trim()) {
      newErrors.namaClient = 'Nama Client wajib diisi';
    }

    if (!formData.pic.trim()) {
      newErrors.pic = 'PIC wajib diisi';
    }

    if (!formData.namaSales.trim()) {
      newErrors.namaSales = 'Nama Sales wajib diisi';
    }

    if (!formData.statusPenawaran) {
      newErrors.statusPenawaran = 'Status Penawaran wajib dipilih';
    }

    if (!formData.statusDokumen) {
      newErrors.statusDokumen = 'Status Dokumen wajib dipilih';
    }

    if (!formData.periodeStart) {
      newErrors.periodeStart = 'Periode Start wajib diisi';
    }

    if (!formData.periodeEnd) {
      newErrors.periodeEnd = 'Periode End wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof PenawaranFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
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
      namaClient: '',
      pic: '',
      namaSales: '',
      statusPenawaran: '',
      statusDokumen: '',
      periodeStart: '',
      periodeEnd: '',
      keterangan: '',
      catatan: '',
      tanggalUpdate: new Date().toISOString().split('T')[0]
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

  const modalTitle = type === 'on-call' ? 'Entry Penawaran On Call' : 'Entry Penawaran Tender';

  return (

    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">{modalTitle}</h2>
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
              {/* Nama Client */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Client <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.namaClient}
                  onChange={(e) => handleInputChange('namaClient', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.namaClient ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Masukkan Nama Client"
                />
                {errors.namaClient && (
                  <p className="mt-1 text-sm text-red-600">{errors.namaClient}</p>
                )}
              </div>

              {/* Periode Start */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Periode Start <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.periodeStart}
                    onChange={(e) => handleInputChange('periodeStart', e.target.value)}
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.periodeStart ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.periodeStart && (
                  <p className="mt-1 text-sm text-red-600">{errors.periodeStart}</p>
                )}
              </div>

              {/* PIC */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PIC <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.pic}
                  onChange={(e) => handleInputChange('pic', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.pic ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Masukkan nama PIC"
                />
                {errors.pic && (
                  <p className="mt-1 text-sm text-red-600">{errors.pic}</p>
                )}
              </div>

              {/* Periode End */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Periode End <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.periodeEnd}
                    onChange={(e) => handleInputChange('periodeEnd', e.target.value)}
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.periodeEnd ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.periodeEnd && (
                  <p className="mt-1 text-sm text-red-600">{errors.periodeEnd}</p>
                )}
              </div>

              {/* Nama Sales */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Sales <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.namaSales}
                  onChange={(e) => handleInputChange('namaSales', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.namaSales ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Pilih Nama Sales</option>
                  {salesOptions.map((sales) => (
                    <option key={sales} value={sales}>{sales}</option>
                  ))}
                </select>
                {errors.namaSales && (
                  <p className="mt-1 text-sm text-red-600">{errors.namaSales}</p>
                )}
              </div>

              {/* Keterangan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keterangan <span className="text-red-500">*</span>
                </label>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <Editor
                    value={formData.keterangan}
                    onEditorChange={(content) => handleInputChange('keterangan', content)}
                    init={{
                      height: 150,
                      menubar: false,
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'charmap',
                        'searchreplace', 'visualblocks', 'code', 'insertdatetime', 'wordcount'
                      ],
                      toolbar: 'undo redo | blocks | ' +
                        'bold italic | alignleft aligncenter alignright | ' +
                        'bullist numlist | removeformat',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                      placeholder: 'Masukkan keterangan...',
                      skin: 'oxide',
                      content_css: 'default',
                      branding: false,
                      resize: false,
                      statusbar: false,
                      setup: (editor) => {
                        editor.on('init', () => {
                          editor.getContainer().style.transition = 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out';
                        });
                        editor.on('focus', () => {
                          editor.getContainer().style.borderColor = '#3b82f6';
                          editor.getContainer().style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                        });
                        editor.on('blur', () => {
                          editor.getContainer().style.borderColor = '#d1d5db';
                          editor.getContainer().style.boxShadow = 'none';
                        });
                      }
                    }}
                  />
                </div>
              </div>

              {/* Status Penawaran */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Penawaran <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.statusPenawaran}
                  onChange={(e) => handleInputChange('statusPenawaran', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.statusPenawaran ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Pilih Status Penawaran</option>
                  {statusPenawaranOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                {errors.statusPenawaran && (
                  <p className="mt-1 text-sm text-red-600">{errors.statusPenawaran}</p>
                )}
              </div>

              {/* Catatan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catatan <span className="text-red-500">*</span>
                </label>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <Editor
                    value={formData.catatan}
                    onEditorChange={(content) => handleInputChange('catatan', content)}
                    init={{
                      height: 150,
                      menubar: false,
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'charmap',
                        'searchreplace', 'visualblocks', 'code', 'insertdatetime', 'wordcount'
                      ],
                      toolbar: 'undo redo | blocks | ' +
                        'bold italic | alignleft aligncenter alignright | ' +
                        'bullist numlist | removeformat',
                      content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                      placeholder: 'Masukkan catatan...',
                      skin: 'oxide',
                      content_css: 'default',
                      branding: false,
                      resize: false,
                      statusbar: false,
                      setup: (editor) => {
                        editor.on('init', () => {
                          editor.getContainer().style.transition = 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out';
                        });
                        editor.on('focus', () => {
                          editor.getContainer().style.borderColor = '#3b82f6';
                          editor.getContainer().style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                        });
                        editor.on('blur', () => {
                          editor.getContainer().style.borderColor = '#d1d5db';
                          editor.getContainer().style.boxShadow = 'none';
                        });
                      }
                    }}
                  />
                </div>
              </div>

              {/* Status Dokumen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Dokumen <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.statusDokumen}
                  onChange={(e) => handleInputChange('statusDokumen', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.statusDokumen ? 'border-red-300 bg-red-50' : 'border-gray-200'
                  }`}
                >
                  <option value="">Pilih Status Dokumen</option>
                  {statusDokumenOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                {errors.statusDokumen && (
                  <p className="mt-1 text-sm text-red-600">{errors.statusDokumen}</p>
                )}
              </div>

              {/* Tanggal Update */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Update <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.tanggalUpdate}
                    onChange={(e) => handleInputChange('tanggalUpdate', e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
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
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PenawaranModal;
