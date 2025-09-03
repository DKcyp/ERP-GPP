import React, { useState } from 'react';
import { X } from 'lucide-react';
import { EvaluasiVendorFormData } from '../types';

interface EvaluasiVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EvaluasiVendorFormData) => void;
}

const EvaluasiVendorModal: React.FC<EvaluasiVendorModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<EvaluasiVendorFormData>({
    namaVendor: '',
    barangOnTime: 'Ya',
    sesuaiSpesifikasi: 'Ya',
    jumlahBarangSesuaiPO: '',
    mutu: 'Baik',
    k3: 'Ya',
  });

  const vendorOptions = [
    { value: 'Vendor A', label: 'Vendor A' },
    { value: 'Vendor B', label: 'Vendor B' },
    { value: 'Vendor C', label: 'Vendor C' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      namaVendor: '',
      barangOnTime: 'Ya',
      sesuaiSpesifikasi: 'Ya',
      jumlahBarangSesuaiPO: '',
      mutu: 'Baik',
      k3: 'Ya',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-3 text-xs">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
        <div className="flex justify-between items-center p-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Tambah Evaluasi Vendor</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label htmlFor="namaVendor" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Vendor
            </label>
            <select
              id="namaVendor"
              name="namaVendor"
              value={formData.namaVendor}
              onChange={handleChange}
              className="mt-1 block w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs"
              required
            >
              <option value="">Pilih Vendor</option>
              {vendorOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="barangOnTime" className="block text-sm font-medium text-gray-700 mb-1">
              Barang On Time?
            </label>
            <select
              id="barangOnTime"
              name="barangOnTime"
              value={formData.barangOnTime}
              onChange={handleChange}
              className="mt-1 block w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs"
              required
            >
              <option value="Ya">Ya</option>
              <option value="Tidak">Tidak</option>
            </select>
          </div>

          <div>
            <label htmlFor="sesuaiSpesifikasi" className="block text-sm font-medium text-gray-700 mb-1">
              Sesuai Spesifikasi?
            </label>
            <select
              id="sesuaiSpesifikasi"
              name="sesuaiSpesifikasi"
              value={formData.sesuaiSpesifikasi}
              onChange={handleChange}
              className="mt-1 block w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs"
              required
            >
              <option value="Ya">Ya</option>
              <option value="Tidak">Tidak</option>
            </select>
          </div>

          <div>
            <label htmlFor="mutu" className="block text-sm font-medium text-gray-700 mb-1">
              Mutu
            </label>
            <select
              id="mutu"
              name="mutu"
              value={formData.mutu}
              onChange={handleChange}
              className="mt-1 block w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs"
              required
            >
              <option value="Baik">Baik</option>
              <option value="Cukup">Cukup</option>
              <option value="Kurang">Kurang</option>
            </select>
          </div>

          <div>
            <label htmlFor="k3" className="block text-sm font-medium text-gray-700 mb-1">
              K3 (Keselamatan & Kesehatan Kerja)
            </label>
            <select
              id="k3"
              name="k3"
              value={formData.k3}
              onChange={handleChange}
              className="mt-1 block w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs"
              required
            >
              <option value="Ya">Ya</option>
              <option value="Tidak">Tidak</option>
            </select>
          </div>

          <div>
            <label htmlFor="jumlahBarangSesuaiPO" className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Barang Sesuai PO
            </label>
            <input
              type="number"
              id="jumlahBarangSesuaiPO"
              name="jumlahBarangSesuaiPO"
              value={formData.jumlahBarangSesuaiPO}
              onChange={handleChange}
              className="mt-1 block w-full px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-xs"
              placeholder="Masukkan jumlah barang"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-gray-200 -mx-4 px-4">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md text-xs font-medium text-gray-700 bg-gray-200 hover:bg-gray-300"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-md text-xs font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EvaluasiVendorModal;
