import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Lock, X } from 'lucide-react';

interface TutupBukuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tanggalTutup: Date | null, bulan: string, tahun: string) => void;
  title: string;
}

const TutupBukuModal: React.FC<TutupBukuModalProps> = ({ isOpen, onClose, onSave, title }) => {
  const today = new Date();
  const [tanggalTutup, setTanggalTutup] = useState<Date | null>(today);
  const [bulan, setBulan] = useState<string>((today.getMonth() + 1).toString());
  const [tahun, setTahun] = useState<string>(today.getFullYear().toString());

  const months = [
    { value: '1', label: 'Januari' }, { value: '2', label: 'Februari' },
    { value: '3', label: 'Maret' }, { value: '4', label: 'April' },
    { value: '5', label: 'Mei' }, { value: '6', label: 'Juni' },
    { value: '7', label: 'Juli' }, { value: '8', label: 'Agustus' },
    { value: '9', label: 'September' }, { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' }, { value: '12', label: 'Desember' },
  ];

  const years = Array.from({ length: 5 }, (_, i) => (today.getFullYear() - i).toString());

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens for a new entry
      setTanggalTutup(today);
      setBulan((today.getMonth() + 1).toString());
      setTahun(today.getFullYear().toString());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave(tanggalTutup, bulan, tahun);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg transform transition-all duration-300 scale-100 opacity-100">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label htmlFor="tanggalTutup" className="block text-sm font-medium text-gray-700 mb-2">Tanggal Tutup Buku</label>
              <DatePicker
                selected={tanggalTutup}
                onChange={(date: Date | null) => setTanggalTutup(date)}
                dateFormat="dd/MM/yyyy"
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            <div>
              <label htmlFor="bulan" className="block text-sm font-medium text-gray-700 mb-2">Pilih Bulan</label>
              <select
                id="bulan"
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                value={bulan}
                onChange={(e) => setBulan(e.target.value)}
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label htmlFor="tahun" className="block text-sm font-medium text-gray-700 mb-2">Pilih Tahun</label>
              <select
                id="tahun"
                className="block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none"
                value={tahun}
                onChange={(e) => setTahun(e.target.value)}
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <Lock className="h-5 w-5 mr-2" /> Tutup Buku
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutupBukuModal;
