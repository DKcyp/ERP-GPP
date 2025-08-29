import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { X, Calendar, FileText } from 'lucide-react';

interface ISOTOPAlat {
  id: string;
  namaAlat: string;
  tanggalAwal: string;
  tanggalAkhir: string;
  documentUrl: string;
}

interface EntryISOTOPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newAlat: Omit<ISOTOPAlat, 'id'>) => void;
}

const EntryISOTOPModal: React.FC<EntryISOTOPModalProps> = ({ isOpen, onClose, onSave }) => {
  const [namaAlat, setNamaAlat] = useState('');
  const [tanggalAwal, setTanggalAwal] = useState<Date | null>(null);
  const [tanggalAkhir, setTanggalAkhir] = useState<Date | null>(null);
  const [documentUrl, setDocumentUrl] = useState('');

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setNamaAlat('');
      setTanggalAwal(null);
      setTanggalAkhir(null);
      setDocumentUrl('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaAlat || !tanggalAwal || !tanggalAkhir || !documentUrl) {
      alert('Semua field harus diisi!');
      return;
    }

    onSave({
      namaAlat,
      tanggalAwal: tanggalAwal.toISOString().split('T')[0],
      tanggalAkhir: tanggalAkhir.toISOString().split('T')[0],
      documentUrl,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 relative transform transition-all duration-300 scale-100 opacity-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Tambah Alat ISOTOP Baru</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="namaAlat" className="block text-sm font-medium text-gray-700 mb-2">Nama Alat</label>
            <input
              type="text"
              id="namaAlat"
              className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="Masukkan nama alat"
              value={namaAlat}
              onChange={(e) => setNamaAlat(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="tanggalAwal" className="block text-sm font-medium text-gray-700 mb-2">Tanggal Awal</label>
            <div className="relative">
              <DatePicker
                selected={tanggalAwal}
                onChange={(date: Date | null) => setTanggalAwal(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Pilih tanggal awal"
                className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                required
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="tanggalAkhir" className="block text-sm font-medium text-gray-700 mb-2">Tanggal Akhir</label>
            <div className="relative">
              <DatePicker
                selected={tanggalAkhir}
                onChange={(date: Date | null) => setTanggalAkhir(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Pilih tanggal akhir"
                className="block w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                minDate={tanggalAwal}
                required
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div>
            <label htmlFor="documentUrl" className="block text-sm font-medium text-gray-700 mb-2">URL Dokumen</label>
            <div className="relative">
              <input
                type="url"
                id="documentUrl"
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="e.g., https://example.com/document.pdf"
                value={documentUrl}
                onChange={(e) => setDocumentUrl(e.target.value)}
                required
              />
              <FileText className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntryISOTOPModal;
