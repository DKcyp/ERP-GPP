import React, { useState, useEffect } from 'react';
import { X, Save, User, Calendar, DollarSign, CreditCard } from 'lucide-react';
import { PPh21Data } from '../types';

interface EntryPPh21ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: PPh21Data) => void;
  itemToEdit?: PPh21Data | null;
}

const EntryPPh21Modal: React.FC<EntryPPh21ModalProps> = ({ isOpen, onClose, onSave, itemToEdit }) => {
  const initialFormState: PPh21Data = {
    id: 0,
    namaPegawai: '',
    npwp: '',
    tanggal: '',
    pph21: 0,
  };

  const [formData, setFormData] = useState<PPh21Data>(initialFormState);

  useEffect(() => {
    if (isOpen) {
      if (itemToEdit) {
        setFormData(itemToEdit);
      } else {
        setFormData(initialFormState);
      }
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, itemToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'pph21' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 fade-in-0 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {itemToEdit ? 'Edit Data PPh 21' : 'Tambah Data PPh 21'}
            </h2>
          </div>
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
            <label htmlFor="namaPegawai" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Pegawai
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                id="namaPegawai"
                name="namaPegawai"
                value={formData.namaPegawai}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Masukkan nama pegawai"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="npwp" className="block text-sm font-medium text-gray-700 mb-1">
              NPWP
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                id="npwp"
                name="npwp"
                value={formData.npwp}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Masukkan NPWP"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="tanggal" className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                id="tanggal"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="pph21" className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah PPh 21
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="number"
                id="pph21"
                name="pph21"
                value={formData.pph21}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Masukkan jumlah PPh 21"
                required
                min="0"
              />
            </div>
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

export default EntryPPh21Modal;
