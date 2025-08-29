import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { X } from 'lucide-react';

interface PTIAlat {
  id: string;
  namaAlat: string;
  tanggalAwal: string;
  tanggalAkhir: string;
  documentUrl: string;
}

interface EntryPTIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newPTI: Omit<PTIAlat, 'id'>) => void;
}

const EntryPTIModal: React.FC<EntryPTIModalProps> = ({ isOpen, onClose, onSave }) => {
  const [namaAlat, setNamaAlat] = useState('');
  const [tanggalAwal, setTanggalAwal] = useState<Date | null>(null);
  const [tanggalAkhir, setTanggalAkhir] = useState<Date | null>(null);
  const [documentUrl, setDocumentUrl] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setNamaAlat('');
      setTanggalAwal(null);
      setTanggalAkhir(null);
      setDocumentUrl('');
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!namaAlat.trim()) newErrors.namaAlat = 'Nama Alat tidak boleh kosong.';
    if (!tanggalAwal) newErrors.tanggalAwal = 'Tanggal Awal tidak boleh kosong.';
    if (!tanggalAkhir) newErrors.tanggalAkhir = 'Tanggal Akhir tidak boleh kosong.';
    if (tanggalAwal && tanggalAkhir && tanggalAwal > tanggalAkhir) {
      newErrors.tanggalAkhir = 'Tanggal Akhir tidak boleh sebelum Tanggal Awal.';
    }
    if (!documentUrl.trim()) newErrors.documentUrl = 'URL Dokumen tidak boleh kosong.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const newPTI = {
      namaAlat,
      tanggalAwal: tanggalAwal!.toISOString().split('T')[0],
      tanggalAkhir: tanggalAkhir!.toISOString().split('T')[0],
      documentUrl,
    };
    onSave(newPTI);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 relative transform transition-all duration-300 scale-100 opacity-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Tambah Alat PTI Baru</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="namaAlat" className="block text-sm font-medium text-gray-700 mb-2">Nama Alat</label>
            <input
              type="text"
              id="namaAlat"
              className={`block w-full border ${errors.namaAlat ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
              placeholder="Masukkan nama alat..."
              value={namaAlat}
              onChange={(e) => setNamaAlat(e.target.value)}
            />
            {errors.namaAlat && <p className="mt-1 text-sm text-red-600">{errors.namaAlat}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="tanggalAwal" className="block text-sm font-medium text-gray-700 mb-2">Tanggal Awal</label>
              <DatePicker
                selected={tanggalAwal}
                onChange={(date: Date | null) => setTanggalAwal(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/yyyy"
                className={`block w-full border ${errors.tanggalAwal ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
              />
              {errors.tanggalAwal && <p className="mt-1 text-sm text-red-600">{errors.tanggalAwal}</p>}
            </div>
            <div>
              <label htmlFor="tanggalAkhir" className="block text-sm font-medium text-gray-700 mb-2">Tanggal Akhir</label>
              <DatePicker
                selected={tanggalAkhir}
                onChange={(date: Date | null) => setTanggalAkhir(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="dd/mm/yyyy"
                minDate={tanggalAwal}
                className={`block w-full border ${errors.tanggalAkhir ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
              />
              {errors.tanggalAkhir && <p className="mt-1 text-sm text-red-600">{errors.tanggalAkhir}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="documentUrl" className="block text-sm font-medium text-gray-700 mb-2">URL Dokumen</label>
            <input
              type="url"
              id="documentUrl"
              className={`block w-full border ${errors.documentUrl ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
              placeholder="e.g., https://example.com/document.pdf"
              value={documentUrl}
              onChange={(e) => setDocumentUrl(e.target.value)}
            />
            {errors.documentUrl && <p className="mt-1 text-sm text-red-600">{errors.documentUrl}</p>}
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntryPTIModal;
