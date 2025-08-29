import React, { useState, useEffect } from 'react';
import Modal from './Modal'; // Assuming Modal.tsx is in the same components directory

interface AlatSafetyFormData {
  kodeBarang: string;
  namaAlat: string;
  nomorSeri: string;
  kondisi: 'Baik' | 'Rusak Ringan' | 'Rusak Berat' | '';
}

interface EntryAlatSafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newData: AlatSafetyFormData) => void;
}

const EntryAlatSafetyModal: React.FC<EntryAlatSafetyModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<AlatSafetyFormData>({
    kodeBarang: '',
    namaAlat: '',
    nomorSeri: '',
    kondisi: '',
  });
  const [errors, setErrors] = useState<Partial<AlatSafetyFormData>>({});

  useEffect(() => {
    if (!isOpen) {
      // Reset form and errors when modal closes
      setFormData({
        kodeBarang: '',
        namaAlat: '',
        nomorSeri: '',
        kondisi: '',
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for the field being changed
    if (errors[name as keyof AlatSafetyFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<AlatSafetyFormData> = {};
    if (!formData.kodeBarang.trim()) newErrors.kodeBarang = 'Kode Barang is required';
    if (!formData.namaAlat.trim()) newErrors.namaAlat = 'Nama Alat is required';
    if (!formData.nomorSeri.trim()) newErrors.nomorSeri = 'Nomor Seri is required';
    if (!formData.kondisi) newErrors.kondisi = 'Kondisi is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tambah Alat Safety Baru" size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="kodeBarang" className="block text-sm font-medium text-text mb-1">
            Kode Barang
          </label>
          <input
            type="text"
            id="kodeBarang"
            name="kodeBarang"
            value={formData.kodeBarang}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg bg-surface border ${
              errors.kodeBarang ? 'border-error' : 'border-border'
            } focus:ring-primary focus:border-primary text-text text-sm`}
            placeholder="Contoh: KB-HS-001"
          />
          {errors.kodeBarang && <p className="mt-1 text-sm text-error">{errors.kodeBarang}</p>}
        </div>

        <div>
          <label htmlFor="namaAlat" className="block text-sm font-medium text-text mb-1">
            Nama Alat
          </label>
          <input
            type="text"
            id="namaAlat"
            name="namaAlat"
            value={formData.namaAlat}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg bg-surface border ${
              errors.namaAlat ? 'border-error' : 'border-border'
            } focus:ring-primary focus:border-primary text-text text-sm`}
            placeholder="Contoh: Helm Safety"
          />
          {errors.namaAlat && <p className="mt-1 text-sm text-error">{errors.namaAlat}</p>}
        </div>

        <div>
          <label htmlFor="nomorSeri" className="block text-sm font-medium text-text mb-1">
            Nomor Seri
          </label>
          <input
            type="text"
            id="nomorSeri"
            name="nomorSeri"
            value={formData.nomorSeri}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg bg-surface border ${
              errors.nomorSeri ? 'border-error' : 'border-border'
            } focus:ring-primary focus:border-primary text-text text-sm`}
            placeholder="Contoh: HS-2023-001"
          />
          {errors.nomorSeri && <p className="mt-1 text-sm text-error">{errors.nomorSeri}</p>}
        </div>

        <div>
          <label htmlFor="kondisi" className="block text-sm font-medium text-text mb-1">
            Kondisi
          </label>
          <select
            id="kondisi"
            name="kondisi"
            value={formData.kondisi}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-lg bg-surface border ${
              errors.kondisi ? 'border-error' : 'border-border'
            } focus:ring-primary focus:border-primary text-text text-sm appearance-none`}
          >
            <option value="">Pilih Kondisi</option>
            <option value="Baik">Baik</option>
            <option value="Rusak Ringan">Rusak Ringan</option>
            <option value="Rusak Berat">Rusak Berat</option>
          </select>
          {errors.kondisi && <p className="mt-1 text-sm text-error">{errors.kondisi}</p>}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-textSecondary border border-border hover:bg-surface-light transition-colors duration-200 text-sm font-medium"
          >
            Batal
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors duration-200 text-sm font-medium shadow-lg"
          >
            Simpan Alat Safety
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EntryAlatSafetyModal;
