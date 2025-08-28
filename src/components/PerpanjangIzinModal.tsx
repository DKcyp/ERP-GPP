import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { PerpanjangIzinFormData } from '../types';

interface PerpanjangIzinModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: Partial<PerpanjangIzinFormData>;
  onSubmit: (data: PerpanjangIzinFormData) => void;
}

const PerpanjangIzinModal: React.FC<PerpanjangIzinModalProps> = ({ isOpen, onClose, initialData, onSubmit }) => {
  const [formData, setFormData] = useState<PerpanjangIzinFormData>({
    namaAlat: '',
    kodeBarang: '',
    noSeri: '',
    jenisPerizinan: '',
    alasan: '', // Initialize new field
    ...initialData,
  });

  useEffect(() => {
    setFormData({
      namaAlat: '',
      kodeBarang: '',
      noSeri: '',
      jenisPerizinan: '',
      alasan: '',
      ...initialData,
    });
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pengajuan Perpanjang Izin" size="3xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="namaAlat" className="block text-sm font-medium text-textSecondary mb-1">
              Nama Alat
            </label>
            <input
              type="text"
              id="namaAlat"
              name="namaAlat"
              value={formData.namaAlat}
              readOnly
              className="w-full px-4 py-2 rounded-lg bg-background border border-border text-text focus:ring-primary focus:border-primary transition-all duration-200 cursor-not-allowed"
            />
          </div>
          <div>
            <label htmlFor="kodeBarang" className="block text-sm font-medium text-textSecondary mb-1">
              Kode Barang
            </label>
            <input
              type="text"
              id="kodeBarang"
              name="kodeBarang"
              value={formData.kodeBarang}
              readOnly
              className="w-full px-4 py-2 rounded-lg bg-background border border-border text-text focus:ring-primary focus:border-primary transition-all duration-200 cursor-not-allowed"
            />
          </div>
          <div>
            <label htmlFor="noSeri" className="block text-sm font-medium text-textSecondary mb-1">
              No Seri
            </label>
            <input
              type="text"
              id="noSeri"
              name="noSeri"
              value={formData.noSeri}
              readOnly
              className="w-full px-4 py-2 rounded-lg bg-background border border-border text-text focus:ring-primary focus:border-primary transition-all duration-200 cursor-not-allowed"
            />
          </div>
          <div>
            <label htmlFor="jenisPerizinan" className="block text-sm font-medium text-textSecondary mb-1">
              Jenis Perizinan
            </label>
            <input
              type="text"
              id="jenisPerizinan"
              name="jenisPerizinan"
              value={formData.jenisPerizinan}
              readOnly
              className="w-full px-4 py-2 rounded-lg bg-background border border-border text-text focus:ring-primary focus:border-primary transition-all duration-200 cursor-not-allowed"
            />
          </div>
        </div>
        <div>
          <label htmlFor="alasan" className="block text-sm font-medium text-textSecondary mb-1">
            Alasan
          </label>
          <textarea
            id="alasan"
            name="alasan"
            value={formData.alasan}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 rounded-lg bg-surface border border-border text-text focus:ring-primary focus:border-primary transition-all duration-200"
          ></textarea>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-textSecondary bg-background hover:bg-border transition-colors duration-200"
          >
            Close
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors duration-200"
          >
            Simpan
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PerpanjangIzinModal;
