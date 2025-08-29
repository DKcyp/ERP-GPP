import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface PajakMasukanData {
  id: number;
  namaPengadaan: string;
  tanggal: string; // YYYY-MM-DD format for date input
  vendor: string;
  ppn: number; // e.g., 0.11 for 11%
  nilaiProject: number;
}

interface EntryPajakMasukanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<PajakMasukanData, 'id'> & { id?: number }) => void;
  itemToEdit?: PajakMasukanData | null;
}

const EntryPajakMasukanModal: React.FC<EntryPajakMasukanModalProps> = ({
  isOpen,
  onClose,
  onSave,
  itemToEdit,
}) => {
  const [formData, setFormData] = useState<Omit<PajakMasukanData, 'id'> & { id?: number }>({
    id: undefined,
    namaPengadaan: '',
    tanggal: '',
    vendor: '',
    ppn: 0.11, // Default to 11%
    nilaiProject: 0,
  });

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        id: itemToEdit.id,
        namaPengadaan: itemToEdit.namaPengadaan,
        tanggal: itemToEdit.tanggal,
        vendor: itemToEdit.vendor,
        ppn: itemToEdit.ppn,
        nilaiProject: itemToEdit.nilaiProject,
      });
    } else {
      setFormData({
        id: undefined,
        namaPengadaan: '',
        tanggal: '',
        vendor: '',
        ppn: 0.11,
        nilaiProject: 0,
      });
    }
  }, [itemToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'nilaiProject' || name === 'ppn' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-surface rounded-xl shadow-2xl p-6 w-full max-w-2xl transform transition-all duration-300 ease-out scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-4 border-b border-border mb-4">
          <h3 className="text-xl font-semibold text-text">
            {itemToEdit ? 'Edit Pajak Masukan' : 'Tambah Pajak Masukan'}
          </h3>
          <button
            onClick={onClose}
            className="text-textSecondary hover:text-text transition-colors duration-200"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="namaPengadaan" className="block text-sm font-medium text-textSecondary mb-1">
              Nama Pengadaan
            </label>
            <input
              type="text"
              id="namaPengadaan"
              name="namaPengadaan"
              value={formData.namaPengadaan}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:ring-primary focus:border-primary transition-all duration-200"
              required
            />
          </div>
          <div>
            <label htmlFor="tanggal" className="block text-sm font-medium text-textSecondary mb-1">
              Tanggal
            </label>
            <input
              type="date"
              id="tanggal"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:ring-primary focus:border-primary transition-all duration-200"
              required
            />
          </div>
          <div>
            <label htmlFor="vendor" className="block text-sm font-medium text-textSecondary mb-1">
              Vendor
            </label>
            <input
              type="text"
              id="vendor"
              name="vendor"
              value={formData.vendor}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:ring-primary focus:border-primary transition-all duration-200"
              required
            />
          </div>
          <div>
            <label htmlFor="ppn" className="block text-sm font-medium text-textSecondary mb-1">
              PPN (%)
            </label>
            <input
              type="number"
              id="ppn"
              name="ppn"
              value={formData.ppn * 100} // Display as percentage
              onChange={(e) => setFormData(prev => ({ ...prev, ppn: parseFloat(e.target.value) / 100 || 0 }))}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:ring-primary focus:border-primary transition-all duration-200"
              min="0"
              max="100"
              step="0.01"
              required
            />
          </div>
          <div>
            <label htmlFor="nilaiProject" className="block text-sm font-medium text-textSecondary mb-1">
              Nilai Project (IDR)
            </label>
            <input
              type="number"
              id="nilaiProject"
              name="nilaiProject"
              value={formData.nilaiProject}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:ring-primary focus:border-primary transition-all duration-200"
              min="0"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-textSecondary bg-background border border-border rounded-lg hover:bg-border transition-all duration-200 font-medium text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 font-medium flex items-center space-x-2 text-sm"
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

export default EntryPajakMasukanModal;
