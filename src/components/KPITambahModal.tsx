import React from 'react';
import { X, CalendarDays } from 'lucide-react';

interface KPITambahModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KPITambahModal: React.FC<KPITambahModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 animate-in fade-in-0 duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 relative animate-in zoom-in-95 duration-300 ease-out">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">KPI Operasional</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body - Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Nama Pegawai */}
          <div>
            <label htmlFor="modalNamaPegawai" className="block text-sm font-medium text-gray-700 mb-2">Nama Pegawai</label>
            <select
              id="modalNamaPegawai"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
            >
              <option>--Pilih Nama Pegawai--</option>
              <option>Pegawai A</option>
              <option>Pegawai B</option>
            </select>
          </div>
          {/* Nama Penilai */}
          <div>
            <label htmlFor="modalNamaPenilai" className="block text-sm font-medium text-gray-700 mb-2">Nama Penilai</label>
            <input
              type="text"
              id="modalNamaPenilai"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
              placeholder="Masukkan Nama Penilai"
            />
          </div>
          {/* NIK */}
          <div>
            <label htmlFor="modalNIK" className="block text-sm font-medium text-gray-700 mb-2">NIK</label>
            <input
              type="text"
              id="modalNIK"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
              placeholder="Masukkan NIK"
            />
          </div>
          {/* Posisi Penilai */}
          <div>
            <label htmlFor="modalPosisiPenilai" className="block text-sm font-medium text-gray-700 mb-2">Posisi Penilai</label>
            <input
              type="text"
              id="modalPosisiPenilai"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
              placeholder="Masukkan Posisi Penilai"
            />
          </div>
          {/* Posisi */}
          <div>
            <label htmlFor="modalPosisi" className="block text-sm font-medium text-gray-700 mb-2">Posisi</label>
            <input
              type="text"
              id="modalPosisi"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
              placeholder="Masukkan Posisi"
            />
          </div>
          {/* Tgl Mulai Kerja */}
          <div>
            <label htmlFor="modalTglMulaiKerja" className="block text-sm font-medium text-gray-700 mb-2">Tgl Mulai Kerja</label>
            <div className="relative">
              <input
                type="text" // Using text for dd/mm/yyyy format, can be type="date" for native picker
                id="modalTglMulaiKerja"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
                placeholder="dd/mm/yyyy"
              />
              <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          {/* Status Pegawai */}
          <div>
            <label htmlFor="modalStatusPegawai" className="block text-sm font-medium text-gray-700 mb-2">Status Pegawai</label>
            <input
              type="text"
              id="modalStatusPegawai"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 bg-gray-50"
              placeholder="Masukkan Status Pegawai"
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
            Lanjut
          </button>
        </div>
      </div>
    </div>
  );
};

export default KPITambahModal;
