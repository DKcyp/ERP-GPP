import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { X, Save, AlertCircle, Clock } from 'lucide-react'; // Added Clock import here

interface EntryProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (program: Omit<ProgramItem, 'id'>) => void;
}

interface ProgramItem {
  id: string;
  program: string;
  tanggal: string;
  realisasi: string;
  documentUrl: string;
}

const EntryProgramModal: React.FC<EntryProgramModalProps> = ({ isOpen, onClose, onSave }) => {
  const [program, setProgram] = useState('');
  const [tanggal, setTanggal] = useState<Date | null>(null);
  const [realisasi, setRealisasi] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setProgram('');
      setTanggal(null);
      setRealisasi('');
      setDocumentUrl('');
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!program.trim()) newErrors.program = 'Nama Program wajib diisi.';
    if (!tanggal) newErrors.tanggal = 'Tanggal wajib diisi.';
    if (!realisasi.trim()) newErrors.realisasi = 'Realisasi wajib diisi.';
    if (!documentUrl.trim()) newErrors.documentUrl = 'URL Dokumen wajib diisi.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        program,
        tanggal: tanggal!.toISOString().split('T')[0], // Format to YYYY-MM-DD
        realisasi,
        documentUrl,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-8 transform transition-all duration-300 scale-100 opacity-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Tambah Program Baru</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-2">Nama Program</label>
            <input
              type="text"
              id="program"
              className={`block w-full border ${errors.program ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              placeholder="Masukkan nama program"
            />
            {errors.program && <p className="mt-2 text-sm text-red-600 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.program}</p>}
          </div>

          <div>
            <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700 mb-2">Tanggal Program</label>
            <div className="relative">
              <DatePicker
                selected={tanggal}
                onChange={(date: Date | null) => setTanggal(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Pilih tanggal"
                className={`block w-full border ${errors.tanggal ? 'border-red-500' : 'border-gray-300'} rounded-lg pl-4 pr-10 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
              />
              <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            {errors.tanggal && <p className="mt-2 text-sm text-red-600 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.tanggal}</p>}
          </div>

          <div>
            <label htmlFor="realisasi" className="block text-sm font-medium text-gray-700 mb-2">Realisasi</label>
            <input
              type="text"
              id="realisasi"
              className={`block w-full border ${errors.realisasi ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
              value={realisasi}
              onChange={(e) => setRealisasi(e.target.value)}
              placeholder="Contoh: 80% atau Belum dimulai"
            />
            {errors.realisasi && <p className="mt-2 text-sm text-red-600 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.realisasi}</p>}
          </div>

          <div>
            <label htmlFor="documentUrl" className="block text-sm font-medium text-gray-700 mb-2">URL Dokumen</label>
            <input
              type="url"
              id="documentUrl"
              className={`block w-full border ${errors.documentUrl ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm`}
              value={documentUrl}
              onChange={(e) => setDocumentUrl(e.target.value)}
              placeholder="Masukkan URL dokumen terkait"
            />
            {errors.documentUrl && <p className="mt-2 text-sm text-red-600 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{errors.documentUrl}</p>}
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Save className="h-5 w-5 mr-2" /> Simpan Program
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntryProgramModal;
