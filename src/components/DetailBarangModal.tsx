import React from 'react';
import { X, Package } from 'lucide-react';

interface DetailItem {
  id: string;
  namaBarang: string;
  jumlah: number;
  dikembalikan: number;
}

interface DetailBarangModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: DetailItem[];
  noSO: string;
}

const DetailBarangModal: React.FC<DetailBarangModalProps> = ({ isOpen, onClose, items, noSO }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Detail Barang</h2>
              <p className="text-sm text-gray-500">untuk No. SO: {noSO}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Barang</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Dikembalikan</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.length > 0 ? (
                  items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.namaBarang}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{item.jumlah}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">{item.dikembalikan}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-10 text-gray-500">
                      Tidak ada detail barang untuk ditampilkan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailBarangModal;
