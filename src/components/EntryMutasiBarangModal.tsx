import React from 'react';
import { X, CalendarDays, UploadCloud, Plus, Trash2 } from 'lucide-react';

interface EntryMutasiBarangModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EntryMutasiBarangModal: React.FC<EntryMutasiBarangModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const modalBarangItems = [
    { kode: 'BRG001', nama: 'Besi Beton', satuan: 'Batang', jumlah: 5 },
    { kode: 'BRG002', nama: 'Semen Portland', satuan: 'Sak', jumlah: 2 },
  ];

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Entry Mutasi Barang</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 space-y-6">
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="noMutasi" className="block text-sm font-medium text-gray-700 mb-1">No Mutasi</label>
              <input
                type="text"
                id="noMutasi"
                className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
                defaultValue="MT-202536"
                readOnly
              />
            </div>
            <div>
              <label htmlFor="gudangAsal" className="block text-sm font-medium text-gray-700 mb-1">Gudang Asal</label>
              <select
                id="gudangAsal"
                className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option>Gudang Pusat</option>
                <option>Gudang Proyek A</option>
                <option>Gudang Proyek B</option>
              </select>
            </div>
            <div>
              <label htmlFor="gudangTujuan" className="block text-sm font-medium text-gray-700 mb-1">Gudang Tujuan</label>
              <select
                id="gudangTujuan"
                className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option>Gudang Pusat</option>
                <option>Gudang Proyek A</option>
                <option>Gudang Proyek B</option>
              </select>
            </div>
            <div className="relative">
              <label htmlFor="tanggalMutasi" className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mutasi</label>
              <input
                type="date"
                id="tanggalMutasi"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                defaultValue={new Date().toISOString().split('T')[0]}
              />
              <CalendarDays className="absolute left-3 top-1/2 transform translate-y-1/4 text-gray-400 h-5 w-5" />
            </div>
            <div className="md:col-span-1">
              <label htmlFor="catatan" className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
              <textarea
                id="catatan"
                rows={3}
                className="px-4 py-2 border border-gray-300 rounded-xl w-full focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Tambahkan catatan..."
              ></textarea>
            </div>
            <div className="md:col-span-1">
              <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 mb-1">Attachment</label>
              <div className="flex items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                <input id="attachment" type="file" className="hidden" />
                <label htmlFor="attachment" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                  <UploadCloud className="w-8 h-8 text-gray-400" />
                  <p className="text-sm text-gray-500">Drag & Drop your files or <span className="font-semibold text-blue-600">Browse</span></p>
                </label>
              </div>
            </div>
          </div>

          {/* Barang Table */}
          <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode barang</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Barang</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Satuan Barang</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Mutasi</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hapus</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {modalBarangItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.kode}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.nama}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{item.satuan}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      <input type="number" defaultValue={item.jumlah} className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm" />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <button className="text-red-600 hover:text-red-900 transition-colors duration-200 p-1 rounded-full hover:bg-red-100">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 text-sm shadow-md">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="flex justify-end p-6 border-t border-gray-200 space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400 transition-colors duration-200 text-sm shadow-md"
          >
            Kembali
          </button>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 text-sm shadow-md"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntryMutasiBarangModal;
