import React from 'react';
import { X } from 'lucide-react';

interface IndikatorTambahModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const IndikatorTambahModal: React.FC<IndikatorTambahModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-in zoom-in-95 duration-300 ease-out">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Tambah Indikator</h3> {/* Changed title to be more specific */}
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body - Form */}
        <div className="space-y-6 mb-8">
          {/* Nama */}
          <div>
            <label htmlFor="modalNama" className="block text-sm font-medium text-gray-700 mb-2">Nama</label>
            <input
              type="text"
              id="modalNama"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
              placeholder="Masukkan Nama"
            />
          </div>
          {/* Departemen */}
          <div>
            <label htmlFor="modalDepartemen" className="block text-sm font-medium text-gray-700 mb-2">Departemen</label>
            <input
              type="text"
              id="modalDepartemen"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
              placeholder="Masukkan Departemen"
            />
          </div>
          {/* Atasan */}
          <div>
            <label htmlFor="modalAtasan" className="block text-sm font-medium text-gray-700 mb-2">Atasan</label>
            <input
              type="text"
              id="modalAtasan"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
              placeholder="Masukkan Atasan"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-300"
          >
            Close
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-xl shadow-md hover:bg-blue-700 transition-colors duration-300">
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndikatorTambahModal;
