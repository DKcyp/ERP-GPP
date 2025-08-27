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
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Tambah Evaluasi Vendor</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="namaVendor" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Vendor
            </label>
            <select
              id="namaVendor"
              name="namaVendor"
              value={formData.namaVendor}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Masukkan jumlah barang"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 -mx-6 px-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
