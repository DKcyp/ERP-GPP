import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, Save, Loader2 } from 'lucide-react';

interface KickOffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: KickOffFormData) => void;
}

export interface KickOffFormData {
  dokumenKickOff: File | null;
  tanggalMobilisasi: string;
  tanggalPenagihan: string;
  caraPenagihan: string;
  sow: string;
  keterangan: string;
  transportasi: string;
  akomodasi: string;
  syaratPenerimaanInvoice: string;
  syaratPenagihanDokumen: string;
  pics: Array<{
    namaPIC: string;
    divisiPIC: string;
    noHPPIC: string;
    emailPIC: string;
  }>;
}

const KickOffModal: React.FC<KickOffModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<KickOffFormData>({
    dokumenKickOff: null,
    tanggalMobilisasi: '',
    tanggalPenagihan: '',
    caraPenagihan: '',
    sow: '',
    keterangan: '',
    transportasi: '',
    akomodasi: '',
    syaratPenerimaanInvoice: '',
    syaratPenagihanDokumen: '',
    pics: [{ namaPIC: '', divisiPIC: '', noHPPIC: '', emailPIC: '' }]
  });

  const [errors, setErrors] = useState<Partial<KickOffFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

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

  const handleInputChange = (field: keyof KickOffFormData, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePICChange = (index: number, field: string, value: string) => {
    const newPICs = [...formData.pics];
    newPICs[index] = { ...newPICs[index], [field]: value };
    setFormData(prev => ({ ...prev, pics: newPICs }));
  };

  const addPIC = () => {
    setFormData(prev => ({
      ...prev,
      pics: [...prev.pics, { namaPIC: '', divisiPIC: '', noHPPIC: '', emailPIC: '' }]
    }));
  };

  const removePIC = (index: number) => {
    if (formData.pics.length > 1) {
      setFormData(prev => ({
        ...prev,
        pics: prev.pics.filter((_, i) => i !== index)
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleInputChange('dokumenKickOff', file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    const newErrors: Partial<KickOffFormData> = {};
    if (!formData.transportasi.trim()) newErrors.transportasi = 'Transportasi wajib diisi';
    if (!formData.akomodasi.trim()) newErrors.akomodasi = 'Akomodasi wajib diisi';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSave(formData);
    setIsLoading(false);
    
    // Reset form
    setFormData({
      dokumenKickOff: null,
      tanggalMobilisasi: '',
      tanggalPenagihan: '',
      caraPenagihan: '',
      sow: '',
      keterangan: '',
      transportasi: '',
      akomodasi: '',
      syaratPenerimaanInvoice: '',
      syaratPenagihanDokumen: '',
      pics: [{ namaPIC: '', divisiPIC: '', noHPPIC: '', emailPIC: '' }]
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
          <h2 className="text-2xl font-bold text-gray-900">Entry Kick Off</h2>
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
              {/* Dokumen Kick Off */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dokumen Kick Off
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                  />
                </div>
                {formData.dokumenKickOff && (
                  <p className="mt-2 text-sm text-green-600">
                    File selected: {formData.dokumenKickOff.name}
                  </p>
                )}
              </div>

              {/* PIC Table */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    PIC Information
                  </label>
                  <button
                    type="button"
                    onClick={addPIC}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add PIC</span>
                  </button>
                </div>
                
                <div className="overflow-x-auto border border-gray-200 rounded-xl">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nama PIC</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Divisi PIC</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">No HP PIC</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Email PIC</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {formData.pics.map((pic, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={pic.namaPIC}
                              onChange={(e) => handlePICChange(index, 'namaPIC', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Nama PIC"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={pic.divisiPIC}
                              onChange={(e) => handlePICChange(index, 'divisiPIC', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Divisi PIC"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="tel"
                              value={pic.noHPPIC}
                              onChange={(e) => handlePICChange(index, 'noHPPIC', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="No HP PIC"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="email"
                              value={pic.emailPIC}
                              onChange={(e) => handlePICChange(index, 'emailPIC', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Email PIC"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => removePIC(index)}
                              className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={formData.pics.length === 1}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Date Fields */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tanggal Mobilisasi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Mobilisasi
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.tanggalMobilisasi}
                      onChange={(e) => handleInputChange('tanggalMobilisasi', e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Tanggal Penagihan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Penagihan
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={formData.tanggalPenagihan}
                      onChange={(e) => handleInputChange('tanggalPenagihan', e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Text Fields */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cara Penagihan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cara Penagihan
                  </label>
                  <textarea
                    value={formData.caraPenagihan}
                    onChange={(e) => handleInputChange('caraPenagihan', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Masukkan cara penagihan..."
                  />
                </div>

                {/* SOW */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SOW
                  </label>
                  <textarea
                    value={formData.sow}
                    onChange={(e) => handleInputChange('sow', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Masukkan SOW..."
                  />
                </div>
              </div>

              {/* Additional Text Fields */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Keterangan */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keterangan
                  </label>
                  <textarea
                    value={formData.keterangan}
                    onChange={(e) => handleInputChange('keterangan', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Masukkan keterangan..."
                  />
                </div>

                {/* Syarat Penerimaan Invoice */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Syarat Penerimaan Invoice
                  </label>
                  <textarea
                    value={formData.syaratPenerimaanInvoice}
                    onChange={(e) => handleInputChange('syaratPenerimaanInvoice', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Masukkan syarat penerimaan invoice..."
                  />
                </div>
              </div>

              {/* Transportasi & Akomodasi (Required) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Transportasi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Transportasi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.transportasi}
                    onChange={(e) => handleInputChange('transportasi', e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${errors.transportasi ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    placeholder="Detail kebutuhan transportasi proyek..."
                  />
                  {errors.transportasi && (
                    <p className="mt-1 text-sm text-red-600">{errors.transportasi}</p>
                  )}
                </div>

                {/* Akomodasi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Akomodasi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.akomodasi}
                    onChange={(e) => handleInputChange('akomodasi', e.target.value)}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${errors.akomodasi ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    placeholder="Detail kebutuhan akomodasi proyek..."
                  />
                  {errors.akomodasi && (
                    <p className="mt-1 text-sm text-red-600">{errors.akomodasi}</p>
                  )}
                </div>
              </div>

              {/* Syarat Penagihan Dokumen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Syarat Penagihan Dokumen
                </label>
                <textarea
                  value={formData.syaratPenagihanDokumen}
                  onChange={(e) => handleInputChange('syaratPenagihanDokumen', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Masukkan syarat penagihan dokumen..."
                />
              </div>

              {/* Document Table */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dokumen
                </label>
                <div className="overflow-x-auto border border-gray-200 rounded-xl">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">No</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Dokumen</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-500">1</td>
                        <td className="px-4 py-3 text-sm text-gray-500">-</td>
                      </tr>
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
            disabled={isLoading}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span>Menyimpan...</span>
            ) : (
              <span>Simpan</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KickOffModal;
