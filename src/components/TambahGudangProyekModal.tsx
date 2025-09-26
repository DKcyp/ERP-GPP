import React from 'react';
import { X } from 'lucide-react';

interface TambahGudangProyekModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TambahGudangProyekModal: React.FC<TambahGudangProyekModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-8 relative transform transition-all duration-300 scale-100 opacity-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-200"
        >
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Entry Gudang Proyek</h2>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="noSd" className="block text-sm font-medium text-gray-700 mb-1">No SO</label>
            <select
              id="noSd"
              className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            >
              <option>SO0012</option>
              <option>SO0013</option>
              <option>SO0014</option>
            </select>
          </div>
          <div>
            <label htmlFor="namaGudang" className="block text-sm font-medium text-gray-700 mb-1">Nama Gudang</label>
            <input
              type="text"
              id="namaGudang"
              className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Masukkan nama gudang"
            />
          </div>
          <div>
            <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
            <input
              type="text"
              id="serialNumber"
              className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Contoh: GDG-JKT-001"
            />
          </div>
          <div>
            <label htmlFor="lokasiGudang" className="block text-sm font-medium text-gray-700 mb-1">Lokasi Gudang</label>
            <input
              type="text"
              id="lokasiGudang"
              className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Masukkan lokasi gudang"
            />
          </div>
          <div>
            <label htmlFor="pic" className="block text-sm font-medium text-gray-700 mb-1">PIC</label>
            <input
              type="text"
              id="pic"
              className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Masukkan nama PIC"
            />
          </div>
          <div>
            <label htmlFor="kontakPic" className="block text-sm font-medium text-gray-700 mb-1">Kontak PIC</label>
            <input
              type="text"
              id="kontakPic"
              className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Contoh: 08123456789"
            />
          </div>
          <div>
            <label htmlFor="soTurunan" className="block text-sm font-medium text-gray-700 mb-1">SO Turunan</label>
            <input
              type="text"
              id="soTurunan"
              className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Masukkan SO turunan"
            />
          </div>
          <div className="col-span-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status Gudang</label>
            <div className="flex items-center space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="statusGudang"
                  value="Aktif"
                  className="form-radio h-4 w-4 text-blue-600 transition-colors duration-200"
                  defaultChecked
                />
                <span className="ml-2 text-gray-700">Aktif</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="statusGudang"
                  value="Non Aktif"
                  className="form-radio h-4 w-4 text-blue-600 transition-colors duration-200"
                />
                <span className="ml-2 text-gray-700">Non Aktif</span>
              </label>
            </div>
          </div>
          <div className="col-span-full">
            <label htmlFor="catatan" className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
            <textarea
              id="catatan"
              rows={3}
              className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            ></textarea>
          </div>
        </form>

        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400 transition-colors duration-200 text-sm shadow-md"
          >
            Kembali
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 text-sm shadow-md"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default TambahGudangProyekModal;
