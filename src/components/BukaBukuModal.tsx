import React from 'react';
import { X, Unlock } from 'lucide-react';

interface BukaBukuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BukaBukuModal: React.FC<BukaBukuModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-300 scale-100 opacity-100">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Konfirmasi Buka Buku</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-700 mb-6">
            Anda akan membuka kembali buku. Pastikan semua proses tutup buku sebelumnya telah selesai.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose} // Tombol ini hanya akan menutup modal, sesuai permintaan
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              <Unlock className="h-5 w-5 mr-2" /> Ya, Buka Buku
            </button>
            <button
              onClick={onClose} // Tombol Batal juga hanya menutup modal
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BukaBukuModal;
