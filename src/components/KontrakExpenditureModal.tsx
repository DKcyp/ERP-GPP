import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface KontrakExpenditureItem {
  id: string;
  noSO: string;
  noKontrak: string;
  jenisPekerjaan: string;
  client: string;
  periodeDari: string;
  periodeSampai: string;
}

interface KontrakExpenditureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: KontrakExpenditureItem) => void;
  itemToEdit?: KontrakExpenditureItem | null;
}

const KontrakExpenditureModal: React.FC<KontrakExpenditureModalProps> = ({
  isOpen,
  onClose,
  onSave,
  itemToEdit,
}) => {
  const [formData, setFormData] = useState<KontrakExpenditureItem>({
    id: '',
    noSO: '',
    noKontrak: '',
    jenisPekerjaan: '',
    client: '',
    periodeDari: '',
    periodeSampai: '',
  });

  useEffect(() => {
    if (itemToEdit) {
      setFormData(itemToEdit);
    } else {
      setFormData({
        id: '',
        noSO: '',
        noKontrak: '',
        jenisPekerjaan: '',
        client: '',
        periodeDari: '',
        periodeSampai: '',
      });
    }
  }, [itemToEdit, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: formData.id || `temp-${Date.now()}` });
    onClose();
  };

  if (!isOpen) return null;

  const jenisPekerjaanOptions = ['Konstruksi', 'Manufaktur', 'Jasa'];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {itemToEdit ? 'Edit Kontrak Expenditure' : 'Tambah Kontrak Expenditure'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="noSO" className="block text-sm font-medium text-gray-700">No SO</label>
            <input
              type="text"
              id="noSO"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.noSO}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="noKontrak" className="block text-sm font-medium text-gray-700">No Kontrak</label>
            <input
              type="text"
              id="noKontrak"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.noKontrak}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="jenisPekerjaan" className="block text-sm font-medium text-gray-700">Jenis Pekerjaan</label>
            <select
              id="jenisPekerjaan"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.jenisPekerjaan}
              onChange={handleInputChange}
              required
            >
              <option value="">Pilih Jenis Pekerjaan</option>
              {jenisPekerjaanOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="client" className="block text-sm font-medium text-gray-700">Client</label>
            <input
              type="text"
              id="client"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.client}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="periodeDari" className="block text-sm font-medium text-gray-700">Periode Dari</label>
            <input
              type="date"
              id="periodeDari"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.periodeDari}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="periodeSampai" className="block text-sm font-medium text-gray-700">Periode Sampai</label>
            <input
              type="date"
              id="periodeSampai"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              value={formData.periodeSampai}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KontrakExpenditureModal;