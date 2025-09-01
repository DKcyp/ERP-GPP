import React, { useState, ChangeEvent, FormEvent } from 'react';
import { X, UploadCloud, FileText } from 'lucide-react';
import { RealisasiDocumentUploadFormData } from '../types';

interface RealisasiDocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: RealisasiDocumentUploadFormData) => void;
  noTraining: string; // Pass the noTraining from the selected item
}

const RealisasiDocumentUploadModal: React.FC<RealisasiDocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  noTraining,
}) => {
  const [formData, setFormData] = useState<RealisasiDocumentUploadFormData>({
    noTraining: noTraining,
    documentName: '',
    documentFile: null,
    keterangan: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Update formData when noTraining prop changes (e.g., when a new item is selected)
  React.useEffect(() => {
    setFormData(prev => ({ ...prev, noTraining: noTraining }));
  }, [noTraining]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' })); // Clear error on change
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData(prev => ({ ...prev, documentFile: file }));
    setErrors(prev => ({ ...prev, documentFile: '' })); // Clear error on change
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.documentName.trim()) {
      newErrors.documentName = 'Nama Dokumen wajib diisi.';
    }
    if (!formData.documentFile) {
      newErrors.documentFile = 'File Dokumen wajib diunggah.';
    }
    // Add more validation rules as needed
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onUpload(formData);
      // Reset form after successful upload
      setFormData({
        noTraining: noTraining,
        documentName: '',
        documentFile: null,
        keterangan: '',
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-2xl w-full max-w-md p-6 border border-border relative animate-in fade-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-textSecondary hover:text-text transition-colors"
          title="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold text-text mb-6 text-center">Upload Dokumen Realisasi</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="noTraining" className="block text-sm font-medium text-textSecondary mb-1">
              No Training
            </label>
            <input
              type="text"
              id="noTraining"
              name="noTraining"
              value={formData.noTraining}
              readOnly
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-text text-sm cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="documentName" className="block text-sm font-medium text-textSecondary mb-1">
              Nama Dokumen <span className="text-error">*</span>
            </label>
            <input
              type="text"
              id="documentName"
              name="documentName"
              value={formData.documentName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-surface text-text text-sm"
              placeholder="Contoh: Laporan Pelatihan Q1 2025"
            />
            {errors.documentName && <p className="text-error text-xs mt-1">{errors.documentName}</p>}
          </div>

          <div>
            <label htmlFor="documentFile" className="block text-sm font-medium text-textSecondary mb-1">
              File Dokumen <span className="text-error">*</span>
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="documentFile"
                className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer bg-background hover:bg-border/30 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadCloud className="w-6 h-6 text-textSecondary mb-1" />
                  <p className="mb-1 text-sm text-textSecondary">
                    <span className="font-semibold">Klik untuk mengunggah</span> atau seret & lepas
                  </p>
                  <p className="text-xs text-textSecondary">PDF, DOCX, XLSX (MAX. 5MB)</p>
                </div>
                <input id="documentFile" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.doc,.docx,.xls,.xlsx" />
              </label>
            </div>
            {formData.documentFile && (
              <p className="text-sm text-text mt-2 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <span>{formData.documentFile.name}</span>
              </p>
            )}
            {errors.documentFile && <p className="text-error text-xs mt-1">{errors.documentFile}</p>}
          </div>

          <div>
            <label htmlFor="keterangan" className="block text-sm font-medium text-textSecondary mb-1">
              Keterangan (Opsional)
            </label>
            <textarea
              id="keterangan"
              name="keterangan"
              value={formData.keterangan}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent bg-surface text-text text-sm"
              placeholder="Tambahkan keterangan tambahan mengenai dokumen realisasi..."
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-border hover:bg-border/80 text-text rounded-md font-medium transition-colors text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-md font-medium transition-colors text-sm flex items-center gap-2"
            >
              <UploadCloud className="h-4 w-4" />
              Unggah Dokumen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RealisasiDocumentUploadModal;
