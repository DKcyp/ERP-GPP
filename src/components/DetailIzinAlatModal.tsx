import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import { DetailIzinAlatFormData } from '../types';

interface DetailIzinAlatModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: Partial<DetailIzinAlatFormData>;
  onSubmit: (data: DetailIzinAlatFormData) => void;
}

const DetailIzinAlatModal: React.FC<DetailIzinAlatModalProps> = ({ isOpen, onClose, initialData, onSubmit }) => {
  const [formData, setFormData] = useState<DetailIzinAlatFormData>({
    kodeBarang: '',
    namaAlat: '',
    noSeri: '',
    jenisPerizinan: '',
    noDokumen: '',
    tanggalMulaiBerlaku: '',
    tanggalBerakhir: '',
    uploadDokumen: null, // Initialize new field
    ...initialData,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData({
      kodeBarang: '',
      namaAlat: '',
      noSeri: '',
      jenisPerizinan: '',
      noDokumen: '',
      tanggalMulaiBerlaku: '',
      tanggalBerakhir: '',
      uploadDokumen: null,
      ...initialData,
    });
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, uploadDokumen: e.target.files![0] }));
    } else {
      setFormData((prev) => ({ ...prev, uploadDokumen: null }));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFormData((prev) => ({ ...prev, uploadDokumen: e.dataTransfer.files![0] }));
      e.dataTransfer.clearData();
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detail Izin Alat" size="4xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div>
            <label htmlFor="noDokumen" className="block text-sm font-medium text-textSecondary mb-1">
              No Dokumen
            </label>
            <input
              type="text"
              id="noDokumen"
              name="noDokumen"
              value={formData.noDokumen}
              readOnly
              className="w-full px-4 py-2 rounded-lg bg-background border border-border text-text focus:ring-primary focus:border-primary transition-all duration-200 cursor-not-allowed"
            />
          </div>
          <div>
            <label htmlFor="tanggalMulaiBerlaku" className="block text-sm font-medium text-textSecondary mb-1">
              Tanggal Mulai Berlaku
            </label>
            <input
              type="date"
              id="tanggalMulaiBerlaku"
              name="tanggalMulaiBerlaku"
              value={formData.tanggalMulaiBerlaku}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-surface border border-border text-text focus:ring-primary focus:border-primary transition-all duration-200"
            />
          </div>
          <div>
            <label htmlFor="tanggalBerakhir" className="block text-sm font-medium text-textSecondary mb-1">
              Tanggal Berakhir
            </label>
            <input
              type="date"
              id="tanggalBerakhir"
              name="tanggalBerakhir"
              value={formData.tanggalBerakhir}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-surface border border-border text-text focus:ring-primary focus:border-primary transition-all duration-200"
            />
          </div>
          <div>
            <label htmlFor="uploadDokumen" className="block text-sm font-medium text-textSecondary mb-1">
              Upload Dokumen
            </label>
            <div
              className="flex items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg bg-background hover:bg-background/50 transition-colors duration-200 cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handleBrowseClick}
            >
              <input
                type="file"
                id="uploadDokumen"
                name="uploadDokumen"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-textSecondary text-sm">
                {formData.uploadDokumen ? formData.uploadDokumen.name : 'Drag & Drop your files or Browse'}
              </p>
            </div>
          </div>
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

export default DetailIzinAlatModal;
