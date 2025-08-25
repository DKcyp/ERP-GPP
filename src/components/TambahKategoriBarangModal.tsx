import React from 'react';

interface TambahKategoriBarangModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TambahKategoriBarangModal: React.FC<TambahKategoriBarangModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 transform transition-all duration-300 scale-95">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Entry Kategori Barang</h3>
        <div className="space-y-5">
          <div>
            <label htmlFor="kodeKategori" className="block text-sm font-medium text-gray-700 mb-2">
              Kode Kategori
            </label>
            <input
              type="text"
              id="kodeKategori"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Masukkan Kode Kategori"
            />
          </div>
          <div>
            <label htmlFor="namaKategori" className="block text-sm font-medium text-gray-700 mb-2">
              Nama Kategori
            </label>
            <input
              type="text"
              id="namaKategori"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Masukkan Nama Kategori"
            />
          </div>
        </div>
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            Close
          </button>
          <button
            className="px-6 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default TambahKategoriBarangModal;
