import React, { useEffect, useState } from 'react';
import { X, Save, User, Calendar, DollarSign, CreditCard, FileText, Percent } from 'lucide-react';
import { PPh23Data } from '../types';

interface EntryPPh23ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: PPh23Data) => void;
  itemToEdit?: PPh23Data | null;
}

const EntryPPh23Modal: React.FC<EntryPPh23ModalProps> = ({ isOpen, onClose, onSave, itemToEdit }) => {
  const initialFormState: PPh23Data = {
    id: 0,
    namaPihak: '',
    npwp: '',
    tanggal: '',
    keteranganTransaksi: '',
    dpp: 0,
    persentase: 0.02, // Default 2%
    pph23: 0,
  };

  const [formData, setFormData] = useState<PPh23Data>(initialFormState);

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
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, itemToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: ['dpp', 'persentase', 'pph23'].includes(name) ? parseFloat(value) || 0 : value,
      };
      
      // Auto-calculate PPh23 when DPP or persentase changes
      if (name === 'dpp' || name === 'persentase') {
        const dpp = name === 'dpp' ? parseFloat(value) || 0 : newData.dpp;
        const persentase = name === 'persentase' ? parseFloat(value) || 0 : newData.persentase;
        newData.pph23 = dpp * persentase;
      }
      
      return newData;
    });
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
              {itemToEdit ? 'Edit Data PPh 23' : 'Tambah Data PPh 23'}
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
            <label htmlFor="namaPihak" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Pihak
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                id="namaPihak"
                name="namaPihak"
                value={formData.namaPihak}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Masukkan nama pihak"
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
            <label htmlFor="keteranganTransaksi" className="block text-sm font-medium text-gray-700 mb-1">
              Keterangan Transaksi
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <textarea
                id="keteranganTransaksi"
                name="keteranganTransaksi"
                value={formData.keteranganTransaksi}
                onChange={handleChange}
                rows={3}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                placeholder="Masukkan keterangan transaksi"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="dpp" className="block text-sm font-medium text-gray-700 mb-1">
                DPP (Dasar Pengenaan Pajak)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  id="dpp"
                  name="dpp"
                  value={formData.dpp}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="Masukkan DPP"
                  min={0}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="persentase" className="block text-sm font-medium text-gray-700 mb-1">
                Persentase (%)
              </label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="number"
                  id="persentase"
                  name="persentase"
                  value={formData.persentase * 100}
                  onChange={(e) => handleChange({...e, target: {...e.target, name: 'persentase', value: (parseFloat(e.target.value) / 100).toString()}})}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="2.0"
                  min={0}
                  max={100}
                  step={0.1}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="pph23" className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah PPh 23 (Auto-calculated)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="number"
                id="pph23"
                name="pph23"
                value={formData.pph23}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Otomatis dihitung dari DPP x Persentase"
                min={0}
                readOnly
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Nilai ini dihitung otomatis dari DPP × Persentase</p>
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

export default EntryPPh23Modal;
