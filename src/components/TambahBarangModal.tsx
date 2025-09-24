import React, { useState } from 'react';
import { X, CalendarDays } from 'lucide-react';

interface TambahBarangModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TambahBarangModal: React.FC<TambahBarangModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    kodeBarang: '',
    namaBarang: '',
    kategori: '',
    noSeri: '',
    hargaBeli: '',
    hargaJual: '',
    quantity: '',
    satuan: '',
    masaExpired: '',
    barangActive: 'active', // 'active' or 'non-active'
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'radio' ? (checked ? value : prev[name as keyof typeof prev]) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    // Here you would typically send data to an API
    onClose(); // Close modal after submission
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8 relative transform transition-all duration-300 scale-100 opacity-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Barang</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="kodeBarang" className="block text-sm font-medium text-gray-700 mb-1">
                Kode Barang
              </label>
              <input
                type="text"
                id="kodeBarang"
                name="kodeBarang"
                value={formData.kodeBarang}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="BRG001"
              />
            </div>
            <div>
              <label htmlFor="hargaBeli" className="block text-sm font-medium text-gray-700 mb-1">
                Harga Beli
              </label>
              <input
                type="text"
                id="hargaBeli"
                name="hargaBeli"
                value={formData.hargaBeli}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Rp 50.000"
              />
            </div>
            <div>
              <label htmlFor="namaBarang" className="block text-sm font-medium text-gray-700 mb-1">
                Nama Barang
              </label>
              <input
                type="text"
                id="namaBarang"
                name="namaBarang"
                value={formData.namaBarang}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Helm Safety"
              />
            </div>
            <div>
              <label htmlFor="hargaJual" className="block text-sm font-medium text-gray-700 mb-1">
                Harga Jual
              </label>
              <input
                type="text"
                id="hargaJual"
                name="hargaJual"
                value={formData.hargaJual}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Rp 75.000"
              />
            </div>
            <div>
              <label htmlFor="kategori" className="block text-sm font-medium text-gray-700 mb-1">
                Kategori Barang
              </label>
              <select
                id="kategori"
                name="kategori"
                value={formData.kategori}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
              >
                <option value="">--Pilih Kategori--</option>
                <option value="alat">Alat</option>
                <option value="material">Material</option>
                <option value="elektronik">Elektronik</option>
              </select>
            </div>
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity Barang
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="100"
              />
            </div>
            <div>
              <label htmlFor="noSeri" className="block text-sm font-medium text-gray-700 mb-1">
                No Seri
              </label>
              <input
                type="text"
                id="noSeri"
                name="noSeri"
                value={formData.noSeri}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="SN12345"
              />
            </div>
            <div>
              <label htmlFor="satuan" className="block text-sm font-medium text-gray-700 mb-1">
                Satuan Barang
              </label>
              <select
                id="satuan"
                name="satuan"
                value={formData.satuan}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
              >
                <option value="">--Pilih Satuan--</option>
                <option value="pcs">Pcs</option>
                <option value="kg">KG</option>
                <option value="buah">Buah</option>
                <option value="pasang">Pasang</option>
              </select>
            </div>
            <div className="col-span-1 md:col-span-2">
              <label htmlFor="masaExpired" className="block text-sm font-medium text-gray-700 mb-1">
                Masa Expired Barang
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="masaExpired"
                  name="masaExpired"
                  value={formData.masaExpired}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-10"
                  placeholder="dd/mm/yyyy"
                />
                <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Barang Active</label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="barangActive"
                    value="active"
                    checked={formData.barangActive === 'active'}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Active</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="barangActive"
                    value="non-active"
                    checked={formData.barangActive === 'non-active'}
                    onChange={handleChange}
                    className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Non Active</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition-colors duration-200"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TambahBarangModal;
