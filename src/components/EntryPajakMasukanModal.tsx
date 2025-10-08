import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

interface PajakMasukanData {
  id: number;
  tanggal: string; // YYYY-MM-DD format for date input
  namaSupplier: string;
  nomorPO: string;
  nomorInvoice: string;
  nomorFP: string;
  nilaiDPP: number;
  nilaiPPN: number;
  keterangan: string;
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
    tanggal: '',
    namaSupplier: '',
    nomorPO: '',
    nomorInvoice: '',
    nomorFP: '',
    nilaiDPP: 0,
    nilaiPPN: 0,
    keterangan: '',
  });

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        id: itemToEdit.id,
        tanggal: itemToEdit.tanggal,
        namaSupplier: itemToEdit.namaSupplier,
        nomorPO: itemToEdit.nomorPO,
        nomorInvoice: itemToEdit.nomorInvoice,
        nomorFP: itemToEdit.nomorFP,
        nilaiDPP: itemToEdit.nilaiDPP,
        nilaiPPN: itemToEdit.nilaiPPN,
        keterangan: itemToEdit.keterangan,
      });
    } else {
      setFormData({
        id: undefined,
        tanggal: '',
        namaSupplier: '',
        nomorPO: '',
        nomorInvoice: '',
        nomorFP: '',
        nilaiDPP: 0,
        nilaiPPN: 0,
        keterangan: '',
      });
    }
  }, [itemToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'nilaiDPP' || name === 'nilaiPPN' ? parseFloat(value) || 0 : value,
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
            <label htmlFor="namaSupplier" className="block text-sm font-medium text-textSecondary mb-1">
              Nama Supplier
            </label>
            <input
              type="text"
              id="namaSupplier"
              name="namaSupplier"
              value={formData.namaSupplier}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:ring-primary focus:border-primary transition-all duration-200"
              required
            />
          </div>
          <div>
            <label htmlFor="nomorPO" className="block text-sm font-medium text-textSecondary mb-1">
              Nomor PO
            </label>
            <input
              type="text"
              id="nomorPO"
              name="nomorPO"
              value={formData.nomorPO}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:ring-primary focus:border-primary transition-all duration-200"
              required
            />
          </div>
          <div>
            <label htmlFor="nomorInvoice" className="block text-sm font-medium text-textSecondary mb-1">
              Nomor Invoice
            </label>
            <input
              type="text"
              id="nomorInvoice"
              name="nomorInvoice"
              value={formData.nomorInvoice}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:ring-primary focus:border-primary transition-all duration-200"
              required
            />
          </div>
          <div>
            <label htmlFor="nomorFP" className="block text-sm font-medium text-textSecondary mb-1">
              Nomor FP
            </label>
            <input
              type="text"
              id="nomorFP"
              name="nomorFP"
              value={formData.nomorFP}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:ring-primary focus:border-primary transition-all duration-200"
              required
            />
          </div>
          <div>
            <label htmlFor="nilaiDPP" className="block text-sm font-medium text-textSecondary mb-1">
              Nilai DPP (IDR)
            </label>
            <input
              type="number"
              id="nilaiDPP"
              name="nilaiDPP"
              value={formData.nilaiDPP}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:ring-primary focus:border-primary transition-all duration-200"
              min="0"
              required
            />
          </div>
          <div>
            <label htmlFor="nilaiPPN" className="block text-sm font-medium text-textSecondary mb-1">
              Nilai PPN (IDR)
            </label>
            <input
              type="number"
              id="nilaiPPN"
              name="nilaiPPN"
              value={formData.nilaiPPN}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:ring-primary focus:border-primary transition-all duration-200"
              min="0"
              required
            />
          </div>
          <div>
            <label htmlFor="keterangan" className="block text-sm font-medium text-textSecondary mb-1">
              Keterangan
            </label>
            <textarea
              id="keterangan"
              name="keterangan"
              value={formData.keterangan}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text focus:ring-primary focus:border-primary transition-all duration-200"
              placeholder="Masukkan keterangan (opsional)"
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
