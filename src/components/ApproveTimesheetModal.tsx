import React, { useState, useEffect } from 'react';
import { X, Calendar, Save, Loader2, Plus, Trash2, Upload } from 'lucide-react';

interface ApproveTimesheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ApproveTimesheetFormData) => void;
}

export interface ApproveTimesheetFormData {
  nama: string;
  mob: string;
  demob: string;
  durasi: string;
  namaProject: string;
  noSO: string;
  noHPP: string;
  lokasi: string;
  namaClient: string;
  jenisPekerjaan: 'On Call' | 'Tender';
  kualifikasi: string[];
  tunjangan: Array<{
    namaTunjangan: string;
    rateTunjangan: string;
    overtime: string;
  }>;
}

const ApproveTimesheetModal: React.FC<ApproveTimesheetModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<ApproveTimesheetFormData>({
    nama: 'John Doe',
    mob: '01/02/2025',
    demob: '15/02/2025',
    durasi: '15 Hari',
    namaProject: 'Proyek Jembatan A',
    noSO: 'S0001',
    noHPP: 'S00001.1',
    lokasi: 'Bali',
    namaClient: 'PT Konstruksi Sejahtera',
    jenisPekerjaan: 'On Call',
    kualifikasi: ['Welder', 'Engineer'],
    tunjangan: [
      { namaTunjangan: 'Team Leader - Daily Rate/', rateTunjangan: 'Rp. 750,000', overtime: 'Rp. 187,500 (3 Jam)' },
      { namaTunjangan: 'Team Leader-Daily Basic M', rateTunjangan: 'Rp. 500,000', overtime: '' },
      { namaTunjangan: 'Team Leader-Daily Basic M', rateTunjangan: 'Rp. 550,000', overtime: '' }
    ]
  });

  const [errors, setErrors] = useState<Partial<ApproveTimesheetFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const clientOptions = [
    'PT Konstruksi Sejahtera',
    'PT Pembangunan Nasional',
    'CV Infrastruktur Jaya',
    'PT Teknologi Maju',
    'CV Digital Solutions'
  ];

  const kualifikasiOptions = [
    'Welder',
    'Engineer',
    'Supervisor',
    'Technician',
    'Safety Officer',
    'Quality Inspector'
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

  const handleInputChange = (field: keyof ApproveTimesheetFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleTunjanganChange = (index: number, field: keyof ApproveTimesheetFormData['tunjangan'][0], value: string) => {
    const newTunjangan = [...formData.tunjangan];
    newTunjangan[index] = { ...newTunjangan[index], [field]: value };
    setFormData(prev => ({ ...prev, tunjangan: newTunjangan }));
  };

  const addTunjangan = () => {
    setFormData(prev => ({
      ...prev,
      tunjangan: [...prev.tunjangan, { namaTunjangan: '', rateTunjangan: '', overtime: '' }]
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

  const handleKualifikasiChange = (kualifikasi: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        kualifikasi: [...prev.kualifikasi, kualifikasi]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        kualifikasi: prev.kualifikasi.filter(k => k !== kualifikasi)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onSave(formData);
    setIsLoading(false);
    
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
          <h2 className="text-2xl font-bold text-gray-900">Approve Timesheet</h2>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Nama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama
                </label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => handleInputChange('nama', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="John Doe"
                />
              </div>

              {/* MOB */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  MOB
                </label>
                <input
                  type="text"
                  value={formData.mob}
                  onChange={(e) => handleInputChange('mob', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="01/02/2025"
                />
              </div>

              {/* Durasi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Durasi
                </label>
                <input
                  type="text"
                  value={formData.durasi}
                  onChange={(e) => handleInputChange('durasi', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="15 Hari"
                />
              </div>

              {/* DEMOB */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DEMOB
                </label>
                <input
                  type="text"
                  value={formData.demob}
                  onChange={(e) => handleInputChange('demob', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="15/02/2025"
                />
              </div>

              {/* Nama Project */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Project
                </label>
                <input
                  type="text"
                  value={formData.namaProject}
                  onChange={(e) => handleInputChange('namaProject', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Proyek Jembatan A"
                />
              </div>

              {/* No SO */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No SO
                </label>
                <input
                  type="text"
                  value={formData.noSO}
                  onChange={(e) => handleInputChange('noSO', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="S0001"
                />
              </div>

              {/* Lokasi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lokasi
                </label>
                <input
                  type="text"
                  value={formData.lokasi}
                  onChange={(e) => handleInputChange('lokasi', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Bali"
                />
              </div>

              {/* No HPP */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  No HPP
                </label>
                <input
                  type="text"
                  value={formData.noHPP}
                  onChange={(e) => handleInputChange('noHPP', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="S00001.1"
                />
              </div>

              {/* Nama Client */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Client
                </label>
                <select
                  value={formData.namaClient}
                  onChange={(e) => handleInputChange('namaClient', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  {clientOptions.map((client) => (
                    <option key={client} value={client}>{client}</option>
                  ))}
                </select>
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
            </div>

            {/* Kualifikasi Section */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Kualifikasi
              </label>
              <div className="flex flex-wrap gap-2">
                {kualifikasiOptions.map((kualifikasi) => (
                  <label key={kualifikasi} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.kualifikasi.includes(kualifikasi)}
                      onChange={(e) => handleKualifikasiChange(kualifikasi, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{kualifikasi}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Dokumen Timesheet Section */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Dokumen Timesheet
              </label>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Unduh Timesheet</span>
              </button>
            </div>

            {/* Tunjangan Section */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tunjangan
              </label>
              
              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nama Tunjangan</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Rate Tunjangan</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Overtime</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {formData.tunjangan.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={item.namaTunjangan}
                            onChange={(e) => handleTunjanganChange(index, 'namaTunjangan', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Team Leader - Daily Rate/"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                            <input
                              type="text"
                              value={item.rateTunjangan}
                              onChange={(e) => handleTunjanganChange(index, 'rateTunjangan', e.target.value)}
                              className="w-full pl-6 pr-2 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Rp. 750,000"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                            <input
                              type="text"
                              value={item.overtime}
                              onChange={(e) => handleTunjanganChange(index, 'overtime', e.target.value)}
                              className="w-full pl-6 pr-8 py-1 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Rp. 187,500 (3 Jam)"
                            />
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 border border-gray-300 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => removeTunjangan(index)}
                            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={formData.tunjangan.length === 1}
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Tunjangan Button */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={addTunjangan}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Tambah Tunjangan</span>
                </button>
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
                <span>Approve</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApproveTimesheetModal;
