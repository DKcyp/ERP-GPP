import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface PajakKeluaranData {
  id: number;
  namaProject: string;
  tanggal: string;
  customer: string;
  ppn: string; // Keeping as string based on dummy data, e.g., "11%"
  nilaiProject: number;
}

interface EntryPajakKeluaranModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: PajakKeluaranData) => void;
  itemToEdit: PajakKeluaranData | null;
}

const EntryPajakKeluaranModal: React.FC<EntryPajakKeluaranModalProps> = ({
  isOpen,
  onClose,
  onSave,
  itemToEdit,
}) => {
  const [formData, setFormData] = useState<Omit<PajakKeluaranData, 'id'>>({
    namaProject: '',
    tanggal: new Date().toISOString().split('T')[0], // Default to current date
    customer: '',
    ppn: '11%', // Default PPN
    nilaiProject: 0,
  });

  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        setFormData({
          namaProject: itemToEdit.namaProject,
          tanggal: itemToEdit.tanggal,
          customer: itemToEdit.customer,
          ppn: itemToEdit.ppn,
          nilaiProject: itemToEdit.nilaiProject,
        });
      } else {
        // Reset form for new entry
        setFormData({
          namaProject: '',
          tanggal: new Date().toISOString().split('T')[0],
          customer: '',
          ppn: '11%',
          nilaiProject: 0,
        });
      }
    }
  }, [isOpen, itemToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'nilaiProject' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: itemToEdit ? itemToEdit.id : Date.now(), // Use existing ID or generate new one
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-xl font-bold text-gray-900">
            {itemToEdit ? 'Edit Data Pajak Keluaran' : 'Tambah Data Pajak Keluaran'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label htmlFor="namaProject" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Project
            </label>
            <input
              type="text"
              id="namaProject"
              name="namaProject"
              value={formData.namaProject}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Contoh: Pengembangan Aplikasi Mobile"
              required
            />
          </div>

          <div>
            <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal
            </label>
            <input
              type="date"
              id="tanggal"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              required
            />
          </div>

          <div>
            <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-1">
              Customer
            </label>
            <input
              type="text"
              id="customer"
              name="customer"
              value={formData.customer}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Contoh: PT Global Solusi"
              required
            />
          </div>

          <div>
            <label htmlFor="ppn" className="block text-sm font-medium text-gray-700 mb-1">
              PPN (%)
            </label>
            <input
              type="text" // Keeping as text input to allow "11%" format
              id="ppn"
              name="ppn"
              value={formData.ppn}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Contoh: 11%"
              required
            />
          </div>

          <div>
            <label htmlFor="nilaiProject" className="block text-sm font-medium text-gray-700 mb-1">
              Nilai Project (IDR)
            </label>
            <input
              type="number"
              id="nilaiProject"
              name="nilaiProject"
              value={formData.nilaiProject}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Contoh: 30000000"
              required
              min="0"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 bg-gray-50 -mx-6 -mb-6 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transition-all duration-200 font-medium flex items-center space-x-2 text-sm"
            >
              <Save className="h-4 w-4" />
              <span>{itemToEdit ? 'Simpan Perubahan' : 'Tambah Data'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EntryPajakKeluaranModal;
