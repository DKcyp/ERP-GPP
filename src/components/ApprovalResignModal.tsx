import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Save, Loader2, UploadCloud } from 'lucide-react';
import { ApprovalResignFormData } from '../types';

interface ResignDataForModal {
  id: string;
  namaPegawai: string;
  tanggalResign: string;
}

interface ApprovalResignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string, approvalDetails: { alasanResign: string; lampiranSurat: File[] }) => void;
  initialData: ResignDataForModal | null;
}

const ApprovalResignModal: React.FC<ApprovalResignModalProps> = ({ isOpen, onClose, onApprove, initialData }) => {
  const [formData, setFormData] = useState<ApprovalResignFormData>({
    nama: '',
    jabatan: 'Pegawai', // Default value as per image
    tanggalResign: '',
    alasanResign: '-', // Default value as per image
    lampiranSurat: [],
    jangkaWaktuApproval: '1 Minggu', // Default value as per image
  });
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        nama: initialData.namaPegawai,
        jabatan: 'Pegawai', // Default or fetch from user data
        tanggalResign: initialData.tanggalResign,
        alasanResign: '-',
        lampiranSurat: [],
        jangkaWaktuApproval: '1 Minggu',
      });
    } else if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        nama: '',
        jabatan: 'Pegawai',
        tanggalResign: '',
        alasanResign: '-',
        lampiranSurat: [],
        jangkaWaktuApproval: '1 Minggu',
      });
    }

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
  }, [isOpen, onClose, initialData]);

  const handleInputChange = (field: keyof ApprovalResignFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setFormData(prev => ({ ...prev, lampiranSurat: [...prev.lampiranSurat, ...files] }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, lampiranSurat: [...prev.lampiranSurat, ...files] }));
  };

  const handleRemoveFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      lampiranSurat: prev.lampiranSurat.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialData) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

    onApprove(initialData.id, {
      alasanResign: formData.alasanResign,
      lampiranSurat: formData.lampiranSurat,
    });

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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-2xl font-bold text-gray-900">Approval Resign</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-160px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Nama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama
              </label>
              <input
                type="text"
                value={formData.nama}
                readOnly
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed"
              />
            </div>

            {/* Jabatan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jabatan
              </label>
              <input
                type="text"
                value={formData.jabatan}
                readOnly
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed"
              />
            </div>

            {/* Tanggal Resign */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Resign
              </label>
              <div className="relative">
                <input
                  type="text" // Changed to text as per image, but could be date if editable
                  value={formData.tanggalResign}
                  readOnly
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Alasan Resign */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alasan Resign
              </label>
              <textarea
                value={formData.alasanResign}
                onChange={(e) => handleInputChange('alasanResign', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Tambahkan alasan..."
              ></textarea>
            </div>

            {/* Lampiran Surat */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Lampiran Surat
              </label>
              <div
                className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl transition-all duration-200 ${
                  formData.lampiranSurat.length > 0 ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50'
                }`}
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-gray-600 text-sm">
                  Drag & Drop your files or <span className="text-blue-600 font-medium cursor-pointer">Browse</span>
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              {formData.lampiranSurat.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-700">Files:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {formData.lampiranSurat.map((file, index) => (
                      <li key={index} className="flex items-center justify-between text-xs text-gray-800 bg-gray-100 p-1.5 rounded-md">
                        <span>{file.name}</span>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleRemoveFile(index); }}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Jangka Waktu Approval */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jangka Waktu Approval
              </label>
              <input
                type="text"
                value={formData.jangkaWaktuApproval}
                readOnly
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 cursor-not-allowed"
              />
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
                <span>Approving...</span>
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

export default ApprovalResignModal;
